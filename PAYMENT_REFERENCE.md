# Payment Processing Quick Reference

## Stripe Integration Points

### 1. Product Page (product-outsidebakery.html)
```javascript
// Stripe Configuration
const STRIPE_PUBLIC_KEY = 'pk_live_51SNIwWAKipJWOAbPpTyitJZ0bjUS8DtFYMDOwWW7vfmUpXqaP4C5U9rq4cGhG6iragLQ0CrKlQgo5az178HPRg4I00y6YwznJ8';
const stripe = Stripe(STRIPE_PUBLIC_KEY);
const elements = stripe.elements();
const cardElement = elements.create('card');
```

**Key Functions:**
- `stripe.createPaymentMethod()` - Creates payment method from card
- `stripe.confirmCardPayment()` - Handles 3D Secure if needed
- Form submission → Payment method → Worker request

### 2. Cloudflare Worker (digital-payment-worker.js)
```javascript
// Worker Endpoint
https://elizabeths-checkout.bethsbakedgoodss.workers.dev

// Environment Variables Required
STRIPE_SECRET_KEY = your_secret_key_here

// Request Body
{
  paymentMethodId: "pm_xxx",
  email: "customer@example.com",
  name: "Customer Name",
  amount: 100,  // cents ($1.00)
  product: "outside-bakery-coloring",
  productName: "Outside Bakery Coloring Page"
}

// Response on Success
{
  success: true,
  status: "succeeded",
  clientSecret: "pi_xxx_secret_xxx"
}
```

### 3. Product Mapping in Worker
```javascript
const downloadLinks = {
  'outside-bakery-coloring': {
    filename: 'outsidebakery.png',
    title: 'Outside Bakery Coloring Page',
    url: 'https://elizabethsbakedgoods.com/downloads/outsidebakery.png'
  }
};
```

## Payment Status Flow

```
Card Input
    ↓
Validate (real-time)
    ↓
Create Payment Method (Stripe)
    ↓
Send to Worker
    ↓
Worker creates Payment Intent
    ↓
Payment processed
    ↓
Status: succeeded → Download available
Status: requires_action → 3D Secure modal
Status: error → Show error message
```

## Error Handling

### Client-Side (product page)
```javascript
// Card Errors
cardElement.on('change', (event) => {
  if (event.error) {
    cardErrorsDiv.style.display = 'block';
    cardErrorsDiv.textContent = event.error.message;
  }
});

// Payment Errors
if (data.error) {
  errorDiv.style.display = 'block';
  errorDiv.textContent = data.error;
}
```

### Server-Side (Worker)
```javascript
// Stripe API Errors
if (!paymentIntentResponse.ok) {
  return response with error message
}

// Configuration Errors
if (!STRIPE_SECRET_KEY) {
  return error: 'Stripe not configured'
}
```

## Testing Credentials

**Stripe Test Mode Cards:**

| Scenario | Card Number | Expiry | CVC |
|----------|-------------|--------|-----|
| Success | 4242 4242 4242 4242 | Any future date | Any 3 digits |
| Decline | 4000 0000 0000 0002 | Any future date | Any 3 digits |
| 3D Secure | 4000 0025 0000 3155 | Any future date | Any 3 digits |
| Amex | 3782 822463 10005 | Any future date | Any 4 digits |

## File Locations

```
Website Root
├── product-outsidebakery.html      ← Product page
├── designs.html                    ← Links to product
├── images/
│   └── outsidebakery.png          ← Product image
├── downloads/
│   └── outsidebakery.png          ← Downloadable file
├── serverless/
│   ├── digital-payment-worker.js  ← Payment processing
│   └── cloudflare-worker.js       ← Legacy (for physical products)
└── main.js                         ← General Stripe config
```

## Environment Variables

**Cloudflare Workers:**
- `STRIPE_SECRET_KEY` = sk_live_...

**Add via Cloudflare Dashboard:**
1. Workers & Pages
2. Select worker
3. Settings → Environment Variables
4. Add new variable

## Monitoring Payments

**Stripe Dashboard:**
- Go to Developers → Events
- Filter by payment_intent.succeeded
- View transaction details
- Download receipts

**Payment Intent Status:**
- `succeeded` - Payment processed, download available
- `processing` - Payment pending
- `requires_action` - 3D Secure needed
- `requires_payment_method` - Card declined
- `canceled` - Payment canceled

## Security Checklist

- [ ] STRIPE_SECRET_KEY set in Cloudflare
- [ ] HTTPS enabled on website
- [ ] CORS configured properly
- [ ] Payment page uses Stripe.js
- [ ] No card data stored on server
- [ ] Download folder not publicly browsable
- [ ] Email validation working
- [ ] Rate limiting recommended

## Troubleshooting

### Payment Fails with "Stripe not configured"
- Check STRIPE_SECRET_KEY in Cloudflare Workers environment
- Verify worker is deployed
- Check worker endpoint URL in product page

### "Invalid API Key" Error
- Confirm STRIPE_SECRET_KEY is correct (should start with sk_live_)
- Check for extra spaces or characters
- Use correct environment (live vs test)

### Payment succeeds but download unavailable
- Check if downloadLinks mapping exists for product_id
- Verify file exists in /downloads/ folder
- Check file permissions
- Review browser console for fetch errors

### Card validation shows error
- Check Stripe.js is loaded
- Verify card element mounted correctly
- Check browser console for errors
- Test with different cards

### Email not received
- Email notifications not yet implemented
- Must integrate SendGrid, Mailgun, or similar
- Check worker logs for email function calls
- Implement sendDownloadEmail() function

## Enhancement Opportunities

1. **Better Download Management**
   - Generate unique tokens per purchase
   - Email contains token-based download link
   - Tokens expire after 24-48 hours
   - Log all downloads

2. **Customer Communication**
   - Automatic thank-you email
   - Download instructions
   - License information
   - Support contact info

3. **Analytics**
   - Track conversion rates
   - Monitor abandonment
   - Segment by product
   - Geographic data

4. **Product Bundling**
   - Discount for multiple items
   - Create packages
   - Volume discounts
   - Subscription options

## Related Documentation

- See `DIGITAL_PRODUCTS_README.md` for full setup
- See `OUTSIDE_BAKERY_IMPLEMENTATION.md` for checklist
- See `PRODUCT_PAGE_TEMPLATE.html` for new products

## API Reference

**Stripe.js Methods Used:**

```javascript
stripe.createPaymentMethod(options)
// Creates a PaymentMethod from card details
// Returns: { paymentMethod, error }

stripe.confirmCardPayment(clientSecret)
// Confirms payment (handles 3D Secure)
// Returns: { paymentIntent, error }

elements.create('card')
// Creates card element
// Returns: cardElement

cardElement.on('change', callback)
// Listens for card changes
// Events: change, blur, focus, ready
```

**Cloudflare Worker Handler:**

```javascript
export default {
  async fetch(request, env) {
    // request.method: POST
    // request.headers: Content-Type application/json
    // request.body: JSON with paymentMethodId, email, etc.
    // env.STRIPE_SECRET_KEY: From environment variables
    // Returns: Response with JSON
  }
}
```

---

**Last Updated**: December 23, 2025
**Version**: 1.0
