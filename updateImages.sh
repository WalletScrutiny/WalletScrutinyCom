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
    exit -1
fi

mkdir images/wIcons/{android,iphone,hardware,bearer,desktop,others,web}/{small,tiny}/ 2> /dev/null
truncate /tmp/revert.txt --size=0
tmpDir=/tmp/resizing/
export tmpDir
rm -rf $tmpDir 2> /dev/null
mkdir $tmpDir 2> /dev/null
git --work-tree=$tmpDir checkout HEAD -- images/wIcons/

logIfUnchanged() {
  changed=$1
  original=$tmpDir$changed
  if [ -d "$changed" ]; then
    return
  elif [[ ! $changed =~ ^.*\.(jpg|png)$ ]]; then
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
  files=$( git status --porcelain images/wIcons | awk '$1!="D"{print $2}' | tr '\n' ' ' )
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
    files=$( git status --porcelain -- $source/*.* | awk '$1!="D"{print $2}' | tr '\n' ' ' )
  fi
  if [[ $files ]]; then parallel resizeDeterministically {/} $source $target $size ::: $files; fi
}

export -f resizeDeterministically

for platform in android iphone hardware bearer desktop others web; do
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
mkdir --parents images/wIcons/{android,iphone,hardware,bearer,desktop,others,web}/{small,tiny}/ 2> /dev/null
# Icons for android/iphone live under nested blocks in _mobile/*.md (not _android/_iphone).
collect_mobile_icons() {
  local platform=$1
  awk -v plat="$platform" '
    $0 ~ "^" plat ":" { in_plat = 1; next }
    /^[a-zA-Z]/ { in_plat = 0 }
    in_plat && /^  icon: / { sub(/^  icon: /, ""); print }
  ' _mobile/*.md 2>/dev/null | sort -u
}

folder='bearer'
for folder in bearer android iphone hardware desktop others web; do
  if [ "$folder" = "android" ] || [ "$folder" = "iphone" ]; then
    icons=$(collect_mobile_icons "$folder")
  else
    icons=$(grep "^icon: \(.*\)" _$folder/* --only-matching --no-filename 2>/dev/null | sed 's/^icon: //g')
  fi
  for i in $icons; do
    mv $tmpFolder/wIcons/${folder}/$i images/wIcons/${folder}/$i
    for s in small tiny; do
      mv $tmpFolder/wIcons/${folder}/${s}/$i images/wIcons/${folder}/${s}/$i
    done
  done
done
