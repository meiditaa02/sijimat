import Link from 'next/link'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import DashboardHeader from '../../components/DashboardHeader'
import ImamScheduleActions from '../../components/ImamScheduleActions'
import BalasanImam from '../../components/BalasanImam'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)


const statusStyle = {
  terjadwal: { label: 'Terjadwal', bg: '#eff6ff', color: '#1d4ed8' },
  dikonfirmasi: { label: 'Dikonfirmasi', bg: '#ecfdf5', color: '#047857' },
  berhalangan: { label: 'Berhalangan', bg: '#fef2f2', color: '#b91c1c' },
  diganti: { label: 'Diganti', bg: '#fff7ed', color: '#c2410c' },
}

function getSessionUserId() {
  const session = cookies().get('session')?.value || ''
  return session.startsWith('user-') ? session.replace('user-', '') : null
}

export default async function ImamDashboardPage() {
  const userId = getSessionUserId()

  const [{ data: schedules }, myImamResult] = await Promise.all([
    supabase
      .from('jadwal')
      .select('id, malam, tanggal, waktu, rakaat, nama_masjid, catatan, status, imam_id, imam:imam_id(id, nama, nama_masjid)')
      .order('malam', { ascending: true }),
    userId
      ? supabase
        .from('imam')
        .select('id, nama, no_whatsapp, nama_masjid, ketersediaan, created_at')
        .eq('user_id', userId)
      : Promise.resolve({ data: [], error: null }),
  ])

  const myImams = myImamResult.data || []
  const myImamIds = myImams.map((imam) => imam.id)
  const mySchedules = (schedules || []).filter((schedule) => myImamIds.includes(schedule.imam_id))

  return (
    <>
      <DashboardHeader role="imam" />
      <main style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gap: '1.25rem' }}>

          {/* HERO */}
          <section style={{ background: 'white', borderRadius: '14px', padding: '1.5rem', border: '1px solid #e5e7eb' }}>
            <p style={{ color: '#059669', fontSize: '0.82rem', fontWeight: '800', marginBottom: '0.35rem' }}>
              Dashboard Imam
            </p>
            <h1 style={{ fontSize: '1.55rem', fontWeight: '800', color: '#111827', marginBottom: '0.5rem' }}>
              Konfirmasi jadwal tarawih
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '1.25rem' }}>
              Jadwal yang terhubung ke data imam Anda bisa dikonfirmasi langsung dari halaman ini.
            </p>
            <Link
              href={myImams.length > 0 ? '/profile' : '/daftar-imam'}
              style={{
                display: 'inline-block',
                padding: '0.6rem 1rem',
                borderRadius: '8px',
                background: '#059669',
                color: 'white',
                textDecoration: 'none',
                fontWeight: '700',
                fontSize: '0.9rem',
              }}
            >
              {myImams.length > 0 ? 'Edit Data Imam' : 'Isi Data Imam'}
            </Link>
          </section>

          {/* JADWAL SAYA */}
          <section style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.25rem' }}>
            <h2 style={{ color: '#111827', fontSize: '1.05rem', fontWeight: '800', marginBottom: '1rem' }}>
              Jadwal Saya
            </h2>
            {myImamResult.error && (
              <div style={{ background: '#fffbeb', border: '1px solid #fde68a', color: '#92400e', borderRadius: '10px', padding: '0.85rem', marginBottom: '1rem', fontWeight: '700' }}>
                Kolom user_id belum ada di tabel imam. Jalankan SQL update yang aku buat di Supabase.
              </div>
            )}
            {!myImamResult.error && myImams.length === 0 && (
              <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1rem', color: '#6b7280' }}>
                Data imam Anda belum terhubung. Klik <strong>Isi Data Imam</strong> agar jadwal bisa muncul di bagian ini.
              </div>
            )}
            {mySchedules.length === 0 && myImams.length > 0 && (
              <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1rem', color: '#6b7280' }}>
                Belum ada jadwal yang ditugaskan ke data imam Anda.
              </div>
            )}
            {mySchedules.length > 0 && (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {mySchedules.map((schedule) => {
                  const status = statusStyle[schedule.status || 'terjadwal'] || statusStyle.terjadwal
                  return (
                    <article key={schedule.id} style={{ background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '10px', padding: '1rem', display: 'grid', gap: '0.65rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ color: '#059669', fontWeight: '900' }}>Malam {schedule.malam}</div>
                          <div style={{ color: '#111827', fontWeight: '800' }}>{schedule.nama_masjid}</div>
                          <div style={{ color: '#6b7280', fontSize: '0.82rem' }}>{schedule.waktu} - {schedule.rakaat} rakaat</div>
                        </div>
                        <span style={{ alignSelf: 'start', background: status.bg, color: status.color, borderRadius: '999px', padding: '0.22rem 0.65rem', fontSize: '0.74rem', fontWeight: '900' }}>
                          {status.label}
                        </span>
                      </div>
                      <ImamScheduleActions scheduleId={schedule.id} />
                    </article>
                  )
                })}
              </div>
            )}
          </section>

          {/* BALASAN ADMIN */}
          <BalasanImam />

        </div>
      </main>
    </>
  )
}