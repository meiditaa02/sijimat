create table if not exists public.jadwal (
  id uuid primary key default gen_random_uuid(),
  malam integer not null check (malam between 1 and 30),
  tanggal date,
  waktu text not null default '19.30 WIB',
  rakaat integer not null default 11,
  imam_id uuid references public.imam(id) on delete set null,
  nama_masjid text not null,
  catatan text default '',
  status text not null default 'terjadwal',
  created_at timestamptz not null default now()
);

create index if not exists jadwal_malam_idx on public.jadwal (malam);
create index if not exists jadwal_imam_id_idx on public.jadwal (imam_id);

alter table public.imam
  add column if not exists user_id uuid references public.users(id) on delete set null;

alter table public.jadwal
  add column if not exists status text not null default 'terjadwal';

alter table public.jadwal
  add column if not exists catatan text default '';

create index if not exists imam_user_id_idx on public.imam (user_id);

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'jadwal_status_check'
  ) then
    alter table public.jadwal
      add constraint jadwal_status_check
      check (status in ('terjadwal', 'dikonfirmasi', 'berhalangan', 'diganti'));
  end if;
end $$;
