import Stripe from 'stripe'

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }

    // Only accept POST
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    }

    try {
      // Parse request body
      const body = await request.json()
      const { priceId } = body

      // Validate priceId
      if (!priceId) {
        return new Response(
          JSON.stringify({ error: 'priceId is required' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        )
      }

      // Validate Stripe key
      if (!env.STRIPE_SECRET_KEY) {
        console.error('STRIPE_SECRET_KEY not configured')
        return new Response(
          JSON.stringify({ error: 'Server configuration error' }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        )
      }

      // Initialize Stripe and create session
      const stripe = new Stripe(env.STRIPE_SECRET_KEY)
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: 'https://elizabethsbakedgoods.com/success.html',
        cancel_url: 'https://elizabethsbakedgoods.com/designs.html',
      })

      return new Response(
        JSON.stringify({ url: session.url }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    } catch (error) {
      // Log full error details
      console.error('Checkout error:', error.message)
      console.error('Error type:', error.constructor.name)
      console.error('Stack trace:', error.stack)

      return new Response(
        JSON.stringify({
          error: error.message || 'Checkout failed',
          type: error.constructor.name,
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
