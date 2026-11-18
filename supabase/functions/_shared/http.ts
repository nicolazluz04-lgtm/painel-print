// Helpers comuns das Edge Functions chamadas pelo navegador (admin-users, ai-insights).
// CORS restrito aos endereços do painel; nada de "*".
// Pastas que começam com "_" não viram função no deploy do Supabase: este arquivo é só importado.
import { createClient } from "npm:@supabase/supabase-js@2";

export const ORIGENS_PERMITIDAS = new Set([
  "https://painel-print.vercel.app",
  "https://nicolazluz04-lgtm.github.io",
  "http://localhost:8088", // teste local
]);

export function corsHeaders(req: Request): Record<string, string> {
  const origem = req.headers.get("origin") ?? "";
  const h: Record<string, string> = {
    "access-control-allow-headers": "authorization, content-type, apikey, x-client-info",
    "access-control-allow-methods": "POST, OPTIONS",
    vary: "Origin",
  };
  if (ORIGENS_PERMITIDAS.has(origem)) h["access-control-allow-origin"] = origem;
  return h;
}

export function json(req: Request, body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...corsHeaders(req), "content-type": "application/json" } });
}

// Trata o preflight e recusa navegadores de outras origens. Devolve uma Response quando a função deve parar aqui.
// Chamadas sem cabeçalho Origin (fora do navegador) seguem e dependem só do login.
export function barrarOrigem(req: Request): Response | null {
  const origem = req.headers.get("origin");
  if (origem && !ORIGENS_PERMITIDAS.has(origem)) return new Response("origem não permitida", { status: 403, headers: { vary: "Origin" } });
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(req) });
  return null;
}

export function jwtDe(req: Request): string {
  return (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
}

// Cliente com a sessão de quem chamou: as funções do banco (is_admin, is_member…) respondem sobre essa pessoa.
export function clienteDoUsuario(jwt: string) {
  return createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${jwt}` } },
  });
}

// Pergunta ao banco (RPC com o JWT de quem chamou). Só true conta como sim.
export async function perguntarAoBanco(jwt: string, funcao: "is_admin" | "is_member"): Promise<boolean> {
  if (!jwt) return false;
  const { data, error } = await clienteDoUsuario(jwt).rpc(funcao);
  return !error && data === true;
}
