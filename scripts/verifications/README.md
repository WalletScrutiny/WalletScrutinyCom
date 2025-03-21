# Verification Utils

## Requirements

- Node.js 12.0.0 or higher
- npm (Node Package Manager)

## Installation

Install dependencies:

```bash
npm install
```

## Nostr Events Backup

This simple Node.js script gets all the Nostr events related with the Verifications feature.

### Usage

```bash
node backupNostrVerificationEvents.mjs
```

You'll get one file for each event in `backup/nostr-verification-events/{event_kind}`, so Asset Registrations will be at `backup/nostr-verification-events/1063`, Verifications at `backup/nostr-verification-events/30301`, and so on.

## Blossom Files Lister

A simple Node.js script to list all files hosted on a Blossom server. This script connects to a Blossom server API and retrieves a list of all files stored on the server. It uses the API endpoint described in the [Nostrcheck Server documentation](https://github.com/quentintaranpino/nostrcheck-server/blob/main/DOCS.md#media-get-listing-files).

### Usage

#### Basic Version

Run the script with the server URL and optional port:

```bash
node list-blossom-files.js <server-url> [port]
```

##### Examples

```bash
# Connect to a Blossom server
node list-blossom-files.js http://localhost 3000
```

#### Authenticated Version

For servers that require authentication, use the authenticated version with your private key:

```bash
node list-blossom-files-auth.js <server-url> [port] [private-key]
```

##### Examples

```bash
# Connect to a Blossom server with authentication
node list-blossom-files-auth.js http://localhost 3000 nsec1...
```

The authenticated version uses NIP-98 HTTP Auth to sign requests with your private key.

## Output

The script will output information about all files found on the server, including:

- SHA256 hash
- File size
- Alt text (if available)
- Expiration date (if set)
- Content/caption
- Creation date
- URL to access the file

## Notes

- The script paginates through all available files, retrieving up to 100 files per request.
- The basic version doesn't implement authentication, so it may not work with servers that require it.
- The authenticated version requires a valid Nostr private key (nsec format) to sign requests.
- Be careful with your private keys and only use them with trusted servers.
