// Testes da importação de planilhas (T6) e do aviso de falha de gravação.
// USO: node --test fonte/testes/importar.test.mjs
// Não usa banco nem rede: o "banco" é um objeto falso que aceita ou recusa as gravações.
import test from "node:test";
import assert from "node:assert/strict";

// Ambiente mínimo de navegador para o backend.js (ele intercepta window.fetch).
const eventos = [];
globalThis.window = { fetch: async () => new Response("{}"), dispatchEvent: e => { eventos.push(e); return true; } };

const imp = await import("../importar.js");
const be = await import("../backend.js");
const chamar = async (metodo, url, corpo) => {
  const r = await window.fetch("/api" + url, { method: metodo, body: corpo === undefined ? undefined : JSON.stringify(corpo) });
  return { status: r.status, json: await r.json() };
};

test("valores: CNPJ, CPF, número BR, Sim/Não, placa e datas", () => {
  assert.equal(imp.cnpjValido("11.222.333/0001-81"), true);
  assert.equal(imp.cnpjValido("12.345.678/0001-90"), false);   // exemplo do modelo: inválido de propósito
  assert.equal(imp.cnpjValido("00.000.000/0000-00"), false);
  assert.equal(imp.cpfValido("529.982.247-25"), true);
  assert.equal(imp.cpfValido("111.111.111-11"), false);
  assert.equal(imp.numeroBR("R$ 1.234,56"), 1234.56);
  assert.equal(imp.numeroBR("1234.5"), 1234.5);
  assert.equal(imp.numeroBR(""), 0);
  assert.equal(imp.numeroBR("abc"), null);
  assert.equal(imp.simNao("Não"), false);
  assert.equal(imp.simNao("SIM"), true);
  assert.equal(imp.simNao("talvez"), null);
  assert.equal(imp.placaValida("abc-1d23"), "ABC1D23");
  assert.equal(imp.placaValida("AB1234"), "");
  assert.equal(imp.dataHoraBR("17/11/2026 08:30"), "2026-11-17T08:30:00-03:00");
  assert.equal(imp.dataHoraBR("17/11/2026, 14:05:09"), "2026-11-17T14:05:09-03:00");
  assert.equal(imp.dataHoraBR("2026-11-17"), "2026-11-17T00:00:00-03:00");
  assert.equal(imp.dataHoraBR("2026-11-17T12:00:00Z"), "2026-11-17T09:00:00-03:00");
  assert.equal(imp.dataHoraBR(46343), "2026-11-17T00:00:00-03:00");   // série do Excel
  assert.equal(imp.dataHoraBR("31/02/2026"), null);
  assert.equal(imp.dataHoraBR(""), "");
});

test("prestadores: valida, não duplica e explica cada linha ignorada", () => {
  const existentes = [{ id: "p1", nome: "Guincho Já", cnpj: "11.222.333/0001-81", cidade: "Jundiaí" }, { id: "p2", nome: "Oficina Sem Doc", cnpj: "", cidade: "Campinas" }];
  const linhas = [
    { "Nome": "Nova Mecânica", "CNPJ": "11444777000161", "Cidade": "Santos", "Estado (UF)": "sp", "Tipo de Serviço": "Mecânico", "Telefone": "(13) 3333-0000", "Socorro 24h": "Sim", "Fatura": "Não" },
    { "Nome": "Repetida", "CNPJ": "11.222.333/0001-81", "Cidade": "X", "Estado (UF)": "SP", "Tipo de Serviço": "guincho", "Socorro 24h": "Sim", "Fatura": "Sim" },
    { "Nome": "oficina sem doc", "CNPJ": "", "Cidade": "CAMPINAS", "Estado (UF)": "SP", "Tipo de Serviço": "", "Socorro 24h": "", "Fatura": "" },
    { "Nome": "", "CNPJ": "11444777000161" },
    { "Nome": "CNPJ ruim", "CNPJ": "12.345.678/0001-90" },
    { "Nome": "UF ruim", "Estado (UF)": "XX" },
    { "Nome": "Tipo ruim", "Tipo de Serviço": "astronauta" },
    { "Nome": "24h ruim", "Socorro 24h": "talvez" },
    { "Nome": "Dup no arquivo", "CNPJ": "11.444.777/0001-61" },
    { "Nome": "", "CNPJ": "", "Cidade": "" },                       // linha vazia: some sem aviso
    { "Nome": "CPF ok", "CNPJ": 52998224725, "Tipo de Serviço": "Borracharia" },
    { "Nome": "CNPJ numérico", "CNPJ": 4252011000110, "Tipo de Serviço": "eletrico" },   // célula numérica sem o zero à esquerda
  ];
  const { novos, ignorados } = imp.prepararPrestadores(linhas, existentes);
  assert.deepEqual(novos.map(n => n.nome), ["Nova Mecânica", "CPF ok", "CNPJ numérico"]);
  assert.equal(novos[0].cnpj, "11.444.777/0001-61");
  assert.equal(novos[0].estado, "SP");
  assert.equal(novos[0].tipo_servico, "mecanico");
  assert.equal(novos[0].socorro_24h, true);
  assert.equal(novos[0].fatura, false);
  assert.equal(novos[1].cnpj, "529.982.247-25");
  assert.equal(novos[2].cnpj, "04.252.011/0001-10");
  const motivos = Object.fromEntries(ignorados.map(x => [x.linha, x.motivo]));
  assert.match(motivos[3], /Já cadastrado com este CNPJ\/CPF/);
  assert.match(motivos[4], /mesmo nome e cidade/);
  assert.match(motivos[5], /Nome vazio/);
  assert.match(motivos[6], /CNPJ\/CPF inválido/);
  assert.match(motivos[7], /UF inválida/);
  assert.match(motivos[8], /Tipo de serviço desconhecido/);
  assert.match(motivos[9], /Socorro 24h/);
  assert.match(motivos[10], /Já cadastrado/);   // duplicada dentro do próprio arquivo
  assert.equal(motivos[11], undefined);
  assert.equal(ignorados.length, 8);
});

test("O.S.: número, placa, status, valores, datas e numeração automática", () => {
  const existentes = [{ os: "100", placa: "AAA1111" }, { os: "0102", placa: "BBB2222" }];
  const prestadores = [{ id: "p9", nome: "Guincho Já" }];
  const linhas = [
    { "O.S.": "", "Placa": "abc1d23", "Data": "17/11/2026", "Status": "", "Valor final": "1.500,00", "Prestador": "guincho já" },
    { "O.S.": "100", "Placa": "CCC3333" },
    { "O.S.": "101", "Placa": "DDD4444", "Status": "Veículo liberado", "Abertura": "17/11/2026 08:00", "Fechamento": "17/11/2026 09:30", "Valor orçado": 900 },
    { "O.S.": "", "Placa": "", "Motorista": "sem placa" },
    { "O.S.": "", "Placa": "XYZ" },
    { "O.S.": "", "Placa": "EEE5555", "Status": "Cancelada" },
    { "O.S.": "", "Placa": "EEE5555", "Status": "Voando" },
    { "O.S.": "", "Placa": "EEE5555", "Valor final": "muito" },
    { "O.S.": "", "Placa": "EEE5555", "Status": "Rebocado" },
    { "O.S.": "", "Placa": "EEE5555", "Data": "40/40/2026" },
    { "O.S.": "", "Placa": "EEE5555", "Abertura": "17/11/2026 10:00", "Fechamento": "17/11/2026 09:00", "Status": "Liberado" },
    { "O.S.": "103", "Placa": "FFF6666" },
    { "O.S.": "103", "Placa": "GGG7777" },
  ];
  const { novos, ignorados } = imp.prepararOrdens(linhas, existentes, prestadores, "2026-11-18T10:00:00-03:00");
  assert.deepEqual(novos.map(o => o.os), ["104", "101", "103"]);   // a sem número pula 101 e 103, que aparecem abaixo
  const [a, b] = novos;
  assert.equal(a.placa, "ABC1D23");
  assert.equal(a.status, "Aguardando");
  assert.equal(a.valor, 1500);
  assert.equal(a.prestador_id, "p9");
  assert.equal(a.prestador_nome, "Guincho Já");
  assert.equal(a.abertura, "2026-11-17T00:00:00-03:00");
  assert.equal(a.data, "2026-11-17");
  assert.equal(a.fechamento, undefined);
  assert.equal(b.fechamento, "2026-11-17T09:30:00-03:00");
  assert.equal(b.sla_minutos, 90);
  assert.equal(b.valor_orcado, 900);
  const motivos = Object.fromEntries(ignorados.map(x => [x.linha, x.motivo]));
  assert.match(motivos[3], /O.S. 100 já existe/);
  assert.match(motivos[5], /Placa vazia/);
  assert.match(motivos[6], /Placa inválida/);
  assert.match(motivos[7], /cancelada não é importada/);
  assert.match(motivos[8], /Status desconhecido/);
  assert.match(motivos[9], /Valor inválido/);
  assert.match(motivos[10], /pede a data de fechamento/);
  assert.match(motivos[11], /Data inválida/);
  assert.match(motivos[12], /Fechamento anterior/);
  assert.match(motivos[14], /O.S. 103 já existe/);
  assert.equal(ignorados.length, 10);
});

// ── rotas do backend.js ──
function bancoFalso({ recusar = () => false } = {}) {
  const gravados = [];
  return {
    gravados,
    collection: col => ({
      onSnapshot: cb => { cb({ docs: [] }); return () => {}; },
      doc: id => ({
        set: async data => { if (recusar(col, data)) throw new Error("new row violates row-level security policy"); gravados.push({ col, id, data }); },
        delete: async () => { if (recusar(col)) throw new Error("permission denied"); gravados.push({ col, id, apagado: true }); },
      }),
    }),
  };
}
const esperar = () => new Promise(r => setTimeout(r, 20));
const LINHAS = [
  { "Nome": "Oficina A", "CNPJ": "11.444.777/0001-61", "Tipo de Serviço": "mecanico", "Socorro 24h": "Sim", "Fatura": "Sim" },
  { "Nome": "Oficina B", "CNPJ": "", "Cidade": "Recife", "Tipo de Serviço": "guincho" },
  { "Nome": "Ruim", "CNPJ": "123" },
];

test("rota de importação: operador não importa; simulação não grava; gerente importa sem apagar nada", async () => {
  const db = bancoFalso();
  be.startBackend(db);
  be.setUser({ email: "teste@exemplo", role: "operador" });
  let r = await chamar("POST", "/prestadores/import", { linhas: LINHAS, simular: true });
  assert.equal(r.status, 403);

  be.setUser({ email: "teste@exemplo", role: "gerente" });
  r = await chamar("POST", "/prestadores/import", { linhas: LINHAS, simular: true });
  assert.equal(r.status, 200);
  assert.equal(r.json.prontos, 2);
  assert.equal(r.json.ignorados.length, 1);
  await esperar();
  assert.equal(db.gravados.length, 0);

  r = await chamar("POST", "/prestadores/import", { linhas: LINHAS });
  assert.equal(r.json.importados, 2);
  assert.equal(r.json.falhas.length, 0);
  await esperar();
  assert.equal(db.gravados.filter(g => g.col === "prestadores").length, 2);
  assert.equal(db.gravados.filter(g => g.apagado).length, 0);
  assert.equal((await chamar("GET", "/prestadores")).json.total, 2);

  // De novo: tudo já existe, nada é gravado.
  r = await chamar("POST", "/prestadores/import", { linhas: LINHAS });
  assert.equal(r.json.importados, 0);
  assert.equal(r.json.ignorados.length, 3);

  // Gerente importa O.S.
  r = await chamar("POST", "/ordens/import", { linhas: [{ "O.S.": "", "Placa": "ABC1D23", "Motorista": "fulano de tal" }] });
  assert.equal(r.json.importados, 1);
  const os = (await chamar("GET", "/ordens")).json.data[0];
  assert.equal(os.os, "1");
  assert.equal(os.motorista, "Fulano De Tal");
  assert.equal(os.historico[0].etapa, "OS_IMPORTADA");
});

test("falha do banco: a tela desfaz a mudança e avisa o usuário", async () => {
  const db = bancoFalso({ recusar: (col, data) => col === "prestadores" && data && data.nome === "Oficina B" });
  be.startBackend(db);
  be.setUser({ email: "teste@exemplo", role: "admin" });
  const antes = (await chamar("GET", "/prestadores")).json.total;
  eventos.length = 0;
  const r = await chamar("POST", "/prestadores/import", { linhas: [{ "Nome": "Oficina B", "Cidade": "Natal" }, { "Nome": "Oficina C", "Cidade": "Natal" }] });
  assert.equal(r.json.importados, 1);
  assert.equal(r.json.falhas.length, 1);
  assert.equal(r.json.falhas[0].linha, 2);
  assert.equal((await chamar("GET", "/prestadores")).json.total, antes + 1);   // a recusada saiu da tela
  assert.equal(eventos.filter(e => e.type === "painel:erro-gravacao").length, 1);   // um aviso só para o lote

  // Gravação comum (fora da importação) recusada: desfaz e avisa.
  eventos.length = 0;
  const novo = await chamar("POST", "/prestadores", { nome: "Oficina B" });
  assert.equal(novo.status, 200);
  await esperar();
  assert.equal((await chamar("GET", "/prestadores")).json.data.some(p => p.id === novo.json.data.id), false);
  assert.equal(eventos.length, 1);
  assert.match(eventos[0].detail.mensagem, /Não foi possível salvar \(prestador\)/);
});

