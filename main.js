// Stripe Checkout with dynamic shipping rates
const CONFIG = {
	formspreeEndpoint: "https://formspree.io/f/mgvpvzkz",
	stripePublishableKey: "pk_live_51SNIwWAKipJWOAbPpTyitJZ0bjUS8DtFYMDOwWW7vfmUpXqaP4C5U9rq4cGhG6iragLQ0CrKlQgo5az178HPRg4I00y6YwznJ8",
	shippingRates: {
		standard: "shr_1SNN8uAKipJWOAbPTYYrDSiC", // $8 standard shipping
		free: "shr_1SNN9iAKipJWOAbPoHVk3SfH" // Free shipping over $60
	},
	products: {
		// Small Cookies
		"cookies-4": { name: "Small Cookies Pack of 4", price: 800, flavor: true },
		"cookies-6": { name: "Small Cookies Pack of 6", price: 1200, flavor: true },
		"cookies-8": { name: "Small Cookies Pack of 8", price: 1800, flavor: true },
		"cookies-12": { name: "Small Cookies Pack of 12", price: 2400, flavor: true },
		// Large Cookies
		"large-cookies-4": { name: "Large Cookies Pack of 4", price: 1600, flavor: true },
		"large-cookies-6": { name: "Large Cookies Pack of 6", price: 2400, flavor: true },
		"large-cookies-8": { name: "Large Cookies Pack of 8", price: 3200, flavor: true },
		"large-cookies-12": { name: "Large Cookies Pack of 12", price: 4800, flavor: true },
		// Brownies
		"brownies-4": { name: "Brownies 4 count", price: 1600, flavor: true },
		"brownies-6": { name: "Brownies 6 count", price: 2400, flavor: true },
		"brownies-8": { name: "Brownies 8 count", price: 3200, flavor: true },
		"brownies-12": { name: "Brownies 12 count", price: 4800, flavor: true },
		// Gourmet Brownies
		"gourmet-brownies-4": { name: "Gourmet Brownies 4 count", price: 3200, flavor: true },
		"gourmet-brownies-6": { name: "Gourmet Brownies 6 count", price: 4800, flavor: true },
		"gourmet-brownies-8": { name: "Gourmet Brownies 8 count", price: 6400, flavor: true },
		"gourmet-brownies-12": { name: "Gourmet Brownies 12 count", price: 9600, flavor: true },
		// Cupcakes
		"cupcake-single": { name: "Cupcake", price: 400, flavor: true },
		"cupcake-dozen": { name: "Cupcakes (dozen)", price: 4000, flavor: true },
		// Cereal Bars
		"cerealbar-ricekrispies": { name: "Rice Krispies Cereal Bar", price: 300, flavor: false },
		"cerealbar-fruitypebbles": { name: "Fruity Pebbles Cereal Bar", price: 300, flavor: false },
		"cerealbar-reesespuffs": { name: "Reese's Puffs Cereal Bar", price: 300, flavor: false },
		// Pretzels
		"pretzel-large-3": { name: "Large Pretzel Set (3)", price: 300, flavor: true },
		// Cotton Candy
		"cottoncandy-large": { name: "Large Cotton Candy", price: 800, flavor: true },
		"cottoncandy-small": { name: "Small Cotton Candy", price: 400, flavor: true },
		// Popcorn
		"popcorn-gourmet": { name: "Gourmet Popcorn", price: 800, flavor: true },
		// Cookie Cakes
		"cookiecake-small": { name: "Small Cookie Cake (6\")", price: 2500, flavor: true },
		"cookiecake-medium": { name: "Medium Cookie Cake (8\")", price: 3500, flavor: true },
		"cookiecake-large": { name: "Large Cookie Cake (12\")", price: 5000, flavor: true }
	}
};

// Shopping cart
let cart = [];

// Make removeFromCart available globally
window.removeFromCart = function(index) {
	cart.splice(index, 1);
	updateCartDisplay();
};

window.addEventListener("load", () => {
	initializeCart();
	checkForSuccessfulCheckout();
});

function initializeCart() {
	const cartContainer = document.getElementById("cart-container");
	const checkoutBtn = document.getElementById("checkout-btn");
	
	if (!cartContainer || !checkoutBtn) {
		console.error("Cart container or checkout button not found");
		return;
	}

	console.log("Initializing cart...");

	// Add to cart button listeners
	const buttons = document.querySelectorAll(".add-to-cart-btn");
	console.log(`Found ${buttons.length} add-to-cart buttons`);
	
	buttons.forEach((btn, index) => {
		const productId = btn.dataset.product;
		console.log(`Button ${index}: product=${productId}`);
		
		btn.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			const flavor = btn.dataset.flavor || "Classic";
			console.log("Button clicked! Product:", productId, "Flavor:", flavor);
			addToCart(productId, flavor);
		});
	});

	// Checkout button
	checkoutBtn.addEventListener("click", async (e) => {
		e.preventDefault();
		await handleCheckout();
	});

	updateCartDisplay();
	console.log("Cart initialized successfully");
}

function addToCart(productId, flavor) {
	const product = CONFIG.products[productId];
	if (!product) {
		console.error("Product not found:", productId);
		return;
	}

	cart.push({
		id: productId,
		name: product.name,
		price: product.price,
		flavor: flavor,
		quantity: 1
	});

	console.log("Cart updated:", cart);
	updateCartDisplay();
	showCartMessage("Added to cart!");
}

function removeFromCart(index) {
	cart.splice(index, 1);
	updateCartDisplay();
}

function updateCartDisplay() {
	const cartItems = document.getElementById("cart-items");
	const cartTotal = document.getElementById("cart-total");
	const checkoutBtn = document.getElementById("checkout-btn");
	const cartEmpty = document.getElementById("cart-empty");

	if (!cartItems || !cartTotal) return;

	if (cart.length === 0) {
		if (cartEmpty) cartEmpty.style.display = "block";
		if (checkoutBtn) checkoutBtn.style.display = "none";
		cartItems.innerHTML = "";
		cartTotal.textContent = "$0.00";
		return;
	}

	if (cartEmpty) cartEmpty.style.display = "none";
	if (checkoutBtn) checkoutBtn.style.display = "inline-block";

	// Render cart items
	cartItems.innerHTML = cart.map((item, index) => `
		<div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem; border-bottom:1px solid #e0e0e0;">
			<div>
				<strong>${item.name}</strong><br>
				<small>Flavor: ${item.flavor}</small>
			</div>
			<div style="display:flex; align-items:center; gap:1rem;">
				<span>$${(item.price / 100).toFixed(2)}</span>
				<button onclick="removeFromCart(${index})" class="remove-btn" style="background:#dc3545; color:white; border:none; padding:0.3rem 0.6rem; border-radius:4px; cursor:pointer;">Remove</button>
			</div>
		</div>
	`).join("");

	// Calculate total
	const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
	cartTotal.textContent = `$${(subtotal / 100).toFixed(2)}`;
}

function showCartMessage(msg) {
	const messageEl = document.getElementById("cart-message");
	if (!messageEl) return;
	
	messageEl.textContent = msg;
	messageEl.style.display = "block";
	setTimeout(() => {
		messageEl.style.display = "none";
	}, 2000);
}

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

	// Build order details for email
	const orderDetails = cart.map((item, i) => 
		`${i + 1}. ${item.name} - Flavor: ${item.flavor} - $${(item.price / 100).toFixed(2)}`
	).join('\n');
	
	const shippingCost = subtotalDollars >= 60 ? 'FREE' : '$8.00';
	const grandTotal = subtotalDollars >= 60 ? subtotalDollars : subtotalDollars + 8;
	
	const emailBody = encodeURIComponent(
		`Hello! I'd like to place the following order:\n\n${orderDetails}\n\nSubtotal: $${subtotalDollars.toFixed(2)}\nShipping: ${shippingCost}\nTotal: $${grandTotal.toFixed(2)}\n\nPlease send me a Stripe payment link to complete my order. Thank you!`
	);
	
	const emailSubject = encodeURIComponent(`New Order - $${grandTotal.toFixed(2)}`);
	
	// Show order summary and open email
	const message = `📦 Your Order Summary:\n\n${cart.map((item, i) => `${i + 1}. ${item.name} (${item.flavor})`).join('\n')}\n\nSubtotal: $${subtotalDollars.toFixed(2)}\nShipping: ${shippingCost}\nTotal: $${grandTotal.toFixed(2)}\n\nClick OK to email your order, and we'll send you a secure payment link!`;
	
	alert(message);
	
	// Open default email client with order details
	window.location.href = `mailto:ElizabethsBakedGoods@gmail.com?subject=${emailSubject}&body=${emailBody}`;
	
	// Clear cart after sending order
	setTimeout(() => {
		cart = [];
		updateCartDisplay();
	}, 1000);
}

// Check if returning from successful checkout and send notification
function checkForSuccessfulCheckout() {
	const urlParams = new URLSearchParams(window.location.search);
	
	if (urlParams.get('checkout') === 'success') {
		const pendingOrder = sessionStorage.getItem('pendingOrder');
		
		if (pendingOrder) {
			try {
				const orderItems = JSON.parse(pendingOrder);
				sendOrderNotification(orderItems);
				sessionStorage.removeItem('pendingOrder');
				
				// Clear the cart
				cart = [];
				updateCartDisplay();
				
				// Show success message
				alert("Thank you for your order! You'll receive a confirmation email shortly.");
				
				// Clean up URL
				window.history.replaceState({}, document.title, window.location.pathname);
			} catch (error) {
				console.error("Error processing order notification:", error);
			}
		}
	}
}

// Send order notification to Formspree
async function sendOrderNotification(orderItems) {
	const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);
	const subtotalDollars = (subtotal / 100).toFixed(2);
	
	// Format order details for email
	const orderDetails = orderItems.map((item, index) => 
		`${index + 1}. ${item.name} - Flavor: ${item.flavor} - $${(item.price / 100).toFixed(2)}`
	).join('\n');
	
	const emailBody = `
NEW ORDER RECEIVED

Order Total: $${subtotalDollars}
Shipping: ${subtotalDollars >= 60 ? 'FREE' : '$8.00'}

Items:
${orderDetails}

---
Order placed via Stripe Checkout
Customer will receive Stripe email receipt
	`.trim();

	try {
		await fetch(CONFIG.formspreeEndpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				subject: `New Order - $${subtotalDollars}`,
				message: emailBody,
				_replyto: "noreply@elizabethsbakedgoods.com"
			}),
		});
		
		console.log("Order notification sent successfully");
	} catch (error) {
		console.error("Failed to send order notification:", error);
		// Don't show error to customer - they already paid successfully
	}
}
