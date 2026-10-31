import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import dotenv from 'dotenv';

// Read-only reporting. Credentials stay local; this never changes Google settings.
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const config=JSON.parse(await fs.readFile(path.join(root,'content/analytics-config.json'),'utf8'));
const authRoot=path.resolve(root, '../shopify-seo-automation');
dotenv.config({path:path.join(authRoot,'.env'),quiet:true});
dotenv.config({path:path.join(root,'.env.local'),override:true,quiet:true});
const {googleFetch}=await import(path.join(authRoot,'scripts/google-http.js'));
const host='auto-blog-system-omega.vercel.app';
const now=new Date();
const checkedAt=now.toISOString();
const endDate='yesterday';
const property=config.propertyId;
if(!property || !/^\d+$/.test(property))throw Error('Missing valid Analytics property');
const outDir=path.join(root,'output/blog-analytics');
await fs.mkdir(outDir,{recursive:true});
const response=await googleFetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'refresh_token',client_id:process.env.GOOGLE_CLIENT_ID,client_secret:process.env.GOOGLE_CLIENT_SECRET,refresh_token:process.env.GOOGLE_REFRESH_TOKEN})});
if(!response.ok)throw Error('Google authorization HTTP '+response.status);
const token=(await response.json()).access_token;
const evidence=[];
async function report(label,dimensions,metrics,dateRanges){
 const request={dateRanges,dimensions:dimensions.map(name=>({name})),metrics:metrics.map(name=>({name})),dimensionFilter:{filter:{fieldName:'hostName',stringFilter:{matchType:'EXACT',value:host,caseSensitive:false}}},limit:'10000'};
 const r=await googleFetch(`https://analyticsdata.googleapis.com/v1beta/properties/${property}:runReport`,{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:JSON.stringify(request)});
 if(!r.ok)throw Error('Blog report '+label+' HTTP '+r.status);
 const data=await r.json();
 if(data.metadata?.dataLossFromOtherRow || data.metadata?.samplingMetadatas?.length || data.metadata?.subjectToThresholding)throw Error('Blog report incomplete or thresholded: '+label);
 if(data.rowCount>10000)throw Error('Blog report requires pagination');
 evidence.push({label,request,response:data});
 return {data,rows:(data.rows||[]).map(row=>Object.fromEntries([...dimensions.map((key,i)=>[key,row.dimensionValues[i].value]),...metrics.map((key,i)=>[key,Number(row.metricValues[i].value)])]))};
}
const ranges=[{id:'all',label:'创建以来',startDate:'2026-09-22'},{id:'30d',label:'近 30 天',startDate:'30daysAgo'},{id:'7d',label:'近 7 天',startDate:'7daysAgo'},{id:'yesterday',label:'昨天',startDate:'yesterday'}];
const queries={};
let timezone;
for(const period of ranges){
 const reports=await Promise.allSettled([
 report(period.id,[],['totalUsers','sessions','screenPageViews','userEngagementDuration'],[{startDate:period.startDate,endDate}]),
 report('daily_'+period.id,['date'],['sessions','screenPageViews'],[{startDate:period.startDate,endDate}]),
 report('pages_'+period.id,['pagePath'],['screenPageViews','userEngagementDuration'],[{startDate:period.startDate,endDate}]),
 report('channels_'+period.id,['sessionDefaultChannelGroup'],['sessions'],[{startDate:period.startDate,endDate}])]);
 const failure=reports.find(r=>r.status==='rejected');
 if(failure)throw failure.reason;
 const [result,daily,pages,channels]=reports.map(r=>r.value);
 timezone=result.data.metadata?.timeZone || timezone;
 const measured=Boolean(config.collectionVerifiedAt);
 queries['summary_'+period.id]={rows:result.rows.map(row=>({...row,averageEngagementPerSession:row.sessions>0?row.userEngagementDuration/row.sessions:null})),source:{type:'api',name:'Google Analytics Data API · 博客域名单独过滤',executedAt:checkedAt,period:{start:period.startDate,end:endDate},url:'https://analytics.google.com/',description:'hostName EXACT '+host+'. No rows before tracking is established means unavailable, not zero visitors.',metricDefinitions:[{label:'访客',definition:'GA4 totalUsers，按本期整体去重，不累加每日访客。'},{label:'平均有效停留 / 次',definition:'userEngagementDuration / sessions。页面在前台的有效参与秒数；不是打开标签页的总时长。'},{label:'外部真实访客',definition:'没有内部流量标记和排除证据时无法识别；不是总访客减一个人。'}]},status:measured?'observed':'unavailable'};
 for(const [id,result] of Object.entries({daily,pages,channels}))queries[id+'_'+period.id]={rows:result.rows.map(row=>row.date?{...row,date:row.date.replace(/^(\d{4})(\d{2})(\d{2})$/,'$1-$2-$3')}:row),source:{name:'Google Analytics Data API · '+host,url:'https://analytics.google.com/',executedAt:checkedAt,period:{start:period.startDate,end:endDate},description:'Exact host filter; this period only. No cross-site totals.'}};
}
const snapshot={title:'Robotail 博客访问看板',surface:'dashboard',buildStatus:'complete',generatedAt:checkedAt,status:config.collectionVerifiedAt?'observed':'awaiting-first-event',host,timezone,historyStart:'2026-09-22',historyStartNote:'最早仓库提交日期，不等同于已证明的上线时间。',trackingStartedAt:config.collectionVerifiedAt,measurementId:config.measurementId,propertyId:config.propertyId,internalTrafficExcluded:false,consentScope:'只统计主动同意的浏览器；未同意、拦截统计及被排除的浏览器不在统计内。',exportPreferences:{selected:null,destinations:[]},filters:[],queries};
await fs.writeFile(path.join(outDir,'report-evidence.json'),JSON.stringify({checkedAt,host,property,results:evidence},null,2));
await fs.writeFile(path.join(outDir,'snapshot.json'),JSON.stringify(snapshot,null,2));
const dashboardData=path.join(outDir,'dashboard/src/data.json');
try { const existing=JSON.parse(await fs.readFile(dashboardData,'utf8')); await fs.writeFile(dashboardData,JSON.stringify({...snapshot,id:existing.id},null,2)); } catch(error) { if(error.code!=='ENOENT')throw error; }
console.log(JSON.stringify({host,reportRows:queries.summary_all.rows.length,timezone,snapshot:'output/blog-analytics/snapshot.json',trackingStartedAt:snapshot.trackingStartedAt}));
