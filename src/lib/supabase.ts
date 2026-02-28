import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const isSupabaseConfigured =
    !!import.meta.env.VITE_SUPABASE_URL &&
    !import.meta.env.VITE_SUPABASE_URL.includes('your_supabase') &&
    !!import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !import.meta.env.VITE_SUPABASE_ANON_KEY.includes('your_supabase');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type Campaign = {
    id: string;
    user_id: string;
    name: string;
    description: string | null;
    status: 'draft' | 'active' | 'paused' | 'completed';
    channel: 'email' | 'sms';
    template_id: string | null;
    created_at: string;
};

export type Lead = {
    id: string;
    user_id: string;
    campaign_id: string | null;
    first_name: string;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    company: string | null;
    website: string | null;
    status: 'new' | 'contacted' | 'replied' | 'bounced';
    created_at: string;
};

export type Template = {
    id: string;
    user_id: string;
    name: string;
    subject: string | null;
    body: string;
    created_at: string;
};

export type SendLog = {
    id: string;
    user_id: string;
    campaign_id: string | null;
    lead_id: string | null;
    channel: 'email' | 'sms';
    status: 'sent' | 'failed' | 'bounced';
    sent_at: string;
};

export type UserSettings = {
    id: string;
    user_id: string;
    gmail_refresh_token: string | null;
    gmail_email: string | null;
    twilio_account_sid: string | null;
    twilio_auth_token: string | null;
    twilio_from_number: string | null;
    daily_send_limit: number;
    updated_at: string;
};
