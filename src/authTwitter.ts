import Twitter from "twitter-lite"
import { App } from "@tinyhttp/app"
import open from "open"

export default async function authTwitter() {
  const callbackPort = 7682
  const callbackUrl = `http://localhost:${callbackPort}`
  console.log(
    `You have not authenticated yet, please login and add the appropiate tokens. You need to enable 3-legged OAuth and the callback URL ${callbackUrl} has to be accepted`
  )

  // Send user to custom local HTTP server that logs the oauth keys once authed
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  })

  const res = await client.getRequestToken(callbackUrl)

  if (res.oauth_callback_confirmed === "true") {
    open(
      `https://api.twitter.com/oauth/authenticate?oauth_token=${res.oauth_token}`
    )
  } else {
    throw new Error("Invalid oauth_callback_confirmed status `false`")
  }

  // Create the custom local HTTP server to receive the response
  const app = new App()
  app
    .get("/", async (req, res) => {
      res.send("<h1>Done! Check the node console</h1>")

      const accessToken = await client.getAccessToken({
        oauth_verifier: req.query.oauth_verifier as string,
        oauth_token: req.query.oauth_token as string,
      })

      console.log(
        `Your access tokens are ready. Please copy them into the .env file:
TWITTER_OAUTH_TOKEN: ${accessToken.oauth_token}
TWITTER_OAUTH_TOKEN_SECRET: ${accessToken.oauth_token_secret}`
      )
      process.exit(0)
    })
    .listen(callbackPort)
}
