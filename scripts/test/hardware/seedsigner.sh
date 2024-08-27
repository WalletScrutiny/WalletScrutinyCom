#!/bin/bash
# "This script takes two arguments: the version number and the board type"
# echo "Do: '$ ./scripts/test/hardware/seedsigner.sh {version number} {board type}'"
# echo "Supported board types: (pi0, pi2, pi02w, pi4, or all)"

set -euo pipefail

# Checks if the 2 arguments are present
if [ $# -ne 2 ]; then
    echo "This script takes two arguments: the version number and the board type"
    echo "Do: '$ ./scripts/test/hardware/seedsigner.sh {version number} {board type}'"
    echo "Supported board types: (pi0, pi2, pi02w, pi4, or all)"
    exit
else
    version=$1
    board=$2
    case "$board" in
        pi0|pi2|pi02w|pi4|all)
            echo "You have selected $board"
            ;;
        *)
            echo "Please choose from the following board types:"
            echo "pi0, pi2, pi02, pi4 or all"
            exit
        esac
fi

# Goes to /tmp directory, creates a directory, and changes to that directory
cd /tmp
if [ -d "seedsigner-build-$version" ]; then
    echo "Directory seedsigner-build-$version already exists. Delete and recreate [y/n]?"
    read input2
    if [ "$input2" == "y" ]; then
        sudo rm -rf seedsigner-build-$version
        mkdir seedsigner-build-$version
    elif [ "$input2" == "n" ]; then
        echo "Using the existing directory."
    else
        echo "Invalid input. Please input 'y' or 'n'"
        continue
    fi
else
    mkdir seedsigner-build-$version
fi

cd seedsigner-build-$version

# Checking if directory already exists before cloning
while true; do
    if [ -d "seedsigner-os" ]; then
        echo "Directory already exists. Delete [y/n]?"
        read input1
        if [ $input1 == "y" ]; then
            rm -rf seedsigner-os
            echo "Existing directory removed. Cloning anew"
            git clone --recursive https://github.com/SeedSigner/seedsigner-os.git
            break
        elif [ $input1 == "n" ]; then
            echo "You have selected 'n'. Using current directory"
            break
        else 
            echo "Please select 'y' or 'n'"
            continue
        fi
    else
        echo "Directory doesn't exist. Proceeding with cloning"
        git clone --recursive https://github.com/SeedSigner/seedsigner-os.git
        break
    fi
done

# Checks if the "seedsigner-os" was created
if [ -d "seedsigner-os" ]; then
  echo "Directory successfully cloned. Proceeding with script"
else
  echo "Clone failed. Exiting"
  exit
fi

cd seedsigner-os

# Captures git checkout $version command in a variable. Checks if tag exists
while true; do
    checkoutOutput=$(git checkout "$version" 2>&1)
    checkoutStatus=$?
    if [ $checkoutStatus -eq 0 ]; then
        echo "Successfully checked out version: $version"
        break
    else
        echo $checkoutOutput
        echo "Version does not exist. Here are the existing versions"

        recentTags=$(git for-each-ref --sort=-creatordate --format '%(refname:short)' refs/tags | head -n 5)

        if [ -z "$recentTags" ]; then
            echo "There are no recent tags. Exiting script"
            exit
        else 
            echo "Choose another tag or exit by inputting 'q'"
            read newVersion

            if [ "$newVersion" = "q" ]; then
                exit
            else
                version=$newVersion
                echo "You have selected $newVersion"
            fi
        fi
    fi
done 


echo "-------------- Starting Submodule Update ------------------"
git submodule init && git submodule update
export BOARD_TYPE=$board
echo "$BOARD_TYPE exported"
echo "-------------- Start of docker-compose run ----------------"

# First, make sure $BOARD_TYPE is set to one of the supported board types (pi0, pi2, pi02w, pi4, or all).
SS_ARGS="--$BOARD_TYPE --app-branch=$version" docker compose up --force-recreate --build
echo "Script finished."
