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
    const word2 = i <= searchTermWords.length - 2 ? word + searchTermWords[i + 1] : false
    if (walletAsStr.indexOf(word2) >= 0) {
      result = wallet
      wallet.matchRank = walletAsStr.indexOf(word2) + i
      break
    }
    else if (walletAsStr.indexOf(word) >= 0) {
      result = wallet
      wallet.matchRank = walletAsStr.indexOf(word) + (i * 2)
      break
    }
  }
  return result
}

function performSearch(wallets, query = false, platform = false) {
  const platformOrder = ['android', 'iphone', 'hardware', 'bearer']
  const metaOrder = ['ok', 'outdated', 'stale', 'obsolete', 'defunct']
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

  workingArray.sort((a, b) => {
    if (a.matchRank != b.matchRank)
      return a.matchRank - b.matchRank
  })

  let temp = []
  if (query && query.length > 0) {

    let goodMatchIndicator = false
    for (const w of workingArray) {
      if (w.matchRank == 0) {
        goodMatchIndicator = true
        temp.push(w)
      } else if (!goodMatchIndicator) {
        temp.push(w)
      } else {
        continue
      }
    }
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
  })
  return temp
}
