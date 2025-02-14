---
title: Anish Athalye's Notary
appId: anishathalye.notary
authors:
- danny
released: 
discontinued: 
updated: 
version: 
binaries: 
dimensions: 
weight: 
provider: Anish Athalye (MIT CSAIL - Parallel & Distributed Operating Systems Group)
providerWebsite: https://www.anish.io/
website: https://www.anish.io/notary/
shop: 
country: US
price: 
repository: https://github.com/anishathalye/notary
issue: 
icon: anishathalye.notary.png
bugbounty: 
meta: ok
verdict: diy
appHashes: 
date: '2024-10-18'
signer: 
reviewArchive: 
twitter: anishathalye
social: 
features: 

---

## Update 2024-10-18

With no further updates regarding the notary, we took a look at Anish's blog and found that he is now working on something else after finishing his PhD. The Notary's repository is no longer actively maintained, but this can be seen as a **do-it-yourself** project.

## Product Description 2022-04-29

From Anish Athalye's [Notary page](https://www.anish.io/notary/):

> Notary is a new hardware and software architecture for running isolated approval agents in the form factor of a USB stick with a small display and buttons. Approval agents allow factoring out critical security decisions, such as getting the user’s approval to sign a Bitcoin transaction or to delete a backup, to a secure environment. The key challenge addressed by Notary is to securely switch between agents on the same device. Prior systems either avoid the problem by building single-function devices like a USB U2F key, or they provide weak isolation that is susceptible to kernel bugs, side channels, or Rowhammer-like attacks. Notary achieves strong isolation using reset-based switching, along with the use of physically separate systems-on-a-chip for agent code and for the kernel, and a machine-checked proof of both the hardware’s register-transfer-level design and software, showing that reset-based switching leaks no state. Notary also provides a trustworthy I/O path between the agent code and the user, which prevents an adversary from tampering with the user’s screen or buttons.
>
> We built a hardware/software prototype of Notary, using a combination of ARM and RISC-V processors. The prototype demonstrates that it is feasible to verify Notary’s reset-based switching, and that Notary can support diverse agents, including cryptocurrencies and a transaction approval agent for traditional client-server applications such as websites. Measurements of reset-based switching show that it is fast enough for interactive use. We analyze security bugs in existing cryptocurrency hardware wallets, which aim to provide a similar form factor and feature set as Notary, and show that Notary’s design avoids many bugs that affect them.

More information can be found: 

- MIT's [PDF file](https://people.csail.mit.edu/nickolai/papers/athalye-notary-login.pdf).
- MIT PDOS CSAIL [PDF file](https://pdos.csail.mit.edu/papers/notary:sosp19.pdf)
- Anish Athalye's [Video Presentation](https://sosp19.rcs.uwaterloo.ca/videos/D1-S2-P3.mp4)
- The Notary [Code](https://github.com/anishathalye/notary)

## Analysis 

As far as we can tell, the device has **not been released commercially**. We [reached out to Anish via twitter](https://twitter.com/dannybuntu/status/1514192538756087812) to confirm whether the device was released commercially.

This was the reply: 

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Yes! We&#39;ve been building end-to-end (hardware+software) formally verified hardware security modules, starting with examples simpler than crypto wallets. We have an upcoming OSDI&#39;22 paper; if you want to see a preprint, please email me</p>&mdash; Anish Athalye (@anishathalye) <a href="https://twitter.com/anishathalye/status/1514240904252469260?ref_src=twsrc%5Etfw">April 13, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

