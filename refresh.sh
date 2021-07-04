#!/bin/bash

# run this using Docker:
# docker run --rm -v$PWD:/mnt --workdir=/mnt node bash ./refresh.sh -k $LN_KEY

while getopts k:a:i:s: option
do
  case "${option}"
  in
    k) btcPayKey=${OPTARG};;
  esac
done

echo "installing missing stuff"
npm install google-play-scraper app-store-scraper dateformat js-yaml sleep btcpay

# the refresh script is fuzzy and yields "unnatural" results, were apps have a 0
# star rating or drop from 4000 to 43 ratings between runs. We detect those and
# ask Google again:
rm /tmp/unnatural.txt 2> /dev/null
echo "Updating from Google and Apple ..." &
node refreshApps.js
if [[ -f "/tmp/unnatural.txt" ]];then
  apps=$( cat /tmp/unnatural.txt )
  rm /tmp/unnatural.txt 2> /dev/null
  node refreshNewAndroidApps.js $apps
fi
if [[ -f "/tmp/unnatural.txt" ]];then
  apps=$( cat /tmp/unnatural.txt )
  rm /tmp/unnatural.txt 2> /dev/null
  node refreshNewAndroidApps.js $apps
fi
if [[ -f "/tmp/unnatural.txt" ]];then
  apps=$( cat /tmp/unnatural.txt )
  rm /tmp/unnatural.txt 2> /dev/null
  echo "The following apps were updated in an unnatural way:
$apps"
fi

echo "Refreshing donations page ..."
node refreshDonations.js $btcPayKey &

wait

if [ "$( git diff --name-only | grep 'wallet_icons' )" != "" ]; then
  ./updateImages.sh
fi

wait

echo
echo
echo "Done! I'm just a stupid bot! Please carefully review my changes before committing or publishing!"
echo "Reproducible wallets with version changes (need analysis):"
for f in $( git diff -G'version' --name-only ); do
  if grep -q "^verdict: reproducible" $f; then
    echo $f changed to $( grep '^version' $f )
  fi
done

echo "Diff minus the boring stuff:"
git diff --word-diff |  grep -v "latest\|ratings\|reviews\|---\|@\|index\|^diff\|Binary\|apkVersionName\|size\|updated\|^score:\|^rating\|^version\|^review\|^stars" | grep "+++\|"
