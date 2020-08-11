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

echo "Running with parameters newApps=$apps and skipGP=$skipGP."
echo "adding wallets from command line parameters: $apps"

echo "installing missing stuff"
npm install google-play-scraper dateformat js-yaml sleep btcpay

for appId in $apps; do
  path=_android/$appId.md
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
echo "Reproducible wallets with version changes (need analysis):"
for f in $( git diff -G'apkVersionName' --name-only ); do if grep -q "verdict: reproducible" $f; then echo $f changed to $( grep apkVersionName $f ); fi; done
echo "WIP apps with +1000 downloads (need analysis):"
for f in $( git diff -G'verdict: fewusers' --name-only ); do if grep -q "users: 1000" $f; then echo $f has 1000 downloads; fi; done
echo "Files with changed name"
for f in $( git diff -G'name:' --name-only ); do echo $f changed $( grep "name: " $f ); done
echo "Donations changed?"
git diff _includes/donationSummary.html
