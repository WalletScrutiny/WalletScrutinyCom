#!/bin/bash

repo="https://github.com/trustee-wallet/trusteeWallet.git"
tag="v1.51.5" 
builtApk="$workDir/app/android/app/build/outputs/apk/release/app-release.apk"

test() {
  # Clone the repository if not already done
    git clone --branch "$tag" --depth 1 $repo "$workDir/app"
  fi
  cd "$workDir/app"

  # Build the Docker image for verification
  docker build -f ./docker/Dockerfile.verifyandroidbuild -t trustee_verifier .

  # Run the verification process in the Docker container
  docker run --rm \
    -v "$PWD:/trustee" \
    -v "$downloadedApk:/trustee/downloaded.apk" \
    -e ANDROID_HOME=/opt/android-sdk-linux \
    trustee_verifier \
    /bin/bash -c "cd /trustee && ./docker/verify_android_build.sh /trustee/downloaded.apk"

  # Clean up
  docker rmi trustee_verifier -f
  docker image prune -f

  $takeUserActionCommand
}