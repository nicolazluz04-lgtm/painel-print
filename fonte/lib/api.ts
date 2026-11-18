// Chamada única às rotas do painel ("/api/..." é atendido pelo backend.js dentro da página).
// Toda alteração (POST/PUT/DELETE) recusada vira um aviso na tela (evento EVENTO_ERRO, mostrado pelo page.tsx),
// em vez de falhar calada. Consultas (GET) com erro só devolvem {}.

export const EVENTO_ERRO = "painel:erro-gravacao";

export function avisarErro(mensagem: string) {
  try { window.dispatchEvent(new CustomEvent(EVENTO_ERRO, { detail: { mensagem } })); } catch { /* sem janela */ }
}

export async function api(url: string, init?: RequestInit): Promise<any> {
  const alteracao = ((init && init.method) || "GET").toUpperCase() !== "GET";
  try {
    const r = await fetch(`/api${url}`, { headers: { "Content-Type": "application/json" }, ...init });
    const txt = await r.text();
    let j: any = {};
    try { j = txt ? JSON.parse(txt) : {}; } catch { j = {}; }
    if (!r.ok && alteracao) avisarErro(j && j.detail ? String(j.detail) : `Não foi possível salvar (erro ${r.status}).`);
    return j;
  } catch {
    if (alteracao) avisarErro("Não foi possível salvar: sem conexão com o painel.");
    return {};
  }
}
