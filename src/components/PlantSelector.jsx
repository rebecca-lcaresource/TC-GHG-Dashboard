export default function PlantSelector({ value, onChange, plantIds }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
      <label
        htmlFor="plant-select"
        className="panel-title text-charcoal/70"
      >
        Scope
      </label>
      <div className="relative">
        <select
          id="plant-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl border border-teal/20 bg-white px-4 py-2.5 pr-10 font-heading text-base font-semibold text-teal shadow-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/30 sm:w-72"
        >
          <option value="ALL">All Plants (Total)</option>
          {plantIds.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-teal"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  )
}
