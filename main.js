// Simple order form using Formspree
const CONFIG = {
	formspreeEndpoint: "https://formspree.io/f/mgvpvzkz",
};

window.addEventListener("load", () => {
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

			showStatus(statusEl, "Thank you! Your order has been received. We'll contact you soon!", true);
			form.reset();
		} catch (error) {
			showStatus(statusEl, "Sorry, there was a problem submitting your order. Please try again or call us at (330) 842-9877.", false);
			console.error("Form submission error:", error);
		}
	});
});

function showStatus(el, msg, ok) {
	if (!el) return;
	el.textContent = msg;
	el.style.color = ok ? "#155724" : "#8a1c1c";
}

