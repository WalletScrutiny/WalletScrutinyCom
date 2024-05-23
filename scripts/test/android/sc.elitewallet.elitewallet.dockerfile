FROM ubuntu:20.04

ENV UID=1000
ENV GID=1000
ENV USER="developer"
ENV JAVA_VERSION="11"
ENV ANDROID_TOOLS_URL="https://dl.google.com/android/repository/commandlinetools-linux-6858069_latest.zip"
ENV ANDROID_VERSION="33"
ENV ANDROID_BUILD_TOOLS_VERSION="33.0.2"
ENV ANDROID_ARCHITECTURE="x86_64"
ENV ANDROID_SDK_ROOT="/home/$USER/android"
ENV FLUTTER_CHANNEL="stable"
ENV FLUTTER_VERSION="3.10.6"
ENV FLUTTER_URL="https://storage.googleapis.com/flutter_infra_release/releases/$FLUTTER_CHANNEL/linux/flutter_linux_3.10.6-$FLUTTER_CHANNEL.tar.xz"
ENV FLUTTER_HOME="/home/$USER/flutter"
ENV FLUTTER_WEB_PORT="8090"
ENV FLUTTER_DEBUG_PORT="42000"
ENV FLUTTER_EMULATOR_NAME="flutter_emulator"
ENV PATH="$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/emulator:$ANDROID_SDK_ROOT/platform-tools:$ANDROID_SDK_ROOT/platforms:$FLUTTER_HOME/bin:$PATH"

ENV APP_ANDROID_TYPE="elitewallet"
ENV APP_ANDROID_NAME="Elite Wallet"
ENV APP_ANDROID_VERSION="1.3.1"
ENV APP_ANDROID_BUILD_NUMBER=16
ENV APP_ANDROID_BUNDLE_ID="sc.elitewallet.elitewallet"
ENV APP_ANDROID_PACKAGE="sc.elitewallet.elitewallet"
ENV APP_ANDROID_SCHEME="elitewallet"

# install all dependencies
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update \
  && apt-get install --yes --no-install-recommends openjdk-$JAVA_VERSION-jdk curl unzip sed git bash xz-utils libglvnd0 ssh xauth x11-xserver-utils libpulse0 libxcomposite1 libgl1-mesa-glx sudo \
  curl unzip automake build-essential file pkg-config git python2 libtool libtinfo5 cmake openjdk-11-jre-headless clang bison byacc gperf groff \
  && rm -rf /var/lib/{apt,dpkg,cache,log} \
  && ln -s /usr/bin/python2 /usr/bin/python

# create user
RUN groupadd --gid $GID $USER \
  && useradd -s /bin/bash --uid $UID --gid $GID -m $USER \
  && echo $USER ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USER \
  && chmod 0440 /etc/sudoers.d/$USER

USER $USER
WORKDIR /home/$USER

# android sdk
RUN mkdir -p $ANDROID_SDK_ROOT \
  && mkdir -p /home/$USER/.android \
  && touch /home/$USER/.android/repositories.cfg \
  && curl -o android_tools.zip $ANDROID_TOOLS_URL \
  && unzip -qq -d "$ANDROID_SDK_ROOT" android_tools.zip \
  && rm android_tools.zip \
  && mkdir -p $ANDROID_SDK_ROOT/cmdline-tools/latest \
  && mv $ANDROID_SDK_ROOT/cmdline-tools/bin $ANDROID_SDK_ROOT/cmdline-tools/latest \
  && mv $ANDROID_SDK_ROOT/cmdline-tools/lib $ANDROID_SDK_ROOT/cmdline-tools/latest \
  && yes "y" | sdkmanager "build-tools;$ANDROID_BUILD_TOOLS_VERSION" \
  && yes "y" | sdkmanager "platforms;android-$ANDROID_VERSION" \
  && yes "y" | sdkmanager "platform-tools" \
  && yes "y" | sdkmanager "emulator" \
  && yes "y" | sdkmanager "system-images;android-$ANDROID_VERSION;google_apis_playstore;$ANDROID_ARCHITECTURE"

# flutter
RUN curl -o flutter.tar.xz $FLUTTER_URL \
  && mkdir -p $FLUTTER_HOME \
  && tar xf flutter.tar.xz -C /home/$USER \
  && rm flutter.tar.xz \
  && flutter config --no-analytics \
  && flutter precache \
  && yes "y" | flutter doctor --android-licenses \
  && flutter doctor \
  && flutter emulators --create \
  && flutter update-packages

RUN git clone https://github.com/Elite-Labs/EliteWallet.git /home/$USER/elite_wallet --branch main

WORKDIR /home/$USER/elite_wallet
RUN git config --global protocol.file.allow always \
  && git submodule update --init --force

WORKDIR /home/$USER/elite_wallet/scripts/android
RUN ./install_ndk.sh \
  && ./app_config.sh \
  && ./build_all.sh \
  && ./copy_monero_deps.sh

WORKDIR /home/$USER/
RUN keytool -genkey -v -keystore key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias key -noprompt -dname "CN=EliteWallet, OU=EliteWallet, O=EliteWallet, L=Florida, S=America, C=USA" -storepass adminadmin -keypass adminadmin

WORKDIR /home/$USER/elite_wallet
RUN bash ./scripts/build.sh
