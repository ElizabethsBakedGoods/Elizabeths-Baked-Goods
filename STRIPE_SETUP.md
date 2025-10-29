# Stripe Checkout Setup Instructions

Your site now has a shopping cart with dynamic shipping rates! Follow these steps to complete the setup:

## Step 1: Get Your Stripe Publishable Key

1. Log in to your Stripe Dashboard: https://dashboard.stripe.com/
2. Make sure you're in **LIVE MODE** (toggle in the top right)
3. Click **Developers** → **API keys**
4. Copy your **Publishable key** (starts with `pk_live_...`)
5. Open `main.js` and replace `YOUR_STRIPE_PUBLISHABLE_KEY_HERE` with your actual key

## Step 2: Create Shipping Rates in Stripe

You need to create TWO shipping rates in your Stripe account:

### Flat Rate Shipping ($8)
1. Go to https://dashboard.stripe.com/settings/shipping-rates
2. Click **+ New** to create a new shipping rate
3. Fill in:
   - **Display name**: Standard Shipping
   - **Price**: $8.00 USD
   - **Delivery estimate**: 3-5 business days (or your timeframe)
   - **Type**: Fixed amount
4. Click **Create shipping rate**
5. **Copy the Shipping Rate ID** (starts with `shr_...`)
6. In `main.js`, replace `shr_FLAT_RATE_8_ID` with this ID

### Free Shipping ($0)
1. Click **+ New** again
2. Fill in:
   - **Display name**: Free Shipping
   - **Price**: $0.00 USD
   - **Delivery estimate**: 3-5 business days
   - **Type**: Fixed amount
3. Click **Create shipping rate**
4. **Copy the Shipping Rate ID** (starts with `shr_...`)
5. In `main.js`, replace `shr_FREE_SHIPPING_ID` with this ID

## Step 3: How It Works

- **$25 Minimum**: Customers must have at least $25 in their cart to checkout
- **Under $60**: Charged $8 flat rate shipping
- **$60 or more**: Automatically gets FREE shipping
- Cart dynamically calculates which rate to apply at checkout

## Step 4: Test Your Setup

1. Save all your changes and push to GitHub
2. Visit your live site
3. Try adding items to cart and clicking "Proceed to Checkout"
4. Verify:
   - Can't checkout with less than $25
   - Orders under $60 show $8 shipping
   - Orders $60+ show free shipping

## Important Notes

- Make sure you're using **LIVE MODE** keys and shipping rates (not test mode)
- The old payment links are replaced with the new cart system
- The Formspree form is still available for custom inquiries
- Customers can now order multiple items in one transaction

## Need Help?

If you have any issues:
1. Check the browser console for errors (F12)
2. Verify your Stripe keys are correct
3. Confirm shipping rate IDs match your Stripe dashboard
4. Make sure you're in live mode, not test mode
