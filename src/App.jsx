import { useMemo, useRef, useState } from 'react'
import { computeModel } from './lib/calc.js'
import { downloadCsv } from './lib/exportCsv.js'
import { downloadPdf } from './lib/exportPdf.js'
import Header from './components/Header.jsx'
import PlantSelector from './components/PlantSelector.jsx'
import HeadlineMetrics from './components/HeadlineMetrics.jsx'
import CategoryBreakdown from './components/CategoryBreakdown.jsx'
import SourcesPanel from './components/SourcesPanel.jsx'
import DataQualityPanel from './components/DataQualityPanel.jsx'
import ExportControls from './components/ExportControls.jsx'
import Footer from './components/Footer.jsx'
import PdfDocument from './components/PdfDocument.jsx'

// The full model is computed once from the bundled data; selection only slices.
const MODEL = computeModel()

function todayLabel() {
  return new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function App() {
  const [selection, setSelection] = useState('ALL')
  const [busy, setBusy] = useState(false)
  const pdfRef = useRef(null)
  const generatedOn = useMemo(todayLabel, [])

  const result = selection === 'ALL' ? MODEL.all : MODEL.plants[selection]
  const scopeLabel = selection === 'ALL' ? 'All Plants (Total)' : selection

  const handleCsv = () => downloadCsv(MODEL)

  const handlePdf = async () => {
    if (!pdfRef.current) return
    setBusy(true)
    try {
      // Let fonts settle before capture.
      if (document.fonts && document.fonts.ready) await document.fonts.ready
      const suffix = selection === 'ALL' ? 'all-plants' : selection
      await downloadPdf(pdfRef.current, `TC_GHG_2026_Q1_${suffix}.pdf`)
    } catch (err) {
      // Surface failure rather than failing silently.
      // eslint-disable-next-line no-alert
      alert('PDF generation failed. Please try again.')
      // eslint-disable-next-line no-console
      console.error(err)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-ground">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
        <Header />

        <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:items-end sm:justify-between">
          <PlantSelector value={selection} onChange={setSelection} plantIds={MODEL.plantIds} />
          <ExportControls onPdf={handlePdf} onCsv={handleCsv} busy={busy} />
        </div>

        <div className="mt-6">
          <HeadlineMetrics result={result} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CategoryBreakdown result={result} />
          <SourcesPanel result={result} />
        </div>

        <div className="mt-6">
          <DataQualityPanel result={result} />
        </div>

        <Footer generatedOn={generatedOn} />
      </div>

      {/* Off-screen print surface captured for the PDF export. */}
      <div
        aria-hidden="true"
        style={{ position: 'fixed', left: -10000, top: 0, pointerEvents: 'none' }}
      >
        <PdfDocument ref={pdfRef} result={result} scopeLabel={scopeLabel} generatedOn={generatedOn} />
      </div>
    </div>
  )
}
