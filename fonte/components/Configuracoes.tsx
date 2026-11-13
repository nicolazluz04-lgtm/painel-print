"use client";
import { useEffect, useState } from "react";

function tkn() { try { return localStorage.getItem("token") || ""; } catch { return ""; } }

async function api(url: string, init?: RequestInit) {
  const sep = url.includes("?") ? "&" : "?";
  try {
    const r = await fetch(`/api${url}${sep}token=${encodeURIComponent(tkn())}`, { headers: { "Content-Type": "application/json" }, ...init });
    const txt = await r.text();
    try { return JSON.parse(txt); } catch { return {}; }
  } catch { return {}; }
}

const S = ({ children, title }: any) => (
  <div className="rounded-xl p-4 mb-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}>
    <div className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>{title}</div>
    {children}
  </div>
);

const Field = ({ label, children }: any) => (
  <label className="block">
    <span className="text-[9px] uppercase tracking-wider font-bold" style={{ color: "var(--text-muted)" }}>{label}</span>
    <div className="mt-1">{children}</div>
  </label>
);

const IS: any = { background: "var(--bg-alt)", border: "1px solid var(--border)", color: "var(--text)" };

export default function Configuracoes() {
  const [cfg, setCfg] = useState<any>({});
  const [bases, setBases] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [msg, setMsg] = useState("");
  const [novaBase, setNovaBase] = useState<any>({ nome: "", endereco: "", lat: "", lng: "" });

  async function carregar() {
    const c = await api("/configuracoes"); setCfg(c?.data || {});
    const b = await api("/bases"); setBases(b?.data || []);
    const u = await api("/users"); setUsers(u?.data || []);
  }
  useEffect(() => { carregar(); }, []);

  function set(k: string, v: any) { setCfg((p: any) => ({ ...p, [k]: v })); }

  async function salvar() {
    const r = await api("/configuracoes", { method: "PUT", body: JSON.stringify(cfg) });
    setMsg(r?.success ? "Configurações salvas" : "Não foi possível salvar");
    setTimeout(() => setMsg(""), 3000);
  }

  async function salvarBase(b: any) {
    await api(`/bases/${b.id}`, { method: "PUT", body: JSON.stringify({ nome: b.nome, lat: Number(b.lat), lng: Number(b.lng), endereco: b.endereco || "" }) });
    carregar();
  }
  async function excluirBase(id: string) {
    if (!confirm("Remover esta base?")) return;
    await api(`/bases/${id}`, { method: "DELETE" }); carregar();
  }
  async function criarBase() {
    if (!novaBase.nome || !novaBase.lat || !novaBase.lng) { alert("Informe nome, latitude e longitude"); return; }
    await api("/bases", { method: "POST", body: JSON.stringify({ ...novaBase, lat: Number(novaBase.lat), lng: Number(novaBase.lng) }) });
    setNovaBase({ nome: "", endereco: "", lat: "", lng: "" }); carregar();
  }

  async function mudarPerfil(u: any, role: string) {
    await api(`/users/${u.id}`, { method: "PUT", body: JSON.stringify({ nome: u.nome, role, email: u.email }) }); carregar();
  }
  async function resetarSenha(u: any) {
    const s1 = prompt(`Nova senha para ${u.email} (mínimo 8 caracteres):`); if (!s1) return;
    if (s1.length < 8) { alert("A senha precisa ter pelo menos 8 caracteres."); return; }
    const r = await api(`/usuarios/${encodeURIComponent(u.id)}/senha`, { method: "POST", body: JSON.stringify({ senha: s1 }) });
    alert(r && r.success ? "Senha definida. Passe a senha para o usuário por um canal seguro." : "Não foi possível definir a senha: " + ((r && r.detail) || "erro"));
    carregar();
  }
  async function excluirUser(u: any) {
    if (u.role === "admin") { alert("Usuário administrador não pode ser excluído"); return; }
    if (!confirm(`Excluir ${u.email}?`)) return;
    await api(`/users/${u.id}`, { method: "DELETE" }); carregar();
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-bold" style={{ color: "var(--text)" }}>Configurações</h2>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Visível apenas para administradores</div>
        </div>
        <button onClick={salvar} className="px-5 py-2 rounded-lg text-xs font-bold cursor-pointer" style={{ background: "var(--accent-green)", color: "#fff" }}>Salvar configurações</button>
      </div>
      {msg && <div className="mb-3 px-3 py-2 rounded-lg text-[11px] font-bold" style={{ background: "rgba(37,214,71,.12)", color: "#146E1F" }}>{msg}</div>}

      <S title="Socorro">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Field label="Raio de busca (km)"><input type="number" value={cfg.raio_km ?? 20} onChange={e => set("raio_km", Number(e.target.value))} className="w-full px-3 py-2 rounded-lg text-sm" style={IS} /></Field>
          <Field label="Escalonar supervisor (h)"><input type="number" value={cfg.escalonamento_supervisor_h ?? 2} onChange={e => set("escalonamento_supervisor_h", Number(e.target.value))} className="w-full px-3 py-2 rounded-lg text-sm" style={IS} /></Field>
          <Field label="Escalonar gerência (h)"><input type="number" value={cfg.escalonamento_gerencia_h ?? 4} onChange={e => set("escalonamento_gerencia_h", Number(e.target.value))} className="w-full px-3 py-2 rounded-lg text-sm" style={IS} /></Field>
        </div>
      </S>

      <S title="Resumo diário por e-mail">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Field label="Horário"><input value={cfg.resumo_horario ?? "07:30"} onChange={e => set("resumo_horario", e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm font-mono" style={IS} /></Field>
          <Field label="Ativo"><button onClick={() => set("resumo_ativo", !cfg.resumo_ativo)} className="px-4 py-2 rounded-lg text-xs font-bold cursor-pointer w-full" style={{ background: cfg.resumo_ativo ? "var(--accent-green)" : "var(--bg-alt)", color: cfg.resumo_ativo ? "#fff" : "var(--text-muted)", border: "1px solid var(--border)" }}>{cfg.resumo_ativo ? "LIGADO" : "DESLIGADO"}</button></Field>
          <Field label="Intervalo Sascar (min)"><input type="number" value={cfg.sascar_intervalo_min ?? 5} onChange={e => set("sascar_intervalo_min", Number(e.target.value))} className="w-full px-3 py-2 rounded-lg text-sm" style={IS} /></Field>
          <Field label="Exibir bases"><button onClick={() => set("mostrar_bases", !cfg.mostrar_bases)} className="px-4 py-2 rounded-lg text-xs font-bold cursor-pointer w-full" style={{ background: cfg.mostrar_bases ? "var(--accent-green)" : "var(--bg-alt)", color: cfg.mostrar_bases ? "#fff" : "var(--text-muted)", border: "1px solid var(--border)" }}>{cfg.mostrar_bases ? "SIM" : "NÃO"}</button></Field>
        </div>
        <div className="mt-3"><Field label="E-mails (separados por vírgula)"><input value={cfg.resumo_emails ?? ""} onChange={e => set("resumo_emails", e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={IS} /></Field></div>
      </S>

      <S title="Bases">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-3">
          <input placeholder="Nome" value={novaBase.nome} onChange={e => setNovaBase({ ...novaBase, nome: e.target.value })} className="px-3 py-2 rounded-lg text-xs" style={IS} />
          <input placeholder="Endereço" value={novaBase.endereco} onChange={e => setNovaBase({ ...novaBase, endereco: e.target.value })} className="px-3 py-2 rounded-lg text-xs" style={IS} />
          <input placeholder="Latitude" value={novaBase.lat} onChange={e => setNovaBase({ ...novaBase, lat: e.target.value })} className="px-3 py-2 rounded-lg text-xs" style={IS} />
          <input placeholder="Longitude" value={novaBase.lng} onChange={e => setNovaBase({ ...novaBase, lng: e.target.value })} className="px-3 py-2 rounded-lg text-xs" style={IS} />
          <button onClick={criarBase} className="rounded-lg text-xs font-bold cursor-pointer" style={{ background: "var(--accent-green)", color: "#fff" }}>Adicionar</button>
        </div>
        <div className="max-h-72 overflow-y-auto">
          {bases.map((b: any) => (
            <div key={b.id} className="flex items-center gap-2 py-1.5" style={{ borderBottom: "1px dashed var(--border)" }}>
              <input value={b.nome || ""} onChange={e => setBases((p: any[]) => p.map((x: any) => x.id === b.id ? { ...x, nome: e.target.value } : x))} className="w-32 px-2 py-1 rounded text-xs" style={IS} />
              <input value={b.endereco || ""} onChange={e => setBases((p: any[]) => p.map((x: any) => x.id === b.id ? { ...x, endereco: e.target.value } : x))} className="flex-1 px-2 py-1 rounded text-xs" style={IS} />
              <input value={b.lat ?? ""} onChange={e => setBases((p: any[]) => p.map((x: any) => x.id === b.id ? { ...x, lat: e.target.value } : x))} className="w-24 px-2 py-1 rounded text-xs font-mono" style={IS} />
              <input value={b.lng ?? ""} onChange={e => setBases((p: any[]) => p.map((x: any) => x.id === b.id ? { ...x, lng: e.target.value } : x))} className="w-24 px-2 py-1 rounded text-xs font-mono" style={IS} />
              <button onClick={() => salvarBase(b)} className="px-2 py-1 rounded text-[10px] font-bold cursor-pointer" style={{ color: "var(--accent-green)", border: "1px solid var(--border)" }}>Salvar</button>
              <button onClick={() => excluirBase(b.id)} className="px-2 py-1 rounded text-[10px] font-bold cursor-pointer" style={{ color: "#C62828", border: "1px solid var(--border)" }}>Excluir</button>
            </div>
          ))}
        </div>
      </S>

      <S title="Usuários">
        <div className="max-h-80 overflow-y-auto">
          {users.map((u: any) => (
            <div key={u.id} className="flex items-center gap-2 py-1.5" style={{ borderBottom: "1px dashed var(--border)" }}>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate" style={{ color: "var(--text)" }}>{u.nome || u.email}</div>
                <div className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>{u.email}</div>
              </div>
              <select value={u.role || "operador"} onChange={e => mudarPerfil(u, e.target.value)} disabled={u.role === "admin"} className="px-2 py-1 rounded text-[10px] font-bold" style={IS}>
                <option value="operador">Operador</option>
                <option value="consultor">Consultor</option>
                <option value="gerente">Gerente</option>
                <option value="admin">Admin</option>
              </select>
              <button onClick={() => resetarSenha(u)} className="px-2 py-1 rounded text-[10px] font-bold cursor-pointer" style={{ color: "var(--text-muted)", border: "1px solid var(--border)" }}>Senha</button>
              <button onClick={() => excluirUser(u)} disabled={u.role === "admin"} className="px-2 py-1 rounded text-[10px] font-bold cursor-pointer" style={{ color: u.role === "admin" ? "var(--text-soft)" : "#C62828", border: "1px solid var(--border)" }}>Excluir</button>
            </div>
          ))}
        </div>
      </S>
    </div>
  );
}

