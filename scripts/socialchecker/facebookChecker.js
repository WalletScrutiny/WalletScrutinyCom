// facebookChecker.js
const https = require('https');

const FACEBOOK_CONFIG = {
    pattern: 'facebook.com',
    requestTimeout: 10000,
    globalTimeout: 15000,
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache'
    },
    deadPatterns: [
        "This page isn't available",
        "This content isn't available",
        "Page not found"
    ]
};

const checkUrl = async (url) => {
    return new Promise((resolve) => {
        let req;
        const timeoutId = setTimeout(() => {
            if (req) req.destroy();
            resolve({ isAvailable: false, statusCode: -1 });
        }, FACEBOOK_CONFIG.globalTimeout);

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
                timeout: FACEBOOK_CONFIG.requestTimeout,
                headers: FACEBOOK_CONFIG.headers,
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
                    const isAvailable = !FACEBOOK_CONFIG.deadPatterns.some(
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
};

module.exports = {
    checkUrl,
    pattern: FACEBOOK_CONFIG.pattern
};