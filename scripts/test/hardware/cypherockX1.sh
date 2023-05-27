#!/bin/bash

### provide this script with the version without "v"

version=$1

cd /tmp
git clone https://github.com/Cypherock/x1_wallet_firmware.git
cd x1_wallet_firmware
git submodule update --init --recursive
git checkout v${version}
docker build . --file Dockerfile --tag x1-wallet-app-env
mkdir build

# initial firmware
docker run -v ${PWD}/build:/out --rm -it x1-wallet-app-env /bin/ash -c "\
      cd /home/build/Release/ ;\
      cmake -DDEV_SWITCH=OFF -DDEBUG_SWITCH=OFF -DSIGN_BINARY=OFF -DCMAKE_BUILD_TYPE:STRING=Release -DFIRMWARE_TYPE=Initial -DCMAKE_EXPORT_COMPILE_COMMANDS:BOOL=ON -DCMAKE_BUILD_PLATFORM:STRING=Device -G Ninja ../../ ;\
      ninja; \
      cp Cypherock-*.bin /out"

# main firmware
docker run -v ${PWD}/build:/out --rm -it x1-wallet-app-env /bin/ash -c "\
      cd /home/build/Release/ ;\
      cmake -DDEV_SWITCH=OFF -DDEBUG_SWITCH=OFF -DSIGN_BINARY=OFF -DCMAKE_BUILD_TYPE:STRING=Release -DFIRMWARE_TYPE=Main -DCMAKE_EXPORT_COMPILE_COMMANDS:BOOL=ON -DCMAKE_BUILD_PLATFORM:STRING=Device -G Ninja ../../ ;\
      ninja; \
      cp Cypherock-*.bin /out"

wget https://github.com/Cypherock/x1_wallet_firmware/releases/download/v$version/Cypherock-{Initial,Main}.bin

sha256sum build/Cypherock-Initial.bin Cypherock-Initial.bin build/Cypherock-Main.bin Cypherock-Main.bin
