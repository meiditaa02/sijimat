// app/login/page.jsx
// Halaman login sederhana dengan cookie session

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const form = new FormData(e.target)
    const identifier = form.get('identifier')
    const password = form.get('password')

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      })
      const payload = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(payload.message || 'Gagal membuat sesi. Coba lagi.')
        return
      }

      const dashboardByRole = {
        admin: '/dashboard',
        imam: '/dashboard-imam',
        user: '/dashboard-user',
      }
      const targetPath = dashboardByRole[payload.role] || '/dashboard-user'
      router.push(targetPath)
      router.refresh()
    } catch {
      setError('Koneksi gagal. Periksa jaringan Anda.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #ecfdf5, #fff)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        border: '1px solid #f0fdf4',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <img
            src="/logo.png"
            alt="SiJimat"
            style={{ width: '48px', height: '48px', objectFit: 'contain', marginBottom: '0.5rem' }}
          />
          <h1 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#111' }}>Masuk Akun</h1>
          <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>SiJimat Dashboard</p>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            color: '#991b1b',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            marginBottom: '1rem',
          }}>
            Gagal: {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
              Email
            </label>
            <input
              name="identifier"
              type="text"
              placeholder="email@domain.com"
              required
              style={{
                width: '100%', padding: '0.6rem 1rem', borderRadius: '10px',
                border: '1px solid #d1fae5', fontSize: '0.95rem', boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '4px' }}>
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="********"
              required
              style={{
                width: '100%', padding: '0.6rem 1rem', borderRadius: '10px',
                border: '1px solid #d1fae5', fontSize: '0.95rem', boxSizing: 'border-box',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '0.75rem', borderRadius: '10px',
              background: loading ? '#6ee7b7' : '#059669', color: 'white',
              border: 'none', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '1rem',
            }}
          >
            {loading ? 'Masuk...' : 'Masuk'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af', marginTop: '1rem' }}>
          Demo admin: <strong>admin</strong> / <strong>sijimat123</strong>
        </p>
      </div>
    </main>
  )
}
