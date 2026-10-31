import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const code=fs.readFileSync(new URL('../blog/public/analytics.js',import.meta.url),'utf8');
function run({hostname='auto-blog-system-omega.vercel.app',consent,internal,privacy=false,pathname='/blog/example/',search='',testing=false}={}){
 const storage=new Map(Object.entries({'robotail-analytics-consent':consent,'robotail-analytics-internal':internal}).filter(([,v])=>v!==undefined));
 const tags=[];const banner={hidden:false,setAttribute(){},querySelector(){return {addEventListener(){}};}};
 const window={};
 const document={currentScript:{dataset:{measurementId:'G-MRVLWE5V3G'}},readyState:'complete',referrer:'https://example.com/story?private=secret#fragment',querySelector(){return null;},createElement(tag){return tag==='script'?{}:banner;},querySelectorAll(){return[];},head:{append(t){tags.push(t);}},body:{append(){}}};
 const context={window,document,sessionStorage:{getItem:()=>testing?'1':null},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},location:{hostname,origin:'https://'+hostname,pathname,search,hash:''},history:{replaceState(){}},navigator:{doNotTrack:privacy?'1':'0'},URL,URLSearchParams,Date};
 vm.runInNewContext(code,context);
 return {tags,window,storage};
}
test('no analytics network tag before consent, in previews, or for excluded browsers',()=>{
 for(const options of [{},{hostname:'localhost',consent:'granted'},{hostname:'preview.vercel.app',consent:'granted'},{internal:'1',consent:'granted'},{privacy:true,consent:'granted'},{pathname:'/analytics-settings/',consent:'granted'}])assert.equal(run(options).tags.length,0);
});
test('owner exclusion URL takes effect before a saved analytics consent',()=>{
 const r=run({consent:'granted',search:'?robotail_internal=1'});assert.equal(r.tags.length,0);assert.equal(r.storage.get('robotail-analytics-internal'),'1');
});
test('consenting production page loads one tag and strips private URL data',()=>{
 const r=run({consent:'granted',search:'?email=private@example.com'});assert.equal(r.tags.length,1);
 const command=r.window.dataLayer.find(v=>v[0]==='config');
 assert.equal(command[2].page_location,'https://auto-blog-system-omega.vercel.app/blog/example/');
 assert.equal(command[2].page_referrer,'https://example.com/story');
 assert.equal(command[2].allow_google_signals,false);assert.equal(command[2].allow_ad_personalization_signals,false);
});
test('verification sessions are explicitly marked internal and debug',()=>{
 const r=run({consent:'granted',testing:true});const c=r.window.dataLayer.find(v=>v[0]==='config');assert.equal(c[2].traffic_type,'internal');assert.equal(c[2].debug_mode,true);
});
