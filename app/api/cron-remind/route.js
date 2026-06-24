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

    // ambil jadwal hari ini dan yang akan datang
    const { data: daftarJadwal, error: errorJadwal } = await supabase
      .from('jadwal')
      .select(`
        id,
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

    // cek kecocokan waktu
    for (const jadwal of daftarJadwal) {
      if (!jadwal.imam || !jadwal.imam.user?.email) continue

      const emailImam = jadwal.imam.user.email
      const namaImam = jadwal.imam.nama
      const interval = jadwal.imam.reminder_interval || '1-day'
      
      const stringTanggal = jadwal.tanggal.split('T')[0]
      let stringWaktu = '19:30:00'

      // ubah format "19.30 WIB" menjadi "19:30:00" 
      if (jadwal.waktu) {
        let bersih = jadwal.waktu.replace('WIB', '').trim(); 
        bersih = bersih.replace('.', ':'); 
        if (bersih.split(':').length === 2) {
          bersih += ':00'; 
        }
        stringWaktu = bersih;
      }

      // Gabungkan kolom tanggal dan waktu menjadi satu objek Date utuh
      const waktuTugas = new Date(`${stringTanggal}T${stringWaktu}`)
      
      const selisihMilidetik = waktuTugas - sekarang
      const selisihJam = selisihMilidetik / (1000 * 60 * 60)

      let harusKirim = false

      // Logika pengecekan cron
      if (interval === '1-hour' && selisihJam > 0 && selisihJam <= 1) {
        harusKirim = true
      } else if (interval === '6-hours' && selisihJam > 5 && selisihJam <= 6) {
        harusKirim = true
      } else if (interval === '1-day' && selisihJam > 23 && selisihJam <= 24) {
        harusKirim = true
      } else if (interval === '7-days' && selisihJam > 167 && selisihJam <= 168) {
        harusKirim = true
      }

      // Eksekusi kirim email lewat Resend 
      if (harusKirim) {
        await resend.emails.send({
          from: 'SiJimat <onboarding@resend.dev>',
          to: emailImam,
          subject: `✨ Pengingat Jadwal Imam Tarawih - Malam ke-${jadwal.malam || '30'}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; color: #333; line-height: 1.5;">
              <h2>Assalamu'alaikum Wr. Wb. ${namaImam},</h2>
              <p>Ini adalah pengingat otomatis dari aplikasi <strong>SiJimat</strong> mengenai jadwal tugas Anda malam ini:</p>
              <div style="background: #f9fafb; border: 1px solid #e5e7eb; padding: 15px; border-radius: 8px; margin: 15px 0; max-width: 450px;">
                <p style="margin: 4px 0;"><strong>Tanggal:</strong> ${stringTanggal}</p>
                <p style="margin: 4px 0;"><strong>Jam Tugas:</strong> ${jadwal.waktu} </p>
                <p style="margin: 4px 0;"><strong>Keterangan:</strong> Tarawih Malam ke-${jadwal.malam || '30'}</p>
              </div>
              <p>Mohon kehadirannya tepat waktu dan mempersiapkan diri dengan sebaik-baiknya. Terima kasih.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin-top: 30px;" />
              <p style="font-size: 0.8rem; color: #999;">Sistem Jadwal Imam Tarawih (SiJimat)</p>
            </div>
          `
        })
        emailSent.push({ imam: namaImam, email: emailImam })
      }
    }

    return Response.json({ success: true, sended: emailSent })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}