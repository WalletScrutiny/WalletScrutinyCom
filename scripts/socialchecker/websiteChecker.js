const https = require("https");
const http = require("http");
const path = require("path");
const ArchiveChecker = require("./archiveChecker");

const REQUEST_TIMEOUT = 45000;  // 45 seconds
const GLOBAL_TIMEOUT = 90000;   // 90 seconds
const MAX_REDIRECTS = 15;
const MAX_CONNECTIONS_PER_HOST = 5;  // Reduced from 10 to 5 for stability
const MAX_RETRIES = 2;
const REQUEST_DELAY = 1000;  // 1 second delay between requests

const httpsAgent = new https.Agent({ 
    keepAlive: true,
    rejectUnauthorized: false,
    maxSockets: MAX_CONNECTIONS_PER_HOST,
    timeout: REQUEST_TIMEOUT
});

const httpAgent = new http.Agent({ 
    keepAlive: true,
    maxSockets: MAX_CONNECTIONS_PER_HOST,
    timeout: REQUEST_TIMEOUT
});

const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0"
];

// Function to make an HTTP/HTTPS request with retries
async function makeRequest(url, method = 'HEAD', retryCount = 0) {
    return new Promise((resolve) => {
        let isDone = false;
        let request;

        const cleanup = () => {
            if (request) request.destroy();
            clearTimeout(timeoutId);
        };

        const timeoutId = setTimeout(() => {
            if (!isDone) {
                cleanup();
                isDone = true;
                resolve({ isAvailable: false, statusCode: -1, error: 'Global Timeout' });
            }
        }, GLOBAL_TIMEOUT);

        try {
            const options = {
                method,
                timeout: REQUEST_TIMEOUT,
                headers: {
                    "User-Agent": userAgents[Math.floor(Math.random() * userAgents.length)],
                    "Accept": method === 'HEAD' ? '*/*' : "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
                    "Accept-Language": "en-US,en;q=0.9",
                    "Cache-Control": "no-cache"
                },
                agent: url.protocol === 'https:' ? httpsAgent : httpAgent
            };

            request = (url.protocol === 'https:' ? https : http).request(url, options, (response) => {
                let data = '';
                response.on('data', chunk => {
                    data += chunk;
                    if (data.length > 50 * 1024) request.destroy(); // Limit response size
                });

                response.on('end', () => {
                    if (!isDone) {
                        cleanup();
                        isDone = true;
                        resolve({
                            isAvailable: (response.statusCode >= 200 && response.statusCode < 400) || 
                                       response.statusCode === 403 || 
                                       response.statusCode === 401,
                            statusCode: response.statusCode,
                            headers: response.headers,
                            data
                        });
                    }
                });
            });

            request.on('error', async (error) => {
                if (!isDone) {
                    cleanup();
                    isDone = true;

                    // Retry with alternate protocol if appropriate
                    if (retryCount < MAX_RETRIES && 
                        ['ECONNRESET', 'EPROTO', 'ETIMEDOUT'].includes(error.code)) {
                        const altUrl = new URL(url);
                        altUrl.protocol = altUrl.protocol === 'https:' ? 'http:' : 'https:';
                        console.log(`Trying alternate protocol: ${altUrl.protocol}`);
                        
                        await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY));
                        const result = await makeRequest(altUrl, method, retryCount + 1);
                        resolve(result);
                    } else {
                        resolve({ isAvailable: false, statusCode: 0, error: error.message });
                    }
                }
            });

            request.end();

        } catch (error) {
            cleanup();
            resolve({ isAvailable: false, statusCode: 0, error: error.message });
        }
    });
}

async function processWebsite(site, currentIndex, total, updateFile) {
    const filename = path.basename(site.file);
    let url = site.url.replace(/^>-\s*/, "").trim();
    let originalUrl = url;

    console.log(`\n[${currentIndex + 1}/${total}] ${filename}`);
    console.log(`Checking: ${url}`);

    // Handle already broken/archived links
    if (url.startsWith("https://walletscrutiny.com/brokenlink/")) {
        url = url.replace("https://walletscrutiny.com/brokenlink/", "");
        console.log(`Extracted original URL: ${url}`);
    }

    try {
        // Try HEAD request first
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        let check = await makeRequest(urlObj, 'HEAD');
        
        // If HEAD fails, try GET
        if (!check.isAvailable && check.statusCode !== 404) {
            console.log('HEAD request failed, trying GET...');
            await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY));
            check = await makeRequest(urlObj, 'GET');
        }

        // Handle success cases
        if (check.isAvailable) {
            console.log("✅ URL is available");
            return null;
        }

        // If not available, check archive
        console.log("Not available, checking Archive.org...");
        const archiveUrl = await ArchiveChecker.checkArchive(url);

        if (archiveUrl) {
            console.log("Found in Archive.org");
            const updated = await updateFile(site.file, originalUrl, archiveUrl, site.type);
            return updated ? {
                file: site.file,
                oldUrl: originalUrl,
                newUrl: archiveUrl,
                status: "archived"
            } : null;
        } else {
            // Mark as broken
            const cleanUrl = url
                .replace(/^https?:\/\/(walletscrutiny\.com\/brokenlink\/|web\.archive\.org\/web\/\d+\/)/, "")
                .replace(/^https?:\/\//, "");
            const brokenUrl = `https://walletscrutiny.com/brokenlink/https://${cleanUrl}`;
            
            console.log("Not found in Archive.org");
            const updated = await updateFile(site.file, originalUrl, brokenUrl, site.type);
            return updated ? {
                file: site.file,
                oldUrl: originalUrl,
                newUrl: brokenUrl,
                status: "broken"
            } : null;
        }
    } catch (error) {
        console.error(`Error processing website ${url}:`, error);
        return null;
    }
}

async function processWebsitesInParallel(sites, updateFile, batchSize = 5) {
    const results = [];
    const totalSites = sites.length;
    
    for (let i = 0; i < totalSites; i += batchSize) {
        const batch = sites.slice(i, i + batchSize);
        console.log(`\nProcessing batch ${Math.floor(i/batchSize) + 1} of ${Math.ceil(totalSites/batchSize)}`);
        
        try {
            const promises = batch.map((site, index) => 
                processWebsite(site, i + index, totalSites, updateFile)
            );
            
            const batchResults = await Promise.all(promises);
            results.push(...batchResults.filter(r => r !== null));
            
            // Add delay between batches
            if (i + batchSize < totalSites) {
                await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY * 2));
            }
        } catch (error) {
            console.error(`Error processing batch starting at index ${i}:`, error);
        }
    }

    return results;
}

module.exports = {
    processWebsite,
    processWebsitesInParallel
};