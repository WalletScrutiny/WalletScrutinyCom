process.env.TZ = 'UTC' // fix timezone issues

const gplay = require('google-play-scraper')
const fs = require('fs/promises')
const path = require('path')
const helper = require('./helper.js')
const { Semaphore } = require('async-mutex')

const sem = new Semaphore(50)
const stats = {
  removed: 0,
  updated: 0,
  remaining: 0
}

const category = 'android'
const folder = `_${category}/`
const headers = ('wsId title altTitle authors users appId appCountry released ' +
                'updated version stars ratings reviews size website repository ' +
                'issue icon bugbounty meta verdict date signer reviewArchive ' +
                'twitter social redirect_from ' + 'developerName features').split(' ')

async function refreshAll (ids, markDefunct) {
  var files
  if (ids) {
    files = ids.map(it => `${it}.md`)
  } else {
    files = await fs.readdir(folder)
  }
  console.log(`Updating ${files.length} 🤖 files ...`)
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
    const appCountry = header.appCountry || 'us'
    helper.checkHeaderKeys(header, headers)
    if (!helper.was404(`${folder}${appId}`) && !'removed'.includes(header.meta)) {
      try {
        gplay.app({
          appId: appId,
          lang: 'en',
          country: appCountry
        }).then(app => {
          const iconPath = `images/wIcons/android/${appId}`
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
              header.meta = "removed"
              header.date = new Date()
              helper.writeResult(folder, header, body)
            } else {
              helper.addDefunctIfNew(`_android/${appId}`)
            }
          } else {
            console.error(`\nError with https://play.google.com/store/apps/details?id=${appId} : ${JSON.stringify(err)}`)
          }
          stats.remaining--
          release()
        }).catch(err => {
          console.error(`Does this ever get triggered 1? ${err}`)
        })
      } catch (err) {
        console.error(`Does this ever get triggered 2? ${err}`)
      }
    } else {
      stats.removed++
      helper.writeResult(folder, header, body)
      stats.remaining--
      release()
    }
  }).catch(err => {
    console.error(`Does this ever get triggered 3? ${err}`)
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
  header.released = header.released || app.released
  if ((header.verdict === '' || header.verdict === 'wip') && app.minInstalls < 1000) {
    header.verdict = 'fewusers'
  } else if (header.verdict === 'fewusers' && app.minInstalls >= 1000) {
    header.verdict = 'wip'
  }
  header.meta = header.meta || 'ok'
  // if api reports an older updated date than what we determined, keep our data
  header.updated = header.updated && new Date(header.updated) > new Date(app.updated)
    ? header.updated
    : new Date(app.updated)
  header.users = app.minInstalls
  header.stars = app.score || null
  header.reviews = app.reviews || null
  header.size = app.size
  header.website = app.developerWebsite || header.website || null
  header.date = header.date || new Date()
  header.developerName = app.developer || header.developerName || 'Unknown Developer(s)'
  helper.updateMeta(header)
}

function add (appIds) {
  console.log(`Adding ${appIds.length} apps ...`)

  appIds.forEach(appId => {
    const path = `_android/${appId}.md`
    fs.access(path)
      .catch(() => {
        const header = helper.getEmptyHeader(headers)
        header.appId = appId
        header.verdict = 'wip'
        refreshFile(`${appId}.md`, { header: header, body: '' })
      })
  })
}

function update (appIds) {
  console.log(`Updating ${appIds.length} apps ...`)

  appIds.forEach(appId => {
    const path = `_android/${appId}.md`
    fs.access(path)
      .then(() => {
        refreshFile(`${appId}.md`)
      })
  })
}

module.exports = {
  category,
  headers,
  refreshAll,
  refreshFile,
  stats,
  add,
  update
}
