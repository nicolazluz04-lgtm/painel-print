#!/usr/bin/env node
// Teste de layout do Painel Print (rolagem lateral, itens vazando, sobreposição, alvos pequenos).
//
// USO
//   PAINEL_EMAIL=... PAINEL_SENHA=... node fonte/testes/layout.mjs [url] [--saida=pasta] [--tamanhos=d1920,n1366,m390]
//
//   url         endereço do painel (padrão: http://localhost:8092/ — ex.: `python3 -m http.server 8092` na raiz)
//   --saida     pasta onde salvar layout.json e as capturas de cada aba/janela (opcional)
//   --tamanhos  quais telas medir (padrão: as três)
//                 d1920 = computador 1920×1080 · n1366 = notebook 1366×768 · m390 = celular (iPhone 13, 390 px)
//                 t768 = tablet 768×1024 (opcional)
//
//   E-mail e senha vêm SOMENTE das variáveis de ambiente PAINEL_EMAIL e PAINEL_SENHA (nunca grave senha aqui).
//   Requer o Playwright (`npm i -D playwright && npx playwright install chromium`, ou instalado globalmente).
//
// O QUE FAZ
//   Entra no painel, percorre todas as abas do menu e abre as janelas Nova O.S., Importar O.S., Novo Prestador, Importar planilha,
//   Novo Usuário, Editar e Report (e, no celular, o menu "Ações" dos botões flutuantes).
//   SÓ NAVEGA E ABRE JANELAS: nunca clica em salvar, avançar ou excluir.
//
// FALHA (código de saída 1) quando, em qualquer tela:
//   rolagemLateral  a página fica mais larga que a janela do navegador
//   vaza            um item sai para fora do cartão/caixa que o contém
//   sobreposto      dois itens de uma mesma linha/grade ficam um por cima do outro
//   cortado         texto cortado sem reticências
//   alvoPequeno     botão/campo menor que 36 px (computador) ou 44 px (celular)
//                   — exceção justificada: marque o elemento (ou um ancestral) com data-alvo-ok="motivo"
//   coberto         ao rolar até o fim, um botão flutuante cobre o conteúdo
//   erroJS          erro de JavaScript na página
//   janelaNaoAbriu  o botão da janela foi clicado, mas nenhuma janela apareceu
// Avisos (não reprovam): espaçamentos desiguais numa fileira (gapsDesiguais).
// Código 2 = não conseguiu rodar (sem senha, sem Playwright, login falhou…).

import fs from 'node:fs';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

const args = process.argv.slice(2);
const opt = (k, d) => { const a = args.find(x => x.startsWith(`--${k}=`)); return a ? a.slice(k.length + 3) : d; };
const url = args.find(x => !x.startsWith('--')) || 'http://localhost:8092/';
const saida = opt('saida', '');
const tamanhos = opt('tamanhos', 'd1920,n1366,m390').split(',');
const email = process.env.PAINEL_EMAIL, senha = process.env.PAINEL_SENHA;
if (!email || !senha) { console.error('Defina PAINEL_EMAIL e PAINEL_SENHA.'); process.exit(2); }
if (saida) fs.mkdirSync(saida, { recursive: true });

let pw;
try { pw = await import('playwright'); }
catch { try { pw = createRequire(execSync('npm root -g').toString().trim() + '/')('playwright'); } catch { console.error('Playwright não encontrado (npm i -D playwright).'); process.exit(2); } }
const { chromium, devices } = pw.default || pw;

const TELAS = {
  d1920: { viewport: { width: 1920, height: 1080 } },
  n1366: { viewport: { width: 1366, height: 768 } },
  t768: { viewport: { width: 768, height: 1024 } }, // tablet (opcional: --tamanhos=t768)
  m390: { ...devices['iPhone 13'] },
};

// Executado dentro da página. min = tamanho mínimo de alvo de toque.
function MEDIR(min) {
  const vw = document.documentElement.clientWidth, vh = window.innerHeight;
  const cs = e => getComputedStyle(e);
  const vis = e => { const s = cs(e); const r = e.getBoundingClientRect(); return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0; };
  const sel = e => { const t = (e.innerText || e.getAttribute('aria-label') || e.getAttribute('title') || e.getAttribute('name') || '').trim().replace(/\s+/g, ' ').slice(0, 40); return e.tagName.toLowerCase() + (t ? ' "' + t + '"' : ''); };
  const inLeaflet = e => !!e.closest('.leaflet-container');
  const fixo = new Map();
  // parte do elemento que aparece de fato (descontando caixas com rolagem/corte)
  const visivel = e => { let r = e.getBoundingClientRect(); let a = { l: r.left, t: r.top, r: r.right, b: r.bottom }; for (let p = e.parentElement; p && p !== document.body; p = p.parentElement) { const s = cs(p); if (s.overflowX !== 'visible' || s.overflowY !== 'visible') { const q = p.getBoundingClientRect(); a = { l: Math.max(a.l, q.left), t: Math.max(a.t, q.top), r: Math.min(a.r, q.right), b: Math.min(a.b, q.bottom) }; } } return { left: a.l, top: a.t, right: a.r, bottom: a.b }; };
  const dentroDeFixo = e => { if (!e || e === document.body) return false; if (fixo.has(e)) return fixo.get(e); const v = cs(e).position === 'fixed' || dentroDeFixo(e.parentElement); fixo.set(e, v); return v; };
  const out = { cortado: [], sobreposto: [], vaza: [], gapsDesiguais: [], alvoPequeno: [], coberto: [] };
  const all = [...document.querySelectorAll('main *, [role=dialog] *, .fixed *')].filter(e => vis(e) && !inLeaflet(e));
  for (const e of all) {
    if (e.children.length || !(e.innerText || '').trim()) continue;
    const s = cs(e);
    const clipX = e.scrollWidth > e.clientWidth + 1 && s.textOverflow !== 'ellipsis' && (s.overflow !== 'visible' || s.overflowX !== 'visible');
    const clipY = e.scrollHeight > e.clientHeight + 2 && /hidden|clip/.test(s.overflowY) && !s.webkitLineClamp;
    if (clipX || clipY) out.cortado.push(sel(e));
  }
  const conts = all.filter(e => /flex|grid/.test(cs(e).display) && e.children.length > 1);
  for (const c of conts) {
    const kids = [...c.children].filter(vis).filter(k => !/absolute|fixed/.test(cs(k).position));
    for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) {
      const a = kids[i].getBoundingClientRect(), b = kids[j].getBoundingClientRect();
      const ix = Math.min(a.right, b.right) - Math.max(a.left, b.left), iy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ix > 3 && iy > 3) out.sobreposto.push(sel(kids[i]) + ' × ' + sel(kids[j]));
    }
    const meio = r => (r.top + r.bottom) / 2;
    const row = kids.map(k => k.getBoundingClientRect()).filter((r, i, arr) => Math.abs(r.top - arr[0].top) < 2 || Math.abs(meio(r) - meio(arr[0])) < 2);
    if (row.length >= 3) {
      const gaps = []; for (let i = 1; i < row.length; i++) gaps.push(Math.round(row[i].left - row[i - 1].right));
      if (Math.max(...gaps) - Math.min(...gaps) > 4 && Math.min(...gaps) >= 0) out.gapsDesiguais.push(sel(c) + ' gaps=' + gaps.join(','));
    }
  }
  for (const e of all) {
    const p = e.parentElement; if (!p || !vis(p)) continue;
    const ps = cs(p); const temCaixa = ps.borderTopWidth !== '0px' || (ps.backgroundColor && ps.backgroundColor !== 'rgba(0, 0, 0, 0)');
    if (!temCaixa || /auto|scroll/.test(ps.overflowX) || cs(e).position === 'absolute') continue;
    const r = e.getBoundingClientRect(), q = p.getBoundingClientRect();
    if (r.right > q.right + 2 || r.left < q.left - 2) out.vaza.push(sel(e) + ' em ' + sel(p) + ' (' + Math.round(Math.max(r.right - q.right, q.left - r.left)) + 'px)');
  }
  for (const e of document.querySelectorAll('button, a[href], select, input, textarea, [role=button]')) {
    if (!vis(e) || inLeaflet(e) || e.closest('[data-alvo-ok]')) continue;
    const t = (e.getAttribute('type') || '').toLowerCase();
    if (t === 'hidden' || t === 'file') continue;
    if (e.tagName === 'A' && cs(e).display === 'inline') continue; // link dentro de um texto
    const alvo = (t === 'checkbox' || t === 'radio') ? (e.closest('label') || e) : e;
    const r = alvo.getBoundingClientRect();
    if (r.width < min - 0.5 || r.height < min - 0.5) out.alvoPequeno.push(sel(alvo) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height));
  }
  // botões flutuantes cobrindo o fim do conteúdo (a página já está rolada até o fim)
  const flutuantes = [...document.querySelectorAll('body *')].filter(e => cs(e).position === 'fixed' && vis(e) && !e.closest('aside')).map(e => e.getBoundingClientRect()).filter(r => r.width < vw * 0.6 && r.height < vh * 0.5 && r.bottom > vh - 160);
  const janelaAberta = [...document.querySelectorAll('[role=dialog], .fixed.inset-0')].some(vis);
  if (flutuantes.length && !janelaAberta) {
    for (const e of document.querySelectorAll('main *')) {
      if (e.children.length && !/^(BUTTON|SELECT|INPUT|A)$/.test(e.tagName)) continue;
      if (!vis(e) || dentroDeFixo(e) || !((e.innerText || '').trim() || /^(BUTTON|SELECT|INPUT|A)$/.test(e.tagName))) continue;
      const r = visivel(e); if (r.bottom <= r.top || r.right <= r.left || r.bottom < 0 || r.top > vh) continue;
      for (const f of flutuantes) {
        const ix = Math.min(r.right, f.right) - Math.max(r.left, f.left), iy = Math.min(r.bottom, f.bottom) - Math.max(r.top, f.top);
        if (ix > 4 && iy > 4) { out.coberto.push(sel(e)); break; }
      }
    }
  }
  out.rolagemLateral = document.documentElement.scrollWidth > vw + 2 || document.body.scrollWidth > vw + 2;
  out.larguraPagina = document.documentElement.scrollWidth;
  for (const k of Object.keys(out)) if (Array.isArray(out[k])) out[k] = [...new Set(out[k])];
  return out;
}

const FALHAS = ['rolagemLateral', 'vaza', 'sobreposto', 'cortado', 'alvoPequeno', 'coberto', 'erroJS', 'janelaNaoAbriu'];
const nomeArq = s => s.replace(/[^\wÀ-ÿ]+/g, '_');

async function sessao(b, tela) {
  const celular = tela.startsWith('m');
  const min = celular ? 44 : 36;
  const ctx = await b.newContext(TELAS[tela]);
  const p = await ctx.newPage();
  const erros = [];
  p.on('pageerror', e => erros.push(String(e.message || e).slice(0, 200)));
  p.on('dialog', d => d.dismiss());
  const prontas = async () => { await p.waitForSelector('aside nav button', { timeout: 60000 }); await p.waitForTimeout(3500); };
  await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await p.fill('input[name=e]', email);
  await p.fill('input[name=p]', senha);
  await p.click('form:has(input[name=e]) button');
  await prontas();
  const res = {};
  const medir = async (nome) => {
    await p.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await p.waitForTimeout(300);
    const m = await p.evaluate(MEDIR, min);
    m.erroJS = erros.splice(0);
    res[nome] = m;
    if (saida) { await p.evaluate(() => window.scrollTo(0, 0)); await p.screenshot({ path: `${saida}/${tela}-${nomeArq(nome)}.png` }); }
  };
  const abas = await p.$$eval('aside nav button', bs => bs.map(b => (b.getAttribute('title') || b.innerText).trim().replace(/\s*\d+$/, '')));
  for (let i = 0; i < abas.length; i++) {
    const bs = await p.$$('aside nav button'); await bs[i].click(); await p.waitForTimeout(2500);
    await medir(String(i + 1).padStart(2, '0') + '-' + abas[i]);
  }
  const janelas = [['Ordens de Serviço', 'Nova O.S'], ['Ordens de Serviço', 'Importar O.S.'], ['Prestadores', 'Novo Prestador'], ['Prestadores', 'Importar planilha'], ['Usuários', 'Novo Usuário'], ['Atendimento', 'Editar'], ['Atendimento', 'Report']];
  for (const [aba, botao] of janelas) {
    const idx = abas.findIndex(a => a.startsWith(aba)); if (idx < 0) continue;
    await (await p.$$('aside nav button'))[idx].click(); await p.waitForTimeout(2000);
    const alvo = p.locator(`main button:has-text("${botao}")`).first();
    if (!(await alvo.count())) continue;
    await alvo.click().catch(() => {}); await p.waitForTimeout(1500);
    await medir('janela-' + botao);
    res['janela-' + botao].janelaNaoAbriu = !(await p.evaluate(() => [...document.querySelectorAll('[role=dialog], .fixed.inset-0')].some(e => getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0)));
    await p.reload({ waitUntil: 'networkidle' }); await prontas();
  }
  // menu único dos botões flutuantes (celular)
  const menu = p.locator('[data-menu-flutuante]');
  if (await menu.count() && await menu.first().isVisible()) { await menu.first().click(); await p.waitForTimeout(800); await medir('janela-Menu'); }
  await ctx.close();
  return res;
}

const b = await chromium.launch();
let resultado;
try {
  resultado = Object.fromEntries(await Promise.all(tamanhos.map(async t => [t, await sessao(b, t)])));
} catch (e) { console.error('Não consegui medir:', e.message); await b.close(); process.exit(2); }
await b.close();
if (saida) fs.writeFileSync(`${saida}/layout.json`, JSON.stringify(resultado, null, 1));

let falhou = 0;
for (const [tela, telas] of Object.entries(resultado)) {
  const tot = {};
  for (const [nome, m] of Object.entries(telas)) {
    const problemas = FALHAS.filter(k => (Array.isArray(m[k]) ? m[k].length : m[k]));
    for (const k of [...FALHAS, 'gapsDesiguais']) tot[k] = (tot[k] || 0) + (Array.isArray(m[k]) ? m[k].length : m[k] ? 1 : 0);
    if (!problemas.length) continue;
    falhou++;
    console.log(`✗ ${tela} · ${nome}`);
    for (const k of problemas) console.log(`    ${k}: ${Array.isArray(m[k]) ? m[k].slice(0, 8).join(' | ') : 'sim (largura ' + m.larguraPagina + ' px)'}`);
  }
  console.log(`= ${tela}: ${Object.keys(telas).length} telas · ` + Object.entries(tot).map(([k, v]) => `${k}=${v}`).join(' '));
}
console.log(falhou ? `\nREPROVADO: ${falhou} tela(s) com problema.` : '\nAPROVADO: nenhuma tela com problema.');
process.exit(falhou ? 1 : 0);
