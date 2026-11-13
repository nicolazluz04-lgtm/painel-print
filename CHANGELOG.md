# Histórico de versões

Formato: [versionamento semântico](https://semver.org/lang/pt-BR/) — MAIOR.MENOR.CORREÇÃO.

## [1.3.0] — 13/11/2026
### Organização
- Repositório passa a guardar o código-fonte (`fonte/`), o banco (`supabase/`) e a documentação (`docs/`), além do site publicado.
- `template.html` limpo: removida a cópia antiga do código, que não era usada e continha a senha padrão do sistema anterior.
- Histórico do Git reescrito para retirar essa senha das versões antigas.
- README, CHANGELOG e documento de arquitetura.

### Comparação com o pacote "painel-atual" (09/11/2026)
O pacote Next.js de 09/11 é **anterior** a esta versão: não tem a classificação de defeito, o valor orçado nem o menu de exportação, e depende do backend do CodeWords. Nada dele precisou ser trazido.

## [1.2.0] — 13/11/2026
### Corrigido
- Ícones não apareciam em nenhuma tela (biblioteca lucide com nome global errado).
- Mapas com fundo azul liso: imagens com largura zero por regra de CSS genérica.
- Botões flutuantes sobrepostos no canto inferior direito.
- Datas em dd/mm/aaaa e valores em R$ no padrão brasileiro; coluna Serviço preenchida.
- Barra lateral recolhida em telas pequenas (celular).
### Adicionado
- Usuários reais com papéis (admin, gerente, operador) e gestão pela tela Usuários (Edge Function `admin-users`).
- Satélite ao vivo (Esri) nos mapas, com as imagens embutidas como reserva.
- "Sair" e "Trocar senha" na barra lateral.
### Removido
- Dependência do CodeWords (frota passa a vir da Sascar pelo Supabase).
- Senha fixa "[senha padrão antiga]" no botão de redefinir senha.

## [1.1.0] — 12/11/2026
### Adicionado
- Botão "Trocar senha".

## [1.0.0] — 12/11/2026
### Adicionado
- Primeira publicação no GitHub Pages, com dados no Supabase e login obrigatório.
