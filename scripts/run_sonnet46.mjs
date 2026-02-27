#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const ROOT = '/root/.openclaw/workspace-walletscrutiny/walletScrutinyCom';
const CACHE_TEXT_DIR = path.join(ROOT, 'scripts/cache/feature-text');
const FEATURES_YML = path.join(ROOT, '_data/features.yml');
const PPQ_API_KEY = process.env.PPQ_API_KEY;
const MODEL = 'claude-sonnet-4.6';
const PLATFORMS = { android: '_android', iphone: '_iphone', desktop: '_desktop', hardware: '_hardware' };

const SAMPLE = [
  'hardware/coldcardMk4','android/com.blitzwallet','android/it.airgap.vault',
  'android/io.nunchuk.android','android/org.electrum.electrum','desktop/bitcoincore',
];

const featuresData = yaml.load(fs.readFileSync(FEATURES_YML, 'utf8'));
function readYaml(fp) { try { return yaml.load(fs.readFileSync(fp,'utf8')); } catch { return null; } }
function parseFrontmatter(c) { const m=c.match(/^---\n([\s\S]*?)\n---/); if(!m) return null; try{return yaml.load(m[1]);}catch{return null;} }
function getOfficialFeatureKeys(fm) { const s=new Set(Object.keys(featuresData)); return (fm?.features||[]).filter(f=>typeof f==='string'&&s.has(f)); }
function normalize(s){return s.replace(/\s+/g,' ').toLowerCase().trim();}
function validateQuote(quote,record,source){
  if(!quote||quote.length<10) return 'too_short';
  const t={Store:record.description,README:record.readme,License:record.license,Website:record.websiteText}[source]||[record.description,record.readme,record.license,record.websiteText].filter(Boolean).join('\n');
  if(!t) return 'no_source_text';
  const nt=normalize(t),nq=normalize(quote);
  if(nt.includes(nq)) return 'exact';
  const w=nq.split(' ');
  if(w.length>=4){let f=0;for(let i=0;i<=w.length-4;i++) if(nt.includes(w.slice(i,i+4).join(' '))) f++;
    if(f/Math.max(1,w.length-3)>=0.6) return 'partial';}
  return 'not_found';
}

function buildPrompt(record, existingFeatures) {
  const existingSet = new Set(existingFeatures);
  const featuresToCheck = Object.entries(featuresData).filter(([k])=>!existingSet.has(k)).map(([k,v])=>`  - ${k}: ${v?.short||k}`).join('\n');
  if (!featuresToCheck.trim()) return null;
  const alreadyNote = existingFeatures.length>0 ? `Already confirmed (DO NOT include in response): ${existingFeatures.join(', ')}` : 'No features confirmed yet.';
  const textSections = [
    record.reviewBody&&`## Existing WalletScrutiny review\n${record.reviewBody.slice(0,2000)}`,
    record.description&&`## Store description\n${record.description.slice(0,2000)}`,
    record.readme&&`## GitHub README\n${record.readme.slice(0,2000)}`,
    record.license&&`## License\n${record.license.slice(0,500)}`,
    record.websiteText&&`## Website\n${record.websiteText.slice(0,2000)}`,
  ].filter(Boolean).join('\n\n');
  return `You are a Bitcoin wallet feature analyst for WalletScrutiny.
Find ONLY new features not yet confirmed for "${record.title}" (${record.platform}/${record.appId}).
CRITICAL: LN (Lightning Network) and Liquid (L-BTC sidechain) are COMPLETELY DIFFERENT. Do not confuse them.

${alreadyNote}

## Features to check (only these, only if clearly supported)
${featuresToCheck}

## RULES
1. LN vs Liquid: LN = Lightning Network (instant Bitcoin payments). Liquid = Blockstream sidechain with L-BTC. NOT the same.
2. Evidence in Review body: do NOT return these — they are already documented elsewhere.
3. For evidence from Store/README/License/Website, provide:
   - source: ONE of "Store", "README", "License", or "Website" (pick the most authoritative)
   - quote: Exact plain-text snippet (max 150 chars). NO markdown images (![...]), NO links ([text](url)).
   - comment: (optional) One sentence of reasoning ONLY if the quote is not self-explanatory. Do NOT restate which source it came from.
4. foss: ONLY if License section explicitly shows a recognized FOSS license (MIT, GPL, Apache, AGPL, etc.).
5. Be conservative. Omit a feature if you are not certain.

## Source text
${textSections}

## Response — YAML only, nothing else:

\`\`\`yaml
features:
  - ln:
      source: "Store"
      quote: "Send and receive Lightning payments instantly"
  - foss:
      source: "License"
      quote: "MIT License"
  - coinCtrl:
      source: "README"
      quote: "Select which UTXOs to spend in advanced settings"
      comment: "Implies coin control functionality"
\`\`\`

If no new features found (or only Review body evidence):
\`\`\`yaml
features: []
\`\`\``;
}

function parseResponse(response) {
  const m=response.match(/```ya?ml\s*([\s\S]*?)```/i);
  const raw=m?m[1].trim():response.trim();
  try {
    const parsed=yaml.load(raw);
    if(!parsed||!Array.isArray(parsed.features)) return [];
    const official=new Set(Object.keys(featuresData));
    const results=[];
    for (const entry of parsed.features) {
      if(typeof entry==='string'&&official.has(entry)){results.push({key:entry,hasQuote:false,hasSource:false,hasComment:false,quote:'',source:'',comment:''});
      }else if(typeof entry==='object'&&entry!==null){
        for(const[key,val] of Object.entries(entry)){
          if(!official.has(key)) continue;
          const v=typeof val==='object'&&val!==null?val:{};
          results.push({key,quote:v.quote||'',source:v.source||'',comment:v.comment||'',hasQuote:!!v.quote,hasSource:!!v.source,hasComment:!!v.comment});
        }
      }
    }
    return results;
  } catch { return []; }
}

const allResults = {};
let totalIn=0, totalOut=0;
const timings=[];

for (const prod of SAMPLE) {
  const [plat,appId]=prod.split('/');
  const rec=readYaml(path.join(CACHE_TEXT_DIR,plat,appId+'.yaml'));
  if(!rec){allResults[prod]=[];continue;}
  const folder=PLATFORMS[plat];
  const mdPath=path.join(ROOT,folder,appId+'.md');
  if(!fs.existsSync(mdPath)){allResults[prod]=[];continue;}
  const fm=parseFrontmatter(fs.readFileSync(mdPath,'utf8'));
  const existing=getOfficialFeatureKeys(fm||{});
  const prompt=buildPrompt(rec,existing);
  if(!prompt){allResults[prod]=[];continue;}

  process.stdout.write(`  ${prod} ... `);
  const body=JSON.stringify({model:MODEL,max_tokens:1024,messages:[{role:'user',content:prompt}]});
  const tmp=`/tmp/sonnet_${Date.now()}.json`;
  fs.writeFileSync(tmp,body);
  const t0=Date.now();
  try {
    const r=execSync(`curl -sS -X POST "https://api.ppq.ai/v1/chat/completions" -H "Content-Type: application/json" -H "Authorization: Bearer ${PPQ_API_KEY}" --data @"${tmp}"`,{encoding:'utf8',timeout:90000});
    const elapsed=Date.now()-t0;
    timings.push(elapsed);
    const parsed=JSON.parse(r);
    if(parsed.error) throw new Error(JSON.stringify(parsed.error));
    totalIn+=parsed.usage?.prompt_tokens||0;
    totalOut+=parsed.usage?.completion_tokens||0;
    const feats=parseResponse(parsed.choices[0].message.content).map(f=>({...f,quoteValid:f.hasQuote?validateQuote(f.quote,rec,f.source):'no_quote'}));
    allResults[prod]=feats;
    console.log(`${feats.length} feat ${elapsed}ms`);
  } catch(e) {
    console.log('ERROR: '+e.message.slice(0,80));
    allResults[prod]=[];
  } finally { try{fs.unlinkSync(tmp);}catch{} }
}

// Summary
let total=0,exact=0,partial=0,notFound=0;
for(const[prod,feats] of Object.entries(allResults)){
  for(const f of feats){
    total++;
    if(f.quoteValid==='exact') exact++;
    else if(f.quoteValid==='partial') partial++;
    else if(f.quoteValid==='not_found') notFound++;
  }
}
const sorted=timings.sort((a,b)=>a-b);
const med=sorted[Math.floor(sorted.length/2)]||0;
const pricing=[3.15,15.75];
const costPerProd=((totalIn/6*pricing[0])+(totalOut/6*pricing[1]))/1e6*100;

console.log('\nSONNET SUMMARY');
console.log('Total features: '+total+' | Verified: '+exact+' | Partial: '+partial+' | Fabricated: '+notFound);
console.log('Median ms: '+med+' | Cost/product: '+costPerProd.toFixed(4)+'c');
console.log('Tokens: '+totalIn+' in / '+totalOut+' out');

// Print per-product detail
for(const[prod,feats] of Object.entries(allResults)){
  if(!feats.length){console.log('\n'+prod+': (none)');continue;}
  console.log('\n'+prod+':');
  feats.forEach(f=>{
    const sym=f.quoteValid==='exact'?'✅':f.quoteValid==='partial'?'⚠️':f.quoteValid==='not_found'?'❌':'·';
    console.log('  '+sym+' '+f.key+': "'+f.quote.slice(0,70)+'" ('+f.source+')');
  });
}

// Save
const out={model:MODEL,sample:SAMPLE,results:allResults,timings,tokens:{in:totalIn,out:totalOut},timestamp:new Date().toISOString()};
fs.writeFileSync('/root/.openclaw/workspace-walletscrutiny/walletScrutinyCom/scripts/cache/model-sonnet46.json',JSON.stringify(out,null,2));
console.log('\nSaved to model-sonnet46.json');
