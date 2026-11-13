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

export default function Cancelamentos() {
  const [itens, setItens] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [msg, setMsg] = useState("");

  async function carregar() {
    setCarregando(true);
    const r = await api("/ordens/cancelamentos/pendentes");
    const arr = r?.data || (Array.isArray(r) ? r : []);
    setItens(Array.isArray(arr) ? arr : []);
    setCarregando(false);
  }
  useEffect(() => { carregar(); }, []);

  async function aprovar(id: string) {
    if (!confirm("Aprovar o cancelamento desta O.S.?")) return;
    const r = await api(`/ordens/${id}/cancelar/aprovar`, { method: "POST" });
    setMsg(r?.success ? "Cancelamento aprovado" : (r?.detail || "Não foi possível aprovar"));
    setTimeout(() => setMsg(""), 3000);
    carregar();
  }

  async function rejeitar(item: any) {
    if (!confirm("Rejeitar o pedido? A O.S. continua ativa.")) return;
    await api(`/ordens/${item.id}`, { method: "PUT", body: JSON.stringify({ cancelamento_solicitado: false, cancelamento_motivo: "" }) });
    setMsg("Pedido rejeitado");
    setTimeout(() => setMsg(""), 3000);
    carregar();
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>Cancelamentos pendentes</h2>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Pedidos de exclusão aguardando sua aprovação</div>
        </div>
        <button onClick={carregar} className="px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer" style={{ border: "1px solid var(--border-bright)", color: "var(--text-muted)" }}>Atualizar</button>
      </div>

      {msg && <div className="mb-3 px-3 py-2 rounded-lg text-[11px] font-bold" style={{ background: "rgba(37,214,71,.12)", color: "#146E1F" }}>{msg}</div>}

      {carregando ? (
        <p className="text-center py-10 text-sm" style={{ color: "var(--text-muted)" }}>Carregando...</p>
      ) : itens.length === 0 ? (
        <div className="rounded-xl p-8 text-center" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>Nenhum pedido aguardando aprovação.</p>
        </div>
      ) : (
        itens.map((o: any) => (
          <div key={o.id} className="rounded-xl p-4 mb-3" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <div className="text-sm font-bold" style={{ color: "var(--text)" }}>
                  O.S. {o.os || "—"} {o.placa ? <span className="font-mono" style={{ color: "var(--accent-green)" }}>· {o.placa}</span> : null}
                </div>
                <div className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
                  Solicitado por <b style={{ color: "var(--text)" }}>{o.cancelamento_solicitado_por || "—"}</b> em {dataHora(o.cancelamento_solicitado_em)}
                </div>
                <div className="text-[12px] mt-2 p-2 rounded-lg" style={{ background: "var(--bg-alt)", color: "var(--text)" }}>
                  <b>Motivo:</b> {o.cancelamento_motivo || "não informado"}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => aprovar(o.id)} className="px-4 py-2 rounded-lg text-xs font-bold cursor-pointer" style={{ background: "var(--accent-green)", color: "#fff" }}>Aprovar</button>
                <button onClick={() => rejeitar(o)} className="px-4 py-2 rounded-lg text-xs font-bold cursor-pointer" style={{ border: "1px solid #C62828", color: "#C62828" }}>Rejeitar</button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

