/**
 *   Script that lists issues of products that are "meta: ok" and had no update in more than a configurable number of months. Issues are sorted oldest to newest.
 *   You need to provide a Github Access Token to use this utility. Get one here: https://github.com/settings/tokens
 * 
 *   Execute without parameters to see usage.
 */
import fs from 'fs';
import { GitHub } from 'github-graphql-api';
import path from 'path';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2), {
  default: {
    githubtoken: process.env.githubtoken,
    months: 0,
    show_closed: false,
    format: 'human',
    show_only_not_subscribed: false
  }
});

const githubAccessToken = args.githubtoken;
const months = args.months;

if (!githubAccessToken) {
  print_usage();
  process.exit(1);
}

const outputFormat = args.format;

const github = new GitHub({ token: githubAccessToken });

const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';

// Define the folder paths to search for .md files
const folderPaths = ['./_android', './_iphone', './_bearer', './_hardware', './_desktop'];

let issues = {}; // Issues grouped by folder
folderPaths.forEach(folder => {
  issues[folder] = [];
});

// List to store extracted project names, issue numbers, and file names, and verdicts
const issueInfo = [];

// Regular expression pattern to match issue URLs and verdicts
const issuePattern = /issue:\s+(https:\/\/github\.com\/[^/]+\/[^/]+\/issues\/(\d+))/g;
const verdictPattern = /verdict:\s+(.+)/;
const metaOkPattern = /meta: ok/;

function print_usage() {
  console.log(`
    Usage:
      githubtoken="github_pat_abcdefg" node scripts/githubIssueTracker.mjs
      -or-
      node scripts/githubIssueTracker.mjs -githubtoken github_pat_abcdefg

    Optional parameters:
      --months x - set the number of months since the issue had an update (default is 0)
      --show_closed - also show closed issues (default is don't show closed issues)
      --format (human|table|csv) - change the format of the output (default is human)
      --show_only_not_subscribed - to show only issues where you're not subscribed to the issue (default is show all the issues)

    Example:
      node scripts/githubIssueTracker.mjs -githubtoken github_pat_abcdefg --months 2 --format csv
  `);
}

// Function to search for .md files and extract issue information
function extractIssueInfo(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  if (!metaOkPattern.test(content)) {
    return;
  }
  const matches = content.matchAll(issuePattern);
  const verdictMatch = content.match(verdictPattern);
  const verdict = verdictMatch ? verdictMatch[1].trim() : 'unknown';
  for (const match of matches) {
    const [issueUrl, issueNumber] = match;
    const [, projectOwner, projectName] = issueUrl.match(/github\.com\/([^/]+)\/([^/]+)\/issues/); // Extract project name
    issueInfo.push({
      projectOwner,
      projectName,
      issueUrl: issueUrl.replace('issue: ', ''),
      issueNumber: issueNumber.split('/').pop(),
      fileName: path.resolve(filePath),
      folder: path.basename(path.dirname(filePath)), // Store folder name
      verdict
    });
  }
}

async function checkGitHubIssue(projectOwner, projectName, issueNumber, fileName) {
  try {
    let result = await github.query(`
      query {
        repository (owner: "${projectOwner}", name: "${projectName}") {
          name
          issue (number: ${issueNumber}) {
            number
            state
            updatedAt
            author {
              login
            }
            viewerSubscription,
            comments (orderBy: {field: UPDATED_AT, direction: DESC}, first: 1) {
              nodes {
                author {
                  login
                }
              }
            }
          }
        }
      }
    `);

    const issue = result?.repository?.issue;
    const comment = issue?.comments?.nodes[0];

    if (!issue) {
      console.error(
        `There was a problem trying to get the issue information for issue:\nhttps://github.com/${projectOwner}/${projectName}/issues/${issueNumber}\nReferenced in file: ${fileName}\nSkipping...`
      );      
      return {
        state: 'error',
        lastUpdateDate: 'unknown',
        lastPosterUsername: 'unknown'
      };
    }

    const issueState = issue.state || 'unknown';
    const viewerSubscription = issue.viewerSubscription || 'unknown';
    const lastUpdateDate = issue.updatedAt.split('T')[0]; // Extract and format last update date
    const latestCommentUser = comment ? comment.author.login : issue.author.login;

    if (!args.show_only_not_subscribed || (args.show_only_not_subscribed && viewerSubscription === 'UNSUBSCRIBED')) {
      return { state: issueState.toLowerCase(), lastUpdateDate, lastPosterUsername: latestCommentUser };
    }

    return { state: 'error', lastUpdateDate: 'unknown', lastPosterUsername: 'unknown' };

  } catch (error) {
    let errorMessage = `\nError checking issue https://github.com/${projectOwner}/${projectName}/issues/${issueNumber} \n\n`;

    if (error === 'Unauthorized') {
      errorMessage += "Authentication failed. Please check your GitHub Personal Access Token.";
      console.error(errorMessage);

      print_usage();
      process.exit(1);
    } else {
      errorMessage += `An error occurred: ${error}`;
    }

    console.error(errorMessage);

    return { state: 'error', lastUpdateDate: 'unknown', lastPosterUsername: 'unknown' };
  }
}

// Check the status of each GitHub issue and append to the output text
(async () => {
  if (outputFormat === 'human') { 
    console.log('Reading issues from .md files...');
  }

  // Loop through each folder path and search for .md files
  folderPaths.forEach((folderPath) => {
    fs.readdirSync(folderPath).forEach((file) => {
      if (file.endsWith('.md')) {
        extractIssueInfo(`${folderPath}/${file}`);
      }
    });
  });

  const xMonthsAgo = new Date();
  xMonthsAgo.setMonth(xMonthsAgo.getMonth() - months);

  if (outputFormat === 'human') {
    console.log('Checking GitHub issues. It will take a while...');
  }

  for (const { projectOwner, projectName, issueUrl, issueNumber, fileName, folder, verdict } of issueInfo) {
    const { state, lastUpdateDate, lastPosterUsername } = await checkGitHubIssue(projectOwner, projectName, issueNumber, fileName);

    if (args.show_closed || state === 'open') {
      issues[`./${folder}`].push({
        update: new Date(lastUpdateDate),
        filename: fileName,
        issue: issueUrl,
        state,
        verdict,
        folder,
        lastPosterUsername,
        olderThanSpecifiedMonths: new Date(lastUpdateDate) < xMonthsAgo
      });
    }
  }

  switch (outputFormat) {
    case 'human':
      console.log(`\nShowing issues older than ${months} months old:`);

      folderPaths.forEach(folder => {
        if (issues[folder].length > 0) {
          console.log(`\n${GREEN}${folder}${RESET}`);
          issues[folder].sort((a, b) => b.update - a.update); // Sort by update date (newest to oldest)
          issues[folder].forEach((o) => {
            if (o.olderThanSpecifiedMonths) {
              const daysSince = Math.floor((new Date() - o.update) / 1000 / 60 / 60 / 24);
              const shortenedFileName = path.basename(o.filename);
              console.log(`  - ${daysSince} days ago | ${GREEN}${shortenedFileName}${RESET} | ${o.issue} | ${CYAN}Last Verdict: ${o.verdict}${RESET} | ${o.state} | ${YELLOW}Last post: ${o.lastPosterUsername}${RESET}`);
            }
          });
        }
      });
      break;

    case 'table':
      console.log(`Folder     | Days |          File           |              Issue URL              | Last Verdict | Status | Last post author`);
      console.log('-----------|------|-------------------------|-------------------------------------|--------------|--------|-----------------');
      
      folderPaths.forEach(folder => {
        if (issues[folder].length > 0) {
          issues[folder].sort((a, b) => b.update - a.update); // Sort by update date (newest to oldest)
          issues[folder].forEach((o) => {
            if (o.olderThanSpecifiedMonths) {
              const daysSince = Math.floor((new Date() - o.update) / 1000 / 60 / 60 / 24);
              const shortenedFileName = path.basename(o.filename);
              console.log(`${folder} | ${daysSince} | ${shortenedFileName} | ${o.issue} | ${o.verdict} | ${o.state} | ${o.lastPosterUsername}`);
            }
          });
        }
      });
      break;

    case 'csv':
      folderPaths.forEach(folder => {
        if (issues[folder].length > 0) {
          issues[folder].sort((a, b) => b.update - a.update); // Sort by update date (newest to oldest)
          issues[folder].forEach((o) => {
            if (o.olderThanSpecifiedMonths) {
              const daysSince = Math.floor((new Date() - o.update) / 1000 / 60 / 60 / 24);
              const shortenedFileName = path.basename(o.filename);
              console.log(`${folder}, ${daysSince}, ${shortenedFileName}, ${o.issue}, ${o.verdict}, ${o.state}, ${o.lastPosterUsername}`);
            }
          });
        }
      });
      break;
  }

})();
