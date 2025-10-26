# Customer Confirmation via Cloudflare Worker

This Worker lets your site send customer confirmation emails server-side using EmailJS REST, so you don’t need to add your domain to EmailJS on a paid plan.

## What it does
- Receives JSON from your website at `/send-customer`
- Calls EmailJS REST API with your service + customer template
- Adds CORS for your domain

## Prereqs
- Cloudflare account (free)
- EmailJS account (you already have this)
  - Service ID: `service_5jsjkh6`
  - Public key: `fxvSd_ExVAwMZmUCn`
  - Customer template: `template_zaruhnd`
  - Private key (a.k.a. access token) from EmailJS

## Deploy steps (5–10 minutes)
1) In Cloudflare Dashboard → Workers → Create → Create Worker
2) Replace the code with `serverless/cloudflare-worker.js`
3) Add Worker secrets (Settings → Variables → Add):
   - `EMAILJS_PRIVATE_KEY`: your EmailJS private key (access token)
   - `EMAILJS_PUBLIC_KEY`: `fxvSd_ExVAwMZmUCn`
   - `EMAILJS_SERVICE_ID`: `service_5jsjkh6`
   - `EMAILJS_CUSTOMER_TEMPLATE_ID`: `template_zaruhnd`
   - Optional: `ALLOWED_ORIGIN`: `https://elizabethsbakedgoods.com`
4) Save and Deploy. Copy the Worker URL, e.g.:
   - `https://order-email.yourname.workers.dev/send-customer`
5) In your website code (`main.js`), set:
   - `CONFIG.customerEmailEndpoint = "YOUR_WORKER_URL"`
6) Publish your site.

## Test
- Submit the order form with your email. You should see:
  - “Order received! Sending confirmation to your email…”
  - Then success. You receive the confirmation.
- If an error appears, check the Worker’s Logs for details.

## Security notes
- The Worker enforces CORS to `ALLOWED_ORIGIN`; change or remove as needed.
- Keep your EmailJS private key only in Worker secrets—never in your repo.

## Optional enhancements
- Rate limiting by IP/User-Agent
- Simple honeypot/captcha check
- Send the owner email via the Worker too (requires an owner template id)
