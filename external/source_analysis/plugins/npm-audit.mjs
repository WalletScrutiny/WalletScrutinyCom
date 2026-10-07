// The old test 10: npm audit / yarn audit. Replaced by the osv plugin, which
// covers gradle, pip and cargo too.
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { APP_TYPES } from '../config.mjs';

function parseNpmAuditJson(auditResult) {
  const audit = JSON.parse(auditResult);
  return {
    summaryVulnerabilities: audit.metadata.vulnerabilities,
    vulnerabilities: Object.values(audit.vulnerabilities || {}).map((v) => ({
      name: v.name,
      severity: v.severity,
      fixAvailable: Boolean(v.fixAvailable),
    })),
  };
}

/**
 * Yarn Classic audit --json emits one JSON object per line (NDJSON).
 */
function parseYarnAuditJson(auditResult) {
  const advisories = [];
  let summaryVulnerabilities = null;

  for (const line of auditResult.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    let event;
    try {
      event = JSON.parse(trimmed);
    } catch {
      continue;
    }

    if (event.type === 'auditSummary' && event.data?.vulnerabilities) {
      summaryVulnerabilities = event.data.vulnerabilities;
    } else if (event.type === 'auditAdvisory' && event.data?.advisory) {
      const advisory = event.data.advisory;
      advisories.push({
        name: advisory.module_name,
        severity: advisory.severity,
        fixAvailable: Boolean(advisory.patched_versions),
      });
    }
  }

  if (!summaryVulnerabilities) {
    throw new Error('yarn audit output missing auditSummary');
  }

  return { summaryVulnerabilities, vulnerabilities: advisories };
}

const SEVERITY_RANK = { critical: 4, high: 3, moderate: 2, low: 1, info: 0 };

function dedupeVulnerabilities(vulnerabilities) {
  const byName = new Map();

  for (const v of vulnerabilities) {
    const existing = byName.get(v.name);
    if (!existing) {
      byName.set(v.name, { ...v, count: 1 });
      continue;
    }
    existing.count += 1;
    if ((SEVERITY_RANK[v.severity] ?? 0) > (SEVERITY_RANK[existing.severity] ?? 0)) {
      existing.severity = v.severity;
    }
    existing.fixAvailable = existing.fixAvailable || v.fixAvailable;
  }

  return [...byName.values()];
}

/**
 * Old test 10: Execute vulnerability scan
 */
export async function scanVulnerabilities(repoPath, appType) {
  console.log('\n=== Vulnerability Scan ===');
  
  try {
    switch (appType) {
      case APP_TYPES.NPM:
        try {
          const yarnLockPath = path.join(repoPath, 'yarn.lock');
          const useYarn = fs.existsSync(yarnLockPath);
          const auditCommand = useYarn ? 'yarn audit --json' : 'npm audit --json';

          console.log(`Running ${auditCommand}...`);
          let auditResult;
          try {
            auditResult = execSync(auditCommand, {
              cwd: repoPath,
              encoding: 'utf8',
              timeout: 60000
            });
          } catch (error) {
            // npm/yarn audit exits with non-zero when vulnerabilities are found,
            // but still outputs valid JSON to stdout
            auditResult = error.stdout || error.message || '';
          }

          const { summaryVulnerabilities, vulnerabilities } = useYarn
            ? parseYarnAuditJson(auditResult)
            : parseNpmAuditJson(auditResult);

          console.log('  ' + JSON.stringify(summaryVulnerabilities));

          if (summaryVulnerabilities.critical > 0 || summaryVulnerabilities.high > 0) {
            console.log('Critical and high vulnerabilities found:');

            for (const vulnerability of dedupeVulnerabilities(vulnerabilities)) {
              if (vulnerability.severity === 'critical' || vulnerability.severity === 'high') {
                const advisoryCount = vulnerability.count > 1 ? `, ${vulnerability.count} advisories` : '';
                console.log(`  ** ${vulnerability.name} (${vulnerability.severity}${advisoryCount}) - Fix available: ${vulnerability.fixAvailable ? 'Yes' : 'No'}`);
              }
            }
          } else {
            console.log('No critical or high vulnerabilities found');
          }

        } catch (error) {
          console.log('error: ' + error);
          console.log('Could not parse audit output:', error.message);
        }
        break;
        
      case APP_TYPES.GRADLE:
        try {
          console.log('Running OWASP Dependency Check (if available)...');
          execSync('./gradlew dependencyCheckAnalyze', {
            cwd: repoPath,
            encoding: 'utf8',
            timeout: 120000
          });
        } catch (error) {
          console.log('OWASP Dependency Check not configured. Install plugin: https://plugins.gradle.org/plugin/org.owasp.dependencycheck');
        }
        break;
        
      case APP_TYPES.MAVEN:
        try {
          console.log('Running OWASP Dependency Check (if available)...');
          execSync('mvn org.owasp:dependency-check-maven:check', {
            cwd: repoPath,
            encoding: 'utf8',
            timeout: 120000
          });
        } catch (error) {
          console.log('OWASP Dependency Check not configured. Install plugin: https://mvnrepository.com/artifact/org.owasp/dependency-check-maven');
        }
        break;
        
      case APP_TYPES.PIP:
        try {
          console.log('Running safety check (if available)...');
          execSync('safety check --json', {
            cwd: repoPath,
            encoding: 'utf8',
            timeout: 60000
          });
        } catch (error) {
          console.log('Safety not installed. Install with: pip install safety');
          console.log('Or use: pip-audit (pip install pip-audit)');
        }
        break;
        
      default:
        console.log('Unknown app type, cannot scan vulnerabilities');
    }
  } catch (error) {
    console.error('Error scanning vulnerabilities:', error.message);
  }
}

export default {
  description: 'Old test 10: npm/yarn audit',
  needsKnownAppType: true,
  async container({ repoPath, appType }) {
    await scanVulnerabilities(repoPath, appType);
  },
};
