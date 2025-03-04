#!/bin/bash
# io.nunchuk.android.sh v0.1.0-alpha.8
# App-specific script for building the Nunchuk app. Works with 1.9.62
# Expects variables from testAAB.sh: appId, versionName, workDir

# set -e  # Exit on error

# Prepare the build context
echo "Creating build directory..."
mkdir -p "$workDir"
echo "Cleaning up any previous build artifacts..."
rm -rf "$workDir/built-split_apks"
mkdir -p "$workDir/built-split_apks/"

# Clone the repository
echo "Cloning the Nunchuk repository..."
git clone https://github.com/nunchuk-io/nunchuk-android "$workDir/nunchuk-android"
cd "$workDir/nunchuk-android"

# Checkout the correct branch
echo "Checking out the correct branch..."
git checkout "android.$versionName" || exit 1

# Change directory to reproducible-builds
echo "Changing to reproducible-builds directory..."
cd reproducible-builds || exit 1

# Build the docker image
echo "Building docker image..."
podman build --platform linux/amd64 -t nunchuk-android . || exit 1

# Move back to root of the cloned project
cd ..

# Modify gradle.properties for memory settings
echo 'Modifying gradle.properties for memory settings...'
if [ -f "gradle.properties" ]; then
    sed -i 's/-Xmx8192m/-Xmx4096m/' gradle.properties
    sed -i 's/-XX:MetaspaceSize=8192m/-XX:MetaspaceSize=4096m/' gradle.properties
else
    echo "Warning: gradle.properties not found"
fi

# Run the container, execute all necessary commands
echo "Running container for build..."
podman run --rm --privileged \
    -v "$(pwd)":/app-src \
    --device /dev/fuse \
    --cap-add SYS_ADMIN \
    nunchuk-android \
    bash -c "mkdir -p /app && disorderfs --sort-dirents=yes --reverse-dirents=no /app-src/ /app/ && cd /app && ./gradlew clean bundleProductionRelease"

# Define the paths
aabPath="$workDir/nunchuk-android/nunchuk-app/build/outputs/bundle/productionRelease/nunchuk-app-production-release.aab"
outputDir="$workDir/built-split_apks"

# Creating directory for bundletool
mkdir -p "$workDir/bundletool"

# Download bundletool
echo "Downloading bundletool..."
if ! curl -L --fail --silent --show-error \
    https://github.com/google/bundletool/releases/download/1.18.0/bundletool-all-1.18.0.jar \
    -o "$workDir/bundletool/bundletool-all-1.18.0.jar"; then
    echo -e "\033[0;31mError: Failed to download bundletool\033[0m"
    exit 1
fi

# Verify bundletool was downloaded
if [ ! -f "$workDir/bundletool/bundletool-all-1.18.0.jar" ]; then
    echo -e "\033[0;31mError: bundletool file not found after download\033[0m"
    exit 1
fi

echo -e "\033[0;36mRunning bundletool with the following configuration:\033[0m"
echo -e "\033[0;36m- Bundle: $aabPath\033[0m"
echo -e "\033[0;36m- Output Directory: $outputDir\033[0m"
echo -e "\033[0;36m- Mode: default\033[0m"
echo -e "\033[0;36mNote: Bundletool 1.18.0+ always outputs a .apks archive.\033[0m"

# Use the generated device-spec.json
spec_arg="--device-spec=/work/device-spec.json"

# 1) Build the .apks archive
echo -e "\n\033[1;32mStep 1: Creating bundle.apks...\033[0m"
# Remove existing bundle.apks file if it exists
echo "Removing any existing bundle.apks file..."
rm -f "$workDir/built-split_apks/bundle.apks"

if ! podman run --rm \
    -v "$workDir":/work \
    --workdir /work \
    docker.io/openjdk:11-jre \
    java -jar /work/bundletool/bundletool-all-1.18.0.jar build-apks \
    --bundle="/work/nunchuk-android/nunchuk-app/build/outputs/bundle/productionRelease/nunchuk-app-production-release.aab" \
    --output="/work/built-split_apks/bundle.apks" \
    $spec_arg \
    --mode=default; then
    echo -e "\033[0;31mError: bundletool failed to generate bundle.apks\033[0m"
    exit 1
fi

echo -e "\033[0;32mbundle.apks created successfully.\033[0m"

# 2) Extract the APKs from the .apks file
echo -e "\n\033[1;32mStep 2: Extracting APKs from bundle.apks...\033[0m"
# Remove existing extraction directory if it exists
echo "Cleaning up any previous extraction directory..."
rm -rf "$workDir/built-split_apks/extracted"

if ! podman run --rm \
    -v "$workDir":/work \
    --workdir /work \
    docker.io/openjdk:11-jre \
    java -jar /work/bundletool/bundletool-all-1.18.0.jar extract-apks \
    --apks="/work/built-split_apks/bundle.apks" \
    --output-dir="/work/built-split_apks/extracted" \
    $spec_arg ; then
    echo -e "\033[0;31mError: bundletool failed to extract APKs\033[0m"
    exit 1
fi

echo -e "\033[0;32mSplit APKs extracted successfully.\033[0m"

# Normalization: rename extracted APKs to the same final layout as before
echo -e "\n\033[0;36mMoving extracted APKs to a flat structure...\033[0m"
cd "$outputDir/extracted"
# Move "base-master.apk" => "base.apk"
find . -name "base-master.apk" -exec mv {} ../base.apk \;
# Move "base-*.apk" => "split_config.*.apk"
find . -name "base-*.apk" ! -name "base-master.apk" -exec sh -c '
  for f; do
    config_name=$(basename "$f" | sed "s/base-/split_config./")
    mv "$f" ../"$config_name"
  done
' sh {} +

# Also move any remaining .apk files that are not the above patterns
find . -name "*.apk" -exec mv {} ../ \;

# Cleanup extracted directory if you want
cd "$outputDir"
rm -rf extracted

# Show the final normalized APK list
echo -e "\n\033[0;36mFinal normalized APKs:\033[0m"
if [ -f "base.apk" ]; then
    echo -e "\033[0;32m- base.apk\033[0m"
fi
echo "- split configs:"
find . -type f -name "split_config.*.apk" | sort | while read -r apk; do
    config=$(basename "$apk" | sed 's/split_config\.//;s/\.apk//')
    echo -e "\033[0;33m  - $config\033[0m"
done

echo -e "\n\033[0;32mAPK build and organization completed successfully.\033[0m"