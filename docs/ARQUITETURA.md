# Arquitetura

```
Navegador ──(abre)──► GitHub Pages: index.html + claude-shim.js + config.js
    │
    └─(login, dados, tempo real)──► Supabase (São Paulo)
                                     ├─ Auth: contas e senhas
                                     ├─ Postgres
                                     │   ├─ kv: prestadores, ordens, bases, log, notificações,
                                     │   │       peças, config, sascar_pos (frota)
                                     │   ├─ usuarios: e-mail → papel (admin/gerente/operador)
                                     │   └─ RLS: quem lê e quem escreve
                                     ├─ Vault: credenciais Sascar, segredo do agendador
                                     ├─ pg_cron (a cada 2 min) ──► Edge Function sascar-sync
                                     │                               └─► Sascar SasIntegra (SOAP)
                                     └─ Edge Function admin-users (só admin)
```

## Peças

| Peça | Onde | Função |
|---|---|---|
| Telas | `fonte/app`, `fonte/components` | React; montadas em um único `index.html` pelo `build.sh` |
| Regras do painel | `fonte/backend.js` | Intercepta `/api/...` no navegador e grava no banco (`kv`) |
| Ligação com o Supabase | `claude-shim.js` | Login, papel do usuário, leitura e escrita, tempo real, sair e trocar senha |
| Frota | `supabase/functions/sascar-sync` | Busca posições na Sascar e grava em `kv/sascar_pos/main` |
| Usuários | `supabase/functions/admin-users` | Criar, editar, definir senha e remover (confere se quem pede é admin) |
| Permissões | `supabase/migrations/004_usuarios_papeis.sql` | `my_role()`, `is_admin()`, `can_edit()` e políticas da `kv` |

## Papéis

| Papel | Abas | Pode alterar |
|---|---|---|
| Admin | todas | tudo, incluindo Usuários e Configurações |
| Gerente | Dashboard, Atendimento, O.S., Prestadores, Peças, Log | dados da operação (não altera Configurações nem Usuários) |
| Operador | Dashboard, Atendimento, O.S. | nada (consulta) |

As permissões são verificadas **no banco**. A interface só esconde o que o papel não usa.
