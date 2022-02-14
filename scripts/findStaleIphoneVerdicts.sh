#!/bin/bash

wsids=$( rgrep '^wsId:' _iphone/ | sed 's/.*wsId: //g' | sed -e '/^$/d' | sort -u )
for wsid in $wsids ; do
  androidFiles=$( rgrep -l "wsId: $wsid" _android/ )
  iphoneFiles=$( rgrep -l "wsId: $wsid" _iphone/ )
  androidVerdict=$( grep "^verdict: [A-Za-z]" "$androidFiles" 2> /dev/null | sed 's/verdict: //g' )
  iphoneVerdict=$( grep "^verdict: [A-Za-z]" "$iphoneFiles" 2> /dev/null | sed 's/verdict: //g' )
  if [ "$androidVerdict" != "$iphoneVerdict" ] && [ "$androidVerdict $iphoneVerdict" != "reproducible nonverifiable" ] ; then
    echo
    echo $wsid
    echo "$androidFiles      $androidVerdict"
    echo "$iphoneFiles       $iphoneVerdict"
  fi
done
