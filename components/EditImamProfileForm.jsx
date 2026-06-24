'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { updateImamProfile } from '../app/daftar-imam/actions'

function SaveButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        border: 'none',
        borderRadius: '8px',
        padding: '0.6rem 1rem',
        background: pending ? '#9ca3af' : '#059669',
        color: 'white',
        fontWeight: '800',
        cursor: pending ? 'not-allowed' : 'pointer',
      }}
    >
      {pending ? 'Menyimpan...' : 'Simpan Perubahan'}
    </button>
  )
}

export default function EditImamProfileForm({ imam }) {
  const [state, formAction] = useFormState(updateImamProfile, { status: 'idle', message: '', fieldErrors: {} })
  const errors = state.fieldErrors || {}

  return (
    <form action={formAction} style={{ background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '10px', padding: '1rem', display: 'grid', gap: '0.85rem' }}>
      <input type="hidden" name="id" value={imam.id} />

      {(state.status === 'success' || state.status === 'error') && (
        <div style={{
          background: state.status === 'success' ? '#ecfdf5' : '#fef2f2',
          border: `1px solid ${state.status === 'success' ? '#a7f3d0' : '#fecaca'}`,
          color: state.status === 'success' ? '#065f46' : '#991b1b',
          borderRadius: '8px',
          padding: '0.7rem 0.85rem',
          fontSize: '0.84rem',
          fontWeight: '700',
        }}>
          {state.message}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
        <Field label="Nama" error={errors.nama}>
          <input name="nama" defaultValue={imam.nama || ''} required style={inputStyle(errors.nama)} />
        </Field>
        <Field label="WhatsApp" error={errors.no_whatsapp}>
          <input name="no_whatsapp" defaultValue={imam.no_whatsapp || ''} required style={inputStyle(errors.no_whatsapp)} />
        </Field>
        <Field label="Masjid" error={errors.nama_masjid}>
          <input name="nama_masjid" defaultValue={imam.nama_masjid || ''} required style={inputStyle(errors.nama_masjid)} />
        </Field>
        <Field label="Ketersediaan" error={errors.ketersediaan}>
          <select name="ketersediaan" defaultValue={imam.ketersediaan || 'fleksibel'} style={inputStyle(errors.ketersediaan)}>
            <option value="semua_malam">Semua Malam Ramadan</option>
            <option value="ganjil_saja">Malam Ganjil Saja</option>
            <option value="genap_saja">Malam Genap Saja</option>
            <option value="fleksibel">Fleksibel</option>
          </select>
        </Field>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <SaveButton />
      </div>
    </form>
  )
}

function Field({ label, error, children }) {
  return (
    <label style={{ display: 'grid', gap: '0.35rem', color: '#374151', fontSize: '0.84rem', fontWeight: '800' }}>
      {label}
      {children}
      {error && <span style={{ color: '#dc2626', fontSize: '0.76rem' }}>{error}</span>}
    </label>
  )
}

function inputStyle(error) {
  return {
    width: '100%',
    border: error ? '1px solid #f87171' : '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '0.6rem 0.75rem',
    fontSize: '0.9rem',
    background: 'white',
    color: '#111827',
  }
}
