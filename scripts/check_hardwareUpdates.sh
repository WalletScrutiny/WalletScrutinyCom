#!/bin/bash

# Get the directory of the script
SCRIPT_DIR=$(dirname "$(realpath "$0")")

# Directory containing the markdown files
MD_DIR="$SCRIPT_DIR/../_hardware"

# Function to fetch the latest version from the GitHub repository
fetch_latest_version() {
  local repo_url=$1
  # Fetch the latest release information from GitHub API
  local api_url="${repo_url/github.com/api.github.com\/repos}/releases/latest"
  local latest_version=$(curl -s "$api_url" | grep -oP '"tag_name": "\K(.*?)(?=")')
  
  if [ -z "$latest_version" ]; then
    # If no releases found, check the latest tag
    api_url="${repo_url/github.com/api.github.com\/repos}/tags"
    latest_version=$(curl -s "$api_url" | grep -oP '"name": "\K(.*?)(?=")' | head -n 1)
  fi
  
  if [ -z "$latest_version" ]; then
    # If no tags found, check the latest commit date
    api_url="${repo_url/github.com/api.github.com\/repos}/commits"
    latest_commit_date=$(curl -s "$api_url" | grep -oP '"date": "\K(.*?)(?=")' | head -n 1)
    if [ -n "$latest_commit_date" ]; then
      latest_version="latest commit is on $latest_commit_date"
    fi
  fi

  echo "$latest_version"
}

# Function to extract front matter and compare versions
check_versions() {
  local file=$1
  local filename=$(basename "$file")
  local front_matter=$(awk '/^---$/ {f++} f==2 {exit} f {print}' "$file")
  local version=$(echo "$front_matter" | grep '^version:' | awk '{print $2}')
  local repo_url=$(echo "$front_matter" | grep '^repository:' | awk '{print $2}')
  local verdict=$(echo "$front_matter" | grep '^verdict:' | awk '{print $2}')
  local meta=$(echo "$front_matter" | grep '^meta:' | awk '{print $2}')
  local reviewed_date=$(echo "$front_matter" | grep '^date:' | awk '{print $2}')

  if [[ "$meta" == "ok" && ("$verdict" == "reproducible" || "$verdict" == "nonverifiable" || "$verdict" == "wip") ]]; then
    if [ -n "$repo_url" ]; then
      local latest_version=$(fetch_latest_version "$repo_url")
      if [ "$version" != "$latest_version" ]; then
        echo -e "\e[1;36mOutdated: $filename\e[0m (current: $version, latest: $latest_version) | last verdict: $verdict | last reviewed: $reviewed_date"
      else
        echo -e "\e[1;36mUp-to-date: $filename\e[0m (version: $version) | last verdict: $verdict | last reviewed: $reviewed_date"
      fi
    else
      echo -e "\e[1;36mRepository URL not found in $filename\e[0m | last verdict: $verdict | last reviewed: $reviewed_date"
    fi
  fi
}

# Iterate over each markdown file in the directory
for file in "$MD_DIR"/*.md; do
  check_versions "$file"
done
