// Cloudflare Worker for Stripe Payment Processing
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
      return new Response(JSON.stringify({ error: 'POST only' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    try {
      // Parse request
      let body;
      try {
        body = await request.json();
      } catch (e) {
        return new Response(JSON.stringify({ error: 'Invalid JSON: ' + e.message }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Check Stripe key
      const key = env.STRIPE_SECRET_KEY;
      if (!key) {
        return new Response(JSON.stringify({ error: 'STRIPE_SECRET_KEY not set in environment' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Digital product payment
      if (body.paymentMethodId && body.amount) {
        try {
          const res = await fetch('https://api.stripe.com/v1/payment_intents', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + key,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: 'amount=' + body.amount + '&currency=usd&payment_method=' + body.paymentMethodId + '&confirm=true',
          });

          const data = await res.json();

          if (!res.ok) {
            return new Response(JSON.stringify({ error: data.error?.message || 'Stripe error' }), {
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          if (data.status === 'succeeded') {
            return new Response(JSON.stringify({ success: true, status: 'succeeded' }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          if (data.status === 'requires_action') {
            return new Response(JSON.stringify({ requiresAction: true, clientSecret: data.client_secret }), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          return new Response(JSON.stringify({ success: false, status: data.status }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        } catch (stripeError) {
          return new Response(JSON.stringify({ error: 'Stripe request failed: ' + stripeError.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      return new Response(JSON.stringify({ error: 'Missing paymentMethodId or amount' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: 'Worker error: ' + error.message }), {
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
