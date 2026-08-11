// Shared UI constants — Sage & Oak secondary palette mapped to categories.
export const PALETTE = {
  sage: '#8DBB70',
  oak: '#D0A06F',
  gold: '#F0BB44',
  skyteal: '#61ADBF',
  plum: '#A3648B',
  orange: '#F8943F',
}

export const TEAL = '#295A66'
export const CHARCOAL = '#4C483D'
export const GROUND = '#E4E3E2'

// Each category keeps the same colour everywhere (chart, table swatch, PDF).
export const CATEGORY_COLORS = {
  'Stationary Combustion': PALETTE.sage,
  'Mobile Combustion': PALETTE.oak,
  'Fugitive Emissions': PALETTE.gold,
  'Purchased Electricity': PALETTE.skyteal,
  'Purchased Heat': PALETTE.plum,
}

export function categoryColor(category) {
  return CATEGORY_COLORS[category] || PALETTE.orange
}
