// Cloudflare Worker for Stripe Payment Processing
// Simple, reliable payment handler for digital products and cart checkout

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    try {
      const body = await request.json();
      const STRIPE_KEY = env.STRIPE_SECRET_KEY;

      if (!STRIPE_KEY) {
        return new Response(JSON.stringify({ error: 'Stripe not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Digital product payment
      if (body.paymentMethodId && body.amount && body.product) {
        const piRes = await fetch('https://api.stripe.com/v1/payment_intents', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${STRIPE_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `amount=${body.amount}&currency=usd&payment_method=${body.paymentMethodId}&confirm=true&receipt_email=${body.email}`,
        });

        const pi = await piRes.json();

        if (!piRes.ok) {
          return new Response(JSON.stringify({ error: pi.error?.message || 'Payment failed' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        if (pi.status === 'succeeded') {
          return new Response(JSON.stringify({ success: true, status: 'succeeded' }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        if (pi.status === 'requires_action') {
          return new Response(JSON.stringify({ requiresAction: true, clientSecret: pi.client_secret }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ success: false, status: pi.status }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Cart checkout
      if (body.cart && Array.isArray(body.cart)) {
        const lineItems = body.cart.map((item, i) => ({
          [`line_items[${i}][price_data][currency]`]: 'usd',
          [`line_items[${i}][price_data][product_data][name]`]: item.name,
          [`line_items[${i}][price_data][unit_amount]`]: item.price,
          [`line_items[${i}][quantity]`]: item.quantity || 1,
        }));

        const params = new URLSearchParams({
          'mode': 'payment',
          'success_url': 'https://elizabethsbakedgoods.com?checkout=success',
          'cancel_url': 'https://elizabethsbakedgoods.com?checkout=cancel',
        });

        lineItems.forEach(item => {
          Object.entries(item).forEach(([k, v]) => params.append(k, v));
        });

        const sessRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${STRIPE_KEY}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params.toString(),
        });

        const sess = await sessRes.json();

        if (!sessRes.ok) {
          return new Response(JSON.stringify({ error: sess.error?.message || 'Session failed' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ url: sess.url }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message || error.toString() }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};

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
