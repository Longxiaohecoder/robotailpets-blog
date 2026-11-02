import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const config=JSON.parse(await fs.readFile(path.join(root,'content/analytics-config.json'),'utf8'));
const out=path.join(root,'output/blog-analytics');await fs.mkdir(out,{recursive:true});
const dashboard=path.join(out,'dashboard/src/data.json');
const old=JSON.parse(await fs.readFile(dashboard,'utf8'));
const checkedAt=new Date().toISOString();
let auth;
try {auth=JSON.parse(await fs.readFile(path.join(root,'.local/vercel-analytics-token.json'),'utf8'));} catch(e){if(e.code!=='ENOENT')throw e;}
const queries={};const results=[];
const source={name:'Vercel Web Analytics · cookieless page views',url:'https://vercel.com/robotail/auto-blog-system/analytics',description:'No GA4 data is substituted. Page views are not verified human visitors. API access is unavailable until a separately authorized team token exists.',executedAt:null};
for(const period of ['all','30d','7d','yesterday'])for(const kind of ['summary','daily','pages','channels'])queries[kind+'_'+period]={rows:[],source:{...source},status:'unavailable'};
// A private local token is optional; without it, publish honest unavailable state.
// Do not silently reuse the GA4 opt-in data as cookieless totals.
if(auth?.token){
 const transport=`import json,sys,urllib.request,urllib.error\nq=json.load(sys.stdin)\nr=urllib.request.Request(q['url'],headers={'Authorization':'Bearer '+q['token']})\ntry:\n with urllib.request.urlopen(r,timeout=45) as s: print(json.dumps({'status':s.status,'body':json.load(s)}))\nexcept urllib.error.HTTPError as e: print(json.dumps({'status':e.code}))`;
 async function api(label,params){
  const url=new URL('https://api.vercel.com/v1/query/web-analytics/visits/aggregate');
  url.search=new URLSearchParams({teamId:config.vercelTeamId,projectId:config.vercelProjectId,...params});
  const result=await new Promise((resolve,reject)=>{const child=spawn('python3',['-c',transport],{stdio:['pipe','pipe','pipe']});let data='';child.stdout.on('data',c=>data+=c);child.stderr.resume();child.on('error',reject);child.on('close',code=>{try{if(code)throw Error('Vercel transport failed');resolve(JSON.parse(data));}catch(e){reject(e);}});child.stdin.end(JSON.stringify({url:url.href,token:auth.token}));});
  if(result.status!==200)throw Error('Vercel report HTTP '+result.status);
  results.push({label,params,response:result.body});return result.body.data;
 }
 const today=checkedAt.slice(0,10),day=86400000;
 for(const [period,days] of [['30d',30],['7d',7],['yesterday',1],['all',30]]){
  // Hobby exposes 30 days. "all" is all available cookieless history, not site lifetime.
  const requestedSince=period==='all'?config.cookielessSwitchedOn:new Date(Date.now()-(days-1)*day).toISOString().slice(0,10);
  const untilDate=period==='yesterday'?new Date(Date.now()-day).toISOString().slice(0,10):today;
  const until=period==='yesterday'?untilDate+'T23:59:59.999Z':checkedAt;
  const oldestAvailable=new Date(Date.now()-29*day).toISOString().slice(0,10);
  const since=period==='yesterday'?untilDate:[requestedSince,config.cookielessSwitchedOn,oldestAvailable].sort().at(-1);
  if(untilDate<config.cookielessSwitchedOn){
    for(const kind of ['summary','daily','pages','channels'])queries[kind+'_'+period]={rows:[],source:{...source,description:'Selected period predates cookieless activation; historical counts are unavailable, not zero.'},status:'outside-coverage'};
    continue;
  }
  const daily=await api('daily_'+period,{since,until,by:'day'});
  const pages=await api('pages_'+period,{since,until,by:'requestPath',limit:'100'});
  const channels=await api('channels_'+period,{since,until,by:'referrerHostname',limit:'100'});
  if(!Array.isArray(daily)||!Array.isArray(pages)||!Array.isArray(channels))throw Error('Unexpected Vercel aggregate response');
  const make=(rows)=>({rows,source:{...source,executedAt:checkedAt,description:'Vercel official API; UTC period '+since+' — '+until},status:'observed'});
  queries['summary_'+period]=make([{screenPageViews:daily.reduce((n,r)=>n+Number(r.pageviews||0),0),totalUsers:null,averageEngagementPerSession:null}]);
  queries['daily_'+period]=make(daily.filter(r=>r.timestamp.slice(0,10)>=since&&r.timestamp.slice(0,10)<=untilDate).map(r=>({date:r.timestamp.slice(0,10),screenPageViews:r.pageviews})));
  queries['pages_'+period]=make(pages.map(r=>({pagePath:r.requestPath,screenPageViews:r.pageviews})));
  queries['channels_'+period]=make(channels.map(r=>({sessionDefaultChannelGroup:r.referrerHostname||'Direct / unknown',screenPageViews:r.pageviews})));
 }
}
const snapshot={...old,provider:'vercel',generatedAt:checkedAt,status:auth?.token?'observed':'awaiting-report-access',queries,timezone:'UTC',host:config.hostname,vercelProjectId:config.vercelProjectId,trackingStartedAt:config.cookielessVerifiedAt||null,collectionActivatedOn:config.cookielessSwitchedOn,measurementId:null,consentScope:'Automatic cookieless page counts; owner visits, opt-outs and privacy signals excluded.',buildStatus:'complete'};
await fs.writeFile(dashboard,JSON.stringify(snapshot,null,2));await fs.writeFile(path.join(out,'snapshot.json'),JSON.stringify(snapshot,null,2));
await fs.writeFile(path.join(out,'vercel-report-evidence.json'),JSON.stringify({checkedAt,provider:'vercel',status:snapshot.status,results},null,2));
console.log(JSON.stringify({provider:'vercel',status:snapshot.status,checkedAt}));
