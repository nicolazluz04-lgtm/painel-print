// OPCIONAL e DESLIGADA: análise por IA do painel. Só funciona se (1) esta função for publicada,
// (2) o segredo ANTHROPIC_API_KEY for cadastrado nas Edge Functions e (3) AI_ENDPOINT for preenchido em config.js.
// Hoje AI_ENDPOINT está vazio, então o painel nem mostra o botão. Tem custo por uso.
// Só membros ativos do painel (public.is_member(), perguntado ao banco com o JWT de quem chamou); CORS restrito.
import { barrarOrigem, json as jsonCors, jwtDe, perguntarAoBanco } from "../_shared/http.ts";

Deno.serve(async (req) => {
  const parar = barrarOrigem(req); if (parar) return parar;
  const json = (b: unknown, status = 200) => jsonCors(req, b, status);
  if (req.method !== "POST") return json({ error: "method" }, 405);
  if (!(await perguntarAoBanco(jwtDe(req), "is_member"))) return json({ error: "unauthorized" }, 401);
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
