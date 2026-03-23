import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f7f2; border-radius: 12px; overflow: hidden;">
            <div style="background: #01445b; padding: 24px 32px;">
              <h1 style="color: #f5c518; margin: 0; font-size: 22px;">🧪 Chemical Lochaa</h1>
              <p style="color: #f9f7f2; margin: 4px 0 0; font-size: 13px; opacity: 0.8;">Where Food Meets Science</p>
            </div>
            <div style="padding: 28px 32px;">
              <h2 style="color: #01445b; margin: 0 0 16px; font-size: 18px;">Hey ${customerName || "there"}! 👋</h2>
              
              <p style="color: #444; line-height: 1.7; margin: 0 0 20px; white-space: pre-wrap;">${replyMessage}</p>

              <div style="background: #fff; border-left: 4px solid #e5e5e5; padding: 16px 20px; border-radius: 0 8px 8px 0; margin-top: 24px;">
                <p style="font-weight: bold; color: #999; margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Your Original Message — "${originalSubject}"</p>
                <p style="color: #888; margin: 0; line-height: 1.5; font-size: 13px; white-space: pre-wrap;">${originalMessage || ""}</p>
              </div>

              <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 28px 0;" />
              <div style="text-align: center; color: #999; font-size: 12px;">
                <p style="margin: 0 0 4px;">Chemical Lochaa</p>
                <p style="margin: 0 0 4px;">Shop no-28, Sector-1, Main Market, Ambala City - 134003</p>
                <p style="margin: 0;">📞 +91 72068 79847 | 📧 chemicallochaa.in@gmail.com</p>
              </div>
            </div>
          </div>
        `,
      }),
    });

    if (!emailRes.ok) {
      const errData = await emailRes.json();
      throw new Error(`Failed to send reply: ${JSON.stringify(errData)}`);
    }

    const resData = await emailRes.json();

    return new Response(
      JSON.stringify({ success: true, emailId: resData.id }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error("Send-reply error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
