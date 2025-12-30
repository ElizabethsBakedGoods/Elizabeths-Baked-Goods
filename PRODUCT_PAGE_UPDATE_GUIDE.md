# Digital Product Page Template Update Guide

All digital product pages should follow the layout and structure of `product-7-page-bakery-bundle.html`.

## Template Structure Overview

### Key Sections:
1. **Left Column (product-left-column)** - Contains:
   - Product Image
   - "How It Works" Info Box
   - "Why You'll Love This" Info Box  
   - "Please Note" Info Box

2. **Right Column (product-details)** - Contains:
   - Product Badge
   - Title
   - Price
   - Description
   - Payment Form (BUY NOW button)
   - What's Included
   - Perfect For
   - File Details
   - Download Links (hidden until purchase)
   - Digital Download Notice

3. **Sidebar Below (sidebar-below)** - 3 Column Grid:
   - How to Order
   - Related Blog Posts
   - Online Ordering

4. **Recipe Cards Section**:
   - Chocolate Chip Cookie
   - S'mores Cookie
   - Brownies

## Files to Update (8 total):

1. **product-cookiecolor.html** 
   - Title: Cookie Coloring Page
   - Price: $1.50
   - Image: /images/cookiecolor.png
   - Product ID: cookie
   - Download: /downloads/cookiecolor.png
   - Stripe Link: (get from Stripe dashboard)

2. **product-cupcakecolor.html**
   - Title: Cupcake Coloring Page
   - Price: $1.50
   - Image: /images/cupcakecolor.png
   - Product ID: cupcake
   - Download: /downloads/cupcakecolor.png
   - Stripe Link: (get from Stripe dashboard)

3. **product-gingerbreadcolor.html**
   - Title: Gingerbread Cookie Coloring Page
   - Price: $1.50
   - Image: /images/gingerbreadcookiecolor.png
   - Product ID: gingerbread
   - Download: /downloads/gingerbreadcookiecolor.png
   - Stripe Link: (get from Stripe dashboard)

4. **product-insidebakerygirl.html**
   - Title: Inside Bakery Girl Coloring Page
   - Price: $1.50
   - Image: /images/insidebakerygirl.png
   - Product ID: inside-bakery-girl
   - Download: /downloads/insidebakerygirl.png
   - Stripe Link: (get from Stripe dashboard)

5. **product-insidebakeryman.html**
   - Title: Inside Bakery Man Coloring Page
   - Price: $1.50
   - Image: /images/insidebakeryman.png
   - Product ID: inside-bakery-man
   - Download: /downloads/insidebakeryman.png
   - Stripe Link: (get from Stripe dashboard)

6. **product-outsidebakery.html**
   - Title: Outside Bakery Coloring Page
   - Price: $1.50
   - Image: /images/outsidebakery.png
   - Product ID: outside-bakery
   - Download: /downloads/outsidebakery.png
   - Stripe Link: (get from Stripe dashboard)

7. **product-treatscolor.html**
   - Title: Treats Coloring Page
   - Price: $1.50
   - Image: /images/treatscolor.png
   - Product ID: treats
   - Download: /downloads/treatscolor.png
   - Stripe Link: (get from Stripe dashboard)

8. **product-holiday-coloring-bundle.html**
   - Title: Holiday Coloring Sheets Bundle
   - Price: $5.50
   - Image: /images/holiday-coloring-bundle.png
   - Product ID: holiday-coloring-bundle
   - Downloads: All 7 files (see current file for details)
   - Stripe Link: (get from Stripe dashboard)

## How to Update Each File:

1. Copy the entire HTML structure from `product-7-page-bakery-bundle.html`
2. Update product-specific fields:
   - Meta title and description
   - Product title (h1)
   - Product price
   - Product image src
   - Product description(s)
   - "What's Included" list
   - Download links (in hidden download-section)
   - Product ID in JavaScript (for purchase detection)
   - Stripe payment link
   - Success URL (points back to product page with product_id)

3. Keep all CSS and layout structure identical
4. Keep sidebar and recipe cards identical across all pages
5. Adjust info boxes content as needed (can be similar for individual items)

## Important Notes:

- All pages should have matching CSS (copy from template)
- All pages should have same sidebar layout
- All pages should have same recipe cards section
- Only customize: title, price, image, description, download links, payment link, product ID
- The payment form script checks for `product_id` parameter to show downloads after purchase
- Make sure Stripe payment links are configured with proper success_url and cancel_url

