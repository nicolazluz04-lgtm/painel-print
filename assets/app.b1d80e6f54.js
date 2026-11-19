(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // shims/react.js
  var require_react = __commonJS({
    "shims/react.js"(exports, module) {
      module.exports = window.React;
    }
  });

  // shims/react-dom-client.js
  var require_react_dom_client = __commonJS({
    "shims/react-dom-client.js"(exports, module) {
      module.exports = window.ReactDOM;
    }
  });

  // shims/next-themes.js
  var require_next_themes = __commonJS({
    "shims/next-themes.js"(exports) {
      var React3 = window.React;
      function read() {
        try {
          return localStorage.getItem("theme") || "dark";
        } catch (e) {
          return "dark";
        }
      }
      function apply(t) {
        document.documentElement.classList.toggle("dark", t === "dark");
      }
      exports.useTheme = function() {
        const [theme, set] = React3.useState(read);
        React3.useEffect(() => {
          apply(theme);
        }, [theme]);
        return { theme, setTheme: (t) => {
          try {
            localStorage.setItem("theme", t);
          } catch (e) {
          }
          set(t);
        }, resolvedTheme: theme };
      };
    }
  });

  // shims/recharts.js
  var require_recharts = __commonJS({
    "shims/recharts.js"(exports) {
      var g = window.Recharts || {};
      var R = window.React;
      var Pass = function Pass2(p) {
        return R.createElement("div", null, p && p.children);
      };
      var names = ["Bar", "BarChart", "CartesianGrid", "Cell", "Legend", "Pie", "PieChart", "ResponsiveContainer", "Tooltip", "XAxis", "YAxis"];
      names.forEach((n) => {
        exports[n] = g[n] || Pass;
      });
    }
  });

  // shims/next-dynamic.js
  var require_next_dynamic = __commonJS({
    "shims/next-dynamic.js"(exports, module) {
      var React3 = window.React;
      var Boundary = class extends React3.Component {
        constructor(p) {
          super(p);
          this.state = { err: null };
        }
        static getDerivedStateFromError(err) {
          return { err };
        }
        componentDidCatch(err) {
          try {
            console.error("Falha em componente:", err && err.message);
          } catch (e) {
          }
        }
        render() {
          if (this.state.err) return React3.createElement("div", { style: { padding: 12, fontSize: 12, opacity: 0.7 } }, "Este bloco n\xE3o p\xF4de ser carregado.");
          return this.props.children;
        }
      };
      module.exports = function dynamic2(loader) {
        const L = React3.lazy(() => loader().then((m) => ({ default: m && m.default || m })));
        return function Dyn(props) {
          return React3.createElement(Boundary, null, React3.createElement(React3.Suspense, { fallback: null }, React3.createElement(L, props)));
        };
      };
      module.exports.default = module.exports;
    }
  });

  // shims/lucide.js
  var require_lucide = __commonJS({
    "shims/lucide.js"(exports) {
      var g = window.LucideReact || window.lucideReact || {};
      var R = window.React;
      var Empty = function Empty2() {
        return null;
      };
      var names = ["Activity", "AlertTriangle", "Ban", "BarChart3", "BellRing", "CheckCircle2", "ChevronLeft", "ChevronRight", "Clock", "Eye", "FileDown", "FileText", "GitBranch", "LayoutDashboard", "LogIn", "LogOut", "MapPin", "Monitor", "Moon", "Package", "Pencil", "Phone", "Plus", "ScrollText", "Search", "ShieldCheck", "Sun", "Timer", "Trash2", "TrendingUp", "Upload", "UserPlus", "Users", "X"];
      names.forEach((n) => {
        exports[n] = g[n] || Empty;
      });
    }
  });

  // lib/api.ts
  function avisarErro(mensagem) {
    try {
      window.dispatchEvent(new CustomEvent(EVENTO_ERRO, { detail: { mensagem } }));
    } catch {
    }
  }
  async function api(url, init) {
    const alteracao = (init && init.method || "GET").toUpperCase() !== "GET";
    try {
      const r = await fetch(`/api${url}`, { headers: { "Content-Type": "application/json" }, ...init });
      const txt = await r.text();
      let j = {};
      try {
        j = txt ? JSON.parse(txt) : {};
      } catch {
        j = {};
      }
      if (!r.ok && alteracao) avisarErro(j && j.detail ? String(j.detail) : `N\xE3o foi poss\xEDvel salvar (erro ${r.status}).`);
      return j;
    } catch {
      if (alteracao) avisarErro("N\xE3o foi poss\xEDvel salvar: sem conex\xE3o com o painel.");
      return {};
    }
  }
  var EVENTO_ERRO;
  var init_api = __esm({
    "lib/api.ts"() {
      EVENTO_ERRO = "painel:erro-gravacao";
    }
  });

  // vehicon.js
  function vehHtml(color) {
    return '<div style="width:12px;height:12px;border-radius:50%;background:' + color + ';border:2px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,.45),0 1px 3px rgba(0,0,0,.55);box-sizing:content-box"></div>';
  }
  var init_vehicon = __esm({
    "vehicon.js"() {
    }
  });

  // brmap.js
  function addBrasil(L, map) {
    try {
      const el = map.getContainer();
      const vec = L.layerGroup().addTo(map);
      el.style.background = "#a9cde0";
      L.polygon(CONT, { color: "#b9b39d", weight: 1, fillColor: "#e7e3d3", fillOpacity: 1, interactive: false }).addTo(vec);
      for (let lat = -35; lat <= 10; lat += 5) L.polyline([[lat, -85], [lat, -25]], { color: "#7da7bd", weight: 0.6, opacity: 0.55, dashArray: "2 5", interactive: false }).addTo(vec);
      for (let lng = -80; lng <= -30; lng += 5) L.polyline([[-58, lng], [14, lng]], { color: "#7da7bd", weight: 0.6, opacity: 0.55, dashArray: "2 5", interactive: false }).addTo(vec);
      S2.split("|").forEach((p) => {
        const pts = p.split(" ").map((s) => {
          const [x, y] = s.split(",");
          return [parseFloat(y), parseFloat(x)];
        });
        L.polygon(pts, { color: "#9c9577", weight: 1.1, fillColor: "#f3f0dc", fillOpacity: 1, dashArray: "5 3", interactive: false, smoothFactor: 0.5 }).addTo(vec);
      });
      ROD.forEach(([nome, pts]) => {
        L.polyline(pts, { color: "#8a4b08", weight: 5.5, opacity: 0.9, interactive: false, lineJoin: "round" }).addTo(vec);
        L.polyline(pts, { color: "#fbbf24", weight: 3, interactive: false, lineJoin: "round" }).addTo(vec);
        const m = pts[Math.floor(pts.length / 2)];
        L.marker(m, { interactive: false, icon: L.divIcon({ className: "", iconSize: [44, 16], iconAnchor: [22, 8], html: '<div style="font:700 9px Arial;color:#fff;background:#b45309;border:1px solid #fff;border-radius:3px;text-align:center;line-height:13px;width:40px">' + nome + "</div>" }) }).addTo(vec);
      });
      const grp = L.layerGroup().addTo(vec);
      const draw = () => {
        grp.clearLayers();
        const z = map.getZoom();
        CID.forEach(([n, lat, lng, r]) => {
          if (r === 2 && z < 4) return;
          if (r === 3 && z < 6) return;
          const sz = r === 1 ? 7 : 5;
          L.marker([lat, lng], { interactive: false, zIndexOffset: -100, icon: L.divIcon({ className: "", iconSize: [90, 16], iconAnchor: [5, 8], html: '<div style="display:flex;align-items:center;gap:4px;white-space:nowrap"><span style="width:' + sz + "px;height:" + sz + 'px;border-radius:50%;background:#1f2937;border:1.5px solid #fff;display:inline-block"></span><span style="font:' + (r === 1 ? "700 10.5px" : "600 9.5px") + ' Arial;color:#1f2937;text-shadow:0 0 3px #fff,0 0 3px #fff,0 0 3px #fff">' + n + "</span></div>" }) }).addTo(grp);
        });
      };
      draw();
      map.on("zoomend", draw);
      const aplicar = () => {
        const layers = window.__mapLayers;
        if (!layers || map.__real) return;
        map.__real = true;
        try {
          map.removeLayer(vec);
        } catch (e) {
        }
        el.style.background = "#aad3df";
        window.__mapBaseInfo = window.__mapBaseInfo || {};
        window.__mapBaseInfo.status = "ok";
        const G = "https://server.arcgisonline.com/ArcGIS/rest/services/";
        let okTiles = 0, errTiles = 0, fallback = false;
        const sat = L.tileLayer(G + "World_Imagery/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19, maxNativeZoom: 18, zIndex: 1, attribution: "Imagery \xA9 Esri, Maxar, Earthstar Geographics" }).addTo(map);
        const ref = L.tileLayer(G + "Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", { maxZoom: 19, maxNativeZoom: 18, zIndex: 2 }).addTo(map);
        const usarEmbutido = () => {
          if (fallback) return;
          fallback = true;
          try {
            map.removeLayer(sat);
            map.removeLayer(ref);
          } catch (e) {
          }
          layers.forEach((l, i) => {
            const ov = L.imageOverlay(l.uri, l.bounds, { interactive: false, zIndex: 1 + i }).addTo(map);
            try {
              ov.getElement().addEventListener("error", () => {
                window.__mapBaseInfo.status = "imagem inv\xE1lida";
                try {
                  map.removeLayer(ov);
                } catch (e) {
                }
              });
            } catch (e) {
            }
          });
          try {
            map.setMaxZoom(12);
          } catch (e) {
          }
        };
        sat.on("tileload", () => {
          okTiles++;
        });
        sat.on("tileerror", () => {
          errTiles++;
          if (!okTiles && errTiles >= 4) usarEmbutido();
        });
        setTimeout(() => {
          if (!okTiles) usarEmbutido();
        }, 12e3);
        setTimeout(() => {
          try {
            map.invalidateSize();
          } catch (e) {
          }
        }, 300);
      };
      aplicar();
      const h = () => aplicar();
      window.addEventListener("mapbase", h);
      map.on("unload", () => window.removeEventListener("mapbase", h));
    } catch (e) {
    }
  }
  var S2, CONT, CID, ROD;
  var init_brmap = __esm({
    "brmap.js"() {
      S2 = "-66.8,-9.8 -67.2,-10.3 -67.7,-10.7 -68.3,-11.0 -69.2,-11.0 -70.1,-11.0 -70.6,-10.5 -70.5,-9.7 -71.2,-9.9 -72.2,-10.0 -72.6,-9.5 -73.0,-9.0 -73.4,-8.4 -73.8,-7.9 -73.2,-7.3 -72.4,-7.6 -71.4,-7.7 -70.5,-7.8 -69.8,-8.1 -69.3,-8.5 -68.7,-9.0 -68.0,-9.4 -67.2,-9.6 -66.8,-9.8|-35.2,-8.9 -35.5,-9.4 -36.0,-9.9 -36.4,-10.5 -36.9,-10.1 -37.5,-9.8 -38.1,-9.5 -37.8,-8.9 -37.2,-9.2 -36.3,-9.2 -35.8,-8.8 -35.2,-8.9|-67.3,2.0 -67.1,1.3 -66.3,0.8 -65.7,1.0 -65.0,1.2 -64.3,1.5 -63.9,2.0 -63.1,2.2 -62.8,1.6 -62.5,1.0 -62.4,0.2 -62.3,-0.6 -62.0,-1.2 -61.5,-0.8 -60.7,-0.9 -60.3,-0.4 -60.0,0.3 -58.9,0.3 -58.7,-0.5 -58.4,-1.1 -57.8,-1.4 -57.2,-1.7 -56.7,-2.2 -56.7,-3.1 -57.1,-4.0 -57.5,-4.8 -57.9,-5.6 -58.3,-6.5 -58.2,-7.3 -58.3,-8.1 -58.5,-8.8 -59.4,-8.8 -60.4,-8.8 -61.6,-8.8 -62.3,-8.6 -62.7,-8.1 -63.5,-8.0 -64.0,-8.5 -64.4,-9.0 -65.0,-9.3 -65.7,-9.5 -66.5,-9.6 -67.5,-9.6 -68.2,-9.2 -68.9,-8.8 -69.4,-8.4 -70.0,-7.9 -70.8,-7.8 -71.6,-7.7 -72.6,-7.6 -73.7,-7.1 -73.4,-6.6 -73.2,-5.9 -72.9,-5.3 -72.4,-4.9 -71.8,-4.5 -71.0,-4.4 -70.3,-4.2 -69.8,-3.7 -69.7,-2.9 -69.5,-1.9 -69.4,-1.1 -69.7,-0.5 -70.0,0.1 -69.7,0.6 -69.8,1.6 -68.7,1.7 -67.9,1.9 -67.4,2.2 -67.3,2.0|-50.1,0.7 -50.6,0.2 -51.2,-0.1 -51.6,-0.7 -52.0,-1.2 -52.5,-0.8 -52.8,-0.2 -53.2,0.4 -53.4,1.0 -53.9,1.5 -54.5,1.8 -54.9,2.4 -54.2,2.2 -53.4,2.3 -52.6,2.4 -52.3,3.1 -52.0,3.6 -51.6,4.2 -51.1,3.8 -51.0,3.0 -50.7,2.3 -50.2,1.8 -49.9,1.2 -50.1,0.7|-39.3,-8.6 -38.7,-8.9 -38.2,-9.3 -38.0,-10.0 -38.1,-10.7 -37.9,-11.4 -37.7,-12.1 -38.0,-12.6 -38.6,-13.0 -38.9,-13.6 -39.0,-14.4 -39.0,-15.3 -39.0,-16.2 -39.1,-16.9 -39.2,-17.8 -39.6,-18.2 -40.3,-17.9 -40.6,-17.4 -40.3,-16.7 -39.9,-16.2 -40.4,-15.8 -41.3,-15.7 -41.7,-15.2 -42.4,-15.0 -43.0,-14.7 -43.9,-14.6 -44.4,-14.3 -45.0,-14.6 -45.6,-15.0 -46.0,-14.5 -46.3,-13.8 -46.2,-13.0 -46.4,-12.3 -46.1,-11.6 -46.6,-11.3 -46.2,-10.7 -45.7,-10.3 -45.3,-10.8 -44.5,-10.6 -43.9,-10.3 -43.8,-9.5 -42.9,-9.5 -42.2,-9.3 -41.6,-9.0 -40.8,-9.1 -39.9,-9.0 -39.4,-8.6 -39.3,-8.6|-37.3,-4.8 -37.8,-5.2 -38.1,-5.8 -38.6,-6.3 -38.8,-7.0 -38.9,-7.8 -39.5,-7.5 -40.3,-7.3 -40.6,-6.7 -40.9,-6.1 -40.9,-5.2 -41.2,-4.6 -41.3,-3.7 -41.1,-2.9 -40.3,-2.8 -39.6,-3.1 -39.0,-3.4 -38.4,-3.8 -38.0,-4.2 -37.5,-4.6 -37.3,-4.8|-47.5,-15.5 -47.9,-16.1 -47.5,-15.5|-40.5,-17.9 -39.9,-18.2 -39.7,-19.1 -40.0,-19.8 -40.3,-20.4 -40.7,-20.8 -41.3,-21.2 -41.7,-20.8 -41.5,-20.2 -41.1,-19.6 -41.2,-18.9 -41.0,-18.2 -40.5,-17.9|-50.2,-12.4 -49.8,-13.0 -49.1,-12.8 -48.6,-13.2 -47.8,-13.3 -47.1,-13.2 -46.4,-12.8 -46.2,-13.5 -46.0,-14.2 -46.3,-14.9 -46.9,-15.2 -47.1,-16.0 -47.5,-15.5 -48.2,-15.7 -47.7,-16.1 -47.3,-16.6 -47.5,-17.3 -47.3,-18.0 -47.8,-18.4 -48.6,-18.3 -49.3,-18.6 -50.2,-18.7 -50.6,-19.1 -51.5,-19.1 -52.2,-18.9 -52.9,-18.6 -53.1,-17.9 -53.1,-17.1 -52.7,-16.6 -52.3,-16.0 -51.8,-15.6 -51.5,-15.0 -51.0,-14.6 -50.9,-13.8 -50.6,-13.2 -50.3,-12.5 -50.2,-12.4|-45.8,-1.0 -45.3,-1.4 -44.7,-1.7 -44.4,-2.3 -43.5,-2.4 -42.8,-2.6 -42.0,-2.7 -42.2,-3.4 -42.7,-3.9 -42.9,-4.6 -43.0,-5.5 -42.9,-6.3 -43.3,-6.8 -44.1,-6.9 -44.6,-7.3 -45.2,-7.6 -45.6,-8.1 -45.9,-8.7 -45.8,-9.6 -46.1,-10.2 -46.6,-9.7 -46.9,-9.1 -46.8,-8.4 -47.2,-7.9 -47.5,-7.3 -47.4,-6.4 -47.5,-5.6 -48.1,-5.3 -47.8,-4.6 -47.4,-4.2 -47.0,-3.6 -46.7,-3.0 -46.4,-2.4 -46.2,-1.7 -45.9,-1.1 -45.8,-1.0|-44.2,-14.2 -43.8,-14.7 -42.9,-14.8 -42.3,-15.1 -41.5,-15.4 -40.8,-15.7 -40.2,-15.9 -40.3,-16.7 -40.6,-17.3 -40.2,-17.8 -40.8,-18.2 -41.0,-18.8 -41.1,-19.6 -41.5,-20.2 -41.9,-20.7 -42.2,-21.3 -42.6,-21.8 -43.3,-22.0 -44.1,-22.2 -44.8,-22.4 -45.4,-22.7 -46.1,-22.9 -46.5,-22.5 -46.5,-21.6 -47.1,-21.2 -47.2,-20.5 -47.7,-20.0 -48.5,-20.1 -49.2,-20.3 -49.7,-19.9 -50.5,-19.8 -50.4,-18.9 -49.8,-18.6 -49.1,-18.4 -48.3,-18.3 -47.5,-18.2 -47.4,-17.3 -47.4,-16.5 -47.1,-15.9 -46.9,-15.2 -46.4,-14.8 -45.9,-15.2 -45.3,-14.8 -44.7,-14.5 -44.2,-14.2|-56.1,-17.2 -55.5,-17.5 -54.6,-17.5 -53.8,-17.4 -53.6,-18.0 -53.0,-18.3 -52.4,-18.7 -51.9,-19.0 -51.2,-19.3 -51.0,-20.0 -51.4,-20.5 -51.8,-21.0 -52.1,-21.7 -52.5,-22.2 -53.0,-22.5 -53.6,-22.9 -53.9,-23.4 -54.2,-24.1 -55.1,-24.0 -55.5,-23.5 -55.6,-22.7 -56.1,-22.3 -57.0,-22.2 -57.8,-22.1 -57.9,-21.3 -58.0,-20.5 -58.0,-19.6 -57.7,-18.9 -57.5,-18.2 -57.8,-17.6 -57.0,-17.6 -56.3,-17.3 -56.1,-17.2|-57.6,-8.7 -57.1,-9.1 -56.3,-9.4 -55.2,-9.5 -54.3,-9.6 -53.5,-9.6 -52.4,-9.7 -51.5,-9.8 -50.3,-9.8 -50.5,-10.5 -50.7,-11.3 -50.7,-12.2 -50.5,-13.0 -50.8,-13.6 -51.0,-14.4 -51.2,-15.0 -51.7,-15.5 -52.2,-15.9 -52.7,-16.3 -53.0,-16.9 -53.2,-17.6 -53.7,-18.0 -54.2,-17.6 -55.1,-17.7 -55.7,-17.3 -56.6,-17.3 -57.1,-17.8 -57.9,-17.4 -58.4,-17.1 -58.3,-16.3 -59.5,-16.3 -60.2,-15.9 -60.6,-15.1 -60.4,-14.4 -60.7,-13.7 -60.3,-13.2 -60.0,-12.5 -60.1,-11.7 -60.3,-11.1 -61.4,-11.0 -61.6,-10.2 -61.6,-9.4 -61.2,-8.8 -60.1,-8.8 -59.1,-8.8 -58.4,-8.6 -58.3,-7.8 -57.7,-8.1 -57.6,-8.7|-55.0,2.6 -54.8,1.9 -54.1,1.6 -53.5,1.3 -53.2,0.7 -53.0,0.0 -52.6,-0.6 -52.3,-1.1 -51.7,-0.8 -51.3,-0.3 -50.8,0.1 -50.3,0.7 -49.8,0.3 -49.2,-0.1 -48.5,-0.2 -48.0,-0.7 -47.2,-0.7 -46.4,-0.9 -46.1,-1.5 -46.3,-2.2 -46.6,-2.9 -46.9,-3.4 -47.3,-4.0 -47.6,-4.6 -48.2,-4.9 -48.8,-5.3 -48.1,-5.6 -48.4,-6.3 -48.8,-6.8 -49.2,-7.3 -49.2,-8.2 -49.6,-8.8 -50.0,-9.3 -50.7,-9.8 -52.3,-9.7 -53.1,-9.6 -54.1,-9.6 -55.0,-9.5 -56.2,-9.4 -56.9,-9.2 -57.4,-8.8 -57.7,-8.2 -58.0,-7.5 -58.3,-7.0 -58.0,-6.0 -57.7,-5.3 -57.4,-4.5 -57.0,-3.8 -56.6,-3.0 -56.4,-2.3 -57.0,-1.9 -57.5,-1.6 -58.0,-1.1 -58.6,-0.8 -58.9,-0.2 -58.9,0.9 -58.5,1.4 -57.9,1.7 -57.2,2.0 -56.3,1.9 -56.0,2.5 -55.1,2.6 -55.0,2.6|-37.2,-6.0 -37.5,-6.7 -36.7,-6.9 -36.4,-6.3 -35.6,-6.5 -34.9,-6.7 -34.8,-7.5 -35.5,-7.6 -36.3,-7.8 -36.8,-8.2 -37.2,-7.7 -38.0,-7.8 -38.7,-7.6 -38.6,-6.8 -38.1,-6.5 -37.5,-6.1 -37.2,-6.0|-40.2,-7.4 -39.5,-7.6 -38.7,-7.7 -37.8,-7.6 -37.2,-7.3 -37.1,-8.1 -36.4,-7.9 -35.7,-7.7 -35.1,-7.4 -34.9,-8.0 -35.1,-8.7 -35.8,-8.9 -36.4,-9.2 -37.3,-9.2 -38.1,-9.2 -38.7,-8.9 -39.3,-8.6 -39.9,-8.9 -40.3,-9.4 -40.9,-9.0 -40.7,-8.2 -40.6,-7.4 -40.2,-7.4|-41.8,-2.8 -41.4,-3.4 -41.2,-4.0 -41.2,-4.9 -40.9,-5.5 -40.8,-6.3 -40.4,-6.8 -40.7,-7.5 -40.8,-8.3 -41.3,-8.7 -41.8,-9.1 -42.4,-9.4 -43.3,-9.4 -43.7,-9.9 -44.0,-10.5 -44.7,-10.8 -45.4,-10.6 -46.0,-10.2 -45.8,-9.5 -45.8,-8.6 -45.5,-7.9 -45.0,-7.5 -44.5,-7.2 -44.0,-6.7 -43.1,-6.7 -43.1,-5.8 -42.8,-5.2 -42.9,-4.4 -42.7,-3.7 -42.1,-3.4 -41.8,-2.8|-41.8,-20.8 -41.3,-21.2 -41.0,-21.8 -41.5,-22.2 -42.0,-22.7 -42.6,-22.9 -43.5,-23.0 -44.4,-23.0 -44.7,-22.5 -44.1,-22.2 -43.4,-22.0 -42.6,-21.9 -42.2,-21.3 -41.9,-20.8 -41.8,-20.8|-35.0,-6.5 -35.9,-6.5 -36.6,-6.7 -37.5,-6.7 -37.2,-6.1 -37.8,-6.4 -38.1,-5.7 -37.7,-5.1 -37.0,-4.9 -36.2,-5.1 -35.5,-5.2 -35.2,-5.9 -35.0,-6.5|-62.9,-8.0 -62.4,-8.4 -61.9,-8.9 -61.6,-9.4 -61.5,-10.3 -61.0,-11.0 -60.2,-11.1 -60.1,-11.9 -60.1,-12.8 -60.4,-13.4 -61.2,-13.5 -62.0,-13.4 -62.5,-13.1 -63.1,-12.7 -63.7,-12.4 -64.5,-12.3 -65.0,-11.9 -65.3,-11.3 -65.4,-10.5 -65.6,-9.8 -66.5,-9.9 -66.0,-9.4 -65.2,-9.3 -64.6,-9.0 -64.0,-8.7 -63.7,-8.1 -62.9,-8.0|-58.9,1.2 -58.9,0.3 -60.0,0.3 -60.3,-0.3 -60.6,-0.9 -61.2,-0.5 -61.5,-1.1 -62.3,-0.9 -62.3,0.0 -62.5,0.7 -62.7,1.5 -63.0,2.0 -63.6,2.4 -64.1,2.9 -64.2,3.6 -64.7,4.1 -64.0,3.9 -63.1,3.8 -62.5,4.1 -61.7,4.3 -61.1,4.5 -60.6,4.9 -60.1,4.5 -59.6,4.1 -59.8,3.4 -59.9,2.6 -59.7,1.9 -59.3,1.4 -58.9,1.2|-49.7,-29.3 -50.1,-29.9 -50.4,-30.6 -50.8,-31.1 -51.3,-31.6 -51.8,-31.9 -51.3,-31.5 -51.0,-30.9 -50.6,-30.3 -51.2,-30.0 -51.4,-30.8 -51.8,-31.3 -52.2,-31.8 -52.4,-32.6 -52.7,-33.3 -53.3,-33.7 -53.2,-32.9 -52.6,-32.5 -53.5,-32.5 -53.9,-32.0 -54.5,-31.7 -55.0,-31.3 -55.5,-30.9 -56.2,-30.7 -56.6,-30.2 -57.5,-30.3 -57.1,-29.7 -56.7,-29.3 -56.2,-28.8 -55.7,-28.3 -55.2,-27.9 -54.6,-27.5 -54.0,-27.2 -53.2,-27.1 -52.4,-27.3 -51.7,-27.5 -51.1,-27.8 -50.7,-28.3 -49.9,-28.5 -50.1,-29.2 -49.7,-29.3|-48.6,-26.0 -48.6,-26.9 -48.4,-27.6 -48.7,-28.3 -49.2,-28.8 -49.7,-29.3 -49.8,-28.5 -50.6,-28.4 -51.1,-27.9 -51.6,-27.5 -52.3,-27.3 -53.0,-27.1 -53.8,-27.0 -53.6,-26.3 -52.8,-26.3 -52.1,-26.5 -51.3,-26.7 -50.8,-26.2 -50.1,-26.0 -49.2,-26.0 -48.6,-26.0|-36.4,-10.5 -37.0,-10.9 -37.3,-11.4 -38.0,-11.2 -37.9,-10.4 -38.0,-9.7 -37.3,-9.9 -36.8,-10.2 -36.4,-10.5|-48.4,-5.2 -47.7,-5.4 -47.4,-6.1 -47.5,-6.9 -47.4,-7.7 -46.7,-7.9 -46.9,-8.6 -46.8,-9.4 -46.5,-10.0 -45.8,-10.3 -46.2,-10.7 -46.6,-11.3 -46.3,-11.9 -46.3,-12.8 -46.9,-13.1 -47.7,-13.2 -48.5,-13.3 -49.0,-12.9 -49.8,-13.0 -50.2,-12.5 -50.7,-12.1 -50.7,-11.2 -50.5,-10.4 -50.2,-9.8 -49.9,-9.1 -49.5,-8.6 -49.2,-8.0 -49.2,-7.1 -48.7,-6.7 -48.3,-6.1 -48.5,-5.4 -48.4,-5.2|-48.1,-25.3 -48.5,-25.8 -49.2,-26.0 -50.1,-26.0 -50.8,-26.2 -51.3,-26.7 -52.1,-26.5 -52.8,-26.3 -53.6,-26.3 -53.9,-25.6 -54.6,-25.5 -54.4,-24.8 -54.2,-24.0 -53.9,-23.4 -53.5,-22.9 -52.9,-22.6 -52.1,-22.5 -51.3,-22.7 -50.7,-23.0 -49.9,-23.0 -49.6,-23.6 -49.3,-24.2 -48.8,-24.7 -48.3,-25.0 -48.1,-25.3|-50.5,-19.8 -49.7,-19.9 -49.2,-20.3 -48.5,-20.1 -47.7,-20.0 -47.3,-20.5 -47.1,-21.2 -46.5,-21.5 -46.7,-22.2 -46.3,-22.8 -45.6,-22.6 -44.9,-22.4 -44.2,-22.6 -44.8,-23.0 -45.1,-23.5 -45.8,-23.8 -46.4,-24.0 -47.0,-24.3 -47.5,-24.7 -47.9,-25.2 -48.6,-24.9 -49.3,-24.7 -49.5,-24.0 -49.6,-23.3 -50.2,-23.0 -51.0,-22.8 -51.7,-22.6 -52.6,-22.6 -52.3,-21.9 -51.9,-21.4 -51.6,-20.8 -51.2,-20.3 -50.7,-19.9 -50.5,-19.8";
      CONT = [[12.4, -71.7], [11, -74.2], [10.4, -75.5], [8.5, -76.9], [7.2, -77.8], [4, -77.3], [1.5, -78.9], [-2, -80.9], [-4.5, -81.3], [-6, -81], [-8, -79.2], [-12, -77.2], [-14, -76.2], [-17, -72.2], [-18.4, -70.3], [-23, -70.4], [-27, -70.9], [-33, -71.7], [-37, -73.4], [-41.5, -73.8], [-46, -75.5], [-50, -75.5], [-53, -74.5], [-55.5, -68], [-54.5, -65], [-52, -68.4], [-50, -69], [-47, -65.8], [-45, -65.6], [-42, -63.7], [-40.7, -62.2], [-39, -62], [-38.8, -58], [-36.5, -56.5], [-35, -57], [-34.9, -54.9], [-33.7, -53.4], [-30, -50.5], [-28.5, -48.7], [-25.5, -48.5], [-23.8, -45.5], [-23, -43], [-21, -40.9], [-18, -39.6], [-14, -39], [-12.9, -38.4], [-10.5, -36.5], [-8, -34.8], [-5.2, -35.3], [-3.5, -38.5], [-2.8, -41], [-2.5, -44], [-0.7, -47.5], [0, -50], [2, -50.5], [4.5, -51.6], [5.7, -53.5], [6.8, -57.2], [8.5, -60], [10.6, -61.5], [10.6, -63.5], [10.7, -66], [11, -68.5]];
      CID = [["S\xE3o Paulo", -23.55, -46.63, 1], ["Rio de Janeiro", -22.91, -43.17, 1], ["Belo Horizonte", -19.92, -43.94, 1], ["Bras\xEDlia", -15.79, -47.88, 1], ["Salvador", -12.97, -38.51, 1], ["Fortaleza", -3.73, -38.52, 1], ["Recife", -8.05, -34.88, 1], ["Manaus", -3.12, -60.02, 1], ["Bel\xE9m", -1.46, -48.5, 1], ["Porto Alegre", -30.03, -51.23, 1], ["Curitiba", -25.43, -49.27, 1], ["Goi\xE2nia", -16.68, -49.25, 1], ["Cuiab\xE1", -15.6, -56.1, 1], ["Campo Grande", -20.46, -54.62, 1], ["Porto Velho", -8.76, -63.9, 2], ["Rio Branco", -9.97, -67.81, 2], ["Macap\xE1", 0.03, -51.07, 2], ["Boa Vista", 2.82, -60.67, 2], ["Palmas", -10.18, -48.33, 2], ["S\xE3o Lu\xEDs", -2.53, -44.3, 2], ["Teresina", -5.09, -42.8, 2], ["Natal", -5.79, -35.21, 2], ["Jo\xE3o Pessoa", -7.12, -34.86, 2], ["Macei\xF3", -9.67, -35.74, 2], ["Aracaju", -10.91, -37.07, 2], ["Vit\xF3ria", -20.32, -40.34, 2], ["Florian\xF3polis", -27.6, -48.55, 2], ["Campinas", -22.9, -47.06, 3], ["Santos", -23.96, -46.33, 3], ["Ribeir\xE3o Preto", -21.18, -47.81, 3], ["Uberl\xE2ndia", -18.92, -48.28, 3], ["Londrina", -23.31, -51.16, 3], ["Joinville", -26.3, -48.85, 3], ["Feira de Santana", -12.27, -38.97, 3], ["Imperatriz", -5.52, -47.48, 3], ["Santar\xE9m", -2.44, -54.7, 3], ["Cascavel", -24.96, -53.46, 3], ["Juiz de Fora", -21.76, -43.35, 3], ["Petrolina", -9.39, -40.5, 3]];
      ROD = [
        ["BR-116", [[-3.73, -38.52], [-7.2, -39.3], [-9.4, -40.5], [-12.27, -38.97], [-14.86, -40.84], [-18.85, -41.95], [-21.76, -43.35], [-22.91, -43.17], [-23.55, -46.63], [-25.43, -49.27], [-27.8, -50.3], [-30.03, -51.23]]],
        ["BR-101", [[-5.79, -35.21], [-8.05, -34.88], [-9.67, -35.74], [-10.91, -37.07], [-12.97, -38.51], [-17.5, -39.7], [-20.32, -40.34], [-22.91, -43.17], [-23.96, -46.33], [-25.5, -48.6], [-27.6, -48.55], [-30.03, -51.23]]],
        ["BR-153", [[-1.46, -48.5], [-5.52, -47.48], [-10.18, -48.33], [-16.68, -49.25], [-18.92, -48.28], [-20.82, -49.38], [-23.55, -46.63]]],
        ["BR-040", [[-15.79, -47.88], [-19.92, -43.94], [-22.91, -43.17]]],
        ["BR-381", [[-19.92, -43.94], [-22.9, -47.06], [-23.55, -46.63]]],
        ["BR-163", [[-20.46, -54.62], [-15.6, -56.1], [-9.9, -55.9], [-2.44, -54.7]]],
        ["BR-364", [[-9.97, -67.81], [-8.76, -63.9], [-12.5, -60.1], [-15.6, -56.1], [-16.68, -49.25]]],
        ["BR-262", [[-23.55, -46.63], [-21.18, -47.81], [-20.46, -54.62]]],
        ["BR-135", [[-2.53, -44.3], [-5.09, -42.8], [-9.39, -40.5], [-12.9, -44.2], [-19.92, -43.94]]],
        ["BR-319", [[-8.76, -63.9], [-3.12, -60.02]]]
      ];
    }
  });

  // lib/enquadrar.ts
  function criarEnquadramento(L, map, container) {
    let mexeu = false;
    let ultimos = [];
    const marcar = () => {
      mexeu = true;
    };
    container.addEventListener("pointerdown", marcar);
    container.addEventListener("wheel", marcar, { passive: true });
    function aplicar() {
      try {
        map.invalidateSize();
        const pts = ultimos.filter(valido);
        const margem = { padding: [20, 20], animate: false };
        if (pts.length >= 2) map.fitBounds(L.latLngBounds(pts), { ...margem, maxZoom: 9 });
        else if (pts.length === 1) map.setView(pts[0], 9, { animate: false });
        else map.fitBounds(BRASIL, margem);
      } catch {
      }
    }
    let timers = [];
    function aplicarJa() {
      timers.forEach(clearTimeout);
      aplicar();
      timers = [400, 1200].map((ms) => setTimeout(() => {
        if (!mexeu) aplicar();
      }, ms));
    }
    return {
      /** Enquadra nestes pontos (vazio = Brasil). Não mexe se a pessoa já ajustou o mapa. */
      enquadrar(pontos) {
        ultimos = pontos || [];
        if (!mexeu) aplicarJa();
      },
      /** Chamar quando o tamanho do mapa mudar. */
      redimensionou() {
        if (mexeu) {
          try {
            map.invalidateSize();
          } catch {
          }
        } else aplicarJa();
      },
      /** Volta ao enquadramento automático (botão "Enquadrar"). */
      reiniciar() {
        mexeu = false;
        aplicarJa();
      },
      desligar() {
        timers.forEach(clearTimeout);
        container.removeEventListener("pointerdown", marcar);
        container.removeEventListener("wheel", marcar);
      }
    };
  }
  var BRASIL, valido;
  var init_enquadrar = __esm({
    "lib/enquadrar.ts"() {
      BRASIL = [[-33.75, -73.99], [5.27, -34.79]];
      valido = (p) => Array.isArray(p) && isFinite(p[0]) && isFinite(p[1]) && Math.abs(p[0]) <= 90 && Math.abs(p[1]) <= 180 && !(p[0] === 0 && p[1] === 0);
    }
  });

  // lib/mapdata.ts
  function ehPontoDeApoio(nome) {
    return /jaragu|cajamar/i.test(String(nome || ""));
  }
  function baseHtml(nome) {
    const apoio = ehPontoDeApoio(nome);
    const bg = apoio ? "#FF6A00" : "#f5c518";
    const icon = apoio ? GEAR_PATH : HOUSE_PATH;
    const stroke = apoio ? "#ffffff" : "#3a2c00";
    return '<div style="position:relative;width:28px;height:28px"><div style="position:absolute;inset:0;border-radius:8px;background:' + bg + ';border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="' + stroke + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + icon + "</svg></div></div>";
  }
  function houseHtml(nome) {
    return baseHtml(nome);
  }
  var BASES, HOUSE_PATH, GEAR_PATH;
  var init_mapdata = __esm({
    "lib/mapdata.ts"() {
      BASES = [
        { nome: "Bras\xEDlia", lat: -15.879206579466054, lng: -48.05441234030712 },
        { nome: "Bel\xE9m", lat: -1.3724013091498326, lng: -48.383622109515485 },
        { nome: "Vit\xF3ria", lat: -20.120071362483003, lng: -40.30156995513909 },
        { nome: "Cajamar", lat: -23.350170477479963, lng: -46.84882278293573 },
        { nome: "Jaragu\xE1", lat: -23.44340591477374, lng: -46.75876096574071 },
        { nome: "S\xE3o Lu\xEDs", lat: -2.6674697348733076, lng: -44.288149134279436 },
        { nome: "Porto Velho", lat: -8.79909146146087, lng: -63.80255258793686 },
        { nome: "Curitiba", lat: -25.43307217312485, lng: -49.16251451914275 },
        { nome: "Vit\xF3ria da Conquista", lat: -14.89830137003894, lng: -40.84380968409488 },
        { nome: "Feira de Santana", lat: -12.232095340215363, lng: -38.9578963111289 },
        { nome: "Recife", lat: -8.08002177893195, lng: -34.943434567006754 },
        { nome: "Campo Grande", lat: -20.492123682511714, lng: -54.61743780391561 },
        { nome: "Cuiab\xE1", lat: -15.64616729507622, lng: -56.189760492822465 }
      ];
      HOUSE_PATH = '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-5h4v5"/>';
      GEAR_PATH = '<path d="M12.2 2h-.4a2 2 0 0 0-2 2v.2a2 2 0 0 1-1 1.7l-.4.3a2 2 0 0 1-2 0l-.2-.1a2 2 0 0 0-2.7.7l-.2.4a2 2 0 0 0 .7 2.7l.2.1a2 2 0 0 1 1 1.7v.5a2 2 0 0 1-1 1.7l-.2.1a2 2 0 0 0-.7 2.7l.2.4a2 2 0 0 0 2.7.7l.2-.1a2 2 0 0 1 2 0l.4.3a2 2 0 0 1 1 1.7V20a2 2 0 0 0 2 2h.4a2 2 0 0 0 2-2v-.2a2 2 0 0 1 1-1.7l.4-.3a2 2 0 0 1 2 0l.2.1a2 2 0 0 0 2.7-.7l.2-.4a2 2 0 0 0-.7-2.7l-.2-.1a2 2 0 0 1-1-1.7v-.5a2 2 0 0 1 1-1.7l.2-.1a2 2 0 0 0 .7-2.7l-.2-.4a2 2 0 0 0-2.7-.7l-.2.1a2 2 0 0 1-2 0l-.4-.3a2 2 0 0 1-1-1.7V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3.1"/>';
    }
  });

  // shims/leaflet.js
  var require_leaflet = __commonJS({
    "shims/leaflet.js"(exports, module) {
      module.exports = window.L;
      module.exports.default = window.L;
    }
  });

  // components/MapaBrasil.tsx
  var MapaBrasil_exports = {};
  __export(MapaBrasil_exports, {
    default: () => MapaBrasil
  });
  function MapaBrasil({ prestadores, bases }) {
    const containerRef = (0, import_react6.useRef)(null);
    const mapRef = (0, import_react6.useRef)(null);
    const markersRef = (0, import_react6.useRef)([]);
    const basesRef = (0, import_react6.useRef)([]);
    const roRef = (0, import_react6.useRef)(null);
    const enqRef = (0, import_react6.useRef)(null);
    (0, import_react6.useEffect)(() => {
      if (typeof window === "undefined" || !containerRef.current) return;
      let L;
      try {
        L = require_leaflet();
      } catch {
        return;
      }
      const container = containerRef.current;
      if (container._leaflet_id) {
        enqRef.current?.redimensionou();
        return;
      }
      mapRef.current = L.map(container, { center: CENTER, zoom: ZOOM, minZoom: 3, maxZoom: 18, zoomSnap: 0.25, zoomDelta: 0.5, zoomControl: true, attributionControl: true });
      addBrasil(L, mapRef.current);
      enqRef.current = criarEnquadramento(L, mapRef.current, container);
      roRef.current = new ResizeObserver(() => {
        enqRef.current?.redimensionou();
      });
      roRef.current.observe(container);
      return () => {
        roRef.current?.disconnect();
        enqRef.current?.desligar();
      };
    }, []);
    (0, import_react6.useEffect)(() => {
      enqRef.current?.enquadrar(prestadores.filter((p) => p.lat && p.lng).map((p) => [Number(p.lat), Number(p.lng)]));
    }, [prestadores]);
    (0, import_react6.useEffect)(() => {
      if (!mapRef.current) return;
      let L;
      try {
        L = require_leaflet();
      } catch {
        return;
      }
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      prestadores.forEach((p) => {
        if (!p.lat || !p.lng) return;
        const color = segOf(p.tipo_servico).cor;
        const html = vehHtml(color, "truck", false);
        const icon = L.divIcon({ html, className: "", iconSize: [16, 16], iconAnchor: [8, 8] });
        const marker = L.marker([p.lat, p.lng], { icon }).addTo(mapRef.current);
        marker.bindPopup(
          '<div style="font-family:Arial,sans-serif;font-size:12px;min-width:160px"><b>' + p.nome + "</b><br/>" + p.cidade + " &mdash; " + p.estado + '<br/><span style="color:' + color + ';font-weight:bold">\u25CF ' + segOf(p.tipo_servico).nome + "</span><br/><small>" + (p.fatura ? "Faturado" : "N\xE3o faturado") + "</small>" + (p.socorro_24h ? '<br/><small style="color:#2dc62d">\u2713 Socorro 24h</small>' : "") + "</div>"
        );
        markersRef.current.push(marker);
      });
    }, [prestadores]);
    (0, import_react6.useEffect)(() => {
      if (!mapRef.current) return;
      let L;
      try {
        L = require_leaflet();
      } catch {
        return;
      }
      basesRef.current.forEach((m) => m.remove());
      basesRef.current = [];
      (bases && bases.length ? bases : BASES).forEach((b) => {
        const icon = L.divIcon({ html: houseHtml(b.nome), className: "", iconSize: [28, 28], iconAnchor: [14, 14] });
        const mk = L.marker([b.lat, b.lng], { icon, zIndexOffset: 900 }).addTo(mapRef.current);
        mk.bindPopup('<div style="font-family:Arial,sans-serif;font-size:12px;min-width:180px"><b>Base ' + b.nome + "</b><br/>" + (b.endereco || "Ponto fixo da opera\xE7\xE3o") + "</div>");
        basesRef.current.push(mk);
      });
    }, [bases]);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("style", null, `@keyframes mpb-pulse{0%{transform:scale(.6);opacity:.4}100%{transform:scale(2.4);opacity:0}}`), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: "100%", height: "100%" } }, /* @__PURE__ */ React.createElement("div", { ref: containerRef, style: { width: "100%", height: "100%" } }), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => enqRef.current?.reiniciar(), title: "Voltar ao enquadramento autom\xE1tico", style: { position: "absolute", top: 10, right: 10, zIndex: 500, background: "rgba(12,17,20,.88)", color: "#e8f2ec", border: "1px solid rgba(255,255,255,.18)", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", minHeight: "var(--alvo, 44px)" } }, "Enquadrar"), prestadores.some((p) => p.lat && p.lng) && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: 10, bottom: 10, zIndex: 500, background: "rgba(12,17,20,.88)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 10, padding: "8px 10px", fontSize: 10, color: "#e8f2ec", lineHeight: 1.7 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8.5, letterSpacing: ".12em", textTransform: "uppercase", opacity: 0.6, marginBottom: 3 } }, "Segmentos"), Array.from(new Map(Object.values(SEG).map((v) => [v.nome, v])).values()).filter((v) => prestadores.some((p) => segOf(p.tipo_servico).nome === v.nome)).map((v) => /* @__PURE__ */ React.createElement("div", { key: v.nome, style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { width: 9, height: 9, borderRadius: "50%", background: v.cor, display: "inline-block" } }), v.nome, /* @__PURE__ */ React.createElement("b", { style: { marginLeft: "auto", paddingLeft: 10 } }, prestadores.filter((p) => p.lat && p.lng && segOf(p.tipo_servico).nome === v.nome).length))))));
  }
  var import_react6, SEG, segOf, CENTER, ZOOM;
  var init_MapaBrasil = __esm({
    "components/MapaBrasil.tsx"() {
      init_vehicon();
      init_brmap();
      init_enquadrar();
      init_mapdata();
      import_react6 = __toESM(require_react());
      SEG = {
        guincho: { cor: "#facc15", nome: "Guincho" },
        eletronica: { cor: "#3b82f6", nome: "El\xE9trica / Eletr\xF4nica" },
        eletrico: { cor: "#3b82f6", nome: "El\xE9trica / Eletr\xF4nica" },
        mecanico: { cor: "#22c55e", nome: "Mec\xE2nica" },
        borracharia: { cor: "#f97316", nome: "Borracharia" },
        pneus: { cor: "#f97316", nome: "Borracharia" },
        freio: { cor: "#ef4444", nome: "Freios" },
        combustivel: { cor: "#a855f7", nome: "Combust\xEDvel" },
        funilaria: { cor: "#ec4899", nome: "Funilaria" },
        bau: { cor: "#06b6d4", nome: "Ba\xFA" },
        eletrica_mecanica: { cor: "#14b8a6", nome: "El\xE9trica / Mec\xE2nica" },
        outros: { cor: "#94a3b8", nome: "Outros" }
      };
      segOf = (t) => SEG[String(t || "").toLowerCase()] || SEG.outros;
      CENTER = [-14.2, -51.9];
      ZOOM = 4;
    }
  });

  // components/MapaAtendimento.tsx
  var MapaAtendimento_exports = {};
  __export(MapaAtendimento_exports, {
    default: () => MapaAtendimento
  });
  function slaInfo(abertura) {
    if (!abertura) return { color: "#2dc62d", label: "NORMAL" };
    const min = Math.floor((Date.now() - new Date(abertura).getTime()) / 6e4);
    if (min >= 120) return { color: "#ef4444", label: "CR\xCDTICO" };
    if (min >= 60) return { color: "#f5c518", label: "ATEN\xC7\xC3O" };
    return { color: "#2dc62d", label: "NORMAL" };
  }
  function timeLabel(abertura) {
    if (!abertura) return "0 min";
    const s = Math.floor((Date.now() - new Date(abertura).getTime()) / 1e3);
    if (s < 3600) return Math.floor(s / 60) + " min";
    const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60);
    if (d > 0) return d + "d " + h + "h";
    return h + "h " + String(m).padStart(2, "0") + "min";
  }
  function buildDot(color, speed) {
    return '<div style="position:relative;width:28px;height:28px"><div style="position:absolute;inset:0;border-radius:50%;border:2px solid ' + color + ";animation:mpa-ring " + speed + ' ease-out infinite;"></div><div style="position:absolute;inset:7px;border-radius:50%;background:' + color + ";box-shadow:0 0 8px " + color + ";animation:mpa-pulse " + speed + ' ease-in-out infinite;"></div></div>';
  }
  function buildTruck(color, rodando) {
    return vehHtml(color, "truck", false);
  }
  function MapaAtendimento({ ordens, posicoes, veiculos, bases }) {
    const containerRef = (0, import_react7.useRef)(null);
    const mapRef = (0, import_react7.useRef)(null);
    const markersRef = (0, import_react7.useRef)([]);
    const basesRef = (0, import_react7.useRef)([]);
    const truckRef = (0, import_react7.useRef)([]);
    const roRef = (0, import_react7.useRef)(null);
    const enqRef = (0, import_react7.useRef)(null);
    const [tick, setTick] = (0, import_react7.useState)(0);
    (0, import_react7.useEffect)(() => {
      const t = setInterval(() => setTick((p) => p + 1), 6e4);
      return () => clearInterval(t);
    }, []);
    (0, import_react7.useEffect)(() => {
      if (typeof window === "undefined" || !containerRef.current) return;
      let L;
      try {
        L = require_leaflet();
      } catch {
        return;
      }
      const container = containerRef.current;
      if (container._leaflet_id) {
        enqRef.current?.redimensionou();
        return;
      }
      mapRef.current = L.map(container, { center: CENTER2, zoom: ZOOM2, minZoom: 3, maxZoom: 18, zoomSnap: 0.25, zoomDelta: 0.5, zoomControl: true, attributionControl: true });
      addBrasil(L, mapRef.current);
      enqRef.current = criarEnquadramento(L, mapRef.current, container);
      roRef.current = new ResizeObserver(() => {
        enqRef.current?.redimensionou();
      });
      roRef.current.observe(container);
      return () => {
        roRef.current?.disconnect();
        enqRef.current?.desligar();
      };
    }, []);
    (0, import_react7.useEffect)(() => {
      const pos = posicoes || {};
      const pts = ordens.map((o) => pos[(o.placa || "").toUpperCase()]).filter((p) => p && p.lat != null && p.lng != null).map((p) => [Number(p.lat), Number(p.lng)]);
      enqRef.current?.enquadrar(pts);
    }, [ordens, posicoes]);
    (0, import_react7.useEffect)(() => {
      if (!mapRef.current) return;
      let L;
      try {
        L = require_leaflet();
      } catch {
        return;
      }
      truckRef.current.forEach((m) => m.remove());
      truckRef.current = [];
      const pos = posicoes || {};
      const emManut = new Set(ordens.map((o) => (o.placa || "").toUpperCase()).filter(Boolean));
      Object.keys(pos).forEach((placa) => {
        const p = pos[placa];
        if (!p || p.lat == null || p.lng == null) return;
        const up = placa.toUpperCase();
        const manut = emManut.has(up);
        if (Number(p.velocidade || 0) > 5) return;
        const color = "#3b82f6";
        const label = manut ? "PARADO \xB7 COM O.S." : "PARADO";
        const icon = L.divIcon({ html: buildTruck(color, !manut), className: "", iconSize: [16, 16], iconAnchor: [8, 8] });
        const marker = L.marker([p.lat, p.lng], { icon, zIndexOffset: 500 }).addTo(mapRef.current);
        const veic = (veiculos || []).find((v) => (v.placa || "").toUpperCase() === up);
        marker.bindPopup(
          '<div style="font-family:Arial,sans-serif;font-size:12px;min-width:170px;padding:2px 0"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px"><span style="font-weight:bold">' + up + '</span><span style="font-size:10px;font-weight:bold;background:' + color + ';color:#fff;padding:1px 6px;border-radius:8px">' + label + "</span></div>" + (veic && (veic.nome || veic.modelo) ? "<div><b>Ve\xEDculo:</b> " + (veic.nome || veic.modelo) + "</div>" : "") + "<div><b>Velocidade:</b> " + p.velocidade + ' km/h</div><div style="color:#6b7280;font-size:11px;margin-top:3px">' + (p.data || "") + "</div></div>"
        );
        truckRef.current.push(marker);
      });
    }, [ordens, posicoes, veiculos, tick]);
    (0, import_react7.useEffect)(() => {
      if (!mapRef.current) return;
      let L;
      try {
        L = require_leaflet();
      } catch {
        return;
      }
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      const pos = posicoes || {};
      const semPos = ordens.filter((o) => !(o.placa && pos[(o.placa || "").toUpperCase()]));
      if (semPos.length >= 0) return;
      semPos.forEach((ordem, idx) => {
        const filial = ordem.operacao || "S\xE3o Paulo";
        const base = FILIAL_COORDS[filial] ?? FILIAL_COORDS["S\xE3o Paulo"];
        const info = slaInfo(ordem.abertura);
        const seed = SEEDS[idx % SEEDS.length];
        const lat = base[0] + seed[0], lng = base[1] + seed[1];
        const mins = ordem.abertura ? Math.floor((Date.now() - new Date(ordem.abertura).getTime()) / 6e4) : 0;
        const speed = mins >= 120 ? "0.8s" : mins >= 60 ? "1.2s" : "2s";
        const icon = L.divIcon({ html: buildDot(info.color, speed), className: "", iconSize: [28, 28], iconAnchor: [14, 14] });
        const marker = L.marker([lat, lng], { icon }).addTo(mapRef.current);
        marker.bindPopup(
          '<div style="font-family:Arial,sans-serif;font-size:12px;min-width:170px;padding:2px 0"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:5px"><span style="font-weight:bold">OS #' + (ordem.os || "\u2014") + '</span><span style="font-size:10px;font-weight:bold;background:' + info.color + ';color:#fff;padding:1px 6px;border-radius:8px">' + info.label + "</span></div><div><b>Placa:</b> " + (ordem.placa || "\u2014") + "</div><div><b>Filial:</b> " + filial + "</div><div><b>Status:</b> " + (ordem.status || "\u2014") + '</div><div style="color:' + info.color + ';font-weight:bold;font-size:13px;margin-top:5px">' + timeLabel(ordem.abertura) + " em aberto</div></div>"
        );
        markersRef.current.push(marker);
      });
    }, [ordens, posicoes, tick]);
    (0, import_react7.useEffect)(() => {
      if (!mapRef.current) return;
      let L;
      try {
        L = require_leaflet();
      } catch {
        return;
      }
      basesRef.current.forEach((m) => m.remove());
      basesRef.current = [];
      (bases && bases.length ? bases : BASES).forEach((b) => {
        const icon = L.divIcon({ html: houseHtml(b.nome), className: "", iconSize: [28, 28], iconAnchor: [14, 14] });
        const mk = L.marker([b.lat, b.lng], { icon, zIndexOffset: 900 }).addTo(mapRef.current);
        mk.bindPopup('<div style="font-family:Arial,sans-serif;font-size:12px;min-width:180px"><b>Base ' + b.nome + "</b><br/>" + (b.endereco || "Ponto fixo da opera\xE7\xE3o") + "</div>");
        basesRef.current.push(mk);
      });
    }, [bases]);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("style", null, `
        @keyframes mpa-ring {
          0%   { transform: scale(0.8); opacity: 0.9; }
          100% { transform: scale(2.6); opacity: 0; }
        }
        @keyframes mpa-pulse {
          0%,100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.18); opacity: 0.75; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes mpa-ring  { from {} to {} }
          @keyframes mpa-pulse { from {} to {} }
        }
      `), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: "100%", height: "100%" } }, /* @__PURE__ */ React.createElement("div", { ref: containerRef, style: { width: "100%", height: "100%" } }), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => enqRef.current?.reiniciar(), title: "Voltar ao enquadramento autom\xE1tico", style: { position: "absolute", top: 10, right: 10, zIndex: 500, background: "rgba(12,17,20,.88)", color: "#e8f2ec", border: "1px solid rgba(255,255,255,.18)", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", minHeight: "var(--alvo, 44px)" } }, "Enquadrar")));
  }
  var import_react7, FILIAL_COORDS, CENTER2, ZOOM2, SEEDS;
  var init_MapaAtendimento = __esm({
    "components/MapaAtendimento.tsx"() {
      init_vehicon();
      init_brmap();
      init_enquadrar();
      init_mapdata();
      import_react7 = __toESM(require_react());
      FILIAL_COORDS = {
        "Bel\xE9m": [-1.455, -48.502],
        "Bras\xEDlia": [-15.78, -47.93],
        "Campo Grande": [-20.469, -54.62],
        "Curitiba": [-25.428, -49.273],
        "Distrito Federal": [-15.78, -47.93],
        "Diversos": [-16, -48],
        "Feira de Santana": [-12.266, -38.966],
        "Manaus": [-3.119, -60.021],
        "Porto Velho": [-8.76, -63.9],
        "Recife": [-8.047, -34.877],
        "Salvador": [-12.971, -38.501],
        "S\xE3o Paulo": [-23.55, -46.633],
        "Serra ES": [-20.128, -40.307],
        "Uberaba": [-19.748, -47.931],
        "Vit\xF3ria da Conquista": [-14.866, -40.844]
      };
      CENTER2 = [-14.2, -51.9];
      ZOOM2 = 4;
      SEEDS = Array.from({ length: 200 }, (_, i) => [
        ((i * 7 + 3) % 21 - 10) / 1e3,
        ((i * 13 + 7) % 21 - 10) / 1e3
      ]);
    }
  });

  // components/MapaFrota.tsx
  var MapaFrota_exports = {};
  __export(MapaFrota_exports, {
    default: () => MapaFrota
  });
  function truckIcon(color, pulso) {
    return vehHtml(color, "truck", false);
  }
  function clusterIcon(count, cor) {
    const size = count > 100 ? 46 : count > 20 ? 40 : 34;
    return '<div style="width:' + size + "px;height:" + size + "px;border-radius:50%;background:rgba(10,16,20,.92);border:2.5px solid " + cor + ";box-shadow:0 0 0 4px " + cor + "22, 0 3px 10px rgba(0,0,0,.55);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-family:ui-monospace,monospace;font-size:" + (count > 100 ? 14 : 12) + 'px">' + count + "</div>";
  }
  function MapaFrota({ posicoes, ordens, bases }) {
    const containerRef = (0, import_react8.useRef)(null);
    const mapRef = (0, import_react8.useRef)(null);
    const layerRef = (0, import_react8.useRef)(null);
    const roRef = (0, import_react8.useRef)(null);
    const [contagem, setContagem] = (0, import_react8.useState)({ rodando: 0, manut: 0, parado: 0 });
    const [busca, setBusca] = (0, import_react8.useState)("");
    const [sel, setSel] = (0, import_react8.useState)(null);
    (0, import_react8.useEffect)(() => {
      if (typeof window === "undefined" || !containerRef.current) return;
      let L;
      try {
        L = require_leaflet();
      } catch {
        return;
      }
      const container = containerRef.current;
      if (container._leaflet_id) {
        if (mapRef.current) {
          mapRef.current.invalidateSize();
        }
        return;
      }
      mapRef.current = L.map(container, { center: CENTER3, zoom: ZOOM3, minZoom: 3, maxZoom: 18, zoomControl: true, attributionControl: true });
      addBrasil(L, mapRef.current);
      layerRef.current = L.layerGroup().addTo(mapRef.current);
      roRef.current = new ResizeObserver(() => {
        if (mapRef.current) mapRef.current.invalidateSize();
      });
      roRef.current.observe(container);
      return () => {
        roRef.current?.disconnect();
      };
    }, []);
    (0, import_react8.useEffect)(() => {
      const map = mapRef.current;
      if (!map) return;
      let L;
      try {
        L = require_leaflet();
      } catch {
        return;
      }
      const emManut = {};
      (ordens || []).forEach((o) => {
        const p = (o.placa || "").toUpperCase().split("-")[0].trim();
        if (p) emManut[p] = o.os;
      });
      const pontos = [];
      const pos = posicoes || {};
      Object.keys(pos).forEach((placa) => {
        const p = pos[placa];
        if (!p || p.lat == null || p.lng == null) return;
        const up = placa.toUpperCase();
        const vel = Number(p.velocidade || 0);
        const osNum = emManut[up];
        let cor = COR_PARADO, label = "PARADO";
        if (vel > 5) {
          cor = COR_RODANDO;
          label = "EM MOVIMENTO";
        }
        pontos.push({ placa: up, lat: Number(p.lat), lng: Number(p.lng), vel, osNum, cor, label, raw: p });
      });
      setContagem({
        rodando: pontos.filter((x) => x.cor === COR_RODANDO).length,
        manut: pontos.filter((x) => x.cor === COR_MANUT).length,
        parado: pontos.filter((x) => x.cor === COR_PARADO).length
      });
      function desenhar() {
        const layer = layerRef.current;
        if (!layer || !map) return;
        layer.clearLayers();
        const z = map.getZoom();
        (bases && bases.length ? bases : BASES).forEach((b) => {
          const ic = L.divIcon({ html: houseHtml(b.nome), className: "", iconSize: [28, 28], iconAnchor: [14, 14] });
          const mk = L.marker([b.lat, b.lng], { icon: ic, zIndexOffset: 900 });
          mk.bindPopup('<div style="font-family:Arial,sans-serif;font-size:12px;min-width:180px"><b>Base ' + b.nome + "</b><br/>" + (b.endereco || "Ponto fixo da opera\xE7\xE3o") + "</div>");
          mk.addTo(layer);
        });
        const grupos = {};
        pontos.forEach((pt) => {
          const pr = map.project([pt.lat, pt.lng], z);
          const key = Math.floor(pr.x / CELL) + ":" + Math.floor(pr.y / CELL);
          (grupos[key] = grupos[key] || []).push(pt);
        });
        Object.keys(grupos).forEach((key) => {
          const g = grupos[key];
          if (g.length === 1) {
            const pt = g[0];
            const ic = L.divIcon({ html: truckIcon(pt.cor, !!pt.osNum || pt.vel > 5), className: "", iconSize: [16, 16], iconAnchor: [8, 8] });
            const mk = L.marker([pt.lat, pt.lng], { icon: ic });
            mk.bindPopup(
              '<div style="font-family:Arial,sans-serif;font-size:12px;min-width:185px"><div style="display:flex;justify-content:space-between;margin-bottom:5px"><b>' + pt.placa + '</b><span style="font-size:10px;font-weight:700;background:' + pt.cor + ';color:#fff;padding:1px 6px;border-radius:8px">' + pt.label + "</span></div>" + (pt.raw.motorista ? "<div><b>Motorista:</b> " + pt.raw.motorista + "</div>" : "") + "<div><b>Velocidade:</b> " + pt.vel + " km/h</div>" + (pt.raw.odometro ? "<div><b>KM:</b> " + Number(pt.raw.odometro).toLocaleString("pt-BR") + "</div>" : "") + (pt.raw.tensao != null ? "<div><b>Bateria:</b> " + pt.raw.tensao + " V</div>" : "") + "<div><b>Local:</b> " + (pt.raw.cidade || "\u2014") + (pt.raw.uf ? "/" + pt.raw.uf : "") + "</div>" + (pt.osNum ? '<div style="margin-top:4px"><b>O.S.:</b> ' + pt.osNum + "</div>" : "") + "</div>"
            );
            mk.addTo(layer);
          } else {
            const lat = g.reduce((a, p) => a + p.lat, 0) / g.length;
            const lng = g.reduce((a, p) => a + p.lng, 0) / g.length;
            const criticos = g.filter((p) => p.osNum).length;
            const rodando = g.filter((p) => p.cor === COR_RODANDO).length;
            const cor = rodando > 0 ? COR_RODANDO : COR_PARADO;
            const ic = L.divIcon({ html: clusterIcon(g.length, cor), className: "", iconSize: [48, 48], iconAnchor: [24, 24] });
            const mk = L.marker([lat, lng], { icon: ic, zIndexOffset: 600 });
            mk.bindPopup(
              '<div style="font-family:Arial,sans-serif;font-size:12px;min-width:150px"><b>' + g.length + " ve\xEDculos nesta \xE1rea</b><br/>Rodando: " + rodando + "<br/>Em manuten\xE7\xE3o: " + criticos + '<br/><span style="color:#6b7280;font-size:11px">Clique para aproximar</span></div>'
            );
            mk.on("click", () => {
              map.setView([lat, lng], Math.min(z + 2, 16));
            });
            mk.addTo(layer);
          }
        });
      }
      desenhar();
      map.on("zoomend", desenhar);
      map.on("moveend", desenhar);
      return () => {
        map.off("zoomend", desenhar);
        map.off("moveend", desenhar);
      };
    }, [posicoes, ordens, bases]);
    return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: "100%", height: "100%" } }, /* @__PURE__ */ React.createElement("style", null, `
        @keyframes mfr-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.14); } }
        @media (prefers-reduced-motion: reduce) { @keyframes mfr-pulse { from {} to {} } }
      `), /* @__PURE__ */ React.createElement("div", { ref: containerRef, style: { width: "100%", height: "100%" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: 10, bottom: 10, zIndex: 500, background: "rgba(12,17,20,.88)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 12, padding: "8px 12px", fontSize: 10, color: "#e8f2ec", backdropFilter: "blur(4px)", lineHeight: 1.5, minWidth: 140 } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 8.5, letterSpacing: ".12em", textTransform: "uppercase", opacity: 0.6, marginBottom: 4 } }, "Legenda"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, opacity: 0.75, marginBottom: 4 } }, window.__sascarInfo && window.__sascarInfo.updated ? "Sascar \xB7 atualizado " + new Date(window.__sascarInfo.updated).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "Sascar \xB7 aguardando dados", window.__sascarInfo && window.__sascarInfo.status && window.__sascarInfo.status !== "ok" && String(window.__sascarInfo.status).indexOf("ok") !== 0 ? " \xB7 " + window.__sascarInfo.status : ""), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "8px minmax(0,1fr) auto", alignItems: "center", columnGap: 8, rowGap: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { width: 8, height: 8, borderRadius: 2, background: COR_RODANDO } }), /* @__PURE__ */ React.createElement("span", null, "Em movimento"), /* @__PURE__ */ React.createElement("b", { style: { fontFamily: "ui-monospace", textAlign: "right" } }, contagem.rodando), /* @__PURE__ */ React.createElement("span", { style: { width: 8, height: 8, borderRadius: 2, background: COR_PARADO } }), /* @__PURE__ */ React.createElement("span", null, "Parado"), /* @__PURE__ */ React.createElement("b", { style: { fontFamily: "ui-monospace", textAlign: "right" } }, contagem.parado), /* @__PURE__ */ React.createElement("span", { style: { gridColumn: "1 / -1", borderTop: "1px solid rgba(255,255,255,.12)" } }), /* @__PURE__ */ React.createElement("span", { style: { width: 8, height: 8, borderRadius: 2, background: "#f5c518" } }), /* @__PURE__ */ React.createElement("span", { style: { gridColumn: "2 / -1" } }, "Base"), /* @__PURE__ */ React.createElement("span", { style: { width: 8, height: 8, borderRadius: 2, background: "#FF6A00" } }), /* @__PURE__ */ React.createElement("span", { style: { gridColumn: "2 / -1" } }, "Ponto de apoio"))), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 10, right: 10, zIndex: 500, width: 236 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, background: "rgba(12,17,20,.92)", border: "1px solid rgba(255,255,255,.18)", borderRadius: 8, padding: "0 8px" } }, /* @__PURE__ */ React.createElement("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "#e8f2ec", strokeWidth: "2", strokeLinecap: "round" }, /* @__PURE__ */ React.createElement("circle", { cx: "11", cy: "11", r: "7" }), /* @__PURE__ */ React.createElement("path", { d: "M20 20l-3.6-3.6" })), /* @__PURE__ */ React.createElement("input", { value: busca, onChange: (e) => setBusca(e.target.value), placeholder: "Buscar placa", style: { background: "transparent", border: "none", outline: "none", color: "#e8f2ec", fontSize: 11, width: "100%" } })), busca.trim().length >= 2 && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4, background: "rgba(12,17,20,.96)", border: "1px solid rgba(255,255,255,.14)", borderRadius: 9, maxHeight: 150, overflowY: "auto" } }, Object.keys(posicoes || {}).filter((pl) => pl.toUpperCase().includes(busca.trim().toUpperCase())).slice(0, 6).map((pl) => /* @__PURE__ */ React.createElement("div", { key: pl, onClick: () => {
      const pt = (posicoes || {})[pl];
      if (pt && mapRef.current) mapRef.current.setView([pt.lat, pt.lng], 16);
      setSel(pl);
      setBusca("");
    }, style: { padding: "5px 9px", fontSize: 11, color: "#e8f2ec", cursor: "pointer", fontFamily: "ui-monospace" } }, pl)), Object.keys(posicoes || {}).filter((pl) => pl.toUpperCase().includes(busca.trim().toUpperCase())).length === 0 && /* @__PURE__ */ React.createElement("div", { style: { padding: "6px 9px", fontSize: 10, color: "#8fa1a9" } }, "Nenhum ve\xEDculo")), sel && (() => {
      const pt = (posicoes || {})[sel];
      if (!pt) return null;
      const v = Number(pt.velocidade || 0);
      const t = pt.tensao;
      const bat = t == null ? "sem leitura" : t >= 24 ? "Boa" : t >= 22 ? "Aten\xE7\xE3o" : "Baixa";
      const batCor = t == null ? "#8fa1a9" : t >= 24 ? "#25D647" : t >= 22 ? "#F5B301" : "#E53935";
      return /* @__PURE__ */ React.createElement("div", { style: { marginTop: 6, background: "rgba(12,17,20,.96)", border: "1px solid rgba(255,255,255,.18)", borderRadius: 9, padding: "8px 10px", color: "#e8f2ec", fontSize: 10.5, lineHeight: 1.7 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", marginBottom: 3 } }, /* @__PURE__ */ React.createElement("b", { style: { fontFamily: "ui-monospace", fontSize: 11.5 } }, sel), /* @__PURE__ */ React.createElement("span", { onClick: () => setSel(null), style: { cursor: "pointer", opacity: 0.6 } }, "\xD7")), /* @__PURE__ */ React.createElement("div", null, "Local: ", /* @__PURE__ */ React.createElement("b", null, pt.cidade || "\u2014", pt.uf ? "/" + pt.uf : "")), /* @__PURE__ */ React.createElement("div", null, "Velocidade: ", /* @__PURE__ */ React.createElement("b", null, v, " km/h")), /* @__PURE__ */ React.createElement("div", null, "Bateria: ", /* @__PURE__ */ React.createElement("b", { style: { color: batCor } }, t != null ? t + " V \xB7 " : "", bat)), pt.odometro ? /* @__PURE__ */ React.createElement("div", null, "KM: ", /* @__PURE__ */ React.createElement("b", null, Number(pt.odometro).toLocaleString("pt-BR"))) : null);
    })()));
  }
  var import_react8, CENTER3, ZOOM3, CELL, COR_RODANDO, COR_MANUT, COR_PARADO;
  var init_MapaFrota = __esm({
    "components/MapaFrota.tsx"() {
      init_vehicon();
      init_brmap();
      import_react8 = __toESM(require_react());
      init_mapdata();
      CENTER3 = [-14.2, -51.9];
      ZOOM3 = 4;
      CELL = 58;
      COR_RODANDO = "#2dc62d";
      COR_MANUT = "#ef4444";
      COR_PARADO = "#3b82f6";
    }
  });

  // components/SlaChart.tsx
  var SlaChart_exports = {};
  __export(SlaChart_exports, {
    default: () => SlaChart
  });
  function SlaChart({ ordens, busca, filtro, setBusca, setFiltro }) {
    const fechadas = ordens.filter((o) => o.fechamento && o.sla_minutos != null);
    const q = filtro.toLowerCase();
    const achadas = q ? fechadas.filter((o) => (o.os || "").toLowerCase().includes(q) || (o.placa || "").toLowerCase().includes(q)) : [];
    let sel = [];
    if (q && achadas.length > 0) {
      sel = [...achadas].sort((a, b) => (a.sla_minutos || 0) - (b.sla_minutos || 0)).slice(0, 15);
    } else {
      const asc = [...fechadas].sort((a, b) => (a.sla_minutos || 0) - (b.sla_minutos || 0));
      const desc = [...fechadas].sort((a, b) => (b.sla_minutos || 0) - (a.sla_minutos || 0));
      const ids = /* @__PURE__ */ new Set();
      [...asc.slice(0, 1), ...desc.slice(0, 5)].forEach((o) => {
        if (!ids.has(o.id)) {
          ids.add(o.id);
          sel.push(o);
        }
      });
    }
    const data = sel.map((o) => ({ name: "OS " + o.os, minutos: Number(o.sla_minutos || 0) }));
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2 mb-3" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        value: busca,
        onChange: (e) => setBusca(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Enter") setFiltro(busca.trim());
        },
        placeholder: "Buscar O.S. ou placa...",
        className: "px-3 py-1.5 rounded-lg border text-xs flex-1 min-w-[180px]",
        style: { background: "var(--bg-alt)", borderColor: "var(--border)", color: "var(--text)" }
      }
    ), /* @__PURE__ */ React.createElement("button", { onClick: () => setFiltro(busca.trim()), className: "px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer", style: { background: "var(--accent-green)", color: "#fff" } }, "Pesquisar"), filtro && /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setFiltro("");
      setBusca("");
    }, className: "px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer", style: { border: "1px solid var(--border)", color: "var(--text-muted)" } }, "Limpar")), fechadas.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "text-center py-12", style: { color: "var(--text-muted)" } }, "Nenhuma O.S fechada ainda") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(import_recharts.ResponsiveContainer, { width: "100%", height: 260 }, /* @__PURE__ */ React.createElement(import_recharts.BarChart, { data, margin: { top: 5, right: 20, left: 0, bottom: 5 } }, /* @__PURE__ */ React.createElement(import_recharts.CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--border)" }), /* @__PURE__ */ React.createElement(import_recharts.XAxis, { dataKey: "name", tick: { fontSize: 11, fill: "var(--text-muted)" }, stroke: "var(--border)" }), /* @__PURE__ */ React.createElement(import_recharts.YAxis, { tick: { fontSize: 12, fill: "var(--text-muted)" }, stroke: "var(--border)" }), /* @__PURE__ */ React.createElement(import_recharts.Tooltip, { formatter: (v) => [`${v} min`, "SLA"], contentStyle: { background: "var(--bg-alt)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" } }), /* @__PURE__ */ React.createElement(import_recharts.Bar, { dataKey: "minutos", radius: [4, 4, 0, 0] }, data.map((d, i) => {
      const c = d.minutos > 120 ? "#ef4444" : d.minutos > 60 ? "#f5c518" : "#2dc62d";
      return /* @__PURE__ */ React.createElement(import_recharts.Cell, { key: i, fill: c });
    })))), /* @__PURE__ */ React.createElement("p", { className: "text-center text-[10px] mt-2", style: { color: "var(--text-muted)" } }, q ? achadas.length > 0 ? `${achadas.length} resultado(s) para "${filtro}"` : `Nenhuma O.S. encontrada para "${filtro}" - exibindo panorama` : "Verde <=60min - Amarelo 61-120min - Vermelho >120min")));
  }
  var import_recharts;
  var init_SlaChart = __esm({
    "components/SlaChart.tsx"() {
      "use client";
      import_recharts = __toESM(require_recharts());
    }
  });

  // components/PecasKanban.tsx
  var PecasKanban_exports = {};
  __export(PecasKanban_exports, {
    default: () => PecasKanban
  });
  function horas(desde) {
    if (!desde) return "\u2014";
    const ms = Date.now() - new Date(desde).getTime();
    if (isNaN(ms)) return "\u2014";
    const h = Math.floor(ms / 36e5);
    if (h < 1) return Math.max(1, Math.floor(ms / 6e4)) + " min";
    if (h < 24) return h + "h";
    return Math.floor(h / 24) + "d " + h % 24 + "h";
  }
  function dataBR(iso) {
    if (!iso) return "\u2014";
    try {
      return new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
    } catch {
      return "\u2014";
    }
  }
  function tempoPorEtapa(itens) {
    const acc = {};
    itens.forEach((it) => {
      const h = (it.historico || []).slice().sort((a, b) => String(a.hora).localeCompare(String(b.hora)));
      h.forEach((ev, i) => {
        const prox = h[i + 1];
        const fim = prox ? new Date(prox.hora).getTime() : it.etapa === ev.etapa && it.etapa_desde ? Date.now() : null;
        if (fim && ev.etapa && COR[ev.etapa]) {
          const dur = (fim - new Date(ev.hora).getTime()) / 36e5;
          if (dur >= 0 && dur < 24 * 60) (acc[ev.etapa] = acc[ev.etapa] || []).push(dur);
        }
      });
    });
    return Object.entries(acc).map(([e, v]) => ({ etapa: e, horas: v.reduce((a, b) => a + b, 0) / v.length }));
  }
  function PecasKanban() {
    const [itens, setItens] = (0, import_react9.useState)([]);
    const [loading, setLoading] = (0, import_react9.useState)(true);
    const [showForm, setShowForm] = (0, import_react9.useState)(false);
    const [hist, setHist] = (0, import_react9.useState)(null);
    const [busy, setBusy] = (0, import_react9.useState)(false);
    async function carregar() {
      setLoading(true);
      const r = await api("/pecas-envio");
      setItens(r?.data || []);
      setLoading(false);
    }
    (0, import_react9.useEffect)(() => {
      carregar();
    }, []);
    async function criar(e) {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const d = Object.fromEntries(fd.entries());
      if (!String(d.placa || "").trim() || !String(d.peca || "").trim()) {
        alert("Informe a placa e a pe\xE7a");
        return;
      }
      setBusy(true);
      await api("/pecas-envio", { method: "POST", body: JSON.stringify({ ...d, quantidade: parseInt(String(d.quantidade || "1")), valor: parseFloat(String(d.valor || "0")) }) });
      setBusy(false);
      setShowForm(false);
      e.currentTarget.reset();
      carregar();
    }
    async function mover(item, destino) {
      let confirmar = false;
      if (destino === "RECEBIDO" && !item.confirmado_recebimento) {
        if (!confirm(`Confirmar o recebimento da pe\xE7a ${item.peca} (${item.placa})?`)) return;
        confirmar = true;
      }
      const r = await api(`/pecas-envio/${item.id}/mover`, { method: "POST", body: JSON.stringify({ etapa: destino, confirmar_recebimento: confirmar }) });
      if (!r?.success) {
        alert(r?.detail || "N\xE3o foi poss\xEDvel mover");
        return;
      }
      carregar();
    }
    async function remover(id) {
      if (!confirm("Excluir este processo?")) return;
      await api(`/pecas-envio/${id}`, { method: "DELETE" });
      carregar();
    }
    const abertos = itens.filter((i) => i.etapa !== "RECEBIDO");
    const recebidos = itens.filter((i) => i.etapa === "RECEBIDO");
    const atrasados = abertos.filter((i) => Date.now() - new Date(i.etapa_desde || i.abertura || 0).getTime() > 48 * 36e5);
    const valorOrcado = itens.filter((i) => i.etapa === "OR\xC7ANDO").reduce((a, i) => a + Number(i.valor || 0), 0);
    const valorComprado = itens.filter((i) => i.etapa !== "OR\xC7ANDO").reduce((a, i) => a + Number(i.valor || 0), 0);
    const tempoReceb = recebidos.map((i) => (new Date(i.finalizado_em).getTime() - new Date(i.abertura).getTime()) / 36e5).filter((n) => n >= 0);
    const tempoMedioTotal = tempoReceb.length ? tempoReceb.reduce((a, b) => a + b, 0) / tempoReceb.length : 0;
    const porFilial = (() => {
      const m = {};
      itens.forEach((i) => {
        const f = i.filial || "Sem filial";
        m[f] = (m[f] || 0) + Number(i.valor || 0);
      });
      return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 6);
    })();
    const porEtapa = tempoPorEtapa(itens).filter((x) => ETAPAS.includes(x.etapa));
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between mb-4 flex-wrap gap-2" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-base font-bold", style: { color: "var(--text)" } }, "CONTROLE DE ENVIO DE PE\xC7AS"), /* @__PURE__ */ React.createElement("div", { className: "text-xs", style: { color: "var(--text-muted)" } }, "Placa \xB7 filial \xB7 pe\xE7a \xB7 etapa do processo")), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("button", { onClick: carregar, className: "px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer", style: { border: "1px solid var(--border-bright)", color: "var(--text-muted)" } }, "Atualizar"), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowForm((v) => !v), className: "px-3 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer", style: { background: "var(--accent-green)", color: "#fff" } }, showForm ? "Fechar" : "+ Novo envio"))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2 mb-4" }, [
      { l: "Abertos", v: abertos.length, c: "#f5b301" },
      { l: "Or\xE7ando", v: itens.filter((i) => i.etapa === "OR\xC7ANDO").length, c: "#f5b301" },
      { l: "Comprado", v: itens.filter((i) => i.etapa === "COMPRADO").length, c: "#1e88e5" },
      { l: "Enviado", v: itens.filter((i) => i.etapa === "ENVIADO").length, c: "#8e6cf0" },
      { l: "Atrasados", v: atrasados.length, c: "#e53935" },
      { l: "Recebidos", v: recebidos.length, c: "#25d647" }
    ].map((k, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "rounded-xl px-3 py-2.5", style: { background: "var(--bg-card)", border: `1.5px solid ${k.c}44` } }, /* @__PURE__ */ React.createElement("div", { className: "text-[9px] font-bold uppercase tracking-wide", style: { color: "var(--text-muted)" } }, k.l), /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold font-mono leading-none mt-1", style: { color: k.c } }, k.v)))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-xl p-3", style: { background: "var(--bg-card)", border: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("div", { className: "text-[9px] font-bold uppercase tracking-wide mb-2", style: { color: "var(--text-muted)" } }, "Custo por filial"), porFilial.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "text-[10px] py-4 text-center", style: { color: "var(--text-soft)" } }, "Sem dados") : /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, porFilial.map(([f, v]) => {
      const max = porFilial[0][1] || 1;
      return /* @__PURE__ */ React.createElement("div", { key: f, className: "flex items-center gap-2 text-[10px]" }, /* @__PURE__ */ React.createElement("span", { className: "truncate", style: { color: "var(--text)", width: 78 } }, f), /* @__PURE__ */ React.createElement("div", { className: "flex-1 h-1.5 rounded-full overflow-hidden", style: { background: "var(--bg-alt)" } }, /* @__PURE__ */ React.createElement("div", { style: { width: `${v / max * 100}%`, height: "100%", background: "#25d647" } })), /* @__PURE__ */ React.createElement("span", { className: "font-mono font-bold", style: { color: "var(--text)" } }, v.toFixed(0)));
    }))), /* @__PURE__ */ React.createElement("div", { className: "rounded-xl p-3", style: { background: "var(--bg-card)", border: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("div", { className: "text-[9px] font-bold uppercase tracking-wide mb-2", style: { color: "var(--text-muted)" } }, "Tempo m\xE9dio por etapa (h)"), porEtapa.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "text-[10px] py-4 text-center", style: { color: "var(--text-soft)" } }, "Sem dados de ciclo") : /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5" }, porEtapa.map((x) => {
      const max = Math.max(...porEtapa.map((y) => y.horas)) || 1;
      return /* @__PURE__ */ React.createElement("div", { key: x.etapa, className: "flex items-center gap-2 text-[10px]" }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text)", width: 78 } }, x.etapa), /* @__PURE__ */ React.createElement("div", { className: "flex-1 h-1.5 rounded-full overflow-hidden", style: { background: "var(--bg-alt)" } }, /* @__PURE__ */ React.createElement("div", { style: { width: `${x.horas / max * 100}%`, height: "100%", background: COR[x.etapa] } })), /* @__PURE__ */ React.createElement("span", { className: "font-mono font-bold", style: { color: "var(--text)" } }, x.horas.toFixed(1)));
    }))), /* @__PURE__ */ React.createElement("div", { className: "rounded-xl p-3", style: { background: "var(--bg-card)", border: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("div", { className: "text-[9px] font-bold uppercase tracking-wide mb-2", style: { color: "var(--text-muted)" } }, "Indicadores"), /* @__PURE__ */ React.createElement("div", { className: "space-y-1.5 text-[11px]" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text-muted)" } }, "Valor or\xE7ado"), /* @__PURE__ */ React.createElement("b", { className: "font-mono", style: { color: "#f5b301" } }, Number(valorOrcado || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }))), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text-muted)" } }, "Valor comprado"), /* @__PURE__ */ React.createElement("b", { className: "font-mono", style: { color: "#1e88e5" } }, Number(valorComprado || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }))), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text-muted)" } }, "Tempo m\xE9dio at\xE9 receber"), /* @__PURE__ */ React.createElement("b", { className: "font-mono", style: { color: "#8e6cf0" } }, tempoMedioTotal.toFixed(1), "h")), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between" }, /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text-muted)" } }, "Atrasados"), /* @__PURE__ */ React.createElement("b", { className: "font-mono", style: { color: "#e53935" } }, atrasados.length))))), showForm && /* @__PURE__ */ React.createElement("form", { onSubmit: criar, className: "rounded-xl p-4 mb-4 grid grid-cols-1 md:grid-cols-4 gap-2", style: { background: "var(--bg-card)", border: "1px solid var(--border-bright)" } }, [
      { n: "placa", l: "Placa", req: true },
      { n: "filial", l: "Filial destino" },
      { n: "peca", l: "Pe\xE7a", req: true },
      { n: "quantidade", l: "Qtd", t: "number" },
      { n: "os", l: "O.S." },
      { n: "fornecedor", l: "Fornecedor" },
      { n: "valor", l: "Valor (R$)", t: "number" },
      { n: "motorista", l: "Motorista" }
    ].map((f) => /* @__PURE__ */ React.createElement("label", { key: f.n, className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px]", style: { color: "var(--text-muted)" } }, f.l), /* @__PURE__ */ React.createElement("input", { name: f.n, type: f.t || "text", required: f.req, defaultValue: f.n === "quantidade" ? "1" : "", className: "mt-0.5 w-full px-2 py-1.5 rounded-lg border text-xs", style: { background: "var(--bg-alt)", borderColor: "var(--border)", color: "var(--text)" } }))), /* @__PURE__ */ React.createElement("div", { className: "md:col-span-4 flex justify-end" }, /* @__PURE__ */ React.createElement("button", { disabled: busy, className: "px-4 py-2 rounded-lg text-xs font-bold cursor-pointer", style: { background: "var(--accent-green)", color: "#fff" } }, busy ? "Salvando..." : "Abrir envio"))), loading ? /* @__PURE__ */ React.createElement("p", { className: "text-center py-12 text-sm", style: { color: "var(--text-muted)" } }, "Carregando...") : /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3" }, ETAPAS.map((etapa, ei) => {
      const lista = itens.filter((i) => i.etapa === etapa);
      const cor = COR[etapa];
      return /* @__PURE__ */ React.createElement("div", { key: etapa, className: "rounded-xl p-2", style: { background: "var(--bg-alt)", border: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between px-1 pb-2 mb-2", style: { borderBottom: `2px solid ${cor}55` } }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold uppercase tracking-wide", style: { color: cor } }, ei + 1, ". ", etapa), /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold font-mono", style: { color: "var(--text-muted)" } }, lista.length)), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, lista.map((item) => {
        const idx = ETAPAS.indexOf(item.etapa);
        const atrasado = Date.now() - new Date(item.etapa_desde || item.abertura || 0).getTime() > 48 * 36e5;
        return /* @__PURE__ */ React.createElement("div", { key: item.id, className: "rounded-lg p-2.5", style: { background: "var(--bg-card)", border: `1px solid ${atrasado ? "#e5393555" : "var(--border-bright)"}` } }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-[11px] font-bold font-mono", style: { color: "var(--text)" } }, item.placa), atrasado && /* @__PURE__ */ React.createElement("span", { className: "text-[8px] font-bold px-1.5 py-0.5 rounded", style: { background: "#e5393522", color: "#c62828" } }, "ATRASADO")), /* @__PURE__ */ React.createElement("div", { className: "text-[10px] mb-1", style: { color: "var(--text)" } }, item.peca, " ", item.quantidade > 1 ? `\xD7${item.quantidade}` : ""), /* @__PURE__ */ React.createElement("div", { className: "text-[9px] space-y-0.5", style: { color: "var(--text-muted)" } }, item.filial && /* @__PURE__ */ React.createElement("div", null, "Filial: ", item.filial), item.os && /* @__PURE__ */ React.createElement("div", null, "O.S. ", item.os), item.fornecedor && /* @__PURE__ */ React.createElement("div", null, item.fornecedor), /* @__PURE__ */ React.createElement("div", { className: "font-mono", style: { color: "#b8860b" } }, Number(item.valor || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })), /* @__PURE__ */ React.createElement("div", null, "Etapa h\xE1 ", /* @__PURE__ */ React.createElement("b", { style: { color: atrasado ? "#c62828" : "var(--text)" } }, horas(item.etapa_desde)))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1 mt-2 mb-2" }, ETAPAS.map((e, i) => /* @__PURE__ */ React.createElement("div", { key: e, className: "flex items-center gap-1 flex-1" }, /* @__PURE__ */ React.createElement("span", { style: { width: 9, height: 9, borderRadius: 99, background: i <= idx ? COR[e] : "var(--border-bright)", flex: "none" } }), i < ETAPAS.length - 1 && /* @__PURE__ */ React.createElement("span", { style: { height: 2, flex: 1, background: i < idx ? COR[e] : "var(--border-bright)" } })))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-1" }, idx > 0 && /* @__PURE__ */ React.createElement("button", { onClick: () => mover(item, ETAPAS[idx - 1]), className: "px-1.5 py-1 rounded text-[9px] font-bold cursor-pointer", style: { border: "1px solid var(--border)", color: "var(--text-muted)" } }, "\u2190"), idx < ETAPAS.length - 1 && /* @__PURE__ */ React.createElement("button", { onClick: () => mover(item, ETAPAS[idx + 1]), className: "flex-1 py-1 rounded text-[9px] font-bold cursor-pointer", style: { background: COR[ETAPAS[idx + 1]], color: "#fff" } }, "\u2192 ", ETAPAS[idx + 1]), /* @__PURE__ */ React.createElement("button", { onClick: () => setHist(hist === item.id ? null : item.id), className: "px-1.5 py-1 rounded text-[9px] font-bold cursor-pointer", style: { border: "1px solid var(--border)", color: "var(--text-muted)" } }, "Hist"), /* @__PURE__ */ React.createElement("button", { onClick: () => remover(item.id), className: "px-1.5 py-1 rounded text-[9px] font-bold cursor-pointer", style: { border: "1px solid var(--border)", color: "#c62828" } }, "\xD7")), hist === item.id && /* @__PURE__ */ React.createElement("div", { className: "mt-2 pt-2 space-y-1", style: { borderTop: "1px solid var(--border)" } }, (item.historico || []).slice().reverse().map((h, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "text-[8.5px]", style: { color: "var(--text-muted)" } }, /* @__PURE__ */ React.createElement("span", { className: "font-mono" }, dataBR(h.hora)), " \xB7 ", h.acao))));
      }), lista.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-center text-[10px] py-4", style: { color: "var(--text-soft)" } }, "Vazio")));
    })));
  }
  var import_react9, ETAPAS, COR;
  var init_PecasKanban = __esm({
    "components/PecasKanban.tsx"() {
      "use client";
      import_react9 = __toESM(require_react());
      init_api();
      ETAPAS = ["OR\xC7ANDO", "COMPRADO", "ENVIADO", "RECEBIDO"];
      COR = { "OR\xC7ANDO": "#f5b301", "COMPRADO": "#1e88e5", "ENVIADO": "#8e6cf0", "RECEBIDO": "#25d647" };
    }
  });

  // entry.tsx
  var import_react12 = __toESM(require_react());
  var import_client = __toESM(require_react_dom_client());

  // importar.js
  var LIMITE_LINHAS = 2e3;
  var semAcento = (s) => String(s == null ? "" : s).normalize("NFD").replace(/[̀-ͯ]/g, "");
  var chaveCabecalho = (s) => semAcento(s).toLowerCase().replace(/[^a-z0-9]/g, "");
  var texto = (v) => (v == null ? "" : String(v)).replace(/\s+/g, " ").trim();
  var chaveNome = (s) => semAcento(s).toLowerCase().replace(/[^a-z0-9]/g, "");
  var digitos = (v) => String(v == null ? "" : v).replace(/\D/g, "");
  var pad = (n, l = 2) => String(n).padStart(l, "0");
  function mapaCampos(sinonimos) {
    const m = {};
    Object.entries(sinonimos).forEach(([campo, nomes]) => nomes.forEach((n) => {
      m[chaveCabecalho(n)] = campo;
    }));
    return m;
  }
  var CAMPOS_PRESTADOR = mapaCampos({
    nome: ["Nome", "Raz\xE3o social", "Prestador", "Nome fantasia"],
    cnpj: ["CNPJ", "CNPJ/CPF", "CPF/CNPJ", "Documento"],
    cidade: ["Cidade", "Munic\xEDpio"],
    estado: ["Estado (UF)", "Estado", "UF"],
    tipo_servico: ["Tipo de Servi\xE7o", "Tipo de servico", "Tipo", "Servi\xE7o"],
    telefone: ["Telefone", "Fone", "Celular", "WhatsApp"],
    socorro_24h: ["Socorro 24h", "24h", "Atende 24h"],
    fatura: ["Fatura", "Faturamento", "Faturado"],
    lat: ["Latitude", "Lat"],
    lng: ["Longitude", "Lng", "Lon"]
  });
  var CAMPOS_ORDEM = mapaCampos({
    os: ["O.S.", "OS", "N\xBA O.S.", "N\xFAmero da O.S.", "Numero OS", "Ordem de servi\xE7o"],
    data: ["Data"],
    placa: ["Placa"],
    marca: ["Marca"],
    modelo: ["Modelo"],
    operacao: ["Filial", "Opera\xE7\xE3o", "Unidade"],
    origem: ["Origem"],
    grupo_os: ["Grupo"],
    sistema: ["Sistema"],
    item_defeito: ["Item"],
    falha: ["Falha"],
    complemento_defeito: ["Complemento"],
    cod_defeito: ["C\xF3d. defeito", "C\xF3digo do defeito"],
    execucao: ["Execu\xE7\xE3o"],
    status: ["Status", "Andamento"],
    resultado: ["Resultado"],
    prestador_nome: ["Prestador"],
    valor_orcado: ["Valor or\xE7ado", "Or\xE7ado"],
    valor: ["Valor final", "Valor"],
    abertura: ["Abertura", "Data de abertura"],
    fechamento: ["Fechamento", "Data de fechamento"],
    motorista: ["Motorista"],
    telefone: ["Telefone"],
    segmento: ["Segmento"],
    tipo_servico: ["Tipo de servi\xE7o", "Tipo de servico"],
    tipo_veiculo: ["Tipo de ve\xEDculo", "Tipo veiculo"],
    prioridade: ["Prioridade"],
    rodovia: ["Rodovia"],
    km: ["KM", "Km"],
    localizacao: ["Localiza\xE7\xE3o", "Local"],
    descricao: ["Descri\xE7\xE3o", "Defeito", "Problema"],
    forma_pagamento: ["Forma de pagamento", "Pagamento"],
    carga: ["Carga"],
    observacoes: ["Observa\xE7\xF5es", "Obs"],
    operador: ["Operador"]
  });
  function mapearLinha(linha, campos) {
    const out = {};
    Object.entries(linha || {}).forEach(([k, v]) => {
      const c = campos[chaveCabecalho(k)];
      if (c && !(c in out && texto(out[c]))) out[c] = v;
    });
    return out;
  }
  var linhaVazia = (l) => Object.values(l || {}).every((v) => texto(v) === "");
  var SIM = /* @__PURE__ */ new Set(["sim", "s", "yes", "y", "x", "true", "1", "verdadeiro"]);
  var NAO = /* @__PURE__ */ new Set(["nao", "n", "no", "false", "0", "falso", ""]);
  function simNao(v) {
    if (v === true || v === false) return v;
    const k = semAcento(texto(v)).toLowerCase();
    if (SIM.has(k)) return true;
    if (NAO.has(k)) return false;
    return null;
  }
  function numeroBR(v) {
    if (typeof v === "number") return isFinite(v) ? v : null;
    let s = texto(v).replace(/^R\$\s*/i, "").replace(/\s/g, "");
    if (!s) return 0;
    if (/,\d{1,2}$/.test(s) || s.includes(",") && !s.includes(".")) s = s.replace(/\./g, "").replace(",", ".");
    else s = s.replace(/,/g, "");
    if (!/^-?\d+(\.\d+)?$/.test(s)) return null;
    return Number(s);
  }
  function cnpjValido(v) {
    const d = digitos(v);
    if (d.length !== 14 || /^(\d)\1{13}$/.test(d)) return false;
    const dv = (n) => {
      const pesos = n === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
      const s = pesos.reduce((t, p, i) => t + p * Number(d[i]), 0) % 11;
      return s < 2 ? 0 : 11 - s;
    };
    return dv(12) === Number(d[12]) && dv(13) === Number(d[13]);
  }
  function cpfValido(v) {
    const d = digitos(v);
    if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false;
    const dv = (n) => {
      let s = 0;
      for (let i = 0; i < n; i++) s += Number(d[i]) * (n + 1 - i);
      const r = s * 10 % 11;
      return r === 10 ? 0 : r;
    };
    return dv(9) === Number(d[9]) && dv(10) === Number(d[10]);
  }
  var fmtCnpj = (d) => `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
  var fmtCpf = (d) => `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  var UFS = /* @__PURE__ */ new Set(["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"]);
  var TIPOS_SERVICO = { mecanico: "Mec\xE2nico", eletrico: "El\xE9trico", eletronica: "Eletr\xF4nica", eletrica_mecanica: "El\xE9trica/Mec\xE2nica", borracharia: "Borracharia", guincho: "Guincho", funilaria: "Funilaria", bau: "Ba\xFA" };
  var TIPO_POR_CHAVE = {};
  Object.entries(TIPOS_SERVICO).forEach(([id, rotulo]) => {
    TIPO_POR_CHAVE[chaveCabecalho(id)] = id;
    TIPO_POR_CHAVE[chaveCabecalho(rotulo)] = id;
  });
  Object.assign(TIPO_POR_CHAVE, { mecanica: "mecanico", eletrica: "eletrico", eletricamecanica: "eletrica_mecanica", reboque: "guincho" });
  function tipoServico(v) {
    const k = chaveCabecalho(v);
    if (!k) return "mecanico";
    return TIPO_POR_CHAVE[k] || null;
  }
  function placaValida(v) {
    const p = texto(v).toUpperCase().replace(/[\s-]/g, "");
    return /^[A-Z]{3}\d[A-Z0-9]\d{2}$/.test(p) ? p : "";
  }
  function dataHoraBR(v) {
    if (v == null || v === "") return "";
    if (v instanceof Date) return isNaN(v) ? null : `${v.getFullYear()}-${pad(v.getMonth() + 1)}-${pad(v.getDate())}T${pad(v.getHours())}:${pad(v.getMinutes())}:${pad(v.getSeconds())}-03:00`;
    if (typeof v === "number") {
      if (!(v > 1 && v < 2958466)) return null;
      const ms = Math.round((v - 25569) * 864e5), d2 = new Date(ms);
      return `${d2.getUTCFullYear()}-${pad(d2.getUTCMonth() + 1)}-${pad(d2.getUTCDate())}T${pad(d2.getUTCHours())}:${pad(d2.getUTCMinutes())}:${pad(d2.getUTCSeconds())}-03:00`;
    }
    const s = texto(v);
    let m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})(?:[,\s]+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/);
    let a, mes, dia, h = 0, mi = 0, se = 0;
    if (m) {
      dia = +m[1];
      mes = +m[2];
      a = +m[3];
      if (a < 100) a += 2e3;
      h = +(m[4] || 0);
      mi = +(m[5] || 0);
      se = +(m[6] || 0);
    } else {
      m = s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?(Z|[+-]\d{2}:?\d{2})?)?$/);
      if (!m) return null;
      if (m[7]) {
        const d2 = new Date(s);
        if (isNaN(d2)) return null;
        return dataHoraBR(new Date(d2.getTime() + (d2.getTimezoneOffset() - 180) * 6e4));
      }
      a = +m[1];
      mes = +m[2];
      dia = +m[3];
      h = +(m[4] || 0);
      mi = +(m[5] || 0);
      se = +(m[6] || 0);
    }
    const d = new Date(Date.UTC(a, mes - 1, dia, h, mi, se));
    if (d.getUTCFullYear() !== a || d.getUTCMonth() !== mes - 1 || d.getUTCDate() !== dia || h > 23 || mi > 59 || se > 59) return null;
    return `${a}-${pad(mes)}-${pad(dia)}T${pad(h)}:${pad(mi)}:${pad(se)}-03:00`;
  }
  function prepararPrestadores(linhas, existentes = []) {
    const novos = [], ignorados = [];
    const porDoc = /* @__PURE__ */ new Map(), porNome = /* @__PURE__ */ new Map();
    existentes.forEach((p) => {
      const d = digitos(p.cnpj);
      if (d) porDoc.set(d, p.nome || "");
      porNome.set(chaveNome(p.nome) + "|" + chaveNome(p.cidade), p.nome || "");
    });
    (linhas || []).forEach((bruta, i) => {
      const linha = i + 2;
      if (linhaVazia(bruta)) return;
      const r = mapearLinha(bruta, CAMPOS_PRESTADOR);
      const nome = texto(r.nome);
      const ignorar = (motivo) => ignorados.push({ linha, nome, motivo });
      if (!nome) return ignorar("Nome vazio");
      if (/^exemplo\b/i.test(nome)) return ignorar("Linha de exemplo do modelo (apague-a ou troque pelos dados reais)");
      let doc = digitos(typeof r.cnpj === "number" ? Math.round(r.cnpj) : r.cnpj);
      if (doc && typeof r.cnpj === "number" && doc.length === 13) doc = "0" + doc;
      let cnpj = "";
      if (doc) {
        if (cnpjValido(doc)) cnpj = fmtCnpj(doc);
        else if (cpfValido(doc)) cnpj = fmtCpf(doc);
        else return ignorar(`CNPJ/CPF inv\xE1lido (${texto(r.cnpj)})`);
      }
      const estado2 = texto(r.estado).toUpperCase();
      if (estado2 && !UFS.has(estado2)) return ignorar(`UF inv\xE1lida (${texto(r.estado)})`);
      const tipo = tipoServico(r.tipo_servico);
      if (!tipo) return ignorar(`Tipo de servi\xE7o desconhecido (${texto(r.tipo_servico)})`);
      const s24 = simNao(r.socorro_24h), fat = simNao(r.fatura);
      if (s24 === null) return ignorar(`Socorro 24h deve ser Sim ou N\xE3o (${texto(r.socorro_24h)})`);
      if (fat === null) return ignorar(`Fatura deve ser Sim ou N\xE3o (${texto(r.fatura)})`);
      const cidade = texto(r.cidade);
      const kNome = chaveNome(nome) + "|" + chaveNome(cidade);
      if (doc && porDoc.has(doc)) return ignorar(`J\xE1 cadastrado com este CNPJ/CPF (${porDoc.get(doc)})`);
      if (!doc && porNome.has(kNome)) return ignorar("J\xE1 cadastrado com o mesmo nome e cidade");
      const p = { nome, cnpj, cidade, estado: estado2, tipo_servico: tipo, telefone: texto(r.telefone), socorro_24h: s24, fatura: fat };
      const lat = numeroBR(r.lat), lng = numeroBR(r.lng);
      if (texto(r.lat) && texto(r.lng)) {
        if (lat === null || lng === null || Math.abs(lat) > 90 || Math.abs(lng) > 180) return ignorar("Latitude/longitude inv\xE1lidas");
        p.lat = lat;
        p.lng = lng;
      }
      if (doc) porDoc.set(doc, nome);
      porNome.set(kNome, nome);
      novos.push({ ...p, _linha: linha });
    });
    return { novos, ignorados };
  }
  var STATUS_ABERTOS = ["Aguardando", "Prestador localizado", "Prestador a caminho", "Prestador no local", "Aguardando Or\xE7amento", "Servi\xE7o em execu\xE7\xE3o", "Em atendimento"];
  var STATUS_FECHADOS = ["Ve\xEDculo liberado", "Liberado", "Rebocado", "Conclu\xEDdo", "O.S. fechada"];
  var STATUS_POR_CHAVE = Object.fromEntries([...STATUS_ABERTOS, ...STATUS_FECHADOS].map((s) => [chaveCabecalho(s), s]));
  var CANCELADA = /* @__PURE__ */ new Set(["cancelada", "cancelado", "oscancelada"]);
  var normOs = (v) => {
    const s = texto(typeof v === "number" ? Math.round(v) : v);
    return s ? s.replace(/^0+/, "") || "0" : "";
  };
  function prepararOrdens(linhas, existentes = [], prestadores = [], agora = "") {
    const novos = [], ignorados = [];
    const usados = new Set(existentes.map((o) => normOs(o.os)).filter(Boolean));
    const prestPorNome = new Map(prestadores.map((p) => [chaveNome(p.nome), p]));
    let proximo = existentes.reduce((m, o) => Math.max(m, parseInt(o.os, 10) || 0), 0);
    const semNumero = [];
    (linhas || []).forEach((bruta, i) => {
      const linha = i + 2;
      if (linhaVazia(bruta)) return;
      const r = mapearLinha(bruta, CAMPOS_ORDEM);
      const os = normOs(r.os);
      const ignorar = (motivo) => ignorados.push({ linha, nome: os ? "O.S. " + os : texto(r.placa), motivo });
      const placa = placaValida(r.placa);
      if (!texto(r.placa)) return ignorar("Placa vazia");
      if (!placa) return ignorar(`Placa inv\xE1lida (${texto(r.placa)})`);
      if (os && usados.has(os)) return ignorar(`O.S. ${os} j\xE1 existe`);
      const stRaw = texto(r.status);
      if (CANCELADA.has(chaveCabecalho(stRaw))) return ignorar("O.S. cancelada n\xE3o \xE9 importada (o cancelamento passa pela aprova\xE7\xE3o de um administrador)");
      const status = stRaw ? STATUS_POR_CHAVE[chaveCabecalho(stRaw)] : "Aguardando";
      if (!status) return ignorar(`Status desconhecido (${stRaw})`);
      const valor = numeroBR(r.valor), valor_orcado = numeroBR(r.valor_orcado);
      if (valor === null) return ignorar(`Valor inv\xE1lido (${texto(r.valor)})`);
      if (valor_orcado === null) return ignorar(`Valor or\xE7ado inv\xE1lido (${texto(r.valor_orcado)})`);
      const data = dataHoraBR(r.data), abertura = dataHoraBR(r.abertura), fechamento = dataHoraBR(r.fechamento);
      if (data === null) return ignorar(`Data inv\xE1lida (${texto(r.data)})`);
      if (abertura === null) return ignorar(`Abertura inv\xE1lida (${texto(r.abertura)})`);
      if (fechamento === null) return ignorar(`Fechamento inv\xE1lido (${texto(r.fechamento)})`);
      const fechada = STATUS_FECHADOS.includes(status);
      if (fechada && !fechamento) return ignorar(`Status "${status}" pede a data de fechamento`);
      const ab = abertura || (data ? data.slice(0, 10) + "T00:00:00-03:00" : agora);
      if (fechamento && fechamento < ab) return ignorar("Fechamento anterior \xE0 abertura");
      const o = { placa, status, valor, valor_orcado, abertura: ab, data: (data || ab).slice(0, 10) };
      if (fechamento) {
        o.fechamento = fechamento;
        o.sla_minutos = Math.round((new Date(fechamento) - new Date(ab)) / 6e3) / 10;
      }
      [
        "marca",
        "modelo",
        "operacao",
        "origem",
        "grupo_os",
        "sistema",
        "item_defeito",
        "falha",
        "complemento_defeito",
        "cod_defeito",
        "execucao",
        "resultado",
        "motorista",
        "telefone",
        "segmento",
        "tipo_servico",
        "tipo_veiculo",
        "prioridade",
        "rodovia",
        "km",
        "localizacao",
        "descricao",
        "forma_pagamento",
        "carga",
        "observacoes",
        "operador"
      ].forEach((k) => {
        const v = texto(r[k]);
        if (v) o[k] = v;
      });
      if (o.tipo_servico) {
        const t = tipoServico(o.tipo_servico);
        if (t) o.tipo_servico = t;
      }
      if (o.carga) o.carga = chaveCabecalho(o.carga);
      if (o.segmento) o.segmento = o.segmento.toLowerCase();
      const pn = texto(r.prestador_nome);
      if (pn) {
        const p = prestPorNome.get(chaveNome(pn));
        o.prestador_nome = p ? p.nome : pn;
        if (p) o.prestador_id = p.id;
      }
      o._linha = linha;
      if (os) {
        usados.add(os);
        o.os = os;
      } else semNumero.push(o);
      novos.push(o);
    });
    semNumero.forEach((o) => {
      do {
        proximo++;
      } while (usados.has(String(proximo)));
      o.os = String(proximo);
      usados.add(o.os);
    });
    return { novos, ignorados };
  }
  var MIME_XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  function textoCsv(bytes) {
    try {
      return new TextDecoder("utf-8", { fatal: true }).decode(bytes).replace(/^\uFEFF/, "");
    } catch {
      return new TextDecoder("windows-1252").decode(bytes);
    }
  }
  async function lerPlanilha(arquivo) {
    const X2 = typeof window !== "undefined" && window.XLSX;
    if (!X2) throw new Error("A biblioteca de planilhas n\xE3o carregou. Recarregue a p\xE1gina.");
    const csv = /\.csv$/i.test(arquivo.name || "");
    const bytes = new Uint8Array(await arquivo.arrayBuffer());
    const wb = csv ? X2.read(textoCsv(bytes), { type: "string", raw: true }) : X2.read(bytes, { type: "array", cellDates: true });
    const aba = wb.SheetNames.find((n) => !/instru/i.test(n)) || wb.SheetNames[0];
    const linhas = X2.utils.sheet_to_json(wb.Sheets[aba], { defval: "", raw: true });
    if (linhas.length > LIMITE_LINHAS) throw new Error(`A planilha tem ${linhas.length} linhas; o limite \xE9 ${LIMITE_LINHAS} por arquivo. Divida em partes.`);
    return linhas.map((l) => Object.fromEntries(Object.entries(l).map(([k, v]) => [k, v instanceof Date ? dataHoraBR(v) : v])));
  }
  function modeloOrdensBlob() {
    const X2 = window.XLSX;
    if (!X2) throw new Error("A biblioteca de planilhas n\xE3o carregou. Recarregue a p\xE1gina.");
    const cab = ["O.S.", "Data", "Placa", "Marca", "Modelo", "Filial", "Motorista", "Telefone", "Segmento", "Tipo de servi\xE7o", "Prioridade", "Rodovia", "KM", "Descri\xE7\xE3o", "Prestador", "Status", "Valor or\xE7ado", "Valor final", "Abertura", "Fechamento", "Observa\xE7\xF5es"];
    const ws = X2.utils.aoa_to_sheet([cab]);
    ws["!cols"] = cab.map((c) => ({ wch: Math.max(12, c.length + 2) }));
    const inst = X2.utils.aoa_to_sheet([["Como preencher a planilha de O.S."], [""], ["1. Uma linha por O.S. Placa \xE9 obrigat\xF3ria (ABC1234 ou ABC1D23)."], ["2. O.S. vazia recebe o pr\xF3ximo n\xFAmero livre; n\xFAmero que j\xE1 existe no painel \xE9 ignorado."], ["3. Datas: dd/mm/aaaa ou dd/mm/aaaa hh:mm. Valores: 1.234,56."], ["4. Status fechado (Ve\xEDculo liberado, Rebocado\u2026) precisa da data de Fechamento."], ["5. O.S. cancelada n\xE3o \xE9 importada: o cancelamento passa pela aprova\xE7\xE3o de um administrador."], ["6. A importa\xE7\xE3o s\xF3 cria O.S. novas: nada \xE9 apagado nem alterado."], [""], ["Exemplo de linha: Data 17/11/2026 \xB7 Placa ABC1D23 \xB7 Marca Volvo \xB7 Filial S\xE3o Paulo \xB7 Tipo de servi\xE7o mecanico \xB7 Status Aguardando \xB7 Abertura 17/11/2026 08:30"]]);
    const wb = X2.utils.book_new();
    X2.utils.book_append_sheet(wb, ws, "Ordens");
    X2.utils.book_append_sheet(wb, inst, "Instru\xE7\xF5es");
    return new Blob([X2.write(wb, { type: "array", bookType: "xlsx" })], { type: MIME_XLSX });
  }

  // lib/permissoes.js
  var PAPEIS_VALIDOS = ["admin", "gerente", "operador"];
  function papelValido(r) {
    return PAPEIS_VALIDOS.includes(r) ? r : "operador";
  }
  function podeEditar(r) {
    const p = papelValido(r);
    return p === "admin" || p === "gerente";
  }
  function ehAdmin(r) {
    return papelValido(r) === "admin";
  }
  var TODAS = ["insert", "update", "delete"];
  var ESCRITA_GERENTE = {
    ordens: ["insert", "update"],
    // excluir O.S.: só admin
    prestadores: TODAS,
    pecas_envio: TODAS,
    acionamentos: TODAS,
    ocorrencias: ["insert", "update"],
    notificacoes: ["insert", "update"],
    // marcar como lida
    log: ["insert"]
    // o log só cresce
  };
  function papelPodeGravar(r, colecao, acao) {
    const p = papelValido(r);
    if (p === "admin") return true;
    if (p === "gerente") return (ESCRITA_GERENTE[colecao] || []).includes(acao);
    return false;
  }

  // sascar.js
  var INFO = window.__sascarInfo = { status: "carrega ao abrir o mapa", updated: 0 };
  function atualizarInfoSascar(v, erro) {
    if (erro) {
      INFO.status = "erro ao ler posi\xE7\xF5es";
      return;
    }
    if (!v) {
      INFO.status = "aguardando primeira atualiza\xE7\xE3o";
      return;
    }
    INFO.updated = v.updated || 0;
    const min = INFO.updated ? Math.round((Date.now() - INFO.updated) / 6e4) : null;
    INFO.status = min != null && min > 10 ? "atrasada (" + min + " min sem atualizar)" : "ok (" + (v.total || 0) + " ve\xEDculos)";
  }

  // backend.js
  var COLS = ["prestadores", "ordens", "bases", "acionamentos", "pecas_envio", "log", "ocorrencias", "notificacoes"];
  var estado = { prestadores: [], ordens: [], bases: [], acionamentos: [], pecas_envio: [], log: [], ocorrencias: [], notificacoes: [], frota: [], config: {} };
  var DEF_CONFIG = { escalonamento_gerencia_h: 4, escalonamento_supervisor_h: 2, mostrar_bases: true, mostrar_oficinas: true, raio_km: 100, resumo_ativo: false, resumo_emails: "", resumo_horario: "07:30", sascar_intervalo_min: 5 };
  var DB = null;
  var ROLE = "operador";
  var usuarioAtual = { email: "", nome: "", role: "operador" };
  function setUser(u) {
    usuarioAtual = u || usuarioAtual;
    ROLE = papelValido(usuarioAtual.role);
    carregarLidasLocais();
  }
  var lidasLocais = /* @__PURE__ */ new Set();
  var chaveLidas = () => "painel:lidas:" + (usuarioAtual.email || "anon");
  function carregarLidasLocais() {
    try {
      lidasLocais = new Set(JSON.parse(globalThis.localStorage?.getItem(chaveLidas()) || "[]"));
    } catch {
      lidasLocais = /* @__PURE__ */ new Set();
    }
  }
  function marcarLidaLocal(id) {
    lidasLocais.add(id);
    try {
      globalThis.localStorage?.setItem(chaveLidas(), JSON.stringify([...lidasLocais].slice(-500)));
    } catch {
    }
  }
  var comLidasLocais = (lista) => lidasLocais.size ? lista.map((n) => lidasLocais.has(n.id) ? { ...n, lida: true } : n) : lista;
  var sascarPronto = null;
  function garantirSascar() {
    if (sascarPronto || !DB) return sascarPronto || Promise.resolve();
    sascarPronto = new Promise((resolve) => {
      let feito = false;
      const fim = () => {
        if (!feito) {
          feito = true;
          resolve();
        }
      };
      DB.collection("sascar_pos").onSnapshot((snap) => {
        const d = snap.docs.find((x) => x.id === "main");
        estado.sascar = d ? d.data() : { data: {} };
        atualizarInfoSascar(d ? estado.sascar : null);
        fim();
      }, () => {
        atualizarInfoSascar(null, true);
        fim();
      });
      setTimeout(fim, 1e4);
    });
    return sascarPronto;
  }
  var QUEM = () => usuarioAtual.email || usuarioAtual.nome || "Usu\xE1rio";
  var getState = () => estado;
  var papelAtual = () => ROLE;
  var callRoute = (path) => route("GET", path, {}, null).b;
  var TZ = "America/Sao_Paulo";
  var pad2 = (n, l = 2) => String(n).padStart(l, "0");
  function horaBrasilia(d = /* @__PURE__ */ new Date()) {
    const p = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" }).formatToParts(d).map((x) => [x.type, x.value]));
    return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}.${pad2(d.getMilliseconds(), 3)}000-03:00`;
  }
  var now = () => horaBrasilia();
  var today = (d = /* @__PURE__ */ new Date()) => horaBrasilia(d).slice(0, 10);
  function parseDt(s) {
    if (!s) return null;
    const str = /[zZ]$|[+-]\d\d:?\d\d$/.test(String(s)) ? String(s) : String(s) + "-03:00";
    const d = new Date(str);
    return isNaN(d) ? null : d;
  }
  var arred1 = (x) => Math.round(x * 10) / 10;
  var arred2 = (x) => Math.round(x * 100) / 100;
  function agrupar(lista, chave, padrao, novo, acumular) {
    const grupos = {};
    lista.forEach((item) => {
      const k = chave(item) || padrao;
      acumular(grupos[k] = grupos[k] || novo(k, item), item);
    });
    return grupos;
  }
  function somarPor(lista, chave, peso = () => 1) {
    const totais = {};
    lista.forEach((item) => {
      const k = chave(item);
      totais[k] = (totais[k] || 0) + peso(item);
    });
    return totais;
  }
  var valorDe = (o) => Number(o.valor) || 0;
  var uid = () => crypto.randomUUID ? crypto.randomUUID() : "id" + Math.random().toString(16).slice(2) + Date.now();
  var FECHAMENTO = /* @__PURE__ */ new Set(["Liberado", "Conclu\xEDdo", "Rebocado", "Ve\xEDculo liberado", "O.S. fechada"]);
  var STATUS_LABELS = { "Aguardando": "O.S. criada \xB7 aguardando", "Prestador localizado": "Prestador localizado", "Prestador a caminho": "Prestador a caminho", "Prestador no local": "Prestador no local", "Servi\xE7o em execu\xE7\xE3o": "Servi\xE7o em execu\xE7\xE3o", "Em atendimento": "Servi\xE7o em execu\xE7\xE3o", "Ve\xEDculo liberado": "Ve\xEDculo liberado", "Liberado": "Ve\xEDculo liberado", "O.S. fechada": "O.S. fechada", "Conclu\xEDdo": "O.S. fechada", "Rebocado": "Ve\xEDculo rebocado", "Cancelada": "O.S. cancelada" };
  var aberta = (o) => !!o.abertura && !o.fechamento && !o.cancelado;
  var capitalizar = (v) => String(v || "").trim().toLowerCase().replace(/(^|[^a-zà-ÿ])([a-zà-ÿ])/g, (m, a, b) => a + b.toUpperCase());
  var normPlaca = (v) => String(v || "").trim().toUpperCase();
  function podeGravar(colecao, acao) {
    return papelPodeGravar(ROLE, colecao, acao);
  }
  var SemPermissao = class extends Error {
    constructor(msg) {
      super(msg || "Sem permiss\xE3o para alterar. Fale com um administrador.");
      this.status = 403;
    }
  };
  function exigirGravacao(colecao, acao) {
    if (!podeGravar(colecao, acao)) throw new SemPermissao();
  }
  var NOMES_COLECAO = { prestadores: "prestador", ordens: "O.S.", bases: "base", acionamentos: "acionamento", pecas_envio: "envio de pe\xE7a", log: "log", ocorrencias: "ocorr\xEAncia", notificacoes: "notifica\xE7\xE3o", config: "configura\xE7\xF5es" };
  function avisarFalhaGravacao(colecao, erro) {
    const motivo = String(erro && (erro.message || erro.details) || erro || "erro desconhecido");
    const msg = `N\xE3o foi poss\xEDvel salvar (${NOMES_COLECAO[colecao] || colecao}) no banco: ${motivo}. A altera\xE7\xE3o foi desfeita na tela.`;
    console.error(msg, erro);
    try {
      window.dispatchEvent(new CustomEvent("painel:erro-gravacao", { detail: { colecao, mensagem: msg } }));
    } catch (e) {
    }
  }
  function gravar(colecao, operacao, desfazer, silencioso) {
    if (!DB) return Promise.resolve(true);
    return operacao().then(() => true, (erro) => {
      desfazer();
      if (!silencioso) avisarFalhaGravacao(colecao, erro);
      return false;
    });
  }
  function put(col, obj, opcoes = {}) {
    const i = estado[col].findIndex((x) => x.id === obj.id);
    exigirGravacao(col, i >= 0 ? "update" : "insert");
    const anterior = i >= 0 ? estado[col][i] : null;
    if (anterior) {
      if (!obj._k && anterior._k) obj._k = anterior._k;
      estado[col][i] = obj;
    } else estado[col].unshift(obj);
    const { _k, ...clean } = obj;
    const gravado = gravar(col, () => DB.collection(col).doc(_k || obj.id).set(clean), () => {
      const j = estado[col].indexOf(obj);
      if (j < 0) return;
      if (anterior) estado[col][j] = anterior;
      else estado[col].splice(j, 1);
    }, opcoes.silencioso);
    if (opcoes.aoGravar) opcoes.aoGravar(gravado);
    return obj;
  }
  function del(col, id) {
    exigirGravacao(col, "delete");
    const x = estado[col].find((i) => i.id === id);
    estado[col] = estado[col].filter((i) => i.id !== id);
    gravar(col, () => DB.collection(col).doc(x && x._k || id).delete(), () => {
      if (x && !estado[col].some((i) => i.id === id)) estado[col].unshift(x);
    });
  }
  function saveConfig(anterior) {
    gravar("config", () => DB.collection("config").doc("main").set(estado.config), () => {
      estado.config = anterior;
    });
  }
  function addLog(evento, os, detalhe, quem = "Sistema") {
    put("log", { id: uid(), evento, os, detalhe, quem, created_at: now() });
  }
  var byId = (id) => estado.ordens.find((o) => o.id === id);
  var readyRes;
  var ready = new Promise((r) => {
    readyRes = r;
  });
  function startBackend(db) {
    DB = db;
    if (!db) {
      readyRes();
      return;
    }
    let faltam = COLS.length + 3;
    const umaPronta = () => {
      if (--faltam <= 0) readyRes();
    };
    const limite = setTimeout(readyRes, 8e3);
    if (limite && limite.unref) limite.unref();
    const ouvir = (colecao, aoMudar, aoPrimeiro = () => {
    }) => {
      let primeiro = true;
      const marcar = () => {
        if (primeiro) {
          primeiro = false;
          aoPrimeiro();
        }
      };
      db.collection(colecao).onSnapshot((snap) => {
        aoMudar(snap);
        marcar();
      }, marcar);
    };
    const docMain = (snap) => snap.docs.find((x) => x.id === "main");
    COLS.forEach((c) => ouvir(c, (snap) => {
      const docs = snap.docs.map((d) => ({ id: d.id, ...d.data(), _k: d.id }));
      estado[c] = c === "notificacoes" ? comLidasLocais(docs) : docs;
    }, umaPronta));
    ouvir("frota_placas", (snap) => {
      estado.frota = snap.docs.flatMap((d) => d.data().items || []);
    }, umaPronta);
    ouvir("config", (snap) => {
      const d = docMain(snap);
      estado.config = d ? d.data() : {};
    }, umaPronta);
    umaPronta();
  }
  var contadorPorTipo = () => ({ mecanico: 0, eletrico: 0, eletronica: 0, eletrica_mecanica: 0, borracharia: 0, guincho: 0, pneus: 0, freio: 0, combustivel: 0, outros: 0 });
  function stats() {
    const P2 = estado.prestadores, A = estado.acionamentos, O = estado.ordens;
    const tiposPrestador = contadorPorTipo(), tiposOrdem = contadorPorTipo();
    P2.forEach((p) => {
      const t = p.tipo_servico || "mecanico";
      if (t in tiposPrestador) tiposPrestador[t]++;
    });
    O.forEach((o) => {
      const t = o.tipo_servico || "mecanico";
      if (t in tiposOrdem) tiposOrdem[t]++;
    });
    const SEM_PRESTADOR = "Sem prestador", nomePrestador = (o) => o.prestador_nome || SEM_PRESTADOR;
    const ordensPorPrestador = agrupar(O, nomePrestador, SEM_PRESTADOR, (n, o) => ({ id: n !== SEM_PRESTADOR ? o.prestador_id || "" : "sem-prestador", nome: n, count: 0 }), (x) => {
      x.count++;
    });
    const top = Object.values(ordensPorPrestador).sort((a, b) => b.count - a.count).slice(0, 10);
    const total = O.length, val = valorDe;
    const porOperacao = somarPor(O, (o) => o.operacao || "Sem opera\xE7\xE3o");
    const porPlaca = somarPor(O, (o) => o.placa || o.veiculo || "Sem placa");
    const placasRepetidas = Object.values(porPlaca).filter((c) => c > 1).length;
    const porMarca = agrupar(O, (o) => o.marca, "Sem marca", () => ({ count: 0, custo: 0 }), (x, o) => {
      x.count++;
      x.custo += val(o);
    });
    const custo_por_marca = Object.fromEntries(Object.entries(porMarca).map(([m, d]) => [m, { count: d.count, custo_medio: d.count ? arred2(d.custo / d.count) : 0 }]));
    const slas = O.map((o) => o.sla_minutos).filter((x) => x !== null && x !== void 0);
    const fechadas = O.filter((o) => o.fechamento);
    const nowD = /* @__PURE__ */ new Date(), hoje2 = today(), ontem = today(new Date(nowD.getTime() - 864e5));
    let atrasados = 0;
    const paradas = [];
    O.filter(aberta).forEach((o) => {
      const a = parseDt(o.abertura);
      if (a && (nowD - a) / 1e3 > 7200) atrasados++;
      const ref = parseDt(o.ultima_atualizacao || o.abertura);
      if (ref && (nowD - ref) / 1e3 > 7200) paradas.push({ os: o.os, placa: o.placa, status: o.status, minutos: Math.round((nowD - ref) / 6e4) });
    });
    paradas.sort((a, b) => b.minutos - a.minutos);
    const dentro = (l) => l.filter((o) => (o.sla_minutos || 999) <= 120).length;
    const rpm = fechadas.length ? arred1(dentro(fechadas) / fechadas.length * 100) : 0;
    const segmentoDe = (o) => {
      const s = String(o.segmento || "").trim().toLowerCase();
      return s === "privado" || s === "correios" ? s : "privado";
    };
    const indicadores = {};
    ["privado", "correios"].forEach((n) => {
      const sub = O.filter((o) => segmentoDe(o) === n), fe = sub.filter((o) => o.fechamento), din = dentro(fe);
      const vals = Object.values(agrupar(sub, nomePrestador, SEM_PRESTADOR, (k) => ({ nome: k, count: 0, custo: 0 }), (x, o) => {
        x.count++;
        x.custo += val(o);
      }));
      const mc = vals.length ? vals.reduce((a, b) => b.custo > a.custo ? b : a) : { nome: "", custo: 0 };
      indicadores[n] = { total: sub.length, fechadas: fe.length, dentro_prazo: din, atrasadas: fe.filter((o) => (o.sla_minutos || 999) > 120).length, em_aberto: sub.filter((o) => !o.fechamento && !o.cancelado).length, rpm: fe.length ? arred1(din / fe.length * 100) : 0, mais_acionadas: vals.sort((a, b) => b.count - a.count).slice(0, 5), maior_custo: { nome: mc.nome, valor: arred2(mc.custo) } };
    });
    const custoPorPrestador = somarPor(O, nomePrestador, val);
    const maiorG = Object.entries(custoPorPrestador).sort((a, b) => b[1] - a[1])[0];
    indicadores.geral = { total, fechadas: fechadas.length, dentro_prazo: dentro(fechadas), atrasadas: fechadas.filter((o) => (o.sla_minutos || 999) > 120).length, em_aberto: O.filter(aberta).length, rpm, mais_acionadas: top, maior_custo: maiorG ? { nome: maiorG[0], valor: arred2(maiorG[1]) } : { nome: "", valor: 0 } };
    const pag = { a_vista: { count: 0, valor: 0 }, faturado: { count: 0, valor: 0 }, nao_informado: { count: 0, valor: 0 } };
    const AV = ["a_vista", "\xE0 vista", "a vista", "avista"];
    O.forEach((o) => {
      const fp = String(o.forma_pagamento || "").trim().toLowerCase();
      const k = AV.includes(fp) ? "a_vista" : fp === "faturado" ? "faturado" : "nao_informado";
      pag[k].count++;
      pag[k].valor += val(o);
    });
    Object.values(pag).forEach((x) => {
      x.valor = arred2(x.valor);
    });
    const dia = (o) => String(o.data || "").slice(0, 10);
    const hEnt = O.filter((o) => dia(o) === hoje2).length, oEnt = O.filter((o) => dia(o) === ontem).length;
    const hFec = O.filter((o) => o.fechamento && String(o.fechamento).slice(0, 10) === hoje2).length, oFec = O.filter((o) => o.fechamento && String(o.fechamento).slice(0, 10) === ontem).length;
    const por_status = somarPor(O, (o) => o.status || "Sem status");
    const soma = (l, f) => arred2(l.filter(f).reduce((s, o) => s + val(o), 0));
    return {
      total_prestadores: P2.length,
      disponiveis_24h: P2.filter((p) => p.socorro_24h).length,
      com_faturamento: P2.filter((p) => p.fatura).length,
      total_acionamentos: A.length,
      tipo_prestadores: tiposPrestador,
      acionamento_por_tipo: tiposOrdem,
      top_prestadores: top,
      total_ordens: total,
      valor_total: O.reduce((s, o) => s + val(o), 0),
      veiculos_unicos: new Set(O.map((o) => o.veiculo || o.placa).filter(Boolean)).size,
      servicos_total: O.filter((o) => o.servico_realizado).length,
      operacao_count: porOperacao,
      taxa_repetibilidade: total ? arred1(placasRepetidas / total * 100) : 0,
      custo_por_marca,
      sla_medio: slas.length ? arred1(slas.reduce((a, b) => a + b, 0) / slas.length) : 0,
      ordens_fechadas: fechadas.length,
      socorros_hoje: O.filter((o) => String(o.created_at || "").startsWith(hoje2) || o.data === hoje2).length,
      em_aberto: O.filter(aberta).length,
      atrasados,
      liberados: O.filter((o) => ["Liberado", "Ve\xEDculo liberado"].includes(o.status)).length,
      rebocados: O.filter((o) => ["Rebocado", "Reboque", "Ve\xEDculo rebocado"].includes(o.status)).length,
      rpm,
      indicadores_segmento: indicadores,
      pagamento: pag,
      paradas,
      resumo: { por_status, hoje: { entraram: hEnt, fecharam: hFec, avista_valor: soma(O, (o) => AV.includes(o.forma_pagamento || "") && dia(o) === hoje2), faturado_valor: soma(O, (o) => (o.forma_pagamento || "") === "faturado" && dia(o) === hoje2) }, ontem: { entraram: oEnt, fecharam: oFec }, tendencia_entraram: hEnt - oEnt, tendencia_fecharam: hFec - oFec }
    };
  }
  function alerts() {
    const nowD = /* @__PURE__ */ new Date(), out = [];
    estado.ordens.filter(aberta).forEach((o) => {
      const a = parseDt(o.abertura);
      if (!a) return;
      const min = arred1((nowD - a) / 6e4);
      if (min > 60) out.push({ ...o, minutos_aberto: min });
    });
    return { data: out, total: out.length };
  }
  var nextOs = () => String(estado.ordens.reduce((m, o) => Math.max(m, parseInt(o.os, 10) || 0), 0) + 1).padStart(6, "0");
  var placaBase = (v) => String(v || "").trim().toUpperCase().replace(/-\d+$/, "");
  function frotaComSascar() {
    const pos = estado.sascar && estado.sascar.data || {};
    const porPlaca = {};
    Object.values(pos).forEach((p) => {
      if (p && p.placa) {
        const k = placaBase(p.placa);
        if (!porPlaca[k] || String(p.data || "") > String(porPlaca[k].data || "")) porPlaca[k] = p;
      }
    });
    const vistas = /* @__PURE__ */ new Set();
    const lista = estado.frota.map((f) => {
      const k = placaBase(f.placa);
      vistas.add(k);
      const p = porPlaca[k];
      if (!p) return f;
      const odo = Number(p.odometro) || 0, kmCad = Number(f.km_ultimo) || 0;
      return { ...f, km_ultimo: odo > kmCad ? odo : f.km_ultimo, km_fonte: odo > kmCad ? "sascar" : f.km_fonte || "cadastro", ultima_posicao: { lat: p.lat, lng: p.lng, data: p.data, cidade: p.cidade, uf: p.uf } };
    });
    Object.entries(porPlaca).forEach(([k, p]) => {
      if (vistas.has(k)) return;
      lista.push({ placa: k, filial: "", modelo: "", marca: "", origem: "sascar", km_ultimo: Number(p.odometro) || void 0, km_fonte: "sascar", ultima_posicao: { lat: p.lat, lng: p.lng, data: p.data, cidade: p.cidade, uf: p.uf } });
    });
    return lista;
  }
  var LOTE_IMPORTACAO = 25;
  async function importarLinhas(colecao, body, preparar, montar, evento) {
    exigirGravacao(colecao, "insert");
    const linhas = body && body.linhas;
    if (!Array.isArray(linhas)) return { s: 400, b: { detail: "Envie as linhas da planilha." } };
    if (linhas.length > LIMITE_LINHAS) return { s: 400, b: { detail: `A planilha tem ${linhas.length} linhas; o limite \xE9 ${LIMITE_LINHAS} por arquivo.` } };
    const { novos, ignorados } = preparar(linhas);
    if (body.simular) return { s: 200, b: { success: true, simulacao: true, prontos: novos.length, ignorados } };
    const falhas = [];
    for (let i = 0; i < novos.length; i += LOTE_IMPORTACAO) {
      await Promise.all(novos.slice(i, i + LOTE_IMPORTACAO).map(({ _linha, ...item }) => {
        let gravado = Promise.resolve(true);
        const obj = put(colecao, montar(item), { silencioso: true, aoGravar: (g) => {
          gravado = g;
        } });
        return gravado.then((ok) => {
          if (!ok) falhas.push({ linha: _linha, nome: obj.nome || (obj.os ? "O.S. " + obj.os : ""), motivo: "O banco recusou a grava\xE7\xE3o" });
        });
      }));
    }
    const importados = novos.length - falhas.length;
    if (importados) addLog(evento, "", `${importados} importado(s) por planilha; ${ignorados.length} ignorado(s)${falhas.length ? `; ${falhas.length} com falha` : ""}`, QUEM());
    if (falhas.length) avisarFalhaGravacao(colecao, `${falhas.length} de ${novos.length} registro(s) n\xE3o foram gravados`);
    return { s: 200, b: { success: falhas.length === 0, importados, ignorados, falhas } };
  }
  var importarPrestadores = (body) => importarLinhas(
    "prestadores",
    body,
    (linhas) => prepararPrestadores(linhas, estado.prestadores),
    (p) => ({ ...p, id: uid(), created_at: now(), importado_em: now() }),
    "PRESTADORES_IMPORTADOS"
  );
  var importarOrdens = (body) => importarLinhas(
    "ordens",
    body,
    (linhas) => prepararOrdens(linhas, estado.ordens, estado.prestadores, now()),
    (item) => {
      const o = { ...item, id: uid(), created_at: now(), importado_em: now(), criado_por: QUEM(), criado_login: usuarioAtual.email, criado_perfil: ROLE };
      ["motorista", "operador", "modelo", "marca", "rodovia", "localizacao"].forEach((k) => {
        if (o[k]) o[k] = capitalizar(o[k]);
      });
      o.veiculo = [o.marca, o.modelo, o.placa].filter(Boolean).join(" ").trim();
      o.historico = [{ hora: now(), etapa: "OS_IMPORTADA", quem: o.criado_por }];
      return o;
    },
    "OS_IMPORTADAS"
  );
  function route(method, path, q, body) {
    const seg = path.split("/").filter(Boolean), [a, b, c, d] = seg;
    const ok = (data) => ({ s: 200, b: data }), fail = (s, detail) => ({ s, b: { detail } });
    if (a === "prestadores") {
      if (!b) {
        if (method === "GET") return ok({ data: estado.prestadores, total: estado.prestadores.length });
        if (method === "POST") return ok({ success: true, data: put("prestadores", { ...body, id: uid(), created_at: now() }) });
      } else if (b === "import") {
        if (method === "POST") return importarPrestadores(body);
      } else {
        const p = estado.prestadores.find((x) => x.id === b);
        if (!p) return fail(404, "Prestador n\xE3o encontrado");
        if (method === "PUT") return ok({ success: true, data: put("prestadores", { ...p, ...body, id: b }) });
        if (method === "DELETE") {
          del("prestadores", b);
          return ok({ success: true });
        }
        if (method === "GET") return ok({ data: p });
      }
    }
    if (a === "acionamentos") {
      if (method === "GET") return ok({ data: estado.acionamentos, total: estado.acionamentos.length });
      if (method === "POST") {
        const p = estado.prestadores.find((x) => x.id === body.prestador_id);
        return ok({ success: true, data: put("acionamentos", { ...body, prestador_nome: p ? p.nome : body.prestador_nome || "", id: uid() }) });
      }
      if (method === "DELETE") {
        del("acionamentos", b);
        return ok({ success: true });
      }
    }
    if (a === "ordens") {
      if (!b) {
        if (method === "GET") {
          const pm = Object.fromEntries(estado.prestadores.map((p) => [p.id, p.nome]));
          const items = estado.ordens.map((o) => !o.prestador_nome && o.prestador_id ? { ...o, prestador_nome: pm[o.prestador_id] || "" } : o).sort((x, y) => String(y.created_at || "").localeCompare(String(x.created_at || "")));
          return ok({ data: items, total: items.length });
        }
        if (method === "POST") {
          const o = { ...body, id: uid(), created_at: now(), abertura: now() };
          o.os = o.os && String(o.os).trim() ? String(o.os).trim().replace(/^0+/, "") || "0" : nextOs();
          ["motorista", "operador", "modelo", "marca", "rodovia", "localizacao"].forEach((k) => {
            o[k] = capitalizar(o[k]);
          });
          o.placa = normPlaca(o.placa);
          o.data = o.data || today();
          if (!o.veiculo) o.veiculo = [o.marca, o.modelo, o.placa].filter(Boolean).join(" ").trim();
          if (o.prestador_id) {
            const p = estado.prestadores.find((x) => x.id === o.prestador_id);
            o.prestador_nome = p ? p.nome : "";
          }
          o.criado_por = QUEM();
          o.criado_login = usuarioAtual.email;
          o.criado_perfil = ROLE;
          o.historico = [{ hora: now(), etapa: "OS_CRIADA", quem: o.criado_por }];
          put("ordens", o);
          addLog("OS_CRIADA", o.os, `O.S. ${o.os} criada`, o.criado_por);
          return ok({ success: true, data: o });
        }
      } else if (b === "import") {
        if (method === "POST") return importarOrdens(body);
      } else if (b === "cancelamentos" && c === "pendentes") {
        const l = estado.ordens.filter((o) => o.cancelamento_solicitado && !o.cancelado);
        return ok({ data: l, total: l.length });
      } else {
        const it = byId(b);
        if (!it) return fail(404, "Ordem n\xE3o encontrada");
        if (!c && method === "PUT") {
          const upd = body || {}, o = { ...it, ...upd };
          const cancelada = (x) => !!x.cancelado || x.status === "Cancelada";
          if (!ehAdmin(ROLE) && cancelada(o) !== cancelada(it)) return fail(403, 'S\xF3 um administrador cancela O.S. Use "Excluir" para solicitar o cancelamento.');
          ["motorista", "operador", "modelo", "marca", "rodovia", "localizacao"].forEach((k) => {
            if (k in upd && upd[k]) o[k] = capitalizar(upd[k]);
          });
          if (upd.placa) o.placa = normPlaca(upd.placa);
          if ("os" in upd) o.os = String(o.os || "").trim().replace(/^0+/, "") || "0";
          if ("status" in upd && FECHAMENTO.has(String(upd.status))) {
            o.fechamento = now();
            if (o.abertura) {
              const x = parseDt(o.abertura), f = parseDt(o.fechamento);
              if (x && f) o.sla_minutos = arred1((f - x) / 6e4);
            }
          }
          if ("status" in upd) {
            const n = String(upd.status);
            o.historico = [...o.historico || [], { hora: now(), etapa: STATUS_LABELS[n] || n, quem: QUEM() }];
            o.atualizado_por = QUEM();
            o.ultima_atualizacao = now();
          }
          return ok({ success: true, data: put("ordens", o) });
        }
        if (!c && method === "DELETE") {
          del("ordens", b);
          addLog("OS_REMOVIDA", it.os, `O.S. ${it.os} removida`, QUEM());
          return ok({ success: true });
        }
        if (c === "fechar" && method === "POST") {
          const o = { ...it, resultado: body.resultado, servico_realizado: body.servico_realizado || "" };
          if (body.prestador_id) {
            o.prestador_id = body.prestador_id;
            const p = estado.prestadores.find((x) => x.id === body.prestador_id);
            o.prestador_nome = p ? p.nome : "";
          }
          if (body.valor !== null && body.valor !== void 0) o.valor = body.valor;
          if (body.valor_orcado !== null && body.valor_orcado !== void 0) o.valor_orcado = body.valor_orcado;
          if (body.observacoes) o.observacoes = body.observacoes;
          if (body.execucao) o.execucao = body.execucao;
          o.status = String(body.resultado || "").includes("Rebocado") ? "Rebocado" : "Liberado";
          o.fechamento = now();
          o.atualizado_por = QUEM();
          o.ultima_atualizacao = now();
          if (o.abertura) {
            const x = parseDt(o.abertura), f = parseDt(o.fechamento);
            if (x && f) o.sla_minutos = arred1((f - x) / 6e4);
          }
          put("ordens", o);
          addLog("OS_FECHADA", o.os, `Resultado: ${body.resultado}`, QUEM());
          return ok({ success: true, data: o });
        }
        if (c === "cancelar" && d === "aprovar") {
          if (!ehAdmin(ROLE)) return fail(403, "S\xF3 um administrador aprova cancelamentos.");
          if (it.cancelado) return fail(400, "Esta O.S. j\xE1 est\xE1 cancelada.");
          if (!it.cancelamento_solicitado) return fail(400, "Nenhum cancelamento pendente para esta O.S.");
          const ag = now();
          const o = { ...it, cancelado: true, motivo_cancelamento: it.cancelamento_motivo || "", status: "Cancelada", fechamento: it.fechamento || ag, cancelamento_aprovado_por: QUEM(), cancelamento_aprovado_em: ag, cancelamento_solicitado: false, historico: [...it.historico || [], { hora: ag, etapa: "CANCELADA", quem: QUEM() }] };
          put("ordens", o);
          addLog("OS_CANCELADA", o.os, `Aprovado por ${QUEM()}`, QUEM());
          return ok({ success: true, data: o });
        }
        if (c === "cancelar" && method === "POST") {
          if (it.cancelado) return fail(400, "Esta O.S. j\xE1 est\xE1 cancelada.");
          const ag = now();
          const o = { ...it, cancelamento_solicitado: true, cancelamento_motivo: body.motivo, cancelamento_solicitado_por: QUEM(), cancelamento_solicitado_em: ag, historico: [...it.historico || [], { hora: ag, etapa: "CANCELAMENTO_SOLICITADO", quem: QUEM() }] };
          if (!ehAdmin(ROLE)) {
            put("ordens", o);
            addLog("OS_CANCELAMENTO_SOLICITADO", o.os, `Motivo: ${body.motivo}`, QUEM());
            return ok({ success: true, pendente: true, data: o });
          }
          o.cancelado = true;
          o.status = "Cancelada";
          o.fechamento = ag;
          o.cancelamento_solicitado = false;
          o.cancelamento_aprovado_por = QUEM();
          o.cancelamento_aprovado_em = ag;
          o.motivo_cancelamento = body.motivo;
          o.historico.push({ hora: ag, etapa: "CANCELADA", quem: QUEM(), acao: "Cancelada pelo admin" });
          put("ordens", o);
          addLog("OS_CANCELADA", o.os, `Cancelada pelo admin. Motivo: ${body.motivo}`, QUEM());
          return ok({ success: true, pendente: false, data: o });
        }
        if (c === "notas") {
          if (method === "GET") return ok({ data: it.notas || [], total: (it.notas || []).length });
          if (method === "POST") {
            const n = { id: uid(), sigla: body.sigla, texto: body.texto, created_at: now() };
            put("ordens", { ...it, notas: [...it.notas || [], n] });
            return ok({ success: true, data: n });
          }
        }
      }
    }
    if (a === "stats" && !b) return ok(stats());
    if (a === "alerts") return ok(alerts());
    if (a === "log") return ok({ data: [...estado.log].sort((x, y) => String(y.created_at || "").localeCompare(String(x.created_at || ""))) });
    if (a === "bases") {
      if (!b) {
        if (method === "GET") return ok({ data: estado.bases });
        if (method === "POST") return ok({ success: true, data: put("bases", { ...body, id: uid(), created_at: now() }) });
      } else {
        const x = estado.bases.find((i) => i.id === b);
        if (!x) return fail(404, "Base n\xE3o encontrada");
        if (method === "PUT") return ok({ success: true, data: put("bases", { ...x, ...body, id: b }) });
        if (method === "DELETE") {
          del("bases", b);
          return ok({ success: true });
        }
      }
    }
    if (a === "frota" && b === "placas") {
      const l = frotaComSascar();
      return ok({ data: l, total: l.length, so_sascar: l.filter((x) => x.origem === "sascar").length });
    }
    if (a === "frota" && b === "placa") {
      const pl = placaBase(decodeURIComponent(c || ""));
      const x = frotaComSascar().find((i) => placaBase(i.placa) === pl);
      return x ? ok({ data: x }) : fail(404, "Placa n\xE3o encontrada");
    }
    if (a === "ocorrencias") {
      if (!b) return ok({ data: estado.ocorrencias });
      if (c === "aceitar") {
        const x = estado.ocorrencias.find((i) => i.id === b);
        if (!x) return fail(404, "Ocorr\xEAncia n\xE3o encontrada");
        return ok({ success: true, data: put("ocorrencias", { ...x, status: "aceita", aceita_por: QUEM(), aceita_em: now() }) });
      }
    }
    if (a === "notificacoes") {
      if (!b) {
        const lista = comLidasLocais(estado.notificacoes);
        return ok({ data: lista, nao_lidas: lista.filter((n) => !n.lida).length });
      }
      if (c === "ler") {
        const x = estado.notificacoes.find((i) => i.id === b);
        if (x) {
          if (podeGravar("notificacoes", "update")) put("notificacoes", { ...x, lida: true });
          else {
            marcarLidaLocal(b);
            estado.notificacoes = comLidasLocais(estado.notificacoes);
          }
        }
        return ok({ success: true });
      }
    }
    if (a === "configuracoes") {
      if (method === "PUT") {
        exigirGravacao("config", "update");
        const anterior = estado.config;
        estado.config = { ...DEF_CONFIG, ...estado.config, ...body };
        saveConfig(anterior);
      }
      const cfg = { ...DEF_CONFIG, ...estado.config };
      return ok({ ...cfg, data: cfg, success: true });
    }
    if (a === "pecas-envio") {
      if (!b) {
        if (method === "GET") return ok({ data: estado.pecas_envio });
        if (method === "POST") return ok({ success: true, data: put("pecas_envio", { ...body, id: uid(), etapa: "OR\xC7ANDO", abertura: now(), etapa_desde: now(), historico: [{ etapa: "OR\xC7ANDO", hora: now() }] }) });
      } else {
        const x = estado.pecas_envio.find((i) => i.id === b);
        if (!x) return fail(404, "Envio n\xE3o encontrado");
        if (c === "mover" && method === "POST") {
          const o = { ...x, etapa: body.etapa || x.etapa, etapa_desde: now(), historico: [...x.historico || [], { etapa: body.etapa, hora: now() }] };
          if (body.confirmar_recebimento) {
            o.confirmado_recebimento = true;
            o.finalizado_em = now();
          }
          return ok({ success: true, data: put("pecas_envio", o) });
        }
        if (method === "DELETE") {
          del("pecas_envio", b);
          return ok({ success: true });
        }
      }
    }
    if (a === "pecas") return ok({ data: [], total: 0 });
    if (a === "users") return ok({ data: [{ id: "admin", email: "admin@print", nome: QUEM(), role: "admin", status: "ativo" }] });
    if (a === "sascar") {
      if (b === "posicoes") {
        const dd = estado.sascar && estado.sascar.data || {};
        return ok({ data: dd, total: Object.keys(dd).length, credencial_ok: true, atualizado: estado.sascar && estado.sascar.updated || 0 });
      }
      return ok({ data: [], credencial_ok: true });
    }
    if (a === "relatorio" && b === "gerencial2") {
      if (!podeEditar(ROLE)) return fail(403, "O relat\xF3rio gerencial \xE9 s\xF3 para gerentes e administradores.");
      const dias = parseInt(q.get("dias") || "30", 10) || 0;
      const agora = /* @__PURE__ */ new Date();
      const esc = (v) => String(v == null ? "" : v).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[ch]);
      let ords = estado.ordens;
      if (dias > 0) {
        const corte = agora.getTime() - dias * 864e5;
        ords = ords.filter((o) => {
          const dt = parseDt(o.abertura || o.created_at);
          return !dt || dt.getTime() >= corte;
        });
      }
      const total = ords.length, val = valorDe;
      const custo = ords.reduce((t, o) => t + val(o), 0);
      const abertas = ords.filter((o) => !o.fechamento && !o.cancelado).length;
      const slas = ords.filter((o) => o.fechamento && o.sla_minutos).map((o) => Number(o.sla_minutos));
      const slaMed = slas.length ? slas.reduce((x, y) => x + y, 0) / slas.length : 0;
      const ordensPorPlaca = somarPor(ords.map((o) => String(o.placa || "").toUpperCase()).filter(Boolean), (p) => p);
      const nP = Object.keys(ordensPorPlaca).length, reinc = nP ? Object.values(ordensPorPlaca).filter((v) => v > 1).length / nP * 100 : 0;
      const agg = (fn) => Object.entries(agrupar(ords, fn, "N\xE3o informado", () => ({ qtd: 0, custo: 0 }), (x, o) => {
        x.qtd++;
        x.custo += val(o);
      })).sort((x, y) => y[1].qtd - x[1].qtd);
      const TL = { mecanico: "Mec\xE2nico", eletrico: "El\xE9trico", eletronica: "Eletr\xF4nica", eletrica_mecanica: "El\xE9trica/Mec\xE2nica", borracharia: "Borracharia", guincho: "Guincho" };
      const porModelo = agg((o) => o.modelo).slice(0, 5), porUnid = agg((o) => o.operacao).slice(0, 5);
      const porTipo = agg((o) => TL[o.tipo_servico || ""] || o.tipo_servico || "Outros");
      const porFalha = agg((o) => String(o.descricao || "").slice(0, 28) || null).slice(0, 6);
      const brl0 = (v) => Number(v || 0).toLocaleString("pt-BR", { maximumFractionDigits: 0 });
      const barra = (nome, qtd, cv, maxq, cor = "#25D647") => "<tr><td class='nm'>" + esc(String(nome).slice(0, 26)) + "</td><td class='tk'><div class='fl' style='width:" + (maxq ? Math.round(qtd / maxq * 100) : 0) + "%;background:" + cor + "'></div></td><td class='vl'>" + qtd + "</td><td class='cs'>R$ " + brl0(cv) + "</td></tr>";
      const rows = (lst, cor) => lst.map(([k, v]) => barra(k, v.qtd, v.custo, lst.length ? lst[0][1].qtd : 1, cor)).join("");
      const topM = porModelo[0] ? porModelo[0][0] : "\u2014", topU = porUnid[0] ? porUnid[0][0] : "\u2014", topF = porFalha[0] ? porFalha[0][0] : "\u2014";
      const shareU = porUnid[0] && total ? Math.round(porUnid[0][1].qtd / total * 100) : 0;
      const ins = "<li><b>" + esc(topU) + "</b> concentra " + shareU + "% das O.S. do per\xEDodo.</li><li><b>" + esc(topM) + "</b> \xE9 o modelo com mais ocorr\xEAncias (" + (porModelo[0] ? porModelo[0][1].qtd : 0) + ").</li><li><b>" + esc(topF) + "</b> lidera as falhas registradas: revisar reduziria reincid\xEAncia.</li>";
      const dataTxt = agora.toLocaleString("pt-BR", { timeZone: TZ, day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
      const html = "<!doctype html><html lang='pt-BR'><head><meta charset='utf-8'><title>Resumo Executivo \u2014 Print</title><style>body{font-family:Arial,Helvetica,sans-serif;color:#2B3230;margin:22px;background:#fff}.hd{display:flex;justify-content:space-between;border-bottom:3px solid #0C4817;padding-bottom:9px}.t{font-size:20px;font-weight:800;color:#0C4817;margin:0}.s{font-size:10px;color:#7A7A7A}.k{display:flex;gap:7px;margin:12px 0}.k div{flex:1;border:1px solid #E2E7E0;border-radius:7px;padding:8px 10px}.k span{font-size:8px;letter-spacing:.8px;color:#7A7A7A}.k b{display:block;font-size:17px;color:#0C4817;margin-top:2px}.sec{font-size:9px;font-weight:800;letter-spacing:.9px;color:#146E1F;margin:12px 0 5px;border-bottom:1px solid #E2E7E0;padding-bottom:3px}table.w{width:100%;border-collapse:collapse;font-size:9px}td{padding:3px 5px}td.nm{width:110px;color:#2B3230;font-weight:600}td.tk div{height:6px;border-radius:3px;background:#25D647}td.vl{width:28px;text-align:right;font-weight:700;font-family:monospace}td.cs{width:66px;text-align:right;color:#7A7A7A;font-family:monospace}.tipo{display:flex;justify-content:space-between;font-size:9px;padding:2px 0;color:#505050}.tipo .q{font-weight:700;color:#2B3230;font-family:monospace}.ins{background:#F7FBF6;border:1px solid #CBE9CF;border-radius:6px;padding:8px 10px;margin-top:4px}.ins ul{margin:0;padding-left:14px}.ins li{font-size:9px;color:#505050;line-height:1.6}.ft{margin-top:10px;border-top:1px solid #E2E7E0;padding-top:6px;font-size:8px;color:#7A7A7A}@media print{body{margin:8mm}}</style></head><body><div class='hd'><div><div style='font-size:9px;letter-spacing:1.6px;color:#7A7A7A'>PRINT TRANSPORTADORA</div><h1 class='t'>RESUMO EXECUTIVO DA MANUTEN\xC7\xC3O</h1><div class='s'>Control Tower Service \xB7 \xFAltimos " + (dias > 0 ? dias : "todos") + " dias \xB7 " + dataTxt + "</div></div><div style='text-align:right;font-size:9px;color:#7A7A7A'>Emitido por<br><b>" + esc(QUEM()) + "</b></div></div><div class='k'><div><span>O.S. NO PER\xCDODO</span><b>" + total + "</b></div><div><span>EM ABERTO</span><b>" + abertas + "</b></div><div><span>CUSTO TOTAL</span><b>R$ " + brl0(custo) + "</b></div><div><span>SLA M\xC9DIO</span><b>" + (slaMed ? Math.floor(slaMed / 60) + "h" + pad2(Math.floor(slaMed % 60)) : "\u2014") + "</b></div><div><span>REINCID\xCANCIA</span><b>" + reinc.toFixed(1).replace(".", ",") + "%</b></div></div><div class='sec'>FALHAS POR MODELO DE VE\xCDCULO</div><table class='w'>" + (rows(porModelo) || "<tr><td>Sem dados</td></tr>") + "</table><div class='sec'>ORDENS POR UNIDADE</div><table class='w'>" + (rows(porUnid, "#1E88E5") || "<tr><td>Sem dados</td></tr>") + "</table><div class='sec'>PRINCIPAIS FALHAS (PARETO)</div><table class='w'>" + (rows(porFalha, "#C62828") || "<tr><td>Sem dados</td></tr>") + "</table><div class='sec'>TIPO DE MANUTEN\xC7\xC3O</div>" + (porTipo.slice(0, 6).map(([k, v]) => "<div class='tipo'><span class='t'>" + esc(k) + "</span><span class='q'>" + v.qtd + "</span></div>").join("") || "<div class='tipo'>Sem dados</div>") + "<div class='sec'>INSIGHTS GERENCIAIS</div><div class='ins'><ul>" + ins + "</ul></div><div class='ft'>Print \xB7 Control Tower Service</div></body></html>";
      return ok({ html, total, dias });
    }
    if (a === "escalonamento") {
      const cfg = { ...DEF_CONFIG, ...estado.config || {} };
      const hS = Number(cfg.escalonamento_supervisor_h) || 2, hG = Number(cfg.escalonamento_gerencia_h) || 4;
      const agora = Date.now();
      const out = [];
      estado.ordens.forEach((o) => {
        if (o.fechamento || o.cancelado) return;
        const base = o.ultima_atualizacao || o.abertura;
        if (!base) return;
        const dt = parseDt(base);
        if (!dt) return;
        const horas2 = (agora - dt) / 36e5;
        if (horas2 >= hS) out.push({ id: o.id, os: o.os, placa: o.placa, status: o.status, operacao: o.operacao, horas_parada: arred1(horas2), nivel: horas2 >= hG ? "GERENCIA" : "SUPERVISOR", ultima_atualizacao: base });
      });
      out.sort((x, y) => y.horas_parada - x.horas_parada);
      return ok({ data: out, total: out.length, gerencia: out.filter((x) => x.nivel === "GERENCIA").length });
    }
    if (a === "stats" && b === "orcado") {
      const agg = (fn) => Object.entries(agrupar(estado.ordens, fn, "Sem info", () => ({ orcado: 0, realizado: 0, qtd: 0 }), (d2, o) => {
        d2.orcado += Number(o.valor_orcado) || 0;
        d2.realizado += valorDe(o);
        d2.qtd++;
      })).map(([nome, d2]) => {
        const base = d2.orcado || d2.realizado || 1;
        return { nome, ...d2, desvio_pct: d2.orcado ? arred1((d2.realizado - d2.orcado) / base * 100) : 0 };
      }).sort((x, y) => y.realizado - x.realizado);
      const pm = Object.fromEntries(estado.prestadores.map((p) => [p.id, p.nome]));
      return ok({
        por_prestador: agg((o) => o.prestador_nome || pm[o.prestador_id] || "Sem prestador"),
        por_filial: agg((o) => o.operacao),
        totais: { orcado: estado.ordens.reduce((t, o) => t + (Number(o.valor_orcado) || 0), 0), realizado: estado.ordens.reduce((t, o) => t + valorDe(o), 0), ordens: estado.ordens.length }
      });
    }
    return ok({});
  }
  var realFetch = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input && input.url;
    if (!url || !url.startsWith("/api/")) return realFetch(input, init);
    await ready;
    const mth = (init && init.method || "GET").toUpperCase();
    const [path, qs] = url.slice(4).split("?");
    let body = {};
    try {
      body = init && typeof init.body === "string" ? JSON.parse(init.body || "{}") : {};
    } catch (e) {
      body = {};
    }
    const J = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { "Content-Type": "application/json" } });
    const seg = path.replace(/^\/+/, "").split("/");
    if (seg[0] === "users" || seg[0] === "usuarios") {
      if (!ehAdmin(ROLE)) return J({ detail: "Somente administradores." }, 403);
      const call = window.__printUsers;
      if (!call) return J({ detail: "Indispon\xEDvel" }, 503);
      const id = seg[1] ? decodeURIComponent(seg[1]) : "";
      try {
        if (mth === "GET") return J(await call("listar", {}));
        if (seg[2] === "senha" || seg[2] === "aprovar") return J(await call(seg[2] === "senha" ? "senha" : "salvar", { email: id, senha: body.senha, role: body.role || "operador" }));
        if (mth === "POST") return J(await call("salvar", { email: body.email, nome: body.nome, role: body.role || "operador", senha: body.password || body.senha }));
        if (mth === "PUT") return J(await call("salvar", { email: id, nome: body.nome, role: body.role, senha: body.password || body.senha || void 0 }));
        if (mth === "DELETE") return J(await call("remover", { email: id }));
      } catch (e) {
        return J({ detail: String(e && e.message || e) }, 400);
      }
    }
    const soMarcaLida = seg[0] === "notificacoes" && seg[2] === "ler";
    if (mth !== "GET" && !soMarcaLida && (!podeEditar(ROLE) || seg[0] === "configuracoes" && !ehAdmin(ROLE)))
      return J({ detail: "Sem permiss\xE3o para alterar. Fale com um administrador." }, 403);
    if (seg[0] === "sascar" || seg[0] === "frota" && seg[1] === "placa") await garantirSascar();
    let res;
    try {
      res = await route(mth, path, new URLSearchParams(qs || ""), body);
    } catch (e) {
      res = { s: e && e.status || 500, b: { detail: String(e && e.message || e) } };
    }
    return new Response(JSON.stringify(res.b), { status: res.s, headers: { "Content-Type": "application/json" } });
  };

  // mapdata.js
  window.__mapLayers = [{ id: "z5", bounds: [[-40.97989806962013, -78.75], [11.178401873711781, -22.5]], uri: "assets/mapa-z5.90811e8730.webp" }, { id: "z7", bounds: [[-27.059125784374054, -56.25], [-16.636191878397657, -36.5625]], uri: "assets/mapa-z7.e910b760e6.webp" }, { id: "z9", bounds: [[-24.527134822597805, -47.8125], [-22.59372606392931, -45]], uri: "assets/mapa-z9.139de37fbe.webp" }, { id: "z11", bounds: [[-24.04646399966657, -47.109375], [-23.079731762449878, -46.0546875]], uri: "assets/mapa-z11.87cdaf1343.webp" }];
  window.__mapBase = window.__mapLayers[0].uri;

  // mapbase.js
  var SIZE = 31e3;
  var LAYERS = [
    { id: "z5", z: 5, box: [-74.5, -34, -33.5, 5.5], n: 9, bounds: [[-40.97989806962013, -78.75], [11.178401873711781, -22.5]] },
    { id: "z7", z: 7, box: [-54, -26, -39, -18], n: 13, bounds: [[-27.059125784374054, -56.25], [-16.636191878397657, -36.5625]] },
    { id: "z9", z: 9, box: [-47.6, -24.2, -45.6, -22.9], n: 7, bounds: [[-24.527134822597805, -47.8125], [-22.59372606392931, -45]] },
    { id: "z11", z: 11, box: [-47.1, -23.9, -46.2, -23.2], n: 25, bounds: [[-24.04646399966657, -47.109375], [-23.079731762449878, -46.0546875]] }
  ];
  var PY = (L, i) => `
import httpx, math, io, base64
from PIL import Image
z=${L.z}; w,s,e,n=${JSON.stringify(L.box)}; T=256
tx=lambda l:(l+180)/360*2**z
ty=lambda l:(1-math.log(math.tan(math.radians(l))+1/math.cos(math.radians(l)))/math.pi)/2*2**z
x0,x1=int(tx(w)),int(tx(e)); y0,y1=int(ty(n)),int(ty(s))
im=Image.new("RGB",((x1-x0+1)*T,(y1-y0+1)*T))
c=httpx.Client(headers={"User-Agent":"PainelPrint/1.0"},timeout=30,follow_redirects=True)
G="https://server.arcgisonline.com/ArcGIS/rest/services/"
for x in range(x0,x1+1):
    for y in range(y0,y1+1):
        a=Image.open(io.BytesIO(c.get(G+f"World_Imagery/MapServer/tile/{z}/{y}/{x}").content)).convert("RGBA")
        l=Image.open(io.BytesIO(c.get(G+f"Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}").content)).convert("RGBA")
        a.alpha_composite(l); im.paste(a.convert("RGB"),((x-x0)*T,(y-y0)*T))
b=io.BytesIO(); im.save(b,"WEBP",quality=70,method=4)
s64=base64.b64encode(b.getvalue()).decode()
print("MB="+s64[${i}*${SIZE}:(${i}+1)*${SIZE}]+"=END", len(s64))
`;
  var MAPBASE = window.__mapBaseInfo = { status: "" };
  function parse(res) {
    let p = res && res.payload;
    if (typeof p === "string") {
      try {
        p = JSON.parse(p);
      } catch (e) {
      }
    }
    let so = p && p.stdout;
    if (typeof so !== "string") so = JSON.stringify(res && (res.payload || res.content)) || "";
    const m = so.match(/MB=([A-Za-z0-9+\/=]*?)=END/);
    if (!m) throw new Error("sem dados");
    return m[1];
  }
  async function startMapBase(db, isOwner) {
    if (window.__mapLayers) {
      MAPBASE.status = "ok";
      return;
    }
    if (!db) return;
    let started = false;
    db.collection("mapa_s").onSnapshot((s) => {
      const d = {};
      s.docs.forEach((x) => {
        d[x.id] = x.data();
      });
      const ok = d.meta && LAYERS.every((L) => Array.from({ length: L.n }, (_, i) => d[L.id + "_" + i]).every(Boolean));
      if (ok) {
        const out = LAYERS.map((L) => ({ id: L.id, bounds: L.bounds, uri: "data:image/webp;base64," + Array.from({ length: L.n }, (_, i) => d[L.id + "_" + i].d).join("") }));
        if (!window.__mapLayers || window.__mapLayers.map((x) => x.uri.length).join() !== out.map((x) => x.uri.length).join()) {
          window.__mapLayers = out;
          window.__mapBase = out[0].uri;
          window.dispatchEvent(new Event("mapbase"));
        }
      } else if (isOwner && !started) {
        setTimeout(async () => {
          if (started || window.__mapLayers) return;
          started = true;
          try {
            const mcp = await window.claude.use("mcp");
            if (!mcp) {
              MAPBASE.status = "conector indispon\xEDvel";
              started = false;
              return;
            }
            const jobs = [];
            LAYERS.forEach((L) => {
              for (let i = 0; i < L.n; i++) if (!d[L.id + "_" + i]) jobs.push([L, i]);
            });
            const total = jobs.length;
            let k = 0;
            const worker = async () => {
              while (jobs.length) {
                const [L, i] = jobs.shift();
                const res = await mcp.callTool("CodeWords", "run_code", { code: PY(L, i), dependencies: ["pillow", "httpx"] }, { cache: false, signal: AbortSignal.timeout(15e4) });
                await db.collection("mapa_s").doc(L.id + "_" + i).set({ d: parse(res) });
                k++;
                MAPBASE.status = "baixando mapa " + k + "/" + total;
              }
            };
            MAPBASE.status = "baixando mapa 0/" + total;
            await Promise.all([worker(), worker(), worker()]);
            await db.collection("mapa_s").doc("meta").set({ ts: Date.now() });
            MAPBASE.status = "ok";
          } catch (e) {
            MAPBASE.status = "falha: " + (e && (e.code || e.message) || "erro");
            started = false;
          }
        }, 4e3);
      }
    }, () => {
    });
  }

  // images.js
  var P = "data:image/webp;base64,";
  var IMGS = {
    logo: P + "UklGRiYQAABXRUJQVlA4WAoAAAAQAAAAlwAAVQAAQUxQSB8CAAABDzD/ERFCkrTtaeT8rgGFtR1sVW6QXoVbh8kBmEmuCvRu+ghziCyphxkuEGaOJjMTq6tkfQuBHThARP8ngEgzqmyAWpinkXmvkJEFeB0yRL4OqTrgmRgFsr/AAeirTQVMhNVlIyol6qFbwXoS4FiUVlpppwCAIC06+Kk8zIaEQQfwgMWI9qTzJiOvsBlwgAjxqRTpPKI8RTlAERGFhGdji4CEh0juCQikTOEjZMDBeLdI4yPYGASE8eQUmMFH9A15GgRBU2AWb9FH4OAaWcjhLbI8xmkKbWDb63gUWKz2Ch+BrRDTyAPbHuVopwDQoKl6FsEMcrCAqqI9kzAVkYFZ9BkVE0ZV42l9AWYUvfJsQp/13sYMgCxBRhRZGcisfBWSoddJ3NOxzMtCWzGLjMhFXEhRAjmpK2iQEymiHhPrC8EzIHhHrEzjGnzIpaiAbIQ4GRWBiNl6rMrBXwEckiivJBJkNemxqQRWjwvlAEubAieHPvCQjRhQ9Tyr4f96qo4xIrdgb9tz54Z+Tfc1Gn2HG6dUw22gtKU+VhRt2b17USqoOy+u29JuXSuKdhd3LyoodehFc2N8o2eOqomH23e3z7xlZ1uuaW+v9XpHWxOT23e3+95K4d364R3qhu40XNOOfStT2M2Ga/448Kx8dPVqB9t3L14smHIfmmu2LB8VRbvbVVIppdxCc63sHRgt3vYJoVqtlmpR1TGqsZYDRAQAVlA4IOANAACQNgCdASqYAFYAPmEmkEUkIiGXepccQAYEtgillWj9F+SqHmlAP4B+AHMkWH6b+Rf5QfJFWf8j/Zv1bwotX+Xzzz/xPvI+aP+D/XX3Ofoz2A+ct5if5//r/20903/g/uP7q/7H/jfYV/w3pZf9D2XP7p6kP8d/4vp4ezP/fP+36Y+a09ln+36ROE7X74OcAMqBsr6AVkRqO9+da1+3/8P2AP4j/hP+5/ePdj/sf2o89H1R7Bn7AdZv0Mv3CUmvfbCvHdhL3Opl6BCEcGtulF+3pzsn+r9H6Ouvk5HWAljE7dIxRfJ0YVuAaP02JbrwWZtLRj8f2AWtxVfV3w3sp2AxophhGvDL9CTvBsvcq4eflPEFsgsbhlZi37rzyKtmx09cLA37Pu51bPJA4CzzluLdxFDo4EN2SGTZhArjb02FNxp01RHVPTsjBQdyYmDyzQIlGRuLQbzf8BTHFx7MoEDyZcy0KbJNdWoMa9t4lCVCENlAwhgxkU3aj9tyvry2iLOQlmC7t1que6VKwhWvKaeZ6HFe/2Zh6TNT0/t36HJAr/LTn8sQOSg7XWw6zczuyphKuZ5mYKw8h82hL5MAAPynn9zKi/TtG0m1+iP5j/3GAzs9Uh17mcpjbu2EXs0U7IlIZoA6fO5+mG/35wwMatupnUk02JbNv8o0OqtLmmy22GrS3Xg00XQY5KRbjyjKxnxP5Wsfuv9A/b9ZrpbsXMJXZ9PWH6aUKR8IzCcq2tRrcB+Jt0r1Gp+uXG/GgADnAvQeQlCbHXj42DL6koAkWUv6JI2pTcsBD5CN4A8BS5Y3l9KxtlWfjXPv/7GS5KXlODLHHHRAq9sH6+IZoAurovUBsn/QK1K8mKw/L0lyqTLKX9+8ghSvZKir2zw0K0SsAjq+FcjydKSnJeBkH550x31piifrCjDPQY3HCwj1w9yNKMbcP8Dg4n0UDfV9rCNUghoBjI8aXMqYVUBEWUvkUT2OJxF2yogFoluCdjn/TEf/rkWWJoLYmShRNvSQf/uPUu6CI6w0//8yYlD/7GDMXUa9kw0LWUdvd7+YPMCKIEzj8qysuJlH5W3LBB07I5f9JrIlt6BLxa4BrJzAK/bVdtuHrf/tMHmIy1cx5xiei8jxevPFPWE0VvUdWH/F5//YJtkvRya6pHuhXbcvx6bfPAQdfVVKgpxz6D8O5DsxAmw0E94/pwugVl97kM11fNI0w5f16dIM8B5f5CjbCx3+ptLSBgMrGv+ulD9HzGWe0yN/eaFBGwsjryq1dFX1pBhIGu1K2ceNxoOgk/NroPPmnJ5uSp79BbTI8VMW0gZo1Wuady6GEOFfRPiul3fqWv04o/tqmVECe5SpZxP1DwG/N+uGE0zcJi4yyN6EMlaM4Yh4OkxooPlc3w/qAPIg2dTtM4nvdznU3lQQ3Z+M3oZZ/Vy18BO2VYlzW1AzlS+3DXOu53XukM+L/1PWFRmysmrCjKF7d3+AVImPae0iNsPa6D1S04rorDg3UtPfapi2A6tbA7v7jRSjyr4VHZldySyMqAv2sKeZwhYAvWX/PxgEKZJw6E3SzSjmZ/wkMA3f5xpIaGAVy6ZcwAUUyioc4V5NfiqaJYdqG3Zv9/d1nay/KnF0clpiH9WC5LFUL8iHkmdZ1YFlIOOds4J1OpGMp1jioNAE3GitoBetfQ+A30TjXNeoz++WGK4e7RvA6wA0nCtZbL89EBRd5Rm0R5OVGfD047/6UvhWIFFX+9LThC/8VJADS4Wk8U8bP1PIzqYF49RT3yAxjXpf6AfXNfEFXB5uQ2rZ+A6WokKuaUMuyVxcGnuyTvfXAaHeA+Y7Jh65zmWx2uMDBzJ+XcKehygR7+K6miyu+QUAwg2juH9bJZhw2dU26ndg8wb6QtdVMH0I9M8EfRnMGs3CePhQJHnBxrV2xyjJ28U7Nk9+M1W+w5ougRzasywDaLlF32LlP//vmf5JRR1uikMDnagIKUuNHpMadPly6AT8kTNeghszaB5zSwAGvwi/+E1yetGqmPdBzJFYFLqV+6JdBM7AC4ohCDAMJneZ9H3lLZHC0JA2CbJFBFs6cGdoCc5oMq7IUUCSjK5QKExq2wFzmUsWjTtbBKWWWlgQfVCZBEPisyECcYWNiWQD5KPTHASer0uJRm03jsXx82KYhwYY+316s9Hy/h48l7bllr2+T6GimV87vlyUp4qZEasJDPircKeQ9ewRRf9W62UPvvX3kfuBGLllUXWb+PGVzy3KwNoGck/XbsiV6i/y8ffn2pISH65LPEtG9bqV80GJe9nJ+1ALLsgo/UIqkQPaz37mturPzU6OPiIPzJ82Y6RvYyrOjRsG0IIaUQgQPGrT3I+aJlwKnD4/8y68rhH6LbJuJj+D8MH8xOHOnRXhUTdqGuKJfG7G/xMPslZf3ew8y6+Y/46gYCAwY9Z+334e2yzA80Uohl4PF/k+sO4G7TiXLAo8NtyCp0FxZ3bDq1JQcVu/q4qBLY+sgC9tvdDhITgA3fnDX8PvFWrEg9rLF857B4dPB1ogUpozrS0up8wh1I+sgF+G6Jb+ou7OR0Bc3rjbdcRbmox6n04FP7Y4kiH/3G4AVfzyvl44d7wiAckRWCD9yMwyolW50UI2QfRRYYAn9QSUa8AXebCPbaN+WjJNYk04UPHbX/0susP1CpjdC7WPyYvFHb+hHjGgkK2av4AfuzdX//V0nSU5eKwzI7cWLXCoQL2dZs3LfIRnScdF+0LvOk09PMwmYVoCyseoJckozQ3aT8rzWU+4Vb+z3/ciY1eNvbWqtUdMMsMWHLh7fWdLWVkMzJqXtSNUtnpizvHsmw9ena9lexBGts19gwdGRvvxON0maxmC7Q/i/MkTFwAvZwyiBWc4aaNkJTT28NVtqVGN9+lPYzhzzKgiSHwdd3K8OjMRVMmVtL9I8ZFjLKFrgwN0gCxqEioTaFanKuaglFh7qu+jVz9M/PQQp/9z4ayelsvJsbcx5G1KpT5izSiQRnC2/XlKmJQgTprAoKySE6KekZTOk/uB0zN8gZPmQf51vx2nXuQM3sTH3rjBp0C1va0Z8NUGNtmv/ocAdtUrKA4ZvnURQiAmbiuKDOItmDsbEs47KVc/DfbRA5rkj+6BYjHXHMzld/774GeYiSaaDsFIk2jMZLdhdCQOcA2D4wW4WjFAsEjmk6kIRXLXmIXZdVO7hBKi4lC3kA7Q/IM59F8vIkyYm+hTErHOXfRXCiliU4QvZGx+YUvmZPJSn97U/+R+OqzR41boiWwtigOZaxcbxGy3EwQLcTpUZY8Dt4v5jOi/ms9AgjUYV9433xVWJM4aOjiKXqk9kTkUPSsLAZPRmGhW1G2UcX2KlJNnc1LKu9gWP1q9HhVr1UQH/g+vU2ObF1BgY8LW1UeoqrvoWYf/mYW/a+wwWrzl9JO8GSrcw9c5sxRf6CyBztb9hL6Qhe3Sp8nBfPg4Sti9625I283+8nDJjNmJhc+XO+6qOZHLpvecvbtHyhmlNrWcwMuThSY0SO+/DJJuuMtvNpXNL/8Y9/oDFIV1QwZ0LVqIj6HnWZ5iJcfllnrJUN0JcEBal/LFZ3AKUsa4h5nY96HaiUGjuSVEg4cz4em1vfNvMo9zIjWV8YTbzrXocBfz7l1MfO1pNvhRB/qRFU2s1BULGiA+KaxGN+BngeRFJFC3bNQFEVZgKhyjw1Sqm3YOUwVXMkArMYDs6HC90YjOVq8g1e0ijSBJYnO7hY+dLNjwIqEa15BVNLrqplS/V+wfpjSE2rsWGHvjFN4FsyTsl7rQAuucoNSu6YM4z0PSla550VTjgNpyKUo0B3EStkg2xY45r+icIfEamcAE8nra/os+kvZjd5Vd+d8hmwJefRRXddPJ+5hIAcNh/JAUiGHKf3eBcf4uNVXDCmyrVJ7pw4PmYUEt9CeRThNHNlcVJBM9VMHIc0WOfTndms96uzbZMpR/9R5EsqRA9Ync+wmh80pF1vb/uhT2d+k2ZrmoHk8l+4r4XsNIwWwxZhz1jlll+H8lNwiLOqYdVyyyysakfL7gmEyHm7yZqWkgZZ0Ea5mCUK9LAvohd654umNvKFbw8ocvM36g27avZHQaSe7cyT4443Hrk7ydImDR9uNFwx+4z9Z7Wsjk7QUB72wa8CDcnp60VEuTRzMwHkf2JRDif5djN7dxkUaQrUrj8TVt3fI5EfflGCXer6p0WHg661JU/2KYPvJ016IhSzWTIbNLRXGwicACfoZL7+ZbCM74UK+VV83GxvST+yLvwO5DedXcn1TL9Xjkenyykp0ph+oKNEWmdymKvN1sHFj7026LxoDrRrtWSYmJRGIZdnrFVUlqaDX11E89KpZLBFd9HFUKA3shQwAQXEAM5D0qQhk3+FMJvzb1nvQ+2brmYQoqDQuGEajqh38BacXriYvSlmXw3HaBl4Z0uclCIa6Gg/IkX3QEwf42qs1xNp6P+iGLLYNWnvYVRMp1gpSXAGlz4eAmeSS603uOPES6MpTDPWxJjMDhBUjqnNo1vkv/sSXqWyZsmsIjWXQAM3lVWvmZerL9qJeu90vqqIU3Aqr5tketIu9Npqjng3JP7jB8610ZHYE8jFZyS/EFUU+wGxxjJeWNquQ9wQnm2gpn1plYakpTVHH+S/eUzjyhccYyvt3FQUtpQOC7aXQNk3zvdpDf0Llqs8KZ6PlNHHyzGr5FFTpFLjsJV1mjIZ4r+1CB+0a1E0gWBMWw83vw4c5OkloAAAA=",
    cavalo: P + "UklGRswRAABXRUJQVlA4IMARAAAwXgCdASpUAVQBPmEulEgkIiIhIjIJcIAMCWlu4XShG/OB8c/zHtU/sv2oeqf4b8x/bfyg/rPO0iNfJ/sH+C/rH7e/mh8sf6n8kPN35F6gX4x/If7P/Wf2k/Nn6UoC/ICgH8z/m3+H/uH96/X74tvlP916HfY3/W/ar9gH6tf5v7aOdM859gT+X/0f/ff3X3Zf5r/wf4v0Afnn99/8v+N/zvyG/yv+q/8T+7+297Nf3O9kT9zBXHjNKC3oHjNKC3oHjNKC3oHjNKC3oHjNKC3oHjNKCsi2aUFvQPGaUFvQPGaUFQMTmOPsYyInkDgVF3jSqCxnSK3/99CN0Yv/69KvamAfNUFvQO8OCOox1evaaa7L/lWDwOreup/wszL/Tv5TFdRd40regYYGY111CZafjDQlb0cKRPqovh2ZWgeM0oKyLVxZW50bGegqZcfoX703Lz2PaioyMsaVvQPGVN1W8lWj7RfnnGw1g1RohOFRd40refErCqRV/kbS0D1KwYuE8RSMHe4cgVBb0Dxld1WHndR57NbogIkrLt33RpBBJQZTYPIMQ4OBUW+VsoNVUA3GlagUH1rGkYYyNcwheuuPHgpoEH4NHZQkNNkGO6ZIm9wJ6gBgD5joN+/NlNLDqeTsE9F9y9szZYKgqG0c0tBEvlYwq/PMqAc++ZVsGdMwAulRTKBSKRDXJEVplS7Zr1ZHL/oS7uLuCzltPn7msG1lLItSAR/7oZpeDcCmPscl8DEuxWM45xk4goTrTJQW0ofrRBqQBXnuTsBhTVtWyE5KwG2GgRAtUPU6iJF0FFCS2KT9HYlaK1ywKaXVTaPO7A3B/10ve6ydLq0A6baAZdSxDGPB6GQMe3jljVbJsU0ByS8FiZ2kAQYLue4W6K9JQu8yKCPr//l3O59FOvGxVzavxNQ9DxlCi7lwXeNK3oHjNKC3oHjNKC3oHjNKC3oHjNKC3oHjNKC3oHjNKC3oHjNKC3oHjNKC3oHjNKC3oHjNKC3oHjNKC3oHioAA/v+saAAABRqlTWOrPHlkfRDg4XASdh0CQmxwHu/M/oRetrlPTuyYjoHOFJFT3qpgzKM/9fuFmJGZm6N4ZsK0rqLz2PTx5wyXmrZfI+Sc4RIgPrO29xsrtfqWweJjDFPUC9UaCwzUL2CfK3XiKf9SJbgTZBHjB4qkYuaq4a7ZWRjG1oiA5AFxX/HeyGT0tN/qbwULHRRH/9OOzw1KOmbE6wBwT9nNEkjirkn6HWV3DaDo8BaTYEvqn2cn6sd5ftCV1JV2akBMt0D4w31tgePZKpmA98siyby46lujUFRRy971OYUJvPHDXbWcmHgjl3K7APs51sxs+Bv5rIsRMb2Ilu/rv0Wig78JOWh1sX8cZ5Gp5QhcqDkBq9MCQj3T23GUFQYFVBXPoNmKZe2R27cg2zkcoxKsKK5sSRHxE8KDS7c7ZLZA+xwEY67fhcSMEFsTOIVqAx1yn5DMDco/UD2nU3knSC90sle9ZgFGCQGez23ES3tDJPG+i0DF4b/vlVXFJw+I8pwD0yX8WB9Wj/5mWF4zIaCyVQcZT1FN47+VN+E7mupMhAtiFhjK/kVhZ+aJ1B6LZU+78jRc+GSLN1qLfkk02B7VFDD/kV6XmFlq/tC1EenjlS2ZGo8g6rD/jWn5/DBIav8Q5oJDhBi3pjJY+UDBgcSoJnL/n49ixjCI79He86WklDMkVZrZc9Niro6LJjlfrqXC8LSOrw9P2HZsp3HfFp/lyF0b+ydXJoJ3+I/flR1W76Z5/c0uJ70XfJh5Xqu70R/+5WOvdGzD4Gnf5EqM0RoWFsrE0sLhIFKVbLbQ7PnOQXQv+d/8xjtZ2jd5ZKDRnMTyHZ3LD2uM6KeDVmWwSg0EWjnvQGcCHhhC9Bdz5/Lf/trqpahj/lG46qOhORPjxsZmifg1c6eBQrOVrRYaUZVS1sCCLPa1/Wik1OVBwirA9pTTM949br1kO34XyZyzWoG/Ad+jCFLuEWZ9BOql6TGO/Y5rQ13bO9yUirKqQUdDwmnGppz2BVgcmWJLJFc8hNlFb73MkNwwMknA9hOVr7+Cczdnx4u/qexSDx+kkEBOUkadexmrrm65CZWrq39lCBYQJ8Gb7P29GqMQWGBtoTzps9u03igzSS5VM6Wgwc+LgLqwYh5W7iLLk/2PNBVY73wH8TyhNeJj0oQusDPZqES+wU4ZXhXxDwGS4aEE3m93ptQrozyH6VvRxg5TSowj2x3QCw+hsjLQIZbKy6/WlsyDsXUUq3bBuOVH4CrBIMdBaGyTtGx0+0lkni13DcvISHtV+HAm/9ZYfrRRbrpyRQwcUi3/9lJcxCqSPyFwzk9PzUixx7pAsLvHJI2HhzOwkU38mFfwCVb+Havb+m1mGmishyV4FMXyB2By8kN6xfvHOK5EYavFkkbr9+8K7wWKdg6P+jx4N9mOUiTbSS0qGOyDCpwCiGa5+lM+3sdjXuadZZHVhgRAjZ2cxDKWwZlqWGqY0hUTIyvjsU4/lZy8ZwxNM3OmXFrC5AsQfl86Ty15N7cVB0DoTKlH/53DwxYEGtFCFvX7AQ5d8XK/48hZadIwf364fyVSL1rd6KRAAoALCiSLQCRSDOT+TXxtfDUYr+pE6ElWWbFXERjK7z29nwfP9EOZXxqoQzQjm744a6KQsbMuZKtTOzENJAAcJFeP9IHsuA6lyNIRUbNQoygHSSS9M+Je9+ggPviG1bbL+QVTYoHgS3oNQNJvPvtAn7IIFqfVp/akzxFNMqiI7+Q179NcnocOgXBzq1TYTjOFwWPm729yMvaBPv/2lz7sXdejuKsMeczg1g1+Zb+HKLSDiZTYEC4aRv4Qm/zo6YONrmu0WW7rwxVkn0Xqiimxm2cLpNayZh7u3KKyVenXgEOen+NeaPEmZDIFVjgvYuP7WyQSHfdRtfMyYvur6JGWnvZ2PHTg7MAnbPa1rt6/0pFmtpIyrPBmHDnKcWWHyjZjIwM0ys7kWpbP4A7dnHAtA1yhkUqQOpzbwO9EMc92Ot+B2hDKC+sFzXe9iTVByHuzKArJOqUIaAxSYv0ZoOghEgk4Kdy7SHDCb5ry87WxzcxsFzh5l9ZgzAHgjNsXIrGxa7bdWdESevg/gWRJycAF8zeoweNjEIN/sH0YssnqmkXmGRGeJlRyEMQiUB65c5zUYpKKmw5UcjfA35q55HlfFnZbG//DehzizSscNmCvJLJ4NdePAhZZubzi26yHPPDT87NtxvQup4MH9lDteZvf0BmK1B4oNNbJ9sljpl2QgFsaKsHvqi/fs1sCd7X07LhdqAUwpEpBnDJ3fXes58rhVJ+g/R7wCk92lntRToAe6g05YKXsGp3Ym7hjalPLLzFT2DH59DOzSD+AUwJfsMoYicyeIW5A8X9zSJJNtWQUsyRfXXGQjYLW5c+Qsi5cm/L38qUBS9HyqmIYcDE2HkPsR8+k+KDxqx8RAlVBy7U5ycYB8kTv1wB+XbYwh7doUslr0qXxpQhbfzQII3u4+1JlHqUgq23Yu46NIR6H6hRIymK1Py+MfDyKlhB4FOk0WKFAWa+Zb7y9koPt1Zuvv8W9tSYT0s08JPq/XfZ9D8VB0UHZIhcNnTUBcs3+9yy717F0yj890Sd/D0KOncObjzEzJobjTx5V2Xc4aiJkQSMgiG8pMaWgpVj19KHdcw770LUDuIN1GU2Fqn2VDPGXDyGLzLuyknDsLAxzf74v0EhqlMfnipVFJwC8c0irIyAXTQ1eqSNK4IPoF7fTou4TBEDPB8Axgzw5f0ypik3RgXPTw43z37Ln3/koHeTHbT415EPY7/3tnXZPXjeHCQjTrTlYFqyqyifV+zidUAcnL2ZJfRmHMHLm823JrciNPEVupfEKh+Oebzsw6g0N0agZxMtYY7hgqtmv3KZiXCr1AGnX4R0Ab6CKA1GzGFjOFfN7LQdNX4vvp8bCljxEfiXuyXX2feFIdlzcMl0AYp7ZOEmAjy49MmdgvmMJUAsTr7HHOt+tId/DEUiHRiSfP+7mH+ZZFvZDrRRtIvrU0Qf0f99rKb3ansjIbhCOZ34ISuUUhij+4YxWXZa3Ramb+UYOegTwbyXDuHs49Bi3VFd2Lo3JPWoMD0JrHryYuEhguLB25GNlv6H9dILqsQdVcGRYQwA0SE3vw0GO7ExJpQ51g7OobS/aJcd02prIA2bSdPSsLuxn/hJtoOD/1/U+7zj9Dzd1Z0WqvAcKvXLHMxm8MB6NqQtkBhUzqMwVxcdLer4lu4ifEAw4WQ0jkUZt0rG6xEmwP/YzTTRTF8hYwd+Hh7VX+tOUKfgjL/2psmkHSPSYHlvOyNpUQnzZpNrQeVJBiQwqr3ztAm9bwIjmiOiof+C/MnhMWqHQ30jXrgtCo5ULaE9bFZ+/KhhpP8U0K1ZEWYp4ya2lEWxiBniQShjvLBCl78k6I+Ymf+85J1P2eA3RB08OeR/+43h5IygO8vt1Mew8dqQ9xP9+W5k9CbvMieQa06lFsn1RVGRlj4C9uIRp2X1upUO5E25EN+VblwDqWIDCBBRaf2mMx+h9i+v2NSABMP7+E8noJUF72m9zxdnm2xQgUKraqiam7SDC6ZvK8iZOKtDLgFrWBtAdNhqjUBO3/LBJ/ja5iwZe2JII1a8Uh7P4X80BD6za+7oWX+JFVWJVFNZcbJujmn6dBOJseVW82bKQPaqIwTM114zXgZGOm+o/dGYajWvayayKgutBnpDP9/s0YhihAaUaHYBqBlaWCE3QRbnRpe7muajN43Xrxy+z/yA3GWpXiPlGln1X8XQMVQso+6hcFYpkYcH90bWmN2uG/rdrpkiG5xVx2aE0HIyU7pdYt0DGAyVNMotlLpLAxMC7gA1yd1/dNfvwlTeyEJHvdG0XrDEbJI1MlrFhJ+hqf9aLMO0ZfMAXPd60VOSfV3vWapvUw0kqpMx/jNrCTgIjgJfqnCGE87IR/jKRU00LHRwidxf1RnjX5GsPjAM4BmzX7qao2Y/im8c06Aa9XPpV9fhwGlv0MH5jWuUMeXDSLSlO7KCuqRQVgI/OWiJDuahWC/Nh/uFE6QyZF3ds865y+DDgG3rww07clTDPujDONZLKLUyavLdr72fAZzj3m+BhBblnAdZuSE3Xd7nBLY90aPsdTlb1OyChRhr97zfW/Omtd1Th//026eCe5NT0i1eU0FmKRc21/9cBU//Vzw+7zsBle2tCivtF5u2Wfd5WC/C7wB8ftLQjFLoVPvhKkjOEOCEbiMYy9s+eGWyJSAeijVXJFbLQYh9wDBO3QcXcbM7ny1YSbngVeXX8pEMMkMLFDuX5QNHHfj+f9ipuI5SF/VHnHcFzrR1vmqaPHcNrHh/s8uHSFdPp+EodhxAZlFzgiqXZHVHWlWzcf+U4yxRBZ8xGpkKufYG22eAj0d5UDym/YG/qMT3C0Kb8bVEVXYq1hPwRIw1NW8Fca7N9qPm9afmUz6janiNdk8kcUdpB1OFShnaZlMiTf5X/z3QkaBp0n8E8GYrZCnMh4G+8NJt4cUjIYaLePi++QPC+q+YV0TTeucGbHuZ8a9b3iEdr7JDqGfWSs683jHebu/ur0mkX98ORzakLObMZ3HvAHuTyzuQuehDfMYqadxBS5+pBbI1FqNf8ZiLJtCFC7FKvZrwNtxOQW87GB1UCrFWtAViAB85JNjOuEUt6Cps0Y23o0ZUN+2LgduQUVkcPNRy0xr3wl6Hw8lC+UzED9wRQ1yfS/DFV7LPbNxF/VUgpQlo+lVCymhOyCQc1qEQUaKsm23o9OoXsJBs6HoyUrTB+pJyWkCDXdliZHFTQvUwqd/7A+jXwc+6oL4vc6zVo2NijjvkOhkX7GF9/9SQC2cqDm6Y74geQ/U3iYui5ey5YtzAcJL1MGM4x3EtyWb8hBsUF1QkulFlS20gCUgFpZ849ONtj9FsyrEVFZLWU66CiIQMnR3UrGge7HHrpMqo9Kn9JGN36JMhFjseF7c2+vW/y+ZTILmrSomn1PLkevGYSAmmJhawg10WWn2OTh07XFDrreRaAOTXyejjNzwEQDVQAAAAAAAAAAA==",
    carreta: P + "UklGRjQNAABXRUJQVlA4ICgNAACQOQCdASrwAHQAPmEskUakIqGhJfi8EIAMCWkDzw8YlPP1rwl/F/mv7N/Yf2b/ej3rM29pv8i+zf3v+2ftv+Z/zZ/pfFH4yf0nqC/iX8c/vX9g/br+9fuB840YPkzQD+Sf1P/Xf2H8fvRt1IPAH+b9wD+Q/0r/NcfNQD/o/9q/7/+K91j+m/9H919AH5h/if/H/mPgN/lH9k/5f9/7Wvo0G6mJBv3UfLqPlNb47zsLvFrJv3lMqbLbT2SwhP//rCkDOKFPRlEgGVkt7I/BEXHntAHs9Heit5WAOiTzqey7qffubdwiwvbG91hsIFHY3WCew6TBdMpAvkgXlfJqDKItHe2pNChdc4cxI0aVf0SSLYC4+adkO99+UDglwC3cEWnDEsaPg8sjxRR3g2RyKditeeH0O5oXENpJW7x7UBvh2BVuIDJnoWBqSYZJ0lCPM7sxRrh37iQw9thH2uFZLNTpQq1gVyf4AVjAFIs9T/F5Jw57hYZJkiQ8K2HpFdGegsccFBP+eZvnvYJ7oeS0XhdC7fxO3LKBWQsgPZYMmqcwk2dLV9t476L8jtt3kVp624546RDJzORIDoiNCFd9XOLgwUQwiQMs/3wd1H5IF8kC+Q2RrbQAAP79K6AA2ezMcQnMastp/i8FCsgGRCVYtbtFJgjv3w9Km5v0/motdZMucr01PssDwJU2iJkWON92sWL39aB9VTmDjZRjdrdUir0DNs/WXhi8d/7hA5Ed6YdpV/6P3xhMdxg9C3JXqXVdJQERrxqEjl70/Mnl3+NsY6DNjK64Fxbv7Y6t6LJQX422ienaDo1/feF7lR+kPOSA8JM4G1bQ86xdOUxwchRiw949yV4QnTK3JqWUSrzcAnnt8xi38Ss9Chut3oSBD6F0tBAG36tNmL9KqlTF/CBd/p+oUjPFUX36mWUbaYHy6NJWs8SLEYNiC+mn/A8J4mB+YimZnY/GwpgjKfzuSVdYFWadi6n8aHJapWzwew0UfLt8Z6PlCj9yi0BSMOkbZ1rDwRx5OpWmsBv42OjMJeykoujcw4bC+rzpzPZRdwav+r52Z1rYLlQvA/BlxeTxdlxuF9PduI+FCAUHnnucA7CUQS8bTIvUOyMA0uDNH3Bx5KTTiW2k4odWLL1SMaRn4yNHQaL8O+Eb9jNMfx/E00KPRrT7xVTm02X5hiYcn5yaIi46SJ7mwyUXW6dfFcRuigzOEB5InmS9zx5dzABNnP1joY/kM0mOOqMtj262q64I9QWwb32N0ipz6nu9pa9GCa6WlunwcMFvD+Xu1Ax6T99/R4CWRose14TTixANaQA8CfpEOWdCPC0VwKeZl/hr8uvi3yOJJs2VPZ9+uzdzxpgoz5vxTEupctzh/WWzdKC9wQet5OPUfSJyWL2rG5DG/+AYaIdm4ZzK6l8R2mzVV/LQs94phMm8Q49fBQ8H/iGreNHzAUOZSHXuYR2E5UzQ7kwl4NFrPdOr7BCnymJbugCsVeobOyBYiIrSdaABYD358n6Oh8aSHB49Ln8ITCS5nhC8b1IpFWVDn4Sr0K3b2vye0v7ve/50N8YM7bzyBzw/v+QCkJA18xrY8HC+YusZRuDONMGOHw4uYDHv+Dv2b4IYxdCdbU4nvDTSz5TbY1McEXQPGZvz8ZaYgv6N56kZZDiVWI5VbIK9v04FrpRAGJVTmY7LAjlcZkiexOxbgf9v+ephJ2O0WP5agkAI+WdGx6dlh08WtID+OYzFeQ/B8OFPacX/UMaL33VLygLw/HobP9vhzAjuIyGmQ17iTWlw+Oz7zsZFG5YksH1EPHvGy/OOfufeAVtHxOxTN3zyv6MRkw0nidDuXBAGsLgJX8V3Vrk377TnBMI/8ajaLGS7hb7VNDNhhbBqpwNdBy3dX9GHxc3taeHTHHCbvU2lZW+PWvLPwsLBiouSTd85NKldPERUc+JQ0Vu7I1yC2e0kGPNT4d4r7Enk9s612m5EqbyFoIq7rNHGDUDvWLNUo/KdoZe6G1DWnKm3vyzNZO/jcN0wh2FE/ihC7Wtly0qkxjHsMAwoAtIR9M1+H/DmITJsGYpEa9WFU17IeevNKM5uzpVO3NV9Dszk5ynt6HlLzPZiecpBBg6ikUCno1g5UODxiEyrLkw2fHU2HUU0YmvcNxmAb8mN/0ij7zGxqhjbT6+bi/zZE+uOWvOkssN4vtblGNy//HQ1RObyfvXYvymH464Jt2e3n9YnVNeq1+AgqJTexfkfDq/8tFUfGRNT9bXj0YAhSSLRfoXY+O+k6tNVSyxnfolNE0nm8GyELY92+ZCf56fD72TrI+LYR837TkhsyfVNTy56b5saHId3zGWccectQh5/Ur7cd1LHW1PlOpAKL/NvkXBOEkrVabmzV8aDrOKTgfyNZV7+wnRkldqjEZBbKvk4sKRKVLNmleEviK2A+jriJx1APktYHP8+diCR4nIO+tZPAin5NVdof2UwcuQ8Mq5C5eWIZMrSvwDIj7VR8OYYrhC5Pmr69JycreC5JxqDplhfH1aqihhtTT6DCIPdye2UrrkE9Km4QfBpFequeTCYKhgmv8+0PB3D3VYNMkdwxIlaIl/Y6EaApEk9C9XrTiS8eNVRWubPoET4NrQMb/QnXne4kSvCu2tjoGznmroBzkLgLea9/NaiuGFT9UmvrF88jxctCZccRSppPv5yU4zAspXITm21NxO068zjfKKvNVXSmqP7NKzQ100HpyK5EexbRrPL0okXRa4b/NP3me82PpTy19/xNOGZnrqivHWbpcly/4y3rMo6mv4RkoM0mLbEU0U4ytR8G3R+WuBHVS2hMq7rfQwjiS30Xv5H1p0y5pv0W7GGBudfrF9eYnRUbbJr9tD+r8R16BSC08EHZcXMHYG3PGdo03UVwM//+LGSXN9gMqe+FT9PTQxvRyvBzp79AYSa5QRxRGMZ8Kl2A+Lq4NE8/bfQv8rxqS0jNT3Mk4UUV6jdK9HZ3sBcA9xIwcLV4Xw6D8GTW6gmoKEHbCdkqvLNqUmOd/eWmEl3ODHSRse1WV0yXzpP/ScEHvkC/5qJIf8Vbkiazx12FJKNk37hpG25cLv/1Bl127UInJY4qrvHz2XKuxZ/aj04oYY2yoM0tQpIlpwByZRLSeV5InyC9NOZk7PKI7UWfBy9RTIsi3a0OT3weem68nDNMIiU5nEl7t6RRT/5BtJ7fTACKn2GED5p26or8t1Gl+f1xPzK9m8Hl8zT035VtHJNQNZqjtpP9FLroPxg5tKMvb/GnK+BI3fXuoBe2pDaUY3z+13J7AuZn5k84+sguMneBhBiQHPcG8vuJ6KyI1DDwybnWWNTnNURtP8xnW2yJh8tJVO6QD/fXxYQKOTNYiUWtyF/u3/QcgaG8cUKTYLePEuGtGiIPj+5GaMENhIpOSexFnWtRTd1Iv60YFCBIhCXtPw1EADsbdSmWatorHKbheLCUW7RsTMGCvV9Cy0lhvW8biFzqqcaCEOynGykYqYt9wBicpTBFWy//tPCbFQk3tsYMqokifLV9WLU72Lrs9qyl520BQo9j3meIWTQCAsqeUxkwdqyKCEVLXVzKfS1X7ds0d1nV075wnzhZJgDbNLV9cN0STYGr2ydF3vlLtzlkj8AMbOLV86mRuuumhy0to378Ii1AkR4vSQJNfI3DXptfQcp8nGsJOIsvNnZfQTkoCPsI/Pa19pTsiozTakRWbYENgzBpolnwCWYLkbMef1G75Ocx01d3Qi3sLiJP8Oe/t4wPbXeE3Cgxx6doIw/KLyMWzqmdxORiVrwuTwOhSZLMp74ataPkSc27xezi2JRP/cpN4A5iuw7zBIRl5B57hA6SHHPaOnafsSS4Ywj/CgLh/Zulz/CwY5SHs1x7jQks2rbqgOgADJal420Ob3ZUQZlmQoS6BNocr5NcELASGC+wBlD6v2kLj1Q95yuC+9hZt5wn6Dr84ceK7gSJSnGzdMIM2plfGamSH8XOnlukWpS9d26mAJTcL8CkZ18TpeJFDJIIndPBGmuO3QwfI6G3ylXoj2iE/XIrBOEhTalE+rPqopEI80ATwrt7Sf5wOG6TmpNhrnJ84J4FojnFE9T2gnmog2/JC/5Cr5Weh6N9gv+sJp5N5Hvr1UOC2PRvPuO/OnusvRS762mP2+2uXWJ9j2hBkxPjTBZBWyfVI98/5Tap6PaxWmoIMo2ZFvXlGzeqXVfpMdtY7JQa39NEXPvAARYXn3Ek+9HWO76t4aNsQ19DkHRLwWzxi8WdBfD8uedzcGJ7144I+ockRfOFXahFkEa0130Q+lR4X39kIwQ50J3G+qDHqRypSSIs8sJdmCcp2g+W/VTD3SVQTffHDQc2conOOX4L9dZOEzyfPOygkLxoLHVnwpqz200YHU3ZiTzhe/NTidY4g3lcNsCgIqKL04WwslgzUDNU/KUGxszt+doxVwB0TmUqnAaMOUgeOldG4rCDU21vC6h1jLnGd8A6Y+HPY1HifwAZTwgMAAAAA==",
    truck: P + "UklGRkIJAABXRUJQVlA4IDYJAACwKwCdASrDAI0APmEskkckIiIhJDd7sIAMCWkDsB8YwRi73hf4nPKvsj+QvSW3Adzj73+UPtV/ifGf3i/1PqEfi/8g/vv5U5wR6v/U/899vXlAehvem/ov+a5ALxv2AP5f/ZP+H/a/Xx/2vMH+Yf4r/0f5/4Ef5Z/X/+f/fu2F6QBftfGWYs0JuAWbsRQZFZizQmj6wlGoxGwfojyU+Rx0rTeBiq+3hx1lBkfLbmjCHT+NmNpRbreomKaWP6Yr/EdaGcCQ62zmgqT/Iiukr4n5+DKIXMaetEGovslv4LdSxhq9AHjru3+sfAEcxVhUizyielrFf9mAspeRacBmb8Mbv6rTijSuuhOtTfdUQWuUY7P83AuIUmcbpJCSiTxJNoaycRsxsqwEVzWl2L5yAwBt4NLjAWGTQNsEV4teNn8rPuv8Ts17jMrB322nPcOu/xg5R4Uj8wTtOVKMkL5gP1yzp8G7Q2oAAP784gBumAAAEj3kl1+BFYC+x8uehX4AWLRkVrbb8y5FZt1kysL9V8k6DmqXDOGQmCbuRAoWwaK8bGpmaRCd0+SQLy/3XBVLkiTXqsqmse6ocNgBQzPgQRqQlgzefoK9CWm3Z1+UCZHsevrGJGoIHa5J/1wiB0jJwFCMKWn8kI7SjDxCylZLs4cI8i0OIhvKFznDOQGzbSdPEm5EsmX8q71OUkqMktZ7w7XY6H8LTEP3Ly9qvvjFvnBkx23Cll/6I+TDQf6R3xTnNx8i8P+KX/Sw7JIyYMg8PRAuarJL2Q65BjV5Y/SvlXAWKNXmLY+5Xk/hq8+vihiveW7AmPnpbqpWDIo9BtXrZKArVmO66NMzxsU+TsZykXyI6LaIXQufK98egizdZhvKW0Msh8YRLGLcltJ6OeXuNVl68Gwl6vvcwQRnJe0TyNXgcRjsr3h70jREpewwuOAjKWy8uIhzWJYI5PWja1/8iIyCNBG9byTnD3FGQe6pG2s/RE6JacPrVreW7fubKf57b09i5ZQyYr6m7oxZXIfZvACS971cbJzjV6NG3wyoc7FZUvb+i5bV5xNUY80xDkha94FCgMN2irB+V0zhcA2NjkTLkkHme7TbEItN0m3XNse97Hp+1/WUQ+URZnMfpTHlRxoPdGDbpfntsF0bPw67V1XoBLRHeQsv7bkM54Ti1srRGShEU16HfthFzxh8Wah9cntRhfMT99RVUokuepQzs3Dvb6oyp6zD+EzdI0btlgkf/GfVlev5HsclIhCKbA3DhBuIBBKTn/RhZPdRh9umxTuECGuo5hkbVvA45gyJhrxr/BNzOeedKBY0aBGv0o8NENKYaor0mmo05p6Gik9Ooph0o9y2C6lHxVC9y7qD0oWWHLNH2wgPOMLPT8LKQO/4U3zq0sI2UmDv8tLKTSEV0fdek1cvZjDF621fv55HcKIks8CcLtgfcRm85/Yp7wptDfnLNFxoAUdBEsyub9QHVI3W8vIO1ziWoEeYrYLkh37mkY4Ow/7tKZWsiwoCn7YT5oXnOKBo/lN+D9dboEDEuY48pj9JeWBNfpFDp5v9MDfJCSt2FUqms1gP4h6cwzaQMzFnc6AsJhpKeVUDhxLnv+pHODreYGq5kXRQeUlaG2g/aq3oFWChBvW0yl5fqfFV/jE8wW8s0AONqgv8rJDxf6gz/KY04kLKB/uiJ5s8XhRtqSEuoeham/uFKaadmdz7sW7jznu3w6wqx/pH/CPOBcMY9ZhCnLv8VpUDW+igeVqwXjcIm7S20V5XYUW0myeU4116UbIY4pjKYzchFhNqVkV4VamPzaOl9q/QS7Znf+YtCx/7JHQop42v1Y8uTGyj1lf5ShJq6174DGQNvY+p1m0s855SMKV5vcB3x76Vq06aNv4XHxAuR0OY3HZUxOcoav8c5ZyzyB4itNAGmI+XOlekn9GY+BIaVLjlpQ9Tw1u0bdLOsPVYhwzc/eLiP2BM1HNiQErrg7pmPlZJp8U5RcjSmlxeSvSuzHafTP/ZHajYwSJI3cKlUrEtI8HFVrxVdTg4iPyf+ISIpfCGFBgiNTnck3l+V2YsMSUimH04iqfEYcI+whzYZT4/SWjJruvqnFmuwwhdH1Ghj+en5ZBO0hyfPSMErw+tN1LBDRcA3zvvEvof88ZsHLJ/zvKcinwe5g8s2J7C1nOz0MmJej+WzlzuthEoKr0eSCbN6iW3PpS3NdCsLaO5WLNwHyOc0D1dfRkxGniwXFeFZaI4TwM/8NbUP6D+JT+MdmMx22ef974X1W7J+rAizk0I8IbbiNEIuJw8QqBcROiamy1nK9UOoHryKOBDjcRAMli6deKLR/boAuL44NHc0Ce0DxoBKa5EjE+lU0NukE5+aFJP40OtTtn8CSoVg3xqurlHs/rPpiXsZeCmpfO1wmog08fVE2wXklZ0Cmwmb5HPsJeedc9gKTUgLfmmIydBvh5wSGCd8ANuKOH184Ie9bXobVfYzdPRTL9ShH250XBCGQLSfg8g28frSdv7P+cxyIrGFxYAjgPavASx96Fkpm56mOzlIGHdf7U524CzyhZFajDQKXTMPXRQ/PzE76p2OSU/SSVX/xF2QqcKdfe/FTBiFow0jv4ARpl8FO69lxiiF8PudxdSz7Omyx8tvxH91MB/nX+ZfH+KDtxXrpZe21zHM9pPPNRTHP1R4rBmj5gdCWPupN7d1bmbAOY53fxrELVk13fXwMy0XMc7Tg7ite/NJz9iokacxWxVVvUzyGNDhqqhCFwV2aaEewv09yzmVw1XcsasCVu8MqtUROToqVvZO4LlqW8YYu6D6V4HjdjTBmtsiW3xojGPoheg+K7ucON1jRG+GcTwT1gWGwf7KtgRzY+GDKpi2ODo9Onjc3DMFhLDiaE7XFD/oVri3PHve8iEkQGhzfW+M9FPhnZyRimmuDyL6FUXrHEXuYc1wFhBarGN9sO87yn7KvIiu0zF3b0PDifPA07NBX0q2tTC1fJugDXX8UspxKANS5gwiuOA43oew5ntvOKoQLsPNV2pdDSB2hQ1cB6JHi06fYo8glX9oXFv+DwcKIuLej9vp0rzQn7vBL9gDa31NS9pX/SDDBfCjyd9o/o9eDb00443NUbUUBRiZfhe1h/up2TtRzD9UasRA7ri76LPP+wpAAA=",
    van: P + "UklGRkgJAABXRUJQVlA4IDwJAAAwKwCdASrFAGsAPmEskkckIiGhJPJMIIAMCWk7fgnyC6Z/vHh7+I/Nv4T8qdAr+S/ar8h+YPnOePfAC/Gf5L/d/yZ/K35qISvHbtV6hHs99G/13hNf1XoJ9g/YA/V7/i+VB4ItAP+gf4Dz6P+v/I+gb87/wv/f/xvwGfzP+t/9X1tPaV6Q5rESbMiaK90eFQwTaM1EH1TR2qxv2DBHGtAxbH6hmsomHzbzcoJz25e/w4Ze7zQqpQtRxhHap+XwTDo8QapcR2g8xTJYjA6MUz8WRTC1w6EHAE4yuP7sVUYjdCc/gBdcpIV15Rv9Be1rjQxB0SB45L1+YMUBhMIG2BFOrfwhH3b1ztUEOgKHLwbG/j2j4toZ9sspAPmEmfRV6oQVSPNEwrhSlgu2vta3xf9IZjb7PJ1ZTeFLvUu7kmpRTUC+7r6qTJJKdxIJX74dfoviwJ7tmwnCXm30+63BWQK1GQAA/vzrIAAnq+dqzTh07G2YTGmX/w+6CdVpub7It0m1RNBp5xaU9DQCrLayxrLbf8egta0kf1aJpNs0JBnPNl8FFS5f4xBJkrxa5iWmONWx97pS4C1EkXhEj6hCeLyryAYQLYfKrDBEoZKP1o60aatM1Tb+AvT+80XPlKji5b8csbI65ngDNmLRlRV2y+WLAKaUao3D515eJSqWcE+BcV+J1Tj8KAyElhOdPn4gaT/8qpcEwVRuwjxGF6p80XAtS8hqiOTIvwoeJdVkPcpWY1TV0epA/fPwePhK//7KU9g14afn7NLQLbal4JgJFcnP/iF/KxtUQTvo3n6TC8IJbPcJythSuHkJHFglSKo5lrcDT/32AXl4b7FkAdQ0pO5ulVTV+NpWG7Qd35lGTQdFqkGOtK1U2QtinEncsufffn/tRP5JM/Huoa4OhtAxhod+H6/QA4BxpZQ86dhlwd2JIfcGEjDoU1DccGo0Csn2f1W195gFfZcSNiEEhKhRKNnwGGeicKGl5JTjdH3Eysl0u3NO5X8M7s3KRAfF11MRfzBbDXOCgFqUw9u1QV/Z05O/SEiEx55IAUf+tif7bRpafegwNLlPb8uJRukb+pOyh5bb535GVLear7wPfZEtlQFzJr51xHI9zGTvm/Icir4fhJylql8gjDGHKP6O4VF9ncpFqmw8whAs0OkU2P3gVAE3G3wXPhvYw5J6x4gsH3kCD9o1Jgw+V8IRdWeK94wMiCZXPA97Ll6O/1DW/4ntT65BY/4djc334fhEtYCm6VAMLwvptYb6dsH1sjoB1TeRahZt56T/YRDfNjA5KYnDFBNfNscNUEnc7zKdh4YevnTPd95dkISc3QIsKaQgNjby8AEGX/elRNWv6g9B2w6xH08MxVfJYrFXoIK4BTWx5c84cyj1Yq1adrwV2Zf6ErCVOCpjWyNXXnTIF83ES+s0qO5TeTs/2Ghvw/QFz96KijSSPJiAFVCgjf353Tlvox+mwVwsT3QIhUGHJ30FMpalyRf/yyPCi/ubXd4gQLivkki9WBlRudo9meO7y1O1WerdSj3OcFfRsh/WcrZ00VsY070098WgATI8lyxsZSygRR2r/Il514/IMi/inZwdNAdae0ybilV88T/NrMAEq/fmrzCwq6x60zMuKf2xg/scFEEpXhX6WARgo9A2zpvwSzkDLH+mGVHuQjDEQri10WJfHNn2oLe6w9OQzG0JkAPK+t0xWp+ytL6jtZ5hrdS2LnUOQcyojUYrkBi43aRnRgPmFJIs36VIez0y+Jbo2lFYHhfi9CJVr5lVCWzn/WIzpTjgUSwMoLpNQXLIjKm3iCXyJKJZkV+AABSmTgGnETd6h0mNbwld8PMOyPMjYm5U1NBRI6ruH76QIw4NpMMT2DV9C0GO1p7NvHn+bMFF3u4Po6WXQHIPTKeKZR7RmMixL8TYgj8XzJ/uus3U7Emar7nT1etv9kfOv/M/MAGPD/Va9jy9itHpdEcVZ56/Dj8x2T7RoVwF7GmG9RlIERMzTEkDxn47aPp+vHi3OvYFcHuSqkE7BUslwo4d59chFGMMGz4w1NBmiiqiFVBeIAogM40F5uRPpbeBtqImVJo/pRXSeCaT8nuP6RH+lXnb740MsaiscndO8L0SMYEfqjAEG/xh4PPguVF75uyg3CCmV46bJbb34XrhTeUFqMxaqKkwJKgp2a90Tg5vDjVgrcc5bXeiV8u3PqbOX53u3Bva2/EMRRFKqKHrklhxTU2MkTMMjNWic9h2l8++GIj+MUnaWYouJUMsdCrgS5pEMQA8fiPoB5eZQYVqqOaoobyGx73oj+5g3yY+k36jtk18KqoD02GHuicIcc6QFI9WN1V07KwKh+UGSXhSDtgOuh9BIeV+BImCx3zWZ9yfcBvl5i9DA9eqUhiBgDssvyx4xon/qBrKsIq6ulVj/SfjFcPoclhftq/zJ4BgDI6IhDu413Fbh6ov9+CgQknfXdTSmE5unSwGJoKxrlLtC55YEHT+9Yim48ApHCbYyQilvNayUdRNkJilOcMa+ibsTKNoJxab6heH1Xuo6azqQ25/Qn/JLaX0ctCt6YEORse1f6bz3OyTC1Ux1bYYMnfE0/cAfxEOc+uoElXMjVfd2OcXKRZsnMq/pVqe3Ko1y1qFfb3t6pGBjQgFOHeIqkFKNqPsf/sNDUj3nP4Jh8YmTFD5/a2DwNm9TCp1UX6RGsiPkUctoyu3S7yiBSoGbiktkv3Gr+xYT9Yc6jbICf1A6mSfpDLiQVLJZCWco7kV/89uoot5mDBC7lNrEO8+laN6bqwcGZcEpmyms9SPc0lJ82UCn3TDYrg6drswJEjatHkuFb6XURDM96P7U60gSVpKGJBMt5wkeg5E622L6pfhW/JUR7NUIT+eFwmP31PNurak1FY6XigJ8X6yrpxDKtb9BVp4isx/gqXPBDkmdd5HriQG8MYTxBWk2KABseIHLVNCVtRpwFBCmg3l8sIKv86A5k75/gevD0ogz+IKcz7BID636Eyz+KCnQy5tRy50ONEJDs2Mnb8MA92+yhyjOxxPb8XLPtYXY+e+JlIheP09caJN6qPLIZEw8QoA8MdEzPbKctiRB64+6rNNw5JGB2s60b2OsNchypUS1qy//mpVN7c9V2Fn7Z8TIopzCr70v1A2ybaiYIEAAAA="
  };

  // app/page.tsx
  var import_react10 = __toESM(require_react());
  var import_next_themes = __toESM(require_next_themes());
  var import_recharts2 = __toESM(require_recharts());
  var import_dynamic = __toESM(require_next_dynamic());
  var import_lucide_react = __toESM(require_lucide());

  // components/VehicleArt.tsx
  var IMG = {
    cavalo: IMGS.cavalo,
    carreta: IMGS.carreta,
    truck: IMGS.truck,
    toco: IMGS.truck,
    van: IMGS.van
  };
  var TIPOS_VEICULO = [
    { v: "cavalo", l: "Cavalo mec\xE2nico" },
    { v: "truck", l: "Truck" },
    { v: "toco", l: "Toco" },
    { v: "van", l: "Van" },
    { v: "carreta", l: "Carreta" }
  ];
  function inferTipoVeiculo(modelo, marca, extra) {
    const t = ((modelo || "") + " " + (marca || "") + " " + (extra || "")).toLowerCase();
    if (t.includes("carreta") || t.includes("reboque") || t.includes("semirreboque") || t.includes("bitrem") || t.includes("rodotrem")) return "carreta";
    if (/\b(van|vans|furg[aã]o|sprinter|ducato|daily|master|boxer|jumper|transit|kombi|fiorino|expert|jumpy|scudo|trafic|vito|hr|bongo|iveco daily)\b/.test(t)) return "van";
    if (t.includes("toco")) return "toco";
    if (t.includes("truck") || t.includes("constellation") || t.includes("cargo") || t.includes("vm 270")) return "truck";
    return "cavalo";
  }

  // components/ReportModal.tsx
  var import_react = __toESM(require_react());
  init_api();
  function dataHora(iso) {
    if (!iso) return "\u2014";
    try {
      return new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
    } catch {
      return "\u2014";
    }
  }
  function ReportModal({ ordem, onClose }) {
    const [notas, setNotas] = (0, import_react.useState)([]);
    const [texto2, setTexto] = (0, import_react.useState)("");
    const [carregando, setCarregando] = (0, import_react.useState)(false);
    const [enviando, setEnviando] = (0, import_react.useState)(false);
    async function carregar(id) {
      setCarregando(true);
      const r = await api(`/ordens/${id}/notas`);
      const arr = r?.data || r?.notas || (Array.isArray(r) ? r : []);
      setNotas(Array.isArray(arr) ? arr : []);
      setCarregando(false);
    }
    (0, import_react.useEffect)(() => {
      if (ordem?.id) {
        setNotas([]);
        setTexto("");
        carregar(ordem.id);
      }
    }, [ordem?.id]);
    if (!ordem) return null;
    async function enviar(e) {
      e.preventDefault();
      const t = texto2.trim();
      if (!t) return;
      setEnviando(true);
      await api(`/ordens/${ordem.id}/notas`, { method: "POST", body: JSON.stringify({ texto: t, nota: t, mensagem: t }) });
      setTexto("");
      await carregar(ordem.id);
      setEnviando(false);
    }
    const lista = [...notas].sort((a, b) => String(b.created_at || b.hora || "").localeCompare(String(a.created_at || a.hora || "")));
    return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4", role: "dialog", "aria-modal": "true", "aria-label": "Report" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-black/60", onClick: onClose }), /* @__PURE__ */ React.createElement("div", { className: "relative z-10 w-full min-w-0 max-w-4xl rounded-2xl shadow-2xl flex flex-col", style: { background: "var(--bg-card)", border: "1px solid var(--border-bright)", maxHeight: "92vh" } }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-3 px-4 sm:px-6 py-4", style: { borderBottom: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-[9px] uppercase tracking-widest font-bold", style: { color: "var(--text-muted)" } }, "Report"), /* @__PURE__ */ React.createElement("h2", { className: "text-base font-bold", style: { color: "var(--text)" } }, "O.S. ", ordem.os || "\u2014", " ", ordem.placa ? /* @__PURE__ */ React.createElement("span", { className: "font-mono", style: { color: "var(--accent-green)" } }, "\xB7 ", ordem.placa) : null)), /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "px-3 py-2 rounded-lg text-xs font-bold cursor-pointer", style: { border: "1px solid var(--border)", color: "var(--text-muted)" } }, "Fechar")), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto px-4 sm:px-6 py-4" }, carregando ? /* @__PURE__ */ React.createElement("p", { className: "text-center py-8 text-sm", style: { color: "var(--text-muted)" } }, "Carregando...") : lista.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "text-center py-8 text-sm", style: { color: "var(--text-muted)" } }, "Nenhum registro ainda. Escreva o primeiro abaixo.") : lista.map((n, i) => /* @__PURE__ */ React.createElement("div", { key: n.id || i, className: "py-3", style: { borderBottom: "1px dashed var(--border)" } }, /* @__PURE__ */ React.createElement("div", { className: "flex items-baseline gap-2 flex-wrap" }, /* @__PURE__ */ React.createElement("span", { className: "font-mono text-[11px]", style: { color: "var(--text-muted)" } }, dataHora(n.created_at || n.hora || n.criado_em)), /* @__PURE__ */ React.createElement("span", { className: "text-[12px] font-bold", style: { color: "var(--text)" } }, n.autor || n.quem || n.criado_por || n.usuario || "\u2014"), (n.email || n.login) && /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-semibold", style: { color: "var(--accent-green)" } }, n.email || n.login)), /* @__PURE__ */ React.createElement("div", { className: "text-[12.5px] mt-1 leading-relaxed", style: { color: "var(--text)" } }, n.texto || n.nota || n.mensagem || "\u2014")))), /* @__PURE__ */ React.createElement("form", { onSubmit: enviar, className: "px-4 sm:px-6 py-4 flex gap-2", style: { borderTop: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("input", { value: texto2, onChange: (e) => setTexto(e.target.value), placeholder: "Escreva uma nova mensagem...", className: "flex-1 min-w-0 px-3 py-2 rounded-lg text-sm", style: { background: "var(--bg-alt)", border: "1px solid var(--border)", color: "var(--text)" } }), /* @__PURE__ */ React.createElement("button", { disabled: enviando || !texto2.trim(), className: "px-6 py-2 rounded-lg text-xs font-bold cursor-pointer", style: { background: enviando || !texto2.trim() ? "var(--bg-alt)" : "var(--accent-green)", color: enviando || !texto2.trim() ? "var(--text-muted)" : "#fff" } }, enviando ? "Enviando..." : "Enviar"))));
  }

  // components/DefeitoPicker.tsx
  var import_react2 = __toESM(require_react());

  // data/matriz.json
  var matriz_default = { origens: [{ cod: 1, tipo: "Preventiva", nome: "Revis\xF5es do Plano de Manuten\xE7\xE3o", sigla: "PRV", info: "Segue o PCM conforme Grid de Manuten\xE7\xE3o" }, { cod: 2, tipo: "Preventiva", nome: "Revis\xF5es de Garantia", sigla: "GAR", info: "Segue manual do Ve\xEDculo ( 3 Primeiras Revis\xF5es)" }, { cod: 3, tipo: "Corretiva", nome: "Recolha Normal", sigla: "RN", info: "Recolheu com defeito n\xE3o interferiu na Linha / Opera\xE7\xE3o" }, { cod: 4, tipo: "Corretiva", nome: "Recolha Anormal", sigla: "RA", info: "N\xE3o finalizou chegada ao destino precisou trocar o ve\xEDculo" }, { cod: 5, tipo: "Corretiva", nome: "Socorro", sigla: "SOS", info: "Necesitou de Suporte ( mec\xE2nico, el\xE9trico, Borracharia)" }, { cod: 6, tipo: "Corretiva", nome: "Sinistro", sigla: "SIN", info: "Evento de colis\xE3o, vidros, carroceria." }, { cod: 7, tipo: "Corretiva", nome: "Operacional", sigla: "OPE", info: "Falha operacional ( Evento n\xE3o reconhecido como Manuten\xE7\xE3o)" }], grupos: [{ cod: 101, nome: "Mec\xE2nica", sigla: "MEC", info: "Todo e qualquer componente Mec\xE2nico" }, { cod: 201, nome: "El\xE9trica", sigla: "ELE", info: "Todo e qualquer componente el\xE9trico" }, { cod: 301, nome: "Funilaria", sigla: "FUN", info: "Todo e qualquer componente de Carroceria" }, { cod: 401, nome: "Ba\xFA", sigla: "BAU", info: "todo e qualquer componente de carroceria do ba\xFA" }, { cod: 501, nome: "Borracharia", sigla: "BOR", info: "todo e qualque componente de borracharia" }, { cod: 601, nome: "SASCAR", sigla: "SAS", info: "todo e qualquer componente da SASCAR" }, { cod: 701, nome: "T4S", sigla: "T4S", info: "sistema de rastreamento especifico" }], matriz: { MEC: { nome: "Mec\xE2nica", sistemas: { "Sistema de Alimenta\xE7\xE3o": { Turbina: [["Assoviando", "Livre Texto", "10.1"], ["Vazando", "Livre Texto", "10.2"], ["Estourada", "Livre Texto", "10.3"], ["Carcaceando", "Livre Texto", "10.4"], ["Preventiva", "Digitar KM Atual", "10.5"]], "Bico Injetor": [["Falhando", "Livre Texto", "10.6"], ["Fuma\xE7ando", "Livre Texto", "10.7"], ["Vazando", "Livre Texto", "10.8"], ["Preventiva", "Digitar KM Atual", "10.9"]], "Bomba de Alta": [["Baixa Press\xE3o", "Livre Texto", "10.10"], ["Vazando", "Livre Texto", "10.11"], ["Sem Press\xE3o", "Livre Texto", "10.12"], ["Ru\xEDdo Anormal", "Livre Texto", "10.13"], ["Preventiva", "Digitar KM Atual", "10.14"]], "Bomba Alimentadora": [["Baixa Vaz\xE3o", "Livre Texto", "10.15"], ["Vazando", "Livre Texto", "10.16"], ["N\xE3o Funciona", "Livre Texto", "10.17"], ["Preventiva", "Digitar KM Atual", "10.18"]], "Filtro de Combust\xEDvel": [["Obstru\xEDdo", "Livre Texto", "10.19"], ["Contaminado", "Livre Texto", "10.20"], ["Vazando", "Livre Texto", "10.21"], ["Preventiva", "Digitar KM Atual", "10.22"]], "Pr\xE9-Filtro/Racor": [["Com \xC1gua", "Livre Texto", "10.23"], ["Obstru\xEDdo", "Livre Texto", "10.24"], ["Vazando", "Livre Texto", "10.25"], ["Preventiva", "Digitar KM Atual", "10.26"]], "Tubula\xE7\xE3o de Combust\xEDvel": [["Vazando", "Livre Texto", "10.27"], ["Obstru\xEDda", "Livre Texto", "10.28"], ["Ressecada", "Livre Texto", "10.29"], ["Rompida", "Livre Texto", "10.30"]], "Mangueira de Combust\xEDvel": [["Vazando", "Livre Texto", "10.31"], ["Ressecada", "Livre Texto", "10.32"], ["Rompida", "Livre Texto", "10.33"], ["Solta", "Livre Texto", "10.34"]], "Tanque de Combust\xEDvel": [["Vazando", "Livre Texto", "10.35"], ["Contaminado", "Livre Texto", "10.36"], ["Amassado", "Livre Texto", "10.37"], ["Respiro Obstru\xEDdo", "Livre Texto", "10.38"]], "Sensor de Press\xE3o do Combust\xEDvel": [["Falhando", "Livre Texto", "10.39"], ["Sem Leitura", "Livre Texto", "10.40"], ["Preventiva", "Digitar KM Atual", "10.41"]], "Sensor de Temperatura do Combust\xEDvel": [["Falhando", "Livre Texto", "10.42"], ["Sem Leitura", "Livre Texto", "10.43"], ["Preventiva", "Digitar KM Atual", "10.44"]], "Regulador de Press\xE3o": [["Travado Aberto", "Livre Texto", "10.45"], ["Travado Fechado", "Livre Texto", "10.46"], ["Vazando", "Livre Texto", "10.47"], ["Preventiva", "Digitar KM Atual", "10.48"]], "Common Rail": [["Baixa Press\xE3o", "Livre Texto", "10.49"], ["Alta Press\xE3o", "Livre Texto", "10.50"], ["Vazando", "Livre Texto", "10.51"], ["Preventiva", "Digitar KM Atual", "10.52"]], "Chicote Sistema de Inje\xE7\xE3o": [["Mau Contato", "Livre Texto", "10.53"], ["Rompido", "Livre Texto", "10.54"], ["Curto Circuito", "Livre Texto", "10.55"]], "Conector Sistema de Inje\xE7\xE3o": [["Oxidado", "Livre Texto", "10.56"], ["Quebrado", "Livre Texto", "10.57"]], "Sistema de Alimenta\xE7\xE3o": [["Perda de Pot\xEAncia", "Livre Texto", "10.58"], ["Consumo Elevado", "Livre Texto", "10.59"], ["Motor N\xE3o Funciona", "Livre Texto", "10.60"]] }, "Sistema de Arrefecimento": { "Temperatura Alta": [["Ve\xEDculo Ferveu", "Livre Texto", "11.0"]], Radiador: [["Vazando", "Livre Texto", "11.1"], ["Obstru\xEDdo", "Livre Texto", "11.2"], ["Colmeia Danificada", "Livre Texto", "11.3"], ["Suporte Quebrado", "Livre Texto", "11.4"], ["Preventiva", "Digitar KM Atual", "11.5"]], "Bomba d'\xC1gua": [["Vazando", "Livre Texto", "11.6"], ["Travada", "Livre Texto", "11.7"], ["Ru\xEDdo Anormal", "Livre Texto", "11.8"], ["Preventiva", "Digitar KM Atual", "11.9"]], Ventoinha: [["N\xE3o Funciona", "Livre Texto", "11.10"], ["P\xE1s Quebradas", "Livre Texto", "11.11"], ["Desbalanceada", "Livre Texto", "11.12"], ["Preventiva", "Digitar KM Atual", "11.13"]], "Embreagem Viscosa": [["Sem Acoplamento", "Livre Texto", "11.14"], ["Travada", "Livre Texto", "11.15"], ["Vazando Silicone", "Livre Texto", "11.16"], ["Preventiva", "Digitar KM Atual", "11.17"]], "V\xE1lvula Termost\xE1tica": [["Travada Aberta", "Livre Texto", "11.18"], ["Travada Fechada", "Livre Texto", "11.19"], ["Preventiva", "Digitar KM Atual", "11.20"]], "Reservat\xF3rio de Expans\xE3o": [["Trincado", "Livre Texto", "11.21"], ["Vazando", "Livre Texto", "11.22"], ["Sem Tampa", "Livre Texto", "11.23"], ["Preventiva", "Digitar KM Atual", "11.24"]], "Tampa do Reservat\xF3rio": [["Sem Press\xE3o", "Livre Texto", "11.25"], ["Vazando", "Livre Texto", "11.26"], ["Preventiva", "Digitar KM Atual", "11.27"]], "Mangueira Superior": [["Vazando", "Livre Texto", "11.28"], ["Rompida", "Livre Texto", "11.29"], ["Ressecada", "Livre Texto", "11.30"]], "Mangueira Inferior": [["Vazando", "Livre Texto", "11.31"], ["Rompida", "Livre Texto", "11.32"], ["Ressecada", "Livre Texto", "11.33"]], "Tubula\xE7\xE3o do Arrefecimento": [["Vazando", "Livre Texto", "11.34"], ["Corro\xEDda", "Livre Texto", "11.35"], ["Obstru\xEDda", "Livre Texto", "11.36"]], Abra\u00E7adeiras: [["Soltas", "Livre Texto", "11.37"], ["Quebradas", "Livre Texto", "11.38"]], "L\xEDquido de Arrefecimento": [["Baixo N\xEDvel", "Livre Texto", "11.39"], ["Contaminado", "Livre Texto", "11.40"], ["Sem Aditivo", "Livre Texto", "11.41"], ["Preventiva", "Digitar KM Atual", "11.42"]], "Sensor de Temperatura": [["Falhando", "Livre Texto", "11.43"], ["Sem Leitura", "Livre Texto", "11.44"], ["Preventiva", "Digitar KM Atual", "11.45"]], Eletroventilador: [["N\xE3o Aciona", "Livre Texto", "11.46"], ["Motor Queimado", "Livre Texto", "11.47"], ["Rel\xE9 Defeituoso", "Livre Texto", "11.48"]], Intercooler: [["Vazando", "Livre Texto", "11.49"], ["Obstru\xEDdo", "Livre Texto", "11.50"], ["Trincado", "Livre Texto", "11.51"], ["Preventiva", "Digitar KM Atual", "11.52"]], "Trocador de Calor": [["Vazando", "Livre Texto", "11.53"], ["Obstru\xEDdo", "Livre Texto", "11.54"], ["Preventiva", "Digitar KM Atual", "11.55"]], "Sistema de Arrefecimento": [["Superaquecimento", "Livre Texto", "11.56"], ["Baixa Efici\xEAncia", "Livre Texto", "11.57"], ["Perda de L\xEDquido", "Livre Texto", "11.58"], ["Press\xE3o Excessiva", "Livre Texto", "11.59"], ["Preventiva Geral", "Digitar KM Atual", "11.60"]] }, "Sistema de Suspens\xE3o": { Suspens\u00E3o: [["Com barulho", "Livre Texto", "13.0"], ["Ve\xEDculo desnivelado", "Informar lado/eixo", "13.34"], ["Baixa", "Informar eixo", "13.35"], ["N\xE3o sobe", "Informar eixo", "13.36"], ["N\xE3o baixa", "Informar eixo", "13.37"], ["Batendo fim de curso", "Informar eixo", "13.38"], ["Altura irregular", "Informar eixo/lado", "13.39"], ["Inspe\xE7\xE3o preventiva", "Digitar KM atual", "13.40"], ["Outros", "Livre Texto", "13.41"]], "Bolsa de Ar": [["Furada", "Informar posi\xE7\xE3o", "13.1"], ["Vazando", "Informar posi\xE7\xE3o", "13.2"], ["Estourada", "Informar posi\xE7\xE3o", "13.3"], ["Ressecada", "Informar posi\xE7\xE3o", "13.4"], ["Deslocada", "Informar posi\xE7\xE3o", "13.5"]], Amortecedor: [["Vazando", "Informar posi\xE7\xE3o", "13.6"], ["Quebrado", "Informar posi\xE7\xE3o", "13.7"], ["Sem a\xE7\xE3o", "Informar posi\xE7\xE3o", "13.8"], ["Bucha danificada", "Informar posi\xE7\xE3o", "13.9"]], Mola: [["Quebrada", "Informar posi\xE7\xE3o", "13.10"], ["Trincada", "Informar posi\xE7\xE3o", "13.11"], ["Deslocada", "Informar posi\xE7\xE3o", "13.12"], ["Cedida", "Informar posi\xE7\xE3o", "13.13"]], "Bucha da Suspens\xE3o": [["Com folga", "Informar posi\xE7\xE3o", "13.14"], ["Rasgada", "Informar posi\xE7\xE3o", "13.15"], ["Desgastada", "Informar posi\xE7\xE3o", "13.16"]], "Barra Estabilizadora": [["Com folga", "Informar posi\xE7\xE3o", "13.17"], ["Quebrada", "Informar posi\xE7\xE3o", "13.18"], ["Bucha danificada", "Informar posi\xE7\xE3o", "13.19"]], Bieleta: [["Com folga", "Informar posi\xE7\xE3o", "13.20"], ["Quebrada", "Informar posi\xE7\xE3o", "13.21"]], "V\xE1lvula Niveladora": [["Vazando ar", "Informar posi\xE7\xE3o", "13.22"], ["Travada", "Informar posi\xE7\xE3o", "13.23"], ["N\xE3o atua", "Informar posi\xE7\xE3o", "13.24"], ["Desregulada", "Informar posi\xE7\xE3o", "13.25"]], "Sensor de Altura": [["Com falha", "C\xF3digo da falha/Livre Texto", "13.26"], ["Quebrado", "Informar posi\xE7\xE3o", "13.27"], ["Desregulado", "Informar posi\xE7\xE3o", "13.28"]], "Tubula\xE7\xE3o de Ar": [["Vazando", "Informar posi\xE7\xE3o", "13.29"], ["Rompida", "Informar posi\xE7\xE3o", "13.30"]], "Conex\xE3o Pneum\xE1tica": [["Vazando", "Informar posi\xE7\xE3o", "13.31"]], "Suporte da Suspens\xE3o": [["Trincado", "Informar posi\xE7\xE3o", "13.32"], ["Quebrado", "Informar posi\xE7\xE3o", "13.33"]] }, "Sistema do Motor": { Motor: [["Com barulho", "Livre Texto", "14.0"], ["N\xE3o pega", "Livre Texto", "14.1"], ["Demora para pegar", "Livre Texto", "14.2"], ["Falhando", "Livre Texto", "14.3"], ["Perda de pot\xEAncia", "Livre Texto", "14.4"], ["Funcionamento irregular", "Livre Texto", "14.5"], ["Vibra\xE7\xE3o excessiva", "Livre Texto", "14.6"], ["Superaquecendo", "Informar temperatura", "14.7"], ["Fuma\xE7ando", "Informar cor da fuma\xE7a", "14.8"], ["Consumo excessivo de \xF3leo", "Informar consumo/KM", "14.9"], ["Press\xE3o de \xF3leo baixa", "Informar press\xE3o/alerta", "14.10"], ["Luz de avaria acesa", "Informar mensagem/c\xF3digo", "14.11"], ["Desligando sozinho", "Livre Texto", "14.12"], ["Travado", "Livre Texto", "14.13"], ["Preventiva", "Digitar KM atual", "14.14"], ["Baixa compress\xE3o", "Informar cilindro/press\xE3o", "14.60"], ["Press\xE3o no c\xE1rter", "Livre Texto", "14.61"], ["Mistura de \xF3leo e \xE1gua", "Livre Texto", "14.62"], ["Consumo de l\xEDquido de arrefecimento", "Livre Texto", "14.63"], ["Revis\xE3o parcial", "Digitar KM atual", "14.64"], ["Revis\xE3o geral", "Digitar KM atual", "14.65"], ["Outros", "Livre Texto", "14.66"]], "\xD3leo do Motor": [["Vazando", "Informar local", "14.15"], ["N\xEDvel baixo", "Digitar KM atual", "14.16"], ["Contaminado", "Livre Texto", "14.17"], ["Press\xE3o baixa", "Informar press\xE3o/alerta", "14.18"]], C\u00E1rter: [["Vazando", "Livre Texto", "14.19"], ["Trincado", "Livre Texto", "14.20"], ["Amassado", "Livre Texto", "14.21"]], "Junta do C\xE1rter": [["Vazando", "Livre Texto", "14.22"]], "Tampa de V\xE1lvulas": [["Vazando \xF3leo", "Livre Texto", "14.23"]], "Junta da Tampa de V\xE1lvulas": [["Vazando", "Livre Texto", "14.24"]], Cabe\u00E7ote: [["Vazando \xF3leo", "Livre Texto", "14.25"], ["Vazando l\xEDquido de arrefecimento", "Livre Texto", "14.26"], ["Trincado", "Livre Texto", "14.27"], ["Empenado", "Livre Texto", "14.28"]], "Junta do Cabe\xE7ote": [["Queimada", "Livre Texto", "14.29"], ["Vazando", "Livre Texto", "14.30"]], V\u00E1lvulas: [["Desreguladas", "Digitar KM atual", "14.31"], ["Com ru\xEDdo", "Livre Texto", "14.32"], ["Danificadas", "Livre Texto", "14.33"]], "Comando de V\xE1lvulas": [["Com desgaste", "Livre Texto", "14.34"], ["Danificado", "Livre Texto", "14.35"]], Tuchos: [["Com barulho", "Livre Texto", "14.36"], ["Danificados", "Livre Texto", "14.37"]], Balancins: [["Com folga", "Livre Texto", "14.38"], ["Danificados", "Livre Texto", "14.39"]], Pist\u00E3o: [["Danificado", "Informar cilindro", "14.40"]], "An\xE9is de Pist\xE3o": [["Desgastados", "Informar cilindro", "14.41"]], "Camisa do Cilindro": [["Desgastada", "Informar cilindro", "14.42"], ["Danificada", "Informar cilindro", "14.43"]], Biela: [["Com folga", "Informar cilindro", "14.44"], ["Danificada", "Informar cilindro", "14.45"]], Bronzina: [["Com desgaste", "Informar posi\xE7\xE3o", "14.46"], ["Danificada", "Informar posi\xE7\xE3o", "14.47"]], Virabrequim: [["Com desgaste", "Livre Texto", "14.48"], ["Danificado", "Livre Texto", "14.49"]], "Volante do Motor": [["Danificado", "Livre Texto", "14.50"]], Cremalheira: [["Desgastada", "Livre Texto", "14.51"], ["Danificada", "Livre Texto", "14.52"]], "Retentor Dianteiro": [["Vazando \xF3leo", "Livre Texto", "14.53"]], "Retentor Traseiro": [["Vazando \xF3leo", "Livre Texto", "14.54"]], "Coxim do Motor": [["Quebrado", "Informar posi\xE7\xE3o", "14.55"], ["Desgastado", "Informar posi\xE7\xE3o", "14.56"], ["Com folga", "Informar posi\xE7\xE3o", "14.57"]], "Respiro do Motor": [["Entupido", "Livre Texto", "14.58"], ["Vazando \xF3leo", "Livre Texto", "14.59"]] }, "Sistema de ARLA/SCR": { "Sistema de ARLA": [["Luz de avaria acesa", "Livre Texto", "15.0"], ["N\xE3o funciona", "Livre Texto", "15.1"], ["Despotenciamento", "Livre Texto", "15.2"], ["N\xE3o consome ARLA", "Livre Texto", "15.3"], ["Consumo excessivo", "Livre Texto", "15.4"], ["ARLA contaminado", "Livre Texto", "15.36"], ["ARLA fora de especifica\xE7\xE3o", "Livre Texto", "15.37"], ["Cristaliza\xE7\xE3o", "Livre Texto", "15.38"], ["Preventiva", "Digitar KM atual", "15.39"], ["Outros", "Livre Texto", "15.40"]], "Reservat\xF3rio de ARLA": [["Vazando", "Livre Texto", "15.5"], ["Danificado", "Livre Texto", "15.6"], ["Contaminado", "Livre Texto", "15.7"]], "Bomba de ARLA": [["N\xE3o funciona", "Livre Texto", "15.8"], ["Baixa press\xE3o", "Livre Texto", "15.9"], ["Vazando", "Livre Texto", "15.10"], ["Preventiva", "Digitar KM atual", "15.11"]], "Bico Dosador de ARLA": [["Entupido", "Livre Texto", "15.12"], ["Vazando", "Livre Texto", "15.13"], ["Cristalizado", "Livre Texto", "15.14"], ["N\xE3o injeta", "Livre Texto", "15.15"]], "Sensor NOx": [["Com falha", "Livre Texto", "15.16"], ["Sem comunica\xE7\xE3o", "Livre Texto", "15.17"]], "Sensor de N\xEDvel ARLA": [["Com falha", "Livre Texto", "15.18"]], "Sensor de Qualidade ARLA": [["Com falha", "Livre Texto", "15.19"]], "Sensor de Temperatura ARLA": [["Com falha", "Livre Texto", "15.20"]], "Tubula\xE7\xE3o de ARLA": [["Vazando", "Livre Texto", "15.21"], ["Entupida", "Livre Texto", "15.22"], ["Rompida", "Livre Texto", "15.23"], ["Cristalizada", "Livre Texto", "15.24"]], "Filtro de ARLA": [["Entupido", "Livre Texto", "15.25"], ["Preventiva", "Digitar KM atual", "15.26"]], "Catalisador SCR": [["Obstru\xEDdo", "Livre Texto", "15.27"], ["Baixa efici\xEAncia", "Livre Texto", "15.28"], ["Danificado", "Livre Texto", "15.29"], ["Cristalizado", "Livre Texto", "15.30"]], "M\xF3dulo SCR": [["Com falha", "Livre Texto", "15.31"], ["Sem comunica\xE7\xE3o", "Livre Texto", "15.32"]], "Chicote Sistema ARLA": [["Rompido", "Livre Texto", "15.33"], ["Mau contato", "Livre Texto", "15.34"]], "Conector Sistema ARLA": [["Danificado", "Livre Texto", "15.35"]] }, "Sistema de Dire\xE7\xE3o": { Dire\u00E7\u00E3o: [["Puxando para esquerda", "Livre Texto", "16.0"], ["Puxando para direita", "Livre Texto", "16.1"], ["Pesada", "Livre Texto", "16.2"], ["Com folga", "Livre Texto", "16.3"], ["Com barulho", "Livre Texto", "16.4"], ["Travando", "Livre Texto", "16.5"], ["Vibra\xE7\xE3o", "Livre Texto", "16.6"]], Volante: [["Com folga", "Livre Texto", "16.7"], ["Desalinhado", "Livre Texto", "16.8"], ["Vibrando", "Livre Texto", "16.9"]], "Caixa de Dire\xE7\xE3o": [["Com folga", "Livre Texto", "16.10"], ["Vazando", "Livre Texto", "16.11"], ["Travando", "Livre Texto", "16.12"], ["Com barulho", "Livre Texto", "16.13"], ["Danificada", "Livre Texto", "16.14"]], "Bomba da Dire\xE7\xE3o Hidr\xE1ulica": [["Com barulho", "Livre Texto", "16.15"], ["Vazando", "Livre Texto", "16.16"], ["Baixa press\xE3o", "Livre Texto", "16.17"], ["N\xE3o funciona", "Livre Texto", "16.18"]], "Reservat\xF3rio da Dire\xE7\xE3o": [["Vazando", "Livre Texto", "16.19"], ["N\xEDvel baixo", "Livre Texto", "16.20"], ["Danificado", "Livre Texto", "16.21"]], "Mangueira da Dire\xE7\xE3o": [["Vazando", "Livre Texto", "16.22"], ["Rompida", "Livre Texto", "16.23"], ["Ressecada", "Livre Texto", "16.24"]], "Coluna de Dire\xE7\xE3o": [["Com folga", "Livre Texto", "16.25"], ["Travando", "Livre Texto", "16.26"], ["Com barulho", "Livre Texto", "16.27"]], "Cruzeta da Dire\xE7\xE3o": [["Com folga", "Livre Texto", "16.28"], ["Travando", "Livre Texto", "16.29"], ["Danificada", "Livre Texto", "16.30"]], "Barra de Dire\xE7\xE3o": [["Com folga", "Livre Texto", "16.31"], ["Empenada", "Livre Texto", "16.32"], ["Danificada", "Livre Texto", "16.33"]], "Terminal de Dire\xE7\xE3o": [["Com folga", "Informar posi\xE7\xE3o", "16.34"], ["Danificado", "Informar posi\xE7\xE3o", "16.35"]], "Barra de Liga\xE7\xE3o": [["Com folga", "Livre Texto", "16.36"], ["Empenada", "Livre Texto", "16.37"], ["Danificada", "Livre Texto", "16.38"]], "Bra\xE7o de Dire\xE7\xE3o": [["Com folga", "Livre Texto", "16.39"], ["Danificado", "Livre Texto", "16.40"]], "Piv\xF4 de Dire\xE7\xE3o": [["Com folga", "Informar posi\xE7\xE3o", "16.41"], ["Danificado", "Informar posi\xE7\xE3o", "16.42"]], "Manga de Eixo": [["Com folga", "Informar posi\xE7\xE3o", "16.43"], ["Danificada", "Informar posi\xE7\xE3o", "16.44"]], "Rolamento de Roda": [["Com folga", "Informar posi\xE7\xE3o", "16.45"], ["Com barulho", "Informar posi\xE7\xE3o", "16.46"], ["Danificado", "Informar posi\xE7\xE3o", "16.47"]], "Dire\xE7\xE3o Hidr\xE1ulica": [["Vazamento de \xF3leo", "Informar local", "16.48"], ["\xD3leo contaminado", "Livre Texto", "16.49"], ["Preventiva", "Digitar KM atual", "16.50"]], Alinhamento: [["Fora de especifica\xE7\xE3o", "Livre Texto", "16.51"]], "Geometria da Dire\xE7\xE3o": [["Fora de especifica\xE7\xE3o", "Livre Texto", "16.52"]], "Sistema de Dire\xE7\xE3o": [["Inspe\xE7\xE3o preventiva", "Digitar KM atual", "16.53"], ["Outros", "Livre Texto", "16.54"]] }, "Sistema Pneum\xE1tico": { "Sistema Pneum\xE1tico": [["Vazamento de ar", "Livre Texto", "17.0"], ["Baixa press\xE3o", "Livre Texto", "17.1"], ["N\xE3o pressuriza", "Livre Texto", "17.2"], ["Demora para pressurizar", "Livre Texto", "17.3"], ["Perda r\xE1pida de press\xE3o", "Livre Texto", "17.4"], ["Press\xE3o excessiva", "Livre Texto", "17.5"], ["Contamina\xE7\xE3o por \xF3leo", "Livre Texto", "17110"], ["Excesso de \xE1gua", "Livre Texto", "17111"], ["Preventiva", "Digitar KM atual", "17112"], ["Outros", "Livre Texto", "17113"]], "Compressor de Ar": [["N\xE3o pressuriza", "Livre Texto", "17.6"], ["Baixa press\xE3o", "Livre Texto", "17.7"], ["Demora para pressurizar", "Livre Texto", "17.8"], ["Com barulho", "Livre Texto", "17.9"], ["Vazando \xF3leo", "Livre Texto", "17.10"], ["Vazando ar", "Livre Texto", "17.11"], ["Passando \xF3leo", "Livre Texto", "17.12"], ["Superaquecendo", "Livre Texto", "17.13"], ["Preventiva", "Digitar KM atual", "17.14"]], APS: [["N\xE3o pressuriza", "Livre Texto", "17.15"], ["Demora para pressurizar", "Livre Texto", "17.16"], ["Vazando ar", "Livre Texto", "17.17"], ["Descarga cont\xEDnua", "Livre Texto", "17.18"], ["N\xE3o realiza descarga", "Livre Texto", "17.19"], ["Press\xE3o baixa", "Livre Texto", "17.20"], ["Press\xE3o alta", "Livre Texto", "17.21"], ["Com falha", "Livre Texto", "17.22"], ["Sem comunica\xE7\xE3o", "Livre Texto", "17.23"], ["Preventiva", "Digitar KM atual", "17.24"]], "Secador de Ar": [["N\xE3o funciona", "Livre Texto", "17.25"], ["Vazando ar", "Livre Texto", "17.26"], ["Saturado", "Livre Texto", "17.27"], ["N\xE3o descarrega", "Livre Texto", "17.28"], ["Descarga cont\xEDnua", "Livre Texto", "17.29"], ["Preventiva", "Digitar KM atual", "17.30"]], "Filtro Secador": [["Saturado", "Livre Texto", "17.31"], ["Contaminado", "Livre Texto", "17.32"], ["Preventiva", "Digitar KM atual", "17.33"]], "Reservat\xF3rio de Ar": [["Vazando", "Informar reservat\xF3rio", "17.34"], ["Danificado", "Informar reservat\xF3rio", "17.35"], ["Com \xE1gua", "Informar reservat\xF3rio", "17.36"], ["Com \xF3leo", "Informar reservat\xF3rio", "17.37"]], "Dreno do Reservat\xF3rio": [["Entupido", "Informar reservat\xF3rio", "17.38"], ["Vazando", "Informar reservat\xF3rio", "17.39"]], "Mangueira de Ar": [["Vazando", "Informar local", "17.40"], ["Rompida", "Informar local", "17.41"], ["Ressecada", "Informar local", "17.42"]], "Tubula\xE7\xE3o de Ar": [["Vazando", "Informar local", "17.43"], ["Rompida", "Informar local", "17.44"], ["Amassada", "Informar local", "17.45"]], "Conex\xE3o Pneum\xE1tica": [["Vazando", "Informar local", "17.46"], ["Danificada", "Informar local", "17.47"]], "Engate R\xE1pido": [["Vazando", "Informar local", "17.48"], ["Danificado", "Informar local", "17.49"]], "V\xE1lvula Reguladora de Press\xE3o": [["Com falha", "Livre Texto", "17.50"], ["Vazando", "Livre Texto", "17.51"], ["Press\xE3o incorreta", "Livre Texto", "17.52"]], "V\xE1lvula de Prote\xE7\xE3o": [["Com falha", "Livre Texto", "17.53"], ["Vazando", "Livre Texto", "17.54"], ["Travada", "Livre Texto", "17.55"]], "V\xE1lvula de Reten\xE7\xE3o": [["Vazando", "Livre Texto", "17.56"], ["Travada", "Livre Texto", "17.57"], ["N\xE3o funciona", "Livre Texto", "17.58"]], "Man\xF4metro de Ar": [["N\xE3o funciona", "Livre Texto", "17.59"], ["Marca\xE7\xE3o incorreta", "Livre Texto", "17.60"]], "Sensor de Press\xE3o de Ar": [["Com falha", "Livre Texto", "17.61"], ["Marca\xE7\xE3o incorreta", "Livre Texto", "17.62"], ["Sem comunica\xE7\xE3o", "Livre Texto", "17.63"]], "Alarme de Baixa Press\xE3o": [["N\xE3o funciona", "Livre Texto", "17.64"], ["Acionado constantemente", "Livre Texto", "17.65"]], "Servo Shift": [["Vazando ar", "Livre Texto", "17.66"], ["Com falha", "Livre Texto", "17.67"], ["N\xE3o atua", "Livre Texto", "17.68"], ["Travando", "Livre Texto", "17.69"], ["Engate dif\xEDcil", "Livre Texto", "17.70"], ["N\xE3o engata marcha", "Livre Texto", "17.71"], ["Com barulho", "Livre Texto", "17.72"], ["Press\xE3o baixa", "Livre Texto", "17.73"], ["Preventiva", "Digitar KM atual", "17.74"]], "Cu\xEDca Pneum\xE1tica": [["Vazando", "Informar posi\xE7\xE3o", "17.75"], ["Danificada", "Informar posi\xE7\xE3o", "17.76"], ["Travada", "Informar posi\xE7\xE3o", "17.77"]], "V\xE1lvula Pneum\xE1tica": [["Vazando", "Informar local", "17.78"], ["Travada", "Informar local", "17.79"], ["N\xE3o atua", "Informar local", "17.80"]], "V\xE1lvula de Emerg\xEAncia da Carreta": [["Vazando ar", "Livre Texto", "17.81"], ["Travada", "Livre Texto", "17.82"], ["N\xE3o atua", "Livre Texto", "17.83"]], "V\xE1lvula Rel\xE9 da Carreta": [["Vazando ar", "Informar eixo", "17.84"], ["Travada", "Informar eixo", "17.85"], ["N\xE3o atua", "Informar eixo", "17.86"]], "V\xE1lvula de Estacionamento da Carreta": [["Vazando ar", "Livre Texto", "17.87"], ["Travada", "Livre Texto", "17.88"], ["N\xE3o atua", "Livre Texto", "17.89"]], "V\xE1lvula Niveladora da Carreta": [["Vazando ar", "Informar eixo", "17.90"], ["Travada", "Informar eixo", "17.91"], ["Desregulada", "Informar eixo", "17.92"], ["N\xE3o atua", "Informar eixo", "17.93"]], "V\xE1lvula de Levantamento de Eixo": [["Vazando ar", "Informar eixo", "17.94"], ["Travada", "Informar eixo", "17.95"], ["N\xE3o levanta eixo", "Informar eixo", "17.96"], ["N\xE3o baixa eixo", "Informar eixo", "17.97"]], "V\xE1lvula de Descarga R\xE1pida": [["Vazando ar", "Informar posi\xE7\xE3o", "17.98"], ["Travada", "Informar posi\xE7\xE3o", "17.99"], ["N\xE3o atua", "Informar posi\xE7\xE3o", "17100"]], "V\xE1lvula de Prote\xE7\xE3o da Carreta": [["Vazando ar", "Livre Texto", "17101"], ["Travada", "Livre Texto", "17102"], ["N\xE3o atua", "Livre Texto", "17103"]], "V\xE1lvula Reguladora da Carreta": [["Vazando ar", "Livre Texto", "17104"], ["Press\xE3o incorreta", "Livre Texto", "17105"], ["N\xE3o atua", "Livre Texto", "17106"]], "V\xE1lvula Pneum\xE1tica da Carreta": [["Vazando ar", "Informar local", "17107"], ["Travada", "Informar local", "17108"], ["Danificada", "Informar local", "17109"]] }, "Sistema de Admiss\xE3o": { "Sistema de Admiss\xE3o": [["Perda de pot\xEAncia", "Livre Texto", "18.0"], ["Entrada de ar falsa", "Livre Texto", "18.1"], ["Restri\xE7\xE3o de ar", "Livre Texto", "18.2"], ["Com barulho", "Livre Texto", "18.3"], ["Preventiva", "Digitar KM atual", "18.63"], ["Outros", "Livre Texto", "18.64"]], "Filtro de Ar": [["Saturado", "Livre Texto", "18.4"], ["Sujo", "Livre Texto", "18.5"], ["Danificado", "Livre Texto", "18.6"], ["Preventiva", "Digitar KM atual", "18.7"]], "Carca\xE7a do Filtro de Ar": [["Quebrada", "Livre Texto", "18.8"], ["Trincada", "Livre Texto", "18.9"], ["Entrada de ar falsa", "Livre Texto", "18.10"]], "Mangueira de Admiss\xE3o": [["Furada", "Informar local", "18.11"], ["Rasgada", "Informar local", "18.12"], ["Solta", "Informar local", "18.13"], ["Ressecada", "Informar local", "18.14"], ["Obstru\xEDda", "Informar local", "18.15"], ["Entrada de ar falsa", "Informar local", "18.16"]], "Tubula\xE7\xE3o de Admiss\xE3o": [["Furada", "Informar local", "18.17"], ["Trincada", "Informar local", "18.18"], ["Solta", "Informar local", "18.19"], ["Obstru\xEDda", "Informar local", "18.20"]], "Abra\xE7adeira da Admiss\xE3o": [["Solta", "Informar local", "18.21"], ["Quebrada", "Informar local", "18.22"], ["Danificada", "Informar local", "18.23"]], Intercooler: [["Furado", "Livre Texto", "18.24"], ["Trincado", "Livre Texto", "18.25"], ["Vazando ar", "Livre Texto", "18.26"], ["Obstru\xEDdo", "Livre Texto", "18.27"], ["Contaminado com \xF3leo", "Livre Texto", "18.28"], ["Danificado", "Livre Texto", "18.29"]], "Coletor de Admiss\xE3o": [["Vazando ar", "Livre Texto", "18.30"], ["Trincado", "Livre Texto", "18.31"], ["Obstru\xEDdo", "Livre Texto", "18.32"], ["Carbonizado", "Livre Texto", "18.33"]], "Junta do Coletor de Admiss\xE3o": [["Vazando", "Livre Texto", "18.34"], ["Danificada", "Livre Texto", "18.35"]], "Sensor MAP": [["Com falha", "Livre Texto", "18.36"], ["Leitura incorreta", "Livre Texto", "18.37"], ["Sem comunica\xE7\xE3o", "Livre Texto", "18.38"]], "Sensor de Press\xE3o do Turbo": [["Com falha", "Livre Texto", "18.39"], ["Leitura incorreta", "Livre Texto", "18.40"]], "Sensor de Temperatura do Ar": [["Com falha", "Livre Texto", "18.41"], ["Leitura incorreta", "Livre Texto", "18.42"]], "Sensor de Fluxo de Ar": [["Com falha", "Livre Texto", "18.43"], ["Leitura incorreta", "Livre Texto", "18.44"], ["Sujo", "Livre Texto", "18.45"]], "V\xE1lvula EGR": [["Travada aberta", "Livre Texto", "18.46"], ["Travada fechada", "Livre Texto", "18.47"], ["Carbonizada", "Livre Texto", "18.48"], ["Com falha", "Livre Texto", "18.49"], ["N\xE3o atua", "Livre Texto", "18.50"]], "Tubula\xE7\xE3o EGR": [["Obstru\xEDda", "Livre Texto", "18.51"], ["Carbonizada", "Livre Texto", "18.52"], ["Vazando", "Livre Texto", "18.53"]], "Coletor EGR": [["Obstru\xEDdo", "Livre Texto", "18.54"], ["Carbonizado", "Livre Texto", "18.55"]], "Atuador da Admiss\xE3o": [["Com falha", "Livre Texto", "18.56"], ["Travado", "Livre Texto", "18.57"], ["N\xE3o atua", "Livre Texto", "18.58"]], "Corpo/Borboleta de Admiss\xE3o": [["Travado", "Livre Texto", "18.59"], ["Carbonizado", "Livre Texto", "18.60"], ["Com falha", "Livre Texto", "18.61"], ["N\xE3o atua", "Livre Texto", "18.62"]] }, "Sistema de Transmiss\xE3o": { Transmiss\u00E3o: [["N\xE3o engata marcha", "Livre Texto", "19.0"], ["Dificuldade para engatar", "Livre Texto", "19.1"], ["Marcha escapando", "Informar marcha", "19.2"], ["Travada", "Livre Texto", "19.3"], ["Com barulho", "Livre Texto", "19.4"], ["Vibra\xE7\xE3o", "Livre Texto", "19.5"], ["Vazando \xF3leo", "Informar local", "19.6"], ["Superaquecendo", "Livre Texto", "19.7"], ["Falha no painel", "Informar mensagem", "19.8"]], "Caixa de C\xE2mbio": [["N\xE3o engata marcha", "Informar marcha", "19.9"], ["Dificuldade para engatar", "Informar marcha", "19.10"], ["Marcha escapando", "Informar marcha", "19.11"], ["Travada", "Livre Texto", "19.12"], ["Com barulho", "Livre Texto", "19.13"], ["Vazando \xF3leo", "Informar local", "19.14"], ["N\xEDvel de \xF3leo baixo", "Livre Texto", "19.15"], ["\xD3leo contaminado", "Livre Texto", "19.16"], ["Preventiva", "Digitar KM atual", "19.17"]], Sincronizador: [["Arranhando marcha", "Informar marcha", "19.18"], ["Desgastado", "Informar marcha", "19.19"], ["Danificado", "Informar marcha", "19.20"]], "Rolamento da Caixa": [["Com barulho", "Livre Texto", "19.21"], ["Com folga", "Livre Texto", "19.22"], ["Danificado", "Livre Texto", "19.23"]], "Eixo Piloto": [["Com folga", "Livre Texto", "19.24"], ["Com barulho", "Livre Texto", "19.25"], ["Danificado", "Livre Texto", "19.26"]], "Eixo Principal": [["Com folga", "Livre Texto", "19.27"], ["Danificado", "Livre Texto", "19.28"]], Embreagem: [["Patinando", "Livre Texto", "19.29"], ["Trepidando", "Livre Texto", "19.30"], ["N\xE3o desacopla", "Livre Texto", "19.31"], ["Acoplamento irregular", "Livre Texto", "19.32"], ["Com barulho", "Livre Texto", "19.33"], ["Pedal pesado", "Livre Texto", "19.34"], ["Pedal baixo", "Livre Texto", "19.35"], ["Pedal sem a\xE7\xE3o", "Livre Texto", "19.36"], ["Desgastada", "Digitar KM atual", "19.37"], ["Queimada", "Digitar KM atual", "19.38"], ["Preventiva", "Digitar KM atual", "19.39"]], "Disco de Embreagem": [["Desgastado", "Digitar KM atual", "19.40"], ["Queimado", "Digitar KM atual", "19.41"], ["Quebrado", "Digitar KM atual", "19.42"], ["Contaminado", "Livre Texto", "19.43"]], "Plat\xF4 de Embreagem": [["Desgastado", "Digitar KM atual", "19.44"], ["Quebrado", "Digitar KM atual", "19.45"], ["Sem press\xE3o", "Livre Texto", "19.46"]], "Rolamento de Embreagem": [["Com barulho", "Digitar KM atual", "19.47"], ["Travado", "Digitar KM atual", "19.48"], ["Danificado", "Digitar KM atual", "19.49"]], "Garfo de Embreagem": [["Com folga", "Livre Texto", "19.50"], ["Quebrado", "Livre Texto", "19.51"], ["Danificado", "Livre Texto", "19.52"]], "Cilindro Mestre da Embreagem": [["Vazando", "Livre Texto", "19.53"], ["Sem press\xE3o", "Livre Texto", "19.54"], ["Travado", "Livre Texto", "19.55"]], "Cilindro Auxiliar da Embreagem": [["Vazando", "Livre Texto", "19.56"], ["Sem press\xE3o", "Livre Texto", "19.57"], ["Travado", "Livre Texto", "19.58"]], "Servo de Embreagem": [["Vazando", "Livre Texto", "19.59"], ["N\xE3o atua", "Livre Texto", "19.60"], ["Travado", "Livre Texto", "19.61"], ["Com falha", "Livre Texto", "19.62"]], "Seletor de Marchas": [["N\xE3o seleciona", "Informar marcha", "19.63"], ["Travando", "Livre Texto", "19.64"], ["Com folga", "Livre Texto", "19.65"], ["Danificado", "Livre Texto", "19.66"]], Trambulador: [["Com folga", "Livre Texto", "19.67"], ["Travando", "Livre Texto", "19.68"], ["Desregulado", "Livre Texto", "19.69"], ["Danificado", "Livre Texto", "19.70"]], "Cabo de Sele\xE7\xE3o de Marchas": [["Com folga", "Livre Texto", "19.71"], ["Desregulado", "Livre Texto", "19.72"], ["Travando", "Livre Texto", "19.73"], ["Rompido", "Livre Texto", "19.74"], ["Pesado", "Livre Texto", "19.75"], ["Solto", "Livre Texto", "19.76"], ["Danificado", "Livre Texto", "19.77"]], "Terminal do Cabo de Sele\xE7\xE3o": [["Com folga", "Livre Texto", "19.78"], ["Solto", "Livre Texto", "19.79"], ["Quebrado", "Livre Texto", "19.80"], ["Danificado", "Livre Texto", "19.81"]], "Alavanca de C\xE2mbio": [["Com folga", "Livre Texto", "19.82"], ["Travando", "Livre Texto", "19.83"], ["Danificada", "Livre Texto", "19.84"]], "Retentor da Caixa": [["Vazando \xF3leo", "Informar local", "19.85"]], "Junta da Caixa": [["Vazando \xF3leo", "Informar local", "19.86"]], "Carca\xE7a da Caixa": [["Trincada", "Livre Texto", "19.87"], ["Vazando \xF3leo", "Livre Texto", "19.88"]], "Coxim da Caixa": [["Quebrado", "Informar posi\xE7\xE3o", "19.89"], ["Desgastado", "Informar posi\xE7\xE3o", "19.90"], ["Com folga", "Informar posi\xE7\xE3o", "19.91"]], Cardan: [["Com vibra\xE7\xE3o", "Livre Texto", "19.92"], ["Com folga", "Livre Texto", "19.93"], ["Com barulho", "Livre Texto", "19.94"], ["Empenado", "Livre Texto", "19.95"], ["Desbalanceado", "Livre Texto", "19.96"], ["Danificado", "Livre Texto", "19.97"], ["Solto", "Livre Texto", "19.98"]], "Rolamento do Cardan": [["Com barulho", "Informar posi\xE7\xE3o", "19.99"], ["Com folga", "Informar posi\xE7\xE3o", "19100"], ["Travado", "Informar posi\xE7\xE3o", "19101"], ["Danificado", "Informar posi\xE7\xE3o", "19102"]], "Suporte do Rolamento do Cardan": [["Quebrado", "Informar posi\xE7\xE3o", "19103"], ["Com folga", "Informar posi\xE7\xE3o", "19104"]], "Cruzeta do Cardan": [["Com folga", "Informar posi\xE7\xE3o", "19105"], ["Com barulho", "Informar posi\xE7\xE3o", "19106"], ["Travada", "Informar posi\xE7\xE3o", "19107"], ["Quebrada", "Informar posi\xE7\xE3o", "19108"], ["Desgastada", "Informar posi\xE7\xE3o", "19109"], ["Falta de lubrifica\xE7\xE3o", "Informar posi\xE7\xE3o", "19110"]], "Parafuso da Cruzeta": [["Solto", "Informar posi\xE7\xE3o", "19111"], ["Quebrado", "Informar posi\xE7\xE3o", "19112"], ["Faltando", "Informar posi\xE7\xE3o", "19113"], ["Rosca danificada", "Informar posi\xE7\xE3o", "19114"]], Gaxeiro: [["Vazando \xF3leo", "Informar posi\xE7\xE3o", "19115"], ["Com folga", "Informar posi\xE7\xE3o", "19116"], ["Danificado", "Informar posi\xE7\xE3o", "19117"]], Diferencial: [["Com barulho", "Informar eixo", "19118"], ["Com folga", "Informar eixo", "19119"], ["Vazando \xF3leo", "Informar eixo/local", "19120"], ["Superaquecendo", "Informar eixo", "19121"], ["Travado", "Informar eixo", "19122"], ["Danificado", "Informar eixo", "19123"], ["N\xEDvel de \xF3leo baixo", "Informar eixo", "19124"], ["\xD3leo contaminado", "Informar eixo", "19125"], ["Preventiva", "Digitar KM atual", "19126"]], "Retentor do Diferencial": [["Vazando \xF3leo", "Informar posi\xE7\xE3o", "19127"]], "C\xE2mbio Automatizado": [["N\xE3o engata marcha", "Informar marcha", "19128"], ["Falha na troca de marcha", "Livre Texto", "19129"], ["Travado em marcha", "Informar marcha", "19130"], ["Travado em neutro", "Livre Texto", "19131"], ["Falha no painel", "Informar mensagem", "19132"], ["Modo de emerg\xEAncia", "Informar mensagem", "19133"]], "Atuador de Marchas": [["Com falha", "Livre Texto", "19134"], ["N\xE3o atua", "Livre Texto", "19135"], ["Travado", "Livre Texto", "19136"], ["Vazando", "Livre Texto", "19137"]], "Atuador de Sele\xE7\xE3o": [["Com falha", "Livre Texto", "19138"], ["N\xE3o atua", "Livre Texto", "19139"], ["Travado", "Livre Texto", "19140"]], "Atuador de Embreagem": [["Com falha", "Livre Texto", "19141"], ["N\xE3o atua", "Livre Texto", "19142"], ["Vazando", "Livre Texto", "19143"]], "M\xF3dulo da Transmiss\xE3o": [["Com falha", "Informar c\xF3digo", "19144"], ["Sem comunica\xE7\xE3o", "Informar c\xF3digo", "19145"], ["Falha intermitente", "Informar c\xF3digo", "19146"]], "Chicote da Transmiss\xE3o": [["Rompido", "Informar local", "19147"], ["Mau contato", "Informar local", "19148"], ["Danificado", "Informar local", "19149"]], "Sensor de Rota\xE7\xE3o da Caixa": [["Com falha", "Livre Texto", "19150"], ["Sem sinal", "Livre Texto", "19151"]], "Sensor de Posi\xE7\xE3o de Marcha": [["Com falha", "Livre Texto", "19152"], ["Leitura incorreta", "Livre Texto", "19153"]], "Tomada de For\xE7a (PTO)": [["N\xE3o engata", "Livre Texto", "19154"], ["N\xE3o desengata", "Livre Texto", "19155"], ["Com barulho", "Livre Texto", "19156"], ["Vazando \xF3leo", "Livre Texto", "19157"], ["Danificada", "Livre Texto", "19158"]], "Sistema de Transmiss\xE3o": [["Preventiva", "Digitar KM atual", "19159"], ["Outros", "Livre Texto", "19160"]] }, "Quinta Roda": { Item: [["Falha", "Complemento", "C\xF3digo Item"], ["Falha", "Complemento", ""]], "Quinta Roda": [["Com folga", "Livre Texto", "20.01"], ["Travada", "Livre Texto", "20.02"], ["N\xE3o trava", "Livre Texto", "20.03"], ["N\xE3o destrava", "Livre Texto", "20.04"], ["Travamento irregular", "Livre Texto", "20.05"], ["Desgaste excessivo", "Livre Texto", "20.06"], ["Trincada", "Livre Texto", "20.07"], ["Quebrada", "Livre Texto", "20.08"], ["Empenada", "Livre Texto", "20.09"], ["Com barulho", "Livre Texto", "20.10"], ["Sem lubrifica\xE7\xE3o", "Livre Texto", "20.11"], ["Lubrifica\xE7\xE3o deficiente", "Livre Texto", "20.12"], ["Danificada", "Livre Texto", "20.13"]], "Mand\xEDbula da Quinta Roda": [["Com folga", "Livre Texto", "20.14"], ["N\xE3o trava", "Livre Texto", "20.15"], ["Travada", "Livre Texto", "20.16"], ["Desgastada", "Livre Texto", "20.17"], ["Quebrada", "Livre Texto", "20.18"], ["Danificada", "Livre Texto", "20.19"]], "Trava da Quinta Roda": [["N\xE3o trava", "Livre Texto", "20.20"], ["N\xE3o destrava", "Livre Texto", "20.21"], ["Travada", "Livre Texto", "20.22"], ["Com folga", "Livre Texto", "20.23"], ["Desgastada", "Livre Texto", "20.24"], ["Quebrada", "Livre Texto", "20.25"]], "Alavanca da Quinta Roda": [["Travada", "Livre Texto", "20.26"], ["Com folga", "Livre Texto", "20.27"], ["Empenada", "Livre Texto", "20.28"], ["Quebrada", "Livre Texto", "20.29"], ["N\xE3o aciona destravamento", "Livre Texto", "20.30"]], "Mola da Quinta Roda": [["Quebrada", "Livre Texto", "20.31"], ["Sem press\xE3o", "Livre Texto", "20.32"], ["Ausente", "Livre Texto", "20.33"]], "Pino da Quinta Roda": [["Com folga", "Livre Texto", "20.34"], ["Desgastado", "Livre Text", "20.35"]] }, "Tanque de Combustivel": { "Tanque de Combust\xEDvel": [["Vazando", "Informar local", "30.01"], ["Furado", "Informar local", "30.02"], ["Trincado", "Informar local", "30.03"], ["Amassado", "Informar lado", "30.04"], ["Deformado", "Informar lado", "30.05"], ["Com corros\xE3o", "Informar local", "30.06"], ["Solto", "Informar lado", "30.07"], ["Deslocado", "Informar lado", "30.08"], ["Danificado", "Informar lado", "30.09"], ["Contaminado", "Informar contamina\xE7\xE3o", "30.10"], ["Com \xE1gua", "Livre Texto", "30.11"], ["Com sujeira", "Livre Texto", "30.12"], ["Necessita limpeza", "Livre Texto", "30.13"], ["Necessita substitui\xE7\xE3o", "Informar lado", "30.14"]], "Tampa do Tanque": [["N\xE3o fecha", "Informar lado", "30.15"], ["N\xE3o abre", "Informar lado", "30.16"], ["Travada", "Informar lado", "30.17"], ["Com vazamento", "Informar lado", "30.18"], ["Sem veda\xE7\xE3o", "Informar lado", "30.19"], ["Quebrada", "Informar lado", "30.20"], ["Ausente", "Informar lado", "30.21"], ["Danificada", "Informar lado", "30.22"]], "Veda\xE7\xE3o da Tampa do Tanque": [["Ressecada", "Informar lado", "30.23"], ["Rasgada", "Informar lado", "30.24"], ["Vazando", "Informar lado", "30.25"], ["Ausente", "Informar lado", "30.26"]], "Bocal do Tanque": [["Vazando", "Informar lado", "30.27"], ["Trincado", "Informar lado", "30.28"], ["Quebrado", "Informar lado", "30.29"], ["Danificado", "Informar lado", "30.30"]], "Cinta do Tanque": [["Solta", "Informar lado/posi\xE7\xE3o", "30.31"], ["Com folga", "Informar lado/posi\xE7\xE3o", "30.32"], ["Trincada", "Informar lado/posi\xE7\xE3o", "30.33"], ["Quebrada", "Informar lado/posi\xE7\xE3o", "30.34"], ["Com corros\xE3o", "Informar lado/posi\xE7\xE3o", "30.35"], ["Ausente", "Informar lado/posi\xE7\xE3o", "30.36"], ["Danificada", "Informar lado/posi\xE7\xE3o", "30.37"]], "Suporte do Tanque": [["Solto", "Informar lado", "30.38"], ["Com folga", "Informar lado", "30.39"], ["Trincado", "Informar lado", "30.40"], ["Quebrado", "Informar lado", "30.41"], ["Empenado", "Informar lado", "30.42"], ["Danificado", "Informar lado", "30.43"]], "Borracha da Cinta do Tanque": [["Desgastada", "Informar posi\xE7\xE3o", "30.44"], ["Rasgada", "Informar posi\xE7\xE3o", "30.45"], ["Deslocada", "Informar posi\xE7\xE3o", "30.46"], ["Ausente", "Informar posi\xE7\xE3o", "30.47"]], "Pescador do Tanque": [["Entupido", "Informar tanque", "30.48"], ["Quebrado", "Informar tanque", "30.49"], ["Com entrada de ar", "Informar tanque", "30.50"], ["Danificado", "Informar tanque", "30.51"]], "Tubo de Retorno do Tanque": [["Vazando", "Informar local", "30.52"], ["Entupido", "Informar local", "30.53"], ["Rompido", "Informar local", "30.54"], ["Danificado", "Informar local", "30.55"]], "Mangueira do Tanque": [["Vazando", "Informar local", "30.56"], ["Ressecada", "Informar local", "30.57"]] }, "Tanque do Arla": { "Tanque do ARLA": [["Vazando", "Informar local", "40.01"], ["Furado", "Informar local", "40.02"], ["Trincado", "Informar local", "40.03"], ["Amassado", "Informar local", "40.04"], ["Deformado", "Informar local", "40.05"], ["Solto", "Livre Texto", "40.06"], ["Deslocado", "Livre Texto", "40.07"], ["Danificado", "Livre Texto", "40.08"], ["Contaminado", "Informar contamina\xE7\xE3o", "40.09"], ["Com sujeira", "Livre Texto", "40.10"], ["Com cristaliza\xE7\xE3o", "Informar local", "40.11"], ["Necessita limpeza", "Livre Texto", "40.12"], ["Necessita substitui\xE7\xE3o", "Livre Texto", "40.13"], ["Outros", "Livre Texto", "40.74"]], "Tampa do Tanque do ARLA": [["N\xE3o abre", "Livre Texto", "40.14"], ["N\xE3o fecha", "Livre Texto", "40.15"], ["Travada", "Livre Texto", "40.16"], ["Vazando", "Livre Texto", "40.17"], ["Sem veda\xE7\xE3o", "Livre Texto", "40.18"], ["Quebrada", "Livre Texto", "40.19"], ["Ausente", "Livre Texto", "40.20"], ["Danificada", "Livre Texto", "40.21"]], "Veda\xE7\xE3o da Tampa do ARLA": [["Ressecada", "Livre Texto", "40.22"], ["Rasgada", "Livre Texto", "40.23"], ["Vazando", "Livre Texto", "40.24"], ["Ausente", "Livre Texto", "40.25"]], "Bocal do Tanque do ARLA": [["Vazando", "Livre Texto", "40.26"], ["Trincado", "Livre Texto", "40.27"], ["Quebrado", "Livre Texto", "40.28"], ["Com cristaliza\xE7\xE3o", "Livre Texto", "40.29"], ["Danificado", "Livre Texto", "40.30"]], "Cinta do Tanque do ARLA": [["Solta", "Informar posi\xE7\xE3o", "40.31"], ["Com folga", "Informar posi\xE7\xE3o", "40.32"], ["Trincada", "Informar posi\xE7\xE3o", "40.33"], ["Quebrada", "Informar posi\xE7\xE3o", "40.34"], ["Ausente", "Informar posi\xE7\xE3o", "40.35"], ["Danificada", "Informar posi\xE7\xE3o", "40.36"]], "Suporte do Tanque do ARLA": [["Solto", "Informar posi\xE7\xE3o", "40.37"], ["Com folga", "Informar posi\xE7\xE3o", "40.38"], ["Trincado", "Informar posi\xE7\xE3o", "40.39"], ["Quebrado", "Informar posi\xE7\xE3o", "40.40"], ["Empenado", "Informar posi\xE7\xE3o", "40.41"], ["Danificado", "Informar posi\xE7\xE3o", "40.42"]], "Borracha da Cinta do Tanque do ARLA": [["Desgastada", "Informar posi\xE7\xE3o", "40.43"], ["Rasgada", "Informar posi\xE7\xE3o", "40.44"], ["Deslocada", "Informar posi\xE7\xE3o", "40.45"], ["Ausente", "Informar posi\xE7\xE3o", "40.46"]], "Mangueira do Tanque do ARLA": [["Vazando", "Informar local", "40.47"], ["Ressecada", "Informar local", "40.48"], ["Rachada", "Informar local", "40.49"], ["Rompida", "Informar local", "40.50"], ["Solta", "Informar local", "40.51"], ["Entupida", "Informar local", "40.52"], ["Com cristaliza\xE7\xE3o", "Informar local", "40.53"], ["Danificada", "Informar local", "40.54"]], "Conex\xE3o do Tanque do ARLA": [["Vazando", "Informar local", "40.55"], ["Solta", "Informar local", "40.56"], ["Quebrada", "Informar local", "40.57"], ["Com cristaliza\xE7\xE3o", "Informar local", "40.58"], ["Danificada", "Informar local", "40.59"]], "Tubula\xE7\xE3o do ARLA": [["Vazando", "Informar local", "40.60"], ["Entupida", "Informar local", "40.61"], ["Rompida", "Informar local", "40.62"], ["Com cristaliza\xE7\xE3o", "Informar local", "40.63"], ["Danificada", "Informar local", "40.64"]], "Pescador do Tanque do ARLA": [["Entupido", "Livre Texto", "40.65"], ["Com cristaliza\xE7\xE3o", "Livre Texto", "40.66"], ["Quebrado", "Livre Texto", "40.67"], ["Danificado", "Livre Texto", "40.68"]], "Dreno do Tanque do ARLA": [["Vazando", "Livre Texto", "40.69"], ["Travado", "Livre Texto", "40.70"], ["Entupido", "Livre Texto", "40.71"], ["Com cristaliza\xE7\xE3o", "Livre Texto", "40.72"], ["Danificado", "Livre Texto", "40.73"]] }, "Tanque Auxiliar de Diesel": { "Tanque Auxiliar": [["Vazando", "Informar local", "50.01"], ["Furado", "Informar local", "50.02"], ["Trincado", "Informar local", "50.03"], ["Amassado", "Informar local", "50.04"], ["Deformado", "Informar local", "50.05"], ["Com corros\xE3o", "Informar local", "50.06"], ["Solto", "Informar posi\xE7\xE3o", "50.07"], ["Deslocado", "Informar posi\xE7\xE3o", "50.08"], ["Danificado", "Informar posi\xE7\xE3o", "50.09"], ["Contaminado", "Informar contamina\xE7\xE3o", "50.10"], ["Com \xE1gua", "Livre Texto", "50.11"], ["Com sujeira", "Livre Texto", "50.12"], ["Necessita limpeza", "Livre Texto", "50.13"], ["Necessita substitui\xE7\xE3o", "Livre Texto", "50.14"], ["Outros", "Livre Texto", "50.76"]], "Tampa do Tanque Auxiliar": [["N\xE3o abre", "Livre Texto", "50.15"], ["N\xE3o fecha", "Livre Texto", "50.16"], ["Travada", "Livre Texto", "50.17"], ["Vazando", "Livre Texto", "50.18"], ["Sem veda\xE7\xE3o", "Livre Texto", "50.19"], ["Quebrada", "Livre Texto", "50.20"], ["Ausente", "Livre Texto", "50.21"], ["Danificada", "Livre Texto", "50.22"]], "Bocal do Tanque Auxiliar": [["Vazando", "Informar local", "50.23"], ["Trincado", "Informar local", "50.24"], ["Quebrado", "Informar local", "50.25"], ["Danificado", "Informar local", "50.26"]], "Cinta do Tanque Auxiliar": [["Solta", "Informar posi\xE7\xE3o", "50.27"], ["Com folga", "Informar posi\xE7\xE3o", "50.28"], ["Trincada", "Informar posi\xE7\xE3o", "50.29"], ["Quebrada", "Informar posi\xE7\xE3o", "50.30"], ["Com corros\xE3o", "Informar posi\xE7\xE3o", "50.31"], ["Ausente", "Informar posi\xE7\xE3o", "50.32"], ["Danificada", "Informar posi\xE7\xE3o", "50.33"]], "Suporte do Tanque Auxiliar": [["Solto", "Informar posi\xE7\xE3o", "50.34"], ["Com folga", "Informar posi\xE7\xE3o", "50.35"], ["Trincado", "Informar posi\xE7\xE3o", "50.36"], ["Quebrado", "Informar posi\xE7\xE3o", "50.37"], ["Empenado", "Informar posi\xE7\xE3o", "50.38"], ["Danificado", "Informar posi\xE7\xE3o", "50.39"]], "Borracha da Cinta do Tanque Auxiliar": [["Desgastada", "Informar posi\xE7\xE3o", "50.40"], ["Rasgada", "Informar posi\xE7\xE3o", "50.41"], ["Deslocada", "Informar posi\xE7\xE3o", "50.42"], ["Ausente", "Informar posi\xE7\xE3o", "50.43"]], "Mangueira do Tanque Auxiliar": [["Vazando", "Informar local", "50.44"], ["Ressecada", "Informar local", "50.45"], ["Rachada", "Informar local", "50.46"], ["Rompida", "Informar local", "50.47"], ["Solta", "Informar local", "50.48"], ["Entupida", "Informar local", "50.49"], ["Danificada", "Informar local", "50.50"]], "Conex\xE3o do Tanque Auxiliar": [["Vazando", "Informar local", "50.51"], ["Solta", "Informar local", "50.52"], ["Quebrada", "Informar local", "50.53"], ["Danificada", "Informar local", "50.54"]], "Linha entre Tanques": [["Vazando", "Informar local", "50.55"], ["Entupida", "Informar local", "50.56"], ["Rompida", "Informar local", "50.57"], ["Com entrada de ar", "Informar local", "50.58"], ["Danificada", "Informar local", "50.59"]], "V\xE1lvula de Transfer\xEAncia": [["N\xE3o transfere combust\xEDvel", "Livre Texto", "50.60"], ["Travada", "Livre Texto", "50.61"], ["Vazando", "Livre Texto", "50.62"], ["Danificada", "Livre Texto", "50.63"]], "Retorno do Tanque Auxiliar": [["Vazando", "Informar local", "50.64"], ["Entupido", "Informar local", "50.65"], ["Rompido", "Informar local", "50.66"], ["Danificado", "Informar local", "50.67"]], "Pescador do Tanque Auxiliar": [["Entupido", "Livre Texto", "50.68"], ["Com entrada de ar", "Livre Texto", "50.69"], ["Quebrado", "Livre Texto", "50.70"], ["Danificado", "Livre Texto", "50.71"]], "Dreno do Tanque Auxiliar": [["Vazando", "Livre Texto", "50.72"], ["Travado", "Livre Texto", "50.73"], ["Entupido", "Livre Texto", "50.74"], ["Danificado", "Livre Texto", "50.75"]] } } }, ELE: { nome: "El\xE9trica", sistemas: { El\u00E9trica: { Alternador: [["N\xE3o carrega", "Livre Texto", "20.01"], ["Carga baixa", "Informar tens\xE3o", "20.02"], ["Carga excessiva", "Informar tens\xE3o", "20.03"], ["Carga intermitente", "Livre Texto", "20.04"], ["Com barulho", "Livre Texto", "20.05"], ["Travado", "Livre Texto", "20.06"], ["Superaquecendo", "Livre Texto", "20.07"], ["Com falha", "Livre Texto", "20.08"], ["Preventiva", "Digitar KM atual", "20.09"]], "Regulador de Tens\xE3o": [["N\xE3o funciona", "Livre Texto", "20.10"], ["Tens\xE3o baixa", "Informar tens\xE3o", "20.11"], ["Tens\xE3o alta", "Informar tens\xE3o", "20.12"], ["Carga oscilando", "Informar tens\xE3o", "20.13"], ["Danificado", "Livre Texto", "20.14"]], "Rolamento do Alternador": [["Com barulho", "Livre Texto", "20.15"], ["Com folga", "Livre Texto", "20.16"], ["Travado", "Livre Texto", "20.17"], ["Danificado", "Livre Texto", "20.18"]], "Polia do Alternador": [["Com folga", "Livre Texto", "20.19"], ["Travada", "Livre Texto", "20.20"], ["Desgastada", "Livre Texto", "20.21"], ["Quebrada", "Livre Texto", "20.22"], ["Desalinhada", "Livre Texto", "20.23"], ["Com barulho", "Livre Texto", "20410"], ["Com folga", "Livre Texto", "20411"], ["Travada", "Livre Texto", "20412"], ["Desalinhada", "Livre Texto", "20413"], ["Danificada", "Livre Texto", "20414"]], "Correia do Alternador": [["Frouxa", "Livre Texto", "20.24"], ["Patinando", "Livre Texto", "20.25"], ["Ressecada", "Livre Texto", "20.26"], ["Desgastada", "Livre Texto", "20.27"], ["Arrebentada", "Livre Texto", "20.28"], ["Desalinhada", "Livre Texto", "20.29"], ["Arrebentada", "Livre Texto", "20394"], ["Desgastada", "Livre Texto", "20395"], ["Ressecada", "Livre Texto", "20396"], ["Trincada", "Livre Texto", "20397"], ["Desfiando", "Livre Texto", "20398"], ["Frouxa", "Livre Texto", "20399"], ["Patinando", "Livre Texto", "20400"], ["Desalinhada", "Livre Texto", "20401"], ["Saindo da polia", "Livre Texto", "20402"], ["Com ru\xEDdo", "Livre Texto", "20403"], ["Preventiva", "Digitar KM atual", "20404"]], "Tensor da Correia": [["Com folga", "Livre Texto", "20.30"], ["Travado", "Livre Texto", "20.31"], ["Sem tens\xE3o", "Livre Texto", "20.32"], ["Com barulho", "Livre Texto", "20.33"], ["Danificado", "Livre Texto", "20.34"]], "Chicote do Alternador": [["Rompido", "Informar local", "20.35"], ["Mau contato", "Informar local", "20.36"], ["Curto-circuito", "Informar local", "20.37"]], "Conector do Alternador": [["Mau contato", "Livre Texto", "20.38"], ["Oxidado", "Livre Texto", "20.39"]], "Cabo Positivo do Alternador": [["Mau contato", "Livre Texto", "20.40"], ["Aquecendo", "Livre Texto", "20.41"]], "Cabo de Aterramento": [["Mau contato", "Livre Texto", "20.42"], ["Oxidado", "Livre Texto", "20.43"]], "Luz de Carga no Painel": [["Acesa", "Livre Texto", "20.44"]], "Motor de Partida": [["N\xE3o funciona", "Livre Texto", "20.45"], ["N\xE3o gira", "Livre Texto", "20.46"], ["Gira lentamente", "Livre Texto", "20.47"], ["Funciona intermitente", "Livre Texto", "20.48"], ["Com barulho", "Livre Texto", "20.49"], ["Travado", "Livre Texto", "20.50"], ["Superaquecendo", "Livre Texto", "20.51"], ["N\xE3o desacopla", "Livre Texto", "20.52"], ["Preventiva", "Digitar KM atual", "20.53"]], "Autom\xE1tico do Motor de Partida": [["N\xE3o aciona", "Livre Texto", "20.54"], ["Travado", "Livre Texto", "20.55"], ["Intermitente", "Livre Texto", "20.56"], ["Danificado", "Livre Texto", "20.57"]], Bendix: [["N\xE3o acopla", "Livre Texto", "20.58"], ["N\xE3o desacopla", "Livre Texto", "20.59"], ["Patinando", "Livre Texto", "20.60"], ["Travado", "Livre Texto", "20.61"], ["Desgastado", "Livre Texto", "20.62"], ["Danificado", "Livre Texto", "20.63"]], "Escova do Motor de Partida": [["Desgastada", "Livre Texto", "20.64"], ["Travada", "Livre Texto", "20.65"], ["Danificada", "Livre Texto", "20.66"]], "Porta-Escovas": [["Danificado", "Livre Texto", "20.67"]], Induzido: [["Em curto", "Livre Texto", "20.68"], ["Queimado", "Livre Texto", "20.69"], ["Danificado", "Livre Texto", "20.70"]], "Bobina de Campo": [["Em curto", "Livre Texto", "20.71"], ["Queimada", "Livre Texto", "20.72"]], "Rolamento/Bucha do Motor de Partida": [["Com folga", "Livre Texto", "20.73"], ["Com barulho", "Livre Texto", "20.74"], ["Travado", "Livre Texto", "20.75"]], "Chicote do Motor de Partida": [["Mau contato", "Informar local", "20.76"], ["Rompido", "Informar local", "20.77"], ["Curto-circuito", "Informar local", "20.78"]], "Cabo Positivo do Motor de Partida": [["Mau contato", "Livre Texto", "20.79"], ["Aquecendo", "Livre Texto", "20.80"], ["Danificado", "Livre Texto", "20.81"]], "Aterramento do Motor de Partida": [["Mau contato", "Livre Texto", "20.82"], ["Oxidado", "Livre Texto", "20.83"], ["Danificado", "Livre Texto", "20.84"]], Bateria: [["Descarregada", "Livre Texto", "20.85"], ["N\xE3o segura carga", "Livre Texto", "20.86"], ["Baixa tens\xE3o", "Informar tens\xE3o", "20.87"], ["Sem tens\xE3o", "Informar tens\xE3o", "20.88"], ["Baixa capacidade de partida", "Livre Texto", "20.89"], ["Em curto", "Livre Texto", "20.90"], ["Elemento em curto", "Livre Texto", "20.91"], ["Danificada", "Livre Texto", "20.92"], ["Estufada", "Livre Texto", "20.93"], ["Vazando", "Livre Texto", "20.94"], ["Oxidada", "Livre Texto", "20.95"], ["Vida \xFAtil comprometida", "Informar KM/idade", "20.96"], ["Preventiva", "Digitar KM atual", "20.97"]], "Terminal da Bateria": [["Oxidado", "Informar posi\xE7\xE3o", "20.98"], ["Mau contato", "Informar posi\xE7\xE3o", "20.99"], ["Solto", "Informar posi\xE7\xE3o", "20100"], ["Quebrado", "Informar posi\xE7\xE3o", "20101"], ["Aquecendo", "Informar posi\xE7\xE3o", "20102"]], "Cabo da Bateria": [["Mau contato", "Informar posi\xE7\xE3o", "20103"], ["Rompido", "Informar posi\xE7\xE3o", "20104"], ["Oxidado", "Informar posi\xE7\xE3o", "20105"], ["Aquecendo", "Informar posi\xE7\xE3o", "20106"], ["Danificado", "Informar posi\xE7\xE3o", "20107"]], "Cabo de Liga\xE7\xE3o entre Baterias": [["Mau contato", "Livre Texto", "20108"], ["Rompido", "Livre Texto", "20109"], ["Oxidado", "Livre Texto", "20110"], ["Aquecendo", "Livre Texto", "20111"]], "Aterramento da Bateria": [["Mau contato", "Informar local", "20112"], ["Oxidado", "Informar local", "20113"], ["Rompido", "Informar local", "20114"], ["Danificado", "Informar local", "20115"]], "Caixa/Suporte da Bateria": [["Solto", "Livre Texto", "20116"], ["Quebrado", "Livre Texto", "20117"], ["Oxidado", "Livre Texto", "20118"], ["Danificado", "Livre Texto", "20119"]], "Cinta/Trava da Bateria": [["Solta", "Livre Texto", "20120"], ["Quebrada", "Livre Texto", "20121"]], "Chave Geral da Bateria": [["N\xE3o funciona", "Livre Texto", "20122"], ["Mau contato", "Livre Texto", "20123"], ["Travada", "Livre Texto", "20124"], ["Aquecendo", "Livre Texto", "20125"], ["Danificada", "Livre Texto", "20126"]], "Chave Geral": [["N\xE3o funciona", "Livre Texto", "20122"], ["Mau contato", "Livre Texto", "20123"], ["Travada", "Livre Texto", "20124"], ["Aquecendo", "Livre Texto", "20125"], ["N\xE3o desliga", "Livre Texto", "20126"], ["N\xE3o liga", "Livre Texto", "20127"], ["Desarmando", "Livre Texto", "20128"], ["Intermitente", "Livre Texto", "20129"], ["Queimada", "Livre Texto", "20130"], ["Danificada", "Livre Texto", "20131"]], "Terminal da Chave Geral": [["Mau contato", "Livre Texto", "20132"], ["Oxidado", "Livre Texto", "20133"], ["Solto", "Livre Texto", "20134"], ["Aquecendo", "Livre Texto", "20135"], ["Danificado", "Livre Texto", "20136"]], "Cabo da Chave Geral": [["Mau contato", "Informar local", "20137"], ["Rompido", "Informar local", "20138"], ["Aquecendo", "Informar local", "20139"], ["Danificado", "Informar local", "20140"]], Farol: [["N\xE3o acende", "Informar lado", "20141"], ["Acende intermitente", "Informar lado", "20142"], ["Ilumina\xE7\xE3o fraca", "Informar lado", "20143"], ["Desregulado", "Informar lado", "20144"], ["Danificado", "Informar lado", "20145"], ["Quebrado", "Informar lado", "20146"], ["Infiltra\xE7\xE3o de \xE1gua", "Informar lado", "20147"], ["Emba\xE7ado", "Informar lado", "20148"]], "Farol Baixo": [["N\xE3o acende", "Informar lado", "20149"], ["Ilumina\xE7\xE3o fraca", "Informar lado", "20150"]], "Farol Alto": [["N\xE3o acende", "Informar lado", "20151"], ["Ilumina\xE7\xE3o fraca", "Informar lado", "20152"], ["N\xE3o comuta", "Livre Texto", "20153"]], "L\xE2mpada do Farol": [["Queimada", "Informar lado", "20154"], ["Intermitente", "Informar lado", "20155"], ["Ilumina\xE7\xE3o fraca", "Informar lado", "20156"]], "Soquete do Farol": [["Mau contato", "Informar lado", "20157"], ["Oxidado", "Informar lado", "20158"], ["Queimado", "Informar lado", "20159"], ["Danificado", "Informar lado", "20160"]], "Chicote do Farol": [["Mau contato", "Informar lado", "20161"], ["Rompido", "Informar lado", "20162"], ["Curto-circuito", "Informar lado", "20163"], ["Danificado", "Informar lado", "20164"]], "Conector do Farol": [["Mau contato", "Informar lado", "20165"], ["Oxidado", "Informar lado", "20166"], ["Danificado", "Informar lado", "20167"]], "Rel\xE9 do Farol": [["N\xE3o funciona", "Livre Texto", "20168"], ["Intermitente", "Livre Texto", "20169"], ["Queimado", "", "20170"]], Seta: [["N\xE3o funciona", "Informar posi\xE7\xE3o", "20180"], ["N\xE3o acende", "Informar posi\xE7\xE3o", "20181"], ["N\xE3o pisca", "Informar posi\xE7\xE3o", "20182"], ["Pisca r\xE1pido", "Informar posi\xE7\xE3o", "20183"], ["Pisca lento", "Informar posi\xE7\xE3o", "20184"], ["Funcionamento intermitente", "Informar posi\xE7\xE3o", "20185"], ["Ilumina\xE7\xE3o fraca", "Informar posi\xE7\xE3o", "20186"], ["Permanece acesa", "Informar posi\xE7\xE3o", "20187"], ["Danificada", "Informar posi\xE7\xE3o", "20188"], ["Quebrada", "Informar posi\xE7\xE3o", "20189"], ["Infiltra\xE7\xE3o de \xE1gua", "Informar posi\xE7\xE3o", "20190"]], "L\xE2mpada da Seta": [["Queimada", "Informar posi\xE7\xE3o", "20191"], ["Intermitente", "Informar posi\xE7\xE3o", "20192"]], "Soquete da Seta": [["Mau contato", "Informar posi\xE7\xE3o", "20193"], ["Oxidado", "Informar posi\xE7\xE3o", "20194"], ["Queimado", "Informar posi\xE7\xE3o", "20195"], ["Danificado", "Informar posi\xE7\xE3o", "20196"]], "Chicote da Seta": [["Mau contato", "Informar posi\xE7\xE3o", "20197"], ["Rompido", "Informar posi\xE7\xE3o", "20198"], ["Curto-circuito", "Informar posi\xE7\xE3o", "20199"], ["Danificado", "Informar posi\xE7\xE3o", "20200"]], "Conector da Seta": [["Mau contato", "Informar posi\xE7\xE3o", "20201"], ["Oxidado", "Informar posi\xE7\xE3o", "20202"], ["Danificado", "Informar posi\xE7\xE3o", "20203"]], "Rel\xE9 de Seta": [["N\xE3o funciona", "Livre Texto", "20204"], ["Intermitente", "Livre Texto", "20205"], ["Travado", "Livre Texto", "20206"], ["Queimado", "Livre Texto", "20207"]], "Comando de Seta": [["N\xE3o funciona", "Livre Texto", "20208"], ["N\xE3o retorna", "Livre Texto", "20209"], ["Travando", "Livre Texto", "20210"], ["Mau contato", "Livre Texto", "20211"], ["Danificado", "Livre Texto", "20212"]], "Pisca-Alerta": [["N\xE3o funciona", "Livre Texto", "20213"], ["Funcionamento intermitente", "Livre Texto", "20214"]], "Comando do Pisca-Alerta": [["N\xE3o funciona", "Livre Texto", "20215"], ["Travado", "Livre Texto", "20216"], ["Danificado", "Livre Texto", "20217"]], Vigia: [["N\xE3o acende", "Informar posi\xE7\xE3o", "20218"], ["Funcionamento intermitente", "Informar posi\xE7\xE3o", "20219"], ["Ilumina\xE7\xE3o fraca", "Informar posi\xE7\xE3o", "20220"], ["Permanece acesa", "Informar posi\xE7\xE3o", "20221"], ["Danificada", "Informar posi\xE7\xE3o", "20222"], ["Quebrada", "Informar posi\xE7\xE3o", "20223"], ["Infiltra\xE7\xE3o de \xE1gua", "Informar posi\xE7\xE3o", "20224"]], "L\xE2mpada do Vigia": [["Queimada", "Informar posi\xE7\xE3o", "20225"], ["Intermitente", "Informar posi\xE7\xE3o", "20226"]], "Soquete do Vigia": [["Mau contato", "Informar posi\xE7\xE3o", "20227"], ["Oxidado", "Informar posi\xE7\xE3o", "20228"], ["Queimado", "Informar posi\xE7\xE3o", "20229"], ["Danificado", "Informar posi\xE7\xE3o", "20230"]], "Chicote do Vigia": [["Mau contato", "Informar posi\xE7\xE3o", "20231"], ["Rompido", "Informar posi\xE7\xE3o", "20232"], ["Curto-circuito", "Informar posi\xE7\xE3o", "20233"], ["Danificado", "Informar posi\xE7\xE3o", "20234"]], "Conector do Vigia": [["Mau contato", "Informar posi\xE7\xE3o", "20235"], ["Oxidado", "Informar posi\xE7\xE3o", "20236"], ["Danificado", "Informar posi\xE7\xE3o", "20237"]], "Suporte do Vigia": [["Solto", "Informar posi\xE7\xE3o", "20238"], ["Quebrado", "Informar posi\xE7\xE3o", "20239"], ["Danificado", "Informar posi\xE7\xE3o", "20240"]], "Limpador de Para-brisa": [["N\xE3o funciona", "Livre Texto", "20241"], ["Funcionamento intermitente", "Livre Texto", "20242"], ["Funciona lentamente", "Livre Texto", "20243"], ["N\xE3o retorna \xE0 posi\xE7\xE3o", "Livre Texto", "20244"], ["Travando", "Livre Texto", "20245"], ["Com barulho", "Livre Texto", "20246"], ["Funciona somente uma velocidade", "Livre Texto", "20247"]], "Motor do Limpador": [["N\xE3o funciona", "Livre Texto", "20248"], ["Funcionamento intermitente", "Livre Texto", "20249"], ["Fraco", "Livre Texto", "20250"], ["Travado", "Livre Texto", "20251"], ["Com barulho", "Livre Texto", "20252"], ["Queimado", "Livre Texto", "20253"]], "Palheta do Limpador": [["Ressecada", "Informar lado", "20254"], ["Rasgada", "Informar lado", "20255"], ["N\xE3o limpa corretamente", "Informar lado", "20256"], ["Solta", "Informar lado", "20257"], ["Danificada", "Informar lado", "20258"]], "Bra\xE7o do Limpador": [["Com folga", "Informar lado", "20259"], ["Solto", "Informar lado", "20260"], ["Empenado", "Informar lado", "20261"], ["Quebrado", "Informar lado", "20262"], ["Danificado", "Informar lado", "20263"]], "Mecanismo do Limpador": [["Com folga", "Livre Texto", "20264"], ["Travando", "Livre Texto", "20265"], ["Desencaixado", "Livre Texto", "20266"], ["Quebrado", "Livre Texto", "20267"], ["Danificado", "Livre Texto", "20268"]], "Comando do Limpador": [["N\xE3o funciona", "Livre Texto", "20269"], ["Funcionamento intermitente", "Livre Texto", "20270"], ["N\xE3o altera velocidade", "Livre Texto", "20271"], ["Danificado", "Livre Texto", "20272"]], "Reservat\xF3rio do Lavador": [["Vazando", "Livre Texto", "20273"], ["Quebrado", "Livre Texto", "20274"]], "Bomba do Lavador": [["N\xE3o funciona", "Livre Texto", "20275"], ["Fraca", "Livre Texto", "20276"], ["Vazando", "Livre Texto", "20277"]], "Esguicho do Lavador": [["Entupido", "Informar lado", "20278"], ["Desregulado", "Informar lado", "20279"], ["N\xE3o funciona", "Informar lado", "20280"]], "Mangueira do Lavador": [["Vazando", "Informar local", "20281"], ["Rompida", "Informar local", "20282"], ["Desconectada", "Informar local", "20283"]], "Chicote do Limpador": [["Mau contato", "Informar local", "20284"], ["Rompido", "Informar local", "20285"], ["Curto-circuito", "Informar local", "20286"]], "Rel\xE9 do Limpador": [["N\xE3o funciona", "Livre Texto", "20287"], ["Intermitente", "Livre Texto", "20288"]], "Fus\xEDvel do Limpador": [["Queimado", "Livre Texto", "20289"]], "Ar-Condicionado": [["N\xE3o funciona", "Livre Texto", "20290"], ["N\xE3o gela", "Livre Texto", "20291"], ["Gela pouco", "Livre Texto", "20292"], ["Funcionamento intermitente", "Livre Texto", "20293"], ["Com barulho", "Livre Texto", "20294"], ["Mau cheiro", "Livre Texto", "20295"], ["Congelando", "Livre Texto", "20296"], ["N\xE3o desliga", "Livre Texto", "20297"], ["Preventiva", "Digitar KM atual", "20298"], ["Outros", "Livre Texto", "20366"]], "Compressor do Ar-Condicionado": [["N\xE3o aciona", "Livre Texto", "20299"], ["Travado", "Livre Texto", "20300"], ["Com barulho", "Livre Texto", "20301"], ["Vazando", "Livre Texto", "20302"], ["Baixa compress\xE3o", "Livre Texto", "20303"], ["Danificado", "Livre Texto", "20304"]], "Embreagem do Compressor": [["N\xE3o acopla", "Livre Texto", "20305"], ["N\xE3o desacopla", "Livre Texto", "20306"], ["Patinando", "Livre Texto", "20307"], ["Com barulho", "Livre Texto", "20308"]], "Polia do Compressor": [["Com barulho", "Livre Texto", "20309"], ["Com folga", "Livre Texto", "20310"], ["Travada", "Livre Texto", "20311"]], "Correia do Compressor": [["Frouxa", "Livre Texto", "20312"], ["Patinando", "Livre Texto", "20313"], ["Desgastada", "Livre Texto", "20314"], ["Arrebentada", "Livre Texto", "20315"]], Condensador: [["Vazando", "Livre Texto", "20316"], ["Obstru\xEDdo", "Livre Texto", "20317"], ["Danificado", "Livre Texto", "20318"]], Evaporador: [["Vazando", "Livre Texto", "20319"], ["Congelando", "Livre Texto", "20320"], ["Obstru\xEDdo", "Livre Texto", "20321"], ["Danificado", "Livre Texto", "20322"]], "Filtro de Cabine": [["Sujo", "Livre Texto", "20323"], ["Saturado", "Livre Texto", "20324"], ["Preventiva", "Digitar KM atual", "20325"]], "Ventilador Interno": [["N\xE3o funciona", "Livre Texto", "20326"], ["Funciona somente uma velocidade", "Livre Texto", "20327"], ["Fraco", "Livre Texto", "20328"], ["Com barulho", "Livre Texto", "20329"], ["Travado", "Livre Texto", "20330"]], "Motor do Ventilador": [["N\xE3o funciona", "Livre Texto", "20331"], ["Intermitente", "Livre Texto", "20332"], ["Queimado", "Livre Texto", "20333"]], "Resist\xEAncia do Ventilador": [["N\xE3o funciona", "Livre Texto", "20334"], ["Queimada", "Livre Texto", "20335"]], "Comando do Ar-Condicionado": [["N\xE3o funciona", "Livre Texto", "20336"], ["Intermitente", "Livre Texto", "20337"], ["N\xE3o regula temperatura", "Livre Texto", "20338"], ["N\xE3o altera ventila\xE7\xE3o", "Livre Texto", "20339"]], "Sensor de Temperatura": [["Com falha", "Livre Texto", "20340"], ["Leitura incorreta", "Livre Texto", "20341"]], Pressostato: [["Com falha", "Livre Texto", "20342"], ["N\xE3o atua", "Livre Texto", "20343"]], "V\xE1lvula de Expans\xE3o": [["Travada", "Livre Texto", "20344"], ["Obstru\xEDda", "Livre Texto", "20345"], ["Com falha", "Livre Texto", "20346"]], "Filtro Secador": [["Saturado", "Livre Texto", "20347"], ["Obstru\xEDdo", "Livre Texto", "20348"]], "Tubula\xE7\xE3o do Ar-Condicionado": [["Vazando", "Informar local", "20349"], ["Furada", "Informar local", "20350"], ["Danificada", "Informar local", "20351"]], "Mangueira do Ar-Condicionado": [["Vazando", "Informar local", "20352"], ["Ressecada", "Informar local", "20353"], ["Rompida", "Informar local", "20354"]], "Conex\xE3o do Ar-Condicionado": [["Vazando", "Informar local", "20355"]], "G\xE1s Refrigerante": [["Carga baixa", "Livre Texto", "20356"], ["Sem carga", "Livre Texto", "20357"]], "Dreno do Ar-Condicionado": [["Entupido", "Livre Texto", "20358"], ["Vazando na cabine", "Livre Texto", "20359"]], "Chicote do Ar-Condicionado": [["Mau contato", "Informar local", "20360"], ["Rompido", "Informar local", "20361"], ["Curto-circuito", "Informar local", "20362"]], "Rel\xE9 do Ar-Condicionado": [["N\xE3o funciona", "Livre Texto", "20363"], ["Intermitente", "Livre Texto", "20364"]], "Fus\xEDvel do Ar-Condicionado": [["Queimado", "Livre Texto", "20365"]], "Correia do Motor": [["Arrebentada", "Livre Texto", "20367"], ["Desgastada", "Livre Texto", "20368"], ["Ressecada", "Livre Texto", "20369"], ["Trincada", "Livre Texto", "20370"], ["Desfiando", "Livre Texto", "20371"], ["Frouxa", "Livre Texto", "20372"], ["Patinando", "Livre Texto", "20373"], ["Desalinhada", "Livre Texto", "20374"], ["Saindo da polia", "Livre Texto", "20375"], ["Com ru\xEDdo", "Livre Texto", "20376"], ["Contaminada com \xF3leo", "Livre Texto", "20377"], ["Preventiva", "Digitar KM atual", "20378"]], "Tensor da Correia do Motor": [["Com folga", "Livre Texto", "20379"], ["Travado", "Livre Texto", "20380"], ["Sem tens\xE3o", "Livre Texto", "20381"], ["Com barulho", "Livre Texto", "20382"], ["Desalinhado", "Livre Texto", "20383"], ["Danificado", "Livre Texto", "20384"]], "Polia Guia da Correia do Motor": [["Com barulho", "Livre Texto", "20385"], ["Com folga", "Livre Texto", "20386"], ["Travada", "Livre Texto", "20387"], ["Desalinhada", "Livre Texto", "20388"], ["Danificada", "Livre Texto", "20389"]], "Rolamento da Polia do Motor": [["Com barulho", "Livre Texto", "20390"], ["Com folga", "Livre Texto", "20391"], ["Travado", "Livre Texto", "20392"], ["Danificado", "Livre Texto", "20393"]], "Tensor da Correia do Alternador": [["Com folga", "Livre Texto", "20405"], ["Travado", "Livre Texto", "20406"], ["Sem tens\xE3o", "Livre Texto", "20407"], ["Com barulho", "Livre Texto", "20408"], ["Danificado", "Livre Texto", "20409"]], "Rolamento da Polia do Alternador": [["Com barulho", "Livre Texto", "20415"], ["Com folga", "Livre Texto", "20416"], ["Travado", "Livre Texto", "20417"], ["Danificado", "Livre Texto", "20418"]], "Correia do Ar-Condicionado": [["Arrebentada", "Livre Texto", "20419"], ["Desgastada", "Livre Texto", "20420"], ["Ressecada", "Livre Texto", "20421"], ["Trincada", "Livre Texto", "20422"], ["Desfiando", "Livre Texto", "20423"], ["Frouxa", "Livre Texto", "20424"], ["Patinando", "Livre Texto", "20425"], ["Desalinhada", "Livre Texto", "20426"], ["Saindo da polia", "Livre Texto", "20427"], ["Com ru\xEDdo", "Livre Texto", "20428"], ["Preventiva", "Digitar KM atual", "20429"]], "Tensor da Correia do Ar-Condicionado": [["Com folga", "Livre Texto", "20430"], ["Travado", "Livre Texto", "20431"], ["Sem tens\xE3o", "Livre Texto", "20432"], ["Com barulho", "Livre Texto", "20433"], ["Danificado", "Livre Texto", "20434"]], "Polia do Ar-Condicionado": [["Com barulho", "Livre Texto", "20435"], ["Com folga", "Livre Texto", "20436"], ["Travada", "Livre Texto", "20437"], ["Desalinhada", "Livre Texto", "20438"], ["Danificada", "Livre Texto", "20439"]], "Rolamento da Polia do Ar-Condicionado": [["Com barulho", "Livre Texto", "20440"], ["Com folga", "Livre Texto", "20441"], ["Travado", "Livre Texto", "20442"], ["Danificado", "Livre Texto", "20443"]], "Vidro El\xE9trico": [["N\xE3o funciona", "Informar lado", "20444"], ["N\xE3o sobe", "Informar lado", "20445"], ["N\xE3o desce", "Informar lado", "20446"], ["Sobe lentamente", "Informar lado", "20447"], ["Desce lentamente", "Informar lado", "20448"], ["Funcionamento intermitente", "Informar lado", "20449"], ["Travando", "Informar lado", "20450"], ["N\xE3o fecha totalmente", "Informar lado", "20451"], ["N\xE3o abre totalmente", "Informar lado", "20452"], ["Desalinhado", "Informar lado", "20453"], ["Com barulho", "Informar lado", "20454"]], "Motor do Vidro": [["N\xE3o funciona", "Informar lado", "20455"], ["Fraco", "Informar lado", "20456"], ["Funcionamento intermitente", "Informar lado", "20457"], ["Travado", "Informar lado", "20458"], ["Com barulho", "Informar lado", "20459"], ["Queimado", "Informar lado", "20460"]], "M\xE1quina do Vidro": [["Travando", "Informar lado", "20461"], ["Com folga", "Informar lado", "20462"], ["Cabo rompido", "Informar lado", "20463"], ["Quebrada", "Informar lado", "20464"], ["Danificada", "Informar lado", "20465"]], "Bot\xE3o do Vidro": [["N\xE3o funciona", "Informar lado", "20466"], ["Mau contato", "Informar lado", "20467"], ["Travado", "Informar lado", "20468"], ["Funcionamento intermitente", "Informar lado", "20469"], ["Danificado", "Informar lado", "20470"]], "Comando Central dos Vidros": [["N\xE3o funciona", "Livre Texto", "20471"], ["Mau contato", "Livre Texto", "20472"], ["Funcionamento intermitente", "Livre Texto", "20473"], ["Danificado", "Livre Texto", "20474"]], "Chicote do Vidro": [["Mau contato", "Informar lado", "20475"], ["Rompido", "Informar lado", "20476"], ["Curto-circuito", "Informar lado", "20477"], ["Danificado", "Informar lado", "20478"]], "Conector do Vidro": [["Mau contato", "Informar lado", "20479"], ["Oxidado", "Informar lado", "20480"], ["Danificado", "Informar lado", "20481"]], "Fus\xEDvel do Vidro El\xE9trico": [["Queimado", "Livre Texto", "20482"]], "Rel\xE9 do Vidro El\xE9trico": [["N\xE3o funciona", "Livre Texto", "20483"], ["Intermitente", "Livre Texto", "20484"]], "Canaleta do Vidro": [["Travando", "Informar lado", "20485"], ["Desalinhada", "Informar lado", "20486"], ["Danificada", "Informar lado", "20487"]], "Painel de Instrumentos": [["N\xE3o funciona", "Livre Texto", "20488"], ["N\xE3o liga", "Livre Texto", "20489"], ["Desliga sozinho", "Livre Texto", "20490"], ["Funcionamento intermitente", "Livre Texto", "20491"], ["Travado", "Livre Texto", "20492"], ["Reiniciando", "Livre Texto", "20493"], ["Falha de comunica\xE7\xE3o", "Informar mensagem", "20494"], ["Mensagem de falha", "Informar mensagem", "20495"], ["Ilumina\xE7\xE3o n\xE3o funciona", "Livre Texto", "20496"], ["Ilumina\xE7\xE3o fraca", "Livre Texto", "20497"], ["Ilumina\xE7\xE3o intermitente", "Livre Texto", "20498"], ["Outros", "Livre Texto", "20549"]], "Display do Painel": [["N\xE3o funciona", "Livre Texto", "20499"], ["Apagado", "Livre Texto", "20500"], ["Falhando", "Livre Texto", "20501"], ["Imagem incompleta", "Livre Texto", "20502"], ["Danificado", "Livre Texto", "20503"]], Veloc\u00EDmetro: [["N\xE3o funciona", "Livre Texto", "20504"], ["Marca\xE7\xE3o incorreta", "Livre Texto", "20505"], ["Funcionamento intermitente", "Livre Texto", "20506"]], "Conta-Giros": [["N\xE3o funciona", "Livre Texto", "20507"], ["Marca\xE7\xE3o incorreta", "Livre Texto", "20508"], ["Funcionamento intermitente", "Livre Texto", "20509"]], Hod\u00F4metro: [["N\xE3o funciona", "Livre Texto", "20510"], ["N\xE3o registra KM", "Livre Texto", "20511"], ["Marca\xE7\xE3o incorreta", "Informar KM", "20512"], ["Display apagado", "Livre Texto", "20513"]], "Marcador de Combust\xEDvel": [["N\xE3o funciona", "Livre Texto", "20514"], ["Marca\xE7\xE3o incorreta", "Livre Texto", "20515"], ["Travado", "Livre Texto", "20516"], ["Oscilando", "Livre Texto", "20517"]], "Marcador de Temperatura": [["N\xE3o funciona", "Livre Texto", "20518"], ["Marca\xE7\xE3o incorreta", "Livre Texto", "20519"], ["Travado", "Livre Texto", "20520"], ["Oscilando", "Livre Texto", "20521"]], "Marcador de Press\xE3o de \xD3leo": [["N\xE3o funciona", "Livre Texto", "20522"], ["Marca\xE7\xE3o incorreta", "Livre Texto", "20523"]], "Marcador de Press\xE3o de Ar": [["N\xE3o funciona", "Livre Texto", "20524"], ["Marca\xE7\xE3o incorreta", "Informar circuito", "20525"], ["Travado", "Informar circuito", "20526"]], "Luz de Advert\xEAncia": [["N\xE3o acende", "Informar qual", "20527"], ["Permanece acesa", "Informar qual", "20528"], ["Acende intermitente", "Informar qual", "20529"]], "Alarme Sonoro do Painel": [["N\xE3o funciona", "Livre Texto", "20530"], ["Permanece acionado", "Livre Texto", "20531"], ["Acionamento indevido", "Livre Texto", "20532"]], "Bot\xE3o do Painel": [["N\xE3o funciona", "Informar qual", "20533"], ["Travado", "Informar qual", "20534"], ["Danificado", "Informar qual", "20535"]], "Chicote do Painel": [["Mau contato", "Informar local", "20536"], ["Rompido", "Informar local", "20537"], ["Curto-circuito", "Informar local", "20538"], ["Danificado", "Informar local", "20539"]], "Conector do Painel": [["Mau contato", "Informar local", "20540"], ["Oxidado", "Informar local", "20541"], ["Danificado", "Informar local", "20542"]], "Alimenta\xE7\xE3o do Painel": [["Sem alimenta\xE7\xE3o", "Livre Texto", "20543"], ["Baixa tens\xE3o", "Informar tens\xE3o", "20544"], ["Intermitente", "Livre Texto", "20545"]], "Comunica\xE7\xE3o CAN do Painel": [["Sem comunica\xE7\xE3o", "Informar c\xF3digo", "20546"], ["Falha intermitente", "Informar c\xF3digo", "20547"], ["Erro de comunica\xE7\xE3o", "Informar c\xF3digo", "20548"]], Interclima: [["N\xE3o funciona", "Livre Texto", "20550"], ["N\xE3o liga", "Livre Texto", "20551"], ["N\xE3o desliga", "Livre Texto", "20552"], ["Funcionamento intermitente", "Livre Texto", "20553"], ["Ventila\xE7\xE3o fraca", "Livre Texto", "20554"], ["N\xE3o ventila", "Livre Texto", "20555"], ["N\xE3o climatiza", "Livre Texto", "20556"], ["Baixo rendimento", "Livre Texto", "20557"], ["Com barulho", "Livre Texto", "20558"], ["Vibra\xE7\xE3o excessiva", "Livre Texto", "20559"], ["Vazando \xE1gua", "Informar local", "20560"], ["Mau cheiro", "Livre Texto", "20561"], ["Preventiva", "Digitar KM atual", "20562"], ["Outros", "Livre Texto", "20622"]], "Motor do Interclima": [["N\xE3o funciona", "Livre Texto", "20563"], ["Fraco", "Livre Texto", "20564"], ["Intermitente", "Livre Texto", "20565"], ["Travado", "Livre Texto", "20566"], ["Com barulho", "Livre Texto", "20567"], ["Queimado", "Livre Texto", "20568"]], "Ventilador do Interclima": [["N\xE3o funciona", "Livre Texto", "20569"], ["Fraco", "Livre Texto", "20570"], ["Com barulho", "Livre Texto", "20571"], ["Travado", "Livre Texto", "20572"]], "H\xE9lice do Interclima": [["Quebrada", "Livre Texto", "20573"], ["Solta", "Livre Texto", "20574"], ["Desbalanceada", "Livre Texto", "20575"]], "Bomba d'\xC1gua do Interclima": [["N\xE3o funciona", "Livre Texto", "20576"], ["Fraca", "Livre Texto", "20577"], ["Travada", "Livre Texto", "20578"], ["Vazando", "Livre Texto", "20579"], ["Com barulho", "Livre Texto", "20580"]], "Reservat\xF3rio do Interclima": [["Vazando", "Livre Texto", "20581"], ["Trincado", "Livre Texto", "20582"], ["Quebrado", "Livre Texto", "20583"], ["N\xE3o abastece", "Livre Texto", "20584"]], "Sensor de N\xEDvel": [["N\xE3o funciona", "Livre Texto", "20585"], ["Marca\xE7\xE3o incorreta", "Livre Texto", "20586"], ["Com falha", "Livre Texto", "20587"]], "Boia do Reservat\xF3rio": [["Travada", "Livre Texto", "20588"], ["Danificada", "Livre Texto", "20589"]], "Mangueira do Interclima": [["Vazando", "Informar local", "20590"], ["Rompida", "Informar local", "20591"], ["Desconectada", "Informar local", "20592"], ["Entupida", "Informar local", "20593"]], "Bico/Esguicho do Interclima": [["Entupido", "Informar posi\xE7\xE3o", "20594"], ["N\xE3o funciona", "Informar posi\xE7\xE3o", "20595"], ["Vazando", "Informar posi\xE7\xE3o", "20596"]], "Filtro do Interclima": [["Sujo", "Livre Texto", "20597"], ["Saturado", "Livre Texto", "20598"], ["Preventiva", "Digitar KM atual", "20599"]], "Painel/Comando do Interclima": [["N\xE3o funciona", "Livre Texto", "20600"], ["N\xE3o liga", "Livre Texto", "20601"], ["Travado", "Livre Texto", "20602"], ["Intermitente", "Livre Texto", "20603"], ["Display apagado", "Livre Texto", "20604"], ["Danificado", "Livre Texto", "20605"]], "Chicote do Interclima": [["Mau contato", "Informar local", "20606"], ["Rompido", "Informar local", "20607"], ["Curto-circuito", "Informar local", "20608"], ["Danificado", "Informar local", "20609"]], "Conector do Interclima": [["Mau contato", "Informar local", "20610"], ["Oxidado", "Informar local", "20611"], ["Danificado", "Informar local", "20612"]], "Rel\xE9 do Interclima": [["N\xE3o funciona", "Livre Texto", "20613"], ["Intermitente", "Livre Texto", "20614"], ["Queimado", "Livre Texto", "20615"]], "Fus\xEDvel do Interclima": [["Queimado", "Livre Texto", "20616"]], "Alimenta\xE7\xE3o do Interclima": [["Sem alimenta\xE7\xE3o", "Livre Texto", "20617"], ["Baixa tens\xE3o", "Informar tens\xE3o", "20618"], ["Intermitente", "Livre Texto", "20619"]], "Dreno do Interclima": [["Entupido", "Livre Texto", "20620"], ["Vazando", "Informar local", "20621"]], "Chicote El\xE9trico": [["Mau contato", "Informar local", "20623"], ["Rompido", "Informar local", "20624"], ["Curto-circuito", "Informar local", "20625"], ["Fio partido", "Informar local", "20626"], ["Fio desencapado", "Informar local", "20627"], ["Queimado", "Informar local", "20628"], ["Derretido", "Informar local", "20629"], ["Ressecado", "Informar local", "20630"], ["Oxidado", "Informar local", "20631"], ["Com atrito", "Informar local", "20632"], ["Danificado", "Informar local", "20633"], ["Adapta\xE7\xE3o irregular", "Informar local", "20634"], ["Emenda irregular", "Informar local", "20635"], ["Umidade/Infiltra\xE7\xE3o", "Informar local", "20636"], ["Outros", "Livre Texto", "20688"]], "Chicote do Motor": [["Mau contato", "Informar local", "20637"], ["Rompido", "Informar local", "20638"], ["Curto-circuito", "Informar local", "20639"], ["Queimado", "Informar local", "20640"], ["Danificado", "Informar local", "20641"]], "Chicote da Cabine": [["Mau contato", "Informar local", "20642"], ["Rompido", "Informar local", "20643"], ["Curto-circuito", "Informar local", "20644"], ["Queimado", "Informar local", "20645"], ["Danificado", "Informar local", "20646"]], "Chicote do Chassi": [["Mau contato", "Informar local", "20647"], ["Rompido", "Informar local", "20648"], ["Curto-circuito", "Informar local", "20649"], ["Fio desencapado", "Informar local", "20650"], ["Com atrito", "Informar local", "20651"], ["Danificado", "Informar local", "20652"]], "Chicote da Transmiss\xE3o": [["Mau contato", "Informar local", "20653"], ["Rompido", "Informar local", "20654"], ["Curto-circuito", "Informar local", "20655"], ["Danificado", "Informar local", "20656"]], "Chicote do Sistema ARLA": [["Mau contato", "Informar local", "20657"], ["Rompido", "Informar local", "20658"], ["Curto-circuito", "Informar local", "20659"], ["Oxidado", "Informar local", "20660"], ["Danificado", "Informar local", "20661"]], "Chicote dos Sensores": [["Mau contato", "Informar sensor", "20662"], ["Rompido", "Informar sensor", "20663"], ["Curto-circuito", "Informar sensor", "20664"], ["Danificado", "Informar sensor", "20665"]], "Chicote das Lanternas": [["Mau contato", "Informar posi\xE7\xE3o", "20666"], ["Rompido", "Informar posi\xE7\xE3o", "20667"], ["Curto-circuito", "Informar posi\xE7\xE3o", "20668"], ["Danificado", "Informar posi\xE7\xE3o", "20669"]], "Chicote da Carreta": [["Mau contato", "Informar local", "20670"], ["Rompido", "Informar local", "20671"], ["Curto-circuito", "Informar local", "20672"], ["Fio desencapado", "Informar local", "20673"], ["Oxidado", "Informar local", "20674"], ["Danificado", "Informar local", "20675"]], "Tomada El\xE9trica da Carreta": [["Mau contato", "Livre Texto", "20676"], ["Oxidada", "Livre Texto", "20677"], ["Quebrada", "Livre Texto", "20678"], ["Curto-circuito", "Livre Texto", "20679"]], "Plug El\xE9trico da Carreta": [["Mau contato", "Livre Texto", "20680"], ["Oxidado", "Livre Texto", "20681"], ["Quebrado", "Livre Texto", "20682"]], "Conector El\xE9trico": [["Mau contato", "Informar local", "20683"], ["Oxidado", "Informar local", "20684"], ["Quebrado", "Informar local", "20685"], ["Queimado", "Informar local", "20686"], ["Danificado", "Informar local", "20687"]], Tac\u00F3grafo: [["N\xE3o funciona", "Livre Texto", "20689"], ["N\xE3o liga", "Livre Texto", "20690"], ["Desliga sozinho", "Livre Texto", "20691"], ["Funcionamento intermitente", "Livre Texto", "20692"], ["Reiniciando", "Livre Texto", "20693"], ["Sem alimenta\xE7\xE3o", "Livre Texto", "20694"], ["N\xE3o registra velocidade", "Livre Texto", "20695"], ["Registra velocidade incorreta", "Livre Texto", "20696"], ["N\xE3o registra dist\xE2ncia", "Livre Texto", "20697"], ["Registra dist\xE2ncia incorreta", "Livre Texto", "20698"], ["N\xE3o registra tempo", "Livre Texto", "20699"], ["Data/Hora incorreta", "Livre Texto", "20700"], ["Display apagado", "Livre Texto", "20701"], ["Display com falha", "Livre Texto", "20702"], ["Teclas n\xE3o funcionam", "Livre Texto", "20703"], ["Com mensagem de erro", "Informar mensagem", "20704"], ["Danificado", "Livre Texto", "20705"], ["Preventiva", "Digitar KM atual", "20706"], ["Necessita aferi\xE7\xE3o", "Informar KM atual", "20727"], ["Aferi\xE7\xE3o vencida", "Informar vencimento", "20728"], ["Outros", "Livre Texto", "20729"]], "Sensor do Tac\xF3grafo": [["N\xE3o funciona", "Livre Texto", "20707"], ["Sem sinal", "Livre Texto", "20708"], ["Sinal intermitente", "Livre Texto", "20709"], ["Leitura incorreta", "Livre Texto", "20710"], ["Danificado", "Livre Texto", "20711"]], "Chicote do Tac\xF3grafo": [["Mau contato", "Informar local", "20712"], ["Rompido", "Informar local", "20713"], ["Curto-circuito", "Informar local", "20714"], ["Danificado", "Informar local", "20715"]], "Conector do Tac\xF3grafo": [["Mau contato", "Informar local", "20716"], ["Oxidado", "Informar local", "20717"], ["Danificado", "Informar local", "20718"]], "Alimenta\xE7\xE3o do Tac\xF3grafo": [["Sem alimenta\xE7\xE3o", "Livre Texto", "20719"], ["Baixa tens\xE3o", "Informar tens\xE3o", "20720"], ["Intermitente", "Livre Texto", "20721"]], "Fus\xEDvel do Tac\xF3grafo": [["Queimado", "Livre Texto", "20722"], ["Mau contato", "Livre Texto", "20723"]], "Lacre do Tac\xF3grafo": [["Rompido", "Livre Texto", "20724"], ["Ausente", "Livre Texto", "20725"], ["Danificado", "Livre Texto", "20726"]], "Disco do Tac\xF3grafo": [["N\xE3o registra", "Livre Texto", "20730"], ["Registro incompleto", "Livre Texto", "20731"], ["Registro ileg\xEDvel", "Livre Texto", "20732"], ["Registro incorreto", "Livre Texto", "20733"], ["N\xE3o gira", "Livre Texto", "20734"], ["Travado", "Livre Texto", "20735"], ["Danificado", "Livre Texto", "20736"], ["Ausente", "Livre Texto", "20737"], ["Necessita substitui\xE7\xE3o", "Livre Texto", "20738"]], "Mecanismo do Disco": [["N\xE3o funciona", "Livre Texto", "20739"], ["Travado", "Livre Texto", "20740"], ["N\xE3o movimenta o disco", "Livre Texto", "20741"], ["Danificado", "Livre Texto", "20742"]], "Agulha do Tac\xF3grafo": [["N\xE3o registra", "Informar fun\xE7\xE3o", "20743"], ["Registro incorreto", "Informar fun\xE7\xE3o", "20744"], ["Danificada", "Informar fun\xE7\xE3o", "20745"]], "Sistema ABS": [["N\xE3o funciona", "Livre Texto", "20746"], ["Com falha", "Informar c\xF3digo", "20747"], ["Falha intermitente", "Informar c\xF3digo", "20748"], ["Sem comunica\xE7\xE3o", "Informar c\xF3digo", "20749"], ["Falha de comunica\xE7\xE3o CAN", "Informar c\xF3digo", "20750"], ["Atua\xE7\xE3o irregular", "Livre Texto", "20751"], ["Atua indevidamente", "Livre Texto", "20752"], ["N\xE3o atua", "Livre Texto", "20753"]], "Luz do ABS": [["Acesa", "Informar c\xF3digo", "20754"], ["Intermitente", "Informar c\xF3digo", "20755"], ["N\xE3o apaga", "Informar c\xF3digo", "20756"], ["N\xE3o acende no autoteste", "Livre Texto", "20757"]], "M\xF3dulo ABS": [["Com falha", "Informar c\xF3digo", "20758"], ["Sem comunica\xE7\xE3o", "Informar c\xF3digo", "20759"], ["Falha intermitente", "Informar c\xF3digo", "20760"], ["Sem alimenta\xE7\xE3o", "Livre Texto", "20761"], ["Curto-circuito", "Informar c\xF3digo", "20762"], ["Danificado", "Livre Texto", "20763"]], "Sensor ABS": [["Com falha", "Informar roda/eixo", "20764"], ["Sem sinal", "Informar roda/eixo", "20765"], ["Sinal intermitente", "Informar roda/eixo", "20766"], ["Leitura incorreta", "Informar roda/eixo", "20767"], ["Fora de posi\xE7\xE3o", "Informar roda/eixo", "20768"], ["Dist\xE2ncia incorreta", "Informar roda/eixo", "20769"], ["Sujo", "Informar roda/eixo", "20770"], ["Danificado", "Informar roda/eixo", "20771"]], "Cabo do Sensor ABS": [["Rompido", "Informar roda/eixo", "20772"], ["Mau contato", "Informar roda/eixo", "20773"], ["Curto-circuito", "Informar roda/eixo", "20774"], ["Com atrito", "Informar roda/eixo", "20775"], ["Danificado", "Informar roda/eixo", "20776"]], "Conector do Sensor ABS": [["Mau contato", "Informar roda/eixo", "20777"], ["Oxidado", "Informar roda/eixo", "20778"], ["Quebrado", "Informar roda/eixo", "20779"], ["Danificado", "Informar roda/eixo", "20780"]] } } }, FUN: { nome: "Funilaria", sistemas: { Funilaria: { "Vidro da Porta": [["Quebrado", "Informar lado", "30.01"], ["Trincado", "Informar lado", "30.02"], ["Riscado", "Informar lado", "30.03"], ["Solto", "Informar lado", "30.04"], ["Desalinhado", "Informar lado", "30.05"], ["Travando", "Informar lado", "30.06"], ["N\xE3o sobe", "Informar lado", "30.07"], ["N\xE3o desce", "Informar lado", "30.08"], ["N\xE3o fecha totalmente", "Informar lado", "30.09"], ["N\xE3o abre totalmente", "Informar lado", "30.10"], ["Com infiltra\xE7\xE3o", "Informar lado", "30.11"], ["Com ru\xEDdo", "Informar lado", "30.12"]], "Canaleta do Vidro": [["Solta", "Informar lado", "30.13"], ["Desalinhada", "Informar lado", "30.14"], ["Ressecada", "Informar lado", "30.15"], ["Danificada", "Informar lado", "30.16"]], "Borracha do Vidro": [["Solta", "Informar lado", "30.17"], ["Ressecada", "Informar lado", "30.18"], ["Rasgada", "Informar lado", "30.19"], ["Infiltrando \xE1gua", "Informar lado", "30.20"], ["Danificada", "Informar lado", "30.21"]], "Para-brisa": [["Quebrado", "Livre Texto", "30.22"], ["Trincado", "Informar posi\xE7\xE3o", "30.23"], ["Riscado", "Informar posi\xE7\xE3o", "30.24"], ["Lascado", "Informar posi\xE7\xE3o", "30.25"], ["Picotado", "Informar posi\xE7\xE3o", "30.26"], ["Com infiltra\xE7\xE3o", "Informar posi\xE7\xE3o", "30.27"], ["Solto", "Livre Texto", "30.28"], ["Descolando", "Informar posi\xE7\xE3o", "30.29"], ["Desalinhado", "Livre Texto", "30.30"], ["Com veda\xE7\xE3o deficiente", "Informar posi\xE7\xE3o", "30.31"], ["Visibilidade comprometida", "Informar motivo", "30.32"], ["Danificado", "Livre Texto", "30.33"]], "Borracha do Para-brisa": [["Solta", "Informar posi\xE7\xE3o", "30.34"], ["Ressecada", "Informar posi\xE7\xE3o", "30.35"], ["Rasgada", "Informar posi\xE7\xE3o", "30.36"], ["Deformada", "Informar posi\xE7\xE3o", "30.37"], ["Infiltrando \xE1gua", "Informar posi\xE7\xE3o", "30.38"], ["Danificada", "Informar posi\xE7\xE3o", "30.39"]], "Moldura do Para-brisa": [["Solta", "Informar posi\xE7\xE3o", "30.40"], ["Quebrada", "Informar posi\xE7\xE3o", "30.41"], ["Desalinhada", "Informar posi\xE7\xE3o", "30.42"], ["Danificada", "Informar posi\xE7\xE3o", "30.43"]], "Colagem do Para-brisa": [["Descolando", "Informar posi\xE7\xE3o", "30.44"], ["Infiltrando \xE1gua", "Informar posi\xE7\xE3o", "30.45"], ["Veda\xE7\xE3o irregular", "Informar posi\xE7\xE3o", "30.46"]], "Banco do Motorista": [["Solto", "Livre Texto", "30.47"], ["Com folga", "Livre Texto", "30.48"], ["Quebrado", "Livre Texto", "30.49"], ["Desalinhado", "Livre Texto", "30.50"], ["Com barulho", "Livre Texto", "30.51"], ["N\xE3o regula", "Informar regulagem", "30.52"], ["Travado", "Livre Texto", "30.53"], ["N\xE3o trava na posi\xE7\xE3o", "Livre Texto", "30.54"], ["Danificado", "Livre Texto", "30.55"]], "Estofamento do Banco": [["Rasgado", "Informar local", "30.56"], ["Furado", "Informar local", "30.57"], ["Desgastado", "Informar local", "30.58"], ["Solto", "Informar local", "30.59"], ["Rasgado", "Informar local", "30117"], ["Furado", "Informar local", "30118"], ["Desgastado", "Informar local", "30119"], ["Solto", "Informar local", "30120"]], "Espuma do Banco": [["Deformada", "Informar local", "30.60"], ["Afundada", "Informar local", "30.61"], ["Danificada", "Informar local", "30.62"], ["Deformada", "Informar local", "30121"], ["Afundada", "Informar local", "30122"], ["Danificada", "Informar local", "30123"]], "Encosto do Banco": [["N\xE3o regula", "Livre Texto", "30.63"], ["N\xE3o trava", "Livre Texto", "30.64"], ["Com folga", "Livre Texto", "30.65"], ["Quebrado", "Livre Texto", "30.66"], ["N\xE3o regula", "Livre Texto", "30124"], ["N\xE3o trava", "Livre Texto", "30125"], ["Com folga", "Livre Texto", "30126"], ["Quebrado", "Livre Texto", "30127"]], "Apoio de Cabe\xE7a": [["N\xE3o regula", "Livre Texto", "30.67"], ["Solto", "Livre Texto", "30.68"], ["Quebrado", "Livre Texto", "30.69"], ["N\xE3o regula", "Livre Texto", "30128"], ["Solto", "Livre Texto", "30129"], ["Quebrado", "Livre Texto", "30130"]], "Apoio de Bra\xE7o": [["Solto", "Informar lado", "30.70"], ["N\xE3o trava", "Informar lado", "30.71"], ["Quebrado", "Informar lado", "30.72"], ["Solto", "Informar lado", "30131"], ["N\xE3o trava", "Informar lado", "30132"], ["Quebrado", "Informar lado", "30133"]], "Trilho do Banco": [["Travado", "Livre Texto", "30.73"], ["Com folga", "Livre Texto", "30.74"], ["N\xE3o trava", "Livre Texto", "30.75"], ["Danificado", "Livre Texto", "30.76"], ["Travado", "Livre Texto", "30134"], ["Com folga", "Livre Texto", "30135"], ["N\xE3o trava", "Livre Texto", "30136"], ["Danificado", "Livre Texto", "30137"]], "Base do Banco": [["Solta", "Livre Texto", "30.77"], ["Trincada", "Livre Texto", "30.78"], ["Quebrada", "Livre Texto", "30.79"], ["Danificada", "Livre Texto", "30.80"], ["Solta", "Livre Texto", "30138"], ["Trincada", "Livre Texto", "30139"], ["Quebrada", "Livre Texto", "30140"], ["Danificada", "Livre Texto", "30141"]], "Suspens\xE3o do Banco": [["N\xE3o funciona", "Livre Texto", "30.81"], ["Travada", "Livre Texto", "30.82"], ["Sem amortecimento", "Livre Texto", "30.83"], ["Batendo fim de curso", "Livre Texto", "30.84"], ["Com folga", "Livre Texto", "30.85"], ["Danificada", "Livre Texto", "30.86"], ["N\xE3o funciona", "Livre Texto", "30142"], ["Travada", "Livre Texto", "30143"], ["Sem amortecimento", "Livre Texto", "30144"], ["Batendo fim de curso", "Livre Texto", "30145"], ["Com folga", "Livre Texto", "30146"], ["Danificada", "Livre Texto", "30147"]], "Sistema Pneum\xE1tico do Banco": [["N\xE3o funciona", "Livre Texto", "30.87"], ["N\xE3o sobe", "Livre Texto", "30.88"], ["N\xE3o desce", "Livre Texto", "30.89"], ["Perde altura", "Livre Texto", "30.90"], ["Vazando ar", "Informar local", "30.91"], ["N\xE3o funciona", "Livre Texto", "30148"], ["N\xE3o sobe", "Livre Texto", "30149"], ["N\xE3o desce", "Livre Texto", "30150"], ["Perde altura", "Livre Texto", "30151"], ["Vazando ar", "Informar local", "30152"]], "Bolsa de Ar do Banco": [["Vazando", "Livre Texto", "30.92"], ["Furada", "Livre Texto", "30.93"], ["Danificada", "Livre Texto", "30.94"], ["Vazando", "Livre Texto", "30153"], ["Furada", "Livre Texto", "30154"], ["Danificada", "Livre Texto", "30155"]], "V\xE1lvula do Banco": [["Vazando ar", "Livre Texto", "30.95"], ["Travada", "Livre Texto", "30.96"], ["N\xE3o regula altura", "Livre Texto", "30.97"], ["Vazando ar", "Livre Texto", "30156"], ["Travada", "Livre Texto", "30157"], ["N\xE3o regula altura", "Livre Texto", "30158"]], "Comando de Regulagem do Banco": [["N\xE3o funciona", "Informar fun\xE7\xE3o", "30.98"], ["Travado", "Informar fun\xE7\xE3o", "30.99"], ["Quebrado", "Informar fun\xE7\xE3o", "30100"], ["N\xE3o funciona", "Informar fun\xE7\xE3o", "30159"], ["Travado", "Informar fun\xE7\xE3o", "30160"], ["Quebrado", "Informar fun\xE7\xE3o", "30161"]], "Cinto do Banco do Motorista": [["N\xE3o trava", "Livre Texto", "30101"], ["N\xE3o retrai", "Livre Texto", "30102"], ["Travado", "Livre Texto", "30103"], ["Rasgado", "Livre Texto", "30104"]], "Fecho do Cinto": [["N\xE3o trava", "Livre Texto", "30105"], ["Travado", "Livre Texto", "30106"], ["Quebrado", "Livre Texto", "30107"], ["N\xE3o trava", "Livre Texto", "30166"], ["Travado", "Livre Texto", "30167"], ["Quebrado", "Livre Texto", "30168"]], "Banco do Passageiro": [["Solto", "Livre Texto", "30108"], ["Com folga", "Livre Texto", "30109"], ["Quebrado", "Livre Texto", "30110"], ["Desalinhado", "Livre Texto", "30111"], ["Com barulho", "Livre Texto", "30112"], ["N\xE3o regula", "Informar regulagem", "30113"], ["Travado", "Livre Texto", "30114"], ["N\xE3o trava na posi\xE7\xE3o", "Livre Texto", "30115"], ["Danificado", "Livre Texto", "30116"]], "Cinto do Passageiro": [["N\xE3o trava", "Livre Texto", "30162"], ["N\xE3o retrai", "Livre Texto", "30163"], ["Travado", "Livre Texto", "30164"], ["Rasgado", "Livre Texto", "30165"]], "Acabamento de Porta": [["Solto", "Informar lado", "30169"], ["Quebrado", "Informar lado", "30170"], ["Trincado", "Informar lado", "30171"], ["Desencaixado", "Informar lado", "30172"], ["Desalinhado", "Informar lado", "30173"], ["Com folga", "Informar lado", "30174"], ["Com barulho", "Informar lado", "30175"], ["Riscado", "Informar lado", "30176"], ["Desgastado", "Informar lado", "30177"], ["Danificado", "Informar lado", "30178"]], "Forro de Porta": [["Solto", "Informar lado", "30179"], ["Quebrado", "Informar lado", "30180"], ["Desencaixado", "Informar lado", "30181"], ["Rasgado", "Informar lado", "30182"], ["Danificado", "Informar lado", "30183"]], "Revestimento da Porta": [["Solto", "Informar lado", "30184"], ["Descolando", "Informar lado", "30185"], ["Rasgado", "Informar lado", "30186"], ["Desgastado", "Informar lado", "30187"], ["Danificado", "Informar lado", "30188"]], "Puxador Interno da Porta": [["Solto", "Informar lado", "30189"], ["Com folga", "Informar lado", "30190"], ["Quebrado", "Informar lado", "30191"], ["Danificado", "Informar lado", "30192"]], "Ma\xE7aneta Interna": [["Solta", "Informar lado", "30193"], ["Travada", "Informar lado", "30194"], ["Quebrada", "Informar lado", "30195"], ["N\xE3o abre a porta", "Informar lado", "30196"], ["N\xE3o funciona", "Informar lado", "30702"], ["Solta", "Informar lado", "30703"], ["Travada", "Informar lado", "30704"], ["Quebrada", "Informar lado", "30705"], ["Danificada", "Informar lado", "30706"]], "Apoio de Bra\xE7o da Porta": [["Solto", "Informar lado", "30197"], ["Quebrado", "Informar lado", "30198"], ["Danificado", "Informar lado", "30199"]], "Porta-Objetos da Porta": [["Solto", "Informar lado", "30200"], ["Trincado", "Informar lado", "30201"], ["Quebrado", "Informar lado", "30202"], ["Danificado", "Informar lado", "30203"]], "Presilha do Acabamento": [["Solta", "Informar lado", "30204"], ["Quebrada", "Informar lado", "30205"], ["Ausente", "Informar lado", "30206"]], "Borracha de Acabamento da Porta": [["Solta", "Informar lado", "30207"], ["Ressecada", "Informar lado", "30208"], ["Rasgada", "Informar lado", "30209"], ["Deformada", "Informar lado", "30210"], ["Danificada", "Informar lado", "30211"]], Al\u00E7ap\u00E3o: [["N\xE3o abre", "Livre Texto", "30212"], ["N\xE3o fecha", "Livre Texto", "30213"], ["Travado", "Livre Texto", "30214"], ["Com folga", "Livre Texto", "30215"], ["Solto", "Livre Texto", "30216"], ["Desalinhado", "Livre Texto", "30217"], ["Quebrado", "Livre Texto", "30218"], ["Trincado", "Livre Texto", "30219"], ["Amassado", "Livre Texto", "30220"], ["Com infiltra\xE7\xE3o", "Livre Texto", "30221"], ["Com barulho", "Livre Texto", "30222"], ["N\xE3o trava fechado", "Livre Texto", "30223"], ["Danificado", "Livre Texto", "30224"]], "Tampa do Al\xE7ap\xE3o": [["Solta", "Livre Texto", "30225"], ["Quebrada", "Livre Texto", "30226"], ["Trincada", "Livre Texto", "30227"], ["Empenada", "Livre Texto", "30228"], ["Danificada", "Livre Texto", "30229"]], "Fecho do Al\xE7ap\xE3o": [["N\xE3o trava", "Livre Texto", "30230"], ["Travado", "Livre Texto", "30231"], ["Solto", "Livre Texto", "30232"], ["Quebrado", "Livre Texto", "30233"], ["Danificado", "Livre Texto", "30234"]], "Dobradi\xE7a do Al\xE7ap\xE3o": [["Com folga", "Livre Texto", "30235"], ["Travada", "Livre Texto", "30236"], ["Quebrada", "Livre Texto", "30237"], ["Danificada", "Livre Texto", "30238"]], "Borracha do Al\xE7ap\xE3o": [["Solta", "Livre Texto", "30239"], ["Ressecada", "Livre Texto", "30240"], ["Rasgada", "Livre Texto", "30241"], ["Infiltrando \xE1gua", "Livre Texto", "30242"], ["Danificada", "Livre Texto", "30243"]], "Mola/Amortecedor do Al\xE7ap\xE3o": [["Sem press\xE3o", "Livre Texto", "30244"], ["N\xE3o sustenta aberto", "Livre Texto", "30245"], ["Travado", "Livre Texto", "30246"], ["Danificado", "Livre Texto", "30247"]], "Forro do Teto": [["Solto", "Informar local", "30248"], ["Descolando", "Informar local", "30249"], ["Ca\xEDdo", "Informar local", "30250"], ["Rasgado", "Informar local", "30251"], ["Furado", "Informar local", "30252"], ["Quebrado", "Informar local", "30253"], ["Trincado", "Informar local", "30254"], ["Deformado", "Informar local", "30255"], ["Manchado", "Informar local", "30256"], ["Sujo", "Informar local", "30257"], ["Molhado", "Informar local", "30258"], ["Com infiltra\xE7\xE3o", "Informar origem", "30259"], ["Com umidade", "Informar local", "30260"], ["Com mofo", "Informar local", "30261"], ["Com barulho", "Informar local", "30262"], ["Vibra\xE7\xE3o", "Informar local", "30263"], ["Desalinhado", "Informar local", "30264"], ["Danificado", "Informar local", "30265"]], "Revestimento do Teto": [["Descolando", "Informar local", "30266"], ["Rasgado", "Informar local", "30267"], ["Desgastado", "Informar local", "30268"], ["Danificado", "Informar local", "30269"]], "Presilha do Forro do Teto": [["Solta", "Informar local", "30270"], ["Quebrada", "Informar local", "30271"], ["Ausente", "Informar local", "30272"]], "Suporte do Forro do Teto": [["Solto", "Informar local", "30273"], ["Quebrado", "Informar local", "30274"], ["Danificado", "Informar local", "30275"]], "Cama do Motorista": [["Solta", "Livre Texto", "30276"], ["Com folga", "Livre Texto", "30277"], ["Quebrada", "Livre Texto", "30278"], ["Trincada", "Livre Texto", "30279"], ["Desalinhada", "Livre Texto", "30280"], ["Com barulho", "Livre Texto", "30281"], ["N\xE3o trava", "Livre Texto", "30282"], ["Travada", "Livre Texto", "30283"], ["N\xE3o levanta", "Livre Texto", "30284"], ["N\xE3o abaixa", "Livre Texto", "30285"], ["Danificada", "Livre Texto", "30286"]], "Estrutura da Cama": [["Solta", "Informar local", "30287"], ["Com folga", "Informar local", "30288"], ["Trincada", "Informar local", "30289"], ["Quebrada", "Informar local", "30290"], ["Empenada", "Informar local", "30291"], ["Danificada", "Informar local", "30292"]], "Colch\xE3o da Cama": [["Rasgado", "Livre Texto", "30293"], ["Furado", "Livre Texto", "30294"], ["Deformado", "Livre Texto", "30295"], ["Afundado", "Livre Texto", "30296"], ["Desgastado", "Livre Texto", "30297"], ["Ausente", "Livre Texto", "30298"], ["Danificado", "Livre Texto", "30299"]], "Revestimento da Cama": [["Rasgado", "Informar local", "30300"], ["Solto", "Informar local", "30301"], ["Descolando", "Informar local", "30302"], ["Desgastado", "Informar local", "30303"], ["Danificado", "Informar local", "30304"]], "Dobradi\xE7a da Cama": [["Com folga", "Informar posi\xE7\xE3o", "30305"], ["Travada", "Informar posi\xE7\xE3o", "30306"], ["Quebrada", "Informar posi\xE7\xE3o", "30307"], ["Danificada", "Informar posi\xE7\xE3o", "30308"]], "Trava da Cama": [["N\xE3o trava", "Informar posi\xE7\xE3o", "30309"], ["Travada", "Informar posi\xE7\xE3o", "30310"], ["Solta", "Informar posi\xE7\xE3o", "30311"], ["Quebrada", "Informar posi\xE7\xE3o", "30312"], ["Danificada", "Informar posi\xE7\xE3o", "30313"]], "Amortecedor da Cama": [["Sem press\xE3o", "Informar posi\xE7\xE3o", "30314"], ["N\xE3o sustenta aberta", "Informar posi\xE7\xE3o", "30315"], ["Travado", "Informar posi\xE7\xE3o", "30316"], ["Vazando", "Informar posi\xE7\xE3o", "30317"], ["Danificado", "Informar posi\xE7\xE3o", "30318"]], "Suporte da Cama": [["Solto", "Informar posi\xE7\xE3o", "30319"], ["Trincado", "Informar posi\xE7\xE3o", "30320"], ["Quebrado", "Informar posi\xE7\xE3o", "30321"], ["Danificado", "Informar posi\xE7\xE3o", "30322"]], "Rede de Prote\xE7\xE3o da Cama": [["Rasgada", "Livre Texto", "30323"], ["Solta", "Livre Texto", "30324"], ["Ausente", "Livre Texto", "30325"], ["Trava danificada", "Livre Texto", "30326"]], "Grade Frontal": [["Quebrada", "Livre Texto", "30327"], ["Trincada", "Informar local", "30328"], ["Amassada", "Informar local", "30329"], ["Riscada", "Informar local", "30330"], ["Solta", "Livre Texto", "30331"], ["Com folga", "Livre Texto", "30332"], ["Desalinhada", "Livre Texto", "30333"], ["Desencaixada", "Livre Texto", "30334"], ["Ausente", "Livre Texto", "30335"], ["Com barulho", "Livre Texto", "30336"], ["Danificada", "Informar local", "30337"]], "Moldura da Grade Frontal": [["Quebrada", "Informar posi\xE7\xE3o", "30338"], ["Trincada", "Informar posi\xE7\xE3o", "30339"], ["Solta", "Informar posi\xE7\xE3o", "30340"], ["Desalinhada", "Informar posi\xE7\xE3o", "30341"], ["Danificada", "Informar posi\xE7\xE3o", "30342"]], "Suporte da Grade Frontal": [["Solto", "Informar posi\xE7\xE3o", "30343"], ["Trincado", "Informar posi\xE7\xE3o", "30344"], ["Quebrado", "Informar posi\xE7\xE3o", "30345"], ["Empenado", "Informar posi\xE7\xE3o", "30346"], ["Danificado", "Informar posi\xE7\xE3o", "30347"]], "Presilha da Grade Frontal": [["Solta", "Informar posi\xE7\xE3o", "30348"], ["Quebrada", "Informar posi\xE7\xE3o", "30349"], ["Ausente", "Informar posi\xE7\xE3o", "30350"]], "Trava da Grade Frontal": [["N\xE3o trava", "Livre Texto", "30351"], ["Travada", "Livre Texto", "30352"], ["Solta", "Livre Texto", "30353"], ["Quebrada", "Livre Texto", "30354"], ["Danificada", "Livre Texto", "30355"]], "Dobradi\xE7a da Grade Frontal": [["Com folga", "Informar posi\xE7\xE3o", "30356"], ["Travada", "Informar posi\xE7\xE3o", "30357"], ["Quebrada", "Informar posi\xE7\xE3o", "30358"], ["Danificada", "Informar posi\xE7\xE3o", "30359"]], "Emblema da Grade": [["Solto", "Livre Texto", "30360"], ["Quebrado", "Livre Texto", "30361"], ["Ausente", "Livre Texto", "30362"], ["Danificado", "Livre Texto", "30363"]], "Para-choque": [["Quebrado", "Informar posi\xE7\xE3o", "30364"], ["Trincado", "Informar posi\xE7\xE3o", "30365"], ["Amassado", "Informar posi\xE7\xE3o", "30366"], ["Riscado", "Informar posi\xE7\xE3o", "30367"], ["Solto", "Informar posi\xE7\xE3o", "30368"], ["Com folga", "Informar posi\xE7\xE3o", "30369"], ["Desalinhado", "Informar posi\xE7\xE3o", "30370"], ["Desencaixado", "Informar posi\xE7\xE3o", "30371"], ["Empenado", "Informar posi\xE7\xE3o", "30372"], ["Deformado", "Informar posi\xE7\xE3o", "30373"], ["Ausente", "Informar posi\xE7\xE3o", "30374"], ["Danificado", "Informar posi\xE7\xE3o", "30375"], ["Necessita reparo de pintura", "Informar posi\xE7\xE3o", "30401"], ["Necessita substitui\xE7\xE3o", "Informar posi\xE7\xE3o", "30402"]], "Ponteira do Para-choque": [["Quebrada", "Informar lado", "30376"], ["Trincada", "Informar lado", "30377"], ["Solta", "Informar lado", "30378"], ["Desalinhada", "Informar lado", "30379"], ["Ausente", "Informar lado", "30380"], ["Danificada", "Informar lado", "30381"]], "Suporte do Para-choque": [["Solto", "Informar posi\xE7\xE3o", "30382"], ["Com folga", "Informar posi\xE7\xE3o", "30383"], ["Trincado", "Informar posi\xE7\xE3o", "30384"], ["Quebrado", "Informar posi\xE7\xE3o", "30385"], ["Empenado", "Informar posi\xE7\xE3o", "30386"], ["Danificado", "Informar posi\xE7\xE3o", "30387"]], "Fixa\xE7\xE3o do Para-choque": [["Solta", "Informar posi\xE7\xE3o", "30388"], ["Quebrada", "Informar posi\xE7\xE3o", "30389"], ["Ausente", "Informar posi\xE7\xE3o", "30390"]], "Acabamento do Para-choque": [["Solto", "Informar posi\xE7\xE3o", "30391"], ["Quebrado", "Informar posi\xE7\xE3o", "30392"], ["Trincado", "Informar posi\xE7\xE3o", "30393"], ["Desencaixado", "Informar posi\xE7\xE3o", "30394"], ["Ausente", "Informar posi\xE7\xE3o", "30395"], ["Danificado", "Informar posi\xE7\xE3o", "30396"]], "Estribo do Para-choque": [["Solto", "Informar posi\xE7\xE3o", "30397"], ["Amassado", "Informar posi\xE7\xE3o", "30398"], ["Quebrado", "Informar posi\xE7\xE3o", "30399"], ["Danificado", "Informar posi\xE7\xE3o", "30400"]], Ponteira: [["Quebrada", "Informar lado", "30403"], ["Trincada", "Informar lado", "30404"], ["Amassada", "Informar lado", "30405"], ["Riscada", "Informar lado", "30406"], ["Solta", "Informar lado", "30407"], ["Com folga", "Informar lado", "30408"], ["Desalinhada", "Informar lado", "30409"], ["Desencaixada", "Informar lado", "30410"], ["Empenada", "Informar lado", "30411"], ["Deformada", "Informar lado", "30412"], ["Ausente", "Informar lado", "30413"], ["Danificada", "Informar lado", "30414"], ["Necessita reparo de pintura", "Informar lado", "30429"], ["Necessita substitui\xE7\xE3o", "Informar lado", "30430"]], "Suporte da Ponteira": [["Solto", "Informar lado", "30415"], ["Com folga", "Informar lado", "30416"], ["Trincado", "Informar lado", "30417"], ["Quebrado", "Informar lado", "30418"], ["Empenado", "Informar lado", "30419"], ["Danificado", "Informar lado", "30420"]], "Fixa\xE7\xE3o da Ponteira": [["Solta", "Informar lado", "30421"], ["Quebrada", "Informar lado", "30422"], ["Ausente", "Informar lado", "30423"]], "Acabamento da Ponteira": [["Solto", "Informar lado", "30424"], ["Quebrado", "Informar lado", "30425"], ["Riscado", "Informar lado", "30426"], ["Ausente", "Informar lado", "30427"], ["Danificado", "Informar lado", "30428"]], "Para-lama": [["Quebrado", "Informar posi\xE7\xE3o/lado", "30431"], ["Trincado", "Informar posi\xE7\xE3o/lado", "30432"], ["Amassado", "Informar posi\xE7\xE3o/lado", "30433"], ["Riscado", "Informar posi\xE7\xE3o/lado", "30434"], ["Solto", "Informar posi\xE7\xE3o/lado", "30435"], ["Com folga", "Informar posi\xE7\xE3o/lado", "30436"], ["Desalinhado", "Informar posi\xE7\xE3o/lado", "30437"], ["Desencaixado", "Informar posi\xE7\xE3o/lado", "30438"], ["Empenado", "Informar posi\xE7\xE3o/lado", "30439"], ["Deformado", "Informar posi\xE7\xE3o/lado", "30440"], ["Raspando no pneu", "Informar posi\xE7\xE3o/lado", "30441"], ["Ausente", "Informar posi\xE7\xE3o/lado", "30442"], ["Danificado", "Informar posi\xE7\xE3o/lado", "30443"], ["Necessita reparo de pintura", "Informar posi\xE7\xE3o/lado", "30467"], ["Necessita substitui\xE7\xE3o", "Informar posi\xE7\xE3o/lado", "30468"]], "Suporte do Para-lama": [["Solto", "Informar posi\xE7\xE3o/lado", "30444"], ["Com folga", "Informar posi\xE7\xE3o/lado", "30445"], ["Trincado", "Informar posi\xE7\xE3o/lado", "30446"], ["Quebrado", "Informar posi\xE7\xE3o/lado", "30447"], ["Empenado", "Informar posi\xE7\xE3o/lado", "30448"], ["Danificado", "Informar posi\xE7\xE3o/lado", "30449"]], "Fixa\xE7\xE3o do Para-lama": [["Solta", "Informar posi\xE7\xE3o/lado", "30450"], ["Quebrada", "Informar posi\xE7\xE3o/lado", "30451"], ["Ausente", "Informar posi\xE7\xE3o/lado", "30452"]], "Acabamento do Para-lama": [["Solto", "Informar posi\xE7\xE3o/lado", "30453"], ["Quebrado", "Informar posi\xE7\xE3o/lado", "30454"], ["Trincado", "Informar posi\xE7\xE3o/lado", "30455"], ["Desencaixado", "Informar posi\xE7\xE3o/lado", "30456"], ["Ausente", "Informar posi\xE7\xE3o/lado", "30457"], ["Danificado", "Informar posi\xE7\xE3o/lado", "30458"]], "Para-barro": [["Rasgado", "Informar posi\xE7\xE3o/lado", "30459"], ["Solto", "Informar posi\xE7\xE3o/lado", "30460"], ["Quebrado", "Informar posi\xE7\xE3o/lado", "30461"], ["Ausente", "Informar posi\xE7\xE3o/lado", "30462"], ["Danificado", "Informar posi\xE7\xE3o/lado", "30463"]], "Suporte do Para-barro": [["Solto", "Informar posi\xE7\xE3o/lado", "30464"], ["Quebrado", "Informar posi\xE7\xE3o/lado", "30465"], ["Ausente", "Informar posi\xE7\xE3o/lado", "30466"]], "Placa do Ve\xEDculo": [["Ausente", "Informar posi\xE7\xE3o", "30469"], ["Danificada", "Informar posi\xE7\xE3o", "30470"], ["Amassada", "Informar posi\xE7\xE3o", "30471"], ["Quebrada", "Informar posi\xE7\xE3o", "30472"], ["Trincada", "Informar posi\xE7\xE3o", "30473"], ["Solta", "Informar posi\xE7\xE3o", "30474"], ["Desalinhada", "Informar posi\xE7\xE3o", "30475"], ["Ileg\xEDvel", "Informar posi\xE7\xE3o", "30476"], ["Caracteres danificados", "Informar posi\xE7\xE3o", "30477"], ["Desbotada", "Informar posi\xE7\xE3o", "30478"], ["Necessita substitui\xE7\xE3o", "Informar posi\xE7\xE3o", "30479"]], "Suporte da Placa": [["Solto", "Informar posi\xE7\xE3o", "30480"], ["Com folga", "Informar posi\xE7\xE3o", "30481"], ["Quebrado", "Informar posi\xE7\xE3o", "30482"], ["Trincado", "Informar posi\xE7\xE3o", "30483"], ["Empenado", "Informar posi\xE7\xE3o", "30484"], ["Ausente", "Informar posi\xE7\xE3o", "30485"], ["Danificado", "Informar posi\xE7\xE3o", "30486"]], "Fixa\xE7\xE3o da Placa": [["Solta", "Informar posi\xE7\xE3o", "30487"], ["Quebrada", "Informar posi\xE7\xE3o", "30488"], ["Ausente", "Informar posi\xE7\xE3o", "30489"]], "Parafuso da Placa": [["Solto", "Informar posi\xE7\xE3o", "30490"], ["Ausente", "Informar posi\xE7\xE3o", "30491"], ["Danificado", "Informar posi\xE7\xE3o", "30492"]], "Moldura da Placa": [["Solta", "Informar posi\xE7\xE3o", "30493"], ["Quebrada", "Informar posi\xE7\xE3o", "30494"], ["Ausente", "Informar posi\xE7\xE3o", "30495"], ["Danificada", "Informar posi\xE7\xE3o", "30496"]], Retrovisor: [["Quebrado", "Informar lado", "30497"], ["Trincado", "Informar lado", "30498"], ["Solto", "Informar lado", "30499"], ["Com folga", "Informar lado", "30500"], ["Desalinhado", "Informar lado", "30501"], ["N\xE3o mant\xE9m regulagem", "Informar lado", "30502"], ["Vibra\xE7\xE3o excessiva", "Informar lado", "30503"], ["Com barulho", "Informar lado", "30504"], ["Ausente", "Informar lado", "30505"], ["Danificado", "Informar lado", "30506"], ["Necessita substitui\xE7\xE3o", "Informar lado", "30550"]], "Espelho do Retrovisor": [["Quebrado", "Informar lado", "30507"], ["Trincado", "Informar lado", "30508"], ["Riscado", "Informar lado", "30509"], ["Solto", "Informar lado", "30510"], ["Descolando", "Informar lado", "30511"], ["Manchado", "Informar lado", "30512"], ["Visibilidade comprometida", "Informar lado", "30513"], ["Ausente", "Informar lado", "30514"], ["Danificado", "Informar lado", "30515"]], "Espelho Auxiliar": [["Quebrado", "Informar lado", "30516"], ["Trincado", "Informar lado", "30517"], ["Solto", "Informar lado", "30518"], ["Desalinhado", "Informar lado", "30519"], ["Ausente", "Informar lado", "30520"], ["Danificado", "Informar lado", "30521"]], "Carca\xE7a do Retrovisor": [["Quebrada", "Informar lado", "30522"], ["Trincada", "Informar lado", "30523"], ["Riscada", "Informar lado", "30524"], ["Solta", "Informar lado", "30525"], ["Desencaixada", "Informar lado", "30526"], ["Ausente", "Informar lado", "30527"], ["Danificada", "Informar lado", "30528"]], "Bra\xE7o do Retrovisor": [["Solto", "Informar lado", "30529"], ["Com folga", "Informar lado", "30530"], ["Quebrado", "Informar lado", "30531"], ["Trincado", "Informar lado", "30532"], ["Empenado", "Informar lado", "30533"], ["N\xE3o mant\xE9m posi\xE7\xE3o", "Informar lado", "30534"], ["Danificado", "Informar lado", "30535"]], "Suporte do Retrovisor": [["Solto", "Informar lado", "30536"], ["Com folga", "Informar lado", "30537"], ["Trincado", "Informar lado", "30538"], ["Quebrado", "Informar lado", "30539"], ["Empenado", "Informar lado", "30540"], ["Danificado", "Informar lado", "30541"]], "Fixa\xE7\xE3o do Retrovisor": [["Solta", "Informar lado", "30542"], ["Quebrada", "Informar lado", "30543"], ["Ausente", "Informar lado", "30544"]], "Articula\xE7\xE3o do Retrovisor": [["Travada", "Informar lado", "30545"], ["Com folga", "Informar lado", "30546"], ["N\xE3o mant\xE9m posi\xE7\xE3o", "Informar lado", "30547"], ["Quebrada", "Informar lado", "30548"], ["Danificada", "Informar lado", "30549"]], "Retrovisor Interno": [["Quebrado", "Livre Texto", "30551"], ["Trincado", "Livre Texto", "30552"], ["Solto", "Livre Texto", "30553"], ["Com folga", "Livre Texto", "30554"], ["Desalinhado", "Livre Texto", "30555"], ["N\xE3o mant\xE9m regulagem", "Livre Texto", "30556"], ["Vibra\xE7\xE3o excessiva", "Livre Texto", "30557"], ["Ausente", "Livre Texto", "30558"], ["Danificado", "Livre Texto", "30559"]], "Espelho do Retrovisor Interno": [["Quebrado", "Livre Texto", "30560"], ["Trincado", "Livre Texto", "30561"], ["Riscado", "Livre Texto", "30562"], ["Manchado", "Livre Texto", "30563"], ["Descolando", "Livre Texto", "30564"], ["Visibilidade comprometida", "Informar motivo", "30565"], ["Danificado", "Livre Texto", "30566"]], "Carca\xE7a do Retrovisor Interno": [["Quebrada", "Livre Texto", "30567"], ["Trincada", "Livre Texto", "30568"], ["Solta", "Livre Texto", "30569"], ["Danificada", "Livre Texto", "30570"]], "Suporte do Retrovisor Interno": [["Solto", "Livre Te", "30571"]], Degrau: [["Quebrado", "Informar lado/posi\xE7\xE3o", "30581"], ["Trincado", "Informar lado/posi\xE7\xE3o", "30582"], ["Amassado", "Informar lado/posi\xE7\xE3o", "30583"], ["Empenado", "Informar lado/posi\xE7\xE3o", "30584"], ["Solto", "Informar lado/posi\xE7\xE3o", "30585"], ["Com folga", "Informar lado/posi\xE7\xE3o", "30586"], ["Desalinhado", "Informar lado/posi\xE7\xE3o", "30587"], ["Deformado", "Informar lado/posi\xE7\xE3o", "30588"], ["Ausente", "Informar lado/posi\xE7\xE3o", "30589"], ["Danificado", "Informar lado/posi\xE7\xE3o", "30590"], ["Necessita substitui\xE7\xE3o", "Informar lado/posi\xE7\xE3o", "30614"]], "Revestimento do Degrau": [["Solto", "Informar lado/posi\xE7\xE3o", "30591"], ["Quebrado", "Informar lado/posi\xE7\xE3o", "30592"], ["Trincado", "Informar lado/posi\xE7\xE3o", "30593"], ["Desgastado", "Informar lado/posi\xE7\xE3o", "30594"], ["Ausente", "Informar lado/posi\xE7\xE3o", "30595"], ["Danificado", "Informar lado/posi\xE7\xE3o", "30596"]], "Antiderrapante do Degrau": [["Desgastado", "Informar lado/posi\xE7\xE3o", "30597"], ["Solto", "Informar lado/posi\xE7\xE3o", "30598"], ["Descolando", "Informar lado/posi\xE7\xE3o", "30599"], ["Ausente", "Informar lado/posi\xE7\xE3o", "30600"], ["Danificado", "Informar lado/posi\xE7\xE3o", "30601"]], "Suporte do Degrau": [["Solto", "Informar lado/posi\xE7\xE3o", "30602"], ["Com folga", "Informar lado/posi\xE7\xE3o", "30603"], ["Trincado", "Informar lado/posi\xE7\xE3o", "30604"], ["Quebrado", "Informar lado/posi\xE7\xE3o", "30605"], ["Empenado", "Informar lado/posi\xE7\xE3o", "30606"], ["Danificado", "Informar lado/posi\xE7\xE3o", "30607"]], "Fixa\xE7\xE3o do Degrau": [["Solta", "Informar lado/posi\xE7\xE3o", "30608"], ["Quebrada", "Informar lado/posi\xE7\xE3o", "30609"], ["Ausente", "Informar lado/posi\xE7\xE3o", "30610"]], "Parafuso do Degrau": [["Solto", "Informar lado/posi\xE7\xE3o", "30611"], ["Quebrado", "Informar lado/posi\xE7\xE3o", "30612"], ["Ausente", "Informar lado/posi\xE7\xE3o", "30613"]], Defletor: [["Quebrado", "Informar posi\xE7\xE3o", "30615"], ["Trincado", "Informar posi\xE7\xE3o", "30616"], ["Amassado", "Informar posi\xE7\xE3o", "30617"], ["Riscado", "Informar posi\xE7\xE3o", "30618"], ["Solto", "Informar posi\xE7\xE3o", "30619"], ["Com folga", "Informar posi\xE7\xE3o", "30620"], ["Desalinhado", "Informar posi\xE7\xE3o", "30621"], ["Desencaixado", "Informar posi\xE7\xE3o", "30622"], ["Empenado", "Informar posi\xE7\xE3o", "30623"], ["Deformado", "Informar posi\xE7\xE3o", "30624"], ["Com vibra\xE7\xE3o", "Informar posi\xE7\xE3o", "30625"], ["Com barulho", "Informar posi\xE7\xE3o", "30626"], ["Ausente", "Informar posi\xE7\xE3o", "30627"], ["Danificado", "Informar posi\xE7\xE3o", "30628"], ["Necessita reparo de pintura", "Informar posi\xE7\xE3o", "30659"], ["Necessita substitui\xE7\xE3o", "Informar posi\xE7\xE3o", "30660"]], "Defletor Superior": [["Quebrado", "Livre Texto", "30629"], ["Trincado", "Livre Texto", "30630"], ["Solto", "Livre Texto", "30631"], ["Desalinhado", "Livre Texto", "30632"], ["Ausente", "Livre Texto", "30633"], ["Danificado", "Livre Texto", "30634"]], "Defletor Lateral": [["Quebrado", "Informar lado", "30635"], ["Trincado", "Informar lado", "30636"], ["Solto", "Informar lado", "30637"], ["Desalinhado", "Informar lado", "30638"], ["Ausente", "Informar lado", "30639"], ["Danificado", "Informar lado", "30640"]], "Suporte do Defletor": [["Solto", "Informar posi\xE7\xE3o", "30641"], ["Com folga", "Informar posi\xE7\xE3o", "30642"], ["Trincado", "Informar posi\xE7\xE3o", "30643"], ["Quebrado", "Informar posi\xE7\xE3o", "30644"], ["Empenado", "Informar posi\xE7\xE3o", "30645"], ["Ausente", "Informar posi\xE7\xE3o", "30646"], ["Danificado", "Informar posi\xE7\xE3o", "30647"]], "Fixa\xE7\xE3o do Defletor": [["Solta", "Informar posi\xE7\xE3o", "30648"], ["Quebrada", "Informar posi\xE7\xE3o", "30649"], ["Ausente", "Informar posi\xE7\xE3o", "30650"]], "Parafuso do Defletor": [["Solto", "Informar posi\xE7\xE3o", "30651"], ["Quebrado", "Informar posi\xE7\xE3o", "30652"], ["Ausente", "Informar posi\xE7\xE3o", "30653"]], "Acabamento do Defletor": [["Solto", "Informar posi\xE7\xE3o", "30654"], ["Quebrado", "Informar posi\xE7\xE3o", "30655"], ["Desencaixado", "Informar posi\xE7\xE3o", "30656"], ["Ausente", "Informar posi\xE7\xE3o", "30657"], ["Danificado", "Informar posi\xE7\xE3o", "30658"]], Porta: [["N\xE3o abre", "Informar lado", "30661"], ["N\xE3o fecha", "Informar lado", "30662"], ["N\xE3o trava", "Informar lado", "30663"], ["Travada", "Informar lado", "30664"], ["Dif\xEDcil abertura", "Informar lado", "30665"], ["Dif\xEDcil fechamento", "Informar lado", "30666"], ["Desalinhada", "Informar lado", "30667"], ["Ca\xEDda", "Informar lado", "30668"], ["Com folga", "Informar lado", "30669"], ["Solta", "Informar lado", "30670"], ["Amassada", "Informar lado", "30671"], ["Riscada", "Informar lado", "30672"], ["Trincada", "Informar lado", "30673"], ["Deformada", "Informar lado", "30674"], ["Empenada", "Informar lado", "30675"], ["Com barulho", "Informar lado", "30676"], ["Com infiltra\xE7\xE3o de \xE1gua", "Informar lado", "30677"], ["Entrada de vento", "Informar lado", "30678"], ["Necessita reparo de pintura", "Informar lado", "30679"], ["Danificada", "Informar lado", "30680"], ["Necessita substitui\xE7\xE3o", "Informar lado", "30734"]], "Dobradi\xE7a da Porta": [["Com folga", "Informar lado/posi\xE7\xE3o", "30681"], ["Solta", "Informar lado/posi\xE7\xE3o", "30682"], ["Travada", "Informar lado/posi\xE7\xE3o", "30683"], ["Quebrada", "Informar lado/posi\xE7\xE3o", "30684"], ["Empenada", "Informar lado/posi\xE7\xE3o", "30685"], ["Danificada", "Informar lado/posi\xE7\xE3o", "30686"]], "Pino da Dobradi\xE7a": [["Com folga", "Informar lado/posi\xE7\xE3o", "30687"], ["Desgastado", "Informar lado/posi\xE7\xE3o", "30688"], ["Quebrado", "Informar lado/posi\xE7\xE3o", "30689"], ["Ausente", "Informar lado/posi\xE7\xE3o", "30690"]], "Fechadura da Porta": [["N\xE3o trava", "Informar lado", "30691"], ["Travada", "Informar lado", "30692"], ["N\xE3o destrava", "Informar lado", "30693"], ["Com folga", "Informar lado", "30694"], ["Quebrada", "Informar lado", "30695"], ["Danificada", "Informar lado", "30696"]], "Ma\xE7aneta Externa": [["N\xE3o funciona", "Informar lado", "30697"], ["Solta", "Informar lado", "30698"], ["Travada", "Informar lado", "30699"], ["Quebrada", "Informar lado", "30700"], ["Danificada", "Informar lado", "30701"]], "Limitador da Porta": [["N\xE3o funciona", "Informar lado", "30707"], ["Com folga", "Informar lado", "30708"], ["Com barulho", "Informar lado", "30709"], ["Travado", "Informar lado", "30710"], ["Quebrado", "Informar lado", "30711"], ["Danificado", "Informar lado", "30712"]], "Batente da Porta": [["Solto", "Informar lado", "30713"], ["Desalinhado", "Informar lado", "30714"], ["Desgastado", "Informar lado", "30715"], ["Quebrado", "Informar lado", "30716"], ["Danificado", "Informar lado", "30717"]], "Borracha da Porta": [["Solta", "Informar lado", "30718"], ["Ressecada", "Informar lado", "30719"], ["Rasgada", "Informar lado", "30720"], ["Deformada", "Informar lado", "30721"], ["Desencaixada", "Informar lado", "30722"], ["Infiltrando \xE1gua", "Informar lado", "30723"], ["Entrada de vento", "Informar lado", "30724"], ["Danificada", "Informar lado", "30725"]], "Moldura da Porta": [["Solta", "Informar lado", "30726"], ["Quebrada", "Informar lado", "30727"], ["Trincada", "Informar lado", "30728"], ["Desalinhada", "Informar lado", "30729"], ["Danificada", "Informar lado", "30730"]], "Fixa\xE7\xE3o da Porta": [["Solta", "Informar lado/local", "30731"], ["Quebrada", "Informar lado/local", "30732"], ["Ausente", "Informar lado/local", "30733"]], Solda: [["Trincada", "Informar local", "30735"], ["Quebrada", "Informar local", "30736"], ["Rompida", "Informar local", "30737"], ["Solta", "Informar local", "30738"], ["Com fissura", "Informar local", "30739"], ["Com corros\xE3o", "Informar local", "30740"], ["Com acabamento irregular", "Informar local", "30741"], ["Necessita refor\xE7o", "Informar local", "30742"], ["Necessita refazer", "Informar local", "30743"], ["Ausente", "Informar local", "30744"], ["Danificada", "Informar local", "30745"], ["Outros", "Livre Texto", "30771"]], "Solda da Cabine": [["Trincada", "Informar local", "30746"], ["Rompida", "Informar local", "30747"], ["Necessita refor\xE7o", "Informar local", "30748"], ["Necessita refazer", "Informar local", "30749"]], "Solda do Assoalho": [["Trincada", "Informar local", "30750"], ["Rompida", "Informar local", "30751"], ["Necessita refor\xE7o", "Informar local", "30752"], ["Necessita refazer", "Informar local", "30753"]], "Solda do Degrau": [["Trincada", "Informar lado/posi\xE7\xE3o", "30754"], ["Rompida", "Informar lado/posi\xE7\xE3o", "30755"], ["Necessita refor\xE7o", "Informar lado/posi\xE7\xE3o", "30756"], ["Necessita refazer", "Informar lado/posi\xE7\xE3o", "30757"]], "Solda do Suporte": [["Trincada", "Informar componente", "30758"], ["Rompida", "Informar componente", "30759"], ["Solta", "Informar componente", "30760"], ["Necessita refor\xE7o", "Informar componente", "30761"], ["Necessita refazer", "Informar componente", "30762"]], "Solda da Carroceria": [["Trincada", "Informar local", "30763"], ["Rompida", "Informar local", "30764"], ["Necessita refor\xE7o", "Informar local", "30765"], ["Necessita refazer", "Informar local", "30766"]], "Solda da Carreta": [["Trincada", "Informar local", "30767"], ["Rompida", "Informar local", "30768"], ["Necessita refor\xE7o", "Informar local", "30769"], ["Necessita refazer", "Informar local", "30770"]] } } }, BAU: { nome: "Ba\xFA", sistemas: { Ba\u00FA: { Carroceria: [["Amassada", "Informar local", "60.00"], ["Trincada", "Informar local", "60.01"], ["Quebrada", "Informar local", "60.02"], ["Furada", "Informar local", "60.03"], ["Riscada", "Informar local", "60.04"], ["Deformada", "Informar local", "60.05"], ["Empenada", "Informar local", "60.06"], ["Solta", "Informar local", "60.07"], ["Com folga", "Informar local", "60.08"], ["Com infiltra\xE7\xE3o", "Informar local", "60.09"], ["Com corros\xE3o", "Informar local", "60.10"], ["Com oxida\xE7\xE3o", "Informar local", "60.11"], ["Com barulho", "Informar local", "60.12"], ["Danificada", "Informar local", "60.13"], ["Necessita reparo de pintura", "Informar local", "60.49"], ["Necessita reparo estrutural", "Informar local", "60.50"], ["Outros", "Livre Texto", "60.51"], ["Amassada", "Informar local", "60.00"], ["Trincada", "Informar local", "60.01"], ["Quebrada", "Informar local", "60.02"], ["Furada", "Informar local", "60.03"], ["Riscada", "Informar local", "60.04"], ["Deformada", "Informar local", "60.05"], ["Empenada", "Informar local", "60.06"], ["Solta", "Informar local", "60.07"], ["Com folga", "Informar local", "60.08"], ["Com infiltra\xE7\xE3o", "Informar local", "60.09"], ["Com corros\xE3o", "Informar local", "60.10"], ["Com oxida\xE7\xE3o", "Informar local", "60.11"], ["Com barulho", "Informar local", "60.12"], ["Danificada", "Informar local", "60.13"], ["Necessita reparo de pintura", "Informar local", "60.49"], ["Necessita reparo estrutural", "Informar local", "60.50"], ["Outros", "Livre Texto", "60.51"]], "Painel Lateral do Ba\xFA": [["Amassado", "Informar lado", "60.14"], ["Trincado", "Informar lado", "60.15"], ["Furado", "Informar lado", "60.16"], ["Riscado", "Informar lado", "60.17"], ["Deformado", "Informar lado", "60.18"], ["Solto", "Informar lado", "60.19"], ["Descolando", "Informar lado", "60.20"], ["Danificado", "Informar lado", "60.21"], ["Amassado", "Informar lado", "60.14"], ["Trincado", "Informar lado", "60.15"], ["Furado", "Informar lado", "60.16"], ["Riscado", "Informar lado", "60.17"], ["Deformado", "Informar lado", "60.18"], ["Solto", "Informar lado", "60.19"], ["Descolando", "Informar lado", "60.20"], ["Danificado", "Informar lado", "60.21"]], "Painel Frontal do Ba\xFA": [["Amassado", "Livre Texto", "60.22"], ["Trincado", "Livre Texto", "60.23"], ["Furado", "Livre Texto", "60.24"], ["Deformado", "Livre Texto", "60.25"], ["Solto", "Livre Texto", "60.26"], ["Danificado", "Livre Texto", "60.27"], ["Amassado", "Livre Texto", "60.22"], ["Trincado", "Livre Texto", "60.23"], ["Furado", "Livre Texto", "60.24"], ["Deformado", "Livre Texto", "60.25"], ["Solto", "Livre Texto", "60.26"], ["Danificado", "Livre Texto", "60.27"]], "Teto do Ba\xFA": [["Amassado", "Informar local", "60.28"], ["Trincado", "Informar local", "60.29"], ["Furado", "Informar local", "60.30"], ["Deformado", "Informar local", "60.31"], ["Com infiltra\xE7\xE3o", "Informar local", "60.32"], ["Descolando", "Informar local", "60.33"], ["Danificado", "Informar local", "60.34"], ["Amassado", "Informar local", "60.28"], ["Trincado", "Informar local", "60.29"], ["Furado", "Informar local", "60.30"], ["Deformado", "Informar local", "60.31"], ["Com infiltra\xE7\xE3o", "Informar local", "60.32"], ["Descolando", "Informar local", "60.33"], ["Danificado", "Informar local", "60.34"]], "Estrutura do Ba\xFA": [["Com folga", "Informar local", "60.35"], ["Trincada", "Informar local", "60.36"], ["Quebrada", "Informar local", "60.37"], ["Empenada", "Informar local", "60.38"], ["Deformada", "Informar local", "60.39"], ["Com corros\xE3o", "Informar local", "60.40"], ["Solda trincada", "Informar local", "60.41"], ["Solda rompida", "Informar local", "60.42"], ["Danificada", "Informar local", "60.43"], ["Com folga", "Informar local", "60.35"], ["Trincada", "Informar local", "60.36"], ["Quebrada", "Informar local", "60.37"], ["Empenada", "Informar local", "60.38"], ["Deformada", "Informar local", "60.39"], ["Com corros\xE3o", "Informar local", "60.40"], ["Solda trincada", "Informar local", "60.41"], ["Solda rompida", "Informar local", "60.42"], ["Danificada", "Informar local", "60.43"]], "Acabamento da Carroceria": [["Solto", "Informar local", "60.44"], ["Quebrado", "Informar local", "60.45"], ["Descolando", "Informar local", "60.46"], ["Ausente", "Informar local", "60.47"], ["Danificado", "Informar local", "60.48"], ["Solto", "Informar local", "60.44"], ["Quebrado", "Informar local", "60.45"], ["Descolando", "Informar local", "60.46"], ["Ausente", "Informar local", "60.47"], ["Danificado", "Informar local", "60.48"]], "Plataforma Elevat\xF3ria": [["N\xE3o funciona", "Livre Texto", "60128"], ["N\xE3o sobe", "Livre Texto", "60129"], ["N\xE3o desce", "Livre Texto", "60130"], ["Sobe lentamente", "Livre Texto", "60131"], ["Desce lentamente", "Livre Texto", "60132"], ["Movimento irregular", "Livre Texto", "60133"], ["Travada", "Livre Texto", "60134"], ["N\xE3o recolhe", "Livre Texto", "60135"], ["N\xE3o abre", "Livre Texto", "60136"], ["N\xE3o fecha", "Livre Texto", "60137"], ["N\xE3o mant\xE9m posi\xE7\xE3o", "Livre Texto", "60138"], ["Desce sozinha", "Livre Texto", "60139"], ["Desnivelada", "Livre Texto", "60140"], ["Com folga", "Informar local", "60141"], ["Com barulho", "Informar local", "60142"], ["Com vibra\xE7\xE3o", "Livre Texto", "60143"], ["Danificada", "Livre Texto", "60144"], ["Necessita lubrifica\xE7\xE3o", "Informar pontos", "60231"], ["Necessita regulagem", "Livre Texto", "60232"], ["Preventiva", "Digitar KM atual", "60233"], ["Necessita reparo estrutural", "Informar local", "60234"], ["Outros", "Livre Texto", "60235"]], "Mesa da Plataforma": [["Amassada", "Informar local", "60145"], ["Empenada", "Informar local", "60146"], ["Trincada", "Informar local", "60147"], ["Quebrada", "Informar local", "60148"], ["Com corros\xE3o", "Informar local", "60149"], ["Piso danificado", "Informar local", "60150"], ["Antiderrapante desgastado", "Informar local", "60151"], ["Danificada", "Informar local", "60152"]], "Bra\xE7o da Plataforma": [["Com folga", "Informar lado/posi\xE7\xE3o", "60153"], ["Empenado", "Informar lado/posi\xE7\xE3o", "60154"], ["Trincado", "Informar lado/posi\xE7\xE3o", "60155"], ["Quebrado", "Informar lado/posi\xE7\xE3o", "60156"], ["Danificado", "Informar lado/posi\xE7\xE3o", "60157"]], "Pino da Plataforma": [["Com folga", "Informar posi\xE7\xE3o", "60158"], ["Desgastado", "Informar posi\xE7\xE3o", "60159"], ["Quebrado", "Informar posi\xE7\xE3o", "60160"], ["Ausente", "Informar posi\xE7\xE3o", "60161"]], "Bucha da Plataforma": [["Com folga", "Informar posi\xE7\xE3o", "60162"], ["Desgastada", "Informar posi\xE7\xE3o", "60163"], ["Quebrada", "Informar posi\xE7\xE3o", "60164"], ["Danificada", "Informar posi\xE7\xE3o", "60165"]], "Cilindro Hidr\xE1ulico": [["Vazando \xF3leo", "Informar cilindro", "60166"], ["N\xE3o atua", "Informar cilindro", "60167"], ["Movimento lento", "Informar cilindro", "60168"], ["Perde press\xE3o", "Informar cilindro", "60169"], ["Haste danificada", "Informar cilindro", "60170"], ["Retentor vazando", "Informar cilindro", "60171"], ["Danificado", "Informar cilindro", "60172"]], "Mangueira Hidr\xE1ulica": [["Vazando", "Informar local", "60173"], ["Ressecada", "Informar local", "60174"], ["Rachada", "Informar local", "60175"], ["Rompida", "Informar local", "60176"], ["Prensada", "Informar local", "60177"], ["Danificada", "Informar local", "60178"]], "Conex\xE3o Hidr\xE1ulica": [["Vazando", "Informar local", "60179"], ["Solta", "Informar local", "60180"], ["Quebrada", "Informar local", "60181"], ["Danificada", "Informar local", "60182"]], "Bomba Hidr\xE1ulica": [["N\xE3o funciona", "Livre Texto", "60183"], ["Baixa press\xE3o", "Livre Texto", "60184"], ["Com barulho", "Livre Texto", "60185"], ["Vazando \xF3leo", "Livre Texto", "60186"], ["Danificada", "Livre Texto", "60187"]], "Reservat\xF3rio Hidr\xE1ulico": [["Vazando", "Informar local", "60188"], ["N\xEDvel baixo", "Livre Texto", "60189"], ["Trincado", "Livre Texto", "60190"], ["Danificado", "Livre Texto", "60191"]], "\xD3leo Hidr\xE1ulico": [["N\xEDvel baixo", "Livre Texto", "60192"], ["Contaminado", "Livre Texto", "60193"], ["Necessita substitui\xE7\xE3o", "Livre Texto", "60194"]], "Motor El\xE9trico da Plataforma": [["N\xE3o funciona", "Livre Texto", "60195"], ["Intermitente", "Livre Texto", "60196"], ["Com barulho", "Livre Texto", "60197"], ["Queimado", "Livre Texto", "60198"], ["Danificado", "Livre Texto", "60199"]], "Comando da Plataforma": [["N\xE3o funciona", "Informar comando", "60200"], ["Intermitente", "Informar comando", "60201"], ["Bot\xE3o travado", "Informar fun\xE7\xE3o", "60202"], ["Bot\xE3o quebrado", "Informar fun\xE7\xE3o", "60203"], ["Danificado", "Informar comando", "60204"]], "Chicote da Plataforma": [["Mau contato", "Informar local", "60205"], ["Rompido", "Informar local", "60206"], ["Curto-circuito", "Informar local", "60207"], ["Danificado", "Informar local", "60208"]], "Cabo El\xE9trico da Plataforma": [["Rompido", "Informar local", "60209"], ["Mau contato", "Informar local", "60210"], ["Danificado", "Informar local", "60211"]], "Fus\xEDvel da Plataforma": [["Queimado", "Livre Texto", "60212"]], "Rel\xE9 da Plataforma": [["N\xE3o funciona", "Livre Texto", "60213"], ["Intermitente", "Livre Texto", "60214"], ["Queimado", "Livre Texto", "60215"]], "Trava da Plataforma": [["N\xE3o trava", "Informar posi\xE7\xE3o", "60216"], ["N\xE3o destrava", "Informar posi\xE7\xE3o", "60217"], ["Travada", "Informar posi\xE7\xE3o", "60218"], ["Com folga", "Informar posi\xE7\xE3o", "60219"], ["Quebrada", "Informar posi\xE7\xE3o", "60220"], ["Danificada", "Informar posi\xE7\xE3o", "60221"]], "Sensor da Plataforma": [["N\xE3o funciona", "Informar sensor", "60222"], ["Sem sinal", "Informar sensor", "60223"], ["Intermitente", "Informar sensor", "60224"], ["Danificado", "Informar sensor", "60225"]], "Suporte da Plataforma": [["Solto", "Informar posi\xE7\xE3o", "60226"], ["Trincado", "Informar posi\xE7\xE3o", "60227"], ["Quebrado", "Informar posi\xE7\xE3o", "60228"], ["Empenado", "Informar posi\xE7\xE3o", "60229"], ["Danificado", "Informar posi\xE7\xE3o", "60230"]], Rolete: [["Travado", "Informar posi\xE7\xE3o", "60236"], ["Com folga", "Informar posi\xE7\xE3o", "60237"], ["Quebrado", "Informar posi\xE7\xE3o", "60238"], ["Desgastado", "Informar posi\xE7\xE3o", "60239"], ["Desalinhado", "Informar posi\xE7\xE3o", "60240"], ["Solto", "Informar posi\xE7\xE3o", "60241"], ["N\xE3o gira", "Informar posi\xE7\xE3o", "60242"], ["Com barulho", "Informar posi\xE7\xE3o", "60243"], ["Ausente", "Informar posi\xE7\xE3o", "60244"], ["Necessita lubrifica\xE7\xE3o", "Informar posi\xE7\xE3o", "60245"], ["Necessita regulagem", "Informar posi\xE7\xE3o", "60246"], ["Outros", "Livre Texto", "60247"]], "Faixa Refletiva": [["Descolando", "Informar posi\xE7\xE3o", "60248"], ["Rasgada", "Informar posi\xE7\xE3o", "60249"], ["Danificada", "Informar posi\xE7\xE3o", "60250"], ["Desbotada", "Informar posi\xE7\xE3o", "60251"], ["Baixa refletividade", "Informar posi\xE7\xE3o", "60252"], ["Suja", "Informar posi\xE7\xE3o", "60253"], ["Ausente", "Informar posi\xE7\xE3o", "60254"], ["Fora do padr\xE3o", "Informar posi\xE7\xE3o", "60255"], ["Necessita substitui\xE7\xE3o", "Informar posi\xE7\xE3o", "60256"], ["Outros", "Livre Texto", "60257"]], Logomarca: [["Descolando", "Informar posi\xE7\xE3o", "60258"], ["Rasgada", "Informar posi\xE7\xE3o", "60259"], ["Danificada", "Informar posi\xE7\xE3o", "60260"], ["Desbotada", "Informar posi\xE7\xE3o", "60261"], ["Riscada", "Informar posi\xE7\xE3o", "60262"], ["Ileg\xEDvel", "Informar posi\xE7\xE3o", "60263"], ["Ausente", "Informar posi\xE7\xE3o", "60264"], ["Fora do padr\xE3o", "Informar posi\xE7\xE3o", "60265"], ["Necessita substitui\xE7\xE3o", "Informar posi\xE7\xE3o", "60266"], ["Outros", "Livre Texto", "60267"]], Adesivos: [["Descolando", "Informar posi\xE7\xE3o", "60268"], ["Rasgados", "Informar posi\xE7\xE3o", "60269"], ["Danificados", "Informar posi\xE7\xE3o", "60270"], ["Desbotados", "Informar posi\xE7\xE3o", "60271"], ["Riscados", "Informar posi\xE7\xE3o", "60272"], ["Ileg\xEDveis", "Informar posi\xE7\xE3o", "60273"], ["Ausentes", "Informar posi\xE7\xE3o", "60274"], ["Fora do padr\xE3o", "Informar posi\xE7\xE3o", "60275"], ["Necessita substitui\xE7\xE3o", "Informar posi\xE7\xE3o", "60276"], ["Outros", "Livre Texto", "60277"]], Longarina: [["Trincada", "Informar posi\xE7\xE3o", "60278"], ["Quebrada", "Informar posi\xE7\xE3o", "60279"], ["Empenada", "Informar posi\xE7\xE3o", "60280"], ["Deformada", "Informar posi\xE7\xE3o", "60281"], ["Com corros\xE3o", "Informar posi\xE7\xE3o", "60282"], ["Com solda rompida", "Informar posi\xE7\xE3o", "60283"], ["Com solda trincada", "Informar posi\xE7\xE3o", "60284"], ["Com folga", "Informar posi\xE7\xE3o", "60285"], ["Desalinhada", "Informar posi\xE7\xE3o", "60286"], ["Danificada", "Informar posi\xE7\xE3o", "60287"], ["Necessita refor\xE7o", "Informar posi\xE7\xE3o", "60288"], ["Necessita reparo estrutural", "Informar posi\xE7\xE3o", "60289"], ["Outros", "Livre Texto", "60290"]], Arrebite: [["Solto", "Informar posi\xE7\xE3o", "60291"], ["Com folga", "Informar posi\xE7\xE3o", "60292"], ["Quebrado", "Informar posi\xE7\xE3o", "60293"], ["Rompido", "Informar posi\xE7\xE3o", "60294"], ["Ausente", "Informar posi\xE7\xE3o", "60295"], ["Com corros\xE3o", "Informar posi\xE7\xE3o", "60296"], ["Danificado", "Informar posi\xE7\xE3o", "60297"], ["Necessita reaperto", "Informar posi\xE7\xE3o", "60298"], ["Necessita substitui\xE7\xE3o", "Informar posi\xE7\xE3o", "60299"], ["Outros", "Livre Texto", "60300"]], "Protetor de Ciclista": [["Solto", "Informar lado", "60301"], ["Com folga", "Informar lado", "60302"], ["Amassado", "Informar lado", "60303"], ["Empenado", "Informar lado", "60304"], ["Trincado", "Informar lado", "60305"], ["Quebrado", "Informar lado", "60306"], ["Com corros\xE3o", "Informar lado", "60307"], ["Solda trincada", "Informar lado/posi\xE7\xE3o", "60308"], ["Solda rompida", "Informar lado/posi\xE7\xE3o", "60309"], ["Desalinhado", "Informar lado", "60310"], ["Ausente", "Informar lado", "60311"], ["Danificado", "Informar lado", "60312"], ["Fora do padr\xE3o", "Informar lado", "60313"], ["Necessita reparo", "Informar lado", "60314"], ["Necessita substitui\xE7\xE3o", "Informar lado", "60315"], ["Outros", "Livre Texto", "60316"]], "Para-lama": [["Solto", "Informar posi\xE7\xE3o/lado", "60317"], ["Com folga", "Informar posi\xE7\xE3o/lado", "60318"], ["Quebrado", "Informar posi\xE7\xE3o/lado", "60319"], ["Trincado", "Informar posi\xE7\xE3o/lado", "60320"], ["Amassado", "Informar posi\xE7\xE3o/lado", "60321"], ["Empenado", "Informar posi\xE7\xE3o/lado", "60322"], ["Deformado", "Informar posi\xE7\xE3o/lado", "60323"], ["Desalinhado", "Informar posi\xE7\xE3o/lado", "60324"], ["Raspando no pneu", "Informar posi\xE7\xE3o/lado", "60325"], ["Com corros\xE3o", "Informar posi\xE7\xE3o/lado", "60326"], ["Ausente", "Informar posi\xE7\xE3o/lado", "60327"], ["Danificado", "Informar posi\xE7\xE3o/lado", "60328"], ["Necessita reparo", "Informar posi\xE7\xE3o/lado", "60329"], ["Necessita substitui\xE7\xE3o", "Informar posi\xE7\xE3o/lado", "60330"], ["Outros", "Livre Texto", "60331"]] } } }, BOR: { nome: "Borracharia", sistemas: { Pneu: { "Pneu dianteiro": [["Estourado", "Informar posi\xE7\xE3o", "70.02"], ["Cortado", "Informar posi\xE7\xE3o", "70.03"], ["Baixa press\xE3o", "Informar posi\xE7\xE3o", "70.04"], ["Vazio", "Informar posi\xE7\xE3o", "70.05"], ["Vazando", "Informar posi\xE7\xE3o", "70.06"], ["Desgaste irregular", "Informar posi\xE7\xE3o", "70.07"], ["Desgaste excessivo", "Informar posi\xE7\xE3o", "70.08"], ["Desgaste lateral", "Informar posi\xE7\xE3o", "70.09"], ["Desgaste central", "Informar posi\xE7\xE3o", "70.10"], ["Ombro desgastado", "Informar posi\xE7\xE3o", "70.11"], ["Sulco abaixo do limite", "Informar posi\xE7\xE3o", "70.12"], ["Lona aparente", "Informar posi\xE7\xE3o", "70.13"], ["Bolha", "Informar posi\xE7\xE3o", "70.14"], ["Carca\xE7a danificada", "Informar posi\xE7\xE3o", "70.15"], ["Tal\xE3o danificado", "Informar posi\xE7\xE3o", "70.16"], ["Banda soltando", "Informar posi\xE7\xE3o", "70.17"], ["Rachado", "Informar posi\xE7\xE3o", "70.18"], ["Ressecado", "Informar posi\xE7\xE3o", "70.19"], ["Objeto perfurante", "Informar posi\xE7\xE3o", "70.20"], ["Necessita calibragem", "Informar posi\xE7\xE3o", "70.21"], ["Necessita substitui\xE7\xE3o", "Informar posi\xE7\xE3o", "70.22"], ["Outros", "Livre Texto", "70.23"]], "Pneu de Tra\xE7\xE3o": [["Furado", "Informar posi\xE7\xE3o", "70.24"], ["Estourado", "Informar posi\xE7\xE3o", "70.25"], ["Cortado", "Informar posi\xE7\xE3o", "70.26"], ["Baixa press\xE3o", "Informar posi\xE7\xE3o", "70.27"], ["Vazio", "Informar posi\xE7\xE3o", "70.28"], ["Vazando", "Informar posi\xE7\xE3o", "70.29"], ["Desgaste irregular", "Informar posi\xE7\xE3o", "70.30"], ["Desgaste excessivo", "Informar posi\xE7\xE3o", "70.31"], ["Desgaste lateral", "Informar posi\xE7\xE3o", "70.32"], ["Desgaste central", "Informar posi\xE7\xE3o", "70.33"], ["Ombro desgastado", "Informar posi\xE7\xE3o", "70.34"], ["Sulco abaixo do limite", "Informar posi\xE7\xE3o", "70.35"], ["Lona aparente", "Informar posi\xE7\xE3o", "70.36"], ["Bolha", "Informar posi\xE7\xE3o", "70.37"], ["Carca\xE7a danificada", "Informar posi\xE7\xE3o", "70.38"], ["Tal\xE3o danificado", "Informar posi\xE7\xE3o", "70.39"], ["Banda soltando", "Informar posi\xE7\xE3o", "70.40"], ["Rachado", "Informar posi\xE7\xE3o", "70.41"], ["Ressecado", "Informar posi\xE7\xE3o", "70.42"], ["Objeto perfurante", "Informar posi\xE7\xE3o", "70.43"], ["Necessita calibragem", "Informar posi\xE7\xE3o", "70.44"], ["Necessita substitui\xE7\xE3o", "Informar posi\xE7\xE3o", "70.45"], ["Outros", "Livre Texto", "70.46"], ["Furado", "Informar posi\xE7\xE3o", "70.24"], ["Estourado", "Informar posi\xE7\xE3o", "70.25"], ["Cortado", "Informar posi\xE7\xE3o", "70.26"], ["Baixa press\xE3o", "Informar posi\xE7\xE3o", "70.27"], ["Vazio", "Informar posi\xE7\xE3o", "70.28"], ["Vazando", "Informar posi\xE7\xE3o", "70.29"], ["Desgaste irregular", "Informar posi\xE7\xE3o", "70.30"], ["Desgaste excessivo", "Informar posi\xE7\xE3o", "70.31"], ["Desgaste lateral", "Informar posi\xE7\xE3o", "70.32"], ["Desgaste central", "Informar posi\xE7\xE3o", "70.33"], ["Ombro desgastado", "Informar posi\xE7\xE3o", "70.34"], ["Sulco abaixo do limite", "Informar posi\xE7\xE3o", "70.35"], ["Lona aparente", "Informar posi\xE7\xE3o", "70.36"], ["Bolha", "Informar posi\xE7\xE3o", "70.37"], ["Carca\xE7a danificada", "Informar posi\xE7\xE3o", "70.38"], ["Tal\xE3o danificado", "Informar posi\xE7\xE3o", "70.39"], ["Banda soltando", "Informar posi\xE7\xE3o", "70.40"], ["Rachado", "Informar posi\xE7\xE3o", "70.41"], ["Ressecado", "Informar posi\xE7\xE3o", "70.42"], ["Objeto perfurante", "Informar posi\xE7\xE3o", "70.43"], ["Necessita calibragem", "Informar posi\xE7\xE3o", "70.44"], ["Necessita substitui\xE7\xE3o", "Informar posi\xE7\xE3o", "70.45"], ["Outros", "Livre Texto", "70.46"]], "Pneu Dianteiro": [["Furado", "Informar posi\xE7\xE3o", "70.01"], ["Estourado", "Informar posi\xE7\xE3o", "70.02"], ["Cortado", "Informar posi\xE7\xE3o", "70.03"], ["Baixa press\xE3o", "Informar posi\xE7\xE3o", "70.04"], ["Vazio", "Informar posi\xE7\xE3o", "70.05"], ["Vazando", "Informar posi\xE7\xE3o", "70.06"], ["Desgaste irregular", "Informar posi\xE7\xE3o", "70.07"], ["Desgaste excessivo", "Informar posi\xE7\xE3o", "70.08"], ["Desgaste lateral", "Informar posi\xE7\xE3o", "70.09"], ["Desgaste central", "Informar posi\xE7\xE3o", "70.10"], ["Ombro desgastado", "Informar posi\xE7\xE3o", "70.11"], ["Sulco abaixo do limite", "Informar posi\xE7\xE3o", "70.12"], ["Lona aparente", "Informar posi\xE7\xE3o", "70.13"], ["Bolha", "Informar posi\xE7\xE3o", "70.14"], ["Carca\xE7a danificada", "Informar posi\xE7\xE3o", "70.15"], ["Tal\xE3o danificado", "Informar posi\xE7\xE3o", "70.16"], ["Banda soltando", "Informar posi\xE7\xE3o", "70.17"], ["Rachado", "Informar posi\xE7\xE3o", "70.18"], ["Ressecado", "Informar posi\xE7\xE3o", "70.19"], ["Objeto perfurante", "Informar posi\xE7\xE3o", "70.20"], ["Necessita calibragem", "Informar posi\xE7\xE3o", "70.21"], ["Necessita substitui\xE7\xE3o", "Informar posi\xE7\xE3o", "70.22"], ["Outros", "Livre Texto", "70.23"]], "Pneu Carreta 1\xBA Eixo": [["Furado", "Informar posi\xE7\xE3o", "70.47"], ["Estourado", "Informar posi\xE7\xE3o", "70.48"], ["Cortado", "Informar posi\xE7\xE3o", "70.49"], ["Baixa press\xE3o", "Informar posi\xE7\xE3o", "70.50"], ["Vazio", "Informar posi\xE7\xE3o", "70.51"], ["Vazando", "Informar posi\xE7\xE3o", "70.52"], ["Desgaste irregular", "Informar posi\xE7\xE3o", "70.53"], ["Desgaste excessivo", "Informar posi\xE7\xE3o", "70.54"], ["Desgaste lateral", "Informar posi\xE7\xE3o", "70.55"], ["Desgaste central", "Informar posi\xE7\xE3o", "70.56"], ["Ombro desgastado", "Informar posi\xE7\xE3o", "70.57"], ["Sulco abaixo do limite", "Informar posi\xE7\xE3o", "70.58"], ["Lona aparente", "Informar posi\xE7\xE3o", "70.59"], ["Bolha", "Informar posi\xE7\xE3o", "70.60"], ["Carca\xE7a danificada", "Informar posi\xE7\xE3o", "70.61"], ["Tal\xE3o danificado", "Informar posi\xE7\xE3o", "70.62"], ["Banda soltando", "Informar posi\xE7\xE3o", "70.63"], ["Rachado", "Informar posi\xE7\xE3o", "70.64"], ["Ressecado", "Informar posi\xE7\xE3o", "70.65"], ["Necessita calibragem", "Informar posi\xE7\xE3o", "70.66"], ["Necessita substitui\xE7\xE3o", "Informar posi\xE7\xE3o", "70.67"], ["Outros", "Livre Texto", "70.68"]], "Pneu Carreta 2\xBA Eixo": [["Furado", "Informar posi\xE7\xE3o", "70.69"], ["Estourado", "Informar posi\xE7\xE3o", "70.70"], ["Cortado", "Informar posi\xE7\xE3o", "70.71"], ["Baixa press\xE3o", "Informar posi\xE7\xE3o", "70.72"], ["Vazio", "Informar posi\xE7\xE3o", "70.73"], ["Vazando", "Informar posi\xE7\xE3o", "70.74"], ["Desgaste irregular", "Informar posi\xE7\xE3o", "70.75"], ["Desgaste excessivo", "Informar posi\xE7\xE3o", "70.76"], ["Desgaste lateral", "Informar posi\xE7\xE3o", "70.77"], ["Desgaste central", "Informar posi\xE7\xE3o", "70.78"], ["Ombro desgastado", "Informar posi\xE7\xE3o", "70.79"], ["Sulco abaixo do limite", "Informar posi\xE7\xE3o", "70.80"], ["Lona aparente", "Informar posi\xE7\xE3o", "70.81"], ["Bolha", "Informar posi\xE7\xE3o", "70.82"], ["Carca\xE7a danificada", "Informar posi\xE7\xE3o", "70.83"], ["Tal\xE3o danificado", "Informar posi\xE7\xE3o", "70.84"], ["Banda soltando", "Informar posi\xE7\xE3o", "70.85"], ["Rachado", "Informar posi\xE7\xE3o", "70.86"], ["Ressecado", "Informar posi\xE7\xE3o", "70.87"], ["Necessita calibragem", "Informar posi\xE7\xE3o", "70.88"], ["Necessita substitui\xE7\xE3o", "Informar posi\xE7\xE3o", "70.89"], ["Outros", "Livre Texto", "70.90"]], "Pneu Carreta 3\xBA Eixo": [["Furado", "Informar posi\xE7\xE3o", "70.91"], ["Estourado", "Informar posi\xE7\xE3o", "70.92"], ["Cortado", "Informar posi\xE7\xE3o", "70.93"], ["Baixa press\xE3o", "Informar posi\xE7\xE3o", "70.94"], ["Vazio", "Informar posi\xE7\xE3o", "70.95"], ["Vazando", "Informar posi\xE7\xE3o", "70.96"], ["Desgaste irregular", "Informar posi\xE7\xE3o", "70.97"], ["Desgaste excessivo", "Informar posi\xE7\xE3o", "70.98"], ["Desgaste lateral", "Informar posi\xE7\xE3o", "70.99"], ["Desgaste central", "Informar posi\xE7\xE3o", "70100"], ["Ombro desgastado", "Informar posi\xE7\xE3o", "70101"], ["Sulco abaixo do limite", "Informar posi\xE7\xE3o", "70102"], ["Lona aparente", "Informar posi\xE7\xE3o", "70103"], ["Bolha", "Informar posi\xE7\xE3o", "70104"], ["Carca\xE7a danificada", "Informar posi\xE7\xE3o", "70105"], ["Tal\xE3o danificado", "Informar posi\xE7\xE3o", "70106"], ["Banda soltando", "Informar posi\xE7\xE3o", "70107"], ["Rachado", "Informar posi\xE7\xE3o", "70108"], ["Ressecado", "Informar posi\xE7\xE3o", "70109"], ["Necessita calibragem", "Informar posi\xE7\xE3o", "70110"], ["Necessita substitui\xE7\xE3o", "Informar posi\xE7\xE3o", "70111"], ["Outros", "Livre Texto", "70112"]], "Tampa da V\xE1lvula": [["Solta", "Informar posi\xE7\xE3o", "70113"], ["Quebrada", "Informar posi\xE7\xE3o", "70114"], ["Trincada", "Informar posi\xE7\xE3o", "70115"], ["Danificada", "Informar posi\xE7\xE3o", "70116"], ["Rosca danificada", "Informar posi\xE7\xE3o", "70117"], ["N\xE3o fixa", "Informar posi\xE7\xE3o", "70118"], ["Ausente", "Informar posi\xE7\xE3o", "70119"], ["Necessita substitui\xE7\xE3o", "Informar posi\xE7\xE3o", "70120"], ["Outros", "Livre Texto", "70121"]], "V\xE1lvula do Pneu": [["Vazando", "Informar posi\xE7\xE3o", "70122"], ["Quebrada", "Informar posi\xE7\xE3o", "70123"], ["Trincada", "Informar posi\xE7\xE3o", "70124"], ["Torta", "Informar posi\xE7\xE3o", "70125"], ["Solta", "Informar posi\xE7\xE3o", "70126"], ["Obstru\xEDda", "Informar posi\xE7\xE3o", "70127"], ["Miolo vazando", "Informar posi\xE7\xE3o", "70128"], ["Miolo danificado", "Informar posi\xE7\xE3o", "70129"], ["Rosca danificada", "Informar posi\xE7\xE3o", "70130"], ["Ausente", "Informar posi\xE7\xE3o", "70131"], ["Danificada", "Informar posi\xE7\xE3o", "70132"], ["Necessita substitui\xE7\xE3o", "Informar posi\xE7\xE3o", "70133"], ["Outros", "Livre Texto", "70134"]], "Prolongador de V\xE1lvula": [["Vazando", "Informar posi\xE7\xE3o", "70135"], ["Solto", "Informar posi\xE7\xE3o", "70136"], ["Quebrado", "Informar posi\xE7\xE3o", "70137"], ["Trincado", "Informar posi\xE7\xE3o", "70138"], ["Torto", "Informar posi\xE7\xE3o", "70139"], ["Obstru\xEDdo", "Informar posi\xE7\xE3o", "70140"], ["Rosca danificada", "Informar posi\xE7\xE3o", "70141"], ["Desconectado", "Informar posi\xE7\xE3o", "70142"], ["Ausente", "Informar posi\xE7\xE3o", "70143"], ["Danificado", "Informar posi\xE7\xE3o", "70144"], ["Necessita substitui\xE7\xE3o", "Informar posi\xE7\xE3o", "70145"], ["Outros", "Livre Texto", "70146"]], "Roda Dianteira": [["Trincada", "Informar posi\xE7\xE3o", "70147"], ["Empenada", "Informar posi\xE7\xE3o", "70148"], ["Amassada", "Informar posi\xE7\xE3o", "70149"], ["Quebrada", "Informar posi\xE7\xE3o", "70150"], ["Furo de fixa\xE7\xE3o danificado", "Informar posi\xE7\xE3o", "70151"], ["Com corros\xE3o", "Informar posi\xE7\xE3o", "70152"], ["Vazando", "Informar posi\xE7\xE3o", "70153"], ["Danificada", "Informar posi\xE7\xE3o", "70154"], ["Necessita substitui\xE7\xE3o", "Informar posi\xE7\xE3o", "70155"], ["Outros", "Livre Texto", "70156"]], "Roda de Tra\xE7\xE3o": [["Trincada", "Informar posi\xE7\xE3o", "70157"], ["Empenada", "Informar posi\xE7\xE3o", "70158"], ["Amassada", "Informar posi\xE7\xE3o", "70159"], ["Quebrada", "Informar posi\xE7\xE3o", "70160"], ["Furo de fixa\xE7\xE3o danificado", "Informar posi\xE7\xE3o", "70161"], ["Com corros\xE3o", "Informar posi\xE7\xE3o", "70162"], ["Vazando", "Informar posi\xE7\xE3o", "70163"], ["Danificada", "Informar posi\xE7\xE3o", "70164"], ["Necessita substitui\xE7\xE3o", "Informar posi\xE7\xE3o", "70165"], ["Outros", "Livre Texto", "70166"]], "Roda Carreta 1\xBA Eixo": [["Trincada", "Informar posi\xE7\xE3o", "70167"], ["Empenada", "Informar posi\xE7\xE3o", "70168"], ["Amassada", "Informar posi\xE7\xE3o", "70169"], ["Quebrada", "Informar posi\xE7\xE3o", "70170"], ["Furo de fixa\xE7\xE3o danificado", "Informar posi\xE7\xE3o", "70171"], ["Com corros\xE3o", "Informar posi\xE7\xE3o", "70172"], ["Vazando", "Informar posi\xE7\xE3o", "70173"], ["Danificada", "Informar posi\xE7\xE3o", "70174"], ["Necessita substitui\xE7\xE3o", "Informar posi\xE7\xE3o", "70175"], ["Outros", "Livre Texto", "70176"]], "Roda Carreta 2\xBA Eixo": [["Trincada", "Informar posi\xE7\xE3o", "70177"], ["Empenada", "Informar posi\xE7\xE3o", "70178"], ["Amassada", "Informar posi\xE7\xE3o", "70179"], ["Quebrada", "Informar posi\xE7\xE3o", "70180"], ["Furo de fixa\xE7\xE3o danificado", "Informar posi\xE7\xE3o", "70181"], ["Com corros\xE3o", "Informar posi\xE7\xE3o", "70182"], ["Vazando", "Informar posi\xE7\xE3o", "70183"], ["Danificada", "Informar posi\xE7\xE3o", "70184"], ["Necessita substitui\xE7\xE3o", "Informar posi\xE7\xE3o", "70185"], ["Outros", "Livre Texto", "70186"]], "Roda Carreta 3\xBA Eixo": [["Trincada", "Informar posi\xE7\xE3o", "70187"], ["Empenada", "Informar posi\xE7\xE3o", "70188"], ["Amassada", "Informar posi\xE7\xE3o", "70189"], ["Quebrada", "Informar posi\xE7\xE3o", "70190"], ["Furo de fixa\xE7\xE3o danificado", "Informar posi\xE7\xE3o", "70191"], ["Com corros\xE3o", "Informar posi\xE7\xE3o", "70192"], ["Vazando", "Informar posi\xE7\xE3o", "70193"], ["Danificada", "Informar posi\xE7\xE3o", "70194"], ["Necessita substitui\xE7\xE3o", "Informar posi\xE7\xE3o", "70195"], ["Outros", "Livre Texto", "70196"]], Rod\u00EDzio: [["Dianteiro", "Informar posi\xE7\xE3o origem/destino", "70197"], ["Tra\xE7\xE3o", "Informar posi\xE7\xE3o origem/destino", "70198"], ["Carreta 1\xBA Eixo", "Informar posi\xE7\xE3o origem/destino", "70199"], ["Carreta 2\xBA Eixo", "Informar posi\xE7\xE3o origem/destino", "70200"], ["Carreta 3\xBA Eixo", "Informar posi\xE7\xE3o origem/destino", "70201"], ["Entre eixos da carreta", "Informar origem/destino", "70202"], ["Interno para externo", "Informar posi\xE7\xE3o", "70203"], ["Externo para interno", "Informar posi\xE7\xE3o", "70204"], ["Por desgaste irregular", "Informar posi\xE7\xE3o", "70205"], ["Preventivo", "Digitar KM atual", "70206"], ["Outros", "Livre Texto", "70207"]], Alinhamento: [["Dianteiro", "Digitar KM atual", "70208"], ["Tra\xE7\xE3o", "Digitar KM atual", "70209"], ["Carreta 1\xBA Eixo", "Digitar KM atual", "70210"], ["Carreta 2\xBA Eixo", "Digitar KM atual", "70211"], ["Carreta 3\xBA Eixo", "Digitar KM atual", "70212"], ["Cavalo completo", "Digitar KM atual", "70213"], ["Carreta completa", "Digitar KM atual", "70214"], ["Conjunto completo", "Digitar KM atual", "70215"], ["Por desgaste irregular", "Informar posi\xE7\xE3o", "70216"], ["Ve\xEDculo puxando para esquerda", "Livre Texto", "70217"], ["Ve\xEDculo puxando para direita", "Livre Texto", "70218"], ["Volante desalinhado", "Livre Texto", "70219"], ["Preventivo", "Digitar KM atual", "70220"], ["Outros", "Livre Texto", "70221"]] } } } }, execucoes: ["Conferiu", "Trocou", "Regulou", "Apertou", "Sem falha"] };

  // components/DefeitoPicker.tsx
  var inp = { background: "var(--bg-alt)", border: "1px solid var(--border)", color: "var(--text)" };
  var lab = "text-[9px] font-bold uppercase tracking-wider";
  var GRUPOS = ["MEC", "ELE", "FUN", "BAU", "BOR"];
  function rotuloCompl(c) {
    const t = (c || "").trim();
    if (!t || /livre texto/i.test(t)) return "Observa\xE7\xE3o (texto livre)";
    return t.replace(/^informar\s+/i, "").replace(/^digitar\s+/i, "").replace(/^./, (m) => m.toUpperCase());
  }
  function DefeitoPicker() {
    const M = matriz_default;
    const origens = M.origens;
    const [origem, setOrigem] = (0, import_react2.useState)("SOS");
    const [grupo, setGrupo] = (0, import_react2.useState)("");
    const [sistema, setSistema] = (0, import_react2.useState)("");
    const [item, setItem] = (0, import_react2.useState)("");
    const [falha, setFalha] = (0, import_react2.useState)("");
    const [compl, setCompl] = (0, import_react2.useState)("");
    const g = grupo ? M.matriz[grupo] : null;
    const sistemas = g ? Object.keys(g.sistemas) : [];
    const sis = sistema || (sistemas.length === 1 ? sistemas[0] : "");
    const itens = g && sis ? Object.keys(g.sistemas[sis]) : [];
    const falhas = g && sis && item ? g.sistemas[sis][item] : [];
    const f = falhas.find((x) => x[0] === falha);
    const codigo = f ? f[2] : "";
    const grupoInfo = (0, import_react2.useMemo)(() => M.grupos.reduce((a, x) => {
      a[x.sigla] = x;
      return a;
    }, {}), []);
    return /* @__PURE__ */ React.createElement("div", { className: "rounded-lg p-3 space-y-3", style: { border: "1px solid var(--border-bright)", background: "rgba(37,214,71,.04)" } }, /* @__PURE__ */ React.createElement("div", { className: "text-[10px] font-bold uppercase tracking-wider", style: { color: "var(--text)" } }, "Defeito (Matriz de Defeitos)"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: lab, style: { color: "var(--text-muted)" } }, "Origem da O.S."), /* @__PURE__ */ React.createElement("select", { name: "origem", required: true, value: origem, onChange: (e) => setOrigem(e.target.value), className: "mt-1 w-full px-3 py-2 rounded-lg text-sm", style: inp }, origens.map((o) => /* @__PURE__ */ React.createElement("option", { key: o.sigla, value: o.sigla }, o.sigla, " \u2014 ", o.nome, " (", o.tipo, ")")))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: lab, style: { color: "var(--text-muted)" } }, "Grupo"), /* @__PURE__ */ React.createElement("select", { name: "grupo_os", required: true, value: grupo, onChange: (e) => {
      setGrupo(e.target.value);
      setSistema("");
      setItem("");
      setFalha("");
      setCompl("");
    }, className: "mt-1 w-full px-3 py-2 rounded-lg text-sm", style: inp }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Selecione\u2026"), GRUPOS.map((s) => /* @__PURE__ */ React.createElement("option", { key: s, value: s }, s, " \u2014 ", M.matriz[s].nome))))), grupo && grupoInfo[grupo] && /* @__PURE__ */ React.createElement("div", { className: "text-[9px]", style: { color: "var(--text-soft)" } }, grupoInfo[grupo].info), grupo && sistemas.length > 1 && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: lab, style: { color: "var(--text-muted)" } }, "Sistema"), /* @__PURE__ */ React.createElement("select", { name: "sistema", required: true, value: sistema, onChange: (e) => {
      setSistema(e.target.value);
      setItem("");
      setFalha("");
      setCompl("");
    }, className: "mt-1 w-full px-3 py-2 rounded-lg text-sm", style: inp }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Selecione\u2026"), sistemas.map((s) => /* @__PURE__ */ React.createElement("option", { key: s, value: s }, s)))), grupo && sistemas.length === 1 && /* @__PURE__ */ React.createElement("input", { type: "hidden", name: "sistema", value: sistemas[0] }), sis && /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: lab, style: { color: "var(--text-muted)" } }, "Item"), /* @__PURE__ */ React.createElement("select", { name: "item_defeito", required: true, value: item, onChange: (e) => {
      setItem(e.target.value);
      setFalha("");
      setCompl("");
    }, className: "mt-1 w-full px-3 py-2 rounded-lg text-sm", style: inp }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Selecione\u2026"), itens.map((s) => /* @__PURE__ */ React.createElement("option", { key: s, value: s }, s)))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: lab, style: { color: "var(--text-muted)" } }, "Falha"), /* @__PURE__ */ React.createElement("select", { name: "falha", required: true, value: falha, onChange: (e) => {
      setFalha(e.target.value);
      setCompl("");
    }, disabled: !item, className: "mt-1 w-full px-3 py-2 rounded-lg text-sm", style: inp }, /* @__PURE__ */ React.createElement("option", { value: "" }, item ? "Selecione\u2026" : "Escolha o item"), falhas.map((x) => /* @__PURE__ */ React.createElement("option", { key: x[2] + x[0], value: x[0] }, x[0]))))), f && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: lab, style: { color: "var(--text-muted)" } }, rotuloCompl(f[1])), /* @__PURE__ */ React.createElement("input", { name: "complemento_defeito", required: !/livre texto/i.test(f[1] || ""), value: compl, onChange: (e) => setCompl(e.target.value), placeholder: rotuloCompl(f[1]), inputMode: /km|tens/i.test(f[1] || "") ? "numeric" : void 0, className: "mt-1 w-full px-3 py-2 rounded-lg text-sm", style: inp }), /* @__PURE__ */ React.createElement("input", { type: "hidden", name: "cod_defeito", value: codigo }), /* @__PURE__ */ React.createElement("div", { className: "text-[9px] mt-1", style: { color: "var(--text-soft)" } }, "C\xF3digo do defeito: ", /* @__PURE__ */ React.createElement("b", null, codigo))));
  }

  // components/Configuracoes.tsx
  var import_react3 = __toESM(require_react());
  init_api();

  // lib/papeis.ts
  var PAPEIS = {
    operador: { rotulo: "Operador", descricao: "consulta", abas: ["dashboard", "atendimento", "acompanhamento", "ordens"] },
    gerente: { rotulo: "Gerente", descricao: "edita", abas: ["dashboard", "atendimento", "acompanhamento", "prestadores", "pecas", "ordens", "log", "cancelamentos"] },
    admin: { rotulo: "Admin", descricao: "total", abas: "todas" }
  };
  var ORDEM_PAPEIS = ["operador", "gerente", "admin"];
  function papelValido2(r) {
    return papelValido(r);
  }
  function rotuloPapel(r) {
    return PAPEIS[papelValido2(r)].rotulo;
  }
  var OPCOES_PAPEL = ORDEM_PAPEIS.map((id) => ({ v: id, l: `${PAPEIS[id].rotulo} (${PAPEIS[id].descricao})` }));
  function papelVeAba(r, aba) {
    const abas = PAPEIS[papelValido2(r)].abas;
    return abas === "todas" || abas.includes(aba);
  }

  // components/Configuracoes.tsx
  var S = ({ children, title }) => /* @__PURE__ */ React.createElement("div", { className: "rounded-xl p-4 mb-4", style: { background: "var(--bg-card)", border: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("div", { className: "text-[10px] font-bold uppercase tracking-widest mb-3", style: { color: "var(--text-muted)" } }, title), children);
  var Field = ({ label, children }) => /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "text-[9px] uppercase tracking-wider font-bold", style: { color: "var(--text-muted)" } }, label), /* @__PURE__ */ React.createElement("div", { className: "mt-1" }, children));
  var IS = { background: "var(--bg-alt)", border: "1px solid var(--border)", color: "var(--text)" };
  function Configuracoes({ admin = false }) {
    const [cfg, setCfg] = (0, import_react3.useState)({});
    const [bases, setBases] = (0, import_react3.useState)([]);
    const [users, setUsers] = (0, import_react3.useState)([]);
    const [msg, setMsg] = (0, import_react3.useState)("");
    const [novaBase, setNovaBase] = (0, import_react3.useState)({ nome: "", endereco: "", lat: "", lng: "" });
    async function carregar() {
      const c = await api("/configuracoes");
      setCfg(c?.data || {});
      if (!admin) return;
      const b = await api("/bases");
      setBases(b?.data || []);
      const u = await api("/users");
      setUsers(u?.data || []);
    }
    (0, import_react3.useEffect)(() => {
      carregar();
    }, []);
    function set(k, v) {
      setCfg((p) => ({ ...p, [k]: v }));
    }
    async function salvar2() {
      const r = await api("/configuracoes", { method: "PUT", body: JSON.stringify(cfg) });
      setMsg(r?.success ? "Configura\xE7\xF5es salvas" : "N\xE3o foi poss\xEDvel salvar");
      setTimeout(() => setMsg(""), 3e3);
    }
    async function salvarBase(b) {
      await api(`/bases/${b.id}`, { method: "PUT", body: JSON.stringify({ nome: b.nome, lat: Number(b.lat), lng: Number(b.lng), endereco: b.endereco || "" }) });
      carregar();
    }
    async function excluirBase(id) {
      if (!confirm("Remover esta base?")) return;
      await api(`/bases/${id}`, { method: "DELETE" });
      carregar();
    }
    async function criarBase() {
      if (!novaBase.nome || !novaBase.lat || !novaBase.lng) {
        alert("Informe nome, latitude e longitude");
        return;
      }
      await api("/bases", { method: "POST", body: JSON.stringify({ ...novaBase, lat: Number(novaBase.lat), lng: Number(novaBase.lng) }) });
      setNovaBase({ nome: "", endereco: "", lat: "", lng: "" });
      carregar();
    }
    async function mudarPerfil(u, role) {
      await api(`/users/${u.id}`, { method: "PUT", body: JSON.stringify({ nome: u.nome, role, email: u.email }) });
      carregar();
    }
    async function resetarSenha(u) {
      const s1 = prompt(`Nova senha para ${u.email} (m\xEDnimo 8 caracteres):`);
      if (!s1) return;
      if (s1.length < 8) {
        alert("A senha precisa ter pelo menos 8 caracteres.");
        return;
      }
      const r = await api(`/usuarios/${encodeURIComponent(u.id)}/senha`, { method: "POST", body: JSON.stringify({ senha: s1 }) });
      alert(r && r.success ? "Senha definida. Passe a senha para o usu\xE1rio por um canal seguro." : "N\xE3o foi poss\xEDvel definir a senha: " + (r && r.detail || "erro"));
      carregar();
    }
    async function excluirUser(u) {
      if (u.role === "admin") {
        alert("Usu\xE1rio administrador n\xE3o pode ser exclu\xEDdo");
        return;
      }
      if (!confirm(`Excluir ${u.email}?`)) return;
      await api(`/users/${u.id}`, { method: "DELETE" });
      carregar();
    }
    return /* @__PURE__ */ React.createElement("div", { className: "max-w-5xl" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center justify-between gap-3 mb-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-base font-bold", style: { color: "var(--text)" } }, "Configura\xE7\xF5es"), /* @__PURE__ */ React.createElement("div", { className: "text-xs", style: { color: "var(--text-muted)" } }, "Vis\xEDvel apenas para administradores")), admin && /* @__PURE__ */ React.createElement("button", { onClick: salvar2, className: "px-6 py-2 rounded-lg text-xs font-bold cursor-pointer", style: { background: "var(--accent-green)", color: "#fff" } }, "Salvar configura\xE7\xF5es")), msg && /* @__PURE__ */ React.createElement("div", { className: "mb-3 px-3 py-2 rounded-lg text-[11px] font-bold", style: { background: "rgba(37,214,71,.12)", color: "#146E1F" } }, msg), /* @__PURE__ */ React.createElement(S, { title: "Socorro" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3" }, /* @__PURE__ */ React.createElement(Field, { label: "Raio de busca (km)" }, /* @__PURE__ */ React.createElement("input", { type: "number", value: cfg.raio_km ?? 20, onChange: (e) => set("raio_km", Number(e.target.value)), className: "w-full px-3 py-2 rounded-lg text-sm", style: IS })), /* @__PURE__ */ React.createElement(Field, { label: "Escalonar supervisor (h)" }, /* @__PURE__ */ React.createElement("input", { type: "number", value: cfg.escalonamento_supervisor_h ?? 2, onChange: (e) => set("escalonamento_supervisor_h", Number(e.target.value)), className: "w-full px-3 py-2 rounded-lg text-sm", style: IS })), /* @__PURE__ */ React.createElement(Field, { label: "Escalonar ger\xEAncia (h)" }, /* @__PURE__ */ React.createElement("input", { type: "number", value: cfg.escalonamento_gerencia_h ?? 4, onChange: (e) => set("escalonamento_gerencia_h", Number(e.target.value)), className: "w-full px-3 py-2 rounded-lg text-sm", style: IS })))), /* @__PURE__ */ React.createElement(S, { title: "Resumo di\xE1rio por e-mail" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3" }, /* @__PURE__ */ React.createElement(Field, { label: "Hor\xE1rio" }, /* @__PURE__ */ React.createElement("input", { value: cfg.resumo_horario ?? "07:30", onChange: (e) => set("resumo_horario", e.target.value), className: "w-full px-3 py-2 rounded-lg text-sm font-mono", style: IS })), /* @__PURE__ */ React.createElement(Field, { label: "Ativo" }, /* @__PURE__ */ React.createElement("button", { onClick: () => set("resumo_ativo", !cfg.resumo_ativo), className: "px-4 py-2 rounded-lg text-xs font-bold cursor-pointer w-full", style: { background: cfg.resumo_ativo ? "var(--accent-green)" : "var(--bg-alt)", color: cfg.resumo_ativo ? "#fff" : "var(--text-muted)", border: "1px solid var(--border)" } }, cfg.resumo_ativo ? "LIGADO" : "DESLIGADO")), /* @__PURE__ */ React.createElement(Field, { label: "Intervalo Sascar (min)" }, /* @__PURE__ */ React.createElement("input", { type: "number", value: cfg.sascar_intervalo_min ?? 5, onChange: (e) => set("sascar_intervalo_min", Number(e.target.value)), className: "w-full px-3 py-2 rounded-lg text-sm", style: IS })), /* @__PURE__ */ React.createElement(Field, { label: "Exibir bases" }, /* @__PURE__ */ React.createElement("button", { onClick: () => set("mostrar_bases", !cfg.mostrar_bases), className: "px-4 py-2 rounded-lg text-xs font-bold cursor-pointer w-full", style: { background: cfg.mostrar_bases ? "var(--accent-green)" : "var(--bg-alt)", color: cfg.mostrar_bases ? "#fff" : "var(--text-muted)", border: "1px solid var(--border)" } }, cfg.mostrar_bases ? "SIM" : "N\xC3O"))), /* @__PURE__ */ React.createElement("div", { className: "mt-3" }, /* @__PURE__ */ React.createElement(Field, { label: "E-mails (separados por v\xEDrgula)" }, /* @__PURE__ */ React.createElement("input", { value: cfg.resumo_emails ?? "", onChange: (e) => set("resumo_emails", e.target.value), className: "w-full px-3 py-2 rounded-lg text-sm", style: IS })))), admin && /* @__PURE__ */ React.createElement(S, { title: "Bases" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-2 mb-3" }, /* @__PURE__ */ React.createElement("input", { placeholder: "Nome", value: novaBase.nome, onChange: (e) => setNovaBase({ ...novaBase, nome: e.target.value }), className: "px-3 py-2 rounded-lg text-xs", style: IS }), /* @__PURE__ */ React.createElement("input", { placeholder: "Endere\xE7o", value: novaBase.endereco, onChange: (e) => setNovaBase({ ...novaBase, endereco: e.target.value }), className: "px-3 py-2 rounded-lg text-xs", style: IS }), /* @__PURE__ */ React.createElement("input", { placeholder: "Latitude", value: novaBase.lat, onChange: (e) => setNovaBase({ ...novaBase, lat: e.target.value }), className: "px-3 py-2 rounded-lg text-xs", style: IS }), /* @__PURE__ */ React.createElement("input", { placeholder: "Longitude", value: novaBase.lng, onChange: (e) => setNovaBase({ ...novaBase, lng: e.target.value }), className: "px-3 py-2 rounded-lg text-xs", style: IS }), /* @__PURE__ */ React.createElement("button", { onClick: criarBase, className: "px-4 py-2 rounded-lg text-xs font-bold cursor-pointer", style: { background: "var(--accent-green)", color: "#fff" } }, "Adicionar")), /* @__PURE__ */ React.createElement("div", { className: "max-h-72 overflow-y-auto" }, bases.map((b) => /* @__PURE__ */ React.createElement("div", { key: b.id, className: "grid grid-cols-2 sm:grid-cols-[8rem_minmax(0,1fr)_6rem_6rem_auto_auto] items-center gap-2 py-2", style: { borderBottom: "1px dashed var(--border)" } }, /* @__PURE__ */ React.createElement("input", { "aria-label": "Nome da base", value: b.nome || "", onChange: (e) => setBases((p) => p.map((x) => x.id === b.id ? { ...x, nome: e.target.value } : x)), className: "col-span-2 sm:col-span-1 min-w-0 px-2 py-1 rounded text-xs", style: IS }), /* @__PURE__ */ React.createElement("input", { "aria-label": "Endere\xE7o", value: b.endereco || "", onChange: (e) => setBases((p) => p.map((x) => x.id === b.id ? { ...x, endereco: e.target.value } : x)), className: "col-span-2 sm:col-span-1 min-w-0 px-2 py-1 rounded text-xs", style: IS }), /* @__PURE__ */ React.createElement("input", { "aria-label": "Latitude", value: b.lat ?? "", onChange: (e) => setBases((p) => p.map((x) => x.id === b.id ? { ...x, lat: e.target.value } : x)), className: "min-w-0 px-2 py-1 rounded text-xs font-mono", style: IS }), /* @__PURE__ */ React.createElement("input", { "aria-label": "Longitude", value: b.lng ?? "", onChange: (e) => setBases((p) => p.map((x) => x.id === b.id ? { ...x, lng: e.target.value } : x)), className: "min-w-0 px-2 py-1 rounded text-xs font-mono", style: IS }), /* @__PURE__ */ React.createElement("button", { onClick: () => salvarBase(b), className: "px-2 py-1 rounded text-[10px] font-bold cursor-pointer", style: { color: "var(--accent-green)", border: "1px solid var(--border)" } }, "Salvar"), /* @__PURE__ */ React.createElement("button", { onClick: () => excluirBase(b.id), className: "px-2 py-1 rounded text-[10px] font-bold cursor-pointer", style: { color: "#C62828", border: "1px solid var(--border)" } }, "Excluir"))))), admin && /* @__PURE__ */ React.createElement(S, { title: "Usu\xE1rios" }, /* @__PURE__ */ React.createElement("div", { className: "max-h-80 overflow-y-auto" }, users.map((u) => /* @__PURE__ */ React.createElement("div", { key: u.id, className: "flex flex-wrap items-center gap-2 py-2", style: { borderBottom: "1px dashed var(--border)" } }, /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-0 basis-full sm:basis-auto" }, /* @__PURE__ */ React.createElement("div", { className: "text-xs font-bold truncate", style: { color: "var(--text)" } }, u.nome || u.email), /* @__PURE__ */ React.createElement("div", { className: "text-[10px] truncate", style: { color: "var(--text-muted)" } }, u.email)), /* @__PURE__ */ React.createElement("select", { "aria-label": "N\xEDvel de acesso", value: u.role || "operador", onChange: (e) => mudarPerfil(u, e.target.value), disabled: u.role === "admin", className: "px-2 py-1 rounded text-[10px] font-bold", style: IS }, ORDEM_PAPEIS.map((p) => /* @__PURE__ */ React.createElement("option", { key: p, value: p }, rotuloPapel(p)))), /* @__PURE__ */ React.createElement("button", { onClick: () => resetarSenha(u), className: "px-2 py-1 rounded text-[10px] font-bold cursor-pointer", style: { color: "var(--text-muted)", border: "1px solid var(--border)" } }, "Senha"), /* @__PURE__ */ React.createElement("button", { onClick: () => excluirUser(u), disabled: u.role === "admin", className: "px-2 py-1 rounded text-[10px] font-bold cursor-pointer", style: { color: u.role === "admin" ? "var(--text-soft)" : "#C62828", border: "1px solid var(--border)" } }, "Excluir"))))));
  }

  // components/Cancelamentos.tsx
  var import_react4 = __toESM(require_react());
  init_api();
  function dataHora2(iso) {
    if (!iso) return "\u2014";
    try {
      return new Date(iso).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
    } catch {
      return "\u2014";
    }
  }
  function Cancelamentos({ podeAprovar = false }) {
    const [itens, setItens] = (0, import_react4.useState)([]);
    const [carregando, setCarregando] = (0, import_react4.useState)(true);
    const [msg, setMsg] = (0, import_react4.useState)("");
    async function carregar() {
      setCarregando(true);
      const r = await api("/ordens/cancelamentos/pendentes");
      const arr = r?.data || (Array.isArray(r) ? r : []);
      setItens(Array.isArray(arr) ? arr : []);
      setCarregando(false);
    }
    (0, import_react4.useEffect)(() => {
      carregar();
    }, []);
    async function aprovar(id) {
      if (!confirm("Aprovar o cancelamento desta O.S.?")) return;
      const r = await api(`/ordens/${id}/cancelar/aprovar`, { method: "POST" });
      setMsg(r?.success ? "Cancelamento aprovado" : r?.detail || "N\xE3o foi poss\xEDvel aprovar");
      setTimeout(() => setMsg(""), 3e3);
      carregar();
    }
    async function rejeitar(item) {
      if (!confirm("Rejeitar o pedido? A O.S. continua ativa.")) return;
      await api(`/ordens/${item.id}`, { method: "PUT", body: JSON.stringify({ cancelamento_solicitado: false, cancelamento_motivo: "" }) });
      setMsg("Pedido rejeitado");
      setTimeout(() => setMsg(""), 3e3);
      carregar();
    }
    return /* @__PURE__ */ React.createElement("div", { className: "max-w-4xl" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-base font-bold", style: { color: "var(--text)" } }, "Cancelamentos pendentes"), /* @__PURE__ */ React.createElement("div", { className: "text-xs", style: { color: "var(--text-muted)" } }, podeAprovar ? "Pedidos de exclus\xE3o aguardando sua aprova\xE7\xE3o" : "Pedidos de exclus\xE3o aguardando a aprova\xE7\xE3o de um administrador")), /* @__PURE__ */ React.createElement("button", { onClick: carregar, className: "px-3 py-2 rounded-lg text-[11px] font-bold cursor-pointer", style: { border: "1px solid var(--border-bright)", color: "var(--text-muted)" } }, "Atualizar")), msg && /* @__PURE__ */ React.createElement("div", { className: "mb-3 px-3 py-2 rounded-lg text-[11px] font-bold", style: { background: "rgba(37,214,71,.12)", color: "#146E1F" } }, msg), carregando ? /* @__PURE__ */ React.createElement("p", { className: "text-center py-8 text-sm", style: { color: "var(--text-muted)" } }, "Carregando...") : itens.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "rounded-xl p-8 text-center", style: { background: "var(--bg-card)", border: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("p", { className: "text-sm", style: { color: "var(--text-muted)" } }, "Nenhum pedido aguardando aprova\xE7\xE3o.")) : itens.map((o) => /* @__PURE__ */ React.createElement("div", { key: o.id, className: "rounded-xl p-4 mb-3", style: { background: "var(--bg-card)", border: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-3 flex-wrap" }, /* @__PURE__ */ React.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-bold", style: { color: "var(--text)" } }, "O.S. ", o.os || "\u2014", " ", o.placa ? /* @__PURE__ */ React.createElement("span", { className: "font-mono", style: { color: "var(--accent-green)" } }, "\xB7 ", o.placa) : null), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] mt-1", style: { color: "var(--text-muted)" } }, "Solicitado por ", /* @__PURE__ */ React.createElement("b", { style: { color: "var(--text)" } }, o.cancelamento_solicitado_por || "\u2014"), " em ", dataHora2(o.cancelamento_solicitado_em)), /* @__PURE__ */ React.createElement("div", { className: "text-[12px] mt-2 p-2 rounded-lg", style: { background: "var(--bg-alt)", color: "var(--text)" } }, /* @__PURE__ */ React.createElement("b", null, "Motivo:"), " ", o.cancelamento_motivo || "n\xE3o informado")), podeAprovar && /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 shrink-0" }, /* @__PURE__ */ React.createElement("button", { onClick: () => aprovar(o.id), className: "px-4 py-2 rounded-lg text-xs font-bold cursor-pointer", style: { background: "var(--accent-green)", color: "#fff" } }, "Aprovar"), /* @__PURE__ */ React.createElement("button", { onClick: () => rejeitar(o), className: "px-4 py-2 rounded-lg text-xs font-bold cursor-pointer", style: { border: "1px solid #C62828", color: "#C62828" } }, "Rejeitar"))))));
  }

  // app/page.tsx
  init_api();

  // components/ImportarPlanilha.tsx
  var import_react5 = __toESM(require_react());
  init_api();
  var TEXTOS = {
    prestadores: { rota: "/prestadores/import", coisa: "prestador(es)", dica: "Uma linha por prestador. Prestador com CNPJ/CPF j\xE1 cadastrado (ou, sem CNPJ, com o mesmo nome e cidade) \xE9 ignorado." },
    ordens: { rota: "/ordens/import", coisa: "O.S.", dica: 'Mesmas colunas da exporta\xE7\xE3o "Ordens de servi\xE7o (Excel)". N\xFAmero de O.S. que j\xE1 existe \xE9 ignorado; O.S. sem n\xFAmero recebe o pr\xF3ximo livre.' }
  };
  function baixar(nome, blob) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nome;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 1e3);
  }
  function ListaIgnorados({ titulo, itens, cor }) {
    if (!itens.length) return null;
    return /* @__PURE__ */ React.createElement("div", { className: "text-left" }, /* @__PURE__ */ React.createElement("div", { className: "text-xs font-bold mb-1", style: { color: cor } }, titulo, " (", itens.length, ")"), /* @__PURE__ */ React.createElement("ul", { className: "max-h-48 overflow-y-auto rounded-lg text-xs divide-y", style: { border: "1px solid var(--border)", background: "var(--bg-alt)" } }, itens.slice(0, 200).map((x, i) => /* @__PURE__ */ React.createElement("li", { key: i, className: "px-3 py-2", style: { borderColor: "var(--border)", color: "var(--text)" } }, /* @__PURE__ */ React.createElement("b", null, "Linha ", x.linha), x.nome ? ` \xB7 ${x.nome}` : "", ": ", /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text-muted)" } }, x.motivo))), itens.length > 200 && /* @__PURE__ */ React.createElement("li", { className: "px-3 py-2", style: { color: "var(--text-muted)" } }, "\u2026 e mais ", itens.length - 200)));
  }
  function ImportarPlanilha({ tipo, onConcluir }) {
    const T = TEXTOS[tipo];
    const [arquivo, setArquivo] = (0, import_react5.useState)("");
    const [linhas, setLinhas] = (0, import_react5.useState)(null);
    const [previa, setPrevia] = (0, import_react5.useState)(null);
    const [resultado, setResultado] = (0, import_react5.useState)(null);
    const [ocupado, setOcupado] = (0, import_react5.useState)(false);
    const [erro, setErro] = (0, import_react5.useState)("");
    async function escolher(e) {
      const f = e.target.files?.[0];
      e.target.value = "";
      if (!f) return;
      setErro("");
      setPrevia(null);
      setResultado(null);
      setLinhas(null);
      setArquivo(f.name);
      setOcupado(true);
      try {
        const l = await lerPlanilha(f);
        if (!l.length) {
          setErro("A planilha est\xE1 vazia (a 1\xAA linha deve ser o cabe\xE7alho).");
          return;
        }
        const r = await api(T.rota, { method: "POST", body: JSON.stringify({ linhas: l, simular: true }) });
        if (r.detail || r.prontos === void 0) {
          setErro(r.detail || "N\xE3o foi poss\xEDvel ler a planilha.");
          return;
        }
        setLinhas(l);
        setPrevia(r);
      } catch (x) {
        setErro(x && x.message || "N\xE3o foi poss\xEDvel ler o arquivo.");
      } finally {
        setOcupado(false);
      }
    }
    async function confirmar() {
      if (!linhas) return;
      setOcupado(true);
      try {
        const r = await api(T.rota, { method: "POST", body: JSON.stringify({ linhas }) });
        if (r.importados === void 0) {
          setErro(r.detail || "A importa\xE7\xE3o n\xE3o foi conclu\xEDda.");
          return;
        }
        setResultado(r);
        setPrevia(null);
        setLinhas(null);
        onConcluir();
      } finally {
        setOcupado(false);
      }
    }
    const botao = "inline-flex items-center justify-center gap-2 px-4 py-2 min-h-11 rounded-lg text-sm font-bold cursor-pointer";
    return /* @__PURE__ */ React.createElement("div", { className: "space-y-4 text-center" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-left", style: { color: "var(--text-muted)" } }, T.dica, " Nada do que j\xE1 existe \xE9 apagado ou alterado."), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap justify-center gap-3" }, tipo === "prestadores" ? /* @__PURE__ */ React.createElement("a", { href: "modelo_cadastro_prestadores.xlsx", download: true, className: botao, style: { border: "2px solid var(--accent-green)", color: "var(--accent-green)" } }, "Baixar modelo Excel") : /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => {
      try {
        baixar("modelo_importacao_os.xlsx", modeloOrdensBlob());
      } catch (x) {
        setErro(x.message);
      }
    }, className: botao, style: { border: "2px solid var(--accent-green)", color: "var(--accent-green)", background: "transparent" } }, "Baixar modelo Excel"), /* @__PURE__ */ React.createElement("label", { className: botao, style: { background: "var(--accent-green)", color: "#fff", opacity: ocupado ? 0.6 : 1 } }, ocupado && !previa ? "Lendo\u2026" : "Escolher arquivo (.xlsx ou .csv)", /* @__PURE__ */ React.createElement("input", { type: "file", accept: ".xlsx,.xls,.csv", className: "hidden", disabled: ocupado, onChange: escolher }))), arquivo && /* @__PURE__ */ React.createElement("div", { className: "text-xs", style: { color: "var(--text-muted)" } }, "Arquivo: ", /* @__PURE__ */ React.createElement("b", { style: { color: "var(--text)" } }, arquivo)), erro && /* @__PURE__ */ React.createElement("div", { className: "px-3 py-2 rounded-lg text-sm text-left", role: "alert", style: { background: "rgba(198,40,40,.12)", color: "#C62828" } }, erro), previa && /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "px-3 py-2 rounded-lg text-sm text-left", style: { background: "var(--bg-alt)", border: "1px solid var(--border)", color: "var(--text)" } }, "Pr\xE9via: ", /* @__PURE__ */ React.createElement("b", null, previa.prontos), " ", T.coisa, " pronto(s) para importar \xB7 ", /* @__PURE__ */ React.createElement("b", null, (previa.ignorados || []).length), " linha(s) ser\xE3o ignoradas."), /* @__PURE__ */ React.createElement(ListaIgnorados, { titulo: "Linhas que ser\xE3o ignoradas", itens: previa.ignorados || [], cor: "#B26A00" }), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap justify-center gap-3" }, /* @__PURE__ */ React.createElement("button", { type: "button", disabled: ocupado || !previa.prontos, onClick: confirmar, className: botao, style: { background: "var(--accent-green)", color: "#fff", opacity: ocupado || !previa.prontos ? 0.6 : 1 } }, ocupado ? "Importando\u2026" : `Importar ${previa.prontos} ${T.coisa}`), /* @__PURE__ */ React.createElement("button", { type: "button", disabled: ocupado, onClick: () => {
      setPrevia(null);
      setLinhas(null);
      setArquivo("");
    }, className: botao, style: { border: "1px solid var(--border)", color: "var(--text-muted)", background: "transparent" } }, "Cancelar"))), resultado && /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "px-3 py-2 rounded-lg text-sm text-left", role: "status", style: { background: "rgba(37,214,71,.12)", color: "var(--text)" } }, "Importa\xE7\xE3o conclu\xEDda: ", /* @__PURE__ */ React.createElement("b", null, resultado.importados), " ", T.coisa, " importado(s) \xB7 ", /* @__PURE__ */ React.createElement("b", null, (resultado.ignorados || []).length), " ignorada(s)", (resultado.falhas || []).length ? /* @__PURE__ */ React.createElement(React.Fragment, null, " \xB7 ", /* @__PURE__ */ React.createElement("b", { style: { color: "#C62828" } }, (resultado.falhas || []).length), " n\xE3o gravada(s) pelo banco") : null, "."), /* @__PURE__ */ React.createElement(ListaIgnorados, { titulo: "N\xE3o gravadas pelo banco", itens: resultado.falhas || [], cor: "#C62828" }), /* @__PURE__ */ React.createElement(ListaIgnorados, { titulo: "Ignoradas", itens: resultado.ignorados || [], cor: "#B26A00" })));
  }

  // insights.js
  var num = (v) => Number(v) || 0;
  var ts = (o) => {
    const t = Date.parse(o.abertura || "");
    return isNaN(t) ? 0 : t;
  };
  function calcInsights() {
    const S3 = getState();
    const ords = (S3.ordens || []).filter((o) => !o.cancelado);
    const agora = Date.now();
    const ultimas = [...ords].sort((a, b) => ts(b) - ts(a)).slice(0, 10).map((o) => ({
      os: o.os,
      placa: o.placa,
      modelo: o.modelo || "",
      defeito: [o.grupo_os, o.item_defeito, o.falha].filter(Boolean).join(" > "),
      prestador: o.prestador_nome || "",
      valor: num(o.valor),
      status: o.fechamento ? "Fechada" : o.status || "Aberta",
      abertura: o.abertura || ""
    }));
    const pl = {};
    ords.forEach((o) => {
      const p = String(o.placa || "").toUpperCase();
      if (!p) return;
      const d = pl[p] = pl[p] || { placa: p, qtd: 0, custo: 0, modelo: o.modelo || "", defeitos: {}, ultima: 0 };
      d.qtd++;
      d.custo += num(o.valor);
      d.ultima = Math.max(d.ultima, ts(o));
      const f = [o.grupo_os, o.item_defeito].filter(Boolean).join(" > ");
      if (f) d.defeitos[f] = (d.defeitos[f] || 0) + 1;
    });
    const recorrentes = Object.values(pl).filter((d) => d.qtd >= 2).sort((a, b) => b.qtd - a.qtd || b.custo - a.custo).slice(0, 10).map((d) => ({
      placa: d.placa,
      modelo: d.modelo,
      qtd: d.qtd,
      custo: d.custo,
      dias_desde_ultima: d.ultima ? Math.round((agora - d.ultima) / 864e5) : null,
      defeito_mais_comum: (Object.entries(d.defeitos).sort((a, b) => b[1] - a[1])[0] || ["\u2014"])[0]
    }));
    const pr = {};
    ords.forEach((o) => {
      const n = o.prestador_nome || "Sem prestador";
      const d = pr[n] = pr[n] || { nome: n, qtd: 0, custo: 0 };
      d.qtd++;
      d.custo += num(o.valor);
    });
    const custoPrest = Object.values(pr).sort((a, b) => b.custo - a.custo).slice(0, 10);
    const gr = {};
    ords.forEach((o) => {
      const g = o.grupo_os || "Sem grupo";
      const d = gr[g] = gr[g] || { grupo: g, qtd: 0, custo: 0 };
      d.qtd++;
      d.custo += num(o.valor);
    });
    const porGrupo = Object.values(gr).sort((a, b) => b.qtd - a.qtd);
    const abertas = ords.filter((o) => !o.fechamento);
    const paradas = abertas.map((o) => ({ os: o.os, placa: o.placa, horas: ts(o) ? Math.round((agora - ts(o)) / 36e5) : 0, prestador: o.prestador_nome || "sem prestador", status: o.status || "" })).sort((a, b) => b.horas - a.horas).slice(0, 10);
    let desvios = [];
    try {
      desvios = ((callRoute("/stats/orcado") || {}).por_prestador || []).filter((r) => r.desvio_pct > 10).slice(0, 5).map((r) => ({ nome: r.nome, desvio_pct: r.desvio_pct, orcado: r.orcado, realizado: r.realizado }));
    } catch (e) {
    }
    return { totalOS: ords.length, abertas: abertas.length, custoTotal: ords.reduce((t, o) => t + num(o.valor), 0), ultimas, recorrentes, custoPrest, porGrupo, paradas, desvios };
  }
  async function pedirIA(ins, pergunta) {
    const sample = await window.claude.use("sample");
    if (!sample) throw { code: "unavailable" };
    const dados = JSON.stringify({ ...ins, ultimas: ins.ultimas.slice(0, 8), paradas: ins.paradas.slice(0, 8) });
    const prompt2 = "Voc\xEA \xE9 analista de opera\xE7\xF5es de socorro mec\xE2nico (frota de caminh\xF5es, Brasil). Com base APENAS nos dados JSON abaixo, responda em portugu\xEAs, direto e pr\xE1tico. " + (pergunta ? "Pergunta do gestor: " + pergunta + "\n" : "") + 'Devolva SOMENTE JSON no formato {"resumo":"2 frases","alertas":[{"titulo":"","motivo":"","acao":"","prioridade":"alta|media|baixa"}],"vigiar":[{"placa":"","motivo":"","acao":""}],"melhorias":[""]}. M\xE1x. 5 alertas (pend\xEAncias a resolver: O.S. paradas, desvios de or\xE7amento, prestadores caros), m\xE1x. 5 placas para vigiar (recorr\xEAncia de defeito), m\xE1x. 4 melhorias. Cada a\xE7\xE3o deve ser um passo concreto. N\xE3o invente dados.\nDADOS:\n' + dados;
    return sample.json(prompt2, { modelTier: "default", cache: false });
  }

  // exportar.js
  var fmtData = (v) => {
    try {
      return v ? new Date(v).toLocaleString("pt-BR") : "";
    } catch (e) {
      return String(v || "");
    }
  };
  var brl = (v) => "R$ " + (Number(v) || 0).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  var tipoNome = { mecanico: "Mec\xE2nico", eletrico: "El\xE9trico", eletronica: "Eletr\xF4nica", eletrica_mecanica: "El\xE9trica/Mec\xE2nica", borracharia: "Borracharia", guincho: "Guincho", funilaria: "Funilaria", bau: "Ba\xFA", outros: "Outros" };
  function linhasOrdens() {
    return getState().ordens.map((o) => ({
      "O.S.": o.os,
      "Placa": o.placa,
      "Marca": o.marca,
      "Modelo": o.modelo,
      "Filial": o.operacao,
      "Origem": o.origem,
      "Grupo": o.grupo_os,
      "Sistema": o.sistema,
      "Item": o.item_defeito,
      "Falha": o.falha,
      "Complemento": o.complemento_defeito,
      "C\xF3d. defeito": o.cod_defeito,
      "Execu\xE7\xE3o": o.execucao,
      "Status": o.cancelado ? "Cancelada" : o.status,
      "Resultado": o.resultado,
      "Prestador": o.prestador_nome,
      "Valor or\xE7ado": Number(o.valor_orcado) || 0,
      "Valor final": Number(o.valor) || 0,
      "Abertura": fmtData(o.abertura),
      "Fechamento": fmtData(o.fechamento),
      "SLA (min)": o.sla_minutos
    })).sort((a, b) => String(b["O.S."]).localeCompare(String(a["O.S."]), "pt-BR", { numeric: true }));
  }
  function linhasPrestadores() {
    return getState().prestadores.map((p) => ({
      "Nome": p.nome,
      "CNPJ": p.cnpj,
      "Cidade": p.cidade,
      "UF": p.estado,
      "Tipo": tipoNome[p.tipo_servico] || p.tipo_servico,
      "Telefone": p.telefone,
      "Socorro 24h": p.socorro_24h ? "Sim" : "N\xE3o",
      "Fatura": p.fatura ? "Sim" : "N\xE3o",
      "Status": p.status
    }));
  }
  async function salvar(filename, data) {
    const dl = await window.claude.use("downloads");
    if (!dl) throw { code: "unavailable" };
    return dl.save({ filename, data });
  }
  function xlsxBlob(abas) {
    const X2 = window.XLSX;
    if (!X2) throw { code: "lib" };
    const wb = X2.utils.book_new();
    abas.forEach(([nomeAba, linhas]) => {
      const ws = X2.utils.json_to_sheet(linhas.length ? linhas : [{ Aviso: "Sem dados" }]);
      ws["!cols"] = Object.keys(linhas[0] || { A: 1 }).map((k) => ({ wch: Math.min(38, Math.max(k.length + 2, ...linhas.slice(0, 200).map((r) => String(r[k] == null ? "" : r[k]).length + 2))) }));
      X2.utils.book_append_sheet(wb, ws, nomeAba.slice(0, 31));
    });
    const arr = X2.write(wb, { type: "array", bookType: "xlsx" });
    return new Blob([arr], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  }
  var hoje = () => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
  var exportarOrdensExcel = () => salvar("ordens-de-servico-" + hoje() + ".xlsx", xlsxBlob([["Ordens de Servi\xE7o", linhasOrdens()]]));
  var exportarPrestadoresExcel = () => salvar("prestadores-" + hoje() + ".xlsx", xlsxBlob([["Prestadores", linhasPrestadores()]]));
  function linhasRelatorioAnalitico() {
    const st = callRoute("/stats"), orc = callRoute("/stats/orcado"), esc = callRoute("/escalonamento");
    const g = (st.indicadores_segmento || {}).geral || {};
    const resumo = [
      ["Gerado em", (/* @__PURE__ */ new Date()).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })],
      ["Total de O.S.", st.total_ordens],
      ["O.S. em aberto", st.em_aberto],
      ["O.S. fechadas", st.ordens_fechadas],
      ["Dentro do prazo (at\xE9 2h)", g.dentro_prazo || 0],
      ["Atrasadas (mais de 2h)", g.atrasadas || 0],
      ["RPM (% no prazo)", st.rpm],
      ["SLA m\xE9dio (min)", st.sla_medio],
      ["Custo realizado (R$)", Number((st.valor_total || 0).toFixed(2))],
      ["Custo or\xE7ado (R$)", Number(((orc.totais || {}).orcado || 0).toFixed(2))],
      ["Ve\xEDculos \xFAnicos", st.veiculos_unicos],
      ["Reincid\xEAncia (%)", st.taxa_repetibilidade],
      ["Prestadores cadastrados", st.total_prestadores],
      ["O.S. paradas h\xE1 mais de 2h", (st.paradas || []).length]
    ].map(([Indicador, Valor]) => ({ Indicador, Valor }));
    const corte = (l) => l.map((r) => ({ "Nome": r.nome, "O.S.": r.qtd, "Or\xE7ado": Number(r.orcado.toFixed(2)), "Realizado": Number(r.realizado.toFixed(2)), "Desvio (%)": r.desvio_pct }));
    const porStatus = Object.entries((st.resumo || {}).por_status || {}).sort((a, b) => b[1] - a[1]).map(([Status, q]) => ({ Status, "O.S.": q }));
    const escal = (esc.data || []).map((r) => ({ "O.S.": r.os, "Placa": r.placa, "Filial": r.operacao || "", "Status": r.status || "", "Horas parada": r.horas_parada, "N\xEDvel": r.nivel === "GERENCIA" ? "Ger\xEAncia" : "Supervisor" }));
    return [["Resumo", resumo], ["Ordens de Servi\xE7o", linhasOrdens()], ["Por filial", corte(orc.por_filial || [])], ["Por prestador", corte(orc.por_prestador || [])], ["Por status", porStatus], ["Escalonamento", escal]];
  }
  var exportarRelatorioAnalitico = () => salvar("relatorio-analitico-" + hoje() + ".xlsx", xlsxBlob(linhasRelatorioAnalitico()));
  function barras(doc, y, titulo, itens, cor, fmt) {
    const W = doc.internal.pageSize.getWidth();
    const max = Math.max(1, ...itens.map((i) => i.v));
    if (y + 30 + itens.length * 16 > doc.internal.pageSize.getHeight() - 50) {
      doc.addPage();
      y = 48;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(titulo, 40, y);
    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    itens.forEach((i) => {
      const bw = Math.max(1, (W - 80 - 150 - 90) * i.v / max);
      doc.setTextColor(40);
      doc.text(String(i.l).slice(0, 28), 40, y + 9);
      doc.setFillColor(cor[0], cor[1], cor[2]);
      doc.rect(40 + 150, y, bw, 11, "F");
      doc.setTextColor(60);
      doc.text(fmt(i), 40 + 150 + bw + 5, y + 9);
      y += 16;
    });
    return y + 10;
  }
  function exportarGerencialPdf(ia) {
    const J = window.jspdf;
    if (!J || !J.jsPDF) throw { code: "lib" };
    const S3 = getState();
    const doc = new J.jsPDF({ unit: "pt", format: "a4" });
    const W = doc.internal.pageSize.getWidth();
    let y = 48;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Relat\xF3rio Gerencial \u2014 Print Socorro Mec\xE2nico", 40, y);
    y += 18;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(110);
    doc.text("Gerado em " + (/* @__PURE__ */ new Date()).toLocaleString("pt-BR"), 40, y);
    y += 20;
    doc.setTextColor(0);
    const ab = S3.ordens.filter((o) => !o.fechamento && !o.cancelado).length;
    const total = S3.ordens.reduce((t, o) => t + (Number(o.valor) || 0), 0);
    doc.autoTable({ startY: y, theme: "grid", head: [["Indicador", "Valor"]], body: [["Total de O.S.", String(S3.ordens.length)], ["O.S. em aberto", String(ab)], ["Custo realizado", brl(total)], ["Prestadores cadastrados", String(S3.prestadores.length)]], styles: { fontSize: 9 }, headStyles: { fillColor: [22, 120, 60] }, margin: { left: 40, right: 40 } });
    y = doc.lastAutoTable.finalY + 18;
    const placas = {};
    S3.ordens.forEach((o) => {
      const p = String(o.placa || "\u2014").toUpperCase();
      const d = placas[p] = placas[p] || { placa: p, qtd: 0, custo: 0, modelo: o.modelo || "", falha: "" };
      d.qtd++;
      d.custo += Number(o.valor) || 0;
      if (o.falha) d.falha = [o.grupo_os, o.item_defeito, o.falha].filter(Boolean).join(" > ");
    });
    const top = Object.values(placas).sort((a, b) => b.qtd - a.qtd || b.custo - a.custo).slice(0, 8);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Ve\xEDculos com mais ocorr\xEAncias", 40, y);
    y += 6;
    doc.autoTable({ startY: y, theme: "striped", head: [["Placa", "Modelo", "O.S.", "Custo", "\xDAltimo defeito"]], body: top.map((t) => [t.placa, t.modelo || "\u2014", t.qtd, brl(t.custo), t.falha || "\u2014"]), styles: { fontSize: 8.5 }, headStyles: { fillColor: [22, 120, 60] }, margin: { left: 40, right: 40 } });
    y = doc.lastAutoTable.finalY + 18;
    const orc = callRoute("/stats/orcado");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Or\xE7ado \xD7 realizado por prestador", 40, y);
    y += 6;
    doc.autoTable({ startY: y, theme: "striped", head: [["Prestador", "O.S.", "Or\xE7ado", "Realizado", "Desvio"]], body: (orc.por_prestador || []).slice(0, 15).map((r) => [r.nome, r.qtd, brl(r.orcado), brl(r.realizado), (r.desvio_pct > 0 ? "+" : "") + r.desvio_pct + "%"]), styles: { fontSize: 8.5 }, headStyles: { fillColor: [22, 120, 60] }, margin: { left: 40, right: 40 } });
    y = doc.lastAutoTable.finalY + 18;
    const esc = callRoute("/escalonamento");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("Escalonamento (O.S. sem movimenta\xE7\xE3o)", 40, y);
    y += 6;
    doc.autoTable({ startY: y, theme: "striped", head: [["O.S.", "Placa", "Filial", "Status", "Horas", "N\xEDvel"]], body: (esc.data || []).slice(0, 25).map((r) => [r.os, r.placa, r.operacao || "\u2014", r.status || "\u2014", r.horas_parada, r.nivel]), styles: { fontSize: 8.5 }, headStyles: { fillColor: [180, 40, 40] }, margin: { left: 40, right: 40 } });
    y = doc.lastAutoTable.finalY + 22;
    const I = calcInsights();
    y = barras(doc, y, "Custo por prestador", I.custoPrest.map((p) => ({ l: p.nome, v: p.custo, q: p.qtd })), [22, 120, 60], (i) => brl(i.v) + " (" + i.q + " O.S.)");
    y = barras(doc, y, "O.S. por grupo de defeito", I.porGrupo.slice(0, 10).map((g) => ({ l: g.grupo, v: g.qtd, c: g.custo })), [37, 99, 235], (i) => i.v + " O.S. \xB7 " + brl(i.c));
    y = barras(doc, y, "Placas mais recorrentes", I.recorrentes.map((r) => ({ l: r.placa + " " + (r.modelo || ""), v: r.qtd, c: r.custo })), [217, 119, 6], (i) => i.v + " O.S. \xB7 " + brl(i.c));
    if (y > doc.internal.pageSize.getHeight() - 120) {
      doc.addPage();
      y = 48;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text("\xDAltimos ve\xEDculos atendidos", 40, y);
    y += 6;
    doc.autoTable({ startY: y, theme: "striped", head: [["O.S.", "Placa", "Defeito", "Prestador", "Valor", "Status"]], body: I.ultimas.map((u) => [u.os, u.placa, u.defeito || "\u2014", u.prestador || "\u2014", brl(u.valor), u.status]), styles: { fontSize: 8 }, headStyles: { fillColor: [22, 120, 60] }, margin: { left: 40, right: 40 } });
    y = doc.lastAutoTable.finalY + 18;
    if (ia) {
      if (y > doc.internal.pageSize.getHeight() - 160) {
        doc.addPage();
        y = 48;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("An\xE1lise da IA \u2014 pend\xEAncias e ve\xEDculos para vigiar", 40, y);
      y += 8;
      if (ia.resumo) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        const t = doc.splitTextToSize(ia.resumo, W - 80);
        doc.text(t, 40, y + 10);
        y += t.length * 11 + 12;
      }
      const corP = { alta: [180, 40, 40], media: [217, 119, 6], baixa: [22, 120, 60] };
      doc.autoTable({ startY: y, theme: "grid", head: [["Prioridade", "Pend\xEAncia", "A\xE7\xE3o sugerida"]], body: (ia.alertas || []).map((a) => [a.prioridade || "", a.titulo + " \u2014 " + (a.motivo || ""), a.acao || ""]), styles: { fontSize: 8 }, headStyles: { fillColor: [60, 60, 60] }, margin: { left: 40, right: 40 }, columnStyles: { 0: { cellWidth: 55 }, 1: { cellWidth: 200 } }, didParseCell: (d) => {
        if (d.section === "body" && d.column.index === 0) {
          const c = corP[String(d.cell.raw).toLowerCase()];
          if (c) {
            d.cell.styles.textColor = c;
            d.cell.styles.fontStyle = "bold";
          }
        }
      } });
      y = doc.lastAutoTable.finalY + 14;
      if ((ia.vigiar || []).length) {
        doc.autoTable({ startY: y, theme: "striped", head: [["Placa para vigiar", "Motivo", "A\xE7\xE3o"]], body: ia.vigiar.map((v) => [v.placa, v.motivo || "", v.acao || ""]), styles: { fontSize: 8 }, headStyles: { fillColor: [217, 119, 6] }, margin: { left: 40, right: 40 } });
      }
    }
    const n = doc.internal.getNumberOfPages();
    for (let i = 1; i <= n; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(130);
      doc.text("P\xE1gina " + i + " de " + n, W - 40, doc.internal.pageSize.getHeight() - 24, { align: "right" });
    }
    return salvar("relatorio-gerencial-" + hoje() + ".pdf", doc.output("arraybuffer"));
  }

  // app/page.tsx
  var MapaBrasil2 = (0, import_dynamic.default)(() => Promise.resolve().then(() => (init_MapaBrasil(), MapaBrasil_exports)), { ssr: false });
  var MapaAtendimento2 = (0, import_dynamic.default)(() => Promise.resolve().then(() => (init_MapaAtendimento(), MapaAtendimento_exports)), { ssr: false });
  var MapaFrota2 = (0, import_dynamic.default)(() => Promise.resolve().then(() => (init_MapaFrota(), MapaFrota_exports)), { ssr: false });
  var SlaChart2 = (0, import_dynamic.default)(() => Promise.resolve().then(() => (init_SlaChart(), SlaChart_exports)), { ssr: false });
  var PecasKanban2 = (0, import_dynamic.default)(() => Promise.resolve().then(() => (init_PecasKanban(), PecasKanban_exports)), { ssr: false });
  var STATUS_ABERTOS2 = /* @__PURE__ */ new Set(["Aguardando", "Em atendimento", "Prestador localizado", "Prestador a caminho", "Prestador no local", "Aguardando Or\xE7amento", "Servi\xE7o em execu\xE7\xE3o"]);
  var ETAPAS2 = [
    { status: "Aguardando", label: "1 \xB7 Contatar Motorista", desc: "Primeiro contato com o motorista", checklist: ["Confirmar motorista", "Confirmar placa", "Confirmar localiza\xE7\xE3o", "Entender o problema", "Confirmar ve\xEDculo em local seguro"], next: "Prestador localizado" },
    { status: "Prestador localizado", label: "2 \xB7 Localizar Prestador", desc: "Acionar o prestador mais pr\xF3ximo", checklist: ["Selecionar prestador dispon\xEDvel", "Negociar / aprovar o atendimento"], next: "Prestador a caminho" },
    { status: "Prestador a caminho", label: "3 \xB7 Prestador a Caminho", desc: "Prestador em deslocamento", checklist: ["Acompanhar deslocamento do prestador"], next: "Prestador no local" },
    { status: "Prestador no local", label: "4 \xB7 Prestador no Local", desc: "Prestador chegou ao ve\xEDculo", checklist: ["Confirmar chegada do prestador", "Verificar ve\xEDculo e diagn\xF3stico"], next: "Aguardando Or\xE7amento" },
    { status: "Aguardando Or\xE7amento", label: "4.5 \xB7 Aguardando Or\xE7amento", desc: "Aguardando aprova\xE7\xE3o do or\xE7amento pelo cliente", checklist: ["Enviar or\xE7amento ao cliente", "Aguardar aprova\xE7\xE3o do valor", "Confirmar valor aprovado"], next: "Servi\xE7o em execu\xE7\xE3o" },
    { status: "Servi\xE7o em execu\xE7\xE3o", label: "5 \xB7 Servi\xE7o em Execu\xE7\xE3o", desc: "Socorro em andamento", checklist: ["Acompanhar andamento do servi\xE7o"], next: "Ve\xEDculo liberado" }
  ];
  var setGlobalLoggedIn = () => {
  };
  var fetcher = api;
  var TIPO_LABELS = { mecanico: "Mec\xE2nico", eletrico: "El\xE9trico", eletronica: "Eletr\xF4nica", eletrica_mecanica: "El\xE9trica/Mec\xE2nica", borracharia: "Borracharia", guincho: "Guincho" };
  var TIPO_BADGE = {
    mecanico: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    eletrico: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    eletronica: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300",
    eletrica_mecanica: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
    borracharia: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
    guincho: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300"
  };
  var STAT_STYLE = {
    "print-green": { bg: "bg-emerald-50 dark:bg-emerald-900/20", fg: "text-emerald-600" },
    "print-yellow": { bg: "bg-sky-50 dark:bg-sky-900/20", fg: "text-sky-700" },
    "blue-500": { bg: "bg-slate-100 dark:bg-slate-800", fg: "text-slate-600" },
    "purple-500": { bg: "bg-teal-50 dark:bg-teal-900/20", fg: "text-teal-700" }
  };
  var LOGO_PRINT = IMGS.logo;
  var CHART_COLORS = ["#25D647", "#F5B301", "#1E88E5", "#E53935", "#8E6CF0", "#00A6A6"];
  var CORP_COLORS = ["#25D647", "#F5B301", "#1E88E5", "#E53935", "#8E6CF0", "#00A6A6", "#146E1F", "#D6D6D6"];
  var FILIAIS = ["Bel\xE9m", "Bras\xEDlia", "Campo Grande", "Curitiba", "Distrito Federal", "Diversos", "Feira de Santana", "Manaus", "Porto Velho", "Recife", "Salvador", "S\xE3o Paulo", "Serra ES", "Uberaba", "Vit\xF3ria da Conquista"];
  var FILIAL_SIGLA = { "Bel\xE9m": "BEL", "Bras\xEDlia": "BSB", "Campo Grande": "CGR", "Curitiba": "CWB", "Distrito Federal": "DF", "Diversos": "DIV", "Feira de Santana": "FSA", "Manaus": "MAO", "Porto Velho": "PVH", "Salvador": "SSA", "S\xE3o Paulo": "SP", "Serra ES": "SES", "Uberaba": "UBA", "Vit\xF3ria da Conquista": "VDC" };
  var corPrioridade = (p) => p === "Urgente" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" : p === "Alta" ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
  var MARCAS = ["Volkswagen", "Mercedes", "Volvo", "Iveco", "Scania"];
  var TITULO_CANC = (o) => "Solicitado por " + (o.cancelamento_solicitado_por || "\u2014") + (o.cancelamento_motivo ? " \xB7 Motivo: " + o.cancelamento_motivo : "");
  var cancPendente = (o) => !!o.cancelamento_solicitado && !o.cancelado;
  var ESTILO_CANC = { background: "rgba(198,40,40,.12)", color: "#C62828", border: "1px solid rgba(198,40,40,.4)" };
  var seloCancPendente = (o) => cancPendente(o) ? /* @__PURE__ */ React.createElement("span", { className: "ml-2 inline-block px-2 py-1 rounded-full text-[10px] font-bold align-middle whitespace-nowrap", style: ESTILO_CANC, title: TITULO_CANC(o) }, "Cancelamento pendente") : null;
  var NAV_ITEMS = [
    { id: "dashboard", label: "Dashboard", icon: /* @__PURE__ */ React.createElement(import_lucide_react.LayoutDashboard, { size: 16 }) },
    { id: "atendimento", label: "Atendimento", icon: /* @__PURE__ */ React.createElement(import_lucide_react.Timer, { size: 16 }), alert: true },
    { id: "ordens", label: "Ordens de Servi\xE7o", icon: /* @__PURE__ */ React.createElement(import_lucide_react.FileText, { size: 16 }) },
    { id: "prestadores", label: "Prestadores", icon: /* @__PURE__ */ React.createElement(import_lucide_react.Users, { size: 16 }) },
    { id: "bases", label: "Bases", icon: /* @__PURE__ */ React.createElement(import_lucide_react.MapPin, { size: 16 }) },
    { id: "pecas", label: "Controle de Pe\xE7as", icon: /* @__PURE__ */ React.createElement(import_lucide_react.Package, { size: 16 }) },
    { id: "log", label: "Log", icon: /* @__PURE__ */ React.createElement(import_lucide_react.ScrollText, { size: 16 }) },
    { id: "usuarios", label: "Usu\xE1rios", icon: /* @__PURE__ */ React.createElement(import_lucide_react.ShieldCheck, { size: 16 }) },
    { id: "cancelamentos", label: "Cancelamentos", icon: /* @__PURE__ */ React.createElement(import_lucide_react.Ban, { size: 16 }) },
    { id: "config", label: "Configura\xE7\xF5es", icon: /* @__PURE__ */ React.createElement(import_lucide_react.ShieldCheck, { size: 16 }) }
  ];
  var BRL = (v, d = 2) => Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: d, maximumFractionDigits: d });
  var fmtData2 = (v) => {
    const m = String(v || "").match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? `${m[3]}/${m[2]}/${m[1]}` : v || "\u2014";
  };
  var TIPO_LBL = { mecanico: "Mec\xE2nico", eletrico: "El\xE9trico", eletronica: "Eletr\xF4nica", eletrica_mecanica: "El\xE9trica/Mec\xE2nica", borracharia: "Borracharia", guincho: "Guincho", pneus: "Pneus", freio: "Freio", combustivel: "Combust\xEDvel", outros: "Outros" };
  function Sidebar({ tab, setTab, user, logout, ordensAbertos, ocorrPend, theme, setTheme, collapsed, onToggle }) {
    const navItems = NAV_ITEMS.filter((i) => papelVeAba(user?.role, i.id));
    const w = collapsed ? "var(--sidebar-mini)" : "var(--sidebar-w)";
    return /* @__PURE__ */ React.createElement("aside", { className: "sidebar fixed left-0 top-0 bottom-0 z-50 flex flex-col", style: { width: w, overflow: "hidden", transition: "width 0.25s ease" } }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between px-3 py-3 flex-shrink-0", style: { borderBottom: "1px solid var(--border-bright)", minHeight: "60px" } }, collapsed ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto", style: { background: "linear-gradient(145deg,#34e053 0%,#2dc62d 45%,#15803d 100%)", boxShadow: "inset 0 2px 3px rgba(255,255,255,0.6), inset 0 -3px 5px rgba(0,0,0,0.35), 0 3px 8px rgba(45,198,45,0.5), 0 8px 16px rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.35)" } }, /* @__PURE__ */ React.createElement("img", { src: LOGO_PRINT, alt: "Print", style: { width: 26, height: "auto" } }))) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 min-w-0 flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", style: { background: "linear-gradient(145deg,#34e053 0%,#2dc62d 45%,#15803d 100%)", boxShadow: "inset 0 2px 3px rgba(255,255,255,0.6), inset 0 -3px 5px rgba(0,0,0,0.35), 0 3px 8px rgba(45,198,45,0.5), 0 8px 16px rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.35)" } }, /* @__PURE__ */ React.createElement("img", { src: LOGO_PRINT, alt: "Print", style: { width: 26, height: "auto" } }))), /* @__PURE__ */ React.createElement("button", { onClick: onToggle, className: "p-2 rounded-lg hover:bg-surface-hover flex-shrink-0 cursor-pointer", style: { color: "var(--text-muted)" }, title: "Recolher menu", "aria-label": "Recolher menu" }, /* @__PURE__ */ React.createElement(import_lucide_react.ChevronLeft, { size: 18 })))), user && !collapsed && /* @__PURE__ */ React.createElement("div", { className: "px-4 py-3", style: { borderBottom: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold uppercase flex-shrink-0", style: { background: "#ffffff", color: "#0C4817", border: "2px solid rgba(255,255,255,0.55)" } }, user.nome?.charAt(0) || user.email?.charAt(0) || "U"), /* @__PURE__ */ React.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-bold truncate", style: { color: "#ffffff" } }, user.nome || user.email), /* @__PURE__ */ React.createElement("div", { className: "text-[10px]", style: { color: "rgba(255,255,255,0.75)" } }, rotuloPapel(user.role))))), user && collapsed && /* @__PURE__ */ React.createElement("div", { className: "py-3 flex justify-center", style: { borderBottom: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold uppercase", style: { background: "rgba(34,197,94,0.15)", color: "var(--accent-green)", border: "1px solid rgba(34,197,94,0.3)" } }, user.nome?.charAt(0) || user.email?.charAt(0) || "U")), /* @__PURE__ */ React.createElement("nav", { className: "flex-1 overflow-y-auto py-3 px-2" }, navItems.map((item) => {
      const isActive = tab === item.id;
      const badge = item.alert ? ordensAbertos : item.yellow ? ocorrPend : 0;
      return /* @__PURE__ */ React.createElement("button", { key: item.id, onClick: () => setTab(item.id), title: collapsed ? item.label : void 0, className: `w-full flex items-center ${collapsed ? "justify-center" : "gap-3"} px-3 py-2 rounded-lg mb-1 text-left transition-all cursor-pointer relative`, style: { background: isActive ? "var(--accent-green-glow)" : "transparent", color: isActive ? "var(--accent-green)" : "var(--text-muted)", border: isActive ? "1px solid rgba(34,197,94,0.25)" : "1px solid transparent" } }, /* @__PURE__ */ React.createElement("span", { style: { opacity: isActive ? 1 : 0.65 } }, item.icon), !collapsed && /* @__PURE__ */ React.createElement("span", { className: "text-[11px] flex-1" }, item.label), badge > 0 && /* @__PURE__ */ React.createElement("span", { className: "text-[9px] font-bold px-2 py-1 rounded-full", style: { background: item.yellow ? "var(--accent-yellow)" : "var(--accent-red)", color: "#000", position: collapsed ? "absolute" : "static", top: collapsed ? "4px" : void 0, right: collapsed ? "4px" : void 0 } }, badge));
    })), /* @__PURE__ */ React.createElement("div", { className: "p-3 flex-shrink-0", style: { borderTop: "1px solid var(--border)" } }, !collapsed && /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mb-2" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setTheme("light"), className: "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] cursor-pointer transition-all", style: { background: theme === "light" ? "var(--accent-green)" : "transparent", color: theme === "light" ? "#fff" : "var(--text-muted)", border: "1px solid " + (theme === "light" ? "var(--accent-green)" : "var(--border-bright)") } }, /* @__PURE__ */ React.createElement(import_lucide_react.Sun, { size: 13 }), "Claro"), /* @__PURE__ */ React.createElement("button", { onClick: () => setTheme("dark"), className: "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] cursor-pointer transition-all", style: { background: theme === "dark" ? "var(--accent-green)" : "transparent", color: theme === "dark" ? "#fff" : "var(--text-muted)", border: "1px solid " + (theme === "dark" ? "var(--accent-green)" : "var(--border-bright)") } }, /* @__PURE__ */ React.createElement(import_lucide_react.Moon, { size: 13 }), "Escuro")), collapsed && /* @__PURE__ */ React.createElement("div", { className: "flex justify-center mb-2" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setTheme(theme === "light" ? "dark" : "light"), title: theme === "light" ? "Modo escuro" : "Modo claro", className: "p-2 rounded-lg text-[11px] cursor-pointer transition-all", style: { color: "var(--text-muted)", border: "1px solid var(--border-bright)" } }, theme === "light" ? /* @__PURE__ */ React.createElement(import_lucide_react.Moon, { size: 13 }) : /* @__PURE__ */ React.createElement(import_lucide_react.Sun, { size: 13 }))), collapsed ? /* @__PURE__ */ React.createElement("button", { onClick: onToggle, className: "w-full flex items-center justify-center px-3 py-2 rounded-lg text-[11px] cursor-pointer transition-all hover:opacity-70", style: { color: "var(--text-muted)" }, title: "Expandir menu", "aria-label": "Expandir menu" }, /* @__PURE__ */ React.createElement(import_lucide_react.ChevronRight, { size: 18 })) : /* @__PURE__ */ React.createElement("button", { onClick: logout, className: "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] cursor-pointer transition-all hover:opacity-70", style: { color: "var(--text-muted)" } }, /* @__PURE__ */ React.createElement(import_lucide_react.LogOut, { size: 14 }), "Sair"), !collapsed && /* @__PURE__ */ React.createElement("button", { onClick: () => {
      const w2 = window;
      if (w2.__printTrocarSenha) w2.__printTrocarSenha();
    }, className: "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[11px] cursor-pointer transition-all hover:opacity-70", style: { color: "var(--text-muted)" } }, /* @__PURE__ */ React.createElement(import_lucide_react.Pencil, { size: 14 }), "Trocar senha")));
  }
  function Dashboard() {
    const { theme, setTheme } = (0, import_next_themes.useTheme)();
    const [mounted, setMounted] = (0, import_react10.useState)(false);
    const [loggedIn, setLoggedIn] = (0, import_react10.useState)(false);
    const [user, setUser2] = (0, import_react10.useState)(null);
    const [prestadores, setPrestadores] = (0, import_react10.useState)([]);
    const [acionamentos, setAcionamentos] = (0, import_react10.useState)([]);
    const [stats2, setStats] = (0, import_react10.useState)(null);
    const [usuarios, setUsuarios] = (0, import_react10.useState)([]);
    const [ordens, setOrdens] = (0, import_react10.useState)([]);
    const [log, setLog] = (0, import_react10.useState)([]);
    const [ocorrencias, setOcorrencias] = (0, import_react10.useState)([]);
    const [bases, setBases] = (0, import_react10.useState)([]);
    const [frotaPlacas, setFrotaPlacas] = (0, import_react10.useState)([]);
    const [orcado, setOrcado] = (0, import_react10.useState)(null);
    const [escalamento, setEscalamento] = (0, import_react10.useState)(null);
    const [editBase, setEditBase] = (0, import_react10.useState)(null);
    const [filtroSeg, setFiltroSeg] = (0, import_react10.useState)("Aberta");
    const [veiculosSascar, setVeiculosSascar] = (0, import_react10.useState)([]);
    const [sascarOk, setSascarOk] = (0, import_react10.useState)(void 0);
    const [posicoesSascar, setPosicoesSascar] = (0, import_react10.useState)({});
    const loadVeiculosSascar = (0, import_react10.useCallback)(async () => {
      const r = await fetcher("/sascar/veiculos");
      setVeiculosSascar(r?.data || []);
      setSascarOk(r?.credencial_ok);
    }, []);
    const loadPosicoesSascar = (0, import_react10.useCallback)(async () => {
      const r = await fetcher("/sascar/posicoes");
      if (r?.data) {
        const m = {};
        for (const placa in r.data) {
          const p = r.data[placa];
          if (p && p.lat != null && p.lng != null) {
            m[String(placa).replace(/-\d+$/, "").toUpperCase()] = { lat: p.lat, lng: p.lng, velocidade: p.velocidade, data: p.data, ignicao: p.ignicao, uf: p.uf, tensao: p.tensao, odometro: p.odometro, cidade: p.cidade };
          }
        }
        setPosicoesSascar(m);
      }
    }, []);
    const [filtroTipo, setFiltroTipo] = (0, import_react10.useState)("todos");
    const [alerts2, setAlerts] = (0, import_react10.useState)([]);
    const [search, setSearch] = (0, import_react10.useState)("");
    const [filtroFatura, setFiltroFatura] = (0, import_react10.useState)("todos");
    const [filtroOrdemStatus, setFiltroOrdemStatus] = (0, import_react10.useState)("todos");
    const [slaBusca, setSlaBusca] = (0, import_react10.useState)("");
    const [slaFiltro, setSlaFiltro] = (0, import_react10.useState)("");
    const [cancPendentes, setCancPendentes] = (0, import_react10.useState)([]);
    const loadCancPendentes = async () => {
      if (canManage) {
        const r = await fetcher("/ordens/cancelamentos/pendentes");
        setCancPendentes(r?.data || []);
      }
    };
    const aprovarCanc = async (id) => {
      await fetcher(`/ordens/${id}/cancelar/aprovar`, { method: "POST", body: "{}" });
      loadCancPendentes();
      loadData();
    };
    const REGIAO_POR_UF = { AC: "norte", AM: "norte", AP: "norte", PA: "norte", RO: "norte", RR: "norte", TO: "norte", AL: "nordeste", BA: "nordeste", CE: "nordeste", MA: "nordeste", PB: "nordeste", PE: "nordeste", PI: "nordeste", RN: "nordeste", SE: "nordeste", DF: "centro_oeste", GO: "centro_oeste", MT: "centro_oeste", MS: "centro_oeste", ES: "sudeste", MG: "sudeste", RJ: "sudeste", SP: "sudeste", PR: "sul", RS: "sul", SC: "sul" };
    const MAP_REGIOES = [{ id: "norte", label: "Norte" }, { id: "nordeste", label: "Nordeste" }, { id: "centro_oeste", label: "Centro-Oeste" }, { id: "sudeste", label: "Sudeste" }, { id: "sul", label: "Sul" }];
    const [mapShowFatura, setMapShowFatura] = (0, import_react10.useState)(true);
    const [mapShowNaoFatura, setMapShowNaoFatura] = (0, import_react10.useState)(true);
    const [mapRegioes, setMapRegioes] = (0, import_react10.useState)(/* @__PURE__ */ new Set());
    const toggleMapRegiao = (r) => setMapRegioes((prev) => {
      const n = new Set(prev);
      if (n.has(r)) n.delete(r);
      else n.add(r);
      return n;
    });
    const filteredMapPrestadores = (0, import_react10.useMemo)(() => prestadores.filter((p) => {
      if (!p.lat || !p.lng) return false;
      const okF = p.fatura ? mapShowFatura : mapShowNaoFatura;
      if (!okF) return false;
      if (mapRegioes.size > 0) {
        const reg = REGIAO_POR_UF[(p.estado || "").toUpperCase()] || "outros";
        if (!mapRegioes.has(reg)) return false;
      }
      return true;
    }), [prestadores, mapShowFatura, mapShowNaoFatura, mapRegioes]);
    const [tab, setTab] = (0, import_react10.useState)("dashboard");
    const [showP, setShowP] = (0, import_react10.useState)(false);
    const [showA, setShowA] = (0, import_react10.useState)(false);
    const [importar, setImportar] = (0, import_react10.useState)(null);
    const [showUser, setShowUser] = (0, import_react10.useState)(false);
    const [showO, setShowO] = (0, import_react10.useState)(false);
    const [moreDet, setMoreDet] = (0, import_react10.useState)(false);
    const [selP, setSelP] = (0, import_react10.useState)(null);
    const [loading, setLoading] = (0, import_react10.useState)(false);
    const [editO, setEditO] = (0, import_react10.useState)(null);
    const [closeO, setCloseO] = (0, import_react10.useState)(null);
    const [viewO, setViewO] = (0, import_react10.useState)(null);
    const [cancelO, setCancelO] = (0, import_react10.useState)(null);
    const [editP, setEditP] = (0, import_react10.useState)(null);
    const [sidebarOpen, setSidebarOpen] = (0, import_react10.useState)(typeof window === "undefined" || window.innerWidth >= 1024);
    const [carga, setCarga] = (0, import_react10.useState)("");
    const [notasOpen, setNotasOpen] = (0, import_react10.useState)(null);
    const [editU, setEditU] = (0, import_react10.useState)(null);
    (0, import_react10.useEffect)(() => {
      setMounted(true);
      setGlobalLoggedIn = setLoggedIn;
      let token = "";
      try {
        token = localStorage.getItem("token") || "";
      } catch {
        token = "";
      }
      if (!token) {
        return;
      }
      setLoggedIn(true);
      let u = null;
      try {
        const raw = localStorage.getItem("user");
        if (raw) u = JSON.parse(raw);
      } catch {
        u = null;
      }
      if (u && typeof u === "object") setUser2(u);
      else setUser2({ email: "", nome: "", role: "operador" });
    }, []);
    const role = papelValido2(user?.role);
    const canWrite = podeEditar(role);
    const canManage = ehAdmin(role);
    const loadData = (0, import_react10.useCallback)(async () => {
      setLoading(true);
      try {
        const [p, a, s, o, oc, bs, orc, esc] = await Promise.all([fetcher("/prestadores"), fetcher("/acionamentos"), fetcher("/stats"), fetcher("/ordens"), fetcher("/ocorrencias"), fetcher("/bases"), fetcher("/stats/orcado"), fetcher("/escalonamento")]);
        fetcher("/frota/placas").then((fr) => {
          if (fr?.data) setFrotaPlacas(fr.data);
        });
        setPrestadores(p?.data || []);
        setAcionamentos(a?.data || []);
        setStats(s || null);
        setOrdens(o?.data || []);
        setOcorrencias(oc?.data || []);
        setBases(bs?.data || []);
        setOrcado(orc || null);
        setEscalamento(esc || null);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, []);
    const loadUsers = (0, import_react10.useCallback)(async () => {
      const r = await fetcher("/users");
      setUsuarios(r?.data || []);
    }, []);
    const aceitarOcorrencia = async (id) => {
      await fetcher(`/ocorrencias/${id}/aceitar`, { method: "POST", body: "{}" });
      loadData();
    };
    const refresh = (0, import_react10.useCallback)(async () => {
      try {
        const [s, o, oc, al] = await Promise.all([fetcher("/stats"), fetcher("/ordens"), fetcher("/ocorrencias"), fetcher("/alerts")]);
        setStats(s || null);
        setOrdens(o?.data || []);
        setOcorrencias(oc?.data || []);
        setAlerts(al?.data || []);
        const n = await fetcher("/notificacoes");
        setNotifNaoLidas(n?.nao_lidas || 0);
      } catch (e) {
        console.error(e);
      }
    }, []);
    const refMapas = (0, import_react10.useRef)(null);
    const [mapasVistos, setMapasVistos] = (0, import_react10.useState)(false);
    (0, import_react10.useEffect)(() => {
      if (tab !== "dashboard" || mapasVistos || loading) return;
      const el = refMapas.current;
      if (!el || typeof IntersectionObserver === "undefined") {
        setMapasVistos(true);
        return;
      }
      const io = new IntersectionObserver((es) => {
        if (es.some((e) => e.isIntersecting)) {
          setMapasVistos(true);
          io.disconnect();
        }
      }, { rootMargin: "400px" });
      io.observe(el);
      return () => io.disconnect();
    }, [tab, mapasVistos, loading]);
    const precisaSascar = tab === "dashboard" && mapasVistos || showO;
    (0, import_react10.useEffect)(() => {
      if (mounted && precisaSascar) {
        loadPosicoesSascar();
      }
    }, [mounted, precisaSascar, loadPosicoesSascar]);
    (0, import_react10.useEffect)(() => {
      if (mounted) {
        loadData();
        if (canManage) loadUsers();
      }
    }, [loadData, loadUsers, mounted, canManage]);
    (0, import_react10.useEffect)(() => {
      if (!mounted) return;
      const t = setInterval(() => {
        refresh();
        if (precisaSascar) loadPosicoesSascar();
      }, 3e4);
      return () => clearInterval(t);
    }, [mounted, refresh, loadPosicoesSascar, precisaSascar]);
    const addP = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const d = Object.fromEntries(fd.entries());
      await fetcher("/prestadores", { method: "POST", body: JSON.stringify({ ...d, socorro_24h: d.socorro_24h === "on", fatura: d.fatura === "on" }) });
      setShowP(false);
      loadData();
    };
    const addA = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      await fetcher("/acionamentos", { method: "POST", body: JSON.stringify(Object.fromEntries(fd.entries())) });
      setShowA(false);
      setSelP(null);
      loadData();
    };
    const addO = async (e) => {
      e.preventDefault();
      if (savingO) return;
      const fd = new FormData(e.currentTarget);
      const d = Object.fromEntries(fd.entries());
      if (!d.placa && d.veiculo) {
        d.placa = String(d.veiculo);
      }
      const placa = String(d.placa || "").trim().toUpperCase();
      if (!placa) {
        alert("Informe a Placa do ve\xEDculo");
        return;
      }
      if (!carga) {
        alert("Selecione CARREGADO ou VAZIO");
        return;
      }
      const sascar = veiculosSascar.find((v) => v.placa === placa);
      setSavingO(true);
      try {
        await fetcher("/ordens", { method: "POST", body: JSON.stringify({ ...d, placa, carga, motorista: titleCase(String(d.motorista || "")), marca: titleCase(String(d.marca || "")), forma_pagamento: d.forma_pagamento || null, valor: parseFloat(String(d.valor || "0")), valor_orcado: parseFloat(String(d.valor_orcado || "0")), sascar_id: sascar?.id || null }) });
        setShowO(false);
        setCarga("");
        setPrestadorSugerido("");
        setMoreDet(false);
        setPlacaNova("");
        setAutofill(null);
        loadData();
      } finally {
        setSavingO(false);
      }
    };
    const cancelarOrdem = async (e) => {
      e.preventDefault();
      if (!cancelO) return;
      const fd = new FormData(e.currentTarget);
      const motivo = String(fd.get("motivo") || "");
      const r = await fetcher(`/ordens/${cancelO.id}/cancelar`, { method: "POST", body: JSON.stringify({ motivo }) });
      setCancelO(null);
      loadData();
      if (r?.pendente) alert("Cancelamento solicitado. Aguardando aprova\xE7\xE3o de um administrador.");
    };
    const closeSocorro = async (e) => {
      e.preventDefault();
      if (!closeO) return;
      const fd = new FormData(e.currentTarget);
      const d = Object.fromEntries(fd.entries());
      await fetcher(`/ordens/${closeO.id}/fechar`, { method: "POST", body: JSON.stringify({ resultado: d.resultado, servico_realizado: d.servico_realizado, execucao: d.execucao, prestador_id: d.prestador_id, valor: parseFloat(String(d.valor || "0")), valor_orcado: parseFloat(String(d.valor_orcado || "0")), observacoes: d.observacoes }) });
      setCloseO(null);
      loadData();
    };
    const updO = async (id, campo, valor) => {
      setOrdens((prev) => prev.map((o) => o.id === id ? { ...o, [campo]: valor } : o));
      await fetcher(`/ordens/${id}`, { method: "PUT", body: JSON.stringify({ [campo]: valor }) });
    };
    const saveEditO = async (e) => {
      e.preventDefault();
      if (!editO) return;
      const fd = new FormData(e.currentTarget);
      const d = Object.fromEntries(fd.entries());
      await fetcher(`/ordens/${editO.id}`, { method: "PUT", body: JSON.stringify({ ...d, placa: String(d.placa || "").trim().toUpperCase(), motorista: titleCase(String(d.motorista || "")), operador: titleCase(String(d.operador || "")), modelo: titleCase(String(d.modelo || "")), marca: titleCase(String(d.marca || "")), rodovia: titleCase(String(d.rodovia || "")), valor: parseFloat(String(d.valor || "0")), valor_orcado: parseFloat(String(d.valor_orcado || "0")) }) });
      setEditO(null);
      loadData();
    };
    const delP = async (id) => {
      if (!confirm("Remover?")) return;
      await fetcher(`/prestadores/${id}`, { method: "DELETE" });
      loadData();
    };
    const addBase = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const d = Object.fromEntries(fd.entries());
      const body = { nome: String(d.nome || "").trim(), lat: parseFloat(String(d.lat)), lng: parseFloat(String(d.lng)), endereco: String(d.endereco || "").trim() };
      if (!body.nome || isNaN(body.lat) || isNaN(body.lng)) {
        alert("Preencha nome, latitude e longitude");
        return;
      }
      if (editBase) {
        await fetcher(`/bases/${editBase.id}`, { method: "PUT", body: JSON.stringify(body) });
        setEditBase(null);
      } else {
        await fetcher("/bases", { method: "POST", body: JSON.stringify(body) });
      }
      e.currentTarget.reset();
      loadData();
    };
    const delBase = async (id) => {
      if (!confirm("Remover esta base?")) return;
      await fetcher(`/bases/${id}`, { method: "DELETE" });
      loadData();
    };
    const saveEditP = async (e) => {
      e.preventDefault();
      if (!editP) return;
      const fd = new FormData(e.currentTarget);
      const d = Object.fromEntries(fd.entries());
      await fetcher(`/prestadores/${editP.id}`, { method: "PUT", body: JSON.stringify({ ...d, socorro_24h: d.socorro_24h === "on", fatura: d.fatura === "on" }) });
      setEditP(null);
      loadData();
    };
    const delA = async (id) => {
      await fetcher(`/acionamentos/${id}`, { method: "DELETE" });
      loadData();
    };
    const addUser = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.currentTarget);
      const d = Object.fromEntries(fd.entries());
      await fetcher("/users", { method: "POST", body: JSON.stringify(d) });
      setShowUser(false);
      loadUsers();
    };
    const setRole = async (id, r) => {
      await fetcher(`/users/${id}`, { method: "PUT", body: JSON.stringify({ role: r }) });
      loadUsers();
    };
    const delUser = async (id) => {
      if (!confirm("Remover usu\xE1rio?")) return;
      await fetcher(`/users/${id}`, { method: "DELETE" });
      loadUsers();
    };
    const aprovarUser = async (id, role2) => {
      await fetcher(`/users/${id}/aprovar`, { method: "POST", body: JSON.stringify({ role: role2 }) });
      loadUsers();
    };
    const saveEditUser = async (e) => {
      e.preventDefault();
      if (!editU) return;
      const fd = new FormData(e.currentTarget);
      const d = Object.fromEntries(fd.entries());
      const body = { nome: d.nome, role: d.role };
      if (d.email) body.email = d.email;
      if (d.password) body.password = d.password;
      await fetcher(`/users/${editU.id}`, { method: "PUT", body: JSON.stringify(body) });
      setEditU(null);
      loadUsers();
    };
    const exportExcel = async () => {
      try {
        await exportarRelatorioAnalitico();
      } catch (e) {
        if (e && e.code === "declined") return;
        alert(e && e.code === "lib" ? "A biblioteca de planilhas n\xE3o carregou. Recarregue a p\xE1gina." : "N\xE3o foi poss\xEDvel gerar o relat\xF3rio.");
      }
    };
    const [notas, setNotas] = (0, import_react10.useState)([]);
    const [notificacoes, setNotificacoes] = (0, import_react10.useState)([]);
    const [notifNaoLidas, setNotifNaoLidas] = (0, import_react10.useState)(0);
    const [avisoErro, setAvisoErro] = (0, import_react10.useState)("");
    (0, import_react10.useEffect)(() => {
      let t;
      const f = (e) => {
        setAvisoErro(String(e?.detail?.mensagem || "N\xE3o foi poss\xEDvel salvar."));
        clearTimeout(t);
        t = setTimeout(() => setAvisoErro(""), 1e4);
      };
      window.addEventListener(EVENTO_ERRO, f);
      return () => {
        window.removeEventListener(EVENTO_ERRO, f);
        clearTimeout(t);
      };
    }, []);
    const [showNotif, setShowNotif] = (0, import_react10.useState)(false);
    const [editCarga, setEditCarga] = (0, import_react10.useState)("");
    const [maisDetEdit, setMaisDetEdit] = (0, import_react10.useState)(false);
    const [prestadorSugerido, setPrestadorSugerido] = (0, import_react10.useState)("");
    const [localizando, setLocalizando] = (0, import_react10.useState)(false);
    const [savingO, setSavingO] = (0, import_react10.useState)(false);
    const [placaNova, setPlacaNova] = (0, import_react10.useState)("");
    const [autofill, setAutofill] = (0, import_react10.useState)(null);
    const placasSascar = (() => {
      const set = /* @__PURE__ */ new Set();
      Object.keys(posicoesSascar || {}).forEach((k) => set.add(k));
      (veiculosSascar || []).forEach((v) => {
        if (v.placa) set.add(String(v.placa).toUpperCase().split("-")[0].trim());
      });
      return Array.from(set).filter(Boolean).sort();
    })();
    const preencherPorPlaca = (placa) => {
      const p = String(placa || "").toUpperCase().split("-")[0].trim();
      if (!p) {
        setAutofill(null);
        return;
      }
      const pos = (posicoesSascar || {})[p];
      let modelo = "", marca = "", tipo = "";
      const ult = (ordens || []).filter((o) => String(o.placa || "").toUpperCase().split("-")[0].trim() === p && (o.modelo || "") + (o.marca || "")).sort((a, b) => String(b.abertura || "").localeCompare(String(a.abertura || "")))[0];
      if (ult) {
        modelo = ult.modelo || "";
        marca = ult.marca || "";
        tipo = ult.tipo_veiculo || "";
      }
      const vs = (veiculosSascar || []).find((v) => String(v.placa || "").toUpperCase().split("-")[0].trim() === p);
      if (vs) {
        modelo = modelo || vs.modelo || "";
        marca = marca || vs.marca || "";
      }
      if (!tipo) tipo = inferTipoVeiculo(modelo, marca);
      const km = pos && pos.odometro ? String(pos.odometro) : "";
      setAutofill({ modelo, marca, km, tipo });
    };
    const haversine = (lat1, lng1, lat2, lng2) => {
      const R = 6371;
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
      return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };
    const localizarPrestador = () => {
      if (!navigator.geolocation) {
        alert("GPS n\xE3o dispon\xEDvel no navegador");
        return;
      }
      setLocalizando(true);
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const comCoord = prestadores.filter((p) => p.lat && p.lng);
        if (!comCoord.length) {
          setLocalizando(false);
          alert("Nenhum prestador com localiza\xE7\xE3o cadastrada");
          return;
        }
        const sorted = comCoord.map((p) => ({ ...p, dist: haversine(lat, lng, p.lat, p.lng) })).sort((a, b) => a.dist - b.dist);
        setPrestadorSugerido(sorted[0].id);
        setLocalizando(false);
      }, (err) => {
        setLocalizando(false);
        alert("N\xE3o foi poss\xEDvel obter localiza\xE7\xE3o: " + err.message);
      }, { timeout: 8e3 });
    };
    const loadNotificacoes = async () => {
      const r = await fetcher("/notificacoes");
      setNotificacoes(r?.data || []);
      setNotifNaoLidas(r?.nao_lidas || 0);
    };
    const carregarNotas = async (id) => {
      const r = await fetcher(`/ordens/${id}/notas`);
      setNotas(r?.data || []);
    };
    const salvarNota = async (id, sigla, texto2) => {
      if (!texto2.trim()) return;
      await fetcher(`/ordens/${id}/notas`, { method: "POST", body: JSON.stringify({ sigla, texto: texto2 }) });
      carregarNotas(id);
    };
    const logout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      const w = window;
      if (w.__printLogout) w.__printLogout();
    };
    const filtered = prestadores.filter((p) => {
      const nm = (p.nome || "").toLowerCase();
      const cd = (p.cidade || "").toLowerCase();
      const cj = p.cnpj || "";
      return (nm.includes(search.toLowerCase()) || cd.includes(search.toLowerCase()) || cj.includes(search)) && (filtroFatura === "todos" || (filtroFatura === "fatura" ? p.fatura : !p.fatura));
    });
    const acionamentosOrdenados = [...acionamentos].sort((a, b) => {
      const ca = ordens.filter((o) => o.prestador_nome === a.prestador_nome).length;
      const cb = ordens.filter((o) => o.prestador_nome === b.prestador_nome).length;
      return cb - ca;
    });
    const chartData = stats2 ? Object.entries(stats2.acionamento_por_tipo || {}).filter(([, v]) => v > 0).map(([k, v]) => ({ name: TIPO_LABELS[k] || k, value: v })).sort((a, b) => a.value - b.value) : [];
    if (!mounted) return null;
    const ordensAbertos = ordens.filter((o) => STATUS_ABERTOS2.has(o.status || "")).length;
    window.__painelAcoes = { exportarExcel: exportExcel, notificacoes: () => {
      setShowNotif((v) => !v);
      loadNotificacoes();
    }, naoLidas: notifNaoLidas };
    const ocorrPend = ocorrencias.filter((o) => o.status === "pendente").length;
    const ordensTabela = ordens.filter((o) => {
      const st = o.status || "";
      if (filtroOrdemStatus === "todos") return true;
      if (filtroOrdemStatus === "Liberada") return st === "Liberado" || st === "Ve\xEDculo liberado";
      if (filtroOrdemStatus === "Finalizada") return !!o.fechamento;
      if (filtroOrdemStatus === "Cancelada") return o.cancelado || st === "Cancelada";
      if (filtroOrdemStatus === "Chegou") return st === "Prestador no local";
      if (filtroOrdemStatus === "EmAtendimento") return ["Prestador a caminho", "Prestador no local", "Servi\xE7o em execu\xE7\xE3o"].includes(st);
      if (filtroOrdemStatus === "Aberta") return !o.fechamento && !o.cancelado;
      return true;
    });
    const selStatus = (o, cls = "") => /* @__PURE__ */ React.createElement("select", { value: o.status || "Aguardando", onChange: (e) => updO(o.id, "status", e.target.value), "aria-label": "Andamento", className: "px-2 py-1 rounded border border-border bg-surface-alt text-text text-xs " + cls }, /* @__PURE__ */ React.createElement("option", { value: "Aguardando" }, "Aguardando"), /* @__PURE__ */ React.createElement("option", { value: "Prestador localizado" }, "Prestador localizado"), /* @__PURE__ */ React.createElement("option", { value: "Prestador a caminho" }, "Prestador a caminho"), /* @__PURE__ */ React.createElement("option", { value: "Prestador no local" }, "Prestador no local"), /* @__PURE__ */ React.createElement("option", { value: "Servi\xE7o em execu\xE7\xE3o" }, "Servi\xE7o em execu\xE7\xE3o"), /* @__PURE__ */ React.createElement("option", { value: "Ve\xEDculo liberado" }, "Ve\xEDculo liberado"), /* @__PURE__ */ React.createElement("option", { value: "Rebocado" }, "Rebocado"));
    const statusP = (p) => /* @__PURE__ */ React.createElement("span", { className: `inline-flex items-center gap-2 text-xs font-medium ${p.status === "em_atendimento" ? "text-orange-500" : p.status === "a_caminho" ? "text-blue-500" : p.status === "indisponivel" ? "text-zinc-400" : "text-emerald-500"}` }, /* @__PURE__ */ React.createElement("span", { className: `w-2 h-2 rounded-full ${p.status === "em_atendimento" ? "bg-orange-500" : p.status === "a_caminho" ? "bg-blue-500" : p.status === "indisponivel" ? "bg-zinc-400" : "bg-emerald-500"}` }), p.status === "em_atendimento" ? "Em atendimento" : p.status === "a_caminho" ? "A caminho" : p.status === "indisponivel" ? "Indispon\xEDvel" : "Dispon\xEDvel");
    const acoesP = (p) => /* @__PURE__ */ React.createElement(React.Fragment, null, canWrite && /* @__PURE__ */ React.createElement("button", { onClick: () => setEditP(p), className: "p-2 rounded hover:bg-print-green/10 text-print-green", title: "Editar" }, /* @__PURE__ */ React.createElement(import_lucide_react.Pencil, { className: "w-4 h-4" })), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setSelP(p);
      setShowA(true);
    }, className: "p-2 rounded hover:bg-print-green/10 text-print-green", title: "Acionar" }, /* @__PURE__ */ React.createElement(import_lucide_react.Phone, { className: "w-4 h-4" })), canWrite && /* @__PURE__ */ React.createElement("button", { onClick: () => delP(p.id), title: "Remover prestador", className: "p-2 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500" }, /* @__PURE__ */ React.createElement(import_lucide_react.Trash2, { className: "w-4 h-4" })));
    const acoesOS = (o) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setNotasOpen(o);
      carregarNotas(o.id);
    }, className: "px-2 py-1 rounded text-[10px] font-bold border cursor-pointer", style: { borderColor: "var(--border-bright)", color: "var(--text-muted)" }, title: "Report / bloco de notas" }, "Report"), canManage && /* @__PURE__ */ React.createElement("button", { onClick: async () => {
      if (!confirm("Excluir a O.S. " + (o.os || "") + "? Esta acao nao pode ser desfeita.")) return;
      await fetcher("/ordens/" + o.id, { method: "DELETE" });
      loadData();
    }, className: "px-2 py-1 rounded text-[10px] font-bold cursor-pointer", style: { border: "1px solid #C62828", color: "#C62828" } }, "Excluir"), /* @__PURE__ */ React.createElement("button", { onClick: () => setEditO(o), className: "p-2 rounded hover:bg-print-green/10 text-print-green", title: "Editar" }, /* @__PURE__ */ React.createElement(import_lucide_react.Pencil, { className: "w-4 h-4" })), !o.fechamento && !o.cancelado && /* @__PURE__ */ React.createElement("button", { onClick: () => setCloseO(o), className: "p-2 rounded hover:bg-print-green/15 text-print-green", title: "Liberar / Fechar" }, /* @__PURE__ */ React.createElement(import_lucide_react.CheckCircle2, { className: "w-4 h-4" })), canWrite && !o.cancelado && !o.cancelamento_solicitado && /* @__PURE__ */ React.createElement("button", { onClick: () => setCancelO(o), className: "p-2 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500", title: "Solicitar cancelamento" }, /* @__PURE__ */ React.createElement(import_lucide_react.Ban, { className: "w-4 h-4" })));
    return /* @__PURE__ */ React.createElement("div", { className: "flex min-h-screen", style: { background: "var(--bg)", color: "var(--text)" } }, avisoErro && /* @__PURE__ */ React.createElement("div", { role: "alert", className: "fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex items-start gap-3 px-4 py-3 rounded-xl shadow-2xl text-sm", style: { width: "min(560px, calc(100vw - 32px))", background: "#C62828", color: "#fff" } }, /* @__PURE__ */ React.createElement(import_lucide_react.AlertTriangle, { className: "w-5 h-5 shrink-0" }), /* @__PURE__ */ React.createElement("span", { className: "flex-1 min-w-0" }, avisoErro), /* @__PURE__ */ React.createElement("button", { onClick: () => setAvisoErro(""), "aria-label": "Fechar aviso", className: "shrink-0 font-bold px-2 cursor-pointer", style: { minWidth: 36, minHeight: 36 } }, "\xD7")), /* @__PURE__ */ React.createElement(Sidebar, { tab, setTab, user, logout, ordensAbertos, ocorrPend, theme: theme || "dark", setTheme, collapsed: !sidebarOpen, onToggle: () => setSidebarOpen((v) => !v) }), /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-h-screen painel-conteudo", style: { marginLeft: sidebarOpen ? "var(--sidebar-w)" : "var(--sidebar-mini)", transition: "margin-left 0.25s ease" } }, /* @__PURE__ */ React.createElement("main", { className: "painel-main" }, !loading && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { onClick: exportExcel, className: "fixed bottom-[76px] right-6 z-40 hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold cursor-pointer shadow-xl transition-all hover:scale-105 hover:shadow-2xl", style: { background: "var(--accent-green)", color: "#fff" }, title: "Baixar relat\xF3rio anal\xEDtico em Excel" }, /* @__PURE__ */ React.createElement(import_lucide_react.FileDown, { size: 15 }), "Exportar Excel"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setShowNotif((v) => !v);
      loadNotificacoes();
    }, className: "fixed bottom-[76px] right-[190px] z-40 hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold cursor-pointer shadow-xl transition-all hover:scale-105", style: { background: "var(--bg-card)", color: "var(--text)", border: "1px solid var(--border-bright)" }, title: "Notifica\xE7\xF5es", "aria-label": "Notifica\xE7\xF5es" }, /* @__PURE__ */ React.createElement(import_lucide_react.BellRing, { size: 15 }), notifNaoLidas > 0 && /* @__PURE__ */ React.createElement("span", { className: "text-[10px] font-bold px-2 rounded-full", style: { background: "var(--accent-red)", color: "#fff" } }, notifNaoLidas)), showNotif && /* @__PURE__ */ React.createElement("div", { className: "fixed bottom-20 sm:bottom-36 right-4 sm:right-6 z-50 w-80 max-w-[calc(100vw-2rem)] max-h-96 overflow-y-auto rounded-xl shadow-2xl p-3 space-y-2", style: { background: "var(--bg-card)", border: "1px solid var(--border-bright)" } }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold", style: { color: "var(--text)" } }, "Notifica\xE7\xF5es"), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowNotif(false), className: "flex items-center justify-center rounded-lg", style: { color: "var(--text-muted)" }, "aria-label": "Fechar notifica\xE7\xF5es", title: "Fechar" }, /* @__PURE__ */ React.createElement(import_lucide_react.X, { size: 14 }))), notificacoes.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-center py-4", style: { color: "var(--text-muted)" } }, "Nenhuma notifica\xE7\xE3o"), notificacoes.map((n) => /* @__PURE__ */ React.createElement("div", { key: n.id, className: "p-2 rounded-lg", style: { background: n.lida ? "var(--bg-alt)" : "var(--accent-green-glow)", border: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("p", { className: "text-xs", style: { color: "var(--text)" } }, n.mensagem), /* @__PURE__ */ React.createElement("p", { className: "text-[9px] mt-1", style: { color: "var(--text-muted)" } }, n.created_at ? new Date(n.created_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) : ""))))), loading && /* @__PURE__ */ React.createElement("p", { className: "text-center py-16", style: { color: "var(--text-muted)" } }, "Carregando..."), !loading && tab === "dashboard" && /* @__PURE__ */ React.createElement(React.Fragment, null, (alerts2.length > 0 || (stats2?.paradas?.length || 0) > 0) && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-4 px-3 py-2 rounded-lg", style: { background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.3)" } }, /* @__PURE__ */ React.createElement(import_lucide_react.AlertTriangle, { className: "w-4 h-4 text-red-500 shrink-0" }), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-bold text-red-500" }, alerts2.length > 0 ? `${alerts2.length} O.S. com mais de 60 min em aberto` : "", alerts2.length > 0 && (stats2?.paradas?.length || 0) > 0 ? " \xB7 " : "", (stats2?.paradas?.length || 0) > 0 ? `${stats2.paradas.length} O.S. paradas h\xE1 mais de 2h` : ""), /* @__PURE__ */ React.createElement("span", { className: "ml-auto text-xs text-red-400" }, "Ver painel de atendimento")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6" }, /* @__PURE__ */ React.createElement(StatCard, { l: "Socorros Hoje", v: stats2?.socorros_hoje ?? 0, I: import_lucide_react.BarChart3, c: "print-green" }), /* @__PURE__ */ React.createElement(StatCard, { l: "Em Aberto", v: stats2?.em_aberto ?? 0, I: import_lucide_react.Clock, c: "blue-500" }), /* @__PURE__ */ React.createElement(StatCard, { l: "Atrasados", v: stats2?.atrasados ?? 0, I: import_lucide_react.TrendingUp, c: "print-yellow" }), /* @__PURE__ */ React.createElement(StatCard, { l: "Liberados", v: stats2?.liberados ?? 0, I: import_lucide_react.FileText, c: "purple-500" }), /* @__PURE__ */ React.createElement(StatCard, { l: "Rebocados", v: stats2?.rebocados ?? 0, I: import_lucide_react.Users, c: "print-green" }), /* @__PURE__ */ React.createElement(StatCard, { l: "RPM", v: `${stats2?.rpm ?? 0}%`, I: import_lucide_react.TrendingUp, c: "print-yellow" })), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" }, /* @__PURE__ */ React.createElement(SegPanel, { titulo: "Privado", cor: "#2dc62d", icone: "P", s: stats2?.indicadores_segmento?.privado }), /* @__PURE__ */ React.createElement(SegPanel, { titulo: "Correios", cor: "#f5c518", icone: "C", s: stats2?.indicadores_segmento?.correios }), /* @__PURE__ */ React.createElement(SegPanel, { titulo: "Geral", cor: "#e8e6e1", icone: "G", s: stats2?.indicadores_segmento?.geral })), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6" }, canWrite && /* @__PURE__ */ React.createElement(Card, { title: "PDF Gerencial", sub: "Imprimir ou salvar em PDF" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px]", style: { color: "var(--text-muted)" } }, "Per\xEDodo"), /* @__PURE__ */ React.createElement("select", { id: "pdf-dias", defaultValue: "30", className: "px-2 py-1 rounded-lg text-[10px] border cursor-pointer", style: { background: "var(--bg-alt)", borderColor: "var(--border)", color: "var(--text)" } }, /* @__PURE__ */ React.createElement("option", { value: "7" }, "7 dias"), /* @__PURE__ */ React.createElement("option", { value: "30" }, "30 dias"), /* @__PURE__ */ React.createElement("option", { value: "90" }, "90 dias"), /* @__PURE__ */ React.createElement("option", { value: "0" }, "Tudo"))), /* @__PURE__ */ React.createElement("button", { onClick: async () => {
      try {
        const r = await fetch("/api/relatorio/gerencial2?dias=" + (document.getElementById("pdf-dias")?.value || "30"));
        const j = await r.json();
        if (!j || !j.html) {
          alert("Nao foi possivel gerar o relatorio");
          return;
        }
        const w = window.open("", "_blank");
        if (w) {
          w.document.open();
          w.document.write(j.html);
          w.document.close();
        }
      } catch (e) {
        alert("Nao foi possivel gerar o relatorio");
      }
    }, className: "w-full py-2 rounded-lg text-xs font-bold cursor-pointer", style: { background: "var(--accent-green)", color: "#fff" } }, "Gerar PDF Gerencial"), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] mt-2 leading-relaxed", style: { color: "var(--text-muted)" } }, "Abre em nova aba. No navegador use Ctrl+P e escolha \u201CSalvar como PDF\u201D."), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] mt-1", style: { color: "var(--text-muted)" } }, "Inclui maiores problemas, solu\xE7\xF5es sugeridas e ficha por placa.")), /* @__PURE__ */ React.createElement(Card, { title: "Or\xE7ado \xD7 Realizado", sub: "Por prestador" }, orcado?.por_prestador?.length > 0 ? /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, (orcado.por_prestador || []).slice(0, 4).map((p) => /* @__PURE__ */ React.createElement("div", { key: p.nome, className: "flex items-center gap-2 text-[10px]" }, /* @__PURE__ */ React.createElement("span", { className: "truncate", style: { color: "var(--text)", width: 86 } }, p.nome), /* @__PURE__ */ React.createElement("div", { className: "flex-1 h-1.5 rounded-full overflow-hidden", style: { background: "var(--bg-alt)" } }, /* @__PURE__ */ React.createElement("div", { style: { width: Math.min(100, p.realizado / (p.orcado || p.realizado || 1) * 100) + "%", height: "100%", background: p.desvio_pct > 0 ? "#E53935" : "#25D647" } })), /* @__PURE__ */ React.createElement("span", { className: "font-mono font-bold", style: { color: p.desvio_pct > 0 ? "#C62828" : "#146E1F" } }, p.desvio_pct > 0 ? "+" : "", p.desvio_pct, "%")))) : /* @__PURE__ */ React.createElement("p", { className: "text-center text-[10px] py-4", style: { color: "var(--text-muted)" } }, "Sem valor or\xE7ado lan\xE7ado")), /* @__PURE__ */ React.createElement(Card, { title: "Escalonamento", sub: "O.S. parada h\xE1 2h ou mais" }, escalamento?.data?.length > 0 ? /* @__PURE__ */ React.createElement("div", { className: "space-y-1" }, (escalamento.data || []).slice(0, 4).map((e) => /* @__PURE__ */ React.createElement("div", { key: e.id, className: "flex items-center gap-2 text-[10px]" }, /* @__PURE__ */ React.createElement("span", { className: "w-1.5 h-1.5 rounded-full shrink-0", style: { background: e.nivel === "GERENCIA" ? "#E53935" : "#F5B301" } }), /* @__PURE__ */ React.createElement("span", { className: "font-mono font-bold", style: { color: "var(--text)" } }, e.placa || e.os), /* @__PURE__ */ React.createElement("span", { className: "truncate", style: { color: "var(--text-muted)" } }, e.status), /* @__PURE__ */ React.createElement("span", { className: "ml-auto font-mono font-bold", style: { color: "#C62828" } }, e.horas_parada, "h")))) : /* @__PURE__ */ React.createElement("p", { className: "text-center text-[10px] py-4", style: { color: "var(--text-muted)" } }, "Nenhuma O.S. parada"))), /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React.createElement(Card, { title: "Resumo Di\xE1rio", sub: "Hoje" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-3" }, (() => {
      const r = stats2?.resumo;
      const t_ent = r?.tendencia_entraram ?? 0;
      const t_fech = r?.tendencia_fecharam ?? 0;
      const seta = (v) => v > 0 ? "\u2191" : v < 0 ? "\u2193" : "\u2192";
      const cor = (v) => v > 0 ? "#16a34a" : v < 0 ? "#dc2626" : "#9ca3af";
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "p-3 rounded-lg", style: { background: "var(--bg-alt)", border: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("div", { className: "text-[10px] font-bold uppercase tracking-wide", style: { color: "var(--text-muted)" } }, "Entraram hoje"), /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold font-mono mt-1", style: { color: "var(--text)" } }, r?.hoje?.entraram ?? 0, /* @__PURE__ */ React.createElement("span", { className: "text-sm ml-1", style: { color: cor(t_ent) } }, seta(t_ent), " ", Math.abs(t_ent)))), /* @__PURE__ */ React.createElement("div", { className: "p-3 rounded-lg", style: { background: "var(--bg-alt)", border: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("div", { className: "text-[10px] font-bold uppercase tracking-wide", style: { color: "var(--text-muted)" } }, "Fecharam hoje"), /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold font-mono mt-1", style: { color: "var(--text)" } }, r?.hoje?.fecharam ?? 0, /* @__PURE__ */ React.createElement("span", { className: "text-sm ml-1", style: { color: cor(t_fech) } }, seta(t_fech), " ", Math.abs(t_fech)))), /* @__PURE__ */ React.createElement("div", { className: "p-3 rounded-lg", style: { background: "var(--bg-alt)", border: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("div", { className: "text-[10px] font-bold uppercase tracking-wide", style: { color: "var(--accent-green)" } }, "\xC0 Vista (hoje)"), /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold font-mono mt-1", style: { color: "var(--text)" } }, BRL(r?.hoje?.avista_valor, 0))), /* @__PURE__ */ React.createElement("div", { className: "p-3 rounded-lg", style: { background: "var(--bg-alt)", border: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("div", { className: "text-[10px] font-bold uppercase tracking-wide", style: { color: "var(--accent-yellow)" } }, "Faturado (hoje)"), /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold font-mono mt-1", style: { color: "var(--text)" } }, BRL(r?.hoje?.faturado_valor, 0))));
    })()))), /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React.createElement(Card, { title: "Pagamento", sub: "\xC0 Vista \xD7 Faturado" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-3" }, (() => {
      const p = stats2?.pagamento || { a_vista: { count: 0, valor: 0 }, faturado: { count: 0, valor: 0 } };
      const av = p.a_vista || { count: 0, valor: 0 };
      const ft = p.faturado || { count: 0, valor: 0 };
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "p-3 rounded-lg", style: { background: "var(--bg-alt)", border: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("div", { className: "text-[10px] font-bold uppercase tracking-wide", style: { color: "var(--accent-green)" } }, "\xC0 Vista"), /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold font-mono mt-1", style: { color: "var(--text)" } }, av.count), /* @__PURE__ */ React.createElement("div", { className: "text-[10px]", style: { color: "var(--text-muted)" } }, BRL(av.valor))), /* @__PURE__ */ React.createElement("div", { className: "p-3 rounded-lg", style: { background: "var(--bg-alt)", border: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("div", { className: "text-[10px] font-bold uppercase tracking-wide", style: { color: "var(--accent-yellow)" } }, "Faturado"), /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold font-mono mt-1", style: { color: "var(--text)" } }, ft.count), /* @__PURE__ */ React.createElement("div", { className: "text-[10px]", style: { color: "var(--text-muted)" } }, BRL(ft.valor))));
    })()))), /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React.createElement(Card, { title: "Socorros em Aberto", sub: "Linha do tempo (SLA 120min)" }, (() => {
      const abertas0 = ordens.filter((o) => !o.fechamento && !o.cancelado);
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-3 flex-wrap" }, /* @__PURE__ */ React.createElement("select", { value: filtroSeg, onChange: (e) => setFiltroSeg(e.target.value), className: "px-2 py-2 text-xs rounded border border-border bg-surface-alt text-text" }, /* @__PURE__ */ React.createElement("option", { value: "todos" }, "Segmento: Todos"), /* @__PURE__ */ React.createElement("option", { value: "privado" }, "Privado"), /* @__PURE__ */ React.createElement("option", { value: "correios" }, "Correios")), /* @__PURE__ */ React.createElement("select", { value: filtroTipo, onChange: (e) => setFiltroTipo(e.target.value), className: "px-2 py-2 text-xs rounded border border-border bg-surface-alt text-text" }, /* @__PURE__ */ React.createElement("option", { value: "todos" }, "Tipo: Todos"), ["mecanico", "eletrico", "pneus", "freio", "combustivel", "guincho", "borracharia", "outros"].map((t) => /* @__PURE__ */ React.createElement("option", { key: t, value: t }, t)))), (() => {
        const abertos = abertas0.filter((o) => (filtroSeg === "todos" || (o.segmento || "privado") === filtroSeg) && (filtroTipo === "todos" || o.tipo_servico === filtroTipo)).slice(-80).reverse();
        return abertos.length > 0 ? /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, abertos.map((o) => {
          const ab = o.abertura ? new Date(o.abertura).getTime() : null;
          const mins = ab ? Math.round((Date.now() - ab) / 6e4) : 0;
          const atrasado = mins > 120;
          const quase = mins > 60 && !atrasado;
          return /* @__PURE__ */ React.createElement("span", { key: o.id, title: "O.S. " + o.os + " - " + (o.placa || "sem placa") + " - " + mins + " min - " + (o.status || ""), className: "px-2 py-1 rounded text-[10px] font-bold tabular-nums cursor-default", style: atrasado ? { background: "#ef4444", color: "#fff" } : quase ? { background: "#eab308", color: "#000" } : { background: "rgba(34,197,94,0.15)", color: "var(--accent-green)" } }, o.os);
        })) : /* @__PURE__ */ React.createElement("p", { className: "text-center text-text-muted py-6" }, "Nenhum socorro em aberto");
      })());
    })())), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6" }, /* @__PURE__ */ React.createElement(Card, { title: "Tipos de Servi\xE7o", sub: "Ordem crescente" }, chartData.length > 0 ? /* @__PURE__ */ React.createElement(import_recharts2.ResponsiveContainer, { width: "100%", height: 240 }, /* @__PURE__ */ React.createElement(import_recharts2.BarChart, { data: chartData, margin: { top: 5, right: 20, left: 0, bottom: 5 } }, /* @__PURE__ */ React.createElement(import_recharts2.CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--border)" }), /* @__PURE__ */ React.createElement(import_recharts2.XAxis, { dataKey: "name", tick: { fontSize: 12, fill: "var(--text-muted)" }, stroke: "var(--border)" }), /* @__PURE__ */ React.createElement(import_recharts2.YAxis, { tick: { fontSize: 12, fill: "var(--text-muted)" }, stroke: "var(--border)" }), /* @__PURE__ */ React.createElement(import_recharts2.Tooltip, { contentStyle: { background: "var(--bg-alt)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" } }), /* @__PURE__ */ React.createElement(import_recharts2.Bar, { dataKey: "value", radius: [4, 4, 0, 0] }, chartData.map((_, i) => /* @__PURE__ */ React.createElement(import_recharts2.Cell, { key: i, fill: CHART_COLORS[i % 4] }))))) : /* @__PURE__ */ React.createElement("p", { className: "text-center text-text-muted py-12" }, "Cadastre prestadores")), /* @__PURE__ */ React.createElement(Card, { title: "Mais Acionados", sub: "Top 10" }, stats2?.top_prestadores && stats2.top_prestadores.length > 0 ? /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, stats2.top_prestadores.slice(0, 10).map((p, i) => /* @__PURE__ */ React.createElement("div", { key: p.id, className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("span", { className: `w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${i < 3 ? "bg-print-green" : "bg-surface-hover text-text-muted"}` }, i + 1), /* @__PURE__ */ React.createElement("span", { className: "flex-1 text-sm font-medium truncate text-text" }, p.nome), /* @__PURE__ */ React.createElement("div", { className: "w-32 h-2 bg-surface-hover rounded-full overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "h-full bg-print-green rounded-full", style: { width: `${Math.min(100, p.count / stats2.top_prestadores[0].count * 100)}%` } })), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-bold w-8 text-right text-text" }, p.count)))) : /* @__PURE__ */ React.createElement("p", { className: "text-center text-text-muted py-12" }, "Nenhum acionamento"))), /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React.createElement(Card, { title: "Filial mais Acionada", sub: "Por Opera\xE7\xE3o" }, stats2?.operacao_count && Object.keys(stats2.operacao_count).length > 0 ? /* @__PURE__ */ React.createElement(import_recharts2.ResponsiveContainer, { width: "100%", height: 260 }, /* @__PURE__ */ React.createElement(import_recharts2.BarChart, { data: Object.entries(stats2.operacao_count).map(([k, v]) => ({ name: FILIAL_SIGLA[k] || k, value: v })).sort((a, b) => a.value - b.value), margin: { top: 5, right: 20, left: 0, bottom: 5 } }, /* @__PURE__ */ React.createElement(import_recharts2.CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--border)" }), /* @__PURE__ */ React.createElement(import_recharts2.XAxis, { dataKey: "name", tick: { fontSize: 11, fill: "var(--text-muted)" }, stroke: "var(--border)" }), /* @__PURE__ */ React.createElement(import_recharts2.YAxis, { domain: [0, 10], allowDecimals: false, tick: { fontSize: 12, fill: "var(--text-muted)" }, stroke: "var(--border)" }), /* @__PURE__ */ React.createElement(import_recharts2.Tooltip, { contentStyle: { background: "var(--bg-alt)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" } }), /* @__PURE__ */ React.createElement(import_recharts2.Bar, { dataKey: "value", radius: [4, 4, 0, 0] }, Object.entries(stats2.operacao_count).map((_, i) => /* @__PURE__ */ React.createElement(import_recharts2.Cell, { key: i, fill: CHART_COLORS[i % 4] }))))) : /* @__PURE__ */ React.createElement("p", { className: "text-center text-text-muted py-12" }, "Sem dados de opera\xE7\xE3o"))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6" }, /* @__PURE__ */ React.createElement(Card, { title: "Taxa de Repetibilidade de Falhas", sub: "Por Marca" }, stats2?.custo_por_marca && Object.keys(stats2.custo_por_marca).length > 0 ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(import_recharts2.ResponsiveContainer, { width: "100%", height: 220 }, /* @__PURE__ */ React.createElement(import_recharts2.PieChart, null, /* @__PURE__ */ React.createElement(import_recharts2.Pie, { data: Object.entries(stats2.custo_por_marca).map(([k, v]) => ({ name: k, value: v.count })), dataKey: "value", nameKey: "name", cx: "50%", cy: "50%", outerRadius: 80, label: true }, Object.entries(stats2.custo_por_marca).map(([k], i) => /* @__PURE__ */ React.createElement(import_recharts2.Cell, { key: k, fill: CORP_COLORS[i % CORP_COLORS.length] }))), /* @__PURE__ */ React.createElement(import_recharts2.Tooltip, { contentStyle: { background: "var(--bg-alt)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" } }), /* @__PURE__ */ React.createElement(import_recharts2.Legend, null))), /* @__PURE__ */ React.createElement("p", { className: "text-center text-xs text-text-muted mt-2" }, "Taxa geral: ", /* @__PURE__ */ React.createElement("span", { className: "font-bold", style: { color: (stats2?.taxa_repetibilidade ?? 0) > 50 ? "#dc2626" : (stats2?.taxa_repetibilidade ?? 0) > 25 ? "#d97706" : "#16a34a" } }, stats2?.taxa_repetibilidade ?? 0, "%"))) : /* @__PURE__ */ React.createElement("p", { className: "text-center text-text-muted py-12" }, "Sem dados de marca")), /* @__PURE__ */ React.createElement(Card, { title: "Custo M\xE9dio por Marca", sub: "Socorro" }, stats2?.custo_por_marca && Object.keys(stats2.custo_por_marca).length > 0 ? /* @__PURE__ */ React.createElement(import_recharts2.ResponsiveContainer, { width: "100%", height: 260 }, /* @__PURE__ */ React.createElement(import_recharts2.BarChart, { data: Object.entries(stats2.custo_por_marca).map(([k, v]) => ({ name: k, custo: v.custo_medio, count: v.count })).sort((a, b) => a.custo - b.custo), margin: { top: 5, right: 20, left: 0, bottom: 5 } }, /* @__PURE__ */ React.createElement(import_recharts2.CartesianGrid, { strokeDasharray: "3 3", stroke: "var(--border)" }), /* @__PURE__ */ React.createElement(import_recharts2.XAxis, { dataKey: "name", tick: { fontSize: 11, fill: "var(--text-muted)" }, stroke: "var(--border)" }), /* @__PURE__ */ React.createElement(import_recharts2.YAxis, { tick: { fontSize: 12, fill: "var(--text-muted)" }, stroke: "var(--border)" }), /* @__PURE__ */ React.createElement(import_recharts2.Tooltip, { contentStyle: { background: "var(--bg-alt)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--text)" }, formatter: (value, name) => {
      if (name === "custo") return [BRL(value), "Custo M\xE9dio"];
      return [value, name];
    } }), /* @__PURE__ */ React.createElement(import_recharts2.Bar, { dataKey: "custo", radius: [4, 4, 0, 0] }, Object.entries(stats2.custo_por_marca).map(([k, v]) => {
      const c = v.custo_medio;
      const cor = c > 1e3 ? "#ef4444" : c > 500 ? "#eab308" : "#2dc62d";
      return /* @__PURE__ */ React.createElement(import_recharts2.Cell, { key: k, fill: cor });
    })))) : /* @__PURE__ */ React.createElement("p", { className: "text-center text-text-muted py-12" }, "Sem dados de marca"))), /* @__PURE__ */ React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ React.createElement(Card, { title: "Tempo de Atendimento (SLA)", sub: "Melhor tempo + 5 piores" }, /* @__PURE__ */ React.createElement(SlaChart2, { ordens, busca: slaBusca, filtro: slaFiltro, setBusca: setSlaBusca, setFiltro: setSlaFiltro }))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2 mb-4" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium text-text-muted" }, "Filtrar por faturamento:"), /* @__PURE__ */ React.createElement("button", { onClick: () => setFiltroFatura("todos"), className: `px-3 py-2 text-xs font-medium rounded-full transition-colors ${filtroFatura === "todos" ? "bg-print-green text-white" : "border border-border text-text-muted hover:bg-surface-hover"}` }, "Todos"), /* @__PURE__ */ React.createElement("button", { onClick: () => setFiltroFatura("fatura"), className: `px-3 py-2 text-xs font-medium rounded-full transition-colors flex items-center gap-2 ${filtroFatura === "fatura" ? "bg-blue-500 text-white" : "border border-border text-text-muted hover:bg-surface-hover"}` }, /* @__PURE__ */ React.createElement("span", { className: "w-2 h-2 rounded-full bg-blue-500" }), "Faturam"), /* @__PURE__ */ React.createElement("button", { onClick: () => setFiltroFatura("nao_fatura"), className: `px-3 py-2 text-xs font-medium rounded-full transition-colors flex items-center gap-2 ${filtroFatura === "nao_fatura" ? "bg-red-500 text-white" : "border border-border text-text-muted hover:bg-surface-hover"}` }, /* @__PURE__ */ React.createElement("span", { className: "w-2 h-2 rounded-full bg-red-500" }), "N\xE3o faturam")), /* @__PURE__ */ React.createElement("div", { ref: refMapas, className: "grade-mapas" }, /* @__PURE__ */ React.createElement(Card, { title: "Atendimento", sub: "Caminh\xF5es parados" }, /* @__PURE__ */ React.createElement(Legenda, { itens: [{ cor: "#3b82f6", rotulo: "Parado" }], resumo: Object.keys(posicoesSascar || {}).length > 0 ? `${Object.keys(posicoesSascar || {}).length} caminh\xE3o(\xF5es)` : "" }), sascarOk === false && /* @__PURE__ */ React.createElement("div", { className: "mb-2 px-2 py-1 rounded text-[10px]", style: { background: "rgba(234,179,8,0.12)", color: "#d97706" } }, "Sascar: credenciais de integra\xE7\xE3o pendentes \u2014 posi\xE7\xF5es indispon\xEDveis"), /* @__PURE__ */ React.createElement("div", { className: "mapa-painel rounded-lg overflow-hidden" }, /* @__PURE__ */ React.createElement(MapaAtendimento2, { ordens: ordens.filter((o) => !o.fechamento && !o.cancelado), posicoes: posicoesSascar, veiculos: veiculosSascar, bases }))), /* @__PURE__ */ React.createElement(Card, { title: "Cobertura", sub: "Prestadores" }, /* @__PURE__ */ React.createElement("div", { className: "barra-filtros-mapa" }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text-muted)", alignSelf: "center" } }, "FATURAMENTO"), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 5, color: "var(--text)", cursor: "pointer", alignSelf: "flex-start" } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: mapShowFatura, onChange: () => setMapShowFatura((v) => !v), style: { accentColor: "#16a34a" } }), /* @__PURE__ */ React.createElement("span", null, "Faturado")), /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 5, color: "var(--text)", cursor: "pointer", alignSelf: "flex-start" } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: mapShowNaoFatura, onChange: () => setMapShowNaoFatura((v) => !v), style: { accentColor: "#dc2626" } }), /* @__PURE__ */ React.createElement("span", null, "N\xE3o fatura")), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 9, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--text-muted)", alignSelf: "center", marginLeft: 8 } }, "REGI\xC3O"), MAP_REGIOES.map((r) => /* @__PURE__ */ React.createElement("label", { key: r.id, style: { display: "flex", alignItems: "center", gap: 5, color: "var(--text)", cursor: "pointer", alignSelf: "flex-start" } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", checked: mapRegioes.has(r.id), onChange: () => toggleMapRegiao(r.id), style: { accentColor: "#16a34a" } }), /* @__PURE__ */ React.createElement("span", null, r.label))), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, color: "var(--text-muted)", marginLeft: "auto", fontWeight: 700 } }, filteredMapPrestadores.length, " prestador(es)")), /* @__PURE__ */ React.createElement("div", { className: "mapa-painel rounded-lg overflow-hidden" }, /* @__PURE__ */ React.createElement(MapaBrasil2, { prestadores: filteredMapPrestadores, bases })))), /* @__PURE__ */ React.createElement("div", { className: "mt-6" }, /* @__PURE__ */ React.createElement(Card, { title: "Frota Sascar", sub: "Todos os veiculos" }, /* @__PURE__ */ React.createElement(Legenda, { itens: [{ cor: "#22c55e", rotulo: "Em movimento" }, { cor: "#3b82f6", rotulo: "Parado" }], resumo: `${Object.keys(posicoesSascar || {}).length} veiculo(s)` }), /* @__PURE__ */ React.createElement("div", { className: "h-[600px] rounded-lg overflow-hidden" }, /* @__PURE__ */ React.createElement(MapaFrota2, { posicoes: posicoesSascar, ordens: ordens.filter((o) => !o.fechamento && !o.cancelado), bases }))))), !loading && tab === "atendimento" && /* @__PURE__ */ React.createElement(TabAtendimento, { ordens, loadData: refresh, updO, canWrite, onReport: (x) => {
      setNotasOpen(x);
      carregarNotas(x.id);
    }, onEdit: (x) => setEditO(x) }), !loading && tab === "acompanhamento" && /* @__PURE__ */ React.createElement(TabAcompanhamento, { ordens }), !loading && tab === "prestadores" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-3 mb-4" }, /* @__PURE__ */ React.createElement("div", { className: "relative flex-1 basis-full sm:basis-auto max-w-md" }, /* @__PURE__ */ React.createElement(import_lucide_react.Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-soft" }), /* @__PURE__ */ React.createElement("input", { value: search, onChange: (e) => setSearch(e.target.value), placeholder: "Buscar...", className: "w-full pl-9 pr-4 py-2 rounded-lg border border-border bg-surface-alt text-text text-sm focus:outline-none focus:ring-2 focus:ring-print-green/30" })), /* @__PURE__ */ React.createElement("span", { className: "text-sm text-text-muted" }, prestadores.length, " prestadores"), canWrite && /* @__PURE__ */ React.createElement("div", { className: "ml-auto flex flex-wrap gap-3" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setImportar("prestadores"), className: "px-3 py-2 text-sm font-bold border border-border text-text-muted rounded-lg hover:bg-surface-hover flex items-center gap-2" }, /* @__PURE__ */ React.createElement(import_lucide_react.Upload, { className: "w-4 h-4" }), "Importar planilha"), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowP(true), className: "px-3 py-2 text-sm font-bold bg-print-green text-white rounded-lg hover:bg-print-green-dark flex items-center gap-2" }, /* @__PURE__ */ React.createElement(import_lucide_react.Plus, { className: "w-4 h-4" }), "Novo Prestador"))), /* @__PURE__ */ React.createElement("div", { className: "hidden sm:block overflow-x-auto rounded-xl border border-border" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-sm" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "bg-surface-alt text-left" }, /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "Nome"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "CNPJ"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "Cidade/UF"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "Tipo"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "Telefone"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "Status"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "24h"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "Fatura"), canWrite && /* @__PURE__ */ React.createElement("th", { className: "p-3" }))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-border" }, filtered.map((p) => /* @__PURE__ */ React.createElement("tr", { key: p.id, className: "hover:bg-surface-hover/50 transition-colors" }, /* @__PURE__ */ React.createElement("td", { className: "p-3 font-medium text-text" }, p.nome), /* @__PURE__ */ React.createElement("td", { className: "p-3 text-text-muted" }, p.cnpj), /* @__PURE__ */ React.createElement("td", { className: "p-3 text-text" }, p.cidade, "/", p.estado), /* @__PURE__ */ React.createElement("td", { className: "p-3" }, /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${TIPO_BADGE[p.tipo_servico] || ""}` }, TIPO_LABELS[p.tipo_servico] || p.tipo_servico)), /* @__PURE__ */ React.createElement("td", { className: "p-3 text-text-muted" }, p.telefone), /* @__PURE__ */ React.createElement("td", { className: "p-3" }, statusP(p)), /* @__PURE__ */ React.createElement("td", { className: "p-3 text-text" }, p.socorro_24h ? "\u2705" : "\u2014"), /* @__PURE__ */ React.createElement("td", { className: "p-3 text-text" }, p.fatura ? "\u2705" : "\u2014"), canWrite && /* @__PURE__ */ React.createElement("td", { className: "p-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex gap-1" }, acoesP(p))))), filtered.length === 0 && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: canWrite ? 9 : 8, className: "p-8 text-center text-text-muted" }, "Nenhum prestador"))))), /* @__PURE__ */ React.createElement("div", { className: "sm:hidden lista-cartoes" }, filtered.map((p) => /* @__PURE__ */ React.createElement("div", { key: p.id, className: "cartao-item" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "font-semibold text-text min-w-0", style: { overflowWrap: "anywhere" } }, p.nome), /* @__PURE__ */ React.createElement("span", { className: `shrink-0 px-2 py-1 rounded-full text-xs font-medium ${TIPO_BADGE[p.tipo_servico] || ""}` }, TIPO_LABELS[p.tipo_servico] || p.tipo_servico)), /* @__PURE__ */ React.createElement("dl", { className: "cartao-dados" }, /* @__PURE__ */ React.createElement("dt", null, "Cidade/UF"), /* @__PURE__ */ React.createElement("dd", null, p.cidade, "/", p.estado), /* @__PURE__ */ React.createElement("dt", null, "CNPJ"), /* @__PURE__ */ React.createElement("dd", null, p.cnpj || "\u2014"), /* @__PURE__ */ React.createElement("dt", null, "Telefone"), /* @__PURE__ */ React.createElement("dd", null, p.telefone || "\u2014"), /* @__PURE__ */ React.createElement("dt", null, "Status"), /* @__PURE__ */ React.createElement("dd", null, statusP(p)), /* @__PURE__ */ React.createElement("dt", null, "24h"), /* @__PURE__ */ React.createElement("dd", null, p.socorro_24h ? "\u2705" : "\u2014"), /* @__PURE__ */ React.createElement("dt", null, "Fatura"), /* @__PURE__ */ React.createElement("dd", null, p.fatura ? "\u2705" : "\u2014")), canWrite && /* @__PURE__ */ React.createElement("div", { className: "cartao-acoes" }, acoesP(p)))), filtered.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "p-8 text-center text-sm text-text-muted" }, "Nenhum prestador"))), !loading && tab === "ocorrencias" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-3 mb-4" }, /* @__PURE__ */ React.createElement("h2", { className: "mr-auto font-heading text-lg font-semibold text-text" }, "Ocorr\xEAncias"), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-text-muted" }, ocorrencias.length, " aguardando")), ocorrencias.length > 0 ? /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, ocorrencias.map((oc) => /* @__PURE__ */ React.createElement("div", { key: oc.id, className: "flex items-center gap-4 p-4 rounded-xl border-2 border-red-500 bg-red-500/10 animate-pulse" }, /* @__PURE__ */ React.createElement(import_lucide_react.AlertTriangle, { className: "w-6 h-6 text-red-500 shrink-0" }), /* @__PURE__ */ React.createElement("div", { className: "flex-1 min-w-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-red-400" }, "\u{1F69B} ", oc.placa || "\u2014"), /* @__PURE__ */ React.createElement("span", { className: "text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300 font-semibold" }, oc.tipo === "eletrica" ? "El\xE9trica" : oc.tipo === "mecanica" ? "Mec\xE2nica" : "Outro")), oc.descricao && /* @__PURE__ */ React.createElement("p", { className: "text-sm text-text-muted mt-1 truncate" }, oc.descricao), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-text-muted mt-1" }, "Via WhatsApp ", oc.de_whatsapp, " \xB7 ", oc.criado_em ? new Date(oc.criado_em).toLocaleTimeString("pt-BR") : "")), canWrite && /* @__PURE__ */ React.createElement("button", { onClick: () => aceitarOcorrencia(oc.id), className: "px-3 py-2 text-sm font-bold bg-print-green text-white rounded-lg hover:bg-print-green-dark shrink-0" }, "Aceitar")))) : /* @__PURE__ */ React.createElement("p", { className: "text-center text-text-muted py-12" }, "Nenhuma ocorr\xEAncia pendente")), !loading && tab === "pecas" && /* @__PURE__ */ React.createElement(PecasKanban2, null), !loading && tab === "config" && /* @__PURE__ */ React.createElement(Configuracoes, { admin: canManage }), !loading && tab === "cancelamentos" && /* @__PURE__ */ React.createElement(Cancelamentos, { podeAprovar: canManage }), !loading && tab === "bases" && canManage && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-3 mb-4" }, /* @__PURE__ */ React.createElement("h2", { className: "mr-auto font-heading text-lg font-semibold", style: { color: "var(--text)" } }, "Bases"), /* @__PURE__ */ React.createElement("span", { className: "text-xs", style: { color: "var(--text-muted)" } }, bases.length, " cadastrada(s)")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-xl p-4 lg:self-start min-w-0", style: { border: "1px solid var(--border)", background: "var(--bg-card)" } }, /* @__PURE__ */ React.createElement("div", { className: "text-sm font-bold mb-3", style: { color: "var(--text)" } }, editBase ? "Editar base" : "Nova base"), /* @__PURE__ */ React.createElement("form", { onSubmit: addBase, className: "space-y-2" }, /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px]", style: { color: "var(--text-muted)" } }, "Nome"), /* @__PURE__ */ React.createElement("input", { name: "nome", required: true, defaultValue: editBase?.nome || "", key: "bn" + (editBase?.id || "n"), className: "mt-1 w-full px-2 py-2 rounded-lg border text-xs", style: { background: "var(--bg-alt)", borderColor: "var(--border)", color: "var(--text)" } })), /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px]", style: { color: "var(--text-muted)" } }, "Endere\xE7o"), /* @__PURE__ */ React.createElement("input", { name: "endereco", defaultValue: editBase?.endereco || "", key: "be" + (editBase?.id || "n"), className: "mt-1 w-full px-2 py-2 rounded-lg border text-xs", style: { background: "var(--bg-alt)", borderColor: "var(--border)", color: "var(--text)" } })), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2" }, /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px]", style: { color: "var(--text-muted)" } }, "Latitude"), /* @__PURE__ */ React.createElement("input", { name: "lat", required: true, type: "number", step: "any", defaultValue: editBase?.lat ?? "", key: "bl" + (editBase?.id || "n"), className: "mt-1 w-full px-2 py-2 rounded-lg border text-xs", style: { background: "var(--bg-alt)", borderColor: "var(--border)", color: "var(--text)" } })), /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "text-[10px]", style: { color: "var(--text-muted)" } }, "Longitude"), /* @__PURE__ */ React.createElement("input", { name: "lng", required: true, type: "number", step: "any", defaultValue: editBase?.lng ?? "", key: "bg" + (editBase?.id || "n"), className: "mt-1 w-full px-2 py-2 rounded-lg border text-xs", style: { background: "var(--bg-alt)", borderColor: "var(--border)", color: "var(--text)" } }))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 pt-1" }, /* @__PURE__ */ React.createElement("button", { className: "flex-1 py-2 rounded-lg text-xs font-bold cursor-pointer", style: { background: "var(--accent-green)", color: "#fff" } }, editBase ? "Salvar" : "Adicionar"), editBase && /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setEditBase(null), className: "px-3 py-2 rounded-lg text-xs font-bold cursor-pointer", style: { border: "1px solid var(--border)", color: "var(--text-muted)" } }, "Cancelar")))), /* @__PURE__ */ React.createElement("div", { className: "lg:col-span-2 min-w-0 rounded-xl border overflow-x-auto", style: { borderColor: "var(--border)", background: "var(--bg-card)" } }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-sm" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "text-left", style: { background: "var(--bg-alt)" } }, /* @__PURE__ */ React.createElement("th", { className: "p-3 text-[10px]", style: { color: "var(--text-muted)" } }, "BASE"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-[10px]", style: { color: "var(--text-muted)" } }, "ENDERE\xC7O"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-[10px]", style: { color: "var(--text-muted)" } }, "COORD"), /* @__PURE__ */ React.createElement("th", { className: "p-3" }))), /* @__PURE__ */ React.createElement("tbody", null, bases.map((b) => /* @__PURE__ */ React.createElement("tr", { key: b.id, style: { borderTop: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("td", { className: "p-3 font-semibold", style: { color: "var(--text)" } }, b.nome), /* @__PURE__ */ React.createElement("td", { className: "p-3 text-[10px]", style: { color: "var(--text-muted)", minWidth: 160 } }, b.endereco || "\u2014"), /* @__PURE__ */ React.createElement("td", { className: "p-3 font-mono text-[10px] whitespace-nowrap", style: { color: "var(--text-muted)" } }, Number(b.lat).toFixed(3), ", ", Number(b.lng).toFixed(3)), /* @__PURE__ */ React.createElement("td", { className: "p-3 text-right whitespace-nowrap" }, canWrite && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { onClick: () => setEditBase(b), className: "px-2 py-1 rounded text-[10px] font-bold mr-2 cursor-pointer", style: { color: "var(--accent-green)", border: "1px solid var(--border-bright)" } }, "Editar"), canManage && /* @__PURE__ */ React.createElement("button", { onClick: () => delBase(b.id), className: "px-2 py-1 rounded text-[10px] font-bold cursor-pointer", style: { color: "#c62828", border: "1px solid var(--border-bright)" } }, "Excluir")))))))))), !loading && tab === "ordens" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-3 mb-4" }, /* @__PURE__ */ React.createElement("h2", { className: "mr-auto font-heading text-lg font-semibold text-text" }, "Ordens de Servi\xE7o"), /* @__PURE__ */ React.createElement("select", { value: filtroOrdemStatus, onChange: (e) => setFiltroOrdemStatus(e.target.value), className: "px-2 py-2 rounded border text-xs", style: { background: "var(--bg-alt)", borderColor: "var(--border)", color: "var(--text)" } }, /* @__PURE__ */ React.createElement("option", { value: "Aberta" }, "ABERTAS"), /* @__PURE__ */ React.createElement("option", { value: "EmAtendimento" }, "EM ATENDIMENTO"), /* @__PURE__ */ React.createElement("option", { value: "Finalizada" }, "FECHADAS"), /* @__PURE__ */ React.createElement("option", { value: "Cancelada" }, "CANCELADAS"), /* @__PURE__ */ React.createElement("option", { value: "todos" }, "TODAS")), canWrite && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setShowO(true);
      loadVeiculosSascar();
      loadPosicoesSascar().then(() => {
        fetcher("/frota/placas").then((fr) => {
          if (fr?.data) setFrotaPlacas(fr.data);
        });
      });
    }, className: "px-3 py-2 text-sm font-bold bg-print-green text-white rounded-lg hover:bg-print-green-dark flex items-center gap-2" }, /* @__PURE__ */ React.createElement(import_lucide_react.Plus, { className: "w-4 h-4" }), "Nova O.S"), /* @__PURE__ */ React.createElement("button", { onClick: () => setImportar("ordens"), className: "px-3 py-2 text-sm font-bold border border-border text-text-muted rounded-lg hover:bg-surface-hover flex items-center gap-2" }, /* @__PURE__ */ React.createElement(import_lucide_react.Upload, { className: "w-4 h-4" }), "Importar O.S."))), /* @__PURE__ */ React.createElement("div", { className: "hidden sm:block overflow-x-auto rounded-xl border border-border" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-sm" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "bg-surface-alt text-left" }, /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "O.S"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "Data"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "Placa"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "Modelo"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "Marca"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "Motorista"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "Servi\xE7o"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "Prestador"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "Prioridade"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "Valor"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "Andamento"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "Criado por"), /* @__PURE__ */ React.createElement("th", { className: "p-3" }))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-border" }, ordensTabela.map((o) => /* @__PURE__ */ React.createElement("tr", { key: o.id, className: "hover:bg-surface-hover/50" }, /* @__PURE__ */ React.createElement("td", { className: "p-3 font-bold text-print-green" }, o.os, seloCancPendente(o)), /* @__PURE__ */ React.createElement("td", { className: "p-3 text-text whitespace-nowrap" }, fmtData2(o.data)), /* @__PURE__ */ React.createElement("td", { className: "p-3 font-semibold text-text" }, o.placa || "\u2014"), /* @__PURE__ */ React.createElement("td", { className: "p-3 text-text" }, o.modelo || "\u2014"), /* @__PURE__ */ React.createElement("td", { className: "p-3 text-text" }, o.marca || "\u2014"), /* @__PURE__ */ React.createElement("td", { className: "p-3 text-text" }, o.motorista || "\u2014"), /* @__PURE__ */ React.createElement("td", { className: "p-3 text-text" }, o.servico_realizado || TIPO_LBL[o.tipo_servico] || o.tipo_servico || "\u2014"), /* @__PURE__ */ React.createElement("td", { className: "p-3 text-text-muted" }, o.prestador_nome || "\u2014"), /* @__PURE__ */ React.createElement("td", { className: "p-3" }, /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${corPrioridade(o.prioridade)}` }, o.prioridade || "Normal")), /* @__PURE__ */ React.createElement("td", { className: "p-3 font-semibold text-text whitespace-nowrap" }, BRL(o.valor)), /* @__PURE__ */ React.createElement("td", { className: "p-3" }, selStatus(o)), /* @__PURE__ */ React.createElement("td", { className: "p-3 text-text-muted" }, o.criado_por || "\u2014", o.atualizado_por && o.atualizado_por !== o.criado_por && /* @__PURE__ */ React.createElement("div", { className: "text-[9px]", style: { color: "var(--text-muted)" } }, "\u21BB ", o.atualizado_por)), /* @__PURE__ */ React.createElement("td", { className: "p-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex gap-1" }, acoesOS(o))))), ordensTabela.length === 0 && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: 13, className: "p-8 text-center text-text-muted" }, "Nenhuma O.S registrada"))))), /* @__PURE__ */ React.createElement("div", { className: "sm:hidden lista-cartoes" }, ordensTabela.map((o) => /* @__PURE__ */ React.createElement("div", { key: o.id, className: "cartao-item" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "font-bold text-print-green" }, "O.S. ", o.os || "\u2014", seloCancPendente(o)), /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${corPrioridade(o.prioridade)}` }, o.prioridade || "Normal")), /* @__PURE__ */ React.createElement("dl", { className: "cartao-dados" }, /* @__PURE__ */ React.createElement("dt", null, "Data"), /* @__PURE__ */ React.createElement("dd", null, fmtData2(o.data)), /* @__PURE__ */ React.createElement("dt", null, "Placa"), /* @__PURE__ */ React.createElement("dd", { className: "font-semibold" }, o.placa || "\u2014"), /* @__PURE__ */ React.createElement("dt", null, "Ve\xEDculo"), /* @__PURE__ */ React.createElement("dd", null, [o.modelo, o.marca].filter(Boolean).join(" \xB7 ") || "\u2014"), /* @__PURE__ */ React.createElement("dt", null, "Motorista"), /* @__PURE__ */ React.createElement("dd", null, o.motorista || "\u2014"), /* @__PURE__ */ React.createElement("dt", null, "Servi\xE7o"), /* @__PURE__ */ React.createElement("dd", null, o.servico_realizado || TIPO_LBL[o.tipo_servico] || o.tipo_servico || "\u2014"), /* @__PURE__ */ React.createElement("dt", null, "Prestador"), /* @__PURE__ */ React.createElement("dd", null, o.prestador_nome || "\u2014"), /* @__PURE__ */ React.createElement("dt", null, "Valor"), /* @__PURE__ */ React.createElement("dd", { className: "font-semibold" }, BRL(o.valor)), /* @__PURE__ */ React.createElement("dt", null, "Criado por"), /* @__PURE__ */ React.createElement("dd", null, o.criado_por || "\u2014", o.atualizado_por && o.atualizado_por !== o.criado_por ? ` \xB7 \u21BB ${o.atualizado_por}` : "")), selStatus(o, "w-full"), /* @__PURE__ */ React.createElement("div", { className: "cartao-acoes" }, acoesOS(o)))), ordensTabela.length === 0 && /* @__PURE__ */ React.createElement("p", { className: "p-8 text-center text-sm text-text-muted" }, "Nenhuma O.S registrada"))), !loading && tab === "usuarios" && canManage && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-3 mb-4" }, /* @__PURE__ */ React.createElement("h2", { className: "mr-auto font-heading text-lg font-semibold text-text" }, "Usu\xE1rios do Painel"), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowUser(true), className: "px-3 py-2 text-sm font-bold bg-print-green text-white rounded-lg hover:bg-print-green-dark flex items-center gap-2" }, /* @__PURE__ */ React.createElement(import_lucide_react.UserPlus, { className: "w-4 h-4" }), "Novo Usu\xE1rio")), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto rounded-xl border border-border" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-sm" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "bg-surface-alt text-left" }, /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "Nome"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "Email"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "Situa\xE7\xE3o"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "N\xEDvel de Acesso"), /* @__PURE__ */ React.createElement("th", { className: "p-3" }))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-border" }, usuarios.map((u) => {
      const pend = u.status === "pendente";
      return /* @__PURE__ */ React.createElement("tr", { key: u.id, className: pend ? "bg-accent-yellow/10" : "hover:bg-surface-hover/50" }, /* @__PURE__ */ React.createElement("td", { className: "p-3 font-medium text-text" }, u.nome || "\u2014"), /* @__PURE__ */ React.createElement("td", { className: "p-3 text-text-muted" }, u.email), /* @__PURE__ */ React.createElement("td", { className: "p-3" }, pend ? /* @__PURE__ */ React.createElement("span", { className: "px-2 py-1 rounded-full text-xs font-bold bg-accent-yellow/20 text-accent-yellow" }, "PENDENTE") : u.status === "sem_senha" ? /* @__PURE__ */ React.createElement("span", { className: "px-2 py-1 rounded-full text-xs font-bold", style: { background: "rgba(234,179,8,0.18)", color: "#eab308" }, title: "Clique em Editar (l\xE1pis) e defina a senha para liberar o acesso" }, "Sem senha") : /* @__PURE__ */ React.createElement("span", { className: "px-2 py-1 rounded-full text-xs font-medium bg-print-green/15 text-print-green" }, "Ativo")), /* @__PURE__ */ React.createElement("td", { className: "p-3" }, pend ? /* @__PURE__ */ React.createElement("select", { className: "px-2 py-1 rounded border border-accent-yellow/50 bg-surface-alt text-text text-xs", onChange: (e) => aprovarUser(u.id, e.target.value), defaultValue: "" }, /* @__PURE__ */ React.createElement("option", { value: "", disabled: true }, "Escolher n\xEDvel\u2026"), OPCOES_PAPEL.map((o) => /* @__PURE__ */ React.createElement("option", { key: o.v, value: o.v }, o.l))) : /* @__PURE__ */ React.createElement("select", { value: u.role, onChange: (e) => setRole(u.id, e.target.value), className: "px-2 py-1 rounded border border-border bg-surface-alt text-text text-xs" }, OPCOES_PAPEL.map((o) => /* @__PURE__ */ React.createElement("option", { key: o.v, value: o.v }, o.l)))), /* @__PURE__ */ React.createElement("td", { className: "p-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex gap-1" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setEditU(u), className: "p-2 rounded hover:bg-print-green/10 text-print-green", title: "Editar" }, /* @__PURE__ */ React.createElement(import_lucide_react.Pencil, { className: "w-4 h-4" })), /* @__PURE__ */ React.createElement("button", { onClick: () => delUser(u.id), className: "p-2 rounded hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500", title: "Remover" }, /* @__PURE__ */ React.createElement(import_lucide_react.Trash2, { className: "w-4 h-4" })))));
    }))))), !loading && tab === "log" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-3 mb-4" }, /* @__PURE__ */ React.createElement("h2", { className: "mr-auto font-heading text-lg font-semibold text-text" }, "Log de Opera\xE7\xE3o"), /* @__PURE__ */ React.createElement("span", { className: "text-sm text-text-muted" }, log.length, " eventos")), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto rounded-xl border border-border" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-sm" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", { className: "bg-surface-alt text-left" }, /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "Data/Hora"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "Evento"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "O.S."), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "Detalhe"), /* @__PURE__ */ React.createElement("th", { className: "p-3 text-text-muted" }, "Por"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-border" }, log.map((e, i) => {
      const isAlert = e.evento === "SLA_ALERTA_60MIN";
      return /* @__PURE__ */ React.createElement("tr", { key: e.id || i, className: isAlert ? "bg-red-500/5" : "hover:bg-surface-hover/50" }, /* @__PURE__ */ React.createElement("td", { className: "p-3 text-text-muted whitespace-nowrap" }, e.created_at ? new Date(e.created_at).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" }) : "\u2014"), /* @__PURE__ */ React.createElement("td", { className: "p-3" }, /* @__PURE__ */ React.createElement("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${isAlert ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" : "bg-print-green/10 text-print-green"}` }, e.evento)), /* @__PURE__ */ React.createElement("td", { className: "p-3 font-bold text-print-green" }, e.os || "\u2014"), /* @__PURE__ */ React.createElement("td", { className: "p-3 text-text" }, e.detalhe), /* @__PURE__ */ React.createElement("td", { className: "p-3 text-text-muted" }, e.quem));
    }), log.length === 0 && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: 5, className: "p-8 text-center text-text-muted" }, "Nenhum evento registrado")))))))), /* @__PURE__ */ React.createElement(Modal, { open: showP, close: () => setShowP(false), title: "Novo Prestador" }, /* @__PURE__ */ React.createElement("form", { onSubmit: addP, className: "space-y-4" }, /* @__PURE__ */ React.createElement(Inp, { n: "nome", l: "Nome", r: true }), /* @__PURE__ */ React.createElement(Inp, { n: "cnpj", l: "CNPJ" }), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement(Inp, { n: "cidade", l: "Cidade" }), /* @__PURE__ */ React.createElement(Inp, { n: "estado", l: "UF", m: 2 })), /* @__PURE__ */ React.createElement(Sel, { n: "tipo_servico", l: "Tipo", o: [{ v: "mecanico", l: "Mec\xE2nico" }, { v: "eletrico", l: "El\xE9trico" }, { v: "eletronica", l: "Eletr\xF4nica" }, { v: "eletrica_mecanica", l: "El\xE9trica/Mec\xE2nica" }, { v: "borracharia", l: "Borracharia" }, { v: "guincho", l: "Guincho" }, { v: "funilaria", l: "Funilaria" }, { v: "bau", l: "Ba\xFA" }] }), /* @__PURE__ */ React.createElement(Inp, { n: "telefone", l: "Telefone" }), /* @__PURE__ */ React.createElement("div", { className: "flex gap-6" }, /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2 text-sm text-text" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", name: "socorro_24h", className: "rounded" }), "Socorro 24h"), /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2 text-sm text-text" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", name: "fatura", className: "rounded" }), "Fatura")), /* @__PURE__ */ React.createElement("button", { className: "w-full py-2 bg-print-green text-white font-bold rounded-lg hover:bg-print-green-dark transition-colors" }, "Cadastrar"))), /* @__PURE__ */ React.createElement(Modal, { open: !!editP, close: () => setEditP(null), title: `Editar Prestador` }, /* @__PURE__ */ React.createElement("form", { onSubmit: saveEditP, className: "space-y-4" }, /* @__PURE__ */ React.createElement(Inp, { n: "nome", l: "Nome", r: true, v: editP?.nome }), /* @__PURE__ */ React.createElement(Inp, { n: "cnpj", l: "CNPJ", v: editP?.cnpj }), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement(Inp, { n: "cidade", l: "Cidade", v: editP?.cidade }), /* @__PURE__ */ React.createElement(Inp, { n: "estado", l: "UF", m: 2, v: editP?.estado })), /* @__PURE__ */ React.createElement(Sel, { n: "tipo_servico", l: "Tipo", o: [{ v: "mecanico", l: "Mec\xE2nico" }, { v: "eletrico", l: "El\xE9trico" }, { v: "eletronica", l: "Eletr\xF4nica" }, { v: "eletrica_mecanica", l: "El\xE9trica/Mec\xE2nica" }, { v: "borracharia", l: "Borracharia" }, { v: "guincho", l: "Guincho" }, { v: "funilaria", l: "Funilaria" }, { v: "bau", l: "Ba\xFA" }], v: editP?.tipo_servico }), /* @__PURE__ */ React.createElement(Inp, { n: "telefone", l: "Telefone", v: editP?.telefone }), /* @__PURE__ */ React.createElement("div", { className: "flex gap-6" }, /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2 text-sm text-text" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", name: "socorro_24h", className: "rounded", defaultChecked: editP?.socorro_24h }), "Socorro 24h"), /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-2 text-sm text-text" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", name: "fatura", className: "rounded", defaultChecked: editP?.fatura }), "Fatura")), /* @__PURE__ */ React.createElement("button", { className: "w-full py-2 bg-print-green text-white font-bold rounded-lg hover:bg-print-green-dark transition-colors" }, "Salvar Altera\xE7\xF5es"))), /* @__PURE__ */ React.createElement(ReportModal, { ordem: notasOpen, onClose: () => setNotasOpen(null) }), /* @__PURE__ */ React.createElement(Modal, { open: showA, close: () => {
      setShowA(false);
      setSelP(null);
    }, title: `Acionar${selP ? ` \u2014 ${selP.nome}` : ""}` }, /* @__PURE__ */ React.createElement("form", { onSubmit: addA, className: "space-y-4" }, /* @__PURE__ */ React.createElement("input", { type: "hidden", name: "prestador_id", value: selP?.id || "" }), /* @__PURE__ */ React.createElement(Inp, { n: "local", l: "Local" }), /* @__PURE__ */ React.createElement(Sel, { n: "tipo_servico", l: "Tipo", o: [{ v: "mecanico", l: "Mec\xE2nico" }, { v: "eletrico", l: "El\xE9trico" }, { v: "eletronica", l: "Eletr\xF4nica" }, { v: "eletrica_mecanica", l: "El\xE9trica/Mec\xE2nica" }, { v: "borracharia", l: "Borracharia" }, { v: "guincho", l: "Guincho" }, { v: "funilaria", l: "Funilaria" }, { v: "bau", l: "Ba\xFA" }] }), /* @__PURE__ */ React.createElement(Inp, { n: "data", l: "Data", t: "date" }), /* @__PURE__ */ React.createElement(Inp, { n: "observacoes", l: "Observa\xE7\xF5es" }), /* @__PURE__ */ React.createElement("button", { className: "w-full py-2 bg-print-green text-white font-bold rounded-lg hover:bg-print-green-dark transition-colors" }, "Registrar"))), /* @__PURE__ */ React.createElement(Modal, { open: !!importar, close: () => setImportar(null), title: importar === "ordens" ? "Importar O.S. por planilha" : "Importar prestadores por planilha", wide: true }, importar && /* @__PURE__ */ React.createElement(ImportarPlanilha, { key: importar, tipo: importar, onConcluir: loadData })), /* @__PURE__ */ React.createElement(Modal, { open: !!editU, close: () => setEditU(null), title: "Editar Usu\xE1rio" }, /* @__PURE__ */ React.createElement("form", { onSubmit: saveEditUser, className: "space-y-3" }, /* @__PURE__ */ React.createElement(Inp, { n: "nome", l: "Nome", r: true, v: editU?.nome }), /* @__PURE__ */ React.createElement(Inp, { n: "email", l: "Email (login)", t: "email", r: true, v: editU?.email }), /* @__PURE__ */ React.createElement(Inp, { n: "password", l: "Nova Senha (deixe vazio p/ manter)", t: "password" }), /* @__PURE__ */ React.createElement(Sel, { n: "role", l: "N\xEDvel de Acesso", o: OPCOES_PAPEL, v: editU?.role }), /* @__PURE__ */ React.createElement("button", { className: "w-full py-2 bg-print-green text-white font-bold rounded-lg hover:bg-print-green-dark transition-colors" }, "Salvar Altera\xE7\xF5es"))), /* @__PURE__ */ React.createElement(Modal, { open: showUser, close: () => setShowUser(false), title: "Novo Usu\xE1rio" }, /* @__PURE__ */ React.createElement("form", { onSubmit: addUser, className: "space-y-4" }, /* @__PURE__ */ React.createElement(Inp, { n: "nome", l: "Nome", r: true }), /* @__PURE__ */ React.createElement(Inp, { n: "email", l: "Email", t: "email", r: true }), /* @__PURE__ */ React.createElement(Inp, { n: "password", l: "Senha", t: "password", r: true }), /* @__PURE__ */ React.createElement(Sel, { n: "role", l: "N\xEDvel de Acesso", o: OPCOES_PAPEL }), /* @__PURE__ */ React.createElement("button", { className: "w-full py-2 bg-print-green text-white font-bold rounded-lg hover:bg-print-green-dark transition-colors" }, "Criar Usu\xE1rio"))), /* @__PURE__ */ React.createElement("div", { className: showO ? "fixed inset-0 z-50 flex items-center justify-center p-4" : "hidden", role: "dialog", "aria-modal": "true", "aria-label": "Nova Ordem de Servi\xE7o" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-black/50", onClick: () => {
      setShowO(false);
      setMoreDet(false);
    } }), /* @__PURE__ */ React.createElement("div", { className: "relative z-10 janela rounded-2xl w-full max-w-3xl min-w-0 shadow-2xl max-h-[92vh] overflow-y-auto", style: { background: "var(--bg-card)", border: "1px solid var(--border-bright)" } }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-[9px] uppercase tracking-wider", style: { color: "var(--text-muted)" } }, "Nova Ordem de Servi\xE7o"), /* @__PURE__ */ React.createElement("h2", { className: "text-sm font-bold", style: { color: "var(--text)" } }, (/* @__PURE__ */ new Date()).getHours() < 12 ? "Bom dia" : (/* @__PURE__ */ new Date()).getHours() < 18 ? "Boa tarde" : "Boa noite", user && user.nome ? ", " + String(user.nome).split(" ")[0] : "", ".")), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setShowO(false);
      setMoreDet(false);
    }, className: "p-1 rounded cursor-pointer flex items-center justify-center", style: { color: "var(--text-muted)" }, "aria-label": "Fechar", title: "Fechar" }, /* @__PURE__ */ React.createElement(import_lucide_react.X, { className: "w-4 h-4" }))), /* @__PURE__ */ React.createElement("form", { onSubmit: addO, className: "space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setCarga("carregado"), className: "flex-1 py-2 rounded-lg text-[11px] font-bold cursor-pointer", style: { background: carga === "carregado" ? "rgba(229,57,53,.15)" : "var(--bg-alt)", border: "1.5px solid " + (carga === "carregado" ? "#E53935" : "var(--border)"), color: carga === "carregado" ? "#E53935" : "var(--text-muted)" } }, "CARREGADO"), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setCarga("vazio"), className: "flex-1 py-2 rounded-lg text-[11px] font-bold cursor-pointer", style: { background: carga === "vazio" ? "rgba(37,214,71,.15)" : "var(--bg-alt)", border: "1.5px solid " + (carga === "vazio" ? "#25D647" : "var(--border)"), color: carga === "vazio" ? "#25D647" : "var(--text-muted)" } }, "VAZIO")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-[9px] font-bold uppercase tracking-wider", style: { color: "var(--text-muted)" } }, "N\xBA da O.S. ", /* @__PURE__ */ React.createElement("span", { style: { background: "rgba(37,214,71,.15)", color: "#146E1F", padding: "1px 6px", borderRadius: 99, fontSize: 7, marginLeft: 4 } }, "EDIT\xC1VEL")), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mt-1" }, /* @__PURE__ */ React.createElement("input", { name: "os", placeholder: "000012", className: "flex-1 px-3 py-2 rounded-lg text-sm", style: { background: "var(--bg-alt)", border: "1px solid var(--border)", color: "var(--text)" } }), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => {
      const el = document.querySelector('input[name="os"]');
      if (el) {
        el.value = String(Date.now()).slice(-6);
      }
    }, className: "px-4 rounded-lg text-[11px] font-bold cursor-pointer", style: { background: "var(--bg-alt)", border: "1px solid var(--border-bright)", color: "var(--text)" } }, "Usar pr\xF3ximo")), /* @__PURE__ */ React.createElement("div", { className: "text-[9px] mt-1", style: { color: "var(--text-soft)" } }, "Digite qualquer n\xFAmero \xB7 se deixar vazio, o sistema gera o pr\xF3ximo")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-[9px] font-bold uppercase tracking-wider", style: { color: "var(--text-muted)" } }, "Placa ", /* @__PURE__ */ React.createElement("span", { style: { background: "rgba(30,136,229,.15)", color: "#1E88E5", padding: "1px 6px", borderRadius: 99, fontSize: 7, marginLeft: 4 } }, "SASCAR")), /* @__PURE__ */ React.createElement("input", { name: "placa", required: true, value: placaNova, onChange: (e) => {
      const v = e.target.value.toUpperCase();
      setPlacaNova(v);
      preencherPorPlaca(v);
      const fv = frotaPlacas.find((f) => String(f.placa).toUpperCase().replace(/-\d+$/, "") === v.trim().toUpperCase().replace(/-\d+$/, ""));
      if (fv) {
        const pos = (posicoesSascar || {})[v.trim().toUpperCase()];
        setAutofill((prev) => ({ ...prev || {}, filial: fv.filial, modelo: fv.modelo || "", marca: fv.marca || "", tipo: fv.tipo ? String(fv.tipo).toLowerCase() : prev && prev.tipo || "", km: pos && pos.odometro ? String(pos.odometro) : fv.km_ultimo ? String(fv.km_ultimo) : prev && prev.km || "" }));
      }
    }, className: "mt-1 w-full px-3 py-2 rounded-lg text-sm", style: { background: "var(--bg-alt)", border: "1px solid var(--border)", color: "var(--text)" } }), /* @__PURE__ */ React.createElement("div", { className: "mt-1 rounded-lg border overflow-y-auto", style: { borderColor: "var(--border)", background: "var(--bg-alt)", maxHeight: 120 } }, frotaPlacas.map((f) => String(f.placa)).filter((pl) => pl.includes((placaNova || "").trim().toUpperCase())).slice(0, (placaNova || "").trim().length >= 2 ? 8 : 0).map((pl) => /* @__PURE__ */ React.createElement("div", { key: pl, onClick: () => {
      const fv = frotaPlacas.find((f) => String(f.placa) === pl);
      const pos = (posicoesSascar || {})[pl] || {};
      setPlacaNova(pl);
      setAutofill({ filial: fv ? fv.filial : "", modelo: fv ? fv.modelo : "", marca: fv ? fv.marca : "", tipo: fv && fv.tipo ? String(fv.tipo).toLowerCase() : "", km: pos.odometro ? String(pos.odometro) : fv && fv.km_ultimo ? String(fv.km_ultimo) : "" });
    }, className: "px-3 py-2 text-[11px] cursor-pointer flex justify-between", style: { color: "var(--text)", borderBottom: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("span", { className: "font-mono font-bold" }, pl), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text-muted)" } }, (() => {
      const fv = frotaPlacas.find((f) => String(f.placa) === pl);
      const pos = (posicoesSascar || {})[pl] || {};
      const km = pos.odometro || fv && fv.km_ultimo;
      return km ? Number(km).toLocaleString("pt-BR") + " km" : "sem km";
    })())))), /* @__PURE__ */ React.createElement("div", { className: "text-[9px] mt-1", style: { color: "var(--text-soft)" } }, "Lista das placas da frota")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-[9px] font-bold uppercase tracking-wider", style: { color: "var(--text-muted)" } }, "KM atual ", /* @__PURE__ */ React.createElement("span", { style: { background: "rgba(245,179,1,.18)", color: "#B8860B", padding: "1px 6px", borderRadius: 99, fontSize: 7, marginLeft: 4 } }, "TRAVADO")), /* @__PURE__ */ React.createElement("input", { key: "km" + placaNova, name: "km", readOnly: true, value: autofill?.km || "", className: "mt-1 w-full px-3 py-2 rounded-lg text-sm font-mono", style: { background: "var(--bg-alt)", border: "1px solid var(--border)", color: "var(--text)" } }), /* @__PURE__ */ React.createElement("div", { className: "text-[9px] mt-1", style: { color: "var(--text-soft)" } }, "Od\xF4metro da \xFAltima posi\xE7\xE3o"))), /* @__PURE__ */ React.createElement(DefeitoPicker, null), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-[9px] font-bold uppercase tracking-wider", style: { color: "var(--text-muted)" } }, "Valor or\xE7ado (R$) ", /* @__PURE__ */ React.createElement("span", { style: { background: "rgba(30,136,229,.15)", color: "#1E88E5", padding: "1px 6px", borderRadius: 99, fontSize: 7, marginLeft: 4 } }, "OPCIONAL")), /* @__PURE__ */ React.createElement("input", { name: "valor_orcado", type: "number", step: "0.01", min: "0", placeholder: "0,00", className: "mt-1 w-full px-3 py-2 rounded-lg text-sm", style: { background: "var(--bg-alt)", border: "1px solid var(--border)", color: "var(--text)" } })), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-[9px] font-bold uppercase tracking-wider", style: { color: "var(--text-muted)" } }, "Modelo ", /* @__PURE__ */ React.createElement("span", { style: { background: "rgba(120,120,120,.15)", color: "var(--text-muted)", padding: "1px 6px", borderRadius: 99, fontSize: 7, marginLeft: 4 } }, "AUTOM\xC1TICO")), /* @__PURE__ */ React.createElement("input", { key: "mod" + placaNova, name: "modelo", defaultValue: autofill?.modelo || "", className: "mt-1 w-full px-3 py-2 rounded-lg text-sm", style: { background: "var(--bg-alt)", border: "1px dashed var(--border-bright)", color: "var(--text)" } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-[9px] font-bold uppercase tracking-wider", style: { color: "var(--text-muted)" } }, "Tipo de ve\xEDculo"), /* @__PURE__ */ React.createElement("select", { key: "tv" + placaNova + (autofill?.tipo || ""), name: "tipo_veiculo", defaultValue: autofill?.tipo || "", className: "mt-1 w-full px-3 py-2 rounded-lg text-sm", style: { background: "var(--bg-alt)", border: "1px solid var(--border)", color: "var(--text)" } }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Autom\xE1tico (pelo modelo)"), TIPOS_VEICULO.map((t) => /* @__PURE__ */ React.createElement("option", { key: t.v, value: t.v }, t.l)))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-[9px] font-bold uppercase tracking-wider", style: { color: "var(--text-muted)" } }, "Marca ", /* @__PURE__ */ React.createElement("span", { style: { background: "rgba(120,120,120,.15)", color: "var(--text-muted)", padding: "1px 6px", borderRadius: 99, fontSize: 7, marginLeft: 4 } }, "AUTOM\xC1TICO")), /* @__PURE__ */ React.createElement("input", { key: "mar" + placaNova, name: "marca", defaultValue: autofill?.marca || "", className: "mt-1 w-full px-3 py-2 rounded-lg text-sm", style: { background: "var(--bg-alt)", border: "1px dashed var(--border-bright)", color: "var(--text)" } }))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-[9px] font-bold uppercase tracking-wider", style: { color: "var(--text-muted)" } }, "Filial ", /* @__PURE__ */ React.createElement("span", { style: { background: "rgba(120,120,120,.15)", color: "var(--text-muted)", padding: "1px 6px", borderRadius: 99, fontSize: 7, marginLeft: 4 } }, "AUTOM\xC1TICO")), /* @__PURE__ */ React.createElement("input", { key: "fil" + placaNova, name: "operacao", defaultValue: autofill?.filial || "", className: "mt-1 w-full px-3 py-2 rounded-lg text-sm", style: { background: "var(--bg-alt)", border: "1px dashed var(--border-bright)", color: "var(--text)" } }), /* @__PURE__ */ React.createElement("div", { className: "text-[9px] mt-1", style: { color: "var(--text-soft)" } }, "Vem do cadastro da placa")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-[9px] font-bold uppercase tracking-wider", style: { color: "var(--text-muted)" } }, "Motorista"), /* @__PURE__ */ React.createElement("input", { name: "motorista", className: "mt-1 w-full px-3 py-2 rounded-lg text-sm", style: { background: "var(--bg-alt)", border: "1px solid var(--border)", color: "var(--text)" } }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-[9px] font-bold uppercase tracking-wider", style: { color: "var(--text-muted)" } }, "Telefone"), /* @__PURE__ */ React.createElement("input", { name: "telefone", className: "mt-1 w-full px-3 py-2 rounded-lg text-sm", style: { background: "var(--bg-alt)", border: "1px solid var(--border)", color: "var(--text)" } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-[9px] font-bold uppercase tracking-wider", style: { color: "var(--text-muted)" } }, "Descri\xE7\xE3o do problema"), /* @__PURE__ */ React.createElement("input", { name: "descricao", className: "mt-1 w-full px-3 py-2 rounded-lg text-sm", style: { background: "var(--bg-alt)", border: "1px solid var(--border)", color: "var(--text)" } })), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-[9px] font-bold uppercase tracking-wider", style: { color: "var(--text-muted)" } }, "Prestador"), /* @__PURE__ */ React.createElement("select", { name: "prestador_id", defaultValue: prestadorSugerido, className: "mt-1 w-full px-3 py-2 rounded-lg text-sm", style: { background: "var(--bg-alt)", border: "1px solid var(--border)", color: "var(--text)" } }, /* @__PURE__ */ React.createElement("option", { value: "" }, "Selecionar..."), prestadores.map((pr) => /* @__PURE__ */ React.createElement("option", { key: pr.id, value: pr.id }, pr.nome)))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "text-[9px] font-bold uppercase tracking-wider", style: { color: "var(--text-muted)" } }, "Valor estimado"), /* @__PURE__ */ React.createElement("input", { name: "valor", type: "number", step: "0.01", className: "mt-1 w-full px-3 py-2 rounded-lg text-sm", style: { background: "var(--bg-alt)", border: "1px solid var(--border)", color: "var(--text)" } }))), /* @__PURE__ */ React.createElement("input", { type: "hidden", name: "tipo_servico", value: "mecanico" }), /* @__PURE__ */ React.createElement("input", { type: "hidden", name: "segmento", value: "privado" }), /* @__PURE__ */ React.createElement("input", { type: "hidden", name: "prioridade", value: "Normal" }), !carga && /* @__PURE__ */ React.createElement("div", { className: "text-[10px] text-center font-bold", style: { color: "#C62828" } }, "Informe se o ve\xEDculo est\xE1 CARREGADO ou VAZIO"), /* @__PURE__ */ React.createElement("div", { className: "flex justify-end gap-2 pt-2" }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => {
      setShowO(false);
      setMoreDet(false);
    }, className: "px-6 py-2 rounded-lg text-xs font-bold cursor-pointer", style: { background: "var(--bg-alt)", border: "1px solid var(--border)", color: "var(--text)" } }, "Cancelar"), /* @__PURE__ */ React.createElement("button", { disabled: savingO || !carga, className: "px-6 py-2 rounded-lg text-xs font-bold cursor-pointer", style: { background: savingO || !carga ? "var(--bg-alt)" : "var(--accent-green)", color: savingO || !carga ? "var(--text-muted)" : "#fff" } }, savingO ? "Criando..." : "Criar O.S."))))), /* @__PURE__ */ React.createElement(Modal, { open: !!editO, close: () => {
      setEditO(null);
      setEditCarga("");
      setMaisDetEdit(false);
    }, title: `\u2713 Editar O.S. ${editO?.os || ""}`, wide: true }, /* @__PURE__ */ React.createElement("form", { onSubmit: saveEditO, className: "space-y-3" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2 p-2 rounded-lg", style: { background: "var(--bg-alt)", border: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("div", { onClick: () => setEditCarga("carregado"), className: "flex flex-col items-center justify-center py-2 rounded cursor-pointer", style: { border: "1.5px solid", borderColor: (editCarga || editO?.carga) === "carregado" ? "#ef4444" : "var(--border)", background: (editCarga || editO?.carga) === "carregado" ? "rgba(239,68,68,0.15)" : "transparent" } }, /* @__PURE__ */ React.createElement("span", { className: "text-sm font-bold", style: { color: (editCarga || editO?.carga) === "carregado" ? "#ef4444" : "var(--text-muted)" } }, "CARREGADO"), (editCarga || editO?.carga) === "carregado" && /* @__PURE__ */ React.createElement("span", { className: "text-[9px]", style: { color: "#ef4444" } }, "\u26A0 carga")), /* @__PURE__ */ React.createElement("div", { onClick: () => setEditCarga("vazio"), className: "flex items-center justify-center py-2 rounded cursor-pointer", style: { border: "1.5px solid", borderColor: (editCarga || editO?.carga) === "vazio" ? "#16a34a" : "var(--border)", background: (editCarga || editO?.carga) === "vazio" ? "rgba(34,197,94,0.15)" : "transparent" } }, /* @__PURE__ */ React.createElement("span", { className: "text-sm font-bold", style: { color: (editCarga || editO?.carga) === "vazio" ? "#16a34a" : "var(--text-muted)" } }, "VAZIO"))), (editCarga || editO?.carga) && /* @__PURE__ */ React.createElement("input", { type: "hidden", name: "carga", value: editCarga || editO?.carga || "" }), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement(Sel, { n: "forma_pagamento", l: "Pagamento", o: [{ v: "a_vista", l: "\xC0 Vista" }, { v: "faturado", l: "Faturado" }], v: editO?.forma_pagamento || "" }), /* @__PURE__ */ React.createElement(Inp, { n: "placa", l: "Placa", r: true, v: editO?.placa })), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement(Sel, { n: "tipo_servico", l: "Tipo", o: [{ v: "mecanico", l: "Mec\xE2nico" }, { v: "eletrico", l: "El\xE9trico" }, { v: "eletronica", l: "Eletr\xF4nica" }, { v: "eletrica_mecanica", l: "El\xE9trica/Mec\xE2nica" }, { v: "borracharia", l: "Borracharia" }, { v: "guincho", l: "Guincho" }, { v: "funilaria", l: "Funilaria" }, { v: "bau", l: "Ba\xFA" }], v: editO?.tipo_servico }), /* @__PURE__ */ React.createElement(Sel, { n: "segmento", l: "Segmento", o: [{ v: "privado", l: "Privado" }, { v: "correios", l: "Correios" }], v: editO?.segmento || "privado" })), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement(Sel, { n: "prioridade", l: "Prioridade", o: [{ v: "Normal", l: "Normal" }, { v: "Alta", l: "Alta" }, { v: "Urgente", l: "Urgente" }], v: editO?.prioridade || "Normal" }), /* @__PURE__ */ React.createElement(Sel, { n: "operacao", l: "Filial", o: FILIAIS.map((f) => ({ v: f, l: f })), v: editO?.operacao })), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setMaisDetEdit((v) => !v), className: "text-sm cursor-pointer w-full text-center py-1", style: { color: "var(--accent-green)" } }, maisDetEdit ? "\u25B2 Menos campos" : "\u25BC Mais campos"), maisDetEdit && /* @__PURE__ */ React.createElement("div", { className: "space-y-2 pt-2", style: { borderTop: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement(Inp, { n: "os", l: "N\xBA da O.S.", r: true, v: editO?.os }), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement(Inp, { n: "motorista", l: "Motorista", v: editO?.motorista }), /* @__PURE__ */ React.createElement(Inp, { n: "telefone", l: "Telefone", v: editO?.telefone })), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement(Inp, { n: "modelo", l: "Modelo", v: editO?.modelo }), /* @__PURE__ */ React.createElement(Sel, { n: "marca", l: "Marca", o: MARCAS.map((m) => ({ v: m, l: m })), v: editO?.marca })), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement(Inp, { n: "rodovia", l: "Rodovia", v: editO?.rodovia }), /* @__PURE__ */ React.createElement(Inp, { n: "km", l: "KM", v: editO?.km })), /* @__PURE__ */ React.createElement(Sel, { n: "tipo_veiculo", l: "Tipo de ve\xEDculo", o: TIPOS_VEICULO, v: editO?.tipo_veiculo }), /* @__PURE__ */ React.createElement(Sel, { n: "prestador_id", l: "Prestador", o: prestadores.map((p) => ({ v: p.id, l: p.nome })), v: editO?.prestador_id }), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-3" }, /* @__PURE__ */ React.createElement(Inp, { n: "valor_orcado", l: "Valor or\xE7ado (R$)", t: "number", v: editO?.valor_orcado != null ? String(editO.valor_orcado) : "" }), /* @__PURE__ */ React.createElement(Inp, { n: "valor", l: "Valor (R$)", t: "number", v: editO?.valor != null ? String(editO.valor) : "" }), /* @__PURE__ */ React.createElement(Inp, { n: "data", l: "Data", t: "date", v: editO?.data })), /* @__PURE__ */ React.createElement(Inp, { n: "operador", l: "Operador", v: editO?.operador }), /* @__PURE__ */ React.createElement(Inp, { n: "observacoes", l: "Observa\xE7\xF5es", v: editO?.observacoes })), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-2 pt-2" }, /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => {
      setEditO(null);
      setEditCarga("");
      setMaisDetEdit(false);
    }, className: "py-2 rounded-lg font-bold cursor-pointer", style: { background: "var(--bg-alt)", color: "var(--text)", border: "1px solid var(--border)" } }, "Cancelar"), /* @__PURE__ */ React.createElement("button", { className: "py-2 rounded-lg font-bold cursor-pointer", style: { background: "var(--accent-green)", color: "#fff" } }, "Salvar Altera\xE7\xF5es")))), /* @__PURE__ */ React.createElement(Modal, { open: !!closeO, close: () => setCloseO(null), title: `Fechar Socorro \u2014 ${closeO?.os || ""}` }, /* @__PURE__ */ React.createElement("form", { onSubmit: closeSocorro, className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-lg bg-surface-hover/50 p-3 text-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between py-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-text-muted" }, "Placa"), /* @__PURE__ */ React.createElement("span", { className: "font-semibold" }, closeO?.placa || "\u2014")), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between py-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-text-muted" }, "Ao finalizar, o sistema calcula:")), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between py-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-text-muted" }, "Tempo abertura \u2192 fechamento"), /* @__PURE__ */ React.createElement("span", { className: "font-mono text-print-green" }, closeO?.abertura ? /* @__PURE__ */ React.createElement(TempoEmAberto, { abertura: closeO.abertura }) : "\u2014"))), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium text-text-muted block" }, "Resultado"), /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-surface-hover" }, /* @__PURE__ */ React.createElement("input", { type: "radio", name: "resultado", value: "Liberado", defaultChecked: true, className: "accent-print-green" }), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-medium" }, "Ve\xEDculo Liberado")), /* @__PURE__ */ React.createElement("label", { className: "flex items-center gap-3 p-3 rounded-lg border border-border cursor-pointer hover:bg-surface-hover" }, /* @__PURE__ */ React.createElement("input", { type: "radio", name: "resultado", value: "Rebocado", className: "accent-orange-500" }), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-medium" }, "Ve\xEDculo Rebocado"))), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium text-text-muted block" }, "Execu\xE7\xE3o"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, ["Conferiu", "Trocou", "Regulou", "Apertou", "Sem falha"].map((x, ix) => /* @__PURE__ */ React.createElement("label", { key: x, className: "flex items-center gap-2 px-3 py-2 rounded-lg border border-border cursor-pointer hover:bg-surface-hover text-sm" }, /* @__PURE__ */ React.createElement("input", { type: "radio", name: "execucao", value: x, required: true, defaultChecked: closeO?.execucao === x, className: "accent-print-green" }), x)))), /* @__PURE__ */ React.createElement(Ta, { n: "servico_realizado", l: "Servi\xE7o Realizado", v: closeO?.servico_realizado }), /* @__PURE__ */ React.createElement(Sel, { n: "prestador_id", l: "Prestador", o: prestadores.map((p) => ({ v: p.id, l: p.nome })), v: closeO?.prestador_id }), /* @__PURE__ */ React.createElement(Inp, { n: "valor_orcado", l: "Valor or\xE7ado (R$)", t: "number", v: closeO?.valor_orcado != null ? String(closeO.valor_orcado) : "" }), /* @__PURE__ */ React.createElement(Inp, { n: "valor", l: "Valor Final (R$)", t: "number", v: closeO?.valor != null ? String(closeO.valor) : "" }), /* @__PURE__ */ React.createElement(Ta, { n: "observacoes", l: "Observa\xE7\xE3o", v: closeO?.observacoes }), /* @__PURE__ */ React.createElement("button", { className: "w-full py-2 bg-print-green text-white font-bold rounded-lg hover:bg-print-green-dark transition-colors" }, "Finalizar Socorro"))), /* @__PURE__ */ React.createElement(Modal, { open: !!viewO, close: () => setViewO(null), title: `SOS ${viewO?.os || ""}` }, /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-lg bg-surface-hover/50 p-3 text-sm" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between py-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-text-muted" }, "Placa"), /* @__PURE__ */ React.createElement("span", { className: "font-semibold" }, viewO?.placa || "\u2014")), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between py-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-text-muted" }, "Motorista"), /* @__PURE__ */ React.createElement("span", { className: "font-semibold" }, viewO?.motorista || "\u2014")), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between py-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-text-muted" }, "Telefone"), /* @__PURE__ */ React.createElement("span", { className: "font-semibold" }, viewO?.telefone || "\u2014")), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between py-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-text-muted" }, "Localiza\xE7\xE3o"), /* @__PURE__ */ React.createElement("span", { className: "font-semibold" }, viewO?.localizacao || "\u2014")), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between py-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-text-muted" }, "Rodovia / KM"), /* @__PURE__ */ React.createElement("span", { className: "font-semibold" }, viewO?.rodovia || "\u2014", " ", viewO?.km ? "\xB7 Km " + viewO.km : "")), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between py-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-text-muted" }, "Prioridade"), /* @__PURE__ */ React.createElement("span", { className: "font-semibold" }, viewO?.prioridade || "Normal")), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between py-1" }, /* @__PURE__ */ React.createElement("span", { className: "text-text-muted" }, "Prestador"), /* @__PURE__ */ React.createElement("span", { className: "font-semibold" }, viewO?.prestador_nome || "\u2014"))), /* @__PURE__ */ React.createElement("div", { className: "text-center py-3" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs text-text-muted block mb-1" }, "Tempo em aberto"), /* @__PURE__ */ React.createElement("span", { className: "font-mono text-3xl font-bold text-print-green" }, viewO?.abertura ? /* @__PURE__ */ React.createElement(TempoEmAberto, { abertura: viewO.abertura }) : "\u2014")), viewO?.cancelado && /* @__PURE__ */ React.createElement("div", { className: "rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-300" }, /* @__PURE__ */ React.createElement("b", null, "CANCELADA"), " \u2014 ", viewO?.motivo_cancelamento || ""), /* @__PURE__ */ React.createElement("div", { className: "rounded-lg border border-border p-3" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs text-text-muted block mb-2" }, "Hist\xF3rico"), viewO?.historico && viewO.historico.length > 0 ? /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, viewO.historico.map((h, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "flex items-start gap-2 text-sm" }, /* @__PURE__ */ React.createElement("span", { className: "font-mono text-xs text-text-muted shrink-0" }, new Date(h.hora).toLocaleTimeString("pt-BR")), /* @__PURE__ */ React.createElement("span", { className: "flex-1" }, h.etapa.replace(/_/g, " "))))) : /* @__PURE__ */ React.createElement("span", { className: "text-sm text-text-muted" }, "Sem hist\xF3rico")))), /* @__PURE__ */ React.createElement(Modal, { open: !!cancelO, close: () => setCancelO(null), title: `Solicitar cancelamento \u2014 O.S. ${cancelO?.os || ""}` }, /* @__PURE__ */ React.createElement("form", { onSubmit: cancelarOrdem, className: "space-y-4" }, /* @__PURE__ */ React.createElement(Ta, { n: "motivo", l: "Motivo do cancelamento" }), /* @__PURE__ */ React.createElement("button", { className: "w-full py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition-colors" }, "Solicitar Cancelamento"), /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-center", style: { color: "var(--text-muted)" } }, "O pedido vai para Cancelamentos e s\xF3 vale depois da aprova\xE7\xE3o de um administrador."))));
  }
  function SegPanel({ titulo, cor, icone, s }) {
    const total = s?.total ?? 0;
    const dentro = s?.dentro_prazo ?? 0;
    const atraso = s?.atrasadas ?? 0;
    const aberto = s?.em_aberto ?? 0;
    const fech = s?.fechadas ?? 0;
    const circ = 2 * Math.PI * 15.9;
    const d = fech > 0 ? dentro / fech * circ : 0;
    const a = fech > 0 ? atraso / fech * circ : 0;
    const ab = fech > 0 ? aberto / fech * circ : 0;
    return /* @__PURE__ */ React.createElement("div", { className: "rounded-xl border border-border bg-surface-alt p-4 flex flex-col gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "w-7 h-7 rounded-lg grid place-items-center font-heading font-bold text-sm", style: { background: `${cor}22`, color: cor } }, icone), /* @__PURE__ */ React.createElement("h3", { className: "font-heading text-base font-semibold tracking-wide uppercase", style: { color: cor } }, titulo)), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-text-muted" }, total, " O.S.")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 36 36", className: "w-20 h-20 shrink-0 -rotate-90" }, /* @__PURE__ */ React.createElement("circle", { cx: "18", cy: "18", r: "15.9", fill: "none", stroke: "var(--border)", strokeWidth: "4" }), /* @__PURE__ */ React.createElement("circle", { cx: "18", cy: "18", r: "15.9", fill: "none", stroke: cor, strokeWidth: "4", strokeDasharray: `${d.toFixed(1)} ${(circ - d).toFixed(1)}`, strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("circle", { cx: "18", cy: "18", r: "15.9", fill: "none", stroke: "#fb7b1f", strokeWidth: "4", strokeDasharray: `${a.toFixed(1)} ${(circ - a).toFixed(1)}`, strokeDashoffset: -d, strokeLinecap: "round" }), /* @__PURE__ */ React.createElement("circle", { cx: "18", cy: "18", r: "15.9", fill: "none", stroke: "#64748b", strokeWidth: "4", strokeDasharray: `${ab.toFixed(1)} ${(circ - ab).toFixed(1)}`, strokeDashoffset: -(d + a), strokeLinecap: "round" })), /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex flex-col gap-2 text-xs" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "w-2.5 h-2.5 rounded-sm", style: { background: cor } }), "Dentro do prazo", /* @__PURE__ */ React.createElement("span", { className: "ml-auto font-mono text-text-muted" }, dentro)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "w-2.5 h-2.5 rounded-sm bg-orange-500" }), "Atrasado", /* @__PURE__ */ React.createElement("span", { className: "ml-auto font-mono text-text-muted" }, atraso)), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "w-2.5 h-2.5 rounded-sm bg-slate-500" }), "Em aberto", /* @__PURE__ */ React.createElement("span", { className: "ml-auto font-mono text-text-muted" }, aberto)), /* @__PURE__ */ React.createElement("div", { className: "mt-1 text-center font-mono text-lg font-bold", style: { color: cor } }, s?.rpm ?? 0, "%"))), /* @__PURE__ */ React.createElement("div", { className: "border-t border-border pt-2" }, /* @__PURE__ */ React.createElement("p", { className: "text-[10px] uppercase tracking-wider text-text-muted mb-2" }, "Mais acionadas"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-1" }, (s?.mais_acionadas || []).slice(0, 3).map((p, i) => /* @__PURE__ */ React.createElement("div", { key: p.nome, className: "flex items-center gap-2 text-xs" }, /* @__PURE__ */ React.createElement("span", { className: "w-4 h-4 rounded text-[10px] grid place-items-center font-bold", style: { background: `${cor}22`, color: cor } }, i + 1), /* @__PURE__ */ React.createElement("span", { className: "flex-1 truncate text-text" }, p.nome), /* @__PURE__ */ React.createElement("span", { className: "font-mono text-text-muted" }, p.count))), !(s?.mais_acionadas || []).length && /* @__PURE__ */ React.createElement("span", { className: "text-xs text-text-muted" }, "Sem dados"))), /* @__PURE__ */ React.createElement("div", { className: "border-t border-border pt-2" }, /* @__PURE__ */ React.createElement("p", { className: "text-[10px] uppercase tracking-wider text-text-muted mb-1" }, "Maior custo"), /* @__PURE__ */ React.createElement("p", { className: "font-heading text-xl font-bold", style: { color: cor } }, BRL(s?.maior_custo?.valor)), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-text-muted truncate" }, s?.maior_custo?.nome || "\u2014")));
  }
  function StatCard({ l, v, I, c }) {
    const s = STAT_STYLE[c] || STAT_STYLE["print-green"];
    return /* @__PURE__ */ React.createElement("div", { className: "rounded-xl border border-border bg-surface-alt p-4 flex items-center gap-3 hover:shadow-md transition-shadow" }, /* @__PURE__ */ React.createElement("div", { className: `w-10 h-10 rounded-lg flex items-center justify-center ${s.bg}` }, /* @__PURE__ */ React.createElement(I, { className: `w-5 h-5 ${s.fg}` })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-text-muted uppercase tracking-wide" }, l), /* @__PURE__ */ React.createElement("p", { className: "text-2xl font-bold font-heading text-text" }, v)));
  }
  function Legenda({ itens, resumo }) {
    return /* @__PURE__ */ React.createElement("div", { className: "legenda mb-2" }, itens.map((i) => /* @__PURE__ */ React.createElement("span", { key: i.rotulo, className: "legenda-item" }, /* @__PURE__ */ React.createElement("span", { className: "legenda-cor", style: { background: i.cor } }), i.rotulo)), /* @__PURE__ */ React.createElement("span", { className: "legenda-resumo" }, resumo));
  }
  function Card({ title, sub, children }) {
    return /* @__PURE__ */ React.createElement("div", { className: "cartao min-w-0 border border-border bg-surface-alt transition-shadow hover:shadow-md" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-4" }, /* @__PURE__ */ React.createElement("h3", { className: "font-heading text-lg font-semibold text-text" }, title), sub && /* @__PURE__ */ React.createElement("span", { className: "text-xs bg-print-green/10 text-print-green px-2 py-1 rounded-full" }, sub)), children);
  }
  function Modal({ open, close, title, children, wide }) {
    if (!open) return null;
    return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 flex overflow-y-auto p-4 bg-black/50", onClick: close, role: "dialog", "aria-modal": "true", "aria-label": title }, /* @__PURE__ */ React.createElement("div", { className: `janela m-auto bg-surface rounded-xl border border-border w-full min-w-0 shadow-2xl ${wide ? "max-w-3xl" : "max-w-md"}`, onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between gap-3 mb-4" }, /* @__PURE__ */ React.createElement("h2", { className: "font-heading text-lg font-semibold text-text" }, title), /* @__PURE__ */ React.createElement("button", { onClick: close, className: "p-1 rounded hover:bg-surface-hover text-text-muted flex items-center justify-center shrink-0", "aria-label": "Fechar", title: "Fechar" }, /* @__PURE__ */ React.createElement(import_lucide_react.X, { className: "w-5 h-5" }))), children));
  }
  function Inp({ n, l, r, t, m, v }) {
    return /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium text-text-muted" }, l), /* @__PURE__ */ React.createElement("input", { name: n, type: t || "text", required: r, maxLength: m, defaultValue: v, className: "mt-1 w-full px-3 py-2 rounded-lg border border-border bg-surface-alt text-text text-sm focus:outline-none focus:ring-2 focus:ring-print-green/30" }));
  }
  function Sel({ n, l, o, v }) {
    return /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium text-text-muted" }, l), /* @__PURE__ */ React.createElement("select", { name: n, defaultValue: v, className: "mt-1 w-full px-3 py-2 rounded-lg border border-border bg-surface-alt text-text text-sm focus:outline-none focus:ring-2 focus:ring-print-green/30" }, o.map((x) => /* @__PURE__ */ React.createElement("option", { key: x.v, value: x.v }, x.l))));
  }
  function Ta({ n, l, v }) {
    return /* @__PURE__ */ React.createElement("label", { className: "block" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium text-text-muted" }, l), /* @__PURE__ */ React.createElement("textarea", { name: n, defaultValue: v, rows: 3, className: "mt-1 w-full px-3 py-2 rounded-lg border border-border bg-surface-alt text-text text-sm focus:outline-none focus:ring-2 focus:ring-print-green/30" }));
  }
  function TempoEmAberto({ abertura }) {
    const [agora, setAgora] = (0, import_react10.useState)(Date.now());
    (0, import_react10.useEffect)(() => {
      const t = setInterval(() => setAgora(Date.now()), 1e3);
      return () => clearInterval(t);
    }, []);
    const ab = new Date(abertura).getTime();
    const s = Math.max(0, Math.floor((agora - ab) / 1e3));
    if (s < 3600) return /* @__PURE__ */ React.createElement("span", null, Math.floor(s / 60), " min");
    const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60);
    if (d > 0) return /* @__PURE__ */ React.createElement("span", null, d, "d ", h, "h");
    return /* @__PURE__ */ React.createElement("span", null, h, "h ", String(m).padStart(2, "0"), "min");
  }
  function titleCase(s) {
    return String(s || "").toLowerCase().replace(/(^|\s|\/|\-)([a-zA-Zà-üÀ-Ü])/g, (m, a, b) => a + b.toUpperCase());
  }
  function TabAtendimento({ ordens, loadData, updO, canWrite, onReport, onEdit }) {
    const [now2, setNow] = (0, import_react10.useState)(Date.now());
    const [sel, setSel] = (0, import_react10.useState)(null);
    const [checkedFlags, setCheckedFlags] = (0, import_react10.useState)({});
    const [filtroFilial, setFiltroFilial] = (0, import_react10.useState)("todas");
    const [filtroStatus, setFiltroStatus] = (0, import_react10.useState)("todos");
    const [filtroCarga, setFiltroCarga] = (0, import_react10.useState)("todos");
    (0, import_react10.useEffect)(() => {
      const t = setInterval(() => setNow(Date.now()), 1e3);
      return () => clearInterval(t);
    }, []);
    function elapsed(ab) {
      const s = Math.max(0, Math.floor((now2 - new Date(ab).getTime()) / 1e3));
      if (s < 3600) return `${Math.floor(s / 60)} min`;
      const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60);
      if (d > 0) return `${d}d ${h}h`;
      return `${h}h ${String(m).padStart(2, "0")}min`;
    }
    function mins(ab) {
      return Math.floor((now2 - new Date(ab).getTime()) / 6e4);
    }
    function clrByTime(ab) {
      if (!ab) return "var(--accent-green)";
      const m = mins(ab);
      if (m >= 120) return "var(--accent-red)";
      if (m >= 60) return "var(--accent-yellow)";
      return "var(--accent-green)";
    }
    function bge(o) {
      const m = mins(o.atualizado_em || o.ultima_atualizacao || o.abertura || "");
      if (m >= 120) return { label: "ATENDIMENTO CR\xCDTICO", clr: "#ef4444", bg: "rgba(239,68,68,0.18)" };
      const s = o.status || "";
      if (s === "Servi\xE7o em execu\xE7\xE3o" || s === "Prestador a caminho") return { label: "EM ANDAMENTO", clr: "#22c55e", bg: "rgba(34,197,94,0.15)" };
      if (s === "Prestador no local") return { label: "NO LOCAL", clr: "#38bdf8", bg: "rgba(56,189,248,0.15)" };
      if (s === "Prestador localizado") return { label: "EM ATENDIMENTO", clr: "#60a5fa", bg: "rgba(96,165,250,0.15)" };
      return { label: "AGUARDANDO", clr: "#94a3b8", bg: "rgba(148,163,184,0.15)" };
    }
    function TruckSvg({ tipo, clr }) {
      const g = (tipo || "").toLowerCase().includes("guincho");
      return /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 100 54", width: "88", height: "48", fill: "none" }, g ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "2", y: "16", width: "60", height: "28", rx: "4", fill: clr, opacity: "0.12", stroke: clr, strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("rect", { x: "62", y: "24", width: "32", height: "20", rx: "3", fill: clr, opacity: "0.18", stroke: clr, strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("rect", { x: "2", y: "16", width: "18", height: "28", rx: "3", fill: clr, opacity: "0.22" }), /* @__PURE__ */ React.createElement("circle", { cx: "20", cy: "46", r: "6", fill: clr, opacity: "0.9" }), /* @__PURE__ */ React.createElement("circle", { cx: "20", cy: "46", r: "3", fill: "#0f1811" }), /* @__PURE__ */ React.createElement("circle", { cx: "76", cy: "46", r: "6", fill: clr, opacity: "0.9" }), /* @__PURE__ */ React.createElement("circle", { cx: "76", cy: "46", r: "3", fill: "#0f1811" }), /* @__PURE__ */ React.createElement("line", { x1: "62", y1: "18", x2: "62", y2: "28", stroke: clr, strokeWidth: "2.5" }), /* @__PURE__ */ React.createElement("path", { d: "M25 26 L36 14 L62 14", stroke: clr, strokeWidth: "2", fill: "none", strokeLinecap: "round" })) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("rect", { x: "2", y: "14", width: "68", height: "30", rx: "4", fill: clr, opacity: "0.12", stroke: clr, strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("rect", { x: "70", y: "22", width: "26", height: "22", rx: "3", fill: clr, opacity: "0.2", stroke: clr, strokeWidth: "1.5" }), /* @__PURE__ */ React.createElement("rect", { x: "2", y: "14", width: "22", height: "30", rx: "3", fill: clr, opacity: "0.22" }), /* @__PURE__ */ React.createElement("circle", { cx: "22", cy: "46", r: "6", fill: clr, opacity: "0.9" }), /* @__PURE__ */ React.createElement("circle", { cx: "22", cy: "46", r: "3", fill: "#0f1811" }), /* @__PURE__ */ React.createElement("circle", { cx: "66", cy: "46", r: "6", fill: clr, opacity: "0.9" }), /* @__PURE__ */ React.createElement("circle", { cx: "66", cy: "46", r: "3", fill: "#0f1811" }), /* @__PURE__ */ React.createElement("line", { x1: "12", y1: "28", x2: "55", y2: "28", stroke: clr, strokeWidth: "1", opacity: "0.4" })));
    }
    const ativas = ordens.filter((o) => STATUS_ABERTOS2.has(o.status || ""));
    const filiais = [...new Set(ativas.map((o) => o.operacao).filter((x) => !!x))].sort();
    const filtradas = ativas.filter((o) => {
      const okF = filtroFilial === "todas" || o.operacao === filtroFilial;
      const m = mins(o.atualizado_em || o.ultima_atualizacao || o.abertura || "");
      const okS = filtroStatus === "todos" || filtroStatus === "critico" && m >= 120 || filtroStatus === "atencao" && m >= 60 && m < 120 || filtroStatus === "normal" && m < 60;
      const okC = filtroCarga === "todos" || o.carga === filtroCarga;
      return okF && okS && okC;
    });
    const conclHoje = ordens.filter((o) => {
      if (!o.fechamento) return false;
      const d = new Date(o.fechamento), t = /* @__PURE__ */ new Date();
      return d.toDateString() === t.toDateString();
    }).length;
    const atencoes = ativas.filter((o) => o.abertura && mins(o.abertura) >= 60 && mins(o.abertura) < 120).length;
    const criticos = ativas.filter((o) => o.abertura && mins(o.abertura) >= 120).length;
    const guinchoRota = ativas.filter((o) => (o.tipo_servico || "").toLowerCase().includes("guincho")).length;
    const slaArr = ativas.filter((o) => o.abertura).map((o) => mins(o.abertura));
    const slaMed = slaArr.length > 0 ? Math.floor(slaArr.reduce((a, b) => a + b, 0) / slaArr.length) : 0;
    const KPIS = [{ l: "OS ABERTAS", v: `${ativas.length}`, sub: "Em andamento", clr: "#22c55e", icon: /* @__PURE__ */ React.createElement(import_lucide_react.Activity, { size: 20 }) }, { l: "CONCLU\xCDDAS HOJE", v: `${conclHoje}`, sub: "Finalizadas", clr: "#4ade80", icon: /* @__PURE__ */ React.createElement(import_lucide_react.CheckCircle2, { size: 20 }) }, { l: "TEMPO M\xC9DIO", v: `${String(Math.floor(slaMed / 60)).padStart(2, "0")}:${String(slaMed % 60).padStart(2, "0")}`, sub: "hh:mm", clr: "#60a5fa", icon: /* @__PURE__ */ React.createElement(import_lucide_react.Clock, { size: 20 }) }, { l: "ATEN\xC7\xD5ES", v: `${atencoes}`, sub: "60-120 min", clr: "var(--accent-yellow)", icon: /* @__PURE__ */ React.createElement(import_lucide_react.AlertTriangle, { size: 20 }) }, { l: "ATEND. CR\xCDTICOS", v: `${criticos}`, sub: "Atraso cr\xEDtico", clr: "var(--accent-red)", icon: /* @__PURE__ */ React.createElement(import_lucide_react.AlertTriangle, { size: 20 }) }, { l: "GUINCHO", v: `${guinchoRota}`, sub: "Em deslocamento", clr: "#a78bfa", icon: /* @__PURE__ */ React.createElement(import_lucide_react.TrendingUp, { size: 20 }) }];
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-start justify-between gap-3 mb-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-base font-bold", style: { color: "var(--text)" } }, "PAINEL DE ACOMPANHAMENTO"), /* @__PURE__ */ React.createElement("div", { className: "text-sm font-bold", style: { color: "var(--accent-green)" } }, "SOCORRO MEC\xC2NICO")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2" }, /* @__PURE__ */ React.createElement("select", { value: filtroFilial, onChange: (e) => setFiltroFilial(e.target.value), className: "px-2 py-2 rounded-lg text-[11px] border cursor-pointer", style: { background: "var(--bg-card)", color: "var(--text)", borderColor: "var(--border-bright)" } }, /* @__PURE__ */ React.createElement("option", { value: "todas" }, "TODAS FILIAIS"), filiais.map((f) => /* @__PURE__ */ React.createElement("option", { key: f, value: f }, f))), /* @__PURE__ */ React.createElement("select", { value: filtroStatus, onChange: (e) => setFiltroStatus(e.target.value), className: "px-2 py-2 rounded-lg text-[11px] border cursor-pointer", style: { background: "var(--bg-card)", color: "var(--text)", borderColor: "var(--border-bright)" } }, /* @__PURE__ */ React.createElement("option", { value: "todos" }, "TODOS STATUS"), /* @__PURE__ */ React.createElement("option", { value: "critico" }, "CR\xCDTICOS"), /* @__PURE__ */ React.createElement("option", { value: "atencao" }, "ATEN\xC7\xD5ES"), /* @__PURE__ */ React.createElement("option", { value: "normal" }, "NORMAL")), /* @__PURE__ */ React.createElement("select", { value: filtroCarga, onChange: (e) => setFiltroCarga(e.target.value), className: "px-2 py-2 rounded-lg text-[11px] border cursor-pointer", style: { background: "var(--bg-card)", color: "var(--text)", borderColor: "var(--border-bright)" } }, /* @__PURE__ */ React.createElement("option", { value: "todos" }, "TODA CARGA"), /* @__PURE__ */ React.createElement("option", { value: "carregado" }, "CARREGADO"), /* @__PURE__ */ React.createElement("option", { value: "vazio" }, "VAZIO")), /* @__PURE__ */ React.createElement("button", { onClick: loadData, className: "flex items-center gap-1 px-3 py-2 rounded-lg text-[11px] cursor-pointer", style: { background: "var(--bg-card)", color: "var(--text-muted)", border: "1px solid var(--border-bright)" } }, /* @__PURE__ */ React.createElement(import_lucide_react.Activity, { size: 12 }), "Atualizar"))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 mb-6" }, KPIS.map((k, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "rounded-xl p-3 flex flex-col min-w-0", style: { background: "var(--bg-card)", border: `1.5px solid ${k.clr}44` } }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 mb-1" }, /* @__PURE__ */ React.createElement("span", { style: { color: k.clr } }, k.icon), /* @__PURE__ */ React.createElement("span", { className: "text-[9px] font-bold uppercase tracking-wide leading-tight", style: { color: "var(--text-muted)" } }, k.l)), /* @__PURE__ */ React.createElement("div", { className: "text-2xl font-bold font-mono leading-none", style: { color: k.clr } }, k.v), /* @__PURE__ */ React.createElement("div", { className: "text-[9px] mt-1", style: { color: "var(--text-muted)" } }, k.sub)))), filtradas.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "text-center py-16 text-sm", style: { color: "var(--text-muted)" } }, "Nenhum atendimento encontrado"), /* @__PURE__ */ React.createElement("div", { className: "grade-os mb-6" }, filtradas.map((o) => {
      const m = mins(o.atualizado_em || o.ultima_atualizacao || o.abertura || "");
      const clr = clrByTime(o.abertura);
      const b = bge(o);
      const et = ETAPAS2.find((e) => e.status === o.status);
      const isCrit = m >= 120;
      const isAten = m >= 60 && m < 120;
      const pulseClass = isCrit ? "sla-pulse-red" : isAten ? "sla-pulse-yellow" : "sla-pulse-green";
      return /* @__PURE__ */ React.createElement("div", { key: o.id }, /* @__PURE__ */ React.createElement("div", { onClick: () => setSel(sel === o.id ? null : o.id), className: `rounded-xl p-3 cursor-pointer oscard ${o.carga === "carregado" ? "carregado" : ""} ${isCrit ? "crit" : isAten ? "warn" : "ok"} ${pulseClass}`, style: { border: `1.5px solid ${b.clr}55` } }, cancPendente(o) && /* @__PURE__ */ React.createElement("div", { className: "mb-2 px-2 py-1 rounded-full text-[10px] font-bold text-center", style: ESTILO_CANC, title: TITULO_CANC(o) }, "Cancelamento pendente"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold", style: { color: "var(--text)" } }, "OS ", o.os || "\u2014"), /* @__PURE__ */ React.createElement("span", { className: `text-[9px] font-bold px-2 py-1 rounded-full ${isCrit ? "blink-urgent" : ""}`, style: { background: b.bg, color: b.clr } }, b.label)), o.status === "Aguardando Or\xE7amento" && /* @__PURE__ */ React.createElement("div", { className: "mb-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-[9px] font-bold px-2 py-1 rounded-full inline-flex items-center gap-1", style: { background: "rgba(251,191,36,0.18)", color: "#d97706" } }, "\u23F3 AGUARDANDO OR\xC7AMENTO")), /* @__PURE__ */ React.createElement("div", { className: "flex items-end justify-between gap-3 mb-2" }, (() => {
        const tp = String(o.tipo_veiculo || inferTipoVeiculo(o.modelo, o.marca, o.tipo_servico) || "").toLowerCase();
        const M = { cavalo: IMGS.cavalo, van: IMGS.van, truck: IMGS.truck, toco: IMGS.truck, carreta: IMGS.carreta };
        return /* @__PURE__ */ React.createElement("img", { className: "veic-img", src: M[tp] || M.cavalo, alt: tp });
      })(), /* @__PURE__ */ React.createElement("div", { className: "text-right min-w-0 flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "text-[9px] uppercase", style: { color: "var(--text-muted)" } }, "PLACA"), /* @__PURE__ */ React.createElement("div", { className: "text-sm font-bold", style: { color: "var(--text)", overflowWrap: "anywhere" } }, o.placa || "\u2014"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-end gap-1 mt-1" }, o.carga ? /* @__PURE__ */ React.createElement("span", { className: "text-[9px] font-bold px-2 py-1 rounded-full", style: { background: o.carga === "carregado" ? "rgba(239,68,68,0.15)" : "rgba(34,197,94,0.15)", color: o.carga === "carregado" ? "#ef4444" : "#16a34a" } }, o.carga === "carregado" ? "\u26A0 CARREGADO" : "VAZIO") : /* @__PURE__ */ React.createElement("span", { className: "text-[9px] px-2 py-1 rounded-full", style: { background: "var(--bg-alt)", color: "var(--text-muted)" } }, "carga?")), /* @__PURE__ */ React.createElement("div", { className: "text-[9px]", style: { color: "var(--text-muted)", overflowWrap: "anywhere" } }, [o.modelo, o.marca].filter(Boolean).join(" | ") || "\u2014"), /* @__PURE__ */ React.createElement("div", { className: "text-[9px] uppercase mt-1", style: { color: "var(--text-muted)" } }, "TEMPO DECORRIDO"), /* @__PURE__ */ React.createElement("div", { className: `text-xl font-bold font-mono whitespace-nowrap ${isCrit ? "blink-urgent" : ""}`, style: { color: clr } }, elapsed(o.atualizado_em || o.ultima_atualizacao || o.abertura || "")))), /* @__PURE__ */ React.createElement("div", { className: "text-[10px] space-y-1 mb-2" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between gap-3" }, /* @__PURE__ */ React.createElement("span", { className: "shrink-0", style: { color: "var(--text-muted)" } }, "TIPO"), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text)" }, className: "font-medium" }, TIPO_LABELS[o.tipo_servico || "" || "" || "" || "" || "" || "" || "" || "" || "" || "" || o.tipo_servico || "\u2014"] || "\u2014")), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between gap-3" }, /* @__PURE__ */ React.createElement("span", { className: "shrink-0", style: { color: "var(--text-muted)" } }, "FILIAL"), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text)" }, className: "font-medium truncate min-w-0 text-right" }, o.operacao || "\u2014")), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between gap-3" }, /* @__PURE__ */ React.createElement("span", { className: "shrink-0", style: { color: "var(--text-muted)" } }, "ABERTURA"), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text)" } }, o.abertura ? new Date(o.abertura).toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "\u2014"))), o.descricao && /* @__PURE__ */ React.createElement("div", { className: "text-[10px] italic truncate mb-2", style: { color: "var(--text-muted)" } }, o.descricao), /* @__PURE__ */ React.createElement("div", { className: "flex justify-between gap-3 text-[10px] pt-2", style: { borderTop: "1px solid var(--border)" } }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1 min-w-0 flex-1" }, /* @__PURE__ */ React.createElement(import_lucide_react.Users, { size: 9, className: "shrink-0", style: { color: "var(--text-muted)" } }), /* @__PURE__ */ React.createElement("span", { className: "truncate", style: { color: "var(--text)" }, title: o.criado_login || o.operador || "" }, o.criado_login || o.operador || "\u2014")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1 shrink-0" }, /* @__PURE__ */ React.createElement(import_lucide_react.Phone, { size: 9, className: "shrink-0", style: { color: "var(--text-muted)" } }), /* @__PURE__ */ React.createElement("span", { className: "whitespace-nowrap", style: { color: "var(--text)" } }, o.telefone || "\u2014"))), et && /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-[9px] mt-2", style: { color: "var(--text-muted)" } }, /* @__PURE__ */ React.createElement("span", null, et.label), /* @__PURE__ */ React.createElement(import_lucide_react.ChevronRight, { size: 9 })), canWrite && et?.next && /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
        e.stopPropagation();
        updO(o.id, "status", et.next);
      }, className: "w-full mt-2 py-2 rounded-lg text-[10px] font-bold cursor-pointer", style: { background: "var(--accent-green)", color: "#fff" } }, "Avan\xE7ar \u2192 ", ETAPAS2.find((x) => x.status === et.next)?.label || et.next), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mt-2" }, /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
        e.stopPropagation();
        onReport && onReport(o);
      }, className: "flex-1 py-2 rounded-lg text-[10px] font-bold cursor-pointer", style: { border: "1px solid var(--border-bright)", color: "var(--text-muted)" } }, "Report"), canWrite && onEdit && /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
        e.stopPropagation();
        onEdit(o);
      }, className: "flex-1 py-2 rounded-lg text-[10px] font-bold cursor-pointer", style: { border: "1px solid var(--border-bright)", color: "var(--text-muted)" } }, "Editar"), /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
        e.stopPropagation();
        setSel(sel === o.id ? null : o.id);
      }, className: "flex-1 py-2 rounded-lg text-[10px] font-bold cursor-pointer", style: { border: "1px solid var(--border-bright)", color: "var(--text-muted)" } }, "POP")), sel === o.id && et && /* @__PURE__ */ React.createElement("div", { className: "mt-2 pt-2 space-y-2", style: { borderTop: "1px solid var(--border)" } }, et.checklist.map((c, i) => {
        const fk = `${o.id}-${et.status}-${i}`;
        const ck = !!checkedFlags[fk];
        return /* @__PURE__ */ React.createElement("div", { key: i, onClick: (e) => {
          e.stopPropagation();
          setCheckedFlags((p) => ({ ...p, [fk]: !p[fk] }));
        }, className: "flex items-center gap-2 text-[10px] cursor-pointer select-none", style: { color: ck ? "var(--accent-green)" : "var(--text-muted)" } }, /* @__PURE__ */ React.createElement("span", { className: "w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0", style: { borderColor: ck ? "var(--accent-green)" : "var(--border-bright)", background: ck ? "var(--accent-green)" : "transparent" } }, ck && /* @__PURE__ */ React.createElement("span", { style: { color: "#fff", fontSize: "9px", fontWeight: 700, lineHeight: 1 } }, "\u2713")), c);
      }))));
    }), "  "), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-xl p-4 min-w-0", style: { background: "var(--bg-card)", border: "1px solid var(--border-bright)" } }, /* @__PURE__ */ React.createElement("div", { className: "text-[10px] font-bold uppercase tracking-wide mb-3", style: { color: "var(--text-muted)" } }, "TOP FILIAIS"), (() => {
      const cnt = {};
      ativas.forEach((o) => {
        const f = o.operacao || "Outros";
        cnt[f] = (cnt[f] || 0) + 1;
      });
      const s = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 5);
      const max = s[0]?.[1] || 1;
      return s.map(([f, n], i) => /* @__PURE__ */ React.createElement("div", { key: f, className: "ranking-linha" }, /* @__PURE__ */ React.createElement("span", { className: "text-right", style: { color: "var(--text-muted)" } }, i + 1), /* @__PURE__ */ React.createElement("span", { className: "truncate", style: { color: "var(--text)" }, title: f }, f), /* @__PURE__ */ React.createElement("span", { className: "ranking-barra" }, /* @__PURE__ */ React.createElement("span", { style: { width: `${n / max * 100}%` } })), /* @__PURE__ */ React.createElement("span", { className: "text-right font-bold", style: { color: "var(--accent-green)" } }, n)));
    })()), /* @__PURE__ */ React.createElement("div", { className: "rounded-xl p-4 min-w-0", style: { background: "var(--bg-card)", border: "1px solid var(--border-bright)" } }, /* @__PURE__ */ React.createElement("div", { className: "text-[10px] font-bold uppercase tracking-wide mb-3", style: { color: "var(--text-muted)" } }, "OS POR TIPO"), (() => {
      const cnt = {};
      ativas.forEach((o) => {
        const t = TIPO_LABELS[o.tipo_servico || "" || "" || "" || "" || "" || "" || o.tipo_servico || "" || "Outros"] || "Outros";
        cnt[t] = (cnt[t] || 0) + 1;
      });
      const total = ativas.length || 1;
      return Object.entries(cnt).map(([t, n]) => /* @__PURE__ */ React.createElement("div", { key: t, className: "ranking-linha sem-posicao" }, /* @__PURE__ */ React.createElement("span", { className: "truncate", style: { color: "var(--text)" }, title: t }, t), /* @__PURE__ */ React.createElement("span", { className: "ranking-barra" }, /* @__PURE__ */ React.createElement("span", { style: { width: `${n / total * 100}%` } })), /* @__PURE__ */ React.createElement("span", { className: "text-right", style: { color: "var(--text-muted)" } }, n, " (", Math.round(n / total * 100), "%)")));
    })()), /* @__PURE__ */ React.createElement("div", { className: "rounded-xl p-4", style: { background: "var(--bg-card)", border: "1px solid var(--border-bright)" } }, /* @__PURE__ */ React.createElement("div", { className: "text-[10px] font-bold uppercase tracking-wide mb-3", style: { color: "var(--text-muted)" } }, "ALERTAS"), criticos > 0 && /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-2 text-[11px] mb-2" }, /* @__PURE__ */ React.createElement(import_lucide_react.AlertTriangle, { size: 12, className: "shrink-0 mt-1", style: { color: "var(--accent-red)" } }), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text)" } }, criticos, " cr\xEDtico", criticos > 1 ? "s" : "", " \u2014 atraso > 2h")), atencoes > 0 && /* @__PURE__ */ React.createElement("div", { className: "flex items-start gap-2 text-[11px] mb-2" }, /* @__PURE__ */ React.createElement(import_lucide_react.AlertTriangle, { size: 12, className: "shrink-0 mt-1", style: { color: "var(--accent-yellow)" } }), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text)" } }, atencoes, " OS h\xE1 mais de 1h")), criticos === 0 && atencoes === 0 && /* @__PURE__ */ React.createElement("div", { className: "text-[11px]", style: { color: "var(--accent-green)" } }, "Todos dentro do prazo."), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-[11px] mt-3" }, /* @__PURE__ */ React.createElement(import_lucide_react.Activity, { size: 11, style: { color: "var(--text-muted)" } }), /* @__PURE__ */ React.createElement("span", { style: { color: "var(--text-muted)" } }, "Atualiza\xE7\xE3o a cada 30s")))));
  }
  function TabAcompanhamento({ ordens }) {
    const ativas = ordens.filter((o) => STATUS_ABERTOS2.has(o.status || ""));
    const STATUS_SEQ = ["Aguardando", "Prestador localizado", "A caminho", "No local", "Servi\xE7o em execu\xE7\xE3o", "Ve\xEDculo liberado", "Rebocado"];
    function statusIdx(s) {
      return Math.max(0, STATUS_SEQ.findIndex((x) => x.toLowerCase() === s?.toLowerCase()));
    }
    return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-6" }, /* @__PURE__ */ React.createElement(import_lucide_react.GitBranch, { size: 20, style: { color: "var(--accent-green)" } }), /* @__PURE__ */ React.createElement("h2", { className: "text-lg font-bold", style: { fontFamily: "var(--font-heading)", color: "var(--accent-green)" } }, "ACOMPANHAMENTO \u2014 LINHA DO TEMPO")), ativas.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "text-center py-16", style: { color: "var(--text-muted)" } }, "Nenhum atendimento em andamento"), /* @__PURE__ */ React.createElement("div", { className: "space-y-6" }, ativas.map((o) => {
      const curIdx = statusIdx(o.status || "");
      return /* @__PURE__ */ React.createElement("div", { key: o.id, className: "rounded-xl p-6", style: { background: "var(--bg-card)", border: "1px solid var(--border-bright)" } }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-6" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold px-2 py-1 rounded", style: { background: "var(--accent-green-glow)", color: "var(--accent-green)" } }, "O.S. #", o.os), /* @__PURE__ */ React.createElement("span", { className: "text-xs font-bold", style: { color: "var(--text)" } }, o.placa || "\u2014", " \u2014 ", o.operacao || "\u2014"), o.abertura && /* @__PURE__ */ React.createElement("span", { className: "text-xs ml-auto", style: { color: "var(--text-muted)" } }, /* @__PURE__ */ React.createElement(TempoEmAberto, { abertura: o.abertura }))), /* @__PURE__ */ React.createElement("div", { className: "relative py-6" }, /* @__PURE__ */ React.createElement("div", { className: "absolute top-1/2 left-4 right-4 h-0.5 rounded", style: { background: "var(--border-bright)", transform: "translateY(-50%)" } }), /* @__PURE__ */ React.createElement("div", { className: "absolute top-1/2 left-4 h-0.5 rounded transition-all duration-500", style: { background: "var(--accent-green)", width: `calc(${curIdx / (STATUS_SEQ.length - 1) * 100}% - 2rem)`, transform: "translateY(-50%)", boxShadow: "0 0 8px rgba(34,197,94,0.5)" } }), /* @__PURE__ */ React.createElement("div", { className: "relative flex justify-between px-4" }, STATUS_SEQ.map((st, si) => {
        const done = si <= curIdx;
        const active = si === curIdx;
        return /* @__PURE__ */ React.createElement("div", { key: si, className: "flex flex-col items-center", style: { zIndex: 1 } }, /* @__PURE__ */ React.createElement("div", { className: "w-4 h-4 rounded-full border-2 transition-all", style: { background: done ? "var(--accent-green)" : "var(--bg)", borderColor: done ? "var(--accent-green)" : "var(--border-bright)", boxShadow: active ? "0 0 10px rgba(34,197,94,0.9)" : "none" } }), /* @__PURE__ */ React.createElement("div", { className: "text-[9px] mt-2 text-center max-w-[55px] leading-tight", style: { color: done ? "var(--accent-green)" : "var(--text-soft)" } }, st));
      }))));
    })));
  }

  // components/ExportMenu.tsx
  var import_react11 = __toESM(require_react());
  var card = { background: "var(--bg-card, #111)", border: "1px solid var(--border-bright, #444)", borderRadius: 12, boxShadow: "0 8px 30px rgba(0,0,0,.4)", color: "var(--text, #eee)" };
  var corPri = { alta: "#dc2626", media: "#d97706", baixa: "#16a34a" };
  var CELULAR = "(max-width: 639px)";
  function useCelular() {
    const mq = typeof window !== "undefined" && window.matchMedia ? window.matchMedia(CELULAR) : null;
    const [c, setC] = (0, import_react11.useState)(!!(mq && mq.matches));
    (0, import_react11.useEffect)(() => {
      if (!mq) return;
      const f = () => setC(mq.matches);
      mq.addEventListener ? mq.addEventListener("change", f) : mq.addListener(f);
      return () => {
        mq.removeEventListener ? mq.removeEventListener("change", f) : mq.removeListener(f);
      };
    }, []);
    return c;
  }
  function ExportMenu() {
    const celular = useCelular();
    const [aberto, setAberto] = (0, import_react11.useState)(false);
    const [iaAberta, setIaAberta] = (0, import_react11.useState)(false);
    const [msg, setMsg] = (0, import_react11.useState)("");
    const [busy, setBusy] = (0, import_react11.useState)(false);
    const [ia, setIa] = (0, import_react11.useState)(null);
    const [pergunta, setPergunta] = (0, import_react11.useState)("");
    const [, tick] = (0, import_react11.useState)(0);
    (0, import_react11.useEffect)(() => {
      const t = setInterval(() => tick((n) => n + 1), 3e3);
      return () => clearInterval(t);
    }, []);
    const mb = window.__mapBaseInfo || {};
    const sc = window.__sascarInfo || {};
    async function analisar(p) {
      setBusy(true);
      setMsg("IA analisando os dados\u2026");
      try {
        const r = await pedirIA(calcInsights(), p || "");
        setIa(r);
        setMsg("");
      } catch (e) {
        const c = e && e.code;
        setMsg(c === "not_granted" ? "IA n\xE3o autorizada." : c === "unavailable" ? "IA indispon\xEDvel neste modo." : "N\xE3o consegui analisar agora (" + (c || e && e.message || "erro") + ").");
      }
      setBusy(false);
    }
    async function pdf() {
      setBusy(true);
      setMsg("Gerando relat\xF3rio com an\xE1lise da IA\u2026");
      let r = ia;
      if (!r) {
        try {
          r = await pedirIA(calcInsights(), "");
          setIa(r);
        } catch (e) {
          r = null;
        }
      }
      try {
        await exportarGerencialPdf(r);
        setMsg(r ? "PDF salvo, com an\xE1lise da IA." : "PDF salvo (sem an\xE1lise da IA).");
        setAberto(false);
      } catch (e) {
        const c = e && e.code;
        setMsg(c === "declined" ? "Download cancelado." : c === "lib" ? "Biblioteca de PDF n\xE3o carregou. Recarregue a p\xE1gina." : "N\xE3o foi poss\xEDvel gerar o PDF (" + (c || e && e.message || "erro") + ").");
      }
      setBusy(false);
      setTimeout(() => setMsg(""), 6e3);
    }
    async function xl(f, nome) {
      setBusy(true);
      setMsg("Gerando " + nome + "\u2026");
      try {
        await f();
        setMsg("Arquivo salvo.");
        setAberto(false);
      } catch (e) {
        const c = e && e.code;
        setMsg(c === "declined" ? "Download cancelado." : c === "lib" ? "Biblioteca n\xE3o carregou. Recarregue." : "N\xE3o foi poss\xEDvel gerar (" + (c || e && e.message || "erro") + ").");
      }
      setBusy(false);
      setTimeout(() => setMsg(""), 6e3);
    }
    const itens = [
      { t: "Ordens de servi\xE7o (Excel)", d: "Todas as O.S. com defeito, execu\xE7\xE3o e valores", f: () => xl(exportarOrdensExcel, "Excel de O.S.") },
      { t: "Prestadores (Excel)", d: "Cadastro completo com tipo e faturamento", f: () => xl(exportarPrestadoresExcel, "Excel de prestadores") },
      // Relatório gerencial: só gerente e admin (o operador só consulta).
      ...podeEditar(papelAtual()) ? [{ t: "Relat\xF3rio gerencial (PDF)", d: "Gr\xE1ficos, \xFAltimos carros, placas recorrentes e an\xE1lise da IA", f: pdf }] : []
    ];
    const acoes = window.__painelAcoes || {};
    const naoLidas = Number(acoes.naoLidas || 0);
    const temIA = !!window.PRINT_CONFIG?.AI_ENDPOINT;
    const extras = celular ? [
      ...acoes.exportarExcel ? [{ t: "Exportar Excel", d: "Relat\xF3rio anal\xEDtico em Excel", f: () => {
        setAberto(false);
        acoes.exportarExcel();
      } }] : [],
      ...acoes.notificacoes ? [{ t: "Notifica\xE7\xF5es" + (naoLidas > 0 ? ` (${naoLidas})` : ""), d: "Avisos de SLA e mudan\xE7as de O.S.", f: () => {
        setAberto(false);
        acoes.notificacoes();
      } }] : [],
      ...temIA ? [{ t: "\u{1F916} Assistente IA", d: "Pend\xEAncias e carros para vigiar", f: () => {
        setAberto(false);
        setIaAberta((v) => !v);
      } }] : []
    ] : [];
    const btn = { padding: "10px 16px", borderRadius: 999, color: "#fff", border: "none", fontWeight: 800, fontSize: 12, boxShadow: "0 4px 14px rgba(0,0,0,.4)", cursor: "pointer" };
    const stat = mb.status && mb.status !== "ok" || sc.status && !/^ok/.test(sc.status || "ok") ? [mb.status && mb.status !== "ok" ? "Mapa: " + mb.status : "", sc.status && !/^ok/.test(sc.status) ? "Sascar: " + sc.status : ""].filter(Boolean).join(" \xB7 ") : "";
    return /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", right: "max(16px, env(safe-area-inset-right, 0px))", bottom: "max(16px, env(safe-area-inset-bottom, 0px))", zIndex: 45, maxWidth: "calc(100vw - 32px)", fontFamily: "inherit", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 } }, stat && /* @__PURE__ */ React.createElement("div", { style: { ...card, padding: "4px 8px", fontSize: 10, maxWidth: 300 } }, stat), iaAberta && /* @__PURE__ */ React.createElement("div", { style: { ...card, width: "min(360px, calc(100vw - 32px))", maxHeight: "70vh", overflowY: "auto", padding: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 800, fontSize: 13, marginBottom: 6 } }, "\u{1F916} Assistente de opera\xE7\xE3o"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("input", { value: pergunta, onChange: (e) => setPergunta(e.target.value), placeholder: "Pergunte (opcional): ex. quais carros vigiar?", style: { flex: 1, minWidth: 0, fontSize: 11, padding: "6px 8px", borderRadius: 8, border: "1px solid var(--border, #444)", background: "transparent", color: "inherit" } }), /* @__PURE__ */ React.createElement("button", { disabled: busy, onClick: () => analisar(pergunta), style: { ...btn, padding: "6px 12px", background: "#2563eb", boxShadow: "none" } }, busy ? "\u2026" : "Analisar")), !ia && !busy && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, opacity: 0.7 } }, "Toque em Analisar para a IA apontar pend\xEAncias, carros para vigiar e solu\xE7\xF5es."), ia && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, lineHeight: 1.45 } }, ia.resumo && /* @__PURE__ */ React.createElement("p", { style: { margin: "0 0 8px" } }, ia.resumo), (ia.alertas || []).map((a, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { borderLeft: "3px solid " + (corPri[String(a.prioridade).toLowerCase()] || "#888"), padding: "2px 8px", margin: "6px 0" } }, /* @__PURE__ */ React.createElement("b", null, a.titulo), " ", /* @__PURE__ */ React.createElement("span", { style: { opacity: 0.6 } }, "(", a.prioridade, ")"), /* @__PURE__ */ React.createElement("div", null, a.motivo), /* @__PURE__ */ React.createElement("div", { style: { color: "#16a34a" } }, "\u279C ", a.acao))), (ia.vigiar || []).length > 0 && /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 800, marginTop: 8 } }, "\u{1F441} Vigiar"), (ia.vigiar || []).map((v, i) => /* @__PURE__ */ React.createElement("div", { key: i, style: { margin: "4px 0" } }, /* @__PURE__ */ React.createElement("b", null, v.placa), " \u2014 ", v.motivo, /* @__PURE__ */ React.createElement("div", { style: { color: "#d97706" } }, "\u279C ", v.acao))), (ia.melhorias || []).length > 0 && /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 800, marginTop: 8 } }, "\u{1F4A1} Melhorias"), (ia.melhorias || []).map((m, i) => /* @__PURE__ */ React.createElement("div", { key: i }, "\u2022 ", m)))), aberto && /* @__PURE__ */ React.createElement("div", { style: { ...card, width: "min(300px, calc(100vw - 32px))", overflow: "hidden" } }, [...extras, ...itens].map((it) => /* @__PURE__ */ React.createElement("button", { key: it.t, disabled: busy, onClick: it.f, style: { display: "block", width: "100%", textAlign: "left", padding: "8px 12px", background: "transparent", border: "none", borderBottom: "1px solid var(--border, #333)", color: "inherit", cursor: busy ? "wait" : "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, fontWeight: 700 } }, it.t), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, opacity: 0.65 } }, it.d)))), msg && /* @__PURE__ */ React.createElement("div", { style: { ...card, maxWidth: 300, padding: "8px 12px", fontSize: 11 } }, msg), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, temIA && !celular ? /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setIaAberta((v) => !v);
      setAberto(false);
    }, style: { ...btn, background: "#2563eb" } }, iaAberta ? "Fechar IA" : "\u{1F916} IA") : null, celular ? /* @__PURE__ */ React.createElement("button", { "data-menu-flutuante": true, onClick: () => {
      setAberto((v) => !v);
      setIaAberta(false);
    }, "aria-expanded": aberto, "aria-label": "Menu de a\xE7\xF5es", style: { ...btn, background: "#16a34a", minHeight: 44 } }, aberto ? "\u2715 Fechar" : "\u2630 A\xE7\xF5es", !aberto && naoLidas > 0 && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: 8, background: "var(--accent-red, #ef4444)", borderRadius: 999, padding: "0 6px", fontSize: 10 } }, naoLidas)) : /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setAberto((v) => !v);
      setIaAberta(false);
    }, style: { ...btn, background: "#16a34a" } }, aberto ? "Fechar" : "\u2B07 Exportar")));
  }

  // entry.tsx
  var mem = {};
  try {
    localStorage.setItem("_t", "1");
    localStorage.removeItem("_t");
  } catch (e) {
    Object.defineProperty(window, "localStorage", { value: { getItem: (k) => k in mem ? mem[k] : null, setItem: (k, v) => {
      mem[k] = String(v);
    }, removeItem: (k) => {
      delete mem[k];
    } } });
  }
  (async () => {
    const cl = window.claude;
    const me = window.__printReady ? await window.__printReady : null;
    const role = papelValido2(me && me.role);
    const user = { id: me && me.email || "anon", email: me && me.email || "", nome: me && me.nome || me && me.email || "", role };
    setUser(user);
    let db = null;
    try {
      db = await cl.use("db");
    } catch (e) {
      db = null;
    }
    startBackend(db);
    startMapBase(db, false);
    localStorage.setItem("token", "local");
    localStorage.setItem("user", JSON.stringify(user));
    class Root extends import_react12.default.Component {
      constructor() {
        super(...arguments);
        __publicField(this, "state", { err: null });
      }
      static getDerivedStateFromError(err) {
        return { err };
      }
      render() {
        return this.state.err ? /* @__PURE__ */ import_react12.default.createElement("div", { style: { padding: 24, color: "#e8f2ec", fontFamily: "sans-serif" } }, "O painel n\xE3o conseguiu abrir: ", String(this.state.err && this.state.err.message)) : this.props.children;
      }
    }
    (0, import_client.createRoot)(document.getElementById("root")).render(/* @__PURE__ */ import_react12.default.createElement(Root, null, /* @__PURE__ */ import_react12.default.createElement(Dashboard, null), /* @__PURE__ */ import_react12.default.createElement(ExportMenu, null)));
  })();
})();
