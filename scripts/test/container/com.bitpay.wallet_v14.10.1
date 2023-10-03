FROM node:16.19.1-slim

RUN set -ex; \
    mkdir -p /usr/share/man/man1/; \
    apt-get update; \
    DEBIAN_FRONTEND=noninteractive \
        apt-get install --yes -o APT::Install-Suggests=false \
        --no-install-recommends \
        openjdk-11-jdk \
        git \
        wget \
        ca-certificates; \
    rm -rf /var/lib/apt/lists/*; \
    useradd -ms /bin/bash appuser; \
    echo "session required pam_limits.so" >> /etc/pam.d/common-session; \
    echo "appuser soft  nofile 400000" >> /etc/security/limits.conf; \
    echo "appuser hard  nofile 600000" >> /etc/security/limits.conf

    RUN set -ex; \
        mkdir -p "/root/app/sdk/licenses" "/root/app/blockchain/" "/root/app/unzip"; \
        printf "\n24333f8a63b6825ea9c5514f83c2829b004d1fee" > "/root/app/sdk/licenses/android-sdk-license"; \
        printf '{\n"supportedAbis": ["arm64-v8a", "armeabi-v7a", "armeabi"],\n"supportedLocales": ["en-US"],\n"screenDensity": 560,\n"sdkVersion": 30\n}' > /root/app/devicespec1.json; \
        cd /root/app/sdk/; \
        wget https://github.com/google/bundletool/releases/download/1.7.1/bundletool-all-1.7.1.jar; \    
        echo "72d930df2b692347abcfa787d2dcfe4d08c19812ab7aedbc8db5546aa4fcb7a2  bundletool-all-1.7.1.jar" | sha256sum -c

USER appuser

ENV ANDROID_SDK_ROOT="/home/appuser/app/sdk" \
    ANDROID_HOME="/home/appuser/app/sdk" \
    NODE_ENV="development"

RUN set -ex; \
    mkdir -p "/home/appuser/app/sdk/licenses" "/home/appuser/app/bitpay/"; \
    printf "\n24333f8a63b6825ea9c5514f83c2829b004d1fee" > \
      "/home/appuser/app/sdk/licenses/android-sdk-license"; \
    cd /home/appuser/app/bitpay/; \
    git clone https://github.com/bitpay/bitpay-app/; \
    cd bitpay-app; \
    git checkout v.14.10.1;

WORKDIR /home/appuser/app/bitpay/bitpay-app

# json taken from https://github.com/blockchain/My-Wallet-V3-Android/blob/75ebe718cb99c6d302efb90447f1719973deb93f/scripts/quick_start.sh#L7-L46
RUN set -ex; \
    echo "{ \
  \"project_info\": { \
    \"project_number\": \"623252783566\", \
    \"firebase_url\": \"https://blockchaintest-ecd1c.firebaseio.com\", \
    \"project_id\": \"blockchaintest-ecd1c\", \
    \"storage_bucket\": \"blockchaintest-ecd1c.appspot.com\" \
  }, \
  \"client\": [ \
    { \
      \"client_info\": { \
        \"mobilesdk_app_id\": \"1:623252783566:android:02baff6e6c46ed96232b9f\", \
        \"android_client_info\": { \
          \"package_name\": \"com.bitpay.wallet\" \
        } \
      }, \
      \"oauth_client\": [ \
        { \
          \"client_id\": \"623252783566-o6j47jlpan97fnibnr0vosvc4lh71sm1.apps.googleusercontent.com\", \
          \"client_type\": 3 \
        } \
      ], \
      \"api_key\": [ \
        { \
          \"current_key\": \"INSERT KEY HERE\" \
        } \
      ], \
      \"services\": { \
        \"appinvite_service\": { \
          \"other_platform_oauth_client\": [ \
            { \
              \"client_id\": \"623252783566-o6j47jlpan97fnibnr0vosvc4lh71sm1.apps.googleusercontent.com\", \
              \"client_type\": 3 \
            } \
          ] \
        } \
      } \
    } \
  ], \
  \"configuration_version\": \"1\" \
}" > /home/appuser/app/bitpay/bitpay-app/google-services.json; \
    yarn install; \
    yarn run build:android:release