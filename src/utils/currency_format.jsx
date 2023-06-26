export function CurrencyFormat(value) {
  const value_formated = new Intl.NumberFormat("pt-br", {
    style: "currency",
    currency: "BRL",
  }).format(value);
  return value_formated
}
