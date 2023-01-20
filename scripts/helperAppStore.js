process.env.TZ = 'UTC' // fix timezone issues

const apple = require('app-store-scraper')
const fs = require('fs/promises')
const path = require('path')
const helper = require('./helper.js')
const { Semaphore } = require('async-mutex')

const sem = new Semaphore(5)
const stats = {
  defunct: 0,
  updated: 0,
  remaining: 0
}

const category = 'iphone'
const folder = `_${category}/`
const headers = ('wsId title altTitle authors appId appCountry idd released ' +
                'updated version stars reviews size website repository issue ' +
                'icon bugbounty meta verdict date signer reviewArchive ' +
                'twitter social').split(' ')

async function refreshAll (ids, markDefunct) {
  var files
  if (ids) {
    files = ids.map(it => `${it}.md`)
  } else {
    files = await fs.readdir(folder)
  }
  console.log(`Updating ${files.length} 🍎 files ...`)
  stats.remaining = files.length
  files.forEach(file => { refreshFile(file, undefined, markDefunct) })
}

function refreshFile (fileName, content, markDefunct) {
  sem.acquire().then(function ([, release]) {
    if (content === undefined) {
      content = { header: helper.getEmptyHeader(headers), body: undefined }
      helper.loadFromFile(path.join(folder, fileName), content)
    }
    const header = content.header
    const body = content.body
    const appId = header.appId
    const idd = header.idd
    const appCountry = header.appCountry || 'us'
    helper.checkHeaderKeys(header, headers)
    if (!'defunct'.includes(header.meta)) {
      apple.app({
        id: idd,
        lang: 'en',
        country: appCountry,
        throttle: 20
      }).then(app => {
        const iconPath = `images/wIcons/iphone/${appId}`
        helper.downloadImageFile(`${app.icon}`, iconPath, iconExtension => {
          header.icon = `${appId}.${iconExtension}`
          updateFromApp(header, app)
          stats.updated++
          helper.writeResult(folder, header, body)
          stats.remaining--
          release()
        })
      }, (err) => {
        if (`${err}`.search(/404/) > -1) {
          if (markDefunct) {
            header.meta = "defunct"
            header.date = new Date()
            helper.writeResult(folder, header, body)
          } else {
            helper.addDefunctIfNew(`_iphone/${appId}`)
          }
        } else {
          console.error(`\nError with ${appId} https://apps.apple.com/${appCountry}/app/id${idd} : ${JSON.stringify(err)}`)
        }
        stats.remaining--
        release()
      })
    } else {
      stats.defunct++
      helper.writeResult(folder, header, body)
      stats.remaining--
      release()
    }
  })
}

/**
 * Update the header from app
 **/
function updateFromApp (header, app) {
  if (app === undefined) {
    return
  }
  header.title = app.title || header.title
  header.version = (app.version || 'various').replace(/["\\]*/g, '') // strip " and \ that won't be missed in the version string
  header.meta = header.meta || 'ok'
  // if api reports an older updated date than what we determined, keep our data
  header.updated = header.updated && new Date(header.updated) > new Date(app.updated)
    ? header.updated
    : new Date(app.updated)
  header.released = header.released || app.released
  header.stars = app.score
  header.reviews = app.reviews
  header.size = app.size
  header.website = app.developerWebsite || header.website || ''
  header.date = header.date || new Date()
  helper.updateMeta(header)
}

function add (newIdds) {
  console.log(`Adding skeletons for ${newIdds.length} apps ...`)

  newIdds.forEach(param => {
    var idd, appId, country
    if (param.includes('/')) {
      const parts = param.split('/')
      country = parts[0]
      param = parts[1]
    }
    if (isNaN(param)) {
      appId = param
    } else {
      idd = param
    }
    if (appId) {
      refreshFile(`${appId}.md`)
    } else {
      apple.app({
        id: idd,
        lang: 'en',
        country: country || 'cl',
        throttle: 20
      }).then(app => {
        const path = `_iphone/${app.appId}.md`
        if (fs.existsSync(path)) {
          refreshFile(`${app.appId}.md`)
        } else {
          const header = helper.getEmptyHeader(headers)
          header.appId = app.appId
          header.idd = idd
          header.appCountry = country
          header.verdict = 'wip'
          refreshFile(`${app.appId}.md`, { header: header, body: '' })
        }
      }, err => {
        console.error(`Error with id ${idd}: ${JSON.stringify(err)}`)
      })
    }
  })
}

module.exports = {
  category,
  headers,
  refreshAll,
  refreshFile,
  stats,
  add
}
