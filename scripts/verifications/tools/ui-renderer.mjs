/**
 * UI Renderer - Pure UI rendering and interaction logic
 */

import readline from "readline";

export class UIRenderer {
  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
  }

  clearScreen() {
    console.clear();
  }

  displayMenu(menuHandler) {
    this.clearScreen();
    const options = menuHandler.getOptions();
    const title = menuHandler.getTitle();

    console.log(title);

    options.forEach((option, index) => {
      if (index === menuHandler.selectedIndex) {
        console.log(`\x1b[47m\x1b[30m ${option} \x1b[0m`);
      } else {
        console.log(` ${option}`);
      }
    });

    console.log("\n📋 Navigation:");
    console.log("  ↑/↓ - Navigate menu");
    console.log("  Enter - Select option");
    console.log("  Ctrl+C - Exit");
  }

  displayReport(title, content) {
    this.clearScreen();
    console.log(title);
    console.log(content);
    console.log("\nPress any key to return to the menu...");
  }

  displayMatrix(backupEvents, relayData, currentPage, eventsPerPage, selectedIndex) {
    this.clearScreen();
    
    console.log("📊 RELAY COMPARISON MATRIX");
    console.log("=".repeat(80));
    
    // Create header
    const relayNames = [];
    for (const url of Object.keys(relayData)) {
      const name = url.replace('wss://', '').replace('/', '');
      relayNames.push(name.length > 12 ? name.substring(0, 12) : name);
    }
    
    console.log(`Event ID (short)    | Backup | ${relayNames.join(' | ')}`);
    console.log("-".repeat(80));
    
    // Calculate events for current page
    const totalPages = Math.ceil(backupEvents.length / eventsPerPage);
    const startIndex = currentPage * eventsPerPage;
    const endIndex = Math.min(startIndex + eventsPerPage, backupEvents.length);
    const eventsToShow = backupEvents.slice(startIndex, endIndex);
    
    // Display events with selection highlighting
    for (let i = 0; i < eventsToShow.length; i++) {
      const event = eventsToShow[i];
      const shortId = event.id.substring(0, 15) + "...";
      const isSelected = i === selectedIndex;
      
      let line = `${shortId.padEnd(18)} |   ✅    |`;
      
      const relayUrls = Object.keys(relayData);
      for (const relayUrl of relayUrls) {
        const relayEvents = relayData[relayUrl];
        const hasEvent = relayEvents.some(e => e.id === event.id);
        const symbol = hasEvent ? '✅' : '❌';
        const padding = relayNames[relayUrls.indexOf(relayUrl)].length + 1;
        line += ` ${symbol}`.padEnd(padding) + " |";
      }
      
      // Highlight selected row
      if (isSelected) {
        console.log(`\x1b[7m${line}\x1b[0m`); // Reverse video
      } else {
        console.log(line);
      }
    }
    
    // Show pagination info
    console.log("\n" + "-".repeat(80));
    console.log(`Page ${currentPage + 1} of ${totalPages} | Showing events ${startIndex + 1}-${endIndex} of ${backupEvents.length}`);
    console.log(`Total events in local backup: ${backupEvents.length}`);
    
    // Show controls
    console.log("\n" + "=".repeat(80));
    console.log("🎮 Controls:");
    console.log("↑/↓ - Navigate events | ←/→ - Change page | Enter - View details | Q - Back to menu");
    
    return { eventsToShow, totalPages, startIndex, endIndex };
  }

  displayEventDetails(eventAnalysis, selectedButton = null) {
    this.clearScreen();
    
    console.log("🔍 EVENT DETAILS");
    console.log("=".repeat(80));
    
    console.log(`\n📱 App Information:`);
    console.log(`   Complete Event ID: ${eventAnalysis.event.id}`);
    console.log(`   App ID: ${eventAnalysis.appId}`);
    console.log(`   Version: ${eventAnalysis.version}`);
    console.log(`   Platform: ${eventAnalysis.platform}`);
    console.log(`   Verification Status: ${eventAnalysis.status}`);
    console.log(`   Verifier: ${eventAnalysis.verifier}`);
    console.log(`   Date: ${eventAnalysis.date}`);
    
    console.log(`\n🔗 Relay Status:`);
    console.log("-".repeat(50));
    
    // Check presence on each relay
    for (const relay of eventAnalysis.relayStatus) {
      console.log(`   ${relay.index}. ${relay.shortUrl}: ${relay.status}`);
    }
    
    console.log(`\n🌐 View on Web to confirm:`);
    console.log("-".repeat(50));
    console.log(`   • njump:   https://njump.me/${eventAnalysis.event.id} (universal gateway)`);
    
    // Add fetch raw event section
    console.log(`\n📡 Fetch Raw Event from Relay:`);
    console.log("-".repeat(50));
    
    // Show relay buttons with fetch functionality
    for (const relay of eventAnalysis.relayStatus) {
      const isSelected = selectedButton === (relay.index - 1);
      let buttonDisplay;
      
      if (isSelected) {
        buttonDisplay = `\x1b[43m\x1b[30m[ Fetch Raw Event ]\x1b[0m - ENTER to fetch`;
      } else {
        buttonDisplay = `\x1b[47m\x1b[30m[ Fetch Raw Event ]\x1b[0m`;
      }
      
      console.log(`   ${relay.index}. ${relay.shortUrl}: ${relay.status} ${buttonDisplay}`);
    }
    
    console.log("\n" + "=".repeat(80));
    if (selectedButton !== null) {
      console.log("↑/↓ - Navigate buttons | ENTER - Fetch Raw Event | TAB - Deselect | Any other key - Return to matrix");
    } else {
      console.log("TAB - Select first button | ↑/↓ - Navigate buttons | Any other key - Return to matrix");
    }
  }

  displayAuthorAnalysis(analysisResults) {
    this.clearScreen();
    
    console.log("\n" + "=".repeat(80));
    console.log("👤 AUTHOR-CENTRIC VIEW");
    console.log("=".repeat(80));
    
    for (const author of analysisResults.authors) {
      console.log(`\n👤 AUTHOR: ${author.shortPubkey}`);
      console.log(`   Total events in backup: ${author.totalEvents}`);
      
      // Check coverage per relay
      for (const [relayUrl, coverage] of Object.entries(author.relayCoverage)) {
        console.log(`   ├─ ${coverage.relayName.padEnd(20)}: ${coverage.present}/${coverage.total} (${coverage.coverage}%) ${coverage.status} ${coverage.missing > 0 ? `Missing ${coverage.missing}` : ''}`);
      }
      
      console.log("   └─ Recent events:");
      for (const event of author.recentEvents) {
        console.log(`      • ${event.shortId} (${event.daysAgo} days ago)`);
      }
    }
    
    // Summary statistics
    console.log("\n" + "=".repeat(50));
    console.log("📊 AUTHOR SUMMARY:");
    console.log(`Total unique authors: ${analysisResults.summary.totalAuthors}`);
    console.log(`Most active author: ${analysisResults.summary.mostActiveCount} events`);
    console.log(`Average events per author: ${analysisResults.summary.averageEventsPerAuthor}`);
    
    // Find authors with poor relay coverage
    console.log("\n🚨 AUTHORS WITH POOR RELAY COVERAGE:");
    if (analysisResults.summary.poorCoverageAuthors.length === 0) {
      console.log("   ✅ All authors have good relay coverage");
    } else {
      for (const author of analysisResults.summary.poorCoverageAuthors) {
        console.log(`   ${author.shortPubkey}: ${author.totalMissing} total missing events (worst: ${author.worstRelay})`);
      }
    }
  }

  async waitForKey() {
    return new Promise((resolve) => {
      const onData = (key) => {
        process.stdin.removeListener('data', onData);
        resolve(key);
      };
      process.stdin.on('data', onData);
    });
  }

  handleKeyPress(key, callback) {
    switch (key) {
      case '\u001b[A': // Up arrow
        callback('up');
        break;
      case '\u001b[B': // Down arrow
        callback('down');
        break;
      case '\r': // Enter
        callback('select');
        break;
      case '\u0003': // Ctrl+C
        this.cleanup();
        console.log('\n👋 Goodbye!');
        process.exit(0);
        break;
      default:
        callback('other', key);
        break;
    }
  }

  cleanup() {
    process.stdin.setRawMode(false);
    this.rl.close();
  }
}