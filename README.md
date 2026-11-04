[EN](README.md) | [TH](README.th.md)

<h1 align="center">Next.js + Supabase Starter (My Notes)</h1>

<p align="center">
  A full-stack starter on Next.js App Router and Supabase, with cookie-based auth and a working notes app.
</p>

<p align="center">
  <a href="#overview">Overview</a> ·
  <a href="#features">Features</a> ·
  <a href="#tech-stack">Tech stack</a> ·
  <a href="#project-structure">Structure</a> ·
  <a href="#supabase-setup">Supabase</a> ·
  <a href="#getting-started">Getting started</a> ·
  <a href="#environment-variables">Environment</a> ·
  <a href="#usage">Usage</a> ·
  <a href="#notes">Notes</a>
</p>

---

## Overview

This project began as a customization of Vercel's **`with-supabase`** Next.js starter and grew into a small notes application that exercises the whole stack. Supabase Auth is wired through **`@supabase/ssr`**, so the session lives in cookies and is available in Client Components, Server Components, Route Handlers, Server Actions, and the proxy (formerly middleware).

On top of that foundation, the notes feature demonstrates the stack in practice: **Supabase Postgres** stores rows in `notes`, **Supabase Storage** holds images in the `images` bucket, **Server Actions** handle add/edit/delete, and App Router conventions cover rendering with Server Components, Suspense, and streaming.

## Features

- **Cookie-based authentication** with `@supabase/ssr` — one session works across the whole Next.js stack.
- **Email + password sign-up and sign-in**, plus **Google OAuth**.
- **Password reset flow** — forgot-password email → update-password page.
- **Protected route** (`/protected`) that renders the authenticated user's claims and redirects unauthenticated visitors to `/auth/login`.
- **Notes app** at `/notes`:
  - Create a note with a title, content, and optional image.
  - List notes in a responsive card grid with **pagination** (10 notes per page).
  - Edit a note, replacing the image or keeping the existing one; replacing uploads a new file and deletes the old one.
  - Delete a note.
- **Session refresh + route protection** through `proxy.ts` (runs on every request except static assets).
- **Dark / light / system theme** switching with `next-themes`.
- **Toast notifications** for success and error feedback with `sonner`.
- **shadcn/ui** components (New York style, neutral base color).
- **Onboarding tutorial** on the home page that adapts to whether the Supabase environment variables are configured.
- **Realtime chat** component and hook built on Supabase Realtime broadcast, included in the codebase but not mounted on any route.

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | [Next.js](https://nextjs.org) App Router, React Server Components, Server Actions (`next: "latest"`, `cacheComponents: true`) |
| UI runtime | [React](https://react.dev) 19 |
| Language | [TypeScript](https://www.typescriptlang.org) |
| Backend / Auth / Storage | [Supabase](https://supabase.com) (`@supabase/supabase-js`, `@supabase/ssr`) |
| Styling | [Tailwind CSS](https://tailwindcss.com) v3 + `tailwindcss-animate` |
| Components | [shadcn/ui](https://ui.shadcn.com) on [Radix UI](https://www.radix-ui.com) |
| Icons | [lucide-react](https://lucide.dev) |
| Theming | [next-themes](https://github.com/pacocoursey/next-themes) |
| Notifications | [sonner](https://sonner.emilkowal.ski) |
| Fonts | Geist via `next/font/google` |
| Linting | ESLint (`next/core-web-vitals`, `next/typescript`) |
| Package manager | npm (`package-lock.json`) |

The project pins `next: "latest"`, enables `cacheComponents: true` in `next.config.ts`, and uses a root `proxy.ts` — all consistent with the Next.js 16 generation of features, where middleware was renamed to "proxy".

## Project structure

```
app/
  auth/
    callback/route.ts        OAuth / email code exchange
    confirm/route.ts         email OTP verification
    error/page.tsx           auth error page
    forgot-password/         request a reset email
    login/ sign-up/          auth forms
    sign-up-success/         post-signup notice
    update-password/         set a new password
  notes/
    [id]/
      edit-note-content.tsx  load + edit a single note
      page.tsx               edit route (Suspense)
    notes-list.tsx           server component: query + list
    notes-list-wrapper.tsx   Suspense wrapper + skeleton
    notes-page-client.tsx    toast feedback from search params
    page.tsx                 notes page + "add note" form
  protected/
    layout.tsx
    page.tsx                 authenticated-only page
  globals.css
  layout.tsx                 root layout: theme, header, footer
  page.tsx                   home / onboarding
components/
  ui/                        shadcn/ui primitives
  tutorial/                  onboarding tutorial steps
  auth-button.tsx            sign in / sign up / logout
  login-form.tsx sign-up-form.tsx
  forgot-password-form.tsx update-password-form.tsx
  env-var-warning.tsx        shown when Supabase env vars are missing
  realtime-chat.tsx          unused realtime chat UI
  chat-message.tsx
  header.tsx footer.tsx hero.tsx
hooks/
  use-chat-scroll.tsx        auto-scroll for chat
  use-realtime-chat.tsx      Supabase Realtime chat hook
lib/
  notes/                     Server Actions: add.ts, delete.ts, edite.ts
  supabase/
    client.ts                browser client
    server.ts                server client (cookies)
    proxy.ts                 session update for proxy.ts
    middleware.ts            legacy middleware variant
  utils.ts                   cn() + hasEnvVars
proxy.ts                     route protection + session refresh
components.json              shadcn/ui configuration
next.config.ts
tailwind.config.ts
postcss.config.mjs
eslint.config.mjs
tsconfig.json
.env.example
package.json
```

> The edit Server Action file is spelled `edite.ts` — intentional, and it matches the import in `app/notes/[id]/edit-note-content.tsx`.

## Supabase setup

The app expects these resources in your Supabase project. The schema and bucket are **not included in this repository** — create them in the Supabase dashboard (or via the CLI) before using the notes feature:

- A **`notes` table** with the columns `id`, `title`, `content`, and `image`.
- An **`images` storage bucket** used for note images and served through public URLs.

Configure the authentication redirect URLs in the Supabase dashboard so OAuth and password-reset flows work. Also update the `images.remotePatterns` hostname in `next.config.ts` — it is pinned to a specific Supabase project, so `next/image` will reject images from a different project until you change it.

## Getting started

Requirements: **Node.js >= 22.23.4** (`.nvmrc` pins `24.22.1`), **npm**, and a **Supabase project** (create one at [database.new](https://database.new)).

```bash
git clone https://github.com/NetParamad/starter-nextjs-supabase.git
cd starter-nextjs-supabase
npm install
cp .env.example .env.local   # fill in your Supabase values
npm run dev                  # http://localhost:3000
```

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server at `http://localhost:3000` |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

## Environment variables

Copy `.env.example` to `.env.local` and set (names only — never commit real values):

| Variable | Required | Notes |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ | Supabase publishable (or legacy anon) key |

The variable is named `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to match Supabase's newer **publishable** key format. Both legacy anon keys and new publishable keys work with this name during the transition, so the value shown as `NEXT_PUBLIC_SUPABASE_ANON_KEY` in the dashboard can be used here.

`hasEnvVars` in `lib/utils.ts` checks that both public variables are present; when they are missing, the app shows `EnvVarWarning` instead of the interactive auth UI. The code also reads `VERCEL_URL` (set automatically on Vercel, not in `.env.example`) to derive `metadataBase`; you do not set it locally.

## Usage

1. Open the home page (`/`) and follow the onboarding tutorial steps.
2. Go to **Sign up** (`/auth/sign-up`) and create an account with email + password, or continue with **Google**.
3. Confirm your email if required, then sign in at `/auth/login`.
4. Navigate to **Notes** (`/notes`) to add, browse, paginate, edit, and delete notes. Add a note with a title, content, and optional image.
5. Open a note's **Edit** page (`/notes/[id]`) to update its title, content, or image.
6. Visit **Protected** (`/protected`) to see the authenticated user's claims. Unauthenticated visitors are redirected to `/auth/login`.
7. Use the theme switcher in the header to toggle **Light / Dark / System**.

## Notes

- **Template origin** — derived from Vercel's [`with-supabase`](https://github.com/vercel/next.js/tree/canary/examples/with-supabase) example. Many auth components, tutorial steps, and logos come from that template.
- **Realtime chat is unused** — `components/realtime-chat.tsx`, `components/chat-message.tsx`, and `hooks/use-realtime-chat.tsx` implement Supabase Realtime broadcast chat, but no route renders `<RealtimeChat />`. It is a starting point if you want to add chat.
- **Two middleware files** — `lib/supabase/proxy.ts` is the active session-refresh helper used by the root `proxy.ts`; `lib/supabase/middleware.ts` is the older variant kept from the template and is not referenced by an active middleware file.
- **Client vs server Supabase** — `lib/supabase/client.ts` creates a browser client for Client Components; `lib/supabase/server.ts` creates a per-request server client bound to cookies.
- **No test suite** — there is no test runner configured in `package.json`.
- **Deployment** — no hosting target or CI workflow is documented in the repository.
- **License** — MIT (see [LICENSE](LICENSE)).
