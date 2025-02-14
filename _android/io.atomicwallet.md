---
wsId: 'atomic'
title: 'Bitcoin Wallet Crypto Ethereum'
altTitle: 
authors:
- 'leo'
- 'danny'
users: 1000000
appId: 'io.atomicwallet'
appCountry: 
released: '2019-01-30'
updated: 2024-12-11
version: '1.34.4'
stars: 4.4
ratings: 62655
reviews: 5746
website: 'https://atomicwallet.io'
repository: 
issue: 
icon: 'io.atomicwallet.png'
bugbounty: 
meta: 'ok'
verdict: 'obfuscated'
appHashes: []
date: '2024-07-13'
signer: 
reviewArchive:
- date: '2020-10-12'
  version: '0.72.1'
  appHashes: []
  gitRevision: 'd83253e829502835962be71b96dd37287dc87f5c'
  verdict: 'nosource'
twitter: 'atomicwallet'
social:
- 'https://www.facebook.com/atomicwallet'
redirect_from: 
developerName: 'Atomic Wallet'
features: 

---

**Update 2024-07-13:**

We have not seen any major changes regarding the source-availability of its Android app.

**Update 2021-03-02:** We were approached by a visitor mentioning that Atomic
does have a GitHub and indeed [they do](https://github.com/Atomicwallet) but
none of the repositories there looks like belonging to this wallet. As it turns
out, the app is not only closed source but also **obfuscated** JS code which not
necessarily means bad intentions and might be due to Cordova working that way
but it certainly makes any attempt at auditing what the wallet actually does
very hard.

Just a random excerpt of the obfuscated code. The files are one line each.
Wrapped for better readability:

```
36600,"BOkBACbpAQ=="),base64DecodeToExistingUint8Array(o,1136616,"BekBACfpAQ==")
,base64DecodeToExistingUint8Array(o,1136632,"BukBACjpAQ=="),base64DecodeToExisti
ngUint8Array(o,1136648,"B+kBACnpAQ=="),base64DecodeToExistingUint8Array(o,113666
4,"COkBACrpAQ=="),base64DecodeToExistingUint8Array(o,1136680,"CekBACvpAQ=="),bas
e64DecodeToExistingUint8Array(o,1136696,"CukBACzpAQ=="),base64DecodeToExistingUi
nt8Array(o,1136712,"C+kBAC3pAQ=="),base64DecodeToExistingUint8Array(o,1136728,"D
OkBAC7pAQ=="),base64DecodeToExistingUint8Array(o,1136744,"DekBAC/pAQ=="),base64D
ecodeToExistingUint8Array(o,1136760,"DukBADDpAQ=="),base64DecodeToExistingUint8A
rray(o,1136776,"D+kBADHpAQ=="),base64DecodeToExistingUint8Array(o,1136792,"EOkBA
DLpAQ=="),base64DecodeToExistingUint8Array(o,1136808,"EekBADPpAQ=="),base64Decod
eToExistingUint8Array(o,1136824,"EukBADTpAQ=="),base64DecodeToExistingUint8Array
(o,1136840,"E+kBADXpAQ=="),base64DecodeToExistingUint8Array(o,1136856,"FOkBADbpA
Q=="),base64DecodeToExistingUint8Array(o,1136872,"FekBADfpAQ=="),base64DecodeToE
xistingUint8Array(o,1136888,"FukBADjpAQ=="),base64DecodeToExistingUint8Array(o,1
136904,"F+kBADnpAQ=="),base64DecodeToExistingUint8Array(o,1136920,"GOkBADrpAQ=="
),base64DecodeToExistingUint8Array(o,1136936,"GekBADvpAQ=="),base64DecodeToExist
ingUint8Array(o,1136952,"GukBADzpAQ=="),base64DecodeToExistingUint8Array(o,11369
68,"G+kBAD3pAQ=="),base64DecodeToExistingUint8Array(o,1136984,"HOkBAD7pAQ=="),ba
se64DecodeToExistingUint8Array(o,1137e3,"HekBAD/pAQ=="),base64DecodeToExistingUi
nt8Array(o,1137016,"HukBAEDpAQ=="),base64DecodeToExistingUint8Array(o,1137032,"H
+kBAEHpAQ=="),base64DecodeToExistingUint8Array(o,1137048,"IOkBAELpAQ=="),base64D
ecodeToExistingUint8Array(o,1137064,"IekBAEPpAQ==");var c=function asmFunc(e,r,a
){var t=new e.Int8Array(a),i=new e.Int16Array(a),A=new e.Int32Array(a),s=new e.U
int8Array(a),_=new e.Uint16Array(a),o=(new e.Uint32Array(a),new e.Float32Array(a
),new e.Float64Array(a)),$=e.Math.imul,f=(e.Math.fround,e.Math.abs,e.Math.clz32)
,c=(e.Math.min,e.Math.max,e.Math.floor,e.Math.ceil,e.Math.sqrt,r.abort),b=(e.NaN
,e.Infinity,r.__wbindgen_object_drop_ref),u=r.__wbindgen_string_new,l=r.__wbg_ne
w_3a746f2619705add,k=r.__wbg_call_f54d3a6dadb199ca,m=r.__wbindgen_jsval_eq,v=r._
_wbg_self_ac379e780a0d8b94,y=r.__wbg_crypto_1e4302b85d4f64a2,w=r.__wbindgen_is_u
ndefined,g=r.__wbg_getRandomValues_1b4ba144162a5c9e,p=r.__wbg_require_6461b1e9a0
d7c34a,E=r.__wbg_getRandomValues_1ef11e888e5228e9,B=r.__wbg_randomFillSync_1b52c
8482374c55b,h=r.__wbindgen_string_get,D=r.__wbindgen_debug_string,Q=r.__wbindgen
_throw,U=r.__wbindgen_rethrow,x=1048576,T=0,C=0,M=0;function $0(e,r,a){e|=0,r|=0
,a|=0;var t,i=0,_=0,o=0,$=0,f=0,b=0,u=0,l=0,k=0,m=0,v=0,y=0,w=0,g=0,p=0,E=0,B=0,
h=0,D=0,Q=0,U=0,T=0,C=0,I=0,G=0,W=0,Y=0,F=0,Z=0,H=0,N=0,P=0,j=0,R=0,V=0,z=0,J=0,
O=0,X=0,L=0,K=0,S=0,q=0,ee=0,re=0,ae=0,te=0,ie=0,Ae=0,ne=0,se=0,_e=0,oe=0,$e=0,f
e=0,ce=0,be=0,ue=0,de=0,le=0,ke=0,me=0,ve=0,ye=0,we=0,ge=0,pe=0,Ee=0,Be=0,he=0,D
e=0,Qe=0,Ue=0,xe=0,Te=0,Ce=0,Me=0,Ie=0,Ge=0,We=0,Ye=0,Fe=0,Ze=0,He=0,Ne=0,Pe=0,j
e=0,Re=0,Ve=0,ze=0,Je=0,Oe=0,Xe=0,Le=0,Ke=0,Se=0,qe=0,er=0,rr=0,ar=0,tr=0,ir=0,A
r=0,nr=0,sr=0,_r=0,or=0,$r=0,fr=0,cr=0,br=0,ur=0,dr=0,lr=0,kr=0,mr=0,vr=0,yr=0,w
r=0,gr=0,pr=0,Er=0,Br=0,hr=0,Dr=0,Qr=0,Ur=0,xr=0,Tr=0,Cr=0,Mr=0,Ir=0,Gr=0,Wr=0,Y
r=0,Fr=0,Zr=0,Hr=0,Nr=0,Pr=0,jr=0,Rr=0,Vr=0,zr=0,Jr=0,Or=0,Xr=0,Lr=0,Kr=0,Sr=0,q
r=0,ea=0,ra=0,aa=0,ta=0,ia=0,Aa=0,na=0,sa=0,_a=0,oa=0,$a=0,fa=0,ca=0,ba=0,ua=0,d
a=0,la=0,ka=0,ma=0,va=0,ya=0,wa=0,ga=0,pa=0,Ea=0,Ba=0,ha=0,Da=0,Qa=0,Ua=0,xa=0,T
a=0,Ca=0,Ma=0,Ia=0,Ga=0,Wa=0,Ya=0,Fa=0,Za=0,Ha=0,Na=0,Pa=0,ja=0,Ra=0,Va=0,za=0,J
a=0,Oa=0,Xa=0,La=0,Ka=0,Sa=0,qa=0,et=0,rt=0,at=0,tt=0,it=0,At=0,nt=0,st=0,_t=0,o
t=0,$t=0,ft=0,ct=0,bt=0,ut=0,dt=0,lt=0,kt=0,mt=0,vt=0,yt=0,wt=0,gt=0,pt=0,Et=0,B
```

**Original review:**

Bitcoin Wallet & Ethereum Ripple Tron EOS
is a non-custodial wallet according to their description:

> Atomic Wallet is universal non-custodial app for over 300 cryptocurrencies.

Unfortunately they do not share all sources for the Android app.

Verdict: This wallet is **not verifiable**.
