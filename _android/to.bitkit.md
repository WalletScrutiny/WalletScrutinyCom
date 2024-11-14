---
wsId: 
title: Bitkit Wallet
altTitle: 
authors:
- danny
- basantagoswami
users: 1000
appId: to.bitkit
appCountry: 
released: 2024-06-07
updated: 2024-11-11
version: 1.0.6
stars: 
ratings: 
reviews: 
size: 
website: https://bitkit.to/
repository: https://github.com/synonymdev/bitkit
issue: https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/501
icon: to.bitkit.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2024-06-16
signer: 422ae8e4c9b4f1288efb27df173e31cadfd7134d61fa5357eb5ed9eae83c75a7
reviewArchive: 
twitter: bitkitwallet
social:
- https://discord.com/invite/DxTBJXvJxn
- https://t.me/bitkitchat
- https://medium.com/synonym-to
- https://www.youtube.com/channel/UCyNruUjynpzvQXNTxbJBLmg
redirect_from: 
developerName: Synonym
features:
- ln

---

## App Description from Google Play

> Bitkit hands you the keys to your money, profile, contacts,and web accounts.
>
> Pay anyone, anywhere, any timeand spend your Bitcoin on the things you value in life.
>
> Send Bitcoin faster than ever. Enjoy instant transactions with friends, family and merchants.
>
> Experience the web without limits: portable profiles & feeds, dynamic contacts, passwordless accounts.

## Analysis 

- The app has a Bech32 BTC address
- The private keys can be backed up in the settings.
- They have a link to their GitHub repository. 


We tested if the app can be reproduced, by running {% include testScript.html %}. A few [missing/outdated steps from the build instructions](https://github.com/synonymdev/bitkit/issues/1842) available with the source code was updated by us to be able to compile the app.

The script succeeds with a huge diff:

```
===== Begin Results =====
appId:          to.bitkit
signer:         4f707d19ec04d61736f3ca095fd1c14bdae844e68f372ff9e8da74684d4e4f89
apkVersionName: 1.0.1
apkVersionCode: 126
verdict:        
appHash:        7b571191e0d74c1e9c748574d6c3bdde73851712646d73ae9f3ccf5cb4f06f5d
commit:         817ffbcb81b7e2f0c4c94d7789f51eb4713e1d6a

Diff:
Files /tmp/fromPlay_to.bitkit_126/AndroidManifest.xml and /tmp/fromBuild_to.bitkit_126/AndroidManifest.xml differ
Files /tmp/fromPlay_to.bitkit_126/assets/dexopt/baseline.prof and /tmp/fromBuild_to.bitkit_126/assets/dexopt/baseline.prof differ
Files /tmp/fromPlay_to.bitkit_126/assets/index.android.bundle and /tmp/fromBuild_to.bitkit_126/assets/index.android.bundle differ
Only in /tmp/fromBuild_to.bitkit_126/assets: index.android.jsbundle
Files /tmp/fromPlay_to.bitkit_126/classes2.dex and /tmp/fromBuild_to.bitkit_126/classes2.dex differ
Files /tmp/fromPlay_to.bitkit_126/classes3.dex and /tmp/fromBuild_to.bitkit_126/classes3.dex differ
Files /tmp/fromPlay_to.bitkit_126/classes.dex and /tmp/fromBuild_to.bitkit_126/classes.dex differ
Only in /tmp/fromBuild_to.bitkit_126: lib
Only in /tmp/fromPlay_to.bitkit_126/META-INF: BNDLTOOL.RSA
Only in /tmp/fromPlay_to.bitkit_126/META-INF: BNDLTOOL.SF
Only in /tmp/fromPlay_to.bitkit_126/META-INF: MANIFEST.MF
Only in /tmp/fromBuild_to.bitkit_126/res: 0c.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: 0C.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 0J.png
Only in /tmp/fromBuild_to.bitkit_126/res: 0M.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 0t.jpg
Only in /tmp/fromBuild_to.bitkit_126/res: 0T.webp
Only in /tmp/fromBuild_to.bitkit_126/res: 0x.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: 13.webp
Only in /tmp/fromBuild_to.bitkit_126/res: 18.png
Only in /tmp/fromBuild_to.bitkit_126/res: 1C.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: 1e.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: 1I.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: 1J.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: 1q.webp
Only in /tmp/fromBuild_to.bitkit_126/res: 1R.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 1v.xml
Only in /tmp/fromBuild_to.bitkit_126/res: -1.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 1Z.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 20.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 21.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 271.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 27.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 2d.png
Only in /tmp/fromBuild_to.bitkit_126/res: 2f.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 2F.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 2i.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 2_.jpg
Only in /tmp/fromBuild_to.bitkit_126/res: 2j.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 2K.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: 2n.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 2P.png
Only in /tmp/fromBuild_to.bitkit_126/res: 2R.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 2S.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 2w.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 2X.ttf
Only in /tmp/fromBuild_to.bitkit_126/res: 2x.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 31.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 33.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: 3A.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 3h.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 3J.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 3N.png
Only in /tmp/fromBuild_to.bitkit_126/res: 3P.png
Only in /tmp/fromBuild_to.bitkit_126/res: 3R.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 3u.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: 42.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: 46.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 47.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 49.png
Only in /tmp/fromBuild_to.bitkit_126/res: 4B.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 4H1.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 4H.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 4I.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 4k.png
Only in /tmp/fromBuild_to.bitkit_126/res: 4o.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 4P.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 4Q.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 4s.png
Only in /tmp/fromBuild_to.bitkit_126/res: 4S.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 4u.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 4w.png
Only in /tmp/fromBuild_to.bitkit_126/res: 4_.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 4x.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 51.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 59.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 5c.png
Only in /tmp/fromBuild_to.bitkit_126/res: 5c.webp
Only in /tmp/fromBuild_to.bitkit_126/res: 5D.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: 5E.webp
Only in /tmp/fromBuild_to.bitkit_126/res: 5J.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: 5l.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 5T.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 5U.png
Only in /tmp/fromBuild_to.bitkit_126/res: 5w.webp
Only in /tmp/fromBuild_to.bitkit_126/res: -5.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 5Y.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 5z.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 61.png
Only in /tmp/fromBuild_to.bitkit_126/res: 61.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 62.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: 63.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 65.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: 66.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 68.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 6Q.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 6t.png
Only in /tmp/fromBuild_to.bitkit_126/res: 6x.webp
Only in /tmp/fromBuild_to.bitkit_126/res: 6x.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 70.png
Only in /tmp/fromBuild_to.bitkit_126/res: 79.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: 7_.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: 7b.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 7C.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: 7G.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 7H.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 7I.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: 7i.png
Only in /tmp/fromBuild_to.bitkit_126/res: 7N.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 7o.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: 7R.png
Only in /tmp/fromBuild_to.bitkit_126/res: 7R.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 7s1.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 7s.xml
Only in /tmp/fromBuild_to.bitkit_126/res: -7.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 80.xml
Only in /tmp/fromBuild_to.bitkit_126/res: -81.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 8h.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: 8h.png
Only in /tmp/fromBuild_to.bitkit_126/res: 8K.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 8N.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 8s.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 8T.png
Only in /tmp/fromBuild_to.bitkit_126/res: -8.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 8y.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 95.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 9a.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 9k.png
Only in /tmp/fromBuild_to.bitkit_126/res: 9m.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 9n.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: 9N.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: 9O.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 9p.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 9P.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 9Q.webp
Only in /tmp/fromBuild_to.bitkit_126/res: 9T1.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 9T2.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 9T.png
Only in /tmp/fromBuild_to.bitkit_126/res: 9T.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 9V.xml
Only in /tmp/fromBuild_to.bitkit_126/res: 9X.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: 9z.png
Only in /tmp/fromBuild_to.bitkit_126/res: 9z.xml
Only in /tmp/fromBuild_to.bitkit_126/res: a0.xml
Only in /tmp/fromBuild_to.bitkit_126/res: A0.xml
Only in /tmp/fromBuild_to.bitkit_126/res: a1.xml
Only in /tmp/fromBuild_to.bitkit_126/res: A1.xml
Only in /tmp/fromBuild_to.bitkit_126/res: A2.xml
Only in /tmp/fromBuild_to.bitkit_126/res: A4.xml
Only in /tmp/fromBuild_to.bitkit_126/res: a5.xml
Only in /tmp/fromBuild_to.bitkit_126/res: A5.xml
Only in /tmp/fromBuild_to.bitkit_126/res: a7.xml
Only in /tmp/fromBuild_to.bitkit_126/res: aa.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Aa.xml
Only in /tmp/fromBuild_to.bitkit_126/res: AB.xml
Only in /tmp/fromBuild_to.bitkit_126/res: AC.webp
Only in /tmp/fromBuild_to.bitkit_126/res: AE.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Af.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: aG.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Aj.jpg
Only in /tmp/fromBuild_to.bitkit_126/res: aj.png
Only in /tmp/fromBuild_to.bitkit_126/res: aJ.xml
Only in /tmp/fromBuild_to.bitkit_126/res: ak.xml
Only in /tmp/fromBuild_to.bitkit_126/res: aM.xml
Only in /tmp/fromPlay_to.bitkit_126/res: anim
Only in /tmp/fromPlay_to.bitkit_126/res: animator
Only in /tmp/fromPlay_to.bitkit_126/res: animator-v21
Only in /tmp/fromPlay_to.bitkit_126/res: anim-v21
Only in /tmp/fromPlay_to.bitkit_126/res: anim-v33
Only in /tmp/fromBuild_to.bitkit_126/res: ar.png
Only in /tmp/fromBuild_to.bitkit_126/res: Ar.png
Only in /tmp/fromBuild_to.bitkit_126/res: ar.xml
Only in /tmp/fromBuild_to.bitkit_126/res: aT.xml
Only in /tmp/fromBuild_to.bitkit_126/res: aU.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: aW.xml
Only in /tmp/fromBuild_to.bitkit_126/res: ay.xml
Only in /tmp/fromBuild_to.bitkit_126/res: b2.png
Only in /tmp/fromBuild_to.bitkit_126/res: B6.xml
Only in /tmp/fromBuild_to.bitkit_126/res: BA.png
Only in /tmp/fromBuild_to.bitkit_126/res: bb.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Bd.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Be1.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Be.xml
Only in /tmp/fromBuild_to.bitkit_126/res: BG.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: bI.png
Only in /tmp/fromBuild_to.bitkit_126/res: BJ1.xml
Only in /tmp/fromBuild_to.bitkit_126/res: BJ.xml
Only in /tmp/fromBuild_to.bitkit_126/res: BL.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: bL.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Bl.xml
Only in /tmp/fromBuild_to.bitkit_126/res: BM.png
Only in /tmp/fromBuild_to.bitkit_126/res: -B.png
Only in /tmp/fromBuild_to.bitkit_126/res: BQ.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: bt.xml
Only in /tmp/fromBuild_to.bitkit_126/res: bT.xml
Only in /tmp/fromBuild_to.bitkit_126/res: BT.xml
Only in /tmp/fromBuild_to.bitkit_126/res: bu.png
Only in /tmp/fromBuild_to.bitkit_126/res: bX.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: -B.xml
Only in /tmp/fromBuild_to.bitkit_126/res: By1.xml
Only in /tmp/fromBuild_to.bitkit_126/res: By.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Bz.xml
Only in /tmp/fromBuild_to.bitkit_126/res: c0.xml
Only in /tmp/fromBuild_to.bitkit_126/res: c2.xml
Only in /tmp/fromBuild_to.bitkit_126/res: c5.xml
Only in /tmp/fromBuild_to.bitkit_126/res: c6.xml
Only in /tmp/fromBuild_to.bitkit_126/res: C_.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: cA.xml
Only in /tmp/fromBuild_to.bitkit_126/res: cc.xml
Only in /tmp/fromBuild_to.bitkit_126/res: CD.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Cg.xml
Only in /tmp/fromBuild_to.bitkit_126/res: CK.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: cL.xml
Only in /tmp/fromBuild_to.bitkit_126/res: cm.xml
Only in /tmp/fromBuild_to.bitkit_126/res: cq.png
Only in /tmp/fromBuild_to.bitkit_126/res: cv.xml
Only in /tmp/fromBuild_to.bitkit_126/res: cV.xml
Only in /tmp/fromBuild_to.bitkit_126/res: cy.xml
Only in /tmp/fromBuild_to.bitkit_126/res: d2.xml
Only in /tmp/fromBuild_to.bitkit_126/res: d3.png
Only in /tmp/fromBuild_to.bitkit_126/res: D4.xml
Only in /tmp/fromBuild_to.bitkit_126/res: d5.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: D5.xml
Only in /tmp/fromBuild_to.bitkit_126/res: D6.xml
Only in /tmp/fromBuild_to.bitkit_126/res: D_.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: dB.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: dC.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Dd.png
Only in /tmp/fromBuild_to.bitkit_126/res: df.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Df.xml
Only in /tmp/fromBuild_to.bitkit_126/res: DG.xml
Only in /tmp/fromBuild_to.bitkit_126/res: dj.xml
Only in /tmp/fromBuild_to.bitkit_126/res: DL.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: dO.xml
Only in /tmp/fromPlay_to.bitkit_126/res: drawable
Only in /tmp/fromPlay_to.bitkit_126/res: drawable-anydpi-v23
Only in /tmp/fromPlay_to.bitkit_126/res: drawable-mdpi-v4
Only in /tmp/fromPlay_to.bitkit_126/res: drawable-v21
Only in /tmp/fromPlay_to.bitkit_126/res: drawable-v23
Only in /tmp/fromPlay_to.bitkit_126/res: drawable-v29
Only in /tmp/fromPlay_to.bitkit_126/res: drawable-watch-v20
Only in /tmp/fromBuild_to.bitkit_126/res: dS.xml
Only in /tmp/fromBuild_to.bitkit_126/res: DS.xml
Only in /tmp/fromBuild_to.bitkit_126/res: dV.png
Only in /tmp/fromBuild_to.bitkit_126/res: DV.xml
Only in /tmp/fromBuild_to.bitkit_126/res: dW.png
Only in /tmp/fromBuild_to.bitkit_126/res: dw.xml
Only in /tmp/fromBuild_to.bitkit_126/res: dY.png
Only in /tmp/fromBuild_to.bitkit_126/res: DZ.xml
Only in /tmp/fromBuild_to.bitkit_126/res: e0.xml
Only in /tmp/fromBuild_to.bitkit_126/res: E5.png
Only in /tmp/fromBuild_to.bitkit_126/res: EA.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: eA.xml
Only in /tmp/fromBuild_to.bitkit_126/res: ec.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Eg.xml
Only in /tmp/fromBuild_to.bitkit_126/res: eH1.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Eh.png
Only in /tmp/fromBuild_to.bitkit_126/res: eH.xml
Only in /tmp/fromBuild_to.bitkit_126/res: ei.xml
Only in /tmp/fromBuild_to.bitkit_126/res: ej.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: EJ.webp
Only in /tmp/fromBuild_to.bitkit_126/res: ej.xml
Only in /tmp/fromBuild_to.bitkit_126/res: eK1.xml
Only in /tmp/fromBuild_to.bitkit_126/res: eK.xml
Only in /tmp/fromBuild_to.bitkit_126/res: eM.xml
Only in /tmp/fromBuild_to.bitkit_126/res: EP.png
Only in /tmp/fromBuild_to.bitkit_126/res: EQ.xml
Only in /tmp/fromBuild_to.bitkit_126/res: eR.png
Only in /tmp/fromBuild_to.bitkit_126/res: eT.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: ev.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: eZ.xml
Only in /tmp/fromBuild_to.bitkit_126/res: EZ.xml
Only in /tmp/fromBuild_to.bitkit_126/res: f6.xml
Only in /tmp/fromBuild_to.bitkit_126/res: F81.xml
Only in /tmp/fromBuild_to.bitkit_126/res: F8.xml
Only in /tmp/fromBuild_to.bitkit_126/res: f9.png
Only in /tmp/fromBuild_to.bitkit_126/res: fd.xml
Only in /tmp/fromBuild_to.bitkit_126/res: fg.xml
Only in /tmp/fromBuild_to.bitkit_126/res: FL.webp
Only in /tmp/fromBuild_to.bitkit_126/res: fM.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: fp.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Fq.xml
Only in /tmp/fromBuild_to.bitkit_126/res: fs.png
Only in /tmp/fromBuild_to.bitkit_126/res: FS.xml
Only in /tmp/fromBuild_to.bitkit_126/res: FT.xml
Only in /tmp/fromBuild_to.bitkit_126/res: fu.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Fu.xml
Only in /tmp/fromBuild_to.bitkit_126/res: fv.jpg
Only in /tmp/fromBuild_to.bitkit_126/res: fv.png
Only in /tmp/fromBuild_to.bitkit_126/res: FW.png
Only in /tmp/fromBuild_to.bitkit_126/res: fW.xml
Only in /tmp/fromBuild_to.bitkit_126/res: f_.xml
Only in /tmp/fromBuild_to.bitkit_126/res: fY.xml
Only in /tmp/fromBuild_to.bitkit_126/res: FZ.xml
Only in /tmp/fromBuild_to.bitkit_126/res: G2.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: G2.xml
Only in /tmp/fromBuild_to.bitkit_126/res: g3.xml
Only in /tmp/fromBuild_to.bitkit_126/res: G8.xml
Only in /tmp/fromBuild_to.bitkit_126/res: g9.xml
Only in /tmp/fromBuild_to.bitkit_126/res: gC.xml
Only in /tmp/fromBuild_to.bitkit_126/res: GC.xml
Only in /tmp/fromBuild_to.bitkit_126/res: gD.xml
Only in /tmp/fromBuild_to.bitkit_126/res: GD.xml
Only in /tmp/fromBuild_to.bitkit_126/res: gE.png
Only in /tmp/fromBuild_to.bitkit_126/res: Gf.png
Only in /tmp/fromBuild_to.bitkit_126/res: GF.xml
Only in /tmp/fromBuild_to.bitkit_126/res: gG.xml
Only in /tmp/fromBuild_to.bitkit_126/res: gH.png
Only in /tmp/fromBuild_to.bitkit_126/res: gj.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: gK.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: GK.xml
Only in /tmp/fromBuild_to.bitkit_126/res: g-.png
Only in /tmp/fromBuild_to.bitkit_126/res: GQ.xml
Only in /tmp/fromBuild_to.bitkit_126/res: gR.xml
Only in /tmp/fromBuild_to.bitkit_126/res: GR.xml
Only in /tmp/fromBuild_to.bitkit_126/res: gs.webp
Only in /tmp/fromBuild_to.bitkit_126/res: gt.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: Gt.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: Gt.xml
Only in /tmp/fromBuild_to.bitkit_126/res: GT.xml
Only in /tmp/fromBuild_to.bitkit_126/res: g-.xml
Only in /tmp/fromBuild_to.bitkit_126/res: -G.xml
Only in /tmp/fromBuild_to.bitkit_126/res: _G.xml
Only in /tmp/fromBuild_to.bitkit_126/res: gZ.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: h4.xml
Only in /tmp/fromBuild_to.bitkit_126/res: h7.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: ha.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Ha.xml
Only in /tmp/fromBuild_to.bitkit_126/res: hb.xml
Only in /tmp/fromBuild_to.bitkit_126/res: hc.xml
Only in /tmp/fromBuild_to.bitkit_126/res: HC.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Hd.xml
Only in /tmp/fromBuild_to.bitkit_126/res: hh.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: hP1.xml
Only in /tmp/fromBuild_to.bitkit_126/res: hP.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: H-.png
Only in /tmp/fromBuild_to.bitkit_126/res: hP.xml
Only in /tmp/fromBuild_to.bitkit_126/res: hq.xml
Only in /tmp/fromBuild_to.bitkit_126/res: HQ.xml
Only in /tmp/fromBuild_to.bitkit_126/res: hs.xml
Only in /tmp/fromBuild_to.bitkit_126/res: hu.xml
Only in /tmp/fromBuild_to.bitkit_126/res: hv.xml
Only in /tmp/fromBuild_to.bitkit_126/res: hZ.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: I3.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: I3.xml
Only in /tmp/fromBuild_to.bitkit_126/res: i6.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: Ib.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Id.xml
Only in /tmp/fromBuild_to.bitkit_126/res: iE.webp
Only in /tmp/fromBuild_to.bitkit_126/res: iI.xml
Only in /tmp/fromPlay_to.bitkit_126/res: interpolator
Only in /tmp/fromPlay_to.bitkit_126/res: interpolator-v21
Only in /tmp/fromBuild_to.bitkit_126/res: In.xml
Only in /tmp/fromBuild_to.bitkit_126/res: IN.xml
Only in /tmp/fromBuild_to.bitkit_126/res: io.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: iO.png
Only in /tmp/fromBuild_to.bitkit_126/res: io.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Ip.png
Only in /tmp/fromBuild_to.bitkit_126/res: iQ.png
Only in /tmp/fromBuild_to.bitkit_126/res: iQ.xml
Only in /tmp/fromBuild_to.bitkit_126/res: iR.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: IR.xml
Only in /tmp/fromBuild_to.bitkit_126/res: iW.png
Only in /tmp/fromBuild_to.bitkit_126/res: IX.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: _I.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Ix.xml
Only in /tmp/fromBuild_to.bitkit_126/res: iZ1.xml
Only in /tmp/fromBuild_to.bitkit_126/res: iZ2.xml
Only in /tmp/fromBuild_to.bitkit_126/res: iZ.xml
Only in /tmp/fromBuild_to.bitkit_126/res: j3.xml
Only in /tmp/fromBuild_to.bitkit_126/res: j4.png
Only in /tmp/fromBuild_to.bitkit_126/res: J7.xml
Only in /tmp/fromBuild_to.bitkit_126/res: JD1.xml
Only in /tmp/fromBuild_to.bitkit_126/res: JD.xml
Only in /tmp/fromBuild_to.bitkit_126/res: je.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: JF.xml
Only in /tmp/fromBuild_to.bitkit_126/res: JJ.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: jJ.png
Only in /tmp/fromBuild_to.bitkit_126/res: Jl.xml
Only in /tmp/fromBuild_to.bitkit_126/res: jN.webp
Only in /tmp/fromBuild_to.bitkit_126/res: Jp.png
Only in /tmp/fromBuild_to.bitkit_126/res: JQ.xml
Only in /tmp/fromBuild_to.bitkit_126/res: jr.png
Only in /tmp/fromBuild_to.bitkit_126/res: jS1.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: jS.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: JS.xml
Only in /tmp/fromBuild_to.bitkit_126/res: JT1.xml
Only in /tmp/fromBuild_to.bitkit_126/res: JT.xml
Only in /tmp/fromBuild_to.bitkit_126/res: jW.png
Only in /tmp/fromBuild_to.bitkit_126/res: Jw.xml
Only in /tmp/fromBuild_to.bitkit_126/res: jy.ttf
Only in /tmp/fromBuild_to.bitkit_126/res: k0.xml
Only in /tmp/fromBuild_to.bitkit_126/res: k1.xml
Only in /tmp/fromBuild_to.bitkit_126/res: K2.xml
Only in /tmp/fromBuild_to.bitkit_126/res: k3.png
Only in /tmp/fromBuild_to.bitkit_126/res: K51.xml
Only in /tmp/fromBuild_to.bitkit_126/res: K5.xml
Only in /tmp/fromBuild_to.bitkit_126/res: k81.xml
Only in /tmp/fromBuild_to.bitkit_126/res: k8.xml
Only in /tmp/fromBuild_to.bitkit_126/res: K_.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: k9.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Ke.xml
Only in /tmp/fromBuild_to.bitkit_126/res: kg.xml
Only in /tmp/fromBuild_to.bitkit_126/res: KH.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: kh.xml
Only in /tmp/fromBuild_to.bitkit_126/res: kJ.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: kj.xml
Only in /tmp/fromBuild_to.bitkit_126/res: KM.png
Only in /tmp/fromBuild_to.bitkit_126/res: kn.xml
Only in /tmp/fromBuild_to.bitkit_126/res: kN.xml
Only in /tmp/fromBuild_to.bitkit_126/res: kO.xml
Only in /tmp/fromBuild_to.bitkit_126/res: kp.png
Only in /tmp/fromBuild_to.bitkit_126/res: KR.xml
Only in /tmp/fromBuild_to.bitkit_126/res: KT.xml
Only in /tmp/fromBuild_to.bitkit_126/res: -k.xml
Only in /tmp/fromBuild_to.bitkit_126/res: k_.xml
Only in /tmp/fromBuild_to.bitkit_126/res: K-.xml
Only in /tmp/fromPlay_to.bitkit_126/res: layout
Only in /tmp/fromPlay_to.bitkit_126/res: layout-land
Only in /tmp/fromPlay_to.bitkit_126/res: layout-sw600dp-v13
Only in /tmp/fromPlay_to.bitkit_126/res: layout-v21
Only in /tmp/fromPlay_to.bitkit_126/res: layout-v26
Only in /tmp/fromPlay_to.bitkit_126/res: layout-watch-v20
Only in /tmp/fromBuild_to.bitkit_126/res: lE.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Lf.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Li.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: LJ.xml
Only in /tmp/fromBuild_to.bitkit_126/res: LN.webp
Only in /tmp/fromBuild_to.bitkit_126/res: lN.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Lo.xml
Only in /tmp/fromBuild_to.bitkit_126/res: lP.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: lR.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Lr.xml
Only in /tmp/fromBuild_to.bitkit_126/res: ls.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Lt.xml
Only in /tmp/fromBuild_to.bitkit_126/res: LT.xml
Only in /tmp/fromBuild_to.bitkit_126/res: lv.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Lv.xml
Only in /tmp/fromBuild_to.bitkit_126/res: L-.xml
Only in /tmp/fromBuild_to.bitkit_126/res: L_.xml
Only in /tmp/fromBuild_to.bitkit_126/res: ly.png
Only in /tmp/fromBuild_to.bitkit_126/res: lZ.png
Only in /tmp/fromBuild_to.bitkit_126/res: Lz.png
Only in /tmp/fromBuild_to.bitkit_126/res: m0.png
Only in /tmp/fromBuild_to.bitkit_126/res: M2.xml
Only in /tmp/fromBuild_to.bitkit_126/res: M5.xml
Only in /tmp/fromBuild_to.bitkit_126/res: m7.png
Only in /tmp/fromBuild_to.bitkit_126/res: M7.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Ma.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: mA.xml
Only in /tmp/fromBuild_to.bitkit_126/res: MF.9.png
Only in /tmp/fromPlay_to.bitkit_126/res: mipmap-anydpi-v26
Only in /tmp/fromPlay_to.bitkit_126/res: mipmap-hdpi-v4
Only in /tmp/fromPlay_to.bitkit_126/res: mipmap-mdpi-v4
Only in /tmp/fromPlay_to.bitkit_126/res: mipmap-xhdpi-v4
Only in /tmp/fromPlay_to.bitkit_126/res: mipmap-xxhdpi-v4
Only in /tmp/fromPlay_to.bitkit_126/res: mipmap-xxxhdpi-v4
Only in /tmp/fromBuild_to.bitkit_126/res: Ml.webp
Only in /tmp/fromBuild_to.bitkit_126/res: mm.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: MO.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Mp.xml
Only in /tmp/fromBuild_to.bitkit_126/res: MQ.png
Only in /tmp/fromBuild_to.bitkit_126/res: Mt.xml
Only in /tmp/fromBuild_to.bitkit_126/res: MU.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Mv.xml
Only in /tmp/fromBuild_to.bitkit_126/res: _M.xml
Only in /tmp/fromBuild_to.bitkit_126/res: MZ.xml
Only in /tmp/fromBuild_to.bitkit_126/res: n0.xml
Only in /tmp/fromBuild_to.bitkit_126/res: N0.xml
Only in /tmp/fromBuild_to.bitkit_126/res: n6.png
Only in /tmp/fromBuild_to.bitkit_126/res: n8.jpg
Only in /tmp/fromBuild_to.bitkit_126/res: NA.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: NB.xml
Only in /tmp/fromBuild_to.bitkit_126/res: nC.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: nf.png
Only in /tmp/fromBuild_to.bitkit_126/res: NF.xml
Only in /tmp/fromBuild_to.bitkit_126/res: NG.png
Only in /tmp/fromBuild_to.bitkit_126/res: nI.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: Nk.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: Nl.jpg
Only in /tmp/fromBuild_to.bitkit_126/res: nl.xml
Only in /tmp/fromBuild_to.bitkit_126/res: nL.xml
Only in /tmp/fromBuild_to.bitkit_126/res: nm.xml
Only in /tmp/fromBuild_to.bitkit_126/res: NM.xml
Only in /tmp/fromBuild_to.bitkit_126/res: NN1.xml
Only in /tmp/fromBuild_to.bitkit_126/res: NN.xml
Only in /tmp/fromBuild_to.bitkit_126/res: No.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: no.xml
Only in /tmp/fromBuild_to.bitkit_126/res: -N.png
Only in /tmp/fromBuild_to.bitkit_126/res: N-.png
Only in /tmp/fromBuild_to.bitkit_126/res: NQ.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Nt.webp
Only in /tmp/fromBuild_to.bitkit_126/res: nT.xml
Only in /tmp/fromBuild_to.bitkit_126/res: nu.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Nu.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Nw.xml
Only in /tmp/fromBuild_to.bitkit_126/res: nX.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Ny.xml
Only in /tmp/fromBuild_to.bitkit_126/res: NZ.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: nz.xml
Only in /tmp/fromBuild_to.bitkit_126/res: o4.xml
Only in /tmp/fromBuild_to.bitkit_126/res: o9.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: o_.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: oa.xml
Only in /tmp/fromBuild_to.bitkit_126/res: oH.png
Only in /tmp/fromBuild_to.bitkit_126/res: OH.xml
Only in /tmp/fromBuild_to.bitkit_126/res: OI.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Ol.xml
Only in /tmp/fromBuild_to.bitkit_126/res: oO.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: op.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: _o.png
Only in /tmp/fromBuild_to.bitkit_126/res: o_.png
Only in /tmp/fromBuild_to.bitkit_126/res: oP.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Ot.webp
Only in /tmp/fromBuild_to.bitkit_126/res: o_.webp
Only in /tmp/fromBuild_to.bitkit_126/res: _o.xml
Only in /tmp/fromBuild_to.bitkit_126/res: oX.png
Only in /tmp/fromBuild_to.bitkit_126/res: OX.xml
Only in /tmp/fromBuild_to.bitkit_126/res: oY.xml
Only in /tmp/fromBuild_to.bitkit_126/res: OZ.png
Only in /tmp/fromBuild_to.bitkit_126/res: p0.xml
Only in /tmp/fromBuild_to.bitkit_126/res: p6.png
Only in /tmp/fromBuild_to.bitkit_126/res: p7.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Pa.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: Pb.png
Only in /tmp/fromBuild_to.bitkit_126/res: Pb.xml
Only in /tmp/fromBuild_to.bitkit_126/res: pC.png
Only in /tmp/fromBuild_to.bitkit_126/res: Pd.jpg
Only in /tmp/fromBuild_to.bitkit_126/res: pF.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Pg.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: PH.png
Only in /tmp/fromBuild_to.bitkit_126/res: pI.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Pj.xml
Only in /tmp/fromBuild_to.bitkit_126/res: pk.png
Only in /tmp/fromBuild_to.bitkit_126/res: PL.png
Only in /tmp/fromBuild_to.bitkit_126/res: pn.xml
Only in /tmp/fromBuild_to.bitkit_126/res: -p.png
Only in /tmp/fromBuild_to.bitkit_126/res: _p.png
Only in /tmp/fromBuild_to.bitkit_126/res: PQ.xml
Only in /tmp/fromBuild_to.bitkit_126/res: ps.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: pU.xml
Only in /tmp/fromBuild_to.bitkit_126/res: PV.xml
Only in /tmp/fromBuild_to.bitkit_126/res: pw.xml
Only in /tmp/fromBuild_to.bitkit_126/res: PX.xml
Only in /tmp/fromBuild_to.bitkit_126/res: py.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: pY.png
Only in /tmp/fromBuild_to.bitkit_126/res: q6.xml
Only in /tmp/fromBuild_to.bitkit_126/res: qA.xml
Only in /tmp/fromBuild_to.bitkit_126/res: qb.png
Only in /tmp/fromBuild_to.bitkit_126/res: qD.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: Qd.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: Qd.xml
Only in /tmp/fromBuild_to.bitkit_126/res: QD.xml
Only in /tmp/fromBuild_to.bitkit_126/res: QH.xml
Only in /tmp/fromBuild_to.bitkit_126/res: QJ.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: QN1.xml
Only in /tmp/fromBuild_to.bitkit_126/res: QN.xml
Only in /tmp/fromBuild_to.bitkit_126/res: _q.png
Only in /tmp/fromBuild_to.bitkit_126/res: qp.png
Only in /tmp/fromBuild_to.bitkit_126/res: Qp.xml
Only in /tmp/fromBuild_to.bitkit_126/res: qS.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Qt.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Qu.xml
Only in /tmp/fromBuild_to.bitkit_126/res: qW.png
Only in /tmp/fromBuild_to.bitkit_126/res: -Q.xml
Only in /tmp/fromBuild_to.bitkit_126/res: qx.xml
Only in /tmp/fromBuild_to.bitkit_126/res: QZ1.xml
Only in /tmp/fromBuild_to.bitkit_126/res: qz.xml
Only in /tmp/fromBuild_to.bitkit_126/res: QZ.xml
Only in /tmp/fromBuild_to.bitkit_126/res: R2.xml
Only in /tmp/fromPlay_to.bitkit_126/res: raw
Only in /tmp/fromBuild_to.bitkit_126/res: rb.xml
Only in /tmp/fromBuild_to.bitkit_126/res: rd.xml
Only in /tmp/fromBuild_to.bitkit_126/res: RD.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Rf.png
Only in /tmp/fromBuild_to.bitkit_126/res: RH.xml
Only in /tmp/fromBuild_to.bitkit_126/res: rI.xml
Only in /tmp/fromBuild_to.bitkit_126/res: RI.xml
Only in /tmp/fromBuild_to.bitkit_126/res: rj.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: Rj.png
Only in /tmp/fromBuild_to.bitkit_126/res: rJ.xml
Only in /tmp/fromBuild_to.bitkit_126/res: RM.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Ro1.xml
Only in /tmp/fromBuild_to.bitkit_126/res: RO.webp
Only in /tmp/fromBuild_to.bitkit_126/res: Ro.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Rt.xml
Only in /tmp/fromBuild_to.bitkit_126/res: rV.png
Only in /tmp/fromBuild_to.bitkit_126/res: RV.png
Only in /tmp/fromBuild_to.bitkit_126/res: rW.xml
Only in /tmp/fromBuild_to.bitkit_126/res: rx.xml
Only in /tmp/fromBuild_to.bitkit_126/res: rY.xml
Only in /tmp/fromBuild_to.bitkit_126/res: rz.xml
Only in /tmp/fromBuild_to.bitkit_126/res: s0.png
Only in /tmp/fromBuild_to.bitkit_126/res: s3.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: S3.png
Only in /tmp/fromBuild_to.bitkit_126/res: s4.png
Only in /tmp/fromBuild_to.bitkit_126/res: S6.xml
Only in /tmp/fromBuild_to.bitkit_126/res: S7.png
Only in /tmp/fromBuild_to.bitkit_126/res: S8.xml
Only in /tmp/fromBuild_to.bitkit_126/res: S9.png
Only in /tmp/fromBuild_to.bitkit_126/res: sA.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: SA.jpg
Only in /tmp/fromBuild_to.bitkit_126/res: sA.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Sa.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Sc.xml
Only in /tmp/fromBuild_to.bitkit_126/res: sg.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: SG.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Sh.xml
Only in /tmp/fromBuild_to.bitkit_126/res: sl.xml
Only in /tmp/fromBuild_to.bitkit_126/res: sN.png
Only in /tmp/fromBuild_to.bitkit_126/res: sn.xml
Only in /tmp/fromBuild_to.bitkit_126/res: SN.xml
Only in /tmp/fromBuild_to.bitkit_126/res: sO.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Sq.png
Only in /tmp/fromBuild_to.bitkit_126/res: sq.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Sr.xml
Only in /tmp/fromBuild_to.bitkit_126/res: sS.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Su.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: SV.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: sX.xml
Only in /tmp/fromBuild_to.bitkit_126/res: t3.xml
Only in /tmp/fromBuild_to.bitkit_126/res: T4.xml
Only in /tmp/fromBuild_to.bitkit_126/res: T5.xml
Only in /tmp/fromBuild_to.bitkit_126/res: t8.xml
Only in /tmp/fromBuild_to.bitkit_126/res: TB.xml
Only in /tmp/fromBuild_to.bitkit_126/res: te.png
Only in /tmp/fromBuild_to.bitkit_126/res: te.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Tf.xml
Only in /tmp/fromBuild_to.bitkit_126/res: tG.png
Only in /tmp/fromBuild_to.bitkit_126/res: Th.png
Only in /tmp/fromBuild_to.bitkit_126/res: TH.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Ti.jpg
Only in /tmp/fromBuild_to.bitkit_126/res: tI.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Tj.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: TJ.xml
Only in /tmp/fromBuild_to.bitkit_126/res: TK.xml
Only in /tmp/fromBuild_to.bitkit_126/res: tL.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Tm.xml
Only in /tmp/fromBuild_to.bitkit_126/res: tn.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Tn.xml
Only in /tmp/fromBuild_to.bitkit_126/res: tp.xml
Only in /tmp/fromBuild_to.bitkit_126/res: tr.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: Tr.xml
Only in /tmp/fromBuild_to.bitkit_126/res: tS.png
Only in /tmp/fromBuild_to.bitkit_126/res: tS.webp
Only in /tmp/fromBuild_to.bitkit_126/res: tS.xml
Only in /tmp/fromBuild_to.bitkit_126/res: tT.xml
Only in /tmp/fromBuild_to.bitkit_126/res: tU.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: TV.png
Only in /tmp/fromBuild_to.bitkit_126/res: tZ.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: u0.xml
Only in /tmp/fromBuild_to.bitkit_126/res: U0.xml
Only in /tmp/fromBuild_to.bitkit_126/res: U2.webp
Only in /tmp/fromBuild_to.bitkit_126/res: u3.png
Only in /tmp/fromBuild_to.bitkit_126/res: u6.png
Only in /tmp/fromBuild_to.bitkit_126/res: U7.xml
Only in /tmp/fromBuild_to.bitkit_126/res: U8.xml
Only in /tmp/fromBuild_to.bitkit_126/res: U-.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: ua.png
Only in /tmp/fromBuild_to.bitkit_126/res: ua.xml
Only in /tmp/fromBuild_to.bitkit_126/res: UE.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: UE.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Uf.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Ui.xml
Only in /tmp/fromBuild_to.bitkit_126/res: uj.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: uJ.xml
Only in /tmp/fromBuild_to.bitkit_126/res: uL.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: UO.png
Only in /tmp/fromBuild_to.bitkit_126/res: _U.png
Only in /tmp/fromBuild_to.bitkit_126/res: UP.xml
Only in /tmp/fromBuild_to.bitkit_126/res: UR.png
Only in /tmp/fromBuild_to.bitkit_126/res: uR.xml
Only in /tmp/fromBuild_to.bitkit_126/res: us.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: Us.png
Only in /tmp/fromBuild_to.bitkit_126/res: ut.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: uu.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: UX.xml
Only in /tmp/fromBuild_to.bitkit_126/res: V1.xml
Only in /tmp/fromBuild_to.bitkit_126/res: V3.xml
Only in /tmp/fromBuild_to.bitkit_126/res: v4.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: v4.webp
Only in /tmp/fromBuild_to.bitkit_126/res: V7.xml
Only in /tmp/fromBuild_to.bitkit_126/res: VD.png
Only in /tmp/fromBuild_to.bitkit_126/res: vf.xml
Only in /tmp/fromBuild_to.bitkit_126/res: vG.xml
Only in /tmp/fromBuild_to.bitkit_126/res: vH.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Vi.xml
Only in /tmp/fromBuild_to.bitkit_126/res: vJ.xml
Only in /tmp/fromBuild_to.bitkit_126/res: vL.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: vl.xml
Only in /tmp/fromBuild_to.bitkit_126/res: VM.xml
Only in /tmp/fromBuild_to.bitkit_126/res: VN.xml
Only in /tmp/fromBuild_to.bitkit_126/res: vo.png
Only in /tmp/fromBuild_to.bitkit_126/res: vp.jpg
Only in /tmp/fromBuild_to.bitkit_126/res: vq.xml
Only in /tmp/fromBuild_to.bitkit_126/res: vR.xml
Only in /tmp/fromBuild_to.bitkit_126/res: vT.xml
Only in /tmp/fromBuild_to.bitkit_126/res: VT.xml
Only in /tmp/fromBuild_to.bitkit_126/res: vv.xml
Only in /tmp/fromBuild_to.bitkit_126/res: v-.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Vy.xml
Only in /tmp/fromBuild_to.bitkit_126/res: vz.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: vz.xml
Only in /tmp/fromBuild_to.bitkit_126/res: vZ.xml
Only in /tmp/fromBuild_to.bitkit_126/res: w2.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: W4.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: W9.png
Only in /tmp/fromBuild_to.bitkit_126/res: w9.xml
Only in /tmp/fromBuild_to.bitkit_126/res: wa.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Wg.xml
Only in /tmp/fromBuild_to.bitkit_126/res: WG.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Wh.png
Only in /tmp/fromBuild_to.bitkit_126/res: WI.xml
Only in /tmp/fromBuild_to.bitkit_126/res: WK.xml
Only in /tmp/fromBuild_to.bitkit_126/res: wL.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: wN.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: w_.png
Only in /tmp/fromBuild_to.bitkit_126/res: -W.png
Only in /tmp/fromBuild_to.bitkit_126/res: wP.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Wr.png
Only in /tmp/fromBuild_to.bitkit_126/res: Ws.xml
Only in /tmp/fromBuild_to.bitkit_126/res: wT.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Wz.png
Only in /tmp/fromBuild_to.bitkit_126/res: x3.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: X3.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: X4.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: X5.jpg
Only in /tmp/fromBuild_to.bitkit_126/res: x7.png
Only in /tmp/fromBuild_to.bitkit_126/res: xa.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: xa.xml
Only in /tmp/fromBuild_to.bitkit_126/res: xd.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Xe.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Xf.xml
Only in /tmp/fromBuild_to.bitkit_126/res: xH.png
Only in /tmp/fromBuild_to.bitkit_126/res: xj.xml
Only in /tmp/fromBuild_to.bitkit_126/res: XK.xml
Only in /tmp/fromPlay_to.bitkit_126/res: xml
Only in /tmp/fromBuild_to.bitkit_126/res: xN.xml
Only in /tmp/fromBuild_to.bitkit_126/res: -x.png
Only in /tmp/fromBuild_to.bitkit_126/res: xQ.xml
Only in /tmp/fromBuild_to.bitkit_126/res: xR.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: XW.png
Only in /tmp/fromBuild_to.bitkit_126/res: XW.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Xx.xml
Only in /tmp/fromBuild_to.bitkit_126/res: XY.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Xz.xml
Only in /tmp/fromBuild_to.bitkit_126/res: y4.xml
Only in /tmp/fromBuild_to.bitkit_126/res: y6.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Y7.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: ya.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Yc.xml
Only in /tmp/fromBuild_to.bitkit_126/res: yg.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: YG.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: yg.webp
Only in /tmp/fromBuild_to.bitkit_126/res: yH.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: YN.xml
Only in /tmp/fromBuild_to.bitkit_126/res: yO.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Yt.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: yT.xml
Only in /tmp/fromBuild_to.bitkit_126/res: yV.xml
Only in /tmp/fromBuild_to.bitkit_126/res: YW1.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Yw.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: YW.xml
Only in /tmp/fromBuild_to.bitkit_126/res: _y.xml
Only in /tmp/fromBuild_to.bitkit_126/res: y-.xml
Only in /tmp/fromBuild_to.bitkit_126/res: _Y.xml
Only in /tmp/fromBuild_to.bitkit_126/res: yY.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: yy.jpg
Only in /tmp/fromBuild_to.bitkit_126/res: Yy.png
Only in /tmp/fromBuild_to.bitkit_126/res: z3.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Z8.png
Only in /tmp/fromBuild_to.bitkit_126/res: z9.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: z-.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: zc.xml
Only in /tmp/fromBuild_to.bitkit_126/res: ZC.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Zd.xml
Only in /tmp/fromBuild_to.bitkit_126/res: zE.png
Only in /tmp/fromBuild_to.bitkit_126/res: zG.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Zg.xml
Only in /tmp/fromBuild_to.bitkit_126/res: ZI.png
Only in /tmp/fromBuild_to.bitkit_126/res: zK.xml
Only in /tmp/fromBuild_to.bitkit_126/res: ZL.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: ZL.xml
Only in /tmp/fromBuild_to.bitkit_126/res: ZM.xml
Only in /tmp/fromBuild_to.bitkit_126/res: ZN.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: ZN.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Zo.webp
Only in /tmp/fromBuild_to.bitkit_126/res: zp.xml
Only in /tmp/fromBuild_to.bitkit_126/res: ZP.xml
Only in /tmp/fromBuild_to.bitkit_126/res: zq.xml
Only in /tmp/fromBuild_to.bitkit_126/res: zR.xml
Only in /tmp/fromBuild_to.bitkit_126/res: zV.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: zw.9.png
Only in /tmp/fromBuild_to.bitkit_126/res: ZW.xml
Only in /tmp/fromBuild_to.bitkit_126/res: Z-.xml
Only in /tmp/fromBuild_to.bitkit_126/res: zX.xml
Files /tmp/fromPlay_to.bitkit_126/resources.arsc and /tmp/fromBuild_to.bitkit_126/resources.arsc differ
Only in /tmp/fromPlay_to.bitkit_126: stamp-cert-sha256

Revision, tag (and its signature):

===== End Results =====

```

Even though the diff result mostly contains files only available on the APK built by us, there are 6 binary files that have different content from the APK available on PlayStore.

This binary is **not verifiable**.

{% include asciicast %}