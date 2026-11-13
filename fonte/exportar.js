import { getState, callRoute } from "./backend.js";
import { calcInsights } from "./insights.js";

const fmtData = v => { try { return v ? new Date(v).toLocaleString("pt-BR") : ""; } catch (e) { return String(v || ""); } };
const brl = v => "R$ " + (Number(v) || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const tipoNome = { mecanico: "Mecânico", eletrico: "Elétrico", eletronica: "Eletrônica", eletrica_mecanica: "Elétrica/Mecânica", borracharia: "Borracharia", guincho: "Guincho", funilaria: "Funilaria", bau: "Baú", outros: "Outros" };

export function linhasOrdens() {
  return getState().ordens.map(o => ({
    "O.S.": o.os, "Placa": o.placa, "Marca": o.marca, "Modelo": o.modelo, "Filial": o.operacao, "Origem": o.origem,
    "Grupo": o.grupo_os, "Sistema": o.sistema, "Item": o.item_defeito, "Falha": o.falha, "Complemento": o.complemento_defeito, "Cód. defeito": o.cod_defeito,
    "Execução": o.execucao, "Status": o.cancelado ? "Cancelada" : o.status, "Resultado": o.resultado, "Prestador": o.prestador_nome,
    "Valor orçado": Number(o.valor_orcado) || 0, "Valor final": Number(o.valor) || 0, "Abertura": fmtData(o.abertura), "Fechamento": fmtData(o.fechamento), "SLA (min)": o.sla_minutos,
  })).sort((a, b) => String(b["O.S."]).localeCompare(String(a["O.S."]), "pt-BR", { numeric: true }));
}
export function linhasPrestadores() {
  return getState().prestadores.map(p => ({
    "Nome": p.nome, "CNPJ": p.cnpj, "Cidade": p.cidade, "UF": p.estado, "Tipo": tipoNome[p.tipo_servico] || p.tipo_servico, "Telefone": p.telefone,
    "Socorro 24h": p.socorro_24h ? "Sim" : "Não", "Fatura": p.fatura ? "Sim" : "Não", "Status": p.status,
  }));
}

async function salvar(filename, data) {
  const dl = await window.claude.use("downloads");
  if (!dl) throw { code: "unavailable" };
  return dl.save({ filename, data });
}
function xlsxBlob(nomeAba, linhas) {
  const X = window.XLSX; if (!X) throw { code: "lib" };
  const ws = X.utils.json_to_sheet(linhas.length ? linhas : [{ Aviso: "Sem dados" }]);
  const cols = Object.keys(linhas[0] || { A: 1 }).map(k => ({ wch: Math.min(38, Math.max(k.length + 2, ...linhas.slice(0, 200).map(r => String(r[k] == null ? "" : r[k]).length + 2))) }));
  ws["!cols"] = cols;
  const wb = X.utils.book_new(); X.utils.book_append_sheet(wb, ws, nomeAba);
  const arr = X.write(wb, { type: "array", bookType: "xlsx" });
  return new Blob([arr], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
}
const hoje = () => new Date().toISOString().slice(0, 10);
export const exportarOrdensExcel = () => salvar("ordens-de-servico-" + hoje() + ".xlsx", xlsxBlob("Ordens de Serviço", linhasOrdens()));
export const exportarPrestadoresExcel = () => salvar("prestadores-" + hoje() + ".xlsx", xlsxBlob("Prestadores", linhasPrestadores()));

function barras(doc, y, titulo, itens, cor, fmt) {
  const W = doc.internal.pageSize.getWidth(); const max = Math.max(1, ...itens.map(i => i.v));
  if (y + 30 + itens.length * 16 > doc.internal.pageSize.getHeight() - 50) { doc.addPage(); y = 48; }
  doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(0); doc.text(titulo, 40, y); y += 10;
  doc.setFont("helvetica", "normal"); doc.setFontSize(8);
  itens.forEach(i => { const bw = Math.max(1, (W - 80 - 150 - 90) * i.v / max);
    doc.setTextColor(40); doc.text(String(i.l).slice(0, 28), 40, y + 9);
    doc.setFillColor(cor[0], cor[1], cor[2]); doc.rect(40 + 150, y, bw, 11, "F");
    doc.setTextColor(60); doc.text(fmt(i), 40 + 150 + bw + 5, y + 9); y += 16; });
  return y + 10;
}
export function exportarGerencialPdf(ia) {
  const J = window.jspdf; if (!J || !J.jsPDF) throw { code: "lib" };
  const S = getState(); const doc = new J.jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth(); let y = 48;
  doc.setFont("helvetica", "bold"); doc.setFontSize(16); doc.text("Relatório Gerencial — Print Socorro Mecânico", 40, y); y += 18;
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(110); doc.text("Gerado em " + new Date().toLocaleString("pt-BR"), 40, y); y += 20; doc.setTextColor(0);
  const ab = S.ordens.filter(o => !o.fechamento && !o.cancelado).length;
  const total = S.ordens.reduce((t, o) => t + (Number(o.valor) || 0), 0);
  doc.autoTable({ startY: y, theme: "grid", head: [["Indicador", "Valor"]], body: [["Total de O.S.", String(S.ordens.length)], ["O.S. em aberto", String(ab)], ["Custo realizado", brl(total)], ["Prestadores cadastrados", String(S.prestadores.length)]], styles: { fontSize: 9 }, headStyles: { fillColor: [22, 120, 60] }, margin: { left: 40, right: 40 } });
  y = doc.lastAutoTable.finalY + 18;
  const placas = {}; S.ordens.forEach(o => { const p = String(o.placa || "—").toUpperCase(); const d = (placas[p] = placas[p] || { placa: p, qtd: 0, custo: 0, modelo: o.modelo || "", falha: "" }); d.qtd++; d.custo += Number(o.valor) || 0; if (o.falha) d.falha = [o.grupo_os, o.item_defeito, o.falha].filter(Boolean).join(" > "); });
  const top = Object.values(placas).sort((a, b) => b.qtd - a.qtd || b.custo - a.custo).slice(0, 8);
  doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text("Veículos com mais ocorrências", 40, y); y += 6;
  doc.autoTable({ startY: y, theme: "striped", head: [["Placa", "Modelo", "O.S.", "Custo", "Último defeito"]], body: top.map(t => [t.placa, t.modelo || "—", t.qtd, brl(t.custo), t.falha || "—"]), styles: { fontSize: 8.5 }, headStyles: { fillColor: [22, 120, 60] }, margin: { left: 40, right: 40 } });
  y = doc.lastAutoTable.finalY + 18;
  const orc = callRoute("/stats/orcado");
  doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text("Orçado × realizado por prestador", 40, y); y += 6;
  doc.autoTable({ startY: y, theme: "striped", head: [["Prestador", "O.S.", "Orçado", "Realizado", "Desvio"]], body: (orc.por_prestador || []).slice(0, 15).map(r => [r.nome, r.qtd, brl(r.orcado), brl(r.realizado), (r.desvio_pct > 0 ? "+" : "") + r.desvio_pct + "%"]), styles: { fontSize: 8.5 }, headStyles: { fillColor: [22, 120, 60] }, margin: { left: 40, right: 40 } });
  y = doc.lastAutoTable.finalY + 18;
  const esc = callRoute("/escalonamento");
  doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text("Escalonamento (O.S. sem movimentação)", 40, y); y += 6;
  doc.autoTable({ startY: y, theme: "striped", head: [["O.S.", "Placa", "Filial", "Status", "Horas", "Nível"]], body: (esc.data || []).slice(0, 25).map(r => [r.os, r.placa, r.operacao || "—", r.status || "—", r.horas_parada, r.nivel]), styles: { fontSize: 8.5 }, headStyles: { fillColor: [180, 40, 40] }, margin: { left: 40, right: 40 } });
  y = doc.lastAutoTable.finalY + 22;
  const I = calcInsights();
  y = barras(doc, y, "Custo por prestador", I.custoPrest.map(p => ({ l: p.nome, v: p.custo, q: p.qtd })), [22, 120, 60], i => brl(i.v) + " (" + i.q + " O.S.)");
  y = barras(doc, y, "O.S. por grupo de defeito", I.porGrupo.slice(0, 10).map(g => ({ l: g.grupo, v: g.qtd, c: g.custo })), [37, 99, 235], i => i.v + " O.S. · " + brl(i.c));
  y = barras(doc, y, "Placas mais recorrentes", I.recorrentes.map(r => ({ l: r.placa + " " + (r.modelo || ""), v: r.qtd, c: r.custo })), [217, 119, 6], i => i.v + " O.S. · " + brl(i.c));
  if (y > doc.internal.pageSize.getHeight() - 120) { doc.addPage(); y = 48; }
  doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.setTextColor(0); doc.text("Últimos veículos atendidos", 40, y); y += 6;
  doc.autoTable({ startY: y, theme: "striped", head: [["O.S.", "Placa", "Defeito", "Prestador", "Valor", "Status"]], body: I.ultimas.map(u => [u.os, u.placa, u.defeito || "—", u.prestador || "—", brl(u.valor), u.status]), styles: { fontSize: 8 }, headStyles: { fillColor: [22, 120, 60] }, margin: { left: 40, right: 40 } });
  y = doc.lastAutoTable.finalY + 18;
  if (ia) {
    if (y > doc.internal.pageSize.getHeight() - 160) { doc.addPage(); y = 48; }
    doc.setFont("helvetica", "bold"); doc.setFontSize(11); doc.text("Análise da IA — pendências e veículos para vigiar", 40, y); y += 8;
    if (ia.resumo) { doc.setFont("helvetica", "normal"); doc.setFontSize(9); const t = doc.splitTextToSize(ia.resumo, W - 80); doc.text(t, 40, y + 10); y += t.length * 11 + 12; }
    const corP = { alta: [180, 40, 40], media: [217, 119, 6], baixa: [22, 120, 60] };
    doc.autoTable({ startY: y, theme: "grid", head: [["Prioridade", "Pendência", "Ação sugerida"]], body: (ia.alertas || []).map(a => [a.prioridade || "", a.titulo + " — " + (a.motivo || ""), a.acao || ""]), styles: { fontSize: 8 }, headStyles: { fillColor: [60, 60, 60] }, margin: { left: 40, right: 40 }, columnStyles: { 0: { cellWidth: 55 }, 1: { cellWidth: 200 } }, didParseCell: d => { if (d.section === "body" && d.column.index === 0) { const c = corP[String(d.cell.raw).toLowerCase()]; if (c) { d.cell.styles.textColor = c; d.cell.styles.fontStyle = "bold"; } } } });
    y = doc.lastAutoTable.finalY + 14;
    if ((ia.vigiar || []).length) { doc.autoTable({ startY: y, theme: "striped", head: [["Placa para vigiar", "Motivo", "Ação"]], body: ia.vigiar.map(v => [v.placa, v.motivo || "", v.acao || ""]), styles: { fontSize: 8 }, headStyles: { fillColor: [217, 119, 6] }, margin: { left: 40, right: 40 } }); }
  }
  const n = doc.internal.getNumberOfPages();
  for (let i = 1; i <= n; i++) { doc.setPage(i); doc.setFontSize(8); doc.setTextColor(130); doc.text("Página " + i + " de " + n, W - 40, doc.internal.pageSize.getHeight() - 24, { align: "right" }); }
  return salvar("relatorio-gerencial-" + hoje() + ".pdf", doc.output("arraybuffer"));
}
