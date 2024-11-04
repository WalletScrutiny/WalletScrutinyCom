{ pkgs ? import <nixpkgs> {} }:

let
  versionName = "10.16";
  
  # Configure Android SDK environment
  androidComposition = pkgs.androidenv.composeAndroidPackages {
    toolsVersion = "26.1.1";
    platformToolsVersion = "33.0.3";
    buildToolsVersions = [ "30.0.3" ];
    includeEmulator = false;
    includeSources = false;
    platformVersions = [ "30" ];
    includedExtras = [
      "extras;android;m2repository"
      "extras;google;m2repository"
    ];
  };

  # Create a custom sdkmanager that automatically accepts licenses
  sdkmanager-with-licenses = pkgs.writeShellScriptBin "sdkmanager-with-licenses" ''
    yes | ${androidComposition.androidsdk}/bin/sdkmanager --licenses >/dev/null || true
    exec ${androidComposition.androidsdk}/bin/sdkmanager "$@"
  '';

in pkgs.stdenv.mkDerivation rec {
  pname = "bitcoin-wallet";
  version = versionName;

  # Fetch source from git repository
  src = pkgs.fetchGit {
    url = "https://github.com/bitcoin-wallet/bitcoin-wallet.git";
    ref = "v${version}";
  };

  # Define build dependencies
  nativeBuildInputs = with pkgs; [
    gradle
    jdk11
    androidComposition.platform-tools
    wget
    disorderfs
  ];

  # Set environment variables for the build
  ANDROID_HOME = "${androidComposition.androidsdk}/share/android-sdk";
  GRADLE_OPTS = "-Dorg.gradle.daemon=false -Dorg.gradle.parallel=false";
  
  # Build phase - compile the APK
  buildPhase = ''
    # Accept Android SDK licenses
    ${sdkmanager-with-licenses}/bin/sdkmanager-with-licenses

    # Create sorted directory for reproducible builds
    mkdir -p $TMPDIR/sorted
    disorderfs --sort-dirents=yes --reverse-dirents=no $PWD $TMPDIR/sorted
    cd $TMPDIR/sorted

    # Build the release APK
    gradle --no-build-cache --no-daemon --no-parallel clean :wallet:assembleRelease
  '';

  # Install phase - copy the built APK to output
  installPhase = ''
    mkdir -p $out/apk
    cp app/wallet/build/outputs/apk/prod/release/bitcoin-wallet-prod-release-unsigned.apk $out/apk/
  '';

  # Only run necessary phases and disable potentially problematic checks
  phases = [ "unpackPhase" "buildPhase" "installPhase" ];
  dontFixup = true;
  dontStrip = true;

  # Package metadata
  meta = with pkgs.lib; {
    description = "Bitcoin Wallet for Android";
    homepage = "https://github.com/bitcoin-wallet/bitcoin-wallet";
    license = licenses.gpl3;
    platforms = platforms.linux;
    maintainers = [];
  };
}