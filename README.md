# SiJimat - Sistem Jadwal Imam Tarawih

SiJimat hadir untuk membantu pengurus masjid menyusun dan memantau jadwal imam tarawih secara digital agar rapi, mudah, dan tidak ribet.

---

## Fitur Utama

**Untuk Admin**
- Kelola akun imam dan atur role pengguna
- Tambah, edit, dan hapus jadwal tarawih 30 malam
- Ubah status jadwal: Terjadwal, Dikonfirmasi, Berhalangan, Diganti
- Balas laporan masuk dari imam langsung di dashboard
- Export jadwal ke CSV atau copy ke WhatsApp

**Untuk Imam**
- Daftar akun dan lengkapi data diri sekali saja
- Lihat jadwal pribadi dan konfirmasi kehadiran
- Atur pengingat jadwal lewat email (1 jam, 6 jam, 1 hari, atau 7 hari sebelum bertugas)
- Kirim pesan atau laporan ke admin dan menerima balasan di dashboard

**Untuk Publik**
- Lihat jadwal tarawih lengkap 30 malam tanpa perlu login

---

## Teknologi

| Layer | Teknologi |
|---|---|
| Framework | Next.js 14 |
| Frontend | React 18 |
| Backend | Next.js Server Actions & API Routes |
| Database | Supabase (PostgreSQL) |
| Auth | Custom session via cookie |
| Email | Resend |
| Validasi | Zod |
| Hosting | Vercel |
| Cron | cron-job.org |

---

## Instalasi

```bash
git clone https://github.com/meiditaa02/sijimat.git
cd sijimat
npm install
```

Buat file `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=isi_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=isi_anon_key
SUPABASE_SERVICE_ROLE_KEY=isi_service_role_key
RESEND_API_KEY=isi_resend_api_key
CRON_SECRET=isi_cron_secret
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Jalankan:

```bash
npm run dev
```

---

## Setup Database

Jalankan file SQL berikut di Supabase SQL Editor secara berurutan:

1. `data/schema-jadwal.sql`
2. `data/schema-update-role-jadwal.sql`

---

## Akun Demo Admin

```
username: admin
password: sijimat123
```

---

## Struktur Folder

```
app/           Halaman dan API routes
components/    Komponen UI
data/          File SQL dan data dummy
lib/           Konfigurasi Supabase
public/        Asset (logo, ikon)
```

---

## Notifikasi Email Otomatis

Notifikasi pengingat jadwal dikirim lewat **Resend** dan dipicu oleh cron job dari **cron-job.org** setiap jam. Imam bisa memilih interval pengingat di halaman profil.

Setup cron di cron-job.org:
- URL: `https://domain-kamu.vercel.app/api/cron-remind`
- Schedule: `*/30 * * * *`
- Header: `Authorization: Bearer [CRON_SECRET]`
