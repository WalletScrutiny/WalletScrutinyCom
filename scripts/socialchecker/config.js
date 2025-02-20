const DEFAULT_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
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
};

const TIMEOUTS = {
    REQUEST: 10000,    // 10 seconds for individual request
    GLOBAL: 15000,     // 15 seconds total operation timeout
    RETRY_DELAY: 1000, // 1 second between retries
};

const LIMITS = {
    MAX_RETRIES: 2,
    MAX_REDIRECTS: 10,
    MAX_CONTENT_LENGTH: 100 * 1024  // 100KB
};

module.exports = {
    DEFAULT_HEADERS,
    TIMEOUTS,
    LIMITS,
    
    // Helper function to get headers with optional overrides
    getHeaders: (overrides = {}) => ({
        ...DEFAULT_HEADERS,
        ...overrides
    })
};