{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    # Basic tools
    bash
    git
    unzip
    diffoscope
    
    # Android build tools
    androidsdk
    gradle
    jdk11
    
    # Additional tools
    wget
    disorderfs
  ];

  # Environment variables
  shellHook = ''
    export ANDROID_HOME=${pkgs.androidsdk}/libexec/android-sdk
    export PATH=$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$PATH
  '';
}
