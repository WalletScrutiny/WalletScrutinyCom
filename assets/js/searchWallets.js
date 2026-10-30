const verdictOrder = ['sourceavailable', 'diy', 'nosource', 'custodial', 'ecash', 'nosendreceive', 'sealed-noita', 'noita', 'sealed-plainkey', 'plainkey', 'obfuscated', 'prefilled', 'fake', 'wip', 'unreleased', 'vapor', 'nobtc', 'nowallet'];
const platformOrder = ['hardware', 'desktop', 'android', 'iphone', 'mobile', 'bearer', 'others'];
const metaOrder = ['ok', 'discontinued', 'deprecated', 'stale', 'obsolete', 'removed', 'defunct', 'fewusers'];

// Core search functions

// A wallet is searched as the upper-cased JSON of all its fields. Building
// that string for every wallet on every keystroke was most of the search
// cost, so it is built once per wallet object and kept here. matchRank and
// matchData are search bookkeeping written onto the wallet, not wallet data.
let walletSearchTextCache = new WeakMap();

function isSearchBookkeepingKey (key) {
  return key === 'matchRank' || key === 'matchData';
}

function getWalletSearchText (wallet) {
  let text = walletSearchTextCache.get(wallet);
  if (text === undefined) {
    text = `${wallet.title}`;
    for (const [key, value] of Object.entries(wallet)) {
      if (isSearchBookkeepingKey(key)) continue;
      text += `${wallet.altTitle}${JSON.stringify(value, (k, v) => (isSearchBookkeepingKey(k) ? undefined : v))}${key}`;
    }
    text = String(text).toUpperCase();
    walletSearchTextCache.set(wallet, text);
  }
  return text;
}

// Fill the cache in idle time so the first keystroke does not pay for all
// wallets at once.
function warmWalletSearchTextCache (wallets) {
  const schedule = window.requestIdleCallback ? (fn) => window.requestIdleCallback(fn) : (fn) => setTimeout(fn, 50);
  const chunk = 300;
  let i = 0;
  const step = () => {
    const end = Math.min(i + chunk, wallets.length);
    for (; i < end; i++) getWalletSearchText(wallets[i]);
    if (i < wallets.length) schedule(step);
  };
  schedule(step);
}

function searchByWords(query, wallet) {
  const searchTermWords = query.length > 0 ? query.split(" ") : false;
  const walletTitleUpper = String(wallet.title || '').toUpperCase();
  const walletAsStr = getWalletSearchText(wallet);

  let result = false;
  for (let i = 0; i < searchTermWords.length; i++) {
    const word = searchTermWords[i];
    const word2 =searchTermWords[i + 1] ? word + searchTermWords[i + 1] : false;
    const word3 =searchTermWords[i + 1] ? `${word} ${searchTermWords[i + 1]}` : false;
    const word4 = String(query);
    if (walletTitleUpper.indexOf(word4) >= 0) {
      result = wallet;
      wallet.matchRank = 0;
      wallet.matchData = "word4 title " + word4;
      break;
    }
    if (walletAsStr.indexOf(word4) >= 0) {
      result = wallet;
      wallet.matchRank = walletAsStr.indexOf(word4);
      wallet.matchData = "word4 " + word4;
      break;
    }
    if (word3 && walletAsStr.indexOf(word3) >= 0) {
      result = wallet;
      wallet.matchRank = walletAsStr.indexOf(word3);
      wallet.matchData = "word3 " + word3;
      break;
    }
    if (word2 && walletAsStr.indexOf(word2) >= 0) {
      result = wallet;
      wallet.matchRank = walletAsStr.indexOf(word2);
      wallet.matchData = "word2 " + word2;
      break;
    }
    if (walletAsStr.indexOf(word) >= 0) {
      result = wallet;
      wallet.matchRank = walletAsStr.indexOf(word) + (i + 1);
      wallet.matchData = "word " + word;
      break;
    }
  }
  return result;
}

// Parse f:key feature tokens from a query string.
// Returns { featureKeys: string[], remainingQuery: string }
function parseFeatureTokens(query) {
  if (!query) return { featureKeys: [], remainingQuery: '' };
  const featureKeys = [];
  const words = query.split(/\s+/);
  const remaining = [];
  for (const word of words) {
    if (word.toLowerCase().startsWith('f:')) {
      const key = word.slice(2);
      if (key.length > 0) featureKeys.push(key);
    } else {
      remaining.push(word);
    }
  }
  return { featureKeys, remainingQuery: remaining.join(' ').trim() };
}

function walletMatchesPlatformFilter (wallet, platform) {
  if (!platform || platform === 'allPlatforms') {
    return true;
  }
  if (platform === 'android') {
    return Boolean(
      (wallet.folder === 'mobile' && wallet.hasAndroid) || wallet.folder === 'android' ||
      (wallet.archived && wallet.folder === 'mobile'),
    );
  }
  if (platform === 'iphone') {
    return Boolean(
      (wallet.folder === 'mobile' && wallet.hasIphone) || wallet.folder === 'iphone' ||
      (wallet.archived && wallet.folder === 'mobile'),
    );
  }
  return wallet.folder === platform;
}

function performSearch (wallets, query = false, platform = false) {
  // Extract f:key tokens from query
  const { featureKeys, remainingQuery } = parseFeatureTokens(query || '');
  const textQuery = remainingQuery.length > 0 ? remainingQuery : false;

  const workingArray = [];
  let walletsTemp = false;
  if (platform && platform !== 'allPlatforms') {
    walletsTemp = wallets.filter(function (w) {
      return walletMatchesPlatformFilter(w, platform);
    });
  } else {
    walletsTemp = wallets;
  }

  // Filter by features first (AND logic: must have ALL requested features)
  // Case-insensitive: query is uppercased by the time it arrives here
  if (featureKeys.length > 0) {
    walletsTemp = walletsTemp.filter(w => {
      const wf = (Array.isArray(w.features) ? w.features : []).filter(f => typeof f === 'string').map(f => f.toLowerCase());
      return featureKeys.every(k => wf.includes(k.toLowerCase()));
    });
  }

  for (const wallet of walletsTemp) {
    if (textQuery && textQuery.length > 0) {
      const result = searchByWords(textQuery, wallet);
      if (result) {
        workingArray.push(result);
      }
    } else {
      workingArray.push(wallet);
    }
  }

  let temp = [];
  if (query && query.length > 0) {
    temp = workingArray.filter((w) => w.matchRank === 0);
    temp = temp.length < 1 ? workingArray : temp;
  } else {
    temp = workingArray;
  }

  temp.sort((a, b) => {
    const aVerdict = getPrimaryWalletVerdict(a);
    const bVerdict = getPrimaryWalletVerdict(b);
    if (aVerdict !== bVerdict && aVerdict && bVerdict) {
      return verdictOrder.indexOf(aVerdict) - verdictOrder.indexOf(bVerdict);
    }
    if (a.meta !== b.meta && a.meta && b.meta) {
      return metaOrder.indexOf(a.meta) - metaOrder.indexOf(b.meta);
    }
    if (walletHasVerdict(a, 'sourceavailable') && walletHasVerdict(b, 'sourceavailable')) {
      try {
        if (!window.allAssetInformation) {
          return 0;
        }

        const resultA = getWeightForAppFromAssetInformation(a.storeAppId || a.appId);
        const aWeight = resultA.weight;
        const aLastVersionVerified = resultA.lastVersionVerified;

        const resultB = getWeightForAppFromAssetInformation(b.storeAppId || b.appId);
        const bWeight = resultB.weight;
        const bLastVersionVerified = resultB.lastVersionVerified;

        // First compare by lastVersionVerified
        if (aLastVersionVerified !== bLastVersionVerified) {
          return bLastVersionVerified - aLastVersionVerified;
        }
        // If lastVersionVerified are equal, compare by weight
        return bWeight - aWeight;

      } catch (e) {
        console.error(e);
        return 0;
      }
    }
    if (a.folder !== b.folder) {
      return platformOrder.indexOf(a.folder) - platformOrder.indexOf(b.folder);
    }
    if (a.users !== b.users) {
      return b.users - a.users;
    }
    if (a.reviews !== b.reviews) {
      return b.reviews - a.reviews;
    }
    if (a.opinion !== b.opinion) {
      // products that have opinions at all are ranked above those without any
      // opinions on purpose. Once opinions pick up, we might change that to
      // treat zero opinions as score 0.
      if (!b.opinion) {
        return -1;
      }
      if (!a.opinion) {
        return 1;
      }
      const aScore =
          (a.opinion.positive || 0) * 10 +
          (a.opinion.negative || 0) * -10 +
          (a.opinion.neutral || 0);
      const bScore =
          (b.opinion.positive || 0) * 10 +
          (b.opinion.negative || 0) * -10 +
          (b.opinion.neutral || 0);
      return bScore - aScore;
    }
    if (a.matchRank !== b.matchRank) {
      return a.matchRank - b.matchRank;
    }
    return a.appId.localeCompare(b.appId);
  });
  return temp;
}

// UI related functions
function exitSearchUI () {
  const ui = document.querySelector('.results-target');
  stopSearchResultsBatches();
  ui.innerHTML = '';
  ui.classList.remove('visible');
  document.body.classList.remove('search-ui-active');
  document.querySelector('.wallet-search').classList.remove('active');
}

// Searching on every keystroke made phones stutter: wait for a short pause
// in typing, and only ever render the newest term. Enter searches at once.
const NAVBAR_SEARCH_DEBOUNCE_MS = 150;
let navBarSearchTimer = null;

function searchTrigger (immediate = false) {
  clearTimeout(navBarSearchTimer);
  navBarSearchTimer = null;
  if (window.searchTerm && window.searchTerm.length > 1) {
    document.querySelector('.wallet-search').classList.add('active');
    document.querySelector('.search-controls').classList.add('working');
    document.querySelector('.search-controls').classList.add('edited');
  } else {
    document.querySelector('.search-controls').classList.remove('working');
    document.querySelector('.search-controls').classList.remove('edited');
    // below the 2-character search minimum nothing re-renders the results,
    // so close the dropdown instead of leaving stale results on screen
    exitSearchUI();
  }

  if (!window.searchTerm) return;
  if (immediate) {
    doNavBarSearch(window.searchTerm);
  } else {
    navBarSearchTimer = setTimeout(() => doNavBarSearch(window.searchTerm), NAVBAR_SEARCH_DEBOUNCE_MS);
  }
}

// Result rows are appended in batches as the list is scrolled: a common term
// like "bitco" matches a thousand wallets, and rendering them all at once
// froze phones for seconds. The sentinel row at the end of the list requests
// the next batch when it scrolls into view.
const SEARCH_RESULTS_FIRST_BATCH = 12;
const SEARCH_RESULTS_BATCH = 20;
const SEARCH_RESULTS_EAGER_IMAGES = 6;
let searchResultsObserver = null;

function stopSearchResultsBatches () {
  if (searchResultsObserver) {
    searchResultsObserver.disconnect();
    searchResultsObserver = null;
  }
}

function makeSearchResultRowsHTML (wallets, from, to) {
  let html = '';
  for (let i = from; i < to; i++) {
    const wallet = wallets[i];
    const lazyLoad = i >= SEARCH_RESULTS_EAGER_IMAGES;
    const compactedResults = makeCompactResultsHTML(wallet, lazyLoad);
    html += `<li class="actionable"><div>${compactedResults}</div></li>`;
  }
  return html;
}

function renderSearchResults (result, wallets) {
  stopSearchResultsBatches();
  let rendered = Math.min(SEARCH_RESULTS_FIRST_BATCH, wallets.length);
  result.innerHTML = makeSearchResultRowsHTML(wallets, 0, rendered);
  if (rendered >= wallets.length) return;

  const sentinel = document.createElement('li');
  sentinel.className = 'search-results-more';
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.height = '1px';
  result.append(sentinel);

  const appendBatch = () => {
    const to = Math.min(rendered + SEARCH_RESULTS_BATCH, wallets.length);
    sentinel.insertAdjacentHTML('beforebegin', makeSearchResultRowsHTML(wallets, rendered, to));
    rendered = to;
    if (rendered >= wallets.length) {
      stopSearchResultsBatches();
      sentinel.remove();
    } else if (searchResultsObserver) {
      // re-observing reports the current state, so a sentinel still in view
      // (short rows on a tall screen) requests the next batch without a scroll
      searchResultsObserver.unobserve(sentinel);
      searchResultsObserver.observe(sentinel);
    }
  };

  if (!('IntersectionObserver' in window)) {
    while (rendered < wallets.length) appendBatch();
    return;
  }
  searchResultsObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) appendBatch();
  }, { root: result, rootMargin: '200px 0px' });
  searchResultsObserver.observe(sentinel);
}

function doNavBarSearch (input) {
  document.body.classList.add('search-ui-active');
  const result = document.querySelector('.results-target');
  result.classList.add('visible');
  const term = input.toUpperCase();

  const minTermLength = 1;
  if (term.length > minTermLength) {
    const wallets = performSearch(versionTaggedWallets, term).filter((wallet) => wallet.title);

    if (wallets.length === 0) {
      stopSearchResultsBatches();
      result.innerHTML = '<li onclick="event.stopPropagation();"><a style="font-size:.7rem;opacity:.7;text-style:italics;">No matches</a></li>';
    } else {
      renderSearchResults(result, wallets);
    }
    document.querySelector('.search-controls').classList.remove('working');

  } else if (term.length !== 0) {
    var l = document.createElement('li');
    var rem = (minTermLength + 1) - term.length;
    var s = rem > 1 ? 's' : '';
    l.innerHTML = `<a style='font-size:.7rem;opacity:.7;text-style:italics;'>Enter ${rem} more character${s} to search all records</a>`;
    result.append(l);
  } else {
    document.querySelector('.search-controls').classList.remove('working');
    result.innerHTML = '';
  }
  searchScrollToTop();
}

function getWalletIconFolder (wallet) {
  return wallet.iconFolder || wallet.folder;
}

function getWalletStoreAppId (wallet) {
  return wallet.storeAppId || wallet.appId;
}

function getWalletStorePlatform (wallet) {
  return wallet.storePlatform || wallet.folder;
}

function getWalletVerdictList (wallet) {
  const list = [];
  if (wallet.verdictAndroid) list.push(wallet.verdictAndroid);
  if (wallet.verdictIphone) list.push(wallet.verdictIphone);
  if (!list.length && wallet.verdict) list.push(wallet.verdict);
  return list;
}

function getPrimaryWalletVerdict (wallet) {
  const list = getWalletVerdictList(wallet);
  if (!list.length) return wallet.verdict || '';
  return list.reduce((best, v) => {
    const vi = verdictOrder.indexOf(v);
    const bi = verdictOrder.indexOf(best);
    if (vi >= 0 && (bi < 0 || vi < bi)) return v;
    return best;
  }, list[0]);
}

function walletHasVerdict (wallet, verdict) {
  return getWalletVerdictList(wallet).includes(verdict);
}

function renderStamp (key, text) {
  const v = window.verdicts?.[key];
  if (!v) return '';
  const title = (v.title || '').replace(/"/g, '&quot;');
  const color = v.color ? ` style="--verdict-color:${v.color}"` : '';
  return `<span data-text="${text}" class="stamp stamp-${key}" title="${title}"${color}></span>`;
}

function shouldShowVerdictStamp (verdict, meta) {
  if (!verdict) return false;
  return !(verdict === 'wip' && meta === 'removed');
}

function renderVerdictStamp (verdict, suffix, meta) {
  if (!window.verdicts?.[verdict] || !shouldShowVerdictStamp(verdict, meta)) return '';
  const text = suffix ? `${window.verdicts[verdict].short} (${suffix})` : window.verdicts[verdict].short;
  return renderStamp(verdict, text);
}

function getWalletVerdictStampsHtml (wallet, platformFilter) {
  if (wallet.verdictAndroid || wallet.verdictIphone) {
    const showAndroid = !platformFilter || platformFilter === 'android';
    const showIphone = !platformFilter || platformFilter === 'iphone';
    const va = showAndroid ? wallet.verdictAndroid : '';
    const vi = showIphone ? wallet.verdictIphone : '';
    const ma = showAndroid ? wallet.metaAndroid : '';
    const mi = showIphone ? wallet.metaIphone : '';
    if (va && vi && va === vi) {
      const showA = shouldShowVerdictStamp(va, ma);
      const showI = shouldShowVerdictStamp(vi, mi);
      if (!showA && !showI) return '';
      return renderVerdictStamp(va);
    }
    const dual = va && vi && va !== vi;
    const parts = [];
    if (va) parts.push(renderVerdictStamp(va, dual ? 'Android' : null, ma));
    if (vi) parts.push(renderVerdictStamp(vi, dual ? 'iPhone' : null, mi));
    return parts.join('');
  }
  return renderVerdictStamp(wallet.verdict, null, wallet.meta);
}

function getScoreText (score) {
  if (!score) return '';
  return score.numerator !== score.denominator
    ? `Passed ${score.numerator} of ${score.denominator} tests`
    : `Passed all ${score.denominator} tests`;
}

function scoresAreEqual (a, b) {
  if (!a || !b) return false;
  return a.numerator === b.numerator && a.denominator === b.denominator;
}

// "Passed n of m tests" lines, one per platform when the platforms differ;
// the cards show no test bars
function getWalletScoreBlockHtml (wallet, platformFilter) {
  if (!wallet.scoreAndroid && !wallet.scoreIphone) {
    return wallet.score ? `<span>${getScoreText(wallet.score)}</span>` : '';
  }
  const scoreAndroid = platformFilter !== 'iphone' ? wallet.scoreAndroid : null;
  const scoreIphone = platformFilter !== 'android' ? wallet.scoreIphone : null;
  if (scoresAreEqual(scoreAndroid, scoreIphone)) return `<span>${getScoreText(scoreAndroid)}</span>`;
  const dual = wallet.verdictAndroid && wallet.verdictIphone && wallet.verdictAndroid !== wallet.verdictIphone;
  const line = (score, label) => (score ? `<span>${dual ? `${label}: ` : ''}${getScoreText(score)}</span>` : '');
  return line(scoreAndroid, 'Android') + line(scoreIphone, 'iPhone');
}

function getPlatformStoreLabel (platform) {
  return platform === 'iphone' ? 'App Store' : 'Play Store';
}

// wallet cards say "Reproducible build"; the shared getStatusText wording
// stays for the verification tables and modals
function getCardStatusHtml (status) {
  return status === 'reproducible' ? '✅ Reproducible build' : '❌ ' + getStatusText(status, true);
}

// a mobile build with no verification counts as not verifiable; on the
// other platforms it is only not verified yet
function getUnverifiedHtml (platform) {
  return platform === 'android' || platform === 'iphone' ? '❌ Build not verifiable' : '❓ Not verified yet';
}

function getWalletVerificationHtmlForPlatform (wallet, platform) {
  if (!window.allAssetInformation) return '';
  const verdict = platform === 'android' ? wallet.verdictAndroid : wallet.verdictIphone;
  const appId = platform === 'android' ? wallet.androidAppId : wallet.iphoneAppId;
  if (verdict !== 'sourceavailable' || !appId) return '';
  const status = getLastVerificationStatusForAppId(appId, platform);
  if (!status) {
    return `<span>${getUnverifiedHtml(platform)}</span>`;
  }
  return `<span>${getCardStatusHtml(status)}</span>`;
}

function getWalletVerificationLinesHtml (wallet, platformFilter) {
  if (!window.allAssetInformation) return '';
  const lines = [];
  const addLine = (verdict, appId, platform, label) => {
    if (verdict !== 'sourceavailable' || !appId) return;
    const status = getLastVerificationStatusForAppId(appId, platform);
    const prefix = label ? `${label}: ` : '';
    if (!status) {
      lines.push(`<span>${prefix}${getUnverifiedHtml(platform)}</span>`);
      return;
    }
    lines.push(`<span>${prefix}${getCardStatusHtml(status)}</span>`);
  };
  if (wallet.verdictAndroid || wallet.verdictIphone) {
    addLine(wallet.verdictAndroid, wallet.androidAppId, 'android', wallet.verdictAndroid !== wallet.verdictIphone ? 'Android' : null);
    addLine(wallet.verdictIphone, wallet.iphoneAppId, 'iphone', wallet.verdictAndroid !== wallet.verdictIphone ? 'iPhone' : null);
    return lines.join('<br>');
  }
  if (walletHasVerdict(wallet, 'sourceavailable')) {
    const target = getVerificationTarget(wallet, platformFilter);
    addLine('sourceavailable', target.appId, target.platform, null);
  }
  return lines.join('<br>');
}

function walletHasAndroidStore (wallet) {
  return Boolean(wallet.hasAndroid || wallet.androidAppId);
}

function walletHasIphoneStore (wallet) {
  return Boolean(wallet.hasIphone || wallet.iphoneAppId);
}

function walletPlatformSections (wallet, platformFilter) {
  if (wallet.folder !== 'mobile') return [];
  const sections = [];
  const filter = platformFilter || 'allPlatforms';
  if (walletHasAndroidStore(wallet) && (filter === 'allPlatforms' || filter === 'android')) {
    sections.push('android');
  }
  if (walletHasIphoneStore(wallet) && (filter === 'allPlatforms' || filter === 'iphone')) {
    sections.push('iphone');
  }
  return sections;
}

function renderWalletPlatformMetaStamp (wallet, platform) {
  const meta = platform === 'android' ? wallet.metaAndroid : wallet.metaIphone;
  if (!meta || meta === 'ok' || !window.verdicts?.[meta]) return '';
  return renderStamp(meta, window.verdicts[meta].short);
}

function getWalletPlatformMeta (wallet, platform) {
  return platform === 'android' ? wallet.metaAndroid : wallet.metaIphone;
}

// meta before verdict stamp, in one line when they fit
function getWalletPlatformStampsHtml (wallet, platform) {
  const verdict = platform === 'android' ? wallet.verdictAndroid : wallet.verdictIphone;
  return renderWalletPlatformMetaStamp(wallet, platform) +
    renderVerdictStamp(verdict, null, getWalletPlatformMeta(wallet, platform));
}

function getWalletPlatformHeadHtml (platform) {
  return `<div class="wallet-platform-row__head">${getIcon(platform)}<span>${getPlatformStoreLabel(platform)}</span></div>`;
}

// Card lines run: platform, stamps, tests, verification. Rows are built
// without template indentation, as there are hundreds of them.
function renderWalletPlatformSection (wallet, platform) {
  const score = platform === 'android' ? wallet.scoreAndroid : wallet.scoreIphone;
  const stamps = getWalletPlatformStampsHtml(wallet, platform);
  const body = (score ? `<span>${getScoreText(score)}</span>` : '') + getWalletVerificationHtmlForPlatform(wallet, platform);
  return '<div class="wallet-platform-row">' + getWalletPlatformHeadHtml(platform) +
    (stamps ? `<div class="stamps">${stamps}</div>` : '') +
    (body ? `<div class="score">${body}</div>` : '') +
    '</div>';
}

function getWalletSharedStampsHtml (wallet) {
  return (wallet.archived ? '<span class="stamp stamp-archived">Wallet Archived</span>' : '') +
    (wallet.alertFeatures || []).map((f) =>
      `<span data-text="${window.featureAlerts[f] || f}" class="stamp stamp-alert-feature" title="${window.featureAlertMessages[f] || 'This feature has custody implications'}"></span>`
    ).join('');
}

function getWalletMetaStampHtml (wallet) {
  return wallet.meta && wallet.meta !== 'ok' ? renderStamp(wallet.meta, window.verdicts[wallet.meta].short) : '';
}

function shouldUseWalletPlatformSections (wallet, platforms, listPlatform) {
  // one layout for all mobile wallets: single-platform ones get the same
  // store-header section as dual-platform ones instead of a flat row with
  // an "Android:" text prefix
  return wallet.folder === 'mobile' && platforms.length > 0;
}

function getWalletCardDetailsHtml (wallet, platformFilter) {
  const listPlatform = platformFilter && platformFilter !== 'allPlatforms' ? platformFilter : false;
  const platforms = walletPlatformSections(wallet, listPlatform);

  if (shouldUseWalletPlatformSections(wallet, platforms, listPlatform)) {
    const shared = getWalletSharedStampsHtml(wallet);
    return '<div class="wallet-details wallet-details--by-platform">' +
      (shared ? `<div class="stamps stamps--shared">${shared}</div>` : '') +
      platforms.map((p) => renderWalletPlatformSection(wallet, p)).join('') +
      '</div>';
  }

  const score = getWalletScoreBlockHtml(wallet, listPlatform) + getWalletVerificationLinesHtml(wallet, listPlatform);
  return '<div class="wallet-details">' +
    `<div class="stamps">${getWalletSharedStampsHtml(wallet)}${getWalletMetaStampHtml(wallet)}${getWalletVerdictStampsHtml(wallet, listPlatform)}</div>` +
    (score ? `<div class="score">${score}</div>` : '') +
    '</div>';
}

function getVerificationTarget (wallet, platformFilter) {
  if (platformFilter === 'iphone' && wallet.iphoneAppId) {
    return { appId: wallet.iphoneAppId, platform: 'iphone' };
  }
  if (platformFilter === 'android' && wallet.androidAppId) {
    return { appId: wallet.androidAppId, platform: 'android' };
  }
  return {
    appId: getWalletStoreAppId(wallet),
    platform: getWalletStorePlatform(wallet)
  };
}

function getWalletListIcon (wallet, platformFilter) {
  if (platformFilter === 'android' || platformFilter === 'iphone') {
    return getIcon(platformFilter);
  }
  if (wallet.folder === 'mobile') {
    return getIcon('mobile');
  }
  return getIcon(wallet.folder);
}

function getWalletListCategory (wallet, platformFilter) {
  if (platformFilter === 'android') {
    return 'Play Store';
  }
  if (platformFilter === 'iphone') {
    return 'App Store';
  }
  return wallet.archived ? wallet.folder : wallet.category;
}

// Returns the icon markup for a platform: sprite icons via wsIcon() (global from site_main),
// custom font icons (i-*) as before.
function getIcon (name) {
  switch (name) {
    case 'all': return '<i class="i-all-devices" aria-hidden="true"></i>';
    case 'mobile': return wsIcon('mobile-screen');
    case 'android': return wsIcon('google-play');
    case 'iphone': return '<i class="i-app-store" aria-hidden="true"></i>';
    case 'hardware': return wsIcon('toolbox');
    case 'bearer': return '<i class="i-btc" aria-hidden="true"></i>';
    case 'desktop': return wsIcon('desktop');
    case 'others': return wsIcon('calculator');
  }
  return '';
}

function makeCompactResultsHTML (wallet, lazyLoad, platformFilter) {
  const faCollection = getWalletListIcon(wallet, platformFilter);
  const basePath = wallet.base_path || '';
  const analysisUrl = `${basePath}${wallet.url}`;
  const listPlatform = platformFilter && platformFilter !== 'allPlatforms' ? platformFilter : false;

  const platforms = walletPlatformSections(wallet, listPlatform);
  let statsHTML = '';

  if (shouldUseWalletPlatformSections(wallet, platforms, listPlatform)) {
    const shared = getWalletSharedStampsHtml(wallet);
    const sections = platforms.map((p) => {
      const score = p === 'android' ? wallet.scoreAndroid : wallet.scoreIphone;
      const stamps = getWalletPlatformStampsHtml(wallet, p);
      return '<div class="wallet-platform-row wallet-platform-row--compact">' + getWalletPlatformHeadHtml(p) +
        (stamps ? `<span class="stats-platform-stamps">${stamps}</span>` : '') +
        (score ? `<span>${getScoreText(score)}</span>` : '') +
        (wallet.archived ? '' : getWalletVerificationHtmlForPlatform(wallet, p)) +
        '</div>';
    }).join('');
    statsHTML = `<span class="stats stats--by-platform">${shared ? `<span class="stats-shared">${shared}</span>` : ''}${sections}</span>`;
  } else {
    statsHTML = '<span class="stats">' +
      getWalletSharedStampsHtml(wallet) +
      getWalletMetaStampHtml(wallet) +
      getWalletVerdictStampsHtml(wallet, listPlatform) +
      getWalletScoreBlockHtml(wallet, listPlatform) +
      (wallet.archived ? '' : getWalletVerificationLinesHtml(wallet, platformFilter)) +
      '</span>';
  }

  const url = wallet.archived ? '/archived/?appId=' + wallet.appId + '&platform=' + wallet.folder : analysisUrl;
  return `<a class="result-pl-inner ${wallet.meta}" onclick="window.location.href = '${url}';" href="${url}">` +
    `<div class="icon-wrapper"><img src="${basePath}/images/${wallet.icon ? `wIcons/${getWalletIconFolder(wallet)}/small/${wallet.icon}` : 'noimg.svg'}" class="wallet-icon"${lazyLoad ? ' loading="lazy"' : ''}></div>` +
    `<span class="result-title-wrapper"><span>${wallet.altTitle || wallet.title}</span>` +
    `<small><span class="category">${faCollection}&nbsp;<span> ${getWalletListCategory(wallet, platformFilter)}</span></span></small></span>` +
    statsHTML +
    '</a>';
}

function searchScrollToTop () {
  if (window.innerWidth <= 700) {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }
}

// Event listeners and initialization
window.addEventListener('resize', () => {
  if (window.outerWidth <= 700) {
    exitSearchUI();
  }
});

const versionTaggedWallets = [];

window.versionTag = () => {
  versionTaggedWallets.length = 0;
  walletSearchTextCache = new WeakMap();
  const seenAppIds = new Set();
  window.wallets.forEach(e => {
    if (e.appId && e.appId.length > 0 && !seenAppIds.has(e.appId)) {
      seenAppIds.add(e.appId);
      versionTaggedWallets.push(e);
    }
  });
  warmWalletSearchTextCache(versionTaggedWallets);
};

if (document.querySelector('.searchbar')) {
  document.body.addEventListener('click', () => {
    exitSearchUI();
  });

  const searchControlsElement = document.querySelector('.search-controls');
  if (searchControlsElement) {
    searchControlsElement.addEventListener('click', function(event) {
      const resetButton = event.target.closest('.reset-search');
      if (resetButton && this.contains(resetButton)) {
        event.stopPropagation();
        window.searchTerm = '';
        const searchbar = document.querySelector('.searchbar');
        if (searchbar) {
          searchbar.value = '';
        }
        document.querySelector('.wallet-search').classList.remove('active');
        this.classList.remove('working');
        this.classList.remove('edited');
        exitSearchUI();
      }
    });
  }

  document.querySelector('.searchbar').value = '';
  document.querySelector('.searchbar').addEventListener('input', () => {
    window.searchTerm = document.querySelector('.searchbar').value;
    searchTrigger();
  });
  document.querySelector('.searchbar').addEventListener('keyup', (e) => {
    if (e.key === 'Enter' || e.keyCode === 13) {
      window.searchTerm = document.querySelector('.searchbar').value;
      searchTrigger(true);
    }
  });
  document.querySelector('.mobile-search-shortcut').addEventListener('click', () => {
    if (!document.querySelector('.wallet-search').classList.contains('mobile-active')) {
      // the open menu dropdown would cover the search box
      const menuToggle = document.querySelector('.greedy-nav__toggle.close');
      if (menuToggle) menuToggle.click();
      document.querySelector('.wallet-search').classList.add('mobile-active');
      document.querySelector('.mobile-search-shortcut').classList.add('active');
      document.querySelector('.searchbar').focus();
    } else {
      document.querySelector('.wallet-search').classList.remove('mobile-active');
      document.querySelector('.mobile-search-shortcut').classList.remove('active');
    }
  });
}

window.versionTag();
