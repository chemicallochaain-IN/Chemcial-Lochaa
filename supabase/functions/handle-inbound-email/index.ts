import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload = await req.json();
    console.log("Inbound Email Webhook payload:", payload);

    // Resend Inbound Webhook structure: 
    // { from: "sender@example.com", to: ["info@chemicallochaa.in"], subject: "Re: My Subject", text: "Hello", html: "...", ... }
    const from = payload.from;
    const subject = payload.subject || "";
    const content = payload.text || payload.html || "";

    // 1. Find the original message this is replying to
    // We match by sender email and original subject (ignoring "Re: ")
    const cleanSubject = subject.replace(/^Re:\s*/i, "").trim();

    const { data: originalMessage, error: matchError } = await supabase
      .from("contact_messages")
      .select("id")
      .eq("email", from)
      .ilike("subject", `%${cleanSubject}%`)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (matchError || !originalMessage) {
      console.error("Could not find matching original message for:", { from, cleanSubject });
      return new Response(JSON.stringify({ error: "No matching message found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // 2. Insert into message_replies
    const { error: insertError } = await supabase
      .from("message_replies")
      .insert({
        message_id: originalMessage.id,
        sender_type: "customer",
        message_type: "email",
        content: content,
        metadata: {
          original_from: from,
          original_subject: subject
        }
      });

    if (insertError) {
      console.error("Error inserting reply:", insertError);
      throw insertError;
    }

    // 3. Optional: Mark original message as "new" or "unread" again
    await supabase
      .from("contact_messages")
      .update({ status: "new" })
      .eq("id", originalMessage.id);

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 });
  } catch (error: any) {
    console.error("Webhook processing error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 });
  }
});
