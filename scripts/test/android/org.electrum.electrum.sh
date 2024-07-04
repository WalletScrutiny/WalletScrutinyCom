  GNU nano 7.2                                                                     scripts/test/android/org.electrum.electrum.sh                                                                              
#!/bin/bash
repo=https://github.com/spesmilo/electrum
tag=$( echo "$versionName" | sed 's/\.0$//g' )

# Function to determine the APK architecture
determine_architecture() {
  APK_PATH=$1
  aapt dump badging "$APK_PATH" | grep native-code | awk -F"'" '{print $2}'
}

test() {
  git submodule update --init --recursive
  
  # Determine the architecture of the provided APK
  # Use $downloadedApk which is set in test.sh
  apk_arch=$(determine_architecture "$downloadedApk")
  echo -e "\e[1;36mDetermined APK Architecture: $apk_arch\e[0m"
  
  if [ -z "$apk_arch" ]; then
    echo -e "\e[1;36mError: Unable to determine APK architecture\e[0m"
    exit 1
  fi
  
  builtApk="$workDir/app/dist/Electrum-$versionName-$apk_arch-release-unsigned.apk"
  
  # build
  cp contrib/deterministic-build/requirements-build-android.txt contrib/android/
  docker build --no-cache -t electrum-android-builder-img --build-arg UID=$(id -u) --file contrib/android/Dockerfile $PWD
  mkdir --parents .buildozer/.gradle
  docker run -it --rm \
    --name electrum-android-builder-cont \
    --volume $PWD:/home/user/wspace/electrum \
    --volume $PWD/.buildozer/.gradle:/home/user/.gradle \
    --workdir /home/user/wspace/electrum electrum-android-builder-img \
    /bin/bash -c "./contrib/android/make_apk.sh qml $apk_arch release-unsigned;
      $takeUserActionCommand"
  docker rmi electrum-android-builder-img -f
  docker image prune -f
}

