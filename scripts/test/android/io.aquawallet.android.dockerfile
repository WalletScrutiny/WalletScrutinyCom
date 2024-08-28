# Use a base image with Nix installed
FROM nixos/nix:2.16.1

# Install necessary packages
RUN nix-env -iA nixpkgs.bash nixpkgs.git nixpkgs.curl nixpkgs.flutter

# Set the working directory
WORKDIR /app

# Clone the Aqua Wallet repository
RUN git clone https://github.com/AquaWallet/aqua-wallet.git .

# Install bash to make sure it is available
RUN nix-env -iA nixpkgs.bash

# Set up the environment using Nix
RUN nix develop --experimental-features 'nix-command flakes' --command /bin/bash -c \
    "make setup"

# Run the shell to ensure dependencies are set up correctly
RUN nix develop --experimental-features 'nix-command flakes' --command /bin/bash -c \
    "make shell"

# Build the APK
RUN nix develop --experimental-features 'nix-command flakes' --command /bin/bash -c \
    "flutter build apk --release"

# Copy the generated APK to the specified location on the host machine
RUN mkdir -p /home/keraliss/projects/walletScrutiny_build/aqua && \
    cp build/app/outputs/flutter-apk/app-release.apk /home/keraliss/projects/walletScrutiny_build/aqua/

# Final command (if necessary)
CMD ["bash"]


RUN mkdir -p /aqua/apk && \
    cp build/app/outputs/flutter-apk/app-release.apk /aqua/apk
