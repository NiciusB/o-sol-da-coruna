import * as SunCalc from "suncalc"

const timezone = "Europe/Madrid"
const locale = "es-ES"

const config = {
  coordinates: { lat: 43.36212, lon: -8.41238 },
  timezone,
  locale,
  formatDateTime(date: Date, options: Intl.DateTimeFormatOptions = {}) {
    return Intl.DateTimeFormat(locale, {
      timeZone: timezone,
      hour12: false,
      ...options,
    }).format(date)
  },
  getSunTimes(date: Date) {
    return SunCalc.getTimes(
      date,
      config.coordinates.lat,
      config.coordinates.lon
    )
  },
  imageUrl:
    "https://www.meteogalicia.gal/datosred/infoweb/clima/webcams/Corunha/ultima.jpg",
  imageAltString:
    "Unha foto do ceo da cidade da Coruña no momento que se publicou este chío",
}

export default config
