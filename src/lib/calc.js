// Calculation engine — GHG Protocol Corporate Standard, Scope 2 location-based.
// Implements the plant-aware factor matching and aggregation rules from the
// product spec Section 9. Control totals in Section 13 are the pass/fail test;
// this code is never tuned to force a match.
import { activityByPlant, factors, PLANT_IDS, REPORTING_PERIOD } from './data.js'

export const PERIOD = REPORTING_PERIOD

// Fixed display order for categories (Scope 1 first, then Scope 2).
export const CATEGORY_ORDER = [
  'Stationary Combustion',
  'Mobile Combustion',
  'Fugitive Emissions',
  'Purchased Electricity',
  'Purchased Heat',
]

// Normalise an `applies_to` value to a Set of full TC-FAC-00X ids, or the
// sentinel 'ALL'. Tokens may be a full id ("TC-FAC-001") or a bare suffix
// ("003") that inherits the TC-FAC- prefix.
export function normaliseAppliesTo(appliesTo) {
  const value = (appliesTo || '').trim()
  if (value.toLowerCase() === 'all plants') return 'ALL'
  const ids = new Set()
  for (const rawToken of value.split(',')) {
    const token = rawToken.trim()
    if (!token) continue
    if (/^TC-FAC-/i.test(token)) {
      ids.add(token.toUpperCase())
    } else {
      ids.add(`TC-FAC-${token.padStart(3, '0')}`)
    }
  }
  return ids
}

function appliesToPlant(appliesTo, plantId) {
  const norm = normaliseAppliesTo(appliesTo)
  return norm === 'ALL' || norm.has(plantId)
}

// Find every Active factor that matches an activity row for a given plant.
// All five conditions must hold (category, fuel, unit exact, ef_state Active,
// plant within applies_to). Returns an array so callers can detect 0 or >1.
export function matchFactors(plantId, activity) {
  return factors.filter(
    (f) =>
      f.ef_state === 'Active' &&
      f.category === activity.category &&
      f.fuel_or_substance === activity.fuel_or_substance &&
      f.unit === activity.unit &&
      appliesToPlant(f.applies_to, plantId),
  )
}

const round1 = (n) => Math.round(n * 10) / 10

// Compute the full result for a single plant.
function computePlant(plant) {
  let scope1Kg = 0
  let scope2Kg = 0
  const categoryKg = new Map()
  const sources = new Map() // source -> Map(ef_id -> factor)
  const flags = []
  const rows = [] // detailed rows for CSV / audit

  for (const activity of plant.rows) {
    const matches = matchFactors(plant.plantId, activity)

    if (matches.length === 0) {
      flags.push({
        type: 'unmatched',
        plantId: plant.plantId,
        category: activity.category,
        fuel_or_substance: activity.fuel_or_substance,
        unit: activity.unit,
      })
      rows.push({
        plantId: plant.plantId,
        scope: '—',
        category: activity.category,
        fuel_or_substance: activity.fuel_or_substance,
        unit: activity.unit,
        quantity: activity.quantity,
        ef_id: '',
        ef_kgco2e: null,
        tco2e: null,
        source: '',
        unmatched: true,
      })
      continue
    }

    if (matches.length > 1) {
      flags.push({
        type: 'multi',
        plantId: plant.plantId,
        category: activity.category,
        fuel_or_substance: activity.fuel_or_substance,
        unit: activity.unit,
        ef_ids: matches.map((m) => m.ef_id),
      })
    }

    // Use the (single) matched factor. With the supplied data there is always
    // exactly one; if more ever match we still flag above and use the first.
    const factor = matches[0]
    const emissionsKg = activity.quantity * factor.ef_kgco2e
    const tco2e = emissionsKg / 1000

    if (factor.scope === 'Scope 1') scope1Kg += emissionsKg
    else if (factor.scope === 'Scope 2') scope2Kg += emissionsKg

    categoryKg.set(activity.category, (categoryKg.get(activity.category) || 0) + emissionsKg)

    if (!sources.has(factor.source)) sources.set(factor.source, new Map())
    sources.get(factor.source).set(factor.ef_id, factor)

    // Provisional-status factor: included in totals, flagged with rationale.
    if (factor.status === 'Provisional') {
      flags.push({
        type: 'provisional',
        plantId: plant.plantId,
        ef_id: factor.ef_id,
        category: activity.category,
        fuel_or_substance: activity.fuel_or_substance,
        rationale: factor.provisional_rationale,
        source: factor.source,
        tco2e,
      })
    }
    // Montreal Protocol reporting treatment: included, flagged with a note.
    if (factor.reporting_treatment === 'Montreal Protocol') {
      flags.push({
        type: 'montreal',
        plantId: plant.plantId,
        ef_id: factor.ef_id,
        category: activity.category,
        fuel_or_substance: activity.fuel_or_substance,
        tco2e,
      })
    }

    rows.push({
      plantId: plant.plantId,
      scope: factor.scope,
      category: activity.category,
      fuel_or_substance: activity.fuel_or_substance,
      unit: activity.unit,
      quantity: activity.quantity,
      ef_id: factor.ef_id,
      ef_kgco2e: factor.ef_kgco2e,
      tco2e,
      source: factor.source,
      unmatched: false,
    })
  }

  return buildResult({
    id: plant.plantId,
    label: plant.plantId,
    scope1Kg,
    scope2Kg,
    categoryKg,
    sources,
    flags,
    rows,
  })
}

// Turn raw kg accumulators into the display result object.
function buildResult({ id, label, scope1Kg, scope2Kg, categoryKg, sources, flags, rows }) {
  const categories = CATEGORY_ORDER.filter((c) => categoryKg.has(c)).map((category) => {
    const kg = categoryKg.get(category)
    const factor = [...sources.values()]
      .flatMap((m) => [...m.values()])
      .find((f) => f.category === category)
    return {
      category,
      scope: factor ? factor.scope : '',
      tco2e: kg / 1000,
    }
  })

  const sourceList = [...sources.entries()].map(([source, efMap]) => ({
    source,
    factors: [...efMap.values()]
      .sort((a, b) => a.ef_id.localeCompare(b.ef_id))
      .map((f) => ({
        ef_id: f.ef_id,
        category: f.category,
        fuel_or_substance: f.fuel_or_substance,
        unit: f.unit,
        ef_kgco2e: f.ef_kgco2e,
        scope: f.scope,
      })),
  }))

  return {
    id,
    label,
    scope1: scope1Kg / 1000,
    scope2: scope2Kg / 1000,
    combined: (scope1Kg + scope2Kg) / 1000,
    categories,
    sources: sourceList,
    flags,
    rows,
  }
}

// Compute every plant plus the all-plants aggregate.
export function computeModel() {
  const plants = {}
  for (const plant of activityByPlant) {
    plants[plant.plantId] = computePlant(plant)
  }

  // All-plants total = sum of each figure across the five plants.
  let scope1Kg = 0
  let scope2Kg = 0
  const categoryKg = new Map()
  const sources = new Map()
  const flags = []
  const rows = []

  for (const id of PLANT_IDS) {
    const p = plants[id]
    scope1Kg += p.scope1 * 1000
    scope2Kg += p.scope2 * 1000
    for (const c of p.categories) {
      categoryKg.set(c.category, (categoryKg.get(c.category) || 0) + c.tco2e * 1000)
    }
    for (const s of p.sources) {
      if (!sources.has(s.source)) sources.set(s.source, new Map())
      for (const f of s.factors) sources.get(s.source).set(f.ef_id, f)
    }
    flags.push(...p.flags)
    rows.push(...p.rows)
  }

  const all = buildResult({
    id: 'ALL',
    label: 'All Plants (Total)',
    scope1Kg,
    scope2Kg,
    categoryKg,
    sources,
    flags,
    rows,
  })

  return { plants, all, plantIds: PLANT_IDS }
}

export { round1 }
