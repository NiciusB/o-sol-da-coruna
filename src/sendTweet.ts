import composeTweet from "./composeTweet"
import Twitter from "twitter-lite"
import authTwitter from "./authTwitter"
import fetch from "node-fetch"

export default async function sendTweet() {
  const client = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_OAUTH_TOKEN,
    access_token_secret: process.env.TWITTER_OAUTH_TOKEN_SECRET,
  })
  const uploadClient = new Twitter({
    subdomain: "upload",
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_OAUTH_TOKEN,
    access_token_secret: process.env.TWITTER_OAUTH_TOKEN_SECRET,
  })

  try {
    await client.get("account/verify_credentials")
  } catch (error) {
    const code = error?.errors?.[0]?.code
    if (code === 215 || code === 220) {
      await authTwitter()
    } else {
      throw new Error(JSON.stringify(error.errors ?? error))
    }
  }

  const tweet = await composeTweet(new Date())

  // DEBUG -- DEBUG
  console.log(tweet)
  return
  // DEBUG -- DEBUG

  let tweetImageMediaId = undefined
  if (tweet.image) {
    try {
      // Upload picture
      const imgBuffer = await fetch(tweet.image).then((res) => res.buffer())
      const base64Image = imgBuffer.toString("base64")
      const mediaUploadResponse = await uploadClient.post("media/upload", {
        media_data: base64Image,
      })

      // Set alt text
      await uploadClient.post("media/metadata/create", {
        media_id: mediaUploadResponse.media_id_string,
        alt_text: { text: tweet.imageAltString },
      })

      tweetImageMediaId = mediaUploadResponse.media_id_string
    } catch (err) {
      console.error(err)
    }
  }

  await client.post("statuses/update", {
    status: tweet.status,
    media_ids: tweetImageMediaId,
  })
}
