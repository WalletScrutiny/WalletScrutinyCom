#!/bin/bash

mkdir images/wallet_icons/tiny/ images/wallet_icons/small/ 2> /dev/null

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

files=$( ls images/wallet_icons/*.* )
parallel resizeDeterministically {/} images/wallet_icons images/wallet_icons/small 100 ::: $files
parallel resizeDeterministically {/} images/wallet_icons images/wallet_icons/tiny 25 ::: $files
resizeDeterministically hacker.jpg resSources images 300
