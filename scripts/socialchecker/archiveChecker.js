const https = require('https');
const config = require('./config');

class ArchiveChecker {
    static extractOriginalUrl(archiveUrl) {
        if (!archiveUrl) return null;
        const match = archiveUrl.match(/web\.archive\.org\/web\/\d+\/(.*)/);
        return match ? match[1] : null;
    }

    static extractTimestamp(archiveUrl) {
        if (!archiveUrl) return null;
        const match = archiveUrl.match(/web\.archive\.org\/web\/(\d+)\//);
        return match ? match[1] : null;
    }

    static getTimestampRange() {
        const now = new Date();
        const tenYearsAgo = new Date(now.setFullYear(now.getFullYear() - 10));
        const oneYearAhead = new Date(now.setFullYear(now.getFullYear() + 11)); // +11 to offset the -10 above
        
        return {
            from: tenYearsAgo.toISOString().slice(0,10).replace(/-/g, ''),
            to: oneYearAhead.toISOString().slice(0,10).replace(/-/g, '')
        };
    }

    static createArchiveUrl(url, timestamp) {
        if (!url) return null;
        timestamp = timestamp || new Date().toISOString().replace(/[-:]/g, '').split('.')[0].replace('T', '');
        return `https://web.archive.org/web/${timestamp}/${url}`;
    }

    static async makeRequest(url, options = {}, retryCount = 0) {
        return new Promise((resolve) => {
            let isDone = false;
            let request;

            const globalTimeout = setTimeout(() => {
                if (!isDone) {
                    if (request) request.destroy();
                    isDone = true;
                    resolve({ error: 'timeout' });
                }
            }, config.TIMEOUTS.GLOBAL);

            try {
                request = https.get(url, {
                    timeout: config.TIMEOUTS.REQUEST,
                    headers: config.getHeaders(options.headers),
                    ...options
                }, (res) => {
                    let data = '';
                    res.on('data', chunk => data += chunk);
                    res.on('end', () => {
                        if (!isDone) {
                            clearTimeout(globalTimeout);
                            isDone = true;
                            resolve({ data, res });
                            request.destroy();
                        }
                    });
                });

                request.on('error', async (error) => {
                    if (!isDone) {
                        clearTimeout(globalTimeout);
                        request.destroy();
                        isDone = true;

                        // Retry logic
                        if (retryCount < config.LIMITS.MAX_RETRIES) {
                            console.log(`Request failed, retrying (${retryCount + 1}/${config.LIMITS.MAX_RETRIES})...`);
                            await new Promise(resolve => setTimeout(resolve, config.TIMEOUTS.RETRY_DELAY));
                            const retryResult = await this.makeRequest(url, options, retryCount + 1);
                            resolve(retryResult);
                        } else {
                            resolve({ error: 'request_failed', details: error.message });
                        }
                    }
                });

                request.setTimeout(config.TIMEOUTS.REQUEST, () => {
                    if (!isDone) {
                        clearTimeout(globalTimeout);
                        request.destroy();
                        isDone = true;
                        resolve({ error: 'timeout' });
                    }
                });
            } catch (error) {
                if (!isDone) {
                    if (request) request.destroy();
                    clearTimeout(globalTimeout);
                    isDone = true;
                    resolve({ error: 'request_failed', details: error.message });
                }
            }
        });
    }

    static async getSnapshotCounts(url) {
        // Use CDX API to get all snapshots
        const cdxUrl = `https://web.archive.org/cdx/search/cdx?url=${encodeURIComponent(url)}&output=json&fl=timestamp,statuscode&filter=statuscode:200`;
        
        const response = await this.makeRequest(cdxUrl);
        if (response.error) {
            console.log(`Error fetching snapshots: ${response.error}`);
            return null;
        }

        try {
            const snapshots = JSON.parse(response.data);
            if (snapshots.length <= 1) return null; // First row is header

            // Group by date (YYYYMMDD) and exclude any snapshots with errors
            const dateCounts = {};
            const validStatusCodes = new Set([200, 301, 302, 307, 308]);
            
            for (let i = 1; i < snapshots.length; i++) {
                const [timestamp, statusCode] = snapshots[i];
                if (validStatusCodes.has(parseInt(statusCode))) {
                    const date = timestamp.substring(0, 8);
                    dateCounts[date] = (dateCounts[date] || 0) + 1;
                }
            }

            // Find date with most snapshots
            let bestDate = null;
            let maxCount = 0;
            
            for (const [date, count] of Object.entries(dateCounts)) {
                if (count > maxCount) {
                    maxCount = count;
                    bestDate = date;
                }
            }

            // If we found valid snapshots, return the information
            if (bestDate && maxCount > 0) {
                console.log(`Found ${maxCount} snapshots on ${bestDate}`);
                return {
                    bestDate,
                    maxCount,
                    allCounts: dateCounts
                };
            }

            return null;
        } catch (error) {
            console.error('Error parsing CDX response:', error);
            return null;
        }
    }

    static async checkArchive(url, options = {}) {
        console.log(`Checking archive for: ${url}`);
        
        const snapshotInfo = await this.getSnapshotCounts(url);
        if (!snapshotInfo || !snapshotInfo.bestDate) {
            console.log('No valid snapshots found');
            return options.returnFullResponse ? 
                { url: null, timestamp: null, available: false } : 
                null;
        }

        // Use the date with most snapshots to get the specific snapshot
        const timestamp = snapshotInfo.bestDate + '000000'; // Add time component
        const availabilityUrl = `https://archive.org/wayback/available?url=${encodeURIComponent(url)}&timestamp=${timestamp}`;

        const response = await this.makeRequest(availabilityUrl);
        if (response.error) {
            console.log(`Error checking availability: ${response.error}`);
            return options.returnFullResponse ? 
                { url: null, timestamp: null, available: false } : 
                null;
        }

        try {
            const json = JSON.parse(response.data);
            if (!json.archived_snapshots?.closest?.url) {
                console.log('No snapshot available at specified timestamp');
                return options.returnFullResponse ? 
                    { url: null, timestamp: null, available: false } : 
                    null;
            }

            const archiveUrl = json.archived_snapshots.closest.url
                .replace('http://', 'https://')
                .replace('/web/', '/web/');
            const archiveTimestamp = json.archived_snapshots.closest.timestamp;
            const available = json.archived_snapshots.closest.available;

            console.log(`Found archive snapshot from: ${archiveTimestamp}`);
            console.log(`This date has ${snapshotInfo.maxCount} snapshots`);

            return options.returnFullResponse ? {
                url: archiveUrl,
                timestamp: archiveTimestamp,
                available,
                snapshotCount: snapshotInfo.maxCount,
                originalUrl: archiveUrl ? this.extractOriginalUrl(archiveUrl) : null
            } : archiveUrl;

        } catch (error) {
            console.error('Error parsing availability response:', error);
            return options.returnFullResponse ? 
                { url: null, timestamp: null, available: false } : 
                null;
        }
    }

    static async checkArchivedUrl(archiveUrl) {
        const originalUrl = this.extractOriginalUrl(archiveUrl);
        if (!originalUrl) {
            console.log('Could not extract original URL from archive URL');
            return { needsUpdate: false };
        }

        const currentTimestamp = this.extractTimestamp(archiveUrl);
        const result = await this.checkArchive(originalUrl, { returnFullResponse: true });

        if (!result.available) {
            console.log('No new snapshot available');
            return { needsUpdate: false };
        }

        if (result.timestamp && currentTimestamp && result.timestamp > currentTimestamp) {
            console.log(`Found newer snapshot: ${result.timestamp} (current: ${currentTimestamp})`);
            return {
                needsUpdate: true,
                newUrl: result.url,
                timestamp: result.timestamp,
                originalUrl,
                snapshotCount: result.snapshotCount
            };
        }

        console.log('Current snapshot is the latest');
        return { needsUpdate: false };
    }
}

module.exports = ArchiveChecker;