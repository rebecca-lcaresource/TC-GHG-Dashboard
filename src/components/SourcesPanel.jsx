import { fmtFactor } from '../lib/format.js'

export default function SourcesPanel({ result }) {
  return (
    <section className="panel p-6">
      <h2 className="panel-title">Emission-factor sources</h2>
      <p className="mt-1 text-xs text-charcoal/50">
        Distinct sources behind the factors applied to this selection.
      </p>
      <ul className="mt-4 space-y-4">
        {result.sources.map((s) => (
          <li key={s.source} className="border-l-2 border-oak/60 pl-3">
            <div className="font-heading text-sm font-semibold text-teal">{s.source}</div>
            <ul className="mt-1 space-y-0.5">
              {s.factors.map((f) => (
                <li key={f.ef_id} className="text-xs text-charcoal/70">
                  <span className="tnum font-medium text-charcoal">{f.ef_id}</span>
                  {' · '}
                  {f.category} — {f.fuel_or_substance}
                  {' · '}
                  <span className="tnum">
                    {fmtFactor(f.ef_kgco2e)} kgCO₂e/{f.unit}
                  </span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  )
}
