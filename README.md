# PromptVerse Client

The **PromptVerse** frontend — a marketplace for AI prompts. Built with Next.js 16
(App Router), HeroUI, Tailwind CSS v4, better-auth, Framer Motion and Recharts.

> The backend lives in a separate repo: **promptverse-server** (Express + MongoDB).

## Features

- Email/password + Google authentication (better-auth on Next.js)
- Browse, search, filter, sort and paginate prompts
- Prompt details with copy, bookmark, review and report
- Public vs premium (private) prompt visibility with blur + paywall
- User / Creator / Admin dashboards
- Creator & Admin analytics with Recharts
- Stripe one-time ($5) premium upgrade
- Light / dark theme with animated toggle
- Framer Motion animations on the home page
- Demo accounts page for quick reviewer login

## Tech

- Next.js 16 (App Router, Turbopack)
- better-auth (`toNextJsHandler`, bearer plugin) + MongoDB adapter
- Tailwind CSS v4 + HeroUI v3 design tokens
- Native `fetch` data layer (`src/lib/api.js`) with bearer token
- Framer Motion, Recharts, react-toastify, @stripe/stripe-js

## Getting started

```bash
npm install
cp .env.example .env   # fill in the values
npm run dev            # http://localhost:3000
```

Run the **promptverse-server** alongside it (port 5000), then seed demo data:

```bash
cd ../promptverse-server && npm run seed
```

### Environment variables

See `.env.example`. The client and server must share the same `MONGO_DB_URI`
(database `promptverse-db`) and `BETTER_AUTH_SECRET`.

### Google OAuth

Create credentials at [Google Cloud Console](https://console.cloud.google.com):

- Authorized JavaScript origin: `http://localhost:3000`
- Authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@aiverse.com` | `123456` |
| Creator | `creator@aiverse.com` | `123456` |
| User | `user@aiverse.com` | `123456` |

Visit `/demo-users` to auto-fill the login form.

## Auth → API flow

better-auth runs only inside Next.js. After sign-in, the bearer token is stored
and `src/lib/api.js` attaches it as `Authorization: Bearer <token>` to every
Express API call. The server verifies the token against the shared session
collection.

## Project structure

```
src/
├── app/                # routes (home, all-prompts, prompts/[id], dashboard/*, payment, auth)
│   ├── api/auth/[...all]/route.js   # better-auth handler
│   ├── error.js, not-found.js, loading.js
├── components/         # Navbar, Footer, PromptCard, home/*, dashboard/*, ui/*
├── hooks/useAuth.js
└── lib/                # auth.js, auth-client.js, api.js, motion.js
```
