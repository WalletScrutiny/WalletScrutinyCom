// Installs the repository's dependencies (npm/yarn install, pip install -r
// requirements.txt; gradle and maven fetch theirs when tests 1-5 run them).
// Tests 1-3 and 5 need it. A failed install is logged and does not fail the
// analysis.
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { APP_TYPES } from '../config.mjs';

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

export default {
  description: 'Install the dependencies (npm/yarn, pip)',
  needsKnownAppType: true,
  async container({ repoPath, appType }) {
    await installDependencies(repoPath, appType);
  },
};
