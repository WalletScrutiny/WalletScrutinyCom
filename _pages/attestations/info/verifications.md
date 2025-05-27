---
layout: archive
title: "User Created Verifications on Nostr"
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

<script type="text/javascript" src="{{'/dist/verifications.bundle.min.js' | relative_url }}"></script>

<link rel="stylesheet" href="{{ base_path }}/assets/css/verifications.css">

<div class="nav-buttons-container">
    <a href="/assets/" class="btn btn-medium btn-success">Asset Registry</a>
    <a href="/verifiers/" class="btn btn-medium btn-success">Top Build Verifiers</a>
    <a href="/new_asset/" class="btn btn-medium btn-success">Register New Asset</a>
    <a href="/new_verification/" class="btn btn-medium btn-success">New Verification</a>
</div>

<div class="verifications-intro">
    <h2>What are User Created Nostr Verifications?</h2>

    <p>Nostr Verifications represent a novel approach to software binary verification, enabling users to independently reproduce binaries from source code and share their findings with the community. This system leverages the decentralized Nostr network to store and distribute verification messages.</p>

    <p>When users compile software from source code and verify that the resulting binary matches or doesn't match the distributed version, they can create a verification - a signed message confirming or denying this verification. These verifications are then broadcast through the Nostr network, creating a public record of independent verifications that other users can see and reference.</p>

    <p>This community-driven verification system helps enhance software security and transparency by:</p>

    <ul>
        <li>Allowing users to verify software authenticity independently</li>
        <li>Creating a decentralized record of verifications</li>
        <li>Making binary verification results publicly accessible</li>
        <li>Building trust through community participation</li>
    </ul>
</div>

<div class="getting-started">
    <h2>Where to Start?</h2>
    <p>There are four main ways to explore verifications in our system:</p>
    <ul style="margin-bottom: 0;">
        <li><a href="/assets/">Browse the Asset Registry</a> - View all the wallet binaries that have been added to our system</li>
        <li><a href="/verifiers/">Top Build Verifiers</a> - See the most active community members who verify wallet binaries</li>
        <li>Use the Wallet Search - Find verifications for a specific Bitcoin wallet using our search feature in the navigation bar at the top</li>
        <li>Verify a specific binary - Use a computer to drop your binary file in our verification tool to check existing verifications or create new ones.</li>
    </ul>

    {% include /verifications/dragAndDropArea.html %}

    <p>If the <b>binary is new to the network</b>, you'll be prompted to register it providing some additional information so testers know where it came from and for which product it is.</p>
    <p>If the <b>binary is already known</b>, you'll be able to view existing verifications, access build instructions, or create your own verification.</p>
    <p class="note">Note that not all Bitcoin wallets have verifications available, as this is a community-driven effort.</p>
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

    <h3>Option 2: Using sha256sum (Command Line)</h3>
    <p class="p-pre-code">On Linux or macOS, open a terminal and run:</p>
    <pre><code>sha256sum path/to/your/file</code></pre>
    <p class="p-pre-code">On Windows, use:</p>
    <pre><code>certutil -hashfile path\to\your\file SHA256</code></pre>
</div>
