revisions=$(git log --oneline --after=2019-11-24 --no-merges --reverse | sed 's/ .*//g')
total=$( echo $revisions | wc -w )
logger "parsing $total revisions for historic application data"
n=0

echo 'DROP TABLE IF EXISTS appStates;' > /tmp/WS_SQL.SQL
echo 'CREATE TABLE appStates (appId, title, date, users, updated, stars, ratings, reviews, size, verdict, revision);' >> /tmp/WS_SQL.SQL

echo "BEGIN TRANSACTION;" >> /tmp/WS_SQL.SQL
for r in $revisions
do
  n=$(( $n + 1 ))
  echo "$r: $n / $total"
  git checkout $r 2> /dev/null
  date=$(git show -s --format=%ct)
  for f in $( git show --pretty="" --name-only | grep "\.md$" | grep "_android/\|_posts/" )
  do
    if [ ! -f $f ] || [ ! -s $f ]; then break; fi
    appId="NULL";users="NULL";updated="NULL";stars="NULL";ratings="NULL";reviews="NULL";size="NULL";title="NULL";verdict="NULL"
    while read -r line
    do
      if [[ $line == *+(Varies with device|undefined)* ]]; then continue; fi
      if [[ $line == "appId: "* ]]; then appId=${line#*: }; fi
      if [[ $line == "title: "* ]]; then title=${line#*: }; fi
      if [[ $line == "users: "* ]]; then users=${line#*: }; fi
      if [[ $line == "updated: "* ]]; then updated=$(date -d"${line#*: }" "+%s" --utc || continue); fi
      if [[ $line == "stars: "* ]]; then stars=${line#*: }; fi
      if [[ $line == "ratings: "* ]]; then ratings=${line#*: }; fi
      if [[ $line == "reviews: "* ]]; then reviews=${line#*: }; fi
      if [[ $line == "size: "* ]]; then size="$(echo ${line#*: } | sed 's/M//g')"; fi # make size a number and ignore that one wallet that's size is 174k
      if [[ $line == "verdict: "* ]]; then verdict=${line#*: };verdict=${verdict% #*}; break; fi
    done < $f
    if [ ${#appId} -lt 5 ] || [ "$verdict" == "NULL" ] || [ "$verdict" == "" ]
    then
      echo "Error parsing. Check $r:$f: $(git show $r:$f | head -n20)"
    else
      sql="INSERT INTO appStates (appId, title, date, users, updated, stars, \
          ratings, reviews, size, verdict, revision) VALUES (\"$appId\", $title, \"$date\", $users, \
          \"$updated\", $stars, $ratings, $reviews, \"$size\", \"$verdict\", \
          \"$r\");"
      echo $sql >> /tmp/WS_SQL.SQL
    fi
  done
done
git checkout master
echo "COMMIT;" >> /tmp/WS_SQL.SQL
dataPoints=$( cat /tmp/WS_SQL.SQL | wc -l ); dataPoints=$(( $dataPoints - 4 ))
logger "Recorded $dataPoints data points."
sqlite3 /tmp/revisions.sqlite ".read /tmp/WS_SQL.SQL"
