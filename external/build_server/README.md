# Build Server App

This Node.js application connects to Nostr to fetch verification scripts from wallets that have "reproducible" status and downloads them locally for execution if a new version of the wallet is found.

## What does it do?

1. Connects to the same relays as the main WalletScrutiny.com application
2. Gets all wallet and verification information
3. Filters verifications with "reproducible" status and excludes "windows" platform
4. For each reproducible verification:
   - Extracts appId, version and platform
   - Gets verification attachment files
   - Downloads scripts ending in `.sh`

## Requirements
- Node.js >= 18.6.0
- asciinema
- GitHub token (to refresh the desktop and hardware apps)
- Nostr private key from the `WalletScrutiny Bot` account

## Usage

### Manual execution for development or debug

```bash
cd external/build_server
npm install
node index.mjs --githubToken <github_token> --wsBotNostrPrivateKey  <nostr_private_key>
```

## Install and run as a systemd service

### Server preparation

- Create a new user for the application:
```bash
sudo adduser build-server
```

- Create the group for the application:
```bash
sudo addgroup build-server
```

- Create a new directory for the application:
```bash
sudo mkdir -p /opt/build-server/walletScrutinyCom
```

### Install the application
- Copy the application to the server:
```bash
sudo cp -r walletScrutinyCom /opt/build-server/walletScrutinyCom
```

### Install the dependencies
```bash
sudo apt install asciinema docker.io podman nodejs npm -y
```

Note: if the version of nodejs is not greater than or equal to 18.6.0, you can use `nodesource` distribution to install a newer version with `curl -fsSL https://deb.nodesource.com/setup_20.x | bash -` and then `sudo apt install -y nodejs` or install it globally: `bash -c "sudo npm install --global npm@latest"`

- Install npm modules:
```bash
cd /opt/build-server/walletScrutinyCom/external/build_server
sudo npm install
```

### Install the service

```bash
sudo cp external/build_server/config/build-server.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable build-server.service
sudo systemctl start build-server.service
```

## Build Server admin

### Start/stop the WS Build Server service

```bash
service walletscrutiny-build-server start
service walletscrutiny-build-server stop
```

### Check the service status

```bash
sudo systemctl status walletscrutiny-build-server.service
```

### Check the service logs

```bash
sudo journalctl -u walletscrutiny-build-server.service -f
```

## Technical notes

- The application connects to the same relays as WalletScrutiny.com and publishes the results to Nostr as `WalletScrutiny Bot`
- The application keeps running forever and loops so it runs once every 24 hours
- **Platform filter**: Excludes automatically verifications for Windows for compatibility with Linux servers
