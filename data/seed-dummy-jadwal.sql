-- Seed dummy untuk demo SiJimat.
-- Aman dijalankan ulang: data imam/jadwal yang sudah ada tidak ditimpa.

with dummy_imam(nama, no_whatsapp, nama_masjid, ketersediaan) as (
  values
    ('Ust. Abad Badrussalam', '081200000001', 'Masjid Al-Ikhlas', 'semua_malam'),
    ('Ust. Zaenal Abidin', '081200000002', 'Masjid Al-Ikhlas', 'ganjil_saja'),
    ('Ust. Abdullah Fauzi', '081200000003', 'Masjid Al-Ikhlas', 'genap_saja'),
    ('Ust. Iwan', '081200000004', 'Masjid Al-Ikhlas', 'fleksibel'),
    ('Ust. Ruli Akbar', '081200000005', 'Masjid Al-Ikhlas', 'semua_malam'),
    ('Ust. Ahmad Zuhdi', '081200000006', 'Masjid Al-Ikhlas', 'fleksibel')
)
insert into public.imam (nama, no_whatsapp, nama_masjid, ketersediaan)
select d.nama, d.no_whatsapp, d.nama_masjid, d.ketersediaan
from dummy_imam d
where not exists (
  select 1
  from public.imam i
  where lower(i.nama) = lower(d.nama)
    and lower(i.nama_masjid) = lower(d.nama_masjid)
);

with nights as (
  select generate_series(1, 30) as malam
),
schedule_seed as (
  select
    malam,
    date '2026-02-18' + (malam - 1) as tanggal,
    case ((malam - 1) % 6)
      when 0 then 'Ust. Abad Badrussalam'
      when 1 then 'Ust. Zaenal Abidin'
      when 2 then 'Ust. Abdullah Fauzi'
      when 3 then 'Ust. Iwan'
      when 4 then 'Ust. Ruli Akbar'
      else 'Ust. Ahmad Zuhdi'
    end as nama_imam
  from nights
)
insert into public.jadwal (
  malam,
  tanggal,
  waktu,
  rakaat,
  imam_id,
  nama_masjid,
  status,
  catatan
)
select
  s.malam,
  s.tanggal,
  '19.30 WIB',
  11,
  i.id,
  'Masjid Al-Ikhlas',
  'terjadwal',
  'Data dummy demo'
from schedule_seed s
join public.imam i
  on lower(i.nama) = lower(s.nama_imam)
 and lower(i.nama_masjid) = lower('Masjid Al-Ikhlas')
where not exists (
  select 1
  from public.jadwal j
  where j.malam = s.malam
    and lower(j.nama_masjid) = lower('Masjid Al-Ikhlas')
);
