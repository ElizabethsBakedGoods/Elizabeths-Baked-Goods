#!/usr/bin/env python3
"""
Update all product pages with the new template layout from product-7-page-bakery-bundle.html
This script applies the same CSS, layout structure, and content sections to all digital product pages.
"""

import os
import re

# Template file to copy CSS from
TEMPLATE_FILE = "product-7-page-bakery-bundle.html"

# Product files to update (excluding the template itself)
PRODUCT_FILES = [
    "product-holiday-coloring-bundle.html",
    "product-outsidebakery.html",
    "product-cupcakecolor.html",
    "product-gingerbreadcolor.html",
    "product-insidebakerygirl.html",
    "product-insidebakeryman.html",
    "product-cookiecolor.html",
    "product-treatscolor.html",
]

def extract_css_from_template(template_path):
    """Extract the <style> section from the template file."""
    with open(template_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find style section
    style_match = re.search(r'<style>(.*?)</style>', content, re.DOTALL)
    if style_match:
        return style_match.group(1)
    return None

def extract_section(content, section_name):
    """Extract a specific section from HTML content."""
    # Find comment markers for sections
    start_marker = f'<!-- {section_name} -->'
    if start_marker not in content:
        return None
    
    start_idx = content.find(start_marker)
    # Find the next HTML tag or comment after the marker
    rest = content[start_idx:]
    next_section = re.search(r'-->', rest)
    if next_section:
        start_idx += next_section.end()
    
    return content[start_idx:start_idx+2000]

def update_product_file(filepath, template_css):
    """Update a product file with the new template CSS and structure."""
    print(f"Processing: {filepath}")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace old style section with new one
    old_style = re.search(r'<style>.*?</style>', content, re.DOTALL)
    if old_style:
        content = content[:old_style.start()] + f'<style>{template_css}</style>' + content[old_style.end():]
        print(f"  ✓ Updated CSS styles")
    
    # Check if file already has the new layout markers
    if 'product-left-column' in content:
        print(f"  ℹ File already has new layout, skipping")
        return False
    
    print(f"  ⚠ File needs manual HTML restructuring")
    return True

def main():
    """Main update function."""
    base_path = os.path.dirname(os.path.abspath(__file__))
    template_path = os.path.join(base_path, TEMPLATE_FILE)
    
    # Extract CSS from template
    if not os.path.exists(template_path):
        print(f"Error: Template file not found: {template_path}")
        return
    
    template_css = extract_css_from_template(template_path)
    if not template_css:
        print("Error: Could not extract CSS from template")
        return
    
    print(f"Template CSS extracted ({len(template_css)} characters)\n")
    
    # Update each product file
    files_needing_html_updates = []
    for product_file in PRODUCT_FILES:
        product_path = os.path.join(base_path, product_file)
        if os.path.exists(product_path):
            if update_product_file(product_path, template_css):
                files_needing_html_updates.append(product_file)
        else:
            print(f"⚠ File not found: {product_file}")
    
    print(f"\n{'='*60}")
    print(f"Update Summary:")
    print(f"{'='*60}")
    print(f"CSS updated: {len(PRODUCT_FILES)} files")
    print(f"HTML structure needs manual update: {len(files_needing_html_updates)} files")
    
    if files_needing_html_updates:
        print(f"\nFiles requiring HTML restructuring:")
        for f in files_needing_html_updates:
            print(f"  - {f}")
        print(f"\nNote: These files need the HTML structure updated to match the new layout.")
        print(f"Refer to product-7-page-bakery-bundle.html for the new HTML structure.")

if __name__ == "__main__":
    main()
