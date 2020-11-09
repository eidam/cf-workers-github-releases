# Cloudflare Worker - GitHub repository releases

Get notified on Slack when a new version of your favorite repositories is released. Using **Cloudflare Workers**, **CRON Triggers,** and **KV storage**.

![slack-screenshot.png](.gitbook/assets/slack-screenshot.png)

## Pre-requisites

You'll need a [Cloudflare Workers account](https://dash.cloudflare.com/sign-up/workers) with

* A workers domain set up
* The Workers Bundled subscription \($5/mo\)

Also, prepare the following secrets

* Cloudflare API token with `Edit Cloudflare Workers` permissions
* GitHub API personal token
* Slack incoming webhook

## Getting started

You can either deploy with **Cloudflare Deploy Button** using GitHub Actions or deploy on your own.

### Deploy with Cloudflare Deploy Button

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button?paid=true)](https://deploy.workers.cloudflare.com/?url=https://github.com/eidam/cf-workers-github-releases&paid=true)

1. Click the button and follow the instructions, you should end up with a clone of this repository
2. Navigate to your new **GitHub repository &gt; Settings &gt; Secrets** and add the following secrets:

   ```text
   - Name: CF_API_TOKEN
   - Value: your-cloudflare-api-token-for-workers-deployment

   - Name: CF_ACCOUNT_ID
   - Value: your-cloudflare-account-id

   - Name: SECRET_SLACK_WEBHOOK_URL
   - Value: your-slack-webhook-url

   - Name: SECRET_GITHUB_TOKEN
   - Value: your-porsonal-read-github-token
   ```

3. Adjust [index.js](https://github.com/adam-janis/cf-workers-github-releases/tree/54f79a32c962967fd4523b7ba48415acef1f16c7/index.js) to list all of your repositories you want to watch

   ```javascript
   const githubRepositories = [
     'eidam/cf-workers-github-releases',
     'cloudflare/wrangler',
     'cloudflare/wrangler-action',
     '...',
   ]
   ```

4. Push to `main` branch to trigger the deployment
5. Navigate to deployed Cloudflare Worker and **enable CRON Trigger** \([https://developers.cloudflare.com/workers/platform/cron-triggers](https://developers.cloudflare.com/workers/platform/cron-triggers)\)
6. 🎉

### Deploy on your own

You can clone the repository yourself and use Wrangler CLI to develop/deploy, extra list of things you need to take care of:

* create KV namespace and add the `KV_GITHUB_RELEASES` binding to [wrangler.toml](https://github.com/adam-janis/cf-workers-github-releases/tree/54f79a32c962967fd4523b7ba48415acef1f16c7/wrangler.toml)
* create Worker secrets
  * `SECRET_SLACK_WEBHOOK_URL`
  * `SECRET_GITHUB_TOKEN`

## Known issues

* **Max 25 repositories to watch**, due to the limit of subrequests Cloudflare Worker can make \(50\).

  The plan is to support up to 49 by sending only one Slack notification per scheduled run.

