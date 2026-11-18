// Mapa único de papéis do painel (rótulo, descrição e abas visíveis).
// Usado pelo menu lateral, pelas listas de "Nível de acesso" (page.tsx) e pelas Configurações.
// O que cada papel pode gravar fica em lib/permissoes.js (espelho do banco); este arquivo re-exporta podeEditar/ehAdmin.
import { papelValido as papelValidoJs, podeEditar, ehAdmin } from "./permissoes.js";
export { podeEditar, ehAdmin };

export type Papel = "admin" | "gerente" | "operador";

export const PAPEIS: Record<Papel, { rotulo: string; descricao: string; abas: "todas" | readonly string[] }> = {
  operador: { rotulo: "Operador", descricao: "consulta", abas: ["dashboard", "atendimento", "acompanhamento", "ordens"] },
  gerente: { rotulo: "Gerente", descricao: "edita", abas: ["dashboard", "atendimento", "acompanhamento", "prestadores", "pecas", "ordens", "log", "cancelamentos"] },
  admin: { rotulo: "Admin", descricao: "total", abas: "todas" },
};

/** Ordem em que os papéis aparecem nas listas de opções. */
export const ORDEM_PAPEIS: Papel[] = ["operador", "gerente", "admin"];

/** Papel conhecido ou "operador" (o menor acesso) para qualquer valor estranho. */
export function papelValido(r: unknown): Papel {
  return papelValidoJs(r) as Papel;
}

export function rotuloPapel(r: unknown): string {
  return PAPEIS[papelValido(r)].rotulo;
}

/** Opções para <select>: { v: "gerente", l: "Gerente (edita)" }. */
export const OPCOES_PAPEL = ORDEM_PAPEIS.map(id => ({ v: id, l: `${PAPEIS[id].rotulo} (${PAPEIS[id].descricao})` }));

/** A aba pode ser vista por este papel? */
export function papelVeAba(r: unknown, aba: string): boolean {
  const abas = PAPEIS[papelValido(r)].abas;
  return abas === "todas" || abas.includes(aba);
}
