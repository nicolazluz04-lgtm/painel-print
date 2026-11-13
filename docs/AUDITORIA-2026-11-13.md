# Auditoria do Painel Print

**Data:** 13/11/2026
**Site:** https://nicolazluz04-lgtm.github.io/painel-print/
**Escopo:** as 10 telas do painel (com login de administrador), no computador (1920×1080) e no celular (iPhone 13), mais as permissões do banco de dados.
**Método:** teste automático no navegador (Chromium), captura de cada tela, leitura dos erros do console e de rede, medição de imagens e de rolagem lateral, e simulação de acesso por papel no banco. Nenhum dado real foi alterado. O teste de permissões rodou numa transação desfeita no final, e confirmei que não ficou resíduo.

---

## 1. Resultado geral

| Item | Antes | Depois |
|---|---|---|
| Erros de JavaScript | 2 (biblioteca de ícones quebrada) | **0** |
| Ícones (menu, indicadores, botões) | nenhum aparecia (quadrados vazios) | **todos aparecem** |
| Mapas (Cobertura, Atendimento, Frota) | fundo azul liso, sem satélite | **satélite com nomes de cidades e ruas** |
| Frota Sascar | aviso "Sem conexão com o CodeWords" | **501 veículos, atualização a cada 2 min** |
| Usuários do painel | 1 usuário genérico "admin@print" | **5 usuários reais com papéis** |
| Nome no topo do menu | "Administrador" (fixo) | **nome real do usuário logado** |
| Botões no canto inferior direito | 4 botões e um aviso sobrepostos | **separados, sem sobreposição** |
| Botões "Sair" e "Trocar senha" | cobriam o "Sair" da barra lateral | **dentro da barra lateral** |
| Celular | barra lateral cobria a tela | **começa recolhida; sem rolagem lateral** |
| Datas na tabela de O.S. | "2026-11-04", quebrando em 2 linhas | **04/11/2026**, em uma linha |
| Valores | "R$ 0.00", quebrando linha | **R$ 0,00** |
| Coluna "Serviço" | vazia | **tipo do serviço (Mecânico etc.)** |
| Modelo de planilha de prestadores | baixado do CodeWords | **servido pelo próprio site** |

## 2. Problemas encontrados e corrigidos

1. **Ícones sumidos (todas as telas).** O adaptador procurava a biblioteca de ícones com o nome errado (`lucideReact` em vez de `LucideReact`), e a biblioteca não encontrava o React. Corrigi os dois.
2. **Mapas sem imagem.** Uma regra de estilo genérica (`img{max-width:100%}`) espremia as imagens do mapa até a largura zero. Corrigi a regra e liguei o satélite ao vivo da Esri, com zoom até nível de rua no Brasil inteiro. As imagens embutidas ficam como reserva, caso o satélite ao vivo não carregue.
3. **Dependência do CodeWords.** A frota e o mapa ainda tentavam usar o CodeWords. Agora a frota vem do servidor (Supabase), que busca direto na Sascar. Não sobrou nenhuma referência ao CodeWords no site.
4. **Usuários e papéis.** Antes, todo mundo logado era "Administrador", e as O.S. eram registradas como "Administrador". Agora:
   - quem cria ou altera O.S. fica registrado pelo e-mail real;
   - a tela **Usuários** lista as pessoas reais e permite criar, editar, trocar papel, definir senha e remover;
   - a gestão de usuários roda numa função segura no servidor, que só aceita administradores.
5. **Senha fixa "[senha padrão antiga]".** O botão "Senha" em Configurações redefinia qualquer usuário para uma senha fixa padrão. Troquei por: o administrador digita a nova senha, com mínimo de 8 caracteres.
6. **Sobreposição de botões.** "Exportar Excel" e o sino de notificações subiram uma linha. O botão "IA" só aparece quando houver IA configurada, o que hoje não é o caso.
7. **Celular.** A barra lateral abria cobrindo a tela. Agora começa recolhida (só ícones) em telas pequenas.
8. **Formatação.** Datas no padrão brasileiro, valores em R$ com vírgula, sem quebra de linha nas colunas de data e valor.

## 3. Usuários cadastrados (marcados por papel)

| Pessoa | Papel | Situação |
|---|---|---|
| Nicolas Luz (pessoal) | Admin | Ativo (é você) |
| Nicolas Luz (corporativo) | Admin | Sem senha |
| Marcos Camargo | Gerente | Sem senha |
| Julia Santos | Gerente | Sem senha |
| Isadorah Barbosa | Gerente | Sem senha |

Os papéis vieram do campo "perfil" das O.S. que cada pessoa criou no sistema antigo, e você os confirmou.

**O que cada papel pode fazer:**
- **Admin:** tudo, incluindo Usuários, Configurações, Bases e Cancelamentos.
- **Gerente:** Dashboard, Atendimento, O.S., Prestadores, Controle de Peças e Log. Cria e edita, mas não mexe em Usuários nem em Configurações.
- **Operador:** só consulta (Dashboard, Atendimento e O.S.).

**Para liberar o acesso de alguém:** vá em Usuários, clique no lápis (Editar), digite uma senha e salve. Passe a senha para a pessoa por um canal seguro, de preferência pessoalmente ou por telefone, e peça que ela clique em **Trocar senha** no primeiro acesso.

## 4. Teste de permissões (no banco, simulando cada papel)

| Quem | Criar O.S. | Alterar Configurações | Virar admin sozinho |
|---|---|---|---|
| Gerente | Permitido | **Bloqueado** | **Bloqueado** |
| Operador | **Bloqueado** | **Bloqueado** | **Bloqueado** |
| Admin | Permitido | Permitido | (já é admin) |
| Sem login | — | — | Ler dados: **Bloqueado** |

As regras valem no próprio banco. Mesmo que alguém altere o site no navegador, não consegue passar delas.

## 5. Verificador de segurança do Supabase

| Aviso | Avaliação |
|---|---|
| `my_role`, `is_admin` e `can_edit` executáveis por usuários logados | **Esperado.** Cada uma responde só sobre o próprio usuário que pergunta. |
| Tabela `admins` sem políticas | **Esperado.** Ninguém acessa essa tabela pela internet. |
| Tabelas `os_ordens`, `os_eventos`, `os_listas` e `os_usuarios`, e a função `os_proximo_numero` | **Não foram criadas por mim.** Estão trancadas (sem acesso pela internet). Recomendo descobrir de onde vieram e apagar se não forem usadas. |
| `pg_net` no esquema público | Baixo risco. Mover exige reinstalar a extensão. |
| Proteção contra senhas vazadas desligada | **Recomendo ligar:** Supabase → Authentication → Sign In / Providers → Email → *Prevent use of leaked passwords*. |

## 6. Pendências e recomendações

1. **Troque a senha temporária** (botão **Trocar senha**, no fim da barra lateral) e apague o arquivo da senha.
2. **Libere o acesso dos gerentes** pela tela Usuários (item 3).
3. **Ligue a proteção contra senhas vazadas** (item 5).
4. **Aviso inofensivo no console:** o carregador de estilos (Tailwind) tenta buscar um arquivo chamado `tailwindcss` e recebe 404. Os estilos funcionam normalmente. Corrigir isso exige trocar o carregador de estilos por um build próprio, o que deixei para depois.
5. **Botão IA:** fica escondido até você configurar uma chave da Anthropic, porque é opcional e tem custo por uso.
6. **Dados antigos:** O.S. antigas mostram "↻ Administrador" como "atualizado por", porque foi assim que o sistema anterior gravou. As O.S. novas registram o e-mail real.
7. **Frota de outra empresa:** para aparecer no painel, o dono da frota precisa pedir à Sascar um acesso SasIntegra e autorizar o uso.
