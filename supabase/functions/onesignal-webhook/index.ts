import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OneSignalWebhookPayload {
  event: {
    type: string
    timestamp: number
    data: {
      player_id?: string
      email?: string
      external_user_id?: string
      [key: string]: unknown
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: OneSignalWebhookPayload = await req.json()
    const { event } = payload

    if (!event || !event.type) {
      return new Response(JSON.stringify({ error: 'Invalid webhook payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Initialize Supabase Admin Client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      throw new Error('Missing Supabase configuration')
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)

    // Extract email from webhook payload
    // OneSignal may send email directly or via external_user_id
    const email = event.data.email || event.data.external_user_id || null
    const playerId = event.data.player_id || null

    if (!email) {
      console.warn('No email found in OneSignal webhook payload')
      return new Response(JSON.stringify({ message: 'No email found, skipping' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // Handle different event types
    switch (event.type) {
      case 'email.unsubscribed':
      case 'email.bounced':
      case 'email.spam_complaint':
        // Deactivate subscriber
        console.log(`Deactivating subscriber due to ${event.type}:`, email)

        // Update newsletter_subscribers table
        const { error: subscriberError } = await supabaseAdmin
          .from('newsletter_subscribers')
          .update({
            is_active: false,
            updated_at: new Date().toISOString(),
          })
          .eq('email', email)

        if (subscriberError) {
          console.error('Error updating newsletter_subscribers:', subscriberError)
        }

        // Update profiles table if user exists
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('email', email)
          .single()

        if (profile) {
          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .update({
              newsletter_subscribed: false,
              updated_at: new Date().toISOString(),
            })
            .eq('id', profile.id)

          if (profileError) {
            console.error('Error updating profile:', profileError)
          }
        }

        return new Response(JSON.stringify({ 
          success: true, 
          message: `Subscriber deactivated due to ${event.type}` 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })

      case 'email.subscribed':
        // Reactivate subscriber if they resubscribe
        console.log('Reactivating subscriber:', email)

        const { error: reactivateError } = await supabaseAdmin
          .from('newsletter_subscribers')
          .update({
            is_active: true,
            updated_at: new Date().toISOString(),
          })
          .eq('email', email)

        if (reactivateError) {
          console.error('Error reactivating subscriber:', reactivateError)
        }

        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Subscriber reactivated' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })

      default:
        console.log(`Unhandled OneSignal event type: ${event.type}`)
        return new Response(JSON.stringify({ 
          message: `Event type ${event.type} not handled` 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        })
    }

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Function error:', errorMessage)
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
