export const fmtBRL = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)

export const fmtPct = (value, decimals = 1) =>
  `${value.toFixed(decimals)}%`

export const fmtK = (value) =>
  value >= 1000 ? `${(value / 1000).toFixed(0)}k` : String(value)
