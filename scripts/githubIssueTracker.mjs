/**
 * This script lists all open issues of products that are "meta: ok" and had no
 * update in more than three months. Issues are sorted oldest to newest.
 * This script can be started with
 * $ node scripts/githubIssueTracker.mjs $GITHUB_API_KEY
 **/

import fs from 'fs';
import axios from 'axios';
import path from 'path';

const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';
const CYAN = '\x1b[36m';

// Define the folder paths to search for .md files
const folderPaths = ['./_android', './_iphone', './_bearer', './_hardware', './_desktop'];

// Regular expression pattern to match issue URLs and verdicts
const issuePattern = /issue:\s+(https:\/\/github\.com\/[^/]+\/[^/]+\/issues\/(\d+))/g;
const verdictPattern = /verdict:\s+(.+)/;
const metaOkPattern = /meta: ok/;

// List to store extracted project names, issue numbers, and file names, and verdicts
const issueInfo = [];

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

// Function to check if a GitHub issue is active and get its last update date and last poster's username
async function checkGitHubIssue(projectOwner, projectName, issueNumber, githubAccessToken) {
  const url = `https://api.github.com/repos/${projectOwner}/${projectName}/issues/${issueNumber}`;
  const headers = {
    Authorization: `token ${githubAccessToken}`,
  };

  try {
    const response = await axios.get(url, { headers });
    const issueData = response.data;
    const issueState = issueData.state || 'unknown';
    const lastUpdateDate = issueData.updated_at.split('T')[0]; // Extract and format last update date
    const lastPosterUsername = issueData.user.login; // Get the username of the issue poster

    // Get latest comment (if any)
    let latestCommentUser = lastPosterUsername; // Default to the issue poster
    if (issueData.comments > 0) {
      const commentsResponse = await axios.get(issueData.comments_url, { headers });
      const comments = commentsResponse.data;
      latestCommentUser = comments[comments.length - 1].user.login; // Get the last comment's username
    }

    return { state: issueState, lastUpdateDate, lastPosterUsername: latestCommentUser };
  } catch (error) {
    console.error(`Error checking https://github.com/${projectOwner}/${projectName}/issues/${issueNumber} : ${error.message}`);
    return { state: 'error', lastUpdateDate: 'unknown', lastPosterUsername: 'unknown' };
  }
}

// Prepare the output
let output = [];

// Check the status of each GitHub issue and append to the output text
(async () => {
  const githubAccessToken = process.argv[2];
  if (githubAccessToken === undefined) {
    console.error('Provide your GitHub Personal Access Token (https://github.com/settings/tokens) as parameter!');
    process.exit(1);
  }

  // Loop through each folder path and search for .md files
  folderPaths.forEach((folderPath) => {
    fs.readdirSync(folderPath).forEach((file) => {
      if (file.endsWith('.md')) {
        extractIssueInfo(`${folderPath}/${file}`);
      }
    });
  });
  
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  for (const { projectOwner, projectName, issueUrl, issueNumber, fileName, folder, verdict } of issueInfo) {
    const { state, lastUpdateDate, lastPosterUsername } = await checkGitHubIssue(projectOwner, projectName, issueNumber, githubAccessToken);
    if (new Date(lastUpdateDate) < threeMonthsAgo) {
      output.push({
        update: new Date(lastUpdateDate),
        filename: fileName,
        issue: issueUrl,
        state: state,
        verdict: verdict,
        folder: folder,
        lastPosterUsername: lastPosterUsername // Store the username of the last poster
      });
    }
  }

  // Sort output by folder, then by update time (newest to oldest)
  output.sort((a, b) => {
    if (a.folder === b.folder) {
      return b.update - a.update; // Sort by update date within the same folder (newest to oldest)
    }
    return a.folder.localeCompare(b.folder); // Sort by folder name
  });

  // Group and display the results by folder
  let currentFolder = '';
  output.forEach((o) => {
    if (o.folder !== currentFolder) {
      currentFolder = o.folder;
      console.log(`\n${GREEN}${currentFolder}${RESET}`); // Print folder name in green
    }
    const daysSince = Math.floor((new Date() - o.update) / 1000 / 60 / 60 / 24);
    const shortenedFileName = path.basename(o.filename);
    console.log(`  - ${daysSince} days ago: | ${GREEN}${shortenedFileName}${RESET} | ${o.issue} | ${CYAN}Last Verdict: ${o.verdict}${RESET} | ${o.state} | Last post: ${o.lastPosterUsername}`);
  });
})();
