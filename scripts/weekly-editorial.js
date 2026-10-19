import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';
import YAML from 'yaml';
import { validateArticle } from './content-core.js';
import { validateEditorialArticle } from './content-policy.js';

const hash = value => createHash('sha256').update(value).digest('hex');
const jsonPath = root => path.join(root, 'content/editorial-batches.json');
export function readBatches(root) {
  return JSON.parse(fs.readFileSync(jsonPath(root), 'utf8'));
}
export function readEditorialPost(root, file) {
  if (path.basename(file) !== file || !file.endsWith('.md')) throw new Error('Invalid article filename');
  const raw = fs.readFileSync(path.join(root, 'blog/src/content/posts', file), 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error('Invalid article frontmatter: ' + file);
  return { metadata: YAML.parse(match[1]), body: match[2].trim(), raw };
}
export function articleDigest(root, file) {
  const post = readEditorialPost(root, file);
  const paths = [...new Set([post.metadata.cover, ...[...post.body.matchAll(/\/images\/[\w/.-]+/g)].map(m => m[0])].filter(Boolean))].sort();
  const images = paths.map(src => {
    if (!/^\/images\/[\w/.-]+$/.test(src) || src.includes('..')) throw new Error('Invalid image path');
    return [src, hash(fs.readFileSync(path.join(root, 'blog/public', src)))];
  });
  return hash(post.raw + '\n' + JSON.stringify(images));
}
function researchPath(root, relative) {
  const target = path.resolve(root, relative);
  if (!target.startsWith(path.join(root, 'content') + path.sep) || !relative.endsWith('.json')) {
    throw new Error('Research must be a JSON file inside content/');
  }
  return target;
}
export function beijingDate(now) {
  const parts = Object.fromEntries(new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now).map(p => [p.type, p.value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}
export function weekOf(now) {
  const local = new Date(beijingDate(now) + 'T00:00:00Z');
  local.setUTCDate(local.getUTCDate() - (local.getUTCDay() + 6) % 7);
  return local.toISOString().slice(0, 10);
}
// Friday preparation belongs to the following publication week, not the week ending.
export function editorialWeekOf(now) {
  const local = new Date(beijingDate(now) + 'T00:00:00Z');
  if ([5, 6, 0].includes(local.getUTCDay())) {
    local.setUTCDate(local.getUTCDate() + (8 - local.getUTCDay()) % 7);
    return local.toISOString().slice(0, 10);
  }
  return weekOf(now);
}
export function releaseDates(now, plan, history, reserved = [], count = 3) {
  const occupied = new Set([...history.publications.map(p => p.date), ...reserved]);
  const start = new Date(beijingDate(now) + 'T00:00:00Z');
  const dates = [];
  for (let i = 0; i < 366 && dates.length < count; i++) {
    const date = new Date(start);
    date.setUTCDate(date.getUTCDate() + i);
    const day = date.toISOString().slice(0, 10);
    const weekday = date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
    const releaseAt = new Date(`${day}T${String(plan.hour).padStart(2, '0')}:00:00+08:00`);
    if (plan.weekdays.includes(weekday) && releaseAt >= now && !occupied.has(day)) dates.push(day);
  }
  if (dates.length !== count) throw new Error('Unable to allocate publication dates');
  return dates;
}
export function prepareBatch({ root, researchFile, files, summaries = [], now = new Date() }) {
  if (files.length !== 3 || new Set(files).size !== 3) throw new Error('A weekly batch requires exactly three distinct drafts');
  const researchRaw = fs.readFileSync(researchPath(root, researchFile), 'utf8');
  const research = JSON.parse(researchRaw);
  if (!research.verifiedAt || !Array.isArray(research.sources) || !research.sources.length) throw new Error('Research requires dated, verified sources');
  const items = files.map((file, i) => {
    const post = readEditorialPost(root, file);
    if (post.metadata.draft !== true || !post.metadata.cover || !post.metadata.sources?.length) throw new Error('Review requires illustrated source-backed drafts: ' + file);
    const article = { ...post.metadata, content: post.body };
    validateArticle(article, research);
    validateEditorialArticle(article);
    if (!post.body.includes('/images/products/')) throw new Error('Review requires original product images: ' + file);
    return { file, title: post.metadata.title, summary: summaries[i] || post.metadata.description, sha256: articleDigest(root, file) };
  });
  const state = readBatches(root);
  const id = editorialWeekOf(now);
  const existing = state.batches.find(batch => batch.id === id);
  const researchSha256 = hash(researchRaw);
  if (existing && existing.researchSha256 === researchSha256 && JSON.stringify(existing.items.map(item => item.sha256)) === JSON.stringify(items.map(item => item.sha256))) {
    return { status: 'existing', batch: existing };
  }
  if (existing?.status === 'approved') throw new Error('An approved batch cannot be silently replaced; revoke its approval before revision');
  const reviewFile = `content/reviews/${id}.md`;
  const batch = { id, status: 'pending', preparedAt: now.toISOString(), researchFile, researchSha256, reviewFile, items };
  if (existing) state.batches[state.batches.indexOf(existing)] = batch;
  else state.batches.push(batch);
  const review = [`# Robotail 周度博客待确认：${id}`, '', '本批三篇均未公开发布。请阅读正文及配图，回复“确认 ' + id + ' 这三篇”后才会部署并排期。', '', '如修改正文、来源或图片，需要确认修改后的版本。', ''];
  for (const [i, item] of items.entries()) {
    const post = readEditorialPost(root, item.file);
    const imagePath = path.join(root, 'blog/public', post.metadata.cover);
    const body = post.body.replace(/\/images\/[\w/.-]+/g, src => path.join(root, 'blog/public', src));
    review.push(`## ${i + 1}. ${item.title}`, '', item.summary, '', `确认版本：\`${item.sha256.slice(0, 12)}\``, '', `![${post.metadata.coverAlt || item.title}](${imagePath})`, '', body, '', '来源：', '', ...post.metadata.sources.map(url => `- [${url}](${url})`), '', '---', '');
  }
  fs.mkdirSync(path.join(root, 'content/reviews'), { recursive: true });
  fs.writeFileSync(path.join(root, reviewFile), review.join('\n'));
  fs.writeFileSync(jsonPath(root), JSON.stringify(state, null, 2) + '\n');
  return { status: 'prepared', batch };
}
export function approveBatch({ root, id, confirmation, now = new Date() }) {
  if (!confirmation?.trim()) throw new Error('Explicit human confirmation is required');
  const state = readBatches(root);
  const batch = state.batches.find(batch => batch.id === id);
  if (!batch) throw new Error('Unknown editorial batch');
  if (batch.status === 'approved') return { status: 'already-approved', batch };
  if (batch.status !== 'pending' || batch.items.length !== 3) throw new Error('Batch is not ready for approval');
  if (hash(fs.readFileSync(researchPath(root, batch.researchFile))) !== batch.researchSha256) throw new Error('Research changed after review; prepare a new version');
  for (const item of batch.items) {
    if (readEditorialPost(root, item.file).metadata.draft !== true || articleDigest(root, item.file) !== item.sha256) throw new Error('Article or image changed after review: ' + item.file);
  }
  const plan = JSON.parse(fs.readFileSync(path.join(root, 'content/publication-plan.json'), 'utf8'));
  if (plan.timezone !== 'Asia/Shanghai' || plan.requireApproval !== true) throw new Error('Approval-based Beijing publishing must be enabled');
  const history = JSON.parse(fs.readFileSync(path.join(root, 'content/publication-history.json'), 'utf8'));
  const reserved = state.batches.filter(b => b.status === 'approved').flatMap(b => b.items.filter(item => readEditorialPost(root, item.file).metadata.draft === true).map(item => item.scheduledFor));
  const dates = releaseDates(now, plan, history, reserved, batch.items.length);
  batch.items.forEach((item, i) => { item.scheduledFor = dates[i]; });
  batch.status = 'approved';
  batch.approvedAt = now.toISOString();
  batch.confirmation = confirmation.trim();
  fs.writeFileSync(jsonPath(root), JSON.stringify(state, null, 2) + '\n');
  return { status: 'approved', batch };
}
export function approvedCandidate(root, date) {
  const state = readBatches(root);
  const candidates = state.batches.filter(batch => batch.status === 'approved' && batch.approvedAt && batch.confirmation)
    .flatMap(batch => batch.items.map(item => ({ batch, item })))
    .filter(({ item }) => /^\d{4}-\d{2}-\d{2}$/.test(item.scheduledFor || '') && item.scheduledFor <= date)
    .sort((a, b) => a.item.scheduledFor.localeCompare(b.item.scheduledFor));
  for (const candidate of candidates) {
    const { batch, item } = candidate;
    if (readEditorialPost(root, item.file).metadata.draft !== true) continue;
    if (hash(fs.readFileSync(researchPath(root, batch.researchFile))) !== batch.researchSha256 || articleDigest(root, item.file) !== item.sha256) throw new Error('Approved content changed; new confirmation required: ' + item.file);
    return candidate;
  }
  return null;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  try {
    const [command, ...args] = process.argv.slice(2);
    let result;
    if (command === 'prepare') {
      const [researchFile, ...files] = args;
      result = prepareBatch({ root, researchFile, files });
    } else if (command === 'approve') {
      result = approveBatch({ root, id: args[0], confirmation: args.slice(1).join(' ') });
    } else if (command === 'status') result = readBatches(root);
    else throw new Error('Usage: weekly-editorial.js prepare content/research/YYYY-MM-DD.json file1.md file2.md file3.md | approve YYYY-MM-DD "human confirmation" | status');
    console.log(JSON.stringify(result, null, 2));
  } catch (error) { console.error('Editorial batch: ' + error.message); process.exitCode = 1; }
}
