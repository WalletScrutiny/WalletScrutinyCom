#!/bin/bash
# apkextractor_sync.sh - Extracts APKs from Android device and syncs to server
# Version: v0.7.0
# Usage: ./apkextractor_sync.sh <appID> [user@server] [OPTIONS]
# Options: -b/--both, --no-extract, -h/--help
#
# Directory structure:
#   Single APK: /var/shared/apk/{appID}/{versionName}/
#   Split APKs: /var/shared/apk/{appID}/{versionName}/splits/
#   Apps using versionCode: app.zeusln.zeus (hardcoded exceptions)
#
# Naming conventions:
#   Convention 1: {appID}_v{version}.apk (default)
#   Convention 2: {appID}-{version}.apk
#   Auto-detected from existing files in directory

set -e

# Initialize variables
bundletoolPath=""
extractApk=true
saveBoth=false

# Show help function
show_help() {
  echo "apkextractor_sync.sh - Extracts APKs from Android device and syncs to server"
  echo ""
  echo "Usage:"
  echo "  ./apkextractor_sync.sh <appID> [user@server] [OPTIONS]"
  echo ""
  echo "Arguments:"
  echo "  <appID>         Package name of the app (required)"
  echo "  [user@server]   SSH credentials for remote upload (optional)"
  echo "                  If omitted, saves locally to /var/shared/apk/"
  echo ""
  echo "Options:"
  echo "  -b, --both      Save both locally AND to server (requires server argument)"
  echo "  --no-extract    Do not extract APK contents (default: extracts to 'base/' folder)"
  echo "  -h, --help      Show this help message"
  echo ""
  echo "Examples:"
  echo "  ./apkextractor_sync.sh app.zeusln.zeus"
  echo "  ./apkextractor_sync.sh app.zeusln.zeus --no-extract"
  echo "  ./apkextractor_sync.sh com.example.app user@server"
  echo "  ./apkextractor_sync.sh com.example.app user@server -b"
  echo "  ./apkextractor_sync.sh com.example.app user@server --both --no-extract"
  echo ""
  echo "Version: v0.7.0"
  exit 0
}

# Function to check if a command exists and print status
check_command() {
  if command -v $1 &> /dev/null || alias | grep -q "$1"; then
    echo -e "$1 - \033[1;32m☑ installed\033[0m"
  else
    echo -e "$1 - \033[1;31m[x] not installed\033[0m"
    MISSING_DEPENDENCIES=true
  fi
}

is_app_installed() {
  local package_name="$1"
  if adb shell pm list packages | grep -q "^package:$package_name$"; then
    return 0 # App is installed
  else
    return 1 # App is not installed
  fi
}

get_version_code() {
  local apk_path="$1"
  aapt dump badging "$apk_path" | grep versionCode | awk '{print $3}' | sed "s/versionCode='//" | sed "s/'//"
}

get_version_name() {
  local apk_path="$1"
  aapt dump badging "$apk_path" | grep versionName | awk '{print $4}' | sed "s/versionName='//" | sed "s/'//"
}

# Determine if app uses versionCode or versionName for directory naming
use_version_code() {
  local app_id="$1"
  case "$app_id" in
    app.zeusln.zeus)
      return 0 # true - use versionCode
      ;;
    *)
      return 1 # false - use versionName
      ;;
  esac
}

get_full_apk_name() {
  local package_name="$1"
  local apk_path=$(adb shell pm path "$package_name" | grep "base.apk" | cut -d':' -f2 | tr -d '\r')
  if [ -z "$apk_path" ]; then
    echo "Error: Could not find base.apk for $package_name" >&2
    return 1
  fi
  local apk_name=$(adb shell ls -l "$apk_path" | awk '{print $NF}')
  echo "$apk_name"
}

# Function to determine naming convention
determine_naming_convention() {
  local dir="$1"
  local app_id="$2"
  local is_remote="$3"

  if [ "$is_remote" = true ]; then
    if ssh $sshCredentials "ls $dir/${app_id}_v* 2>/dev/null"; then
      echo "convention1"
    elif ssh $sshCredentials "ls $dir/${app_id}-* 2>/dev/null"; then
      echo "convention2"
    else
      echo "convention1" # Default to convention1 if no existing files
    fi
  else
    if ls $dir/${app_id}_v* 2>/dev/null; then
      echo "convention1"
    elif ls $dir/${app_id}-* 2>/dev/null; then
      echo "convention2"
    else
      echo "convention1" # Default to convention1 if no existing files
    fi
  fi
}

# Parse arguments
bundleId=""
sshCredentials=""

for arg in "$@"; do
  case "$arg" in
    --help|-h)
      show_help
      ;;
    --no-extract)
      extractApk=false
      ;;
    -b|--both)
      saveBoth=true
      ;;
    *)
      if [ -z "$bundleId" ]; then
        bundleId="$arg"
      elif [ -z "$sshCredentials" ]; then
        sshCredentials="$arg"
      fi
      ;;
  esac
done

if [ -z "$bundleId" ]; then
  echo -e "\033[1;31mError: No bundle ID provided.\033[0m"
  echo "Run './apkextractor_sync.sh --help' for usage information."
  exit 1
fi

# Validate -b flag requires server argument
if [ "$saveBoth" = true ] && [ -z "$sshCredentials" ]; then
  echo -e "\033[1;31mError: -b/--both flag requires a server argument.\033[0m"
  echo "Usage: ./apkextractor_sync.sh <appID> <user@server> -b"
  exit 1
fi

echo "bundleId=\"$bundleId\""

# Check if the app is installed before proceeding
if ! is_app_installed "$bundleId"; then
  echo -e "\033[1;31mError: The app '$bundleId' is not installed on the connected device.\033[0m"
  exit 1
fi

# Get the full APK name including version
full_apk_name=$(get_full_apk_name "$bundleId")
if [ $? -ne 0 ]; then
  echo "Failed to get full APK name. Exiting."
  exit 1
fi
echo "Full APK name: $full_apk_name"

# Show and execute the command to get apk paths
echo "Retrieving APK paths for bundle ID: $bundleId"
apks=$(adb shell pm path $bundleId)

# Check if bundletool is installed
check_bundletool() {
  echo "Checking for bundletool in /usr/local/lib and /usr/share/java..."
  if [ -f "/usr/local/lib/bundletool.jar" ]; then
    bundletoolPath="/usr/local/lib/bundletool.jar"
    echo -e "bundletool - \033[1;32m☑ installed\033[0m"
    echo "Bundletool location: /usr/local/lib/bundletool.jar"
  elif [ -f "/usr/share/java/bundletool.jar" ]; then
    bundletoolPath="/usr/share/java/bundletool.jar"
    echo -e "bundletool - \033[1;32m☑ installed\033[0m"
    echo "Bundletool location: /usr/share/java/bundletool.jar"
  else
    echo "Checking for bundletool alias in ~/.bashrc..."
    if grep -q "alias bundletool=" ~/.bashrc; then
      bundletoolPath=$(grep "alias bundletool=" ~/.bashrc | sed -e "s/alias bundletool=\'//" -e "s/\'$//")
      echo -e "bundletool - \033[1;32m☑ installed\033[0m"
      echo "Bundletool alias found in ~/.bashrc"
      echo "Bundletool location: $bundletoolPath"
    else
      echo -e "bundletool - \033[1;31m[x] not installed\033[0m"
      echo "Please ensure bundletool is installed and available in your PATH."
      MISSING_DEPENDENCIES=true
    fi
  fi
}

MISSING_DEPENDENCIES=false

# Check if adb is installed
check_command "adb"

# Check if java is installed
check_command "java"

# Check if aapt is installed
check_command "aapt"

# Check if bundletool is installed
check_bundletool



if [ "$MISSING_DEPENDENCIES" = true ]; then
  echo -e "\033[1;31mPlease install the missing dependencies before running the script.\033[0m"
  exit 1
fi

# Check if a phone is connected
connected_devices=$(adb devices | grep -w "device")
if [ -z "$connected_devices" ]; then
  echo -e "\033[1;31m▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮ No phone is connected. Exiting program ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮\033[0m"
  exit 1
else
  echo -e "\033[1;32mDevice connected successfully.\033[0m"
  echo "Device information:"
  adb devices
  echo "Model: $(adb shell getprop ro.product.model)"
  echo "Manufacturer: $(adb shell getprop ro.product.manufacturer)"
  echo "Android Version: $(adb shell getprop ro.build.version.release)"
  echo "SDK Version: $(adb shell getprop ro.build.version.sdk)"
fi

# Debug: Print the paths retrieved
echo "APK paths retrieved:"
echo "$apks"

# Determine if the app uses single or split APKS by checking for patterns
if echo "$apks" | grep -qE "split_|config."; then
  echo -e "\033[1;33m▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮ $bundleId - uses split APKs ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮\033[0m"
else
  echo -e "\033[1;33m▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮ $bundleId - uses single APK ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮\033[0m"
fi

# Create temporary staging directory
tempDir="/tmp/apk_staging_${bundleId}_$$"
mkdir -p "$tempDir"

# Show and execute the command to pull the APKs
echo "Pulling APKs to temporary staging..."
for apk in $apks; do
  apkPath=$(echo $apk | awk '{print $NF}' FS=':' | tr -d '\r\n')
  echo "Pulling $apkPath"
  adb pull "$apkPath" "$apkPath" "$tempDir/"
done

# Determine version for directory naming (versionCode or versionName)
if use_version_code "$bundleId"; then
  version=$(get_version_code "$tempDir/base.apk")
  echo "Using versionCode for directory: $version"
else
  version=$(get_version_name "$tempDir/base.apk")
  echo "Using versionName for directory: $version"
fi

# Determine if split APKs
isSplitApk=false
if echo "$apks" | grep -qE "split_|config."; then
  isSplitApk=true
fi

# Upload to server if credentials provided
if [ ! -z "$sshCredentials" ]; then
  isRemote=true

  echo -e "\033[1;33m▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮ Uploading files to server ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮\033[0m"

  ssh $sshCredentials "mkdir -p /var/shared/apk/$bundleId"

  # Determine naming convention
  namingConvention=$(determine_naming_convention "/var/shared/apk/$bundleId" "$bundleId" true)

  # Determine target directory based on APK type
  if [ "$isSplitApk" = true ]; then
    uploadDir="/var/shared/apk/$bundleId/$version/splits"
  else
    uploadDir="/var/shared/apk/$bundleId/$version"
  fi

  # Check for existing files and detect mismatches
  existingFiles=$(ssh $sshCredentials "ls -1 /var/shared/apk/$bundleId/$version/ 2>/dev/null" || echo "")

  if [ ! -z "$existingFiles" ]; then
    echo -e "\033[1;33m⚠️  Existing files detected in /var/shared/apk/$bundleId/$version/\033[0m"

    # Check for type mismatch
    if [ "$isSplitApk" = true ]; then
      # New upload is split APKs, check if single APK exists
      if echo "$existingFiles" | grep -qE "^${bundleId}_v.*\.apk$|^${bundleId}-.*\.apk$"; then
        echo -e "\033[1;31m❌ MISMATCH DETECTED:\033[0m"
        echo "  Current upload: Split APKs"
        echo "  Existing files: Single APK"
        echo ""
        echo "Existing files in /var/shared/apk/$bundleId/$version/:"
        echo "$existingFiles" | sed 's/^/    /'
        echo ""
        echo -e "\033[1;33mPlease manually clean the directory before proceeding:\033[0m"
        echo "  ssh $sshCredentials 'rm -rf /var/shared/apk/$bundleId/$version/*'"
        exit 1
      fi
    else
      # New upload is single APK, check if splits/ directory exists
      if echo "$existingFiles" | grep -q "^splits$"; then
        echo -e "\033[1;31m❌ MISMATCH DETECTED:\033[0m"
        echo "  Current upload: Single APK"
        echo "  Existing files: Split APKs (splits/ directory found)"
        echo ""
        echo "Existing files in /var/shared/apk/$bundleId/$version/:"
        echo "$existingFiles" | sed 's/^/    /'
        echo ""
        echo -e "\033[1;33mPlease manually clean the directory before proceeding:\033[0m"
        echo "  ssh $sshCredentials 'rm -rf /var/shared/apk/$bundleId/$version/*'"
        exit 1
      fi
    fi

    echo ""
    echo -e "\033[1;31m❌ Aborting to prevent accidental overwrite.\033[0m"
    echo ""
    echo -e "\033[1;33mTo proceed, manually clean the directory first:\033[0m"
    echo "  ssh $sshCredentials 'rm -rf /var/shared/apk/$bundleId/$version/*'"
    echo ""
    exit 1
  fi

  # Create the version-specific directory
  ssh $sshCredentials "mkdir -p $uploadDir"

  # Upload and rename APKs
  uploadedFiles=()
  for apk in $tempDir/*.apk; do
    apkName=$(basename "$apk")
    if [ "$apkName" = "base.apk" ] && [ "$isSplitApk" = false ]; then
        if [ "$namingConvention" = "convention1" ]; then
          newName="${bundleId}_v${version}.apk"
        else
          newName="${bundleId}-${version}.apk"
        fi
    else
        newName="$apkName"
    fi
    scp "$apk" "$sshCredentials:$uploadDir/$newName"
    uploadedFiles+=("$uploadDir/$newName")

    # Extract APK contents if enabled
    if [ "$extractApk" = true ]; then
      extractDir=$(echo "$apkName" | sed 's/\.apk$//' | sed 's/split_config\.//')
      ssh $sshCredentials "mkdir -p $uploadDir/$extractDir && unzip -q $uploadDir/$newName -d $uploadDir/$extractDir"
    fi
  done

  echo "APK files have been uploaded, renamed, and extracted on the server."

  # Display summary
  echo ""
  echo -e "\033[1;32m▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮ UPLOAD SUMMARY ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮\033[0m"
  echo -e "\033[1;36mServer Location:\033[0m"
  echo "  $sshCredentials:$uploadDir"
  echo ""
  echo -e "\033[1;36mFiles Uploaded:\033[0m"
  for file in "${uploadedFiles[@]}"; do
    fileSize=$(ssh $sshCredentials "ls -lh $file" | awk '{print $5}')
    echo "  $file ($fileSize)"
  done
  echo ""
  echo -e "\033[1;36mAPK Details:\033[0m"
  aapt dump badging "$tempDir/base.apk" | grep -E "package:|versionCode|versionName|sdkVersion|targetSdkVersion" | sed 's/^/  /'
  echo ""
  echo -e "\033[1;32m▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮ APK Hashes ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮\033[0m"
  for apk in $tempDir/*.apk; do
    hash=$(sha256sum "$apk" | awk '{print $1}')
    apkName=$(basename "$apk")
    echo "  $hash = $apkName"
  done
  echo ""
fi

# Save locally if no server OR if --both flag is set
if [ -z "$sshCredentials" ] || [ "$saveBoth" = true ]; then
  isRemote=false

  echo -e "\033[1;33m▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮ Saving files locally to /var/shared/apk ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮\033[0m"

  # Check if base directory exists
  if [ ! -d "/var/shared/apk" ]; then
    echo -e "\033[1;33m"
    echo "▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮"
    echo "ERROR: /var/shared/apk directory does not exist"
    echo "▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮"
    echo ""
    echo "Please create the directory and set permissions by running:"
    echo ""
    echo "sudo mkdir -p /var/shared/apk"
    echo "sudo chown \$USER:\$USER /var/shared/apk"
    echo ""
    echo -e "\033[0m"
    exit 1
  fi

  # Check if directory is writable
  if [ ! -w "/var/shared/apk" ]; then
    echo -e "\033[1;33m"
    echo "▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮"
    echo "ERROR: /var/shared/apk directory is not writable"
    echo "▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮"
    echo ""
    echo "Please fix permissions by running:"
    echo ""
    echo "sudo chown \$USER:\$USER /var/shared/apk"
    echo ""
    echo -e "\033[0m"
    exit 1
  fi

  mkdir -p /var/shared/apk/$bundleId

  # Determine naming convention
  namingConvention=$(determine_naming_convention "/var/shared/apk/$bundleId" "$bundleId" false)

  # Determine target directory based on APK type
  if [ "$isSplitApk" = true ]; then
    saveDir="/var/shared/apk/$bundleId/$version/splits"
  else
    saveDir="/var/shared/apk/$bundleId/$version"
  fi

  # Check for existing files and detect mismatches
  if [ -d "/var/shared/apk/$bundleId/$version" ]; then
    existingFiles=$(ls -1 /var/shared/apk/$bundleId/$version/ 2>/dev/null || echo "")

    if [ ! -z "$existingFiles" ]; then
      echo -e "\033[1;33m⚠️  Existing files detected in /var/shared/apk/$bundleId/$version/\033[0m"

      # Check for type mismatch
      if [ "$isSplitApk" = true ]; then
        # New upload is split APKs, check if single APK exists
        if echo "$existingFiles" | grep -qE "^${bundleId}_v.*\.apk$|^${bundleId}-.*\.apk$"; then
          echo -e "\033[1;31m❌ MISMATCH DETECTED:\033[0m"
          echo "  Current save: Split APKs"
          echo "  Existing files: Single APK"
          echo ""
          echo "Existing files in /var/shared/apk/$bundleId/$version/:"
          echo "$existingFiles" | sed 's/^/    /'
          echo ""
          echo -e "\033[1;33mPlease manually clean the directory before proceeding:\033[0m"
          echo "  rm -rf /var/shared/apk/$bundleId/$version/*"
          exit 1
        fi
      else
        # New save is single APK, check if splits/ directory exists
        if echo "$existingFiles" | grep -q "^splits$"; then
          echo -e "\033[1;31m❌ MISMATCH DETECTED:\033[0m"
          echo "  Current save: Single APK"
          echo "  Existing files: Split APKs (splits/ directory found)"
          echo ""
          echo "Existing files in /var/shared/apk/$bundleId/$version/:"
          echo "$existingFiles" | sed 's/^/    /'
          echo ""
          echo -e "\033[1;33mPlease manually clean the directory before proceeding:\033[0m"
          echo "  rm -rf /var/shared/apk/$bundleId/$version/*"
          exit 1
        fi
      fi

      echo ""
      echo -e "\033[1;31m❌ Aborting to prevent accidental overwrite.\033[0m"
      echo ""
      echo -e "\033[1;33mTo proceed, manually clean the directory first:\033[0m"
      echo "  rm -rf /var/shared/apk/$bundleId/$version/*"
      echo ""
      exit 1
    fi
  fi

  # Create the version-specific directory
  mkdir -p "$saveDir"

  # Copy and rename APKs
  savedFiles=()
  for apk in $tempDir/*.apk; do
    apkName=$(basename "$apk")
    if [ "$apkName" = "base.apk" ] && [ "$isSplitApk" = false ]; then
        if [ "$namingConvention" = "convention1" ]; then
          newName="${bundleId}_v${version}.apk"
        else
          newName="${bundleId}-${version}.apk"
        fi
    else
        newName="$apkName"
    fi
    cp "$apk" "$saveDir/$newName"
    savedFiles+=("$saveDir/$newName")

    # Extract APK contents if enabled
    if [ "$extractApk" = true ]; then
      extractDir=$(echo "$apkName" | sed 's/\.apk$//' | sed 's/split_config\.//')
      mkdir -p "$saveDir/$extractDir"
      unzip -q "$saveDir/$newName" -d "$saveDir/$extractDir"
    fi
  done

  echo "APK files have been saved, renamed, and extracted locally to $saveDir"

  # Display summary
  echo ""
  echo -e "\033[1;32m▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮ SAVE SUMMARY ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮\033[0m"
  echo -e "\033[1;36mLocal Location:\033[0m"
  echo "  $saveDir"
  echo ""
  echo -e "\033[1;36mFiles Saved:\033[0m"
  for file in "${savedFiles[@]}"; do
    realFile=$(realpath "$file")
    fileSize=$(ls -lh "$file" | awk '{print $5}')
    echo "  $realFile ($fileSize)"
  done
  echo ""
  echo -e "\033[1;36mAPK Details:\033[0m"
  aapt dump badging "$tempDir/base.apk" | grep -E "package:|versionCode|versionName|sdkVersion|targetSdkVersion" | sed 's/^/  /'
  echo ""
  echo -e "\033[1;32m▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮ APK Hashes ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮\033[0m"
  for apk in $tempDir/*.apk; do
    hash=$(sha256sum "$apk" | awk '{print $1}')
    apkName=$(basename "$apk")
    echo "  $hash = $apkName"
  done
  echo ""
fi
# Cleanup temporary staging directory
echo "Cleaning up temporary files..."
rm -rf "$tempDir"
echo "Done!"
