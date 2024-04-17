#!/bin/bash
# Provide this script with the version without "v" and the screen (one of "color" or "mono")
# You can also optionally provide the published build hash and SHA256 hash of the binary
# to have the script compare hashes automatically.
version=$1
screen=$2
buildHash=$3
releaseHash=$4
gitRevision="${5:-v$version}"
dockerImage="foundation-devices/passport2:latest"

# Set file name according to model specified
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
docker image rm ${dockerImage}

# Prepare the directory for building Passport's firmware
mkdir /tmp/passport
cd /tmp/passport

# Get the specified firmware release binary
wget -q --show-progress https://github.com/Foundation-Devices/passport2/releases/download/v${version}/${fileName}

# Clone the specified release branch
git clone https://github.com/Foundation-Devices/passport2.git
cd passport2
git checkout ${gitRevision}

# Build the Docker image used for building firmware reproducibly
docker build --no-cache -t ${dockerImage} .

# Build mpy-cross within the Docker image
docker run --rm \
    --volume "$PWD":/workspace \
    --user $(id -u):$(id -g) \
    --workdir /workspace \
    --env MPY_CROSS="/workspace/mpy-cross/mpy-cross-docker" \
    ${dockerImage} \
    make -C mpy-cross PROG=mpy-cross-docker BUILD=build-docker
# Specify correct build flags for each model and
# build the appropriate firmware file within Docker
if [[ $model == "color" ]]; then
    buildCommand=(make -C ports/stm32/ LV_CFLAGS='-DLV_COLOR_DEPTH=16 -DLV_COLOR_16_SWAP -DLV_TICK_CUSTOM=1 -DSCREEN_MODE_COLOR -DHAS_FUEL_GAUGE' BOARD=Passport SCREEN_MODE=COLOR FROZEN_MANIFEST='boards/Passport/manifest.py')
elif [[ $model == "mono" ]]; then
    buildCommand=(make -C ports/stm32/ LV_CFLAGS='-DLV_COLOR_DEPTH=16 -DLV_COLOR_16_SWAP -DLV_TICK_CUSTOM=1 -DSCREEN_MODE_MONO' BOARD=Passport SCREEN_MODE=MONO FROZEN_MANIFEST='boards/Passport/manifest.py')
fi
docker run --rm \
    --volume "$PWD":/workspace \
    --user $(id -u):$(id -g) \
    --workdir /workspace \
    --env MPY_CROSS="/workspace/mpy-cross/mpy-cross-docker" \
        ${dockerImage} \
    "${buildCommand[@]}"

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
# For more info, visit https://github.com/Foundation-Devices/passport2/blob/main/REPRODUCIBILITY.md#verify-release-binary-hash
echo "Comparing v${version} stripped release binary hash:"
# Strip first 2048 bytes, including header, signatures, and zeroed bytes
# To verify the stripped bytes, visit https://github.com/Foundation-Devices/passport2/blob/main/REPRODUCIBILITY.md#verifying-the-firmware-header-optional
dd if=../${fileName} of=no-header-${fileName} ibs=2048 skip=1 status=none
# Print stripped binary hash and expected binary hash
binaryHash=($(sha256sum ports/stm32/build-Passport/firmware-${model^^}.bin))
echo "Expected v${version} build hash:"
echo $binaryHash
echo "$binaryHash no-header-${fileName}" | sha256sum --check
