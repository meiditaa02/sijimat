'use client'

import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { deleteImam } from '../app/dashboard/actions'

const badgeColor = {
  semua_malam: { bg: '#d1fae5', color: '#065f46', label: 'Semua Malam' },
  ganjil_saja: { bg: '#dbeafe', color: '#1e40af', label: 'Malam Ganjil' },
  genap_saja: { bg: '#fef9c3', color: '#854d0e', label: 'Malam Genap' },
  fleksibel: { bg: '#f3e8ff', color: '#6b21a8', label: 'Fleksibel' },
}

export default function DashboardClient({ imams, query }) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const { replace, refresh } = useRouter()
  const [isPending, startTransition] = useTransition()
  const [notice, setNotice] = useState(null)
  const [displayedImams, setDisplayedImams] = useState(imams)
  const [pendingDelete, setPendingDelete] = useState(null)

  useEffect(() => {
    setDisplayedImams(imams)
  }, [imams])

  function handleSearch(e) {
    const term = e.target.value
    const params = new URLSearchParams(searchParams)

    if (term) {
      params.set('q', term)
    } else {
      params.delete('q')
    }

    replace(`${pathname}?${params.toString()}`)
  }

  async function handleDelete(imam) {
    setNotice(null)
    startTransition(async () => {
      const result = await deleteImam(imam.id)

      if (result?.status === 'success') {
        setDisplayedImams((currentImams) => currentImams.filter((i) => i.id !== imam.id))
      }

      setNotice({
        type: result?.status === 'success' ? 'success' : 'error',
        message: result?.message || 'Data imam diproses.',
      })
      setPendingDelete(null)
      refresh()
    })
  }

  return (
    <div>
      {notice && (
        <div style={{
          marginBottom: '1rem',
          padding: '0.8rem 1rem',
          borderRadius: '8px',
          border: `1px solid ${notice.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
          background: notice.type === 'success' ? '#ecfdf5' : '#fef2f2',
          color: notice.type === 'success' ? '#065f46' : '#991b1b',
          fontSize: '0.86rem',
          fontWeight: '700',
        }}>
          {notice.message}
        </div>
      )}

      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <span style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '1rem',
        }}>
          Cari
        </span>
        <input
          type="text"
          placeholder="Cari nama imam..."
          defaultValue={query}
          onChange={handleSearch}
          style={{
            width: '100%',
            padding: '0.7rem 1rem 0.7rem 3.4rem',
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
            fontSize: '0.95rem',
            boxSizing: 'border-box',
            outline: 'none',
            background: 'white',
          }}
        />
        {isPending && (
          <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: '#9ca3af' }}>
            memproses...
          </span>
        )}
      </div>

      {displayedImams.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#9ca3af',
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #f3f4f6',
        }}>
          {query ? `Tidak ada imam dengan nama "${query}"` : 'Belum ada imam terdaftar.'}
        </div>
      ) : (
        displayedImams.map((imam) => {
          const badge = badgeColor[imam.ketersediaan] || { bg: '#f3f4f6', color: '#374151', label: imam.ketersediaan }

          return (
            <div key={imam.id} className="imam-card" style={{
              background: 'white',
              borderRadius: '12px',
              padding: '1.25rem',
              marginBottom: '0.75rem',
              border: '1px solid #f3f4f6',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
            }}>
              <div>
                <div style={{ fontWeight: '700', color: '#111827', marginBottom: '4px' }}>
                  {imam.nama}
                </div>
                <div style={{ fontSize: '0.82rem', color: '#6b7280' }}>
                  {imam.no_whatsapp} - {imam.nama_masjid}
                </div>
                <span style={{
                  display: 'inline-block',
                  marginTop: '6px',
                  padding: '2px 10px',
                  borderRadius: '999px',
                  fontSize: '0.75rem',
                  background: badge.bg,
                  color: badge.color,
                }}>
                  {badge.label}
                </span>
              </div>
              <div>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setPendingDelete(imam)}
                  style={{
                    border: '1px solid #fecaca',
                    background: '#fef2f2',
                    color: '#b91c1c',
                    borderRadius: '8px',
                    padding: '0.45rem 0.75rem',
                    fontWeight: '700',
                    cursor: isPending ? 'not-allowed' : 'pointer',
                  }}
                >
                  Hapus
                </button>
              </div>
            </div>
          )
        })
      )}

      <ConfirmDeleteModal
        imam={pendingDelete}
        isDeleting={isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}

function ConfirmDeleteModal({ imam, isDeleting, onCancel, onConfirm }) {
  if (!imam) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(17, 24, 39, 0.45)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div role="dialog" aria-modal="true" aria-labelledby="delete-imam-title" style={{
        width: '100%',
        maxWidth: '420px',
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.22)',
        padding: '1.25rem',
      }}>
        <h3 id="delete-imam-title" style={{ color: '#111827', fontSize: '1.1rem', fontWeight: '900', marginBottom: '0.5rem' }}>
          Hapus Data Imam?
        </h3>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.6 }}>
          Data imam atas nama <strong>{imam.nama}</strong> akan dihapus permanen dari sistem SiJimat. Tindakan ini tidak dapat dibatalkan.
        </p>
        <div style={{
          background: '#f9fafb',
          border: '1px solid #f3f4f6',
          borderRadius: '8px',
          padding: '0.75rem',
          marginBottom: '1rem',
          color: '#374151',
          fontSize: '0.86rem',
          fontWeight: '700',
        }}>
          {imam.nama} - {imam.nama_masjid} ({imam.no_whatsapp})
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            style={{
              border: '1px solid #d1d5db',
              background: 'white',
              color: '#374151',
              borderRadius: '8px',
              padding: '0.6rem 0.9rem',
              fontWeight: '800',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
            }}
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => onConfirm(imam)}
            disabled={isDeleting}
            style={{
              border: '1px solid #dc2626',
              background: isDeleting ? '#fca5a5' : '#dc2626',
              color: 'white',
              borderRadius: '8px',
              padding: '0.6rem 0.9rem',
              fontWeight: '900',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
            }}
          >
            {isDeleting ? 'Menghapus...' : 'Hapus'}
          </button>
        </div>
      </div>
    </div>
  )
}