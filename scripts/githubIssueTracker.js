const fs = require('fs');
const axios = require('axios');
const readline = require('readline');

// Define the folder paths to search for .md files
const folderPaths = ['./_android', './_iphone', './_bearer', './_hardware'];

// Regular expression pattern to match issue URLs
const issuePattern = /issue:\s+(https:\/\/github\.com\/[^/]+\/[^/]+\/issues\/(\d+))/g;

// List to store extracted project names, issue numbers, and file names
const issueInfo = [];

// Function to search for .md files and extract issue information
function extractIssueInfo(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const matches = content.matchAll(issuePattern);
    for (const match of matches) {
        const [issueUrl, issueNumber] = match;
        const [, projectOwner, projectName] = issueUrl.match(/github\.com\/([^/]+)\/([^/]+)\/issues/); // Extract project name
        issueInfo.push({ projectOwner, projectName, issueUrl, issueNumber: issueNumber.split('/').pop(), fileName: filePath });
    }
}

// Function to check if a GitHub issue is active and get its last update date
async function checkGitHubIssue(projectOwner, projectName, issueNumber) {
    const url = `https://api.github.com/repos/${projectOwner}/${projectName}/issues/${issueNumber}`;
    const headers = {
        Authorization: `token ${githubAccessToken}`,
    };

    try {
        const response = await axios.get(url, { headers });
        const issueData = response.data;
        const issueState = issueData.state || 'unknown';
        const lastUpdateDate = issueData.updated_at.split('T')[0]; // Extract and format last update date
        return { state: issueState, lastUpdateDate };
    } catch (error) {
        console.error(`Error checking issue ${issueNumber} in ${projectOwner}/${projectName}: ${error.message}`);
        return { state: 'error', lastUpdateDate: 'unknown' };
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

let githubAccessToken = '';

rl.question('Enter your GitHub Personal Access Token: ', (token) => {
    githubAccessToken = token;

    // Loop through each folder path and search for .md files
    folderPaths.forEach((folderPath) => {
        fs.readdirSync(folderPath).forEach((file) => {
            if (file.endsWith('.md')) {
                extractIssueInfo(`${folderPath}/${file}`);
            }
        });
    });

    // Prepare the output text
    let outputText = '';

    // Check the status of each GitHub issue and append to the output text
    (async () => {
        for (const { projectOwner, projectName, issueUrl, issueNumber, fileName } of issueInfo) {
            const { state, lastUpdateDate } = await checkGitHubIssue(projectOwner, projectName, issueNumber);
            const entryText = `
App/File name: ${fileName}
Issue URL: ${issueUrl}
Project Name: ${projectOwner}/${projectName}
Issue Number: ${issueNumber}
Status: ${state}
Date of Last Update: ${lastUpdateDate}
`;
            console.log(entryText); // Display in the terminal
            outputText += entryText; // Append to the output text
        }

        // Write the output text to the file
        fs.writeFileSync('githubIssueTracker.txt', outputText);

        rl.close();
    })();
});
