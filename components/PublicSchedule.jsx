'use client'

import { useMemo, useState } from 'react'

const statusStyle = {
  terjadwal: { label: 'Terjadwal', bg: '#eff6ff', color: '#1d4ed8' },
  dikonfirmasi: { label: 'Dikonfirmasi', bg: '#ecfdf5', color: '#047857' },
  berhalangan: { label: 'Berhalangan', bg: '#fef2f2', color: '#b91c1c' },
  diganti: { label: 'Diganti', bg: '#fff7ed', color: '#c2410c' },
}

export default function PublicSchedule({
  schedules,
  fallbackSchedules = [],
  title = 'Jadwal Imam Tarawih',
  description,
}) {
  const [search, setSearch] = useState('')
  const source = schedules.length > 0 ? schedules : fallbackSchedules

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim()
    if (!term) return source

    return source.filter((schedule) => {
      const imamName = schedule.imam?.nama || schedule.imam || ''
      const mosque = schedule.nama_masjid || ''
      return imamName.toLowerCase().includes(term) || mosque.toLowerCase().includes(term)
    })
  }, [search, source])

  return (
    <section style={{ display: 'grid', gap: '1rem' }}>
      <div className="public-schedule-head" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        <div>
          <h1 style={{ fontSize: '1.7rem', fontWeight: '800', color: '#111827', marginBottom: '0.35rem' }}>
            {title}
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.92rem' }}>
            {description || (schedules.length > 0 ? 'Data jadwal ditampilkan oleh admin.' : 'Menampilkan jadwal contoh sampai admin membuat jadwal.')}
          </p>
        </div>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Cari imam..."
          style={{
            width: 'min(100%, 320px)',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '0.7rem 0.85rem',
            fontSize: '0.9rem',
            background: 'white',
          }}
        />
      </div>

      <div className="public-schedule-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' }}>
        {filtered.map((schedule) => {
          const imamName = schedule.imam?.nama || schedule.imam || 'Imam belum ditentukan'
          const status = statusStyle[schedule.status || 'terjadwal'] || statusStyle.terjadwal
          const dateLabel = schedule.tanggal || schedule.tanggal_label || ''
          return (
            <article key={schedule.id || schedule.malam} style={{
              background: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              padding: '1rem',
              display: 'grid',
              gap: '0.55rem',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'center' }}>
                <span style={{ color: '#059669', fontWeight: '900' }}>Malam {schedule.malam}</span>
                <span style={{ color: '#6b7280', fontSize: '0.78rem', fontWeight: '700' }}>{schedule.waktu}</span>
              </div>
              <span style={{
                justifySelf: 'start',
                background: status.bg,
                color: status.color,
                borderRadius: '999px',
                padding: '0.18rem 0.55rem',
                fontSize: '0.72rem',
                fontWeight: '800',
              }}>
                {status.label}
              </span>
              <div style={{ color: '#111827', fontWeight: '800', fontSize: '1rem' }}>{imamName}</div>
              <div style={{ color: '#6b7280', fontSize: '0.84rem' }}>
                {schedule.nama_masjid || schedule.imam?.nama_masjid || 'Masjid belum diisi'}
              </div>
              <div style={{ color: '#374151', fontSize: '0.8rem', fontWeight: '700' }}>
                {schedule.rakaat} rakaat{dateLabel ? ` - ${dateLabel}` : ''}
              </div>
              {schedule.catatan && (
                <p style={{ color: '#6b7280', fontSize: '0.8rem', borderTop: '1px solid #f3f4f6', paddingTop: '0.55rem' }}>
                  {schedule.catatan}
                </p>
              )}
            </article>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
          Tidak ada jadwal yang cocok.
        </div>
      )}
    </section>
  )
}
