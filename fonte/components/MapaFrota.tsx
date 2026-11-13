import {vehHtml} from "../vehicon";
import {addBrasil} from "../brmap";
"use client";
import { useEffect, useRef, useState } from "react";
import { BASES, houseHtml } from "@/lib/mapdata";

interface Pos {
  lat: number; lng: number; velocidade?: number; ignicao?: any; data?: string;
  cidade?: string; uf?: string; motorista?: string; odometro?: number; tensao?: number;
}
interface Ordem { id: string; os: string; placa?: string; }
interface Props {
  posicoes?: Record<string, Pos>;
  ordens: Ordem[];
  bases?: { nome: string; lat: number; lng: number; endereco?: string }[];
}

const CENTER: [number, number] = [-14.2, -51.9];
const ZOOM = 4;
const CELL = 58;

const COR_RODANDO = "#2dc62d";
const COR_MANUT = "#ef4444";
const COR_PARADO = "#3b82f6";

function truckIcon(color: string, pulso: boolean): string {
  return vehHtml(color, "truck", false);
}

function clusterIcon(count: number, cor: string): string {
  const size = count > 100 ? 46 : count > 20 ? 40 : 34;
  return (
    '<div style="width:' + size + 'px;height:' + size + 'px;border-radius:50%;background:rgba(10,16,20,.92);' +
    'border:2.5px solid ' + cor + ';box-shadow:0 0 0 4px ' + cor + '22, 0 3px 10px rgba(0,0,0,.55);' +
    'display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;' +
    'font-family:ui-monospace,monospace;font-size:' + (count > 100 ? 14 : 12) + 'px">' + count + '</div>'
  );
}

export default function MapaFrota({ posicoes, ordens, bases }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const layerRef = useRef<any>(null);
  const roRef = useRef<ResizeObserver | null>(null);
  const [contagem, setContagem] = useState({ rodando: 0, manut: 0, parado: 0 });
  const [busca, setBusca] = useState("");
  const [sel, setSel] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    let L: any;
    try { L = require("leaflet"); } catch { return; }
    const container = containerRef.current as HTMLElement & { _leaflet_id?: number };
    if (container._leaflet_id) {
      if (mapRef.current) { mapRef.current.invalidateSize(); }
      return;
    }
    mapRef.current = L.map(container, { center: CENTER, zoom: ZOOM, minZoom: 3, maxZoom: 18, zoomControl: true, attributionControl: true });
    addBrasil(L, mapRef.current);
    layerRef.current = L.layerGroup().addTo(mapRef.current);
    roRef.current = new ResizeObserver(() => { if (mapRef.current) mapRef.current.invalidateSize(); });
    roRef.current.observe(container);
    return () => { roRef.current?.disconnect(); };
  }, []);

  // desenha veículos (com agrupamento) + bases
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    let L: any;
    try { L = require("leaflet"); } catch { return; }

    const emManut: Record<string, string> = {};
    (ordens || []).forEach(o => {
      const p = (o.placa || "").toUpperCase().split("-")[0].trim();
      if (p) emManut[p] = o.os;
    });

    const pontos: any[] = [];
    const pos = posicoes || {};
    Object.keys(pos).forEach(placa => {
      const p = pos[placa];
      if (!p || p.lat == null || p.lng == null) return;
      const up = placa.toUpperCase();
      const vel = Number(p.velocidade || 0);
      const osNum = emManut[up];
      let cor = COR_PARADO, label = "PARADO";
      if (vel > 5) { cor = COR_RODANDO; label = "EM MOVIMENTO"; }
      pontos.push({ placa: up, lat: Number(p.lat), lng: Number(p.lng), vel, osNum, cor, label, raw: p });
    });

    setContagem({
      rodando: pontos.filter(x => x.cor === COR_RODANDO).length,
      manut: pontos.filter(x => x.cor === COR_MANUT).length,
      parado: pontos.filter(x => x.cor === COR_PARADO).length,
    });

    function desenhar() {
      const layer = layerRef.current;
      if (!layer || !map) return;
      layer.clearLayers();
      const z = map.getZoom();

      // casinhas das bases
      (bases && bases.length ? bases : BASES).forEach((b: any) => {
        const ic = L.divIcon({ html: houseHtml(b.nome), className: "", iconSize: [28, 28], iconAnchor: [14, 14] });
        const mk = L.marker([b.lat, b.lng], { icon: ic, zIndexOffset: 900 });
        mk.bindPopup('<div style="font-family:Arial,sans-serif;font-size:12px;min-width:180px"><b>Base ' + b.nome + '</b><br/>' + (b.endereco || 'Ponto fixo da operação') + '</div>');
        mk.addTo(layer);
      });

      // agrupamento por célula em pixels (evita amontoamento)
      const grupos: Record<string, any[]> = {};
      pontos.forEach(pt => {
        const pr = map.project([pt.lat, pt.lng], z);
        const key = Math.floor(pr.x / CELL) + ":" + Math.floor(pr.y / CELL);
        (grupos[key] = grupos[key] || []).push(pt);
      });

      Object.keys(grupos).forEach(key => {
        const g = grupos[key];
        if (g.length === 1) {
          const pt = g[0];
          const ic = L.divIcon({ html: truckIcon(pt.cor, !!pt.osNum || pt.vel > 5), className: "", iconSize: [16, 16], iconAnchor: [8, 8] });
          const mk = L.marker([pt.lat, pt.lng], { icon: ic });
          mk.bindPopup(
            '<div style="font-family:Arial,sans-serif;font-size:12px;min-width:185px">' +
            '<div style="display:flex;justify-content:space-between;margin-bottom:5px"><b>' + pt.placa + '</b>' +
            '<span style="font-size:10px;font-weight:700;background:' + pt.cor + ';color:#fff;padding:1px 6px;border-radius:8px">' + pt.label + '</span></div>' +
            (pt.raw.motorista ? '<div><b>Motorista:</b> ' + pt.raw.motorista + '</div>' : '') +
            '<div><b>Velocidade:</b> ' + pt.vel + ' km/h</div>' +
            (pt.raw.odometro ? '<div><b>KM:</b> ' + Number(pt.raw.odometro).toLocaleString('pt-BR') + '</div>' : '') +
            (pt.raw.tensao != null ? '<div><b>Bateria:</b> ' + pt.raw.tensao + ' V</div>' : '') +
            '<div><b>Local:</b> ' + (pt.raw.cidade || '—') + (pt.raw.uf ? '/' + pt.raw.uf : '') + '</div>' +
            (pt.osNum ? '<div style="margin-top:4px"><b>O.S.:</b> ' + pt.osNum + '</div>' : '') +
            '</div>'
          );
          mk.addTo(layer);
        } else {
          const lat = g.reduce((a, p) => a + p.lat, 0) / g.length;
          const lng = g.reduce((a, p) => a + p.lng, 0) / g.length;
          const criticos = g.filter(p => p.osNum).length;
          const rodando = g.filter(p => p.cor === COR_RODANDO).length;
          const cor = rodando > 0 ? COR_RODANDO : COR_PARADO;
          const ic = L.divIcon({ html: clusterIcon(g.length, cor), className: "", iconSize: [48, 48], iconAnchor: [24, 24] });
          const mk = L.marker([lat, lng], { icon: ic, zIndexOffset: 600 });
          mk.bindPopup(
            '<div style="font-family:Arial,sans-serif;font-size:12px;min-width:150px"><b>' + g.length + ' veículos nesta área</b><br/>' +
            'Rodando: ' + rodando + '<br/>Em manutenção: ' + criticos + '<br/><span style="color:#6b7280;font-size:11px">Clique para aproximar</span></div>'
          );
          mk.on("click", () => { map.setView([lat, lng], Math.min(z + 2, 16)); });
          mk.addTo(layer);
        }
      });
    }

    desenhar();
    map.on("zoomend", desenhar);
    map.on("moveend", desenhar);
    return () => {
      map.off("zoomend", desenhar);
      map.off("moveend", desenhar);
    };
  }, [posicoes, ordens, bases]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <style>{`
        @keyframes mfr-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.14); } }
        @media (prefers-reduced-motion: reduce) { @keyframes mfr-pulse { from {} to {} } }
      `}</style>
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
      <div style={{ position: "absolute", left: 10, bottom: 10, zIndex: 500, background: "rgba(12,17,20,.88)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 10, padding: "8px 10px", fontSize: 10, color: "#e8f2ec", backdropFilter: "blur(4px)", lineHeight: 1.7 }}>
        <div style={{ fontSize: 8.5, letterSpacing: ".12em", textTransform: "uppercase", opacity: .6, marginBottom: 3 }}>Legenda</div>
        <div style={{ fontSize: 9, opacity: .75, marginBottom: 3 }}>{((window as any).__sascarInfo && (window as any).__sascarInfo.updated) ? "Sascar · atualizado " + new Date((window as any).__sascarInfo.updated).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "Sascar · aguardando dados"}{(window as any).__sascarInfo && (window as any).__sascarInfo.status && (window as any).__sascarInfo.status !== "ok" && String((window as any).__sascarInfo.status).indexOf("ok") !== 0 ? " · " + (window as any).__sascarInfo.status : ""}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: 2, background: COR_RODANDO, display: "inline-block" }} />Em movimento <b style={{ marginLeft: "auto", fontFamily: "ui-monospace" }}>{contagem.rodando}</b></div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: 2, background: COR_PARADO, display: "inline-block" }} />Parado <b style={{ marginLeft: "auto", fontFamily: "ui-monospace" }}>{contagem.parado}</b></div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 2, paddingTop: 3, borderTop: "1px solid rgba(255,255,255,.12)" }}><span style={{ width: 9, height: 9, borderRadius: 2, background: "#f5c518", display: "inline-block" }} />Base</div><div style={{ display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 9, height: 9, borderRadius: 2, background: "#FF6A00", display: "inline-block" }} />Ponto de apoio</div>
      </div>
      <div style={{ position: "absolute", top: 10, right: 10, zIndex: 500, width: 236 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(12,17,20,.92)", border: "1px solid rgba(255,255,255,.18)", borderRadius: 9, padding: "6px 9px" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e8f2ec" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.6-3.6" /></svg>
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar placa" style={{ background: "transparent", border: "none", outline: "none", color: "#e8f2ec", fontSize: 11, width: "100%" }} />
        </div>
        {busca.trim().length >= 2 && (
          <div style={{ marginTop: 4, background: "rgba(12,17,20,.96)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 9, maxHeight: 150, overflowY: "auto" }}>
            {Object.keys(posicoes || {}).filter(pl => pl.toUpperCase().includes(busca.trim().toUpperCase())).slice(0, 6).map(pl => (
              <div key={pl} onClick={() => { const pt: any = (posicoes || {})[pl]; if (pt && mapRef.current) mapRef.current.setView([pt.lat, pt.lng], 16); setSel(pl); setBusca(""); }} style={{ padding: "5px 9px", fontSize: 11, color: "#e8f2ec", cursor: "pointer", fontFamily: "ui-monospace" }}>{pl}</div>
            ))}
            {Object.keys(posicoes || {}).filter(pl => pl.toUpperCase().includes(busca.trim().toUpperCase())).length === 0 && (
              <div style={{ padding: "6px 9px", fontSize: 10, color: "#8fa1a9" }}>Nenhum veículo</div>
            )}
          </div>
        )}
        {sel && (() => {
          const pt: any = (posicoes || {})[sel];
          if (!pt) return null;
          const v = Number(pt.velocidade || 0);
          const t: any = pt.tensao;
          const bat = t == null ? "sem leitura" : t >= 24 ? "Boa" : t >= 22 ? "Atenção" : "Baixa";
          const batCor = t == null ? "#8fa1a9" : t >= 24 ? "#25D647" : t >= 22 ? "#F5B301" : "#E53935";
          return (
            <div style={{ marginTop: 6, background: "rgba(12,17,20,.96)", border: "1px solid rgba(255,255,255,.18)", borderRadius: 9, padding: "8px 10px", color: "#e8f2ec", fontSize: 10.5, lineHeight: 1.7 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                <b style={{ fontFamily: "ui-monospace", fontSize: 11.5 }}>{sel}</b>
                <span onClick={() => setSel(null)} style={{ cursor: "pointer", opacity: .6 }}>×</span>
              </div>
              <div>Local: <b>{pt.cidade || "—"}{pt.uf ? "/" + pt.uf : ""}</b></div>
              <div>Velocidade: <b>{v} km/h</b></div>
              <div>Bateria: <b style={{ color: batCor }}>{t != null ? t + " V · " : ""}{bat}</b></div>
              {pt.odometro ? <div>KM: <b>{Number(pt.odometro).toLocaleString("pt-BR")}</b></div> : null}
            </div>
          );
        })()}
      </div>
    </div>
  );
}

