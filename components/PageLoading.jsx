export default function PageLoading({ title = 'Memuat halaman', withSearch = false }) {
  const pulse = {
    background: '#e5e7eb',
    borderRadius: '8px',
    animation: 'pulse 1.5s infinite',
  }

  return (
    <main style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '980px', margin: '0 auto' }}>
        <div style={{
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          padding: '1.5rem',
          marginBottom: '1.5rem',
        }}>
          <p style={{ color: '#059669', fontWeight: 700, margin: '0 0 0.75rem' }}>SiJimat</p>
          <div style={{ ...pulse, width: 'min(260px, 75%)', height: '30px', marginBottom: '0.75rem' }} />
          <div style={{ ...pulse, width: 'min(520px, 100%)', height: '16px', background: '#f3f4f6' }} />
          <span className="sr-only">{title}</span>
        </div>

        {withSearch && (
          <div style={{ ...pulse, width: '100%', height: '46px', marginBottom: '1rem', background: '#f3f4f6' }} />
        )}

        {[1, 2, 3].map((item) => (
          <div
            key={item}
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '14px',
              padding: '1rem',
              marginBottom: '0.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ ...pulse, width: 'min(180px, 70%)', height: '18px', marginBottom: '0.65rem' }} />
              <div style={{ ...pulse, width: 'min(320px, 95%)', height: '14px', background: '#f3f4f6' }} />
            </div>
            <div style={{ ...pulse, width: '72px', height: '34px', background: '#d1fae5' }} />
          </div>
        ))}

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.45; }
          }
          .sr-only {
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
          }
        `}</style>
      </div>
    </main>
  )
}
