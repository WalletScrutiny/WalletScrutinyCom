---
layout: archive
title: "Contribution Guide"
permalink: /contribute/
author_profile: true
---

## How to Contribute

WalletScrutiny is a non-profit, Bitcoin-only, source-available project that's primarily run by volunteers. We are motivated to keep the Free and Open Source community aspect of Bitcoin alive. We believe that our contributions help the Bitcoin community become stronger and more agile by pushing for accountability and auditability in wallet security. 

There are many ways you can contribute to the project. These are but a few:   

### Donate.

- [Donate.](donate.md) Your donations will support the expenses needed to keep the project - and more importantly, the primary contributors, going. Server, hosting, domain and research costs all factor in to the equation. When you make a donation, you can vote to determine the priorities. The donation form lets you choose among the following: 

    - More Wallets
    - More frequent updates
    - More operating systems (Windows, Mac)
    - Actual code reviews
    - Non-Bitcoin wallets
    - Alerts when issues are found
    - Non-Wallet apps

<hr>

### Create Issues

The project maintains a GitLab page where we organize activities around **[Issues](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/new)**. If we find a wallet that claims to be **self-custodial** and **source-available**, this is where we put it. This is also where we put items that are worthy of scrutiny.

  - ⭐ **You** can also create issues if you find anything of note pertaining to the project. Simply head over [here](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/new). We encourage it!

### Propose Changes

Direct participation in the project is also encouraged. You can message or join us in the following platforms: 

  - [Discord](https://discord.gg/yVWqxHSjHH)
  - [Reddit](https://reddit.com/r/walletscrutiny)
    
## How to Add a New Product

We encourage wallet providers to add their product to our database. If the product is source-available, we'd also value detailed instructions on how to build the app. This saves us time when performing reproducible-builds.

⭐ Even if you are not the developer of the app, you can still submit reviews. In fact, we'd like that. This is good as more verifiers test a wallet, the better.

The project is primarily run through Jekyll. Each app, be it Android or iOS, is represented by an **.md** file. Each file is in a folder named after the category. For instance, the {% include walletLink.html wallet='android/de.schildbach.wallet' %} is represented by the file name, inside the android directory: 

  `android/de.schildbach.wallet`

### General

### Adding New Android Apps

You may find that recently released apps are not yet in WalletScrutiny. If you find any of these you may add them to the project by doing the following: 

1. **Open a terminal** in the cloned WalletScrutiny directory. Check if you are in 'master'.

   ```$ git checkout master```

2. **Update your local instance** by executing these commands:

   ```$ git fetch origin master```
   
   and then, 
   
   ```$ git pull```
   
3. **Get the app ID from Google Play**. App IDs on Google Play are typically named using the reverse domain name notation. Thus, if the app's homepage is myamazingapp.com, you'll find that its Google Play app ID is **com.myamazingapp**.

   Thus the URL for the app would be:  
   
   `https://play.google.com/store/apps/details?id=com.myamazingapp`
   
4. **Create a new branch for the new app**. The naming convention for a single new app is usually a shortened description such as:

   ```$ git checkout -b newApp-appID```

5. **Use node to execute the WalletScrutiny script** to add the app ID, by typing: 

   ```$ node addNewAndroidApps.js com.myamazingapp```

6. If you did not receive an error, you may **proceed with adding various sizes of icon images** by typing:

   ```$ ./updateImages.sh```
   
- That's it! The new app is now added to your local WalletScrutiny. To verify if the app is added to the project, type this in the terminal: 

   ```$ git status```

- You should see the following: 

  - A new **.md** file with the corresponding app ID file name.
  - 3 new images

At this point, you have the option to make a pull request. Alternatively, you can proceed with reviewing the app. 

### How To Add iPhone Apps

If you are aware that the Android app has a corresponding iPhone app, do this: 

1. Browse over to the app's Apple Store page. For example, this is the Apple Store app page for the game 'Tetris'. Take note of the 2-letter country code and the ID number: 

   ```https://apps.apple.com/us/app/tetris/id1491074310```
   
2. In the example above, the 2-letter country code is **'us'**, and the ID number is **1491074310**. We're going to combine these two into **us/1491074310**

3. Back on the terminal, use node to add the App. 

   ```$ node addNewIphoneApps.js us/1491074310```
   
   - **Note:** If this results in an error, try replacing the country code with other codes. If you know for example that the app has origins in Hong Kong, replace **us** with **hk**. 
   
4. Similar to the Android app procedure, we also invoke: 

   ```$ ./updateImages.sh```

5. Check if the files are updated: 

   ```$ git status```
   
## Reviewing Android Apps 

Now that we've added the Android, iPhone apps and their corresponding icon images, we can now review them. 

But before we do so, let's take a deeper look at the **.md** file we just created for the Android app. You may open the .md file with your text editor of choice. Here, you'll find the following information: 

```
   ---
   wsId: 
   title: 
   altTitle: 
   authors:
   users: 
   appId: 
   appCountry: 
   released:
   updated: 
   version: 
   stars: 
   ratings: 
   reviews: 
   size: 
   website: 
   repository: 
   issue: 
   icon: 
   bugbounty: 
   meta: 
   verdict: 
   date: 
   signer: 
   reviewArchive: 
   twitter: 
   social:
   redirect_from:
   developerName: 
   features: 

   ---

```

Let's go over them, one by one: 

1. **wsId**

    - The WalletScrutiny ID or wsId, for short, is used to link an Android app review with the iPhone review. Leave this blank if an Android app has no iPhone counterpart. 
    - Use camelCase notation. No symbols and spaces.
    - If an Android app has an iPhone counterpart, the convention is to get the descriptive keywords which are ideally proper nouns in the app's name, description, or developer contact.  
    - If both the Android app and the iPhone app are related, they should have the same wsIds. 
    - Avoid generic or duplicate wsId's such as "cryptoExchange" or "freeWallet".
    - If a wallet has a generic-sounding name, you may concatenate other descriptive proper nouns from the app such as the app's developer name, a keyword from the description or its homepage. Thus, instead of freeWallet, you can use "danielFreeWallet", "acmeCompanyFreeWallet" and such.  
<br>

2. **title**

    - This is auto-populated. Do not modify.
    - Reflects the app's Google Play app name.  
<br>

3. **altTitle**

    - When populated, inserts the following text beneath the title:

      > (Actually "{title}". For details read below.)

    - Putting an alternative title gives the author an opportunity to give an app a different name apart from the one officially on Google Play. This often occurs when an app is generically named like {% include walletLink.html wallet='android/de.schildbach.wallet' verdict='true' %}
    - In the example above, the app was generically named, 'Bitcoin Wallet'. Thus, the altTitle gives the review author the chance to make it known to readers that this specific app, was created by a person with the surname 'Schildbach'. 
    - This is not often used but is usually used for disambiguation.  
<br>

4. **authors**

    - No capitalization. Lowercase only. Pseudonym
    - Placed on the succeeding line in this format: 

      ```- pseudonym```<br>
 
5. **users**

    - Auto-populated, do not modify
    - This reflects the app download count in Google Play.  
    <br>
    
6. **appID**

    - Auto-populated, do not modify
    - Reflects the Google Play App ID.  
    <br>    

7. **appCountry**

    - Shows the 2-letter country code for the possible app country of origin.  
    <br>

8. **released**

    - Auto-populated, do not modify
    - Reflects the **Release Date** of the app, in the *About this app* section of the app's Google Play page.  
    <br>    

9. **updated** 

    - Auto-populated, do not modify
    - Reflects the date when the app was last updated, in the *About this app* section of the app's Google Play page.  
    <br>    

10. **version**

    - Auto-populated, do not modify
    - Reflects the current version number that will be downloaded. Likewise, this is found in the *About this App* section of the app's Google Play page.  
    <br>    

11. **stars**

    - Auto-populated, do not modify
    - Reflects the ratings quantified in "stars", data found on the app's Play page.  
    <br>

12. **ratings**

    - Auto-populated, do not modify
    - Returns the value of the app's ratings on the Play Store app page.  
    <br>

13. **reviews**

    - Auto-populated, do not modify
    - Shows the total number of reviews the app received, reflected in the Play Store app page.  
    <br>

14. **size**

    - Auto-populated, do not modify
    - Download size  
    <br>

15. **website**

    - Auto-populated, do not modify
    - The website listed in the developer contact. 
    - There are many instances when this is deliberately left empty by the developer, or with incorrect information. 
    - If during the course of the review, the reviewer finds the 'real' website, it would be best to include this under the **'social:'** field. Do it in this format: 
    
      ```- https://website.com```  
    <br>

16. **repository**

    - This is pretty nuanced as some projects that claim to be Open Source, put up placeholder repositories that are unrelated or even empty. 
    - Distinguish this from the GitHub organization account. For example, the app's website links to this:
    
        - ```https://github.com/Blockstream```  
        <br>

    - The repository for the actual app is:
    
        - ```https://github.com/Blockstream/green_android```  
        <br>

    - Always put the repository instead of the organization page.
    - If the app's providers claim to be an Open Source project, the repository should be searchable using the Google Play ID.  
    <br>
    
17. **issue**

    - This is where the reviewer puts the link to the GitHub Issues page of the provider, informing them of reproducibility concerns. 
    - A good example of this is the issue in {% include walletLink.html wallet='android/com.greenaddress.greenbits_android_wallet' %}
      - ```issue: https://github.com/Blockstream/green_android/issues/169```
    
18. **icon**

    - This is where the app's icon name is placed. 
    - It is usually named using the app Id with a png extension
    - For {% include walletLink.html wallet='android/com.greenaddress.greenbits_android_wallet' %}, the icon field is: 
    
      - ```icon: com.greenaddress.greenbits_android_wallet.png```
      
19. **bugbounty**

    - This is where a link to the provider's bug bounty policy is placed. 
    - An example of this is {% include walletLink.html wallet='android/com.paxful.wallet' %}:
    
      - ```bugbounty: https://paxful.com/bug-bounty-policy```
      
20. **meta**

    - This is one of the core front-matter fields that should be filled up by the reviewer. 
    - There are five unique values for **meta**. The description for each could be found in the [methodology](methodology.md) section:  
      1. ok
      2. stale
      3. obsolete 
      4. outdated
      5. defunct
      
21. **verdict**

    - This is another one of the core front-matter fields that should be filled up by the reviewer. 
    - Like the meta-verdict, the **verdict** field is where the findings of the reviewer are placed. There are 26 possible verdicts. Their explanations could be found on the [methodology](methodology.md) page.
      - custodial
      - defunct
      - discontinued
      - diy
      - fake
      - fewusers
      - ftbfs
      - nobinary
      - nobtc
      - noita
      - nonverifiable
      - nosendreceive
      - nosource
      - nowallet
      - obfuscated
      - obsolete
      - outdated
      - plainkey
      - prefilled
      - reproducible
      - sealed-noita
      - sealed-plainkey
      - stale
      - unreleased
      - vapor
      - wip 
      
22. **date:**

    - Has to be manually inputted by the reviewer. 
    - The date when the review was made. 
    - Format is `yyyy-mm-dd`  
    
    
23. **signer:**

    - included in **reviewArchive:** 
    - involves a hexadecimal representation of a 256-bit hash value  
    
    
24. **reviewArchive:**
      
    - Utilized when an app is previously rebuilt. It is meant to show a historical account of an app.
    - It includes sub-fields, that show previous assessments:
    
    ```
      - date:   

        version:   

        appHash:   

        gitRevision:   

        verdict:
        
    ```
          
25. **twitter:**

    - Should include the Twitter handle (without the '@' sign) of the provider.
    - For example:
      - `twitter: WalletScrutiny`

26. **social:**

    - Includes other social media profiles of the provider as found on their homepage:
    - Could include complete URLs to social media platforms. For example:
    
    ```

    social:
    - https://www.facebook.com/paxful
    - https://www.reddit.com/r/paxful
    - https://www.youtube.com/PaxfulOfficial
    - https://www.instagram.com/paxful/

    ```

27. **redirect_from:**

    - Redirects to a new URL from other/former URLs of pages or reviews.
    - A good example is {% include walletLink.html wallet='android/com.paxful.wallet' %}:
    
    ```

    redirect_from:
    - /paxful/
    - /com.paxful.wallet/
    - /posts/2019/11/paxful/
    - /posts/com.paxful.wallet/

    ```

28. **developerName:**

    - Autopopulated, do not modify.
    - Contains developer contact name from Google Play page.
    
29. **features:**

    - Reserved future field for app features

## How to add a new category

First, determine if the category is worthy of adding. Most of the current categories have many wallets in them. If this device or app, is the sole thing in its category, we simply put it in the **_others**. The major categories for the moment are: android, iPhone, bearer tokens, hardware, desktop and others. 

It would be best to take this up with the project manager first before making an MR.

At its most basic, adding a category starts with these steps: 

1. First, the project manager has to approve whether a category is worth adding. 

2. Create a new folder in the root directory and name it descriptively but short. As an example, we will create a new category named 'Desktop'. In the root folder of WalletScrutiny:

    ```$ mkdir _desktop```
  
3. Also create a new folder for the icons and images in /images/wIcons. 

      ```$ mkdir /images/wIcons/desktop```
  
      ```$ mkdir /images/wIcons/desktop/small```
     
      ```$ mkdir /images/wIcons/desktop/tiny```
      
4. Create your first .md file inside the _desktop folder. In our example, lets call this `bitcoincore.md`

      ```$ touch bitcoincore.md```
      
5. Populate the file with the front matter. For guidance, you may use some of the fields in the Android app less the irrelevant fields that you won't find in a desktop app such as Google Play reviews, etc. You may use the fields above, in the `Reviewing Android Apps` section. 

6. Put a 400x400 png image in /images/wIcons/desktop 

7. Run `./updateImages` script to automatically put a 250x250 copy of the png image in 'small' and a 100x100 copy in 'tiny'.

8. In **_config.yml** duplicate then modify the following entries to match the category you are making:

    - Under:

      - > Collections 

              desktop:
                output: true
                permalink: /:collection/:path/

      - > Defaults 

              desktop
              - scope:
                  path: ""
                  type: "desktop"
                  values:
                  layout: reviewDesktop
                  author_profile: true
                  read_time: false
                  comments: false
                  share: true
                  related: false

9. In the **_layouts** folder 

- Duplicate the reviewAndroid.html file. In our case we should have a new file called **reviewDesktop.html**.
- This should match the 'layout:' field under #Defaults in _config.yml

    - ![Sample reviewDesktop field under layout field under #Defaults in _config.yml](/images/pages/contribute-config-sample-modify-desktop.png "Sample reviewDesktop field under layout field under #Defaults in _config.yml")


10. Open the **reviewDesktop.html** file we just created, search for `<img src>`` tag or the word **'icon'**. Make sure it matches the directory of where the icons are stored.

### Adding the Embeddable Widgets

11. Make sure to include `desktop` in **allWallets.js** under:

    ```const folders = ["hardware", "android", "iphone", "bearer", "desktop"]```
    
12. Make sure to include `desktop` in the file **wallets.js** under: 

    ```const platformOrder = "hardware,android,iphone,bearer,desktop"```
    
13. Edit **allAppList.html** to include desktop. This is an example entry for **Hardware**. Replace all instances of *hardware* with `desktop`. Be sure to match the fields in the front matter of your .md files.

    - ![Image of sample entry for hardware in allAppList.html](/images/pages/allapplist-mods-for-new-category.png "Sample entry for hardware in allAppList.html to be modified")





