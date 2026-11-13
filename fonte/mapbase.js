// Mapa de ruas (estilo Google Maps): o dono baixa imagens de 3 níveis de zoom pelo CodeWords uma única vez e guarda no banco.
const SIZE = 31000;
export const LAYERS = [
  { id: "z5", z: 5, box: [-74.5, -34, -33.5, 5.5], n: 9, bounds: [[-40.97989806962013, -78.75], [11.178401873711781, -22.5]] },
  { id: "z7", z: 7, box: [-54, -26, -39, -18], n: 13, bounds: [[-27.059125784374054, -56.25], [-16.636191878397657, -36.5625]] },
  { id: "z9", z: 9, box: [-47.6, -24.2, -45.6, -22.9], n: 7, bounds: [[-24.527134822597805, -47.8125], [-22.59372606392931, -45.0]] },
  { id: "z11", z: 11, box: [-47.1, -23.9, -46.2, -23.2], n: 25, bounds: [[-24.04646399966657, -47.109375], [-23.079731762449878, -46.0546875]] },
];
const PY = (L, i) => `
import httpx, math, io, base64
from PIL import Image
z=${L.z}; w,s,e,n=${JSON.stringify(L.box)}; T=256
tx=lambda l:(l+180)/360*2**z
ty=lambda l:(1-math.log(math.tan(math.radians(l))+1/math.cos(math.radians(l)))/math.pi)/2*2**z
x0,x1=int(tx(w)),int(tx(e)); y0,y1=int(ty(n)),int(ty(s))
im=Image.new("RGB",((x1-x0+1)*T,(y1-y0+1)*T))
c=httpx.Client(headers={"User-Agent":"PainelPrint/1.0"},timeout=30,follow_redirects=True)
G="https://server.arcgisonline.com/ArcGIS/rest/services/"
for x in range(x0,x1+1):
    for y in range(y0,y1+1):
        a=Image.open(io.BytesIO(c.get(G+f"World_Imagery/MapServer/tile/{z}/{y}/{x}").content)).convert("RGBA")
        l=Image.open(io.BytesIO(c.get(G+f"Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}").content)).convert("RGBA")
        a.alpha_composite(l); im.paste(a.convert("RGB"),((x-x0)*T,(y-y0)*T))
b=io.BytesIO(); im.save(b,"WEBP",quality=70,method=4)
s64=base64.b64encode(b.getvalue()).decode()
print("MB="+s64[${i}*${SIZE}:(${i}+1)*${SIZE}]+"=END", len(s64))
`;
export const MAPBASE = (window.__mapBaseInfo = { status: "" });
function parse(res) {
  let p = res && res.payload; if (typeof p === "string") { try { p = JSON.parse(p); } catch (e) {} }
  let so = p && p.stdout; if (typeof so !== "string") so = JSON.stringify(res && (res.payload || res.content)) || "";
  const m = so.match(/MB=([A-Za-z0-9+\/=]*?)=END/); if (!m) throw new Error("sem dados");
  return m[1];
}
export async function startMapBase(db, isOwner) {
  if (window.__mapLayers) { MAPBASE.status = "ok"; return; }
  if (!db) return;
  let started = false;
  db.collection("mapa_s").onSnapshot(s => {
    const d = {}; s.docs.forEach(x => { d[x.id] = x.data(); });
    const ok = d.meta && LAYERS.every(L => Array.from({ length: L.n }, (_, i) => d[L.id + "_" + i]).every(Boolean));
    if (ok) {
      const out = LAYERS.map(L => ({ id: L.id, bounds: L.bounds, uri: "data:image/webp;base64," + Array.from({ length: L.n }, (_, i) => d[L.id + "_" + i].d).join("") }));
      if (!window.__mapLayers || window.__mapLayers.map(x => x.uri.length).join() !== out.map(x => x.uri.length).join()) {
        window.__mapLayers = out; window.__mapBase = out[0].uri; window.dispatchEvent(new Event("mapbase"));
      }
    } else if (isOwner && !started) {
      setTimeout(async () => {
        if (started || window.__mapLayers) return; started = true;
        try {
          const mcp = await window.claude.use("mcp"); if (!mcp) { MAPBASE.status = "conector indisponível"; started = false; return; }
          const jobs = []; LAYERS.forEach(L => { for (let i = 0; i < L.n; i++) if (!d[L.id + "_" + i]) jobs.push([L, i]); });
          const total = jobs.length; let k = 0;
          const worker = async () => { while (jobs.length) { const [L, i] = jobs.shift();
            const res = await mcp.callTool("CodeWords", "run_code", { code: PY(L, i), dependencies: ["pillow", "httpx"] }, { cache: false, signal: AbortSignal.timeout(150000) });
            await db.collection("mapa_s").doc(L.id + "_" + i).set({ d: parse(res) }); k++; MAPBASE.status = "baixando mapa " + k + "/" + total; } };
          MAPBASE.status = "baixando mapa 0/" + total;
          await Promise.all([worker(), worker(), worker()]);
          await db.collection("mapa_s").doc("meta").set({ ts: Date.now() });
          MAPBASE.status = "ok";
        } catch (e) { MAPBASE.status = "falha: " + ((e && (e.code || e.message)) || "erro"); started = false; }
      }, 4000);
    }
  }, () => {});
}
