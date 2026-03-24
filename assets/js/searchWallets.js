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

function performSearch (wallets, query = false, platform = false) {
  const verdictOrder = ['sourceavailable', 'diy', 'nosource', 'custodial', 'ecash', 'nosendreceive', 'sealed-noita', 'noita', 'sealed-plainkey', 'plainkey', 'obfuscated', 'prefilled', 'fake', 'wip', 'fewusers', 'unreleased', 'vapor', 'nobtc', 'nowallet'];
  const platformOrder = ['hardware', 'desktop', 'android', 'iphone', 'bearer', 'others'];
  const metaOrder = ['ok', 'discontinued', 'deprecated', 'stale', 'obsolete', 'removed', 'defunct'];

  // Extract f:key tokens from query
  const { featureKeys, remainingQuery } = parseFeatureTokens(query || '');
  const textQuery = remainingQuery.length > 0 ? remainingQuery : false;

  const workingArray = [];
  let walletsTemp = false;
  if (platform && platformOrder.includes(platform)) {
    walletsTemp = wallets.filter(function (w) {
      return w.folder === platform;
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
    if (a.verdict !== b.verdict && a.verdict && b.verdict) {
      return verdictOrder.indexOf(a.verdict) - verdictOrder.indexOf(b.verdict);
    }
    if (a.meta !== b.meta && a.meta && b.meta) {
      return metaOrder.indexOf(a.meta) - metaOrder.indexOf(b.meta);
    }
    if (a.verdict === 'sourceavailable' && b.verdict === 'sourceavailable') {
      try {
        if (!window.allAssetInformation) {
          return 0;
        }

        const resultA = getWeightForAppFromAssetInformation(a.appId);
        const aWeight = resultA.weight;
        const aLastVersionVerified = resultA.lastVersionVerified;

        const resultB = getWeightForAppFromAssetInformation(b.appId);
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

function getIcon (name) {
  let faCollection = ''
  switch (name) {
    case 'all': faCollection = 'i-all-devices'; break;
    case 'android': faCollection = 'fab fa-google-play'; break;
    case 'iphone': faCollection = 'i-app-store'; break;
    case 'hardware': faCollection = 'fas fa-toolbox'; break;
    case 'bearer': faCollection = 'i-btc'; break;
    case 'desktop': faCollection = 'fas fa-desktop'; break;
    case 'others': faCollection = 'fas fa-calculator'; break;
  }
  return faCollection;
}

function makeCompactResultsHTML (wallet, lazyLoad) {
  const faCollection = getIcon(wallet.folder);
  const basePath = wallet.base_path || '';
  const analysisUrl = `${basePath}${wallet.url}`;
  
  let scoreHTML = '';
  if (wallet.score) {
    const passCount = wallet.score.numerator;
    const failCount = wallet.score.denominator - wallet.score.numerator;
    
    const passIcons = '<i class="pass"></i>'.repeat(passCount);
    const failIcons = '<i class="fail"></i>'.repeat(failCount);
    
    const scoreText = passCount !== wallet.score.denominator 
      ? `Passed ${passCount} of ${wallet.score.denominator} tests`
      : `Passed all ${wallet.score.denominator} tests`;
    
    scoreHTML = `<div class="tests-passed" data-numerator="${passCount}" data-denominator="${wallet.score.denominator}">
      <span>${scoreText}</span>
      <div>${passIcons}${failIcons}</div>
    </div>`;
  }

  let verificationHTML = '';
  if (wallet.verdict === 'sourceavailable' && window.allAssetInformation) {
    const lastVerificationStatus = getLastVerificationStatusForAppId(wallet.appId, wallet.folder);
    if (lastVerificationStatus) {
      const statusIcon = lastVerificationStatus === 'reproducible' ? '✅ ' : '❌ ';
      verificationHTML = `<span>${statusIcon}${getStatusText(lastVerificationStatus, true)}</span>`;
    } else {
      verificationHTML = '<span>❓ Not verified yet</span>';
    }
  }

  const url = wallet.archived ? '/archived/?appId=' + wallet.appId + '&platform=' + wallet.folder : analysisUrl;
  return [
    `<a class="result-pl-inner ${wallet.meta}" onclick="window.location.href = '${url}';" href='${url}'>`,
      `<div class="icon-wrapper"><img src='${basePath}/images/${wallet.icon ? `wIcons/${wallet.folder}/small/${wallet.icon}` : 'noimg.svg'}' class='wallet-icon' ${lazyLoad ? 'loading="lazy"' : ''} /></div>`,
      '<span class="result-title-wrapper">',
        `<span>${wallet.altTitle || wallet.title}</span>`,
        '<small>',
          `<span class="category"><i class="${faCollection}"></i>&nbsp;<span> ${wallet.archived ? wallet.folder : wallet.category}</span></span>`,
        '</small>',
      '</span>',
      '<span class="stats">',
        wallet.archived ? '<span class="stamp stamp-archived">Wallet Archived</span>' : '',
        `<span data-text="${window.verdicts[wallet.verdict].short}" class="stamp stamp-${wallet.verdict}" alt=""></span>`,
        wallet.archived ? '' : verificationHTML,
        wallet.meta && wallet.meta !== 'ok'
          ? `<span data-text="${window.verdicts[wallet.meta].short}" class="stamp stamp-${wallet.meta}" alt=""></span>`
          : '',
        wallet.alertFeatures && wallet.alertFeatures.length > 0
          ? wallet.alertFeatures.map(f => `<span data-text="${window.featureAlerts[f] || f}" class="stamp stamp-alert-feature" title="${window.featureAlertMessages[f] || 'This feature has custody implications'}" alt=""></span>`).join('')
          : '',
        scoreHTML,
      '</span>',
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
