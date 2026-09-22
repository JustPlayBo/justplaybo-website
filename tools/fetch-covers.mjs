/**
 * Builds src/assets/covers.json — the BGG id → cover image URL map the games
 * shelf renders. BGG's API sends no CORS header, so the browser cannot do this
 * itself; run this script whenever the sheet gains games without artwork.
 *
 *   docker run --rm -v $(pwd):/app -w /app node:22-alpine node tools/fetch-covers.mjs
 *
 * Pass --refresh to re-fetch ids that are already in the map.
 */
import { readFile, writeFile } from 'node:fs/promises';

const SERVICE = 'src/app/list.service.ts';
const OUT = 'src/assets/covers.json';
const API = 'https://api.geekdo.com/api/geekitems?objecttype=thing&objectid=';
const CONCURRENCY = 4;
const PAUSE_MS = 120;

const refresh = process.argv.includes('--refresh');

// The sheet URL lives in the service; read it from there so the two can't drift.
const service = await readFile(SERVICE, 'utf8');
const listUrl = service.match(/listUrl = '([^']+)'/)?.[1];
if (!listUrl) throw new Error(`No listUrl found in ${SERVICE}`);

const csv = await fetch(listUrl).then(r => r.text());
const ids = [...new Set([...csv.matchAll(/\/boardgame(?:expansion)?\/(\d+)/g)].map(m => m[1]))];

const covers = JSON.parse(await readFile(OUT, 'utf8').catch(() => '{}'));
const todo = refresh ? ids : ids.filter(id => !covers[id]);
console.log(`${ids.length} games in the sheet, ${todo.length} to fetch`);

let done = 0;
const failed = [];

async function cover(id) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(API + id, { headers: { 'User-Agent': 'justplaybo-website cover fetch' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const item = (await res.json()).item;
      // fit-in/300x320, which is the largest size that stays light enough to
      // lazy-load ~700 of them.
      const url = item?.images?.previewthumb || item?.imageurl;
      if (url) covers[id] = url;
      else failed.push(`${id} (no image)`);
      return;
    } catch (err) {
      if (attempt === 3) failed.push(`${id} (${err.message})`);
      else await new Promise(r => setTimeout(r, attempt * 1000));
    }
  }
}

async function worker(queue) {
  while (queue.length) {
    await cover(queue.pop());
    if (++done % 50 === 0) console.log(`  ${done}/${todo.length}`);
    await new Promise(r => setTimeout(r, PAUSE_MS));
  }
}

const queue = [...todo];
await Promise.all(Array.from({ length: CONCURRENCY }, () => worker(queue)));

const sorted = Object.fromEntries(Object.keys(covers).sort((a, b) => a - b).map(id => [id, covers[id]]));
await writeFile(OUT, JSON.stringify(sorted, null, 0) + '\n');
console.log(`Wrote ${OUT}: ${Object.keys(sorted).length} covers`);
if (failed.length) console.log(`No cover for ${failed.length}: ${failed.join(', ')}`);
