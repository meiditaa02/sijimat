// app/api/cron-remind/route.js
import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(request) {
  const authHeader = request.headers.get('authorization')
  if (process.env.NODE_ENV === 'production' && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const sekarang = new Date()

    const { data: daftarJadwal, error: errorJadwal } = await supabase
      .from('jadwal')
      .select(`
        id,
        malam,
        tanggal,
        waktu,
        nama_masjid,
        imam:imam_id (
          id,
          nama,
          reminder_interval,
          user:user_id (
            email
          )
        )
      `)
      .gte('tanggal', sekarang.toISOString().split('T')[0])

    if (errorJadwal) throw errorJadwal

    const emailSent = []

    for (const jadwal of daftarJadwal) {
      if (!jadwal.imam || !jadwal.imam.user?.email) continue

      const emailImam = jadwal.imam.user.email
      const namaImam = jadwal.imam.nama
      const interval = jadwal.imam.reminder_interval || '1-day'

      const stringTanggal = jadwal.tanggal.split('T')[0]
      let jamWIB = 19
      let menitWIB = 30

      if (jadwal.waktu) {
        const bersih = jadwal.waktu.replace('WIB', '').trim()
        const parts = bersih.split('.')
        if (parts.length === 2) {
          jamWIB = parseInt(parts[0], 10)
          menitWIB = parseInt(parts[1], 10)
        }
      }

      // Konversi WIB ke UTC: kurangi 7 jam
      const jamUTC = jamWIB - 7
      const [tahun, bulan, hari] = stringTanggal.split('-').map(Number)

      // Buat waktu tugas dalam UTC
      const waktuTugas = new Date(Date.UTC(tahun, bulan - 1, hari, jamUTC, menitWIB, 0))

      const selisihMilidetik = waktuTugas - sekarang
      const selisihJam = selisihMilidetik / (1000 * 60 * 60)

      let harusKirim = false

      if (interval === '1-hour' && selisihJam > 0 && selisihJam <= 1) {
        harusKirim = true
      } else if (interval === '6-hours' && selisihJam > 5 && selisihJam <= 6) {
        harusKirim = true
      } else if (interval === '1-day' && selisihJam > 23 && selisihJam <= 24) {
        harusKirim = true
      } else if (interval === '7-days' && selisihJam > 167 && selisihJam <= 168) {
        harusKirim = true
      }

      if (harusKirim) {
        await resend.emails.send({
          from: 'SiJimat <onboarding@resend.dev>',
          to: emailImam,
          subject: `✨ Pengingat Jadwal Imam Tarawih - Malam ke-${jadwal.malam || '?'}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.5;">
              <h2>Assalamu'alaikum Wr. Wb. ${namaImam},</h2>
              <p>Ini adalah pengingat otomatis dari aplikasi <strong>SiJimat</strong> mengenai jadwal tugas Anda:</p>
              <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; margin: 15px 0; max-width: 450px;">
                <p style="margin: 4px 0;"><strong>Tanggal:</strong> ${stringTanggal}</p>
                <p style="margin: 4px 0;"><strong>Jam Tugas:</strong> ${jadwal.waktu}</p>
                <p style="margin: 4px 0;"><strong>Keterangan:</strong> Tarawih Malam ke-${jadwal.malam || '?'}</p>
                <p style="margin: 4px 0;"><strong>Masjid:</strong> ${jadwal.nama_masjid}</p>
              </div>
              <p>Mohon kehadirannya tepat waktu. Terima kasih.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;" />
              <p style="font-size: 0.8rem; color: #999;">Sistem Jadwal Imam Tarawih (SiJimat)</p>
            </div>
          `,
        })
        emailSent.push({ imam: namaImam, email: emailImam, malam: jadwal.malam })
      }
    }

    return Response.json({ success: true, sended: emailSent })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}