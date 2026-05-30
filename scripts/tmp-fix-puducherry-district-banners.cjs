const https = require('https');
const fs = require('fs');
const path = require('path');

const files = [
  {
    title: 'File:Auroville-Visitor Center-WUS02152.jpg',
    out: 'src/assets/puducherry/1district/auroville.jpg'
  },
  {
    title: 'File:Karaikal Beach JEG2424.JPG',
    out: 'src/assets/puducherry/1district/karaikal.jpg'
  },
  {
    title: 'File:Mahé River.jpg',
    out: 'src/assets/puducherry/1district/mahe.jpg'
  },
  {
    title: 'File:The Obelisk Tower, Yanam.jpg',
    out: 'src/assets/puducherry/1district/yanam.jpg'
  }
];

function getJson(url) {
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

function download(url, target) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode}`));
      const stream = fs.createWriteStream(target);
      res.pipe(stream);
      stream.on('finish', () => stream.close(resolve));
      stream.on('error', reject);
    }).on('error', reject);
  });
}

(async () => {
  for (const item of files) {
    const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&titles=${encodeURIComponent(item.title)}&prop=imageinfo&iiprop=url&iiurlwidth=2000&origin=*`;
    const body = await getJson(api);
    const pages = Object.values(body.query?.pages || {});
    const page = pages.find((p) => p.imageinfo?.[0]);
    if (!page) throw new Error(`Missing ${item.title}`);
    const url = page.imageinfo[0].thumburl || page.imageinfo[0].url;
    await download(url, item.out);
    console.log(`saved ${item.out}`);
  }
})();
