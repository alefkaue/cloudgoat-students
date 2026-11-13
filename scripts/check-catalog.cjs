// Read-only consistency checks for the documentation catalog.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname,'..');
const walk = dir => fs.readdirSync(dir,{withFileTypes:true}).filter(e=>e.name!=='.git').flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);
let errors=[];
let links=0;
for(const file of walk(root).filter(f=>f.endsWith('.md'))) {
  const source=fs.readFileSync(file,'utf8').replace(/```[\s\S]*?```/g,'');
  for(const m of source.matchAll(/\]\(([^)]+)\)/g)) {
    const href=m[1];
    if(/^(https?:|mailto:|#)/.test(href))continue;
    const local=path.resolve(path.dirname(file),decodeURIComponent(href.split('#')[0]));
    links++;
    if(!fs.existsSync(local))errors.push(path.relative(root,file)+': '+href);
  }
}
for(const platform of ['aws','azure']) {
  const catalog=path.join(root,'docs/scenarios',platform);
  const count=fs.readdirSync(catalog,{withFileTypes:true}).filter(e=>e.isDirectory()&&fs.existsSync(path.join(catalog,e.name,'README.md'))).length;
  const expected=platform==='aws'?29:2;
  if(count!==expected)errors.push(`${platform}: ${count} fichas; esperado ${expected}`);
  console.log(`${platform}: ${count} fichas de preparação`);
}
const pdf=fs.readFileSync(path.join(root,'docs/scenarios/aws/cloud_breach_s3_academy/adaptation.pdf'));
if(!pdf.subarray(0,8).toString().startsWith('%PDF-1.4')||!pdf.subarray(-10).toString().includes('%%EOF'))errors.push('PDF sem marcadores esperados');
if(errors.length){console.error(errors.join('\n'));process.exit(1);}
console.log(`${links} links locais conferidos; PDF preservado.`);
