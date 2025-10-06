#!/bin/bash
# apkextractor_sync.sh - Extracts APKs from Android device and syncs to server
# Version: v0.1.0
# Usage: ./apkextractor_sync.sh <appID> [user@server] [--no-extract]
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

# Show help function
show_help() {
  echo "apkextractor_sync.sh - Extracts APKs from Android device and syncs to server"
  echo ""
  echo "Usage:"
  echo "  ./apkextractor_sync.sh <appID> [user@server] [--no-extract]"
  echo ""
  echo "Arguments:"
  echo "  <appID>         Package name of the app (required)"
  echo "  [user@server]   SSH credentials for remote upload (optional)"
  echo "                  If omitted, saves locally to /var/shared/apk/"
  echo ""
  echo "Options:"
  echo "  --no-extract    Do not extract APK contents (default: extracts to 'base/' folder)"
  echo "  --help, -h      Show this help message"
  echo ""
  echo "Examples:"
  echo "  ./apkextractor_sync.sh app.zeusln.zeus"
  echo "  ./apkextractor_sync.sh app.zeusln.zeus --no-extract"
  echo "  ./apkextractor_sync.sh com.example.app user@server"
  echo "  ./apkextractor_sync.sh com.example.app user@server --no-extract"
  echo ""
  echo "Version: v0.1.0"
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

# Get the bundle ID from the command line argument
if [ -z "$1" ]; then
  echo -e "\033[1;31mError: No bundle ID provided. Usage: $0 <bundleId> [user@server]\033[0m"
  exit 1
fi

# Show and execute the command to get APK paths
echo "Retrieving APK paths for bundle ID: $bundleId"
apks=$(adb shell pm path $bundleId)

# Debug: Print the paths retrieved
echo "APK paths retrieved:"
echo "$apks"

# Determine if the app uses single or split APKS by checking for patterns
if echo "$apks" | grep -qE "split_|config."; then
  echo -e "\033[1;33m▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮ $bundleId - uses split APKs ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮\033[0m"
else
  echo -e "\033[1;33m▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮ $bundleId - uses single APK ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮\033[0m"
fi

# Make official directory
mkdir -p $bundleId/official_apks
mkdir -p $bundleId/official

# Show and execute the command to pull the APKs
echo "Pulling APKs..."
for apk in $apks; do
  apkPath=$(echo $apk | awk '{print $NF}' FS=':' | tr -d '\r\n')
  echo "Pulling $apkPath"
  adb pull "$apkPath" "$apkPath" $bundleId/official_apks/
done

# List the contents of the official directory
echo "Contents of the official directory:"
ls -l $bundleId/official

# Determine version for directory naming (versionCode or versionName)
if use_version_code "$bundleId"; then
  version=$(get_version_code "$bundleId/official_apks/base.apk")
  echo "Using versionCode for directory: $version"
else
  version=$(get_version_name "$bundleId/official_apks/base.apk")
  echo "Using versionName for directory: $version"
fi

# Determine if split APKs
isSplitApk=false
if echo "$apks" | grep -qE "split_|config."; then
  isSplitApk=true
fi

# Check if the user provided SSH credentials for syncing to the server
if [ ! -z "$sshCredentials" ]; then
  isRemote=true

  echo -e "\033[1;33m▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮ Uploading files to server ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮\033[0m"

  ssh $sshCredentials "mkdir -p /var/shared/apk/$bundleId"

  # Determine naming convention
  namingConvention=$(determine_naming_convention "/var/shared/apk/$bundleId" "$bundleId" true)

  # Create the version-specific directory
  if [ "$isSplitApk" = true ]; then
    ssh $sshCredentials "mkdir -p /var/shared/apk/$bundleId/$version/splits"
    uploadDir="/var/shared/apk/$bundleId/$version/splits"
  else
    ssh $sshCredentials "mkdir -p /var/shared/apk/$bundleId/$version"
    uploadDir="/var/shared/apk/$bundleId/$version"
  fi

  # Upload and rename APKs
  for apk in $bundleId/official_apks/*.apk; do
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

    # Extract APK contents if enabled
    if [ "$extractApk" = true ]; then
      extractDir=$(echo "$apkName" | sed 's/\.apk$//' | sed 's/split_config\.//')
      ssh $sshCredentials "mkdir -p $uploadDir/$extractDir && unzip -q $uploadDir/$newName -d $uploadDir/$extractDir"
    fi
  done

  echo "APK files have been uploaded, renamed, and extracted on the server."
else
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

  # Create the version-specific directory
  if [ "$isSplitApk" = true ]; then
    mkdir -p /var/shared/apk/$bundleId/$version/splits
    saveDir="/var/shared/apk/$bundleId/$version/splits"
  else
    mkdir -p /var/shared/apk/$bundleId/$version
    saveDir="/var/shared/apk/$bundleId/$version"
  fi

  # Copy and rename APKs
  for apk in $bundleId/official_apks/*.apk; do
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

    # Extract APK contents if enabled
    if [ "$extractApk" = true ]; then
      extractDir=$(echo "$apkName" | sed 's/\.apk$//' | sed 's/split_config\.//')
      mkdir -p "$saveDir/$extractDir"
      unzip -q "$saveDir/$newName" -d "$saveDir/$extractDir"
    fi
  done

  echo "APK files have been saved, renamed, and extracted locally to $saveDir"
fi