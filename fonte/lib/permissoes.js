// O que cada papel pode fazer no painel. Fonte única para as telas e para o backend.js.
// Espelho de public.kv_can_write em supabase/migrations/005_permissoes_por_papel.sql:
// o banco é quem decide de verdade; aqui só evitamos mostrar/tentar o que o banco vai recusar.
// Se mudar uma regra aqui, mude também na 005 (e vice-versa).

export const PAPEIS_VALIDOS = ["admin", "gerente", "operador"];

/** Papel conhecido ou "operador" (o menor acesso) para qualquer valor estranho. */
export function papelValido(r) {
  return PAPEIS_VALIDOS.includes(r) ? r : "operador";
}

/** Admin ou gerente: edita a operação (O.S., prestadores, peças…). */
export function podeEditar(r) {
  const p = papelValido(r);
  return p === "admin" || p === "gerente";
}

/** Só admin: Bases, Configurações, Usuários, excluir O.S., aprovar cancelamento. */
export function ehAdmin(r) {
  return papelValido(r) === "admin";
}

const TODAS = ["insert", "update", "delete"];
export const ESCRITA_GERENTE = {
  ordens: ["insert", "update"],            // excluir O.S.: só admin
  prestadores: TODAS,
  pecas_envio: TODAS,
  acionamentos: TODAS,
  ocorrencias: ["insert", "update"],
  notificacoes: ["insert", "update"],      // marcar como lida
  log: ["insert"],                         // o log só cresce
};

/** O papel pode fazer `acao` ("insert" | "update" | "delete") na coleção? */
export function papelPodeGravar(r, colecao, acao) {
  const p = papelValido(r);
  if (p === "admin") return true;
  if (p === "gerente") return (ESCRITA_GERENTE[colecao] || []).includes(acao);
  return false;
}
