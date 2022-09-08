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

> Clearly, achieving Visa-like capacity on the Bitcoin network isn’t feasible today. No home computer in the world can operate with that kind of bandwidth and storage. If Bitcoin is to replace all electronic payments in the future, and not just Visa, it would result in the outright collapse of the Bitcoin network, or at best, extreme centralization of Bitcoin nodes and miners to the only ones who could afford it. This centralization would then defeat aspects of network decentralization that make Bitcoin secure, as the ability for entities to validate the chain is what allows Bitcoin to ensure ledger accuracy and security. [^1]

The premises for the paper are prescient because it anticipated future congestion in the Bitcoin network. Such was further evidenced one year after the paper’s publication when in 2017, the Bitcoin network for the first time experienced a sustained period of full blocks resulting in an ever growing backlog of unconfirmed transactions. 

![Caption: Bitcoin Network Congestion between 2017-2018
Source: charts.woobull.com / @woonomic](/images/blog/1/bitcoin-congestion-woonomic.png)

This backlog - the "mem-pool" can only be "skipped" by paying a higher transaction fee than all the others - and so users paid. At times a lot! The average transaction fee on December 18, 2017 reached [$42.67](https://bitcoinvisuals.com/chain-fees-tx-usd). Suffice to say, that paying for your $5 coffee with a transaction fee of $42 is not an ideal characteristic for the future of money.

On March 15, 2018 the lightning network's mainnet was launched.

![Daily median transaction fee statistics per transaction and block, excluding coinbase transaction (miner reward).
Source: https://bitcoinvisuals.com/chain-fees-tx-usd](/images/blog/1/bitcoin-median-transaction-fees.png)

A recent working paper entitled "[The Lightning Network: Turning Bitcoin into Money](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4142590)" by Anantha Divakaruni and Peter Zimmerman, published in June 2022, notes [^2]: 

> We can assess the economic significance of reducing Bitcoin congestion by posing the following counterfactual question: if during 2017, the LN had existed and been the size it was at the end of our sample, by how much would Bitcoin congestion have been lowered? Our results suggest that
the mempool count would have been 93 percent lower, mempool fees 96 percent lower, and the proportion of low fee transactions 197 percent higher. These numbers demonstrate that the LN can potentially have a substantial impact on blockchain congestion.

Their conclusion:

> We show that usage of the Lightning Network is associated with reduced mempool congestion in Bitcoin and with lower fees. Our findings suggest that the off-chain netting benefits of the Lightning Network can help Bitcoin to scale and function better as a means of payment.

## Lightning Growth and Adoption 

This graphic created by Arcane Research, shows the growth of the Lightning Network ecosystem: 

![Lightning Network Ecosystem](/images/blog/1/lightning-network-ecosystem.png)
<sub><a href="https://arcane.no/research/reports/the-state-of-lightning-volume-2">The State of the Lightning Network Volume 2</a></sub>

Arcane Research, in a report published on April 7, 2022, entitled *[The State of the Lightning Network Volume 2](https://arcane.no/research/reports/the-state-of-lightning-volume-2)*, observed that user adoption and growth markedly increased between 2021 and 2022:

> "By gathering actual transaction data to estimate the use of the Lightning Network,
we observe that adoption is rising quickly. The number of payments has roughly
doubled over the last year, while the value of the payments has increased by more
than 400%, measured in US dollars." [^3]  

They go on to claim in the same paper that: 

> We estimated that just over 100,000 users had access to Lightning payments
globally last summer. In March 2022, we estimate that more than 80 million people
had access to Lightning payments on an installed application.

Everything from wallets, gaming, exchanges, neobanks, node services, podcasting, communities, finance, and liquidity comprise the ecosystem which will further drive the growth of Bitcoin.

Arcane Research based these *estimates* on the integration of lightning in three primary apps, Chivo, Cash App and Paxful. Note, that these do not count private channels and invisible nodes. Cash App [announced](https://twitter.com/CashApp/status/1490767860750336004?ref_src=twsrc%5Etfw%7Ctwcamp%5Etweetembed%7Ctwterm%5E1490767860750336004%7Ctwgr%5Ef2ba4863aa1af2e19b04df4438595a7c4a58cd07%7Ctwcon%5Es1_&ref_url=https%3A%2F%2Fcointelegraph.com%2Fnews%2Fbitcoin-lightning-network-goes-live-on-cash-app) lightning integration on February 8, 2022. 

**<center>Payment Volume and Payment Count on the Lightning Network.</center>**
![Arcane Research](/images/blog/1/arcane-research-payment-volume.png)

<sub><a href="https://arcane.no/research/reports/the-state-of-lightning-volume-2">Source: Arcane Research</a></sub>

## Timeline of Bitcoin Lightning in El Salvador

No other country has made bold steps to incorporate Bitcoin as legal tender than El Salvador. This Central American nation of 6.4 million people is becoming a financial laboratory and all eyes are on it. Detractors criticize President Bukele for adopting a policy that puts it at odds with the IMF. Meanwhile, supporters and proponents of Bitcoin see the country as an important proof-of-concept that will demonstrate the capabilities of the Lightning Network on a national basis. 

Here is as timeline of pertinent events concerning El Salvador's Bitcoin adoption: 

- **November 7, 2017** Nayyib Bukele's [first tweet](https://twitter.com/nayibbukele/status/927755938244759552) about Bitcoin

    <blockquote class="twitter-tweet"><p lang="es" dir="ltr">Pues si, es oficial, usaremos Bitcoin 😎 cc. <a href="https://twitter.com/bcr_sv?ref_src=twsrc%5Etfw">@bcr_sv</a></p>&mdash; Nayib Bukele (@nayibbukele) <a href="https://twitter.com/nayibbukele/status/927755938244759552?ref_src=twsrc%5Etfw">November 7, 2017</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
    

- **May 11, 2019** - Coinbase [announces availability in El Salvador](https://www.coinbase.com/places/el-salvador)

- **Sometime in 2019** - Mike Peterson [receives an undisclosed amount in Bitcoins](https://bitcoinmagazine.com/culture/original-bitcoin-beach-white-paper) from an anonymous donator to make a bitcoin circular economy in El Zonte, El Salvador.

- **February 5, 2020** - Athena Bitcoin [installs first Bitcoin ATM in El Salvador](https://twitter.com/AthenaBitcoin/status/1225045328572887040)

- **April 1, 2021** - Strike [launches](https://www.coindesk.com/tech/2021/03/31/strike-launches-bitcoin-lightning-payment-app-in-el-salvador-full-eu-support-is-next/) in El Salvador

- **June 9, 2021** - President Nayyib Bukele, sends the [Bitcoin law back to El Salvador's Congress](https://twitter.com/nayibbukele/status/1402442597235310596)

- **August 17, 2021** - The Central Bank of El Salvador [published](https://www.bcr.gob.sv/regulaciones/upload/Normas_Tecnicas_para_Facilitar_la_Aplicacion_de_la_Ley_Bitcoin.pdf) the "COMPILED DOCUMENT THAT INCLUDES PROJECT OF TECHNICAL STANDARDS FOR
FACILITATE THE APPLICATION OF THE BITCOIN LAW, SUBJECT TO CONSULTATION." (translated)

- **September 7, 2021** - [Chivo wallet](https://twitter.com/nayibbukele/status/1429608848998993924) launched
  - Over [200 Chivo ATMs](https://cointelegraph.com/news/el-salvador-ranks-third-in-global-bitcoin-atm-installations-data-finds) installed.

- **September 8, 2021** - Bitcoin law comes into effect.   

- **November 22, 2021** - Bitcoin City and [Bitcoin Bonds/Volcano Bonds announced in LaBitConf](https://www.cnbc.com/2021/11/22/el-salvador-plans-bitcoin-city-raise-1-billion-via-bitcoin-bond.html)

- **January 24, 2022** - The IMF recommended in a [Country Report](file:///home/dannybuntu/Documents/temp/images/1SLVEA2022001.pdf) that El Salvador remove Bitcoin as legal tender

- **February 2, 2022** - Cryptocurrency software provider [AlphaPoint](https://decrypt.co/91775/el-salvador-alphapoint-fix-chivo-bitcoin-wallet), is tasked to manage El Salvador's Chivo wallet. 

- **May 20, 2022** - El Salvador [plays host to the (AFI) Alliance for Financial Inclusion](https://www.theblock.co/post/147244/heres-why-central-bankers-are-talking-about-bitcoin-in-el-salvador-this-week), which included members from various Central Banks. 

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">And all the Central Bankers screamed…. <a href="https://t.co/MxdOrYD3lc">pic.twitter.com/MxdOrYD3lc</a></p>&mdash; Bitcoin Beach (@Bitcoinbeach) <a href="https://twitter.com/Bitcoinbeach/status/1527463438024208387?ref_src=twsrc%5Etfw">May 20, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

- **July 6, 2022** - The president of the Salvadorean Central Bank [reported that $52 million USD of remittances](https://cointelegraph.com/news/el-salvador-s-bitcoin-wallet-chivo-scores-52m-in-remittances-in-2022) has been coursed through the Chivo wallet from January to May. 

## Conclusion






[^1]: Dryja, T., & Poon, J. (2016, January 14). Lightningnetwork/paper: Lightning network paper. GitHub - Lightning Network. Retrieved September 1, 2022, from https://github.com/LightningNetwork/paper 

[^2]: Divakaruni, A., &amp; Zimmerman, P. (2022, June 21). The Lightning Network: Turning Bitcoin into Money. Retrieved September 3, 2022, from https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4142590 

[^3]: The State of Lightning Volume 2. Arcane Research. (2022, April 7). Retrieved September 7, 2022, from https://arcane.no/research/reports/the-state-of-lightning-volume-2 