import Stripe from 'stripe'

// Webhook handler for Stripe events
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

    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    try {
      const body = await request.text()
      const signature = request.headers.get('stripe-signature')

      if (!signature) {
        return new Response(
          JSON.stringify({ error: 'No signature' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }

      if (!env.STRIPE_WEBHOOK_SECRET) {
        console.error('STRIPE_WEBHOOK_SECRET not configured')
        return new Response(
          JSON.stringify({ error: 'Webhook not configured' }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }

      // Verify webhook signature
      const stripe = new Stripe(env.STRIPE_SECRET_KEY)
      let event

      try {
        event = await stripe.webhooks.constructEventAsync(
          body,
          signature,
          env.STRIPE_WEBHOOK_SECRET
        )
      } catch (err) {
        console.error('Webhook signature verification failed:', err.message)
        return new Response(
          JSON.stringify({ error: 'Signature verification failed' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }

      // Handle checkout.session.completed event
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object
        
        // Get customer email from session
        const customerEmail = session.customer_details?.email || session.customer_email
        
        if (!customerEmail) {
          console.error('No customer email found in session')
          return new Response(
            JSON.stringify({ error: 'No customer email' }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          )
        }

        // Get line items to determine which product was purchased
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id)
        
        console.log('Payment completed for:', customerEmail)
        console.log('Line items:', lineItems.data)

        // Determine which digital product to send based on line items
        let productDownloadUrl = null
        let productName = null

        for (const item of lineItems.data) {
          // Check if this is the Outside Bakery Coloring Page (price_1QLOqJAKipJWOAbPiR6P6bS7)
          if (item.price?.id === 'price_1QLOqJAKipJWOAbPiR6P6bS7') {
            productName = 'Outside Bakery Coloring Page'
            productDownloadUrl = 'https://elizabethsbakedgoods.com/images/outsidebakery.png'
            break
          }
        }

        // If we found a matching digital product, send the download email
        if (productDownloadUrl && productName && env.FORMSPREE_ENDPOINT) {
          try {
            await sendDownloadEmail(customerEmail, productName, productDownloadUrl, env.FORMSPREE_ENDPOINT)
            console.log('Download email sent to:', customerEmail)
          } catch (emailErr) {
            console.error('Failed to send download email:', emailErr.message)
            // Don't fail the webhook - payment already succeeded
          }
        }

        return new Response(
          JSON.stringify({ success: true, received: true }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          }
        )
      }

      // Return success for other event types
      return new Response(
        JSON.stringify({ received: true }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    } catch (error) {
      console.error('Webhook error:', error.message)
      return new Response(
        JSON.stringify({ error: error.message || 'Webhook failed' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }
  },
}

// Send download email via Formspree
async function sendDownloadEmail(customerEmail, productName, downloadUrl, formspreeEndpoint) {
  const emailBody = `
Hello,

Thank you for your purchase of "${productName}"!

Your digital product is ready to download:
${downloadUrl}

You can also download it by right-clicking the link and selecting "Save as..." or "Save link as..."

If you have any issues with your download, please reply to this email.

Best regards,
Elizabeth's Baked Goods
  `.trim()

  const response = await fetch(formspreeEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      subject: `Your Download: ${productName}`,
      message: emailBody,
      _replyto: customerEmail,
      _to: customerEmail,
    }),
  })

  if (!response.ok) {
    throw new Error(`Email service returned ${response.status}`)
  }

  return response.json()
}
