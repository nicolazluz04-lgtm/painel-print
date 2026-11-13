export interface Base {
  nome: string;
  lat: number;
  lng: number;
  endereco?: string;
}

export const BASES: Base[] = [
  { nome: "Brasília", lat: -15.879206579466054, lng: -48.05441234030712 },
  { nome: "Belém", lat: -1.3724013091498326, lng: -48.383622109515485 },
  { nome: "Vitória", lat: -20.120071362483003, lng: -40.30156995513909 },
  { nome: "Cajamar", lat: -23.350170477479963, lng: -46.84882278293573 },
  { nome: "Jaraguá", lat: -23.44340591477374, lng: -46.75876096574071 },
  { nome: "São Luís", lat: -2.6674697348733076, lng: -44.288149134279436 },
  { nome: "Porto Velho", lat: -8.79909146146087, lng: -63.80255258793686 },
  { nome: "Curitiba", lat: -25.43307217312485, lng: -49.16251451914275 },
  { nome: "Vitória da Conquista", lat: -14.89830137003894, lng: -40.84380968409488 },
  { nome: "Feira de Santana", lat: -12.232095340215363, lng: -38.9578963111289 },
  { nome: "Recife", lat: -8.08002177893195, lng: -34.943434567006754 },
  { nome: "Campo Grande", lat: -20.492123682511714, lng: -54.61743780391561 },
  { nome: "Cuiabá", lat: -15.646167295076219, lng: -56.189760492822464 },
];

const R = 6371;

export function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function coordPorFilial(nome?: string): { lat: number; lng: number } | null {
  const n = String(nome || "").toLowerCase();
  if (!n) return null;
  const achou = BASES.find((b) => n.includes(b.nome.toLowerCase()));
  if (achou) return { lat: achou.lat, lng: achou.lng };
  if (n.includes("correios") && n.includes("sp")) return { lat: BASES[0].lat, lng: BASES[0].lng };
  return null;
}

/** Bases que funcionam como ponto de apoio / oficina (ferramenta). */
export function ehPontoDeApoio(nome?: string): boolean {
  return /jaragu|cajamar/i.test(String(nome || ""));
}

const HOUSE_PATH =
  '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>';

// engrenagem (indica ponto de apoio / manutenção)
const GEAR_PATH =
  '<path d="M12.2 2h-.4a2 2 0 0 0-2 2v.2a2 2 0 0 1-1 1.7l-.4.3a2 2 0 0 1-2 0l-.2-.1a2 2 0 0 0-2.7.7l-.2.4a2 2 0 0 0 .7 2.7l.2.1a2 2 0 0 1 1 1.7v.5a2 2 0 0 1-1 1.7l-.2.1a2 2 0 0 0-.7 2.7l.2.4a2 2 0 0 0 2.7.7l.2-.1a2 2 0 0 1 2 0l.4.3a2 2 0 0 1 1 1.7V20a2 2 0 0 0 2 2h.4a2 2 0 0 0 2-2v-.2a2 2 0 0 1 1-1.7l.4-.3a2 2 0 0 1 2 0l.2.1a2 2 0 0 0 2.7-.7l.2-.4a2 2 0 0 0-.7-2.7l-.2-.1a2 2 0 0 1-1-1.7v-.5a2 2 0 0 1 1-1.7l.2-.1a2 2 0 0 0 .7-2.7l-.2-.4a2 2 0 0 0-2.7-.7l-.2.1a2 2 0 0 1-2 0l-.4-.3a2 2 0 0 1-1-1.7V4a2 2 0 0 0-2-2z"/>' +
  '<circle cx="12" cy="12" r="3.1"/>';

/** HTML do marcador de base — casinha ou ferramenta (ponto de apoio). */
export function baseHtml(nome?: string): string {
  const apoio = ehPontoDeApoio(nome);
  const bg = apoio ? "#FF6A00" : "#f5c518";
  const icon = apoio ? GEAR_PATH : HOUSE_PATH;
  const stroke = apoio ? "#ffffff" : "#3a2c00";
  return (
    '<div style="position:relative;width:28px;height:28px">' +
    '<div style="position:absolute;inset:0;border-radius:8px;background:' + bg + ';border:2px solid #fff;' +
    'box-shadow:0 2px 8px rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;">' +
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="' + stroke + '" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round">' + icon + '</svg>' +
    '</div></div>'
  );
}

/** Compatibilidade com chamadas antigas. */
export function houseHtml(nome?: string): string {
  return baseHtml(nome);
}

