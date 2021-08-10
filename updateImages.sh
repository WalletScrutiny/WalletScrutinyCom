#!/bin/bash

mkdir images/wallet_icons/{android,iphone,hardware}/{small,tiny}/ 2> /dev/null
rm /tmp/revert.txt 2> /dev/null

resizeDeterministically() {
  filename=$1
  source=$2/$filename
  target=$3/$filename
  size=$4
  tmp=/tmp/$size$filename
  # convert source to target size but to a temporary file, first
  # copy temp file to target if pixels actually changed in the resized file
  # delete temp file
  convert -background none $source -resize ${size}x $tmp 2> /dev/null
  if $( compare -metric AE $tmp $target NULL: ); then
    echo $source >> /tmp/revert.txt
  else
    cp -f $tmp $target
  fi
  rm $tmp
}

export -f resizeDeterministically

files=$( git status --porcelain -- images/wallet_icons/android/*.* | sed 's/^...//g' | tr '\n' '\t' )
if [[ $files ]]; then parallel resizeDeterministically {/} images/wallet_icons/android images/wallet_icons/android/small 100 ::: $files; fi
if [[ $files ]]; then parallel resizeDeterministically {/} images/wallet_icons/android images/wallet_icons/android/tiny 25 ::: $files; fi
files=$( git status --porcelain -- images/wallet_icons/iphone/*.* | sed 's/^...//g' | tr '\n' '\t' )
if [[ $files ]]; then parallel resizeDeterministically {/} images/wallet_icons/iphone images/wallet_icons/iphone/small 100 ::: $files; fi
if [[ $files ]]; then parallel resizeDeterministically {/} images/wallet_icons/iphone images/wallet_icons/iphone/tiny 25 ::: $files; fi
files=$( git status --porcelain -- images/wallet_icons/hardware/*.* | sed 's/^...//g' | tr '\n' '\t' )
if [[ $files ]]; then parallel resizeDeterministically {/} images/wallet_icons/hardware images/wallet_icons/hardware/small 100 ::: $files; fi
if [[ $files ]]; then parallel resizeDeterministically {/} images/wallet_icons/hardware images/wallet_icons/hardware/tiny 25 ::: $files; fi

# revert all files that did not visually change, to not spam the git repo
git checkout HEAD $( cat /tmp/revert.txt | paste -sd ' ' )
