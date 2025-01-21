#!/bin/bash

repo="https://github.com/michaelWuensch/BitBanana.git"
tag="v$versionName"
# Use variables for APK name
builtApk="$workDir/app/build/outputs/apk/release/bitbanana-${versionName}_${versionCode}-release-unsigned.apk"

test() {
    docker run \
        --rm \
        -v "$PWD":/project \
        mingc/android-build-box:1.28.0 \
        bash -c 'cd /project && ./gradlew --warning-mode all assembleRelease'

    # Create the target directory structure
    mkdir -p "$workDir/app/build/outputs/apk/release/"
    
    # Copy using the same variable-based name
    cp -v app/build/outputs/apk/release/bitbanana-${versionName}_${versionCode}-release-unsigned.apk "$builtApk"
}