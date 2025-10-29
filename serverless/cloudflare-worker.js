// Cloudflare Worker for Stripe Checkout Session creation
// Deploy this to Cloudflare Workers and update the endpoint in main.js

export default {
  async fetch(request, env) {
    // Handle CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const { cart, shippingRateId } = await request.json();
      
      // You'll need to add your Stripe secret key to Cloudflare Workers environment variables
      const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;
      
      if (!STRIPE_SECRET_KEY) {
        return new Response(JSON.stringify({ error: 'Stripe not configured' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // Create line items
      const lineItems = cart.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: `Flavor: ${item.flavor}`,
          },
          unit_amount: item.price,
        },
        quantity: item.quantity || 1,
      }));

      // Create Stripe Checkout Session
      const origin = request.headers.get('origin') || 'https://elizabethsbakedgoods.com';
      const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'mode': 'payment',
          'success_url': `${origin}?checkout=success`,
          'cancel_url': `${origin}?checkout=cancel`,
          'phone_number_collection[enabled]': 'true',
          ...Object.fromEntries(
            lineItems.flatMap((item, i) => [
              [`line_items[${i}][price_data][currency]`, item.price_data.currency],
              [`line_items[${i}][price_data][product_data][name]`, item.price_data.product_data.name],
              [`line_items[${i}][price_data][product_data][description]`, item.price_data.product_data.description],
              [`line_items[${i}][price_data][unit_amount]`, item.price_data.unit_amount],
              [`line_items[${i}][quantity]`, item.quantity],
            ])
          ),
          'shipping_options[0][shipping_rate]': shippingRateId,
        }),
      });

      const session = await stripeResponse.json();

      if (!stripeResponse.ok) {
        throw new Error(session.error?.message || 'Failed to create checkout session');
      }

      return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
  },
};
