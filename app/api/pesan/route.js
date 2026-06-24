import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

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
    const { nama, email, pesan } = await request.json()
    if (!nama || !email || !pesan) {
      return NextResponse.json({ error: 'Semua field wajib diisi.' }, { status: 400 })
    }

    const userId = getSessionUserId()

    const { error } = await supabase.from('pesan').insert([{
      nama, email, pesan,
      user_id: userId || null,
    }])

    if (error) return NextResponse.json({ error: 'Gagal menyimpan pesan.' }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID wajib diisi.' }, { status: 400 })

    const { error } = await supabase
      .from('pesan')
      .update({ sudah_dibaca: true })
      .eq('id', id)

    if (error) return NextResponse.json({ error: 'Gagal update.' }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const { id } = await request.json()
    if (!id) return NextResponse.json({ error: 'ID wajib diisi.' }, { status: 400 })

    const { error } = await supabase
      .from('pesan')
      .delete()
      .eq('id', id)

    if (error) return NextResponse.json({ error: 'Gagal menghapus pesan.' }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 })
  }
}