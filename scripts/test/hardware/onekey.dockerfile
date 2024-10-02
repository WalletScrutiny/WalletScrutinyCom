# onekey.dockerfile
FROM ubuntu:20.04

# Set noninteractive mode to avoid prompts during package installation
ENV DEBIAN_FRONTEND=noninteractive

# Update the package list and install dependencies
RUN apt update && apt -y upgrade && \
    apt install -y curl xz-utils sudo git wget g++ locales && \
    locale-gen en_US.UTF-8

# Create a non-root user 'nixuser' and group 'nixbld'
RUN groupadd -r nixbld && \
    useradd -m -s /bin/bash nixuser && \
    usermod -aG nixbld nixuser

# Create /nix directory and set permissions
RUN mkdir /nix && \
    chown nixuser:nixuser /nix

# Switch to 'nixuser'
USER nixuser
WORKDIR /home/nixuser

# Install Nix package manager
RUN curl -L https://nixos.org/nix/install | sh

# Source Nix profile (ensure Nix is in the PATH)
ENV USER nixuser
ENV PATH /home/nixuser/.nix-profile/bin:/home/nixuser/.nix-profile/sbin:$PATH
ENV NIX_PATH /home/nixuser/.nix-defexpr/channels

# Set the shell to bash
SHELL ["/bin/bash", "-c"]
