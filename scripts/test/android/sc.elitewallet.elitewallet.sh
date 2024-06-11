#!/bin/bash
# Although this currently results in a failed build, we were able to get it to proceed until the final step of the automatic build instructions found in
# https://github.com/Elite-Labs/EliteWallet/blob/main/howto-build-android.md#building-elitewallet-on-android-with-prebuilt-dependencies-automatic-build

# Set environment variables for Android SDK and Flutter
export ANDROID_SDK_ROOT="/opt/android-sdk"
export ANDROID_HOME="/opt/android-sdk"
export FLUTTER_ROOT="/opt/flutter"
export PATH="$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$FLUTTER_ROOT/bin"

repo=https://github.com/Elite-Labs/EliteWallet
tag=main
builtApk=$workDir/build/app/outputs/flutter-apk/app-release.apk

test() {
  # Build the Docker image
  podman build \
    --tag elitewallet \
    --cgroup-manager cgroupfs \
    --build-arg UID=$(id -u) \
    --build-arg TAG=$tag \
    --file $SCRIPT_DIR/test/android/sc.elitewallet.elitewallet.dockerfile .

  # Run the Docker container and copy the built APK
  podman run \
    -it \
    --volume $workDir:/mnt \
    --rm \
    -u root \
    elitewallet \
    bash -c 'cp /home/appuser/elite_wallet/build/app/outputs/flutter-apk/app-release.apk /mnt/'

  # Clean up Docker resources
  podman rmi elitewallet -f
  podman image prune -f
}
