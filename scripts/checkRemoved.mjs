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
    removedToStaleOrObsolete: [],
    defunctChecked: 0,
    removedChecked: 0,
    errors: [],
  },
  ios: {
    defunctToRemoved: [],
    removedToOk: [],
    removedToStaleOrObsolete: [],
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
  process.exit(0);
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
    if (!header.updated || isNaN(new Date(header.updated))) return;

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
      if (["stale", "obsolete"].includes(header.meta)) {
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
    console.log("\n=== PROCESSING ANDROID APPS ===========");

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

    const defunctFiles = files
      .map((fileName) => {
        const content = helper.loadFromFile(path.join(ANDROID_DIR, fileName));
        return { fileName, content };
      })
      .filter((obj) => obj.content.header.meta === "defunct");
    console.log(
      `Found ${defunctFiles.length} files that have \`meta: defunct\``
    );

    // Process in batches of 5
    for (let i = 0; i < defunctFiles.length; i += BATCH_SIZE) {
      const batch = defunctFiles.slice(i, i + BATCH_SIZE);

      await Promise.allSettled(
        batch.map(async ({ fileName, content }) => {
          const filePath = path.join(ANDROID_DIR, fileName);
          const header = content.header;
          const appId = header.appId;

          results.android.defunctChecked++;
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
    console.log(
      `\n✓ Finished checking defunct apps: ${results.android.defunctChecked} checked, ${results.android.defunctToRemoved.length} changed to removed`
    );

    // Then process removed apps
    console.log("\nChecking Android apps marked as removed...");
    const removedFiles = files.filter((fileName) => {
      const content = helper.loadFromFile(path.join(ANDROID_DIR, fileName));
      return content.header.meta === "removed";
    });
    console.log(
      `Found ${removedFiles.length} files that have \`meta: removed\``
    );

    for (let i = 0; i < removedFiles.length; i += BATCH_SIZE) {
      const batch = removedFiles.slice(i, i + BATCH_SIZE);

      await Promise.allSettled(
        batch.map(async (fileName) => {
          const filePath = path.join(ANDROID_DIR, fileName);
          const content = helper.loadFromFile(filePath);
          const header = content.header;
          const appId = header.appId;

          if (header.meta === "removed") {
            results.android.removedChecked++;
            process.stdout.write(
              `\rNow processing removed apps...   Removed apps checked: ${
                results.android.removedChecked
              }     Action taken to ${
                results.android.removedToOk.length +
                results.android.removedToStaleOrObsolete.length
              } files`
            );

            try {
              await gplay.app({ appId, lang: "en", country: "us" });

              const originalMeta = header.meta;
              updateMeta(header);

              if (["ok", "stale", "obsolete"].includes(header.meta)) {
                header.verdict = "wip";
              }             

              helper.writeResult(ANDROID_DIR + "/", header, content.body);

              if (header.meta === "ok") {
                results.android.removedToOk.push(appId);
              } else if (["stale", "obsolete"].includes(header.meta)) {
                results.android.removedToStaleOrObsolete.push(
                  `${appId} → ${header.meta}`
                );
              }
            } catch (error) {
              if (`${error}`.search(/404/) === -1) {
                console.error(
                  `⚠ Error checking app ${appId}: ${error.message}`
                );
                results.android.errors.push({ appId, error: error.message });
              }
            }
          }
        })
      );
    }

    console.log(
      `\n✓ Finished checking removed apps: ${results.android.removedChecked} checked`
    );

    if (results.android.removedToOk.length > 0) {
      console.log(`${results.android.removedToOk.length} restored to ok`);
      results.android.removedToOk.forEach((appId) =>
        console.log(`  - ${appId}`)
      );
    }

    const stale = results.android.removedToStaleOrObsolete.filter((s) =>
      s.includes("→ stale")
    );
    if (stale.length > 0) {
      console.log(`${stale.length} restored to stale`);
      stale.forEach((entry) => console.log(`  - ${entry}`));
    }

    const obsolete = results.android.removedToStaleOrObsolete.filter((s) =>
      s.includes("→ obsolete")
    );
    if (obsolete.length > 0) {
      console.log(`${obsolete.length} restored to obsolete`);
      obsolete.forEach((entry) => console.log(`  - ${entry}`));
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
    console.log("\n=== PROCESSING iOS APPS ===========");

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
    const defunctFiles = files
      .map((fileName) => {
        const content = helper.loadFromFile(path.join(IOS_DIR, fileName));
        return { fileName, content };
      })
      .filter((obj) => obj.content.header.meta === "defunct");

    console.log(
      `Found ${defunctFiles.length} files that have \`meta: defunct\``
    );

    const BATCH_SIZE = 5;

    for (let i = 0; i < defunctFiles.length; i += BATCH_SIZE) {
      const batch = defunctFiles.slice(i, i + BATCH_SIZE);

      await Promise.allSettled(
        batch.map(async ({ fileName, content }) => {
          const filePath = path.join(IOS_DIR, fileName);
          const header = content.header;
          const appId = header.appId;
          const idd = header.idd;
          const appCountry = header.appCountry || "us";

          results.ios.defunctChecked++;
          process.stdout.write(
            `\rNow processing defunct apps...   Defunct apps checked: ${results.ios.defunctChecked}     Action taken to ${results.ios.defunctToRemoved.length} files`
          );

          if (!idd) return;

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

              appFound = true;
              break;
            } catch (error) {
              lastError = error;
              if (`${error}`.search(/404/) === -1) break;
            }
          }

          if (!appFound && `${lastError}`.includes("404")) {
            header.meta = "removed";
            helper.writeResult(IOS_DIR + "/", header, content.body);
            results.ios.defunctToRemoved.push(appId);
          } else if (!appFound) {
            results.ios.errors.push({
              appId,
              error: lastError?.message || "Unknown error",
            });
          }
        })
      );
    }

    console.log(
      `\n✓ Finished checking defunct iOS apps: ${results.ios.defunctChecked} checked, ${results.ios.defunctToRemoved.length} changed to removed`
    );

    // Then process removed apps
    console.log("\nChecking iOS apps marked as removed...");

    const removedFiles = files.filter((fileName) => {
      const content = helper.loadFromFile(path.join(IOS_DIR, fileName));
      return content.header.meta === "removed";
    });
    console.log(
      `Found ${removedFiles.length} files that have \`meta: removed\``
    );

    for (let i = 0; i < removedFiles.length; i += BATCH_SIZE) {
      const batch = removedFiles.slice(i, i + BATCH_SIZE);

      await Promise.allSettled(
        batch.map(async (fileName) => {
          const filePath = path.join(IOS_DIR, fileName);
          const content = helper.loadFromFile(filePath);
          const header = content.header;
          const appId = header.appId;
          const idd = header.idd;
          const appCountry = header.appCountry || "us";

          if (header.meta === "removed") {
            results.ios.removedChecked++;
            process.stdout.write(
              `\rNow processing removed apps...   Removed apps checked: ${
                results.ios.removedChecked
              }     Action taken to ${
                results.ios.removedToOk.length +
                results.ios.removedToStaleOrObsolete.length
              } files`
            );

            if (!idd) {
              try {
                const lookupResult = await apple.lookup({ bundleId: appId });
                if (lookupResult.length > 0) {
                  header.idd = lookupResult[0].trackId;
                } else {
                  return;
                }
              } catch {
                return;
              }
            }

            const countriesToTry = [
              appCountry,
              ...IOS_REGIONS.filter((c) => c !== appCountry),
            ];
            let appFound = false;

            for (const country of countriesToTry) {
              try {
                await apple.app({
                  id: header.idd,
                  lang: "en",
                  country: country,
                  throttle: 2,
                });

                appFound = true;

                const originalMeta = header.meta;
                updateMeta(header);

                if (["ok", "stale", "obsolete"].includes(header.meta)) {
                  header.verdict = "wip";
                }                

                helper.writeResult(IOS_DIR + "/", header, content.body);

                if (header.meta === "ok") {
                  results.ios.removedToOk.push(appId);
                } else if (["stale", "obsolete"].includes(header.meta)) {
                  results.ios.removedToStaleOrObsolete.push(
                    `${appId} → ${header.meta}`
                  );
                }
                break;
              } catch (error) {
                if (`${error}`.search(/404/) === -1) {
                  results.ios.errors.push({ appId, error: error.message });
                  break;
                }
              }
            }
          }
        })
      );
    }

    console.log(
      `\n✓ Finished checking removed iOS apps: ${results.ios.removedChecked} checked`
    );

    if (results.ios.removedToOk.length > 0) {
      console.log(`${results.ios.removedToOk.length} restored to ok`);
      results.ios.removedToOk.forEach((appId) => console.log(`  - ${appId}`));
    }

    const stale = results.ios.removedToStaleOrObsolete.filter((s) =>
      s.includes("→ stale")
    );
    if (stale.length > 0) {
      console.log(`${stale.length} restored to stale`);
      stale.forEach((entry) => console.log(`  - ${entry}`));
    }

    const obsolete = results.ios.removedToStaleOrObsolete.filter((s) =>
      s.includes("→ obsolete")
    );
    if (obsolete.length > 0) {
      console.log(`${obsolete.length} restored to obsolete`);
      obsolete.forEach((entry) => console.log(`  - ${entry}`));
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
    "Apps Changed from Removed to Stale/Obsolete",
    results.android.removedToStaleOrObsolete
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
  androidReport += `- Total removed→stale/obsolete changes: ${results.android.removedToStaleOrObsolete.length}\n`;

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
    "Apps Changed from Removed to Stale/Obsolete",
    results.ios.removedToStaleOrObsolete
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
  iosReport += `- Total removed→stale/obsolete changes: ${results.ios.removedToStaleOrObsolete.length}\n`;

  // Combined report
  let combinedReport = "# App Status Check Report\n\n";
  combinedReport += `## Summary\n\n`;
  combinedReport += `- Total defunct→removed changes: ${
    results.android.defunctToRemoved.length +
    results.ios.defunctToRemoved.length
  }\n`;
  combinedReport += `- Total removed→stale/obsolete changes: ${
    results.android.removedToStaleOrObsolete.length +
    results.ios.removedToStaleOrObsolete.length
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
