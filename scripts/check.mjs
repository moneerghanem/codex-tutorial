import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const root=process.cwd();
const read=p=>readFile(p,'utf8');
async function walk(dir){const result=[];for(const e of await readdir(dir,{withFileTypes:true})){if(['.git','node_modules','.qa'].includes(e.name))continue;const p=path.join(dir,e.name);if(e.isDirectory())result.push(...await walk(p));else result.push(p);}return result;}
const files=await walk(root),htmlFiles=files.filter(f=>f.endsWith('.html')&&!f.includes(path.sep+'content'+path.sep));
let links=0;
for(const f of htmlFiles){const html=await read(f);assert.match(html,/<html lang="en">/,f+' language');assert.match(html,/<title>.+?<\/title>/,f+' title');assert.equal((html.match(/<h1(?: |>)/g)||[]).length,1,f+' h1');const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length,f+' duplicate ids');
 for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){const u=m[1];if(/^(https?:|mailto:|data:)/.test(u))continue;const [p,hash]=u.split('#');let target=p.startsWith('/codex-tutorial/')?path.join(root,p.slice('/codex-tutorial/'.length)):path.resolve(path.dirname(f),p||path.basename(f));if(p.endsWith('/'))target=path.join(target,'index.html');const s=await stat(target).catch(()=>null);assert(s?.isFile(),`Broken link ${f}: ${u}`);if(hash&&target.endsWith('.html')){const text=target===f?html:await read(target);assert(text.includes(`id="${hash}"`),`Missing fragment ${u}`);}links++;}
 assert(!/coming soon|TODO|lorem ipsum/i.test(html),f+' placeholder');
}
const lessons=JSON.parse(await read('content/lessons.json'));assert.equal(lessons.length,12);for(const l of lessons){const body=await read(`content/${l.slug}.html`);assert(body.length>1400,l.slug+' substantive content');assert(l.sources.length,l.slug+' sources');}
function model(mode){const c=vm.createContext({});vm.runInContext(requireSource[mode],c);return c.CounterModel;}
const requireSource={starter:await read('practice-projects/starter/app.js'),completed:await read('practice-projects/completed/app.js')};
const good=model('completed'),bad=model('starter');
assert.equal(bad.nextCount(3,'reset'),3,'starter Reset bug present');assert.equal(bad.nextCount(0,'minus'),-1,'starter lower-bound bug present');
for(const count of [0,1,2,20,100]){assert.equal(good.nextCount(count,'plus'),count+1);assert.equal(good.nextCount(count,'minus'),Math.max(0,count-1));assert.equal(good.nextCount(count,'reset'),0);}
let count=0;for(const a of ['plus','plus','reset','plus'])count=good.nextCount(count,a);assert.equal(count,1);
let seed=42;count=0;for(let i=0;i<1000;i++){seed=(seed*1664525+1013904223)>>>0;count=good.nextCount(count,['plus','minus','reset'][seed%3]);assert(count>=0);}
const secretPattern=new RegExp('sk-[A-Za-z0-9]{24,}|gh[pousr]_[A-Za-z0-9]{20,}|'+'-----BEGIN [A-Z ]*'+'PRIVATE KEY');
for(const file of files.filter(f=>/\.(html|js|mjs|json|md|css)$/.test(f))){const text=await read(file);assert(!secretPattern.test(text),'possible secret in '+file);}
console.log(`PASS: ${htmlFiles.length} HTML pages; ${links} local links/assets/fragments; 12 lessons; starter defects; completed boundary/state checks; secret-pattern scan.`);
// Exercise bootstrap with denied/corrupt storage and an unavailable clipboard.
const appSource=await read('assets/app.js');
for(const mode of ['denied','corrupt']){
 const created=[];const code={textContent:'example'};
 const pre={dataset:{kind:'example'},querySelector:()=>code,after:()=>{},append:()=>{}};
 const doc={querySelectorAll:s=>s==='pre'?[pre]:[],querySelector:()=>null,addEventListener:()=>{},createElement:tag=>{const e={tag,textContent:'',setAttribute:()=>{},addEventListener:(name,fn)=>e[name]=fn};created.push(e);return e;}};
 const local={getItem:()=>{if(mode==='denied')throw Error('blocked');return '{invalid';},setItem:()=>{throw Error('blocked');}};
 vm.runInNewContext(appSource,{document:doc,localStorage:local,navigator:{},window:{addEventListener:()=>{}}});
 await created.find(e=>e.tag==='button').click();
 assert(created.find(e=>e.tag==='span').textContent.includes('Copy unavailable'),'clipboard failure is honest');
}
console.log('PASS: bootstrap with denied/corrupt local storage and honest clipboard failure feedback (isolated DOM fixture).');
