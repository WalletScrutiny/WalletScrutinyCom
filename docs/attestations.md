# (WIP) Binary files and Nostr Attestations

This page defines how we're going to create the functionality so users can look for reproducibility of binaries for the different versions of desktop wallets (Windows, MacOS, Debian, RedHat, AppImage, ...).

Initial requirements from [here](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/527#note_2195529488) and [here](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/572).

## Trust

The way to trust anonymous people that put a (free, without proof-of-work) note on Nostr about a specific binary being reproducible is giving them some kind of rating. For this, the only way is enabling a mechanism so other people can follow the same steps that they followed and looking at if they could also reproduce the binary, and endorsing the original reporter also with a Nostr note. This way we can give more weight to people that correctly reported the reproducibility of binaries.

This can be done at different levels. For example:
- If your attestation about a binary have been reproduced by others, then it surely can be trusted (*).
- If your attestation about OTHER binaries have been reproduced by others, you're a (more) trusted identity than other identity that no other person has endorsed.

(*) For us to trust the "Endorsements", the Nostr identity should have some minimal requirements (like having message > x months old, or be followed by > x persons), or else we could end up with a situation where the attester created new identities to endorse his own attestations.

## The Leaderboard
- Attestators with more verifications will be at the top of the Leaderboard so other users can donate (zap?) to them.
- At the end of the month, WS could even use a small amount (100.000 sats?) to pay the 3 most verified attestators.

## The concept of "Admin"

An admin must be defined by his Nostr npub so he can veto random information submited by an anonymous user. For example, a user (Nostr identity) could submit an "asset" event for a binary that doesn't exist, or do attestations in a wrong way, so his information cannot be trusted. If that's the case, we must have a way to "remove" the information from the UI. It could be an internal list of notes that shouldn't be trusted, but it's better if this is incorporated into the protocol, so if someone wants to implement the same functionality in a Nostr client, they can also trust "the Wallet Scrutiny Admin" and get the "ban" events also from Nostr.

The Admin will be defined by a Nostr npub. In our case, the Admin user could be the WalletScrutiny Nostr account, or another account created for this purpose.

## User Interface
We'll have new pages on the WS site:
- A page to search for a binary, pasting its sha256 or dropping the binary there.
- A page where users can send the information from a binary to Nostr to create the "Asset" in case it doesn't exist already.
- A page where we display assets (binaries) that users have published so others can try to reproduce from code.
- A Leaderboard so attestators are ordered from most to less trusted (based on "Endorsements" from other users). Other users can donate to the more trusted/endorsed attestators.

When displaying "reproducible/non reproducible" inside each wallet's page, trusted reviewers take precedence and are displayed by default (with some kind of badge?). Other non-endorsed reviewers are displayed in a different way (lighter colors) or hidden by default.

File-drop UI being implemented here https://gitlab.com/walletscrutiny/walletScrutinyCom/-/merge_requests/784

## Search functionality

Most customers are probably going to search for reproducibility in the current way (with the name of the wallet), but new search methods will be added:
- Search using binary file hash (sha256)
- Search using binary file name or download url

## Nostr Events based on current nips

After talking with Franzap from ZapStore, he pointed me to [nip-51](https://github.com/nostr-protocol/nips/blob/master/51.md) and [nip-94](https://github.com/nostr-protocol/nips/blob/master/94.md). Using those, we would have something like this:

### Application release ([nip-51](https://github.com/nostr-protocol/nips/blob/master/51.md) / kind 30063)
```
{
  "id": "567b41fc9060c758c4216fe5f8d3df7c57daad7ae757fa4606f0c39d4dd220ef",
  "pubkey": "d6dc95542e18b8b7aec2f14610f55c335abebec76f3db9e58c254661d0593a0c",
  "created_at": 1695327657,
  "kind": 30063,
  "tags": [
    ["d", "ak8dy3v7"],
    ["i", "com.zeusln.zeus"],
    ["version", "0.9.2"],
    ["title", "ZEUS Wallet"],
    ["e", <event-id of a binary>], // Github Universal APK
    ["e", "..."], // Github arm64-v8a APK
    ["e", "..."], // Github armeabi-v7a APK
  ],
  "content": "ZEUS Wallet",
  "sig": "a9a4e2192eede77e6c9d24ddfab95ba3ff7c03fbd07ad011fff245abea431fb4d3787c2d04aad001cb039cb8de91d83ce30e9a94f82ac3c5a2372aa1294a96bd"
}
```

- Each `e` tag points to an event of kind 1063 (see below).
- This event would need to be updated each time a new binary is discovered by a user.

### Binaries ([nip-94](https://github.com/nostr-protocol/nips/blob/master/94.md) / kind 1063)

```
{
  "id": <event-id of a binary>,
  "kind": 1063,
  "tags": [
    ["url", "https://github.com/ZeusLN/zeus/releases/download/v0.9.2/zeus-v0.9.2-universal.apk"],
    ["m", "application/vnd.android.package-archive"],
    ["x", "deb318adc37cd2c44b3c429af56a76982c6a81dfdad1ea679c01d8184fc6a4fe"],
    ["ox", "deb318adc37cd2c44b3c429af56a76982c6a81dfdad1ea679c01d8184fc6a4fe"],
    ["size", <size of file in bytes>]    // optional
  ],
  "content": "com.zeusln.zeus - 0.9.2 - Universal APK",
}
```

### Attestations (kind = TBD)

```
{
  "id": "random_id_123",
  "kind": TBD,
  "tags": [
    ["e": <event-id of a binary>],
    ["status": "reproducible"],
    ["hidePreviousAtts": "1"] //  if previous attestations (by the same user, for the same version) should be hidden
  ],
  "content": "to explain what you did, or why you couldn't reproduce the binary",
  "script/procedure": "to explain how did you reproduce the binary so others can do the same",
}
```

- `binary` must match the id of the binary you're attesting to.

### Endorsements / Confirmations (kind = TBD)

This event serves to signal that you followed the directions of the attestator and you were also able/unable to reproduce the build.

```
{
  "id": "random_id_456",
  "kind": TBD,
  "tags": [
    ["attestation": "random_id_123"],
    ["positive": "0"]
  ],
  "content": "I don't get the same result as the attester. Got differences in file xx and yy"
}
```

- `attestation` must match the id of the Nostr event for the attestation that you tried to reproduce.
- `positive` is "1" if you could reproduce the issue, "0" if you couldn't
- `content` is to explain why you could/couldn't reproduce the issue

## Nostr Events (Simpler version, not based on any nip)

### Assets ("Hash Advertising") (kind = xxx)

```
{
   version,
   platform: the platform the binary is compiled for
   downloadUrl: full download url,
   binary_hash: sha256 of the binary
}
```

### Attestations (kind = yyy)

```
{
   binary_hash: sha256 of the asset (binary) that you tried to reproduce. Should match the one in the "assets" note,
   "status": the status of the attestation (states TBD),
   script/procedure: how did you reproduce the binary so others can do the same,
   notes: to explain what you did, or why you couldn't reproduce the binary,
   hidePreviousAtts: "1" if previous attestations (by the same user, for the same version) should be hidden
}
```

### Endorsements / Confirmations (kind = zzz)

This event serves to signal that you followed the directions of the attestator and you were also able/unable to reproduce the build.

```
{
   attestationId: the ID of the Nostr event for the attestation that you tried to reproduce
   positive: "1" if you could reproduce the issue, "0" if you couldn't,
   notes: to explain something
}
```

## Examples (for the simpler version, not based on any nip)

### Assets ("Hash Advertising")

[nip-94](https://github.com/nostr-protocol/nips/blob/master/94.md) can be used for this.

```
{
   "version": "2.0.0",
   "platform": "Linux (Intel/AMD) (Ubuntu/Debian)",
   downloadUrl: "https://github.com/sparrowwallet/sparrow/releases/download/2.0.0/sparrow_2.0.0-1_amd64.deb",
   binary_hash: "e157c49b66357984bda58c11b37311ca4d1767bb430eab6d4bfc5dfe489850d7"
}
```

### Attestations

```
{
   "binary_hash": "e157c49b66357984bda58c11b37311ca4d1767bb430eab6d4bfc5dfe489850d7",
   "status": "not-reproducible",
   "script/procedure": TBD,
   "notes": "Imposible to reproduce, compiler not available to the public"
}
```

```
{
   "binary_hash": "e157c49b66357984bda58c11b37311ca4d1767bb430eab6d4bfc5dfe489850d7",
   "status": "reproducible",
   "script/procedure": TBD,
   "notes": "Binary reproduced, only 2 files related with signing are different",
   "hidePreviousAtts": "1"
}
```

(this 2 attestations should be ordered by the date contained in the Nostr event, so the newer one is the valid one. TBD if we can trust the `created_at` field for this purpose).

### Endorsements / Confirmations

This event serves to signal that you followed the directions of the attestator and you were also able/unable to reproduce the build.

```
{
   attestationId: "8r47238940abc32950917841def423740192834210abc473",
   positive: "1",
   notes: "I followed the procedure and I had the same result, thanks"
}
```

## Storage
In both cases, blossom or standard, we must make efforts to deter spam or people looking for free-to-use storage space. We could limit file extensions, file sizes, but maybe more is needed. Edit: Probably easier to use @Giszmo idea: "check for the presence of the nostr event and delete if none is found automatically and manually if we find out somebody bothered to use this service with fake nostr events".

I think there is no point in implementing a blossom server ourselves when there is an open-source software (nostrcheck-server, check below) doing that. We can contribute if some needed feature is not present.

- Blossom-based
   - Self-hosted: [nostrcheck-server](https://github.com/quentintaranpino/nostrcheck-server) has an admin page to manage files, identities, etc. and have an API.
   - Paid-based (can be paid by WS? I think it can't) - $0.05/GB/month: [Stallite CDN](https://cdn.satellite.earth/)

- Standard server
   - Self-hosted
   - [BlackBlaze](https://www.backblaze.com/cloud-storage/pricing) style

## To Be Defined
- Nostr events will be loaded online, or loaded by a script before generating the static page?
- What's the best way for users to share their scripts or methodologies that they used to reproduce/not-reproduce the asset?
- What are the different status that can have an attestation?
- Nostr's `created_at` cannot be trusted to order attestations, but is there any other way?
- Should we save the events in Gitlab or some other place in case relays are shut down?
- The WS Admin should be able to modify user's asset reporting? For example, if the user put into a binary "Linux", but it's better to put "Linux (Intel/AMD) (Ubuntu/Debian)" to differenciate from other binaries, we should be able to change it?
- What relays should we send events to?  relay.zap.store must be there for sure

## ToDo
- Look for a better term than "attestations", "attestators"? Reviewers?
- Create "Guide for attestators" based on current guides Gitlab's wiki and the WS site.