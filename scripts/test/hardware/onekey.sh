#!/bin/bash

### provide this script with the version without "v" and device type (classic, mini)
### and short release date (mmdd like 0511) which is the suffix of the released binary

version=$1
type=$2
short_release_date=$3

if [[ $type == mini ]]; then
    build_script="export ONEKEY_MINI=1 && poetry run ./legacy/script/cibuild"
elif [[ $type == classic ]]; then
    build_script="poetry run ./legacy/script/cibuild"
fi

rm -rf /tmp/onekey_firmware
mkdir /tmp/onekey_firmware
chmod 777 /tmp/onekey_firmware
cd /tmp/onekey_firmware
podman run --rm -v ${PWD}:/firmware ubuntu:20.04 bash -x -c "
    apt update
    apt -y upgrade
    apt install -y curl xz-utils sudo git wget g++
    useradd -m nixuser
    groupadd -r nixbld
    usermod -aG nixbld nixuser
    mkdir /nix
    install -d -m755 -o \$(id nixuser -u) -g \$(id nixuser -g) /nix
    sudo -H -u nixuser bash -c -x 'sh <(curl -L https://nixos.org/nix/install) --no-daemon
        . ~/.nix-profile/etc/profile.d/nix.sh
        cd ~
        git clone https://github.com/OneKeyHQ/firmware
        cd firmware
        git checkout ${type}/v${version}
        BOOT_VERSION=\$(./tools/version.sh ./legacy/bootloader/version.h)
        FIRMWARE_VERSION=${version}
        BUILD_DATE=\$(git --no-pager log -1 --format=%cd --date=format:\"%Y%m%d\" classic/v${version})
        SHORT_HASH=\$(git rev-parse --short HEAD)
        PRODUCTION=1
        nix-shell --run \"poetry install\"
        nix-shell --run \"poetry run ./legacy/script/setup\"
        nix-shell --run \"$build_script\"
        cp ./legacy/firmware/${type}*Stable*.bin /firmware
        cd /firmware
        wget -O \"downloaded-firmware.bin\" \
            \"https://github.com/OneKeyHQ/firmware/releases/download/${type}%2Fv${version}/${type}.${version}-Stable-\${short_release_date}-\${SHORT_HASH:0:-2}.signed.bin\"'"
sha256sum *