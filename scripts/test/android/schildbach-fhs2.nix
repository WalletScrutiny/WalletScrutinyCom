{ pkgs ? import <nixpkgs> { } }:

let
  versionName = "10.16";
  workDir = "/tmp/test_de.schildbach.wallet";
  repo = "https://github.com/bitcoin-wallet/bitcoin-wallet";
  tag = "v${versionName}";
  builtApk = "${workDir}/app/wallet/build/outputs/apk/prod/release/bitcoin-wallet-prod-release-unsigned.apk";
in pkgs.stdenv.mkDerivation {
  name = "bitcoin-wallet-build";

  nativeBuildInputs = [
    pkgs.sdkmanager
    pkgs.gradle
    pkgs.openjdk11
    pkgs.disorderfs
    pkgs.git
    pkgs.wget
  ];

  buildPhase = ''
    # Create the working directory
    mkdir -p ${workDir}
    # Clone the repository
    git clone --branch ${tag} ${repo} ${workDir}

    # Accept licenses for Android SDK
    yes | ${pkgs.sdkmanager}/bin/sdkmanager --licenses >/dev/null || true

    # Setup with disorderfs for reproducible builds
    mkdir /sorted/
    ${pkgs.disorderfs}/bin/disorderfs --sort-dirents=yes --reverse-dirents=no ${workDir}/app /sorted/
    cd /sorted/

    export ANDROID_HOME=${pkgs.sdkmanager}/libexec/android-sdk
    ${pkgs.gradle}/bin/gradle --no-build-cache --no-daemon --no-parallel clean :wallet:assembleRelease

    echo "CTRL-D to continue";
    bash
  '';

  installPhase = ''
    mkdir -p $out/bin
    cp ${builtApk} $out/bin/
  '';

  meta = with pkgs.lib; {
    description = "Builds the bitcoin wallet APK with all dependencies handled via Nix for reproducibility";
    license = licenses.mit;
    maintainers = with maintainers; [ ];
  };
}
