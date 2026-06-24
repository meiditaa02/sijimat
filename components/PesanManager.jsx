'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function PesanManager({ pesanList }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [expanded, setExpanded] = useState(null)
  const [balasanText, setBalasanText] = useState({})
  const [sending, setSending] = useState(null)
  const [notice, setNotice] = useState({})
  const [deleting, setDeleting] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [showAll, setShowAll] = useState(false)

  const belumDibaca = pesanList.filter((p) => !p.sudah_dibaca).length
  const tampilPesan = showAll ? pesanList : pesanList.slice(0, 3)

  function toggleExpand(id) {
    setExpanded((prev) => (prev === id ? null : id))
  }

  function tandaiDibaca(id) {
    startTransition(async () => {
      await fetch('/api/pesan', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      router.refresh()
    })
  }

  async function hapusPesan(id) {
    setDeleting(id)
    try {
      await fetch('/api/pesan', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      router.refresh()
    } finally {
      setDeleting(null)
      setConfirmDelete(null)
    }
  }

  async function kirimBalasan(pesanId) {
    const teks = balasanText[pesanId]?.trim()
    if (!teks) return

    setSending(pesanId)
    try {
      const res = await fetch('/api/balasan-pesan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pesan_id: pesanId, balasan: teks }),
      })
      const data = await res.json()
      if (!res.ok) {
        setNotice((prev) => ({ ...prev, [pesanId]: { type: 'error', message: data.error } }))
      } else {
        setBalasanText((prev) => ({ ...prev, [pesanId]: '' }))
        setNotice((prev) => ({ ...prev, [pesanId]: { type: 'success', message: 'Balasan terkirim.' } }))
        router.refresh()
        setTimeout(() => setNotice((prev) => ({ ...prev, [pesanId]: null })), 3000)
      }
    } finally {
      setSending(null)
    }
  }

  return (
    <section style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#111827', marginBottom: '0.2rem' }}>
            Pesan Masuk
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#6b7280', margin: 0 }}>
            Laporan dan pertanyaan dari imam.
          </p>
        </div>
        {belumDibaca > 0 && (
          <span style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', borderRadius: '999px', padding: '0.2rem 0.75rem', fontSize: '0.78rem', fontWeight: '800' }}>
            {belumDibaca} belum dibaca
          </span>
        )}
      </div>

      {pesanList.length === 0 ? (
        <div style={{ background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.88rem' }}>
          Belum ada pesan masuk.
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '0.65rem' }}>
          {tampilPesan.map((p) => (
            <div key={p.id} style={{ background: p.sudah_dibaca ? '#f9fafb' : '#f0fdf4', border: `1px solid ${p.sudah_dibaca ? '#f3f4f6' : '#86efac'}`, borderRadius: '12px', overflow: 'hidden' }}>

              <div onClick={() => toggleExpand(p.id)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', cursor: 'pointer', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                  {!p.sudah_dibaca && <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#059669', flexShrink: 0, display: 'inline-block' }} />}
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: '700', color: '#111827', fontSize: '0.9rem' }}>{p.nama}</div>
                    <div style={{ color: '#6b7280', fontSize: '0.78rem', overflowWrap: 'anywhere' }}>{p.email}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                  {p.sudah_dibaca && !p.balasan_pesan?.length && (
                    <span style={{ fontSize: '0.72rem', background: '#f0fdf4', color: '#047857', borderRadius: '999px', padding: '0.15rem 0.55rem', fontWeight: '700' }}>
                      Dibaca
                    </span>
                  )}
                  {p.balasan_pesan?.length > 0 && (
                    <span style={{ fontSize: '0.72rem', background: '#eff6ff', color: '#1d4ed8', borderRadius: '999px', padding: '0.15rem 0.55rem', fontWeight: '700' }}>
                      Dibalas
                    </span>
                  )}
                  <span style={{ color: '#9ca3af', fontSize: '0.75rem' }}>
                    {new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setConfirmDelete(p) }}
                    disabled={deleting === p.id}
                    style={{ fontFamily: 'inherit', padding: '0.25rem 0.6rem', borderRadius: '6px', border: '1px solid #fecaca', background: '#fef2f2', color: '#b91c1c', fontWeight: '700', fontSize: '0.72rem', cursor: deleting === p.id ? 'not-allowed' : 'pointer' }}
                  >
                    {deleting === p.id ? '...' : 'Hapus'}
                  </button>
                  <span style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{expanded === p.id ? '▲' : '▼'}</span>
                </div>
              </div>

              {expanded === p.id && (
                <div style={{ padding: '0 1rem 1rem', borderTop: '1px solid #e5e7eb' }}>
                  <p style={{ color: '#374151', fontSize: '0.88rem', lineHeight: 1.6, margin: '0.85rem 0 1rem', whiteSpace: 'pre-wrap' }}>
                    {p.pesan}
                  </p>

                  {p.balasan_pesan?.length > 0 && (
                    <div style={{ margin: '0 0 1rem', display: 'grid', gap: '0.5rem' }}>
                      {p.balasan_pesan.map((b) => (
                        <div key={b.id} style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '0.75rem 1rem' }}>
                          <div style={{ fontSize: '0.72rem', color: '#1d4ed8', fontWeight: '800', marginBottom: '0.3rem' }}>
                            Admin · {new Date(b.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                          <p style={{ color: '#1e3a5f', fontSize: '0.87rem', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>{b.balasan}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <textarea
                      rows={3}
                      placeholder="Tulis balasan..."
                      value={balasanText[p.id] || ''}
                      onChange={(e) => setBalasanText((prev) => ({ ...prev, [p.id]: e.target.value }))}
                      style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '10px', border: '1.5px solid #e5e7eb', fontSize: '0.87rem', fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box', color: '#111827' }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => kirimBalasan(p.id)}
                        disabled={sending === p.id || !balasanText[p.id]?.trim()}
                        style={{ fontFamily: 'inherit', padding: '0.45rem 1rem', borderRadius: '8px', border: 'none', background: '#059669', color: 'white', fontWeight: '700', fontSize: '0.82rem', cursor: sending === p.id || !balasanText[p.id]?.trim() ? 'not-allowed' : 'pointer', opacity: !balasanText[p.id]?.trim() ? 0.6 : 1 }}
                      >
                        {sending === p.id ? 'Mengirim...' : 'Kirim Balasan'}
                      </button>
                      {!p.sudah_dibaca && (
                        <button
                          type="button"
                          onClick={() => tandaiDibaca(p.id)}
                          disabled={isPending}
                          style={{ fontFamily: 'inherit', padding: '0.45rem 0.9rem', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', color: '#6b7280', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}
                        >
                          ✓ Tandai Dibaca
                        </button>
                      )}
                      {notice[p.id] && (
                        <span style={{ fontSize: '0.78rem', fontWeight: '600', color: notice[p.id].type === 'success' ? '#047857' : '#b91c1c' }}>
                          {notice[p.id].message}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          {pesanList.length > 3 && (
            <button
              type="button"
              onClick={() => setShowAll((v) => !v)}
              style={{ fontFamily: 'inherit', width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid #e5e7eb', background: 'white', color: '#374151', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer' }}
            >
              {showAll ? 'Sembunyikan' : `Lihat Semua (${pesanList.length} pesan)`}
            </button>
          )}
        </div>
      )}

      {confirmDelete && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(17,24,39,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ width: '100%', maxWidth: '400px', background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 20px 50px rgba(15,23,42,0.22)', padding: '1.25rem' }}>
            <h3 style={{ color: '#111827', fontSize: '1.05rem', fontWeight: '800', marginBottom: '0.5rem' }}>Hapus Pesan?</h3>
            <p style={{ color: '#6b7280', fontSize: '0.88rem', marginBottom: '0.75rem', lineHeight: 1.6 }}>
              Pesan dari <strong>{confirmDelete.nama}</strong> akan dihapus permanen beserta balasannya.
            </p>
            <div style={{ background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '8px', padding: '0.65rem 0.85rem', marginBottom: '1rem', fontSize: '0.82rem', color: '#374151', fontWeight: '600' }}>
              {confirmDelete.pesan?.slice(0, 100)}{confirmDelete.pesan?.length > 100 ? '...' : ''}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                disabled={deleting === confirmDelete.id}
                style={{ fontFamily: 'inherit', border: '1px solid #d1d5db', background: 'white', color: '#374151', borderRadius: '8px', padding: '0.6rem 0.9rem', fontWeight: '700', cursor: 'pointer' }}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => hapusPesan(confirmDelete.id)}
                disabled={deleting === confirmDelete.id}
                style={{ fontFamily: 'inherit', border: '1px solid #dc2626', background: deleting === confirmDelete.id ? '#fca5a5' : '#dc2626', color: 'white', borderRadius: '8px', padding: '0.6rem 0.9rem', fontWeight: '800', cursor: deleting === confirmDelete.id ? 'not-allowed' : 'pointer' }}
              >
                {deleting === confirmDelete.id ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}