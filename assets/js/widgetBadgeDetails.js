/**
 * Renders product details table for both widget and badge
 **/
function getWidgetDetails(wallet) {
  function linkIf(url, title, logo) {
    return hasValue(url) ? `<a target="_blank" title="${title}" href="${url}">${logo?logo:''}</a>` : ""
  }

  function hasValue(x) {
    return typeof x === "boolean"
        || typeof x === "number"
        || typeof x === "object"
        || typeof x === "string" && x != ""
  }
  
  function getSocialLinks(social) {

    return social ? social.map( s => linkIf(s,(new URL(s).hostname.replace('www.', '').replace('.com', '')))).join('') : ''
  }

  return `<table>
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
    ${ hasValue(wallet.updated) ? `<tr><td>Latest Release</td><td>${wallet.updated}</td></tr>` : ""}
    ${ hasValue(wallet.discontinued) ? `<tr><td><strong>Discontinued</strong></td><td>${wallet.discontinued}</td></tr>` : ""}
    ${ (wallet.dimensions && wallet.dimensions.length == 3) ? `<tr><td>Size</td><td>${wallet.dimensions[0]}mm x ${wallet.dimensions[1]}mm x ${wallet.dimensions[2]}mm</td></tr>` : ""}
    <tr><td>Latest Analysis</td><td>${wallet.date}</td></tr>
    <tr><td colspan="2">
      <div class="social-row flex-parent">
      ${ wallet.folder == "iphone"
        ? `<a target="_blank" title="View on App Store" href="https://apps.apple.com/${wallet.appCountry || "us"}/app/id${wallet.idd}"></a>`
        : wallet.folder == "android"
          ? `<a target="_blank" title="View on Play Store" href="https://play.google.com/store/apps/details?id=${wallet.appId}"></a>`
          : ""
      }
      ${ linkIf(wallet.website,          "Website") }
      ${ linkIf(wallet.shop,             "Official Store") }
      ${ linkIf(wallet.binaries,         "Binaries") }
      ${ linkIf(wallet.repository,       "Code Repository") }
      ${ linkIf(wallet.issue,            "Issue") }
      ${ linkIf(wallet.twitter && `https://twitter.com/${wallet.twitter}`, "Twitter") }
      ${ getSocialLinks(wallet.social) }
      </div>
    </td></tr>
    </table><style>td{padding:.25rem .5rem .25rem 0;}tr{box-shadow: 0px 10px 2px -10px #ddd;}td > a{text-decoration: none;}</style>`
}
