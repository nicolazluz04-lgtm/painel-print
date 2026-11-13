-- Credenciais do webservice Sascar (SasIntegra) ficam no Vault; só a Edge Function (service_role) lê.
-- Cadastre UMA vez no SQL Editor, digitando os valores (nunca salve em arquivo):
--   select vault.create_secret('<usuario sasintegra>', 'sascar_user', 'Usuario SasIntegra');
--   select vault.create_secret('<senha sasintegra>',   'sascar_password', 'Senha SasIntegra');
create or replace function public.sascar_creds() returns table(usuario text, senha text)
language sql stable security definer set search_path = '' as $$
  select (select decrypted_secret from vault.decrypted_secrets where name='sascar_user'),
         (select decrypted_secret from vault.decrypted_secrets where name='sascar_password');
$$;
revoke execute on function public.sascar_creds() from public, anon, authenticated;
grant execute on function public.sascar_creds() to service_role;
