import { forwardRef } from 'react'
import logo from '/assets/lca-resource-logo.png'
import { PERIOD } from '../lib/calc.js'
import { fmtT, fmtFactor } from '../lib/format.js'
import { categoryColor, TEAL, CHARCOAL } from '../lib/ui.js'

// Off-screen A4 print surface. Uses inline styles (not Tailwind utilities) so
// html2canvas captures it deterministically. Rendered for the current scope.
const PdfDocument = forwardRef(function PdfDocument({ result, scopeLabel, generatedOn }, ref) {
  const maxCat = Math.max(1, ...result.categories.map((c) => c.tco2e))

  return (
    <div
      ref={ref}
      className="pdf-surface"
      style={{
        fontFamily: '"EB Garamond", Georgia, serif',
        padding: '40px 44px',
        boxSizing: 'border-box',
        color: CHARCOAL,
      }}
    >
      {/* (1) Header band */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `3px solid ${TEAL}`,
          paddingBottom: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img src={logo} alt="LCA Resource" style={{ height: 64, width: 64, objectFit: 'contain' }} />
          <div>
            <div
              style={{
                fontFamily: '"Open Sans", system-ui, sans-serif',
                fontSize: 22,
                fontWeight: 700,
                color: TEAL,
                lineHeight: 1.15,
              }}
            >
              TC GHG Accounting Dashboard
            </div>
            <div style={{ fontSize: 13, color: '#6b675c', marginTop: 2 }}>
              Scope currently shown: {scopeLabel}
            </div>
          </div>
        </div>
        <div
          style={{
            background: TEAL,
            color: '#fff',
            borderRadius: 8,
            padding: '8px 14px',
            textAlign: 'center',
            fontFamily: '"Open Sans", system-ui, sans-serif',
          }}
        >
          <div style={{ fontSize: 9, letterSpacing: 2, textTransform: 'uppercase', opacity: 0.75 }}>
            Reporting period
          </div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{PERIOD}</div>
        </div>
      </div>

      {/* (2) Methodology line */}
      <div style={{ fontSize: 12, color: '#6b675c', marginTop: 12, marginBottom: 20 }}>
        GHG Protocol Corporate Standard · Scope 2 location-based
      </div>

      {/* (3) Headline totals */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Scope 1', value: result.scope1, emphasis: false },
          { label: 'Scope 2', value: result.scope2, emphasis: false },
          { label: 'Combined', value: result.combined, emphasis: true },
        ].map((m) => (
          <div
            key={m.label}
            style={{
              flex: 1,
              background: m.emphasis ? TEAL : '#F4F3F2',
              color: m.emphasis ? '#fff' : CHARCOAL,
              border: m.emphasis ? 'none' : '1px solid #e0dfdd',
              borderRadius: 10,
              padding: '14px 16px',
            }}
          >
            <div
              style={{
                fontFamily: '"Open Sans", system-ui, sans-serif',
                fontSize: 10,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                opacity: m.emphasis ? 0.8 : 0.55,
              }}
            >
              {m.label}
            </div>
            <div
              style={{
                fontFamily: '"Open Sans", system-ui, sans-serif',
                fontSize: 30,
                fontWeight: 700,
                marginTop: 6,
                fontVariantNumeric: 'tabular-nums',
                color: m.emphasis ? '#fff' : TEAL,
              }}
            >
              {fmtT(m.value)}
            </div>
            <div style={{ fontSize: 11, marginTop: 2, opacity: m.emphasis ? 0.75 : 0.55 }}>tCO₂e</div>
          </div>
        ))}
      </div>

      {/* (4) By-category breakdown */}
      <SectionTitle>By-category breakdown</SectionTitle>
      {result.categories.length === 0 ? (
        <div style={{ fontSize: 12, color: '#6b675c', marginBottom: 20 }}>No activity for this selection.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 22 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #d9d8d5', textAlign: 'left', color: '#6b675c' }}>
              <th style={{ padding: '6px 0', fontFamily: '"Open Sans", sans-serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                Category
              </th>
              <th style={{ padding: '6px 0', fontFamily: '"Open Sans", sans-serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                Scope
              </th>
              <th style={{ width: '38%' }}></th>
              <th style={{ padding: '6px 0', textAlign: 'right', fontFamily: '"Open Sans", sans-serif', fontSize: 10, textTransform: 'uppercase', letterSpacing: 1 }}>
                tCO₂e
              </th>
            </tr>
          </thead>
          <tbody>
            {result.categories.map((c) => (
              <tr key={c.category} style={{ borderBottom: '1px solid #efeeec' }}>
                <td style={{ padding: '7px 0' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: categoryColor(c.category) }}
                    />
                    {c.category}
                  </span>
                </td>
                <td style={{ padding: '7px 0', color: '#6b675c' }}>{c.scope}</td>
                <td style={{ padding: '7px 10px' }}>
                  <div style={{ background: '#ecebe9', borderRadius: 4, height: 8 }}>
                    <div
                      style={{
                        width: `${(c.tco2e / maxCat) * 100}%`,
                        height: 8,
                        borderRadius: 4,
                        background: categoryColor(c.category),
                      }}
                    />
                  </div>
                </td>
                <td style={{ padding: '7px 0', textAlign: 'right', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                  {fmtT(c.tco2e)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* (5) Emission-factor sources */}
      <SectionTitle>Emission-factor sources</SectionTitle>
      <div style={{ marginBottom: 22 }}>
        {result.sources.map((s) => (
          <div key={s.source} style={{ borderLeft: `2px solid ${categoryColor('Mobile Combustion')}`, paddingLeft: 10, marginBottom: 10 }}>
            <div style={{ fontFamily: '"Open Sans", sans-serif', fontSize: 12, fontWeight: 700, color: TEAL }}>
              {s.source}
            </div>
            {s.factors.map((f) => (
              <div key={f.ef_id} style={{ fontSize: 11, color: '#6b675c', marginTop: 1 }}>
                <b style={{ color: CHARCOAL }}>{f.ef_id}</b> · {f.category} — {f.fuel_or_substance} ·{' '}
                {fmtFactor(f.ef_kgco2e)} kgCO₂e/{f.unit}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* (6) Data-quality flags */}
      <SectionTitle>Data-quality flags</SectionTitle>
      <div style={{ marginBottom: 24 }}>
        {result.flags.length === 0 ? (
          <div style={{ fontSize: 12, color: '#6b675c' }}>
            None — every activity row matched a standard verified factor.
          </div>
        ) : (
          result.flags.map((f, i) => <PdfFlag key={i} flag={f} />)
        )}
      </div>

      {/* (7) Footer */}
      <div style={{ borderTop: '1px solid #d9d8d5', paddingTop: 12, fontSize: 10.5, color: '#8a867b' }}>
        <div>
          GHG Protocol Corporate Standard · Scope 2 location-based · factors from the 2025 register · period {PERIOD}.
        </div>
        <div style={{ marginTop: 2 }}>
          Generated {generatedOn} · Scope shown: {scopeLabel} · LCA Resource
        </div>
      </div>
    </div>
  )
})

function SectionTitle({ children }) {
  return (
    <div
      style={{
        fontFamily: '"Open Sans", system-ui, sans-serif',
        fontSize: 11,
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: 2,
        color: TEAL,
        marginBottom: 8,
      }}
    >
      {children}
    </div>
  )
}

function PdfFlag({ flag }) {
  const map = {
    provisional: { tag: 'Provisional factor', bg: '#FBF3DA', border: '#F0BB44' },
    montreal: { tag: 'Montreal Protocol', bg: '#F3E8EE', border: '#A3648B' },
    unmatched: { tag: 'Unmatched — no factor applied', bg: '#FDECE0', border: '#F8943F' },
    multi: { tag: 'Multiple factors matched', bg: '#FDECE0', border: '#F8943F' },
  }
  const cfg = map[flag.type] || map.unmatched
  return (
    <div
      style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: 8,
        padding: '8px 12px',
        marginBottom: 8,
        fontSize: 11.5,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontFamily: '"Open Sans", sans-serif', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
          {cfg.tag}
        </span>
        {flag.tco2e !== undefined && (
          <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{fmtT(flag.tco2e)} tCO₂e</span>
        )}
      </div>
      <div style={{ fontWeight: 700, color: TEAL, marginTop: 3 }}>
        {flag.plantId} · {flag.category} — {flag.fuel_or_substance}
        {flag.ef_id ? ` (${flag.ef_id})` : ''}
      </div>
      <div style={{ color: '#6b675c', marginTop: 2 }}>
        {flag.type === 'provisional' && `Included in the totals. ${flag.rationale} Source: ${flag.source}.`}
        {flag.type === 'montreal' &&
          'Included in the totals. Substance falls under Montreal Protocol reporting treatment.'}
        {flag.type === 'unmatched' &&
          `No Active factor matched this row (${flag.fuel_or_substance} / ${flag.unit}); not counted in the totals.`}
        {flag.type === 'multi' && `More than one Active factor matched (${(flag.ef_ids || []).join(', ')}).`}
      </div>
    </div>
  )
}

export default PdfDocument
