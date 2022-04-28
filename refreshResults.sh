echo "Reproducible wallets with version changes (need analysis):"
for f in $( git diff -G'version' --name-only ); do
  if grep -q "^verdict: reproducible" $f; then
    echo $f changed to $( grep '^version' $f )
  fi
done

# Run migrate script just in case. It also makes some basic checks
node scripts/migrate.js 

echo "Diff minus the boring stuff:"
git diff --word-diff=color | grep -v "latest\|ratings\|reviews\|---\|@\|index\|^diff\|Binary\|apkVersionName\|size\|updated\|^score:\|^rating\|^version\|^review\|^stars\|^users" | grep "+++\|"

echo "Duplicate wsIds android:"
diff <( rgrep '^wsId: ' _android/ | sed 's/.*wsId: //g' | sed -e '/^$/d' | sort ) <( rgrep '^wsId: ' _android/ | sed 's/.*wsId: //g' | sed -e '/^$/d' | sort -u )
echo "Duplicate wsIds iphone:"
diff <( rgrep '^wsId: ' _iphone/ | sed 's/.*wsId: //g' | sed -e '/^$/d' | sort ) <( rgrep '^wsId: ' _iphone/ | sed 's/.*wsId: //g' | sed -e '/^$/d' | sort -u )
echo "wsId only present in Android or only in iPhone:"
diff <( rgrep '^wsId: ' _android/ | sed 's/.*wsId: //g' | sed -e '/^$/d' | sort -u ) <( rgrep '^wsId: ' _iphone/ | sed 's/.*wsId: //g' | sed -e '/^$/d' | sort -u ) | grep "<\|>" | sed 's/</Android:/' | sed 's/>/iPhone:/' | sort

function moreSince {
  echo $( git diff @{$1} | grep '^-users: ' | wc -l )
}

echo "HWWs that are unreleased/defunct"
grep -l "meta: defunct" `grep -l "verdict: unreleased" _hardware/*`

echo "Apps that now have more users ..."
echo "... than yesterday:  $( moreSince 'one.days.ago' )"
echo "... than last week:  $( moreSince 'one.weeks.ago' )"
echo "... than last month: $( moreSince 'one.months.ago' )"

# poking around to verify that script runs actually do update all relevant apps.
# as of today it all looks correct, with only fewusers apps not changing
# in five weeks, while the last structural change affecting all android/iphone
# was during the week prior.
function unchangedSince {
  echo "Unchanged since $1: " $( ( grep -l "meta: ok" `git diff --name-only @{$1} _android/ _iphone/ | grep ".md"` ; grep -l "meta: ok" `find _android/ _iphone/ | grep ".md"` ) | sort | uniq -u | wc -l )
}
unchangedSince 'one.days.ago'
unchangedSince 'four.days.ago'
unchangedSince 'two.weeks.ago'
unchangedSince 'four.weeks.ago'
unchangedSince 'five.weeks.ago'
unchangedSince 'six.weeks.ago'
