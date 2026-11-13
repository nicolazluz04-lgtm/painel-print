-- Sincronização da frota Sascar a cada 2 minutos (pg_cron + pg_net -> Edge Function sascar-sync).
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Segredo do agendador: gerado e guardado só no Vault (nunca sai do banco).
select vault.create_secret(encode(extensions.gen_random_bytes(32), 'hex'), 'sascar_sync_secret', 'header x-sync-secret da Edge Function sascar-sync')
where not exists (select 1 from vault.secrets where name = 'sascar_sync_secret');

create or replace function public.sync_secret_ok(s text) returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(s, '') <> '' and exists (select 1 from vault.decrypted_secrets d where d.name = 'sascar_sync_secret' and d.decrypted_secret = s);
$$;
revoke execute on function public.sync_secret_ok(text) from public, anon, authenticated;
grant execute on function public.sync_secret_ok(text) to service_role;

-- Troque <PROJETO> pelo id do projeto Supabase.
select cron.unschedule('sascar-sync') where exists (select 1 from cron.job where jobname = 'sascar-sync');
select cron.schedule('sascar-sync', '*/2 * * * *', $job$
  select net.http_post(
    url := 'https://<PROJETO>.supabase.co/functions/v1/sascar-sync',
    headers := jsonb_build_object('content-type', 'application/json',
      'x-sync-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'sascar_sync_secret')),
    body := '{}'::jsonb, timeout_milliseconds := 30000);
$job$);
