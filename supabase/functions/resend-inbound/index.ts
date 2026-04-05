import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FORWARD_TO = "chemicallochaa.in@gmail.com";
const SOURCE_EMAIL = "info@chemicallochaa.in";

serve(async (req: Request) => {
  try {
    // Resend Inbound sends a POST request with a JSON body
    // Payload details: https://resend.com/docs/dashboard/inbound/webhooks
    const payload = await req.json();
    console.log("Received inbound email:", payload.subject);

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { from, to, subject, text, html, attachments } = payload;

    // Forward the email to the destination
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: SOURCE_EMAIL,
        to: [FORWARD_TO],
        reply_to: from, // Set Reply-To to original sender
        subject: `[FWD] ${subject}`,
        text: `Forwarded message from ${from}:\n\n${text}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <p style="color: #666; font-size: 12px; border-bottom: 1px solid #eee; padding-bottom: 10px;">
              <strong>Forwarded from:</strong> ${from}<br>
              <strong>To:</strong> ${to.join(", ")}
            </p>
            <div style="margin-top: 20px;">
              ${html || `<pre style="white-space: pre-wrap;">${text}</pre>`}
            </div>
          </div>
        `,
        // If attachments were present, you might need to handle them, 
        // but Resend Inbound attachments are URLs or base64.
        // For now, we focus on text/html content.
      }),
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error("Forwarding failed:", errData);
      return new Response(JSON.stringify(errData), { status: res.status });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    console.error("Inbound Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
