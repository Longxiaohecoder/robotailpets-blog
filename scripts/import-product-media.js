import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

// Import the brand's original product photos, without generating or retouching them.
const project = fileURLToPath(new URL('../', import.meta.url));
const selections = [
  { model: 'c32', index: 0, name: 'c32-product' },
  { model: 'c32', index: 3, name: 'c32-open-top' },
  { model: 'c32', index: 1, name: 'c32-details' },
  { model: 'c42', index: 0, name: 'c42-product' },
  { model: 'c42', index: 1, name: 'c42-interior' },
  { model: 'f20', index: 0, name: 'f20-product' },
  { model: 'f20', index: 1, name: 'f20-routine' },
  { model: 'f20', index: 7, name: 'f20-app' },
];
const products = new Map();
const records = [];
await fs.mkdir(path.join(project, 'blog/public/images/products'), { recursive: true });
for (const selection of selections) {
  const page = `https://robotailpets.com/products/${selection.model}`;
  if (!products.has(selection.model)) {
    const response = await fetch(`${page}.js`, { signal: AbortSignal.timeout(30000) });
    if (!response.ok) throw new Error(`Product request failed: ${selection.model} HTTP ${response.status}`);
    products.set(selection.model, await response.json());
  }
  const product = products.get(selection.model);
  const original = product.images[selection.index];
  if (!original) throw new Error(`Missing image: ${selection.name}`);
  const source = new URL(original, page);
  if (source.hostname !== 'cdn.shopify.com') throw new Error('Unexpected image host');
  // Shopify serves a smaller rendition with the full composition preserved.
  const rendition = new URL(source);
  rendition.searchParams.set('width', '1200');
  const response = await fetch(rendition, { signal: AbortSignal.timeout(30000) });
  if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) {
    throw new Error(`Image request failed: ${selection.name} HTTP ${response.status}`);
  }
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length < 1000) throw new Error(`Empty image: ${selection.name}`);
  const extension = path.extname(source.pathname);
  if (!['.jpg', '.png', '.webp'].includes(extension)) throw new Error('Unsupported image format');
  const publicPath = `/images/products/${selection.name}${extension}`;
  await fs.writeFile(path.join(project, 'blog/public', publicPath), bytes);
  records.push({ model: selection.model, sourcePage: page, sourceImage: source.href,
    requestedRendition: rendition.href, publicPath, bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'), review: 'Requires visual selection before use' });
  console.log(`${selection.name}: ${bytes.length} bytes`);
}
await fs.writeFile(path.join(project, 'content/product-media.json'), JSON.stringify({
  retrievedAt: new Date().toISOString(), permission: 'User authorized reuse of brand website and Amazon product images on 2026-10-12.',
  editing: 'Shopify width rendition only; no retouching, added text, or product alteration.', assets: records,
}, null, 2) + '\n');
