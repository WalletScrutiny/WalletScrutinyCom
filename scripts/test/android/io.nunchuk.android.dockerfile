FROM docker.io/debian:sid-slim

RUN set -ex; \
    apt-get update; \
    DEBIAN_FRONTEND=noninteractive apt-get install --yes -o APT::Install-Suggests=false --no-install-recommends \
        git \
        gcc \
        g++ \
        make \
        curl \
        bzip2 \
        patch \
        libtool \ 
        automake \
        pkg-config \
        openjdk-11-jdk; \
    rm -rf /var/lib/apt/lists/*; \
    useradd -ms /bin/bash appuser;
     
USER appuser

ENV ANDROID_SDK_ROOT="/home/appuser/app/sdk" \
    ANDROID_SDK="/home/appuser/app/sdk" \
    ANDROID_HOME="/home/appuser/app/sdk" \
    ANDROID_NDK_HOME="/home/appuser/app/sdk/ndk/21.4.7075529/"

RUN set -ex; \
    mkdir -p "/home/appuser/app/sdk/licenses" "/home/appuser/app/sdk/ndk" "/home/appuser/app/nunchuk/"; \
    printf "\n24333f8a63b6825ea9c5514f83c2829b004d1fee" > "/home/appuser/app/sdk/licenses/android-sdk-license"; \
    cd /home/appuser/app/nunchuk/; \ 
    git clone https://github.com/nunchuk-io/nunchuk-android-nativesdk; \
    cd /home/appuser/app/nunchuk/nunchuk-android-nativesdk/; \
    git checkout 0131fcddacae4b448893040e26f70d126d0c0554;

WORKDIR /home/appuser/app/nunchuk/

RUN set -ex; \
    cd /home/appuser/app/nunchuk/nunchuk-android-nativesdk; \
    ./gradlew clean; \
    cd /home/appuser/app/nunchuk/nunchuk-android-nativesdk/src/main/native; \
    git submodule update --init --recursive; \
    bash .install_linux_deps.sh arm64-v8a; \
    cd /home/appuser/app/nunchuk/nunchuk-android-nativesdk/; \
    ./gradlew clean assembleArm64_v8aRelease --stacktrace; \
    ./gradlew publish; \
    cd /home/appuser/app/nunchuk/; \
    git clone https://github.com/nunchuk-io/nunchuk-android; \
    cd nunchuk-android; \ 
    git checkout 47aba3e898b0441f0233c0bcda10734bcc836a86; \
    printf "\nstoreFile=nunchuk.pfx\nstorePassword=nunchuk_alias\nkeyPassword=nunchuk_alias\nkeyAlias=nunchuk_alias" > /home/appuser/app/nunchuk/nunchuk-android/keystore.properties; \
    keytool -genkey -alias nunchuk_alias -keystore /home/appuser/app/nunchuk/nunchuk-android/nunchuk-app/nunchuk.pfx -storetype PKCS12 -keyalg RSA -keysize 4096 -storepass nunchuk_alias -keypass nunchuk_alias -validity 10000 -dname CN=IL; \
    ./gradlew assembleRelease; \
    ./gradlew bundleRelease;