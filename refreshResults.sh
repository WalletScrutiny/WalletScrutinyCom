ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck source=scripts/refresh-ui.sh
source "$ROOT/scripts/refresh-ui.sh"

print_refresh_subsection "Source-available wallets with version changes"
for f in $( git diff -G'version' --name-only --diff-filter=d ); do
  if grep -qE "^verdict: sourceavailable|^  verdict: sourceavailable" $f; then
    echo $f changed to $( grep '^version' $f )
  fi
done

print_refresh_subsection "Migrate and basic checks"
node scripts/migrate.mjs

print_refresh_subsection "Diff minus boring metadata"
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

print_refresh_subsection "Duplicate wsIds in mobile"
diff <( rgrep '^wsId: ' _mobile/ | sed 's/.*wsId: //g' | sed -e '/^$/d' | sort ) <( rgrep '^wsId: ' _mobile/ | sed 's/.*wsId: //g' | sed -e '/^$/d' | sort -u )

print_refresh_subsection "Unreleased/defunct hardware wallets"
grep -l "meta: defunct" `grep -l "verdict: unreleased" _hardware/*`

function moreSince {
  echo $( git diff @{$1} | grep '^-users: ' | wc -l )
}

print_refresh_subsection "Apps with more users than before"
echo "... than yesterday:  $( moreSince 'one.days.ago' )"
echo "... than last week:  $( moreSince 'one.weeks.ago' )"
echo "... than last month: $( moreSince 'one.months.ago' )"

# List missing icons (android/iphone: nested icon: in _mobile/*.md).
# Icons are compared by stem: they were png/jpg once and are webp now.
strip_icon_ext() {
  sed -E 's/\.(webp|png|jpe?g)$//'
}
collect_mobile_icons() {
  local platform=$1
  awk -v plat="$platform" '
    $0 ~ "^" plat ":" { in_plat = 1; next }
    /^[a-zA-Z]/ { in_plat = 0 }
    in_plat && /^  icon: / { sub(/^  icon: /, ""); print }
  ' _mobile/*.md 2>/dev/null | strip_icon_ext | sort -u
}

print_refresh_subsection "Missing wallet icons"
missingIcons=$(
  for platform in hardware bearer desktop android iphone; do
    if [ "$platform" = "android" ] || [ "$platform" = "iphone" ]; then
      referenced=$(collect_mobile_icons "$platform")
    else
      referenced=$(grep -h '^icon: .' _$platform/* 2>/dev/null | sed 's/^icon: //' | strip_icon_ext | sort -u)
    fi
    comm -23 \
      <(echo "$referenced") \
      <(ls -1 images/wIcons/$platform/tiny/ 2>/dev/null | strip_icon_ext | sort -u) \
      | sed "s|^|$platform |"
  done
)
if [ -n "$missingIcons" ]; then
  # One history walk over the icon folders for all missing icons. Running a full
  # `git log --summary` per missing icon took seconds each and printed renameLimit warnings.
  iconLog=$(mktemp)
  git log --no-renames --summary --format='%h %ad %s' --date=short -- images/wIcons images/wallet_icons > "$iconLog"
  while read -r platform name; do
    echo "No icon found for $platform $name"
    awk -v platform="$platform" -v name="$name" '
      /^[0-9a-f]+ [0-9]+-[0-9]+-[0-9]+ / { header = $0; next }
      /^ (create|delete) mode / {
        n = split($NF, parts, "/")
        if (parts[n-1] != platform && parts[n-2] != platform) next
        stem = parts[n]
        sub(/\.[^.]+$/, "", stem)
        if (stem != name) next
        if (header != "") { print "  " header; header = "" }
        print
      }' "$iconLog"
  done <<< "$missingIcons"
  rm -f "$iconLog"
fi

print_refresh_subsection "Reviews that probably need re-analysis"
node scripts/findNeedsRB.mjs
