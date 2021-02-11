import * as SunCalc from "suncalc"

export type DateTimeForTimezone = {
  year: number
  month: number
  day: number
  hours: number
  minutes: number
  seconds: number
  weekday: number
  unix: number
}

export function getDateTimeForTimezone(
  timezone: string,
  date: Date
): DateTimeForTimezone {
  const dateTimeStr = Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    weekday: "long",
    hour12: false,
  }).format(date)

  const [weekday, dateStr, timeStr] = dateTimeStr.split(", ")

  const [month, day, year] = dateStr.split("/").map((a) => parseInt(a))

  const [hours, minutes, seconds] = timeStr.split(":").map((a) => parseInt(a))

  const weekdayNumber =
    [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ].indexOf(weekday) + 1

  return {
    year,
    month,
    day,
    hours,
    minutes,
    seconds,
    weekday: weekdayNumber,
    unix: date.getTime(),
  }
}

export function getOffsetOfTimezoneInSeconds(timezone: string): number {
  const { hours, minutes } = getDateTimeForTimezone(timezone, new Date(0))

  return hours * 60 * 60 + minutes * 60
}

export function calculateSecondsDiff(date1: Date, date2: Date) {
  const diff = new Date(Math.abs(date1.getTime() - date2.getTime()))

  return (
    diff.getUTCDate() * 24 * 60 * 60 +
    diff.getUTCHours() * 60 * 60 +
    diff.getUTCMinutes() * 60 +
    diff.getUTCSeconds()
  )
}

export function calculateSecondsDiffBetweenTwoSunTimes(
  date1: SunCalc.GetTimesResult,
  date2: SunCalc.GetTimesResult
) {
  return (
    calculateSecondsDiff(date1.sunrise, date1.sunset) -
    calculateSecondsDiff(date2.sunrise, date2.sunset)
  )
}
