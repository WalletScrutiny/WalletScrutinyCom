#!/bin/bash
### provide this script with the version without "v" and device type (classic, mini)
### and short release date (mmdd like 0511) which is the suffix of the released binary
version=$1
type=$2
short_release_date=$3

if [[ $type == mini ]]; then
    boot_version_variable="BOOT_VERSION=\$(./tools/version.sh ./legacy/bootloader/version.h)"
    build_script="nix-shell --run \"poetry run ./legacy/script/setup\"
                  nix-shell --run \"export ONEKEY_MINI=1 && poetry run ./legacy/script/cibuild\"
                  cp ./legacy/firmware/${type}*Stable*.bin /firmware"
elif [[ $type == classic ]]; then
    boot_version_variable="BOOT_VERSION=\$(./tools/version.sh ./legacy/bootloader/version.h)"
    build_script="nix-shell --run \"poetry run ./legacy/script/setup\"
                  nix-shell --run \"poetry run ./legacy/script/cibuild\"
                  cp ./legacy/firmware/${type}*Stable*.bin /firmware"
elif [[ $type == touch ]]; then
    boot_version_variable="BOOT_VERSION=\$(./tools/version.sh ./core/embed/bootloader/version.h)"
    build_script="git submodule update --init --recursive
                  nix-shell --run \"poetry run make -C core build_boardloader\"
                  nix-shell --run \"poetry run make -C core build_bootloader\"
                  nix-shell --run \"poetry run make -C core build_firmware\"
                  nix-shell --run \"poetry run core/tools/headertool.py -h core/build/firmware/touch*Stable*.bin\"
                  cp ./core/build/firmware/${type}*Stable*.bin /firmware"
fi

rm -rf /tmp/onekey_firmware
mkdir /tmp/onekey_firmware
chmod 777 /tmp/onekey_firmware
cd /tmp/onekey_firmware

podman run --rm -v ${PWD}:/firmware ubuntu:20.04 bash -c "
set -x
apt update
apt -y upgrade
apt install -y curl xz-utils sudo git wget g++
useradd -m nixuser
groupadd -r nixbld
usermod -aG nixbld nixuser
mkdir /nix
install -d -m755 -o \$(id nixuser -u) -g \$(id nixuser -g) /nix
sudo -H -u nixuser bash << EOF
set -x
if ! command -v nix-env &> /dev/null
then 
    echo 'Nix is not installed. Installing Nix...'
    sh <(curl -L https://nixos.org/nix/install) --no-daemon
else
    echo 'Nix is already installed. Updating to the latest version...'
    nix-channel --update
    nix-env -u
fi
. ~/.nix-profile/etc/profile.d/nix.sh
cd ~
git clone https://github.com/OneKeyHQ/firmware
cd firmware
git checkout ${type}/v${version}
${boot_version_variable}
FIRMWARE_VERSION=${version}
BUILD_DATE=\$(git --no-pager log -1 --format=%cd --date=format:'%Y%m%d' ${type}/v${version})
SHORT_HASH=\$(git rev-parse --short HEAD)
PRODUCTION=1
echo 'DEBUG: Current directory: \$(pwd)'
pwd
echo 'DEBUG: Contents of current directory:'
ls -la
echo 'DEBUG: Contents of ci directory:'
ls -la ci/
echo 'DEBUG: Contents of ci/pyright directory:'
ls -la ci/pyright/
echo 'DEBUG: Modifying shell.nix to correct pyright path'
sed -i 's|./pyright|./ci/pyright|' shell.nix
echo 'DEBUG: Contents of shell.nix:'
cat shell.nix
echo 'DEBUG: Attempting to run nix-shell'
nix-shell --run 'echo DEBUG: Successfully entered nix-shell' || echo 'DEBUG: Failed to enter nix-shell'
echo 'DEBUG: Running nix-shell with poetry install'
nix-shell --run 'poetry install' || echo 'DEBUG: Failed to run poetry install'
echo 'DEBUG: Running nix-shell with setup script'
nix-shell --run 'poetry run ./legacy/script/setup' || echo 'DEBUG: Failed to run setup script'
echo 'DEBUG: Running nix-shell with build script'
nix-shell --run 'poetry run ./legacy/script/cibuild' || echo 'DEBUG: Failed to run build script'
echo 'DEBUG: Nix-shell commands completed'
${build_script}
cd /firmware
SHORT_HASH=$(git rev-parse --short HEAD)
# Debug prior to downloading the binary
echo "DEBUG: Current directory: $(pwd)"
echo "DEBUG: version: ${version}"
echo "DEBUG: type: ${type}"
echo "DEBUG: short_release_date: ${short_release_date}"
echo "DEBUG: SHORT_HASH value: ${SHORT_HASH}"
echo "DEBUG: Listing firmware directory content:"
ls -l

# If SHORT_HASH is empty, try to set it from the filename
if [ -z "$SHORT_HASH" ]; then
    echo "DEBUG: SHORT_HASH is empty, attempting to set it from filename"
    SHORT_HASH=$(ls ${type}.*.bin | sed -n "s/.*-\\(.......\\.bin\\)/\\1/p" | sed 's/.bin//')
    echo "DEBUG: SHORT_HASH set to: ${SHORT_HASH}"
fi

# Modify the wget command to use the correct parameters
wget -O downloaded-firmware.bin "https://github.com/OneKeyHQ/firmware/releases/download/${type}%2Fv${version}/${type}.${version}-Stable-${short_release_date}-${SHORT_HASH}.signed.bin"

# Check download result
if [ $? -eq 0 ]; then
    echo "DEBUG: Download successful"
else
    echo "DEBUG: Download failed"
    echo "DEBUG: Attempted URL: https://github.com/OneKeyHQ/firmware/releases/download/${type}%2Fv${version}/${type}.${version}-Stable-${short_release_date}-${SHORT_HASH}.signed.bin"
fi
EOF
"

sha256sum *

# Calculate the SHA-256 sum of the built firmware and the downloaded firmware
built_firmware_hash=$(sha256sum /firmware/classic*Stable*.bin | awk '{print $1}')
downloaded_firmware_hash=$(sha256sum downloaded-firmware.bin | awk '{print $1}')

# Output the results in bright cyan
echo -e "\e[96mRESULTS=========================================="
echo -e "Built firmware hash: $built_firmware_hash"
echo -e "Downloaded firmware hash: $downloaded_firmware_hash"
echo -e "=================================================\e[0m"
