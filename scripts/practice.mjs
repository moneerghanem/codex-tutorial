import {mkdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
process.chdir(fileURLToPath(new URL('../',import.meta.url)));
const style=`body{font:18px/1.6 system-ui,sans-serif;background:#11131b;color:#f0f2ff;max-width:600px;margin:60px auto;padding:24px}main{text-align:center;border:1px solid #565b70;padding:30px;border-radius:15px}output{display:block;font-size:80px;color:#c1ff72}button{font:inherit;padding:12px 20px;margin:5px;background:#242839;color:white;border:1px solid #8c94ad;border-radius:8px;min-height:48px}button:focus-visible{outline:3px solid #ffbe83;outline-offset:4px}a{color:#78e9ed}`;
const check=`import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync(new URL('app.js',import.meta.url),'utf8');
const context=vm.createContext({});
vm.runInContext(source,context);
const model=context.CounterModel;
assert.equal(model.nextCount(0,'plus'),1,'increment');
assert.equal(model.nextCount(3,'reset'),0,'Reset must clear state');
assert.equal(model.nextCount(0,'minus'),0,'zero lower bound');
assert.equal(model.nextCount(1,'minus'),0,'decrement to zero');
let count=0;for(let i=0;i<20;i++)count=model.nextCount(count,'minus');
assert.equal(count,0,'repeated decrement');
count=0;for(const action of ['plus','plus','reset','plus'])count=model.nextCount(count,action);
assert.equal(count,1,'state after Reset');
console.log('PASS: counter state transitions. DOM and keyboard checks still required.');
`;
const readme=mode=>`# Counter ${mode}\n\n${mode==='starter'?'Deliberately broken: Reset does not clear state and minus allows negative counts.':'Completed comparison solution: state is nonnegative and Reset returns to zero.'}\n\nOpen index.html in a browser. No server or installation is required.\n\nOptional logic check (Node.js required): node check.mjs\nThe starter intentionally fails until fixed. This check does not test DOM, screen readers or keyboard behavior.\n\nManual checks: start at zero; + twice gives 2; minus gives 1; Reset gives 0; + after Reset gives 1; repeated minus at zero stays zero. Tab to each button and activate with Enter/Space. Inspect the browser console for errors.\n\nTutorial: https://moneerghanem.github.io/codex-tutorial/\n`;
function crc32(buffer){let c=0xffffffff;for(const b of buffer){c^=b;for(let k=0;k<8;k++)c=(c>>>1)^((c&1)?0xedb88320:0);}return (c^0xffffffff)>>>0;}
function zip(files){const chunks=[],central=[];let offset=0;for(const [name,content]of Object.entries(files)){const n=Buffer.from(name),b=Buffer.from(content),crc=crc32(b),h=Buffer.alloc(30);h.writeUInt32LE(0x04034b50);h.writeUInt16LE(20,4);h.writeUInt16LE(33,12);h.writeUInt32LE(crc,14);h.writeUInt32LE(b.length,18);h.writeUInt32LE(b.length,22);h.writeUInt16LE(n.length,26);chunks.push(h,n,b);const c=Buffer.alloc(46);c.writeUInt32LE(0x02014b50);c.writeUInt16LE(20,4);c.writeUInt16LE(20,6);c.writeUInt16LE(33,14);c.writeUInt32LE(crc,16);c.writeUInt32LE(b.length,20);c.writeUInt32LE(b.length,24);c.writeUInt16LE(n.length,28);c.writeUInt32LE(offset,42);central.push(c,n);offset+=h.length+n.length+b.length;}const cb=Buffer.concat(central),end=Buffer.alloc(22);end.writeUInt32LE(0x06054b50);end.writeUInt16LE(Object.keys(files).length,8);end.writeUInt16LE(Object.keys(files).length,10);end.writeUInt32LE(cb.length,12);end.writeUInt32LE(offset,16);return Buffer.concat([...chunks,cb,end]);}
await mkdir('downloads',{recursive:true});
for(const mode of ['starter','completed']){const broken=mode==='starter';const script=`// State logic is separate so check.mjs can test it without a browser.\nconst CounterModel = {\n  nextCount(count, action) {\n    if (action === 'plus') return count + 1;\n    if (action === 'minus') return ${broken?'count - 1':'Math.max(0, count - 1)'};\n    if (action === 'reset') return ${broken?'count':'0'};\n    return count;\n  }\n};\nglobalThis.CounterModel = CounterModel;\nif (typeof document !== 'undefined') {\n  let count = 0;\n  const value = document.querySelector('#value');\n  const render = () => { value.textContent = count; };\n  document.querySelectorAll('[data-action]').forEach(button => {\n    button.addEventListener('click', () => {\n      count = CounterModel.nextCount(count, button.dataset.action);\n      render();\n    });\n  });\n  render();\n}\n`;
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Counter ${mode}</title><link rel="stylesheet" href="style.css"><script defer src="app.js"></script></head><body><main><h1>Counter</h1><p>${broken?'Deliberately broken starter · Reset and zero boundary need fixes.':'Completed comparison · no negative values.'}</p><output id="value" ${broken?'':'aria-live="polite" aria-label="Counter value"'}>0</output><button data-action="minus" ${broken?'':'aria-label="Decrease counter by one"'}>−</button><button data-action="plus" ${broken?'':'aria-label="Increase counter by one"'}>+</button><button data-action="reset">Reset</button><p>Open app.js to inspect the logic.</p></main></body></html>`;
const files={'index.html':html,'app.js':script,'style.css':style,'check.mjs':check,'README.md':readme(mode)};await mkdir(`practice-projects/${mode}`,{recursive:true});for(const [name,content]of Object.entries(files))await writeFile(`practice-projects/${mode}/${name}`,content);await writeFile(`downloads/counter-${mode}.zip`,zip(files));}
