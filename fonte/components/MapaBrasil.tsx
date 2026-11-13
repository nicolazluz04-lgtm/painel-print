import {vehHtml} from "../vehicon";
import {addBrasil} from "../brmap";
"use client";
import { BASES, houseHtml } from "@/lib/mapdata";
import { useEffect, useRef } from "react";

interface Prestador {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  tipo_servico: string;
  lat: number | null;
  lng: number | null;
  socorro_24h?: boolean;
  fatura?: boolean;
}

const SEG: Record<string, { cor: string; nome: string }> = {
  guincho: { cor: "#facc15", nome: "Guincho" },
  eletronica: { cor: "#3b82f6", nome: "Elétrica / Eletrônica" },
  eletrico: { cor: "#3b82f6", nome: "Elétrica / Eletrônica" },
  mecanico: { cor: "#22c55e", nome: "Mecânica" },
  borracharia: { cor: "#f97316", nome: "Borracharia" },
  pneus: { cor: "#f97316", nome: "Borracharia" },
  freio: { cor: "#ef4444", nome: "Freios" },
  combustivel: { cor: "#a855f7", nome: "Combustível" },
  funilaria: { cor: "#ec4899", nome: "Funilaria" },
  bau: { cor: "#06b6d4", nome: "Baú" },
  eletrica_mecanica: { cor: "#14b8a6", nome: "Elétrica / Mecânica" },
  outros: { cor: "#94a3b8", nome: "Outros" },
};
const segOf = (t: string) => SEG[String(t || "").toLowerCase()] || SEG.outros;
const CENTER: [number, number] = [-14.2, -51.9];
const ZOOM = 4;

export default function MapaBrasil({ prestadores, bases }: { prestadores: Prestador[]; bases?: { nome: string; lat: number; lng: number }[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const basesRef = useRef<any[]>([]);
  const roRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    let L: any;
    try { L = require("leaflet"); } catch { return; }
    const container = containerRef.current as HTMLElement & { _leaflet_id?: number };
    if (container._leaflet_id) {
      if (mapRef.current) { mapRef.current.invalidateSize(); mapRef.current.setView(CENTER, ZOOM, { animate: false }); }
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

  useEffect(() => {
    if (!mapRef.current) return;
    let L: any;
    try { L = require("leaflet"); } catch { return; }
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    prestadores.forEach(p => {
      if (!p.lat || !p.lng) return;
      const color = segOf(p.tipo_servico).cor;
      const html = vehHtml(color, "truck", false);
      const icon = L.divIcon({ html, className: "", iconSize: [16, 16], iconAnchor: [8, 8] });
      const marker = L.marker([p.lat, p.lng], { icon }).addTo(mapRef.current);
      marker.bindPopup(
        '<div style="font-family:Arial,sans-serif;font-size:12px;min-width:160px">'  +
        '<b>' + p.nome + '</b><br/>' + p.cidade + ' &mdash; ' + p.estado + '<br/>' +
        '<span style="color:' + color + ';font-weight:bold">● ' + segOf(p.tipo_servico).nome + '</span><br/><small>' + (p.fatura ? 'Faturado' : 'Não faturado') + '</small>' +
        (p.socorro_24h ? '<br/><small style="color:#2dc62d">✓ Socorro 24h</small>' : '') +
        '</div>'  
      );
      markersRef.current.push(marker);
    });
  }, [prestadores]);

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
      <style>{`@keyframes mpb-pulse{0%{transform:scale(.6);opacity:.4}100%{transform:scale(2.4);opacity:0}}`}</style>
      <div style={{ position: "relative", width: "100%", height: "100%" }}><div ref={containerRef} style={{ width:"100%", height:"100%" }} />
      <div style={{ position: "absolute", left: 10, bottom: 10, zIndex: 500, background: "rgba(12,17,20,.88)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 10, padding: "8px 10px", fontSize: 10, color: "#e8f2ec", lineHeight: 1.7 }}>
        <div style={{ fontSize: 8.5, letterSpacing: ".12em", textTransform: "uppercase", opacity: .6, marginBottom: 3 }}>Segmentos</div>
        {Array.from(new Map(Object.values(SEG).map(v => [v.nome, v])).values()).filter(v => prestadores.some(p => segOf(p.tipo_servico).nome === v.nome)).map(v => (
          <div key={v.nome} style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: "50%", background: v.cor, display: "inline-block" }} />{v.nome}<b style={{ marginLeft: "auto", paddingLeft: 10 }}>{prestadores.filter(p => p.lat && p.lng && segOf(p.tipo_servico).nome === v.nome).length}</b></div>
        ))}
      </div>
      </div>
    </>
  );
}
