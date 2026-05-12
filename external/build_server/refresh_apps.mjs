#!/usr/bin/env node

/**
 * Refresh apps function for build server
 * Runs refreshDesktop and refreshHardware scripts and returns apps with latest versions
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { appLog } from './logger.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Run a refresh script and capture its output
 * @param {string} scriptName - Name of the script to run (refreshDesktop or refreshHardware)
 * @param {string} githubToken - GitHub token for API requests
 * @returns {Promise<Object>} - Object containing apps and their latest versions
 */
async function runRefreshScript(scriptName, githubToken) {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, '..', '..', 'scripts', `${scriptName}.mjs`);
    const args = ['-r', '-n', '-g', githubToken]; // -r for report, -n for dry run, -g for github token
    
    appLog.info(`  * Running ${scriptName}...`);
    
    const child = spawn('node', [scriptPath, ...args], {
      stdio: ['pipe', 'pipe', 'pipe'],
      cwd: path.join(__dirname, '..', '..') // Set working directory to project root
    });
    
    let stdout = '';
    let stderr = '';
    
    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });
    
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${scriptName} exited with code ${code}: ${stderr}`));
        return;
      }
      
      try {
        // Parse the output to extract app information
        const apps = parseRefreshOutput(stdout);
        resolve(apps);
      } catch (parseError) {
        reject(new Error(`Failed to parse ${scriptName} output: ${parseError.message}`));
      }
    });
    
    child.on('error', (error) => {
      reject(new Error(`Failed to spawn ${scriptName}: ${error.message}`));
    });
  });
}

/**
 * Parse the output from refresh scripts to extract app information
 * @param {string} output - The stdout from the refresh script
 * @returns {Object} - Object containing apps and their latest versions
 */
function parseRefreshOutput(output) {
  const apps = {};
  const lines = output.split('\n');
  
  for (const line of lines) {
    // Look for lines that contain appId, current version, and latest version
    // Format: " appId: <appId>  Current: <currentVersion>  Latest: <latestVersion>"
    const match = line.match(/appId:\s+([^\s]+)\s+Current:\s+([^\s]+)\s+Latest:\s+(.+)/);
    if (match) {
      const [, appId, currentVersion, latestVersion] = match;
      apps[appId] = {
        latestVersion: latestVersion,
      };
    }
  }
  
  return apps;
}

/**
 * Run both refresh scripts and return combined results
 * @param {string} githubToken - GitHub token for API requests
 * @returns {Promise<Object>} - Object containing desktop and hardware apps
 */
export async function refreshApps(githubToken) {
  try {
    appLog.info('Refreshing desktop and hardware wallet versions...');
    
    // Run both scripts in parallel
    const [desktopApps, hardwareApps] = await Promise.all([
      runRefreshScript('refreshDesktop', githubToken),
      runRefreshScript('refreshHardware', githubToken)
    ]);
    
    const result = {
      desktop: desktopApps,
      hardware: hardwareApps,
      total: Object.keys(desktopApps).length + Object.keys(hardwareApps).length
    };
    
    appLog.info(`Refresh completed: ${Object.keys(desktopApps).length} desktop apps, ${Object.keys(hardwareApps).length} hardware apps`);
    
    return result;
    
  } catch (error) {
    appLog.error('Error refreshing apps:', error.message);
    throw error;
  }
}