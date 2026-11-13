import {IMGS} from "../images";
"use client";

const IMG: Record<string, string> = {
  cavalo: IMGS.cavalo,
  carreta: IMGS.carreta,
  truck: IMGS.truck,
  toco: IMGS.truck,
  van: IMGS.van,
};

export const TIPOS_VEICULO = [
  { v: "cavalo", l: "Cavalo mecânico" },
  { v: "truck", l: "Truck" },
  { v: "toco", l: "Toco" },
  { v: "van", l: "Van" },
  { v: "carreta", l: "Carreta" },
];

export function inferTipoVeiculo(modelo?: string, marca?: string, extra?: string): string {
  const t = ((modelo || "") + " " + (marca || "") + " " + (extra || "")).toLowerCase();
  if (t.includes("carreta") || t.includes("reboque") || t.includes("semirreboque") || t.includes("bitrem") || t.includes("rodotrem")) return "carreta";
  if (t.includes("van") || t.includes("sprinter") || t.includes("ducato") || t.includes("daily") || t.includes("master")) return "van";
  if (t.includes("toco")) return "toco";
  if (t.includes("truck") || t.includes("constellation") || t.includes("cargo") || t.includes("vm 270")) return "truck";
  return "cavalo";
}

export default function VehicleArt({ tipo, width = 132, height = 60 }: { tipo?: string; width?: number; height?: number }) {
  const key = String(tipo || "cavalo").toLowerCase();
  const src = IMG[key] || IMG.cavalo;
  const scale = key === "toco" ? 0.86 : 1;
  return (
    <img
      src={src}
      alt={key}
      draggable={false}
      style={{
        width: width * scale,
        height: height * scale,
        objectFit: "contain",
        filter: "invert(1) brightness(1.2)",
        mixBlendMode: "screen",
        flex: "none",
        pointerEvents: "none",
      }}
    />
  );
}

