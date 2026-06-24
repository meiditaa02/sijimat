import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function getSessionUserId() {
  const session = cookies().get('session')?.value || ''
  return session.startsWith('user-') ? session.replace('user-', '') : null
}

export default async function BalasanImam() {
  const userId = getSessionUserId()
  if (!userId) return null

  const { data: pesanSaya } = await supabase
    .from('pesan')
    .select('id, pesan, created_at, balasan_pesan(id, balasan, created_at)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  const pesanDenganBalasan = (pesanSaya || []).filter((p) => p.balasan_pesan?.length > 0)

  if (pesanDenganBalasan.length === 0) return null

  return (
    <section style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '1.25rem' }}>
      <h2 style={{ color: '#111827', fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.25rem' }}>
        Balasan Admin
      </h2>
      <p style={{ color: '#6b7280', fontSize: '0.82rem', marginBottom: '1rem' }}>
        Respons dari admin atas pesan yang Anda kirimkan.
      </p>

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        {pesanDenganBalasan.map((p) => (
          <div key={p.id} style={{ background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '12px', overflow: 'hidden' }}>
            {/* Pesan asli */}
            <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
              <div style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: '700', marginBottom: '0.3rem', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                Pesan Anda · {new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
              <p style={{ color: '#374151', fontSize: '0.87rem', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>{p.pesan}</p>
            </div>

            {/* Balasan admin */}
            <div style={{ padding: '0.85rem 1rem', display: 'grid', gap: '0.5rem' }}>
              {p.balasan_pesan.map((b) => (
                <div key={b.id}>
                  <div style={{ fontSize: '0.72rem', color: '#1d4ed8', fontWeight: '800', marginBottom: '0.3rem' }}>
                    Balasan Admin · {new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                  <p style={{ color: '#111827', fontSize: '0.87rem', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>{b.balasan}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}