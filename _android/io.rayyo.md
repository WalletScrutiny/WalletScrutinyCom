---
wsId: rayyoWallet
title: RAYYO Wallet
altTitle: 
authors:
- danny
users: 50000
appId: io.rayyo
appCountry: 
released: 2025-10-03
updated: 2026-03-12
version: 0.7.50
reviews: 
website: https://rayyo.mx
repository: 
icon: io.rayyo.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2026-01-02
signer: 
twitter: RayyoApp
social:
- https://www.instagram.com/rayyoapp
- https://www.facebook.com/Rayyowallet
redirect_from: 
developerName: Montebit
builds: 
features: 

---

## App Description

RAYYO Wallet is an Android app focused on buying, selling, and withdrawing Bitcoin in Mexico, with features designed to optimize cash withdrawals via the operator’s CRYPTOBOX ATM network.

The app claims to support Bitcoin.

## Testing and Analysis

The app is geo-restricted hence we were not able to test it fully. We would have to get information from other sources. 

Some [clues](https://apps.apple.com/mx/app/montebit-rayyo/id6448856707) could be found in the iOS version of its app where version 0.7.23 mentions non-custodial wallet improvements and in 0.7.26 where it stated Lightning sending adjustments.

It is in [Section 4.1 of their Terms](https://rayyo.mx/terminos-y-condiciones) where we see that the provider provides 2 modes: 

> I.- MONEDERO (WALLET) NO CUSTODIADO: El USUARIO decide mantener la custodia de la clave privada para el acceso, movimiento y disposición de su BITCOIN, absorbiendo la responsabilidad total de sus depósitos, fondos y manejo de cuenta; por lo tanto, MONTEBIT no protege los fondos.
>
> En este caso, los movimientos se realizan bajo el protocolo normal ONCHAIN y pueden ser visibles en el nodo de MONTEBIT.
>
> II.- MONEDERO (WALLET) CUSTODIADO: En este supuesto, el USUARIO delega la custodia de su clave a MONTEBIT, quedando los fondos BITCOIN protegidos en el nodo particular de MONTEBIT, y el dinero fiduciario en cuenta manejada por la empresa “Sistema de Transferencias y Pagos STP, S.A. de C.V. Institución de Fondos de Pagos Electrónicos” (www.stp.mx) (STP). La seguridad de los fondos, la atención y el soporte técnico serán proporcionados por MONTEBIT.

Translated using Google Translate:

> I.- NON-CUSTODIED WALLET: The USER decides to maintain custody of the private key for the access, movement and disposition of their BITCOIN, absorbing total responsibility for their deposits, funds and account management; therefore, MONTEBIT does not protect the funds.
>
> In this case, the movements are made under the normal ONCHAIN ​​protocol and can be visible on the MONTEBIT node.
>
> II.- CUSTODED WALLET: In this case, the USER delegates the custody of his key to MONTEBIT, leaving the BITCOIN funds protected in the particular node of MONTEBIT, and the fiduciary money in an account managed by the company “Sistema de Transferencias y Pagos STP, S.A. de C.V. Institución de Fondos de Pagos Electrónico” (www.stp.mx) (STP). The security of funds, attention and technical support will be provided by MONTEBIT.

Assuming that the non-custodial side of the app does provide the private keys to the user, we would have to stop the analysis with the fact that the app is **not source-available**.

This is bolstered by this statement in Section 11.5 of their [Terms](https://rayyo.mx/terminos-y-condiciones):

> 11.5.- RESPETO A LA PROPIEDAD INTELECTUAL.- Todo el contenido de la RAYYO APP, incluyendo, pero no limitado, al diseño de sus pantallas, materiales promocionales, las marcas, nombres comerciales, signos distintivos, textos, gráficos, logos, imágenes, íconos, botones, videos, sonidos, música, bases de datos, código fuente, software y combinaciones de colores (“Contenido”), es de titularidad de MONTEBIT o de sus licenciantes. El Contenido no podrá ser reproducido, modificado, transformado, editado, traducido, cedido, distribuido, representado, comercializado, comunicado públicamente, almacenado, usado para fines distintos de los previstos en estos Términos y Condiciones de Uso, ni ser objeto de obras derivadas, sin autorización previa y por escrito del titular de los derechos.

Translated using Google Translate:

> 11.5.- RESPECT FOR INTELLECTUAL PROPERTY.- All content of the RAYYO APP, including, but not limited to, the design of its screens, promotional materials, brands, trade names, distinctive signs, texts, graphics, logos, images, icons, buttons, videos, sounds, music, databases, source code, software and color combinations (“Content”), is the property of MONTEBIT or its licensors. The Content may not be reproduced, modified, transformed, edited, translated, transferred, distributed, represented, marketed, publicly communicated, stored, used for purposes other than those provided for in these Terms and Conditions of Use, nor be the subject of derivative works, without prior written authorization from the rights holder.

This is a clear indication that this app is **not sourceavailable**.