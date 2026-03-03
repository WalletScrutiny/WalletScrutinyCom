#!/usr/bin/env node
// Re-run round-1 models on the 6 clean-cache products
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const CACHE_TEXT_DIR = path.join(ROOT, 'scripts', 'cache', 'feature-text');
const FEATURES_YML  = path.join(ROOT, '_data', 'features.yml');
const PPQ_API_URL   = 'https://api.ppq.ai';
const PPQ_API_KEY   = process.env.PPQ_API_KEY;

const MODELS = [
  'claude-haiku-4.5',
  'minimax/minimax-m2.5',
  'openai/gpt-oss-120b',
  'google/gemini-2.0-flash-lite-001',
];

const SAMPLE = [
  'hardware/coldcardMk4',
  'android/com.blitzwallet',
  'android/it.airgap.vault',
  'android/io.nunchuk.android',
  'android/org.electrum.electrum',
  'desktop/bitcoincore',
];

const PLATFORMS = { android: '_android', iphone: '_iphone', desktop: '_desktop', hardware: '_hardware' };
const featuresData = yaml.load(fs.readFileSync(FEATURES_YML, 'utf8'));

function readYaml(fp) { try { return yaml.load(fs.readFileSync(fp,'utf8')); } catch { return null; } }
function parseFrontmatter(c) { const m=c.match(/^---\n([\s\S]*?)\n---/); if(!m) return null; try{return yaml.load(m[1]);}catch{return null;} }
function getOfficialFeatureKeys(fm) { const s=new Set(Object.keys(featuresData)); return (fm?.features||[]).filter(f=>typeof f==='string'&&s.has(f)); }
function normalize(s){return s.replace(/\s+/g,' ').toLowerCase().trim();}
function validateQuote(quote,record,source){
  if(!quote||quote.length<10) return 'too_short';
  const t={Store:record.description,README:record.readme,License:record.license,Website:record.websiteText}[source]
    ||[record.description,record.readme,record.license,record.websiteText].filter(Boolean).join('\n');
  if(!t) return 'no_source_text';
  const nt=normalize(t),nq=normalize(quote);
  if(nt.includes(nq)) return 'exact';
  const w=nq.split(' ');
  if(w.length>=4){let f=0;for(let i=0;i<=w.length-4;i++) if(nt.includes(w.slice(i,i+4).join(' '))) f++;
    if(f/Math.max(1,w.length-3)>=0.6) return 'partial';}
  return 'not_found';
}

function buildPrompt(record, existing) {
  const existingSet = new Set(existing);
  const featuresToCheck = Object.entries(featuresData).filter(([k])=>!existingSet.has(k)).map(([k,v])=>`  - ${k}: ${v?.short||k}`).join('\n');
  if (!featuresToCheck.trim()) return null;
  const alreadyNote = existing.length>0 ? `Already confirmed (DO NOT include in response): ${existing.join(', ')}` : 'No features confirmed yet.';
  const textSections = [
    record.reviewBody   && `## Existing WalletScrutiny review\n${record.reviewBody.slice(0,2000)}`,
    record.description  && `## Store description\n${record.description.slice(0,2000)}`,
    record.readme       && `## GitHub README\n${record.readme.slice(0,2000)}`,
    record.license      && `## License\n${record.license.slice(0,500)}`,
    record.websiteText  && `## Website\n${record.websiteText.slice(0,2000)}`,
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
   - quote: Exact plain-text snippet (max 150 chars). NO markdown images, NO links.
   - comment: (optional) One sentence of reasoning ONLY if the quote is not self-explanatory.
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
\`\`\`

If no new features found:
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
      if(typeof entry==='string'&&official.has(entry)){results.push({key:entry,quote:'',source:'',comment:'',hasQuote:false,hasSource:false,hasComment:false});
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

async function processJob(model, productId) {
  const [plat,appId]=productId.split('/');
  const rec=readYaml(path.join(CACHE_TEXT_DIR,plat,appId+'.yaml'));
  if(!rec) return {model,productId,features:[],error:'no_cache',elapsedMs:0,inputTokens:0,outputTokens:0};
  const folder=PLATFORMS[plat];
  const mdPath=path.join(ROOT,folder,appId+'.md');
  if(!fs.existsSync(mdPath)) return {model,productId,features:[],error:'no_md',elapsedMs:0,inputTokens:0,outputTokens:0};
  const fm=parseFrontmatter(fs.readFileSync(mdPath,'utf8'));
  const existing=getOfficialFeatureKeys(fm||{});
  const prompt=buildPrompt(rec,existing);
  if(!prompt) return {model,productId,features:[],error:'no_prompt',elapsedMs:0,inputTokens:0,outputTokens:0};

  const body=JSON.stringify({model,max_tokens:1024,messages:[{role:'user',content:prompt}]});
  const tmp=`/tmp/mc1b_${process.pid}_${Date.now()}.json`;
  fs.writeFileSync(tmp,body);
  const t0=Date.now();
  try {
    const r=execSync(`curl -sS -X POST "${PPQ_API_URL}/v1/chat/completions" -H "Content-Type: application/json" -H "Authorization: Bearer ${PPQ_API_KEY}" --data @"${tmp}"`,
      {encoding:'utf8',timeout:60000});
    const elapsed=Date.now()-t0;
    const parsed=JSON.parse(r);
    if(parsed.error) throw new Error(JSON.stringify(parsed.error));
    const features=parseResponse(parsed.choices[0].message.content).map(f=>({
      ...f, quoteValid:f.hasQuote?validateQuote(f.quote,rec,f.source):'no_quote'
    }));
    return {model,productId,features,error:null,elapsedMs:elapsed,inputTokens:parsed.usage?.prompt_tokens||0,outputTokens:parsed.usage?.completion_tokens||0};
  } catch(e) {
    return {model,productId,features:[],error:e.message.slice(0,100),elapsedMs:Date.now()-t0,inputTokens:0,outputTokens:0};
  } finally { try{fs.unlinkSync(tmp);}catch{} }
}

async function runParallel(jobs, concurrency) {
  const results=[]; let idx=0;
  await Promise.all(Array.from({length:concurrency},async()=>{
    while(idx<jobs.length){
      const job=jobs[idx++];
      const shortModel=job.model.split('/').pop();
      process.stdout.write(`  [start] ${shortModel} × ${job.productId.split('/')[1]}\n`);
      const r=await processJob(job.model,job.productId);
      const status=r.error?`ERROR(${r.error})`:`${r.features.length}feat ${r.elapsedMs}ms`;
      process.stdout.write(`  [done]  ${shortModel} × ${job.productId.split('/')[1]} → ${status}\n`);
      results.push(r);
    }
  }));
  return results;
}

const jobs=[];
for(const model of MODELS) for(const prod of SAMPLE) jobs.push({model,prod:prod,productId:prod});
console.log(`Running ${jobs.length} jobs (${MODELS.length} models × ${SAMPLE.length} products), 10 parallel...\n`);
const allResults=await runParallel(jobs,10);

// Aggregate
const byModel={}, timings={}, tokensByModel={};
for(const r of allResults){
  if(!byModel[r.model]){byModel[r.model]={};timings[r.model]=[];tokensByModel[r.model]={input:0,output:0};}
  byModel[r.model][r.productId]=r.features;
  if(r.elapsedMs>0) timings[r.model].push(r.elapsedMs);
  tokensByModel[r.model].input+=r.inputTokens;
  tokensByModel[r.model].output+=r.outputTokens;
}

// Summary
const pricing={'claude-haiku-4.5':[1.05,5.25],'minimax/minimax-m2.5':[0.315,1.155],'openai/gpt-oss-120b':[0.041,0.1995],'google/gemini-2.0-flash-lite-001':[0.0525,0.21]};
console.log('\n══ SUMMARY ══');
console.log(`${'Model'.padEnd(35)} ${'Total'.padStart(6)} ${'✅'.padStart(5)} ${'⚠️'.padStart(5)} ${'❌'.padStart(5)} ${'Med ms'.padStart(8)} ${'¢/prod'.padStart(8)}`);
for(const model of MODELS){
  let total=0,exact=0,partial=0,notFound=0;
  for(const prod of SAMPLE){
    const feats=(byModel[model]||{})[prod]||[];
    total+=feats.length;
    exact+=feats.filter(f=>f.quoteValid==='exact').length;
    partial+=feats.filter(f=>f.quoteValid==='partial').length;
    notFound+=feats.filter(f=>f.quoteValid==='not_found').length;
  }
  const t=(timings[model]||[]).sort((a,b)=>a-b);
  const med=t.length?t[Math.floor(t.length/2)]:0;
  const u=tokensByModel[model]||{input:0,output:0};
  const p=pricing[model]||[0,0];
  const cost=((u.input/6*p[0])+(u.output/6*p[1]))/1e6*100;
  console.log(`${model.padEnd(35)} ${String(total).padStart(6)} ${String(exact).padStart(5)} ${String(partial).padStart(5)} ${String(notFound).padStart(5)} ${String(med).padStart(8)} ${cost.toFixed(4).padStart(8)}`);
  // Per product detail
  for(const prod of SAMPLE){
    const feats=(byModel[model]||{})[prod]||[];
    if(!feats.length) continue;
    feats.forEach(f=>{
      const sym=f.quoteValid==='exact'?'✅':f.quoteValid==='partial'?'⚠️':f.quoteValid==='not_found'?'❌':'·';
      console.log(`    ${sym} ${prod.split('/')[1]} → ${f.key}: "${(f.quote||'').slice(0,60)}" (${f.source})`);
    });
  }
}

const outPath=path.join(ROOT,'scripts','cache','model-comparison1b.json');
fs.writeFileSync(outPath,JSON.stringify({models:MODELS,sample:SAMPLE,results:byModel,timings,tokensByModel,timestamp:new Date().toISOString()},null,2));
console.log(`\nSaved: ${outPath}`);
