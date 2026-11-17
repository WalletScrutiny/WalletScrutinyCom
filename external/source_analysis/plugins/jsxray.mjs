// Test 5: js-x-ray warnings in JS/TS files; test files are skipped unless
// --include-test-files.
import fs from 'fs';
import path from 'path';
import { AstAnalyser } from '@nodesecure/js-x-ray';
import { SHOW_ONLY_FIRST_X_ALERTS } from '../config.mjs';
import { getJavaScriptFiles } from '../jsFiles.mjs';

const JS_TEST_DIR_NAMES = new Set([
  'test', 'tests', '__tests__', 'spec', 'specs', '__spec__', 'e2e', 'integration'
]);

/**
 * Returns true if the path looks like a JavaScript/TypeScript test file.
 */
function isJavaScriptTestFile(relativePath) {
  const normalized = relativePath.replace(/\\/g, '/');
  const parts = normalized.split('/');
  const base = parts[parts.length - 1];
  const lowerBase = base.toLowerCase();

  if (parts.slice(0, -1).some(part => JS_TEST_DIR_NAMES.has(part.toLowerCase()))) {
    return true;
  }

  if (/\.(test|spec|tests|e2e)\.(js|mjs|cjs|jsx|ts|tsx)$/.test(lowerBase)) {
    return true;
  }

  if (/[._-](test|spec)\.(js|mjs|cjs|jsx|ts|tsx)$/.test(lowerBase)) {
    return true;
  }

  if (/^test[._-].+\.(js|mjs|cjs|jsx|ts|tsx)$/.test(lowerBase)) {
    return true;
  }

  return false;
}

/**
 * Test 5: Analyze code vulnerabilities using js-x-ray
 * @param {string} repoPath
 * @param {{ includeTestFiles?: boolean }} [options] - includeTestFiles: also scan test files (default false)
 */
export async function analyzeCodeVulnerabilitiesJSXRay(repoPath, { includeTestFiles = false } = {}) {
  console.log('\n=== Code Vulnerability Analysis (js-x-ray) ===');
  
  try {
    const allJsFiles = getJavaScriptFiles(repoPath);
    const jsFiles = includeTestFiles
      ? allJsFiles
      : allJsFiles.filter(filePath => !isJavaScriptTestFile(path.relative(repoPath, filePath)));

    const excludedTestCount = allJsFiles.length - jsFiles.length;
    if (includeTestFiles) {
      console.log(`Scanning ${jsFiles.length} JavaScript/TypeScript files (including test files)...`);
    } else if (excludedTestCount > 0) {
      console.log(
        `Scanning ${jsFiles.length} JavaScript/TypeScript files (${excludedTestCount} test file(s) excluded; use --includeTestFiles to include them)...`
      );
    } else {
      console.log(`Scanning ${jsFiles.length} JavaScript/TypeScript files...`);
    }
    
    if (jsFiles.length === 0) {
      console.log('No JavaScript/TypeScript files found to analyze');
      return null;
    }
    
    const analyser = new AstAnalyser();
    const allWarnings = [];
    const allDependencies = new Set();
    const fileFindings = new Map();
    let filesAnalyzed = 0;
    let filesWithWarnings = 0;
    
    for (const filePath of jsFiles) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const relativePath = path.relative(repoPath, filePath);
        
        // Analyze the code with js-x-ray
        const analysis = analyser.analyse(content, { fileName: relativePath });
        
        filesAnalyzed++;
        
        // Collect dependencies (dependencies is a Map where keys are dependency names)
        if (analysis.dependencies && analysis.dependencies instanceof Map) {
          for (const depName of analysis.dependencies.keys()) {
            allDependencies.add(depName);
          }
        }
        
        // Collect warnings
        if (analysis.warnings && Array.isArray(analysis.warnings) && analysis.warnings.length > 0) {
          filesWithWarnings++;
          const fileWarnings = analysis.warnings.map(warning => ({
            kind: warning.kind || 'unknown',
            value: warning.value || '',
            severity: warning.severity || 'Unknown',
            location: warning.location || null,
            source: warning.source || 'unknown'
          }));
          
          allWarnings.push(...fileWarnings.map(w => ({ ...w, file: relativePath })));
          
          // Convert dependencies Map to array of names for storage
          const depNames = analysis.dependencies instanceof Map 
            ? Array.from(analysis.dependencies.keys())
            : [];
          
          fileFindings.set(relativePath, {
            warnings: fileWarnings,
            dependencies: depNames
          });
        }
      } catch (error) {
        // Skip files that can't be analyzed (e.g., syntax errors, binary files)
        if (error.code !== 'ENOENT') {
          // Silently skip files that can't be analyzed
        }
      }
    }
    
    // Report findings
    console.log(`\nAnalyzed ${filesAnalyzed} files`);
    console.log(`Found ${allDependencies.size} unique dependencies`);
    console.log(`Found ${allWarnings.length} warnings across ${filesWithWarnings} files`);
    
    if (allWarnings.length > 0) {
      // Group warnings by type
      const warningsByType = new Map();
      for (const warning of allWarnings) {
        const kind = warning.kind || 'unknown';
        if (!warningsByType.has(kind)) {
          warningsByType.set(kind, []);
        }
        warningsByType.get(kind).push(warning);
      }
      
      console.log('\nWarnings by type:');
      for (const [kind, warnings] of warningsByType.entries()) {
        console.log(`\n  ${kind} (${warnings.length} occurrences):`);
        
        for (const warning of warnings.slice(0, SHOW_ONLY_FIRST_X_ALERTS)) {
          let locationStr = '';
          if (warning.location) {
            if (Array.isArray(warning.location) && warning.location.length >= 1) {
              // Location format: [[line, column], [line, column]]
              const start = warning.location[0];
              if (Array.isArray(start) && start.length >= 2) {
                locationStr = `:${start[0]}:${start[1]}`;
              }
            } else if (warning.location.line) {
              locationStr = `:${warning.location.line}:${warning.location.column || '?'}`;
            }
          }
          const value = warning.value ? ` - ${warning.value}` : '';
          const severity = warning.severity ? ` [${warning.severity}]` : '';
          console.log(`    - ${warning.file}${locationStr}${value}${severity}`);
        }
        
        if (warnings.length > SHOW_ONLY_FIRST_X_ALERTS) {
          console.log(`    ... and ${warnings.length - SHOW_ONLY_FIRST_X_ALERTS} more`);
        }
      }
    } else {
      console.log('\nNo security warnings found in the analyzed files');
    }
    
    return {
      filesAnalyzed,
      filesWithWarnings,
      totalWarnings: allWarnings.length,
      uniqueDependencies: Array.from(allDependencies),
      warnings: allWarnings,
      fileFindings: Object.fromEntries(fileFindings)
    };
  } catch (error) {
    console.error('Error analyzing code vulnerabilities:', error.message);
    return null;
  }
}

export default {
  description: 'Test 5: js-x-ray',
  async container({ repoPath, options }) {
    await analyzeCodeVulnerabilitiesJSXRay(repoPath, { includeTestFiles: options.includeTestFiles });
  },
};
