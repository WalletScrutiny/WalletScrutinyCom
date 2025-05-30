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
            'LEGACY': 'https://api.github.com/repos/trezor/trezor-firmware/releases',
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
                    'Accept': 'application/vnd.github.v3+json'
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
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        resolve({
                            text: data,
                            json: () => {
                                try {
                                    return JSON.parse(data);
                                } catch (e) {
                                    throw new Error(`Invalid JSON: ${e.message}`);
                                }
                            }
                        });
                    } else if (res.statusCode === 403 && data.includes('rate limit')) {
                        // Handle rate limiting
                        if (retryCount < 3) {
                            setTimeout(() => {
                                this.makeRequest(url, retryCount + 1)
                                    .then(resolve)
                                    .catch(reject);
                            }, 1000 * (retryCount + 1));
                        } else {
                            reject(new Error(`Rate limit exceeded. Try again later or use a GitHub token.`));
                        }
                    } else if (res.statusCode === 406 && urlObj.hostname === 'github.com') {
                        // For HTML pages that return 406, try a different approach
                        // This happens with the legacy version page
                        const newUrl = url.replace('https://github.com', 'https://api.github.com/repos');
                        if (retryCount < 1) {
                            this.makeRequest(newUrl, retryCount + 1)
                                .then(resolve)
                                .catch(reject);
                        } else {
                            reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
                        }
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${res.statusMessage}`));
                    }
                });
            });
            
            // Set a timeout for the request
            req.setTimeout(10000, () => {
                req.destroy();
                reject(new Error('Request timeout after 10 seconds'));
            });
            
            req.on('error', (err) => {
                reject(err);
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
            
            if (modelCode === 'LEGACY') {
                // Handle legacy releases differently
                const releases = response.json();
                for (const release of releases) {
                    if (release.tag_name && release.tag_name.startsWith('legacy/')) {
                        const version = release.tag_name.replace('legacy/v', '');
                        return {
                            version: version,
                            filename: release.tag_name,
                            upload_date: release.published_at ? release.published_at.substring(0, 10) : 'N/A',
                            model_code: modelCode,
                            model_name: this.models[modelCode] || modelCode
                        };
                    }
                }
            } else {
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
     * Get latest legacy (Trezor One) version from GitHub tags page
     */
    async getLegacyVersion() {
        try {
            // Use GitHub tags page directly
            const url = "https://github.com/trezor/trezor-firmware/tags";
            console.log(`Fetching legacy version from: ${url}`);
            
            const response = await this.makeRequest(url);
            const html = response.text;
            
            // Parse the HTML to extract legacy tags and dates
            const legacyVersions = [];
            
            // First, extract all legacy version entries
            // Look for patterns like: legacy/v1.13.1
            const legacyEntries = html.match(/legacy\/v(\d+\.\d+\.\d+)[\s\S]*?(?=(?:legacy\/v|core\/v|<\/div>))/g) || [];
            
            for (const entry of legacyEntries) {
                // Extract version number
                const versionMatch = entry.match(/legacy\/v(\d+\.\d+\.\d+)/);
                if (!versionMatch) continue;
                
                const version = versionMatch[1];
                
                // Extract date information
                // Look for patterns like: "3 days ago" or "on Mar 6" or "May 26, 2025"
                const dateMatch = entry.match(/(\d+\s+days?\s+ago|on\s+[A-Za-z]+\s+\d+|[A-Za-z]+\s+\d+,\s+\d{4})/);
                
                let dateInfo = 'N/A';
                if (dateMatch) {
                    dateInfo = dateMatch[1].trim();
                    // Clean up date format if needed
                    if (dateInfo.startsWith('on ')) {
                        dateInfo = dateInfo.substring(3);
                    }
                }
                
                legacyVersions.push([version, dateInfo]);
                console.log(`Found legacy version: ${version} (${dateInfo})`);
            }
            
            // If we couldn't extract any versions with the above approach, try a simpler one
            if (legacyVersions.length === 0) {
                console.log("Using alternative parsing method for legacy versions...");
                
                // Find all legacy version tags
                const versionMatches = html.match(/legacy\/v(\d+\.\d+\.\d+)/g) || [];
                
                for (const vMatch of versionMatches) {
                    const version = vMatch.replace('legacy/v', '');
                    
                    // Find the date near this version tag
                    const sectionStart = html.indexOf(vMatch);
                    if (sectionStart === -1) continue;
                    
                    // Extract a chunk of HTML after the version
                    const chunk = html.substring(sectionStart, sectionStart + 200);
                    
                    // Try to find date patterns in this chunk
                    let dateInfo = 'N/A';
                    const dateMatch = chunk.match(/(\d+\s+days?\s+ago|on\s+[A-Za-z]+\s+\d+|[A-Za-z]+\s+\d+,\s+\d{4})/i);
                    if (dateMatch) {
                        dateInfo = dateMatch[1].trim();
                        if (dateInfo.startsWith('on ')) {
                            dateInfo = dateInfo.substring(3);
                        }
                    }
                    
                    legacyVersions.push([version, dateInfo]);
                    console.log(`Found legacy version (alt method): ${version} (${dateInfo})`);
                }
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
                
                const [latestVersion, dateInfo] = sortedVersions[0]; // Get the first (highest) version
                
                return {
                    version: latestVersion,
                    filename: `legacy/v${latestVersion}`,
                    upload_date: dateInfo,
                    model_code: 'LEGACY',
                    model_name: this.models['LEGACY']
                };
            } else {
                console.log("No legacy versions found on the tags page");
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
        console.log(`${'Model'.padEnd(20)} ${'Code'.padEnd(8)} ${'Version'.padEnd(10)} ${'Filename'.padEnd(25)} Upload Date`);
        console.log(`${'-'.repeat(80)}`);
        
        for (const [modelCode, info] of Object.entries(results)) {
            const modelName = info.model_name;
            const version = info.version;
            const filename = info.filename || 'N/A';
            const uploadDate = info.upload_date || info.date || 'N/A';
            console.log(`${modelName.padEnd(20)} ${modelCode.padEnd(8)} ${version.padEnd(10)} ${filename.padEnd(25)} ${uploadDate}`);
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
