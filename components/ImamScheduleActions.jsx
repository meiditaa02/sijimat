'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { confirmMyJadwal } from '../app/dashboard/actions'

export default function ImamScheduleActions({ scheduleId }) {
  const router = useRouter()
  const [notice, setNotice] = useState(null)
  const [isPending, startTransition] = useTransition()

  function submitStatus(status) {
    setNotice(null)
    startTransition(async () => {
      const result = await confirmMyJadwal(scheduleId, status)
      setNotice({
        type: result?.status === 'success' ? 'success' : 'error',
        message: result?.message || 'Konfirmasi diproses.',
      })
      router.refresh()
    })
  }

  const btnBase = {
    fontFamily: 'inherit',
    fontWeight: '800',
    borderRadius: '8px',
    padding: '0.45rem 0.75rem',
    cursor: isPending ? 'not-allowed' : 'pointer',
  }

  return (
    <div style={{ display: 'grid', gap: '0.55rem' }}>
      <p style={{ color: '#6b7280', fontSize: '0.78rem', fontWeight: '600' }}>
        Konfirmasi ke admin apakah Anda bisa hadir atau berhalangan.
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          disabled={isPending}
          onClick={() => submitStatus('dikonfirmasi')}
          style={{ ...btnBase, border: 'none', background: '#059669', color: 'white' }}
        >
          Bisa Hadir
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => submitStatus('berhalangan')}
          style={{ ...btnBase, border: '1px solid #fecaca', background: '#fef2f2', color: '#b91c1c' }}
        >
          Berhalangan
        </button>
      </div>
      {notice && (
        <p style={{
          color: notice.type === 'success' ? '#047857' : '#b91c1c',
          fontSize: '0.78rem',
          fontWeight: '700',
        }}>
          {notice.message}
        </p>
      )}
    </div>
  )
}