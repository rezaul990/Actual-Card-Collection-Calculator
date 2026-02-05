import { useRef } from 'react'
import * as XLSX from 'xlsx'
import html2canvas from 'html2canvas'

function ActionButtons({ data, onReset, activeTab, containerRef }) {
  const handleSaveImage = async () => {
    if (!containerRef.current) return

    const btnContainer = containerRef.current.querySelector('.btn-container')
    if (btnContainer) btnContainer.style.display = 'none'

    try {
      const canvas = await html2canvas(containerRef.current, {
        backgroundColor: '#ffffff',
        scale: 3,
        useCORS: true,
        logging: false,
      })

      const link = document.createElement('a')
      link.download = `Collection_Report_${new Date().toISOString().slice(0, 10)}.png`
      link.href = canvas.toDataURL('image/png', 1.0)
      link.click()
    } finally {
      if (btnContainer) btnContainer.style.display = 'flex'
    }
  }

  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new()

    // Add current report
    const currentData = data.result
    const currentWs = XLSX.utils.json_to_sheet(
      Object.entries(currentData).map(([plaza, values]) => ({
        'Plaza Name': plaza,
        'AC Qty': values.plazaQty,
        'Collection Achieve Qty (> 0)': values.collectionQty,
        'Not Collected Qty': values.plazaQty - values.collectionQty,
        'Coll %': ((values.collectionQty / values.plazaQty) * 100).toFixed(2) + '%',
      }))
    )
    XLSX.utils.book_append_sheet(wb, currentWs, 'Current Report')

    // Add monthly reports
    const months = Object.keys(data.monthlyData).sort().reverse()
    for (let i = 0; i < 4 && i < months.length; i++) {
      const month = months[i]
      const monthData = data.monthlyData[month]
      const monthWs = XLSX.utils.json_to_sheet(
        Object.entries(monthData).map(([plaza, values]) => ({
          'Plaza Name': plaza,
          'AC Qty': values.plazaQty,
          'Collection Achieve Qty (> 0)': values.collectionQty,
          'Not Collected Qty': values.plazaQty - values.collectionQty,
          'Coll %': ((values.collectionQty / values.plazaQty) * 100).toFixed(2) + '%',
        }))
      )
      XLSX.utils.book_append_sheet(wb, monthWs, month)
    }

    // Add yearly reports
    const year2024Data = data.yearlyData[2024]
    const year2024Ws = XLSX.utils.json_to_sheet(
      Object.entries(year2024Data).map(([plaza, values]) => ({
        'Plaza Name': plaza,
        'AC Qty': values.plazaQty,
        'Collection Achieve Qty (> 0)': values.collectionQty,
        'Not Collected Qty': values.plazaQty - values.collectionQty,
        'Coll %': ((values.collectionQty / values.plazaQty) * 100).toFixed(2) + '%',
      }))
    )
    XLSX.utils.book_append_sheet(wb, year2024Ws, '2024 Account')

    const year2025Data = data.yearlyData[2025]
    const year2025Ws = XLSX.utils.json_to_sheet(
      Object.entries(year2025Data).map(([plaza, values]) => ({
        'Plaza Name': plaza,
        'AC Qty': values.plazaQty,
        'Collection Achieve Qty (> 0)': values.collectionQty,
        'Not Collected Qty': values.plazaQty - values.collectionQty,
        'Coll %': ((values.collectionQty / values.plazaQty) * 100).toFixed(2) + '%',
      }))
    )
    XLSX.utils.book_append_sheet(wb, year2025Ws, '2025 Account')

    // Add 2025 Month Wise report
    const monthlyData2025 = data.monthlyData2025
    const months2025 = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const allPlazas = new Set()
    months2025.forEach(month => {
      const plazas = monthlyData2025[month] || {}
      Object.keys(plazas).forEach(plaza => allPlazas.add(plaza))
    })

    const plazaList = Array.from(allPlazas).sort()
    const month2025Data = plazaList.map(plaza => {
      const row = { 'Plaza Name': plaza }
      months2025.forEach(month => {
        const plazas = monthlyData2025[month] || {}
        const values = plazas[plaza]
        if (values) {
          row[month] = values.plazaQty
        }
      })
      return row
    })

    const month2025Ws = XLSX.utils.json_to_sheet(month2025Data)
    XLSX.utils.book_append_sheet(wb, month2025Ws, '2025 Month Wise')

    // Add 2025 Not Collected report
    const notcoll2025Data = plazaList.map(plaza => {
      const row = { 'Plaza Name': plaza }
      months2025.forEach(month => {
        const plazas = monthlyData2025[month] || {}
        const values = plazas[plaza]
        if (values) {
          row[month] = values.plazaQty - values.collectionQty
        }
      })
      return row
    })

    const notcoll2025Ws = XLSX.utils.json_to_sheet(notcoll2025Data)
    XLSX.utils.book_append_sheet(wb, notcoll2025Ws, '2025 Not Collected')

    XLSX.writeFile(wb, `Collection_Report_${new Date().toISOString().slice(0, 10)}.xlsx`)
  }

  return (
    <div className="btn-container">
      <button className="btn btn-save" onClick={handleSaveImage}>
        📷 Save as Image
      </button>
      <button className="btn btn-excel" onClick={handleDownloadExcel}>
        📊 Download Excel
      </button>
      <button className="btn btn-reset" onClick={onReset}>
        Upload Another File
      </button>
    </div>
  )
}

export default ActionButtons
