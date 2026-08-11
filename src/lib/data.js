// Bundled dataset. The six source CSVs are imported as raw text (?raw) and
// parsed at build/runtime — they are never mutated. Plant identity and the
// reporting period come from the filename, per the spec, not from any column.
import { parseCsv } from './csv.js'

import fac001 from '../data/TC-FAC-001_2026_Q1.csv?raw'
import fac002 from '../data/TC-FAC-002_2026_Q1.csv?raw'
import fac003 from '../data/TC-FAC-003_2026_Q1.csv?raw'
import fac004 from '../data/TC-FAC-004_2026_Q1.csv?raw'
import fac005 from '../data/TC-FAC-005_2026_Q1.csv?raw'
import registerRaw from '../data/emission_factor_register_2025.csv?raw'

export const REPORTING_PERIOD = '2026 Q1'

// Plant identity is derived from the filename, never from a column.
export const PLANT_FILES = [
  { id: 'TC-FAC-001', file: 'TC-FAC-001_2026_Q1.csv', raw: fac001 },
  { id: 'TC-FAC-002', file: 'TC-FAC-002_2026_Q1.csv', raw: fac002 },
  { id: 'TC-FAC-003', file: 'TC-FAC-003_2026_Q1.csv', raw: fac003 },
  { id: 'TC-FAC-004', file: 'TC-FAC-004_2026_Q1.csv', raw: fac004 },
  { id: 'TC-FAC-005', file: 'TC-FAC-005_2026_Q1.csv', raw: fac005 },
]

export const PLANT_IDS = PLANT_FILES.map((p) => p.id)

// Activity rows per plant, with plant + period stamped from the filename.
export const activityByPlant = PLANT_FILES.map(({ id, raw }) => ({
  plantId: id,
  period: REPORTING_PERIOD,
  rows: parseCsv(raw).map((r) => ({
    category: r.category,
    fuel_or_substance: r.fuel_or_substance,
    unit: r.unit,
    quantity: Number(r.quantity),
  })),
}))

// Emission factor register.
export const factors = parseCsv(registerRaw).map((r) => ({
  ef_id: r.ef_id,
  ef_year: r.ef_year,
  scope: r.scope,
  category: r.category,
  fuel_or_substance: r.fuel_or_substance,
  unit: r.unit,
  ef_kgco2e: Number(r.ef_kgco2e),
  reporting_treatment: r.reporting_treatment,
  status: r.status,
  provisional_rationale: r.provisional_rationale,
  source: r.source,
  applies_to: r.applies_to,
  ef_state: r.ef_state,
}))
