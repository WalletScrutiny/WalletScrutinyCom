// Test 5: packages without a release in YEARS_FOR_OUTDATED_CHECK years, and
// packages under MIN_DOWNLOADS_THRESHOLD monthly downloads.
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { YEARS_FOR_OUTDATED_CHECK, MIN_DOWNLOADS_THRESHOLD, APP_TYPES } from '../config.mjs';

/**
 * Test 5: Analyze dependencies to get
 * - Dependencies not updated in the last X years
 * - Dependencies with little downloads in the last month (deprecated, unused or specifically crafted to be used in the app)
 */
export async function analyzeDependencies(repoPath, appType, yearsThreshold = YEARS_FOR_OUTDATED_CHECK) {
  console.log(`\n=== Dependencies Without Updates in NPMJS in the Last ${yearsThreshold} Years ===`);
  
  try {
    const outdatedDeps = [];
    const cutoffDate = new Date();
    cutoffDate.setFullYear(cutoffDate.getFullYear() - yearsThreshold);
    
    switch (appType) {
      case APP_TYPES.NPM:
        try {
          let outdatedResult = null;
          try {
            outdatedResult = execSync('npm outdated --json', {
              cwd: repoPath,
              encoding: 'utf8',
              timeout: 60000,
              stdio: ['pipe', 'pipe', 'pipe']
            });
          } catch (error) {
            // npm outdated returns exit code 1 when there are outdated packages
            // but still outputs valid JSON to stdout
            if (error.stdout) {
              outdatedResult = error.stdout;
            } else {
              throw error;
            }
          }
          
          const outdated = outdatedResult ? JSON.parse(outdatedResult) : {};
          
          // Get package info to check last update date
          const packageJsonPath = path.join(repoPath, 'package.json');
          if (fs.existsSync(packageJsonPath)) {
            const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
            const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
            
            for (const [name, version] of Object.entries(allDeps)) {
              try {
                const infoResult = execSync(`npm view ${name} time --json`, {
                  encoding: 'utf8',
                  timeout: 5000,
                  stdio: ['pipe', 'pipe', 'pipe']
                });
                const timeInfo = JSON.parse(infoResult);
                
                if (timeInfo && typeof timeInfo === 'object') {
                  const versions = Object.values(timeInfo);
                  if (versions.length > 0) {
                    const lastUpdate = new Date(versions[versions.length - 1]);
                    if (lastUpdate < cutoffDate) {
                      outdatedDeps.push({
                        name,
                        currentVersion: version,
                        lastUpdate: lastUpdate.toISOString()
                      });
                    }
                  }
                }
              } catch (e) {
                // Skip if we can't get info
              }
            }

            if (outdatedDeps.length > 0) {
              console.log(`Found ${outdatedDeps.length} outdated dependencies:`);
              outdatedDeps.forEach(dep => {
                const dateOnly = new Date(dep.lastUpdate).toLocaleDateString('en-GB', { 
                  year: 'numeric', 
                  month: '2-digit', 
                  day: '2-digit' 
                });
                console.log(`  - ${dep.name} (${dep.currentVersion}): Last update ${dateOnly}`);
              });
            } else {
              console.log('No outdated dependencies found (or check not available)');
            }
            
            // Check download statistics for each dependency using bulk queries
            console.log(`\n=== NPM Package Download Statistics (Last Month) ===`);
            
            // Separate scoped packages (starting with @) from non-scoped packages
            const scopedPackages = [];
            const nonScopedPackages = [];
            
            for (const [name, version] of Object.entries(allDeps)) {
              if (name.startsWith('@')) {
                scopedPackages.push({ name, version });
              } else {
                nonScopedPackages.push({ name, version });
              }
            }
            
            // Process non-scoped packages in bulk (max 128 per request)
            const BULK_QUERY_LIMIT = 128;
            for (let i = 0; i < nonScopedPackages.length; i += BULK_QUERY_LIMIT) {
              const batch = nonScopedPackages.slice(i, i + BULK_QUERY_LIMIT);
              const packageNames = batch.map(pkg => pkg.name);
              
              try {
                const response = await fetch(`https://api.npmjs.org/downloads/point/last-month/${packageNames.join(',')}`);
                
                if (response.ok) {
                  const data = await response.json();
                  // Bulk queries return an array of results
                  const results = Array.isArray(data) ? data : [data];
                  
                  for (const result of results) {
                    if (result && result.package) {
                      const downloads = result.downloads || 0;
                      const packageName = result.package;
                      
                      // console.log(`  ${packageName}: ${downloads.toLocaleString()} downloads`);
                      
                      if (downloads < MIN_DOWNLOADS_THRESHOLD) {
                        console.log(`  ALERT: ${packageName} has only ${downloads.toLocaleString()} downloads (below threshold of ${MIN_DOWNLOADS_THRESHOLD})`);
                      }
                    }
                  }
                } else {
                  // If bulk query fails, fall back to individual queries for this batch
                  console.log(`  Bulk query failed (HTTP ${response.status}), falling back to individual queries...`);
                  for (const pkg of batch) {
                    try {
                      const individualUrl = `https://api.npmjs.org/downloads/point/last-month/${pkg.name}`;
                      const individualResponse = await fetch(individualUrl);
                      
                      if (individualResponse.ok) {
                        const individualData = await individualResponse.json();
                        const downloads = individualData.downloads || 0;
                        
                        if (downloads < MIN_DOWNLOADS_THRESHOLD) {
                          console.log(`  ALERT: ${pkg.name} has only ${downloads.toLocaleString()} downloads (below threshold of ${MIN_DOWNLOADS_THRESHOLD.toLocaleString()})`);
                        }
                      } else {
                        console.log(`  ${pkg.name}: Could not fetch download statistics (HTTP ${individualResponse.status})`);
                      }
                    } catch (e) {
                      console.log(`  ${pkg.name}: Error fetching download statistics: ${e.message}`);
                    }
                  }
                }
              } catch (e) {
                console.log(`  Error in bulk query: ${e.message}, falling back to individual queries...`);
                // Fall back to individual queries for this batch
                for (const pkg of batch) {
                  try {
                    const individualResponse = await fetch(`https://api.npmjs.org/downloads/point/last-month/${pkg.name}`);
                    
                    if (individualResponse.ok) {
                      const individualData = await individualResponse.json();
                      const downloads = individualData.downloads || 0;
                      
                      if (downloads < MIN_DOWNLOADS_THRESHOLD) {
                        console.log(`  ALERT: ${pkg.name} has only ${downloads.toLocaleString()} downloads (below threshold of ${MIN_DOWNLOADS_THRESHOLD.toLocaleString()})`);
                      }
                    } else {
                      console.log(`  ${pkg.name}: Could not fetch download statistics (HTTP ${individualResponse.status})`);
                    }
                  } catch (err) {
                    console.log(`  ${pkg.name}: Error fetching download statistics: ${err.message}`);
                  }
                }
              }
            }
            
            // Process scoped packages individually (bulk queries not supported for scoped packages)
            for (const pkg of scopedPackages) {
              try {
                // For scoped packages, encode the / as %2F
                const encodedName = pkg.name.replace(/\//g, '%2F');
                const response = await fetch(`https://api.npmjs.org/downloads/point/last-month/${encodedName}`);

                if (response.ok) {
                  const data = await response.json();
                  const downloads = data.downloads || 0;
                  
                  // console.log(`  ${pkg.name}: ${downloads.toLocaleString()} downloads`);
                  
                  if (downloads < MIN_DOWNLOADS_THRESHOLD) {
                    console.log(`  - ${pkg.name} has only ${downloads.toLocaleString()} downloads to the last month (below threshold of ${MIN_DOWNLOADS_THRESHOLD.toLocaleString()})`);
                  }
                } else {
                  console.log(`  ${pkg.name}: Could not fetch download statistics (HTTP ${response.status})`);
                }

                await new Promise(resolve => setTimeout(resolve, 2000));

              } catch (e) {
                console.log(`  ${pkg.name}: Error fetching download statistics: ${e.message}`);
              }
            }
          }
        } catch (error) {
          console.log('Could not check outdated npm packages:', error.message);
          if (error.stderr) {
            console.log('Error details:', error.stderr.toString());
          }
        }
        break;
        
      case APP_TYPES.GRADLE:
        try {
          execSync('./gradlew dependencyUpdates', {
            cwd: repoPath,
            encoding: 'utf8',
            timeout: 60000
          });
          console.log('Check build/reports/dependencyUpdates/ for detailed report');
        } catch (error) {
          console.log('Gradle Versions Plugin not configured. Add: https://github.com/ben-manes/gradle-versions-plugin');
        }
        break;
        
      case APP_TYPES.MAVEN:
        try {
          execSync('mvn versions:display-dependency-updates', {
            cwd: repoPath,
            encoding: 'utf8',
            timeout: 60000
          });
        } catch (error) {
          console.log('Maven Versions Plugin not configured. Add: https://www.mojohaus.org/versions-maven-plugin/');
        }
        break;
        
      case APP_TYPES.PIP:
        try {
          execSync('pip list --outdated --format=json', {
            cwd: repoPath,
            encoding: 'utf8',
            timeout: 60000
          });
        } catch (error) {
          console.log('Could not check outdated pip packages:', error.message);
        }
        break;
        
      default:
        console.log('Unknown app type, cannot check outdated dependencies');
    }
  } catch (error) {
    console.error('Error checking outdated dependencies:', error.message);
  }
}

export default {
  description: 'Test 5: outdated and little-used dependencies',
  needsKnownAppType: true,
  async container({ repoPath, appType }) {
    await analyzeDependencies(repoPath, appType);
  },
};
