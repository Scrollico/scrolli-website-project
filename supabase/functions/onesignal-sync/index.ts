import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface WebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  schema: string
  record: {
    id?: string
    email?: string
    briefing_preferences?: string[] | null
    onesignal_player_id?: string | null
    is_active?: boolean | null
    newsletter_subscribed?: boolean | null
  } | null
  old_record: {
    id?: string
    email?: string
    briefing_preferences?: string[] | null
    newsletter_subscribed?: boolean | null
  } | null
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: WebhookPayload = await req.json()
    const { type, table, record, old_record } = payload

    // Only process INSERT and UPDATE events
    if (type === 'DELETE' || !record) {
      return new Response(JSON.stringify({ message: 'Skipped DELETE event' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Initialize Supabase Admin Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

    // Get OneSignal credentials
    const onesignalAppId = Deno.env.get('ONESIGNAL_APP_ID')
    const onesignalRestApiKey = Deno.env.get('ONESIGNAL_REST_API_KEY')

    if (!onesignalAppId || !onesignalRestApiKey) {
      console.warn('OneSignal credentials not configured, skipping sync')
      return new Response(JSON.stringify({ message: 'OneSignal not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    let email: string | null = null
    let briefingPreferences: string[] = []
    let onesignalPlayerId: string | null = null

    // Handle newsletter_subscribers table
    if (table === 'newsletter_subscribers') {
      email = record.email || null
      briefingPreferences = (record.briefing_preferences as string[]) || []
      onesignalPlayerId = record.onesignal_player_id || null

      if (!email) {
        return new Response(JSON.stringify({ error: 'No email found in record' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      // Skip if not active
      if (record.is_active === false) {
        return new Response(JSON.stringify({ message: 'Subscriber is inactive, skipping sync' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }
    }
    // Handle profiles table (when newsletter_subscribed changes)
    else if (table === 'profiles') {
      // Only sync if newsletter_subscribed changed to true
      if (record.newsletter_subscribed === true && old_record?.newsletter_subscribed !== true) {
        // Fetch the subscriber record to get email and briefing preferences
        const { data: subscriber } = await supabaseAdmin
          .from('newsletter_subscribers')
          .select('email, briefing_preferences, onesignal_player_id')
          .eq('email', record.email || '')
          .single()

        if (subscriber) {
          email = subscriber.email
          briefingPreferences = (subscriber.briefing_preferences as string[]) || []
          onesignalPlayerId = subscriber.onesignal_player_id || null
        } else {
          // If no subscriber record exists, skip
          return new Response(JSON.stringify({ message: 'No subscriber record found' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          })
        }
      } else {
        // Newsletter subscription not changed or set to false, skip
        return new Response(JSON.stringify({ message: 'Newsletter subscription unchanged' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
      }
    } else {
      return new Response(JSON.stringify({ message: `Unknown table: ${table}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    if (!email) {
      return new Response(JSON.stringify({ error: 'No email found' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Build OneSignal tags from briefing preferences
    const onesignalTags: Record<string, boolean | string> = {
      source: 'website',
      subscribed_at: new Date().toISOString(),
    }

    // Add tags for each briefing type
    const allBriefingIds = ['ana-bulten', 'gundem-ozeti', 'is-dunyasi', 'teknoloji']
    allBriefingIds.forEach((briefingId) => {
      onesignalTags[`briefing_${briefingId}`] = briefingPreferences.includes(briefingId)
    })

    // Sync with OneSignal
    try {
      if (onesignalPlayerId) {
        // Update existing player
        const updateResponse = await fetch(`https://onesignal.com/api/v1/players/${onesignalPlayerId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Basic ${onesignalRestApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            app_id: onesignalAppId,
            email: email,
            external_user_id: email,
            device_type: 11, // 11 = Email
            identifier: email, // Required for email device type
            tags: onesignalTags,
          }),
        })

        if (updateResponse.ok) {
          const updateData = await updateResponse.json()
          console.log('OneSignal player updated:', updateData.id)

          // Update sync timestamp in database
          await supabaseAdmin
            .from('newsletter_subscribers')
            .update({
              onesignal_synced_at: new Date().toISOString(),
            })
            .eq('email', email)
        } else {
          const errorText = await updateResponse.text()
          console.error('Failed to update OneSignal player:', errorText)
          throw new Error(`OneSignal update failed: ${errorText}`)
        }
      } else {
        // Create new player
        const createResponse = await fetch('https://onesignal.com/api/v1/players', {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${onesignalRestApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            app_id: onesignalAppId,
            email: email,
            external_user_id: email,
            device_type: 11, // 11 = Email
            identifier: email, // Required for email device type
            tags: onesignalTags,
          }),
        })

        if (createResponse.ok) {
          const createData = await createResponse.json()
          const newPlayerId = createData.id
          console.log('OneSignal player created:', newPlayerId)

          // Update database with OneSignal player ID
          await supabaseAdmin
            .from('newsletter_subscribers')
            .update({
              onesignal_player_id: newPlayerId,
              onesignal_synced_at: new Date().toISOString(),
            })
            .eq('email', email)
        } else {
          const errorText = await createResponse.text()
          console.error('Failed to create OneSignal player:', errorText)
          throw new Error(`OneSignal create failed: ${errorText}`)
        }
      }
    } catch (onesignalError) {
      console.error('OneSignal sync error:', onesignalError)
      // Don't fail the webhook - log error for retry
      return new Response(JSON.stringify({ 
        error: 'OneSignal sync failed',
        message: onesignalError instanceof Error ? onesignalError.message : 'Unknown error'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Synced to OneSignal successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Function error:', errorMessage)
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
