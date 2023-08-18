function searchByWords(query, wallet) {
  const searchTermWords = query.length > 0 ? query.split(" ") : false
  let walletAsStr = ''
  for (const [key, value] of Object.entries(wallet)) {
    walletAsStr += `${wallet.title}${wallet.altTitle}${JSON.stringify(value)}${key}`
  }
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
      wallet.matchRank = walletAsStr.indexOf(word) + i + 1
      break
    }
  }
  return result
}