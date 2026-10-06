// Test 9: Semgrep CE (--config=auto) in its own container (SEMGREP_IMAGE),
// started by the host on the checkout the analysis container left behind.
import path from 'path';
import { execSync, exec } from 'child_process';
import { promisify } from 'util';
import { SEMGREP_IMAGE, CONTAINER_CLI } from '../config.mjs';

/**
 * Test 9: Analyze code vulnerabilities using Semgrep Community Edition
 */
export async function analyzeCodeVulnerabilitiesSemgrep(repoPath) {
  console.log('\n=== Semgrep Code Vulnerability Analysis ===');
  
  try {
    // Check if Docker is available
    try {
      execSync(`${CONTAINER_CLI} --version`, { stdio: 'pipe', timeout: 5000 });
    } catch (error) {
      console.log(`${CONTAINER_CLI} is not available. Skipping Semgrep analysis.`);
      return null;
    }
    
    // Check if Semgrep image exists, if not pull it
    try {
      await promisify(exec)(`${CONTAINER_CLI} image inspect ${SEMGREP_IMAGE} > /dev/null 2>&1`, { timeout: 30000 });
    } catch (error) {
      // console.log('Pulling Semgrep Docker image (this may take a moment)...');
      try {
        await promisify(exec)(`${CONTAINER_CLI} pull ${SEMGREP_IMAGE}`, {
          timeout: 300000 // 5 minutes for pulling image
        });
      } catch (pullError) {
        console.log('Failed to pull Semgrep Docker image:', pullError.message);
        return null;
      }
    }
    
    // Convert repoPath to absolute path for Docker volume mounting
    const absoluteRepoPath = path.resolve(repoPath);
    
    // Run Semgrep with Docker
    // Using --config=auto to use Semgrep's automatic rule selection
    // Using --json for structured output
    // Using --error to exit with non-zero on findings (but we catch this)
    let semgrepOutput;
    try {
      // Async: with several repositories in flight, a blocking call would
      // freeze the other jobs (their output and timeouts) for the whole scan.
      ({ stdout: semgrepOutput } = await promisify(exec)(
        `${CONTAINER_CLI} run --rm -v "${absoluteRepoPath}:/src" ${SEMGREP_IMAGE} semgrep --config=auto --json /src`,
        {
          cwd: repoPath,
          encoding: 'utf8',
          timeout: 300000, // 5 minutes timeout
          maxBuffer: 50 * 1024 * 1024 // 50MB buffer to handle large Semgrep JSON outputs
        }
      ));
    } catch (error) {
      // Semgrep exits with non-zero when findings are detected, but still outputs JSON
      if (error.stdout) {
        semgrepOutput = error.stdout;
      } else {
        console.log('Semgrep analysis failed:', error.message);
        if (error.stderr) {
          console.log('Error details:', error.stderr.toString());
        }
        return null;
      }
    }
    
    if (!semgrepOutput || !semgrepOutput.trim()) {
      console.log('No output from Semgrep analysis');
      return null;
    }
    
    // Parse JSON output
    let semgrepResults;
    try {
      // Check if output might be truncated (if it's exactly at a buffer boundary)
      const outputLength = semgrepOutput.length;
      if (outputLength > 0 && !semgrepOutput.trim().endsWith('}') && !semgrepOutput.trim().endsWith(']')) {
        console.log(`Warning: Semgrep output might be truncated (length: ${outputLength} bytes)`);
      }
      
      semgrepResults = JSON.parse(semgrepOutput);
    } catch (parseError) {
      console.log('Failed to parse Semgrep JSON output:', parseError.message);
      console.log('Raw output (first 500 chars):', semgrepOutput.substring(0, 500));
      return null;
    }
    
    // Process results
    const results = semgrepResults.results || [];
    const errors = semgrepResults.errors || [];
    const paths = semgrepResults.paths || {};
    
    console.log(`\nScanned ${paths.scanned.length || 0} files`);
    
    /*
    if (errors.length > 0) {
      console.log(`\nEncountered ${errors.length} errors during scanning:`);
      for (const error of errors.slice(0, 5)) {
        console.log(`  - ${error.message || JSON.stringify(error)}`);
      }
      if (errors.length > 5) {
        console.log(`  ... and ${errors.length - 5} more errors`);
      }
    }
    */

    if (results.length === 0) {
      console.log('\nNo security issues found by Semgrep');
      return {
        filesScanned: paths.scanned || 0,
        findings: 0,
        results: [],
        errors: errors
      };
    }
    
    // Group findings by severity and rule
    const findingsBySeverity = new Map();
    const findingsByRule = new Map();
    
    for (const result of results) {
      const severity = result.extra?.severity || 'INFO';
      const ruleId = result.check_id || 'unknown';
      const ruleMessage = result.message || 'No message';
      
      // Group by severity
      if (!findingsBySeverity.has(severity)) {
        findingsBySeverity.set(severity, []);
      }
      findingsBySeverity.get(severity).push(result);
      
      // Group by rule
      if (!findingsByRule.has(ruleId)) {
        findingsByRule.set(ruleId, {
          count: 0,
          message: ruleMessage,
          severity: severity,
          results: []
        });
      }
      findingsByRule.get(ruleId).count++;
      findingsByRule.get(ruleId).results.push(result);
    }
    
    // Display summary
    console.log(`\nFound ${results.length} security findings:`);
    
    // Show by severity
    const severityOrder = ['INFO', 'WARNING', 'ERROR'];
    for (const severity of severityOrder) {
      //if (findingsBySeverity.has(severity)) {
        const count = findingsBySeverity.get(severity)?.length || 0;
        console.log(`  ${severity}: ${count}`);
      //}
    }
    /*
    // Show findings by rule (top 20)
    console.log('\nFindings by rule (top 20):');
    const sortedRules = Array.from(findingsByRule.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 20);
    
    for (const [ruleId, ruleInfo] of sortedRules) {
      console.log(`\n  ${ruleId} [${ruleInfo.severity}] (${ruleInfo.count} occurrence(s)):`);
      console.log(`    ${ruleInfo.message}`);
      
      // Show first 3 file locations
      for (const result of ruleInfo.results.slice(0, 3)) {
        const filePath = result.path || 'unknown';
        const startLine = result.start?.line || '?';
        const startCol = result.start?.col || '?';
        console.log(`      - ${filePath}:${startLine}:${startCol}`);
      }
      if (ruleInfo.results.length > 3) {
        console.log(`      ... and ${ruleInfo.results.length - 3} more`);
      }
    }
    
    if (sortedRules.length < findingsByRule.size) {
      console.log(`\n  ... and ${findingsByRule.size - sortedRules.length} more rules`);
    }
    */

    // Show critical/high severity findings in detail
    const criticalFindings = results.filter(r => {
      const severity = r.extra?.severity || 'INFO';
      return severity === 'ERROR';
    });
    
    if (criticalFindings.length > 0) {
      console.log(`\nError/Warning severity findings (${criticalFindings.length}):`);
      for (const finding of criticalFindings) {
        const filePath = finding.path || 'unknown';
        const startLine = finding.start?.line || '?';
        const startCol = finding.start?.col || '?';
        const endLine = finding.end?.line || startLine;
        const severity = finding.extra?.severity || 'INFO';
        const message = finding.message || 'No message';
        const ruleId = finding.check_id || 'unknown';
        
        console.log(`\n  [${severity}] - ${filePath}:${startLine}:${startCol} - Rule: ${ruleId}`);
      }
    }
    
    return {
      filesScanned: paths.scanned || 0,
      findings: results.length,
      results: results,
      errors: errors,
      findingsBySeverity: Object.fromEntries(
        Array.from(findingsBySeverity.entries()).map(([k, v]) => [k, v.length])
      ),
      findingsByRule: Object.fromEntries(
        Array.from(findingsByRule.entries()).map(([k, v]) => [k, { count: v.count, message: v.message, severity: v.severity }])
      )
    };
  } catch (error) {
    console.error('Error running Semgrep analysis:', error.message);
    if (error.stderr) {
      console.error('Error details:', error.stderr.toString());
    }
    return null;
  }
}

export default {
  description: 'Test 9: Semgrep',
  needsKnownAppType: true,
  async host({ repoPath }) {
    await analyzeCodeVulnerabilitiesSemgrep(repoPath);
  },
};
