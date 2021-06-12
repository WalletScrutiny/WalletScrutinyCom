#!/bin/sh

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

echo "Updating from Google and Apple ..." &
node refreshApps.js

echo "Refreshing donations page ..."
node refreshDonations.js $btcPayKey &

wait

echo
echo
echo "Done! I'm just a stupid bot! Please carefully review my changes before committing or publishing!"
echo "Reproducible wallets with version changes (need analysis):"
for f in $( git diff -G'version' --name-only ); do if grep -q "^verdict: reproducible" $f; then echo $f changed to $( grep version $f ); fi; done
echo "WIP apps with +1000 downloads (need analysis):"
for f in $( git diff -G'verdict: fewusers' --name-only ); do if grep -q "users: 1000" $f; then echo $f has 1000 downloads; fi; done
echo "Files with changed name"
for f in $( git diff -G'name:' --name-only ); do echo $f changed $( grep "name: " $f ); done
echo "Donations changed?"
git diff _includes/donationSummary.html
