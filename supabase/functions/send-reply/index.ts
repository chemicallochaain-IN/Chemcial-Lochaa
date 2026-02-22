import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// ---------------------------------------------------------------
// EMAIL REPLY FUNCTION — COMMENTED OUT
// Replaced by WhatsApp messaging (see send-whatsapp function)
// Admin can also reply via wa.me deep links from the dashboard
// ---------------------------------------------------------------

/*
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "Chemical Lochaa <onboarding@resend.dev>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { customerName, customerEmail, originalSubject, originalMessage, replyMessage } = await req.json();

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    if (!customerEmail || !replyMessage) {
      throw new Error("Customer email and reply message are required");
    }

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [customerEmail],
        subject: `Re: ${originalSubject} — Chemical Lochaa`,
        html: `<p>Reply to ${customerName}</p>`,
      }),
    });

    if (!emailRes.ok) {
      const errData = await emailRes.json();
      throw new Error(`Failed to send reply: ${JSON.stringify(errData)}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
*/

// Placeholder: This function is disabled. Use send-whatsapp or wa.me deep links instead.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  return new Response(
    JSON.stringify({ error: "Email replies are disabled. Use WhatsApp instead." }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 410 }
  );
});
