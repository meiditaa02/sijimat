'use client'

import { useState } from 'react'

function IconEye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}

function IconEyeOff() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )
}

function IconLock() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  )
}

export default function ChangePasswordForm() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [showPass, setShowPass] = useState({ current: false, new: false, confirm: false })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setStatus(null)
  }

  function toggleShow(field) {
    setShowPass((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  function reset() {
    setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setShowPass({ current: false, new: false, confirm: false })
    setStatus(null)
    setOpen(false)
  }

  async function handleSubmit() {
    setStatus(null)
    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      setStatus({ type: 'error', message: 'Semua field wajib diisi.' })
      return
    }
    if (form.newPassword.length < 6) {
      setStatus({ type: 'error', message: 'Password baru minimal 6 karakter.' })
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      setStatus({ type: 'error', message: 'Konfirmasi password tidak cocok.' })
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
      })
      const data = await res.json()
      if (!res.ok) {
        setStatus({ type: 'error', message: data.error || 'Gagal mengubah password.' })
      } else {
        setStatus({ type: 'success', message: data.message || 'Password berhasil diperbarui.' })
        setForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        setShowPass({ current: false, new: false, confirm: false })
      }
    } catch {
      setStatus({ type: 'error', message: 'Terjadi kesalahan. Coba lagi.' })
    } finally {
      setLoading(false)
    }
  }

  function getStrength(pw) {
    if (!pw) return null
    let score = 0
    if (pw.length >= 8) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    if (score <= 1) return { label: 'Lemah', color: '#ef4444', width: '25%' }
    if (score === 2) return { label: 'Cukup', color: '#f59e0b', width: '50%' }
    if (score === 3) return { label: 'Kuat', color: '#10b981', width: '75%' }
    return { label: 'Sangat Kuat', color: '#047857', width: '100%' }
  }

  const strength = getStrength(form.newPassword)

  const btnBase = {
    fontFamily: 'inherit',
    fontWeight: '700',
    fontSize: '0.88rem',
    cursor: 'pointer',
    borderRadius: '10px',
    transition: 'all 0.15s',
  }

  return (
    <div style={{ background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '12px', overflow: 'hidden' }}>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', padding: '0.9rem 1rem', flexWrap: 'wrap', cursor: 'pointer' }}
        onClick={() => { setOpen((v) => !v); setStatus(null) }}
      >
        <div>
          <div style={{ color: '#111827', fontWeight: '700', fontSize: '0.92rem' }}>Ganti Password</div>
          <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.15rem' }}>
            Perbarui password secara berkala untuk keamanan akun.
          </div>
        </div>
        <button
          type="button"
          style={{
            ...btnBase,
            padding: '0.5rem 1rem',
            border: '1.5px solid #059669',
            background: open ? '#059669' : 'white',
            color: open ? 'white' : '#059669',
            flexShrink: 0,
          }}
        >
          {open ? '✕ Tutup' : 'Ubah'}
        </button>
      </div>

      {open && (
        <div style={{ padding: '1rem 1rem 1.25rem', borderTop: '1px solid #f3f4f6', background: 'white', display: 'grid', gap: '0.85rem' }}>
          {status && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              background: status.type === 'success' ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${status.type === 'success' ? '#86efac' : '#fca5a5'}`,
              color: status.type === 'success' ? '#166534' : '#991b1b',
              fontSize: '0.85rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              {status.type === 'success' ? '✓' : '✕'} {status.message}
            </div>
          )}

          <PasswordField label="Password Lama" name="currentPassword" value={form.currentPassword} show={showPass.current} onChange={handleChange} onToggle={() => toggleShow('current')} placeholder="Masukkan password saat ini" />
          <PasswordField label="Password Baru" name="newPassword" value={form.newPassword} show={showPass.new} onChange={handleChange} onToggle={() => toggleShow('new')} placeholder="Minimal 6 karakter" />

          {form.newPassword && strength && (
            <div style={{ marginTop: '-0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                <span style={{ fontSize: '0.73rem', color: '#6b7280' }}>Kekuatan password</span>
                <span style={{ fontSize: '0.73rem', fontWeight: '700', color: strength.color }}>{strength.label}</span>
              </div>
              <div style={{ height: '4px', background: '#f3f4f6', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: strength.width, background: strength.color, borderRadius: '999px', transition: 'width 0.3s' }} />
              </div>
            </div>
          )}

          <PasswordField label="Konfirmasi Password Baru" name="confirmPassword" value={form.confirmPassword} show={showPass.confirm} onChange={handleChange} onToggle={() => toggleShow('confirm')} placeholder="Ulangi password baru" matchValue={form.newPassword} />

          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              style={{
                ...btnBase,
                padding: '0.65rem 1.4rem',
                background: loading ? '#6ee7b7' : '#059669',
                color: 'white',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {loading ? (
                <>
                  <span style={{ width: '14px', height: '14px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />
                  Menyimpan...
                </>
              ) : (
                <>
                  <IconLock />
                  Simpan Password
                </>
              )}
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={loading}
              style={{
                ...btnBase,
                padding: '0.65rem 1rem',
                background: 'transparent',
                color: '#6b7280',
                border: '1px solid #e5e7eb',
              }}
            >
              Batal
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function PasswordField({ label, name, value, show, onChange, onToggle, placeholder, matchValue }) {
  const isConfirm = matchValue !== undefined
  const matched = isConfirm && value.length > 0 && value === matchValue
  const mismatch = isConfirm && value.length > 0 && value !== matchValue

  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: '700', color: '#374151', marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={show ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={name === 'currentPassword' ? 'current-password' : 'new-password'}
          style={{
            width: '100%',
            padding: '0.65rem 2.6rem 0.65rem 0.85rem',
            borderRadius: '10px',
            border: `1.5px solid ${mismatch ? '#fca5a5' : matched ? '#86efac' : '#e5e7eb'}`,
            fontSize: '0.9rem',
            fontFamily: 'inherit',
            outline: 'none',
            background: '#fafafa',
            boxSizing: 'border-box',
            color: '#111827',
            transition: 'border-color 0.15s',
          }}
          onFocus={(e) => { if (!mismatch && !matched) e.target.style.borderColor = '#059669' }}
          onBlur={(e) => { if (!mismatch && !matched) e.target.style.borderColor = '#e5e7eb' }}
        />
        <button
          type="button"
          onClick={onToggle}
          tabIndex={-1}
          aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
          style={{ position: 'absolute', right: '0.65rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0, display: 'flex', alignItems: 'center' }}
        >
          {show ? <IconEyeOff /> : <IconEye />}
        </button>
      </div>
      {mismatch && <p style={{ margin: '0.3rem 0 0', fontSize: '0.75rem', color: '#ef4444', fontWeight: '600' }}>✕ Password tidak cocok</p>}
      {matched && <p style={{ margin: '0.3rem 0 0', fontSize: '0.75rem', color: '#059669', fontWeight: '600' }}>✓ Password cocok</p>}
    </div>
  )
}