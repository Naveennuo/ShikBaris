#!/usr/bin/env node

import { createWriteStream } from "node:fs";
import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { pipeline } from "node:stream/promises";
import { setTimeout as delay } from "node:timers/promises";

const OUT_ROOT = "src/assets/andhrapradesh";
const DISTRICT_DIR = "1district";
const PAUSE_MS = 3000;
const RETRY_DELAYS_MS = [5000, 15000, 30000];
const COMMONS_API = "https://commons.wikimedia.org/w/api.php";

const districts = [
  {
    title: "Visakhapatnam",
    bannerQuery: "Visakhapatnam RK Beach",
    sights: [
      ["RK Beach", "Ramakrishna Beach Visakhapatnam"],
      ["Kailasagiri", "Kailasagiri Visakhapatnam"],
      ["Yarada Beach", "Yarada Beach"],
      ["Araku Valley", "Araku Valley"],
      ["Borra Caves", "Borra Caves"],
    ],
  },
  {
    title: "Kakinada",
    bannerQuery: "Kakinada Hope Island",
    sights: [
      ["Coringa Wildlife Sanctuary", "Coringa Wildlife Sanctuary"],
      ["Hope Island", "Hope Island Kakinada"],
      ["Konaseema", "Konaseema Andhra Pradesh"],
      ["Appanapalli Temple", "Appanapalli Temple Andhra Pradesh"],
    ],
  },
  {
    title: "Vijayawada",
    bannerQuery: "Vijayawada Kanaka Durga Temple",
    sights: [
      ["Kanaka Durga Temple", "Kanaka Durga Temple Vijayawada"],
      ["Bhavani Island", "Bhavani Island Vijayawada"],
      ["Undavalli Caves", "Undavalli Caves"],
      ["Manginapudi Beach", "Manginapudi Beach"],
    ],
  },
  {
    title: "Ongole",
    bannerQuery: "Ongole Andhra Pradesh",
    sights: [
      ["Suryalanka Beach", "Suryalanka Beach"],
      ["Kothapatnam Beach", "Kothapatnam Beach"],
      ["Chennakesava Swamy Temple", "Chennakesava Swamy Temple Ongole"],
    ],
  },
  {
    title: "Nellore",
    bannerQuery: "Pulicat Lake",
    sights: [
      ["Pulicat Lake", "Pulicat Lake"],
      ["Mypadu Beach", "Mypadu Beach"],
      ["Udayagiri Fort", "Udayagiri Fort Andhra Pradesh"],
    ],
  },
  {
    title: "Tirupati",
    bannerQuery: "Tirumala Venkateswara Temple",
    sights: [
      ["Tirumala Venkateswara Temple", "Tirumala Venkateswara Temple"],
      ["Sri Kapileswara Swamy Temple", "Kapila Theertham Tirupati"],
      ["Talakona Waterfalls", "Talakona Waterfalls"],
      ["Chandragiri Fort", "Chandragiri Fort Andhra Pradesh"],
      ["Horsley Hills", "Horsley Hills"],
    ],
  },
  {
    title: "Srisailam",
    bannerQuery: "Srisailam Mallikarjuna Temple",
    sights: [
      ["Mallikarjuna Swamy Temple", "Mallikarjuna Jyotirlinga Srisailam"],
      ["Srisailam Dam", "Srisailam Dam"],
      ["Mahanandi Temple", "Mahanandi Temple"],
      ["Yaganti Temple", "Yaganti Temple"],
      ["Ahobilam", "Ahobilam"],
    ],
  },
  {
    title: "Palakollu",
    bannerQuery: "Ksheerarama Temple Palakollu",
    sights: [
      ["Ksheerarama Temple", "Ksheerarama Temple"],
      ["Somarama Temple", "Somarama Temple Bhimavaram"],
    ],
  },
  {
    title: "Kurnool",
    bannerQuery: "Belum Caves",
    sights: [
      ["Belum Caves", "Belum Caves"],
      ["Oravakallu Rock Garden", "Oravakallu Rock Garden"],
      ["Gandikota", "Gandikota"],
    ],
  },
  {
    title: "Anantapur",
    bannerQuery: "Lepakshi Temple",
    sights: [
      ["Lepakshi Temple", "Lepakshi Temple"],
      ["Penukonda Fort", "Penukonda Fort"],
      ["Prasanthi Nilayam", "Prasanthi Nilayam"],
    ],
  },
  {
    title: "Rajahmundry",
    bannerQuery: "Godavari Bridge Rajahmundry",
    sights: [
      ["Papikondalu", "Papikondalu"],
      ["Godavari Bridge", "Godavari Bridge Rajahmundry"],
      ["Dowleswaram Barrage", "Dowleswaram Barrage"],
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

console.log(`Finished Andhra Pradesh images: ${downloaded} downloaded, ${skipped} existing, ${failed} failed.`);

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
      // Keep looking.
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
