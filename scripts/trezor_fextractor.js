#!/usr/bin/env node
/**
 * Trezor Firmware Version Extractor (Clean)
 * Usage:
 *   ./trezor_fextractor.js [-g GITHUB_TOKEN] [--json] [--model MODEL_CODE] [--debug]
 *
 * Options:
 *   -g TOKEN    GitHub Personal Access Token to avoid rate limiting
 *   --json      Output results in simple JSON format for easier parsing
 *   --model     Specify a single model code to get info for (LEGACY, T2T1, T2B1, T3T1)
 *   --debug     Print status/progress info to stderr (in JSON mode)
 */

const https = require('https');
const http = require('http');
const { URL } = require('url');
const process = require('process');

class TrezorFirmwareExtractor {
    constructor(options = {}) {
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
        this.githubToken = options.githubToken || process.env.GITHUB_TOKEN || null;
        this.jsonOutput = options.jsonOutput || false;
        this.debug = options.debug || false;

        this.models = {
            'T2B1': 'Trezor Safe 3',
            'T2T1': 'Trezor Model T',
            'LEGACY': 'Trezor Model One',
            'T3T1': 'Trezor Safe 5'
        };

        this.firmwareDirs = {
            'T2B1': 'https://api.github.com/repos/trezor/data/contents/firmware/t2b1?ref=master',
            'T2T1': 'https://api.github.com/repos/trezor/data/contents/firmware/t2t1?ref=master',
            'LEGACY': 'https://github.com/trezor/trezor-firmware/tags',
            'T3T1': 'https://api.github.com/repos/trezor/data/contents/firmware/t3t1?ref=master'
        };

        this.rateLimitRemaining = 60;
        this.rateLimitReset = 0;
        this.tokenMessageShown = false;
    }

    log(message) {
        if (this.debug) {
            // Always stderr, so JSON stays clean
            console.error(message);
        }
    }

    async makeRequest(url, retryCount = 0) {
        const now = Math.floor(Date.now() / 1000);
        if (this.rateLimitRemaining <= 1 && this.rateLimitReset > now) {
            const waitTime = Math.min((this.rateLimitReset - now + 1) * 1000, 5000);
            if (retryCount === 0) {
                this.log(`Rate limited by GitHub. Waiting ${Math.ceil(waitTime/1000)} seconds...`);
                if (!this.tokenMessageShown && !this.githubToken) {
                    this.log('Tip: Use -g parameter to provide a GitHub token and avoid rate limits.');
                    this.tokenMessageShown = true;
                }
            }
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
                    'Accept': url.includes('api.github.com') ? 'application/vnd.github.v3+json' : 'text/html,application/xhtml+xml'
                }
            };

            if (this.githubToken) {
                options.headers['Authorization'] = `token ${this.githubToken}`;
            }

            const req = lib.request(options, (res) => {
                let data = '';

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
                        this.rateLimitRemaining = 0;
                        if (retryCount < 3) {
                            setTimeout(() => {
                                this.makeRequest(url, retryCount + 1)
                                    .then(resolve)
                                    .catch(reject);
                            }, 5000);
                        } else {
                            reject(new Error('GitHub API rate limit exceeded. Try using a token with the -g parameter.'));
                        }
                        return;
                    }

                    if (res.statusCode >= 400) {
                        reject(new Error(`HTTP error ${res.statusCode}: ${data}`));
                        return;
                    }

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

            req.setTimeout(30000, () => {
                req.abort();
                reject(new Error('Request timed out'));
            });

            req.end();
        });
    }

    async getLatestFromFirmwareDir(modelCode) {
        try {
            const url = this.firmwareDirs[modelCode];
            if (!url) {
                this.log(`No firmware directory URL defined for ${modelCode}`);
                return null;
            }

            this.log(`Processing ${modelCode} (${this.models[modelCode]})...`);

            if (modelCode === 'LEGACY') {
                return await this.getLegacyVersion();
            }

            const response = await this.makeRequest(url);
            const files = response.json();
            if (!Array.isArray(files)) {
                this.log(`  ✗ No firmware files for ${modelCode}`);
                return null;
            }

            let latest = null;
            let latestVersion = null;
            let latestFilename = null;
            for (const item of files) {
                if (item.type !== 'file' || !item.name.endsWith('.bin') || item.name.endsWith('-bitcoinonly.bin')) {
                    continue;
                }
                // trezor-t2b1-2.8.10.bin etc.
                const versionMatch = item.name.match(/-(\d+\.\d+\.\d+)\.bin$/);
                if (!versionMatch) continue;
                const version = versionMatch[1];

                // pick the highest version
                if (!latestVersion || this.versionCompare(version, latestVersion) > 0) {
                    latestVersion = version;
                    latest = item;
                    latestFilename = item.name;
                }
            }

            if (latest && latestVersion) {
                // Get upload date from commit info
                let uploadDate = 'N/A';
                try {
                    const commitsUrl = `https://api.github.com/repos/trezor/data/commits?path=firmware/${modelCode.toLowerCase()}/${latestFilename}&page=1&per_page=1`;
                    const commitResponse = await this.makeRequest(commitsUrl);
                    const commits = commitResponse.json();
                    if (commits && Array.isArray(commits) && commits.length > 0) {
                        uploadDate = commits[0].commit.committer.date.substring(0, 10);
                    }
                } catch (commitError) {
                    this.log(`  ⚠ Couldn't fetch commit info for ${latestFilename}: ${commitError.message}`);
                }
                return {
                    version: latestVersion,
                    filename: latestFilename,
                    upload_date: uploadDate,
                    model_code: modelCode,
                    model_name: this.models[modelCode] || modelCode
                };
            } else {
                this.log(`  ✗ Failed to extract version info for ${modelCode}`);
            }
        } catch (error) {
            this.log(`Error getting firmware dir for ${modelCode}: ${error.message}`);
        }
        return null;
    }

    versionCompare(a, b) {
        // "2.8.10" > "2.8.9"
        const pa = a.split('.').map(Number);
        const pb = b.split('.').map(Number);
        for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
            const na = pa[i] || 0;
            const nb = pb[i] || 0;
            if (na > nb) return 1;
            if (na < nb) return -1;
        }
        return 0;
    }

    async extractAllVersionsFirmwareDirs() {
        const results = {};
        for (const modelCode of Object.keys(this.firmwareDirs)) {
            if (modelCode === 'LEGACY') continue;
            const result = await this.getLatestFromFirmwareDir(modelCode);
            if (result) {
                results[modelCode] = result;
            }
        }
        return results;
    }

    async getLegacyVersion() {
        try {
            const apiUrl = "https://api.github.com/repos/trezor/trezor-firmware/tags?per_page=100";
            this.log(`Fetching legacy version from GitHub API: ${apiUrl}`);
            const response = await this.makeRequest(apiUrl);
            const tags = response.json();
            if (!tags || !Array.isArray(tags)) {
                this.log("Failed to get tags from GitHub API");
                return null;
            }
            // Only legacy tags
            const legacyTags = tags.filter(tag => tag.name && tag.name.startsWith('legacy/v'));
            if (legacyTags.length === 0) {
                this.log("No legacy tags found");
                return null;
            }
            // Get latest by version
            let latest = null;
            let latestVersion = null;
            let latestDate = null;
            for (const tag of legacyTags) {
                const versionMatch = tag.name.match(/legacy\/v(\d+\.\d+\.\d+)/);
                if (!versionMatch) continue;
                const version = versionMatch[1];
                let dateInfo = 'N/A';
                try {
                    if (tag.commit && tag.commit.url) {
                        const commitResponse = await this.makeRequest(tag.commit.url);
                        const commitData = commitResponse.json();
                        if (commitData && commitData.commit && commitData.commit.committer && commitData.commit.committer.date) {
                            const dateStr = commitData.commit.committer.date;
                            if (dateStr && typeof dateStr === 'string' && dateStr.includes('T')) {
                                dateInfo = dateStr.split('T')[0];
                            }
                        }
                    }
                } catch (commitError) {
                    this.log(`  ⚠ Couldn't fetch commit info for ${tag.name}: ${commitError.message}`);
                }
                if (!latestVersion || this.versionCompare(version, latestVersion) > 0) {
                    latestVersion = version;
                    latest = tag;
                    latestDate = dateInfo;
                }
            }
            if (latestVersion && latestDate) {
                return {
                    version: latestVersion,
                    filename: `legacy/v${latestVersion}`,
                    upload_date: latestDate,
                    model_code: 'LEGACY',
                    model_name: this.models['LEGACY']
                };
            }
        } catch (error) {
            this.log(`Error getting legacy version: ${error.message}`);
        }
        return null;
    }

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
    }
}

function parseArgs() {
    const args = process.argv.slice(2);
    const options = {};
    for (let i = 0; i < args.length; i++) {
        if (args[i] === '-g' && i + 1 < args.length) {
            options.githubToken = args[i + 1];
            i++;
        } else if (args[i] === '--json') {
            options.jsonOutput = true;
        } else if (args[i] === '--model' && i + 1 < args.length) {
            options.modelCode = args[i + 1].toUpperCase();
            i++;
        } else if (args[i] === '--debug') {
            options.debug = true;
        }
    }
    return options;
}

async function main() {
    const options = parseArgs();
    const extractor = new TrezorFirmwareExtractor(options);

    try {
        // Get model code if present
        let firmwareResults = {};
        if (options.modelCode) {
            const model = options.modelCode;
            if (model === 'LEGACY') {
                const legacyInfo = await extractor.getLegacyVersion();
                if (legacyInfo) firmwareResults[model] = legacyInfo;
            } else {
                const info = await extractor.getLatestFromFirmwareDir(model);
                if (info) firmwareResults[model] = info;
            }
        } else {
            firmwareResults = await extractor.extractAllVersionsFirmwareDirs();
            const legacyInfo = await extractor.getLegacyVersion();
            if (legacyInfo) firmwareResults['LEGACY'] = legacyInfo;
        }

        if (options.jsonOutput) {
            if (options.modelCode && firmwareResults[options.modelCode]) {
                const modelInfo = firmwareResults[options.modelCode];
                // Output single model as {"version": "...", "date": "..."}
                console.log(JSON.stringify({
                    version: modelInfo.version || "unknown",
                    date: modelInfo.upload_date || modelInfo.date || ""
                }));
                return;
            }
            // Output all models in JSON format
            const jsonOutput = {};
            for (const [modelCode, info] of Object.entries(firmwareResults)) {
                jsonOutput[modelCode] = {
                    version: info.version,
                    date: info.upload_date || info.date || ''
                };
            }
            console.log(JSON.stringify(jsonOutput));
        } else {
            // Pretty table output for human reading
            extractor.displayResults(firmwareResults, "FIRMWARE DIRECTORY METHOD");
        }
    } catch (error) {
        if (options.jsonOutput) {
            console.log(JSON.stringify({version: "unknown", date: new Date().toISOString().split('T')[0], error: error.message}));
        } else {
            console.error("Error during extraction:", error.message);
        }
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { TrezorFirmwareExtractor };
