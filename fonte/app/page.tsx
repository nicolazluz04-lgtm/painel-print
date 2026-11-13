import {IMGS} from "../images";
"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useTheme } from "next-themes";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from "recharts";
import dynamic from "next/dynamic";
import { Plus, Upload, Moon, Sun, Monitor, Search, Trash2, Phone, FileDown, FileText, BarChart3, TrendingUp, Users, Clock, X, LogOut, LogIn, ShieldCheck, UserPlus, Pencil, CheckCircle2, ScrollText, AlertTriangle, Eye, Ban, LayoutDashboard, Timer, GitBranch, Activity, MapPin, ChevronRight, ChevronLeft, BellRing, Package } from "lucide-react";

const MapaBrasil = dynamic(() => import("@/components/MapaBrasil"), { ssr: false });
const MapaAtendimento = dynamic(() => import("@/components/MapaAtendimento"), { ssr: false });
const MapaFrota = dynamic(() => import("@/components/MapaFrota"), { ssr: false });
const SlaChart = dynamic(() => import("@/components/SlaChart"), { ssr: false });
const PecasKanban = dynamic(() => import("@/components/PecasKanban"), { ssr: false });
import { inferTipoVeiculo, TIPOS_VEICULO } from "@/components/VehicleArt";
import ReportModal from "@/components/ReportModal";
import DefeitoPicker from "@/components/DefeitoPicker";
import Configuracoes from "@/components/Configuracoes";
import Cancelamentos from "@/components/Cancelamentos";

const STATUS_ABERTOS = new Set(["Aguardando","Em atendimento","Prestador localizado","Prestador a caminho","Prestador no local","Aguardando Orçamento","Serviço em execução"]);

const ETAPAS: {status:string;label:string;desc:string;checklist:string[];next:string}[] = [
  {status:"Aguardando",label:"1 · Contatar Motorista",desc:"Primeiro contato com o motorista",checklist:["Confirmar motorista","Confirmar placa","Confirmar localização","Entender o problema","Confirmar veículo em local seguro"],next:"Prestador localizado"},
  {status:"Prestador localizado",label:"2 · Localizar Prestador",desc:"Acionar o prestador mais próximo",checklist:["Selecionar prestador disponível","Negociar / aprovar o atendimento"],next:"Prestador a caminho"},
  {status:"Prestador a caminho",label:"3 · Prestador a Caminho",desc:"Prestador em deslocamento",checklist:["Acompanhar deslocamento do prestador"],next:"Prestador no local"},
  {status:"Prestador no local",label:"4 · Prestador no Local",desc:"Prestador chegou ao veículo",checklist:["Confirmar chegada do prestador","Verificar veículo e diagnóstico"],next:"Aguardando Orçamento"},
  {status:"Aguardando Orçamento",label:"4.5 · Aguardando Orçamento",desc:"Aguardando aprovação do orçamento pelo cliente",checklist:["Enviar orçamento ao cliente","Aguardar aprovação do valor","Confirmar valor aprovado"],next:"Serviço em execução"},
  {status:"Serviço em execução",label:"5 · Serviço em Execução",desc:"Socorro em andamento",checklist:["Acompanhar andamento do serviço"],next:"Veículo liberado"},
];

function getToken(): string {
  return typeof window !== "undefined" ? (localStorage.getItem("token") || "") : "";
}
function getAuthHeaders(): Record<string, string> {
  return { "Content-Type": "application/json" };
}
function withToken(url: string): string {
  const t = getToken();
  const sep = url.includes("?") ? "&" : "?";
  return t ? `${url}${sep}token=${encodeURIComponent(t)}` : url;
}

interface Prestador { id: string; nome: string; cnpj: string; cidade: string; estado: string; tipo_servico: string; telefone: string; socorro_24h: boolean; fatura: boolean; status?: string; lat: number | null; lng: number | null; }
interface Acionamento { id: string; prestador_id: string; prestador_nome: string; tipo_servico: string; local: string; data: string; observacoes: string; }
interface OrdemServico { id: string; os: string; veiculo: string; placa?: string; modelo?: string; marca?: string; servico_realizado: string; valor: number; tipo_servico?: string; status?: string; operador?: string; operacao?: string; segmento?: string; motorista?: string; telefone?: string; rodovia?: string; km?: string; prioridade?: string; localizacao?: string; descricao?: string; resultado?: string; criado_por?: string; criado_login?: string; criado_perfil?: string; prestador_id?: string; prestador_nome?: string; data: string; observacoes: string; abertura?: string; fechamento?: string; sla_minutos?: number; minutos_aberto?: number; historico?: {hora:string;etapa:string;quem:string}[]; cancelado?: boolean; motivo_cancelamento?: string; carga?: string; forma_pagamento?: string; tipo_veiculo?: string; atualizado_por?: string; atualizado_em?: string; ultima_atualizacao?: string; }
interface Stats { total_prestadores: number; disponiveis_24h: number; com_faturamento: number; total_acionamentos: number; total_ordens: number; valor_total: number; veiculos_unicos: number; servicos_total: number; tipo_prestadores: Record<string, number>; acionamento_por_tipo: Record<string, number>; top_prestadores: { id: string; nome: string; count: number }[]; operacao_count: Record<string, number>; taxa_repetibilidade: number; custo_por_marca: Record<string, { count: number; custo_medio: number }>; sla_medio: number; ordens_fechadas: number; socorros_hoje: number; em_aberto: number; atrasados: number; liberados: number; rebocados: number; rpm: number; indicadores_segmento?: Record<string, SegIndicadores>; pagamento?: Record<string, { count: number; valor: number }>; paradas?: { os: string; placa: string; status: string; minutos: number }[]; resumo?: any; }
interface SegIndicadores { total: number; fechadas: number; dentro_prazo: number; atrasadas: number; em_aberto: number; rpm: number; mais_acionadas: { nome: string; count: number; custo: number }[]; maior_custo: { nome: string; valor: number }; }
interface Usuario { id: string; email: string; nome: string; role: string; status?: string; }
interface LogEntry { id: string; evento: string; os: string; detalhe: string; quem: string; created_at: string; }
interface Ocorrencia { id: string; placa: string; tipo: string; descricao: string; de_whatsapp: string; nome: string; status: string; criado_em: string; aceita_por?: string; aceita_em?: string; }

const API = "/api";
let setGlobalLoggedIn: (v: boolean) => void = () => {};
async function fetcher(url: string, opts?: RequestInit) {
  const headers = getAuthHeaders();
  try {
    const res = await fetch(`${API}${withToken(url)}`, { headers, ...opts });
    if (res.status === 401) { localStorage.removeItem("token"); localStorage.removeItem("user"); void 0; return {}; }
    const txt = await res.text();
    if (!txt) return {};
    try { return JSON.parse(txt); } catch { return {}; }
  } catch { return {}; }
}

function fmtBRT(iso?: string | null, opts?: Intl.DateTimeFormatOptions): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", ...opts });
  } catch { return "—"; }
}

const TIPO_LABELS: Record<string, string> = { mecanico: "Mecânico", eletrico: "Elétrico", eletronica: "Eletrônica", eletrica_mecanica: "Elétrica/Mecânica", borracharia: "Borracharia", guincho: "Guincho" };
const TIPO_BADGE: Record<string, string> = {
  mecanico: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  eletrico: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  eletronica: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
  eletrica_mecanica: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  borracharia: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  guincho: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
};
const ROLE_LABEL: Record<string, string> = { admin: "Admin", gerente: "Gerente", operador: "Operador" };
const ROLE_BADGE: Record<string, string> = {
  admin: "bg-print-green/15 text-print-green",
  gerente: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  operador: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};
const STAT_STYLE: Record<string, { bg: string; fg: string }> = {
  "print-green": { bg: "bg-emerald-50 dark:bg-emerald-900/20", fg: "text-emerald-600" },
  "print-yellow": { bg: "bg-sky-50 dark:bg-sky-900/20", fg: "text-sky-700" },
  "blue-500": { bg: "bg-slate-100 dark:bg-slate-800", fg: "text-slate-600" },
  "purple-500": { bg: "bg-teal-50 dark:bg-teal-900/20", fg: "text-teal-700" },
};
const LOGO_PRINT = IMGS.logo;
const CHART_COLORS = ["#25D647", "#F5B301", "#1E88E5", "#E53935", "#8E6CF0", "#00A6A6"];
const CORP_COLORS = ["#25D647", "#F5B301", "#1E88E5", "#E53935", "#8E6CF0", "#00A6A6", "#146E1F", "#D6D6D6"];
const FILIAIS = ["Belém","Brasília","Campo Grande","Curitiba","Distrito Federal","Diversos","Feira de Santana","Manaus","Porto Velho","Recife","Salvador","São Paulo","Serra ES","Uberaba","Vitória da Conquista"];
const FILIAL_SIGLA: Record<string, string> = {"Belém":"BEL","Brasília":"BSB","Campo Grande":"CGR","Curitiba":"CWB","Distrito Federal":"DF","Diversos":"DIV","Feira de Santana":"FSA","Manaus":"MAO","Porto Velho":"PVH","Salvador":"SSA","São Paulo":"SP","Serra ES":"SES","Uberaba":"UBA","Vitória da Conquista":"VDC"};
const MARCAS = ["Volkswagen","Mercedes","Volvo","Iveco","Scania"];


// ── Sidebar ─────────────────────────────────────────────────────────────────
type NavTab = "dashboard"|"atendimento"|"acompanhamento"|"prestadores"|"bases"|"pecas"|"ocorrencias"|"acionamentos"|"ordens"|"usuarios"|"log"|"config"|"cancelamentos";
const NAV_ITEMS: {id:NavTab;label:string;icon:React.ReactNode;alert?:boolean;yellow?:boolean}[] = [
  {id:"dashboard",label:"Dashboard",icon:<LayoutDashboard size={16}/>},
  {id:"atendimento",label:"Atendimento",icon:<Timer size={16}/>,alert:true},
  {id:"ordens",label:"Ordens de Serviço",icon:<FileText size={16}/>},
  {id:"prestadores",label:"Prestadores",icon:<Users size={16}/>},
  {id:"bases",label:"Bases",icon:<MapPin size={16}/>},
  {id:"pecas",label:"Controle de Peças",icon:<Package size={16}/>},
  {id:"log",label:"Log",icon:<ScrollText size={16}/>},
  {id:"usuarios",label:"Usuários",icon:<ShieldCheck size={16}/>},
  {id:"cancelamentos",label:"Cancelamentos",icon:<Ban size={16}/>},
  {id:"config",label:"Configurações",icon:<ShieldCheck size={16}/>},
];
const BRL=(v:any,d:number=2)=>Number(v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL",minimumFractionDigits:d,maximumFractionDigits:d});
const fmtData=(v:any)=>{const m=String(v||"").match(/^(\d{4})-(\d{2})-(\d{2})/);return m?`${m[3]}/${m[2]}/${m[1]}`:(v||"—");};
const TIPO_LBL:Record<string,string>={mecanico:"Mecânico",eletrico:"Elétrico",eletronica:"Eletrônica",eletrica_mecanica:"Elétrica/Mecânica",borracharia:"Borracharia",guincho:"Guincho",pneus:"Pneus",freio:"Freio",combustivel:"Combustível",outros:"Outros"};
const ROLE_TABS: Record<string, NavTab[]> = {
  admin: ["dashboard","atendimento","acompanhamento","prestadores","bases","pecas","ordens","log","usuarios","config","cancelamentos"],
  gerente: ["dashboard","atendimento","acompanhamento","prestadores","pecas","ordens","log"],
  operador: ["dashboard","atendimento","acompanhamento","ordens"],
};
function Sidebar({tab,setTab,user,logout,ordensAbertos,ocorrPend,theme,setTheme,collapsed,onToggle}:{tab:NavTab;setTab:(t:NavTab)=>void;user:any;logout:()=>void;ordensAbertos:number;ocorrPend:number;theme:string;setTheme:(t:string)=>void;collapsed:boolean;onToggle:()=>void;}){const navItems=NAV_ITEMS.filter(i=>(ROLE_TABS[user?.role]||ROLE_TABS.operador).includes(i.id));const w=collapsed?"76px":"var(--sidebar-w)";return(<aside className="sidebar fixed left-0 top-0 bottom-0 z-50 flex flex-col" style={{width:w,overflow:"hidden",transition:"width 0.25s ease"}}><div className="flex items-center justify-between px-3 py-3 flex-shrink-0" style={{borderBottom:"1px solid var(--border-bright)",minHeight:"60px"}}>{collapsed?(<><div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto" style={{background:"linear-gradient(145deg,#34e053 0%,#2dc62d 45%,#15803d 100%)",boxShadow:"inset 0 2px 3px rgba(255,255,255,0.6), inset 0 -3px 5px rgba(0,0,0,0.35), 0 3px 8px rgba(45,198,45,0.5), 0 8px 16px rgba(0,0,0,0.25)",border:"1px solid rgba(255,255,255,0.35)"}}><img src={LOGO_PRINT} alt="Print" style={{width:26,height:"auto"}}/></div></>):(<><div className="flex items-center gap-2.5 min-w-0 flex-1"><div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{background:"linear-gradient(145deg,#34e053 0%,#2dc62d 45%,#15803d 100%)",boxShadow:"inset 0 2px 3px rgba(255,255,255,0.6), inset 0 -3px 5px rgba(0,0,0,0.35), 0 3px 8px rgba(45,198,45,0.5), 0 8px 16px rgba(0,0,0,0.25)",border:"1px solid rgba(255,255,255,0.35)"}}><img src={LOGO_PRINT} alt="Print" style={{width:26,height:"auto"}}/></div></div><button onClick={onToggle} className="p-1.5 rounded-lg hover:bg-surface-hover flex-shrink-0 cursor-pointer" style={{color:"var(--text-muted)"}} title="Recolher menu" aria-label="Recolher menu"><ChevronLeft size={18}/></button></>)}</div>{user&&!collapsed&&<div className="px-4 py-3" style={{borderBottom:"1px solid var(--border)"}}><div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold uppercase flex-shrink-0" style={{background:"#ffffff",color:"#0C4817",border:"2px solid rgba(255,255,255,0.55)"}}>{user.nome?.charAt(0)||user.email?.charAt(0)||"U"}</div><div className="min-w-0"><div className="text-sm font-bold truncate" style={{color:"#ffffff"}}>{user.nome||user.email}</div><div className="text-[10px]" style={{color:"rgba(255,255,255,0.75)"}}>{user.role==="admin"?"Admin":user.role==="gerente"?"Gerente":"Operador"}</div></div></div></div>}{user&&collapsed&&<div className="py-3 flex justify-center" style={{borderBottom:"1px solid var(--border)"}}><div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold uppercase" style={{background:"rgba(34,197,94,0.15)",color:"var(--accent-green)",border:"1px solid rgba(34,197,94,0.3)"}}>{user.nome?.charAt(0)||user.email?.charAt(0)||"U"}</div></div>}<nav className="flex-1 overflow-y-auto py-3 px-2">{navItems.map(item=>{const isActive=tab===item.id;const badge=item.alert?ordensAbertos:item.yellow?ocorrPend:0;return(<button key={item.id} onClick={()=>setTab(item.id)} title={collapsed?item.label:undefined} className={`w-full flex items-center ${collapsed?"justify-center":"gap-2.5"} px-3 py-2 rounded-lg mb-0.5 text-left transition-all cursor-pointer relative`} style={{background:isActive?"var(--accent-green-glow)":"transparent",color:isActive?"var(--accent-green)":"var(--text-muted)",border:isActive?"1px solid rgba(34,197,94,0.25)":"1px solid transparent"}}><span style={{opacity:isActive?1:0.65}}>{item.icon}</span>{!collapsed&&<span className="text-[11px] flex-1">{item.label}</span>}{badge>0&&<span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{background:item.yellow?"var(--accent-yellow)":"var(--accent-red)",color:"#000",position:collapsed?"absolute":"static",top:collapsed?"4px":undefined,right:collapsed?"4px":undefined}}>{badge}</span>}</button>);})}</nav><div className="p-3 flex-shrink-0" style={{borderTop:"1px solid var(--border)"}}>{!collapsed&&<div className="flex gap-2 mb-2"><button onClick={()=>setTheme("light")} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] cursor-pointer transition-all" style={{background:theme==="light"?"var(--accent-green)":"transparent",color:theme==="light"?"#fff":"var(--text-muted)",border:"1px solid "+(theme==="light"?"var(--accent-green)":"var(--border-bright)")}}><Sun size={13}/>Claro</button><button onClick={()=>setTheme("dark")} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[11px] cursor-pointer transition-all" style={{background:theme==="dark"?"var(--accent-green)":"transparent",color:theme==="dark"?"#fff":"var(--text-muted)",border:"1px solid "+(theme==="dark"?"var(--accent-green)":"var(--border-bright)")}}><Moon size={13}/>Escuro</button></div>}{collapsed&&<div className="flex justify-center mb-2"><button onClick={()=>setTheme(theme==="light"?"dark":"light")} title={theme==="light"?"Modo escuro":"Modo claro"} className="p-2 rounded-lg text-[11px] cursor-pointer transition-all" style={{color:"var(--text-muted)",border:"1px solid var(--border-bright)"}}>{theme==="light"?<Moon size={13}/>:<Sun size={13}/>}</button></div>}{collapsed?(<button onClick={onToggle} className="w-full flex items-center justify-center px-3 py-2 rounded-lg text-[11px] cursor-pointer transition-all hover:opacity-70" style={{color:"var(--text-muted)"}} title="Expandir menu" aria-label="Expandir menu"><ChevronRight size={18}/></button>):(<button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] cursor-pointer transition-all hover:opacity-70" style={{color:"var(--text-muted)"}}><LogOut size={14}/>Sair</button>)}{!collapsed&&<button onClick={()=>{const w:any=window as any; if(w.__printTrocarSenha) w.__printTrocarSenha();}} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] cursor-pointer transition-all hover:opacity-70" style={{color:"var(--text-muted)"}}><Pencil size={14}/>Trocar senha</button>}</div></aside>);}

export default function Dashboard() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [acionamentos, setAcionamentos] = useState<Acionamento[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [ordens, setOrdens] = useState<OrdemServico[]>([]);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>([]);
  const [bases, setBases] = useState<any[]>([]);
  const [frotaPlacas, setFrotaPlacas] = useState<any[]>([]);
  const [orcado, setOrcado] = useState<any>(null);
  const [escalamento, setEscalamento] = useState<any>(null);
  const [editBase, setEditBase] = useState<any|null>(null);
  const [filtroSeg, setFiltroSeg] = useState<string>("Aberta");
  const [veiculosSascar, setVeiculosSascar] = useState<{id:string;placa:string;nome:string;modelo:string;marca:string}[]>([]);
  const [sascarOk, setSascarOk] = useState<boolean|undefined>(undefined);
  const [posicoesSascar, setPosicoesSascar] = useState<Record<string,{lat:number;lng:number;velocidade?:number;data?:string}>>({});
  const loadVeiculosSascar = useCallback(async()=>{ const r = await fetcher("/sascar/veiculos"); setVeiculosSascar(r?.data||[]); setSascarOk(r?.credencial_ok); },[]);
  const loadPosicoesSascar = useCallback(async()=>{ const r = await fetcher("/sascar/posicoes"); if(r?.data){ const m:Record<string,{lat:number;lng:number;velocidade?:number;data?:string}>={}; for(const placa in r.data){ const p = r.data[placa]; if(p && p.lat!=null && p.lng!=null){ m[String(placa).replace(/-\d+$/,"").toUpperCase()] = {lat:p.lat, lng:p.lng, velocidade:p.velocidade, data:p.data, ignicao:p.ignicao, uf:p.uf, tensao:p.tensao, odometro:p.odometro, cidade:p.cidade} as any; } } setPosicoesSascar(m); } },[]);
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [alerts, setAlerts] = useState<OrdemServico[]>([]);
  const [search, setSearch] = useState("");
  const [filtroFatura, setFiltroFatura] = useState<"todos"|"fatura"|"nao_fatura">("todos");
  const [filtroOrdemStatus, setFiltroOrdemStatus] = useState("todos");
  const [slaBusca, setSlaBusca] = useState("");
  const [slaFiltro, setSlaFiltro] = useState("");
  const [cancPendentes, setCancPendentes] = useState<any[]>([]);
  const loadCancPendentes = async () => { if(canManage){ const r = await fetcher("/ordens/cancelamentos/pendentes"); setCancPendentes(r?.data||[]); } };
  const aprovarCanc = async (id: string) => { await fetcher(`/ordens/${id}/cancelar/aprovar`,{method:"POST",body:"{}"}); loadCancPendentes(); loadData(); };
  // Filtros do mapa Cobertura
  const REGIAO_POR_UF: Record<string,string> = {AC:"norte",AM:"norte",AP:"norte",PA:"norte",RO:"norte",RR:"norte",TO:"norte",AL:"nordeste",BA:"nordeste",CE:"nordeste",MA:"nordeste",PB:"nordeste",PE:"nordeste",PI:"nordeste",RN:"nordeste",SE:"nordeste",DF:"centro_oeste",GO:"centro_oeste",MT:"centro_oeste",MS:"centro_oeste",ES:"sudeste",MG:"sudeste",RJ:"sudeste",SP:"sudeste",PR:"sul",RS:"sul",SC:"sul"};
  const MAP_REGIOES = [{id:"norte",label:"Norte"},{id:"nordeste",label:"Nordeste"},{id:"centro_oeste",label:"Centro-Oeste"},{id:"sudeste",label:"Sudeste"},{id:"sul",label:"Sul"}];
  const [mapShowFatura, setMapShowFatura] = useState(true);
  const [mapShowNaoFatura, setMapShowNaoFatura] = useState(true);
  const [mapRegioes, setMapRegioes] = useState<Set<string>>(new Set());
  const toggleMapRegiao = (r: string) => setMapRegioes(prev => { const n=new Set(prev); if(n.has(r)) n.delete(r); else n.add(r); return n; });
  const filteredMapPrestadores = useMemo(() => prestadores.filter(p => { if(!p.lat||!p.lng) return false; const okF=p.fatura?mapShowFatura:mapShowNaoFatura; if(!okF) return false; if(mapRegioes.size>0){const reg=REGIAO_POR_UF[(p.estado||"").toUpperCase()]||"outros"; if(!mapRegioes.has(reg)) return false;} return true; }), [prestadores,mapShowFatura,mapShowNaoFatura,mapRegioes]);
  const [tab, setTab] = useState<NavTab>("dashboard");
  const [showP, setShowP] = useState(false); const [showA, setShowA] = useState(false); const [showImport, setShowImport] = useState(false); const [showUser, setShowUser] = useState(false); const [showO, setShowO] = useState(false); const [moreDet, setMoreDet] = useState(false);
  const [selP, setSelP] = useState<Prestador | null>(null); const [loading, setLoading] = useState(false);
  const [editO, setEditO] = useState<OrdemServico | null>(null);
  const [closeO, setCloseO] = useState<OrdemServico | null>(null);
  const [viewO, setViewO] = useState<OrdemServico | null>(null);
  const [cancelO, setCancelO] = useState<OrdemServico | null>(null);
  const [editP, setEditP] = useState<Prestador | null>(null); const [sidebarOpen, setSidebarOpen] = useState(typeof window==="undefined"||window.innerWidth>=1024); const [carga, setCarga] = useState<string>(""); const [notasOpen, setNotasOpen] = useState<OrdemServico|null>(null); const [editU, setEditU] = useState<Usuario | null>(null);
  const fileRef = useRef<HTMLInputElement>(null); const osFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true); setGlobalLoggedIn = setLoggedIn;
    let token = "";
    try { token = localStorage.getItem("token") || ""; } catch { token = ""; }
    if (!token) { void 0; return; }
    setLoggedIn(true);
    let u: any = null;
    try { const raw = localStorage.getItem("user"); if (raw) u = JSON.parse(raw); } catch { u = null; }
    if (u && typeof u === "object") setUser(u);
    else setUser({ email: "", nome: "", role: "operador" });
  }, []);

  const role = user?.role || "operador";
  const canWrite = role === "gerente" || role === "admin";
  const canManage = role === "admin";

  const loadData = useCallback(async () => { setLoading(true); try { const [p, a, s, o, oc, bs, orc, esc] = await Promise.all([fetcher("/prestadores"), fetcher("/acionamentos"), fetcher("/stats"), fetcher("/ordens"), fetcher("/ocorrencias"), fetcher("/bases"), fetcher("/stats/orcado"), fetcher("/escalonamento")]);
    fetcher("/frota/placas").then((fr:any)=>{ if(fr?.data) setFrotaPlacas(fr.data); }); setPrestadores(p?.data||[]); setAcionamentos(a?.data||[]); setStats(s||null); setOrdens(o?.data||[]); setOcorrencias(oc?.data||[]); setBases(bs?.data||[]); setOrcado(orc||null); setEscalamento(esc||null); } catch(e) { console.error(e); } finally { setLoading(false); } }, []);
  const loadUsers = useCallback(async () => { const r = await fetcher("/users"); setUsuarios(r?.data||[]); }, []);
  const aceitarOcorrencia = async (id: string) => { await fetcher(`/ocorrencias/${id}/aceitar`,{method:"POST",body:"{}"}); loadData(); };
  const refresh = useCallback(async () => { try { const [s, o, oc, al] = await Promise.all([fetcher("/stats"), fetcher("/ordens"), fetcher("/ocorrencias"), fetcher("/alerts")]); setStats(s||null); setOrdens(o?.data||[]); setOcorrencias(oc?.data||[]); setAlerts(al?.data||[]); const n = await fetcher("/notificacoes"); setNotifNaoLidas(n?.nao_lidas||0); } catch(e) { console.error(e); } }, []);
  useEffect(() => { if (mounted) { loadPosicoesSascar(); } }, [mounted, loadPosicoesSascar]);
  useEffect(() => { if (mounted) { loadData(); if (canManage) loadUsers(); } }, [loadData, loadUsers, mounted, canManage]);

  // Poll silencioso a cada 10min (ordens, stats, ocorrências, alertas)
  useEffect(() => { if (!mounted) return; const t = setInterval(() => { refresh(); loadPosicoesSascar(); }, 30000); return () => clearInterval(t); }, [mounted, refresh, loadPosicoesSascar]);

  const addP = async (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const d = Object.fromEntries(fd.entries()); await fetcher("/prestadores",{method:"POST",body:JSON.stringify({...d,socorro_24h:d.socorro_24h==="on",fatura:d.fatura==="on"})}); setShowP(false); loadData(); };
  const addA = async (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); const fd = new FormData(e.currentTarget); await fetcher("/acionamentos",{method:"POST",body:JSON.stringify(Object.fromEntries(fd.entries()))}); setShowA(false); setSelP(null); loadData(); };
  const addO = async (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); if(savingO) return; const fd = new FormData(e.currentTarget); const d = Object.fromEntries(fd.entries()); if(!d.placa && d.veiculo){ d.placa = String(d.veiculo); } const placa = String(d.placa||"").trim().toUpperCase(); if(!placa){ alert("Informe a Placa do veículo"); return; } if(!carga){ alert("Selecione CARREGADO ou VAZIO"); return; } const sascar = veiculosSascar.find(v=>v.placa===placa); setSavingO(true); try { await fetcher("/ordens",{method:"POST",body:JSON.stringify({...d, placa, carga, motorista: titleCase(String(d.motorista||"")), marca: titleCase(String(d.marca||"")), forma_pagamento: d.forma_pagamento||null, valor: parseFloat(String(d.valor||"0")), valor_orcado: parseFloat(String(d.valor_orcado||"0")), sascar_id: sascar?.id||null})}); setShowO(false); setCarga(""); setPrestadorSugerido(""); setMoreDet(false); setPlacaNova(""); setAutofill(null); loadData(); } finally { setSavingO(false); } };
  const delO = async (id: string) => { if (!confirm("Remover O.S?")) return; await fetcher(`/ordens/${id}`,{method:"DELETE"}); loadData(); };
  const cancelarOrdem = async (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); if (!cancelO) return; const fd = new FormData(e.currentTarget); const motivo = String(fd.get("motivo")||""); const r = await fetcher(`/ordens/${cancelO.id}/cancelar`,{method:"POST",body:JSON.stringify({motivo})}); setCancelO(null); loadData(); if(r?.pendente) alert("Cancelamento solicitado. Aguardando aprovação de outro admin."); };
  const closeSocorro = async (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); if (!closeO) return; const fd = new FormData(e.currentTarget); const d = Object.fromEntries(fd.entries()); await fetcher(`/ordens/${closeO.id}/fechar`,{method:"POST",body:JSON.stringify({resultado: d.resultado, servico_realizado: d.servico_realizado, execucao: d.execucao, prestador_id: d.prestador_id, valor: parseFloat(String(d.valor||"0")), valor_orcado: parseFloat(String(d.valor_orcado||"0")), observacoes: d.observacoes})}); setCloseO(null); loadData(); };
  const updO = async (id: string, campo: string, valor: string) => { setOrdens(prev=>prev.map(o=>o.id===id?{...o,[campo]:valor}:o)); await fetcher(`/ordens/${id}`,{method:"PUT",body:JSON.stringify({[campo]:valor})}); };
  const saveEditO = async (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); if (!editO) return; const fd = new FormData(e.currentTarget); const d = Object.fromEntries(fd.entries()); await fetcher(`/ordens/${editO.id}`,{method:"PUT",body:JSON.stringify({...d, placa: String(d.placa||"").trim().toUpperCase(), motorista: titleCase(String(d.motorista||"")), operador: titleCase(String(d.operador||"")), modelo: titleCase(String(d.modelo||"")), marca: titleCase(String(d.marca||"")), rodovia: titleCase(String(d.rodovia||"")), valor: parseFloat(String(d.valor||"0")), valor_orcado: parseFloat(String(d.valor_orcado||"0"))})}); setEditO(null); loadData(); };
  const delP = async (id: string) => { if (!confirm("Remover?")) return; await fetcher(`/prestadores/${id}`,{method:"DELETE"}); loadData(); };
  const addBase = async (e:any) => { e.preventDefault(); const fd=new FormData(e.currentTarget); const d:any=Object.fromEntries(fd.entries()); const body={nome:String(d.nome||"").trim(),lat:parseFloat(String(d.lat)),lng:parseFloat(String(d.lng)),endereco:String(d.endereco||"").trim()}; if(!body.nome||isNaN(body.lat)||isNaN(body.lng)){alert("Preencha nome, latitude e longitude");return;} if(editBase){await fetcher(`/bases/${editBase.id}`,{method:"PUT",body:JSON.stringify(body)});setEditBase(null);}else{await fetcher("/bases",{method:"POST",body:JSON.stringify(body)});} (e.currentTarget as HTMLFormElement).reset(); loadData(); };
  const delBase = async (id:string) => { if(!confirm("Remover esta base?")) return; await fetcher(`/bases/${id}`,{method:"DELETE"}); loadData(); };
  const saveEditP = async (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); if (!editP) return; const fd = new FormData(e.currentTarget); const d = Object.fromEntries(fd.entries()); await fetcher(`/prestadores/${editP.id}`,{method:"PUT",body:JSON.stringify({...d, socorro_24h:d.socorro_24h==="on", fatura:d.fatura==="on"})}); setEditP(null); loadData(); };
  const delA = async (id: string) => { await fetcher(`/acionamentos/${id}`,{method:"DELETE"}); loadData(); };
  const doImport = async (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (!f) return; const fd = new FormData(); fd.append("file",f); const h = getAuthHeaders(); delete h["Content-Type"]; await fetch(`${API}/prestadores/import`,{method:"POST",headers:h,body:fd}); setShowImport(false); loadData(); };
  const doImportOS = async (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (!f) return; const fd = new FormData(); fd.append("file",f); const h = getAuthHeaders(); delete h["Content-Type"]; const res = await fetch(`${API}/ordens/import`,{method:"POST",headers:h,body:fd}); try { const j = await res.json(); if (j.success) alert("Importadas: " + j.importadas + " O.S."); else alert("Erro ao importar"); } catch { alert("Erro ao importar"); } loadData(); };
  const addUser = async (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); const fd = new FormData(e.currentTarget); const d = Object.fromEntries(fd.entries()); await fetcher("/users",{method:"POST",body:JSON.stringify(d)}); setShowUser(false); loadUsers(); };
  const setRole = async (id: string, r: string) => { await fetcher(`/users/${id}`,{method:"PUT",body:JSON.stringify({role:r})}); loadUsers(); };
  const delUser = async (id: string) => { if (!confirm("Remover usuário?")) return; await fetcher(`/users/${id}`,{method:"DELETE"}); loadUsers(); };
  const aprovarUser = async (id: string, role: string) => { await fetcher(`/users/${id}/aprovar`,{method:"POST",body:JSON.stringify({role})}); loadUsers(); };
  const saveEditUser = async (e: React.FormEvent<HTMLFormElement>) => { e.preventDefault(); if (!editU) return; const fd = new FormData(e.currentTarget); const d = Object.fromEntries(fd.entries()); const body:any = { nome: d.nome, role: d.role }; if (d.email) body.email = d.email; if (d.password) body.password = d.password; await fetcher(`/users/${editU.id}`,{method:"PUT",body:JSON.stringify(body)}); setEditU(null); loadUsers(); };
  const exportExcel = async () => { try { const r = await fetcher("/relatorio"); if (r && r.base64) { const bin = atob(r.base64); const bytes = new Uint8Array(bin.length); for (let i=0;i<bin.length;i++) bytes[i]=bin.charCodeAt(i); const blob = new Blob([bytes], {type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href=url; a.download=r.filename||"relatorio.xlsx"; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url); } else { alert("Não foi possível gerar o relatório"); } } catch(e){ alert("Erro ao gerar relatório"); } };
  const [notas, setNotas] = useState<{sigla:string;nome?:string;texto:string;hora:string;quem:string}[]>([]);
  const [notificacoes, setNotificacoes] = useState<{id:string;mensagem:string;os:string;lida:boolean;created_at:string}[]>([]);
  const [notifNaoLidas, setNotifNaoLidas] = useState(0);
  const [showNotif, setShowNotif] = useState(false);
  const [editCarga, setEditCarga] = useState("");
  const [maisDetEdit, setMaisDetEdit] = useState(false);
  const [prestadorSugerido, setPrestadorSugerido] = useState("");
  const [localizando, setLocalizando] = useState(false);
  const [savingO, setSavingO] = useState(false);
  const [placaNova, setPlacaNova] = useState("");
  const [autofill, setAutofill] = useState<{modelo?:string;marca?:string;km?:string;tipo?:string;filial?:string}|null>(null);
  const placasSascar = (()=>{ const set=new Set<string>(); Object.keys(posicoesSascar||{}).forEach(k=>set.add(k)); (veiculosSascar||[]).forEach(v=>{ if(v.placa) set.add(String(v.placa).toUpperCase().split("-")[0].trim()); }); return Array.from(set).filter(Boolean).sort(); })();
  const preencherPorPlaca = (placa:string) => {
    const p = String(placa||"").toUpperCase().split("-")[0].trim();
    if(!p){ setAutofill(null); return; }
    const pos:any = (posicoesSascar||{})[p];
    let modelo="", marca="", tipo="";
    const ult = (ordens||[]).filter(o=>String(o.placa||"").toUpperCase().split("-")[0].trim()===p && ((o.modelo||"")+(o.marca||""))).sort((a,b)=>String(b.abertura||"").localeCompare(String(a.abertura||"")))[0];
    if(ult){ modelo=ult.modelo||""; marca=ult.marca||""; tipo=(ult as any).tipo_veiculo||""; }
    const vs = (veiculosSascar||[]).find(v=>String(v.placa||"").toUpperCase().split("-")[0].trim()===p);
    if(vs){ modelo = modelo || (vs as any).modelo || ""; marca = marca || (vs as any).marca || ""; }
    if(!tipo) tipo = inferTipoVeiculo(modelo, marca);
    const km = pos && pos.odometro ? String(pos.odometro) : "";
    setAutofill({modelo,marca,km,tipo});
  };
  const haversine = (lat1:number,lng1:number,lat2:number,lng2:number)=>{ const R=6371; const dLat=(lat2-lat1)*Math.PI/180; const dLng=(lng2-lng1)*Math.PI/180; const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2; return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)); };
  const localizarPrestador = () => { if(!navigator.geolocation){alert("GPS n\u00e3o dispon\u00edvel no navegador");return;} setLocalizando(true); navigator.geolocation.getCurrentPosition((pos)=>{ const {latitude:lat,longitude:lng}=pos.coords; const comCoord=prestadores.filter(p=>p.lat&&p.lng); if(!comCoord.length){setLocalizando(false);alert("Nenhum prestador com localiza\u00e7\u00e3o cadastrada");return;} const sorted=comCoord.map(p=>({...p,dist:haversine(lat,lng,p.lat!,p.lng!)})).sort((a,b)=>a.dist-b.dist); setPrestadorSugerido(sorted[0].id); setLocalizando(false); },(err)=>{ setLocalizando(false); alert("N\u00e3o foi poss\u00edvel obter localiza\u00e7\u00e3o: "+err.message); },{timeout:8000}); };
  const loadNotificacoes = async () => { const r = await fetcher("/notificacoes"); setNotificacoes(r?.data||[]); setNotifNaoLidas(r?.nao_lidas||0); };
  const carregarNotas = async (id: string) => { const r = await fetcher(`/ordens/${id}/notas`); setNotas(r?.data||[]); };
  const salvarNota = async (id: string, sigla: string, texto: string) => { if(!texto.trim()) return; await fetcher(`/ordens/${id}/notas`,{method:"POST",body:JSON.stringify({sigla, texto})}); carregarNotas(id); };
  const logout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); const w:any=window as any; if(w.__printLogout) w.__printLogout(); };

  const filtered = prestadores.filter(p => { const nm=(p.nome||"").toLowerCase(); const cd=(p.cidade||"").toLowerCase(); const cj=(p.cnpj||""); return (nm.includes(search.toLowerCase()) || cd.includes(search.toLowerCase()) || cj.includes(search)) && (filtroFatura === "todos" || (filtroFatura === "fatura" ? p.fatura : !p.fatura)); });
  const acionamentosOrdenados = [...acionamentos].sort((a,b) => { const ca = ordens.filter(o => o.prestador_nome === a.prestador_nome).length; const cb = ordens.filter(o => o.prestador_nome === b.prestador_nome).length; return cb - ca; });
  const chartData = stats ? Object.entries(stats.acionamento_por_tipo||{}).filter(([,v]) => v > 0).map(([k,v]) => ({ name: TIPO_LABELS[k]||k, value: v })).sort((a,b) => a.value - b.value) : [];

  if (!mounted) return null;

  const ordensAbertos = ordens.filter(o=>STATUS_ABERTOS.has(o.status||"")).length;
  const ocorrPend = ocorrencias.filter(o=>o.status==="pendente").length;
  return (<div className="flex min-h-screen" style={{background:"var(--bg)",color:"var(--text)"}}>
    <Sidebar tab={tab as NavTab} setTab={setTab as (t:NavTab)=>void} user={user} logout={logout} ordensAbertos={ordensAbertos} ocorrPend={ocorrPend} theme={theme||"dark"} setTheme={setTheme} collapsed={!sidebarOpen} onToggle={()=>setSidebarOpen(v=>!v)}/>
    <div className="flex-1 min-h-screen" style={{marginLeft:sidebarOpen?"var(--sidebar-w)":"76px",transition:"margin-left 0.25s ease"}}>
    <main className="p-6">{!loading&&<><button onClick={exportExcel} className="fixed bottom-[76px] right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold cursor-pointer shadow-xl transition-all hover:scale-105 hover:shadow-2xl" style={{background:"var(--accent-green)",color:"#fff"}} title="Baixar relatório analítico em Excel"><FileDown size={15}/>Exportar Excel</button><button onClick={()=>{setShowNotif(v=>!v); loadNotificacoes();}} className="fixed bottom-[76px] right-[190px] z-40 flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold cursor-pointer shadow-xl transition-all hover:scale-105" style={{background:"var(--bg-card)",color:"var(--text)",border:"1px solid var(--border-bright)"}} title="Notificações"><BellRing size={15}/>{notifNaoLidas>0&&<span className="text-[10px] font-bold px-1.5 rounded-full" style={{background:"var(--accent-red)",color:"#fff"}}>{notifNaoLidas}</span>}</button>{showNotif&&<div className="fixed bottom-36 right-6 z-50 w-80 max-h-96 overflow-y-auto rounded-xl shadow-2xl p-3 space-y-2" style={{background:"var(--bg-card)",border:"1px solid var(--border-bright)"}}>{notificacoes.length===0&&<p className="text-xs text-center py-4" style={{color:"var(--text-muted)"}}>Nenhuma notificação</p>}{notificacoes.map(n=>(<div key={n.id} className="p-2 rounded-lg" style={{background:n.lida?"var(--bg-alt)":"var(--accent-green-glow)",border:"1px solid var(--border)"}}><p className="text-xs" style={{color:"var(--text)"}}>{n.mensagem}</p><p className="text-[9px] mt-0.5" style={{color:"var(--text-muted)"}}>{n.created_at?new Date(n.created_at).toLocaleString("pt-BR",{timeZone:"America/Sao_Paulo"}):""}</p></div>))}</div>}</>}{loading&&<p className="text-center py-20" style={{color:"var(--text-muted)"}}>Carregando...</p>}
      {!loading&&tab==="dashboard"&&(<>
        {(alerts.length>0||(stats?.paradas?.length||0)>0)&&<div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg" style={{background:"rgba(239,68,68,0.08)",border:"1px solid rgba(239,68,68,0.3)"}}><AlertTriangle className="w-4 h-4 text-red-500 shrink-0"/><span className="text-sm font-bold text-red-500">{alerts.length>0?`${alerts.length} O.S. com mais de 60 min em aberto`:""}{alerts.length>0&&(stats?.paradas?.length||0)>0?" · ":""}{(stats?.paradas?.length||0)>0?`${stats!.paradas!.length} O.S. paradas há mais de 2h`:""}</span><span className="ml-auto text-xs text-red-400">Ver painel de atendimento</span></div>}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
          <StatCard l="Socorros Hoje" v={stats?.socorros_hoje??0} I={BarChart3} c="print-green"/>
          <StatCard l="Em Aberto" v={stats?.em_aberto??0} I={Clock} c="blue-500"/>
          <StatCard l="Atrasados" v={stats?.atrasados??0} I={TrendingUp} c="print-yellow"/>
          <StatCard l="Liberados" v={stats?.liberados??0} I={FileText} c="purple-500"/>
          <StatCard l="Rebocados" v={stats?.rebocados??0} I={Users} c="print-green"/>
          <StatCard l="RPM" v={`${stats?.rpm??0}%`} I={TrendingUp} c="print-yellow"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <SegPanel titulo="Privado" cor="#2dc62d" icone="P" s={stats?.indicadores_segmento?.privado}/>
          <SegPanel titulo="Correios" cor="#f5c518" icone="C" s={stats?.indicadores_segmento?.correios}/>
          <SegPanel titulo="Geral" cor="#e8e6e1" icone="G" s={stats?.indicadores_segmento?.geral}/>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <Card title="PDF Gerencial" sub="Imprimir ou salvar em PDF"><div className="flex items-center gap-2 mb-2"><span className="text-[10px]" style={{color:"var(--text-muted)"}}>Período</span><select id="pdf-dias" defaultValue="30" className="px-2 py-1 rounded-lg text-[10px] border cursor-pointer" style={{background:"var(--bg-alt)",borderColor:"var(--border)",color:"var(--text)"}}><option value="7">7 dias</option><option value="30">30 dias</option><option value="90">90 dias</option><option value="0">Tudo</option></select></div><button onClick={async()=>{try{const r=await fetch("/api/relatorio/gerencial2?dias="+((document.getElementById("pdf-dias") as HTMLSelectElement)?.value||"30")+"&token="+encodeURIComponent(getToken()));const j=await r.json();if(!j||!j.html){alert("Nao foi possivel gerar o relatorio");return;}const w=window.open("","_blank");if(w){w.document.open();w.document.write(j.html);w.document.close();}}catch(e){alert("Nao foi possivel gerar o relatorio");}}} className="w-full py-2.5 rounded-lg text-xs font-bold cursor-pointer" style={{background:"var(--accent-green)",color:"#fff"}}>Gerar PDF Gerencial</button><p className="text-[10px] mt-2 leading-relaxed" style={{color:"var(--text-muted)"}}>Abre em nova aba. No navegador use Ctrl+P e escolha “Salvar como PDF”.</p><p className="text-[10px] mt-1" style={{color:"var(--text-muted)"}}>Inclui maiores problemas, soluções sugeridas e ficha por placa.</p></Card>
          <Card title="Orçado × Realizado" sub="Por prestador">{orcado?.por_prestador?.length>0?(<div className="space-y-1.5">{(orcado.por_prestador||[]).slice(0,4).map((p:any)=>(<div key={p.nome} className="flex items-center gap-2 text-[10px]"><span className="truncate" style={{color:"var(--text)",width:86}}>{p.nome}</span><div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{background:"var(--bg-alt)"}}><div style={{width:Math.min(100,(p.realizado/(p.orcado||p.realizado||1))*100)+"%",height:"100%",background:p.desvio_pct>0?"#E53935":"#25D647"}}/></div><span className="font-mono font-bold" style={{color:p.desvio_pct>0?"#C62828":"#146E1F"}}>{p.desvio_pct>0?"+":""}{p.desvio_pct}%</span></div>))}</div>):(<p className="text-center text-[10px] py-4" style={{color:"var(--text-muted)"}}>Sem valor orçado lançado</p>)}</Card>
          <Card title="Escalonamento" sub="O.S. parada há 2h ou mais">{escalamento?.data?.length>0?(<div className="space-y-1">{(escalamento.data||[]).slice(0,4).map((e:any)=>(<div key={e.id} className="flex items-center gap-2 text-[10px]"><span className="w-1.5 h-1.5 rounded-full shrink-0" style={{background:e.nivel==="GERENCIA"?"#E53935":"#F5B301"}}/><span className="font-mono font-bold" style={{color:"var(--text)"}}>{e.placa||e.os}</span><span className="truncate" style={{color:"var(--text-muted)"}}>{e.status}</span><span className="ml-auto font-mono font-bold" style={{color:"#C62828"}}>{e.horas_parada}h</span></div>))}</div>):(<p className="text-center text-[10px] py-4" style={{color:"var(--text-muted)"}}>Nenhuma O.S. parada</p>)}</Card>
        </div>
        <Card title="Resumo Diário" sub="Hoje"><div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{(()=>{const r=stats?.resumo;const t_ent=r?.tendencia_entraram??0;const t_fech=r?.tendencia_fecharam??0;const seta=(v:number)=>(v>0?"↑":v<0?"↓":"→");const cor=(v:number)=>(v>0?"#16a34a":v<0?"#dc2626":"#9ca3af");return(<><div className="p-3 rounded-lg" style={{background:"var(--bg-alt)",border:"1px solid var(--border)"}}><div className="text-[10px] font-bold uppercase tracking-wide" style={{color:"var(--text-muted)"}}>Entraram hoje</div><div className="text-2xl font-bold font-mono mt-1" style={{color:"var(--text)"}}>{r?.hoje?.entraram??0}<span className="text-sm ml-1" style={{color:cor(t_ent)}}>{seta(t_ent)} {Math.abs(t_ent)}</span></div></div><div className="p-3 rounded-lg" style={{background:"var(--bg-alt)",border:"1px solid var(--border)"}}><div className="text-[10px] font-bold uppercase tracking-wide" style={{color:"var(--text-muted)"}}>Fecharam hoje</div><div className="text-2xl font-bold font-mono mt-1" style={{color:"var(--text)"}}>{r?.hoje?.fecharam??0}<span className="text-sm ml-1" style={{color:cor(t_fech)}}>{seta(t_fech)} {Math.abs(t_fech)}</span></div></div><div className="p-3 rounded-lg" style={{background:"var(--bg-alt)",border:"1px solid var(--border)"}}><div className="text-[10px] font-bold uppercase tracking-wide" style={{color:"var(--accent-green)"}}>À Vista (hoje)</div><div className="text-2xl font-bold font-mono mt-1" style={{color:"var(--text)"}}>{BRL(r?.hoje?.avista_valor,0)}</div></div><div className="p-3 rounded-lg" style={{background:"var(--bg-alt)",border:"1px solid var(--border)"}}><div className="text-[10px] font-bold uppercase tracking-wide" style={{color:"var(--accent-yellow)"}}>Faturado (hoje)</div><div className="text-2xl font-bold font-mono mt-1" style={{color:"var(--text)"}}>{BRL(r?.hoje?.faturado_valor,0)}</div></div></>);})()}</div></Card>
        <Card title="Pagamento" sub="À Vista × Faturado"><div className="grid grid-cols-2 gap-3">{(()=>{const p=stats?.pagamento||{a_vista:{count:0,valor:0},faturado:{count:0,valor:0}};const av=p.a_vista||{count:0,valor:0};const ft=p.faturado||{count:0,valor:0};return(<><div className="p-3 rounded-lg" style={{background:"var(--bg-alt)",border:"1px solid var(--border)"}}><div className="text-[10px] font-bold uppercase tracking-wide" style={{color:"var(--accent-green)"}}>À Vista</div><div className="text-2xl font-bold font-mono mt-1" style={{color:"var(--text)"}}>{av.count}</div><div className="text-[10px]" style={{color:"var(--text-muted)"}}>{BRL(av.valor)}</div></div><div className="p-3 rounded-lg" style={{background:"var(--bg-alt)",border:"1px solid var(--border)"}}><div className="text-[10px] font-bold uppercase tracking-wide" style={{color:"var(--accent-yellow)"}}>Faturado</div><div className="text-2xl font-bold font-mono mt-1" style={{color:"var(--text)"}}>{ft.count}</div><div className="text-[10px]" style={{color:"var(--text-muted)"}}>{BRL(ft.valor)}</div></div></>);})()}</div></Card>
        <Card title="Socorros em Aberto" sub="Linha do tempo (SLA 120min)">{(()=>{const abertas0=ordens.filter(o=>!o.fechamento&&!o.cancelado);return(<><div className="flex items-center gap-2 mb-3 flex-wrap"><select value={filtroSeg} onChange={e=>setFiltroSeg(e.target.value)} className="px-2 py-1.5 text-xs rounded border border-border bg-surface-alt text-text"><option value="todos">Segmento: Todos</option><option value="privado">Privado</option><option value="correios">Correios</option></select><select value={filtroTipo} onChange={e=>setFiltroTipo(e.target.value)} className="px-2 py-1.5 text-xs rounded border border-border bg-surface-alt text-text"><option value="todos">Tipo: Todos</option>{["mecanico","eletrico","pneus","freio","combustivel","guincho","borracharia","outros"].map(t=><option key={t} value={t}>{t}</option>)}</select></div>{(()=>{const abertos=abertas0.filter(o=>(filtroSeg==="todos"||(o.segmento||"privado")===filtroSeg)&&(filtroTipo==="todos"||o.tipo_servico===filtroTipo)).slice(-80).reverse();return abertos.length>0?(<div className="flex flex-wrap gap-1.5">{abertos.map(o=>{const ab=o.abertura?new Date(o.abertura).getTime():null;const mins=ab?Math.round((Date.now()-ab)/60000):0;const atrasado=mins>120;const quase=mins>60&&!atrasado;return <span key={o.id} title={"O.S. "+o.os+" - "+(o.placa||"sem placa")+" - "+mins+" min - "+(o.status||"")} className="px-2 py-0.5 rounded text-[10px] font-bold tabular-nums cursor-default" style={atrasado?{background:"#ef4444",color:"#fff"}:quase?{background:"#eab308",color:"#000"}:{background:"rgba(34,197,94,0.15)",color:"var(--accent-green)"}}>{o.os}</span>;})}</div>):<p className="text-center text-text-muted py-6">Nenhum socorro em aberto</p>;})()}</>)})()}</Card>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card title="Tipos de Serviço" sub="Ordem crescente">{chartData.length>0?(<ResponsiveContainer width="100%" height={240}><BarChart data={chartData} margin={{top:5,right:20,left:0,bottom:5}}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/><XAxis dataKey="name" tick={{fontSize:12,fill:"var(--text-muted)"}} stroke="var(--border)"/><YAxis tick={{fontSize:12,fill:"var(--text-muted)"}} stroke="var(--border)"/><Tooltip contentStyle={{background:"var(--bg-alt)",border:"1px solid var(--border)",borderRadius:8,color:"var(--text)"}}/><Bar dataKey="value" radius={[4,4,0,0]}>{chartData.map((_,i)=><Cell key={i} fill={CHART_COLORS[i%4]}/>)}</Bar></BarChart></ResponsiveContainer>):<p className="text-center text-text-muted py-12">Cadastre prestadores</p>}</Card>
          <Card title="Mais Acionados" sub="Top 10">{stats?.top_prestadores&&stats.top_prestadores.length>0?(<div className="space-y-3">{stats.top_prestadores.slice(0,10).map((p,i)=>(<div key={p.id} className="flex items-center gap-3"><span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${i<3?"bg-print-green":"bg-surface-hover text-text-muted"}`}>{i+1}</span><span className="flex-1 text-sm font-medium truncate text-text">{p.nome}</span><div className="w-32 h-2 bg-surface-hover rounded-full overflow-hidden"><div className="h-full bg-print-green rounded-full" style={{width:`${Math.min(100,(p.count/stats.top_prestadores[0].count)*100)}%`}}/></div><span className="text-sm font-bold w-8 text-right text-text">{p.count}</span></div>))}</div>):<p className="text-center text-text-muted py-12">Nenhum acionamento</p>}</Card>
        </div>
        <div className="mb-6"><Card title="Filial mais Acionada" sub="Por Operação">{stats?.operacao_count&&Object.keys(stats.operacao_count).length>0?(<ResponsiveContainer width="100%" height={260}><BarChart data={Object.entries(stats.operacao_count).map(([k,v])=>({name:FILIAL_SIGLA[k]||k,value:v})).sort((a,b)=>a.value-b.value)} margin={{top:5,right:20,left:0,bottom:5}}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/><XAxis dataKey="name" tick={{fontSize:11,fill:"var(--text-muted)"}} stroke="var(--border)"/><YAxis domain={[0,10]} allowDecimals={false} tick={{fontSize:12,fill:"var(--text-muted)"}} stroke="var(--border)"/><Tooltip contentStyle={{background:"var(--bg-alt)",border:"1px solid var(--border)",borderRadius:8,color:"var(--text)"}}/><Bar dataKey="value" radius={[4,4,0,0]}>{Object.entries(stats.operacao_count).map((_,i)=><Cell key={i} fill={CHART_COLORS[i%4]}/>)}</Bar></BarChart></ResponsiveContainer>):<p className="text-center text-text-muted py-12">Sem dados de operação</p>}</Card></div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card title="Taxa de Repetibilidade de Falhas" sub="Por Marca">{stats?.custo_por_marca&&Object.keys(stats.custo_por_marca).length>0?(<><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={Object.entries(stats.custo_por_marca).map(([k,v])=>({name:k,value:v.count}))} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>{Object.entries(stats.custo_por_marca).map(([k],i)=><Cell key={k} fill={CORP_COLORS[i%CORP_COLORS.length]}/>)}</Pie><Tooltip contentStyle={{background:"var(--bg-alt)",border:"1px solid var(--border)",borderRadius:8,color:"var(--text)"}}/><Legend/></PieChart></ResponsiveContainer><p className="text-center text-xs text-text-muted mt-2">Taxa geral: <span className="font-bold" style={{color:(stats?.taxa_repetibilidade??0)>50?"#dc2626":(stats?.taxa_repetibilidade??0)>25?"#d97706":"#16a34a"}}>{stats?.taxa_repetibilidade??0}%</span></p></>):<p className="text-center text-text-muted py-12">Sem dados de marca</p>}</Card>
          <Card title="Custo Médio por Marca" sub="Socorro">{stats?.custo_por_marca&&Object.keys(stats.custo_por_marca).length>0?(<ResponsiveContainer width="100%" height={260}><BarChart data={Object.entries(stats.custo_por_marca).map(([k,v])=>({name:k,custo:v.custo_medio,count:v.count})).sort((a,b)=>a.custo-b.custo)} margin={{top:5,right:20,left:0,bottom:5}}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)"/><XAxis dataKey="name" tick={{fontSize:11,fill:"var(--text-muted)"}} stroke="var(--border)"/><YAxis tick={{fontSize:12,fill:"var(--text-muted)"}} stroke="var(--border)"/><Tooltip contentStyle={{background:"var(--bg-alt)",border:"1px solid var(--border)",borderRadius:8,color:"var(--text)"}} formatter={(value:any,name:any)=>{if(name==="custo")return [BRL(value),"Custo Médio"];return [value,name];}}/><Bar dataKey="custo" radius={[4,4,0,0]}>{Object.entries(stats.custo_por_marca).map(([k,v])=>{const c=v.custo_medio;const cor=c>1000?"#ef4444":c>500?"#eab308":"#2dc62d";return <Cell key={k} fill={cor}/>;})}</Bar></BarChart></ResponsiveContainer>):<p className="text-center text-text-muted py-12">Sem dados de marca</p>}</Card>
        </div>
        <Card title="Tempo de Atendimento (SLA)" sub="Melhor tempo + 5 piores"><SlaChart ordens={ordens} busca={slaBusca} filtro={slaFiltro} setBusca={setSlaBusca} setFiltro={setSlaFiltro}/></Card>
        <div className="flex flex-wrap items-center gap-2 mb-4"><span className="text-xs font-medium text-text-muted">Filtrar por faturamento:</span><button onClick={()=>setFiltroFatura("todos")} className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${filtroFatura==="todos"?"bg-print-green text-white":"border border-border text-text-muted hover:bg-surface-hover"}`}>Todos</button><button onClick={()=>setFiltroFatura("fatura")} className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors flex items-center gap-1.5 ${filtroFatura==="fatura"?"bg-blue-500 text-white":"border border-border text-text-muted hover:bg-surface-hover"}`}><span className="w-2 h-2 rounded-full bg-blue-500" />Faturam</button><button onClick={()=>setFiltroFatura("nao_fatura")} className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors flex items-center gap-1.5 ${filtroFatura==="nao_fatura"?"bg-red-500 text-white":"border border-border text-text-muted hover:bg-surface-hover"}`}><span className="w-2 h-2 rounded-full bg-red-500" />Não faturam</button></div>
        <div className="grid gap-4" style={{display:"flex",flexDirection:"column",gap:16}}><div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) 152px",gap:16,alignItems:"stretch"}}><Card title="Cobertura" sub="Prestadores"><div className="h-[600px] rounded-lg overflow-hidden"><MapaBrasil prestadores={filteredMapPrestadores} bases={bases}/></div></Card><div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"12px 8px",borderRadius:12,background:"var(--bg-card)",border:"1px solid var(--border-bright)",gap:14,fontSize:11,minWidth:0}}><div style={{fontSize:9,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--text-muted)",marginBottom:2,alignSelf:"flex-start"}}>FATURAMENTO</div><label style={{display:"flex",alignItems:"center",gap:5,color:"var(--text)",cursor:"pointer",alignSelf:"flex-start"}}><input type="checkbox" checked={mapShowFatura} onChange={()=>setMapShowFatura(v=>!v)} style={{accentColor:"#16a34a"}}/><span>Faturado</span></label><label style={{display:"flex",alignItems:"center",gap:5,color:"var(--text)",cursor:"pointer",alignSelf:"flex-start"}}><input type="checkbox" checked={mapShowNaoFatura} onChange={()=>setMapShowNaoFatura(v=>!v)} style={{accentColor:"#dc2626"}}/><span>Não fatura</span></label><div style={{fontSize:9,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",color:"var(--text-muted)",marginTop:6,marginBottom:2,alignSelf:"flex-start"}}>REGIÃO</div>{MAP_REGIOES.map(r=>(<label key={r.id} style={{display:"flex",alignItems:"center",gap:5,color:"var(--text)",cursor:"pointer",alignSelf:"flex-start"}}><input type="checkbox" checked={mapRegioes.has(r.id)} onChange={()=>toggleMapRegiao(r.id)} style={{accentColor:"#16a34a"}}/><span>{r.label}</span></label>))}<div style={{fontSize:9,color:"var(--text-muted)",borderTop:"1px solid var(--border)",paddingTop:6,alignSelf:"stretch",textAlign:"center"}}>{filteredMapPrestadores.length} prestador(es)</div></div></div><Card title="Atendimento" sub="Caminhões parados"><div className="flex items-center gap-3 mb-2 text-[10px] flex-wrap" style={{color:"var(--text-muted)"}}><span className="flex items-center gap-1"><span style={{width:9,height:9,borderRadius:2,background:"#3b82f6",display:"inline-block"}}/>Parado</span>{Object.keys(posicoesSascar||{}).length>0&&<span className="ml-auto">{Object.keys(posicoesSascar||{}).length} caminhão(ões)</span>}</div>{sascarOk===false&&<div className="mb-2 px-2 py-1 rounded text-[10px]" style={{background:"rgba(234,179,8,0.12)",color:"#d97706"}}>Sascar: credenciais de integração pendentes — posições indisponíveis</div>}<div className="h-[600px] rounded-lg overflow-hidden"><MapaAtendimento ordens={ordens.filter(o=>!o.fechamento&&!o.cancelado)} posicoes={posicoesSascar} veiculos={veiculosSascar} bases={bases}/></div></Card></div>
        <div className="mt-6"><Card title="Frota Sascar" sub="Todos os veiculos"><div className="flex items-center gap-3 mb-2 text-[10px] flex-wrap" style={{color:"var(--text-muted)"}}><span className="flex items-center gap-1"><span style={{width:9,height:9,borderRadius:2,background:"#22c55e",display:"inline-block"}}/>Em movimento</span><span className="flex items-center gap-1"><span style={{width:9,height:9,borderRadius:2,background:"#3b82f6",display:"inline-block"}}/>Parado</span><span className="ml-auto">{Object.keys(posicoesSascar||{}).length} veiculo(s)</span></div><div className="h-[600px] rounded-lg overflow-hidden"><MapaFrota posicoes={posicoesSascar} ordens={ordens.filter(o=>!o.fechamento&&!o.cancelado)} bases={bases}/></div></Card></div>
      </>)}
      {!loading&&tab==="atendimento"&&(<TabAtendimento ordens={ordens} loadData={refresh} updO={updO} canWrite={canWrite} onReport={(x:any)=>{setNotasOpen(x);carregarNotas(x.id);}} onEdit={(x:any)=>setEditO(x)} />)}
      {!loading&&tab==="acompanhamento"&&(<TabAcompanhamento ordens={ordens}/>)}
      {!loading&&tab==="prestadores"&&(<><div className="flex items-center gap-3 mb-4"><div className="relative flex-1 max-w-md"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-soft"/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar..." className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-surface-alt text-text text-sm focus:outline-none focus:ring-2 focus:ring-print-green/30"/></div><span className="text-sm text-text-muted">{prestadores.length} prestadores</span><button onClick={()=>setShowP(true)} className="ml-auto px-3 py-2 text-sm font-bold bg-print-green text-white rounded-lg hover:bg-print-green-dark flex items-center gap-2"><Plus className="w-4 h-4"/>Novo Prestador</button></div><div className="overflow-x-auto rounded-xl border border-border"><table className="w-full text-sm"><thead><tr className="bg-surface-alt text-left"><th className="p-3 text-text-muted">Nome</th><th className="p-3 text-text-muted">CNPJ</th><th className="p-3 text-text-muted">Cidade/UF</th><th className="p-3 text-text-muted">Tipo</th><th className="p-3 text-text-muted">Telefone</th><th className="p-3 text-text-muted">Status</th><th className="p-3 text-text-muted">24h</th><th className="p-3 text-text-muted">Fatura</th>{canWrite&&<th className="p-3"></th>}</tr></thead><tbody className="divide-y divide-border">{filtered.map(p=>(<tr key={p.id} className="hover:bg-surface-hover/50 transition-colors"><td className="p-3 font-medium text-text">{p.nome}</td><td className="p-3 text-text-muted">{p.cnpj}</td><td className="p-3 text-text">{p.cidade}/{p.estado}</td><td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TIPO_BADGE[p.tipo_servico]||""}`}>{TIPO_LABELS[p.tipo_servico]||p.tipo_servico}</span></td><td className="p-3 text-text-muted">{p.telefone}</td><td className="p-3 text-text">{p.socorro_24h?"✅":"—"}</td><td className="p-3"><span className={`inline-flex items-center gap-1.5 text-xs font-medium ${p.status==="em_atendimento"?"text-orange-500":p.status==="a_caminho"?"text-blue-500":p.status==="indisponivel"?"text-zinc-400":"text-emerald-500"}`}><span className={`w-2 h-2 rounded-full ${p.status==="em_atendimento"?"bg-orange-500":p.status==="a_caminho"?"bg-blue-500":p.status==="indisponivel"?"bg-zinc-400":"bg-emerald-500"}`}/>{p.status==="em_atendimento"?"Em atendimento":p.status==="a_caminho"?"A caminho":p.status==="indisponivel"?"Indisponível":"Disponível"}</span></td><td className="p-3 text-text">{p.fatura?"✅":"—"}</td>{canWrite&&<td className="p-3"><div className="flex gap-1">{canWrite&&<button onClick={()=>setEditP(p)} className="p-1.5 rounded hover:bg-print-green/10 text-print-green" title="Editar"><Pencil className="w-4 h-4"/></button>}<button onClick={()=>{setSelP(p);setShowA(true)}} className="p-1.5 rounded hover:bg-print-green/10 text-print-green" title="Acionar"><Phone className="w-4 h-4"/></button><button onClick={()=>delP(p.id)} className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500"><Trash2 className="w-4 h-4"/></button></div></td>}</tr>))}{filtered.length===0&&<tr><td colSpan={canWrite?9:8} className="p-8 text-center text-text-muted">Nenhum prestador</td></tr>}</tbody></table></div></>)}
      {!loading&&tab==="ocorrencias"&&(<><div className="flex items-center justify-between mb-4"><h2 className="font-heading text-lg font-semibold text-text">Ocorrências</h2><span className="text-xs text-text-muted">{ocorrencias.length} aguardando</span></div>{ocorrencias.length>0?<div className="space-y-3">{ocorrencias.map(oc=>(<div key={oc.id} className="flex items-center gap-4 p-4 rounded-xl border-2 border-red-500 bg-red-500/10 animate-pulse"><AlertTriangle className="w-6 h-6 text-red-500 shrink-0"/><div className="flex-1 min-w-0"><div className="flex items-center gap-3"><span className="font-bold text-red-400">🚛 {oc.placa||"—"}</span><span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-semibold">{oc.tipo==="eletrica"?"Elétrica":oc.tipo==="mecanica"?"Mecânica":"Outro"}</span></div>{oc.descricao&&<p className="text-sm text-text-muted mt-1 truncate">{oc.descricao}</p>}<p className="text-xs text-text-muted mt-0.5">Via WhatsApp {oc.de_whatsapp} · {oc.criado_em?new Date(oc.criado_em).toLocaleTimeString("pt-BR"):""}</p></div>{canWrite&&<button onClick={()=>aceitarOcorrencia(oc.id)} className="px-3 py-2 text-sm font-bold bg-print-green text-white rounded-lg hover:bg-print-green-dark shrink-0">Aceitar</button>}</div>))}</div>:<p className="text-center text-text-muted py-12">Nenhuma ocorrência pendente</p>}</>)}
      {!loading&&tab==="pecas"&&(<PecasKanban/>)}
      {!loading&&tab==="config"&&(<Configuracoes/>)}
      {!loading&&tab==="cancelamentos"&&(<Cancelamentos/>)}
      {!loading&&tab==="bases"&&(<><div className="flex items-center justify-between mb-4"><h2 className="font-heading text-lg font-semibold" style={{color:"var(--text)"}}>Bases</h2><span className="text-xs" style={{color:"var(--text-muted)"}}>{bases.length} cadastrada(s)</span></div><div className="grid grid-cols-1 lg:grid-cols-3 gap-4"><div className="rounded-xl p-4" style={{border:"1px solid var(--border)",background:"var(--bg-card)"}}><div className="text-sm font-bold mb-3" style={{color:"var(--text)"}}>{editBase?"Editar base":"Nova base"}</div><form onSubmit={addBase} className="space-y-2"><label className="block"><span className="text-[10px]" style={{color:"var(--text-muted)"}}>Nome</span><input name="nome" required defaultValue={editBase?.nome||""} key={"bn"+(editBase?.id||"n")} className="mt-0.5 w-full px-2 py-1.5 rounded-lg border text-xs" style={{background:"var(--bg-alt)",borderColor:"var(--border)",color:"var(--text)"}}/></label><label className="block"><span className="text-[10px]" style={{color:"var(--text-muted)"}}>Endereço</span><input name="endereco" defaultValue={editBase?.endereco||""} key={"be"+(editBase?.id||"n")} className="mt-0.5 w-full px-2 py-1.5 rounded-lg border text-xs" style={{background:"var(--bg-alt)",borderColor:"var(--border)",color:"var(--text)"}}/></label><div className="grid grid-cols-2 gap-2"><label className="block"><span className="text-[10px]" style={{color:"var(--text-muted)"}}>Latitude</span><input name="lat" required type="number" step="any" defaultValue={editBase?.lat??""} key={"bl"+(editBase?.id||"n")} className="mt-0.5 w-full px-2 py-1.5 rounded-lg border text-xs" style={{background:"var(--bg-alt)",borderColor:"var(--border)",color:"var(--text)"}}/></label><label className="block"><span className="text-[10px]" style={{color:"var(--text-muted)"}}>Longitude</span><input name="lng" required type="number" step="any" defaultValue={editBase?.lng??""} key={"bg"+(editBase?.id||"n")} className="mt-0.5 w-full px-2 py-1.5 rounded-lg border text-xs" style={{background:"var(--bg-alt)",borderColor:"var(--border)",color:"var(--text)"}}/></label></div><div className="flex gap-2 pt-1"><button className="flex-1 py-2 rounded-lg text-xs font-bold cursor-pointer" style={{background:"var(--accent-green)",color:"#fff"}}>{editBase?"Salvar":"Adicionar"}</button>{editBase&&<button type="button" onClick={()=>setEditBase(null)} className="px-3 py-2 rounded-lg text-xs font-bold cursor-pointer" style={{border:"1px solid var(--border)",color:"var(--text-muted)"}}>Cancelar</button>}</div></form></div><div className="lg:col-span-2 rounded-xl border overflow-hidden" style={{borderColor:"var(--border)",background:"var(--bg-card)"}}><table className="w-full text-sm"><thead><tr className="text-left" style={{background:"var(--bg-alt)"}}><th className="p-2 text-[10px]" style={{color:"var(--text-muted)"}}>BASE</th><th className="p-2 text-[10px]" style={{color:"var(--text-muted)"}}>ENDEREÇO</th><th className="p-2 text-[10px]" style={{color:"var(--text-muted)"}}>COORD</th><th className="p-2"></th></tr></thead><tbody>{bases.map((b:any)=>(<tr key={b.id} style={{borderTop:"1px solid var(--border)"}}><td className="p-2 font-semibold" style={{color:"var(--text)"}}>{b.nome}</td><td className="p-2 text-[10px]" style={{color:"var(--text-muted)"}}>{b.endereco||"—"}</td><td className="p-2 font-mono text-[10px]" style={{color:"var(--text-muted)"}}>{Number(b.lat).toFixed(3)}, {Number(b.lng).toFixed(3)}</td><td className="p-2 text-right whitespace-nowrap">{canWrite&&<><button onClick={()=>setEditBase(b)} className="px-2 py-1 rounded text-[10px] font-bold mr-1 cursor-pointer" style={{color:"var(--accent-green)",border:"1px solid var(--border-bright)"}}>Editar</button><button onClick={()=>delBase(b.id)} className="px-2 py-1 rounded text-[10px] font-bold cursor-pointer" style={{color:"#c62828",border:"1px solid var(--border-bright)"}}>Excluir</button></>}</td></tr>))}</tbody></table></div></div></>)}
      {!loading&&tab==="ordens"&&(<><div className="flex items-center justify-between mb-4"><h2 className="font-heading text-lg font-semibold text-text">Ordens de Serviço</h2><select value={filtroOrdemStatus} onChange={e=>setFiltroOrdemStatus(e.target.value)} className="px-2 py-1.5 rounded border text-xs" style={{background:"var(--bg-alt)",borderColor:"var(--border)",color:"var(--text)"}}><option value="Aberta">ABERTAS</option><option value="EmAtendimento">EM ATENDIMENTO</option><option value="Finalizada">FECHADAS</option><option value="Cancelada">CANCELADAS</option><option value="todos">TODAS</option></select>{canWrite&&<><button onClick={()=>{setShowO(true);loadVeiculosSascar();loadPosicoesSascar().then(()=>{fetcher("/frota/sincronizar-km",{method:"POST"}).then(()=>{fetcher("/frota/placas").then((fr:any)=>{if(fr?.data)setFrotaPlacas(fr.data);});});});}} className="px-3 py-2 text-sm font-bold bg-print-green text-white rounded-lg hover:bg-print-green-dark flex items-center gap-2"><Plus className="w-4 h-4"/>Nova O.S</button><button onClick={()=>osFileRef.current?.click()} className="px-3 py-2 text-sm font-bold border border-border text-text-muted rounded-lg hover:bg-surface-hover flex items-center gap-2"><Upload className="w-4 h-4"/>Importar O.S.</button><input ref={osFileRef} type="file" accept=".xlsx,.csv" className="hidden" onChange={doImportOS}/></>}</div><div className="overflow-x-auto rounded-xl border border-border"><table className="w-full text-sm"><thead><tr className="bg-surface-alt text-left"><th className="p-3 text-text-muted">O.S</th><th className="p-3 text-text-muted">Data</th><th className="p-3 text-text-muted">Placa</th><th className="p-3 text-text-muted">Modelo</th><th className="p-3 text-text-muted">Marca</th><th className="p-3 text-text-muted">Motorista</th><th className="p-3 text-text-muted">Serviço</th><th className="p-3 text-text-muted">Prestador</th><th className="p-3 text-text-muted">Prioridade</th><th className="p-3 text-text-muted">Valor</th><th className="p-3 text-text-muted">Andamento</th><th className="p-3 text-text-muted">Criado por</th><th className="p-3"></th></tr></thead><tbody className="divide-y divide-border">{ordens.filter(o=>{const st=o.status||""; if(filtroOrdemStatus==="todos") return true; if(filtroOrdemStatus==="Liberada") return st==="Liberado"||st==="Veículo liberado"; if(filtroOrdemStatus==="Finalizada") return !!o.fechamento; if(filtroOrdemStatus==="Cancelada") return o.cancelado||st==="Cancelada"; if(filtroOrdemStatus==="Chegou") return st==="Prestador no local"; if(filtroOrdemStatus==="EmAtendimento") return ["Prestador a caminho","Prestador no local","Serviço em execução"].includes(st); if(filtroOrdemStatus==="Aberta") return !o.fechamento&&!o.cancelado; return true;}).map(o=>(<tr key={o.id} className="hover:bg-surface-hover/50"><td className="p-3 font-bold text-print-green">{o.os}</td><td className="p-3 text-text whitespace-nowrap">{fmtData(o.data)}</td><td className="p-3 font-semibold text-text">{o.placa||"—"}</td><td className="p-3 text-text">{o.modelo||"—"}</td><td className="p-3 text-text">{o.marca||"—"}</td><td className="p-3 text-text">{o.motorista||"—"}</td><td className="p-3 text-text">{o.servico_realizado||TIPO_LBL[o.tipo_servico]||o.tipo_servico||"—"}</td><td className="p-3 text-text-muted">{o.prestador_nome||"—"}</td><td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${o.prioridade==="Urgente"?"bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300":o.prioridade==="Alta"?"bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300":"bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"}`}>{o.prioridade||"Normal"}</span></td><td className="p-3 font-semibold text-text whitespace-nowrap">{BRL(o.valor)}</td><td className="p-3"><select value={o.status||"Aguardando"} onChange={e=>updO(o.id,"status",e.target.value)} className="px-2 py-1 rounded border border-border bg-surface-alt text-text text-xs"><option value="Aguardando">Aguardando</option><option value="Prestador localizado">Prestador localizado</option><option value="Prestador a caminho">Prestador a caminho</option><option value="Prestador no local">Prestador no local</option><option value="Serviço em execução">Serviço em execução</option><option value="Veículo liberado">Veículo liberado</option><option value="Rebocado">Rebocado</option></select></td><td className="p-3 text-text-muted">{o.criado_por||"—"}{o.atualizado_por&&o.atualizado_por!==o.criado_por&&<div className="text-[9px]" style={{color:"var(--text-muted)"}}>↻ {o.atualizado_por}</div>}</td><td className="p-3"><div className="flex gap-1"><button onClick={()=>{setNotasOpen(o); carregarNotas(o.id);}} className="px-1.5 py-1 rounded text-[10px] font-bold border cursor-pointer" style={{borderColor:"var(--border-bright)",color:"var(--text-muted)"}} title="Report / bloco de notas">Report</button>{canManage&&<button onClick={async()=>{if(!confirm("Excluir a O.S. "+(o.os||"")+"? Esta acao nao pode ser desfeita."))return;await fetcher("/ordens/"+o.id,{method:"DELETE"});loadData();}} className="px-2 py-1 rounded text-[10px] font-bold cursor-pointer" style={{border:"1px solid #C62828",color:"#C62828"}}>Excluir</button>}<button onClick={()=>setEditO(o)} className="p-1.5 rounded hover:bg-print-green/10 text-print-green" title="Editar"><Pencil className="w-4 h-4"/></button>{!o.fechamento&&!o.cancelado&&<button onClick={()=>setCloseO(o)} className="p-1.5 rounded hover:bg-print-green/15 text-print-green" title="Liberar / Fechar"><CheckCircle2 className="w-4 h-4"/></button>}{canManage&&!o.cancelado&&<button onClick={()=>setCancelO(o)} className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500" title="Excluir O.S."><Ban className="w-4 h-4"/></button>}</div></td></tr>))}{ordens.length===0&&<tr><td colSpan={13} className="p-8 text-center text-text-muted">Nenhuma O.S registrada</td></tr>}</tbody></table></div></>)}
      {!loading&&tab==="usuarios"&&canManage&&(<>
        <div className="flex items-center justify-between mb-4"><h2 className="font-heading text-lg font-semibold text-text">Usuários do Painel</h2><button onClick={()=>setShowUser(true)} className="px-3 py-2 text-sm font-bold bg-print-green text-white rounded-lg hover:bg-print-green-dark flex items-center gap-2"><UserPlus className="w-4 h-4"/>Novo Usuário</button></div>
        <div className="overflow-x-auto rounded-xl border border-border"><table className="w-full text-sm"><thead><tr className="bg-surface-alt text-left"><th className="p-3 text-text-muted">Nome</th><th className="p-3 text-text-muted">Email</th><th className="p-3 text-text-muted">Situação</th><th className="p-3 text-text-muted">Nível de Acesso</th><th className="p-3"></th></tr></thead><tbody className="divide-y divide-border">{usuarios.map(u=>{const pend=u.status==="pendente";return(<tr key={u.id} className={pend?"bg-accent-yellow/10":"hover:bg-surface-hover/50"}><td className="p-3 font-medium text-text">{u.nome||"—"}</td><td className="p-3 text-text-muted">{u.email}</td><td className="p-3">{pend?<span className="px-2 py-0.5 rounded-full text-xs font-bold bg-accent-yellow/20 text-accent-yellow">PENDENTE</span>:u.status==="sem_senha"?<span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{background:"rgba(234,179,8,0.18)",color:"#eab308"}} title="Clique em Editar (lápis) e defina a senha para liberar o acesso">Sem senha</span>:<span className="px-2 py-0.5 rounded-full text-xs font-medium bg-print-green/15 text-print-green">Ativo</span>}</td><td className="p-3">{pend?<select className="px-2 py-1 rounded border border-accent-yellow/50 bg-surface-alt text-text text-xs" onChange={e=>aprovarUser(u.id,e.target.value)} defaultValue=""><option value="" disabled>Escolher nível…</option><option value="operador">Operador (consulta)</option><option value="gerente">Gerente (edita)</option><option value="admin">Admin (total)</option></select>:<select value={u.role} onChange={e=>setRole(u.id,e.target.value)} className="px-2 py-1 rounded border border-border bg-surface-alt text-text text-xs"><option value="operador">Operador (consulta)</option><option value="gerente">Gerente (edita)</option><option value="admin">Admin (total)</option></select>}</td><td className="p-3"><div className="flex gap-1"><button onClick={()=>setEditU(u)} className="p-1.5 rounded hover:bg-print-green/10 text-print-green" title="Editar"><Pencil className="w-4 h-4"/></button><button onClick={()=>delUser(u.id)} className="p-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500" title="Remover"><Trash2 className="w-4 h-4"/></button></div></td></tr>);})}</tbody></table></div>
      </>)}
      {!loading&&tab==="log"&&(<>
        <div className="flex items-center justify-between mb-4"><h2 className="font-heading text-lg font-semibold text-text">Log de Operação</h2><span className="text-sm text-text-muted">{log.length} eventos</span></div>
        <div className="overflow-x-auto rounded-xl border border-border"><table className="w-full text-sm"><thead><tr className="bg-surface-alt text-left"><th className="p-3 text-text-muted">Data/Hora</th><th className="p-3 text-text-muted">Evento</th><th className="p-3 text-text-muted">O.S.</th><th className="p-3 text-text-muted">Detalhe</th><th className="p-3 text-text-muted">Por</th></tr></thead><tbody className="divide-y divide-border">{log.map((e,i)=>{const isAlert=e.evento==="SLA_ALERTA_60MIN";return(<tr key={e.id||i} className={isAlert?"bg-red-500/5":"hover:bg-surface-hover/50"}><td className="p-3 text-text-muted whitespace-nowrap">{e.created_at?new Date(e.created_at).toLocaleString("pt-BR",{timeZone:"America/Sao_Paulo"}):"—"}</td><td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isAlert?"bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300":"bg-print-green/10 text-print-green"}`}>{e.evento}</span></td><td className="p-3 font-bold text-print-green">{e.os||"—"}</td><td className="p-3 text-text">{e.detalhe}</td><td className="p-3 text-text-muted">{e.quem}</td></tr>);})}{log.length===0&&<tr><td colSpan={5} className="p-8 text-center text-text-muted">Nenhum evento registrado</td></tr>}</tbody></table></div>
      </>)}
    </main>
    </div>
    <Modal open={showP} close={()=>setShowP(false)} title="Novo Prestador"><form onSubmit={addP} className="space-y-4"><Inp n="nome" l="Nome" r/><Inp n="cnpj" l="CNPJ"/><div className="grid grid-cols-2 gap-3"><Inp n="cidade" l="Cidade"/><Inp n="estado" l="UF" m={2}/></div><Sel n="tipo_servico" l="Tipo" o={[{v:"mecanico",l:"Mecânico"},{v:"eletrico",l:"Elétrico"},{v:"eletronica",l:"Eletrônica"},{v:"eletrica_mecanica",l:"Elétrica/Mecânica"},{v:"borracharia",l:"Borracharia"},{v:"guincho",l:"Guincho"},{v:"funilaria",l:"Funilaria"},{v:"bau",l:"Baú"}]}/><Inp n="telefone" l="Telefone"/><div className="flex gap-6"><label className="flex items-center gap-2 text-sm text-text"><input type="checkbox" name="socorro_24h" className="rounded"/>Socorro 24h</label><label className="flex items-center gap-2 text-sm text-text"><input type="checkbox" name="fatura" className="rounded"/>Fatura</label></div><button className="w-full py-2.5 bg-print-green text-white font-bold rounded-lg hover:bg-print-green-dark transition-colors">Cadastrar</button></form></Modal>
    <Modal open={!!editP} close={()=>setEditP(null)} title={`Editar Prestador`}><form onSubmit={saveEditP} className="space-y-4"><Inp n="nome" l="Nome" r v={editP?.nome}/><Inp n="cnpj" l="CNPJ" v={editP?.cnpj}/><div className="grid grid-cols-2 gap-3"><Inp n="cidade" l="Cidade" v={editP?.cidade}/><Inp n="estado" l="UF" m={2} v={editP?.estado}/></div><Sel n="tipo_servico" l="Tipo" o={[{v:"mecanico",l:"Mecânico"},{v:"eletrico",l:"Elétrico"},{v:"eletronica",l:"Eletrônica"},{v:"eletrica_mecanica",l:"Elétrica/Mecânica"},{v:"borracharia",l:"Borracharia"},{v:"guincho",l:"Guincho"},{v:"funilaria",l:"Funilaria"},{v:"bau",l:"Baú"}]} v={editP?.tipo_servico}/><Inp n="telefone" l="Telefone" v={editP?.telefone}/><div className="flex gap-6"><label className="flex items-center gap-2 text-sm text-text"><input type="checkbox" name="socorro_24h" className="rounded" defaultChecked={editP?.socorro_24h}/>Socorro 24h</label><label className="flex items-center gap-2 text-sm text-text"><input type="checkbox" name="fatura" className="rounded" defaultChecked={editP?.fatura}/>Fatura</label></div><button className="w-full py-2.5 bg-print-green text-white font-bold rounded-lg hover:bg-print-green-dark transition-colors">Salvar Alterações</button></form></Modal>
<ReportModal ordem={notasOpen} onClose={()=>setNotasOpen(null)} />
    <Modal open={showA} close={()=>{setShowA(false);setSelP(null)}} title={`Acionar${selP?` — ${selP.nome}`:""}`}><form onSubmit={addA} className="space-y-4"><input type="hidden" name="prestador_id" value={selP?.id||""}/><Inp n="local" l="Local"/><Sel n="tipo_servico" l="Tipo" o={[{v:"mecanico",l:"Mecânico"},{v:"eletrico",l:"Elétrico"},{v:"eletronica",l:"Eletrônica"},{v:"eletrica_mecanica",l:"Elétrica/Mecânica"},{v:"borracharia",l:"Borracharia"},{v:"guincho",l:"Guincho"},{v:"funilaria",l:"Funilaria"},{v:"bau",l:"Baú"}]}/><Inp n="data" l="Data" t="date"/><Inp n="observacoes" l="Observações"/><button className="w-full py-2.5 bg-print-green text-white font-bold rounded-lg hover:bg-print-green-dark transition-colors">Registrar</button></form></Modal>
    <Modal open={showImport} close={()=>setShowImport(false)} title="Importar Planilha"><div className="text-center py-4 space-y-4"><a href="modelo_cadastro_prestadores.xlsx" download className="inline-flex items-center gap-2 px-6 py-3 border-2 border-print-green text-print-green font-bold rounded-lg hover:bg-print-green/10 cursor-pointer transition-colors"><FileDown className="w-4 h-4"/>Baixar modelo Excel</a><p className="text-sm text-text-muted">Depois de preencher o modelo, selecione o arquivo para importar:</p><label className="inline-flex items-center gap-2 px-6 py-3 bg-print-green text-white font-bold rounded-lg hover:bg-print-green-dark cursor-pointer transition-colors"><Upload className="w-4 h-4"/>Escolher arquivo (.xlsx ou .csv)<input type="file" accept=".csv,.xlsx" className="hidden" onChange={doImport}/></label></div></Modal>
    <Modal open={!!editU} close={()=>setEditU(null)} title="Editar Usuário"><form onSubmit={saveEditUser} className="space-y-3"><Inp n="nome" l="Nome" r v={editU?.nome}/><Inp n="email" l="Email (login)" t="email" r v={editU?.email}/><Inp n="password" l="Nova Senha (deixe vazio p/ manter)" t="password"/><Sel n="role" l="Nível de Acesso" o={[{v:"operador",l:"Operador (consulta)"},{v:"gerente",l:"Gerente (edita)"},{v:"admin",l:"Admin (total)"}]} v={editU?.role}/><button className="w-full py-2.5 bg-print-green text-white font-bold rounded-lg hover:bg-print-green-dark transition-colors">Salvar Alterações</button></form></Modal>
    <Modal open={showUser} close={()=>setShowUser(false)} title="Novo Usuário"><form onSubmit={addUser} className="space-y-4"><Inp n="nome" l="Nome" r/><Inp n="email" l="Email" t="email" r/><Inp n="password" l="Senha" t="password" r/><Sel n="role" l="Nível de Acesso" o={[{v:"operador",l:"Operador (consulta)"},{v:"gerente",l:"Gerente (edita)"},{v:"admin",l:"Admin (total)"}]}/><button className="w-full py-2.5 bg-print-green text-white font-bold rounded-lg hover:bg-print-green-dark transition-colors">Criar Usuário</button></form></Modal>
    <div className={showO?"fixed inset-0 z-50 flex items-center justify-center p-4":"hidden"}><div className="absolute inset-0 bg-black/50" onClick={()=>{setShowO(false);setMoreDet(false);}}/><div className="relative z-10 rounded-2xl w-full max-w-3xl p-6 shadow-2xl max-h-[92vh] overflow-y-auto" style={{background:"var(--bg-card)",border:"1px solid var(--border-bright)"}}><div className="flex items-center justify-between mb-4"><div><div className="text-[9px] uppercase tracking-wider" style={{color:"var(--text-muted)"}}>Nova Ordem de Serviço</div><h2 className="text-sm font-bold" style={{color:"var(--text)"}}>{(new Date().getHours()<12?"Bom dia":new Date().getHours()<18?"Boa tarde":"Boa noite")}{user&&user.nome?", "+String(user.nome).split(" ")[0]:""}.</h2></div><button onClick={()=>{setShowO(false);setMoreDet(false);}} className="p-1 rounded cursor-pointer" style={{color:"var(--text-muted)"}}><X className="w-4 h-4"/></button></div><form onSubmit={addO} className="space-y-3">
<div className="flex items-center gap-2">
  <button type="button" onClick={()=>setCarga("carregado")} className="flex-1 py-2 rounded-lg text-[11px] font-bold cursor-pointer" style={{background:carga==="carregado"?"rgba(229,57,53,.15)":"var(--bg-alt)",border:"1.5px solid "+(carga==="carregado"?"#E53935":"var(--border)"),color:carga==="carregado"?"#E53935":"var(--text-muted)"}}>CARREGADO</button>
  <button type="button" onClick={()=>setCarga("vazio")} className="flex-1 py-2 rounded-lg text-[11px] font-bold cursor-pointer" style={{background:carga==="vazio"?"rgba(37,214,71,.15)":"var(--bg-alt)",border:"1.5px solid "+(carga==="vazio"?"#25D647":"var(--border)"),color:carga==="vazio"?"#25D647":"var(--text-muted)"}}>VAZIO</button>
</div>
<div>
  <label className="text-[9px] font-bold uppercase tracking-wider" style={{color:"var(--text-muted)"}}>Nº da O.S. <span style={{background:"rgba(37,214,71,.15)",color:"#146E1F",padding:"1px 6px",borderRadius:99,fontSize:7,marginLeft:4}}>EDITÁVEL</span></label>
  <div className="flex gap-2 mt-1">
    <input name="os" placeholder="000012" className="flex-1 px-3 py-2 rounded-lg text-sm" style={{background:"var(--bg-alt)",border:"1px solid var(--border)",color:"var(--text)"}}/>
    <button type="button" onClick={()=>{const el=document.querySelector('input[name="os"]') as HTMLInputElement; if(el){el.value=String(Date.now()).slice(-6);} }} className="px-4 rounded-lg text-[11px] font-bold cursor-pointer" style={{background:"var(--bg-alt)",border:"1px solid var(--border-bright)",color:"var(--text)"}}>Usar próximo</button>
  </div>
  <div className="text-[9px] mt-1" style={{color:"var(--text-soft)"}}>Digite qualquer número · se deixar vazio, o sistema gera o próximo</div>
</div>
<div className="grid grid-cols-2 gap-3">
  <div>
    <label className="text-[9px] font-bold uppercase tracking-wider" style={{color:"var(--text-muted)"}}>Placa <span style={{background:"rgba(30,136,229,.15)",color:"#1E88E5",padding:"1px 6px",borderRadius:99,fontSize:7,marginLeft:4}}>SASCAR</span></label>
    <input name="placa" required value={placaNova} onChange={e=>{const v=e.target.value.toUpperCase();setPlacaNova(v);preencherPorPlaca(v);const fv=frotaPlacas.find((f:any)=>String(f.placa).toUpperCase().replace(/-\d+$/,"")===v.trim().toUpperCase().replace(/-\d+$/,""));if(fv){const pos:any=(posicoesSascar||{})[v.trim().toUpperCase()];setAutofill((prev:any)=>({...(prev||{}),filial:fv.filial,modelo:fv.modelo||"",marca:fv.marca||"",tipo:fv.tipo?String(fv.tipo).toLowerCase():(prev&&prev.tipo)||"",km:pos&&pos.odometro?String(pos.odometro):(fv.km_ultimo?String(fv.km_ultimo):((prev&&prev.km)||""))}));}}} className="mt-1 w-full px-3 py-2 rounded-lg text-sm" style={{background:"var(--bg-alt)",border:"1px solid var(--border)",color:"var(--text)"}}/>
    <div className="mt-1 rounded-lg border overflow-y-auto" style={{borderColor:"var(--border)",background:"var(--bg-alt)",maxHeight:120}}>
      {frotaPlacas.map((f:any)=>String(f.placa)).filter((pl:string)=>pl.includes((placaNova||"").trim().toUpperCase())).slice(0,((placaNova||"").trim().length>=2?8:0)).map((pl:string)=>(<div key={pl} onClick={()=>{const fv:any=frotaPlacas.find((f:any)=>String(f.placa)===pl);const pos:any=(posicoesSascar||{})[pl]||{};setPlacaNova(pl);setAutofill({filial:fv?fv.filial:"",modelo:fv?fv.modelo:"",marca:fv?fv.marca:"",tipo:fv&&fv.tipo?String(fv.tipo).toLowerCase():"",km:pos.odometro?String(pos.odometro):(fv&&fv.km_ultimo?String(fv.km_ultimo):"")});}} className="px-3 py-1.5 text-[11px] cursor-pointer flex justify-between" style={{color:"var(--text)",borderBottom:"1px solid var(--border)"}}><span className="font-mono font-bold">{pl}</span><span style={{color:"var(--text-muted)"}}>{(()=>{const fv:any=frotaPlacas.find((f:any)=>String(f.placa)===pl);const pos:any=(posicoesSascar||{})[pl]||{};const km=pos.odometro||(fv&&fv.km_ultimo);return km?Number(km).toLocaleString("pt-BR")+" km":"sem km";})()}</span></div>))}
    </div>
    <div className="text-[9px] mt-1" style={{color:"var(--text-soft)"}}>Lista das placas da frota</div>
  </div>
  <div>
    <label className="text-[9px] font-bold uppercase tracking-wider" style={{color:"var(--text-muted)"}}>KM atual <span style={{background:"rgba(245,179,1,.18)",color:"#B8860B",padding:"1px 6px",borderRadius:99,fontSize:7,marginLeft:4}}>TRAVADO</span></label>
    <input key={"km"+placaNova} name="km" readOnly value={autofill?.km||""} className="mt-1 w-full px-3 py-2 rounded-lg text-sm font-mono" style={{background:"var(--bg-alt)",border:"1px solid var(--border)",color:"var(--text)"}}/>
    <div className="text-[9px] mt-1" style={{color:"var(--text-soft)"}}>Odômetro da última posição</div>
  </div>
</div>
<DefeitoPicker />
<div><label className="text-[9px] font-bold uppercase tracking-wider" style={{color:"var(--text-muted)"}}>Valor orçado (R$) <span style={{background:"rgba(30,136,229,.15)",color:"#1E88E5",padding:"1px 6px",borderRadius:99,fontSize:7,marginLeft:4}}>OPCIONAL</span></label><input name="valor_orcado" type="number" step="0.01" min="0" placeholder="0,00" className="mt-1 w-full px-3 py-2 rounded-lg text-sm" style={{background:"var(--bg-alt)",border:"1px solid var(--border)",color:"var(--text)"}}/></div>
<div className="grid grid-cols-2 gap-3">
  <div>
    <label className="text-[9px] font-bold uppercase tracking-wider" style={{color:"var(--text-muted)"}}>Modelo <span style={{background:"rgba(120,120,120,.15)",color:"var(--text-muted)",padding:"1px 6px",borderRadius:99,fontSize:7,marginLeft:4}}>AUTOMÁTICO</span></label>
    <input key={"mod"+placaNova} name="modelo" defaultValue={autofill?.modelo||""} className="mt-1 w-full px-3 py-2 rounded-lg text-sm" style={{background:"var(--bg-alt)",border:"1px dashed var(--border-bright)",color:"var(--text)"}}/>
  </div>
  <div>
    <label className="text-[9px] font-bold uppercase tracking-wider" style={{color:"var(--text-muted)"}}>Marca <span style={{background:"rgba(120,120,120,.15)",color:"var(--text-muted)",padding:"1px 6px",borderRadius:99,fontSize:7,marginLeft:4}}>AUTOMÁTICO</span></label>
    <input key={"mar"+placaNova} name="marca" defaultValue={autofill?.marca||""} className="mt-1 w-full px-3 py-2 rounded-lg text-sm" style={{background:"var(--bg-alt)",border:"1px dashed var(--border-bright)",color:"var(--text)"}}/>
  </div>
</div>
<div className="grid grid-cols-2 gap-3">
  <div>
    <label className="text-[9px] font-bold uppercase tracking-wider" style={{color:"var(--text-muted)"}}>Filial <span style={{background:"rgba(120,120,120,.15)",color:"var(--text-muted)",padding:"1px 6px",borderRadius:99,fontSize:7,marginLeft:4}}>AUTOMÁTICO</span></label>
    <input key={"fil"+placaNova} name="operacao" defaultValue={autofill?.filial||""} className="mt-1 w-full px-3 py-2 rounded-lg text-sm" style={{background:"var(--bg-alt)",border:"1px dashed var(--border-bright)",color:"var(--text)"}}/>
    <div className="text-[9px] mt-1" style={{color:"var(--text-soft)"}}>Vem do cadastro da placa</div>
  </div>
  <div>
    <label className="text-[9px] font-bold uppercase tracking-wider" style={{color:"var(--text-muted)"}}>Motorista</label>
    <input name="motorista" className="mt-1 w-full px-3 py-2 rounded-lg text-sm" style={{background:"var(--bg-alt)",border:"1px solid var(--border)",color:"var(--text)"}}/>
  </div>
</div>
<div>
  <label className="text-[9px] font-bold uppercase tracking-wider" style={{color:"var(--text-muted)"}}>Telefone</label>
  <input name="telefone" className="mt-1 w-full px-3 py-2 rounded-lg text-sm" style={{background:"var(--bg-alt)",border:"1px solid var(--border)",color:"var(--text)"}}/>
</div>
<div>
  <label className="text-[9px] font-bold uppercase tracking-wider" style={{color:"var(--text-muted)"}}>Descrição do problema</label>
  <input name="descricao" className="mt-1 w-full px-3 py-2 rounded-lg text-sm" style={{background:"var(--bg-alt)",border:"1px solid var(--border)",color:"var(--text)"}}/>
</div>
<div className="grid grid-cols-2 gap-3">
  <div>
    <label className="text-[9px] font-bold uppercase tracking-wider" style={{color:"var(--text-muted)"}}>Prestador</label>
    <select name="prestador_id" defaultValue={prestadorSugerido} className="mt-1 w-full px-3 py-2 rounded-lg text-sm" style={{background:"var(--bg-alt)",border:"1px solid var(--border)",color:"var(--text)"}}><option value="">Selecionar...</option>{prestadores.map(pr=><option key={pr.id} value={pr.id}>{pr.nome}</option>)}</select>
  </div>
  <div>
    <label className="text-[9px] font-bold uppercase tracking-wider" style={{color:"var(--text-muted)"}}>Valor estimado</label>
    <input name="valor" type="number" step="0.01" className="mt-1 w-full px-3 py-2 rounded-lg text-sm" style={{background:"var(--bg-alt)",border:"1px solid var(--border)",color:"var(--text)"}}/>
  </div>
</div>
<input type="hidden" name="tipo_servico" value="mecanico"/>
<input type="hidden" name="segmento" value="privado"/>
<input type="hidden" name="prioridade" value="Normal"/>
<input type="hidden" name="tipo_veiculo" value={autofill?.tipo||""}/>
{!carga&&<div className="text-[10px] text-center font-bold" style={{color:"#C62828"}}>Informe se o veículo está CARREGADO ou VAZIO</div>}
<div className="flex justify-end gap-2 pt-2">
  <button type="button" onClick={()=>{setShowO(false);setMoreDet(false);}} className="px-5 py-2.5 rounded-lg text-xs font-bold cursor-pointer" style={{background:"var(--bg-alt)",border:"1px solid var(--border)",color:"var(--text)"}}>Cancelar</button>
  <button disabled={savingO||!carga} className="px-6 py-2.5 rounded-lg text-xs font-bold cursor-pointer" style={{background:(savingO||!carga)?"var(--bg-alt)":"var(--accent-green)",color:(savingO||!carga)?"var(--text-muted)":"#fff"}}>{savingO?"Criando...":"Criar O.S."}</button>
</div>
</form></div></div>
    <Modal open={!!editO} close={()=>{setEditO(null);setEditCarga("");setMaisDetEdit(false);}} title={`✓ Editar O.S. ${editO?.os||""}`} wide><form onSubmit={saveEditO} className="space-y-3"><div className="grid grid-cols-2 gap-2 p-1.5 rounded-lg" style={{background:"var(--bg-alt)",border:"1px solid var(--border)"}}><div onClick={()=>setEditCarga("carregado")} className="flex flex-col items-center justify-center py-2.5 rounded cursor-pointer" style={{border:"1.5px solid",borderColor:(editCarga||editO?.carga)==="carregado"?"#ef4444":"var(--border)",background:(editCarga||editO?.carga)==="carregado"?"rgba(239,68,68,0.15)":"transparent"}}><span className="text-sm font-bold" style={{color:(editCarga||editO?.carga)==="carregado"?"#ef4444":"var(--text-muted)"}}>CARREGADO</span>{(editCarga||editO?.carga)==="carregado"&&<span className="text-[9px]" style={{color:"#ef4444"}}>⚠ carga</span>}</div><div onClick={()=>setEditCarga("vazio")} className="flex items-center justify-center py-2.5 rounded cursor-pointer" style={{border:"1.5px solid",borderColor:(editCarga||editO?.carga)==="vazio"?"#16a34a":"var(--border)",background:(editCarga||editO?.carga)==="vazio"?"rgba(34,197,94,0.15)":"transparent"}}><span className="text-sm font-bold" style={{color:(editCarga||editO?.carga)==="vazio"?"#16a34a":"var(--text-muted)"}}>VAZIO</span></div></div>{(editCarga||editO?.carga)&&<input type="hidden" name="carga" value={editCarga||editO?.carga||""}/>}<div className="grid grid-cols-2 gap-2"><Sel n="forma_pagamento" l="Pagamento" o={[{v:"a_vista",l:"À Vista"},{v:"faturado",l:"Faturado"}]} v={editO?.forma_pagamento||""}/><Inp n="placa" l="Placa" r v={editO?.placa}/></div><div className="grid grid-cols-2 gap-2"><Sel n="tipo_servico" l="Tipo" o={[{v:"mecanico",l:"Mecânico"},{v:"eletrico",l:"Elétrico"},{v:"eletronica",l:"Eletrônica"},{v:"eletrica_mecanica",l:"Elétrica/Mecânica"},{v:"borracharia",l:"Borracharia"},{v:"guincho",l:"Guincho"},{v:"funilaria",l:"Funilaria"},{v:"bau",l:"Baú"}]} v={editO?.tipo_servico}/><Sel n="segmento" l="Segmento" o={[{v:"privado",l:"Privado"},{v:"correios",l:"Correios"}]} v={editO?.segmento||"privado"}/></div><div className="grid grid-cols-2 gap-2"><Sel n="prioridade" l="Prioridade" o={[{v:"Normal",l:"Normal"},{v:"Alta",l:"Alta"},{v:"Urgente",l:"Urgente"}]} v={editO?.prioridade||"Normal"}/><Sel n="operacao" l="Filial" o={FILIAIS.map(f=>({v:f,l:f}))} v={editO?.operacao}/></div><button type="button" onClick={()=>setMaisDetEdit(v=>!v)} className="text-sm cursor-pointer w-full text-center py-1" style={{color:"var(--accent-green)"}}>{maisDetEdit?"▲ Menos campos":"▼ Mais campos"}</button>{maisDetEdit&&<div className="space-y-2 pt-2" style={{borderTop:"1px solid var(--border)"}}><Inp n="os" l="Nº da O.S." r v={editO?.os}/><div className="grid grid-cols-2 gap-2"><Inp n="motorista" l="Motorista" v={editO?.motorista}/><Inp n="telefone" l="Telefone" v={editO?.telefone}/></div><div className="grid grid-cols-2 gap-2"><Inp n="modelo" l="Modelo" v={editO?.modelo}/><Sel n="marca" l="Marca" o={MARCAS.map(m=>({v:m,l:m}))} v={editO?.marca}/></div><div className="grid grid-cols-2 gap-2"><Inp n="rodovia" l="Rodovia" v={editO?.rodovia}/><Inp n="km" l="KM" v={editO?.km}/></div><Sel n="tipo_veiculo" l="Tipo de veículo" o={TIPOS_VEICULO} v={editO?.tipo_veiculo}/><Sel n="prestador_id" l="Prestador" o={prestadores.map(p=>({v:p.id,l:p.nome}))} v={editO?.prestador_id}/><div className="grid grid-cols-2 gap-2"><Inp n="valor_orcado" l="Valor orçado (R$)" t="number" v={editO?.valor_orcado!=null?String(editO.valor_orcado):""}/><Inp n="valor" l="Valor (R$)" t="number" v={editO?.valor!=null?String(editO.valor):""}/><Inp n="data" l="Data" t="date" v={editO?.data}/></div><Inp n="operador" l="Operador" v={editO?.operador}/><Inp n="observacoes" l="Observações" v={editO?.observacoes}/></div>}<div className="grid grid-cols-2 gap-2 pt-2"><button type="button" onClick={()=>{setEditO(null);setEditCarga("");setMaisDetEdit(false);}} className="py-2.5 rounded-lg font-bold cursor-pointer" style={{background:"var(--bg-alt)",color:"var(--text)",border:"1px solid var(--border)"}}>Cancelar</button><button className="py-2.5 rounded-lg font-bold cursor-pointer" style={{background:"var(--accent-green)",color:"#fff"}}>Salvar Alterações</button></div></form></Modal>
    <Modal open={!!closeO} close={()=>setCloseO(null)} title={`Fechar Socorro — ${closeO?.os||""}`}><form onSubmit={closeSocorro} className="space-y-4"><div className="rounded-lg bg-surface-hover/50 p-3 text-sm"><div className="flex justify-between py-1"><span className="text-text-muted">Placa</span><span className="font-semibold">{closeO?.placa||"—"}</span></div><div className="flex justify-between py-1"><span className="text-text-muted">Ao finalizar, o sistema calcula:</span></div><div className="flex justify-between py-1"><span className="text-text-muted">Tempo abertura → fechamento</span><span className="font-mono text-print-green">{closeO?.abertura?<TempoEmAberto abertura={closeO.abertura}/>:"—"}</span></div></div><div className="space-y-2"><span className="text-xs font-medium text-text-muted block">Resultado</span><label className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-surface-hover"><input type="radio" name="resultado" value="Liberado" defaultChecked className="accent-print-green"/><span className="text-sm font-medium">Veículo Liberado</span></label><label className="flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-surface-hover"><input type="radio" name="resultado" value="Rebocado" className="accent-orange-500"/><span className="text-sm font-medium">Veículo Rebocado</span></label></div><div className="space-y-2"><span className="text-xs font-medium text-text-muted block">Execução</span><div className="flex flex-wrap gap-2">{["Conferiu","Trocou","Regulou","Apertou","Sem falha"].map((x,ix)=>(<label key={x} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border cursor-pointer hover:bg-surface-hover text-sm"><input type="radio" name="execucao" value={x} required defaultChecked={closeO?.execucao===x} className="accent-print-green"/>{x}</label>))}</div></div><Ta n="servico_realizado" l="Serviço Realizado" v={closeO?.servico_realizado}/><Sel n="prestador_id" l="Prestador" o={prestadores.map(p=>({v:p.id,l:p.nome}))} v={closeO?.prestador_id}/><Inp n="valor_orcado" l="Valor orçado (R$)" t="number" v={closeO?.valor_orcado!=null?String(closeO.valor_orcado):""}/><Inp n="valor" l="Valor Final (R$)" t="number" v={closeO?.valor!=null?String(closeO.valor):""}/><Ta n="observacoes" l="Observação" v={closeO?.observacoes}/><button className="w-full py-2.5 bg-print-green text-white font-bold rounded-lg hover:bg-print-green-dark transition-colors">Finalizar Socorro</button></form></Modal>
    <Modal open={!!viewO} close={()=>setViewO(null)} title={`SOS ${viewO?.os||""}`}><div className="space-y-4"><div className="rounded-lg bg-surface-hover/50 p-3 text-sm"><div className="flex justify-between py-1"><span className="text-text-muted">Placa</span><span className="font-semibold">{viewO?.placa||"—"}</span></div><div className="flex justify-between py-1"><span className="text-text-muted">Motorista</span><span className="font-semibold">{viewO?.motorista||"—"}</span></div><div className="flex justify-between py-1"><span className="text-text-muted">Telefone</span><span className="font-semibold">{viewO?.telefone||"—"}</span></div><div className="flex justify-between py-1"><span className="text-text-muted">Localização</span><span className="font-semibold">{viewO?.localizacao||"—"}</span></div><div className="flex justify-between py-1"><span className="text-text-muted">Rodovia / KM</span><span className="font-semibold">{viewO?.rodovia||"—"} {viewO?.km?"· Km "+viewO.km:""}</span></div><div className="flex justify-between py-1"><span className="text-text-muted">Prioridade</span><span className="font-semibold">{viewO?.prioridade||"Normal"}</span></div><div className="flex justify-between py-1"><span className="text-text-muted">Prestador</span><span className="font-semibold">{viewO?.prestador_nome||"—"}</span></div></div><div className="text-center py-3"><span className="text-xs text-text-muted block mb-1">Tempo em aberto</span><span className="font-mono text-3xl font-bold text-print-green">{viewO?.abertura?<TempoEmAberto abertura={viewO.abertura}/>:"—"}</span></div>{viewO?.cancelado&&<div className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300"><b>CANCELADA</b> — {viewO?.motivo_cancelamento||""}</div>}<div className="rounded-lg border border-border p-3"><span className="text-xs text-text-muted block mb-2">Histórico</span>{(viewO?.historico&&viewO.historico.length>0)?(<div className="space-y-2">{viewO.historico.map((h,i)=>(<div key={i} className="flex items-start gap-2 text-sm"><span className="font-mono text-xs text-text-muted shrink-0">{new Date(h.hora).toLocaleTimeString("pt-BR")}</span><span className="flex-1">{h.etapa.replace(/_/g," ")}</span></div>))}</div>):<span className="text-sm text-text-muted">Sem histórico</span>}</div></div></Modal>
    <Modal open={!!cancelO} close={()=>setCancelO(null)} title={`Excluir O.S. — ${cancelO?.os||""}`}><form onSubmit={cancelarOrdem} className="space-y-4"><Ta n="motivo" l="Motivo do cancelamento"/><button className="w-full py-2.5 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors">Solicitar Cancelamento</button><p className="text-[10px] text-center" style={{color:"var(--text-muted)"}}>Como administrador, a exclusão é efetivada imediatamente ao confirmar.</p></form></Modal>
  </div>);
}

function SegPanel({titulo, cor, icone, s}:{titulo:string; cor:string; icone:string; s?:SegIndicadores}){const total=s?.total??0;const dentro=s?.dentro_prazo??0;const atraso=s?.atrasadas??0;const aberto=s?.em_aberto??0;const fech=s?.fechadas??0;const circ=2*Math.PI*15.9;const d=fech>0?(dentro/fech)*circ:0;const a=fech>0?(atraso/fech)*circ:0;const ab=fech>0?(aberto/fech)*circ:0;return(<div className="rounded-xl border border-border bg-surface-alt p-4 flex flex-col gap-3"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-7 h-7 rounded-lg grid place-items-center font-heading font-bold text-sm" style={{background:`${cor}22`,color:cor}}>{icone}</span><h3 className="font-heading text-base font-semibold tracking-wide uppercase" style={{color:cor}}>{titulo}</h3></div><span className="text-xs text-text-muted">{total} O.S.</span></div><div className="flex items-center gap-4"><svg viewBox="0 0 36 36" className="w-20 h-20 shrink-0 -rotate-90"><circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--border)" strokeWidth="4"/><circle cx="18" cy="18" r="15.9" fill="none" stroke={cor} strokeWidth="4" strokeDasharray={`${d.toFixed(1)} ${(circ-d).toFixed(1)}`} strokeLinecap="round"/><circle cx="18" cy="18" r="15.9" fill="none" stroke="#fb7b1f" strokeWidth="4" strokeDasharray={`${a.toFixed(1)} ${(circ-a).toFixed(1)}`} strokeDashoffset={-d} strokeLinecap="round"/><circle cx="18" cy="18" r="15.9" fill="none" stroke="#64748b" strokeWidth="4" strokeDasharray={`${ab.toFixed(1)} ${(circ-ab).toFixed(1)}`} strokeDashoffset={-(d+a)} strokeLinecap="round"/></svg><div className="flex-1 flex flex-col gap-1.5 text-xs"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm" style={{background:cor}}/>Dentro do prazo<span className="ml-auto font-mono text-text-muted">{dentro}</span></div><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-orange-500"/>Atrasado<span className="ml-auto font-mono text-text-muted">{atraso}</span></div><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-slate-500"/>Em aberto<span className="ml-auto font-mono text-text-muted">{aberto}</span></div><div className="mt-1 text-center font-mono text-lg font-bold" style={{color:cor}}>{s?.rpm??0}%</div></div></div><div className="border-t border-border pt-2"><p className="text-[10px] uppercase tracking-wider text-text-muted mb-1.5">Mais acionadas</p><div className="flex flex-col gap-1">{(s?.mais_acionadas||[]).slice(0,3).map((p,i)=>(<div key={p.nome} className="flex items-center gap-2 text-xs"><span className="w-4 h-4 rounded text-[10px] grid place-items-center font-bold" style={{background:`${cor}22`,color:cor}}>{i+1}</span><span className="flex-1 truncate text-text">{p.nome}</span><span className="font-mono text-text-muted">{p.count}</span></div>))}{!(s?.mais_acionadas||[]).length&&<span className="text-xs text-text-muted">Sem dados</span>}</div></div><div className="border-t border-border pt-2"><p className="text-[10px] uppercase tracking-wider text-text-muted mb-0.5">Maior custo</p><p className="font-heading text-xl font-bold" style={{color:cor}}>{BRL(s?.maior_custo?.valor)}</p><p className="text-xs text-text-muted truncate">{s?.maior_custo?.nome||"—"}</p></div></div>);}
function StatCard({l,v,I,c}:{l:string;v:number|string;I:any;c:string}){const s=STAT_STYLE[c]||STAT_STYLE["print-green"];return(<div className="rounded-xl border border-border bg-surface-alt p-4 flex items-center gap-3 hover:shadow-md transition-shadow"><div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.bg}`}><I className={`w-5 h-5 ${s.fg}`}/></div><div><p className="text-xs text-text-muted uppercase tracking-wide">{l}</p><p className="text-2xl font-bold font-heading text-text">{v}</p></div></div>);}
function Card({title,sub,children}:{title:string;sub?:string;children:React.ReactNode}){return(<div className="rounded-xl border border-border bg-surface-alt p-5 transition-shadow hover:shadow-md"><div className="flex items-center justify-between mb-4"><h3 className="font-heading text-lg font-semibold text-text">{title}</h3>{sub&&<span className="text-xs bg-print-green/10 text-print-green px-2 py-0.5 rounded-full">{sub}</span>}</div>{children}</div>);}
function Modal({open,close,title,children,wide}:{open:boolean;close:()=>void;title:string;children:React.ReactNode;wide?:boolean}){if(!open)return null;return(<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={close}><div className={`bg-surface rounded-xl border border-border w-full p-6 shadow-2xl ${wide?"max-w-3xl":"max-w-md"}`} onClick={e=>e.stopPropagation()}><div className="flex items-center justify-between mb-4"><h2 className="font-heading text-lg font-semibold text-text">{title}</h2><button onClick={close} className="p-1 rounded hover:bg-surface-hover text-text-muted"><X className="w-5 h-5"/></button></div>{children}</div></div>);}
function Drawer({open,close,title,children}:{open:boolean;close:()=>void;title:string;children:React.ReactNode}){return(<><div className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${open?"opacity-100 pointer-events-auto":"opacity-0 pointer-events-none"}`} onClick={close}/><div className={`fixed top-0 right-0 bottom-0 z-50 flex flex-col transition-transform duration-300 ease-out ${open?"translate-x-0":"translate-x-full"}`} style={{width:"min(420px,94vw)",background:"var(--bg-card)",borderLeft:"1px solid var(--border-bright)",boxShadow:"-4px 0 24px rgba(0,0,0,0.25)"}}><div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{borderBottom:"1px solid var(--border-bright)"}}><h2 className="text-base font-bold" style={{color:"var(--text)",fontFamily:"var(--font-heading)"}}>{title}</h2><button onClick={close} className="p-1.5 rounded-lg hover:opacity-70 cursor-pointer" style={{color:"var(--text-muted)"}}><X className="w-5 h-5"/></button></div><div className="flex-1 overflow-y-auto px-5 py-4">{children}</div></div></>
);}
function Inp({n,l,r,t,m,v}:{n:string;l:string;r?:boolean;t?:string;m?:number;v?:string}){return(<label className="block"><span className="text-xs font-medium text-text-muted">{l}</span><input name={n} type={t||"text"} required={r} maxLength={m} defaultValue={v} className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-surface-alt text-text text-sm focus:outline-none focus:ring-2 focus:ring-print-green/30"/></label>);}
function Sel({n,l,o,v}:{n:string;l:string;o:{v:string;l:string}[];v?:string}){return(<label className="block"><span className="text-xs font-medium text-text-muted">{l}</span><select name={n} defaultValue={v} className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-surface-alt text-text text-sm focus:outline-none focus:ring-2 focus:ring-print-green/30">{o.map(x=><option key={x.v} value={x.v}>{x.l}</option>)}</select></label>);}
function If({s,label,veiculos,ok}:{s:string;label:string;veiculos:{id:string;placa:string;nome:string;modelo?:string;marca?:string}[];ok?:boolean}){if(ok===undefined){return(<label className="block"><span className="text-xs font-medium text-text-muted">{label}</span><select name={s} className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-surface-alt text-text-soft text-sm"><option value="">Carregando veículos…</option></select></label>);}if(ok===false){return(<label className="block"><span className="text-xs font-medium text-text-muted">{label}</span><span className="mt-1 block w-full px-3 py-2 rounded-lg border border-accent-yellow/40 bg-accent-yellow/10 text-accent-yellow text-xs">Sascar: credenciais pendentes — placa manual</span></label>);}return(<label className="block"><span className="text-xs font-medium text-text-muted">{label}</span><select name={s} className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-surface-alt text-text text-sm focus:outline-none focus:ring-2 focus:ring-print-green/30"><option value="">Selecionar veículo…</option>{veiculos.map(v=><option key={v.id} value={v.placa}>{v.placa}{v.nome?` — ${v.nome}`:''}{v.modelo?` ${v.modelo}`:''}</option>)}</select></label>);}
function Sm({n,l,r,t,v}:{n:string;l:string;r?:boolean;t?:string;v?:string}){return(<label className="block"><span className="text-[10px] font-medium" style={{color:"var(--text-muted)"}}>{l}</span><input name={n} type={t||"text"} required={r} defaultValue={v} className="mt-0.5 w-full px-2 py-1.5 rounded-lg border text-xs focus:outline-none" style={{background:"var(--bg-alt)",borderColor:"var(--border)",color:"var(--text)"}}/></label>);}
function SmSel({n,l,o,v}:{n:string;l:string;o:{v:string;l:string}[];v?:string}){return(<label className="block"><span className="text-[10px] font-medium" style={{color:"var(--text-muted)"}}>{l}</span><select name={n} defaultValue={v} className="mt-0.5 w-full px-2 py-1.5 rounded-lg border text-xs focus:outline-none" style={{background:"var(--bg-alt)",borderColor:"var(--border)",color:"var(--text)"}}>{o.map(x=><option key={x.v} value={x.v}>{x.l}</option>)}</select></label>);}
function Ta({n,l,v}:{n:string;l:string;v?:string}){return(<label className="block"><span className="text-xs font-medium text-text-muted">{l}</span><textarea name={n} defaultValue={v} rows={3} className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-surface-alt text-text text-sm focus:outline-none focus:ring-2 focus:ring-print-green/30"/></label>);}
function TempoEmAberto({abertura}:{abertura:string}){const [agora,setAgora]=useState(Date.now());useEffect(()=>{const t=setInterval(()=>setAgora(Date.now()),1000);return()=>clearInterval(t);},[]);const ab=new Date(abertura).getTime();const s=Math.max(0,Math.floor((agora-ab)/1000));if(s<3600)return <span>{Math.floor(s/60)} min</span>;const d=Math.floor(s/86400),h=Math.floor((s%86400)/3600),m=Math.floor((s%3600)/60);if(d>0)return <span>{d}d {h}h</span>;return <span>{h}h {String(m).padStart(2,"0")}min</span>;}
function fmtDuracao(min:number){const m=Math.floor(min);if(m<60)return `${m} min`;const h=Math.floor(m/60);const rm=m%60;if(h<24)return rm>0?`${h}h ${rm}min`:`${h}h`;const d=Math.floor(h/24);const rh=h%24;return rh>0?`${d}d ${rh}h`:`${d}d`;}
function titleCase(s?:string){return String(s||"").toLowerCase().replace(/(^|\s|\/|\-)([a-zA-Zà-üÀ-Ü])/g,(m,a,b)=>a+b.toUpperCase());}















































































































































function TabAtendimento({ordens,loadData,updO,canWrite,onReport,onEdit}:{ordens:OrdemServico[];loadData:()=>void;updO:(id:string,campo:string,valor:string)=>void;canWrite:boolean;onReport?:(o:OrdemServico)=>void;onEdit?:(o:OrdemServico)=>void}){const [now,setNow]=useState(Date.now());const [sel,setSel]=useState<string|null>(null);const [checkedFlags,setCheckedFlags]=useState<Record<string,boolean>>({});const [filtroFilial,setFiltroFilial]=useState("todas");const [filtroStatus,setFiltroStatus]=useState("todos");const [filtroCarga,setFiltroCarga]=useState("todos");useEffect(()=>{const t=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(t);},[]);function elapsed(ab:string){const s=Math.max(0,Math.floor((now-new Date(ab).getTime())/1000));if(s<3600)return `${Math.floor(s/60)} min`;const d=Math.floor(s/86400),h=Math.floor((s%86400)/3600),m=Math.floor((s%3600)/60);if(d>0)return `${d}d ${h}h`;return `${h}h ${String(m).padStart(2,"0")}min`;}function mins(ab:string){return Math.floor((now-new Date(ab).getTime())/60000);}function clrByTime(ab?:string){if(!ab)return"var(--accent-green)";const m=mins(ab);if(m>=120)return"var(--accent-red)";if(m>=60)return"var(--accent-yellow)";return"var(--accent-green)";}function bge(o:OrdemServico):{label:string;clr:string;bg:string}{const m=mins(o.atualizado_em||o.ultima_atualizacao||o.abertura||"");if(m>=120)return{label:"ATENDIMENTO CRÍTICO",clr:"#ef4444",bg:"rgba(239,68,68,0.18)"};const s=o.status||"";if(s==="Serviço em execução"||s==="Prestador a caminho")return{label:"EM ANDAMENTO",clr:"#22c55e",bg:"rgba(34,197,94,0.15)"};if(s==="Prestador no local")return{label:"NO LOCAL",clr:"#38bdf8",bg:"rgba(56,189,248,0.15)"};if(s==="Prestador localizado")return{label:"EM ATENDIMENTO",clr:"#60a5fa",bg:"rgba(96,165,250,0.15)"};return{label:"AGUARDANDO",clr:"#94a3b8",bg:"rgba(148,163,184,0.15)"};}function TruckSvg({tipo,clr}:{tipo:string;clr:string}){const g=(tipo||"").toLowerCase().includes("guincho");return(<svg viewBox="0 0 100 54" width="88" height="48" fill="none">{g?(<><rect x="2" y="16" width="60" height="28" rx="4" fill={clr} opacity="0.12" stroke={clr} strokeWidth="1.5"/><rect x="62" y="24" width="32" height="20" rx="3" fill={clr} opacity="0.18" stroke={clr} strokeWidth="1.5"/><rect x="2" y="16" width="18" height="28" rx="3" fill={clr} opacity="0.22"/><circle cx="20" cy="46" r="6" fill={clr} opacity="0.9"/><circle cx="20" cy="46" r="3" fill="#0f1811"/><circle cx="76" cy="46" r="6" fill={clr} opacity="0.9"/><circle cx="76" cy="46" r="3" fill="#0f1811"/><line x1="62" y1="18" x2="62" y2="28" stroke={clr} strokeWidth="2.5"/><path d="M25 26 L36 14 L62 14" stroke={clr} strokeWidth="2" fill="none" strokeLinecap="round"/></>):(<><rect x="2" y="14" width="68" height="30" rx="4" fill={clr} opacity="0.12" stroke={clr} strokeWidth="1.5"/><rect x="70" y="22" width="26" height="22" rx="3" fill={clr} opacity="0.2" stroke={clr} strokeWidth="1.5"/><rect x="2" y="14" width="22" height="30" rx="3" fill={clr} opacity="0.22"/><circle cx="22" cy="46" r="6" fill={clr} opacity="0.9"/><circle cx="22" cy="46" r="3" fill="#0f1811"/><circle cx="66" cy="46" r="6" fill={clr} opacity="0.9"/><circle cx="66" cy="46" r="3" fill="#0f1811"/><line x1="12" y1="28" x2="55" y2="28" stroke={clr} strokeWidth="1" opacity="0.4"/></>)}</svg>);}const ativas=ordens.filter(o=>STATUS_ABERTOS.has(o.status||""));const filiais=[...new Set(ativas.map(o=>o.operacao).filter((x):x is string=>!!x))].sort();const filtradas=ativas.filter(o=>{const okF=filtroFilial==="todas"||o.operacao===filtroFilial;const m=mins(o.atualizado_em||o.ultima_atualizacao||o.abertura||"");const okS=filtroStatus==="todos"||(filtroStatus==="critico"&&m>=120)||(filtroStatus==="atencao"&&m>=60&&m<120)||(filtroStatus==="normal"&&m<60);const okC=filtroCarga==="todos"||o.carga===filtroCarga;return okF&&okS&&okC;});const conclHoje=ordens.filter(o=>{if(!o.fechamento)return false;const d=new Date(o.fechamento),t=new Date();return d.toDateString()===t.toDateString();}).length;const atencoes=ativas.filter(o=>o.abertura&&mins(o.abertura)>=60&&mins(o.abertura)<120).length;const criticos=ativas.filter(o=>o.abertura&&mins(o.abertura)>=120).length;const guinchoRota=ativas.filter(o=>(o.tipo_servico||"").toLowerCase().includes("guincho")).length;const slaArr=ativas.filter(o=>o.abertura).map(o=>mins(o.abertura!));const slaMed=slaArr.length>0?Math.floor(slaArr.reduce((a,b)=>a+b,0)/slaArr.length):0;const KPIS=[{l:"OS ABERTAS",v:`${ativas.length}`,sub:"Em andamento",clr:"#22c55e",icon:<Activity size={20}/>},{l:"CONCLUÍDAS HOJE",v:`${conclHoje}`,sub:"Finalizadas",clr:"#4ade80",icon:<CheckCircle2 size={20}/>},{l:"TEMPO MÉDIO",v:`${String(Math.floor(slaMed/60)).padStart(2,"0")}:${String(slaMed%60).padStart(2,"0")}`,sub:"hh:mm",clr:"#60a5fa",icon:<Clock size={20}/>},{l:"ATENÇÕES",v:`${atencoes}`,sub:"60-120 min",clr:"var(--accent-yellow)",icon:<AlertTriangle size={20}/>},{l:"ATEND. CRÍTICOS",v:`${criticos}`,sub:"Atraso crítico",clr:"var(--accent-red)",icon:<AlertTriangle size={20}/>},{l:"GUINCHO",v:`${guinchoRota}`,sub:"Em deslocamento",clr:"#a78bfa",icon:<TrendingUp size={20}/>}];return(<div><div className="flex items-start justify-between mb-4"><div><div className="text-base font-bold" style={{color:"var(--text)"}}>PAINEL DE ACOMPANHAMENTO</div><div className="text-sm font-bold" style={{color:"var(--accent-green)"}}>SOCORRO MECÂNICO</div></div><div className="flex items-center gap-2"><select value={filtroFilial} onChange={e=>setFiltroFilial(e.target.value)} className="px-2 py-1.5 rounded-lg text-[11px] border cursor-pointer" style={{background:"var(--bg-card)",color:"var(--text)",borderColor:"var(--border-bright)"}}><option value="todas">TODAS FILIAIS</option>{filiais.map(f=><option key={f} value={f}>{f}</option>)}</select><select value={filtroStatus} onChange={e=>setFiltroStatus(e.target.value)} className="px-2 py-1.5 rounded-lg text-[11px] border cursor-pointer" style={{background:"var(--bg-card)",color:"var(--text)",borderColor:"var(--border-bright)"}}><option value="todos">TODOS STATUS</option><option value="critico">CRÍTICOS</option><option value="atencao">ATENÇÕES</option><option value="normal">NORMAL</option></select><select value={filtroCarga} onChange={e=>setFiltroCarga(e.target.value)} className="px-2 py-1.5 rounded-lg text-[11px] border cursor-pointer" style={{background:"var(--bg-card)",color:"var(--text)",borderColor:"var(--border-bright)"}}><option value="todos">TODA CARGA</option><option value="carregado">CARREGADO</option><option value="vazio">VAZIO</option></select><button onClick={loadData} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] cursor-pointer" style={{background:"var(--bg-card)",color:"var(--text-muted)",border:"1px solid var(--border-bright)"}}><Activity size={12}/>Atualizar</button></div></div><div className="grid grid-cols-3 xl:grid-cols-6 gap-2 mb-5">{KPIS.map((k,i)=>(<div key={i} className="rounded-xl px-3 py-2.5 flex flex-col" style={{background:"var(--bg-card)",border:`1.5px solid ${k.clr}44`}}><div className="flex items-center gap-1.5 mb-1"><span style={{color:k.clr}}>{k.icon}</span><span className="text-[9px] font-bold uppercase tracking-wide leading-tight" style={{color:"var(--text-muted)"}}>{k.l}</span></div><div className="text-2xl font-bold font-mono leading-none" style={{color:k.clr}}>{k.v}</div><div className="text-[9px] mt-0.5" style={{color:"var(--text-muted)"}}>{k.sub}</div></div>))}</div>{filtradas.length===0&&<div className="text-center py-16 text-sm" style={{color:"var(--text-muted)"}}>Nenhum atendimento encontrado</div>}<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 mb-5">{filtradas.map(o=>{const m=mins(o.atualizado_em||o.ultima_atualizacao||o.abertura||"");const clr=clrByTime(o.abertura);const b=bge(o);const et=ETAPAS.find(e=>e.status===o.status);const isCrit=m>=120;const isAten=m>=60&&m<120;const pulseClass=isCrit?"sla-pulse-red":isAten?"sla-pulse-yellow":"sla-pulse-green";return(<div key={o.id}><div onClick={()=>setSel(sel===o.id?null:o.id)} className={`rounded-xl p-3 cursor-pointer oscard ${o.carga==="carregado"?"carregado":""} ${isCrit?"crit":isAten?"warn":"ok"} ${pulseClass}`} style={{border:`1.5px solid ${b.clr}55`}}><div className="flex items-center justify-between mb-2"><span className="text-xs font-bold" style={{color:"var(--text)"}}>OS {o.os||"\u2014"}</span><span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isCrit?"blink-urgent":""}`} style={{background:b.bg,color:b.clr}}>{b.label}</span></div><div className="flex items-end justify-between mb-2">{o.status==="Aguardando Or\u00e7amento"&&<span className="text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1" style={{background:"rgba(251,191,36,0.18)",color:"#d97706"}}>\u23f3 AGUARDANDO OR\u00c7AMENTO</span>}{(()=>{const tp=String((o as any).tipo_veiculo||inferTipoVeiculo(o.modelo,o.marca,o.tipo_servico)||"").toLowerCase();const M:any={cavalo:IMGS.cavalo,van:IMGS.van,truck:IMGS.truck,toco:IMGS.truck,carreta:IMGS.carreta};return <img className="veic-img" src={M[tp]||M.cavalo} alt={tp} />;})()}<div className="text-right"><div className="text-[9px] uppercase" style={{color:"var(--text-muted)"}}>PLACA</div><div className="text-sm font-bold" style={{color:"var(--text)"}}>{o.placa||"\u2014"}</div><div className="flex items-center gap-1 mt-0.5">{o.carga?<span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{background:o.carga==="carregado"?"rgba(239,68,68,0.15)":"rgba(34,197,94,0.15)",color:o.carga==="carregado"?"#ef4444":"#16a34a"}}>{o.carga==="carregado"?"⚠ CARREGADO":"VAZIO"}</span>:<span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{background:"var(--bg-alt)",color:"var(--text-muted)"}}>carga?</span>}</div><div className="text-[9px]" style={{color:"var(--text-muted)"}}>{[o.modelo,o.marca].filter(Boolean).join(" | ")||"\u2014"}</div><div className="text-[9px] uppercase mt-1" style={{color:"var(--text-muted)"}}>TEMPO DECORRIDO</div><div className={`text-xl font-bold font-mono ${isCrit?"blink-urgent":""}`} style={{color:clr}}>{elapsed(o.atualizado_em||o.ultima_atualizacao||o.abertura||"")}</div></div></div><div className="text-[10px] space-y-0.5 mb-2"><div className="flex justify-between"><span style={{color:"var(--text-muted)"}}>TIPO</span><span style={{color:"var(--text)"}} className="font-medium">{TIPO_LABELS[o.tipo_servico||""||""||""||""||""||""||""||""||""||""||o.tipo_servico||"\u2014"]||"\u2014"}</span></div><div className="flex justify-between"><span style={{color:"var(--text-muted)"}}>FILIAL</span><span style={{color:"var(--text)"}} className="font-medium truncate max-w-[110px]">{o.operacao||"\u2014"}</span></div><div className="flex justify-between"><span style={{color:"var(--text-muted)"}}>ABERTURA</span><span style={{color:"var(--text)"}}>{o.abertura?new Date(o.abertura).toLocaleString("pt-BR",{timeZone:"America/Sao_Paulo",day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"}):"\u2014"}</span></div></div>{o.descricao&&<div className="text-[10px] italic truncate mb-2" style={{color:"var(--text-muted)"}}>{o.descricao}</div>}<div className="flex justify-between text-[10px] pt-2" style={{borderTop:"1px solid var(--border)"}}><div className="flex items-center gap-1"><Users size={9} style={{color:"var(--text-muted)"}}/><span style={{color:"var(--text)"}}>{o.criado_login||o.operador||"\u2014"}</span></div><div className="flex items-center gap-1"><Phone size={9} style={{color:"var(--text-muted)"}}/><span style={{color:"var(--text)"}}>{o.telefone||"\u2014"}</span></div></div>{et&&<div className="flex items-center justify-between text-[9px] mt-1.5" style={{color:"var(--text-muted)"}}><span>{et.label}</span><ChevronRight size={9}/></div>}{canWrite&&et?.next&&<button onClick={(e)=>{e.stopPropagation();updO(o.id,"status",et.next);}} className="w-full mt-2 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer" style={{background:"var(--accent-green)",color:"#fff"}}>Avançar → {ETAPAS.find(x=>x.status===et.next)?.label||et.next}</button>}<div className="flex gap-1.5 mt-1.5"><button onClick={(e)=>{e.stopPropagation();onReport&&onReport(o);}} className="flex-1 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer" style={{border:"1px solid var(--border-bright)",color:"var(--text-muted)"}}>Report</button>{canWrite&&onEdit&&<button onClick={(e)=>{e.stopPropagation();onEdit(o);}} className="flex-1 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer" style={{border:"1px solid var(--border-bright)",color:"var(--text-muted)"}}>Editar</button>}<button onClick={(e)=>{e.stopPropagation();setSel(sel===o.id?null:o.id);}} className="flex-1 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer" style={{border:"1px solid var(--border-bright)",color:"var(--text-muted)"}}>POP</button></div>{sel===o.id&&et&&(<div className="mt-2 pt-2 space-y-1.5" style={{borderTop:"1px solid var(--border)"}}>{et.checklist.map((c,i)=>{const fk=`${o.id}-${et.status}-${i}`;const ck=!!checkedFlags[fk];return(<div key={i} onClick={(e)=>{e.stopPropagation();setCheckedFlags(p=>({...p,[fk]:!p[fk]}))}} className="flex items-center gap-2 text-[10px] cursor-pointer select-none" style={{color:ck?"var(--accent-green)":"var(--text-muted)"}}><span className="w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0" style={{borderColor:ck?"var(--accent-green)":"var(--border-bright)",background:ck?"var(--accent-green)":"transparent"}}>{ck&&<span style={{color:"#fff",fontSize:"9px",fontWeight:700,lineHeight:1}}>✓</span>}</span>{c}</div>);})}</div>)}</div></div>);})}  </div><div className="grid grid-cols-1 md:grid-cols-3 gap-3"><div className="rounded-xl p-4" style={{background:"var(--bg-card)",border:"1px solid var(--border-bright)"}}><div className="text-[10px] font-bold uppercase tracking-wide mb-3" style={{color:"var(--text-muted)"}}>TOP FILIAIS</div>{(()=>{const cnt:Record<string,number>={};ativas.forEach(o=>{const f=o.operacao||"Outros";cnt[f]=(cnt[f]||0)+1;});const s=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,5);const max=s[0]?.[1]||1;return s.map(([f,n],i)=>(<div key={f} className="flex items-center gap-2 mb-2 text-[11px]"><span style={{color:"var(--text-muted)",minWidth:"14px"}}>{i+1}</span><span className="flex-1 truncate" style={{color:"var(--text)"}}>{f}</span><div className="h-1.5 rounded-full" style={{width:`${(n/max)*50}px`,background:"var(--accent-green)"}}></div><span className="font-bold" style={{color:"var(--accent-green)"}}>{n}</span></div>));})()}</div><div className="rounded-xl p-4" style={{background:"var(--bg-card)",border:"1px solid var(--border-bright)"}}><div className="text-[10px] font-bold uppercase tracking-wide mb-3" style={{color:"var(--text-muted)"}}>OS POR TIPO</div>{(()=>{const cnt:Record<string,number>={};ativas.forEach(o=>{const t=TIPO_LABELS[o.tipo_servico||""||""||""||""||""||""||o.tipo_servico||""||"Outros"]||"Outros";cnt[t]=(cnt[t]||0)+1;});const total=ativas.length||1;return Object.entries(cnt).map(([t,n])=>(<div key={t} className="flex items-center gap-2 mb-2 text-[11px]"><span className="flex-1 truncate" style={{color:"var(--text)"}}>{t}</span><div className="h-1.5 rounded-full" style={{width:`${(n/total)*70}px`,background:"var(--accent-green)"}}></div><span style={{color:"var(--text-muted)"}}>{n} ({Math.round(n/total*100)}%)</span></div>));})()}</div><div className="rounded-xl p-4" style={{background:"var(--bg-card)",border:"1px solid var(--border-bright)"}}><div className="text-[10px] font-bold uppercase tracking-wide mb-3" style={{color:"var(--text-muted)"}}>ALERTAS</div>{criticos>0&&<div className="flex items-start gap-2 text-[11px] mb-2"><AlertTriangle size={12} className="shrink-0 mt-0.5" style={{color:"var(--accent-red)"}}/><span style={{color:"var(--text)"}}>{criticos} crítico{criticos>1?"s":""} \u2014 atraso &gt; 2h</span></div>}{atencoes>0&&<div className="flex items-start gap-2 text-[11px] mb-2"><AlertTriangle size={12} className="shrink-0 mt-0.5" style={{color:"var(--accent-yellow)"}}/><span style={{color:"var(--text)"}}>{atencoes} OS há mais de 1h</span></div>}{criticos===0&&atencoes===0&&<div className="text-[11px]" style={{color:"var(--accent-green)"}}>Todos dentro do prazo.</div>}<div className="flex items-center gap-2 text-[11px] mt-3"><Activity size={11} style={{color:"var(--text-muted)"}}/><span style={{color:"var(--text-muted)"}}>Atualização a cada 30s</span></div></div></div></div>);}

function TabAcompanhamento({ordens}:{ordens:OrdemServico[]}){const ativas=ordens.filter(o=>STATUS_ABERTOS.has(o.status||""));const STATUS_SEQ=["Aguardando","Prestador localizado","A caminho","No local","Serviço em execução","Veículo liberado","Rebocado"];function statusIdx(s:string){return Math.max(0,STATUS_SEQ.findIndex(x=>x.toLowerCase()===s?.toLowerCase()));}return(<div><div className="flex items-center gap-3 mb-6"><GitBranch size={20} style={{color:"var(--accent-green)"}}/><h2 className="text-lg font-bold" style={{fontFamily:"var(--font-heading)",color:"var(--accent-green)"}}>ACOMPANHAMENTO — LINHA DO TEMPO</h2></div>{ativas.length===0&&<div className="text-center py-20" style={{color:"var(--text-muted)"}}>Nenhum atendimento em andamento</div>}<div className="space-y-6">{ativas.map(o=>{const curIdx=statusIdx(o.status||"");return(<div key={o.id} className="rounded-xl p-5" style={{background:"var(--bg-card)",border:"1px solid var(--border-bright)"}}><div className="flex items-center gap-3 mb-5"><span className="text-xs font-bold px-2 py-1 rounded" style={{background:"var(--accent-green-glow)",color:"var(--accent-green)"}}>O.S. #{o.os}</span><span className="text-xs font-bold" style={{color:"var(--text)"}}>{o.placa||"—"} — {o.operacao||"—"}</span>{o.abertura&&<span className="text-xs ml-auto" style={{color:"var(--text-muted)"}}><TempoEmAberto abertura={o.abertura}/></span>}</div><div className="relative py-6"><div className="absolute top-1/2 left-4 right-4 h-0.5 rounded" style={{background:"var(--border-bright)",transform:"translateY(-50%)"}}></div><div className="absolute top-1/2 left-4 h-0.5 rounded transition-all duration-500" style={{background:"var(--accent-green)",width:`calc(${curIdx/(STATUS_SEQ.length-1)*100}% - 2rem)`,transform:"translateY(-50%)",boxShadow:"0 0 8px rgba(34,197,94,0.5)"}}></div><div className="relative flex justify-between px-4">{STATUS_SEQ.map((st,si)=>{const done=si<=curIdx;const active=si===curIdx;return(<div key={si} className="flex flex-col items-center" style={{zIndex:1}}><div className="w-4 h-4 rounded-full border-2 transition-all" style={{background:done?"var(--accent-green)":"var(--bg)",borderColor:done?"var(--accent-green)":"var(--border-bright)",boxShadow:active?"0 0 10px rgba(34,197,94,0.9)":"none"}}></div><div className="text-[9px] mt-2 text-center max-w-[55px] leading-tight" style={{color:done?"var(--accent-green)":"var(--text-soft)"}}>{st}</div></div>);})}</div></div></div>);})}</div></div>);}










































































































