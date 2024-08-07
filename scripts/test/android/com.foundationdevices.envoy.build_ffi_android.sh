#!/bin/bash
set -e

# Function to log messages
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1"
}

# Build Rust libraries
log_message "Starting Rust build for aarch64-linux-android"
cargo +1.69.0 build --target=aarch64-linux-android
cargo +1.69.0 build --target=aarch64-linux-android --release

# Get Flutter dependencies
log_message "Getting Flutter dependencies"
flutter pub get

# Build the APK
log_message "Building APK"
flutter build apk --release

# Check if APK was built successfully
APK_PATH="/root/repo/build/app/outputs/flutter-apk/app-release.apk"
if [ -f "$APK_PATH" ]; then
    log_message "Build completed successfully. APK is at $APK_PATH"
else
    log_message "ERROR: APK not found at $APK_PATH"
    exit 1
fi

# Print versions for debugging
log_message "Tool versions:"
cargo --version
rustc --version
flutter --version