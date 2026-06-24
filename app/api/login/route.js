import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  const body = await request.json().catch(() => null)
  const identifier = body?.identifier?.toString().trim()
  const password = body?.password?.toString() || ''

  if (!identifier || !password) {
    return NextResponse.json(
      { success: false, message: 'Email dan password wajib diisi.' },
      { status: 400 }
    )
  }

  let sessionValue = ''
  let role = ''

  // Fallback login admin demo
  if (identifier === 'admin' && password === 'sijimat123') {
    sessionValue = 'admin-sijimat'
    role = 'admin'
  } else {
    const normalizedEmail = identifier.toLowerCase()

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password_hash, role')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (error || !user) {
      return NextResponse.json(
        { success: false, message: 'Email/username atau password salah.' },
        { status: 401 }
      )
    }

    // Mendukung dua skema: bcrypt (baru) dan SHA-256 plaintext hex (legacy)
    let passwordValid = false
    if (user.password_hash?.startsWith('$2')) {
      // bcrypt
      passwordValid = await bcrypt.compare(password, user.password_hash)
    } else {
      // SHA-256 legacy
      const { createHash } = await import('crypto')
      const sha256 = createHash('sha256').update(password).digest('hex')
      passwordValid = user.password_hash === sha256
    }

    if (!passwordValid) {
      return NextResponse.json(
        { success: false, message: 'Email/username atau password salah.' },
        { status: 401 }
      )
    }

    sessionValue = `user-${user.id}`
    role = user.role || 'imam'
  }

  const response = NextResponse.json({ success: true, role })

  response.cookies.set('session', sessionValue, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: '/',
  })
  response.cookies.set('session_role', role, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: '/',
  })

  return response
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })
  response.cookies.delete('session')
  response.cookies.delete('session_role')
  return response
}