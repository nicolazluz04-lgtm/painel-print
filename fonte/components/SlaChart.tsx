"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface Ordem { id: string; os: string; placa?: string; fechamento?: string; sla_minutos?: number; }

export default function SlaChart({ ordens, busca, filtro, setBusca, setFiltro }: {
  ordens: Ordem[]; busca: string; filtro: string;
  setBusca: (v: string) => void; setFiltro: (v: string) => void;
}) {
  const fechadas = ordens.filter(o => o.fechamento && o.sla_minutos != null);
  const q = filtro.toLowerCase();
  const achadas = q ? fechadas.filter(o =>
    (o.os || "").toLowerCase().includes(q) || (o.placa || "").toLowerCase().includes(q)) : [];

  let sel: Ordem[] = [];
  if (q && achadas.length > 0) {
    sel = [...achadas].sort((a, b) => (a.sla_minutos || 0) - (b.sla_minutos || 0)).slice(0, 15);
  } else {
    const asc = [...fechadas].sort((a, b) => (a.sla_minutos || 0) - (b.sla_minutos || 0));
    const desc = [...fechadas].sort((a, b) => (b.sla_minutos || 0) - (a.sla_minutos || 0));
    const ids = new Set<string>();
    [...asc.slice(0, 1), ...desc.slice(0, 5)].forEach(o => {
      if (!ids.has(o.id)) { ids.add(o.id); sel.push(o); }
    });
  }

  const data = sel.map(o => ({ name: "OS " + o.os, minutos: Number(o.sla_minutos || 0) }));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <input
          value={busca}
          onChange={e => setBusca(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") setFiltro(busca.trim()); }}
          placeholder="Buscar O.S. ou placa..."
          className="px-3 py-1.5 rounded-lg border text-xs flex-1 min-w-[180px]"
          style={{ background: "var(--bg-alt)", borderColor: "var(--border)", color: "var(--text)" }}
        />
        <button onClick={() => setFiltro(busca.trim())} className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer" style={{ background: "var(--accent-green)", color: "#fff" }}>Pesquisar</button>
        {filtro && <button onClick={() => { setFiltro(""); setBusca(""); }} className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer" style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}>Limpar</button>}
      </div>

      {fechadas.length === 0 ? (
        <p className="text-center py-12" style={{ color: "var(--text-muted)" }}>Nenhuma O.S fechada ainda</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-muted)" }} stroke="var(--border)" />
              <YAxis tick={{ fontSize: 12, fill: "var(--text-muted)" }} stroke="var(--border)" />
              <Tooltip formatter={(v: any) => [`${v} min`, "SLA"]} contentStyle={{ background: "var(--bg-alt)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" }} />
              <Bar dataKey="minutos" radius={[4, 4, 0, 0]}>
                {data.map((d, i) => { const c = d.minutos > 120 ? "#ef4444" : d.minutos > 60 ? "#f5c518": "#2dc62d"; return <Cell key={i} fill={c} />; })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <p className="text-center text-[10px] mt-2" style={{ color: "var(--text-muted)" }}>
            {q ? (achadas.length > 0 ? `${achadas.length} resultado(s) para "${filtro}"` : `Nenhuma O.S. encontrada para "${filtro}" - exibindo panorama`) : "Verde <=60min - Amarelo 61-120min - Vermelho >120min"}
          </p>
        </>
      )}
    </div>
  );
}

