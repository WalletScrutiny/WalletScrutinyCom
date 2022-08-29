---
title: Why we need "Layer Two" solutions
subtitle: How to get all the world and their fridges on a Bitcoin Standard
excerpt: 
authors:
- leo
date: 2022-08-28
---

We want all the world to use Bitcoin, yet Satoshi already remarked that it was
not suited for micro transactions in
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

What followed was a an intense fight over the block size limit but this fight
now [is history](https://blog.bitmex.com/the-blocksize-war-chapter-1-first-strike/)
and Bitcoin kept the 1MB limit in place.

1MB per block means 6MB per hour, 144MB per day and 51.8GB per year. How much
block space is that per human being on average? Divided by 8 billion ... that's
**6.5 byte per human per year**.

A typical transaction [weighs 212 bytes](https://bitcoinops.org/en/tools/calc-size/).

212 / 6.5 ... that's 33. Humans could do on average one transaction every 33
years.

If on the other hand we wanted to do an average of 5 transactions per person per
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

