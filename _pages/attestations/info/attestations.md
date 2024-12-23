---
layout: archive
title: "User Created Attestations on Nostr"
permalink: /attestations/
---

<style>
.drop-zone {
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 10px;
    margin: 0 auto;
    max-width: 300px;
}

.drop-placeholder {
    background-color: #f5f5f5;
    padding: 20px;
    text-align: center;
    border-radius: 4px;
}

.drop-placeholder p {
    margin: 0;
    color: #666;
    font-size: 1.1em;
}

.p-pre-code {
    margin-bottom: 0;
}

pre {
    margin-top: 0.25em;
}
</style>

<div class="attestations-intro">
    <h2>What are User Created Nostr Attestations?</h2>
    
    <p>Nostr Attestations represent a novel approach to software binary verification, enabling users to independently reproduce binaries from source code and share their findings with the community. This system leverages the decentralized Nostr network to store and distribute verification messages.</p>

    <p>When users compile software from source code and verify that the resulting binary matches or doesn't match the distributed version, they can create an attestation - a signed message confirming or denying this verification. These attestations are then broadcast through the Nostr network, creating a public record of independent verifications that other users can see and reference.</p>

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
    <p>There are four main ways to explore attestations in our system:</p>
    <ul style="margin-bottom: 0;">
        <li><a href="/assets/">Browse Latest Assets</a> - View all the wallet binaries that have been added to our system</li>
        <li><a href="/attestators/">Top Attestators</a> - See the most active community members who verify wallet binaries</li>
        <li>Use the Wallet Search - Find attestations for a specific Bitcoin wallet using our search feature in the navigation bar at the top</li>
        <li>Verify a specific binary - Drop your binary file in our verification tool to check existing attestations or create new ones:</li>
    </ul>
    <div class="drop-zone">
        <div class="drop-placeholder">
            <p>Drop it here</p>
        </div>
    </div>
    <p>If the <b>binary is new to the network</b>, you'll be prompted to provide some additional information to register it.</p>
    <p>If the <b>binary is already known</b>, you'll be able to view existing attestations, access build instructions, and create your own attestation.</p>
    <p class="note">Note: Not all Bitcoin wallets may have attestations available, as this is a community-driven effort and relatively new verification system.</p>
</div>

<div class="prerequisites">
    <h2>Prerequisites</h2>
    <p>If you only want to <b>view existing attestations</b>, you don't need any additional tools.</p>
    <p>To <b>contribute new binary information or create attestations</b>, you'll need a Nostr browser extension. Learn more about <a href="/nostr/">getting started with Nostr</a>.</p>
</div>

<div class="calculate-hash">
    <h2>How can I calculate the SHA256 hash of a binary?</h2>
    <p>To register a new binary, you'll need its SHA256 hash. You have two options to calculate it:</p>

    <h3>Option 1: Using Our Tool</h3>
    <p>Simply drag and drop your file into the drop zone above, and we'll calculate the SHA256 hash for you automatically.</p>
    <div class="drop-zone">
        <div class="drop-placeholder">
            <p>Drop it here</p>
        </div>
    </div>

    <h3>Option 2: Using sha256sum (Command Line)</h3>
    <p class="p-pre-code">On Linux or macOS, open a terminal and run:</p>
    <pre><code>sha256sum path/to/your/file</code></pre>
    <p class="p-pre-code">On Windows, use:</p>
    <pre><code>certutil -hashfile path/to/your/file SHA256</code></pre>
</div>

