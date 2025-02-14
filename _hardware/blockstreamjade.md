---
title: Jade
appId: blockstreamjade
authors:
- kiwilamb
- leo
- danny
released: '2021-01-01'
discontinued: 
updated: '2024-11-27'
version: '1.0.33'
binaries: https://jadefw.blockstream.com/bin/jade/index.json
dimensions:
- 24
- 60
- 17
weight: 21
provider: Blockstream Corporation Inc.
providerWebsite: https://blockstream.com/
website: https://blockstream.com/jade/
shop: https://store.blockstream.com/products/blockstream-jade-hardware-wallet
country: CA
price: 64.99USD
repository: https://github.com/Blockstream/jade
issue: 
icon: blockstreamjade.png
bugbounty: 
meta: ok
verdict: reproducible
appHashes:
- feb8ae2404816c9933f9bc2596329ca5976224c66b3a847c168be65797351d71
- 7ad0dbbbfe33267665df5467ce1cbbbb6c3f139562177a276dbfb91d0edaca67
- d76a0cf87df6900477b1fbd1512a6d0fc4bf99a7a4c80e04313eb2c1beb4d17c
- 26230eb16f4e849b98316f4ed1fa8fd3ba4e11d9ff339d5bac4e6934e315ab03
date: '2024-12-17'
signer: 
reviewArchive:
- date: '2024-11-01'
  version: '1.0.32'
  appHashes:
  - 2f5bb1939061ff13e5f8a5ca52aa51641558a2b5356219d7a5c4138245f71f11
  gitRevision: d77578a578f6cff4c6e5b83ddfb426a3267f355a
  verdict: reproducible
- date: '2024-08-26'
  version: '1.0.31'
  appHashes:
  - 26c918f0e7281b9cc8fdfc10baae2e5a8ac6edf0cd08e699a913daea3b97d04e
  gitRevision: 0e340f881dd801491bb0f70aa3bc4a6850f74654
  verdict: reproducible
- date: '2024-05-15'
  version: '1.0.30'
  appHashes:
  - d62518df363ceb7002c171baf8149c644dd8dbb57b4f122db0c4b1dc5707328d
  gitRevision: ecbebc9a15b23cf32825669dd3ebb1a647f7a332
  verdict: reproducible
- date: '2024-05-06'
  version: '1.0.29'
  appHashes:
  - ed9e949c2fea08ed56d9c842ffc94c5a9698dca78502137376bd0e421afbabf5
  gitRevision: 05794276d43d37b58420a1cb0c75f47d894c26ba
  verdict: reproducible
- date: '2024-03-11'
  version: '1.0.27'
  appHashes:
  - db3ea043b891c862401d110923be04b0c2ef9b100c57cad22ca345b032efc448
  gitRevision: 633cb64f6b6704924bd57b45747de4c7d1c281a7
  verdict: reproducible
- date: '2023-11-29'
  version: '1.0.26'
  appHashes: []
  gitRevision: 
  verdict: nonverifiable
- date: '2023-11-08'
  version: '1.0.26'
  appHashes:
  - 3ca3e6758bbf8a971b16c09f51871426fcee4a1681b45f1a892f2a94b725508e
  gitRevision: 4348653c9aff5fac3365bcf45fc4880b2046d619
  verdict: reproducible
- date: '2023-11-07'
  version: '1.0.24'
  appHashes: []
  gitRevision: d95ae2fe9c4fd50ffb947bdbed402de736ad7568
  verdict: reproducible
- date: '2023-10-11'
  version: '1.0.23'
  appHashes:
  - c6124408b51ffe0711ea7dbe02c3cca7a3f317c4d7d137212a2e6a78660f7daa
  gitRevision: 8f74ecbffe3020d502801e7f43c693c4b3fd272e
  verdict: reproducible
- date: '2023-08-07'
  version: '1.0.21'
  appHashes: []
  gitRevision: b164591d0b50c2a0616d8b75f8efee8202fecc8b
  verdict: reproducible
- date: '2023-06-29'
  version: '0.1.48'
  appHashes:
  - d329dbf4fea13c6cde7df9682febae15e162947dc5a747aae98540f69e1a25d3
  gitRevision: e00377473e377b6baa0488479f35cb9307874e97
  verdict: nonverifiable
- date: '2022-08-07'
  version: '0.1.33'
  appHashes: []
  gitRevision: 89390dfa4b632ab1261a523e1988c81ce2e47710
  verdict: nonverifiable
twitter: Blockstream
social:
- https://www.linkedin.com/company/blockstream
- https://www.facebook.com/Blockstream
- https://t.me/blockstream
- https://www.youtube.com/channel/UCZNt3fZazX9cwWcC9vjDJ4Q
features: 

---

We modified the build script due to this [issue](https://github.com/Blockstream/Jade/issues/191). 
A temporary workaround is to add a line in the script that would remove the '--recursive' flag to prevent the cloning of the problematic QEMU submodule.

```
`$ ./scripts/test/hardware/blockstreamjade.sh 1.0.33`
...
Results:
feb8ae2404816c9933f9bc2596329ca5976224c66b3a847c168be65797351d71  jade_1.0.33_10_ble.bin
721a47ee98eb6b91e81b0b2ef2096d99e6fbd83ff25db5f37c883588905103e3  jade_1.0.33_10_ble.built.bin
721a47ee98eb6b91e81b0b2ef2096d99e6fbd83ff25db5f37c883588905103e3  jade_1.0.33_10_ble_stripped.bin
8a8a3d571a7340ddd850db9dff832a991f1b371965100b1b3258666f56ac3b0a  jade_1.0.33_10_ble.bin.gz
The Jade firmware version 1.0.33 10_ble is reproducible with above hashes.
7ad0dbbbfe33267665df5467ce1cbbbb6c3f139562177a276dbfb91d0edaca67  jade_1.0.33_10_noR.bin
684859947657a9d2763cc1f339f3fbfaaab9629ccd45a52ca6c565f48de5b706  jade_1.0.33_10_noR.built.bin
684859947657a9d2763cc1f339f3fbfaaab9629ccd45a52ca6c565f48de5b706  jade_1.0.33_10_noR_stripped.bin
3c9745b08454848c60210c34ff07a4487be9075e467d7e520e932114970405b4  jade_1.0.33_10_noR.bin.gz
The Jade firmware version 1.0.33 10_noR is reproducible with above hashes.
d76a0cf87df6900477b1fbd1512a6d0fc4bf99a7a4c80e04313eb2c1beb4d17c  jade_1.0.33_11_ble.bin
42e3ab3fd5ac0f7c915c67ffc884f33b38ebb6bc0532cb8e94f3b7187871810f  jade_1.0.33_11_ble.built.bin
42e3ab3fd5ac0f7c915c67ffc884f33b38ebb6bc0532cb8e94f3b7187871810f  jade_1.0.33_11_ble_stripped.bin
41d0cf7ce238ccd6d682942335ec3b331e4697dcff62690f3c2f795061ea289a  jade_1.0.33_11_ble.bin.gz
The Jade firmware version 1.0.33 11_ble is reproducible with above hashes.
26230eb16f4e849b98316f4ed1fa8fd3ba4e11d9ff339d5bac4e6934e315ab03  jade_1.0.33_11_noR.bin
bbd84f8f989a705c4df0ca40657324ca983a116c3041c59d4247f7d1b9033c01  jade_1.0.33_11_noR.built.bin
bbd84f8f989a705c4df0ca40657324ca983a116c3041c59d4247f7d1b9033c01  jade_1.0.33_11_noR_stripped.bin
0c87cead4a187ee90fa3f77aec1b7632b49c12fa28bae51193ab14111b9ed936  jade_1.0.33_11_noR.bin.gz
The Jade firmware version 1.0.33 11_noR is reproducible with above hashes.
```

Firmware version 1.0.33 of {{ page.title }} is **reproducible**

{% include asciicast %}
