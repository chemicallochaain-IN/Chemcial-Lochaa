import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "info@chemicallochaa.in";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "Chemical Lochaa <info@chemicallochaa.in>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { name, email, phone, subject, message } = await req.json();

    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    // 1. Send notification to admin
    const adminEmailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [ADMIN_EMAIL],
        subject: `🧪 New Contact: ${subject} — from ${name}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f7f2; border-radius: 12px; overflow: hidden;">
            <div style="background: #01445b; padding: 24px 32px;">
              <h1 style="color: #f5c518; margin: 0; font-size: 22px;">🧪 Chemical Lochaa</h1>
              <p style="color: #f9f7f2; margin: 4px 0 0; font-size: 13px; opacity: 0.8;">New Contact Form Submission</p>
            </div>
            <div style="padding: 28px 32px;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px 12px; font-weight: bold; color: #01445b; width: 100px; vertical-align: top;">Name</td>
                  <td style="padding: 8px 12px; color: #333;">${name}</td>
                </tr>
                <tr style="background: #fff;">
                  <td style="padding: 8px 12px; font-weight: bold; color: #01445b; vertical-align: top;">Email</td>
                  <td style="padding: 8px 12px; color: #333;"><a href="mailto:${email}" style="color: #01445b;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px; font-weight: bold; color: #01445b; vertical-align: top;">Phone</td>
                  <td style="padding: 8px 12px; color: #333;">${phone || "Not provided"}</td>
                </tr>
                <tr style="background: #fff;">
                  <td style="padding: 8px 12px; font-weight: bold; color: #01445b; vertical-align: top;">Subject</td>
                  <td style="padding: 8px 12px; color: #333;">${subject}</td>
                </tr>
              </table>
              <div style="background: #fff; border-left: 4px solid #f5c518; padding: 16px 20px; border-radius: 0 8px 8px 0;">
                <p style="font-weight: bold; color: #01445b; margin: 0 0 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Message</p>
                <p style="color: #444; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message}</p>
              </div>
              <p style="margin-top: 20px; font-size: 12px; color: #999; text-align: center;">
                Reply directly from your <a href="https://www.chemicallochaa.in" style="color: #01445b;">Admin Dashboard</a>
              </p>
            </div>
          </div>
        `,
      }),
    });

    if (!adminEmailRes.ok) {
      const errData = await adminEmailRes.json();
      console.error("Admin email failed:", errData);
    }

    // ---------------------------------------------------------------
    // 2. Customer Email Acknowledgement — COMMENTED OUT
    //    Replaced by WhatsApp acknowledgement (see send-whatsapp function)
    // ---------------------------------------------------------------
    /*
    const customerEmailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
            from: FROM_EMAIL,
            to: [email],
            subject: `Thank you for contacting Chemical Lochaa! 🧪`,
            html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f7f2; border-radius: 12px; overflow: hidden;">
        <div style="background: #01445b; padding: 32px; text-align: center;">
          <h1 style="color: #f5c518; margin: 0; font-size: 26px;">🧪 Chemical Lochaa</h1>
          <p style="color: #f9f7f2; margin: 8px 0 0; font-size: 14px; opacity: 0.9;">Where Food Meets Science</p>
        </div>
        <div style="padding: 32px;">
          <h2 style="color: #01445b; margin: 0 0 16px; font-size: 20px;">Hey ${name}! 👋</h2>
          <p style="color: #444; line-height: 1.7; margin: 0 0 16px;">
            Thank you for reaching out to us! We've received your message regarding <strong>"${subject}"</strong> and our team is on it.
          </p>
          <p style="color: #444; line-height: 1.7; margin: 0 0 24px;">
            We typically respond within <strong>24 hours</strong>. In the meantime, feel free to explore our menu or follow us on social media!
          </p>
          
          <div style="background: #fff; border-radius: 8px; padding: 20px; border: 1px solid #e5e5e5; margin-bottom: 24px;">
            <p style="font-weight: bold; color: #01445b; margin: 0 0 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Your Message</p>
            <p style="color: #666; margin: 0; font-size: 14px; line-height: 1.5; white-space: pre-wrap;">${message}</p>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <a href="https://www.chemicallochaa.in" style="display: inline-block; background: #f5c518; color: #01445b; padding: 12px 32px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 14px;">Visit Our Website</a>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;" />
          <div style="text-align: center; color: #999; font-size: 12px;">
            <p style="margin: 0 0 4px;">Chemical Lochaa</p>
            <p style="margin: 0 0 4px;">Shop no-28, Sector-1, Main Market, Ambala City - 134003</p>
            <p style="margin: 0;">📞 +91 72068 79847 | 📧 info@chemicallochaa.in</p>
          </div>
        </div>
      </div>
    `,
        }),
    });

    if (!customerEmailRes.ok) {
        const errData = await customerEmailRes.json();
        console.error("Customer email failed:", errData);
    }
    */

    return new Response(
      JSON.stringify({ success: true, message: "Notifications sent" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
