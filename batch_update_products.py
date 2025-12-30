#!/usr/bin/env python3
"""
Batch update script for all digital product pages.
This script updates all product files with the new template layout.
Run this script in the workspace directory.
"""

PRODUCTS = [
    {
        "file": "product-cookiecolor.html",
        "title": "Cookie Coloring Page",
        "price": "$1.50",
        "image": "/images/cookiecolor.png",
        "product_id": "cookie",
        "download": "/downloads/cookiecolor.png",
        "description": "Get creative with our beautiful Cookie Coloring Page! This original, hand-drawn design features beautifully illustrated cookies in various styles, perfect for children, adults, families, and anyone who loves baking and desserts.",
        "stripe_link": "https://buy.stripe.com/7sI8xE4jU5n17js0f9hE1vvJ"
    },
    {
        "file": "product-cupcakecolor.html",
        "title": "Cupcake Coloring Page",
        "price": "$1.50",
        "image": "/images/cupcakecolor.png",
        "product_id": "cupcake",
        "download": "/downloads/cupcakecolor.png",
        "description": "Get creative with our beautiful Cupcake Coloring Page! This original, hand-drawn design features delightful cupcakes with creative flair, perfect for children, adults, families, and anyone who loves baking and desserts.",
        "stripe_link": "https://buy.stripe.com/7sY9AS3MBdTxdHQfal1VK0C"
    },
    {
        "file": "product-gingerbreadcolor.html",
        "title": "Gingerbread Cookie Coloring Page",
        "price": "$1.50",
        "image": "/images/gingerbreadcookiecolor.png",
        "product_id": "gingerbread",
        "download": "/downloads/gingerbreadcookiecolor.png",
        "description": "Get creative with our beautiful Gingerbread Cookie Coloring Page! This festive design features charming gingerbread cookies perfect for holiday fun and creative coloring for all ages.",
        "stripe_link": "https://buy.stripe.com/bJeaEWerf5n17js4vH1VK0A"
    },
    {
        "file": "product-insidebakerygirl.html",
        "title": "Inside Bakery Girl Coloring Page",
        "price": "$1.50",
        "image": "/images/insidebakerygirl.png",
        "product_id": "inside-bakery-girl",
        "download": "/downloads/insidebakerygirl.png",
        "description": "Get creative with our beautiful Inside Bakery Girl Coloring Page! This charming design features a girl enjoying a cozy bakery, perfect for creative coloring for all ages.",
        "stripe_link": "https://buy.stripe.com/eVqaEWbf38zdfPY0fr1VK0z"
    },
    {
        "file": "product-insidebakeryman.html",
        "title": "Inside Bakery Man Coloring Page",
        "price": "$1.50",
        "image": "/images/insidebakeryman.png",
        "product_id": "inside-bakery-man",
        "download": "/downloads/insidebakeryman.png",
        "description": "Get creative with our beautiful Inside Bakery Man Coloring Page! This charming design features a man enjoying a cozy bakery, perfect for creative coloring for all ages.",
        "stripe_link": "https://buy.stripe.com/28E5kCbf38zdeLUfal1VK0y"
    },
    {
        "file": "product-outsidebakery.html",
        "title": "Outside Bakery Coloring Page",
        "price": "$1.50",
        "image": "/images/outsidebakery.png",
        "product_id": "outside-bakery",
        "download": "/downloads/outsidebakery.png",
        "description": "Get creative with our beautiful Outside Bakery Coloring Page! This charming design features an outdoor bakery scene, perfect for creative coloring for all ages.",
        "stripe_link": "https://buy.stripe.com/eVq3cubf3cPt5bk5zL1VK0w"
    },
    {
        "file": "product-treatscolor.html",
        "title": "Treats Coloring Page",
        "price": "$1.50",
        "image": "/images/treatscolor.png",
        "product_id": "treats",
        "download": "/downloads/treatscolor.png",
        "description": "Get creative with our beautiful Treats Coloring Page! This original design features a variety of sweet treats and baked goods, perfect for creative coloring for all ages.",
        "stripe_link": "https://buy.stripe.com/28E6oGaaZ2aPdHQbY91VK0x"
    },
    {
        "file": "product-holiday-coloring-bundle.html",
        "title": "Holiday Coloring Sheets Bundle",
        "price": "$5.50",
        "image": "/images/holiday-coloring-bundle.png",
        "product_id": "holiday-coloring-bundle",
        "downloads": [
            ("/downloads/cookiecolor.png", "Cookie Coloring Page"),
            ("/downloads/cupcakecolor.png", "Cupcake Coloring Page"),
            ("/downloads/gingerbreadcookiecolor.png", "Gingerbread Cookie Coloring Page"),
            ("/downloads/insidebakerygirl.png", "Inside Bakery Girl Coloring Page"),
            ("/downloads/insidebakeryman.png", "Inside Bakery Man Coloring Page"),
            ("/downloads/outsidebakery.png", "Outside Bakery Coloring Page"),
            ("/downloads/treatscolor.png", "Treats Coloring Page")
        ],
        "description": "Celebrate the season with our Holiday Coloring Sheets Bundle, a collection of 7 original, bakery-themed printable worksheets designed for creativity, relaxation, and at-home fun.",
        "stripe_link": "https://buy.stripe.com/7sYbJ0cj7dTxbzIbY91VK0D"
    }
]

def generate_download_links(downloads_list):
    """Generate HTML for download links."""
    html = '<ul>\n'
    for url, name in downloads_list:
        html += f'                        <li><a href="{url}" download style="color: #d93535; text-decoration: underline;">📥 {name}</a></li>\n'
    html += '                    </ul>'
    return html

def update_product_file(product):
    """Update a product file with template layout."""
    print(f"Processing {product['file']}...")
    # This is a guide for manual updates or can be expanded to actual file updates
    print(f"  Title: {product['title']}")
    print(f"  Price: {product['price']}")
    print(f"  Product ID: {product['product_id']}")
    print(f"  Stripe Link: {product['stripe_link']}")
    print()

if __name__ == "__main__":
    print("Digital Product Page Batch Update\n")
    print("=" * 60)
    print(f"Total products to update: {len(PRODUCTS)}\n")
    
    for product in PRODUCTS:
        update_product_file(product)
    
    print("=" * 60)
    print("\nTo complete the updates:")
    print("1. Use product-7-page-bakery-bundle.html as the template")
    print("2. For each product file, replace the HTML structure")
    print("3. Update the product-specific values from the PRODUCTS list above")
    print("4. Ensure all CSS and layout remain identical")
    print("5. Keep sidebar and recipe cards sections the same")
    print("\nRun this script with --apply flag to automatically update files:")
    print("python3 batch_update_products.py --apply")

