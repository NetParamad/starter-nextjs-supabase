[EN](README.md) | [TH](README.th.md)

<h1 align="center">Next.js + Supabase Starter (My Notes)</h1>

<p align="center">
  สตาร์ทเตอร์แบบ full-stack บน Next.js App Router และ Supabase พร้อมระบบยืนยันตัวตนด้วยคุกกี้และแอปโน้ตที่ใช้งานได้จริง
</p>

<p align="center">
  <a href="#ภาพรวม">ภาพรวม</a> ·
  <a href="#ฟีเจอร์">ฟีเจอร์</a> ·
  <a href="#เทคโนโลยีที่ใช้">เทคโนโลยี</a> ·
  <a href="#โครงสร้างโปรเจกต์">โครงสร้าง</a> ·
  <a href="#การตั้งค่า-supabase">Supabase</a> ·
  <a href="#เริ่มต้นใช้งาน">เริ่มต้นใช้งาน</a> ·
  <a href="#ตัวแปรสภาพแวดล้อม">ตัวแปรสภาพแวดล้อม</a> ·
  <a href="#วิธีใช้งาน">วิธีใช้งาน</a> ·
  <a href="#หมายเหตุ">หมายเหตุ</a>
</p>

---

## ภาพรวม

โปรเจกต์นี้เริ่มต้นจากการปรับแต่งเทมเพลตสตาร์ทของ Vercel ชื่อ **`with-supabase`** แล้วพัฒนาต่อเป็นแอปจดบันทึกขนาดเล็กที่ได้ใช้งานฟีเจอร์ของทั้งสแต็ก ระบบยืนยันตัวตนของ Supabase ตั้งค่าผ่าน **`@supabase/ssr`** ทำให้ session ถูกเก็บในคุกกี้และเข้าถึงได้ทั้งใน Client Component, Server Component, Route Handler, Server Action และ proxy (ที่เดิมเรียกว่า middleware)

บนพื้นฐานนี้ ฟีเจอร์โน้ตได้สาธิตการทำงานของทั้งสแต็กในทางปฏิบัติ: **Supabase Postgres** เก็บข้อมูลในตาราง `notes`, **Supabase Storage** เก็บรูปใน bucket `images`, **Server Actions** จัดการเพิ่ม/แก้ไข/ลบ และรูปแบบของ App Router ดูแลการเรนเดอร์ด้วย Server Components, Suspense และ streaming

## ฟีเจอร์

- **การยืนยันตัวตนด้วยคุกกี้** ผ่าน `@supabase/ssr` — ใช้ session เดียวกันได้ทั่วทั้งสแต็กของ Next.js
- **สมัครและเข้าสู่ระบบด้วยอีเมล + รหัสผ่าน** พร้อม **Google OAuth**
- **ขั้นตอนรีเซ็ตรหัสผ่าน** — ส่งอีเมลลืมรหัสผ่าน → หน้าเปลี่ยนรหัสผ่านใหม่
- **หน้าสำหรับผู้ใช้ที่ล็อกอินแล้ว** (`/protected`) แสดง claims ของผู้ใช้ และเปลี่ยนเส้นทางผู้ที่ยังไม่ล็อกอินไปที่ `/auth/login`
- **แอปโน้ต** ที่ `/notes`:
  - สร้างโน้ตพร้อมหัวข้อ เนื้อหา และรูปภาพ (ไม่บังคับ)
  - แสดงรายการโน้ตเป็นการ์ดที่ปรับตามขนาดหน้าจอ พร้อม **การแบ่งหน้า** (หน้าละ 10 รายการ)
  - แก้ไขโน้ต เปลี่ยนรูปใหม่หรือคงรูปเดิมไว้ก็ได้; เมื่อเปลี่ยนรูปจะอัปโหลดไฟล์ใหม่และลบไฟล์เก่า
  - ลบโน้ต
- **รีเฟรช session และป้องกันเส้นทาง** ผ่าน `proxy.ts` (ทำงานทุกคำขอ ยกเว้นไฟล์ static)
- **สลับธีม มืด / สว่าง / ตามระบบ** ด้วย `next-themes`
- **แจ้งเตือนแบบ toast** สำหรับผลสำเร็จและข้อผิดพลาดด้วย `sonner`
- คอมโพเนนต์ **shadcn/ui** (สไตล์ New York, สีฐาน neutral)
- **ขั้นตอนแนะนำการเริ่มต้น (tutorial)** บนหน้าแรก ซึ่งปรับตามว่าตั้งค่าตัวแปรสภาพแวดล้อมของ Supabase แล้วหรือยัง
- คอมโพเนนต์และฮุก **realtime chat** ที่ใช้ Supabase Realtime broadcast มีอยู่ในโค้ดแต่ยังไม่ได้ถูกเรียกใช้ในหน้าใด ๆ

## เทคโนโลยีที่ใช้

| ด้าน | ที่เลือกใช้ |
| --- | --- |
| เฟรมเวิร์ก | [Next.js](https://nextjs.org) App Router, React Server Components, Server Actions (`next: "latest"`, `cacheComponents: true`) |
| รันไทม์ UI | [React](https://react.dev) 19 |
| ภาษา | [TypeScript](https://www.typescriptlang.org) |
| แบ็กเอนด์ / Auth / Storage | [Supabase](https://supabase.com) (`@supabase/supabase-js`, `@supabase/ssr`) |
| การจัดสไตล์ | [Tailwind CSS](https://tailwindcss.com) v3 + `tailwindcss-animate` |
| คอมโพเนนต์ | [shadcn/ui](https://ui.shadcn.com) บน [Radix UI](https://www.radix-ui.com) |
| ไอคอน | [lucide-react](https://lucide.dev) |
| ธีม | [next-themes](https://github.com/pacocoursey/next-themes) |
| การแจ้งเตือน | [sonner](https://sonner.emilkowal.ski) |
| ฟอนต์ | Geist ผ่าน `next/font/google` |
| Linting | ESLint (`next/core-web-vitals`, `next/typescript`) |
| ตัวจัดการแพ็กเกจ | npm (`package-lock.json`) |

โปรเจกต์กำหนด `next: "latest"`, เปิด `cacheComponents: true` ใน `next.config.ts` และใช้ไฟล์ `proxy.ts` ที่รากโปรเจกต์ — ทั้งหมดสอดคล้องกับฟีเจอร์ยุค Next.js 16 ที่ middleware ถูกเปลี่ยนชื่อเป็น "proxy"

## โครงสร้างโปรเจกต์

```
app/
  auth/
    callback/route.ts        แลก code สำหรับ OAuth / อีเมล
    confirm/route.ts         ยืนยัน OTP ทางอีเมล
    error/page.tsx           หน้าแสดงข้อผิดพลาดการยืนยันตัวตน
    forgot-password/         ขออีเมลรีเซ็ตรหัสผ่าน
    login/ sign-up/          ฟอร์มยืนยันตัวตน
    sign-up-success/         ข้อความหลังสมัคร
    update-password/         ตั้งรหัสผ่านใหม่
  notes/
    [id]/
      edit-note-content.tsx  โหลด + แก้ไขโน้ตทีละรายการ
      page.tsx               เส้นทางแก้ไข (Suspense)
    notes-list.tsx           Server Component: ดึงข้อมูล + แสดงรายการ
    notes-list-wrapper.tsx   ตัวห่อ Suspense + skeleton
    notes-page-client.tsx    แจ้งเตือนจาก search params
    page.tsx                 หน้าโน้ต + ฟอร์ม "add note"
  protected/
    layout.tsx
    page.tsx                 หน้าสำหรับผู้ใช้ที่ล็อกอินแล้วเท่านั้น
  globals.css
  layout.tsx                 root layout: ธีม, header, footer
  page.tsx                   หน้าแรก / การเริ่มต้น
components/
  ui/                        พื้นฐานจาก shadcn/ui
  tutorial/                  ขั้นตอนแนะนำการเริ่มต้น
  auth-button.tsx            เข้าสู่ระบบ / สมัคร / ออกจากระบบ
  login-form.tsx sign-up-form.tsx
  forgot-password-form.tsx update-password-form.tsx
  env-var-warning.tsx        แสดงเมื่อไม่มีตัวแปรสภาพแวดล้อม Supabase
  realtime-chat.tsx          UI แชตเรียลไทม์ที่ยังไม่ถูกใช้
  chat-message.tsx
  header.tsx footer.tsx hero.tsx
hooks/
  use-chat-scroll.tsx        เลื่อนอัตโนมัติสำหรับแชต
  use-realtime-chat.tsx      ฮุกแชต Supabase Realtime
lib/
  notes/                     Server Actions: add.ts, delete.ts, edite.ts
  supabase/
    client.ts                ไคลเอนต์ฝั่งเบราว์เซอร์
    server.ts                ไคลเอนต์ฝั่งเซิร์ฟเวอร์ (คุกกี้)
    proxy.ts                 อัปเดต session สำหรับ proxy.ts
    middleware.ts            เวอร์ชัน middleware เดิม
  utils.ts                   cn() + hasEnvVars
proxy.ts                     ป้องกันเส้นทาง + รีเฟรช session
components.json              การตั้งค่า shadcn/ui
next.config.ts
tailwind.config.ts
postcss.config.mjs
eslint.config.mjs
tsconfig.json
.env.example
package.json
```

> ไฟล์ของ Server Action สำหรับแก้ไขสะกดว่า `edite.ts` — เป็นเช่นนี้โดยตั้งใจและตรงกับที่ import ใช้ใน `app/notes/[id]/edit-note-content.tsx`

## การตั้งค่า Supabase

แอปคาดหวังทรัพยากรต่อไปนี้ในโปรเจกต์ Supabase ของคุณ โดย **สคีมาและบัคเก็ตไม่ได้รวมอยู่ในรีโปนี้** — ให้สร้างในแดชบอร์ด Supabase (หรือผ่าน CLI) ก่อนใช้งานฟีเจอร์โน้ต:

- **ตาราง `notes`** ที่มีคอลัมน์ `id`, `title`, `content` และ `image`
- **บัคเก็ต `images`** สำหรับเก็บรูปโน้ตและให้บริการผ่าน public URL

ตั้งค่า redirect URL สำหรับการยืนยันตัวตนในแดชบอร์ด Supabase เพื่อให้ขั้นตอน OAuth และการรีเซ็ตรหัสผ่านทำงานได้ นอกจากนี้ควรแก้ hostname ใน `images.remotePatterns` ของ `next.config.ts` — ค่าถูกปักหมุดไว้ที่โปรเจกต์ Supabase โปรเจกต์หนึ่ง ดังนั้น `next/image` จะปฏิเสธรูปจากโปรเจกต์อื่นจนกว่าจะเปลี่ยนค่านี้

## เริ่มต้นใช้งาน

ความต้องการ: **Node.js >= 22.23.4** (`.nvmrc` ปักหมุด `24.22.1`), **npm** และ **โปรเจกต์ Supabase** (สร้างได้ที่ [database.new](https://database.new))

```bash
git clone https://github.com/NetParamad/starter-nextjs-supabase.git
cd starter-nextjs-supabase
npm install
cp .env.example .env.local   # fill in your Supabase values
npm run dev                  # http://localhost:3000
```

### คำสั่งสคริปต์

| คำสั่ง | คำอธิบาย |
| --- | --- |
| `npm run dev` | เปิด dev server ที่ `http://localhost:3000` |
| `npm run build` | บิลด์สำหรับโปรดักชัน |
| `npm run start` | เสิร์ฟบิลด์โปรดักชัน |
| `npm run lint` | รัน ESLint |

## ตัวแปรสภาพแวดล้อม

คัดลอก `.env.example` เป็น `.env.local` แล้วตั้งค่า (ระบุเฉพาะชื่อ — ห้ามคอมมิตค่าจริง):

| ตัวแปร | จำเป็น | หมายเหตุ |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL ของโปรเจกต์ Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | ✅ | คีย์ publishable (หรือ anon แบบเดิม) ของ Supabase |

ตัวแปรชื่อ `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` ตั้งขึ้นให้ตรงกับรูปแบบคีย์ **publishable** แบบใหม่ของ Supabase ทั้งคีย์ **anon** แบบเดิมและคีย์ **publishable** แบบใหม่ใช้ชื่อนี้ได้ในช่วงเปลี่ยนผ่าน ดังนั้นค่าที่แดชบอร์ดแสดงเป็น `NEXT_PUBLIC_SUPABASE_ANON_KEY` สามารถนำมาใช้ที่นี่ได้

ตัวช่วย `hasEnvVars` ใน `lib/utils.ts` จะตรวจว่ามีตัวแปร public ทั้งสองตัวหรือไม่ หากขาดไป แอปจะแสดง `EnvVarWarning` แทนส่วนติดต่อผู้ใช้สำหรับการยืนยันตัวตน โค้ดยังอ่าน `VERCEL_URL` (Vercel ตั้งให้อัตโนมัติ ไม่อยู่ใน `.env.example`) เพื่อสร้าง `metadataBase`; ไม่ต้องตั้งค่าในเครื่อง

## วิธีใช้งาน

1. เปิดหน้าแรก (`/`) และทำตามขั้นตอนแนะนำการเริ่มต้น
2. ไปที่ **Sign up** (`/auth/sign-up`) แล้วสร้างบัญชีด้วยอีเมล + รหัสผ่าน หรือดำเนินการต่อด้วย **Google**
3. ยืนยันอีเมลหากระบบกำหนด จากนั้นเข้าสู่ระบบที่ `/auth/login`
4. ไปที่ **Notes** (`/notes`) เพื่อเพิ่ม เรียกดู แบ่งหน้า แก้ไข และลบโน้ต เพิ่มโน้ตด้วยหัวข้อ เนื้อหา และรูปภาพ (ไม่บังคับ)
5. เปิดหน้า **Edit** ของโน้ต (`/notes/[id]`) เพื่อแก้หัวข้อ เนื้อหา หรือรูปภาพ
6. เข้า **Protected** (`/protected`) เพื่อดู claims ของผู้ใช้ ผู้ที่ยังไม่ล็อกอินจะถูกเปลี่ยนเส้นทางไปที่ `/auth/login`
7. ใช้ตัวสลับธีมบน header เพื่อเลือก **Light / Dark / System**

## หมายเหตุ

- **ที่มาของเทมเพลต** — ดัดแปลงจากตัวอย่าง Next.js ชื่อ [`with-supabase`](https://github.com/vercel/next.js/tree/canary/examples/with-supabase) ของ Vercel คอมโพเนนต์ด้านการยืนยันตัวตน ขั้นตอน tutorial และโลโก้จำนวนมากมาจากเทมเพลตนั้น
- **Realtime chat ยังไม่ถูกใช้** — `components/realtime-chat.tsx`, `components/chat-message.tsx` และ `hooks/use-realtime-chat.tsx` ทำหน้าที่เป็นแชตผ่าน Supabase Realtime broadcast แต่ยังไม่มีเส้นทางใดเรนเดอร์ `<RealtimeChat />` ใช้เป็นจุดเริ่มต้นได้ถ้าต้องการเพิ่มแชต
- **ไฟล์ middleware สองไฟล์** — `lib/supabase/proxy.ts` เป็นตัวช่วยรีเฟรช session ที่ใช้งานอยู่ (ถูกเรียกโดย `proxy.ts` ที่รากโปรเจกต์) ส่วน `lib/supabase/middleware.ts` เป็นเวอร์ชันเก่าที่คงไว้จากเทมเพลตและไม่ได้ถูกอ้างอิงโดยไฟล์ middleware ที่ทำงานจริง
- **Supabase ฝั่งไคลเอนต์กับเซิร์ฟเวอร์** — `lib/supabase/client.ts` สร้างไคลเอนต์ฝั่งเบราว์เซอร์สำหรับ Client Component ส่วน `lib/supabase/server.ts` สร้างไคลเอนต์ฝั่งเซิร์ฟเวอร์ต่อคำขอที่ผูกกับคุกกี้
- **ยังไม่มีชุดทดสอบ** — ปัจจุบันยังไม่ได้ตั้งค่า test runner ใด ๆ ใน `package.json`
- **การดีพลอย** — ยังไม่มีเอกสารระบุแพลตฟอร์มโฮสต์หรือ workflow ของ CI ใน repository
- **สัญญาอนุญาต** — MIT (ดู [LICENSE](LICENSE))
