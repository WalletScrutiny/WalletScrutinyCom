#!/bin/bash

# This script performs a full WalletScrutiny data/content refresh pipeline.
# It updates app metadata from stores, refreshes desktop/hardware sources,
# updates donations data, regenerates derived assets, feature verification,
# and more.
#
# You don't need to run this script unless you are actively testing or maintaining
# a fork of WalletScrutiny. It can make broad repository changes, trigger external
# API calls, and regenerate many files that are not intended for routine local work.
#
# Parameters:
# -k <btcPayKey>   BTCPay API key used by refreshDonations.mjs.
# -a <apps>        Comma-separated app IDs to refresh explicitly
#                  (example: android/xx.yy.zz,iphone/aa.bb.cc).
#                  If omitted, all apps are refreshed.
# -g <githubToken> GitHub token required for desktop/hardware refresh tasks.
#                  If omitted, desktop/hardware refresh is skipped.
#
# Environment:
# PPQ_API_KEY      Optional key that enables the feature verification step.

set -e    # Enable strict mode: stop on any error

# run this using Docker:
# docker run --rm -v$PWD:/mnt --workdir=/mnt node bash ./refresh.sh -k $LN_KEY

while getopts k:a:g: option
do
  case "${option}"
  in
    k) btcPayKey=${OPTARG};;   # the api key for the BtcPayServer
    a) apps=${OPTARG};;        # comma separated list of appIDs:  android/xx.yy.zz, iphone/aa.bb.cc
    g) githubToken=${OPTARG};; # GitHub token for Desktop and Hardware refresh

  esac
done

echo " * Installing node packages..."
if ! npm install; then
  echo "❌ ERROR: Failed to install node packages. Is npm installed?"
  exit 1
fi

echo " * Archiving nobtc/nowallet apps..."
if ! node scripts/archiveNobtcNowallet.mjs; then
  echo "❌ ERROR: Failed to archive nobtc/nowallet apps"
  exit 1
fi

echo " * Updating from Google and Apple $apps ..."
if ! node \
  --input-type=module \
  --eval "import refreshApps from \"./refreshApps.mjs\"; refreshApps.refresh(false, \"$apps\")"; then
  echo "❌ ERROR: Failed to update apps from Google and Apple"
  exit 1
fi

if [ -z "$apps" ]; then
  echo " * Running script to generate app IDs..."
  wait
  if ! apps=$(node scripts/defunctParser.js); then
    echo "❌ ERROR: Failed to generate app IDs (defunctParser.js)"
    exit 1
  fi 
  if [ -n "$apps" ]; then
    if ! node \
      --input-type=module \
      --eval "import refreshApps from \"./refreshApps.mjs\"; refreshApps.refresh(true, \"$apps\")"; then
      echo "❌ ERROR: Failed to refresh apps with generated IDs"
      exit 1
    fi
  fi
fi

echo " * Refreshing Desktop apps..."
if [ -n "$githubToken" ]; then
  if ! node scripts/refreshDesktop.mjs -r -g "$githubToken"; then
    echo "❌ ERROR: Failed to refresh Desktop apps"
    exit 1
  fi
else
  echo "   ⚠️  Skipping Desktop refresh — no GitHub token (-g) provided"
fi

echo " * Refreshing Hardware apps..."
if [ -n "$githubToken" ]; then
  if ! node scripts/refreshHardware.mjs -g "$githubToken"; then
    echo "❌ ERROR: Failed to refresh Hardware apps"
    exit 1
  fi
else
  echo "   ⚠️  Skipping Hardware refresh — no GitHub token (-g) provided"
fi

echo " * Refreshing donations page from BTCPay..."
if ! node refreshDonations.mjs $btcPayKey; then
  echo "❌ ERROR: Failed to refresh donations page from BTCPay"
  exit 1
fi
wait

echo " * Update/resize images and icons..."
if [ "$( git diff --name-only | grep 'wIcons' )" != "" ]; then
  if ! ./updateImages.sh; then
    echo "❌ ERROR: Failed to update images (updateImages.sh)"
    exit 1
  fi
fi

echo " * Generating Twitter cards..."
if ! node scripts/twitterCardGen.mjs; then
  echo "❌ ERROR: Failed to generate Twitter cards"
  exit 1
fi

wait

echo " * Generating verdict pills..."
if ! ./scripts/pillGen.sh; then
    echo "❌ ERROR: Failed to generate verdict pills (pillGen.sh)"
    exit 1
fi
wait

echo " * Calling refreshResults.sh..."
if ! ./refreshResults.sh; then
    echo "❌ ERROR: Failed to execute refreshResults.sh"
    exit 1
fi

echo " * Generate allOpinions.json from Nostr..."
if ! node ./scripts/compileAllOpinions.js; then
  echo "❌ ERROR: Failed to generate allOpinions.json from Nostr"
  exit 1
fi

echo " * Doing backup of Verifications Nostr events..."
if ! node ./scripts/nostr/backupNostrVerificationEvents.mjs; then
  echo "❌ ERROR: Failed to backup Nostr verification events"
  exit 1
fi

echo " * Running feature verification..."
if [ -n "$PPQ_API_KEY" ]; then
  echo "   PPQ_API_KEY detected, running featureVerifier..."
  if ! node scripts/featureVerifier.mjs --fetch --verify --apply; then
    echo "⚠️ WARNING: featureVerifier failed, continuing..."
  fi
else
  echo "⚠️ Skipping feature verification — PPQ_API_KEY not set"
  echo "   Set it with: export PPQ_API_KEY=sk-..."
fi

echo
echo
echo "Done! I'm just a stupid bot! Please carefully review my changes before committing or publishing!"
