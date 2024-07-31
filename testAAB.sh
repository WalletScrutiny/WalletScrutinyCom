#!/bin/bash

# set -x

# Global Constants
# ================

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )/scripts"
TEST_ANDROID_DIR="${SCRIPT_DIR}/test/android"
wsContainer="docker.io/walletscrutiny/android:5"
takeUserActionCommand='echo "CTRL-D to continue"; bash'
shouldCleanup=false

# Color Constants
# ===============
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
PINK='\033[0;35m'
BOLD_CYAN='\033[1;36m'
NC='\033[0m' # No Color

# Read script arguments and flags
# ===============================

apkDir=""
deviceSpecPath=""
while [[ "$#" -gt 0 ]]; do
  case $1 in
    -d|--directory) apkDir="$2"; shift ;;
    -s|--spec) deviceSpecPath="$2"; shift ;;
    -c|--cleanup) shouldCleanup=true ;;
    *) echo "Unknown argument: $1"; exit 1 ;;
  esac
  shift
done

if [ -z "$apkDir" ]; then
  echo "APK directory not specified!"
  exit 1
fi

if [ ! -d "$apkDir" ]; then
  echo "APK directory $apkDir not found!"
  exit 1
fi

# Use a default path if not provided
if [ -z "$deviceSpecPath" ]; then
  deviceSpecPath="/home/gemwallet/device-spec.json"
fi

# Copy device-spec.json into Docker build context
cp "$deviceSpecPath" "$TEST_ANDROID_DIR/device-spec.json"

# Functions
# =========

containerApktool() {
  targetFolder=$1
  app=$2
  targetFolderParent=$(dirname "$targetFolder")
  targetFolderBase=$(basename "$targetFolder")
  appFolder=$(dirname "$app")
  appFile=$(basename "$app")
  # Run apktool in a container so apktool doesn't need to be installed.
  # The folder with the apk file is mounted read only and only the output folder
  # is mounted with write permission.
  podman run \
    --rm \
    --volume $targetFolderParent:/tfp \
    --volume $appFolder:/af:ro \
    $wsContainer \
    sh -c "apktool d -o \"/tfp/$targetFolderBase\" \"/af/$appFile\""
  return $?
}

getSigner() {
  DIR=$(dirname "$1")
  BASE=$(basename "$1")
  s=$(
    podman run \
      --rm \
      --volume $DIR:/mnt:ro \
      --workdir /mnt \
      $wsContainer \
      apksigner verify --print-certs "$BASE" | grep "Signer #1 certificate SHA-256"  | awk '{print $6}' )
  echo $s
}

usage() {
  echo 'NAME
       testaab.sh - test if APK can be built from source

SYNOPSIS
       testaab.sh -d apkDirectory [-s deviceSpecPath] [-c]

DESCRIPTION
       This command tries to verify builds of apps that we verified before.

       -d|--directory The directory containing the base.apk file we want to test.
       -s|--spec The path to the device-spec.json file (optional)
       -c|--cleanup Cleanup temporary files after the test.'
}

# Function to display results in an ASCII box
display_results() {
  color=$1
  apk=$2
  appHash=$3
  signer=$4
  extractionResult=$5
  appId=$6
  versionName=$7
  versionCode=$8

  # Disable debug output 
  { set +x; } 2>/dev/null

  echo -e "${color}"
  echo "========================================"
  echo "APK: $apk"
  echo "========================================"
  echo "SHA256 Checksum: $appHash"
  echo "Signer Extraction: $signer"
  echo "APK Extraction: $extractionResult"
  echo "Metadata Extraction:"
  echo "  - appId: $appId"
  echo "  - versionName: $versionName"
  echo "  - versionCode: $versionCode"
  echo "========================================"
  echo -e "${NC}"

  { set -x; } 2>/dev/null
}

# Main process
# ============

apk="$apkDir/base.apk"
if [ ! -f "$apk" ]; then
  echo "base.apk not found in $apkDir!"
  exit 1
fi

appHash=$(sha256sum "$apk" | awk '{print $1;}')
fromPlayFolder=/tmp/fromPlay$appHash
rm -rf $fromPlayFolder
signer=$( getSigner "$apk" )
echo "Extracting APK content ..."
containerApktool $fromPlayFolder "$apk"
extractionResult=$?
workDir=/tmp/test_$appId
export workDir

if [ $extractionResult -ne 0 ]; then
  extractionResult="Failed"
else
  extractionResult="Success"
fi

appId=$(grep 'package=' $fromPlayFolder/AndroidManifest.xml | sed 's/.*package=\"//g' | sed 's/\".*//g')
versionName=$(grep 'versionName' $fromPlayFolder/apktool.yml | awk '{print $2}' | sed "s/'//g")
versionCode=$(grep 'versionCode' $fromPlayFolder/apktool.yml | awk '{print $2}' | sed "s/'//g")

if [ -z "$appId" ]; then
  echo "appId could not be determined from $apk"
  exit 1
fi

if [ -z "$versionName" ]; then
  echo "versionName could not be determined from $apk"
  exit 1
fi

if [ -z "$versionCode" ]; then
  echo "versionCode could not be determined from $apk"
  exit 1
fi

echo
echo "Testing \"$apk\" ($appId version $versionName)"
echo

display_results "$GREEN" "$apk" "$appHash" "$signer" "$extractionResult" "$appId" "$versionName" "$versionCode"

# Source the appId.sh script
echo "Attempting to source $TEST_ANDROID_DIR/$appId.sh"
if [ -f "$TEST_ANDROID_DIR/$appId.sh" ]; then
  source "$TEST_ANDROID_DIR/$appId.sh" "$deviceSpecPath"
  echo "Sourced $TEST_ANDROID_DIR/$appId.sh successfully"
else
  echo "Error: $TEST_ANDROID_DIR/$appId.sh not found"
  exit 1
fi

# Run the test function
if declare -f test > /dev/null; then
  test
  echo "Test function executed successfully"
else
  echo "Error: test function not found after sourcing $TEST_ANDROID_DIR/$appId.sh"
  exit 1
fi

# Compare the built APK with the official APK
builtApk="$workDir/built/base.apk"
if [ ! -f "$builtApk" ]; then
  echo "Built APK $builtApk not found"
  exit 1
fi

if declare -f compare > /dev/null; then
  compare "$apk" "$builtApk"
  echo "Compare function executed successfully"
else
  echo "Error: compare function not found"
  exit 1
fi

# Cleanup if needed
if [ "$shouldCleanup" = true ]; then
  if declare -f cleanup > /dev/null; then
    cleanup
  else
    echo "Warning: cleanup function not found, but cleanup flag was set"
  fi
fi
