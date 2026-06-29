'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [activeHash, setActiveHash] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    setActiveHash(window.location.hash)

    const handleHashChange = () => setActiveHash(window.location.hash)
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Tutup menu mobile otomatis saat pindah halaman
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  function isActive(href) {
    if (href === '/') return pathname === '/' && activeHash === ''
    if (href === '/jadwal') return pathname === '/jadwal'
    if (href.startsWith('/#')) return pathname === '/' && activeHash === href.slice(1)
    return false
  }

  const linkStyle = (href) => ({
    textDecoration: 'none',
    color: isActive(href) ? '#059669' : '#374151',
    fontWeight: isActive(href) ? '700' : '600',
    fontSize: '0.9rem',
    paddingBottom: '2px',
    borderBottom: isActive(href) ? '2px solid #059669' : '2px solid transparent',
    transition: 'color 0.2s',
    whiteSpace: 'nowrap',
  })

  const mobileLinkStyle = (href) => ({
    textDecoration: 'none',
    color: isActive(href) ? '#059669' : '#374151',
    fontWeight: isActive(href) ? '700' : '600',
    fontSize: '1rem',
    padding: '0.75rem 0',
    borderBottom: '1px solid #f3f4f6',
    display: 'block',
  })

  const navLinks = [
    { href: '/', label: 'Home', onClick: () => setActiveHash('') },
    { href: '/jadwal', label: 'Jadwal' },
    { href: '/#features', label: 'Fitur', onClick: () => setActiveHash('#features') },
    { href: '/#cara-kerja', label: 'Cara Kerja', onClick: () => setActiveHash('#cara-kerja') },
    { href: '/#testimonial', label: 'Ulasan', onClick: () => setActiveHash('#testimonial') },
  ]

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
        {/* LOGO — selalu tampil */}
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

        {/* NAV LINKS — disembunyikan di mobile lewat CSS class .public-nav */}
        <nav className="public-nav" aria-label="Navigasi utama" style={{ display: 'flex', alignItems: 'center', gap: '1.35rem' }}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={link.onClick} style={linkStyle(link.href)}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* MASUK/DAFTAR — disembunyikan di mobile lewat CSS class .public-actions */}
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

        {/* HAMBURGER BUTTON — hanya tampil di mobile lewat CSS class .public-hamburger */}
        <button
          type="button"
          className="public-hamburger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Buka menu navigasi"
          aria-expanded={menuOpen}
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.4rem',
            flexShrink: 0,
          }}
        >
          <HamburgerIcon open={menuOpen} />
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {menuOpen && (
        <div className="public-mobile-menu" style={{
          borderTop: '1px solid #f3f4f6',
          background: 'white',
          padding: '0.5rem 1.5rem 1.25rem',
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={link.onClick}
              style={mobileLinkStyle(link.href)}
            >
              {link.label}
            </Link>
          ))}

          <div style={{ display: 'flex', gap: '0.6rem', marginTop: '1rem' }}>
            <Link href="/login" style={{
              flex: 1,
              textAlign: 'center',
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              border: '1.5px solid #059669',
              color: '#059669',
              fontWeight: '700',
              fontSize: '0.92rem',
              textDecoration: 'none',
            }}>
              Masuk
            </Link>
            <Link href="/register" style={{
              flex: 1,
              textAlign: 'center',
              padding: '0.6rem 1rem',
              borderRadius: '8px',
              background: '#059669',
              color: 'white',
              fontWeight: '700',
              fontSize: '0.92rem',
              textDecoration: 'none',
            }}>
              Daftar
            </Link>
          </div>
        </div>
      )}

      {/* Responsive breakpoint: sembunyikan nav links & actions, tampilkan hamburger di bawah 768px */}
      <style jsx>{`
        @media (max-width: 768px) {
          .public-nav {
            display: none !important;
          }
          .public-actions {
            display: none !important;
          }
          .public-hamburger {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  )
}

function HamburgerIcon({ open }) {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round">
      {open ? (
        <>
          <line x1="5" y1="5" x2="19" y2="19" />
          <line x1="19" y1="5" x2="5" y2="19" />
        </>
      ) : (
        <>
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </>
      )}
    </svg>
  )
}