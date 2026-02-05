/**
 * Export Service - Handles Excel and Image exports
 */

import * as XLSX from 'xlsx'
import html2canvas from 'html2canvas'

export async function exportAsImage(containerRef) {
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

export function exportAsExcel(data) {
  const wb = XLSX.utils.book_new()

  // Current Report
  addCurrentReportSheet(wb, data.result)

  // Monthly Reports
  addMonthlyReportSheets(wb, data.monthlyData)

  // Yearly Reports
  addYearlyReportSheets(wb, data.yearlyData)

  // 2025 Month Wise
  add2025MonthWiseSheet(wb, data.monthlyData2025)

  // 2025 Not Collected
  add2025NotCollectedSheet(wb, data.monthlyData2025)

  // 2024 Month Wise Not Collected
  if (data.monthlyData2024) {
    add2024MonthWiseNotCollectedSheet(wb, data.monthlyData2024)
  }

  // 2024 Not Collected
  add2024NotCollectedSheet(wb, data.yearlyData[2024])

  // 2025 Account List
  addAccountListSheet(wb, data.yearlyData[2025], '2025 Account List')

  // 2024 Account List
  addAccountListSheet(wb, data.yearlyData[2024], '2024 Account List')

  // 2025 Detailed Account List (for managers)
  if (data.accountDetails2025 && data.accountDetails2025.length > 0) {
    addDetailedAccountSheet(wb, data.accountDetails2025, '2025 Detailed Accounts')
  }

  // 2024 Detailed Account List (for managers)
  if (data.accountDetails2024 && data.accountDetails2024.length > 0) {
    addDetailedAccountSheet(wb, data.accountDetails2024, '2024 Detailed Accounts')
  }

  XLSX.writeFile(wb, `Collection_Report_${new Date().toISOString().slice(0, 10)}.xlsx`)
}

function addCurrentReportSheet(wb, data) {
  const wsData = Object.entries(data).map(([plaza, values]) => ({
    'Plaza Name': plaza,
    'AC Qty': values.plazaQty,
    'Collection Achieve Qty (> 0)': values.collectionQty,
    'Not Collected Qty': values.plazaQty - values.collectionQty,
    'Coll %': ((values.collectionQty / values.plazaQty) * 100).toFixed(2) + '%',
  }))

  const ws = XLSX.utils.json_to_sheet(wsData)
  XLSX.utils.book_append_sheet(wb, ws, 'Current Report')
}

function addMonthlyReportSheets(wb, monthlyData) {
  const months = Object.keys(monthlyData).sort().reverse()

  for (let i = 0; i < 4 && i < months.length; i++) {
    const month = months[i]
    const monthData = monthlyData[month]

    const wsData = Object.entries(monthData).map(([plaza, values]) => ({
      'Plaza Name': plaza,
      'AC Qty': values.plazaQty,
      'Collection Achieve Qty (> 0)': values.collectionQty,
      'Not Collected Qty': values.plazaQty - values.collectionQty,
      'Coll %': ((values.collectionQty / values.plazaQty) * 100).toFixed(2) + '%',
    }))

    const ws = XLSX.utils.json_to_sheet(wsData)
    XLSX.utils.book_append_sheet(wb, ws, month)
  }
}

function addYearlyReportSheets(wb, yearlyData) {
  [2024, 2025].forEach(year => {
    const yearData = yearlyData[year]

    const wsData = Object.entries(yearData).map(([plaza, values]) => ({
      'Plaza Name': plaza,
      'AC Qty': values.plazaQty,
      'Collection Achieve Qty (> 0)': values.collectionQty,
      'Not Collected Qty': values.plazaQty - values.collectionQty,
      'Coll %': ((values.collectionQty / values.plazaQty) * 100).toFixed(2) + '%',
    }))

    const ws = XLSX.utils.json_to_sheet(wsData)
    XLSX.utils.book_append_sheet(wb, ws, `${year} Account`)
  })
}

function add2025MonthWiseSheet(wb, monthlyData2025) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const allPlazas = new Set()
  months.forEach(month => {
    const plazas = monthlyData2025[month] || {}
    Object.keys(plazas).forEach(plaza => allPlazas.add(plaza))
  })

  const plazaList = Array.from(allPlazas).sort()

  // Calculate month totals
  const monthTotals = {}
  months.forEach(month => {
    const plazas = monthlyData2025[month] || {}
    if (Object.keys(plazas).length > 0) {
      let total = 0
      Object.values(plazas).forEach(values => {
        total += values.plazaQty
      })
      monthTotals[month] = total
    }
  })

  // Calculate plaza totals
  const plazaTotals = {}
  plazaList.forEach(plaza => {
    let total = 0
    months.forEach(month => {
      const plazas = monthlyData2025[month] || {}
      const values = plazas[plaza]
      if (values) {
        total += values.plazaQty
      }
    })
    plazaTotals[plaza] = total
  })

  // Calculate grand total
  let grandTotal = 0
  Object.values(plazaTotals).forEach(total => {
    grandTotal += total
  })

  // Build data with totals
  const wsData = plazaList.map(plaza => {
    const row = { 'Plaza Name': plaza }
    months.forEach(month => {
      const plazas = monthlyData2025[month] || {}
      const values = plazas[plaza]
      row[month] = values ? values.plazaQty : '-'
    })
    row['Total'] = plazaTotals[plaza]
    return row
  })

  // Add totals row
  const totalsRow = { 'Plaza Name': 'Total' }
  months.forEach(month => {
    totalsRow[month] = monthTotals[month] || '-'
  })
  totalsRow['Total'] = grandTotal
  wsData.push(totalsRow)

  const ws = XLSX.utils.json_to_sheet(wsData)
  XLSX.utils.book_append_sheet(wb, ws, '2025 Month Wise')
}

function add2025NotCollectedSheet(wb, monthlyData2025) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const allPlazas = new Set()
  months.forEach(month => {
    const plazas = monthlyData2025[month] || {}
    Object.keys(plazas).forEach(plaza => allPlazas.add(plaza))
  })

  const plazaList = Array.from(allPlazas).sort()
  
  // Calculate totals
  const monthTotals = {}
  months.forEach(month => {
    const plazas = monthlyData2025[month] || {}
    if (Object.keys(plazas).length > 0) {
      let total = 0
      Object.values(plazas).forEach(values => {
        total += values.plazaQty - values.collectionQty
      })
      monthTotals[month] = total
    }
  })

  let grandTotal = 0
  Object.values(monthTotals).forEach(total => {
    grandTotal += total
  })

  const plazaTotals = {}
  plazaList.forEach(plaza => {
    let total = 0
    months.forEach(month => {
      const plazas = monthlyData2025[month] || {}
      const values = plazas[plaza]
      if (values) {
        total += values.plazaQty - values.collectionQty
      }
    })
    plazaTotals[plaza] = total
  })

  // Build data with totals
  const wsData = plazaList.map(plaza => {
    const row = { 'Plaza Name': plaza }
    months.forEach(month => {
      const plazas = monthlyData2025[month] || {}
      const values = plazas[plaza]
      row[month] = values ? values.plazaQty - values.collectionQty : '-'
    })
    row['Total'] = plazaTotals[plaza]
    return row
  })

  // Add totals row
  const totalsRow = { 'Plaza Name': 'Total' }
  months.forEach(month => {
    totalsRow[month] = monthTotals[month] || '-'
  })
  totalsRow['Total'] = grandTotal
  wsData.push(totalsRow)

  const ws = XLSX.utils.json_to_sheet(wsData)
  XLSX.utils.book_append_sheet(wb, ws, '2025 Not Collected')
}

function add2024NotCollectedSheet(wb, yearlyData2024) {
  if (!yearlyData2024 || Object.keys(yearlyData2024).length === 0) {
    return
  }

  const wsData = Object.entries(yearlyData2024).map(([plaza, values]) => ({
    'Plaza Name': plaza,
    'AC Qty': values.plazaQty,
    'Collection Achieve Qty (> 0)': values.collectionQty,
    'Not Collected Qty': values.plazaQty - values.collectionQty,
  }))

  // Calculate totals
  let totalQty = 0
  let totalCollection = 0

  Object.values(yearlyData2024).forEach(values => {
    totalQty += values.plazaQty
    totalCollection += values.collectionQty
  })

  const totalNotCollected = totalQty - totalCollection

  // Add totals row
  wsData.push({
    'Plaza Name': 'Total',
    'AC Qty': totalQty,
    'Collection Achieve Qty (> 0)': totalCollection,
    'Not Collected Qty': totalNotCollected,
  })

  const ws = XLSX.utils.json_to_sheet(wsData)
  XLSX.utils.book_append_sheet(wb, ws, '2024 Not Collected')
}

function add2024MonthWiseNotCollectedSheet(wb, monthlyData2024) {
  if (!monthlyData2024 || Object.keys(monthlyData2024).length === 0) {
    return
  }

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const allPlazas = new Set()
  months.forEach(month => {
    const plazas = monthlyData2024[month] || {}
    Object.keys(plazas).forEach(plaza => allPlazas.add(plaza))
  })

  const plazaList = Array.from(allPlazas).sort()

  // Calculate month totals
  const monthTotals = {}
  months.forEach(month => {
    const plazas = monthlyData2024[month] || {}
    if (Object.keys(plazas).length > 0) {
      let total = 0
      Object.values(plazas).forEach(values => {
        total += values.plazaQty - values.collectionQty
      })
      monthTotals[month] = total
    }
  })

  // Calculate plaza totals
  const plazaTotals = {}
  plazaList.forEach(plaza => {
    let total = 0
    months.forEach(month => {
      const plazas = monthlyData2024[month] || {}
      const values = plazas[plaza]
      if (values) {
        total += values.plazaQty - values.collectionQty
      }
    })
    plazaTotals[plaza] = total
  })

  // Calculate grand total
  let grandTotal = 0
  Object.values(plazaTotals).forEach(total => {
    grandTotal += total
  })

  // Build data with totals (only not collected qty)
  const wsData = plazaList.map(plaza => {
    const row = { 'Plaza Name': plaza }
    months.forEach(month => {
      const plazas = monthlyData2024[month] || {}
      const values = plazas[plaza]
      row[month] = values ? values.plazaQty - values.collectionQty : '-'
    })
    row['Total'] = plazaTotals[plaza]
    return row
  })

  // Add totals row
  const totalsRow = { 'Plaza Name': 'Total' }
  months.forEach(month => {
    totalsRow[month] = monthTotals[month] || '-'
  })
  totalsRow['Total'] = grandTotal
  wsData.push(totalsRow)

  const ws = XLSX.utils.json_to_sheet(wsData)
  XLSX.utils.book_append_sheet(wb, ws, '2024 Month Wise Not Collected')
}

function addAccountListSheet(wb, yearlyData, sheetName) {
  if (!yearlyData || Object.keys(yearlyData).length === 0) {
    return
  }

  const wsData = Object.entries(yearlyData)
    .map(([plaza, values]) => {
      const notCollected = values.plazaQty - values.collectionQty
      return {
        'Plaza Name': plaza,
        'AC Qty': values.plazaQty,
        'Collection Achieve Qty': values.collectionQty,
        'Not Collected Qty': notCollected,
        'Coll %': ((values.collectionQty / values.plazaQty) * 100).toFixed(2) + '%',
      }
    })
    .filter(row => parseInt(row['Not Collected Qty']) > 0) // Only show accounts with not collected qty
    .sort((a, b) => {
      const notCollectedA = parseInt(a['Not Collected Qty'])
      const notCollectedB = parseInt(b['Not Collected Qty'])
      return notCollectedB - notCollectedA // Sort by not collected qty descending
    })

  // Calculate totals from filtered data
  let totalQty = 0
  let totalCollection = 0
  let totalNotCollected = 0

  wsData.forEach(row => {
    totalQty += parseInt(row['AC Qty'])
    totalCollection += parseInt(row['Collection Achieve Qty'])
    totalNotCollected += parseInt(row['Not Collected Qty'])
  })

  const totalPercent = totalQty > 0 ? ((totalCollection / totalQty) * 100).toFixed(2) : '0.00'

  // Add totals row
  wsData.push({
    'Plaza Name': 'Total',
    'AC Qty': totalQty,
    'Collection Achieve Qty': totalCollection,
    'Not Collected Qty': totalNotCollected,
    'Coll %': totalPercent + '%',
  })

  const ws = XLSX.utils.json_to_sheet(wsData)
  XLSX.utils.book_append_sheet(wb, ws, sheetName)
}

function addDetailedAccountSheet(wb, accountDetails, sheetName) {
  if (!accountDetails || accountDetails.length === 0) {
    return
  }

  // Sort by plaza and then by amount descending
  const sortedAccounts = accountDetails.sort((a, b) => {
    if (a.plaza !== b.plaza) {
      return a.plaza.localeCompare(b.plaza)
    }
    return (parseInt(b.amount) || 0) - (parseInt(a.amount) || 0)
  })

  const wsData = sortedAccounts.map(account => ({
    'Division': account.division,
    'Area': account.area,
    'Plaza': account.plaza,
    'Account No.': account.accountNo,
    'Customer Name': account.customerName,
    'Product Category': account.productCategory,
    'Assign Person ID': account.assignPersonId,
    'Invoice No.': account.invoiceNo,
    'Invoice Date': account.invoiceDate,
    'Matured Date': account.maturedDate,
    'Per Month Schedule': account.perMonthSchedule,
    'Amount': account.amount,
    'Previous Month Overdue': account.previousMonthOverdue,
    'Collection Target': account.collectionTarget,
    'Collection Achieve': account.collectionAchieve,
  }))

  const ws = XLSX.utils.json_to_sheet(wsData)
  
  // Set column widths for better readability
  ws['!cols'] = [
    { wch: 15 }, // Division
    { wch: 15 }, // Area
    { wch: 25 }, // Plaza
    { wch: 18 }, // Account No.
    { wch: 20 }, // Customer Name
    { wch: 18 }, // Product Category
    { wch: 15 }, // Assign Person ID
    { wch: 20 }, // Invoice No.
    { wch: 12 }, // Invoice Date
    { wch: 12 }, // Matured Date
    { wch: 15 }, // Per Month Schedule
    { wch: 12 }, // Amount
    { wch: 18 }, // Previous Month Overdue
    { wch: 15 }, // Collection Target
    { wch: 15 }, // Collection Achieve
  ]

  XLSX.utils.book_append_sheet(wb, ws, sheetName)
}
