# Cloudflare Worker for watching GitHub repository releases

Get notified on Slack when new release of your favorite repositories are available on GitHub.

## Pre-requisites

You'll need a [Cloudflare Workers account](https://dash.cloudflare.com/sign-up/workers) with

- A workers domain set up
- The Workers Bundled subsciption (\$5/mo)

## Getting started

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button?paid=true)](https://deploy.workers.cloudflare.com/?url=https://github.com/adam-janis/cf-workers-github-releases&paid=true)

## Secrets

Navigate to your GitHub repository > Settings > Secrets and add the following secrets:

```
- Name: CF_API_TOKEN
- Value: your-cloudflare-api-token-for-workers-deployment

- Name: CF_ACCOUNT_ID
- Value: your-cloudflare-account-id

- Name: SECRET_SLACK_WEBHOOK_URL
- Value: your-slack-webhook-url

- Name: SECRET_GITHUB_TOKEN
- Value: your-porsonal-read-github-token
```
