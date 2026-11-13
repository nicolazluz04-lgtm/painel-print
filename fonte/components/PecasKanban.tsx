"use client";
import { useEffect, useState } from "react";

const ETAPAS = ["ORÇANDO", "COMPRADO", "ENVIADO", "RECEBIDO"];
const API = "/api";

function tkn() { try { return localStorage.getItem("token") || ""; } catch { return ""; } }
async function api(url: string, init?: RequestInit) {
  const sep = url.includes("?") ? "&" : "?";
  try {
    const r = await fetch(`${API}${url}${sep}token=${encodeURIComponent(tkn())}`, { headers: { "Content-Type": "application/json" }, ...init });
    const txt = await r.text();
    try { return JSON.parse(txt); } catch { return {}; }
  } catch { return {}; }
}

function horas(desde?: string) {
  if (!desde) return "—";
  const ms = Date.now() - new Date(desde).getTime();
  if (isNaN(ms)) return "—";
  const h = Math.floor(ms / 3600000);
  if (h < 1) return Math.max(1, Math.floor(ms / 60000)) + " min";
  if (h < 24) return h + "h";
  return Math.floor(h / 24) + "d " + (h % 24) + "h";
}
function dataBR(iso?: string) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }); } catch { return "—"; }
}

const COR: Record<string, string> = { "ORÇANDO": "#f5b301", "COMPRADO": "#1e88e5", "ENVIADO": "#8e6cf0", "RECEBIDO": "#25d647" };

function tempoPorEtapa(itens: any[]) {
  const acc: Record<string, number[]> = {};
  itens.forEach(it => {
    const h = (it.historico || []).slice().sort((a: any, b: any) => String(a.hora).localeCompare(String(b.hora)));
    h.forEach((ev: any, i: number) => {
      const prox = h[i + 1];
      const fim = prox ? new Date(prox.hora).getTime() : (it.etapa === ev.etapa && it.etapa_desde ? Date.now() : null);
      if (fim && ev.etapa && COR[ev.etapa]) {
        const dur = (fim - new Date(ev.hora).getTime()) / 3600000;
        if (dur >= 0 && dur < 24 * 60) (acc[ev.etapa] = acc[ev.etapa] || []).push(dur);
      }
    });
  });
  return Object.entries(acc).map(([e, v]) => ({ etapa: e, horas: v.reduce((a, b) => a + b, 0) / v.length }));
}

export default function PecasKanban() {
  const [itens, setItens] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [hist, setHist] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function carregar() {
    setLoading(true);
    const r = await api("/pecas-envio");
    setItens(r?.data || []);
    setLoading(false);
  }
  useEffect(() => { carregar(); }, []);

  async function criar(e: any) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const d: any = Object.fromEntries(fd.entries());
    if (!String(d.placa || "").trim() || !String(d.peca || "").trim()) { alert("Informe a placa e a peça"); return; }
    setBusy(true);
    await api("/pecas-envio", { method: "POST", body: JSON.stringify({ ...d, quantidade: parseInt(String(d.quantidade || "1")), valor: parseFloat(String(d.valor || "0")) }) });
    setBusy(false); setShowForm(false); (e.currentTarget as HTMLFormElement).reset(); carregar();
  }

  async function mover(item: any, destino: string) {
    let confirmar = false;
    if (destino === "RECEBIDO" && !item.confirmado_recebimento) {
      if (!confirm(`Confirmar o recebimento da peça ${item.peca} (${item.placa})?`)) return;
      confirmar = true;
    }
    const r = await api(`/pecas-envio/${item.id}/mover`, { method: "POST", body: JSON.stringify({ etapa: destino, confirmar_recebimento: confirmar }) });
    if (!r?.success) { alert(r?.detail || "Não foi possível mover"); return; }
    carregar();
  }

  async function remover(id: string) {
    if (!confirm("Excluir este processo?")) return;
    await api(`/pecas-envio/${id}`, { method: "DELETE" });
    carregar();
  }

  const abertos = itens.filter(i => i.etapa !== "RECEBIDO");
  const recebidos = itens.filter(i => i.etapa === "RECEBIDO");
  const atrasados = abertos.filter(i => (Date.now() - new Date(i.etapa_desde || i.abertura || 0).getTime()) > 48 * 3600000);
  const valorOrcado = itens.filter(i => i.etapa === "ORÇANDO").reduce((a, i) => a + Number(i.valor || 0), 0);
  const valorComprado = itens.filter(i => i.etapa !== "ORÇANDO").reduce((a, i) => a + Number(i.valor || 0), 0);
  const tempoReceb = recebidos.map(i => (new Date(i.finalizado_em).getTime() - new Date(i.abertura).getTime()) / 3600000).filter(n => n >= 0);
  const tempoMedioTotal = tempoReceb.length ? tempoReceb.reduce((a, b) => a + b, 0) / tempoReceb.length : 0;

  const porFilial = (() => {
    const m: Record<string, number> = {};
    itens.forEach(i => { const f = i.filial || "Sem filial"; m[f] = (m[f] || 0) + Number(i.valor || 0); });
    return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 6);
  })();
  const porEtapa = tempoPorEtapa(itens).filter(x => ETAPAS.includes(x.etapa));

  return (
    <div>
      <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
        <div>
          <div className="text-base font-bold" style={{ color: "var(--text)" }}>CONTROLE DE ENVIO DE PEÇAS</div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Placa · filial · peça · etapa do processo</div>
        </div>
        <div className="flex gap-2">
          <button onClick={carregar} className="px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer" style={{ border: "1px solid var(--border-bright)", color: "var(--text-muted)" }}>Atualizar</button>
          <button onClick={() => setShowForm(v => !v)} className="px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer" style={{ background: "var(--accent-green)", color: "#fff" }}>{showForm ? "Fechar" : "+ Novo envio"}</button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 mb-4">
        {[
          { l: "Abertos", v: abertos.length, c: "#f5b301" },
          { l: "Orçando", v: itens.filter(i => i.etapa === "ORÇANDO").length, c: "#f5b301" },
          { l: "Comprado", v: itens.filter(i => i.etapa === "COMPRADO").length, c: "#1e88e5" },
          { l: "Enviado", v: itens.filter(i => i.etapa === "ENVIADO").length, c: "#8e6cf0" },
          { l: "Atrasados", v: atrasados.length, c: "#e53935" },
          { l: "Recebidos", v: recebidos.length, c: "#25d647" },
        ].map((k, i) => (
          <div key={i} className="rounded-xl px-3 py-2.5" style={{ background: "var(--bg-card)", border: `1.5px solid ${k.c}44` }}>
            <div className="text-[9px] font-bold uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>{k.l}</div>
            <div className="text-2xl font-bold font-mono leading-none mt-1" style={{ color: k.c }}>{k.v}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        <div className="rounded-xl p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-[9px] font-bold uppercase tracking-wide mb-2" style={{ color: "var(--text-muted)" }}>Custo por filial</div>
          {porFilial.length === 0 ? <p className="text-[10px] py-4 text-center" style={{ color: "var(--text-soft)" }}>Sem dados</p> : (
            <div className="space-y-1.5">
              {porFilial.map(([f, v]) => {
                const max = porFilial[0][1] || 1;
                return (
                  <div key={f} className="flex items-center gap-2 text-[10px]">
                    <span className="truncate" style={{ color: "var(--text)", width: 78 }}>{f}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-alt)" }}>
                      <div style={{ width: `${(v / max) * 100}%`, height: "100%", background: "#25d647" }} />
                    </div>
                    <span className="font-mono font-bold" style={{ color: "var(--text)" }}>{v.toFixed(0)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-xl p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-[9px] font-bold uppercase tracking-wide mb-2" style={{ color: "var(--text-muted)" }}>Tempo médio por etapa (h)</div>
          {porEtapa.length === 0 ? <p className="text-[10px] py-4 text-center" style={{ color: "var(--text-soft)" }}>Sem dados de ciclo</p> : (
            <div className="space-y-1.5">
              {porEtapa.map(x => {
                const max = Math.max(...porEtapa.map(y => y.horas)) || 1;
                return (
                  <div key={x.etapa} className="flex items-center gap-2 text-[10px]">
                    <span style={{ color: "var(--text)", width: 78 }}>{x.etapa}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "var(--bg-alt)" }}>
                      <div style={{ width: `${(x.horas / max) * 100}%`, height: "100%", background: COR[x.etapa] }} />
                    </div>
                    <span className="font-mono font-bold" style={{ color: "var(--text)" }}>{x.horas.toFixed(1)}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-xl p-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <div className="text-[9px] font-bold uppercase tracking-wide mb-2" style={{ color: "var(--text-muted)" }}>Indicadores</div>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Valor orçado</span><b className="font-mono" style={{ color: "#f5b301" }}>{Number(valorOrcado||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0})}</b></div>
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Valor comprado</span><b className="font-mono" style={{ color: "#1e88e5" }}>{Number(valorComprado||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0})}</b></div>
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Tempo médio até receber</span><b className="font-mono" style={{ color: "#8e6cf0" }}>{tempoMedioTotal.toFixed(1)}h</b></div>
            <div className="flex justify-between"><span style={{ color: "var(--text-muted)" }}>Atrasados</span><b className="font-mono" style={{ color: "#e53935" }}>{atrasados.length}</b></div>
          </div>
        </div>
      </div>

      {showForm && (
        <form onSubmit={criar} className="rounded-xl p-4 mb-4 grid grid-cols-1 md:grid-cols-4 gap-2" style={{ background: "var(--bg-card)", border: "1px solid var(--border-bright)" }}>
          {[
            { n: "placa", l: "Placa", req: true },
            { n: "filial", l: "Filial destino" },
            { n: "peca", l: "Peça", req: true },
            { n: "quantidade", l: "Qtd", t: "number" },
            { n: "os", l: "O.S." },
            { n: "fornecedor", l: "Fornecedor" },
            { n: "valor", l: "Valor (R$)", t: "number" },
            { n: "motorista", l: "Motorista" },
          ].map((f: any) => (
            <label key={f.n} className="block">
              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{f.l}</span>
              <input name={f.n} type={f.t || "text"} required={f.req} defaultValue={f.n === "quantidade" ? "1" : ""} className="mt-0.5 w-full px-2 py-1.5 rounded-lg border text-xs" style={{ background: "var(--bg-alt)", borderColor: "var(--border)", color: "var(--text)" }} />
            </label>
          ))}
          <div className="md:col-span-4 flex justify-end">
            <button disabled={busy} className="px-4 py-2 rounded-lg text-xs font-bold cursor-pointer" style={{ background: "var(--accent-green)", color: "#fff" }}>{busy ? "Salvando..." : "Abrir envio"}</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-center py-12 text-sm" style={{ color: "var(--text-muted)" }}>Carregando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {ETAPAS.map((etapa, ei) => {
            const lista = itens.filter(i => i.etapa === etapa);
            const cor = COR[etapa];
            return (
              <div key={etapa} className="rounded-xl p-2" style={{ background: "var(--bg-alt)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between px-1 pb-2 mb-2" style={{ borderBottom: `2px solid ${cor}55` }}>
                  <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: cor }}>{ei + 1}. {etapa}</span>
                  <span className="text-[10px] font-bold font-mono" style={{ color: "var(--text-muted)" }}>{lista.length}</span>
                </div>
                <div className="space-y-2">
                  {lista.map(item => {
                    const idx = ETAPAS.indexOf(item.etapa);
                    const atrasado = (Date.now() - new Date(item.etapa_desde || item.abertura || 0).getTime()) > 48 * 3600000;
                    return (
                      <div key={item.id} className="rounded-lg p-2.5" style={{ background: "var(--bg-card)", border: `1px solid ${atrasado ? "#e5393555" : "var(--border-bright)"}` }}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-bold font-mono" style={{ color: "var(--text)" }}>{item.placa}</span>
                          {atrasado && <span className="text-[8px] font-bold px-1.5 py-0.5 rounded" style={{ background: "#e5393522", color: "#c62828" }}>ATRASADO</span>}
                        </div>
                        <div className="text-[10px] mb-1" style={{ color: "var(--text)" }}>{item.peca} {item.quantidade > 1 ? `×${item.quantidade}` : ""}</div>
                        <div className="text-[9px] space-y-0.5" style={{ color: "var(--text-muted)" }}>
                          {item.filial && <div>Filial: {item.filial}</div>}
                          {item.os && <div>O.S. {item.os}</div>}
                          {item.fornecedor && <div>{item.fornecedor}</div>}
                          <div className="font-mono" style={{ color: "#b8860b" }}>{Number(item.valor || 0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"})}</div>
                          <div>Etapa há <b style={{ color: atrasado ? "#c62828" : "var(--text)" }}>{horas(item.etapa_desde)}</b></div>
                        </div>

                        <div className="flex items-center gap-1 mt-2 mb-2">
                          {ETAPAS.map((e, i) => (
                            <div key={e} className="flex items-center gap-1 flex-1">
                              <span style={{ width: 9, height: 9, borderRadius: 99, background: i <= idx ? COR[e] : "var(--border-bright)", flex: "none" }} />
                              {i < ETAPAS.length - 1 && <span style={{ height: 2, flex: 1, background: i < idx ? COR[e] : "var(--border-bright)" }} />}
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-1">
                          {idx > 0 && <button onClick={() => mover(item, ETAPAS[idx - 1])} className="px-1.5 py-1 rounded text-[9px] font-bold cursor-pointer" style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}>←</button>}
                          {idx < ETAPAS.length - 1 && <button onClick={() => mover(item, ETAPAS[idx + 1])} className="flex-1 py-1 rounded text-[9px] font-bold cursor-pointer" style={{ background: COR[ETAPAS[idx + 1]], color: "#fff" }}>→ {ETAPAS[idx + 1]}</button>}
                          <button onClick={() => setHist(hist === item.id ? null : item.id)} className="px-1.5 py-1 rounded text-[9px] font-bold cursor-pointer" style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}>Hist</button>
                          <button onClick={() => remover(item.id)} className="px-1.5 py-1 rounded text-[9px] font-bold cursor-pointer" style={{ border: "1px solid var(--border)", color: "#c62828" }}>×</button>
                        </div>
                        {hist === item.id && (
                          <div className="mt-2 pt-2 space-y-1" style={{ borderTop: "1px solid var(--border)" }}>
                            {(item.historico || []).slice().reverse().map((h: any, i: number) => (
                              <div key={i} className="text-[8.5px]" style={{ color: "var(--text-muted)" }}><span className="font-mono">{dataBR(h.hora)}</span> · {h.acao}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {lista.length === 0 && <p className="text-center text-[10px] py-4" style={{ color: "var(--text-soft)" }}>Vazio</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

