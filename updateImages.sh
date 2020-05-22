#!/bin/bash

mkdir images/wallet_icons/tiny/ images/wallet_icons/small/
for f in $( cd images/wallet_icons; ls *.* )
do
  echo $f
  file="images/wallet_icons/$f"
  convert -background none "images/wallet_icons/$f" -resize 100x images/wallet_icons/small/$f
  convert -background none "images/wallet_icons/$f" -resize 25x images/wallet_icons/tiny/$f
done
convert "resSources/hacker.jpg" -resize 200x images/hacker.jpg