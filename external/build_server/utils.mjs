import { exec, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import minimist from 'minimist';
import { appLog, verificationsLog } from './logger.js';

const appInfoURL = 'https://walletscrutiny.com/assets/js/json/buildServerInfo.json';

export function isDebugEnv() {
  const args = minimist(process.argv.slice(2));
  return args.debug === true || args.debug === 'true';
}

// Helper to compare semantic versions like "1.2.3" or "1.3.5Q"
// "a" is the last version found in a verification
// "b" is the latest version found in the update scripts
// If b > a, there is a new version
export function compareVersions(a, b) {
  a = a.split('/').pop();
  b = b.split('/').pop();

  a = a.replace(/^v/i, '');
  b = b.replace(/^v/i, '');

  const aMatch = a.match(/^(\d+\.\d+\.\d+)/);
  const bMatch = b.match(/^(\d+\.\d+\.\d+)/);
  
  if (aMatch) {
    a = aMatch[1];
  }
  if (bMatch) {
    b = bMatch[1];
  }

  if (!a || !b) {
    return 0;
  }
  
  // Split by '.' and extract numeric parts and suffixes
  const parsePart = (part) => {
    const match = part.match(/^(\d+)(.*)$/);
    if (match) {
      return { numeric: parseInt(match[1], 10), suffix: match[2] };
    }
    return { numeric: 0, suffix: part };
  };
  
  const pa = a.split('.').map(parsePart);
  const pb = b.split('.').map(parsePart);

  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const aPart = pa[i] || { numeric: 0, suffix: '' };
    const bPart = pb[i] || { numeric: 0, suffix: '' };
    
    // Compare numeric parts first
    if (aPart.numeric < bPart.numeric) return 1;
    if (aPart.numeric > bPart.numeric) return -1;
    
    // If numeric parts are equal, compare suffixes lexicographically
    if (aPart.suffix !== bPart.suffix) {
      return aPart.suffix.localeCompare(bPart.suffix);
    }
  }
  return 0;
}

export function groupVerificationsByAppIdAndSortByVersion(reproducibleVerifications) {
  const verificationsByAppId = new Map();

  for (const verification of reproducibleVerifications) {
    const appId = getFirstTagValue(verification, 'i');
    let version = getFirstTagValue(verification, 'version');
    version = version.replace(/^v/i, '');
    
    if (!verificationsByAppId.has(appId)) {
      verificationsByAppId.set(appId, []);
    }
    
    verificationsByAppId.get(appId).push({
      verification,
      version
    });
  }

  return verificationsByAppId;
}

export function findFileRecursively(dir, fileName) {
  if (!fs.existsSync(dir)) return null;

  try {
    const result = execSync(`find "${dir}" -name "${fileName}" -type f | head -n 1`, { encoding: 'utf8' });
    const filePath = result.trim();
    return filePath || null;
  } catch (error) {
    return null;
  }
}

export async function fetchAppInfo(appInfoSource = appInfoURL) {
  try {
    if (appInfoSource.startsWith('http://') || appInfoSource.startsWith('https://')) {
      appLog.info(`Fetching app info from ${appInfoSource}...`);
      const response = await fetch(appInfoSource);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const appInfo = await response.json();
      appLog.info('App info fetched successfully');
      return appInfo;
    }

    const resolvedPath = path.isAbsolute(appInfoSource)
      ? appInfoSource
      : path.resolve(process.cwd(), appInfoSource);
    appLog.info(`Loading app info from local file ${resolvedPath}...`);
    const raw = fs.readFileSync(resolvedPath, 'utf8');
    const appInfo = JSON.parse(raw);
    appLog.info('App info loaded successfully');
    return appInfo;
  } catch (error) {
    appLog.error(`Error loading app info from ${appInfoSource}:`, error);
    throw error;
  }
}

export async function startCompilationJob(buildDirForThisVerification, script, newWalletVersion, architecture, type) {
  return new Promise((resolve, reject) => {
    // Execute script with asciinema recording
    const architectureFlag = architecture ? `--arch ${architecture}` : '';
    const typeFlag = type ? `--type ${type}` : '';
    const scriptArgs = [architectureFlag, typeFlag].filter(Boolean).join(' ');
    const argsString = scriptArgs ? ` ${scriptArgs}` : '';
    const finalScriptExecutionCommand = `${script} --version ${newWalletVersion}${argsString}`;

    let castFileName = script.replace(/\.sh$/, '');
    castFileName += `${architecture ? `_${architecture}` : ''}${type ? `_${type}` : ''}.cast`;
    const asciinemaCommand = `cd ${buildDirForThisVerification} && asciinema rec --overwrite -c "sleep 2; ${finalScriptExecutionCommand} ; echo scriptrc=\\$?" ${castFileName}`;
    appLog.info(`Recording and executing script: ${asciinemaCommand}`);
    exec(asciinemaCommand, {
      env: {
        // Ensure PATH includes standard system directories for rootless container tools
        PATH: process.env.PATH || '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin',
        HOME: process.env.HOME || '/tmp',
        XDG_CONFIG_HOME: process.env.XDG_CONFIG_HOME || '/tmp/.config',
        ASCIINEMA_CONFIG_HOME: process.env.ASCIINEMA_CONFIG_HOME || '/tmp/.config'
      },
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer for large script outputs
    }, (error, stdout, stderr) => {
      if (error) {
        appLog.error(`Error recording and executing script: ${error}`);
        reject(error);
      } else {
        appLog.info(`Script recorded and executed successfully: ${castFileName}`);
        resolve({
          castFileName: castFileName,
          finalScriptExecutionCommand: finalScriptExecutionCommand,
          buildDirForThisVerification: buildDirForThisVerification
        });
      }
    });
  });
}

export async function calculateFileHash(file) {
  const arrayBuffer = await file.arrayBuffer();
  const crypto = await import("crypto");
  const { Buffer } = await import("buffer");
  const buffer = Buffer.from(arrayBuffer);
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

export function getFirstTagValue(event, tagName, valueIfNull = '') {
  return event.tags.find(tag => tag[0] === tagName)?.[1] ?? valueIfNull;
}

export function readComparisonResults(buildDirForThisVerification, architecture, appId, newWalletVersion, type) {
  let hashes = [];
  let matches = false;

  // First, try to find and read COMPARISON_RESULTS.yaml
  const yamlFilePath = findFileRecursively(buildDirForThisVerification, 'COMPARISON_RESULTS.yaml');
  if (yamlFilePath) {
    try {
      const yamlContent = fs.readFileSync(yamlFilePath, 'utf8');
      const data = yaml.load(yamlContent);

      appLog.info(`COMPARISON_RESULTS.yaml content: ${JSON.stringify(data)}`);
      if (data?.results) {
        // Find all results matching the architecture
        const architectureResults = data.results.filter(r => r.architecture === architecture);

        if (architectureResults.length > 0) {
          const allFileMatches = [];
          
          for (const result of architectureResults) {
            // Check if it's the new format with files array
            if (result.files && Array.isArray(result.files)) {
              // New format: multiple files per architecture
              const fileHashes = result.files
                .filter(file => file.hash)
                .map(file => file.hash);
              hashes.push(...fileHashes);
              
              // Collect match status for each file
              result.files.forEach(file => {
                if (file.hash) {
                  allFileMatches.push(file.match === true);
                }
              });
            } else if (result.hash) {
              // Old format or flat format: single hash per entry
              hashes.push(result.hash);
              allFileMatches.push(result.match === true);
            }
          }
          
          // All files/entries must match for overall match to be true
          matches = allFileMatches.length > 0 && allFileMatches.every(m => m === true);
        }
      }

      if (hashes.length > 0) {
        return { hashes, matches };
      }
    } catch (error) {
      appLog.error(`Error reading COMPARISON_RESULTS.yaml: ${error}`);
      verificationsLog.info(`--- ${appId} ${newWalletVersion} | Error reading COMPARISON_RESULTS.yaml: ${architecture ? architecture : ''} ${type ? type : ''} ${JSON.stringify(error)}`);
    }
  }

  // Fallback to COMPARISON_RESULTS.txt if YAML not found or didn't contain matching architecture
  const comparisonFilePath = findFileRecursively(buildDirForThisVerification, 'COMPARISON_RESULTS.txt');
  if (!comparisonFilePath) {
    return null;
  }

  try {
    const content = fs.readFileSync(comparisonFilePath, 'utf8');
    const line = content.split('\n').find(l => l.includes(` - ${architecture} - `));
    if (line) {
      const tokens = line.split(' - ');
      const hash = tokens[2];
      if (hash) {
        hashes = [hash];
        matches = tokens[3]?.trim().startsWith('1');
      }
    }
  } catch (error) {
    appLog.error(`Error reading COMPARISON_RESULTS.txt: ${error}`);
    verificationsLog.info(`--- ${appId} ${newWalletVersion} | Error reading COMPARISON_RESULTS.txt: ${architecture ? architecture : ''} ${type ? type : ''} ${JSON.stringify(error)}`);
  }
  
  if (hashes.length === 0) {
    return null;
  }
  
  return { hashes, matches };
}
