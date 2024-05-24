# This is python 3 script.
# pip install requests pyyaml termcolor
# Checks files for existing issues, checks github for latest comment
# Make sure to run `export GITHUB_TOKEN=your_token_here` prior to running the script

import requests
import yaml
import os
import time
from datetime import datetime, timedelta
from termcolor import colored

# Constants
TIME_THRESHOLD_DAYS = 180
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
DIRECTORIES = ["_android", "_iphone", "_hardware", "_bearer", "_desktop"]
RETRY_COUNT = 3
RATE_LIMIT_SLEEP = 60  # Wait for 60 seconds on rate limit

# Get GitHub token from environment variable
GITHUB_TOKEN = os.getenv('GITHUB_TOKEN')

if not GITHUB_TOKEN:
    raise ValueError("GitHub token not found. Please set the GITHUB_TOKEN environment variable.")

def get_headers():
    return {
        'Authorization': f'token {GITHUB_TOKEN}',
        'Accept': 'application/vnd.github.v3+json'
    }

def get_issues_from_markdown():
    issues = []

    for directory in DIRECTORIES:
        dir_path = os.path.join(BASE_DIR, directory)
        if os.path.exists(dir_path):
            for filename in os.listdir(dir_path):
                if filename.endswith(".md"):
                    filepath = os.path.join(dir_path, filename)
                    with open(filepath, 'r') as file:
                        content = file.read()
                        front_matter = yaml.safe_load(content.split('---')[1])
                        if 'issue' in front_matter and front_matter['issue']:
                            issues.append({
                                "app_id": filename,
                                "issue_url": front_matter['issue']
                            })

    return issues

def fetch_url(url, retry_count=RETRY_COUNT):
    for attempt in range(retry_count):
        try:
            response = requests.get(url, headers=get_headers())
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 429:  # Rate limit error
                print(colored(f"Rate limit exceeded. Waiting for {RATE_LIMIT_SLEEP} seconds.", "yellow"))
                time.sleep(RATE_LIMIT_SLEEP)
            else:
                print(colored(f"Failed to fetch URL: {url}. Status code: {response.status_code}. Response: {response.text}", "red"))
        except requests.RequestException as e:
            print(colored(f"Request exception for URL: {url}. Error: {e}", "red"))
    return None

def fetch_issue_details(issue_url):
    if not issue_url.startswith("https://github.com/") and not issue_url.startswith("https://gitlab.com/"):
        print(colored(f"Skipping invalid URL: {issue_url}", "red"))
        return None

    try:
        parts = issue_url.split('/')
        if "github.com" in issue_url:
            owner = parts[3]
            repo = parts[4]
            issue_number = parts[6]
            issue_api_url = f"https://api.github.com/repos/{owner}/{repo}/issues/{issue_number}"
            comments_api_url = f"https://api.github.com/repos/{owner}/{repo}/issues/{issue_number}/comments"
        elif "gitlab.com" in issue_url:
            owner = parts[3]
            repo = parts[4]
            issue_number = parts[6]
            issue_api_url = f"https://gitlab.com/api/v4/projects/{owner}%2F{repo}/issues/{issue_number}"
            comments_api_url = f"https://gitlab.com/api/v4/projects/{owner}%2F{repo}/issues/{issue_number}/notes"
        else:
            print(colored(f"Skipping unsupported provider URL: {issue_url}", "red"))
            return None

        issue_details = fetch_url(issue_api_url)
        if not issue_details:
            return None

        comments = fetch_url(comments_api_url)
        if comments is None:
            return None

        last_comment_date = comments[-1]['updated_at'] if comments else issue_details['created_at']

        return {
            "app_id": issue_details.get('title', 'N/A'),
            "issue_url": issue_url,
            "date_issue_created": issue_details['created_at'],
            "date_last_comment": last_comment_date
        }
    except IndexError:
        print(colored(f"Error parsing URL: {issue_url}. The URL format seems incorrect.", "red"))
    except Exception as e:
        print(colored(f"Unexpected error for URL: {issue_url}. Error: {e}", "red"))
    return None

def filter_and_sort_issues(issues):
    filtered_issues = []
    threshold_date = datetime.now() - timedelta(days=TIME_THRESHOLD_DAYS)

    for issue in issues:
        issue_details = fetch_issue_details(issue['issue_url'])
        if issue_details:
            last_comment_date = datetime.strptime(issue_details['date_last_comment'], "%Y-%m-%dT%H:%M:%SZ")

            if last_comment_date < threshold_date:
                filtered_issues.append(issue_details)

    sorted_issues = sorted(filtered_issues, key=lambda x: x['date_last_comment'])
    return sorted_issues

def output_results(issues):
    print(f"{'App ID':<20} | {'Issue URL':<50} | {'Date Issue Created':<25} | {'Date Last Comment':<25}")
    print("-" * 125)
    for issue in issues:
        print(f"{issue['app_id']:<20} | {colored(issue['issue_url'], 'cyan'):<50} | {issue['date_issue_created']:<25} | {issue['date_last_comment']:<25}")

if __name__ == "__main__":
    issues = get_issues_from_markdown()
    sorted_issues = filter_and_sort_issues(issues)
    output_results(sorted_issues)
