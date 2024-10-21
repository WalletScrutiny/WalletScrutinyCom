#!/usr/bin/env nix-shell
#! nix-shell -i bash -p gradle openjdk11 wget disorderfs androidsdk_33

takeUserActionCommand='echo "CTRL-D to continue";
  bash'
versionName=10.16
workDir=/tmp/test_de.schildbach.wallet
repo=https://github.com/bitcoin-wallet/bitcoin-wallet
tag=v$versionName
builtApk=$workDir/app/wallet/build/outputs/apk/prod/release/bitcoin-wallet-prod-release-unsigned.apk

test() {
  echo "Setting up build directory with disorderfs..."
  mkdir /sorted/
  disorderfs --sort-dirents=yes --reverse-dirents=no $workDir/app /sorted/

  echo "Starting Gradle build..."
  cd /sorted/
  ANDROID_HOME=$ANDROID_HOME gradle --no-build-cache --no-daemon --no-parallel clean :wallet:assembleRelease

  echo "Taking user action: $takeUserActionCommand"
  $takeUserActionCommand
}

# Akzeptiere Android SDK-Lizenzen automatisch
yes | sdkmanager --licenses >/dev/null || true

# Aufruf der Testfunktion
test
