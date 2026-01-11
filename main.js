// Stripe Checkout with dynamic shipping rates
console.log("📦 [main.js] LOADING - Elizabeth's Baked Goods shopping system initializing...");
console.log("📦 [main.js] Current time:", new Date().toISOString());

const CONFIG = {
	formspreeEndpoint: "https://formspree.io/f/mgvpvzkz",
	stripePublishableKey: "pk_live_51SNIwWAKipJWOAbPpTyitJZ0bjUS8DtFYMDOwWW7vfmUpXqaP4C5U9rq4cGhG6iragLQ0CrKlQgo5az178HPRg4I00y6YwznJ8",
	// Cloudflare Worker endpoint for multi-item checkout
	workerEndpoint: "https://elizabeths-checkout.bethsbakedgoodss.workers.dev",
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
		"cookies-4": { name: "Small Cookies Pack of 4", price: 1200, flavor: true },
		"cookies-6": { name: "Small Cookies Pack of 6", price: 1800, flavor: true },
		"cookies-8": { name: "Small Cookies Pack of 8", price: 2400, flavor: true },
		"cookies-12": { name: "Small Cookies Pack of 12", price: 3600, flavor: true },
		// Large Cookies
		"large-cookies-4": { name: "Large Cookies Pack of 4", price: 2000, flavor: true },
		"large-cookies-6": { name: "Large Cookies Pack of 6", price: 3000, flavor: true },
		"large-cookies-8": { name: "Large Cookies Pack of 8", price: 4000, flavor: true },
		"large-cookies-12": { name: "Large Cookies Pack of 12", price: 6000, flavor: true },
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
		"cupcake-6": { name: "Cupcakes (6 count)", price: 2400, flavor: true },
		"cupcake-12": { name: "Cupcakes (12 count)", price: 4800, flavor: true },
		"cupcake-24": { name: "Cupcakes (24 count)", price: 9600, flavor: true },
		// Cereal Bars
		"cerealbar-ricekrispies": { name: "Rice Krispies Cereal Bar", price: 3600, flavor: false },
		"cerealbar-fruitypebbles": { name: "Fruity Pebbles Cereal Bar", price: 3600, flavor: false },
		"cerealbar-reesespuffs": { name: "Reese's Puffs Cereal Bar", price: 3600, flavor: false },
		// Pretzels
		"pretzel-rod": { name: "Chocolate Pretzel Rod", price: 200, flavor: false },
		"pretzel-large-3": { name: "Large Pretzel Set (3)", price: 300, flavor: false },
		// Popcorn
		"popcorn-gourmet": { name: "Gourmet Popcorn (10 oz)", price: 1500, flavor: true },
		// Cookie Cakes
		"cookiecake-small": { name: "Small Cookie Cake (6\")", price: 3000, flavor: true },
		"cookiecake-medium": { name: "Medium Cookie Cake (8\")", price: 4000, flavor: true },
		"cookiecake-large": { name: "Large Cookie Cake (12\")", price: 5500, flavor: true },
		// Gift Basket
		"gift-basket": { name: "Holiday Gift Basket", price: 5000, flavor: false }
	}
};
console.log("📦 [main.js] CONFIG object defined with", Object.keys(CONFIG.products).length, "products");

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
	console.log("🚀 Window load event fired - initializing shopping system...");
	initializeCart();
	initializeFlavorModal();
	checkForSuccessfulCheckout();
	console.log("✅ All initializations complete");
});

// Note: window.addProductToCart is defined in order.html inline script
// This ensures it's available immediately for onclick handlers
// Main.js just needs to ensure addToCart, showFlavorModal, etc. are available when called

function initializeCart() {
	const cartContainer = document.getElementById("cart-container");
	const checkoutBtn = document.getElementById("checkout-btn");
	
	if (!cartContainer || !checkoutBtn) {
		console.error("❌ Cart container or checkout button not found");
		console.error("  - cartContainer found:", !!cartContainer);
		console.error("  - checkoutBtn found:", !!checkoutBtn);
		return;
	}

	console.log("✅ Initializing cart...");

	// Add to cart button listeners
	const buttons = document.querySelectorAll(".add-to-cart-btn");
	console.log(`✅ Found ${buttons.length} add-to-cart buttons`);
	
	if (buttons.length === 0) {
		console.error("❌ NO BUTTONS FOUND! Check if HTML has class='add-to-cart-btn'");
		return;
	}
	
	buttons.forEach((btn, index) => {
		const productId = btn.dataset.product;
		console.log(`   Button ${index + 1}: data-product="${productId}"`);
		
		btn.addEventListener("click", function(e) {
			console.log(`✅ Button clicked: ${productId}`);
			e.preventDefault();
			e.stopPropagation();
			const product = CONFIG.products[productId];
			
			if (!product) {
				console.error(`❌ Product not found in CONFIG: ${productId}`);
				console.error("Available products:", Object.keys(CONFIG.products));
				alert("Product configuration not found. Please contact support.");
				return;
			}
			
			console.log(`✅ Product found: ${product.name}`);
			
			// If product requires flavor selection, show modal
			if (product.flavor) {
				console.log(`📋 Showing flavor modal for: ${productId}`);
				pendingProductId = productId;
				showFlavorModal(productId);
			} else {
				// No flavor needed, add directly
				console.log(`✨ Adding product without flavor selection: ${productId}`);
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
	console.log("✅ Cart initialized successfully");
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
	console.log(`📋 showFlavorModal called for: ${productId}`);
	const modal = document.getElementById("flavor-modal");
	const flavorSelect = document.getElementById("flavor-select");
	const title = document.getElementById("flavor-modal-title");
	
	if (!modal || !flavorSelect) {
		console.error("❌ Modal elements not found");
		console.error("  - modal found:", !!modal);
		console.error("  - flavorSelect found:", !!flavorSelect);
		return;
	}
	
	// Determine flavor options based on product
	let flavors = [];
	if (productId.includes("cookies") || productId.includes("cookie")) {
		flavors = FLAVOR_OPTIONS.cookies;
	} else if (productId.includes("gourmet-brownies")) {
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
	console.log(`✅ Flavor modal opened with ${flavors.length} options`);
}

function addToCart(productId, flavor) {
	console.log(`🛒 addToCart called: productId="${productId}", flavor="${flavor}"`);
	const product = CONFIG.products[productId];
	if (!product) {
		console.error(`❌ Product not found: ${productId}`);
		return;
	}

	cart.push({
		id: productId,
		name: product.name,
		price: product.price,
		flavor: flavor,
		quantity: 1
	});

	console.log(`✅ Item added to cart: ${product.name} - $${(product.price/100).toFixed(2)}`);
	console.log("Cart contents:", cart);
	updateCartDisplay();
	showCartMessage("Added to cart!");
}

// Helper function for custom items (like gift basket)
window.addItemToCart = function(productId, price, customDetails) {
	cart.push({
		id: productId,
		name: 'Holiday Gift Basket',
		price: price,
		flavor: customDetails,
		quantity: 1
	});
	
	console.log("Custom item added to cart:", cart);
	updateCartDisplay();
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

	// Defensive: default to empty array if cart is undefined
	const items = Array.isArray(cart) ? cart : [];

	if (items.length === 0) {
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

	// Render cart items - safe map with null checks
	cartItems.innerHTML = items.map((item, index) => {
		// Defensive checks for item properties
		const name = (item && item.name) || 'Unknown';
		const flavor = (item && item.flavor) || 'N/A';
		const price = (item && item.price) || 0;
		return `
		<div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem; border-bottom:1px solid #e0e0e0;">
			<div>
				<strong>${name}</strong><br>
				<small>Flavor: ${flavor}</small>
			</div>
			<div style="display:flex; align-items:center; gap:1rem;">
				<span>$${(price / 100).toFixed(2)}</span>
				<button onclick="removeFromCart(${index})" class="remove-btn" style="background:#dc3545; color:white; border:none; padding:0.3rem 0.6rem; border-radius:4px; cursor:pointer;">Remove</button>
			</div>
		</div>
	`;
	}).join("");

	// Calculate total - safe reduce with null checks
	const subtotal = items.reduce((sum, item) => sum + ((item && item.price) || 0), 0);
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
	// Defensive: ensure cart is an array
	const items = Array.isArray(cart) ? cart : [];

	if (items.length === 0) {
		alert("Your cart is empty!");
		return;
	}

	const subtotal = items.reduce((sum, item) => sum + ((item && item.price) || 0), 0);
	const subtotalDollars = subtotal / 100;

	// Enforce $25 minimum
	if (subtotalDollars < 25) {
		alert("Minimum order for shipping is $25. Please add more items to your cart.");
		return;
	}

	// Preferred: If a serverless endpoint is configured, create a Checkout Session for the whole cart
	if (CONFIG.workerEndpoint && CONFIG.workerEndpoint.trim() !== "") {
		try {
			// Always use standard shipping rate ($8)
			const shippingRateId = CONFIG.shippingRates.standard;
			const requestBody = { cart: items, shippingRateId };
			console.log('Sending checkout request:', requestBody);
			
			const res = await fetch(CONFIG.workerEndpoint, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(requestBody)
			});
			const data = await res.json();
			if (!res.ok || !data.url) {
				// Surface worker error to the user and stop here
				alert(`Checkout error: ${data.error || 'Failed to create checkout session'}`);
				return;
			}
			// Store order for post-success notification
			sessionStorage.setItem('pendingOrder', JSON.stringify(items));
			// Redirect to Stripe Checkout Session URL
			window.location.href = data.url;
			return;
		} catch (err) {
			console.error("Worker checkout error:", err);
			alert(`Checkout error: ${err?.message || err}`);
			return;
		}
	}

	// Fallback: If cart has only ONE item, redirect directly to its Stripe payment link
	if (items.length === 1) {
		const item = items[0];
		const paymentLink = item && CONFIG.paymentLinks[item.id];
		if (paymentLink) {
			// Send you an order email via Formspree before redirecting
			try { await sendOrderNotification(items); } catch (e) { console.warn('Notify failed (non-blocking):', e); }
			sessionStorage.setItem('pendingOrder', JSON.stringify(items));
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

	const orderDetails = (Array.isArray(items) ? items : []).map((item, i) => 
		`${i + 1}. ${(item && item.name) || 'Unknown'} - Flavor: ${(item && item.flavor) || 'N/A'} - $${(((item && item.price) || 0) / 100).toFixed(2)}`
	).join('\n');
	
	const shippingCost = subtotalDollars >= 60 ? 'FREE' : '$8.00';
	const grandTotal = subtotalDollars >= 60 ? subtotalDollars : subtotalDollars + 8;
	
	const emailBody = encodeURIComponent(
		`Hello! I'd like to place the following order:\n\n${orderDetails}\n\nSubtotal: $${subtotalDollars.toFixed(2)}\nShipping: ${shippingCost}\nTotal: $${grandTotal.toFixed(2)}\n\nPlease send me a Stripe payment link to complete my order. Thank you!`
	);
	
	const emailSubject = encodeURIComponent(`New Order - $${grandTotal.toFixed(2)}`);
	
	const message = `📦 Your Order (${items.length} items):\n\n${(Array.isArray(items) ? items : []).map((item, i) => `${i + 1}. ${(item && item.name) || 'Unknown'} (${(item && item.flavor) || 'N/A'})`).join('\n')}\n\nSubtotal: $${subtotalDollars.toFixed(2)}\nShipping: ${shippingCost}\nTotal: $${grandTotal.toFixed(2)}\n\nWe'll email you one secure Stripe link to pay for all items together.\nClick OK to send your order.`;
	
	// Send you an order email via Formspree so you can reply with a combined link
	try { await sendOrderNotification(items, customerEmail); } catch (e) { console.warn('Notify failed (non-blocking):', e); }
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
	// Defensive: ensure orderItems is an array
	const items = Array.isArray(orderItems) ? orderItems : [];
	
	const subtotalCents = items.reduce((sum, item) => sum + ((item && item.price) || 0), 0);
	const subtotalDollars = (subtotalCents / 100).toFixed(2);
	const freeShipping = subtotalCents >= 6000; // $60 threshold
	const shippingDollars = freeShipping ? 'FREE' : '$8.00';
	const totalDollars = ((subtotalCents + (freeShipping ? 0 : 800)) / 100).toFixed(2);

	// Format order details for email - safe map
	const orderDetails = (Array.isArray(items) ? items : []).map((item, index) => 
		`${index + 1}. ${(item && item.name) || 'Unknown'} - Flavor: ${(item && item.flavor) || 'N/A'} - $${(((item && item.price) || 0) / 100).toFixed(2)}`
	).join('\n');

	const emailBody = `
NEW ORDER RECEIVED

Customer Email: ${customerEmail || 'not provided'}

Subtotal: $${subtotalDollars}
Shipping: ${shippingDollars}
Total: $${totalDollars}

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
				subject: `New Order - $${totalDollars}`,
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

// ============================================================================
// EXPOSE FUNCTIONS TO WINDOW OBJECT FOR EXTERNAL ACCESS
// ============================================================================
// MOBILE HEADER INITIALIZATION
// ============================================================================
function initializeMobileHeader() {
  const hamburger = document.querySelector('.mobile-header .hamburger');
  const mobileNav = document.querySelector('.mobile-header .mobile-nav');
  
  // Hamburger toggle is optional - can be used for future functionality
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      // Currently hamburger is just for future use or custom menus
      // The main nav stays visible and scrollable on mobile
    });
  }
}

// Initialize mobile header when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeMobileHeader);
} else {
  initializeMobileHeader();
}

// This ensures onclick handlers and other external code can call these functions
// ============================================================================

// Expose CONFIG to window so inline script can access product data
window.CONFIG = CONFIG;
console.log('✅ [main.js] CONFIG exposed to window.CONFIG with', Object.keys(CONFIG.products).length, 'products');

// Expose core cart functions to window
window.addToCart = addToCart;
window.showFlavorModal = showFlavorModal;
window.updateCartDisplay = updateCartDisplay;
window.showCartMessage = showCartMessage;
window.initializeCart = initializeCart;
window.initializeFlavorModal = initializeFlavorModal;
window.handleCheckout = handleCheckout;
window.sendOrderNotification = sendOrderNotification;

console.log("✅ [main.js] All cart functions exposed to window object");

