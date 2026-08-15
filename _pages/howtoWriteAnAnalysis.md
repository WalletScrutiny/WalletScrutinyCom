---
layout: archive
title: "How to Write an Analysis"
permalink: /howtoWriteAnAnalysis/
author_profile: false
---

<div class="guide-page">

<div class="guide-hero">
  <p class="guide-lead">
    Each product on WalletScrutiny is a Markdown file plus an icon under <code>images/wIcons/</code>.
  Mobile apps live in <code>_mobile/</code>; hardware, desktop, bearer tokens, and other products each have their own directory.
  This guide covers how to add a new entry and write its analysis.
  </p>
</div>

<div class="guide-actions">
  <a href="https://gitlab.com/walletscrutiny/walletScrutinyCom" class="btn btn-medium btn-success" target="_blank" rel="noopener noreferrer">GitLab repository</a>
  <a href="{{ site.baseurl }}/howtoContributeToWS/" class="btn btn-medium btn-success">More ways to contribute</a>
</div>

<div class="guide-section">
  <h2>Before you start</h2>
  <p>From the repository root, install dependencies and make sure your branch is up to date with <code>master</code>:</p>
  <pre><code>npm install
git checkout -b add-wallet-example-app</code></pre>
  <p class="guide-note">To resize icons you also need <strong>ImageMagick</strong> (<code>convert</code>, <code>compare</code>) and <strong>GNU parallel</strong> installed on your system.</p>
</div>

<div class="guide-section">
  <h2><i class="fab fa-google-play" aria-hidden="true"></i> Adding a new Android app</h2>

  <ol class="guide-steps">
    <li>
      <h3>1. Find the Google Play app ID</h3>
      <p>Open the app on Google Play and copy the <code>id</code> parameter from the URL.</p>
      <pre><code>https://play.google.com/store/apps/details?id=com.greenaddress.greenbits_android_wallet
                                              └───────────────────────────────────────┘
                                                               app ID</code></pre>
    </li>
    <li>
      <h3>2. Add the app with <code>addNewAndroidApps.mjs</code></h3>
      <p>Run the script from the repository root. It fetches Play Store metadata, creates <code>_mobile/&lt;appId&gt;.md</code>, and downloads the icon.</p>
      <pre><code>node addNewAndroidApps.mjs com.greenaddress.greenbits_android_wallet</code></pre>
      <p>Add several apps in one command by passing multiple IDs:</p>
      <pre><code>node addNewAndroidApps.mjs com.foo.wallet com.bar.btc</code></pre>
      <p>If the wallet file already exists, the script refreshes its metadata instead of creating a duplicate.</p>
    </li>
    <li>
      <h3>3. Generate icon sizes with <code>updateImages.sh</code></h3>
      <p>The add script saves a full-size icon under <code>images/wIcons/android/</code>. Run the image script to create the <code>small/</code> and <code>tiny/</code> variants used on the site:</p>
      <pre><code>./updateImages.sh</code></pre>
    </li>
  </ol>
</div>

<div class="guide-section">
  <h2><i class="fab fa-apple" aria-hidden="true"></i> Adding a new iPhone app</h2>

  <ol class="guide-steps">
    <li>
      <h3>1. Find the App Store ID and country code</h3>
      <p>From an App Store URL, take the numeric ID after <code>/id</code> and the two-letter country code in the path.</p>
      <pre><code>https://apps.apple.com/us/app/blockstream-green/id1402243590
                       └┘                         └────────┘
                    country                      App Store ID</code></pre>
    </li>
    <li>
      <h3>2. Add the app with <code>addNewIphoneApps.mjs</code></h3>
      <p>Run the script from the repository root. It fetches App Store metadata, creates or updates <code>_mobile/&lt;bundleId&gt;.md</code>, and downloads the icon.</p>
      <p>Using the numeric App Store ID (recommended with country code):</p>
      <pre><code>node addNewIphoneApps.mjs us/1402243590</code></pre>
      <p>Or pass only the numeric ID:</p>
      <pre><code>node addNewIphoneApps.mjs 1402243590</code></pre>
      <p>If you already know the bundle ID:</p>
      <pre><code>node addNewIphoneApps.mjs io.blockstream.green</code></pre>
      <p>To add an iPhone block to an <em>existing</em> Android wallet file instead of creating a new one:</p>
      <pre><code>node addNewIphoneApps.mjs 1402243590 --merge-into com.greenaddress.greenbits_android_wallet</code></pre>
    </li>
    <li>
      <h3>3. Generate icon sizes with <code>updateImages.sh</code></h3>
      <p>Same as Android: icons land in <code>images/wIcons/iphone/</code>, then run:</p>
      <pre><code>./updateImages.sh</code></pre>
    </li>
  </ol>
</div>

<div class="guide-section">
  <h2><i class="fas fa-layer-group" aria-hidden="true"></i> Adding hardware, desktop, bearer, and other products</h2>
  <p>There are no helper scripts for these categories. The usual workflow is to copy an existing review from the matching directory, rename it, and edit the contents:</p>

  <ol class="guide-steps">
    <li>
      <h3>1. Pick a similar product to copy</h3>
      <p>Choose a wallet in the same category with a comparable front matter. For example:</p>
      <ul>
        <li><strong>Hardware:</strong> <code>_hardware/trezorOne.md</code></li>
        <li><strong>Desktop:</strong> <code>_desktop/bisq2.md</code></li>
        <li><strong>Bearer tokens:</strong> <code>_bearer/bitbills.md</code></li>
        <li><strong>Other:</strong> <code>_others/ext.blockchair.md</code></li>
      </ul>
    </li>
    <li>
      <h3>2. Create your new file</h3>
      <p>Copy the template file, give it a short descriptive filename, and update the front matter (<code>title</code>, <code>appId</code>, <code>website</code>, <code>repository</code>, <code>verdict</code>, and so on).</p>
      <pre><code>cp _hardware/trezorOne.md _hardware/my-new-wallet.md</code></pre>
    </li>
    <li>
      <h3>3. Add an icon</h3>
      <p>Place a square PNG in the matching folder under <code>images/wIcons/</code> — for example <code>images/wIcons/hardware/my-new-wallet.png</code> — and set the <code>icon:</code> field in the front matter to match.</p>
      <pre><code>./updateImages.sh</code></pre>
    </li>
  </ol>

  <p>Adding an entirely new platform category (not just a new product) requires extra Jekyll configuration. See <a href="{{ site.baseurl }}/howtoAddNewPlatform/">How to Add a New Platform</a> for that.</p>
</div>

<div class="guide-section">
  <h2><i class="fas fa-pen" aria-hidden="true"></i> Writing the analysis</h2>
  <p>Once the file exists — whether created by a script or copied manually — open it and complete the review:</p>
  <ul>
    <li>Set <code>verdict</code> (for example <code>wip</code> while you work, then the final verdict).</li>
    <li>Fill in shared fields such as <code>authors</code>, <code>website</code>, and <code>repository</code>.</li>
    <li>Write the analysis in Markdown below the second <code>---</code> delimiter.</li>
    <li>For mobile wallets, use separate <code>## Android</code> and <code>## iPhone</code> sections when the file covers both platforms.</li>
  </ul>
  <p>See <a href="https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/_mobile/com.greenaddress.greenbits_android_wallet.md" target="_blank" rel="noopener noreferrer">Blockstream Green</a> for a mobile example, or <a href="https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/_hardware/trezorOne.md" target="_blank" rel="noopener noreferrer">Trezor One</a> for hardware, then open a merge request on GitLab.</p>
</div>

<div class="infoBox guide-note">
  <p>
  Need field-by-field definitions or advanced procedures?
  See the <a href="https://gitlab.com/walletscrutiny/walletScrutinyCom/-/wikis/How-to-Contribute-to-WalletScrutiny" target="_blank" rel="noopener noreferrer">WalletScrutiny GitLab wiki</a>
  or ask in the project issue tracker.
  </p>
</div>

</div>
