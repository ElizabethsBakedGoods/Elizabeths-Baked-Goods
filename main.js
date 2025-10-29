// Stripe Checkout with dynamic shipping rates
const CONFIG = {
	formspreeEndpoint: "https://formspree.io/f/mgvpvzkz",
	stripePublishableKey: "pk_live_51SNIwWAKipJWOAbPpTyitJZ0bjUS8DtFYMDOwWW7vfmUpXqaP4C5U9rq4cGhG6iragLQ0CrKlQgo5az178HPRg4I00y6YwznJ8",
	// Optional: When set, we will create a Stripe Checkout Session via this endpoint
	// Example: "https://your-worker-subdomain.workers.dev/checkout"
	workerEndpoint: "",
	shippingRates: {
		standard: "shr_1SNN8uAKipJWOAbPTYYrDSiC", // $8 standard shipping
		free: "shr_1SNN9iAKipJWOAbPoHVk3SfH" // Free shipping over $60
	},
	paymentLinks: {
		// Cookies
		"cookies-4": "https://buy.stripe.com/5kQ14merf16L0V44vH1VK0v",
		"cookies-6": "https://buy.stripe.com/6oUdR81Et6r5fPYe6h1VK0u",
		"cookies-8": "https://buy.stripe.com/00wbJ0bf34iX1Z80fr1VK0t",
		"cookies-12": "https://buy.stripe.com/dRm3cuerf2aP5bk5zL1VK0s",
		"large-cookies-4": "https://buy.stripe.com/cNieVcdnb4iX33c5zL1VK0r",
		"large-cookies-6": "https://buy.stripe.com/dRm9AS82Rg1F6fo5zL1VK0q",
		"large-cookies-12": "https://buy.stripe.com/3cIcN4dnb6r5cDMfal1VK0o",
		"gourmet-brownies-4": "https://buy.stripe.com/3cIaEW2IxaHl0V46DP1VK0n",
		"gourmet-brownies-6": "https://buy.stripe.com/eVq28qfvj5n1avE8LX1VK0m",
		"gourmet-brownies-8": "https://buy.stripe.com/8x26oG6YNdTxcDM2nz1VK0l",
		"gourmet-brownies-12": "https://buy.stripe.com/7sY3cu3MB3eT33cd2d1VK0k",
		"cupcake-dozen": "https://buy.stripe.com/cNi8wOaaZ2aP9rA7HT1VK0g",
		"cerealbar-ricekrispies": "https://buy.stripe.com/cNi28qerfeXB7js3rD1VK0e",
		"cerealbar-fruitypebbles": "https://buy.stripe.com/00w9AS96VdTxeLU1jv1VK0b",
		"cerealbar-reesespuffs": "https://buy.stripe.com/aFa6oG1Et9Dh0V43rD1VK07",
		"pretzel-large-3": "https://buy.stripe.com/9B67sK1EtaHl6fod2d1VK01",
		"cottoncandy-large": "https://buy.stripe.com/9B6eVcdnbdTxavE6DP1VK03",
		"popcorn-gourmet": "https://buy.stripe.com/3cIaEW5UJ6r56foe6h1VK02",
		"cookiecake-small": "https://buy.stripe.com/14A6oG1Et5n1avEfal1VK0j",
		"cookiecake-medium": "https://buy.stripe.com/5kQbJ0fvjg1FfPYaU51VK0i",
		"cookiecake-large": "https://buy.stripe.com/14AdR896VeXBeLU2nz1VK0h"
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
		// Brownies (no flavor selection - classic only)
		"brownies-4": { name: "Brownies 4 count", price: 1600, flavor: false },
		"brownies-6": { name: "Brownies 6 count", price: 2400, flavor: false },
		"brownies-8": { name: "Brownies 8 count", price: 3200, flavor: false },
		"brownies-12": { name: "Brownies 12 count", price: 4800, flavor: false },
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
		// Pretzels (no flavor selection)
		"pretzel-large-3": { name: "Large Pretzel Set (3)", price: 300, flavor: false },
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
let pendingProductId = null; // For flavor selection modal

// Flavor options by product type
const FLAVOR_OPTIONS = {
	cookies: [
		"Chocolate Chip", "Double Chocolate Chunk", "S'mores", "Peanut Butter",
		"Toffee", "Biscoff", "Almond Coconut", "Pecan Pie Shortbread", "Sprinkle"
	],
	brownies: [
		"Classic Chocolate", "S'mores", "Cookie Dough", "Oreo",
		"Caramel Turtle", "Biscoff", "Peanut Butter Swirl", "Coffee", "Variety"
	],
	cupcakes: ["Vanilla", "Chocolate", "Red Velvet"],
	cottoncandy: ["Blue Raspberry", "Strawberry", "Grape", "Orange", "Lemon", "Cherry", "Pink Vanilla"],
	popcorn: ["Caramel", "Cheddar", "Classic Butter", "Oreo", "Unicorn", "Chocolate Drizzle"]
};

// Make removeFromCart available globally
window.removeFromCart = function(index) {
	cart.splice(index, 1);
	updateCartDisplay();
};

window.addEventListener("load", () => {
	initializeCart();
	initializeFlavorModal();
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
			const product = CONFIG.products[productId];
			
			// If product requires flavor selection, show modal
			if (product && product.flavor) {
				pendingProductId = productId;
				showFlavorModal(productId);
			} else {
				// No flavor needed, add directly
				addToCart(productId, "N/A");
			}
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

function initializeFlavorModal() {
	const modal = document.getElementById("flavor-modal");
	const confirmBtn = document.getElementById("flavor-confirm");
	const cancelBtn = document.getElementById("flavor-cancel");
	
	if (!modal || !confirmBtn || !cancelBtn) return;
	
	confirmBtn.addEventListener("click", () => {
		const flavorSelect = document.getElementById("flavor-select");
		const selectedFlavor = flavorSelect.value;
		
		if (!selectedFlavor) {
			alert("Please select a flavor");
			return;
		}
		
		if (pendingProductId) {
			addToCart(pendingProductId, selectedFlavor);
			pendingProductId = null;
		}
		
		modal.style.display = "none";
	});
	
	cancelBtn.addEventListener("click", () => {
		modal.style.display = "none";
		pendingProductId = null;
	});
}

function showFlavorModal(productId) {
	const modal = document.getElementById("flavor-modal");
	const flavorSelect = document.getElementById("flavor-select");
	const title = document.getElementById("flavor-modal-title");
	
	if (!modal || !flavorSelect) return;
	
	// Determine flavor options based on product
	let flavors = [];
	if (productId.includes("cookies") || productId.includes("cookie")) {
		flavors = FLAVOR_OPTIONS.cookies;
	} else if (productId.includes("gourmet-brownie")) {
		// Only gourmet brownies get flavor selection
		flavors = FLAVOR_OPTIONS.brownies;
	} else if (productId.includes("cupcake")) {
		flavors = FLAVOR_OPTIONS.cupcakes;
	} else if (productId.includes("cottoncandy")) {
		flavors = FLAVOR_OPTIONS.cottoncandy;
	} else if (productId.includes("popcorn")) {
		flavors = FLAVOR_OPTIONS.popcorn;
	} else {
		flavors = ["Classic"]; // default
	}
	
	// Populate select
	flavorSelect.innerHTML = '<option value="">-- Select Flavor --</option>';
	flavors.forEach(flavor => {
		const option = document.createElement("option");
		option.value = flavor;
		option.textContent = flavor;
		flavorSelect.appendChild(option);
	});
	
	title.textContent = `Choose Your Flavor`;
	modal.style.display = "flex";
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
	const contactForm = document.getElementById("contact-form");

	if (!cartItems || !cartTotal) return;

	if (cart.length === 0) {
		if (cartEmpty) cartEmpty.style.display = "block";
		if (checkoutBtn) checkoutBtn.style.display = "none";
		if (contactForm) contactForm.style.display = "none";
		cartItems.innerHTML = "";
		cartTotal.textContent = "$0.00";
		return;
	}

	if (cartEmpty) cartEmpty.style.display = "none";
	if (checkoutBtn) checkoutBtn.style.display = "inline-block";
	if (contactForm) contactForm.style.display = "block";

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

	// Preferred: If a serverless endpoint is configured, create a Checkout Session for the whole cart
	if (CONFIG.workerEndpoint && CONFIG.workerEndpoint.trim() !== "") {
		try {
			const shippingRateId = subtotalDollars >= 60 ? CONFIG.shippingRates.free : CONFIG.shippingRates.standard;
			const res = await fetch(CONFIG.workerEndpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ cart, shippingRateId })
			});
			const data = await res.json();
			if (!res.ok || !data.url) {
				throw new Error(data.error || "Failed to create checkout session");
			}
			// Store order for post-success notification
			sessionStorage.setItem('pendingOrder', JSON.stringify(cart));
			// Redirect to Stripe Checkout Session URL
			window.location.href = data.url;
			return;
		} catch (err) {
			console.error("Worker checkout error:", err);
			// Fall through to payment link or email flow
		}
	}

	// Fallback: If cart has only ONE item, redirect directly to its Stripe payment link
	if (cart.length === 1) {
		const item = cart[0];
		const paymentLink = CONFIG.paymentLinks[item.id];
		if (paymentLink) {
			// Send you an order email via Formspree before redirecting
			try { await sendOrderNotification(cart); } catch (e) { console.warn('Notify failed (non-blocking):', e); }
			sessionStorage.setItem('pendingOrder', JSON.stringify(cart));
			// Redirect to Stripe Payment Link (collects shipping/contact configured in Stripe)
			window.location.href = paymentLink;
			return;
		}
	}
	
	// For multiple items, collect a contact email and notify you to send a combined link
	// Ask customer for an email to receive the payment link
	let customerEmail = prompt("Enter your email to receive one secure payment link for your full order:");
	if (!customerEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(customerEmail)) {
		alert("Please enter a valid email address to continue.");
		return;
	}

	const orderDetails = cart.map((item, i) => 
		`${i + 1}. ${item.name} - Flavor: ${item.flavor} - $${(item.price / 100).toFixed(2)}`
	).join('\n');
	
	const shippingCost = subtotalDollars >= 60 ? 'FREE' : '$8.00';
	const grandTotal = subtotalDollars >= 60 ? subtotalDollars : subtotalDollars + 8;
	
	const emailBody = encodeURIComponent(
		`Hello! I'd like to place the following order:\n\n${orderDetails}\n\nSubtotal: $${subtotalDollars.toFixed(2)}\nShipping: ${shippingCost}\nTotal: $${grandTotal.toFixed(2)}\n\nPlease send me a Stripe payment link to complete my order. Thank you!`
	);
	
	const emailSubject = encodeURIComponent(`New Order - $${grandTotal.toFixed(2)}`);
	
	const message = `📦 Your Order (${cart.length} items):\n\n${cart.map((item, i) => `${i + 1}. ${item.name} (${item.flavor})`).join('\n')}\n\nSubtotal: $${subtotalDollars.toFixed(2)}\nShipping: ${shippingCost}\nTotal: $${grandTotal.toFixed(2)}\n\nWe’ll email you one secure Stripe link to pay for all items together.\nClick OK to send your order.`;
	
	// Send you an order email via Formspree so you can reply with a combined link
	try { await sendOrderNotification(cart, customerEmail); } catch (e) { console.warn('Notify failed (non-blocking):', e); }
	alert(message + "\n\nThanks! We\'ll email your payment link shortly.");
	
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
async function sendOrderNotification(orderItems, customerEmail) {
	const subtotal = orderItems.reduce((sum, item) => sum + item.price, 0);
	const subtotalDollars = (subtotal / 100).toFixed(2);
	
	// Format order details for email
	const orderDetails = orderItems.map((item, index) => 
		`${index + 1}. ${item.name} - Flavor: ${item.flavor} - $${(item.price / 100).toFixed(2)}`
	).join('\n');
	
	const emailBody = `
NEW ORDER RECEIVED

Customer: ${customerName || 'Not provided'}
Email: ${customerEmail || 'Not provided'}
Phone: ${customerPhone || 'Not provided'}

Order Total: ${subtotalDollars}
Shipping: ${subtotalDollars >= 60 ? 'FREE' : '$8.00'}otal: $${subtotalDollars}
Shipping: ${subtotalDollars >= 60 ? 'FREE' : '$8.00'}
 Customer Email: ${customerEmail || 'not provided'}

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
				_replyto: customerEmail || "noreply@elizabethsbakedgoods.com"
			}),
		});
		
		console.log("Order notification sent successfully");
	} catch (error) {
		console.error("Failed to send order notification:", error);
		// Don't show error to customer - they already paid successfully
	}
}
