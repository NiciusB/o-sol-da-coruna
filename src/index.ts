import * as dotenv from "dotenv"
dotenv.config()

import sendTweet from "./sendTweet"
import config from "./config"
import { getOffsetOfTimezoneInSeconds } from "./utils"

function tweetAtNext8Am() {
  setTimeout(() => {
    sendTweet()
    // Wait 3 hours to schedule next tweet, to avoid issues with daytime saving changes
    setTimeout(tweetAtNext8Am, 3 * 60 * 60 * 1000)
  }, getSecondsUntil8Am() * 1000)
}

async function main() {
  if (process.env.NODE_ENV === "dev") {
    await sendTweet()
  } else {
    console.log(
      `Everything working correctly! Now waiting ${getSecondsUntil8Am()}s to tweet`
    )
    tweetAtNext8Am()
  }
}

main().catch((err) => {
  console.log(err)
  process.exit(1)
})

function getSecondsUntil8Am(): number {
  const secondsElapsedToday =
    (Math.floor(Date.now() / 1000) +
      getOffsetOfTimezoneInSeconds(config.timezone)) %
    (60 * 60 * 24)

  const SECONDS_UNTIL_8_AM = 60 * 60 * 8

  if (secondsElapsedToday < SECONDS_UNTIL_8_AM) {
    return SECONDS_UNTIL_8_AM - secondsElapsedToday
  }

  return 60 * 60 * 24 - secondsElapsedToday + SECONDS_UNTIL_8_AM
}
