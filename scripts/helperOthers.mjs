process.env.TZ = 'UTC' // fix timezone issues

import fs from 'fs';
import path from 'path';
import helper from './helper.mjs';

const category = 'others'
const folder = `_${category}/`
const headers = ('title appId released updated version website repository ' +
                'issue icon date reviewArchive twitter social').split(' ')

async function refreshAll () {
  fs.readdir(folder, async (err, files) => {
    if (err) {
      console.error(`Could not list the directory ${folder}.`, err)
      process.exit(1)
    }
    console.log(`Updating ${files.length} ? files ...`)
    stats.remaining = files.length
    files.forEach(file => { refreshFile(file) })
  })
}

function refreshFile (fileName, content) {
  if (content === undefined) {
    content = { header: helper.getEmptyHeader(headers), body: undefined }
    helper.loadFromFile(path.join(folder, fileName), content)
  }
  const header = content.header
  helper.checkHeaderKeys(header, headers)
}

export default {
  category,
  headers,
  refreshAll,
  refreshFile,
  stats
}
