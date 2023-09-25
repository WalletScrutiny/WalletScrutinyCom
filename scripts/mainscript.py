import os
import re
import requests
from retrying import retry

# Define the folder path to search for .md files
folder_path = "../_android"


# Regular expression pattern to match issue URLs
issue_pattern = r'issue:\s+(https://github\.com/[^/]+/[^/]+/issues/(\d+))'

# List to store extracted project names and issue numbers
issue_info = []

# Function to search for .md files and extract issue information
def extract_issue_info(file_path):
    with open(file_path, "r", encoding="utf-8") as file:
        content = file.read()
        matches = re.findall(issue_pattern, content)
        for match in matches:
            issue_url, issue_number = match
            project_name = issue_url.split("/")[3:5]  # Extract project name
            issue_info.append((project_name, issue_number))

# Iterate through files in the folder and extract issue information
for root, dirs, files in os.walk(folder_path):
    for file in files:
        if file.endswith(".md"):
            file_path = os.path.join(root, file)
            extract_issue_info(file_path)

# GitHub API endpoint
github_api_url = "https://api.github.com/repos"

# Your GitHub username and access token
github_username = "xrviv"
github_access_token = "" ## Manually paste your personal access token for Github here.

# Function to check if a GitHub issue is active
@retry(stop_max_attempt_number=3, wait_fixed=2000)
def check_github_issue(project_name, issue_number):
    repo = '/'.join(project_name)
    url = f"{github_api_url}/{repo}/issues/{issue_number}"
    headers = {"Authorization": f"token {github_access_token}"}
    response = requests.get(url, headers=headers)
    
    # print(f"URL: {url}")
    # Debug Code
    # print(f"Status Code: {response.status_code}")
    # print(f"API Response: {response.text}")

    issue_data = response.json() if response.status_code == 200 else {}

    # Extract the "state" field from the issue data
    issue_state = issue_data.get("state", "unknown")

    return issue_state


# Check the status of each GitHub issue
for project_name, issue_number in issue_info:
    status = check_github_issue(project_name, issue_number)
    print(f"Project Name: {'/'.join(project_name)}")
    print(f"Issue Number: {issue_number}")
    print(f"Status: {status}")
    print()
    