// checkRemoved.mjs
// Consolidated script that handles all app status checking functionality:
// 1. Checks apps marked as 'meta: defunct' to see if they've been removed (404)
//    - If removed, updates from 'meta: defunct' to 'meta: removed'
// 2. Checks apps marked as 'meta: removed' to see if they've been restored
//    - If restored, updates from 'meta: removed' to 'meta: ok'
// 3. Handles both Android and iOS apps in a single script
// 4. Implements multi-region checking for iOS apps to avoid false positives
// 5. Provides detailed reporting on all status changes

import gplay from "google-play-scraper";
import apple from "app-store-scraper";
import fs from "fs/promises";
import path from "path";
import helper from "./helper.mjs";
import { exec } from "child_process";
import { promisify } from "util";
const execAsync = promisify(exec);

// Configuration
const ANDROID_DIR = "_android";
const IOS_DIR = "_iphone";

// Track results for reporting
const results = {
  android: {
    defunctToRemoved: [],
    removedToOk: [],
    defunctChecked: 0,
    removedChecked: 0,
    errors: [],
  },
  ios: {
    defunctToRemoved: [],
    removedToOk: [],
    defunctChecked: 0,
    removedChecked: 0,
    errors: [],
  },
};

// Common country codes to check for iOS apps
const IOS_REGIONS = [
  "us",
  "in",
  "br",
  "id",
  "ru",
  "mx",
  "vn",
  "tr",
  "jp",
  "gb",
  "th",
  "pk",
  "ph",
  "eg",
  "de",
  "fr",
  "it",
  "kr",
  "ca",
  "sa",
  "ng",
  "za",
  "ke",
  "au",
];

// Get the filename from command line arguments if provided
const targetFile = process.argv[2];
const targetPlatform = process.argv[3]; // Optional: 'android', 'ios', or undefined for both

/**
 * Main function to check app status
 */
async function checkAppStatus() {
  console.log("Starting consolidated app status check...");

  // Process Android apps first if not specifically targeting iOS
  if (!targetPlatform || targetPlatform.toLowerCase() === "android") {
    await processAndroidApps();
  }

  // Then process iOS apps if not specifically targeting Android
  if (!targetPlatform || targetPlatform.toLowerCase() === "ios") {
    await processIosApps();
  }

  // Generate reports
  await generateReports();

  console.log("\nApp status check completed!");
}

/**
 * Check if an app is available in the Play Store using curl
 */
async function checkWithCurl(appId) {
  try {
    const { stdout } = await execAsync(
      `curl -s -o /dev/null -w "%{http_code}" "https://play.google.com/store/apps/details?id=${appId}"`
    );
    return stdout.trim() === "404";
  } catch (err) {
    console.error(`curl failed for ${appId}: ${err.message}`);
    return false;
  }
}

/**
 * Before reviving an app that is removed to 'ok', check updated date
 */

function updateMeta(header) {
  if (header.meta !== "defunct") {
    const daysSinceUpdate =
      (new Date() - new Date(header.updated)) / 1000 / 60 / 60 / 24;
    if (daysSinceUpdate > 720) {
      if (header.meta !== "obsolete") {
        header.meta = "obsolete";
        header.date = new Date();
      }
    } else if (daysSinceUpdate > 360) {
      if (header.meta !== "stale") {
        header.meta = "stale";
        header.date = new Date();
      }
    } else {
      if ("stale,obsolete".includes(header.meta)) {
        header.meta = "ok";
        header.date = new Date();
      }
    }
  }
}

/**
 * Process Android apps (both defunct->removed and removed->ok)
 */
async function processAndroidApps() {
  try {
    console.log("\n=== PROCESSING ANDROID APPS ===");

    // Check if Android directory exists
    try {
      await fs.access(ANDROID_DIR);
    } catch (error) {
      console.log(
        `Warning: ${ANDROID_DIR} directory not found. Skipping Android apps.`
      );
      return;
    }

    // Get all Android app files
    let files;
    if (targetFile && targetFile.endsWith(".md")) {
      // Check if the specific file exists
      try {
        await fs.access(path.join(ANDROID_DIR, targetFile));
        files = [targetFile];
        console.log(`Checking single Android file: ${targetFile}`);
      } catch (error) {
        console.error(`Error: File ${targetFile} not found in ${ANDROID_DIR}`);
        return;
      }
    } else {
      // Get all files in the directory
      files = await fs.readdir(ANDROID_DIR);
      console.log(`Found ${files.length} total Android files`);
    }

    // Process defunct apps first
    console.log("\nChecking Android apps marked as defunct...");
    const BATCH_SIZE = 5;

    const defunctFiles = files.filter((fileName) => {
      const content = helper.loadFromFile(path.join(ANDROID_DIR, fileName));
      return content.header.meta === "defunct";
    });

    // Process in batches of 5
    for (let i = 0; i < defunctFiles.length; i += BATCH_SIZE) {
      const batch = defunctFiles.slice(i, i + BATCH_SIZE);

      await Promise.allSettled(
        batch.map(async (fileName, indexInBatch) => {
          const filePath = path.join(ANDROID_DIR, fileName);
          const content = helper.loadFromFile(filePath);
          const header = content.header;
          const appId = header.appId;

          results.android.defunctChecked++;
          if (header.meta === "removed") {
            results.android.defunctToRemoved.push(appId); // already pushed earlier
          }
          process.stdout.write(
            `\rNow processing defunct apps...   Defunct apps checked: ${results.android.defunctChecked}     Action taken to ${results.android.defunctToRemoved.length} files`
          );

          try {
            await gplay.app({ appId, lang: "en", country: "us" });
          } catch (error) {
            const is404 = await checkWithCurl(appId);
            if (is404) {
              header.meta = "removed";
              helper.writeResult(ANDROID_DIR + "/", header, content.body);
              results.android.defunctToRemoved.push(appId);
            } else {
              results.android.errors.push({
                appId,
                error: `Scraper failed, curl says 200`,
              });
            }
          }
        })
      );
    }

    // Then process removed apps
    console.log("\nChecking Android apps marked as removed...");
    for (const fileName of files) {
      const filePath = path.join(ANDROID_DIR, fileName);
      const content = helper.loadFromFile(filePath);
      const header = content.header;
      const appId = header.appId;

      if (header.meta === "removed") {
        results.android.removedChecked++;
        process.stdout.write(
          `[${results.android.removedChecked}] Checking removed Android app: ${appId}... `
        );

        try {
          // Check if app exists in Play Store
          await gplay.app({
            appId: appId,
            lang: "en",
            country: "us",
          });

          // App is back, update from removed to ok
          updateMeta(header);
          helper.writeResult(ANDROID_DIR + "/", header, content.body);
          if (header.meta === "ok") {
            results.android.removedToOk.push(appId);
          }
        } catch (error) {
          // Still removed, do nothing
          if (`${error}`.search(/404/) > -1) {
            console.log("✗ Still removed from Play Store");
          } else {
            console.error(`⚠ Error checking app ${appId}: ${error.message}`);
            results.android.errors.push({ appId, error: error.message });
          }
        }
      }
    }

    console.log("\nAndroid processing completed.");
  } catch (error) {
    console.error(`Error processing Android apps: ${error.message}`);
  }
}

/**
 * Process iOS apps (both defunct->removed and removed->ok)
 */
async function processIosApps() {
  try {
    console.log("\n=== PROCESSING iOS APPS ===");

    // Check if iOS directory exists
    try {
      await fs.access(IOS_DIR);
    } catch (error) {
      console.log(
        `Warning: ${IOS_DIR} directory not found. Skipping iOS apps.`
      );
      return;
    }

    // Get all iOS app files
    let files;
    if (targetFile && targetFile.endsWith(".md")) {
      // Check if the specific file exists
      try {
        await fs.access(path.join(IOS_DIR, targetFile));
        files = [targetFile];
        console.log(`Checking single iOS file: ${targetFile}`);
      } catch (error) {
        console.error(`Error: File ${targetFile} not found in ${IOS_DIR}`);
        return;
      }
    } else {
      // Get all files in the directory
      files = await fs.readdir(IOS_DIR);
      console.log(`Found ${files.length} total iOS files`);
    }

    // Process defunct apps first
    console.log("\nChecking iOS apps marked as defunct...");
    for (const fileName of files) {
      const filePath = path.join(IOS_DIR, fileName);
      const content = helper.loadFromFile(filePath);
      const header = content.header;
      const appId = header.appId;
      const idd = header.idd;
      const appCountry = header.appCountry || "us";

      if (header.meta === "defunct") {
        results.ios.defunctChecked++;
        process.stdout.write(
          `[${results.ios.defunctChecked}] Checking defunct iOS app: ${appId}... `
        );

        if (!idd) {
          console.log("⚠ No App Store ID (idd) found, skipping");
          continue;
        }

        // Try multiple regions to avoid false positives
        const countriesToTry = [
          appCountry,
          ...IOS_REGIONS.filter((c) => c !== appCountry),
        ];
        let appFound = false;
        let lastError = null;

        for (const country of countriesToTry) {
          try {
            await apple.app({
              id: idd,
              lang: "en",
              country: country,
              throttle: 2,
            });

            // If we get here, the app was found
            appFound = true;
            console.log(`✓ Still available in ${country} App Store`);
            break;
          } catch (error) {
            lastError = error;
            // Only continue to the next country if we got a 404
            if (`${error}`.search(/404/) === -1) {
              break;
            }
          }
        }

        // If app wasn't found in any region, mark it as removed
        if (!appFound) {
          if (`${lastError}`.search(/404/) > -1) {
            header.meta = "removed";
            helper.writeResult(IOS_DIR + "/", header, content.body);
            results.ios.defunctToRemoved.push(appId);
            console.log("✗ Returned 404 in all regions - marking as removed");
          } else {
            console.error(
              `⚠ Error checking app ${appId}: ${lastError.message}`
            );
            results.ios.errors.push({ appId, error: lastError.message });
          }
        }
      }
    }

    // Then process removed apps
    console.log("\nChecking iOS apps marked as removed...");
    for (const fileName of files) {
      const filePath = path.join(IOS_DIR, fileName);
      const content = helper.loadFromFile(filePath);
      const header = content.header;
      const appId = header.appId;
      const idd = header.idd;
      const appCountry = header.appCountry || "us";

      if (header.meta === "removed") {
        results.ios.removedChecked++;
        process.stdout.write(
          `[${results.ios.removedChecked}] Checking removed iOS app: ${appId}... `
        );

        if (!idd) {
          // Try to find the numeric ID from the bundle ID
          try {
            console.log(`Looking up bundle ID: ${appId}`);
            const lookupResult = await apple.lookup({ bundleId: appId });

            if (lookupResult.length > 0) {
              const numericId = lookupResult[0].trackId;
              console.log(
                `Found numeric App Store ID: ${numericId} for bundle ${appId}`
              );

              // App is back, update from removed to ok
              // Also update the idd field with the found numeric ID
              header.idd = numericId; // preserve this!
              updateMeta(header);
              helper.writeResult(IOS_DIR + "/", header, content.body);
              if (header.meta === "ok") {
                results.ios.removedToOk.push(appId);
              }
            } else {
              console.log(
                "✗ Still removed from App Store (bundle ID lookup failed)"
              );
            }
          } catch (error) {
            console.log(
              "✗ Still removed from App Store (bundle ID lookup error)"
            );
          }
          continue;
        }

        // Try multiple regions to avoid false positives
        const countriesToTry = [
          appCountry,
          ...IOS_REGIONS.filter((c) => c !== appCountry),
        ];
        let appFound = false;

        for (const country of countriesToTry) {
          try {
            await apple.app({
              id: idd,
              lang: "en",
              country: country,
              throttle: 2,
            });

            // If we get here, the app was found
            appFound = true;

            // App is back, update from removed to ok
            updateMeta(header);
            helper.writeResult(IOS_DIR + "/", header, content.body);
            if (header.meta === "ok") {
              results.ios.removedToOk.push(appId);
            }
            break;
          } catch (error) {
            // Only continue to the next country if we got a 404
            if (`${error}`.search(/404/) === -1) {
              console.error(
                `⚠ Error checking app ${appId} in ${country}: ${error.message}`
              );
              results.ios.errors.push({ appId, error: error.message });
              break;
            }
          }
        }

        if (!appFound) {
          console.log("✗ Still removed from App Store in all regions");
        }
      }
    }

    console.log("\niOS processing completed.");
  } catch (error) {
    console.error(`Error processing iOS apps: ${error.message}`);
  }
}

/**
 * Generate reports for all processed apps
 */
async function generateReports() {
  console.log("\n=== GENERATING REPORTS ===");

  const formatSection = (title, items) => {
    return `## ${title}\n\n${
      items.length > 0 ? "- " + items.join("\n- ") : "None"
    }\n\n`;
  };

  // Android report
  let androidReport = "# Android Apps Status Report\n\n";
  androidReport += formatSection(
    "Apps Changed from Defunct to Removed",
    results.android.defunctToRemoved
  );
  androidReport += formatSection(
    "Apps Changed from Removed to OK",
    results.android.removedToOk
  );
  androidReport += formatSection(
    "Errors",
    results.android.errors.map((e) => `${e.appId}: ${e.error}`)
  );
  androidReport += `\n## Summary\n\n`;
  androidReport += `- Defunct apps checked: ${results.android.defunctChecked}\n`;
  androidReport += `- Removed apps checked: ${results.android.removedChecked}\n`;
  androidReport += `- Total defunct→removed changes: ${results.android.defunctToRemoved.length}\n`;
  androidReport += `- Total removed→ok changes: ${results.android.removedToOk.length}\n`;

  // iOS report
  let iosReport = "# iOS Apps Status Report\n\n";
  iosReport += formatSection(
    "Apps Changed from Defunct to Removed",
    results.ios.defunctToRemoved
  );
  iosReport += formatSection(
    "Apps Changed from Removed to OK",
    results.ios.removedToOk
  );
  iosReport += formatSection(
    "Errors",
    results.ios.errors.map((e) => `${e.appId}: ${e.error}`)
  );
  iosReport += `\n## Summary\n\n`;
  iosReport += `- Defunct apps checked: ${results.ios.defunctChecked}\n`;
  iosReport += `- Removed apps checked: ${results.ios.removedChecked}\n`;
  iosReport += `- Total defunct→removed changes: ${results.ios.defunctToRemoved.length}\n`;
  iosReport += `- Total removed→ok changes: ${results.ios.removedToOk.length}\n`;

  // Combined report
  let combinedReport = "# App Status Check Report\n\n";
  combinedReport += `## Summary\n\n`;
  combinedReport += `- Total defunct→removed changes: ${
    results.android.defunctToRemoved.length +
    results.ios.defunctToRemoved.length
  }\n`;
  combinedReport += `- Total removed→ok changes: ${
    results.android.removedToOk.length + results.ios.removedToOk.length
  }\n\n`;
  combinedReport += androidReport + "\n\n" + iosReport;

  // Write reports to files
  await fs.writeFile("android-status-report.md", androidReport);
  await fs.writeFile("ios-status-report.md", iosReport);
  await fs.writeFile("app-status-report.md", combinedReport);

  console.log("Reports generated:");
  console.log("- android-status-report.md");
  console.log("- ios-status-report.md");
  console.log("- app-status-report.md");
}

// Display usage information if requested
if (process.argv.includes("--help") || process.argv.includes("-h")) {
  console.log(`
Usage: node scripts/checkRemoved.mjs [filename] [platform]

Options:
  [filename]    Optional. Specify a single file to check (e.g., 'com.example.app.md')
  [platform]    Optional. Specify platform to check: 'android' or 'ios'. Default: both
  --help, -h    Show this help message

Examples:
  node scripts/checkRemoved.mjs                     # Check all apps on both platforms
  node scripts/checkRemoved.mjs co.busha.apple.md   # Check only the Busha app
  node scripts/checkRemoved.mjs null android        # Check all Android apps only
`);
} else {
  // Run the main function
  checkAppStatus();
}
