//SET VARIABLES AND DOM OBJECTS + EVENTS NEEDED LATER - bug fix 2
const paginationLimit = 12;
let hasRedirected = false;
window.blockScrollingFocus = false;
window.verdictCount = {};
let isInitializing = true;
const wfInputTargets = { platform: { type: "dropdown" }, "query-string": { type: "string" } };

window.addEventListener('allWalletsLoaded', () => {
  isInitializing = false;
  updateWalletGridInputOriginatingFromURL();
});

for (const [key, value] of Object.entries(wfInputTargets)) {
  if (value.type === 'dropdown') {
    addDropdownEvents(key, () => { 
      if (!isInitializing) updateWalletGridInputOriginatingFromUI();
    });
  }
}

function updateWalletGridInputOriginatingFromUI() {
  const platform = document.querySelector(".dropdown-platform .selected") ? document.querySelector(".dropdown-platform .selected").getAttribute("data") : "allPlatforms";
  const page = document.querySelector(".pagination .selected") ? document.querySelector(".pagination .selected").innerHTML : 1;
  const queryRaw = document.querySelector(".query-string").value.length > 0 ? encodeURI(document.querySelector(".query-string").value) : "";
  window.history.pushState('data', null, `/?platform=${platform}&page=${page}${queryRaw.length > 0 ? '&query-string=' : ''}${queryRaw}`);
  const query = queryRaw.toUpperCase();
  buildWalletGridAndPaginationUI(platform, page, query, queryRaw);
}

function updateWalletGridInputOriginatingFromURL() {
  const param = (new URL(window.location)).searchParams;
  for (const [key, value] of Object.entries(wfInputTargets)) {
    const urlParam = param.get(key);
    if (urlParam) {
      if (value.type === 'dropdown') { setDropdown(key, urlParam); }
      if (value.type === 'string') {
        document.querySelector(`.${key}`).value = decodeURI(urlParam);
      }
    }
  }
  const platform = param.get('platform') ? param.get('platform') : "allPlatforms";
  const queryRaw = param.get('query-string') ? param.get('query-string') : "";
  const query = queryRaw.toUpperCase();
  const page = param.get('page') || "1";
  if (param.size == 0) { window.blockScrollingFocus = true; }
  buildWalletGridAndPaginationUI(platform, page, query, queryRaw);
}

function buildWalletGridAndPaginationUI(platform, page, query, queryRaw) {
  query = decodeURI(query);
  let workingArray = false;

  workingArray = performSearch(window.wallets, query, platform);

  generateAndAppendWalletTiles(workingArray, page);
  generateAndAppendPagination(workingArray, page);
  generateDropdownAndInputCounts(workingArray, platform);
  generateFeedbackText(workingArray, platform, queryRaw);
  if (hasRedirected) {
    generateFeedbackText(workingArray, platform, queryRaw, true);
  }
  
}

function generateAndAppendWalletTiles(workingArray, pageNo) {
  const page = Number(pageNo) - 1 >= 0 ? Number(pageNo) - 1 : 0
  var container = document.createElement("div");
  container.classList.add("wallet-placeholder");
  container.classList.add("view-tiles");
  let flexListEle = document.createElement("div");
  flexListEle.classList.add("flexi-list");
  let badgesHtml = ``;
  for (let i = 0; i < paginationLimit; i++) {
    const numb = (page * paginationLimit) + i;
    const wallet = workingArray[numb];
    if (!wallet) { break }
    const domClass = String(`${wallet.folder}${String(wallet.appId)}`).replace(/\./g, "_");
    const icon = getIcon(wallet.folder);
    const delay = (i + 1) * 80;
    let passed = ``;
    let failed = ``;
    if (wallet.score) {
      for (let i = 0; i < wallet.score.numerator; i++) { passed += `<i class="pass"></i>`; }
      for (let i = 0; i < (wallet.score.denominator - wallet.score.numerator); i++) { failed += `<i class="fail"></i>`; }
    }
    badgesHtml += `
    <a class="AppDisplayCard item ${wallet.folder} ${wallet.meta} ${domClass}" href="${wallet.url}" style="animation-delay:${delay}ms;">
      <div class="tile-head">
        <img src="${wallet.icon ? `/images/wIcons/${wallet.folder}/small/${wallet.icon}` : '/images/noimg.svg'}" class="app_logo" alt="Wallet Logo">
        <h3>${wallet.altTitle || wallet.title}</h3>
        <span class="platform tile-view-only"><i class="${icon}"></i><span> ${wallet.category}</span></span>
      </div>
      <div class="wallet-details">
        <div class="stamps">
          <span data-text="${window.verdicts[wallet.verdict].short}" class="stamp stamp-${wallet.verdict}" alt=""></span>
        ${wallet.meta && wallet.meta !== "ok"
          ? `<span data-text="${window.verdicts[wallet.meta].short}" class="stamp stamp-${wallet.meta}" alt=""></span>`
          : ""}
        </div>
        ${wallet.score
          ? `<div class="score" data-numerator="${wallet.score.numerator}" data-denominator="${wallet.score.denominator}">
            <span>Passed ${wallet.score.numerator !== wallet.score.denominator ? wallet.score.numerator : 'all'} ${wallet.score.numerator !== wallet.score.denominator ? 'of' : ''} ${wallet.score.denominator} tests</span>
            <div>${passed}${failed}</div>
          </div>`
          : ''
        }
      </div>
    </a>`;
  }
  flexListEle.innerHTML = `${badgesHtml}`;
  container.append(flexListEle);
  document.querySelector(".wallet-placeholder").replaceWith(container);
  for (let i = 0; i < paginationLimit; i++) {
    const numb = (page * paginationLimit) + i;
    const instance = workingArray[numb];
    if (!instance) { break; }
    processStyle(instance);
  }
}

function generateAndAppendPagination(workingArray, pageNo) {
  if (isInitializing) return;
  if (workingArray.length >= paginationLimit && (Math.ceil(workingArray.length / paginationLimit) < pageNo)) {
    updateWalletGridInputOriginatingFromUI();
    return;
  }
  const page = Number(pageNo) - 1 >= 0 ? Number(pageNo) - 1 : 0;
  const maxPages = Math.ceil(workingArray.length / paginationLimit);
  if (pageNo > maxPages) {
    // Determine the URL of the last available page
    const platformElement = document.querySelector(".dropdown-platform .selected");
    const platform = platformElement ? platformElement.getAttribute("data") : "allPlatforms";
    const queryStringElement = document.querySelector(".query-string");
    const queryRaw = queryStringElement.value.length > 0 ? encodeURI(queryStringElement.value) : "";

    // Redirect to the last available page (maxPages)
    const newUrl = `/?platform=${platform}&page=${maxPages}${queryRaw.length > 0 ? "&query-string=" + queryRaw : ""}`;
    window.history.pushState("data", null, newUrl);
    
    updateWalletGridInputOriginatingFromURL();

    // Set redirection flag
    if (workingArray.length) {
        // Display the redirection message
        hasRedirected = true;
    }

    // Attach event listener to clear feedback on query change
    queryStringElement.addEventListener('input', function() {
        if (hasRedirected) {
            hasRedirected = false;  // Reset the flag
        }
    });

    return;
  }
  // Continuation of previous code
  let pagination = document.createElement("div");
  pagination.classList.add("pagination");
  let allowedTargets = calcAllowedTargetArray(page, maxPages);
  let primaryGapSet = false;
  let additionalGapSet = false;
  let lastValidOption = false;
  for (let i = 0; i < maxPages; i++) {
    const index = allowedTargets.indexOf(i) + 1;
    const clickTarget = document.createElement("div");
    clickTarget.classList.add("click-target");
    clickTarget.innerHTML = i + 1;
    clickTarget.setAttribute("data-index", i);
    if (i == page) { clickTarget.classList.add("selected"); }

    if (allowedTargets.indexOf(i) >= 0) {
      if (i > page && primaryGapSet && !additionalGapSet && ((allowedTargets[index] - allowedTargets[lastValidOption]) > 1)) {
        clickTarget.classList.add("major-gap");
        additionalGapSet = true;
      }
      if (!allowedTargets[index + 1] && (index + 1) > allowedTargets.length) { clickTarget.classList.add("chevrons-after"); }
      if (!allowedTargets[index - 1] && page > (index + 3)) { clickTarget.classList.add("chevrons-before"); }


      if ((allowedTargets[i] + 1 !== allowedTargets[i + 1]) && !primaryGapSet) {
        clickTarget.classList.add("major-gap");
        primaryGapSet = true;
      }
    }

    if (allowedTargets.indexOf(i) >= 0) {
      clickTarget.addEventListener("click", (event) => {
        document.querySelector(".pagination .click-target.selected").classList.remove("selected");
        event.target.classList.add("selected");
        updateWalletGridInputOriginatingFromUI();
        window.scroll(0,document.querySelector('#homepageSearch').offsetTop);
      });

      lastValidOption = index;
      pagination.append(clickTarget);
    }
  }

  const paginationWidget = document.querySelector(".wallet-placeholder .pagination");
  if (paginationWidget) {
    paginationWidget.replaceWith(pagination);
  } else {
    document.querySelector(".wallet-placeholder").append(pagination);
  }

  if (!window.blockScrollingFocus) {
    setTimeout(() => {
      window.scroll(0, document.querySelector("#homepageSearch").offsetTop);
      window.blockScrollingFocus=false;
    }, 100);
  }
}

function generateDropdownAndInputCounts() {
  document.querySelector(".query-string").setAttribute("placeholder", `Search ${window.full_wallet_count} security reviews…`);
}

function generateFeedbackText(workingArray, platform, queryRaw, redirected = false) {
  if (document.querySelector('.feedback-message')) {
    return; // Feedback already exists, exit the function
  }
  let feedback = document.createElement("p");
  feedback.style["text-alignment"] = 'center';
  let feedbackText = false;
  const platformText = document.querySelector(`.dropdown-options.dropdown-platform .option.${platform}`).getAttribute("data-name");
  if (queryRaw.length > 0 && workingArray.length === 0) { feedbackText = `No wallets match for <b>"${decodeURI(queryRaw)}"</b> in <i>${platformText}</i>.`; }
  // Else If
  else if (queryRaw.length > 0 && workingArray.length > 0) { feedbackText = `Found ${workingArray.length} wallets for <b>"${decodeURI(queryRaw)}"</b> in <i>${platformText}</i>.`; }

  if (queryRaw.length === 0) {
    if (workingArray.length === 0) {
      let lessWorse = false;
      let i = 0;
      generateDropdownAndInputCounts(workingArray, platform)
        ? `<br><a onclick="window.history.pushState('data', null, '/?platform=${platform}&page=0');updateWalletGridInputOriginatingFromURL();" class="primary btn">View highest-scoring ${platformText} wallets</a>`
        : '';
      if (platformNotes[platform]) {
        feedbackText = `${platformNotes[platform]}<br>Learn more by exploring <a href="/methodology/?tests-we-run/${platform}/">our Methodology</a>.${lessWorse}`;
      }
    }
  }
  // further addition
  if (redirected) {
    feedbackText = `Your query for <b>"${decodeURI(queryRaw)}"</b> in the <b>${platformText}</b> platform has yielded <b>${workingArray.length}</b> results. 
    <br>You have been redirected to the last available page. 
    <br>Need help selecting a wallet? Join us in <a href="https://discord.gg/TftHx2zZXc" target="_blank" rel="noopener noreferrer">discord</a>.`;
  }
  const existingFeedback = document.querySelector('.wallet-placeholder > p');
  if (existingFeedback) {existingFeedback.remove(); }

  if (feedbackText) {
    feedback.innerHTML = feedbackText;
    document.querySelector(".wallet-placeholder").prepend(feedback);
  }
}

function calcAllowedTargetArray(page, maxPages) {
  let allowedTargets = [];
  let temp = [];
  let beginning, middle, end = false;
  if (page > 4) { beginning = [0] } else { beginning = [0, 1, 2]; }
  if (page < (maxPages - 4)) { end = [maxPages - 1] } else { end = [maxPages - 3, maxPages - 2, maxPages - 1]; }
  middle = [page - 2, page - 1, page, page + 1, page + 2];

  for (const section of [beginning, middle, end]) { for (const number of section) { temp.push(number); } }
  temp = [...new Set(temp)];
  temp = temp.filter(function (numb) { return numb > -1 });
  for (let i = 0; i < temp.length; i++) {
    if (temp[i + 1] - temp[i] != 2) { allowedTargets.push(temp[i]); }
  }
  return allowedTargets;
}

async function processStyle(wallet) {
  if (!wallet.icon) { return ''; }
  const domClass = String(`${wallet.folder}${String(wallet.appId)}`).replace(/\./g, "_");
  let target = await document.querySelector(`.${domClass}`);
  if (!target) { return; }
  let imgObj = new Image();
  imgObj.src = `/images/wIcons/${wallet.folder}/small/${wallet.icon}`;
  imgObj.onload = function () {
    if (wallet.folder !== 'bearer' && wallet.folder !== 'hardware' && wallet.folder !== 'desktop') {
      let instanceCanvas = document.createElement("canvas");
      instanceCanvas.setAttribute("class", `${domClass}-instance-canvas instance-canvas`);
      instanceCanvas.height = imgObj.height * .25;
      instanceCanvas.width = imgObj.width * .25;
      document.body.append(instanceCanvas);
      let canvasEle = document.querySelector(`.${domClass}-instance-canvas`);
      canvasEle.getContext("2d").drawImage(imgObj, 0, 0);
      const canvasEleData = canvasEle.getContext("2d").getImageData(0, 0, canvasEle.width, canvasEle.height);
      if (canvasEleData.data[3] == 0 && canvasEleData.data[canvasEleData.data.length - 1] == 0) { target.setAttribute("data-icon-shape", "free"); }
      else if (canvasEleData.data[3] < 255) { target.setAttribute("data-icon-shape", "round"); }
    }

    let colorThief = new ColorThief();

    for (const rgb of colorThief.getPalette(imgObj, 3)) {
      if (rgb[0] < 70 && rgb[1] < 70 & rgb[2] < 70) { continue; }
      if (rgb[0] > 130 && rgb[1] > 130 & rgb[2] > 130) { continue; }
      if (target.style && target.style['background-image']) { break; }
      target.style['background-image'] = `linear-gradient(var(--white) -80%, rgb(${rgb[0]},${rgb[1]},${rgb[2]}) 600%)`;
      let colour = `rgba(${rgb[0]},${rgb[1]},${rgb[2]}, 0.2)`;
      target.setAttribute("data-colour", colour);
    }
  }
}

function setDropdown(parent, child) {
  if (document.querySelector(".dropdown-" + parent + " > ." + child)) {
    for (const ele of document.querySelectorAll(".dropdown-" + parent + " > .selected")) { ele.classList.remove("selected"); }
    document.querySelector(".dropdown-" + parent + " > ." + child).classList.add("selected");
  }
}

// ADD EVENTLISTENERS
window.addEventListener("popstate", () => {
  updateWalletGridInputOriginatingFromURL();
});

window.addEventListener("load", () => {
  updateWalletGridInputOriginatingFromURL();
  isInitializing = false;
});

window.queryStringTimeout = false;
document.querySelector(".query-string").addEventListener("input", () => {
  if (isInitializing) {
    return;
  }
  clearTimeout(window.queryStringTimeout);
  window.queryStringTimeout = setTimeout(() => {
    const queryRaw = document.querySelector(".query-string").value.length > 0 ? encodeURI(document.querySelector(".query-string").value) : "";
    // Added    
    const platformElement = document.querySelector(".dropdown-platform .selected");
    const platform = platformElement ? platformElement.getAttribute("data") : "allPlatforms";
    // Original
    window.history.pushState('data', null, `/?platform=${platform}&page=0&query-string=${queryRaw}`);
    updateWalletGridInputOriginatingFromURL();
  }, 500);
});

window.addEventListener("allWalletsLoaded", () => {
  isInitializing = false;
  const platform = document.querySelector(".dropdown-platform .selected") ? document.querySelector(".dropdown-platform .selected").getAttribute("data") : "allPlatforms";
  const page = document.querySelector(".pagination .selected") ? document.querySelector(".pagination .selected").innerHTML : 1;
  const queryRaw = document.querySelector(".query-string").value.length > 0 ? encodeURI(document.querySelector(".query-string").value) : "";
  const query = queryRaw.toUpperCase();
  const workingArray = performSearch(window.wallets, query, platform) || false;

  window.blockScrollingFocus = true;

  generateAndAppendPagination(workingArray, page);
});