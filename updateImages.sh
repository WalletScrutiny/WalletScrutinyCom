#!/bin/bash

mkdir images/wallet_icons/{android,iphone,hardware}/{small,tiny}/ 2> /dev/null
truncate /tmp/revert.txt --size=0
tmpDir=/tmp/resizing/
export tmpDir
rm -rf $tmpDir 2> /dev/null
mkdir $tmpDir 2> /dev/null
git --work-tree=$tmpDir checkout HEAD -- images/wallet_icons/

logIfUnchanged() {
  changed=$1
  original=$tmpDir$changed
  if [[ ! $changed =~ ^.*\.(jpg|png)$ ]]; then
    # if file is not a jpg or png, it is deleted.
    echo "Deleting unexpected $changed"
    rm $changed
  elif [ -f "$original" ] && $( compare -metric AE $original $changed NULL:  >/dev/null ); then
    echo $changed >> /tmp/revert.txt
  else
    echo "$changed changed"
  fi
}

export -f logIfUnchanged

revertImagesThatDidNotChange() {
  files=$( git status --porcelain -- images/wallet_icons/*/*.* | sed 's/^...//g' | tr '\n' ' ' )
  if [[ $files ]]; then parallel logIfUnchanged {} ::: $files; fi
  revertFiles=$( cat /tmp/revert.txt | paste -sd ' ' )
  if [[ $revertFiles ]]; then
    git checkout HEAD $revertFiles
  fi
}
revertImagesThatDidNotChange

resizeDeterministically() {
  filename=$1
  source=$2/$filename
  target=$3/$filename
  size=$4
  convert -background none $source -resize ${size}x $target 2> /dev/null
}

resizeMany() {
  source=$1
  target=$2
  size=$3
  files=$4
  if [[ $files ]]; then parallel resizeDeterministically {/} $source $target $size ::: $files; fi
}

export -f resizeDeterministically

files=$( git status --porcelain -- images/wallet_icons/android/*.* | sed 's/^...//g' | tr '\n' ' ' )
resizeMany images/wallet_icons/android images/wallet_icons/android/small 100 "$files"
resizeMany images/wallet_icons/android images/wallet_icons/android/tiny 25 "$files"
files=$( git status --porcelain -- images/wallet_icons/iphone/*.* | sed 's/^...//g' | tr '\n' ' ' )
resizeMany images/wallet_icons/iphone images/wallet_icons/iphone/small 100 "$files"
resizeMany images/wallet_icons/iphone images/wallet_icons/iphone/tiny 25 "$files"
files=$( git status --porcelain -- images/wallet_icons/hardware/*.* | sed 's/^...//g' | tr '\n' ' ' )
resizeMany images/wallet_icons/hardware images/wallet_icons/hardware/small 100 "$files"
resizeMany images/wallet_icons/hardware images/wallet_icons/hardware/tiny 25 "$files"
