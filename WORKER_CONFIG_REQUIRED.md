# Critical: Worker Configuration Required

## Issue
The Cloudflare Worker returns a 500 error because `STRIPE_SECRET_KEY` is not configured in the Cloudflare Dashboard.

## Solution
You MUST add your Stripe Secret Key to the Cloudflare Worker environment:

### Steps:
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Go to **Workers** → Find your worker: `elizabeths-checkout`
3. Click on the worker name
4. Go to **Settings** → **Variables**
5. Add an environment variable:
   - **Variable name:** `STRIPE_SECRET_KEY`
   - **Value:** Your Stripe Secret Key (starts with `sk_live_`)
6. Save/Deploy

### To Find Your Stripe Secret Key:
1. Log in to [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to **Developers** → **API Keys**
3. Copy the **Secret Key** (starts with `sk_live_` for live mode)
4. Paste it into the Cloudflare Worker environment variable

## What Changed

### Frontend (product-outsidebakery.html)
- ✅ Simplified to single-product checkout with `{ priceId }` only
- ✅ Wrapped event listeners in proper `DOMContentLoaded` handler
- ✅ Added defensive null checks before DOM access

### Worker (serverless/cloudflare-worker.js)
- ✅ Updated to handle BOTH `priceId` (digital products) AND `cart` (regular products)
- When `priceId` is sent → Creates session with single price
- When `cart` is sent → Creates session with multiple items + shipping

## Testing

Once you set the `STRIPE_SECRET_KEY` in Cloudflare:

1. Open browser DevTools console
2. Navigate to `https://elizabethsbakedgoods.com/product-outsidebakery.html`
3. Click "Buy Now - $1.00"
4. Should see console logs:
   - ✅ `"Sending: {\"priceId\":\"price_1QLOqJAKipJWOAbPiR6P6bS7\"}"`
   - ✅ `"Response status: 200"`
   - ✅ Redirect to Stripe Checkout

If you still get a 500 error, check:
1. Is the `STRIPE_SECRET_KEY` actually set in Cloudflare?
2. Is it the correct Stripe Secret Key (not Public Key)?
3. Is it in **live** mode or **test** mode? (Must match your session mode)

## Files Modified
1. `product-outsidebakery.html` - Cleaned up script, DOMContentLoaded wrapper, defensive checks
2. `serverless/cloudflare-worker.js` - Added `priceId` handling
3. `main.js` - Added defensive checks to array operations (for cart pages)
