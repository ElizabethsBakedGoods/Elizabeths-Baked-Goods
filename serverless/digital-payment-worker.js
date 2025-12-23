import Stripe from 'stripe'

export default {
  async fetch(request, env) {
    console.log('=== Worker invoked ===')
    console.log('Method:', request.method)
    console.log('URL:', request.url)

    try {
      // Parse request body
      let body
      try {
        body = await request.json()
        console.log('Request body received:', JSON.stringify(body))
      } catch (parseErr) {
        console.error('JSON parse error:', parseErr.message)
        return new Response(
          JSON.stringify({ error: 'Invalid JSON: ' + parseErr.message }),
          { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        )
      }

      // Check Stripe key
      console.log('Checking STRIPE_SECRET_KEY...')
      if (!env.STRIPE_SECRET_KEY) {
        console.error('STRIPE_SECRET_KEY not found in env')
        return new Response(
          JSON.stringify({ error: 'STRIPE_SECRET_KEY not configured' }),
          { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } }
        )
      }
      console.log('STRIPE_SECRET_KEY found')

      // Initialize Stripe
      console.log('Initializing Stripe...')
      const stripe = new Stripe(env.STRIPE_SECRET_KEY)
      console.log('Stripe initialized')

      // Create checkout session
      console.log('Creating checkout session with priceId:', body.priceId)
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price: body.priceId,
            quantity: 1,
          },
        ],
        success_url: 'https://elizabethsbakedgoods.com/success',
        cancel_url: 'https://elizabethsbakedgoods.com/cancel',
      })
      console.log('Session created:', session.id)
      console.log('Session URL:', session.url)

      return new Response(
        JSON.stringify({ url: session.url, sessionId: session.id }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    } catch (err) {
      console.error('=== WORKER ERROR ===')
      console.error('Error type:', err.constructor.name)
      console.error('Error message:', err.message)
      console.error('Error stack:', err.stack)
      console.error('Full error:', JSON.stringify(err))

      return new Response(
        JSON.stringify({
          error: err.message || String(err),
          type: err.constructor.name,
          details: err.toString(),
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    }
  },
}



    <p><a href="${productInfo.url}" style="background: #d93535; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Download Your File</a></p>
    <p><strong>File:</strong> ${productInfo.filename}</p>
    <hr/>
    <p><small>This is an instant digital download. You may download this file at any time from the link above.</small></p>
    <p><small>If you have any questions, please contact us at your earliest convenience.</small></p>
    <p><small>© 2025 Elizabeth's Baked Goods</small></p>
  `;

  // Note: To actually send emails, you would need to integrate with a service like SendGrid, Mailgun, or AWS SES
  // For now, this is a placeholder for email functionality
  console.log('Email would be sent to:', email);
  console.log('Product:', product);
}
