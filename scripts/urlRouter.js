const fs = require("fs").promises;
const path = require("path");
const yaml = require("js-yaml");
const websiteChecker = require("./socialchecker/websiteChecker");
const facebookChecker = require("./socialchecker/facebookChecker");
const instagramChecker = require("./socialchecker/instagramChecker");
const twitterChecker = require("./socialchecker/twitterChecker");
const githubChecker = require("./socialchecker/githubChecker");
const linkedinChecker = require("./socialchecker/linkediinChecker");
const youtubeChecker = require("./socialchecker/youtubeChecker");

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
    for (const dir of directories) {
        try {
            const files = await fs.readdir(dir);
            for (const file of files.filter(f => f.endsWith(".md"))) {
                const content = await fs.readFile(path.join(dir, file), "utf8");
                const match = content.match(/---\n(.*?\n)---/s);
                if (match) {
                    try {
                        const frontMatter = yaml.load(match[1]);
                        const filePath = path.join(dir, file);
                        
                        if (frontMatter.website) {
                            allUrls.push({
                                file: filePath,
                                url: frontMatter.website,
                                type: "website"
                            });
                        }
                        if (frontMatter.social) {
                            frontMatter.social.forEach(url => {
                                allUrls.push({
                                    file: filePath,
                                    url: url,
                                    type: "social"
                                });
                            });
                        }
                    } catch (yamlError) {
                        console.error(`YAML parsing error in ${file}:`, yamlError);
                    }
                }
            }
        } catch (error) {
            console.error(`Error processing directory ${dir}:`, error);
        }
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
        const url = site.url.replace(/^>-\s*/, "").trim();
        console.log(`\nChecking social URL: ${url}`);
        console.log(`File: ${site.file}`);

        const checker = getSocialChecker(url);
        if (!checker) return null;

        const result = await checker.checkUrl(url);
        console.log(`${url} ${result.statusCode}`);

        if (!result.isAvailable) {
            console.log(`❌ Dead social link (${result.statusCode})`);
            const brokenUrl = `https://walletscrutiny.com/brokenlink/https://${url.replace(
                /^https?:\/\/walletscrutiny.com\/brokenlink\//,
                ""
            )}`;
            const updated = await updateFile(site.file, url, brokenUrl, "social");
            return updated ? {
                file: site.file,
                oldUrl: url,
                newUrl: brokenUrl,
                status: "social"
            } : null;
        }

        console.log(`✅ Social link available (${result.statusCode})`);
        return null;
    } catch (error) {
        console.error(`Error checking social URL ${site.url}:`, error);
        return null;
    }
}

async function processUrls(urls, startIndex, batchSize) {
    const websiteUrls = [];
    const socialUrls = [];
    const results = [];

    // Separate URLs by type
    for (const url of urls) {
        const urlType = getUrlType(url.url);
        if (urlType === "social") {
            socialUrls.push(url);
        } else if (urlType !== "mailto") {
            websiteUrls.push(url);
        }
    }

    // Process websites first
    if (websiteUrls.length > 0) {
        console.log(`\nProcessing ${websiteUrls.length} website URLs...`);
        try {
            // Process websites in smaller sub-batches
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
                    
                    // Add delay between sub-batches
                    if (i + subBatchSize < websiteUrls.length) {
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }
                } catch (error) {
                    console.error(`Error processing website sub-batch (${i + 1}-${i + subBatchSize}):`, error);
                }
            }

            // Add delay before processing social URLs
            if (socialUrls.length > 0) {
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        } catch (error) {
            console.error('Error processing websites:', error);
        }
    }

    // Then process social URLs
    if (socialUrls.length > 0) {
        console.log(`\nProcessing ${socialUrls.length} social media URLs...`);
        for (const site of socialUrls) {
            try {
                const result = await checkSocialUrl(site);
                if (result) results.push(result);
                // Add delay between social checks
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error(`Error processing social URL ${site.url}:`, error);
            }
        }
    }

    return results;
}

async function saveProgress(updates, filename = 'updates_progress.json') {
    await fs.writeFile(
        filename,
        JSON.stringify(updates, null, 2),
        'utf8'
    );
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

                // Save progress periodically
                if (batchIndex % 5 === 0 && allUpdates.length > 0) {
                    try {
                        await saveProgress(allUpdates);
                        console.log(`Saved progress after batch ${batchIndex + 1}`);
                    } catch (error) {
                        console.error('Error saving progress:', error);
                    }
                }

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
                    if (allUpdates.length > 0) {
                        await saveProgress(allUpdates, 'updates_emergency_backup.json');
                    }
                    break;
                }
                
                console.log(`Waiting 10 seconds after failure...`);
                await new Promise(resolve => setTimeout(resolve, 10000));
            }
        }

        // Final processing
        if (allUpdates.length > 0) {
            console.log(`\nWriting ${allUpdates.length} updates to files...`);
            try {
                // Write updates and save final backup
                for (const update of allUpdates) {
                    await updateFile(
                        update.file,
                        update.oldUrl,
                        update.newUrl,
                        update.status === "social" ? "social" : "website"
                    );
                }
                await saveProgress(allUpdates, 'updates_final.json');
            } catch (error) {
                console.error('Error writing updates:', error);
                await saveProgress(allUpdates, 'updates_error_backup.json');
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