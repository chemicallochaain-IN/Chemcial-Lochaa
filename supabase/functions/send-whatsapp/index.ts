import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// WhatsApp Cloud API configuration
// Set these secrets via: supabase secrets set WHATSAPP_TOKEN=xxx WHATSAPP_PHONE_ID=xxx
const WHATSAPP_TOKEN = Deno.env.get("WHATSAPP_TOKEN");
const WHATSAPP_PHONE_ID = Deno.env.get("WHATSAPP_PHONE_ID");
const WHATSAPP_API_URL = `https://graph.facebook.com/v18.0/${WHATSAPP_PHONE_ID}/messages`;

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
        const { to, type, templateName, templateLanguage, bodyText } = await req.json();

        if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
            throw new Error(
                "WhatsApp not configured. Set WHATSAPP_TOKEN and WHATSAPP_PHONE_ID via supabase secrets."
            );
        }

        if (!to) {
            throw new Error("'to' phone number is required (with country code, e.g. 919876543210)");
        }

        // Strip any + prefix and spaces — Meta API expects pure digits
        const cleanPhone = to.replace(/[+\s-]/g, "");

        let messagePayload: any;

        if (type === "template") {
            // Template message — for automated acknowledgements
            // Requires an approved template in Meta Business Manager
            messagePayload = {
                messaging_product: "whatsapp",
                to: cleanPhone,
                type: "template",
                template: {
                    name: templateName || "contact_ack",
                    language: { code: templateLanguage || "en" },
                },
            };
        } else {
            // Free-form text message — for admin replies
            // NOTE: Only works within 24h of customer's last message to the business number
            if (!bodyText) {
                throw new Error("'bodyText' is required for text messages");
            }
            messagePayload = {
                messaging_product: "whatsapp",
                to: cleanPhone,
                type: "text",
                text: { body: bodyText },
            };
        }

        const waRes = await fetch(WHATSAPP_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            },
            body: JSON.stringify(messagePayload),
        });

        const waData = await waRes.json();

        if (!waRes.ok) {
            console.error("WhatsApp API error:", waData);
            throw new Error(`WhatsApp API error: ${JSON.stringify(waData.error || waData)}`);
        }

        return new Response(
            JSON.stringify({ success: true, messageId: waData.messages?.[0]?.id }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
    } catch (error: any) {
        console.error("WhatsApp Edge Function error:", error);
        return new Response(
            JSON.stringify({ error: error.message }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
    }
});
