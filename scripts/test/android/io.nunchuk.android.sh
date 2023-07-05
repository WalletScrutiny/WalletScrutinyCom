#!/bin/bash

# We have hard coded version of nunchuk-android-nativesdk-prebuild to 1.1.61.
# Unfortunately there is no easy way for now to find the equivalent version of the SDK used
# for each release. So the SDK version check should be done manually and the script should be run with
# the appropriate version of the SDK.

repo=https://github.com/nunchuk-io/nunchuk-android
tag=android.$versionName
builtApk="$workDir/nunchuk-app/build/outputs/apk/production/release/nunchuk-app-production-release.apk"

test() {
  podman run -it --volume $PWD:/mnt --rm $wsContainer bash -x -c "apt update;
      DEBIAN_FRONTEND=noninteractive apt install -y openjdk-11-jdk;
      cd /mnt;
      printf '\nstoreFile=nunchuk.pfx\nstorePassword=nunchuk_alias\nkeyPassword=nunchuk_alias\nkeyAlias=nunchuk_alias' > keystore.properties;
      keytool -genkey -alias nunchuk_alias -keystore nunchuk-app/nunchuk.pfx -storetype PKCS12 -keyalg RSA -keysize 4096 -storepass nunchuk_alias -keypass nunchuk_alias -validity 10000 -dname CN=IL;
      sed -i 's/io.nunchuk.android:nativesdk:\${nativeSdkVersion}/com.github.nunchuk-io:nunchuk-android-nativesdk-prebuild:1.1.61@aar/g' configs/dependencies.gradle;
      ./gradlew assembleRelease;
      $takeUserActionCommand"
}
