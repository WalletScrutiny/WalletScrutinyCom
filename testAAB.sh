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
while [[ "$#" -gt 0 ]]; do
  case $1 in
    -d|--directory) apkDir="$2"; shift ;;
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
       testaab.sh - test if APKs can be built from source

SYNOPSIS
       testaab.sh -d apkDirectory [-c]

DESCRIPTION
       This command tries to verify builds of apps that we verified before.

       -d|--directory The directory containing APK files we want to test.
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

# Function to display a summary of APKs and their SHA256 checksums
display_apk_summary() {
  # Disable debug output 
  { set +x; } 2>/dev/null

  echo -e "${BOLD_CYAN}"
  echo "========================================"
  echo "APK Summary"
  echo "========================================"
  echo "- Official APKs:"
  
  index=1
  for apk in "$apkDir"/*.apk; do
    if [ -f "$apk" ]; then
      apkName=$(basename "$apk")
      apkHash=$(sha256sum "$apk" | awk '{print $1;}')
      echo "   $index. $apkName - $apkHash"
      ((index++))
    fi
  done
  
  echo "- Built APKs:"
  
  index=1
  # Search for built APKs in $workDir
  for apk in $(find "$workDir" -name "*.apk" -type f); do
    if [ -f "$apk" ]; then
      apkName=$(basename "$apk")
      apkHash=$(sha256sum "$apk" | awk '{print $1;}')
      echo "   $index. $apkName - $apkHash" 
      ((index++))
    fi
  done
  
  echo "========================================"
  echo -e "${NC}"

  # Re-enable debug output
  { set -x; } 2>/dev/null
}

# Function to compare the built APKs with the official APKs
compare() {
  officialApk=$1
  builtApk=$2

  if [ -z "$officialApk" ] || [ -z "$builtApk" ]; then
    echo "Both official and built APK paths are required for comparison."
    return 1
  fi

  echo "Comparing official APK ($officialApk) with built APK ($builtApk)..."

  diff -r "$officialApk" "$builtApk"
  if [ $? -eq 0 ]; then
    echo "APKs match"
  else
    echo "APKs do not match"
  fi
}

# Loop through each APK in the directory and process
colors=($GREEN $YELLOW $CYAN $PINK)
colorIndex=0

apkDir=$(realpath "$apkDir")

# Array to hold metadata for display
declare -a metadataArray

# Parse metadata for all APKs first
for apk in "$apkDir"/*.apk; do
  if [ ! -f "$apk" ]; then
    echo "APK file $apk not found!"
    continue
  fi

  color=${colors[$colorIndex]}
  colorIndex=$(( (colorIndex + 1) % ${#colors[@]} ))

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
    appId="N/A"
  fi

  if [ -z "$versionName" ]; then
    echo "versionName could not be determined from $apk"
    versionName="N/A"
  fi

  if [ -z "$versionCode" ]; then
    echo "versionCode could not be determined from $apk"
    versionCode="N/A"
  fi

  echo
  echo "Testing \"$apk\" ($appId version $versionName)"
  echo

  metadataArray+=("$color" "$apk" "$appHash" "$signer" "$extractionResult" "$appId" "$versionName" "$versionCode")
done

# Display all results in an ASCII box
for ((i=0; i<${#metadataArray[@]}; i+=8)); do
  display_results "${metadataArray[i]}" "${metadataArray[i+1]}" "${metadataArray[i+2]}" "${metadataArray[i+3]}" "${metadataArray[i+4]}" "${metadataArray[i+5]}" "${metadataArray[i+6]}" "${metadataArray[i+7]}"
done

# Extract appId and versionName from the metadata array for base.apk
baseApkMetadata=("${metadataArray[@]:0:8}")
appId="${baseApkMetadata[5]}"
versionName="${baseApkMetadata[6]}"

# Build the app using the corresponding appId.sh script
echo "Attempting to source $TEST_ANDROID_DIR/$appId.sh"
if [ -f "$TEST_ANDROID_DIR/$appId.sh" ]; then
  source "$TEST_ANDROID_DIR/$appId.sh"
  echo "Sourced $TEST_ANDROID_DIR/$appId.sh successfully"
else
  echo "Error: $TEST_ANDROID_DIR/$appId.sh not found"
  exit 1
fi

# Call the 'test' function if it exists
if declare -f test > /dev/null; then
  test
  echo "Test function executed successfully"
else
  echo "Error: test function not found after sourcing $TEST_ANDROID_DIR/$appId.sh"
  exit 1
fi

# Compare the built APKs with the official APKs
for apk in "$apkDir"/*.apk; do
  if [ ! -f "$apk" ]; then
    echo "APK file $apk not found!"
    continue
  fi

  color=${colors[$colorIndex]}
  colorIndex=$(( (colorIndex + 1) % ${#colors[@]} ))

  appHash=$(sha256sum "$apk" | awk '{print $1;}')
  fromPlayFolder=/tmp/fromPlay$appHash
  rm -rf $fromPlayFolder
  signer=$( getSigner "$apk" )
  echo "Extracting APK content ..."
  containerApktool $fromPlayFolder "$apk"
  extractionResult=$?

  if [ $extractionResult -ne 0 ]; then
    extractionResult="Failed"
  else
    extractionResult="Success"
  fi

  echo
  echo "Testing \"$apk\" ($appId version $versionName)"
  echo

  # Display results in an ASCII box
  display_results "$color" "$apk" "$appHash" "$signer" "$extractionResult" "$appId" "$versionName" "$versionCode"

  builtApk="$workDir/built/$(basename "$apk" .apk)"
  if [ ! -d "$builtApk" ]; then
    echo "Built APK directory $builtApk not found"
    continue
  fi

  # Assuming the 'compare' function exists in the sourced script
  if declare -f compare > /dev/null; then
    compare "$apk" "$builtApk"
    echo "Compare function executed successfully"
  else
    echo "Error: compare function not found"
    exit 1
  fi

  # Cleanup if needed
  if [ "$shouldCleanup" = true ]; then
    cleanup
  fi
done

# Display the APK summary at the end
display_apk_summary
