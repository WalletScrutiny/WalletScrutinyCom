const verdictOrder = ['sourceavailable', 'diy', 'nosource', 'custodial', 'ecash', 'nosendreceive', 'sealed-noita', 'noita', 'sealed-plainkey', 'plainkey', 'obfuscated', 'prefilled', 'fake', 'wip', 'unreleased', 'vapor', 'nobtc', 'nowallet'];
const platformOrder = ['hardware', 'desktop', 'android', 'iphone', 'mobile', 'bearer', 'others'];
const metaOrder = ['ok', 'discontinued', 'deprecated', 'stale', 'obsolete', 'removed', 'defunct', 'fewusers'];

function searchByWords(query, wallet) {
  const searchTermWords = query.length > 0 ? query.split(' ') : false;
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
    const word2 = searchTermWords[i + 1] ? word + searchTermWords[i + 1] : false;
    const word3 = searchTermWords[i + 1] ? `${word} ${searchTermWords[i + 1]}` : false;
    const word4 = String(query);
    if (walletTitleUpper.indexOf(word4) >= 0) {
      result = wallet;
      wallet.matchRank = 0;
      wallet.matchData = 'word4 title ' + word4;
      break;
    }
    if (walletAsStr.indexOf(word4) >= 0) {
      result = wallet;
      wallet.matchRank = walletAsStr.indexOf(word4);
      wallet.matchData = 'word4 ' + word4;
      break;
    }
    if (walletAsStr.indexOf(word3) >= 0) {
      result = wallet;
      wallet.matchRank = walletAsStr.indexOf(word3);
      wallet.matchData = 'word3 ' + word3;
      break;
    }
    if (walletAsStr.indexOf(word2) >= 0) {
      result = wallet;
      wallet.matchRank = walletAsStr.indexOf(word2);
      wallet.matchData = 'word2 ' + word2;
      break;
    }
    if (walletAsStr.indexOf(word) >= 0) {
      result = wallet;
      wallet.matchRank = walletAsStr.indexOf(word) + (i + 1);
      wallet.matchData = 'word ' + word;
      break;
    }
  }
  return result;
}

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

function walletMatchesPlatformFilter(wallet, platform) {
  if (!platform || platform === 'allPlatforms') {
    return true;
  }
  if (platform === 'android') {
    return Boolean(
      (wallet.folder === 'mobile' && wallet.hasAndroid) ||
      wallet.folder === 'android' ||
      (wallet.archived && wallet.folder === 'mobile'),
    );
  }
  if (platform === 'iphone') {
    return Boolean(
      (wallet.folder === 'mobile' && wallet.hasIphone) ||
      wallet.folder === 'iphone' ||
      (wallet.archived && wallet.folder === 'mobile'),
    );
  }
  return wallet.folder === platform;
}

function getWalletStoreAppId(wallet) {
  return wallet.storeAppId || wallet.appId;
}

function getWalletStorePlatform(wallet) {
  return wallet.storePlatform || wallet.folder;
}

function getWalletVerdictList(wallet) {
  const list = [];
  if (wallet.verdictAndroid) list.push(wallet.verdictAndroid);
  if (wallet.verdictIphone) list.push(wallet.verdictIphone);
  if (!list.length && wallet.verdict) list.push(wallet.verdict);
  return list;
}

function getPrimaryWalletVerdict(wallet) {
  const list = getWalletVerdictList(wallet);
  if (!list.length) return wallet.verdict || '';
  return list.reduce((best, v) => {
    const vi = verdictOrder.indexOf(v);
    const bi = verdictOrder.indexOf(best);
    if (vi >= 0 && (bi < 0 || vi < bi)) return v;
    return best;
  }, list[0]);
}

function walletHasVerdict(wallet, verdict) {
  return getWalletVerdictList(wallet).includes(verdict);
}

function scoresAreEqual(a, b) {
  if (!a || !b) return false;
  return a.numerator === b.numerator && a.denominator === b.denominator;
}

function getVerificationTarget(wallet, platformFilter) {
  if (platformFilter === 'iphone' && wallet.iphoneAppId) {
    return { appId: wallet.iphoneAppId, platform: 'iphone' };
  }
  if (platformFilter === 'android' && wallet.androidAppId) {
    return { appId: wallet.androidAppId, platform: 'android' };
  }
  return {
    appId: getWalletStoreAppId(wallet),
    platform: getWalletStorePlatform(wallet),
  };
}

function performSearch(wallets, query = false, platform = false) {
  const { featureKeys, remainingQuery } = parseFeatureTokens(query || '');
  const textQuery = remainingQuery.length > 0 ? remainingQuery : false;

  const workingArray = [];
  let walletsTemp;
  if (platform && platform !== 'allPlatforms') {
    walletsTemp = wallets.filter((w) => walletMatchesPlatformFilter(w, platform));
  } else {
    walletsTemp = wallets;
  }

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

  let temp;
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
        if (!globalThis.allAssetInformation) {
          return 0;
        }

        const weightFn = globalThis.getWeightForAppFromAssetInformation;
        if (typeof weightFn !== 'function') {
          return 0;
        }

        const resultA = weightFn(a.storeAppId || a.appId);
        const aWeight = resultA.weight;
        const aLastVersionVerified = resultA.lastVersionVerified;

        const resultB = weightFn(b.storeAppId || b.appId);
        const bWeight = resultB.weight;
        const bLastVersionVerified = resultB.lastVersionVerified;

        if (aLastVersionVerified !== bLastVersionVerified) {
          return bLastVersionVerified - aLastVersionVerified;
        }
        return bWeight - aWeight;
      } catch {
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

export {
  parseFeatureTokens,
  walletMatchesPlatformFilter,
  searchByWords,
  performSearch,
  getWalletVerdictList,
  getPrimaryWalletVerdict,
  walletHasVerdict,
  scoresAreEqual,
  getVerificationTarget,
  getWalletStoreAppId,
  getWalletStorePlatform,
};
