#!/bin/bash

downloadedApp="$1"

usage() {
  echo 'NAME
       test.sh - test if apk can be built from source

SYNOPSIS
       test.sh downloadedApp

DESCRIPTION
       This command tries to verify builds of apps that we verified before.
       
       downloadedApp  The apk file we want to test.'
}

if [ ! -f "$downloadedApp" ]; then
  echo "APK file not found!"
  echo
  usage
  exit 1
fi

apkHash=$(sha256sum "$downloadedApp" | awk '{print $1;}')
fromPlayFolder=/tmp/fromPlay$apkHash
rm -rf $fromPlayFolder
echo "Extracting APK content ..."
apktool d -o $fromPlayFolder "$downloadedApp" || exit 1
appId=$( cat $fromPlayFolder/AndroidManifest.xml | head -n 1 | sed 's/.*package=\"//g' | sed 's/\".*//g' )
versionName=$( cat $fromPlayFolder/apktool.yml | grep versionName | sed 's/.*\: //g' | sed "s/'//g" )
versionCode=$( cat $fromPlayFolder/apktool.yml | grep versionCode | sed 's/.*\: //g' | sed "s/'//g" )
fromPlayUnpacked=/tmp/fromPlay_"$appId"_"$versionCode"
rm -rf $fromPlayUnpacked
mv $fromPlayFolder $fromPlayUnpacked

if [ -z $appId ]; then
  echo "appId could not be tetermined"
  exit 1
fi

if [ -z $versionName ]; then
  echo "versionName could not be determined"
  exit 1
fi

if [ -z $versionCode ]; then
  echo "versionCode could not be determined"
  exit 1
fi

echo
echo "Testing \"$downloadedApp\" ($appId version $versionName)"
echo

prepare() {
  echo "Testing $appId from $repo revision $tag ..."
  # cleanup
  sudo rm -rf /tmp/test$appId
  # get uinque folder
  mkdir /tmp/test$appId
  cd /tmp/test$appId
  # clone
  git clone $repo app
  cd app
  echo "Trying to checkout version $tag ..."
  git checkout $tag || exit 1
}

result() {
  # collect results
  fromBuildUnpacked=/tmp/fromBuild_"$appId"_"$versionCode"
  rm -rf $fromBuildUnpacked
  apktool d -o $fromBuildUnpacked $builtApk
  echo "Results for $appName
appId:          $appId
apkVersionName: $versionName
apkVersionCode: $versionCode
apkHash:        $apkHash

Diff:
$( diff --brief --recursive $fromPlayUnpacked $fromBuildUnpacked )

Run a full
diff --recursive $fromPlayUnpacked $fromBuildUnpacked
meld $fromPlayUnpacked $fromBuildUnpacked
for more details."
}

testMycelium() {
  repo=https://github.com/mycelium-com/wallet-android
  tag=v$versionName
  builtApk=mbw/build/outputs/apk/prodnet/release/mbw-prodnet-release.apk

  prepare

  git submodule update --init --recursive || echo "ERROR: The submodule requires a GitHub account with public key configured. Cloning manually ..."
  git clone https://github.com/mycelium-com/wallet-android-modularization-tools.git
  git submodule update --init --recursive
  
  # build
  sudo umount /tmp/test$appId/sorted
  sync
  sudo rm -rf /tmp/test$appId/sorted
  mkdir /tmp/test$appId/sorted
  sudo disorderfs --sort-dirents=yes --reverse-dirents=no --multi-user=yes $PWD /tmp/test$appId/sorted
  docker run --volume /tmp/test$appId/sorted:/mnt --workdir /mnt --rm mycelium-wallet \
      bash -c 'yes | /opt/android-sdk/tools/bin/sdkmanager "build-tools;28.0.3" ; ./gradlew -x lint -x test clean :mbw:assembleProdnetRelease'

  result
}

testGreen() {
  repo=https://github.com/Blockstream/green_android/
  tag=release_$versionName
  builtApk=app/build/outputs/apk/production/release/app-production-release-unsigned.apk
  
  prepare

  # build
  docker run -it --volume $PWD:/mnt --workdir /mnt --rm mycelium-wallet bash -x -c 'apt update; \
      apt install -y curl; \
      ./app/fetch_gdk_binaries.sh; \
      yes | /opt/android-sdk/tools/bin/sdkmanager "build-tools;29.0.2"; \
      ./gradlew -x test clean assembleProductionRelease'
      
  result
}

testSchildbach() {
  repo=https://github.com/bitcoin-wallet/bitcoin-wallet
  tag=v$versionName
  builtApk=wallet/build/outputs/apk/prod/release/bitcoin-wallet-prod-release-unsigned.apk
  
  prepare

  # build
  docker run -it --volume $PWD:/mnt --workdir /mnt --rm mycelium-wallet bash -x -c \
      'yes | /opt/android-sdk/tools/bin/sdkmanager "build-tools;29.0.2"; \
      apt update && apt install gradle -y; \
      gradle clean :wallet:assProdRel'
      
  result
}

testAirgapVault() {
  repo=https://github.com/airgap-it/airgap-vault
  tag=v$versionName
  builtApk=airgap-vault-release-unsigned.apk
  
  prepare

  # build
  sed -i -e "s/version=\"0.0.0\"/version=\"$versionName\"/g" config.xml
  docker build -f build/android/Dockerfile -t airgap-vault --build-arg BUILD_NR="$versionCode" --build-arg VERSION="$versionName" .
  docker run --name "airgap-vault-build" airgap-vault echo "container ran."
  docker cp airgap-vault-build:/app/android-release-unsigned.apk airgap-vault-release-unsigned.apk
  docker rmi airgap-vault-build -f
  docker rmi airgap-vault -f
  docker image prune -f
  apktool d -o fromBuild airgap-vault-release-unsigned.apk
  
  result
}

testUnstoppable() {
  repo=https://github.com/horizontalsystems/unstoppable-wallet-android
  tag=$versionName
  builtApk=wallet/build/outputs/apk/prod/release/bitcoin-wallet-prod-release-unsigned.apk
  
  prepare

  # build
  docker run -it --volume $PWD:/mnt --workdir /mnt --rm mycelium-wallet bash -x -c \
      './gradlew clean :app:assembleProductionMainnetRelease'
      
  # collect results
  result
}

case "$appId" in
  "com.mycelium.wallet")
    testMycelium
    ;;
  "com.greenaddress.greenbits_android_wallet")
    testGreen
    ;;
  "de.schildbach.wallet")
    testSchildbach
    ;;
  "it.airgap.vault")
    testAirgapVault
    ;;
  "io.horizontalsystems.bankwallet")
    testUnstoppable
    ;;
  *)
    echo "Unknown appId $appId"
    ;;
esac
