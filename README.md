# PromptVerse

PromptVerse is a full-stack marketplace for AI prompts. Users can discover, search, buy and share high-quality prompts for tools like ChatGPT, Midjourney and Claude. Creators publish and manage their own prompts, while admins moderate content, users and payments from dedicated dashboards.

**Live demo:** [promptverse-client.vercel.app](https://promptverse-client.vercel.app/)

This repository contains the **frontend** (Next.js). It talks to a separate **backend** API:

> Backend repo: **promptverse-server** (Express + MongoDB). It must run alongside this app.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [Demo accounts](#demo-accounts)
- [Available scripts](#available-scripts)
- [Pages & routes](#pages--routes)
- [Project structure](#project-structure)
- [How authentication works](#how-authentication-works)
- [Payments](#payments)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Features

**For everyone**
- Browse, full-text search, filter (category / AI tool / difficulty), sort and paginate prompts
- Prompt detail page with content, usage instructions, tags, reviews and ratings
- Public vs **Premium** (private) prompts — premium content is blurred behind a paywall
- Light / dark theme with an animated toggle
- Responsive design with Framer Motion animations

**For signed-in users**
- Email/password and Google sign-in
- Copy prompts (with live copy-count), bookmark/save, review and rate, and report prompts
- Personal dashboard: saved prompts, reviews and profile management

**For creators**
- Create, edit and delete their own prompts (image upload included)
- "My Prompts" management with copy count, average rating, view, edit, delete and analytics

**For admins**
- Manage users (roles), prompts (approve / reject / feature), reports and payments
- Platform-wide analytics (copies, revenue, ratings) powered by Recharts

**Premium**
- One-time **$5** upgrade via an embedded Stripe Payment Element (card only, no redirect)
- After purchase the user returns to the prompt they were viewing, instantly unlocked

---

## Tech stack

| Area | Technology |
|------|------------|
| Framework | Next.js 16 (App Router, Turbopack, React Compiler) |
| UI | React 19, Tailwind CSS v4, HeroUI v3, @gravity-ui/icons |
| Auth | better-auth (MongoDB adapter, `bearer` + `nextCookies` plugins) |
| Data layer | Native `fetch` wrapper with bearer token (`src/lib/api.js`) |
| Animation / charts | Framer Motion, Recharts, react-fast-marquee |
| Payments | Stripe (`@stripe/react-stripe-js`, `@stripe/stripe-js`) |
| Notifications | react-toastify |
| Backend (separate repo) | Express, MongoDB, jose, Stripe |

---

## Architecture

```
┌──────────────────────────┐         ┌──────────────────────────┐
│   promptverse-client     │         │   promptverse-server     │
│   Next.js  (port 3000)   │         │   Express   (port 5000)  │
│                          │         │                          │
│  - UI & pages            │  Bearer │  - REST API              │
│  - better-auth handler   │  token  │  - Stripe payments       │
│  - Stripe Payment Element│ ──────► │  - verifies session token│
└─────────────┬────────────┘         └─────────────┬────────────┘
              │                                     │
              └──────────── MongoDB Atlas ──────────┘
                  (shared database: promptverse-db)
```

- **Auth lives in Next.js** via better-auth. Both apps share one MongoDB database, so the Express server can validate the same session tokens.
- The browser calls the Express API directly using `NEXT_PUBLIC_API_URL`, attaching the bearer token captured at login.

---

## Prerequisites

- **Node.js 18+** (Node 20+ recommended)
- A **MongoDB Atlas** connection string (or any MongoDB instance)
- A **Google OAuth** client (for Google sign-in)
- A **Stripe** account in test mode (for payments)
- The **promptverse-server** repo cloned next to this one

---

## Getting started

### 1. Clone and install

```bash
git clone <this-repo-url> promptverse-client
cd promptverse-client
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Then open `.env` and fill in the values (see [Environment variables](#environment-variables)).

### 3. Start the backend

In a separate terminal, run the Express server (port 5000) and seed demo data:

```bash
cd ../promptverse-server
npm install
cp .env.example .env   # configure MONGO_DB_URI, STRIPE_SECRET_KEY, etc.
npm run seed           # inserts demo users, prompts, reviews, payments, reports
npm run dev            # starts the API on http://localhost:5000
```

### 4. Start the frontend

```bash
npm run dev            # http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) and sign in with a [demo account](#demo-accounts).

> Both apps must use the **same** `MONGO_DB_URI` (database `promptverse-db`) and `BETTER_AUTH_SECRET` so sessions match.

---

## Environment variables

Defined in `.env` (never commit real secrets). See `.env.example` for the template.

| Variable | Required | Description |
|----------|----------|-------------|
| `BETTER_AUTH_SECRET` | Yes | Long random string used to sign sessions. Must match the server. |
| `BETTER_AUTH_URL` | Yes | Base URL of this app (e.g. `http://localhost:3000`). |
| `GOOGLE_CLIENT_ID` | Yes | Google OAuth client ID. |
| `GOOGLE_CLIENT_SECRET` | Yes | Google OAuth client secret. |
| `MONGO_DB_URI` | Yes | MongoDB connection string. Shared with the server (db `promptverse-db`). |
| `NEXT_PUBLIC_APP_URL` | Yes | Public URL of the frontend (browser-exposed). |
| `NEXT_PUBLIC_API_URL` | Yes | Base URL of the Express API (e.g. `http://localhost:5000`). |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes | Stripe publishable (test) key for the Payment Element. |

### Google OAuth setup

Create credentials at the [Google Cloud Console](https://console.cloud.google.com):

- **Authorized JavaScript origin:** `http://localhost:3000`
- **Authorized redirect URI:** `http://localhost:3000/api/auth/callback/google`

---

## Demo accounts

After running `npm run seed` on the server, these accounts are available:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@aiverse.com` | `123456` |
| Creator | `creator@aiverse.com` | `123456` |
| User | `user@aiverse.com` | `123456` |

Visit [`/demo-users`](http://localhost:3000/demo-users) to auto-fill the login form with one click.

---

## Available scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server at `http://localhost:3000`. |
| `npm run build` | Create an optimized production build. |
| `npm run start` | Run the production build. |
| `npm run lint` | Run ESLint. |

---

## Pages & routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Home / landing page |
| `/all-prompts` | Public | Browse, search, filter and sort all prompts |
| `/prompts/[id]` | Auth | Prompt details, reviews, copy/bookmark/report |
| `/login`, `/register` | Public | Authentication |
| `/demo-users` | Public | Quick demo-account login |
| `/payment` | Auth | Premium upgrade (Stripe) |
| `/dashboard` | Auth | Dashboard overview |
| `/dashboard/my-prompts` | Creator | Manage your prompts |
| `/dashboard/add-prompt` | Creator | Create a prompt |
| `/dashboard/saved` | Auth | Saved/bookmarked prompts |
| `/dashboard/my-reviews` | Auth | Your reviews |
| `/dashboard/analytics` | Creator | Your prompt analytics |
| `/dashboard/profile` | Auth | Profile settings |
| `/dashboard/admin/*` | Admin | Users, prompts, reports, payments, analytics |

---

## Project structure

```
src/
├── app/                        # App Router routes (each folder = a route)
│   ├── layout.js               # Root layout + global metadata / favicon
│   ├── page.js                 # Home page
│   ├── all-prompts/            # Marketplace listing
│   ├── prompts/[id]/           # Prompt details
│   ├── login/ register/        # Auth pages
│   ├── payment/                # Stripe premium upgrade
│   ├── dashboard/              # User / creator / admin dashboards
│   │   └── admin/              # Admin-only management pages
│   └── api/
│       ├── auth/[...all]/      # better-auth request handler
│       └── auth-token/         # Returns the session token for the bearer flow
├── components/
│   ├── Navbar.jsx, Footer.jsx
│   ├── PromptCard.jsx
│   ├── home/                   # Landing-page sections
│   ├── dashboard/              # Sidebar, forms, charts, modals
│   └── ui/                     # Reusable UI (Modal, Pagination, SelectMenu, ...)
├── hooks/
│   └── useAuth.js              # Wraps better-auth session (role, subscription)
└── lib/
    ├── auth.js                 # better-auth server config
    ├── auth-client.js          # better-auth client + bearer token capture
    ├── api.js                  # fetch wrapper that attaches the bearer token
    ├── navigation.js           # safe redirect helpers
    └── motion.js               # shared Framer Motion variants
```

---

## How authentication works

1. better-auth runs **inside Next.js** (`src/lib/auth.js`, handler at `/api/auth/[...all]`).
2. On sign-in, the bearer token returned by better-auth is stored in `localStorage`.
3. `src/lib/api.js` attaches it as `Authorization: Bearer <token>` to every Express API request.
4. The Express server verifies that token against the **shared** session collection in MongoDB.
5. For Google sign-in (which sets the cookie via a server redirect), `AuthTokenSync` fetches the token from `/api/auth-token` and stores it, keeping the bearer flow working.

User roles: **user**, **creator**, **admin**. Premium status is stored as a `subscription` field (`free` / `premium`).

---

## Payments

- Upgrading to Premium is a **one-time $5** charge.
- The frontend uses an embedded **Stripe Payment Element** (card only) — no redirect away from the app.
- The server creates a PaymentIntent; on success the user is marked premium and returned to the page they came from with content unlocked.

Use Stripe's test card `4242 4242 4242 4242`, any future expiry, any CVC and ZIP.

---

## Deployment

- The frontend deploys well to **Vercel**. Set all environment variables in the project settings.
- Update `BETTER_AUTH_URL`, `NEXT_PUBLIC_APP_URL` and the Google OAuth origin/redirect URIs to your production domain.
- Deploy the **promptverse-server** separately and point `NEXT_PUBLIC_API_URL` at it.
- Use live Stripe keys and configure a webhook to the server's `/api/payments/webhook` endpoint.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `Invalid session` from the API | Sign out and back in. Ensure both apps share `MONGO_DB_URI` and `BETTER_AUTH_SECRET`. |
| Google login then `Invalid session` | The `AuthTokenSync` component syncs the token after redirect — make sure it is mounted and you have refreshed. |
| Payment shows non-card methods | Restart the server so the latest PaymentIntent config loads, then hard-refresh `/payment`. |
| No prompts / empty dashboards | Run `npm run seed` in the server repo. |
| Favicon not updating | Hard-refresh (`Ctrl/Cmd + Shift + R`); browsers cache favicons aggressively. |

---

Built with Next.js, better-auth, Tailwind CSS, Stripe and MongoDB.
