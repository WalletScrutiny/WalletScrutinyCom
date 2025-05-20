---
title: TwentyTwo Devices Portal Hardware Wallet
appId: twentytwo.portal
authors:
- danny
released: 2024-06-08
discontinued: 
updated: 2024-07-09
version: 0.3.1
binaries: 
dimensions:
- 140
- 65
- 5
weight: 30
provider: TwentyTwo Devices
providerWebsite: 
website: https://twenty-two.xyz/
shop: https://store.twenty-two.xyz/
country: IT
price: 89 EUR
repository: https://github.com/TwentyTwoHW/portal-software
issue: 
icon: twentytwo.portal.png
bugbounty: 
meta: ok
verdict: unreleased
appHashes: 
date: 2024-10-23
signer: 
twitter: TwentyTwoHW
social: 
features: 

---

## Updates 2024-10-23

<iframe width="560" height="315" src="https://www.youtube.com/embed/iYFHqX9jo7Y?si=gJIEQ_Wd4Fi_9ZyA" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

**The device is still in pre-order**

## Device Description from the Provider 2024-07-30

> The first mobile-native hardware wallet: designed to keep your keys safe and seamlessly integrate into any mobile wallet app.
>
> Portal leverages NFC technology, the same standard used by contactless credit cards, to safely and effectively connect with any modern smartphone. During signing the device will walk you through all the relevant parts of the transaction and allow you to confirm it by simply pressing a button.
>
> Portal doesn't need cables or batteries: it's completely powered by the NFC.

## Analysis

It is integrated with {% include walletLink.html wallet='android/io.nunchuk.android' verdict='true' %}

**1. Can the private keys be created offline? - ✔️ Yes.**

This comes from the **[init.rs](https://github.com/TwentyTwoHW/portal-software/blob/c5a630090d53164d1d4b13fb03456519b1e113af/firmware/src/handlers/init.rs#L527)**. Displaying the seed on the screen is a [work-in-progress.](https://github.com/TwentyTwoHW/portal-software/issues/26)

```rust
pub async fn handle_generate_seed(
    num_words: model::NumWordsMnemonic,
    network: Network,
    password: Option<&str>,
    events: impl Stream<Item = Event> + Unpin,
    peripherals: &mut HandlerPeripherals,
) -> Result<CurrentState, Error> {
    let page = GeneratingMnemonicPage::new(num_words);
    page.init_display(&mut peripherals.display)?;
    page.draw_to(&mut peripherals.display)?;
    peripherals.display.flush()?;

    let mut entropy = [0u8; 32];
    let entropy = match num_words {
        model::NumWordsMnemonic::Words12 => &mut entropy[..16],
        model::NumWordsMnemonic::Words24 => &mut entropy[..32],
    };
    rand_chacha::rand_core::RngCore::fill_bytes(&mut peripherals.rng, entropy);

    let descriptor = WalletDescriptor::make_bip84(network);

    let unverified_config = UnverifiedConfig {
        entropy: Entropy {
            bytes: alloc::vec::Vec::from(entropy).into(),
        },
        network,
        pair_code: password.map(ToString::to_string),
        descriptor,
        page: 0,
    };
    let unverified_config = save_unverified_config(unverified_config, peripherals).await?;
    display_mnemonic(unverified_config, events, peripherals).await
}
```

**2. Are the private keys shared? - ❌ No, the private keys are not shared to the companion app via NFC.**

 **[bitcoin.rs](https://github.com/TwentyTwoHW/portal-software/blob/c5a630090d53164d1d4b13fb03456519b1e113af/firmware/src/handlers/bitcoin.rs#L216)**

 Only the signed PSBT is transmitted via NFC to the companion app.

**3. Does the device display the receive address for confirmation? - ✔️ Yes.**

**4. Does the interface have a display screen and buttons which allows the user to confirm transaction details? - ✔️ Yes**

**5. Is it reproducible? - ❓**

This hardware device's firmware is **for verification**
