#!/bin/bash

repo=https://github.com/synonymdev/bitkit.git
tag="v$versionName"
builtApk=$workDir/output/bitkit.apk

test() {
    mkdir -p $workDir/output

    docker rmi bitkit -f

    docker build \
        --tag bitkit \
        --file $SCRIPT_DIR/test/android/to.bitkit.dockerfile \
        $workDir/app

    docker run \
        --rm \
        --volume $workDir/output:/output \
        bitkit

    docker rmi bitkit -f
    docker image prune -f
}
