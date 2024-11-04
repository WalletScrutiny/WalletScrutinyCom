{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = with pkgs; [
    # Basic tools
    bash
    git
    unzip
    diffoscope
    
    # Android build tools
    androidenv.androidPkgs_9_0.platform-tools
    androidenv.androidPkgs_9_0.sdk
    gradle
    jdk11
    
    # Additional tools
    wget
    disorderfs
  ];

  # Environment variables
  shellHook = ''
    export ANDROID_HOME=${pkgs.androidenv.androidPkgs_9_0.sdk}/libexec/android-sdk
    export PATH=$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$PATH
  '';
} 