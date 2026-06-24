'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'

const imams = [
  { id: 'abad-badrussalam', inisial: 'AB', nama: 'Ust. Abad Badrussalam', malamKe: 15, rakaat: 11, warna: '' },
  { id: 'zaenal-abidin', inisial: 'ZA', nama: 'Ust. Zaenal Abidin', malamKe: 16, rakaat: 11, warna: 'linear-gradient(135deg,#c8873a,#e8a24a)' },
  { id: 'abdullah-fauzi', inisial: 'AF', nama: 'Ust. Abdullah Fauzi', malamKe: 17, rakaat: 11, warna: 'linear-gradient(135deg,#7c3aed,#a78bfa)' },
  { id: 'iwan', inisial: 'I', nama: 'Ust. Iwan', malamKe: 18, rakaat: 11, warna: 'linear-gradient(135deg,#dc2626,#f87171)' },
]

export default function ImamDetailPage() {
  const params = useParams()
  const imam = imams.find((i) => i.id === params.id)

  if (!imam) {
    return (
      <main style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h1>Imam tidak ditemukan</h1>
        <Link href="/">← Kembali</Link>
      </main>
    )
  }

  return (
    <main style={{ padding: 'clamp(4rem,10vw,7rem) 0' }}>
      <div className="container">
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--accent-teal)', textDecoration: 'none', fontWeight: 600, fontSize: '0.88rem', marginBottom: '2rem' }}>
          ← Kembali
        </Link>

        <div className="glass-card" style={{ maxWidth: '480px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '999px', background: imam.warna || 'linear-gradient(135deg, var(--accent-teal), var(--accent-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>
            {imam.inisial}
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', color: 'var(--text)', marginBottom: '0.3rem' }}>
            {imam.nama}
          </h1>
          <div style={{ color: 'var(--accent-teal)', fontWeight: 600, fontSize: '0.85rem', marginBottom: '1.2rem' }}>
            ✅ Imam Aktif
          </div>

          <div style={{ padding: '1rem', background: 'rgba(29,106,91,0.07)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>
              Jadwal Terdekat
            </div>
            <div style={{ fontWeight: 700, color: 'var(--text)' }}>Malam ke-{imam.malamKe}</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>19.30 WIB · {imam.rakaat} Rakaat</div>
          </div>
        </div>
      </div>
    </main>
  )
}