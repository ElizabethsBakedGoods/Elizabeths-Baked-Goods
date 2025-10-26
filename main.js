// Simple client-side order notifications using EmailJS and optional SMS webhook
// 1) Create an EmailJS account (emailjs.com), add an Email Service and two Templates:
//    - Owner notification template (e.g., template_owner)
//    - Customer confirmation template (e.g., template_customer)
// 2) Fill in the CONFIG values below.
// 3) (Optional) For SMS, create a Zapier/Make webhook that sends a Twilio SMS and paste its URL below.

const CONFIG = {
	emailjsPublicKey: "fxvSd_ExVAwMZmUCn",
	emailjsServiceId: "service_5jsjkh6",
	// Using the same template for owner + customer is okay if the template's "To" is a variable (e.g., {{to_email}}).
	// If you later create a dedicated customer template, set emailjsCustomerTemplateId to that ID and keep passing to_email.
	emailjsOwnerTemplateId: "template_cc4bkye",
	emailjsCustomerTemplateId: "template_zaruhnd",
	ownerEmail: "bethsbakedgoodss@yahoo.com", // where owner notifications go
	senderName: "Elizabeth's Baked Goods", // shown as from_name in emails
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
	// No dynamic flavor logic needed; flavor dropdown is always visible and grouped by category

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


		// Base template params used by both owner + customer emails
		const baseParams = {
			customer_name: name,
			customer_email: email,
			item,
			flavors: flavor,
			instructions,
			owner_email: CONFIG.ownerEmail,
			submitted_at: new Date().toLocaleString(),
			from_name: CONFIG.senderName,
			reply_to: email, // allows owner to reply directly to customer
		};

		// Owner notification goes to the owner email
		const ownerParams = {
			...baseParams,
			to_email: CONFIG.ownerEmail,
			to_name: "Owner",
			// common aliases in case the template uses different variable names
			email: CONFIG.ownerEmail,
			to: CONFIG.ownerEmail,
			name: "Owner",
			recipient_email: CONFIG.ownerEmail,
		};
		// Customer confirmation goes to the customer's email
		const customerParams = {
			...baseParams,
			to_email: email,
			to_name: name,
			// aliases for broader template compatibility
			email: email,
			to: email,
			name: name,
			recipient_email: email,
		};

		try {
			// Send email to owner
			const ownerResult = await safeSendEmail(CONFIG.emailjsServiceId, CONFIG.emailjsOwnerTemplateId, ownerParams);
			console.debug("Owner email sent", ownerResult);
			showStatus(statusEl, "Order received! Sending confirmation to your email…", true);

			// Send confirmation email to customer
			const customerResult = await safeSendEmail(CONFIG.emailjsServiceId, CONFIG.emailjsCustomerTemplateId, customerParams);
			console.debug("Customer confirmation sent", customerResult);

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
							flavors: flavor,
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
			console.error("Order submission failed:", err);
			let msg = "Sorry, there was a problem submitting your order. Please try again or email us directly.";
			if (err && (err.text || err.message)) {
				msg = `Sorry, there was a problem submitting your order: ${err.text || err.message}`;
			}
			// If owner email worked but customer failed, err may only refer to the customer step;
			// in that case, clarify that we DID receive the order.
			if (statusEl && statusEl.textContent.startsWith("Order received! Sending confirmation")) {
				msg = `We received your order, but couldn't send the confirmation email: ${err.text || err.message || "unknown error"}. You can also check your spam folder or email us directly.`;
			}
			showStatus(statusEl, msg, false);
		}
	});
});

async function safeSendEmail(serviceId, templateId, params) {
	if (!window.emailjs) throw new Error("EmailJS SDK not loaded");
	if (!serviceId || serviceId.includes("REPLACE") || !templateId || templateId.includes("REPLACE")) {
		throw new Error("EmailJS configuration not set");
	}
	// Helpful debug in console
	console.debug("Sending email via EmailJS", { serviceId, templateId, params });
	return emailjs.send(serviceId, templateId, params);
}

function showStatus(el, msg, ok) {
	if (!el) return;
	el.textContent = msg;
	el.style.color = ok ? "#155724" : "#8a1c1c";
}

