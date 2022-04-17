#!/bin/bash

test() {
  repo=https://github.com/spesmilo/electrum
  tag=$( echo "$versionName" | sed 's/\.0$//g' )
  builtApk="$workDir/app/dist/Electrum-$versionName-arm64-v8a-release-unsigned.apk"

  prepare
  git submodule update --init --recursive
  
  # build
  cp contrib/deterministic-build/requirements-build-android.txt contrib/android/
  docker build -t electrum-android-builder-img --file contrib/android/Dockerfile $PWD
  mkdir --parents .buildozer/.gradle
  docker run -it --rm \
        --name electrum-android-builder-cont \
        --volume $PWD:/home/user/wspace/electrum \
        --volume $PWD/.buildozer/.gradle:/home/user/.gradle \
        --workdir /home/user/wspace/electrum electrum-android-builder-img \
        /bin/bash -c "./contrib/android/make_apk kivy all release-unsigned;
        $takeUserActionCommand"

  docker rmi electrum-android-builder-img -f
  docker image prune -f

  # collect results
  result
}
