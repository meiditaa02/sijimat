import RevealAnimation from '@/components/RevealAnimation'

export const metadata = {
  title: 'Tentang – SiJimat',
}

export default function AboutPage() {
  return (
    <main style={{ padding: 'clamp(4rem,10vw,7rem) 0' }}>
      <RevealAnimation />
      <div className="container">

        <div className="section-head reveal">
          <div className="section-badge">Tentang Kami</div>
          <h1 className="section-title">Kami Hadir untuk<br />Memudahkan Kegiatan Ibadah</h1>
          <p className="section-desc">
            SiJimat lahir dari keresahan pengurus masjid yang kerepotan mengatur jadwal imam tarawih setiap tahun. Kami hadir membawa solusi digital yang mudah dan gratis.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.2rem', marginTop: '3rem' }}>
          {[
            { icon: '🤝', judul: 'Amanah',   isi: 'Kami jaga data imam dengan penuh tanggung jawab dan transparansi.' },
            { icon: '💡', judul: 'Inovatif',  isi: 'Solusi teknologi yang relevan dengan kebutuhan nyata pengurus masjid.' },
            { icon: '🆓', judul: 'Gratis',    isi: 'Gratis untuk imam tanpa syarat apapun.' },
            { icon: '❤️', judul: 'Ikhlas',   isi: 'Dibuat dengan niat tulus untuk memudahkan ibadah shalat tarawih.' },
          ].map((item) => (
            <div key={item.judul} className="feature-card reveal">
              <div className="feature-icon">{item.icon}</div>
              <h3 className="feature-title">{item.judul}</h3>
              <p className="feature-desc">{item.isi}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}