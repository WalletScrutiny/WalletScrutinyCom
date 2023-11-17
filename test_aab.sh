# This scipt works for xapk files downloaded from https://apkcombo.com/downloader/
# You have to set the file type to "Split APKs" in advanced settings.

#!/bin/bash

# Enable the following line for debugging to see all commands in the output
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
  echo "Extracting APK content ..."
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

findConfig() {
    local folderPath=$1
    local stringList=("$@")

    # Check if the folder exists
    if [ ! -d "$folderPath" ]; then
        echo "Error: Folder does not exist."
        return
    fi

    # Iterate through .apk files in the folder
    for apkFile in "$folderPath"/*.apk; do
        # Extract the file name without extension
        fileName=$(basename "$apkFile" .apk)
        # Remove "Config." prefix
        fileName=$(echo "$fileName" | sed 's/config\.//')

        # Check if the file name equals any string from the list
        for str in "${stringList[@]}"; do
            if [[ $fileName == "$str" ]]; then
                echo "$str"
                return
            fi
        done
    done

    echo "No match found."
}

deviceSpecArchitectureToString() {
    local input=$1

    case $input in
        "armeabi-v7a")
            echo "armeabi_v7a"
            ;;
        "arm64-v8a")
            echo "arm64_v8a"
            ;;
        "x86")
            echo "x86"
            ;;
        "x86_64")
            echo "x86_64"
            ;;
        *)
            echo "Invalid input for architecture. Allowed values are: armeabi-v7a, arm64-v8a, x86, x86_64"
            exit 1
            ;;
    esac
}

stringToDeviceSpecArchitecture() {
    local input=$1

    case $input in
        "armeabi_v7a")
            echo "armeabi-v7a"
            ;;
        "arm64_v8a")
            echo "arm64-v8a"
            ;;
        "x86")
            echo "x86"
            ;;
        "x86_64")
            echo "x86_64"
            ;;
        *)
            echo "Invalid input for architecture. Allowed values are: armeabi-v7a, arm64-v8a, x86, x86_64"
            exit 1
            ;;
    esac
}

deviceSpecScreenDensityToString() {
    local input=$1

    case $input in
        120)
            echo "ldpi"
            ;;
        160)
            echo "mdpi"
            ;;
        240)
            echo "hdpi"
            ;;
        320)
            echo "xhdpi"
            ;;
        480)
            echo "xxhdpi"
            ;;
        640)
            echo "xxxhdpi"
            ;;
        213)
            echo "tvdpi"
            ;;
        *)
            echo "Invalid input for screen density. Allowed values are: 120, 160, 240, 320, 480, 640, 213"
            exit 1
            ;;
    esac
}

stringToDeviceSpecScreenDensity() {
    local input=$1

    case $input in
        "ldpi")
            echo 120
            ;;
        "mdpi")
            echo 160
            ;;
        "hdpi")
            echo 240
            ;;
        "xhdpi")
            echo 320
            ;;
        "xxhdpi")
            echo 480
            ;;
        "xxxhdpi")
            echo 640
            ;;
        "tvdpi")
            echo 213
            ;;
        *)
            echo "Invalid input for screen density. Allowed values are: ldpi, mdpi, hdpi, xhdpi, xxhdpi, xxxhdpi, tvdpi"
            exit 1
            ;;
    esac
}

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

processBuildOutput() {
  # Create fromBuild folder
  fromBuildFolder=/tmp/fromBuild$appHash
  rm -rf $fromBuildFolder
  mkdir -p "$fromBuildFolder"

  # Copy the aab to the from build folder
  cp "$builtAab" "$fromBuildFolder"

  # Reference this as the new builtAab
  builtAab="$fromBuildFolder/$(basename "$builtAab")"

  # Create the same device specification that the downloaded file had, safe it as a json file.
  device_spec='{
    "supportedAbis": ["'$deviceSpecArchitecture'"],
    "supportedLocales": ["'$deviceSpecLocale'"],
    "screenDensity": '$deviceSpecScreenDensity',
    "sdkVersion": '$deviceSpecSdkVersion'
  }'
  deviceSpecJson=$fromBuildFolder/device_spec.json
  echo "$device_spec" > "$deviceSpecJson"

  # Create an APKSet using bundle tool with the just created device spec
  builtAPKS=${builtAab%???}apks
  bundletool build-apks --device-spec=$deviceSpecJson --bundle=$builtAab --output=$builtAPKS

  # Unizip the APKSet
  unzip -d $fromBuildFolder/apksExtracted -qq "$builtAPKS" || exit 1
}

result() {
  # Collect results
  fromPlayUnzipped=/tmp/fromPlay_${appId}_$versionCode
  fromBuildUnzipped=/tmp/fromBuild_${appId}_$versionCode
  rm -rf $fromBuildUnzipped $fromPlayUnzipped
  mkdir -p "$fromPlayUnzipped"
  mkdir -p "$fromBuildUnzipped"

  unzip -d $fromPlayUnzipped/base -qq "$fromPlayFolder/$appId.apk" || exit 1
  unzip -d $fromPlayUnzipped/architecture -qq "$fromPlayFolder/config.$architectureString.apk" || exit 1
  unzip -d $fromPlayUnzipped/dpi -qq "$fromPlayFolder/config.$screenDensityString.apk" || exit 1

  unzip -d $fromBuildUnzipped/base -qq "$fromBuildFolder/apksExtracted/splits/base-master.apk" || exit 1
  unzip -d $fromBuildUnzipped/architecture -qq "$fromBuildFolder/apksExtracted/splits/base-$architectureString.apk" || exit 1
  unzip -d $fromBuildUnzipped/dpi -qq "$fromBuildFolder/apksExtracted/splits/base-$screenDensityString.apk" || exit 1

  # Diff results
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
  if [ "$additionalInfo" ]; then
    additionalInfo="===== Also ====
$additionalInfo
"
  fi
  echo "===== Begin Results =====
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
$additionalInfo===== End Results =====
$diffGuide"
}

cleanup() {
  rm -rf $fromPlayFolder $fromBuildFolder $workDir $fromBuildUnzipped $fromPlayUnzipped 
}


# Script
# =========

if [ ! -f "$downloadedApk" ]; then
  echo "APK file not found!"
  echo
  usage
  exit 1
fi


# Create Hash for file to verify
appHash=$(sha256sum "$downloadedApk" | awk '{print $1;}')

# Set FromPlay folder
fromPlayFolder=/tmp/fromPlay$appHash
fromPlayFolderBaseApkExtracted=/tmp/fromPlay${appHash}/BaseApkExtracted
# Remove folder if it exists
rm -rf $fromPlayFolder

# Extract
unzip -d $fromPlayFolder -qq "$downloadedApk" || exit 1

# Find the base apk
cd $fromPlayFolder
baseApk=""
# Iterate over APK files in the current directory
for file in *.apk; do
    # Check if the file does not contain "config" in its name
    if [[ $file != *"config"* ]]; then
        baseApk=$(realpath "$file")
    fi
done

# Get the signer
signer=$( getSigner "$baseApk" )

# Extract baseApk and collect appId, VersionName, VersionCode #
containerApktool $fromPlayFolderBaseApkExtracted "$baseApk" || exit 1
appId=$( cat $fromPlayFolderBaseApkExtracted/AndroidManifest.xml | head -n 1 | sed 's/.*package=\"//g' | sed 's/\".*//g' )
versionName=$( cat $fromPlayFolderBaseApkExtracted/apktool.yml | grep versionName | sed 's/.*\: //g' | sed "s/'//g" )
versionCode=$( cat $fromPlayFolderBaseApkExtracted/apktool.yml | grep versionCode | sed 's/.*\: //g' | sed "s/'//g" )

if [ -z $appId ]; then
  echo "appId could not be determined"
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

# Collect the device specific information. We need this to create the device spec.
architectureString=$(findConfig $fromPlayFolder "armeabi_v7a" "arm64_v8a" "x86" "x86_64")
screenDensityString=$(findConfig $fromPlayFolder "ldpi" "mdpi" "hdpi" "xhdpi" "xxhdpi" "xxxhdpi" "tvdpi")

# Set device spec config variables
deviceSpecArchitecture=$(stringToDeviceSpecArchitecture $architectureString)
deviceSpecLocale="en-EN"
deviceSpecScreenDensity=$(stringToDeviceSpecScreenDensity $screenDensityString)
deviceSpecSdkVersion=33


echo
echo "Testing \"$downloadedApk\" ($appId version $versionName)"
echo

workDir=/tmp/test_$appId

# Define testscript by bundleID
testScript="$TEST_ANDROID_DIR/${appId}_aab.sh"
if [ ! -f "$testScript" ]; then
  echo "Unknown appId $appId"
  echo
  exit 2
fi

# Execute test script (We collect variables at this stage)
source $testScript

# Clone the source code and checkout correct commit
prepare

# Build the source code and get aab
test

# Extract APKSet from aab with same device spec as fromPLay
processBuildOutput

# Run the diff commands and present result 
result

if [ "$shouldCleanup" = true ]; then
  cleanup
fi
