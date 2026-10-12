import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { publishNext, publicationSlot } from '../scripts/publish-next.js';

const plan = { timezone: 'Asia/Shanghai', weekdays: ['Mon', 'Tue', 'Thu'], hour: 9, queue: ['queued.md'] };
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

test('One queued post publishes once per calendar day; legacy drafts stay unpublished', async t => {
  const root = fixture(t);
  const args = { root, now: new Date('2026-10-12T04:00:00Z'), generateArticle: () => assert.fail('Queue must not call API') };
  assert.equal((await publishNext(args)).file, 'queued.md');
  assert.match(fs.readFileSync(path.join(root, 'blog/src/content/posts/queued.md'), 'utf8'), /draft: false/);
  assert.equal((await publishNext(args)).status, 'skipped');
  assert.match(fs.readFileSync(path.join(root, 'blog/src/content/posts/legacy.md'), 'utf8'), /draft: true/);
});

test('After queue exhaustion generate one illustrated English article using saved facts without freshness gate', async t => {
  const root = fixture(t);
  const now = new Date('2026-10-12T04:00:00Z');
  await publishNext({ root, now });
  fs.writeFileSync(path.join(root, 'content/publication-history.json'), '{"publications":[]}');
  let calls = 0;
  const result = await publishNext({ root, now, generateArticle: async () => {
    calls++;
    return { title: 'A thoughtful cat corner', description: 'A comfortable home for cats', tags: ['Robotail'], content: '[Robotail](https://robotailpets.com/products/c32) offers an open-top option.' };
  } });
  assert.equal(calls, 1);
  const text = fs.readFileSync(path.join(root, 'blog/src/content/posts', result.file), 'utf8');
  assert.match(text, /draft: false/);
  assert.match(text, /images\/products\/product.jpg/);
});

test('Invalid generated language does not create a publication record', async t => {
  const root = fixture(t);
  fs.writeFileSync(path.join(root, 'content/publication-plan.json'), JSON.stringify({ ...plan, queue: [] }));
  await assert.rejects(publishNext({ root, now: new Date('2026-10-12T04:00:00Z'), generateArticle: async () => ({
    title: '中文标题', description: 'Description', tags: [], content: '[Robotail](https://robotailpets.com/products/c32)'
  }) }), /English-only/);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(root, 'content/publication-history.json'), 'utf8')).publications, []);
});
