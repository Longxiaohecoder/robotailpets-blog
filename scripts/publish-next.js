import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import YAML from 'yaml';
import { validateEditorialArticle } from './content-policy.js';
import { approvedCandidate } from './weekly-editorial.js';
import { localDate, publicationTime, publicationDates } from './publication-schedule.js';

export function publicationSlot(now, plan) {
  const date = localDate(now, plan.timezone);
  const target = publicationTime(date, plan);
  return { date, due: target !== null && now >= target };
}

function readPost(target) {
  const match = fs.readFileSync(target, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) throw new Error('Invalid post frontmatter: ' + path.basename(target));
  return { metadata: YAML.parse(match[1]), body: match[2].trim() };
}

export async function publishNext({ root, now = new Date() }) {
  const readJSON = name => JSON.parse(fs.readFileSync(path.join(root, 'content', name), 'utf8'));
  const plan = readJSON('publication-plan.json');
  if (plan.requireApproval !== true) throw new Error('Human approval must be enabled');
  const history = readJSON('publication-history.json');
  const slot = publicationSlot(now, plan);
  if (!slot.due) return { status: 'skipped', reason: 'Outside scheduled publishing window' };
  if (publicationDates(history, plan.timezone).includes(slot.date)) {
    return { status: 'skipped', reason: 'Already published for ' + slot.date };
  }
  const approval = approvedCandidate(root, slot.date);
  if (!approval) return { status: 'skipped', reason: 'Waiting for human approval or scheduled publication date' };
  if (approval.item.scheduledAt && now < new Date(approval.item.scheduledAt)) return {status:'skipped', reason:'Waiting for approved publication instant'};
  const target = path.join(root, 'blog/src/content/posts', approval.item.file);
  const post = readPost(target);
  validateEditorialArticle({ ...post.metadata, content: post.body });
  if (!post.metadata.sources?.length || !post.body.includes('/images/products/')) {
    throw new Error('Scheduled articles require source links and product images');
  }
  if (post.metadata.cover && !fs.existsSync(path.join(root, 'blog/public', post.metadata.cover))) {
    throw new Error('Missing cover image: ' + post.metadata.cover);
  }
  for (const match of post.body.matchAll(/\/images\/[\w/.-]+/g)) {
    if (!fs.existsSync(path.join(root, 'blog/public', match[0]))) throw new Error('Missing image: ' + match[0]);
  }
  post.metadata.draft = false;
  post.metadata.pubDate = now.toISOString();
  post.metadata.reviewNote = `Approved batch ${approval.batch.id}, confirmed ${approval.batch.approvedAt}. Product information is source-backed; not hands-on testing.`;
  fs.writeFileSync(target, `---\n${YAML.stringify(post.metadata)}---\n\n${post.body}\n`);
  const entry = {
    date: slot.date, publishedAt: now.toISOString(), file: path.basename(target), title: post.metadata.title,
    batchId: approval.batch.id, approvedAt: approval.batch.approvedAt, scheduledFor: approval.item.scheduledFor,
    timezone: plan.timezone, scheduledAt: approval.item.scheduledAt || publicationTime(approval.item.scheduledFor, plan)?.toISOString()
  };
  history.publications.push(entry);
  fs.writeFileSync(path.join(root, 'content/publication-history.json'), JSON.stringify(history, null, 2) + '\n');
  return { status: 'published', ...entry };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const root = fileURLToPath(new URL('../', import.meta.url));
  try {
    const plan = JSON.parse(fs.readFileSync(path.join(root, 'content/publication-plan.json'), 'utf8'));
    const now = new Date();
    const target = publicationTime(localDate(now, plan.timezone), plan);
    const delay = target ? target - now : 0;
    // Cron has minute precision; wait only for the remainder of the target minute.
    if (delay > 0 && delay < 60000) await new Promise(resolve => setTimeout(resolve, delay));
    console.log(JSON.stringify(await publishNext({ root }), null, 2));
  }
  catch (error) { console.error('Publication failed: ' + error.message); process.exitCode = 1; }
}
