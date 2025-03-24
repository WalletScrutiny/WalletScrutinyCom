#!/bin/bash

set -x

# Global Constants
# ================

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )/scripts"
TEST_ANDROID_DIR="${SCRIPT_DIR}/test/android"
wsContainer="docker.io/walletscrutiny/android:5"
takeUserActionCommand='echo "CTRL-D to continue";
  bash'
shouldCleanup=false

# Known signing keys for repositories
# Format: "repoURL:KEY1,KEY2,KEY3"
# Add known keys here to prevent warnings about different keys
declare -A KNOWN_SIGNING_KEYS
KNOWN_SIGNING_KEYS=(
  ["https://github.com/mycelium-com/wallet-android.git"]="7518217F75E41FF378F081080C9027F3036DF75D"
  # Add more repositories and their known keys as needed
)

# Helper functions
# ===============

# Function to add a new key to the known keys for a repository
add_known_key() {
  local repo="$1"
  local key="$2"
  local scriptPath="$0"
  
  # Validate inputs
  if [ -z "$repo" ] || [ -z "$key" ]; then
    echo "Error: Both repository URL and key are required"
    echo "Usage: $0 --add-key \"repository-url\" \"key\""
    return 1
  fi
  
  # Escape special characters for grep
  local repo_escaped=$(echo "$repo" | sed 's/[\/&]/\\&/g')
  
  # Check if the repository and key already exist in KNOWN_SIGNING_KEYS
  if grep -q "\\[\"$repo_escaped\"\\]" "$scriptPath"; then
    # Repository exists, check if key is already in the list
    local repoLine=$(grep -n "\\[\"$repo_escaped\"\\]" "$scriptPath" | cut -d: -f1)
    local valueLineno=$((repoLine + 0))
    local valueLine=$(sed -n "${valueLineno}p" "$scriptPath")
    
    if echo "$valueLine" | grep -q "$key"; then
      echo "Key $key already exists for repository $repo"
      return 0
    fi
    
    # Add key to existing repository - using # as delimiter to avoid issues with slashes in URLs
    sed -i "${valueLineno}s#=\"\(.*\)\"#=\"\1,$key\"#" "$scriptPath"
    echo "Added key $key to repository $repo"
  else
    # Repository doesn't exist, add it with the key
    # Insert after the opening parenthesis of the KNOWN_SIGNING_KEYS initialization
    local knownKeysLine=$(grep -n "KNOWN_SIGNING_KEYS=(" "$scriptPath" | cut -d: -f1)
    sed -i "${knownKeysLine}a \\  [\"$repo\"]=\"$key\"" "$scriptPath"
    echo "Added repository $repo with key $key"
  fi
}
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
    # Add a new flag to add a key to the known keys list
    -k|--add-key) repoUrl="$2"; keyToAdd="$3"; add_known_key "$repoUrl" "$keyToAdd"; exit 0; shift 2 ;;
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
       test.sh -a downloadedApk [-r revisionOverride] [-n] [-c]
       test.sh -k repoUrl keyToAdd

DESCRIPTION
       This command tries to verify builds of apps that we verified before.

       -a|--apk The apk file we want to test.
       -r|--revision-override git revision id to use if tag is not found
       -n|--not-interactive The script will not ask for user actions
       -c|--cleanup Clean up temporary files after testing
       -k|--add-key Add a new trusted signing key for a repository to avoid future warnings'
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
workDir=/tmp/test_$appId

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
  set +x
  # collect results
  fromPlayUnzipped=/tmp/fromPlay_${appId}_$versionCode
  fromBuildUnzipped=/tmp/fromBuild_${appId}_$versionCode
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

Revision, tag (and its signature):"
  
  # Determine if tag is annotated or lightweight
  tagInfo=$(git for-each-ref "refs/tags/$tag")
  isAnnotatedTag=false
  tagType="lightweight"
  if [[ $tagInfo == *"tag"* ]]; then
    isAnnotatedTag=true
    tagType="annotated"
  fi
  
  # Check signatures
  signatureWarnings=""
  tagSignatureStatus=""
  commitSignatureStatus=""
  signatureKeys=""
  
  # Try to verify tag signature (will work for annotated tags)
  if $isAnnotatedTag; then
    tagVerification=$(git tag -v "$tag" 2>&1) || true
    echo "$tagVerification"
    
    if [[ $tagVerification == *"Good signature"* ]]; then
      tagSignatureStatus="✓ Good signature on annotated tag"
      # Extract signing key
      tagKey=$(echo "$tagVerification" | grep "using .* key" | sed -E 's/.*using .* key ([A-F0-9]+).*/\1/' | tail -1)
      if [[ ! -z "$tagKey" ]]; then
        signatureKeys="Tag signed with: $tagKey"
      fi
    else
      tagSignatureStatus="⚠️ No valid signature found on annotated tag"
      signatureWarnings="$signatureWarnings\n- Annotated tag exists but is not signed"
    fi
  else
    tagSignatureStatus="ℹ️ Tag is lightweight (cannot contain signature)"
  fi
  
  # Try to verify commit signature
  commitObj="$tag"
  if $isAnnotatedTag; then
    # For annotated tags, we need to get the commit it points to
    commitObj="$tag^{commit}"
  fi
  
  commitVerification=$(git verify-commit "$commitObj" 2>&1) || true
  if [[ $commitVerification == *"Good signature"* ]]; then
    commitSignatureStatus="✓ Good signature on commit"
    # Extract signing key
    commitKey=$(echo "$commitVerification" | grep "using .* key" | sed -E 's/.*using .* key ([A-F0-9]+).*/\1/' | tail -1)
    if [[ ! -z "$commitKey" ]]; then
      if [[ ! -z "$signatureKeys" ]]; then
        signatureKeys="$signatureKeys\nCommit signed with: $commitKey"
      else
        signatureKeys="Commit signed with: $commitKey"
      fi
      
      # Compare keys if both tag and commit are signed
      if [[ ! -z "$tagKey" && ! -z "$commitKey" && "$tagKey" != "$commitKey" ]]; then
        signatureWarnings="$signatureWarnings\n- Tag and commit signed with different keys"
      fi
    fi
  else
    commitSignatureStatus="⚠️ No valid signature found on commit"
    if [[ -z "$signatureWarnings" ]]; then
      signatureWarnings="- Commit is not signed"
    else
      signatureWarnings="$signatureWarnings\n- Commit is not signed"
    fi
  fi
  
  # Check if keys match known keys for this repository
  # Get the origin URL for the repository
  originUrl=$(git config --get remote.origin.url)
  if [[ -n "$originUrl" && -n "${KNOWN_SIGNING_KEYS[$originUrl]}" ]]; then
    IFS=',' read -ra KNOWN_KEYS <<< "${KNOWN_SIGNING_KEYS[$originUrl]}"
    
    # Check tag key against known keys
    if [[ -n "$tagKey" ]]; then
      keyIsKnown=false
      for knownKey in "${KNOWN_KEYS[@]}"; do
        if [[ "$tagKey" == "$knownKey" ]]; then
          keyIsKnown=true
          break
        fi
      done
      
      if ! $keyIsKnown; then
        signatureWarnings="$signatureWarnings\n- Tag signed with unknown key: $tagKey"
      fi
    fi
    
    # Check commit key against known keys
    if [[ -n "$commitKey" ]]; then
      keyIsKnown=false
      for knownKey in "${KNOWN_KEYS[@]}"; do
        if [[ "$commitKey" == "$knownKey" ]]; then
          keyIsKnown=true
          break
        fi
      done
      
      if ! $keyIsKnown; then
        signatureWarnings="$signatureWarnings\n- Commit signed with unknown key: $commitKey"
      fi
    fi
  fi
  
  # Output the signature summary
  echo "
Signature Summary:
Tag type: $tagType
$tagSignatureStatus
$commitSignatureStatus"

  if [[ ! -z "$signatureKeys" ]]; then
    echo -e "\nKeys used:
$signatureKeys"
  fi
  
  if [[ ! -z "$signatureWarnings" ]]; then
    echo -e "\nWarnings:$signatureWarnings"
    
    # If we have unknown keys, suggest how to add them to known keys
    if [[ $signatureWarnings == *"unknown key"* ]]; then
      echo -e "\nTo add an unknown key to trusted keys (if you've verified it's legitimate):"
      
      if [[ -n "$tagKey" && $signatureWarnings == *"Tag signed with unknown key"* ]]; then
        echo -e "  To trust tag key: $0 --add-key \"$originUrl\" \"$tagKey\""
      fi
      
      if [[ -n "$commitKey" && $signatureWarnings == *"Commit signed with unknown key"* ]]; then
        echo -e "  To trust commit key: $0 --add-key \"$originUrl\" \"$commitKey\""
      fi
    fi
  fi
  
  echo -e "\n$additionalInfo===== End Results =====
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

prepare
test
result

if [ "$shouldCleanup" = true ]; then
  cleanup
fi
