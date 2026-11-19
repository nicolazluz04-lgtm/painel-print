// Enquadramento dos mapas: mostra o que importa (os pontos do mapa) ou o Brasil inteiro, do tamanho que o
// mapa tiver na tela. Depois que a pessoa mexe (arrasta, zoom), o mapa não volta sozinho para o enquadramento.

/** Brasil continental, de ponta a ponta. */
export const BRASIL: [[number, number], [number, number]] = [[-33.75, -73.99], [5.27, -34.79]];

type Ponto = [number, number];
const valido = (p: any): p is Ponto =>
  Array.isArray(p) && isFinite(p[0]) && isFinite(p[1]) && Math.abs(p[0]) <= 90 && Math.abs(p[1]) <= 180 && !(p[0] === 0 && p[1] === 0);

export function criarEnquadramento(L: any, map: any, container: HTMLElement) {
  let mexeu = false;
  let ultimos: Ponto[] = [];
  const marcar = () => { mexeu = true; };
  container.addEventListener("pointerdown", marcar);
  container.addEventListener("wheel", marcar, { passive: true });

  function aplicar() {
    try {
      map.invalidateSize();
      const pts = ultimos.filter(valido);
      // margem para os ícones da borda (casinhas, caminhões) não ficarem cortados
      const margem = { padding: [20, 20], animate: false };
      if (pts.length >= 2) map.fitBounds(L.latLngBounds(pts), { ...margem, maxZoom: 9 });
      else if (pts.length === 1) map.setView(pts[0], 9, { animate: false });
      else map.fitBounds(BRASIL, margem);
    } catch { /* mapa ainda sem tamanho: o ResizeObserver chama de novo */ }
  }

  // O mapa ainda se ajusta logo depois de aparecer (camadas, barra lateral, celular): enquadra de novo em seguida.
  let timers: any[] = [];
  function aplicarJa() {
    timers.forEach(clearTimeout); aplicar();
    timers = [400, 1200].map(ms => setTimeout(() => { if (!mexeu) aplicar(); }, ms));
  }

  return {
    /** Enquadra nestes pontos (vazio = Brasil). Não mexe se a pessoa já ajustou o mapa. */
    enquadrar(pontos: Ponto[]) { ultimos = pontos || []; if (!mexeu) aplicarJa(); },
    /** Chamar quando o tamanho do mapa mudar. */
    redimensionou() { if (mexeu) { try { map.invalidateSize(); } catch {} } else aplicarJa(); },
    /** Volta ao enquadramento automático (botão "Enquadrar"). */
    reiniciar() { mexeu = false; aplicarJa(); },
    desligar() { timers.forEach(clearTimeout); container.removeEventListener("pointerdown", marcar); container.removeEventListener("wheel", marcar); },
  };
}
