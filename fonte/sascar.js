// Frota Sascar: o servidor (Edge Function sascar-sync, a cada 2 min) grava em kv sascar_pos/main.
// Aqui o painel só acompanha a data da última atualização para exibir o status.
const INFO = (window.__sascarInfo = { status: "aguardando", updated: 0 });

export async function startSascar(db) {
  if (!db) { INFO.status = "sem acesso ao banco"; return; }
  db.collection("sascar_pos").onSnapshot(s => {
    const d = s.docs.find(x => x.id === "main"); const v = d ? d.data() : null;
    if (!v) { INFO.status = "aguardando primeira atualização"; return; }
    INFO.updated = v.updated || 0;
    const min = INFO.updated ? Math.round((Date.now() - INFO.updated) / 60000) : null;
    INFO.status = min != null && min > 10 ? "atrasada (" + min + " min sem atualizar)" : "ok (" + (v.total || 0) + " veículos)";
  }, () => { INFO.status = "erro ao ler posições"; });
}
