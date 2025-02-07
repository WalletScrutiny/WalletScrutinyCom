const https = require('https');
const config = require('./config');

class InstagramChecker {
    static ERROR_PATTERNS = [
        "Sorry, this page isn't available",
        "The link you followed may be broken",
        "Page not found",
        "This Account Doesn't Exist",
        "This page could not be found",
        "<title>Instagram</title>"
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
            const req = https.request(url, {
                method: 'GET',
                timeout: config.TIMEOUTS.REQUEST,
                headers: config.getHeaders(),
                followRedirect: true
            }, (res) => {
                let body = '';
                
                res.on('data', chunk => {
                    body += chunk;
                });

                res.on('end', () => {
                    const hasErrorPattern = this.ERROR_PATTERNS.some(pattern => 
                        body.includes(pattern)
                    );

                    if (hasErrorPattern) {
                        resolve({ isAvailable: false, statusCode: res.statusCode });
                        return;
                    }

                    if (res.statusCode === 200 || [301, 302, 307, 308].includes(res.statusCode)) {
                        resolve({ isAvailable: true, statusCode: res.statusCode });
                        return;
                    }

                    resolve({ isAvailable: false, statusCode: res.statusCode });
                });
            });

            req.on('error', async (error) => {
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
                resolve({ isAvailable: false, statusCode: -1, error: 'Timeout' });
            });

            req.end();
        });
    }

    static isInstagramUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.includes('instagram.com');
        } catch {
            return false;
        }
    }
}

module.exports = InstagramChecker;