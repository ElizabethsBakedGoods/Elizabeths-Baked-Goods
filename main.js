// Simple client-side order notifications using EmailJS and optional SMS webhook
// 1) Create an EmailJS account (emailjs.com), add an Email Service and two Templates:
//    - Owner notification template (e.g., template_owner)
//    - Customer confirmation template (e.g., template_customer)
// 2) Fill in the CONFIG values below.
// 3) (Optional) For SMS, create a Zapier/Make webhook that sends a Twilio SMS and paste its URL below.

const CONFIG = {
	emailjsPublicKey: "fxvSd_ExVAwMZmUCn",
	emailjsServiceId: "service_5jsjkh6",
	// Temporarily use the same template for owner notifications so you receive emails now.
	// You can share a dedicated owner template ID later and we'll swap it in.
	emailjsOwnerTemplateId: "template_cc4bkye",
			emailjsCustomerTemplateId: "template_cc4bkye",
	ownerEmail: "bethsbakedgoodss@yahoo.com", // where owner notifications go
	smsWebhookUrl: "", // e.g., https://hooks.zapier.com/hooks/catch/XXXXX/XXXXX
	smsRecipient: "+13308429877", // your phone for SMS notifications (E.164 format)
};

// Initialize EmailJS when SDK is loaded
window.addEventListener("load", () => {
	if (window.emailjs && CONFIG.emailjsPublicKey) {
		try { emailjs.init(CONFIG.emailjsPublicKey); } catch (_) {}
	}

	const form = document.getElementById("orderForm") || document.querySelector("#order .order-form form");
	const statusEl = document.getElementById("order-status");
	const itemSelect = document.getElementById("item-select");
	const flavorGroup = document.getElementById("flavor-group");
	const flavorSelect = document.getElementById("flavor-select");
	const flavorNote = document.getElementById("flavor-note");

	// Map flavor keys to display names
	const FLAVOR_LABELS = {
		"chocolate-chip": "Chocolate Chip",
		"double-chocolate-chunk": "Double Chocolate Chunk",
		"smores": "S'mores",
		"peanut-butter": "Peanut Butter",
		"toffee": "Toffee",
		"biscoff": "Biscoff",
		"almond-coconut": "Almond Coconut",
		"pecan-pie-shortbread": "Pecan Pie Shortbread",
		"sprinkle": "Sprinkle",
		"classic": "Classic Chocolate",
		"cookie-dough": "Cookie Dough",
		"oreo": "Oreo",
		"caramel-turtle": "Caramel Turtle",
		"peanut-butter-swirl": "Peanut Butter Swirl",
		"coffee": "Coffee",
		"vanilla": "Vanilla",
		"chocolate": "Chocolate",
		"red-velvet": "Red Velvet",
		"lemon": "Lemon",
		"strawberry": "Strawberry",
		"rice-krispies": "Rice Krispies",
		"fruity-pebbles": "Fruity Pebbles",
		"reeses-puffs": "Reese's Puffs",
		"milk-chocolate": "Milk Chocolate",
		"white-chocolate": "White Chocolate",
		"blue-raspberry": "Blue Raspberry",
		"grape": "Grape",
		"caramel": "Caramel",
		"cheddar": "Cheddar",
		// ...add more as needed
	};

	// Show/hide and populate flavor dropdown based on item
	if (itemSelect && flavorGroup && flavorSelect) {
		itemSelect.addEventListener("change", function() {
			const selected = itemSelect.options[itemSelect.selectedIndex];
			const flavorList = selected.getAttribute("data-flavors");
			const price = selected.getAttribute("data-price") || "";
			// Clear previous
			flavorSelect.innerHTML = '<option value="">Select Flavor</option>';
			flavorNote.textContent = "";
			if (flavorList) {
				const flavors = flavorList.split(",");
				flavors.forEach(f => {
					const label = FLAVOR_LABELS[f] || f.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase());
					const opt = document.createElement("option");
					opt.value = f;
					opt.textContent = label;
					flavorSelect.appendChild(opt);
				});
				flavorGroup.style.display = "block";
				flavorSelect.required = true;
				flavorNote.textContent = price ? `Price: ${price}` : "";
			} else {
				flavorGroup.style.display = "none";
				flavorSelect.required = false;
			}
		});
		// Trigger on load if item is preselected
		if (itemSelect.value) {
			itemSelect.dispatchEvent(new Event("change"));
		}
	}

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

		showStatus(statusEl, "Placing your order…", true);

		const templateParams = {
			customer_name: name,
			customer_email: email,
			item,
			flavors: FLAVOR_LABELS[flavor] || flavor,
			instructions,
			owner_email: CONFIG.ownerEmail,
			submitted_at: new Date().toLocaleString(),
		};

		try {
			// Send email to owner
			await safeSendEmail(CONFIG.emailjsServiceId, CONFIG.emailjsOwnerTemplateId, templateParams);
			// Send confirmation email to customer
			await safeSendEmail(CONFIG.emailjsServiceId, CONFIG.emailjsCustomerTemplateId, templateParams);

			// Optional SMS webhook
			if (CONFIG.smsWebhookUrl) {
				try {
					await fetch(CONFIG.smsWebhookUrl, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							event: "new_order",
							name,
							email,
							item,
							flavors: FLAVOR_LABELS[flavor] || flavor,
							instructions,
							to: CONFIG.smsRecipient,
							submitted_at: templateParams.submitted_at,
						}),
					});
				} catch (_) {
					// Non-blocking: ignore SMS webhook failures
				}
			}

			showStatus(statusEl, "Order received! A confirmation email has been sent. We'll reach out soon.", true);
			form.reset();
			// Hide flavor group after reset
			if (flavorGroup) flavorGroup.style.display = "none";
		} catch (err) {
			console.error(err);
			showStatus(statusEl, "Sorry, there was a problem submitting your order. Please try again or email us directly.", false);
		}
	});
});

async function safeSendEmail(serviceId, templateId, params) {
	if (!window.emailjs) throw new Error("EmailJS SDK not loaded");
	if (!serviceId || serviceId.includes("REPLACE") || !templateId || templateId.includes("REPLACE")) {
		throw new Error("EmailJS configuration not set");
	}
	return emailjs.send(serviceId, templateId, params);
}

function showStatus(el, msg, ok) {
	if (!el) return;
	el.textContent = msg;
	el.style.color = ok ? "#155724" : "#8a1c1c";
}

