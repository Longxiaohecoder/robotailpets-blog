import fs from 'node:fs';
import dotenv from 'dotenv';
import { resolveConfig } from './content-core.js';
const envPath = new URL('../.env', import.meta.url);
const local = fs.existsSync(envPath) ? dotenv.parse(fs.readFileSync(envPath)) : {};
const config = resolveConfig(local, process.env, fs.existsSync(envPath));
try {
  const apiKey = config('ANTHROPIC_API_KEY');
  if (!apiKey) throw new Error('ANTHROPIC_API_KEY is missing');
  const endpoint = new URL(config('ANTHROPIC_BASE_URL') || 'https://heyroute.ai');
  if (endpoint.protocol !== 'https:') throw new Error('API endpoint must use HTTPS');
  endpoint.pathname = endpoint.pathname.replace(/\/$/, '').replace(/\/v1$/, '') + '/v1/models';
  const response = await fetch(endpoint, {
    headers: { Authorization: 'Bearer ' + apiKey },
    signal: AbortSignal.timeout(20000), redirect: 'error'
  });
  if (!response.ok) throw new Error('Model listing HTTP ' + response.status);
  const result = await response.json();
  const ids = result.data?.map(model => model.id) || [];
  const model = config('ANTHROPIC_MODEL') || 'claude-opus-4-8';
  console.log('Configured model listed: ' + ids.includes(model));
  console.log('This read-only check does not verify generation or balance. Use generate for an end-to-end test.');
} catch (error) {
  console.error('API check failed: ' + error.message);
  process.exitCode = 1;
}
