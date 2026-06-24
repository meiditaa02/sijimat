// app/api/change-password/route.js
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function getSessionUserId() {
  const session = cookies().get('session')?.value || ''
  return session.startsWith('user-') ? session.replace('user-', '') : null
}

export async function POST(request) {
  try {
    const userId = getSessionUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Sesi tidak valid. Silakan login ulang.' }, { status: 401 })
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Semua field wajib diisi.' }, { status: 400 })
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Password baru minimal 6 karakter.' }, { status: 400 })
    }
    if (currentPassword === newPassword) {
      return NextResponse.json({ error: 'Password baru tidak boleh sama dengan password lama.' }, { status: 400 })
    }

    // Ambil data user — pakai password_hash
    const { data: user, error: fetchError } = await supabase
      .from('users')
      .select('id, password_hash')
      .eq('id', userId)
      .maybeSingle()

    if (fetchError || !user) {
      return NextResponse.json({ error: 'Pengguna tidak ditemukan.' }, { status: 404 })
    }

    // Verifikasi password lama
    let passwordValid = false
    if (user.password_hash?.startsWith('$2')) {
      // bcrypt hash
      passwordValid = await bcrypt.compare(currentPassword, user.password_hash)
    } else {
      // plaintext legacy
      passwordValid = user.password_hash === currentPassword
    }

    if (!passwordValid) {
      return NextResponse.json({ error: 'Password lama tidak sesuai.' }, { status: 400 })
    }

    // Hash dan update password baru
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    const { error: updateError } = await supabase
      .from('users')
      .update({ password_hash: hashedPassword })
      .eq('id', userId)

    if (updateError) {
      console.error('Update password error:', updateError)
      return NextResponse.json({ error: 'Gagal menyimpan password baru. Coba lagi.' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Password berhasil diperbarui.' })
  } catch (err) {
    console.error('Change password error:', err)
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 })
  }
}