// Gestão de usuários do painel. Só administradores (tabela public.usuarios, role = 'admin').
// Ações (POST JSON): {acao:"listar"} | {acao:"salvar", email, nome, role, senha?} | {acao:"senha", email, senha} | {acao:"remover", email}
import { createClient } from "npm:@supabase/supabase-js@2";
const cors = { "access-control-allow-origin": "*", "access-control-allow-headers": "authorization, content-type, apikey, x-client-info", "access-control-allow-methods": "POST, OPTIONS" };
const json = (b: unknown, status = 200) => new Response(JSON.stringify(b), { status, headers: { ...cors, "content-type": "application/json" } });
const ROLES = ["admin", "gerente", "operador"];
const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ detail: "método" }, 405);
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
  const jwt = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  const { data: me } = await sb.auth.getUser(jwt);
  const myEmail = (me?.user?.email ?? "").toLowerCase();
  if (!myEmail) return json({ detail: "Faça login novamente." }, 401);
  const { data: meRow } = await sb.from("usuarios").select("role, ativo").eq("email", myEmail).maybeSingle();
  if (!meRow || meRow.role !== "admin" || !meRow.ativo) return json({ detail: "Somente administradores." }, 403);

  const b = await req.json().catch(() => ({}));
  const acao = String(b.acao ?? "");
  const email = String(b.email ?? "").trim().toLowerCase();

  // Mapa email -> usuário do Auth
  const authMap = new Map<string, any>();
  for (let page = 1; page < 20; page++) {
    const { data } = await sb.auth.admin.listUsers({ page, perPage: 200 });
    (data?.users ?? []).forEach((u) => u.email && authMap.set(u.email.toLowerCase(), u));
    if (!data || data.users.length < 200) break;
  }

  if (acao === "listar") {
    const { data: rows } = await sb.from("usuarios").select("*").order("role").order("nome");
    const out = (rows ?? []).map((r) => {
      const a = authMap.get(r.email);
      return { id: r.email, email: r.email, nome: r.nome, role: r.role, status: !r.ativo ? "inativo" : a ? "ativo" : "sem_senha",
        tem_acesso: !!a, ultimo_acesso: a?.last_sign_in_at ?? null };
    });
    // contas que existem no Auth mas não têm papel definido
    for (const [e, a] of authMap) if (!out.find((x) => x.email === e)) out.push({ id: e, email: e, nome: "", role: "operador", status: "pendente", tem_acesso: true, ultimo_acesso: a.last_sign_in_at ?? null });
    return json({ data: out, total: out.length });
  }

  if (!emailOk(email)) return json({ detail: "E-mail inválido." }, 400);
  const senha = b.senha == null ? "" : String(b.senha);
  if (senha && senha.length < 8) return json({ detail: "A senha precisa ter pelo menos 8 caracteres." }, 400);

  const definirSenha = async () => {
    const a = authMap.get(email);
    const r = a ? await sb.auth.admin.updateUserById(a.id, { password: senha, email_confirm: true })
                : await sb.auth.admin.createUser({ email, password: senha, email_confirm: true });
    if (r.error) throw new Error(r.error.message);
  };

  try {
    if (acao === "salvar") {
      const role = String(b.role ?? "operador");
      if (!ROLES.includes(role)) return json({ detail: "Papel inválido." }, 400);
      if (email === myEmail && role !== "admin") return json({ detail: "Você não pode rebaixar o próprio acesso." }, 400);
      const row: Record<string, unknown> = { email, role, ativo: true };
      if (b.nome != null) row.nome = String(b.nome).slice(0, 120);
      const { error } = await sb.from("usuarios").upsert(row);
      if (error) throw new Error(error.message);
      if (senha) await definirSenha();
      return json({ success: true });
    }
    if (acao === "senha") {
      if (!senha) return json({ detail: "Informe a nova senha." }, 400);
      const { data: r } = await sb.from("usuarios").select("email").eq("email", email).maybeSingle();
      if (!r) await sb.from("usuarios").insert({ email, role: "operador" });
      await definirSenha();
      return json({ success: true });
    }
    if (acao === "remover") {
      if (email === myEmail) return json({ detail: "Você não pode remover a si mesmo." }, 400);
      await sb.from("usuarios").delete().eq("email", email);
      const a = authMap.get(email);
      if (a) { const r = await sb.auth.admin.deleteUser(a.id); if (r.error) throw new Error(r.error.message); }
      return json({ success: true });
    }
    return json({ detail: "Ação desconhecida." }, 400);
  } catch (e) {
    return json({ detail: String((e as Error).message ?? e) }, 500);
  }
});
