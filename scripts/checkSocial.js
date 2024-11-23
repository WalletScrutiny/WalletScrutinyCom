const https = require('https');
const fs = require('fs').promises;
const path = require('path');

const PLATFORMS = {
   YOUTUBE: { key: 'youtube', pattern: 'youtube.com/channel/', deadPatterns: [
       'This channel does not exist', 'This page isn\'t available', 
       'Channel unavailable', 'account has been terminated'
   ]},
   FACEBOOK: { key: 'facebook', pattern: 'facebook.com', deadPatterns: [
       'This page isn\'t available', 'This content isn\'t available', 'Page not found'
   ]},
   INSTAGRAM: { key: 'instagram', pattern: 'instagram.com', deadPatterns: [
       '<title>Instagram</title>',
       'Sorry, this page isn\'t available',
       'The link you followed may be broken',
       '<h2>This Account Doesn&#x27;t Exist</h2>'
   ]},
   LINKEDIN: { key: 'linkedin', pattern: 'linkedin.com/company/', deadPatterns: [
       'page-not-found', 'this page is not available'
   ]},
   TWITTER: { key: 'twitter', pattern: 'twitter.com', deadPatterns: [
       'This account doesn\'t exist', 'Account suspended'
   ]},
   GITHUB: { key: 'github', pattern: 'github.com', deadPatterns: [
       '<title>Not Found',
       'This is not the web page you are looking for',
       'Repository access blocked',
       'steps that are horribly wrong'
   ]}
};

const PLATFORM_BY_KEY = Object.values(PLATFORMS).reduce((acc, platform) => {
   acc[platform.key] = platform;
   return acc;
}, {});

const getGithubUrls = (content) => {
   const urls = [];
   const repoMatch = content.match(/repository:\s*(https:\/\/github\.com\/[^\s\n]+)/);
   if (repoMatch) urls.push(repoMatch[1]);

   const issueMatch = content.match(/issue:\s*(https:\/\/github\.com\/[^\s\n]+)/);
   if (issueMatch) urls.push(issueMatch[1]);

   const socialMatch = content.match(/social:\n(?:-\s+.*\n)*/);
   if (socialMatch) {
       const socialUrls = socialMatch[0].split('\n')
           .filter(line => line.trim().startsWith('- '))
           .map(line => line.replace('- ', '').trim())
           .filter(url => url.includes('github.com'));
       urls.push(...socialUrls);
   }

   return urls;
};

const getSocialUrls = (content, platformKey) => {
   const platform = PLATFORM_BY_KEY[platformKey];
   if (!platform) return [];

   if (platform.key === 'github') {
       return getGithubUrls(content);
   }

   const socialMatch = content.match(/social:\n(?:-\s+.*\n)*/);
   if (!socialMatch) return [];

   return socialMatch[0].split('\n')
       .filter(line => line.trim().startsWith('- '))
       .map(line => line.replace('- ', '').trim())
       .filter(url => url.includes(platform.pattern));
};

const checkUrl = async (url, platform) => {
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
                   const location = res.headers.location || '';
                   
                   if (platform === 'instagram') {
                       const isLoginRedirect = location.includes('login') || 
                                            location.includes('accounts.instagram.com');
                       clearTimeout(timeoutId);
                       resolve({ 
                           isAvailable: isLoginRedirect || res.statusCode === 302,
                           statusCode: res.statusCode 
                       });
                       return;
                   }

                   clearTimeout(timeoutId);
                   resolve({ isAvailable: true, statusCode: res.statusCode });
                   return;
               }

               res.on('data', chunk => body += chunk);
               res.on('end', () => {
                   clearTimeout(timeoutId);
                   const platformConfig = PLATFORM_BY_KEY[platform];
                   
                   if (platform === 'instagram') {
                       const isError = platformConfig.deadPatterns.some(pattern => body.includes(pattern));
                       resolve({ 
                           isAvailable: res.statusCode === 200 && !isError,
                           statusCode: res.statusCode 
                       });
                       return;
                   }

                   if (platform === 'github') {
                       const isError = platformConfig.deadPatterns.some(pattern => body.includes(pattern));
                       resolve({ 
                           isAvailable: res.statusCode !== 404 && !isError,
                           statusCode: res.statusCode 
                       });
                       return;
                   }

                   const isAvailable = platformConfig ? 
                       !platformConfig.deadPatterns.some(pattern => body.includes(pattern)) :
                       res.statusCode === 200;
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

const updateContent = (content, url, platform) => {
   if (platform === 'github') {
       if (content.includes(`repository: ${url}`)) {
           return content.replace(`repository: ${url}`, 'repository: ');
       } else if (content.includes(`issue: ${url}`)) {
           return content.replace(`issue: ${url}`, 'issue: ');
       }
   }
   return content.replace(`- ${url}\n`, '');
};

const main = async () => {
   try {
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
           urls: Object.fromEntries(Object.keys(PLATFORM_BY_KEY).map(key => [key, { total: 0, checked: 0, dead: 0 }]))
       };
       
       const urlCache = new Map();

       for (const dir of directories) {
           const files = await fs.readdir(dir);
           stats.totalFiles += files.length;
           
           for (const file of files) {
               const content = await fs.readFile(path.join(dir, file), 'utf8');
               Object.keys(PLATFORM_BY_KEY).forEach(platformKey => {
                   const urls = getSocialUrls(content, platformKey);
                   stats.urls[platformKey].total += urls.length;
               });
           }
       }

       console.log(`Found ${stats.totalFiles} files to process`);
       Object.entries(stats.urls).forEach(([platform, { total }]) => {
           console.log(`Found ${total} ${platform} URLs to check`);
       });

       for (const dir of directories) {
           const files = await fs.readdir(dir);
           
           for (const file of files) {
               stats.processed++;
               const filePath = path.join(dir, file);
               const content = await fs.readFile(filePath, 'utf8');
               let updatedContent = content;
               let needsUpdate = false;

               for (const platformKey of Object.keys(PLATFORM_BY_KEY)) {
                   const urls = getSocialUrls(content, platformKey);
                   if (!urls.length) continue;

                   for (const url of urls) {
                       stats.urls[platformKey].checked++;

                       if (urlCache.has(url)) {
                           const cached = urlCache.get(url);
                           if (!cached.isAvailable) {
                               console.log(`[${platformKey}] Cached check for ${url}: Dead (${cached.statusCode})`);
                               stats.urls[platformKey].dead++;
                               updatedContent = updateContent(updatedContent, url, platformKey);
                               needsUpdate = true;
                           }
                           continue;
                       }

                       process.stdout.write(`[${platformKey} ${stats.urls[platformKey].checked}/${stats.urls[platformKey].total}] Checking: ${url} ... `);
                       
                       const result = await checkUrl(url, platformKey);
                       urlCache.set(url, result);
                       
                       if (!result.isAvailable) {
                           console.log(`❌ Dead (${result.statusCode})`);
                           stats.urls[platformKey].dead++;
                           updatedContent = updateContent(updatedContent, url, platformKey);
                           needsUpdate = true;
                       } else {
                           console.log(`✅ Alive (${result.statusCode})`);
                       }

                       await new Promise(resolve => setTimeout(resolve, 100));
                   }
               }

               if (needsUpdate) {
                   await fs.writeFile(filePath, updatedContent);
                   console.log(`Updated ${file}`);
               }
           }
       }
       
       console.log('\n=== Summary ===');
       console.log(`Files processed: ${stats.processed}/${stats.totalFiles}`);
       Object.entries(stats.urls).forEach(([platform, { checked, total, dead }]) => {
           console.log(`\n${platform}:`);
           console.log(`- URLs checked: ${checked}/${total}`);
           console.log(`- Dead URLs removed: ${dead}`);
       });
       
   } catch (error) {
       console.error('An error occurred:', error.message);
   }
};

main();