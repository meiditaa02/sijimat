'use client'

import { useState } from 'react'

export default function SignupForm() {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState('idle') 

  function handleSubmit(e) {
    e.preventDefault()
    setStatus('success')
    setEmail('')
    setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <form className="signup-form" onSubmit={handleSubmit} aria-label="Form pendaftaran SiJimat">
      <label htmlFor="email-signup">Alamat email</label>
      <input
        type="email"
        id="email-signup"
        name="email"
        placeholder="nama@gmail.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
      />
      <button
        type="submit"
        className="btn-submit"
        style={status === 'success' ? { background: '#4ade80', color: '#14532d' } : {}}
      >
        {status === 'success' ? '✅ Terdaftar!' : 'Daftar Sekarang →'}
      </button>
    </form>
  )
}