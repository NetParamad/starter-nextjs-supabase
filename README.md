[English](README.md) | [ไทย](README.th.md)

# Next.js + Supabase Starter (My Notes)

A full-stack starter built on **Next.js (App Router)** and **Supabase**, preconfigured with cookie-based authentication and bundled with a working "My Notes" app (create / read / update / delete with image uploads).

## Overview

This project began as a customization of Vercel's **`with-supabase`** Next.js starter template, then grew into a small notes application that exercises the whole stack.

Supabase Auth is set up through **`@supabase/ssr`** so the user's session is stored in cookies and is available throughout the entire Next.js app — Client Components, Server Components, Route Handlers, Server Actions and the proxy (formerly middleware). On top of that foundation, the notes feature demonstrates the full stack in practice:

- **Supabase Postgres** as the data store (the `notes` table)
- **Supabase Storage** for note images (the `images` bucket)
- **Server Actions** for all mutations (add / edit / delete)
- **App Router** conventions for rendering (Server Components, Suspense, streaming)

The goal is to provide a ready-to-run foundation you can clone and extend, while also serving as a learning reference for how these pieces fit together.

## Features

- **Cookie-based authentication** with `@supabase/ssr` — a single session that works across the whole Next.js stack.
- **Email + password sign-up and sign-in**, plus **Google OAuth**.
- **Password reset flow**: forgot-password email → update-password page.
- **Protected route** (`/protected`) that renders the authenticated user's claims and redirects unauthenticated visitors to the login page.
- **Notes app** at `/notes`:
  - Create a note with a title, content and an optional image.
  - List notes in a responsive card grid with **pagination** (10 notes per page).
  - Edit a note, replacing the image or keeping the existing one.
  - Delete a note (and remove its stored image on replace).
- **Session refresh + route protection** via `proxy.ts`, which runs on every request except static assets.
- **Dark / light / system theme** switching (`next-themes`).
- **Toast notifications** for success and error feedback (`sonner`).
- **shadcn/ui** component library (New York style, neutral base color).
- **Onboarding tutorial steps** on the home page that adapt to whether the Supabase environment variables are configured.
- A reusable **realtime chat** component and hook built on Supabase Realtime broadcast — included in the codebase but not currently mounted on any route (see [Notes](#notes)).

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js](https://nextjs.org) (App Router, React Server Components, Server Actions) |
| UI runtime | [React](https://react.dev) 19 |
| Language | [TypeScript](https://www.typescriptlang.org) |
| Backend / Auth / Storage | [Supabase](https://supabase.com) (`@supabase/supabase-js`, `@supabase/ssr`) |
| Styling | [Tailwind CSS](https://tailwindcss.com) v3 + `tailwindcss-animate` |
| Components | [shadcn/ui](https://ui.shadcn.com) on top of [Radix UI](https://www.radix-ui.com) |
| Icons | [lucide-react](https://lucide.dev) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) |
| Notifications | [sonner](https://sonner.emilkowal.ski) |
| Linting | ESLint (`next/core-web-vitals`, `next/typescript`) |
| Fonts | Geist (via `next/font/google`) |

The project pins `next: "latest"`, enables `cacheComponents: true` in `next.config.ts`, and uses a root `proxy.ts` file — all consistent with the **Next.js 16** generation of features (in which middleware was renamed to "proxy").

## Project structure

```
starter-nextjs-supabase/
├── app/
│   ├── auth/
│   │   ├── callback/route.ts        # OAuth / email code exchange
│   │   ├── confirm/route.ts         # Email OTP verification
│   │   ├── error/page.tsx           # Auth error page
│   │   ├── forgot-password/page.tsx
│   │   ├── login/page.tsx
│   │   ├── sign-up/page.tsx
│   │   ├── sign-up-success/page.tsx
│   │   └── update-password/page.tsx
│   ├── notes/
│   │   ├── [id]/
│   │   │   ├── edit-note-content.tsx # Load + edit a single note
│   │   │   └── page.tsx              # Edit note route (Suspense)
│   │   ├── notes-list.tsx            # Server component: query + list
│   │   ├── notes-list-wrapper.tsx    # Suspense wrapper + skeleton
│   │   ├── notes-page-client.tsx     # Toast feedback from search params
│   │   └── page.tsx                  # Notes page + "add note" form
│   ├── protected/
│   │   ├── layout.tsx
│   │   └── page.tsx                  # Authenticated-only page
│   ├── globals.css
│   ├── layout.tsx                    # Root layout: theme, header, footer
│   └── page.tsx                      # Home / onboarding
├── components/
│   ├── ui/                           # shadcn/ui primitives
│   ├── tutorial/                     # Onboarding tutorial steps
│   ├── auth-button.tsx               # Sign in / sign up / logout
│   ├── chat-message.tsx
│   ├── deploy-button.tsx
│   ├── env-var-warning.tsx
│   ├── footer.tsx
│   ├── forgot-password-form.tsx
│   ├── header.tsx
│   ├── hero.tsx
│   ├── login-form.tsx
│   ├── logout-button.tsx
│   ├── next-logo.tsx
│   ├── realtime-chat.tsx
│   ├── sign-up-form.tsx
│   ├── supabase-logo.tsx
│   ├── theme-switcher.tsx
│   └── update-password-form.tsx
├── hooks/
│   ├── use-chat-scroll.tsx           # Auto-scroll for chat
│   └── use-realtime-chat.tsx         # Supabase Realtime chat hook
├── lib/
│   ├── notes/                        # Server Actions
│   │   ├── add.ts
│   │   ├── delete.ts
│   │   └── edite.ts
│   ├── supabase/
│   │   ├── client.ts                 # Browser client
│   │   ├── server.ts                 # Server client (cookies)
│   │   ├── proxy.ts                  # Session update for proxy.ts
│   │   └── middleware.ts             # Legacy middleware variant
│   └── utils.ts                      # cn() + hasEnvVars
├── proxy.ts                          # Route protection + session refresh
├── components.json                   # shadcn/ui configuration
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── tsconfig.json
├── .env.example
└── package.json
```

> [!NOTE]
> The notes Server Actions live in `lib/notes/`. The edit action's file is spelled `edite.ts` — that is intentional here and matches the import in `app/notes/[id]/edit-note-content.tsx`.

## Getting started

### Prerequisites

- **Node.js** (an LTS release; the specific minimum follows the pinned Next.js version).
- **npm** (the repository ships with `package-lock.json`).
- A **Supabase project** — create one via [database.new](https://database.new).

### Install

```bash
npm install
```

### Configure environment variables

Copy `.env.example` to `.env.local` and fill in your project values (see [Environment variables](#environment-variables)).

```bash
cp .env.example .env.local
```

### Run the development server

```bash
npm run dev
```

The app should be running at [http://localhost:3000](http://localhost:3000/).

### Build and run for production

```bash
npm run build
npm run start
```

### Lint

```bash
npm run lint
```

### Supabase-side setup

The app expects the following resources in your Supabase project. The schema and bucket are **not included in this repository** — set them up in the Supabase dashboard (or via the CLI) before using the notes feature:

- A **`notes` table** used with the columns `id`, `title`, `content` and `image`.
- A **`images` storage bucket** used to store note images and serve them via public URLs.

You will also need to configure your authentication redirect URLs in the Supabase dashboard for the OAuth and password-reset flows to work.

## Environment variables

Only the variable **names** are listed here; never commit real values.

| Variable | Scope | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Your Supabase project URL. |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public | Your Supabase publishable (or legacy anon) key. |
| `VERCEL_URL` | Server (automatic) | Populated by Vercel; used to derive `metadataBase`. You do not need to set this locally. |

> [!NOTE]
> The variable is named `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to match Supabase's newer **publishable** key format. Both legacy **anon** keys and new **publishable** keys work with this name during the transition period, so the value shown as `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the dashboard can be used here.

The `hasEnvVars` helper in `lib/utils.ts` checks that both public variables are present; when they are missing, the app shows the `EnvVarWarning` component instead of the interactive auth UI.

## Usage

1. Open the home page (`/`) and follow the onboarding tutorial steps.
2. Go to **Sign up** (`/auth/sign-up`) and create an account with email + password, or continue with **Google**.
3. Confirm your email if required, then sign in at `/auth/login`.
4. Navigate to **Notes** (`/notes`) to add, browse, paginate, edit and delete notes. Add a note using the form and optionally attach an image.
5. Open a note's **Edit** page (`/notes/[id]`) to update its title, content or image.
6. Visit the **Protected** page (`/protected`) to see the authenticated user's claims. Unauthenticated visitors are redirected to `/auth/login`.
7. Use the theme switcher in the header to toggle **Light / Dark / System**.

## Notes

- **Template origin.** This project is derived from Vercel's [`with-supabase`](https://github.com/vercel/next.js/tree/canary/examples/with-supabase) Next.js example. Many auth components, tutorial steps and logos come from that template.
- **Realtime chat (unused).** `components/realtime-chat.tsx`, `components/chat-message.tsx` and `hooks/use-realtime-chat.tsx` implement a Supabase Realtime broadcast chat, but no route currently renders `<RealtimeChat />`. It is available as a starting point if you want to add chat to your app.
- **Two middleware files.** `lib/supabase/proxy.ts` is the active session-refresh helper (used by the root `proxy.ts`). `lib/supabase/middleware.ts` is the older variant retained from the template and is not referenced by an active middleware file.
- **Client vs server Supabase.** `lib/supabase/client.ts` creates a browser client for Client Components; `lib/supabase/server.ts` creates a per-request server client bound to cookies.
- **No test suite.** There is currently no test runner configured in `package.json`.
- **Docs language.** This README is available in English (this file) and [Thai](README.th.md).
