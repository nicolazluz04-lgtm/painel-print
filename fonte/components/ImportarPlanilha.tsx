"use client";
// Importação de planilha (prestadores ou O.S.) em 3 passos: escolher o arquivo → ver a prévia
// (quantas linhas entram e quais são ignoradas, com o motivo) → confirmar. Só cria registros novos.
import { useState } from "react";
import { api } from "@/lib/api";
import { lerPlanilha, modeloOrdensBlob } from "../importar.js";

type Ignorado = { linha: number; nome?: string; motivo: string };
type Resumo = { prontos?: number; importados?: number; ignorados?: Ignorado[]; falhas?: Ignorado[]; detail?: string };

const TEXTOS = {
  prestadores: { rota: "/prestadores/import", coisa: "prestador(es)", dica: "Uma linha por prestador. Prestador com CNPJ/CPF já cadastrado (ou, sem CNPJ, com o mesmo nome e cidade) é ignorado." },
  ordens: { rota: "/ordens/import", coisa: "O.S.", dica: "Mesmas colunas da exportação \"Ordens de serviço (Excel)\". Número de O.S. que já existe é ignorado; O.S. sem número recebe o próximo livre." },
};

function baixar(nome: string, blob: Blob) {
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = nome;
  document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
}

function ListaIgnorados({ titulo, itens, cor }: { titulo: string; itens: Ignorado[]; cor: string }) {
  if (!itens.length) return null;
  return (
    <div className="text-left">
      <div className="text-xs font-bold mb-1" style={{ color: cor }}>{titulo} ({itens.length})</div>
      <ul className="max-h-48 overflow-y-auto rounded-lg text-xs divide-y" style={{ border: "1px solid var(--border)", background: "var(--bg-alt)" }}>
        {itens.slice(0, 200).map((x, i) => (
          <li key={i} className="px-3 py-2" style={{ borderColor: "var(--border)", color: "var(--text)" }}>
            <b>Linha {x.linha}</b>{x.nome ? ` · ${x.nome}` : ""}: <span style={{ color: "var(--text-muted)" }}>{x.motivo}</span>
          </li>
        ))}
        {itens.length > 200 && <li className="px-3 py-2" style={{ color: "var(--text-muted)" }}>… e mais {itens.length - 200}</li>}
      </ul>
    </div>
  );
}

export default function ImportarPlanilha({ tipo, onConcluir }: { tipo: "prestadores" | "ordens"; onConcluir: () => void }) {
  const T = TEXTOS[tipo];
  const [arquivo, setArquivo] = useState("");
  const [linhas, setLinhas] = useState<any[] | null>(null);
  const [previa, setPrevia] = useState<Resumo | null>(null);
  const [resultado, setResultado] = useState<Resumo | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [erro, setErro] = useState("");

  async function escolher(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; e.target.value = "";
    if (!f) return;
    setErro(""); setPrevia(null); setResultado(null); setLinhas(null); setArquivo(f.name); setOcupado(true);
    try {
      const l = await lerPlanilha(f);
      if (!l.length) { setErro("A planilha está vazia (a 1ª linha deve ser o cabeçalho)."); return; }
      const r = await api(T.rota, { method: "POST", body: JSON.stringify({ linhas: l, simular: true }) });
      if (r.detail || r.prontos === undefined) { setErro(r.detail || "Não foi possível ler a planilha."); return; }
      setLinhas(l); setPrevia(r);
    } catch (x: any) { setErro((x && x.message) || "Não foi possível ler o arquivo."); }
    finally { setOcupado(false); }
  }

  async function confirmar() {
    if (!linhas) return;
    setOcupado(true);
    try {
      const r = await api(T.rota, { method: "POST", body: JSON.stringify({ linhas }) });
      if (r.importados === undefined) { setErro(r.detail || "A importação não foi concluída."); return; }
      setResultado(r); setPrevia(null); setLinhas(null); onConcluir();
    } finally { setOcupado(false); }
  }

  const botao = "inline-flex items-center justify-center gap-2 px-4 py-2 min-h-11 rounded-lg text-sm font-bold cursor-pointer";
  return (
    <div className="space-y-4 text-center">
      <p className="text-sm text-left" style={{ color: "var(--text-muted)" }}>{T.dica} Nada do que já existe é apagado ou alterado.</p>
      <div className="flex flex-wrap justify-center gap-3">
        {tipo === "prestadores"
          ? <a href="modelo_cadastro_prestadores.xlsx" download className={botao} style={{ border: "2px solid var(--accent-green)", color: "var(--accent-green)" }}>Baixar modelo Excel</a>
          : <button type="button" onClick={() => { try { baixar("modelo_importacao_os.xlsx", modeloOrdensBlob()); } catch (x: any) { setErro(x.message); } }} className={botao} style={{ border: "2px solid var(--accent-green)", color: "var(--accent-green)", background: "transparent" }}>Baixar modelo Excel</button>}
        <label className={botao} style={{ background: "var(--accent-green)", color: "#fff", opacity: ocupado ? 0.6 : 1 }}>
          {ocupado && !previa ? "Lendo…" : "Escolher arquivo (.xlsx ou .csv)"}
          <input type="file" accept=".xlsx,.xls,.csv" className="hidden" disabled={ocupado} onChange={escolher} />
        </label>
      </div>
      {arquivo && <div className="text-xs" style={{ color: "var(--text-muted)" }}>Arquivo: <b style={{ color: "var(--text)" }}>{arquivo}</b></div>}
      {erro && <div className="px-3 py-2 rounded-lg text-sm text-left" role="alert" style={{ background: "rgba(198,40,40,.12)", color: "#C62828" }}>{erro}</div>}

      {previa && (
        <div className="space-y-3">
          <div className="px-3 py-2 rounded-lg text-sm text-left" style={{ background: "var(--bg-alt)", border: "1px solid var(--border)", color: "var(--text)" }}>
            Prévia: <b>{previa.prontos}</b> {T.coisa} pronto(s) para importar · <b>{(previa.ignorados || []).length}</b> linha(s) serão ignoradas.
          </div>
          <ListaIgnorados titulo="Linhas que serão ignoradas" itens={previa.ignorados || []} cor="#B26A00" />
          <div className="flex flex-wrap justify-center gap-3">
            <button type="button" disabled={ocupado || !previa.prontos} onClick={confirmar} className={botao} style={{ background: "var(--accent-green)", color: "#fff", opacity: ocupado || !previa.prontos ? 0.6 : 1 }}>
              {ocupado ? "Importando…" : `Importar ${previa.prontos} ${T.coisa}`}
            </button>
            <button type="button" disabled={ocupado} onClick={() => { setPrevia(null); setLinhas(null); setArquivo(""); }} className={botao} style={{ border: "1px solid var(--border)", color: "var(--text-muted)", background: "transparent" }}>Cancelar</button>
          </div>
        </div>
      )}

      {resultado && (
        <div className="space-y-3">
          <div className="px-3 py-2 rounded-lg text-sm text-left" role="status" style={{ background: "rgba(37,214,71,.12)", color: "var(--text)" }}>
            Importação concluída: <b>{resultado.importados}</b> {T.coisa} importado(s) · <b>{(resultado.ignorados || []).length}</b> ignorada(s){(resultado.falhas || []).length ? <> · <b style={{ color: "#C62828" }}>{(resultado.falhas || []).length}</b> não gravada(s) pelo banco</> : null}.
          </div>
          <ListaIgnorados titulo="Não gravadas pelo banco" itens={resultado.falhas || []} cor="#C62828" />
          <ListaIgnorados titulo="Ignoradas" itens={resultado.ignorados || []} cor="#B26A00" />
        </div>
      )}
    </div>
  );
}
