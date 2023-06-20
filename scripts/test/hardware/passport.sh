#!/bin/bash
# Provide this script with the version without "v" and the screen (one of "color" or "mono")
# You can also optionally provide the published build hash and SHA256 hash of the binary
# to have the script compare hashes automatically.
version=$1
screen=$2
buildHash=$3
releaseHash=$4
dockerImage="foundation-devices/passport2:latest"

if [[ $2 == "color" ]]; then
    fileName=v${version}-passport.bin
elif [[ $2 == "mono" ]]; then
    fileName=v${version}-founders-passport.bin
else
    echo 'Please specify one of "color" or "mono"'
    exit 1
fi
model=$2

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

# Build and verify the sha256 hash of the specified firmware version
docker build -t ${dockerImage} .

# Build mpy-cross within the Docker image
docker run --rm \
    --volume "$PWD":/workspace \
    --user $(id -u):$(id -g) \
    --workdir /workspace \
    --env MPY_CROSS="/workspace/mpy-cross/mpy-cross-docker" \
    ${dockerImage} \
    make -C mpy-cross PROG=mpy-cross-docker BUILD=build-docker
docker run --rm \
    --volume "$PWD":/workspace \
    --user $(id -u):$(id -g) \
    --workdir /workspace \
    --env MPY_CROSS="/workspace/mpy-cross/mpy-cross-docker" \
    ${dockerImage} \
    /usr/local/bin/just ports/stm32/build ${model}

# Print build hash and expected build hash
echo "Built v${version} binary sha256 hash:"
sha256sum ports/stm32/build-Passport/firmware-${model^^}.bin
if [[ "$3" ]]; then
    echo "Expected v${version} build hash:"
    echo $buildHash
    echo "$buildHash *ports/stm32/build-Passport/firmware-${model^^}.bin" | sha256sum --check
fi

# Print binary hash and expected binary hash
echo "v${version} release binary sha256 hash:"
sha256sum ../${fileName}
if [[ "$4" ]]; then
    echo "Expected v${version} release binary hash:"
    echo $releaseHash
    echo "$releaseHash ../${fileName}" | sha256sum --check
fi

# Verify stripped release binary matches built binary
echo "Comparing v${version} stripped release binary hash:"
echo "For more info, visit https://github.com/Foundation-Devices/passport2/blob/main/REPRODUCIBILITY.md#verify-release-binary-hash"
dd if=../${fileName} of=no-header-${fileName} ibs=2048 skip=1 status=none
binaryHash=($(sha256sum ports/stm32/build-Passport/firmware-${model^^}.bin))
echo "Expected v${version} build hash:"
echo $binaryHash
echo "$binaryHash no-header-${fileName}" | sha256sum --check

# Cleanup all downloaded files and build artifacts
cd ~
rm -rf /tmp/passport/
docker image rm foundation-devices/passport2:latest
