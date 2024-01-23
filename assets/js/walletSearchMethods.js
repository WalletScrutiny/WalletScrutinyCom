function searchByWords(query, wallet) {
  const searchTermWords = query.length > 0 ? query.split(" ") : false
  let walletAsStr = ''
  for (const [key, value] of Object.entries(wallet)) {
    walletAsStr += `${wallet.altTitle}${JSON.stringify(value)}${key}`
  }
  walletAsStr = `${wallet.title}${walletAsStr}`
  walletAsStr = String(walletAsStr).toUpperCase()

  let result = false
  for (let i = 0; i < searchTermWords.length; i++) {
    const word = searchTermWords[i]
    const word2 =searchTermWords[i + 1] ? word + searchTermWords[i + 1] : false
    const word3 =searchTermWords[i + 1] ? `${word} ${searchTermWords[i + 1]}` : false
    const word4 = String(query)
    if (wallet.title.indexOf(word4) >= 0) {
      result = wallet
      wallet.matchRank = 0
      wallet.matchData = "word4 title " + word4
      break
    }
    if (walletAsStr.indexOf(word4) >= 0) {
      result = wallet
      wallet.matchRank = walletAsStr.indexOf(word4)
      wallet.matchData = "word4 " + word4
      break
    }
    if (walletAsStr.indexOf(word3) >= 0) {
      result = wallet
      wallet.matchRank = walletAsStr.indexOf(word4)
      wallet.matchData = "word3 " + word3
      break
    }
    if (walletAsStr.indexOf(word2) >= 0) {
      result = wallet
      wallet.matchRank = walletAsStr.indexOf(word2) 
      wallet.matchData = "word2 " + word2
      break
    }
    if (walletAsStr.indexOf(word) >= 0) {
      result = wallet
      wallet.matchRank = walletAsStr.indexOf(word) + (i + 1)
      wallet.matchData = "word " + word
      break
    }
  }
  return result
}

function performSearch(wallets, query = false, platform = false) {
  const platformOrder = ['android', 'iphone', 'hardware', 'bearer']
  const metaOrder = ['ok', 'deprecated', 'outdated', 'stale', 'obsolete', 'removed', 'defunct']
  const verdictOrder = ["nobinary", "reproducible", "diy", "nonverifiable", "ftbfs", "nosource", "custodial", "nosendreceive", "sealed-noita", "noita", "sealed-plainkey", "plainkey", "obfuscated", "prefilled", "fake", "wip", "fewusers", "unreleased", "vapor", "nobtc", "nowallet"]

  let workingArray = []
  let walletsTemp = false
  if (platform && platformOrder.includes(platform)) {
    walletsTemp = wallets.filter(function (w) {
      return w.folder === platform 
    })
  } else {
    walletsTemp = wallets
  }
  
  for (const wallet of walletsTemp) {
    if (query && query.length > 0) {
      const result = searchByWords(query, wallet)
      if (result)
        workingArray.push(result)
    } else {
      workingArray.push(wallet)
    }
  }

  let temp = []
  if (query && query.length > 0) {
    temp = workingArray.filter((w) => w.matchRank === 0)
    temp = temp.length<1?workingArray:temp
  }
  else {
    temp = workingArray
  }

  temp.sort((a, b) => {
    if (a.verdict != b.verdict)
      return verdictOrder.indexOf(a.verdict) - verdictOrder.indexOf(b.verdict)
    if (a.folder != b.folder)
      return platformOrder.indexOf(a.folder) - platformOrder.indexOf(b.folder)
    if (a.meta != b.meta)
      return metaOrder.indexOf(a.meta) - metaOrder.indexOf(b.meta)
    if (a.users != b.users)
      return b.users - a.users
    if (a.ratings != b.ratings)
      return b.ratings - a.ratings
    if (a.reviews != b.reviews)
      return b.reviews - a.reviews
    if (a.matchRank != b.matchRank)
      return a.matchRank - b.matchRank
  })
  return temp
}
