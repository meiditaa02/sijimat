# SiJimat

SiJimat adalah aplikasi web untuk membantu pengurus masjid mengelola jadwal imam tarawih. Aplikasi ini dibuat dengan Next.js dan Supabase, dengan pembagian akses untuk admin, imam, dan user.

## Fitur

- Login berdasarkan role admin, imam, dan user.
- Dashboard berbeda untuk setiap role.
- Admin dapat mengelola role pengguna.
- Admin dapat menambah, mengedit, dan menghapus data imam.
- Admin dapat menambah, mengedit, mengganti, dan menghapus jadwal tarawih.
- Imam dapat mengisi data imam satu kali dan mengeditnya melalui halaman profil.
- Imam dapat mengonfirmasi jadwal dengan status bisa hadir atau berhalangan.
- User dapat melihat jadwal publik.
- Navbar dashboard dipisahkan dari landing page.

## Teknologi

- Next.js 14
- React 18
- Supabase
- Zod

## Instalasi

Clone repository, lalu install dependency:

```bash
npm install
```

Buat file `.env.local`, lalu isi konfigurasi Supabase:

```env
NEXT_PUBLIC_SUPABASE_URL=isi_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=isi_anon_key_supabase
SUPABASE_SERVICE_ROLE_KEY=isi_service_role_key_supabase
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

Jalankan aplikasi:

```bash
npm run dev -- --port 3001
```

Buka aplikasi di browser:

```text
http://localhost:3001
```

## Database

File SQL untuk Supabase ada di folder `data/`.

- `data/schema-jadwal.sql`
- `data/schema-update-role-jadwal.sql`

Jalankan SQL tersebut di Supabase SQL Editor agar tabel dan kolom yang dibutuhkan tersedia.

## Akun Demo

Admin demo:

```text
username: admin
password: sijimat123
```

## Struktur Folder

```text
app/          Halaman dan route Next.js
components/   Komponen UI aplikasi
data/         File data dan SQL Supabase
lib/          Konfigurasi dan helper Supabase
public/       Asset publik seperti logo
```

## Catatan

File `.env.local`, `.next`, `node_modules`, dan file log tidak perlu di-upload ke GitHub karena berisi data lokal, hasil build, atau dependency yang bisa dibuat ulang.
