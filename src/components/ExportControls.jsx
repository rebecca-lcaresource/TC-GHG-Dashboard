export default function ExportControls({ onPdf, onCsv, busy }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={onPdf}
        disabled={busy}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal px-5 py-3 font-heading text-sm font-semibold text-white shadow-sm transition hover:bg-teal/90 disabled:cursor-wait disabled:opacity-60"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M10 1a1 1 0 011 1v8.586l2.293-2.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 10.586V2a1 1 0 011-1z" />
          <path d="M3 15a1 1 0 011 1v1h12v-1a1 1 0 112 0v2a1 1 0 01-1 1H3a1 1 0 01-1-1v-2a1 1 0 011-1z" />
        </svg>
        {busy ? 'Preparing PDF…' : 'Download PDF snapshot'}
      </button>
      <button
        type="button"
        onClick={onCsv}
        disabled={busy}
        className="inline-flex items-center justify-center gap-2 rounded-xl border border-teal/30 bg-white px-5 py-3 font-heading text-sm font-semibold text-teal shadow-sm transition hover:bg-teal/5 disabled:opacity-60"
      >
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm2 4h8v2H6V7zm0 4h8v2H6v-2z" />
        </svg>
        Download CSV of totals
      </button>
    </div>
  )
}
