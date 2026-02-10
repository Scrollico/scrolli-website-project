import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SubscribeRequest {
  email: string
  briefings?: string[] // Array of briefing IDs (e.g., ['ana-bulten', 'gundem-ozeti'])
  userId?: string // Optional: authenticated user ID
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, briefings = [], userId }: SubscribeRequest = await req.json()

    // 1. Validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Validate briefings array
    if (!Array.isArray(briefings)) {
      return new Response(JSON.stringify({ error: 'Briefings must be an array' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 2. Initialize Supabase Admin Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

    // 3. Check if subscriber already exists
    const { data: existingSubscriber } = await supabaseAdmin
      .from('newsletter_subscribers')
      .select('id, onesignal_player_id, briefing_preferences')
      .eq('email', email)
      .single()

    // 4. Prepare briefing preferences (merge with existing if updating)
    const existingBriefings = existingSubscriber?.briefing_preferences as string[] || []
    // Always merge: combine existing with new briefings, remove duplicates
    const mergedBriefings = Array.from(new Set([...existingBriefings, ...briefings]))
    // If merged is empty and no existing subscriber, default to first two briefings
    let briefingPreferences = mergedBriefings.length > 0 ? mergedBriefings : (existingSubscriber ? [] : ['ana-bulten', 'gundem-ozeti'])

    // 5. Build OneSignal tags from briefing preferences
    const onesignalTags: Record<string, boolean | string> = {
      source: 'website',
      subscribed_at: new Date().toISOString(),
    }

    // Add tags for each briefing type
    const allBriefingIds = ['ana-bulten', 'gundem-ozeti', 'is-dunyasi', 'teknoloji']
    allBriefingIds.forEach((briefingId) => {
      onesignalTags[`briefing_${briefingId}`] = briefingPreferences.includes(briefingId)
    })

    // 6. Save to Database (Upsert to handle duplicates gracefully)
    const subscriberData: {
      email: string
      source: string
      updated_at: string
      briefing_preferences: string[]
      is_active: boolean
      onesignal_synced_at?: string
    } = {
      email,
      source: 'website',
      updated_at: new Date().toISOString(),
      briefing_preferences: briefingPreferences,
      is_active: true,
    }

    const { data: subscriber, error: dbError } = await supabaseAdmin
      .from('newsletter_subscribers')
      .upsert(subscriberData, { onConflict: 'email' })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      throw dbError
    }

    // 7. If authenticated user, update their profile
    if (userId) {
      await supabaseAdmin
        .from('profiles')
        .update({
          newsletter_subscribed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
    }

    // 8. Sync with OneSignal
    const onesignalAppId = Deno.env.get('ONESIGNAL_APP_ID')
    const onesignalRestApiKey = Deno.env.get('ONESIGNAL_REST_API_KEY')

    if (onesignalAppId && onesignalRestApiKey) {
      try {
        // Check if player already exists (by external_user_id = email)
        const existingPlayerId = existingSubscriber?.onesignal_player_id

        const onesignalPayload: {
          app_id: string
          email: string
          external_user_id: string
          device_type: number
          identifier: string
          tags: Record<string, boolean | string>
        } = {
          app_id: onesignalAppId,
          email: email,
          external_user_id: email, // Use email as external_user_id for easy lookup
          device_type: 11, // 11 = Email (for email-only subscriptions)
          identifier: email, // Required for email device type
          tags: onesignalTags,
        }

        let onesignalPlayerId: string | null = null

        if (existingPlayerId) {
          // Update existing player
          const updateResponse = await fetch(`https://onesignal.com/api/v1/players/${existingPlayerId}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Basic ${onesignalRestApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(onesignalPayload),
          })

          if (updateResponse.ok) {
            const updateData = await updateResponse.json()
            onesignalPlayerId = updateData.id || existingPlayerId
          } else {
            console.warn('Failed to update OneSignal player:', await updateResponse.text())
          }
        } else {
          // Create new player
          const createResponse = await fetch('https://onesignal.com/api/v1/players', {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${onesignalRestApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(onesignalPayload),
          })

          if (createResponse.ok) {
            const createData = await createResponse.json()
            onesignalPlayerId = createData.id
          } else {
            const errorText = await createResponse.text()
            console.warn('Failed to create OneSignal player:', errorText)
          }
        }

        // Update database with OneSignal player ID
        if (onesignalPlayerId) {
          await supabaseAdmin
            .from('newsletter_subscribers')
            .update({
              onesignal_player_id: onesignalPlayerId,
              onesignal_synced_at: new Date().toISOString(),
            })
            .eq('email', email)

          // Also update profile if user is authenticated
          if (userId) {
            await supabaseAdmin
              .from('profiles')
              .update({
                onesignal_player_id: onesignalPlayerId,
              })
              .eq('id', userId)
          }
        }
      } catch (onesignalError) {
        console.error('OneSignal sync error:', onesignalError)
        // Don't fail the subscription if OneSignal fails - webhook will retry
      }
    } else {
      console.warn('OneSignal credentials not configured, skipping OneSignal sync')
    }

    // 4. Send Confirmation Email via Resend (if configured)
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (resendApiKey) {
      try {
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Scrolli <noreply@scrolli.co>', // Update with your verified domain
            to: email,
            subject: 'Scrolli Bülten Aboneliğiniz Onaylandı',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #16a34a;">Scrolli Bültenine Hoş Geldiniz!</h2>
                <p>Merhaba,</p>
                <p>Scrolli bültenine başarıyla abone oldunuz. Size en güncel haberler ve hikayeleri göndermeye devam edeceğiz.</p>
                <p>İyi okumalar!</p>
                <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
                  Bu e-postayı almak istemiyorsanız, lütfen bizimle iletişime geçin.
                </p>
              </div>
            `,
          }),
        })

        if (!emailResponse.ok) {
          const errorData = await emailResponse.json()
          console.warn('Failed to send confirmation email:', errorData)
          // Don't fail the subscription if email fails
        }
      } catch (emailError) {
        console.warn('Error sending confirmation email:', emailError)
        // Don't fail the subscription if email fails
      }
    }

    return new Response(JSON.stringify({ success: true, message: 'Subscribed successfully' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Function error:', errorMessage)
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
