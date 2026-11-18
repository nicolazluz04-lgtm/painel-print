# Arquitetura

```
Navegador ──(abre)──► Vercel (principal: painel-print.vercel.app)  ┐ mesmos arquivos da branch main:
    │                 GitHub Pages (espelho)                        ┘ index.html + claude-shim.js + config.js
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
                                     ├─ pg_cron (a cada 5 min) ──► registrar_alertas_sla() (SQL: log SLA_ALERTA_60MIN)
                                     └─ Edge Function admin-users (só admin)
```

## Peças

| Peça | Onde | Função |
|---|---|---|
| Telas | `fonte/app`, `fonte/components` | React; montadas em um único `index.html` pelo `build.sh` |
| Publicação | Vercel (`vercel.json`) e GitHub Pages | Os dois publicam a raiz da branch `main` a cada push. A Vercel é o endereço principal e acrescenta cabeçalhos de segurança; o GitHub Pages fica como espelho. O CORS das Edge Functions aceita só esses dois endereços (`supabase/functions/_shared/http.ts`) |
| Regras do painel | `fonte/backend.js` | Intercepta `/api/...` no navegador e grava no banco (`kv`). Se o banco recusar uma gravação, desfaz a mudança na tela e avisa o usuário |
| Importação de planilhas | `fonte/importar.js`, `fonte/components/ImportarPlanilha.tsx` | Lê .xlsx/.csv no navegador, mostra a prévia (o que entra e o que é ignorado, com o motivo) e só cria registros novos; nunca apaga nem altera |
| Exportação | `fonte/exportar.js` | Excel de O.S., de prestadores e relatório analítico (várias abas); PDF gerencial |
| Ligação com o Supabase | `claude-shim.js` | Login, papel do usuário, leitura e escrita, tempo real, sair e trocar senha |
| Frota | `supabase/functions/sascar-sync` | Busca posições na Sascar e grava em `kv/sascar_pos/main`. O painel junta essas posições ao cadastro `frota_placas` só na leitura (km do odômetro e última posição); o cadastro em si só o admin altera |
| Usuários | `supabase/functions/admin-users` | Criar, editar, definir senha e remover (confere se quem pede é admin) |
| Permissões | `supabase/migrations/004_usuarios_papeis.sql`, `005_permissoes_por_papel.sql` | `my_role()`, `is_member()`, `is_admin()`, `kv_can_write(coleção, ação)` e políticas da `kv` |

## Papéis

| Papel | Abas | Pode alterar |
|---|---|---|
| Admin | todas | tudo: Bases, Configurações, Usuários, excluir O.S. e aprovar cancelamentos |
| Gerente | Dashboard, Atendimento, O.S., Prestadores, Peças, Log, Cancelamentos | cria e edita O.S. (notas, fechamento, pedido de cancelamento), prestadores, peças, acionamentos e ocorrências; importa planilhas de O.S. e de prestadores; acrescenta linhas ao Log |
| Operador | Dashboard, Atendimento, O.S. | nada (consulta) |

Quem não está em `public.usuarios` com `ativo = true` (ou na tabela legada `admins`) não lê nada, mesmo com conta no Auth.

As permissões são verificadas **no banco** (`kv_can_write` em `005_permissoes_por_papel.sql`). O `backend.js` repete a mesma tabela só para avisar antes de tentar gravar; a interface só esconde o que o papel não usa.
