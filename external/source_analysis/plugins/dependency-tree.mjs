// Test 1: the full dependency tree, printed as a list.
import { execSync } from 'child_process';
import { APP_TYPES } from '../config.mjs';

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

export default {
  description: 'Test 1: full dependency tree',
  needsKnownAppType: true,
  async container({ repoPath, appType }) {
    await showDependencyTree(repoPath, appType);
  },
};
