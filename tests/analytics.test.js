import {test} from 'node:test';
import assert from 'node:assert/strict';
import {startAudience} from '../blog/src/scripts/audience.js';
function run({hostname='auto-blog-system-omega.vercel.app',internal,oldConsent,optout,privacy=false,pathname='/blog/example/',search=''}={}) {
 const storage=new Map(Object.entries({'robotail-analytics-internal':internal,'robotail-analytics-consent':oldConsent,'robotail-pageviews-optout':optout}).filter(([,v])=>v!==undefined));
 const calls=[];
 const env={document:{querySelector(){return null;}},location:{hostname,pathname,search,hash:''},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},navigator:{doNotTrack:privacy?'1':'0'},history:{replaceState(){}}};
 startAudience(props=>calls.push(props),env);return {calls,storage};
}
test('a first-time production reader is counted without any consent choice',()=>assert.equal(run().calls.length,1));
test('owner visits, opt-outs, privacy signals, previews and settings are not counted',()=>{
 for(const options of [{internal:'1'},{oldConsent:'denied'},{optout:'1'},{privacy:true},{hostname:'localhost'},{hostname:'preview.vercel.app'},{pathname:'/analytics-settings/'}])assert.equal(run(options).calls.length,0);
});
test('owner exclusion applies before initialization',()=>{
 const r=run({search:'?robotail_internal=1'});assert.equal(r.calls.length,0);assert.equal(r.storage.get('robotail-analytics-internal'),'1');
});
test('pageview URLs drop query and fragment; no foreign host can be counted',()=>{
 const r=run();const filter=r.calls[0].beforeSend;
 assert.equal(filter({type:'pageview',url:'https://auto-blog-system-omega.vercel.app/blog/post/?email=private#secret'}).url,'https://auto-blog-system-omega.vercel.app/blog/post/');
 assert.equal(filter({type:'pageview',url:'https://example.com/'}),null);
});
