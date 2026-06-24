import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="logo" aria-label="SiJimat">
              <div className="logo-icon">
                <Image src="/logo.png" alt="Logo SiJimat" width={40} height={40} style={{ objectFit: 'contain' }} />
              </div>
              <div>
                <div className="logo-text">SiJimat</div>
                <div className="logo-sub">Sistem Jadwal Imam Tarawih</div>
              </div>
            </Link>
            <p>Solusi digital untuk pengurus masjid dalam mengelola jadwal imam tarawih Ramadan dengan mudah dan efisien.</p>
          </div>

          <nav className="footer-col" aria-label="Tautan produk">
            <h4>Produk</h4>
            <ul>
              <li><Link href="/#features">Fitur</Link></li>
              <li><Link href="/#cara-kerja">Cara Kerja</Link></li>
              <li><Link href="/register">Daftar Gratis</Link></li>
            </ul>
          </nav>

          <nav className="footer-col" aria-label="Tautan komunitas">
            <h4>Komunitas</h4>
            <ul>
              <li><Link href="/contact">Forum Diskusi</Link></li>
              <li><Link href="/contact">Tanya Jawab</Link></li>
            </ul>
          </nav>

          <nav className="footer-col" aria-label="Tautan kontak">
            <h4>Kontak</h4>
            <ul>
              <li><a href="mailto:halo@sijimat.id">halo@sijimat.id</a></li>
              <li><Link href="/contact">Kebijakan Privasi</Link></li>
              <li><Link href="/contact">Syarat &amp; Ketentuan</Link></li>
            </ul>
          </nav>
        </div>

        <div className="footer-bottom">
          <span>Copyright 2025 SiJimat</span>
        </div>
      </div>
    </footer>
  )
}
