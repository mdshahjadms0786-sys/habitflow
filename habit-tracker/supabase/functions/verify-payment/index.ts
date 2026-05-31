import { serve } from 'https://deno.land/std@0.208.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

serve(async (req) => {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing auth header' }), { status: 401 })
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    )

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const { payment_id, order_id, signature, plan, amount } = await req.json()

    if (!payment_id || !order_id || !signature || !plan || !amount) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 })
    }

    if (!['pro', 'elite'].includes(plan)) {
      return new Response(JSON.stringify({ error: 'Invalid plan' }), { status: 400 })
    }

    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET')
    if (!keySecret) {
      return new Response(JSON.stringify({ error: 'Payment provider not configured' }), { status: 500 })
    }

    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(keySecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    const data = encoder.encode(`${order_id}|${payment_id}`)
    const mac = await crypto.subtle.sign('HMAC', key, data)
    const computedSignature = Array.from(new Uint8Array(mac))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')

    if (computedSignature !== signature) {
      return new Response(JSON.stringify({ error: 'Payment signature verification failed' }), { status: 400 })
    }

    const serviceClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { error: paymentError } = await serviceClient
      .from('payments')
      .insert({
        user_id: user.id,
        payment_id,
        amount,
        plan,
        status: 'completed',
      })

    if (paymentError) {
      return new Response(JSON.stringify({ error: 'Failed to record payment', detail: paymentError.message }), { status: 500 })
    }

    const { error: profileError } = await serviceClient
      .from('user_profiles')
      .upsert({
        id: user.id,
        plan,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' })

    if (profileError) {
      return new Response(JSON.stringify({ error: 'Failed to update plan', detail: profileError.message }), { status: 500 })
    }

    return new Response(JSON.stringify({ success: true, plan }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
