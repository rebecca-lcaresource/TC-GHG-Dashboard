// PDF export — a branded snapshot of the current on-screen selection, rendered
// entirely in the browser from a dedicated off-screen print surface. No server,
// no keys. Captured with html2canvas and paginated into A4 portrait via jsPDF.
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'

export async function downloadPdf(node, filename) {
  const canvas = await html2canvas(node, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
  })

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()

  const imgWidth = pageWidth
  const imgHeight = (canvas.height * imgWidth) / canvas.width

  let heightLeft = imgHeight
  let position = 0
  // High-quality JPEG keeps the file light while staying crisp at scale 2.
  const imgData = canvas.toDataURL('image/jpeg', 0.95)

  pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
  heightLeft -= pageHeight

  while (heightLeft > 0) {
    position -= pageHeight
    pdf.addPage()
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
  }

  pdf.save(filename)
}
