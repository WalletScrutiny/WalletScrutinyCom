{ pkgs ? import <nixpkgs> { } }:

let
  versionName = "10.16";
  workDir = "/tmp/test_de.schildbach.wallet";
  repo = "https://github.com/bitcoin-wallet/bitcoin-wallet";
  tag = "v${versionName}";
  builtApk = "${workDir}/app/wallet/build/outputs/apk/prod/release/bitcoin-wallet-prod-release-unsigned.apk";
in pkgs.buildFHSUserEnv {
  name = "bitcoin-wallet-env";
  targetPkgs = pkgs: with pkgs; [
    openjdk11
    sdkmanager
    gradle
    wget
    disorderfs
  ];

  runScript = ''
    # Clone repository
    git clone --branch ${tag} ${repo} ${workDir}

    # Update and install dependencies
    apt update
    apt -y upgrade
    apt install -y sdkmanager gradle openjdk-11-jdk-headless wget disorderfs
    yes | sdkmanager --licenses > /dev/null || true

    # Setup and build with disorderfs
    mkdir /sorted/
    disorderfs --sort-dirents=yes --reverse-dirents=no ${workDir}/app /sorted/
    cd /sorted/
    
    export ANDROID_HOME="/opt/android-sdk"
    gradle --no-build-cache --no-daemon --no-parallel clean :wallet:assembleRelease
    
    echo "CTRL-D to continue";
    bash
  '';
}
