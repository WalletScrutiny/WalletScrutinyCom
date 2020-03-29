#!/bin/sh

# run this using Docker:
# docker run --rm -v$PWD:/mnt --workdir=/mnt node bash ./refresh.sh -k $LN_KEY -n "com.binance.dev"

while getopts k:n:s: option
do
  case "${option}"
  in
    k) btcPayKey=${OPTARG};;
    n) apps=${OPTARG};;
    s) skipGP=${OPTARG};;
  esac
done

echo "Running with parameters key=$btcPayKey and newApps=$apps and skipGP=$skipGP."
echo "adding wallets from command line parameters: $apps"

echo "installing missing stuff"
npm install google-play-scraper dateformat js-yaml sleep btcpay

for appId in $apps; do
  path=_posts/2019-12-20-$appId.md
  if [ ! -f $path ]; then
    echo Adding skeleton for app $appId
    node refreshNewApp.js $appId
  else
    echo $appId already present in $path
  fi
done

echo "Refreshing donations page ..."
node refreshDonations.js $btcPayKey &
if [ "$skipGP" != "true" ]; then
  echo "Updating from Google ..."
  node refreshAppsFromGoogle.js
fi

wait
echo "Done! I'm just a stupid bot! Please carefully review my changes before committing or publishing!"

