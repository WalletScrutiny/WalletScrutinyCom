#!/bin/bash
# io.nunchuk.android.sh v0.1.0-alpha.6
# App-specific script for building the Nunchuk app. Works with 1.9.59
# Expects variables from testAAB.sh: appId, versionName, workDir

# set -e  # Exit on error

# Prepare the build context
echo "Creating build directory..."
mkdir -p "$workDir"
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

# Move back to root
cd ..

# Modify gradle.properties for memory settings
echo 'Modifying gradle.properties for memory settings...'
if [ -f "gradle.properties" ]; then
    sed -i 's/-Xmx8192m/-Xmx4096m/' gradle.properties
    sed -i 's/-XX:MetaspaceSize=8192m/-XX:MetaspaceSize=4096m/' gradle.properties
else
    echo "Warning: gradle.properties not found"
fi

# Run the container, execute all necessary commands, and keep it for copying files
echo "Running container for build..."
podman run --rm --privileged \
    -v "$(pwd)":/app-src \
    --device /dev/fuse \
    --cap-add SYS_ADMIN \
    nunchuk-android \
    bash -c "mkdir -p /app && disorderfs --sort-dirents=yes --reverse-dirents=no /app-src/ /app/ && cd /app && ./gradlew clean bundleProductionRelease"

# Creating directory for bundletool
mkdir -p "$workDir/bundletool"

# Download bundletool
echo "Downloading bundletool..."
curl -L https://github.com/google/bundletool/releases/download/1.18.0/bundletool-all-1.18.0.jar -o "$workDir/bundletool/bundletool-all-1.18.0.jar"

# Run bundletool
echo "Running bundletool..."
java -jar "$workDir/bundletool/bundletool-all-1.18.0.jar" build-apks \
    --bundle="$workDir/nunchuk-android/nunchuk-app/build/outputs/bundle/productionRelease/nunchuk-app-production-release.aab" \
    --output-format=DIRECTORY \
    --output="$workDir/built-split_apks" \
    --device-spec="$deviceSpec"

# Corrected File Normalization
echo "Verifying copy and renaming files..."
cd "$workDir/built-split_apks/splits"
mv base-master.apk ../base.apk
for f in base-*.apk; do
    [ -f "$f" ] || continue  # Skip if no matches found
    config_name=$(echo "$f" | sed 's/base-/split_config./')
    mv "$f" "../$config_name"
done
cd ..
ls -la "$workDir/built-split_apks"  # Debug: check the corrected structure


echo "APK build and organization completed successfully"