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
apktool d -o /tmp/fromPlayTmp "$downloadedApp" || exit 1
appId=$( cat /tmp/fromPlayTmp/AndroidManifest.xml | head -n 1 | sed 's/.*package=\"//g' | sed 's/\".*//g' )
versionName=$( cat /tmp/fromPlayTmp/apktool.yml | grep versionName | sed 's/.*\: //g' )
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
  echo "versionName could not be tetermined"
  exit 1
fi

if [ -z $versionCode ]; then
  echo "versionCode could not be tetermined"
  exit 1
fi

echo
echo "Testing \"$downloadedApp\" ($appId version $versionName)"
echo

testMycelium() {
  echo "Testing Mycelium ..."
  sudo umount /tmp/sorted
  sudo rm -rf /tmp/sorted
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
  mkdir /tmp/sorted
  sudo disorderfs --sort-dirents=yes --reverse-dirents=no --multi-user=yes $PWD /tmp/sorted
  docker run --volume /tmp/sorted:/mnt --workdir /mnt --rm mycelium-wallet \
      bash -c 'yes | /opt/android-sdk/tools/bin/sdkmanager "build-tools;28.0.3" ; ./gradlew -x lint -x test clean :mbw:assembleProdnetRelease'
  apktool d -o fromBuild mbw/build/outputs/apk/prodnet/release/mbw-prodnet-release.apk
  echo "Results for
appId: $appId
apkVersionName: \"$versionName\"
apkHash: $apkHash

Diff:
"
  diff --brief --recursive $fromPlayUnpacked fromBuild
  echo "

Run a full diff --recursive or meld $fromPlayUnpacked ${PWD}/fromBuild for more details."
}

testGreen() {
  echo "TODO: Implement!"
}

case "$appId" in
  "com.mycelium.wallet")
    testMycelium
    ;;
  "com.greenaddress.greenbits_android_wallet")
    testGreen
    ;;
  *)
    echo "Unknown appId $appId"
    ;;
esac
