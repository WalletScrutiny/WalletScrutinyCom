/**
 * Analysis Engine - Core business logic for verification analysis
 */

import { loadBackupEvents, gatherRelayData } from './nostr-data.mjs';

export class AnalysisEngine {
  constructor() {
    this.cache = {
      backupEvents: null,
      relayData: null
    };
  }

  async getBackupData() {
    if (!this.cache.backupEvents) {
      this.cache.backupEvents = await loadBackupEvents();
    }
    return this.cache.backupEvents;
  }

  async getRelayData() {
    if (!this.cache.relayData) {
      this.cache.relayData = await gatherRelayData();
    }
    return this.cache.relayData;
  }

  async analyzeAuthorCoverage() {
    const backupEvents = await this.getBackupData();
    const relayData = await this.getRelayData();
    
    // Group backup events by author
    const authorGroups = {};
    for (const event of backupEvents) {
      if (!authorGroups[event.pubkey]) {
        authorGroups[event.pubkey] = [];
      }
      authorGroups[event.pubkey].push(event);
    }

    // Sort authors by event count (descending)
    const sortedAuthors = Object.entries(authorGroups)
      .sort(([,a], [,b]) => b.length - a.length);

    const relayUrls = Object.keys(relayData);
    const analysisResults = [];

    for (const [pubkey, events] of sortedAuthors) {
      const authorAnalysis = {
        pubkey,
        shortPubkey: pubkey.substring(0, 16) + "..." + pubkey.substring(-8),
        totalEvents: events.length,
        relayCoverage: {},
        recentEvents: events
          .sort((a, b) => b.created_at - a.created_at)
          .slice(0, 3)
          .map(event => ({
            shortId: event.id.substring(0, 12) + "...",
            daysAgo: Math.floor((Date.now() - (event.created_at * 1000)) / (1000 * 60 * 60 * 24))
          }))
      };

      // Check coverage per relay
      for (const relayUrl of relayUrls) {
        const relayEvents = relayData[relayUrl];
        const authorEventsOnRelay = relayEvents.filter(e => e.pubkey === pubkey);
        const coverage = events.length > 0 ? ((authorEventsOnRelay.length / events.length) * 100).toFixed(1) : '0.0';
        const status = authorEventsOnRelay.length === events.length ? '✅' : '❌';
        const missing = events.length - authorEventsOnRelay.length;

        authorAnalysis.relayCoverage[relayUrl] = {
          present: authorEventsOnRelay.length,
          total: events.length,
          coverage: parseFloat(coverage),
          status,
          missing,
          relayName: relayUrl.replace('wss://', '').replace('/', '').substring(0, 20)
        };
      }

      analysisResults.push(authorAnalysis);
    }

    // Calculate poor coverage authors
    const poorCoverageAuthors = [];
    for (const author of analysisResults) {
      let totalMissing = 0;
      let worstRelay = '';
      let worstMissing = 0;

      for (const relayUrl of relayUrls) {
        const coverage = author.relayCoverage[relayUrl];
        totalMissing += coverage.missing;

        if (coverage.missing > worstMissing) {
          worstMissing = coverage.missing;
          worstRelay = coverage.relayName;
        }
      }

      if (totalMissing > author.totalEvents * 2) {
        poorCoverageAuthors.push({
          shortPubkey: author.shortPubkey,
          totalMissing,
          worstRelay
        });
      }
    }

    return {
      authors: analysisResults,
      summary: {
        totalAuthors: sortedAuthors.length,
        mostActiveCount: sortedAuthors[0][1].length,
        averageEventsPerAuthor: parseFloat((backupEvents.length / sortedAuthors.length).toFixed(1)),
        poorCoverageAuthors
      }
    };
  }

  getFirstTagValue(event, tagName) {
    const tag = event.tags.find(tag => Array.isArray(tag) && tag[0] === tagName);
    return tag ? tag[1] : null;
  }

  async analyzeEventDetails(event, relayData) {
    return {
      appId: this.getFirstTagValue(event, 'i') || 'N/A',
      version: this.getFirstTagValue(event, 'version') || 'N/A',
      platform: this.getFirstTagValue(event, 'platform') || 'N/A',
      status: this.getFirstTagValue(event, 'status') || 'N/A',
      verifier: event.pubkey,
      date: new Date(event.created_at * 1000).toISOString().split('T')[0],
      relayStatus: Object.keys(relayData).map((relayUrl, index) => {
        const relayEvents = relayData[relayUrl];
        const hasEvent = relayEvents.some(e => e.id === event.id);
        return {
          index: index + 1,
          shortUrl: relayUrl.replace('wss://', '').replace('/', ''),
          status: hasEvent ? '✅ Present' : '❌ Absent',
          hasEvent
        };
      })
    };
  }

  clearCache() {
    this.cache.backupEvents = null;
    this.cache.relayData = null;
  }
}