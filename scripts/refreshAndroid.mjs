#!/usr/bin/env node

/**
 * Android wallet refresh script
 * Updates version information for android wallet markdown files
 */

import refreshApps from '../refreshApps.mjs';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2), {
  boolean: ['help', 'n', 'dry-run'],
  string: ['a'],
  alias: {
    h: 'help',
    n: 'dry-run'
  }
});

function showUsage() {
  console.log(`
Usage: node scripts/refreshAndroid.mjs [options]

Options:
  -a, --app-ids <ids>        Android app IDs (comma separated list)
  -n, --dry-run              Show what would be updated without writing changes
  -h, --help                 Show this help message

Examples:
  node scripts/refreshAndroid.mjs -a app.zeusln.zeus,com.another.app
`);
}


async function main() {
  if (args.help) {
    showUsage();
    return;
  }

  await refreshApps.refresh(false, args.a, ['android'], args.n);
}

// Run the script
main().catch(error => {
  console.error(`Unexpected error: ${error.message}`);
  process.exit(1);
});
