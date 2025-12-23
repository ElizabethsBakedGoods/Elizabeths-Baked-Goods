import Stripe from 'stripe'

export default {
  async fetch(request, env) {
    try {
      const stripe = new Stripe(env.STRIPE_SECRET_KEY)
      const body = await request.json()

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

      return new Response(
        JSON.stringify({ url: session.url }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    } catch (err) {
      return new Response(
        JSON.stringify({
          error: err.message || String(err),
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
