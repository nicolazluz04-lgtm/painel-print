// Backend do painel rodando dentro da página. Intercepta fetch("/api/...") e responde
// com a mesma lógica das rotas do serviço original, guardando os dados no banco da página.
const COLS = ["prestadores", "ordens", "bases", "acionamentos", "pecas_envio", "log", "ocorrencias", "notificacoes"];
const S = { prestadores: [], ordens: [], bases: [], acionamentos: [], pecas_envio: [], log: [], ocorrencias: [], notificacoes: [], frota: [], config: {} };
const DEF_CONFIG = { escalonamento_gerencia_h: 4, escalonamento_supervisor_h: 2, mostrar_bases: true, mostrar_oficinas: true, raio_km: 100, resumo_ativo: false, resumo_emails: "", resumo_horario: "07:30", sascar_intervalo_min: 5 };
let DB = null;
let ROLE = "operador";
let CUR = { email: "", nome: "", role: "operador" };
export function setRole(r) { ROLE = r; }
export function setUser(u) { CUR = u || CUR; ROLE = CUR.role || "operador"; }
const QUEM = () => CUR.email || CUR.nome || "Usuário";
export const getState = () => S;
export const callRoute = (path) => route("GET", path, {}, null).b;

// ── tempo (Brasília) ──
const TZ = "America/Sao_Paulo";
const pad = (n, l = 2) => String(n).padStart(l, "0");
function brt(d = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }).formatToParts(d).map(x => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}.${pad(d.getMilliseconds(), 3)}000-03:00`;
}
const now = () => brt();
const today = (d = new Date()) => brt(d).slice(0, 10);
function parseDt(s) {
  if (!s) return null;
  const str = /[zZ]$|[+-]\d\d:?\d\d$/.test(String(s)) ? String(s) : String(s) + "-03:00";
  const d = new Date(str);
  return isNaN(d) ? null : d;
}
const r1 = x => Math.round(x * 10) / 10;
const r2 = x => Math.round(x * 100) / 100;
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : "id" + Math.random().toString(16).slice(2) + Date.now());

const FECHAMENTO = new Set(["Liberado", "Concluído", "Rebocado", "Veículo liberado", "O.S. fechada"]);
const STATUS_LABELS = { "Aguardando": "O.S. criada · aguardando", "Prestador localizado": "Prestador localizado", "Prestador a caminho": "Prestador a caminho", "Prestador no local": "Prestador no local", "Serviço em execução": "Serviço em execução", "Em atendimento": "Serviço em execução", "Veículo liberado": "Veículo liberado", "Liberado": "Veículo liberado", "O.S. fechada": "O.S. fechada", "Concluído": "O.S. fechada", "Rebocado": "Veículo rebocado", "Cancelada": "O.S. cancelada" };
const aberta = o => !!o.abertura && !o.fechamento && !o.cancelado;
const pc = v => String(v || "").trim().toLowerCase().replace(/(^|[^a-zà-ÿ])([a-zà-ÿ])/g, (m, a, b) => a + b.toUpperCase());
const normPlaca = v => String(v || "").trim().toUpperCase();

// ── persistência ──
function put(col, obj) {
  const i = S[col].findIndex(x => x.id === obj.id);
  if (i >= 0) { if (!obj._k && S[col][i]._k) obj._k = S[col][i]._k; S[col][i] = obj; } else S[col].unshift(obj);
  if (DB) { const { _k, ...clean } = obj; DB.collection(col).doc(_k || obj.id).set(clean).catch(() => {}); }
  return obj;
}
function del(col, id) {
  const x = S[col].find(i => i.id === id);
  S[col] = S[col].filter(i => i.id !== id);
  if (DB) DB.collection(col).doc((x && x._k) || id).delete().catch(() => {});
}
function saveConfig() { if (DB) DB.collection("config").doc("main").set(S.config).catch(() => {}); }
function addLog(evento, os, detalhe, quem = "Sistema") {
  put("log", { id: uid(), evento, os, detalhe, quem, created_at: now() });
}
const byId = id => S.ordens.find(o => o.id === id);

let readyRes; const ready = new Promise(r => { readyRes = r; });
export function startBackend(db) {
  DB = db;
  if (!db) { readyRes(); return; }
  let pending = COLS.length + 3; const done = () => { if (--pending <= 0) readyRes(); };
  setTimeout(readyRes, 8000);
  COLS.forEach(c => { let first = true; db.collection(c).onSnapshot(s => { S[c] = s.docs.map(d => ({ id: d.id, ...d.data(), _k: d.id })); if (first) { first = false; done(); } }, () => { if (first) { first = false; done(); } }); });
  let f1 = true; db.collection("frota_placas").onSnapshot(s => { S.frota = s.docs.flatMap(d => d.data().items || []); if (f1) { f1 = false; done(); } }, () => { if (f1) { f1 = false; done(); } });
  let f2 = true; db.collection("config").onSnapshot(s => { const d = s.docs.find(x => x.id === "main"); S.config = d ? d.data() : {}; if (f2) { f2 = false; done(); } }, () => { if (f2) { f2 = false; done(); } });
  db.collection("sascar_pos").onSnapshot(sn => { const d = sn.docs.find(x => x.id === "main"); S.sascar = d ? d.data() : { data: {} }; }, () => {});
  done();
}

// ── cálculos ──
const TIPOS0 = () => ({ mecanico: 0, eletrico: 0, eletronica: 0, eletrica_mecanica: 0, borracharia: 0, guincho: 0, pneus: 0, freio: 0, combustivel: 0, outros: 0 });
function stats() {
  const P = S.prestadores, A = S.acionamentos, O = S.ordens;
  const tp = TIPOS0(), ta = TIPOS0();
  P.forEach(p => { const t = p.tipo_servico || "mecanico"; if (t in tp) tp[t]++; });
  O.forEach(o => { const t = o.tipo_servico || "mecanico"; if (t in ta) ta[t]++; });
  const pcnt = {};
  O.forEach(o => { const n = o.prestador_nome || "Sem prestador"; const id = n !== "Sem prestador" ? (o.prestador_id || "") : "sem-prestador"; (pcnt[n] = pcnt[n] || { id, nome: n, count: 0 }).count++; });
  const top = Object.values(pcnt).sort((a, b) => b.count - a.count).slice(0, 10);
  const total = O.length, val = o => Number(o.valor) || 0;
  const opc = {}; O.forEach(o => { const k = o.operacao || "Sem operação"; opc[k] = (opc[k] || 0) + 1; });
  const pl = {}; O.forEach(o => { const k = o.placa || o.veiculo || "Sem placa"; pl[k] = (pl[k] || 0) + 1; });
  const recor = Object.values(pl).filter(c => c > 1).length;
  const marca = {}; O.forEach(o => { const m = o.marca || "Sem marca"; (marca[m] = marca[m] || { count: 0, custo: 0 }); marca[m].count++; marca[m].custo += val(o); });
  const custo_por_marca = Object.fromEntries(Object.entries(marca).map(([m, d]) => [m, { count: d.count, custo_medio: d.count ? r2(d.custo / d.count) : 0 }]));
  const slas = O.map(o => o.sla_minutos).filter(x => x !== null && x !== undefined);
  const fechadas = O.filter(o => o.fechamento);
  const nowD = new Date(), hoje = today(), ontem = today(new Date(nowD.getTime() - 864e5));
  let atrasados = 0; const paradas = [];
  O.filter(aberta).forEach(o => {
    const a = parseDt(o.abertura); if (a && (nowD - a) / 1000 > 7200) atrasados++;
    const ref = parseDt(o.ultima_atualizacao || o.abertura); if (ref && (nowD - ref) / 1000 > 7200) paradas.push({ os: o.os, placa: o.placa, status: o.status, minutos: Math.round((nowD - ref) / 60000) });
  });
  paradas.sort((a, b) => b.minutos - a.minutos);
  const dentro = l => l.filter(o => (o.sla_minutos || 999) <= 120).length;
  const rpm = fechadas.length ? r1(dentro(fechadas) / fechadas.length * 100) : 0;
  const segName = o => { const s = String(o.segmento || "").trim().toLowerCase(); return s === "privado" || s === "correios" ? s : "privado"; };
  const seg = {};
  ["privado", "correios"].forEach(n => {
    const sub = O.filter(o => segName(o) === n), fe = sub.filter(o => o.fechamento), din = dentro(fe);
    const m = {}; sub.forEach(o => { const k = o.prestador_nome || "Sem prestador"; (m[k] = m[k] || { nome: k, count: 0, custo: 0 }); m[k].count++; m[k].custo += val(o); });
    const vals = Object.values(m), mc = vals.length ? vals.reduce((a, b) => (b.custo > a.custo ? b : a)) : { nome: "", custo: 0 };
    seg[n] = { total: sub.length, fechadas: fe.length, dentro_prazo: din, atrasadas: fe.filter(o => (o.sla_minutos || 999) > 120).length, em_aberto: sub.filter(o => !o.fechamento && !o.cancelado).length, rpm: fe.length ? r1(din / fe.length * 100) : 0, mais_acionadas: vals.sort((a, b) => b.count - a.count).slice(0, 5), maior_custo: { nome: mc.nome, valor: r2(mc.custo) } };
  });
  const cg = {}; O.forEach(o => { const k = o.prestador_nome || "Sem prestador"; cg[k] = (cg[k] || 0) + val(o); });
  const maiorG = Object.entries(cg).sort((a, b) => b[1] - a[1])[0];
  seg.geral = { total, fechadas: fechadas.length, dentro_prazo: dentro(fechadas), atrasadas: fechadas.filter(o => (o.sla_minutos || 999) > 120).length, em_aberto: O.filter(aberta).length, rpm, mais_acionadas: top, maior_custo: maiorG ? { nome: maiorG[0], valor: r2(maiorG[1]) } : { nome: "", valor: 0 } };
  const pag = { a_vista: { count: 0, valor: 0 }, faturado: { count: 0, valor: 0 }, nao_informado: { count: 0, valor: 0 } };
  const AV = ["a_vista", "à vista", "a vista", "avista"];
  O.forEach(o => { const fp = String(o.forma_pagamento || "").trim().toLowerCase(); const k = AV.includes(fp) ? "a_vista" : fp === "faturado" ? "faturado" : "nao_informado"; pag[k].count++; pag[k].valor += val(o); });
  Object.values(pag).forEach(x => { x.valor = r2(x.valor); });
  const dia = o => String(o.data || "").slice(0, 10);
  const hEnt = O.filter(o => dia(o) === hoje).length, oEnt = O.filter(o => dia(o) === ontem).length;
  const hFec = O.filter(o => o.fechamento && String(o.fechamento).slice(0, 10) === hoje).length, oFec = O.filter(o => o.fechamento && String(o.fechamento).slice(0, 10) === ontem).length;
  const por_status = {}; O.forEach(o => { const k = o.status || "Sem status"; por_status[k] = (por_status[k] || 0) + 1; });
  const soma = (l, f) => r2(l.filter(f).reduce((s, o) => s + val(o), 0));
  return {
    total_prestadores: P.length, disponiveis_24h: P.filter(p => p.socorro_24h).length, com_faturamento: P.filter(p => p.fatura).length, total_acionamentos: A.length,
    tipo_prestadores: tp, acionamento_por_tipo: ta, top_prestadores: top, total_ordens: total, valor_total: O.reduce((s, o) => s + val(o), 0),
    veiculos_unicos: new Set(O.map(o => o.veiculo || o.placa).filter(Boolean)).size, servicos_total: O.filter(o => o.servico_realizado).length,
    operacao_count: opc, taxa_repetibilidade: total ? r1(recor / total * 100) : 0, custo_por_marca, sla_medio: slas.length ? r1(slas.reduce((a, b) => a + b, 0) / slas.length) : 0,
    ordens_fechadas: fechadas.length, socorros_hoje: O.filter(o => String(o.created_at || "").startsWith(hoje) || o.data === hoje).length, em_aberto: O.filter(aberta).length,
    atrasados, liberados: O.filter(o => ["Liberado", "Veículo liberado"].includes(o.status)).length, rebocados: O.filter(o => ["Rebocado", "Reboque", "Veículo rebocado"].includes(o.status)).length,
    rpm, indicadores_segmento: seg, pagamento: pag, paradas,
    resumo: { por_status, hoje: { entraram: hEnt, fecharam: hFec, avista_valor: soma(O, o => AV.includes(o.forma_pagamento || "") && dia(o) === hoje), faturado_valor: soma(O, o => (o.forma_pagamento || "") === "faturado" && dia(o) === hoje) }, ontem: { entraram: oEnt, fecharam: oFec }, tendencia_entraram: hEnt - oEnt, tendencia_fecharam: hFec - oFec },
  };
}
function alerts() {
  const nowD = new Date(), out = [];
  S.ordens.filter(aberta).forEach(o => {
    const a = parseDt(o.abertura); if (!a) return;
    const min = r1((nowD - a) / 60000);
    if (min > 60) {
      out.push({ ...o, minutos_aberto: min });
      if (!S.log.some(e => e.evento === "SLA_ALERTA_60MIN" && e.os === o.os)) addLog("SLA_ALERTA_60MIN", o.os, `O.S. aberta há ${Math.floor(min)} min`, "Sistema");
    }
  });
  return { data: out, total: out.length };
}
const nextOs = () => String(S.ordens.reduce((m, o) => Math.max(m, parseInt(o.os, 10) || 0), 0) + 1).padStart(6, "0");

// ── rotas ──
function route(method, path, q, body) {
  const seg = path.split("/").filter(Boolean), [a, b, c, d] = seg;
  const ok = data => ({ s: 200, b: data }), fail = (s, detail) => ({ s, b: { detail } });
  if (a === "prestadores") {
    if (!b) {
      if (method === "GET") return ok({ data: S.prestadores, total: S.prestadores.length });
      if (method === "POST") return ok({ success: true, data: put("prestadores", { ...body, id: uid(), created_at: now() }) });
    } else {
      const p = S.prestadores.find(x => x.id === b); if (!p) return fail(404, "Prestador não encontrado");
      if (method === "PUT") return ok({ success: true, data: put("prestadores", { ...p, ...body, id: b }) });
      if (method === "DELETE") { del("prestadores", b); return ok({ success: true }); }
      if (method === "GET") return ok({ data: p });
    }
  }
  if (a === "acionamentos") {
    if (method === "GET") return ok({ data: S.acionamentos, total: S.acionamentos.length });
    if (method === "POST") { const p = S.prestadores.find(x => x.id === body.prestador_id); return ok({ success: true, data: put("acionamentos", { ...body, prestador_nome: p ? p.nome : body.prestador_nome || "", id: uid() }) }); }
    if (method === "DELETE") { del("acionamentos", b); return ok({ success: true }); }
  }
  if (a === "ordens") {
    if (!b) {
      if (method === "GET") { const pm = Object.fromEntries(S.prestadores.map(p => [p.id, p.nome])); const items = S.ordens.map(o => (!o.prestador_nome && o.prestador_id ? { ...o, prestador_nome: pm[o.prestador_id] || "" } : o)).sort((x, y) => String(y.created_at || "").localeCompare(String(x.created_at || ""))); return ok({ data: items, total: items.length }); }
      if (method === "POST") {
        const o = { ...body, id: uid(), created_at: now(), abertura: now() };
        o.os = o.os && String(o.os).trim() ? (String(o.os).trim().replace(/^0+/, "") || "0") : nextOs();
        ["motorista", "operador", "modelo", "marca", "rodovia", "localizacao"].forEach(k => { o[k] = pc(o[k]); });
        o.placa = normPlaca(o.placa); o.data = o.data || today();
        if (!o.veiculo) o.veiculo = [o.marca, o.modelo, o.placa].filter(Boolean).join(" ").trim();
        if (o.prestador_id) { const p = S.prestadores.find(x => x.id === o.prestador_id); o.prestador_nome = p ? p.nome : ""; }
        o.criado_por = QUEM(); o.criado_login = CUR.email; o.criado_perfil = ROLE;
        o.historico = [{ hora: now(), etapa: "OS_CRIADA", quem: o.criado_por }];
        put("ordens", o); addLog("OS_CRIADA", o.os, `O.S. ${o.os} criada`, o.criado_por);
        return ok({ success: true, data: o });
      }
    } else if (b === "cancelamentos" && c === "pendentes") {
      const l = S.ordens.filter(o => o.cancelamento_solicitado && !o.cancelado); return ok({ data: l, total: l.length });
    } else {
      const it = byId(b); if (!it) return fail(404, "Ordem não encontrada");
      if (!c && method === "PUT") {
        const upd = body || {}, o = { ...it, ...upd };
        ["motorista", "operador", "modelo", "marca", "rodovia", "localizacao"].forEach(k => { if (k in upd && upd[k]) o[k] = pc(upd[k]); });
        if (upd.placa) o.placa = normPlaca(upd.placa);
        if ("os" in upd) o.os = String(o.os || "").trim().replace(/^0+/, "") || "0";
        if ("status" in upd && FECHAMENTO.has(String(upd.status))) {
          o.fechamento = now();
          if (o.abertura) { const x = parseDt(o.abertura), f = parseDt(o.fechamento); if (x && f) o.sla_minutos = r1((f - x) / 60000); }
        }
        if ("status" in upd) { const n = String(upd.status); o.historico = [...(o.historico || []), { hora: now(), etapa: STATUS_LABELS[n] || n, quem: QUEM() }]; o.atualizado_por = QUEM(); o.ultima_atualizacao = now(); }
        return ok({ success: true, data: put("ordens", o) });
      }
      if (!c && method === "DELETE") { del("ordens", b); addLog("OS_REMOVIDA", it.os, `O.S. ${it.os} removida`, QUEM()); return ok({ success: true }); }
      if (c === "fechar" && method === "POST") {
        const o = { ...it, resultado: body.resultado, servico_realizado: body.servico_realizado || "" };
        if (body.prestador_id) { o.prestador_id = body.prestador_id; const p = S.prestadores.find(x => x.id === body.prestador_id); o.prestador_nome = p ? p.nome : ""; }
        if (body.valor !== null && body.valor !== undefined) o.valor = body.valor;
        if (body.valor_orcado !== null && body.valor_orcado !== undefined) o.valor_orcado = body.valor_orcado;
        if (body.observacoes) o.observacoes = body.observacoes;
        if (body.execucao) o.execucao = body.execucao;
        o.status = String(body.resultado || "").includes("Rebocado") ? "Rebocado" : "Liberado";
        o.fechamento = now(); o.atualizado_por = QUEM(); o.ultima_atualizacao = now();
        if (o.abertura) { const x = parseDt(o.abertura), f = parseDt(o.fechamento); if (x && f) o.sla_minutos = r1((f - x) / 60000); }
        put("ordens", o); addLog("OS_FECHADA", o.os, `Resultado: ${body.resultado}`, QUEM());
        return ok({ success: true, data: o });
      }
      if (c === "cancelar" && d === "aprovar") {
        if (!it.cancelamento_solicitado) return fail(400, "Nenhum cancelamento pendente para esta O.S.");
        const o = { ...it, cancelado: true, motivo_cancelamento: it.cancelamento_motivo || "", status: "Cancelada", cancelamento_aprovado_por: QUEM(), cancelamento_solicitado: false, historico: [...(it.historico || []), { hora: now(), etapa: "CANCELADA", quem: QUEM() }] };
        put("ordens", o); addLog("OS_CANCELADA", o.os, `Aprovado por ${QUEM()}`, QUEM()); return ok({ success: true, data: o });
      }
      if (c === "cancelar" && method === "POST") {
        const ag = now();
        const o = { ...it, cancelamento_solicitado: true, cancelamento_motivo: body.motivo, cancelamento_solicitado_por: QUEM(), cancelamento_solicitado_em: ag, historico: [...(it.historico || []), { hora: ag, etapa: "CANCELAMENTO_SOLICITADO", quem: QUEM() }] };
        // como o acesso é único (admin), o cancelamento é concluído na hora, como no original para admin
        o.cancelado = true; o.status = "Cancelada"; o.fechamento = ag; o.cancelamento_aprovado_por = QUEM(); o.cancelamento_aprovado_em = ag; o.motivo_cancelamento = body.motivo;
        o.historico.push({ hora: ag, etapa: "CANCELADA", quem: QUEM(), acao: "Cancelada pelo admin" });
        put("ordens", o); addLog("OS_CANCELAMENTO_SOLICITADO", o.os, `Motivo: ${body.motivo}`, QUEM());
        return ok({ success: true, pendente: false, data: o });
      }
      if (c === "notas") {
        if (method === "GET") return ok({ data: it.notas || [], total: (it.notas || []).length });
        if (method === "POST") { const n = { id: uid(), sigla: body.sigla, texto: body.texto, created_at: now() }; put("ordens", { ...it, notas: [...(it.notas || []), n] }); return ok({ success: true, data: n }); }
      }
    }
  }
  if (a === "stats" && !b) return ok(stats());
  if (a === "alerts") return ok(alerts());
  if (a === "log") return ok({ data: [...S.log].sort((x, y) => String(y.created_at || "").localeCompare(String(x.created_at || ""))) });
  if (a === "bases") {
    if (!b) { if (method === "GET") return ok({ data: S.bases }); if (method === "POST") return ok({ success: true, data: put("bases", { ...body, id: uid(), created_at: now() }) }); }
    else { const x = S.bases.find(i => i.id === b); if (!x) return fail(404, "Base não encontrada"); if (method === "PUT") return ok({ success: true, data: put("bases", { ...x, ...body, id: b }) }); if (method === "DELETE") { del("bases", b); return ok({ success: true }); } }
  }
  if (a === "frota" && b === "placas") return ok({ data: S.frota, total: S.frota.length });
  if (a === "frota" && b === "placa") { const x = S.frota.find(i => i.placa === decodeURIComponent(c || "").toUpperCase()); return x ? ok({ data: x }) : fail(404, "Placa não encontrada"); }
  if (a === "ocorrencias") {
    if (!b) return ok({ data: S.ocorrencias });
    if (c === "aceitar") { const x = S.ocorrencias.find(i => i.id === b); if (!x) return fail(404, "Ocorrência não encontrada"); return ok({ success: true, data: put("ocorrencias", { ...x, status: "aceita", aceita_por: QUEM(), aceita_em: now() }) }); }
  }
  if (a === "notificacoes") {
    if (!b) return ok({ data: S.notificacoes, nao_lidas: S.notificacoes.filter(n => !n.lida).length });
    if (c === "ler") { const x = S.notificacoes.find(i => i.id === b); if (x) put("notificacoes", { ...x, lida: true }); return ok({ success: true }); }
  }
  if (a === "configuracoes") {
    if (method === "PUT") { S.config = { ...DEF_CONFIG, ...S.config, ...body }; saveConfig(); }
    const cfg = { ...DEF_CONFIG, ...S.config }; return ok({ ...cfg, data: cfg });
  }
  if (a === "pecas-envio") {
    if (!b) {
      if (method === "GET") return ok({ data: S.pecas_envio });
      if (method === "POST") return ok({ success: true, data: put("pecas_envio", { ...body, id: uid(), etapa: "ORÇANDO", abertura: now(), etapa_desde: now(), historico: [{ etapa: "ORÇANDO", hora: now() }] }) });
    } else {
      const x = S.pecas_envio.find(i => i.id === b); if (!x) return fail(404, "Envio não encontrado");
      if (c === "mover" && method === "POST") {
        const o = { ...x, etapa: body.etapa || x.etapa, etapa_desde: now(), historico: [...(x.historico || []), { etapa: body.etapa, hora: now() }] };
        if (body.confirmar_recebimento) { o.confirmado_recebimento = true; o.finalizado_em = now(); }
        return ok({ success: true, data: put("pecas_envio", o) });
      }
      if (method === "DELETE") { del("pecas_envio", b); return ok({ success: true }); }
    }
  }
  if (a === "pecas") return ok({ data: [], total: 0 });
  if (a === "users") return ok({ data: [{ id: "admin", email: "admin@print", nome: QUEM(), role: "admin", status: "ativo" }] });
  if (a === "sascar") {
    if (b === "posicoes") { const dd = (S.sascar && S.sascar.data) || {}; return ok({ data: dd, total: Object.keys(dd).length, credencial_ok: true, atualizado: (S.sascar && S.sascar.updated) || 0 }); }
    return ok({ data: [], credencial_ok: true });
  }
  if (a === "escalonamento") {
    const cfg = { ...DEF_CONFIG, ...(S.config || {}) };
    const hS = Number(cfg.escalonamento_supervisor_h) || 2, hG = Number(cfg.escalonamento_gerencia_h) || 4;
    const agora = Date.now(); const out = [];
    S.ordens.forEach(o => {
      if (o.fechamento || o.cancelado) return;
      const base = o.ultima_atualizacao || o.abertura; if (!base) return;
      const dt = parseDt(base); if (!dt) return;
      const horas = (agora - dt) / 3600000;
      if (horas >= hS) out.push({ id: o.id, os: o.os, placa: o.placa, status: o.status, operacao: o.operacao, horas_parada: r1(horas), nivel: horas >= hG ? "GERENCIA" : "SUPERVISOR", ultima_atualizacao: base });
    });
    out.sort((x, y) => y.horas_parada - x.horas_parada);
    return ok({ data: out, total: out.length, gerencia: out.filter(x => x.nivel === "GERENCIA").length });
  }
  if (a === "stats" && b === "orcado") {
    const agg = fn => { const m = {}; S.ordens.forEach(o => { const k = fn(o) || "Sem info"; const d = (m[k] = m[k] || { orcado: 0, realizado: 0, qtd: 0 }); d.orcado += Number(o.valor_orcado) || 0; d.realizado += Number(o.valor) || 0; d.qtd++; });
      return Object.entries(m).map(([nome, d]) => { const base = d.orcado || d.realizado || 1; return { nome, ...d, desvio_pct: d.orcado ? r1(((d.realizado - d.orcado) / base) * 100) : 0 }; }).sort((x, y) => y.realizado - x.realizado); };
    const pm = Object.fromEntries(S.prestadores.map(p => [p.id, p.nome]));
    return ok({ por_prestador: agg(o => o.prestador_nome || pm[o.prestador_id] || "Sem prestador"), por_filial: agg(o => o.operacao),
      totais: { orcado: S.ordens.reduce((t, o) => t + (Number(o.valor_orcado) || 0), 0), realizado: S.ordens.reduce((t, o) => t + (Number(o.valor) || 0), 0), ordens: S.ordens.length } });
  }
  return ok({});
}

const realFetch = window.fetch.bind(window);
window.fetch = async (input, init) => {
  const url = typeof input === "string" ? input : input && input.url;
  if (!url || !url.startsWith("/api/")) return realFetch(input, init);
  await ready;
  const mth = ((init && init.method) || "GET").toUpperCase();
  const [path, qs] = url.slice(4).split("?");
  let body = {};
  try { body = init && typeof init.body === "string" ? JSON.parse(init.body || "{}") : {}; } catch (e) { body = {}; }
  const J = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json" } });
  const seg = path.replace(/^\/+/, "").split("/");
  // Usuários: só admin, executado no servidor (Edge Function admin-users)
  if (seg[0] === "users" || seg[0] === "usuarios") {
    if (ROLE !== "admin") return J({ detail: "Somente administradores." }, 403);
    const call = window.__printUsers; if (!call) return J({ detail: "Indisponível" }, 503);
    const id = seg[1] ? decodeURIComponent(seg[1]) : "";
    try {
      if (mth === "GET") return J(await call("listar", {}));
      if (seg[2] === "senha" || seg[2] === "aprovar") return J(await call(seg[2] === "senha" ? "senha" : "salvar", { email: id, senha: body.senha, role: body.role || "operador" }));
      if (mth === "POST") return J(await call("salvar", { email: body.email, nome: body.nome, role: body.role || "operador", senha: body.password || body.senha }));
      if (mth === "PUT") return J(await call("salvar", { email: id, nome: body.nome, role: body.role, senha: body.password || body.senha || undefined }));
      if (mth === "DELETE") return J(await call("remover", { email: id }));
    } catch (e) { return J({ detail: String(e && e.message || e) }, 400); }
  }
  const podeEditar = ROLE === "admin" || ROLE === "gerente";
  if (mth !== "GET" && (!podeEditar || (seg[0] === "configuracoes" && ROLE !== "admin")))
    return J({ detail: "Sem permissão para alterar. Fale com um administrador." }, 403);
  let res;
  try { res = route(((init && init.method) || "GET").toUpperCase(), path, new URLSearchParams(qs || ""), body); } catch (e) { res = { s: 500, b: { detail: String(e && e.message || e) } }; }
  return new Response(JSON.stringify(res.b), { status: res.s, headers: { "Content-Type": "application/json" } });
};
