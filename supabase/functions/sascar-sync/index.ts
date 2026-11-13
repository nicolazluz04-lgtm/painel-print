// Atualiza a frota direto da Sascar (SasIntegra SOAP) a cada ~2 min e grava em kv: sascar_pos/main.
// Credenciais Sascar: Vault do banco (sascar_user / sascar_password), lidas via RPC sascar_creds() (só service_role).
// Só executa se o header x-sync-secret bater com o segredo "sascar_sync_secret" do Vault (o pg_cron o envia).
import { createClient } from "npm:@supabase/supabase-js@2";
const WS = "https://sasintegra.sascar.com.br/SasIntegra/SasIntegraWSService";
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const unesc = (s: string) => s.replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
async function pacote(u: string, p: string, qtd: number): Promise<any[]> {
  const soap = `<?xml version="1.0" encoding="UTF-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://webservice.web.integracao.sascar.com.br/"><soapenv:Header/><soapenv:Body><web:obterPacotePosicoesJSONComPlaca><usuario>${esc(u)}</usuario><senha>${esc(p)}</senha><quantidade>${qtd}</quantidade></web:obterPacotePosicoesJSONComPlaca></soapenv:Body></soapenv:Envelope>`;
  const r = await fetch(WS, { method: "POST", headers: { "content-type": "text/xml;charset=UTF-8", SOAPAction: "" }, body: soap });
  const t = await r.text();
  if (!r.ok) throw new Error("sascar " + r.status + ": " + (t.match(/<faultstring>(.*?)<\/faultstring>/)?.[1] ?? "").slice(0, 120));
  const out: any[] = [];
  for (const m of t.matchAll(/<return>([\s\S]*?)<\/return>/g)) { try { out.push(JSON.parse(unesc(m[1]))); } catch { /* ignora item inválido */ } }
  return out;
}
Deno.serve(async (req) => {
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const s = req.headers.get("x-sync-secret") ?? "";
  const chk = s ? await sb.rpc("sync_secret_ok", { s }) : { data: false };
  if (chk.data !== true) return new Response("forbidden", { status: 403 });
  try {
    const { data: cr, error: ce } = await sb.rpc("sascar_creds").single();
    if (ce || !cr?.usuario || !cr?.senha) throw new Error("credenciais sascar ausentes no Vault");
    const prev = await sb.from("kv").select("data").eq("collection", "sascar_pos").eq("id", "main").maybeSingle();
    const data: Record<string, any> = { ...((prev.data?.data as any)?.data ?? {}) };
    let lidos = 0;
    for (let i = 0; i < 3; i++) {             // drena até 3 pacotes por execução
      const lst = await pacote(cr.usuario, cr.senha, 1000);
      lidos += lst.length;
      for (const v of lst) {
        const pl = String(v.placa ?? v.placaVeiculo ?? "").trim().toUpperCase();
        const lat = +v.latitude, lng = +v.longitude;
        if (!pl || !isFinite(lat) || !isFinite(lng) || (lat === 0 && lng === 0)) continue;
        const dt = String(v.dataPosicao ?? "").slice(0, 16);
        if (data[pl]?.data && data[pl].data > dt) continue;   // mantém a posição mais recente
        data[pl] = { placa: pl, lat: +lat.toFixed(4), lng: +lng.toFixed(4), velocidade: Math.round(+v.velocidade || 0), data: dt,
          odometro: Math.round(+v.odometro || 0), uf: v.uf ?? "", cidade: v.cidade ?? "", ignicao: v.ignicao ?? null,
          ...(v.tensao == null ? {} : { tensao: v.tensao }) };
      }
      if (lst.length < 1000) break;
    }
    const { error } = await sb.from("kv").upsert({ collection: "sascar_pos", id: "main", data: { data, updated: Date.now(), total: Object.keys(data).length } });
    return new Response(JSON.stringify({ ok: !error, lidos, total: Object.keys(data).length, error: error?.message }), { headers: { "content-type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String((e as Error).message ?? e) }), { status: 500, headers: { "content-type": "application/json" } });
  }
});
