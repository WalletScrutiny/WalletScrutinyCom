#!/bin/bash

# Use deviceSpec (exported by testAAB.sh via the -s flag) if provided,
# otherwise default to $SCRIPT_DIR/device-spec.json.
# build fails for v2.3.7
if [ -n "$deviceSpec" ]; then
  deviceSpecs="$deviceSpec"
else
  deviceSpecs="$SCRIPT_DIR/device-spec.json"
fi

repo=https://github.com/SwissBitcoinPay/app
tag=v$versionName
builtApk=$workDir/base-master.apk

if [ -f "$deviceSpecs" ]; then
    echo "Valid device-spec.json found at $deviceSpecs."
else
    echo "Generate and place a device specification json file to the walletscrutinycom 'scripts/' directory or specify its location via -s."
    exit 1
fi

# Set the build context directory under workDir for reproducible builds.
buildContextDir="$workDir/build_context"
mkdir -p "$buildContextDir"
echo "Cloning repository into $buildContextDir..."
git clone "$repo" "$buildContextDir"
if [ $? -ne 0 ]; then
    echo "Failed to clone repository."
    exit 1
fi

cd "$buildContextDir"
git checkout "$tag"
if [ $? -ne 0 ]; then
    echo "Failed to checkout tag $tag"
    exit 1
fi

# Copy the Dockerfile from your walletscrutinyCom repository into the cloned repository.
cp "$SCRIPT_DIR/scripts/test/android/ch.swissbitcoinpay.checkout.dockerfile" "$buildContextDir/Dockerfile"

test() {
  # Cleanup any previous images or containers.
  docker rmi sbpay -f
  docker rm sbpay-build -f
  docker image prune -f
  
  # Build the Docker image using buildContextDir as the build context.
  docker build -t sbpay --ulimit=nofile=10000:10000 --build-arg VERSION="$versionName" "$buildContextDir"
  
  # Run the container to generate the app bundle and split APKs.
  docker run -it \
    -v "$workDir":/mnt \
    -v "$deviceSpecs":/app/device-spec.json \
    --rm \
    sbpay:latest \
    ash -c "cd android && mv app/build/outputs/bundle/release/app-release.aab . \
      && wget -O bundletool.jar https://github.com/google/bundletool/releases/download/1.17.0/bundletool-all-1.17.0.jar \
      && java -jar bundletool.jar build-apks --bundle=app-release.aab --output=app-release.apks --device-spec=/app/device-spec.json \
      && unzip app-release.apks -d generated/ && cp generated/splits/*.apk /mnt/"
  
  # Clean up the build context.
  rm -rf "$buildContextDir"
}

test
