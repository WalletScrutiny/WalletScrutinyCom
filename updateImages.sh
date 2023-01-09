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

mkdir images/wIcons/{android,iphone,hardware,bearer,desktop}/{small,tiny}/ 2> /dev/null
truncate /tmp/revert.txt --size=0
tmpDir=/tmp/resizing/
export tmpDir
rm -rf $tmpDir 2> /dev/null
mkdir $tmpDir 2> /dev/null
git --work-tree=$tmpDir checkout HEAD -- images/wIcons/

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
  files=$( git status --porcelain -- images/wIcons/ | sed 's/^...//g' | tr '\n' ' ' )
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

for platform in android iphone hardware bearer desktop; do
  resizeMany images/wIcons/$platform images/wIcons/$platform/small 100
  resizeMany images/wIcons/$platform images/wIcons/$platform/tiny 25
done
wait

if [ "$updateAllImages" ]; then
  revertImagesThatDidNotChange
fi

# delete images that are not referenced anymore
tmpFolder=/tmp/migrateImages
rm -rf $tmpFolder 2> /dev/null
mkdir --parents $tmpFolder/
mv images/wIcons $tmpFolder
mkdir --parents images/wIcons/{android,iphone,hardware,bearer,desktop}/{small,tiny}/ 2> /dev/null
folder='bearer'
for folder in bearer android iphone hardware desktop; do
  icons=$(grep "^icon: \(.*\)" _$folder/* --only-matching --no-filename | sed 's/^icon: //g')
  for i in $icons; do
    mv $tmpFolder/wIcons/${folder}/$i images/wIcons/${folder}/$i
    for s in small tiny; do
      mv $tmpFolder/wIcons/${folder}/${s}/$i images/wIcons/${folder}/${s}/$i
    done
  done
done
