'use client'
// components/Navbar.js

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const linkStyle = (href) => ({
    textDecoration: 'none',
    color: pathname === href ? '#059669' : '#374151',
    fontWeight: pathname === href ? '600' : '500',
    fontSize: '0.95rem',
    paddingBottom: '2px',
    borderBottom: pathname === href ? '2px solid #059669' : '2px solid transparent',
    transition: 'color 0.2s',
  })

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'white', borderBottom: '1px solid #f3f4f6',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <div style={{
        maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem',
        height: '64px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', gap: '1rem',
      }}>

        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: '#059669', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0,
          }}>🌙</div>
          <div>
            <div style={{ fontWeight: '700', fontSize: '1rem', color: '#111', lineHeight: 1 }}>SiJimat</div>
            <div style={{ fontSize: '0.65rem', color: '#6b7280', lineHeight: 1, marginTop: '2px' }}>SISTEM JADWAL IMAM TARAWIH</div>
          </div>
        </Link>

        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link href="/" style={linkStyle('/')}>Home</Link>
          <Link href="/jadwal" style={linkStyle('/jadwal')}>Jadwal</Link>
          <Link href="/#features" style={{ textDecoration: 'none', color: '#374151', fontWeight: '500', fontSize: '0.95rem' }}>Fitur</Link>
          <Link href="/#cara-kerja" style={{ textDecoration: 'none', color: '#374151', fontWeight: '500', fontSize: '0.95rem' }}>Cara Kerja</Link>
          <Link href="/#testimonial" style={{ textDecoration: 'none', color: '#374151', fontWeight: '500', fontSize: '0.95rem' }}>Ulasan</Link>
        </nav>

        {/* Tombol */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <Link href="/login" style={{
            padding: '0.45rem 1.1rem', borderRadius: '8px',
            border: '1.5px solid #059669', color: '#059669',
            fontWeight: '600', fontSize: '0.875rem', textDecoration: 'none',
          }}>Masuk</Link>
          <Link href="/register" style={{
            padding: '0.45rem 1.1rem', borderRadius: '8px',
            background: '#059669', color: 'white',
            fontWeight: '600', fontSize: '0.875rem', textDecoration: 'none',
          }}>Daftar</Link>
        </div>

      </div>
    </header>
  )
}
