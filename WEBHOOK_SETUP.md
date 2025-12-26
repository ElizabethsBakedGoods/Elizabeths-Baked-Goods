# Stripe Webhook Setup for Digital Product Delivery

## Overview
When a customer completes payment via the Stripe Payment Link, Stripe will call a webhook endpoint we create. The webhook will:
1. Verify the payment was successful
2. Extract the customer email
3. Send them an email with the download link to their digital product

## Setup Steps

### Step 1: Deploy the Webhook Worker

You have two options:

#### Option A: Create a New Worker in Cloudflare (Recommended)

1. Go to https://dash.cloudflare.com
2. Click **Workers & Pages**
3. Click **Create Application**
4. Choose **Create a Worker**
5. Name it: `elizabeths-webhook`
6. Paste the code from `serverless/stripe-webhook.js` into the editor
7. Deploy it
8. Copy the worker URL (it will look like `https://elizabeths-webhook.yourname.workers.dev`)
9. Save this URL - you'll need it for Stripe

#### Option B: Use Same Worker (Alternative)

If you want to add the webhook to your existing `elizabeths-checkout` worker, modify `serverless/cloudflare-worker.js` to handle both routes.

### Step 2: Add Environment Variables to Cloudflare Worker

In the Cloudflare Dashboard for the webhook worker:

1. Go to **Settings** → **Variables**
2. Add these environment variables:

| Name | Value |
|------|-------|
| `STRIPE_SECRET_KEY` | Your Stripe Secret Key (sk_live_...) |
| `STRIPE_WEBHOOK_SECRET` | Leave blank for now (you'll get this from Stripe) |
| `FORMSPREE_ENDPOINT` | https://formspree.io/f/mgvpvzkz |

### Step 3: Configure Webhook in Stripe Dashboard

1. Go to https://dashboard.stripe.com
2. Click **Developers** → **Webhooks**
3. Click **Add Endpoint**
4. In **Endpoint URL**, paste your worker URL from Step 1 (e.g., `https://elizabeths-webhook.yourname.workers.dev`)
5. In **Events to send**, select:
   - **checkout.session.completed** (this is the key one)
6. Click **Add Endpoint**
7. You should see the webhook created with a signing secret
8. Click on the webhook to see its details
9. Copy the **Signing Secret** (starts with `whsec_`)

### Step 4: Add Webhook Secret to Cloudflare

1. Go back to Cloudflare Dashboard
2. Go to your webhook worker's **Settings** → **Variables**
3. Update the `STRIPE_WEBHOOK_SECRET` variable with the signing secret you copied from Stripe
4. Click **Save/Deploy**

### Step 5: Test the Webhook

1. Go to your Stripe Dashboard Webhooks page
2. Find your webhook
3. Scroll down to **Events sent** and look for recent test events
4. You should see `checkout.session.completed` events
5. Try making a test payment on the product page
6. Check if you receive the download email

## How It Works

```
Customer Payment Flow:
├─ Customer clicks "Buy Now"
├─ Redirects to Stripe Payment Link
├─ Customer enters payment info
├─ Payment completes
│
├─ Stripe sends webhook event to your worker
├─ Worker verifies signature with STRIPE_WEBHOOK_SECRET
├─ Worker extracts customer email
├─ Worker sends download email via Formspree
│
└─ Customer receives email with download link ✅
```

## Troubleshooting

### "Webhook signature verification failed"
- Make sure `STRIPE_WEBHOOK_SECRET` is correctly set in Cloudflare
- The secret should start with `whsec_`

### "No customer email found"
- Stripe Payment Link must be collecting email
- Customer must complete the email field before payment

### Customer not receiving email
- Check spam/junk folder
- Make sure Formspree endpoint is correct: `https://formspree.io/f/mgvpvzkz`
- Check Cloudflare worker logs for errors

### How to Check Logs
1. Go to Cloudflare Dashboard
2. Find your webhook worker
3. Click **Real-time Logs**
4. Make a test payment
5. Watch the logs for messages

## Adding More Digital Products

To add more products to auto-email:

In `serverless/stripe-webhook.js`, find this section:
```javascript
for (const item of lineItems.data) {
  if (item.price?.id === 'price_1QLOqJAKipJWOAbPiR6P6bS7') {
    productName = 'Outside Bakery Coloring Page'
    productDownloadUrl = 'https://elizabethsbakedgoods.com/images/outsidebakery.png'
    break
  }
}
```

Add more conditions:
```javascript
if (item.price?.id === 'price_ID_HERE') {
  productName = 'Product Name'
  productDownloadUrl = 'https://elizabethsbakedgoods.com/path/to/file.png'
  break
}
```

Get the price ID from Stripe Dashboard → Products → Click product → Copy the price ID.

## Files

- `serverless/stripe-webhook.js` - Webhook handler (deploy to Cloudflare)
- `product-outsidebakery.html` - Uses Stripe Payment Link (no changes needed)

## Security Notes

- ✅ Webhook signature is verified (prevents spam)
- ✅ Email is only sent for successful payments
- ✅ Download link is public but obscure (URL-based access)
- ✅ Stripe webhook secret is kept in Cloudflare (not in code)
