# Revisão completa e plano de tarefas — 17/11/2026

**Ferramenta:** Skill `revisao-2-eixos` (fork de `mattpocock/skills` · `code-review`, commit `5863806`, em `.claude/skills/revisao-2-eixos/`).
**Ponto fixo:** `v1.0.0` → `HEAD` (`990a78f`). O código-fonte e o backend entraram depois da v1.0.0, então a diferença cobre a aplicação inteira: 53 arquivos, cerca de 4.100 linhas. Ficaram de fora só os arquivos gerados ou de dados (`index.html`, `fonte/mapdata.js`, `fonte/images.js`, `fonte/data/`, planilha modelo).
**Fontes de padrão:** só o `README.md` (seções "Como alterar o painel" e "Segurança"), mais a lista base de 12 maus cheiros (Fowler). O repositório não tem `CODING_STANDARDS.md`, `CONTRIBUTING.md`, linter nem testes.
**Fontes de especificação:** os requisitos pedidos pelo usuário na conversa, a `MEMORIA_PROJETO.md` da produção do CodeWords (sem a senha) e o `docs/ARQUITETURA.md`.

Cada eixo foi revisado por um agente separado, sem ver o outro. Os achados graves foram **conferidos no código** antes de entrar no plano. A Skill avisa que o que os revisores apontam é hipótese até ser checado.

---

## Standards (está bem construído?)

**Violações de padrão documentado**
- **S1. Dado pessoal no repositório (violação clara).** `docs/AUDITORIA-2026-11-13.md`, linhas 46–50, liga nomes reais a papéis e à situação de acesso. Fere o README, seção Segurança: "Nenhuma senha, chave secreta ou dado pessoal neste repositório". *Conferido.*
- **S2. Documentação desatualizada (juízo).** O `README.md` (linhas 12 e 39) e o `docs/ARQUITETURA.md` ainda dizem que só o GitHub Pages publica, mas a Vercel agora também publica sozinha.
- O passo 4 do README (versões) está sendo cumprido.

**Maus cheiros (sempre juízo, nunca violação)**
- **S3. Possível Duplicated Code com divergência.** `admin-users/index.ts` refaz por conta própria a regra de admin (`role !== "admin" || !ativo`) e ignora a tabela legada `admins`, que `my_role()` aceita.
- **S4. Possível Duplicated Code.** A regra `case when collection = 'config' …` aparece 4 vezes em `004_usuarios_papeis.sql`.
- **S5. Possível Duplicated Code.** Os helpers `cors` e `json` estão copiados em duas Edge Functions e já divergem: uma usa `*` como origem e a outra usa `ALLOWED_ORIGIN`.
- **S6. Possível Duplicated Code.** Em `fonte/backend.js`, `agg` está definido duas vezes, o contador `x[k]=(x[k]||0)+1` se repete 4 vezes e a lógica de "primeiro snapshot" se repete 3 vezes.
- **S7. Possível Primitive Obsession / Repeated Switches.** O papel (`"admin"|"gerente"|"operador"`) é uma string solta, validada ou listada em 6 lugares: SQL, Edge Function, shim, `page.tsx` (lista de opções três vezes) e `Configuracoes.tsx`. Uma das listas oferece um papel **"Consultor"** que não existe.
- **S8. Possível Mysterious Name.** Em `backend.js`: `S`, `CUR`, `pc`, `r1`, `r2`, `brt`, `TIPOS0`, `opc`, `pl` e `cg`.
- **S9. Possível Speculative Generality / código morto.** `getToken()` e `withToken()` em `page.tsx` são herança do backend do CodeWords.
- **S10. Possível Divergent Change.** O commit `80201ef` mistura sincronização de dados, um recurso novo e uma correção de tela.

## Spec (faz o que foi pedido?)

**(a) Faltando ou parcial**
- **E1. Importar planilha de O.S. e de prestadores dá erro 404 ("não encontrado").** `POST /ordens/import` e `/prestadores/import` caem em `byId("import")`. Requisito 8: "Mesmas funções da versão de produção". *Conferido.*
- **E2. Rotas que respondem vazio:** `/frota/sincronizar-km` e `/relatorio` (Excel analítico).
- **E3. Resumo diário por e-mail (`/relatorio/diario`) não existe.** Especificação: "Resumo diário: GET /relatorio/diario". Também falta a importação da planilha do Google (`/prestadores/importar-planilha`).
- **E4. O cadastro da frota (`frota_placas`) não se atualiza.** Hoje são 889 placas importadas uma vez. `/sascar/veiculos` devolve lista vazia.

**(b) Feito sem ter sido pedido**
- **E5. Função de IA (`ai-insights` + `AI_ENDPOINT`).** Não existe na produção, não está na arquitetura e libera CORS para qualquer origem. Hoje está desligada.

**(c) Feito, mas aparentemente errado**
- **E6. Cancelamento sem aprovação.** Pela especificação, o cancelamento é em duas etapas e "um segundo admin deve aprovar". No código, qualquer gerente cancela na hora. *Conferido.*
- **E7. Permissões mais largas que a especificação.** "Bases e Controle de Peças: admin-only". Mas a política do banco libera para o gerente todas as coleções menos `config`: o gerente pode **excluir O.S., editar Bases e aprovar cancelamento**. O requisito 3, decidido pelo usuário, dá ao gerente **O.S., prestadores e peças**. Esta tarefa segue o requisito 3, que vale mais que a memória da produção.
- **E8. A leitura não depende de cadastro.** Qualquer conta autenticada lê tudo, mesmo fora da tabela `usuarios`. Hoje isso está contido porque o cadastro público está **desligado** (conferido em 16/11), mas não há segunda barreira.
- **E9. Leituras que gravam.** `GET /alerts` grava log, o que falha calado para o operador. `notificacoes/ler` responde 403 ao operador. `/relatorio/gerencial2` não exige papel (na produção exige gerente). *Conferido (alerts).*
- **E10. Comentário errado em `config.js`.** Diz que o banco decide pela "tabela admins", mas hoje quem decide é a `usuarios`.

**Resumo dos dois eixos:**
- **Standards:** 10 achados. O pior é **S1**, dado pessoal no repositório.
- **Spec:** 10 achados. O pior é **E7**, gerente com poder de admin no banco: exclui O.S., edita Bases e aprova cancelamentos.

---

## Auditoria visual de espaçamento (medida, fora dos eixos da Skill)

Medição automática em todas as abas e nas janelas Nova O.S., Novo Prestador, Novo Usuário e Editar, em três tamanhos de tela: 1920×1080, 1366×768 e celular (iPhone 13, 390 px). Nada foi salvo.

| # | Problema | Onde | Medida |
|---|---|---|---|
| V1 | Página com **rolagem lateral** (conteúdo mais largo que a tela) | Celular: Atendimento, O.S., Prestadores, Log, Usuários, Configurações e as 4 janelas. Notebook: O.S. e janela Nova O.S. | Largura de 520–643 px numa tela de 390 px |
| V2 | **Telefone vaza do cartão** de O.S. | Atendimento, notebook 1366 | 11 a 23 px para fora |
| V3 | **Cartões de O.S. apertados** em 4 colunas: placa e tempo cortados à direita | Atendimento, de 1366 a 1600 px | — |
| V4 | **Botões pequenos para o dedo** | Celular: Editar, Excluir, Salvar, Senha, Acionar, Liberar (28×28 / 24 px), setas ← → (23 px), fechar × (19 px), "Adicionar" em Bases (**16 px de altura**), botões "Avançar" (26 px) | Mínimo recomendado: 44 px no celular |
| V5 | **Botões flutuantes cobrindo conteúdo** (Exportar Excel, sino e Exportar) | Celular, todas as telas; no notebook cobrem a última linha das tabelas | — |
| V6 | **Ranking "Top filiais" desalinhado** (espaço de 8 px de um lado e 33–66 px do outro) | Atendimento | — |
| V7 | **Legenda da frota com espaçamento irregular** | Dashboard, Frota Sascar | — |
| V8 | **Tabela de Bases** sem espaço interno à esquerda e com o endereço espremido no celular | Bases | Vaza 73 px no celular |
| V9 | Espaçamentos escritos à mão em pixels soltos (2, 3, 5, 6, 7, 9, 10, 14…), sem escala comum | Código inteiro | — |

Capturas: `n1366-*.png`, `m390-*.png` e `d1920-*.png`, guardadas fora do repositório.

---

## Plano de tarefas

**Prioridade:** **P0** = segurança ou dado errado · **P1** = função quebrada ou tela ruim no dia a dia · **P2** = qualidade de código. Cada tarefa cita o achado que a originou.

### Etapa 1 — Segurança e permissões (P0)
| Tarefa | O quê | Origem | Pronto quando |
|---|---|---|---|
| T1 | Permissões por coleção no banco. **Admin:** bases, config, excluir O.S., aprovar cancelamento. **Gerente:** O.S. (criar e editar), prestadores, peças, acionamentos. **Operador:** nada. Uma função `kv_can_write(collection, acao)` substitui as 4 cópias. | E7, S4 | Teste no banco simulando cada papel (como o de 13/11) passa para todas as coleções |
| T2 | Cancelamento em duas etapas: o gerente **solicita** e o admin **aprova** em Cancelamentos. | E6 | Gerente não consegue cancelar sozinho; admin vê a solicitação e aprova |
| T3 | A leitura exige estar na tabela `usuarios` com `ativo = true` (segunda barreira, além do cadastro público desligado). | E8 | Conta do Auth sem cadastro em `usuarios` não lê nada |
| T4 | Tirar os nomes de `docs/AUDITORIA-2026-11-13.md` (trocar por papéis) e decidir se o histórico do Git também deve ser limpo. | S1 | Nenhum nome de pessoa no repositório |
| T5 | `admin-users` passa a usar `is_admin()` do banco. Um único helper de CORS restrito aos dois endereços do painel. Decidir se a função de IA fica (com CORS restrito) ou sai. | S3, S5, E5 | Uma regra de admin só; CORS sem `*` |

### Etapa 2 — Funções que faltam ou estão erradas (P1)
| Tarefa | O quê | Origem | Pronto quando |
|---|---|---|---|
| T6 | Importar O.S. e prestadores por planilha (.xlsx/.csv), lendo o arquivo no navegador, mostrando uma prévia e gravando sem duplicar (por CNPJ e por número de O.S.). | E1 | Planilha modelo importa sem erro e sem duplicar |
| T7 | `/relatorio` (Excel analítico) e `/frota/sincronizar-km`: implementar ou esconder os botões. | E2 | Nenhum botão responde "vazio" |
| T8 | Resumo diário por e-mail às 07:30 (função agendada no Supabase + envio de e-mail). **Precisa de decisão:** por qual serviço de e-mail enviar. | E3 | E-mail chega aos destinatários configurados |
| T9 | Atualização do cadastro da frota (`frota_placas`) a partir da Sascar, junto da sincronização a cada 2 min ou 1 vez por dia. | E4 | Placa nova da Sascar aparece com filial e modelo |
| T10 | Consultas não gravam mais nada. Os alertas de SLA passam a ser gravados pelo servidor (agendamento). O relatório gerencial exige gerente ou admin. Operador não recebe 403 ao marcar notificação como lida. | E9 | Operador navega sem erro; o log de SLA continua sendo gerado |

### Etapa 3 — Espaçamento e telas (P1)
| Tarefa | O quê | Origem | Pronto quando |
|---|---|---|---|
| T11 | **Escala de espaçamento única** (4, 8, 12, 16, 24, 32 px) em variáveis CSS, aplicada a cartões, tabelas, janelas e grades. | V9 | Nenhum espaçamento fora da escala nas telas tocadas |
| T12 | Tabelas (O.S., Prestadores, Log, Usuários, Bases, Configurações) dentro de uma caixa com rolagem própria. No celular, as tabelas principais viram lista de cartões. | V1, V8 | Nenhuma tela com rolagem lateral em 390, 768, 1366 e 1920 px |
| T13 | Grade do Atendimento responsiva: 1 coluna no celular, 2 no tablet, 3 até 1600 px, 4 acima. Telefone e e-mail com quebra ou reticências dentro do cartão. | V2, V3 | Nada vaza nem é cortado no cartão de O.S. em nenhum tamanho |
| T14 | Janelas (Nova O.S., Editar, Novo Prestador, Novo Usuário) com largura máxima de 100 % menos as margens; os campos em 2 colunas viram 1 coluna no celular. | V1 | Janela sem rolagem lateral no notebook e no celular |
| T15 | Tamanho mínimo de botões: 36 px no computador e 44 px no celular. Corrigir o "Adicionar" de Bases (16 px de altura). | V4 | A medição não acusa nenhum alvo pequeno |
| T16 | Botões flutuantes: no celular, juntar Exportar Excel, sino e Exportar num único botão de menu. Espaço reservado no fim das telas para não cobrir conteúdo. | V5 | Última linha de cada tela visível e clicável |
| T17 | Ranking "Top filiais" e legenda da frota em grade fixa (posição, nome e número alinhados). | V6, V7 | Espaços iguais em toda a fileira |
| T18 | Teste automático de layout (o mesmo desta auditoria) rodando no GitHub a cada versão, nos 3 tamanhos de tela. | V1–V8 | A versão não sai se aparecer rolagem lateral, item vazando ou botão pequeno |

### Etapa 4 — Qualidade de código (P2)
| Tarefa | O quê | Origem |
|---|---|---|
| T19 | Um único mapa de papéis (nome, rótulo e permissões) usado pelo shim, pelas telas e pelas Configurações. Remover a opção "Consultor". | S7 |
| T20 | Remover `getToken()` e `withToken()`. Corrigir o comentário do `config.js`. | S9, E10 |
| T21 | `backend.js`: um só `agg`, um helper de contagem, um helper de "primeiro snapshot" e nomes claros no lugar de `S`, `pc`, `r1`… | S6, S8 |
| T22 | README e ARQUITETURA citando a Vercel (publicação automática) e os dois endereços. | S2 |
| T23 | Uma versão por assunto (segurança, função, tela) no CHANGELOG e nos commits. | S10 |

### Ordem sugerida de versões
- **v1.5.0:** T1–T5 (segurança)
- **v1.6.0:** T11–T18 (espaçamento e telas)
- **v1.7.0:** T6, T7, T9, T10 (funções)
- **v1.8.0:** T8 (e-mail diário), depois da decisão do serviço de e-mail
- **T19–T23** entram junto, conforme cada arquivo for tocado

**Decisões pendentes do responsável:**
1. **T4:** limpar ou não o histórico do Git.
2. **T5:** manter ou remover a função de IA.
3. **T8:** serviço de envio de e-mail.
