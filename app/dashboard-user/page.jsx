import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import DashboardHeader from '../../components/DashboardHeader'
import PublicSchedule from '../../components/PublicSchedule'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function UserDashboardPage() {
  const { data: schedules } = await supabase
    .from('jadwal')
    .select('id, malam, tanggal, waktu, rakaat, nama_masjid, catatan, status, imam:imam_id(id, nama, nama_masjid)')
    .order('malam', { ascending: true })

  return (
    <>
      <DashboardHeader role="user" />
      <main style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gap: '1.25rem' }}>
          <section style={{
            background: 'white',
            borderRadius: '14px',
            padding: '1.5rem',
            border: '1px solid #e5e7eb',
          }}>
            <p style={{ color: '#059669', fontSize: '0.82rem', fontWeight: '800', marginBottom: '0.35rem' }}>
              Dashboard User
            </p>
            <h1 style={{ fontSize: '1.55rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>
              Jadwal tarawih siap dipantau
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '1.25rem' }}>
              Lihat jadwal imam, cari berdasarkan nama imam atau masjid, lalu simpan informasi malam yang dibutuhkan.
            </p>

            <Link
              href="/jadwal"
              style={{
                display: 'inline-flex',
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                background: '#059669',
                color: 'white',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '0.9rem',
              }}
            >
              Buka Jadwal Publik
            </Link>
          </section>

          <PublicSchedule schedules={schedules || []} title="Jadwal Terbaru" />
        </div>
      </main>
    </>
  )
}
