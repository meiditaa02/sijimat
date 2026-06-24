'use client'

import { useState } from 'react'

export default function NotificationSettingForm({ label, description }) {
  const [interval, setIntervalState] = useState('1-day')
  const [statusMessage, setStatusMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    setStatusMessage('')
    try {
      const res = await fetch('/api/remind-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interval })
      })

      if (res.ok) {
        setStatusMessage('Preferensi waktu pengingat berhasil disimpan ke database!')
      } else {
        setStatusMessage('Gagal menyimpan preferensi. Coba lagi.')
      }
    } catch (err) {
      setStatusMessage('Terjadi kesalahan jaringan.')
    } finally {
      setLoading(false)
      // Menghilangkan pesan setelah 3 detik
      setTimeout(() => {
        setStatusMessage('')
      }, 3000)
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '0.85rem',
      padding: '1.1rem 1.25rem',
      background: '#f9fafb',
      border: '1px solid #f3f4f6',
      borderRadius: '12px',
    }}>
      <div>
        <div style={{ color: '#111827', fontWeight: '700', fontSize: '#0.92rem' }}>{label}</div>
        <div style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.15rem' }}>{description}</div>
      </div>

      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        alignItems: 'center', 
        gap: '0.75rem', 
        marginTop: '0.25rem',
        borderTop: '1px dashed #e5e7eb',
        paddingTop: '0.85rem'
      }}>
        <label htmlFor="reminder-interval" style={{ fontSize: '0.82rem', color: '#374151', fontWeight: '700' }}>
          Waktu Pengingat:
        </label>
        <select 
          id="reminder-interval"
          value={interval}
          onChange={(e) => setIntervalState(e.target.value)}
          disabled={loading}
          style={{
            padding: '0.45rem 0.65rem',
            borderRadius: '8px',
            border: '1px solid #d1d5db',
            background: 'white',
            color: '#111827',
            fontSize: '0.82rem',
            fontWeight: '600',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          <option value="1-hour">1 jam sebelum menjadi imam</option>
          <option value="6-hours">6 jam sebelum menjadi imam</option>
          <option value="1-day">Sehari sebelum menjadi imam</option>
          <option value="7-days">Seminggu sebelum menjadi imam</option>
        </select>
        
        <button 
          type="button" 
          onClick={handleSave}
          disabled={loading}
          style={{
            padding: '0.45rem 0.85rem',
            borderRadius: '8px',
            background: loading ? '#9ca3af' : '#059669',
            color: 'white',
            border: 'none',
            fontSize: '0.82rem',
            fontWeight: '700',
            cursor: 'pointer',
            marginLeft: 'auto',
          }}
        >
          {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>

      {statusMessage && (
        <div style={{
          marginTop: '0.5rem',
          padding: '0.6rem 0.85rem',
          background: statusMessage.includes('Gagal') || statusMessage.includes('kesalahan') ? '#fef2f2' : '#ecfdf5',
          border: statusMessage.includes('Gagal') || statusMessage.includes('kesalahan') ? '1px solid #fca5a5' : '1px solid #a7f3d0',
          borderRadius: '8px',
          color: statusMessage.includes('Gagal') || statusMessage.includes('kesalahan') ? '#991b1b' : '#065f46',
          fontSize: '0.82rem',
          fontWeight: '600',
          textAlign: 'center'
        }}>
          {statusMessage}
        </div>
      )}
    </div>
  )
}