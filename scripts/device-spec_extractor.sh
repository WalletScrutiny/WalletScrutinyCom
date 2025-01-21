#!/bin/bash

# Constants
BUNDLETOOL_URL="https://github.com/google/bundletool/releases/download/1.17.2/bundletool-all-1.17.2.jar"
BUNDLETOOL_FILE="bundletool-all.jar"
DEVICE_SPEC_FILE="device-spec.json"

# Function to check if Java is installed
check_java_installed() {
  if ! command -v java &> /dev/null; then
    echo "Java is not installed or not available in the PATH."
    echo "Please install Java and try again."
    exit 1
  fi
}

# Function to download bundletool
download_bundletool() {
  echo "Downloading the latest version of bundletool..."
  if wget -q --show-progress -O "$BUNDLETOOL_FILE" "$BUNDLETOOL_URL"; then
    echo "Downloaded bundletool to: $BUNDLETOOL_FILE"
  else
    echo "Failed to download bundletool. Please check your internet connection and try again."
    exit 1
  fi
}

# Function to wait for a connected device
wait_for_device() {
  while true; do
    echo "Checking for connected Android devices..."
    adb devices | grep -q "device$"
    if [ $? -eq 0 ]; then
      echo "Device connected!"
      break
    else
      echo "No connected devices found. Please connect your phone and enable USB Debugging."
      read -p "Press Enter to retry..."
    fi
  done
}

# Function to extract device-spec.json
extract_device_spec() {
  echo "Extracting device-spec.json from the connected Android device..."
  java -jar "$BUNDLETOOL_FILE" get-device-spec --output="$DEVICE_SPEC_FILE"
  if [ $? -eq 0 ]; then
    echo "Device spec saved to: $DEVICE_SPEC_FILE"
  else
    echo "Failed to extract device-spec.json. Please ensure your phone is connected and USB Debugging is enabled."
    exit 1
  fi
}

# Main script execution
echo "Welcome to the Device Spec Extractor!"
echo ""
echo "--- Instructions ---"
echo "1. Connect your Android phone to this computer via USB."
echo "2. Turn on 'Developer Options' and enable 'USB Debugging' on your phone."
echo "3. Accept the 'Allow USB debugging' prompt on your phone if it appears."
echo "4. Ensure that ADB (Android Debug Bridge) is working on your computer."
echo "--------------------------------"
echo ""

# Check if Java is installed
check_java_installed

# Download bundletool
download_bundletool

# Wait for a connected device
wait_for_device

# Extract device-spec.json
extract_device_spec

echo ""
echo "--- Success! ---"
echo "Device spec file has been saved to: $DEVICE_SPEC_FILE"
echo "You can now use this file with bundletool to generate APKs specific to your device."
