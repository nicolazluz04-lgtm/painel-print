"use client";
import { useEffect, useState } from "react";

function tkn() { try { return localStorage.getItem("token") || ""; } catch { return ""; } }

async function api(url: string, init?: RequestInit) {
  const sep = url.includes("?") ? "&" : "?";
  try {
    const r = await fetch(`/api${url}${sep}token=${encodeURIComponent(tkn())}`, { headers: { "Content-Type": "application/json" }, ...init });
    const txt = await r.text();
    try { return JSON.parse(txt); } catch { return {}; }
  } catch { return {}; }
}

function dataHora(iso?: string) {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }); } catch { return "—"; }
}

export default function ReportModal({ ordem, onClose }: { ordem: any | null; onClose: () => void }) {
  const [notas, setNotas] = useState<any[]>([]);
  const [texto, setTexto] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [enviando, setEnviando] = useState(false);

  async function carregar(id: string) {
    setCarregando(true);
    const r = await api(`/ordens/${id}/notas`);
    const arr = r?.data || r?.notas || (Array.isArray(r) ? r : []);
    setNotas(Array.isArray(arr) ? arr : []);
    setCarregando(false);
  }

  useEffect(() => { if (ordem?.id) { setNotas([]); setTexto(""); carregar(ordem.id); } }, [ordem?.id]);

  if (!ordem) return null;

  async function enviar(e: any) {
    e.preventDefault();
    const t = texto.trim();
    if (!t) return;
    setEnviando(true);
    await api(`/ordens/${ordem.id}/notas`, { method: "POST", body: JSON.stringify({ texto: t, nota: t, mensagem: t }) });
    setTexto("");
    await carregar(ordem.id);
    setEnviando(false);
  }

  const lista = [...notas].sort((a: any, b: any) => String(b.created_at || b.hora || "").localeCompare(String(a.created_at || a.hora || "")));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col" style={{ background: "var(--bg-card)", border: "1px solid var(--border-bright)", maxHeight: "92vh" }}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <div className="text-[9px] uppercase tracking-widest font-bold" style={{ color: "var(--text-muted)" }}>Report</div>
            <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>O.S. {ordem.os || "—"} {ordem.placa ? <span className="font-mono" style={{ color: "var(--accent-green)" }}>· {ordem.placa}</span> : null}</h2>
          </div>
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer" style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}>Fechar</button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {carregando ? (<p className="text-center py-10 text-sm" style={{ color: "var(--text-muted)" }}>Carregando...</p>) : lista.length === 0 ? (<p className="text-center py-10 text-sm" style={{ color: "var(--text-muted)" }}>Nenhum registro ainda. Escreva o primeiro abaixo.</p>) : (
            lista.map((n: any, i: number) => (
              <div key={n.id || i} className="py-3" style={{ borderBottom: "1px dashed var(--border)" }}>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>{dataHora(n.created_at || n.hora || n.criado_em)}</span>
                  <span className="text-[12px] font-bold" style={{ color: "var(--text)" }}>{n.autor || n.quem || n.criado_por || n.usuario || "—"}</span>
                  {(n.email || n.login) && <span className="text-[10px] font-semibold" style={{ color: "var(--accent-green)" }}>{n.email || n.login}</span>}
                </div>
                <div className="text-[12.5px] mt-1 leading-relaxed" style={{ color: "var(--text)" }}>{n.texto || n.nota || n.mensagem || "—"}</div>
              </div>
            ))
          )}
        </div>
        <form onSubmit={enviar} className="px-6 py-4 flex gap-2" style={{ borderTop: "1px solid var(--border)" }}>
          <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escreva uma nova mensagem..." className="flex-1 px-3 py-2.5 rounded-lg text-sm" style={{ background: "var(--bg-alt)", border: "1px solid var(--border)", color: "var(--text)" }} />
          <button disabled={enviando || !texto.trim()} className="px-6 py-2.5 rounded-lg text-xs font-bold cursor-pointer" style={{ background: enviando || !texto.trim() ? "var(--bg-alt)" : "var(--accent-green)", color: enviando || !texto.trim() ? "var(--text-muted)" : "#fff" }}>{enviando ? "Enviando..." : "Enviar"}</button>
        </form>
      </div>
    </div>
  );
}

