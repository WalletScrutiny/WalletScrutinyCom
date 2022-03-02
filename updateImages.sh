#!/bin/bash

while getopts a option
do
  case "${option}"
  in
    a) updateAllImages=1;;
  esac
done

if ! command -v compare &> /dev/null
then
    echo "compare (ImageMagick) could not be found!"
    exit
fi

mkdir images/wallet_icons/{android,iphone,hardware,desktop}/{small,tiny}/ 
truncate /tmp/revert.txt --size=0
tmpDir=/tmp/resizing/
export tmpDir
rm -rf $tmpDir 
mkdir $tmpDir 
git --work-tree=$tmpDir checkout HEAD -- images/wallet_icons/

logIfUnchanged() {
  changed=$1
  original=$tmpDir$changed
  if [[ ! $changed =~ ^.*\.(jpg|png)$ ]]; then
    # if file is not a jpg or png, it is deleted.
    echo "Deleting unexpected $changed"
    rm $changed
  elif [ -f "$original" ] && $( compare -metric AE -fuzz 15% $original $changed NULL: >/dev/null ); then
    echo $changed >> /tmp/revert.txt
  else
    echo "$changed changed"
  fi
}

export -f logIfUnchanged

revertImagesThatDidNotChange() {
  files=$( git status --porcelain -- images/wallet_icons/ | sed 's/^...//g' | tr '\n' ' ' )
  if [[ $files ]]; then parallel logIfUnchanged {} ::: $files; fi
  revertFiles=$( cat /tmp/revert.txt | paste -sd ' ' )
  if [[ $revertFiles ]]; then
    git checkout HEAD $revertFiles
  fi
}

if [ ! "$updateAllImages" ]; then
  revertImagesThatDidNotChange
fi

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
  if [ "$updateAllImages" ]; then
    files=$( ls $source/*.* )
  else
    files=$( git status --porcelain -- $source/*.* | sed 's/^...//g' | tr '\n' ' ' )
  fi
  if [[ $files ]]; then parallel resizeDeterministically {/} $source $target $size ::: $files; fi
}

export -f resizeDeterministically

for platform in android iphone hardware desktop; do
  resizeMany images/wallet_icons/$platform images/wallet_icons/$platform/small 100
  resizeMany images/wallet_icons/$platform images/wallet_icons/$platform/tiny 25
done
wait

if [ "$updateAllImages" ]; then
  revertImagesThatDidNotChange
fi
