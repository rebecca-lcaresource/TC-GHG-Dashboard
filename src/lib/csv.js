// Minimal, correct CSV parser that handles quoted fields containing commas
// (e.g. the register's applies_to value "TC-FAC-001, 003, 004, 005").
// The six source CSVs are read-only inputs — this only reads them.

function parseLine(line) {
  const out = []
  let field = ''
  let inQuotes = false
  for (let i = 0; i < line.length; i++) {
    const c = line[i]
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += c
      }
    } else if (c === '"') {
      inQuotes = true
    } else if (c === ',') {
      out.push(field)
      field = ''
    } else {
      field += c
    }
  }
  out.push(field)
  return out
}

// Parse a CSV string into an array of row objects keyed by header.
export function parseCsv(text) {
  const lines = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter((l) => l.trim().length > 0)
  if (lines.length === 0) return []
  const headers = parseLine(lines[0]).map((h) => h.trim())
  return lines.slice(1).map((line) => {
    const cells = parseLine(line)
    const row = {}
    headers.forEach((h, i) => {
      row[h] = (cells[i] ?? '').trim()
    })
    return row
  })
}
