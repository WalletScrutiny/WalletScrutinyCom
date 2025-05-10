echo "Source available wallets with version changes (need analysis):"
for f in $( git diff -G'version' --name-only ); do
  if grep -q "^verdict: sourceavailable" $f; then
    echo $f changed to $( grep '^version' $f )
  fi
done

# Run migrate script just in case. It also makes some basic checks
node scripts/migrate.mjs 

echo "Diff minus the boring stuff:"
git diff --name-only | while read file; do
  # Check if the file exists in the working tree before trying to diff it
  if git ls-files --error-unmatch "$file" &>/dev/null || [ -f "$file" ]; then
    # Get the diff for this file only and filter boring stuff
    filtered_diff=$(git diff -U0 --word-diff=color -- "$file" 2>/dev/null | grep -v "latest\|ratings\|reviews\|@\|index\|Binary\|apkVersionName\|updated\|^score:\|^rating\|^version\|^review\|^stars\|^users")
    
    # Extract actual content without headers
    content=$(echo "$filtered_diff" | grep -v "^....diff\|^....--- \|^....+++ \|^@@\|^$" | grep -v "^\s*$")
    
    # Only show files with actual content changes
    if [ -n "$content" ]; then
      # Format the output as requested - filename as a comment followed by content
      echo "# $file:"
      echo "$content"
      echo ""
    fi
  else
    echo "# $file: (File was added, deleted or renamed)"
  fi
done

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

# List missing icons
for platform in hardware bearer desktop android iphone; do
  export platform=$platform
  diff \
    <(grep -l 'icon: .' _$platform/* \
      | awk -F '/' '{print $2}' \
      | sed 's/.md$//g' \
      | sort ) \
    <(ls -1 images/wIcons/$platform/tiny/ \
      | sed 's/.png$//g' \
      | sed 's/.jpg$//g' \
      | sort ) \
    | grep '<' \
    | awk '{print $2}' \
    | xargs -n 1 bash -c 'echo -e "No icon found for $platform $0\n$( git log --summary | grep $0 )"' \
    | grep -v bash
done

# show what probably needs re-analysis
node scripts/findNeedsRB.mjs
