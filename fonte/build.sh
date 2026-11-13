#!/usr/bin/env bash
# Recompila o painel (requer: npm i -D esbuild). Gera ../index.html (raiz do site) mantendo o shim do Supabase.
set -e; cd "$(dirname "$0")"; S=./shims
npx esbuild entry.tsx --bundle --format=iife --jsx=transform --target=es2020 --outfile=out/app.js --alias:@=. \
 --alias:react=$S/react.js --alias:react-dom/client=$S/react-dom-client.js --alias:recharts=$S/recharts.js \
 --alias:lucide-react=$S/lucide.js --alias:leaflet=$S/leaflet.js --alias:next/dynamic=$S/next-dynamic.js --alias:next-themes=$S/next-themes.js --log-level=warning
python3 - <<'P'
h=open('template.html',encoding='utf8').read()
i=h.index('<script>\n',h.index('lucide-react.min.js'))+len('<script>\n')
js=open('out/app.js',encoding='utf8').read()
body=h[:i]+js+"\n</script>\n"
inj='<script src="config.js"></script>\n<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.js"></script>\n<script src="claude-shim.js"></script>\n'
j=body.index('<script src=')
head='<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0;font:14px system-ui,sans-serif}img{max-width:100%}.leaflet-container img{max-width:none!important}[hidden]{display:none!important}</style></head><body>'
open('../index.html','w',encoding='utf8').write(head+body[:j]+inj+body[j:]+'</body></html>')
P
