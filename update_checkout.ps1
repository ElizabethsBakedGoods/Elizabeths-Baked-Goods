# PowerShell script to update main.js with new checkout flow

Write-Host "Reading main.js..." -ForegroundColor Cyan
$content = Get-Content "main.js" -Raw

# 1. Replace handleCheckout function
Write-Host "Updating handleCheckout function..." -ForegroundColor Yellow

$oldCheckoutPattern = 'async function handleCheckout\(\) \{[\s\S]*?\n\}\n\n// Check if returning from successful checkout'

$newCheckout = @'
async function handleCheckout() {
	if (cart.length === 0) {
		alert("Your cart is empty!");
		return;
	}

	const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
	const subtotalDollars = subtotal / 100;

	// Enforce $25 minimum
	if (subtotalDollars < 25) {
		alert("Minimum order for shipping is $25. Please add more items to your cart.");
		return;
	}

	// Validate contact info
	const customerName = document.getElementById("customer-name")?.value.trim();
	const customerEmail = document.getElementById("customer-email")?.value.trim();
	const customerPhone = document.getElementById("customer-phone")?.value.trim();

	if (!customerName || !customerEmail || !customerPhone) {
		alert("Please fill in all contact information (Name, Email, Phone)");
		return;
	}

	if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customerEmail)) {
		alert("Please enter a valid email address");
		return;
	}

	// Always send order notification via Formspree
	const shippingCost = subtotalDollars >= 60 ? 'FREE' : '$8.00';
	const grandTotal = subtotalDollars >= 60 ? subtotalDollars : subtotalDollars + 8;
	
	try {
		await sendOrderNotification(cart, customerEmail, customerName, customerPhone);
	} catch (e) {
		console.error('Formspree notification failed:', e);
	}

	// If cart has only ONE item, redirect directly to its Stripe payment link
	if (cart.length === 1) {
		const item = cart[0];
		const paymentLink = CONFIG.paymentLinks[item.id];
		if (paymentLink) {
			sessionStorage.setItem('pendingOrder', JSON.stringify(cart));
			alert(`Redirecting to secure checkout for ${item.name}...`);
			window.location.href = paymentLink;
			return;
		}
	}
	
	// For multiple items: confirm order received
	alert(`Thank you, ${customerName}!\n\nYour order has been received:\n${cart.length} items • Total: $${grandTotal.toFixed(2)}\n\nWe'll email you a secure payment link at:\n${customerEmail}\n\nExpect it within 1 hour!`);
	
	cart = [];
	updateCartDisplay();
	
	// Clear contact form
	document.getElementById("customer-name").value = "";
	document.getElementById("customer-email").value = "";
	document.getElementById("customer-phone").value = "";
}

// Check if returning from successful checkout
'@

$content = $content -replace $oldCheckoutPattern, $newCheckout
Write-Host "✓ Updated handleCheckout function" -ForegroundColor Green

# 2. Update sendOrderNotification function signature
Write-Host "Updating sendOrderNotification function..." -ForegroundColor Yellow

$content = $content -replace 'async function sendOrderNotification\(orderItems, customerEmail\)', 'async function sendOrderNotification(orderItems, customerEmail, customerName, customerPhone)'
Write-Host "✓ Updated function signature" -ForegroundColor Green

# 3. Update email body
$oldEmailBody = @'
const emailBody = `
NEW ORDER RECEIVED

Order Total: \$\$\{subtotalDollars\}
Shipping: \$\{subtotalDollars >= 60 \? 'FREE' : '\$8\.00'\}
 Customer Email: \$\{customerEmail \|\| 'not provided'\}
'@

$newEmailBody = @'
const emailBody = `
NEW ORDER RECEIVED

Customer: ${customerName || 'Not provided'}
Email: ${customerEmail || 'Not provided'}
Phone: ${customerPhone || 'Not provided'}

Order Total: $${subtotalDollars}
Shipping: ${subtotalDollars >= 60 ? 'FREE' : '$8.00'}
'@

$content = $content -replace [regex]::Escape($oldEmailBody.Substring(0,50)), $newEmailBody
Write-Host "✓ Updated email body" -ForegroundColor Green

# 4. Update email subject
$content = $content -replace 'subject: `New Order - \$\$\{subtotalDollars\}`', 'subject: `New Order - $${subtotalDollars} - ${customerName}`'
Write-Host "✓ Updated email subject" -ForegroundColor Green

# Save the file
Set-Content "main.js" -Value $content -NoNewline
Write-Host "`n✅ Done! main.js has been updated." -ForegroundColor Green
Write-Host "Now commit and push the changes with git." -ForegroundColor Cyan
