import config from "../config"
import { getDateTimeForTimezone } from "../utils"
import { monthNames } from "./utils"

export default function getDateCelebration(date: Date): string | null {
  const dateTime = getDateTimeForTimezone(config.timezone, date)

  // New years day
  if (dateTime.day === 1 && dateTime.month === 1) {
    const options = strings.newsYearsDay(dateTime.year)
    return options.length
      ? options[Math.floor(Math.random() * options.length)]
      : null
  }

  // Last day of month
  const lastDayOfMonth = new Date(dateTime.year, dateTime.month, 0).getDate()
  if (dateTime.day === lastDayOfMonth) {
    const options = strings.lastDayOfMonth(dateTime.month)
    return options.length
      ? options[Math.floor(Math.random() * options.length)]
      : null
  }

  // First day of month
  if (dateTime.day === 0) {
    const options = strings.firstDayOfMonth(dateTime.month)
    return options.length
      ? options[Math.floor(Math.random() * options.length)]
      : null
  }

  return null
}

const strings = {
  newsYearsDay(year: number) {
    return [
      `Feliz ano novo! 🥂`,
      `Chegaches a ${year}`,
      `Chegaches a ${year}. Estou orgulloso de ti; resistíches durante algúns dos días máis escuros`,
    ]
  },
  lastDayOfMonth(month: number) {
    const monthName = monthNames[month]
    return [
      `Pasaches por ${monthName}`,
      `Chegaches ao final de ${monthName}`,
      `Chegaches a finais de ${monthName}, parabéns`,
    ]
  },
  firstDayOfMonth(month: number) {
    const monthName = monthNames[month]
    return [
      `Benvid@ a ${monthName}`,
      `Hoxe comeza ${monthName}, moitos ánimos!`,
    ]
  },
}
