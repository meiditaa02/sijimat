'use client'

import Link from 'next/link'
import { useFormState, useFormStatus } from 'react-dom'
import { registerUser } from '../app/register/actions'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        width: '100%',
        padding: '0.75rem 1.5rem',
        borderRadius: '12px',
        fontWeight: '600',
        color: 'white',
        border: 'none',
        cursor: pending ? 'not-allowed' : 'pointer',
        background: pending ? '#6ee7b7' : '#059669',
        fontSize: '1rem',
        transition: 'background 0.2s',
      }}
    >
      {pending ? '⏳ Memproses...' : 'Buat Akun'}
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
        required
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '0.6rem 1rem',
          borderRadius: '10px',
          border: error ? '1px solid #f87171' : '1px solid #d1fae5',
          fontSize: '0.95rem',
          boxSizing: 'border-box',
          outline: 'none',
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

export default function RegisterForm() {
  const initialState = { status: 'idle', message: '', fieldErrors: {} }
  const [state, formAction] = useFormState(registerUser, initialState)
  const errors = state.fieldErrors || {}

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto' }}>
      {state.message && (
        <div style={{
          padding: '1rem',
          borderRadius: '10px',
          marginBottom: '1rem',
          fontSize: '0.9rem',
          background: state.status === 'success' ? '#ecfdf5' : '#fef2f2',
          border: state.status === 'success' ? '1px solid #6ee7b7' : '1px solid #fca5a5',
          color: state.status === 'success' ? '#065f46' : '#991b1b',
        }}>
          {state.status === 'success' ? '✅' : '❌'} {state.message}
        </div>
      )}

      {state.status !== 'success' && (
        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <InputField
            label="Nama Lengkap"
            name="nama"
            placeholder="Nama Anda"
            error={errors.nama}
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder="nama@email.com"
            error={errors.email}
          />
          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="Minimal 8 karakter"
            error={errors.password}
          />
          <SubmitButton />
        </form>
      )}

      <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#6b7280', marginTop: '1rem' }}>
        Sudah punya akun? <Link href="/login" style={{ color: '#059669', fontWeight: 600, textDecoration: 'none' }}>Masuk</Link>
      </p>
    </div>
  )
}
