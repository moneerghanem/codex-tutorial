import http from 'node:http';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
const root=process.cwd();
http.createServer(async(req,res)=>{try{let p=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/codex-tutorial/,''); if(p.endsWith('/'))p+='index.html'; const f=path.resolve(root,'.'+p);if(!f.startsWith(root+path.sep))throw Error();const b=await readFile(f);res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.json':'application/json','.zip':'application/zip'}[path.extname(f)]||'text/plain')+'; charset=utf-8');res.end(b);}catch{res.statusCode=404;res.setHeader('Content-Type','text/html; charset=utf-8');res.end(await readFile(path.join(root,'404.html')));}}).listen(4173,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:4173/codex-tutorial/'));
