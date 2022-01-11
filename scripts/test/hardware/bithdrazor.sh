#!/bin/bash

### provide this script with the version without "v"


                WORK IN PROGRESS


version=$1

cd /tmp
rm -rf bithdrazor-firmware
git clone https://github.com/bithd/bithd-mcu
cd bithd-mcu
wget "https://github.com/bithd/bithd-mcu/releases/download/v${version}/bithd-v${version}-signed.bin"
wget "https://github.com/bithd/bithd-mcu/releases/download/v${version}/razor-v${version}-signed.bin"
cp "bithd-v${version}-signed.bin" "razor-v${version}-signed.bin" $ARCHIVE
sha256sum "bithd-v${version}-signed.bin" "razor-v${version}-signed.bin"

git checkout core/v${version}
bash -c "./build-docker.sh core/v${version}"
echo
echo "Hash of non-signature parts downloaded/compiled:"
cp trezor-${version}.bin trezor-${version}.bin.zeroed
dd if=/dev/zero of=trezor-${version}.bin.zeroed bs=1 seek=5567 count=65 conv=notrunc
sha256sum trezor-${version}.bin.zeroed build/core/firmware/firmware.bin
echo
echo "Hashes of the signed firmware:"
sha256sum "bithd-v${version}-signed.bin" "razor-v${version}-signed.bin"


    1  git clone https://github.com/bithd/bithd-mcu
    2  cd bithd-mcu/
    3  wget https://github.com/bithd/bithd-mcu/releases/download/v4.1.7/bithd-v4.1.7-signed.bin
    4  wget https://github.com/bithd/bithd-mcu/releases/download/v4.1.7/razor-v4.1.7-signed.bin
    5  sha256sum *.bin
    6  pipenv --python 3 install
    7  apt update
    8  apt install pipenv
    9  apt install pipenv --yes
   10  pipenv --python 3 install
   11  export VERSION_TAG=v4.1.7
   12  export DEVICE_MODEL=BITHD_RAZOR
   13  pipenv run ./build-firmware.sh $VERSION_TAG
   14  pipenv --python 3.8 install
   15  apt search python
   16  pipenv --python 3 install
   17  apt install pyenv
   18  curl https://pyenv.run | bash
   19  eval "$(pyenv virtualenv-init -)"
   20  bash
   21  history
   22  pipenv --python 3.8 install
   23  python --version
   24  python3 --version
   25  bash
   26  export PATH="$HOME/.pyenv/bin:$PATH"
   27  eval "$(pyenv init --path)"
   28  eval "$(pyenv virtualenv-init -)"
   29  top
   30  history

    2  pyenv
    3  export PATH="$HOME/.pyenv/bin:$PATH"
    4  eval "$(pyenv init --path)"
    5  eval "$(pyenv virtualenv-init -)"
    6  pyenv update
    7  pyenv install 3.8
    8  pyenv install 3.8.12
    9  python --version
   10  pipenv run ./build-firmware.sh $VERSION_TAG
   11  history

    1  ls
    2  ls *.bin
    3  export version=4.1.7
    4  wget "https://github.com/bithd/bithd-mcu/releases/download/v${version}/bithd-v${version}-signed.bin"
    5  wget "https://github.com/bithd/bithd-mcu/releases/download/v${version}/razor-v${version}-signed.bin"
    6  sha256sum "bithd-v${version}-signed.bin" "razor-v${version}-signed.bin"
    7  pipenv --python 3 install
    8  apt install pipenv --yes
    9  apt update && apt install pipenv --yes
   10  pipenv --python 3 install
   11  export VERSION_TAG=v4.1.7
   12  export DEVICE_MODEL=BITHD_RAZOR
   13  pipenv run ./build-firmware.sh $VERSION_TAG
   14  ls
   15  tig
   16  apt install --yes tig
   17  tig
   18  rm *.bin
   19  cd /tmp/
   20  git clone https://github.com/bithd/bithd-mcu
   21  cd bithd-mcu/
   22  pipenv --python 3 install
   23  export VERSION_TAG=v4.1.7
   24  export DEVICE_MODEL=BITHD_RAZOR
   25  pipenv run ./build-firmware.sh $VERSION_TAG
   26  apt install docker
   27  pipenv run ./build-firmware.sh $VERSION_TAG
   28  history
