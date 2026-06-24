import { createClient } from '@supabase/supabase-js'
import { unstable_noStore as noStore } from 'next/cache'
import Link from 'next/link'
import RevealAnimation from '../components/RevealAnimation'

export const dynamic = 'force-dynamic'

const avatarGradients = [
  'linear-gradient(135deg, var(--accent-teal), var(--accent-light))',
  'linear-gradient(135deg,#c8873a,#e8a24a)',
  'linear-gradient(135deg,#7c3aed,#a78bfa)',
  'linear-gradient(135deg,#dc2626,#f87171)',
]

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const fallbackPreviewSchedules = Array.from({ length: 4 }, (_, index) => ({
  id: `preview-empty-${index + 1}`,
  malam: index + 1,
  waktu: '19.30 WIB',
  rakaat: 11,
  imam: null,
}))

function getInitials(name = '') {
  const words = name
    .replace(/^Ust\.?\s*/i, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (words.length === 0) return 'IM'
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase()

  return `${words[0][0]}${words[1][0]}`.toUpperCase()
}

async function getPreviewSchedules() {
  const { data, error } = await supabase
    .from('jadwal')
    .select('id, malam, waktu, rakaat, nama_masjid, imam:imam_id(id, nama)')
    .order('malam', { ascending: true })
    .limit(4)

  if (error) return fallbackPreviewSchedules

  const scheduleByNight = new Map(
    (data || []).map((schedule) => [Number(schedule.malam), schedule])
  )

  return fallbackPreviewSchedules.map((fallback) => ({
    ...fallback,
    ...(scheduleByNight.get(fallback.malam) || {}),
  }))
}

export default async function HomePage() {
  noStore()

  const previewSchedules = await getPreviewSchedules()

  return (
    <main>
      <RevealAnimation />

     {/* --- HERO SECTION --- */}
      <section id="hero" aria-labelledby="hero-heading" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Decorative blobs */}
        <div className="hero-bg" aria-hidden="true">
          <div className="blob" style={{ width: '500px', height: '500px', top: '-180px', right: '-100px', background: '#a7d7c5', opacity: 0.3 }}></div>
          <div className="blob" style={{ width: '380px', height: '380px', bottom: '-120px', left: '-80px', background: '#f5d6a4', opacity: 0.28 }}></div>
          <div className="blob" style={{ width: '260px', height: '260px', top: '35%', left: '22%', background: '#c8e6da', opacity: 0.22 }}></div>
        </div>

        <div className="container">
          <div className="hero-inner">

            {/* Bagian Kiri: Teks */}
            <div className="hero-content">
              <div className="hero-eyebrow reveal">Ramadan Ready - Ramadan 1447 H</div>

              <h1 id="hero-heading" className="hero-title reveal">
                Kelola Jadwal<br />
                <span className="highlight italic">Imam Tarawih</span><br />
                Lebih Mudah & Teratur
              </h1>

              <p className="hero-desc reveal">
                SiJimat membantu pengurus masjid menyusun dan memantau jadwal imam tarawih secara digital tanpa ribet, tanpa bentrok, tanpa kertas.
              </p>

              <div className="hero-actions reveal">
                <Link href="/register" className="btn btn-primary">Daftar Sekarang</Link>
                <a href="#cara-kerja" className="btn btn-secondary">Lihat Cara Kerja</a>
              </div>

            </div>

            {/* Bagian Kanan: Mockup Card */}
            <div className="hero-visual reveal">
              <div className="hero-mockup">
                <div className="mockup-header">
                  <span className="mockup-title">Jadwal Tarawih</span>
                </div>
                <ul className="jadwal-list" aria-label="Preview jadwal imam terbaru">
                  {previewSchedules.map((schedule, index) => {
                    const imamName = schedule.imam?.nama || 'Belum ditentukan'
                    const hasRealImam = Boolean(schedule.imam?.nama)

                    return (
                      <li key={schedule.id} className={`jadwal-item ${index === 0 ? 'active' : ''}`}>
                        <div className="jadwal-item-left">
                          <div
                            className="jadwal-avatar"
                            style={{ background: hasRealImam ? avatarGradients[index % avatarGradients.length] : '#9ca3af' }}
                          >
                            {hasRealImam ? getInitials(imamName) : 'BD'}
                          </div>
                          <div>
                            <div className="jadwal-name">{imamName}</div>
                            <div className="jadwal-date">Malam ke-{schedule.malam} - {schedule.waktu}</div>
                          </div>
                        </div>
                        <span className="jadwal-rakaat">{schedule.rakaat} Rakaat</span>
                      </li>
                    )
                  })}
                </ul>

                {/* Tombol ke Halaman Jadwal Lengkap */}
                <div style={{ padding: '0 1.5rem 1.5rem', marginTop: '2rem'}}>
                  <Link href="/jadwal" className="btn btn-primary" style={{ display: 'block', textAlign: 'center', width: '100%', textDecoration: 'none', fontSize: '0.9rem' }}>
                    Lihat Jadwal Selengkapnya
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" aria-labelledby="features-heading" style={{ position: 'relative' }}>
        {/* Decorative blob */}
        <div aria-hidden="true">
          <div className="blob" style={{ position: 'absolute', width: '400px', height: '400px', top: '-100px', right: '-80px', background: '#a7d7c5', opacity: 0.2 }}></div>
        </div>

        <div className="container">
          <div className="section-head reveal">
            <div className="section-badge">Fitur Unggulan</div>
            <h2 id="features-heading" className="section-title">Semua yang Dibutuhkan<br />Pengurus Masjid</h2>
            <p className="section-desc">Dari penyusunan jadwal hingga notifikasi, semua tersedia dalam satu platform yang mudah digunakan.</p>
          </div>

          <div className="features-grid stagger">
            <article className="feature-card reveal" style={{ '--i': 0 }}>
              <div className="feature-icon">📅</div>
              <h3 className="feature-title">Monitoring Real-time</h3>
              <p className="feature-desc">Pengurus bisa melihat status kesiapan imam secara langsung lewat indikator warna yang intuitif untuk memastikan kelancaran ibadah.</p>
            </article>

            <article className="feature-card reveal" style={{ '--i': 1 }}>
              <div className="feature-icon">🔔</div>
              <h3 className="feature-title">Notifikasi Cerdas</h3>
              <p className="feature-desc">Sistem akan mengirimkan notifikasi otomatis ke email imam, mulai dari seminggu sebelum bertugas hingga 1 jam menjelang waktu ibadah tiba.</p>
            </article>

            <article className="feature-card reveal" style={{ '--i': 2 }}>
              <div className="feature-icon">👥</div>
              <h3 className="feature-title">Manajemen Imam</h3>
              <p className="feature-desc">Imam berhalangan hadir? Cukup laporkan dalam satu klik, lalu Pengurus Masjid dapat segera melakukan penjadwalan ulang secara efisien.</p>
            </article>
          </div>
        </div>
      </section>

      {/* --- CARA KERJA --- */}
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
              <p className="step-desc">Terima notifikasi rutin dan laporkan kendala kehadiran segera agar pengurus dapat mengalihkan ke cadangan.</p>
            </article>
          </div>
        </div>
      </section>

      {/* --- TESTIMONIAL --- */}
      <section id="testimonial" aria-labelledby="testimonial-heading" style={{ position: 'relative' }}>
        {/* Decorative blob */}
        <div aria-hidden="true">
          <div className="blob" style={{ position: 'absolute', width: '350px', height: '350px', bottom: '-80px', left: '-60px', background: '#f5d6a4', opacity: 0.22 }}></div>
        </div>

        <div className="container">
          <div className="section-head reveal">
            <div className="section-badge">Ulasan Pengguna</div>
            <h2 id="testimonial-heading" className="section-title">
              Kata Mereka yang<br />Sudah Pakai SiJimat
            </h2>
          </div>

          <div className="testimonials-grid stagger">
            {/* Kartu 1 */}
            <article className="testi-card reveal" style={{ '--i': 0 }}>
              <div className="testi-quote">
                <p>"Alhamdulillah, jadwal jadi rapi. Saya diingatkan untuk bersiap 1 jam sebelum tugas. Sangat membantu kekhusyukan."</p>
              </div>
              <div className="testi-author">
                <div className="testi-avatar">AB</div>
                <div>
                  <div className="testi-name">Ust. Abad Badrussalam</div>
                </div>
              </div>
            </article>

            {/* Kartu 2 */}
            <article className="testi-card reveal" style={{ '--i': 1 }}>
              <div className="testi-quote">
                <p>Fitur notifikasinya luar biasa. Imam tidak perlu diingatkan manual lagi. Ramadan tahun ini bisa jauh lebih tenang untuk panitia.</p>
              </div>
              <div className="testi-author">
                <div className="testi-avatar" style={{ background: 'linear-gradient(135deg, var(--accent-gold), var(--accent-warm))' }}>I</div>
                <div>
                  <div className="testi-name">Ustadz Iwan</div>
                </div>
              </div>
            </article>

            {/* Kartu 3 */}
            <article className="testi-card reveal" style={{ '--i': 2 }}>
              <div className="testi-quote">
                <p>Sangat mudah dipakai bahkan oleh pengurus yang tidak terlalu melek teknologi. Antarmukanya sederhana tapi lengkap fiturnya.</p>
              </div>
              <div className="testi-author">
                <div className="testi-avatar" style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}>AZ</div>
                <div>
                  <div className="testi-name">Ahmad Zuhdi</div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

    </main>
  )
}
