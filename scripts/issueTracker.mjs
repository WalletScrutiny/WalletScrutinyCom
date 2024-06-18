import fs from 'fs';
import path from 'path';
import axios from 'axios';
import yaml from 'js-yaml';
import chalk from 'chalk';
import helper from './helper.mjs';

const TIME_THRESHOLD_DAYS = 180;
const BASE_DIR = '.';
const DIRECTORIES = ["_android", "_iphone", "_hardware", "_bearer", "_desktop"];
const RETRY_COUNT = 3;
const RATE_LIMIT_SLEEP = 60000; 

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
    throw new Error("GitHub token not found. Please set the GITHUB_TOKEN environment variable.");
}

function getHeaders() {
    return {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
    };
}

async function fetchUrl(url, headers, retryCount = RETRY_COUNT) {
    for (let attempt = 0; attempt < retryCount; attempt++) {
        try {
            const response = await axios.get(url, { headers });
            return response.data;
        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.warn(chalk.yellow(`Rate limit exceeded. Waiting for ${RATE_LIMIT_SLEEP / 1000} seconds.`));
                await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_SLEEP));
            } else {
                throw error;
            }
        }
    }
    return null;
}

async function fetchIssueDetails(issueUrl, appId) {
    try {
        const parts = issueUrl.split('/');
        let issueApiUrl, commentsApiUrl, headers = {};

        if (issueUrl.includes("github.com")) {
            const [owner, repo, issueNumber] = [parts[3], parts[4], parts[6]];
            issueApiUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`;
            commentsApiUrl = `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}/comments`;
            headers = getHeaders();
        } else if (issueUrl.includes("gitlab.com")) {
            const [owner, repo, issueNumber] = [parts[3], parts[4], parts[parts.length - 1]];
            const projectId = encodeURIComponent(`${owner}/${repo}`);
            issueApiUrl = `https://gitlab.com/api/v4/projects/${projectId}/issues/${issueNumber}`;
            commentsApiUrl = `https://gitlab.com/api/v4/projects/${projectId}/issues/${issueNumber}/notes`;
        } else {
            console.warn(chalk.yellow(`Skipping unsupported provider URL: ${issueUrl}`));
            return null;
        }

        const issueDetails = await fetchUrl(issueApiUrl, headers);
        if (!issueDetails) return null;

        const comments = await fetchUrl(commentsApiUrl, headers);
        if (!comments) return null;

        const lastCommentDate = comments.length ? comments[comments.length - 1].updated_at : issueDetails.created_at;

        return {
            app_id: appId,
            issue_title: issueDetails.title || 'N/A',
            issue_url: issueUrl,
            date_issue_created: issueDetails.created_at,
            date_last_comment: lastCommentDate
        };
    } catch (error) {
        console.error(chalk.red(`Unexpected error for URL: ${issueUrl} for App ID: ${appId}. Error: ${error.message}`));
        return null;
    }
}

function getIssuesFromMarkdown() {
    const issues = [];
    const seenUrls = new Set();

    for (const directory of DIRECTORIES) {
        const dirPath = path.join(BASE_DIR, directory);
        for (const filename of fs.readdirSync(dirPath)) {
            const filepath = path.join(dirPath, filename);
            const content = fs.readFileSync(filepath, 'utf-8');
            const frontMatter = yaml.load(content.split('---')[1]);
            if (frontMatter.issue) {
                const issueUrl = frontMatter.issue;
                const appId = frontMatter.appId || filename;
                if (!seenUrls.has(issueUrl)) {
                    issues.push({ app_id: appId, issue_url: issueUrl });
                    seenUrls.add(issueUrl);
                }
            }
        }
    }
    return issues;
}

async function filterAndSortIssues(issues) {
    const filteredIssues = [];
    const thresholdDate = new Date(Date.now() - TIME_THRESHOLD_DAYS * 24 * 60 * 60 * 1000);

    for (const issue of issues) {
        const issueDetails = await fetchIssueDetails(issue.issue_url, issue.app_id);
        if (issueDetails) {
            const lastCommentDate = new Date(issueDetails.date_last_comment);
            if (lastCommentDate < thresholdDate) {
                filteredIssues.push(issueDetails);
            }
        }
    }

    filteredIssues.sort((a, b) => new Date(a.date_last_comment) - new Date(b.date_last_comment));
    return filteredIssues;
}

function outputResults(issues) {
    console.log(`Issue      | Comment    | App                            | ${'Issue'.padEnd(50)}`);
    console.log('-----------|------------|--------------------------------|----------------------');
    for (const issue of issues) {
        console.log(`${helper.dateOrEmpty(issue.date_issue_created)} | ${helper.dateOrEmpty(issue.date_last_comment)} | ${issue.app_id.padEnd(30)} | [${issue.issue_title}](${chalk.cyan(issue.issue_url)})`);
    }
}

(async function() {
    const issues = getIssuesFromMarkdown();
    const sortedIssues = await filterAndSortIssues(issues);
    outputResults(sortedIssues);
})();
