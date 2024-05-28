FROM instrumentisto/flutter:3.10

RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
RUN . ~/.bashrc
RUN rustup install 1.67.1 1.72.0 1.73.0 -y;
RUN rustup default 1.67.1;


RUN curl -fsSL https://fvm.app/install.sh | bash;

WORKDIR /mnt

RUN git clone https://github.com/AquaWallet/aqua-wallet.git;


RUN fvm use 3.10.6;

RUN make setup;


CMD ["flutter","build","apk"]