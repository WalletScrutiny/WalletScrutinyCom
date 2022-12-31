#!/bin/bash

# run this using Docker:
# docker run --rm -v$PWD:/mnt --workdir=/mnt node bash ./refresh.sh -k $LN_KEY

while getopts k:s: option
do
  case "${option}"
  in
    k) btcPayKey=${OPTARG};;
    s) skip=${OPTARG};;
  esac
done

echo "installing missing stuff"
npm install

echo "Updating from Google and Apple using skip $skip ..."
node -e "require(\"./refreshApps\").refresh($skip)"

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
node ./scripts/compileAllOpinions.js
