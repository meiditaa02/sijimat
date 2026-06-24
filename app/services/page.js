import RevealAnimation from '@/components/RevealAnimation'

export const metadata = {
  title: 'Fitur – SiJimat',
}

export default function ServicesPage() {
  return (
    <main style={{ padding: 'clamp(4rem,10vw,7rem) 0' }}>
      <RevealAnimation />
      <div className="container">

        <div className="section-head reveal">
          <div className="section-badge">Fitur Lengkap</div>
          <h1 className="section-title">Semua Fitur SiJimat</h1>
          <p className="section-desc">
            Dirancang khusus untuk memenuhi kebutuhan nyata pengurus masjid dan imam tarawih di seluruh Indonesia.
          </p>
        </div>

        <div className="features-grid stagger" style={{ marginTop: '2.5rem' }}>
          {[
            { icon: '📅', judul: 'Monitoring Real-time',    isi: 'Lihat status setiap imam (Hadir/Menunggu/Batal) secara langsung dengan indikator warna yang intuitif.' },
            { icon: '🔔', judul: 'Notifikasi Cerdas',       isi: 'Pengingat otomatis dikirim dari H-1 hingga 15 menit sebelum waktu shalat tanpa perlu menghubungi manual.' },
            { icon: '👥', judul: 'Manajemen Imam',          isi: 'Jika imam utama berhalangan, sistem otomatis notifikasi ke imam cadangan hanya dengan satu klik.' },
          ].map((f, i) => (
            <article key={f.judul} className="feature-card reveal" style={{ '--i': i }}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="feature-title">{f.judul}</h3>
              <p className="feature-desc">{f.isi}</p>
            </article>
          ))}
        </div>

      </div>
    </main>
  )
}