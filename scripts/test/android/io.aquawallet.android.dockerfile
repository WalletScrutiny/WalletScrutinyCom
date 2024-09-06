# Use a base image with Nix and Flutter pre-installed
FROM nixos/nix:2.16.1 as builder

# Install required packages and tools
RUN nix-env -iA nixpkgs.bash nixpkgs.git nixpkgs.curl nixpkgs.flutter nixpkgs.util-linux nixpkgs.gnupg nixpkgs.yarn

# Set the working directory
WORKDIR /app

# Clone the Aqua Wallet repository
RUN git clone https://github.com/AquaWallet/aqua-wallet.git .

# Configure Git
RUN git config --global http.postBuffer 524288000

# Run 'make setup' to pull all dependencies and pre-built binaries for GDK and boltz-rust
RUN nix develop --experimental-features 'nix-command flakes' --command /bin/bash -c "make setup"

# Build the APK
RUN nix develop --experimental-features 'nix-command flakes' --command /bin/bash -c "flutter build apk --release"

# Use a minimal image to copy the built APK
FROM alpine:latest

# Create output directory
RUN mkdir -p /home/keraliss/projects/walletScrutiny_build/aqua

# Copy the generated APK from the builder stage
COPY --from=builder /app/build/app/outputs/flutter-apk/app-release.apk /home/keraliss/projects/walletScrutiny_build/aqua/

# Final command
CMD ["/bin/sh"]
