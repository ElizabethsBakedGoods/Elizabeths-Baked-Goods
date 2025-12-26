// Cloudflare Worker for Stripe Checkout Session creation
// Deploy this to Cloudflare Workers and update the endpoint in main.js

export default {
  async fetch(request, env) {
    // Common CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health check to verify connectivity from browser/CLI
    if (request.method === 'GET') {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const body = await request.json();
      const { priceId, cart, shippingRateId } = body;
      
      // You'll need to add your Stripe secret key to Cloudflare Workers environment variables
      const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;
      
      if (!STRIPE_SECRET_KEY) {
        return new Response(JSON.stringify({ error: 'Stripe not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Handle single priceId checkout (digital products)
      if (priceId) {
        const params = {
          'mode': 'payment',
          'success_url': 'https://elizabethsbakedgoods.com/success.html?session_id={CHECKOUT_SESSION_ID}',
          'cancel_url': 'https://elizabethsbakedgoods.com/designs.html',
          'line_items[0][price]': priceId,
          'line_items[0][quantity]': '1',
        };

        const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(params),
        });

        const session = await stripeResponse.json();

        if (!stripeResponse.ok) {
          throw new Error(session.error?.message || 'Failed to create checkout session');
        }

        return new Response(JSON.stringify({ url: session.url }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Handle cart checkout (regular products with shipping)
      if (!cart || !Array.isArray(cart) || cart.length === 0) {
        return new Response(JSON.stringify({ error: 'priceId or cart is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Determine shipping cost - always $8
      const shippingCost = 800; // $8 in cents
      const shippingLabel = 'Standard Shipping';

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
      
      // Add shipping as a line item (always $8)
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: shippingLabel,
          },
          unit_amount: shippingCost,
        },
        quantity: 1,
      });

      // Create Stripe Checkout Session
      const origin = request.headers.get('origin') || 'https://elizabethsbakedgoods.com';
      
      // Build the params object with line items (no shipping options, just items)
      const params = {
        'mode': 'payment',
        'success_url': `${origin}?checkout=success`,
        'cancel_url': `${origin}?checkout=cancel`,
        'phone_number_collection[enabled]': 'true',
      };
      
      // Add line items
      lineItems.forEach((item, i) => {
        params[`line_items[${i}][price_data][currency]`] = item.price_data.currency;
        params[`line_items[${i}][price_data][product_data][name]`] = item.price_data.product_data.name;
        if (item.price_data.product_data.description) {
          params[`line_items[${i}][price_data][product_data][description]`] = item.price_data.product_data.description;
        }
        params[`line_items[${i}][price_data][unit_amount]`] = item.price_data.unit_amount;
        params[`line_items[${i}][quantity]`] = item.quantity;
      });
      
      const stripeResponse = await fetch('https://api.stripe.com/v1/checkout/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(params),
      });

      const session = await stripeResponse.json();

      if (!stripeResponse.ok) {
        throw new Error(session.error?.message || 'Failed to create checkout session');
      }

      return new Response(JSON.stringify({ sessionId: session.id, url: session.url }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};
