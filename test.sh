#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
downloadedApk="$1"
# make sure path is absolute
if ! [[ $downloadedApk =~ ^/.* ]]; then
  downloadedApk="$PWD/$downloadedApk"
fi
wsContainer="walletscrutiny/android:5"

set -x

containerApktool() {
  targetFolder=$1
  app=$2
  targetFolderParent=$(dirname "$targetFolder")
  targetFolderBase=$(basename "$targetFolder")
  appFolder=$(dirname "$app")
  appFile=$(basename "$app")
  # Run apktool in a container so apktool doesn't need to be installed.
  # The folder with the apk file is mounted read only and only the output folder
  # is mounted with write permission.
  podman run \
    --rm \
    --volume $targetFolderParent:/tfp \
    --volume $appFolder:/af:ro \
    $wsContainer \
    sh -c "apktool d -o \"/tfp/$targetFolderBase\" \"/af/$appFile\""
  return $?
}

getSigner() {
  DIR=$(dirname "$1")
  BASE=$(basename "$1")
  s=$(
    podman run \
      --rm \
      --volume $DIR:/mnt:ro \
      --workdir /mnt \
      $wsContainer \
      apksigner verify --print-certs "$BASE" | grep "Signer #1 certificate SHA-256"  | awk '{print $6}' )
  echo $s
}

usage() {
  echo 'NAME
       test.sh - test if apk can be built from source

SYNOPSIS
       test.sh downloadedApk

DESCRIPTION
       This command tries to verify builds of apps that we verified before.
       
       downloadedApk  The apk file we want to test.'
}

if [ ! -f "$downloadedApk" ]; then
  echo "APK file not found!"
  echo
  usage
  exit 1
fi

appHash=$(sha256sum "$downloadedApk" | awk '{print $1;}')
fromPlayFolder=/tmp/fromPlay$appHash
rm -rf $fromPlayFolder
signer=$( getSigner "$downloadedApk" )
echo "Extracting APK content ..."
containerApktool $fromPlayFolder "$downloadedApk" || exit 1
appId=$( cat $fromPlayFolder/AndroidManifest.xml | head -n 1 | sed 's/.*package=\"//g' | sed 's/\".*//g' )
versionName=$( cat $fromPlayFolder/apktool.yml | grep versionName | sed 's/.*\: //g' | sed "s/'//g" )
versionCode=$( cat $fromPlayFolder/apktool.yml | grep versionCode | sed 's/.*\: //g' | sed "s/'//g" )
workDir="/tmp/test$appId"

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
echo "Testing \"$downloadedApk\" ($appId version $versionName)"
echo

prepare() {
  echo "Testing $appId from $repo revision $tag ..."
  # cleanup
  rm -rf /tmp/test$appId || exit 1
  # get uinque folder
  mkdir $workDir
  cd $workDir
  # clone
  echo "Trying to clone version $tag ..."
  git clone --quiet --branch "$tag" --depth 1 $repo app || exit 1
  cd app
}

result() {
  # collect results
  fromPlayUnzipped="/tmp/fromPlay_${appId}_$versionCode"
  fromBuildUnzipped="/tmp/fromBuild_${appId}_$versionCode"
  rm -rf $fromBuildUnzipped $fromPlayUnzipped
  unzip -d $fromPlayUnzipped -qq "$downloadedApk" || exit 1
  unzip -d $fromBuildUnzipped -qq "$builtApk" || exit 1
  echo "Results:
appId:          $appId
signer:         $signer
apkVersionName: $versionName
apkVersionCode: $versionCode
appHash:        $appHash

Diff:
$( diff --brief --recursive $fromPlayUnzipped $fromBuildUnzipped )

Revision, tag (and its signature):
$( git tag -v "$tag" )

Run a full
diff --recursive $fromPlayUnzipped $fromBuildUnzipped
meld $fromPlayUnzipped $fromBuildUnzipped
or
diffoscope \"$downloadedApk\" $builtApk
for more details."
}

case "$appId" in
  "com.mycelium.wallet")
    source ${SCRIPT_DIR}testMycelium.sh
    test ":mbw:assembleProdnetRelease"
    ;;
  "com.mycelium.testnetwallet")
    source ${SCRIPT_DIR}testMycelium.sh
    test ":mbw:assembleBtctestnetRelease"
    ;;
  "com.greenaddress.greenbits_android_wallet")
    source ${SCRIPT_DIR}testGreen.sh
    test
    ;;
  "de.schildbach.wallet")
    source ${SCRIPT_DIR}testSchildbach.sh
    test
    ;;
  "it.airgap.vault")
    source ${SCRIPT_DIR}testAirgapVault.sh
    test
    ;;
  "io.horizontalsystems.bankwallet")
    source ${SCRIPT_DIR}testUnstoppable.sh
    test
    ;;
  "piuk.blockchain.android")
    source ${SCRIPT_DIR}testBlockchain.sh
    test
    ;;
  "fr.acinq.phoenix.mainnet")
    source ${SCRIPT_DIR}testPhoenix.sh
    test
    ;;
  "zapsolutions.zap")
    source ${SCRIPT_DIR}testZap.sh
    test
    ;;
  *)
    echo "Unknown appId $appId"
    ;;
esac
