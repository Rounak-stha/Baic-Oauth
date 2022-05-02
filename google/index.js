const { GOOGLE_ID, GOOGLE_SECRET, GOOGLE_CALLBACK } = require('../config')
const axios = require('axios')

function getGoogleAuthURL() {
    const rootURL = 'https://accounts.google.com/o/oauth2/v2/auth'
    const options = new URLSearchParams({
        redirect_uri: GOOGLE_CALLBACK,
        client_id: GOOGLE_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email'
        ].join(" ")
    })
    return `${rootURL}?${options.toString()}`
}

function getGoogleTokens(code) {
    const url = "https://oauth2.googleapis.com/token";
  const params = new URLSearchParams({
    code,
    client_id: GOOGLE_ID,
    client_secret: GOOGLE_SECRET,
    redirect_uri: GOOGLE_CALLBACK,
    grant_type: "authorization_code",
  })

  return axios
    .post(url, params.toString(), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((res) => res.data)
    .catch((error) => {
      console.error(`Failed to fetch auth tokens`);
      throw new Error(error.message);
    });
}

module.exports = { getGoogleAuthURL, getGoogleTokens }