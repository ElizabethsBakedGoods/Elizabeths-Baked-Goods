# Worker removed (deprecated)

This project no longer uses a Cloudflare Worker. The Worker files remain only for historical reference and should not be deployed.

If you previously deployed the Worker, please delete it in Cloudflare:

1. Cloudflare Dashboard → Workers & Pages → Workers → select your Worker (e.g., "order-email").
2. Routes (if any): remove any routes bound to the Worker.
3. Triggers: remove any Cron Triggers (if any).
4. Settings → Variables: remove any Secrets/Variables you added (EMAILJS_PRIVATE_KEY, etc.).
5. Overview: click Delete Worker and confirm.

Local code changes to stop using the Worker are already applied in `main.js` (customerEmailEndpoint cleared and confirmations disabled).
