// This file is intentionally deactivated. The project no longer uses a Cloudflare Worker.
// If you accidentally deploy this file, the Worker will always respond with 410 Gone.

export default {
  async fetch() {
    return new Response(
      JSON.stringify({ error: "Worker removed", code: "WORKER_DEPRECATED" }),
      {
        status: 410,
        headers: { "Content-Type": "application/json" },
      }
    );
  },
};
