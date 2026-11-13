import {IMGS} from "../images";
"use client";
import { inferTipoVeiculo } from "./VehicleArt";

const IMG: Record<string, string> = {
  cavalo: IMGS.cavalo,
  carreta: IMGS.carreta,
  truck: IMGS.truck,
  toco: IMGS.truck,
  van: IMGS.van,
};

function tempo(iso?: string) {
  if (!iso) return { txt: "--", min: 0 };
  const min = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (min < 60) return { txt: min + " min", min };
  if (min < 1440) return { txt: Math.floor(min / 60) + "h " + String(min % 60).padStart(2, "0") + "min", min };
  return { txt: Math.floor(min / 1440) + "d " + Math.floor((min % 1440) / 60) + "h", min };
}

export default function OSCard({ o, canWrite, onAvancar, onReport, onEditar }: {
  o: any; canWrite?: boolean;
  onAvancar?: (o: any) => void; onReport?: (o: any) => void; onEditar?: (o: any) => void;
}) {
  const t = tempo(o.abertura);
  const st = String(o.status || "");
  const critico = t.min >= 120;
  const atencao = t.min >= 60 && t.min < 120;

  let flag = { txt: "AGUARDANDO", cor: "#1E88E5", cls: "info" };
  if (critico) flag = { txt: "ATENÇÃO CRÍTICA", cor: "#E53935", cls: "crit" };
  else if (atencao) flag = { txt: "ATENÇÃO", cor: "#F5B301", cls: "warn" };
  else if (st === "Veículo liberado" || st === "Liberado") flag = { txt: "LIBERADO", cor: "#25D647", cls: "ok" };
  else if (st === "Serviço em execução" || st === "Prestador a caminho" || st === "Prestador no local") flag = { txt: "EM ANDAMENTO", cor: "#25D647", cls: "ok" };
  else if (st.indexOf("orçamento") >= 0) flag = { txt: "AGUARDANDO ORÇAMENTO", cor: "#1E88E5", cls: "info" };

  const tipo = String(o.tipo_veiculo || inferTipoVeiculo(o.modelo, o.marca, "")).toLowerCase();
  const img = IMG[tipo] || IMG.cavalo;
  const carregado = o.carga === "carregado";

  return (
    <div className={"oscard " + flag.cls}>
      <div className="osc-head">
        <span className="osc-os">OS {o.os || "—"}</span>
        <span className="osc-flag" style={{ color: flag.cor, borderColor: flag.cor + "66", background: flag.cor + "20" }}>{flag.txt}</span>
      </div>
      <div className="osc-stage">
        <img src={img} alt={tipo} />
        <div className="osc-plate">
          <div className="osc-lbl">Placa</div>
          <div className="osc-placa">{o.placa || "—"}</div>
          <span className="osc-tax" style={carregado ? { background: "#E5393520", color: "#ff9b96" } : { background: "#25D64720", color: "#7cf09a" }}>
            {carregado ? "Carregado" : o.carga === "vazio" ? "Vazio" : "—"}
          </span>
        </div>
      </div>
      <div className="osc-rows">
        <div><span>Veículo</span><b>{[o.modelo, o.marca].filter(Boolean).join(" ") || "—"}</b></div>
        <div><span>Filial</span><b>{o.operacao || "—"}</b></div>
        <div><span>Abertura</span><b>{o.abertura ? new Date(o.abertura).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—"}</b></div>
        {o.falha && <div title={[o.sistema, o.item_defeito, o.falha, o.complemento_defeito, o.cod_defeito, o.execucao && ("Execução: " + o.execucao)].filter(Boolean).join(" › ")}><span>Defeito</span><b>{[o.grupo_os, o.item_defeito, o.falha].filter(Boolean).join(" › ")}</b></div>}
      </div>
      <div className="osc-clock">
        <span className="osc-lbl">Tempo decorrido</span>
        <span className="osc-time" style={{ color: critico ? "#ff6b6b" : atencao ? "#f5c451" : "#4ade80" }}>{t.txt}</span>
      </div>
      <div className="osc-acts">
        {canWrite && onAvancar && <button onClick={() => onAvancar(o)} className="osc-btn">AVANÇAR</button>}
        {onReport && <button onClick={() => onReport(o)} className="osc-sq" title="Report">▤</button>}
        {onEditar && <button onClick={() => onEditar(o)} className="osc-sq" title="Editar">✎</button>}
      </div>
      <div className="osc-type">{tipo ? tipo.charAt(0).toUpperCase() + tipo.slice(1) : ""}</div>
    </div>
  );
}

