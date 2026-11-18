# Histórico de versões

Formato: [versionamento semântico](https://semver.org/lang/pt-BR/) — MAIOR.MENOR.CORREÇÃO.

## [Não lançado]
### Adicionado
- Importar planilha de prestadores e de O.S. (.xlsx/.csv), com prévia, motivo de cada linha ignorada e sem apagar nada (T6).
- "Exportar Excel" gera o relatório analítico (resumo, O.S., por filial, por prestador, por status, escalonamento) (T7).
- Frota: km do odômetro e última posição da Sascar na escolha da placa, sem gravar no cadastro (T9).
- Selo "Cancelamento pendente" nas O.S.
### Corrigido
- Falha ao gravar no banco agora aparece na tela (antes era ignorada) e a mudança é desfeita.
- Operador não vê mais o PDF gerencial; gerente não vê Bases, Usuários e "Excluir" em Configurações.

## [1.5.0] — 18/11/2026
### Segurança (revisão de 17/11)
- Permissões por papel no banco: gerente cria e edita O.S., prestadores e peças; Bases, Configurações e excluir O.S. só administrador; operador só lê.
- Cancelamento em duas etapas: o gerente solicita, o administrador aprova.
- Usuário desativado perde todo o acesso; quem não tem cadastro não lê nada.
- Alertas de SLA gravados pelo servidor a cada 5 min (abrir a tela não grava mais nada).
- Gestão de usuários consulta o banco para saber quem é administrador e só aceita chamadas do próprio painel.
- Nomes de pessoas retirados do documento de auditoria.
### Telas e espaçamentos
- Escala única de espaçamento; tabelas com rolagem própria; janelas cabem no celular.
- Celular: O.S. em cartões, com as ações reunidas em "☰ Ações". Notebook: Atendimento em 3 colunas, sem cortes.
- Botões com tamanho mínimo de toque; teste automático de layout (`fonte/testes/layout.mjs`).
- Mapa único de papéis (removida a opção "Consultor", que não existia).
### Corrigido
- Prestadores: colunas Status e 24h mostravam os valores trocados.

## [1.4.0] — 16/11/2026
### Sincronizado com a produção do CodeWords (commit a3a5805, backend cmwazfbea00qnhlujmlyko70f)
- Site de produção comparado arquivo por arquivo: código idêntico ao pacote de 09/11; nada a trazer.
- Dados: 20 O.S. voltam à situação da produção (14 em aberto), com histórico e datas. Cópia de segurança das versões anteriores guardada no banco.
- Dados: cadastro da frota (889 placas), envio de peça pendente e raio de busca de 25 km.
### Adicionado
- Relatório gerencial (botão "Gerar PDF Gerencial" no Dashboard), que existia só no backend do CodeWords.
### Corrigido
- Selo "Aguardando orçamento" mostrava códigos crus e desalinhava o cartão no Atendimento.

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
