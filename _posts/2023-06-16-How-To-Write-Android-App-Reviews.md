---
title: How to Write Android App Reviews
subtitle: 
excerpt: 
authors:
- danny
date: 2023-06-16
---

# How to Write Android Reviews 

## Introduction 

Reviewing Android apps is like finding the missing pieces of a puzzle. Contrary to popular belief, it can be done by anyone who knows how to follow instructions.

We start by piecing together facts using various sources to come up with a credible verdict. Our paradigm is the scientific model. The objective is to follow a methodology with a verifiable verdict that can be replicated by others. 

As more individuals review an app, the more credible a verdict becomes. This is no trivial task since there are different machines that can run an app. But the task remains the same, the verdict must reflect how an app could behave. 

We piece together proof with the intention that the users of the app are kept safe, aware, and motivated to be vigilant. 

As Bitcoiners, having a strong verdict doesn't necessarily mean that we should be complacent. The verdict is merely the entry point to a rabbit hole that goes down to the core of self-sovereignty, decentralization, and freedom. 

We invite you to participate in reviewing the beautiful cornucopia of Bitcoin apps and devices.    

⭐ You can clone the project by following the instructions in the [WalletScrutiny GitLab repository](https://GitLab.com/walletscrutiny/walletScrutinyCom).

## Pre-requisites

- Git and a GitLab account
- Text editor and Markdown 
- Familiarizing yourself with the Methodology 

### Git and GitLab 

WalletScrutiny uses Git and GitLab to manage the repositories. Reviews are organized in 'branches' usually in batches of 10 to 20 reviews/apps. It is possible to just include 1 review in a branch.

Learning Git and GitLab opens up a new world to creation. Like the software development process, reviews are a constantly evolving organism. An app with version 0.9.8 could be reproducible today but could be unreproducible with version 0.9.9. A self-custodial app run by company X could be acquired by company Y, which has a different ethos and objective. Circumstances change, and therefore, reviews must constantly change as well. 

Git and GitLab are efficient tools to keep track of these changes. As developers or providers iterate on their development process, reviews should follow. 

Git is a distributed version control system that primarily runs on the terminal. 

There are many resources on YouTube about Git and GitLab

- [Beginner's Crash Course on Git](https://www.youtube.com/watch?v=SWYqp7iY_Tc) 
- [FreeCode Camp Course on Git](https://www.youtube.com/watch?v=RGOj5yH7evk)
- [More information about GitLab](https://www.youtube.com/watch?v=MqL6BMOySIQ)

### Markdown

WalletScrutiny uses markdown to format text. Thus, each Android app is represented by a file located in the **_android** folder. For iPhone apps, the **_iphone** folder.

You can use any text editor, but we find that Atom is the most efficient.

[Markdown cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)

### Methodology 

You can access the WalletScrutiny.com [methodology](https://walletscrutiny.com/methodology/) on the web or locally.

Be sure to read through all the verdicts and their explanations as some could be very nuanced. 

## Finding Android Apps to Review

- GitLab Issues
- Adding New Android Apps 
- Finding the iPhone Counterpart 

### GitLab Issues 

You may consider WalletScrutiny's [GitLab Issues](https://GitLab.com/walletscrutiny/walletScrutinyCom/-/issues) page as the focal point for listing down general concerns, activities, to-dos, and other items. 

📖 [GitLab Boards](https://GitLab.com/walletscrutiny/walletScrutinyCom/-/boards) is another way for WalletScrutiny to track down concerns. Issues are presented in a card format that is easily grouped and labeled accordingly.

### Adding New Android Apps

You may find that recently released apps are not yet in WalletScrutiny. If you find any of these you may add them to the project by doing the following: 

1. **Open a terminal** in the cloned WalletScrutiny directory. Check if you are in 'master'.

   ```$ git checkout master```

2. **Update your local instance** by executing these commands:

   ```git fetch origin master```
   
   and then, 
   
   ```git pull```
   
3. **Get the app ID from Google Play**. App IDs on Google Play are typically named using the reverse domain name notation. Thus, if the app's homepage is myamazingapp.com, you'll find that its Google Play app ID is **com.myamazingapp**.

   Thus the URL for the app would be:  
   
   `https://play.google.com/store/apps/details?id=com.myamazingapp`
   
4. **Create a new branch for the new app**. The naming convention for a single new app is usually a shortened description such as:

   ```git checkout -b newApp-appID```

5. **Use node to execute the WalletScrutiny script** to add the app ID, by typing: 

   ```node addNewAndroidApps.js com.myamazingapp```

6. If you did not receive an error, you may **proceed with adding various sizes of icon images** by typing:

   ```./updateImages.sh```
   
- That's it! The new app is now added to your local WalletScrutiny. To verify if the app is added to the project, type this in the terminal: 

   ```git status```

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

   ```node addNewIphoneApps.js us/1491074310```
   
   - **Note:** If this results in an error, try replacing the country code with other codes. If you know for example that the app has origins in Hong Kong, replace **us** with **hk**. 
   
4. Similar to the Android app procedure, we also invoke: 

   ```./updateImages.sh```

5. Check if the files are updated: 

   ```git status```
   
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
    
## The Review Analysis 

The space under the three dashes is where the analysis for the verdicts and the meta-verdicts are presented. It should typically include links proving a claim. 

For instance, while it is routinely commonplace for centralized exchanges such as **Coinbase** or **Binance** to be 'custodial', we have to follow the methodology and provide proof for this. Remember, Coinbase and Binance may have other apps apart from their exchange app. 

This is one good example. {% include walletLink.html wallet='android/org.toshi' verdict='true' %} 

Commonsense says that Coinbase is a corporate entity and its products are naturally 
custodial because that's just what they do. But they do have a self-custodial app, that is not source-available.  

While reviewers may typically write a review in their own style, we loosely encourage them to follow the same format with some of these guidelines:

  - Always provide links proving a claim. 
  - If possible, include screenshots of the app and post them publicly (Twitter and Imgur come to mind)
  - If there is not enough information available (yes, it happens), try to contact the provider in a public forum such as Twitter or Nostr. Email should be the last resort since it is considered private communication between two parties.
  - We'll come up with more of these guidelines in the upcoming file: **Rules for Reviewers.**

### 1. Check the Play Store App Description. 

WalletScrutiny uses the Google-Play-Scraper script to auto-populate many of the app's details. While this is good for the frontmatter, using this for the app's description is not advisable. Some apps use filler information that is replete with marketing and technical jargon. Some apps simply use one-line descriptions. But eventually, we do find gems in the rough that proves something immediately. 

Apart from giving an idea of how an app works, the description in Google Play gives clues about the app and the developer (or at least their copywriter).

One of these is the mention of **"using cold-storage as a security measure"**. Cold-storage is a method that allows **custodial** platforms to store cryptocurrencies offline. They typically use **hardware wallets** and other air-gapped devices to prevent hackers from accessing their systems. In order to use these systems, they need to have access and control over the private keys and thus, make their app a **custodial** app. If they have control over the private keys, this automatically means that you don't.

Some apps have several pages long Google Play app descriptions. Choose the keywords that Bitcoiners and wallet reviewers would find relevant.

**But what if they lie?** As we have seen in several reviews, app descriptions are a facade meant to show the best description of an app. Some app providers actually do lie in their app descriptions such as saying their app supports X feature, but the actual app doesn't. That in itself raises its own red flag. Providers who lie cannot be trusted. 

Including this in your analysis should take no more than 2 paragraphs that can be 
directly quoted. 

### 2. Check the Terms and Conditions/User Agreement 

The Terms and Conditions of the app is the legally binding contract that takes effect once a user registers with a service. As opposed to the Google Play description and the homepage of the app, the Terms and Conditions is an actual legal document. This carries more weight as the user has to agree to this in order to use the app. 

There are instances when the Terms do not reflect the content on the app's Play page and homepage. 

While it may be hard to read through several pages of content, there are key phrases that we look for when hunting for clues. Here are a few examples:

- "cold-storage" or simply "cold"
- "held" as in "held in storage on behalf of the user"
- "terminate" as in "terminate the user's account"
- "suspend" as in suspend the user's access to all of the app's features 
- "confiscate" as in "confiscate all funds of the user"
- "third-party" like, third-party custodian
- "Private" as in "private keys"

While not exhaustive, it follows that a **custodial** provider may have one or more of these terms in the User Agreement. Foreign app developers in jurisdictions with cryptocurrency legislation and regulations, bar users using geolocation and several other KYC procedures that prohibit people from specific jurisdictions to use their apps. If you are not able to install the app, it is very likely that you will find information in the Terms and Conditions within the app itself or in its homepage. 

  - ⭐ **Tip:** Apps that are no longer working or actively maintained can still be downloadable from Google Play. In fact, they may still be installable and give you the impression that they still work. Looking for the Terms, usually found in small letters under account registration, you'll find that clicking the Terms opens a web browser to where the app actually stores the text or pdf file. 

  - More often than not, it is the homepage of the app - which can sometimes not be listed in the Google Play App description. This also gives us a clue for whether the app is still being maintained because once you click on the terms and you are presented with an error (usually, '404' or a 'Page cannot be found' error), this indicates that the app's developer has ceased maintaining the website domain and the app. 

On a final note. Please be careful when directly quoting from the Terms and Conditions or the User Agreement. Some of these include non-disclosure clauses and a liberal interpretation of copyright restrictions has led to some DMCA concerns on the website. It is advisable to paraphrase and just link to the document. 

### 3. The Homepage 

There's a lot that can be known when looking at the homepage footer of an app. We've found several apps that do not include the actual homepage in the Developer Contact section of Google Play. Some are even left blank. 

Fake apps tend to ignore these nuances and come up with plagirized Terms and Conditions that are very short. 

New apps made by a single developer usually use free hosting on websites such as WordPress, Blogspot, or Google Sites.

For most **custodial services**, you'll find several important telltale clues about the actual platform. 

**Custodial** providers that keep up with regulatory issuances from multiple jurisdictions usually have several links pertaining to legal compliances, regulations, and such. These often include: 

- The Terms and Conditions 
- Privacy Policy 
- Risk Warnings
- AML-KYC FATF compliances 
- Digital Asset Disclosures 
- An About Page 
- Security Disclosures
- Careers Page 

and more. 

The fewer of these you find at the footer, the less compliant an exchange is. 

**Self-custodial platforms** usually have less. In lieu of the legal documents, the source-available apps contain technical documents and descriptions. Quintessential to this is the GitHub link to the actual app repository.  

  - ⚠️ **Warning!** Some scammers add a little extra effort by creating a GitHub page to bolster their claim of being source-available. But there are clues that can be found to unmask these. Their repositories are usually blank with barely any updates. They usually fork or clone repositories from other projects. If you look at the activity graph, there's barely any activity in it. 
  
#### CFD and Forex Platforms 

Apps that are often given the verdict of 'No Send/Receive' are often Cryptocurrency CFD (Contracts for Differences) and Forex platforms. The two are not mutually exclusive, however, and can sometimes have a mixture of functions. Some Forex platforms can provide cryptocurrency CFDs and a few cryptocurrency CFDs can also have cryptocurrency exchanges. 

If we are able to install and register with the platform, the first thing we look for is the deposit and withdrawal functions. Most of these platforms only allow traditional banking or electronic cash transfers as a medium for deposits and withdrawals. The common rule is, the withdrawal medium should be the same as the deposit medium. If this is the case, but the platform allows for the purchase of Bitcoin CFDs, then they are given a verdict of 'No Send/Receive.''
  
### 4. Support Page and Zendesk

Legitimate providers almost always provide several modes to communicate with them. The most common support functions include having a Zendesk account. This usually has a resource center where more technical information about an app and how it works can be found. This is also where the Frequently Asked Questions are located. 

If nothing on the page addresses the user's concern, Zendesk can also include customer support ticketing functions that ensure that the user's problem is being addressed and actually seen by a living person. 

Most security disclosures and announcements are also included in this. 

## Downloading the App 

Reviewing thousands of apps can be very risky. With thousands of apps, chances are there are a few that could contain malicious code. It is not advisable to use your personal device to install any of the apps that should be reviewed. But with that said, there are just some apps that contain so little information that we're just forced to install them. This is exacerbated by apps with a foreign origin and simple descriptions of "Buy Bitcoin in our app." The main gist is that some apps with these advertised functions can simply be apps that display numbers denominated with the BTC symbol but are actually just numbers on the screen. There are many schemes out there whose sole aim is to part the unsuspecting Bitcoiner from his stack. 

### Android Emulator 

The best and most efficient way we've come across when downloading apps is through the use of emulators. There are many out there, but two of the best thus far are the Android Studio emulator and the Windows/macOS-only BlueStacks. Android Studio however can take up quite a bit of resources so we procured a Windows machine to run BlueStacks 5 with Android Pie and Nougat. The only downside to running BlueStacks is there are apps that want a really old version of Android. BlueStacks can only go back as far as Android 7. Moreover, there are apps that require turning on the lock screen, which as far as we know is not yet available on BlueStacks. 

Sometimes, there are apps that restrict downloads based on the user's location. In those cases, and in cases where we really have to download the app, we google for the APK with the same version currently published on Google Play. 

### Registration 

Registration is one of the most time-consuming aspects of testing the app. This is especially true for apps that haven't been updated in a while with SMS OTP verification that we don't ever receive! Sometimes these arrive 20+ minutes after we click on "Send Code". 

We use an alternate email address solely for this purpose. 

This is also made more difficult with apps that do not have English as the primary language. Oftentimes, English is not even included in the app. That's one more advantage of using BlueStacks since we could display the fields on a monitor and then take a picture using our mobile device to translate using Google Translate. Yandex's OCR function is also a good alternative.

  - ⭐ **Tip:** Apps that are self-custodial usually don't have a registration screen. Take note, however, that this is NOT always the case. Self-custodial apps usually have two options after the splash logo is displayed and they are:
    
    - Create a New Wallet 
    - Import a Wallet 
        
  - Once you see these options, choosing one often shows you the 12 or 24-word seed phrases that you have to confirm. 
  
Registration can also follow afterward in some cases. 
  
#### When a phone number is needed for registration 

Sometimes, a geo-restricted app, would not only require KYC but also require a phone number with a specific country code. As such, we use web platforms that allow users to make use of temporary disposable phone numbers. Take note, however, that you should not use these numbers for apps you have an intention of putting real bitcoins. 

### Using Google Play App Reviews - and Scams

Google Play app reviews are hidden according to your geolocation most of the time. Sometimes they could also be totally useless. This is true for apps that hire people and pay them to make reviews for their apps. You'll see comments such as "Great App!", "Amazing!", "Good job developer!" and such. 

  - ⭐ **Tip:** You know for a fact that there are reviews on Google Play but somehow can't see them. In cases like this, you can append parameters to the Google Play URL. For example, Bitcoin.com.au does not display the reviews for us when the URL is:
      
    ```https://play.google.com/store/apps/details?id=au.com.bitcoin.mobileapp```
      
  - We then append ```&hl=en&gl=AU``` to make it:
      
    ```https://play.google.com/store/apps/details?id=au.com.bitcoin.mobileapp&hl=en&gl=AU```
      
  - This should now show the Google Play Reviews and Ratings even if you are not in Australia.

So why do we use Google Play app reviews?

We use them to warn users of potential and suspected wrongdoing. There are legal implications to outright naming an app a scam or a rug pull. We've seen this recently when ZachXBT was sued in a defamation lawsuit. 

The formatting we apply when quoting reviews from Google Play is: 


```

> [name](link to review)<br>
  ★☆☆☆☆ Month Day, Year <br>
       Review

```

We usually include the two most detailed reviews on Google Play. 

It is only when media reports are cited or when multiple social media sources can corroborate, that we put a warning box detailing a scam or a red flag.  

We format these warnings as: 

```

<div class="alertBox"><div>⚠️ **Warning!** details here
</div> </div>

```

### Conclusion 

There are many other details that we can use to serve as guidelines in analyzing Android apps. Most of these could be found in the comments section of recently approved **[Merge Requests](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/merge_requests)** on WalletScrutiny's GitLab page. 

This only covered a few of the verdicts and some of the recommended guidelines. 

Take note that some apps have the covert and deliberate intention to defraud users and thus may take on the appearance of "legitimacy". Oftentimes, we have to evolve these guidelines to sufficiently put users in notice to always be vigilant and scrutinizing.

  





 


