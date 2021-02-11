#!/bin/bash

mkdir images/wallet_icons/{android,iphone}/{small,tiny}/ 2> /dev/null
rm /tmp/revert.txt

resizeDeterministically() {
  filename=$1
  source=$2/$filename
  target=$3/$filename
  size=$4
  tmp=/tmp/$size$filename
  # convert source to target size but to a temporary file, first
  # copy temp file to target if pixels actually changed in the resized file
  # delete temp file
  convert -background none $source -resize ${size}x $tmp
  if $( compare -metric AE $tmp $target NULL: ); then
    echo $source >> /tmp/revert.txt
  else
    cp -f $tmp $target
  fi
  rm $tmp
}

export -f resizeDeterministically

files=$( ls images/wallet_icons/android/*.* )
parallel resizeDeterministically {/} images/wallet_icons/android images/wallet_icons/android/small 100 ::: $files
parallel resizeDeterministically {/} images/wallet_icons/android images/wallet_icons/android/tiny 25 ::: $files
files=$( ls images/wallet_icons/iphone/*.* )
parallel resizeDeterministically {/} images/wallet_icons/iphone images/wallet_icons/iphone/small 100 ::: $files
parallel resizeDeterministically {/} images/wallet_icons/iphone images/wallet_icons/iphone/tiny 25 ::: $files
files=$( ls images/wallet_icons/fdroid/*.* )
parallel resizeDeterministically {/} images/wallet_icons/fdroid images/wallet_icons/fdroid/small 100 ::: $files
parallel resizeDeterministically {/} images/wallet_icons/fdroid images/wallet_icons/fdroid/tiny 25 ::: $files

git checkout HEAD $( cat /tmp/revert.txt | paste -sd ' ' )
