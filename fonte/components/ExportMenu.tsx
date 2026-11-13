import { useEffect, useState } from "react";
import { exportarOrdensExcel, exportarPrestadoresExcel, exportarGerencialPdf } from "../exportar.js";
import { calcInsights, pedirIA } from "../insights.js";

const card: any = { background: "var(--bg-card, #111)", border: "1px solid var(--border-bright, #444)", borderRadius: 12, boxShadow: "0 8px 30px rgba(0,0,0,.4)", color: "var(--text, #eee)" };
const corPri: any = { alta: "#dc2626", media: "#d97706", baixa: "#16a34a" };

export default function ExportMenu() {
  const [aberto, setAberto] = useState(false);
  const [iaAberta, setIaAberta] = useState(false);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [ia, setIa] = useState<any>(null);
  const [pergunta, setPergunta] = useState("");
  const [, tick] = useState(0);
  useEffect(() => { const t = setInterval(() => tick(n => n + 1), 3000); return () => clearInterval(t); }, []);
  const mb: any = (window as any).__mapBaseInfo || {}; const sc: any = (window as any).__sascarInfo || {};

  async function analisar(p?: string) {
    setBusy(true); setMsg("IA analisando os dados…");
    try { const r = await pedirIA(calcInsights(), p || ""); setIa(r); setMsg(""); }
    catch (e: any) { const c = e && e.code; setMsg(c === "not_granted" ? "IA não autorizada." : c === "unavailable" ? "IA indisponível neste modo." : "Não consegui analisar agora (" + (c || (e && e.message) || "erro") + ")."); }
    setBusy(false);
  }
  async function pdf() {
    setBusy(true); setMsg("Gerando relatório com análise da IA…");
    let r: any = ia;
    if (!r) { try { r = await pedirIA(calcInsights(), ""); setIa(r); } catch (e) { r = null; } }
    try { await exportarGerencialPdf(r); setMsg(r ? "PDF salvo, com análise da IA." : "PDF salvo (sem análise da IA)."); setAberto(false); }
    catch (e: any) { const c = e && e.code; setMsg(c === "declined" ? "Download cancelado." : c === "lib" ? "Biblioteca de PDF não carregou. Recarregue a página." : "Não foi possível gerar o PDF (" + (c || (e && e.message) || "erro") + ")."); }
    setBusy(false); setTimeout(() => setMsg(""), 6000);
  }
  async function xl(f: () => Promise<any>, nome: string) {
    setBusy(true); setMsg("Gerando " + nome + "…");
    try { await f(); setMsg("Arquivo salvo."); setAberto(false); }
    catch (e: any) { const c = e && e.code; setMsg(c === "declined" ? "Download cancelado." : c === "lib" ? "Biblioteca não carregou. Recarregue." : "Não foi possível gerar (" + (c || (e && e.message) || "erro") + ")."); }
    setBusy(false); setTimeout(() => setMsg(""), 6000);
  }
  const itens = [
    { t: "Ordens de serviço (Excel)", d: "Todas as O.S. com defeito, execução e valores", f: () => xl(exportarOrdensExcel, "Excel de O.S.") },
    { t: "Prestadores (Excel)", d: "Cadastro completo com tipo e faturamento", f: () => xl(exportarPrestadoresExcel, "Excel de prestadores") },
    { t: "Relatório gerencial (PDF)", d: "Gráficos, últimos carros, placas recorrentes e análise da IA", f: pdf },
  ];
  const btn: any = { padding: "10px 16px", borderRadius: 999, color: "#fff", border: "none", fontWeight: 800, fontSize: 12, boxShadow: "0 4px 14px rgba(0,0,0,.4)", cursor: "pointer" };
  const stat = (mb.status && mb.status !== "ok") || (sc.status && !/^ok/.test(sc.status || "ok")) ? [mb.status && mb.status !== "ok" ? "Mapa: " + mb.status : "", sc.status && !/^ok/.test(sc.status) ? "Sascar: " + sc.status : ""].filter(Boolean).join(" · ") : "";
  return (
    <div style={{ position: "fixed", right: "max(16px, env(safe-area-inset-right, 0px))", bottom: "max(16px, env(safe-area-inset-bottom, 0px))", zIndex: 1500, fontFamily: "inherit", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
      {stat && <div style={{ ...card, padding: "6px 10px", fontSize: 10, maxWidth: 300 }}>{stat}</div>}
      {iaAberta && (
        <div style={{ ...card, width: "min(360px, calc(100vw - 32px))", maxHeight: "70vh", overflowY: "auto", padding: 12 }}>
          <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 6 }}>🤖 Assistente de operação</div>
          <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
            <input value={pergunta} onChange={e => setPergunta(e.target.value)} placeholder="Pergunte (opcional): ex. quais carros vigiar?" style={{ flex: 1, minWidth: 0, fontSize: 11, padding: "6px 8px", borderRadius: 8, border: "1px solid var(--border, #444)", background: "transparent", color: "inherit" }} />
            <button disabled={busy} onClick={() => analisar(pergunta)} style={{ ...btn, padding: "6px 12px", background: "#2563eb", boxShadow: "none" }}>{busy ? "…" : "Analisar"}</button>
          </div>
          {!ia && !busy && <div style={{ fontSize: 11, opacity: .7 }}>Toque em Analisar para a IA apontar pendências, carros para vigiar e soluções.</div>}
          {ia && (<div style={{ fontSize: 11, lineHeight: 1.45 }}>
            {ia.resumo && <p style={{ margin: "0 0 8px" }}>{ia.resumo}</p>}
            {(ia.alertas || []).map((a: any, i: number) => (<div key={i} style={{ borderLeft: "3px solid " + (corPri[String(a.prioridade).toLowerCase()] || "#888"), padding: "2px 8px", margin: "6px 0" }}>
              <b>{a.titulo}</b> <span style={{ opacity: .6 }}>({a.prioridade})</span><div>{a.motivo}</div><div style={{ color: "#16a34a" }}>➜ {a.acao}</div></div>))}
            {(ia.vigiar || []).length > 0 && <div style={{ fontWeight: 800, marginTop: 8 }}>👁 Vigiar</div>}
            {(ia.vigiar || []).map((v: any, i: number) => (<div key={i} style={{ margin: "4px 0" }}><b>{v.placa}</b> — {v.motivo}<div style={{ color: "#d97706" }}>➜ {v.acao}</div></div>))}
            {(ia.melhorias || []).length > 0 && <div style={{ fontWeight: 800, marginTop: 8 }}>💡 Melhorias</div>}
            {(ia.melhorias || []).map((m: string, i: number) => <div key={i}>• {m}</div>)}
          </div>)}
        </div>
      )}
      {aberto && (
        <div style={{ ...card, width: 300, overflow: "hidden" }}>
          {itens.map(it => (
            <button key={it.t} disabled={busy} onClick={it.f} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", background: "transparent", border: "none", borderBottom: "1px solid var(--border, #333)", color: "inherit", cursor: busy ? "wait" : "pointer" }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{it.t}</div>
              <div style={{ fontSize: 10, opacity: .65 }}>{it.d}</div>
            </button>
          ))}
        </div>
      )}
      {msg && <div style={{ ...card, maxWidth: 300, padding: "8px 12px", fontSize: 11 }}>{msg}</div>}
      <div style={{ display: "flex", gap: 8 }}>
        {(window as any).PRINT_CONFIG?.AI_ENDPOINT ? <button onClick={() => { setIaAberta(v => !v); setAberto(false); }} style={{ ...btn, background: "#2563eb" }}>{iaAberta ? "Fechar IA" : "🤖 IA"}</button> : null}
        <button onClick={() => { setAberto(v => !v); setIaAberta(false); }} style={{ ...btn, background: "#16a34a" }}>{aberto ? "Fechar" : "⬇ Exportar"}</button>
      </div>
    </div>
  );
}
