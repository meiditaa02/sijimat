'use server'

import { createClient } from '@supabase/supabase-js'
import { z } from 'zod'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const RegisterSchema = z.object({
  nama: z.string().min(3, 'Nama minimal 3 karakter').max(100, 'Nama terlalu panjang'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
})

export async function registerUser(prevState, formData) {
  try {
    // Guard: pastikan formData valid
    if (!formData || typeof formData.get !== 'function') {
      return {
        status: 'error',
        message: 'Terjadi kesalahan, coba lagi.',
        fieldErrors: {},
      }
    }

    const rawData = {
      nama: formData.get('nama') ?? '',
      email: formData.get('email') ?? '',
      password: formData.get('password') ?? '',
    }

    const validated = RegisterSchema.safeParse(rawData)

    if (!validated.success) {
      const fieldErrors = {}
      // Zod v3: .error.issues, fallback ke .error.errors
      const issues = Array.isArray(validated.error?.issues)
        ? validated.error.issues
        : Array.isArray(validated.error?.errors)
          ? validated.error.errors
          : []

      for (const err of issues) {
        const field = err?.path?.[0]
        if (field) fieldErrors[field] = err.message
      }

      return {
        status: 'error',
        message: 'Periksa kembali data yang Anda isi.',
        fieldErrors,
      }
    }

    // Hash password dengan bcrypt
    const hashedPassword = await bcrypt.hash(validated.data.password, 10)

    const { error } = await supabase.from('users').insert([{
      nama: validated.data.nama,
      email: validated.data.email.toLowerCase(),
      password_hash: hashedPassword,
      role: 'imam',
    }])

    if (error) {
      if (error.code === '23505') {
        return {
          status: 'error',
          message: 'Email sudah terdaftar, silakan gunakan email lain.',
          fieldErrors: { email: 'Email ini sudah digunakan' },
        }
      }
      return {
        status: 'error',
        message: `Gagal membuat akun: ${error.message}`,
        fieldErrors: {},
      }
    }

    return {
      status: 'success',
      message: 'Akun berhasil dibuat. Silakan masuk menggunakan akun Anda.',
      fieldErrors: {},
    }

  } catch (err) {
    console.error('registerUser error:', err)
    return {
      status: 'error',
      message: 'Terjadi kesalahan server. Coba lagi.',
      fieldErrors: {},
    }
  }
}