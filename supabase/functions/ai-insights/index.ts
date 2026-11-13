// Análise por IA do painel. Segredo: ANTHROPIC_API_KEY. Só usuários logados (sessão real do Supabase Auth).
import { createClient } from "npm:@supabase/supabase-js@2";
const ORIGIN = Deno.env.get("ALLOWED_ORIGIN") ?? "*";
const cors = { "access-control-allow-origin": ORIGIN, "access-control-allow-headers": "authorization, content-type, apikey", "access-control-allow-methods": "POST, OPTIONS" };
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, "content-type": "application/json" } });
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method" }, 405);
  const jwt = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!);
  const { data: u, error } = await sb.auth.getUser(jwt);
  if (error || !u?.user) return json({ error: "unauthorized" }, 401);
  const { prompt } = await req.json().catch(() => ({ prompt: "" }));
  if (!prompt) return json({ error: "prompt" }, 400);
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "x-api-key": Deno.env.get("ANTHROPIC_API_KEY")!, "anthropic-version": "2023-06-01", "content-type": "application/json" },
    body: JSON.stringify({ model: "claude-sonnet-5-5", max_tokens: 1500, messages: [{ role: "user", content: String(prompt).slice(0, 30000) }] }),
  });
  if (!r.ok) return json({ error: "ia " + r.status }, 502);
  const j = await r.json();
  return json({ text: j.content?.[0]?.text ?? "" });
});
