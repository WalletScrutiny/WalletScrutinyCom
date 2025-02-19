# onekey.dockerfile
FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive

# Install required packages
RUN apt update && apt -y upgrade && \
    apt install -y curl xz-utils sudo git wget g++ locales ca-certificates gnupg2 jq && \
    locale-gen en_US.UTF-8 && \
    rm -rf /var/lib/apt/lists/*

# Create a non-root user 'nixuser' and group 'nixbld'
RUN groupadd -r nixbld && \
    useradd -m -s /bin/bash nixuser && \
    usermod -aG nixbld nixuser && \
    usermod -aG sudo nixuser && \
    echo "nixuser ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/nixuser

# Set up Nix environment
RUN mkdir -p /nix /home/nixuser/.config/nix && \
    chown nixuser:nixuser /nix && \
    echo "experimental-features = nix-command flakes" > /home/nixuser/.config/nix/nix.conf && \
    chown -R nixuser:nixuser /home/nixuser

# Switch to nixuser
USER nixuser
WORKDIR /home/nixuser

# Install Nix in single-user mode
RUN curl -L https://nixos.org/nix/install | sh && \
    . $HOME/.nix-profile/etc/profile.d/nix.sh && \
    mkdir -p $HOME/.config/nixpkgs && \
    echo "{ allowUnfree = true; }" > $HOME/.config/nixpkgs/config.nix

# Set up environment variables
ENV USER=nixuser \
    PATH=/home/nixuser/.nix-profile/bin:/home/nixuser/.local/bin:$PATH \
    NIX_PATH=/home/nixuser/.nix-defexpr/channels \
    NIX_SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt \
    HOME=/home/nixuser

# Use bash as default shell
SHELL ["/bin/bash", "-c"]

# Pre-create .local directory with open permissions to avoid permission issues
RUN mkdir -p $HOME/.local && chmod -R 777 $HOME/.local