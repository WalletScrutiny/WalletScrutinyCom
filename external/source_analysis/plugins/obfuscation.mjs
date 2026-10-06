// Test 8: obfuscated JS/TS files (obfuscation-detector).
import fs from 'fs';
import path from 'path';
import { detectObfuscation } from 'obfuscation-detector';
import { SHOW_ONLY_FIRST_X_ALERTS } from '../config.mjs';
import { getJavaScriptFiles } from '../jsFiles.mjs';

/**
 * Test 8: Analyze code for obfuscation using obfuscation-detector
 */
export async function analyzeObfuscation(repoPath) {
  console.log('\n=== Obfuscation Detection Analysis ===');
  
  try {
    const jsFiles = getJavaScriptFiles(repoPath);
    console.log(`Scanning ${jsFiles.length} JavaScript/TypeScript files for obfuscation...`);
    
    if (jsFiles.length === 0) {
      console.log('No JavaScript/TypeScript files found to analyze');
      return null;
    }
    
    const obfuscatedFiles = [];
    let filesAnalyzed = 0;
    let filesWithObfuscation = 0;
    
    for (const filePath of jsFiles) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        const relativePath = path.relative(repoPath, filePath);
        
        // Detect obfuscation in the code
        const obfuscationTypes = detectObfuscation(content, false);
        
        filesAnalyzed++;
        
        if (obfuscationTypes && obfuscationTypes.length > 0) {
          filesWithObfuscation++;
          obfuscatedFiles.push({
            file: relativePath,
            obfuscationTypes: obfuscationTypes
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
    
    if (obfuscatedFiles.length > 0) {
      console.log(`\nFound obfuscation in ${filesWithObfuscation} files:`);
      
      // Group by obfuscation type
      const obfuscationTypeMap = new Map();
      for (const file of obfuscatedFiles) {
        for (const type of file.obfuscationTypes) {
          if (!obfuscationTypeMap.has(type)) {
            obfuscationTypeMap.set(type, []);
          }
          obfuscationTypeMap.get(type).push(file.file);
        }
      }
      
      // Show files grouped by obfuscation type
      for (const [type, files] of obfuscationTypeMap.entries()) {
        console.log(`\n  ${type} (${files.length} file(s)):`);
        const uniqueFiles = [...new Set(files)];
        for (const file of uniqueFiles.slice(0, SHOW_ONLY_FIRST_X_ALERTS)) {
          console.log(`    - ${file}`);
        }
        if (uniqueFiles.length > SHOW_ONLY_FIRST_X_ALERTS) {
          console.log(`    ... and ${uniqueFiles.length - SHOW_ONLY_FIRST_X_ALERTS} more`);
        }
      }
      
      // Also show all files with their detected types
      console.log('\nDetailed file list:');
      for (const file of obfuscatedFiles.slice(0, SHOW_ONLY_FIRST_X_ALERTS)) {
        const typesStr = file.obfuscationTypes.join(', ');
        console.log(`  - ${file.file}: ${typesStr}`);
      }
      if (obfuscatedFiles.length > SHOW_ONLY_FIRST_X_ALERTS) {
        console.log(`  ... and ${obfuscatedFiles.length - SHOW_ONLY_FIRST_X_ALERTS} more files`);
      }
    } else {
      console.log('\nNo obfuscation detected in the analyzed files');
    }
    
    return {
      filesAnalyzed,
      filesWithObfuscation,
      obfuscatedFiles
    };
  } catch (error) {
    console.error('Error analyzing obfuscation:', error.message);
    return null;
  }
}

export default {
  description: 'Test 8: obfuscated JS/TS files',
  async container({ repoPath }) {
    await analyzeObfuscation(repoPath);
  },
};
