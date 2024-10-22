{ pkgs ? import <nixpkgs> {
    config.android_sdk.accept_license = true;
    config.allowUnfree = true;
  }
}:

pkgs.mkShell {
  buildInputs = [
    pkgs.gradle_6
    pkgs.openjdk11     # Verwende nur JDK 11
    pkgs.wget
    pkgs.disorderfs
    pkgs.androidsdk_30_0_3
  ];
}
