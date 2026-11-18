// Frota Sascar: o servidor (Edge Function sascar-sync, a cada 2 min) grava em kv sascar_pos/main.
// As posições (~500 veículos) só são baixadas quando uma tela precisa delas (backend.js, garantirSascar).
// Aqui fica só o status mostrado no mapa da frota e no menu de exportação.
const INFO = (window.__sascarInfo = { status: "carrega ao abrir o mapa", updated: 0 });

export function atualizarInfoSascar(v, erro) {
  if (erro) { INFO.status = "erro ao ler posições"; return; }
  if (!v) { INFO.status = "aguardando primeira atualização"; return; }
  INFO.updated = v.updated || 0;
  const min = INFO.updated ? Math.round((Date.now() - INFO.updated) / 60000) : null;
  INFO.status = min != null && min > 10 ? "atrasada (" + min + " min sem atualizar)" : "ok (" + (v.total || 0) + " veículos)";
}
