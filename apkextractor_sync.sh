#!/bin/bash
# apkextractor_sync.sh - Combines APK extraction and synchronization to the server
# pass appID as an argument, ie: ./apkextractor_sync.sh com.gemwallet.android [user@server]

set -e

# Initialize the bundletoolPath variable
bundletoolPath=""

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

  if ssh $sshCredentials "ls $dir/${app_id}_v* 2>/dev/null"; then
    echo "convention1"
  elif ssh $sshCredentials "ls $dir/${app_id}-* 2>/dev/null"; then
    echo "convention2"
  else
    echo "convention1" # Default to convention1 if no existing files
  fi
}

if [ -z "$1" ]; then
  echo -e "\033[1;31mError: No bundle ID provided. Usage: $0 <bundleId> [user@server]\033[0m]"
  exit 1
fi

bundleId="$1"
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

bundleId="$1"
echo "bundleId=\"$bundleId\""

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

# Check if the user provided SSH credentials for syncing to the server
if [ ! -z "$2" ]; then
  sshCredentials="$2"

  echo -e "\033[1;33m▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮ Uploading files to server ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮\033[0m"

  ssh $sshCredentials "mkdir -p /var/shared/apk/$bundleId"

  versionCode=$(get_version_code "$bundleId/official_apks/base.apk")

  # Determine naming convention
  namingConvention=$(determine_naming_convention "/var/shared/apk/$bundleId" "$bundleId")

  # Create the version-specific directory
  ssh $sshCredentials "mkdir -p /var/shared/apk/$bundleId/$versionCode"

  # Upload and rename APKs
  for apk in $bundleId/official_apks/*.apk; do
    apkName=$(basename "$apk")
    if [ "$apkName" = "base.apk" ]; then
        if [ "$namingConvention" = "convention1" ]; then
          newName="${bundleId}_v${versionCode}.apk"
        else
          newName="${bundleId}-${versionCode}.apk"
        fi
    else
        newName="$apkName"
    fi
    scp "$apk" "$sshCredentials:/var/shared/apk/$bundleId/$versionCode/$newName"

    # Extract APK contents
    extractDir=$(echo "$apkName" | sed 's/\.apk$//' | sed 's/split_config\.//')
    ssh $sshCredentials "mkdir -p /var/shared/apk/$bundleId/$versionCode/$extractDir && unzip -q /var/shared/apk/$bundleId/$versionCode/$newName -d /var/shared/apk/$bundleId/$versionCode/$extractDir"
  done 

  echo "APK files have been uploaded, renamed, and extracted on the server."
else 
  echo "Skipping server synchronization."
  exit 0
fi