async function getVersionInfo(octokit) {
  try {
    const githubData = (await octokit.rest.repos.getContent({owner: 'trezor', repo: 'data', path: 'firmware/2/releases.json'})).data
    const content = Buffer.from(githubData.content, 'base64').toString()
    const releases = JSON.parse(content)
    const commit = (await octokit.request('GET /repos/trezor/data/commits?path=firmware/2/releases.json&page=1&per_page=1')).data[0]
    return {
      name: releases[0].version.join('.'),
      created_at: commit.commit.committer.date
    }
  } catch (err) {
    console.error(`Error while fetching releases from Github for TrezorT:`, err)
  }
}

module.exports = { getVersionInfo }
