import { exec, execSync } from 'child_process';
import fs from 'fs';
import yaml from 'js-yaml';
import { appLog, verificationsLog } from './logger.js';

const appInfoURL = 'https://walletscrutiny.com/assets/js/json/buildServerInfo.json';

export function isDebugEnv() {
  return false;
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

export async function fetchAppInfo() {
  try {
    appLog.info(`Fetching app info from ${appInfoURL}...`);
    const response = await fetch(appInfoURL);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const appInfo = await response.json();
    appLog.info('App info fetched successfully');
    return appInfo;
  } catch (error) {
    appLog.error(`Error fetching app info from ${appInfoURL}:`, error);
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
  // First, try to find and read COMPARISON_RESULTS.yaml
  const yamlFilePath = findFileRecursively(buildDirForThisVerification, 'COMPARISON_RESULTS.yaml');
  if (yamlFilePath) {
    try {
      const yamlContent = fs.readFileSync(yamlFilePath, 'utf8');
      const data = yaml.load(yamlContent);

      appLog.info(`COMPARISON_RESULTS.yaml content: ${JSON.stringify(data)}`);
      if (data && data.results && Array.isArray(data.results)) {
        // FIX #1: Check for duplicate architecture entries
        const archCounts = {};
        data.results.forEach(r => {
          if (r.architecture) {
            archCounts[r.architecture] = (archCounts[r.architecture] || 0) + 1;
          }
        });
        const duplicateArchs = Object.keys(archCounts).filter(a => archCounts[a] > 1);
        if (duplicateArchs.length > 0) {
          appLog.error(`YAML has duplicate architecture entries: ${duplicateArchs.join(', ')}. Use nested files[] array to list multiple files under ONE architecture entry. See docs/script_verifications.md for examples.`);
          verificationsLog.info(`--- ${appId} ${newWalletVersion} | YAML format error - duplicate architectures: ${duplicateArchs.join(', ')} (requested: ${architecture}) ${type ? type : ''}`);
          return null;
        }

        const result = data.results.find(r => r.architecture === architecture);
        if (result) {
          // NEW: Handle nested files array (Option B)
          if (result.files && Array.isArray(result.files)) {
            // FIX #2a: Validate files array is not empty
            if (result.files.length === 0) {
              appLog.error(`YAML result for ${architecture} has empty files array`);
              verificationsLog.info(`--- ${appId} ${newWalletVersion} | YAML empty files array: ${architecture} ${type ? type : ''}`);
              return null;
            }

            // FIX #2b: Validate each file has a valid hash
            const filesWithoutHash = result.files.filter(f => !f.hash || typeof f.hash !== 'string' || f.hash.length === 0);
            if (filesWithoutHash.length > 0) {
              appLog.error(`YAML result for ${architecture} has ${filesWithoutHash.length} file(s) without valid hash`);
              verificationsLog.info(`--- ${appId} ${newWalletVersion} | YAML missing hashes: ${architecture} ${filesWithoutHash.length} file(s) ${type ? type : ''}`);
              return null;
            }

            const hashes = result.files.map(f => f.hash);
            const allMatch = result.files.every(f => f.match === true);
            appLog.info(`YAML parsed (nested files): ${hashes.length} files, allMatch=${allMatch}`);
            return {
              hashes: hashes,
              matches: allMatch,
              files: result.files
            };
          }
          // OLD: Backward compatibility for single hash field
          else if (result.hash) {
            // FIX #2c: Validate single hash field
            if (typeof result.hash !== 'string' || result.hash.length === 0) {
              appLog.error(`YAML result for ${architecture} has invalid hash field`);
              verificationsLog.info(`--- ${appId} ${newWalletVersion} | YAML invalid hash: ${architecture} ${type ? type : ''}`);
              return null;
            }

            appLog.info(`YAML parsed (legacy single hash): hash=${result.hash}, match=${result.match}`);
            return {
              hashes: [result.hash],
              matches: result.match === true,
              files: [{ filename: '', hash: result.hash, match: result.match }]
            };
          }
          else {
            // FIX #2d: Explicit error for malformed result (neither files nor hash)
            appLog.error(`YAML result for ${architecture} has neither 'files' array nor 'hash' field`);
            verificationsLog.info(`--- ${appId} ${newWalletVersion} | YAML malformed result: ${architecture} missing files/hash ${type ? type : ''}`);
            return null;
          }
        } else {
          // FIX #3: Log when architecture not found in YAML
          const availableArchs = data.results.map(r => r.architecture).filter(Boolean).join(', ');
          appLog.warn(`YAML exists but no result for architecture '${architecture}'. Available: ${availableArchs || 'none'}`);
          verificationsLog.info(`--- ${appId} ${newWalletVersion} | YAML architecture not found: requested '${architecture}', available: ${availableArchs || 'none'} ${type ? type : ''}`);
        }
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
      const matches = tokens[3]?.trim().startsWith('1');
      appLog.info(`TXT parsed: hash=${hash}, matches=${matches}`);
      return { 
        hashes: [hash], 
        matches: matches,
        files: [{ filename: tokens[0], hash: hash, match: matches }]
      };
    }
  } catch (error) {
    appLog.error(`Error reading COMPARISON_RESULTS.txt: ${error}`);
    verificationsLog.info(`--- ${appId} ${newWalletVersion} | Error reading COMPARISON_RESULTS.txt: ${architecture ? architecture : ''} ${type ? type : ''} ${JSON.stringify(error)}`);
  }
  return null;
}