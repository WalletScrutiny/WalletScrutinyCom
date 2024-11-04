{ pkgs ? import <nixpkgs> {} }:

let
  versionName = "10.16";
  
  sdkmanager-with-licenses = pkgs.writeShellScriptBin "sdkmanager-with-licenses" ''
    yes | ${pkgs.androidsdk}/bin/sdkmanager --licenses >/dev/null || true
    exec ${pkgs.androidsdk}/bin/sdkmanager "$@"
  '';

in pkgs.stdenv.mkDerivation rec {
  pname = "bitcoin-wallet";
  version = versionName;

  src = pkgs.fetchGit {
    url = "https://github.com/bitcoin-wallet/bitcoin-wallet.git";
    ref = "v${version}";
    # rev will be determined automatically
  };

  nativeBuildInputs = with pkgs; [
    gradle
    jdk11
    androidenv.androidPkgs_9_0.platform-tools
    androidenv.androidPkgs_9_0.sdk
    wget
    disorderfs
  ];

  # Set environment variables
  ANDROID_HOME = "${pkgs.androidenv.androidPkgs_9_0.sdk}/share/android-sdk";
  GRADLE_OPTS = "-Dorg.gradle.daemon=false -Dorg.gradle.parallel=false";

  # Build phase
  buildPhase = ''
    # Accept licenses
    ${sdkmanager-with-licenses}/bin/sdkmanager-with-licenses

    # Create sorted directory
    mkdir -p $TMPDIR/sorted
    disorderfs --sort-dirents=yes --reverse-dirents=no $PWD $TMPDIR/sorted
    cd $TMPDIR/sorted

    # Build APK
    gradle --no-build-cache --no-daemon --no-parallel clean :wallet:assembleRelease
  '';

  # Install phase
  installPhase = ''
    mkdir -p $out/apk
    cp app/wallet/build/outputs/apk/prod/release/bitcoin-wallet-prod-release-unsigned.apk $out/apk/
  '';

  # Disable checks that could interfere with the build
  phases = [ "unpackPhase" "buildPhase" "installPhase" ];
  dontFixup = true;
  dontStrip = true;

  # Metadata
  meta = with pkgs.lib; {
    description = "Bitcoin Wallet for Android";
    homepage = "https://github.com/bitcoin-wallet/bitcoin-wallet";
    license = licenses.gpl3;
    platforms = platforms.linux;
    maintainers = [];
  };
}