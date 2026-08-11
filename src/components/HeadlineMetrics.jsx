import { fmtT } from '../lib/format.js'

function Metric({ label, value, sub, emphasis }) {
  return (
    <div
      className={`panel flex flex-col justify-between p-6 ${
        emphasis ? 'bg-teal text-white ring-teal/30' : ''
      }`}
    >
      <div
        className={`panel-title ${emphasis ? 'text-white/75' : 'text-charcoal/60'}`}
      >
        {label}
      </div>
      <div className="mt-4">
        <div
          className={`tnum font-heading text-4xl font-semibold leading-none sm:text-5xl ${
            emphasis ? 'text-white' : 'text-teal'
          }`}
        >
          {fmtT(value)}
        </div>
        <div
          className={`mt-2 text-sm ${emphasis ? 'text-white/70' : 'text-charcoal/60'}`}
        >
          {sub}
        </div>
      </div>
    </div>
  )
}

export default function HeadlineMetrics({ result }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <Metric label="Scope 1" value={result.scope1} sub="tCO₂e · direct emissions" />
      <Metric
        label="Scope 2"
        value={result.scope2}
        sub="tCO₂e · purchased energy (location-based)"
      />
      <Metric
        label="Combined"
        value={result.combined}
        sub="tCO₂e · Scope 1 + Scope 2"
        emphasis
      />
    </div>
  )
}
