import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  try {
    const { pesan_id, balasan } = await request.json()
    if (!pesan_id || !balasan?.trim()) {
      return NextResponse.json({ error: 'Balasan tidak boleh kosong.' }, { status: 400 })
    }

    const { error } = await supabase
      .from('balasan_pesan')
      .insert([{ pesan_id, balasan: balasan.trim() }])

    if (error) return NextResponse.json({ error: 'Gagal menyimpan balasan.' }, { status: 500 })

    // Otomatis tandai pesan sudah dibaca
    await supabase.from('pesan').update({ sudah_dibaca: true }).eq('id', pesan_id)

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan server.' }, { status: 500 })
  }
}