echo "Source available wallets with version changes (need analysis):"
for f in $( git diff -G'version' --name-only --diff-filter=d ); do
  if grep -qE "^verdict: sourceavailable|^  verdict: sourceavailable" $f; then
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

echo "Duplicate wsIds in mobile:"
diff <( rgrep '^wsId: ' _mobile/ | sed 's/.*wsId: //g' | sed -e '/^$/d' | sort ) <( rgrep '^wsId: ' _mobile/ | sed 's/.*wsId: //g' | sed -e '/^$/d' | sort -u )

function moreSince {
  echo $( git diff @{$1} | grep '^-users: ' | wc -l )
}

echo "HWWs that are unreleased/defunct"
grep -l "meta: defunct" `grep -l "verdict: unreleased" _hardware/*`

echo "Apps that now have more users ..."
echo "... than yesterday:  $( moreSince 'one.days.ago' )"
echo "... than last week:  $( moreSince 'one.weeks.ago' )"
echo "... than last month: $( moreSince 'one.months.ago' )"

# List missing icons (android/iphone: nested icon: in _mobile/*.md)
collect_mobile_icons() {
  local platform=$1
  awk -v plat="$platform" '
    $0 ~ "^" plat ":" { in_plat = 1; next }
    /^[a-zA-Z]/ { in_plat = 0 }
    in_plat && /^  icon: / { sub(/^  icon: /, ""); print }
  ' _mobile/*.md 2>/dev/null | sed 's/\.png$//;s/\.jpg$//;s/\.jpeg$//' | sort -u
}

for platform in hardware bearer desktop android iphone; do
  export platform=$platform
  if [ "$platform" = "android" ] || [ "$platform" = "iphone" ]; then
    referenced=$(collect_mobile_icons "$platform")
  else
    referenced=$(grep -l 'icon: .' _$platform/* 2>/dev/null \
      | awk -F '/' '{print $2}' \
      | sed 's/.md$//g' \
      | sort)
  fi
  diff \
    <(echo "$referenced") \
    <(ls -1 images/wIcons/$platform/tiny/ 2>/dev/null \
      | sed 's/.png$//g' \
      | sed 's/.jpg$//g' \
      | sort ) \
    | grep '<' \
    | awk '{print $2}' \
    | xargs -r -n 1 bash -c 'echo -e "No icon found for $platform $0\n$( git log --summary | grep $0 )"' \
    | grep -v bash
done

# show what probably needs re-analysis
node scripts/findNeedsRB.mjs
