import RegisterForm from '../../components/RegisterForm'

export const metadata = {
  title: 'Daftar Akun | SiJimat',
  description: 'Buat akun SiJimat untuk Pendaftaran Imam.',
}

export default function RegisterPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(to bottom, #ecfdf5, #ffffff)', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
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
            🕌 Pendaftaran Imam
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
            Daftar Akun Calon Imam
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.9rem', maxWidth: '420px', margin: '0 auto' }}>
            Buat akun untuk mendaftarkan diri Anda sebagai imam tarawih. Jemaah umum tidak perlu membuat akun untuk melihat jadwal penuh selama 30 hari.
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
          border: '1px solid #f0fdf4',
        }}>
          <RegisterForm />
        </div>
      </div>
    </main>
  )
}
