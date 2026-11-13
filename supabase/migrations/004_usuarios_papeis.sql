-- Usuários do painel e papéis: admin (tudo) · gerente (edita a operação) · operador (só leitura).
create table if not exists public.usuarios (
  email     text primary key check (email = lower(email)),
  nome      text not null default '',
  role      text not null default 'operador' check (role in ('admin','gerente','operador')),
  ativo     boolean not null default true,
  criado_em timestamptz not null default now()
);
alter table public.usuarios enable row level security;
revoke all on public.usuarios from anon;

-- Primeiro administrador (troque o e-mail). Os demais são criados pela tela Usuários do painel.
-- insert into public.usuarios(email, nome, role) values ('seu.email@empresa.com.br', 'Seu Nome', 'admin');

create or replace function public.my_role() returns text
language sql stable security definer set search_path = '' as $$
  select coalesce(
    (select u.role from public.usuarios u where u.email = lower(auth.jwt() ->> 'email') and u.ativo),
    case when exists (select 1 from public.admins a where lower(a.email) = lower(auth.jwt() ->> 'email')) then 'admin' end,
    'operador');
$$;
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$ select public.my_role() = 'admin'; $$;
create or replace function public.can_edit() returns boolean
language sql stable security definer set search_path = '' as $$ select public.my_role() in ('admin','gerente'); $$;
revoke execute on function public.my_role(), public.is_admin(), public.can_edit() from public, anon;
grant execute on function public.my_role(), public.is_admin(), public.can_edit() to authenticated;

drop policy if exists usuarios_sel on public.usuarios;
create policy usuarios_sel on public.usuarios for select to authenticated
  using (email = lower(auth.jwt() ->> 'email') or (select public.is_admin()));
drop policy if exists usuarios_adm on public.usuarios;
create policy usuarios_adm on public.usuarios for all to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

-- kv: coleção config só admin; demais coleções admin ou gerente
drop policy if exists kv_write on public.kv;
create policy kv_write on public.kv for insert to authenticated
  with check (case when collection = 'config' then (select public.is_admin()) else (select public.can_edit()) end);
drop policy if exists kv_upd on public.kv;
create policy kv_upd on public.kv for update to authenticated
  using (case when collection = 'config' then (select public.is_admin()) else (select public.can_edit()) end)
  with check (case when collection = 'config' then (select public.is_admin()) else (select public.can_edit()) end);
drop policy if exists kv_del on public.kv;
create policy kv_del on public.kv for delete to authenticated
  using (case when collection = 'config' then (select public.is_admin()) else (select public.can_edit()) end);
