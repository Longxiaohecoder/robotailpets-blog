import test from 'node:test';
import assert from 'node:assert/strict';
import { buildArticlePrompt, validateEditorialArticle, editorialPolicy } from '../scripts/content-policy.js';

const article = { title: 'A Home with Cats', description: 'Little ideas for everyday life.', tags: ['Robotail', 'Cat-Friendly Homes'], content: 'Make room for your cat. [Robotail](https://robotailpets.com/)' };

test('editorial contract fixes English and cats for US and European readers', () => {
  assert.equal(editorialPolicy.language, 'en');
  assert.equal(editorialPolicy.animalFocus, 'cats');
  const prompt = buildArticlePrompt({ sources: [] }, 'Robotail 猫砂盆');
  assert.match(prompt, /English only/);
  assert.match(prompt, /Focus on cats, never dogs/);
  assert.match(prompt, /US and Europe/);
});

test('Chinese in public article fields is rejected before saving', () => {
  for (const field of ['title', 'description', 'content']) {
    assert.throws(() => validateEditorialArticle({ ...article, [field]: '中文' }), /English-only/);
  }
  assert.throws(() => validateEditorialArticle({ ...article, tags: ['猫咪'] }), /English-only/);
  assert.equal(validateEditorialArticle(article), article);
});

test('dog-focused copy is rejected, cat product names remain valid', () => {
  for (const animal of ['dog', 'dogs', 'puppy', 'puppies', 'canine']) {
    assert.throws(() => validateEditorialArticle({ ...article, content: `A home for your ${animal}.` }), /Cat-only/);
  }
  assert.equal(validateEditorialArticle({ ...article, content: 'UBPet Robotail F20 automatic pet feeder' }).title, article.title);
});
