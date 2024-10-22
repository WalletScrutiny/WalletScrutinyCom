{ pkgs ? import <nixpkgs> {
    config.android_sdk.accept_license = true;
    config.allowUnfree = true;
    config.allowUnsupportedSystem = true;
  }
}:

pkgs.mkShell {
  buildInputs = [
    pkgs.gradle_6
    pkgs.openjdk11     # Verwende nur JDK 11
    pkgs.wget
    pkgs.disorderfs
    
  ];

  shellHook = ''
    # Set Android SDK environment variable
    echo "Android build environment is set up."
  '';
}
