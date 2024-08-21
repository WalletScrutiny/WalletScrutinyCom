#!/bin/bash

repo=https://github.com/SwissBitcoinPay/app
tag=v$versionName
builtApk=$workDir/base-master.apk
deviceSpecs="$SCRIPT_DIR/device-spec.json"

if [ -f "$deviceSpecs" ]; then
    echo "Valid device-spec.json."
else
    echo "Generate and place a device specification json file to the walletscrutinycom 'scripts/' directory."
    exit
fi

test() {
  # cleanup
  docker rmi sbpay -f
  docker rm sbpay-build -f
  docker image prune -f
  # build
  docker build -t sbpay -f $SCRIPT_DIR/test/android/ch.swissbitcoinpay.checkout.dockerfile -t sbpay --ulimit=nofile=10000:10000 --build-arg VERSION="$versionName" .
  docker run -it \
  -v $workDir:/mnt \
  -v $deviceSpecs:/app/device-spec.json \
  --rm \
  sbpay:latest \
  ash -c "cd android && mv app/build/outputs/bundle/release/app-release.aab . \
    && java -jar bundletool.jar build-apks --bundle=app-release.aab --output=app-release.apks --device-spec=/app/device-spec.json \
    && unzip app-release.apks -d generated/ && cp generated/splits/*.apk /mnt/"
}
