import * as SunCalc from "suncalc"
import composeTweetExtraString from "./extraTexts/composeTweetExtraString"
import config from "./config"
import { calculateSecondsDiff } from "./utils"

export default function composeTweet(date: Date) {
  // Get sun and moon data
  const sunTimes = config.getSunTimes(date)
  const moonIllumination = SunCalc.getMoonIllumination(date)

  // Compose tweet
  const moonPhasesEmojis = ["🌑", "🌒", "🌓", "🌔", "🌕", "🌖", "🌗", "🌘"]
  const moonEmoji =
    moonPhasesEmojis[
      Math.round(moonIllumination.phase * (moonPhasesEmojis.length - 1))
    ]

  const sunEmoji = "🌞"

  const sunriseStr = config.formatDateTime(sunTimes.sunrise, {
    hour: "2-digit",
    minute: "2-digit",
  })
  const sunsetStr = config.formatDateTime(sunTimes.sunset, {
    hour: "2-digit",
    minute: "2-digit",
  })

  const dayDurationDate = new Date(
    calculateSecondsDiff(sunTimes.sunrise, sunTimes.sunset) * 1000
  )
  const dayDurationStr = `${dayDurationDate.getUTCHours()}h ${dayDurationDate.getUTCMinutes()}h ${dayDurationDate.getUTCSeconds()}s`

  const dateMainInfo = `${sunEmoji} ${sunriseStr} (${dayDurationStr}) ${sunsetStr} ${moonEmoji}`
  const extraStr = composeTweetExtraString(date)

  return {
    status: `${dateMainInfo}${extraStr ? "\n\n" + extraStr : ""}`,
    image: config.imageUrl,
    imageAltString: config.imageAltString,
  }
}
