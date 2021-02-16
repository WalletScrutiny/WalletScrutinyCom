---
permalink: /whenReproductionFails/
title: "What to do when reproduction fails ..."
---

This is the log of a case where reproducing a build kind of failed ...

(by Leo Wandersleb)

So as the release manager at Mycelium it is my job to 

1. hit that compile button
1. share the binary with my colleagues
1. wait for one of them to confirm that the build could be reproduced
1. tag the version in git
1. push the branch and tags to our public GitHub
1. upload that build to Google Play for release

In more technical terms I run this, mostly automated:

```
sudo umount /tmp/sorted
sudo rm -rf /tmp/sorted/
mkdir /tmp/sorted
sudo rm -rf /tmp/android-wallet
cp -r /path/to/wallet_repo/ /tmp/android-wallet
sudo disorderfs --sort-dirents=yes --reverse-dirents=no \
  --multi-user=yes /tmp/android-wallet /tmp/sorted/
cd /tmp/sorted
ln -s /path/to/gradle.properties keys.properties
ln -s /path/to/keystore_mbwTest keystore_mbwTest
ln -s /path/to/keystore_mbwProd keystore_mbwProd
mv local.properties local.properties.bak
./gradlew clean test :mbw:assBtctRel :mbw:assProdRel \
  :mbw:assBtctDeb :mbw:assProdDeb -PenforceReleaseSigning
./collectApks.sh
```

Wait for build being reproduced ...

```
git tag v1.2.3
git push --tags
git push public branchName --tags
```

Upload the build to Google Play for release.

## Ooops

So on April 21st I did this with `v3.4.0.0`, a colleague approved the build and
we published it.

As a beta tester, I got the update to a phone from Google Play, I used [this
Filemanager](https://play.google.com/store/apps/details?id=com.alphainventor.filemanager)
to "backup" the apk file, loaded it on my computer and ran the
[test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/test.sh).

To my very surprise, the output was:

```
Results for 
appId:          com.mycelium.wallet
apkVersionName: 3.4.0.0
apkVersionCode: 3040000
apkHash:        35d7eeafa87ce88d527c9a41865eaa4cdcd158be8ea190c84133fbb02bfb6c46

Files /tmp/fromPlay_com.mycelium.wallet_3040000/apktool.yml and /tmp/fromBuild_com.mycelium.wallet_3040000/apktool.yml differ
Files /tmp/fromPlay_com.mycelium.wallet_3040000/original/META-INF/CERT.RSA and /tmp/fromBuild_com.mycelium.wallet_3040000/original/META-INF/CERT.RSA differ
Files /tmp/fromPlay_com.mycelium.wallet_3040000/original/META-INF/CERT.SF and /tmp/fromBuild_com.mycelium.wallet_3040000/original/META-INF/CERT.SF differ
Files /tmp/fromPlay_com.mycelium.wallet_3040000/original/META-INF/MANIFEST.MF and /tmp/fromBuild_com.mycelium.wallet_3040000/original/META-INF/MANIFEST.MF differ
Files /tmp/fromPlay_com.mycelium.wallet_3040000/smali_classes2/com/mycelium/wallet/activity/modern/NewsFragment.smali and /tmp/fromBuild_com.mycelium.wallet_3040000/smali_classes2/com/mycelium/wallet/activity/modern/NewsFragment.smali differ
```

with an unexpected diff in a `.smali` file.

What happened? Well, this was yesterday and it's a day later and I'm trying to
reconstruct yesterday's investigations.

I have two different versions of release_mbw_3.4.0.0.zip, which contains what I
upload to Google Play. One of those I sent to my colleagues, so I downloaded
that file to see which it was ...

```
$ sha256sum ~/release_mbw_3.4.0.0.zip ~/Downloads/release_mbw/comp_3.4.0.0_1587475882/*.zip ~/Downloads/release_mbw/comp_3.4.0.0_1587476814/*.zip
476a5114c328259edd03bed3bc75d5ce218c16c67f6df041e81a3771a784a5cc  /home/leo/release_mbw_3.4.0.0.zip
a51875492a0d0ec30d54c2545f7c1cb248c7a9b929d58d5f39697f577148db24  /home/leo/Downloads/release_mbw/comp_3.4.0.0_1587475882/release_mbw_3.4.0.0.zip
476a5114c328259edd03bed3bc75d5ce218c16c67f6df041e81a3771a784a5cc  /home/leo/Downloads/release_mbw/comp_3.4.0.0_1587476814/release_mbw_3.4.0.0.zip
```

so ... `/home/leo/Downloads/release_mbw/comp_3.4.0.0_1587476814/release_mbw_3.4.0.0.zip`
matches what I downloaded. That must be it. So I copied them all to `/tmp`:

```
$ ls -1 /tmp/*.apk
/tmp/3040000.apk
/tmp/mbw-prodnet-release.apk
'/tmp/Mycelium Wallet 3.4.0.0 (com.mycelium.wallet).apk'
```

These are in this order:

1. The file I downloaded from the Google Play developer console
1. The file I had uploaded to colleagues and Google Play developer console
1. The file I had tested before, obtained from my phone after it was updated by Google Play

Are they equal? They should be equal:

```
$ sha256sum /tmp/*.apk
e6781e241e1afb4cd61e1cb1d8fda4f59d532434db3ae347dbf387cf7c47cffa  /tmp/3040000.apk
e6781e241e1afb4cd61e1cb1d8fda4f59d532434db3ae347dbf387cf7c47cffa  /tmp/mbw-prodnet-release.apk
35d7eeafa87ce88d527c9a41865eaa4cdcd158be8ea190c84133fbb02bfb6c46  /tmp/Mycelium Wallet 3.4.0.0 (com.mycelium.wallet).apk
```

So did Google not serve the same file or did my Filemanager do something to it?
I suspect google does stuff to the files as they try to push developers towards
App Bundles which would serve up different apks to every user. Anyway, how
different are those files actually?

<div class="language-plaintext highlighter-rouge">
<div class="highlight">
<pre class="highlight">$ diffoscope /tmp/3040000.apk &quot;/tmp/Mycelium Wallet 3.4.0.0 (com.mycelium.wallet).apk&quot;
--- /tmp/3040000.apk
+++ /tmp/Mycelium Wallet 3.4.0.0 (com.mycelium.wallet).apk
├── zipinfo /dev/stdin
│ <font color="#06989A">@@ -1,8 +1,8 @@</font>
│ <font color="#CC0000">-Zip file size: 20041565 bytes, number of entries: 1863</font>
│ <font color="#4E9A06">+Zip file size: 20041749 bytes, number of entries: 1863</font>
│  -rw----     0.0 fat    36240 b- defN 80-000-00 00:00 AndroidManifest.xml
│  -rw----     2.4 fat     1283 b- defN 80-000-00 00:00 META-INF/CERT.RSA
│  -rw----     2.4 fat   218499 b- defN 80-000-00 00:00 META-INF/CERT.SF
│  -rw----     2.4 fat   218437 b- defN 80-000-00 00:00 META-INF/MANIFEST.MF
│  -rw----     2.4 fat        6 b- stor 80-000-00 00:00 META-INF/androidx.activity_activity.version
│  -rw----     2.4 fat        6 b- stor 80-000-00 00:00 META-INF/androidx.appcompat_appcompat-resources.version
│  -rw----     2.4 fat        6 b- stor 80-000-00 00:00 META-INF/androidx.appcompat_appcompat.version
</pre></div></div>

What does that mean? Equal files except for file size?

```
$ unzip /tmp/3040000.apk -d /tmp/A
$ unzip /tmp/Mycelium\ Wallet\ 3.4.0.0\ \(com.mycelium.wallet\).apk -d /tmp/B
$ diff --recursive /tmp/{A,B}
$
```

Yes, apparently that is what it means. An apk file is just a zip file. Unzipping
both and comparing the results yields no diff at all. The diff is only in the
compression.

So how do I build this for WalletScrutiny? Using the script
[test.sh](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/test.sh).

The main difference here is that it compiles in a Docker container.

As the compilation of projects often needs very specific build environments but
also because the build script could do whatever to the build system (my
computer), I prefer to isolate it to a Docker container.

I let the Docker container work on the project's folder which I create from
scratch from the git repository.

So once again I run that script:

```
$ ./test.sh /tmp/3040000.apk 
Extracting APK content ...
...
Testing "/tmp/3040000.apk" (com.mycelium.wallet version 3.4.0.0)

Testing com.mycelium.wallet from https://github.com/mycelium-com/wallet-android revision v3.4.0.0 ...
...
```

So while this is running I notice the Docker file is using "Ubuntu 18.04 LTS"
while my host system is running "Ubuntu 19.10". Upgrading the Dockerfile will
probably be the next thing to try.

Indeed the diff is there again:

![diff](/images/diff3040000.png)

Does this put user funds at risk? I never tried much to read smali files but in
order to decide if we can roll this out to our users or not, we must understand
what the diff is if not where it comes from ...

The diff appears in `NewsFragment.smali` which is derived from `NewsFragment.kt`
and the method in question is line 71 to 77:

```
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setHasOptionsMenu(true)
    preference = requireActivity().getSharedPreferences(NewsConstants.NEWS_PREF, MODE_PRIVATE)
    adapter = NewsAdapter(preference)
    adapterSearch = NewsSearchAdapter(preference)
}
```

In smali this is slightly longer. From Playstore:

```
method public onCreate(Landroid/os/Bundle;)V
    .locals 2

    .line 72
    invoke-super {p0, p1}, Landroidx/fragment/app/Fragment;->onCreate(Landroid/os/Bundle;)V

    const/4 p1, 0x1

    .line 73
    invoke-virtual {p0, p1}, Lcom/mycelium/wallet/activity/modern/NewsFragment;->setHasOptionsMenu(Z)V

    .line 74
    invoke-virtual {p0}, Lcom/mycelium/wallet/activity/modern/NewsFragment;->requireActivity()Landroidx/fragment/app/FragmentActivity;

    move-result-object p1

    const-string v0, "news"

    const/4 v1, 0x0

    invoke-virtual {p1, v0, v1}, Landroidx/fragment/app/FragmentActivity;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    move-result-object p1

    const-string v0, "requireActivity().getSha\u2026.NEWS_PREF, MODE_PRIVATE)"

    invoke-static {p1, v0}, Lkotlin/jvm/internal/Intrinsics;->checkExpressionValueIsNotNull(Ljava/lang/Object;Ljava/lang/String;)V

    iput-object p1, p0, Lcom/mycelium/wallet/activity/modern/NewsFragment;->preference:Landroid/content/SharedPreferences;

    .line 75
    new-instance p1, Lcom/mycelium/wallet/activity/modern/adapter/NewsAdapter;

    iget-object v0, p0, Lcom/mycelium/wallet/activity/modern/NewsFragment;->preference:Landroid/content/SharedPreferences;

    const-string v1, "preference"

    if-nez v0, :cond_0

    invoke-static {v1}, Lkotlin/jvm/internal/Intrinsics;->throwUninitializedPropertyAccessException(Ljava/lang/String;)V

    :cond_0
    invoke-direct {p1, v0}, Lcom/mycelium/wallet/activity/modern/adapter/NewsAdapter;-><init>(Landroid/content/SharedPreferences;)V

    iput-object p1, p0, Lcom/mycelium/wallet/activity/modern/NewsFragment;->adapter:Lcom/mycelium/wallet/activity/modern/adapter/NewsAdapter;

    .line 76
    new-instance p1, Lcom/mycelium/wallet/activity/news/adapter/NewsSearchAdapter;

    iget-object v0, p0, Lcom/mycelium/wallet/activity/modern/NewsFragment;->preference:Landroid/content/SharedPreferences;

    if-nez v0, :cond_1

    invoke-static {v1}, Lkotlin/jvm/internal/Intrinsics;->throwUninitializedPropertyAccessException(Ljava/lang/String;)V

    :cond_1
    invoke-direct {p1, v0}, Lcom/mycelium/wallet/activity/news/adapter/NewsSearchAdapter;-><init>(Landroid/content/SharedPreferences;)V

    iput-object p1, p0, Lcom/mycelium/wallet/activity/modern/NewsFragment;->adapterSearch:Lcom/mycelium/wallet/activity/news/adapter/NewsSearchAdapter;

    return-void
.end method
```

vs. from new build:

```
.method public onCreate(Landroid/os/Bundle;)V
    .locals 2

    .line 72
    invoke-super {p0, p1}, Landroidx/fragment/app/Fragment;->onCreate(Landroid/os/Bundle;)V

    const/4 p1, 0x1

    .line 73
    invoke-virtual {p0, p1}, Lcom/mycelium/wallet/activity/modern/NewsFragment;->setHasOptionsMenu(Z)V

    .line 74
    invoke-virtual {p0}, Lcom/mycelium/wallet/activity/modern/NewsFragment;->requireActivity()Landroidx/fragment/app/FragmentActivity;

    move-result-object p1

    const-string v0, "news"

    const/4 v1, 0x0

    invoke-virtual {p1, v0, v1}, Landroidx/fragment/app/FragmentActivity;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;

    move-result-object p1

    const-string v0, "requireActivity().getSha\u2026.NEWS_PREF, MODE_PRIVATE)"

    invoke-static {p1, v0}, Lkotlin/jvm/internal/Intrinsics;->checkExpressionValueIsNotNull(Ljava/lang/Object;Ljava/lang/String;)V

    iput-object p1, p0, Lcom/mycelium/wallet/activity/modern/NewsFragment;->preference:Landroid/content/SharedPreferences;

    .line 75
    new-instance v0, Lcom/mycelium/wallet/activity/modern/adapter/NewsAdapter;

    const-string v1, "preference"

    if-nez p1, :cond_0

    invoke-static {v1}, Lkotlin/jvm/internal/Intrinsics;->throwUninitializedPropertyAccessException(Ljava/lang/String;)V

    :cond_0
    invoke-direct {v0, p1}, Lcom/mycelium/wallet/activity/modern/adapter/NewsAdapter;-><init>(Landroid/content/SharedPreferences;)V

    iput-object v0, p0, Lcom/mycelium/wallet/activity/modern/NewsFragment;->adapter:Lcom/mycelium/wallet/activity/modern/adapter/NewsAdapter;

    .line 76
    new-instance p1, Lcom/mycelium/wallet/activity/news/adapter/NewsSearchAdapter;

    iget-object v0, p0, Lcom/mycelium/wallet/activity/modern/NewsFragment;->preference:Landroid/content/SharedPreferences;

    if-nez v0, :cond_1

    invoke-static {v1}, Lkotlin/jvm/internal/Intrinsics;->throwUninitializedPropertyAccessException(Ljava/lang/String;)V

    :cond_1
    invoke-direct {p1, v0}, Lcom/mycelium/wallet/activity/news/adapter/NewsSearchAdapter;-><init>(Landroid/content/SharedPreferences;)V

    iput-object p1, p0, Lcom/mycelium/wallet/activity/modern/NewsFragment;->adapterSearch:Lcom/mycelium/wallet/activity/news/adapter/NewsSearchAdapter;

    return-void
.end method
```

While we are not `smali` experts, we decided to understand enough to rule out a
backdoor in those lines of diff, especially given a colleague could repeatedly
reproduce the build and so could I, only that I could not use Docker while the
colleague was using Docker.

# Reproducing the build on a third, independent machine

In order to reproduce the build on a probably clean third machine, I created a
new 8GB RAM instance of a virtual server at Digitalocean
([referral link](https://m.do.co/c/a0f4504a8b58)), installed all prerequisites
and ran the test script:

```
root@tmpMycelium:~# apt update
root@tmpMycelium:~# apt full-upgrade -y
root@tmpMycelium:~# apt install -y htop apt-transport-https ca-certificates curl gnupg2 \
  software-properties-common disorderfs apt-transport-https ca-certificates \
  curl gnupg2 software-properties-common openjdk-11-jdk-headless
root@tmpMycelium:~# apt autoremove
root@tmpMycelium:~# curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
root@tmpMycelium:~# sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
root@tmpMycelium:~# sudo apt-get update
root@tmpMycelium:~# apt-get install -y docker-ce
root@tmpMycelium:~# wget https://raw.githubusercontent.com/iBotPeaches/Apktool/master/scripts/linux/apktool
root@tmpMycelium:~# mv apktool /usr/local/bin/
root@tmpMycelium:~# chmod +x /usr/local/bin/apktool
root@tmpMycelium:~# wget https://bitbucket.org/iBotPeaches/apktool/downloads/apktool_2.4.1.jar
root@tmpMycelium:~# mv apktool_2.4.1.jar /usr/local/bin/apktool.jar
root@tmpMycelium:~# git clone https://github.com/mycelium-com/wallet-android
root@tmpMycelium:~# cd wallet-android
root@tmpMycelium:~/wallet-android# docker build . --tag mycelium-wallet
root@tmpMycelium:~/wallet-android# cd /tmp/
root@tmpMycelium:/tmp# git clone https://gitlab.com/walletscrutiny/walletScrutinyCom
root@tmpMycelium:/tmp# cd walletScrutinyCom/
root@tmpMycelium:/tmp/walletScrutinyCom# ./test.sh /tmp/Mycelium\ Wallet\ 3.4.0.0\ \(com.mycelium.wallet\).apk 
root@tmpMycelium:/tmp/walletScrutinyCom# ./test.sh /tmp/Mycelium\ Wallet\ 3.4.0.1\ \(com.mycelium.wallet\).apk
```

and got the results as documented in the [review of Mycelium](/mycelium/).

# Conclusion

While this should reassure any expert that the build could be verified, the
question remains:

> How can it be that on my system compiling Mycelium without Docker yields the
  same result as on my colleagues system using Docker while yielding a different
  result on my system using the same Docker? We both have Ubuntu 19.10 and used
  our old Docker image and tried a new Docker image. The only difference we
  could find so far was that my colleague has Docker `19.03.8` where I have
  version `19.03.6`.

So ... was all this drama because I was lazy to install the latest Docker, in
doubt trusting the Ubuntu repository that I already trust, over a million
individual sources?

```
$ sudo apt remove docker.io 
$ curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
$ sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
$ sudo apt-get update
$ sudo apt-get install -y docker-ce
$ ./test.sh /media/leo/backup8tb/stuff/Mycelium\ Wallet\ 3.4.0.0\ \(com.mycelium.wallet\).apk 
...
Results for 
appId:          com.mycelium.wallet
apkVersionName: 3.4.0.0
apkVersionCode: 3040000
apkHash:        35d7eeafa87ce88d527c9a41865eaa4cdcd158be8ea190c84133fbb02bfb6c46

Diff:
...
Files /tmp/fromPlay_com.mycelium.wallet_3040000/smali_classes2/com/mycelium/wallet/activity/modern/NewsFragment.smali and /tmp/fromBuild_com.mycelium.wallet_3040000/smali_classes2/com/mycelium/wallet/activity/modern/NewsFragment.smali differ
```

... same issue.