const fs = require('fs');
const path = require('path');
const https = require('https');

const targets = [
  {
    title: 'Oravakallu Rock Garden',
    fileTitle: 'File:Rock Gardens Near Kurnool.jpg',
    outFile: 'src/assets/andhrapradesh/kurnool/Oravakallu Rock Garden.jpg'
  },
  {
    title: 'Chennakesava Swamy Temple',
    fileTitle: 'File:Macherla chennakesava temple.jpg',
    outFile: 'src/assets/andhrapradesh/ongole/Chennakesava Swamy Temple.jpg'
  }
];

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'ShikBarisImageDownloader/1.0' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (err) { reject(err); }
      });
    }).on('error', reject);
  });
}

function download(url, file) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 ShikBarisImageDownloader/1.0' } }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const stream = fs.createWriteStream(file);
      res.pipe(stream);
      stream.on('finish', () => stream.close(resolve));
      stream.on('error', reject);
    }).on('error', reject);
  });
}

(async () => {
  const updates = [];
  for (const target of targets) {
    const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(target.fileTitle)}&prop=imageinfo&iiprop=url|mime|extmetadata&iiurlwidth=2000&origin=*`;
    const body = await fetchJson(api);
    const pages = Object.values(body.query?.pages || {});
    const page = pages.find((entry) => entry.imageinfo?.[0]);
    if (!page) throw new Error(`No page found for ${target.fileTitle}`);
    const info = page.imageinfo[0];
    const imageUrl = info.thumburl || info.url;
    await download(imageUrl, target.outFile);
    updates.push({
      title: target.title,
      sourceFile: page.title,
      sourcePage: info.descriptionurl,
      imageUrl,
      license: info.extmetadata?.LicenseShortName?.value || '',
      artist: (info.extmetadata?.Artist?.value || '').replace(/<[^>]*>/g, '').trim(),
      localPath: target.outFile,
      status: 'downloaded'
    });
    console.log(`saved ${target.outFile}`);
  }

  const metadataPath = 'src/assets/andhrapradesh/wikimedia-download-metadata.json';
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  for (const update of updates) {
    const index = metadata.assets.findIndex((item) => item.title === update.title);
    if (index >= 0) metadata.assets[index] = update;
    else metadata.assets.push(update);
  }
  metadata.downloadedAt = new Date().toISOString();
  fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
})();
