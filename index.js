const axios = require('axios')

const { handleUserAndRedirect } = require('path to your user handler')
const { getGoogleAuthURL, getGoogleTokens } = require('./google')
const { getFacebookAuthURL, getFacebookTokens } = require('./facebook')
const { getTwitterAuthURL, getTwitterAccessToken } = require('./twitter')

const { TWITTER_BEARER} = require('../config')

async function handleGoogleSignin(req, res) {
    if (parseInt(req.query.redirect) === 1) return res.send({redirect: getGoogleAuthURL()})

    const code = req.query.code
    if (!code) return res.status(400).end()

    try {
        const {id_token, access_token, refresh_token, expires_in} = await getGoogleTokens(code)
    
        const googleUser = await axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
          {
            headers: {
              Authorization: `Bearer ${id_token}`,
            },
          }
        )
        .then(({data}) => {return {provider_id: data.id, email: data.email, username: data.name, image: data.picture}}) 
        .catch((err) => {
          console.log(err) // debug
          res.status(500).end()
        })
        
        return await handleUserAndRedirect()  // your handle logic

    } catch(err) {
        console.log(err) // debug
        res.status(500).end()
    }
    
}

async function handleFacebookSignin(req, res) {
    if (parseInt(req.query.redirect) === 1) return res.send({redirect: getFacebookAuthURL()}) // 301 redirects are cached

    const code = req.query.code

    if (!code) return res.status(400).end()

    try {
        const { access_token } = await getFacebookTokens(code)
        
        const params = new URLSearchParams({
            fields: ['id', 'email', 'name', 'picture.type(large)'].join(','),
            access_token
        })
        const facebookUser = await axios
        .get(`https://graph.facebook.com/me?${params.toString()}`)
        .then(({data}) => {
            return {provider_id: data.id, email: data.email, username: data.name, image: data.picture.data.url}
        })
        .catch((err) => {
          console.log(err);
          res.status(500).end()
        });
    
        return await handleUserAndRedirect() // your handle logic

    } catch(err) {
        console.log(err)
        res.status(500).end()
    }
    
}

async function handleTwitterSignin(req, res) {
    try {
        if (parseInt(req.query.redirect) === 1) {
            const { oauthRequestToken, oauthRequestTokenSecret, redirect} = await getTwitterAuthURL()
            req.session = req.session || {}
            req.session.oauthRequestToken = oauthRequestToken
            req.session.oauthRequestTokenSecret = oauthRequestTokenSecret
            return res.send({redirect})
        }
        
        const oauth_verifier = req.query.oauth_verifier
        if (!oauth_verifier) return res.status(400).end()
        
    
        const { oauthRequestToken, oauthRequestTokenSecret } = req.session

        // may be save the Access token and secret for future calls
        const { oauthAccessToken, oauthAccessTokenSecret, results } = await getTwitterAccessToken({ oauthRequestToken, oauthRequestTokenSecret, oauth_verifier})
        
        let twitterUser = await axios.get(`https://api.twitter.com/2/users/${results.user_id}?user.fields=profile_image_url`, {
            headers: {
                Authorization: `Bearer ${TWITTER_BEARER}` 
            }
        })

        const { id, name, profile_image_url } = twitterUser.data.data
        twitterUser = { provider_id: id, username: name, image: profile_image_url }

        req.session.destroy() // session is required temporarily for holding the Request token and secret
        return await handleUserAndRedirect() // your handle logic

    } catch(err) {
        console.log(err) // debug
        res.status(500).end()
    }
}



module.exports = { handleGoogleSignin, handleFacebookSignin, handleTwitterSignin } 