import ContactForm from '@/components/ContactForm'
import RevealAnimation from '@/components/RevealAnimation'

export const metadata = {
  title: 'Kontak – SiJimat',
}

export default function ContactPage() {
  return (
    <main style={{ padding: 'clamp(2rem,5vw,3.5rem) 0' }}>
      <RevealAnimation />
      <div className="container">

        <div className="section-head reveal">
          <div className="section-badge">Kontak</div>
          <h1 className="section-title">Ada Pertanyaan?<br />Kami Siap Membantu</h1>
        </div>

        <div style={{ maxWidth: '560px', margin: '1.5rem auto 0' }}>
          <ContactForm />
        </div>

      </div>
    </main>
  )
}