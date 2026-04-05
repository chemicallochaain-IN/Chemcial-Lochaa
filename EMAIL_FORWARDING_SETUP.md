# Email Forwarding Setup Guide (Resend to Gmail)

Follow these steps to enable automatic forwarding from `info@chemicallochaa.in` to `chemicallochaa.in@gmail.com`.

## 1. Configure MX Records
You must point your domain's MX records to Resend so it can receive emails.

Go to your domain provider (e.g., GoDaddy, Cloudflare) and add these MX records:

| Priority | Host | Points to |
| :--- | :--- | :--- |
| 10 | @ | feedback-smtp.us-east-1.amazonses.com |
| 10 | @ | feedback-smtp.us-east-1.amazonses.com |

*(Note: Exact records may vary. Check your Resend Dashboard > Domains > [Your Domain] > Inbound for the specific values provided by Resend.)*

## 2. Deploy the Edge Function
Run the following command in your terminal to deploy the forwarding logic:

```bash
supabase functions deploy resend-inbound
```

Ensure your `RESEND_API_KEY` is set in Supabase:

```bash
supabase secrets set RESEND_API_KEY=re_your_api_key
```

## 3. Register the Webhook in Resend
1. Log in to the [Resend Dashboard](https://resend.com).
2. Go to **Inbound**.
3. Create a new Inbound rule for `info@chemicallochaa.in`.
4. For the **Webhook URL**, enter your deployed Edge Function URL:
   `https://[your-project-id].supabase.co/functions/v1/resend-inbound`
5. Save the rule.

## 4. Test the Setup
1. Send an email to `info@chemicallochaa.in` from a third-party account (like a personal Outlook or Yahoo address).
2. Check `chemicallochaa.in@gmail.com` for the forwarded message.
3. Verify that clicking "Reply" on the forwarded email correctly targets the original sender's address.

---
**Troubleshooting**:
- If emails don't arrive, check the **Inbound Logs** in Resend.
- If the Webhook fails, check the **Edge Function Logs** in Supabase.
