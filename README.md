WalletScrutiny
===============

This is the repository backing [WalletScrutiny.com](https://walletscrutiny.com/).

Pull Requests are welcome.

## Nostr Events Specifications

We're using Nostr to decentralize the data of WalletScrutiny so this data can be used in other
applications. If you want to integrate this information into your own application, you can use
the following specifications: [Verifications](./docs/verifications.md).

## Installing Required Dependencies

1. Clone the repository: `git clone https://gitlab.com/walletscrutiny/walletScrutinyCom; cd walletScrutinyCom`
1. Install global dependencies: `apt update; apt install nodejs npm ruby-dev ruby-bundler -y`
1. Install more global dependencies: `npm i --global npm@latest`
1. Install npm stuff: `npm install; npm install` (twice because ... the error I
   got the first time is gone the second time)
1. Install bundler: `gem install bundler:2.1.4`
1. Install bundler stuff: `bundler install`

* Note: when executing `gem install bundler:2.1.4` on a Debian/Ubuntu based system, you could
encounter an error which sounds something like you need to execute it using `sudo`. This is 
not recommended. An alternative method is to configure RubyGems to install gems in your home 
directory and avoid using `sudo` for gem installations, follow these steps:

- Set the home path for gems in your `.bashrc` profile

```
$ nano ~/.bashrc
```

- Change the home and the path at the end of the file:

```
export GEM_HOME="$HOME/gems"
export PATH="$HOME/gems/bin:$PATH"
```

- Apply the changes with `$ source ~/.bashrc`

### For local development

```
npm run dev
```

This is for you if you want to make changes to WalletScrutiny.com application
(it's not needed to create a verification). It starts a server that you can
reach at localhost:4000 and when you change a source file, it automatically
compiles the project and you should see the changes when refreshing the browser.

### For production deployment

```
npm run build
```

This will also minify and brotlify css, js, and other file extensions. The
result can be found in the `_site/` folder, and you can upload the content
of this folder to your web server.


## Verifying the reproducibility of a wallet

Since the introduction of Nostr in WalletScrutiny, we added a new feature
so each user can verify the reproducibility of a wallet and share the result
with the community. A user can also register a new asset so that other users
can verify the reproducibility of the asset.

See more details at https://walletscrutiny.com/verifications/

## The WalletScrutiny Automated Build Server

The WABS is a service that runs on the build server and is responsible for launching automatic verifications when a new version of a wallet is released.

See more details at `external/build_server/README.md`.