#!/usr/bin/env node

import { createWriteStream } from 'node:fs';
import { access, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { setTimeout as delay } from 'node:timers/promises';

const OUT_ROOT = 'src/assets/karnataka';
const DISTRICT_DIR = '1district';
const PAUSE_MS = 3000;
const RETRY_DELAYS_MS = [5000, 15000, 30000];

const fallbackQueries = {
  'Aquarium Paradise Bangalore': ['Bangalore Aquarium', 'Government Aquarium Bangalore', 'Cubbon Park Aquarium'],
  'Chiklihole Reservoir': ['Chiklihole Dam', 'Chiklihole Reservoir Coorg', 'Chiklihole Kodagu'],
  'Z Point Kemmanagundi': ['Z Point Kemmangundi', 'Kemmangundi Z Point', 'Kemmanagundi'],
  'Ballalarayana Durga Fort': ['Ballalarayana Durga', 'Ballalarayana Durga Chikmagalur'],
  'Mahatma Gandhi Park Chikmagalur': ['Mahatma Gandhi Park Chikkamagaluru', 'Ratnagiri Bore Chikmagalur', 'M G Park Chikmagalur'],
  'GRS Fantasy Park Mysore': ['GRS Fantasy Park', 'GRS Mysore'],
  'Triveni Sangama Srirangapatna': ['Triveni Sangama Srirangapatna', 'Sangama Srirangapatna'],
  'Yoganandeeshwara Temple Nandi Hills': ['Yoga Nandeeshwara Temple', 'Yoganandishwara Temple Nandi Hills'],
  'Nandi Hills Pushkarini': ['Nandi Pushkarini', 'Nandi Hills Kalyani', 'Bhoga Nandeeshwara Pushkarini'],
  'Gogarbha Cave Gokarna': ['Gogarbha Cave', 'Gogarbha Shiva Cave'],
  'Half Moon Beach Gokarna': ['Half Moon Beach Gokarna', 'Half Moon Beach Karnataka'],
  'Fiza by Nexus Mall Mangalore': ['Fiza Mall Mangalore', 'Fiza by Nexus', 'Forum Fiza Mall'],
  'Sharavu Mahaganapathi Temple': ['Sharavu Mahaganapathi Temple Mangalore', 'Sharavu Temple Mangalore'],
  'Someshwar Beach Mangalore': ['Someshwara Beach Mangalore', 'Someshwar Beach Ullal', 'Someshwara Beach Ullal', 'Someshwar Beach'],
};

const directImageFallbacks = {
  'Chiklihole Reservoir': {
    url: 'https://cdn.s3waas.gov.in/s3c8ed21db4f678f3b13b9d5ee16489088/uploads/bfi_thumb/2018070764-olwcjtmpsj4jmqalepychvyaptgsg0vb13qkfbcdje.jpg',
    sourcePage: 'https://kodagu.nic.in/en/tourist-place/chiklihole-reservoir/',
    title: 'Chiklihole Reservoir',
  },
  'Ballalarayana Durga Fort': {
    url: 'https://seawatersports.com/images/places/ballalarayana-durga-fort.png',
    sourcePage: 'https://seawatersports.com/places/karnataka/ballalarayana-durga-fort',
    title: 'Ballalarayana Durga Fort',
  },
  'Gogarbha Shiva Cave': {
    url: 'https://www.gokarnatourism.co.in/images/places-to-visit/header/shiva-cave-gokarna-indian-tourism-entry-fee-timings-holidays-reviews-header.jpg',
    sourcePage: 'https://www.gokarnatourism.co.in/shiva-cave-gokarna',
    title: 'Gogarbha Shiva Cave',
  },
};

const districts = [
  ['Bangalore', 'Bangalore Palace'],
  ['Coorg', 'Kodagu district'],
  ['Chikmagalur', 'Chikmagalur'],
  ['Mysore', 'Mysore Palace'],
  ['Nandhi Hills', 'Nandi Hills, India'],
  ['Gokarna', 'Gokarna, Karnataka'],
  ['Mangalore', 'Mangalore'],
  ['Hampi', 'Hampi'],
  ['Kabini', 'Kabini River'],
  ['Murudeshwar', 'Murdeshwar'],
  ['Sakleshpur', 'Sakleshpur'],
  ['Udupi', 'Udupi Sri Krishna Matha'],
  ['Bidar', 'Bidar Fort'],
  ['Hoskote', 'Hoskote'],
  ['Dandeli', 'Dandeli'],
  ['Nagarhole', 'Nagarhole National Park'],
  ['Belgaum', 'Belgaum Fort'],
  ['Kolar', 'Kotilingeshwara'],
  ['Hubli', 'Chandramouleshwara Temple Hubli'],
  ['Manipal', 'Manipal'],
  ['Shimoga', 'Shivamogga'],
  ['Hassan', 'Hoysaleswara Temple'],
  ['Tumkur', 'Devarayanadurga'],
  ['Gulbarga', 'Gulbarga Fort'],
  ['Sringeri', 'Sringeri Sharada Peetham'],
  ['Bijapur', 'Gol Gumbaz'],
  ['Belur', 'Chennakeshava Temple, Belur'],
  ['Badami', 'Badami cave temples'],
  ['Davangere', 'Davangere'],
  ['Chitradurga', 'Chitradurga Fort'],
];

const places = {
  bangalore: [
    { name: 'ISKCON Temple', query: 'ISKCON Temple Bangalore' },
    { name: 'Lalbagh Botanical Garden', query: 'Lal Bagh Bangalore' },
    { name: 'Aquarium Paradise', query: 'Aquarium Paradise Bangalore' },
    { name: 'Cubbon Park', query: 'Cubbon Park' },
    { name: 'Wonderla', query: 'Wonderla Bangalore' },
    { name: 'Bannerughatta Biological Park', query: 'Bannerghatta Biological Park' },
    { name: 'Central Mall', query: 'Bangalore Central Mall' },
    { name: 'Bangalore Palace', query: 'Bangalore Palace' },
    { name: 'Phoenix Mall', query: 'Phoenix Marketcity Bangalore' },
    { name: 'Orion Mall', query: 'Orion Mall Bangalore' },
    { name: 'Vidhana Soudha', query: 'Vidhana Soudha' },
    { name: 'Chinnaswamy Stadium', query: 'M. Chinnaswamy Stadium' },
    { name: 'Fun World Amusement Park', query: 'Fun World Bangalore' },
    { name: 'Venkatappa Art Gallery', query: 'Venkatappa Art Gallery' },
    { name: 'Government Museum', query: 'Government Museum Bangalore' },
  ],
  coorg: [
    { name: 'Raja seat Garden', query: 'Raja Seat' },
    { name: 'Abby Water Falls', query: 'Abbey Falls' },
    { name: 'Mallalli water Falls', query: 'Mallalli Falls' },
    { name: 'Nagarahole Tiger Reserve', query: 'Nagarhole National Park' },
    { name: 'Irpu water Falls', query: 'Iruppu Falls' },
    { name: 'Dubare Elephant Camp', query: 'Dubare Elephant Camp' },
    { name: 'Golden Temple', query: 'Namdroling Monastery Golden Temple Coorg' },
    { name: 'Omkareshwara Temple', query: 'Omkareshwara Temple Madikeri' },
    { name: 'Thalakaveri Temple', query: 'Talakaveri' },
    { name: 'Chiklihole Reservoir', query: 'Chiklihole Reservoir' },
    { name: 'Mandalpatti peak', query: 'Mandalpatti' },
    { name: 'Coffee plantations', query: 'Coorg coffee plantation' },
    { name: 'Pushpagiri Wildlife Sanctuary', query: 'Pushpagiri Wildlife Sanctuary' },
    { name: 'Nisargadhama', query: 'Nisargadhama' },
    { name: 'Raja\'s Tomb', query: 'Raja Tomb Madikeri' },
    { name: 'Sri Bhagandeshwara Temple', query: 'Bhagandeshwara Temple Bhagamandala' },
    { name: 'Chelavara Water Falls', query: 'Chelavara Falls' },
    { name: 'Harangi Reservoir', query: 'Harangi Dam' },
    { name: 'Madikeri Fort', query: 'Madikeri Fort' },
    { name: 'Government Museum', query: 'Government Museum Madikeri' },
  ],
  chikmagalur: [
    { name: 'Mullayanagiri', query: 'Mullayanagiri' },
    { name: 'Hebbe Falls', query: 'Hebbe Falls' },
    { name: 'Kudremukh peak', query: 'Kudremukh peak' },
    { name: 'Bhadra Wildlife Sanctuary', query: 'Bhadra Wildlife Sanctuary' },
    { name: 'Jhari Water Falls', query: 'Jhari Falls' },
    { name: 'Z Point', query: 'Z Point Kemmanagundi' },
    { name: 'Baba Budangiri', query: 'Baba Budangiri' },
    { name: 'Kudremukh National Park', query: 'Kudremukh National Park' },
    { name: 'Hirekolale lake', query: 'Hirekolale Lake' },
    { name: 'Sri Annapurneshwari Temple', query: 'Annapoorneshwari Temple Horanadu' },
    { name: 'Belavadi', query: 'Belavadi' },
    { name: 'Sri Amrutesvara Temple', query: 'Amrutesvara Temple Amruthapura' },
    { name: 'Ballalarayana Durga Fort', query: 'Ballalarayana Durga Fort' },
    { name: 'Mahadhma Gandhi Park', query: 'Mahatma Gandhi Park Chikmagalur' },
  ],
  mysore: [
    { name: 'Mysore Palace', query: 'Mysore Palace' },
    { name: 'Venugopala Swamy Temple', query: 'Venugopala Swamy Temple Mysore' },
    { name: 'Sri Chamarajendra Zoological Gardens', query: 'Mysore Zoo' },
    { name: 'Sri Chamundi Hills', query: 'Chamundi Hills' },
    { name: 'GRS Fantasy Park', query: 'GRS Fantasy Park Mysore' },
    { name: 'St. Philomena\'s Church', query: 'St. Philomena\'s Cathedral Mysore' },
    { name: 'Sand Sculpture Museum', query: 'Mysore Sand Sculpture Museum' },
    { name: 'Brindavan Gardens', query: 'Brindavan Gardens' },
    { name: 'Tippu Sultan Death place', query: 'Tipu Sultan death place Srirangapatna' },
    { name: 'Tippu Sultan Fort', query: 'Srirangapatna Fort' },
    { name: 'Tippu Sultan Summer Palace', query: 'Daria Daulat Bagh' },
    { name: 'Daria Daulat Bagh', query: 'Daria Daulat Bagh' },
    { name: 'Triveni Sangamam', query: 'Triveni Sangama Srirangapatna' },
    { name: 'Water Gate & Secret Door to Fort', query: 'Water Gate Srirangapatna Fort' },
  ],
  'nandhi-hills': [
    { name: 'Sri Bhoga Nandishwara Gudi', query: 'Bhoga Nandeeshwara Temple' },
    { name: 'Sri Yoganandeeswara Temple', query: 'Yoganandeeshwara Temple Nandi Hills' },
    { name: 'Nandhi Pushkarini', query: 'Nandi Hills Pushkarini' },
    { name: 'Nandi Hill View Point', query: 'Nandi Hills view point' },
  ],
  gokarna: [
    { name: 'Sri Mahabaleshwara Temple', query: 'Mahabaleshwar Temple Gokarna' },
    { name: 'Om Beach', query: 'Om Beach' },
    { name: 'Gogarbha Shiva Cave', query: 'Gogarbha Cave Gokarna' },
    { name: 'Kudle Beach', query: 'Kudle Beach' },
    { name: 'Paradise Beach', query: 'Paradise Beach Gokarna' },
    { name: 'Belekan Beach', query: 'Belekan Beach Gokarna' },
    { name: 'Gokarna Main Beach', query: 'Gokarna Main Beach' },
    { name: 'Half Moon Beach', query: 'Half Moon Beach Gokarna' },
    { name: 'Mirjan Fort', query: 'Mirjan Fort' },
    { name: 'Yana Caves', query: 'Yana Caves' },
  ],
  mangalore: [
    { name: 'Sri Mangaladevi Temple', query: 'Mangaladevi Temple' },
    { name: 'Kedri Sri Manjunatha Temple', query: 'Kadri Manjunath Temple' },
    { name: 'St. Aloysius Chapel', query: 'St. Aloysius Chapel Mangalore' },
    { name: 'Kudroli Sri Gokarnanatha Kshetra', query: 'Kudroli Gokarnath Temple' },
    { name: 'Surathkal Lighthouse Beach', query: 'Surathkal Beach lighthouse' },
    { name: 'Panambur Beach', query: 'Panambur Beach' },
    { name: 'Sri Durgaparameshwari Temple', query: 'Kateel Durgaparameshwari Temple' },
    { name: 'Fiza By Nexus', query: 'Fiza by Nexus Mall Mangalore' },
    { name: 'Tannirbhavi Beach', query: 'Tannirbhavi Beach' },
    { name: 'Sri Sharavu Mahaganapathi Temple', query: 'Sharavu Mahaganapathi Temple' },
    { name: 'Milagres Church', query: 'Milagres Church Mangalore' },
    { name: 'Pilikula Nisargadhama', query: 'Pilikula Nisargadhama' },
    { name: 'Our Lady Of Rosary Cathedral', query: 'Our Lady of Rosary Cathedral Mangalore' },
    { name: 'Kudroli Sri Bhagavathi Temple', query: 'Kudroli Bhagavathi Temple' },
    { name: 'Kadri Park', query: 'Kadri Park Mangalore' },
    { name: 'Ullal Beach', query: 'Ullal Beach' },
    { name: 'Sri Rajarajeshwari Temple', query: 'Polali Rajarajeshwari Temple' },
    { name: 'Kukke Sri Subrahmanya Temple', query: 'Kukke Subramanya Temple' },
    { name: 'Someshwar Beach', query: 'Someshwar Beach Mangalore' },
  ],
  hampi: ['Virupaksha Temple, Hampi', 'Vijaya Vittala Temple', 'Stone Chariot Hampi', 'Lotus Mahal'],
  kabini: ['Kabini River', 'Nagarhole National Park'],
  murudeshwar: ['Murdeshwar', 'Murdeshwar Temple'],
  sakleshpur: ['Sakleshpur', 'Manjarabad Fort'],
  udupi: ['Udupi Sri Krishna Matha', 'Malpe Beach', 'St. Mary\'s Islands'],
  bidar: ['Bidar Fort', 'Mahmud Gawan Madrasa', 'Bahmani Tombs'],
  hoskote: ['Hoskote'],
  dandeli: ['Dandeli', 'Kali River (Karnataka)', 'Dandeli Wildlife Sanctuary'],
  nagarhole: ['Nagarhole National Park', 'Kabini River'],
  belgaum: ['Belgaum Fort', 'Gokak Falls', 'Savadatti Yellamma Temple'],
  kolar: ['Kotilingeshwara', 'Kolar Gold Fields', 'Someshwara Temple, Kolar'],
  hubli: ['Chandramouleshwara Temple, Hubli', 'Unkal Lake', 'Nrupatunga Betta'],
  manipal: ['Manipal', 'Hasta Shilpa Heritage Village', 'Manipal Lake'],
  shimoga: ['Jog Falls', 'Shivappanaika Palace Museum', 'Sakrebailu Elephant Camp'],
  hassan: ['Hoysaleswara Temple', 'Chennakeshava Temple, Belur', 'Shravanabelagola'],
  tumkur: ['Devarayanadurga', 'Namada Chilume', 'Siddaganga Matha'],
  gulbarga: ['Gulbarga Fort', 'Bande Nawaz Dargah', 'Sharana Basaveshwara Temple'],
  sringeri: ['Sringeri Sharada Peetham', 'Vidyashankara Temple', 'Tunga River'],
  bijapur: ['Gol Gumbaz', 'Ibrahim Rauza', 'Bara Kaman'],
  belur: ['Chennakeshava Temple, Belur', 'Yagachi Dam', 'Hoysala architecture'],
  badami: ['Badami cave temples', 'Agastya Lake', 'Pattadakal'],
  davangere: ['Davangere', 'Kunduvada Lake', 'Harihareshwara Temple'],
  chitradurga: ['Chitradurga Fort', 'Vani Vilasa Sagara', 'Chandravalli caves'],
};

await mkdir(path.join(OUT_ROOT, DISTRICT_DIR), { recursive: true });

const summary = [];

for (const [districtName, pageTitle] of districts) {
  const slug = slugify(districtName);
  const fileBase = path.join(OUT_ROOT, DISTRICT_DIR, slug);
  summary.push(await downloadPageImage(pageTitle, fileBase, `${districtName} district banner`));
}

for (const [districtSlug, placeEntries] of Object.entries(places)) {
  await mkdir(path.join(OUT_ROOT, districtSlug), { recursive: true });

  for (const placeEntry of placeEntries) {
    const placeName = placeEntry.name || placeEntry;
    const pageTitle = placeEntry.query || placeEntry;
    const fileBase = path.join(OUT_ROOT, districtSlug, fileNameFromTitle(placeName));
    summary.push(await downloadPageImage(pageTitle, fileBase, `${districtSlug} place: ${placeName}`));
  }
}

await writeFile(
  path.join(OUT_ROOT, 'wikimedia-download-metadata.json'),
  JSON.stringify(
    {
      downloadedAt: new Date().toISOString(),
      note: 'Images were fetched from Wikipedia/Wikimedia lead images. Review metadata before publishing.',
      results: summary,
    },
    null,
    2
  )
);

const downloaded = summary.filter((item) => item.status === 'downloaded').length;
const available = summary.filter((item) => item.status === 'downloaded' || item.status === 'skipped-existing').length;
const unresolved = summary.filter((item) => item.status !== 'downloaded' && item.status !== 'skipped-existing').length;

console.log(`Downloaded ${downloaded} new image(s). ${available} total configured item(s) have files. ${unresolved} item(s) need review.`);

async function downloadPageImage(pageTitle, targetBase, label) {
  try {
    const existing = await existingTarget(targetBase);
    const directFallback = directImageFallbacks[label.split(': ').pop()] || directImageFallbacks[pageTitle];

    if (existing) {
      return logResult({
        label,
        pageTitle,
        status: 'skipped-existing',
        localPath: existing,
        imageUrl: directFallback?.url,
        sourcePage: directFallback?.sourcePage,
        title: directFallback?.title || pageTitle,
      });
    }

    const details = await getPageImage(pageTitle);

    if (!details?.url && !directFallback?.url) {
      return logResult({ label, pageTitle, status: 'missing-image' });
    }

    const resolvedDetails = details?.url ? details : directFallback;
    const ext = extensionFromUrl(resolvedDetails.url);
    const target = `${targetBase}${ext}`;

    await download(resolvedDetails.url, target);
    await delay(PAUSE_MS);

    return logResult({
      label,
      pageTitle,
      status: 'downloaded',
      localPath: target,
      imageUrl: resolvedDetails.url,
      sourcePage: resolvedDetails.sourcePage,
      title: resolvedDetails.title,
    });
  } catch (error) {
    return logResult({ label, pageTitle, status: `failed: ${error.message}` });
  }
}

async function getPageImage(pageTitle) {
  const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
  const response = await fetchWithRetry(url, {
    headers: headers(),
  });

  if (response.status === 404) {
    return getCommonsImage(pageTitle);
  }

  if (!response.ok) {
    throw new Error(`summary ${response.status} ${response.statusText}`);
  }

  const body = await response.json();
  const image = body.originalimage || body.thumbnail;

  if (!image?.source) {
    return getCommonsImage(pageTitle);
  }

  return {
    url: image?.source,
    sourcePage: body.content_urls?.desktop?.page,
    title: body.title,
  };
}

async function getCommonsImage(query) {
  const searches = [
    `${query} Karnataka`,
    ...(fallbackQueries[query] || []),
    `${query} India`,
    query,
  ];

  for (const search of searches) {
    const params = new URLSearchParams({
      action: 'query',
      generator: 'search',
      gsrsearch: search,
      gsrnamespace: '6',
      gsrlimit: '3',
      prop: 'imageinfo',
      iiprop: 'url|size|mime',
      iiurlwidth: '1800',
      format: 'json',
      origin: '*',
    });
    const response = await fetchWithRetry(`https://commons.wikimedia.org/w/api.php?${params}`, {
      headers: headers(),
    });

    if (!response.ok) {
      throw new Error(`commons ${response.status} ${response.statusText}`);
    }

    const body = await response.json();
    const pages = Object.values(body.query?.pages || {});
    const page = pages.find((entry) => entry?.imageinfo?.[0]?.thumburl || entry?.imageinfo?.[0]?.url);
    const imageInfo = page?.imageinfo?.[0];

    if (imageInfo?.thumburl || imageInfo?.url) {
      return {
        url: imageInfo.thumburl || imageInfo.url,
        sourcePage: page?.title ? `https://commons.wikimedia.org/wiki/${encodeURIComponent(page.title.replace(/ /g, '_'))}` : null,
        title: page?.title || query,
      };
    }
  }

  return null;
}

async function download(url, target) {
  const response = await fetchWithRetry(url, {
    headers: headers(),
  });

  if (!response.ok) {
    throw new Error(`image ${response.status} ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) {
    throw new Error(`not an image (${contentType || 'unknown content type'})`);
  }

  await pipeline(response.body, createWriteStream(target));
}

async function fetchWithRetry(url, options) {
  let lastResponse;

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    const response = await fetch(url, options);

    if (response.status !== 429) {
      return response;
    }

    lastResponse = response;
    const retryAfter = Number.parseInt(response.headers.get('retry-after') || '', 10);
    const waitMs = Number.isFinite(retryAfter)
      ? retryAfter * 1000
      : RETRY_DELAYS_MS[Math.min(attempt, RETRY_DELAYS_MS.length - 1)];

    await delay(waitMs);
  }

  return lastResponse;
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function existingTarget(targetBase) {
  const extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'];

  for (const ext of extensions) {
    const target = `${targetBase}${ext}`;

    if (await exists(target)) {
      return target;
    }
  }

  return null;
}

function headers() {
  return {
    'Api-User-Agent': 'ShikBarisImageDownloader/1.0 (local project asset preparation; contact: local@example.invalid)',
    'User-Agent': 'ShikBarisImageDownloader/1.0 (local project asset preparation; contact: local@example.invalid)',
  };
}

function logResult(result) {
  const line = result.localPath ? `${result.status}: ${result.localPath}` : `${result.status}: ${result.pageTitle}`;
  console.log(line);
  return result;
}

function extensionFromUrl(url) {
  try {
    const ext = path.extname(new URL(url).pathname).toLowerCase();
    return ext && ext.length <= 6 ? ext : '.jpg';
  } catch {
    return '.jpg';
  }
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function fileNameFromTitle(value) {
  return value
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);
}
