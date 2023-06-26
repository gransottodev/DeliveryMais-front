export function FormatDecimal(value){
  const formated = value.toLocaleString('pt-br', {
    minimumIntegerDigits: 2
  })

  return formated
}