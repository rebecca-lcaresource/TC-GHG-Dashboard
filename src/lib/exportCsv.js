// CSV export — always the full result set (all plants + total), never only
// the on-screen selection. Generated entirely in the browser.
import { round1 } from './calc.js'
import { PERIOD } from './calc.js'

function esc(value) {
  const s = value === null || value === undefined ? '' : String(value)
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
  return s
}

// Build one row per (scope, category) block for each plant and for the total,
// with the distinct factor source(s) applied.
function sectionRows(result, plantLabel) {
  // Group the result's category rows by scope + category.
  const map = new Map()
  for (const r of result.rows) {
    if (r.unmatched) continue
    const key = `${r.scope}||${r.category}`
    if (!map.has(key)) map.set(key, { scope: r.scope, category: r.category, tco2e: 0, sources: new Set() })
    const entry = map.get(key)
    entry.tco2e += r.tco2e
    if (r.source) entry.sources.add(r.source)
  }
  const order = ['Scope 1', 'Scope 2']
  return [...map.values()]
    .sort((a, b) => order.indexOf(a.scope) - order.indexOf(b.scope) || a.category.localeCompare(b.category))
    .map((e) => [
      plantLabel,
      e.scope,
      e.category,
      round1(e.tco2e).toFixed(1),
      PERIOD,
      [...e.sources].join('; '),
    ])
}

export function buildCsv(model) {
  const header = ['plant', 'scope', 'category', 'emissions_tco2e', 'reporting_period', 'factor_sources']
  const lines = [header]

  // All-plants total section first.
  for (const row of sectionRows(model.all, 'All Plants (Total)')) lines.push(row)

  // Then one section per plant.
  for (const id of model.plantIds) {
    for (const row of sectionRows(model.plants[id], id)) lines.push(row)
  }

  // Any unmatched rows recorded explicitly so they are never silently dropped.
  for (const id of model.plantIds) {
    for (const r of model.plants[id].rows) {
      if (r.unmatched) {
        lines.push([id, 'unmatched — no factor applied', r.category, '', PERIOD, `${r.fuel_or_substance} / ${r.unit}`])
      }
    }
  }

  return lines.map((cols) => cols.map(esc).join(',')).join('\n')
}

export function downloadCsv(model) {
  const csv = buildCsv(model)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `TC_GHG_2026_Q1_totals.csv`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
