import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import YAML from 'yaml';
import {publicationTime, localDate, publicationDates} from '../scripts/publication-schedule.js';
import {publicationSlot} from '../scripts/publish-next.js';
import {releaseDates} from '../scripts/weekly-editorial.js';

const plan = JSON.parse(fs.readFileSync(new URL('../content/publication-plan.json',import.meta.url),'utf8'));
test('US Eastern slots enforce all three second boundaries in summer and winter', () => {
  for(const [day, utc] of [
    ['2026-10-19','2026-10-19T17:17:23.000Z'],
    ['2026-10-20','2026-10-20T14:43:37.000Z'],
    ['2026-10-22','2026-10-22T16:26:41.000Z'],
    ['2026-11-02','2026-11-02T18:17:23.000Z'],
    ['2026-11-03','2026-11-03T15:43:37.000Z'],
    ['2026-11-05','2026-11-05T17:26:41.000Z'],
    ['2027-03-15','2027-03-15T17:17:23.000Z']
  ]) {
    const target=publicationTime(day,plan);
    assert.equal(target.toISOString(),utc);
    assert.deepEqual(publicationSlot(new Date(+target-1),plan),{date:day,due:false});
    assert.deepEqual(publicationSlot(target,plan),{date:day,due:true});
  }
  assert.equal(publicationSlot(new Date('2026-10-21T18:00:00Z'),plan).due,false);
  assert.equal(localDate(new Date('2026-10-19T02:00:00Z'),plan.timezone),'2026-10-18');
});
test('Approval uses US dates, skips elapsed seconds and handles DST rollover',()=>{
  const empty={publications:[]};
  assert.deepEqual(releaseDates(new Date('2026-10-23T07:00:00Z'),plan,empty),['2026-10-26','2026-10-27','2026-10-29']);
  assert.deepEqual(releaseDates(new Date('2026-10-19T17:17:24Z'),plan,empty),['2026-10-20','2026-10-22','2026-10-26']);
  assert.deepEqual(releaseDates(new Date('2026-10-30T07:00:00Z'),plan,empty),['2026-11-02','2026-11-03','2026-11-05']);
});
test('Historical publication instants prevent duplicates across timezone migration',()=>{
  assert.deepEqual(publicationDates({publications:[{date:'2026-10-20',publishedAt:'2026-10-19T17:20:00Z'}]},plan.timezone),['2026-10-19']);
  assert.throws(()=>publicationTime('2026-10-19',{...plan,times:{Mon:'13:99:23'}}),/Invalid publication time/);
});
test('Cloud cron timezone, minute and retries match the live plan',()=>{
  const workflow=YAML.parse(fs.readFileSync(new URL('../.github/workflows/auto-publish.yml',import.meta.url),'utf8'));
  const schedules=workflow.on.schedule;
  assert.equal(schedules.length,6);
  const days={Mon:'1',Tue:'2',Thu:'4'};
  for(const [day,time] of Object.entries(plan.times)){
    const [h,m]=time.split(':').map(Number);
    const main=schedules.find(s=>s.cron===`${m} ${h} * * ${days[day]}`);
    assert.equal(main?.timezone,plan.timezone);
    const retry=schedules.find(s=>s.cron===`${(m+35)%60} ${h+Math.floor((m+35)/60)} * * ${days[day]}`);
    assert.equal(retry?.timezone,plan.timezone);
  }
});
