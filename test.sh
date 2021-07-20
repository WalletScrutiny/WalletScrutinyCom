#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )/scripts"
TEST_ANDROID_DIR="${SCRIPT_DIR}/test/android"
downloadedApk="$1"
# make sure path is absolute
if ! [[ $downloadedApk =~ ^/.* ]]; then
  downloadedApk="$PWD/$downloadedApk"
fi
wsContainer="walletscrutiny/android:5"

if [[ $* == *--not-interactive* ]]
then
  takeUserActionCommand=''
else
  takeUserActionCommand='echo "CTRL-D to continue";
    bash'
fi

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
  commit=$( git log -n 1 --pretty=oneline | sed 's/ .*//g' )
}

result() {
  # collect results
  fromPlayUnzipped="/tmp/fromPlay_${appId}_$versionCode"
  fromBuildUnzipped="/tmp/fromBuild_${appId}_$versionCode"
  rm -rf $fromBuildUnzipped $fromPlayUnzipped
  unzip -d $fromPlayUnzipped -qq "$downloadedApk" || exit 1
  unzip -d $fromBuildUnzipped -qq "$builtApk" || exit 1
  diffResult=$( diff --brief --recursive $fromPlayUnzipped $fromBuildUnzipped )
  diffCount=$( echo "$diffResult" | grep -vcE "(META-INF|^$)" )
  verdict=""
  if ((diffCount == 0)); then
    verdict="verdict:        reproducible"
  fi

  echo "Results:
appId:          $appId
signer:         $signer
apkVersionName: $versionName
apkVersionCode: $versionCode
$verdict
appHash:        $appHash
commit:         $commit

Diff:
$diffResult

Revision, tag (and its signature):
$( git tag -v "$tag" )

Run a full
diff --recursive $fromPlayUnzipped $fromBuildUnzipped
meld $fromPlayUnzipped $fromBuildUnzipped
or
diffoscope \"$downloadedApk\" $builtApk
for more details."
}

testScript="$TEST_ANDROID_DIR/$appId.sh"
if [ ! -f "$testScript" ]; then
  echo "Unknown appId $appId"
  echo
  exit 2
fi
source $testScript
test
