import { PERIOD } from '../lib/calc.js'

export default function Footer({ generatedOn }) {
  return (
    <footer className="mt-4 border-t border-charcoal/10 pt-6 text-xs leading-relaxed text-charcoal/60">
      <p>
        Calculated per the GHG Protocol Corporate Standard. Scope 2 reported
        location-based. Emission factors from the 2025 register. Reporting period{' '}
        {PERIOD}.
      </p>
      <p className="mt-1">Generated {generatedOn} · LCA Resource</p>
    </footer>
  )
}
