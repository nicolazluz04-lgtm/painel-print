import { getState, callRoute } from "./backend.js";

const num = v => Number(v) || 0;
const ts = o => { const t = Date.parse(o.abertura || ""); return isNaN(t) ? 0 : t; };

export function calcInsights() {
  const S = getState(); const ords = (S.ordens || []).filter(o => !o.cancelado);
  const agora = Date.now();
  const ultimas = [...ords].sort((a, b) => ts(b) - ts(a)).slice(0, 10).map(o => ({
    os: o.os, placa: o.placa, modelo: o.modelo || "", defeito: [o.grupo_os, o.item_defeito, o.falha].filter(Boolean).join(" > "),
    prestador: o.prestador_nome || "", valor: num(o.valor), status: o.fechamento ? "Fechada" : (o.status || "Aberta"), abertura: o.abertura || "",
  }));
  const pl = {};
  ords.forEach(o => { const p = String(o.placa || "").toUpperCase(); if (!p) return; const d = (pl[p] = pl[p] || { placa: p, qtd: 0, custo: 0, modelo: o.modelo || "", defeitos: {}, ultima: 0 });
    d.qtd++; d.custo += num(o.valor); d.ultima = Math.max(d.ultima, ts(o)); const f = [o.grupo_os, o.item_defeito].filter(Boolean).join(" > "); if (f) d.defeitos[f] = (d.defeitos[f] || 0) + 1; });
  const recorrentes = Object.values(pl).filter(d => d.qtd >= 2).sort((a, b) => b.qtd - a.qtd || b.custo - a.custo).slice(0, 10).map(d => ({
    placa: d.placa, modelo: d.modelo, qtd: d.qtd, custo: d.custo, dias_desde_ultima: d.ultima ? Math.round((agora - d.ultima) / 864e5) : null,
    defeito_mais_comum: (Object.entries(d.defeitos).sort((a, b) => b[1] - a[1])[0] || ["—"])[0],
  }));
  const pr = {}; ords.forEach(o => { const n = o.prestador_nome || "Sem prestador"; const d = (pr[n] = pr[n] || { nome: n, qtd: 0, custo: 0 }); d.qtd++; d.custo += num(o.valor); });
  const custoPrest = Object.values(pr).sort((a, b) => b.custo - a.custo).slice(0, 10);
  const gr = {}; ords.forEach(o => { const g = o.grupo_os || "Sem grupo"; const d = (gr[g] = gr[g] || { grupo: g, qtd: 0, custo: 0 }); d.qtd++; d.custo += num(o.valor); });
  const porGrupo = Object.values(gr).sort((a, b) => b.qtd - a.qtd);
  const abertas = ords.filter(o => !o.fechamento);
  const paradas = abertas.map(o => ({ os: o.os, placa: o.placa, horas: ts(o) ? Math.round((agora - ts(o)) / 36e5) : 0, prestador: o.prestador_nome || "sem prestador", status: o.status || "" })).sort((a, b) => b.horas - a.horas).slice(0, 10);
  let desvios = [];
  try { desvios = ((callRoute("/stats/orcado") || {}).por_prestador || []).filter(r => r.desvio_pct > 10).slice(0, 5).map(r => ({ nome: r.nome, desvio_pct: r.desvio_pct, orcado: r.orcado, realizado: r.realizado })); } catch (e) {}
  return { totalOS: ords.length, abertas: abertas.length, custoTotal: ords.reduce((t, o) => t + num(o.valor), 0), ultimas, recorrentes, custoPrest, porGrupo, paradas, desvios };
}

export async function pedirIA(ins, pergunta) {
  const sample = await window.claude.use("sample");
  if (!sample) throw { code: "unavailable" };
  const dados = JSON.stringify({ ...ins, ultimas: ins.ultimas.slice(0, 8), paradas: ins.paradas.slice(0, 8) });
  const prompt = "Você é analista de operações de socorro mecânico (frota de caminhões, Brasil). Com base APENAS nos dados JSON abaixo, responda em português, direto e prático. " +
    (pergunta ? "Pergunta do gestor: " + pergunta + "\n" : "") +
    "Devolva SOMENTE JSON no formato {\"resumo\":\"2 frases\",\"alertas\":[{\"titulo\":\"\",\"motivo\":\"\",\"acao\":\"\",\"prioridade\":\"alta|media|baixa\"}],\"vigiar\":[{\"placa\":\"\",\"motivo\":\"\",\"acao\":\"\"}],\"melhorias\":[\"\"]}. " +
    "Máx. 5 alertas (pendências a resolver: O.S. paradas, desvios de orçamento, prestadores caros), máx. 5 placas para vigiar (recorrência de defeito), máx. 4 melhorias. Cada ação deve ser um passo concreto. Não invente dados.\nDADOS:\n" + dados;
  return sample.json(prompt, { modelTier: "default", cache: false });
}
