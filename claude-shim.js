// Adaptador: faz o painel (escrito para o runtime do claude.ai) funcionar com Supabase + Netlify.
(function () {
  var C = window.PRINT_CONFIG || {};
  var ok = C.SUPABASE_URL && C.SUPABASE_URL.indexOf("SEU-PROJETO") < 0 && window.supabase;
  var sb = ok ? window.supabase.createClient(C.SUPABASE_URL, C.SUPABASE_ANON_KEY) : null;
  var isAdmin = false, session = null;
  var ready = (async function () {
    if (!sb) return;
    session = (await sb.auth.getSession()).data.session;
    if (session) {
      // Quem decide é o banco (tabela admins via is_admin()); o RLS garante a escrita de qualquer forma.
      var r = await sb.rpc("is_admin");
      isAdmin = !r.error && r.data === true;
    }
  })();

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

  var sample = null;
  if (C.AI_ENDPOINT) {
    sample = async function (prompt) {
      var h = { "Content-Type": "application/json" }; var s = sb && (await sb.auth.getSession()).data.session; if (s) h.Authorization = "Bearer " + s.access_token;
      var r = await fetch(C.AI_ENDPOINT, { method: "POST", headers: h, body: JSON.stringify({ prompt: typeof prompt === "string" ? prompt : JSON.stringify(prompt) }) });
      if (!r.ok) throw { code: "error", message: "IA " + r.status };
      var j = await r.json(); return { text: j.text, truncated: false };
    };
    sample.json = async function (p) { var t = (await sample(p)).text; var m = t.match(/\{[\s\S]*\}/); return JSON.parse(m ? m[0] : t); };
  }

  var caps = {
    user: async function () { await ready; return { isOwner: function () { return isAdmin; }, canEdit: function () { return isAdmin; }, can: function () { return isAdmin; }, id: async function () { return "u"; } }; },
    db: async function () { await ready; return sb && session ? { collection: col } : null; },
    downloads: async function () { return { save: async function (o) { var b = o.data instanceof Blob ? o.data : new Blob([o.data]); var a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = o.filename; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1000); } }; },
    mcp: async function () { return null; },   // a atualização Sascar roda na Edge Function sascar-sync
    sample: async function () { return sample; }
  };
  window.claude = { use: function (n) { return caps[n] ? caps[n]() : Promise.resolve(null); } };

  // Login obrigatório: sem sessão, nada é carregado (o RLS só libera leitura para autenticados).
  function loginBox() {
    var box = document.createElement("div");
    box.style.cssText = "position:fixed;inset:0;background:#0b0b0b;z-index:100000;display:flex;align-items:center;justify-content:center";
    box.innerHTML = '<form style="background:#161616;color:#eee;padding:24px;border-radius:12px;display:grid;gap:10px;min-width:280px;font:14px sans-serif"><b>Painel Print — entrar</b><input name=e type=email autocomplete=username placeholder="E-mail" required style="padding:8px"><input name=p type=password autocomplete=current-password placeholder="Senha" required style="padding:8px"><span id=m style="color:#f87171;font-size:12px"></span><button style="padding:8px;cursor:pointer">Entrar</button></form>';
    document.body.appendChild(box);
    box.querySelector("form").onsubmit = async function (ev) {
      ev.preventDefault(); var f = ev.target;
      var r = await sb.auth.signInWithPassword({ email: f.e.value, password: f.p.value });
      if (r.error) box.querySelector("#m").textContent = "E-mail ou senha inválidos."; else location.reload();
    };
  }
  window.addEventListener("DOMContentLoaded", function () {
    if (!sb) return;
    ready.then(function () {
      if (!session) { loginBox(); return; }
      var b = document.createElement("button");
      b.textContent = "Sair" + (isAdmin ? " (admin)" : "");
      b.style.cssText = "position:fixed;left:12px;bottom:12px;z-index:99999;padding:8px 12px;border-radius:8px;border:1px solid #444;background:#111;color:#eee;font:12px sans-serif;cursor:pointer;opacity:.85";
      b.onclick = async function () { await sb.auth.signOut(); location.reload(); };
      document.body.appendChild(b);
      var t = document.createElement("button");
      t.textContent = "Trocar senha";
      t.style.cssText = b.style.cssText + ";left:" + (b.offsetWidth + 20) + "px";
      t.onclick = function () {
        var box = document.createElement("div");
        box.style.cssText = "position:fixed;inset:0;background:#000a;z-index:100000;display:flex;align-items:center;justify-content:center";
        box.innerHTML = '<form style="background:#161616;color:#eee;padding:24px;border-radius:12px;display:grid;gap:10px;min-width:280px;font:14px sans-serif"><b>Trocar senha</b><input name=p type=password autocomplete=new-password minlength=8 placeholder="Nova senha (mín. 8)" required style="padding:8px"><input name=q type=password autocomplete=new-password placeholder="Repita a nova senha" required style="padding:8px"><span id=m style="font-size:12px"></span><button style="padding:8px;cursor:pointer">Salvar</button></form>';
        document.body.appendChild(box);
        box.onclick = function (ev) { if (ev.target === box) box.remove(); };
        box.querySelector("form").onsubmit = async function (ev) {
          ev.preventDefault(); var f = ev.target, m = box.querySelector("#m");
          if (f.p.value !== f.q.value) { m.style.color = "#f87171"; m.textContent = "As senhas não conferem."; return; }
          var r = await sb.auth.updateUser({ password: f.p.value });
          if (r.error) { m.style.color = "#f87171"; m.textContent = r.error.message; }
          else { m.style.color = "#4ade80"; m.textContent = "Senha alterada!"; setTimeout(function () { box.remove(); }, 1200); }
        };
      };
      document.body.appendChild(t);
    });
  });
})();
