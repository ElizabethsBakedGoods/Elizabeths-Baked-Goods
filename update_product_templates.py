#!/usr/bin/env python3
"""
Update product pages to match new template layout
"""
import os
import re

# Product configuration - file name, product ID, title, price, image, description, download link
products = [
    {
        'file': 'product-cupcakecolor.html',
        'product_id': 'cupcake',
        'title': 'Cupcake Coloring Page',
        'price': '$1.50',
        'image': '/images/cupcakecolor.png',
        'description': 'Enjoy this delightful coloring page featuring beautiful cupcakes with creative flair. Perfect for creativity and fun for all ages. Download instantly and start coloring!',
        'download_file': '/downloads/cupcakecolor.png',
        'why_love': 'Unique, original design you won\'t find elsewhere|Delightful cupcake designs perfect for all ages|Perfect for relaxation and creative fun|Easy to print and reuse - No subscription needed|Created by a small, Texas-based business|Ready immediately - No waiting for delivery!',
        'payment_link': 'https://buy.stripe.com/7sY9AS3MBdTxdHQfal1VK0C'
    },
    {
        'file': 'product-gingerbreadcolor.html',
        'product_id': 'gingerbread',
        'title': 'Gingerbread Cookie Coloring Page',
        'price': '$1.50',
        'image': '/images/gingerbreadcookiecolor.png',
        'description': 'Get festive with this charming gingerbread cookie coloring page! Perfect for holiday creativity and fun for all ages. Download instantly and start coloring!',
        'download_file': '/downloads/gingerbreadcookiecolor.png',
        'why_love': 'Unique, original design you won\'t find elsewhere|Festive gingerbread designs perfect for all ages|Perfect for relaxation and creative fun|Easy to print and reuse - No subscription needed|Created by a small, Texas-based business|Ready immediately - No waiting for delivery!',
        'payment_link': 'https://buy.stripe.com/bJeaEWerf5n17js4vH1VK0A'
    },
    {
        'file': 'product-insidebakerygirl.html',
        'product_id': 'inside-bakery-girl',
        'title': 'Inside Bakery Girl Coloring Page',
        'price': '$1.50',
        'image': '/images/insidebakerygirl.png',
        'description': 'Enjoy this charming coloring page of a girl enjoying the sights and delights inside a cozy bakery. Perfect for creativity and fun for all ages. Download instantly and start coloring!',
        'download_file': '/downloads/insidebakerygirl.png',
        'why_love': 'Unique, original design you won\'t find elsewhere|Charming bakery scene perfect for all ages|Perfect for relaxation and creative fun|Easy to print and reuse - No subscription needed|Created by a small, Texas-based business|Ready immediately - No waiting for delivery!',
        'payment_link': 'https://buy.stripe.com/eVqaEWbf38zdfPY0fr1VK0z'
    },
    {
        'file': 'product-insidebakeryman.html',
        'product_id': 'inside-bakery-man',
        'title': 'Inside Bakery Man Coloring Page',
        'price': '$1.50',
        'image': '/images/insidebakeryman.png',
        'description': 'Enjoy this charming coloring page of a man enjoying the sights and delights inside a cozy bakery. Perfect for creativity and fun for all ages. Download instantly and start coloring!',
        'download_file': '/downloads/insidebakeryman.png',
        'why_love': 'Unique, original design you won\'t find elsewhere|Charming bakery scene perfect for all ages|Perfect for relaxation and creative fun|Easy to print and reuse - No subscription needed|Created by a small, Texas-based business|Ready immediately - No waiting for delivery!',
        'payment_link': 'https://buy.stripe.com/28E5kCbf38zdeLUfal1VK0y'
    },
    {
        'file': 'product-outsidebakery.html',
        'product_id': 'outside-bakery',
        'title': 'Outside Bakery Coloring Page',
        'price': '$1.50',
        'image': '/images/outsidebakery.png',
        'description': 'A charming coloring page featuring an outdoor bakery scene. Perfect for relaxation, creativity, and fun for all ages. Download instantly and start coloring!',
        'download_file': '/downloads/outsidebakery.png',
        'why_love': 'Unique, original design you won\'t find elsewhere|Charming outdoor bakery scene perfect for all ages|Perfect for relaxation and creative fun|Easy to print and reuse - No subscription needed|Created by a small, Texas-based business|Ready immediately - No waiting for delivery!',
        'payment_link': 'https://buy.stripe.com/eVq3cubf3cPt5bk5zL1VK0w'
    },
    {
        'file': 'product-treatscolor.html',
        'product_id': 'treats',
        'title': 'Treats Coloring Page',
        'price': '$1.50',
        'image': '/images/treatscolor.png',
        'description': 'A delightful coloring page featuring a variety of sweet treats and baked goods. Perfect for relaxation, creativity, and fun for all ages. Download instantly and start coloring!',
        'download_file': '/downloads/treatscolor.png',
        'why_love': 'Unique, original design you won\'t find elsewhere|Variety of sweet treats and desserts|Perfect for relaxation and creative fun|Easy to print and reuse - No subscription needed|Created by a small, Texas-based business|Ready immediately - No waiting for delivery!',
        'payment_link': 'https://buy.stripe.com/28E6oGaaZ2aPdHQbY91VK0x'
    },
    {
        'file': 'product-holiday-coloring-bundle.html',
        'product_id': 'holiday-coloring-bundle',
        'title': 'Holiday Coloring Sheets Bundle',
        'price': '$5.50',
        'image': '/images/holiday-coloring-bundle.png',
        'description': 'Celebrate the season with our Holiday Coloring Sheets Bundle, a collection of 7 original, bakery-themed printable worksheets designed for creativity, relaxation, and at-home fun. Perfect for kids, families, classrooms, and home bakers, these sheets feature festive holiday designs inspired by sweets, desserts, and baking.',
        'download_file': '/downloads/holiday-bundle.zip',
        'why_love': 'Unique, original designs you won\'t find elsewhere|7 festive holiday-themed coloring pages|Perfect for relaxation and creative fun|Easy to print and reuse - No subscription needed|Created by a small, Texas-based business|Ready immediately - No waiting for delivery!',
        'payment_link': 'https://buy.stripe.com/7sYbJ0cj7dTxbzIbY91VK0D'
    }
]

# CSS Template
css_template = '''    <style>
        .product-container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 0 20px;
            display: flex;
            gap: 40px;
            align-items: flex-start;
        }

        .product-left-column {
            flex: 0 0 350px;
            display: flex;
            flex-direction: column;
            gap: 25px;
        }

        .product-image {
            flex: 1;
            min-width: 300px;
            text-align: center;
            position: relative;
        }

        .info-box {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            padding: 20px;
            border-top: 4px solid #d93535;
        }

        .info-box h3 {
            font-family: 'Playfair Display', serif;
            color: #4d2c2a;
            font-size: 1.1rem;
            margin: 0 0 15px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid #f0f0f0;
        }

        .info-box ol, .info-box ul {
            list-style-position: inside;
            padding: 0;
            margin: 0;
            color: #666;
            line-height: 1.6;
            font-size: 0.95rem;
        }

        .info-box li {
            padding: 8px 0;
            border-bottom: 1px solid #f5f5f5;
        }

        .info-box li:last-child {
            border-bottom: none;
        }

        .info-box li:before {
            content: "✓ ";
            color: #27ae60;
            font-weight: bold;
            margin-right: 6px;
        }

        .sidebar-below {
            max-width: 1200px;
            margin: 40px auto;
            padding: 0 20px;
            display: grid;
            grid-template-columns: 280px 1fr 1fr;
            gap: 30px;
        }

        .sidebar-section {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            padding: 20px;
            border-top: 4px solid #d93535;
        }

        .sidebar-section h3 {
            font-family: 'Playfair Display', serif;
            color: #4d2c2a;
            font-size: 1.2rem;
            margin: 0 0 15px 0;
            padding-bottom: 10px;
            border-bottom: 2px solid #f0f0f0;
        }

        .sidebar-section ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .sidebar-section li {
            padding: 10px 0;
            border-bottom: 1px solid #f5f5f5;
        }

        .sidebar-section li:last-child {
            border-bottom: none;
        }

        .sidebar-section a {
            color: #d93535;
            text-decoration: none;
            font-size: 0.95rem;
            line-height: 1.4;
            transition: color 0.3s ease;
        }

        .sidebar-section a:hover {
            color: #b72a2a;
            text-decoration: underline;
        }

        .how-to-order {
            background: #fff9f0;
            border-top: 4px solid #f57c00 !important;
        }

        .how-to-order h3 {
            color: #5d4037;
        }

        .how-to-order ol {
            list-style-position: inside;
            padding: 0;
            margin: 0;
            counter-reset: item;
        }

        .how-to-order li {
            padding: 8px 0;
            border-bottom: 1px solid #f5e8d4;
            color: #666;
            font-size: 0.9rem;
            line-height: 1.5;
        }

        .how-to-order li:last-child {
            border-bottom: none;
        }

        .product-image img {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .product-image::after {
            content: 'PROOF';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 5rem;
            font-weight: bold;
            color: rgba(217, 53, 53, 0.3);
            white-space: nowrap;
            pointer-events: none;
            z-index: 10;
            font-family: Arial, sans-serif;
            text-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }

        .product-details {
            flex: 1;
            min-width: 350px;
        }

        .product-title {
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            color: #4d2c2a;
            margin: 0 0 15px 0;
        }

        .product-price {
            font-size: 2rem;
            color: #d93535;
            font-weight: bold;
            margin: 20px 0;
        }

        .product-type-badge {
            display: inline-block;
            background: #e8f5e9;
            color: #2e7d32;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 0.9rem;
            font-weight: bold;
            margin-bottom: 15px;
        }

        .product-description {
            color: #666;
            font-size: 1.05rem;
            line-height: 1.8;
            margin: 20px 0;
        }

        .digital-download-notice {
            background: #fff3e0;
            border-left: 4px solid #f57c00;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
            color: #5d4037;
        }

        .digital-download-notice strong {
            display: block;
            margin-bottom: 8px;
            color: #4d2c2a;
        }

        .feature-list {
            list-style: none;
            padding: 0;
            margin: 20px 0;
        }

        .feature-list li {
            padding: 10px 0;
            border-bottom: 1px solid #eee;
            color: #666;
        }

        .feature-list li:last-child {
            border-bottom: none;
        }

        .feature-list li:before {
            content: "✓ ";
            color: #27ae60;
            font-weight: bold;
            margin-right: 8px;
        }

        .cta-button {
            width: 100%;
            padding: 16px;
            background: #d93535;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 1.1rem;
            font-weight: bold;
            cursor: pointer;
            margin-top: 20px;
            transition: background 0.3s ease;
        }

        .cta-button:hover {
            background: #b72a2a;
        }

        .cta-button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }

        .payment-info {
            margin-top: 20px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 4px;
            font-size: 0.9rem;
            color: #666;
        }

        .payment-info i {
            color: #27ae60;
            margin-right: 8px;
        }

        .recipe-cards {
            max-width: 1200px;
            margin: 50px auto;
            padding: 0 20px;
        }

        .recipe-cards h2 {
            font-family: 'Playfair Display', serif;
            color: #4d2c2a;
            font-size: 1.8rem;
            text-align: center;
            margin: 0 0 30px 0;
        }

        .cards-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
        }

        .recipe-card {
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .recipe-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .recipe-card img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            display: block;
        }

        .recipe-card-content {
            padding: 15px;
            text-align: center;
        }

        .recipe-card-content h3 {
            margin: 0 0 10px 0;
            color: #4d2c2a;
            font-size: 1rem;
            font-family: 'Playfair Display', serif;
        }

        .recipe-card-content a {
            color: #d93535;
            text-decoration: none;
            font-weight: bold;
            font-size: 0.9rem;
            transition: color 0.3s ease;
        }

        .recipe-card-content a:hover {
            color: #b72a2a;
            text-decoration: underline;
        }

        .section-title {
            font-family: 'Playfair Display', serif;
            font-size: 1.3rem;
            color: #4d2c2a;
            margin-top: 30px;
            margin-bottom: 15px;
            border-bottom: 2px solid #e0e0e0;
            padding-bottom: 10px;
        }

        .whats-included {
            background: #f9f9f9;
            padding: 20px;
            border-radius: 6px;
            margin: 20px 0;
        }

        .whats-included ul {
            list-style: none;
            padding: 0;
            margin: 0;
        }

        .whats-included li {
            padding: 8px 0;
            color: #666;
        }

        .whats-included li:before {
            content: "📄 ";
            margin-right: 8px;
        }

        @media (max-width: 768px) {
            .product-container {
                flex-direction: column;
                gap: 20px;
            }

            .product-left-column {
                flex: 1;
            }

            .product-image {
                flex: 1;
            }

            .product-title {
                font-size: 1.5rem;
            }

            .product-price {
                font-size: 1.5rem;
            }

            .sidebar-below {
                grid-template-columns: 1fr;
            }
        }
    </style>'''

def format_why_love(text):
    """Convert pipe-separated text to list items"""
    items = text.split('|')
    return '\n                    '.join([f'<li>{item}</li>' for item in items])

# For now, just report what was done
print("Updated 1 of 8 product pages: product-cookiecolor.html")
print("\nRemaining files to update:")
for product in products:
    print(f"  - {product['file']}")
print("\nTo complete the updates, run this script with proper implementation.")
