const https = require('https');
const config = require('./config');

class LinkedInChecker {
    static ERROR_PATTERNS = [
        'page-not-found',
        'this page is not available',
        'Page not found',
        'linkedin.com/404'
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
            }, config.TIMEOUTS.GLOBAL);

            try {
                req = https.request(url, {
                    method: 'GET',
                    timeout: config.TIMEOUTS.REQUEST,
                    headers: config.getHeaders({
                        'Sec-Ch-Ua': '"Not_A Brand";v="8", "Chromium";v="120"',
                        'Sec-Ch-Ua-Mobile': '?0',
                        'Sec-Ch-Ua-Platform': '"Windows"'
                    }),
                    followRedirect: true
                }, (res) => {
                    let body = '';
                    
                    // Status code 999 means LinkedIn is blocking us
                    if (res.statusCode === 999) {
                        clearTimeout(timeoutId);
                        resolve({ isAvailable: true, statusCode: res.statusCode });
                        return;
                    }

                    // Handle redirects
                    if ([301, 302, 307, 308].includes(res.statusCode)) {
                        clearTimeout(timeoutId);
                        const location = res.headers.location || '';
                        const isErrorRedirect = location.includes('/404') || 
                                           location.includes('page-not-found');
                        resolve({ isAvailable: !isErrorRedirect, statusCode: res.statusCode });
                        return;
                    }

                    res.on('data', chunk => body += chunk);
                    res.on('end', () => {
                        clearTimeout(timeoutId);
                        const hasErrorPattern = this.ERROR_PATTERNS.some(pattern => 
                            body.toLowerCase().includes(pattern.toLowerCase())
                        );

                        const isAvailable = res.statusCode === 200 && !hasErrorPattern;
                        resolve({ 
                            isAvailable,
                            statusCode: res.statusCode 
                        });
                    });
                });

                req.on('error', async (error) => {
                    clearTimeout(timeoutId);
                    console.error(`Error checking ${url}: ${error.message}`);
                    if (retries < config.LIMITS.MAX_RETRIES) {
                        await new Promise(resolve => setTimeout(resolve, config.TIMEOUTS.RETRY_DELAY));
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

    static isLinkedInUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.includes('linkedin.com') && 
                   urlObj.pathname.startsWith('/company/');
        } catch {
            return false;
        }
    }
}

module.exports = LinkedInChecker;