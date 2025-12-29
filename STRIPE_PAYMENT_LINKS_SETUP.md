# Stripe Payment Links - Digital Product Delivery Setup

## Overview
This guide configures Stripe Payment Links for digital product delivery on the **Designs page** with post-payment delivery using Stripe's built-in confirmation emails and a dedicated download page.

## Architecture

```
Customer Journey:
1. Customer visits /designs.html
2. Clicks "Buy Now" → visits /product-outsidebakery.html
3. Clicks "Buy Now" button → redirects to Stripe Payment Link
4. Completes payment on Stripe checkout
5. Redirected to /digital-success.html (success page)
6. Downloads file directly from /downloads/ folder
7. Receives Stripe receipt email with reference to download page
```

## Current Setup

### Payment Link (Outside Bakery Coloring Page)
- **Link URL**: `https://buy.stripe.com/eVq3cubf3cPt5bk5zL1VK0w`
- **Product**: Outside Bakery Coloring Page ($1.00)
- **Success URL**: Should be configured to `/digital-success.html?product_id=outside-bakery`

### File Locations
- **Product Page**: [product-outsidebakery.html](product-outsidebakery.html)
- **Success/Download Page**: [digital-success.html](digital-success.html)
- **Downloadable Files**: `/downloads/` folder
- **Product Images**: `/images/` folder

## Step 1: Configure Stripe Payment Link Success URL

### In Stripe Dashboard:

1. **Go to Payment Links**:
   - Log in to [Stripe Dashboard](https://dashboard.stripe.com)
   - Navigate to **Payment Links**
   - Click on the "Outside Bakery Coloring Page" payment link

2. **Edit the Payment Link**:
   - Click **Edit**
   - Scroll to **After payment**
   - Set **Success URL** to:
     ```
     https://elizabethsbakedgoods.com/digital-success.html?product_id=outside-bakery
     ```
   - (Replace `elizabethsbakedgoods.com` with your actual domain)

3. **Ensure Email Collection**:
   - Make sure **"Collect email"** is enabled
   - This allows Stripe to send receipt emails with reference to the download page

4. **Save Changes**

### Why This Matters:
- After payment, customer is automatically redirected to `/digital-success.html`
- The `product_id` parameter tells the page which file to display for download
- Stripe's built-in email includes the confirmation, and we reference the download page in the email

---

## Step 2: Configure Stripe Receipt Email (Optional Enhancement)

To add a reference to the download page in Stripe's receipt email:

### Option A: Stripe Dashboard Email Settings
1. **Go to Settings** → **Emails**
2. **Payment receipt** → **Customize**
3. Add text to the email body:
   ```
   Your digital download is ready!
   
   Visit your download page to access your file:
   https://elizabethsbakedgoods.com/digital-success.html?product_id=outside-bakery
   
   The page is also accessible through your browser history or the success page after checkout.
   ```

### Option B: Email Template via Stripe Billing Portal
- Configure under **Billing** → **Customer Portal** → **Email Branding**
- Add custom message in payment receipt template

---

## Step 3: Set Up Digital File Hosting

### File Organization:
```
/downloads/
├── outsidebakery.png          (Outside Bakery Coloring Page)
├── dessert-coloring.pdf       (Dessert Coloring Pages)
├── holiday-treats.pdf         (Holiday Treats Coloring Pages)
├── kids-baking.pdf            (Kids Baking Coloring Pages)
├── piping-basics.pdf          (Piping Basics Practice Sheet)
├── advanced-piping.pdf        (Advanced Piping Techniques)
├── cake-decorating.pdf        (Cake Decorating Patterns)
├── cookie-labels.zip          (Cookie Box Labels)
├── gift-tags.pdf              (Printable Gift Tags)
└── ingredient-labels.pdf      (Ingredient Labels)
```

### Secure File Hosting Best Practices:

1. **Direct Downloads**:
   - Files are served from `/downloads/` directly
   - No authentication required (customer already paid)
   - Files should NOT be in a public git repository (add to `.gitignore`)

2. **File Protection** (Optional):
   ```
   # In .gitignore
   /downloads/*.png
   /downloads/*.pdf
   /downloads/*.zip
   ```

3. **HTTPS Only**:
   - Ensure all downloads are over HTTPS
   - Stripe redirects to HTTPS, so downloads must also be HTTPS

4. **Consider Cloudflare**:
   - If using Cloudflare (which you might be with wrangler), ensure:
     - `/downloads/` folder is cached-friendly or cache-busted appropriately
     - Set cache control headers if needed

---

## Step 4: Update Product Page

The [product-outsidebakery.html](product-outsidebakery.html) already:
- ✅ Links to Stripe Payment Link
- ✅ Redirects to payment link on "Buy Now" click
- ✅ Explains it's a digital download

**No changes needed** unless you want to update the payment link URL.

---

## Step 5: Add Success Page to Designs Gallery

When adding new digital products to designs.html, use this pattern:

```html
<div class="design-item">
    <img src="/images/newproduct.png" alt="Product Name">
    <div class="design-info">
        <h3>Product Name</h3>
        <p>Product description</p>
        <p style="color: #d93535; font-weight: bold; margin: 10px 0;">$X.XX</p>
        <p style="color: #27ae60; font-size: 0.9rem; margin: 5px 0;">✓ Instant Digital Download</p>
        <a href="/product-newproduct.html" class="cta-button" style="font-size: 16px; padding: 10px 15px;">Buy Now</a>
    </div>
</div>
```

---

## Digital Success Page Features

The [digital-success.html](digital-success.html) page includes:

✅ **Immediate Confirmation**
- Green success message with checkmark icon
- Shows order status and product details

✅ **Download Button**
- Dynamic product-specific download link
- Uses product_id parameter from URL

✅ **Email Notification Alert**
- Reminds customer that Stripe sent receipt email
- Directs them to check inbox

✅ **Clear Instructions**
- Step-by-step download and usage instructions
- Explains personal use license

✅ **Product Details Display**
- Status, product type, file format
- All information from productDownloads mapping

✅ **Support Links**
- Contact page for issues
- Links to terms and privacy policy
- Browse more designs button

---

## Dynamic Product Mapping

The success page uses a JavaScript object to map products:

```javascript
const productDownloads = {
    'outside-bakery': {
        filename: 'Outside Bakery Coloring Page',
        fileformat: 'PNG Image',
        downloadUrl: '/downloads/outsidebakery.png'
    },
    'dessert-coloring': {
        filename: 'Dessert Coloring Pages',
        fileformat: 'PDF',
        downloadUrl: '/downloads/dessert-coloring.pdf'
    },
    // ... more products
};
```

**To add new products**:
1. Add entry to `productDownloads` object in digital-success.html
2. Create payment link in Stripe with success URL: 
   ```
   /digital-success.html?product_id=your-product-id
   ```
3. Create product page linking to Stripe Payment Link
4. Add to designs.html gallery

---

## Email Configuration (Stripe Receipt Email)

### Default Stripe Email Includes:
- ✅ Order confirmation
- ✅ Amount charged
- ✅ Stripe receipt number
- ✅ Customer contact information

### What We're Adding:
- 📧 Reference to download page in custom email section
- 🔗 Direct link to `/digital-success.html` for file access

### Configuration Steps:

1. **In Stripe Dashboard**:
   - Settings → Emails
   - Select "Payment receipt"
   - Toggle "Custom email" ON
   - Add message body:
   ```
   Thank you for your purchase!
   
   Your digital download is ready and available for immediate download.
   
   👉 Access your download here:
   https://elizabethsbakedgoods.com/digital-success.html?product_id=outside-bakery
   
   You can also access this page from the success page shown after checkout, 
   or look for the download link in your browser history.
   
   Need help? Contact us at [your email]
   ```

2. **Preview the email** before saving
3. **Save changes**

---

## Troubleshooting

### Issue: Customer can't find download link after payment
**Solution**:
- Ensure product_id parameter is correct in success URL
- Check that file exists in /downloads/ folder
- Verify browser can download from /downloads/ path

### Issue: Download file not accessible
**Solution**:
- Verify file is in correct location with correct permissions
- Check that path in productDownloads matches actual file location
- Ensure HTTPS is enabled for download URLs
- Test download URL directly in browser

### Issue: Stripe email not referencing download
**Solution**:
- Verify custom email is enabled in Stripe settings
- Check email template is saved
- Test by making a test payment
- Review email to see if custom message appears

### Issue: Wrong product showing on success page
**Solution**:
- Verify `product_id` parameter in success URL matches payment link
- Check productDownloads object has entry for that product_id
- Test URL directly with ?product_id=correct-id parameter

---

## Security Considerations

1. **No Authentication Required**:
   - Files are freely downloadable after payment (customer already paid)
   - No need for login/password on download page

2. **HTTPS Only**:
   - All downloads must be over HTTPS
   - Stripe enforces HTTPS, so this is automatic

3. **Rate Limiting** (Optional):
   - Could add Cloudflare rate limiting on /downloads/ folder
   - Not required for basic setup

4. **File Privacy**:
   - Don't expose file locations in public code repositories
   - Use .gitignore for /downloads/ folder
   - Files are public but not indexed by search engines (assume)

---

## Testing Checklist

- [ ] Create test payment link in Stripe
- [ ] Test payment flow end-to-end
- [ ] Verify redirect to /digital-success.html
- [ ] Confirm download button appears and works
- [ ] Check that Stripe receipt email is received
- [ ] Verify file downloads correctly
- [ ] Test with product_id parameter
- [ ] Test on mobile device
- [ ] Verify footer loads correctly
- [ ] Check all navigation links work

---

## Files Involved

| File | Purpose |
|------|---------|
| [product-outsidebakery.html](product-outsidebakery.html) | Product page, redirects to Stripe Payment Link |
| [digital-success.html](digital-success.html) | Success/download page (landing point after Stripe) |
| [designs.html](designs.html) | Designs gallery showcasing all products |
| `/downloads/` | Directory containing digital files for download |
| Stripe Dashboard | Payment Link configuration and email settings |

---

## Next Steps

1. ✅ **Set Success URL in Stripe Payment Link**
   - Go to Stripe Dashboard
   - Find the payment link
   - Set success URL to `/digital-success.html?product_id=outside-bakery`

2. ✅ **Test Payment Flow**
   - Make a test payment
   - Verify redirect to success page
   - Download file successfully
   - Receive Stripe receipt email

3. ✅ **Add Email Reference** (Optional)
   - Configure Stripe email to reference download page
   - Test with another payment

4. ✅ **Scale to More Products**
   - Add new payment links in Stripe
   - Create product pages
   - Update digital-success.html with product mappings
   - Add to designs.html gallery

---

## Reference Links

- 📖 [Stripe Payment Links Documentation](https://stripe.com/docs/payment-links)
- 📧 [Stripe Email Configuration](https://stripe.com/docs/payments/checkout/hosted-checkout#email-settings)
- 🔒 [Stripe Security Best Practices](https://stripe.com/docs/security)
- 🎯 [Stripe Billing Settings](https://dashboard.stripe.com/settings/billing)
