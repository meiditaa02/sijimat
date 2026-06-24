'use client'

import { useFormStatus, useFormState } from 'react-dom'
import Link from 'next/link'
import { daftarImam } from '../app/daftar-imam/actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        width: '100%', padding: '0.75rem 1.5rem', borderRadius: '12px',
        fontWeight: '600', color: 'white', border: 'none',
        cursor: pending ? 'not-allowed' : 'pointer',
        background: pending ? '#6ee7b7' : '#059669',
        fontSize: '1rem', transition: 'background 0.2s',
      }}
    >
      {pending ? '⏳ Menyimpan...' : 'Kirim'}
    </button>
  )
}

function InputField({ label, name, type = 'text', placeholder, error }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
        {label} <span style={{ color: 'red' }}>*</span>
      </label>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        required
        style={{
          width: '100%', padding: '0.6rem 1rem', borderRadius: '10px',
          border: error ? '1px solid #f87171' : '1px solid #d1fae5',
          fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none',
          background: error ? '#fff5f5' : 'white',
        }}
      />
      {error && (
        <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '4px' }}>
          ⚠️ {error}
        </p>
      )}
    </div>
  )
}

export default function DaftarForm() {
  const initialState = { status: 'idle', message: '', fieldErrors: {} }
  const [state, formAction] = useFormState(daftarImam, initialState)
  const errors = state.fieldErrors || {}

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto' }}>
      {state.status === 'success' && (
        <div style={{
          padding: '1rem', borderRadius: '10px', background: '#ecfdf5',
          border: '1px solid #6ee7b7', color: '#065f46', marginBottom: '1rem', fontSize: '0.9rem',
        }}>
          ✅ {state.message}
        </div>
      )}

      {state.status === 'error' && state.message && (
        <div style={{
          padding: '1rem', borderRadius: '10px', background: '#fef2f2',
          border: '1px solid #fca5a5', color: '#991b1b', marginBottom: '1rem', fontSize: '0.9rem',
        }}>
          ❌ {state.message}
        </div>
      )}

      {state.status !== 'success' && (
        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <InputField label="Nama Lengkap" name="nama" placeholder="Ust. Abdullah Fauzi" error={errors.nama} />
          <InputField label="Nomor WhatsApp Aktif" name="no_whatsapp" type="tel" placeholder="08123456789" error={errors.no_whatsapp} />
          <InputField label="Nama Masjid" name="nama_masjid" placeholder="Masjid Al-Ikhlas" error={errors.nama_masjid} />

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Ketersediaan Waktu <span style={{ color: 'red' }}>*</span>
            </label>
            <select
              name="ketersediaan"
              defaultValue=""
              style={{
                width: '100%', padding: '0.6rem 1rem', borderRadius: '10px',
                border: errors.ketersediaan ? '1px solid #f87171' : '1px solid #d1fae5',
                fontSize: '0.95rem', boxSizing: 'border-box', background: 'white',
              }}
            >
              <option value="" disabled>Pilih ketersediaan...</option>
              <option value="semua_malam">Semua Malam Ramadan</option>
              <option value="ganjil_saja">Malam Ganjil Saja</option>
              <option value="genap_saja">Malam Genap Saja</option>
              <option value="fleksibel">Fleksibel (Sesuai Jadwal)</option>
            </select>
            {errors.ketersediaan && (
              <p style={{ color: '#dc2626', fontSize: '0.8rem', marginTop: '4px' }}>
                ⚠️ {errors.ketersediaan}
              </p>
            )}
          </div>

          <SubmitButton />
        </form>
      )}

      {state.status === 'success' && (
        <Link
          href="/profile"
          style={{
            display: 'block', textAlign: 'center',
            width: '100%', padding: '0.6rem', borderRadius: '10px',
            border: '1px solid #059669', color: '#059669',
            background: 'transparent', cursor: 'pointer', marginTop: '0.5rem',
            textDecoration: 'none', fontWeight: '700',
          }}
        >
          Edit di Profil
        </Link>
      )}
    </div>
  )
}