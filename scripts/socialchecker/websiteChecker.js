const https = require("https");
const http = require("http");
const path = require("path");
const ArchiveChecker = require("./archiveChecker");

// Configuration
const CONFIG = {
    timeouts: {
        DNS: 5000,           // 5 seconds for DNS lookup
        CONNECT: 10000,      // 10 seconds to establish connection
        REQUEST: 30000,      // 30 seconds for request to complete
        GLOBAL: 45000,       // 45 seconds total
        BATCH: 60000         // 1 minute per batch
    },
    limits: {
        MAX_CONCURRENT_REQUESTS: 15,
        MAX_PER_HOST: 5,
        BATCH_SIZE: 10,
        REQUEST_DELAY: 500,  // 500ms between requests to same host
        MAX_REDIRECTS: 10,
        MAX_RETRIES: 2,
        MAX_CONTENT_LENGTH: 100 * 1024  // 100KB
    }
};

// Error patterns to detect dead or parked pages
const ERROR_PATTERNS = [
    'page not found',
    '404',
    'site unavailable',
    'domain not found',
    'website is no longer available',
    'this page does not exist',
    'domain expired',
    'account suspended',
    'parked domain',
    'error page',
    'site closed',
    'coming soon',
    'maintenance mode',
    'domain parking',
    'buy this domain',
    'website expired',
    'page deprecated',
    'account terminated',
    'service discontinued',
    'page not working',
    'website closed',
    'no longer in service',
    'this domain is for sale'
];

// User agents for request rotation
const userAgents = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
];

// Connection Pool Manager
class ConnectionPool {
    constructor() {
        this.activeConnections = new Map();
        this.lastRequestTime = new Map();
    }

    async acquire(hostname) {
        while (this.getActiveCount(hostname) >= CONFIG.limits.MAX_PER_HOST) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        const lastRequest = this.lastRequestTime.get(hostname) || 0;
        const timeSinceLastRequest = Date.now() - lastRequest;
        if (timeSinceLastRequest < CONFIG.limits.REQUEST_DELAY) {
            await new Promise(resolve => 
                setTimeout(resolve, CONFIG.limits.REQUEST_DELAY - timeSinceLastRequest)
            );
        }

        this.increment(hostname);
        this.lastRequestTime.set(hostname, Date.now());
    }

    release(hostname) {
        this.decrement(hostname);
    }

    getActiveCount(hostname) {
        return this.activeConnections.get(hostname) || 0;
    }

    increment(hostname) {
        this.activeConnections.set(hostname, this.getActiveCount(hostname) + 1);
    }

    decrement(hostname) {
        const count = this.getActiveCount(hostname) - 1;
        if (count <= 0) {
            this.activeConnections.delete(hostname);
        } else {
            this.activeConnections.set(hostname, count);
        }
    }
}

// Request Queue Manager
class RequestQueue {
    constructor(concurrency = CONFIG.limits.MAX_CONCURRENT_REQUESTS) {
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
        this.connectionPool = new ConnectionPool();
    }

    async add(hostname, fn) {
        if (this.running >= this.concurrency) {
            await new Promise(resolve => this.queue.push(resolve));
        }

        await this.connectionPool.acquire(hostname);
        
        this.running++;
        try {
            return await fn();
        } finally {
            this.running--;
            this.connectionPool.release(hostname);
            if (this.queue.length > 0) {
                const next = this.queue.shift();
                next();
            }
        }
    }
}

// Enhanced HTTP agents
const createAgent = (protocol) => {
    const Agent = protocol === 'https' ? https.Agent : http.Agent;
    return new Agent({
        keepAlive: true,
        keepAliveMsecs: 1000,
        maxSockets: CONFIG.limits.MAX_PER_HOST,
        maxFreeSockets: 10,
        timeout: CONFIG.timeouts.CONNECT,
        scheduling: 'lifo'
    });
};

const httpAgent = createAgent('http');
const httpsAgent = createAgent('https');

// Content validation function
function validateContent(data, headers) {
    if (!data || data.length < 50) {
        console.log('Content too small');
        return false;
    }

    const contentType = headers['content-type'] || '';
    const lowerData = data.toLowerCase();
    
    // Check for error patterns
    if (ERROR_PATTERNS.some(pattern => lowerData.includes(pattern))) {
        console.log('Found error pattern in content');
        return false;
    }

    // For HTML content
    if (contentType.includes('text/html')) {
        if (!lowerData.includes('<html') || !lowerData.includes('<body')) {
            console.log('Invalid HTML structure');
            return false;
        }

        if (lowerData.includes('domain parking') ||
            lowerData.includes('buy this domain') ||
            lowerData.includes('hosting provider')) {
            console.log('Found parking/hosting page indicators');
            return false;
        }
    }
    
    // For JSON content
    if (contentType.includes('application/json')) {
        try {
            JSON.parse(data);
        } catch {
            console.log('Invalid JSON content');
            return false;
        }
    }

    return true;
}

// Request handling functions
function isSuccessStatus(statusCode) {
    return (statusCode >= 200 && statusCode < 400) || 
           statusCode === 403 || 
           statusCode === 401;
}

function containsErrorIndicators(url) {
    const errorPaths = ['404', 'error', 'not-found', 'notfound', 'expired', 'suspended'];
    return errorPaths.some(path => url.toLowerCase().includes(path));
}

function shouldRetry(error, retryCount) {
    return retryCount < CONFIG.limits.MAX_RETRIES && 
           ['ECONNRESET', 'EPROTO', 'ETIMEDOUT'].includes(error.code);
}

// Main request function
async function makeRequest(url, method = 'HEAD', retryCount = 0, queue) {
    const hostname = url.hostname;
    
    return queue.add(hostname, async () => {
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
            }, CONFIG.timeouts.GLOBAL);

            try {
                const options = {
                    method,
                    timeout: CONFIG.timeouts.REQUEST,
                    headers: {
                        "User-Agent": userAgents[Math.floor(Math.random() * userAgents.length)],
                        "Accept": method === 'HEAD' ? '*/*' : "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                        "Accept-Language": "en-US,en;q=0.9",
                        "Cache-Control": "no-cache"
                    },
                    agent: url.protocol === 'https:' ? httpsAgent : httpAgent
                };

                request = (url.protocol === 'https:' ? https : http).request(url, options, (response) => {
                    let data = '';
                    
                    response.on('data', chunk => {
                        data += chunk;
                        if (data.length > CONFIG.limits.MAX_CONTENT_LENGTH) {
                            request.destroy();
                        }
                    });

                    response.on('end', () => {
                        if (!isDone) {
                            cleanup();
                            isDone = true;

                            // Handle redirects
                            if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
                                const location = response.headers.location;
                                if (location && containsErrorIndicators(location)) {
                                    resolve({
                                        isAvailable: false,
                                        statusCode: response.statusCode,
                                        error: 'Error redirect'
                                    });
                                    return;
                                }
                            }

                            let isAvailable = isSuccessStatus(response.statusCode);
                            if (isAvailable && method === 'GET') {
                                isAvailable = validateContent(data, response.headers);
                            }

                            resolve({
                                isAvailable,
                                statusCode: response.statusCode,
                                headers: response.headers,
                                data,
                                url: url.toString()
                            });
                        }
                    });
                });

                request.on('error', async (error) => {
                    if (!isDone) {
                        cleanup();
                        isDone = true;

                        if (shouldRetry(error, retryCount)) {
                            const altUrl = new URL(url);
                            altUrl.protocol = altUrl.protocol === 'https:' ? 'http:' : 'https:';
                            console.log(`Trying alternate protocol: ${altUrl.protocol}`);
                            
                            const result = await makeRequest(altUrl, method, retryCount + 1, queue);
                            resolve(result);
                        } else {
                            resolve({ 
                                isAvailable: false, 
                                statusCode: 0, 
                                error: error.message,
                                url: url.toString()
                            });
                        }
                    }
                });

                request.end();

            } catch (error) {
                cleanup();
                resolve({ 
                    isAvailable: false, 
                    statusCode: 0, 
                    error: error.message,
                    url: url.toString()
                });
            }
        });
    });
}

// Process individual website
async function processWebsite(site, currentIndex, total, updateFile, queue) {
    const filename = path.basename(site.file);
    let url = site.url.replace(/^>-\s*/, "").trim();
    let originalUrl = url;

    console.log(`\n[${currentIndex + 1}/${total}] ${filename}`);
    console.log(`Original URL: ${url}`);

    // CASE 1: Handle already broken links
    if (url.startsWith("https://walletscrutiny.com/brokenlink/")) {
        // Extract the original URL from the broken link
        const cleanUrl = url.replace("https://walletscrutiny.com/brokenlink/", "")
                           .replace(/^https?:\/\//, "");
        console.log(`Checking if broken link is now available: ${cleanUrl}`);
        
        // Try the original URL to see if it's back
        const testUrl = `https://${cleanUrl}`;
        try {
            const check = await makeRequest(new URL(testUrl), 'HEAD', 0, queue);
            
            if (check.isAvailable) {
                console.log("✅ Previously broken URL is now available");
                const updated = await updateFile(site.file, url, testUrl, site.type);
                return updated ? {
                    file: site.file,
                    oldUrl: url,
                    newUrl: testUrl,
                    status: "restored"
                } : null;
            }

            // If still broken, check archive
            console.log("Still broken, checking Archive.org...");
            const archiveResponse = await ArchiveChecker.checkArchive(testUrl, { returnFullResponse: true });
            
            if (archiveResponse?.available) {
                console.log(`Found in Archive.org with ${archiveResponse.snapshotCount} snapshots`);
                const updated = await updateFile(site.file, url, archiveResponse.url, site.type);
                return updated ? {
                    file: site.file,
                    oldUrl: url,
                    newUrl: archiveResponse.url,
                    status: "archived",
                    snapshotCount: archiveResponse.snapshotCount
                } : null;
            }
        } catch (error) {
            console.error(`Error checking broken link ${testUrl}:`, error);
        }
        return null;
    }

    // CASE 2: Handle archive.org URLs
    if (url.includes("web.archive.org/web/")) {
        const existingTimestamp = ArchiveChecker.extractTimestamp(url);
        const originalUrl = ArchiveChecker.extractOriginalUrl(url);
        
        if (!originalUrl) {
            console.log("Could not extract original URL from archive link");
            return null;
        }

        // Check if original site is back online
        const testUrl = `https://${originalUrl.replace(/^https?:\/\//, "")}`;
        console.log(`Checking if original URL is back: ${testUrl}`);
        
        try {
            const check = await makeRequest(new URL(testUrl), 'HEAD', 0, queue);
            
            if (check.isAvailable) {
                console.log("✅ Original URL is now available");
                const updated = await updateFile(site.file, url, testUrl, site.type);
                return updated ? {
                    file: site.file,
                    oldUrl: url,
                    newUrl: testUrl,
                    status: "restored"
                } : null;
            }

            // Check for newer archive snapshot
            console.log("Checking for newer archive snapshot...");
            const archiveResponse = await ArchiveChecker.checkArchive(testUrl, { returnFullResponse: true });
            
            if (archiveResponse?.available && 
                archiveResponse.timestamp && 
                existingTimestamp && 
                archiveResponse.timestamp > existingTimestamp) {
                
                console.log(`Found newer snapshot: ${archiveResponse.timestamp} (current: ${existingTimestamp})`);
                const updated = await updateFile(site.file, url, archiveResponse.url, site.type);
                return updated ? {
                    file: site.file,
                    oldUrl: url,
                    newUrl: archiveResponse.url,
                    status: "updated_archive",
                    snapshotCount: archiveResponse.snapshotCount
                } : null;
            }

            console.log("No newer snapshot available");
        } catch (error) {
            console.error(`Error checking archived URL ${testUrl}:`, error);
        }
        return null;
    }

    // CASE 3: Handle regular URLs
    try {
        // Clean and normalize the URL
        let cleanUrl = url.replace(/^https?:\/\//, "");
        const testUrl = `https://${cleanUrl}`;
        console.log(`Testing URL: ${testUrl}`);

        // First check if website is available
        const urlObj = new URL(testUrl);
        let check = await makeRequest(urlObj, 'HEAD', 0, queue);
        
        // If HEAD request fails, try GET
        if (!check.isAvailable && check.statusCode !== 404) {
            console.log('HEAD request failed, trying GET...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            check = await makeRequest(urlObj, 'GET', 0, queue);
        }

        // If website is available, we're done
        if (check.isAvailable) {
            console.log("✅ URL is available");
            if (url !== testUrl) {
                const updated = await updateFile(site.file, originalUrl, testUrl, site.type);
                return updated ? {
                    file: site.file,
                    oldUrl: originalUrl,
                    newUrl: testUrl,
                    status: "normalized"
                } : null;
            }
            return null;
        }

        // If website is down, check Archive.org
        console.log("URL not available, checking Archive.org...");
        const archiveResponse = await ArchiveChecker.checkArchive(testUrl, { returnFullResponse: true });

        if (archiveResponse?.available) {
            console.log(`Found in Archive.org with ${archiveResponse.snapshotCount} snapshots`);
            const updated = await updateFile(site.file, originalUrl, archiveResponse.url, site.type);
            return updated ? {
                file: site.file,
                oldUrl: originalUrl,
                newUrl: archiveResponse.url,
                status: "archived",
                snapshotCount: archiveResponse.snapshotCount
            } : null;
        }

        // If no archive found, mark as broken
        console.log("Not found in Archive.org, marking as broken");
        const brokenUrl = `https://walletscrutiny.com/brokenlink/https://${cleanUrl}`;
        const updated = await updateFile(site.file, originalUrl, brokenUrl, site.type);
        return updated ? {
            file: site.file,
            oldUrl: originalUrl,
            newUrl: brokenUrl,
            status: "broken"
        } : null;

    } catch (error) {
        console.error(`Error processing website ${url}:`, error);
        return null;
    }
}
// Process websites in parallel
async function processWebsitesInParallel(sites, updateFile) {
    const queue = new RequestQueue();
    const results = [];
    const totalSites = sites.length;
    
    // Process in batches to control memory usage
    for (let i = 0; i < totalSites; i += CONFIG.limits.BATCH_SIZE) {
        const batch = sites.slice(i, Math.min(i + CONFIG.limits.BATCH_SIZE, totalSites));
        console.log(`\nProcessing batch ${Math.floor(i/CONFIG.limits.BATCH_SIZE) + 1} of ${Math.ceil(totalSites/CONFIG.limits.BATCH_SIZE)}`);
        
        try {
            const batchPromises = batch.map((site, index) => 
                processWebsite(site, i + index, totalSites, updateFile, queue)
                    .catch(error => {
                        console.error(`Error processing site ${site.url}:`, error);
                        return null;
                    })
            );
            
            const batchResults = await Promise.all(batchPromises);
            results.push(...batchResults.filter(r => r !== null));
            
            // Add delay between batches
            if (i + CONFIG.limits.BATCH_SIZE < totalSites) {
                console.log(`Waiting ${CONFIG.limits.REQUEST_DELAY * 2}ms before next batch...`);
                await new Promise(resolve => setTimeout(resolve, CONFIG.limits.REQUEST_DELAY * 2));
            }
        } catch (error) {
            console.error(`Error processing batch starting at index ${i}:`, error);
            // Continue with next batch despite errors
        }
    }

    return results;
}

// Export the module
module.exports = {
    processWebsite,
    processWebsitesInParallel,
    makeRequest,
    CONFIG,  // Export config for potential runtime adjustments
    RequestQueue,  // Export queue for external use if needed
    validateContent  // Export for testing purposes
};