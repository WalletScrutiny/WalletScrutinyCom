// run this via sh script via docker

const fs = require('fs')

const appId = process.argv[2]
const path = `_android/${appId}.md`
const file = fs.createWriteStream(path)
file.write(`---
appId: ${appId}
verdict: wip
---

This page was created by a script from the **appId** "${appId}" and public
information found
[here](https://play.google.com/store/apps/details?id=${appId}).

Probably an engineer will soon have a deeper look at this app.

So far we are not even sure it is a wallet ... Please check back later.`)
