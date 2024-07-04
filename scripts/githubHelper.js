process.env.TZ = 'UTC' // fix timezone issues

const fs = require('fs')
const path = require('path')

const githubPattern =  /(https:\/\/github\.com)(\/[\w.@:\-~]+){2,}/

async function getAppInfo(header, category, octokit) {
  const customHelperPath = `./custom-helpers/${category}/${header.appId}.js`
  let app
  if (fs.existsSync(path.join('scripts', customHelperPath))) {
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
          const query = `
            {
              repository(owner: "${owner}", name: "${repo}") {
                refs(
                  refPrefix: "refs/tags/"
                  first: 1
                  orderBy: {field: TAG_COMMIT_DATE, direction: DESC}
                ) {
                  edges {
                    node {
                      name
                      target {
                        ... on Tag {
                          tagger {
                            date
                          }
                        }
                        ... on Commit {
                          committedDate
                        }
                      }
                    }
                  }
                }
              }
            }
          `
          app = (await octokit.graphql(query)).repository.refs.edges[0].node
          app.created_at = app.target.tagger?.date || app.target.committedDate
        } catch (err) {
          console.log(`No version info available on Github for ${header.title}`)
        }
      } else {
        console.error(`Couldn't find releases for ${header.title} at https://github.com/${owner}/${repo}`, err)
      }
    }
  }

  if (app) {
    const parsedVersion = (app.tag_name ?? app.name).match(/\d+(?:\.\d+)+/) // strip anything except standard version number
    app.version = parsedVersion ? parsedVersion[0] : app.name
    app.updated = app.created_at
  }

  return app
}

module.exports = {
  getAppInfo,
  githubPattern,
}
