const port = process.env.API_PORT
const webURL = `http://localhost:${port}`  // in development // this points to the server url in production
const callbackPath = `${webURL}/auth/callback`  // must be same in all provider's apps

module.exports = {
    GOOGLE_ID: '',
    GOOGLE_SECRET: '',
    FB_ID: '',
    FB_SECRET: '',
    DB_URL: '',
    COOKIE_SECRET: '',
    FB_CALLBACK: `${callbackPath}/facebook`,
    GOOGLE_CALLBACK: `${callbackPath}/google`,
    TWITTER_ID: '',
    TWITTER_SECRET: '',
    TWITTER_BEARER: '',
    TWITTER_CALLBACK: `${callbackPath}/twitter`
}