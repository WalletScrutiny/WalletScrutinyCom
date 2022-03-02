/**
 * Renders product details table for both widget and badge
 **/
function getWidgetDetails(wallet) {
  function linkIf(url, title, logo) {
    return hasValue(url) ? `<a target="_blank" title="${title}" href="${url}">${logo}</a>` : ""
  }

  function hasValue(x) {
    return typeof x === "boolean"
        || typeof x === "number"
        || typeof x === "object"
        || typeof x === "string" && x != ""
  }
  
  function getSocialLinks(social) {
    return social.map( s => linkIf(s,
        (new URL(s)).hostname.replace('www.', ''),
        '<i class="fas fa-globe"></i>')).join(' ')
  }

  return `<table style="color: var(--blue, #003395);height: calc(100% - .75rem);border-collapse: collapse;margin:.5rem .75rem .25rem 0;font-size: 14px;font-family:Helvetica Neue, Arial, sans-serif;">
    ${ hasValue(wallet.users) ? `<tr><td>Downloads</td><td>${wallet.users}</td></tr>` : ""}
    ${ hasValue(wallet.stars)
      ? `<tr><td>Rating (${wallet.appCountry || "us"})</td><td>${Math.round(wallet.stars * 10) / 10} stars${ hasValue(wallet.ratings)
        ? ` with ${ wallet.ratings} ratings`
        : "" }</td></tr>`
      : ""}
    ${ wallet.folder == "iphone"
      ? `<tr><td>App size</td><td>${ Math.round(wallet.size / 100000 ) / 10 }MB</td></tr>`
      : wallet.folder == "android" && wallet.size != "Varies with device"
        ? `<tr><td>App size</td><td>${ wallet.size }B</td></tr>`
        : ""
    }
    ${ hasValue(wallet.price) ? `<tr><td>Price</td><td>${wallet.price}</td></tr>` : ""}
    ${ hasValue(wallet.released) ? `<tr><td>Released</td><td>${wallet.released}</td></tr>` : ""}
    ${ hasValue(wallet.updated) ? `<tr><td>Latest Update</td><td>${wallet.updated}</td></tr>` : ""}
    ${ hasValue(wallet.discontinued) ? `<tr><td><strong>Discontinued</strong></td><td>${wallet.discontinued}</td></tr>` : ""}
    ${ (wallet.dimensions && wallet.dimensions.length == 3) ? `<tr><td>Size</td><td>${wallet.dimensions[0]}mm x ${wallet.dimensions[1]}mm x ${wallet.dimensions[2]}mm</td></tr>` : ""}
    <tr><td>Reviewed</td><td>${wallet.date}</td></tr>
    <tr><td>Links</td><td>
    ${ wallet.folder == "iphone"
      ? `<a target="_blank" href="https://apps.apple.com/${wallet.appCountry || "us"}/app/id${wallet.idd}"><i class="fab fa-app-store"></i></a>`
      : wallet.folder == "android"
        ? `<a target="_blank" href="https://play.google.com/store/apps/details?id=${wallet.appId}"><i class="fab fa-google-play"></i></a>`
        : ""
    }
    ${ linkIf(wallet.website,          "Provider Website",  '<i class="fas fa-globe"></i>') }
    ${ linkIf(wallet.shop,             "Official Store",    '<i class="fas fa-shopping-cart"></i>') }
    ${ linkIf(wallet.binaries,         "Binaries",          '<i class="fas fa-file-archive"></i>') }
    ${ linkIf(wallet.repository,       "Code Repository",   '<i class="fa fa-file-code"></i>') }
    ${ linkIf(wallet.issue,            "Issue",             '<i class="fa fa-bug" aria-hidden="true"></i>') }
    ${ linkIf(wallet.twitter && `https://twitter.com/${wallet.twitter}`, "Provider Twitter", '<i class="fab fa-twitter"></i>') }
    ${ getSocialLinks(wallet.social) }
    </td></tr>
    </table><style>td{padding:.25rem .5rem .25rem 0;}tr{box-shadow: 0px 10px 2px -10px #ddd;}td > a{text-decoration: none;}</style>`
}
