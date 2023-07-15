//SET VARIABLES AND DOM OBJECTS + EVENTS NEEDED LATER
const paginationLimit = 12
window.blockScrollingFocus=false
window.verdictCount = {}
const wfInputTargets = { verdict: { type: "dropdown" }, platform: { type: "dropdown" }, "query-string": { type: "string" } }
for (const [key, value] of Object.entries(wfInputTargets)) {
  if (value.type === 'dropdown')
    addDropdownEvents(key, () => { updateWalletGridInputOriginatingFromUI() })
}




function updateWalletGridInputOriginatingFromUI() {
  const verdict = document.querySelector(".dropdown-verdict .selected") ? document.querySelector(".dropdown-verdict .selected").getAttribute("data") : "allPassed"
  const platform = document.querySelector(".dropdown-platform .selected") ? document.querySelector(".dropdown-platform .selected").getAttribute("data") : "allPlatforms"
  const page = document.querySelector(".pagination .selected") ? document.querySelector(".pagination .selected").innerHTML : 1
  const queryRaw = document.querySelector(".query-string").value.trim().length > 0 ? encodeURI(document.querySelector(".query-string").value.trim()) : ""
  window.history.pushState('data', null, `/?verdict=${verdict}&platform=${platform}&page=${page}${queryRaw.length > 0 ? '&query-string=' : ''}${queryRaw}`)
  const query = queryRaw.toUpperCase()
  buildWalletGridAndPaginationUI(verdict, platform, page, query, queryRaw)
}

function updateWalletGridInputOriginatingFromURL() {
  const param = (new URL(window.location)).searchParams
  for (const [key, value] of Object.entries(wfInputTargets)) {
    const urlParam = param.get(key)
    if (urlParam) {
      if (value.type === 'dropdown') { setDropdown(key, urlParam) }
      if (value.type === 'string') {
        document.querySelector(`.${key}`).value = decodeURI(urlParam)
      }
    }
  }
  const verdict = param.get('verdict') ? param.get('verdict') : "allPassed"
  const platform = param.get('platform') ? param.get('platform') : "allPlatforms"
  const queryRaw = param.get('query-string') ? param.get('query-string') : ""
  const query = queryRaw.toUpperCase()
  const page = param.get('page') ? param.get('page') : 1
  if (param.size == 0) { window.blockScrollingFocus = true }
  buildWalletGridAndPaginationUI(verdict, platform, page, query, queryRaw)
}

function buildWalletGridAndPaginationUI(verdict, platform, page, query, queryRaw) {
  let workingArray = []
  const paltformOrder = ['allPlatforms', 'android', 'iphone', 'hardware', 'bearer']
  const metaOrder = ['ok', 'outdated', 'stale', 'obsolete', 'defunct']
  if ((verdict === "allResults" && platform == "allPlatforms") && query.length == 0) {
    workingArray = window.wallets
  } else {
    let verdictGroup = false
    if (verdict === "allResults") {
      verdictGroup = { verdicts: [] }
      for (const [key, value] of Object.entries(verdictGroups)) {
        for (const v of value.verdicts) {
          verdictGroup.verdicts.push(v)
        }
      }
    } else {
      verdictGroup = verdictGroups[verdict]
    }
    const searchTermWords = query.length > 0 ? query.split(" ") : false
    window.wallets.forEach(wallet => {
      let walletAsStr = ''
      if (wallet.appId && wallet.verdict && wallet.folder && verdictGroup.verdicts.includes(wallet.verdict) && (verdictGroup.metas == undefined && wallet.meta === 'ok' || verdictGroup.metas && verdictGroup.metas.includes(wallet.meta)) && (platform === "allPlatforms" || String(wallet.folder) === platform)) {
        if (query.length > 0) {
          for (const [key, value] of Object.entries(wallet)) {
            walletAsStr += Array.isArray(value) ? `${JSON.stringify(value)}${key}` : `${value}${key}`
          }
          walletAsStr = String(walletAsStr).toUpperCase()
          if (walletAsStr.indexOf(query.replace(/ /g, '')) >= 0) {
            wallet.matchRank = 0
            workingArray.push(wallet)
          }
          else if (walletAsStr.indexOf(query.replace(/wallet/g, '')) >= 0) {
            wallet.matchRank = 1
            workingArray.push(wallet)
          }
          else {
            for (const word of searchTermWords) {
              if (walletAsStr.indexOf(word) >= 0) {
                wallet.matchRank = walletAsStr.indexOf(word)
                workingArray.push(wallet)
                break
              }
            }
          }
        } else {
          workingArray.push(wallet)
        }

      }
    })
  }
  workingArray.sort((a, b) => {
    if ((a.matchRank && b.matchRank) && (a.matchRank != b.matchRank))
      return a.matchRank - b.matchRank
    if (a.verdict != b.verdict)
      return window.verdictOrder.indexOf(a.verdict) - window.verdictOrder.indexOf(b.verdict)
    if (a.folder != b.folder)
      return paltformOrder.indexOf(a.folder) - paltformOrder.indexOf(b.folder)
    if (a.meta != b.meta)
      return metaOrder.indexOf(a.meta) - metaOrder.indexOf(b.meta)
    if (a.users != b.users)
      return b.users - a.users
    if (a.ratings != b.ratings)
      return b.ratings - a.ratings
    if (a.reviews != b.reviews)
      return b.reviews - a.reviews
  })
  generateAndAppendWalletTiles(workingArray, page)
  generateAndAppendPagination(workingArray, page)
  generateDropdownCounts(workingArray, platform)
  generateFeedbackText(workingArray, platform, verdict, queryRaw)
}

function generateAndAppendWalletTiles(workingArray, pageNo) {
  const page = Number(pageNo) - 1 >= 0 ? Number(pageNo) - 1 : 0
  var container = document.createElement("div")
  container.classList.add("wallet-placeholder")
  container.classList.add("view-tiles")
  let flexListEle = document.createElement("div")
  flexListEle.classList.add("flexi-list")
  let badgesHtml = ``
  for (let i = 0; i < paginationLimit; i++) {
    const numb = (page * paginationLimit) + i
    const wallet = workingArray[numb]
    if (!wallet) { break }
    const domClass = String(`${wallet.folder}${String(wallet.appId)}`).replace(/\./g, "_")
    const icon = getIcon(wallet.folder)
    const delay = (i + 1) * 80
    let passed = ``
    let failed = ``
    for (let i = 0; i < wallet.score.numerator; i++) { passed += `<i class="pass"></i>` }
    for (let i = 0; i < (wallet.score.denominator - wallet.score.numerator); i++) { failed += `<i class="fail"></i>` }
    badgesHtml += `
    <a class="AppDisplayCard item ${wallet.folder} ${wallet.meta} ${domClass}" href="${wallet.url}" style="animation-delay:${delay}ms;">
      <div class="tile-head">
        <img src="${wallet.icon ? `/images/wIcons/${wallet.folder}/small/${wallet.icon}` : '/images/noimg.svg'}" class="app_logo" alt="Wallet Logo">
        <h3>${wallet.altTitle || wallet.title}</h3>
        <span class="platform tile-view-only"><i class="${icon}"></i><span> ${wallet.category}</span></span>
      </div>
      <div class="wallet-details">
        <div class="stamps">
        ${wallet.meta !== "outdated" ? `<span data-text="${window.verdicts[wallet.verdict].short}" class="stamp stamp-${wallet.verdict}" alt=""></span>` : ""}
        ${wallet.meta && wallet.meta !== "ok" ? `<span data-text="${window.verdicts[wallet.meta].short}" class="stamp stamp-${wallet.meta}" alt=""></span>` : ""}
        </div>
        <div class="score" data-numerator="${wallet.score.numerator}" data-denominator="${wallet.score.denominator}">
          <span>Passed ${wallet.score.numerator !== wallet.score.denominator ? wallet.score.numerator : 'all'} ${wallet.score.numerator !== wallet.score.denominator ? 'of' : ''} ${wallet.score.denominator} tests</span>
          <div>${passed}${failed}</div>
        </div>
      </div>
    </a>`
  }
  flexListEle.innerHTML = `${badgesHtml}`
  container.append(flexListEle)
  document.querySelector(".wallet-placeholder").replaceWith(container)
  for (let i = 0; i < paginationLimit; i++) {
    const numb = (page * paginationLimit) + i
    const instance = workingArray[numb]
    if (!instance) { break }
    processStyle(instance)
  }
}

function generateAndAppendPagination(workingArray, pageNo) {
  if (workingArray.length >= paginationLimit && (Math.ceil(workingArray.length / paginationLimit) < pageNo)) {
    updateWalletGridInputOriginatingFromUI()
    return
  }
  const page = Number(pageNo) - 1 >= 0 ? Number(pageNo) - 1 : 0
  const maxPages = Math.ceil(workingArray.length / paginationLimit)
  let pagination = document.createElement("div")
  pagination.classList.add("pagination")
  let allowedTargets = calcAllowedTargetArray(page, maxPages)
  let primaryGapSet = false
  let additionalGapSet = false
  let lastValidOption = false
  for (let i = 0; i < maxPages; i++) {
    const index = allowedTargets.indexOf(i) + 1
    const clickTarget = document.createElement("div")
    clickTarget.classList.add("click-target")
    clickTarget.innerHTML = i + 1
    clickTarget.addEventListener("click", (event) => {
      document.querySelector(".pagination .click-target.selected").classList.remove("selected")
      event.target.classList.add("selected")
      updateWalletGridInputOriginatingFromUI()
    })
    clickTarget.setAttribute("data-index", i)
    if (i == page) { clickTarget.classList.add("selected") }

    if (allowedTargets.indexOf(i) >= 0) {

      if (i > page && primaryGapSet && !additionalGapSet && ((allowedTargets[index] - allowedTargets[lastValidOption]) > 1)) {
        clickTarget.classList.add("major-gap")
        additionalGapSet = true
      }
      if (!allowedTargets[index + 1] && (index + 1) > allowedTargets.length) { clickTarget.classList.add("chevrons-after") }
      if (!allowedTargets[index - 1] && page > (index + 3)) { clickTarget.classList.add("chevrons-before") }


      if ((allowedTargets[i] + 1 !== allowedTargets[i + 1]) && !primaryGapSet) {
        clickTarget.classList.add("major-gap")
        primaryGapSet = true
      }
    }
    if (allowedTargets.indexOf(i) < 0) { clickTarget.style.display = 'none' } else { lastValidOption = index }
    pagination.append(clickTarget)
  }
  document.querySelector(".wallet-placeholder").append(pagination)
  if (!window.blockScrollingFocus) {
    setTimeout(() => {
      window.scroll(0, document.querySelector("#homepageSearch").offsetTop)
      window.blockScrollingFocus=false
    }, 100)
  }
}

function generateDropdownCounts(workingArray, platform) {
  countProducts(workingArray)
  for (const option of document.querySelectorAll(".dropdown-options.dropdown-verdict .option"))
    if (option.hasAttribute("data")) {
      const count = countNumberPerPlatformAndVerdict(option.getAttribute("data"), platform, true)
      if (option.querySelectorAll("small").length > 0) { option.querySelector("small").innerHTML = count }
      else {
        let small = document.createElement("small")
        small.innerHTML = count
        option.append(small)
        option.setAttribute("data-count", count)
      }
    }

}

function generateFeedbackText(workingArray, platform, verdict, queryRaw) {
  let feedback = document.createElement("p")
  feedback.style["text-alignment"] = 'center'
  let feedbackText = false
  const platformText = document.querySelector(`.dropdown-options.dropdown-platform .option.${platform}`).getAttribute("data-name")
  const verdictText = document.querySelector(`.dropdown-options.dropdown-verdict .option.${verdict}`).getAttribute("data-name")
  if (queryRaw.length > 0 && workingArray.length === 0) { feedbackText = `No wallets match for <b>"${queryRaw}"</b> in <i>${verdictText}</i>, <i>${platformText}</i>.` }

  if (queryRaw.length === 0) {
    if (workingArray.length === 0) {
      let lessWorse = false
      let i = 0
      generateDropdownCounts(workingArray, platform)
      for (const option of document.querySelectorAll(".dropdown-verdict .option")) {
        if (!option.hasAttribute("data-rank")) { continue }
        if (Number(option.getAttribute("data-rank")) === i && option.getAttribute("data-count") > 0) {
          lessWorse = option
          break
        }

        i++
      }
      lessWorse = lessWorse
        ? `<br><a onclick="window.history.pushState('data', null, '/?verdict=${lessWorse.getAttribute("data")}&platform=${platform}&page=0');updateWalletGridInputOriginatingFromURL();" class="primary btn">View highest-scoring ${platformText} wallets</a>`
        : ''
      if (platformNotes[platform]) {
        feedbackText = `${platformNotes[platform]}<br>Learn more by exploring <a href="/methodology/?tests-we-run/${platform}/">our Methodology</a>.${lessWorse}`
      }
    }
    else {
      switch (verdict) {
        case 'allPassed':
          feedbackText = `These ${workingArray.length} wallets passed all tests according to <a href="/methodology/?tests-we-run/${platform}/">our Methodology</a>.`
          break;
        // case 'allPassed':
        //   feedbackText = `These ${workingArray.length} wallets scored the best ${platform !== 'allPlatforms' ? 'in ' + platformText + ' category' : 'overall'}.<br>Read more about <a href="/methodology/?tests-we-run/${platform}/">our Methodology</a>.`
        //   break;
        default:
      }
    }
  }



  if (feedbackText) {
    feedback.innerHTML = feedbackText
    document.querySelector(".wallet-placeholder").prepend(feedback)
  }
}

function countNumberPerPlatformAndVerdict(verdict, platform, toLocale) {
  let value = false
  if (platform === 'allPlatforms') {
    let count = 0
    for (const platformKey of Object.keys(window.verdictCount)) {
      count += window.verdictCount[platformKey][verdict]
    }
    value = count
  } else {
    value = window.verdictCount[platform][verdict]
  }
  if (value == 0) { return 0 }
  return toLocale ? String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",") : value

}

function countProducts() {
  for (const platform of Object.keys(window.platforms)) {
    window.verdictCount[platform] = {}
    for (const [verdictGroupName, verdictGroup] of Object.entries(verdictGroups)) {
      window.verdictCount[platform][verdictGroupName] = 0
      for (const wallet of window.wallets) {
        if (platform !== wallet.folder) {
          continue
        } else if (verdictGroup.metas && verdictGroup.metas.includes(wallet.meta)) {
          // If the verdictGroup captures metas, then this is independent of the
          // verdict.
          window.verdictCount[platform][verdictGroupName]++
        } else if (wallet.meta === 'ok' && verdictGroup.verdicts.includes(wallet.verdict)) {
          window.verdictCount[platform][verdictGroupName]++
        }
      }
    }
  }
  for (const platform of Object.keys(window.verdictCount)) {
    window.verdictCount[platform]['allResults'] =
      Object.values(window.verdictCount[platform]).reduce(
        (a, b) => a + b, 0)
  }
}

function calcAllowedTargetArray(page, maxPages) {
  let allowedTargets = []
  let temp = []
  let beginning, middle, end = false
  if (page > 4) { beginning = [0] } else { beginning = [0, 1, 2] }
  if (page < (maxPages - 4)) { end = [maxPages - 1] } else { end = [maxPages - 3, maxPages - 2, maxPages - 1] }
  middle = [page - 2, page - 1, page, page + 1, page + 2]

  for (const section of [beginning, middle, end]) { for (const number of section) { temp.push(number) } }
  temp = [...new Set(temp)];
  temp = temp.filter(function (numb) { return numb > -1 });
  for (let i = 0; i < temp.length; i++) {
    if (temp[i + 1] - temp[i] != 2) { allowedTargets.push(temp[i]) }
  }
  return allowedTargets
}

async function processStyle(wallet) {
  if (!wallet.icon) { return '' }
  const domClass = String(`${wallet.folder}${String(wallet.appId)}`).replace(/\./g, "_")
  let target = await document.querySelector(`.${domClass}`)
  if (!target) { return }
  let imgObj = new Image();
  imgObj.src = `/images/wIcons/${wallet.folder}/small/${wallet.icon}`;
  imgObj.onload = function () {
    if (wallet.folder !== 'bearer' && wallet.folder !== 'hardware') {
      let instanceCanvas = document.createElement("canvas")
      instanceCanvas.setAttribute("class", `${domClass}-instance-canvas instance-canvas`)
      instanceCanvas.height = imgObj.height * .25
      instanceCanvas.width = imgObj.width * .25
      document.body.append(instanceCanvas)
      let canvasEle = document.querySelector(`.${domClass}-instance-canvas`)
      canvasEle.getContext("2d").drawImage(imgObj, 0, 0);
      const canvasEleData = canvasEle.getContext("2d").getImageData(0, 0, canvasEle.width, canvasEle.height);
      if (canvasEleData.data[3] == 0 && canvasEleData.data[canvasEleData.data.length - 1] == 0) { target.setAttribute("data-icon-shape", "free") }
      else if (canvasEleData.data[3] < 255) { target.setAttribute("data-icon-shape", "round") }
    }

    let colorThief = new ColorThief();

    for (const rgb of colorThief.getPalette(imgObj, 3)) {
      if (rgb[0] < 70 && rgb[1] < 70 & rgb[2] < 70) { continue; }
      if (rgb[0] > 130 && rgb[1] > 130 & rgb[2] > 130) { continue; }
      if (target.style && target.style['background-image']) { break; }
      target.style['background-image'] = `linear-gradient(var(--white) -80%, rgb(${rgb[0]},${rgb[1]},${rgb[2]}) 600%)`
      let colour = `rgba(${rgb[0]},${rgb[1]},${rgb[2]}, 0.2)`;
      target.setAttribute("data-colour", colour);
    }
  }
}

function setDropdown(parent, child) {
  if (document.querySelector(".dropdown-" + parent + " > ." + child)) {
    for (const ele of document.querySelectorAll(".dropdown-" + parent + " > .selected")) { ele.classList.remove("selected") }
    document.querySelector(".dropdown-" + parent + " > ." + child).classList.add("selected")
  }
}



// ADD EVENTLISTENERS
window.addEventListener("popstate", () => {
  updateWalletGridInputOriginatingFromURL()
});
window.addEventListener("load", () => {
  updateWalletGridInputOriginatingFromURL()
});
window.queryStringTimeout = false
document.querySelector(".query-string").addEventListener("input", () => {
  clearTimeout(window.queryStringTimeout)
  window.queryStringTimeout = setTimeout(() => {
    const queryRaw = document.querySelector(".query-string").value.trim().length > 0 ? encodeURI(document.querySelector(".query-string").value.trim()) : ""
    window.history.pushState('data', null, `/?verdict=allResults&platform=allPlatforms&page=0&query-string=${queryRaw}`)
    updateWalletGridInputOriginatingFromURL()
  }, 500)
})