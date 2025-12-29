# Digital Products - Payment Links Configuration

## Overview
You now have 7 digital coloring page products, each priced at **$1.50**. All product pages are created and ready - you just need to add your Stripe Payment Link URLs.

---

## Product List & Configuration

### 1. **Outside Bakery Coloring Page**
- **File**: `/downloads/outsidebakery.png`
- **Image**: `/images/outsidebakery.png`
- **Product Page**: [product-outsidebakery.html](product-outsidebakery.html)
- **Price**: $1.50
- **Product ID** (for success page): `outside-bakery`
- **Placeholder** in code: `https://buy.stripe.com/eVq3cubf3cPt5bk5zL1VK0w`
- **Action**: ✅ Keep existing link OR replace with new $1.50 link
- **Success URL**: `https://yoursite.com/digital-success.html?product_id=outside-bakery`

---

### 2. **Cupcake Coloring Page**
- **File**: `/downloads/cupcakecolor.png`
- **Image**: `/images/cupcakecolor.png`
- **Product Page**: [product-cupcakecolor.html](product-cupcakecolor.html)
- **Price**: $1.50
- **Product ID** (for success page): `cupcake-color`
- **Placeholder** in code: `https://buy.stripe.com/PLACEHOLDER_CUPCAKE`
- **Action**: ⏳ Add Stripe Payment Link
- **Success URL**: `https://yoursite.com/digital-success.html?product_id=cupcake-color`

---

### 3. **Gingerbread Cookie Coloring Page**
- **File**: `/downloads/gingerbreadcookiecolor.png`
- **Image**: `/images/gingerbreadcookiecolor.png`
- **Product Page**: [product-gingerbreadcolor.html](product-gingerbreadcolor.html)
- **Price**: $1.50
- **Product ID** (for success page): `gingerbread-color`
- **Placeholder** in code: `https://buy.stripe.com/PLACEHOLDER_GINGERBREAD`
- **Action**: ⏳ Add Stripe Payment Link
- **Success URL**: `https://yoursite.com/digital-success.html?product_id=gingerbread-color`

---

### 4. **Inside Bakery Girl Coloring Page**
- **File**: `/downloads/insidebakerygirl.png`
- **Image**: `/images/insidebakerygirl.png`
- **Product Page**: [product-insidebakerygirl.html](product-insidebakerygirl.html)
- **Price**: $1.50
- **Product ID** (for success page): `bakery-girl`
- **Placeholder** in code: `https://buy.stripe.com/PLACEHOLDER_BAKERYGIRL`
- **Action**: ⏳ Add Stripe Payment Link
- **Success URL**: `https://yoursite.com/digital-success.html?product_id=bakery-girl`

---

### 5. **Inside Bakery Man Coloring Page**
- **File**: `/downloads/insidebakeryman.png`
- **Image**: `/images/insidebakeryman.png`
- **Product Page**: [product-insidebakeryman.html](product-insidebakeryman.html)
- **Price**: $1.50
- **Product ID** (for success page): `bakery-man`
- **Placeholder** in code: `https://buy.stripe.com/PLACEHOLDER_BAKERYMAN`
- **Action**: ⏳ Add Stripe Payment Link
- **Success URL**: `https://yoursite.com/digital-success.html?product_id=bakery-man`

---

### 6. **Cookie Coloring Page**
- **File**: `/downloads/cookiecolor.png`
- **Image**: `/images/cookiecolor.png`
- **Product Page**: [product-cookiecolor.html](product-cookiecolor.html)
- **Price**: $1.50
- **Product ID** (for success page): `cookie-color`
- **Placeholder** in code: `https://buy.stripe.com/PLACEHOLDER_COOKIE`
- **Action**: ⏳ Add Stripe Payment Link
- **Success URL**: `https://yoursite.com/digital-success.html?product_id=cookie-color`

---

### 7. **Treats Coloring Page**
- **File**: `/downloads/treatscolor.png`
- **Image**: `/images/treatscolor.png`
- **Product Page**: [product-treatscolor.html](product-treatscolor.html)
- **Price**: $1.50
- **Product ID** (for success page): `treats-color`
- **Placeholder** in code: `https://buy.stripe.com/PLACEHOLDER_TREATS`
- **Action**: ⏳ Add Stripe Payment Link
- **Success URL**: `https://yoursite.com/digital-success.html?product_id=treats-color`

---

## What You Need to Do

### Step 1: Create Payment Links in Stripe
For each product (2-7 above), create a Stripe Payment Link with:
- **Product Name**: (see product name above)
- **Price**: $1.50
- **Collect Email**: Enabled
- **Success URL**: (see Success URL above)

### Step 2: Send Payment Link URLs
Once you create each Payment Link in Stripe, you'll get URLs like:
```
https://buy.stripe.com/eVq3cubf3cPt5bk5zL1VK0w
```

Send them to me in this format:
```
1. Cupcake: https://buy.stripe.com/[YOUR_LINK_HERE]
2. Gingerbread: https://buy.stripe.com/[YOUR_LINK_HERE]
3. Bakery Girl: https://buy.stripe.com/[YOUR_LINK_HERE]
4. Bakery Man: https://buy.stripe.com/[YOUR_LINK_HERE]
5. Cookie: https://buy.stripe.com/[YOUR_LINK_HERE]
6. Treats: https://buy.stripe.com/[YOUR_LINK_HERE]
7. Outside Bakery (new): https://buy.stripe.com/[YOUR_NEW_LINK_HERE]
```

### Step 3: I'll Update All Product Pages
Once you provide the links, I'll update all product pages with the correct payment link URLs.

---

## Files Created

✅ **Product Pages**:
- `product-outsidebakery.html` (updated)
- `product-cupcakecolor.html`
- `product-gingerbreadcolor.html`
- `product-insidebakerygirl.html`
- `product-insidebakeryman.html`
- `product-cookiecolor.html`
- `product-treatscolor.html`

✅ **Support Files**:
- `digital-success.html` (updated with all 7 products)
- `/downloads/` folder (all 7 files in place)
- `designs.html` (updated gallery with all 7 products at $1.50)

---

## Gallery Display

All 7 products now appear on `/designs.html` in the "Coloring Pages" section with:
- Product image
- Product name
- Product description
- Price: $1.50
- "✓ Instant Digital Download" badge
- "Buy Now" button linking to product page

---

## How It Works

1. Customer visits `/designs.html`
2. Clicks "Buy Now" on any product
3. Lands on product page (e.g., `/product-cupcakecolor.html`)
4. Clicks "Buy Now" button
5. Redirected to your Stripe Payment Link
6. Completes payment on Stripe
7. Redirected to `/digital-success.html?product_id=cupcake-color`
8. Downloads file immediately
9. Receives Stripe receipt email

---

## Next Steps

1. **Create 6 new Payment Links** in Stripe Dashboard (one for each product 2-7)
2. **Update or create link** for Outside Bakery at $1.50 price
3. **Provide me** with all 7 Stripe Payment Link URLs
4. **I'll update** all product pages with the correct links
5. **Done!** Your digital products are live

---

## Testing

Once you provide the Stripe links:
1. I'll update all pages
2. Test each product link end-to-end
3. Verify downloads work
4. Verify email confirmations

---

**Ready to provide the Stripe Payment Links?** Send them in the format above and I'll complete the integration! 🎉
