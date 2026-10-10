import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import YAML from 'yaml';
import { editorialPolicy } from './content-policy.js';

export function resolveConfig(local, environment, hasLocalFile) {
  // 本地项目与 CI 是两个完整配置来源，禁止拼接不同供应商的端点和模型。
  return name => hasLocalFile ? local[name] : environment[name];
}

export function validateArticle(article, sources) {
  if (!article || typeof article !== 'object') throw new Error('Article must be an object');
  for (const field of ['title', 'description', 'content']) {
    if (typeof article[field] !== 'string' || !article[field].trim()) throw new Error(`Missing article ${field}`);
  }
  if (!Array.isArray(article.tags) || !article.tags.every(tag => typeof tag === 'string')) throw new Error('Invalid tags');
  const allowed = new Set(sources.sources.map(source => source.url));
  const links = [...article.content.matchAll(/\]\((https?:\/\/[^\s)]+)\)/g)].map(match => match[1]);
  if (links.length === 0 || links.some(link => !allowed.has(link))) throw new Error('Article must cite verified sources only');
  if (/YOUR_STORE_ID|via\.placeholder|\{\{IMAGE:/.test(article.content)) throw new Error('Unresolved placeholder');
  return article;
}

export async function requestArticle({ apiKey, baseURL, model, prompt, fetchImpl = fetch, onText }) {
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is missing');
  const endpoint = new URL(baseURL);
  if (endpoint.protocol !== 'https:') throw new Error('API endpoint must use HTTPS');
  endpoint.pathname = endpoint.pathname.replace(/\/$/, '').replace(/\/v1$/, '') + '/v1/messages';
  const response = await fetchImpl(endpoint, {
    method: 'POST', redirect: 'error', signal: AbortSignal.timeout(120000),
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}`, 'anthropic-version': '2023-06-01' },
    body: JSON.stringify({ model, max_tokens: 4096, messages: [{ role: 'user', content: prompt }] })
  });
  if (!response.ok) throw new Error(`API HTTP ${response.status}${response.status === 402 ? ': insufficient balance' : ''}`);
  const data = await response.json();
  if (data.stop_reason === 'max_tokens') throw new Error('API output truncated; article was not saved');
  const content = data.content?.filter(block => block.type === 'text').map(block => block.text).join('\n');
  if (!content) throw new Error('API returned no text');
  onText?.(content);
  const text = content.replace(/\r\n/g, '\n').trim().replace(/^```(?:json|markdown)?\s*/i, '').replace(/\s*```$/, '');
  // Markdown 正文不放入 JSON 字符串，避免中转模型漏转义引号导致整篇丢失。
  const framed = text.match(/^TITLE:\s*([^\n]+)\n\s*DESCRIPTION:\s*([^\n]+)\n\s*TAGS:\s*([^\n]+)\n\s*CONTENT:\s*([\s\S]+)$/);
  if (framed) return { title: framed[1].trim(), description: framed[2].trim(), tags: framed[3].split('|').map(tag => tag.trim()).filter(Boolean), content: framed[4].trim() };
  return JSON.parse(text);
}

export function saveDraft(article, postsDir, sources) {
  fs.mkdirSync(postsDir, { recursive: true });
  const now = new Date();
  const filename = `${now.toISOString().slice(0, 10)}-robotail-${randomUUID().slice(0, 8)}.md`;
  const metadata = {
    title: article.title, description: article.description, tags: article.tags,
    pubDate: now.toISOString(), author: editorialPolicy.author, draft: true,
    sources: sources.sources.map(source => source.url), sourceVerifiedAt: sources.verifiedAt,
    reviewNote: 'AI draft: verify all product facts and sources before setting draft to false.'
  };
  const target = path.join(postsDir, filename);
  fs.writeFileSync(target, `---\n${YAML.stringify(metadata)}---\n\n${article.content}\n`, { flag: 'wx' });
  return target;
}
