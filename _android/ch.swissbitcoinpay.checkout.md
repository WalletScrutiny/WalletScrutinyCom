---
wsId: swissBitcoinPay
title: Swiss Bitcoin Pay
altTitle: 
authors:
- danny
- keraliss
users: 1000
appId: ch.swissbitcoinpay.checkout
appCountry: 
released: 2022-11-15
updated: 2025-03-29
version: 2.5.0
stars: 4.7
ratings: 
reviews: 
website: https://swiss-bitcoin-pay.ch
repository: https://github.com/SwissBitcoinPay/app
issue: https://github.com/SwissBitcoinPay/app/issues/53
icon: ch.swissbitcoinpay.checkout.png
bugbounty: 
meta: ok
verdict: ftbfs
appHashes:
- 4c027a43cc9fddff3fe15d55ff32a083c761ecfb9c84a3326384cb863455282d
- 24f70d0f31812cf8012b933d2836e8c6b222e276595164a3d773926fe468c56c
- e9510b07234d4ff047684745e48250f02fb298117136ed6624ed2ef93d21dc65
date: 2025-02-06
signer: 17d9c0bf025008da16d5a146e1beaca6ddcfe3cb0cf063da23c847d3007eb621
reviewArchive:
- date: 2024-09-18
  version: 2.1.4
  appHashes:
  - 69a7e528ca403489349a482af6a35b94646b428dd27b09336793ad5817cdd9af
  gitRevision: 06269489f66cbd42872a1d7ff4f1049cb9442927
  verdict: nonverifiable
- date: 2024-08-23
  version: 2.1.1
  appHashes:
  - 62df7d225d6178688f451604552fb5d79525a257ac59e281f0c02f4c96e4d343
  gitRevision: 3703a5d0543f672252f7b37e5636a9e40c3b6e5e
  verdict: nonverifiable
- date: 2024-06-04
  version: 2.1.0
  appHashes: []
  gitRevision: 49d9b9282cfd495e90fb6d839423ce6ad7b5d721
  verdict: ftbfs
twitter: SwissBitcoinPay
social:
- https://www.linkedin.com/company/swiss-bitcoin-pay
- https://www.youtube.com/@swissbitcoinpay
redirect_from: 
developerName: Swiss Bitcoin Pay
features:
- ln

---

Steps to verify the reproducibility of the app: 

1. **Extract Split APKs**
  - Extract the split apks using the [apkextractor_sync.sh](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/apkextractor_sync.sh) script.
2. **Upload Split APKs to build server**
  - We then uploaded the split apks to `/var/shared/apk/ch.swissbitcoinpay.checkout/2.3.7` on our build server
3. **Device Specification**
  - The device-spec.json for our specific device already exists in the server
4. **Test Split APKs**
  - We proceed to run [testAAB.sh](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/testAAB.sh) for split apks.
    ```bash
    $ ./testAAB.sh -d /var/shared/apk/ch.swissbitcoinpay.checkout/2.3.7 -s /var/shared/device-spec/a11/device-spec.json
    ```

5. **Build Verification and Error Encounter**
  - After several errors and attempts we modified the app-specific script. We were able to reach the verification step where we try to build the dockerfile. The build fails with this error:

    ```
    FAILURE: Build failed with an exception.

    * Where:
    Build file '/app/android/app/build.gradle' line: 95

    * What went wrong:
    A problem occurred evaluating project ':app'.
    > Could not read script '/' as it is a directory.

    * Try:
    > Run with --stacktrace option to get the stack trace.
    > Run with --info or --debug option to get more log output.
    > Run with --scan to get full insights.
    > Get more help at https://help.gradle.org.

    BUILD FAILED in 1m 49s
    ```

6. **Investigate error**
  - We investigated line 95 of the [build.gradle](https://github.com/SwissBitcoinPay/app/blob/b25046e56ac36460d82dd8dba73882318a4aa666/android/app/build.gradle#L95) file in `/app/android/app/build.gradle`
    ```
    apply from: new File(["node", "--print", "require.resolve('@sentry/react-native/package.json')"].execute().text.trim(), "../sentry.gradle")
    ```

## Findings for building v2.3.7

The error indicates that Gradle is trying to load a script from the root directory ("/") because the dynamic resolution of the Sentry Gradle script’s path is failing.

The quoted line above from line 95 is supposed to locate the Sentry Gradle script relative to the location of @sentry/react-native/package.json. However, the node command is returning "/" (or something that normalizes to "/") instead of a valid path to the package. This usually happens because:

- The @sentry/react-native package isn’t installed in the expected location (or at all), so require.resolve('@sentry/react-native/package.json') fails to return the correct path.
- The working directory for the node command isn’t what’s expected, causing the resolution to fall back to "/" (the root).

Because the computed path ends up being "/" (a directory), Gradle complains that it “Could not read script '/' as it is a directory.”

# Conclusion

In summary: The problem is that the dynamic path resolution for Sentry’s Gradle script is failing (likely due to a missing package or an unexpected working directory), resulting in a path of "/" rather than a valid file path.

Further delving into a fix for this build with an existing Dockerfile for the build, would entail modifying files within the repository that would be equivalent to modifying the build context. This would defeat the purpose of verification and cause the build to be nonverifiable.

We attempted to manually build this as well which resulted in the same error.

For this reason we are giving this a verdict of **failed to build from source**.

{% include asciicast %}

We updated this issue in the existing SwissBitcoinPay's [issue tracker.](https://github.com/SwissBitcoinPay/app/issues/107)
