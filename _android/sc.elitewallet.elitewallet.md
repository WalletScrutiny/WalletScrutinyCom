---
wsId: eliteWallet
title: Elite Wallet
altTitle: 
authors:
- danny
users: 5000
appId: sc.elitewallet.elitewallet
appCountry: 
released: 2022-11-22
updated: 2024-03-25
version: 1.3.1
stars: 4.3
ratings: 
reviews: 3
size: 
website: https://elitewallet.sc
repository: https://github.com/Elite-Labs/EliteWallet
issue: https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/497
icon: sc.elitewallet.elitewallet.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2024-05-01
signer: 
reviewArchive: 
twitter: EliteWallet
social:
- https://t.me/elite_wallet
- https://www.reddit.com/user/EliteTechnologies
redirect_from: 
developerName: Elite Lab
features: 

---

## App Description from Google Play

> Elite Wallet respects your privacy and allows you to safely store, exchange, and spend your Monero, Bitcoin, Litecoin, and Haven. Elite Wallet is focused on high privacy standards.
>
> Features of Elite Wallet:
>
> - Completely noncustodial and open-source. Your keys, your coins
> - Easily exchange between BTC, LTC, XMR, and dozens of other cryptocurrencies
> - Buy Bitcoin/Litecoin with credit/debit/bank and sell Bitcoin by bank transfer
> - Create multiple Bitcoin, Litecoin, Monero, and Haven wallets
> - You control your own seed and keys, including your Monero private view key

## Analysis 

- The app's homepage is currently offline, but is available via [archive.org](https://web.archive.org/web/20230305015316/https://elitewallet.sc/)
- We successfully installed the app, and it describes itself as:
  > *Awesome wallet for Monero, bitcoin, Litecoin, and Haven*
  > - With standard anonymity, no proxy server is used. 
  > - With advanced anonymity, Elite proxy server is used to anonymize internet traffic
  > - Elite anonymity uses a custom proxy server to anonymize internet traffic
- We tested standard anonymity and created a wallet.
- We assigned a 4-digit pin.
- We chose Bitcoin (Electrum) as the wallet currency and assigned 'test' as the wallet name.
- The 24-word seed phrases were provided.
- We were provided with a Bech32 BTC address
- The seed phrases can be backed-up via the security and backup settings.

## Review

We were able to build the apk and compare it with a downloaded version from Google Play and there is a substantial amount of diffs.

```
$ diff -r fromBuild fromOfficial
Binary files fromBuild/AndroidManifest.xml and fromOfficial/AndroidManifest.xml differ
Binary files fromBuild/assets/flutter_assets/AssetManifest.bin and fromOfficial/assets/flutter_assets/AssetManifest.bin differ
diff -r fromBuild/assets/flutter_assets/AssetManifest.json fromOfficial/assets/flutter_assets/AssetManifest.json
1c1
< {"assets/animation/anim1.json":["assets/animation/anim1.json"],"assets/animation/anim2.json":["assets/animation/anim2.json"],"assets/animation/anim3.json":["assets/animation/anim3.json"],"assets/bitcoin_cash_electrum_server_list.yml":["assets/bitcoin_cash_electrum_server_list.yml"],"assets/bitcoin_electrum_server_list.yml":["assets/bitcoin_electrum_server_list.yml"],"assets/ethereum_server_list.yml":["assets/ethereum_server_list.yml"],"assets/faq/faq_de.json":["assets/faq/faq_de.json"],"assets/faq/faq_en.json":["assets/faq/faq_en.json"],"assets/faq/faq_es.json":["assets/faq/faq_es.json"],"assets/faq/faq_fr.json":["assets/faq/faq_fr.json"],"assets/faq/faq_hi.json":["assets/faq/faq_hi.json"],"assets/faq/faq_ja.json":["assets/faq/faq_ja.json"],"assets/faq/faq_ko.json":["assets/faq/faq_ko.json"],"assets/faq/faq_nl.json":["assets/faq/faq_nl.json"],"assets/faq/faq_pl.json":["assets/faq/faq_pl.json"],"assets/faq/faq_pt.json":["assets/faq/faq_pt.json"],"assets/faq/faq_ru.json":["assets/faq/faq_ru.json"],"assets/faq/faq_uk.json":["assets/faq/faq_uk.json"],"assets/faq/faq_zh.json":["assets/faq/faq_zh.json"],"assets/fonts/Lato-Bold.ttf":["assets/fonts/Lato-Bold.ttf"],"assets/fonts/Lato-Medium.ttf":["assets/fonts/Lato-Medium.ttf"],"assets/fonts/Lato-Regular.ttf":["assets/fonts/Lato-Regular.ttf"],"assets/fonts/Lato-Semibold.ttf":["assets/fonts/Lato-Semibold.ttf"],"assets/haven_node_list.yml":["assets/haven_node_list.yml"],"assets/images/Telegram.png":["assets/images/Telegram.png","assets/images/3.0x/Telegram.png","assets/images/2.0x/Telegram.png"],"assets/images/Twitter.png":["assets/images/Twitter.png","assets/images/3.0x/Twitter.png","assets/images/2.0x/Twitter.png"],"assets/images/aave_icon.png":["assets/images/aave_icon.png"],"assets/images/ada.png":["assets/images/ada.png"],"assets/images/ada_icon.png":["assets/images/ada_icon.png"],"assets/images/address_book_icon.png":["assets/images/address_book_icon.png"],"assets/images/advanced_anonymity.png":["assets/images/advanced_anonymity.png"],"assets/images/airplane.png":["assets/images/airplane.png"],"assets/images/ape_icon.png":["assets/images/ape_icon.png"],"assets/images/app_logo.png":["assets/images/app_logo.png"],"assets/images/arb_icon.png":["assets/images/arb_icon.png"],"assets/images/arrow_bottom_elite_green.png":["assets/images/arrow_bottom_elite_green.png","assets/images/3.0x/arrow_bottom_elite_green.png","assets/images/2.0x/arrow_bottom_elite_green.png"],"assets/images/arrow_bottom_purple_icon.png":["assets/images/arrow_bottom_purple_icon.png"],"assets/images/avaxc_icon.png":["assets/images/avaxc_icon.png"],"assets/images/avdo_icon.png":["assets/images/avdo_icon.png"],"assets/images/back_arrow.png":["assets/images/back_arrow.png","assets/images/3.0x/back_arrow.png","assets/images/2.0x/back_arrow.png"],"assets/images/back_arrow_dark_theme.png":["assets/images/back_arrow_dark_theme.png","assets/images/3.0x/back_arrow_dark_theme.png","assets/images/2.0x/back_arrow_dark_theme.png"],"assets/images/back_vector.png":["assets/images/back_vector.png","assets/images/3.0x/back_vector.png","assets/images/2.0x/back_vector.png"],"assets/images/backup.png":["assets/images/backup.png","assets/images/3.0x/backup.png","assets/images/2.0x/backup.png"],"assets/images/badge_discount.png":["assets/images/badge_discount.png"],"assets/images/bat_icon.png":["assets/images/bat_icon.png"],"assets/images/bch.png":["assets/images/bch.png"],"assets/images/bch_icon.png":["assets/images/bch_icon.png"],"assets/images/birthday_cake.png":["assets/images/birthday_cake.png"],"assets/images/bitcoin.png":["assets/images/bitcoin.png","assets/images/3.0x/bitcoin.png","assets/images/2.0x/bitcoin.png"],"assets/images/bitcoin_icon.png":["assets/images/bitcoin_icon.png"],"assets/images/bitcoin_menu.png":["assets/images/bitcoin_menu.png","assets/images/3.0x/bitcoin_menu.png","assets/images/2.0x/bitcoin_menu.png"],"assets/images/bitmap.png":["assets/images/bitmap.png","assets/images/3.0x/bitmap.png","assets/images/2.0x/bitmap.png"],"assets/images/bnb.png":["assets/images/bnb.png"],"assets/images/bnb_icon.png":["assets/images/bnb_icon.png"],"assets/images/bonk_icon.png":["assets/images/bonk_icon.png"],"assets/images/btc.png":["assets/images/btc.png"],"assets/images/btt_icon.png":["assets/images/btt_icon.png"],"assets/images/buy.png":["assets/images/buy.png"],"assets/images/cake_icon.png":["assets/images/cake_icon.png"],"assets/images/card.png":["assets/images/card.png"],"assets/images/category.png":["assets/images/category.png"],"assets/images/change_now.png":["assets/images/change_now.png","assets/images/3.0x/change_now.png","assets/images/2.0x/change_now.png"],"assets/images/changenow.png":["assets/images/changenow.png"],"assets/images/close.png":["assets/images/close.png","assets/images/3.0x/close.png","assets/images/2.0x/close.png"],"assets/images/close_button.png":["assets/images/close_button.png","assets/images/3.0x/close_button.png","assets/images/2.0x/close_button.png"],"assets/images/close_button_dark_theme.png":["assets/images/close_button_dark_theme.png","assets/images/3.0x/close_button_dark_theme.png","assets/images/2.0x/close_button_dark_theme.png"],"assets/images/coins.png":["assets/images/coins.png","assets/images/3.0x/coins.png","assets/images/2.0x/coins.png"],"assets/images/comp_icon.png":["assets/images/comp_icon.png"],"assets/images/copy.png":["assets/images/copy.png"],"assets/images/copy_address.png":["assets/images/copy_address.png","assets/images/3.0x/copy_address.png","assets/images/2.0x/copy_address.png"],"assets/images/copy_content.png":["assets/images/copy_content.png","assets/images/3.0x/copy_content.png","assets/images/2.0x/copy_content.png"],"assets/images/cro_icon.png":["assets/images/cro_icon.png"],"assets/images/crypto_lock.png":["assets/images/crypto_lock.png","assets/images/3.0x/crypto_lock.png","assets/images/2.0x/crypto_lock.png"],"assets/images/crypto_lock_light.png":["assets/images/crypto_lock_light.png","assets/images/3.0x/crypto_lock_light.png","assets/images/2.0x/crypto_lock_light.png"],"assets/images/dai.png":["assets/images/dai.png"],"assets/images/dai_icon.png":["assets/images/dai_icon.png"],"assets/images/dash.png":["assets/images/dash.png"],"assets/images/dash_icon.png":["assets/images/dash_icon.png"],"assets/images/dcr_icon.png":["assets/images/dcr_icon.png"],"assets/images/delete_icon.png":["assets/images/delete_icon.png","assets/images/3.0x/delete_icon.png","assets/images/2.0x/delete_icon.png"],"assets/images/delivery.png":["assets/images/delivery.png"],"assets/images/desktop_transactions_outline_icon.png":["assets/images/desktop_transactions_outline_icon.png"],"assets/images/desktop_transactions_solid_icon.png":["assets/images/desktop_transactions_solid_icon.png"],"assets/images/dfx_dark.png":["assets/images/dfx_dark.png"],"assets/images/dfx_light.png":["assets/images/dfx_light.png"],"assets/images/digibyte.png":["assets/images/digibyte.png"],"assets/images/doge_icon.png":["assets/images/doge_icon.png"],"assets/images/down_arrow.png":["assets/images/down_arrow.png","assets/images/3.0x/down_arrow.png","assets/images/2.0x/down_arrow.png"],"assets/images/download.png":["assets/images/download.png"],"assets/images/dydx_icon.png":["assets/images/dydx_icon.png"],"assets/images/elite_anonymity.png":["assets/images/elite_anonymity.png"],"assets/images/elite_arrow.png":["assets/images/elite_arrow.png","assets/images/3.0x/elite_arrow.png","assets/images/2.0x/elite_arrow.png"],"assets/images/elite_logo.png":["assets/images/elite_logo.png","assets/images/3.0x/elite_logo.png","assets/images/2.0x/elite_logo.png"],"assets/images/elitewallet_android_icon.png":["assets/images/elitewallet_android_icon.png"],"assets/images/elitewallet_app_logo.png":["assets/images/elitewallet_app_logo.png"],"assets/images/elitewallet_icon_1024.png":["assets/images/elitewallet_icon_1024.png"],"assets/images/elitewallet_icon_120.png":["assets/images/elitewallet_icon_120.png"],"assets/images/elitewallet_icon_180.png":["assets/images/elitewallet_icon_180.png"],"assets/images/elitewallet_logo.png":["assets/images/elitewallet_logo.png"],"assets/images/emoji_popup.png":["assets/images/emoji_popup.png"],"assets/images/ens_icon.png":["assets/images/ens_icon.png"],"assets/images/eos.png":["assets/images/eos.png"],"assets/images/eos_icon.png":["assets/images/eos_icon.png"],"assets/images/eth.png":["assets/images/eth.png"],"assets/images/eth_icon.png":["assets/images/eth_icon.png"],"assets/images/exch.png":["assets/images/exch.png"],"assets/images/exchange.png":["assets/images/exchange.png","assets/images/3.0x/exchange.png","assets/images/2.0x/exchange.png"],"assets/images/exchange_icon.png":["assets/images/exchange_icon.png"],"assets/images/exolix.png":["assets/images/exolix.png"],"assets/images/eye.png":["assets/images/eye.png","assets/images/3.0x/eye.png","assets/images/2.0x/eye.png"],"assets/images/eye_action.png":["assets/images/eye_action.png","assets/images/3.0x/eye_action.png","assets/images/2.0x/eye_action.png"],"assets/images/eye_menu.png":["assets/images/eye_menu.png","assets/images/3.0x/eye_menu.png","assets/images/2.0x/eye_menu.png"],"assets/images/face.png":["assets/images/face.png","assets/images/3.0x/face.png","assets/images/2.0x/face.png"],"assets/images/filter.png":["assets/images/filter.png"],"assets/images/filter_button.png":["assets/images/filter_button.png","assets/images/3.0x/filter_button.png","assets/images/2.0x/filter_button.png"],"assets/images/filter_icon.png":["assets/images/filter_icon.png"],"assets/images/filter_light_button.png":["assets/images/filter_light_button.png","assets/images/3.0x/filter_light_button.png","assets/images/2.0x/filter_light_button.png"],"assets/images/firo_icon.png":["assets/images/firo_icon.png"],"assets/images/flags/are.png":["assets/images/flags/are.png"],"assets/images/flags/arg.png":["assets/images/flags/arg.png"],"assets/images/flags/aus.png":["assets/images/flags/aus.png"],"assets/images/flags/bgd.png":["assets/images/flags/bgd.png"],"assets/images/flags/bgr.png":["assets/images/flags/bgr.png"],"assets/images/flags/bra.png":["assets/images/flags/bra.png"],"assets/images/flags/cad.png":["assets/images/flags/cad.png"],"assets/images/flags/che.png":["assets/images/flags/che.png"],"assets/images/flags/chl.png":["assets/images/flags/chl.png"],"assets/images/flags/chn.png":["assets/images/flags/chn.png"],"assets/images/flags/col.png":["assets/images/flags/col.png"],"assets/images/flags/czk.png":["assets/images/flags/czk.png"],"assets/images/flags/deu.png":["assets/images/flags/deu.png"],"assets/images/flags/dnk.png":["assets/images/flags/dnk.png"],"assets/images/flags/egy.png":["assets/images/flags/egy.png"],"assets/images/flags/esp.png":["assets/images/flags/esp.png"],"assets/images/flags/eur.png":["assets/images/flags/eur.png"],"assets/images/flags/fra.png":["assets/images/flags/fra.png"],"assets/images/flags/gbr.png":["assets/images/flags/gbr.png"],"assets/images/flags/gha.png":["assets/images/flags/gha.png"],"assets/images/flags/gtm.png":["assets/images/flags/gtm.png"],"assets/images/flags/hau.png":["assets/images/flags/hau.png"],"assets/images/flags/hkg.png":["assets/images/flags/hkg.png"],"assets/images/flags/hrv.png":["assets/images/flags/hrv.png"],"assets/images/flags/hun.png":["assets/images/flags/hun.png"],"assets/images/flags/idn.png":["assets/images/flags/idn.png"],"assets/images/flags/ind.png":["assets/images/flags/ind.png"],"assets/images/flags/irn.png":["assets/images/flags/irn.png"],"assets/images/flags/isl.png":["assets/images/flags/isl.png"],"assets/images/flags/isr.png":["assets/images/flags/isr.png"],"assets/images/flags/ita.png":["assets/images/flags/ita.png"],"assets/images/flags/jpn.png":["assets/images/flags/jpn.png"],"assets/images/flags/kor.png":["assets/images/flags/kor.png"],"assets/images/flags/mar.png":["assets/images/flags/mar.png"],"assets/images/flags/mex.png":["assets/images/flags/mex.png"],"assets/images/flags/mmr.png":["assets/images/flags/mmr.png"],"assets/images/flags/mys.png":["assets/images/flags/mys.png"],"assets/images/flags/nga.png":["assets/images/flags/nga.png"],"assets/images/flags/nld.png":["assets/images/flags/nld.png"],"assets/images/flags/nor.png":["assets/images/flags/nor.png"],"assets/images/flags/nzl.png":["assets/images/flags/nzl.png"],"assets/images/flags/pak.png":["assets/images/flags/pak.png"],"assets/images/flags/phl.png":["assets/images/flags/phl.png"],"assets/images/flags/pol.png":["assets/images/flags/pol.png"],"assets/images/flags/prt.png":["assets/images/flags/prt.png"],"assets/images/flags/rou.png":["assets/images/flags/rou.png"],"assets/images/flags/rus.png":["assets/images/flags/rus.png"],"assets/images/flags/saf.png":["assets/images/flags/saf.png"],"assets/images/flags/sau.png":["assets/images/flags/sau.png"],"assets/images/flags/sgp.png":["assets/images/flags/sgp.png"],"assets/images/flags/swe.png":["assets/images/flags/swe.png"],"assets/images/flags/tha.png":["assets/images/flags/tha.png"],"assets/images/flags/tur.png":["assets/images/flags/tur.png"],"assets/images/flags/twn.png":["assets/images/flags/twn.png"],"assets/images/flags/ukr.png":["assets/images/flags/ukr.png"],"assets/images/flags/usa.png":["assets/images/flags/usa.png"],"assets/images/flags/ven.png":["assets/images/flags/ven.png"],"assets/images/flags/vnm.png":["assets/images/flags/vnm.png"],"assets/images/food.png":["assets/images/food.png"],"assets/images/frax_icon.png":["assets/images/frax_icon.png"],"assets/images/ftm_icon.png":["assets/images/ftm_icon.png"],"assets/images/gaming.png":["assets/images/gaming.png"],"assets/images/github.png":["assets/images/github.png","assets/images/3.0x/github.png","assets/images/2.0x/github.png"],"assets/images/global.png":["assets/images/global.png"],"assets/images/gmt_icon.png":["assets/images/gmt_icon.png"],"assets/images/grt_icon.png":["assets/images/grt_icon.png"],"assets/images/gtc_icon.png":["assets/images/gtc_icon.png"],"assets/images/gusd_icon.png":["assets/images/gusd_icon.png"],"assets/images/haven_logo.png":["assets/images/haven_logo.png"],"assets/images/haven_menu.png":["assets/images/haven_menu.png"],"assets/images/hbar_icon.png":["assets/images/hbar_icon.png"],"assets/images/header.png":["assets/images/header.png","assets/images/3.0x/header.png","assets/images/2.0x/header.png"],"assets/images/hnt_icon.png":["assets/images/hnt_icon.png"],"assets/images/home_screen_settings_icon.png":["assets/images/home_screen_settings_icon.png"],"assets/images/husd_icon.png":["assets/images/husd_icon.png"],"assets/images/kaspa_icon.png":["assets/images/kaspa_icon.png"],"assets/images/key.png":["assets/images/key.png","assets/images/3.0x/key.png","assets/images/2.0x/key.png"],"assets/images/key_menu.png":["assets/images/key_menu.png","assets/images/3.0x/key_menu.png","assets/images/2.0x/key_menu.png"],"assets/images/keysIco.png":["assets/images/keysIco.png","assets/images/3.0x/keysIco.png","assets/images/2.0x/keysIco.png"],"assets/images/kmd_icon.png":["assets/images/kmd_icon.png"],"assets/images/ldo_icon.png":["assets/images/ldo_icon.png"],"assets/images/litecoin-ltc_icon.png":["assets/images/litecoin-ltc_icon.png"],"assets/images/litecoin.png":["assets/images/litecoin.png","assets/images/3.0x/litecoin.png","assets/images/2.0x/litecoin.png"],"assets/images/litecoin_icon.png":["assets/images/litecoin_icon.png"],"assets/images/litecoin_img.png":["assets/images/litecoin_img.png"],"assets/images/litecoin_menu.png":["assets/images/litecoin_menu.png"],"assets/images/live_support.png":["assets/images/live_support.png"],"assets/images/load.png":["assets/images/load.png","assets/images/3.0x/load.png","assets/images/2.0x/load.png"],"assets/images/majesticbank.png":["assets/images/majesticbank.png"],"assets/images/mana_icon.png":["assets/images/mana_icon.png"],"assets/images/mastercard.png":["assets/images/mastercard.png"],"assets/images/matic_icon.png":["assets/images/matic_icon.png"],"assets/images/menu.png":["assets/images/menu.png"],"assets/images/menu_button.png":["assets/images/menu_button.png","assets/images/3.0x/menu_button.png","assets/images/2.0x/menu_button.png"],"assets/images/mini_search_icon.png":["assets/images/mini_search_icon.png"],"assets/images/mkr_icon.png":["assets/images/mkr_icon.png"],"assets/images/monero.png":["assets/images/monero.png","assets/images/3.0x/monero.png","assets/images/2.0x/monero.png"],"assets/images/monero.sc_android_icon.png":["assets/images/monero.sc_android_icon.png"],"assets/images/monero.sc_icon_1024.png":["assets/images/monero.sc_icon_1024.png"],"assets/images/monero.sc_icon_120.png":["assets/images/monero.sc_icon_120.png"],"assets/images/monero.sc_icon_180.png":["assets/images/monero.sc_icon_180.png"],"assets/images/monero.sc_logo.png":["assets/images/monero.sc_logo.png"],"assets/images/monero_icon.png":["assets/images/monero_icon.png"],"assets/images/monero_logo.png":["assets/images/monero_logo.png"],"assets/images/monero_menu.png":["assets/images/monero_menu.png","assets/images/3.0x/monero_menu.png","assets/images/2.0x/monero_menu.png"],"assets/images/moonpay-icon.png":["assets/images/moonpay-icon.png"],"assets/images/moonpay.png":["assets/images/moonpay.png"],"assets/images/moonpay_dark.png":["assets/images/moonpay_dark.png"],"assets/images/moonpay_light.png":["assets/images/moonpay_light.png"],"assets/images/more.png":["assets/images/more.png"],"assets/images/more_links.png":["assets/images/more_links.png"],"assets/images/morph.png":["assets/images/morph.png"],"assets/images/morph_icon.png":["assets/images/morph_icon.png","assets/images/3.0x/morph_icon.png","assets/images/2.0x/morph_icon.png"],"assets/images/nano.png":["assets/images/nano.png"],"assets/images/nano_icon.png":["assets/images/nano_icon.png"],"assets/images/near_icon.png":["assets/images/near_icon.png"],"assets/images/new_wallet.png":["assets/images/new_wallet.png","assets/images/3.0x/new_wallet.png","assets/images/2.0x/new_wallet.png"],"assets/images/nexo_icon.png":["assets/images/nexo_icon.png"],"assets/images/nodes.png":["assets/images/nodes.png","assets/images/3.0x/nodes.png","assets/images/2.0x/nodes.png"],"assets/images/nodes_menu.png":["assets/images/nodes_menu.png","assets/images/3.0x/nodes_menu.png","assets/images/2.0x/nodes_menu.png"],"assets/images/notification_icon.svg":["assets/images/notification_icon.svg"],"assets/images/onramper_dark.png":["assets/images/onramper_dark.png"],"assets/images/onramper_light.png":["assets/images/onramper_light.png"],"assets/images/open_book.png":["assets/images/open_book.png","assets/images/3.0x/open_book.png","assets/images/2.0x/open_book.png"],"assets/images/open_book_menu.png":["assets/images/open_book_menu.png","assets/images/3.0x/open_book_menu.png","assets/images/2.0x/open_book_menu.png"],"assets/images/oxt_icon.png":["assets/images/oxt_icon.png"],"assets/images/paste_button.png":["assets/images/paste_button.png"],"assets/images/paste_ios.png":["assets/images/paste_ios.png","assets/images/3.0x/paste_ios.png","assets/images/2.0x/paste_ios.png"],"assets/images/paxg_icon.png":["assets/images/paxg_icon.png"],"assets/images/pepe_icon.png":["assets/images/pepe_icon.png"],"assets/images/pivx_icon.png":["assets/images/pivx_icon.png"],"assets/images/pre_seed_dark.png":["assets/images/pre_seed_dark.png","assets/images/3.0x/pre_seed_dark.png","assets/images/2.0x/pre_seed_dark.png"],"assets/images/pre_seed_light.png":["assets/images/pre_seed_light.png","assets/images/3.0x/pre_seed_light.png","assets/images/2.0x/pre_seed_light.png"],"assets/images/privacy_menu.png":["assets/images/privacy_menu.png","assets/images/3.0x/privacy_menu.png","assets/images/2.0x/privacy_menu.png"],"assets/images/profile.png":["assets/images/profile.png"],"assets/images/qr_code_icon.png":["assets/images/qr_code_icon.png","assets/images/3.0x/qr_code_icon.png","assets/images/2.0x/qr_code_icon.png"],"assets/images/qr_icon.png":["assets/images/qr_icon.png","assets/images/3.0x/qr_icon.png","assets/images/2.0x/qr_icon.png"],"assets/images/question_mark.png":["assets/images/question_mark.png","assets/images/3.0x/question_mark.png","assets/images/2.0x/question_mark.png"],"assets/images/ray_icon.png":["assets/images/ray_icon.png"],"assets/images/receive_icon.png":["assets/images/receive_icon.png"],"assets/images/receive_icon_raw.png":["assets/images/receive_icon_raw.png"],"assets/images/received.png":["assets/images/received.png"],"assets/images/reconnect.png":["assets/images/reconnect.png","assets/images/3.0x/reconnect.png","assets/images/2.0x/reconnect.png"],"assets/images/reconnect_menu.png":["assets/images/reconnect_menu.png","assets/images/3.0x/reconnect_menu.png","assets/images/2.0x/reconnect_menu.png"],"assets/images/red_badge_discount.png":["assets/images/red_badge_discount.png"],"assets/images/refresh_icon.png":["assets/images/refresh_icon.png","assets/images/3.0x/refresh_icon.png","assets/images/2.0x/refresh_icon.png"],"assets/images/restoreSeed.png":["assets/images/restoreSeed.png","assets/images/3.0x/restoreSeed.png","assets/images/2.0x/restoreSeed.png"],"assets/images/restore_keys.png":["assets/images/restore_keys.png","assets/images/3.0x/restore_keys.png","assets/images/2.0x/restore_keys.png"],"assets/images/restore_qr.png":["assets/images/restore_qr.png"],"assets/images/restore_seed.png":["assets/images/restore_seed.png","assets/images/3.0x/restore_seed.png","assets/images/2.0x/restore_seed.png"],"assets/images/restore_wallet.png":["assets/images/restore_wallet.png","assets/images/3.0x/restore_wallet.png","assets/images/2.0x/restore_wallet.png"],"assets/images/restore_wallet_image.png":["assets/images/restore_wallet_image.png","assets/images/3.0x/restore_wallet_image.png","assets/images/2.0x/restore_wallet_image.png"],"assets/images/right_arrow.png":["assets/images/right_arrow.png","assets/images/3.0x/right_arrow.png","assets/images/2.0x/right_arrow.png"],"assets/images/robinhood_dark.png":["assets/images/robinhood_dark.png"],"assets/images/robinhood_light.png":["assets/images/robinhood_light.png"],"assets/images/rune_icon.png":["assets/images/rune_icon.png"],"assets/images/rvn_icon.png":["assets/images/rvn_icon.png"],"assets/images/sc_icon.png":["assets/images/sc_icon.png"],"assets/images/scanner.png":["assets/images/scanner.png","assets/images/3.0x/scanner.png","assets/images/2.0x/scanner.png"],"assets/images/scrt_icon.png":["assets/images/scrt_icon.png"],"assets/images/search_icon.png":["assets/images/search_icon.png"],"assets/images/seedIco.png":["assets/images/seedIco.png","assets/images/3.0x/seedIco.png","assets/images/2.0x/seedIco.png"],"assets/images/seedKeys.png":["assets/images/seedKeys.png","assets/images/3.0x/seedKeys.png","assets/images/2.0x/seedKeys.png"],"assets/images/seed_image.png":["assets/images/seed_image.png","assets/images/3.0x/seed_image.png","assets/images/2.0x/seed_image.png"],"assets/images/select_arrow.png":["assets/images/select_arrow.png","assets/images/3.0x/select_arrow.png","assets/images/2.0x/select_arrow.png"],"assets/images/sell.png":["assets/images/sell.png"],"assets/images/send.png":["assets/images/send.png","assets/images/3.0x/send.png","assets/images/2.0x/send.png"],"assets/images/send_icon.png":["assets/images/send_icon.png"],"assets/images/settings.png":["assets/images/settings.png","assets/images/3.0x/settings.png","assets/images/2.0x/settings.png"],"assets/images/settings_icon.png":["assets/images/settings_icon.png"],"assets/images/settings_menu.png":["assets/images/settings_menu.png","assets/images/3.0x/settings_menu.png","assets/images/2.0x/settings_menu.png"],"assets/images/settings_outline.png":["assets/images/settings_outline.png"],"assets/images/setup_2fa_img.png":["assets/images/setup_2fa_img.png"],"assets/images/share.png":["assets/images/share.png","assets/images/3.0x/share.png","assets/images/2.0x/share.png"],"assets/images/shib_icon.png":["assets/images/shib_icon.png"],"assets/images/sideshift.png":["assets/images/sideshift.png"],"assets/images/simpleSwap.png":["assets/images/simpleSwap.png"],"assets/images/sol_icon.png":["assets/images/sol_icon.png"],"assets/images/standard_anonymity.png":["assets/images/standard_anonymity.png"],"assets/images/status_website_image.png":["assets/images/status_website_image.png"],"assets/images/steth_icon.png":["assets/images/steth_icon.png"],"assets/images/storj_icon.png":["assets/images/storj_icon.png"],"assets/images/stx_icon.png":["assets/images/stx_icon.png"],"assets/images/support_icon.png":["assets/images/support_icon.png"],"assets/images/to_icon.png":["assets/images/to_icon.png","assets/images/3.0x/to_icon.png","assets/images/2.0x/to_icon.png"],"assets/images/transaction_incoming.png":["assets/images/transaction_incoming.png"],"assets/images/transaction_outgoing.png":["assets/images/transaction_outgoing.png"],"assets/images/transfer.png":["assets/images/transfer.png","assets/images/3.0x/transfer.png","assets/images/2.0x/transfer.png"],"assets/images/trash.png":["assets/images/trash.png","assets/images/3.0x/trash.png","assets/images/2.0x/trash.png"],"assets/images/triangle.png":["assets/images/triangle.png","assets/images/3.0x/triangle.png","assets/images/2.0x/triangle.png"],"assets/images/trocador.png":["assets/images/trocador.png"],"assets/images/trx.png":["assets/images/trx.png"],"assets/images/trx_icon.png":["assets/images/trx_icon.png"],"assets/images/tshirt.png":["assets/images/tshirt.png"],"assets/images/tusd_icon.png":["assets/images/tusd_icon.png"],"assets/images/uni_icon.png":["assets/images/uni_icon.png"],"assets/images/up_arrow.png":["assets/images/up_arrow.png","assets/images/3.0x/up_arrow.png","assets/images/2.0x/up_arrow.png"],"assets/images/upload.png":["assets/images/upload.png","assets/images/3.0x/upload.png","assets/images/2.0x/upload.png"],"assets/images/usdc_icon.png":["assets/images/usdc_icon.png"],"assets/images/usdt.png":["assets/images/usdt.png"],"assets/images/usdt_icon.png":["assets/images/usdt_icon.png"],"assets/images/usdterc.png":["assets/images/usdterc.png"],"assets/images/usdterc20_icon.png":["assets/images/usdterc20_icon.png"],"assets/images/usdterc_icon.png":["assets/images/usdterc_icon.png"],"assets/images/usdttrc20_icon.png":["assets/images/usdttrc20_icon.png"],"assets/images/wallet.png":["assets/images/wallet.png","assets/images/3.0x/wallet.png","assets/images/2.0x/wallet.png"],"assets/images/wallet_guides.png":["assets/images/wallet_guides.png"],"assets/images/wallet_icon.png":["assets/images/wallet_icon.png"],"assets/images/wallet_menu.png":["assets/images/wallet_menu.png","assets/images/3.0x/wallet_menu.png","assets/images/2.0x/wallet_menu.png"],"assets/images/wallet_name.png":["assets/images/wallet_name.png","assets/images/3.0x/wallet_name.png","assets/images/2.0x/wallet_name.png"],"assets/images/wallet_name_light.png":["assets/images/wallet_name_light.png","assets/images/3.0x/wallet_name_light.png","assets/images/2.0x/wallet_name_light.png"],"assets/images/wallet_outline.png":["assets/images/wallet_outline.png"],"assets/images/wallet_solid.png":["assets/images/wallet_solid.png"],"assets/images/wallet_type.png":["assets/images/wallet_type.png","assets/images/3.0x/wallet_type.png","assets/images/2.0x/wallet_type.png"],"assets/images/wallet_type_light.png":["assets/images/wallet_type_light.png","assets/images/3.0x/wallet_type_light.png","assets/images/2.0x/wallet_type_light.png"],"assets/images/walletconnect_logo.png":["assets/images/walletconnect_logo.png"],"assets/images/wbtc_icon.png":["assets/images/wbtc_icon.png"],"assets/images/welcome.png":["assets/images/welcome.png","assets/images/3.0x/welcome.png","assets/images/2.0x/welcome.png"],"assets/images/welcomeImg.png":["assets/images/welcomeImg.png","assets/images/3.0x/welcomeImg.png","assets/images/2.0x/welcomeImg.png"],"assets/images/welcome_light.png":["assets/images/welcome_light.png","assets/images/3.0x/welcome_light.png","assets/images/2.0x/welcome_light.png"],"assets/images/weth_icon.png":["assets/images/weth_icon.png"],"assets/images/wifi.png":["assets/images/wifi.png"],"assets/images/wownero_icon.png":["assets/images/wownero_icon.png"],"assets/images/wownero_logo.png":["assets/images/wownero_logo.png"],"assets/images/wownero_menu.png":["assets/images/wownero_menu.png"],"assets/images/wyre-icon.png":["assets/images/wyre-icon.png"],"assets/images/wyre.png":["assets/images/wyre.png"],"assets/images/x.png":["assets/images/x.png"],"assets/images/xchangeme.png":["assets/images/xchangeme.png"],"assets/images/xhv_logo.png":["assets/images/xhv_logo.png"],"assets/images/xlm.png":["assets/images/xlm.png"],"assets/images/xlm_icon.png":["assets/images/xlm_icon.png"],"assets/images/xmr_btc.png":["assets/images/xmr_btc.png","assets/images/3.0x/xmr_btc.png","assets/images/2.0x/xmr_btc.png"],"assets/images/xmrto.png":["assets/images/xmrto.png"],"assets/images/xrp.png":["assets/images/xrp.png"],"assets/images/xrp_icon.png":["assets/images/xrp_icon.png"],"assets/images/xvg_icon.png":["assets/images/xvg_icon.png"],"assets/images/yat_crypto.png":["assets/images/yat_crypto.png"],"assets/images/yat_logo.png":["assets/images/yat_logo.png"],"assets/images/yat_mini_logo.png":["assets/images/yat_mini_logo.png"],"assets/images/zec_icon.png":["assets/images/zec_icon.png"],"assets/images/zen_icon.png":["assets/images/zen_icon.png"],"assets/images/zrx_icon.png":["assets/images/zrx_icon.png"],"assets/litecoin_electrum_server_list.yml":["assets/litecoin_electrum_server_list.yml"],"assets/nano_node_list.yml":["assets/nano_node_list.yml"],"assets/nano_pow_node_list.yml":["assets/nano_pow_node_list.yml"],"assets/node_list.yml":["assets/node_list.yml"],"assets/polygon_node_list.yml":["assets/polygon_node_list.yml"],"assets/solana_node_list.yml":["assets/solana_node_list.yml"],"assets/text/Monerosc_Release_Notes.txt":["assets/text/Monerosc_Release_Notes.txt"],"assets/text/Monerosc_Terms_of_Use.txt":["assets/text/Monerosc_Terms_of_Use.txt"],"assets/text/Release_Notes.txt":["assets/text/Release_Notes.txt"],"assets/text/Terms_of_Use.txt":["assets/text/Terms_of_Use.txt"],"assets/text/Wallet_Adjectives.txt":["assets/text/Wallet_Adjectives.txt"],"assets/text/Wallet_Nouns.txt":["assets/text/Wallet_Nouns.txt"],"assets/text/elitewallet_weak_bitcoin_seeds_hashed_sorted_version1.txt":["assets/text/elitewallet_weak_bitcoin_seeds_hashed_sorted_version1.txt"],"assets/wownero_node_list.yml":["assets/wownero_node_list.yml"],"packages/cupertino_icons/assets/CupertinoIcons.ttf":["packages/cupertino_icons/assets/CupertinoIcons.ttf"],"packages/flutter_inappwebview/assets/t_rex_runner/t-rex.css":["packages/flutter_inappwebview/assets/t_rex_runner/t-rex.css"],"packages/flutter_inappwebview/assets/t_rex_runner/t-rex.html":["packages/flutter_inappwebview/assets/t_rex_runner/t-rex.html"],"packages/flutter_inappwebview_web/assets/web/web_support.js":["packages/flutter_inappwebview_web/assets/web/web_support.js"],"packages/fluttertoast/assets/toastify.css":["packages/fluttertoast/assets/toastify.css"],"packages/fluttertoast/assets/toastify.js":["packages/fluttertoast/assets/toastify.js"],"packages/wakelock_plus/assets/no_sleep.js":["packages/wakelock_plus/assets/no_sleep.js"]}
\ No newline at end of file
---
> {"assets/animation/anim1.json":["assets/animation/anim1.json"],"assets/animation/anim2.json":["assets/animation/anim2.json"],"assets/animation/anim3.json":["assets/animation/anim3.json"],"assets/bitcoin_cash_electrum_server_list.yml":["assets/bitcoin_cash_electrum_server_list.yml"],"assets/bitcoin_electrum_server_list.yml":["assets/bitcoin_electrum_server_list.yml"],"assets/ethereum_server_list.yml":["assets/ethereum_server_list.yml"],"assets/faq/faq_de.json":["assets/faq/faq_de.json"],"assets/faq/faq_en.json":["assets/faq/faq_en.json"],"assets/faq/faq_es.json":["assets/faq/faq_es.json"],"assets/faq/faq_fr.json":["assets/faq/faq_fr.json"],"assets/faq/faq_hi.json":["assets/faq/faq_hi.json"],"assets/faq/faq_ja.json":["assets/faq/faq_ja.json"],"assets/faq/faq_ko.json":["assets/faq/faq_ko.json"],"assets/faq/faq_nl.json":["assets/faq/faq_nl.json"],"assets/faq/faq_pl.json":["assets/faq/faq_pl.json"],"assets/faq/faq_pt.json":["assets/faq/faq_pt.json"],"assets/faq/faq_ru.json":["assets/faq/faq_ru.json"],"assets/faq/faq_uk.json":["assets/faq/faq_uk.json"],"assets/faq/faq_zh.json":["assets/faq/faq_zh.json"],"assets/fonts/Lato-Bold.ttf":["assets/fonts/Lato-Bold.ttf"],"assets/fonts/Lato-Medium.ttf":["assets/fonts/Lato-Medium.ttf"],"assets/fonts/Lato-Regular.ttf":["assets/fonts/Lato-Regular.ttf"],"assets/fonts/Lato-Semibold.ttf":["assets/fonts/Lato-Semibold.ttf"],"assets/haven_node_list.yml":["assets/haven_node_list.yml"],"assets/images/Telegram.png":["assets/images/Telegram.png","assets/images/2.0x/Telegram.png","assets/images/3.0x/Telegram.png"],"assets/images/Twitter.png":["assets/images/Twitter.png","assets/images/2.0x/Twitter.png","assets/images/3.0x/Twitter.png"],"assets/images/aave_icon.png":["assets/images/aave_icon.png"],"assets/images/ada.png":["assets/images/ada.png"],"assets/images/ada_icon.png":["assets/images/ada_icon.png"],"assets/images/address_book_icon.png":["assets/images/address_book_icon.png"],"assets/images/advanced_anonymity.png":["assets/images/advanced_anonymity.png"],"assets/images/airplane.png":["assets/images/airplane.png"],"assets/images/ape_icon.png":["assets/images/ape_icon.png"],"assets/images/app_logo.png":["assets/images/app_logo.png"],"assets/images/arb_icon.png":["assets/images/arb_icon.png"],"assets/images/arrow_bottom_elite_green.png":["assets/images/arrow_bottom_elite_green.png","assets/images/2.0x/arrow_bottom_elite_green.png","assets/images/3.0x/arrow_bottom_elite_green.png"],"assets/images/arrow_bottom_purple_icon.png":["assets/images/arrow_bottom_purple_icon.png"],"assets/images/avaxc_icon.png":["assets/images/avaxc_icon.png"],"assets/images/avdo_icon.png":["assets/images/avdo_icon.png"],"assets/images/back_arrow.png":["assets/images/back_arrow.png","assets/images/2.0x/back_arrow.png","assets/images/3.0x/back_arrow.png"],"assets/images/back_arrow_dark_theme.png":["assets/images/back_arrow_dark_theme.png","assets/images/2.0x/back_arrow_dark_theme.png","assets/images/3.0x/back_arrow_dark_theme.png"],"assets/images/back_vector.png":["assets/images/back_vector.png","assets/images/2.0x/back_vector.png","assets/images/3.0x/back_vector.png"],"assets/images/backup.png":["assets/images/backup.png","assets/images/2.0x/backup.png","assets/images/3.0x/backup.png"],"assets/images/badge_discount.png":["assets/images/badge_discount.png"],"assets/images/bat_icon.png":["assets/images/bat_icon.png"],"assets/images/bch.png":["assets/images/bch.png"],"assets/images/bch_icon.png":["assets/images/bch_icon.png"],"assets/images/birthday_cake.png":["assets/images/birthday_cake.png"],"assets/images/bitcoin.png":["assets/images/bitcoin.png","assets/images/2.0x/bitcoin.png","assets/images/3.0x/bitcoin.png"],"assets/images/bitcoin_icon.png":["assets/images/bitcoin_icon.png"],"assets/images/bitcoin_menu.png":["assets/images/bitcoin_menu.png","assets/images/2.0x/bitcoin_menu.png","assets/images/3.0x/bitcoin_menu.png"],"assets/images/bitmap.png":["assets/images/bitmap.png","assets/images/2.0x/bitmap.png","assets/images/3.0x/bitmap.png"],"assets/images/bnb.png":["assets/images/bnb.png"],"assets/images/bnb_icon.png":["assets/images/bnb_icon.png"],"assets/images/bonk_icon.png":["assets/images/bonk_icon.png"],"assets/images/btc.png":["assets/images/btc.png"],"assets/images/btt_icon.png":["assets/images/btt_icon.png"],"assets/images/buy.png":["assets/images/buy.png"],"assets/images/cake_icon.png":["assets/images/cake_icon.png"],"assets/images/card.png":["assets/images/card.png"],"assets/images/category.png":["assets/images/category.png"],"assets/images/change_now.png":["assets/images/change_now.png","assets/images/2.0x/change_now.png","assets/images/3.0x/change_now.png"],"assets/images/changenow.png":["assets/images/changenow.png"],"assets/images/close.png":["assets/images/close.png","assets/images/2.0x/close.png","assets/images/3.0x/close.png"],"assets/images/close_button.png":["assets/images/close_button.png","assets/images/2.0x/close_button.png","assets/images/3.0x/close_button.png"],"assets/images/close_button_dark_theme.png":["assets/images/close_button_dark_theme.png","assets/images/2.0x/close_button_dark_theme.png","assets/images/3.0x/close_button_dark_theme.png"],"assets/images/coins.png":["assets/images/coins.png","assets/images/2.0x/coins.png","assets/images/3.0x/coins.png"],"assets/images/comp_icon.png":["assets/images/comp_icon.png"],"assets/images/copy.png":["assets/images/copy.png"],"assets/images/copy_address.png":["assets/images/copy_address.png","assets/images/2.0x/copy_address.png","assets/images/3.0x/copy_address.png"],"assets/images/copy_content.png":["assets/images/copy_content.png","assets/images/2.0x/copy_content.png","assets/images/3.0x/copy_content.png"],"assets/images/cro_icon.png":["assets/images/cro_icon.png"],"assets/images/crypto_lock.png":["assets/images/crypto_lock.png","assets/images/2.0x/crypto_lock.png","assets/images/3.0x/crypto_lock.png"],"assets/images/crypto_lock_light.png":["assets/images/crypto_lock_light.png","assets/images/2.0x/crypto_lock_light.png","assets/images/3.0x/crypto_lock_light.png"],"assets/images/dai.png":["assets/images/dai.png"],"assets/images/dai_icon.png":["assets/images/dai_icon.png"],"assets/images/dash.png":["assets/images/dash.png"],"assets/images/dash_icon.png":["assets/images/dash_icon.png"],"assets/images/dcr_icon.png":["assets/images/dcr_icon.png"],"assets/images/delete_icon.png":["assets/images/delete_icon.png","assets/images/2.0x/delete_icon.png","assets/images/3.0x/delete_icon.png"],"assets/images/delivery.png":["assets/images/delivery.png"],"assets/images/desktop_transactions_outline_icon.png":["assets/images/desktop_transactions_outline_icon.png"],"assets/images/desktop_transactions_solid_icon.png":["assets/images/desktop_transactions_solid_icon.png"],"assets/images/dfx_dark.png":["assets/images/dfx_dark.png"],"assets/images/dfx_light.png":["assets/images/dfx_light.png"],"assets/images/digibyte.png":["assets/images/digibyte.png"],"assets/images/doge_icon.png":["assets/images/doge_icon.png"],"assets/images/down_arrow.png":["assets/images/down_arrow.png","assets/images/2.0x/down_arrow.png","assets/images/3.0x/down_arrow.png"],"assets/images/download.png":["assets/images/download.png"],"assets/images/dydx_icon.png":["assets/images/dydx_icon.png"],"assets/images/elite_anonymity.png":["assets/images/elite_anonymity.png"],"assets/images/elite_arrow.png":["assets/images/elite_arrow.png","assets/images/2.0x/elite_arrow.png","assets/images/3.0x/elite_arrow.png"],"assets/images/elite_logo.png":["assets/images/elite_logo.png","assets/images/2.0x/elite_logo.png","assets/images/3.0x/elite_logo.png"],"assets/images/elitewallet_android_icon.png":["assets/images/elitewallet_android_icon.png"],"assets/images/elitewallet_app_logo.png":["assets/images/elitewallet_app_logo.png"],"assets/images/elitewallet_icon_1024.png":["assets/images/elitewallet_icon_1024.png"],"assets/images/elitewallet_icon_120.png":["assets/images/elitewallet_icon_120.png"],"assets/images/elitewallet_icon_180.png":["assets/images/elitewallet_icon_180.png"],"assets/images/elitewallet_logo.png":["assets/images/elitewallet_logo.png"],"assets/images/emoji_popup.png":["assets/images/emoji_popup.png"],"assets/images/ens_icon.png":["assets/images/ens_icon.png"],"assets/images/eos.png":["assets/images/eos.png"],"assets/images/eos_icon.png":["assets/images/eos_icon.png"],"assets/images/eth.png":["assets/images/eth.png"],"assets/images/eth_icon.png":["assets/images/eth_icon.png"],"assets/images/exch.png":["assets/images/exch.png"],"assets/images/exchange.png":["assets/images/exchange.png","assets/images/2.0x/exchange.png","assets/images/3.0x/exchange.png"],"assets/images/exchange_icon.png":["assets/images/exchange_icon.png"],"assets/images/exolix.png":["assets/images/exolix.png"],"assets/images/eye.png":["assets/images/eye.png","assets/images/2.0x/eye.png","assets/images/3.0x/eye.png"],"assets/images/eye_action.png":["assets/images/eye_action.png","assets/images/2.0x/eye_action.png","assets/images/3.0x/eye_action.png"],"assets/images/eye_menu.png":["assets/images/eye_menu.png","assets/images/2.0x/eye_menu.png","assets/images/3.0x/eye_menu.png"],"assets/images/face.png":["assets/images/face.png","assets/images/2.0x/face.png","assets/images/3.0x/face.png"],"assets/images/filter.png":["assets/images/filter.png"],"assets/images/filter_button.png":["assets/images/filter_button.png","assets/images/2.0x/filter_button.png","assets/images/3.0x/filter_button.png"],"assets/images/filter_icon.png":["assets/images/filter_icon.png"],"assets/images/filter_light_button.png":["assets/images/filter_light_button.png","assets/images/2.0x/filter_light_button.png","assets/images/3.0x/filter_light_button.png"],"assets/images/firo_icon.png":["assets/images/firo_icon.png"],"assets/images/flags/are.png":["assets/images/flags/are.png"],"assets/images/flags/arg.png":["assets/images/flags/arg.png"],"assets/images/flags/aus.png":["assets/images/flags/aus.png"],"assets/images/flags/bgd.png":["assets/images/flags/bgd.png"],"assets/images/flags/bgr.png":["assets/images/flags/bgr.png"],"assets/images/flags/bra.png":["assets/images/flags/bra.png"],"assets/images/flags/cad.png":["assets/images/flags/cad.png"],"assets/images/flags/che.png":["assets/images/flags/che.png"],"assets/images/flags/chl.png":["assets/images/flags/chl.png"],"assets/images/flags/chn.png":["assets/images/flags/chn.png"],"assets/images/flags/col.png":["assets/images/flags/col.png"],"assets/images/flags/czk.png":["assets/images/flags/czk.png"],"assets/images/flags/deu.png":["assets/images/flags/deu.png"],"assets/images/flags/dnk.png":["assets/images/flags/dnk.png"],"assets/images/flags/egy.png":["assets/images/flags/egy.png"],"assets/images/flags/esp.png":["assets/images/flags/esp.png"],"assets/images/flags/eur.png":["assets/images/flags/eur.png"],"assets/images/flags/fra.png":["assets/images/flags/fra.png"],"assets/images/flags/gbr.png":["assets/images/flags/gbr.png"],"assets/images/flags/gha.png":["assets/images/flags/gha.png"],"assets/images/flags/gtm.png":["assets/images/flags/gtm.png"],"assets/images/flags/hau.png":["assets/images/flags/hau.png"],"assets/images/flags/hkg.png":["assets/images/flags/hkg.png"],"assets/images/flags/hrv.png":["assets/images/flags/hrv.png"],"assets/images/flags/hun.png":["assets/images/flags/hun.png"],"assets/images/flags/idn.png":["assets/images/flags/idn.png"],"assets/images/flags/ind.png":["assets/images/flags/ind.png"],"assets/images/flags/irn.png":["assets/images/flags/irn.png"],"assets/images/flags/isl.png":["assets/images/flags/isl.png"],"assets/images/flags/isr.png":["assets/images/flags/isr.png"],"assets/images/flags/ita.png":["assets/images/flags/ita.png"],"assets/images/flags/jpn.png":["assets/images/flags/jpn.png"],"assets/images/flags/kor.png":["assets/images/flags/kor.png"],"assets/images/flags/mar.png":["assets/images/flags/mar.png"],"assets/images/flags/mex.png":["assets/images/flags/mex.png"],"assets/images/flags/mmr.png":["assets/images/flags/mmr.png"],"assets/images/flags/mys.png":["assets/images/flags/mys.png"],"assets/images/flags/nga.png":["assets/images/flags/nga.png"],"assets/images/flags/nld.png":["assets/images/flags/nld.png"],"assets/images/flags/nor.png":["assets/images/flags/nor.png"],"assets/images/flags/nzl.png":["assets/images/flags/nzl.png"],"assets/images/flags/pak.png":["assets/images/flags/pak.png"],"assets/images/flags/phl.png":["assets/images/flags/phl.png"],"assets/images/flags/pol.png":["assets/images/flags/pol.png"],"assets/images/flags/prt.png":["assets/images/flags/prt.png"],"assets/images/flags/rou.png":["assets/images/flags/rou.png"],"assets/images/flags/rus.png":["assets/images/flags/rus.png"],"assets/images/flags/saf.png":["assets/images/flags/saf.png"],"assets/images/flags/sau.png":["assets/images/flags/sau.png"],"assets/images/flags/sgp.png":["assets/images/flags/sgp.png"],"assets/images/flags/swe.png":["assets/images/flags/swe.png"],"assets/images/flags/tha.png":["assets/images/flags/tha.png"],"assets/images/flags/tur.png":["assets/images/flags/tur.png"],"assets/images/flags/twn.png":["assets/images/flags/twn.png"],"assets/images/flags/ukr.png":["assets/images/flags/ukr.png"],"assets/images/flags/usa.png":["assets/images/flags/usa.png"],"assets/images/flags/ven.png":["assets/images/flags/ven.png"],"assets/images/flags/vnm.png":["assets/images/flags/vnm.png"],"assets/images/food.png":["assets/images/food.png"],"assets/images/frax_icon.png":["assets/images/frax_icon.png"],"assets/images/ftm_icon.png":["assets/images/ftm_icon.png"],"assets/images/gaming.png":["assets/images/gaming.png"],"assets/images/github.png":["assets/images/github.png","assets/images/2.0x/github.png","assets/images/3.0x/github.png"],"assets/images/global.png":["assets/images/global.png"],"assets/images/gmt_icon.png":["assets/images/gmt_icon.png"],"assets/images/grt_icon.png":["assets/images/grt_icon.png"],"assets/images/gtc_icon.png":["assets/images/gtc_icon.png"],"assets/images/gusd_icon.png":["assets/images/gusd_icon.png"],"assets/images/haven_logo.png":["assets/images/haven_logo.png"],"assets/images/haven_menu.png":["assets/images/haven_menu.png"],"assets/images/hbar_icon.png":["assets/images/hbar_icon.png"],"assets/images/header.png":["assets/images/header.png","assets/images/2.0x/header.png","assets/images/3.0x/header.png"],"assets/images/hnt_icon.png":["assets/images/hnt_icon.png"],"assets/images/home_screen_settings_icon.png":["assets/images/home_screen_settings_icon.png"],"assets/images/husd_icon.png":["assets/images/husd_icon.png"],"assets/images/kaspa_icon.png":["assets/images/kaspa_icon.png"],"assets/images/key.png":["assets/images/key.png","assets/images/2.0x/key.png","assets/images/3.0x/key.png"],"assets/images/key_menu.png":["assets/images/key_menu.png","assets/images/2.0x/key_menu.png","assets/images/3.0x/key_menu.png"],"assets/images/keysIco.png":["assets/images/keysIco.png","assets/images/2.0x/keysIco.png","assets/images/3.0x/keysIco.png"],"assets/images/kmd_icon.png":["assets/images/kmd_icon.png"],"assets/images/ldo_icon.png":["assets/images/ldo_icon.png"],"assets/images/litecoin-ltc_icon.png":["assets/images/litecoin-ltc_icon.png"],"assets/images/litecoin.png":["assets/images/litecoin.png","assets/images/2.0x/litecoin.png","assets/images/3.0x/litecoin.png"],"assets/images/litecoin_icon.png":["assets/images/litecoin_icon.png"],"assets/images/litecoin_img.png":["assets/images/litecoin_img.png"],"assets/images/litecoin_menu.png":["assets/images/litecoin_menu.png"],"assets/images/live_support.png":["assets/images/live_support.png"],"assets/images/load.png":["assets/images/load.png","assets/images/2.0x/load.png","assets/images/3.0x/load.png"],"assets/images/majesticbank.png":["assets/images/majesticbank.png"],"assets/images/mana_icon.png":["assets/images/mana_icon.png"],"assets/images/mastercard.png":["assets/images/mastercard.png"],"assets/images/matic_icon.png":["assets/images/matic_icon.png"],"assets/images/menu.png":["assets/images/menu.png"],"assets/images/menu_button.png":["assets/images/menu_button.png","assets/images/2.0x/menu_button.png","assets/images/3.0x/menu_button.png"],"assets/images/mini_search_icon.png":["assets/images/mini_search_icon.png"],"assets/images/mkr_icon.png":["assets/images/mkr_icon.png"],"assets/images/monero.png":["assets/images/monero.png","assets/images/2.0x/monero.png","assets/images/3.0x/monero.png"],"assets/images/monero.sc_android_icon.png":["assets/images/monero.sc_android_icon.png"],"assets/images/monero.sc_icon_1024.png":["assets/images/monero.sc_icon_1024.png"],"assets/images/monero.sc_icon_120.png":["assets/images/monero.sc_icon_120.png"],"assets/images/monero.sc_icon_180.png":["assets/images/monero.sc_icon_180.png"],"assets/images/monero.sc_logo.png":["assets/images/monero.sc_logo.png"],"assets/images/monero_icon.png":["assets/images/monero_icon.png"],"assets/images/monero_logo.png":["assets/images/monero_logo.png"],"assets/images/monero_menu.png":["assets/images/monero_menu.png","assets/images/2.0x/monero_menu.png","assets/images/3.0x/monero_menu.png"],"assets/images/moonpay-icon.png":["assets/images/moonpay-icon.png"],"assets/images/moonpay.png":["assets/images/moonpay.png"],"assets/images/moonpay_dark.png":["assets/images/moonpay_dark.png"],"assets/images/moonpay_light.png":["assets/images/moonpay_light.png"],"assets/images/more.png":["assets/images/more.png"],"assets/images/more_links.png":["assets/images/more_links.png"],"assets/images/morph.png":["assets/images/morph.png"],"assets/images/morph_icon.png":["assets/images/morph_icon.png","assets/images/2.0x/morph_icon.png","assets/images/3.0x/morph_icon.png"],"assets/images/nano.png":["assets/images/nano.png"],"assets/images/nano_icon.png":["assets/images/nano_icon.png"],"assets/images/near_icon.png":["assets/images/near_icon.png"],"assets/images/new_wallet.png":["assets/images/new_wallet.png","assets/images/2.0x/new_wallet.png","assets/images/3.0x/new_wallet.png"],"assets/images/nexo_icon.png":["assets/images/nexo_icon.png"],"assets/images/nodes.png":["assets/images/nodes.png","assets/images/2.0x/nodes.png","assets/images/3.0x/nodes.png"],"assets/images/nodes_menu.png":["assets/images/nodes_menu.png","assets/images/2.0x/nodes_menu.png","assets/images/3.0x/nodes_menu.png"],"assets/images/notification_icon.svg":["assets/images/notification_icon.svg"],"assets/images/onramper_dark.png":["assets/images/onramper_dark.png"],"assets/images/onramper_light.png":["assets/images/onramper_light.png"],"assets/images/open_book.png":["assets/images/open_book.png","assets/images/2.0x/open_book.png","assets/images/3.0x/open_book.png"],"assets/images/open_book_menu.png":["assets/images/open_book_menu.png","assets/images/2.0x/open_book_menu.png","assets/images/3.0x/open_book_menu.png"],"assets/images/oxt_icon.png":["assets/images/oxt_icon.png"],"assets/images/paste_button.png":["assets/images/paste_button.png"],"assets/images/paste_ios.png":["assets/images/paste_ios.png","assets/images/2.0x/paste_ios.png","assets/images/3.0x/paste_ios.png"],"assets/images/paxg_icon.png":["assets/images/paxg_icon.png"],"assets/images/pepe_icon.png":["assets/images/pepe_icon.png"],"assets/images/pivx_icon.png":["assets/images/pivx_icon.png"],"assets/images/pre_seed_dark.png":["assets/images/pre_seed_dark.png","assets/images/2.0x/pre_seed_dark.png","assets/images/3.0x/pre_seed_dark.png"],"assets/images/pre_seed_light.png":["assets/images/pre_seed_light.png","assets/images/2.0x/pre_seed_light.png","assets/images/3.0x/pre_seed_light.png"],"assets/images/privacy_menu.png":["assets/images/privacy_menu.png","assets/images/2.0x/privacy_menu.png","assets/images/3.0x/privacy_menu.png"],"assets/images/profile.png":["assets/images/profile.png"],"assets/images/qr_code_icon.png":["assets/images/qr_code_icon.png","assets/images/2.0x/qr_code_icon.png","assets/images/3.0x/qr_code_icon.png"],"assets/images/qr_icon.png":["assets/images/qr_icon.png","assets/images/2.0x/qr_icon.png","assets/images/3.0x/qr_icon.png"],"assets/images/question_mark.png":["assets/images/question_mark.png","assets/images/2.0x/question_mark.png","assets/images/3.0x/question_mark.png"],"assets/images/ray_icon.png":["assets/images/ray_icon.png"],"assets/images/receive_icon.png":["assets/images/receive_icon.png"],"assets/images/receive_icon_raw.png":["assets/images/receive_icon_raw.png"],"assets/images/received.png":["assets/images/received.png"],"assets/images/reconnect.png":["assets/images/reconnect.png","assets/images/2.0x/reconnect.png","assets/images/3.0x/reconnect.png"],"assets/images/reconnect_menu.png":["assets/images/reconnect_menu.png","assets/images/2.0x/reconnect_menu.png","assets/images/3.0x/reconnect_menu.png"],"assets/images/red_badge_discount.png":["assets/images/red_badge_discount.png"],"assets/images/refresh_icon.png":["assets/images/refresh_icon.png","assets/images/2.0x/refresh_icon.png","assets/images/3.0x/refresh_icon.png"],"assets/images/restoreSeed.png":["assets/images/restoreSeed.png","assets/images/2.0x/restoreSeed.png","assets/images/3.0x/restoreSeed.png"],"assets/images/restore_keys.png":["assets/images/restore_keys.png","assets/images/2.0x/restore_keys.png","assets/images/3.0x/restore_keys.png"],"assets/images/restore_qr.png":["assets/images/restore_qr.png"],"assets/images/restore_seed.png":["assets/images/restore_seed.png","assets/images/2.0x/restore_seed.png","assets/images/3.0x/restore_seed.png"],"assets/images/restore_wallet.png":["assets/images/restore_wallet.png","assets/images/2.0x/restore_wallet.png","assets/images/3.0x/restore_wallet.png"],"assets/images/restore_wallet_image.png":["assets/images/restore_wallet_image.png","assets/images/2.0x/restore_wallet_image.png","assets/images/3.0x/restore_wallet_image.png"],"assets/images/right_arrow.png":["assets/images/right_arrow.png","assets/images/2.0x/right_arrow.png","assets/images/3.0x/right_arrow.png"],"assets/images/robinhood_dark.png":["assets/images/robinhood_dark.png"],"assets/images/robinhood_light.png":["assets/images/robinhood_light.png"],"assets/images/rune_icon.png":["assets/images/rune_icon.png"],"assets/images/rvn_icon.png":["assets/images/rvn_icon.png"],"assets/images/sc_icon.png":["assets/images/sc_icon.png"],"assets/images/scanner.png":["assets/images/scanner.png","assets/images/2.0x/scanner.png","assets/images/3.0x/scanner.png"],"assets/images/scrt_icon.png":["assets/images/scrt_icon.png"],"assets/images/search_icon.png":["assets/images/search_icon.png"],"assets/images/seedIco.png":["assets/images/seedIco.png","assets/images/2.0x/seedIco.png","assets/images/3.0x/seedIco.png"],"assets/images/seedKeys.png":["assets/images/seedKeys.png","assets/images/2.0x/seedKeys.png","assets/images/3.0x/seedKeys.png"],"assets/images/seed_image.png":["assets/images/seed_image.png","assets/images/2.0x/seed_image.png","assets/images/3.0x/seed_image.png"],"assets/images/select_arrow.png":["assets/images/select_arrow.png","assets/images/2.0x/select_arrow.png","assets/images/3.0x/select_arrow.png"],"assets/images/sell.png":["assets/images/sell.png"],"assets/images/send.png":["assets/images/send.png","assets/images/2.0x/send.png","assets/images/3.0x/send.png"],"assets/images/send_icon.png":["assets/images/send_icon.png"],"assets/images/settings.png":["assets/images/settings.png","assets/images/2.0x/settings.png","assets/images/3.0x/settings.png"],"assets/images/settings_icon.png":["assets/images/settings_icon.png"],"assets/images/settings_menu.png":["assets/images/settings_menu.png","assets/images/2.0x/settings_menu.png","assets/images/3.0x/settings_menu.png"],"assets/images/settings_outline.png":["assets/images/settings_outline.png"],"assets/images/setup_2fa_img.png":["assets/images/setup_2fa_img.png"],"assets/images/share.png":["assets/images/share.png","assets/images/2.0x/share.png","assets/images/3.0x/share.png"],"assets/images/shib_icon.png":["assets/images/shib_icon.png"],"assets/images/sideshift.png":["assets/images/sideshift.png"],"assets/images/simpleSwap.png":["assets/images/simpleSwap.png"],"assets/images/sol_icon.png":["assets/images/sol_icon.png"],"assets/images/standard_anonymity.png":["assets/images/standard_anonymity.png"],"assets/images/status_website_image.png":["assets/images/status_website_image.png"],"assets/images/steth_icon.png":["assets/images/steth_icon.png"],"assets/images/storj_icon.png":["assets/images/storj_icon.png"],"assets/images/stx_icon.png":["assets/images/stx_icon.png"],"assets/images/support_icon.png":["assets/images/support_icon.png"],"assets/images/to_icon.png":["assets/images/to_icon.png","assets/images/2.0x/to_icon.png","assets/images/3.0x/to_icon.png"],"assets/images/transaction_incoming.png":["assets/images/transaction_incoming.png"],"assets/images/transaction_outgoing.png":["assets/images/transaction_outgoing.png"],"assets/images/transfer.png":["assets/images/transfer.png","assets/images/2.0x/transfer.png","assets/images/3.0x/transfer.png"],"assets/images/trash.png":["assets/images/trash.png","assets/images/2.0x/trash.png","assets/images/3.0x/trash.png"],"assets/images/triangle.png":["assets/images/triangle.png","assets/images/2.0x/triangle.png","assets/images/3.0x/triangle.png"],"assets/images/trocador.png":["assets/images/trocador.png"],"assets/images/trx.png":["assets/images/trx.png"],"assets/images/trx_icon.png":["assets/images/trx_icon.png"],"assets/images/tshirt.png":["assets/images/tshirt.png"],"assets/images/tusd_icon.png":["assets/images/tusd_icon.png"],"assets/images/uni_icon.png":["assets/images/uni_icon.png"],"assets/images/up_arrow.png":["assets/images/up_arrow.png","assets/images/2.0x/up_arrow.png","assets/images/3.0x/up_arrow.png"],"assets/images/upload.png":["assets/images/upload.png","assets/images/2.0x/upload.png","assets/images/3.0x/upload.png"],"assets/images/usdc_icon.png":["assets/images/usdc_icon.png"],"assets/images/usdt.png":["assets/images/usdt.png"],"assets/images/usdt_icon.png":["assets/images/usdt_icon.png"],"assets/images/usdterc.png":["assets/images/usdterc.png"],"assets/images/usdterc20_icon.png":["assets/images/usdterc20_icon.png"],"assets/images/usdterc_icon.png":["assets/images/usdterc_icon.png"],"assets/images/usdttrc20_icon.png":["assets/images/usdttrc20_icon.png"],"assets/images/wallet.png":["assets/images/wallet.png","assets/images/2.0x/wallet.png","assets/images/3.0x/wallet.png"],"assets/images/wallet_guides.png":["assets/images/wallet_guides.png"],"assets/images/wallet_icon.png":["assets/images/wallet_icon.png"],"assets/images/wallet_menu.png":["assets/images/wallet_menu.png","assets/images/2.0x/wallet_menu.png","assets/images/3.0x/wallet_menu.png"],"assets/images/wallet_name.png":["assets/images/wallet_name.png","assets/images/2.0x/wallet_name.png","assets/images/3.0x/wallet_name.png"],"assets/images/wallet_name_light.png":["assets/images/wallet_name_light.png","assets/images/2.0x/wallet_name_light.png","assets/images/3.0x/wallet_name_light.png"],"assets/images/wallet_outline.png":["assets/images/wallet_outline.png"],"assets/images/wallet_solid.png":["assets/images/wallet_solid.png"],"assets/images/wallet_type.png":["assets/images/wallet_type.png","assets/images/2.0x/wallet_type.png","assets/images/3.0x/wallet_type.png"],"assets/images/wallet_type_light.png":["assets/images/wallet_type_light.png","assets/images/2.0x/wallet_type_light.png","assets/images/3.0x/wallet_type_light.png"],"assets/images/walletconnect_logo.png":["assets/images/walletconnect_logo.png"],"assets/images/wbtc_icon.png":["assets/images/wbtc_icon.png"],"assets/images/welcome.png":["assets/images/welcome.png","assets/images/2.0x/welcome.png","assets/images/3.0x/welcome.png"],"assets/images/welcomeImg.png":["assets/images/welcomeImg.png","assets/images/2.0x/welcomeImg.png","assets/images/3.0x/welcomeImg.png"],"assets/images/welcome_light.png":["assets/images/welcome_light.png","assets/images/2.0x/welcome_light.png","assets/images/3.0x/welcome_light.png"],"assets/images/weth_icon.png":["assets/images/weth_icon.png"],"assets/images/wifi.png":["assets/images/wifi.png"],"assets/images/wownero_icon.png":["assets/images/wownero_icon.png"],"assets/images/wownero_logo.png":["assets/images/wownero_logo.png"],"assets/images/wownero_menu.png":["assets/images/wownero_menu.png"],"assets/images/wyre-icon.png":["assets/images/wyre-icon.png"],"assets/images/wyre.png":["assets/images/wyre.png"],"assets/images/x.png":["assets/images/x.png"],"assets/images/xchangeme.png":["assets/images/xchangeme.png"],"assets/images/xhv_logo.png":["assets/images/xhv_logo.png"],"assets/images/xlm.png":["assets/images/xlm.png"],"assets/images/xlm_icon.png":["assets/images/xlm_icon.png"],"assets/images/xmr_btc.png":["assets/images/xmr_btc.png","assets/images/2.0x/xmr_btc.png","assets/images/3.0x/xmr_btc.png"],"assets/images/xmrto.png":["assets/images/xmrto.png"],"assets/images/xrp.png":["assets/images/xrp.png"],"assets/images/xrp_icon.png":["assets/images/xrp_icon.png"],"assets/images/xvg_icon.png":["assets/images/xvg_icon.png"],"assets/images/yat_crypto.png":["assets/images/yat_crypto.png"],"assets/images/yat_logo.png":["assets/images/yat_logo.png"],"assets/images/yat_mini_logo.png":["assets/images/yat_mini_logo.png"],"assets/images/zec_icon.png":["assets/images/zec_icon.png"],"assets/images/zen_icon.png":["assets/images/zen_icon.png"],"assets/images/zrx_icon.png":["assets/images/zrx_icon.png"],"assets/litecoin_electrum_server_list.yml":["assets/litecoin_electrum_server_list.yml"],"assets/nano_node_list.yml":["assets/nano_node_list.yml"],"assets/nano_pow_node_list.yml":["assets/nano_pow_node_list.yml"],"assets/node_list.yml":["assets/node_list.yml"],"assets/polygon_node_list.yml":["assets/polygon_node_list.yml"],"assets/solana_node_list.yml":["assets/solana_node_list.yml"],"assets/text/Monerosc_Release_Notes.txt":["assets/text/Monerosc_Release_Notes.txt"],"assets/text/Monerosc_Terms_of_Use.txt":["assets/text/Monerosc_Terms_of_Use.txt"],"assets/text/Release_Notes.txt":["assets/text/Release_Notes.txt"],"assets/text/Terms_of_Use.txt":["assets/text/Terms_of_Use.txt"],"assets/text/Wallet_Adjectives.txt":["assets/text/Wallet_Adjectives.txt"],"assets/text/Wallet_Nouns.txt":["assets/text/Wallet_Nouns.txt"],"assets/text/elitewallet_weak_bitcoin_seeds_hashed_sorted_version1.txt":["assets/text/elitewallet_weak_bitcoin_seeds_hashed_sorted_version1.txt"],"assets/wownero_node_list.yml":["assets/wownero_node_list.yml"],"packages/cupertino_icons/assets/CupertinoIcons.ttf":["packages/cupertino_icons/assets/CupertinoIcons.ttf"],"packages/flutter_inappwebview/assets/t_rex_runner/t-rex.css":["packages/flutter_inappwebview/assets/t_rex_runner/t-rex.css"],"packages/flutter_inappwebview/assets/t_rex_runner/t-rex.html":["packages/flutter_inappwebview/assets/t_rex_runner/t-rex.html"],"packages/flutter_inappwebview_web/assets/web/web_support.js":["packages/flutter_inappwebview_web/assets/web/web_support.js"],"packages/fluttertoast/assets/toastify.css":["packages/fluttertoast/assets/toastify.css"],"packages/fluttertoast/assets/toastify.js":["packages/fluttertoast/assets/toastify.js"],"packages/wakelock_plus/assets/no_sleep.js":["packages/wakelock_plus/assets/no_sleep.js"]}
\ No newline at end of file
Binary files fromBuild/assets/flutter_assets/NOTICES.Z and fromOfficial/assets/flutter_assets/NOTICES.Z differ
Only in fromBuild: lib
Only in fromBuild/res: 04.png
Only in fromBuild/res: 06.png
Only in fromBuild/res: 09.9.png
Only in fromBuild/res: 0b.xml
Only in fromBuild/res: 0H.9.png
Only in fromBuild/res: 0I.png
Only in fromBuild/res: 0v.xml
Only in fromBuild/res: 0X.png
Only in fromBuild/res: 11.png
Only in fromBuild/res: 18.png
Only in fromBuild/res: 19.png
Only in fromBuild/res: 1g.xml
Only in fromBuild/res: 1L.xml
Only in fromBuild/res: 1N.xml
Only in fromBuild/res: 1R.xml
Only in fromBuild/res: 1u.xml
Only in fromBuild/res: 1V.xml
Only in fromBuild/res: 1W.xml
Only in fromBuild/res: 1x.png
Only in fromBuild/res: 1y.xml
Only in fromBuild/res: 23.xml
Only in fromBuild/res: 2C.9.png
Only in fromBuild/res: 2D1.xml
Only in fromBuild/res: 2D.xml
Only in fromBuild/res: 2p.xml
Only in fromBuild/res: 2S.xml
Only in fromBuild/res: 33.9.png
Only in fromBuild/res: 36.xml
Only in fromBuild/res: 38.xml
Only in fromBuild/res: 3B.xml
Only in fromBuild/res: 3c.xml
Only in fromBuild/res: 3h.xml
Only in fromBuild/res: 3m.xml
Only in fromBuild/res: 3_.png
Only in fromBuild/res: 3x.xml
Only in fromBuild/res: 3z.xml
Only in fromBuild/res: 41.xml
Only in fromBuild/res: 43.xml
Only in fromBuild/res: 48.png
Only in fromBuild/res: 4_.9.png
Only in fromBuild/res: 4c.xml
Only in fromBuild/res: 4G.xml
Only in fromBuild/res: 4r.png
Only in fromBuild/res: 4W.xml
Only in fromBuild/res: 5A.xml
Only in fromBuild/res: 5j.9.png
Only in fromBuild/res: 5J.png
Only in fromBuild/res: 5w.xml
Only in fromBuild/res: 5z.9.png
Only in fromBuild/res: 65.xml
Only in fromBuild/res: _6.9.png
Only in fromBuild/res: 6E.png
Only in fromBuild/res: 6e.xml
Only in fromBuild/res: 6J.xml
Only in fromBuild/res: 6w.9.png
Only in fromBuild/res: 72.9.png
Only in fromBuild/res: 75.xml
Only in fromBuild/res: 7E.xml
Only in fromBuild/res: 7F.9.png
Only in fromBuild/res: 7P.9.png
Only in fromBuild/res: _7.png
Only in fromBuild/res: 7T.9.png
Only in fromBuild/res: 7u.xml
Only in fromBuild/res: 7W.xml
Only in fromBuild/res: 8s.xml
Only in fromBuild/res: 8t.png
Only in fromBuild/res: 8T.png
Only in fromBuild/res: 8V.9.png
Only in fromBuild/res: 8w.9.png
Only in fromBuild/res: 93.9.png
Only in fromBuild/res: 9A.xml
Only in fromBuild/res: 9S.xml
Only in fromBuild/res: 9t.png
Only in fromBuild/res: 9V.png
Only in fromBuild/res: 9X.9.png
Only in fromBuild/res: 9Z.png
Only in fromBuild/res: A1.xml
Only in fromBuild/res: a2.xml
Only in fromBuild/res: a6.png
Only in fromBuild/res: aA.xml
Only in fromBuild/res: AA.xml
Only in fromBuild/res: AB.9.png
Only in fromBuild/res: Ac.9.png
Only in fromBuild/res: aD.xml
Only in fromBuild/res: aj.xml
Only in fromBuild/res: ak.xml
Only in fromBuild/res: AK.xml
Only in fromBuild/res: Al.xml
Only in fromOfficial/res: anim
Only in fromOfficial/res: animator
Only in fromOfficial/res: animator-v21
Only in fromOfficial/res: anim-v21
Only in fromBuild/res: an.png
Only in fromBuild/res: AP.xml
Only in fromBuild/res: aR.xml
Only in fromBuild/res: au.9.png
Only in fromBuild/res: aV.xml
Only in fromBuild/res: AZ.xml
Only in fromBuild/res: b8.png
Only in fromBuild/res: B8.xml
Only in fromBuild/res: b91.xml
Only in fromBuild/res: b9.xml
Only in fromBuild/res: BA.xml
Only in fromBuild/res: bb.xml
Only in fromBuild/res: bC.xml
Only in fromBuild/res: BG.png
Only in fromBuild/res: bK.9.png
Only in fromBuild/res: bl.xml
Only in fromBuild/res: bn.xml
Only in fromBuild/res: BO.png
Only in fromBuild/res: bT.xml
Only in fromBuild/res: bu.9.png
Only in fromBuild/res: bW.png
Only in fromBuild/res: B-.xml
Only in fromBuild/res: Bx.xml
Only in fromBuild/res: c4.xml
Only in fromBuild/res: C7.xml
Only in fromBuild/res: ca.9.png
Only in fromBuild/res: CA.9.png
Only in fromBuild/res: Cb.xml
Only in fromBuild/res: cc.xml
Only in fromBuild/res: cf.xml
Only in fromBuild/res: Cg.9.png
Only in fromBuild/res: CG.png
Only in fromBuild/res: ch.png
Only in fromBuild/res: cH.xml
Only in fromBuild/res: cM.9.png
Only in fromBuild/res: cs.xml
Only in fromBuild/res: Cv.xml
Only in fromBuild/res: cw.xml
Only in fromBuild/res: -c.xml
Only in fromBuild/res: d1.9.png
Only in fromBuild/res: D2.png
Only in fromBuild/res: d2.xml
Only in fromBuild/res: D5.png
Only in fromBuild/res: dC.png
Only in fromBuild/res: Df.xml
Only in fromBuild/res: DF.xml
Only in fromBuild/res: dH.9.png
Only in fromBuild/res: Di.png
Only in fromBuild/res: dp.xml
Only in fromBuild/res: DP.xml
Only in fromOfficial/res: drawable
Only in fromOfficial/res: drawable-anydpi-v23
Only in fromOfficial/res: drawable-night-v8
Only in fromOfficial/res: drawable-v21
Only in fromOfficial/res: drawable-v23
Only in fromOfficial/res: drawable-watch-v20
Only in fromBuild/res: DS.xml
Only in fromBuild/res: Dt.9.png
Only in fromBuild/res: dv.9.png
Only in fromBuild/res: dV.xml
Only in fromBuild/res: _d.xml
Only in fromBuild/res: e1.xml
Only in fromBuild/res: E2.9.png
Only in fromBuild/res: E3.png
Only in fromBuild/res: e4.9.png
Only in fromBuild/res: E7.xml
Only in fromBuild/res: E9.png
Only in fromBuild/res: eB.9.png
Only in fromBuild/res: Eb.9.png
Only in fromBuild/res: ee.png
Only in fromBuild/res: eh.png
Only in fromBuild/res: ei.9.png
Only in fromBuild/res: ej.xml
Only in fromBuild/res: Ej.xml
Only in fromBuild/res: eK.9.png
Only in fromBuild/res: em.xml
Only in fromBuild/res: eN.xml
Only in fromBuild/res: ER.9.png
Only in fromBuild/res: Er.png
Only in fromBuild/res: eU.xml
Only in fromBuild/res: ew.xml
Only in fromBuild/res: eW.xml
Only in fromBuild/res: Ex.xml
Only in fromBuild/res: Ey.xml
Only in fromBuild/res: f1.xml
Only in fromBuild/res: F8.9.png
Only in fromBuild/res: f9.png
Only in fromBuild/res: fb.png
Only in fromBuild/res: fD.9.png
Only in fromBuild/res: FG.png
Only in fromBuild/res: Fg.xml
Only in fromBuild/res: fH.xml
Only in fromBuild/res: fL.xml
Only in fromBuild/res: FM.9.png
Only in fromBuild/res: fr.9.png
Only in fromBuild/res: fv.9.png
Only in fromBuild/res: fv.xml
Only in fromBuild/res: Fx1.9.png
Only in fromBuild/res: Fx.9.png
Only in fromBuild/res: fx.png
Only in fromBuild/res: FY.png
Only in fromBuild/res: fZ.9.png
Only in fromBuild/res: FZ.xml
Only in fromBuild/res: G7.png
Only in fromBuild/res: gA.xml
Only in fromBuild/res: Gb.xml
Only in fromBuild/res: Ge.xml
Only in fromBuild/res: gG.9.png
Only in fromBuild/res: gL.9.png
Only in fromBuild/res: gl.xml
Only in fromBuild/res: Gn.xml
Only in fromBuild/res: Gq.png
Only in fromBuild/res: GQ.xml
Only in fromBuild/res: Gr.png
Only in fromBuild/res: gT.xml
Only in fromBuild/res: gV.9.png
Only in fromBuild/res: gW.xml
Only in fromBuild/res: gZ.xml
Only in fromBuild/res: Gz.xml
Only in fromBuild/res: h0.9.png
Only in fromBuild/res: H1.xml
Only in fromBuild/res: HA.xml
Only in fromBuild/res: HE.xml
Only in fromBuild/res: hj.9.png
Only in fromBuild/res: Hp.xml
Only in fromBuild/res: HQ.xml
Only in fromBuild/res: HS.9.png
Only in fromBuild/res: hu.xml
Only in fromBuild/res: Hy.xml
Only in fromBuild/res: I3.png
Only in fromBuild/res: I7.xml
Only in fromBuild/res: IC.png
Only in fromBuild/res: ID.xml
Only in fromBuild/res: Ig.xml
Only in fromBuild/res: ih.xml
Only in fromBuild/res: ii.9.png
Only in fromBuild/res: iL.xml
Only in fromBuild/res: In.9.png
Only in fromOfficial/res: interpolator
Only in fromOfficial/res: interpolator-v21
Only in fromBuild/res: iR.xml
Only in fromBuild/res: Iv.xml
Only in fromBuild/res: iw1.xml
Only in fromBuild/res: Iw.png
Only in fromBuild/res: iw.xml
Only in fromBuild/res: J6.9.png
Only in fromBuild/res: J71.xml
Only in fromBuild/res: J7.xml
Only in fromBuild/res: J8.9.png
Only in fromBuild/res: j9.9.png
Only in fromBuild/res: j-.9.png
Only in fromBuild/res: j9.xml
Only in fromBuild/res: ja.xml
Only in fromBuild/res: jB.xml
Only in fromBuild/res: jh.9.png
Only in fromBuild/res: jI.xml
Only in fromBuild/res: jK.9.png
Only in fromBuild/res: Jo.xml
Only in fromBuild/res: JQ.png
Only in fromBuild/res: jR.xml
Only in fromBuild/res: jt.xml
Only in fromBuild/res: JV.png
Only in fromBuild/res: jw.xml
Only in fromBuild/res: jy.png
Only in fromBuild/res: k3.xml
Only in fromBuild/res: K3.xml
Only in fromBuild/res: kB.xml
Only in fromBuild/res: kD.png
Only in fromBuild/res: KD.xml
Only in fromBuild/res: kI.xml
Only in fromBuild/res: kK.9.png
Only in fromBuild/res: kL.xml
Only in fromBuild/res: kM.xml
Only in fromBuild/res: Kp.9.png
Only in fromBuild/res: k_.png
Only in fromBuild/res: ks.xml
Only in fromBuild/res: Ks.xml
Only in fromBuild/res: Kv.xml
Only in fromBuild/res: l2.xml
Only in fromBuild/res: L2.xml
Only in fromOfficial/res: layout
Only in fromOfficial/res: layout-land
Only in fromOfficial/res: layout-sw600dp-v13
Only in fromOfficial/res: layout-v21
Only in fromOfficial/res: layout-v26
Only in fromOfficial/res: layout-watch-v20
Only in fromBuild/res: ld.9.png
Only in fromBuild/res: LD.png
Only in fromBuild/res: lE.xml
Only in fromBuild/res: lF.png
Only in fromBuild/res: lf.xml
Only in fromBuild/res: lJ.xml
Only in fromBuild/res: ll.xml
Only in fromBuild/res: LN.xml
Only in fromBuild/res: Lo.png
Only in fromBuild/res: L_.png
Only in fromBuild/res: lP.png
Only in fromBuild/res: Lq.9.png
Only in fromBuild/res: lR.xml
Only in fromBuild/res: LT.xml
Only in fromBuild/res: lW.xml
Only in fromBuild/res: _l.xml
Only in fromBuild/res: M4.xml
Only in fromBuild/res: m6.xml
Only in fromBuild/res: M6.xml
Only in fromBuild/res: m9.9.png
Only in fromBuild/res: MC.xml
Only in fromBuild/res: MD.xml
Only in fromOfficial/res: menu
Only in fromBuild/res: MH.xml
Only in fromOfficial/res: mipmap-anydpi-v26
Only in fromOfficial/res: mipmap-hdpi-v4
Only in fromOfficial/res: mipmap-mdpi-v4
Only in fromOfficial/res: mipmap-xhdpi-v4
Only in fromOfficial/res: mipmap-xxhdpi-v4
Only in fromOfficial/res: mipmap-xxxhdpi-v4
Only in fromBuild/res: mi.xml
Only in fromBuild/res: Ml.9.png
Only in fromBuild/res: mn.png
Only in fromBuild/res: mN.xml
Only in fromBuild/res: MN.xml
Only in fromBuild/res: MP.xml
Only in fromBuild/res: MQ.xml
Only in fromBuild/res: Mr.9.png
Only in fromBuild/res: MR.png
Only in fromBuild/res: mU.png
Only in fromBuild/res: MY.xml
Only in fromBuild/res: Mz.9.png
Only in fromBuild/res: n0.png
Only in fromBuild/res: n3.xml
Only in fromBuild/res: n6.xml
Only in fromBuild/res: n9.9.png
Only in fromBuild/res: N9.xml
Only in fromBuild/res: NA.xml
Only in fromBuild/res: nB.png
Only in fromBuild/res: nd1.png
Only in fromBuild/res: nd.png
Only in fromBuild/res: NI.xml
Only in fromBuild/res: nl.xml
Only in fromBuild/res: NM.9.png
Only in fromBuild/res: NP.9.png
Only in fromBuild/res: n_.png
Only in fromBuild/res: NR.xml
Only in fromBuild/res: ns.png
Only in fromBuild/res: NU.xml
Only in fromBuild/res: nz.xml
Only in fromBuild/res: o1.xml
Only in fromBuild/res: O3.9.png
Only in fromBuild/res: O8.xml
Only in fromBuild/res: Of1.9.png
Only in fromBuild/res: Of.9.png
Only in fromBuild/res: Of.xml
Only in fromBuild/res: Oh.xml
Only in fromBuild/res: OK.xml
Only in fromBuild/res: oL.png
Only in fromBuild/res: on.xml
Only in fromBuild/res: oR.9.png
Only in fromBuild/res: Ot.png
Only in fromBuild/res: Ou.png
Only in fromBuild/res: Ov.xml
Only in fromBuild/res: Ow.xml
Only in fromBuild/res: -o.xml
Only in fromBuild/res: o-.xml
Only in fromBuild/res: oz.xml
Only in fromBuild/res: p4.png
Only in fromBuild/res: p7.xml
Only in fromBuild/res: PA.xml
Only in fromBuild/res: pe.xml
Only in fromBuild/res: pF.9.png
Only in fromBuild/res: PF.xml
Only in fromBuild/res: Pi.9.png
Only in fromBuild/res: PK.png
Only in fromBuild/res: Pp.xml
Only in fromBuild/res: Pq.9.png
Only in fromBuild/res: Px.xml
Only in fromBuild/res: q0.xml
Only in fromBuild/res: Q11.9.png
Only in fromBuild/res: Q1.9.png
Only in fromBuild/res: q1.xml
Only in fromBuild/res: Q1.xml
Only in fromBuild/res: q4.xml
Only in fromBuild/res: q61.xml
Only in fromBuild/res: q6.xml
Only in fromBuild/res: QD.9.png
Only in fromBuild/res: Qi.png
Only in fromBuild/res: Qj.xml
Only in fromBuild/res: qK.xml
Only in fromBuild/res: qL.xml
Only in fromBuild/res: -q.png
Only in fromBuild/res: qQ.xml
Only in fromBuild/res: qr.9.png
Only in fromBuild/res: qS.xml
Only in fromBuild/res: Qv.png
Only in fromBuild/res: Qw.xml
Only in fromBuild/res: r0.xml
Only in fromBuild/res: R2.xml
Only in fromBuild/res: r5.xml
Only in fromBuild/res: R6.xml
Only in fromBuild/res: rb.9.png
Only in fromBuild/res: rb.xml
Only in fromBuild/res: rc.xml
Only in fromBuild/res: rE.xml
Only in fromBuild/res: rJ.xml
Only in fromBuild/res: rM.xml
Only in fromBuild/res: rn.png
Only in fromBuild/res: _R.png
Only in fromBuild/res: Rq.xml
Only in fromBuild/res: rt.xml
Only in fromBuild/res: RT.xml
Only in fromBuild/res: Ru.xml
Only in fromBuild/res: r-.xml
Only in fromBuild/res: rX.xml
Only in fromBuild/res: Rx.xml
Only in fromBuild/res: s2.9.png
Only in fromBuild/res: s6.xml
Only in fromBuild/res: SD.png
Only in fromBuild/res: Sf.xml
Only in fromBuild/res: sh.xml
Only in fromBuild/res: SH.xml
Only in fromBuild/res: sL.9.png
Only in fromBuild/res: S_.png
Only in fromBuild/res: SQ.xml
Only in fromBuild/res: Sr.png
Only in fromBuild/res: SS.xml
Only in fromBuild/res: st.9.png
Only in fromBuild/res: St.xml
Only in fromBuild/res: SU.xml
Only in fromBuild/res: T2.9.png
Only in fromBuild/res: t9.xml
Only in fromBuild/res: tb.xml
Only in fromBuild/res: tE.xml
Only in fromBuild/res: TF.9.png
Only in fromBuild/res: tj.9.png
Only in fromBuild/res: tk.xml
Only in fromBuild/res: TK.xml
Only in fromBuild/res: Tl.9.png
Only in fromBuild/res: tM.9.png
Only in fromBuild/res: tm.xml
Only in fromBuild/res: to.xml
Only in fromBuild/res: TQ.png
Only in fromBuild/res: tQ.xml
Only in fromBuild/res: tr.9.png
Only in fromBuild/res: tR.xml
Only in fromBuild/res: Ts.xml
Only in fromBuild/res: -t.xml
Only in fromBuild/res: u3.png
Only in fromBuild/res: u3.xml
Only in fromBuild/res: U3.xml
Only in fromBuild/res: uB.9.png
Only in fromBuild/res: UE.png
Only in fromBuild/res: uF.xml
Only in fromBuild/res: ug.xml
Only in fromBuild/res: Ug.xml
Only in fromBuild/res: uo.xml
Only in fromBuild/res: UO.xml
Only in fromBuild/res: U_.png
Only in fromBuild/res: uP.xml
Only in fromBuild/res: UQ1.xml
Only in fromBuild/res: UQ.xml
Only in fromBuild/res: Us.9.png
Only in fromBuild/res: uu.png
Only in fromBuild/res: UU.xml
Only in fromBuild/res: Uw.png
Only in fromBuild/res: -u.xml
Only in fromBuild/res: uZ.png
Only in fromBuild/res: Uz.xml
Only in fromBuild/res: V-1.9.png
Only in fromBuild/res: V1.xml
Only in fromBuild/res: v2.xml
Only in fromBuild/res: V4.png
Only in fromBuild/res: v6.9.png
Only in fromBuild/res: v8.xml
Only in fromBuild/res: V-.9.png
Only in fromBuild/res: V9.png
Only in fromBuild/res: V9.xml
Only in fromBuild/res: va.png
Only in fromBuild/res: va.xml
Only in fromBuild/res: vc.xml
Only in fromBuild/res: vd.png
Only in fromBuild/res: vD.xml
Only in fromBuild/res: Ve.xml
Only in fromBuild/res: vH.xml
Only in fromBuild/res: vI.png
Only in fromBuild/res: VK.9.png
Only in fromBuild/res: vl.xml
Only in fromBuild/res: Vl.xml
Only in fromBuild/res: vM.xml
Only in fromBuild/res: VN.png
Only in fromBuild/res: vp.xml
Only in fromBuild/res: vP.xml
Only in fromBuild/res: Vq.png
Only in fromBuild/res: VW1.png
Only in fromBuild/res: VW.png
Only in fromBuild/res: VW.xml
Only in fromBuild/res: VX.png
Only in fromBuild/res: vy.9.png
Only in fromBuild/res: vz.xml
Only in fromBuild/res: wA.xml
Only in fromBuild/res: Wc.xml
Only in fromBuild/res: wG1.xml
Only in fromBuild/res: wG.xml
Only in fromBuild/res: WG.xml
Only in fromBuild/res: wi1.9.png
Only in fromBuild/res: wi.9.png
Only in fromBuild/res: wI.png
Only in fromBuild/res: wK.9.png
Only in fromBuild/res: wL.9.png
Only in fromBuild/res: wN.png
Only in fromBuild/res: Wn.xml
Only in fromBuild/res: wo.xml
Only in fromBuild/res: WO.xml
Only in fromBuild/res: W-.png
Only in fromBuild/res: WP.xml
Only in fromBuild/res: wT1.png
Only in fromBuild/res: WT1.xml
Only in fromBuild/res: wT.png
Only in fromBuild/res: WT.xml
Only in fromBuild/res: wu.xml
Only in fromBuild/res: WU.xml
Only in fromBuild/res: wY.xml
Only in fromBuild/res: x1.xml
Only in fromBuild/res: X3.9.png
Only in fromBuild/res: x5.9.png
Only in fromBuild/res: X5.png
Only in fromBuild/res: XB.xml
Only in fromBuild/res: xc.xml
Only in fromOfficial/res: xml
Only in fromBuild/res: XM.xml
Only in fromBuild/res: Xp.9.png
Only in fromBuild/res: Xs1.9.png
Only in fromBuild/res: Xs.9.png
Only in fromBuild/res: xs.xml
Only in fromBuild/res: XS.xml
Only in fromBuild/res: xy.xml
Only in fromBuild/res: Y6.xml
Only in fromBuild/res: ya.xml
Only in fromBuild/res: YA.xml
Only in fromBuild/res: YF.xml
Only in fromBuild/res: YH.9.png
Only in fromBuild/res: Yh.png
Only in fromBuild/res: yJ.png
Only in fromBuild/res: yO.9.png
Only in fromBuild/res: yP.xml
Only in fromBuild/res: YQ.xml
Only in fromBuild/res: Yt.9.png
Only in fromBuild/res: YW.png
Only in fromBuild/res: -Y.xml
Only in fromBuild/res: yx.xml
Only in fromBuild/res: z1.xml
Only in fromBuild/res: z3.xml
Only in fromBuild/res: Z4.xml
Only in fromBuild/res: Za.xml
Only in fromBuild/res: ZF.xml
Only in fromBuild/res: zH.xml
Only in fromBuild/res: zq.xml
Only in fromBuild/res: ZW.xml
Binary files fromBuild/resources.arsc and fromOfficial/resources.arsc differ
Only in fromOfficial: stamp-cert-sha256
```

This app is **not reproducible**.

{% include asciicast %}

