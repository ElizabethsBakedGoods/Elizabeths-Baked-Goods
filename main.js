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
		"pretzel-rod-single": { name: "Pretzel Rod", price: 200, flavor: true },
		"pretzel-rod-5": { name: "Pretzel Rods (5)", price: 300, flavor: true },
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
	initializeFormSubmission();
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

	// Determine shipping rate
	const shippingRate = subtotalDollars >= 60 ? CONFIG.shippingRates.free : CONFIG.shippingRates.standard;
	
	showCartMessage("Redirecting to checkout...");

	try {
		// Initialize Stripe
		const stripe = Stripe(CONFIG.stripePublishableKey);

		// Create line items for Stripe
		const lineItems = cart.map(item => ({
			price_data: {
				currency: "usd",
				product_data: {
					name: item.name,
					description: `Flavor: ${item.flavor}`,
				},
				unit_amount: item.price,
			},
			quantity: item.quantity,
		}));

		// Redirect to Stripe Checkout
		const { error } = await stripe.redirectToCheckout({
			lineItems: lineItems,
			mode: "payment",
			shippingRates: [shippingRate],
			successUrl: `${window.location.origin}?checkout=success`,
			cancelUrl: `${window.location.origin}?checkout=cancel`,
		});

		if (error) {
			console.error("Stripe error:", error);
			alert("Sorry, there was a problem with checkout. Please try again or call us.");
		}
	} catch (error) {
		console.error("Checkout error:", error);
		alert("Sorry, there was a problem. Please try again or call us at (330) 842-9877.");
	}
}

// Keep the Formspree form submission for custom/inquiry orders
function initializeFormSubmission() {
	const form = document.getElementById("orderForm") || document.querySelector("#order .order-form form");
	const statusEl = document.getElementById("order-status");

	if (!form) return;

	form.addEventListener("submit", async (e) => {
		e.preventDefault();

		// Gather data
		const formData = new FormData(form);
		const name = (formData.get("name") || "").toString().trim();
		const email = (formData.get("email") || "").toString().trim();
		const item = (formData.get("item") || "").toString();
		const flavor = (formData.get("flavor") || "").toString();
		const instructions = (formData.get("instructions") || "").toString();

		// Basic validation
		if (!name || !email || !item || !flavor) {
			showStatus(statusEl, "Please fill out your name, email, item, and flavor.", false);
			return;
		}

		showStatus(statusEl, "Submitting your order…", true);

		try {
			// Send to Formspree
			const response = await fetch(CONFIG.formspreeEndpoint, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Accept": "application/json"
				},
				body: JSON.stringify({
					name,
					email,
					item,
					flavor,
					instructions: instructions || "None",
					submitted_at: new Date().toLocaleString()
				})
			});

			if (!response.ok) {
				throw new Error("Failed to submit order");
			}

			showStatus(statusEl, "Thank you! Your inquiry has been received. We'll contact you soon!", true);
			form.reset();
		} catch (error) {
			showStatus(statusEl, "Sorry, there was a problem submitting your inquiry. Please try again or call us at (330) 842-9877.", false);
			console.error("Form submission error:", error);
		}
	});
}

function showStatus(el, msg, ok) {
	if (!el) return;
	el.textContent = msg;
	el.style.color = ok ? "#155724" : "#8a1c1c";
}

