import {vehHtml} from "../vehicon";
import {addBrasil} from "../brmap";
"use client";
import { BASES, houseHtml } from "@/lib/mapdata";
import { useEffect, useRef, useState } from "react";

interface OrdemServico {
  id: string;
  os: string;
  placa?: string;
  operacao?: string;
  status?: string;
  abertura?: string;
  descricao?: string;
  tipo_servico?: string;
}

interface Veiculo {
  id?: string;
  placa: string;
  nome?: string;
  modelo?: string;
  marca?: string;
}

const FILIAL_COORDS: Record<string, [number, number]> = {
  "Belém": [-1.455, -48.502],
  "Brasília": [-15.78, -47.93],
  "Campo Grande": [-20.469, -54.62],
  "Curitiba": [-25.428, -49.273],
  "Distrito Federal": [-15.78, -47.93],
  "Diversos": [-16.0, -48.0],
  "Feira de Santana": [-12.266, -38.966],
  "Manaus": [-3.119, -60.021],
  "Porto Velho": [-8.76, -63.9],
  "Recife": [-8.047, -34.877],
  "Salvador": [-12.971, -38.501],
  "São Paulo": [-23.55, -46.633],
  "Serra ES": [-20.128, -40.307],
  "Uberaba": [-19.748, -47.931],
  "Vitória da Conquista": [-14.866, -40.844],
};

const CENTER: [number, number] = [-14.2, -51.9];
const ZOOM = 4;

const SEEDS: [number, number][] = Array.from({ length: 200 }, (_, i) => [
  ((i * 7 + 3) % 21 - 10) / 1000,
  ((i * 13 + 7) % 21 - 10) / 1000,
]);

function slaInfo(abertura?: string): { color: string; label: string } {
  if (!abertura) return { color: "#2dc62d", label: "NORMAL" };
  const min = Math.floor((Date.now() - new Date(abertura).getTime()) / 60000);
  if (min >= 120) return { color: "#ef4444", label: "CRÍTICO" };
  if (min >= 60) return { color: "#f5c518", label: "ATENÇÃO" };
  return { color: "#2dc62d", label: "NORMAL" };
}

function timeLabel(abertura?: string): string {
  if (!abertura) return "0 min";
  const s = Math.floor((Date.now() - new Date(abertura).getTime()) / 1000);
  if (s < 3600) return Math.floor(s / 60) + " min";
  const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60);
  if (d > 0) return d + "d " + h + "h";
  return h + "h " + String(m).padStart(2, "0") + "min";
}

function buildDot(color: string, speed: string): string {
  return (
    '<div style="position:relative;width:28px;height:28px">' +
    '<div style="position:absolute;inset:0;border-radius:50%;border:2px solid ' + color + ';animation:mpa-ring ' + speed + ' ease-out infinite;"></div>' +
    '<div style="position:absolute;inset:7px;border-radius:50%;background:' + color + ';box-shadow:0 0 8px ' + color + ';animation:mpa-pulse ' + speed + ' ease-in-out infinite;"></div>' +
    '</div>'
  );
}

function buildTruck(color: string, rodando: boolean): string {
  return vehHtml(color, "truck", false);
}

export default function MapaAtendimento({ ordens, posicoes, veiculos, bases }: { ordens: OrdemServico[]; posicoes?: Record<string, { lat: number; lng: number }>; veiculos?: Veiculo[]; bases?: { nome: string; lat: number; lng: number }[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const basesRef = useRef<any[]>([]);
  const truckRef = useRef<any[]>([]);
  const roRef = useRef<ResizeObserver | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(p => p + 1), 60000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    let L: any;
    try { L = require("leaflet"); } catch { return; }
    const container = containerRef.current as HTMLElement & { _leaflet_id?: number };
    if (container._leaflet_id) {
      if (mapRef.current) { mapRef.current.invalidateSize(); mapRef.current.setView(CENTER, ZOOM); }
      return;
    }
    mapRef.current = L.map(container, { center: CENTER, zoom: ZOOM, minZoom: 3, maxZoom: 18, zoomControl: true, attributionControl: true });
    addBrasil(L, mapRef.current);
    roRef.current = new ResizeObserver(() => {
      if (!mapRef.current) return;
      mapRef.current.invalidateSize();
      mapRef.current.setView(CENTER, ZOOM, { animate: false });
    });
    roRef.current.observe(container);
    return () => { roRef.current?.disconnect(); };
  }, []);

  // Camada de caminhões Sascar (verde = rodando, vermelho = em manutenção)
  useEffect(() => {
    if (!mapRef.current) return;
    let L: any;
    try { L = require("leaflet"); } catch { return; }
    truckRef.current.forEach(m => m.remove());
    truckRef.current = [];
    const pos = posicoes || {};
    const emManut = new Set(ordens.map(o => (o.placa || "").toUpperCase()).filter(Boolean));
    Object.keys(pos).forEach(placa => {
      const p = pos[placa];
      if (!p || p.lat == null || p.lng == null) return;
      const up = placa.toUpperCase();
      const manut = emManut.has(up);
      if (Number((p as any).velocidade || 0) > 5) return;
      const color = "#3b82f6";
      const label = manut ? "PARADO · COM O.S." : "PARADO";
      const icon = L.divIcon({ html: buildTruck(color, !manut), className: "", iconSize: [16, 16], iconAnchor: [8, 8] });
      const marker = L.marker([p.lat, p.lng], { icon, zIndexOffset: 500 }).addTo(mapRef.current);
      const veic = (veiculos || []).find(v => (v.placa || "").toUpperCase() === up);
      marker.bindPopup(
        '<div style="font-family:Arial,sans-serif;font-size:12px;min-width:170px;padding:2px 0">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">' +
        '<span style="font-weight:bold">' + up + '</span>' +
        '<span style="font-size:10px;font-weight:bold;background:' + color + ';color:#fff;padding:1px 6px;border-radius:8px">' + label + '</span>' +
        '</div>' +
        (veic && (veic.nome || veic.modelo) ? '<div><b>Veículo:</b> ' + (veic.nome || veic.modelo) + '</div>' : '') +
        '<div><b>Velocidade:</b> ' + (p as any).velocidade + ' km/h</div>' +
        '<div style="color:#6b7280;font-size:11px;margin-top:3px">' + ((p as any).data || "") + '</div>' +
        '</div>'
      );
      truckRef.current.push(marker);
    });
  }, [ordens, posicoes, veiculos, tick]);

  // Camada de O.S. em aberto sem posição de veículo (fallback pela filial)
  useEffect(() => {
    if (!mapRef.current) return;
    let L: any;
    try { L = require("leaflet"); } catch { return; }
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    const pos = posicoes || {};
    const semPos = ordens.filter(o => !(o.placa && pos[(o.placa || "").toUpperCase()]));
    if (semPos.length >= 0) return;
    semPos.forEach((ordem, idx) => {
      const filial = ordem.operacao || "São Paulo";
      const base = FILIAL_COORDS[filial] ?? FILIAL_COORDS["São Paulo"];
      const info = slaInfo(ordem.abertura);
      const seed = SEEDS[idx % SEEDS.length];
      const lat = base[0] + seed[0], lng = base[1] + seed[1];
      const mins = ordem.abertura ? Math.floor((Date.now() - new Date(ordem.abertura).getTime()) / 60000) : 0;
      const speed = mins >= 120 ? "0.8s" : mins >= 60 ? "1.2s" : "2s";
      const icon = L.divIcon({ html: buildDot(info.color, speed), className: "", iconSize: [28, 28], iconAnchor: [14, 14] });
      const marker = L.marker([lat, lng], { icon }).addTo(mapRef.current);
      marker.bindPopup(
        '<div style="font-family:Arial,sans-serif;font-size:12px;min-width:170px;padding:2px 0">' +
        '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px">' +
        '<span style="font-weight:bold">OS #' + (ordem.os || '—') + '</span>' +
        '<span style="font-size:10px;font-weight:bold;background:' + info.color + ';color:#fff;padding:1px 6px;border-radius:8px">' + info.label + '</span>' +
        '</div>' +
        '<div><b>Placa:</b> ' + (ordem.placa || '—') + '</div>' +
        '<div><b>Filial:</b> ' + filial + '</div>' +
        '<div><b>Status:</b> ' + (ordem.status || '—') + '</div>' +
        '<div style="color:' + info.color + ';font-weight:bold;font-size:13px;margin-top:5px">' + timeLabel(ordem.abertura) + ' em aberto</div>' +
        '</div>'
      );
      markersRef.current.push(marker);
    });
  }, [ordens, posicoes, tick]);

  useEffect(() => {
    if (!mapRef.current) return;
    let L: any;
    try { L = require("leaflet"); } catch { return; }
    basesRef.current.forEach((m: any) => m.remove());
    basesRef.current = [];
    (bases && bases.length ? bases : BASES).forEach((b: any) => {
      const icon = L.divIcon({ html: houseHtml(b.nome), className: "", iconSize: [28, 28], iconAnchor: [14, 14] });
      const mk = L.marker([b.lat, b.lng], { icon, zIndexOffset: 900 }).addTo(mapRef.current);
      mk.bindPopup('<div style="font-family:Arial,sans-serif;font-size:12px;min-width:180px"><b>Base ' + b.nome + '</b><br/>' + (b.endereco || 'Ponto fixo da operação') + '</div>');
      basesRef.current.push(mk);
    });
  }, [bases]);

  return (
    <>
      <style>{`
        @keyframes mpa-ring {
          0%   { transform: scale(0.8); opacity: 0.9; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        @keyframes mpa-pulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.18); opacity: 0.75; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes mpa-ring  { from {} to {} }
          @keyframes mpa-pulse { from {} to {} }
        }
      `}</style>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </>
  );
}


