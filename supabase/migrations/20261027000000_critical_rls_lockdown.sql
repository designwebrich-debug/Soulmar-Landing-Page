-- =============================================================================
-- SOULMAR · CRITICAL RLS LOCKDOWN (2026-10-27)
-- Resuelve las alertas de Supabase:
--   • rls_disabled_in_public       (Table publicly accessible)
--   • sensitive_columns_exposed    (Sensitive data publicly accessible)
--
-- Arquitectura Soulmar: TODO acceso legítimo a estas tablas ocurre en el servidor
-- (Next.js API routes / layout) con la SERVICE ROLE KEY, que omite RLS.
-- Por lo tanto el modelo correcto es "deny-all" para los roles públicos
-- (anon, authenticated): RLS activado, cero políticas, cero privilegios.
--
-- Idempotente: se puede ejecutar varias veces sin efectos secundarios.
-- =============================================================================

begin;

-- 1. Activar RLS + eliminar CUALQUIER política existente (incluidas "allow all")
do $$
declare
  t text;
  p record;
begin
  foreach t in array array['profiles', 'appointments', 'business_settings', 'media_slots']
  loop
    if to_regclass('public.' || t) is null then
      continue;
    end if;

    execute format('alter table public.%I enable row level security', t);

    for p in
      select policyname from pg_policies
      where schemaname = 'public' and tablename = t
    loop
      execute format('drop policy if exists %I on public.%I', p.policyname, t);
    end loop;

    -- 2. Retirar privilegios de los roles públicos del API (defensa en profundidad)
    execute format('revoke all on table public.%I from anon, authenticated, public', t);

    -- 3. Solo el servidor (service_role) opera sobre la tabla
    execute format('grant all on table public.%I to service_role', t);
  end loop;
end $$;

-- 4. Activar RLS en cualquier otra tabla del esquema public que lo tenga apagado
do $$
declare r record;
begin
  for r in
    select c.relname
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity
  loop
    execute format('alter table public.%I enable row level security', r.relname);
  end loop;
end $$;

-- 5. Tablas futuras: no heredan privilegios públicos por defecto
alter default privileges in schema public revoke all on tables from anon, authenticated;

commit;

-- -----------------------------------------------------------------------------
-- VERIFICACIÓN (debe mostrar rls_enabled = true y anon_select = false en todas)
-- -----------------------------------------------------------------------------
select
  c.relname                                              as table_name,
  c.relrowsecurity                                       as rls_enabled,
  has_table_privilege('anon', c.oid, 'select')           as anon_select,
  has_table_privilege('anon', c.oid, 'insert')           as anon_insert,
  has_table_privilege('authenticated', c.oid, 'select')  as auth_select,
  (select count(*) from pg_policies p
     where p.schemaname = 'public' and p.tablename = c.relname) as policies
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public' and c.relkind = 'r'
order by 1;
