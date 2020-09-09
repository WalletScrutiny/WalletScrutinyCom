#!/bin/bash

mkdir images/wallet_icons/{android,linux}/{tiny,small}/ 2> /dev/null

resizeDeterministically() {
  filename=$1
  source=$2/$filename
  target=$3/$filename
  size=$4
  tmp=/tmp/$filename
  convert -quiet -background none $source -resize ${size}x $tmp \
    && compare -metric AE $tmp $target NULL: || cp -f $tmp $target
  rm $tmp
}

export -f resizeDeterministically

for baseFolder in images/wallet_icons/{android,linux}; do
  files=$( ls $baseFolder/*.* )
  parallel resizeDeterministically {/} $baseFolder $baseFolder/small 100 ::: $files
  parallel resizeDeterministically {/} $baseFolder $baseFolder/tiny 25 ::: $files
done
resizeDeterministically hacker.jpg resSources images 300
echo
