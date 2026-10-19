import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { prepareBatch, approveBatch, releaseDates, weekOf, editorialWeekOf } from '../scripts/weekly-editorial.js';
import { publishNext } from '../scripts/publish-next.js';

const plan = { timezone: 'Asia/Shanghai', weekdays: ['Mon', 'Tue', 'Thu'], hour: 9, requireApproval: true, queue: ['one.md', 'two.md', 'three.md'] };
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'robotail-review-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const dir of ['content/research', 'blog/src/content/posts', 'blog/public/images/products']) fs.mkdirSync(path.join(root, dir), { recursive: true });
  fs.writeFileSync(path.join(root, 'blog/public/images/products/model.jpg'), 'original image');
  const json = (file, data) => fs.writeFileSync(path.join(root, file), JSON.stringify(data));
  json('content/publication-plan.json', plan);
  json('content/publication-history.json', { publications: [] });
  json('content/editorial-batches.json', { version: 1, batches: [] });
  json('content/research/2026-10-19.json', { verifiedAt: '2026-10-19', sources: [{ url: 'https://robotailpets.com/products/c32', facts: ['Original model information'] }] });
  for (const [i, file] of plan.queue.entries()) {
    fs.writeFileSync(path.join(root, 'blog/src/content/posts', file), `---\ntitle: Cat home idea ${i}\ndescription: A welcoming home for cats\ntags: [Robotail]\ndraft: true\ncover: /images/products/model.jpg\nsources: [https://robotailpets.com/products/c32]\n---\n\n[Robotail](https://robotailpets.com/products/c32) offers options for a cat-friendly home.\n\n![Original model](/images/products/model.jpg)\n`);
  }
  return root;
}
const monday8 = new Date('2026-10-19T00:00:00Z');
const monday9 = new Date('2026-10-19T01:00:00Z');
const prepare = root => prepareBatch({ root, researchFile: 'content/research/2026-10-19.json', files: plan.queue, now: monday8 });
const approve = root => approveBatch({ root, id: '2026-10-19', confirmation: '确认 2026-10-19 这三篇', now: monday8 });

test('Friday preparation registers next Monday; Friday approval schedules Mon Tue Thu', t => {
  const root = fixture(t);
  const friday = new Date('2026-10-23T07:00:00Z');
  assert.equal(editorialWeekOf(friday), '2026-10-26');
  assert.equal(editorialWeekOf(new Date('2026-10-24T07:00:00Z')), '2026-10-26');
  assert.equal(editorialWeekOf(new Date('2026-10-25T07:00:00Z')), '2026-10-26');
  assert.equal(editorialWeekOf(monday8), '2026-10-19');
  const args = {root, researchFile: 'content/research/2026-10-19.json', files: plan.queue, now: friday};
  assert.equal(prepareBatch(args).batch.id, '2026-10-26');
  assert.equal(prepareBatch(args).status, 'existing');
  assert.deepEqual(approveBatch({root, id:'2026-10-26', confirmation:'Confirm all three', now:friday}).batch.items.map(i => i.scheduledFor), ['2026-10-26','2026-10-27','2026-10-29']);
});

test('Monday batch preparation creates exactly three reviewable drafts, never publication', t => {
  const root = fixture(t);
  assert.throws(() => prepareBatch({ root, files: ['one.md'], now: monday8 }), /exactly three/);
  assert.equal(prepare(root).batch.status, 'pending');
  assert.equal(prepare(root).status, 'existing');
  assert.match(fs.readFileSync(path.join(root, 'content/reviews/2026-10-19.md'), 'utf8'), /Cat home idea 2/);
  assert.equal(weekOf(new Date('2026-10-18T17:00:00Z')), '2026-10-19');
  for (const file of plan.queue) assert.match(fs.readFileSync(path.join(root, 'blog/src/content/posts', file), 'utf8'), /draft: true/);
});

test('Unapproved queue cannot publish or call a generation API', async t => {
  const root = fixture(t);
  const args = { root, now: monday9, generateArticle: () => assert.fail('Cloud publisher must not generate') };
  assert.equal((await publishNext(args)).status, 'skipped');
  prepare(root);
  assert.equal((await publishNext(args)).status, 'skipped');
  assert.equal(JSON.parse(fs.readFileSync(path.join(root, 'content/publication-history.json'))).publications.length, 0);
});

test('Human confirmation schedules three dates; due publishing stays one per day', async t => {
  const root = fixture(t);
  prepare(root);
  assert.throws(() => approveBatch({ root, id: '2026-10-19' }), /human confirmation/);
  assert.deepEqual(approve(root).batch.items.map(item => item.scheduledFor), ['2026-10-19', '2026-10-20', '2026-10-22']);
  assert.equal((await publishNext({ root, now: monday8 })).status, 'skipped');
  const one = await publishNext({ root, now: monday9 });
  assert.equal(one.file, 'one.md');
  assert.equal(one.batchId, '2026-10-19');
  assert.equal((await publishNext({ root, now: monday9 })).status, 'skipped');
  assert.equal((await publishNext({ root, now: new Date('2026-10-20T01:00:00Z') })).file, 'two.md');
  assert.equal((await publishNext({ root, now: new Date('2026-10-22T01:00:00Z') })).file, 'three.md');
  assert.equal((await publishNext({ root, now: new Date('2026-10-26T01:00:00Z'), generateArticle: () => assert.fail('No fallback generation') })).status, 'skipped');
});

test('Late approval rolls forward and respects existing reservations', () => {
  assert.deepEqual(releaseDates(new Date('2026-10-19T02:00:00Z'), plan, { publications: [] }), ['2026-10-20', '2026-10-22', '2026-10-26']);
  assert.deepEqual(releaseDates(monday8, plan, { publications: [{ date: '2026-10-19' }] }, ['2026-10-20']), ['2026-10-22', '2026-10-26', '2026-10-27']);
});

test('Changing reviewed text blocks approval', t => {
  const root = fixture(t);
  prepare(root);
  fs.appendFileSync(path.join(root, 'blog/src/content/posts/one.md'), '\nChanged copy');
  assert.throws(() => approve(root), /changed after review/);
});

test('Changing an approved image blocks cloud publication', async t => {
  const root = fixture(t);
  prepare(root); approve(root);
  fs.writeFileSync(path.join(root, 'blog/public/images/products/model.jpg'), 'different image');
  await assert.rejects(publishNext({ root, now: monday9 }), /new confirmation required/);
  assert.equal(JSON.parse(fs.readFileSync(path.join(root, 'content/publication-history.json'))).publications.length, 0);
});

test('Changing reviewed research blocks approval', t => {
  const root = fixture(t);
  prepare(root);
  fs.appendFileSync(path.join(root, 'content/research/2026-10-19.json'), '\n');
  assert.throws(() => approve(root), /Research changed/);
});
