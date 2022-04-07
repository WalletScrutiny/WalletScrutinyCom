## What About Android KeyStore Provider, TEE, Apple Secure Enclave, ...?

General computing devices like mobile phones have a huge
[attack surface](https://en.wikipedia.org/wiki/Attack_surface).

While the operating system promises to separate one app from the other, users
today have hundreds of apps installed, each of which might exploit a weakness.
And weaknesses do happen.

To improve the security, vendors offer varying systems to secure sensitive data.

The simplest approach is to have a special file encrypted by the
operating system with a key supposedly unknown to anybody, with special logic
that requires the user to enter his credentials to access that file.
That key might be in a so called "secure element" (**"SE"**) that requires the
user's pin to surrender the key but whoever gains administrative access to the
operating system can wait for the user to enter the pin and once the "SE"
produces the key, keep a copy of it. Most notably, the app that stores some
secret in that file can also abuse the data once it gains access. In other
words, if the wallet provider uses this type of "KeyStore" for the wallet's
master seed, the seed might be protected against extraction from somebody who
obtains a copy of the main storage or some other app that gains such access to
leak data online but it does not protect against a privileged user or the wallet
app itself.

The most common approach is to have the app's secret itself in the "secure
element" which again allows a compromised app or OS to copy secrets once the
user makes use of them. Here, the app could store 20 secrets for 20 wallet
accounts in addition to storing the master secret - the "12 words" - in the
"SE" and by that reduce the damage of secrets being copied in transit
but if the app is compromised, it can always show the user "enter pin to pay for
coffee" and in fact ask for the master secret from the "SE". Now,
the app could empty the wallet or just pay the coffee and leak the master secret
to some server to empty all users' wallets at once later.

The next step is to not ever share the secret in the "SE" with the app but to
sign transactions within the "SE" instead. *Not all "SE" support this*. But
again, this
does not protect against a malicious app. The app can again ask to enter the pin
for a coffee but send over a transaction emptying the wallet to the "SE". While
the app now could empty this user's wallet, **this situation is better than all
the prior situations**! The evil app cannot simply leak what it obtained to some
server for later use as paying the coffee will invalidate that other big,
emptying transaction as both spend the same funds. The app provider could though
present the user with some variant of "Failed to send transaction. Please try
again!" a few times to accumulate secondary account "emptying" transactions for
later rug-pulling.

The most advanced approach is to run in a
"[Trusted Execution Environment (TEE)](https://en.wikipedia.org/wiki/Trusted_execution_environment)",
a secondary (actually
[tertiary](https://en.wikipedia.org/wiki/Baseband_processor)) operating system
or firmware. In the most extreme case, this has its own screen like in the
{% include walletLink.html wallet='hardware/finney' verdict='true' %} but may
also work through some indicator light that shows which OS currently controls
screen output and touch input or not indicate being active at all. Such a TEE ensures
that no other apps can run in the background, that not all the features of the
main OS gain access to its resources and by being able to control input and
output it allows to interact with the user for example in the creation of a
Bitcoin transaction.

Those TEEs though are highly proprietary and access to them is not open to
"random wallet developers". For example here is
[android.com on their TEE](https://source.android.com/security/trusty/#third-party_trusty_applications)'s
availability for third-party apps:

> **Third-party Trusty applications**<br>
  Currently all Trusty applications are developed by a single party and packaged
  with the Trusty kernel image. The entire image is signed and verified by the
  bootloader during boot. Third-party application development is not supported
  in Trusty at this time.

In addition to this, not all Android phones possess the hardware required to
provide a "Trusty" TEE, so for the time being, a TEE supporting Bitcoin wallet
is something for wallets that come pre-installed on the device but not for any
other wallets.
