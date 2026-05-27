const verdictOrder = ['sourceavailable', 'diy', 'nosource', 'custodial', 'ecash', 'nosendreceive', 'sealed-noita', 'noita', 'sealed-plainkey', 'plainkey', 'obfuscated', 'prefilled', 'fake', 'wip', 'unreleased', 'vapor', 'nobtc', 'nowallet'];
const platformOrder = ['hardware', 'desktop', 'android', 'iphone', 'mobile', 'bearer', 'others'];
const metaOrder = ['ok', 'discontinued', 'deprecated', 'stale', 'obsolete', 'removed', 'defunct', 'fewusers'];

// Core search functions
function searchByWords(query, wallet) {
  const searchTermWords = query.length > 0 ? query.split(" ") : false;
  const walletTitleUpper = String(wallet.title || '').toUpperCase();
  let walletAsStr = '';
  for (const [key, value] of Object.entries(wallet)) {
    walletAsStr += `${wallet.altTitle}${JSON.stringify(value)}${key}`;
  }
  walletAsStr = `${wallet.title}${walletAsStr}`;
  walletAsStr = String(walletAsStr).toUpperCase();

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
    if (walletAsStr.indexOf(word3) >= 0) {
      result = wallet;
      wallet.matchRank = walletAsStr.indexOf(word3);
      wallet.matchData = "word3 " + word3;
      break;
    }
    if (walletAsStr.indexOf(word2) >= 0) {
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
    return (wallet.folder === 'mobile' && wallet.hasAndroid) || wallet.folder === 'android';
  }
  if (platform === 'iphone') {
    return (wallet.folder === 'mobile' && wallet.hasIphone) || wallet.folder === 'iphone';
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
  ui.innerHTML = '';
  ui.classList.remove('visible');
  document.body.classList.remove('search-ui-active');
  document.querySelector('.wallet-search').classList.remove('active');
}

function searchTrigger () {
  if (window.searchTerm && window.searchTerm.length > 1) {
    document.querySelector('.wallet-search').classList.add('active');
    document.querySelector('.search-controls').classList.add('working');
    document.querySelector('.search-controls').classList.add('edited');
  } else {
    document.querySelector('.wallet-search').classList.remove('active');
    document.querySelector('.search-controls').classList.remove('working');
    document.querySelector('.search-controls').classList.remove('edited');
  }

  if (window.searchTerm) {
    doNavBarSearch(window.searchTerm);
  }
}

async function doNavBarSearch (input) {
  document.body.classList.add('search-ui-active');
  const result = document.querySelector('.results-target');
  result.classList.add('visible');
  const term = input.toUpperCase();

  const minTermLength = 1;
  if (term.length > minTermLength) {
    result.innerHTML = '';

    const wallets = performSearch(versionTaggedWallets, term);

    if (!wallets || wallets.length === 0) {
      result.innerHTML = '<li onclick="event.stopPropagation();"><a style="font-size:.7rem;opacity:.7;text-style:italics;">No matches</a></li>';
      document.querySelector('.search-controls').classList.remove('working');
    }

    const walletRows = [];
    let walletIndex = 0;
    const notLazyLoadFirstRows = 6;
    for (const wallet of wallets) {
      if (!wallet.title) continue;

      const walletRow = document.createElement('li');
      walletRow.classList.add('actionable');
      let compactedResults = makeCompactResultsHTML(wallet, walletIndex > notLazyLoadFirstRows);
      let walletGroupClass = '';
      if (wallet.versions?.length > 0) {
        for (let i = 0; i < wallet.versions.length; i++) {
          compactedResults += makeCompactResultsHTML(wallet.versions[i], walletIndex > notLazyLoadFirstRows);
        }
        walletGroupClass = 'grouped';
      }
      walletRow.innerHTML = `<div class="${walletGroupClass}">${compactedResults}</div>`;
      walletRows.push(walletRow);

      walletIndex++;
    }

    if (walletRows.length > 0) {
      result.append(...walletRows.slice(0, notLazyLoadFirstRows));
      await new Promise(resolve => setTimeout(resolve, 50));
      document.querySelector('.search-controls').classList.remove('working');
      await new Promise(resolve => setTimeout(resolve, 50));
      result.append(...walletRows.slice(notLazyLoadFirstRows));
    }

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

function renderVerdictStamp (verdict, suffix) {
  if (!verdict || !window.verdicts?.[verdict]) return '';
  const text = suffix ? `${window.verdicts[verdict].short} (${suffix})` : window.verdicts[verdict].short;
  return `<span data-text="${text}" class="stamp stamp-${verdict}" alt=""></span>`;
}

function getWalletVerdictStampsHtml (wallet, platformFilter) {
  if (wallet.verdictAndroid || wallet.verdictIphone) {
    const showAndroid = !platformFilter || platformFilter === 'android';
    const showIphone = !platformFilter || platformFilter === 'iphone';
    const va = showAndroid ? wallet.verdictAndroid : '';
    const vi = showIphone ? wallet.verdictIphone : '';
    if (va && vi && va === vi) {
      return renderVerdictStamp(va);
    }
    const dual = va && vi && va !== vi;
    const parts = [];
    if (va) parts.push(renderVerdictStamp(va, dual ? 'Android' : null));
    if (vi) parts.push(renderVerdictStamp(vi, dual ? 'iPhone' : null));
    return parts.join('');
  }
  return wallet.verdict ? renderVerdictStamp(wallet.verdict) : '';
}

function getWalletScoreIconsHtml (score) {
  if (!score) return { passed: '', failed: '', text: '' };
  let passed = '';
  let failed = '';
  for (let i = 0; i < score.numerator; i++) passed += '<i class="pass"></i>';
  for (let i = 0; i < (score.denominator - score.numerator); i++) failed += '<i class="fail"></i>';
  const text = `Passed ${score.numerator !== score.denominator ? score.numerator : 'all'} ${score.numerator !== score.denominator ? 'of' : ''} ${score.denominator} tests`;
  return { passed, failed, text };
}

function scoresAreEqual (a, b) {
  if (!a || !b) return false;
  return a.numerator === b.numerator && a.denominator === b.denominator;
}

function getWalletScoreBlockHtml (wallet, platformFilter) {
  if (wallet.scoreAndroid || wallet.scoreIphone) {
    const showAndroid = !platformFilter || platformFilter === 'android';
    const showIphone = !platformFilter || platformFilter === 'iphone';
    const scoreAndroid = showAndroid ? wallet.scoreAndroid : null;
    const scoreIphone = showIphone ? wallet.scoreIphone : null;
    const dual = wallet.verdictAndroid && wallet.verdictIphone && wallet.verdictAndroid !== wallet.verdictIphone;
    const sameScore = scoresAreEqual(scoreAndroid, scoreIphone);
    const rows = [];
    const addRow = (score, label) => {
      if (!score) return;
      const icons = getWalletScoreIconsHtml(score);
      const prefix = dual && label ? `<small>${label}: </small>` : '';
      rows.push(`${prefix}<span>${icons.text}</span><div>${icons.passed}${icons.failed}</div>`);
    };
    if (scoreAndroid && scoreIphone && sameScore) addRow(scoreAndroid);
    else {
      if (scoreAndroid) addRow(scoreAndroid, 'Android');
      if (scoreIphone) addRow(scoreIphone, 'iPhone');
    }
    return rows.join('<br>');
  }
  if (!wallet.score) return '';
  const icons = getWalletScoreIconsHtml(wallet.score);
  return `<span>${icons.text}</span><div>${icons.passed}${icons.failed}</div>`;
}

function getPlatformStoreLabel (platform) {
  return platform === 'iphone' ? 'App Store' : 'Play Store';
}

function getWalletVerificationHtmlForPlatform (wallet, platform) {
  if (!window.allAssetInformation) return '';
  const verdict = platform === 'android' ? wallet.verdictAndroid : wallet.verdictIphone;
  const appId = platform === 'android' ? wallet.androidAppId : wallet.iphoneAppId;
  if (verdict !== 'sourceavailable' || !appId) return '';
  const status = getLastVerificationStatusForAppId(appId, platform);
  if (!status) {
    return '<span>❓ Not verified yet</span>';
  }
  return `<span>${(status === 'reproducible' ? '✅ ' : '❌ ') + getStatusText(status, true)}</span>`;
}

function getWalletVerificationLinesHtml (wallet, platformFilter) {
  if (!window.allAssetInformation) return '';
  const lines = [];
  const addLine = (verdict, appId, platform, label) => {
    if (verdict !== 'sourceavailable' || !appId) return;
    const status = getLastVerificationStatusForAppId(appId, platform);
    const prefix = label ? `${label}: ` : '';
    if (!status) {
      lines.push(`<span>${prefix}❓ Not verified yet</span>`);
      return;
    }
    lines.push(`<span>${prefix}${(status === 'reproducible' ? '✅ ' : '❌ ') + getStatusText(status, true)}</span>`);
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
  return `<span data-text="${window.verdicts[meta].short}" class="stamp stamp-${meta}" alt=""></span>`;
}

function renderWalletPlatformSection (wallet, platform) {
  const verdict = platform === 'android' ? wallet.verdictAndroid : wallet.verdictIphone;
  const score = platform === 'android' ? wallet.scoreAndroid : wallet.scoreIphone;
  const stamps = [
    verdict ? renderVerdictStamp(verdict) : '',
    renderWalletPlatformMetaStamp(wallet, platform),
  ].filter(Boolean).join('');
  const verificationHtml = getWalletVerificationHtmlForPlatform(wallet, platform);
  let scoreHtml = '';
  if (score) {
    const icons = getWalletScoreIconsHtml(score);
    scoreHtml = `<span>${icons.text}</span><div>${icons.passed}${icons.failed}</div>`;
  }
  const body = [verificationHtml, scoreHtml].filter(Boolean).join('');
  return `
    <div class="wallet-platform-row">
      <div class="wallet-platform-row__head">
        <i class="${getIcon(platform)}" aria-hidden="true"></i>
        <span>${getPlatformStoreLabel(platform)}</span>
      </div>
      ${stamps ? `<div class="stamps">${stamps}</div>` : ''}
      ${body ? `<div class="score">${body}</div>` : ''}
    </div>`;
}

function getWalletSharedStampsHtml (wallet) {
  const parts = [];
  if (wallet.archived) {
    parts.push('<span class="stamp stamp-archived">Wallet Archived</span>');
  }
  if (wallet.alertFeatures?.length) {
    parts.push(
      wallet.alertFeatures.map((f) =>
        `<span data-text="${window.featureAlerts[f] || f}" class="stamp stamp-alert-feature" title="${window.featureAlertMessages[f] || 'This feature has custody implications'}" alt=""></span>`
      ).join('')
    );
  }
  return parts.join('');
}

function shouldUseWalletPlatformSections (wallet, platforms, listPlatform) {
  if (wallet.folder !== 'mobile' || platforms.length === 0) return false;
  return platforms.length > 1 || Boolean(listPlatform);
}

function getWalletCardDetailsHtml (wallet, platformFilter) {
  const listPlatform = platformFilter && platformFilter !== 'allPlatforms' ? platformFilter : false;
  const platforms = walletPlatformSections(wallet, listPlatform);
  const usePlatformSections = shouldUseWalletPlatformSections(wallet, platforms, listPlatform);

  if (usePlatformSections) {
    const shared = getWalletSharedStampsHtml(wallet);
    const sectionsHtml = platforms.map((p) => renderWalletPlatformSection(wallet, p)).join('');
    return `
      <div class="wallet-details wallet-details--by-platform">
        ${shared ? `<div class="stamps stamps--shared">${shared}</div>` : ''}
        ${sectionsHtml}
      </div>`;
  }

  const verificationHtml = getWalletVerificationLinesHtml(wallet, listPlatform);
  const verdictStampsHtml = getWalletVerdictStampsHtml(wallet, listPlatform);
  const scoreBlockHtml = getWalletScoreBlockHtml(wallet, listPlatform);
  const metaStamp = wallet.meta && wallet.meta !== 'ok'
    ? `<span data-text="${window.verdicts[wallet.meta].short}" class="stamp stamp-${wallet.meta}" alt=""></span>`
    : '';

  return `
    <div class="wallet-details">
      <div class="stamps">
        ${getWalletSharedStampsHtml(wallet)}
        ${verdictStampsHtml}
        ${metaStamp}
      </div>
      ${scoreBlockHtml || wallet.score || verificationHtml
        ? `<div class="score" data-numerator="${(wallet.score || wallet.scoreAndroid || wallet.scoreIphone || {}).numerator || 0}" data-denominator="${(wallet.score || wallet.scoreAndroid || wallet.scoreIphone || {}).denominator || 0}">
          ${verificationHtml}
          ${scoreBlockHtml || (wallet.score ? `<span>Passed ${wallet.score.numerator !== wallet.score.denominator ? wallet.score.numerator : 'all'} ${wallet.score.numerator !== wallet.score.denominator ? 'of' : ''} ${wallet.score.denominator} tests</span>` : '')}
        </div>`
        : ''}
    </div>`;
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

function getIcon (name) {
  let faCollection = ''
  switch (name) {
    case 'all': faCollection = 'i-all-devices'; break;
    case 'mobile': faCollection = 'fas fa-mobile-screen'; break;
    case 'android': faCollection = 'fab fa-google-play'; break;
    case 'iphone': faCollection = 'i-app-store'; break;
    case 'hardware': faCollection = 'fas fa-toolbox'; break;
    case 'bearer': faCollection = 'i-btc'; break;
    case 'desktop': faCollection = 'fas fa-desktop'; break;
    case 'others': faCollection = 'fas fa-calculator'; break;
  }
  return faCollection;
}

function makeCompactResultsHTML (wallet, lazyLoad, platformFilter) {
  const faCollection = getWalletListIcon(wallet, platformFilter);
  const basePath = wallet.base_path || '';
  const analysisUrl = `${basePath}${wallet.url}`;
  const listPlatform = platformFilter && platformFilter !== 'allPlatforms' ? platformFilter : false;

  let scoreHTML = '';
  const scoreBlock = getWalletScoreBlockHtml(wallet, listPlatform);
  if (scoreBlock) {
    const primaryScore = wallet.score || wallet.scoreAndroid || wallet.scoreIphone;
    const num = primaryScore?.numerator ?? 0;
    const den = primaryScore?.denominator ?? 0;
    scoreHTML = `<div class="tests-passed" data-numerator="${num}" data-denominator="${den}">
      ${scoreBlock}
    </div>`;
  }

  const platforms = walletPlatformSections(wallet, listPlatform);
  const usePlatformSections = shouldUseWalletPlatformSections(wallet, platforms, listPlatform);
  let statsHTML = '';

  if (usePlatformSections) {
    const shared = getWalletSharedStampsHtml(wallet);
    const sections = platforms.map((p) => {
      const verdict = p === 'android' ? wallet.verdictAndroid : wallet.verdictIphone;
      const score = p === 'android' ? wallet.scoreAndroid : wallet.scoreIphone;
      const stamps = [
        verdict ? renderVerdictStamp(verdict) : '',
        renderWalletPlatformMetaStamp(wallet, p),
      ].filter(Boolean).join('');
      const verificationHTML = wallet.archived ? '' : getWalletVerificationHtmlForPlatform(wallet, p);
      let sectionScoreHTML = '';
      if (score) {
        const icons = getWalletScoreIconsHtml(score);
        sectionScoreHTML = `<div class="tests-passed"><span>${icons.text}</span><div>${icons.passed}${icons.failed}</div></div>`;
      }
      return `
        <div class="wallet-platform-row wallet-platform-row--compact">
          <div class="wallet-platform-row__head">
            <i class="${getIcon(p)}" aria-hidden="true"></i>
            <span>${getPlatformStoreLabel(p)}</span>
          </div>
          ${stamps ? `<span class="stats-platform-stamps">${stamps}</span>` : ''}
          ${verificationHTML}
          ${sectionScoreHTML}
        </div>`;
    }).join('');
    statsHTML = `
      <span class="stats stats--by-platform">
        ${shared ? `<span class="stats-shared">${shared}</span>` : ''}
        ${sections}
      </span>`;
  } else {
    const verificationHTML = getWalletVerificationLinesHtml(wallet, platformFilter);
    statsHTML = `
      <span class="stats">
        ${wallet.archived ? '<span class="stamp stamp-archived">Wallet Archived</span>' : ''}
        ${getWalletVerdictStampsHtml(wallet, listPlatform)}
        ${wallet.archived ? '' : verificationHTML}
        ${wallet.meta && wallet.meta !== 'ok'
          ? `<span data-text="${window.verdicts[wallet.meta].short}" class="stamp stamp-${wallet.meta}" alt=""></span>`
          : ''}
        ${wallet.alertFeatures && wallet.alertFeatures.length > 0
          ? wallet.alertFeatures.map(f => `<span data-text="${window.featureAlerts[f] || f}" class="stamp stamp-alert-feature" title="${window.featureAlertMessages[f] || 'This feature has custody implications'}" alt=""></span>`).join('')
          : ''}
        ${scoreHTML}
      </span>`;
  }

  const url = wallet.archived ? '/archived/?appId=' + wallet.appId + '&platform=' + wallet.folder : analysisUrl;
  return [
    `<a class="result-pl-inner ${wallet.meta}" onclick="window.location.href = '${url}';" href='${url}'>`,
      `<div class="icon-wrapper"><img src='${basePath}/images/${wallet.icon ? `wIcons/${getWalletIconFolder(wallet)}/small/${wallet.icon}` : 'noimg.svg'}' class='wallet-icon' ${lazyLoad ? 'loading="lazy"' : ''} /></div>`,
      '<span class="result-title-wrapper">',
        `<span>${wallet.altTitle || wallet.title}</span>`,
        '<small>',
          `<span class="category"><i class="${faCollection}"></i>&nbsp;<span> ${getWalletListCategory(wallet, platformFilter)}</span></span>`,
        '</small>',
      '</span>',
      statsHTML,
    '</a>'
  ].join('');
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
  var readerRec = [];
  versionTaggedWallets.length = 0;
  window.wallets.forEach(e => {
    if (e.wsId) {
      const wsId = e.wsId;
      var i = readerRec.indexOf(wsId);
      if (wsId.length > 0 && i < 0) {
        versionTaggedWallets.push(e);
        readerRec.push(wsId);
      } else {
        // If we already added a product with this wsId, we add the new one as a
        // 'version' of the prior one.
        const versionsI = versionTaggedWallets[i].versions || [];
        versionsI.push(e);
        versionTaggedWallets[i].versions = versionsI;
      }
    } else if (e.appId && e.appId.length > 0) {
      // making sure the appId doesn't match any wsId:
      const appId = `__${e.appId}__`;
      if (!readerRec.includes(appId)) {
        versionTaggedWallets.push(e);
        readerRec.push(appId);
      }
    }
  });
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
      searchTrigger();
    }
  });
  document.querySelector('.mobile-search-shortcut').addEventListener('click', () => {
    if (!document.querySelector('.wallet-search').classList.contains('mobile-active')) {
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
