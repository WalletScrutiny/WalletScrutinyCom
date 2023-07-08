async function getVersionInfo(octokit) {
  try {
    const app = (await octokit.request('GET /repos/Coldcard/firmware/tags')).data
      .find(tag => tag.name.match(/\d{4}-\d{2}-\d{2}T\d{4}-v5/))
    const commitSHA = app.commit.sha
    const commit = (await octokit.request('GET /repos/Coldcard/firmware/commits/{commitSHA}', { commitSHA })).data
    app.created_at = commit.commit.author.date

    return app
  } catch (err) {
    console.error(`Error while fetching releases from Github for TrezorOne:`, err)
  }
}

module.exports = { getVersionInfo }
