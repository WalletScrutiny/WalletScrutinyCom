const https = require('https');
const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const SKIP_URL_PATTERNS = [
  'web.archive.org',
  'walletscrutiny.com',
  'github.com',
  'twitter.com',
  'facebook.com',
  'instagram.com',
  't.me',
  'play.google.com'
];

const REQUEST_TIMEOUT = 10000;
const GLOBAL_TIMEOUT = 15000;

async function checkSite(urlString) {
  return new Promise((resolve) => {
    let isDone = false;
    let request;

    const globalTimeout = setTimeout(() => {
      if (!isDone) {
        if (request) request.destroy();
        isDone = true;
        resolve({ isAvailable: false, statusCode: -1 });
      }
    }, GLOBAL_TIMEOUT);

    try {
      const url = new URL(urlString);
      const options = {
        method: 'HEAD',
        timeout: REQUEST_TIMEOUT,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        },
        rejectUnauthorized: false
      };

      request = (url.protocol === 'https:' ? https : http).request(url, options, (response) => {
        if (isDone) {
          request.destroy();
          return;
        }

        if ([301, 302, 307, 308].includes(response.statusCode) && response.headers.location) {
          try {
            const redirectUrl = new URL(response.headers.location, url).href;
            request.destroy();
            clearTimeout(globalTimeout);
            checkSite(redirectUrl).then(result => {
              if (!isDone) {
                isDone = true;
                resolve(result);
              }
            });
            return;
          } catch {
            if (!isDone) {
              request.destroy();
              clearTimeout(globalTimeout);
              isDone = true;
              resolve({ isAvailable: false, statusCode: response.statusCode });
            }
            return;
          }
        }

        if (!isDone) {
          request.destroy();
          clearTimeout(globalTimeout);
          isDone = true;
          resolve({ 
            isAvailable: [200, 403].includes(response.statusCode),
            statusCode: response.statusCode 
          });
        }
      });

      request.on('error', async (error) => {
        if (isDone) {
          request.destroy();
          return;
        }

        if (url.protocol === 'https:') {
          url.protocol = 'http:';
          request.destroy();
          clearTimeout(globalTimeout);
          try {
            const httpResult = await checkSite(url.toString());
            if (!isDone) {
              isDone = true;
              resolve(httpResult);
            }
          } catch {
            if (!isDone) {
              isDone = true;
              resolve({ isAvailable: false, statusCode: 0 });
            }
          }
        } else {
          if (!isDone) {
            request.destroy();
            clearTimeout(globalTimeout);
            isDone = true;
            resolve({ isAvailable: false, statusCode: 0 });
          }
        }
      });

      request.setTimeout(REQUEST_TIMEOUT, () => {
        if (!isDone) {
          request.destroy();
          clearTimeout(globalTimeout);
          isDone = true;
          resolve({ isAvailable: false, statusCode: -1 });
        }
      });

      request.end();
    } catch (error) {
      if (!isDone) {
        if (request) request.destroy();
        clearTimeout(globalTimeout);
        isDone = true;
        resolve({ isAvailable: false, statusCode: 0 });
      }
    }
  });
}

async function checkArchive(url) {
  return new Promise((resolve) => {
    let isDone = false;
    let request;

    const globalTimeout = setTimeout(() => {
      if (!isDone) {
        if (request) request.destroy();
        isDone = true;
        resolve(null);
      }
    }, GLOBAL_TIMEOUT);

    try {
      const availabilityUrl = `https://archive.org/wayback/available?url=${encodeURIComponent(url)}`;
      request = https.get(availabilityUrl, {
        timeout: REQUEST_TIMEOUT,
        headers: { 'User-Agent': 'Mozilla/5.0' }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          if (!isDone) {
            clearTimeout(globalTimeout);
            try {
              const json = JSON.parse(data);
              isDone = true;
              resolve(json.archived_snapshots?.closest?.url || null);
            } catch {
              isDone = true;
              resolve(null);
            }
            request.destroy();
          }
        });
      });

      request.on('error', () => {
        if (!isDone) {
          clearTimeout(globalTimeout);
          request.destroy();
          isDone = true;
          resolve(null);
        }
      });

      request.setTimeout(REQUEST_TIMEOUT, () => {
        if (!isDone) {
          clearTimeout(globalTimeout);
          request.destroy();
          isDone = true;
          resolve(null);
        }
      });
    } catch {
      if (!isDone) {
        if (request) request.destroy();
        clearTimeout(globalTimeout);
        isDone = true;
        resolve(null);
      }
    }
  });
}

function getBrokenLinkUrl(url) {
    return `https://walletscrutiny.com/brokenlink/${encodeURIComponent(url)}`;
   }

async function updateFile(file, oldUrl, newUrl) {
  try {
    const content = await fs.readFile(file, 'utf8');
    const lines = content.split('\n');
    let updated = false;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('website:') && lines[i].includes(oldUrl)) {
        if (lines[i].includes('>-')) {
          lines[i] = `website: >-\n  ${newUrl}`;
        } else {
          lines[i] = `website: ${newUrl}`;
        }
        updated = true;
        break;
      }
    }

    if (!updated) return false;

    await fs.writeFile(file, lines.join('\n'));
    return true;
  } catch (error) {
    return false;
  }
}

async function processWebsite(site, currentIndex, total) {
  const filename = path.basename(site.file);
  const url = site.url.replace(/^>-\s*/, '').trim();
  
  console.log(`\n[${currentIndex}/${total}] ${filename}`);
  console.log(`Checking: ${url}`);
  
  for (const pattern of SKIP_URL_PATTERNS) {
    if (url.includes(pattern)) {
      console.log('URL pattern matched, skipping check');
      return null;
    }
  }
  
  const check = await checkSite(url);
  console.log(`Status: ${check.statusCode}`);
  
  if (!check.isAvailable) {
    console.log('Not available, checking Archive.org...');
    const archiveUrl = await checkArchive(url);
    if (archiveUrl) {
      const newUrl = `${archiveUrl} (archived)`;
      console.log('Found in Archive.org');
      console.log(`New URL: ${newUrl}`);
      const updated = await updateFile(site.file, url, newUrl);
      return updated ? { file: site.file, oldUrl: url, newUrl } : null;
    } else {
      const brokenUrl = getBrokenLinkUrl(site.file);
      const newUrl = `${brokenUrl} (broken)`;
      console.log('Not found in Archive.org');
      console.log(`New URL: ${newUrl}`);
      const updated = await updateFile(site.file, url, newUrl);
      return updated ? { file: site.file, oldUrl: url, newUrl } : null;
    }
  } else {
    console.log('Available ✓');
    return null;
  }
}

async function processBatch(sites, startIndex, total) {
  const promises = sites.map((site, idx) => 
    processWebsite(site, startIndex + idx + 1, total)
  );
  const results = await Promise.all(promises);
  return results.filter(r => r !== null);
}

async function main() {
  try {
    const directories = ['./_android', './_iphone', './_hardware', './_bearer', './_desktop', './_others'];
    const allWebsites = [];
    
    for (const dir of directories) {
      try {
        const files = await fs.readdir(dir);
        for (const file of files.filter(f => f.endsWith('.md'))) {
          const content = await fs.readFile(path.join(dir, file), 'utf8');
          const lines = content.split('\n');
          const websiteLine = lines.find(line => line.trim().startsWith('website:'));
          if (!websiteLine) continue;
          let websiteUrl = websiteLine.split('website:')[1].trim();
          if (!websiteUrl || websiteUrl === '') continue;
          if (websiteUrl.startsWith('>-')) {
            const nextLine = lines[lines.indexOf(websiteLine) + 1];
            websiteUrl = nextLine ? nextLine.trim() : '';
            if (!websiteUrl) continue;
          }
          allWebsites.push({ file: path.join(dir, file), url: websiteUrl });
        }
      } catch (error) {}
    }

    const batchSize = 5;
    const updates = [];
    
    for (let i = 0; i < allWebsites.length; i += batchSize) {
      const batch = allWebsites.slice(i, i + batchSize);
      const results = await processBatch(batch, i, allWebsites.length);
      updates.push(...results);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log(`Processed ${allWebsites.length} URLs.`);
    console.log(`Updated ${updates.length} URLs.`);
  } catch (error) {}
}

main();