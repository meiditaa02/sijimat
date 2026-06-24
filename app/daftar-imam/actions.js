'use server'

import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function getSessionUserId() {
  const session = cookies().get('session')?.value || ''
  return session.startsWith('user-') ? session.replace('user-', '') : null
}

const ImamSchema = z.object({
  nama: z.string().min(3, 'Nama minimal 3 karakter').max(100, 'Nama terlalu panjang'),
  no_whatsapp: z
    .string()
    .min(10, 'Nomor WhatsApp minimal 10 digit')
    .max(15, 'Nomor WhatsApp terlalu panjang')
    .regex(/^[0-9+]+$/, 'Nomor WhatsApp hanya boleh angka'),
  nama_masjid: z.string().min(3, 'Nama masjid minimal 3 karakter').max(100, 'Nama masjid terlalu panjang'),
  ketersediaan: z.enum(
    ['semua_malam', 'ganjil_saja', 'genap_saja', 'fleksibel'],
    { errorMap: () => ({ message: 'Pilih ketersediaan waktu' }) }
  ),
})

export async function daftarImam(prevState, formData) {
  const rawData = {
    nama: formData.get('nama'),
    no_whatsapp: formData.get('no_whatsapp'),
    nama_masjid: formData.get('nama_masjid'),
    ketersediaan: formData.get('ketersediaan'),
  }

  const validated = ImamSchema.safeParse(rawData)

  if (!validated.success) {
    const fieldErrors = {}
    validated.error.errors.forEach((err) => {
      const field = err.path[0]
      fieldErrors[field] = err.message
    })

    return {
      status: 'error',
      message: 'Periksa kembali data yang Anda isi.',
      fieldErrors,
    }
  }

  const userId = getSessionUserId()
  if (userId) {
    const { data: existingImam, error: existingError } = await supabaseAdmin
      .from('imam')
      .select('id')
      .eq('user_id', userId)
      .limit(1)
      .maybeSingle()

    if (existingError) {
      return {
        status: 'error',
        message: 'Gagal memeriksa data imam. Silakan coba lagi.',
        fieldErrors: {},
      }
    }

    if (existingImam) {
      return {
        status: 'error',
        message: 'Data imam untuk akun ini sudah ada. Edit data melalui halaman profil.',
        fieldErrors: {},
      }
    }
  }

  const payload = {
    ...validated.data,
    ...(userId ? { user_id: userId } : {}),
  }

  const { error } = await supabaseAdmin.from('imam').insert([payload])

  if (error) {
    return {
      status: 'error',
      message: 'Gagal menyimpan data. Silakan coba lagi.',
      fieldErrors: {},
    }
  }

  return {
    status: 'success',
    message: `Jazakallahu khairan, Ustadz ${validated.data.nama}! Pendaftaran berhasil.`,
    fieldErrors: {},
  }
}

export async function updateImamProfile(prevState, formData) {
  const userId = getSessionUserId()
  const imamId = formData.get('id')?.toString()

  if (!userId || !imamId) {
    return {
      status: 'error',
      message: 'Data imam tidak valid.',
      fieldErrors: {},
    }
  }

  const rawData = {
    nama: formData.get('nama'),
    no_whatsapp: formData.get('no_whatsapp'),
    nama_masjid: formData.get('nama_masjid'),
    ketersediaan: formData.get('ketersediaan'),
  }

  const validated = ImamSchema.safeParse(rawData)
  if (!validated.success) {
    const fieldErrors = {}
    validated.error.errors.forEach((err) => {
      fieldErrors[err.path[0]] = err.message
    })

    return {
      status: 'error',
      message: 'Periksa kembali data imam Anda.',
      fieldErrors,
    }
  }

  const { data: imam, error: lookupError } = await supabaseAdmin
    .from('imam')
    .select('id')
    .eq('id', imamId)
    .eq('user_id', userId)
    .maybeSingle()

  if (lookupError || !imam) {
    return {
      status: 'error',
      message: 'Data imam ini tidak terhubung ke akun Anda.',
      fieldErrors: {},
    }
  }

  const { error } = await supabaseAdmin
    .from('imam')
    .update(validated.data)
    .eq('id', imamId)
    .eq('user_id', userId)

  if (error) {
    return {
      status: 'error',
      message: 'Gagal mengubah data imam.',
      fieldErrors: {},
    }
  }

  revalidatePath('/profile')
  revalidatePath('/dashboard-imam')
  revalidatePath('/dashboard')
  revalidatePath('/jadwal')

  return {
    status: 'success',
    message: 'Data imam berhasil diperbarui.',
    fieldErrors: {},
  }
}
