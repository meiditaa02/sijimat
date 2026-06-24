'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useTransition, useState } from 'react'
import { createJadwal, deleteJadwal, updateJadwal, updateJadwalStatus } from '../app/dashboard/actions'

const statusOptions = [
  { value: 'terjadwal', label: 'Terjadwal', bg: '#eff6ff', color: '#1d4ed8' },
  { value: 'dikonfirmasi', label: 'Dikonfirmasi', bg: '#ecfdf5', color: '#047857' },
  { value: 'berhalangan', label: 'Berhalangan', bg: '#fef2f2', color: '#b91c1c' },
  { value: 'diganti', label: 'Diganti', bg: '#fff7ed', color: '#c2410c' },
]

const defaultMosqueName = 'Masjid Al-Ikhlas'

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        border: 'none',
        borderRadius: '8px',
        padding: '0.7rem 1rem',
        background: pending ? '#9ca3af' : '#059669',
        color: 'white',
        fontWeight: '800',
        cursor: pending ? 'not-allowed' : 'pointer',
      }}
    >
      {pending ? 'Menyimpan...' : 'Tambah Jadwal'}
    </button>
  )
}

function SaveButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      style={{
        border: 'none',
        borderRadius: '8px',
        padding: '0.55rem 0.85rem',
        background: pending ? '#9ca3af' : '#059669',
        color: 'white',
        fontWeight: '800',
        cursor: pending ? 'not-allowed' : 'pointer',
      }}
    >
      {pending ? 'Menyimpan...' : 'Simpan'}
    </button>
  )
}

export default function ScheduleManager({ imams, schedules, scheduleError }) {
  const router = useRouter()
  const [notice, setNotice] = useState(null)
  const [statusFilter, setStatusFilter] = useState('semua')
  const [editingId, setEditingId] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)
  const [isDeleting, startDelete] = useTransition()
  const [isUpdating, startUpdate] = useTransition()
  const initialState = { status: 'idle', message: '', fieldErrors: {} }
  const [state, formAction] = useFormState(createJadwal, initialState)
  const errors = state.fieldErrors || {}
  const actionNeededSchedules = useMemo(
    () => schedules.filter((schedule) => schedule.status === 'berhalangan'),
    [schedules]
  )
  const filteredSchedules = useMemo(() => {
    if (statusFilter === 'semua') return schedules
    return schedules.filter((schedule) => (schedule.status || 'terjadwal') === statusFilter)
  }, [schedules, statusFilter])

  useEffect(() => {
    if (state.status === 'success') {
      router.refresh()
    }
  }, [router, state.status])

  function handleDelete(schedule) {
    setNotice(null)
    startDelete(async () => {
      const result = await deleteJadwal(schedule.id)
      setNotice({
        type: result?.status === 'success' ? 'success' : 'error',
        message: result?.message || 'Jadwal diproses.',
      })
      setPendingDelete(null)
      router.refresh()
    })
  }

  async function handleCopySchedule() {
    const text = formatScheduleForText(filteredSchedules)

    try {
      await navigator.clipboard.writeText(text)
      setNotice({ type: 'success', message: 'Jadwal berhasil disalin. Siap ditempel ke WhatsApp.' })
    } catch {
      setNotice({ type: 'error', message: 'Gagal menyalin jadwal. Browser tidak memberi izin clipboard.' })
    }
  }

  function handleDownloadCsv() {
    const csv = formatScheduleForCsv(filteredSchedules)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'jadwal-sijimat.csv'
    link.click()
    URL.revokeObjectURL(url)
    setNotice({ type: 'success', message: 'File CSV jadwal berhasil dibuat.' })
  }

  function handleStatusChange(scheduleId, status) {
    setNotice(null)
    startUpdate(async () => {
      const result = await updateJadwalStatus(scheduleId, status)
      setNotice({
        type: result?.status === 'success' ? 'success' : 'error',
        message: result?.message || 'Status diproses.',
      })
      router.refresh()
    })
  }

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      {scheduleError && (
        <div style={{
          background: '#fffbeb',
          border: '1px solid #fde68a',
          color: '#92400e',
          borderRadius: '10px',
          padding: '0.85rem 1rem',
          fontSize: '0.88rem',
          fontWeight: '600',
        }}>
          Tabel jadwal belum siap. Buat tabel Supabase bernama <strong>jadwal</strong> agar fitur ini bisa menyimpan data.
        </div>
      )}

      {(state.status === 'success' || state.status === 'error') && (
        <div style={{
          background: state.status === 'success' ? '#ecfdf5' : '#fef2f2',
          border: `1px solid ${state.status === 'success' ? '#a7f3d0' : '#fecaca'}`,
          color: state.status === 'success' ? '#065f46' : '#991b1b',
          borderRadius: '10px',
          padding: '0.85rem 1rem',
          fontSize: '0.88rem',
          fontWeight: '700',
        }}>
          {state.message}
        </div>
      )}

      {notice && (
        <div style={{
          background: notice.type === 'success' ? '#ecfdf5' : '#fef2f2',
          border: `1px solid ${notice.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
          color: notice.type === 'success' ? '#065f46' : '#991b1b',
          borderRadius: '10px',
          padding: '0.85rem 1rem',
          fontSize: '0.88rem',
          fontWeight: '700',
        }}>
          {notice.message}
        </div>
      )}

      <section style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#111827', marginBottom: '0.2rem' }}>
          Buat Jadwal Tarawih
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.86rem', marginBottom: '1rem' }}>
          Pilih imam, malam Ramadan, waktu, dan masjid untuk ditampilkan di jadwal publik.
        </p>

        <form className="schedule-form-grid" action={formAction} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.85rem' }}>
          <Field label="Malam" error={errors.malam}>
            <input name="malam" type="number" min="1" max="30" placeholder="1" required style={inputStyle(errors.malam)} />
          </Field>
          <Field label="Tanggal" error={errors.tanggal}>
            <input name="tanggal" type="date" style={inputStyle(errors.tanggal)} />
          </Field>
          <Field label="Waktu" error={errors.waktu}>
            <input name="waktu" type="text" defaultValue="19.30 WIB" required style={inputStyle(errors.waktu)} />
          </Field>
          <Field label="Rakaat" error={errors.rakaat}>
            <input name="rakaat" type="number" min="1" defaultValue="11" required style={inputStyle(errors.rakaat)} />
          </Field>
          <Field label="Imam" error={errors.imam_id}>
            <select name="imam_id" required style={inputStyle(errors.imam_id)} defaultValue="">
              <option value="" disabled>Pilih imam...</option>
              {imams.map((imam) => (
                <option key={imam.id} value={imam.id}>{imam.nama}</option>
              ))}
            </select>
          </Field>
          <Field label="Nama Masjid" error={errors.nama_masjid}>
            <input name="nama_masjid" type="text" defaultValue={defaultMosqueName} required style={inputStyle(errors.nama_masjid)} />
          </Field>
          <Field label="Status Awal" error={errors.status}>
            <select name="status" defaultValue="terjadwal" style={inputStyle(errors.status)}>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </Field>
          <div style={{ gridColumn: '1 / -1' }}>
            <Field label="Catatan" error={errors.catatan}>
              <textarea name="catatan" rows="3" placeholder="Opsional" style={{ ...inputStyle(errors.catatan), resize: 'vertical' }} />
            </Field>
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
            <SubmitButton />
          </div>
        </form>
      </section>

      <section style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1.25rem' }}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#111827', marginBottom: '1rem' }}>
          Daftar Jadwal
        </h2>
        {actionNeededSchedules.length > 0 && (
          <div style={{
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '10px',
            padding: '1rem',
            marginBottom: '1rem',
          }}>
            <div style={{ color: '#991b1b', fontWeight: '900', marginBottom: '0.65rem' }}>
              Butuh tindakan: {actionNeededSchedules.length} imam berhalangan
            </div>
            <div style={{ display: 'grid', gap: '0.55rem' }}>
              {actionNeededSchedules.map((schedule) => (
                <div key={schedule.id} className="action-needed-row" style={{
                  display: 'grid',
                  gridTemplateColumns: '90px minmax(0, 1fr) 160px',
                  gap: '0.75rem',
                  alignItems: 'center',
                  background: 'white',
                  borderRadius: '8px',
                  padding: '0.75rem',
                }}>
                  <strong style={{ color: '#b91c1c' }}>Malam {schedule.malam}</strong>
                  <span style={{ color: '#374151', fontWeight: '700' }}>
                    {schedule.imam?.nama || 'Imam belum terhubung'} - {schedule.nama_masjid}
                  </span>
                  <select
                    value={schedule.status || 'terjadwal'}
                    disabled={isUpdating}
                    onChange={(event) => handleStatusChange(schedule.id, event.target.value)}
                    aria-label={`Ubah status jadwal malam ${schedule.malam}`}
                    style={{
                      width: '100%',
                      border: '1px solid #fecaca',
                      borderRadius: '8px',
                      padding: '0.45rem 0.55rem',
                      background: 'white',
                      color: '#111827',
                      fontWeight: '700',
                    }}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1rem',
          flexWrap: 'wrap',
        }}>
          <p style={{ color: '#6b7280', fontSize: '0.86rem', fontWeight: '700' }}>
            {filteredSchedules.length} dari {schedules.length} jadwal ditampilkan
          </p>
          <div className="schedule-toolbar" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleCopySchedule}
              disabled={filteredSchedules.length === 0}
              style={{
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                background: filteredSchedules.length === 0 ? '#f3f4f6' : 'white',
                color: filteredSchedules.length === 0 ? '#9ca3af' : '#111827',
                fontWeight: '800',
                cursor: filteredSchedules.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              Copy WhatsApp
            </button>
            <button
              type="button"
              onClick={handleDownloadCsv}
              disabled={filteredSchedules.length === 0}
              style={{
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '0.5rem 0.75rem',
                background: filteredSchedules.length === 0 ? '#f3f4f6' : '#eff6ff',
                color: filteredSchedules.length === 0 ? '#9ca3af' : '#1d4ed8',
                fontWeight: '800',
                cursor: filteredSchedules.length === 0 ? 'not-allowed' : 'pointer',
              }}
            >
              Download CSV
            </button>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#374151', fontSize: '0.86rem', fontWeight: '800' }}>
              Filter status
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                style={{
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '0.5rem 0.7rem',
                  background: 'white',
                  color: '#111827',
                  fontWeight: '700',
                }}
              >
                <option value="semua">Semua</option>
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>
        {filteredSchedules.length === 0 ? (
          <div style={{ color: '#9ca3af', padding: '2rem', textAlign: 'center', background: '#f9fafb', borderRadius: '10px' }}>
            {schedules.length === 0 ? 'Belum ada jadwal tersimpan.' : 'Tidak ada jadwal dengan status ini.'}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {filteredSchedules.map((schedule) => (
              <div key={schedule.id} style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '0.85rem',
                background: schedule.status === 'berhalangan' ? '#fef2f2' : '#f9fafb',
                border: `1px solid ${schedule.status === 'berhalangan' ? '#fecaca' : '#f3f4f6'}`,
                borderRadius: '10px',
                padding: '0.9rem',
              }}>
                {editingId === schedule.id ? (
                  <EditScheduleForm
                    schedule={schedule}
                    imams={imams}
                    onCancel={() => setEditingId(null)}
                    onSaved={() => {
                      setEditingId(null)
                      router.refresh()
                    }}
                  />
                ) : (
                  <div className="schedule-row" style={{
                    display: 'grid',
                    gridTemplateColumns: '90px minmax(0, 1fr) 160px auto auto',
                    gap: '1rem',
                    alignItems: 'center',
                  }}>
                    <div style={{ color: schedule.status === 'berhalangan' ? '#b91c1c' : '#059669', fontWeight: '900' }}>Malam {schedule.malam}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: '800', color: '#111827' }}>{schedule.imam?.nama || 'Imam belum terhubung'}</div>
                      <div style={{ color: '#6b7280', fontSize: '0.82rem' }}>
                        {schedule.nama_masjid} - {schedule.waktu} - {schedule.rakaat} rakaat
                      </div>
                      {schedule.catatan && (
                        <div style={{ color: '#9ca3af', fontSize: '0.78rem', marginTop: '0.25rem' }}>
                          {schedule.catatan}
                        </div>
                      )}
                    </div>
                    <select
                      value={schedule.status || 'terjadwal'}
                      disabled={isUpdating}
                      onChange={(event) => handleStatusChange(schedule.id, event.target.value)}
                      aria-label={`Ubah status jadwal malam ${schedule.malam}`}
                      style={{
                        width: '100%',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        padding: '0.45rem 0.55rem',
                        background: 'white',
                        color: '#111827',
                        fontWeight: '700',
                      }}
                    >
                      {statusOptions.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setEditingId(schedule.id)}
                      style={{
                        border: '1px solid #bfdbfe',
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        borderRadius: '8px',
                        padding: '0.45rem 0.75rem',
                        fontWeight: '800',
                        cursor: 'pointer',
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={() => setPendingDelete(schedule)}
                      style={{
                        border: '1px solid #fecaca',
                        background: '#fef2f2',
                        color: '#b91c1c',
                        borderRadius: '8px',
                        padding: '0.45rem 0.75rem',
                        fontWeight: '700',
                        cursor: isDeleting ? 'not-allowed' : 'pointer',
                      }}
                    >
                      Hapus
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <ConfirmDeleteModal
        schedule={pendingDelete}
        isDeleting={isDeleting}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}

function ConfirmDeleteModal({ schedule, isDeleting, onCancel, onConfirm }) {
  if (!schedule) return null

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
      <div role="dialog" aria-modal="true" aria-labelledby="delete-schedule-title" style={{
        width: '100%',
        maxWidth: '420px',
        background: 'white',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 20px 50px rgba(15, 23, 42, 0.22)',
        padding: '1.25rem',
      }}>
        <h3 id="delete-schedule-title" style={{ color: '#111827', fontSize: '1.1rem', fontWeight: '900', marginBottom: '0.5rem' }}>
          Hapus Jadwal?
        </h3>
        <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.6 }}>
          Jadwal malam {schedule.malam} untuk {schedule.nama_masjid} akan dihapus permanen dari daftar admin dan jadwal publik.
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
          {schedule.imam?.nama || 'Imam belum terhubung'} - {schedule.waktu} - {schedule.rakaat} rakaat
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
            onClick={() => onConfirm(schedule)}
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

function EditScheduleForm({ schedule, imams, onCancel, onSaved }) {
  const [state, formAction] = useFormState(updateJadwal, { status: 'idle', message: '', fieldErrors: {} })
  const errors = state.fieldErrors || {}

  useEffect(() => {
    if (state.status === 'success') {
      onSaved()
    }
  }, [onSaved, state.status])

  return (
    <form action={formAction} style={{ display: 'grid', gap: '0.85rem' }}>
      <input type="hidden" name="id" value={schedule.id} />

      {(state.status === 'success' || state.status === 'error') && (
        <div style={{
          background: state.status === 'success' ? '#ecfdf5' : '#fef2f2',
          border: `1px solid ${state.status === 'success' ? '#a7f3d0' : '#fecaca'}`,
          color: state.status === 'success' ? '#065f46' : '#991b1b',
          borderRadius: '8px',
          padding: '0.7rem 0.85rem',
          fontSize: '0.84rem',
          fontWeight: '700',
        }}>
          {state.message}
        </div>
      )}

      <div className="edit-schedule-grid edit-schedule-grid-four" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '0.75rem' }}>
        <Field label="Malam" error={errors.malam}>
          <input name="malam" type="number" min="1" max="30" defaultValue={schedule.malam} required style={inputStyle(errors.malam)} />
        </Field>
        <Field label="Tanggal" error={errors.tanggal}>
          <input name="tanggal" type="date" defaultValue={schedule.tanggal || ''} style={inputStyle(errors.tanggal)} />
        </Field>
        <Field label="Waktu" error={errors.waktu}>
          <input name="waktu" type="text" defaultValue={schedule.waktu || '19.30 WIB'} required style={inputStyle(errors.waktu)} />
        </Field>
        <Field label="Rakaat" error={errors.rakaat}>
          <input name="rakaat" type="number" min="1" defaultValue={schedule.rakaat || 11} required style={inputStyle(errors.rakaat)} />
        </Field>
      </div>

      <div className="edit-schedule-grid edit-schedule-grid-three" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem' }}>
        <Field label="Imam Pengganti" error={errors.imam_id}>
          <select name="imam_id" required style={inputStyle(errors.imam_id)} defaultValue={schedule.imam?.id || schedule.imam_id || ''}>
            <option value="" disabled>Pilih imam...</option>
            {imams.map((imam) => (
              <option key={imam.id} value={imam.id}>{imam.nama}</option>
            ))}
          </select>
        </Field>
        <Field label="Masjid" error={errors.nama_masjid}>
          <input name="nama_masjid" type="text" defaultValue={schedule.nama_masjid || ''} required style={inputStyle(errors.nama_masjid)} />
        </Field>
        <Field label="Status" error={errors.status}>
          <select name="status" defaultValue={schedule.status || 'terjadwal'} style={inputStyle(errors.status)}>
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Catatan" error={errors.catatan}>
        <textarea name="catatan" rows="2" defaultValue={schedule.catatan || ''} style={{ ...inputStyle(errors.catatan), resize: 'vertical' }} />
      </Field>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '0.55rem 0.85rem',
            background: 'white',
            color: '#374151',
            fontWeight: '800',
            cursor: 'pointer',
          }}
        >
          Batal
        </button>
        <SaveButton />
      </div>
    </form>
  )
}

function Field({ label, error, children }) {
  return (
    <label style={{ display: 'grid', gap: '0.35rem', color: '#374151', fontSize: '0.84rem', fontWeight: '700' }}>
      {label}
      {children}
      {error && <span style={{ color: '#dc2626', fontSize: '0.76rem' }}>{error}</span>}
    </label>
  )
}

function inputStyle(error) {
  return {
    width: '100%',
    border: error ? '1px solid #f87171' : '1px solid #d1d5db',
    borderRadius: '8px',
    padding: '0.65rem 0.75rem',
    fontSize: '0.9rem',
    background: 'white',
    color: '#111827',
  }
}

function getStatusLabel(status) {
  return statusOptions.find((option) => option.value === status)?.label || 'Terjadwal'
}

function formatScheduleForText(schedules) {
  if (schedules.length === 0) return 'Belum ada jadwal SiJimat.'

  const lines = schedules
    .slice()
    .sort((a, b) => Number(a.malam) - Number(b.malam))
    .map((schedule) => {
      const imamName = schedule.imam?.nama || 'Imam belum terhubung'
      const status = getStatusLabel(schedule.status || 'terjadwal')
      return `Malam ${schedule.malam}: ${imamName} | ${schedule.nama_masjid} | ${schedule.waktu} | ${schedule.rakaat} rakaat | ${status}`
    })

  return ['Jadwal Tarawih SiJimat', ...lines].join('\n')
}

function formatScheduleForCsv(schedules) {
  const header = ['Malam', 'Tanggal', 'Imam', 'Masjid', 'Waktu', 'Rakaat', 'Status', 'Catatan']
  const rows = schedules
    .slice()
    .sort((a, b) => Number(a.malam) - Number(b.malam))
    .map((schedule) => [
      schedule.malam,
      schedule.tanggal || '',
      schedule.imam?.nama || 'Imam belum terhubung',
      schedule.nama_masjid || '',
      schedule.waktu || '',
      schedule.rakaat || '',
      getStatusLabel(schedule.status || 'terjadwal'),
      schedule.catatan || '',
    ])

  return [header, ...rows]
    .map((row) => row.map(escapeCsvValue).join(','))
    .join('\n')
}

function escapeCsvValue(value) {
  const text = String(value ?? '')
  return `"${text.replace(/"/g, '""')}"`
}
