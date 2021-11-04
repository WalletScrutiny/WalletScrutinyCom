#!/bin/bash

test() {
  repo=https://github.com/blockchain/My-Wallet-V3-Android
  tag="v$versionName($versionCode)"
  builtApk=$workDir/blockchain-${versionName}-envProd-release-unsigned.apk
  
  echo "Testing $appId from $repo revision $tag (revisionOverride: '$revisionOverride')..."
  # cleanup
  rm -rf "$workDir" || exit 1
  # get uinque folder
  mkdir -p $workDir

  # build
  rev="$tag"
  if [ -n "$revisionOverride" ]
  then
    rev="$revisionOverride"
  fi

  podman rmi -f piukblockchain
  podman build --build-arg REVISION="$rev" --tag piukblockchain --file=$TEST_ANDROID_DIR/piuk.blockchain.android.container
  podman run -it --volume $workDir:/mnt --rm piukblockchain bash -c \
      'cp app/build/outputs/apk/envProd/release/*.apk /mnt/'
      
  # collect results
  result
}
