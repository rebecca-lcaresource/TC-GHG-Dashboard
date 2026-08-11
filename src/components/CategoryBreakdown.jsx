import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { fmtT } from '../lib/format.js'
import { categoryColor, CHARCOAL } from '../lib/ui.js'

function ChartTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null
  const d = payload[0].payload
  return (
    <div className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm shadow-md">
      <div className="font-heading font-semibold text-teal">{d.category}</div>
      <div className="text-charcoal/70">{d.scope}</div>
      <div className="tnum mt-1 font-semibold text-charcoal">{fmtT(d.tco2e)} tCO₂e</div>
    </div>
  )
}

export default function CategoryBreakdown({ result }) {
  const data = result.categories

  if (data.length === 0) {
    return (
      <section className="panel p-6">
        <h2 className="panel-title">By-category breakdown</h2>
        <p className="mt-4 text-sm text-charcoal/60">
          No activity for this selection.
        </p>
      </section>
    )
  }

  return (
    <section className="panel p-6">
      <div className="flex items-baseline justify-between">
        <h2 className="panel-title">By-category breakdown</h2>
        <span className="text-xs text-charcoal/50">tCO₂e</span>
      </div>

      <div className="mt-6 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
            <XAxis
              dataKey="category"
              tick={{ fill: CHARCOAL, fontSize: 11 }}
              tickFormatter={(v) => (v.length > 14 ? v.slice(0, 12) + '…' : v)}
              interval={0}
              axisLine={{ stroke: '#00000020' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: CHARCOAL, fontSize: 11 }}
              tickFormatter={(v) => v.toLocaleString('en-US')}
              axisLine={false}
              tickLine={false}
              width={64}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: '#00000008' }} />
            <Bar dataKey="tco2e" radius={[6, 6, 0, 0]} maxBarSize={72}>
              {data.map((d) => (
                <Cell key={d.category} fill={categoryColor(d.category)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <table className="mt-4 w-full text-sm">
        <thead>
          <tr className="border-b border-black/10 text-left text-charcoal/60">
            <th className="py-2 font-heading text-xs font-semibold uppercase tracking-wider">
              Category
            </th>
            <th className="py-2 font-heading text-xs font-semibold uppercase tracking-wider">
              Scope
            </th>
            <th className="py-2 text-right font-heading text-xs font-semibold uppercase tracking-wider">
              tCO₂e
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.category} className="border-b border-black/5 last:border-0">
              <td className="py-2">
                <span className="inline-flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-sm"
                    style={{ background: categoryColor(d.category) }}
                  />
                  {d.category}
                </span>
              </td>
              <td className="py-2 text-charcoal/70">{d.scope}</td>
              <td className="tnum py-2 text-right font-semibold text-charcoal">
                {fmtT(d.tco2e)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}
