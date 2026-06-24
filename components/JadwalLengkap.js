import imams from '../data/imams'
import SignupForm from '../components/SignupForm'
import RevealAnimation from '../components/RevealAnimation'
import JadwalLengkap from '../components/JadwalLengkap'

export default function HomePage() {
  return (
    <main>
      <RevealAnimation />

      <section id="hero" aria-labelledby="hero-heading">
        <div className="hero-bg" aria-hidden="true">
          <div className="blob" style={{ width:'500px', height:'500px', top:'-180px', right:'-100px', background:'#a7d7c5', opacity:0.3 }}></div>
          <div className="blob" style={{ width:'380px', height:'380px', bottom:'-120px', left:'-80px', background:'#f5d6a4', opacity:0.28 }}></div>
          <div className="blob" style={{ width:'260px', height:'260px', top:'35%', left:'22%', background:'#c8e6da', opacity:0.22 }}></div>
        </div>

        <div className="container">
          <div className="hero-inner">
            <div className="hero-content">
              <div className="hero-eyebrow reveal">🌙 Ramadan Ready · Ramadan 1447 H</div>
              <h1 id="hero-heading" className="hero-title reveal">
                Kelola Jadwal<br />
                <span className="highlight italic">Imam Tarawih</span><br />
                Lebih Mudah &amp; Teratur
              </h1>
              <p className="hero-desc reveal">
                SiJimat membantu pengurus masjid menyusun dan memantau jadwal imam tarawih secara digital tanpa ribet, tanpa bentrok, tanpa kertas.
              </p>
              <div className="hero-actions reveal">
                <a href="#daftar" className="btn btn-primary">🚀 Daftar Sekarang</a>
                <a href="#cara-kerja" className="btn btn-secondary">Lihat Cara Kerja</a>
              </div>
            </div>

            <div className="hero-visual reveal">
              <div className="hero-mockup">
                <div className="mockup-header">
                  <span className="mockup-title">📋 Jadwal Tarawih</span>
                </div>
                <ul className="jadwal-list" aria-label="Daftar jadwal imam">
                  {imams.map((imam, index) => (
                    <li key={imam.id} className={`jadwal-item${index === 0 ? ' active' : ''}`}>
                      <div className="jadwal-item-left">
                        <div className="jadwal-avatar" style={imam.warna ? { background: imam.warna } : {}}>
                          {imam.inisial}
                        </div>
                        <div>
                          <div className="jadwal-name">{imam.nama}</div>
                          <div className="jadwal-date">Malam ke-{imam.malamKe} · 19.30 WIB</div>
                        </div>
                      </div>
                      <span className="jadwal-rakaat">{imam.rakaat} Rakaat</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="jadwal" style={{ padding: 'clamp(3rem, 8vw, 5rem) 0', background: 'var(--bg-deep)' }}>
        <div className="container">
          <div className="section-head reveal">
            <div className="section-badge">🌙 Ramadan 1447 H</div>
            <h2 className="section-title">Jadwal Imam Tarawih</h2>
            <p className="section-desc">
              Preview 4 malam pertama ditampilkan di atas. Klik tombol di bawah untuk melihat jadwal lengkap 30 malam Ramadan.
            </p>
          </div>
          <JadwalLengkap />
        </div>
      </section>

      <section id="features" aria-labelledby="features-heading">
        <div aria-hidden="true">
          <div className="blob" style={{ position:'absolute', width:'400px', height:'400px', top:'-100px', right:'-80px', background:'#a7d7c5', opacity:0.2 }}></div>
        </div>
        <div className="container">
          <div className="section-head reveal">
            <div className="section-badge">Fitur Unggulan</div>
            <h2 id="features-heading" className="section-title">
              Semua yang Dibutuhkan<br />Pengurus Masjid
            </h2>
            <p className="section-desc">
              Dari penyusunan jadwal hingga notifikasi, semua tersedia dalam satu platform yang mudah digunakan.
            </p>
          </div>
          <div className="features-grid stagger">
            <article className="feature-card reveal" style={{ '--i': 0 }}>
              <div className="feature-icon">📅</div>
              <h3 className="feature-title">Monitoring Real-time</h3>
              <p className="feature-desc">Pengurus bisa lihat status Imam (Hadir/Menunggu/Batal) lewat indikator warna yang intuitif.</p>
            </article>
            <article className="feature-card reveal" style={{ '--i': 1 }}>
              <div className="feature-icon">🔔</div>
              <h3 className="feature-title">Notifikasi Cerdas</h3>
              <p className="feature-desc">Imam mendapat pengingat otomatis dari H-1 hingga 15 menit sebelum waktu shalat tiba.</p>
            </article>
            <article className="feature-card reveal" style={{ '--i': 2 }}>
              <div className="feature-icon">👥</div>
              <h3 className="feature-title">Manajemen Imam</h3>
              <p className="feature-desc">Imam utama berhalangan? Cukup satu klik, sistem langsung notifikasi ke Imam Cadangan.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="cara-kerja" aria-labelledby="cara-kerja-heading">
        <div className="container">
          <div className="section-head reveal">
            <div className="section-badge">Cara Kerja</div>
            <h2 id="cara-kerja-heading" className="section-title">Mulai dalam 4 Langkah Mudah</h2>
            <p className="section-desc">Tidak perlu pelatihan khusus. Para Imam bisa langsung pakai dalam hitungan menit.</p>
          </div>
          <div className="steps-grid stagger">
            <article className="step-card reveal" style={{ '--i': 0 }}>
              <div className="step-num">1</div>
              <h3 className="step-title">Daftar Akun</h3>
              <p className="step-desc">Daftar dengan nomor WhatsApp aktif untuk menerima notifikasi dan pengingat jadwal otomatis.</p>
            </article>
            <article className="step-card reveal" style={{ '--i': 1 }}>
              <div className="step-num">2</div>
              <h3 className="step-title">Input Data Imam</h3>
              <p className="step-desc">Isi data diri dan tentukan ketersediaan waktu bertugas untuk memudahkan penyusunan jadwal.</p>
            </article>
            <article className="step-card reveal" style={{ '--i': 2 }}>
              <div className="step-num">3</div>
              <h3 className="step-title">Konfirmasi Jadwal</h3>
              <p className="step-desc">Terima jadwal penugasan dari pengurus dan lakukan konfirmasi kesediaan melalui aplikasi.</p>
            </article>
            <article className="step-card reveal" style={{ '--i': 3 }}>
              <div className="step-num">4</div>
              <h3 className="step-title">Terima Notifikasi</h3>
              <p className="step-desc">Terima notifikasi rutin dan laporkan kendala kehadiran agar pengurus dapat mengalihkan ke cadangan.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="testimonial" aria-labelledby="testimonial-heading">
        <div aria-hidden="true">
          <div className="blob" style={{ position:'absolute', width:'350px', height:'350px', bottom:'-80px', left:'-60px', background:'#f5d6a4', opacity:0.22 }}></div>
        </div>
        <div className="container">
          <div className="section-head reveal">
            <div className="section-badge">Ulasan Pengguna</div>
            <h2 id="testimonial-heading" className="section-title">
              Kata Mereka yang<br />Sudah Pakai SiJimat
            </h2>
          </div>
          <div className="testimonials-grid stagger">
            <article className="testi-card reveal" style={{ '--i': 0 }}>
              <div className="testi-stars">★★★★★</div>
              <div className="testi-quote">
                <p>"Alhamdulillah, jadwal jadi rapi. Saya diingatkan untuk bersiap 1 jam sebelum tugas. Sangat membantu kekhusyukan."</p>
              </div>
              <div className="testi-author">
                <div className="testi-avatar">AB</div>
                <div><div className="testi-name">Ust. Abad Badrussalam</div></div>
              </div>
            </article>
            <article className="testi-card reveal" style={{ '--i': 1 }}>
              <div className="testi-stars">★★★★★</div>
              <div className="testi-quote">
                <p>Fitur notifikasinya luar biasa. Imam tidak perlu diingatkan manual lagi. Ramadan tahun ini jauh lebih tenang untuk panitia.</p>
              </div>
              <div className="testi-author">
                <div className="testi-avatar" style={{ background: 'linear-gradient(135deg,var(--accent-gold),var(--accent-warm))' }}>I</div>
                <div><div className="testi-name">Ustadz Iwan</div></div>
              </div>
            </article>
            <article className="testi-card reveal" style={{ '--i': 2 }}>
              <div className="testi-stars">★★★★★</div>
              <div className="testi-quote">
                <p>Sangat mudah dipakai bahkan oleh pengurus yang tidak terlalu melek teknologi. Antarmukanya sederhana tapi lengkap fiturnya.</p>
              </div>
              <div className="testi-author">
                <div className="testi-avatar" style={{ background: 'linear-gradient(135deg,#7c3aed,#a78bfa)' }}>AZ</div>
                <div><div className="testi-name">Ahmad Zuhdi</div></div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="daftar" aria-labelledby="daftar-heading">
        <div className="container">
          <div className="cta-box reveal">
            <h2 id="daftar-heading">Siap Sambut Ramadan<br />Tanpa Ribet?</h2>
            <p>Daftar sebagai imam sekarang untuk jadwal yang lebih teratur, notifikasi pengingat otomatis, dan memastikan ibadah di masjid kita selalu lancar tanpa kendala.</p>
            <SignupForm />
          </div>
        </div>
      </section>
    </main>
  )
}