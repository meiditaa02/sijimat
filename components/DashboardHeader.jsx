'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navByRole = {
  admin: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/jadwal', label: 'Jadwal Tarawih' },
    { href: '/profile', label: 'Profil' },
  ],
  imam: [
    { href: '/dashboard-imam', label: 'Dashboard' },
    { href: '/daftar-imam', label: 'Data Imam' },
    { href: '/jadwal', label: 'Jadwal Tarawih' },
    { href: '/profile', label: 'Profil' },
  ],
}

const homeByRole = {
  admin: '/dashboard',
  imam: '/dashboard-imam',
}

export default function DashboardHeader({ role = 'imam', title = 'SiJimat' }) {
  const links = navByRole[role] || navByRole.imam
  const pathname = usePathname()
  const homeHref = homeByRole[role] || '/dashboard-imam'

  return (
    <header className="dashboard-header" style={{
      position: 'sticky',
      top: 0,
      zIndex: 20,
      background: 'white',
      borderBottom: '1px solid #f3f4f6',
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <style>{`
        @media (max-width: 640px) {
          .btn-keluar-desktop { display: none !important; }
        }
      `}</style>

      <div className="dashboard-header-inner" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 1.5rem',
        minHeight: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        <Link href={homeHref} style={{
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
            <div style={{ fontWeight: '800', fontSize: '1rem', color: '#111827', lineHeight: 1 }}>
              {title}
            </div>
            <div style={{
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

        <div className="dashboard-nav" role="navigation" aria-label="Navigasi dashboard" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.3rem',
          flexWrap: 'wrap',
          background: '#f3f4f6',
          borderRadius: '999px',
          padding: '0.3rem',
        }}>
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: isActive ? 'white' : '#374151',
                  background: isActive ? '#059669' : 'transparent',
                  textDecoration: 'none',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  padding: '0.5rem 0.9rem',
                  borderRadius: '999px',
                  transition: 'background 0.15s ease, color 0.15s ease',
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        <a
          href="/api/logout"
          className="btn-keluar-desktop"
          style={{
            padding: '0.5rem 0.9rem',
            borderRadius: '8px',
            border: '1px solid #fecaca',
            color: '#dc2626',
            textDecoration: 'none',
            fontSize: '0.84rem',
            fontWeight: '700',
            background: '#fef2f2',
            flexShrink: 0,
          }}
        >
          Keluar
        </a>
      </div>
    </header>
  )
}
