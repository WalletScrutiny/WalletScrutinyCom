#!/bin/bash

# run this using Docker:
# docker run --rm -v$PWD:/mnt --workdir=/mnt node bash ./refresh.sh -k $LN_KEY

markDefunct=false
while getopts k:a:d: option
do
  case "${option}"
  in
    k) btcPayKey=${OPTARG};;   # the api key for the BtcPayServer
    a) apps=${OPTARG};;        # comma separated list of app IDs
    d) markDefunct=${OPTARG};; # if -d true is set, apps that are not available on the store will get marked defunct
  esac
done

echo "installing missing stuff"
npm install

echo "Updating from Google and Apple $apps ..."
echo "markDefunct is $markDefunct."
node \
  --input-type=module \
  --eval "import refreshApps from \"./refreshApps.mjs\"; refreshApps.refresh($markDefunct, \"$apps\")"

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
