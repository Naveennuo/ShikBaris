#!/usr/bin/env node

import { createWriteStream } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { setTimeout as delay } from 'node:timers/promises';

const API_URL = 'https://www.googleapis.com/customsearch/v1';
const DEFAULT_PLACES_FILE = 'scripts/places.txt';
const DEFAULT_OUT_DIR = 'downloaded-images';
const DEFAULT_PER_PLACE = 3;

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

const apiKey = process.env.GOOGLE_API_KEY;
const searchEngineId = process.env.GOOGLE_CSE_ID || process.env.GOOGLE_SEARCH_ENGINE_ID;

if (!apiKey || !searchEngineId) {
  console.error(
    'Missing GOOGLE_API_KEY or GOOGLE_CSE_ID. Set them in your shell before running this script.'
  );
  process.exit(1);
}

const placesFile = args.places || DEFAULT_PLACES_FILE;
const outDir = args.out || DEFAULT_OUT_DIR;
const perPlace = asPositiveInt(args['per-place'], DEFAULT_PER_PLACE);
const querySuffix = args['query-suffix'] || 'tourist place';
const pauseMs = asPositiveInt(args.pause, 300);
const safe = args.safe || 'active';
const imgSize = args['img-size'] || 'large';
const imgType = args['img-type'] || 'photo';
const rights = args.rights;
const overwrite = Boolean(args.overwrite);

const places = await loadPlaces(placesFile);

if (!places.length) {
  console.error(`No places found in ${placesFile}. Add one place name per line.`);
  process.exit(1);
}

await mkdir(outDir, { recursive: true });

let totalDownloaded = 0;

for (const place of places) {
  const query = querySuffix ? `${place} ${querySuffix}` : place;
  const placeDir = path.join(outDir, slugify(place));
  await mkdir(placeDir, { recursive: true });

  console.log(`\nSearching: ${query}`);
  const results = await searchImages({
    apiKey,
    searchEngineId,
    query,
    total: perPlace,
    safe,
    imgSize,
    imgType,
    rights,
  });

  const metadata = [];
  let downloadedForPlace = 0;

  for (const [index, item] of results.entries()) {
    const target = await buildTargetPath(placeDir, place, index + 1, item, overwrite);

    if (!target) {
      metadata.push(toMetadata(item, null, 'skipped-existing'));
      continue;
    }

    try {
      await downloadImage(item.link, target);
      downloadedForPlace += 1;
      totalDownloaded += 1;
      metadata.push(toMetadata(item, target, 'downloaded'));
      console.log(`  saved ${path.relative(process.cwd(), target)}`);
      await delay(pauseMs);
    } catch (error) {
      metadata.push(toMetadata(item, target, `failed: ${error.message}`));
      console.warn(`  failed ${item.link}: ${error.message}`);
    }
  }

  await writeFile(
    path.join(placeDir, 'metadata.json'),
    JSON.stringify({ place, query, downloadedAt: new Date().toISOString(), results: metadata }, null, 2)
  );

  console.log(`Done: ${place} (${downloadedForPlace}/${results.length} downloaded)`);
}

console.log(`\nFinished. Downloaded ${totalDownloaded} image(s) into ${outDir}.`);

function parseArgs(argv) {
  const parsed = {};

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--help' || arg === '-h') {
      parsed.help = true;
      continue;
    }

    if (!arg.startsWith('--')) {
      continue;
    }

    const [rawKey, inlineValue] = arg.slice(2).split('=');
    const nextValue = argv[index + 1];

    if (inlineValue !== undefined) {
      parsed[rawKey] = inlineValue;
    } else if (nextValue && !nextValue.startsWith('--')) {
      parsed[rawKey] = nextValue;
      index += 1;
    } else {
      parsed[rawKey] = true;
    }
  }

  return parsed;
}

async function loadPlaces(filePath) {
  const content = await readFile(filePath, 'utf8');

  return content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'));
}

async function searchImages({
  apiKey,
  searchEngineId,
  query,
  total,
  safe,
  imgSize,
  imgType,
  rights,
}) {
  const items = [];

  for (let start = 1; items.length < total && start <= 91; start += 10) {
    const params = new URLSearchParams({
      key: apiKey,
      cx: searchEngineId,
      q: query,
      searchType: 'image',
      num: String(Math.min(10, total - items.length)),
      start: String(start),
      safe,
      imgSize,
      imgType,
    });

    if (rights) {
      params.set('rights', rights);
    }

    const response = await fetch(`${API_URL}?${params.toString()}`);
    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = body?.error?.message || `${response.status} ${response.statusText}`;
      throw new Error(`Google Custom Search API error: ${message}`);
    }

    if (!body.items?.length) {
      break;
    }

    items.push(...body.items);
  }

  return items.slice(0, total);
}

async function buildTargetPath(placeDir, place, index, item, overwrite) {
  const ext = extensionFromItem(item);
  const fileName = `${String(index).padStart(2, '0')}-${slugify(place)}${ext}`;
  const target = path.join(placeDir, fileName);

  if (overwrite) {
    return target;
  }

  try {
    await readFile(target);
    return null;
  } catch {
    return target;
  }
}

async function downloadImage(url, target) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 image-downloader/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') || '';

    if (!contentType.startsWith('image/')) {
      throw new Error(`not an image (${contentType || 'unknown content type'})`);
    }

    await pipeline(response.body, createWriteStream(target));
  } finally {
    clearTimeout(timeout);
  }
}

function extensionFromItem(item) {
  const mime = item.mime || '';
  const byMime = {
    'image/jpeg': '.jpg',
    'image/jpg': '.jpg',
    'image/png': '.png',
    'image/webp': '.webp',
    'image/gif': '.gif',
    'image/avif': '.avif',
  };

  if (byMime[mime]) {
    return byMime[mime];
  }

  try {
    const ext = path.extname(new URL(item.link).pathname).toLowerCase();
    return ext && ext.length <= 6 ? ext : '.jpg';
  } catch {
    return '.jpg';
  }
}

function toMetadata(item, localPath, status) {
  return {
    title: item.title,
    sourcePage: item.image?.contextLink,
    imageUrl: item.link,
    thumbnailUrl: item.image?.thumbnailLink,
    width: item.image?.width,
    height: item.image?.height,
    localPath: localPath ? path.relative(process.cwd(), localPath) : null,
    status,
  };
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function asPositiveInt(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function printHelp() {
  console.log(`
Download place images with Google Custom Search JSON API.

Required environment variables:
  GOOGLE_API_KEY   Google API key
  GOOGLE_CSE_ID    Programmable Search Engine ID

Usage:
  npm run download:images -- --places scripts/places.txt --out src/assets/downloaded --per-place 3

Options:
  --places <file>        Text file with one place per line. Default: ${DEFAULT_PLACES_FILE}
  --out <dir>            Output directory. Default: ${DEFAULT_OUT_DIR}
  --per-place <number>   Images to download for each place. Default: ${DEFAULT_PER_PLACE}
  --query-suffix <text>  Extra words added to each search. Default: tourist place
  --safe <value>         Google safe search value. Default: active
  --img-size <value>     icon, small, medium, large, xlarge, xxlarge, huge. Default: large
  --img-type <value>     photo, clipart, lineart, face, animated, stock. Default: photo
  --rights <value>       Optional license filter, e.g. cc_publicdomain or cc_attribute
  --overwrite            Replace existing numbered files
`);
}
