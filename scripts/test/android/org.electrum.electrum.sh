#!/bin/bash

test() {
  repo=https://github.com/spesmilo/electrum
  tag=$( echo "$versionName" | sed 's/\.0$//g' )
  builtApk="$workDir/app/dist/Electrum-$versionName-arm64-v8a-release-unsigned.apk"
  
  prepare

  # build
  cp contrib/deterministic-build/requirements-build-android.txt contrib/android/
  docker build -t electrum-android-builder-img contrib/android/
  mkdir --parents .buildozer/.gradle
  docker run -it --rm \
        --name electrum-android-builder-cont \
        --volume $PWD:/home/user/wspace/electrum \
        --volume $PWD/.buildozer/.gradle:/home/user/.gradle \
        --workdir /home/user/wspace/electrum electrum-android-builder-img \
        /bin/bash -c "./contrib/android/make_apk release-unsigned;
        $takeUserActionCommand"
      
  # collect results
  result
}
