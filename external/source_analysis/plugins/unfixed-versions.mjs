// Test 3: dependencies declared without a fixed version (^, ~, *, latest, ranges).
import fs from 'fs';
import path from 'path';
import { APP_TYPES } from '../config.mjs';

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

export default {
  description: 'Test 3: dependencies without a fixed version',
  needsKnownAppType: true,
  async container({ repoPath, appType }) {
    await listDependenciesWithoutFixedVersions(repoPath, appType);
  },
};
