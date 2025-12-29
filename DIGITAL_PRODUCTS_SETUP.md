# Digital Products Setup & Configuration Guide

## Overview
Your digital downloads system is now fully configured for selling coloring pages and other digital designs at $1.50 each. Customers can purchase, pay via Stripe, and instantly download their files.

---

## System Architecture

### 1. **Product Pages** (Individual Product Pages)
Located: `/product-*.html`

Each product has its own page with:
- Product image with "PROOF" watermark overlay
- Description and features
- $1.50 price point
- "Buy Now" button that redirects to Stripe Payment Link

**Product Pages:**
- `product-outsidebakery.html` - Outside Bakery Coloring Page
- `product-cupcakecolor.html` - Cupcake Coloring Page
- `product-gingerbreadcolor.html` - Gingerbread Cookie Coloring Page
- `product-insidebakerygirl.html` - Inside Bakery Girl Coloring Page
- `product-insidebakeryman.html` - Inside Bakery Man Coloring Page
- `product-cookiecolor.html` - Cookie Coloring Page
- `product-treatscolor.html` - Treats Coloring Page

### 2. **Designs Gallery Page**
Located: `/designs.html`

Displays all 7 coloring pages in a responsive grid with:
- Product images with "PROOF" watermark
- Price and "Buy Now" links
- All images display the watermark to prevent unauthorized use

### 3. **Stripe Payment Links**
Each product has a unique Stripe Payment Link configured:

| Product | Stripe Link |
|---------|------------|
| Outside Bakery | `https://buy.stripe.com/eVq3cubf3cPt5bk5zL1VK0w` |
| Cupcake | `https://buy.stripe.com/8x26oGfvj4iX8nwd2d1VK0B` |
| Gingerbread | `https://buy.stripe.com/bJeaEWerf5n17js4vH1VK0A` |
| Inside Bakery Girl | `https://buy.stripe.com/eVqaEWbf38zdfPY0fr1VK0z` |
| Inside Bakery Man | `https://buy.stripe.com/28E5kCbf38zdeLUfal1VK0y` |
| Cookie | `https://buy.stripe.com/7sY9AS3MBdTxdHQfal1VK0C` |
| Treats | `https://buy.stripe.com/28E6oGaaZ2aPdHQbY91VK0x` |

### 4. **Success Page**
Located: `/success.html`

After payment, customers are redirected here with:
- Confirmation message
- Automatic download trigger
- Manual download button as backup
- AdSense ad space for monetization
- Product details section
- Back to designs link

**Features:**
- Google AdSense integrated (client ID: ca-pub-9289301430903450)
- Dynamic file mapping based on `product_id` URL parameter
- Auto-download on page load
- Fallback manual download button

---

## Payment Flow

### Step-by-Step Customer Journey:

1. **Customer visits Designs page** → `/designs.html`
   - Sees all 7 coloring pages with prices and images
   - All images display the "PROOF" watermark

2. **Customer clicks "Buy Now"** on a product
   - Links to specific product page (e.g., `/product-outsidebakery.html`)

3. **Customer clicks "Buy Now" button on product page**
   - Redirected to Stripe Payment Link
   - Stripe URL includes success parameters:
     ```
     https://buy.stripe.com/[LINK]
     ?success_url=[BASE_URL]/success.html?product_id=[PRODUCT_ID]
     &cancel_url=[BASE_URL]/designs.html
     ```

4. **Customer completes payment on Stripe**
   - Secure payment processing by Stripe
   - Customer receives email receipt from Stripe

5. **Automatic redirect to Success Page**
   - Redirected to `/success.html?product_id=[PRODUCT_ID]`
   - Success page identifies which product was purchased
   - Automatically triggers file download

6. **Download Options**
   - **Automatic**: File downloads automatically on page load
   - **Manual**: Click "Download Your File" button
   - **Backup**: Right-click button and select "Save link as..."
   - **Bookmark**: Customers can bookmark and return to page anytime

---

## Download Files & Mapping

Files are stored in `/downloads/` folder:

| Product ID | File Name | File Type |
|-----------|-----------|-----------|
| outside-bakery | `outsidebakery.png` | PNG |
| cupcake | `cupcakecolor.png` | PNG |
| gingerbread | `gingerbreadcookiecolor.png` | PNG |
| inside-bakery-girl | `insidebakerygirl.png` | PNG |
| inside-bakery-man | `insidebakeryman.png` | PNG |
| cookie | `cookiecolor.png` | PNG |
| treats | `treatscolor.png` | PNG |

The success page automatically maps `product_id` URL parameters to these files using the `downloadMap` object in the JavaScript code.

---

## Google AdSense Configuration

**Location**: `/success.html`

**AdSense Code:**
- Client ID: `ca-pub-9289301430903450`
- Ad Slot: `1234567890` (update with actual slot ID)
- Format: Responsive auto-format
- Placement: Below success message on confirmation page

**Setup Instructions:**
1. Verify AdSense account is active
2. Update ad slot ID if needed (currently using placeholder)
3. Ads appear only on success page (high conversion traffic)

---

## Important: Stripe Payment Link Configuration

**Required Setup in Stripe Dashboard:**

For each Stripe Payment Link, you MUST configure:

1. **Success URL**: Set to your success page with product_id parameter
   - Example: `https://elizabethsbakedgoods.com/success.html?product_id=outside-bakery`

2. **Cancel URL**: Set to return customer to designs page
   - Example: `https://elizabethsbakedgoods.com/designs.html`

3. **Email Collection**: Enable to collect customer email
   - Confirmation email sent to customer with receipt

4. **Product Details**:
   - Price: $1.50
   - Name: [Product Name]
   - Type: Digital product

---

## Testing Checklist

Before going live, test each workflow:

- [ ] Visit `/designs.html` - all 7 products visible with images
- [ ] Verify "PROOF" watermark visible on all product images
- [ ] Click "Buy Now" on each product page
- [ ] Verify redirect to Stripe checkout
- [ ] Complete test payment (use Stripe test card: 4242 4242 4242 4242)
- [ ] Verify redirect to success page with correct product_id
- [ ] Verify automatic download triggers
- [ ] Verify manual download button works
- [ ] Check email receipt from Stripe received
- [ ] Verify cancel button returns to designs page
- [ ] Check AdSense ads display on success page

---

## Pricing & Revenue

**Current Setup:**
- All products: **$1.50 each**
- No shipping/taxes (digital product)
- Stripe processing fee: ~2.9% + $0.30 per transaction
- Your net revenue: ~$1.05 per sale

**Revenue Example:**
- 100 sales = $150.00 revenue
- Stripe fees (~$40) = $110.00 net
- AdSense ads on success page = additional revenue

---

## Security & Licensing

**Watermark Protection:**
- All product images display "PROOF" watermark at 30% opacity
- Watermark rotated -45 degrees across center
- Prevents unauthorized use and sharing

**License Terms:**
- Personal use only
- No commercial use without permission
- No redistribution or sharing
- See `/designs.html` for full license terms

---

## Troubleshooting

### File Download Not Working
1. Verify files exist in `/downloads/` folder
2. Check file permissions (should be readable)
3. Verify product_id URL parameter is correct
4. Check browser console for JavaScript errors

### Stripe Link Errors
1. Verify URLs are correctly configured in Stripe Dashboard
2. Ensure success/cancel URLs are publicly accessible
3. Check that links are "live" not in test mode

### AdSense Not Showing
1. Verify AdSense account is approved
2. Update ad slot ID with actual ID from AdSense
3. Ensure enough traffic for ads to display
4. Check AdSense policy compliance

### Images Not Downloading
1. Verify file format supports download (PNG should work)
2. Check browser download settings
3. Try alternative download method (right-click → Save)
4. Verify CORS headers if serving from different domain

---

## Future Enhancements

Consider adding:
- [ ] Order history / customer account system
- [ ] Bundle pricing (buy multiple, get discount)
- [ ] Email delivery of download link
- [ ] Product upsells on success page
- [ ] Customer testimonials on designs page
- [ ] More digital products (templates, guides, etc.)
- [ ] Subscription/membership model
- [ ] Custom design requests with payment

---

## File Manifest

**Key Files Modified:**
- `/success.html` - Updated with Google AdSense and auto-download
- `/product-outsidebakery.html` - Added success URL redirect
- `/product-cupcakecolor.html` - Added success URL redirect
- `/product-gingerbreadcolor.html` - Added success URL redirect
- `/product-cookiecolor.html` - Added success URL redirect
- `/product-treatscolor.html` - Added success URL redirect
- `/product-insidebakerygirl.html` - Added success URL redirect
- `/product-insidebakeryman.html` - Added success URL redirect
- `/designs.html` - Already configured with product links

**Download Files:**
- `/downloads/outsidebakery.png`
- `/downloads/cupcakecolor.png`
- `/downloads/gingerbreadcookiecolor.png`
- `/downloads/insidebakerygirl.png`
- `/downloads/insidebakeryman.png`
- `/downloads/cookiecolor.png`
- `/downloads/treatscolor.png`

---

## Support

For issues or questions:
1. Check Stripe Dashboard for payment status
2. Verify all files are in correct locations
3. Check browser console for errors
4. Test with different browser
5. Clear browser cache and try again

**Last Updated:** December 29, 2025
