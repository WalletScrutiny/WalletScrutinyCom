#!/bin/bash
# "This script takes two arguments: the version number and the board type"
# echo "Do: '$ ./scripts/test/hardware/seedsigner.sh {version number} {board type}'"
# echo "Supported board types: (pi0, pi2, pi02w, pi4, or all)"

set -euo pipefail

# ANSI color codes
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print single variant result
print_variant_result() {
    local board=$1
    local build_hash=$2
    local release_hash=$3
    local version=$4
    
    echo "DEBUG: Hash comparison"
    echo "DEBUG: build_hash length: ${#build_hash}"
    echo "DEBUG: release_hash length: ${#release_hash}"
    echo "DEBUG: build_hash: '$build_hash'"
    echo "DEBUG: release_hash: '$release_hash'"
    
    case $board in
        pi0)   variant_name="Raspberry Pi Zero 1.3" ;;
        pi2)   variant_name="Raspberry Pi 2 Model B" ;;
        pi02w) variant_name="Raspberry Pi Zero 2 W" ;;
        pi4)   variant_name="Raspberry Pi 4 Model B" ;;
    esac
    
    if [ "$build_hash" = "$release_hash" ]; then
        echo "DEBUG: Hashes match exactly"
        verdict="reproducible"
    else
        echo "DEBUG: Hashes do not match"
        verdict="not reproducible"
    fi
    
    printf "${CYAN}===== Begin Results =====\n"
    printf "appId:          seedsigner\n"
    printf "board:          %s\n" "$variant_name"
    printf "version:        %s\n" "$version"
    printf "builtHash:      %s\n" "$build_hash"
    printf "releaseHash:    %s\n" "$release_hash"
    printf "verdict:        %s\n" "$verdict"
    printf "===== End Results =====${NC}\n\n"
}

# Function to build a single variant
build_variant() {
    local version=$1
    local board=$2
    local build_dir="/tmp/seedsigner-build-$version"
    
    echo "Building variant: $board"
    
    # Clone and build steps
    cd /tmp
    if [ -d "$build_dir" ]; then
        echo "-----------------------------------------------------------"
        echo "Note: This script requires sudo privileges to remove build directories"
        echo "This is necessary because docker may create files owned by root"
        echo "You will be prompted for your password now"
        echo "-----------------------------------------------------------"
        echo "Directory $build_dir already exists."
        read -p "Proceed with sudo rm? [y/n]: " response
        if [[ "$response" =~ ^[Yy]$ ]]; then
            sudo rm -rf "$build_dir"
        else
            echo "Cannot proceed without removing existing directory. Exiting."
            exit 1
        fi
    fi
    mkdir "$build_dir"
    cd "$build_dir"
    
    git clone --recursive https://github.com/SeedSigner/seedsigner-os.git
    cd seedsigner-os
    git checkout "$version"
    git submodule init && git submodule update
    
    export BOARD_TYPE=$board
    SS_ARGS="--$BOARD_TYPE --app-branch=$version" docker compose up --force-recreate --build
    
    # Get the hash of the built image
    sha256sum "/tmp/seedsigner-build-$version/seedsigner-os/images/seedsigner_os.$version.$board.img" | cut -d' ' -f1
}

# Function to get release hash
get_release_hash() {
    local version=$1
    local board=$2
    # Download the hash file and extract the relevant hash
    wget -q -O "/tmp/seedsigner.$version.sha256.txt" "https://github.com/SeedSigner/seedsigner/releases/download/$version/seedsigner.$version.sha256.txt"
    grep "seedsigner_os.$version.$board.img" "/tmp/seedsigner.$version.sha256.txt" | cut -d' ' -f1
}

# Main script logic
if [ $# -ne 2 ]; then
    echo "This script takes two arguments: the version number and the board type"
    echo "Do: '$ ./scripts/test/hardware/seedsigner.sh {version number} {board type}'"
    echo "Supported board types: (pi0, pi2, pi02w, pi4, or all)"
    exit 1
fi

version=$1
board=$2

if [ "$board" = "all" ]; then
    boards=(pi0 pi2 pi02w pi4)
    for b in "${boards[@]}"; do
        echo "Starting build for $b..."
        build_hash=$(build_variant "$version" "$b")
        release_hash=$(get_release_hash "$version" "$b")
        print_variant_result "$b" "$build_hash" "$release_hash" "$version"
        
        if [ "$b" != "pi4" ]; then
            read -p "Continue with next build? [y/n]: " continue_build
            if [[ ! "$continue_build" =~ ^[Yy]$ ]]; then
                echo "Build process stopped by user"
                exit 0
            fi
        fi
    done
else
    case "$board" in
        pi0|pi2|pi02w|pi4)
            build_hash=$(build_variant "$version" "$board")
            release_hash=$(get_release_hash "$version" "$board")
            print_variant_result "$board" "$build_hash" "$release_hash" "$version"
            ;;
        *)
            echo "Invalid board type. Use: pi0, pi2, pi02w, pi4, or all"
            exit 1
            ;;
    esac
fi
