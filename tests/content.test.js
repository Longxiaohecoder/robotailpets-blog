import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import YAML from 'yaml';
import { requestArticle, validateArticle, saveDraft, resolveConfig } from '../scripts/content-core.js';

test('desktop provider model cannot contaminate local project; CI uses environment', () => {
  const desktop = { ANTHROPIC_MODEL: 'unrelated-model', ANTHROPIC_BASE_URL: 'https://other.test' };
  const local = { ANTHROPIC_BASE_URL: 'https://heyroute.ai' };
  const config = resolveConfig(local, desktop, true);
  assert.equal(config('ANTHROPIC_BASE_URL'), local.ANTHROPIC_BASE_URL);
  assert.equal(config('ANTHROPIC_MODEL'), undefined);
  assert.equal(resolveConfig({}, desktop, false)('ANTHROPIC_MODEL'), desktop.ANTHROPIC_MODEL);
});

const sources = { verifiedAt: '2026-10-10', sources: [{ url: 'https://robotailpets.com/' }] };
const article = { title: 'Title "quotes": example', description: '简介: "引用"', tags: ['Robotail'], content: '[官网](https://robotailpets.com/)' };
const base = { apiKey: 'test-only', baseURL: 'https://example.test/v1', model: 'test', prompt: 'test' };

test('402, invalid JSON and truncation cause failures, never success', async () => {
  await assert.rejects(requestArticle({ ...base, fetchImpl: async () => new Response('', { status: 402 }) }), /402/);
  for (const data of [
    { content: [{ type: 'text', text: 'invalid JSON' }] },
    { stop_reason: 'max_tokens', content: [{ type: 'text', text: '{}' }] }
  ]) {
    await assert.rejects(requestArticle({ ...base, fetchImpl: async () => Response.json(data) }));
  }
});
test('versioned endpoint and multiple text blocks are handled correctly', async () => {
  const result = await requestArticle({ ...base, fetchImpl: async (url) => {
    assert.equal(url.href, 'https://example.test/v1/messages');
    return Response.json({ content: [{ type: 'thinking', text: 'ignored' }, { type: 'text', text: JSON.stringify(article) }] });
  } });
  assert.deepEqual(result, article);
});
test('missing fields and unverified links are rejected', () => {
  assert.throws(() => validateArticle({ ...article, title: '' }, sources));
  assert.throws(() => validateArticle({ ...article, content: '[fake](https://amazon.com/fake)' }, sources));
  assert.deepEqual(validateArticle(article, sources), article);
});
test('Markdown frame preserves unescaped quotes and multiline article body', async () => {
  const text = 'TITLE: "Robotail" guide\r\n\r\nDESCRIPTION: 日常 "选购"\r\n\r\nTAGS: Robotail|用品\r\n\r\nCONTENT:\r\n## 开始\r\n\r\n[官网](https://robotailpets.com/)';
  const result = await requestArticle({ ...base, fetchImpl: async () => Response.json({ content: [{ type: 'text', text }] }) });
  assert.equal(result.title, '"Robotail" guide');
  assert.deepEqual(result.tags, ['Robotail', '用品']);
  assert.match(result.content, /## 开始\n\n/);
  validateArticle(result, sources);
});
test('quoted titles round-trip, every generated article is a draft, filenames do not collide', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'robotail-content-test-'));
  try {
    const first = saveDraft(article, dir, sources);
    const second = saveDraft(article, dir, sources);
    assert.notEqual(first, second);
    const frontmatter = fs.readFileSync(first, 'utf8').split('---\n')[1];
    const metadata = YAML.parse(frontmatter);
    assert.equal(metadata.title, article.title);
    assert.equal(metadata.draft, true);
    assert.equal(metadata.author, 'Robotail Editorial Team');
    assert.doesNotMatch(metadata.reviewNote, /\p{Script=Han}/u);
    assert.deepEqual(metadata.sources, ['https://robotailpets.com/']);
  } finally { fs.rmSync(dir, { recursive: true }); }
});
