#!/bin/bash

downloadedApp="$1"
# make sure path is absolute
if ! [[ $downloadedApp =~ ^/.* ]]; then
  downloadedApp="$PWD/$downloadedApp"
fi
wsDocker="walletscrutiny/android:3"

set -x

dockerApktool() {
  targetFolder=$1
  app=$2
  targetFolderParent=$(dirname "$targetFolder")
  targetFolderBase=$(basename "$targetFolder")
  appFolder=$(dirname "$app")
  appFile=$(basename "$app")
  docker run --rm --volume $targetFolderParent:/tfp --volume $appFolder:/af:ro $wsDocker sh -c "apktool d -o \"/tfp/$targetFolderBase\" \"/af/$appFile\"; chown $(id -u):$(id -g) -R /tfp/"
  return $?
}

getSigner() {
  DIR=$(dirname "$1")
  BASE=$(basename "$1")
  s=$( docker run --rm --volume $DIR:/mnt:ro --workdir /mnt $wsDocker apksigner verify --print-certs "$BASE" | grep "Signer #1 certificate SHA-256"  | awk '{print $6}' )
  echo $s
}

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
signer=$( getSigner "$downloadedApp" )
echo "Extracting APK content ..."
dockerApktool $fromPlayFolder "$downloadedApp" || exit 1
appId=$( cat $fromPlayFolder/AndroidManifest.xml | head -n 1 | sed 's/.*package=\"//g' | sed 's/\".*//g' )
versionName=$( cat $fromPlayFolder/apktool.yml | grep versionName | sed 's/.*\: //g' | sed "s/'//g" )
versionCode=$( cat $fromPlayFolder/apktool.yml | grep versionCode | sed 's/.*\: //g' | sed "s/'//g" )
fromPlayUnpacked=/tmp/fromPlay_"$appId"_"$versionCode"
workDir="/tmp/test$appId"
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
  sudo rm -rf /tmp/test$appId || exit 1
  # get uinque folder
  mkdir $workDir
  cd $workDir
  # clone
  git clone $repo app || exit 1
  cd app
  echo "Trying to checkout version $tag ..."
  git checkout "$tag" || exit 1
}

result() {
  # collect results
  fromBuildUnpacked="/tmp/fromBuild_${appId}_$versionCode"
  rm -rf $fromBuildUnpacked
  dockerApktool $fromBuildUnpacked "$builtApk" || exit 1
  echo "Results:
appId:          $appId
signer:         $signer
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
  builtApk=$workDir/app/mbw/build/outputs/apk/prodnet/release/mbw-prodnet-release.apk

  prepare

  git clone https://github.com/mycelium-com/wallet-android-modularization-tools
  git submodule update --init --recursive
  
  # build
  sudo rm -rf $workDir/sorted
  mkdir $workDir/sorted
  sudo disorderfs --sort-dirents=yes --reverse-dirents=no --multi-user=yes $workDir/app $workDir/sorted
  docker run --volume $workDir/sorted:/mnt --workdir /mnt -it --rm $wsDocker \
      bash -c "./gradlew -x lint -x test clean :mbw:assembleProdnetRelease;chown $(id -u):$(id -g) -R /mnt/;
        bash # just in case the compilation needs fixing, stop here and do not throw the docker container away just yet"
  sudo umount $workDir/sorted

  result
}

testGreen() {
  repo=https://github.com/Blockstream/green_android/
  tag=release_$versionName
  builtApk=$workDir/app/app/build/outputs/apk/production/release/app-production-release-unsigned.apk
  
  prepare

  # build
  docker run -it --volume $PWD:/mnt --workdir /mnt --rm $wsDocker bash -x -c 'apt update; \
      apt install -y curl; \
      ./app/fetch_gdk_binaries.sh; \
      yes | /opt/android-sdk/tools/bin/sdkmanager "build-tools;29.0.2"; \
      ./gradlew -x test clean assembleProductionRelease'
      
  result
}

testSchildbach() {
  repo=https://github.com/bitcoin-wallet/bitcoin-wallet
  tag=v$versionName
  builtApk=$workDir/app/wallet/build/outputs/apk/prod/release/bitcoin-wallet-prod-release-unsigned.apk
  
  prepare

  # build
  docker run -it --volume $workDir/app:/mnt --workdir /mnt --rm $wsDocker bash -x -c \
      'yes | /opt/android-sdk/tools/bin/sdkmanager "build-tools;29.0.2"; \
      apt update && apt install gradle -y; \
      gradle clean :wallet:assProdRel'
      
  result
}

testAirgapVault() {
  repo=https://github.com/airgap-it/airgap-vault
  tag=v$versionName
  builtApk=$workDir/app/airgap-vault-release-unsigned.apk
  
  prepare

  # build
  sed -i -e "s/version=\"0.0.0\"/version=\"$versionName\"/g" config.xml
  docker build -f build/android/Dockerfile -t airgap-vault --build-arg BUILD_NR="$versionCode" --build-arg VERSION="$versionName" .
  docker run --name "airgap-vault-build" airgap-vault echo "container ran."
  docker cp airgap-vault-build:/app/android-release-unsigned.apk airgap-vault-release-unsigned.apk
  docker rmi airgap-vault-build -f
  docker rmi airgap-vault -f
  docker image prune -f
  
  result
}

testUnstoppable() {
  repo=https://github.com/horizontalsystems/unstoppable-wallet-android
  tag=$versionName
  builtApk=$workDir/app/app/build/outputs/apk/release/app-release-unsigned.apk
  
  prepare

  # build
  docker run -it --volume $PWD:/mnt --workdir /mnt --rm $wsDocker bash -x -c \
      './gradlew clean :app:assembleRelease'
      
  # collect results
  result
}

testBlockchain() {
  repo=https://github.com/blockchain/My-Wallet-V3-Android
  tag="v$versionName($versionCode)"
  builtApk=$workDir/app/app/build/outputs/apk/envProd/release/blockchain-${versionName}-envProd-release-unsigned.apk
  
  prepare

  # build
  docker run -it --volume $PWD:/mnt --workdir /mnt --rm $wsDocker bash -x -c \
      './scripts/quick_start.sh; ./gradlew :app:assembleEnvProdRelease -x :app:lintVitalEnvProdRelease'
      
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
  "piuk.blockchain.android")
    testBlockchain
    ;;
  *)
    echo "Unknown appId $appId"
    ;;
esac
