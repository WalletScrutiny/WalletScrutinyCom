#!/bin/bash
# Provide this script with the version without "v"
# You can also optionally provide the published build hash and SHA256 hash of the binary
# to have the script compare hashes automatically.
version=$1
buildHash=$2
releaseHash=$3
fileName=v${version}-passport.bin

# Remove any previous build artifacts
rm -rf /tmp/passport/

# Prepare the directory for building Passport's firmware
mkdir /tmp/passport
cd /tmp/passport

# Get the specified firmware release binary
wget -q --show-progress https://github.com/Foundation-Devices/passport2/releases/download/v${version}/${fileName}

# Clone the specified release branch
git clone https://github.com/Foundation-Devices/passport2.git
cd passport2
git checkout v${version}

# Install dependencies for building
# Download and extract just to /tmp/passport/just
curl --proto '=https' --tlsv1.2 -sSf https://just.systems/install.sh | bash -s -- --to /tmp/passport

# Build and verify the sha256 hash of the specified firmware version
/tmp/passport/just build-docker
/tmp/passport/just build-firmware color
/tmp/passport/just build-bootloader color

# Print build hash and expected build hash
echo "Built v${version} binary sha256 hash:"
shasum -b -a 256 ports/stm32/build-Passport/firmware-COLOR.bin
if [[ "$2" ]]; then
    echo "Expected v${version} build hash:"
    echo $buildHash
    echo "$buildHash *ports/stm32/build-Passport/firmware-COLOR.bin" | sha256sum --check
fi
# Print binary hash and expected binary hash
echo "v${version} release binary sha256 hash:"
shasum -b -a 256 ../${fileName}
if [[ "$3" ]]; then
    echo "Expected v${version} release binary hash:"
    echo $releaseHash
    echo "$releaseHash ../${fileName}" | sha256sum --check
fi
