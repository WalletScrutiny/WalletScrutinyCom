#!/bin/bash
# Provide this script with the version without "v" and the screen (one of "color" or "mono")
# You can also optionally provide the published build hash and SHA256 hash of the binary
# to have the script compare hashes automatically.
version=$1
screen=$2
buildHash=$3
releaseHash=$4
if [[ $2 == "color" ]]; then
    fileName=v${version}-passport.bin
elif [[ $2 == "mono" ]]; then
    fileName=v${version}-founders-passport.bin
else
    echo 'Please specify one of "color" or "mono"'
    exit 1
fi

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
docker build -t foundation-devices/passport2:latest .
if [[ $2 == "color" ]]; then
    /tmp/passport/just build-firmware color
elif [[ $2 == "mono" ]]; then
    /tmp/passport/just build-firmware mono
fi

# Print build hash and expected build hash
echo "Built v${version} binary sha256 hash:"
if [[ $2 == "color" ]]; then
    shasum -b -a 256 ports/stm32/build-Passport/firmware-COLOR.bin
elif [[ $2 == "mono" ]]; then
    shasum -b -a 256 ports/stm32/build-Passport/firmware-MONO.bin
fi
if [[ "$3" ]]; then
    echo "Expected v${version} build hash:"
    echo $buildHash
    if [[ $2 == "color" ]]; then
        echo "$buildHash *ports/stm32/build-Passport/firmware-COLOR.bin" | sha256sum --check
    elif [[ $2 == "mono" ]]; then
        echo "$buildHash *ports/stm32/build-Passport/firmware-MONO.bin" | sha256sum --check
    fi
fi

# Print binary hash and expected binary hash
echo "v${version} release binary sha256 hash:"
shasum -b -a 256 ../${fileName}
if [[ "$4" ]]; then
    echo "Expected v${version} release binary hash:"
    echo $releaseHash
    echo "$releaseHash ../${fileName}" | sha256sum --check
fi

# Verify stripped release binary matches built binary
echo "Comparing v${version} stripped release binary hash:"
echo "For more info, visit https://github.com/Foundation-Devices/passport2/blob/main/REPRODUCIBILITY.md#verify-release-binary-hash"
dd if=../${fileName} of=no-header-${fileName} ibs=2048 skip=1 status=none
if [[ $2 == "color" ]]; then
    binaryHash=($(shasum -b -a 256 ports/stm32/build-Passport/firmware-COLOR.bin))
elif [[ $2 == "mono" ]]; then
    binaryHash=($(shasum -b -a 256 ports/stm32/build-Passport/firmware-MONO.bin))
fi
echo "Expected v${version} build hash:"
echo $binaryHash
echo "$binaryHash no-header-${fileName}" | sha256sum --check

# Cleanup all downloaded files and build artifacts
cd ~
rm -rf /tmp/passport/
docker image rm foundation-devices/passport2:latest
