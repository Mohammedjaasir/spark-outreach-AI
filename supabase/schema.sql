-- ============================================================
-- Spark Outreach — Supabase Database Schema
-- Safe to run multiple times (idempotent)
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- CAMPAIGNS
-- ============================================================
create table if not exists campaigns (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  name        text not null,
  description text,
  status      text not null default 'draft' check (status in ('draft','active','paused','completed')),
  channel     text not null default 'email' check (channel in ('email','sms')),
  template_id uuid,
  created_at  timestamptz default now()
);

alter table campaigns enable row level security;
drop policy if exists "Users own their campaigns" on campaigns;
create policy "Users own their campaigns"
  on campaigns for all using (auth.uid() = user_id);

-- ============================================================
-- LEADS
-- ============================================================
create table if not exists leads (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  campaign_id uuid references campaigns(id) on delete set null,
  first_name  text not null default '',
  last_name   text,
  email       text,
  phone       text,
  company     text,
  website     text,
  status      text not null default 'new' check (status in ('new','contacted','replied','bounced')),
  created_at  timestamptz default now()
);

alter table leads enable row level security;
drop policy if exists "Users own their leads" on leads;
create policy "Users own their leads"
  on leads for all using (auth.uid() = user_id);

-- ============================================================
-- TEMPLATES
-- ============================================================
create table if not exists templates (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  name       text not null,
  subject    text,
  body       text not null,
  created_at timestamptz default now()
);

alter table templates enable row level security;
drop policy if exists "Users own their templates" on templates;
create policy "Users own their templates"
  on templates for all using (auth.uid() = user_id);

-- ============================================================
-- SEND LOGS
-- ============================================================
create table if not exists send_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  campaign_id uuid references campaigns(id) on delete set null,
  lead_id     uuid references leads(id) on delete set null,
  channel     text not null check (channel in ('email','sms')),
  status      text not null default 'sent' check (status in ('sent','failed','bounced')),
  sent_at     timestamptz default now()
);

alter table send_logs enable row level security;
drop policy if exists "Users own their send logs" on send_logs;
create policy "Users own their send logs"
  on send_logs for all using (auth.uid() = user_id);

-- ============================================================
-- USER SETTINGS
-- ============================================================
create table if not exists user_settings (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users(id) on delete cascade not null unique,
  gmail_refresh_token text,
  gmail_email         text,
  twilio_account_sid  text,
  twilio_auth_token   text,
  twilio_from_number  text,
  daily_send_limit    integer default 50,
  updated_at          timestamptz default now()
);

alter table user_settings enable row level security;
drop policy if exists "Users own their settings" on user_settings;
create policy "Users own their settings"
  on user_settings for all using (auth.uid() = user_id);

-- ============================================================
-- Enable Realtime for send_logs (progress tracking)
-- ============================================================
do $$
begin
  alter publication supabase_realtime add table send_logs;
exception when duplicate_object then null;
end $$;
