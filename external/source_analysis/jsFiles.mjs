// The JS/TS files of a checkout, shared by the jsxray and obfuscation plugins.
import fs from 'fs';
import path from 'path';

/**
 * Get all JavaScript and TypeScript files in a directory
 */
export function getJavaScriptFiles(dirPath, fileList = []) {
  const files = fs.readdirSync(dirPath);
  
  const ignoreDirs = [
    'node_modules', '.git', '.svn', '.hg', 'dist', 'build', 
    'target', '.gradle', '.idea', '.vscode', '__pycache__',
    '.pytest_cache', 'venv', 'env', '.env', 'vendor', 'bin',
    'obj', '.vs', 'DerivedData', 'Pods', '.cocoapods'
  ];
  
  const jsExtensions = ['.js', '.mjs', '.cjs', '.jsx', '.ts', '.tsx'];
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      const dirName = path.basename(filePath);
      if (!ignoreDirs.includes(dirName) && !dirName.startsWith('.')) {
        getJavaScriptFiles(filePath, fileList);
      }
    } else if (stat.isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      if (jsExtensions.includes(ext)) {
        fileList.push(filePath);
      }
    }
  }
  
  return fileList;
}
