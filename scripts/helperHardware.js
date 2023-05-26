process.env.TZ = 'UTC' // fix timezone issues

const fs = require('fs/promises')
const path = require('path')
const helper = require('./helper.js')
const { Semaphore } = require('async-mutex')
const { Octokit } = require("octokit")
const sem = new Semaphore(50)

const stats = {
  defunct: 0,
  updated: 0,
  remaining: 0
}

const category = 'hardware'
const folder = `_${category}/`
const headers = ('title appId authors released discontinued updated version ' +
                'binaries dimensions weight provider providerWebsite website ' +
                'shop country price repository issue icon bugbounty meta ' +
                'verdict date signer reviewArchive twitter social features').split(' ')

async function refreshAll (ids, markDefunct, githubApi) {
  const octokit = new Octokit({ auth: githubApi })
  var files
  if (ids) {
    files = ids.map(it => `${it}.md`)
  } else {
    files = await fs.readdir(folder)
  }
  console.log(`Updating ${files.length} 🗃 files ...`)
  stats.remaining = files.length
  files.forEach(file => { refreshFile(file, undefined, markDefunct, octokit) })
}

function refreshFile (fileName, content, markDefunct, octokit) {
  sem.acquire().then(async function ([, release]) {
    if (content === undefined) {
      content = { header: helper.getEmptyHeader(headers), body: undefined }
      helper.loadFromFile(path.join(folder, fileName), content)
    }
    const header = content.header
    const body = content.body
    const appId = header.appId
    helper.checkHeaderKeys(header, headers)
    if (!helper.was404(`${folder}${appId}`) && !'defunct'.includes(header.meta)) {
      let githubRelease
      try {
        // TODO: Mohammad 05-26-2023: support other repos and parse wallets like TREZOR differently
        // we may need a helper for some wallets
        if (header.repository && header.repository.startsWith('https://github.com/')) {
          const parts = header.repository.split('/')
          const owner = parts[3]
          const repo = parts[4]
          const githubResult = await octokit.request('GET /repos/{owner}/{repo}/tags{?per_page,page}', { owner: owner, repo: repo })
          githubRelease = githubResult.data[0]
          const count = githubResult.data.length
          console.log(`${header.title}: ${count} releases. Last release was ${githubRelease.name} on ${githubRelease.created_at}.`)

          updateFromGithub(header, githubRelease)
          stats.updated++
          helper.writeResult(folder, header, body)
        }
      } catch (err) {
        console.error(`Error with ${header.title}:`, err)

        if (`${err}`.search(/404/) > -1) {
          if (markDefunct) {
            header.meta = "defunct"
            header.date = new Date()
            helper.writeResult(folder, header, body)
          } else {
            helper.addDefunctIfNew(`_hardware/${appId}`)
          }
        }
      }
    } else {
      stats.defunct++
      helper.writeResult(folder, header, body)
    }
    stats.remaining--
    release()
  }).catch(err => {
    console.error(`Does this ever get triggered 3? ${err}`)
  })
}

/**
 * Update the header from app
 **/
function updateFromGithub (header, app) {
  if (app === undefined) {
    return
  }
  // TODO: Mohammad 05-26-2023: needs to be parsed correctly from tag_name or name
  header.version = (app.name || 'various').replace(/["\\]*/g, '') // strip " and \ that won't be missed in the version string
  // if api reports an older updated date than what we determined, keep our data
  header.updated = header.updated && new Date(header.updated) > new Date(app.published_at)
    ? header.updated
    : new Date(app.published_at)
  header.meta = header.meta || 'ok'
  helper.updateMeta(header)
}

module.exports = {
  category,
  headers,
  refreshAll,
  refreshFile,
  stats
}
