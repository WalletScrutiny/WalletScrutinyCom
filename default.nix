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

  # Environment variables
  shellHook = ''
    export ANDROID_HOME=${pkgs.androidsdk}/libexec/android-sdk
    export PATH=$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$PATH
  '';
}
