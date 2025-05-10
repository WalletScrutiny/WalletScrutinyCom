// Core search functions
function searchByWords(query, wallet) {
  const searchTermWords = query.length > 0 ? query.split(" ") : false;
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
    if (wallet.title.indexOf(word4) >= 0) {
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
      wallet.matchRank = walletAsStr.indexOf(word4);
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

function performSearch (wallets, query = false, platform = false) {
  const verdictOrder = ['sourceavailable', 'diy', 'nosource', 'custodial', 'nosendreceive', 'sealed-noita', 'noita', 'sealed-plainkey', 'plainkey', 'obfuscated', 'prefilled', 'fake', 'wip', 'fewusers', 'unreleased', 'vapor', 'nobtc', 'nowallet'];
  const platformOrder = ['hardware', 'desktop', 'android', 'iphone', 'bearer', 'others'];
  const metaOrder = ['ok', 'discontinued', 'deprecated', 'stale', 'obsolete', 'removed', 'defunct'];

  const workingArray = [];
  let walletsTemp = false;
  if (platform && platformOrder.includes(platform)) {
    walletsTemp = wallets.filter(function (w) {
      return w.folder === platform;
    });
  } else {
    walletsTemp = wallets;
  }

  for (const wallet of walletsTemp) {
    if (query && query.length > 0) {
      const result = searchByWords(query, wallet);
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
    if (a.folder !== b.folder) {
      return platformOrder.indexOf(a.folder) - platformOrder.indexOf(b.folder);
    }
    if (a.users !== b.users) {
      return b.users - a.users;
    }
    if (a.ratings !== b.ratings) {
      return b.ratings - a.ratings;
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

  clearTimeout(window.walletSearchTimeoutTrigger);
  if (window.searchTerm && window.searchTerm.length > 1) {
    window.walletSearchTimeoutTrigger = setTimeout(() => {
      doNavBarSearch(window.searchTerm);
    }, 200);
  }
}

function doNavBarSearch (input) {
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
    for (const wallet of wallets) {
      if (wallet.title) {
        const walletRow = document.createElement('li');
        if (wallets.length < 10) {
          walletRow.style['animation-delay'] = wallets.length * 80 + 'ms';
        }
        walletRow.classList.add('actionable');
        let compactedResults = '';
        compactedResults += makeCompactResultsHTML(wallet);
        var walletGroupClass = '';
        if (wallet.versions && wallet.versions.length > 0) {
          for (let i = 0; i < wallet.versions.length; i++) {
            compactedResults += makeCompactResultsHTML(wallet.versions[i]);
          }
          walletGroupClass = 'grouped';
        }
        walletRow.innerHTML = `<div class="${walletGroupClass}">${compactedResults}</div>`;
        document.querySelector('.search-controls').classList.remove('working');
        result.append(walletRow);
      }
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

function makeCompactResultsHTML (wallet) {
  let result = '';
  const faCollection = getIcon(wallet.folder);
  const basePath = wallet.base_path || '';
  var analysisUrl = `${basePath}${wallet.url}`;
  let passed = '';
  let failed = '';
  if (wallet.score) {
    for (let i = 0; i < wallet.score.numerator; i++) { passed += '<i class="pass"></i>'; }
    for (let i = 0; i < (wallet.score.denominator - wallet.score.numerator); i++) { failed += '<i class="fail"></i>'; }
  }
  result += `<a class="result-pl-inner ${wallet.meta}" onclick="window.location.href = '${analysisUrl}';" href='${analysisUrl}'>
    <div class="icon-wrapper"><img src='${basePath}/images/${wallet.icon ? `wIcons/${wallet.folder}/small/${wallet.icon}` : 'noimg.svg'}' class='wallet-icon' loading="lazy"/></div>
      <span class="result-title-wrapper">
        <span>${wallet.altTitle || wallet.title}</span>
        <small>
          <span class="category"><i class="${faCollection}"></i>&nbsp;<span> ${wallet.category}</span></span>
        </small>
      </span>
      <span class="stats">
        <span data-text="${window.verdicts[wallet.verdict].short}" class="stamp stamp-${wallet.verdict}" alt=""></span>
      ${wallet.meta && wallet.meta !== 'ok'
        ? `<span data-text="${window.verdicts[wallet.meta].short}" class="stamp stamp-${wallet.meta}" alt=""></span>`
        : ''}
      ${wallet.score
        ? `<div class="tests-passed" data-numerator="${wallet.score.numerator}" data-denominator="${wallet.score.denominator}">
          <span>Passed ${wallet.score.numerator !== wallet.score.denominator ? wallet.score.numerator : 'all'} ${wallet.score.numerator !== wallet.score.denominator ? 'of' : ''} ${wallet.score.denominator} tests</span>
          <div>${passed}${failed}</div>
        </div>`
        : ''}
    </span>
    </a>`;
  return result;
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
  document.querySelector('.reset-search').addEventListener('click', (event) => {
    event.stopPropagation();
    window.searchTerm = '';
    document.querySelector('.searchbar').value = '';
    document.querySelector('.search-controls').classList.remove('hint-return');
    document.querySelector('.wallet-search').classList.remove('active');
    document.querySelector('.search-controls').classList.remove('working');
    document.querySelector('.search-controls').classList.remove('edited');
    exitSearchUI();
  });
  document.querySelectorAll('.search-trigger-target').forEach((ele) => {
    ele.addEventListener('click', (event) => {
      event.stopPropagation();
      searchTrigger();
    });
  });
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
  document.querySelector('.searchbar').addEventListener('click', (event) => {
    event.stopPropagation();
    if (window.searchTerm && window.searchTerm.length > 0) {
      document.querySelector('.search-controls').classList.add('hint-return');
    } else {
      document.querySelector('.search-controls').classList.remove('hint-return');
    }
  });
}

window.versionTag();
