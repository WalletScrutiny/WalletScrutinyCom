---
wsId: coinspace
title: Coin Wallet - Bitcoin & Crypto
date: 2023-04-22
authors:
- leo
website: https://coin.space
twitter: coinappwallet
social:
- https://www.linkedin.com/company/coin-space
- https://www.facebook.com/coinappwallet
features:
- TOR
- buyWithCC
- foss
- tradeAlts
- fingerprint
redirect_from:
- /coin/
- /com.coinspace.app/
- /posts/2019/11/coin/
- /posts/com.coinspace.app/
- /android/com.coinspace.app/
- /iphone/com.coinspace.wallet/
android:
  appId: com.coinspace.app
  users: 500000
  appCountry: us
  released: 2015-05-01
  updated: 2026-06-29
  version: 6.29.0
  reviews: 110
  icon: com.coinspace.app.png
  meta: ok
  verdict: sourceavailable
  developerName: CoinSpace
  repository: https://github.com/CoinSpace/CoinSpace
  bugbounty: https://openbugbounty.org/bugbounty/CoinAppWallet/
iphone:
  appId: com.coinspace.wallet
  idd: 980719434
  appCountry: us
  released: 2015-12-14
  updated: 2026-06-04
  version: 6.28.0
  reviews: 492
  icon: com.coinspace.wallet.jpg
  meta: ok
  verdict: sourceavailable
  developerName: CoinSpace
  repository: https://github.com/CoinSpace/CoinSpace
  bugbounty: https://www.openbugbounty.org//bugbounty/CoinAppWallet/

---

## Android

**Update 2023-04-22**: Emanuel
[made progress with this product](https://github.com/CoinSpace/CoinSpace/issues/30#issuecomment-1518503256)
and succeeded to compile and almost reproduce version `v5.10.0`. He claims there
were only file names that differed and implied that contents did match except
for again those file names.

He used this container:

```
FROM docker.io/node:16-bullseye-slim

RUN set -ex; \
    apt-get update; \
    DEBIAN_FRONTEND=noninteractive apt-get install --yes -o APT::Install-Suggests=false --no-install-recommends \
        git \
        wget \
        unzip \
        openjdk-11-jdk-headless; \
    rm -rf /var/lib/apt/lists/*; \
    useradd -ms /bin/bash appuser;

USER appuser

ENV ANDROID_SDK_ROOT="/home/appuser/sdk" \
    ANDROID_HOME="/home/appuser/sdk" \
    JAVA_HOME="/usr/lib/jvm/java-11-openjdk-amd64/" \
    PATH="/home/appuser/gradle-6.9.4/bin:/home/appuser/sdk/build-tools/32.0.0/:$PATH" \
    NODE_ENV="development" \
    MOONPAY_API_KEY="pk_live_Tdc0BhIo7uIk8v9MOtWNxVJHr1WCEm" \
    SENTRY_DSN="https://039b564989724c47afb1ad407cccc7f6@o365484.ingest.sentry.io/5131667" \
    SENTRY_ORG="dummy_string_just_need_to_be_set_to_anything" \
    SENTRY_AUTH_TOKEN="dummy_string_just_need_to_be_set_to_anything" \
    CHANGELLY_REF="1c6e7ce0484f" \ 
    COMMIT="5af422a" \
    COMMIT_SHA="5af422a" \
    ORG_GRADLE_PROJECT_cdvVersionCode=3154 \
    GITHUB_RUN_NUMBER=624 \
    ZENDESK_APP_ID="4acba684eddd4f67b514c05ce516d2b9d34fa284cecaed49" \
    ZENDESK_URL="https://coinapp.zendesk.com" \
    ZENDESK_CLIENT_ID="mobile_sdk_client_f5b0609f735ecf230d0c"

RUN set -ex; \
    cd /home/appuser/; \
    git clone --single-branch --no-tags --depth 1 --branch v5.10.0 https://github.com/CoinSpace/CoinSpace/; \
    mkdir -p "/home/appuser/sdk/licenses" ; \
    printf "\n24333f8a63b6825ea9c5514f83c2829b004d1fee" > "/home/appuser/sdk/licenses/android-sdk-license"; \
    wget https://services.gradle.org/distributions/gradle-6.9.4-bin.zip; \
    unzip gradle-6.9.4-bin.zip -d /home/appuser/; \
    rm gradle-6.9.4-bin.zip; \
    wget https://dl.google.com/android/repository/commandlinetools-linux-9477386_latest.zip; \
    unzip commandlinetools-linux-9477386_latest.zip -d /home/appuser/sdk/; \
    rm commandlinetools-linux-9477386_latest.zip; \
    /home/appuser/sdk/cmdline-tools/bin/sdkmanager --sdk_root=/home/appuser/sdk/ --install "build-tools;32.0.0"; \
    cd /home/appuser/CoinSpace/; \
    npm config set @coinspace:registry https://npm.pkg.github.com; \
    npm config set "//npm.pkg.github.com/:_authToken" "ghp_github_token_only_read_packages_scope"; \
    npm ci; \
    cd /home/appuser/CoinSpace/phonegap; \
    npm ci; \
    cd /home/appuser/CoinSpace; \
    node ./cli/i18n.js --json; \
    cd /home/appuser/; \
    keytool -genkey -alias coinspace -keystore /home/appuser/CoinSpace/phonegap/release.keystore -storetype PKCS12 -keyalg RSA -keysize 4096 -storepass coinspace -keypass coinspace -validity 10000 -dname CN=IL; \
    cd /home/appuser/CoinSpace; \
    /home/appuser/CoinSpace/phonegap/node_modules/.bin/cordova telemetry off;

ENV NODE_ENV="production"

WORKDIR /home/appuser/CoinSpace
```

in which he ran `node ./cli/build.js phonegap --env=prod --release --platform=android-play`.


**Update**: The provider closed
[the issue about reproducibility](https://github.com/CoinSpace/CoinSpace/issues/30),
so we do not assume this app to be reproducible any time soon.

Coin Bitcoin Wallet at least implies to be non-custodial with this feature:

> Secure passphrase generation (your master private key), no one else can access
your Coin.Space wallet.

but other features do not sound that promising:

> Get started in seconds and access your wallet from any device: app or web.

They also claim

> Over 20 million Wallets users.

and are around since early 2015, so we are hopeful to find more solid
information on their website because in the Playstore description there is no
word about source code.

There we again see strong claims about this wallet not being custodial:

>  Coin does not hold your keys for you. We cannot access accounts, recover
keys, reset passphrase, nor reverse transactions. Protect your keys & always
check that you are on correct URL. You are responsible for your security.

But nowhere on the website is a link to a source code repository.

Searching GitHub for their applicationId `com.coinspace.app` we find two
repositories, with [one](https://github.com/CoinSpace/CoinSpace) looking
promising: One of the latest commits is tagged `v2.16.3` which is
exactly the version we see on Google Play.

Unfortunately there is nothing in terms of build instructions. Given there are
two open issues, [issue 14](https://github.com/CoinSpace/CoinSpace/issues/14)
and [issue 17](https://github.com/CoinSpace/CoinSpace/issues/17) asking about
how to make this work, not specifically asking about Android but seeing these
issues remaining unresolved in a year and almost two years
I will postpone this analysis and conclude
for now that this wallet is **not verifiable**.

**Update:** The developer [replied](https://github.com/CoinSpace/CoinSpace/issues/30)
to our request to resolve the issues we had but he closed the issue commenting:

> Perhaps, it didn't match because we don't publish here our private parameters
which we use for build. But you can be sure that our tags match App on Google
Play store.

which was not our issue.

We are tempted to just try stuff with the Docker file there but our mission
statement is that it should be easily reproducible which definitely includes not
having to guess and so we remain until further notice with our prior verdict:
**not verifiable**.

{% include featureEvidence.html feature="foss" quote="MIT License Copyright (c) 2024 Coin Wallet Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the &quot;Software&quot;), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software..." source="GitHub README" %}

{% include featureEvidence.html feature="tradeAlts" quote="Swap Arbitrum Avalanche Base Binance Smart Chain Bitcoin Bitcoin Cash Cardano Dash Dogecoin EOS Ethereum Ethereum Classic Kaspa Litecoin Monero Optimism Polygon Solana Sonic Stellar Sui Toncoin TRON XRP" source="Website" %}

{% include featureEvidence.html feature="buyWithCC" quote="Buy Arbitrum Avalanche Base Binance Smart Chain Bitcoin Bitcoin Cash Cardano Dash Dogecoin EOS Ethereum Ethereum Classic Kaspa Litecoin Optimism Polygon Solana Sonic Stellar Sui Toncoin TRON XRP" source="Website" %}

{% include featureEvidence.html feature="TOR" quote="Tor Wallet Launch now" source="Website" %}

An issue has been opened at [https://github.com/CoinSpace/CoinSpace/issues/30](https://github.com/CoinSpace/CoinSpace/issues/30)

---

## iPhone

{% include copyFromAndroid.html %}

{% include featureEvidence.html feature="tradeAlts" quote="Buy, sell, send & receive crypto using Coin Wallet." source="Store" comment="Swap functionality is also explicitly listed on the website under Swap section for multiple cryptocurrencies." %}

{% include featureEvidence.html feature="buyWithCC" quote="Buy, sell, send & receive crypto using Coin Wallet." source="Store" comment="Buy feature is listed prominently in both store description and website with dedicated Buy section." %}

{% include featureEvidence.html feature="foss" quote="LICENSE" source="GitHub README" comment="Repository links to a LICENSE file; however the license file returned 404. Cannot confirm OSI-approved license without seeing the actual license text. Omitting per rules." %}

{% include featureEvidence.html feature="fingerprint" quote="Hardware keys support" source="Website" comment="Ambiguous — could refer to hardware security keys, not fingerprint. Omitting per conservative rules." %}
