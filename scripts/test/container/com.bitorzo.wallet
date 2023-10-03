FROM docker.io/debian:sid-slim

RUN set -ex; \
    apt-get update; \
    DEBIAN_FRONTEND=noninteractive apt-get install --yes -o APT::Install-Suggests=false --no-install-recommends \
        xz-utils \
        unzip \
        zip \
        openjdk-8-jdk-headless \
        ca-certificates \
        file \
        curl \
        git; \
    rm -rf /var/lib/apt/lists/*; \
    useradd -ms /bin/bash appuser
    
USER appuser

ENV ANDROID_SDK_ROOT="/home/appuser/sdk" \
    ANDROID_HOME="/home/appuser/sdk" \
    ANDROID_NDK_HOME=/home/appuser/sdk/ndk/21.4.7075529/ \
    PATH=$PATH:/home/appuser/gradle-6.7.1/bin/

RUN set -ex; \
    mkdir -p "/home/appuser/sdk/licenses" "/home/appuser/sdk/ndk"; \
    printf "\n24333f8a63b6825ea9c5514f83c2829b004d1fee" > "/home/appuser/sdk/licenses/android-sdk-license"; \
    cd /home/appuser/; \
    curl -o ndk21.zip -L https://dl.google.com/android/repository/android-ndk-r21e-linux-x86_64.zip; \
    echo "ad7ce5467e18d40050dc51b8e7affc3e635c85bd8c59be62de32352328ed467e  ndk21.zip" | sha256sum -c ; \
    unzip ndk21.zip; \
    rm ndk21.zip; \
    mv android-ndk-r21e /home/appuser/sdk/ndk/21.4.7075529/; \    
    curl -o flutter_linux_1.20.0-stable.tar.xz -L https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_1.20.0-stable.tar.xz; \
    tar xf flutter_linux_1.20.0-stable.tar.xz; \
    rm flutter_linux_1.20.0-stable.tar.xz; \
    curl -o gradle-6.7.1-bin.zip -L https://services.gradle.org/distributions/gradle-6.7.1-bin.zip; \
    unzip gradle-6.7.1-bin.zip -d /home/appuser/; \
    rm gradle-6.7.1-bin.zip; \    
    /home/appuser/flutter/bin/flutter config --no-analytics; \  
    git clone --depth 1 --no-tags --single-branch https://github.com/Bitorzo/Bitorzo/; \
    sed -i "s/bbedward\/manta-dart/appiapay\/manta-dart/g" /home/appuser/Bitorzo/pubspec.yaml; \
    sed -i "s/p2Wpkh.dart/p2wpkh.dart/g" /home/appuser/Bitorzo/lib/util/addressutil.dart; \
    sed -i "s/p2Wpkh.dart/p2wpkh.dart/g" /home/appuser/Bitorzo/lib/ui/home_page.dart; \
    cd /home/appuser/Bitorzo/android; \
    keytool -genkey -alias bitorzo_alias -keystore app/bitorzo.pfx -storetype PKCS12 -keyalg RSA -keysize 4096 -storepass bitorzo_alias -keypass bitorzo_alias -validity 10000 -dname CN=IL; \
    printf "\nstoreFile=bitorzo.pfx\nstorePassword=bitorzo_alias\nkeyPassword=bitorzo_alias\nkeyAlias=bitorzo_alias" > key.properties;
    
WORKDIR /home/appuser/Bitorzo/

