const https = require('https');

const REQUEST_TIMEOUT = 10000;
const GLOBAL_TIMEOUT = 15000;
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

class TwitterChecker {
    static ERROR_PATTERNS = [
        'This account doesn\'t exist',
        'Account suspended',
        'This Tweet is unavailable',
        'This profile does not exist',
        'Page does not exist'
    ];

    static async checkUrl(url) {
        let cleanUrl = url.split('#')[0].trim();
        if (cleanUrl.startsWith('http:')) {
            cleanUrl = cleanUrl.replace('http:', 'https:');
        }
        if (!cleanUrl.startsWith('https://')) {
            cleanUrl = 'https://' + cleanUrl;
        }
        
        // Handle x.com URLs
        if (cleanUrl.includes('x.com')) {
            cleanUrl = cleanUrl.replace('x.com', 'twitter.com');
        }

        return this.makeRequest(cleanUrl);
    }

    static async makeRequest(url, retries = 0) {
        return new Promise((resolve) => {
            let req;
            const timeoutId = setTimeout(() => {
                if (req) req.destroy();
                resolve({ isAvailable: false, statusCode: -1 });
            }, GLOBAL_TIMEOUT);

            try {
                req = https.request(url, {
                    method: 'GET',
                    timeout: REQUEST_TIMEOUT,
                    headers: { 
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Cache-Control': 'no-cache',
                        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120"',
                        'Sec-Ch-Ua-Mobile': '?0',
                        'Sec-Ch-Ua-Platform': '"Windows"',
                        'Sec-Fetch-Dest': 'document',
                        'Sec-Fetch-Mode': 'navigate',
                        'Sec-Fetch-Site': 'none',
                        'Sec-Fetch-User': '?1',
                        'Upgrade-Insecure-Requests': '1'
                    },
                    followRedirect: true
                }, (res) => {
                    let body = '';
                    
                    if (res.statusCode === 200) {
                        res.on('data', chunk => body += chunk);
                        res.on('end', () => {
                            clearTimeout(timeoutId);
                            const hasErrorPattern = this.ERROR_PATTERNS.some(pattern => 
                                body.toLowerCase().includes(pattern.toLowerCase())
                            );

                            resolve({ 
                                isAvailable: !hasErrorPattern,
                                statusCode: res.statusCode 
                            });
                        });
                    } else if (res.statusCode === 404) {
                        clearTimeout(timeoutId);
                        resolve({ isAvailable: false, statusCode: res.statusCode });
                    } else if (res.statusCode === 429) {
                        clearTimeout(timeoutId);
                        resolve({ isAvailable: true, statusCode: res.statusCode });
                    } else if ([301, 302, 307, 308].includes(res.statusCode)) {
                        const location = res.headers.location || '';
                        const isErrorRedirect = location.includes('/404') || 
                                           location.includes('account/suspended');
                        resolve({ isAvailable: !isErrorRedirect, statusCode: res.statusCode });
                    } else {
                        clearTimeout(timeoutId);
                        resolve({ isAvailable: true, statusCode: res.statusCode });
                    }
                });

                req.on('error', async (error) => {
                    clearTimeout(timeoutId);
                    console.error(`Error checking ${url}: ${error.message}`);
                    if (retries < MAX_RETRIES) {
                        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
                        const result = await this.makeRequest(url, retries + 1);
                        resolve(result);
                    } else {
                        resolve({ isAvailable: false, statusCode: 0, error: error.message });
                    }
                });

                req.on('timeout', () => {
                    req.destroy();
                    clearTimeout(timeoutId);
                    resolve({ isAvailable: false, statusCode: -1, error: 'Timeout' });
                });

                req.end();

            } catch (error) {
                clearTimeout(timeoutId);
                console.error(`Error checking ${url}: ${error.message}`);
                resolve({ isAvailable: false, statusCode: 0 });
            }
        });
    }

    static isTwitterUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.includes('twitter.com') || urlObj.hostname.includes('x.com');
        } catch {
            return false;
        }
    }
}

module.exports = TwitterChecker;