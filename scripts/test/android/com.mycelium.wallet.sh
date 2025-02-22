#!/bin/bash

repo=https://github.com/mycelium-com/wallet-android
tag="v$versionName"
builtApk=$workDir/app/mbw/build/outputs/apk/prodnet/release/mbw-prodnet-release.apk

test() {
  # a hack to fetch submodules through https instead of ssh
  sed -i 's/git@github.com:/https:\/\/github.com\//g' .gitmodules

  git submodule update --init --recursive
  podman build --tag mycelium_builder .

  # build
  podman run \
      --rm \
      --device /dev/fuse \
      --cap-add SYS_ADMIN \
      --security-opt apparmor=unconfined \
      --volume $workDir/app:/app \
      --interactive \
      --tty \
      mycelium_builder \
      bash -c "apt update;
        apt install -y disorderfs;
        mkdir /project/
        disorderfs --sort-dirents=yes --reverse-dirents=no /app/ /project/;
        cd /project/
        ./gradlew -x lint -x test clean :mbw:assembleProdnetRelease;
        $takeUserActionCommand"

  echo "===== Comparing Hashes with Manifest ====="
  echo "Production Release APK:"
  sha512sum $builtApk
  
  echo -e "\nProduction Release MANIFEST.MF:"
  # Create a temp directory for unzipping
  mkdir -p /tmp/mycelium_compare
  unzip -p $builtApk META-INF/MANIFEST.MF > /tmp/mycelium_compare/MANIFEST.MF
  sha512sum /tmp/mycelium_compare/MANIFEST.MF
  
  echo -e "\nExpected hashes from manifest:"
  echo "Production Release APK:"
  echo "bfb0ac376195f275d274fa86f213d658a5035dd2dcad2565c664ec1acdd040775891c1fd0e01f9b6ea569ea5cbcc94b436cce3abd56d145002375e1ba33ed8ad"
  
  echo "Production Release MANIFEST.MF:"
  echo "cec34c8d94ff010b86fecd9869f18222eb1c59541060ad40f6e697349db0e060bba53a2afe494b346af247c9ce5627ebd6eb0b13fb0fba47121a5de28e409d9f"
}
