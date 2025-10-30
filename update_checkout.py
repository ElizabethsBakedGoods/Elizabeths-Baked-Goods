#!/usr/bin/env python3
"""Update main.js with new checkout flow"""

import re

# Read the file
with open('main.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Find and replace the handleCheckout function
old_checkout_start = 'async function handleCheckout() {'
old_checkout_end = '\n}\n\n// Check if returning from successful checkout'

new_checkout = '''async function handleCheckout() {
\tif (cart.length === 0) {
\t\talert("Your cart is empty!");
\t\treturn;
\t}

\tconst subtotal = cart.reduce((sum, item) => sum + item.price, 0);
\tconst subtotalDollars = subtotal / 100;

\t// Enforce $25 minimum
\tif (subtotalDollars < 25) {
\t\talert("Minimum order for shipping is $25. Please add more items to your cart.");
\t\treturn;
\t}

\t// Validate contact info
\tconst customerName = document.getElementById("customer-name")?.value.trim();
\tconst customerEmail = document.getElementById("customer-email")?.value.trim();
\tconst customerPhone = document.getElementById("customer-phone")?.value.trim();

\tif (!customerName || !customerEmail || !customerPhone) {
\t\talert("Please fill in all contact information (Name, Email, Phone)");
\t\treturn;
\t}

\tif (!/^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$/.test(customerEmail)) {
\t\talert("Please enter a valid email address");
\t\treturn;
\t}

\t// Always send order notification via Formspree
\tconst shippingCost = subtotalDollars >= 60 ? 'FREE' : '$8.00';
\tconst grandTotal = subtotalDollars >= 60 ? subtotalDollars : subtotalDollars + 8;
\t
\ttry {
\t\tawait sendOrderNotification(cart, customerEmail, customerName, customerPhone);
\t} catch (e) {
\t\tconsole.error('Formspree notification failed:', e);
\t}

\t// If cart has only ONE item, redirect directly to its Stripe payment link
\tif (cart.length === 1) {
\t\tconst item = cart[0];
\t\tconst paymentLink = CONFIG.paymentLinks[item.id];
\t\tif (paymentLink) {
\t\t\tsessionStorage.setItem('pendingOrder', JSON.stringify(cart));
\t\t\talert(`Redirecting to secure checkout for ${item.name}...`);
\t\t\twindow.location.href = paymentLink;
\t\t\treturn;
\t\t}
\t}
\t
\t// For multiple items: confirm order received
\talert(`Thank you, ${customerName}!\\n\\nYour order has been received:\\n${cart.length} items • Total: $${grandTotal.toFixed(2)}\\n\\nWe'll email you a secure payment link at:\\n${customerEmail}\\n\\nExpect it within 1 hour!`);
\t
\tcart = [];
\tupdateCartDisplay();
\t
\t// Clear contact form
\tdocument.getElementById("customer-name").value = "";
\tdocument.getElementById("customer-email").value = "";
\tdocument.getElementById("customer-phone").value = "";
}

// Check if returning from successful checkout'''

# Find the function
start_idx = content.find(old_checkout_start)
end_idx = content.find(old_checkout_end, start_idx)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + new_checkout + content[end_idx:]
    print("✓ Updated handleCheckout function")
else:
    print("! Could not find handleCheckout function")

# 2. Update sendOrderNotification function signature and body
old_notify = r'async function sendOrderNotification\(orderItems, customerEmail\) \{'
new_notify_start = 'async function sendOrderNotification(orderItems, customerEmail, customerName, customerPhone) {'

content = re.sub(old_notify, new_notify_start, content)

# Update the email body to include customer info
old_body = '''const emailBody = `
NEW ORDER RECEIVED

Order Total: $${subtotalDollars}
Shipping: ${subtotalDollars >= 60 ? 'FREE' : '$8.00'}
 Customer Email: ${customerEmail || 'not provided'}'''

new_body = '''const emailBody = `
NEW ORDER RECEIVED

Customer: ${customerName || 'Not provided'}
Email: ${customerEmail || 'Not provided'}
Phone: ${customerPhone || 'Not provided'}

Order Total: $${subtotalDollars}
Shipping: ${subtotalDollars >= 60 ? 'FREE' : '$8.00'}'''

if old_body in content:
    content = content.replace(old_body, new_body)
    print("✓ Updated sendOrderNotification email body")
else:
    print("! Email body not found - may need manual update")

# Update subject line to include customer name
old_subject = 'subject: `New Order - $${subtotalDollars}`,'
new_subject = 'subject: `New Order - $${subtotalDollars} - ${customerName}`,'

if old_subject in content:
    content = content.replace(old_subject, new_subject)
    print("✓ Updated email subject line")

# Write updated content
with open('main.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ Done! main.js has been updated.")
print("Now commit and push the changes.")
