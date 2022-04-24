---
layout: archive
title: "Test Script Explained"
permalink: /testScript/
author_profile: true
---

In most reproducible products we mention a "test script". That "test script"
can be found
[here](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/test.sh).
This page tries to break down what it does in more layman terms.

As reproducing a build involves usually many steps, we automated that. In the
case of Android, the test script does the following when we call it as such:

 ```
 ./test.sh --apk /home/user/Downloads/org.electrum.electrum_34020100_f7da55a86aca86080884c1864f8db383d29116d9409ed7f37179785514f1ecf0.apk
 ```

1. It determines the `sha256sum` of the file
1. It uses the command `apktool` to unpack the file
1. It reads the application's ID
1. It reads version name and version code
1. It loads the [application specific test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/tree/master/scripts/test/android). That "test script" defines:
   * Where to find the source code
   * How the team tags releases in relation to version name and version code. For example most teams tag their code `v1.2.3` but in the app the version is just `1.2.3`
   * Where to find the compilation result if compilation succeeds
   * The function `test` - Instructions on how to build the app
1. It runs `prepare` which
   * Cleans the system from prior runs
   * Gets the required revision of the source code
   * Notes the revision's hash, which is a cryptographic hash of the repository's state and useful for later analysis
1. It runs `test` as defined above
1. It runs `result`, which
   * Unzips the original app and the just compiled app
   * Compares both resulting folders
   * Prints out the collected data

So "the test script" is actually many test scripts that also change over time -
whenever the provider changes how the app is being built, we have to adjust our
script, too. But in theory it allows us to "just run the script" and wait for
the result instead of having to remember all the steps for all the apps, to then
manually run them every time a new release emerges.
