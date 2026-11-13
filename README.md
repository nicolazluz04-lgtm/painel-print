# Painel Print Socorro

Painel de socorro mecânico da Print: ordens de serviço, prestadores, bases, controle de peças, cancelamentos, frota Sascar e mapas.

- **Site:** https://nicolazluz04-lgtm.github.io/painel-print/
- **Banco, login e funções:** Supabase (projeto `painel-print`, região São Paulo)
- **Versão atual:** veja [CHANGELOG.md](CHANGELOG.md)

## Estrutura do repositório

```
index.html, config.js,          ← site publicado (GitHub Pages serve a raiz da branch main)
claude-shim.js, .nojekyll,
modelo_cadastro_prestadores.xlsx
fonte/                          ← código-fonte do painel (React/TSX)
  app/page.tsx                    telas e abas
  components/                     mapas, peças, cancelamentos, configurações, exportação…
  backend.js                      regras do painel (O.S., prestadores, relatórios) sobre o banco
  sascar.js / brmap.js            status da frota e camadas do mapa
  template.html + build.sh        montagem do index.html
supabase/
  migrations/                     estrutura do banco, permissões por papel, agendamento da frota
  functions/sascar-sync/          busca a frota na Sascar a cada 2 min (pg_cron)
  functions/admin-users/          gestão de usuários (só administradores)
  functions/ai-insights/          IA opcional (desligada)
docs/
  ARQUITETURA.md                  como as peças se ligam
  AUDITORIA-2026-11-13.md         última auditoria
```

## Como alterar o painel

1. Edite os arquivos em `fonte/`.
2. Monte o site:
   ```bash
   cd fonte && npm install && npm run build
   ```
   Isso regenera o `index.html` na raiz.
3. Faça commit e push na branch `main`. O GitHub Pages publica em 1–2 minutos.
4. Para lançar uma versão: atualize o `CHANGELOG.md`, suba a versão em `fonte/package.json` e acrescente a linha `vX.Y.Z <commit>` em `.github/versoes.txt`. Depois do push, o GitHub Actions cria a tag e a release sozinho.

`claude-shim.js` (login e ligação com o Supabase) e `config.js` (endereço e chave **pública** do Supabase) ficam na raiz e são editados diretamente.

## Segurança

- Nenhuma senha, chave secreta ou dado pessoal neste repositório. A chave em `config.js` é a *publishable key*, pública por desenho; quem protege os dados são as regras do banco (RLS).
- Só usuários logados leem dados. Gerentes editam a operação; só administradores mexem em Usuários e Configurações.
- Credenciais da Sascar e o segredo do agendador ficam no **Vault** do Supabase.
- Cadastros públicos estão desligados: novos usuários são criados por um administrador na tela **Usuários**.
