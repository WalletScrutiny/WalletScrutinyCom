---
wsId: biscoint
title: Bitybank | Biscoint
altTitle: 
authors:
- danny 
users: 50000
appId: io.biscoint.lite
appCountry: 
released: Apr 5, 2022
updated: 2023-03-22
version: 2.2.2
stars: 5
ratings: 
reviews: 
size: 
website: https://www.bity.com.br/policies/
repository: 
issue: 
icon: io.biscoint.lite.png
bugbounty: 
meta: ok
verdict: nosendreceive
date: 2023-03-02
signer: 
reviewArchive: 
twitter: BityOficial
social:
- https://www.facebook.com/bitybankoficial 
redirect_from: 
features: 

---

## Updated Review 2023-04-05

There were some concerns raised about the similarity in name of 2 Android apps and 2 iOS apps: 

Notably: 

{% include walletLink.html wallet='android/com.bitpreco.bitprecoAppAndroid' verdict='true' %}
{% include walletLink.html wallet='iphone/com.bitpreco.bitprecoApp' verdict='true' %}

and 

{% include walletLink.html wallet='android/io.biscoint.lite/' verdict='true' %}
{% include walletLink.html wallet='iphone/io.biscoint.lite/' verdict='true' %}

The two pairs are considered as seperate products from the same unifying entity, bity.com.br. 

As we can see from the homepage of [bity.com.br](https://www.bity.com.br/): 

> ###  About the Bitybank
>
> Bitypreco and Biscoint have become one.
>
> We reinvent Banco Digital for you to use your crypts on a daily basis and gain cashback in bitcoins.

## Updated Review 2023-03-23 

They replied: 

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">...users can convert their crypto into fiat and withdraw to their bank accounts. Important: users who make level-2 register (KYC, documents and stuff) are allowed to move their crypto to any crypto wallet they want. Thank you for reaching out!</p>&mdash; Biscoint Oficial (@biscoint) <a href="https://twitter.com/biscoint/status/1636339629686239232?ref_src=twsrc%5Etfw">March 16, 2023</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## App Description 

[Terms of Use](https://www.bity.com.br/terms/)

> 4.3. Nesta modalidade não são permitidos depósitos, transferências e/ou saques das CRIPTOMOEDAS da CARTEIRA VIRTUAL do USUÁRIO vinculada ao BISCOINT para uma CARTEIRA VIRTUAL (ou wallet) não vinculada ao BISCOINT, de modo que os depósitos, transferências e/ou saques somente serão permitidos e efetuados em moeda corrente nacional (reais) para a conta de titularidade do USUÁRIO cadastrado, sendo, portanto, obrigatória a venda das CRIPTOMOEDAs para a efetivação do resgate em reais, salvo se houver o envio de documentação completa nos moldes da cláusula 4.1.2 e desde que aprovada pela empresa.

Translated:

> 4.3. In this modality, deposits, transfers and / or withdrawals from the USER's VIRTUAL PORTFOLIO CRYPTOMOEDAS are not permitted for a VIRTUAL PORTFOLIO ( or wallet ) not linked to BISCOINT, so that deposits, transfers and / or withdrawals will only be allowed and made in national currency ( real ) for the registered USER's ownership account, being, therefore, the sale of CRIPTOMOEDAs is mandatory for the realization of the redemption in reais, unless complete documentation is sent in accordance with clause 4.1.2 and provided it is approved by the company.

### General Operation

> 5.1. Através dos SERVIÇOS providos pelo SITE, o Biscoint oferece uma plataforma para compra e venda de CRIPTOMOEDAS pelo USUÁRIO, transações estas efetuadas pelos próprios USUÁRIOS, possibilitando que os mesmos negociem entre si diretamente, sem que o Biscoint participe do contato, negociação ou efetivação destas negociações, caracterizando o Biscoint apenas como intermediadora das negociações.
>
> 5.2. Após conclusão do cadastro pelo USUÁRIO, é criada uma CARTEIRA VIRTUAL para este, que poderá ser acessada, consultada e transacionada através do uso de sua senha e login.
>
> 5.2.1. A CARTEIRA VIRTUAL do USUÁRIO é a conta criada automaticamente para o USUÁRIO, após a validação de seu cadastro. A CARTEIRA VIRTUAL representa, de forma ilustrativa, o dinheiro custodiado na CONTA ARRECADADORA e que pode ser (i) retirado pelo USUÁRIO para transferência para uma conta bancária de sua titularidade; (ii) armazenado; (iii) colocado à venda através de ORDEM DE VENDA de CRIPTOMOEDAS.

Translated:

> General Operation
>
> 5.1. Through the SERVICES provided by the SITE, Biscoint offers a platform for the purchase and sale of CRYPTOMOEDAS by the USER, transactions carried out by the USERS themselves, allowing them to negotiate directly with each other, without Biscoint participating in the contact, negotiation or effectiveness of these negotiations, characterizing Biscoint only as an intermediary of the negotiations.
>
> 5.2. After completing the registration by the USER, a VIRTUAL PORTFOLIO is created for the latter, which can be accessed, consulted and transacted through the use of your password and login.
>
> 5.2.1. The VIRTUAL WALLET OF THE USER is the account created automatically for the USER, after the validation of his registration. The VIRTUAL PORTFOLIO represents, in an illustrative way, the money paid in the SURROUNDING ACCOUNT and which can be ( i ) withdrawn by the USER for transfer to a bank account owned by it; ( ii ) stored; ( iii ) offered for sale through CRYPTOMOEDAS SALE ORDER.

## Analysis 

We were able to register and download the app with the following screenshots posted on twitter: 

- [Main Dashboard](https://twitter.com/BitcoinWalletz/status/1631214515697389570)
- [BTC address generated](https://twitter.com/BitcoinWalletz/status/1631214518578864128)
- [Verification requirement prior to withdrawal](https://twitter.com/BitcoinWalletz/status/1631214512631320579)

What we understand so far: 

1. A Bitcoin wallet is provided within the account.
2. The primary purpose of which is to allow the user to buy and sell Bitcoin through the platform.
3. Withdrawal of crypto is permitted but only after KYC - possibly with the exception that the user passes KYC. Otherwise, withdrawal can only be in fiat.

> 4.3 "...deposits, transfers and / or withdrawals will only be allowed and made in national currency ( real ) for the registered USER's ownership account, being, therefore, the sale of CRIPTOMOEDAs is mandatory for the realization of the redemption in reais, unless complete documentation is sent in accordance with clause 4.1.2 and provided it is approved by the company..."

The presence of a BTC wallet with an auto-generated QR code within a platform makes us believe that this is a **custodial** service with high-level of control over the funds of the users. However, section 4.3 complicates things for us as it indicates that the provider will only allow deposits, transfers and / or withdrawals in the Brazilian national currency - except complete documentation is sent. 

If the translation is accurate, then this means without KYC, the platform disallows sending and receiving bitcoins. After KYC, the platform may possibly allow it. 

We went on [twitter to clarify the matter](https://twitter.com/BitcoinWalletz/status/1631216074879545344). 

Tentatively, we will label this service as a platform that **does not allow sending and receiving of Bitcoins**.





