FROM instrumentisto/flutter:latest

ARG TAG


RUN sudo apt-get install libssl-dev curl unzip automake build-essential file pkg-config git python libtool libtinfo5 cmake libgit2-dev clang libncurses5-dev libncursesw5-dev zlib1g-dev llvm python3-distutils;

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh;
RUN source ~/.bashrc ;
RUN rustup install 1.67.1 1.72.0 1.73.0;
RUN rustup default 1.67.1;

RUN cargo install cargo-ndk --version 2.12.7 --locked;

RUN sudo apt-get install libc6-dev-i386; 

RUN rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android;

RUN sudo apt-get install clang cmake ninja-build pkg-config libgtk-3-dev liblzma-dev meson python3-pip libgirepository1.0-dev valac xsltproc docbook-xsl;

RUN sudo apt-get install libssl-dev curl unzip automake build-essential file pkg-config git libtool cmake libgit2-dev clang libncurses-dev zlib1g-dev llvm python3;

RUN sudo apt-get install python3-pip;

RUN sudo apt-get install libgcrypt20-dev

RUN sudo apt-get install python3-jinja2 python3-markdown python3-markupsafe python3-packaging python3-pygments python3-Typogrify;

RUN git clone --branch $TAG https://github.com/BlueWallet/BlueWallet /Users/runner/work/1/s/;

WORKDIR /Users/runner/work/1/s/

RUN git submodule update --init --recursive;

RUN cd scripts/linux;

RUN ./build_secure_storage_deps.sh;

RUN cd ../..;

RUN cd scripts/android;

RUN ./build_all.sh;

RUN cd ../..;

RUN apt install podman;

RUN dart run coinlib:build_linux;

CMD ["flutter","build","apk"];


