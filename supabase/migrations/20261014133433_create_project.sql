-- GCP projects an organization has connected.
-- Rows are created by operators (SQL or seed), never through the public API,
-- because the backend reads BigQuery with its own credentials.
--
-- Run `pnpm auth:migrate` first: this table references Better Auth's
-- organization table, which that command creates.

do $$
declare
  org_id_type text;
begin
  -- Match the organization id type (uuid or text, depending on how Better Auth
  -- created the table) so the foreign key is always valid.
  select format_type(a.atttypid, a.atttypmod)
    into org_id_type
    from pg_attribute a
   where a.attrelid = to_regclass('public.organization')
     and a.attname = 'id'
     and not a.attisdropped;

  if org_id_type is null then
    raise exception 'public.organization does not exist yet: run pnpm auth:migrate first';
  end if;

  execute format('
    create table public.project (
      id uuid primary key default gen_random_uuid(),
      organization_id %s not null references public.organization(id) on delete cascade,
      name text not null,
      gcp_project_id text not null,
      created_at timestamptz not null default now(),
      unique (organization_id, gcp_project_id)
    )', org_id_type);

  -- Keep existing connections: copy the old organization."gcpProjectId" column.
  -- The column itself is left in place; drop it later once nothing reads it.
  if exists (
    select 1 from information_schema.columns
     where table_schema = 'public'
       and table_name = 'organization'
       and column_name = 'gcpProjectId'
  ) then
    execute 'insert into public.project (organization_id, name, gcp_project_id)
             select id, "gcpProjectId", "gcpProjectId"
               from public.organization
              where "gcpProjectId" is not null and "gcpProjectId" <> ''''';
  end if;
end
$$;

alter table public.project enable row level security;
