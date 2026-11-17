// Test 2: number of direct dependencies.
import fs from 'fs';
import path from 'path';
import { APP_TYPES } from '../config.mjs';

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

export default {
  description: 'Test 2: number of direct dependencies',
  needsKnownAppType: true,
  async container({ repoPath, appType }) {
    await countDirectDependencies(repoPath, appType);
  },
};
