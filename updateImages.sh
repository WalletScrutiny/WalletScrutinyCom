#!/bin/bash

mkdir images/wallet_icons/{android,iphone}/{small,tiny}/ 2> /dev/null

resizeDeterministically() {
  filename=$1
  source=$2/$filename
  target=$3/$filename
  size=$4
  tmp=/tmp/$filename
  convert -background none $source -resize ${size}x $tmp \
    && compare -metric AE $tmp $target NULL: || cp -f $tmp $target
  rm $tmp
}

export -f resizeDeterministically

files=$( ls images/wallet_icons/android/*.* )
parallel resizeDeterministically {/} images/wallet_icons/android images/wallet_icons/android/small 100 ::: $files
parallel resizeDeterministically {/} images/wallet_icons/android images/wallet_icons/android/tiny 25 ::: $files
files=$( ls images/wallet_icons/iphone/*.* )
parallel resizeDeterministically {/} images/wallet_icons/iphone images/wallet_icons/iphone/small 100 ::: $files
parallel resizeDeterministically {/} images/wallet_icons/iphone images/wallet_icons/iphone/tiny 25 ::: $files
