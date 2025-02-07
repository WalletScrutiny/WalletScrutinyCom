const https = require('https');
const config = require('./config');

class FacebookChecker {
    static ERROR_PATTERNS = [
        "This page isn't available",
        "This content isn't available",
        "Page not found"
    ];

    static async checkUrl(url) {
        let cleanUrl = url.split('#')[0].trim();
        if (cleanUrl.startsWith('http:')) {
            cleanUrl = cleanUrl.replace('http:', 'https:');
        }
        if (!cleanUrl.startsWith('https://')) {
            cleanUrl = 'https://' + cleanUrl;
        }

        return new Promise((resolve) => {
            let req;
            const timeoutId = setTimeout(() => {
                if (req) req.destroy();
                resolve({ isAvailable: false, statusCode: -1 });
            }, config.TIMEOUTS.GLOBAL);

            try {
                let cleanUrl = url.split('#')[0].trim();
                if (cleanUrl.startsWith('http:')) {
                    cleanUrl = cleanUrl.replace('http:', 'https:');
                }
                if (!cleanUrl.startsWith('https://')) {
                    cleanUrl = 'https://' + cleanUrl;
                }

                req = https.request(cleanUrl, {
                    method: 'GET',
                    timeout: config.TIMEOUTS.REQUEST,
                    headers: config.getHeaders(),
                    rejectUnauthorized: false
                }, (res) => {
                    let body = '';

                    // Handle redirects
                    if ([301, 302, 307, 308].includes(res.statusCode)) {
                        clearTimeout(timeoutId);
                        resolve({ isAvailable: true, statusCode: res.statusCode });
                        return;
                    }

                    // Handle rate limiting
                    if (res.statusCode === 429) {
                        clearTimeout(timeoutId);
                        resolve({ isAvailable: true, statusCode: res.statusCode });
                        return;
                    }

                    res.on('data', chunk => body += chunk);
                    res.on('end', () => {
                        clearTimeout(timeoutId);
                        const isAvailable = !this.ERROR_PATTERNS.some(
                            pattern => body.includes(pattern)
                        );
                        resolve({
                            isAvailable,
                            statusCode: res.statusCode,
                            body: body.length  // useful for debugging
                        });
                    });
                });

                req.on('error', (error) => {
                    clearTimeout(timeoutId);
                    console.error(`Error checking ${cleanUrl}: ${error.message}`);
                    resolve({ isAvailable: false, statusCode: 0, error: error.message });
                });

                req.on('timeout', () => {
                    req.destroy();
                    clearTimeout(timeoutId);
                    console.error(`Timeout checking ${cleanUrl}`);
                    resolve({ isAvailable: false, statusCode: -1 });
                });

                req.end();

            } catch (error) {
                clearTimeout(timeoutId);
                console.error(`Error setting up request for ${url}: ${error.message}`);
                resolve({ isAvailable: false, statusCode: 0 });
            }
        });
    }

    static isValidFacebookUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname.includes('facebook.com');
        } catch {
            return false;
        }
    }
}

module.exports = FacebookChecker;