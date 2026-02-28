// @deno-types="npm:@types/nodemailer"
import nodemailer from "npm:nodemailer";
import twilio from "npm:twilio";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { campaign_id, user_id } = await req.json();
        if (!campaign_id || !user_id) throw new Error("Missing campaign_id or user_id");

        const supabase = createClient(
            Deno.env.get("SUPABASE_URL")!,
            Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
        );

        // 1. Load campaign
        const { data: campaign, error: cErr } = await supabase
            .from("campaigns").select("*").eq("id", campaign_id).single();
        if (cErr || !campaign) throw new Error("Campaign not found");

        // 2. Load template
        if (!campaign.template_id) throw new Error("Campaign has no template");
        const { data: template, error: tErr } = await supabase
            .from("templates").select("*").eq("id", campaign.template_id).single();
        if (tErr || !template) throw new Error("Template not found");

        // 3. Load leads
        const { data: leads, error: lErr } = await supabase
            .from("leads").select("*").eq("campaign_id", campaign_id).eq("status", "new");
        if (lErr) throw new Error("Failed to load leads");
        if (!leads || leads.length === 0) throw new Error("No new leads in this campaign");

        // 4. Load user settings
        const { data: settings, error: sErr } = await supabase
            .from("user_settings").select("*").eq("user_id", user_id).single();
        if (sErr || !settings) throw new Error("User settings not found. Please configure Gmail/Twilio in Settings.");

        // 5. Mark campaign as active
        await supabase.from("campaigns").update({ status: "active" }).eq("id", campaign_id);

        // 6. Send messages
        const errors: string[] = [];
        let sentCount = 0;

        const personalise = (text: string, lead: Record<string, string>) =>
            text.replace(/\{\{(\w+)\}\}/g, (_, key) => lead[key] || "");

        for (const lead of leads) {
            try {
                if (campaign.channel === "email") {
                    if (!settings.gmail_refresh_token) throw new Error("Gmail not connected");
                    if (!lead.email) throw new Error("Lead has no email");

                    // Create OAuth2 Gmail transporter
                    const transporter = nodemailer.createTransport({
                        service: "gmail",
                        auth: {
                            type: "OAuth2",
                            user: settings.gmail_email,
                            clientId: Deno.env.get("GOOGLE_CLIENT_ID"),
                            clientSecret: Deno.env.get("GOOGLE_CLIENT_SECRET"),
                            refreshToken: settings.gmail_refresh_token,
                        },
                    });

                    await transporter.sendMail({
                        from: settings.gmail_email,
                        to: lead.email,
                        subject: personalise(template.subject || "(no subject)", lead),
                        text: personalise(template.body, lead),
                    });
                } else {
                    // SMS via Twilio
                    if (!settings.twilio_account_sid || !settings.twilio_auth_token || !settings.twilio_from_number)
                        throw new Error("Twilio not configured");
                    if (!lead.phone) throw new Error("Lead has no phone number");

                    const client = twilio(settings.twilio_account_sid, settings.twilio_auth_token);
                    await client.messages.create({
                        from: settings.twilio_from_number,
                        to: lead.phone,
                        body: personalise(template.body, lead),
                    });
                }

                // Log success
                await supabase.from("send_logs").insert({
                    user_id, campaign_id, lead_id: lead.id, channel: campaign.channel, status: "sent",
                });

                // Mark lead as contacted
                await supabase.from("leads").update({ status: "contacted" }).eq("id", lead.id);
                sentCount++;
            } catch (e: unknown) {
                errors.push(`Lead ${lead.email || lead.phone}: ${e instanceof Error ? e.message : String(e)}`);
                // Log failure
                await supabase.from("send_logs").insert({
                    user_id, campaign_id, lead_id: lead.id, channel: campaign.channel, status: "failed",
                });
            }
        }

        // 7. Mark campaign completed
        await supabase.from("campaigns").update({ status: "completed" }).eq("id", campaign_id);

        return new Response(
            JSON.stringify({ success: true, sent: sentCount, errors }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (e: unknown) {
        return new Response(
            JSON.stringify({ error: e instanceof Error ? e.message : String(e) }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
