---
title: Why we need "Layer Two" solutions
subtitle: How to get all the world and their fridges on a Bitcoin Standard
excerpt: 
authors:
- leo
- danny
date: 2022-08-28
---

![bitcoin-lightning](/images/blog/1/bitcoin-lightning-blog.png)

We want all the world to use Bitcoin, yet Satoshi already remarked that it was
not suited for microtransactions in
[August 2010](https://bitcointalk.org/index.php?topic=287.msg7524#msg7524):

> Bitcoin isn't currently practical for very small micropayments.  Not for things like pay per search or per page view without an aggregating mechanism, not things needing to pay less than 0.01.  The dust spam limit is a first try at intentionally trying to prevent overly small micropayments like that.
> 
> Bitcoin is practical for smaller transactions than are practical with existing payment methods.  Small enough to include what you might call the top of the micropayment range.  But it doesn't claim to be practical for arbitrarily small micropayments. 
> 
> -- Satoshi


He added the formal `MAX_BLOCK_SIZE`
[in September 2010](https://github.com/bitcoin/bitcoin/commit/8c9479c6bbbc38b897dc97de9d04e4d5a5a36730#diff-608d8de3fba954c50110b6d7386988f27295de845e9d7174e40095ba5efcf1bbR1422-R1423)
and in March 2013,
[Mike Hearn claimed](https://bitcointalk.org/index.php?topic=149668.msg1596879#msg1596879)
to have received the following e-mail in April 2009, mere months after the
Bitcoin blockchain launched:

> Hi Mike,
> 
> I'm glad to answer any questions you have.  If I get time, I ought to write a FAQ to supplement the paper.
> 
> There is only one global chain.
> 
> The existing Visa credit card network processes about 15 million Internet purchases per day worldwide.  Bitcoin can already scale much larger than that with existing hardware for a fraction of the cost.  It never really hits a scale ceiling.  If you're interested, I can go over the ways it would cope with extreme size.
> 
> By Moore's Law, we can expect hardware speed to be 10 times faster in 5 years and 100 times faster in 10.  Even if Bitcoin grows at crazy adoption rates, I think computer speeds will stay ahead of the number of transactions.
> 
> I don't anticipate that fees will be needed anytime soon, but if it becomes too burdensome to run a node, it is possible to run a node that only processes transactions that include a transaction fee.  The owner of the node would decide the minimum fee they'll accept.  Right now, such a node would get nothing, because nobody includes a fee, but if enough nodes did that, then users would get faster acceptance if they include a fee, or slower if they don't.  The fee the market would settle on should be minimal.  If a node requires a higher fee, that node would be passing up all transactions with lower fees.  It could do more volume and probably make more money by processing as many paying transactions as it can.  The transition is not controlled by some human in charge of the system though, just individuals reacting on their own to market forces.
> 
> Eventually, most nodes may be run by specialists with multiple GPU cards.  For now, it's nice that anyone with a PC can play without worrying about what video card they have, and hopefully it'll stay that way for a while.  More computers are shipping with fairly decent GPUs these days, so maybe later we'll transition to that.
> 
> -- Mike Hearn quoting Satoshi

What followed was an intense fight over the block size limit but this fight
now [is history](https://blog.bitmex.com/the-blocksize-war-chapter-1-first-strike/)
and Bitcoin kept the 1MB limit in place.

1MB per block means 6MB per hour, 144MB per day and 51.8GB per year. How much
block space is that per human being on average? Divided by 8 billion ... that's
**6.5 byte per human per year**.

A typical transaction [weighs 212 bytes](https://bitcoinops.org/en/tools/calc-size/).

212 / 6.5 ... that's 33. Humans could do on average one transaction every 33
years.

If on the other hand, we wanted to do an average of 5 transactions per person per
day, personal demand would be 33 * 360 * 5 = 59400 times higher. That would mean
either of:

* a block size of 60GB. Every ten minutes.
* only 1/59400 can use Bitcoin. A pretty small club.

Five transactions per day per person is probably the order of magnitude the
current financial system handles between Visa, PayPal, bank wires and cash
payments. So how do we get there with Bitcoin??

# A multi-layered system

The early internet worked much like Bitcoin today: What one sent via the internet
was broadcast to all the participants on the network. At the time those were
only two more participants and then 5 and then 20 but in order to scale out to
millions and billions of users, it was clear from the start that sending data
via broadcast wasn't sustainable.

Today's internet "routes" messages as efficient as possible from the sender to the recipient, so Alice sending to Bob doesn't affect Carol sending to Dave and the protocols used are built in [layers](https://en.wikipedia.org/wiki/Internet_protocol_suite#Layer_names_and_number_of_layers_in_the_literature): The application developer doesn't need to know about network interface voltages or wavelength division multiplexing in optical cables or how to avoid data loss when the user is driving around, connecting to varying radio towers while communicating. All these issues are resolved by more basic layers that provide the higher layers a simpler handling of the network.

In 2016, Thaddeus Dryja of MIT’s Digital Currency Initiative together with Joseph Poon of the University of Southern California published "The Bitcoin Lightning Network" paper. In it they claim: 

> Clearly, achieving Visa-like capacity on the Bitcoin network isn’t feasible today. No home computer in the world can operate with that kind of bandwidth and storage. If Bitcoin is to replace all electronic payments in the future, and not just Visa, it would result in the outright collapse of the Bitcoin network, or at best, extreme centralization of Bitcoin nodes and miners to the only ones who could afford it. This centralization would then defeat aspects of network decentralization that make Bitcoin secure, as the ability for entities to validate the chain is what allows Bitcoin to ensure ledger accuracy and security. [1]

The premises for the paper are prescient because it anticipated future congestion in the Bitcoin network. Such was further evidenced one year after the paper’s publication when in 2017, the Bitcoin network for the first time experienced a sustained period of full blocks resulting in an ever growing backlog of unconfirmed transactions. 

![Caption: Bitcoin Network Congestion between 2017-2018
Source: charts.woobull.com / @woonomic](/images/blog/1/bitcoin-congestion-woonomic.png)

This backlog - the "mem-pool" can only be "skipped" by paying a higher transaction fee than all the others - and so users paid. At times a lot! The average transaction fee on December 18, 2017 reached [$42.67](https://bitcoinvisuals.com/chain-fees-tx-usd). Suffice to say, that paying for your $5 coffee with a transaction fee of $42 is not an ideal characteristic for the future of money.

On March 15, 2018 the lightning network's mainnet was launched.

![Daily median transaction fee statistics per transaction and block, excluding coinbase transaction (miner reward).
Source: https://bitcoinvisuals.com/chain-fees-tx-usd](/images/blog/1/bitcoin-median-transaction-fees.png)

A recent working paper entitled "[The Lightning Network: Turning Bitcoin into Money](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4142590)" by Anantha Divakaruni and Peter Zimmerman, published in June 2022, notes [2]: 

> We can assess the economic significance of reducing Bitcoin congestion by posing the following counterfactual question: if during 2017, the LN had existed and been the size it was at the end of our sample, by how much would Bitcoin congestion have been lowered? Our results suggest that
the mempool count would have been 93 percent lower, mempool fees 96 percent lower, and the proportion of low fee transactions 197 percent higher. These numbers demonstrate that the LN can potentially have a substantial impact on blockchain congestion.

Their conclusion:

> We show that usage of the Lightning Network is associated with reduced mempool congestion in Bitcoin and with lower fees. Our findings suggest that the off-chain netting benefits of the Lightning Network can help Bitcoin to scale and function better as a means of payment.

## How to get all the world and their fridges on a Bitcoin Standard

The technical nuances and the economics of Bitcoin are simply one aspect of the goal to make “sound money” universal and apolitical. Coming up with one solution or even many solutions from our end would belie our own hubris, which we thankfully do not possess. 

It is in this light that we have to do a little introspection and ask the hard questions ourselves. 

We’ve seen states like El Salvador tread the waters of adopting Bitcoin as legal tender. 

We’ve seen regulators, lawyers, and governments attempt to frame Bitcoin in their archaic monetary systems as tax payments or as assets that can be auctioned off by the US marshals. 

We’ve also seen venture capitalists, hedge funds, and monetary speculators carve out a hefty fortune by trading Bitcoin in the markets.

Bitcoin is now more than a decade old, perhaps it is more enlightening to ask why the world is not yet on the Bitcoin standard. More appropriately, why have the web titans rejected Bitcoin after accepting it for a while?

We have not been able to find data on worldwide retailer adoption that's updated on a real-time basis. The closest we have is [coinmap.org](https://coinmap.org). But the data source for this is not current. For instance, de-listing a business would require the business owner to send an email to the administrators of the site. 

We have to begin with the metrics beyond marketing hype and media frenzy. 

- Amazon.com - is still not accepting Bitcoin according to an April 14, 2022, [CNet article](https://www.cnet.com/personal-finance/crypto/amazon-not-accepting-cryptocurrency-soon-may-get-into-nfts-ceo-says/#:~:text=Amazon%20CEO%20Andy%20Jassy%20told,%2Dpowered%20technology%2C%20he%20said.).

- Steam.com - announced that [Steam was no longer accepting Bitcoin]((https://steamcommunity.com/games/593110/announcements/detail/1464096684955433613). ) on December 7, 2017. Valve President Gabe Newell offered some scathing remarks and the reason for Steam not accepting cryptocurrencies: 

  > "The problem is that a lot of the actors who are in that space are not people you want interacting with your customers," Newell said. "We had problems when we started accepting cryptocurrencies as a payment option. 50% of those transactions were fraudulent, which is a mind-boggling number. These were customers we didn't want to have."

- Alphabet (Google) - has made some [announcements](https://www.bloomberg.com/news/articles/2022-01-19/google-hires-paypal-vet-to-reset-strategy-after-banking-retreat) about "storing cryptocurrencies in digital cards" but it is clear that Google Pay would not be accepting cryptocurrencies as a payment option any time soon.

- Meta (Facebook) - has drawn a lot of scrutiny from government regulators amidst the hype that it stirred when it announced its own stablecoin project, Diem. It [announced the sale of Diem's](https://www.diem.com/en-us/updates/stuart-levey-statement-diem-asset-sale/) intellectual property and other assets to Silvergate Capital Corporation on February 1, 2022. To date, Facebook does not accept cryptocurrencies as payments and has [stringent policies](https://www.facebook.com/policies_center/ads/restricted_content/cryptocurrency_products_and_services) concerning advertisements:

  > Ads may not promote cryptocurrency trading platforms, software and related services and products that enable monetization, reselling, swapping or staking of cryptocurrencies without prior written permission. 

- JD.com / Joybuy.com (Chinese e-commerce) - accepts Visa, Mastercard, American Express, JCB, Diners Club, Discover, UnionPay, Paypal, Yandex Money/Qiwi,
iDeal, EPS, Sofort, Giropay, DotPay, POLi, Local Credit/Debit Cards for Brazil, Local Credit/Debit Cards for Mexico and Ebanx Account. Bitcoin and other cryptocurrencies are not supported. JD.com's technology branch does have its own blockchain called [JD Chain](https://jdcorporateblog.com/jd-com-self-developed-blockchain-framework-now-open-to-businesses/). It can be recalled that the PBOC (People's Bank of China) [banned all cryptocurrency transactions](http://www.pbc.gov.cn/goutongjiaoliu/113456/113469/4348521/index.html).

- Alibaba, TenCent, ByteDance (TikTok), and Meituan - all are China-based and thus subject to the restrictions imposed by the PBOC. ByteDance has also imposed restrictions on cryptocurrency-related content. 

- Netflix - Directly transacting with Bitcoin on the site is not possible. A common workaround is to use gift cards which can be paid for using Bitcoin.

- Paypal - Allowed buying, selling and transfer of Bitcoin and other cryptocurrencies in select jurisdictions provided the user fills out an IRS W-9 form. 

## What is common among these top Internet companies?

These are all web-based companies with a majority of their revenue stemming from online purchases of goods or services. These companies are also known for coming up (or trying to) with their own payment systems. 

- Amazon came up with Amazon Pay. 
- Meta tried to come up with their own stablecoin Diem.
- Google has Google Pay
- Alibaba has AliPay
- TenCent has WeChat Pay
- Other China-based e-commerce services are now integrating the Chinese government's CBDC, e-CNY, or the digital Renminbi.

Some of these companies have at one point, looked into Bitcoin and other cryptocurrencies. Several things happened during the initial discovery period. The period between 2017-2018 was notorious as the time when the ICO bubble burst. Chainalysis reports that 2019 was the year when illicit transactions reached a high of $11.7 billion. This would go down to $7.8 billion during the 2020 pandemic but would make a comeback in 2021 with a record **$14 billion** dollars in illicit transactions. 2021 and 2022, are unfortunately shaping up to be the years when many DeFi (Decentralized Finance) projects collapse.

Note that while there is an increase in the value of crypto-related illicit transactions - **the overall share of illicit transactions in the broader spectrum of all crypto transactions has decreased.**

![Chainalysis Illicit Cryptocurrency Transactions](/images/blog/1/chainalysis-cryptocurrency-related-crime.png)

Two words to explain why many of the biggest web businesses do not accept cryptocurrencies: *regulatory risk*. This was the case in China when the PBOC cited cryptocurrency-related crime and money laundering as the basis for its decision to ban the use of cryptocurrencies. 

There are many philosophical dimensions in the goal to make sound money disentangled from politics and governmental control. Governments by nature, however, cannot help but control money as this is where their power comes from. Policy, law enforcement, justice and the coercive nature of the state bring us back to the concept of fiat, and subsequently fiat money. Translated from Latin, *"let it be done"* epitomizes the hierarchical structure of violence and coercion. Corollary to this is the presumption of an "or else". Thus, "Let it be done - or else". Hence, the more authoritarian a regime is, the more it tends to introduce measures that give the state more control over its monetary policy. 

### The perfect geo-political storm

Today, the world is in a precarious political and financial state due to several major issues. The Russia-Ukraine war, runaway inflation, port congestion, bizarre weather patterns all over the world, and the after-effects of the Covid pandemic have made many governments on edge. The war in Ukraine is a very costly one. The [Kiel Institute](https://www.ifw-kiel.de/topics/war-against-ukraine/ukraine-support-tracker/#:~:text=The%20newest%20update%20of%20the,commitments%20of%2084.2%20billion%20euros.) has been keeping track of the financial support commitments made by the United States and European countries to Ukraine and has currently pegged the number at 84.2 billion Euros ($84.1 billion USD). 

On the other side of the war, Russia is under heavy sanctions from multiple countries affecting several industries[3], businesses, and financial instruments. Russia has also been disconnected from SWIFT.

![Russia Sanctions](/images/blog/1/sanctions-on-russia-by-date-country.png)

One would think that a permissionless, decentralized, and peer-to-peer currency would be able to bypass these sanctions. There is an ongoing debate with many developments. Initially, this was not the opinion of a Cato Institute report entitled ["Bitcoin Won't Rescue Russian Oligarchs from Sanctions"](https://policycommons.net/artifacts/2269610/bitcoin-wont-rescue-russian-oligarchs-from-sanctions/3029439/) penned by Matthew Sweeney. In it he writes: 

> Coinbase has already committed to blocking transactions associated with sanctioned Russians but has declined to ban all Russian users. If you are a Russian oligarch seeking to use cryptocurrencies to evade sanctions there are a few steps you have to take:
>
- Use your $, €, £, or ₽ to buy cryptocurrencies at an exchange
- Sell your cryptocurrencies for $, €, £, or ₽ on the exchange
- Transfer the $, €, £, or ₽ from the exchange to a traditional financial institution.
>
> All three steps would be very easy for investigators to trace. For many on the list of sanctioned individuals step #1 is already impossible, as their accounts are frozen and prominent cryptocurrency exchanges would not accept your transfer even if they could access their accounts. An oligarch who does manage to buy cryptocurrencies on an exchange with fiat could seek to throw investigators off their trail by sending their holdings to a tumbler. But these are not without significant drawbacks, and some exchanges do not allow assets that have been through tumblers to enter their platform. 
> 
> If tumblers are not a viable option, a panicked oligarch might turn to privacy‐​oriented cryptocurrencies such as Monero, which allows users to hide transaction histories. But Monero will not help you solve the problems inherent in step #3. Even if buying Monero does make it harder for investigators to trace your holdings, you still need to find an exchange that will allow you to sell your cryptocurrencies for fiat and then transfer that fiat to a financial institution such as a bank. Or wait for Monero to become a widely accepted cryptocurrency for ordinary everyday payments, which is unlikely any time soon.[4] 

### Takeaway No. 1, Bitcoin has to be used for everyday payments or microtransactions.

Note the exception at the end of this quoted paragraph, *"Or wait for Monero to become a widely accepted cryptocurrency for ordinary everyday payments"*. Focus on the context where 'Monero' is used instead of Bitcoin. One could easily say that if and only if Bitcoin and cryptocurrencies were readily usable for everyday payments - **perhaps, this is the only way when it would become truly permissionless**. 

Notable cryptocurrency exchange operators Changpeng Zhao (Binance) and Brian Armstrong (Coinbase) [have this to say](https://fortune.com/2022/03/06/can-the-kremlin-use-crypto-to-evade-sanctions-doubtful-experts-say-but-for-some-ordinary-russians-its-a-lifeline/) about the possibility of Russia using cryptocurrencies to evade sanctions: 

> The Kremlin won’t be able to use virtual money to evade sanctions from Western companies, Binance founder Changpeng Zhao said Friday, because “crypto is too small for Russia.”

and 

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">1/ We&#39;ve been seeing some questions/discussion around whether crypto can be used to avoid sanctions. A few thoughts...</p>&mdash; Brian Armstrong - barmstrong.eth (@brian_armstrong) <a href="https://twitter.com/brian_armstrong/status/1499621509651787782?ref_src=twsrc%5Etfw">March 4, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Jake Chervinsky, Head of Policy of the Blockchain Association [has this thread](https://twitter.com/jchervinsky/status/1498786025438650369) to address these concerns: 

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">1/ Russia can&#39;t &amp; won&#39;t use crypto to evade sanctions.<br><br>Concerns about crypto&#39;s use for sanctions evasion are totally unfounded. They fundamentally misunderstand:<br><br>- how sanctions work<br>- how crypto markets work<br>- how Putin is actually trying to mitigate sanctions<br><br>I&#39;ll explain 🧵</p>&mdash; Jake Chervinsky (@jchervinsky) <a href="https://twitter.com/jchervinsky/status/1498786025438650369?ref_src=twsrc%5Etfw">March 1, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

A few notable quotes: 

> Russia's access to a global payment network has nothing to do with the goal of primary sanctions, cutting Russia off from the US economy. It's illegal for US persons to transact with SDNs, period. It doesn't matter if they use dollars, gold, sea shells, or bitcoin.
>
> US persons around the world are cutting ties with Russian SDNs right now, regardless of what payment systems they were using previously. There's zero reason to think crypto's existence will convince any of them to willfully violate sanctions laws, risking fines & jail time.

### Takeaway No. 2, Bitcoin has to be universal and large enough to make any meaningful discussion about the entire world adopting the Bitcoin Standard

As a further note about anonymity and sanctions, the OFAC can add wallet addresses and software to its SDN (Specially Designated Nationals) list. Being designated an SDN means that **"Their assets are blocked and U.S. persons are generally prohibited from dealing with them"**. This happened recently when Tornado.cash, an ETH mixer, blender.io, and several ETH and USDC addresses have been [added to OFAC's SDN list](https://home.treasury.gov/policy-issues/financial-sanctions/recent-actions/20220808). This prompted a response from the EFF (Electronic Frontier Foundation) seeking to clarify with the OFAC what the action implies since it maintains the position that "Code is Speech". The [gist of the clarification](https://www.eff.org/deeplinks/2022/08/code-speech-and-tornado-cash-mixer) seeks to establish whether the OFAC may or may not be crossing Constitutional limits since "Tornado.cash" is not only a website with no clear identification as a natural entity, but clearly Open Source code. But that story is for another day. 

Wouldn't it be paradoxical if Bitcoin was adopted as a currency for example of all G7 member states? Wouldn't it be possible to do this with the force and coercion of legislative measures similar to what happened in El Salvador? 

To be sure, there are a lot of hurdles to this and many would balk at the notion of having nation-states enforce the adoption of Bitcoin through these means. 

Some within the Bitcoin ecosystem do not even see Bitcoin as a feasible currency for several reasons. Some see Bitcoin now as more of a store of value that empowers users to keep and store the value of their labors and wealth over time. This school of thought, also believes that this allows them to resist the rigors of fiat monetary debasement. This is perhaps why iterating the possibilities for Bitcoin has become some sort of philosophical exercise that needs constant attention and nurturing. Its decentralized and leaderless nature is like a kaleidoscope of different ideals and iterations. But if there's one thing that's common with proponents: it's the end goal of hyperbitcoinization. 

As described aptly by [BitcoinMagazine](https://bitcoinmagazine.com/hyperbitcoinization):

> Hyperbitcoinization is the inflection point at which Bitcoin becomes the default value system of the world. As more individuals and groups around the world realize the advantages of a borderless, censorship-resistant and natively digital system for transacting value, a critical mass of users will eventually fuel currency demonetization and the replacement of our world’s ingrained financial institutions and world powers with a more equitable, publicly-driven system. 

Notice the choice of words above describing Bitcoin as a "default value system". 

## Lightning's Role 

Skipping through all the possibilities for how this "inflection point" could come about, we then take a look at layer 2 solutions like lightning. The [BitcoinMagazine](https://bitcoinmagazine.com/hyperbitcoinization) article goes on to describe the Bitcoin circular economy: 

> One fundamental difference between today and the age of complete hyperbitcoinzation will be in the growth of the bitcoin circular economy, which would become simply “the economy.” When bitcoin becomes the world’s preferred currency, BTC will no longer be priced in any fiat equivalent (1 BTC will be worth 1 BTC) and BTC won’t regularly be exchanged (or sold) for any other currency. All goods and services will be available for BTC and, critically, this economy will be deflationary, as opposed to inflationary.

Notice that in the second sentence, bitcoin is now described as "the world's preferred currency". Since the debate on the scaling wars has ended, lightning has many of the technical characteristics that should allow bitcoin to become a feasible currency apt for everyday use. BitcoinBlackFriday further [describes the circular economy]((https://www.bitcoinblackfriday.com/bitcoin-guides/bitcoin-circular-economy)) as a system where participants exchange goods and services without having to use fiat currencies as reference points. 

Consider this scenario: A man decides to have a haircut and pays a barber 100,000 satoshis via Lightning. The barber then takes a break and buys lunch at a nearby deli. The deli owner receives payment via a lightning point-of-sale system and pays workers twice every month. The cafe workers then pay their rent and bills, etc. All of this is achievable with Bitcoin provided that fees are kept at a minimum and transactions are almost instantaneous. Furthermore, bitcoin lightning should be able to scale to handle all the transactions in any given day. 

The infrastructure for the Bitcoin circular economy is being built on lightning. In our hypothetical example above, the man who got a haircut could use a custodial wallet like the Wallet of Satoshi, and pay using lightning. The deli owner can pay the salaries of the workers using bitwage, a bitcoin lightning payroll solutions provider. People who want to purchase other items could do so via bitrefill. 

### Challenges ahead

The lightning network has the scalability to process millions to billions of transactions per second. The framework for new lightning startups and businesses are being established as I write this. There is growth in channel capacity which now stands at 4632.88 BTC. 

![mempool.lightning](/images/blog/1/lightning-mempool-space.png)
<sub>Lightning data from screengrab of <a href="https://mempool.space/lightning">Mempool.space</a></sub>

Like many projects, there are still nuances that have to be ironed out. One of these is whether the lightning network is diluting or re-framing the definition of peer-to-peer transactions by introducing the concept of routed nodes. The other issue is the technical know-how required in running nodes and opening channels to enable off-chain transactions. Surely, we cannot expect ordinary people to run nodes much less open channels to other nodes in order to make transactions. This makes the end user reliant on custodial nodes that provide wallets as a service. Of course, there's nothing that prevents people to running their own nodes and using wallets that allow connecting to their own node software at home. More than anything else, mass adoption hinges a lot on user experience. 

The problem with custodial services is the political aspect. The ramifications for providers that run a custodial service are immense. Custodianship would require registering with governmental entities and complying with regulatory frameworks which are in a state of constant iteration. As the recent actions of OFAC would suggest, money, technology and even software, have political dimensions which are not easily ignored. When there's war and criminal intent, governments would have no recourse but to enforce an idealized good through sheer political will. Concretely, this comes in the form of control. Hence, participants in any kind of hyperbitcoinization are left with the option of cooperating with existing governmental thrusts or creating a community that has a semblance of independence from any controlling entity. 

How this will come to be is a question that we will explore for another day.

[1] Dryja, T., & Poon, J. (2016, January 14). Lightningnetwork/paper: Lightning network paper. GitHub - Lightning Network. Retrieved September 1, 2022, from https://github.com/LightningNetwork/paper 

[2] Divakaruni, A., &amp; Zimmerman, P. (2022, June 21). The Lightning Network: Turning Bitcoin into Money. Retrieved September 3, 2022, from https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4142590 

[3] The Castellum.ai dashboard provides consolidated Russia sanctions data. the Page is updated daily. Castellum.AI. (n.d.). Retrieved September 2, 2022, from https://www.castellum.ai/russia-sanctions-dashboard 

[4] Feeney, M., 2022. Bitcoin Won’t Rescue Russian Oligarchs From Sanctions, Cato Institute. Retrieved from https://policycommons.net/artifacts/2269610/bitcoin-wont-rescue-russian-oligarchs-from-sanctions/3029439/ on 02 Sep 2022. CID: 20.500.12592/pshvc5.