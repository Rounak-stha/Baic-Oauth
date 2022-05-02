const oauth = require('oauth')
const { TWITTER_ID, TWITTER_SECRET, TWITTER_CALLBACK } = require('../../config')

const oauthConsumer = new oauth.OAuth(
    'https://twitter.com/oauth/request_token', 'https://twitter.com/oauth/access_token',
    TWITTER_ID,
    TWITTER_SECRET,
    '1.0A', TWITTER_CALLBACK, 'HMAC-SHA1'
)

async function getOAuthRequestToken () {
    return new Promise((resolve, reject) => {
      oauthConsumer.getOAuthRequestToken(function (error, oauthRequestToken, oauthRequestTokenSecret, results) {
        return error
          ? reject(new Error(JSON.stringify(error)))
          : resolve({ oauthRequestToken, oauthRequestTokenSecret, results })
      })
    })
  }


async function getTwitterAuthURL() {
    const { oauthRequestToken, oauthRequestTokenSecret } = await getOAuthRequestToken()
    return { oauthRequestToken, oauthRequestTokenSecret, redirect: `https://api.twitter.com/oauth/authorize?oauth_token=${oauthRequestToken}`}
}

async function getTwitterAccessToken ({ oauthRequestToken, oauthRequestTokenSecret, oauth_verifier } = {}) {
    return new Promise((resolve, reject) => {
      oauthConsumer.getOAuthAccessToken(oauthRequestToken, oauthRequestTokenSecret, oauth_verifier, function (error, oauthAccessToken, oauthAccessTokenSecret, results) {
        return error
          ? reject(new Error(JSON.stringify(error)))
          : resolve({ oauthAccessToken, oauthAccessTokenSecret, results })
      })
    })
}

module.exports = { getTwitterAuthURL, getTwitterAccessToken }