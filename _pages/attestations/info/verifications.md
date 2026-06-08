---
layout: archive
title: "User Created Build Verifications on Nostr"
permalink: /verifications/
---

<style>
.p-pre-code {
    margin-bottom: 0;
}

pre {
    margin-top: 0.25em;
}

.nav-buttons-container {
    margin-bottom: 20px; 
    display: flex; 
    align-items: center; 
    justify-content: center; 
    gap: 15px;
}

@media (max-width: 768px) {
    .nav-buttons-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
        padding: 0 15px;
    }
    
    .nav-buttons-container a {
        width: 100%;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        box-sizing: border-box;
    }
}
</style>

<div class="nav-buttons-container">
    <a href="/assets/" class="btn btn-medium btn-success">Asset Registry</a>
    <a href="/verifiers/" class="btn btn-medium btn-success">Top Build Verifiers</a>
    <a href="/new_asset/" class="btn btn-medium btn-success">Register New Asset</a>
    <a href="/new_verification/" class="btn btn-medium btn-success">New Verification</a>
</div>

<div class="verifications-intro">
    <h2>What are User Created Nostr Build Verifications?</h2>

    <p>Nostr Build Verifications represent a novel approach to software binary build verification, enabling users to independently reproduce binaries from source code and share their findings with the community. This system leverages the decentralized Nostr network to store and distribute verification messages.</p>

    <p>When users compile software from source code and verify that the resulting binary matches or doesn't match the distributed version, they can create a build verification - a signed message confirming or denying this verification. These build verifications are then broadcast through the Nostr network, creating a public record of independent build verifications that other users can see and reference. Users are able to upload the scripts used to reproduce each binary and the output of the execution, so that other users can verify the reproducibility of the binary themselves.</p>

    <p>This community-driven build verification system helps enhance software security and transparency by:</p>

    <ul>
        <li>Allowing users to verify software build authenticity independently</li>
        <li>Creating a decentralized record of build verifications</li>
        <li>Making binary build verification results publicly accessible</li>
        <li>Building trust through community participation</li>
    </ul>

    <p>Some verifications are created automatically by the <a href="/automated-build-server/">WalletScrutiny Automated Build Server</a>, which re-runs community-published <code>build.sh</code> scripts when new binaries are registered. If you want your script to be eligible for automatic runs, see the <a href="/automated-build-server/">ABS documentation</a> and the <a href="https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/docs/script_verifications.md" target="_blank" rel="noopener noreferrer">script rules on GitLab</a>.</p>
</div>

<div class="getting-started">
    <h2>Where to Start?</h2>
    <p>There are four main ways to explore build verifications in our system:</p>
    <ul style="margin-bottom: 0;">
        <li><a href="/assets/">Browse the Asset Registry</a> - View all the wallet binaries that have been added to our system</li>
        <li><a href="/verifiers/">Top Build Verifiers</a> - See the most active community members who verify wallet builds</li>
        <li>Use the Wallet Search - Find build verifications for a specific Bitcoin wallet using our search feature in the navigation bar at the top</li>
        <li>Verify a specific binary - Use a computer to drop your binary file in our verification tool to check existing build verifications or create new ones.</li>
    </ul>

    {% include /verifications/dragAndDropArea.html %}

    <p>If the <b>binary is new to the network</b>, you'll be prompted to register it providing some additional information so testers know where it came from and for which product it is.</p>
    <p>If the <b>binary is already known</b>, you'll be able to view existing build verifications, access build instructions, or create your own build verification.</p>
    <p class="note">Note that not all Bitcoin wallets have build verifications available, as this is a community-driven effort.</p>
</div>

<div class="prerequisites">
    <h2>Prerequisites</h2>
    <p>If you only want to <b>view existing verifications</b>, you don't need any additional tools.</p>
    <p>To <b>contribute new binary information or create verifications</b>, you'll need a Nostr browser extension. Learn more about <a href="/nostr/">getting started with Nostr</a>.</p>
</div>

<div class="calculate-hash">
    <h2>How can I calculate the SHA256 hash of a binary?</h2>
    <p>To register a new binary, you'll need its SHA256 hash. You have two options to calculate it:</p>

    <h3>Option 1: Using Our Tool</h3>
    <p>Simply use a computer (mobile not supported for now) and drag and drop your file into the drop zone below, and we'll calculate the SHA256 hash for you automatically.</p>

    {% include /verifications/dragAndDropArea.html %}

    <h3>Option 2: Using Command Line Tools</h3>
    <p class="p-pre-code">On Linux or macOS, open a terminal and run:</p>
    <pre><code>sha256sum path/to/your/file</code></pre>
    <p class="p-pre-code">On Windows, use:</p>
    <pre><code>certutil -hashfile path\to\your\file SHA256</code></pre>
</div>
