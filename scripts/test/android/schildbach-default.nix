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
    # rev wird automatisch ermittelt
  };

  nativeBuildInputs = with pkgs; [
    gradle
    jdk11
    androidenv.androidPkgs_9_0.platform-tools
    androidenv.androidPkgs_9_0.sdk
    wget
    disorderfs
  ];

  # Setze Umgebungsvariablen
  ANDROID_HOME = "${pkgs.androidenv.androidPkgs_9_0.sdk}/share/android-sdk";
  GRADLE_OPTS = "-Dorg.gradle.daemon=false -Dorg.gradle.parallel=false";

  # Build-Phase
  buildPhase = ''
    # Akzeptiere Lizenzen
    ${sdkmanager-with-licenses}/bin/sdkmanager-with-licenses

    # Erstelle sortiertes Verzeichnis
    mkdir -p $TMPDIR/sorted
    disorderfs --sort-dirents=yes --reverse-dirents=no $PWD $TMPDIR/sorted
    cd $TMPDIR/sorted

    # Build APK
    gradle --no-build-cache --no-daemon --no-parallel clean :wallet:assembleRelease
  '';

  # Install-Phase
  installPhase = ''
    mkdir -p $out/apk
    cp app/wallet/build/outputs/apk/prod/release/bitcoin-wallet-prod-release-unsigned.apk $out/apk/
  '';

  # Deaktiviere Prüfungen, die den Build stören könnten
  phases = [ "unpackPhase" "buildPhase" "installPhase" ];
  dontFixup = true;
  dontStrip = true;

  # Metadaten
  meta = with pkgs.lib; {
    description = "Bitcoin Wallet for Android";
    homepage = "https://github.com/bitcoin-wallet/bitcoin-wallet";
    license = licenses.gpl3;
    platforms = platforms.linux;
    maintainers = [];
  };
}