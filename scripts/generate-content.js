import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { requestArticle, validateArticle, saveDraft, resolveConfig } from './content-core.js';
import { buildArticlePrompt, validateEditorialArticle } from './content-policy.js';
const root = fileURLToPath(new URL('../', import.meta.url));
const hasLocalFile = fs.existsSync(path.join(root, '.env'));
const local = hasLocalFile ? dotenv.parse(fs.readFileSync(path.join(root, '.env'))) : {};
const config = resolveConfig(local, process.env, hasLocalFile);
try {
  const sources = JSON.parse(fs.readFileSync(path.join(root, 'content/brand-sources.json'), 'utf8'));
  const sourceAge = Date.now() - Date.parse(sources.verifiedAt);
  if (!Number.isFinite(sourceAge) || sourceAge > 30 * 86400000) throw new Error('Brand sources need re-verification (older than 30 days)');
  const count = Number(config('POSTS_PER_RUN') || 1);
  if (!Number.isInteger(count) || count < 1 || count > 5) throw new Error('POSTS_PER_RUN must be 1-5');
  // The versioned editorial policy takes precedence over stale local/CI language settings.
  const prompt = buildArticlePrompt(sources, process.argv[2] || config('CONTENT_TOPIC') || 'Robotail litter boxes, feeding routines, and accessories for a cat-friendly home');
  for (let index = 0; index < count; index++) {
    const article = await requestArticle({
      apiKey: config('ANTHROPIC_API_KEY'), baseURL: config('ANTHROPIC_BASE_URL') || 'https://heyroute.ai',
      model: config('ANTHROPIC_MODEL') || 'claude-opus-4-8', prompt,
      onText: text => {
        fs.mkdirSync(path.join(root, '.local'), { recursive: true });
        fs.writeFileSync(path.join(root, '.local/last-api-response.txt'), text, { mode: 0o600 });
      }
    });
    validateArticle(article, sources);
    validateEditorialArticle(article);
    console.log('Draft saved: ' + saveDraft(article, path.join(root, 'blog/src/content/posts'), sources));
    fs.rmSync(path.join(root, '.local/last-api-response.txt'), { force: true });
  }
} catch (error) {
  console.error('Generation failed: ' + error.message);
  process.exitCode = 1;
}
