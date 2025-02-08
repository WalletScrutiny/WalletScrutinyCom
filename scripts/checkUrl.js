const fs = require("fs").promises;
const path = require("path");
const yaml = require("js-yaml");
const websiteChecker = require("./socialchecker/websiteChecker");
const facebookChecker = require("./socialchecker/facebookChecker");
const instagramChecker = require("./socialchecker/instagramChecker");
const twitterChecker = require("./socialchecker/twitterChecker");
const githubChecker = require("./socialchecker/githubChecker");
const linkedinChecker = require("./socialchecker/linkedinChecker");
const youtubeChecker = require("./socialchecker/youtubeChecker");
const archiveChecker = require("./socialchecker/archiveChecker");

const DIRECTORIES = [
    "./_android", "./_iphone", "./_hardware",
    "./_bearer", "./_desktop", "./_others"
];

const SOCIAL_CHECKERS = {
    "facebook.com": facebookChecker,
    "instagram.com": instagramChecker,
    "twitter.com": twitterChecker,
    "github.com": githubChecker,
    "linkedin.com": linkedinChecker,
    "youtube.com": youtubeChecker
};

async function updateFile(file, oldUrl, newUrl, type = "website") {
    try {
        const content = await fs.readFile(file, "utf8");
        const lines = content.split("\n");
        let updated = false;

        if (type === "website") {
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].trim().startsWith("website:") && lines[i].includes(oldUrl)) {
                    lines[i] = lines[i].includes(">-") ? 
                        `website: >-\n  ${newUrl}` : 
                        `website: ${newUrl}`;
                    updated = true;
                    break;
                }
            }
        } else if (type === "social") {
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes("- " + oldUrl)) {
                    lines[i] = lines[i].replace(oldUrl, newUrl);
                    updated = true;
                    break;
                }
            }
        }

        if (updated) {
            await fs.writeFile(file, lines.join("\n"));
            return true;
        }
        return false;
    } catch (error) {
        console.error(`Error updating file ${file}:`, error);
        return false;
    }
}

async function getAllUrls(directories) {
    const allUrls = [];
    const skippedFiles = [];

    console.log(`Starting to process ${directories.length} directories...`);

    for (const dir of directories) {
        try {
            console.log(`\nProcessing directory: ${dir}`);
            const files = await fs.readdir(dir);
            console.log(`Found ${files.length} files in ${dir}`);

            for (const file of files.filter(f => f.endsWith(".md"))) {
                console.log(`\nReading file: ${file}`);
                const content = await fs.readFile(path.join(dir, file), "utf8");
                const match = content.match(/---\n(.*?\n)---/s);
                
                if (match) {
                    try {
                        const frontMatter = yaml.load(match[1]);
                        const filePath = path.join(dir, file);
                        
                        console.log(`YAML loaded for ${file}`);
                        const meta = frontMatter.meta || '';
                        const hasSkipMeta = ['defunct', 'removed', 'obsolete'].some(tag => 
                            meta.toLowerCase().includes(tag)
                        );

                        // Process website URL
                        if (frontMatter.website) {
                            const url = frontMatter.website;
                            console.log(`Found website URL: ${url}`);
                            
                            // Only skip if both conditions are met:
                            // 1. Has skip meta tag
                            // 2. URL is already archived or broken
                            const isArchived = url.includes('web.archive.org/web/');
                            const isBroken = url.includes('walletscrutiny.com/brokenlink/');
                            
                            if (hasSkipMeta && (isArchived || isBroken)) {
                                console.log(`Skipping ${file} - meta: ${meta}, URL is ${isArchived ? 'archived' : 'broken'}`);
                                skippedFiles.push({
                                    file: filePath,
                                    meta: meta,
                                    url: url
                                });
                            } else {
                                allUrls.push({
                                    file: filePath,
                                    url: url,
                                    type: "website"
                                });
                            }
                        }

                        // Process social URLs with same logic
                        if (frontMatter.social && Array.isArray(frontMatter.social)) {
                            console.log(`Found ${frontMatter.social.length} social URLs`);
                            frontMatter.social.forEach(url => {
                                const checker = getSocialChecker(url);
                                if (checker) {
                                    const isArchived = url.includes('web.archive.org/web/');
                                    const isBroken = url.includes('walletscrutiny.com/brokenlink/');
                                    
                                    if (hasSkipMeta && (isArchived || isBroken)) {
                                        console.log(`Skipping social URL ${url} - meta: ${meta}`);
                                        skippedFiles.push({
                                            file: filePath,
                                            meta: meta,
                                            url: url
                                        });
                                    } else {
                                        allUrls.push({
                                            file: filePath,
                                            url: url,
                                            type: "social"
                                        });
                                    }
                                } else {
                                    console.log(`Skipping unsupported social URL: ${url}`);
                                }
                            });
                        }
                    } catch (yamlError) {
                        console.error(`YAML parsing error in ${file}:`, yamlError);
                        console.error('YAML content:', match[1]);
                    }
                }
            }
        } catch (error) {
            console.error(`Error processing directory ${dir}:`, error);
        }
    }

    // Summary logging
    console.log('\n=== Processing Summary ===');
    console.log(`Total URLs found: ${allUrls.length}`);
    console.log(`  - Website URLs: ${allUrls.filter(u => u.type === 'website').length}`);
    console.log(`  - Social URLs: ${allUrls.filter(u => u.type === 'social').length}`);
    console.log(`URLs skipped (archived/broken + meta tags): ${skippedFiles.length}`);

    if (skippedFiles.length > 0) {
        console.log('\n=== Skipped URLs ===');
        skippedFiles.forEach(({file, meta, url}) => {
            console.log(`${file} (meta: ${meta})`);
            console.log(`  URL: ${url}`);
        });
    }

    return allUrls;
}

function getUrlType(url) {
    try {
        if (!url) return "normal";
        if (url.toLowerCase().startsWith('mailto:')) return "mailto";
        if (url.includes("walletscrutiny.com/brokenlink/")) return "broken";
        if (url.includes("web.archive.org/web/")) return "archived";

        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        for (const domain of Object.keys(SOCIAL_CHECKERS)) {
            if (urlObj.hostname.includes(domain)) return "social";
        }
        return "normal";
    } catch (error) {
        console.error(`Error determining URL type for ${url}:`, error);
        return "normal";
    }
}

function getSocialChecker(url) {
    try {
        if (!url || url.toLowerCase().startsWith('mailto:')) return null;
        const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
        for (const [domain, checker] of Object.entries(SOCIAL_CHECKERS)) {
            if (urlObj.hostname.includes(domain)) return checker;
        }
        return null;
    } catch (error) {
        console.error(`Error getting social checker for ${url}:`, error);
        return null;
    }
}

async function checkSocialUrl(site) {
    try {
        let url = site.url.replace(/^>-\s*/, "").trim();
        const originalUrl = url;

        console.log(`\nChecking social URL: ${url}`);
        console.log(`File: ${site.file}`);

        // Extract original URL regardless of current state
        let cleanUrl = url;
        if (url.startsWith("https://walletscrutiny.com/brokenlink/")) {
            cleanUrl = url.replace("https://walletscrutiny.com/brokenlink/", "")
                         .replace(/^https?:\/\//, "");
            console.log(`Extracted from broken link: ${cleanUrl}`);
        } else if (url.includes("web.archive.org/web/")) {
            cleanUrl = archiveChecker.extractOriginalUrl(url);
            console.log(`Extracted from archive: ${cleanUrl}`);
        }

        // Normalize the clean URL
        cleanUrl = cleanUrl.replace(/^https?:\/\//, "");
        const testUrl = `https://${cleanUrl}`;
        console.log(`Testing social URL: ${testUrl}`);

        // Step 1: Check if original social media URL is available
        const checker = getSocialChecker(testUrl);
        if (!checker) {
            console.log("No appropriate social media checker found");
            return null;
        }

        const result = await checker.checkUrl(testUrl);
        console.log(`${testUrl} ${result.statusCode}`);

        // If original is available, use it
        if (result.isAvailable) {
            console.log(`✅ Social link available (${result.statusCode})`);
            if (url !== testUrl) {
                const updated = await updateFile(site.file, originalUrl, testUrl, "social");
                return updated ? {
                    file: site.file,
                    oldUrl: originalUrl,
                    newUrl: testUrl,
                    status: "restored_social"
                } : null;
            }
            return null;
        }

        // Step 2: If original not available, check Archive.org
        console.log("Social link unavailable, checking Archive.org...");
        const archiveResponse = await archiveChecker.checkArchive(testUrl, { returnFullResponse: true });

        if (archiveResponse?.available) {
            const newArchiveUrl = archiveResponse.url;
            console.log(`Found in Archive.org with ${archiveResponse.snapshotCount} snapshots`);
            
            // Only update if it's a different URL
            if (url !== newArchiveUrl) {
                const updated = await updateFile(site.file, originalUrl, newArchiveUrl, "social");
                return updated ? {
                    file: site.file,
                    oldUrl: originalUrl,
                    newUrl: newArchiveUrl,
                    status: "archived_social",
                    snapshotCount: archiveResponse.snapshotCount
                } : null;
            }
            return null;
        }

        // Step 3: If both original and archive fail, mark as broken
        console.log(`❌ Dead social link (${result.statusCode})`);
        const brokenUrl = `https://walletscrutiny.com/brokenlink/https://${cleanUrl}`;
        
        // Only update if it's not already marked as broken
        if (url !== brokenUrl) {
            const updated = await updateFile(site.file, originalUrl, brokenUrl, "social");
            return updated ? {
                file: site.file,
                oldUrl: originalUrl,
                newUrl: brokenUrl,
                status: "broken_social"
            } : null;
        }

        return null;
    } catch (error) {
        console.error(`Error checking social URL ${site.url}:`, error);
        return null;
    }
}

// Update the processUrls function to use improved social checking
async function processUrls(urls, startIndex, batchSize) {
    const websiteUrls = [];
    const socialUrls = [];
    const results = [];

  

    // Separate URLs by type
    for (const url of urls) {
        const urlType = getUrlType(url.url);
        if (urlType === "social") {
            // Double check we have a checker for this social URL
            const checker = getSocialChecker(url.url);
            if (checker) {
                socialUrls.push(url);
            }
        } else if (urlType !== "mailto") {
            websiteUrls.push(url);
        }
    }

    // Process websites first
    if (websiteUrls.length > 0) {
        console.log(`\nProcessing ${websiteUrls.length} website URLs...`);
        try {
            const subBatchSize = 5;
            for (let i = 0; i < websiteUrls.length; i += subBatchSize) {
                const subBatch = websiteUrls.slice(i, i + subBatchSize);
                try {
                    const websiteResults = await websiteChecker.processWebsitesInParallel(
                        subBatch,
                        updateFile,
                        subBatchSize
                    );
                    if (websiteResults && websiteResults.length > 0) {
                        results.push(...websiteResults);
                    }
                    
                    if (i + subBatchSize < websiteUrls.length) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                } catch (error) {
                    console.error(`Error processing website sub-batch (${i + 1}-${i + subBatchSize}):`, error);
                }
            }

            if (socialUrls.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        } catch (error) {
            console.error('Error processing websites:', error);
        }
    }

    // Process social URLs with improved checking
    if (socialUrls.length > 0) {
        console.log(`\nProcessing ${socialUrls.length} social media URLs...`);
        for (const site of socialUrls) {
            try {
                const result = await checkSocialUrl(site);
                if (result) results.push(result);
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error(`Error processing social URL ${site.url}:`, error);
            }
        }
    }

    return results;
}


async function main() {
    try {
        console.log("Starting URL checks...");
        let processedCount = 0;
        let failedBatches = 0;
        const maxFailedBatches = 5;

        const allUrls = await getAllUrls(DIRECTORIES);
        console.log(`Found ${allUrls.length} URLs to check`);

        const batchSize = 50;
        const totalBatches = Math.ceil(allUrls.length / batchSize);
        let allUpdates = [];

        for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
            try {
                const start = batchIndex * batchSize;
                const end = Math.min(start + batchSize, allUrls.length);
                const batch = allUrls.slice(start, end);

                console.log(`\nProcessing batch ${batchIndex + 1}/${totalBatches} (${batch.length} URLs)`);
                console.log(`Progress: ${processedCount}/${allUrls.length} URLs processed`);

                const batchUpdates = await processUrls(batch, start, batchSize);
                
                if (batchUpdates && batchUpdates.length > 0) {
                    allUpdates.push(...batchUpdates);
                    console.log("Updates in this batch:", batchUpdates.length);
                }

                processedCount += batch.length;
                failedBatches = 0;

                // Add delay between batches
                if (batchIndex < totalBatches - 1) {
                    const delay = 3000;
                    console.log(`Waiting ${delay/1000} seconds before next batch...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            } catch (error) {
                failedBatches++;
                console.error(`Error processing batch ${batchIndex + 1}:`, error);
                
                if (failedBatches >= maxFailedBatches) {
                    console.error(`Stopping after ${maxFailedBatches} consecutive failed batches`);
                    break;
                }
                
                console.log(`Waiting 10 seconds after failure...`);
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        }

        // Final updates
        if (allUpdates.length > 0) {
            console.log(`\nWriting ${allUpdates.length} updates to files...`);
            for (const update of allUpdates) {
                await updateFile(
                    update.file,
                    update.oldUrl,
                    update.newUrl,
                    update.status === "social" ? "social" : "website"
                );
            }
        }

        console.log("\n=== Summary ===");
        console.log(`Total URLs found: ${allUrls.length}`);
        console.log(`URLs processed: ${processedCount}`);
        console.log(`Updates found: ${allUpdates.length}`);
    } catch (error) {
        console.error("Fatal error:", error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = {
    checkSocialUrl,
    getUrlType,
    processUrls
};