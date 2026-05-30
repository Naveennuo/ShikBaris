#!/usr/bin/env node

import { createWriteStream } from "node:fs";
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { setTimeout as delay } from "node:timers/promises";

const OUT_ROOT = "src/assets/puducherry";
const DISTRICT_DIR = "1district";
const PAUSE_MS = 3000;
const RETRY_DELAYS_MS = [5000, 15000, 30000];
const COMMONS_API = "https://commons.wikimedia.org/w/api.php";

const districts = [
  {
    title: "Puducherry",
    bannerQuery: "Promenade Beach Puducherry",
    sights: [
      ["Promenade Beach", "Promenade Beach Puducherry"],
      ["Rock Beach", "Rock Beach Puducherry"],
      ["Sri Aurobindo Ashram", "Sri Aurobindo Ashram Puducherry"],
      ["French Quarter", "French Quarter Puducherry"],
      ["White Town", "White Town Puducherry"],
    ],
  },
  {
    title: "Auroville",
    bannerQuery: "Matrimandir Auroville",
    sights: [
      ["Matrimandir", "Matrimandir Auroville"],
      ["Auroville Beach", "Auroville Beach"],
      ["Visitor's Centre", "Auroville Visitors Centre"],
      ["Botanical Gardens", "Auroville Botanical Gardens"],
    ],
  },
  {
    title: "Karaikal",
    bannerQuery: "Karaikal Beach",
    sights: [
      ["Karaikal Beach", "Karaikal Beach"],
      ["Thirunallar Temple", "Tirunallar Temple"],
      ["Karaikal Port", "Karaikal Port"],
    ],
  },
  {
    title: "Yanam",
    bannerQuery: "Rajiv Gandhi Beach Yanam",
    sights: [
      ["Rajiv Gandhi Beach", "Rajiv Gandhi Beach Yanam"],
      ["Godavari River View", "Godavari river Yanam"],
      ["Yanam Tower Clock", "Yanam Tower Clock"],
    ],
  },
  {
    title: "Mahe",
    bannerQuery: "Mahe beach Puducherry",
    sights: [
      ["Mahe Beach", "Mahe Beach Puducherry"],
      ["St. Theresa Shrine", "St. Theresa Shrine Mahe"],
      ["Tagore Park", "Tagore Park Mahe"],
    ],
  },
];

const exactCommonsFiles = {
  Puducherry: [
    "File:Beach Promenade at Pondicherry panorama.jpg",
  ],
  "Promenade Beach": [
    "File:Beach Promenade at Pondicherry panorama.jpg",
  ],
  "Rock Beach": [
    "File:Pondicherry-Rock beach aerial view.jpg",
  ],
  "Sri Aurobindo Ashram": [
    "File:Sri Aurobindo Ashram entrance.jpg",
    "File:Sri_Aurobindo_Ashram,_Puducherry.jpg",
  ],
  "French Quarter": [
    "File:Puducherry-French Quarter-WUS02282.jpg",
    "File:Puducherry-French Quarter-WUS02273.jpg",
    "File:Puducherry Dumas Street.JPG",
  ],
  "White Town": [
    "File:Streets of White town, Puducherry.jpg",
    "File:Puducherry-French Quarter-WUS02285.jpg",
    "File:Puducherry EFEO 2.jpg",
  ],
  Auroville: [
    "File:Matrimandir, Auroville.jpg",
  ],
  Matrimandir: [
    "File:Matrimandir, Auroville.jpg",
  ],
  "Auroville Beach": [
    "File:Auroville Beach.jpg",
  ],
  "Visitor's Centre": [
    "File:Auroville Visitors Centre.jpg",
  ],
  "Botanical Gardens": [
    "File:Auroville Botanical Gardens.jpg",
  ],
  Karaikal: [
    "File:Karaikal Beach.jpg",
  ],
  "Karaikal Beach": [
    "File:Karaikal Beach.jpg",
  ],
  "Thirunallar Temple": [
    "File:Tirunallar.JPG",
  ],
  "Karaikal Port": [
    "File:Karaikal Port.jpg",
  ],
  Yanam: [
    "File:Rajiv Gandi Statue at Yanam Beach, Yanam.jpg",
  ],
  "Rajiv Gandhi Beach": [
    "File:Rajiv Gandi Statue at Yanam Beach, Yanam.jpg",
  ],
  "Godavari River View": [
    "File:Koringa River at Yanam 01.jpg",
  ],
  "Yanam Tower Clock": [
    "File:The Obelisk Tower, Yanam.jpg",
  ],
  Mahe: [
    "File:Mahé (India) Main Beach.jpg",
  ],
  "Mahe Beach": [
    "File:Mahé (India) Main Beach.jpg",
  ],
  "St. Theresa Shrine": [
    "File:Church at Mahé, French India period.jpg",
  ],
  "Tagore Park": [
    "File:Tagore Park, Mahe.jpg",
    "File:Tagore Park Mahé.jpg",
  ],
};

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
    overwrite: true,
  });

  for (const [title, query] of district.sights) {
    await saveImage({
      title,
      query,
      targetBase: path.join(districtPath, title),
      metadata,
      overwrite: true,
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

console.log(`Finished Puducherry images: ${downloaded} downloaded, ${skipped} existing, ${failed} failed.`);

async function saveImage({ title, query, targetBase, metadata, overwrite = false }) {
  const existing = overwrite ? null : await findExisting(targetBase);

  if (existing) {
    metadata.push({ title, query, localPath: existing, status: "exists" });
    return;
  }

  try {
    const exactTitles = exactCommonsFiles[title] || [];
    let image = null;

    for (const exactTitle of exactTitles) {
      image = await getCommonsFileByTitle(exactTitle);
      if (image) break;
    }

    if (!image) {
      image = await findCommonsImage(query);
    }

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

async function getCommonsFileByTitle(fileTitle) {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    titles: fileTitle,
    prop: "imageinfo",
    iiprop: "url|mime|extmetadata",
    iiurlwidth: "2000",
    origin: "*",
  });

  const response = await fetchWithRetry(`${COMMONS_API}?${params.toString()}`, {
    headers: { "User-Agent": "ShikBarisImageDownloader/1.0" },
  });

  if (!response.ok) {
    throw new Error(`Commons file lookup ${response.status} ${response.statusText}`);
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


