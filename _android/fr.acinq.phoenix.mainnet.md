---
wsId: phoenix
title: Phoenix - LN Bitcoin wallet
altTitle: 
authors:
- leo
users: 10000
appId: fr.acinq.phoenix.mainnet
appCountry: us
released: 2019-12-10
updated: 2023-02-09
version: 1.4.26
stars: 4.5
ratings: 314
reviews: 28
size: 
website: https://phoenix.acinq.co
repository: https://github.com/ACINQ/phoenix
issue: https://github.com/ACINQ/phoenix/issues/112
icon: fr.acinq.phoenix.mainnet.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2023-04-15
signer: ed550bd5d607d342b61bbbbb94ffd4dde43f845171f63d3ae47573a95a132629
reviewArchive:
- date: 2022-01-24
  version: 1.4.0
  appHash: 
  gitRevision: 9e8019958ef1d5e0558fc160cde8c84a949850aa
  verdict: ftbfs
- date: 2021-07-20
  version: 1.4.2
  appHash: 
  gitRevision: e678a81ce1e01c333d7e72cf57531dfd39741ef9
  verdict: nonverifiable
- date: 2020-10-24
  version: 1.4.0
  appHash: 4689d6249e86442ab3657756d9971c9b0894051728dab214a43778665bbc9d43
  gitRevision: 84f019731e8c51e8df2232d12f9632d284769cf8
  verdict: nonverifiable
- date: 2020-08-14
  version: 1.3.3
  appHash: 29211695f12c794d0e5edc883315810cf29d22e7ad8fdcd1da7755abec6aff4d
  gitRevision: 88e1f6824c733c848222ad885673a909ece99ffb
  verdict: reproducible
- date: 2020-01-13
  version: 1.3.1
  appHash: 0c91c5f118f88b9715d20323799d5002b722115d01c95d11f20f088521f76ada
  gitRevision: 9abba57f047955e9991baa269f2082e8f3374f95
  verdict: nonverifiable
twitter: PhoenixWallet
social: 
redirect_from:
- /fr.acinq.phoenix.mainnet/
- /posts/fr.acinq.phoenix.mainnet/
features:
- ln

---

Here we test if the latest version can be verified, following the known
procedure expressed in our {% include testScript.html %}:

```
===== Begin Results =====
appId:          fr.acinq.phoenix.mainnet
signer:         ed550bd5d607d342b61bbbbb94ffd4dde43f845171f63d3ae47573a95a132629
apkVersionName: 1.4.26
apkVersionCode: 41
verdict:        
appHash:        512bf20aa99e781726b55d1e508ef58c390fa24692c93d6299a82b8ccd24a8b8
commit:         df5e87caa87b4d701c001c59f48ecc4764c3814b

Diff:
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_41/assets/dexopt/baseline.prof and /tmp/fromBuild_fr.acinq.phoenix.mainnet_41/assets/dexopt/baseline.prof differ
Files /tmp/fromPlay_fr.acinq.phoenix.mainnet_41/classes3.dex and /tmp/fromBuild_fr.acinq.phoenix.mainnet_41/classes3.dex differ
Only in /tmp/fromPlay_fr.acinq.phoenix.mainnet_41/META-INF: MAINNET.RSA
Only in /tmp/fromPlay_fr.acinq.phoenix.mainnet_41/META-INF: MAINNET.SF
Only in /tmp/fromPlay_fr.acinq.phoenix.mainnet_41/META-INF: MANIFEST.MF

Revision, tag (and its signature):

===== End Results =====
```

This app is **not reproducible**. A closer look into the diff, using
`diffoscope` reveals hundreds of differing line numbers in the decompiled
code and examples like:

```
│ │ ├── fr/acinq/phoenix/legacy/db/phoenixlegacy/DatabaseImpl$Schema.class
│ │ │ ├── procyon -ec {}
│ │ │ │ @@ -17,17 +17,17 @@
│ │ │ │      
│ │ │ │      private DatabaseImpl$Schema() {
│ │ │ │      }
│ │ │ │      
│ │ │ │      public void create(final SqlDriver sqlDriver) {
│ │ │ │          Intrinsics.checkNotNullParameter((Object)sqlDriver, "driver");
│ │ │ │          final int n = 8;
│ │ │ │ +        SqlDriver$DefaultImpls.execute$default(sqlDriver, (Integer)null, "CREATE TABLE NodeMeta (\n  pub_key TEXT NOT NULL PRIMARY KEY,\n  alias TEXT NOT NULL,\n  update_timestamp INTEGER NOT NULL,\n  custom_alias TEXT\n)", 0, (Function1)null, n, (Object)null);
│ │ │ │          SqlDriver$DefaultImpls.execute$default(sqlDriver, (Integer)null, "CREATE TABLE PayToOpenMeta (\n  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,\n  payment_hash TEXT NOT NULL,\n  fee_sat INTEGER NOT NULL,\n  amount_sat INTEGER NOT NULL,\n  capacity_sat INTEGER NOT NULL,\n  timestamp INTEGER NOT NULL\n)", 0, (Function1)null, n, (Object)null);
│ │ │ │          SqlDriver$DefaultImpls.execute$default(sqlDriver, (Integer)null, "CREATE TABLE PaymentMeta (\n  id TEXT NOT NULL PRIMARY KEY,\n\n  swap_in_address TEXT DEFAULT NULL,\n  swap_in_tx TEXT DEFAULT NULL,\n\n  swap_out_address TEXT DEFAULT NULL,\n  swap_out_tx TEXT DEFAULT NULL,\n  swap_out_feerate_per_byte INTEGER DEFAULT NULL,\n  swap_out_fee_sat INTEGER DEFAULT NULL,\n  swap_out_conf INTEGER DEFAULT NULL,\n\n  funding_tx TEXT DEFAULT NULL,\n  funding_fee_pct REAL DEFAULT NULL,\n  funding_fee_raw_sat INTEGER DEFAULT NULL,\n\n  closing_type INTEGER DEFAULT NULL,\n  closing_channel_id TEXT UNIQUE DEFAULT NULL,\n  closing_spending_txs TEXT DEFAULT NULL,\n  closing_main_output_script TEXT DEFAULT NULL,\n  closing_cause TEXT DEFAULT NULL,\n\n  custom_desc TEXT DEFAULT NULL,\n\n  lnurlpay_url TEXT DEFAULT NULL,\n  lnurlpay_action_typeversion TEXT DEFAULT NULL,\n  lnurlpay_action_data TEXT DEFAULT NULL,\n  lnurlpay_meta_description TEXT DEFAULT NULL,\n  lnurlpay_meta_long_description TEXT DEFAULT NULL,\n  lnurlpay_meta_identifier TEXT DEFAULT NULL,\n  lnurlpay_meta_email TEXT DEFAULT NULL\n)", 0, (Function1)null, n, (Object)null);
│ │ │ │ -        SqlDriver$DefaultImpls.execute$default(sqlDriver, (Integer)null, "CREATE TABLE NodeMeta (\n  pub_key TEXT NOT NULL PRIMARY KEY,\n  alias TEXT NOT NULL,\n  update_timestamp INTEGER NOT NULL,\n  custom_alias TEXT\n)", 0, (Function1)null, n, (Object)null);
│ │ │ │          SqlDriver$DefaultImpls.execute$default(sqlDriver, (Integer)null, "CREATE INDEX IF NOT EXISTS paytoopen_payment_hash_index ON PayToOpenMeta(payment_hash)", 0, (Function1)null, n, (Object)null);
│ │ │ │          SqlDriver$DefaultImpls.execute$default(sqlDriver, (Integer)null, "CREATE INDEX IF NOT EXISTS payment_closing_channel_id_index ON PaymentMeta(closing_channel_id)", 0, (Function1)null, n, (Object)null);
│ │ │ │      }
│ │ │ │      
│ │ │ │      public int getVersion() {
│ │ │ │          return 3;
│ │ │ │      }
```

might be due to a
[known issue with sqldelight](https://github.com/cashapp/sqldelight/issues/1548),
a library this product
[does use](https://github.com/ACINQ/phoenix/blob/4ab872b8b05aef12227f9a17bab96c328a1068ce/phoenix-shared/build.gradle.kts#L7).

Other diffs are harder to interpret. `assets/dexopt/baseline.prof` appears to be
a "Baseline Profile" to speed up startup time but of course could for all we
know contain anything. The diff with `diffoscope`:

```
├── assets/dexopt/baseline.prof
│ @@ -1,118 +1,118 @@
│  00000000: 7072 6f00 3031 3000 04db 0701 0047 0700  pro.010......G..
│ -00000010: 0078 01ed 9d6d 6895 6518 c7af 67cf d93c  .x...mh.e...g..<
│ -00000020: 7353 a7f3 65a9 cde3 0b99 29b2 dc04 cb97  sS..e.....).....
│ -00000030: e68c 61d4 07a5 1784 22b7 cc97 4086 b108  ..a....."...@...
│ -00000040: 4963 8f34 5f22 4b43 93c8 8a11 7e88 8230  Ic.4_"KC....~..0
│ -00000050: 90a0 083a a694 7d88 0919 4488 4dea 8341  ...:..}...D.M..A
│ -00000060: 4323 13cb 5a5d ff73 ce7f de1e 2608 4ef4  C#..Z].s....&.N.
│ -00000070: c3ff 19f7 b9ae fbbe 5eee ebfe 3dcf 3967  ........^...=.9g
│ -00000080: 7b9e f39c 55d8 565b 516e 36f2 8def 6b7b  {...U.V[Qn6...k{
│ -00000090: ff33 5bb5 beb5 bd7d 75fb eca7 576f ac34  .3[....}u...Wo.4
│ -000000a0: b306 6f4f ec3d 5a1f 5f36 cda1 adce 6d99  ..oO.=Z._6....m.
│ -000000b0: 155b ca5f edeb 0fab a76d b4db 5a1e 39f6  .[._.....m..Z.9.
│ -000000c0: e4d1 f3fd b606 d832 fbcc 526e 2b09 5aa9  .......2..Rn+.Z.
│ -000000d0: eb71 a11f b91c 5ad0 1f70 d9ec adcc 1bc6  .q....Z..p......
│ -000000e0: c336 ccfb d585 b130 163a f2c1 37ed 2db4  .6.....0.:..7.-.
│ -000000f0: 714e d850 03fc 8678 2bce 8f18 34f8 c187  qN.P...x+...4...
│ +00000010: 0078 01ed 9d6b 8854 6518 c79f b367 7676  .x...k.Te....gvv
│ +00000020: d65d 5d75 bd4c 6a3a 5ec8 4c91 4d57 b0bc  .]]u.Lj:^.L.MW..
│ +00000030: b46a 8851 1f94 2e04 45ee 665e 0259 8c8d  .j.Q....E.f^.Y..
│ +00000040: 9034 f648 eb25 b234 3489 ac58 c20f 5110  .4.H.%.44..X..Q.
│ +00000050: 0612 1441 634a e987 50c8 2042 6ca5 3e18  ...AcJ..P. Bl.>.
│ +00000060: b468 6462 595b cf7f 66fe ebeb b082 a0e2  .hdbY[..f.......
│ +00000070: 7ef8 9fe5 9de7 79df e7f2 3eef ef9c 99d9  ~.....y...>.....
│ +00000080: 3d67 ce6c 8d6d b6c7 abcd 86bc f9fd d8ee  =g.l.m..........
│ +00000090: ffcc 56ac 6d69 6b5b d936 fd99 95eb 6bcd  ..V.mik[.6....k.
│ +000000a0: acd1 db93 bb0f cf8c 2f9b 66d0 d6e0 b633  ......../.f....3
│ +000000b0: 7547 1b5f ebe9 0d9b 49db 30b7 353f 72e4  uG._....I.0.5?r.
│ +000000c0: a9c3 e77b 6d8d b0e5 f698 a5dc 5611 b44a  ...{m.......V..J
│ +000000d0: d7e3 523f 7239 a0a4 3fe0 72b1 b7b4 378c  ..R?r9..?.r...7.
│ +000000e0: 876d a0f7 eb4b 6361 2c74 e483 6fc6 5b68  .m...Kca,t..o.[h
│ +000000f0: e39c b0a1 06f8 5579 2bcf 8f18 34f8 c187  ......Uy+...4...
│  00000100: 76c4 b306 d859 27e7 62fe d00f 36e6 828e  v....Y'.b...6...
│ -00000110: 7931 27f3 30a6 a260 e378 1887 1a10 471b  y1'.0..`.x....G.
│ -00000120: faf0 0fe7 0975 fa51 729d 90c3 bd41 b271  .....u.Qr....A.q
│ -00000130: 7efa 629f 5367 4eca 0905 1b78 a071 1cfb  ~.b.SgN....x.q..
│ -00000140: 9a31 905c af1f 55fd 3e58 33f7 3b7c c00e  .1.\..U.>X3.;|..
│ -00000150: 9239 185f dcaf 29f2 2bb6 232e 6403 fb40  .9._..).+.#.d..@
│ -00000160: 8df9 29c3 18d4 8b06 a6e0 429f 5067 4ed6  ..).......B.PgN.
│ -00000170: 435b b826 c6f1 7841 9ff5 9209 e210 c33e  C[.&..xA.......>
│ -00000180: 6342 dfb0 36c6 4322 06b9 07b2 0f94 2fcc  cB..6.C"....../.
│ -00000190: 0d9d 3533 27ed 1c47 0e1e 8723 5c67 0c6b  ..53'..G...#\g.k
│ -000001a0: 467f 6c61 9cb1 3c96 59db 9482 9d73 5cad  F.la..<.Y....s\.
│ -000001b0: 2eae 017e f465 1d78 6e33 3f25 7d90 8f3a  ...~.e.xn3?%}..:
│ -000001c0: 25c7 50cb 8c82 1d63 38fe c27d ca63 fbf1  %.P....c8..}.c..
│ -000001d0: 820f 7233 07e4 386f 53bc 71ce 50c2 1ed6  ..r3..8oS.q.P...
│ -000001e0: 0cdb 406b a34f 716c d847 5c18 cb75 d307  ..@k.Oql.G\..u..
│ -000001f0: 73a1 b14f c9e7 0cfa 5503 d899 87b5 4262  s..O....U.....Bb
│ -00000200: cdd8 97bf 7a61 88bb dd1b 24e7 9f59 e873  ....za....$..Y.s
│ -00000210: 0e48 c4e1 7582 7a68 431c f70f 7873 2da8  .H..u.zhC...xs-.
│ -00000220: 0d3a eb86 a4ce b9f8 3a11 be76 3007 e6e0  .:......:..v0...
│ -00000230: 9ce1 7cd0 b1ae 5a6f d091 138c 9993 bcc3  ..|...Zo........
│ +00000110: 7931 27f3 30a6 a664 e378 1887 1a10 471b  y1'.0..d.x....G.
│ +00000120: faf0 0fe7 0975 fa51 729d 9083 bc41 b271  .....u.Qr....A.q
│ +00000130: 7efa 629f 5367 4eca d125 1b78 a071 1cfb  ~.b.SgN..%.x.q..
│ +00000140: 9a31 905c af1f 55bd 3e58 33f7 3b7c c00e  .1.\..U.>X3.;|..
│ +00000150: 9239 185f decf 96f9 95db 1117 b281 bdaf  .9._............
│ +00000160: c6fc 9461 0cea 4503 5370 a14f a833 27eb  ...a..E.Sp.O.3'.
│ +00000170: a12d 5c13 e378 bca0 cf7a c904 7188 619f  .-\..x...z..q.a.
│ +00000180: 31a1 6f58 1be3 2111 83dc 7dd9 fbca 17e6  1.oX..!...}.....
│ +00000190: 86ce 9a99 9376 8e23 078f c33a d719 c39a  .....v.#...:....
│ +000001a0: d11f 511a 672c 8f65 d636 a164 e71c 57ab  ..Q.g,.e.6.d..W.
│ +000001b0: 8b6b 801f 7d59 079e dbcc 4f49 1fe4 a34e  .k..}Y....OI...N
│ +000001c0: c931 d432 a564 c718 8ebf 709f f2d8 7ea2  .1.2.d....p...~.
│ +000001d0: e483 dccc 0139 d2db 046f 9c33 94b0 8735  .....9...o.3...5
│ +000001e0: c3d6 d7da e853 1e1b f611 17c6 72dd f4c1  .....S......r...
│ +000001f0: 5c68 ec53 f239 83fe e03e eccc c35a 21b1  \h.S.9...>...Z!.
│ +00000200: 66ec cb5f bd30 c4dd ee0d 92f3 4f2d f539  f.._.0......O-.9
│ +00000210: 0724 e2f0 3a41 3db4 218e fb07 bcb9 16d4  .$..:A=.!.......
│ +00000220: 069d 7543 52e7 5c7c 9d08 5f3b 9803 7370  ..uCR.\|.._;..sp
│ +00000230: ce70 3ee8 58d7 586f d091 138c 9993 bcc3  .p>.X.Xo........
│  00000240: 9c1c 0be7 a73f 7241 c771 81e3 033a 5f13  .....?rA.q...:_.
│ -00000250: a187 7533 0fb9 16d7 c5fe 668f 83ce fd83  ..u3......f.....
│ +00000250: a187 7533 0fb9 96d7 c5fe 468f 83ce fd83  ..u3......F.....
│  00000260: 1cd4 5933 7223 1feb 676d b0c3 c65c f009  ..Y3r#..gm...\..
│ -00000270: fb1c 1f53 f009 e398 9b12 75c2 0ea6 57ab  ...S......u...W.
│ -00000280: 19f9 6ff3 c6bc cc37 b130 16c6 51a7 0f63  ..o....7.0..Q..c
│ +00000270: fb1c 1f5e f209 e398 9b12 75c2 0ea6 57ab  ...^......u...W.
│ +00000280: 19f9 6ff3 c6bc cc37 a634 16c6 51a7 0f63  ..o....7.4..Q..c
│  00000290: 2831 7e35 5b58 13f4 9007 e331 27d6 8a79  (1~5[X.....1'..y
│ -000002a0: 28f1 9ecd f7ed 709c 76ca 623f e69c edf1  (.....p.v.b?....
│ +000002a0: 28f1 9ecd f7ed 709c 76ca 723f e69c eef1  (.....p.v.r?....
│  000002b0: d0c1 80c7 1b9e 03e1 7b11 7284 afd1 8c2d  ........{.r....-
│ -000002c0: 96f0 c318 eae0 3a79 9c21 27c6 33de e0c3  ......:y.!'.3...
│ +000002c0: 97f0 c318 eae0 3a79 9c21 27c6 73de e0c3  ......:y.!'.s...
│  000002d0: f561 def0 b9c9 384a f8a2 7648 36ce c3e7  .a....8J..vH6...
│ -000002e0: 15f2 c286 7d85 c63e fd21 990f 1235 b58f  ....}..>.!...5..
│ -000002f0: 8a7c acda d71d 7b6c a98f 4585 9f94 8fe7  .|....{l..E.....
│ -00000300: 7558 aefc a105 b188 4ae5 1ee1 13e7 f260  uX......J......`
│ -00000310: 1c99 2a3d 6fa9 cbe2 9fb2 8257 e47c 9ba3  ..*=o......W.|..
│ -00000320: 7c74 9cf3 2c29 584a 3d43 492e 6f89 fbe4  |t..,)XJ=CI.o...
│ -00000330: e7ab cef5 311f f2a5 9c47 7e7e f42e d77d  ....1....G~~...}
│ -00000340: e55c 18cf fbe7 5791 cf89 d87c 85c8 8cf9  .\....W....|....
│ +000002e0: 15f2 c286 7d85 c63e fd21 990f 1235 b50d  ....}..>.!...5..
│ +000002f0: 8d7c acde d71d 7b6c a58f 45a5 9f94 8f17  .|....{l..E.....
│ +00000300: 7558 aefc a105 b188 4a15 1ee1 1317 f260  uX......J......`
│ +00000310: 1c99 6a3d 6fa5 cbf2 9f74 c92b 72be 8ba3  ..j=o....t.+r...
│ +00000320: 6274 5cf0 ac28 592a 3d43 4521 6f85 fb14  bt\..(Y*=CE!o...
│ +00000330: e7ab 2ff4 311f f2a5 9c47 717e f42e d77d  ../.1....Gq~...}
│ +00000340: e55c 182f fa17 5751 cc89 d862 85c8 8cf9  .\./..WQ...b....
│  00000350: c14b 9b08 8880 0888 8008 8880 0888 8008  .K..............
│ -00000360: 8880 0888 8008 8880 0888 8008 dcda 0496  ................
│ -00000370: 6f6d 4870 662f b7f5 9fd2 3a3c 2431 7ba8  omHpf/....:<$1{.
│ -00000380: baec c0dc a6cc c639 a9f9 5143 d70b af65  .......9..QC...e
│ -00000390: c724 1bb7 cd4b 755d 5a92 49d9 e4ce 7bad  .$...Ku]Z.I...{.
│ -000003a0: cd4f 27d6 a5c7 9b75 dbb0 fbe3 1f36 9965  .O'....u.....6.e
│ -000003b0: 2f3c fbe8 8b6f a732 133f 324b 5acf f7ac  /<...o.2.?2KZ...
│ -000003c0: d9b1 f9e7 7d99 b6be 23b5 77d8 48ab 69f2  ....}...#.w.H.i.
│ -000003d0: 7399 b56f 667c aee4 db5d 732b eda7 4333  s..of|...]s+..C3
│ -000003e0: 7006 d3ba 52e9 c61a 3f8d d7bf 1df7 8b3f  p...R...?......?
│ -000003f0: 3877 d933 6eff aeb3 df9c fe33 9a68 e75a  8w.3n......3.h.Z
│ -00000400: 97fb 29b7 fe52 fb5d 6f21 0567 6aeb 73f5  ..)..R.]o!.gj.s.
│ -00000410: acb4 83d3 ad72 5a74 606e 6c2d c71b cbec  .....rZt`nl-....
│ -00000420: 3ea0 7d65 e7e2 557b 2647 e9dd 9639 f0d5  >.}e..U{&G...9..
│ -00000430: 395c 2b09 b624 9a95 3c38 fa9d a993 cc2e  9\+..$..<8......
│ -00000440: 8c1d da39 c94f bdb6 b9b9 72fb bf7f 57c4  ...9.O....r...W.
│ -00000450: 175d 5bba 349d 5eea 9b3f cecb c5d5 a42d  .][.4.^..?.....-
│ -00000460: 89aa baca fbea 1bee b426 1fca 5a59 89b5  .........&..ZY..
│ -00000470: 0d59 1067 eba6 6cae b8a5 51e5 16a0 0711  .Y.g..l...Q.....
│ -00000480: 1001 1110 0111 1001 1110 0111 1001 1110  ................
│ -00000490: 0111 1001 1110 0111 1001 1110 0111 1001  ................
│ -000004a0: 1110 0111 1001 1110 8141 2290 f960 77d9  .........A"..`w.
│ -000004b0: 32e6 4aa8 642e da32 4b9e f932 f9a4 399d  2.J.d..2K..2..9.
│ -000004c0: eade d632 fdcc b613 dd93 3e8b abba abb6  ...2......>.....
│ -000004d0: db73 1dc3 3b2d d3f9 f088 63bd ee5f d61a  .s..;-....c.._..
│ -000004e0: a77b ee79 ffa5 75b6 c92f 675f ec3b fbe1  .{.y..u../g_.;..
│ -000004f0: ae3d d679 69a1 7f2e 60e7 bb27 177c dc71  .=.yi...`..'.|.q
│ -00000500: 6ad4 d1de 8e93 4752 9912 5bb2 23b2 eccc  j.....GR..[.#...
│ -00000510: ef70 91fc e05f 5f7c 1df7 ec7f 7e48 ee1a  .p...__|....~H..
│ -00000520: f55e 8bd2 718b 0f73 fbd1 6f93 c39d 47ff  .^..q..s..o...G.
│ -00000530: 3cf5 c7ef 0b3f fd7c 5112 dba2 5943 136b  <....?.|Q...YC.k
│ -00000540: a4c3 ad28 13af b805 f747 594f 855d 4825  ...(.....GYO.]H%
│ -00000550: 5ba6 2587 d6f8 f5fb f1c7 ac67 bb8f b6bc  [.%........g....
│ -00000560: 7ef7 baf5 73a6 5934 ca3a 4fd4 f48d 84e7  ~...s.Y4.:O.....
│ -00000570: e5ad 2e29 ddf0 f27b edbf c496 3dd5 b4e5  ...)...{....=...
│ -00000580: dc54 bf98 eff7 6825 a70f aeec 6835 ff48  .T....h%....h5.H
│ -00000590: 8095 9747 51b9 6ffe 881b bffc 36b6 c8ea  ...GQ.o.....6...
│ -000005a0: aca4 e170 c7b6 b2d2 467c 56a2 26db 68d9  ...p....F|V.&.h.
│ -000005b0: de64 add5 3477 762c cef9 e841 0444 4004  .d..4wv,...A.D@.
│ -000005c0: 4440 0444 4004 4440 0444 6050 08cc f2af  D@.D@.D@.D`P....
│ -000005d0: 79c0 5f2f 68f8 5b05 1f5e c667 7ca1 e3b7  y._/h.[..^.g|...
│ -000005e0: 71da f86d 0df8 6605 6dd7 4060 5975 7c57  q..m..f.m.@`Yu|W
│ -000005f0: 32f9 1a1c e522 0222 2002 2220 0222 2002  2...."." ." ." .
│ -00000600: 2220 0222 2002 2220 0222 2002 2220 0222  " ." ." ." ." ."
│ -00000610: 2002 2220 0222 2002 2220 0222 2002 2220   ." ." ." ." ." 
│ -00000620: 0222 70d3 0824 6fd5 6c88 2bf1 3109 6d22  ."p..$o.l.+.1.m"
│ -00000630: 2002 2220 0222 2002 2220 0222 2002 2220   ." ." ." ." ." 
│ -00000640: 0222 2002 2220 0222 2002 2220 0222 2002  ." ." ." ." ." .
│ -00000650: 2220 0222 2002 2220 0222 7073 083c e677  " ." ." ."ps.<.w
│ -00000660: f5f3 867f 4ade fc0f c931 dcbe eedf 0f30  ....J....1.....0
│ -00000670: 885b e3fc 099e 2dd3 3888 2995 4a04 4440  .[....-.8.).J.D@
│ -00000680: 0444 4004 4440 0444 4004 4440 0444 4004  .D@.D@.D@.D@.D@.
│ -00000690: 4440 0444 4004 4440 0444 4004 4440 0444  D@.D@.D@.D@.D@.D
│ -000006a0: 4004 4440 0444 4004 44e0 ba09 9c59 9bfb  @.D@.D@.D....Y..
│ -000006b0: 9701 f85f 01da 4440 0444 4004 4440 0444  ..._..D@.D@.D@.D
│ -000006c0: 4004 4440 0444 4004 4440 0444 4004 4440  @.D@.D@.D@.D@.D@
│ -000006d0: 0444 4004 4440 0444 4004 4440 0444 4004  .D@.D@.D@.D@.D@.
│ -000006e0: 4440 04ae 93c0 1c8f 0fef dd87 9edf 7ea3  D@............~.
│ -000006f0: 2229 0222 2002 2220 0222 2002 2220 0222  ")." ." ." ." ."
│ -00000700: 2002 2220 0222 2002 2220 0222 2002 2220   ." ." ." ." ." 
│ -00000710: 0222 2002 2220 0222 2002 2220 0237 8040  ." ." ." ." .7.@
│ -00000720: 76c4 0d48 aa94 2220 0222 2002 2220 0222  v..H.." ." ." ."
│ -00000730: 2002 2220 0222 2002 2220 0222 2002 2220   ." ." ." ." ." 
│ -00000740: 0222 2002 2220 0222 2002 2220 0222 2002  ." ." ." ." ." .
│ -00000750: 2260 f63f a179 d151                      "`.?.y.Q
│ +00000360: 8880 0888 8008 8880 0888 8008 f46f 02cb  .............o..
│ +00000370: 3637 2638 b357 d87a 4f69 1dac 4acc 1eaa  67&8.W.zOi..J...
│ +00000380: 4fef 9bb5 30b7 7e46 6a4e d4d8 f9e2 ebf9  O...0.~FjN......
│ +00000390: e1c9 fa2d b353 9d97 16e5 5236 bee3 5e6b  ...-.S....R6..^k
│ +000003a0: f5d3 890d 9951 66c7 6ce0 fdf1 0f1b ccf2  .....Qf.l.......
│ +000003b0: 179e 7bf4 a577 52b9 311f 9b25 2de7 bb56  ..{..wR.1..%-..V
│ +000003c0: 6ddb f8f3 9e5c 6bcf a1b1 77d8 10cb 2ef4  m....\k...w.....
│ +000003d0: 7399 63df caf9 5cc9 b73b 66d5 da4f 07a6  s.c...\..;f..O..
│ +000003e0: e00c a675 a632 4d59 3f8d d7bb 1df7 8b3f  ...u.2MY?......?
│ +000003f0: 3877 d935 72ef 8eb3 474f ff19 8db1 732d  8w.5r...GO....s-
│ +00000400: cbfc 945b 6fa9 bdae fd48 c199 da99 857a  ...[o....H.....z
│ +00000410: 96db fec9 563b 29da 372b b6e6 e34d 69bb  ....V;).7+...Mi.
│ +00000420: 0f68 5fdd be60 c5ae f151 66a7 e5f6 7d7d  .h_..`...Qf...}}
│ +00000430: 0ed7 4a82 2d89 a625 0f0e 7b77 e238 b30b  ..J.-..%..{w.8..
│ +00000440: 2306 748c f353 afad 6eae ddfa efdf 35f1  #.t..S..n.....5.
│ +00000450: 45d7 962c c964 96f8 e68f b30b 71d9 8c25  E..,.d......q..%
│ +00000460: d1e0 ceea 9e99 8d77 da42 1fca 5bba c25a  .......w.B..[..Z
│ +00000470: abe6 c6f9 8609 1b6b fa35 aac2 02f4 2002  .......k.5.... .
│ +00000480: 2220 0222 2002 2220 0222 2002 2220 0222  " ." ." ." ." ."
│ +00000490: 2002 2220 0222 2002 2220 0222 2002 2220   ." ." ." ." ." 
│ +000004a0: 0222 2002 2220 0222 7083 08e4 3edc 995e  ." ." ."p...>..^
│ +000004b0: ca5c 0995 dc45 5b6a c9b3 5f25 9f2e cea4  .\...E[j.._%....
│ +000004c0: 8e6d 699e 7c66 cb89 63e3 3e8f 071f 1bbc  .mi.|f..c.>.....
│ +000004d0: d59e 6f1f d461 b98e 87eb 8e74 bb7f ba25  ..o..a.....t...%
│ +000004e0: ce74 ddf3 c1cb 6b6c 835f cebe d873 f6a3  .t....kl._...s..
│ +000004f0: 1dbb ace3 d23c ff5c c0f6 f74e cefd a4fd  .....<.\...N....
│ +00000500: d4d0 c3dd ed27 0fa5 7215 b668 5b64 f9a9  .....'..r..h[d..
│ +00000510: dfe1 22f9 febf befc 26ee dafb 4255 e11a  ..".....&...BU..
│ +00000520: f56e 8b32 71b3 0f73 fbd1 6f93 c39d 47ff  .n.2q..s..o...G.
│ +00000530: 3cfd c7ef f33e fb62 7e12 dbfc 6903 126b  <....>.b~...i..k
│ +00000540: a243 7f94 8957 dc8c fba3 acab c62e a492  .C...W..........
│ +00000550: 4d93 9203 abfc fafd a823 d6b5 d547 9bdf  M........#...G..
│ +00000560: b87b cdda 1993 2c1a 6a1d 27b2 3d43 e079  .{....,.j.'.=C.y
│ +00000570: 796b 482a d7bd f27e db2f b1e5 4f2d dc74  ykH*...~./..O-.t
│ +00000580: 6ea2 5fcc f77b b492 d3fb 97b7 b798 7f24  n._..{.........$
│ +00000590: c0aa aba3 a8da 377f c48d 5f7e 1b5b 640d  ......7..._~.[d.
│ +000005a0: 56d1 78b0 7d4b bab2 099f 95c8 e69b 2cdf  V.x.}K........,.
│ +000005b0: 9dac b6ec e28e f605 051f 3d88 8008 8880  ..........=.....
│ +000005c0: 0888 8008 8880 0888 8008 dc10 02d3 fc6b  ...............k
│ +000005d0: 1ef0 d70b 1afe 56c1 8797 f119 5fe8 f86d  ......V....._..m
│ +000005e0: 9c36 7e5b 03be 5941 db35 1058 5a1f df95  .6~[..YA.5.XZ...
│ +000005f0: 8cbf 0647 b988 8008 8880 0888 8008 8880  ...G............
│ +00000600: 0888 8008 8880 0888 8008 8880 0888 8008  ................
│ +00000610: 8880 0888 8008 8880 0888 8008 8880 0888  ................
│ +00000620: 8008 dc32 02c9 dbd9 7571 2d3e 26a1 4d04  ...2....uq->&.M.
│ +00000630: 4440 0444 4004 4440 0444 4004 4440 0444  D@.D@.D@.D@.D@.D
│ +00000640: 4004 4440 0444 4004 4440 0444 4004 4440  @.D@.D@.D@.D@.D@
│ +00000650: 0444 4004 4440 0444 4004 6e0d 81c7 fcae  .D@.D@.D@.n.....
│ +00000660: 7ede f04f c99b ff21 3986 dbd7 fdfb 016e  ~..O...!9......n
│ +00000670: e0d6 3467 b467 cb35 ddc0 944a 2502 2220  ..4g.g.5...J%." 
│ +00000680: 0222 2002 2220 0222 2002 2220 0222 2002  ." ." ." ." ." .
│ +00000690: 2220 0222 2002 2220 0222 2002 2220 0222  " ." ." ." ." ."
│ +000006a0: 2002 2220 0222 2002 2270 dd04 ceac 2efc   ." ." ."p......
│ +000006b0: cb00 fcaf 006d 2220 0222 2002 2220 0222  .....m" ." ." ."
│ +000006c0: 2002 2220 0222 2002 2220 0222 2002 2220   ." ." ." ." ." 
│ +000006d0: 0222 2002 2220 0222 2002 2220 0222 2002  ." ." ." ." ." .
│ +000006e0: 2220 02d7 4960 86c7 87f7 ee43 2f6e bf51  " ..I`.....C/n.Q
│ +000006f0: 9114 0111 1001 1110 0111 1001 1110 0111  ................
│ +00000700: 1001 1110 0111 1001 1110 0111 1001 1110  ................
│ +00000710: 0111 1001 1110 0111 1001 1110 819b 4020  ..............@ 
│ +00000720: 5f77 1392 2aa5 0888 8008 8880 0888 8008  _w..*...........
│ +00000730: 8880 0888 8008 8880 0888 8008 8880 0888  ................
│ +00000740: 8008 8880 0888 8008 8880 0888 8008 8880  ................
│ +00000750: 0898 fd0f e0c0 d243                      .......C
```
