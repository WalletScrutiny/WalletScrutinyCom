#!/bin/bash

# This script performs a full WalletScrutiny data/content refresh pipeline.
# It updates app metadata from stores, syncs F-Droid alternativeStores on
# Android source-available pages, syncs bitcoinOrgId from bitcoin.org _wallets,
# refreshes desktop/hardware sources,
# updates donations data, regenerates derived assets, feature verification,
# and more.
#
# You don't need to run this script unless you are actively testing or maintaining
# a fork of WalletScrutiny. It can make broad repository changes, trigger external
# API calls, and regenerate many files that are not intended for routine local work.
#
# Parameters:
# -k <btcPayKey>   BTCPay API key used by refreshDonations.mjs.
# -a <apps>        Comma-separated store IDs or mobile slugs to refresh explicitly
#                  (example: android/xx.yy.zz,iphone/aa.bb.cc,mobile/app.slug).
#                  If omitted, all mobile wallets are refreshed.
# -g <githubToken> GitHub token required for desktop/hardware refresh tasks.
#                  If omitted, desktop/hardware refresh is skipped.
#
# Environment:
# PPQ_API_KEY      Optional key that enables the feature verification step.

set -e    # Enable strict mode: stop on any error

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/refresh-ui.sh
source "$ROOT/scripts/refresh-ui.sh"

# run this using Docker:
# docker run --rm -v$PWD:/mnt --workdir=/mnt node bash ./refresh.sh -k $LN_KEY

while getopts k:a:g: option
do
  case "${option}"
  in
    k) btcPayKey=${OPTARG};;   # the api key for the BtcPayServer
    a) apps=${OPTARG};;        # android/xx.yy.zz, iphone/aa.bb.cc, mobile/slug
    g) githubToken=${OPTARG};; # GitHub token for Desktop and Hardware refresh

  esac
done

print_refresh_section "Installing node packages"
if ! npm install; then
  echo "ERROR: Failed to install node packages. Is npm installed?"
  exit 1
fi

print_refresh_section "Archiving nobtc/nowallet apps"
if ! node scripts/archiveNobtcNowallet.mjs; then
  echo "ERROR: Failed to archive nobtc/nowallet apps"
  exit 1
fi

print_refresh_section "Updating from Google and Apple stores"
if ! node \
  --input-type=module \
  --eval "import refreshApps from \"./refreshApps.mjs\"; refreshApps.refresh(false, \"$apps\")"; then
  echo "ERROR: Failed to update apps from Google and Apple"
  exit 1
fi

if [ -z "$apps" ]; then
  print_refresh_section "Generating app IDs (defunct parser)"
  if ! apps=$(node scripts/defunctParser.js); then
    echo "ERROR: Failed to generate app IDs (defunctParser.js)"
    exit 1
  fi
  if [ -n "$apps" ]; then
    print_refresh_section "Refreshing apps with generated IDs"
    if ! node \
      --input-type=module \
      --eval "import refreshApps from \"./refreshApps.mjs\"; refreshApps.refresh(true, \"$apps\")"; then
      echo "ERROR: Failed to refresh apps with generated IDs"
      exit 1
    fi
  fi
fi

print_refresh_section "F-Droid check (Android source-available alternativeStores)"
if ! node scripts/fdroidSourceAvailableCheck.mjs; then
  echo "ERROR: Failed to run fdroidSourceAvailableCheck.mjs"
  exit 1
fi

print_refresh_section "Sync bitcoinOrgId from bitcoin.org _wallets"
if ! node scripts/syncBitcoinOrgId.mjs; then
  echo "ERROR: Failed to run syncBitcoinOrgId.mjs"
  exit 1
fi

print_refresh_section "Refreshing Desktop apps"
if [ -n "$githubToken" ]; then
  if ! node scripts/refreshDesktop.mjs -r -g "$githubToken"; then
    echo "ERROR: Failed to refresh Desktop apps"
    exit 1
  fi
else
  print_refresh_note "Skipped — no GitHub token (-g) provided"
fi

print_refresh_section "Refreshing Hardware apps"
if [ -n "$githubToken" ]; then
  if ! node scripts/refreshHardware.mjs -g "$githubToken"; then
    echo "ERROR: Failed to refresh Hardware apps"
    exit 1
  fi
else
  print_refresh_note "Skipped — no GitHub token (-g) provided"
fi

print_refresh_section "Refreshing donations page from BTCPay"
if ! node refreshDonations.mjs $btcPayKey; then
  echo "ERROR: Failed to refresh donations page from BTCPay"
  exit 1
fi

print_refresh_section "Update and resize images and icons"
if [ "$( git diff --name-only | grep 'wIcons' )" != "" ]; then
  if ! ./updateImages.sh; then
    echo "ERROR: Failed to update images (updateImages.sh)"
    exit 1
  fi
else
  print_refresh_note "Skipped — no wIcons changes in working tree"
fi

print_refresh_section "Post-refresh checks and reports (refreshResults.sh)"
if ! ./refreshResults.sh; then
    echo "ERROR: Failed to execute refreshResults.sh"
    exit 1
fi

print_refresh_section "Generate allOpinions.json from Nostr"
if ! node ./scripts/compileAllOpinions.js; then
  echo "ERROR: Failed to generate allOpinions.json from Nostr"
  exit 1
fi

print_refresh_section "Backup Nostr verification events"
if ! node ./scripts/nostr/backupNostrVerificationEvents.mjs; then
  echo "ERROR: Failed to backup Nostr verification events"
  exit 1
fi

print_refresh_section "Check backup Nostr events on relays"
if ! node ./scripts/nostr/checkBackupEventsOnRelays.mjs; then
  echo "ERROR: Failed to check backup Nostr events on relays"
  exit 1
fi

print_refresh_section "Blossom spam and orphaned files check"
if ! node ./scripts/verifications/checkBlossomSpam.mjs; then
  echo "ERROR: Failed to check for Blossom Spam / Orphaned Files"
  exit 1
fi

print_refresh_section "Generate Twitter cards"
if ! node scripts/twitterCardGen.mjs; then
  echo "ERROR: Failed to generate Twitter cards"
  exit 1
fi

print_refresh_section "Feature verification (LLM)"
if [ -n "$PPQ_API_KEY" ]; then
  print_refresh_note "PPQ_API_KEY detected — running featureVerifier"
  if ! node scripts/featureVerifier.mjs --fetch --verify --apply; then
    echo "WARNING: featureVerifier failed, continuing..."
  fi
else
  print_refresh_note "Skipped — PPQ_API_KEY not set (export PPQ_API_KEY=sk-...)"
fi

echo
echo
echo "Done! I'm just a stupid bot! Please carefully review my changes before committing or publishing!"
