#!/bin/bash
# device-spec.json can be derived by connecting your phone physically to the desktop and then running this command on the desktop
# java -jar bundletool-all-1.8.2.jar get-device-spec --output=device-spec.json
# You can then upload device-spec.json to the build server inside scripts/test/android folder

read -p "Enter your GitHub username: " github_user
read -s -p "Enter your GitHub personal access token (must have read:packages permission): " github_token

repo=https://github.com/gemwalletcom/gem-android
tag="$versionName"
builtApk=$workDir/built
DEVICE_SPEC_PATH="/home/gemwallet/device-spec.json"

test() {
  docker rmi gemwallet -f
  docker build \
    --build-arg REPO=$repo \
    --build-arg TAG=$tag \
    --build-arg GITHUB_USER=$github_user \
    --build-arg GITHUB_TOKEN=$github_token \
    --build-arg DEVICE_SPEC_PATH=$DEVICE_SPEC_PATH \
    --tag gemwallet \
    --file $SCRIPT_DIR/test/android/com.gemwallet.android.dockerfile \
    -f $SCRIPT_DIR/test/android/com.gemwallet.android.dockerfile \
    $SCRIPT_DIR/test/android

docker run -it --volume $workDir:/mnt gemwallet bash

  docker run \
    --volume $workDir:/mnt \
    --rm \
    -u root \
    gemwallet \
    bash -c 'ls -R /home/gemwallet/built && \
    cp /home/gemwallet/built/*.apk /mnt/'

  docker rmi gemwallet -f
  docker image prune -f
}
