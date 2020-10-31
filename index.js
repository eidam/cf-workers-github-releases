addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

addEventListener('scheduled', event => {
  event.waitUntil(processCronTrigger(event))
})

// Limit is 25 repositories
const githubRepositories = [
  'adam-janis/cf-workers-github-releases',
  'cloudflare/wrangler',
  'cloudflare/wrangler-action',
]

async function listKV() {
  return KV_GITHUB_RELEASES.list()
}

async function setKV(key, value, metadata) {
  return KV_GITHUB_RELEASES.put(key, value, { metadata })
}

async function getKV(key) {
  return KV_GITHUB_RELEASES.getWithMetadata(key)
}

async function notifySlack(repo, metadata) {
  const blocks = [
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `<https://github.com/${repo}|${repo}>: <${metadata.url}|${metadata.name}> released`,
      },
    },
  ]
  return fetch(SECRET_SLACK_WEBHOOK_URL, {
    body: JSON.stringify({ blocks }),
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
}

async function processCronTrigger(event) {
  const init = {
    headers: {
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'cf-worker-github-releases',
      Authorization: `Bearer ${SECRET_GITHUB_TOKEN}`,
    },
  }

  for (const repo of githubRepositories) {
    console.log(`Checking ${repo} ...`)

    const response = await fetch(
      `https://api.github.com/repos/${repo}/releases/latest`,
      init,
    )
    if (response.status === 200) {
      const latestRelease = await response.json()
      const latestReleaseName = latestRelease.name || latestRelease.tag_name

      const kvRelease = await getKV(repo)

      if (
        !kvRelease.metadata ||
        kvRelease.metadata.name !== latestReleaseName
      ) {
        const metadata = {
          name: latestReleaseName,
          url: latestRelease.html_url,
        }
        await notifySlack(repo, metadata)
        await setKV(repo, latestRelease.body, metadata)
      }
    }
  }

  return new Response('OK')
}

async function handleRequest(event) {
  const reposState = await listKV()
  //await processCronTrigger(event)
  return new Response(JSON.stringify(reposState))
}
