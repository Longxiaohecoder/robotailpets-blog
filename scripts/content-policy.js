import fs from 'node:fs';

export const editorialPolicy = JSON.parse(fs.readFileSync(new URL('../content/editorial-policy.json', import.meta.url), 'utf8'));

export function buildArticlePrompt(sources, topic) {
  return [
    'You are the editor of the Robotail Journal.',
    `Editorial policy: ${JSON.stringify(editorialPolicy)}.`,
    'Write a source-backed draft of approximately 600 English words for cat owners in the US and Europe.',
    'Write every title, description, tag, heading, link label, and paragraph in English only. Focus on cats, never dogs or other animals.',
    `Topic (interpret in English): ${topic}.`,
    `The only permitted product facts and source rules are: ${JSON.stringify(sources)}.`,
    'Do not invent facts, specifications, personal testing, images, unverified links, regional availability, or currency-specific prices.',
    'Clearly identify shopping considerations as general advice, not verified product features.',
    'Use this exact Markdown frame, with each of the first three fields on one line, pipe-separated English tags, and a Markdown body after CONTENT. No JSON, code fences, or extra commentary:',
    'TITLE: English title',
    'DESCRIPTION: English summary',
    'TAGS: Robotail|Product Guides',
    'CONTENT:',
    'English Markdown body, including verified source links.'
  ].join('\n');
}

export function validateEditorialArticle(article) {
  const text = [article.title, article.description, ...(article.tags || []), article.content].join('\n');
  if (/\p{Script=Han}/u.test(text)) throw new Error('English-only journal: Chinese text was not saved');
  if (/\b(?:dogs?|canines?|pupp(?:y|ies))\b/i.test(text)) throw new Error('Cat-only journal: non-cat content was not saved');
  return article;
}
