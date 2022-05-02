const { FB_ID, FB_SECRET, FB_CALLBACK } = require('../../config')
const axios = require('axios')

function getFacebookAuthURL() {
    const rootURL = 'https://www.facebook.com/v13.0/dialog/oauth'
    const options = new URLSearchParams({
        redirect_uri: FB_CALLBACK,
        client_id: FB_ID,
        display: 'popup',
        response_type: 'code',
        auth_type: 'rerequest',
        scope: [ 'email', 'public_profile'].join(',')
    })

    return `${rootURL}?${options.toString()}`
}

function getFacebookTokens(code) {
    const url = 'https://graph.facebook.com/v4.0/oauth/access_token';
    const params = new URLSearchParams({
    code,
    client_id: FB_ID,
    client_secret: FB_SECRET,
    redirect_uri: FB_CALLBACK,
  })

  return axios
    .get(`${url}?${params.toString()}`)
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch auth tokens`);
      throw new Error(error);
    });
}

module.exports = { getFacebookAuthURL, getFacebookTokens }