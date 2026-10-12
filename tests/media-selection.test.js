import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseCover, chooseProductImages } from '../scripts/media-selection.js';

const photo = (name, category = 'Life with Cats') => ({ publicPath: '/images/' + name, categories: [category] });
const post = (cover, body = '', draft = false) => ({ metadata: { cover, draft, pubDate: '2026-10-12' }, body });

test('Cover selection stays relevant and avoids the last two covers', () => {
  const a = photo('a'), b = photo('b'), c = photo('c'), unrelated = photo('d', 'Product Guides');
  assert.equal(chooseCover({ assets: [a, b, c, unrelated] }, 'Life with Cats', [post(a.publicPath), post(b.publicPath)]), c);
});

test('Product photos rotate by usage without mixing models', () => {
  const assets = ['a', 'b', 'c'].map(name => ({ ...photo(name), model: 'c32' }));
  assets.push({ ...photo('other'), model: 'f20' });
  const selected = chooseProductImages({ assets }, 'c32', [post('', '/images/a /images/b /images/a')]);
  assert.deepEqual(selected.map(asset => asset.publicPath), ['/images/c', '/images/b']);
  assert.ok(selected.every(asset => asset.model === 'c32'));
});

test('Unpublished drafts do not consume the rotation pool', () => {
  const a = photo('a'), b = photo('b');
  assert.equal(chooseCover({ assets: [a, b] }, 'Life with Cats', [post(a.publicPath, '', true)]), a);
});
