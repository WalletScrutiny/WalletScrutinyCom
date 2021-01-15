#!/bin/sh

# run this using Docker:
# docker run --rm -v$PWD:/mnt --workdir=/mnt node bash ./refresh.sh -k $LN_KEY -a "com.binance.dev com.binance.dev" -i "12345 12345" -s

while getopts k:a:i:s: option
do
  case "${option}"
  in
    k) btcPayKey=${OPTARG};;
    a) aapps=${OPTARG};;
    i) iapps=${OPTARG};;
    s) skip=${OPTARG};;
  esac
done

echo "Running with parameters"
echo "  - new Android Apps: $aapps"
echo "  - new iPhone Apps: $iapps"
echo "  - skip refresh: $skip"

echo "installing missing stuff"
npm install google-play-scraper app-store-scraper dateformat js-yaml sleep btcpay

node refreshNewAndroidApps.js $aapps
node refreshNewIphoneApps.js $iapps

wait

echo "Refreshing donations page ..."
node refreshDonations.js $btcPayKey &
if [ "$skipGP" != "true" ]; then
  echo "Updating from Google and Apple ..." &
  node refreshAppsFromGoogle.js &
  node refreshAppsFromApple.js
fi

wait

echo
echo
echo "Done! I'm just a stupid bot! Please carefully review my changes before committing or publishing!"
echo "Reproducible wallets with version changes (need analysis):"
for f in $( git diff -G'apkVersionName' --name-only ); do if grep -q "verdict: reproducible" $f; then echo $f changed to $( grep apkVersionName $f ); fi; done
echo "WIP apps with +1000 downloads (need analysis):"
for f in $( git diff -G'verdict: fewusers' --name-only ); do if grep -q "users: 1000" $f; then echo $f has 1000 downloads; fi; done
echo "Files with changed name"
for f in $( git diff -G'name:' --name-only ); do echo $f changed $( grep "name: " $f ); done
echo "Donations changed?"
git diff _includes/donationSummary.html
