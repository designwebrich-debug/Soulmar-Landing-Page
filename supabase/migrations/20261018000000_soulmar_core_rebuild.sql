-- =============================================================================
-- SOULMAR CORE REBUILD (2026-10-18)
-- Idempotente: funciona tanto en un proyecto Supabase NUEVO como en uno RESTAURADO.
--
--  1. appointments  → autocontenida (datos del paciente en columnas propias),
--                     sin dependencia obligatoria de auth.users.
--  2. Bloqueo de doble reserva a nivel de base de datos (índice único parcial).
--  3. business_settings → horarios, festivos y duración de sesión.
--  4. media_slots       → registro de fotos del panel Multimedia (solo URLs).
--  5. Bucket público de Storage "media" para las fotos en calidad original.
--
-- Todas las APIs del servidor usan la SERVICE ROLE KEY (omite RLS). Por eso RLS
-- queda activado SIN políticas públicas de escritura: nadie desde el navegador
-- puede leer datos de pacientes ni escribir directamente en estas tablas.
-- =============================================================================

create extension if not exists pgcrypto;

-- -----------------------------------------------------------------------------
-- 1. APPOINTMENTS
-- -----------------------------------------------------------------------------
create table if not exists public.appointments (
  id               uuid primary key default gen_random_uuid(),
  patient_id       uuid,
  therapist_id     uuid,
  appointment_date date not null,
  appointment_time time not null,
  status           text not null default 'pending',
  reason           text,
  meeting_link     text,
  created_at       timestamptz not null default now()
);

-- Columnas nuevas (en proyectos restaurados la tabla ya existe)
alter table public.appointments add column if not exists patient_name  text;
alter table public.appointments add column if not exists patient_email text;
alter table public.appointments add column if not exists patient_phone text;
alter table public.appointments add column if not exists reason        text;
alter table public.appointments add column if not exists meeting_link  text;
alter table public.appointments add column if not exists updated_at    timestamptz not null default now();

-- Quitar la dependencia rígida con auth.users (antes obligaba a crear un usuario por reserva)
alter table public.appointments alter column patient_id   drop not null;
alter table public.appointments alter column therapist_id drop not null;
do $$
declare c record;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.appointments'::regclass and contype = 'f'
  loop
    execute format('alter table public.appointments drop constraint %I', c.conname);
  end loop;
end $$;

-- Estados válidos (incluye no_show, que el panel usa y el esquema viejo rechazaba)
do $$
declare c record;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.appointments'::regclass and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%status%'
  loop
    execute format('alter table public.appointments drop constraint %I', c.conname);
  end loop;
end $$;
alter table public.appointments
  add constraint appointments_status_check
  check (status in ('pending', 'confirmed', 'cancelled', 'no_show'));

-- El UNIQUE viejo (therapist, fecha, hora) incluía citas canceladas → impedía
-- volver a reservar un horario liberado. Se reemplaza por un índice parcial.
do $$
declare c record;
begin
  for c in
    select conname from pg_constraint
    where conrelid = 'public.appointments'::regclass and contype = 'u'
  loop
    execute format('alter table public.appointments drop constraint %I', c.conname);
  end loop;
end $$;

-- 🔒 BLOQUEO DE DOBLE RESERVA: la base de datos rechaza (error 23505) una segunda
-- cita activa en la misma fecha y hora, sin importar cuántos servidores atiendan.
create unique index if not exists appointments_unique_active_slot
  on public.appointments (appointment_date, appointment_time)
  where status <> 'cancelled';

create index if not exists appointments_date_idx on public.appointments (appointment_date desc);

alter table public.appointments enable row level security;
drop policy if exists "System access for all appointments" on public.appointments;
drop policy if exists "Patients can view own appointments" on public.appointments;
drop policy if exists "Patients can insert own appointments" on public.appointments;
drop policy if exists "Therapists can view assigned appointments" on public.appointments;
drop policy if exists "Therapists can update assigned appointments" on public.appointments;

-- -----------------------------------------------------------------------------
-- 2. BUSINESS SETTINGS
-- -----------------------------------------------------------------------------
create table if not exists public.business_settings (
  id            text primary key default 'default',
  schedules     jsonb not null default '{}'::jsonb,
  holidays      jsonb not null default '[]'::jsonb,
  slot_duration text  not null default '60',
  updated_at    timestamptz not null default now()
);
alter table public.business_settings add column if not exists schedules     jsonb not null default '{}'::jsonb;
alter table public.business_settings add column if not exists holidays      jsonb not null default '[]'::jsonb;
alter table public.business_settings add column if not exists slot_duration text  not null default '60';
alter table public.business_settings add column if not exists updated_at    timestamptz not null default now();
insert into public.business_settings (id) values ('default') on conflict (id) do nothing;
alter table public.business_settings enable row level security;

-- -----------------------------------------------------------------------------
-- 3. MEDIA SLOTS (panel Multimedia)
-- -----------------------------------------------------------------------------
create table if not exists public.media_slots (
  slot_key     text primary key,
  url          text,
  storage_path text,
  is_empty     boolean not null default false,
  updated_at   timestamptz not null default now()
);
alter table public.media_slots enable row level security;

-- -----------------------------------------------------------------------------
-- 4. STORAGE BUCKET "media" (lectura pública, escritura solo vía URL firmada)
-- -----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 52428800, array['image/jpeg','image/png','image/webp','image/avif'])
on conflict (id) do update
  set public = true,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
