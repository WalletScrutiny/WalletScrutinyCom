FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive
ENV FLUTTER_VERSION=2.8.1
ENV FLUTTER_HOME=/opt/flutter
ENV PATH=$PATH:$FLUTTER_HOME/bin

RUN apt-get update && apt-get install -y curl git unzip xz-utils zip libglu1-mesa openjdk-8-jdk wget

RUN useradd -m developer
USER developer
WORKDIR /home/developer

RUN git clone https://github.com/flutter/flutter.git $FLUTTER_HOME && \
    cd $FLUTTER_HOME && \
    git checkout $FLUTTER_VERSION && \
    flutter precache && \
    flutter doctor

WORKDIR /app
CMD ["flutter", "build", "apk", "--release", "--dart-define=screenshot=true"]
