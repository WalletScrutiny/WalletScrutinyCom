#!/bin/bash

repo=https://github.com/blockchain/My-Wallet-V3-Android
tag="v$versionName($versionCode)"
builtApk=$workDir/blockchain-${versionName}-envProd-release-unsigned.apk

test() {
  echo "
  
  Provider did not even reply to issues in years. Not wasting precious CPU time ...
  
  "
  return
  podman rmi -f piukblockchain
  podman build --build-arg REVISION="$rev" --tag piukblockchain --file=$TEST_ANDROID_DIR/piuk.blockchain.android.container
  podman run -it --volume $workDir:/mnt --rm piukblockchain bash -c \
      'cp app/build/outputs/apk/envProd/release/*.apk /mnt/'

  podman rmi piukblockchain -f
  podman image prune -f
}
