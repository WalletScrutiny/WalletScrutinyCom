# Build Server App

This Node.js application connects to Nostr to fetch verification scripts from wallets that have "reproducible" status and downloads them locally for execution if a new version of the wallet is found.

## What does it do?

1. Connects to Nostr relays configured in WalletScrutiny
2. Gets all wallet and verification information
3. Filters verifications with "reproducible" status and excludes "windows" platform
4. For each Linux-compatible reproducible verification:
   - Extracts appId, version and platform
   - Gets verification attachment files
   - Downloads scripts ending in `.sh`
   - Saves them in `scripts/` folder with unique names

## Requirements
- Node.js >= 18.6.0
- asciinema
- GitHub token

## Usage

### Manual execution

```bash
cd external/build_server
npm i
node index.mjs <github_token>
```

The github token is required to refresh the desktop and hardware apps.
You can get a token from [GitHub](https://github.com/settings/tokens).

## Output

The application prints to console:

```
=== Build Server App - Fetching verification scripts ===
Starting process: 2024-01-15T10:00:00.000Z

Connecting to Nostr relays...
Successfully connected to Nostr

Getting wallet information from Nostr...
Information retrieved successfully

=== Reproducible Verifications ===
Total found: 629

bitcoinknots | v29.2.knots20251010 | linux | 1 script(s): verify_bitcoinknots.sh->bitcoinknots_v29.2.knots20251010_verify_bitcoinknots.sh
bitBox2 | 9.23.3 -multi | hardware | 1 script(s): verify_bitbox02.sh->bitBox2_9.23.3_-multi_verify_bitbox02.sh
keystone3.pro | 2.2.16-multicoin | hardware | 1 script(s): verify_keystone3.pro.sh->keystone3.pro_2.2.16-multicoin_verify_keystone3.pro.sh
app.zeusln.zeus | 0.11.5 | android | 1 script(s): verify_app.zeusln.zeus.sh->app.zeusln.zeus_0.11.5_verify_app.zeusln.zeus.sh
world.bitkey.app | 2025.19.0 (6) | android | Sin archivos adjuntos
bitcoincore | 30.0 | windows | 1 script(s): verify_bitcoincore.sh->bitcoincore_30.0_verify_bitcoincore.sh

=== Process completed ===   
Scripts guardados en: /ruta/a/scripts
```

### Output format

Each line contains all the information of a wallet in compact format:
- `AppId | Version | Platform | Script information`

Where the script information can be:
- `X script(s): originalName.sh->savedName.sh` (if there are .sh scripts)
- `No .sh scripts` (if there are files but none are .sh)
- `No attachments` (if there are no attachments)

## Generated files

The scripts are saved in `scripts/` with the format:
`{appId}_{version}_{originalName}.sh`

Example: `com.example.wallet_1.2.3_verify.sh`

## Technical notes

- The application connects to the same relays as WalletScrutiny.com
- The attachment files in Nostr use kind 1337 and are encoded in base64
- The application runs once and then terminates (designed for cron/systemd)
- **Platform filter**: Excludes automatically verifications for Windows for compatibility with Linux servers
