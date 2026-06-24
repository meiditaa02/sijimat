import { createClient } from '@supabase/supabase-js'
import { unstable_noStore as noStore } from 'next/cache'
import DashboardHeader from '../../components/DashboardHeader'
import AdminDashboard from '../../components/AdminDashboard'
import PesanManager from '../../components/PesanManager'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function DashboardPage({ searchParams }) {
  noStore()

  const query = searchParams?.q || ''

  let supabaseQuery = supabase
    .from('imam')
    .select('*')
    .order('created_at', { ascending: false })

  if (query) {
    supabaseQuery = supabaseQuery.ilike('nama', `%${query}%`)
  }

  let [{ data: imams }, { data: users }, scheduleResult, { data: pesanList }] = await Promise.all([
    supabaseQuery,
    supabase
      .from('users')
      .select('id, nama, email, role')
      .order('nama', { ascending: true }),
    supabase
      .from('jadwal')
      .select('id, malam, tanggal, waktu, rakaat, nama_masjid, catatan, status, imam_id, imam:imam_id(id, nama, no_whatsapp, nama_masjid)')
      .order('malam', { ascending: true }),
    supabase
      .from('pesan')
      .select('*, balasan_pesan(id, balasan, created_at)')
      .order('created_at', { ascending: false }),
  ])

  if (scheduleResult.error) {
    scheduleResult = await supabase
      .from('jadwal')
      .select('id, malam, tanggal, waktu, rakaat, nama_masjid, catatan, status, imam_id')
      .order('malam', { ascending: true })
  }

  const totalUsers = users?.length || 0
  const totalImams = imams?.length || 0
  const totalSchedules = scheduleResult.data?.length || 0
  const totalPesanBelumDibaca = (pesanList || []).filter((p) => !p.sudah_dibaca).length

  return (
    <>
      <DashboardHeader role="admin" />
      <main style={{ minHeight: '100vh', background: '#f6f8f7', padding: '2.5rem 1.25rem' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gap: '1.25rem' }}>

          <section style={{
            background: 'linear-gradient(135deg, #047857 0%, #059669 55%, #10b981 100%)',
            borderRadius: '20px',
            padding: '2rem',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: '-60px', right: '-60px',
              width: '220px', height: '220px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.08)',
            }} />
            <span style={{
              display: 'inline-block', background: 'rgba(255,255,255,0.2)',
              borderRadius: '999px', padding: '0.2rem 0.7rem',
              fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.03em',
              marginBottom: '0.6rem',
            }}>
              Admin Panel
            </span>
            <h1 style={{ fontSize: '1.65rem', fontWeight: '800', margin: '0 0 0.4rem', position: 'relative' }}>
              Dashboard SiJimat
            </h1>
            <p style={{ margin: '0 0 1.5rem', fontSize: '0.92rem', color: 'rgba(255,255,255,0.85)', maxWidth: '480px' }}>
              Kelola role pengguna, data imam, dan jadwal tarawih dari satu tempat.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.85rem' }}>
              <StatCard label="Pengguna" value={totalUsers} />
              <StatCard label="Imam" value={totalImams} />
              <StatCard label="Jadwal" value={totalSchedules} />
              <StatCard label="Pesan Baru" value={totalPesanBelumDibaca} />
            </div>
          </section>

          <section style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem' }}>
            <AdminDashboard
              users={users || []}
              imams={imams || []}
              schedules={scheduleResult.data || []}
              scheduleError={scheduleResult.error?.message || ''}
              query={query}
            />
          </section>

          <PesanManager pesanList={pesanList || []} />

        </div>
      </main>
    </>
  )
}

function StatCard({ label, value }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.14)',
      border: '1px solid rgba(255,255,255,0.25)',
      borderRadius: '14px',
      padding: '1rem 1.1rem',
    }}>
      <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.85)', fontWeight: '700', marginBottom: '0.15rem' }}>
        {label}
      </div>
      <div style={{ fontSize: '1.7rem', fontWeight: '800' }}>{value}</div>
    </div>
  )
}