#!/usr/bin/env node

import { createWriteStream } from "node:fs";
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { setTimeout as delay } from "node:timers/promises";

const OUT_ROOT = "src/assets/goa";
const DISTRICT_DIR = "1district";
const PAUSE_MS = 3000;
const RETRY_DELAYS_MS = [5000, 15000, 30000];
const COMMONS_API = "https://commons.wikimedia.org/w/api.php";

const districts = [
  {
    title: "Panaji",
    bannerQuery: "Fontainhas Panaji",
    sights: [
      ["Miramar Beach", "Miramar Beach Goa"],
      ["Dona Paula", "Dona Paula Goa"],
      ["Fontainhas", "Fontainhas Panaji"],
      ["Basilica of Bom Jesus", "Basilica of Bom Jesus"],
    ],
  },
  {
    title: "Calangute",
    bannerQuery: "Calangute Beach",
    sights: [
      ["Calangute Beach", "Calangute Beach"],
      ["Baga Beach", "Baga Beach"],
      ["Candolim Beach", "Candolim Beach"],
      ["Fort Aguada", "Fort Aguada"],
    ],
  },
  {
    title: "Anjuna",
    bannerQuery: "Anjuna Beach",
    sights: [
      ["Anjuna Beach", "Anjuna Beach"],
      ["Vagator Beach", "Vagator Beach"],
      ["Chapora Fort", "Chapora Fort"],
      ["Ozran Beach", "Ozran Beach Goa"],
    ],
  },
  {
    title: "Margao",
    bannerQuery: "Colva Beach",
    sights: [
      ["Colva Beach", "Colva Beach"],
      ["Benaulim Beach", "Benaulim Beach"],
      ["Varca Beach", "Varca Beach"],
      ["Mobor Beach", "Mobor Beach Goa"],
    ],
  },
  {
    title: "Palolem",
    bannerQuery: "Palolem Beach",
    sights: [
      ["Palolem Beach", "Palolem Beach"],
      ["Butterfly Beach", "Butterfly Beach Goa"],
      ["Agonda Beach", "Agonda Beach"],
      ["Cabo de Rama Fort", "Cabo de Rama Fort"],
    ],
  },
  {
    title: "Ponda",
    bannerQuery: "Shri Mangueshi Temple",
    sights: [
      ["Shri Mangueshi Temple", "Shri Mangeshi Temple"],
      ["Shri Shantadurga Temple", "Shanta Durga Temple Goa"],
      ["Sahakari Spice Farm", "Sahakari Spice Farm"],
      ["Dudhsagar Falls", "Dudhsagar Falls"],
    ],
  },
];

await mkdir(path.join(OUT_ROOT, DISTRICT_DIR), { recursive: true });

const metadata = [];

for (const district of districts) {
  const districtSlug = createSlug(district.title);
  const districtPath = path.join(OUT_ROOT, districtSlug);

  await mkdir(districtPath, { recursive: true });

  await saveImage({
    title: district.title,
    query: district.bannerQuery,
    targetBase: path.join(OUT_ROOT, DISTRICT_DIR, districtSlug),
    metadata,
  });

  for (const [title, query] of district.sights) {
    await saveImage({
      title,
      query,
      targetBase: path.join(districtPath, title),
      metadata,
    });
  }
}

await writeFile(
  path.join(OUT_ROOT, "wikimedia-download-metadata.json"),
  JSON.stringify({ downloadedAt: new Date().toISOString(), assets: metadata }, null, 2)
);

const downloaded = metadata.filter((entry) => entry.status === "downloaded").length;
const skipped = metadata.filter((entry) => entry.status === "exists").length;
const failed = metadata.filter((entry) => entry.status === "failed").length;

console.log(`Finished Goa images: ${downloaded} downloaded, ${skipped} existing, ${failed} failed.`);

async function saveImage({ title, query, targetBase, metadata }) {
  const existing = await findExisting(targetBase);

  if (existing) {
    metadata.push({ title, query, localPath: existing, status: "exists" });
    return;
  }

  try {
    const image = await findCommonsImage(query);

    if (!image) {
      metadata.push({ title, query, status: "failed", reason: "No Commons image found" });
      console.warn(`No image found: ${title}`);
      return;
    }

    const ext = extensionFromUrl(image.url);
    const target = `${targetBase}${ext}`;

    await download(image.url, target);
    metadata.push({
      title,
      query,
      localPath: target,
      sourcePage: image.descriptionUrl,
      sourceFile: image.title,
      artist: image.artist,
      license: image.license,
      status: "downloaded",
    });
    console.log(`Saved ${target}`);
    await delay(PAUSE_MS);
  } catch (error) {
    metadata.push({ title, query, status: "failed", reason: error.message });
    console.warn(`Failed ${title}: ${error.message}`);
  }
}

async function findCommonsImage(query) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrnamespace: "6",
    gsrlimit: "12",
    gsrsearch: `${query} filetype:bitmap`,
    prop: "imageinfo",
    iiprop: "url|mime|extmetadata",
    iiurlwidth: "2000",
    origin: "*",
  });

  const response = await fetchWithRetry(`${COMMONS_API}?${params.toString()}`, {
    headers: { "User-Agent": "ShikBarisImageDownloader/1.0" },
  });

  if (!response.ok) {
    throw new Error(`Commons API ${response.status} ${response.statusText}`);
  }

  const body = await response.json();
  const pages = Object.values(body.query?.pages || {});

  for (const page of pages) {
    const imageInfo = page.imageinfo?.[0];
    if (!imageInfo) continue;

    const mime = imageInfo.mime || "";
    if (!/^image\/(jpeg|png|webp)$/.test(mime)) continue;

    return {
      title: page.title,
      url: imageInfo.thumburl || imageInfo.url,
      descriptionUrl: imageInfo.descriptionurl,
      artist: stripHtml(imageInfo.extmetadata?.Artist?.value || ""),
      license: imageInfo.extmetadata?.LicenseShortName?.value || "",
    };
  }

  return null;
}

async function download(url, target) {
  await mkdir(path.dirname(target), { recursive: true });

  const response = await fetchWithRetry(url, {
    headers: { "User-Agent": "Mozilla/5.0 ShikBarisImageDownloader/1.0" },
  });

  if (!response.ok || !response.body) {
    throw new Error(`Image download ${response.status} ${response.statusText}`);
  }

  await pipeline(response.body, createWriteStream(target));
}

async function findExisting(targetBase) {
  for (const ext of [".jpg", ".jpeg", ".png", ".webp"]) {
    const target = `${targetBase}${ext}`;

    try {
      await access(target);
      return target;
    } catch {
    }
  }

  return null;
}

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function extensionFromUrl(url) {
  const ext = path.extname(new URL(url).pathname).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) return ext;
  return ".jpg";
}

function stripHtml(value) {
  return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

async function fetchWithRetry(url, options) {
  let response;

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    response = await fetch(url, options);

    if (response.status !== 429 && response.status < 500) {
      return response;
    }

    if (attempt === RETRY_DELAYS_MS.length) {
      return response;
    }

    const retryAfter = Number(response.headers.get("retry-after"));
    const waitMs = Number.isFinite(retryAfter)
      ? retryAfter * 1000
      : RETRY_DELAYS_MS[attempt];

    console.warn(`Rate limited, retrying in ${Math.round(waitMs / 1000)}s...`);
    await delay(waitMs);
  }

  return response;
}
