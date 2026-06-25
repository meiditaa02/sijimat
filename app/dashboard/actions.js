'use server'

import { createClient } from '@supabase/supabase-js'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { z } from 'zod'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function getSessionUserId() {
  const session = cookies().get('session')?.value || ''
  return session.startsWith('user-') ? session.replace('user-', '') : null
}

function refreshSchedulePages() {
  revalidatePath('/dashboard')
  revalidatePath('/jadwal')
  revalidatePath('/dashboard-imam')
}

async function retrySupabase(operation, attempts = 2) {
  let result = null
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    result = await operation()
    if (!result?.error) return result
    const message = `${result.error.message || ''} ${result.error.details || ''}`
    const canRetry = /fetch failed|timeout|network/i.test(message)
    if (!canRetry || attempt === attempts) return result
    await new Promise((resolve) => setTimeout(resolve, 600))
  }
  return result
}

export async function deleteImam(id) {
  const role = cookies().get('session_role')?.value
  if (role !== 'admin') return { status: 'error', message: 'Akses ditolak. Hanya admin yang dapat menghapus data imam.' }

  const unlinkResult = await retrySupabase(() =>
    supabaseAdmin.from('jadwal').update({ imam_id: null, status: 'diganti' }).eq('imam_id', id)
  )
  if (unlinkResult?.error) return { status: 'error', message: 'Gagal melepas jadwal dari imam ini. Coba lagi.' }

  const { error } = await retrySupabase(() => supabaseAdmin.from('imam').delete().eq('id', id))
  if (error) {
    const message = `${error.message || ''} ${error.details || ''}`
    if (/fetch failed|timeout|network/i.test(message)) return { status: 'error', message: 'Koneksi ke Supabase timeout. Coba klik hapus lagi.' }
    return { status: 'error', message: 'Gagal menghapus data imam.' }
  }

  refreshSchedulePages()
  return { status: 'success', message: 'Data imam berhasil dihapus.' }
}

export async function deleteUser(userId) {
  const currentRole = cookies().get('session_role')?.value
  if (currentRole !== 'admin') return { status: 'error', message: 'Akses ditolak. Hanya admin yang dapat menghapus pengguna.' }

  const sessionUserId = getSessionUserId()
  if (sessionUserId && sessionUserId === userId) return { status: 'error', message: 'Admin tidak bisa menghapus akun yang sedang dipakai login.' }
  if (!userId) return { status: 'error', message: 'Pengguna tidak valid.' }

  const { error } = await supabaseAdmin.from('users').delete().eq('id', userId)
  if (error) return { status: 'error', message: 'Gagal menghapus pengguna.' }

  refreshSchedulePages()
  return { status: 'success', message: 'Pengguna berhasil dihapus.' }
}

export async function updateUserRole(userId, role) {
  const currentRole = cookies().get('session_role')?.value
  if (currentRole !== 'admin') return { status: 'error', message: 'Akses ditolak. Hanya admin yang dapat mengubah role.' }

  const allowedRoles = ['imam', 'admin']
  if (!userId || !allowedRoles.includes(role)) return { status: 'error', message: 'Data role tidak valid.' }

  const { data, error } = await supabaseAdmin
    .from('users').update({ role }).eq('id', userId).select('id, role').maybeSingle()

  if (error) return { status: 'error', message: 'Gagal mengubah role user.' }
  if (!data) return { status: 'error', message: 'Role belum tersimpan. Tambahkan SUPABASE_SERVICE_ROLE_KEY di environment variables.' }

  revalidatePath('/dashboard')
  return { status: 'success', message: `Role berhasil diubah menjadi ${data.role}.` }
}

const allowedScheduleStatuses = ['terjadwal', 'dikonfirmasi', 'berhalangan', 'diganti']

const ScheduleSchema = z.object({
  malam: z.coerce.number().int().min(1, 'Malam minimal 1').max(30, 'Malam maksimal 30'),
  tanggal: z.string().optional(),
  waktu: z.string().min(3, 'Waktu wajib diisi'),
  rakaat: z.coerce.number().int().min(1, 'Rakaat wajib diisi').max(50, 'Rakaat terlalu besar'),
  imam_id: z.string().min(1, 'Pilih imam'),
  nama_masjid: z.string().min(3, 'Nama masjid wajib diisi'),
  catatan: z.string().optional(),
  status: z.enum(allowedScheduleStatuses).optional(),
})

export async function createJadwal(prevState, formData) {
  const currentRole = cookies().get('session_role')?.value
  if (currentRole !== 'admin') return { status: 'error', message: 'Akses ditolak.', fieldErrors: {} }

  const rawData = {
    malam: formData.get('malam'),
    tanggal: formData.get('tanggal') || null,
    waktu: formData.get('waktu'),
    rakaat: formData.get('rakaat'),
    imam_id: formData.get('imam_id'),
    nama_masjid: formData.get('nama_masjid'),
    catatan: formData.get('catatan') || '',
    status: formData.get('status') || 'terjadwal',
  }

  const validated = ScheduleSchema.safeParse(rawData)
  if (!validated.success) {
    const fieldErrors = {}
    validated.error.errors.forEach((e) => { fieldErrors[e.path[0]] = e.message })
    return { status: 'error', message: 'Periksa kembali jadwal yang diisi.', fieldErrors }
  }

  const payload = { ...validated.data, tanggal: validated.data.tanggal || null, nama_masjid: validated.data.nama_masjid.trim(), catatan: validated.data.catatan || '', status: validated.data.status || 'terjadwal' }

  const { data: existingSchedule, error: duplicateCheckError } = await supabaseAdmin
    .from('jadwal').select('id').eq('malam', payload.malam).ilike('nama_masjid', payload.nama_masjid).limit(1).maybeSingle()

  if (duplicateCheckError) return { status: 'error', message: 'Gagal memeriksa jadwal. Coba lagi.', fieldErrors: {} }
  if (existingSchedule) return { status: 'error', message: `Malam ${payload.malam} untuk ${payload.nama_masjid} sudah ada.`, fieldErrors: { malam: 'Jadwal malam ini sudah ada.' } }

  const { error } = await supabaseAdmin.from('jadwal').insert([payload])
  if (error) return { status: 'error', message: 'Gagal menyimpan jadwal.', fieldErrors: {} }

  refreshSchedulePages()
  return { status: 'success', message: 'Jadwal berhasil ditambahkan.', fieldErrors: {} }
}

export async function updateJadwal(prevState, formData) {
  const currentRole = cookies().get('session_role')?.value
  if (currentRole !== 'admin') return { status: 'error', message: 'Akses ditolak.', fieldErrors: {} }

  const scheduleId = formData.get('id')?.toString()
  if (!scheduleId) return { status: 'error', message: 'Jadwal tidak valid.', fieldErrors: {} }

  const rawData = {
    malam: formData.get('malam'),
    tanggal: formData.get('tanggal') || null,
    waktu: formData.get('waktu'),
    rakaat: formData.get('rakaat'),
    imam_id: formData.get('imam_id'),
    nama_masjid: formData.get('nama_masjid'),
    catatan: formData.get('catatan') || '',
    status: formData.get('status') || 'terjadwal',
  }

  const validated = ScheduleSchema.safeParse(rawData)
  if (!validated.success) {
    const fieldErrors = {}
    validated.error.errors.forEach((e) => { fieldErrors[e.path[0]] = e.message })
    return { status: 'error', message: 'Periksa kembali jadwal yang diubah.', fieldErrors }
  }

  const payload = { ...validated.data, tanggal: validated.data.tanggal || null, nama_masjid: validated.data.nama_masjid.trim(), catatan: validated.data.catatan || '', status: validated.data.status || 'terjadwal' }

  const { data: duplicateSchedule, error: duplicateCheckError } = await supabaseAdmin
    .from('jadwal').select('id').eq('malam', payload.malam).ilike('nama_masjid', payload.nama_masjid).neq('id', scheduleId).limit(1).maybeSingle()

  if (duplicateCheckError) return { status: 'error', message: 'Gagal memeriksa jadwal. Coba lagi.', fieldErrors: {} }
  if (duplicateSchedule) return { status: 'error', message: `Malam ${payload.malam} untuk ${payload.nama_masjid} sudah ada.`, fieldErrors: { malam: 'Jadwal malam ini sudah ada.' } }

  const { error } = await supabaseAdmin.from('jadwal').update(payload).eq('id', scheduleId)
  if (error) return { status: 'error', message: 'Gagal mengubah jadwal.', fieldErrors: {} }

  refreshSchedulePages()
  return { status: 'success', message: 'Jadwal berhasil diubah.', fieldErrors: {} }
}

export async function updateJadwalStatus(scheduleId, status) {
  const currentRole = cookies().get('session_role')?.value
  if (currentRole !== 'admin') return { status: 'error', message: 'Akses ditolak.' }
  if (!scheduleId || !allowedScheduleStatuses.includes(status)) return { status: 'error', message: 'Status jadwal tidak valid.' }

  const { error } = await supabaseAdmin.from('jadwal').update({ status }).eq('id', scheduleId)
  if (error) return { status: 'error', message: 'Gagal mengubah status jadwal.' }

  refreshSchedulePages()
  return { status: 'success', message: 'Status jadwal berhasil diubah.' }
}

export async function confirmMyJadwal(scheduleId, nextStatus) {
  const currentRole = cookies().get('session_role')?.value
  const userId = getSessionUserId()

  if (currentRole !== 'imam' || !userId) return { status: 'error', message: 'Akses ditolak. Login sebagai imam terlebih dahulu.' }
  if (!['dikonfirmasi', 'berhalangan'].includes(nextStatus)) return { status: 'error', message: 'Status konfirmasi tidak valid.' }

  const { data: imamProfiles, error: imamError } = await supabaseAdmin.from('imam').select('id').eq('user_id', userId)
  if (imamError) return { status: 'error', message: 'Gagal membaca data imam.' }

  const imamIds = (imamProfiles || []).map((imam) => imam.id)
  if (imamIds.length === 0) return { status: 'error', message: 'Data imam belum terhubung ke akun ini.' }

  const { data: schedule, error: scheduleError } = await supabaseAdmin.from('jadwal').select('id, imam_id').eq('id', scheduleId).maybeSingle()
  if (scheduleError || !schedule) return { status: 'error', message: 'Jadwal tidak ditemukan.' }
  if (!imamIds.includes(schedule.imam_id)) return { status: 'error', message: 'Jadwal ini bukan milik akun imam Anda.' }

  const { error } = await supabaseAdmin.from('jadwal').update({ status: nextStatus }).eq('id', scheduleId)
  if (error) return { status: 'error', message: 'Gagal menyimpan konfirmasi jadwal.' }

  refreshSchedulePages()
  return {
    status: 'success',
    message: nextStatus === 'dikonfirmasi' ? 'Status bisa hadir berhasil dikirim ke admin.' : 'Status berhalangan berhasil dikirim ke admin.',
  }
}

export async function deleteJadwal(id) {
  const currentRole = cookies().get('session_role')?.value
  if (currentRole !== 'admin') return { status: 'error', message: 'Akses ditolak.' }

  const { error } = await supabaseAdmin.from('jadwal').delete().eq('id', id)
  if (error) return { status: 'error', message: 'Gagal menghapus jadwal.' }

  refreshSchedulePages()
  return { status: 'success', message: 'Jadwal berhasil dihapus.' }
}