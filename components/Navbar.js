'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  const linkStyle = (href) => ({
    textDecoration: 'none',
    color: pathname === href ? '#059669' : '#374151',
    fontWeight: pathname === href ? '700' : '600',
    fontSize: '0.9rem',
    paddingBottom: '2px',
    borderBottom: pathname === href ? '2px solid #059669' : '2px solid transparent',
    transition: 'color 0.2s',
    whiteSpace: 'nowrap',
  })

  return (
    <header className="public-header" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'white',
      borderBottom: '1px solid #f3f4f6',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <div className="public-header-inner" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem',
        minHeight: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
      }}>
        <Link href="/" className="public-brand" style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          minWidth: 0,
        }}>
          <Image
            src="/logo.png"
            alt="SiJimat"
            width={38}
            height={38}
            style={{ width: '38px', height: '38px', objectFit: 'contain', flexShrink: 0 }}
          />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: '800', fontSize: '1rem', color: '#111827', lineHeight: 1 }}>SiJimat</div>
            <div className="public-brand-sub" style={{
              fontSize: '0.64rem',
              color: '#6b7280',
              lineHeight: 1.1,
              marginTop: '3px',
              fontWeight: 700,
              letterSpacing: '0.02em',
            }}>
              SISTEM JADWAL IMAM TARAWIH
            </div>
          </div>
        </Link>

        <nav className="public-nav" aria-label="Navigasi utama" style={{ display: 'flex', alignItems: 'center', gap: '1.35rem' }}>
          <Link href="/" style={linkStyle('/')}>Home</Link>
          <Link href="/jadwal" style={linkStyle('/jadwal')}>Jadwal</Link>
          <Link href="/#features" style={linkStyle('/#features')}>Fitur</Link>
          <Link href="/#cara-kerja" style={linkStyle('/#cara-kerja')}>Cara Kerja</Link>
          <Link href="/#testimonial" style={linkStyle('/#testimonial')}>Ulasan</Link>
        </nav>

        <div className="public-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          <Link href="/login" style={{
            padding: '0.45rem 1rem',
            borderRadius: '8px',
            border: '1.5px solid #059669',
            color: '#059669',
            fontWeight: '700',
            fontSize: '0.86rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}>
            Masuk
          </Link>
          <Link href="/register" style={{
            padding: '0.45rem 1rem',
            borderRadius: '8px',
            background: '#059669',
            color: 'white',
            fontWeight: '700',
            fontSize: '0.86rem',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}>
            Daftar
          </Link>
        </div>
      </div>
    </header>
  )
}
