#!/bin/bash

### provide this script with the version without "v" and the published buildHash

version=$1
ARCHIVE=/tmp  # Set ARCHIVE to /tmp to ensure write permissions
WORKSPACE="$HOME/wsTest"  # Use $HOME instead of ~

# recreate and cd into test folder
if [ -d "$WORKSPACE" ]; then
    read -p "Directory $WORKSPACE already exists. Would you like to remove it? (y/n): " response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        rm -rf "$WORKSPACE"
    else
        echo "Aborting script as $WORKSPACE already exists and cannot be removed."
        exit 1
    fi
fi

mkdir -p "$WORKSPACE"
cd "$WORKSPACE" || exit 1

# clone the repository with retry logic
MAX_RETRIES=3
retry_count=0
while [ $retry_count -lt $MAX_RETRIES ]; do
    echo "Attempting to clone repository (attempt $((retry_count + 1))/$MAX_RETRIES)..."
    if git clone --depth 1 https://github.com/BitBoxSwiss/bitbox02-firmware; then
        break
    fi
    retry_count=$((retry_count + 1))
    if [ $retry_count -eq $MAX_RETRIES ]; then
        echo "Failed to clone repository after $MAX_RETRIES attempts"
        exit 1
    fi
    echo "Clone failed, retrying in 5 seconds..."
    sleep 5
done

cd bitbox02-firmware || exit 1

# Download the firmware using wget with retry
MAX_RETRIES=3
retry_count=0
while [ $retry_count -lt $MAX_RETRIES ]; do
    if wget -O "firmware-btc.v${version}.signed.bin" \
        "https://github.com/BitBoxSwiss/bitbox02-firmware/releases/download/firmware-btc-only%2Fv${version}/firmware-btc.v${version}.signed.bin"; then
        break
    fi
    retry_count=$((retry_count + 1))
    if [ $retry_count -eq $MAX_RETRIES ]; then
        echo "Failed to download firmware after $MAX_RETRIES attempts"
        exit 1
    fi
    echo "Download failed, retrying in 5 seconds..."
    sleep 5
done

# keep a copy of signed download for later ...
cp "firmware-btc.v${version}.signed.bin" "$ARCHIVE/bitbox02-firmware-btc.v${version}.signed.bin"

signedHash=$(sha256sum "firmware-btc.v${version}.signed.bin")

# build btc only version
if [ ! -f "releases/build.sh" ]; then
    echo "Error: build.sh not found. Repository structure may have changed."
    exit 1
fi

./releases/build.sh "firmware-btc-only/v${version}" "make firmware-btc"
builtHash=$(sha256sum temp/build/bin/firmware-btc.bin)

# unpack signed binary
head -c 588 "firmware-btc.v${version}.signed.bin" > p_head.bin
tail -c +589 "firmware-btc.v${version}.signed.bin" > p_firmware-btc.bin
downloadStrippedSigHash=$(sha256sum p_firmware-btc.bin)
cat p_head.bin | tail -c +$(( 8 + 6 * 64 + 1 )) | head -c 4 > p_version.bin
firmwareBytesCount=$(wc -c p_firmware-btc.bin | sed 's/ .*//g')
maxFirmwareSize=884736
paddingBytesCount=$(( maxFirmwareSize - firmwareBytesCount ))
dd if=/dev/zero ibs=1 count=$paddingBytesCount 2>/dev/null | tr "\000" "\377" > p_padding.bin
downloadFirmwareHash=$( cat p_version.bin p_firmware-btc.bin p_padding.bin | sha256sum | cut -c1-64 | xxd -r -p | sha256sum | cut -c1-64 )

echo "Hashes of
signed download             $signedHash
signed download minus sig.  $downloadStrippedSigHash
built binary                $builtHash
firmware as shown in device $downloadFirmwareHash
                           (The latter is a double sha256 over version,
                            firmware and padding)"