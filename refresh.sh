#!/bin/bash

# run this using Docker:
# docker run --rm -v$PWD:/mnt --workdir=/mnt node bash ./refresh.sh -k $LN_KEY

while getopts k: option
do
  case "${option}"
  in
    k) btcPayKey=${OPTARG};;
  esac
done

echo "installing missing stuff"
npm install

echo "Updating from Google and Apple ..."
node -e 'require("./refreshApps").refresh()'

echo "Refreshing donations page ..."
node refreshDonations.js $btcPayKey

wait

if [ "$( git diff --name-only | grep 'wIcons' )" != "" ]; then
  ./updateImages.sh
fi

wait

echo
echo
echo "Done! I'm just a stupid bot! Please carefully review my changes before committing or publishing!"
./refreshResults.sh
