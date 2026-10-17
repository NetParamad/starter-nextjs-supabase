[English](README.md) | [ไทย](README.th.md)

# Next.js + Supabase Starter (My Notes)

สตาร์ทเตอร์แบบ full-stack ที่สร้างบน **Next.js (App Router)** และ **Supabase** ตั้งค่าระบบยืนยันตัวตนแบบใช้คุกกี้ไว้ให้เรียบร้อย พร้อมแอปตัวอย่าง "My Notes" ที่ใช้งานได้จริง (เพิ่ม / ดู / แก้ไข / ลบ พร้อมอัปโหลดรูปภาพ)

## ภาพรวม

โปรเจกต์นี้เริ่มต้นจากการปรับแต่งเทมเพลตสตาร์ทของ Vercel ชื่อ **`with-supabase`** แล้วพัฒนาต่อเป็นแอปจดบันทึกขนาดเล็กที่ได้ใช้งานฟีเจอร์ของทั้งสแต็ก

ระบบยืนยันตัวตนของ Supabase ถูกตั้งค่าผ่าน **`@supabase/ssr`** ทำให้ session ของผู้ใช้ถูกเก็บในคุกกี้และเข้าถึงได้ทั่วทั้งแอป Next.js ไม่ว่าจะเป็น Client Component, Server Component, Route Handler, Server Action หรือ proxy (ที่เดิมเรียกว่า middleware) บนพื้นฐานนี้ ฟีเจอร์โน้ตได้สาธิตการทำงานของทั้งสแต็กในทางปฏิบัติ

- ใช้ **Supabase Postgres** เป็นฐานข้อมูล (ตาราง `notes`)
- ใช้ **Supabase Storage** เก็บรูปภาพของโน้ต (บัคเก็ต `images`)
- ใช้ **Server Actions** สำหรับการแก้ไขข้อมูลทั้งหมด (เพิ่ม / แก้ไข / ลบ)
- ใช้รูปแบบของ **App Router** ในการเรนเดอร์ (Server Component, Suspense, streaming)

เป้าหมายคือเป็นพื้นฐานที่พร้อมใช้งานสำหรับนำไปโคลนและต่อยอด อีกทั้งยังใช้เป็นตัวอย่างเรียนรู้ว่าแต่ละส่วนทำงานร่วมกันอย่างไร

## ฟีเจอร์

- **การยืนยันตัวตนด้วยคุกกี้** ผ่าน `@supabase/ssr` — ใช้ session เดียวกันได้ทั่วทั้งสแต็กของ Next.js
- **สมัครและเข้าสู่ระบบด้วยอีเมล + รหัสผ่าน** พร้อมตัวเลือก **Google OAuth**
- **ขั้นตอนรีเซ็ตรหัสผ่าน**: ส่งอีเมลลืมรหัสผ่าน → หน้าเปลี่ยนรหัสผ่านใหม่
- **หน้าสำหรับผู้ใช้ที่ล็อกอินแล้ว** (`/protected`) แสดงข้อมูล claims ของผู้ใช้ และเปลี่ยนเส้นทางผู้ที่ยังไม่ล็อกอินไปยังหน้าเข้าสู่ระบบ
- **แอปโน้ต** ที่ `/notes`:
  - สร้างโน้ตพร้อมหัวข้อ เนื้อหา และรูปภาพ (ไม่บังคับ)
  - แสดงรายการโน้ตเป็นการ์ดที่ปรับตามขนาดหน้าจอ พร้อม **การแบ่งหน้า** (หน้าละ 10 รายการ)
  - แก้ไขโน้ต โดยจะเปลี่ยนรูปใหม่หรือคงรูปเดิมไว้ก็ได้
  - ลบโน้ต (และลบรูปที่จัดเก็บไว้เมื่อมีการเปลี่ยนรูป)
- **รีเฟรช session และป้องกันเส้นทาง** ผ่าน `proxy.ts` ซึ่งทำงานทุกคำขอ ยกเว้นไฟล์ static
- **สลับธีม มืด / สว่าง / ตามระบบ** (`next-themes`)
- **แจ้งเตือนแบบ toast** สำหรับผลสำเร็จและข้อผิดพลาด (`sonner`)
- ไลบรารีคอมโพเนนต์ **shadcn/ui** (สไตล์ New York, สีฐาน neutral)
- **ขั้นตอนแนะนำการเริ่มต้น (tutorial)** บนหน้าแรก ซึ่งจะปรับตามว่าตั้งค่าตัวแปรสภาพแวดล้อมของ Supabase แล้วหรือยัง
- คอมโพเนนต์และฮุก **realtime chat** ที่ใช้ Supabase Realtime broadcast — มีอยู่ในโค้ดแต่ยังไม่ได้ถูกเรียกใช้ในหน้าใด ๆ (ดูหัวข้อ [หมายเหตุ](#หมายเหตุ))

## เทคโนโลยีที่ใช้

| ชั้น | เทคโนโลยี |
| --- | --- |
| เฟรมเวิร์ก | [Next.js](https://nextjs.org) (App Router, React Server Components, Server Actions) |
| รันไทม์ UI | [React](https://react.dev) 19 |
| ภาษา | [TypeScript](https://www.typescriptlang.org) |
| แบ็กเอนด์ / Auth / Storage | [Supabase](https://supabase.com) (`@supabase/supabase-js`, `@supabase/ssr`) |
| การจัดสไตล์ | [Tailwind CSS](https://tailwindcss.com) v3 + `tailwindcss-animate` |
| คอมโพเนนต์ | [shadcn/ui](https://ui.shadcn.com) บนพื้นฐาน [Radix UI](https://www.radix-ui.com) |
| ไอคอน | [lucide-react](https://lucide.dev) |
| ธีม | [next-themes](https://github.com/pacocoursey/next-themes) |
| การแจ้งเตือน | [sonner](https://sonner.emilkowal.ski) |
| Linting | ESLint (`next/core-web-vitals`, `next/typescript`) |
| ฟอนต์ | Geist (ผ่าน `next/font/google`) |

โปรเจกต์กำหนด `next: "latest"`, เปิด `cacheComponents: true` ใน `next.config.ts` และใช้ไฟล์ `proxy.ts` ที่รากโปรเจกต์ — ทั้งหมดสอดคล้องกับฟีเจอร์ยุค **Next.js 16** (ที่ middleware ถูกเปลี่ยนชื่อเป็น "proxy")

## โครงสร้างโปรเจกต์

```
starter-nextjs-supabase/
├── app/
│   ├── auth/
│   │   ├── callback/route.ts        # แลก code สำหรับ OAuth / อีเมล
│   │   ├── confirm/route.ts         # ยืนยัน OTP ทางอีเมล
│   │   ├── error/page.tsx           # หน้าแสดงข้อผิดพลาดการยืนยันตัวตน
│   │   ├── forgot-password/page.tsx
│   │   ├── login/page.tsx
│   │   ├── sign-up/page.tsx
│   │   ├── sign-up-success/page.tsx
│   │   └── update-password/page.tsx
│   ├── notes/
│   │   ├── [id]/
│   │   │   ├── edit-note-content.tsx # โหลด + แก้ไขโน้ตทีละรายการ
│   │   │   └── page.tsx              # เส้นทางแก้ไขโน้ต (Suspense)
│   │   ├── notes-list.tsx            # Server Component: ดึงข้อมูล + แสดงรายการ
│   │   ├── notes-list-wrapper.tsx    # ตัวห่อ Suspense + skeleton
│   │   ├── notes-page-client.tsx     # แจ้งเตือนจาก search params
│   │   └── page.tsx                  # หน้าโน้ต + ฟอร์ม "add note"
│   ├── protected/
│   │   ├── layout.tsx
│   │   └── page.tsx                  # หน้าสำหรับผู้ใช้ที่ล็อกอินแล้วเท่านั้น
│   ├── globals.css
│   ├── layout.tsx                    # Root layout: ธีม, header, footer
│   └── page.tsx                      # หน้าแรก / การเริ่มต้น
├── components/
│   ├── ui/                           # อะตอมของ shadcn/ui
│   ├── tutorial/                     # ขั้นตอนแนะนำการเริ่มต้น
│   ├── auth-button.tsx               # เข้าสู่ระบบ / สมัคร / ออกจากระบบ
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
│   ├── use-chat-scroll.tsx           # เลื่อนอัตโนมัติสำหรับแชต
│   └── use-realtime-chat.tsx         # ฮุกแชต Supabase Realtime
├── lib/
│   ├── notes/                        # Server Actions
│   │   ├── add.ts
│   │   ├── delete.ts
│   │   └── edite.ts
│   ├── supabase/
│   │   ├── client.ts                 # ไคลเอนต์ฝั่งเบราว์เซอร์
│   │   ├── server.ts                 # ไคลเอนต์ฝั่งเซิร์ฟเวอร์ (คุกกี้)
│   │   ├── proxy.ts                  # อัปเดต session สำหรับ proxy.ts
│   │   └── middleware.ts             # เวอร์ชัน middleware เดิม
│   └── utils.ts                      # cn() + hasEnvVars
├── proxy.ts                          # ป้องกันเส้นทาง + รีเฟรช session
├── components.json                   # การตั้งค่า shadcn/ui
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── tsconfig.json
├── .env.example
└── package.json
```

> [!NOTE]
> Server Actions ของโน้ตอยู่ใน `lib/notes/` ไฟล์ของ action สำหรับแก้ไขสะกดว่า `edite.ts` — เป็นเช่นนี้โดยตั้งใจและตรงกับที่ import ใช้ใน `app/notes/[id]/edit-note-content.tsx`

## เริ่มต้นใช้งาน

### สิ่งที่ต้องมีก่อน

- **Node.js** (เวอร์ชัน LTS; เวอร์ชันต่ำสุดที่ต้องการเป็นไปตาม Next.js ที่ pin ไว้)
- **npm** (ในโปรเจกต์มีไฟล์ `package-lock.json` มาด้วย)
- **โปรเจกต์ Supabase** — สร้างได้ที่ [database.new](https://database.new)

### ติดตั้ง

```bash
npm install
```

### ตั้งค่าตัวแปรสภาพแวดล้อม

คัดลอก `.env.example` เป็น `.env.local` แล้วกรอกค่าของโปรเจกต์คุณ (ดู [ตัวแปรสภาพแวดล้อม](#ตัวแปรสภาพแวดล้อม))

```bash
cp .env.example .env.local
```

### รันเซิร์ฟเวอร์สำหรับพัฒนา

```bash
npm run dev
```

แอปจะรันอยู่ที่ [http://localhost:3000](http://localhost:3000/)

### บิลด์และรันสำหรับโปรดักชัน

```bash
npm run build
npm run start
```

### ตรวจ Lint

```bash
npm run lint
```

### การตั้งค่าฝั่ง Supabase

แอปคาดหวังทรัพยากรต่อไปนี้ในโปรเจกต์ Supabase ของคุณ โดย **สคีมาและบัคเก็ตไม่ได้รวมอยู่ในรีโปนี้** — ให้ตั้งค่าในแดชบอร์ด Supabase (หรือผ่าน CLI) ก่อนใช้งานฟีเจอร์โน้ต

- **ตาราง `notes`** ที่ใช้คอลัมน์ `id`, `title`, `content` และ `image`
- **บัคเก็ต `images`** สำหรับเก็บรูปโน้ตและให้บริการผ่าน public URL

นอกจากนี้คุณต้องตั้งค่า redirect URL สำหรับการยืนยันตัวตนในแดชบอร์ด Supabase เพื่อให้ขั้นตอน OAuth และการรีเซ็ตรหัสผ่านทำงานได้

## ตัวแปรสภาพแวดล้อม

ในที่นี้แสดงเฉพาะ **ชื่อ** ของตัวแปรเท่านั้น ห้าม commit ค่าจริงลงรีโป

| ตัวแปร | ขอบเขต | คำอธิบาย |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public | URL ของโปรเจกต์ Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Public | คีย์ publishable (หรือ anon แบบเดิม) ของ Supabase |
| `VERCEL_URL` | ฝั่งเซิร์ฟเวอร์ (อัตโนมัติ) | Vercel กำหนดให้เอง ใช้สร้าง `metadataBase` ไม่จำเป็นต้องตั้งค่าในเครื่อง |

> [!NOTE]
> ตัวแปรชื่อ `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` ตั้งขึ้นให้ตรงกับรูปแบบคีย์ **publishable** แบบใหม่ของ Supabase ทั้งคีย์ **anon** แบบเดิมและคีย์ **publishable** แบบใหม่ใช้ชื่อนี้ได้ในช่วงเปลี่ยนผ่าน ดังนั้นค่าที่แดชบอร์ดแสดงเป็น `NEXT_PUBLIC_SUPABASE_ANON_KEY` สามารถนำมาใช้ที่นี่ได้

ตัวช่วย `hasEnvVars` ใน `lib/utils.ts` จะตรวจว่ามีตัวแปร public ทั้งสองตัวหรือไม่ หากขาดไป แอปจะแสดงคอมโพเนนต์ `EnvVarWarning` แทนส่วนติดต่อผู้ใช้สำหรับการยืนยันตัวตน

## วิธีใช้งาน

1. เปิดหน้าแรก (`/`) และทำตามขั้นตอนแนะนำการเริ่มต้น
2. ไปที่ **Sign up** (`/auth/sign-up`) แล้วสร้างบัญชีด้วยอีเมล + รหัสผ่าน หรือดำเนินการต่อด้วย **Google**
3. ยืนยันอีเมลหากระบบกำหนด จากนั้นเข้าสู่ระบบที่ `/auth/login`
4. ไปที่ **Notes** (`/notes`) เพื่อเพิ่ม เรียกดู แบ่งหน้า แก้ไข และลบโน้ต เพิ่มโน้ตผ่านฟอร์มและแนบรูปภาพได้ตามต้องการ
5. เปิดหน้า **Edit** ของโน้ต (`/notes/[id]`) เพื่อแก้หัวข้อ เนื้อหา หรือรูปภาพ
6. เข้า **Protected** (`/protected`) เพื่อดูข้อมูล claims ของผู้ใช้ ผู้ที่ยังไม่ล็อกอินจะถูกเปลี่ยนเส้นทางไปที่ `/auth/login`
7. ใช้ตัวสลับธีมบน header เพื่อเลือก **Light / Dark / System**

## หมายเหตุ

- **ที่มาของเทมเพลต** โปรเจกต์นี้ดัดแปลงมาจากตัวอย่าง Next.js ชื่อ [`with-supabase`](https://github.com/vercel/next.js/tree/canary/examples/with-supabase) ของ Vercel คอมโพเนนต์ด้านการยืนยันตัวตน ขั้นตอน tutorial และโลโก้จำนวนมากมาจากเทมเพลตนั้น
- **Realtime chat (ยังไม่ถูกใช้)** ไฟล์ `components/realtime-chat.tsx`, `components/chat-message.tsx` และ `hooks/use-realtime-chat.tsx` ทำหน้าที่เป็นแชตผ่าน Supabase Realtime broadcast แต่ยังไม่มีเส้นทางใดเรนเดอร์ `<RealtimeChat />` ใช้เป็นจุดเริ่มต้นได้ถ้าต้องการเพิ่มแชตในแอป
- **ไฟล์ middleware สองไฟล์** `lib/supabase/proxy.ts` เป็นตัวช่วยรีเฟรช session ที่ใช้งานอยู่ (ถูกเรียกโดย `proxy.ts` ที่รากโปรเจกต์) ส่วน `lib/supabase/middleware.ts` เป็นเวอร์ชันเก่าที่คงไว้จากเทมเพลตและไม่ได้ถูกอ้างอิงโดยไฟล์ middleware ที่ทำงานจริง
- **Supabase ฝั่งไคลเอนต์กับเซิร์ฟเวอร์** `lib/supabase/client.ts` สร้างไคลเอนต์ฝั่งเบราว์เซอร์สำหรับ Client Component ส่วน `lib/supabase/server.ts` สร้างไคลเอนต์ฝั่งเซิร์ฟเวอร์ต่อคำขอที่ผูกกับคุกกี้
- **ยังไม่มีชุดทดสอบ** ปัจจุบันยังไม่ได้ตั้งค่า test runner ใด ๆ ใน `package.json`
- **ภาษาเอกสาร** ไฟล์นี้คือเวอร์ชันภาษาไทย ดูเวอร์ชันภาษาอังกฤษได้ที่ [README.md](README.md)
