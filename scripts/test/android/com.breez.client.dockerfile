# Stage 1: Build stage for breez.aar
FROM debian:sid-slim AS breez_aar_builder

# Install necessary dependencies
RUN set -ex; \
    apt-get update; \
    DEBIAN_FRONTEND=noninteractive apt-get install --yes -o APT::Install-Suggests=false --no-install-recommends \
    unzip \
    ca-certificates \
    openjdk-11-jdk \
    curl \
    git \
    wget \  
    build-essential && \  
    rm -rf /var/lib/apt/lists/*; \
    useradd -ms /bin/bash appuser;

RUN set -ex; \
    echo "Installing Go..."; \
    wget https://go.dev/dl/go1.19.linux-amd64.tar.gz; \
    tar -C /usr/local -xzf go1.19.linux-amd64.tar.gz; \
    rm go1.19.linux-amd64.tar.gz; \
    export PATH=$PATH:/usr/local/go/bin; \
    mkdir -p /home/appuser/gopackages; \
    chown -R appuser:appuser /home/appuser

# Switch to appuser
USER appuser

# Download and configure Android SDK, NDK, and necessary licenses
RUN set -ex; \
    cd /home/appuser/; \
    curl -o go.tgz -L https://go.dev/dl/go1.17.13.linux-amd64.tar.gz; \
    tar -xzf go.tgz; \
    rm go.tgz; \
    mkdir -p "/home/appuser/app/sdk/licenses" "/home/appuser/app/ndk"; \
    printf "\n24333f8a63b6825ea9c5514f83c2829b004d1fee" > "/home/appuser/app/sdk/licenses/android-sdk-license"; \
    printf "\n84831b9409646a918e30573bab4c9c91346d8abd" > "/home/appuser/app/sdk/licenses/android-sdk-preview-license"; \
    cd /home/appuser/app/sdk/; \
    curl -o commandlinetools.zip -L https://dl.google.com/android/repository/commandlinetools-linux-8512546_latest.zip; \
    echo "2ccbda4302db862a28ada25aa7425d99dce9462046003c1714b059b5c47970d8  commandlinetools.zip" | sha256sum -c; \
    unzip commandlinetools.zip; \
    rm commandlinetools.zip; \
    cd /home/appuser/app/ndk/; \
    curl -o ndk19.zip -L https://dl.google.com/android/repository/android-ndk-r19c-linux-x86_64.zip; \
    echo "4c62514ec9c2309315fd84da6d52465651cdb68605058f231f1e480fcf2692e1  ndk19.zip" | sha256sum -c; \
    sha256sum ndk19.zip; \
    unzip ndk19.zip; \
    rm ndk19.zip; \
    cd /home/appuser/app/sdk/; \
    /home/appuser/app/sdk/cmdline-tools/bin/sdkmanager --sdk_root=/home/appuser/app/sdk/ --install "platforms;android-32";

RUN set -ex; \
    cd /home/appuser/; \
    echo "Cloning Breez repository..."; \
    for i in {1..5}; do \
    if git clone https://github.com/breez/breez.git; then \
        echo "Successfully cloned Breez repository"; \
        break; \
    else \
        echo "Attempt $i failed. Retrying in 15 seconds..."; \
        sleep 15; \
    fi; \
    if [ $i -eq 5 ]; then \
        echo "Failed to clone repository after 5 attempts"; \
        exit 1; \
    fi; \
done

# Set environment variables
ENV ANDROID_SDK_ROOT="/home/appuser/app/sdk" \
    ANDROID_HOME="/home/appuser/app/sdk" \
    GOPATH="/home/appuser/gopackages" \
    PATH="$PATH:/usr/local/go/bin:/home/appuser/gopackages/bin" \
    ANDROID_NDK_HOME=/home/appuser/app/ndk/android-ndk-r19c/ \
    GO111MODULE=on

# Clean Go module cache and ensure all dependencies are correctly downloaded
RUN cd /home/appuser/breez && \
    go clean -modcache && \
    go mod download && \
    go mod tidy && \
    go mod verify

# Install gomobile and gobind
RUN go install golang.org/x/mobile/cmd/gomobile@latest && \
    go install golang.org/x/mobile/cmd/gobind@latest

# Clone Breez repository, build using gomobile, and configure build.sh
RUN set -ex; \
    cd /home/appuser/breez; \
    echo "Checking out specific commit..."; \
    git checkout 7801b45acc31b71cca566244c6082a4412dec5db; \
    echo "Initializing gomobile..."; \
    gomobile init; \
    echo "Cleaning Go module cache..."; \
    go clean -modcache; \
    echo "Downloading Go dependencies..."; \
    go mod download -x; \
    echo "Explicitly downloading cloud.google.com/go..."; \
    go get -v cloud.google.com/go@v0.65.0; \
    echo "Adding missing go.sum entry..."; \
    go mod download cloud.google.com/go; \
    echo "Tidying go.mod..."; \
    go mod tidy; \
    echo "Verifying dependencies..."; \
    go mod verify; \
    echo "Contents of go.mod:"; \
    cat go.mod; \
    echo "Contents of go.sum:"; \
    cat go.sum; \
    echo "Modifying build.sh script..."; \
    sed -i 's/github.com\/breez\/breez\/bindings/-ldflags="-s -w" github.com\/breez\/breez\/bindings/' build.sh; \
    echo "Contents of build.sh:"; \
    cat build.sh; \
    echo "Running build.sh script..."; \
    bash -x build.sh || { echo "build.sh script failed"; exit 2; }

# Stage 2: Final stage for building APK
FROM debian:sid-slim

# Install necessary dependencies
RUN set -ex; \
    apt-get update; \
    DEBIAN_FRONTEND=noninteractive apt-get install --yes -o APT::Install-Suggests=false --no-install-recommends \
    gradle \
    xz-utils \
    unzip \
    zip \
    openjdk-11-jdk \
    ca-certificates \
    file \
    curl \
    git; \
    rm -rf /var/lib/apt/lists/*; \
    mkdir -p /var/local/builder/breez/builds/master/; \
    useradd -ms /bin/bash appuser; \
    chown -R appuser:appuser /var/local/builder;

# Switch to appuser
USER appuser

# Configure Android SDK and Flutter
RUN set -ex; \
    mkdir -p "/home/appuser/app/sdk/licenses"; \
    printf "\n24333f8a63b6825ea9c5514f83c2829b004d1fee" > "/home/appuser/app/sdk/licenses/android-sdk-license"; \
    cd /home/appuser/app/sdk/; \
    curl -o flutter_linux_3.7.12-stable.tar.xz -L https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.7.12-stable.tar.xz; \
    tar xf flutter_linux_3.7.12-stable.tar.xz; \
    rm flutter_linux_3.7.12-stable.tar.xz; \
    /home/appuser/app/sdk/flutter/bin/flutter config --no-analytics; \
    /home/appuser/app/sdk/flutter/bin/dart --disable-analytics;

# Copy breezmobile repository and build APK
WORKDIR /home/appuser/

ENV ANDROID_SDK_ROOT="/home/appuser/app/sdk" \
    ANDROID_HOME="/home/appuser/app/sdk"

RUN set -ex; \
    cd /var/local/builder/breez/builds/master/; \
    git clone https://github.com/breez/breezmobile/; \
    cd breezmobile; \
    git checkout 0.17.lnd; \
    mkdir /home/appuser/FromGithub /home/appuser/LocalBuild; \
    cd /home/appuser/FromGithub; \
    curl -o 017.apk -L https://github.com/breez/breezmobile/releases/download/0.17.lnd/1718089732-1.apk; \
    unzip 017.apk; \
    mv 017.apk /home/appuser/017-from-github.apk; \
    cat assets/flutter_assets/conf/moonpay.conf; \
    cp assets/flutter_assets/conf/moonpay.conf /var/local/builder/breez/builds/master/breezmobile/conf/moonpay.conf; \
    cat assets/flutter_assets/conf/breez.conf; \
    cp assets/flutter_assets/conf/breez.conf /var/local/builder/breez/builds/master/breezmobile/conf/breez.conf; \
    cat assets/flutter_assets/conf/lnd.conf; \
    cp assets/flutter_assets/conf/lnd.conf /var/local/builder/breez/builds/master/breezmobile/conf/lnd.conf; \
    cd /var/local/builder/breez/builds/master/breezmobile/android/; \
    keytool -genkey -alias breez_alias -keystore app/breez.pfx -storetype PKCS12 -keyalg RSA -keysize 4096 -storepass breez_alias -keypass breez_alias -validity 10000 -dname CN=IL; \
    printf "\nstoreFile=breez.pfx\nstorePassword=breez_alias\nkeyPassword=breez_alias\nkeyAlias=breez_alias" > key.properties; \
    sed -i 's/versionCode 1 /versionCode 1681054500 /g' /var/local/builder/breez/builds/master/breezmobile/android/app/build.gradle ;

# Copy the breez.aar from the breez_aar_builder stage
COPY --from=breez_aar_builder /home/appuser/breez/build/android/breez.aar /var/local/builder/breez/builds/master/breezmobile/android/app/libs/breez.aar

RUN set -ex; \
    echo "{\"project_info\":{\"project_number\":\"463327817067\",\"firebase_url\":\"https://breez-technology.firebaseio.com\",\"project_id\":\"breez-technology\",\"storage_bucket\":\"breez-technology.appspot.com\"},\"client\":[{\"client_info\":{\"mobilesdk_app_id\":\"1:463327817067:android:90ddc9c877b6277f\",\"android_client_info\":{\"package_name\":\"com.breez.client\"}},\"oauth_client\":[{\"client_id\":\"463327817067-3508ng7nsbmp3kv3v19nljdu8o5a8cku.apps.googleusercontent.com\",\"client_type\":3}],\"api_key\":[{\"current_key\":\"AIzaSyAlJWsGJcsK2U9BcYahortPZ7epzKmDcU8\"}],\"services\":{\"appinvite_service\":{\"other_platform_oauth_client\":[{\"client_id\":\"463327817067-3508ng7nsbmp3kv3v19nljdu8o5a8cku.apps.googleusercontent.com\",\"client_type\":3}]}}}],\"configuration_version\":\"1\"}" >  /var/local/builder/breez/builds/master/breezmobile/android/app/src/client/google-services.json; \
    cd /var/local/builder/breez/builds/master/breezmobile/; \
    sed -i '/^\s*<\/application>\s*/i <meta-data android:name="com.android.vending.derived.apk.id" android:value="1"\/>' android/app/src/main/AndroidManifest.xml; \
    /home/appuser/app/sdk/flutter/bin/flutter build apk --target-platform=android-arm64 --flavor=client --release --target=lib/main.dart --no-tree-shake-icons; \
    cp /var/local/builder/breez/builds/master/breezmobile/build/app/outputs/flutter-apk/app-client-release.apk /home/appuser/LocalBuild/017-local-build.apk; \
    cd /home/appuser/LocalBuild/; \
    unzip 017-local-build.apk; \
    mv 017-local-build.apk /home/appuser/017-local-build.apk;

WORKDIR /home/appuser/
CMD ["/bin/bash", "-c", "cd /var/local/builder/breez/builds/master/breezmobile && /home/appuser/app/sdk/flutter/bin/flutter build apk --target-platform=android-arm64 --flavor=client --release --target=lib/main.dart --no-tree-shake-icons"]