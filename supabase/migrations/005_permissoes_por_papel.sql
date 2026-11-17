-- Permissões por papel e por coleção (T1, T2, T3 e T10 do plano de 17/11/2026).
-- Pode rodar mais de uma vez (idempotente).
--
-- Papéis:
--   admin    → tudo (inclui bases, config, excluir O.S., aprovar cancelamento e usuários)
--   gerente  → cria e edita O.S. (com notas e pedido de cancelamento), prestadores, peças
--              (pecas_envio), acionamentos e ocorrências; acrescenta linhas ao log; marca notificações
--   operador → só leitura
--   sem cadastro ativo em public.usuarios → nada (nem leitura)

-- ── Quem é membro e qual é o papel ──────────────────────────────────────────────
-- member_role(): papel de quem chama, ou NULL se não for membro.
--   1. Quem tem linha em public.usuarios: vale o papel dela, só se ativo = true
--      (desativar em usuarios agora tira o acesso mesmo de quem está na tabela legada admins).
--   2. Quem não tem linha em usuarios mas está na tabela legada public.admins: admin.
create or replace function public.member_role() returns text
language sql stable security definer set search_path = '' as $$
  select case
    when exists (select 1 from public.usuarios u where u.email = x.e)
      then (select u.role from public.usuarios u where u.email = x.e and u.ativo)
    when exists (select 1 from public.admins a where lower(a.email) = x.e)
      then 'admin'
  end
  from (select lower(auth.jwt() ->> 'email') as e) x;
$$;
revoke execute on function public.member_role() from public, anon, authenticated;

-- Contrato antigo mantido: my_role() devolve 'operador' para quem não é membro (a tela trata como só leitura).
create or replace function public.my_role() returns text
language sql stable security definer set search_path = '' as $$
  select coalesce(public.member_role(), 'operador');
$$;
create or replace function public.is_member() returns boolean
language sql stable security definer set search_path = '' as $$
  select public.member_role() is not null;
$$;
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select public.member_role() = 'admin';
$$;
create or replace function public.can_edit() returns boolean
language sql stable security definer set search_path = '' as $$
  select public.member_role() in ('admin', 'gerente');
$$;

-- ── Regra única de escrita na kv (substitui as 4 cópias do "case when collection = 'config'") ──
-- acao: 'insert' | 'update' | 'delete'. Coleção fora da lista do gerente = só admin.
create or replace function public.kv_can_write(p_collection text, p_acao text) returns boolean
language sql stable security definer set search_path = '' as $$
  select case public.member_role()
    when 'admin' then true
    when 'gerente' then case p_collection
      when 'ordens'       then p_acao in ('insert', 'update')            -- excluir O.S.: só admin
      when 'prestadores'  then p_acao in ('insert', 'update', 'delete')
      when 'pecas_envio'  then p_acao in ('insert', 'update', 'delete')
      when 'acionamentos' then p_acao in ('insert', 'update', 'delete')
      when 'ocorrencias'  then p_acao in ('insert', 'update')
      when 'notificacoes' then p_acao in ('insert', 'update')            -- marcar como lida
      when 'log'          then p_acao = 'insert'                          -- log só cresce
      else false                                                          -- bases, config, frota_placas, sascar_pos…
    end
    else false
  end;
$$;

revoke execute on function public.my_role(), public.is_member(), public.is_admin(), public.can_edit(),
  public.kv_can_write(text, text) from public, anon;
grant execute on function public.my_role(), public.is_member(), public.is_admin(), public.can_edit(),
  public.kv_can_write(text, text) to authenticated;

-- ── Políticas da kv ─────────────────────────────────────────────────────────────
drop policy if exists kv_read on public.kv;
create policy kv_read on public.kv for select to authenticated
  using ((select public.is_member()));
drop policy if exists kv_write on public.kv;
create policy kv_write on public.kv for insert to authenticated
  with check (public.kv_can_write(collection, 'insert'));
drop policy if exists kv_upd on public.kv;
create policy kv_upd on public.kv for update to authenticated
  using (public.kv_can_write(collection, 'update'))
  with check (public.kv_can_write(collection, 'update'));
drop policy if exists kv_del on public.kv;
create policy kv_del on public.kv for delete to authenticated
  using (public.kv_can_write(collection, 'delete'));

-- Verdadeiro/falso no estilo do JavaScript do painel (null, false, 0 e "" contam como falso).
create or replace function public.jsonb_truthy(v jsonb) returns boolean
language sql immutable set search_path = '' as $$
  select coalesce(v not in ('null'::jsonb, 'false'::jsonb, '0'::jsonb, '""'::jsonb), false);
$$;

-- ── Guarda de O.S.: só admin cancela (o gerente apenas solicita) ────────────────
-- Vale para quem acessa pela internet (papéis authenticated/anon). O servidor (service_role, pg_cron) não passa por aqui.
create or replace function public.kv_guard() returns trigger
language plpgsql set search_path = '' as $$
declare
  cancelada_antes boolean := false;
  cancelada_agora boolean;
begin
  if current_user not in ('authenticated', 'anon') then return new; end if;
  if tg_op = 'UPDATE' and (new.collection is distinct from old.collection or new.id is distinct from old.id) then
    raise exception 'Não é permitido mudar a coleção ou o id de um registro.' using errcode = '42501';
  end if;
  if new.collection = 'ordens' and not public.is_admin() then
    if tg_op = 'UPDATE' then
      cancelada_antes := public.jsonb_truthy(old.data -> 'cancelado')
                         or coalesce(old.data ->> 'status', '') = 'Cancelada';
    end if;
    cancelada_agora := public.jsonb_truthy(new.data -> 'cancelado')
                       or coalesce(new.data ->> 'status', '') = 'Cancelada';
    if cancelada_agora is distinct from cancelada_antes then
      raise exception 'Só um administrador cancela O.S. O gerente solicita o cancelamento.' using errcode = '42501';
    end if;
  end if;
  return new;
end $$;
drop trigger if exists kv_guard on public.kv;
create trigger kv_guard before insert or update on public.kv for each row execute function public.kv_guard();

