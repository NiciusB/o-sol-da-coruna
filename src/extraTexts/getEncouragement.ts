export default function getEncouragement(date: Date): string | null {
  const options = strings.encouragement(date)
  return options.length
    ? options[Math.floor(Math.random() * options.length)]
    : null
}

const strings = {
  encouragement(date: Date) {
    return [
      "Fica comigo",
      "Fixéchelo!",
      "Podes facelo",
      "Xa estamos case alí",
      "❤️",
      "🌻🌻🌻",
      "Podemos facelo",
      "Mellorando!",
      "Todo estará ben",
      "Xa falta pouco",
      "Hoxe sucederán unha chea de cousas boas",
      "Estou moi orgullos@ de ti",
    ]
  },
}
