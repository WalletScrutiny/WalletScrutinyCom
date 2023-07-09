process.env.TZ = 'UTC' // fix timezone issues

const fs = require('fs/promises')
const existsSync = require('fs').existsSync
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

const githubPattern =  /(https:\/\/github\.com)(\/[\w.@:\-~]+){2,}/
const ignoreVerdicts = ['nowallet', 'fake', 'unreleased']
const ignoreMetas = ['discontinued']
const category = 'bearer'
const folder = `_${category}/`
const headers = ('title appId authors released discontinued updated version ' +
                'binaries dimensions weight provider providerWebsite website ' +
                'shop country price repository issue icon bugbounty meta ' +
                'verdict date signer reviewArchive twitter social features').split(' ')

async function refreshAll (ids, githubApi) {
  const octokit = new Octokit({ auth: githubApi })
  var files
  if (ids) {
    files = ids.map(it => `${it}.md`)
  } else {
    files = await fs.readdir(folder)
  }
  console.log(`Updating ${files.length} 💳 files ...`)
  stats.remaining = files.length
  files.forEach(file => { refreshFile(file, undefined, octokit) })
}

function refreshFile (fileName, content, octokit) {
  sem.acquire().then(async function ([, release]) {
    if (content === undefined) {
      content = { header: helper.getEmptyHeader(headers), body: undefined }
      helper.loadFromFile(path.join(folder, fileName), content)
    }
    const header = content.header
    const body = content.body
    const appId = header.appId
    helper.checkHeaderKeys(header, headers)
    if (helper.was404(`${folder}${appId}`) || 'defunct'.includes(header.meta)) {
      stats.defunct++
      helper.writeResult(folder, header, body)
      stats.remaining--
      return release()
    }

    // TODO: Mohammad 05-26-2023: Support other repos like Gitlab and Codeberg
    if (!githubPattern.test(header.repository)) {
      if (header.repository) {
        console.warn(`The source code for ${appId} is not hosted on Github. Currently, This script only supports Github.`)
      }
      stats.remaining--
      return release()
    }

    if (!ignoreVerdicts.includes(header.verdict) && !ignoreMetas.includes(header.meta)) {
      const customHelperPath = `./custom-helpers/${category}/${appId}.js`
      let app
      if (existsSync(path.join('scripts', customHelperPath))) {
        const customHelper = require(customHelperPath)
        app = await customHelper.getVersionInfo(octokit)
      } else {
        const parts = header.repository.split('/')
        const owner = parts[3]
        const repo = parts[4]
        try {
          app = (await octokit.request('GET /repos/{owner}/{repo}/releases/latest', { owner, repo })).data
        } catch (err) {
          if (err.status === 404) {
            try {
              console.log(`Couldn't find releases for ${header.title} at https://github.com/${owner}/${repo} ... trying to get tags…`)
              app = (await octokit.request('GET /repos/{owner}/{repo}/tags', { owner, repo })).data[0]
              const commitSHA = app.commit.sha
              const commit = (await octokit.request('GET /repos/{owner}/{repo}/commits/{commitSHA}', { owner, repo, commitSHA })).data
              app.created_at = commit.commit.author.date
            } catch (err) {
              console.log(`No version info available on Github for ${header.title}`)
            }
          } else {
            console.error(`Couldn't find releases for ${header.title} at https://github.com/${owner}/${repo}`, err)
          }
        }
      }

      if (app) {
        console.log(`${header.title}: Last release was ${app?.name} on ${app?.created_at}.`)

        updateFromApp(header, app)
        stats.updated++
        helper.writeResult(folder, header, body)
      }
    }
    stats.remaining--
    release()
  }).catch(console.error)
}

/**
 * Update the header from app
 **/
function updateFromApp (header, app) {
  if (app === undefined) {
    return
  }
  const parsedVersion = (app.tag_name ?? app.name).match(/\d+(?:\.\d+)+/) // strip anything except standard version number
  header.version = parsedVersion ? parsedVersion[0] : app.name
  // if api reports an older updated date than what we determined, keep our data
  header.updated = header.updated && new Date(header.updated) > new Date(app.created_at)
    ? header.updated
    : new Date(app.created_at)
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
