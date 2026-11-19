// Adaptador: liga o painel (escrito para o runtime do claude.ai) ao Supabase.
// Login obrigatório; o papel (admin / gerente / operador) vem da tabela public.usuarios.
(function () {
  var C = window.PRINT_CONFIG || {};
  var ok = C.SUPABASE_URL && C.SUPABASE_URL.indexOf("SEU-PROJETO") < 0 && window.supabase;
  var sb = ok ? window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY) : null;
  var me = null, session = null;
  // Papéis conhecidos: a mesma lista de fonte/lib/papeis.ts (PAPEIS). Valor desconhecido vira "operador" (o menor acesso).
  var PAPEIS = ["admin", "gerente", "operador"];
  function papelValido(r) { return PAPEIS.indexOf(r) >= 0 ? r : "operador"; }
  function podeEditar(r) { return r === "admin" || r === "gerente"; }

  var ready = (async function () {
    if (!sb) return null;
    session = (await sb.auth.getSession()).data.session;
    if (!session) return null;
    var email = String(session.user.email || "").toLowerCase();
    var role = "operador", nome = "";
    try { var r = await sb.rpc("my_role"); if (!r.error && r.data) role = papelValido(r.data); } catch (e) {}
    try { var u = await sb.from("usuarios").select("nome").eq("email", email).maybeSingle(); if (u.data && u.data.nome) nome = u.data.nome; } catch (e) {}
    me = { email: email, nome: nome || email, role: role };
    return me;
  })();
  window.__printReady = ready;

  // Atualizações ao vivo: um canal só para todas as coleções pedidas juntas (na abertura são ~10),
  // em vez de um canal por coleção. Coleções pedidas depois (ex.: posições da Sascar) ganham um canal próprio.
  var ouvintes = {}, pendentes = [];
  function aoVivo(name, h) {
    (ouvintes[name] = ouvintes[name] || []).push(h);
    if (ouvintes[name].length > 1) return;
    pendentes.push(name);
    if (pendentes.length === 1) setTimeout(abrirCanal, 0);
  }
  function abrirCanal() {
    var nomes = pendentes.splice(0);
    sb.channel("kv-" + Math.random().toString(36).slice(2))
      .on("postgres_changes", { event: "*", schema: "public", table: "kv", filter: "collection=in.(" + nomes.join(",") + ")" }, function (p) {
        var c = (p.new && p.new.collection) || (p.old && p.old.collection);
        if (nomes.indexOf(c) < 0) return;
        (ouvintes[c] || []).forEach(function (h) { h(p); });
      }).subscribe();
  }
  function col(name) {
    return {
      onSnapshot: function (cb, err) {
        var rows = {};
        function emit() { cb({ docs: Object.keys(rows).map(function (id) { return { id: id, data: function () { return rows[id]; } }; }) }); }
        sb.from("kv").select("id,data").eq("collection", name).then(function (r) {
          if (r.error) { err && err(r.error); return; }
          (r.data || []).forEach(function (x) { rows[x.id] = x.data; }); emit();
        });
        aoVivo(name, function (p) {
          if (p.eventType === "DELETE") delete rows[p.old.id]; else rows[p.new.id] = p.new.data; emit();
        });
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
    user: async function () { await ready; var role = papelValido(me && me.role); return { isOwner: function () { return role === "admin"; }, canEdit: function () { return podeEditar(role); }, can: function () { return podeEditar(role); }, id: async function () { return me ? me.email : "anon"; } }; },
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

  // ── Tela de login: Control Tower SOS (Print) ──
  // Fundo: foto em img/fundo-login.jpg, um pouco transparente (véu escuro por cima para o cartão continuar legível).
  // Enquanto a foto não existir ou não carregar, fica só o fundo verde-escuro.
  var FOTO_FUNDO = "img/fundo-login.jpg";
  var FUNDO_BASE = "radial-gradient(ellipse at 20% 0%,rgba(22,163,74,.28),transparent 55%),radial-gradient(ellipse at 100% 100%,rgba(22,163,74,.16),transparent 50%),#070b09";
  var FUNDO_LOGIN = "background:" + FUNDO_BASE;
  function aplicarFotoFundo(box) {
    var img = new Image();
    img.onload = function () {
      box.style.background = "linear-gradient(180deg,rgba(4,10,7,.42) 0%,rgba(4,10,7,.55) 55%,rgba(4,10,7,.78) 100%),url('" + FOTO_FUNDO + "') 62% center/cover no-repeat,#070b09";
    };
    img.src = FOTO_FUNDO;
  }
  function TELA_LOGIN() {
    var logo = window.__PRINT_LOGO || "";
    var rot = "display:grid;gap:6px;font-size:12px;font-weight:600;color:#a7b3ad";
    var inp = "padding:12px 14px;border-radius:10px;border:1px solid #2b3a33;background:#0c1310;color:#eef5f1;font-size:15px;outline:none;min-height:44px;box-sizing:border-box;width:100%";
    return '' +
      '<style>@media (min-width:900px){.ct-fundo{justify-content:flex-start!important;padding-left:7vw!important}}.ct-login input:focus{border-color:#22c55e!important;box-shadow:0 0 0 3px rgba(34,197,94,.25)}.ct-login button:disabled{opacity:.7;cursor:wait}</style>' +
      '<form class="ct-login" style="width:min(400px,100%);box-sizing:border-box;display:grid;gap:16px;padding:32px 28px;border-radius:18px;' +
        'background:rgba(14,20,17,.86);border:1px solid rgba(255,255,255,.08);box-shadow:0 24px 60px rgba(0,0,0,.55);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);font:14px system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#eef5f1">' +
        '<div style="display:grid;justify-items:center;gap:10px;text-align:center;margin-bottom:4px">' +
          (logo ? '<div style="width:64px;height:64px;border-radius:16px;display:flex;align-items:center;justify-content:center;background:linear-gradient(145deg,#34e053 0%,#2dc62d 45%,#15803d 100%);' +
            'box-shadow:inset 0 2px 3px rgba(255,255,255,.6),inset 0 -3px 5px rgba(0,0,0,.35),0 6px 18px rgba(45,198,45,.45);border:1px solid rgba(255,255,255,.35)">' +
            '<img src="' + logo + '" alt="Print" style="width:46px;height:auto"></div>' : '') +
          '<div style="font-size:24px;font-weight:800;letter-spacing:.01em">Control Tower SOS</div>' +
          '<div style="font-size:13px;color:#8fa39a">Central de socorro mecânico da Print</div>' +
        '</div>' +
        '<label style="' + rot + '">E-mail<input name=e type=email autocomplete=username placeholder="seu@email.com" required style="' + inp + '"></label>' +
        '<label style="' + rot + '">Senha<input name=p type=password autocomplete=current-password placeholder="Sua senha" required style="' + inp + '"></label>' +
        '<label style="display:flex;align-items:center;gap:8px;font-size:13px;color:#a7b3ad;cursor:pointer;min-height:32px"><input id=ver type=checkbox style="width:18px;height:18px;accent-color:#16a34a">Mostrar senha</label>' +
        '<span id=m role=alert style="color:#f87171;font-size:13px;min-height:1em"></span>' +
        '<button style="padding:13px;border-radius:10px;border:none;background:#16a34a;color:#fff;font-weight:800;font-size:15px;cursor:pointer;min-height:48px;box-shadow:0 8px 20px rgba(22,163,74,.35)">Entrar</button>' +
        '<div style="text-align:center;font-size:12px;color:#7d9188">Esqueceu a senha? Fale com um administrador.</div>' +
      '</form>' +
      '<div style="position:absolute;left:0;right:0;bottom:20px;text-align:center;font:600 12px system-ui,sans-serif;letter-spacing:.32em;text-transform:uppercase;color:rgba(220,235,227,.7)">Entregando soluções</div>';
  }

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
      document.title = "Control Tower SOS · Entrar";
      var box = modal(TELA_LOGIN());
      box.style.cssText += ";" + FUNDO_LOGIN;
      box.classList.add("ct-fundo");
      aplicarFotoFundo(box);
      var f = box.querySelector("form"), msg = box.querySelector("#m"), btn = f.querySelector("button");
      box.querySelector("#ver").onchange = function (ev) { f.p.type = ev.target.checked ? "text" : "password"; };
      f.e.focus();
      f.onsubmit = async function (ev) {
        ev.preventDefault();
        btn.disabled = true; btn.textContent = "Entrando…"; msg.textContent = "";
        var r = await sb.auth.signInWithPassword({ email: f.e.value.trim(), password: f.p.value });
        if (r.error) { msg.textContent = "E-mail ou senha inválidos."; btn.disabled = false; btn.textContent = "Entrar"; f.p.focus(); }
        else location.reload();
      };
    });
  });
})();
