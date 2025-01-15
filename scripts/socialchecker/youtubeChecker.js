const https = require('https');

const REQUEST_TIMEOUT = 10000;
const GLOBAL_TIMEOUT = 15000;
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

class YouTubeChecker {
    static ERROR_PATTERNS = [
        'This channel does not exist',
        'This page isn\'t available',
        'Channel unavailable',
        'account has been terminated',
        '404 Not Found',
        'channel-empty-message'
    ];

    static async checkUrl(url) {
        let cleanUrl = url.split('#')[0].trim();
        if (cleanUrl.startsWith('http:')) {
            cleanUrl = cleanUrl.replace('http:', 'https:');
        }
        if (!cleanUrl.startsWith('https://')) {
            cleanUrl = 'https://' + cleanUrl;
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
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
                        'Accept-Language': 'en-US,en;q=0.9',
                        'Cache-Control': 'no-cache'
                    },
                    followRedirect: true
                }, (res) => {
                    let body = '';

                    if ([301, 302, 307, 308].includes(res.statusCode)) {
                        clearTimeout(timeoutId);
                        const location = res.headers.location || '';
                        const isErrorRedirect = location.includes('/oops') || 
                                              location.includes('error') ||
                                              location.includes('404');
                        resolve({ isAvailable: !isErrorRedirect, statusCode: res.statusCode });
                        return;
                    }

                    res.on('data', chunk => body += chunk);
                    res.on('end', () => {
                        clearTimeout(timeoutId);
                        const hasDeadPattern = this.ERROR_PATTERNS.some(pattern => 
                            body.includes(pattern)
                        );

                        resolve({ 
                            isAvailable: !hasDeadPattern,
                            statusCode: res.statusCode 
                        });
                    });
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

    static isYouTubeUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be');
        } catch {
            return false;
        }
    }
}

module.exports = YouTubeChecker;