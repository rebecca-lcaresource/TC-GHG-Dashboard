import logo from '/assets/lca-resource-logo.png'
import { PERIOD } from '../lib/calc.js'

export default function Header() {
  return (
    <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <img
          src={logo}
          alt="LCA Resource"
          className="h-16 w-16 shrink-0 object-contain sm:h-20 sm:w-20"
        />
        <div>
          <h1 className="text-2xl font-semibold leading-tight text-teal sm:text-3xl">
            TC GHG Accounting Dashboard
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-charcoal/80">
            Calculated per the GHG Protocol Corporate Standard · Scope 2 reported
            location-based.
          </p>
        </div>
      </div>
      <div className="shrink-0 rounded-xl bg-teal px-5 py-3 text-center text-white shadow-sm">
        <div className="text-[0.7rem] font-heading font-semibold uppercase tracking-[0.2em] text-white/70">
          Reporting period
        </div>
        <div className="font-heading text-xl font-semibold tracking-wide">{PERIOD}</div>
      </div>
    </header>
  )
}
