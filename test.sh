#!/bin/bash

set -x

# Global Constants
# ================

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )/scripts"
TEST_ANDROID_DIR="${SCRIPT_DIR}/test/android"
wsContainer="walletscrutiny/android:5"
takeUserActionCommand='echo "CTRL-D to continue";
  bash'
shouldCleanup=false

# Read script arguments and flags
# ===============================

while [[ "$#" -gt 0 ]]; do
  case $1 in
    -a|--apk) downloadedApk="$2"; shift ;;
    # if the desired version is not tagged, the script can be run with a revision
    # override as second parameter.
    -r|--revision-override) revisionOverride="$2"; shift ;;
    -n|--not-interactive) takeUserActionCommand='' ;;
    -c|--cleanup) shouldCleanup=true ;;
    *) echo "Unknown argument: $1"; exit 1 ;;
  esac
  shift
done

# make sure path is absolute
if ! [[ $downloadedApk =~ ^/.* ]]; then
  downloadedApk="$PWD/$downloadedApk"
fi

# Functions
# =========

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
       test.sh -a downloadedApk [-r revisionOverride] [-n]

DESCRIPTION
       This command tries to verify builds of apps that we verified before.

       -a|--apk The apk file we want to test.
       -r|--revision-override git revision id to use if tag is not found
       -n|--not-interactive The script will not ask for user actions'
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
workDir="/tmp/test_$appId"

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
  echo "Testing $appId from $repo revision $tag (revisionOverride: '$revisionOverride')..."
  # cleanup
  rm -rf "$workDir" || exit 1
  # get uinque folder
  mkdir -p $workDir
  cd $workDir
  # clone
  echo "Trying to clone …"
  if [ -n "$revisionOverride" ]
  then
    git clone --quiet $repo app && cd app && git checkout "$revisionOverride" || exit 1
  else
    git clone --quiet --branch "$tag" --depth 1 $repo app && cd app || exit 1
  fi
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
    verdict="reproducible"
  fi

  diffGuide="
Run a full
diff --recursive $fromPlayUnzipped $fromBuildUnzipped
meld $fromPlayUnzipped $fromBuildUnzipped
or
diffoscope \"$downloadedApk\" $builtApk
for more details."
  if [ "$shouldCleanup" = true ]; then
    diffGuide=''
  fi

  echo "Results:
appId:          $appId
signer:         $signer
apkVersionName: $versionName
apkVersionCode: $versionCode
verdict:        $verdict
appHash:        $appHash
commit:         $commit

Diff:
$diffResult

Revision, tag (and its signature):
$( git tag -v "$tag" )
$diffGuide"
}

cleanup() {
  rm -rf $fromPlayFolder $workDir $fromBuildUnzipped $fromPlayUnzipped
}

testScript="$TEST_ANDROID_DIR/$appId.sh"
if [ ! -f "$testScript" ]; then
  echo "Unknown appId $appId"
  echo
  exit 2
fi
source $testScript
test

if [ "$shouldCleanup" = true ]; then
  cleanup
fi
