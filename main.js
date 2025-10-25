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

	if (!form) return;

	form.addEventListener("submit", async (e) => {
		e.preventDefault();

		// Gather data
		const formData = new FormData(form);
		const name = (formData.get("name") || "").toString().trim();
		const email = (formData.get("email") || "").toString().trim();
		const item = (formData.get("item") || "").toString();
		const instructions = (formData.get("instructions") || "").toString();

		// Collect multi-select flavors
		const flavorSelect = form.querySelector('select[name="flavor"]');
		const selectedFlavors = Array.from(flavorSelect?.selectedOptions || []).map(o => o.text);
		const flavorsText = selectedFlavors.join(", ");

		// Basic validation
		if (!name || !email || !item || selectedFlavors.length === 0) {
			showStatus(statusEl, "Please fill out your name, email, at least one flavor, and pack size.", false);
			return;
		}

		showStatus(statusEl, "Placing your order…", true);

		const templateParams = {
			customer_name: name,
			customer_email: email,
			item,
			flavors: flavorsText,
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
							flavors: selectedFlavors,
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

