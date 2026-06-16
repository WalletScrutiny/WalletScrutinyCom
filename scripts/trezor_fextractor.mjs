#!/usr/bin/env node

/**
 * Trezor Firmware Version Extractor (Clean)
 * Usage:
 *   ./trezor_fextractor.mjs [-g GITHUB_TOKEN] [--json] [--model MODEL_CODE] [--debug]
 *
 * Options:
 *   -g TOKEN    GitHub Personal Access Token to avoid rate limiting
 *   --json      Output results in simple JSON format for easier parsing
 *   --model     Specify a single model code to get info for (T1B1, T2T1, T2B1, T3T1, T3W1; LEGACY = tag-based Trezor One)
 *   --debug     Print status/progress info to stderr (in JSON mode)
 */

import https from 'https';
import http from 'http';
import { URL } from 'url';
import process from 'process';

class TrezorFirmwareExtractor {
    constructor(options = {}) {
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
        this.githubToken = options.githubToken || process.env.GITHUB_TOKEN || null;
        this.jsonOutput = options.jsonOutput || false;
        this.debug = options.debug || false;

        this.models = {
            'T1B1': 'Trezor Model One',
            'T2B1': 'Trezor Safe 3',
            'T2T1': 'Trezor Model T',
            'LEGACY': 'Trezor Model One',
            'T3T1': 'Trezor Safe 5',
            'T3W1': 'Trezor Safe 7'
        };

        this.firmwareDirs = {
            'T1B1': 'https://api.github.com/repos/trezor/data/contents/firmware/t1b1?ref=master',
            'T2B1': 'https://api.github.com/repos/trezor/data/contents/firmware/t2b1?ref=master',
            'T2T1': 'https://api.github.com/repos/trezor/data/contents/firmware/t2t1?ref=master',
            'LEGACY': 'https://github.com/trezor/trezor-firmware/tags',
            'T3T1': 'https://api.github.com/repos/trezor/data/contents/firmware/t3t1?ref=master',
            'T3W1': 'https://api.github.com/repos/trezor/data/contents/firmware/t3w1?ref=master'
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
                                this.makeRequest(url, retryCount + 1).then(resolve).catch(reject);
                            }, 2000);
                            return;
                        }
                    }

                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        try {
                            const result = {
                                data: data,
                                statusCode: res.statusCode,
                                headers: res.headers,
                                json: () => {
                                    try {
                                        return JSON.parse(data);
                                    } catch (e) {
                                        throw new Error(`Invalid JSON response: ${e.message}`);
                                    }
                                }
                            };
                            resolve(result);
                        } catch (error) {
                            reject(new Error(`Response processing error: ${error.message}`));
                        }
                    } else {
                        reject(new Error(`HTTP ${res.statusCode}: ${data}`));
                    }
                });
            });

            req.on('error', (error) => {
                reject(new Error(`Request failed: ${error.message}`));
            });

            req.setTimeout(30000, () => {
                req.destroy();
                reject(new Error('Request timeout'));
            });

            req.end();
        });
    }

    async getLatestFromFirmwareDir(modelCode) {
        try {
            const url = this.firmwareDirs[modelCode];
            if (!url) {
                throw new Error(`Unknown model code: ${modelCode}`);
            }

            this.log(`Fetching firmware info for ${modelCode} from ${url}`);
            const response = await this.makeRequest(url);
            const files = response.json();

            if (!Array.isArray(files)) {
                throw new Error(`Expected array of files, got: ${typeof files}`);
            }

            const binFiles = files.filter(file => 
                file.name && file.name.endsWith('.bin') && 
                file.name.includes(modelCode.toLowerCase())
            );

            if (binFiles.length === 0) {
                throw new Error(`No .bin files found for model ${modelCode}`);
            }

            // Sort by version (extract version from filename)
            binFiles.sort((a, b) => {
                const versionA = this.extractVersionFromFilename(a.name);
                const versionB = this.extractVersionFromFilename(b.name);
                return this.versionCompare(versionB, versionA); // Descending order
            });

            const latestFile = binFiles[0];
            const version = this.extractVersionFromFilename(latestFile.name);

            // Get commit date from GitHub API
            let uploadDate = new Date().toISOString().split('T')[0];
            try {
                const commitUrl = `https://api.github.com/repos/trezor/data/commits?path=firmware/${modelCode.toLowerCase()}/${latestFile.name}&per_page=1`;
                const commitResponse = await this.makeRequest(commitUrl);
                const commits = commitResponse.json();
                if (commits && commits.length > 0) {
                    uploadDate = commits[0].commit.author.date.split('T')[0];
                }
            } catch (error) {
                this.log(`Could not get commit date for ${latestFile.name}: ${error.message}`);
            }

            return {
                version: version,
                filename: latestFile.name,
                upload_date: uploadDate,
                model_code: modelCode,
                model_name: this.models[modelCode]
            };

        } catch (error) {
            this.log(`Error getting firmware for ${modelCode}: ${error.message}`);
            return null;
        }
    }

    extractVersionFromFilename(filename) {
        // Extract version from filename like "trezor-t2b1-2.8.10.bin"
        const match = filename.match(/(\d+\.\d+\.\d+)/);
        return match ? match[1] : 'unknown';
    }

    versionCompare(a, b) {
        if (a === b) return 0;
        if (a === 'unknown') return -1;
        if (b === 'unknown') return 1;
        
        const aParts = a.split('.').map(Number);
        const bParts = b.split('.').map(Number);
        
        for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
            const aPart = aParts[i] || 0;
            const bPart = bParts[i] || 0;
            if (aPart !== bPart) {
                return aPart - bPart;
            }
        }
        return 0;
    }

    async extractAllVersionsFirmwareDirs() {
        const results = {};
        for (const modelCode of ['T1B1', 'T2B1', 'T2T1', 'T3T1', 'T3W1']) {
            const info = await this.getLatestFromFirmwareDir(modelCode);
            if (info) {
                results[modelCode] = info;
            }
        }
        return results;
    }

    async getLegacyVersion() {
    this.log('Fetching legacy (Trezor One) version using GitHub API...');
    const repoPath = 'trezor/trezor-firmware';
    let latestVersion = null;
    let latestDate = null;
    let source = 'tag'; // Default to tag for legacy

    try {
      this.log('Fetching tags for LEGACY model (trezor/trezor-firmware)...');
      // Fetch multiple pages to ensure we get the legacy tags
      // (legacy tags may not be on the first page due to other component tags)
      let allTags = [];
      let page = 1;
      const maxPages = 5; // Fetch up to 5 pages (500 tags) to find legacy tags

      while (page <= maxPages) {
        const tagsUrl = `https://api.github.com/repos/${repoPath}/tags?per_page=100&page=${page}`;
        const tagsResponse = await this.makeRequest(tagsUrl);
        const pageTags = tagsResponse.json();

        if (!pageTags || !Array.isArray(pageTags) || pageTags.length === 0) {
          break; // No more tags
        }

        allTags = allTags.concat(pageTags);
        this.log(`Fetched page ${page}: ${pageTags.length} tags (total: ${allTags.length})`);

        // If we found legacy tags, we can stop after this page
        const hasLegacyTags = pageTags.some(tag => tag.name && tag.name.startsWith('legacy/'));
        if (hasLegacyTags) {
          this.log(`Found legacy tags on page ${page}`);
          break;
        }

        page++;
      }

      if (!allTags || allTags.length === 0) {
        this.log('No tags found or error fetching tags for LEGACY model.');
        return null;
      }

      const legacyVersionRegex = /^legacy\/v(\d+\.\d+\.\d+)$/;
      const legacyTags = allTags
        .filter(tag => tag.name && legacyVersionRegex.test(tag.name))
        .map(tag => {
          const match = tag.name.match(legacyVersionRegex);
          return {
            name: tag.name, // Full tag name like legacy/v1.12.1
            version: match[1], // Just the version part like 1.12.1
            commitSha: tag.commit.sha
          };
        })
        .sort((a, b) => {
          // Compare versions like 1.12.1 vs 1.9.0
          const verA = a.version.split('.').map(Number);
          const verB = b.version.split('.').map(Number);
          for (let i = 0; i < Math.max(verA.length, verB.length); i++) {
            const numA = verA[i] || 0;
            const numB = verB[i] || 0;
            if (numA !== numB) return numB - numA; // Sort descending by version
          }
          return 0;
        });

      if (legacyTags.length === 0) {
        this.log('No tags matching legacy/vX.Y.Z pattern found.');
        // As a fallback, try the generic vX.Y.Z pattern if no 'legacy/v' tags are found
        this.log('Falling back to generic vX.Y.Z tag search for LEGACY model...');
        const genericVersionRegex = /^v(\d+\.\d+\.\d+)$/;
        const genericLegacyTags = allTags
            .filter(tag => tag.name && genericVersionRegex.test(tag.name))
            .map(tag => {
                const match = tag.name.match(genericVersionRegex);
                return {
                    name: tag.name, // Full tag name like v1.12.1
                    version: match[1], // Just the version part like 1.12.1
                    commitSha: tag.commit.sha
                };
            })
            .sort((a, b) => {
                const verA = a.version.split('.').map(Number);
                const verB = b.version.split('.').map(Number);
                for (let i = 0; i < Math.max(verA.length, verB.length); i++) {
                    const numA = verA[i] || 0;
                    const numB = verB[i] || 0;
                    if (numA !== numB) return numB - numA; // Sort descending
                }
                return 0;
            });
        if (genericLegacyTags.length > 0) {
            this.log(`Found ${genericLegacyTags.length} generic vX.Y.Z tags. Using the latest.`);
            legacyTags.push(...genericLegacyTags); // Add them to the list, sort will handle
            legacyTags.sort((a, b) => { // Re-sort with potentially mixed types
                const verA = a.version.split('.').map(Number);
                const verB = b.version.split('.').map(Number);
                for (let i = 0; i < Math.max(verA.length, verB.length); i++) {
                    const numA = verA[i] || 0;
                    const numB = verB[i] || 0;
                    if (numA !== numB) return numB - numA;
                }
                return 0;
            });
        } else {
            this.log('No generic vX.Y.Z tags found either for LEGACY model.');
            return null;
        }
      }

      const highestLegacyTag = legacyTags[0];
      latestVersion = highestLegacyTag.version; // Version without 'v' prefix (e.g., "1.13.1")
      let commitShaForDate = highestLegacyTag.commitSha;

      this.log(`Highest legacy tag found: ${highestLegacyTag.name} (version ${latestVersion})`);

      // Get the commit date for this tag
      latestDate = new Date().toISOString().split('T')[0]; // Fallback date
      if (commitShaForDate) {
        try {
          const commitUrl = `https://api.github.com/repos/${repoPath}/commits/${commitShaForDate}`;
          const commitResponse = await this.makeRequest(commitUrl);
          const commitData = commitResponse.json();
          if (commitData && commitData.commit && commitData.commit.committer && commitData.commit.committer.date) {
            latestDate = commitData.commit.committer.date.split('T')[0];
          }
        } catch (commitError) {
          this.log(`Could not fetch commit date for tag ${highestLegacyTag.name} (commit ${commitShaForDate}): ${commitError.message}`);
        }
      }
      this.log(`Final LEGACY version: ${latestVersion} (${latestDate}) from ${source}`);

      return {
        version: latestVersion,
        date: latestDate,
        upload_date: latestDate,
        model_name: this.models['LEGACY']
      };

    } catch (error) {
      this.log(`Error getting LEGACY version via API: ${error.message}`);
      // Log the full error object if in debug mode for more details
      if (this.debug) console.error(error);
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
            } else if (model === 'T1B1') {
                // Trezor One: prefer the t1b1 firmware directory (robust), and
                // fall back to the legacy tag method if the directory lookup fails.
                let info = await extractor.getLatestFromFirmwareDir('T1B1');
                if (!info) info = await extractor.getLegacyVersion();
                if (info) firmwareResults[model] = info;
            } else {
                const info = await extractor.getLatestFromFirmwareDir(model);
                if (info) firmwareResults[model] = info;
            }
        } else {
            // All-models: T1B1 (Trezor One) now comes from the firmware directory
            // via extractAllVersionsFirmwareDirs, so no separate LEGACY tag call.
            firmwareResults = await extractor.extractAllVersionsFirmwareDirs();
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
            if (options.modelCode) {
                // Requested a specific model but the lookup produced no result —
                // emit an error and exit non-zero so callers don't treat an
                // upstream failure as a valid 'unknown' version.
                console.log(JSON.stringify({
                    version: "unknown",
                    date: new Date().toISOString().split('T')[0],
                    error: `Failed to fetch version for model ${options.modelCode} (upstream lookup failed)`
                }));
                process.exit(1);
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

// Check if this module is being run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}

export { TrezorFirmwareExtractor };