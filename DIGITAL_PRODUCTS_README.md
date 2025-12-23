# Digital Products - Setup & Configuration

## Overview
This documentation covers the digital product system for Elizabeth's Baked Goods, specifically for selling instant digital downloads via Stripe.

## Current Product
- **Outside Bakery Coloring Page** (`product-outsidebakery.html`)
  - Price: $1.00
  - File: outsidebakery.png
  - Type: Digital Download (instant)
  - No shipping required

## Architecture

### Payment Flow
1. Customer visits product page (`product-outsidebakery.html`)
2. Enters email and name
3. Enters card details via Stripe Elements
4. Clicks "Buy Now"
5. Payment is processed via Stripe Payment Intent API
6. On success: Download becomes available + email sent with download link
7. Customer can download file immediately

### File Structure
```
/product-outsidebakery.html      - Product page with Stripe form
/images/outsidebakery.png         - Product image (coloring page)
/downloads/outsidebakery.png      - Downloadable file (secure location)
/designs.html                     - Main designs page (lists all products)
/serverless/digital-payment-worker.js - Cloudflare Worker (payment processing)
```

## Configuration

### 1. Stripe Setup
- **Public Key**: Already configured in `product-outsidebakery.html`
  ```
  pk_live_51SNIwWAKipJWOAbPpTyitJZ0bjUS8DtFYMDOwWW7vfmUpXqaP4C5U9rq4cGhG6iragLQ0CrKlQgo5az178HPRg4I00y6YwznJ8
  ```

- **Secret Key**: Must be set in Cloudflare Workers environment variables
  - Go to Cloudflare Dashboard → Workers → Settings → Environment Variables
  - Add `STRIPE_SECRET_KEY` with your secret key

### 2. Cloudflare Worker Deployment
The payment processing happens via a Cloudflare Worker:
- Deploy `serverless/digital-payment-worker.js` to Cloudflare Workers
- Set the worker endpoint in the product page

```javascript
// In product-outsidebakery.html, the worker endpoint is:
https://elizabeths-checkout.bethsbakedgoodss.workers.dev
```

### 3. Email Notifications (Optional)
Currently, the system logs download emails but doesn't send them automatically.
To add automatic email notifications:
- Integrate with SendGrid, Mailgun, or AWS SES
- Update `sendDownloadEmail()` function in `digital-payment-worker.js`

## Adding New Digital Products

### Step 1: Create Product Page
Copy `product-outsidebakery.html` and modify:
- Product name in title and h1
- Price in the page
- Product description
- Image src (change to new image)
- Product ID in payment request (e.g., `outside-bakery-coloring`)

### Step 2: Update Cloudflare Worker
Add product mapping in `digital-payment-worker.js`:
```javascript
const downloadLinks = {
  'outside-bakery-coloring': {
    filename: 'outsidebakery.png',
    title: 'Outside Bakery Coloring Page',
    url: 'https://elizabethsbakedgoods.com/downloads/outsidebakery.png'
  },
  'new-product-id': {
    filename: 'newproduct.png',
    title: 'New Product Title',
    url: 'https://elizabethsbakedgoods.com/downloads/newproduct.png'
  }
};
```

### Step 3: Add to Designs Page
Add a new product card to `/designs.html`:
```html
<div class="design-item">
    <img src="/images/newproduct.png" alt="Product Description">
    <div class="design-info">
        <h3>Product Name</h3>
        <p>Product description</p>
        <p style="color: #d93535; font-weight: bold; margin: 10px 0;">$X.XX</p>
        <p style="color: #27ae60; font-size: 0.9rem; margin: 5px 0;">✓ Instant Digital Download</p>
        <a href="/product-newproduct.html" class="cta-button">Buy Now</a>
    </div>
</div>
```

### Step 4: Upload Files
- Place product image in `/images/` directory
- Place downloadable file in secure `/downloads/` directory (server-side access control)

## Security Considerations

### 1. Payment Security
✓ Uses Stripe's official JavaScript library
✓ PCI compliance handled by Stripe
✓ No sensitive card data stored on your server
✓ HTTPS required for all transactions

### 2. Download Security
⚠️ Current implementation:
- Download links are sent via email after successful payment
- Files are accessed directly from `/downloads/` folder
- Recommend implementing:
  - Unique download tokens (generated per purchase)
  - Download expiration (24-48 hours)
  - One-time download links
  - Access logging

### 3. Recommended Improvements
1. Add download token system:
   ```javascript
   // Generate unique token after payment
   const token = crypto.randomUUID();
   // Store in database: { token, product_id, email, expires_at }
   // Download link: /downloads/{{token}}/{{filename}}
   ```

2. Implement server-side download handler:
   ```javascript
   // Verify token before serving file
   // Log download
   // Serve file with correct headers
   // Delete token after download
   ```

3. Add email verification:
   - Send confirmation email with download link
   - Link includes unique token
   - Token valid for 24-48 hours

## Testing

### Test Payment (Stripe)
Use test card credentials:
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., `12/25`)
- CVC: Any 3 digits (e.g., `123`)

### Webhook Setup (Optional)
To track payment events, set up Stripe webhooks:
1. Stripe Dashboard → Developers → Webhooks
2. Create webhook endpoint (your server)
3. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
4. Update worker to verify webhook signatures

## Troubleshooting

### Payment Fails
1. Check Stripe Public/Secret keys are correct
2. Verify Cloudflare Worker has STRIPE_SECRET_KEY environment variable
3. Check browser console for errors
4. Test with Stripe test card

### Download Not Working
1. Verify file exists at `/downloads/outsidebakery.png`
2. Check file permissions (readable by web server)
3. Check email was sent successfully
4. Verify download link is correct in `digital-payment-worker.js`

### Email Not Received
1. Current implementation doesn't send actual emails yet
2. Implement email service integration (SendGrid, Mailgun, etc.)
3. Add error handling for email failures

## Future Enhancements

1. **Bundle/Package Deals**
   - Multiple products at discount
   - Subscription downloads

2. **Product Analytics**
   - Track downloads per product
   - Customer email list
   - Revenue tracking

3. **Automatic License Generation**
   - Generate license key per purchase
   - Include in PDF with download

4. **Integration with CRM**
   - Sync customer info to email list
   - Track customer purchases
   - Upsell opportunities

5. **Affiliate System**
   - Track referral sales
   - Commission payouts

## Related Files
- Main product page: `/product-outsidebakery.html`
- Designs listing page: `/designs.html`
- Cloudflare Worker: `/serverless/digital-payment-worker.js`
- Main Stripe config: `/main.js` (for physical products)
- Wrangler config: `/wrangler.toml`

## Support
For questions or issues, contact: [support@elizabethsbakedgoods.com](mailto:support@elizabethsbakedgoods.com)
