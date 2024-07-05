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


echo "installing missing stuff"
npm install

echo "Updating from Google and Apple $apps ..."
node \
  --input-type=module \
  --eval "import refreshApps from \"./refreshApps.mjs\"; refreshApps.refresh(false, \"$apps\")"

if [ -z "$apps" ]; then
  echo "Running script to generate app IDs..."
  wait
  apps=$(node scripts/defunctParser.js) 
  if [ -n "$apps" ]; then
    node \
      --input-type=module \
      --eval "import refreshApps from \"./refreshApps.mjs\"; refreshApps.refresh(true, \"$apps\")"
  fi
fi

echo "Refreshing donations page ..."
node refreshDonations.mjs $btcPayKey
wait

if [ "$( git diff --name-only | grep 'wIcons' )" != "" ]; then
  ./updateImages.sh
fi
node scripts/twitterCardGen.mjs

wait

echo
echo
echo "Done! I'm just a stupid bot! Please carefully review my changes before committing or publishing!"
./refreshResults.sh
node ./scripts/compileAllOpinions.js
