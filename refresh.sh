#!/bin/bash

# run this using Docker:
# docker run --rm -v$PWD:/mnt --workdir=/mnt node bash ./refresh.sh -k $LN_KEY

while getopts k:a:g: option
do
  case "${option}"
  in
    k) btcPayKey=${OPTARG};;   # the api key for the BtcPayServer
    a) apps=${OPTARG};;        # comma separated list of app IDs
    g) githubToken=${OPTARG};; # GitHub token for Desktop and Hardware refresh

  esac
done

echo " * Installing node packages..."
npm install

echo " * Updating from Google and Apple $apps ..."
node \
  --input-type=module \
  --eval "import refreshApps from \"./refreshApps.mjs\"; refreshApps.refresh(false, \"$apps\")"

if [ -z "$apps" ]; then
  echo " * Running script to generate app IDs..."
  wait
  apps=$(node scripts/defunctParser.js) 
  if [ -n "$apps" ]; then
    node \
      --input-type=module \
      --eval "import refreshApps from \"./refreshApps.mjs\"; refreshApps.refresh(true, \"$apps\")"
  fi
fi

echo " * Refreshing Desktop apps..."
if [ -n "$githubToken" ]; then
  node scripts/refreshDesktop.mjs -r -g "$githubToken"
else
  echo "   ⚠️  Skipping Desktop refresh — no GitHub token (-g) provided"
fi

echo " * Refreshing Hardware apps..."
if [ -n "$githubToken" ]; then
  node scripts/refreshHardware.mjs -g "$githubToken"
else
  echo "   ⚠️  Skipping Hardware refresh — no GitHub token (-g) provided"
fi

echo " * Refreshing donations page from BTCPay..."
node refreshDonations.mjs $btcPayKey
wait

echo " * Update/resize images and icons..."
if [ "$( git diff --name-only | grep 'wIcons' )" != "" ]; then
  ./updateImages.sh
fi

echo " * Generating Twitter cards..."
node scripts/twitterCardGen.mjs

wait

echo " * Generating verdict pills..."
./scripts/pillGen.sh
wait

echo " * Calling refreshResults.sh..."
./refreshResults.sh

echo " * Generate allOpinions.json from Nostr..."
node ./scripts/compileAllOpinions.js

echo " * Doing backup of Verifications Nostr events..."
node ./scripts/nostr/backupNostrVerificationEvents.mjs

echo
echo
echo "Done! I'm just a stupid bot! Please carefully review my changes before committing or publishing!"
