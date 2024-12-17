#!/bin/bash

# Color definitions
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if in a Git repo
git rev-parse --git-dir &>/dev/null || { echo -e "${RED}Error: Not in a git repository${NC}"; exit 1; }

# Define the target commit range
START_COMMIT="master"
END_COMMIT=ee6218eebcdaeb425e0b9dd1f7fc4efd7334c46e

# Define directories to search
SEARCH_DIRS=(_hardware _android _iphone _desktop _bearer _others)

# Extract gitRevision lines from the diff and check validity
echo -e "${YELLOW}Checking gitRevision entries between $START_COMMIT and $END_COMMIT...${NC}"
INVALID_REVISIONS=()

# Find lines with `gitRevision` and check each hash
while read -r revision; do
    if [[ -n "$revision" ]]; then
        if ! git cat-file -e "$revision" 2>/dev/null; then
            INVALID_REVISIONS+=("$revision")
        fi
    fi
done < <(git diff "$START_COMMIT...$END_COMMIT" -- | grep "\-  gitRevision" | sed 's/.*: //g')

# Report results
if [[ ${#INVALID_REVISIONS[@]} -eq 0 ]]; then
    echo -e "${GREEN}No invalid gitRevision entries found.${NC}"
    exit 0
fi

echo -e "${RED}Invalid gitRevision entries found:${NC}"
printf "%s\n" "${INVALID_REVISIONS[@]}"

# Fix invalid revisions
echo -e "\n${YELLOW}Fixing invalid revisions...${NC}"

for invalid_rev in "${INVALID_REVISIONS[@]}"; do
    # Search in all specified directories
    for dir in "${SEARCH_DIRS[@]}"; do
        files=$(find "$dir" -type f -name "*.md" -exec grep -l "gitRevision: $invalid_rev" {} \;)
        
        if [ -n "$files" ]; then
            echo -e "\n${YELLOW}Processing revision: ${NC}$invalid_rev"
            echo "Found in files:"
            echo "$files"
            
            for file in $files; do
                echo -e "\n${YELLOW}Processing file: ${NC}$file"
                
                # Get the git history for this file to find when the invalid revision was added
                commit_history=$(git log --format=%H -- "$file")
                
                for commit in $commit_history; do
                    if git cat-file -e "$commit" 2>/dev/null; then
                        echo -e "${GREEN}Found valid revision: ${NC}$commit"
                        sed -i "s/gitRevision: $invalid_rev/gitRevision: $commit/" "$file"
                        echo -e "${GREEN}Updated revision in $file${NC}"
                        break
                    fi
                done
            done
        fi
    done
done

echo -e "\n${GREEN}Finished processing revisions${NC}"