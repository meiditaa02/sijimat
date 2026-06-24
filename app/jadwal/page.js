import Link from 'next/link'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import PublicSchedule from '../../components/PublicSchedule'
import DashboardHeader from '../../components/DashboardHeader'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const masjidUtama = 'Masjid Al-Ikhlas'

const fallbackSchedules = Array.from({ length: 30 }, (_, index) => ({
  id: `sample-${index + 1}`,
  malam: index + 1,
  imam: 'Belum ditentukan',
  rakaat: 11,
  waktu: '19.30 WIB',
  nama_masjid: masjidUtama,
  tanggal_label: `Hari ke-${index + 1}`,
  status: 'terjadwal',
}))

function buildThirtyNightSchedule(schedules = []) {
  const scheduleByNight = new Map(
    schedules
      .filter((schedule) => Number(schedule.malam) >= 1 && Number(schedule.malam) <= 30)
      .map((schedule) => [Number(schedule.malam), schedule])
  )

  return fallbackSchedules.map((fallback) => ({
    ...fallback,
    ...(scheduleByNight.get(fallback.malam) || {}),
  }))
}

export default async function JadwalPage() {
  const role = cookies().get('session_role')?.value
  const isLoggedIn = Boolean(cookies().get('session')?.value)
  const dashboardHome = role === 'admin' ? '/dashboard' : role === 'imam' ? '/dashboard-imam' : '/dashboard-user'

  const { data: schedules } = await supabase
    .from('jadwal')
    .select('id, malam, tanggal, waktu, rakaat, nama_masjid, catatan, status, imam:imam_id(id, nama, nama_masjid)')
    .order('malam', { ascending: true })

  const publicSchedules = buildThirtyNightSchedule(schedules || [])

  return (
    <>
      {isLoggedIn && (
        <DashboardHeader role={role || 'user'} />
      )}
      {!isLoggedIn && <Navbar />}
      <main style={{ padding: isLoggedIn ? '2rem 1rem' : '4rem 0', background: '#f8fafc', minHeight: '100vh' }}>
        <div className="container">
          <Link
            href={isLoggedIn ? dashboardHome : '/'}
            style={{ color: 'var(--accent-teal)', textDecoration: 'none', fontWeight: 700 }}
          >
            {isLoggedIn ? '← Kembali ke Dashboard' : '← Kembali ke Beranda'}
          </Link>

          <div style={{ marginTop: '2rem' }}>
            <PublicSchedule
              schedules={publicSchedules}
              title="Jadwal Lengkap 30 Malam"
            />
          </div>
        </div>
      </main>
      {!isLoggedIn && <Footer />}
    </>
  )
}
