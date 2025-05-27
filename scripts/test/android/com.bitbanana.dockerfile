FROM mingc/android-build-box:1.25.0

ARG TAG

WORKDIR /mnt

VOLUME [ "/mnt/apk" ]

RUN git clone --branch $TAG https://github.com/michaelWuensch/BitBanana.git && \
    cd BitBanana && \
    ./gradlew assembleRelease &&\
    cp -r app/build/outputs/apk/release /mnt/release


CMD ["bash"]