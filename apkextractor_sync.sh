#!/bin/bash
# apkextractor_sync.sh - Combines APK extraction and synchronization to the server

set -e

# Source the .bashrc to load aliases
source ~/.bashrc

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

# Remind the user to connect their phone
echo -e "\033[1;37m▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮ Please ensure your phone is connected and adb debugging is enabled. Press any key to continue... ▮▮▮▮▮▮▮▮▮▮▮▮▮▮▮\033[0m"
read -n 1 -s

# Check if a phone is connected
connected_devices=$(adb devices | grep -w "device")
if [ -z "$connected_devices" ]; then
  echo -e "\033[1;31mNo device connected. Please connect your phone and enable USB debugging.\033[0m"
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

# Set the path to the bundletool JAR file
bundletoolPath="$HOME/work/tools/bundletool.jar"

# Prompt the user for the bundle ID
echo -e "\033[1;33m**Enter the bundle ID or appID for the app (e.g., com.gemwallet.android):**\033[0m"
read bundleId
echo "bundleId=\"$bundleId\""

# Show and execute the command to get APK paths
echo "Retrieving APK paths for bundle ID: $bundleId"
apks=$(adb shell pm path $bundleId)

# Debug: Print the paths retrieved
echo "APK paths retrieved:"
echo "$apks"

# Make official directory
mkdir -p $bundleId/official

# Show and execute the command to pull the APKs
echo "Pulling APKs..."
for apk in $apks; do
  apkPath=$(echo $apk | awk '{print $NF}' FS=':' | tr -d '\r\n')
  echo "Pulling $apkPath"
  adb pull "$apkPath" $bundleId/official/
done

# List the contents of the official directory
echo "Contents of the official directory:"
ls -l $bundleId/official

# Ask the user if they want to sync to the server
echo -e "\033[1;33m**Do you want to sync the pulled APK files to the server? (yes/no):**\033[0m"
read syncChoice

if [ "$syncChoice" = "yes" ]; then
  # Prompt the user for SSH credentials
  echo -e "\033[1;33m**Enter your SSH login credentials (e.g., user@build-server):**\033[0m"
  read sshCredentials

  # Check if the directory exists on the server
  if ssh $sshCredentials "test -d $bundleId/official"; then
    echo "Directory exists on the server."
    remoteDir="$bundleId/official"
  else
    echo -e "\033[1;33m**The directory does not exist on the server. Do you want to create it? (yes/no):**\033[0m"
    read createDirChoice
    if [ "$createDirChoice" = "yes" ]; then
      ssh $sshCredentials "mkdir -p $bundleId/"
      remoteDir="$bundleId/official"
    else
      echo "The files will be extracted to the 'official' directory in the user's home directory."
      ssh $sshCredentials "mkdir -p ~$bundleId/"
      remoteDir="~/official"
    fi
  fi

  # Sync the APK files to the server
  scp -r $bundleId/official/ $sshCredentials:$remoteDir/

  # Get the list of APK files
  apkFiles=$(ssh $sshCredentials "ls $remoteDir/*.apk")

  # Extract APKs into their own directories on the server
  ssh $sshCredentials "for apk in $(echo $apkFiles); do apkName=\$(echo \"\$apk\" | sed -e 's/split_config.//g' -e 's/.apk//g' -e 's:.*/::'); mkdir -p \"$remoteDir/\$apkName\"; unzip \"\$apk\" -d \"$remoteDir/\$apkName\"; done"

  # Prompt the user whether to delete the original APK files on the server
  echo -e "\033[1;33m**Do you want to delete the original APK files in the official directory on the server? (yes/no):**\033[0m"
  read deleteChoice
  if [ "$deleteChoice" = "yes" ]; then
    ssh $sshCredentials "rm $remoteDir/*.apk"
  fi

  echo "APK files have been synchronized and processed on the server."
else
  echo "Skipping server synchronization."
  exit 0
fi
