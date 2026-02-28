<div align="center">

# ⚡ Spark Outreach AI

**AI-powered cold outreach platform — automate personalized email & SMS campaigns at scale.**

[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Quick Start](#-quick-start) · [Database Setup](#-database-setup) · [Integrations](#-integrations) · [Roadmap](#-roadmap)

</div>

---

## 🚀 What is Spark Outreach AI?

Spark Outreach AI is a **full-stack SaaS application** that lets you run personalized, multi-channel cold outreach campaigns — powered by Gmail OAuth2 and Twilio. Manage your leads pipeline, craft reusable message templates, monitor delivery analytics in real time, and automate follow-ups — all from a sleek, dark-mode first dashboard.

Whether you're a solo founder doing B2B outreach or an agency managing dozens of campaigns, Spark gives you the infrastructure to scale without hitting spam filters.

---

## ✨ Features

### 📊 Dashboard
- Real-time stats: **Emails Sent, Opened, Replied, Failed**
- Interactive **weekly activity area chart** (Recharts)
- Live campaign status overview with at-a-glance metrics

### 📣 Campaigns
- Create campaigns with **Email or SMS** channels
- Set campaign status: `draft → active → paused → completed`
- Attach message templates directly to campaigns
- Per-campaign lead tracking with send/reply counts

### 👥 Leads Management
- Add and manage leads with full contact profiles:
  `First Name, Last Name, Email, Phone, Company, Website`
- Lead status pipeline: `new → contacted → replied → bounced`
- Assign leads to specific campaigns
- Filter, search, and bulk-manage leads

### 📝 Message Templates
- Create reusable email/SMS templates with subject + body
- Template library for quick campaign assignment
- Rich text composition with preview

### 📈 Analytics
- Campaign-level performance breakdown
- Delivery, open, reply, and bounce rate tracking
- Send log history with per-message channel & status
- Realtime updates via **Supabase Realtime** on `send_logs`

### ⚙️ Settings & Integrations
| Integration | Capability |
|---|---|
| **Gmail (OAuth2)** | Connect your Gmail account to send emails personalized from your address |
| **Twilio SMS** | Enter Account SID, Auth Token, and from-number for SMS campaigns |
| **Daily Send Limit** | Cap outgoing messages per day to avoid spam flags |
| **Unsubscribe Link** | Auto-inject compliance footer into emails |
| **Notifications** | Alerts for lead replies and campaign completion |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 · TypeScript · Vite 5 |
| **Styling** | Tailwind CSS v3 · shadcn/ui (Radix UI) |
| **State / Data** | TanStack React Query v5 |
| **Forms** | React Hook Form · Zod |
| **Charts** | Recharts |
| **Backend / DB** | Supabase (PostgreSQL, Auth, RLS, Realtime) |
| **Email** | Gmail API (OAuth 2.0) |
| **SMS** | Twilio REST API |
| **Routing** | React Router DOM v6 |
| **Testing** | Vitest · React Testing Library |
| **Build Tool** | Vite + SWC |

---

## ⚡ Quick Start

### Prerequisites

- **Node.js** 18+ (or Bun)
- A **Supabase** project → [supabase.com](https://supabase.com)
- *(Optional)* Google Cloud project with Gmail API enabled
- *(Optional)* Twilio account for SMS

### 1. Clone the repository

```bash
git clone https://github.com/Mohammedjaasir/spark-outreach-AI.git
cd spark-outreach-AI
```

### 2. Install dependencies

```bash
npm install
# or
bun install
```

### 3. Configure environment variables

Copy the example and fill in your credentials:

```bash
cp .env.local.example .env.local
```

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Gmail OAuth (optional)
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Twilio (optional – configured via UI Settings page)
# VITE_TWILIO_ACCOUNT_SID=ACxxxxxxxx
```

### 4. Set up the database

In your Supabase dashboard → **SQL Editor** → **New Query**, paste and run the contents of:

```
supabase/schema.sql
```

This creates all tables, enables Row Level Security, and sets up Realtime.

### 5. Start the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

---

## 🗄 Database Setup

The schema lives in [`supabase/schema.sql`](supabase/schema.sql). It is **idempotent** — safe to run multiple times.

### Tables

| Table | Description |
|---|---|
| `campaigns` | Outreach campaigns with channel, status, and template linkage |
| `leads` | Contact records with pipeline status |
| `templates` | Reusable message templates (subject + body) |
| `send_logs` | Immutable log of every send attempt with status |
| `user_settings` | Per-user Gmail credentials, Twilio config, and preferences |

All tables use **Row Level Security (RLS)** — every user can only see and modify their own data.

```sql
-- Example RLS policy (auto-applied by schema.sql)
create policy "Users own their campaigns"
  on campaigns for all using (auth.uid() = user_id);
```

Realtime is enabled on `send_logs` so the analytics dashboard updates live as messages are delivered.

---

## 🔌 Integrations

### Gmail (OAuth2)

1. Go to [Google Cloud Console](https://console.cloud.google.com) → **APIs & Services** → **Credentials**
2. Create an OAuth 2.0 Client ID (Web Application)
3. Add `http://localhost:5173/auth/gmail/callback` as an authorised redirect URI
4. Copy your **Client ID** to `VITE_GOOGLE_CLIENT_ID` in `.env.local`
5. In the app, go to **Settings → Gmail Integration → Connect Gmail Account**

The app requests only the `gmail.send` scope — it never reads your inbox.

### Twilio SMS

1. Sign up at [twilio.com](https://twilio.com) and buy a phone number
2. In the app, go to **Settings → Twilio SMS Integration**
3. Paste your **Account SID**, **Auth Token**, and **From Number**
4. Hit **Save Settings** — credentials are stored securely in Supabase

---

## 📁 Project Structure

```
spark-outreach-AI/
├── src/
│   ├── components/         # Reusable UI components (shadcn/ui based)
│   │   └── ui/             # Radix UI primitives
│   ├── pages/
│   │   ├── Dashboard.tsx   # Overview stats & charts
│   │   ├── Campaigns.tsx   # Campaign CRUD
│   │   ├── Leads.tsx       # Lead management
│   │   ├── Templates.tsx   # Template editor
│   │   ├── Analytics.tsx   # Detailed analytics
│   │   └── Settings.tsx    # Integrations & preferences
│   ├── hooks/              # Custom React hooks (useCampaigns, etc.)
│   ├── lib/
│   │   └── supabase.ts     # Supabase client
│   └── contexts/           # React context providers
├── supabase/
│   └── schema.sql          # Full DB schema (idempotent)
├── public/
└── .env.local              # Environment variables (not committed)
```

---

## 🧪 Running Tests

```bash
npm run test          # Run all tests once
npm run test:watch    # Watch mode
```

Tests use **Vitest** + **React Testing Library** for component and hook testing.

---

## 🔧 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run test suite |

---

## 🗺 Roadmap

- [ ] AI-personalized message generation (OpenAI integration)
- [ ] CSV bulk lead import
- [ ] Follow-up sequences & drip automation
- [ ] Unsubscribe link tracking & compliance dashboard
- [ ] WhatsApp channel via Twilio
- [ ] Team workspaces & multi-user support
- [ ] Zapier / webhook integrations

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📝 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

---

<div align="center">

Built with ❤️ by [Mohammed Jaasir](https://github.com/Mohammedjaasir)

⭐ If Spark Outreach AI saves you time, give this repo a star!

</div>
