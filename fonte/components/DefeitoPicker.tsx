import { useState, useMemo } from "react";
import MATRIZ from "../data/matriz.json";

const inp: any = { background: "var(--bg-alt)", border: "1px solid var(--border)", color: "var(--text)" };
const lab = "text-[9px] font-bold uppercase tracking-wider";
const GRUPOS = ["MEC", "ELE", "FUN", "BAU", "BOR"];

function rotuloCompl(c: string): string {
  const t = (c || "").trim();
  if (!t || /livre texto/i.test(t)) return "Observação (texto livre)";
  return t.replace(/^informar\s+/i, "").replace(/^digitar\s+/i, "").replace(/^./, m => m.toUpperCase());
}

export default function DefeitoPicker() {
  const M: any = MATRIZ;
  const origens: any[] = M.origens;
  const [origem, setOrigem] = useState<string>("SOS");
  const [grupo, setGrupo] = useState("");
  const [sistema, setSistema] = useState("");
  const [item, setItem] = useState("");
  const [falha, setFalha] = useState("");
  const [compl, setCompl] = useState("");

  const g = grupo ? M.matriz[grupo] : null;
  const sistemas: string[] = g ? Object.keys(g.sistemas) : [];
  const sis = sistema || (sistemas.length === 1 ? sistemas[0] : "");
  const itens: string[] = g && sis ? Object.keys(g.sistemas[sis]) : [];
  const falhas: any[] = g && sis && item ? g.sistemas[sis][item] : [];
  const f = falhas.find(x => x[0] === falha);
  const codigo = f ? f[2] : "";

  const grupoInfo = useMemo(() => (M.grupos as any[]).reduce((a: any, x: any) => { a[x.sigla] = x; return a; }, {}), []);

  return (
    <div className="rounded-lg p-3 space-y-3" style={{ border: "1px solid var(--border-bright)", background: "rgba(37,214,71,.04)" }}>
      <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>Defeito (Matriz de Defeitos)</div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={lab} style={{ color: "var(--text-muted)" }}>Origem da O.S.</label>
          <select name="origem" required value={origem} onChange={e => setOrigem(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-lg text-sm" style={inp}>
            {origens.map(o => <option key={o.sigla} value={o.sigla}>{o.sigla} — {o.nome} ({o.tipo})</option>)}
          </select>
        </div>
        <div>
          <label className={lab} style={{ color: "var(--text-muted)" }}>Grupo</label>
          <select name="grupo_os" required value={grupo} onChange={e => { setGrupo(e.target.value); setSistema(""); setItem(""); setFalha(""); setCompl(""); }} className="mt-1 w-full px-3 py-2 rounded-lg text-sm" style={inp}>
            <option value="">Selecione…</option>
            {GRUPOS.map(s => <option key={s} value={s}>{s} — {M.matriz[s].nome}</option>)}
          </select>
        </div>
      </div>
      {grupo && grupoInfo[grupo] && <div className="text-[9px]" style={{ color: "var(--text-soft)" }}>{grupoInfo[grupo].info}</div>}
      {grupo && sistemas.length > 1 && (
        <div>
          <label className={lab} style={{ color: "var(--text-muted)" }}>Sistema</label>
          <select name="sistema" required value={sistema} onChange={e => { setSistema(e.target.value); setItem(""); setFalha(""); setCompl(""); }} className="mt-1 w-full px-3 py-2 rounded-lg text-sm" style={inp}>
            <option value="">Selecione…</option>
            {sistemas.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      )}
      {grupo && sistemas.length === 1 && <input type="hidden" name="sistema" value={sistemas[0]} />}
      {sis && (
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={lab} style={{ color: "var(--text-muted)" }}>Item</label>
            <select name="item_defeito" required value={item} onChange={e => { setItem(e.target.value); setFalha(""); setCompl(""); }} className="mt-1 w-full px-3 py-2 rounded-lg text-sm" style={inp}>
              <option value="">Selecione…</option>
              {itens.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={lab} style={{ color: "var(--text-muted)" }}>Falha</label>
            <select name="falha" required value={falha} onChange={e => { setFalha(e.target.value); setCompl(""); }} disabled={!item} className="mt-1 w-full px-3 py-2 rounded-lg text-sm" style={inp}>
              <option value="">{item ? "Selecione…" : "Escolha o item"}</option>
              {falhas.map(x => <option key={x[2] + x[0]} value={x[0]}>{x[0]}</option>)}
            </select>
          </div>
        </div>
      )}
      {f && (
        <div>
          <label className={lab} style={{ color: "var(--text-muted)" }}>{rotuloCompl(f[1])}</label>
          <input name="complemento_defeito" required={!/livre texto/i.test(f[1] || "")} value={compl} onChange={e => setCompl(e.target.value)} placeholder={rotuloCompl(f[1])} inputMode={/km|tens/i.test(f[1] || "") ? "numeric" : undefined} className="mt-1 w-full px-3 py-2 rounded-lg text-sm" style={inp} />
          <input type="hidden" name="cod_defeito" value={codigo} />
          <div className="text-[9px] mt-1" style={{ color: "var(--text-soft)" }}>Código do defeito: <b>{codigo}</b></div>
        </div>
      )}
    </div>
  );
}
