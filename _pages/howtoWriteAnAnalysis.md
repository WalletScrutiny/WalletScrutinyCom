---
title: "How to Write an Analysis"
permalink: /howtoWriteAnAnalysis/
---

The [project website](https://walletscrutiny.com) runs on Jekyll, a static site generator.

Each product is represented by a text file for all the description,
links and data and by an image file.
For instance, the [first open source Android wallet's Article](https://walletscrutiny.com/android/de.schildbach.wallet/)
is defined by
[its Analysis](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/_android/de.schildbach.wallet.md) and [its logo](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/images/wIcons/android/de.schildbach.wallet.png).

## The Analysis File Structure

All product files follow the same general structure and platforms vary only slightly in the fields that are used. To add a bearer token, it's easy to start with an existing bearer token for example. But for Android and iPhone apps there are helper scripts. More on those below.

The common structure is:

```yaml
---
title: 
authors:
appId: 
appCountry: 
released:
updated: 
version: 
website: 
repository: 
issue: 
icon: 
bugbounty: 
meta: 
verdict: 
date: 
reviewArchive: 
twitter: 
social:
---

... here goes the actual analysis ...
```

## Adding New Android Apps

You may find that recently released apps are not yet in WalletScrutiny. If you find any of these you may add them to the project by doing the following:

1. **Open a terminal** in the cloned WalletScrutiny directory. Check if you are in 'master'.

   `$ git checkout master`
2. **Update your local instance** by executing these commands:

   `$ git fetch origin master`

   and then,

   `$ git pull`
3. **Get the app ID from Google Play**. App IDs on Google Play are typically named using the reverse domain name notation. Thus, if the app's homepage is myamazingapp.com, you'll find that its Google Play app ID is **com.myamazingapp**.

   Thus the URL for the app would be:

   `https://play.google.com/store/apps/details?id=com.myamazingapp`
4. **Create a new branch for the new app**. The naming convention for a single new app is usually a shortened description such as:

   `$ git checkout -b newApp-appID`
5. **Use node to execute the WalletScrutiny script** to add the app ID, by typing:

   `$ node addNewAndroidApps.js com.myamazingapp`
6. If you did not receive an error, you may **proceed with adding various sizes of icon images** by typing:

   `$ ./updateImages.sh`

- That's it! The new app is now added to your local WalletScrutiny. To verify if the app is added to the project, type this in the terminal:

  `$ git status`
- You should see the following:
  - A new **.md** file with the corresponding app ID file name.
  - 3 new images

At this point, you have the option to make a pull request. Alternatively, you can proceed with reviewing the app.

## How To Add iPhone Apps

If you are aware that the Android app has a corresponding iPhone app, do this:

1. Browse over to the app's Apple Store page. For example, this is the Apple Store app page for the game 'Tetris'. Take note of the 2-letter country code and the ID number:

   `https://apps.apple.com/us/app/tetris/id1491074310`
2. In the example above, the 2-letter country code is **'us'**, and the ID number is **1491074310**. We're going to combine these two into **us/1491074310**
3. Back on the terminal, use node to add the App.

   `$ node addNewIphoneApps.js us/1491074310`
   - **Note:** If this results in an error, try replacing the country code with other codes. If you know for example that the app has origins in Hong Kong, replace **us** with **hk**.
4. Similar to the Android app procedure, we also invoke:

   `$ ./updateImages.sh`
5. Check if the files are updated:

   `$ git status`

## Reviewing Android Apps

Now that we've added the Android, iPhone apps and their corresponding icon images, we can now review them.

But before we do so, let's take a deeper look at the **.md** file we just created for the Android app. You may open the .md file with a text editor of choice.

Let's go over the lines, one by one:

1. **wsId**
    - The WalletScrutiny ID or wsId, for short, is used to link an Android app review with the iPhone app review. Leave this blank if an Android app has no iPhone counterpart.
    - Use camelCase notation. No symbols and spaces.
    - If an Android app has an iPhone counterpart, the convention is to get the descriptive keywords which are ideally proper nouns in the app's name, description, or developer contact.
    - If both the Android app and the iPhone app are related, they should have the same wsIds.
    - Avoid generic or duplicate wsId's such as "cryptoExchange" or "freeWallet".
    - If a wallet has a generic-sounding name, you may concatenate other descriptive proper nouns from the app such as the app's developer name, a keyword from the description or its homepage. Thus, instead of freeWallet, you can use "danielFreeWallet", "acmeCompanyFreeWallet" and such.
 2. **title**
    - This is auto-populated. Do not modify.
    - Reflects the app's Google Play app name and gets updated as the listing updates on Google Play.
 3. **altTitle**
    - When populated, inserts the following text beneath the title:

      > (Actually "{title}". For details read below.)
    - Putting an alternative title gives the author an opportunity to give an app a different name apart from the one officially on Google Play. This often occurs when an app is generically named like **Bitcoin Wallet**
    - The `altTitle` gives the analysis author the chance to assign a distinguishable title like "Bitcoin Wallet by MegaCrypto"
    - This is **only** used to disambiguate or to mark fakes. If on Google Play the product is named "MegaCrypto" but it is not affiliated with some actual "MegaCrypto", `altTitle` can be set to "(Fake) MegaCrypto" together with a "fake" verdict.
 4. **authors**
    - List of authors
    - This can be either of:
      - full name: "John Doh" for example. In this form it gets listed as is
      - a reference to a file found in the `_authors` folder without the extension `.md`. As there is a file "leo.md" in the `_authors` folder, `- leo` in the authors list gets a link with further information.
    - Placed on the succeeding lines in this format:

      `- pseudonym`
 5. **users**
    - Auto-populated, do not modify
    - This reflects the app download count on Google Play.
 6. **appID**
    - Auto-populated, do not modify
    - Reflects the Google Play App ID and will always match the file name.
 7. **appCountry**
    - Shows the 2-letter country code which is used when querying Play Store for name and icon - in English.
    - If not provided, Chile is used as default. The update script uses Chile as default as many apps are available in all but some countries and European countries and the US are more commonly excluded.
 8. **released**
    - Auto-populated, do not modify
 9. **updated**
    - Auto-populated, do not modify
    - Reflects the date when the app was last updated by the provider
10. **version**
    - Auto-populated, do not modify
11. **stars**
    - Auto-populated, do not modify
12. **ratings**
    - Auto-populated, do not modify
13. **reviews**
    - Auto-populated, do not modify
14. **size**
    - Auto-populated, do not modify
15. **website**
    - Auto-populated, do not modify
    - The website listed in the developer contact.
    - There are many instances when this is deliberately left empty by the developer, or with incorrect information.
    - If during the course of the review, the reviewer finds the 'real' website, it would be best to include this under the **'social:'** field. Do it in this format:

      `- https://website.com`
16. **repository**
    - This is pretty nuanced as some projects that claim to be Open Source, put up placeholder repositories that are unrelated or even empty.
    - Distinguish this from the GitHub organization account. For example, the app's website links to this:
      - `https://github.com/Blockstream`
    - The repository for the actual app is:
      - `https://github.com/Blockstream/green_android`
    - Always put the repository instead of the organization page.
    - Sometimes we find the repository's source by searching for the `appId` from above on GitHub
17. **issue**
    - If we open an issue **on the repository of the provider**, we put the issue's link here.
18. **icon**
    - Auto-populated, do not modify
    - It is always the `appId` with a `.png`, `.jpg` or `.jpeg` extension
19. **bugbounty**
    - This is where a link to the provider's bug bounty policy is placed.
20. **meta**
    - Much like the `verdict` below, `meta` categorizes our findings on a kind of independent dimension to `verdict`. For example a product might be "verdict: custodial" but due to not having been updated in many years it's obsolete. We mark it `meta: obsolete` then.
    - `meta: stale` and `meta: obsolete` are automatically assigned based on when the product was last updated
    - If the app is not found on Google Play anymore, `meta: defunct` is automatically assigned
    - `meta: defunct` can also be assigned manually if the app is found to be broken for good.
    - If the `verdict: ` is outdated, we set `meta: outdated`. For example if an app was closed source (`verdict: nosource`) and then starts publishing source, a reviewer who doesn't feel comfortable compiling the app can mark the verdict outdated with `meta: outdated`, without touching the verdict itself. In this case, an issue should be opened in our GitLab.
    - Each key word is described in all detail in the [methodology](https://walletscrutiny.com/methodology)
21. **verdict**
    - verdicts categorize our key findings
    - All valid verdicts for Android apps are listed [here](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/_data/platformMeta.yml#L8-19)
    - The detailed interpretation of each verdict is described in our [methodology](https://walletscrutiny.com/methodology) or in the corresponding file [here](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/tree/master/_data/verdicts).
22. **date:**
    - Has to be manually set by the reviewer.
    - The date when the review was made.
    - Format is `yyyy-mm-dd`
23. **signer:**
    - Optional field
    - Our [test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/test.sh?ref_type=heads#L67) uses `apksigner` to get a SHA-256 fingerprint of the provider's certificate they use to sign their app.
24. **reviewArchive:**
    - Used to show a historical account of a product.
    - It includes sub-fields, that show previous assessments:

      1. **date**: When was the past review done   
      2. **version**: Version code of the reviewed product
      3. **appHash**: Optional. If the app was analyzed and the app's sha256 hash was determined, this goes here.
      4. **gitRevision**: walletScrutinyCom's git revision showing the old Analysis. Typically this is the git revision prior to editing the analysis.
      5. **verdict**: The prior verdict
25. **twitter:**
    - Should include the Twitter handle (without the '@' sign) of the provider.
    - For example:
      - `twitter: WalletScrutiny`
26. **social:**
    - Includes other social media profiles of the provider as found on their homepage.
    - Includes complete URLs. For example:

    ```
    social:
    - https://www.facebook.com/paxful
    - https://www.reddit.com/r/paxful
    - https://www.youtube.com/PaxfulOfficial
    - https://www.instagram.com/paxful/
    
    ```
27. **redirect_from:**
    - Usually not needed
    - Defines alternative URLs that should redirect to this Analysis
    - This was mostly used to avoid breaking links from external pages. For example, WalletScrutiny started out using the "blog" feature, so the product "Paxful" was analyzed in a "post" in November of 2019 but later the format changed, so ... that product collected some "dust" in this parameter:

    ```
    redirect_from:
    - /paxful/
    - /com.paxful.wallet/
    - /posts/2019/11/paxful/
    - /posts/com.paxful.wallet/
    ```
28. **developerName:**
    - Autopopulated, do not modify.
29. **features:**
    - Reserved future field for app features
    - If the product supports lightning network, add `- ln` below this line