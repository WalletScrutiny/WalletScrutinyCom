---
wsId: protonWallet
title: 'Proton Wallet: Secure Bitcoin'
altTitle: 
authors:
- danny
users: 50000
appId: me.proton.wallet.android
appCountry: 
released: 2025-02-04
updated: 2025-03-12
version: 1.0.8
stars: 4.3
ratings: 
reviews: 7
website: https://proton.me
repository: https://github.com/ProtonWallet/flutter-app
issue: https://github.com/ProtonWallet/flutter-app/issues/4
icon: me.proton.wallet.android.png
bugbounty: 
meta: ok
verdict: nosource
appHashes:
- ad2518be80d0a5e2669a43ac34b0d6eee267e9ccf5255f07ac87cd1552419115
- c991c3d1278d24da85168e96aa95ab8ef1af082c9b50862fa1ad8189090f806a
- 36f28966a062069de7fb4a53c81f75640faa0117179c973efbe9f99781f4308
- 784d21ba934d509d426e98da41bac5ca5f176cbe6c5c9c0d6addc5e5c87c075d
date: 2025-02-14
signer: dcc9439ec1a6c6a8d0203f3423ee42bcc8b970628e53cb73a0393f398dd5b853
reviewArchive: 
twitter: ProtonPrivacy
social:
- https://www.reddit.com/r/ProtonMail
- https://www.instagram.com/protonprivacy
- https://www.facebook.com/Proton
- https://www.linkedin.com/company/protonprivacy
- https://mastodon.social/@protonprivacy
redirect_from: 
developerName: Proton AG
features: 

---

## Build Update 2025-02-14

With no instructions as to how to build the Proton app, we had to use an LLM to try and see what the dependencies are. We came up with this app-specific script:

```
#!/bin/bash
# me.proton.wallet.android.sh alpha.002
# This script builds the ProtonWallet Android app from source and generates split APKs
# Compatible with testAAB.sh v0.1.0-alpha.7 and above

# Exit on error
set -e

# Color Constants (matching testAAB.sh)
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
BOLD_CYAN='\033[1;36m'
NC='\033[0m' # No Color

# Function to check if a command exists or set alternative
check_command() {
    local cmd=$1
    local alt_path=$2
    
    if ! command -v "$cmd" >/dev/null 2>&1; then
        if [ -n "$alt_path" ] && [ -f "$alt_path" ]; then
            echo -e "${CYAN}Using $cmd from alternate path: $alt_path${NC}"
            eval "$cmd(){
                java -jar \"$alt_path\" \"\$@\"
            }"
        else
            echo -e "${YELLOW}Error: $cmd is required but not installed.${NC}"
            exit 1
        fi
    fi
}

# Function to check environment variables
check_env_vars() {
    local missing_vars=false
    declare -a required_vars=("workDir" "versionName" "versionCode")
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            echo -e "${YELLOW}Error: $var is not set${NC}"
            missing_vars=true
        fi
    done
    
    if [ "$missing_vars" = true ]; then
        echo -e "${YELLOW}Please ensure all required environment variables are set${NC}"
        exit 1
    fi
}

# Initial setup message
echo -e "${CYAN}Initializing ProtonWallet build process...${NC}"

# Check required dependencies
echo -e "${CYAN}Checking dependencies...${NC}"

# Check for ANDROID_SDK_ROOT or ANDROID_HOME
if [ -z "$ANDROID_SDK_ROOT" ] && [ -z "$ANDROID_HOME" ]; then
    echo -e "${YELLOW}Warning: Neither ANDROID_SDK_ROOT nor ANDROID_HOME is set${NC}"
    # Try to find Android SDK in common locations
    if [ -d "/opt/android-sdk" ]; then
        export ANDROID_SDK_ROOT="/opt/android-sdk"
        echo -e "${CYAN}Found Android SDK at /opt/android-sdk${NC}"
    fi
fi

# Set ANDROID_SDK_ROOT from ANDROID_HOME if needed
if [ -z "$ANDROID_SDK_ROOT" ] && [ -n "$ANDROID_HOME" ]; then
    export ANDROID_SDK_ROOT="$ANDROID_HOME"
fi

# Essential commands
check_command flutter
check_command git
check_command unzip

# Check Rust toolchain
if ! command -v rustup >/dev/null 2>&1; then
    echo -e "${YELLOW}Rustup not found. Installing Rust toolchain...${NC}"
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y --default-toolchain nightly
    source "$HOME/.cargo/env"
fi

# Update Rust and switch to nightly
echo -e "${CYAN}Updating Rust toolchain...${NC}"
rustup default nightly
rustup update

# Verify Cargo version
CARGO_VERSION=$(cargo --version | awk '{print $2}')
echo -e "${CYAN}Cargo version: $CARGO_VERSION${NC}"

# Force regenerate Cargo.lock with current version
echo -e "${CYAN}Regenerating Cargo.lock...${NC}"
if [ -f "$FLUTTER_APP_DIR/rust/Cargo.lock" ]; then
    rm "$FLUTTER_APP_DIR/rust/Cargo.lock"
fi

# Install required Rust targets
echo -e "${CYAN}Installing Rust targets for Android...${NC}"
rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android

# Check for Android NDK
if [ -z "$ANDROID_NDK_HOME" ]; then
    if [ -d "$ANDROID_SDK_ROOT/ndk-bundle" ]; then
        export ANDROID_NDK_HOME="$ANDROID_SDK_ROOT/ndk-bundle"
    elif [ -d "$ANDROID_SDK_ROOT/ndk" ]; then
        # Find the latest NDK version
        LATEST_NDK=$(find "$ANDROID_SDK_ROOT/ndk" -maxdepth 1 -type d | sort -V | tail -n 1)
        if [ -n "$LATEST_NDK" ]; then
            export ANDROID_NDK_HOME="$LATEST_NDK"
        fi
    fi

    if [ -z "$ANDROID_NDK_HOME" ]; then
        echo -e "${YELLOW}Warning: ANDROID_NDK_HOME not set and NDK not found${NC}"
        echo -e "${YELLOW}Rust build might fail${NC}"
    else
        echo -e "${CYAN}Found Android NDK at: $ANDROID_NDK_HOME${NC}"
    fi
fi

# Check for bundletool in various locations
BUNDLETOOL_PATHS=(
    "$ANDROID_SDK_ROOT/bundletool/bundletool.jar"
    "$ANDROID_SDK_ROOT/cmdline-tools/latest/bundletool/bundletool.jar"
    "/opt/android-sdk/bundletool/bundletool.jar"
    "/usr/local/bin/bundletool.jar"
)

BUNDLETOOL_FOUND=false
for path in "${BUNDLETOOL_PATHS[@]}"; do
    if [ -f "$path" ]; then
        check_command bundletool "$path"
        BUNDLETOOL_FOUND=true
        break
    fi
done

if [ "$BUNDLETOOL_FOUND" = false ]; then
    echo -e "${YELLOW}Warning: bundletool not found in standard locations${NC}"
    echo -e "${CYAN}Attempting to download bundletool...${NC}"
    
    # Create bundletool directory
    mkdir -p "$ANDROID_SDK_ROOT/bundletool"
    
    # Download latest bundletool
    if curl -L "https://github.com/google/bundletool/releases/latest/download/bundletool-all.jar" -o "$ANDROID_SDK_ROOT/bundletool/bundletool.jar"; then
        check_command bundletool "$ANDROID_SDK_ROOT/bundletool/bundletool.jar"
    else
        echo -e "${YELLOW}Error: Failed to download bundletool${NC}"
        exit 1
    fi
fi

# Check Flutter version and update if needed
FLUTTER_VERSION=$(flutter --version | head -n 1 | awk '{print $2}')
REQUIRED_VERSION="3.22.0"

echo -e "${CYAN}Current Flutter version: $FLUTTER_VERSION${NC}"
echo -e "${CYAN}Required Flutter version: $REQUIRED_VERSION${NC}"

# Function to update Flutter
update_flutter() {
    echo -e "${CYAN}Attempting to upgrade Flutter...${NC}"
    
    # Switch to stable channel first
    flutter channel stable
    flutter upgrade
    
    # Verify the version after upgrade
    FLUTTER_VERSION=$(flutter --version | head -n 1 | awk '{print $2}')
    if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$FLUTTER_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
        echo -e "${GREEN}Successfully upgraded Flutter to $FLUTTER_VERSION${NC}"
        return 0
    else
        return 1
    fi
}

# Check if current version meets requirement
if [ "$(printf '%s\n' "$REQUIRED_VERSION" "$FLUTTER_VERSION" | sort -V | head -n1)" = "$REQUIRED_VERSION" ]; then
    echo -e "${GREEN}Flutter version $FLUTTER_VERSION is compatible${NC}"
else
    echo -e "${YELLOW}Warning: Current Flutter version ($FLUTTER_VERSION) is below required version ($REQUIRED_VERSION)${NC}"
    
    # Check if we're in CI/Docker environment
    if [ -f "/.dockerenv" ] || [ -f "/run/.containerenv" ]; then
        echo -e "${YELLOW}Running in container environment. Will attempt to build with current version.${NC}"
        echo -e "${YELLOW}Note: This might cause compatibility issues. Consider updating the Docker image.${NC}"
    else
        # Try to update Flutter
        if ! update_flutter; then
            echo -e "${YELLOW}Failed to upgrade Flutter to required version.${NC}"
            echo -e "${YELLOW}Attempting to continue with current version...${NC}"
        fi
    fi
fi

# Check environment variables
check_env_vars

# Verify Android SDK environment
if [ -z "$ANDROID_HOME" ]; then
    echo -e "${YELLOW}Warning: ANDROID_HOME is not set${NC}"
fi

# Constants
FLUTTER_APP_DIR="$workDir/flutter-app"
OUTPUT_DIR="$workDir/built-split_apks"
REPO_URL="https://github.com/ProtonWallet/flutter-app.git"

# Create necessary directories
echo -e "${CYAN}Creating build directories...${NC}"
mkdir -p "$FLUTTER_APP_DIR"
mkdir -p "$OUTPUT_DIR"

# Ensure directories were created successfully
if [ ! -d "$FLUTTER_APP_DIR" ] || [ ! -d "$OUTPUT_DIR" ]; then
    echo -e "${YELLOW}Error: Failed to create required directories${NC}"
    exit 1
fi

# Clone the repository if it doesn't exist
if [ ! -d "$FLUTTER_APP_DIR/.git" ]; then
    echo -e "${CYAN}Cloning ProtonWallet repository...${NC}"
    if ! git clone "$REPO_URL" "$FLUTTER_APP_DIR"; then
        echo -e "${YELLOW}Error: Failed to clone repository${NC}"
        exit 1
    fi
fi

# Navigate to the app directory
cd "$FLUTTER_APP_DIR" || {
    echo -e "${YELLOW}Error: Failed to change to app directory${NC}"
    exit 1
}

# Install Flutter dependencies
echo -e "${CYAN}Installing Flutter dependencies...${NC}"
if ! flutter pub get; then
    echo -e "${YELLOW}Error: Failed to get Flutter dependencies${NC}"
    exit 1
fi

# Setup Rust environment variables
export RUST_BACKTRACE=1

# Setup Docker build environment
echo -e "${CYAN}Setting up build environment...${NC}"

# Create a Dockerfile for the build
cat > "$workDir/Dockerfile.build" << 'EOL'
FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install basic dependencies
RUN apt-get update && apt-get install -y \
    curl git build-essential pkg-config libssl-dev \
    default-jdk unzip wget software-properties-common \
    cmake ninja-build clang libgtk-3-dev

# Install Android SDK and tools
RUN mkdir -p /opt/android-sdk && cd /opt/android-sdk && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip && \
    unzip commandlinetools-linux-9477386_latest.zip && \
    rm commandlinetools-linux-9477386_latest.zip && \
    mkdir -p cmdline-tools/latest && \
    mv cmdline-tools/* cmdline-tools/latest/ 2>/dev/null || true

ENV ANDROID_SDK_ROOT=/opt/android-sdk
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=${PATH}:${ANDROID_SDK_ROOT}/cmdline-tools/latest/bin:${ANDROID_SDK_ROOT}/platform-tools

# Accept Android SDK licenses and install required components
RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-33" "build-tools;33.0.0" "ndk;25.1.8937393"

# Install Rust
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Install Flutter
RUN git clone https://github.com/flutter/flutter.git /opt/flutter
ENV PATH="/opt/flutter/bin:${PATH}"

# Configure Git for the container
RUN git config --global --add safe.directory '*'

# Pre-download Flutter dependencies and run doctor
RUN flutter doctor --android-licenses && \
    flutter config --no-analytics && \
    flutter precache && \
    flutter doctor

WORKDIR /app
EOL

# Build the Docker image
echo -e "${CYAN}Building Docker image for compilation...${NC}"
docker build --no-cache -t proton-wallet-builder -f "$workDir/Dockerfile.build" "$workDir"

# Clean up any existing container
docker rm -f proton-wallet-build 2>/dev/null || true

# Run the build in Docker
echo -e "${CYAN}Running build in Docker container...${NC}"
docker run --rm \
    --volume "$FLUTTER_APP_DIR:/app" \
    --name proton-wallet-build \
    proton-wallet-builder \
    bash -c '
        # Setup Cargo config with correct registry
        mkdir -p .cargo && \
        echo "[registries.proton_internal]" > .cargo/config.toml && \
        echo "index = \"sparse+https://proton.github.io/rust/\"" >> .cargo/config.toml && \
        echo "[net]" >> .cargo/config.toml && \
        echo "git-fetch-with-cli = true" >> .cargo/config.toml && \
        
        # Add registry alias (backup approach)
        echo "[registries.proton]" >> .cargo/config.toml && \
        echo "index = \"sparse+https://proton.github.io/rust/\"" >> .cargo/config.toml && \
        
        # Setup vendor dependencies with proper ownership
        mkdir -p vendor && \
        cd vendor && \
        git config --global --add safe.directory "*" && \
        if [ -d "andromeda" ]; then \
            cd andromeda && \
            git fetch origin && \
            git reset --hard origin/main && \
            git clean -fdx && \
            git submodule deinit -f . && \
            git submodule update --init --recursive; \
        else \
            git clone https://github.com/ProtonWallet/andromeda.git && \
            cd andromeda && \
            git submodule update --init --recursive; \
        fi && \
        git config --global --add safe.directory "$PWD" && \
        cd ../.. && \
        
        # Add Android targets for Rust
        rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android && \
        
        # Build Rust components with verbose output for debugging
        cd rust && \
        RUST_BACKTRACE=1 cargo build -vv --release && \
        cd .. && \
        
        # Build Flutter app
        flutter clean && \
        flutter pub get && \
        flutter build appbundle --release \
            --build-name="$versionName" \
            --build-number="$versionCode"
    '

# Check if the build was successful
if [ ! -f "$FLUTTER_APP_DIR/build/app/outputs/bundle/release/app-release.aab" ]; then
    echo -e "${YELLOW}Error: Failed to build app bundle${NC}"
    exit 1
fi

# The build is now handled in the Docker container above
# Just need to handle the bundletool steps

# Use bundletool to generate APKs from AAB
echo -e "${CYAN}Generating APKs from AAB...${NC}"
if ! bundletool build-apks \
    --bundle="$FLUTTER_APP_DIR/build/app/outputs/bundle/release/app-release.aab" \
    --output="$OUTPUT_DIR/app.apks" \
    --mode=universal; then
    echo -e "${YELLOW}Error: Failed to generate APKs from AAB${NC}"
    exit 1
fi

# Verify AAB exists
AAB_PATH="build/app/outputs/bundle/release/app-release.aab"
if [ ! -f "$AAB_PATH" ]; then
    echo -e "${YELLOW}Error: AAB file not found at $AAB_PATH${NC}"
    exit 1
fi

# Use bundletool to generate APKs from AAB
echo -e "${CYAN}Generating APKs from AAB...${NC}"
if ! bundletool build-apks \
    --bundle="$AAB_PATH" \
    --output="$OUTPUT_DIR/app.apks" \
    --mode=universal; then
    echo -e "${YELLOW}Error: Failed to generate APKs from AAB${NC}"
    exit 1
fi

# Extract APKs
cd "$OUTPUT_DIR" || {
    echo -e "${YELLOW}Error: Failed to change to output directory${NC}"
    exit 1
}

if ! unzip app.apks -d extracted_apks; then
    echo -e "${YELLOW}Error: Failed to extract APKs${NC}"
    exit 1
fi

# Move and rename APKs to match the expected format
if ! mv extracted_apks/universal.apk base-master.apk; then
    echo -e "${YELLOW}Error: Failed to rename APK${NC}"
    exit 1
fi

# Clean up intermediate files
rm -f app.apks
rm -rf extracted_apks

echo -e "${GREEN}Build completed successfully!${NC}"
echo -e "${CYAN}Output APK: $OUTPUT_DIR/base-master.apk${NC}"

# Clean up temporary files
rm -rf extracted_apks app.apks

echo "Build process completed. APKs are available in $OUTPUT_DIR"
```

Again, we invoke [testAAB.sh](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/testAAB.sh), which then sources the script above. This was the resulting error:

```
HEAD is now at bdf58f0 Merge branch 'fix/readme_bdk_wallet' into 'main'
info: downloading component 'rust-std' for 'aarch64-linux-android'
info: installing component 'rust-std' for 'aarch64-linux-android'
info: downloading component 'rust-std' for 'armv7-linux-androideabi'
info: installing component 'rust-std' for 'armv7-linux-androideabi'
info: downloading component 'rust-std' for 'i686-linux-android'
info: installing component 'rust-std' for 'i686-linux-android'
info: downloading component 'rust-std' for 'x86_64-linux-android'
info: installing component 'rust-std' for 'x86_64-linux-android'
    Updating crates.io index
    Updating `proton` index
error: failed to get `proton-crypto` as a dependency of package `proton_wallet_common v0.1.0 (/app/rust)`

Caused by:
  config.json not found in registry
```

> This indicates that Cargo is expecting a custom registry called proton or proton_internal to be available at https://proton.github.io/rust/, but it is not set up in a way Cargo recognizes. When Cargo tries to fetch proton-crypto from that registry, it fails because it cannot find a config.json (the standard file Cargo looks for at the root of a sparse registry).

> proton-crypto appears to be a private Rust crate (package) that is a dependency of the proton_wallet_common package in the Proton Wallet application.
>
> The error occurs because:
>
> - The build system is trying to fetch proton-crypto from a custom registry called proton
> - This registry is expected to be at https://proton.github.io/rust/
> - The build fails because it cannot find the required config.json file in that registry
> - This suggests that proton-crypto is likely a private/internal cryptography library developed by Proton for their wallet application. 

In the interim, we believe that some components of the build are set to private. We [updated our issue](https://github.com/ProtonWallet/flutter-app/issues/4#issuecomment-2658024452) to try and verify this. 

Looking at their repository ProtonWallet/flutter-app, specifically the Rust components, I cannot find any public repository named proton-crypto. This suggests that:

- proton-crypto is a private repository
- The registry is not publicly accessible

On another one of Proton's repositories called [andromeda](https://github.com/ProtonWallet/andromeda), we find in `andromeda/.cargo/config.toml`

```
[registries]
proton_internal = { index = "sparse+https://rust.gitlab-pages.protontech.ch/shared/registry/index/" }
```

For the meanwhile, we will give the verdict of **not source available**

## Build Update 2024-08-12

We initially tried to build manually from this Dockerfile:

    ```
    # Use an Ubuntu 22.04 image as a parent image
    FROM ubuntu:22.04

    # Set environment variables for non-interactive installation
    ENV DEBIAN_FRONTEND=noninteractive

    # Install necessary tools and dependencies
    RUN apt-get update && apt-get install -y \
        curl \
        unzip \
        git \
        make \
        openjdk-17-jdk \
        wget \
        zip \
        lib32stdc++6 \
        lib32z1 \
        lib32z1-dev \
        libssl-dev \
        build-essential \
        pkg-config \
        ca-certificates \
        clang \
        cmake \
        ninja-build \
        libclang-dev \
        libcurl4-openssl-dev \
        libz-dev \
        libx11-dev \
        libxcb1-dev \
        libx11-xcb-dev \
        libxrender-dev \
        libxrandr-dev \
        libxi-dev \
        libgl1-mesa-dev \
        && rm -rf /var/lib/apt/lists/*

    # Install Flutter
    RUN git clone https://github.com/flutter/flutter.git /usr/local/flutter
    ENV PATH="/usr/local/flutter/bin:/usr/local/flutter/bin/cache/dart-sdk/bin:${PATH}"

    # Enable flutter web and other setup
    RUN flutter config --enable-web && \
        flutter doctor -v

    # Accept Android SDK licenses
    RUN mkdir -p /opt/android-sdk && cd /opt/android-sdk && \
        wget https://dl.google.com/android/repository/commandlinetools-linux-7583922_latest.zip -O cmdline-tools.zip && \
        unzip cmdline-tools.zip -d /opt/android-sdk/cmdline-tools && \
        rm cmdline-tools.zip && \
        mv /opt/android-sdk/cmdline-tools/cmdline-tools /opt/android-sdk/cmdline-tools/tools && \
        yes | /opt/android-sdk/cmdline-tools/tools/bin/sdkmanager --sdk_root=/opt/android-sdk --licenses

    # Install Android SDK components
    RUN /opt/android-sdk/cmdline-tools/tools/bin/sdkmanager --sdk_root=/opt/android-sdk \
        "platform-tools" \
        "platforms;android-33" \
        "build-tools;33.0.0" \
        "ndk;25.1.8937393"

    ENV ANDROID_HOME=/opt/android-sdk
    ENV PATH=${ANDROID_HOME}/cmdline-tools/tools/bin:${ANDROID_HOME}/platform-tools:${PATH}

    # Install Rust and Cargo
    RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    ENV PATH="/root/.cargo/bin:${PATH}"

    # Update Rust to the latest stable version
    RUN rustup update stable

    # Install Rust targets for Android
    RUN rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android

    # Verify Rust and Cargo installation
    RUN rustc --version && cargo --version

    # Set the working directory
    WORKDIR /workspace

    # Clone Proton Wallet repository
    ARG REPO=https://github.com/ProtonWallet/flutter-app.git
    ARG TAG=v1.0.0+66
    RUN git clone --branch $TAG $REPO /workspace

    # Get Flutter dependencies
    RUN flutter pub get

    # Expose the terminal for interactive debugging
    CMD ["/bin/bash"]

    ```

### We then proceed with the following steps: 

`$ docker build -t proton-build .`

**Then run:**

`$ docker run --rm -it proton-build`

Inside the workspace directory I move to the `./rust` folder to find the `cargo.toml` file. I then try to run:

`cargo build --target aarch64-linux-android --release --verbose`

This results in:

```
error: failed to parse manifest at `/workspace/rust/Cargo.toml`

Caused by:
  registry index was not found in any configuration: `proton_internal`
```

We tried several times with various iterations of Docker images which we thought was compatible with flutter and rust dependencies. All of them failed. 

At this stage, we feel that this internal registry `proton_internal`, may be causing the failure of most builds. 

For this reason, we filed an [issue](https://github.com/ProtonWallet/flutter-app/issues/4) in their repository in the hopes that we can collaborate with the Proton team. For the meantime, we determine that this app's source, **does not build** due to insufficient build instructions and the possibility of internal registries that may be causing the build failures.

## App Description from Play

From their terms:

- Generate wallet addresses and associated private keys that you may use to send and receive digital assets;
- Associate said wallet addresses with your email address;
- Access third-party services through functionality made available by third-party service provider(s);
- View digital asset price information made available by third party service provider(s)
- Broadcast digital asset transaction data to various blockchains supported by Proton Wallet without requiring to download or install the associated blockchain-based software on your local device.

## Analysis 

As of 2024-07-25, the app is still in early access which would require an invite. If we go by its claims, then this app would be **for verification**