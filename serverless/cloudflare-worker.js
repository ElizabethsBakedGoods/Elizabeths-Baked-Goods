export default {
  async fetch(request, env) {
    const allowedOrigin = env.ALLOWED_ORIGIN || "https://elizabethsbakedgoods.com";

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(allowedOrigin),
      });
    }

    try {
      const url = new URL(request.url);
      if (url.pathname !== "/send-customer") {
        return respondJSON({ error: "Not Found" }, 404, allowedOrigin);
      }

      if (request.method !== "POST") {
        return respondJSON({ error: "Method Not Allowed" }, 405, allowedOrigin);
      }

      const origin = request.headers.get("Origin") || "";
      if (allowedOrigin && origin && origin !== allowedOrigin) {
        // Optional strict origin check; comment this out if you want to allow any origin
        return respondJSON({ error: "Origin not allowed" }, 403, allowedOrigin);
      }

      const body = await request.json().catch(() => ({}));

      // Minimal validation: we need a recipient
      const to = body.to_email || body.email || body.to || body.recipient_email;
      if (!to || typeof to !== "string" || !to.includes("@")) {
        return respondJSON({ error: "Invalid or missing to_email" }, 400, allowedOrigin);
      }

      // Build EmailJS REST payload
      const payload = {
        service_id: env.EMAILJS_SERVICE_ID || "service_5jsjkh6",
        template_id: env.EMAILJS_CUSTOMER_TEMPLATE_ID || "template_zaruhnd",
        user_id: env.EMAILJS_PUBLIC_KEY || "fxvSd_ExVAwMZmUCn",
        accessToken: env.EMAILJS_PRIVATE_KEY,
        template_params: body,
      };

      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        return respondJSON({ error: `EmailJS error ${res.status}: ${text}` }, 502, allowedOrigin);
      }

      return respondJSON({ ok: true }, 200, allowedOrigin);
    } catch (err) {
      return respondJSON({ error: err?.message || "Unexpected error" }, 500, "*");
    }
  },
};

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

function respondJSON(obj, status, origin) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
    },
  });
}
