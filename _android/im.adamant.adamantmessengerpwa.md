---
wsId: adamanyMessenger
title: ADAMANT Messenger
altTitle: 
authors:
- danny
users: 10000
appId: im.adamant.adamantmessengerpwa
appCountry: 
released: 2020-06-13
updated: 2024-09-05
version: 4.8.1
stars: 4.2
ratings: 
reviews: 15
size: 
website: https://adamant.im
repository: https://github.com/Adamant-im/adamant-im
issue: 
icon: im.adamant.adamantmessengerpwa.png
bugbounty: 
meta: ok
verdict: reproducible
date: 2024-09-13
signer: 
reviewArchive: 
twitter: adamant_im
social:
- https://vk.com/adamant_im
- https://t.me/adamant_eng
- https://www.youtube.com/c/ADAMANTMessenger
redirect_from: 
developerName: ADAMANT Foundation
features: 

---

## Build Attempt 2024-09-13

### Build Instructions for Android App:

Although the instructions are extensive, there is a lot of information missing from the build instructions that could help third-party builders be more efficient in building. These are the generic [instructions](https://github.com/Adamant-im/adamant-im/tree/master):

> **Clone the repository:**
>
> `git clone --recursive https://github.com/Adamant-im/adamant-im.git`
>
> **Install dependencies:**
>
> `npm install`
>
> **Prepare environment variables:**
>
> `cp capacitor.env.example capacitor.env`
>
> *Replace necessary ENV values before build.*
>
> **Build the Android app as an AAB:**
>
> `npm run android:build`

We spent the better part of the day grappling with errors following these instructions to the dot, but we will summarize for the convenience of the reader. 

### We first start by generating a dummy keystore

   ```
   keytool -genkey -v -keystore android/app/dummy.keystore -alias dummy -keyalg RSA -keysize 2048 -validity 10000 -storepass dummy123 -keypass dummy123 -dname "CN=Dummy,OU=Dummy,O=Dummy,L=Dummy,S=Dummy,C=US"
   ```

### There is a need to modify three files: 
  
  - **android/app/build.gradle**

    ```
    defaultConfig {
        applicationId "im.adamant.adamantmessengerpwa"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 481
        versionName "4.8.1"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        aaptOptions {
             // Files and dirs to omit from the packaged assets dir, modified to accommodate modern web apps.
             // Default: https://android.googlesource.com/platform/frameworks/base/+/282e181b58cf72b6ca770dc7ca5f91f135444502/tools/aapt/AaptAssets.cpp#61
            ignoreAssetsPattern '!.svn:!.git:!.ds_store:!*.scc:.*:!CVS:!thumbs.db:!picasa.ini:!*~'
        }
    }

    signingConfigs {
        release {
            storeFile file("dummy.keystore")
            storePassword "dummy123"
            keyAlias "dummy"
            keyPassword "dummy123"
        }
    }

    buildTypes {
        release {
	    signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }

    ```
  - **capacitor.env** at the root of the cloned adamant-im folder

    ```
    ANDROID_KEYSTORE_PATH="app/dummy.keystore"
    ANDROID_KEYSTORE_PASSWORD="dummy123"
    ANDROID_KEYSTORE_ALIAS="dummy"
    ANDROID_KEYSTORE_ALIAS_PASSWORD="dummy123"
    ANDROID_RELEASE_TYPE="AAB"

    ```
  - **scripts/capacitor/build-android.mjs**

    ```
    import dotenv from 'dotenv'
    import { $ } from 'execa'
    import path from 'path'
    import fs from 'fs'

    // Load environment variables from capacitor.env
    const envConfig = dotenv.parse(fs.readFileSync('capacitor.env'))
    for (const k in envConfig) {
    process.env[k] = envConfig[k]
    }

    void run()

    async function run() {
    const $$ = $({ shell: true, stdout: 'inherit' })
    
    console.log('Environment variables:')
    console.log('ANDROID_KEYSTORE_PATH:', process.env.ANDROID_KEYSTORE_PATH)
    console.log('ANDROID_KEYSTORE_PASSWORD:', process.env.ANDROID_KEYSTORE_PASSWORD)
    console.log('ANDROID_KEYSTORE_ALIAS:', process.env.ANDROID_KEYSTORE_ALIAS)
    console.log('ANDROID_KEYSTORE_ALIAS_PASSWORD:', process.env.ANDROID_KEYSTORE_ALIAS_PASSWORD)
    console.log('ANDROID_RELEASE_TYPE:', process.env.ANDROID_RELEASE_TYPE)

    await $$`npm run build` // build PWA
    await $$`cap sync` // copy web assets to ./android
    
    const keystorePath = path.resolve(process.cwd(), 'android', process.env.ANDROID_KEYSTORE_PATH)
    
    const buildArgs = [
        `--keystorepath="${keystorePath}"`,
        `--keystorepass="${process.env.ANDROID_KEYSTORE_PASSWORD}"`,
        `--keystorealias="${process.env.ANDROID_KEYSTORE_ALIAS}"`,
        `--keystorealiaspass="${process.env.ANDROID_KEYSTORE_ALIAS_PASSWORD}"`,
        `--androidreleasetype="${process.env.ANDROID_RELEASE_TYPE}"`,
        '--signing-type jarsigner'
    ]
    
    console.log('Build arguments:', buildArgs)
    
    await $$`cap build android ${buildArgs}`
    }
    ```

### Build output after these modifications: 

    `npm run android:build`

    ```
    ✔ Copying web assets from dist to android/app/src/main/assets/public in 43.57ms
    ✔ Creating capacitor.config.json in android/app/src/main/assets in 1.28ms
    ✔ copy android in 118.22ms
    ✔ Updating Android plugins in 19.33ms
    ✔ update android in 114.17ms
    ✔ copy web in 38.59ms
    ✔ update web in 36.08ms
    [info] Sync finished in 0.506s
    Build arguments: [
    '--keystorepath="/home/danny/work/builds/im.adamant.adamantmessengerpwa/4.8.1/2/adamant-im/android/app/dummy.keystore"',
    '--keystorepass="dummy123"',
    '--keystorealias="dummy"',
    '--keystorealiaspass="dummy123"',
    '--androidreleasetype="AAB"',
    '--signing-type jarsigner'
    ]
    ✔ Running Gradle build in 1.56s
    ✔ Signing Release in 1.69s
    [success] Successfully generated app-release-signed.aab at:
    /home/danny/work/builds/im.adamant.adamantmessengerpwa/4.8.1/2/adamant-im/android/app/build/outputs/bundle/release
    ```

Now we need to generate 3 split apks to match those we pulled from our phone from the AAB we generated.

    - base.apk 
    - split_config.en.apk  
    - split_config.xhdpi.apk

## Extracting the split APKs from the AAB

### Copy the device-spec.json file from our device

    `$ cp ~/work/device-spec/a11/device-spec.json .`

### Download bundletool

    `wget https://github.com/google/bundletool/releases/download/1.15.6/bundletool-all-1.15.6.jar`

### Use bundletool to generate APKs

    ```
    java -jar bundletool-all-1.15.6.jar build-apks --bundle=/home/danny/work/builds/im.adamant.adamantmessengerpwa/4.8.1/2/adamant-im/android/app/build/outputs/bundle/release/app-release-signed.aab --output=device-specific.apks --device-spec=device-spec.json
    ```

### Extract the APKs

    ```
    unzip device-specific.apks -d device_specific_apks
    ```

### We then copy the split apks from our phone to the build server and place them in the *fromOfficial/* folder

### We normalize the apk names both for build and official

### We unzip the normalized apks to their respective folders

### We run a diff on the corresponding folders:

    ```
    danny@lw10:~/work/compare/im.adamant.adamantmessngerpwa/4.8.1$ diff -r from*/base
    Binary files fromBuild/base/AndroidManifest.xml and fromOfficial/base/AndroidManifest.xml differ
    Only in fromOfficial/base/META-INF: BNDLTOOL.RSA
    Only in fromOfficial/base/META-INF: BNDLTOOL.SF
    Only in fromOfficial/base/META-INF: MANIFEST.MF
    Binary files fromBuild/base/res/xml/splits0.xml and fromOfficial/base/res/xml/splits0.xml differ
    Binary files fromBuild/base/resources.arsc and fromOfficial/base/resources.arsc differ
    Only in fromOfficial/base: stamp-cert-sha256

    danny@lw10:~/work/compare/im.adamant.adamantmessngerpwa/4.8.1$ diff -r from*/en
    Binary files fromBuild/en/AndroidManifest.xml and fromOfficial/en/AndroidManifest.xml differ
    Only in fromOfficial/en: META-INF

    Binary files fromBuild/en/resources.arsc and fromOfficial/en/resources.arsc differ
    Only in fromOfficial/en: stamp-cert-sha256

    danny@lw10:~/work/compare/im.adamant.adamantmessngerpwa/4.8.1$ diff -r from*/xhdpi
    Binary files fromBuild/xhdpi/AndroidManifest.xml and fromOfficial/xhdpi/AndroidManifest.xml differ
    Only in fromOfficial/xhdpi: META-INF
    Binary files fromBuild/xhdpi/resources.arsc and fromOfficial/xhdpi/resources.arsc differ
    Only in fromOfficial/xhdpi: stamp-cert-sha256
    ```

## Analysis of the diffs

In contrast with {% include walletLink.html wallet='android/world.bitkey.app' verdict='true' %}, the diffs are almost identical. We can find signing related diffs in files such as: BNDLTOOL.RSA, BNDLTOOL.SF, MANIFEST.MF, stamp-cert-sha256 and META-INF. These are only present in the *fromOfficial* or the APKs we extracted from our phone. Similarly, we also find a difference in **resources.arsc**. 

### diffoscope --text resources.arsc.diff.txt fromBuild/base/resources.arsc fromOfficial/base/resources.arsc

    ```
    danny@lw10:~/work/compare/im.adamant.adamantmessngerpwa/4.8.1$ cat resources.arsc.diff.txt 
    --- fromOfficial/base/resources.arsc
    +++ fromBuild/base/resources.arsc
    │┄ Format-specific differences are supported for Android package resource table (ARSC) but no file-specific differences were detected; falling back to a binary diff. file(1) reports: Android package resource table (ARSC), 261 string(s), utf8
    @@ -3496,15 +3496,15 @@
    0000da70: 7461 696e 6572 0024 2457 6964 6765 742e  tainer.$$Widget.
    0000da80: 436f 6d70 6174 2e4e 6f74 6966 6963 6174  Compat.Notificat
    0000da90: 696f 6e41 6374 696f 6e54 6578 7400 2020  ionActionText.  
    0000daa0: 5769 6467 6574 2e53 7570 706f 7274 2e43  Widget.Support.C
    0000dab0: 6f6f 7264 696e 6174 6f72 4c61 796f 7574  oordinatorLayout
    0000dac0: 0006 0663 6f6e 6669 6700 0a0a 6669 6c65  ...config...file
    0000dad0: 5f70 6174 6873 0007 0773 706c 6974 7330  _paths...splits0
    -0000dae0: 0000 0000 0202 1000 7400 0000 0100 0100  ........t.......
    +0000dae0: 0000 0000 0202 1000 7400 0000 0100 0000  ........t.......
    0000daf0: 1900 0000 0000 0000 0000 0000 0000 0000  ................
    0000db00: 0000 0000 0000 0000 0000 0000 0000 0000  ................
    0000db10: 0000 0000 0000 0000 0000 0000 0000 0000  ................
    0000db20: 0000 0000 0000 0000 0000 0000 0000 0000  ................
    0000db30: 0000 0000 0000 0000 0000 0000 0000 0000  ................
    0000db40: 0000 0000 0000 0000 0000 0000 0000 0000  ................
    0000db50: 0000 0000 0000 0000 0102 5400 4802 0000  ..........T.H...
    ```

One such minor difference could be found at offset 0000dae0. Specifically the last `0100` (1 in decimal - official) and `0000` (0 in decimal - built). Which was also described in the **bitkey** review. The Bitkey team noted in resources.arsc:

> Unfortunately Google Play has changed how they build resources.arsc. From our testing, it seems like they are using a previously reserved byte. When built using bundletool, that byte is always 0, thus making direct comparison using diff impossible.

This brings us to the last step in our process - using aapt2 to check for diffs.

    ```
    danny@lw10:~/work/compare/im.adamant.adamantmessngerpwa/4.8.1$ aapt2 diff fromBuild/base.apk fromOfficial/base.apk
    danny@lw10:~/work/compare/im.adamant.adamantmessngerpwa/4.8.1$ aapt2 diff fromBuild/en.apk fromOfficial/en.apk
    danny@lw10:~/work/compare/im.adamant.adamantmessngerpwa/4.8.1$ aapt2 diff fromBuild/xhdpi.apk fromOfficial/xhdpi.apk
    ```

No results indicate that are no differences.

For this reason, we determine the app to be **reproducible**

# Update 2024-07-20

We found the repository for Adamant IM Messenger with a [GitHub release version](https://github.com/Adamant-im/adamant-im/releases/tag/v4.7.3) that is close to the Google Play version. 

## App Description from [Google Play](https://play.google.com/store/apps/details?id=im.adamant.adamantmessengerpwa) 2023-04-15

> CRYPTO WALLET. Just a single password for all the internal cryptocurrencies: ADAMANT, Bitcoin, Ethereum, Doge, Dash, Binance coin, Bit-Z token, KuCoin token, Resfinex token, Stably Dollar. You have full control over private keys.

## Analysis 

The app has multiple features integrated in 1 app. It has messenger, wallet, a GPT powered chat and an exchange among other things. 

We took a look at its repository and found 21 of these component parts - however, the Android repository has notably been archived since 2021. 

This goes to say that while it may have been publicly available for a time, the Android app's **source code hasn't been for a long time**. What's noteworthy about this is that their Google Play app has recently been updated on March 2023.

