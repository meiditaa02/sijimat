import DaftarForm from '../../components/DaftarForm'
import DashboardHeader from '../../components/DashboardHeader'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export const metadata = {
  title: 'Lengkapi Data Imam | SiJimat',
  description: 'Lengkapi data diri Anda sebagai Imam Tarawih di SiJimat.',
}

export default function DaftarImamPage() {
  const role = cookies().get('session_role')?.value || 'imam'
  const session = cookies().get('session')?.value || ''
  const userId = session.startsWith('user-') ? session.replace('user-', '') : null
  const existingImamPromise = userId
    ? supabase.from('imam').select('id, nama').eq('user_id', userId).limit(1).maybeSingle()
    : Promise.resolve({ data: null })

  return (
    <>
      <DashboardHeader role={role} />
      <main style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #ecfdf5, #ffffff)', padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
          <ExistingImamGate existingImamPromise={existingImamPromise} />
        </div>
      </main>
    </>
  )
}

async function ExistingImamGate({ existingImamPromise }) {
  const { data: existingImam } = await existingImamPromise

  // Sudah isi data — tampilkan pesan simpel tanpa header/judul
  if (existingImam) {
    return (
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
        border: '1px solid #f0fdf4',
        textAlign: 'center',
        display: 'grid',
        gap: '0.8rem',
      }}>
        <h3 style={{ color: '#111827', fontSize: '1.15rem', fontWeight: '800' }}>
          Data sudah dilengkapi
        </h3>
        <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
          Akun ini sudah memiliki data imam atas nama <strong>{existingImam.nama}</strong>. Untuk mengubah data, silakan masuk ke halaman profil.
        </p>
        <Link
          href="/profile"
          style={{
            justifySelf: 'center',
            padding: '0.65rem 1rem',
            borderRadius: '8px',
            background: '#059669',
            color: 'white',
            textDecoration: 'none',
            fontWeight: '800',
            fontSize: '0.9rem',
          }}
        >
          Edit di Profil
        </Link>
      </div>
    )
  }

  // Belum isi data — tampilkan header + form
  return (
    <>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-block',
          background: '#d1fae5',
          color: '#065f46',
          fontSize: '0.8rem',
          fontWeight: '600',
          padding: '0.4rem 1rem',
          borderRadius: '999px',
          marginBottom: '1rem',
        }}>
          🕌 Ramadan 1447 H
        </div>
        <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
          Lengkapi Data Imam
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', maxWidth: '380px', margin: '0 auto' }}>
          Isi data diri Anda sebagai imam tarawih. Data ini akan digunakan admin untuk menyusun jadwal dan menghubungi Anda lewat WhatsApp.
        </p>
      </div>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
        border: '1px solid #f0fdf4',
      }}>
        <DaftarForm />
      </div>
      <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af', marginTop: '1.5rem' }}>
        Data hanya digunakan untuk keperluan penjadwalan ibadah.
      </p>
    </>
  )
}