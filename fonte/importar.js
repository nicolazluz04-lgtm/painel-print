// Importação de planilhas (.xlsx/.csv) de prestadores e de O.S., feita toda no navegador.
// - lerPlanilha(arquivo): lê o arquivo com a biblioteca XLSX (já carregada pela página) e devolve as linhas.
// - prepararPrestadores / prepararOrdens: funções puras que validam as linhas contra o que já existe e
//   devolvem { novos, ignorados }. Nunca apagam nem alteram registros existentes: só criam novos.
// As gravações são feitas pelo backend.js (rotas POST /prestadores/import e /ordens/import), que respeita
// as permissões do papel (gerente e admin) e devolve o resumo.

export const LIMITE_LINHAS = 2000;

// ── normalização ──
const semAcento = s => String(s == null ? "" : s).normalize("NFD").replace(/[̀-ͯ]/g, "");
export const chaveCabecalho = s => semAcento(s).toLowerCase().replace(/[^a-z0-9]/g, "");
const texto = v => (v == null ? "" : String(v)).replace(/\s+/g, " ").trim();
const chaveNome = s => semAcento(s).toLowerCase().replace(/[^a-z0-9]/g, "");
const digitos = v => String(v == null ? "" : v).replace(/\D/g, "");
const pad = (n, l = 2) => String(n).padStart(l, "0");

// Cabeçalho da planilha → campo. Aceita os nomes do modelo, os da exportação do painel e variações comuns.
function mapaCampos(sinonimos) {
  const m = {};
  Object.entries(sinonimos).forEach(([campo, nomes]) => nomes.forEach(n => { m[chaveCabecalho(n)] = campo; }));
  return m;
}
const CAMPOS_PRESTADOR = mapaCampos({
  nome: ["Nome", "Razão social", "Prestador", "Nome fantasia"],
  cnpj: ["CNPJ", "CNPJ/CPF", "CPF/CNPJ", "Documento"],
  cidade: ["Cidade", "Município"],
  estado: ["Estado (UF)", "Estado", "UF"],
  tipo_servico: ["Tipo de Serviço", "Tipo de servico", "Tipo", "Serviço"],
  telefone: ["Telefone", "Fone", "Celular", "WhatsApp"],
  socorro_24h: ["Socorro 24h", "24h", "Atende 24h"],
  fatura: ["Fatura", "Faturamento", "Faturado"],
  lat: ["Latitude", "Lat"],
  lng: ["Longitude", "Lng", "Lon"],
});
const CAMPOS_ORDEM = mapaCampos({
  os: ["O.S.", "OS", "Nº O.S.", "Número da O.S.", "Numero OS", "Ordem de serviço"],
  data: ["Data"],
  placa: ["Placa"],
  marca: ["Marca"],
  modelo: ["Modelo"],
  operacao: ["Filial", "Operação", "Unidade"],
  origem: ["Origem"],
  grupo_os: ["Grupo"],
  sistema: ["Sistema"],
  item_defeito: ["Item"],
  falha: ["Falha"],
  complemento_defeito: ["Complemento"],
  cod_defeito: ["Cód. defeito", "Código do defeito"],
  execucao: ["Execução"],
  status: ["Status", "Andamento"],
  resultado: ["Resultado"],
  prestador_nome: ["Prestador"],
  valor_orcado: ["Valor orçado", "Orçado"],
  valor: ["Valor final", "Valor"],
  abertura: ["Abertura", "Data de abertura"],
  fechamento: ["Fechamento", "Data de fechamento"],
  motorista: ["Motorista"],
  telefone: ["Telefone"],
  segmento: ["Segmento"],
  tipo_servico: ["Tipo de serviço", "Tipo de servico"],
  tipo_veiculo: ["Tipo de veículo", "Tipo veiculo"],
  prioridade: ["Prioridade"],
  rodovia: ["Rodovia"],
  km: ["KM", "Km"],
  localizacao: ["Localização", "Local"],
  descricao: ["Descrição", "Defeito", "Problema"],
  forma_pagamento: ["Forma de pagamento", "Pagamento"],
  carga: ["Carga"],
  observacoes: ["Observações", "Obs"],
  operador: ["Operador"],
});

// Converte uma linha { "Cabeçalho": valor } em { campo: valor }; colunas desconhecidas são ignoradas.
function mapearLinha(linha, campos) {
  const out = {};
  Object.entries(linha || {}).forEach(([k, v]) => { const c = campos[chaveCabecalho(k)]; if (c && !(c in out && texto(out[c]))) out[c] = v; });
  return out;
}
const linhaVazia = l => Object.values(l || {}).every(v => texto(v) === "");

// ── valores ──
const SIM = new Set(["sim", "s", "yes", "y", "x", "true", "1", "verdadeiro"]);
const NAO = new Set(["nao", "n", "no", "false", "0", "falso", ""]);
/** "Sim"/"Não" → true/false; outro valor → null (inválido). */
export function simNao(v) {
  if (v === true || v === false) return v;
  const k = semAcento(texto(v)).toLowerCase();
  if (SIM.has(k)) return true;
  if (NAO.has(k)) return false;
  return null;
}

/** Número em formato brasileiro ou de planilha ("R$ 1.234,56", "1234.56", 1234.56). Vazio → 0; inválido → null. */
export function numeroBR(v) {
  if (typeof v === "number") return isFinite(v) ? v : null;
  let s = texto(v).replace(/^R\$\s*/i, "").replace(/\s/g, "");
  if (!s) return 0;
  if (/,\d{1,2}$/.test(s) || (s.includes(",") && !s.includes("."))) s = s.replace(/\./g, "").replace(",", ".");
  else s = s.replace(/,/g, "");
  if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
  return Number(s);
}

/** CNPJ com 14 dígitos e dígitos verificadores corretos. */
export function cnpjValido(v) {
  const d = digitos(v);
  if (d.length !== 14 || /^(\d)\1{13}$/.test(d)) return false;
  const dv = n => { const pesos = n === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]; const s = pesos.reduce((t, p, i) => t + p * Number(d[i]), 0) % 11; return s < 2 ? 0 : 11 - s; };
  return dv(12) === Number(d[12]) && dv(13) === Number(d[13]);
}
/** CPF com 11 dígitos e dígitos verificadores corretos (prestador pessoa física). */
export function cpfValido(v) {
  const d = digitos(v);
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
  const dv = n => { let s = 0; for (let i = 0; i < n; i++) s += Number(d[i]) * (n + 1 - i); const r = (s * 10) % 11; return r === 10 ? 0 : r; };
  return dv(9) === Number(d[9]) && dv(10) === Number(d[10]);
}
const fmtCnpj = d => `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
const fmtCpf = d => `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;

export const UFS = new Set(["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"]);

// Tipos de serviço do cadastro de prestadores (os mesmos do formulário "Novo Prestador").
const TIPOS_SERVICO = { mecanico: "Mecânico", eletrico: "Elétrico", eletronica: "Eletrônica", eletrica_mecanica: "Elétrica/Mecânica", borracharia: "Borracharia", guincho: "Guincho", funilaria: "Funilaria", bau: "Baú" };
const TIPO_POR_CHAVE = {};
Object.entries(TIPOS_SERVICO).forEach(([id, rotulo]) => { TIPO_POR_CHAVE[chaveCabecalho(id)] = id; TIPO_POR_CHAVE[chaveCabecalho(rotulo)] = id; });
Object.assign(TIPO_POR_CHAVE, { mecanica: "mecanico", eletrica: "eletrico", eletricamecanica: "eletrica_mecanica", reboque: "guincho" });
/** Tipo de serviço da planilha → id do painel ("" → mecanico; desconhecido → null). */
export function tipoServico(v) {
  const k = chaveCabecalho(v);
  if (!k) return "mecanico";
  return TIPO_POR_CHAVE[k] || null;
}

/** Placa brasileira (antiga ABC1234 ou Mercosul ABC1D23), sem hífen/espaço. Inválida → "". */
export function placaValida(v) {
  const p = texto(v).toUpperCase().replace(/[\s-]/g, "");
  return /^[A-Z]{3}\d[A-Z0-9]\d{2}$/.test(p) ? p : "";
}

/** Data/hora da planilha → "AAAA-MM-DDTHH:MM:SS-03:00" (Brasília). Vazio → ""; inválida → null.
 *  Aceita dd/mm/aaaa [hh:mm[:ss]], aaaa-mm-dd[Thh:mm…] e número de série do Excel. */
export function dataHoraBR(v) {
  if (v == null || v === "") return "";
  if (v instanceof Date) return isNaN(v) ? null : `${v.getFullYear()}-${pad(v.getMonth() + 1)}-${pad(v.getDate())}T${pad(v.getHours())}:${pad(v.getMinutes())}:${pad(v.getSeconds())}-03:00`;
  if (typeof v === "number") {
    if (!(v > 1 && v < 2958466)) return null;   // série do Excel: dias desde 30/12/1899
    const ms = Math.round((v - 25569) * 864e5), d = new Date(ms);
    return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}T${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}-03:00`;
  }
  const s = texto(v);
  let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})(?:[,\s]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
  let a, mes, dia, h = 0, mi = 0, se = 0;
  if (m) { dia = +m[1]; mes = +m[2]; a = +m[3]; if (a < 100) a += 2000; h = +(m[4] || 0); mi = +(m[5] || 0); se = +(m[6] || 0); }
  else {
    m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/);
    if (!m) return null;
    if (m[7]) { const d = new Date(s); if (isNaN(d)) return null; return dataHoraBR(new Date(d.getTime() + (d.getTimezoneOffset() - 180) * 60000)); }
    a = +m[1]; mes = +m[2]; dia = +m[3]; h = +(m[4] || 0); mi = +(m[5] || 0); se = +(m[6] || 0);
  }
  const d = new Date(Date.UTC(a, mes - 1, dia, h, mi, se));
  if (d.getUTCFullYear() !== a || d.getUTCMonth() !== mes - 1 || d.getUTCDate() !== dia || h > 23 || mi > 59 || se > 59) return null;
  return `${a}-${pad(mes)}-${pad(dia)}T${pad(h)}:${pad(mi)}:${pad(se)}-03:00`;
}

// ── prestadores ──
/**
 * Valida as linhas da planilha de prestadores.
 * @param linhas      [{ "Nome": …, "CNPJ": … }] (cabeçalho da 1ª linha da planilha)
 * @param existentes  prestadores já cadastrados (para não duplicar)
 * @returns { novos: [{ nome, cnpj, … }], ignorados: [{ linha, nome, motivo }] }  linha = número da linha na planilha
 */
export function prepararPrestadores(linhas, existentes = []) {
  const novos = [], ignorados = [];
  const porDoc = new Map(), porNome = new Map();
  existentes.forEach(p => { const d = digitos(p.cnpj); if (d) porDoc.set(d, p.nome || ""); porNome.set(chaveNome(p.nome) + "|" + chaveNome(p.cidade), p.nome || ""); });
  (linhas || []).forEach((bruta, i) => {
    const linha = i + 2;
    if (linhaVazia(bruta)) return;
    const r = mapearLinha(bruta, CAMPOS_PRESTADOR);
    const nome = texto(r.nome);
    const ignorar = motivo => ignorados.push({ linha, nome, motivo });
    if (!nome) return ignorar("Nome vazio");
    if (/^exemplo\b/i.test(nome)) return ignorar("Linha de exemplo do modelo (apague-a ou troque pelos dados reais)");
    let doc = digitos(typeof r.cnpj === "number" ? Math.round(r.cnpj) : r.cnpj);
    if (doc && typeof r.cnpj === "number" && doc.length === 13) doc = "0" + doc;   // célula numérica perde o zero à esquerda
    let cnpj = "";
    if (doc) {
      if (cnpjValido(doc)) cnpj = fmtCnpj(doc);
      else if (cpfValido(doc)) cnpj = fmtCpf(doc);
      else return ignorar(`CNPJ/CPF inválido (${texto(r.cnpj)})`);
    }
    const estado = texto(r.estado).toUpperCase();
    if (estado && !UFS.has(estado)) return ignorar(`UF inválida (${texto(r.estado)})`);
    const tipo = tipoServico(r.tipo_servico);
    if (!tipo) return ignorar(`Tipo de serviço desconhecido (${texto(r.tipo_servico)})`);
    const s24 = simNao(r.socorro_24h), fat = simNao(r.fatura);
    if (s24 === null) return ignorar(`Socorro 24h deve ser Sim ou Não (${texto(r.socorro_24h)})`);
    if (fat === null) return ignorar(`Fatura deve ser Sim ou Não (${texto(r.fatura)})`);
    const cidade = texto(r.cidade);
    const kNome = chaveNome(nome) + "|" + chaveNome(cidade);
    if (doc && porDoc.has(doc)) return ignorar(`Já cadastrado com este CNPJ/CPF (${porDoc.get(doc)})`);
    if (!doc && porNome.has(kNome)) return ignorar("Já cadastrado com o mesmo nome e cidade");
    const p = { nome, cnpj, cidade, estado, tipo_servico: tipo, telefone: texto(r.telefone), socorro_24h: s24, fatura: fat };
    const lat = numeroBR(r.lat), lng = numeroBR(r.lng);
    if (texto(r.lat) && texto(r.lng)) {
      if (lat === null || lng === null || Math.abs(lat) > 90 || Math.abs(lng) > 180) return ignorar("Latitude/longitude inválidas");
      p.lat = lat; p.lng = lng;
    }
    if (doc) porDoc.set(doc, nome);
    porNome.set(kNome, nome);
    novos.push({ ...p, _linha: linha });
  });
  return { novos, ignorados };
}

// ── ordens de serviço ──
const STATUS_ABERTOS = ["Aguardando", "Prestador localizado", "Prestador a caminho", "Prestador no local", "Aguardando Orçamento", "Serviço em execução", "Em atendimento"];
const STATUS_FECHADOS = ["Veículo liberado", "Liberado", "Rebocado", "Concluído", "O.S. fechada"];
const STATUS_POR_CHAVE = Object.fromEntries([...STATUS_ABERTOS, ...STATUS_FECHADOS].map(s => [chaveCabecalho(s), s]));
const CANCELADA = new Set(["cancelada", "cancelado", "oscancelada"]);
const normOs = v => { const s = texto(typeof v === "number" ? Math.round(v) : v); return s ? (s.replace(/^0+/, "") || "0") : ""; };

/**
 * Valida as linhas da planilha de O.S. (mesmas colunas da exportação "Ordens de serviço (Excel)").
 * @param linhas       [{ "O.S.": …, "Placa": … }]
 * @param existentes   O.S. já cadastradas (não duplica pelo número da O.S.)
 * @param prestadores  para ligar a coluna "Prestador" ao cadastro (pelo nome)
 * @param agora        data/hora atual em Brasília (abertura padrão)
 * @returns { novos, ignorados }. O.S. sem número recebem o próximo número livre.
 */
export function prepararOrdens(linhas, existentes = [], prestadores = [], agora = "") {
  const novos = [], ignorados = [];
  const usados = new Set(existentes.map(o => normOs(o.os)).filter(Boolean));
  const prestPorNome = new Map(prestadores.map(p => [chaveNome(p.nome), p]));
  let proximo = existentes.reduce((m, o) => Math.max(m, parseInt(o.os, 10) || 0), 0);
  const semNumero = [];
  (linhas || []).forEach((bruta, i) => {
    const linha = i + 2;
    if (linhaVazia(bruta)) return;
    const r = mapearLinha(bruta, CAMPOS_ORDEM);
    const os = normOs(r.os);
    const ignorar = motivo => ignorados.push({ linha, nome: os ? "O.S. " + os : texto(r.placa), motivo });
    const placa = placaValida(r.placa);
    if (!texto(r.placa)) return ignorar("Placa vazia");
    if (!placa) return ignorar(`Placa inválida (${texto(r.placa)})`);
    if (os && usados.has(os)) return ignorar(`O.S. ${os} já existe`);
    const stRaw = texto(r.status);
    if (CANCELADA.has(chaveCabecalho(stRaw))) return ignorar("O.S. cancelada não é importada (o cancelamento passa pela aprovação de um administrador)");
    const status = stRaw ? STATUS_POR_CHAVE[chaveCabecalho(stRaw)] : "Aguardando";
    if (!status) return ignorar(`Status desconhecido (${stRaw})`);
    const valor = numeroBR(r.valor), valor_orcado = numeroBR(r.valor_orcado);
    if (valor === null) return ignorar(`Valor inválido (${texto(r.valor)})`);
    if (valor_orcado === null) return ignorar(`Valor orçado inválido (${texto(r.valor_orcado)})`);
    const data = dataHoraBR(r.data), abertura = dataHoraBR(r.abertura), fechamento = dataHoraBR(r.fechamento);
    if (data === null) return ignorar(`Data inválida (${texto(r.data)})`);
    if (abertura === null) return ignorar(`Abertura inválida (${texto(r.abertura)})`);
    if (fechamento === null) return ignorar(`Fechamento inválido (${texto(r.fechamento)})`);
    const fechada = STATUS_FECHADOS.includes(status);
    if (fechada && !fechamento) return ignorar(`Status "${status}" pede a data de fechamento`);
    const ab = abertura || (data ? data.slice(0, 10) + "T00:00:00-03:00" : agora);
    if (fechamento && fechamento < ab) return ignorar("Fechamento anterior à abertura");
    const o = { placa, status, valor, valor_orcado, abertura: ab, data: (data || ab).slice(0, 10) };
    if (fechamento) { o.fechamento = fechamento; o.sla_minutos = Math.round((new Date(fechamento) - new Date(ab)) / 6000) / 10; }
    ["marca", "modelo", "operacao", "origem", "grupo_os", "sistema", "item_defeito", "falha", "complemento_defeito", "cod_defeito", "execucao", "resultado",
      "motorista", "telefone", "segmento", "tipo_servico", "tipo_veiculo", "prioridade", "rodovia", "km", "localizacao", "descricao", "forma_pagamento", "carga", "observacoes", "operador"]
      .forEach(k => { const v = texto(r[k]); if (v) o[k] = v; });
    if (o.tipo_servico) { const t = tipoServico(o.tipo_servico); if (t) o.tipo_servico = t; }
    if (o.carga) o.carga = chaveCabecalho(o.carga);
    if (o.segmento) o.segmento = o.segmento.toLowerCase();
    const pn = texto(r.prestador_nome);
    if (pn) { const p = prestPorNome.get(chaveNome(pn)); o.prestador_nome = p ? p.nome : pn; if (p) o.prestador_id = p.id; }
    o._linha = linha;
    if (os) { usados.add(os); o.os = os; } else semNumero.push(o);
    novos.push(o);
  });
  // Numera depois de ler tudo, para não "roubar" um número que aparece mais abaixo na planilha.
  semNumero.forEach(o => { do { proximo++; } while (usados.has(String(proximo))); o.os = String(proximo); usados.add(o.os); });
  return { novos, ignorados };
}

// ── leitura do arquivo (navegador) ──
const MIME_XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
function textoCsv(bytes) {
  try { return new TextDecoder("utf-8", { fatal: true }).decode(bytes).replace(/^\uFEFF/, ""); }
  catch { return new TextDecoder("windows-1252").decode(bytes); }
}
/** Lê .xlsx/.xls/.csv com a XLSX já carregada na página. Devolve as linhas da 1ª aba que não seja de instruções. */
export async function lerPlanilha(arquivo) {
  const X = typeof window !== "undefined" && window.XLSX;
  if (!X) throw new Error("A biblioteca de planilhas não carregou. Recarregue a página.");
  const csv = /\.csv$/i.test(arquivo.name || "");
  const bytes = new Uint8Array(await arquivo.arrayBuffer());
  // CSV: texto puro (raw), para a biblioteca não ler 05/11 como 11 de maio nem "1.234,56" como 1,23456;
  // o Excel em português salva CSV em Windows-1252, então tenta UTF-8 e cai para ele.
  const wb = csv ? X.read(textoCsv(bytes), { type: "string", raw: true }) : X.read(bytes, { type: "array", cellDates: true });
  const aba = wb.SheetNames.find(n => !/instru/i.test(n)) || wb.SheetNames[0];
  const linhas = X.utils.sheet_to_json(wb.Sheets[aba], { defval: "", raw: true });
  if (linhas.length > LIMITE_LINHAS) throw new Error(`A planilha tem ${linhas.length} linhas; o limite é ${LIMITE_LINHAS} por arquivo. Divida em partes.`);
  // Datas viram texto de Brasília antes de ir para o JSON (o JSON converteria para UTC).
  return linhas.map(l => Object.fromEntries(Object.entries(l).map(([k, v]) => [k, v instanceof Date ? dataHoraBR(v) : v])));
}

/** Planilha modelo de O.S. (cabeçalho + aba de instruções com um exemplo), gerada na hora. */
export function modeloOrdensBlob() {
  const X = window.XLSX; if (!X) throw new Error("A biblioteca de planilhas não carregou. Recarregue a página.");
  const cab = ["O.S.", "Data", "Placa", "Marca", "Modelo", "Filial", "Motorista", "Telefone", "Segmento", "Tipo de serviço", "Prioridade", "Rodovia", "KM", "Descrição", "Prestador", "Status", "Valor orçado", "Valor final", "Abertura", "Fechamento", "Observações"];
  const ws = X.utils.aoa_to_sheet([cab]);
  ws["!cols"] = cab.map(c => ({ wch: Math.max(12, c.length + 2) }));
  const inst = X.utils.aoa_to_sheet([["Como preencher a planilha de O.S."], [""], ["1. Uma linha por O.S. Placa é obrigatória (ABC1234 ou ABC1D23)."], ["2. O.S. vazia recebe o próximo número livre; número que já existe no painel é ignorado."], ["3. Datas: dd/mm/aaaa ou dd/mm/aaaa hh:mm. Valores: 1.234,56."], ["4. Status fechado (Veículo liberado, Rebocado…) precisa da data de Fechamento."], ["5. O.S. cancelada não é importada: o cancelamento passa pela aprovação de um administrador."], ["6. A importação só cria O.S. novas: nada é apagado nem alterado."], [""], ["Exemplo de linha: Data 17/11/2026 · Placa ABC1D23 · Marca Volvo · Filial São Paulo · Tipo de serviço mecanico · Status Aguardando · Abertura 17/11/2026 08:30"]]);
  const wb = X.utils.book_new(); X.utils.book_append_sheet(wb, ws, "Ordens"); X.utils.book_append_sheet(wb, inst, "Instruções");
  return new Blob([X.write(wb, { type: "array", bookType: "xlsx" })], { type: MIME_XLSX });
}
