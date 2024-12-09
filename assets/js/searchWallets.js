// Constants
const CONSTANTS = {
  MIN_SEARCH_LENGTH: 1,
  SEARCH_DELAY: 200,
  MOBILE_WIDTH: 700,
  ANIMATION_DELAY: 80,
  VERDICT_ORDER: ['reproducible', 'diy', 'nonverifiable', 'ftbfs', 'nosource', 'custodial', 'nosendreceive', 'sealed-noita', 'noita', 'sealed-plainkey', 'plainkey', 'obfuscated', 'prefilled', 'fake', 'wip', 'fewusers', 'unreleased', 'vapor', 'nobtc', 'nowallet'],
  PLATFORM_ORDER: ['hardware', 'desktop', 'android', 'iphone', 'bearer', 'others'],
  META_ORDER: ['ok', 'discontinued', 'deprecated', 'outdated', 'stale', 'obsolete', 'removed', 'defunct'],
  PLATFORM_ICONS: {
    all: 'i-all-devices',
    android: 'fab fa-google-play',
    iphone: 'i-app-store',
    hardware: 'fas fa-toolbox',
    bearer: 'i-btc',
    desktop: 'fas fa-desktop',
    others: 'fas fa-calculator'
  }
};

// Core search functions
class WalletSearcher {
  static searchByWords(query, wallet) {
    if (!query?.length) return false;

    const searchTermWords = query.split(" ");
    const walletAsStr = this._getSearchableString(wallet);

    for (let i = 0; i < searchTermWords.length; i++) {
      const matchResult = this._findMatch({
        wallet,
        word: searchTermWords[i],
        nextWord: searchTermWords[i + 1],
        fullQuery: query,
        walletAsStr,
        index: i
      });

      if (matchResult) return matchResult;
    }
    return false;
  }

  static _getSearchableString(wallet) {
    const baseString = `${wallet.title}${wallet.altTitle}`;
    const entries = Object.entries(wallet)
      .map(([key, value]) => `${JSON.stringify(value)}${key}`)
      .join('');
    return `${baseString}${entries}`.toUpperCase();
  }

  static _findMatch({ wallet, word, nextWord, fullQuery, walletAsStr, index }) {
    const patterns = [
      { text: fullQuery, rank: 0, type: 'exact title' },
      { text: fullQuery, rank: 0, type: 'exact' },
      { text: `${word} ${nextWord}`, rank: 0, type: 'two words' },
      { text: word + nextWord, rank: 0, type: 'combined' },
      { text: word, rank: index + 1, type: 'single' }
    ];

    for (const pattern of patterns) {
      const upperPattern = pattern.text.toUpperCase();
      const titleMatch = pattern.type === 'exact title' && wallet.title.indexOf(pattern.text) >= 0;
      const contentMatch = pattern.type !== 'exact title' && walletAsStr.indexOf(upperPattern) >= 0;

      if (titleMatch || contentMatch) {
        return {
          ...wallet,
          matchRank: pattern.rank,
          matchData: `${pattern.type} ${pattern.text}`
        };
      }
    }
    return null;
  }
}

// Search results processor
class SearchProcessor {
  static performSearch(wallets, query = '', platform = '') {
    const filteredWallets = this._filterByPlatform(wallets, platform);
    const searchResults = this._performSearch(filteredWallets, query);
    return this._sortResults(searchResults, query);
  }

  static _filterByPlatform(wallets, platform) {
    if (!platform || !CONSTANTS.PLATFORM_ORDER.includes(platform)) {
      return wallets;
    }
    return wallets.filter(w => w.folder === platform);
  }

  static _performSearch(wallets, query) {
    if (!query) return wallets;
    
    return wallets.reduce((results, wallet) => {
      const result = WalletSearcher.searchByWords(query, wallet);
      return result ? [...results, result] : results;
    }, []);
  }

  static _sortResults(wallets, query) {
    const exactMatches = query ? wallets.filter(w => w.matchRank === 0) : wallets;
    const resultsToSort = exactMatches.length > 0 ? exactMatches : wallets;

    return resultsToSort.sort((a, b) => {
      // Sort by verdict
      if (a.verdict !== b.verdict && a.verdict && b.verdict) {
        return CONSTANTS.VERDICT_ORDER.indexOf(a.verdict) - CONSTANTS.VERDICT_ORDER.indexOf(b.verdict);
      }
      
      // Sort by meta
      if (a.meta !== b.meta && a.meta && b.meta) {
        return CONSTANTS.META_ORDER.indexOf(a.meta) - CONSTANTS.META_ORDER.indexOf(b.meta);
      }
      
      // Sort by platform
      if (a.folder !== b.folder) {
        return CONSTANTS.PLATFORM_ORDER.indexOf(a.folder) - CONSTANTS.PLATFORM_ORDER.indexOf(b.folder);
      }
      
      // Sort by metrics
      for (const metric of ['users', 'ratings', 'reviews']) {
        if (a[metric] !== b[metric]) {
          return b[metric] - a[metric];
        }
      }
      
      // Sort by opinion
      if (a.opinion !== b.opinion) {
        return this._compareOpinions(a.opinion, b.opinion);
      }
      
      // Sort by match rank
      if (a.matchRank !== b.matchRank) {
        return a.matchRank - b.matchRank;
      }
      
      return a.appId.localeCompare(b.appId);
    });
  }

  static _compareOpinions(a, b) {
    if (!b) return -1;
    if (!a) return 1;

    const getScore = opinion => (
      (opinion.positive || 0) * 10 +
      (opinion.negative || 0) * -10 +
      (opinion.neutral || 0)
    );

    return getScore(b) - getScore(a);
  }
}

// UI Controller
class UIController {
  static _searchTimeoutId = null;

  static init() {
    if (!document.querySelector('.searchbar')) return;

    this._setupEventListeners();
    this._initializeSearchBar();
  }

  static _setupEventListeners() {
    // Body click handler
    document.body.addEventListener('click', () => this.exitSearchUI());

    // Reset search button
    document.querySelector('.reset-search')?.addEventListener('click', (event) => {
      event.stopPropagation();
      this._resetSearch();
    });

    // Search triggers
    document.querySelectorAll('.search-trigger-target').forEach(ele => {
      ele.addEventListener('click', (event) => {
        event.stopPropagation();
        this._handleSearchTrigger();
      });
    });

    // Search input handlers
    const searchbar = document.querySelector('.searchbar');
    searchbar?.addEventListener('input', () => this._handleSearchInput());
    searchbar?.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' || e.keyCode === 13) {
        this._handleSearchInput();
      }
    });
    searchbar?.addEventListener('click', (event) => this._handleSearchbarClick(event));

    // Mobile search
    document.querySelector('.mobile-search-shortcut')?.addEventListener('click', () => 
      this._toggleMobileSearch()
    );

    // Window resize
    window.addEventListener('resize', () => {
      if (window.outerWidth <= CONSTANTS.MOBILE_WIDTH) {
        this.exitSearchUI();
      }
    });
  }

  static _initializeSearchBar() {
    const searchbar = document.querySelector('.searchbar');
    if (searchbar) {
      searchbar.value = '';
      window.searchTerm = '';
    }
  }

  static exitSearchUI() {
    const ui = document.querySelector('.results-target');
    if (!ui) return;

    ui.innerHTML = '';
    ui.classList.remove('visible');
    document.body.classList.remove('search-ui-active');
    document.querySelector('.wallet-search')?.classList.remove('active');
  }

  static _resetSearch() {
    window.searchTerm = '';
    const searchbar = document.querySelector('.searchbar');
    if (searchbar) searchbar.value = '';

    const controls = document.querySelector('.search-controls');
    controls?.classList.remove('hint-return', 'working', 'edited');
    document.querySelector('.wallet-search')?.classList.remove('active');

    this.exitSearchUI();
  }

  static _handleSearchTrigger() {
    const hasSearchTerm = window.searchTerm?.length > 1;
    const searchControls = document.querySelector('.search-controls');
    const walletSearch = document.querySelector('.wallet-search');

    if (hasSearchTerm) {
      walletSearch?.classList.add('active');
      searchControls?.classList.add('working', 'edited');
    } else {
      walletSearch?.classList.remove('active');
      searchControls?.classList.remove('working', 'edited');
    }

    clearTimeout(this._searchTimeoutId);
    if (hasSearchTerm) {
      this._searchTimeoutId = setTimeout(() => {
        this._doNavBarSearch(window.searchTerm);
      }, CONSTANTS.SEARCH_DELAY);
    }
  }

  static _handleSearchInput() {
    window.searchTerm = document.querySelector('.searchbar')?.value || '';
    this._handleSearchTrigger();
  }

  static _handleSearchbarClick(event) {
    event.stopPropagation();
    const controls = document.querySelector('.search-controls');
    if (window.searchTerm?.length > 0) {
      controls?.classList.add('hint-return');
    } else {
      controls?.classList.remove('hint-return');
    }
  }

  static _toggleMobileSearch() {
    const walletSearch = document.querySelector('.wallet-search');
    const searchShortcut = document.querySelector('.mobile-search-shortcut');
    const searchbar = document.querySelector('.searchbar');

    const isActive = walletSearch?.classList.contains('mobile-active');
    
    if (!isActive) {
      walletSearch?.classList.add('mobile-active');
      searchShortcut?.classList.add('active');
      searchbar?.focus();
    } else {
      walletSearch?.classList.remove('mobile-active');
      searchShortcut?.classList.remove('active');
    }
  }

  static _doNavBarSearch(input) {
    document.body.classList.add('search-ui-active');
    const result = document.querySelector('.results-target');
    if (!result) return;

    result.classList.add('visible');
    const term = input.toUpperCase();

    if (term.length > CONSTANTS.MIN_SEARCH_LENGTH) {
      this._performSearch(result, term);
    } else if (term.length !== 0) {
      this._showMinLengthMessage(result);
    } else {
      document.querySelector('.search-controls')?.classList.remove('working');
      result.innerHTML = '';
    }

    this._scrollToTop();
  }

  static _performSearch(resultElement, term) {
    resultElement.innerHTML = '';
    const wallets = SearchProcessor.performSearch(versionTaggedWallets, term);

    if (!wallets?.length) {
      this._showNoMatchesMessage(resultElement);
      return;
    }

    this._displaySearchResults(resultElement, wallets);
  }

  static _showMinLengthMessage(resultElement) {
    const remainingChars = CONSTANTS.MIN_SEARCH_LENGTH + 1 - window.searchTerm.length;
    const plural = remainingChars > 1 ? 's' : '';
    
    const li = document.createElement('li');
    li.innerHTML = `<a style='font-size:.7rem;opacity:.7;text-style:italics;'>Enter ${remainingChars} more character${plural} to search all records</a>`;
    resultElement.append(li);
  }

  static _showNoMatchesMessage(resultElement) {
    resultElement.innerHTML = '<li onclick="event.stopPropagation();"><a style="font-size:.7rem;opacity:.7;text-style:italics;">No matches</a></li>';
    document.querySelector('.search-controls')?.classList.remove('working');
  }

  static _displaySearchResults(resultElement, wallets) {
    wallets.forEach((wallet, index) => {
      if (!wallet.title) return;

      const walletRow = this._createWalletRow(wallet, index < 10 ? index : null);
      resultElement.append(walletRow);
    });

    document.querySelector('.search-controls')?.classList.remove('working');
  }

  static _createWalletRow(wallet, index) {
    const walletRow = document.createElement('li');
    if (index !== null) {
      walletRow.style['animation-delay'] = `${index * CONSTANTS.ANIMATION_DELAY}ms`;
    }
    walletRow.classList.add('actionable');

    let compactedResults = this._makeCompactResultsHTML(wallet);
    if (wallet.versions?.length > 0) {
      wallet.versions.forEach(version => {
        compactedResults += this._makeCompactResultsHTML(version);
      });
    }

    const groupClass = wallet.versions?.length > 0 ? 'grouped' : '';
    walletRow.innerHTML = `<div class="${groupClass}">${compactedResults}</div>`;
    return walletRow;
  }

  static _makeCompactResultsHTML(wallet) {
    const icon = CONSTANTS.PLATFORM_ICONS[wallet.folder] || '';
    const basePath = wallet.base_path || '';
    const analysisUrl = `${basePath}${wallet.url}`;
    const scoreDisplay = this._createScoreDisplay(wallet.score);

    return `
      <a class="result-pl-inner ${wallet.meta || ''}" onclick="window.location.href = '${analysisUrl}';" href='${analysisUrl}'>
        <div class="icon-wrapper">
          <img src='${basePath}/images/${wallet.icon ? `wIcons/${wallet.folder}/small/${wallet.icon}` : 'noimg.svg'}' 
               class='wallet-icon' loading="lazy"/>
        </div>
        <span class="result-title-wrapper">
          <span>${wallet.altTitle || wallet.title}</span>
          <small>
            <span class="category">
              <i class="${icon}"></i>&nbsp;
              <span>${wallet.category}</span>
            </span>
          </small>
        </span>
        <span class="stats">
          ${this._createVerdictStamp(wallet)}
          ${this._createMetaStamp(wallet)}
          ${scoreDisplay}
        </span>
      </a>
    `;
  }

  static _createScoreDisplay(score) {
    if (!score) return '';

    const passed = Array(score.numerator).fill('<i class="pass"></i>').join('');
    const failed = Array(score.denominator - score.numerator).fill('<i class="fail"></i>').join('');

    return `
      <div class="tests-passed" data-numerator="${score.numerator}" data-denominator="${score.denominator}">
        <span>Passed ${score.numerator !== score.denominator ? score.numerator : 'all'} 
              ${score.numerator !== score.denominator ? 'of' : ''} ${score.denominator} tests</span>
        <div>${passed}${failed}</div>
      </div>
    `;
  }

  static _createVerdictStamp(wallet) {
    if (!wallet.meta || wallet.meta === 'outdated') return '';
    return `<span data-text="${window.verdicts[wallet.verdict].short}" class="stamp stamp-${wallet.verdict}" alt=""></span>`;
  }

  static _createMetaStamp(wallet) {
    if (!wallet.meta || wallet.meta === 'ok') return '';
    return `<span data-text="${window.verdicts[wallet.meta].short}" class="stamp stamp-${wallet.meta}" alt=""></span>`;
  }

  static _scrollToTop() {
    if (window.innerWidth <= CONSTANTS.MOBILE_WIDTH) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
    }
  }
}

// Version tagging functionality
class VersionTagger {
  static tagWallets() {
    const readerRec = [];
    versionTaggedWallets.length = 0;

    window.wallets.forEach(wallet => {
      if (wallet.wsId) {
        this._handleWsIdWallet(wallet, readerRec);
      } else if (wallet.appId) {
        this._handleAppIdWallet(wallet, readerRec);
      }
    });
  }

  static _handleWsIdWallet(wallet, readerRec) {
    const wsId = wallet.wsId;
    const existingIndex = readerRec.indexOf(wsId);

    if (wsId.length > 0 && existingIndex < 0) {
      versionTaggedWallets.push(wallet);
      readerRec.push(wsId);
    } else {
      this._addAsVersion(wallet, existingIndex);
    }
  }

  static _handleAppIdWallet(wallet, readerRec) {
    const appId = `__${wallet.appId}__`;
    if (!readerRec.includes(appId)) {
      versionTaggedWallets.push(wallet);
      readerRec.push(appId);
    }
  }

  static _addAsVersion(wallet, parentIndex) {
    const parent = versionTaggedWallets[parentIndex];
    if (!parent.versions) parent.versions = [];
    parent.versions.push(wallet);
  }
}

// Initialize
const versionTaggedWallets = [];
window.versionTag = () => VersionTagger.tagWallets();
UIController.init();
