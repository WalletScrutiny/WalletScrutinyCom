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
