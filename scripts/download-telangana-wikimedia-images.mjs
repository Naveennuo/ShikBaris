#!/usr/bin/env node

import { createWriteStream } from "node:fs";
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { setTimeout as delay } from "node:timers/promises";

const OUT_ROOT = "src/assets/telangana";
const DISTRICT_DIR = "1district";
const PAUSE_MS = 750;
const RETRY_DELAYS_MS = [3000, 8000, 15000];
const COMMONS_API = "https://commons.wikimedia.org/w/api.php";

const districts = [
  {
    title: "Hyderabad",
    bannerQuery: "Charminar Hyderabad",
    sights: [
      ["Charminar", "Charminar Hyderabad"],
      ["Golconda Fort", "Golconda Fort Hyderabad"],
      ["Hussain Sagar", "Hussain Sagar Hyderabad"],
      ["Ramoji Film City", "Ramoji Film City Hyderabad"],
      ["Salar Jung Museum", "Salar Jung Museum Hyderabad"],
    ],
  },
  {
    title: "Warangal",
    bannerQuery: "Warangal Fort Telangana",
    sights: [
      ["Warangal Fort", "Warangal Fort Telangana"],
      ["Thousand Pillar Temple", "Thousand Pillar Temple Warangal"],
      ["Ramappa Temple", "Ramappa Temple Telangana"],
      ["Laknavaram Lake", "Laknavaram Lake Telangana"],
    ],
  },
  {
    title: "Nagarjuna Sagar",
    bannerQuery: "Nagarjuna Sagar Dam Telangana",
    sights: [
      ["Nagarjuna Sagar Dam", "Nagarjuna Sagar Dam Telangana"],
      ["Nagarjunakonda", "Nagarjunakonda Telangana"],
      ["Ethipothala Falls", "Ethipothala Falls Telangana"],
    ],
  },
  {
    title: "Khammam",
    bannerQuery: "Khammam Fort Telangana",
    sights: [
      ["Khammam Fort", "Khammam Fort Telangana"],
      ["Kinnerasani Wildlife Sanctuary", "Kinnerasani Wildlife Sanctuary Telangana"],
      ["Kinnerasani Dam", "Kinnerasani Dam Telangana"],
    ],
  },
  {
    title: "Adilabad",
    bannerQuery: "Kuntala Waterfalls Telangana",
    sights: [
      ["Kuntala Waterfalls", "Kuntala Waterfalls Telangana"],
      ["Pochera Waterfalls", "Pochera Waterfalls Telangana"],
      ["Kawal Wildlife Sanctuary", "Kawal Wildlife Sanctuary Telangana"],
    ],
  },
  {
    title: "Nizamabad",
    bannerQuery: "Nizamabad Fort Telangana",
    sights: [
      ["Nizamabad Fort", "Nizamabad Fort Telangana"],
      ["Alisagar Reservoir", "Alisagar Reservoir Telangana"],
      ["Dichpally Ramalayam", "Dichpally Ramalayam Telangana"],
    ],
  },
  {
    title: "Karimnagar",
    bannerQuery: "Elgandal Fort Telangana",
    sights: [
      ["Elgandal Fort", "Elgandal Fort Telangana"],
      ["Lower Manair Dam", "Lower Manair Dam Telangana"],
      ["Vemulawada Temple", "Vemulawada Temple Telangana"],
    ],
  },
  {
    title: "Mahabubnagar",
    bannerQuery: "Pillalamarri Mahabubnagar Telangana",
    sights: [
      ["Pillalamarri", "Pillalamarri Mahabubnagar Telangana"],
      ["Koilsagar Dam", "Koilsagar Dam Telangana"],
      ["Jurala Dam", "Jurala Dam Telangana"],
    ],
  },
  {
    title: "Medak",
    bannerQuery: "Medak Cathedral Telangana",
    sights: [
      ["Medak Cathedral", "Medak Cathedral Telangana"],
      ["Medak Fort", "Medak Fort Telangana"],
      ["Pocharam Wildlife Sanctuary", "Pocharam Wildlife Sanctuary Telangana"],
    ],
  },
  {
    title: "Bhadrachalam",
    bannerQuery: "Bhadrachalam Temple Telangana",
    sights: [
      ["Sri Sita Ramachandra Swamy Temple", "Bhadrachalam Temple Telangana"],
      ["Parnasala", "Parnasala Telangana"],
      ["Godavari River Cruise", "Godavari River Bhadrachalam Telangana"],
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

console.log(`Finished Telangana images: ${downloaded} downloaded, ${skipped} existing, ${failed} failed.`);

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
    gsrlimit: "16",
    gsrsearch: `${query} filetype:bitmap`,
    prop: "imageinfo",
    iiprop: "url|mime|extmetadata",
    iiurlwidth: "1600",
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
    const requestedWaitMs = Number.isFinite(retryAfter)
      ? retryAfter * 1000
      : RETRY_DELAYS_MS[attempt];
    const waitMs = Math.min(requestedWaitMs, 15000);

    console.warn(`Rate limited, retrying in ${Math.round(waitMs / 1000)}s...`);
    await delay(waitMs);
  }

  return response;
}
