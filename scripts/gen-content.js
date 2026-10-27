const vm=require('vm'),fs=require('fs'),path=require('path');
const [src,app]=process.argv.slice(2);const w={};w.window=w;vm.createContext(w);
for(const f of ['i18n','data','extra','works','wmedia','svcpages'])vm.runInContext(fs.readFileSync(path.join(src,'js',f+'.js'),'utf8'),w);
// messages: dotted flat keys -> nested
for(const l of ['ar','en']){const out={};for(const [k,v] of Object.entries(w.I18N[l])){const p=k.split('.');let o=out;p.slice(0,-1).forEach(s=>{o=o[s]=o[s]||{}});if(typeof o!=='object'||o[p.at(-1)]!==undefined)throw Error('conflict '+k);o[p.at(-1)]=v}
 fs.writeFileSync(path.join(app,'src/messages',l+'.json'),JSON.stringify(out,null,2)+'\n')}
// content
const KEEP=['SITE','PLATFORMS','XPATH','SOCIAL','PROJECTS','SERVICES','INDUSTRIES','PROCESS','FAQ','SVCS','SECTORS','CLIENTS','WORK_SVC','WORKS','WMEDIA','SVCPAGES'];
let ts='/* Generated from ../omnexa-final-run/js/{data,extra,works,wmedia,svcpages}.js by evaluating them (scripts/gen-content.js).\n   Do not edit by hand — edit the source data and regenerate. */\n\n';
for(const k of KEEP){if(w[k]===undefined)throw Error('missing '+k);ts+=`export const ${k} = ${JSON.stringify(w[k])};\n\n`}
ts+='export type Locale = "ar" | "en";\nexport type Work = (typeof WORKS)[number];\nexport type Project = (typeof PROJECTS)[number];\n';
fs.writeFileSync(path.join(app,'src/content/data.ts'),ts);
console.log('ok',fs.statSync(path.join(app,'src/content/data.ts')).size);
