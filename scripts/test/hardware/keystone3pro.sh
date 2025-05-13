#!/bin/bash

# Usage: ./keystone3pro.sh <version> <type> <deviceGroup>
# Example: ./keystone3pro.sh 2.0.4 multicoin legacy

version=$1       # e.g. 2.0.4
type=$2          # multicoin | cypherpunk | btc
deviceGroup=$3   # legacy | modern

if [[ -z "$version" || -z "$type" || -z "$deviceGroup" ]]; then
  echo "Usage: $0 <version> <type> <deviceGroup>"
  echo "Example: $0 2.0.4 multicoin legacy"
  exit 1
fi

cd /tmp
rm -rf keystone3-firmware
git clone https://github.com/KeystoneHQ/keystone3-firmware
cd keystone3-firmware
git -c submodule.keystone3-firmware-release.update=none submodule update --init --recursive

# Build the Docker image on the master branch
docker build -t keystonehq/keystone3_baker:latest .

# Checkout the specified tag and rebuild
git checkout tags/${version}
docker run -v $(pwd):/keystone3-firmware keystonehq/keystone3_baker:latest python3 build.py -e production

# Determine correct download URL based on type + device group
if [[ "$type" == "multicoin" ]]; then
  if [[ "$deviceGroup" == "legacy" ]]; then
    url="https://keyst.one/contents/KeystoneFirmwareG3/v${version}/web3/legacy_ota/keystone3.bin"
  else
    url="https://keyst.one/contents/KeystoneFirmwareG3/v${version}/web3/keystone3.bin"
  fi
elif [[ "$type" == "cypherpunk" ]]; then
  if [[ "$deviceGroup" == "legacy" ]]; then
    url="https://keyst.one/contents/KeystoneFirmwareG3/v${version}-cypherpunk/cypherpunk/legacy_ota/keystone3.bin"
  else
    url="https://keyst.one/contents/KeystoneFirmwareG3/v${version}/cypherpunk/keystone3.bin"
https://keyst.one/contents/KeystoneFirmwareG3/v2.0.4/cypherpunk/keystone3.bin
  fi
elif [[ "$type" == "btc" ]]; then
  if [[ "$deviceGroup" == "legacy" ]]; then
    url="https://keyst.one/contents/KeystoneFirmwareG3/v${version}-btc/btc_only/legacy_ota/keystone3.bin"
  else
    url="https://keyst.one/contents/KeystoneFirmwareG3/v${version}-btc/btc_only/keystone3.bin"
  fi
else
  echo "Unknown firmware type: $type"
  exit 1
fi

# Download remote binary
echo "📥 Downloading: $url"
wget -O keystone3.bin "$url"

# Build fmm and fmc tools
cd /tmp/keystone3-firmware
cargo build --manifest-path tools/code/firmware-maker/Cargo.toml
./tools/code/firmware-maker/target/debug/fmm --source build/mh1903.bin --destination keystone3-unsigned.bin

cargo build --manifest-path tools/code/firmware-checker/Cargo.toml
./tools/code/firmware-checker/target/debug/fmc --source keystone3-unsigned.bin

# Check if download was successful and not empty
if [[ -s keystone3.bin ]]; then
  echo "✅  Download of keystone3.bin successful from $url"
else
  echo "⚠️  Download of keystone3.bin failed or resulted in an empty file from $url"
fi


# Display comparison results
echo "------------------------"
echo "(SIGNED) Binary from Keystone Website:"
sha256sum keystone3.bin
echo "------------------------"

echo "------------------------"
echo "Binary from build process:"
sha256sum ./build/mh1903.bin
echo "------------------------"

echo "------------------------"
echo "Unsigned Binary from Keystone Website:"
./tools/code/firmware-checker/target/debug/fmc --source keystone3-unsigned.bin
echo "------------------------"

echo "✅ Unsigned .bin hash must be the same as mh1903.bin."