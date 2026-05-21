---
layout: archive
title: "Top Build Verifiers"
permalink: /verifiers/
---

<style>
  table { 
    width: 100%;
    margin: auto;
    border-collapse: collapse;
    table-layout: fixed;
  }
  
  @media screen and (min-width: 768px) {
    table {
      width: initial;
      table-layout: auto;
    }
    table th:nth-child(1) {
      padding-left: 8em;
      padding-right: 8em;
    }
    table th:nth-child(2) {
      padding-left: 5em;
      padding-right: 5em;
    }
  }

  @media screen and (max-width: 767px) {
    table th, table td {
      padding: 0.5em;
      word-break: break-word;
    }
    .profile-info {
      font-size: 14px;
    }
    .attestation-count-column {
      font-size: 1.2em !important;
      width: 30%;
    }
    .attestator-card-column {
      width: 70%;
    }
  }

  .attestator-card-column {
    padding: 1.3em;
  }
  @media screen and (max-width: 767px) {
    .attestator-card-column {
      padding: 0.5em;
    }
  }

  .attestation-count-column {
    text-align: center;
    font-size: 1.5em;
  }

  .profile-image {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    object-fit: cover;
    flex-shrink: 0;
  }

  .profile-card {
    max-width: 100%;
    overflow: hidden;
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
  }

  .profile-info {
    font-size: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 1;
  }

  .profile-info div {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>

<div style="margin-bottom: 20px; display: flex; align-items: center; gap: 10px;" id="shareButtonContainer"></div>

<div id="verifiersViewToggle" style="margin-bottom: 20px; text-align: center; display: none;">
  <button id="showAllButton" style="display:none;" onclick="toggleAllTimeView()">Show All Time Stats</button>
</div>

<div id="currentMonthSection"></div>
<div id="priorMonthSection"></div>
<div id="allTimeSection" style="display:none;"></div>

<script>
  document.getElementById('loadingSpinner').style.display = 'block';

  // State
  let allEvents = new Map(); // id -> { pubkey, created_at, ... }
  let isAllTimeView = false;

  // --- UI & LOGIC ---

  function aggregateStats(events) {
    const stats = new Map(); // pubkey -> { verifications }
    for (const e of events) {
      const info = stats.get(e.pubkey) || { verifications: 0 };
      info.verifications += 1;
      stats.set(e.pubkey, info);
    }
    return stats;
  }

  function renderMonthTable(events, monthName, containerId, idPrefix) {
    const attestatorInfo = aggregateStats(events);
    
    const sortedAttestators = Array.from(attestatorInfo.entries())
      .sort((a, b) => (b[1].verifications) - (a[1].verifications));

    const tableHTML = `
      <h3 style="text-align:center;">Top Verifiers (${monthName})</h3>
      <table>
        <thead>
          <tr>
            <th class="attestator-card-column">Verifier</th>
            <th class="attestation-count-column"># Verifications</th>
          </tr>
        </thead>
        <tbody>
          ${sortedAttestators.length === 0 ? '<tr><td colspan="2" style="text-align:center; padding: 2em;">No verifications found yet.</td></tr>' : ''}
          ${sortedAttestators.map(([pubkey, info]) => `
            <tr>
              <td class="attestator-card-column" id="${idPrefix}-${pubkey}">${renderProfileCardHtml(pubkey, null)}</td>
              <td class="attestation-count-column">${info.verifications}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    `;

    document.getElementById(containerId).innerHTML = tableHTML;

    // Load Profiles asynchronously (placeholder shown until fetch completes)
    (async () => {
      for (const [pubkey] of sortedAttestators) {
        try {
          const profile = await getNostrProfile(pubkey);
          const el = document.getElementById(`${idPrefix}-${pubkey}`);
          if (el) {
            el.innerHTML = renderProfileCardHtml(pubkey, profile);
          }
        } catch(e) {}
      }
    })();
  }

  function renderTables() {
    const now = new Date();
    const startOfCurrentMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
    const startOfPriorMonth = new Date(startOfCurrentMonth);
    startOfPriorMonth.setUTCMonth(startOfPriorMonth.getUTCMonth() - 1);
    const currentMonthTimestamp = Math.floor(startOfCurrentMonth.getTime() / 1000);
    const priorMonthTimestamp = Math.floor(startOfPriorMonth.getTime() / 1000);
    
    if (isAllTimeView) {
      // Show all-time aggregate
      document.getElementById('currentMonthSection').style.display = 'none';
      document.getElementById('priorMonthSection').style.display = 'none';
      document.getElementById('allTimeSection').style.display = 'block';
      
      const allEventsArray = Array.from(allEvents.values());
      renderMonthTable(allEventsArray, 'All Time', 'allTimeSection', 'alltime-profile');
    } else {
      // Show individual months
      document.getElementById('currentMonthSection').style.display = 'block';
      document.getElementById('priorMonthSection').style.display = 'block';
      document.getElementById('allTimeSection').style.display = 'none';
      
      // Filter events by month
      const currentMonthEvents = Array.from(allEvents.values())
        .filter(e => e.created_at >= currentMonthTimestamp);
      const priorMonthEvents = Array.from(allEvents.values())
        .filter(e => e.created_at >= priorMonthTimestamp && e.created_at < currentMonthTimestamp);
      
      const currentMonthName = startOfCurrentMonth.toLocaleString('default', { month: 'long', year: 'numeric', timeZone: 'UTC' });
      const priorMonthName = startOfPriorMonth.toLocaleString('default', { month: 'long', year: 'numeric', timeZone: 'UTC' });
      
      renderMonthTable(currentMonthEvents, currentMonthName, 'currentMonthSection', 'current-profile');
      renderMonthTable(priorMonthEvents, priorMonthName, 'priorMonthSection', 'prior-profile');
    }
  }

  window.toggleAllTimeView = function() {
    isAllTimeView = !isAllTimeView;
    const button = document.getElementById('showAllButton');
    button.innerText = isAllTimeView ? "Show Recent Only" : "Show All Time Stats";
    renderTables();
  };

  window.addEventListener('allAssetInformationLoaded', () => {
    loadEventsAndRenderTables();
  });

  window.addEventListener('verificationsUILoaded', () => {
    renderShareButton({
      container: "#shareButtonContainer",
      defaultMessage: "Look at the Top Verifiers ranking on WalletScrutiny!",
      showRawButtons: false
    });

    // If data already loaded, render immediately
    if (window.allAssetInformation) {
      loadEventsAndRenderTables();
    }
  });

  window.loadEventsAndRenderTables = function() {
    // This shouldn't happen here, but just in case
    if (!window.allAssetInformation) return;
    
    allEvents.clear();
    
    // Load events from global cache - Extract all verifications - already deduplicated in the global cache
    for (const verificationGroup of window.allAssetInformation.verifications.values()) {
      for (const verification of verificationGroup) {
        allEvents.set(verification.id, {
          id: verification.id,
          pubkey: verification.pubkey,
          created_at: verification.created_at,
          kind: verification.kind
        });
      }
    }

    console.log(`Loaded ${allEvents.size} unique verifications from global cache (already deduplicated by hash+pubkey)`);

    renderTables();

    document.getElementById('loadingSpinner').style.display = 'none';
    document.getElementById('verifiersViewToggle').style.display = 'block';
    document.getElementById('showAllButton').style.display = 'inline-block';
  }
</script>
