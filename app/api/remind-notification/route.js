// app/api/remind-notification/route.js
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function getSessionUserId() {
  const session = cookies().get('session')?.value || ''
  return session.startsWith('user-') ? session.replace('user-', '') : null
}

export async function GET() {
  try {
    const userId = getSessionUserId()
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('imam')
      .select('reminder_interval')
      .eq('user_id', userId)
      .maybeSingle()

    if (error || !data) return Response.json({ interval: '1-day' })
    return Response.json({ interval: data.reminder_interval || '1-day' })
  } catch {
    return Response.json({ interval: '1-day' })
  }
}

export async function POST(request) {
  try {
    const userId = getSessionUserId()
    if (!userId) return Response.json({ error: 'Unauthorized' }, { status: 401 })

    const { interval } = await request.json()

    const { error } = await supabase
      .from('imam')
      .update({ reminder_interval: interval })
      .eq('user_id', userId)

    if (error) throw error
    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}