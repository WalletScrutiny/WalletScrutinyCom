const https = require('https');
const fs = require('fs').promises;
const path = require('path');

const FACEBOOK_CONFIG = {
  pattern: 'facebook.com',
  deadPatterns: [
    "This page isn't available",
    "This content isn't available",
    "Page not found"
  ]
};

const getBrokenLinkUrl = (url) => {
  if (url.includes('walletscrutiny.com/brokenlink/')) {
    return url;
  }
  return `https://walletscrutiny.com/brokenlink/${url}`;
};

const updateContent = (content, url) => {
  return content.replace(`- ${url}\n`, `- ${getBrokenLinkUrl(url)}\n`);
};

const getSocialUrls = (content) => {
  const socialMatch = content.match(/social:\n(?:-\s+.*\n)*/);
  if (!socialMatch) return [];

  return socialMatch[0]
    .split('\n')
    .filter(line => line.trim().startsWith('- '))
    .map(line => line.replace('- ', '').trim())
    .filter(url => url.includes(FACEBOOK_CONFIG.pattern));
};

const checkUrl = async (url) => {
  return new Promise((resolve) => {
    let req;
    const timeoutId = setTimeout(() => {
      if (req) req.destroy();
      resolve({ isAvailable: true, statusCode: -1 });
    }, 15000);

    try {
      let cleanUrl = url.split('#')[0].trim();
      if (cleanUrl.startsWith('http:')) {
        cleanUrl = cleanUrl.replace('http:', 'https:');
      }

      req = https.request(cleanUrl, {
        method: 'GET',
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
          'Accept-Language': 'en-US,en;q=0.9'
        },
        rejectUnauthorized: false
      }, (res) => {
        let body = '';

        if ([301, 302, 307, 308].includes(res.statusCode)) {
          clearTimeout(timeoutId);
          resolve({ isAvailable: true, statusCode: res.statusCode });
          return;
        }

        res.on('data', chunk => body += chunk);
        res.on('end', () => {
          clearTimeout(timeoutId);
          const isAvailable = !FACEBOOK_CONFIG.deadPatterns.some(
            pattern => body.includes(pattern)
          );
          resolve({ isAvailable, statusCode: res.statusCode });
        });
      });

      req.on('error', (error) => {
        clearTimeout(timeoutId);
        console.log(`Error checking ${url}: ${error.message}`);
        resolve({ isAvailable: true, statusCode: 0 });
      });

      req.on('timeout', () => {
        req.destroy();
        clearTimeout(timeoutId);
        resolve({ isAvailable: true, statusCode: -1 });
      });

      req.end();
    } catch (error) {
      clearTimeout(timeoutId);
      console.log(`Error checking ${url}: ${error.message}`);
      resolve({ isAvailable: true, statusCode: 0 });
    }
  });
};

// Feature flag for broken URL logging
const ENABLE_BROKEN_URL_LOG = true;
const BROKEN_URLS_FILE = 'broken_facebook_urls.txt';

// Function to log broken URLs - can be easily removed later
const logBrokenUrl = async (url, filePath, statusCode) => {
  if (!ENABLE_BROKEN_URL_LOG) return;
  
  const logEntry = `URL: ${url}\nFound in: ${filePath}\nStatus Code: ${statusCode}\n\n`;
  await fs.appendFile(BROKEN_URLS_FILE, logEntry).catch(err => {
    console.error('Error writing to broken URLs file:', err);
  });
};

// Clear the log file at the start if feature is enabled
const initializeBrokenUrlsLog = async () => {
  if (ENABLE_BROKEN_URL_LOG) {
    await fs.writeFile(BROKEN_URLS_FILE, '').catch(err => {
      console.error('Error clearing broken URLs file:', err);
    });
  }
};

const main = async () => {
    try {
      await initializeBrokenUrlsLog();  // Initialize log file if feature is enabled
  
      const directories = [
        './_android',
        './_iphone',
        './_hardware',
        './_bearer',
        './_desktop',
        './_others'
      ];
  
      const stats = {
        totalFiles: 0,
        processed: 0,
        facebookUrls: {
          total: 0,
          checked: 0,
          dead: 0
        }
      };
  
      const urlCache = new Map();
  
      // First pass remains the same...
      for (const dir of directories) {
        const files = await fs.readdir(dir);
        stats.totalFiles += files.length;
  
        for (const file of files) {
          const content = await fs.readFile(path.join(dir, file), 'utf8');
          const urls = getSocialUrls(content);
          stats.facebookUrls.total += urls.length;
        }
      }
  
      console.log(`Found ${stats.totalFiles} files to process`);
      console.log(`Found ${stats.facebookUrls.total} Facebook URLs to check`);
  
      // Second pass with broken URL logging
      for (const dir of directories) {
        const files = await fs.readdir(dir);
  
        for (const file of files) {
          stats.processed++;
          const filePath = path.join(dir, file);
          const content = await fs.readFile(filePath, 'utf8');
          let updatedContent = content;
          let needsUpdate = false;
  
          const urls = getSocialUrls(content);
          if (!urls.length) continue;
  
          for (const url of urls) {
            stats.facebookUrls.checked++;
  
            if (urlCache.has(url)) {
              const cached = urlCache.get(url);
              if (!cached.isAvailable) {
                console.log(`Cached check for ${url}: Dead (${cached.statusCode})`);
                stats.facebookUrls.dead++;
                updatedContent = updateContent(updatedContent, url);
                needsUpdate = true;
                await logBrokenUrl(url, filePath, cached.statusCode);  // Log cached broken URL
              }
              continue;
            }
  
            process.stdout.write(
              `[${stats.facebookUrls.checked}/${stats.facebookUrls.total}] Checking: ${url} ... `
            );
  
            const result = await checkUrl(url);
            urlCache.set(url, result);
  
            if (!result.isAvailable) {
              console.log(`❌ Dead (${result.statusCode})`);
              stats.facebookUrls.dead++;
              updatedContent = updateContent(updatedContent, url);
              needsUpdate = true;
              await logBrokenUrl(url, filePath, result.statusCode);  // Log newly found broken URL
            } else {
              console.log(`✅ Alive (${result.statusCode})`);
            }
  
            await new Promise(resolve => setTimeout(resolve, 100));
          }
  
          if (needsUpdate) {
            await fs.writeFile(filePath, updatedContent);
            console.log(`Updated ${file}`);
          }
        }
      }
  
      console.log('\n=== Summary ===');
      console.log(`Files processed: ${stats.processed}/${stats.totalFiles}`);
      console.log('\nFacebook:');
      console.log(`- URLs checked: ${stats.facebookUrls.checked}/${stats.facebookUrls.total}`);
      console.log(`- Dead URLs replaced: ${stats.facebookUrls.dead}`);
      if (ENABLE_BROKEN_URL_LOG) {
        console.log(`\nBroken URLs have been logged to ${BROKEN_URLS_FILE}`);
      }
  
    } catch (error) {
      console.error('An error occurred:', error.message);
    }
  };
  
  main();