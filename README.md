WalletScrutiny
===============

This is the repository backing [WalletScrutiny.com](https://walletscrutiny.com/).

Pull Requests welcome.

## To run locally

1. Clone the repository: `git clone https://gitlab.com/walletscrutiny/walletScrutinyCom; cd walletScrutinyCom`
1. Install global dependencies: `apt update; apt install nodejs npm ruby-dev ruby-bundler -y`
1. Install more global dependencies: `npm i --global npm@latest`
1. Install npm stuff: `npm install; npm install` (twice because ... the error I
   got the first time is gone the second time)
1. Install bundler: `gem install bundler:2.1.4`
1. Install bundler stuff: `bundler install`

### For local development

This is for you if you want to make changes. It starts a server that you can
reach at localhost:4000 and when you change a source file, it automatically
compiles the project and you should see the changes when refreshing the browser.

Each build takes around 7s.

```
npx gulp serve
```

or

```
bundle exec jekyll serve --profile --trace
```

### For production deployment

This will also minify the html, css and js which takes all in all about 50s. The
result can be found in the `_site/` folder and uploaded to your web server.

```
npx gulp
```

## Run the wallet apk test script

1. Install Git, Docker and if you want to test Mycelium builds also Disorderfs.
   On Debian use `sudo apt update ; sudo apt install -y git docker.io disorderfs`
1. Configure Docker: `sudo groupadd docker; sudo usermod -aG docker $USER`
1. Clone this repository `git clone https://gitlab.com/walletscrutiny/walletScrutinyCom`
1. Go into the new folder `cd walletScrutinyCom`
1. Get an APK file (this will only work if the file is of one of the few
   reproducible apps)
1. Run the test script using an absolute path: `./test.sh /path/to/wallet.apk`
