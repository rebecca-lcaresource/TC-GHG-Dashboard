import { fmtT } from '../lib/format.js'

function FlagCard({ tone, tag, title, children, contribution }) {
  const tones = {
    gold: 'border-gold/50 bg-gold/10',
    plum: 'border-plum/40 bg-plum/10',
    orange: 'border-orange/50 bg-orange/10',
  }
  const tagTones = {
    gold: 'bg-gold/25 text-charcoal',
    plum: 'bg-plum/20 text-charcoal',
    orange: 'bg-orange/25 text-charcoal',
  }
  return (
    <li className={`rounded-xl border p-4 ${tones[tone]}`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span
          className={`rounded-full px-2.5 py-0.5 font-heading text-[0.65rem] font-semibold uppercase tracking-wider ${tagTones[tone]}`}
        >
          {tag}
        </span>
        {contribution !== undefined && (
          <span className="tnum text-sm font-semibold text-charcoal">
            {fmtT(contribution)} tCO₂e
          </span>
        )}
      </div>
      <div className="mt-2 font-heading text-sm font-semibold text-teal">{title}</div>
      <div className="mt-1 text-xs leading-relaxed text-charcoal/75">{children}</div>
    </li>
  )
}

export default function DataQualityPanel({ result }) {
  const flags = result.flags
  const provisional = flags.filter((f) => f.type === 'provisional')
  const montreal = flags.filter((f) => f.type === 'montreal')
  const unmatched = flags.filter((f) => f.type === 'unmatched')
  const multi = flags.filter((f) => f.type === 'multi')

  const hasAny = flags.length > 0

  return (
    <section className="panel p-6">
      <h2 className="panel-title">Data-quality flags</h2>
      <p className="mt-1 text-xs text-charcoal/50">
        Factors that are not standard verified factors, and any unmatched rows —
        each included in the totals unless noted.
      </p>

      {!hasAny && (
        <p className="mt-4 rounded-xl border border-sage/40 bg-sage/10 p-4 text-sm text-charcoal/70">
          No data-quality flags for this selection — every activity row matched a
          standard verified factor.
        </p>
      )}

      <ul className="mt-4 space-y-3">
        {provisional.map((f, i) => (
          <FlagCard
            key={`prov-${i}`}
            tone="gold"
            tag="Provisional factor"
            title={`${f.plantId} · ${f.category} — ${f.fuel_or_substance} (${f.ef_id})`}
            contribution={f.tco2e}
          >
            Included in the totals. {f.rationale} Source: {f.source}. A more
            accurate, verified factor may be warranted.
          </FlagCard>
        ))}

        {montreal.map((f, i) => (
          <FlagCard
            key={`mtl-${i}`}
            tone="plum"
            tag="Montreal Protocol"
            title={`${f.plantId} · ${f.category} — ${f.fuel_or_substance} (${f.ef_id})`}
            contribution={f.tco2e}
          >
            Included in the totals. This substance falls under Montreal Protocol
            reporting treatment; the viewer can decide how to treat it in the
            inventory.
          </FlagCard>
        ))}

        {unmatched.map((f, i) => (
          <FlagCard
            key={`unm-${i}`}
            tone="orange"
            tag="Unmatched — no factor applied"
            title={`${f.plantId} · ${f.category} — ${f.fuel_or_substance}`}
          >
            No Active factor matched this row ({f.fuel_or_substance} / {f.unit}) for{' '}
            {f.plantId}. It is not counted in the totals and is listed here rather
            than silently dropped.
          </FlagCard>
        ))}

        {multi.map((f, i) => (
          <FlagCard
            key={`mul-${i}`}
            tone="orange"
            tag="Multiple factors matched"
            title={`${f.plantId} · ${f.category} — ${f.fuel_or_substance}`}
          >
            More than one Active factor matched this row ({f.ef_ids.join(', ')}).
            The first was applied; this should be resolved in the register.
          </FlagCard>
        ))}
      </ul>
    </section>
  )
}
