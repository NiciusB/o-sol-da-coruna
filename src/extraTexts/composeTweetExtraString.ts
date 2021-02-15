import getDateCelebration from "./getDateCelebration"
import getEncouragement from "./getEncouragement"
import getSummary from "./getSummary"

export default function composeTweetExtraString(date: Date): null | string {
  const dateCelebration = getDateCelebration(date)
  if (dateCelebration) {
    return dateCelebration + getRandomExtraEncouragement(date)
  }

  const summary = getSummary(date)
  if (summary) {
    return summary + getRandomExtraEncouragement(date)
  }

  return getEncouragement(date)
}

function getRandomExtraEncouragement(date: Date) {
  if (Math.random() < 0.5) {
    return ""
  }

  return "\n" + getEncouragement(date)
}
