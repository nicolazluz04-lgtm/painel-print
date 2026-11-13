-- Painel Print — tabela de documentos (collection/id/data) com tempo real.
create table if not exists public.kv (
  collection text not null,
  id         text not null,
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (collection, id)
);
create index if not exists kv_collection_idx on public.kv (collection);

create or replace function public.kv_touch() returns trigger language plpgsql set search_path = '' as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists kv_touch on public.kv;
create trigger kv_touch before update on public.kv for each row execute function public.kv_touch();

-- Tabela legada de administradores (mantida por compatibilidade; o papel principal está em public.usuarios)
create table if not exists public.admins (email text primary key);

alter table public.kv enable row level security;
alter table public.admins enable row level security;
revoke all on public.kv, public.admins from anon;
revoke all on public.admins from authenticated;

-- Leitura: só usuários logados. Escrita: ver 004_usuarios_papeis.sql
drop policy if exists kv_read on public.kv;
create policy kv_read on public.kv for select to authenticated using (true);

alter publication supabase_realtime add table public.kv;
