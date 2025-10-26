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
	// If you use a serverless endpoint for customer confirmations, put it here.
	// Set to empty to disable Worker usage.
	customerEmailEndpoint: "",
	// Set to false to temporarily skip sending a customer confirmation (owner notifications will still be sent).
	enableCustomerConfirmation: false,
	smsWebhookUrl: "", // e.g., https://hooks.zapier.com/hooks/catch/XXXXX/XXXXX
	smsRecipient: "+13308429877", // your phone for SMS notifications (E.164 format)
};

// Initialize EmailJS when SDK is loaded
window.addEventListener("load", () => {

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

		// No EmailJS. Open user's email client with a prefilled email to the owner.
		const subject = encodeURIComponent(`New Order from ${name}`);
		const bodyLines = [
			`Name: ${name}`,
			`Email: ${email}`,
			`Item: ${item}`,
			`Flavor: ${flavor}`,
			`Instructions: ${instructions || "None"}`,
			`Submitted: ${new Date().toLocaleString()}`,
		];
		const body = encodeURIComponent(bodyLines.join("\n"));
		const mailto = `mailto:${CONFIG.ownerEmail}?subject=${subject}&body=${body}`;

		// Provide a clickable fallback link in case the email client doesn't open
		const linkHtml = `<a href="${mailto}">Click here to email your order</a>`;
		showStatus(statusEl, `Opening your email app… ${linkHtml}`, true, true);
		try {
			window.location.href = mailto;
		} catch (_) {}

		// Optionally reset the form after a short delay
		setTimeout(() => form.reset(), 800);
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

async function safeSendViaEndpoint(endpoint, params) {
	console.debug("Sending customer email via endpoint", { endpoint, params });
	const res = await fetch(endpoint, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(params),
	});
	if (!res.ok) {
		const text = await res.text();
		throw new Error(`Endpoint error ${res.status}: ${text}`);
	}
	return res.json().catch(() => ({ ok: true }));
}

function showStatus(el, msg, ok, asHTML = false) {
	if (!el) return;
	if (asHTML) {
		el.innerHTML = msg;
	} else {
		el.textContent = msg;
	}
	el.style.color = ok ? "#155724" : "#8a1c1c";
}

