import Link from 'next/link'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import DashboardHeader from '../../components/DashboardHeader'
import EditImamProfileForm from '../../components/EditImamProfileForm'
import ChangePasswordForm from '../../components/ChangePasswordForm'
import NotificationSettingForm from '../../components/NotificationSettingForm'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const roleLabel = {
  admin: 'Admin',
  imam: 'Imam',
}

const roleDescription = {
  admin: 'Kelola jadwal tarawih, akun imam, dan membalas pesan masuk.',
  imam: 'Kamu bisa melihat jadwal tugasmu dan memperbarui data diri sebagai imam.',
}

const dashboardByRole = {
  admin: '/dashboard',
  imam: '/dashboard-imam',
}

function getSessionUserId() {
  const session = cookies().get('session')?.value || ''
  return session.startsWith('user-') ? session.replace('user-', '') : null
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.replace(/^Ust\.\s*/i, '').trim().split(' ')
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')
}

export default async function ProfilePage() {
  const role = cookies().get('session_role')?.value || 'imam'
  const userId = getSessionUserId()

  const [{ data: user }, { data: imamProfiles }] = await Promise.all([
    userId
      ? supabase.from('users').select('id, nama, email, role').eq('id', userId).maybeSingle()
      : Promise.resolve({ data: null }),
    userId && role === 'imam'
      ? supabase.from('imam').select('id, nama, no_whatsapp, nama_masjid, ketersediaan').eq('user_id', userId)
      : Promise.resolve({ data: [] }),
  ])

  const dashboardHref = dashboardByRole[role] || '/dashboard-imam'
  const displayName = user?.nama || (role === 'admin' ? 'Admin Demo' : 'Pengguna SiJimat')

  return (
    <>
      <DashboardHeader role={role} />
      <main style={{ minHeight: '100vh', background: '#f6f8f7', padding: '2.5rem 1.25rem' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto', display: 'grid', gap: '1.25rem' }}>

          <section style={{
            background: 'linear-gradient(135deg, #047857 0%, #059669 55%, #10b981 100%)',
            borderRadius: '20px', padding: '2rem', color: 'white', position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center', flexWrap: 'wrap', position: 'relative' }}>
              <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'rgba(255,255,255,0.18)', border: '2px solid rgba(255,255,255,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '800', flexShrink: 0 }}>
                {getInitials(displayName)}
              </div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                <span style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', borderRadius: '999px', padding: '0.2rem 0.7rem', fontSize: '0.72rem', fontWeight: '800', letterSpacing: '0.03em', marginBottom: '0.5rem' }}>
                  {roleLabel[role] || 'Imam'}
                </span>
                <h1 style={{ fontSize: '1.55rem', fontWeight: '800', margin: 0, lineHeight: 1.2 }}>{displayName}</h1>
                <p style={{ margin: '0.4rem 0 0', fontSize: '0.9rem', color: 'rgba(255,255,255,0.85)', maxWidth: '460px' }}>
                  {roleDescription[role] || roleDescription.imam}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1.5rem' }}>
              <Link href={dashboardHref} style={{ padding: '0.65rem 1.1rem', borderRadius: '10px', background: 'white', color: '#047857', textDecoration: 'none', fontWeight: '800', fontSize: '0.88rem' }}>
                ← Kembali ke Dashboard
              </Link>
              <a href="/api/logout" style={{ padding: '0.65rem 1.1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.5)', color: 'white', textDecoration: 'none', fontWeight: '800', fontSize: '0.88rem' }}>
                Keluar
              </a>
            </div>
          </section>

          <section style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem' }}>
            <h2 style={{ color: '#111827', fontSize: '1rem', fontWeight: '800', marginBottom: '0.25rem' }}>Detail Akun</h2>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '1.1rem' }}>Informasi dasar yang terhubung dengan akunmu.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
              <InfoCard label="Nama" value={displayName} />
              <InfoCard label="Email" value={user?.email || (role === 'admin' ? 'Login demo admin' : '-')} />
              <InfoCard label="Role" value={roleLabel[role] || 'Imam'} />
            </div>
          </section>

          {role === 'imam' && (
            <section style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ marginBottom: '1.1rem' }}>
                <h2 style={{ color: '#111827', fontSize: '1rem', fontWeight: '800', marginBottom: '0.25rem' }}>Data Imam Terhubung</h2>
                <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>Hubungkan akunmu dengan data imam agar jadwal tarawihmu muncul otomatis.</p>
              </div>
              {!imamProfiles?.length ? (
                <div style={{ background: '#f0fdf4', border: '1px dashed #86efac', borderRadius: '14px', padding: '1.5rem', textAlign: 'center' }}>
                  <p style={{ color: '#374151', fontWeight: '700', margin: '0 0 0.3rem' }}>Belum ada data imam yang terhubung</p>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: '0 0 1rem' }}>Isi data imam lalu jadwal tugasmu akan tampil otomatis di dashboard.</p>
                  <Link href="/daftar-imam" style={{ display: 'inline-block', padding: '0.65rem 1.25rem', borderRadius: '10px', background: '#059669', color: 'white', textDecoration: 'none', fontWeight: '800', fontSize: '0.88rem' }}>
                    + Isi Data Imam
                  </Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '0.75rem' }}>
                  {imamProfiles.map((imam) => <EditImamProfileForm key={imam.id} imam={imam} />)}
                </div>
              )}
            </section>
          )}

          <section style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem' }}>
            <h2 style={{ color: '#111827', fontSize: '1rem', fontWeight: '800', marginBottom: '0.25rem' }}>Pengaturan Akun</h2>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '1.1rem' }}>Kelola keamanan dan preferensi akunmu.</p>
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              <ChangePasswordForm />
              {role === 'imam' && (
                <NotificationSettingForm
                  label="Notifikasi Pengingat Jadwal"
                  description="Atur preferensi waktu pengingat jadwal tugas imam lewat email."
                />
              )}
            </div>
          </section>

        </div>
      </main>
    </>
  )
}

function InfoCard({ label, value }) {
  return (
    <div style={{ background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '12px', padding: '0.9rem' }}>
      <div style={{ color: '#6b7280', fontSize: '0.76rem', fontWeight: '800', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>{label}</div>
      <div style={{ color: '#111827', fontWeight: '700', overflowWrap: 'anywhere' }}>{value}</div>
    </div>
  )
}