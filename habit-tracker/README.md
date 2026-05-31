# HabitFlow - Daily Habit Tracker SaaS

A production-ready daily habit tracker with AI coaching, gamification, and tiered subscriptions (Free / Pro / Elite).

## Features

- **Habit Tracking** — Create, complete, and track daily habits with streak counters
- **AI Coach** — Gemini-powered habit coaching, suggestions, and motivation
- **Mood Tracking** — Log daily mood and discover correlations with habits
- **Focus Timer** — Pomodoro-style focus sessions synced to habits
- **Gamification** — Points, levels, badges, achievements, challenges
- **Journals** — Per-habit journaling with sentiment analysis
- **Pro Features** — Analytics, schedules, experiments, life scoring, focus history
- **Elite Features** — AI Architect, DNA Evolution, Habit Twin, Predictive AI, Smart Interventions
- **Payments** — Razorpay integration (Pro/Elite subscriptions)
- **PWA** — Offline support, installable on mobile/desktop
- **Mobile** — Capacitor Android app with native back button, splash screen, push notifications

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite (JSX) |
| Styling | CSS + inline styles |
| State | React Context + useReducer (6 contexts) |
| Backend | Supabase (Auth, PostgreSQL, Edge Functions) |
| AI | Google Gemini via Supabase Edge Function |
| Payments | Razorpay (via Edge Function) |
| Monitoring | Sentry |
| Mobile | Capacitor 8 (Android) |
| CI/CD | GitHub Actions + Vercel |

## Prerequisites

- **Node.js** >= 18 (20 recommended)
- **npm** >= 9
- **Supabase CLI** — `npm install -g supabase`
- **Vercel CLI** (optional, for local preview) — `npm install -g vercel`
- **Android Studio** (for Capacitor builds)

## Local Setup

```bash
# 1. Clone and install
git clone <repo-url>
cd Daily Habit Tracker/habit-tracker
npm install

# 2. Copy environment variables
cp .env.example .env.local
# Fill in your values — see Environment Variables table below

# 3. Start dev server
npm run dev
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `VITE_GEMINI_API_KEY` | Yes | Google Gemini API key |
| `VITE_RAZORPAY_KEY_ID` | No | Razorpay key ID (payments) |
| `VITE_SENTRY_DSN` | No | Sentry DSN (error tracking) |
| `VITE_APP_ENV` | No | `development` or `production` |

## Database Setup

Run the SQL schema against your Supabase project:

1. Go to **Supabase Dashboard → SQL Editor**
2. Open `supabase-schema.sql`
3. Run the entire script
4. Enable the email-password auth provider in **Authentication → Settings**

## Edge Functions

```bash
# Set secrets
supabase secrets set GEMINI_API_KEY=your_gemini_key
supabase secrets set RAZORPAY_KEY_SECRET=your_razorpay_secret

# Deploy
supabase functions deploy gemini-proxy
supabase functions deploy verify-payment
```

## Build & Deploy

```bash
# Production build
npm run build

# Preview production build locally
npm run preview

# Deploy to Vercel (requires Vercel CLI)
vercel --prod
```

## Capacitor (Android)

```bash
# Sync web build to native project
npx cap sync android

# Open in Android Studio
npx cap open android

# Build APK/Bundle in Android Studio
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint on `src/` |
| `npm run format` | Format code with Prettier |
| `npm run deploy:functions` | Deploy all Supabase Edge Functions |

## Folder Structure

```
src/
├── components/     # Reusable UI components
│   ├── Auth/       # Login, AuthGuard, PlanGuard
│   ├── Habits/     # HabitCard, HabitList, HabitModal
│   ├── Dashboard/  # StatsBar, WeeklyHeatmap, etc.
│   ├── Layout/     # Sidebar, Navbar
│   ├── Analytics/  # Charts and heatmaps
│   ├── Focus/      # Timer, focus components
│   ├── UI/         # EmptyState, LoadingSkeleton, ErrorBoundary
│   └── ...         # Feature-specific folders
├── context/        # React Context providers (6)
├── hooks/          # Custom React hooks
├── pages/          # Route pages (50+)
├── services/       # Supabase client & service layer
└── utils/          # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Commit your changes (`git commit -m 'Add my feature'`)
4. Push to the branch (`git push origin feat/my-feature`)
5. Open a Pull Request

All PRs must pass linting (`npm run lint`) and build (`npm run build`).
