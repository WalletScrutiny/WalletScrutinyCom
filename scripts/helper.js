const fs = require('fs')
const https = require('https')
const exec = require('child_process').exec

function downloadImageFile(url, path, callback) {
  const iconFile = fs.createWriteStream(path)
  const request = https.get(`${url}`, function(response) {
    response.pipe(iconFile)
    response.on('end', function() {
      const child = exec(`file --mime-type ${path}`, function (err, stdout, stderr) {
        const mimetype = stdout.substring(stdout.lastIndexOf(':') + 2, stdout.lastIndexOf('\n'))
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
        fs.rename(path, `${path}.${iconExtension}`, function(err) {
          if ( err ) console.log('ERROR: ' + err)
        })
      })
    })
  })
}

module.exports = {
  downloadImageFile
}
