'use server'

// Server Action dengan validasi Zod

import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Schema validasi Zod
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
  // Ambil data dari form
  const rawData = {
    nama: formData.get('nama'),
    no_whatsapp: formData.get('no_whatsapp'),
    nama_masjid: formData.get('nama_masjid'),
    ketersediaan: formData.get('ketersediaan'),
  }

  // Validasi dengan Zod safeParse (tidak throw error)
  const validated = ImamSchema.safeParse(rawData)

  // Jika validasi gagal, kembalikan pesan error per field
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

  // Data valid, simpan ke Supabase
  const { error } = await supabase.from('imam').insert([validated.data])

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
