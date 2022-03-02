process.env.TZ = 'UTC' // fix timezone issues

const fs = require('fs')
const helper = require('./helper.js')

const folder = "_hardware/"

function writeResult(header, body) {
  fs.createWriteStream(`${folder}${header.appId}.md`).write(`---
title: "${header.title}"
appId: ${header.appId}
authors:
${[...header.authors].map((item) => `- ${item}`).join("\n")}
released: ${helper.dateOrEmpty(header.released)}
discontinued: ${helper.dateOrEmpty(header.discontinued)}
updated: ${helper.dateOrEmpty(header.updated)}
version: ${helper.stringOrEmpty(header.version)}
binaries: ${header.binaries || ""}
dimensions: ${header.dimensions ? `[${header.dimensions.join(", ")}]` : ""}
weight: ${header.weight || ""}
provider: ${helper.stringOrEmpty(header.provider)}
providerWebsite: ${header.providerWebsite || ""}
website: ${header.website || ""}
shop: ${header.shop || ""}
country: ${header.country || ""}
price: ${header.price || ""}
repository: ${header.repository || ""}
issue: ${header.issue || ""}
icon: ${header.icon || ""}
bugbounty: ${header.bugbounty || ""}
meta: ${header.meta || "ok"}
verdict: ${header.verdict}
date: ${helper.dateOrEmpty(header.date)}
signer: ${header.signer || ""}
reviewArchive: ${(header.reviewArchive || []).length > 0
    ? "\n" + header.reviewArchive.map((item) =>
        `- date: ${helper.dateOrEmpty(item.date)}
  version: "${item.version || ""}"
  appHash: ${item.appHash || ""}
  gitRevision: ${item.gitRevision}
  verdict: ${item.verdict}`).join("\n")
    : "" }
twitter: ${header.twitter || ""}
social: ${header.social.length > 0 ? "\n" : ""}${[...header.social].map((item) => "  - " + item).join("\n")}
---

${body}`)
}

function migrateAll(migration) {
  helper.migrateAll(folder, migration, writeResult)
}

module.exports = {
  migrateAll
}
