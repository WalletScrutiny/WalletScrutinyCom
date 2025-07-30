#!/usr/bin/env node

import NDK from "@nostr-dev-kit/ndk";
import fs from "fs";
import path from "path";
import WebSocket from "ws";
import readline from "readline";
import crypto from "crypto";
import { spawn } from "child_process";
import { assetRegistrationKind, verificationKind, verificationDraftKind, verificationCommentKind, codeSnippetKind, endorsementKind, opinionKind, explicitRelayUrls } from "../../src/nostr-constants.mjs";
import { getFirstTagValue } from "../../src/verifications_common.mjs";
global.WebSocket = WebSocket; // Make WebSocket available globally as NDK expects it

const connectTimeout = 2000;

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m'
};

// Generate unique subscription ID
function generateSubscriptionId() {
  return crypto.randomBytes(8).toString('hex');
}

// Websocat-based query functions
// This runs the equivalent of: echo '["REQ","",{"kinds":[30023],"#t":["nostrOpinion"]}]' | websocat wss://relay.nostr.band
async function queryRelayWithWebsocat(relayUrl, queryObject, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const subscriptionId = "walletscrutiny"; // Arbitrary subscription ID (some relays require minimum length)
    const reqMessage = JSON.stringify(["REQ", subscriptionId, queryObject]);
    const closeMessage = JSON.stringify(["CLOSE", subscriptionId]);
    
    console.log(`${colors.cyan}🔗 Querying ${relayUrl}...${colors.reset}`);
    console.log(`${colors.gray}  📝 Debug: Sending command equivalent to:${colors.reset}`);
    console.log(`${colors.gray}     echo '${reqMessage}' | websocat ${relayUrl}${colors.reset}`);
    
    // Use websocat to query the relay
    const websocat = spawn('websocat', [relayUrl], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    const events = [];
    let buffer = '';
    let timeoutId;
    
    const cleanup = () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (!websocat.killed) {
        websocat.kill();
      }
    };
    
    timeoutId = setTimeout(() => {
      console.log(`${colors.yellow}  ⏰ Timeout for ${relayUrl}${colors.reset}`);
      cleanup();
      resolve(events);
    }, timeout);
    
    // Send REQ message
    websocat.stdin.write(reqMessage + '\n');
    
    websocat.stdout.on('data', (data) => {
      buffer += data.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop(); // Keep incomplete line in buffer
      
      for (const line of lines) {
        if (!line.trim()) continue;
        
        try {
          const message = JSON.parse(line);
          const [messageType, subId, event] = message;
          
          if (messageType === 'EVENT' && subId === subscriptionId && event) {
            // Convert to consistent format with rawEvent method
            const formattedEvent = {
              id: event.id,
              pubkey: event.pubkey,
              created_at: event.created_at,
              kind: event.kind,
              tags: event.tags || [],
              content: event.content,
              sig: event.sig,
              rawEvent: () => event,
              _relaySource: relayUrl
            };
            events.push(formattedEvent);
          } else if (messageType === 'EOSE' && subId === subscriptionId) {
            // End of stored events - close and finish
            websocat.stdin.write(closeMessage + '\n');
            setTimeout(() => {
              cleanup();
              resolve(events);
            }, 100);
            return;
          } else if (messageType === 'NOTICE') {
            console.log(`${colors.yellow}  ⚠️  Notice from ${relayUrl}: ${event || subId}${colors.reset}`);
          }
        } catch (error) {
          // Ignore parse errors silently
        }
      }
    });
    
    websocat.stderr.on('data', (data) => {
      console.log(`${colors.yellow}  ⚠️  ${relayUrl}: ${data.toString().trim()}${colors.reset}`);
    });
    
    websocat.on('close', (code) => {
      cleanup();
      resolve(events);
    });
    
    websocat.on('error', (error) => {
      console.log(`${colors.red}  ❌ Process error for ${relayUrl}: ${error.message}${colors.reset}`);
      cleanup();
      resolve([]);
    });
  });
}

async function fetchEventsFromAllRelays(filter) {
  const allEvents = new Map(); // Use Map to deduplicate by event ID
  
  for (const relayUrl of explicitRelayUrls) {
    try {
      const events = await queryRelayWithWebsocat(relayUrl, filter);
      
      console.log(`${colors.green}✅ Found ${events.length} events from ${relayUrl}${colors.reset}`);
      
      // Add events to map (deduplicates automatically)
      events.forEach(event => {
        if (event.id) {
          allEvents.set(event.id, event);
        }
      });
    } catch (error) {
      console.log(`${colors.red}❌ Failed to query ${relayUrl}: ${error.message}${colors.reset}`);
    }
  }
  
  return Array.from(allEvents.values());
}

// Check if websocat is available
async function checkWebsocatAvailability() {
  return new Promise((resolve) => {
    const testProcess = spawn('websocat', ['--version'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    testProcess.on('close', (code) => {
      resolve(code === 0);
    });
    
    testProcess.on('error', () => {
      resolve(false);
    });
  });
}

class NostrBackupManager {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    // Enable raw mode for arrow key detection
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
  }

  clearScreen() {
    process.stdout.write('\x1b[2J\x1b[0f'); // Clear screen and move cursor to top
  }

  showHeader() {
    console.log(`${colors.bright}${colors.blue}
╔════════════════════════════════════════════════════════════════╗
║                    📡 Nostr Backup Manager                     ║
║                     WalletScrutiny.com Events                  ║
╚════════════════════════════════════════════════════════════════╝${colors.reset}\n`);
  }

  async showMainMenu() {
    const options = [
      '🔍 Nostr Verifications',
      '💬 Nostr Opinions'
    ];

    this.clearScreen();
    this.showHeader();
    
    console.log(`${colors.bright}📋 Select Event Type:${colors.reset}\n`);
    
    const choice = await this.showMenu('Main Menu', options);
    
    switch(choice) {
      case 0: await this.showVerificationsMenu(); break;
      case 1: await this.showOpinionsMenu(); break;
    }
  }

  async showVerificationsMenu() {
    const options = [
      'Option A - Backup Verification Events',
      '🔙 Back to Main Menu'
    ];

    this.clearScreen();
    this.showHeader();
    
    console.log(`${colors.bright}🔍 Nostr Verifications Menu:${colors.reset}\n`);
    
    const choice = await this.showMenu('Verifications Menu', options);
    
    switch(choice) {
      case 0: await this.backupVerificationEvents(); break;
      case 1: await this.showMainMenu(); break;
    }
  }

  async showOpinionsMenu() {
    const options = [
      'Option A - Backup Opinion Events',
      '🔙 Back to Main Menu'
    ];

    this.clearScreen();
    this.showHeader();
    
    console.log(`${colors.bright}💬 Nostr Opinions Menu:${colors.reset}\n`);
    
    const choice = await this.showMenu('Opinions Menu', options);
    
    switch(choice) {
      case 0: await this.backupOpinionEvents(); break;
      case 1: await this.showMainMenu(); break;
    }
  }

  async showMenu(title, options) {
    return new Promise((resolve) => {
      let selectedIndex = 0;
      let firstRender = true;
      
      const renderMenu = () => {
        if (!firstRender) {
          // Clear the menu area by moving cursor up and clearing lines
          process.stdout.write(`\x1b[${options.length + 4}A`); // Move up
          process.stdout.write('\x1b[0J'); // Clear from cursor to end of screen
        }
        firstRender = false;
        
        console.log(`${colors.bright}${title}:${colors.reset}`);
        console.log('─'.repeat(title.length + 1));
        
        options.forEach((option, index) => {
          if (index === selectedIndex) {
            console.log(`${colors.bright}${colors.blue}► ${option}${colors.reset}`);
          } else {
            console.log(`  ${option}`);
          }
        });
        
        console.log(`\n${colors.gray}Use ↑↓ arrows to navigate, Enter to select, Ctrl+C to exit${colors.reset}`);
      };

      renderMenu();

      const keyHandler = (key) => {
        if (key === '\u0003') { // Ctrl+C
          this.exit();
        } else if (key === '\r') { // Enter
          process.stdin.removeListener('data', keyHandler);
          console.log(); // Add newline after selection
          resolve(selectedIndex);
        } else if (key === '\u001b[A') { // Up arrow
          selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : options.length - 1;
          renderMenu();
        } else if (key === '\u001b[B') { // Down arrow
          selectedIndex = selectedIndex < options.length - 1 ? selectedIndex + 1 : 0;
          renderMenu();
        }
      };

      process.stdin.on('data', keyHandler);
    });
  }

  async backupVerificationEvents() {
    this.clearScreen();
    this.showHeader();
    
    console.log(`${colors.bright}🔍 Backing up Verification Events${colors.reset}`);
    console.log('═'.repeat(40));
    console.log();

    // Prompt user for time range
    console.log(`${colors.cyan}📅 Time Range Selection:${colors.reset}`);
    console.log(`${colors.white}Enter number of months to backup (default is 2)${colors.reset}`);
    console.log(`${colors.white}Or enter 'a' for all events (no time limit)${colors.reset}`);
    console.log();
    
    const timeInput = await this.prompt(`${colors.yellow}Months to backup [2]: ${colors.reset}`);
    console.log();
    
    let since = null;
    let timeDescription = "";
    
    if (timeInput.toLowerCase().trim() === 'a' || timeInput.toLowerCase().trim() === 'all') {
      since = null;
      timeDescription = "all events (no time limit)";
    } else {
      const months = timeInput.trim() === '' ? 2 : parseInt(timeInput);
      if (isNaN(months) || months <= 0) {
        console.log(`${colors.red}❌ Invalid input. Using default of 2 months.${colors.reset}`);
        since = this.getTimestampMonthsAgo(2);
        timeDescription = "2 months";
      } else {
        since = this.getTimestampMonthsAgo(months);
        timeDescription = `${months} month${months === 1 ? '' : 's'}`;
      }
    }
    
    console.log(`${colors.bright}📊 Backup scope: ${timeDescription}${colors.reset}`);
    console.log();

    try {
      const nostrKindsToBackup = [assetRegistrationKind, verificationKind, verificationDraftKind, verificationCommentKind, codeSnippetKind, endorsementKind];
      
      const ndk = new NDK({
        explicitRelayUrls: explicitRelayUrls,
      });

      console.log(`${colors.cyan}🔗 Connecting to relays...${colors.reset}`);
      await ndk.connect(connectTimeout);
      await new Promise(resolve => setTimeout(resolve, 3000));

      if (since !== null) {
        console.log(`${colors.cyan}📅 Fetching events since ${new Date(since * 1000).toISOString()}...${colors.reset}`);
      } else {
        console.log(`${colors.cyan}📅 Fetching all events (no time limit)...${colors.reset}`);
      }
      
      const fetchOptions = {
        kinds: nostrKindsToBackup
      };
      
      if (since !== null) {
        fetchOptions.since = since;
      }
      
      const events = await ndk.fetchEvents(fetchOptions);

      console.log(`${colors.cyan}📁 Creating output directories...${colors.reset}`);
      const baseDir = path.join(process.cwd(), "backup", "nostr-verification-events");
      
      // Create backup directory if it doesn't exist
      const backupDir = path.join(process.cwd(), "backup");
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      for (const kind of nostrKindsToBackup) {
        const kindDir = path.join(baseDir, kind.toString());
        if (!fs.existsSync(kindDir)) {
          fs.mkdirSync(kindDir, { recursive: true });
        }
      }

      console.log(`${colors.cyan}💾 Saving events to files...${colors.reset}`);
      let saved = 0;
      let skipped = 0;
      
      for (const event of events) {
        const clientTag = getFirstTagValue(event, 'client');
        if (!clientTag || clientTag !== 'WalletScrutiny.com') {
          skipped++;
          continue;
        }
        
        const eventId = event.id;
        const kind = event.kind;
        const filePath = path.join(baseDir, kind.toString(), `${eventId}.json`);
        
        if (fs.existsSync(filePath)) {
          skipped++;
          continue;
        }
        
        fs.writeFileSync(filePath, JSON.stringify(event.rawEvent(), null, 2));
        console.log(`${colors.green}✅ Saved event ${eventId} (kind ${kind})${colors.reset}`);
        saved++;
      }

      console.log();
      console.log(`${colors.bright}${colors.green}🎉 Verification Backup Complete!${colors.reset}`);
      console.log(`${colors.green}📈 Saved ${saved} new events${colors.reset}`);
      console.log(`${colors.yellow}⏭️  Skipped ${skipped} already existing or non-WalletScrutiny events${colors.reset}`);
      console.log();

    } catch (error) {
      console.log(`${colors.red}❌ Error during backup: ${error.message}${colors.reset}`);
      console.log();
    }

    await this.prompt('Press Enter to continue...');
    await this.showVerificationsMenu();
  }

  async backupOpinionEvents() {
    this.clearScreen();
    this.showHeader();
    
    console.log(`${colors.bright}💬 Backing up Opinion Events${colors.reset}`);
    console.log('═'.repeat(35));
    console.log();

    // Check if websocat is available
    if (!await checkWebsocatAvailability()) {
      console.log(`${colors.red}❌ websocat is not installed or not in PATH${colors.reset}`);
      console.log(`${colors.yellow}📦 Opinion backup requires websocat. Please install it:${colors.reset}`);
      console.log(`${colors.white}   • Ubuntu/Debian: sudo apt install websocat${colors.reset}`);
      console.log(`${colors.white}   • macOS: brew install websocat${colors.reset}`);
      console.log(`${colors.white}   • Cargo: cargo install websocat${colors.reset}`);
      console.log(`${colors.white}   • Or download from: https://github.com/vi/websocat/releases${colors.reset}`);
      console.log();
      await this.prompt('Press Enter to return to menu...');
      await this.showOpinionsMenu();
      return;
    }

    // Query for all nostrOpinion events, then filter for WalletScrutiny-related ones
    const queryObject = {
      kinds: [opinionKind],
      "#t": ["nostrOpinion"]
    };

    console.log(`${colors.cyan}🔍 Querying all relays for opinion events...${colors.reset}`);
    
    const allEvents = [];
    for (const relayUrl of explicitRelayUrls) {
      try {
        const events = await queryRelayWithWebsocat(relayUrl, queryObject);
        console.log(`${colors.green}  ✅ ${relayUrl}: ${events.length} events${colors.reset}`);
        allEvents.push(...events);
      } catch (error) {
        console.log(`${colors.red}  ❌ ${relayUrl}: ${error.message}${colors.reset}`);
      }
    }

    console.log(`${colors.gray}📊 Raw events collected: ${allEvents.length}${colors.reset}`);

    // Remove duplicates by event ID
    const uniqueEvents = [];
    const seenIds = new Set();
    for (const event of allEvents) {
      if (!seenIds.has(event.id)) {
        seenIds.add(event.id);
        uniqueEvents.push(event);
      }
    }

    console.log(`${colors.gray}📊 After deduplication: ${uniqueEvents.length}${colors.reset}`);

    // Filter for WalletScrutiny-related events: must have "nostrOpinion" AND ("WalletScrutiny" OR "WalletScrutiny.com")
    const walletScrutinyEvents = uniqueEvents.filter(event => {
      const tags = event.tags || [];
      const hasNostrOpinion = tags.some(tag => tag[0] === 't' && tag[1] === 'nostrOpinion');
      const hasWalletScrutiny = tags.some(tag => tag[0] === 't' && (tag[1] === 'WalletScrutiny' || tag[1] === 'WalletScrutiny.com'));
      return hasNostrOpinion && hasWalletScrutiny;
    });

    console.log(`${colors.bright}📦 Total unique events found: ${uniqueEvents.length}${colors.reset}`);
    console.log(`${colors.bright}🎯 WalletScrutiny-related events: ${walletScrutinyEvents.length}${colors.reset}`);
    console.log();

    if (walletScrutinyEvents.length === 0) {
      console.log(`${colors.yellow}⚠️  No opinion events found in the specified time range.${colors.reset}`);
      await this.prompt('Press Enter to return to menu...');
      await this.showOpinionsMenu();
      return;
    }

    console.log(`${colors.cyan}📁 Creating output directories...${colors.reset}`);
    const baseDir = path.join(process.cwd(), "backup", "nostr-opinion-events");
    
    // Create backup directory if it doesn't exist
    const backupDir = path.join(process.cwd(), "backup");
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    const kindDir = path.join(baseDir, opinionKind.toString());
    if (!fs.existsSync(kindDir)) {
      fs.mkdirSync(kindDir, { recursive: true });
    }

    console.log(`${colors.cyan}💾 Saving events to files...${colors.reset}`);
    let saved = 0;
    let skipped = 0;
    
    try {
      for (const event of walletScrutinyEvents) {
        // Events are already filtered for required tags
        const tags = event.tags || [];
        
        const eventId = event.id;
        const kind = event.kind;
        const filePath = path.join(baseDir, kind.toString(), `${eventId}.json`);
        
        if (fs.existsSync(filePath)) {
          skipped++;
          continue;
        }
        
        fs.writeFileSync(filePath, JSON.stringify(event, null, 2));
        
        // Show wallet subject if available
        const dTag = tags.find(tag => tag[0] === 'd')?.[1];
        const walletInfo = dTag ? ` (${dTag})` : '';
        console.log(`${colors.green}✅ Saved opinion event ${eventId}${walletInfo}${colors.reset}`);
        saved++;
      }

      console.log();
      console.log(`${colors.bright}${colors.green}🎉 Opinion Backup Complete!${colors.reset}`);
      console.log(`${colors.green}📈 Saved ${saved} new events${colors.reset}`);
      console.log(`${colors.yellow}⏭️  Skipped ${skipped} already existing or invalid events${colors.reset}`);
      console.log();

    } catch (error) {
      console.log(`${colors.red}❌ Error during backup: ${error.message}${colors.reset}`);
      console.log();
    }

    await this.prompt('Press Enter to continue...');
    await this.showOpinionsMenu();
  }

  getTimestampMonthsAgo(months = 2) {
    const date = new Date();
    date.setMonth(date.getMonth() - months);
    return Math.floor(date.getTime() / 1000); // Convert to Unix timestamp (seconds)
  }

  async prompt(question) {
    return new Promise((resolve) => {
      // Temporarily disable raw mode for text input
      process.stdin.setRawMode(false);
      
      this.rl.question(question, (answer) => {
        // Re-enable raw mode
        process.stdin.setRawMode(true);
        resolve(answer);
      });
    });
  }

  exit() {
    this.clearScreen();
    console.log(`\n${colors.cyan}👋 Thank you for using Nostr Backup Manager!${colors.reset}`);
    this.rl.close();
    process.stdin.setRawMode(false);
    process.stdin.resume();
    process.exit(0);
  }
}

// Main execution
async function main() {
  const manager = new NostrBackupManager();
  
  // Handle process termination gracefully
  process.on('SIGINT', () => manager.exit());
  process.on('SIGTERM', () => manager.exit());
  
  try {
    await manager.showMainMenu();
  } catch (error) {
    console.error(`${colors.red}❌ Error: ${error.message}${colors.reset}`);
    manager.exit();
  }
}

main();