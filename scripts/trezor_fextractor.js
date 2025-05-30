#!/usr/bin/env node
/**
 * Trezor Firmware Version Extractor
 *
 * This script extracts the latest firmware version information for different Trezor models
 * by checking firmware binary directories for the latest versions
 *
 * Usage:
 *   ./trezor_fextractor.js [-g GITHUB_TOKEN]
 *
 * Options:
 *   -g TOKEN    GitHub Personal Access Token to avoid rate limiting
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const process = require('process');
// No external dependencies required

class TrezorFirmwareExtractor {
    constructor(options = {}) {
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
        
        // Set GitHub token if provided
        this.githubToken = options.githubToken || process.env.GITHUB_TOKEN || null;
        
        // Model mappings
        this.models = {
            'T2B1': 'Trezor Safe 3',
            'T2T1': 'Trezor Model T',
            'LEGACY': 'Trezor Model One',
            'T3T1': 'Trezor Safe 5'  // Note: T3T1 might also be Safe 5 variant
        };
        
        // Firmware directory URLs (GitHub API)
        this.firmwareDirs = {
            'T2B1': 'https://api.github.com/repos/trezor/data/contents/firmware/t2b1?ref=master',
            'T2T1': 'https://api.github.com/repos/trezor/data/contents/firmware/t2t1?ref=master',
            'LEGACY': 'https://github.com/trezor/trezor-firmware/tags', // Changed to tags page for legacy
            'T3T1': 'https://api.github.com/repos/trezor/data/contents/firmware/t3t1?ref=master'
        };
        
        // Rate limit handling
        this.rateLimitRemaining = 60; // Default GitHub API rate limit
        this.rateLimitReset = 0;
        this.tokenMessageShown = false;
    }

    /**
     * Make HTTP/HTTPS request with rate limit handling
     */
    async makeRequest(url, retryCount = 0) {
        // Check if we're rate limited and need to wait
        const now = Math.floor(Date.now() / 1000);
        if (this.rateLimitRemaining <= 1 && this.rateLimitReset > now) {
            const waitTime = Math.min((this.rateLimitReset - now + 1) * 1000, 5000); // Cap wait time at 5 seconds
            if (retryCount === 0) {
                console.log(`Rate limited by GitHub. Waiting ${Math.ceil(waitTime/1000)} seconds...`);
                if (!this.tokenMessageShown && !this.githubToken) {
                    console.log('Tip: Use -g parameter to provide a GitHub token and avoid rate limits.');
                    this.tokenMessageShown = true;
                }
            }
            // Wait for rate limit to reset (with a cap)
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        
        return new Promise((resolve, reject) => {
            const urlObj = new URL(url);
            const isHttps = urlObj.protocol === 'https:';
            const lib = isHttps ? https : http;
            
            const options = {
                hostname: urlObj.hostname,
                port: urlObj.port || (isHttps ? 443 : 80),
                path: urlObj.pathname + urlObj.search,
                method: 'GET',
                headers: {
                    'User-Agent': this.userAgent,
                    // Use different Accept header based on URL
                    'Accept': url.includes('api.github.com') ? 'application/vnd.github.v3+json' : 'text/html,application/xhtml+xml'
                }
            };
            
            // Add GitHub token if available
            if (this.githubToken) {
                options.headers['Authorization'] = `token ${this.githubToken}`;
            }

            // Add a timeout to the request
            const req = lib.request(options, (res) => {
                let data = '';
                
                // Update rate limit info from headers
                if (res.headers['x-ratelimit-remaining']) {
                    this.rateLimitRemaining = parseInt(res.headers['x-ratelimit-remaining'], 10);
                }
                if (res.headers['x-ratelimit-reset']) {
                    this.rateLimitReset = parseInt(res.headers['x-ratelimit-reset'], 10);
                }
                
                res.on('data', (chunk) => {
                    data += chunk;
                });
                
                res.on('end', () => {
                    if (res.statusCode === 403 && data.includes('rate limit')) {
                        // Handle rate limiting
                        this.rateLimitRemaining = 0;
                        
                        if (retryCount < 3) {
                            // Try again after waiting
                            setTimeout(() => {
                                this.makeRequest(url, retryCount + 1)
                                    .then(resolve)
                                    .catch(reject);
                            }, 5000); // Wait 5 seconds before retrying
                        } else {
                            reject(new Error('GitHub API rate limit exceeded. Try using a token with the -g parameter.'));
                        }
                        return;
                    }
                    
                    if (res.statusCode >= 400) {
                        reject(new Error(`HTTP error ${res.statusCode}: ${data}`));
                        return;
                    }
                    
                    // Return an object with both text and json methods
                    resolve({
                        text: data,
                        json: () => {
                            try {
                                return JSON.parse(data);
                            } catch (e) {
                                return null;
                            }
                        }
                    });
                });
            });
            
            req.on('error', (err) => {
                reject(err);
            });
            
            // Set a timeout for the request
            req.setTimeout(30000, () => {
                req.abort();
                reject(new Error('Request timed out'));
            });
            
            req.end();
        });
    }

    /**
     * Get latest firmware version from GitHub directory listing
     */
    async getLatestFromFirmwareDir(modelCode) {
        try {
            const url = this.firmwareDirs[modelCode];
            const response = await this.makeRequest(url);
            
            // Only handle non-LEGACY models here (LEGACY is handled separately in getLegacyVersion)
            if (modelCode !== 'LEGACY') {
                const files = response.json();
                
                // Extract version numbers from .bin files
                const versions = [];
                for (const fileInfo of files) {
                    if (fileInfo.name.endsWith('.bin') && !fileInfo.name.endsWith('-bitcoinonly.bin')) {
                        // Extract version from filename like "trezor-t3t1-2.8.10.bin"
                        const match = fileInfo.name.match(/-(\d+\.\d+\.\d+)\.bin$/);
                        if (match) {
                            const version = match[1];
                            // We'll collect versions first, then fetch commit info for the latest one only
                            versions.push([version, fileInfo.name]);
                        }
                    }
                }
                
                if (versions.length > 0) {
                    // Sort versions to get the latest
                    const latestVersion = versions.reduce((max, current) => {
                        const maxParts = max[0].split('.').map(Number);
                        const currentParts = current[0].split('.').map(Number);
                        
                        for (let i = 0; i < Math.max(maxParts.length, currentParts.length); i++) {
                            const maxPart = maxParts[i] || 0;
                            const currentPart = currentParts[i] || 0;
                            
                            if (currentPart > maxPart) return current;
                            if (currentPart < maxPart) return max;
                        }
                        return max;
                    });
                    
                    // Try to extract date from commit information
                    let uploadDate = 'N/A';
                    
                    try {
                        const commitsUrl = `https://api.github.com/repos/trezor/data/commits?path=firmware/${modelCode.toLowerCase()}/${latestVersion[1]}&page=1&per_page=1`;
                        const commitResponse = await this.makeRequest(commitsUrl);
                        const commits = commitResponse.json();
                        
                        if (commits && commits.length > 0) {
                            uploadDate = commits[0].commit.committer.date.substring(0, 10);
                        }
                    } catch (commitError) {
                        console.log(`  ⚠ Couldn't fetch commit info for ${latestVersion[1]}: ${commitError.message}`);
                        if (commitError.message.includes('rate limit') && !this.githubToken) {
                            console.log(`  ℹ Try using a GitHub token with the -g parameter to get upload dates`);
                        }
                    }
                    
                    return {
                        version: latestVersion[0],
                        filename: latestVersion[1],
                        upload_date: uploadDate,
                        model_code: modelCode,
                        model_name: this.models[modelCode] || modelCode
                    };
                }
            }
        } catch (error) {
            console.error(`Error getting firmware dir for ${modelCode}: ${error.message}`);
            if (error.message.includes('rate limit') && !this.githubToken) {
                console.log(`  ℹ Try using a GitHub token with the -g parameter to avoid rate limits`);
            }
        }
        return null;
    }

    /**
     * Extract version information from firmware directories
     */
    async extractAllVersionsFirmwareDirs() {
        const results = {};

        console.log("\nExtracting from firmware directories...");
        for (const modelCode of Object.keys(this.firmwareDirs)) {
            // Skip LEGACY model here as it will be handled separately
            if (modelCode === 'LEGACY') continue;
            
            console.log(`Processing ${modelCode} (${this.models[modelCode] || modelCode})...`);
            const result = await this.getLatestFromFirmwareDir(modelCode);
            if (result) {
                results[modelCode] = result;
                console.log(`  ✓ Found version ${result.version} (${result.filename || 'N/A'}) [${result.upload_date || 'N/A'}]`);
            } else {
                console.log(`  ✗ Failed to extract version info`);
            }
        }

        return results;
    }

    /**
     * Get latest legacy (Trezor One) version from GitHub API
     */
    async getLegacyVersion() {
        try {
            // Use GitHub API to get tags
            const apiUrl = "https://api.github.com/repos/trezor/trezor-firmware/tags?per_page=100";
            console.log(`Fetching legacy version from GitHub API: ${apiUrl}`);

            const response = await this.makeRequest(apiUrl);
            const tags = response.json();

            if (!tags || !Array.isArray(tags)) {
                console.log("Failed to get tags from GitHub API");
                return null;
            }

            console.log(`Found ${tags.length} tags to process`);

            // Filter for legacy tags (format: legacy/v1.x.x)
            const legacyTags = tags.filter(tag => tag.name && tag.name.startsWith('legacy/v'));
            console.log(`Found ${legacyTags.length} legacy tags`);

            if (legacyTags.length === 0) {
                console.log("No legacy tags found");
                return null;
            }

            // Extract version numbers and commit info
            const legacyVersions = [];
            for (const tag of legacyTags) {
                const versionMatch = tag.name.match(/legacy\/v(\d+\.\d+\.\d+)/);
                if (!versionMatch) continue;

                const version = versionMatch[1];
                const commitHash = (tag.commit && tag.commit.sha) ? tag.commit.sha.substring(0, 7) : 'N/A';

                // Get commit details to extract date
                let dateInfo = 'N/A';
                try {
                    if (tag.commit && tag.commit.url) {
                        const commitResponse = await this.makeRequest(tag.commit.url);
                        const commitData = commitResponse.json();
                        
                        if (commitData && commitData.commit && commitData.commit.committer && commitData.commit.committer.date) {
                            // Format: 2025-05-27T12:34:56Z -> 2025-05-27
                            const dateStr = commitData.commit.committer.date;
                            if (dateStr && typeof dateStr === 'string' && dateStr.includes('T')) {
                                dateInfo = dateStr.split('T')[0];
                            }
                        }
                    }
                } catch (commitError) {
                    console.log(`  ⚠ Couldn't fetch commit info for ${tag.name}: ${commitError.message}`);
                }

                legacyVersions.push([version, dateInfo, commitHash]);
                console.log(`Found legacy version: ${version} (${dateInfo}) [${commitHash}]`);
            }

            if (legacyVersions.length > 0) {
                // Sort versions to get the latest
                const sortedVersions = legacyVersions.sort((a, b) => {
                    const aParts = a[0].split('.').map(Number);
                    const bParts = b[0].split('.').map(Number);
                    
                    for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
                        const aPart = aParts[i] || 0;
                        const bPart = bParts[i] || 0;
                        
                        if (aPart !== bPart) {
                            return bPart - aPart; // Reverse order for descending sort
                        }
                    }
                    return 0;
                });
                
                const [latestVersion, dateInfo, commitHash] = sortedVersions[0]; // Get the first (highest) version
                console.log(`✓ Latest legacy version: ${latestVersion} (${dateInfo}) [${commitHash}]`);
                
                return {
                    version: latestVersion,
                    filename: `legacy/v${latestVersion}`,
                    upload_date: dateInfo,
                    commit_hash: commitHash,
                    model_code: 'LEGACY',
                    model_name: this.models['LEGACY']
                };
            } else {
                console.log("No legacy versions found");
            }
        } catch (error) {
            console.log(`Error getting legacy version: ${error.message}`);
            if (error.message.includes('rate limit') && !this.githubToken) {
                console.log(`  ℹ Try using a GitHub token with the -g parameter to avoid rate limits`);
            }
        }
        return null;
    }

    /**
     * Display results in a formatted table
     */
    displayResults(results, methodName) {
        console.log(`\n${'='.repeat(80)}`);
        console.log(`RESULTS - ${methodName}`);
        console.log(`${'='.repeat(80)}`);
        console.log(`${'Model'.padEnd(20)} ${'Code'.padEnd(8)} ${'Version'.padEnd(10)} ${'Filename'.padEnd(25)} ${'Upload Date'.padEnd(15)} Commit`);
        console.log(`${'-'.repeat(80)}`);
        
        for (const [modelCode, info] of Object.entries(results)) {
            const modelName = info.model_name;
            const version = info.version;
            const filename = info.filename || 'N/A';
            const uploadDate = info.upload_date || info.date || 'N/A';
            const commitHash = info.commit_hash || 'N/A';
            console.log(`${modelName.padEnd(20)} ${modelCode.padEnd(8)} ${version.padEnd(10)} ${filename.padEnd(25)} ${uploadDate.padEnd(15)} ${commitHash}`);
        }
        
        // Add note about GitHub token if needed
        if (!this.githubToken) {
            console.log(`\nNote: For complete upload date information, use a GitHub token:`);
            console.log(`Example: ./scripts/trezor_fextractor.js -g YOUR_GITHUB_TOKEN`);
        }
    }
}

/**
 * Parse command line arguments
 */
function parseArgs() {
    const args = process.argv.slice(2);
    const options = {};
    
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '-g' && i + 1 < args.length) {
            options.githubToken = args[i + 1];
            i++; // Skip the next argument as it's the token value
        }
    }
    
    return options;
}

async function main() {
    // Parse command line arguments
    const options = parseArgs();
    const extractor = new TrezorFirmwareExtractor(options);
    
    console.log("Trezor Firmware Version Extractor");
    console.log("=".repeat(50));
    
    // Display token status
    if (extractor.githubToken) {
        console.log("Using GitHub token: ✓");
    } else {
        console.log("No GitHub token provided. API rate limits may apply.");
        console.log("Use -g parameter to provide a token.");
    }
    
    try {
        // Extract firmware versions from directories
        const firmwareResults = await extractor.extractAllVersionsFirmwareDirs();
        
        // Get legacy version
        console.log("\nGetting legacy (Trezor One) version...");
        const legacyInfo = await extractor.getLegacyVersion();
        if (legacyInfo) {
            firmwareResults['LEGACY'] = legacyInfo;
            console.log(`  ✓ Found legacy version ${legacyInfo.version}`);
        }
        
        // Display results
        extractor.displayResults(firmwareResults, "FIRMWARE DIRECTORY METHOD");
        
        // Print a summary
        const allModels = new Set([...Object.keys(firmwareResults)]);
        console.log(`\n✓ Extraction completed at ${new Date().toISOString()}`);
        console.log(`✓ Found information for ${allModels.size} Trezor models`);
        
        // Add performance tip if no token was used
        if (allModels.size > 0 && !extractor.githubToken) {
            console.log(`\nTip: For faster results with complete date information, use a GitHub token with -g parameter.`);
        }
        
        // Print the URLs used for reference
        console.log("\nReference URLs:");
        console.log("- GitHub Tags: https://github.com/trezor/trezor-firmware/tags"); // Used for legacy version extraction
        for (const [model, url] of Object.entries(extractor.firmwareDirs)) {
            console.log(`- ${model} Firmware: ${url}`);
        }
        
    } catch (error) {
        console.error("Error during extraction:", error.message);
        process.exit(1);
    }
}

// Run the script if called directly
if (require.main === module) {
    main();
}

module.exports = { TrezorFirmwareExtractor };
