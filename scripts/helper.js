const fs = require('fs')
const https = require('https')
const FileType = require('file-type')

function downloadImageFile(url, path, callback) {
  const iconFile = fs.createWriteStream(path)
  const request = https.get(`${url}`, response => {
    response.pipe(iconFile)
    response.on('end', () => {
      (async () => {
        const mimetype = (await FileType.fromFile(path)).mime
        if (mimetype == "image/png") {
          iconExtension = "png"
        } else if (mimetype == "image/jpg" || mimetype == "image/jpeg") {
          iconExtension = "jpg"
        } else if (mimetype == "text/html" || mimetype == "text/plain") {
          console.error(`Not writing results to ${path}`)
          console.error(`Icon wrong mime type ${mimetype}. Skipping.`)
          console.error(body)
          return
        } else {
          console.error(`Not writing results to ${path}`)
          console.error(`Icon wrong mime type ${mimetype}. Skipping.`)
          return
        }
        callback(iconExtension)
        fs.rename(path, `${path}.${iconExtension}`, err => {
          if ( err ) console.log('ERROR: ' + err)
        })
      })()
    })
  })
  request.on('error', err => {
    console.error(err)
  })
}

function addReviewArchive(reviewArchive, header) {
  reviewArchive.unshift({
    date: header.date,
    version: header.version,
    appHash: "",
    gitRevision: getMasterHead(),
    verdict: header.verdict
  })
}

function getMasterHead() {
  return `${fs.readFileSync('.git/refs/heads/master')}`.trim()
}

module.exports = {
  addReviewArchive,
  downloadImageFile
}
