Wallet Scrutiny
===============

This is the repository backing [WalletScrutiny.com](https://walletscrutiny.com/).

Pull Requests welcome.

## To run locally

1. Clone the repository
1. Make sure you have ruby-dev, bundler, and nodejs installed: `sudo apt install ruby-dev ruby-bundler nodejs`
1. Run `bundle clean` to clean up the directory (no need to run `--force`)
1. Run `bundle install` to install ruby dependencies. If you get errors, delete Gemfile.lock and try again.
1. Run `bundle exec jekyll serve --trace` to generate the HTML and serve it from `localhost:4000` the local server will automatically rebuild and refresh the pages on change.

## Run the wallet apk test script

1. Install Git, Docker and if you want to test Mycelium builds also Disorderfs.
   On Debian use `sudo apt update ; sudo apt install -y git docker.io disorderfs`
1. Configure Docker: `sudo groupadd docker; sudo usermod -aG docker $USER`
1. Clone this repository `git clone https://gitlab.com/walletscrutiny/walletScrutinyCom`
1. Go into the new folder `cd walletScrutinyCom`
1. Get an APK file (this will only work if the file is of one of the few verifiable apps)
1. Run the test script using an absolute path: `./test.sh /path/to/wallet.apk`
