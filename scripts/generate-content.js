import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { requestArticle, validateArticle, saveDraft, resolveConfig } from './content-core.js';
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
  const language = config('CONTENT_LANGUAGE') === 'en' ? 'English' : '简体中文';
  const prompt = '你是品牌编辑。为宠物主人写一篇约600字的品牌介绍草稿，语言为' + language + '。主题：' + (process.argv[2] || config('CONTENT_TOPIC') || 'Robotail 猫砂盆、喂食器及配件选购入口') + '。唯一允许使用的事实和规则：' + JSON.stringify(sources) + '。不要创造事实；选购建议明确是一般建议，不冒充实际功能。不要图片、未验证链接或亲身评测。严格使用下面格式，前3项各占一行，CONTENT 后另起一行开始 Markdown 正文，标签用竖线分隔。不要JSON，不要代码块，不要额外说明：\nTITLE: 标题\nDESCRIPTION: 简介\nTAGS: Robotail|宠物用品\nCONTENT:\n正文，必须包含来源链接。';
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
    console.log('Draft saved: ' + saveDraft(article, path.join(root, 'blog/src/content/posts'), sources));
    fs.rmSync(path.join(root, '.local/last-api-response.txt'), { force: true });
  }
} catch (error) {
  console.error('Generation failed: ' + error.message);
  process.exitCode = 1;
}
