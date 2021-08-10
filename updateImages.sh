#!/bin/bash

mkdir images/wallet_icons/{android,iphone,hardware}/{small,tiny}/ 2> /dev/null

resizeDeterministically() {
  filename=$1
  source=$2/$filename
  target=$3/$filename
  size=$4
  echo $filename
  convert -background none $source -resize ${size}x $target 2> /dev/null
}

resizeMany() {
  source=$1
  target=$2
  size=$3
  files=$4
  if [[ $files ]]; then parallel resizeDeterministically {/} $source $target $size ::: $files; fi
}

export -f resizeDeterministically resizeMany

files=$( git status --porcelain -- images/wallet_icons/android/*.* | sed 's/^...//g' | tr '\n' ' ' )
resizeMany images/wallet_icons/android images/wallet_icons/android/small 100 "$files"
resizeMany images/wallet_icons/android images/wallet_icons/android/tiny 25 "$files"
files=$( git status --porcelain -- images/wallet_icons/iphone/*.* | sed 's/^...//g' | tr '\n' ' ' )
resizeMany images/wallet_icons/iphone images/wallet_icons/iphone/small 100 "$files"
resizeMany images/wallet_icons/iphone images/wallet_icons/iphone/tiny 25 "$files"
files=$( git status --porcelain -- images/wallet_icons/hardware/*.* | sed 's/^...//g' | tr '\n' ' ' )
resizeMany images/wallet_icons/hardware images/wallet_icons/hardware/small 100 "$files"
resizeMany images/wallet_icons/hardware images/wallet_icons/hardware/tiny 25 "$files"
