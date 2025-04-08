#!/bin/bash

# run this using Docker:
# docker run --rm -v$PWD:/mnt --workdir=/mnt node bash ./refresh.sh -k $LN_KEY

while getopts k:a: option
do
  case "${option}"
  in
    k) btcPayKey=${OPTARG};;   # the api key for the BtcPayServer
    a) apps=${OPTARG};;        # comma separated list of app IDs
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
node ./scripts/verifications/backupNostrVerificationEvents.mjs

echo
echo
echo "Done! I'm just a stupid bot! Please carefully review my changes before committing or publishing!"
