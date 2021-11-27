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
npm install google-play-scraper app-store-scraper dateformat js-yaml sleep btcpay

# the refresh script is fuzzy and yields "unnatural" results, were apps have a 0
# star rating or drop from 4000 to 43 ratings between runs. We detect those and
# ask Google again:
rm /tmp/unnatural.txt 2> /dev/null
echo "Updating from Google and Apple ..." &
node -e 'require("./refreshApps").refresh()'

function checkUnnaturals {
  if [[ -f "/tmp/unnatural.txt" ]];then
    echo "
For $( wc -w <<< $( cat /tmp/unnatural.txt) ) apps Google returned invalid data. Requesting again ..."
    apps=$( cat /tmp/unnatural.txt )
    rm /tmp/unnatural.txt 2> /dev/null
    files=_android/${apps// /.md _android\/}.md
    git checkout HEAD -- $files
    node refreshNewAndroidApps.js $apps
  fi
}

for c in $( seq 1 30 ); do
  checkUnnaturals
done

if [[ -f "/tmp/unnatural.txt" ]];then
  apps=$( cat /tmp/unnatural.txt )
  rm /tmp/unnatural.txt 2> /dev/null
  files=_android/${apps// /.md _android\/}.md
  git checkout HEAD -- $files
  echo "
The following apps failed to update:
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
git diff --word-diff |  grep -v "latest\|ratings\|reviews\|---\|@\|index\|^diff\|Binary\|apkVersionName\|size\|updated\|^score:\|^rating\|^version\|^review\|^stars\|^users" | grep "+++\|"

echo "Duplicate wsIds android:"
diff <( rgrep '^wsId: ' _android/ | sed 's/.*wsId: //g' | sed -e '/^$/d' | sort ) <( rgrep '^wsId: ' _android/ | sed 's/.*wsId: //g' | sed -e '/^$/d' | sort -u )
echo "Duplicate wsIds iphone:"
diff <( rgrep '^wsId: ' _iphone/ | sed 's/.*wsId: //g' | sed -e '/^$/d' | sort ) <( rgrep '^wsId: ' _iphone/ | sed 's/.*wsId: //g' | sed -e '/^$/d' | sort -u )
echo "wsId only present in Android or only in iPhone:"
diff <( rgrep '^wsId: ' _android/ | sed 's/.*wsId: //g' | sed -e '/^$/d' | sort -u ) <( rgrep '^wsId: ' _iphone/ | sed 's/.*wsId: //g' | sed -e '/^$/d' | sort -u ) | grep "<\|>" | sed 's/</Android:/' | sed 's/>/iPhone:/' | sort

function moreSince {
  echo $( git diff @{$1} | grep '^-users: ' | wc -l )
}

echo "Apps that now have more users ..."
echo "... than yesterday:  $( moreSince 'one.days.ago' )"
echo "... than last week:  $( moreSince 'one.weeks.ago' )"
echo "... than last month: $( moreSince 'one.months.ago' )"
