// Simple order form that opens the customer's email app with pre-filled order details
const CONFIG = {
	ownerEmail: "bethsbakedgoodss@yahoo.com",
};

window.addEventListener("load", () => {
	const form = document.getElementById("orderForm") || document.querySelector("#order .order-form form");
	const statusEl = document.getElementById("order-status");

	if (!form) return;

	form.addEventListener("submit", (e) => {
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

		// Build mailto link
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

		// Show success with clickable fallback
		const linkHtml = `Opening your email app… <a href="${mailto}" style="color: inherit; text-decoration: underline;">Click here if it doesn't open</a>`;
		showStatus(statusEl, linkHtml, true, true);

		// Open email client
		window.location.href = mailto;

		// Reset form after a moment
		setTimeout(() => form.reset(), 800);
	});
});

function showStatus(el, msg, ok, asHTML = false) {
	if (!el) return;
	if (asHTML) {
		el.innerHTML = msg;
	} else {
		el.textContent = msg;
	}
	el.style.color = ok ? "#155724" : "#8a1c1c";
}

