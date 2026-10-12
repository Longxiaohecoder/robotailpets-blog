import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import YAML from 'yaml';
import dotenv from 'dotenv';
import { requestArticle, validateArticle, saveDraft, resolveConfig } from './content-core.js';
import { buildArticlePrompt, validateEditorialArticle } from './content-policy.js';

export function publicationSlot(now, plan) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', {
    timeZone: plan.timezone, year: 'numeric', month: '2-digit', day: '2-digit',
    weekday: 'short', hour: '2-digit', hourCycle: 'h23'
  }).formatToParts(now).map(part => [part.type, part.value]));
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    due: plan.weekdays.includes(parts.weekday) && Number(parts.hour) >= plan.hour
  };
}

function readPost(target) {
  const match = fs.readFileSync(target, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error('Invalid post frontmatter: ' + path.basename(target));
  return { metadata: YAML.parse(match[1]), body: match[2].trim() };
}

const topics = [
  ['c32', 'Planning an open-top litter area in a small apartment', 'Cat-Friendly Homes'],
  ['f20', 'Setting up a shared wet-food feeding routine with the F20', 'Life with Cats'],
  ['c42', 'Planning access and cleaning space around the C42', 'Cat-Friendly Homes'],
  ['c32', 'Organizing litter supplies around the C32 without hiding the equipment', 'Cat-Friendly Homes'],
  ['f20', 'What to prepare before setting up the F20: placement, Wi-Fi and cleaning', 'Product Guides'],
  ['c42', 'Questions to ask before choosing a roller-style litter box', 'Product Guides'],
  ['c32', 'Sharing everyday litter-box upkeep between people at home', 'Life with Cats'],
  ['f20', 'Building a simple F20 tray-cleaning and feeding checklist', 'Life with Cats'],
  ['c42', 'A calm home layout that leaves room for the cat and the C42', 'Cat-Friendly Homes']
];

export async function publishNext({ root, now = new Date(), generateArticle }) {
  const readJSON = name => JSON.parse(fs.readFileSync(path.join(root, 'content', name), 'utf8'));
  const plan = readJSON('publication-plan.json');
  const history = readJSON('publication-history.json');
  const slot = publicationSlot(now, plan);
  if (!slot.due) return { status: 'skipped', reason: 'Outside scheduled publishing window' };
  if (history.publications.some(entry => entry.date === slot.date)) {
    return { status: 'skipped', reason: 'Already published for ' + slot.date };
  }
  const postsDir = path.join(root, 'blog/src/content/posts');
  let target = plan.queue.map(name => path.join(postsDir, name))
    .find(file => readPost(file).metadata.draft === true);
  if (!target) {
    const sources = readJSON('brand-sources.json');
    // Reuse the saved brand facts and approved images; no recurring source-age approval gate.
    const [model, topic, category] = topics[history.publications.length % topics.length];
    const titles = fs.readdirSync(postsDir).filter(name => name.endsWith('.md'))
      .map(name => readPost(path.join(postsDir, name)).metadata.title);
    const prompt = buildArticlePrompt(sources, topic) +
      '\nCreate a distinct, practical angle. Do not repeat these existing titles: ' + JSON.stringify(titles);
    const article = await generateArticle(prompt);
    validateArticle(article, sources);
    validateEditorialArticle(article);
    const assets = readJSON('product-media.json').assets.filter(asset => asset.model === model).slice(0, 2);
    if (!assets.length) throw new Error('No approved product image for ' + model);
    article.content += '\n\n## A closer look\n\n' + assets.map(asset =>
      `![Official Robotail ${model.toUpperCase()} product image](${asset.publicPath})\n\n` +
      `Product image from the [official Robotail ${model.toUpperCase()} website](${asset.sourcePage}).`
    ).join('\n\n');
    target = saveDraft(article, postsDir, sources);
    const post = readPost(target);
    post.metadata.category = category;
    post.metadata.cover = '/images/journal/home-with-cats.webp';
    post.metadata.coverAlt = 'People and cats sharing a warm, welcoming home';
    fs.writeFileSync(target, `---\n${YAML.stringify(post.metadata)}---\n\n${post.body}\n`);
  }
  const post = readPost(target);
  validateEditorialArticle({ ...post.metadata, content: post.body });
  if (!post.metadata.sources?.length || !post.body.includes('/images/products/')) {
    throw new Error('Scheduled articles require source links and product images');
  }
  for (const match of post.body.matchAll(/\/images\/[\w/.-]+/g)) {
    if (!fs.existsSync(path.join(root, 'blog/public', match[0]))) throw new Error('Missing image: ' + match[0]);
  }
  post.metadata.draft = false;
  post.metadata.pubDate = now.toISOString();
  post.metadata.reviewNote = 'Automatically published under the owner authorization of October 12, 2026. Product information uses saved brand sources; not hands-on testing.';
  fs.writeFileSync(target, `---\n${YAML.stringify(post.metadata)}---\n\n${post.body}\n`);
  const entry = { date: slot.date, publishedAt: now.toISOString(), file: path.basename(target), title: post.metadata.title };
  history.publications.push(entry);
  fs.writeFileSync(path.join(root, 'content/publication-history.json'), JSON.stringify(history, null, 2) + '\n');
  return { status: 'published', ...entry };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const localFile = path.join(root, '.env');
  const hasLocalFile = fs.existsSync(localFile);
  const config = resolveConfig(hasLocalFile ? dotenv.parse(fs.readFileSync(localFile)) : {}, process.env, hasLocalFile);
  try {
    console.log(JSON.stringify(await publishNext({ root, generateArticle: prompt => requestArticle({
      apiKey: config('ANTHROPIC_API_KEY'), baseURL: config('ANTHROPIC_BASE_URL') || 'https://heyroute.ai',
      model: config('ANTHROPIC_MODEL') || 'claude-opus-4-8', prompt
    }) }), null, 2));
  } catch (error) {
    console.error('Publication failed: ' + error.message);
    process.exitCode = 1;
  }
}
