#!/bin/bash
# app.michaelwuensch.bitbanana.sh v0.9.2
# This script builds BitBanana from source and verifies reproducibility.
# It clones the repository, builds using Docker, generates APKs with bundletool

# Clone the BitBanana repository into workDir
git clone https://github.com/michaelWuensch/BitBanana "$workDir/bitbanana"
cd "$workDir/bitbanana"

versionTag="$versionName"

git checkout "v$versionTag"

# Move to reproducible-builds directory
cd reproducible-builds

# Build Docker image
docker build --platform linux/amd64 -t bitbanana-build-env .

# Move back to root directory
cd "$workDir/bitbanana"

# Build the app by running the container
docker run --rm --privileged -v "$(pwd)":/app-src --device /dev/fuse --cap-add SYS_ADMIN bitbanana-build-env bash -c "mkdir /app; disorderfs --sort-dirents=yes --reverse-dirents=no /app-src/ /app/; cd /app && gradle clean bundleRelease"

# Download the latest bundletool
curl -L -o bundletool.jar https://github.com/google/bundletool/releases/download/1.18.0/bundletool-all-1.18.0.jar
ls -lh bundletool*.jar

# Create directory where the apks will be placed
mkdir -p ./reproducible-builds/apks/built-apks

# Wait for and verify device-spec.json
max_attempts=2
attempt=1
while [ $attempt -le $max_attempts ]; do
  if [ -f "$workDir/device-spec.json" ]; then
    echo "Found device-spec.json in workDir"
    if ! cp "$workDir/device-spec.json" ./device-spec.json; then
      echo "Error: Failed to copy device-spec.json from workDir"
      exit 1
    fi
    echo "device-spec.json contents:"
    cat ./device-spec.json
    break
  else
    echo "Waiting for device-spec.json to be created (attempt $attempt of $max_attempts)..."
    sleep 2
    attempt=$((attempt + 1))
  fi
done

if [ $attempt -gt $max_attempts ]; then
  echo "Error: device-spec.json not found in workDir after $max_attempts attempts: $workDir"
  exit 1
fi

# Find the generated AAB file
aabPath=$(find ./app/build/outputs/bundle/release/ -name '*.aab' | head -n 1)
if [ -z "$aabPath" ]; then
  echo "Error: No AAB file found in ./app/build/outputs/bundle/release/"
  exit 1
fi
echo "Using AAB file: $aabPath"

# Run bundletool
java -jar bundletool.jar build-apks \
  --bundle="$aabPath" \
  --output-format=DIRECTORY \
  --output=./reproducible-builds/apks/built-apks \
  --device-spec="device-spec.json"

# Copy to expected folder
echo "Copying produced artifacts for testAAB.sh comparison"
mkdir -p "$workDir/built-split_apks"
cp -r ./reproducible-builds/apks/built-apks/splits/*.apk "$workDir/built-split_apks"