#!/bin/bash

repo=https://github.com/btcontract/wallet
tag="$versionName"
builtApk=$workDir/app/app/build/outputs/apk/release/SBW-${versionName}.apk

test() {
  wget --directory-prefix=app/src/main/assets/ \
      https://github.com/btcontract/wallet/releases/download/${versionName}/graph.snapshot-mainnet.zlib
  additionalInfo=$(sha256sum app/src/main/assets/graph.snapshot-mainnet.zlib)
  podman build --rm --tag sbw .

  # build
  podman run \
      --rm \
      --volume $PWD:/app/simplebitcoinwallet/wallet:z \
      sbw

  podman rmi sbw -f
  podman image prune -f
}
