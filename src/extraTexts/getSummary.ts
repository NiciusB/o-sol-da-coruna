import config from "../config"
import {
  calculateSecondsDiffBetweenTwoSunTimes,
  getDateTimeForTimezone,
} from "../utils"

export default function getSummary(date: Date): string | null {
  const options = strings.summary(date)
  return options.length
    ? options[Math.floor(Math.random() * options.length)]
    : null
}

const strings = {
  summary(date: Date) {
    const options = []

    const sunTimesToday = config.getSunTimes(date)

    const dateTimeForTimezone = getDateTimeForTimezone(config.timezone, date)

    {
      const sunTimesOnNewYearsDay = config.getSunTimes(
        new Date(date.getFullYear(), 1, 1)
      )
      const secondsAddedSince1Jan = calculateSecondsDiffBetweenTwoSunTimes(
        sunTimesToday,
        sunTimesOnNewYearsDay
      )

      if (secondsAddedSince1Jan >= 60 * 30) {
        const mins = Math.round(secondsAddedSince1Jan / 60)
        options.push(`Dende o 1 de xaneiro engadimos ${mins} minutos ao día`)
      }

      if (dateTimeForTimezone.month === 1 && dateTimeForTimezone.day === 16) {
        const mins = Math.round(secondsAddedSince1Jan / 60)
        options.push(
          `Engadir os primeiros ${mins} minutos tardou 16 días, melloraremos máis rápido`
        )
      }
    }

    {
      const sunTimes2WeeksAgo = config.getSunTimes(
        new Date(date.getTime() - 14 * 24 * 60 * 60 * 1000)
      )
      const secondsAddedSince2WeeksAgo = calculateSecondsDiffBetweenTwoSunTimes(
        sunTimesToday,
        sunTimes2WeeksAgo
      )

      if (secondsAddedSince2WeeksAgo >= 60 * 25) {
        const mins = Math.round(secondsAddedSince2WeeksAgo / 60)
        options.push(
          `En só dúas semanas o día obtivo ${mins} minutos de luz máis`
        )
      }
    }

    {
      const sunTimesYesterday = config.getSunTimes(
        new Date(date.getTime() - 24 * 60 * 60 * 1000)
      )
      const sunTimesTomorrow = config.getSunTimes(
        new Date(date.getTime() + 24 * 60 * 60 * 1000)
      )
      const secondsAddedToday = calculateSecondsDiffBetweenTwoSunTimes(
        sunTimesToday,
        sunTimesYesterday
      )
      const secondsAddedTomorrow = calculateSecondsDiffBetweenTwoSunTimes(
        sunTimesTomorrow,
        sunTimesToday
      )

      if (secondsAddedToday <= 0 && secondsAddedTomorrow > 0) {
        options.push(
          `Despois de hoxe, todos os días serán un pouco máis longos que o anterior`,
          `Despois de hoxe, os días comezan a alargarse`,
          `Despois de hoxe, engadimos polo menos un minuto extra todos os días`,
          `Despois desta noite, os días comezan a alargarse de novo`,
          `Despois de mañá, os días comezan a alargarse de novo e estou aquí para atravesarte os días escuros e fríos do inverno dicíndoche exactamente a cantidade de luz do día que gañas cada día`,
          `Despois de hoxe, a posta do sol é polo menos un minuto despois todos os días` // not 100% true
        )
      }

      if (secondsAddedToday >= 0 && secondsAddedTomorrow < 0) {
        options.push(
          `Despois de hoxe, os días comezan a acortarse de novo pero estarei aquí para axudarche`
        )
      }
    }

    {
      const sunTimesTomorrow = config.getSunTimes(
        new Date(date.getTime() + 24 * 60 * 60 * 1000)
      )

      const diff = calculateSecondsDiffBetweenTwoSunTimes(
        sunTimesTomorrow,
        sunTimesToday
      )

      const sunsetDateTime = getDateTimeForTimezone(
        config.timezone,
        sunTimesToday.sunset
      )
      if (
        // sun day increasing
        diff > 0 &&
        // and close to sunset reaching the next hour
        sunsetDateTime.minutes >= 50 &&
        // and sunset not too late
        sunsetDateTime.hours < 20
      ) {
        const nextHours =
          getDateTimeForTimezone(config.timezone, sunTimesToday.sunset).hours +
          1
        options.push(
          `Achegándonos ás ${nextHours}:00 lentamente pero con seguridade`
        )
      }
    }

    return options
  },
}
