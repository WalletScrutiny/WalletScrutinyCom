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

* Note: when executing `gem install bundler:2.1.1` on a debian/Ubuntu based system, you could
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

This is for you if you want to make changes. It starts a server that you can
reach at localhost:4000 and when you change a source file, it automatically
compiles the project and you should see the changes when refreshing the browser.

Each build takes around 7s.

```
npm run dev
```

or

```
bundle exec jekyll serve --profile --trace
```

If you're working on a single page or file that doesn't require Jekyll to build a lot of pages, you can use
`npm run dev-live`, so the browser will auto-reload the page after Jekyll has compiled it.

### For production deployment

This will also minify the css and js which takes all in all about 1 minute. The
result can be found in the `_site/` folder and uploaded to your web server.

```
npm run build
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
