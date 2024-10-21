{ pkgs ? import <nixpkgs> { 
    config.android_sdk.accept_license = true; 
    config.allowUnfree = true; 
} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.gradle
    pkgs.openjdk11
    pkgs.wget
    pkgs.disorderfs
    pkgs.androidenv.androidPkgs.androidsdk
  ];

  shellHook = ''
    # Set Android SDK environment variable
    export ANDROID_HOME=${pkgs.androidenv.androidsdk}

    echo "Android build environment is set up."
  '';
}
