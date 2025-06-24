#!/bin/bash

### provide this script with the version without "v" and the published buildHash
# In the future, look for https://github.com/BitBoxSwiss/bitbox02-firmware/blob/0390741568ac7b91ffa3351d3c78455597e37d97/py/bitbox02/bitbox02/communication/devices.py#L29
# for the bitBox2 Nova (new release)

version=$1
edition=${2:-btc} # Default to 'btc' if the second argument is not provided

echo -e "\033[1;36mAttempting to build BitBox02 firmware version ${version} (${edition} edition)...\033[0m"
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

# Set edition-specific variables
if [ "$edition" = "multi" ]; then
    # Multi-coin version has a different URL and filename structure
    EDITION_TAG_URL="firmware"
    EDITION_FILENAME="firmware"
    GIT_CHECKOUT_TAG="firmware/v${version}"
    MAKE_COMMAND="make firmware"
else # btc
    EDITION_TAG_URL="firmware-btc-only"
    EDITION_FILENAME="firmware-btc"
    GIT_CHECKOUT_TAG="firmware-btc-only/v${version}"
    MAKE_COMMAND="make firmware-btc"
fi

SIGNED_BINARY_FILENAME="${EDITION_FILENAME}.v${version}.signed.bin"
DOWNLOAD_URL="https://github.com/BitBoxSwiss/bitbox02-firmware/releases/download/${EDITION_TAG_URL}%2Fv${version}/${SIGNED_BINARY_FILENAME}"

# Download the firmware using wget with retry
MAX_RETRIES=3
retry_count=0
while [ $retry_count -lt $MAX_RETRIES ]; do
    if wget -O "$SIGNED_BINARY_FILENAME" "$DOWNLOAD_URL"; then
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
cp "$SIGNED_BINARY_FILENAME" "$ARCHIVE/bitbox02-firmware-${EDITION_FILENAME}.v${version}.signed.bin"

signedHash=$(sha256sum "$SIGNED_BINARY_FILENAME")

# build the firmware
if [ ! -f "releases/build.sh" ]; then
    echo "Error: build.sh not found. Repository structure may have changed."
    exit 1
fi

./releases/build.sh "${GIT_CHECKOUT_TAG}" "${MAKE_COMMAND}"
builtHash=$(sha256sum "temp/build/bin/${EDITION_FILENAME}.bin")

# unpack signed binary
head -c 588 "$SIGNED_BINARY_FILENAME" > p_head.bin
tail -c +589 "$SIGNED_BINARY_FILENAME" > p_${EDITION_FILENAME}.bin
downloadStrippedSigHash=$(sha256sum "p_${EDITION_FILENAME}.bin")
cat p_head.bin | tail -c +$(( 8 + 6 * 64 + 1 )) | head -c 4 > p_version.bin
firmwareBytesCount=$(wc -c p_${EDITION_FILENAME}.bin | sed 's/ .*//g')
maxFirmwareSize=884736
paddingBytesCount=$(( maxFirmwareSize - firmwareBytesCount ))
dd if=/dev/zero ibs=1 count=$paddingBytesCount 2>/dev/null | tr "\000" "\377" > p_padding.bin
downloadFirmwareHash=$( cat p_version.bin p_${EDITION_FILENAME}.bin p_padding.bin | sha256sum | cut -c1-64 | xxd -r -p | sha256sum | cut -c1-64 )
downloadFirmwareHash=$( cat p_version.bin p_firmware-btc.bin p_padding.bin | sha256sum | cut -c1-64 | xxd -r -p | sha256sum | cut -c1-64 )

echo "Hashes of
signed download             $signedHash
signed download minus sig.  $downloadStrippedSigHash
built binary                $builtHash
firmware as shown in device $downloadFirmwareHash
                           (The latter is a double sha256 over version,
                            firmware and padding)"