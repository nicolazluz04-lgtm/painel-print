import React from "react";
import { createRoot } from "react-dom/client";
import { startBackend, setUser } from "./backend.js";
import { startSascar } from "./sascar.js";
import "./mapdata.js";
import { startMapBase } from "./mapbase.js";
import Dashboard from "./app/page";
import ExportMenu from "./components/ExportMenu";

const mem: Record<string, string> = {};
try { localStorage.setItem("_t", "1"); localStorage.removeItem("_t"); } catch (e) {
  Object.defineProperty(window, "localStorage", { value: { getItem: (k: string) => (k in mem ? mem[k] : null), setItem: (k: string, v: string) => { mem[k] = String(v); }, removeItem: (k: string) => { delete mem[k]; } } });
}

(async () => {
  const cl = (window as any).claude;
  // Identidade e papel vêm do Supabase (tabela usuarios, via claude-shim.js)
  const me: any = (window as any).__printReady ? await (window as any).__printReady : null;
  const role = (me && me.role) || "operador";
  const user = { id: (me && me.email) || "anon", email: (me && me.email) || "", nome: (me && me.nome) || (me && me.email) || "", role };
  setUser(user);
  let db: any = null;
  try { db = await cl.use("db"); } catch (e) { db = null; }
  startBackend(db);
  startMapBase(db, false); // mapa já vem embutido (mapdata.js); não usa CodeWords
  startSascar(db);
  localStorage.setItem("token", "local");
  localStorage.setItem("user", JSON.stringify(user));
  class Root extends React.Component<any, any> {
    state = { err: null as any };
    static getDerivedStateFromError(err: any) { return { err }; }
    render() { return this.state.err ? <div style={{ padding: 24, color: "#e8f2ec", fontFamily: "sans-serif" }}>O painel não conseguiu abrir: {String(this.state.err && this.state.err.message)}</div> : this.props.children; }
  }
  createRoot(document.getElementById("root")!).render(<Root><Dashboard /><ExportMenu /></Root>);
})();
