#!/bin/bash

downloadedApp="$1"

usage() {
  echo 'NAME
       test.sh - test if apk can be built from source

SYNOPSIS
       test.sh downloadedApp

DESCRIPTION
       This command runs what we know to have verified a build before.
       
       downloadedApp  The app we try to verify'
}

if [ ! -f "$downloadedApp" ]; then
  echo "APK file not found!"
  echo
  usage
  exit 1
fi

rm -rf /tmp/fromPlayTmp
echo "Extracting APK content ..."
apktool d -o /tmp/fromPlayTmp "$downloadedApp" || exit 1
appId=$( cat /tmp/fromPlayTmp/AndroidManifest.xml | head -n 1 | sed 's/.*package=\"//g' | sed 's/\".*//g' )
versionName=$( cat /tmp/fromPlayTmp/apktool.yml | grep versionName | sed 's/.*\: //g' | sed "s/'//g" )
versionCode=$( cat /tmp/fromPlayTmp/apktool.yml | grep versionCode | sed 's/.*\: //g' | sed "s/'//g" )
apkHash=$(sha256sum "$downloadedApp" | awk '{print $1;}')
fromPlayUnpacked=/tmp/fromPlay_"$appId"_"$versionCode"
rm -rf $fromPlayUnpacked
mv /tmp/fromPlayTmp $fromPlayUnpacked

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

testMycelium() {
  echo "Testing Mycelium ..."
  
  # preparation
  sudo rm -rf /tmp/testMycelium
  mkdir /tmp/testMycelium
  cd /tmp/testMycelium
  git clone https://github.com/mycelium-com/wallet-android
  cd wallet-android
  echo "Trying to checkout version $versionName ..."
  git tag | grep $versionName || exit 1
  git checkout $( git tag | grep $versionName | tail -n 1 )
  git submodule update --init --recursive || echo "ERROR: The submodule requires a GitHub account with public key configured. Cloning manually ..."
  git clone https://github.com/mycelium-com/wallet-android-modularization-tools.git
  git submodule update --init --recursive

  # build
  sudo umount /tmp/sorted
  sudo rm -rf /tmp/sorted
  mkdir /tmp/sorted
  sudo disorderfs --sort-dirents=yes --reverse-dirents=no --multi-user=yes $PWD /tmp/sorted
  docker run --volume /tmp/sorted:/mnt --workdir /mnt --rm mycelium-wallet \
      bash -c 'yes | /opt/android-sdk/tools/bin/sdkmanager "build-tools;28.0.3" ; ./gradlew -x lint -x test clean :mbw:assembleProdnetRelease'
      
  # collect results
  fromBuildUnpacked=/tmp/fromBuild_"$appId"_"$versionCode"
  rm -rf $fromBuildUnpacked
  apktool d -o $fromBuildUnpacked mbw/build/outputs/apk/prodnet/release/mbw-prodnet-release.apk
  echo "Results for
appId: $appId
apkVersionName: \"$versionName\"
apkHash: $apkHash

Diff:
"
  diff --brief --recursive $fromPlayUnpacked $fromBuildUnpacked
  echo "

Run a full diff --recursive or meld $fromPlayUnpacked $fromBuildUnpacked for more details."
}

testGreen() {
  echo "Testing Green Wallet ..."
  
  # preparation
  sudo rm -rf /tmp/testGreen
  mkdir /tmp/testGreen
  cd /tmp/testGreen
  git clone https://github.com/Blockstream/green_android/
  cd green_android
  echo "Trying to checkout version $versionName ..."
  git tag | grep $versionName || exit 1
  git checkout $( git tag | grep $versionName | tail -n 1 )

  # build
  docker run -it --volume $PWD:/mnt --workdir /mnt --rm mycelium-wallet bash -x -c 'apt update; \
      apt install -y curl; \
      ./app/fetch_gdk_binaries.sh; \
      yes | /opt/android-sdk/tools/bin/sdkmanager "build-tools;29.0.2"; \
      ./gradlew -x test clean assembleProductionRelease'
      
  # collect results
  fromBuildUnpacked=/tmp/fromBuild_"$appId"_"$versionCode"
  rm -rf $fromBuildUnpacked
  apktool d -o $fromBuildUnpacked app/build/outputs/apk/production/release/app-production-release-unsigned.apk
  echo "Results for
appId: $appId
apkVersionName: \"$versionName\"
apkHash: $apkHash

Diff:
"
  diff --brief --recursive $fromPlayUnpacked $fromBuildUnpacked
  echo "

Run a full diff --recursive or meld $fromPlayUnpacked $fromBuildUnpacked for more details."
}

testSchildbach() {
  echo "Testing Bitcoin Wallet (Schildbach) ..."
  
  # preparation
  sudo rm -rf /tmp/testSchildbach
  mkdir /tmp/testSchildbach
  cd /tmp/testSchildbach
  git clone https://github.com/bitcoin-wallet/bitcoin-wallet
  cd bitcoin-wallet
  echo "Trying to checkout version $versionName ..."
  git tag | grep $versionName || exit 1
  git checkout $( git tag | grep $versionName | tail -n 1 )

  # build
  docker run -it --volume $PWD:/mnt --workdir /mnt --rm mycelium-wallet bash -x -c \
      'yes | /opt/android-sdk/tools/bin/sdkmanager "build-tools;29.0.2"; \
      apt update && apt install gradle -y; \
      gradle clean :wallet:assProdRel'
      
  # collect results
  fromBuildUnpacked=/tmp/fromBuild_"$appId"_"$versionCode"
  rm -rf $fromBuildUnpacked
  apktool d -o $fromBuildUnpacked wallet/build/outputs/apk/prod/release/bitcoin-wallet-prod-release-unsigned.apk
  echo "Results for
appId: $appId
apkVersionName: \"$versionName\"
apkHash: $apkHash

Diff:
"
  diff --brief --recursive $fromPlayUnpacked $fromBuildUnpacked
  echo "

Run a full diff --recursive or meld $fromPlayUnpacked $fromBuildUnpacked for more details."
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
  *)
    echo "Unknown appId $appId"
    ;;
esac
