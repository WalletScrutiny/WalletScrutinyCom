
import { MenuHandler } from './menu-handler.mjs';
import { UIRenderer } from './ui-renderer.mjs';
import { AnalysisEngine } from './analysis-engine.mjs';
import { generateMissingEventsReport } from './report-generator.mjs';
import { publishToRelay, countBackupEvents, KIND_NAMES } from './publishToRelay.mjs';
import WebSocket from "ws";
import {
  setupWebSocketForNode,
  withEphemeralPool,
} from "../../../src/nostr-client.mjs";

setupWebSocketForNode(WebSocket);
import WebSocket from "ws";
import fs from "fs";
import path from "path";

global.WebSocket = WebSocket;

class VerificationTool {
  constructor() {
    this.menuHandler = new MenuHandler();
    this.uiRenderer = new UIRenderer();
    this.analysisEngine = new AnalysisEngine();
  }

  async handleMenuSelection(menu, index) {
    if (menu === 'main') {
      switch (index) {
        case 0: // Count verifications (simple version)
          const backupEvents = await this.analysisEngine.getBackupData();
          this.uiRenderer.displayReport("📊 Verification Count", `Total WalletScrutiny.com verifications in backup: ${backupEvents.length}`);
          await this.uiRenderer.waitForKey();
          this.start();
          break;
        case 1: // Cross-reference menu
          this.menuHandler.setMenu('sub');
          this.start();
          break;
        case 2: // Backup Nostr verification events
          console.log("🔄 Starting backup of Nostr verification events...\n");
          try {
            // Import and run Luis's existing backup script
            await import("../../nostr/backupNostrVerificationEvents.mjs");
          } catch (error) {
            console.error("❌ Error running backup script:", error.message);
          }
          console.log("\nPress any key to return to menu...");
          await this.uiRenderer.waitForKey();
          this.start(); // Return to menu after backup
          break;
        case 3: // Check relay.nostr.info
          await this.checkRelayNostrInfo();
          this.start();
          break;
        case 4: // Publish backup to relay
          await this.showPublishMenu();
          this.start();
          break;
        // ... other main menu options
      }
    } else if (menu === 'sub') {
      switch (index) {
        case 0: // Relay Comparison Matrix
          const backup = await this.analysisEngine.getBackupData();
          const relays = await this.analysisEngine.getRelayData();
          await this.showInteractiveMatrix(backup, relays);
          this.start(); // Return to menu after interactive matrix
          break;
        case 1: // Missing Events Report
          const backupForMissing = await this.analysisEngine.getBackupData();
          const relaysForMissing = await this.analysisEngine.getRelayData();
          const missingReport = generateMissingEventsReport(backupForMissing, relaysForMissing);
          this.uiRenderer.displayReport("📋 Missing Events Report", missingReport);
          await this.uiRenderer.waitForKey();
          this.start();
          break;
        case 2: // Author-Centric View
          console.log("👤 Author-Centric View\n");
          await this.showAuthorView();
          this.start(); // Return to menu after author view
          break;
        case 3: // Interactive Drill-Down
          console.log("🔍 Interactive Drill-Down\n");
          await this.showInteractiveDrillDown();
          this.start(); // Return to menu after drill-down
          break;
        case 4: // Back to Main Menu
          this.menuHandler.setMenu('main');
          this.start();
          break;
        // ... other sub menu options
      }
    }
  }

  async showInteractiveMatrix(backupEvents, relayData) {
    let selectedIndex = 0;
    let currentPage = 0;
    const eventsPerPage = 20;
    
    while (true) {
      const matrixInfo = this.uiRenderer.displayMatrix(backupEvents, relayData, currentPage, eventsPerPage, selectedIndex);
      const { eventsToShow, totalPages } = matrixInfo;
      
      const key = await this.uiRenderer.waitForKey();
      
      switch (key) {
        case '\u001b[A': // Up arrow
          if (selectedIndex > 0) {
            selectedIndex--;
          } else if (currentPage > 0) {
            currentPage--;
            selectedIndex = Math.min(eventsPerPage - 1, backupEvents.slice(currentPage * eventsPerPage).length - 1);
          }
          break;
          
        case '\u001b[B': // Down arrow
          if (selectedIndex < eventsToShow.length - 1) {
            selectedIndex++;
          } else if (currentPage < totalPages - 1) {
            currentPage++;
            selectedIndex = 0;
          }
          break;
          
        case '\u001b[D': // Left arrow
          if (currentPage > 0) {
            currentPage--;
            selectedIndex = Math.min(selectedIndex, backupEvents.slice(currentPage * eventsPerPage, (currentPage + 1) * eventsPerPage).length - 1);
          }
          break;
          
        case '\u001b[C': // Right arrow
          if (currentPage < totalPages - 1) {
            currentPage++;
            selectedIndex = Math.min(selectedIndex, backupEvents.slice(currentPage * eventsPerPage, (currentPage + 1) * eventsPerPage).length - 1);
          }
          break;
          
        case '\r': // Enter
          const selectedEvent = eventsToShow[selectedIndex];
          await this.showEventDetails(selectedEvent, relayData);
          break;
          
        case 'q':
        case 'Q':
          return; // Go back to menu
          
        default:
          // Ignore other keys
          break;
      }
    }
  }

  async showEventDetails(event, relayData) {
    const eventAnalysis = await this.analysisEngine.analyzeEventDetails(event, relayData);
    eventAnalysis.event = event; // Include the full event object
    let selectedButton = null;
    const relayUrls = Object.keys(relayData);
    
    while (true) {
      this.uiRenderer.displayEventDetails(eventAnalysis, selectedButton);
      
      const key = await this.uiRenderer.waitForKey();
      
      if (key === '\t') { // Tab key
        if (selectedButton === null) {
          selectedButton = 0; // Select first relay
        } else {
          selectedButton = null; // Deselect
        }
      } else if (key === '\u001b[A') { // Up arrow
        if (selectedButton === null) {
          selectedButton = relayUrls.length - 1; // Select last relay
        } else if (selectedButton > 0) {
          selectedButton--;
        } else {
          selectedButton = relayUrls.length - 1; // Wrap to last
        }
      } else if (key === '\u001b[B') { // Down arrow
        if (selectedButton === null) {
          selectedButton = 0; // Select first relay
        } else if (selectedButton < relayUrls.length - 1) {
          selectedButton++;
        } else {
          selectedButton = 0; // Wrap to first
        }
      } else if (key === '\r' && selectedButton !== null) { // Enter key when button is selected
        const selectedRelayUrl = relayUrls[selectedButton];
        await this.fetchRawEventFromRelay(event.id, selectedRelayUrl);
        // Continue the loop to return to event details page, don't exit
      } else {
        return; // Return to matrix
      }
    }
  }

  async showAuthorView() {
    console.log("👤 Loading Author-Centric View...\n");
    
    try {
      const analysisResults = await this.analysisEngine.analyzeAuthorCoverage();
      this.uiRenderer.displayAuthorAnalysis(analysisResults);
      
    } catch (error) {
      console.error("❌ Error generating author view:", error.message);
    }
    
    console.log("\nPress any key to return to menu...");
    await this.uiRenderer.waitForKey();
  }

  async showInteractiveDrillDown() {
    try {
      const backupEvents = await this.analysisEngine.getBackupData();
      const relayData = await this.analysisEngine.getRelayData();
      
      console.log("\n" + "=".repeat(60));
      console.log("🔍 INTERACTIVE DRILL-DOWN");
      console.log("=".repeat(60));
      
      console.log("\nChoose analysis type:");
      console.log("1. Analyze specific relay");
      console.log("2. Analyze specific author");
      console.log("3. Analyze by time period");
      console.log("4. Find orphaned events (backup only)");
      console.log("5. Return to sub-menu");
      console.log("\nEnter choice (1-5): ");
      
      // For now, show a simplified message
      console.log("\n⚠️  Interactive Drill-Down features are being implemented.");
      console.log("This will include detailed analysis options for relays, authors, time periods, and orphaned events.");
      
    } catch (error) {
      console.error("❌ Error in drill-down:", error.message);
    }
    
    console.log("\nPress any key to return to menu...");
    await this.uiRenderer.waitForKey();
  }

  async fetchRawEventFromRelay(eventId, relayUrl) {
    this.uiRenderer.clearScreen();
    
    const relayName = relayUrl.replace('wss://', '').replace('/', '').toUpperCase();
    
    console.log(`📡 FETCHING RAW EVENT FROM ${relayName}`);
    console.log("=".repeat(60));
    console.log(`\nEvent ID: ${eventId}`);
    console.log(`Connecting to ${relayUrl}...\n`);
    
    try {
      await withEphemeralPool([relayUrl], async (pool, urls) => {
      console.log(`Connected to ${relayName} relay`);
      console.log("Fetching event...\n");

      const event = await pool.get(urls, { ids: [eventId] });

      if (event) {
        console.log("RAW EVENT DATA:");
        console.log("-".repeat(60));
        console.log(JSON.stringify({
          id: event.id,
          pubkey: event.pubkey,
          created_at: event.created_at,
          kind: event.kind,
          tags: event.tags,
          content: event.content,
          sig: event.sig
        }, null, 2));
      } else {
        console.log(`Event not found on ${relayName} relay`);
      }
      }, { connectTimeoutMs: 3000 });
    } catch (error) {
      console.log(`Failed to fetch from ${relayName}: ${error.message}`);
    }
    
    console.log("\n" + "=".repeat(60));
    console.log("Press any key to return to event details...");
    
    await this.uiRenderer.waitForKey();
  }

  async showPublishMenu() {
    const RELAY_URL   = "wss://relay.nostr.info";
    const EVENT_DELAY = 2000;
    const KIND_PAUSE  = 10000;

    this.uiRenderer.clearScreen();
    console.log("📡 PUBLISH BACKUP TO RELAY");
    console.log("=".repeat(60));
    console.log(`\nTarget relay : ${RELAY_URL}`);
    console.log(`Event delay  : ${EVENT_DELAY / 1000}s between events`);
    console.log(`Kind pause   : ${KIND_PAUSE / 1000}s between kinds`);

    const counts = countBackupEvents();
    const totalEvents = Object.values(counts).reduce((a, b) => a + b, 0);
    const kindsWithEvents = Object.entries(counts).filter(([, n]) => n > 0);
    const estimatedMs = totalEvents * EVENT_DELAY + (kindsWithEvents.length - 1) * KIND_PAUSE;
    const estimatedMin = Math.ceil(estimatedMs / 60000);

    console.log("\nEvents to publish:");
    for (const [kind, count] of kindsWithEvents) {
      console.log(`  Kind ${kind} (${KIND_NAMES[kind]}): ${count} events`);
    }
    console.log(`\n  Total            : ${totalEvents} events`);
    console.log(`  Estimated time   : ~${estimatedMin} minutes`);
    console.log("\n" + "=".repeat(60));
    console.log("⚠️  This will re-publish all backup events to relay.nostr.info");
    console.log("\nPress Y to proceed, any other key to cancel...");

    const key = await this.uiRenderer.waitForKey();

    if (key === "y" || key === "Y") {
      console.log("\n🚀 Starting publish...\n");
      await publishToRelay({ relayUrl: RELAY_URL, eventDelay: EVENT_DELAY, kindPause: KIND_PAUSE });
      console.log("\nPress any key to return to menu...");
      await this.uiRenderer.waitForKey();
    } else {
      console.log("\nCancelled. Press any key to return to menu...");
      await this.uiRenderer.waitForKey();
    }
  }

  async checkRelayNostrInfo() {
    this.uiRenderer.clearScreen();
    const RELAY_URL = "wss://relay.nostr.info";

    console.log("📡 CHECKING relay.nostr.info");
    console.log("=".repeat(60));
    console.log(`Connecting to ${RELAY_URL}...\n`);

    await withEphemeralPool([RELAY_URL], async (pool, urls) => {
      console.log("Connected\nFetching kind 30301 events...\n");

      const allEvents = await Promise.race([
        pool.querySync(urls, { kinds: [30301] }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Fetch timeout after 15s")), 15000)
        ),
      ]);

      const wsEvents = allEvents.filter(e =>
        e.tags.some(t => Array.isArray(t) && t[0] === "client" && t[1] === "WalletScrutiny.com")
      );

      const backupEvents = await this.analysisEngine.getBackupData();

      const relayIds = new Set(wsEvents.map(e => e.id));
      const missingFromRelay = backupEvents.filter(e => !relayIds.has(e.id));

      console.log("=".repeat(60));
      console.log("RESULTS");
      console.log("=".repeat(60));
      console.log(`  Total kind 30301 events on relay : ${allEvents.length}`);
      console.log(`  WalletScrutiny.com events on relay: ${wsEvents.length}`);
      console.log(`  WalletScrutiny.com events in backup: ${backupEvents.length}`);
      console.log(`  Missing from relay (in backup only): ${missingFromRelay.length}`);

      if (wsEvents.length > 0) {
        const sorted = wsEvents.sort((a, b) => b.created_at - a.created_at);
        const newest = new Date(sorted[0].created_at * 1000).toISOString().split("T")[0];
        const oldest = new Date(sorted[sorted.length - 1].created_at * 1000).toISOString().split("T")[0];
        console.log(`\n  Newest event : ${newest}`);
        console.log(`  Oldest event : ${oldest}`);
      }

      if (missingFromRelay.length > 0) {
        console.log(`\n${missingFromRelay.length} backup events are NOT on relay.nostr.info`);
        console.log("   (These would be candidates for inverse backup / re-publishing)");
      } else {
        console.log("\nrelay.nostr.info has all backup events!");
      }
    }, { connectTimeoutMs: 5000 });

    console.log("\n" + "=".repeat(60));
    console.log("Press any key to return to menu...");
    await this.uiRenderer.waitForKey();
  }

  start() {
    this.uiRenderer.displayMenu(this.menuHandler);
    
    const handleKey = (key) => {
      this.uiRenderer.handleKeyPress(key, async (action, keyData) => {
        if (action === 'up') {
          this.menuHandler.navigate('up');
          this.uiRenderer.displayMenu(this.menuHandler);
        } else if (action === 'down') {
          this.menuHandler.navigate('down');
          this.uiRenderer.displayMenu(this.menuHandler);
        } else if (action === 'select') {
          process.stdin.removeListener('data', handleKey);
          const selection = this.menuHandler.getCurrentSelection();
          await this.handleMenuSelection(selection.menu, selection.index);
        }
      });
    };
    
    process.stdin.on('data', handleKey);
  }
}

const tool = new VerificationTool();
tool.start();
