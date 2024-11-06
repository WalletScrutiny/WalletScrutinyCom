# cypherockX1.dockerfile

# Base image with necessary build tools
FROM cypherock/x1-firmware-builder:v0.0.0

# Set the version tag as a build argument
ARG VERSION_TAG
ENV VERSION_TAG=${VERSION_TAG}

# Working directory within the container
WORKDIR /workspace

# Clone the repository, build the firmware, and perform verification
RUN set -e && \
    echo "Cloning repository..." && \
    if [ -d "x1_wallet_firmware" ]; then \
      echo "Removing existing x1_wallet_firmware directory..."; \
      rm -rf x1_wallet_firmware; \
    fi && \
    git clone --branch ${VERSION_TAG} --depth 1 https://github.com/Cypherock/x1_wallet_firmware.git --recurse-submodules && \
    cd x1_wallet_firmware && \
    mkdir -p build && cd build && \
    echo "Building firmware..." && \
    cmake -DCMAKE_BUILD_TYPE="Release" -DFIRMWARE_TYPE="Main" -DCMAKE_BUILD_PLATFORM="Device" -G "Ninja" .. && \
    ninja && \
    echo "Calculating SHA256 checksums for built binary..." && \
    sha256sum Cypherock-Main.bin > ../build_checksum.txt && \
    cd .. && \
    echo "Downloading released firmware binary from GitHub..." && \
    wget -O Cypherock-Main-released.bin "https://github.com/Cypherock/x1_wallet_firmware/releases/download/${VERSION_TAG}/Cypherock-Main.bin" && \
    echo "Calculating SHA256 checksums..." && \
    sha256sum Cypherock-Main-released.bin > release_checksum.txt && \
    echo "Compare built and released binaries..." && \
    cat build_checksum.txt && \
    cat release_checksum.txt
