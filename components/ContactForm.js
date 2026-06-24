'use client'

import { useState } from 'react'

export default function ContactForm() {
  const [form, setForm] = useState({ nama: '', email: '', pesan: '' })
  const [status, setStatus] = useState('idle')

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/pesan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 4000)
        return
      }

      setStatus('success')
      setForm({ nama: '', email: '', pesan: '' })
      setTimeout(() => setStatus('idle'), 4000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  return (
    <div className="glass-card">
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '1.4rem', color: 'var(--text)' }}>
        Kirim Pesan
      </h3>

      {status === 'success' && (
        <div style={{ background: 'rgba(29,106,91,0.10)', border: '1px solid rgba(29,106,91,0.3)', borderRadius: '10px', padding: '0.9rem 1rem', marginBottom: '1.2rem', color: 'var(--accent-teal)', fontSize: '0.88rem', fontWeight: 600 }}>
          ✅ Pesan terkirim! Kami akan menghubungi Anda segera.
        </div>
      )}

      {status === 'error' && (
        <div style={{ background: 'rgba(185,28,28,0.08)', border: '1px solid rgba(185,28,28,0.25)', borderRadius: '10px', padding: '0.9rem 1rem', marginBottom: '1.2rem', color: '#b91c1c', fontSize: '0.88rem', fontWeight: 600 }}>
          ❌ Gagal mengirim pesan. Coba lagi.
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label htmlFor="nama" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text)' }}>
            Nama Lengkap
          </label>
          <input
            id="nama" name="nama" type="text"
            placeholder="Nama Anda"
            value={form.nama}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--glass-border)', background: 'var(--bg)', fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text)', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label htmlFor="email" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text)' }}>
            Email
          </label>
          <input
            id="email" name="email" type="email"
            placeholder="email@masjid.id"
            value={form.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--glass-border)', background: 'var(--bg)', fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text)', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label htmlFor="pesan" style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.4rem', color: 'var(--text)' }}>
            Pesan
          </label>
          <textarea
            id="pesan" name="pesan"
            placeholder="Tulis pertanyaan atau kendala Anda..."
            value={form.pesan}
            onChange={handleChange}
            required
            rows={4}
            style={{ width: '100%', padding: '0.7rem 1rem', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--glass-border)', background: 'var(--bg)', fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--text)', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ justifyContent: 'center' }}
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Mengirim...' : 'Kirim Pesan'}
        </button>
      </form>
    </div>
  )
}