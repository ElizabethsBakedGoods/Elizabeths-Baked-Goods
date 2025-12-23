// Cloudflare Worker for Stripe Payment Intent and Digital Products
// Deploy this to Cloudflare Workers for handling digital product payments

export default {
  async fetch(request, env) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    try {
      const body = await request.json();
      const STRIPE_SECRET_KEY = env.STRIPE_SECRET_KEY;

      console.log('Worker received request body:', JSON.stringify(body));
      console.log('STRIPE_SECRET_KEY configured:', !!STRIPE_SECRET_KEY);

      if (!STRIPE_SECRET_KEY) {
        console.error('STRIPE_SECRET_KEY is not configured');
        return new Response(JSON.stringify({ error: 'Stripe not configured' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Handle digital product payment
      if (body.paymentMethodId && body.amount && body.product) {
        return await handleDigitalProductPayment(
          body,
          STRIPE_SECRET_KEY,
          corsHeaders
        );
      }

      // Handle cart checkout (physical products)
      if (body.cart) {
        return await handleCartCheckout(
          body,
          STRIPE_SECRET_KEY,
          corsHeaders,
          request
        );
      }

      return new Response(JSON.stringify({ error: 'Invalid request' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};

async function handleDigitalProductPayment(body, STRIPE_SECRET_KEY, corsHeaders) {
  const { paymentMethodId, email, name, amount, product, productName } = body;

  console.log('handleDigitalProductPayment called with:', { paymentMethodId, email, name, amount, product, productName });

  // Create Payment Intent
  const paymentIntentResponse = await fetch('https://api.stripe.com/v1/payment_intents', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      'amount': amount,
      'currency': 'usd',
      'payment_method': paymentMethodId,
      'confirm': 'true',
      'return_url': 'https://elizabethsbakedgoods.com',
      'metadata[product]': product,
      'metadata[product_name]': productName,
      'metadata[customer_email]': email,
      'metadata[customer_name]': name,
      'receipt_email': email,
      'statement_descriptor': 'ELIZABETHS DESIGNS',
    }),
  });

  const paymentIntent = await paymentIntentResponse.json();

  console.log('Stripe response status:', paymentIntentResponse.status);
  console.log('Stripe response:', JSON.stringify(paymentIntent));

  if (!paymentIntentResponse.ok) {
    console.error('Stripe error:', paymentIntent.error);
    return new Response(JSON.stringify({ error: paymentIntent.error?.message || 'Payment failed' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  // Check if payment succeeded or needs additional action
  if (paymentIntent.status === 'succeeded') {
    // Payment successful - send email with download link
    await sendDownloadEmail(email, name, product, STRIPE_SECRET_KEY);
    
    return new Response(JSON.stringify({
      success: true,
      status: 'succeeded',
      clientSecret: paymentIntent.client_secret,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } else if (paymentIntent.status === 'requires_action') {
    // 3D Secure or other authentication required
    return new Response(JSON.stringify({
      requiresAction: true,
      clientSecret: paymentIntent.client_secret,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({
    success: false,
    status: paymentIntent.status,
    clientSecret: paymentIntent.client_secret,
  }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleCartCheckout(body, STRIPE_SECRET_KEY, corsHeaders, request) {
  const { cart, shippingRateId } = body;

  // Determine shipping cost
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

  // Add shipping as a line item
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
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function sendDownloadEmail(email, name, product, STRIPE_SECRET_KEY) {
  // Map product IDs to download URLs
  const downloadLinks = {
    'outside-bakery-coloring': {
      filename: 'outsidebakery.png',
      title: 'Outside Bakery Coloring Page',
      url: 'https://elizabethsbakedgoods.com/downloads/outsidebakery.png'
    },
    // Add more products here as needed
  };

  const productInfo = downloadLinks[product] || {
    filename: 'file.zip',
    title: 'Your Digital Download',
    url: 'https://elizabethsbakedgoods.com/downloads/default.zip'
  };

  // Email content
  const emailContent = `
    <h2>Thank you for your purchase!</h2>
    <p>Hi ${name},</p>
    <p>Your payment has been processed successfully. Your digital download is ready!</p>
    <h3>${productInfo.title}</h3>
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
