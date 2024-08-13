---
wsId: ShapeShift
title: 'ShapeShift: Crypto Platform'
altTitle: 
authors:
- leo
- danny
users: 500000
appId: com.shapeshift.droid_shapeshift
appCountry: 
released: 2015-10-26
updated: 2024-06-20
version: 3.1.0
stars: 3.3
ratings: 2913
reviews: 510
size: 
website: https://ShapeShift.com
repository: https://github.com/shapeshift/mobile-app
issue: https://github.com/shapeshift/mobile-app/issues/104
icon: com.shapeshift.droid_shapeshift.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2024-08-08
signer: 
reviewArchive: 
twitter: ShapeShift_io
social:
- https://www.facebook.com/ShapeShiftPlatform
- https://www.instagram.com/shapeshift_io
- https://www.youtube.com/channel/UCrZ2Ml63kLwZJ6amqoGaZeQ
- https://t.me/shapeshiftofficial
redirect_from:
- /com.shapeshift.droid_shapeshift/
developerName: ShapeShift.com
features: 

---

## Manual Build 2024-08-08  

We started with creating a Dockerfile that can build the artifact. This Dockerfile builds a single apk. We've found that Shapeshift uses split apks, we will do that later.

```
# Use Node.js 18 as the base image
FROM node:18

# Install necessary tools
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    build-essential \
    wget \
    unzip \
    git \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables for Android SDK
ENV ANDROID_HOME /usr/lib/android-sdk
ENV PATH ${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools

# Install Android command-line tools
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    cd ${ANDROID_HOME}/cmdline-tools && \
    wget https://dl.google.com/android/repository/commandlinetools-linux-6858069_latest.zip -O tools.zip && \
    unzip tools.zip -d ${ANDROID_HOME}/cmdline-tools && \
    mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest && \
    rm tools.zip

# Install SDK packages
RUN yes | sdkmanager --sdk_root=${ANDROID_HOME} \
    "platforms;android-30" \
    "build-tools;30.0.3" \
    "platform-tools"

# Set working directory
WORKDIR /app

# Clone the repository
RUN git clone https://github.com/shapeshift/mobile-app.git .

# Checkout the specific commit
RUN git checkout 5836f656f240ce1494a2c9625365c18ae3d47bec

# Copy the .env.template to .env
RUN cp .env.template .env

# Install project dependencies
RUN yarn install

# Build the Android app
RUN cd android && ./gradlew assembleRelease

# The APK will be located at /app/android/app/build/outputs/apk/release/app-release.apk

# Set the default command
CMD ["bash"]

```

### We then run: 

`$ docker run -it shapeshift-build bash`

### We copy the built artifact in designated built artifact folder: 

`$ docker cp f26e7a7446d7:/app/android/app/build/outputs/apk/release/app-release.apk /var/shared/apk/com.shapeshift.droid_shapeshift/328/built`

### The downloaded apk's name is:

`com.shapeshift.droid_shapeshift_v328.apk` with version name **3.1.0**.

### We verify that the built artifact has the right version

`danny@lw10:/var/shared/apk/com.shapeshift.droid_shapeshift/328/built$ aapt dump badging app-release.apk | grep version`

```
package: name='com.shapeshift.droid_shapeshift' versionCode='328' versionName='3.1.0' compileSdkVersion='34' compileSdkVersionCodename='14'
```

### We create the unzip folders

```
danny@lw10:/var/shared/apk/com.shapeshift.droid_shapeshift/328$ mkdir -p /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built 
mkdir -p /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official
```

### We unzip the apks in their designated folders

```
$ unzip /var/shared/apk/com.shapeshift.droid_shapeshift/328/built/app-release.apk -d /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built
unzip /var/shared/apk/com.shapeshift.droid_shapeshift/328/official/com.shapeshift.droid_shapeshift_v328.apk -d /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official
```

### We run a diff between unzipped-built against unzipped-official

`danny@lw10:/var/shared/apk/com.shapeshift.droid_shapeshift/328$ diff -r /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official`

### Diff Results 

<details>
    <summary>Diff Result for built artifact vs official artifact</summary>
        
    ```
  
    Binary files /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/AndroidManifest.xml and /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/AndroidManifest.xml differ
    Binary files /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/classes2.dex and /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/classes2.dex differ
    Binary files /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/classes3.dex and /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/classes3.dex differ
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built: lib
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/META-INF: BNDLTOOL.RSA
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/META-INF: BNDLTOOL.SF
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/META-INF: CERT.RSA
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/META-INF: CERT.SF
    diff -r /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/META-INF/MANIFEST.MF /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/META-INF/MANIFEST.MF
    2,3d1
    < Built-By: Signflinger
    < Created-By: Android Gradle 8.2.1
    6c4
    < SHA-256-Digest: veHegrffe7G7i7zuSVF83bRnzAe6pXcJBHHYLjp8lts=
    ---
    > SHA-256-Digest: AE7YzKkcwTw+RN9Hb41JNxhrVVoDZf2vPprYFh92+n0=
    184c182
    < SHA-256-Digest: C0dVmsgEba+ewbIiabACX4e0M8bJXtNMsBgJDy8DcU4=
    ---
    > SHA-256-Digest: kfydjK8uJR8oRWbTrhGPTJbXa3fRERZR5VwBHBJ1HN0=
    187c185
    < SHA-256-Digest: kfydjK8uJR8oRWbTrhGPTJbXa3fRERZR5VwBHBJ1HN0=
    ---
    > SHA-256-Digest: C0dVmsgEba+ewbIiabACX4e0M8bJXtNMsBgJDy8DcU4=
    213,773d210
    < Name: lib/arm64-v8a/libc++_shared.so
    < SHA-256-Digest: aeUX5kWm0491NtZBCNJF9aggikpc1DN1tJBvYKYKhsQ=
    < 
    < Name: lib/arm64-v8a/libexpo-modules-core.so
    < SHA-256-Digest: kL4+Y9pAavSJBVCKKjRsxTlUrYpA9gBAm3fE755FFTY=
    < 
    < Name: lib/arm64-v8a/libfabricjni.so
    < SHA-256-Digest: xiWnNz1gSKoOWGXWZ8WYtTF3GWLpJsTTBXRqJYET9/k=
    < 
    < Name: lib/arm64-v8a/libfbjni.so
    < SHA-256-Digest: 59e0mLZg5InIvh1BU7qxWHFl5NwEyRrJk1fv4BuaQ08=
    < 
    < Name: lib/arm64-v8a/libfolly_runtime.so
    < SHA-256-Digest: mWJFTf8QJcyk4IIetmArYOYws+6R6ypZWpJb5FNeEAU=
    < 
    < Name: lib/arm64-v8a/libgifimage.so
    < SHA-256-Digest: FgRGkBt6bsJsmguzKOaHfJeBjHSHWJxxPXXF8o3qKkg=
    < 
    < Name: lib/arm64-v8a/libglog.so
    < SHA-256-Digest: +DVYo0sfSxav68JO/doQteg6bFZqiqZgbupOQTW8MTU=
    < 
    < Name: lib/arm64-v8a/libhermes.so
    < SHA-256-Digest: bVevDh5bSyPR8aP0pYWx1iMVVqxISNCymGKkkFvfn58=
    < 
    < Name: lib/arm64-v8a/libhermes_executor.so
    < SHA-256-Digest: plhKEx5MMaNzppnZxfhXXPIQMlPjpAysnaGe1hdarZI=
    < 
    < Name: lib/arm64-v8a/libhermesinstancejni.so
    < SHA-256-Digest: oxqNpO2CGijzTHpWD7TsfwVNstqjcVKOZCVcKcl9COE=
    < 
    < Name: lib/arm64-v8a/libimagepipeline.so
    < SHA-256-Digest: 78FP5bAxz63FdyAlGWzbMz3a8B8/fUIm2u2To2wsvWI=
    < 
    < Name: lib/arm64-v8a/libjscinstance.so
    < SHA-256-Digest: EmO7MW2hzOtkIuHbkoE4erET+BRJLlueMh5gTbfjMuo=
    < 
    < Name: lib/arm64-v8a/libjsi.so
    < SHA-256-Digest: 0//XjrgvX8O4iQTCnamcs8e2Co+MOSm2R5CH7BqPCJA=
    < 
    < Name: lib/arm64-v8a/libjsijniprofiler.so
    < SHA-256-Digest: SxOHvdJ4vyyFYcDOPk6vU1YACW5s5VD9vtqVtJZWEzU=
    < 
    < Name: lib/arm64-v8a/libjsinspector.so
    < SHA-256-Digest: naHgDYAiv4eVWen1cDSBkUGYHVfRo76BuP7JAsC2Ucs=
    < 
    < Name: lib/arm64-v8a/libmapbufferjni.so
    < SHA-256-Digest: MytU1VcHb39/mOB30kJFrARks3ARwdsuVabWlYwZhBU=
    < 
    < Name: lib/arm64-v8a/libnative-filters.so
    < SHA-256-Digest: /5XNxxW7Mh1EIwl3Wxg75yjAhvW1p3C/NhTo6bxzvRU=
    < 
    < Name: lib/arm64-v8a/libnative-imagetranscoder.so
    < SHA-256-Digest: pJnUVSWHnMd6ALOaiCPS1pk+bmeFE06pIExOTnVmEt0=
    < 
    < Name: lib/arm64-v8a/libreact_codegen_rncore.so
    < SHA-256-Digest: GGr00PPKR2HMmv6HjtNwOkTGyODq43D3E8WWzjRcpC4=
    < 
    < Name: lib/arm64-v8a/libreact_cxxreactpackage.so
    < SHA-256-Digest: pWmrMqGB9xcLuXbvFf83Z5oNZ/l1MncU1HcF+vZfKoI=
    < 
    < Name: lib/arm64-v8a/libreact_debug.so
    < SHA-256-Digest: /4CNKBvBWMzM228cSV/DsSV/9l5CvOGoGnzyTHbjL3Q=
    < 
    < Name: lib/arm64-v8a/libreact_devsupportjni.so
    < SHA-256-Digest: KaWcps9Mkxgi8W8jmmmAvr18sP3t5zfCndReqmrULBE=
    < 
    < Name: lib/arm64-v8a/libreact_featureflags.so
    < SHA-256-Digest: qvLq2b8cR+gYzbxlAtU9KRsH1OgJDdfTpL2a5jNey/I=
    < 
    < Name: lib/arm64-v8a/libreact_featureflagsjni.so
    < SHA-256-Digest: mVWsDjtoWGtWAVMCyUn13wuxWCRHaE8/RpXDyLq45Mo=
    < 
    < Name: lib/arm64-v8a/libreact_nativemodule_core.so
    < SHA-256-Digest: MJzIPIW6kDgNxQnzUYG/q2fLtugMKXUumKyzBqMBga0=
    < 
    < Name: lib/arm64-v8a/libreact_newarchdefaults.so
    < SHA-256-Digest: +V/jEzpuuDJ8RFHCLCmlrdY8UqZ6/BBToeoEBkpfBr0=
    < 
    < Name: lib/arm64-v8a/libreact_render_componentregistry.so
    < SHA-256-Digest: t56iciF7wZFmYi1V5ygZ/b9Onu8zYEdKN7WcLr0emEo=
    < 
    < Name: lib/arm64-v8a/libreact_render_core.so
    < SHA-256-Digest: 9+SjkVNadLTydYtOKfJ0+lkmniNHRXasraWQHKZVxIU=
    < 
    < Name: lib/arm64-v8a/libreact_render_debug.so
    < SHA-256-Digest: h7+A8klgHTAhV71Mk4a4qJeGI/Uxu7+LHDKOaH4ODsE=
    < 
    < Name: lib/arm64-v8a/libreact_render_graphics.so
    < SHA-256-Digest: MVJXMAMZPwsJ0VtxHG6o4816t9IO/0qn63+WWCcAKEI=
    < 
    < Name: lib/arm64-v8a/libreact_render_imagemanager.so
    < SHA-256-Digest: lAIHTS1dY/y30sGh7/REKAx7mEZGD3liOwMH8YuRBHU=
    < 
    < Name: lib/arm64-v8a/libreact_render_mapbuffer.so
    < SHA-256-Digest: qtu/80Tx9yoEBIm8KlhQ0vDkrOqKIiGPHEKmIpqVy+o=
    < 
    < Name: lib/arm64-v8a/libreact_utils.so
    < SHA-256-Digest: A4zegk5CU65UENZ28agohDW7PGvDIlrbC0w6eL33jII=
    < 
    < Name: lib/arm64-v8a/libreactnativeblob.so
    < SHA-256-Digest: LogU9ech3IVTGQB3DJcAwrILabOo8oTh+CP+/MLUrgM=
    < 
    < Name: lib/arm64-v8a/libreactnativejni.so
    < SHA-256-Digest: 3yXMN0Td7f2/2abBOXky9UGrG8eq6Lcn7cC1arPyVbc=
    < 
    < Name: lib/arm64-v8a/libreactperfloggerjni.so
    < SHA-256-Digest: c8LJplUsyVEToxld+ll6nEmaYzU7PYgHUUh4/1FDCNc=
    < 
    < Name: lib/arm64-v8a/librninstance.so
    < SHA-256-Digest: l9MIHJHpZIBmdcrHgriyy9yWc9l5wNtjwLI1oPwsCV0=
    < 
    < Name: lib/arm64-v8a/librrc_image.so
    < SHA-256-Digest: pS3qdBdZjelwostgpIUNJ8a8aiS+NGEvbAoIHaGWFo4=
    < 
    < Name: lib/arm64-v8a/librrc_legacyviewmanagerinterop.so
    < SHA-256-Digest: YzeXL0doyuvMfajMZwO8yg41X1UKeNzj4jYSpllB5pA=
    < 
    < Name: lib/arm64-v8a/librrc_view.so
    < SHA-256-Digest: Bp1X6CS6CVWpnr3QHoOdlklpd2YwwD5/jAOtNjsAd/8=
    < 
    < Name: lib/arm64-v8a/libruntimeexecutor.so
    < SHA-256-Digest: N3XaJqbTDgy2kOAcatIcBEKZdaWxHpD2piew+f6O62o=
    < 
    < Name: lib/arm64-v8a/libscrypt_jni.so
    < SHA-256-Digest: EY+n/Km7BkeMng7QxU7ResXaMZ47NEdzFDpzrHDGhnQ=
    < 
    < Name: lib/arm64-v8a/libstatic-webp.so
    < SHA-256-Digest: 2AT0fzrIPxTjOuF5K8I/sjWdicpvHO8FfPlSQPIls/I=
    < 
    < Name: lib/arm64-v8a/libturbomodulejsijni.so
    < SHA-256-Digest: u7h4cniYylz58CXo0FAJ9gqbuSEQLfyAwp3MDU5A8nw=
    < 
    < Name: lib/arm64-v8a/libuimanagerjni.so
    < SHA-256-Digest: 1xsabBsJa1cOCQFKw+6RTgF/aNJJlnzIvQ7fdR5yHH8=
    < 
    < Name: lib/arm64-v8a/libyoga.so
    < SHA-256-Digest: 0M751GasGuNVUxLGbGnLfpMFYmVD3hdW2ElKebu+tt8=
    < 
    < Name: lib/armeabi-v7a/libc++_shared.so
    < SHA-256-Digest: WIrYsmolg+9UCSCiZzl+xDTcKb5sAiH6hJOHwLOhaL0=
    < 
    < Name: lib/armeabi-v7a/libexpo-modules-core.so
    < SHA-256-Digest: jKPeIvepeXuQc4Z3ydo77A+eLXNcKbaNOQi3wQlwO/8=
    < 
    < Name: lib/armeabi-v7a/libfabricjni.so
    < SHA-256-Digest: HhCqYNhmkJfubMez8KiMlV2QfMZG00dQdYHVkEHW4Ms=
    < 
    < Name: lib/armeabi-v7a/libfbjni.so
    < SHA-256-Digest: h1SW4L25HcTld6Tr6AwuUsJT7Yr08a8olwCSNur7YHU=
    < 
    < Name: lib/armeabi-v7a/libfolly_runtime.so
    < SHA-256-Digest: imUia1WMXBzFVcSmtga2F18vnybbWTQLkfKVeMS5NK8=
    < 
    < Name: lib/armeabi-v7a/libgifimage.so
    < SHA-256-Digest: bk69LbRAMwOTH/jgY8W4MZ8ExSPudeRNGXXomDzSK7c=
    < 
    < Name: lib/armeabi-v7a/libglog.so
    < SHA-256-Digest: 4/HlMseoaGdvWtwvJjJ+1e5vtgF/FOfdxXziW64Gykw=
    < 
    < Name: lib/armeabi-v7a/libhermes.so
    < SHA-256-Digest: 7ClcGua/mSkSkdBpCI9Aqy9lJCeB9X/qi0N3l3je0HA=
    < 
    < Name: lib/armeabi-v7a/libhermes_executor.so
    < SHA-256-Digest: dXFtEDhDLQrNy9hIhhfa/5NA+e2jUn1EZoFTQu8pLU0=
    < 
    < Name: lib/armeabi-v7a/libhermesinstancejni.so
    < SHA-256-Digest: NHS6hK04Go3HSuJgJ31MxMlWIXkpOePmt/8jRHwJXcE=
    < 
    < Name: lib/armeabi-v7a/libimagepipeline.so
    < SHA-256-Digest: aczjyyze9qdrKSa2lK9JHuVTFX5FDfT4/pJtmUo0I44=
    < 
    < Name: lib/armeabi-v7a/libjscinstance.so
    < SHA-256-Digest: EULv2lG1tnwnceyzQyExmYChbAY0wfQpqxNQut5Wy0g=
    < 
    < Name: lib/armeabi-v7a/libjsi.so
    < SHA-256-Digest: oX9LZh8g7OutfHHVARlnELmHJ2/2eeDUowhfOhvmr1I=
    < 
    < Name: lib/armeabi-v7a/libjsijniprofiler.so
    < SHA-256-Digest: Q9sthY0jSREvT3wYNwRyeTkvp57GS3d/743Lm3UOEGY=
    < 
    < Name: lib/armeabi-v7a/libjsinspector.so
    < SHA-256-Digest: 6wytBPGzZcRABwJ3xe7qP4hG2Q2u/bwna043T60YXHM=
    < 
    < Name: lib/armeabi-v7a/libmapbufferjni.so
    < SHA-256-Digest: 8A0ariITiDQ081vDJfxB5hdpbbFe3L6BFAVvbtKXqR4=
    < 
    < Name: lib/armeabi-v7a/libnative-filters.so
    < SHA-256-Digest: irxDZU7ngeWwKdkn2Vg+jNvQ5IUNlKUeoMpzwAm9XQk=
    < 
    < Name: lib/armeabi-v7a/libnative-imagetranscoder.so
    < SHA-256-Digest: p8zBFb59qhh23kOGHjatRZMN3c9lPmIIldnovcC/5bk=
    < 
    < Name: lib/armeabi-v7a/libreact_codegen_rncore.so
    < SHA-256-Digest: 4e7JkXHM2dFFhyjvvESLYAJDiRrEToKX5FggT+F3lC0=
    < 
    < Name: lib/armeabi-v7a/libreact_cxxreactpackage.so
    < SHA-256-Digest: +sMzMns9mHAHy/BqClo4j+HJtHyaiLjvuXywGpbKvJ4=
    < 
    < Name: lib/armeabi-v7a/libreact_debug.so
    < SHA-256-Digest: LMRhJEI54XuyXpI2sKriKh9WelshFcXED18GtaAbVdo=
    < 
    < Name: lib/armeabi-v7a/libreact_devsupportjni.so
    < SHA-256-Digest: SYuvBrdFNRuJpGj3/bm3AuMt/oqhcuH3ZRf5Vmd/ySY=
    < 
    < Name: lib/armeabi-v7a/libreact_featureflags.so
    < SHA-256-Digest: WL8SjW3dzZviF2+ejZX+Fo57v4Poh/plngIhbGjX42g=
    < 
    < Name: lib/armeabi-v7a/libreact_featureflagsjni.so
    < SHA-256-Digest: ONQBF2UwOxXS0ZiOawrV6ryQk6Kqbj0w1belc7Qw9RQ=
    < 
    < Name: lib/armeabi-v7a/libreact_nativemodule_core.so
    < SHA-256-Digest: ZyjH+La2b7KSZ/PiGuDW66s3GRXlaHOKxFgFGvdqSZE=
    < 
    < Name: lib/armeabi-v7a/libreact_newarchdefaults.so
    < SHA-256-Digest: py4TplzTsrQcWKCqTFyQYjI7JYqhG/1TP31qq2fHBq8=
    < 
    < Name: lib/armeabi-v7a/libreact_render_componentregistry.so
    < SHA-256-Digest: /PAgjpPsZGjLej+Husrb8pcWv/iMhBNy7wtTNeozJMs=
    < 
    < Name: lib/armeabi-v7a/libreact_render_core.so
    < SHA-256-Digest: +GAj2+zVc8tczoNppFA1YKtb57KfRRq0m0xR1Ir6+0M=
    < 
    < Name: lib/armeabi-v7a/libreact_render_debug.so
    < SHA-256-Digest: /FWpNRnPaPtCsJkLpTsknD+4nHEGr2HTfofwGCJBso8=
    < 
    < Name: lib/armeabi-v7a/libreact_render_graphics.so
    < SHA-256-Digest: 50fEzdzfYMjzOkjJMVR2sAV+dWPR68gTAKNISxGEYbs=
    < 
    < Name: lib/armeabi-v7a/libreact_render_imagemanager.so
    < SHA-256-Digest: cxezUlqfmRtx30mOHp4zZVlr3qaWy9KZeLxy+RjoU8c=
    < 
    < Name: lib/armeabi-v7a/libreact_render_mapbuffer.so
    < SHA-256-Digest: h0Z3ra4Zi47bueNOoQD06HeZa4ddQ/jcT4vOCMLmpHg=
    < 
    < Name: lib/armeabi-v7a/libreact_utils.so
    < SHA-256-Digest: /Butc00asmDXzCyXKmqsedhd6RhUAUEGWhzeLI8TYk8=
    < 
    < Name: lib/armeabi-v7a/libreactnativeblob.so
    < SHA-256-Digest: V1GOAJ0znavUJAKvzOaayrOB5Hp+/tpKCtJ/7prnhDY=
    < 
    < Name: lib/armeabi-v7a/libreactnativejni.so
    < SHA-256-Digest: N3IAlknF5iUGfSFHfzfezwiea+2MviQJCxwizvT54pc=
    < 
    < Name: lib/armeabi-v7a/libreactperfloggerjni.so
    < SHA-256-Digest: c6luSX5+/0SgkkCPJeyfsQXBqXv8mfmpKfk1crA8pEw=
    < 
    < Name: lib/armeabi-v7a/librninstance.so
    < SHA-256-Digest: YlT2J6CAvkfgX3FOfnZcIR06ckU9s0w5gESvTlT2zKs=
    < 
    < Name: lib/armeabi-v7a/librrc_image.so
    < SHA-256-Digest: EMuTlgvjmKXdZeQZRvwFDl6nIh6HpoRqEpWKpxTgbjY=
    < 
    < Name: lib/armeabi-v7a/librrc_legacyviewmanagerinterop.so
    < SHA-256-Digest: xHh9H2Fk5e7zrNIRbrEXSJwf6mS4p8ZNMRmu37vPqA8=
    < 
    < Name: lib/armeabi-v7a/librrc_view.so
    < SHA-256-Digest: To2BSwyazDnieHULGugVW+ntUJJ9HkCf5/Ebg9IuRLw=
    < 
    < Name: lib/armeabi-v7a/libruntimeexecutor.so
    < SHA-256-Digest: 7e1GptdpavWUX5RmwlXx3xBATmdFnGYL9JDVBCPug/E=
    < 
    < Name: lib/armeabi-v7a/libscrypt_jni.so
    < SHA-256-Digest: XfitTvgSUBY86qYnwAA3AR1nY5yWA6OEcKwhjTXBQkU=
    < 
    < Name: lib/armeabi-v7a/libstatic-webp.so
    < SHA-256-Digest: 5b03LiJd4jEpgxKU63TQ761gCOyNl/oXme5/d9//INY=
    < 
    < Name: lib/armeabi-v7a/libturbomodulejsijni.so
    < SHA-256-Digest: +5EvOo5BHzdJFMH+MrA1p2OPWgtEuGhGISRNiowPmx4=
    < 
    < Name: lib/armeabi-v7a/libuimanagerjni.so
    < SHA-256-Digest: GUx15qby1zXR/reKRWwhzEGPiuTqQPcZUIgJbKpWJY8=
    < 
    < Name: lib/armeabi-v7a/libyoga.so
    < SHA-256-Digest: w1JU8xPMcpgz5+4o0Z6tZ/J5CJPvp1emgVZU46U5bAk=
    < 
    < Name: lib/armeabi/libscrypt_jni.so
    < SHA-256-Digest: hDMMqXI6fWA4jTpC3M128AZwiTc8z6ItzeXmK+8g+Ks=
    < 
    < Name: lib/mips/libscrypt_jni.so
    < SHA-256-Digest: 0IQSyoEnP+NMj/bmXYxX2djzCoYLMLTrtxjGR7DlOgw=
    < 
    < Name: lib/mips64/libscrypt_jni.so
    < SHA-256-Digest: Vwo3daguNY2pHa5lwM4krQ5Vq18ep9yqDViKRmPkbjE=
    < 
    < Name: lib/x86/libc++_shared.so
    < SHA-256-Digest: a6OHnKWzy5wntyLXDQsHZNP49qACqOvX2mpMhuyKEtw=
    < 
    < Name: lib/x86/libexpo-modules-core.so
    < SHA-256-Digest: q4pNhhIM6pCtcCOVnEY/KuqquZcjE3OPIlQEaOsqekY=
    < 
    < Name: lib/x86/libfabricjni.so
    < SHA-256-Digest: iaq3DTAJY4Mr8AaK/RuQYAlfuj6Lzg4oo8ALg+6WJRI=
    < 
    < Name: lib/x86/libfbjni.so
    < SHA-256-Digest: 1yy4yJXoNWGdIx0bANg4xSR0+gu87FRort3pzNKTZeo=
    < 
    < Name: lib/x86/libfolly_runtime.so
    < SHA-256-Digest: B9Q88+NtyKJW7T2EhQ68ztEPktfXhLs2AKrQ8UZ6vP4=
    < 
    < Name: lib/x86/libgifimage.so
    < SHA-256-Digest: ohcT4YO+Ue10wyEWBY84kBJjHAnKoqqpZMWnGLkgevc=
    < 
    < Name: lib/x86/libglog.so
    < SHA-256-Digest: f0h2BXcZXAZ8gmKks8L37ezcMj38l8iKK45hYerdrdc=
    < 
    < Name: lib/x86/libhermes.so
    < SHA-256-Digest: YPadedxnz/IBn9NeCkeNYXlKqzyzwDR+l84Ab9RGvfg=
    < 
    < Name: lib/x86/libhermes_executor.so
    < SHA-256-Digest: sSvNWEdYgi2nkhQtIsbPhQppuuT4FzO2e8FuGl/T6JI=
    < 
    < Name: lib/x86/libhermesinstancejni.so
    < SHA-256-Digest: IuY+cmaAGg1leSinUmi6/l4eKl/v8qySZXJA3Ukeavg=
    < 
    < Name: lib/x86/libimagepipeline.so
    < SHA-256-Digest: Hb4OaVFh+/+stZb6bWfgDKZj4YCVn6Yd+Ngw/rlJdhc=
    < 
    < Name: lib/x86/libjscinstance.so
    < SHA-256-Digest: 5uSoZbA8bp0gQqvLhXbNQxQ7mkdEJ8ZVQAQehYNaljk=
    < 
    < Name: lib/x86/libjsi.so
    < SHA-256-Digest: S++JXkK32us/Z9VSDeDGRkqNw8uBCFJVBKUC6gu9AcI=
    < 
    < Name: lib/x86/libjsijniprofiler.so
    < SHA-256-Digest: wQ3LAJXu2qkHiLzCs2e8M7M9pk3KURLlrjGE4SVTIOI=
    < 
    < Name: lib/x86/libjsinspector.so
    < SHA-256-Digest: 3JT0X6tEAq3jJmo/ChvTwBxhtFfUcVhbWeDAxiM1prQ=
    < 
    < Name: lib/x86/libmapbufferjni.so
    < SHA-256-Digest: n+spsZyKTWV/D0zHKkF5qQX/Hbpaipkd6HloPq+pjIs=
    < 
    < Name: lib/x86/libnative-filters.so
    < SHA-256-Digest: MhmNdRP8JBbL7zRzq6kFDf5tbP0LeyPMKJX7XW56BNI=
    < 
    < Name: lib/x86/libnative-imagetranscoder.so
    < SHA-256-Digest: DWQY+EKPKgB0PurOzD+Pws0Xv0kJwb8jvsSo/DTcfjI=
    < 
    < Name: lib/x86/libreact_codegen_rncore.so
    < SHA-256-Digest: yxlGY6cBPkv5HodAM1tQAH8EuLkEBYl4otZSfLPmzKQ=
    < 
    < Name: lib/x86/libreact_cxxreactpackage.so
    < SHA-256-Digest: QDpv4H5bqFym8QnD/dLwSEQbA7uKxiBuH7yjvhqizhI=
    < 
    < Name: lib/x86/libreact_debug.so
    < SHA-256-Digest: E7qWHWA4v/4mx1wnqcchqB4JCRCKHloeaFzb0o9O0R4=
    < 
    < Name: lib/x86/libreact_devsupportjni.so
    < SHA-256-Digest: nG6nCcfSRIP74ES4D7hRWdZR4idDs+vQpiSCvW3nnk0=
    < 
    < Name: lib/x86/libreact_featureflags.so
    < SHA-256-Digest: WZn8Q+HW6RObrzD4u+H13u+Vwapsxdr0w7mcBfs6mGw=
    < 
    < Name: lib/x86/libreact_featureflagsjni.so
    < SHA-256-Digest: RknAStn2MJtFbd3Zywnoh21fnWzQoduZlbrY57S2G/c=
    < 
    < Name: lib/x86/libreact_nativemodule_core.so
    < SHA-256-Digest: 5m7bInWAji9cx0LZMDUuqqq43SKKQD2LRr78floLlSQ=
    < 
    < Name: lib/x86/libreact_newarchdefaults.so
    < SHA-256-Digest: pD8KNpb1PnkwI6OkcubH5IQfxQF/sH5OdEehJbXBoOM=
    < 
    < Name: lib/x86/libreact_render_componentregistry.so
    < SHA-256-Digest: 37HM/2m5TQSqf484NZGkodicQqRXw3f6r/VAVsFqsJc=
    < 
    < Name: lib/x86/libreact_render_core.so
    < SHA-256-Digest: bHLmmwJ1mDY+1w7TK8Hov/9kwvby7FDvymq9RaWeAnU=
    < 
    < Name: lib/x86/libreact_render_debug.so
    < SHA-256-Digest: TkPUjr1oNT/2tPt2BapWrLnLfNnmbRtIYJWTJ/y5sR4=
    < 
    < Name: lib/x86/libreact_render_graphics.so
    < SHA-256-Digest: TZlbaUf6lP1aovvnZcA+dDZ1rWsV97A6IVDAlwtHP7M=
    < 
    < Name: lib/x86/libreact_render_imagemanager.so
    < SHA-256-Digest: zurrPvfgfNI/UVwLT8B3v3HhTY++9zkhjP+HNcl6XO8=
    < 
    < Name: lib/x86/libreact_render_mapbuffer.so
    < SHA-256-Digest: p2kngcM55iqWEgzNOOznxGOLHrvklWesLSbMvmK27ms=
    < 
    < Name: lib/x86/libreact_utils.so
    < SHA-256-Digest: gmKdZftKZtYL58bLzrQ8r5iz0qo1R3VDiJTwB2MQ8Pc=
    < 
    < Name: lib/x86/libreactnativeblob.so
    < SHA-256-Digest: HwhGMZkde2depsoUGlYE1TKJg04y+Z2JxMcP42Djce8=
    < 
    < Name: lib/x86/libreactnativejni.so
    < SHA-256-Digest: fvquvy/Iq0wLFTlJNmXvmhNSuVfV+uBdndiL2PO7xdI=
    < 
    < Name: lib/x86/libreactperfloggerjni.so
    < SHA-256-Digest: 4GGbFCUlK/9OQ23jCq3jBwc5TWHAmHOKAHVxajpxsXk=
    < 
    < Name: lib/x86/librninstance.so
    < SHA-256-Digest: 0EzstnpNJHJPHzqOEaB5vCddkQGM7bGpt0dwg9cmMcI=
    < 
    < Name: lib/x86/librrc_image.so
    < SHA-256-Digest: KM0D3kQtsNlsbSide8uYJ5CmQWVwNXyE6D6UMoyvTEg=
    < 
    < Name: lib/x86/librrc_legacyviewmanagerinterop.so
    < SHA-256-Digest: 665GjUIOOMf5enq1LNyCrgOclsEGZk2xItI24jCMAM4=
    < 
    < Name: lib/x86/librrc_view.so
    < SHA-256-Digest: VeRlqhVggsG+Pk8oF8bVlJ8xcfnvUxAx5CI7exbBhlU=
    < 
    < Name: lib/x86/libruntimeexecutor.so
    < SHA-256-Digest: OHC1CdK51UH5EIo7qSIOdFmECQ/ZJp+3qOqbm8Sc9Ks=
    < 
    < Name: lib/x86/libscrypt_jni.so
    < SHA-256-Digest: DUwrihRodJ80LkPU0tAC/9fM1py3tT01r1VyK4FSvYI=
    < 
    < Name: lib/x86/libstatic-webp.so
    < SHA-256-Digest: sOBl1Lx2TtrA/FskOBg7adlWZbdsZ9BXL0D/zN5QfOg=
    < 
    < Name: lib/x86/libturbomodulejsijni.so
    < SHA-256-Digest: rwZk/MMR+ztM0npRDt5pLz8yLVvWiGNYAjEJ28awAaw=
    < 
    < Name: lib/x86/libuimanagerjni.so
    < SHA-256-Digest: n0iEfhGfrZRPDTXQ3Ulew0Tpw5zLG3aaCafXa2a+feM=
    < 
    < Name: lib/x86/libyoga.so
    < SHA-256-Digest: mf9Nh+w63J00fPJq4Cea8n8xGr5F+fdNo04PVxivFMY=
    < 
    < Name: lib/x86_64/libc++_shared.so
    < SHA-256-Digest: RjQU/mRRqR0F4QUSx31xOkvuu30mQeSPIJ9uPS21pzo=
    < 
    < Name: lib/x86_64/libexpo-modules-core.so
    < SHA-256-Digest: 7BuKP/jfUzPA8uhOh2KJmghcspmboQF4P8cIgtHUAvg=
    < 
    < Name: lib/x86_64/libfabricjni.so
    < SHA-256-Digest: QfavfNmgqHtH3JrL1m0SzOo0rcyTE+xgegakpyCunmA=
    < 
    < Name: lib/x86_64/libfbjni.so
    < SHA-256-Digest: QK//ytLGCu4xeYjchGozsWZqwHYIFB1XWB3+Ew+kRfE=
    < 
    < Name: lib/x86_64/libfolly_runtime.so
    < SHA-256-Digest: +h/W4nga9b5YUbwT6vdiSRjVxtZIt4EtDMunkTAyHF8=
    < 
    < Name: lib/x86_64/libgifimage.so
    < SHA-256-Digest: y/hMT+sreP0sAzxNCEtOx9HRWOzL9YEw2TMqvSpluT8=
    < 
    < Name: lib/x86_64/libglog.so
    < SHA-256-Digest: zEeJNR0HuM39WFSRs/nnppnqjT+Zoi6vSnHCJDPWZ+k=
    < 
    < Name: lib/x86_64/libhermes.so
    < SHA-256-Digest: OcCAYcpesgL1OXeGy5mAKveuLNxr3V1JY+4cT1zR0NY=
    < 
    < Name: lib/x86_64/libhermes_executor.so
    < SHA-256-Digest: T6V0v6ct5FNiMLTZZQt1p3Ps9T9Pe4lcoHdIEo6B3ag=
    < 
    < Name: lib/x86_64/libhermesinstancejni.so
    < SHA-256-Digest: uzDTKijl0/5FOzBZzO8+1MchOBZCUzdac/QrCk+rD0o=
    < 
    < Name: lib/x86_64/libimagepipeline.so
    < SHA-256-Digest: ReIBixFMgZOPuilVm5bPsh9iK49223UtoX2ilXbpwyQ=
    < 
    < Name: lib/x86_64/libjscinstance.so
    < SHA-256-Digest: fte0ZIDz9KJy68NCjY0AXTP+oidhNmt1Yh5JIuHls20=
    < 
    < Name: lib/x86_64/libjsi.so
    < SHA-256-Digest: TN5Om+CZDiUdrQFvoFOL0mOcyr7XqqjUBqNGq534N5s=
    < 
    < Name: lib/x86_64/libjsijniprofiler.so
    < SHA-256-Digest: 7WXvf5qYXaLweItJtw64TfHBl6VYrVpQ5V5o897myLo=
    < 
    < Name: lib/x86_64/libjsinspector.so
    < SHA-256-Digest: NrdpcQS1fELWcsTekFurrpCucicETjjQMvGfLzACuPU=
    < 
    < Name: lib/x86_64/libmapbufferjni.so
    < SHA-256-Digest: yi4BqzDmf1jZhGmct+GZSyhwevNaF/3ZIA/emwKKxKA=
    < 
    < Name: lib/x86_64/libnative-filters.so
    < SHA-256-Digest: WXMTz8PqV667rppwIz6IjdDC24MrXNS74SxjUFcmT5k=
    < 
    < Name: lib/x86_64/libnative-imagetranscoder.so
    < SHA-256-Digest: +C4NKsAsQsHPOHTRyfBqHWfgQ7qPmxeQuKwaX7qEylo=
    < 
    < Name: lib/x86_64/libreact_codegen_rncore.so
    < SHA-256-Digest: dGqnVHHGQIXby9bHflFdOPG41ceNncJhHSTJfzU+Uy8=
    < 
    < Name: lib/x86_64/libreact_cxxreactpackage.so
    < SHA-256-Digest: zr2KuGlkGHVeU/rzIdiDtc/cejMcvTMCujqu06RZGWg=
    < 
    < Name: lib/x86_64/libreact_debug.so
    < SHA-256-Digest: zeX2z9gQ5U3+bmmCvGuIveTm7GX4vV8hC0LJpl+NoeY=
    < 
    < Name: lib/x86_64/libreact_devsupportjni.so
    < SHA-256-Digest: 0Nbm4/It3Nrnm+CMWFC97s3PeV41aIl3QETEnJOfQbs=
    < 
    < Name: lib/x86_64/libreact_featureflags.so
    < SHA-256-Digest: O1GsNDsBI0yoNE1uuuChVOmdCywoA9UEbWcLGjBKRv4=
    < 
    < Name: lib/x86_64/libreact_featureflagsjni.so
    < SHA-256-Digest: oX4FMKYkTIFH8veK+IhzQazuuA1GXsjQhv0tUWAYEYg=
    < 
    < Name: lib/x86_64/libreact_nativemodule_core.so
    < SHA-256-Digest: LiRekrF9JkuI+U1WvGzJxoaMvWdQdiAO0ynBnUr54Qo=
    < 
    < Name: lib/x86_64/libreact_newarchdefaults.so
    < SHA-256-Digest: kQ5qSUioRJup1uXIAzeLZLivlAS/gKzJH2m+KxHVZEA=
    < 
    < Name: lib/x86_64/libreact_render_componentregistry.so
    < SHA-256-Digest: pt20uNWaiF9YXsMfAof/FFrlc8C/OHUkb7VczQhK+Uo=
    < 
    < Name: lib/x86_64/libreact_render_core.so
    < SHA-256-Digest: roIipTUgKDrPYnKo7SlKLA4YlWakjMOCNakyEYG9WH0=
    < 
    < Name: lib/x86_64/libreact_render_debug.so
    < SHA-256-Digest: kX6qUgAgNeDtU7ySt829sA8AsQiQXV9IYCzVCZTSt6U=
    < 
    < Name: lib/x86_64/libreact_render_graphics.so
    < SHA-256-Digest: nkKJzuPqFungcK9OcPXjDyeAvhEPo0OqerGAzLpFOKo=
    < 
    < Name: lib/x86_64/libreact_render_imagemanager.so
    < SHA-256-Digest: dlMORb2dp3X6iZPNvW3kw0QcNipct9K+29p1r6VeMFk=
    < 
    < Name: lib/x86_64/libreact_render_mapbuffer.so
    < SHA-256-Digest: N66h6WnhIl+fk5PJI53HDuVwwfI3AgwO/8bfRtwXTHA=
    < 
    < Name: lib/x86_64/libreact_utils.so
    < SHA-256-Digest: QhIfm000Z+QRQfQ+6YnMWeSZhAsCqZ6WbfVhrH2f8yk=
    < 
    < Name: lib/x86_64/libreactnativeblob.so
    < SHA-256-Digest: jeN9dEraohyaYww0JRJScl4zTa/KtaGkcspdkFZoge0=
    < 
    < Name: lib/x86_64/libreactnativejni.so
    < SHA-256-Digest: xP3hrZA279TW3p8bXkzu9b8iTdRj/K2oTwZUh0JYd+Q=
    < 
    < Name: lib/x86_64/libreactperfloggerjni.so
    < SHA-256-Digest: r29eGVPOTuRzJizFyyS/7KFuNdpORKjb2QR5x7w6SOY=
    < 
    < Name: lib/x86_64/librninstance.so
    < SHA-256-Digest: nnP45TvmgDg1bLoWHFCbROLN8XpYBkfx8g2+IDE+5Ac=
    < 
    < Name: lib/x86_64/librrc_image.so
    < SHA-256-Digest: RwfRfPwi0Q0X2+T4He+WCW8ZvjP5E4aXh7AwOG9nDHQ=
    < 
    < Name: lib/x86_64/librrc_legacyviewmanagerinterop.so
    < SHA-256-Digest: 0g4RrCvgWC9uEq74hQJGTub7a8hfWV2IO3X7G55JY7w=
    < 
    < Name: lib/x86_64/librrc_view.so
    < SHA-256-Digest: sosHR9AZDIWgUp2X93RW8xLgX5Ea3daWas2WYEa2kLk=
    < 
    < Name: lib/x86_64/libruntimeexecutor.so
    < SHA-256-Digest: S3gLdRIMjYJUPEV32TpDhEDCwwTs/1wcxEIUrKZ0vrs=
    < 
    < Name: lib/x86_64/libscrypt_jni.so
    < SHA-256-Digest: KzNMcf3bcd0o4n/T2dRkgAqGrp07phCgvjjiVXU8LSs=
    < 
    < Name: lib/x86_64/libstatic-webp.so
    < SHA-256-Digest: 2uP1rMOgLIDyP40gsBw5Y6EV3yvJlNWH9HmhlGfFJMs=
    < 
    < Name: lib/x86_64/libturbomodulejsijni.so
    < SHA-256-Digest: C9x+CI4SylY29BjPmSCoqXfGB9OzO46HPG/x7mB8Qno=
    < 
    < Name: lib/x86_64/libuimanagerjni.so
    < SHA-256-Digest: 27LyItRi6PGiAAPa/+GaCq+mheIZw01YcDL/y1XLgdc=
    < 
    < Name: lib/x86_64/libyoga.so
    < SHA-256-Digest: BVKSkpLYZMvWPqfTxJKCqe7HwiTcJ9U7FAtAFqUrW6E=
    < 
    1170,1435c607,608
    < Name: res/-8.xml
    < SHA-256-Digest: rHlGVwclcquMOQr9XMLYmvvB1ab1JiDwEauUzZuH+h4=
    < 
    < Name: res/-B.png
    < SHA-256-Digest: Q8zx8KXp6e2abfM+Gz03jUnbyNxg2Dsc25heXkj1JJc=
    < 
    < Name: res/-N.png
    < SHA-256-Digest: a0Wu+L9DdnwsHIPe4r2c65AXmU++9mE4kea8IV4qXuM=
    < 
    < Name: res/-P.xml
    < SHA-256-Digest: o9xwPNs/dEvhC0lcq/symAXdY5r7zu9UGxjf+Il+yJ0=
    < 
    < Name: res/-k.xml
    < SHA-256-Digest: /WwPcJf1N95BiYqy+ecM5x8aCsXTg+MPrn6VwfGwfHM=
    < 
    < Name: res/0K.xml
    < SHA-256-Digest: ltcKG1zgZaqTP7FClxeov2uyM0TTQbxJMTmBRxrLEu0=
    < 
    < Name: res/0M.xml
    < SHA-256-Digest: Zo3po8JudTsjeNW6m13AjoQwmbf9rFH50ggReue7dEc=
    < 
    < Name: res/0Z.png
    < SHA-256-Digest: 7GmKMhe8502LxKRLsAjy29PRrr/xrx6WQYBRQ9v5+oc=
    < 
    < Name: res/0c.9.png
    < SHA-256-Digest: +U4hKRgMC6aSRDA3RAJFYDXc1rb/99BfbefiQZajrzU=
    < 
    < Name: res/0x.9.png
    < SHA-256-Digest: Y21/JL5obpUV99aDDOk2uqClQWRoIg6U6OJXVHln4iw=
    < 
    < Name: res/1I.9.png
    < SHA-256-Digest: 4aK4ZNARSoRxZi+OMP/Lsuuf/UFNNiOWEt74x3kqRQo=
    < 
    < Name: res/1J.9.png
    < SHA-256-Digest: TS/kWoFp82gFLJISMKJoup9T6l/tvLCf81EHRzVR5Qw=
    < 
    < Name: res/1e.9.png
    < SHA-256-Digest: SZAwc6sjq/wRpV4TM+spBcdD4bOCAGwnwVQ0/XbgIHw=
    < 
    < Name: res/27.xml
    < SHA-256-Digest: HW14lQHwLJG8g5rkOXeJ+oiyVw1qMlCsSM49e2Zptes=
    < 
    < Name: res/2K.9.png
    < SHA-256-Digest: Qq7gsDiD6U315UM0ijl9EwLBuCIYlYcag7gYmfWpZHs=
    < 
    < Name: res/2P.png
    < SHA-256-Digest: ZGAhzHfn9L1oq1n7MtMG+BogQhJebNqhYYSgYqgYP3k=
    < 
    < Name: res/2d.png
    < SHA-256-Digest: n4Vt0ApPKB0RmOZnmshhH8Z9MB8owHrql1BCRLoWy0Q=
    < 
    < Name: res/2f.xml
    < SHA-256-Digest: 5kIkul4D2+UIzvMckYmGgO1fJcxJl/IZS5ozftxaxnc=
    < 
    < Name: res/2j.xml
    < SHA-256-Digest: WSwcNaSNpx20YEoJItNpZplAufxw6CLqxh0f/SC2TPU=
    < 
    < Name: res/33.9.png
    < SHA-256-Digest: x5VOK/vQHlu8nXdN1NdD0/iiZhMSn6yAcbdBurMBirA=
    < 
    < Name: res/3A.xml
    < SHA-256-Digest: GGBZWzPQMbIU2gKkpxTAMsKGB+1bNOQbOvOD8MSY+RQ=
    < 
    < Name: res/3J.xml
    < SHA-256-Digest: 14uiFug5l/M17NJiC5eF2hX8C5pM02Nv7WRtxhGpVfQ=
    < 
    < Name: res/3u.9.png
    < SHA-256-Digest: TxhlR8P+V5bvSdqW1gpKmks0c1fq/zeU845fKq3j5AA=
    < 
    < Name: res/42.9.png
    < SHA-256-Digest: cn14/sP5A6JxwEdqUOjAZNKLMveCmwFq4KB9pTuDsoE=
    < 
    < Name: res/46.xml
    < SHA-256-Digest: 4QCVRaqTSJ+1keKpaMsWgEdyTdqKzSwt933dozlp2Rg=
    < 
    < Name: res/49.png
    < SHA-256-Digest: Ty+MKnsELlWqj0P0zoE0syF+6c2kMsX/jUwz0J2G32g=
    < 
    < Name: res/4B.xml
    < SHA-256-Digest: RAwjTKigkYjsVYsTdxyynC2iKJVr+1i9reXBdwOErL4=
    < 
    < Name: res/4_.xml
    < SHA-256-Digest: 0oK+/++ZX8HuuX6+ejzjoXnzJjVTu9EQADV+hkcU2Fc=
    < 
    < Name: res/4k.png
    < SHA-256-Digest: DmMdv+JXXdFtP9bFlkHfpKu14WLWD1kEnkRZ8K8p+/Y=
    < 
    < Name: res/4u.xml
    < SHA-256-Digest: xYSzZX5O+6y+mPYWps+lHdH38ewufHwmcVCZh6prCL8=
    < 
    < Name: res/4z.xml
    < SHA-256-Digest: +hjq+DFd4AUKbaWtEgIarJlx2UV49P56Hlet6v61tWo=
    < 
    < Name: res/5D.9.png
    < SHA-256-Digest: mR9zvmAK2IIaZ0PbVK9RP5sEcFjpUGbiL83R1yAyvFg=
    < 
    < Name: res/5P.png
    < SHA-256-Digest: h62tMuDsGcTpIEIL86Bsn5T2Eo7Q2GahiRYorqss7wY=
    < 
    < Name: res/5T.xml
    < SHA-256-Digest: 1jDoYRbPX1rmg473c2I4xJFocD2PNkmcFKtQXi1pQm8=
    < 
    < Name: res/5U.png
    < SHA-256-Digest: pHVZSufHcQkqOicYmB4nEMc3hE9EpEAfctOVN1Nkmno=
    < 
    < Name: res/5c.png
    < SHA-256-Digest: tE7to016Upwv5VcZ6wmPopcHyqkdGN4Gp6d11ua8+XM=
    < 
    < Name: res/5v.png
    < SHA-256-Digest: oYzarzdCsaPU9IT6FdAPo0r7IUlYhDAar6MhMzhmHtY=
    < 
    < Name: res/5z.xml
    < SHA-256-Digest: kUk4m9GvBGY4GrYmDhSN50hWWt1a8KMxGUQsLZWCejQ=
    < 
    < Name: res/62.9.png
    < SHA-256-Digest: dlby8ZqEzvwr+fr8AHYCFnddMz/AsI64X/HgAGtG/CA=
    < 
    < Name: res/65.9.png
    < SHA-256-Digest: zBYtS4wS7jKeN8jWUUQvDvCp0cb4jvNS5U2o39mlDf4=
    < 
    < Name: res/6P.png
    < SHA-256-Digest: ZjVvVk8FGlaOJQcfYNoxLEGDCfkSl3Os6yJGdzRYaBw=
    < 
    < Name: res/6Q.xml
    < SHA-256-Digest: hTiRNa4UjVU2IBdkvq/9SVFRYsIx8f3JSkzBbrd2otE=
    < 
    < Name: res/6_.png
    < SHA-256-Digest: Q5AfjHROVDRS2Y3necy57sLr2ZNZxyzc43l1fIlgXpI=
    < 
    < Name: res/6d.png
    < SHA-256-Digest: mpowwwUCKi+OB10u19M/XHcRu6jQ0DhVEf22L4nyCOM=
    < 
    < Name: res/6t.png
    < SHA-256-Digest: XsoCgL04poh7bkF2XPXaVzEzh0YlAB65AVbq6zX74Ig=
    < 
    < Name: res/71.png
    < SHA-256-Digest: XQKoEQJkRCjKY5rsPfYm7rSoOandx2/CsViwRGHX8A8=
    < 
    < Name: res/7C.9.png
    < SHA-256-Digest: JVLNG83ZiC1sJYgz+3C8CBoxoqCT75wlb5JDE3Cm5d4=
    < 
    < Name: res/7G.xml
    < SHA-256-Digest: 6/Jv/eLxwCZR5c/siifphoGX5XS+FZBMDbAdPkGQVCE=
    < 
    < Name: res/7H.xml
    < SHA-256-Digest: KRy2x+DzAdoeVEN3EHEnZvr19oPu0wEi6872cBmbwgA=
    < 
    < Name: res/7I.9.png
    < SHA-256-Digest: sLLcLK54EcEkrlKNcUMYuxBDtZ2CpkDyLEes5kwoP+w=
    < 
    < Name: res/7N.xml
    < SHA-256-Digest: SfTuAzo2i+YoZQGneGuxeDIBAJh/lZvDPJjn2h/IYfE=
    < 
    < Name: res/7V.png
    < SHA-256-Digest: atz8ndHhuCuYXSI/yKAcjo8N07kFHTgGJnSyOAr3mlA=
    < 
    < Name: res/7Y.xml
    < SHA-256-Digest: W1nfijzE+M8Vy8L0NjegNHjbO5gQww1P/SJtVJnxXME=
    < 
    < Name: res/7_.9.png
    < SHA-256-Digest: EAzGrjhw3XaaJS5EYIqBlWUi6GdnT4VGGbp8aNMUytc=
    < 
    < Name: res/7i.png
    < SHA-256-Digest: UICwfrSGugXt5ze1Z+sruJ17eaPttcLKgUHG66ASt10=
    < 
    < Name: res/7m.png
    < SHA-256-Digest: hnY6MK8qk0x8E7Ejs2RD0dF5GLccYUm8bugBFbhyWT0=
    < 
    < Name: res/7o.9.png
    < SHA-256-Digest: AH2/X6LcRmpJQLCmpz2rSMtyH2TTWPcf81qq25Ywtew=
    < 
    < Name: res/80.xml
    < SHA-256-Digest: wtRYWzguzopUUUniZ38EHxEx5nOdx1RQiKoDByNpPq0=
    < 
    < Name: res/8c.png
    < SHA-256-Digest: Jzj64eqnFDnz6qE7N+x7OEgYtOMQHWklQkKKuiwbs0A=
    < 
    < Name: res/8h.9.png
    < SHA-256-Digest: 6Y8ZLwE6kiYBBIKrjhTH8hX7Fr2jzLDdrsPtCycRnnw=
    < 
    < Name: res/8h.png
    < SHA-256-Digest: UzQLCw9SmybbavYyoBEnCCM78xJEjFuJoTV7LNcLP0I=
    < 
    < Name: res/8t.xml
    < SHA-256-Digest: X2N23+GZ2KbkADPT5iOYnQUsmy+XTQDIJPu4t2/G/eg=
    < 
    < Name: res/95.xml
    < SHA-256-Digest: tyd2gzHimEH1YVdW/wRSWJJ0xzA3VRfpTWze4tb/Qi8=
    < 
    < Name: res/9N.9.png
    < SHA-256-Digest: DKrqAGCzdyukM8Dp46VFLybzQhulAjyFUVcnC8Z1swk=
    < 
    < Name: res/9P.xml
    < SHA-256-Digest: BbW67c1Y/ZlfsBPyBnyH27X5SJ15NXI4KajfgD1Qdgk=
    < 
    < Name: res/9T.xml
    < SHA-256-Digest: uyCrteyBuPetJZI6ItMVfPb3h+s1nGyske8CiDUU0ek=
    < 
    < Name: res/9T1.xml
    < SHA-256-Digest: Fv6veimFHbwZOoFO0wqS7Y7i0O1sv/Ooelv5Yn0HKno=
    < 
    < Name: res/9T2.xml
    < SHA-256-Digest: BGP3qPMADBr4mqUips63/BiXYsih1LxvavgW7tz32dk=
    < 
    < Name: res/9V.xml
    < SHA-256-Digest: 5u/y//Ha4LK54xMq38VJb8b4UPC2ATgW0XwB4W2WXCI=
    < 
    < Name: res/9X.9.png
    < SHA-256-Digest: lP6YJHFK2UwAL+YhnnI8DYDHy+OmEw16pJNzC2filNE=
    < 
    < Name: res/9a.xml
    < SHA-256-Digest: VLICoJwNMNGPEU397b2n74icCjPV53bzZu2KOaf2FIM=
    < 
    < Name: res/9m.xml
    < SHA-256-Digest: 7jM4MnPz3DQd8whxXiWDHu/ZOhh8qvZ/BnqWGYixC2Q=
    < 
    < Name: res/9n.9.png
    < SHA-256-Digest: FBGuZdgWBXPBZtKlchBv0RA8EvJC9n/uxf6qVQGX5fU=
    < 
    < Name: res/9w.png
    < SHA-256-Digest: bJzT3CpA0RXdiUX6Ayedt6P6JLxS3GVFXVhQqPENLzY=
    < 
    < Name: res/9z.png
    < SHA-256-Digest: caK6Y6XU6R98FDJPocPrkpC3PLezx4KAGNBa2xz6q0U=
    < 
    < Name: res/9z.xml
    < SHA-256-Digest: 9f8yLMbOIT6aW0DmLSehVvxabDmxasPi64PywXVRXWM=
    < 
    < Name: res/A1.xml
    < SHA-256-Digest: 5GS7GI2xyp+UXbiikMf0Dkp/8XAs/ax7tW3PMBCSreI=
    < 
    < Name: res/A2.xml
    < SHA-256-Digest: Sq8cu6OgU4C0D2souaxX55Qt/1ZseZ30OIyr33F9gSU=
    < 
    < Name: res/A4.xml
    < SHA-256-Digest: k3KUusUeBlCicm0Xy3PFAaWXgkyiNc2wqDqIdHiZZMA=
    < 
    < Name: res/A7.png
    < SHA-256-Digest: r4e8GwkR5ELsZYDUKDeXMPA3mXgeNjYsJmuXvhVwS7c=
    < 
    < Name: res/AE.xml
    < SHA-256-Digest: w1SMEbs9YxwNhq8FtqfzMdTLSyaLOZdF69qWtzXscF0=
    < 
    < Name: res/Ac.xml
    < SHA-256-Digest: XUzarlg4rZRCwIX5UbdmsoCL/xO4yFoU4Lz4VxUUSSw=
    < 
    < Name: res/Ag.png
    < SHA-256-Digest: THF84f+1UcdlmBrdZdGVYTLY9SIzfeKGawRfCmBIVCY=
    < 
    < Name: res/BG.9.png
    < SHA-256-Digest: qmEinNcCOSeBCcXr5yXnJITQJS76SQKhcZI2aUJ0kok=
    < 
    < Name: res/BJ.xml
    < SHA-256-Digest: StE6nImHRXs/zTwru9zkNdSmV+pVGiRNV9bLaB7qI1g=
    < 
    < Name: res/BJ1.xml
    < SHA-256-Digest: cpKIsj02iJrzA2n3WiD1KaFI0RFq+gwwFNmNOrzTS2k=
    < 
    < Name: res/BL.9.png
    < SHA-256-Digest: 9lqH76L1PW/i2EjPyh9skK6l6fxn/0f1lJpt0qduvhs=
    < 
    < Name: res/BM.png
    < SHA-256-Digest: Wmyh0NL+pTgT2ls8kDdAgIf591P1jdLhKKSkj3aJdp8=
    < 
    < Name: res/BT.png
    < SHA-256-Digest: foez4CKRJtw8K9rdzY8zDzu192E6BQJMPNZEXdFh94g=
    ---
    > Name: res/anim-v21/fragment_fast_out_extra_slow_in.xml
    > SHA-256-Digest: ZQxUxe/3NAku4JNU/6HYM5MbdwbyeX6AH4JWBMR8LdM=
    1437,1438c610,611
    < Name: res/BW.xml
    < SHA-256-Digest: ltcKG1zgZaqTP7FClxeov2uyM0TTQbxJMTmBRxrLEu0=
    ---
    > Name: res/anim/abc_fade_in.xml
    > SHA-256-Digest: MGe5TuvorJ46RVmYIvmdgH1xL0JElOn8nN0oz7a9rmo=
    1440c613
    < Name: res/Bd.xml
    ---
    > Name: res/anim/abc_fade_out.xml
    1443,1474c616,617
    < Name: res/Be.xml
    < SHA-256-Digest: cSUAIKy+g9t5odEg2XNWRLk2QvKnGOTq6l15HFaxtgw=
    < 
    < Name: res/Bi.png
    < SHA-256-Digest: v8eBFQIXaoBD2qeAWpDATyHPRhUSBy6eukN42r/bvFM=
    < 
    < Name: res/CK.9.png
    < SHA-256-Digest: Zx0n5aS0IREXS4iNVxGOBQdaVW1wO9VPkzUgLSpBZ5E=
    < 
    < Name: res/CO.png
    < SHA-256-Digest: A6dlwhbNu2SRI8yHXgMn0qDzzJHaYJRKrb3xvXRTf+Y=
    < 
    < Name: res/C_.9.png
    < SHA-256-Digest: qGdqF5OsgxD/sSmGIy32bfCS0pwkKu7cK3NVbAENONw=
    < 
    < Name: res/Cg.xml
    < SHA-256-Digest: +3HsnqMtF2cqx5TIRyx0YnEzPFPjRR+XtYoevzuTQ9c=
    < 
    < Name: res/Ck.png
    < SHA-256-Digest: q3O3KbuVh4Ego73I3JFfOqodcHD8ZEoN5k1AlBrVB+0=
    < 
    < Name: res/Cp.png
    < SHA-256-Digest: jQsswCmikLB8PSe/qhpdJIvSHQVKEzeQiPv6N5vLuPU=
    < 
    < Name: res/D-.xml
    < SHA-256-Digest: LYJbeczmAgNJL/CaBIJtsKyNnrm8D7n7E5rhqlzeD2c=
    < 
    < Name: res/D5.xml
    < SHA-256-Digest: BKrMSgtyA+HAGXnhiwegBzYGTyI/+woxvT/eMU1ln5w=
    < 
    < Name: res/DL.9.png
    < SHA-256-Digest: JfJREsxGsoV2fee1sFjPwKnv1fIc/nJK8DFQXWap7Os=
    ---
    > Name: res/anim/abc_grow_fade_in_from_bottom.xml
    > SHA-256-Digest: zrkVeGTlzFYqIfHkZjE5JA1zKJ/FGjDJlqjC7o6J7F0=
    1476,1477c619,620
    < Name: res/DV.xml
    < SHA-256-Digest: xhpra+X7vrKu/b9U2ONQORy3APm5r9aSlmGJ0Xsj+98=
    ---
    > Name: res/anim/abc_popup_enter.xml
    > SHA-256-Digest: mt7Zf3HH6jb4aeNyukR+qH6qYTenkyDStzn9tDHoPdE=
    1479,1480c622,623
    < Name: res/DZ.xml
    < SHA-256-Digest: qNc0HCDQfJ/atgLnw5GHyau5yvX7+bKDLNbZ8YoshsI=
    ---
    > Name: res/anim/abc_popup_exit.xml
    > SHA-256-Digest: 12zIhfYyg+nw4dCDX8TvO8Odtag/XfaBEz9wHC02Cqc=
    1482,1483c625,626
    < Name: res/D_.9.png
    < SHA-256-Digest: n9N8gvh98ARkVUNE3d3qVeSA0JwztQWsEyUgNtTWJ24=
    ---
    > Name: res/anim/abc_shrink_fade_out_from_bottom.xml
    > SHA-256-Digest: 1jDoYRbPX1rmg473c2I4xJFocD2PNkmcFKtQXi1pQm8=
    1485,1486c628,629
    < Name: res/E5.png
    < SHA-256-Digest: U09+aSvqwLYGy1sTCUKJfba1UOReYUJsrDc4GIGi62E=
    ---
    > Name: res/anim/abc_slide_in_bottom.xml
    > SHA-256-Digest: SGrXBa43/0Hfq8lS/l8ojlx7rR2N3M03qwnybTVUFaE=
    1488,1489c631,632
    < Name: res/EA.9.png
    < SHA-256-Digest: oNY+x27CHUD+lqS2+09KrFthprY6Y0ctqwVeDZ6YkLE=
    ---
    > Name: res/anim/abc_slide_in_top.xml
    > SHA-256-Digest: 1gsnMonTWPKz7qE/oJexzyGY6zdRf33JwxLtPitGUlY=
    1491,1492c634,635
    < Name: res/EP.png
    < SHA-256-Digest: U1hzfLaA6hzda6QA0zMW+r+HL9RPag4Se/yL3RYys3Q=
    ---
    > Name: res/anim/abc_slide_out_bottom.xml
    > SHA-256-Digest: 4CWd+CsxjNfQldquLLPU7mVlre/W3vjBFnVkn2NxfuU=
    1494c637
    < Name: res/EZ.xml
    ---
    > Name: res/anim/abc_slide_out_top.xml
    1497,1582c640,641
    < Name: res/Ec.png
    < SHA-256-Digest: YwYEi6X37KQ+e9re76lBIYBQhIb9VD4C3pPSoBPiI/A=
    < 
    < Name: res/Eg.xml
    < SHA-256-Digest: aEz6Za3vJhPk9EhsonRTZnHicbdAkLXO9BlkiTIiyis=
    < 
    < Name: res/Em.png
    < SHA-256-Digest: d30oRWa2y9OC4f9B7sEiQaVRx3l+DqTfmUqBxQRSJ+Q=
    < 
    < Name: res/F8.xml
    < SHA-256-Digest: KrVVwfcVcfp3H/f+5hnA/JQP29TXY8PxAlVIvCO4nDE=
    < 
    < Name: res/FS.png
    < SHA-256-Digest: d30oRWa2y9OC4f9B7sEiQaVRx3l+DqTfmUqBxQRSJ+Q=
    < 
    < Name: res/FT.xml
    < SHA-256-Digest: TK3cLLwqccbADY2EaGnZzRi2yHkNadIR0NnoGZb3N3w=
    < 
    < Name: res/FW.png
    < SHA-256-Digest: GGIMFRMwKJu6GWwcweJpn5gGGjW+NVGHYpaoxNWSuhc=
    < 
    < Name: res/Ff.png
    < SHA-256-Digest: 8v9i9HPYpeAKi2yBwVvpoFNkccPVqB430EvDNW6oHKA=
    < 
    < Name: res/Fu.xml
    < SHA-256-Digest: 7VhVAzt7ukhGmkjq7LoE2wxQhUqDJACC2qeT0yxhm0w=
    < 
    < Name: res/G2.9.png
    < SHA-256-Digest: q5SvyyuzJVRMDBEDv1EJuCe/Bw9EH675CfhWrilaHPA=
    < 
    < Name: res/G2.xml
    < SHA-256-Digest: SpWVgAgOux2CKiRZpCNNKr8N0LZdnCi9qMJY2vyIjFE=
    < 
    < Name: res/G8.xml
    < SHA-256-Digest: hkmyIDUDj38hoYl3c4dOLfu+sRSKMCZrozclUtJtGWw=
    < 
    < Name: res/GC.xml
    < SHA-256-Digest: 0bHDYcljHdJQOe4PXm4II7zGCPjIV5wFzakr83B6dc8=
    < 
    < Name: res/GD.xml
    < SHA-256-Digest: MNVt6GZ+bN7vtI2aKgBLQFILzbxlp8DIQ2eQIuFxafs=
    < 
    < Name: res/GF.xml
    < SHA-256-Digest: QSKxhRkoE+/JER018lCj7SXVLQvMq4LTpyCgxRUtXqs=
    < 
    < Name: res/GK.xml
    < SHA-256-Digest: WANcb9rsrIOY4UfkXwGeh3/MoRs6XhnTTp7kKT8pMnI=
    < 
    < Name: res/GR.xml
    < SHA-256-Digest: 44Xr8ObC7zUiSjkcF0YEw7YaIPkukAUBEy9lC761QLo=
    < 
    < Name: res/GY.png
    < SHA-256-Digest: XQKoEQJkRCjKY5rsPfYm7rSoOandx2/CsViwRGHX8A8=
    < 
    < Name: res/Gc.png
    < SHA-256-Digest: h/5aOfT+B/sWHUOvIjORpZct8eV3inAo+53cNXiK+4g=
    < 
    < Name: res/Gf.png
    < SHA-256-Digest: Du2Z0KXjakaLVXYF5szqSVwCnzVphEpF9LXY2t131Kc=
    < 
    < Name: res/Gt.9.png
    < SHA-256-Digest: 5+NsPLztyXvCiv+R7XLEMQsWwzFxOhaYppLGbUb2Mic=
    < 
    < Name: res/Gt.xml
    < SHA-256-Digest: EVv49tN2kHB2fmthFR2dK+iBM/NoG5FWxdkU+7LVs0o=
    < 
    < Name: res/H-.png
    < SHA-256-Digest: D9L1OUbrk7MVT0S9r8iJbqkxlaZM5fxkBJ6LcpPNaAE=
    < 
    < Name: res/Hd.xml
    < SHA-256-Digest: DPVfKH9OgQo52jNLkd5HbmdnX2YXOrKUDdCLxumDFFA=
    < 
    < Name: res/IX.9.png
    < SHA-256-Digest: H33Ys1ITU69HP0GFCIfpOFz2HDkMbjTk4r2ZGSHM/fg=
    < 
    < Name: res/In.xml
    < SHA-256-Digest: ZRICVABh9h3+5jjNym0b3t638aiQ8JCTIYU8TZGCDpo=
    < 
    < Name: res/JJ.9.png
    < SHA-256-Digest: oEcINpq+CSDe0g2H1Yrr9pkuu2fv76JIqEIYle/FNT8=
    < 
    < Name: res/JS.xml
    < SHA-256-Digest: VoGZf/G+konDrDvijGIk3kpXU86dWjIiWqPidE331j8=
    < 
    < Name: res/Jl.xml
    < SHA-256-Digest: NCospfejrlthimOLWY75KtIw2JFt+kfP0kHudvagj2A=
    ---
    > Name: res/anim/abc_tooltip_enter.xml
    > SHA-256-Digest: PF+p+bcZEPvX1FZ6bQYN7B4dkwXKGc4jhsnlCiVX18o=
    1584,1585c643,644
    < Name: res/K5.xml
    < SHA-256-Digest: bAQhFXh+BZrSPDqUr6KkiiGRXJy8A4dm0YBYsBRzNl8=
    ---
    > Name: res/anim/abc_tooltip_exit.xml
    > SHA-256-Digest: B6S17VpYE46vHbfnZAo8wUin0qV+gSEJckny3u7i3PY=
    1587,1588c646,647
    < Name: res/KH.9.png
    < SHA-256-Digest: RoYHYBFAlVshxgkYl7/GX2CdOG+mjVbBmSAYleA7P7w=
    ---
    > Name: res/anim/btn_checkbox_to_checked_box_inner_merged_animation.xml
    > SHA-256-Digest: NWDFwJkHhZ5lcO6ie8vH9Ve9if+9Fq9F9pE8wEbGKNE=
    1590,1591c649,650
    < Name: res/KM.png
    < SHA-256-Digest: HjsC4k+kMbGr4Kl61nI/rUPfef2oF2wQYLb70xF4YZ8=
    ---
    > Name: res/anim/btn_checkbox_to_checked_box_outer_merged_animation.xml
    > SHA-256-Digest: c48go/g9WpD1pqSekWZX5ltbuFfXJgv+SppdDz5idYE=
    1593,1594c652,653
    < Name: res/K_.9.png
    < SHA-256-Digest: +3HhHAkBM6l/6E+jt2omO0KckDLsRnhUsOMqMVel66U=
    ---
    > Name: res/anim/btn_checkbox_to_checked_icon_null_animation.xml
    > SHA-256-Digest: jRsGSjjYb82oFdQ60MBuQkb4jFyvf7VYoTroVBzaSow=
    1596c655,656
    < Name: res/Ke.xml
    ---
    > Name: res/anim/btn_checkbox_to_unchecked_box_inner_merged_animation.xm
    >  l
    1599,1612c659,661
    < Name: res/LO.png
    < SHA-256-Digest: foez4CKRJtw8K9rdzY8zDzu192E6BQJMPNZEXdFh94g=
    < 
    < Name: res/L_.xml
    < SHA-256-Digest: wlLNB4CITXXN3vDBSCc9zAeu3s8AOMiPJecSyZBrod4=
    < 
    < Name: res/Lf.png
    < SHA-256-Digest: lqrfJEdWcBCrcJm47CbpazwXI86vXXvjX/pWIhN7nMI=
    < 
    < Name: res/Lf.xml
    < SHA-256-Digest: GIQUuKY3c2d0Xdrce8IyazdtMxKprhjrJnnkxFbf9fY=
    < 
    < Name: res/Li.9.png
    < SHA-256-Digest: qCUvUmOMgN8RnbAxYmGYpKjUsy7mGOlsOja5uUbiaJQ=
    ---
    > Name: res/anim/btn_checkbox_to_unchecked_check_path_merged_animation.x
    >  ml
    > SHA-256-Digest: g2OTeGlCBs5Q5fxfrO9jxrZDIaEjGx8b0m2Odtc/bkM=
    1614c663
    < Name: res/M7.xml
    ---
    > Name: res/anim/btn_checkbox_to_unchecked_icon_null_animation.xml
    1617,1861c666,667
    < Name: res/MD.png
    < SHA-256-Digest: 7GmKMhe8502LxKRLsAjy29PRrr/xrx6WQYBRQ9v5+oc=
    < 
    < Name: res/MF.9.png
    < SHA-256-Digest: tK9z5SJmvlcMLBY9mH5kNIBm2zEbQeejggAFKcATbGs=
    < 
    < Name: res/MO.xml
    < SHA-256-Digest: WLqeK530V/Dwl9RY8pwDLeSyrfarYVCDWErJ/NVbCRA=
    < 
    < Name: res/MQ.png
    < SHA-256-Digest: 2DVD8MgrYs9JnyYYrZlDH571DaYLQVmA7I4OULkOOJM=
    < 
    < Name: res/Ma.9.png
    < SHA-256-Digest: 0nr0NRAcpMvsDIQL0waHkYzTnrg6qxSHQghVYjpFmYs=
    < 
    < Name: res/Mp.xml
    < SHA-256-Digest: dw//htQeOfzmIu5ZJC61kAKFTQgak1mPnnwCNsbxnes=
    < 
    < Name: res/NA.9.png
    < SHA-256-Digest: w2e3OjOpM0KeHVfTP8+/JD8CdOfNuiIaC5g+4VtbrKk=
    < 
    < Name: res/NF.xml
    < SHA-256-Digest: CrO8grO5/YSZICyv49SUqfZvuiSNAekLkOkyyISZR8w=
    < 
    < Name: res/NG.png
    < SHA-256-Digest: E20I+rD+QW/H4OypxJjmPGg1eyyqQkH0RLvD8m+adMk=
    < 
    < Name: res/NJ.png
    < SHA-256-Digest: jQsswCmikLB8PSe/qhpdJIvSHQVKEzeQiPv6N5vLuPU=
    < 
    < Name: res/NM.xml
    < SHA-256-Digest: lDqWWXS3y0c/YXS1ZC/PO7zHfHUpJ+LTxLAEESEtAZs=
    < 
    < Name: res/NZ.9.png
    < SHA-256-Digest: d5omBqkxo5miydO9AfPFEMQS8pFkeKpofkMOYAOwpfM=
    < 
    < Name: res/Nk.9.png
    < SHA-256-Digest: XHxoL/tk9LUx3g+VScDaEcM3V25CZhhSK/0dNaRRpBQ=
    < 
    < Name: res/No.9.png
    < SHA-256-Digest: aCxGbT5POeMfEUq8FjLYXnNFV705gU47p9fGHq4tBps=
    < 
    < Name: res/Nu.xml
    < SHA-256-Digest: KhKikZN5HTSbtRJFL1Tj1ndV3tZ5xHtLjhVA6IaV5y8=
    < 
    < Name: res/OI.xml
    < SHA-256-Digest: saROq77T3Ozf4rj1I8YLUp68r4U9JfpmKICgcE3M4Hc=
    < 
    < Name: res/OM.png
    < SHA-256-Digest: ykj2BCYvK074sQDHMTDv4q0z74wqLBs1FvJPUbewRmU=
    < 
    < Name: res/OX.png
    < SHA-256-Digest: EuyfmtX6PX2JcRSvbCKXtm8xywVuQ9r/voDSP29mOW0=
    < 
    < Name: res/OX1.png
    < SHA-256-Digest: THF84f+1UcdlmBrdZdGVYTLY9SIzfeKGawRfCmBIVCY=
    < 
    < Name: res/Ol.xml
    < SHA-256-Digest: 8sTN9lyqWYHFJRG8ofPlQTaV+CRFGD1qldDdgSDdahQ=
    < 
    < Name: res/PL.png
    < SHA-256-Digest: IrAH7FOmmdQvtLNXqZBlcqsnqefDmxJwNrUdHMVDpL4=
    < 
    < Name: res/Pa.9.png
    < SHA-256-Digest: j89bnaA8aN/2Wt+ocT25zjteQjqfUEbxeFq2QMKmR/s=
    < 
    < Name: res/Pb.png
    < SHA-256-Digest: aDaR157xHoY/5OyE3cYxaW5ZhLVYT8RUnWWG26yiIMc=
    < 
    < Name: res/Pg.9.png
    < SHA-256-Digest: XUFhv5SCtdKiNGzT+ic57DID2ZW+usAuiacylDNou/w=
    < 
    < Name: res/Q-.png
    < SHA-256-Digest: bTSouym+JuNDeBYDWIUG8zvRuTcyocG8n9hGeKo2sXg=
    < 
    < Name: res/QJ.9.png
    < SHA-256-Digest: I0ObiJn0tj1orpOF6qSShqS5W5X3m4uNN947Dk/bx0c=
    < 
    < Name: res/QZ.png
    < SHA-256-Digest: bJzT3CpA0RXdiUX6Ayedt6P6JLxS3GVFXVhQqPENLzY=
    < 
    < Name: res/QZ.xml
    < SHA-256-Digest: mwrHkaP6lT4otSbgIP0uYptAgS7hvEaT/1/f7xUEQgI=
    < 
    < Name: res/Qd.xml
    < SHA-256-Digest: o9v+TlywZ4j21Xvee5COwoVkMmG9IavxrnMY0qyhvDk=
    < 
    < Name: res/Qt.xml
    < SHA-256-Digest: kJ9EaLc4I8tQBXCrRwZ6QbNzCqxzcpr9tz6jJdPdoEs=
    < 
    < Name: res/RD.xml
    < SHA-256-Digest: 4CWd+CsxjNfQldquLLPU7mVlre/W3vjBFnVkn2NxfuU=
    < 
    < Name: res/RH.xml
    < SHA-256-Digest: U7wD/g6Rd1wiFxXBz3gEVQF/yD3jdZHgsB/7whNMegQ=
    < 
    < Name: res/RJ.png
    < SHA-256-Digest: lqrfJEdWcBCrcJm47CbpazwXI86vXXvjX/pWIhN7nMI=
    < 
    < Name: res/RV.png
    < SHA-256-Digest: dELNplOsus35rvJWqhkeXrtgcaF0cxKuxF4duCUqPPs=
    < 
    < Name: res/S8.xml
    < SHA-256-Digest: 2MyprM0mfCAQmauwdC2DsxzISWGw8NOMEsrNdfJPcWA=
    < 
    < Name: res/SN.xml
    < SHA-256-Digest: j0Vmq5gNpuu9C/Z+osysU/hiOv/H1Wis8OMV3MpIZd8=
    < 
    < Name: res/SV.9.png
    < SHA-256-Digest: 28CvYfRAuz9TgrjqP6V4ZZ92x6au9iCmivxDqQny4OU=
    < 
    < Name: res/Sa.xml
    < SHA-256-Digest: MQ8miCIiluSEMFlyja2JEcLKh/nAQfjnDiNRvfAjDB0=
    < 
    < Name: res/Sc.xml
    < SHA-256-Digest: 8WrNqB5j911IjgxqRR4Sf6Mk5Sr1yzom95nTr52hOVU=
    < 
    < Name: res/Sh.xml
    < SHA-256-Digest: dx2Q2lQsa0j7UPSR0qpWd9TfcRtZQxySZDHQJa0oVeY=
    < 
    < Name: res/Sq.png
    < SHA-256-Digest: KhRfCCqIaFvmgeWJEJeJurPUsnnTPH+JJ7RkqVAmo8g=
    < 
    < Name: res/Su.9.png
    < SHA-256-Digest: S8j00T0qzMwTOPc/+QzZdpXZIQ4E3l2pJCFSQ8iVC/M=
    < 
    < Name: res/Th.png
    < SHA-256-Digest: Aq0Opv9aVg6UdFLH1k9nmvogVrRPhuo7cHocsXXCzrA=
    < 
    < Name: res/Tj.9.png
    < SHA-256-Digest: D6F9h1TW0WPMQz8IfK1sCDFzrIetcJfnaVCiXuxfPpA=
    < 
    < Name: res/Tl.xml
    < SHA-256-Digest: j5rKyrry37S7U9q3znvsnBRRzgoCGf+qQXYOqC2j0tY=
    < 
    < Name: res/Tn.xml
    < SHA-256-Digest: bPhP0avzyZC8Wsyc1KBrPRVZuFbseoCEFAyljI4h3Io=
    < 
    < Name: res/Tr.png
    < SHA-256-Digest: atz8ndHhuCuYXSI/yKAcjo8N07kFHTgGJnSyOAr3mlA=
    < 
    < Name: res/U-.9.png
    < SHA-256-Digest: 4Xdh7SgO3ZPXFBvVBLcPnp4VqGUiiNnmMzv0zpZO+EQ=
    < 
    < Name: res/U7.xml
    < SHA-256-Digest: bS3x+eb6WV4lJAIO00QwaFzqi9g/2ymH89+aa2HRtyY=
    < 
    < Name: res/U8.xml
    < SHA-256-Digest: 5hjS/+llrkdfRiKBo0nAF3t2vJXB0LrCGTJYc6K1Gtc=
    < 
    < Name: res/UE.9.png
    < SHA-256-Digest: hDZiQiD7okaugWo6qzed/X/ypIQoSrJMOvSYl3hwW7M=
    < 
    < Name: res/UR.png
    < SHA-256-Digest: PP0FVIRIlrUAwzUTseie1iAo0MgN9z08WTVHn0lwSjw=
    < 
    < Name: res/UX.xml
    < SHA-256-Digest: 12zIhfYyg+nw4dCDX8TvO8Odtag/XfaBEz9wHC02Cqc=
    < 
    < Name: res/V1.xml
    < SHA-256-Digest: Zmv3nWa+vgOnPMFH0B0XkbKpRk+1DzPV+lKLEtthVTs=
    < 
    < Name: res/V7.xml
    < SHA-256-Digest: lA+pjTs3QV4ODj+HFK6ZVcOaQ+LEM4LExy2Z/09R8X8=
    < 
    < Name: res/VM.xml
    < SHA-256-Digest: CrO8grO5/YSZICyv49SUqfZvuiSNAekLkOkyyISZR8w=
    < 
    < Name: res/VN.xml
    < SHA-256-Digest: OGkTfroDMBaH7egfDb0PfRHjeE7R+Srh6iU4CoReCro=
    < 
    < Name: res/VT.xml
    < SHA-256-Digest: r6pcuHL+V9m8uJ5Xdj/4tUDN49sws/4C8+xLyrSoNKY=
    < 
    < Name: res/VW.png
    < SHA-256-Digest: mpowwwUCKi+OB10u19M/XHcRu6jQ0DhVEf22L4nyCOM=
    < 
    < Name: res/W4.9.png
    < SHA-256-Digest: fEXkbkBfW0o9DGKiLmcBDDMnAi3RwfS7zOoSeaTRrXQ=
    < 
    < Name: res/W5.png
    < SHA-256-Digest: XIDYinuC71gzJVv3D/HCbD77KpKukMrCIvMgD1ngseo=
    < 
    < Name: res/Wg.xml
    < SHA-256-Digest: DE9+nn+mzUJnN3cfgdXze2vXlwcXpzS+ABbccRty1nQ=
    < 
    < Name: res/Wh.png
    < SHA-256-Digest: I51gLJxl8Vb+AkYTIHlVrI+905WubsPvpRvpjjpEc/Q=
    < 
    < Name: res/Wr.png
    < SHA-256-Digest: g6RieeL2XYUslFLIbjgybvnz3vb1vsLvFBbHKBWl+/o=
    < 
    < Name: res/Ws.xml
    < SHA-256-Digest: fTPMuZZ+5D9Z3UHSyXJmN+0cVBdjtMRIj7byjvDQ0EA=
    < 
    < Name: res/Wz.png
    < SHA-256-Digest: wTGrDi65h5vQY+c2q4ExPFpPR+qi9KDsnsqToaFQ7Xk=
    < 
    < Name: res/X3.9.png
    < SHA-256-Digest: RMKXZrLYi3inE5Oz46dxyn7vX1UmMMYHTzPWKRJB0Lk=
    < 
    < Name: res/X4.9.png
    < SHA-256-Digest: yNE+VoejTVuFAY/3qfDyKHCil7Jh/xQLPtBBzn5/S4E=
    < 
    < Name: res/XK.xml
    < SHA-256-Digest: 5Jo9ZUn4/86e9nFqHc4Ab2R5fqrmC8CRsWxWDiDuWb0=
    < 
    < Name: res/XW.xml
    < SHA-256-Digest: mwrHkaP6lT4otSbgIP0uYptAgS7hvEaT/1/f7xUEQgI=
    < 
    < Name: res/XY.xml
    < SHA-256-Digest: XEBGynF7/4KlXT1NPl7oY1+63+ZKw1iqOW/UZkCF6mA=
    < 
    < Name: res/Xx.xml
    < SHA-256-Digest: ufyAinAwOAH7PAyiSpwee3WZNOkIZnZYnmuHE3SkM4A=
    < 
    < Name: res/Y3.png
    < SHA-256-Digest: ykj2BCYvK074sQDHMTDv4q0z74wqLBs1FvJPUbewRmU=
    < 
    < Name: res/Y7.9.png
    < SHA-256-Digest: p3qqIH/VefZDgzI7k/BI7pQ040XKi7ZBdDp3kBtDg8I=
    < 
    < Name: res/Y9.png
    < SHA-256-Digest: 5kwuV2J+JOwe035nNEwr8x0da90tjXFYQMHt8L0UJbY=
    < 
    < Name: res/YD.png
    < SHA-256-Digest: oYzarzdCsaPU9IT6FdAPo0r7IUlYhDAar6MhMzhmHtY=
    < 
    < Name: res/YG.9.png
    < SHA-256-Digest: Xj8T7oVPpBNUynN4NYuZ+OQfOxyZaMMTtjCwLehwTm4=
    < 
    < Name: res/YW.xml
    < SHA-256-Digest: y0hkc7wPfWyQ3qVk/WG7YSSWNxtrC8q4K5WhDPcNtB4=
    < 
    < Name: res/Yt.9.png
    < SHA-256-Digest: B79c5f+JNyV6/RRgYsm/XKH0EVoWQ1KdgYRdAgLH3e8=
    < 
    < Name: res/Yw.9.png
    < SHA-256-Digest: qTOq676uSJ3qhOeOf7xAef39pXb73rM5QB/abNwD52Q=
    < 
    < Name: res/Z-.xml
    < SHA-256-Digest: pzhAi6+qrS8t8lBfRhhmjTF8k/g7L3zMwploMNCManI=
    < 
    < Name: res/Z8.png
    < SHA-256-Digest: r7yu3mapfdybVMTZiRwJQVy2lE15xMGuhEDNpVOWOVc=
    ---
    > Name: res/anim/btn_radio_to_off_mtrl_dot_group_animation.xml
    > SHA-256-Digest: k1Nb/mGQ84B0vsYZa3E05x4BRvwQFEZ9LgmJyfp0xns=
    1863,1864c669,670
    < Name: res/ZL.xml
    < SHA-256-Digest: hNvfeK2ZRyhm/X+fQER/yuN3wC4HgJNZh6lgvbbWnsw=
    ---
    > Name: res/anim/btn_radio_to_off_mtrl_ring_outer_animation.xml
    > SHA-256-Digest: bAQhFXh+BZrSPDqUr6KkiiGRXJy8A4dm0YBYsBRzNl8=
    1866,1867c672,673
    < Name: res/ZN.9.png
    < SHA-256-Digest: R18Ds8z/BPzpGnqRIULRUKAAsdAR2gA3RdwsDj9fsJI=
    ---
    > Name: res/anim/btn_radio_to_off_mtrl_ring_outer_path_animation.xml
    > SHA-256-Digest: BGP3qPMADBr4mqUips63/BiXYsih1LxvavgW7tz32dk=
    1869,1870c675,676
    < Name: res/ZN.xml
    < SHA-256-Digest: ZU6YsqOfsBUJz1L1/RyfDiiVIPPXXZGP+BxxUP+Ah/8=
    ---
    > Name: res/anim/btn_radio_to_on_mtrl_dot_group_animation.xml
    > SHA-256-Digest: GIQUuKY3c2d0Xdrce8IyazdtMxKprhjrJnnkxFbf9fY=
    1872,1873c678,679
    < Name: res/ZP.xml
    < SHA-256-Digest: PfR3Ri4gzAPJCWeD/DpYfo8hzsKi4WgNYNsEVB1o4ZI=
    ---
    > Name: res/anim/btn_radio_to_on_mtrl_ring_outer_animation.xml
    > SHA-256-Digest: Fv6veimFHbwZOoFO0wqS7Y7i0O1sv/Ooelv5Yn0HKno=
    1875c681
    < Name: res/Zg.xml
    ---
    > Name: res/anim/btn_radio_to_on_mtrl_ring_outer_path_animation.xml
    1878,1927c684,685
    < Name: res/_G.xml
    < SHA-256-Digest: u7mx9YTta0XDT0NGdIXwlNF1jO6pT0m3muBN5t9hgYk=
    < 
    < Name: res/_H.xml
    < SHA-256-Digest: yDITZIAkCbr0124qhOMDhxWFvclbA5UEDF7OoOIFEQU=
    < 
    < Name: res/_U.png
    < SHA-256-Digest: JMmR+jCMJR13m/rCUgu1uaJ2ooMHSlzWiVZiCY2RCwo=
    < 
    < Name: res/_Y.xml
    < SHA-256-Digest: PUJ9XXzY3GrDUxQyEhfyVeFx/FUPdrLW4taW0qvDSlg=
    < 
    < Name: res/_o.xml
    < SHA-256-Digest: aLf8DoGcUmx+McFBOxghvAzPz0q1UMNWp/dAqdhJF9w=
    < 
    < Name: res/_q.png
    < SHA-256-Digest: UlSajQtsNfryeV799rTF/iyzS36LEDnMp6onabbKs9A=
    < 
    < Name: res/_y.xml
    < SHA-256-Digest: tjEZR9ikuCug0p4W+MDp/YA+TLDgZJP71xfosXrmrhk=
    < 
    < Name: res/a0.xml
    < SHA-256-Digest: cFToMxbGuQcqt9sefCAEPJrxZ9pI6GoBTlcA8qJ/i1c=
    < 
    < Name: res/aG.xml
    < SHA-256-Digest: C/KPWBGFbXfTRqBO6jwrhsJqeYOHAP7pT009x8APKs4=
    < 
    < Name: res/aM.xml
    < SHA-256-Digest: zrkVeGTlzFYqIfHkZjE5JA1zKJ/FGjDJlqjC7o6J7F0=
    < 
    < Name: res/aP.png
    < SHA-256-Digest: mOzTBxSPKzpoehlhwZZTGh3/JknD2O9obLl+FxrDKqo=
    < 
    < Name: res/aR.png
    < SHA-256-Digest: 5kwuV2J+JOwe035nNEwr8x0da90tjXFYQMHt8L0UJbY=
    < 
    < Name: res/aU.9.png
    < SHA-256-Digest: xjqU5xNs7u9DsK3otJ6OHvTRBg1YT2y5q1i31uqhYxI=
    < 
    < Name: res/aU.png
    < SHA-256-Digest: h62tMuDsGcTpIEIL86Bsn5T2Eo7Q2GahiRYorqss7wY=
    < 
    < Name: res/aW.xml
    < SHA-256-Digest: mwrHkaP6lT4otSbgIP0uYptAgS7hvEaT/1/f7xUEQgI=
    < 
    < Name: res/ak.xml
    < SHA-256-Digest: qqq7Gti7ctTbKnz3MPpc2HVbxOlyUXm0E9fAoh+HiHw=
    < 
    < Name: res/ar.png
    < SHA-256-Digest: KZU72AGd2Wt3ATKbmiA8/2NGBRlUm5zKml63T5sbCTA=
    ---
    > Name: res/anim/catalyst_fade_in.xml
    > SHA-256-Digest: /WwPcJf1N95BiYqy+ecM5x8aCsXTg+MPrn6VwfGwfHM=
    1929,1930c687,688
    < Name: res/as.png
    < SHA-256-Digest: e0Ndt/J6d49z1NiffROXf7Jw5N5qrwSefLju/nBkEzU=
    ---
    > Name: res/anim/catalyst_fade_out.xml
    > SHA-256-Digest: DaVdRqlfM5WJhBzRGtHcpaLgWT3+78MAAnZ0k22hdA0=
    1932,1933c690,691
    < Name: res/bL.xml
    < SHA-256-Digest: ZcHDrJ/BxNKU7hS8tN4Oj8OCargm4hif0YYSTN2ToR4=
    ---
    > Name: res/anim/catalyst_push_up_in.xml
    > SHA-256-Digest: DE9+nn+mzUJnN3cfgdXze2vXlwcXpzS+ABbccRty1nQ=
    1935,1936c693,694
    < Name: res/bX.9.png
    < SHA-256-Digest: ovGjevjmmTIKL62+VO6qYRLVo1ItV9aC7fBP6XvjtH4=
    ---
    > Name: res/anim/catalyst_push_up_out.xml
    > SHA-256-Digest: VLICoJwNMNGPEU397b2n74icCjPV53bzZu2KOaf2FIM=
    1938,1939c696,697
    < Name: res/bb.xml
    < SHA-256-Digest: l2yLFuagco5jieJE6PjifSxdyLVaTSDm1HNaSaEFh0M=
    ---
    > Name: res/anim/catalyst_slide_down.xml
    > SHA-256-Digest: wWxqCay7Vz0wxbs0+QKdcXCKscb54F1TvI6GOMct5Mc=
    1941,1942c699,700
    < Name: res/bi.png
    < SHA-256-Digest: 8v9i9HPYpeAKi2yBwVvpoFNkccPVqB430EvDNW6oHKA=
    ---
    > Name: res/anim/catalyst_slide_up.xml
    > SHA-256-Digest: LwTaeidXqvto0rC4GlXU12DPIaGBFdvbmyGgXWQ/l3M=
    1944,1945c702,703
    < Name: res/bt.xml
    < SHA-256-Digest: lyikmEchv1JpjNsnEhRxRSqEtO1RbaFptsmWD3exO5g=
    ---
    > Name: res/animator/fragment_close_enter.xml
    > SHA-256-Digest: mkvSeapSZhn5BH708BKXgI5Yrw/45mEXu8Q56HvsE+A=
    1947,1948c705,706
    < Name: res/c5.xml
    < SHA-256-Digest: aLf8DoGcUmx+McFBOxghvAzPz0q1UMNWp/dAqdhJF9w=
    ---
    > Name: res/animator/fragment_close_exit.xml
    > SHA-256-Digest: kUk4m9GvBGY4GrYmDhSN50hWWt1a8KMxGUQsLZWCejQ=
    1950,1951c708,709
    < Name: res/c6.xml
    < SHA-256-Digest: XdLllM8nWR8Z7PMNTB7d3rBqeanh3atfh82mDL+r/Xg=
    ---
    > Name: res/animator/fragment_fade_enter.xml
    > SHA-256-Digest: C1EBP8D16RanJ7dVEsHukgYXi9E0UJt7S+ajl/pNmms=
    1953,1954c711,712
    < Name: res/cL.xml
    < SHA-256-Digest: dPE5EMY0prRzDeT6mcWllc1JOd8CH755paT3P2CUVlo=
    ---
    > Name: res/animator/fragment_fade_exit.xml
    > SHA-256-Digest: RAwjTKigkYjsVYsTdxyynC2iKJVr+1i9reXBdwOErL4=
    1956,1957c714,715
    < Name: res/cV.xml
    < SHA-256-Digest: +PUiJxjAgWy4ytEp3TBkSBpVmfC7sNHu0w7OnPcIvXI=
    ---
    > Name: res/animator/fragment_open_enter.xml
    > SHA-256-Digest: 8WrNqB5j911IjgxqRR4Sf6Mk5Sr1yzom95nTr52hOVU=
    1959,1960c717,718
    < Name: res/cm.xml
    < SHA-256-Digest: OBbIPULSPA3Ia5f4h7MVIAkYDEUs87vlGr1pkNRFKaU=
    ---
    > Name: res/animator/fragment_open_exit.xml
    > SHA-256-Digest: cpKIsj02iJrzA2n3WiD1KaFI0RFq+gwwFNmNOrzTS2k=
    2031,2032c789,790
    < Name: res/cr.xml
    < SHA-256-Digest: N/8EBZH5Z4a/r509k3/t8vL5fiGMBr6z5/6KJEKhgag=
    ---
    > Name: res/drawable-anydpi-v23/fingerprint_dialog_fp_icon.xml
    > SHA-256-Digest: Sq8cu6OgU4C0D2souaxX55Qt/1ZseZ30OIyr33F9gSU=
    2034,2035c792,793
    < Name: res/d3.png
    < SHA-256-Digest: L6UkzaeNfr1mFkqJagQid7ela4ZY+zGPxwChFMsE97I=
    ---
    > Name: res/drawable-anydpi-v24/fingerprint_dialog_error.xml
    > SHA-256-Digest: qqq7Gti7ctTbKnz3MPpc2HVbxOlyUXm0E9fAoh+HiHw=
    2037,2038c795,796
    < Name: res/d5.9.png
    < SHA-256-Digest: u0sJKuacQp6dT3/5fGC6EMLkQ6Kwyhmp9sd4VL8y4pM=
    ---
    > Name: res/drawable-hdpi-v4/notification_oversize_large_icon_bg.png
    > SHA-256-Digest: qgAIjQ2f2XvZLtn/0ptUu2mkiphKpzRIzlU/udgSvkE=
    2040,2041c798,800
    < Name: res/dO.xml
    < SHA-256-Digest: 552NQkC0PcWYFnGtBOrVcuOvP56P40zoxH21r7Vmb08=
    ---
    > Name: res/drawable-mdpi-v4/node_modules_reactnative_libraries_logbox_u
    >  i_logboximages_alerttriangle.png
    > SHA-256-Digest: OB7EirEdTSuePX46Kj/tO6/H1Ghs9qqQ7XKUWHZ+QAo=
    2043,2044c802,804
    < Name: res/dW.png
    < SHA-256-Digest: QTODD0P5uqCw7TzIDXmLIAcdqfUf4S72sL0Jq8jV0zo=
    ---
    > Name: res/drawable-mdpi-v4/node_modules_reactnative_libraries_logbox_u
    >  i_logboximages_chevronleft.png
    > SHA-256-Digest: A6dlwhbNu2SRI8yHXgMn0qDzzJHaYJRKrb3xvXRTf+Y=
    2046,2047c806,808
    < Name: res/dY.png
    < SHA-256-Digest: XO0qt3SFMFAlXXMJ4Qt2IXgT1W8/irj7c6w/Y12QxnY=
    ---
    > Name: res/drawable-mdpi-v4/node_modules_reactnative_libraries_logbox_u
    >  i_logboximages_chevronright.png
    > SHA-256-Digest: mOzTBxSPKzpoehlhwZZTGh3/JknD2O9obLl+FxrDKqo=
    2049,2050c810,812
    < Name: res/df.xml
    < SHA-256-Digest: aNtLuKtAUYC/3DYVp5aEB+OpAVFWGG2dg8nkCP4nvns=
    ---
    > Name: res/drawable-mdpi-v4/node_modules_reactnative_libraries_logbox_u
    >  i_logboximages_close.png
    > SHA-256-Digest: v8eBFQIXaoBD2qeAWpDATyHPRhUSBy6eukN42r/bvFM=
    2052,2053c814,816
    < Name: res/eA.xml
    < SHA-256-Digest: FOwXLylmL1P+eTRUXIu4cFzl9HUkBMFs7cZLXA/GYrI=
    ---
    > Name: res/drawable-mdpi-v4/node_modules_reactnative_libraries_logbox_u
    >  i_logboximages_loader.png
    > SHA-256-Digest: Q5AfjHROVDRS2Y3necy57sLr2ZNZxyzc43l1fIlgXpI=
    2055,2056c818,819
    < Name: res/eR.png
    < SHA-256-Digest: yIJc1jflmgJQDYt1GFYvDJG+8u3Zcbo+WtD0FnlNYY4=
    ---
    > Name: res/drawable-mdpi-v4/src_static_noconnectionbg.jpg
    > SHA-256-Digest: m4PCXi+ErcRYS8Djog8LJXhIkFWQYfwuZ0/Vn2tbmhw=
    2058,2059c821,822
    < Name: res/eT.9.png
    < SHA-256-Digest: gFApeTAt7nNT9HX1WMSXrmaX93GBpR98yAtA1ywuDEw=
    ---
    > Name: res/drawable-v21/abc_action_bar_item_background_material.xml
    > SHA-256-Digest: XEBGynF7/4KlXT1NPl7oY1+63+ZKw1iqOW/UZkCF6mA=
    2061,2062c824,825
    < Name: res/ej.9.png
    < SHA-256-Digest: N4aUcG+3JW3SJI4q+FTv1x7H6IhfYdouFqK9Mvzz0Kk=
    ---
    > Name: res/drawable-v21/abc_btn_colored_material.xml
    > SHA-256-Digest: aEz6Za3vJhPk9EhsonRTZnHicbdAkLXO9BlkiTIiyis=
    2064,2065c827,828
    < Name: res/ev.9.png
    < SHA-256-Digest: icKOiHsNYMAbNdzSvmVPQWv/tm6FZXFtyYPjsCBJZ+g=
    ---
    > Name: res/drawable-v21/abc_dialog_material_background.xml
    > SHA-256-Digest: L+q5rIqla27f2yC+bnx51gBrPu5PiIfqpUWMykuAPDI=
    2067,2068c830,831
    < Name: res/fM.9.png
    < SHA-256-Digest: tSIoo1Ug4teG6WLoUBP+f3yX/7Qmd/O9q8Ay+7cJlSo=
    ---
    > Name: res/drawable-v21/abc_edit_text_material.xml
    > SHA-256-Digest: WANcb9rsrIOY4UfkXwGeh3/MoRs6XhnTTp7kKT8pMnI=
    2070,2071c833,834
    < Name: res/fO.png
    < SHA-256-Digest: 5ds/l81+paMMn6xiEnwowMsKTBNePEy7hIgf083QVV4=
    ---
    > Name: res/drawable-v21/abc_list_divider_material.xml
    > SHA-256-Digest: l2yLFuagco5jieJE6PjifSxdyLVaTSDm1HNaSaEFh0M=
    2073,2074c836,837
    < Name: res/fY.xml
    < SHA-256-Digest: PAClMb30xSso5T5eNXmS0qnN+qWLd1XiWXUghh5kxVE=
    ---
    > Name: res/drawable-v21/notification_action_background.xml
    > SHA-256-Digest: fTPMuZZ+5D9Z3UHSyXJmN+0cVBdjtMRIj7byjvDQ0EA=
    2076,2077c839,840
    < Name: res/g-.png
    < SHA-256-Digest: Pbutkm1UBYbWvRIw8ykxCHdMlec/ZgTwu/iMOhFTAiM=
    ---
    > Name: res/drawable-v23/abc_control_background_material.xml
    > SHA-256-Digest: lA+pjTs3QV4ODj+HFK6ZVcOaQ+LEM4LExy2Z/09R8X8=
    2079,2080c842,843
    < Name: res/g-.xml
    < SHA-256-Digest: TtCRYnMZl0ojvBHnrdOt4AbPOfR/YmShgLXTjju+bZQ=
    ---
    > Name: res/drawable-v29/autofill_inline_suggestion_chip_background.xml
    > SHA-256-Digest: nJCTqosfSBJaTwCO8wIyY8fLDJOh5cfm7w82SU1JgdQ=
    2082,2083c845,846
    < Name: res/gE.png
    < SHA-256-Digest: SmkfvJjLJeIGM5thuiNiyaLOxvYChFagyMCEimw+Xs8=
    ---
    > Name: res/drawable-watch-v20/abc_dialog_material_background.xml
    > SHA-256-Digest: SfTuAzo2i+YoZQGneGuxeDIBAJh/lZvDPJjn2h/IYfE=
    2085,2086c848,849
    < Name: res/gK.9.png
    < SHA-256-Digest: L3+9oLpuU+mkfi/A4k4yxEfGE6WAjC1ihdxlHoOgetc=
    ---
    > Name: res/drawable/abc_btn_borderless_material.xml
    > SHA-256-Digest: spne+H65fX8dI3TDzCtdJWmZuBCqzkU531+XeUvppzM=
    2088,2089c851,852
    < Name: res/gR.xml
    < SHA-256-Digest: PF+p+bcZEPvX1FZ6bQYN7B4dkwXKGc4jhsnlCiVX18o=
    ---
    > Name: res/drawable/abc_btn_check_material.xml
    > SHA-256-Digest: ujnlu4ItmjQkw/pKeC3ATGps+zsXMo/JzIeZBj+zG7Y=
    2091,2092c854,855
    < Name: res/gZ.9.png
    < SHA-256-Digest: vYk3g8jSvrsWesBaJ82upd/WUf6NZLyzDBTnuSU4DHk=
    ---
    > Name: res/drawable/abc_btn_check_material_anim.xml
    > SHA-256-Digest: 9UchIkQp+YqDtdzXQzl5pYLb4G10NzpuS1/KUzRnlRM=
    2094,2095c857,858
    < Name: res/gf.png
    < SHA-256-Digest: jQsswCmikLB8PSe/qhpdJIvSHQVKEzeQiPv6N5vLuPU=
    ---
    > Name: res/drawable/abc_btn_default_mtrl_shape.xml
    > SHA-256-Digest: uyCrteyBuPetJZI6ItMVfPb3h+s1nGyske8CiDUU0ek=
    2097,2098c860,861
    < Name: res/gj.9.png
    < SHA-256-Digest: 1o0Dln+yIvfjV3Ki4GN/c7TdDWy7nuPytEMtL5DCV9s=
    ---
    > Name: res/drawable/abc_btn_radio_material.xml
    > SHA-256-Digest: NCospfejrlthimOLWY75KtIw2JFt+kfP0kHudvagj2A=
    2100,2101c863,864
    < Name: res/gr.png
    < SHA-256-Digest: XIDYinuC71gzJVv3D/HCbD77KpKukMrCIvMgD1ngseo=
    ---
    > Name: res/drawable/abc_btn_radio_material_anim.xml
    > SHA-256-Digest: ph7JoI/Cm6zbX1GYbcn1BSkCcbpQkckJVC36rlgLBsY=
    2103,2104c866,867
    < Name: res/gt.9.png
    < SHA-256-Digest: mhpIA4qNHcBBA1tJzHMtsj4AjRJsiy5oB0ndKWFqN7M=
    ---
    > Name: res/drawable/abc_cab_background_internal_bg.xml
    > SHA-256-Digest: y0hkc7wPfWyQ3qVk/WG7YSSWNxtrC8q4K5WhDPcNtB4=
    2106,2107c869,870
    < Name: res/h4.xml
    < SHA-256-Digest: NWDFwJkHhZ5lcO6ie8vH9Ve9if+9Fq9F9pE8wEbGKNE=
    ---
    > Name: res/drawable/abc_cab_background_top_material.xml
    > SHA-256-Digest: HW14lQHwLJG8g5rkOXeJ+oiyVw1qMlCsSM49e2Zptes=
    2109,2110c872,873
    < Name: res/h6.png
    < SHA-256-Digest: jQsswCmikLB8PSe/qhpdJIvSHQVKEzeQiPv6N5vLuPU=
    ---
    > Name: res/drawable/abc_ic_ab_back_material.xml
    > SHA-256-Digest: 0oK+/++ZX8HuuX6+ejzjoXnzJjVTu9EQADV+hkcU2Fc=
    2112,2113c875,876
    < Name: res/h7.9.png
    < SHA-256-Digest: n4SbzXiK3Osy9MGlqoknSb0eJEo3h7+/vTDTtvXY6ds=
    ---
    > Name: res/drawable/abc_ic_arrow_drop_right_black_24dp.xml
    > SHA-256-Digest: ZU6YsqOfsBUJz1L1/RyfDiiVIPPXXZGP+BxxUP+Ah/8=
    2115,2116c878,879
    < Name: res/hP.xml
    < SHA-256-Digest: mFhPpXsQ/9IxqmS/3+SJWGHj5whopaVfYB5DFtlHaDI=
    ---
    > Name: res/drawable/abc_ic_clear_material.xml
    > SHA-256-Digest: OGkTfroDMBaH7egfDb0PfRHjeE7R+Srh6iU4CoReCro=
    2118,2119c881,882
    < Name: res/hP1.xml
    < SHA-256-Digest: y3AJjwVRh2QQ5taDuHMgVyqelpNWYEOvTMNMVfy1aCc=
    ---
    > Name: res/drawable/abc_ic_go_search_api_material.xml
    > SHA-256-Digest: StE6nImHRXs/zTwru9zkNdSmV+pVGiRNV9bLaB7qI1g=
    2121,2122c884,885
    < Name: res/hZ.9.png
    < SHA-256-Digest: N4aUcG+3JW3SJI4q+FTv1x7H6IhfYdouFqK9Mvzz0Kk=
    ---
    > Name: res/drawable/abc_ic_menu_copy_mtrl_am_alpha.xml
    > SHA-256-Digest: hNvfeK2ZRyhm/X+fQER/yuN3wC4HgJNZh6lgvbbWnsw=
    2124,2125c887,888
    < Name: res/ha.xml
    < SHA-256-Digest: //mBL2WXBwDPZ6qF4bcVX9doHpvwg4k08ekikuGS7TI=
    ---
    > Name: res/drawable/abc_ic_menu_cut_mtrl_alpha.xml
    > SHA-256-Digest: MNVt6GZ+bN7vtI2aKgBLQFILzbxlp8DIQ2eQIuFxafs=
    2127,2128c890,891
    < Name: res/hh.9.png
    < SHA-256-Digest: 1cZEsA7nm9Tx/LeJ67+J55wMb+qHjfvEqMZMO+NLWwM=
    ---
    > Name: res/drawable/abc_ic_menu_overflow_material.xml
    > SHA-256-Digest: xhpra+X7vrKu/b9U2ONQORy3APm5r9aSlmGJ0Xsj+98=
    2130,2131c893,894
    < Name: res/hq.xml
    < SHA-256-Digest: srjqtXA1dhCnMyLnd5FJNqHrY5mt4wkGeD6uGg1jJWQ=
    ---
    > Name: res/drawable/abc_ic_menu_paste_mtrl_am_alpha.xml
    > SHA-256-Digest: o9v+TlywZ4j21Xvee5COwoVkMmG9IavxrnMY0qyhvDk=
    2133,2134c896,897
    < Name: res/hs.xml
    < SHA-256-Digest: DaVdRqlfM5WJhBzRGtHcpaLgWT3+78MAAnZ0k22hdA0=
    ---
    > Name: res/drawable/abc_ic_menu_selectall_mtrl_alpha.xml
    > SHA-256-Digest: OBbIPULSPA3Ia5f4h7MVIAkYDEUs87vlGr1pkNRFKaU=
    2136,2137c899,900
    < Name: res/i6.9.png
    < SHA-256-Digest: 9i16ofkpcwKkMzKlmDR1XtvTo4ZwuMUjYUrhNmtflH8=
    ---
    > Name: res/drawable/abc_ic_menu_share_mtrl_alpha.xml
    > SHA-256-Digest: kJ9EaLc4I8tQBXCrRwZ6QbNzCqxzcpr9tz6jJdPdoEs=
    2139,2140c902,903
    < Name: res/iO.png
    < SHA-256-Digest: uEoneAf487tTeOY1PZnRNEruEL2aBfR8MK/jgy2cp/A=
    ---
    > Name: res/drawable/abc_ic_search_api_material.xml
    > SHA-256-Digest: BKrMSgtyA+HAGXnhiwegBzYGTyI/+woxvT/eMU1ln5w=
    2142,2143c905,906
    < Name: res/iQ.xml
    < SHA-256-Digest: XPot/vVo4d1fVdG2cJp5Z4mpm2ctLSr12jJVF1H3JuE=
    ---
    > Name: res/drawable/abc_ic_voice_search_api_material.xml
    > SHA-256-Digest: 0bHDYcljHdJQOe4PXm4II7zGCPjIV5wFzakr83B6dc8=
    2145,2146c908,909
    < Name: res/iR.9.png
    < SHA-256-Digest: Lj1wIwl3rzfG13OYmac+Y5N+69/m2ALxqVfEPC8qsTE=
    ---
    > Name: res/drawable/abc_item_background_holo_dark.xml
    > SHA-256-Digest: 4ppiUuY/T797ynunAlq3l3URtazPU8OA++hNnHA540A=
    2148,2149c911,912
    < Name: res/io.9.png
    < SHA-256-Digest: FBdXQTTF6TIcCxj+pxGghEjM9JlX9V4Qztr7EyN1EPc=
    ---
    > Name: res/drawable/abc_item_background_holo_light.xml
    > SHA-256-Digest: EVv49tN2kHB2fmthFR2dK+iBM/NoG5FWxdkU+7LVs0o=
    2151,2152c914,916
    < Name: res/j3.xml
    < SHA-256-Digest: 7CJFULHjW4ZaIVO5tNpHUINqIvMD9F3vPx4/IaxorqQ=
    ---
    > Name: res/drawable/abc_list_selector_background_transition_holo_dark.x
    >  ml
    > SHA-256-Digest: +3HsnqMtF2cqx5TIRyx0YnEzPFPjRR+XtYoevzuTQ9c=
    2154,2155c918,920
    < Name: res/j4.png
    < SHA-256-Digest: YALrVng7lWtfkebd/682zIZ0AqAaIl5ie0wlyNIaTiM=
    ---
    > Name: res/drawable/abc_list_selector_background_transition_holo_light.
    >  xml
    > SHA-256-Digest: WLqeK530V/Dwl9RY8pwDLeSyrfarYVCDWErJ/NVbCRA=
    2157,2158c922,923
    < Name: res/jS.9.png
    < SHA-256-Digest: /XGeSXqvCRwxZstRv0QEykvDtlRd+++/qgzzHweQt9E=
    ---
    > Name: res/drawable/abc_list_selector_holo_dark.xml
    > SHA-256-Digest: wlLNB4CITXXN3vDBSCc9zAeu3s8AOMiPJecSyZBrod4=
    2160,2161c925,926
    < Name: res/jS1.9.png
    < SHA-256-Digest: N4aUcG+3JW3SJI4q+FTv1x7H6IhfYdouFqK9Mvzz0Kk=
    ---
    > Name: res/drawable/abc_list_selector_holo_light.xml
    > SHA-256-Digest: Zo3po8JudTsjeNW6m13AjoQwmbf9rFH50ggReue7dEc=
    2163,2164c928,929
    < Name: res/jW.png
    < SHA-256-Digest: JPXbIm8c1W5ed1+Cw39l89HuyQkbJrdIYWKcrwAZw70=
    ---
    > Name: res/drawable/abc_ratingbar_indicator_material.xml
    > SHA-256-Digest: mwrHkaP6lT4otSbgIP0uYptAgS7hvEaT/1/f7xUEQgI=
    2166,2167c931,932
    < Name: res/je.9.png
    < SHA-256-Digest: IfC1UoC+ELGHzv+O3vSlpwR2g+bp/PR95BCqODn0EJQ=
    ---
    > Name: res/drawable/abc_ratingbar_material.xml
    > SHA-256-Digest: mwrHkaP6lT4otSbgIP0uYptAgS7hvEaT/1/f7xUEQgI=
    2169,2170c934,935
    < Name: res/k1.xml
    < SHA-256-Digest: LwTaeidXqvto0rC4GlXU12DPIaGBFdvbmyGgXWQ/l3M=
    ---
    > Name: res/drawable/abc_ratingbar_small_material.xml
    > SHA-256-Digest: mwrHkaP6lT4otSbgIP0uYptAgS7hvEaT/1/f7xUEQgI=
    2172,2173c937,938
    < Name: res/k8.xml
    < SHA-256-Digest: +AEQs//V8Lx9zXdpKxbnpJWrHi4cXVJDn2RFoPaoRS0=
    ---
    > Name: res/drawable/abc_seekbar_thumb_material.xml
    > SHA-256-Digest: 7CJFULHjW4ZaIVO5tNpHUINqIvMD9F3vPx4/IaxorqQ=
    2175,2176c940,941
    < Name: res/kJ.9.png
    < SHA-256-Digest: wPkwpyKhbfmGkjv0GQgdEJD5R2pyh8i2Vas2/8CAZMs=
    ---
    > Name: res/drawable/abc_seekbar_tick_mark_material.xml
    > SHA-256-Digest: ufyAinAwOAH7PAyiSpwee3WZNOkIZnZYnmuHE3SkM4A=
    2178,2179c943,944
    < Name: res/kS.png
    < SHA-256-Digest: EuyfmtX6PX2JcRSvbCKXtm8xywVuQ9r/voDSP29mOW0=
    ---
    > Name: res/drawable/abc_seekbar_track_material.xml
    > SHA-256-Digest: ZcHDrJ/BxNKU7hS8tN4Oj8OCargm4hif0YYSTN2ToR4=
    2181,2182c946,947
    < Name: res/k_.xml
    < SHA-256-Digest: mt7Zf3HH6jb4aeNyukR+qH6qYTenkyDStzn9tDHoPdE=
    ---
    > Name: res/drawable/abc_spinner_textfield_background_material.xml
    > SHA-256-Digest: RD6z5u3HkMigs7b8Pbi+7hrRzToaeLuEgQYorx1D34s=
    2184,2185c949,950
    < Name: res/kj.xml
    < SHA-256-Digest: g2OTeGlCBs5Q5fxfrO9jxrZDIaEjGx8b0m2Odtc/bkM=
    ---
    > Name: res/drawable/abc_star_black_48dp.xml
    > SHA-256-Digest: dPE5EMY0prRzDeT6mcWllc1JOd8CH755paT3P2CUVlo=
    2187,2188c952,953
    < Name: res/kn.xml
    < SHA-256-Digest: ph7JoI/Cm6zbX1GYbcn1BSkCcbpQkckJVC36rlgLBsY=
    ---
    > Name: res/drawable/abc_star_half_black_48dp.xml
    > SHA-256-Digest: BbW67c1Y/ZlfsBPyBnyH27X5SJ15NXI4KajfgD1Qdgk=
    2190,2191c955,956
    < Name: res/kp.png
    < SHA-256-Digest: 9fNJwelJ8OZjdPg7Zn/A0PR3N5YU82kSreIqKZ8hlNU=
    ---
    > Name: res/drawable/abc_switch_thumb_material.xml
    > SHA-256-Digest: KRy2x+DzAdoeVEN3EHEnZvr19oPu0wEi6872cBmbwgA=
    2193,2194c958,959
    < Name: res/lN.xml
    < SHA-256-Digest: qNc0HCDQfJ/atgLnw5GHyau5yvX7+bKDLNbZ8YoshsI=
    ---
    > Name: res/drawable/abc_tab_indicator_material.xml
    > SHA-256-Digest: ZRICVABh9h3+5jjNym0b3t638aiQ8JCTIYU8TZGCDpo=
    2196,2197c961,962
    < Name: res/lP.9.png
    < SHA-256-Digest: uLJnCNcbTHpc9TEavN+nQf7jnJ9eE4PUnKDGd/zbA80=
    ---
    > Name: res/drawable/abc_text_cursor_material.xml
    > SHA-256-Digest: 5Jo9ZUn4/86e9nFqHc4Ab2R5fqrmC8CRsWxWDiDuWb0=
    2199,2200c964,965
    < Name: res/lR.xml
    < SHA-256-Digest: 4h4V3Y4eltry4qB937iT1cBEpdDdWBT3QYRCM5EsAQc=
    ---
    > Name: res/drawable/abc_textfield_search_material.xml
    > SHA-256-Digest: xYSzZX5O+6y+mPYWps+lHdH38ewufHwmcVCZh6prCL8=
    2202,2203c967,968
    < Name: res/ls.xml
    < SHA-256-Digest: VqiA+AzbnHCnk8jj3VHekKLqyVaRRQg4WIgS2FV1dVk=
    ---
    > Name: res/drawable/abc_vector_test.xml
    > SHA-256-Digest: srjqtXA1dhCnMyLnd5FJNqHrY5mt4wkGeD6uGg1jJWQ=
    2205,2206c970,971
    < Name: res/ly.png
    < SHA-256-Digest: 3AivnRTmtnO/nzHCSCNvBFezIkZANmR0c+OjKiN3Pw4=
    ---
    > Name: res/drawable/btn_checkbox_checked_mtrl.xml
    > SHA-256-Digest: wtRYWzguzopUUUniZ38EHxEx5nOdx1RQiKoDByNpPq0=
    2208,2209c973,975
    < Name: res/m0.png
    < SHA-256-Digest: d3oc9TggqkZyZ9H2Tl+SNlb5MEcDjqY3W8ziV7UXkw4=
    ---
    > Name: res/drawable/btn_checkbox_checked_to_unchecked_mtrl_animation.xm
    >  l
    > SHA-256-Digest: aaEq66ms343S6SXE/KmoZEmEebgFBPOmpnBMs/S/abI=
    2211,2212c977,978
    < Name: res/mm.9.png
    < SHA-256-Digest: 1NKw27A58cY5UYOr6UWzlHCtmop7aApA+nkN9sZFu0M=
    ---
    > Name: res/drawable/btn_checkbox_unchecked_mtrl.xml
    > SHA-256-Digest: 5hjS/+llrkdfRiKBo0nAF3t2vJXB0LrCGTJYc6K1Gtc=
    2214,2215c980,982
    < Name: res/nI.9.png
    < SHA-256-Digest: xWq5N1sUm6HF7iaPIrPPZQe7R5hvYoORUA+6OBR9qyg=
    ---
    > Name: res/drawable/btn_checkbox_unchecked_to_checked_mtrl_animation.xm
    >  l
    > SHA-256-Digest: hTiRNa4UjVU2IBdkvq/9SVFRYsIx8f3JSkzBbrd2otE=
    2217,2218c984,985
    < Name: res/nP.xml
    < SHA-256-Digest: HQWmPDmC2m8J2NxSaqjLUk2VZQPXQzEGE2+W0tb/IoE=
    ---
    > Name: res/drawable/btn_radio_off_mtrl.xml
    > SHA-256-Digest: KhKikZN5HTSbtRJFL1Tj1ndV3tZ5xHtLjhVA6IaV5y8=
    2220,2221c987,988
    < Name: res/nT.xml
    < SHA-256-Digest: RD6z5u3HkMigs7b8Pbi+7hrRzToaeLuEgQYorx1D34s=
    ---
    > Name: res/drawable/btn_radio_off_to_on_mtrl_animation.xml
    > SHA-256-Digest: k3KUusUeBlCicm0Xy3PFAaWXgkyiNc2wqDqIdHiZZMA=
    2223,2224c990,991
    < Name: res/nf.png
    < SHA-256-Digest: XgeZoNC11D7Vrjo3iqoIR6gQzu/1jbmg94Nuv07xcUY=
    ---
    > Name: res/drawable/btn_radio_on_mtrl.xml
    > SHA-256-Digest: 8sTN9lyqWYHFJRG8ofPlQTaV+CRFGD1qldDdgSDdahQ=
    2226c993,996
    < Name: res/nz.xml
    ---
    > Name: res/drawable/btn_radio_on_to_off_mtrl_animation.xml
    > SHA-256-Digest: abXt7wPIzBe5mj0qsZ5Joe5pUSq+43n3Xg5frqWnyZc=
    > 
    > Name: res/drawable/notification_bg.xml
    2229,2230c999,1000
    < Name: res/o-.png
    < SHA-256-Digest: e0Ndt/J6d49z1NiffROXf7Jw5N5qrwSefLju/nBkEzU=
    ---
    > Name: res/drawable/notification_bg_low.xml
    > SHA-256-Digest: aNtLuKtAUYC/3DYVp5aEB+OpAVFWGG2dg8nkCP4nvns=
    2232,2233c1002,1003
    < Name: res/o9.9.png
    < SHA-256-Digest: lK4ic6M1ZywcZ5iOevWV1C6AUm7bf1ZU7hMNzgb9QNc=
    ---
    > Name: res/drawable/notification_icon_background.xml
    > SHA-256-Digest: XdLllM8nWR8Z7PMNTB7d3rBqeanh3atfh82mDL+r/Xg=
    2235,2236c1005,1006
    < Name: res/oP.xml
    < SHA-256-Digest: 9UchIkQp+YqDtdzXQzl5pYLb4G10NzpuS1/KUzRnlRM=
    ---
    > Name: res/drawable/notification_tile_bg.xml
    > SHA-256-Digest: 7jM4MnPz3DQd8whxXiWDHu/ZOhh8qvZ/BnqWGYixC2Q=
    2238,2239c1008,1009
    < Name: res/o_.9.png
    < SHA-256-Digest: IDQyIvn3ndVlw6IkhJTUUucIIKwcQ3Fzw4ut1F+WKv0=
    ---
    > Name: res/drawable/redbox_top_border_background.xml
    > SHA-256-Digest: 14uiFug5l/M17NJiC5eF2hX8C5pM02Nv7WRtxhGpVfQ=
    2241,2242c1011,1012
    < Name: res/o_.png
    < SHA-256-Digest: 0ZCSJUqkEz+6i3eV+121YK1dzRbG95IBvsMbDx6bYIs=
    ---
    > Name: res/drawable/rn_edit_text_material.xml
    > SHA-256-Digest: hkmyIDUDj38hoYl3c4dOLfu+sRSKMCZrozclUtJtGWw=
    2244,2245c1014,1015
    < Name: res/op.9.png
    < SHA-256-Digest: +BQSxRMQRqg/XZ3h0Q4rSzH24mV8TAh0OCXNQPYF/dM=
    ---
    > Name: res/drawable/splashscreen.xml
    > SHA-256-Digest: o9xwPNs/dEvhC0lcq/symAXdY5r7zu9UGxjf+Il+yJ0=
    2247,2248c1017,1018
    < Name: res/p8.png
    < SHA-256-Digest: q3O3KbuVh4Ego73I3JFfOqodcHD8ZEoN5k1AlBrVB+0=
    ---
    > Name: res/drawable/test_level_drawable.xml
    > SHA-256-Digest: 2MoWdzaleFa4uAAvFb0icmwaqJ6TPv7dvNyj8d+JS5A=
    2250,2251c1020,1021
    < Name: res/pT.xml
    < SHA-256-Digest: mwN06HeBRrY9RBeXQ0sB7CNk1569jl1Cvb3vyTMzq5s=
    ---
    > Name: res/drawable/tooltip_frame_dark.xml
    > SHA-256-Digest: u7mx9YTta0XDT0NGdIXwlNF1jO6pT0m3muBN5t9hgYk=
    2253,2254c1023,1024
    < Name: res/pU.xml
    < SHA-256-Digest: ZQxUxe/3NAku4JNU/6HYM5MbdwbyeX6AH4JWBMR8LdM=
    ---
    > Name: res/drawable/tooltip_frame_light.xml
    > SHA-256-Digest: lDqWWXS3y0c/YXS1ZC/PO7zHfHUpJ+LTxLAEESEtAZs=
    2256,2257c1026,1028
    < Name: res/pY.png
    < SHA-256-Digest: hDDsAD4APz8roveNSP0VDiVAdmflMOguh6fUhBwP1nY=
    ---
    > Name: res/interpolator/btn_checkbox_checked_mtrl_animation_interpolato
    >  r_0.xml
    > SHA-256-Digest: aLf8DoGcUmx+McFBOxghvAzPz0q1UMNWp/dAqdhJF9w=
    2259,2260c1030,1032
    < Name: res/pk.png
    < SHA-256-Digest: sKoBDnqIXkt6ZpwWx7oQ/NhioS3/PxQsc1R3hEKmP94=
    ---
    > Name: res/interpolator/btn_checkbox_checked_mtrl_animation_interpolato
    >  r_1.xml
    > SHA-256-Digest: CrO8grO5/YSZICyv49SUqfZvuiSNAekLkOkyyISZR8w=
    2262,2263c1034,1036
    < Name: res/ps.9.png
    < SHA-256-Digest: uAD6x9Lwp1sX+tcAlwfqSRNJGeSJhOiYFanSTA+nBNg=
    ---
    > Name: res/interpolator/btn_checkbox_unchecked_mtrl_animation_interpola
    >  tor_0.xml
    > SHA-256-Digest: aLf8DoGcUmx+McFBOxghvAzPz0q1UMNWp/dAqdhJF9w=
    2265,2266c1038,1040
    < Name: res/pu.png
    < SHA-256-Digest: qgAIjQ2f2XvZLtn/0ptUu2mkiphKpzRIzlU/udgSvkE=
    ---
    > Name: res/interpolator/btn_checkbox_unchecked_mtrl_animation_interpola
    >  tor_1.xml
    > SHA-256-Digest: CrO8grO5/YSZICyv49SUqfZvuiSNAekLkOkyyISZR8w=
    2268,2269c1042,1044
    < Name: res/py.9.png
    < SHA-256-Digest: oVFx6tSxzZuAxYuTwO+0U7DPiJtxTMhZ7iybk39LN9A=
    ---
    > Name: res/interpolator/btn_radio_to_off_mtrl_animation_interpolator_0.
    >  xml
    > SHA-256-Digest: qNc0HCDQfJ/atgLnw5GHyau5yvX7+bKDLNbZ8YoshsI=
    2271,2272c1046,1048
    < Name: res/q6.xml
    < SHA-256-Digest: mkvSeapSZhn5BH708BKXgI5Yrw/45mEXu8Q56HvsE+A=
    ---
    > Name: res/interpolator/btn_radio_to_on_mtrl_animation_interpolator_0.x
    >  ml
    > SHA-256-Digest: qNc0HCDQfJ/atgLnw5GHyau5yvX7+bKDLNbZ8YoshsI=
    2274,2275c1050,1051
    < Name: res/qA.xml
    < SHA-256-Digest: C1EBP8D16RanJ7dVEsHukgYXi9E0UJt7S+ajl/pNmms=
    ---
    > Name: res/interpolator/fast_out_slow_in.xml
    > SHA-256-Digest: gjfUe6/DurkJi9k0SxLcbIf92Hmk4fAchWQAxZXymPA=
    2277,2278c1053,1054
    < Name: res/qD.9.png
    < SHA-256-Digest: H5U4dFz9MgnMCe1FHBmDAqrDocXaQehzlDd4FLG8xe4=
    ---
    > Name: res/layout-v19/fingerprint_dialog_layout.xml
    > SHA-256-Digest: bS3x+eb6WV4lJAIO00QwaFzqi9g/2ymH89+aa2HRtyY=
    2280,2281c1056,1057
    < Name: res/qp.png
    < SHA-256-Digest: YVFFDs46uWZyE8OYe22P/6Jbr5/0PVO82clP2Op2FtA=
    ---
    > Name: res/layout-v21/notification_action.xml
    > SHA-256-Digest: 2MyprM0mfCAQmauwdC2DsxzISWGw8NOMEsrNdfJPcWA=
    2283,2284c1059,1060
    < Name: res/qx.xml
    < SHA-256-Digest: c48go/g9WpD1pqSekWZX5ltbuFfXJgv+SppdDz5idYE=
    ---
    > Name: res/layout-v21/notification_action_tombstone.xml
    > SHA-256-Digest: cFToMxbGuQcqt9sefCAEPJrxZ9pI6GoBTlcA8qJ/i1c=
    2286,2287c1062,1063
    < Name: res/qz.xml
    < SHA-256-Digest: k1Nb/mGQ84B0vsYZa3E05x4BRvwQFEZ9LgmJyfp0xns=
    ---
    > Name: res/layout-v21/notification_template_custom_big.xml
    > SHA-256-Digest: 2DfUiSwqXrT1QJybwDaSZ6otVHGAbct6w2b6PwpL+KY=
    2289,2290c1065,1066
    < Name: res/r2.jpg
    < SHA-256-Digest: m4PCXi+ErcRYS8Djog8LJXhIkFWQYfwuZ0/Vn2tbmhw=
    ---
    > Name: res/layout-v21/notification_template_icon_group.xml
    > SHA-256-Digest: XPot/vVo4d1fVdG2cJp5Z4mpm2ctLSr12jJVF1H3JuE=
    2292,2293c1068,1069
    < Name: res/rW.xml
    < SHA-256-Digest: aaEq66ms343S6SXE/KmoZEmEebgFBPOmpnBMs/S/abI=
    ---
    > Name: res/layout-v26/abc_screen_toolbar.xml
    > SHA-256-Digest: +AEQs//V8Lx9zXdpKxbnpJWrHi4cXVJDn2RFoPaoRS0=
    2295,2296c1071,1072
    < Name: res/rY.xml
    < SHA-256-Digest: 2yKU5A78aslFaRX9E91p9gYetjZ7LpCT7U+jl8jFcKY=
    ---
    > Name: res/layout-watch-v20/abc_alert_dialog_button_bar_material.xml
    > SHA-256-Digest: 44Xr8ObC7zUiSjkcF0YEw7YaIPkukAUBEy9lC761QLo=
    2298,2299c1074,1075
    < Name: res/rb.xml
    < SHA-256-Digest: wWxqCay7Vz0wxbs0+QKdcXCKscb54F1TvI6GOMct5Mc=
    ---
    > Name: res/layout-watch-v20/abc_alert_dialog_title_material.xml
    > SHA-256-Digest: 7VhVAzt7ukhGmkjq7LoE2wxQhUqDJACC2qeT0yxhm0w=
    2301,2302c1077,1078
    < Name: res/rj.9.png
    < SHA-256-Digest: AKGsdNgWTLXEdJoLLnfixtpKkKvoc9hgTymEHBk1fGY=
    ---
    > Name: res/layout/abc_action_bar_title_item.xml
    > SHA-256-Digest: 5GS7GI2xyp+UXbiikMf0Dkp/8XAs/ax7tW3PMBCSreI=
    2304,2305c1080,1081
    < Name: res/rx.xml
    < SHA-256-Digest: abXt7wPIzBe5mj0qsZ5Joe5pUSq+43n3Xg5frqWnyZc=
    ---
    > Name: res/layout/abc_action_bar_up_container.xml
    > SHA-256-Digest: QSKxhRkoE+/JER018lCj7SXVLQvMq4LTpyCgxRUtXqs=
    2307,2308c1083,1084
    < Name: res/rz.xml
    < SHA-256-Digest: 1gsnMonTWPKz7qE/oJexzyGY6zdRf33JwxLtPitGUlY=
    ---
    > Name: res/layout/abc_action_menu_item_layout.xml
    > SHA-256-Digest: bPhP0avzyZC8Wsyc1KBrPRVZuFbseoCEFAyljI4h3Io=
    2310,2311c1086,1087
    < Name: res/s0.png
    < SHA-256-Digest: Y/rQoZy55BZYYEnUC2IWGwzEwlE9g5MdOFLi9acubRM=
    ---
    > Name: res/layout/abc_action_menu_layout.xml
    > SHA-256-Digest: toNItpMg+CYNOsHKsxjE3vUR201RwSNh+iHL705NJKQ=
    2313,2314c1089,1090
    < Name: res/s3.9.png
    < SHA-256-Digest: jGhG9BBe8cAhB+hCFC6c5gsIgZKW6VELLQwSz0VgxeE=
    ---
    > Name: res/layout/abc_action_mode_bar.xml
    > SHA-256-Digest: vhi165prMLK3ryB/yoMQzYOoB4H+RWq32+zTEzUJEuw=
    2316,2317c1092,1093
    < Name: res/s4.png
    < SHA-256-Digest: DXc+YsdWQiMTJihGx4flj2fg7ofkXhrplCAC6BbEy54=
    ---
    > Name: res/layout/abc_action_mode_close_item_material.xml
    > SHA-256-Digest: lyikmEchv1JpjNsnEhRxRSqEtO1RbaFptsmWD3exO5g=
    2319,2320c1095,1096
    < Name: res/sA.9.png
    < SHA-256-Digest: DGMox7JCBXCn7DizvrO6yaKdiVrBq3I5MVq6cmZBhZM=
    ---
    > Name: res/layout/abc_activity_chooser_view.xml
    > SHA-256-Digest: KrVVwfcVcfp3H/f+5hnA/JQP29TXY8PxAlVIvCO4nDE=
    2322,2323c1098,1099
    < Name: res/sA.xml
    < SHA-256-Digest: ujnlu4ItmjQkw/pKeC3ATGps+zsXMo/JzIeZBj+zG7Y=
    ---
    > Name: res/layout/abc_activity_chooser_view_list_item.xml
    > SHA-256-Digest: TK3cLLwqccbADY2EaGnZzRi2yHkNadIR0NnoGZb3N3w=
    2325,2326c1101,1102
    < Name: res/sg.9.png
    < SHA-256-Digest: Z+cBR2knB42Jqwu7Of/xLWlwJZKnpCgjeiEWiiHsEDg=
    ---
    > Name: res/layout/abc_alert_dialog_button_bar_material.xml
    > SHA-256-Digest: y3AJjwVRh2QQ5taDuHMgVyqelpNWYEOvTMNMVfy1aCc=
    2328,2329c1104,1105
    < Name: res/sn.xml
    < SHA-256-Digest: gjfUe6/DurkJi9k0SxLcbIf92Hmk4fAchWQAxZXymPA=
    ---
    > Name: res/layout/abc_alert_dialog_material.xml
    > SHA-256-Digest: cSUAIKy+g9t5odEg2XNWRLk2QvKnGOTq6l15HFaxtgw=
    2331,2332c1107,1108
    < Name: res/t3.xml
    < SHA-256-Digest: ZXS+E/cLM7Is30KexJZtu5hanoEgZZ6qiKMhSe+CFxU=
    ---
    > Name: res/layout/abc_alert_dialog_title_material.xml
    > SHA-256-Digest: 5u/y//Ha4LK54xMq38VJb8b4UPC2ATgW0XwB4W2WXCI=
    2334,2335c1110,1111
    < Name: res/t8.xml
    < SHA-256-Digest: 4ppiUuY/T797ynunAlq3l3URtazPU8OA++hNnHA540A=
    ---
    > Name: res/layout/abc_cascading_menu_item_layout.xml
    > SHA-256-Digest: FOwXLylmL1P+eTRUXIu4cFzl9HUkBMFs7cZLXA/GYrI=
    2337,2338c1113,1114
    < Name: res/tG.png
    < SHA-256-Digest: UqA1jlRDk3PKOfmc2Dzzp75zwlfwf66D7dg8m0iRiV0=
    ---
    > Name: res/layout/abc_dialog_title_material.xml
    > SHA-256-Digest: 6/Jv/eLxwCZR5c/siifphoGX5XS+FZBMDbAdPkGQVCE=
    2340,2341c1116,1117
    < Name: res/tL.xml
    < SHA-256-Digest: L+q5rIqla27f2yC+bnx51gBrPu5PiIfqpUWMykuAPDI=
    ---
    > Name: res/layout/abc_expanded_menu_layout.xml
    > SHA-256-Digest: 9f8yLMbOIT6aW0DmLSehVvxabDmxasPi64PywXVRXWM=
    2343,2344c1119,1123
    < Name: res/tS.png
    < SHA-256-Digest: yvHkc99nAsKmqV1zjx1vK3MZZ2a1BOX/Mzs8jnR+BHs=
    ---
    > Name: res/layout/abc_list_menu_item_checkbox.xml
    > SHA-256-Digest: 8mqlM/VeJ7RLZl6xg3kdnCDzLM1CG4Sh7CmY2sFb6gM=
    > 
    > Name: res/layout/abc_list_menu_item_icon.xml
    > SHA-256-Digest: 4QCVRaqTSJ+1keKpaMsWgEdyTdqKzSwt933dozlp2Rg=
    2346,2347c1125,1126
    < Name: res/tU.9.png
    < SHA-256-Digest: kbg1jiKsG4VUxxpShBSs8wCI2a1WK9rDgUhEdxwUyKk=
    ---
    > Name: res/layout/abc_list_menu_item_layout.xml
    > SHA-256-Digest: Lkf9m+NOSTqZb3XXuahD4+rXjgzN3quraK4PfPUIEi0=
    2349,2350c1128,1129
    < Name: res/tZ.9.png
    < SHA-256-Digest: ayNytBSrwc/P1xyY9RkBqExGxbcSBGquAZthEN4mUXU=
    ---
    > Name: res/layout/abc_list_menu_item_radio.xml
    > SHA-256-Digest: C/KPWBGFbXfTRqBO6jwrhsJqeYOHAP7pT009x8APKs4=
    2352,2353c1131,1132
    < Name: res/td.png
    < SHA-256-Digest: ZjVvVk8FGlaOJQcfYNoxLEGDCfkSl3Os6yJGdzRYaBw=
    ---
    > Name: res/layout/abc_popup_menu_header_item_layout.xml
    > SHA-256-Digest: 7e7WuTv/xu2C5vCTuKcJZk9PqM4chkigI1UM53jd5Bc=
    2355,2356c1134,1135
    < Name: res/te.png
    < SHA-256-Digest: SYsMvQm2tP7tisqe130jX1uycsU9IbMyZJoA6ULZido=
    ---
    > Name: res/layout/abc_popup_menu_item_layout.xml
    > SHA-256-Digest: WSwcNaSNpx20YEoJItNpZplAufxw6CLqxh0f/SC2TPU=
    2358,2359c1137,1138
    < Name: res/u0.xml
    < SHA-256-Digest: jRsGSjjYb82oFdQ60MBuQkb4jFyvf7VYoTroVBzaSow=
    ---
    > Name: res/layout/abc_screen_content_include.xml
    > SHA-256-Digest: 2yKU5A78aslFaRX9E91p9gYetjZ7LpCT7U+jl8jFcKY=
    2361,2362c1140,1141
    < Name: res/u3.png
    < SHA-256-Digest: Vbwndy9tNb6TNPuAw3GzJ9sl+qmmCYw8FASekmVKwb8=
    ---
    > Name: res/layout/abc_screen_simple.xml
    > SHA-256-Digest: U7wD/g6Rd1wiFxXBz3gEVQF/yD3jdZHgsB/7whNMegQ=
    2364,2365c1143,1144
    < Name: res/uJ.xml
    < SHA-256-Digest: 7e7WuTv/xu2C5vCTuKcJZk9PqM4chkigI1UM53jd5Bc=
    ---
    > Name: res/layout/abc_screen_simple_overlay_action_mode.xml
    > SHA-256-Digest: dw//htQeOfzmIu5ZJC61kAKFTQgak1mPnnwCNsbxnes=
    2367,2368c1146,1147
    < Name: res/uL.9.png
    < SHA-256-Digest: AG8twlusw55za8cg4mplRd90J7bBA7Ldd8Hrhyw/MwY=
    ---
    > Name: res/layout/abc_screen_toolbar.xml
    > SHA-256-Digest: HQWmPDmC2m8J2NxSaqjLUk2VZQPXQzEGE2+W0tb/IoE=
    2370,2371c1149,1150
    < Name: res/uj.9.png
    < SHA-256-Digest: yG2TSlgJ8yWZ5CFD4wbtbgZrIk/h+j8yreFgMHTlsTY=
    ---
    > Name: res/layout/abc_search_dropdown_item_icons_2line.xml
    > SHA-256-Digest: 5kIkul4D2+UIzvMckYmGgO1fJcxJl/IZS5ozftxaxnc=
    2373,2374c1152,1153
    < Name: res/ut.9.png
    < SHA-256-Digest: Viy6GtG5q9UC2pwD9MELsr1ygCLFRvGAWTGfKtKTKA4=
    ---
    > Name: res/layout/abc_search_view.xml
    > SHA-256-Digest: 552NQkC0PcWYFnGtBOrVcuOvP56P40zoxH21r7Vmb08=
    2376,2377c1155,1156
    < Name: res/uu.9.png
    < SHA-256-Digest: NjPsmdZqrkMy+aay29NIBRNDMAGo7sDnltK8tp11tz8=
    ---
    > Name: res/layout/abc_select_dialog_material.xml
    > SHA-256-Digest: 5eUeq8CsFvHa0TMfXHAPl3O/b2erClx0/9r76NwazfY=
    2379,2380c1158,1159
    < Name: res/ux.png
    < SHA-256-Digest: jQsswCmikLB8PSe/qhpdJIvSHQVKEzeQiPv6N5vLuPU=
    ---
    > Name: res/layout/abc_tooltip.xml
    > SHA-256-Digest: GGBZWzPQMbIU2gKkpxTAMsKGB+1bNOQbOvOD8MSY+RQ=
    2382,2383c1161,1162
    < Name: res/v4.9.png
    < SHA-256-Digest: p1I8zwN/fDHPh6GG/uy5E575LYfgcCyrsIoxkUsrUD4=
    ---
    > Name: res/layout/autofill_inline_suggestion.xml
    > SHA-256-Digest: tyd2gzHimEH1YVdW/wRSWJJ0xzA3VRfpTWze4tb/Qi8=
    2385,2386c1164,1165
    < Name: res/vG.xml
    < SHA-256-Digest: Lkf9m+NOSTqZb3XXuahD4+rXjgzN3quraK4PfPUIEi0=
    ---
    > Name: res/layout/custom_dialog.xml
    > SHA-256-Digest: tjEZR9ikuCug0p4W+MDp/YA+TLDgZJP71xfosXrmrhk=
    2388,2389c1167,1168
    < Name: res/vJ.xml
    < SHA-256-Digest: 8mqlM/VeJ7RLZl6xg3kdnCDzLM1CG4Sh7CmY2sFb6gM=
    ---
    > Name: res/layout/dev_loading_view.xml
    > SHA-256-Digest: rHlGVwclcquMOQr9XMLYmvvB1ab1JiDwEauUzZuH+h4=
    2391,2392c1170,1171
    < Name: res/vL.9.png
    < SHA-256-Digest: mcFNaFW4viltWAF9N1G43IScR7bR2Aq2FP+QdQgORhs=
    ---
    > Name: res/layout/fps_view.xml
    > SHA-256-Digest: saROq77T3Ozf4rj1I8YLUp68r4U9JfpmKICgcE3M4Hc=
    2394,2395c1173,1174
    < Name: res/vZ.xml
    < SHA-256-Digest: B6S17VpYE46vHbfnZAo8wUin0qV+gSEJckny3u7i3PY=
    ---
    > Name: res/layout/ime_base_split_test_activity.xml
    > SHA-256-Digest: N/8EBZH5Z4a/r509k3/t8vL5fiGMBr6z5/6KJEKhgag=
    2397,2398c1176,1177
    < Name: res/vb.png
    < SHA-256-Digest: OB7EirEdTSuePX46Kj/tO6/H1Ghs9qqQ7XKUWHZ+QAo=
    ---
    > Name: res/layout/ime_secondary_split_test_activity.xml
    > SHA-256-Digest: +hjq+DFd4AUKbaWtEgIarJlx2UV49P56Hlet6v61tWo=
    2400,2401c1179,1180
    < Name: res/vq.xml
    < SHA-256-Digest: 5eUeq8CsFvHa0TMfXHAPl3O/b2erClx0/9r76NwazfY=
    ---
    > Name: res/layout/notification_media_action.xml
    > SHA-256-Digest: //mBL2WXBwDPZ6qF4bcVX9doHpvwg4k08ekikuGS7TI=
    2403,2404c1182,1183
    < Name: res/vz.9.png
    < SHA-256-Digest: +lAWK9s1Aca1DPo2wU2rnJTkjVf1WGB+yYWBJNcEEvk=
    ---
    > Name: res/layout/notification_media_cancel_action.xml
    > SHA-256-Digest: VoGZf/G+konDrDvijGIk3kpXU86dWjIiWqPidE331j8=
    2406,2407c1185,1186
    < Name: res/w7.png
    < SHA-256-Digest: bTSouym+JuNDeBYDWIUG8zvRuTcyocG8n9hGeKo2sXg=
    ---
    > Name: res/layout/notification_template_big_media.xml
    > SHA-256-Digest: dx2Q2lQsa0j7UPSR0qpWd9TfcRtZQxySZDHQJa0oVeY=
    2409,2410c1188,1189
    < Name: res/wL.9.png
    < SHA-256-Digest: jD3lOJpP7fI7Hv3xx3N8p+tE84HCI2kVPfqXJhOkxEg=
    ---
    > Name: res/layout/notification_template_big_media_custom.xml
    > SHA-256-Digest: j0Vmq5gNpuu9C/Z+osysU/hiOv/H1Wis8OMV3MpIZd8=
    2412,2413c1191,1192
    < Name: res/wN.9.png
    < SHA-256-Digest: GLMo2AF+Z31arT29ZrrjVrXKyXjG8GcJOOpkjlHQ62Y=
    ---
    > Name: res/layout/notification_template_big_media_narrow.xml
    > SHA-256-Digest: PfR3Ri4gzAPJCWeD/DpYfo8hzsKi4WgNYNsEVB1o4ZI=
    2415,2416c1194,1195
    < Name: res/w_.png
    < SHA-256-Digest: BV1fh7G7tmdwlrx+t+rOV+QCFsuX8rK5JtJsEmP5q84=
    ---
    > Name: res/layout/notification_template_big_media_narrow_custom.xml
    > SHA-256-Digest: PAClMb30xSso5T5eNXmS0qnN+qWLd1XiWXUghh5kxVE=
    2418,2419c1197,1198
    < Name: res/wa.xml
    < SHA-256-Digest: nJCTqosfSBJaTwCO8wIyY8fLDJOh5cfm7w82SU1JgdQ=
    ---
    > Name: res/layout/notification_template_lines_media.xml
    > SHA-256-Digest: TtCRYnMZl0ojvBHnrdOt4AbPOfR/YmShgLXTjju+bZQ=
    2421,2422c1200,1201
    < Name: res/wb.png
    < SHA-256-Digest: /HDEgi93AMlCld04KbqLcbn7vLhV7Anvyu0oV2Sj6L0=
    ---
    > Name: res/layout/notification_template_media.xml
    > SHA-256-Digest: VqiA+AzbnHCnk8jj3VHekKLqyVaRRQg4WIgS2FV1dVk=
    2424,2425c1203,1204
    < Name: res/x3.9.png
    < SHA-256-Digest: k7dlcYRHPViBZpuA49Q/1k5ELR7XG+TO01GDgLbOxp0=
    ---
    > Name: res/layout/notification_template_media_custom.xml
    > SHA-256-Digest: w1SMEbs9YxwNhq8FtqfzMdTLSyaLOZdF69qWtzXscF0=
    2427,2428c1206,1207
    < Name: res/x7.png
    < SHA-256-Digest: ktnsqvSIsTG7KiH1N9R1e9bWGFcapDnlsqneRHSpa1w=
    ---
    > Name: res/layout/notification_template_part_chronometer.xml
    > SHA-256-Digest: 4h4V3Y4eltry4qB937iT1cBEpdDdWBT3QYRCM5EsAQc=
    2430,2431c1209,1210
    < Name: res/xH.png
    < SHA-256-Digest: fIRytyRBzCihrFOgi08MFPMQrzOBdbpsRv1jQqyM4v8=
    ---
    > Name: res/layout/notification_template_part_time.xml
    > SHA-256-Digest: +PUiJxjAgWy4ytEp3TBkSBpVmfC7sNHu0w7OnPcIvXI=
    2433,2434c1212,1213
    < Name: res/xN.xml
    < SHA-256-Digest: 2DfUiSwqXrT1QJybwDaSZ6otVHGAbct6w2b6PwpL+KY=
    ---
    > Name: res/layout/redbox_item_frame.xml
    > SHA-256-Digest: pzhAi6+qrS8t8lBfRhhmjTF8k/g7L3zMwploMNCManI=
    2436,2437c1215,1216
    < Name: res/xR.9.png
    < SHA-256-Digest: mpyUDqEz9+CsjbbwbhPoUlCGM8IfjHHyl0gxZaBtkus=
    ---
    > Name: res/layout/redbox_item_title.xml
    > SHA-256-Digest: ZXS+E/cLM7Is30KexJZtu5hanoEgZZ6qiKMhSe+CFxU=
    2439,2440c1218,1219
    < Name: res/xa.9.png
    < SHA-256-Digest: PgmvohxFNywDVZjAF8j7QFptZ45suE3IV1gcs7QOSC0=
    ---
    > Name: res/layout/redbox_view.xml
    > SHA-256-Digest: PUJ9XXzY3GrDUxQyEhfyVeFx/FUPdrLW4taW0qvDSlg=
    2442,2443c1221,1222
    < Name: res/xj.xml
    < SHA-256-Digest: spne+H65fX8dI3TDzCtdJWmZuBCqzkU531+XeUvppzM=
    ---
    > Name: res/layout/select_dialog_item_material.xml
    > SHA-256-Digest: r6pcuHL+V9m8uJ5Xdj/4tUDN49sws/4C8+xLyrSoNKY=
    2445,2446c1224,1225
    < Name: res/y-.xml
    < SHA-256-Digest: SGrXBa43/0Hfq8lS/l8ojlx7rR2N3M03qwnybTVUFaE=
    ---
    > Name: res/layout/select_dialog_multichoice_material.xml
    > SHA-256-Digest: Zmv3nWa+vgOnPMFH0B0XkbKpRk+1DzPV+lKLEtthVTs=
    2448,2449c1227,1228
    < Name: res/y4.xml
    < SHA-256-Digest: MGe5TuvorJ46RVmYIvmdgH1xL0JElOn8nN0oz7a9rmo=
    ---
    > Name: res/layout/select_dialog_singlechoice_material.xml
    > SHA-256-Digest: mFhPpXsQ/9IxqmS/3+SJWGHj5whopaVfYB5DFtlHaDI=
    2451,2452c1230,1231
    < Name: res/yH.9.png
    < SHA-256-Digest: WulZQkCtpeU1AOJSQhWz4rPJHm3ZWwXgrN0n2djFfnI=
    ---
    > Name: res/layout/support_simple_spinner_dropdown_item.xml
    > SHA-256-Digest: DPVfKH9OgQo52jNLkd5HbmdnX2YXOrKUDdCLxumDFFA=
    2454,2455c1233,1234
    < Name: res/yV.xml
    < SHA-256-Digest: toNItpMg+CYNOsHKsxjE3vUR201RwSNh+iHL705NJKQ=
    ---
    > Name: res/mipmap-anydpi-v26/ic_launcher.xml
    > SHA-256-Digest: ltcKG1zgZaqTP7FClxeov2uyM0TTQbxJMTmBRxrLEu0=
    2457,2458c1236,1237
    < Name: res/yY.9.png
    < SHA-256-Digest: 8jJxTMvsypetxjsIEdYmKQV8d9y9CwYsguJnVMt0SDE=
    ---
    > Name: res/mipmap-anydpi-v26/ic_launcher_round.xml
    > SHA-256-Digest: ltcKG1zgZaqTP7FClxeov2uyM0TTQbxJMTmBRxrLEu0=
    2460,2461c1239,1240
    < Name: res/yg.9.png
    < SHA-256-Digest: Ykd63HTU5oNuPA5LUzfDfXSMs/lAM/QsYpk47xjTi0E=
    ---
    > Name: res/mipmap-hdpi-v4/ic_launcher.png
    > SHA-256-Digest: L4CJxiURyZllJAnyRzJooCcix/Zejha+KKfy2pQVJWU=
    2463c1242
    < Name: res/yn.png
    ---
    > Name: res/mipmap-hdpi-v4/ic_launcher_foreground.png
    2466,2467c1245,1246
    < Name: res/z-.9.png
    < SHA-256-Digest: VZv3g9dlwCM46XlSvcnGaJx/+ZCQuMmBM2kRjaiwgPA=
    ---
    > Name: res/mipmap-hdpi-v4/ic_launcher_round.png
    > SHA-256-Digest: Jzj64eqnFDnz6qE7N+x7OEgYtOMQHWklQkKKuiwbs0A=
    2469,2470c1248,1249
    < Name: res/z9.9.png
    < SHA-256-Digest: d/DrqyQWQE6x1WI0LkMVQdiFaG3R5J1tyTvhqGwic8Q=
    ---
    > Name: res/mipmap-mdpi-v4/ic_launcher.png
    > SHA-256-Digest: bJzT3CpA0RXdiUX6Ayedt6P6JLxS3GVFXVhQqPENLzY=
    2472,2473c1251,1252
    < Name: res/zE.png
    < SHA-256-Digest: pUdDH+vxCMz6lYiribEHjjh7s1HrVNdyOUMyGH93C3Q=
    ---
    > Name: res/mipmap-mdpi-v4/ic_launcher_foreground.png
    > SHA-256-Digest: bJzT3CpA0RXdiUX6Ayedt6P6JLxS3GVFXVhQqPENLzY=
    2475,2476c1254,1255
    < Name: res/zL.png
    < SHA-256-Digest: YwYEi6X37KQ+e9re76lBIYBQhIb9VD4C3pPSoBPiI/A=
    ---
    > Name: res/mipmap-mdpi-v4/ic_launcher_round.png
    > SHA-256-Digest: kETaisXILuKdk7oZH6OE+b0JtJB6oKEIVAvQhv4oCDo=
    2478,2479c1257,1258
    < Name: res/zR.png
    < SHA-256-Digest: XduOU5UscRp0ZiZwYHQyetsg6qm6PCSXcNuETctSgus=
    ---
    > Name: res/mipmap-xhdpi-v4/ic_launcher.png
    > SHA-256-Digest: d30oRWa2y9OC4f9B7sEiQaVRx3l+DqTfmUqBxQRSJ+Q=
    2481,2482c1260,1261
    < Name: res/zV.9.png
    < SHA-256-Digest: D422BdY78dbTX9ZH1ZKsTnDJpxL/XRwhFMjVioi4Ioo=
    ---
    > Name: res/mipmap-xhdpi-v4/ic_launcher_foreground.png
    > SHA-256-Digest: d30oRWa2y9OC4f9B7sEiQaVRx3l+DqTfmUqBxQRSJ+Q=
    2484,2485c1263,1264
    < Name: res/zp.xml
    < SHA-256-Digest: 2MoWdzaleFa4uAAvFb0icmwaqJ6TPv7dvNyj8d+JS5A=
    ---
    > Name: res/mipmap-xhdpi-v4/ic_launcher_round.png
    > SHA-256-Digest: devDK7TF5YSiUw+s1e4D7Y8hsrzbN7TgLvUWFkppQB4=
    2487,2488c1266,1267
    < Name: res/zq.xml
    < SHA-256-Digest: vhi165prMLK3ryB/yoMQzYOoB4H+RWq32+zTEzUJEuw=
    ---
    > Name: res/mipmap-xxhdpi-v4/ic_launcher.png
    > SHA-256-Digest: lqrfJEdWcBCrcJm47CbpazwXI86vXXvjX/pWIhN7nMI=
    2490,2491c1269,1270
    < Name: res/zr.png
    < SHA-256-Digest: L4CJxiURyZllJAnyRzJooCcix/Zejha+KKfy2pQVJWU=
    ---
    > Name: res/mipmap-xxhdpi-v4/ic_launcher_foreground.png
    > SHA-256-Digest: lqrfJEdWcBCrcJm47CbpazwXI86vXXvjX/pWIhN7nMI=
    2493,2494c1272,1294
    < Name: res/zz.png
    < SHA-256-Digest: hnY6MK8qk0x8E7Ejs2RD0dF5GLccYUm8bugBFbhyWT0=
    ---
    > Name: res/mipmap-xxhdpi-v4/ic_launcher_round.png
    > SHA-256-Digest: 5ds/l81+paMMn6xiEnwowMsKTBNePEy7hIgf083QVV4=
    > 
    > Name: res/mipmap-xxxhdpi-v4/ic_launcher.png
    > SHA-256-Digest: 1llIfwPDO6PMQN+kZATP4eMdi01u5XswppEzz8jdmos=
    > 
    > Name: res/mipmap-xxxhdpi-v4/ic_launcher_foreground.png
    > SHA-256-Digest: 1llIfwPDO6PMQN+kZATP4eMdi01u5XswppEzz8jdmos=
    > 
    > Name: res/mipmap-xxxhdpi-v4/ic_launcher_round.png
    > SHA-256-Digest: h/5aOfT+B/sWHUOvIjORpZct8eV3inAo+53cNXiK+4g=
    > 
    > Name: res/xml/file_provider_paths.xml
    > SHA-256-Digest: W1nfijzE+M8Vy8L0NjegNHjbO5gQww1P/SJtVJnxXME=
    > 
    > Name: res/xml/file_system_provider_paths.xml
    > SHA-256-Digest: mwN06HeBRrY9RBeXQ0sB7CNk1569jl1Cvb3vyTMzq5s=
    > 
    > Name: res/xml/rn_dev_preferences.xml
    > SHA-256-Digest: MQ8miCIiluSEMFlyja2JEcLKh/nAQfjnDiNRvfAjDB0=
    > 
    > Name: res/xml/splits0.xml
    > SHA-256-Digest: rFwXUD0B/Btu50c6i/7HJEhNV1kwZsQ9faIFK/zIhZs=
    2497c1297,1300
    < SHA-256-Digest: Ld5TKuTu00BCmpwBqczJJKUgguZjUNDr0o81dDzqQpA=
    ---
    > SHA-256-Digest: IZjwPZ9FLkPTvJ6KLg8MX0EHkSdaecjMGOyTAWm8LdU=
    > 
    > Name: stamp-cert-sha256
    > SHA-256-Digest: HZwqAqk4Fv9ceuZPmq0Cwj3kncUUYg2xp61iTSqDZ5w=
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 0c.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 0K.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 0M.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 0x.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 0Z.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 1e.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 1I.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 1J.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 27.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 2d.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 2f.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 2j.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 2K.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 2P.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 33.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 3A.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 3J.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 3u.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 42.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 46.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 49.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 4B.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 4k.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 4u.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 4_.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 4z.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 5c.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 5D.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 5P.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 5T.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 5U.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 5v.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 5z.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 62.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 65.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 6d.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 6_.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 6P.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 6Q.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 6t.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 71.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 7_.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 7C.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 7G.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 7H.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 7I.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 7i.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 7m.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 7N.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 7o.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 7V.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 7Y.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 80.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 8c.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 8h.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 8h.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 8t.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: -8.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 95.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 9a.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 9m.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 9n.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 9N.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 9P.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 9T1.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 9T2.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 9T.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 9V.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 9w.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 9X.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 9z.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: 9z.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: a0.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: A1.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: A2.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: A4.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: A7.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Ac.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: AE.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Ag.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: aG.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: ak.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: aM.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: anim
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: animator
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: anim-v21
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: aP.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: ar.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: aR.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: as.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: aU.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: aU.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: aW.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: bb.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Bd.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Be.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: BG.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: bi.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Bi.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: BJ1.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: BJ.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: BL.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: bL.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: BM.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: -B.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: BT.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: bt.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: BW.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: bX.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: c5.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: c6.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: C_.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Cg.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: CK.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Ck.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: cL.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: cm.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: CO.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Cp.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: cr.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: cV.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: d3.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: d5.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: D5.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: D_.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: df.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: DL.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: dO.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: drawable
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: drawable-anydpi-v23
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: drawable-anydpi-v24
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: drawable-hdpi-v4
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: drawable-mdpi-v4
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: drawable-v21
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: drawable-v23
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: drawable-v29
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: drawable-watch-v20
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: DV.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: dW.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: D-.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: dY.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: DZ.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: E5.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: EA.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: eA.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Ec.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Eg.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: ej.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Em.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: EP.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: eR.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: eT.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: ev.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: EZ.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: F8.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Ff.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: fM.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: fO.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: FS.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: FT.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Fu.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: FW.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: fY.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: G2.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: G2.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: G8.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Gc.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: GC.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: GD.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: gE.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: gf.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Gf.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: GF.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: gj.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: gK.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: GK.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: g-.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: gr.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: gR.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: GR.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: gt.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Gt.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Gt.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: g-.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: _G.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: GY.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: gZ.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: h4.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: h6.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: h7.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: ha.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Hd.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: hh.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: hP1.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: H-.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: hP.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: hq.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: hs.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: _H.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: hZ.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: i6.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: interpolator
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: In.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: io.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: iO.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: iQ.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: iR.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: IX.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: j3.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: j4.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: je.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: JJ.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Jl.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: jS1.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: jS.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: JS.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: jW.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: k1.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: K5.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: k8.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: K_.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Ke.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: KH.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: kJ.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: kj.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: KM.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: kn.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: kp.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: kS.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: -k.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: k_.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: layout
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: layout-v19
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: layout-v21
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: layout-v26
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: layout-watch-v20
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Lf.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Lf.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Li.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: lN.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: LO.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: lP.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: lR.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: ls.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: L_.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: ly.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: m0.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: M7.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Ma.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: MD.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: MF.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: mipmap-anydpi-v26
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: mipmap-hdpi-v4
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: mipmap-mdpi-v4
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: mipmap-xhdpi-v4
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: mipmap-xxhdpi-v4
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: mipmap-xxxhdpi-v4
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: mm.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: MO.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Mp.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: MQ.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: NA.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: nf.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: NF.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: NG.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: nI.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: NJ.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Nk.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: NM.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: No.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: -N.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: nP.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: nT.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Nu.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: NZ.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: nz.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: o9.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: o_.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: OI.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Ol.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: OM.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: op.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: o-.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: o_.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: oP.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: OX1.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: _o.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: OX.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: p8.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Pa.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Pb.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Pg.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: pk.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: PL.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: ps.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: pT.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: pu.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: pU.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: -P.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: py.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: pY.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: q6.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: qA.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: qD.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Qd.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: QJ.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: _q.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Q-.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: qp.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Qt.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: qx.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: QZ.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: qz.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: QZ.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: r2.jpg
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: rb.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: RD.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: RH.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: rj.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: RJ.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: RV.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: rW.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: rx.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: rY.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: rz.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: s0.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: s3.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: s4.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: S8.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: sA.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: sA.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Sa.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Sc.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: sg.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Sh.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: sn.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: SN.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Sq.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Su.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: SV.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: t3.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: t8.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: td.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: te.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: tG.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Th.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Tj.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: tL.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Tl.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Tn.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Tr.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: tS.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: tU.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: tZ.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: u0.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: u3.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: U7.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: U8.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: U-.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: UE.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: uj.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: uJ.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: uL.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: _U.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: UR.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: ut.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: uu.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: ux.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: UX.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: V1.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: v4.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: V7.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: vb.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: vG.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: vJ.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: vL.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: VM.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: VN.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: vq.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: VT.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: VW.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: vz.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: vZ.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: W4.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: W5.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: w7.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: wa.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: wb.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Wg.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Wh.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: wL.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: wN.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: w_.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Wr.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Ws.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Wz.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: x3.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: X3.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: X4.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: x7.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: xa.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: xH.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: xj.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: XK.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/res: xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: xN.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: xR.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: XW.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Xx.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: XY.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Y3.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: y4.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Y7.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Y9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: YD.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: yg.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: YG.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: yH.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: yn.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Yt.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: yV.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Yw.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: YW.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: _y.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: y-.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: _Y.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: yY.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Z8.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: z9.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: z-.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: zE.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Zg.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: zL.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: ZL.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: ZN.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: ZN.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: zp.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: ZP.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: zq.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: zr.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: zR.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: zV.9.png
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: Z-.xml
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/res: zz.png
    Binary files /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-built/resources.arsc and /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official/resources.arsc differ
    Only in /var/shared/apk/com.shapeshift.droid_shapeshift/328/unzipped-official: stamp-cert-sha256
    
    ```

</details>


{% include asciicast %}

After a successful build, we document the steps we've undertaken and publish an interim merge request. During the initial stages of our analysis, we try to reach out to the developers and inform them of our methodology and the resulting diffs. Differences in build variables, environment or some other cause, may result in a huge diff. For this reason, we filed a GitHub [issue](https://github.com/shapeshift/mobile-app/issues/104) in their repository. If developer outreach is successful, we can collaborate with the goal in making the build reproducible. 

In the interim, our provisional verdict is **non-verifiable**. 

## Update 2024-07-15

An [announcement](https://shapeshift.com/newsroom/shapeshift-releases-new-and-improved-mobile-app-and-migrates-legacy-users) was made on October 19, 2022 regarding ShapeShift's app:

> “In addition to the numerous improvements and new features, the new mobile app is fully open-source and the only backend is blockchain data一which we are actively working to decentralize with FOXChain. ShapeShift DAO is dedicated to building the best interface to the decentralized universe, and with new wallets, chains, and protocols being added each week, the vision is coming together. However, for this vision to fully come to fruition, the interface can’t just exist on the web; it must be available on mobile too.” - Willy Ogorzaly

- We confirmed the app has a Bitcoin wallet that can send/receive.
- It provided the 12-word seed phrases
- We confirmed the existence of its [GitHub repository](https://github.com/shapeshift/mobile-app) for the mobile app.
- This app is due **for verification**.

## Review 2021-05-23

ShapeShift is best known for their non-custodial exchange but this app appears
to be a wallet:

> **STORE YOUR CRYPTO IN A SECURE WALLET**<br>
  Setup a ShapeShift multi-chain wallet in seconds to store your crypto.

... and non-custodial:

> ShapeShift makes self-custody easy, never holding your coins, so you have
  complete control over your assets.

but is their code public? 

On the [referenced website](https://shapeshift.com/) there is no link back to
the app on App Store or Play Store but there is
[this site](https://shapeshift.com/invite) where they suggest having an
invite-only mobile app. When you provide them with your email (Seriously?) they ...
forward you to [this site](https://shapeshift.com/download) where there are
actually download links for both mobile apps.

As we couldn't find any source code we assume the app is closed source and
therefore **not verifiable**.
