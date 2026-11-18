// Backend do painel rodando dentro da página. Intercepta fetch("/api/...") e responde
// com a mesma lógica das rotas do serviço original, guardando os dados no banco da página.
const COLS = ["prestadores", "ordens", "bases", "acionamentos", "pecas_envio", "log", "ocorrencias", "notificacoes"];
const estado = { prestadores: [], ordens: [], bases: [], acionamentos: [], pecas_envio: [], log: [], ocorrencias: [], notificacoes: [], frota: [], config: {} };
const DEF_CONFIG = { escalonamento_gerencia_h: 4, escalonamento_supervisor_h: 2, mostrar_bases: true, mostrar_oficinas: true, raio_km: 100, resumo_ativo: false, resumo_emails: "", resumo_horario: "07:30", sascar_intervalo_min: 5 };
let DB = null;
let ROLE = "operador";
let usuarioAtual = { email: "", nome: "", role: "operador" };
export function setRole(r) { ROLE = r; }
export function setUser(u) { usuarioAtual = u || usuarioAtual; ROLE = usuarioAtual.role || "operador"; }
const QUEM = () => usuarioAtual.email || usuarioAtual.nome || "Usuário";
export const getState = () => estado;
export const callRoute = (path) => route("GET", path, {}, null).b;

// ── tempo (Brasília) ──
const TZ = "America/Sao_Paulo";
const pad = (n, l = 2) => String(n).padStart(l, "0");
function horaBrasilia(d = new Date()) {
  const p = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }).formatToParts(d).map(x => [x.type, x.value]));
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}.${pad(d.getMilliseconds(), 3)}000-03:00`;
}
const now = () => horaBrasilia();
const today = (d = new Date()) => horaBrasilia(d).slice(0, 10);
function parseDt(s) {
  if (!s) return null;
  const str = /[zZ]$|[+-]\d\d:?\d\d$/.test(String(s)) ? String(s) : String(s) + "-03:00";
  const d = new Date(str);
  return isNaN(d) ? null : d;
}
const arred1 = x => Math.round(x * 10) / 10;
const arred2 = x => Math.round(x * 100) / 100;
// Agregação: um só helper para "agrupar por chave" e outro para "contar/somar por chave".
// agrupar(lista, chave, padrao, novo, acumular): { chave → acumulador }; chave vazia vira `padrao`; novo(chave, item) cria o acumulador.
function agrupar(lista, chave, padrao, novo, acumular) {
  const grupos = {};
  lista.forEach(item => { const k = chave(item) || padrao; acumular(grupos[k] = grupos[k] || novo(k, item), item); });
  return grupos;
}
// somarPor(lista, chave, peso): { chave → soma de peso(item) }; sem peso, conta os itens.
function somarPor(lista, chave, peso = () => 1) {
  const totais = {};
  lista.forEach(item => { const k = chave(item); totais[k] = (totais[k] || 0) + peso(item); });
  return totais;
}
const valorDe = o => Number(o.valor) || 0;
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : "id" + Math.random().toString(16).slice(2) + Date.now());

const FECHAMENTO = new Set(["Liberado", "Concluído", "Rebocado", "Veículo liberado", "O.S. fechada"]);
const STATUS_LABELS = { "Aguardando": "O.S. criada · aguardando", "Prestador localizado": "Prestador localizado", "Prestador a caminho": "Prestador a caminho", "Prestador no local": "Prestador no local", "Serviço em execução": "Serviço em execução", "Em atendimento": "Serviço em execução", "Veículo liberado": "Veículo liberado", "Liberado": "Veículo liberado", "O.S. fechada": "O.S. fechada", "Concluído": "O.S. fechada", "Rebocado": "Veículo rebocado", "Cancelada": "O.S. cancelada" };
const aberta = o => !!o.abertura && !o.fechamento && !o.cancelado;
const capitalizar = v => String(v || "").trim().toLowerCase().replace(/(^|[^a-zà-ÿ])([a-zà-ÿ])/g, (m, a, b) => a + b.toUpperCase());
const normPlaca = v => String(v || "").trim().toUpperCase();

// ── permissões (espelho de public.kv_can_write em supabase/migrations/005_permissoes_por_papel.sql) ──
// O banco é quem decide; aqui só evitamos mudar a tela quando o banco vai recusar a gravação.
const TODAS = ["insert", "update", "delete"];
const ESCRITA_GERENTE = { ordens: ["insert", "update"], prestadores: TODAS, pecas_envio: TODAS, acionamentos: TODAS, ocorrencias: ["insert", "update"], notificacoes: ["insert", "update"], log: ["insert"] };
export function podeGravar(colecao, acao) {
  if (ROLE === "admin") return true;
  if (ROLE === "gerente") return (ESCRITA_GERENTE[colecao] || []).includes(acao);
  return false;
}
class SemPermissao extends Error { constructor(msg) { super(msg || "Sem permissão para alterar. Fale com um administrador."); this.status = 403; } }
function exigirGravacao(colecao, acao) { if (!podeGravar(colecao, acao)) throw new SemPermissao(); }

// ── persistência ──
// A tela muda na hora; a gravação no banco vem em seguida. Se o banco recusar (sem permissão, sem rede…),
// a mudança é desfeita na tela e o usuário é avisado (evento "painel:erro-gravacao", mostrado pelo page.tsx).
const NOMES_COLECAO = { prestadores: "prestador", ordens: "O.S.", bases: "base", acionamentos: "acionamento", pecas_envio: "envio de peça", log: "log", ocorrencias: "ocorrência", notificacoes: "notificação", config: "configurações" };
function avisarFalhaGravacao(colecao, erro) {
  const motivo = String((erro && (erro.message || erro.details)) || erro || "erro desconhecido");
  const msg = `Não foi possível salvar (${NOMES_COLECAO[colecao] || colecao}) no banco: ${motivo}. A alteração foi desfeita na tela.`;
  console.error(msg, erro);
  try { window.dispatchEvent(new CustomEvent("painel:erro-gravacao", { detail: { colecao, mensagem: msg } })); } catch (e) { /* sem janela (testes) */ }
}
// Grava no banco; em caso de erro, desfaz(). Devolve uma promessa que resolve true/false (nunca rejeita).
function gravar(colecao, operacao, desfazer, silencioso) {
  if (!DB) return Promise.resolve(true);
  return operacao().then(() => true, erro => { desfazer(); if (!silencioso) avisarFalhaGravacao(colecao, erro); return false; });
}
function put(col, obj, opcoes = {}) {
  const i = estado[col].findIndex(x => x.id === obj.id);
  exigirGravacao(col, i >= 0 ? "update" : "insert");
  const anterior = i >= 0 ? estado[col][i] : null;
  if (anterior) { if (!obj._k && anterior._k) obj._k = anterior._k; estado[col][i] = obj; } else estado[col].unshift(obj);
  const { _k, ...clean } = obj;
  const gravado = gravar(col, () => DB.collection(col).doc(_k || obj.id).set(clean), () => {
    // Desfaz só se ninguém mexeu nesse registro depois (tempo real ou outra edição).
    const j = estado[col].indexOf(obj); if (j < 0) return;
    if (anterior) estado[col][j] = anterior; else estado[col].splice(j, 1);
  }, opcoes.silencioso);
  if (opcoes.aoGravar) opcoes.aoGravar(gravado);
  return obj;
}
function del(col, id) {
  exigirGravacao(col, "delete");
  const x = estado[col].find(i => i.id === id);
  estado[col] = estado[col].filter(i => i.id !== id);
  gravar(col, () => DB.collection(col).doc((x && x._k) || id).delete(), () => { if (x && !estado[col].some(i => i.id === id)) estado[col].unshift(x); });
}
function saveConfig(anterior) { gravar("config", () => DB.collection("config").doc("main").set(estado.config), () => { estado.config = anterior; }); }
function addLog(evento, os, detalhe, quem = "Sistema") {
  put("log", { id: uid(), evento, os, detalhe, quem, created_at: now() });
}
const byId = id => estado.ordens.find(o => o.id === id);

let readyRes; const ready = new Promise(r => { readyRes = r; });
export function startBackend(db) {
  DB = db;
  if (!db) { readyRes(); return; }
  let faltam = COLS.length + 3; const umaPronta = () => { if (--faltam <= 0) readyRes(); };
  setTimeout(readyRes, 8000);
  // Assina a coleção; chama aoPrimeiro uma única vez, no primeiro snapshot ou no primeiro erro.
  const ouvir = (colecao, aoMudar, aoPrimeiro = () => {}) => {
    let primeiro = true; const marcar = () => { if (primeiro) { primeiro = false; aoPrimeiro(); } };
    db.collection(colecao).onSnapshot(snap => { aoMudar(snap); marcar(); }, marcar);
  };
  const docMain = snap => snap.docs.find(x => x.id === "main");
  COLS.forEach(c => ouvir(c, snap => { estado[c] = snap.docs.map(d => ({ id: d.id, ...d.data(), _k: d.id })); }, umaPronta));
  ouvir("frota_placas", snap => { estado.frota = snap.docs.flatMap(d => d.data().items || []); }, umaPronta);
  ouvir("config", snap => { const d = docMain(snap); estado.config = d ? d.data() : {}; }, umaPronta);
  ouvir("sascar_pos", snap => { const d = docMain(snap); estado.sascar = d ? d.data() : { data: {} }; });
  umaPronta();
}

// ── cálculos ──
const contadorPorTipo = () => ({ mecanico: 0, eletrico: 0, eletronica: 0, eletrica_mecanica: 0, borracharia: 0, guincho: 0, pneus: 0, freio: 0, combustivel: 0, outros: 0 });
function stats() {
  const P = estado.prestadores, A = estado.acionamentos, O = estado.ordens;
  const tiposPrestador = contadorPorTipo(), tiposOrdem = contadorPorTipo();
  P.forEach(p => { const t = p.tipo_servico || "mecanico"; if (t in tiposPrestador) tiposPrestador[t]++; });
  O.forEach(o => { const t = o.tipo_servico || "mecanico"; if (t in tiposOrdem) tiposOrdem[t]++; });
  const SEM_PRESTADOR = "Sem prestador", nomePrestador = o => o.prestador_nome || SEM_PRESTADOR;
  const ordensPorPrestador = agrupar(O, nomePrestador, SEM_PRESTADOR, (n, o) => ({ id: n !== SEM_PRESTADOR ? (o.prestador_id || "") : "sem-prestador", nome: n, count: 0 }), x => { x.count++; });
  const top = Object.values(ordensPorPrestador).sort((a, b) => b.count - a.count).slice(0, 10);
  const total = O.length, val = valorDe;
  const porOperacao = somarPor(O, o => o.operacao || "Sem operação");
  const porPlaca = somarPor(O, o => o.placa || o.veiculo || "Sem placa");
  const placasRepetidas = Object.values(porPlaca).filter(c => c > 1).length;
  const porMarca = agrupar(O, o => o.marca, "Sem marca", () => ({ count: 0, custo: 0 }), (x, o) => { x.count++; x.custo += val(o); });
  const custo_por_marca = Object.fromEntries(Object.entries(porMarca).map(([m, d]) => [m, { count: d.count, custo_medio: d.count ? arred2(d.custo / d.count) : 0 }]));
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
  const rpm = fechadas.length ? arred1(dentro(fechadas) / fechadas.length * 100) : 0;
  const segmentoDe = o => { const s = String(o.segmento || "").trim().toLowerCase(); return s === "privado" || s === "correios" ? s : "privado"; };
  const indicadores = {};
  ["privado", "correios"].forEach(n => {
    const sub = O.filter(o => segmentoDe(o) === n), fe = sub.filter(o => o.fechamento), din = dentro(fe);
    const vals = Object.values(agrupar(sub, nomePrestador, SEM_PRESTADOR, k => ({ nome: k, count: 0, custo: 0 }), (x, o) => { x.count++; x.custo += val(o); }));
    const mc = vals.length ? vals.reduce((a, b) => (b.custo > a.custo ? b : a)) : { nome: "", custo: 0 };
    indicadores[n] = { total: sub.length, fechadas: fe.length, dentro_prazo: din, atrasadas: fe.filter(o => (o.sla_minutos || 999) > 120).length, em_aberto: sub.filter(o => !o.fechamento && !o.cancelado).length, rpm: fe.length ? arred1(din / fe.length * 100) : 0, mais_acionadas: vals.sort((a, b) => b.count - a.count).slice(0, 5), maior_custo: { nome: mc.nome, valor: arred2(mc.custo) } };
  });
  const custoPorPrestador = somarPor(O, nomePrestador, val);
  const maiorG = Object.entries(custoPorPrestador).sort((a, b) => b[1] - a[1])[0];
  indicadores.geral = { total, fechadas: fechadas.length, dentro_prazo: dentro(fechadas), atrasadas: fechadas.filter(o => (o.sla_minutos || 999) > 120).length, em_aberto: O.filter(aberta).length, rpm, mais_acionadas: top, maior_custo: maiorG ? { nome: maiorG[0], valor: arred2(maiorG[1]) } : { nome: "", valor: 0 } };
  const pag = { a_vista: { count: 0, valor: 0 }, faturado: { count: 0, valor: 0 }, nao_informado: { count: 0, valor: 0 } };
  const AV = ["a_vista", "à vista", "a vista", "avista"];
  O.forEach(o => { const fp = String(o.forma_pagamento || "").trim().toLowerCase(); const k = AV.includes(fp) ? "a_vista" : fp === "faturado" ? "faturado" : "nao_informado"; pag[k].count++; pag[k].valor += val(o); });
  Object.values(pag).forEach(x => { x.valor = arred2(x.valor); });
  const dia = o => String(o.data || "").slice(0, 10);
  const hEnt = O.filter(o => dia(o) === hoje).length, oEnt = O.filter(o => dia(o) === ontem).length;
  const hFec = O.filter(o => o.fechamento && String(o.fechamento).slice(0, 10) === hoje).length, oFec = O.filter(o => o.fechamento && String(o.fechamento).slice(0, 10) === ontem).length;
  const por_status = somarPor(O, o => o.status || "Sem status");
  const soma = (l, f) => arred2(l.filter(f).reduce((s, o) => s + val(o), 0));
  return {
    total_prestadores: P.length, disponiveis_24h: P.filter(p => p.socorro_24h).length, com_faturamento: P.filter(p => p.fatura).length, total_acionamentos: A.length,
    tipo_prestadores: tiposPrestador, acionamento_por_tipo: tiposOrdem, top_prestadores: top, total_ordens: total, valor_total: O.reduce((s, o) => s + val(o), 0),
    veiculos_unicos: new Set(O.map(o => o.veiculo || o.placa).filter(Boolean)).size, servicos_total: O.filter(o => o.servico_realizado).length,
    operacao_count: porOperacao, taxa_repetibilidade: total ? arred1(placasRepetidas / total * 100) : 0, custo_por_marca, sla_medio: slas.length ? arred1(slas.reduce((a, b) => a + b, 0) / slas.length) : 0,
    ordens_fechadas: fechadas.length, socorros_hoje: O.filter(o => String(o.created_at || "").startsWith(hoje) || o.data === hoje).length, em_aberto: O.filter(aberta).length,
    atrasados, liberados: O.filter(o => ["Liberado", "Veículo liberado"].includes(o.status)).length, rebocados: O.filter(o => ["Rebocado", "Reboque", "Veículo rebocado"].includes(o.status)).length,
    rpm, indicadores_segmento: indicadores, pagamento: pag, paradas,
    resumo: { por_status, hoje: { entraram: hEnt, fecharam: hFec, avista_valor: soma(O, o => AV.includes(o.forma_pagamento || "") && dia(o) === hoje), faturado_valor: soma(O, o => (o.forma_pagamento || "") === "faturado" && dia(o) === hoje) }, ontem: { entraram: oEnt, fecharam: oFec }, tendencia_entraram: hEnt - oEnt, tendencia_fecharam: hFec - oFec },
  };
}
function alerts() {
  const nowD = new Date(), out = [];
  estado.ordens.filter(aberta).forEach(o => {
    const a = parseDt(o.abertura); if (!a) return;
    const min = arred1((nowD - a) / 60000);
    // Só consulta: o alerta SLA_ALERTA_60MIN no log é gravado pelo servidor (pg_cron → registrar_alertas_sla()).
    if (min > 60) out.push({ ...o, minutos_aberto: min });
  });
  return { data: out, total: out.length };
}
const nextOs = () => String(estado.ordens.reduce((m, o) => Math.max(m, parseInt(o.os, 10) || 0), 0) + 1).padStart(6, "0");

// ── rotas ──
function route(method, path, q, body) {
  const seg = path.split("/").filter(Boolean), [a, b, c, d] = seg;
  const ok = data => ({ s: 200, b: data }), fail = (s, detail) => ({ s, b: { detail } });
  if (a === "prestadores") {
    if (!b) {
      if (method === "GET") return ok({ data: estado.prestadores, total: estado.prestadores.length });
      if (method === "POST") return ok({ success: true, data: put("prestadores", { ...body, id: uid(), created_at: now() }) });
    } else {
      const p = estado.prestadores.find(x => x.id === b); if (!p) return fail(404, "Prestador não encontrado");
      if (method === "PUT") return ok({ success: true, data: put("prestadores", { ...p, ...body, id: b }) });
      if (method === "DELETE") { del("prestadores", b); return ok({ success: true }); }
      if (method === "GET") return ok({ data: p });
    }
  }
  if (a === "acionamentos") {
    if (method === "GET") return ok({ data: estado.acionamentos, total: estado.acionamentos.length });
    if (method === "POST") { const p = estado.prestadores.find(x => x.id === body.prestador_id); return ok({ success: true, data: put("acionamentos", { ...body, prestador_nome: p ? p.nome : body.prestador_nome || "", id: uid() }) }); }
    if (method === "DELETE") { del("acionamentos", b); return ok({ success: true }); }
  }
  if (a === "ordens") {
    if (!b) {
      if (method === "GET") { const pm = Object.fromEntries(estado.prestadores.map(p => [p.id, p.nome])); const items = estado.ordens.map(o => (!o.prestador_nome && o.prestador_id ? { ...o, prestador_nome: pm[o.prestador_id] || "" } : o)).sort((x, y) => String(y.created_at || "").localeCompare(String(x.created_at || ""))); return ok({ data: items, total: items.length }); }
      if (method === "POST") {
        const o = { ...body, id: uid(), created_at: now(), abertura: now() };
        o.os = o.os && String(o.os).trim() ? (String(o.os).trim().replace(/^0+/, "") || "0") : nextOs();
        ["motorista", "operador", "modelo", "marca", "rodovia", "localizacao"].forEach(k => { o[k] = capitalizar(o[k]); });
        o.placa = normPlaca(o.placa); o.data = o.data || today();
        if (!o.veiculo) o.veiculo = [o.marca, o.modelo, o.placa].filter(Boolean).join(" ").trim();
        if (o.prestador_id) { const p = estado.prestadores.find(x => x.id === o.prestador_id); o.prestador_nome = p ? p.nome : ""; }
        o.criado_por = QUEM(); o.criado_login = usuarioAtual.email; o.criado_perfil = ROLE;
        o.historico = [{ hora: now(), etapa: "OS_CRIADA", quem: o.criado_por }];
        put("ordens", o); addLog("OS_CRIADA", o.os, `O.S. ${o.os} criada`, o.criado_por);
        return ok({ success: true, data: o });
      }
    } else if (b === "cancelamentos" && c === "pendentes") {
      const l = estado.ordens.filter(o => o.cancelamento_solicitado && !o.cancelado); return ok({ data: l, total: l.length });
    } else {
      const it = byId(b); if (!it) return fail(404, "Ordem não encontrada");
      if (!c && method === "PUT") {
        const upd = body || {}, o = { ...it, ...upd };
        const cancelada = x => !!x.cancelado || x.status === "Cancelada";
        if (ROLE !== "admin" && cancelada(o) !== cancelada(it)) return fail(403, "Só um administrador cancela O.S. Use \"Excluir\" para solicitar o cancelamento.");
        ["motorista", "operador", "modelo", "marca", "rodovia", "localizacao"].forEach(k => { if (k in upd && upd[k]) o[k] = capitalizar(upd[k]); });
        if (upd.placa) o.placa = normPlaca(upd.placa);
        if ("os" in upd) o.os = String(o.os || "").trim().replace(/^0+/, "") || "0";
        if ("status" in upd && FECHAMENTO.has(String(upd.status))) {
          o.fechamento = now();
          if (o.abertura) { const x = parseDt(o.abertura), f = parseDt(o.fechamento); if (x && f) o.sla_minutos = arred1((f - x) / 60000); }
        }
        if ("status" in upd) { const n = String(upd.status); o.historico = [...(o.historico || []), { hora: now(), etapa: STATUS_LABELS[n] || n, quem: QUEM() }]; o.atualizado_por = QUEM(); o.ultima_atualizacao = now(); }
        return ok({ success: true, data: put("ordens", o) });
      }
      if (!c && method === "DELETE") { del("ordens", b); addLog("OS_REMOVIDA", it.os, `O.S. ${it.os} removida`, QUEM()); return ok({ success: true }); }
      if (c === "fechar" && method === "POST") {
        const o = { ...it, resultado: body.resultado, servico_realizado: body.servico_realizado || "" };
        if (body.prestador_id) { o.prestador_id = body.prestador_id; const p = estado.prestadores.find(x => x.id === body.prestador_id); o.prestador_nome = p ? p.nome : ""; }
        if (body.valor !== null && body.valor !== undefined) o.valor = body.valor;
        if (body.valor_orcado !== null && body.valor_orcado !== undefined) o.valor_orcado = body.valor_orcado;
        if (body.observacoes) o.observacoes = body.observacoes;
        if (body.execucao) o.execucao = body.execucao;
        o.status = String(body.resultado || "").includes("Rebocado") ? "Rebocado" : "Liberado";
        o.fechamento = now(); o.atualizado_por = QUEM(); o.ultima_atualizacao = now();
        if (o.abertura) { const x = parseDt(o.abertura), f = parseDt(o.fechamento); if (x && f) o.sla_minutos = arred1((f - x) / 60000); }
        put("ordens", o); addLog("OS_FECHADA", o.os, `Resultado: ${body.resultado}`, QUEM());
        return ok({ success: true, data: o });
      }
      // Cancelamento em duas etapas: o gerente solicita; o admin aprova (ou cancela direto).
      if (c === "cancelar" && d === "aprovar") {
        if (ROLE !== "admin") return fail(403, "Só um administrador aprova cancelamentos.");
        if (it.cancelado) return fail(400, "Esta O.S. já está cancelada.");
        if (!it.cancelamento_solicitado) return fail(400, "Nenhum cancelamento pendente para esta O.S.");
        const ag = now();
        const o = { ...it, cancelado: true, motivo_cancelamento: it.cancelamento_motivo || "", status: "Cancelada", fechamento: it.fechamento || ag, cancelamento_aprovado_por: QUEM(), cancelamento_aprovado_em: ag, cancelamento_solicitado: false, historico: [...(it.historico || []), { hora: ag, etapa: "CANCELADA", quem: QUEM() }] };
        put("ordens", o); addLog("OS_CANCELADA", o.os, `Aprovado por ${QUEM()}`, QUEM()); return ok({ success: true, data: o });
      }
      if (c === "cancelar" && method === "POST") {
        if (it.cancelado) return fail(400, "Esta O.S. já está cancelada.");
        const ag = now();
        const o = { ...it, cancelamento_solicitado: true, cancelamento_motivo: body.motivo, cancelamento_solicitado_por: QUEM(), cancelamento_solicitado_em: ag, historico: [...(it.historico || []), { hora: ag, etapa: "CANCELAMENTO_SOLICITADO", quem: QUEM() }] };
        if (ROLE !== "admin") {
          put("ordens", o); addLog("OS_CANCELAMENTO_SOLICITADO", o.os, `Motivo: ${body.motivo}`, QUEM());
          return ok({ success: true, pendente: true, data: o });
        }
        o.cancelado = true; o.status = "Cancelada"; o.fechamento = ag; o.cancelamento_solicitado = false; o.cancelamento_aprovado_por = QUEM(); o.cancelamento_aprovado_em = ag; o.motivo_cancelamento = body.motivo;
        o.historico.push({ hora: ag, etapa: "CANCELADA", quem: QUEM(), acao: "Cancelada pelo admin" });
        put("ordens", o); addLog("OS_CANCELADA", o.os, `Cancelada pelo admin. Motivo: ${body.motivo}`, QUEM());
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
  if (a === "log") return ok({ data: [...estado.log].sort((x, y) => String(y.created_at || "").localeCompare(String(x.created_at || ""))) });
  if (a === "bases") {
    if (!b) { if (method === "GET") return ok({ data: estado.bases }); if (method === "POST") return ok({ success: true, data: put("bases", { ...body, id: uid(), created_at: now() }) }); }
    else { const x = estado.bases.find(i => i.id === b); if (!x) return fail(404, "Base não encontrada"); if (method === "PUT") return ok({ success: true, data: put("bases", { ...x, ...body, id: b }) }); if (method === "DELETE") { del("bases", b); return ok({ success: true }); } }
  }
  if (a === "frota" && b === "placas") return ok({ data: estado.frota, total: estado.frota.length });
  if (a === "frota" && b === "placa") { const x = estado.frota.find(i => i.placa === decodeURIComponent(c || "").toUpperCase()); return x ? ok({ data: x }) : fail(404, "Placa não encontrada"); }
  if (a === "ocorrencias") {
    if (!b) return ok({ data: estado.ocorrencias });
    if (c === "aceitar") { const x = estado.ocorrencias.find(i => i.id === b); if (!x) return fail(404, "Ocorrência não encontrada"); return ok({ success: true, data: put("ocorrencias", { ...x, status: "aceita", aceita_por: QUEM(), aceita_em: now() }) }); }
  }
  if (a === "notificacoes") {
    if (!b) return ok({ data: estado.notificacoes, nao_lidas: estado.notificacoes.filter(n => !n.lida).length });
    if (c === "ler") {
      const x = estado.notificacoes.find(i => i.id === b);
      if (x) {
        // Operador não grava no banco: marca só nesta tela (a notificação é a mesma para todos).
        if (podeGravar("notificacoes", "update")) put("notificacoes", { ...x, lida: true });
        else estado.notificacoes = estado.notificacoes.map(n => (n.id === b ? { ...n, lida: true } : n));
      }
      return ok({ success: true });
    }
  }
  if (a === "configuracoes") {
    if (method === "PUT") { exigirGravacao("config", "update"); const anterior = estado.config; estado.config = { ...DEF_CONFIG, ...estado.config, ...body }; saveConfig(anterior); }
    const cfg = { ...DEF_CONFIG, ...estado.config }; return ok({ ...cfg, data: cfg, success: true });
  }
  if (a === "pecas-envio") {
    if (!b) {
      if (method === "GET") return ok({ data: estado.pecas_envio });
      if (method === "POST") return ok({ success: true, data: put("pecas_envio", { ...body, id: uid(), etapa: "ORÇANDO", abertura: now(), etapa_desde: now(), historico: [{ etapa: "ORÇANDO", hora: now() }] }) });
    } else {
      const x = estado.pecas_envio.find(i => i.id === b); if (!x) return fail(404, "Envio não encontrado");
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
    if (b === "posicoes") { const dd = (estado.sascar && estado.sascar.data) || {}; return ok({ data: dd, total: Object.keys(dd).length, credencial_ok: true, atualizado: (estado.sascar && estado.sascar.updated) || 0 }); }
    return ok({ data: [], credencial_ok: true });
  }
  if (a === "relatorio" && b === "gerencial2") {
    if (ROLE !== "admin" && ROLE !== "gerente") return fail(403, "O relatório gerencial é só para gerentes e administradores.");
    // Resumo executivo (mesma lógica do backend de produção, implementação cmwazfbea00qnhlujmlyko70f)
    const dias = parseInt(q.get("dias") || "30", 10) || 0;
    const agora = new Date();
    const esc = v => String(v == null ? "" : v).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
    let ords = estado.ordens;
    if (dias > 0) { const corte = agora.getTime() - dias * 86400000; ords = ords.filter(o => { const dt = parseDt(o.abertura || o.created_at); return !dt || dt.getTime() >= corte; }); }
    const total = ords.length, val = valorDe;
    const custo = ords.reduce((t, o) => t + val(o), 0);
    const abertas = ords.filter(o => !o.fechamento && !o.cancelado).length;
    const slas = ords.filter(o => o.fechamento && o.sla_minutos).map(o => Number(o.sla_minutos));
    const slaMed = slas.length ? slas.reduce((x, y) => x + y, 0) / slas.length : 0;
    const ordensPorPlaca = somarPor(ords.map(o => String(o.placa || "").toUpperCase()).filter(Boolean), p => p);
    const nP = Object.keys(ordensPorPlaca).length, reinc = nP ? Object.values(ordensPorPlaca).filter(v => v > 1).length / nP * 100 : 0;
    const agg = fn => Object.entries(agrupar(ords, fn, "Não informado", () => ({ qtd: 0, custo: 0 }), (x, o) => { x.qtd++; x.custo += val(o); })).sort((x, y) => y[1].qtd - x[1].qtd);
    const TL = { mecanico: "Mecânico", eletrico: "Elétrico", eletronica: "Eletrônica", eletrica_mecanica: "Elétrica/Mecânica", borracharia: "Borracharia", guincho: "Guincho" };
    const porModelo = agg(o => o.modelo).slice(0, 5), porUnid = agg(o => o.operacao).slice(0, 5);
    const porTipo = agg(o => TL[o.tipo_servico || ""] || o.tipo_servico || "Outros");
    const porFalha = agg(o => String(o.descricao || "").slice(0, 28) || null).slice(0, 6);
    const brl0 = v => Number(v || 0).toLocaleString("pt-BR", { maximumFractionDigits: 0 });
    const barra = (nome, qtd, cv, maxq, cor = "#25D647") => "<tr><td class='nm'>" + esc(String(nome).slice(0, 26)) + "</td><td class='tk'><div class='fl' style='width:" + (maxq ? Math.round(qtd / maxq * 100) : 0) + "%;background:" + cor + "'></div></td><td class='vl'>" + qtd + "</td><td class='cs'>R$ " + brl0(cv) + "</td></tr>";
    const rows = (lst, cor) => lst.map(([k, v]) => barra(k, v.qtd, v.custo, lst.length ? lst[0][1].qtd : 1, cor)).join("");
    const topM = porModelo[0] ? porModelo[0][0] : "—", topU = porUnid[0] ? porUnid[0][0] : "—", topF = porFalha[0] ? porFalha[0][0] : "—";
    const shareU = porUnid[0] && total ? Math.round(porUnid[0][1].qtd / total * 100) : 0;
    const ins = "<li><b>" + esc(topU) + "</b> concentra " + shareU + "% das O.S. do período.</li><li><b>" + esc(topM) + "</b> é o modelo com mais ocorrências (" + (porModelo[0] ? porModelo[0][1].qtd : 0) + ").</li><li><b>" + esc(topF) + "</b> lidera as falhas registradas: revisar reduziria reincidência.</li>";
    const dataTxt = agora.toLocaleString("pt-BR", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    const html = "<!doctype html><html lang='pt-BR'><head><meta charset='utf-8'><title>Resumo Executivo — Print</title><style>" +
      "body{font-family:Arial,Helvetica,sans-serif;color:#2B3230;margin:22px;background:#fff}.hd{display:flex;justify-content:space-between;border-bottom:3px solid #0C4817;padding-bottom:9px}.t{font-size:20px;font-weight:800;color:#0C4817;margin:0}.s{font-size:10px;color:#7A7A7A}.k{display:flex;gap:7px;margin:12px 0}.k div{flex:1;border:1px solid #E2E7E0;border-radius:7px;padding:8px 10px}.k span{font-size:8px;letter-spacing:.8px;color:#7A7A7A}.k b{display:block;font-size:17px;color:#0C4817;margin-top:2px}.sec{font-size:9px;font-weight:800;letter-spacing:.9px;color:#146E1F;margin:12px 0 5px;border-bottom:1px solid #E2E7E0;padding-bottom:3px}table.w{width:100%;border-collapse:collapse;font-size:9px}td{padding:3px 5px}td.nm{width:110px;color:#2B3230;font-weight:600}td.tk div{height:6px;border-radius:3px;background:#25D647}td.vl{width:28px;text-align:right;font-weight:700;font-family:monospace}td.cs{width:66px;text-align:right;color:#7A7A7A;font-family:monospace}.tipo{display:flex;justify-content:space-between;font-size:9px;padding:2px 0;color:#505050}.tipo .q{font-weight:700;color:#2B3230;font-family:monospace}.ins{background:#F7FBF6;border:1px solid #CBE9CF;border-radius:6px;padding:8px 10px;margin-top:4px}.ins ul{margin:0;padding-left:14px}.ins li{font-size:9px;color:#505050;line-height:1.6}.ft{margin-top:10px;border-top:1px solid #E2E7E0;padding-top:6px;font-size:8px;color:#7A7A7A}@media print{body{margin:8mm}}" +
      "</style></head><body><div class='hd'><div><div style='font-size:9px;letter-spacing:1.6px;color:#7A7A7A'>PRINT TRANSPORTADORA</div><h1 class='t'>RESUMO EXECUTIVO DA MANUTENÇÃO</h1><div class='s'>Control Tower Service · últimos " + (dias > 0 ? dias : "todos") + " dias · " + dataTxt + "</div></div><div style='text-align:right;font-size:9px;color:#7A7A7A'>Emitido por<br><b>" + esc(QUEM()) + "</b></div></div>" +
      "<div class='k'><div><span>O.S. NO PERÍODO</span><b>" + total + "</b></div><div><span>EM ABERTO</span><b>" + abertas + "</b></div><div><span>CUSTO TOTAL</span><b>R$ " + brl0(custo) + "</b></div><div><span>SLA MÉDIO</span><b>" + (slaMed ? Math.floor(slaMed / 60) + "h" + pad(Math.floor(slaMed % 60)) : "—") + "</b></div><div><span>REINCIDÊNCIA</span><b>" + reinc.toFixed(1).replace(".", ",") + "%</b></div></div>" +
      "<div class='sec'>FALHAS POR MODELO DE VEÍCULO</div><table class='w'>" + (rows(porModelo) || "<tr><td>Sem dados</td></tr>") + "</table>" +
      "<div class='sec'>ORDENS POR UNIDADE</div><table class='w'>" + (rows(porUnid, "#1E88E5") || "<tr><td>Sem dados</td></tr>") + "</table>" +
      "<div class='sec'>PRINCIPAIS FALHAS (PARETO)</div><table class='w'>" + (rows(porFalha, "#C62828") || "<tr><td>Sem dados</td></tr>") + "</table>" +
      "<div class='sec'>TIPO DE MANUTENÇÃO</div>" + (porTipo.slice(0, 6).map(([k, v]) => "<div class='tipo'><span class='t'>" + esc(k) + "</span><span class='q'>" + v.qtd + "</span></div>").join("") || "<div class='tipo'>Sem dados</div>") +
      "<div class='sec'>INSIGHTS GERENCIAIS</div><div class='ins'><ul>" + ins + "</ul></div><div class='ft'>Print · Control Tower Service</div></body></html>";
    return ok({ html, total, dias });
  }
  if (a === "escalonamento") {
    const cfg = { ...DEF_CONFIG, ...(estado.config || {}) };
    const hS = Number(cfg.escalonamento_supervisor_h) || 2, hG = Number(cfg.escalonamento_gerencia_h) || 4;
    const agora = Date.now(); const out = [];
    estado.ordens.forEach(o => {
      if (o.fechamento || o.cancelado) return;
      const base = o.ultima_atualizacao || o.abertura; if (!base) return;
      const dt = parseDt(base); if (!dt) return;
      const horas = (agora - dt) / 3600000;
      if (horas >= hS) out.push({ id: o.id, os: o.os, placa: o.placa, status: o.status, operacao: o.operacao, horas_parada: arred1(horas), nivel: horas >= hG ? "GERENCIA" : "SUPERVISOR", ultima_atualizacao: base });
    });
    out.sort((x, y) => y.horas_parada - x.horas_parada);
    return ok({ data: out, total: out.length, gerencia: out.filter(x => x.nivel === "GERENCIA").length });
  }
  if (a === "stats" && b === "orcado") {
    const agg = fn => Object.entries(agrupar(estado.ordens, fn, "Sem info", () => ({ orcado: 0, realizado: 0, qtd: 0 }), (d, o) => { d.orcado += Number(o.valor_orcado) || 0; d.realizado += valorDe(o); d.qtd++; }))
      .map(([nome, d]) => { const base = d.orcado || d.realizado || 1; return { nome, ...d, desvio_pct: d.orcado ? arred1(((d.realizado - d.orcado) / base) * 100) : 0 }; }).sort((x, y) => y.realizado - x.realizado);
    const pm = Object.fromEntries(estado.prestadores.map(p => [p.id, p.nome]));
    return ok({ por_prestador: agg(o => o.prestador_nome || pm[o.prestador_id] || "Sem prestador"), por_filial: agg(o => o.operacao),
      totais: { orcado: estado.ordens.reduce((t, o) => t + (Number(o.valor_orcado) || 0), 0), realizado: estado.ordens.reduce((t, o) => t + valorDe(o), 0), ordens: estado.ordens.length } });
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
  const soMarcaLida = seg[0] === "notificacoes" && seg[2] === "ler";   // operador marca como lida só na tela
  if (mth !== "GET" && !soMarcaLida && (!podeEditar || (seg[0] === "configuracoes" && ROLE !== "admin")))
    return J({ detail: "Sem permissão para alterar. Fale com um administrador." }, 403);
  let res;
  try { res = route(mth, path,new URLSearchParams(qs || ""), body); } catch (e) { res = { s: (e && e.status) || 500, b: { detail: String(e && e.message || e) } }; }
  return new Response(JSON.stringify(res.b), { status: res.s, headers: { "Content-Type": "application/json" } });
};
