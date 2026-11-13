// Adaptador: liga o painel (escrito para o runtime do claude.ai) ao Supabase.
// Login obrigatório; o papel (admin / gerente / operador) vem da tabela public.usuarios.
(function () {
  var C = window.PRINT_CONFIG || {};
  var ok = C.SUPABASE_URL && C.SUPABASE_URL.indexOf("SEU-PROJETO") < 0 && window.supabase;
  var sb = ok ? window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY) : null;
  var me = null, session = null;

  var ready = (async function () {
    if (!sb) return null;
    session = (await sb.auth.getSession()).data.session;
    if (!session) return null;
    var email = String(session.user.email || "").toLowerCase();
    var role = "operador", nome = "";
    try { var r = await sb.rpc("my_role"); if (!r.error && r.data) role = r.data; } catch (e) {}
    try { var u = await sb.from("usuarios").select("nome").eq("email", email).maybeSingle(); if (u.data && u.data.nome) nome = u.data.nome; } catch (e) {}
    me = { email: email, nome: nome || email, role: role };
    return me;
  })();
  window.__printReady = ready;

  function col(name) {
    return {
      onSnapshot: function (cb, err) {
        var rows = {};
        function emit() { cb({ docs: Object.keys(rows).map(function (id) { return { id: id, data: function () { return rows[id]; } }; }) }); }
        sb.from("kv").select("id,data").eq("collection", name).then(function (r) {
          if (r.error) { err && err(r.error); return; }
          (r.data || []).forEach(function (x) { rows[x.id] = x.data; }); emit();
        });
        sb.channel("kv-" + name + "-" + Math.random().toString(36).slice(2))
          .on("postgres_changes", { event: "*", schema: "public", table: "kv", filter: "collection=eq." + name }, function (p) {
            if (p.eventType === "DELETE") delete rows[p.old.id]; else rows[p.new.id] = p.new.data; emit();
          }).subscribe();
        return function () {};
      },
      doc: function (id) {
        return {
          set: async function (data) { var r = await sb.from("kv").upsert({ collection: name, id: String(id), data: data }); if (r.error) throw r.error; },
          delete: async function () { var r = await sb.from("kv").delete().eq("collection", name).eq("id", String(id)); if (r.error) throw r.error; },
          get: async function () { var r = await sb.from("kv").select("data").eq("collection", name).eq("id", String(id)).maybeSingle(); return { exists: !!r.data, data: function () { return r.data && r.data.data; } }; }
        };
      }
    };
  }

  async function authHeaders() {
    var s = sb && (await sb.auth.getSession()).data.session;
    var h = { "Content-Type": "application/json", apikey: C.SUPABASE_ANON_KEY };
    if (s) h.Authorization = "Bearer " + s.access_token;
    return h;
  }

  // Gestão de usuários (só admin; validado no servidor pela Edge Function admin-users)
  window.__printUsers = async function (acao, payload) {
    var r = await fetch(C.SUPABASE_URL + "/functions/v1/admin-users", { method: "POST", headers: await authHeaders(), body: JSON.stringify(Object.assign({ acao: acao }, payload || {})) });
    var j = await r.json().catch(function () { return {}; });
    if (!r.ok) throw new Error(j.detail || ("erro " + r.status));
    return j;
  };

  var sample = null;
  if (C.AI_ENDPOINT) {
    sample = async function (prompt) {
      var r = await fetch(C.AI_ENDPOINT, { method: "POST", headers: await authHeaders(), body: JSON.stringify({ prompt: typeof prompt === "string" ? prompt : JSON.stringify(prompt) }) });
      if (!r.ok) throw { code: "error", message: "IA " + r.status };
      var j = await r.json(); return { text: j.text, truncated: false };
    };
    sample.json = async function (p) { var t = (await sample(p)).text; var m = t.match(/\{[\s\S]*\}/); return JSON.parse(m ? m[0] : t); };
  }

  var caps = {
    user: async function () { await ready; var role = me ? me.role : "operador"; return { isOwner: function () { return role === "admin"; }, canEdit: function () { return role === "admin" || role === "gerente"; }, can: function () { return role === "admin" || role === "gerente"; }, id: async function () { return me ? me.email : "anon"; } }; },
    db: async function () { await ready; return sb && session ? { collection: col } : null; },
    downloads: async function () { return { save: async function (o) { var b = o.data instanceof Blob ? o.data : new Blob([o.data]); var a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = o.filename; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000); } }; },
    mcp: async function () { return null; },   // frota e mapa vêm do servidor/arquivo; nada depende de conector
    sample: async function () { return sample; }
  };
  window.claude = { use: function (n) { return caps[n] ? caps[n]() : Promise.resolve(null); } };

  function modal(html) {
    var box = document.createElement("div");
    box.style.cssText = "position:fixed;inset:0;background:#000c;z-index:100000;display:flex;align-items:center;justify-content:center;padding:16px";
    box.innerHTML = html; document.body.appendChild(box); return box;
  }
  var FORM = "background:#161616;color:#eee;padding:24px;border-radius:12px;display:grid;gap:10px;width:min(320px,100%);font:14px sans-serif;box-sizing:border-box";
  var INP = "padding:10px;border-radius:8px;border:1px solid #444;background:#0f0f0f;color:#eee;font-size:14px";
  var BTN = "padding:10px;border-radius:8px;border:none;background:#16a34a;color:#fff;font-weight:700;cursor:pointer";

  window.__printLogout = async function () { if (sb) await sb.auth.signOut(); location.reload(); };

  window.__printTrocarSenha = function () {
    var box = modal('<form style="' + FORM + '"><b>Trocar senha</b><input name=p type=password autocomplete=new-password minlength=8 placeholder="Nova senha (mín. 8)" required style="' + INP + '"><input name=q type=password autocomplete=new-password placeholder="Repita a nova senha" required style="' + INP + '"><span id=m style="font-size:12px"></span><button style="' + BTN + '">Salvar</button></form>');
    box.onclick = function (ev) { if (ev.target === box) box.remove(); };
    box.querySelector("form").onsubmit = async function (ev) {
      ev.preventDefault(); var f = ev.target, m = box.querySelector("#m");
      if (f.p.value !== f.q.value) { m.style.color = "#f87171"; m.textContent = "As senhas não conferem."; return; }
      var r = await sb.auth.updateUser({ password: f.p.value });
      if (r.error) { m.style.color = "#f87171"; m.textContent = r.error.message; }
      else { m.style.color = "#4ade80"; m.textContent = "Senha alterada!"; setTimeout(function () { box.remove(); }, 1200); }
    };
  };

  // Sem sessão: só a tela de login (o banco não entrega nada a quem não está logado).
  window.addEventListener("DOMContentLoaded", function () {
    if (!sb) return;
    ready.then(function () {
      if (session) return;
      var box = modal('<form style="' + FORM + '"><b>Painel Print — entrar</b><input name=e type=email autocomplete=username placeholder="E-mail" required style="' + INP + '"><input name=p type=password autocomplete=current-password placeholder="Senha" required style="' + INP + '"><span id=m style="color:#f87171;font-size:12px"></span><button style="' + BTN + '">Entrar</button></form>');
      box.style.background = "#0b0b0b";
      box.querySelector("form").onsubmit = async function (ev) {
        ev.preventDefault(); var f = ev.target;
        var r = await sb.auth.signInWithPassword({ email: f.e.value.trim(), password: f.p.value });
        if (r.error) box.querySelector("#m").textContent = "E-mail ou senha inválidos."; else location.reload();
      };
    });
  });
})();
