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

  # Check if the directory exists on the server
  if ssh $sshCredentials "test -d $bundleId/official"; then
    echo "Directory exists on the server."
    remoteDir="$bundleId"
  else
    echo -e "\033[1;33m**The directory does not exist on the server. Do you want to create it? (yes/no):**\033[0m"
    read createDirChoice
    if [ "$createDirChoice" = "yes" ]; then
      ssh $sshCredentials "mkdir -p $bundleId/official_apks"
      ssh $sshCredentials "mkdir -p $bundleId/official"
      remoteDir="$bundleId"
    else
      echo "The files will be extracted to the 'official' directory in the user's home directory."
      ssh $sshCredentials "mkdir -p $bundleId/official_apks"
      ssh $sshCredentials "mkdir -p ~$bundleId/official"
      remoteDir="~$bundleId"
    fi
  fi

  # Sync the APK files to the server
  scp -r $bundleId/official_apks/ $sshCredentials:$remoteDir/
  
  # Get the list of APK files
  apkFiles=$(ssh $sshCredentials "ls $remoteDir/official_apks/*.apk")

  # Extract APKs into their own directories on the server
  ssh $sshCredentials "for apk in $(echo $apkFiles); do apkName=\$(echo \"\$apk\" | sed -e 's/split_config.//g' -e 's/.apk//g' -e 's:.*/::'); mkdir -p \"$remoteDir/official/\$apkName\"; unzip \"\$apk\" -d \"$remoteDir/official/\$apkName\"; done"

  echo "APK files have been synchronized and processed on the server."
else
  echo "Skipping server synchronization."
  exit 0
fi
