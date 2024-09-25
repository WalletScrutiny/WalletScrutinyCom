#!/bin/bash

repo=https://github.com/ACINQ/phoenix
tag="android-v$versionName"
builtApk="$workDir/output/phoenix-$versionCode-$versionName-mainnet-release.apk"

test() {
    # Ensure output directory exists
    mkdir -p "$workDir/output"

    # Build the Docker image
    docker build -t phoenix_build .

    # Run the build process
    docker run --rm \
        -v "$PWD":/home/ubuntu/phoenix \
        -v "$workDir/output":/output \
        phoenix_build bash -c "
            set -e
            git config --global --add safe.directory /home/ubuntu/phoenix
            cd /home/ubuntu/phoenix
            ./gradlew :phoenix-android:assembleRelease -PincludeAndroid=true --info --stacktrace
            cp /home/ubuntu/phoenix/phoenix-android/build/outputs/apk/release/*.apk /output/
            echo 'Build completed successfully'
        "

    # Check if the APK was built successfully
    if [ ! -f "$builtApk" ]; then
        echo "Error: APK not found at $builtApk"
        echo "Contents of $workDir/output:"
        ls -l "$workDir/output"
        return 1
    fi

    # Cleanup
    docker image prune -f

    $takeUserActionCommand
}
