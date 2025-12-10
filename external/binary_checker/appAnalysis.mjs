#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DEFAULT_TEMP_DIR = path.join(__dirname, 'temp_repos');
const YEARS_FOR_OUTDATED_CHECK = 5; // Report dependencies not updated in last X years
const MIN_DOWNLOADS_THRESHOLD = 10000; // Minimum downloads per month to avoid alert

export const APP_TYPES = {
  NPM: 'npm',
  GRADLE: 'gradle',
  MAVEN: 'maven',
  PIP: 'pip',
  UNKNOWN: 'unknown'
};

/**
 * Detect the type of application based on dependency files
 */
export function detectAppType(repoPath) {
  if (fs.existsSync(path.join(repoPath, 'package.json'))) {
    return APP_TYPES.NPM;
  }
  
  if (fs.existsSync(path.join(repoPath, 'build.gradle')) || 
      fs.existsSync(path.join(repoPath, 'build.gradle.kts'))) {
    return APP_TYPES.GRADLE;
  }
  
  if (fs.existsSync(path.join(repoPath, 'pom.xml'))) {
    return APP_TYPES.MAVEN;
  }
  
  if (fs.existsSync(path.join(repoPath, 'requirements.txt')) ||
      fs.existsSync(path.join(repoPath, 'setup.py')) ||
      fs.existsSync(path.join(repoPath, 'pyproject.toml'))) {
    return APP_TYPES.PIP;
  }
  
  return APP_TYPES.UNKNOWN;
}

export async function installDependencies(repoPath, appType) {
  console.log('Installing dependencies...');
  
  try {
    switch (appType) {
      case APP_TYPES.NPM:
        try {
          const packageLockPath = path.join(repoPath, 'package-lock.json');
          const yarnLockPath = path.join(repoPath, 'yarn.lock');
          
          let installCommand;
          let packageManager;
          
          if (fs.existsSync(yarnLockPath)) {
            installCommand = 'yarn install';
            packageManager = 'yarn';
          } else if (fs.existsSync(packageLockPath)) {
            installCommand = 'npm install';
            packageManager = 'npm';
          } else {
            installCommand = 'npm install';
            packageManager = 'npm (no lock file found)';
          }
          
          console.log(`Using ${packageManager} to install dependencies...`);
          execSync(installCommand, {
            cwd: repoPath,
            encoding: 'utf8',
            stdio: 'pipe',
            timeout: 300000 // 5 minutes for npm install
          });
          console.log('Dependencies installed successfully');
        } catch (error) {
          console.log('Warning: Could not install npm dependencies:', error.message);
          return false;
        }
        break;
        
      case APP_TYPES.GRADLE:
        // Gradle downloads dependencies automatically when running commands
        break;
        
      case APP_TYPES.MAVEN:
        // Maven downloads dependencies automatically when running commands
        break;
        
      case APP_TYPES.PIP:
        try {
          execSync('pip install -r requirements.txt', {
            cwd: repoPath,
            encoding: 'utf8',
            stdio: 'pipe',
            timeout: 300000
          });
          console.log('Dependencies installed successfully');
        } catch (error) {
          console.log('Warning: Could not install pip dependencies:', error.message);
          return false;
        }
        break;
        
      default:
        console.log('Unknown app type, skipping dependency installation');
    }
    return true;
  } catch (error) {
    console.error('Error installing dependencies:', error.message);
    return false;
  }
}

/**
 * Clone a git repository to a temporary directory
 */
export async function cloneRepository(repoUrl, targetPath, tagName) {
  console.log(`Cloning repository ${repoUrl} to ${targetPath} with tag ${tagName}...`);
  try {
    fs.rmSync(targetPath, { recursive: true, force: true });
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });

    execSync(`git clone --branch ${tagName} --depth 1 ${repoUrl} "${targetPath}"`, {
      stdio: 'pipe',
      timeout: 60000
    });
    return true;
  } catch (error) {
    console.error(`Error cloning repository ${repoUrl}:`, error.message);
    return false;
  }
}

/**
 * Format dependency tree JSON as a list for printing
 */
export function formatDependencyTreeAsList(tree, indent = 0, prefix = '', skipRoot = false, nodeName = null) {
  if (!tree || typeof tree !== 'object') {
    return [];
  }
  
  const lines = [];
  const indentStr = '  '.repeat(indent);
  
  // Use provided nodeName or tree.name, but not 'root'
  const nameToUse = nodeName || tree.name;
  
  // Print node name (skip if it's a dummy root node)
  if (!skipRoot && nameToUse && nameToUse !== 'root') {
    const version = tree.version ? `@${tree.version}` : '';
    const line = `${indentStr}${prefix}${nameToUse}${version}`;
    lines.push(line);
  }
  
  // Process dependencies
  if (tree.dependencies && typeof tree.dependencies === 'object') {
    const depEntries = Object.entries(tree.dependencies);
    depEntries.forEach(([key, value], index) => {
      const isLast = index === depEntries.length - 1;
      // Determine prefix and indent for child nodes
      let newPrefix, newIndent;
      if (skipRoot) {
        // Root was skipped, so children start at root level
        newPrefix = '';
        newIndent = indent;
      } else {
        // Root was printed, so children need tree formatting
        newPrefix = isLast ? '└── ' : '├── ';
        newIndent = indent + 1;
      }
      // Pass the key as nodeName in case the value doesn't have a name property (npm format)
      const childLines = formatDependencyTreeAsList(value, newIndent, newPrefix, false, key);
      lines.push(...childLines);
    });
  }
  
  return lines;
}

/**
 * Parse Gradle dependency tree output into JSON format
 */
export function parseGradleDependencyTree(output) {
  const lines = output.split('\n');
  const tree = { name: 'root', dependencies: {} };
  const stack = [{ node: tree, level: 0 }];
  
  for (const line of lines) {
    if (!line.trim() || line.includes('---') || line.includes('\\---')) {
      continue;
    }
    
    const match = line.match(/^(\s*)([+\-\\| ]*)([^:]+):([^:]+):([^:]+)(?::([^:]+))?/);
    if (match) {
      const [, indent, , group, artifact, version, classifier] = match;
      const level = indent.length;
      const name = classifier ? `${group}:${artifact}:${classifier}` : `${group}:${artifact}`;
      
      // Find parent node at appropriate level
      while (stack.length > 1 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }
      
      const parent = stack[stack.length - 1].node;
      if (!parent.dependencies) {
        parent.dependencies = {};
      }
      
      const newNode = { name, version, dependencies: {} };
      parent.dependencies[name] = newNode;
      stack.push({ node: newNode, level });
    }
  }
  
  return tree;
}

/**
 * Parse Maven dependency tree output into JSON format
 */
export function parseMavenDependencyTree(output) {
  const lines = output.split('\n');
  const tree = { name: 'root', dependencies: {} };
  const stack = [{ node: tree, level: 0 }];
  
  for (const line of lines) {
    if (!line.trim() || line.includes('[INFO]') || line.includes('Building')) {
      continue;
    }
    
    const match = line.match(/^(\s*)([+\-\\| ]*)([^:]+):([^:]+):([^:]+)(?::([^:]+))?/);
    if (match) {
      const [, indent, , group, artifact, type, version] = match;
      const level = indent.length;
      const name = `${group}:${artifact}`;
      
      // Find parent node at appropriate level
      while (stack.length > 1 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }
      
      const parent = stack[stack.length - 1].node;
      if (!parent.dependencies) {
        parent.dependencies = {};
      }
      
      const newNode = { name, version: version || type, dependencies: {} };
      parent.dependencies[name] = newNode;
      stack.push({ node: newNode, level });
    }
  }
  
  return tree;
}

/**
 * Parse pipdeptree output into JSON format
 */
export function parsePipDependencyTree(output) {
  const lines = output.split('\n');
  const tree = { name: 'root', dependencies: {} };
  const stack = [{ node: tree, level: 0 }];
  
  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }
    
    const match = line.match(/^(\s*)([+\-\\| ]*)([^=]+)(?:==([^\s]+))?/);
    if (match) {
      const [, indent, , name, version] = match;
      const level = indent.length;
      
      // Find parent node at appropriate level
      while (stack.length > 1 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }
      
      const parent = stack[stack.length - 1].node;
      if (!parent.dependencies) {
        parent.dependencies = {};
      }
      
      const newNode = { name: name.trim(), version: version || '', dependencies: {} };
      parent.dependencies[name.trim()] = newNode;
      stack.push({ node: newNode, level });
    }
  }
  
  return tree;
}

/**
 * Test 1: Show dependency tree (including dependencies of dependencies)
 * Returns JSON format and optionally prints as list
 */
export async function showDependencyTree(repoPath, appType, printList = true) {
  console.log('\n=== Dependency Tree ===');
  
  try {
    let treeJson = null;
    
    switch (appType) {
      case APP_TYPES.NPM:
        try {
          const npmTree = execSync('npm list --all --json', {
            cwd: repoPath,
            encoding: 'utf8',
            timeout: 30000
          });
          treeJson = JSON.parse(npmTree);
        } catch (error) {
          console.log('Could not generate npm dependency tree:', error.message);
          return null;
        }
        break;
        
      case APP_TYPES.GRADLE:
        try {
          const gradleOutput = execSync('./gradlew dependencies --configuration runtimeClasspath', {
            cwd: repoPath,
            encoding: 'utf8',
            timeout: 60000
          });
          treeJson = parseGradleDependencyTree(gradleOutput);
        } catch (error) {
          console.log('Could not generate gradle dependency tree:', error.message);
          return null;
        }
        break;
        
      case APP_TYPES.MAVEN:
        try {
          const mavenOutput = execSync('mvn dependency:tree', {
            cwd: repoPath,
            encoding: 'utf8',
            timeout: 60000
          });
          treeJson = parseMavenDependencyTree(mavenOutput);
        } catch (error) {
          console.log('Could not generate maven dependency tree:', error.message);
          return null;
        }
        break;
        
      case APP_TYPES.PIP:
        try {
          const pipOutput = execSync('pipdeptree', {
            cwd: repoPath,
            encoding: 'utf8',
            timeout: 30000
          });
          treeJson = parsePipDependencyTree(pipOutput);
        } catch (error) {
          console.log('Could not generate pip dependency tree. Install pipdeptree: pip install pipdeptree');
          return null;
        }
        break;
        
      default:
        console.log('Unknown app type, cannot generate dependency tree');
        return null;
    }
    
    // Print formats if requested
    if (printList && treeJson) {
      // Print JSON format
      //console.log('\nDependency Tree (JSON Format):');
      //console.log(JSON.stringify(treeJson, null, 2));
      
      // Print list format
      const skipRoot = treeJson.name === 'root';
      const listLines = formatDependencyTreeAsList(treeJson, 0, '', skipRoot);
      if (listLines.length > 0) {
        console.log('\nDependency Tree (List Format):');
        listLines.forEach(line => console.log(line));
      }
    }
    
    return treeJson;
  } catch (error) {
    console.error('Error showing dependency tree:', error.message);
    return null;
  }
}

/**
 * Test 2: Count number of direct dependencies
 */
export async function countDirectDependencies(repoPath, appType) {
  console.log('\n=== Direct Dependencies Count ===');
  
  try {
    let count = 0;
    
    switch (appType) {
      case APP_TYPES.NPM:
        const packageJsonPath = path.join(repoPath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          const deps = packageJson.dependencies || {};
          const devDeps = packageJson.devDependencies || {};
          count = Object.keys(deps).length + Object.keys(devDeps).length;
          console.log(`${count} dependencies = ${Object.keys(deps).length} dependencies + ${Object.keys(devDeps).length} devDependencies`);
        }
        break;
        
      case APP_TYPES.GRADLE:
        try {
          const buildGradlePath = path.join(repoPath, 'build.gradle');
          const buildGradleKtsPath = path.join(repoPath, 'build.gradle.kts');
          let buildFile = null;
          
          if (fs.existsSync(buildGradlePath)) {
            buildFile = fs.readFileSync(buildGradlePath, 'utf8');
          } else if (fs.existsSync(buildGradleKtsPath)) {
            buildFile = fs.readFileSync(buildGradleKtsPath, 'utf8');
          }
          
          if (buildFile) {
            // Count dependencies in implementation, api, compile configurations
            const depMatches = buildFile.match(/(?:implementation|api|compile|runtimeOnly|testImplementation)\s*\(['"]([^'"]+)['"]\)/g);
            if (depMatches) {
              count = depMatches.length;
            }
            console.log(`Direct dependencies: ${count}`);
          }
        } catch (error) {
          console.log('Error counting gradle dependencies:', error.message);
        }
        break;
        
      case APP_TYPES.MAVEN:
        const pomPath = path.join(repoPath, 'pom.xml');
        if (fs.existsSync(pomPath)) {
          const pomContent = fs.readFileSync(pomPath, 'utf8');
          const depMatches = pomContent.match(/<dependency>/g);
          if (depMatches) {
            count = depMatches.length;
          }
          console.log(`Direct dependencies: ${count}`);
        }
        break;
        
      case APP_TYPES.PIP:
        const requirementsPath = path.join(repoPath, 'requirements.txt');
        if (fs.existsSync(requirementsPath)) {
          const requirements = fs.readFileSync(requirementsPath, 'utf8');
          const lines = requirements.split('\n').filter(line => {
            const trimmed = line.trim();
            return trimmed && !trimmed.startsWith('#') && !trimmed.startsWith('-');
          });
          count = lines.length;
          console.log(`Direct dependencies: ${count}`);
        } else {
          const setupPyPath = path.join(repoPath, 'setup.py');
          if (fs.existsSync(setupPyPath)) {
            const setupPy = fs.readFileSync(setupPyPath, 'utf8');
            const installRequiresMatch = setupPy.match(/install_requires\s*=\s*\[(.*?)\]/s);
            if (installRequiresMatch) {
              const deps = installRequiresMatch[1].match(/['"]([^'"]+)['"]/g);
              if (deps) {
                count = deps.length;
              }
            }
            console.log(`Direct dependencies: ${count}`);
          }
        }
        break;
        
      default:
        console.log('Unknown app type, cannot count dependencies');
    }
    
    return count;
  } catch (error) {
    console.error('Error counting dependencies:', error.message);
    return 0;
  }
}

/**
 * Test 3: List dependencies without fixed versions
 */
export async function listDependenciesWithoutFixedVersions(repoPath, appType) {
  console.log('\n=== Dependencies Without Fixed Versions ===');
  
  try {
    const unfixedDeps = [];
    
    switch (appType) {
      case APP_TYPES.NPM:
        const packageJsonPath = path.join(repoPath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
          
          for (const [name, version] of Object.entries(allDeps)) {
            // Check if version is not fixed (contains ^, ~, *, latest, or is empty)
            if (!version || 
                version === 'latest' || 
                version === '*' || 
                version.startsWith('^') || 
                version.startsWith('~') ||
                version.startsWith('>') ||
                version.startsWith('<') ||
                version.includes('||') ||
                version.includes('x')) {
              unfixedDeps.push({ name, version });
            }
          }
        }
        break;
        
      case APP_TYPES.GRADLE:
        const buildGradlePath = path.join(repoPath, 'build.gradle');
        const buildGradleKtsPath = path.join(repoPath, 'build.gradle.kts');
        let buildFile = null;
        
        if (fs.existsSync(buildGradlePath)) {
          buildFile = fs.readFileSync(buildGradlePath, 'utf8');
        } else if (fs.existsSync(buildGradleKtsPath)) {
          buildFile = fs.readFileSync(buildGradleKtsPath, 'utf8');
        }
        
        if (buildFile) {
          // Match dependencies and check for version ranges
          const depRegex = /(?:implementation|api|compile|runtimeOnly|testImplementation)\s*\(['"]([^'"]+):([^'"]+):([^'"]+)['"]\)/g;
          let match;
          while ((match = depRegex.exec(buildFile)) !== null) {
            const [, group, artifact, version] = match;
            if (!version || 
                version === '+' || 
                version.startsWith('+') ||
                version.includes('[') ||
                version.includes('(')) {
              unfixedDeps.push({ name: `${group}:${artifact}`, version });
            }
          }
        }
        break;
        
      case APP_TYPES.MAVEN:
        const pomPath = path.join(repoPath, 'pom.xml');
        if (fs.existsSync(pomPath)) {
          const pomContent = fs.readFileSync(pomPath, 'utf8');
          const depRegex = /<dependency>[\s\S]*?<groupId>([^<]+)<\/groupId>[\s\S]*?<artifactId>([^<]+)<\/artifactId>[\s\S]*?<version>([^<]*)<\/version>[\s\S]*?<\/dependency>/g;
          let match;
          while ((match = depRegex.exec(pomContent)) !== null) {
            const [, groupId, artifactId, version] = match;
            if (!version || 
                version.trim() === '' ||
                version.includes('${') ||
                version.includes('[') ||
                version.includes('(')) {
              unfixedDeps.push({ name: `${groupId}:${artifactId}`, version: version.trim() || '(no version)' });
            }
          }
        }
        break;
        
      case APP_TYPES.PIP:
        const requirementsPath = path.join(repoPath, 'requirements.txt');
        if (fs.existsSync(requirementsPath)) {
          const requirements = fs.readFileSync(requirementsPath, 'utf8');
          const lines = requirements.split('\n');
          
          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
              // Parse package name and version
              const parts = trimmed.split(/[>=<!=]/);
              const name = parts[0].trim();
              const versionPart = trimmed.substring(trimmed.indexOf(name) + name.length).trim();
              
              if (!versionPart || 
                  versionPart.startsWith('>') || 
                  versionPart.startsWith('<') ||
                  versionPart.includes(',')) {
                unfixedDeps.push({ name, version: versionPart || '(no version)' });
              }
            }
          }
        }
        break;
        
      default:
        console.log('Unknown app type, cannot check for unfixed versions');
    }
    
    if (unfixedDeps.length === 0) {
      console.log('All dependencies have fixed versions');
    } else {
      console.log(`Found ${unfixedDeps.length} dependencies without fixed versions:`);
      unfixedDeps.forEach(dep => {
        console.log(`  - ${dep.name}: ${dep.version}`);
      });
    }
    
    return unfixedDeps;
  } catch (error) {
    console.error('Error listing dependencies without fixed versions:', error.message);
    return [];
  }
}

/**
 * Test 4: Execute vulnerability scan
 */
export async function scanVulnerabilities(repoPath, appType) {
  console.log('\n=== Vulnerability Scan ===');
  
  try {
    switch (appType) {
      case APP_TYPES.NPM:
        try {
          const yarnLockPath = path.join(repoPath, 'yarn.lock');
          
          let auditCommand;
          
          if (fs.existsSync(yarnLockPath)) {
            auditCommand = 'yarn audit --json';
          } else {
            auditCommand = 'npm audit --json';
          }
          
          console.log(`Running ${auditCommand}...`);
          let auditResult;
          try {
            auditResult = execSync(auditCommand, {
              cwd: repoPath,
              encoding: 'utf8',
              timeout: 60000
            });
          } catch (error) {
            // npm/yarn audit exits with non-zero when vulnerabilities are found,
            // but still outputs valid JSON to stdout
            auditResult = error.stdout || error.message || '';
          }
          //console.log('auditResult: ' + JSON.stringify(auditResult));
          const audit = JSON.parse(auditResult);
          const summaryVulnerabilities = audit.metadata.vulnerabilities;
          console.log('  ' + JSON.stringify(summaryVulnerabilities));

          if (summaryVulnerabilities.critical > 0 || summaryVulnerabilities.high > 0) {
            console.log('Critical and high vulnerabilities found:');

            for (const vulnerability of Object.values(audit.vulnerabilities || {})) {
              if (vulnerability.severity === 'critical' || vulnerability.severity === 'high') {
                console.log(`  ** ${vulnerability.name} (${vulnerability.severity}) - Fix available: ${vulnerability.fixAvailable ? 'Yes' : 'No'}`);
              }
            }
          } else {
            console.log('No critical or high vulnerabilities found');
          }

        } catch (error) {
          console.log('error: ' + error);
          console.log('Could not parse audit output:', error.message);
        }
        break;
        
      case APP_TYPES.GRADLE:
        try {
          console.log('Running OWASP Dependency Check (if available)...');
          execSync('./gradlew dependencyCheckAnalyze', {
            cwd: repoPath,
            encoding: 'utf8',
            timeout: 120000
          });
        } catch (error) {
          console.log('OWASP Dependency Check not configured. Install plugin: https://plugins.gradle.org/plugin/org.owasp.dependencycheck');
        }
        break;
        
      case APP_TYPES.MAVEN:
        try {
          console.log('Running OWASP Dependency Check (if available)...');
          execSync('mvn org.owasp:dependency-check-maven:check', {
            cwd: repoPath,
            encoding: 'utf8',
            timeout: 120000
          });
        } catch (error) {
          console.log('OWASP Dependency Check not configured. Install plugin: https://mvnrepository.com/artifact/org.owasp/dependency-check-maven');
        }
        break;
        
      case APP_TYPES.PIP:
        try {
          console.log('Running safety check (if available)...');
          execSync('safety check --json', {
            cwd: repoPath,
            encoding: 'utf8',
            timeout: 60000
          });
        } catch (error) {
          console.log('Safety not installed. Install with: pip install safety');
          console.log('Or use: pip-audit (pip install pip-audit)');
        }
        break;
        
      default:
        console.log('Unknown app type, cannot scan vulnerabilities');
    }
  } catch (error) {
    console.error('Error scanning vulnerabilities:', error.message);
  }
}

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

/**
 * Run all tests for a specific app
 */
export async function runSourceCodeAnalysis({ name, repoUrl, version = 'master' }) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${name} - Repository: ${repoUrl} ${`- Branch: ${version}`}`);
  console.log('='.repeat(60));

  // Ensure temp directory exists
  fs.rmSync(DEFAULT_TEMP_DIR, { recursive: true, force: true });
  fs.mkdirSync(DEFAULT_TEMP_DIR, { recursive: true });
  
  const repoPath = path.join(DEFAULT_TEMP_DIR, name.replace(/[^a-zA-Z0-9.-]/g, '_'));
  
  const cloned = await cloneRepository(repoUrl, repoPath, version);
  if (!cloned) {
    console.log('Failed to clone repository. Skipping...');
    return;
  }
  
  // Detect app type
  const appType = detectAppType(repoPath);
  console.log(`Detected app type: ${appType}`);
  
  if (appType === APP_TYPES.UNKNOWN) {
    console.log('Unknown app type. Skipping tests...');
    return;
  }
  
  // Install dependencies once before running tests that require them
  await installDependencies(repoPath, appType);
  
  // Run all tests
  //await showDependencyTree(repoPath, appType);
  await countDirectDependencies(repoPath, appType);
  await listDependenciesWithoutFixedVersions(repoPath, appType);
  await scanVulnerabilities(repoPath, appType);
  await analyzeDependencies(repoPath, appType);
  
  // Cleanup
  try {
    fs.rmSync(repoPath, { recursive: true, force: true });
  } catch (error) {
    console.error(`Error cleaning up ${repoPath}:`, error.message);
  }
}
