import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { publishNext, publicationSlot } from '../scripts/publish-next.js';

const plan = { timezone: 'Asia/Shanghai', weekdays: ['Mon', 'Tue', 'Thu'], hour: 9, queue: ['queued.md'], requireApproval: true };
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'robotail-publication-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'content'), { recursive: true });
  fs.mkdirSync(path.join(root, 'blog/src/content/posts'), { recursive: true });
  fs.mkdirSync(path.join(root, 'blog/public/images/products'), { recursive: true });
  fs.writeFileSync(path.join(root, 'blog/public/images/products/product.jpg'), 'test image');
  const json = (name, data) => fs.writeFileSync(path.join(root, 'content', name), JSON.stringify(data));
  json('publication-plan.json', plan);
  json('publication-history.json', { publications: [] });
  json('editorial-batches.json', { version: 1, batches: [] });
  json('brand-sources.json', { verifiedAt: '2020-01-01', sources: [{ url: 'https://robotailpets.com/products/c32', facts: [] }] });
  json('product-media.json', { assets: [{ model: 'c32', publicPath: '/images/products/product.jpg', sourcePage: 'https://robotailpets.com/products/c32' }] });
  json('journal-media.json', { assets: [{ publicPath: '/images/products/product.jpg', alt: 'A cat-friendly home', categories: ['Cat-Friendly Homes'] }] });
  fs.writeFileSync(path.join(root, 'blog/src/content/posts/queued.md'), '---\ntitle: A home for cats\ndescription: Cat-friendly home ideas\ntags: [Robotail]\ndraft: true\nsources: [https://robotailpets.com/products/c32]\n---\n\n![Robotail](/images/products/product.jpg)\n');
  // A legacy draft outside the explicit queue must never be selected.
  fs.writeFileSync(path.join(root, 'blog/src/content/posts/legacy.md'), '---\ntitle: Legacy\ndraft: true\n---\n\nOld draft\n');
  return root;
}

test('Publishing uses Beijing weekday and 09:00 boundary', () => {
  assert.deepEqual(publicationSlot(new Date('2026-10-12T01:00:00Z'), plan), { date: '2026-10-12', due: true });
  assert.equal(publicationSlot(new Date('2026-10-12T00:59:00Z'), plan).due, false);
  assert.equal(publicationSlot(new Date('2026-10-13T01:00:00Z'), plan).due, true);
  assert.equal(publicationSlot(new Date('2026-10-14T01:00:00Z'), plan).due, false);
  assert.equal(publicationSlot(new Date('2026-10-15T01:00:00Z'), plan).due, true);
  assert.equal(publicationSlot(new Date('2026-10-11T17:00:00Z'), plan).date, '2026-10-12');
});

test('The old queue never counts as human approval', async t => {
  const root = fixture(t);
  const result = await publishNext({ root, now: new Date('2026-10-12T04:00:00Z') });
  assert.equal(result.status, 'skipped');
  assert.match(result.reason, /human approval/);
  for (const file of ['queued.md', 'legacy.md']) {
    assert.match(fs.readFileSync(path.join(root, 'blog/src/content/posts', file), 'utf8'), /draft: true/);
  }
});

test('Queue exhaustion cannot generate an unreviewed article', async t => {
  const root = fixture(t);
  fs.writeFileSync(path.join(root, 'content/publication-plan.json'), JSON.stringify({ ...plan, queue: [] }));
  const result = await publishNext({
    root, now: new Date('2026-10-12T04:00:00Z'),
    generateArticle: () => assert.fail('The publisher must never call a model')
  });
  assert.equal(result.status, 'skipped');
  assert.equal(fs.readdirSync(path.join(root, 'blog/src/content/posts')).length, 2);
});

test('Disabling approval fails closed rather than restoring legacy authorization', async t => {
  const root = fixture(t);
  fs.writeFileSync(path.join(root, 'content/publication-plan.json'), JSON.stringify({ ...plan, requireApproval: false }));
  await assert.rejects(publishNext({ root, now: new Date('2026-10-12T04:00:00Z') }), /Human approval must be enabled/);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root, 'content/publication-history.json'), 'utf8')).publications, []);
});
