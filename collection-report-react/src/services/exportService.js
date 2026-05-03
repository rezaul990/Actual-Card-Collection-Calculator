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

export async function exportPersonIdReportAsImage(containerRef) {
  if (!containerRef.current) return

  const btnContainer = containerRef.current.querySelector('.btn-container')
  const tabs = containerRef.current.querySelectorAll('.report-tabs, .account-list-section')
  const header = containerRef.current.querySelector('.header')
  const monthHeader = containerRef.current.querySelector('.month-header')
  const devCredits = containerRef.current.querySelectorAll('.developer-credit-top, .developer-credit-bottom')
  const dateTime = containerRef.current.querySelector('.date-time')
  const originalContainer = containerRef.current
  
  // Hide unnecessary elements (but keep developer credits visible)
  if (btnContainer) btnContainer.style.display = 'none'
  tabs.forEach(tab => tab.style.display = 'none')
  if (dateTime) dateTime.style.display = 'none' // Hide timestamp
  
  // Store original header styles
  let originalHeaderStyles = {}
  if (header) {
    originalHeaderStyles = {
      fontSize: header.style.fontSize,
      padding: header.style.padding,
      marginBottom: header.style.marginBottom,
    }
    // Make header VERY small to maximize table visibility
    header.style.fontSize = '9px'
    header.style.padding = '3px 6px'
    header.style.marginBottom = '2px'
  }

  // Store original styles
  const originalStyles = {
    fontSize: originalContainer.style.fontSize,
    padding: originalContainer.style.padding,
    width: originalContainer.style.width,
    maxWidth: originalContainer.style.maxWidth,
  }

  try {
    // Apply optimized styles for better readability
    originalContainer.style.fontSize = '10px'
    originalContainer.style.padding = '10px'
    originalContainer.style.width = '1400px' // Wider to show all columns without cut-off
    originalContainer.style.maxWidth = '1400px'
    
    // Make table more compact
    const tables = originalContainer.querySelectorAll('.report-table')
    const headers = originalContainer.querySelectorAll('.report-table th')
    const cells = originalContainer.querySelectorAll('.report-table td')
    const plazaCells = originalContainer.querySelectorAll('.report-table td:first-child')
    
    const originalTableStyles = []
    tables.forEach(table => {
      originalTableStyles.push({
        fontSize: table.style.fontSize,
        marginBottom: table.style.marginBottom,
      })
      table.style.fontSize = '10px'
      table.style.marginBottom = '0'
    })
    
    const originalHeaderStyles = []
    headers.forEach(header => {
      originalHeaderStyles.push({
        fontSize: header.style.fontSize,
        padding: header.style.padding,
        whiteSpace: header.style.whiteSpace,
      })
      header.style.fontSize = '12px' // Slightly larger for better readability
      header.style.padding = '7px 5px'
      header.style.lineHeight = '1.2'
      header.style.whiteSpace = 'nowrap'
    })
    
    const originalCellStyles = []
    cells.forEach(cell => {
      originalCellStyles.push({
        fontSize: cell.style.fontSize,
        padding: cell.style.padding,
      })
      cell.style.fontSize = '11px' // Slightly larger for better readability
      cell.style.padding = '6px 5px'
      cell.style.lineHeight = '1.2'
    })
    
    // Make plaza names more compact
    const originalPlazaStyles = []
    plazaCells.forEach(cell => {
      originalPlazaStyles.push({
        fontSize: cell.style.fontSize,
        maxWidth: cell.style.maxWidth,
        overflow: cell.style.overflow,
        textOverflow: cell.style.textOverflow,
        whiteSpace: cell.style.whiteSpace,
      })
      cell.style.fontSize = '10px' // Slightly larger for better readability
      cell.style.maxWidth = '150px'
      cell.style.overflow = 'hidden'
      cell.style.textOverflow = 'ellipsis'
      cell.style.whiteSpace = 'nowrap'
    })
    
    // Style subtotal rows with darker background and white text
    const subtotalRows = originalContainer.querySelectorAll('.subtotal-row')
    const originalSubtotalStyles = []
    subtotalRows.forEach(row => {
      const cells = row.querySelectorAll('td')
      const cellStyles = []
      cells.forEach(cell => {
        cellStyles.push({
          backgroundColor: cell.style.backgroundColor,
          color: cell.style.color,
          fontWeight: cell.style.fontWeight,
        })
        cell.style.backgroundColor = '#1e40af' // Dark blue
        cell.style.color = '#ffffff' // White text
        cell.style.fontWeight = '800'
      })
      originalSubtotalStyles.push(cellStyles)
    })
    
    // Style developer credits for image
    const originalDevCreditStyles = []
    devCredits.forEach(credit => {
      if (credit) {
        originalDevCreditStyles.push({
          fontSize: credit.style.fontSize,
          padding: credit.style.padding,
          marginTop: credit.style.marginTop,
        })
        credit.style.fontSize = '10px'
        credit.style.padding = '4px 0'
        credit.style.marginTop = '8px'
      }
    })
    
    let originalTitleStyles = {}
    if (monthHeader) {
      originalTitleStyles = {
        fontSize: monthHeader.style.fontSize,
        marginBottom: monthHeader.style.marginBottom,
        padding: monthHeader.style.padding,
        display: monthHeader.style.display,
      }
      monthHeader.style.fontSize = '16px'
      monthHeader.style.marginBottom = '10px'
      monthHeader.style.padding = '8px'
    }

    const canvas = await html2canvas(originalContainer, {
      backgroundColor: '#ffffff',
      scale: 2, // Balanced quality and file size
      useCORS: true,
      logging: false,
      width: 1400, // Wider to capture all columns without cut-off
      scrollY: -window.scrollY,
      scrollX: -window.scrollX,
      windowWidth: 1400,
    })

    // Restore original styles
    originalContainer.style.fontSize = originalStyles.fontSize
    originalContainer.style.padding = originalStyles.padding
    originalContainer.style.width = originalStyles.width
    originalContainer.style.maxWidth = originalStyles.maxWidth
    
    if (header) {
      header.style.fontSize = originalHeaderStyles.fontSize
      header.style.padding = originalHeaderStyles.padding
      header.style.marginBottom = originalHeaderStyles.marginBottom
    }
    
    if (dateTime) dateTime.style.display = ''
    
    tables.forEach((table, i) => {
      table.style.fontSize = originalTableStyles[i].fontSize
      table.style.marginBottom = originalTableStyles[i].marginBottom
    })
    
    headers.forEach((header, i) => {
      header.style.fontSize = originalHeaderStyles[i].fontSize
      header.style.padding = originalHeaderStyles[i].padding
      header.style.lineHeight = ''
      header.style.whiteSpace = originalHeaderStyles[i].whiteSpace
    })
    
    cells.forEach((cell, i) => {
      cell.style.fontSize = originalCellStyles[i].fontSize
      cell.style.padding = originalCellStyles[i].padding
      cell.style.lineHeight = ''
    })
    
    plazaCells.forEach((cell, i) => {
      cell.style.fontSize = originalPlazaStyles[i].fontSize
      cell.style.maxWidth = originalPlazaStyles[i].maxWidth
      cell.style.overflow = originalPlazaStyles[i].overflow
      cell.style.textOverflow = originalPlazaStyles[i].textOverflow
      cell.style.whiteSpace = originalPlazaStyles[i].whiteSpace
    })
    
    // Restore subtotal row styles
    subtotalRows.forEach((row, i) => {
      const cells = row.querySelectorAll('td')
      cells.forEach((cell, j) => {
        if (originalSubtotalStyles[i] && originalSubtotalStyles[i][j]) {
          cell.style.backgroundColor = originalSubtotalStyles[i][j].backgroundColor
          cell.style.color = originalSubtotalStyles[i][j].color
          cell.style.fontWeight = originalSubtotalStyles[i][j].fontWeight
        }
      })
    })
    
    if (monthHeader) {
      monthHeader.style.fontSize = originalTitleStyles.fontSize
      monthHeader.style.marginBottom = originalTitleStyles.marginBottom
      monthHeader.style.padding = originalTitleStyles.padding
      monthHeader.style.display = originalTitleStyles.display
    }
    
    // Restore developer credit styles
    devCredits.forEach((credit, i) => {
      if (credit && originalDevCreditStyles[i]) {
        credit.style.fontSize = originalDevCreditStyles[i].fontSize
        credit.style.padding = originalDevCreditStyles[i].padding
        credit.style.marginTop = originalDevCreditStyles[i].marginTop
      }
    })

    const link = document.createElement('a')
    link.download = `Person_ID_Report_${new Date().toISOString().slice(0, 10)}.png`
    link.href = canvas.toDataURL('image/png', 1.0)
    link.click()
  } finally {
    if (btnContainer) btnContainer.style.display = 'flex'
    tabs.forEach(tab => tab.style.display = '')
  }
}

export function exportAsExcel(data, overdueData) {
  const wb = XLSX.utils.book_new()

  // Current Report
  addCurrentReportSheet(wb, data.result)

  // Monthly Reports (Last 6 months)
  addMonthlyReportSheets(wb, data.monthlyData)

  // Yearly Reports
  addYearlyReportSheets(wb, data.yearlyData)

  // 2025 Month Wise
  add2025MonthWiseSheet(wb, data.monthlyData2025)

  // 2025 Not Collected
  add2025NotCollectedSheet(wb, data.monthlyData2025)

  // 2024 Month Wise
  if (data.monthlyData2024) {
    add2024MonthWiseSheet(wb, data.monthlyData2024)
  }

  // 2024 Month Wise Not Collected
  if (data.monthlyData2024) {
    add2024MonthWiseNotCollectedSheet(wb, data.monthlyData2024)
  }

  // 2024 Not Collected
  add2024NotCollectedSheet(wb, data.yearlyData[2024])

  // 2026 Not Collected
  if (data.yearlyData[2026]) {
    add2026NotCollectedSheet(wb, data.yearlyData[2026])
  }

  // 2025 Account List
  addAccountListSheet(wb, data.yearlyData[2025], '2025 Account List')

  // 2024 Account List
  addAccountListSheet(wb, data.yearlyData[2024], '2024 Account List')

  // 2026 Account List
  if (data.yearlyData[2026]) {
    addAccountListSheet(wb, data.yearlyData[2026], '2026 Account List')
  }

  // 2025 Detailed Account List (for managers)
  if (data.accountDetails2025 && data.accountDetails2025.length > 0) {
    addDetailedAccountSheet(wb, data.accountDetails2025, '2025 Detailed Accounts')
  }

  // 2026 Detailed Account List (for managers)
  if (data.accountDetails2026 && data.accountDetails2026.length > 0) {
    addDetailedAccountSheet(wb, data.accountDetails2026, '2026 Detailed Accounts')
  }

  // 2024 Detailed Account List (for managers)
  if (data.accountDetails2024 && data.accountDetails2024.length > 0) {
    addDetailedAccountSheet(wb, data.accountDetails2024, '2024 Detailed Accounts')
  }

  // 2025 Daily Collection Comparison
  if (data.dailyCollectionComparison2025 && data.dailyCollectionComparison2025.length > 0) {
    addDailyCollectionComparisonSheet(wb, data.dailyCollectionComparison2025, '2025 Daily Collection')
  }

  // 2024 Daily Collection Comparison
  if (data.dailyCollectionComparison2024 && data.dailyCollectionComparison2024.length > 0) {
    addDailyCollectionComparisonSheet(wb, data.dailyCollectionComparison2024, '2024 Daily Collection')
  }

  // Target vs Achieve (All Accounts - Combined 2024 & 2025)
  const allAccounts = [
    ...(data.dailyCollectionComparison2025 || []),
    ...(data.dailyCollectionComparison2024 || [])
  ]
  if (allAccounts.length > 0) {
    addTargetAchieveSheet(wb, allAccounts, 'Target vs Achieve')
  }

  // Total No Collection Account List
  if (data.allAccountDetails && data.allAccountDetails.length > 0) {
    addTotalNoCollectionSheet(wb, data.allAccountDetails, 'Total No Collection List')
  }

  // Month 4 No Collection Account List
  if (data.allAccountDetails && data.allAccountDetails.length > 0 && data.monthlyData) {
    const months = Object.keys(data.monthlyData).sort().reverse()
    const month4Key = months[3]
    if (month4Key) {
      // Use the actual month name for the sheet name (e.g., "February 2026 No Collection")
      const sheetName = `${month4Key} No Collection`
      addMonth4NoCollectionSheet(wb, data.allAccountDetails, month4Key, sheetName)
    }
  }

  // 2024 No Collection Account List
  if (data.allAccountDetails && data.allAccountDetails.length > 0) {
    addYearNoCollectionSheet(wb, data.allAccountDetails, 2024, '2024 No Collection List')
  }

  // 2025 No Collection Account List
  if (data.allAccountDetails && data.allAccountDetails.length > 0) {
    addYearNoCollectionSheet(wb, data.allAccountDetails, 2025, '2025 No Collection List')
  }

  // 2026 No Collection Account List
  if (data.allAccountDetails && data.allAccountDetails.length > 0) {
    addYearNoCollectionSheet(wb, data.allAccountDetails, 2026, '2026 No Collection List')
  }

  // Assign Person ID Top Sheet
  if (data.allAccountDetails && data.allAccountDetails.length > 0) {
    addPersonIdTopSheet(wb, data.allAccountDetails, 'Person ID Top Sheet', overdueData)
  }

  // All Account List
  if (data.allAccountDetails && data.allAccountDetails.length > 0) {
    addAllAccountSheet(wb, data.allAccountDetails, 'All Account', overdueData)
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
  XLSX.utils.book_append_sheet(wb, ws, 'Top Sheet')
}

function addMonthlyReportSheets(wb, monthlyData) {
  const months = Object.keys(monthlyData).sort().reverse()

  // Export all 6 months
  for (let i = 0; i < 6 && i < months.length; i++) {
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

function add2026NotCollectedSheet(wb, yearlyData2026) {
  if (!yearlyData2026 || Object.keys(yearlyData2026).length === 0) {
    return
  }

  const wsData = Object.entries(yearlyData2026).map(([plaza, values]) => ({
    'Plaza Name': plaza,
    'AC Qty': values.plazaQty,
    'Collection Achieve Qty (> 0)': values.collectionQty,
    'Not Collected Qty': values.plazaQty - values.collectionQty,
  }))

  // Calculate totals
  let totalQty = 0
  let totalCollection = 0

  Object.values(yearlyData2026).forEach(values => {
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
  XLSX.utils.book_append_sheet(wb, ws, '2026 Not Collected')
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

function add2024MonthWiseSheet(wb, monthlyData2024) {
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
      const plazas = monthlyData2024[month] || {}
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
      const plazas = monthlyData2024[month] || {}
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
  XLSX.utils.book_append_sheet(wb, ws, '2024 Month Wise')
}

function addDailyCollectionComparisonSheet(wb, accountDetails, sheetName) {
  if (!accountDetails || accountDetails.length === 0) {
    return
  }

  // Group by division and area for subtotals
  const divisionGroups = {}
  const areaGroups = {}

  accountDetails.forEach(account => {
    const division = account.division || 'Unknown'
    const area = account.area || 'Unknown'

    if (!divisionGroups[division]) {
      divisionGroups[division] = []
    }
    divisionGroups[division].push(account)

    if (!areaGroups[area]) {
      areaGroups[area] = []
    }
    areaGroups[area].push(account)
  })

  // Create summary data with division and area wise subtotals
  const wsData = []

  // Add header
  wsData.push({
    'Division': 'DIVISION WISE SUMMARY',
    'Area': '',
    'Plaza': '',
    'AC Qty': '',
    'Collection Achieve': '',
    'Not Collected': '',
    'Coll %': '',
  })

  // Add division wise data
  let totalDivisionQty = 0
  let totalDivisionCollection = 0

  Object.entries(divisionGroups)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([division, accounts]) => {
      const qty = accounts.length
      const collected = accounts.filter(a => a.collectionAchieve > 0).length
      const notCollected = qty - collected
      const percent = qty > 0 ? ((collected / qty) * 100).toFixed(2) : '0.00'

      totalDivisionQty += qty
      totalDivisionCollection += collected

      wsData.push({
        'Division': division,
        'Area': '',
        'Plaza': '',
        'AC Qty': qty,
        'Collection Achieve': collected,
        'Not Collected': notCollected,
        'Coll %': percent + '%',
      })
    })

  wsData.push({
    'Division': 'Division Total',
    'Area': '',
    'Plaza': '',
    'AC Qty': totalDivisionQty,
    'Collection Achieve': totalDivisionCollection,
    'Not Collected': totalDivisionQty - totalDivisionCollection,
    'Coll %': ((totalDivisionCollection / totalDivisionQty) * 100).toFixed(2) + '%',
  })

  // Add blank row
  wsData.push({})

  // Add area wise summary
  wsData.push({
    'Division': 'AREA WISE SUMMARY',
    'Area': '',
    'Plaza': '',
    'AC Qty': '',
    'Collection Achieve': '',
    'Not Collected': '',
    'Coll %': '',
  })

  // Add area wise data
  let totalAreaQty = 0
  let totalAreaCollection = 0

  Object.entries(areaGroups)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([area, accounts]) => {
      const qty = accounts.length
      const collected = accounts.filter(a => a.collectionAchieve > 0).length
      const notCollected = qty - collected
      const percent = qty > 0 ? ((collected / qty) * 100).toFixed(2) : '0.00'

      totalAreaQty += qty
      totalAreaCollection += collected

      wsData.push({
        'Division': '',
        'Area': area,
        'Plaza': '',
        'AC Qty': qty,
        'Collection Achieve': collected,
        'Not Collected': notCollected,
        'Coll %': percent + '%',
      })
    })

  wsData.push({
    'Division': '',
    'Area': 'Area Total',
    'Plaza': '',
    'AC Qty': totalAreaQty,
    'Collection Achieve': totalAreaCollection,
    'Not Collected': totalAreaQty - totalAreaCollection,
    'Coll %': ((totalAreaCollection / totalAreaQty) * 100).toFixed(2) + '%',
  })

  const ws = XLSX.utils.json_to_sheet(wsData)

  // Set column widths
  ws['!cols'] = [
    { wch: 20 }, // Division
    { wch: 20 }, // Area
    { wch: 25 }, // Plaza
    { wch: 12 }, // AC Qty
    { wch: 18 }, // Collection Achieve
    { wch: 15 }, // Not Collected
    { wch: 12 }, // Coll %
  ]

  XLSX.utils.book_append_sheet(wb, ws, sheetName)
}

function addTargetAchieveSheet(wb, accountDetails, sheetName) {
  if (!accountDetails || accountDetails.length === 0) {
    return
  }

  // Plaza wise summary
  const plazaGroups = {}
  accountDetails.forEach(account => {
    const plaza = account.plaza || 'Unknown'
    if (!plazaGroups[plaza]) {
      plazaGroups[plaza] = {
        targetQty: 0,
        achieveQty: 0,
        targetAmount: 0,
        achieveAmount: 0,
      }
    }
    
    const target = parseFloat(account.collectionTarget) || 0
    const achieve = parseFloat(account.collectionAchieve) || 0
    
    plazaGroups[plaza].targetQty += 1
    plazaGroups[plaza].achieveQty += achieve > 0 ? 1 : 0
    plazaGroups[plaza].targetAmount += target
    plazaGroups[plaza].achieveAmount += achieve
  })

  const wsData = []

  // Plaza wise data
  wsData.push({
    'Type': 'PLAZA WISE SUMMARY',
    'Name': '',
    'Target Qty': '',
    'Achieve Qty': '',
    'Qty %': '',
    'Target Amount': '',
    'Achieve Amount': '',
    'Amount %': '',
  })

  let totalTargetQty = 0
  let totalAchieveQty = 0
  let totalTargetAmount = 0
  let totalAchieveAmount = 0

  Object.entries(plazaGroups)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([plaza, values]) => {
      totalTargetQty += values.targetQty
      totalAchieveQty += values.achieveQty
      totalTargetAmount += values.targetAmount
      totalAchieveAmount += values.achieveAmount

      const qtyPercent = values.targetQty > 0 ? ((values.achieveQty / values.targetQty) * 100).toFixed(2) : '0.00'
      const amountPercent = values.targetAmount > 0 ? ((values.achieveAmount / values.targetAmount) * 100).toFixed(2) : '0.00'

      wsData.push({
        'Type': 'Plaza',
        'Name': plaza,
        'Target Qty': values.targetQty,
        'Achieve Qty': values.achieveQty,
        'Qty %': qtyPercent + '%',
        'Target Amount': values.targetAmount.toFixed(2),
        'Achieve Amount': values.achieveAmount.toFixed(2),
        'Amount %': amountPercent + '%',
      })
    })

  const totalQtyPercent = totalTargetQty > 0 ? ((totalAchieveQty / totalTargetQty) * 100).toFixed(2) : '0.00'
  const totalAmountPercent = totalTargetAmount > 0 ? ((totalAchieveAmount / totalTargetAmount) * 100).toFixed(2) : '0.00'

  wsData.push({
    'Type': 'Plaza Total',
    'Name': '',
    'Target Qty': totalTargetQty,
    'Achieve Qty': totalAchieveQty,
    'Qty %': totalQtyPercent + '%',
    'Target Amount': totalTargetAmount.toFixed(2),
    'Achieve Amount': totalAchieveAmount.toFixed(2),
    'Amount %': totalAmountPercent + '%',
  })

  // Blank row
  wsData.push({})

  // Person wise summary
  const personGroups = {}
  accountDetails.forEach(account => {
    const person = account.assignPersonId || 'Unknown'
    if (!personGroups[person]) {
      personGroups[person] = {
        targetQty: 0,
        achieveQty: 0,
        targetAmount: 0,
        achieveAmount: 0,
      }
    }
    
    const target = parseFloat(account.collectionTarget) || 0
    const achieve = parseFloat(account.collectionAchieve) || 0
    
    personGroups[person].targetQty += 1
    personGroups[person].achieveQty += achieve > 0 ? 1 : 0
    personGroups[person].targetAmount += target
    personGroups[person].achieveAmount += achieve
  })

  wsData.push({
    'Type': 'PERSON WISE SUMMARY',
    'Name': '',
    'Target Qty': '',
    'Achieve Qty': '',
    'Qty %': '',
    'Target Amount': '',
    'Achieve Amount': '',
    'Amount %': '',
  })

  let personTotalTargetQty = 0
  let personTotalAchieveQty = 0
  let personTotalTargetAmount = 0
  let personTotalAchieveAmount = 0

  Object.entries(personGroups)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([person, values]) => {
      personTotalTargetQty += values.targetQty
      personTotalAchieveQty += values.achieveQty
      personTotalTargetAmount += values.targetAmount
      personTotalAchieveAmount += values.achieveAmount

      const qtyPercent = values.targetQty > 0 ? ((values.achieveQty / values.targetQty) * 100).toFixed(2) : '0.00'
      const amountPercent = values.targetAmount > 0 ? ((values.achieveAmount / values.targetAmount) * 100).toFixed(2) : '0.00'

      wsData.push({
        'Type': 'Person',
        'Name': person,
        'Target Qty': values.targetQty,
        'Achieve Qty': values.achieveQty,
        'Qty %': qtyPercent + '%',
        'Target Amount': values.targetAmount.toFixed(2),
        'Achieve Amount': values.achieveAmount.toFixed(2),
        'Amount %': amountPercent + '%',
      })
    })

  const personTotalQtyPercent = personTotalTargetQty > 0 ? ((personTotalAchieveQty / personTotalTargetQty) * 100).toFixed(2) : '0.00'
  const personTotalAmountPercent = personTotalTargetAmount > 0 ? ((personTotalAchieveAmount / personTotalTargetAmount) * 100).toFixed(2) : '0.00'

  wsData.push({
    'Type': 'Person Total',
    'Name': '',
    'Target Qty': personTotalTargetQty,
    'Achieve Qty': personTotalAchieveQty,
    'Qty %': personTotalQtyPercent + '%',
    'Target Amount': personTotalTargetAmount.toFixed(2),
    'Achieve Amount': personTotalAchieveAmount.toFixed(2),
    'Amount %': personTotalAmountPercent + '%',
  })

  const ws = XLSX.utils.json_to_sheet(wsData)

  // Set column widths
  ws['!cols'] = [
    { wch: 20 }, // Type
    { wch: 25 }, // Name
    { wch: 12 }, // Target Qty
    { wch: 12 }, // Achieve Qty
    { wch: 10 }, // Qty %
    { wch: 15 }, // Target Amount
    { wch: 15 }, // Achieve Amount
    { wch: 10 }, // Amount %
  ]

  XLSX.utils.book_append_sheet(wb, ws, sheetName)
}

function addTotalNoCollectionSheet(wb, accountDetails, sheetName) {
  if (!accountDetails || accountDetails.length === 0) {
    return
  }

  // Filter only accounts with no collection (collectionAchieve = 0)
  const noCollectionAccounts = accountDetails.filter(account => {
    const achieve = parseFloat(account.collectionAchieve) || 0
    return achieve === 0
  })

  if (noCollectionAccounts.length === 0) {
    return
  }

  // Sort by plaza, then by account number
  const sortedAccounts = noCollectionAccounts.sort((a, b) => {
    if (a.plaza !== b.plaza) {
      return a.plaza.localeCompare(b.plaza)
    }
    return (a.accountNo || '').localeCompare(b.accountNo || '')
  })

  const wsData = sortedAccounts.map((account, index) => ({
    'S/N': index + 1,
    'Plaza': account.plaza || '-',
    'Account Number': account.accountNo || '-',
    'Customer Name': account.customerName || '-',
    'Assign Person ID': account.assignPersonId || '-',
    'Invoice Number': account.invoiceNo || '-',
    'Collection Target': account.collectionTarget ? parseFloat(account.collectionTarget).toFixed(2) : '0.00',
  }))

  // Add totals row
  const totalTarget = sortedAccounts.reduce((sum, account) => {
    return sum + (parseFloat(account.collectionTarget) || 0)
  }, 0)

  wsData.push({
    'S/N': '',
    'Plaza': '',
    'Account Number': '',
    'Customer Name': '',
    'Assign Person ID': '',
    'Invoice Number': 'Total Accounts:',
    'Collection Target': noCollectionAccounts.length,
  })

  wsData.push({
    'S/N': '',
    'Plaza': '',
    'Account Number': '',
    'Customer Name': '',
    'Assign Person ID': '',
    'Invoice Number': 'Total Target Amount:',
    'Collection Target': totalTarget.toFixed(2),
  })

  const ws = XLSX.utils.json_to_sheet(wsData)

  // Set column widths
  ws['!cols'] = [
    { wch: 8 },  // S/N
    { wch: 25 }, // Plaza
    { wch: 18 }, // Account Number
    { wch: 25 }, // Customer Name
    { wch: 18 }, // Assign Person ID
    { wch: 20 }, // Invoice Number
    { wch: 18 }, // Collection Target
  ]

  XLSX.utils.book_append_sheet(wb, ws, sheetName)
}

function addMonth4NoCollectionSheet(wb, accountDetails, monthKey, sheetName) {
  if (!accountDetails || accountDetails.length === 0 || !monthKey) {
    return
  }

  // Helper function to get month key from date
  function getMonthKeyFromDate(dateValue) {
    let date

    if (typeof dateValue === 'number') {
      date = new Date((dateValue - 25569) * 86400 * 1000)
    } else if (typeof dateValue === 'string') {
      const dateStr = dateValue.trim()
      const parts = dateStr.split('-')

      if (parts.length === 3) {
        const day = parseInt(parts[0])
        const monthStr = parts[1]
        let year = parseInt(parts[2])

        if (year < 100) {
          year = year <= 30 ? 2000 + year : 1900 + year
        }

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const monthIndex = months.findIndex(m => m.toLowerCase() === monthStr.toLowerCase())

        if (monthIndex !== -1) {
          date = new Date(year, monthIndex, day)
        } else {
          date = new Date(dateValue)
        }
      } else {
        date = new Date(dateValue)
      }
    } else {
      return null
    }

    if (isNaN(date.getTime())) return null

    const monthName = date.toLocaleString('en-US', { month: 'long', year: 'numeric' })
    return monthName
  }

  // Filter accounts for Month 4 with no collection
  const month4NoCollectionAccounts = accountDetails.filter(account => {
    const achieve = parseFloat(account.collectionAchieve) || 0
    
    if (!account.invoiceDate) return false
    
    const accountMonthKey = getMonthKeyFromDate(account.invoiceDate)
    
    return achieve === 0 && accountMonthKey === monthKey
  })

  if (month4NoCollectionAccounts.length === 0) {
    return
  }

  // Sort by plaza, then by account number
  const sortedAccounts = month4NoCollectionAccounts.sort((a, b) => {
    if (a.plaza !== b.plaza) {
      return a.plaza.localeCompare(b.plaza)
    }
    return (a.accountNo || '').localeCompare(b.accountNo || '')
  })

  const wsData = sortedAccounts.map((account, index) => ({
    'S/N': index + 1,
    'Plaza': account.plaza || '-',
    'Account Number': account.accountNo || '-',
    'Customer Name': account.customerName || '-',
    'Assign Person ID': account.assignPersonId || '-',
    'Invoice Number': account.invoiceNo || '-',
    'Collection Target': account.collectionTarget ? parseFloat(account.collectionTarget).toFixed(2) : '0.00',
  }))

  // Add totals row
  const totalTarget = sortedAccounts.reduce((sum, account) => {
    return sum + (parseFloat(account.collectionTarget) || 0)
  }, 0)

  wsData.push({
    'S/N': '',
    'Plaza': '',
    'Account Number': '',
    'Customer Name': '',
    'Assign Person ID': '',
    'Invoice Number': 'Total Accounts:',
    'Collection Target': month4NoCollectionAccounts.length,
  })

  wsData.push({
    'S/N': '',
    'Plaza': '',
    'Account Number': '',
    'Customer Name': '',
    'Assign Person ID': '',
    'Invoice Number': 'Total Target Amount:',
    'Collection Target': totalTarget.toFixed(2),
  })

  const ws = XLSX.utils.json_to_sheet(wsData)

  // Set column widths
  ws['!cols'] = [
    { wch: 8 },  // S/N
    { wch: 25 }, // Plaza
    { wch: 18 }, // Account Number
    { wch: 25 }, // Customer Name
    { wch: 18 }, // Assign Person ID
    { wch: 20 }, // Invoice Number
    { wch: 18 }, // Collection Target
  ]

  XLSX.utils.book_append_sheet(wb, ws, sheetName)
}

function addYearNoCollectionSheet(wb, accountDetails, year, sheetName) {
  if (!accountDetails || accountDetails.length === 0 || !year) {
    return
  }

  // Helper function to get year from date
  function getYearFromDate(dateValue) {
    let date

    if (typeof dateValue === 'number') {
      date = new Date((dateValue - 25569) * 86400 * 1000)
    } else if (typeof dateValue === 'string') {
      const dateStr = dateValue.trim()
      const parts = dateStr.split('-')

      if (parts.length === 3) {
        const day = parseInt(parts[0])
        const monthStr = parts[1]
        let yearVal = parseInt(parts[2])

        if (yearVal < 100) {
          yearVal = yearVal <= 30 ? 2000 + yearVal : 1900 + yearVal
        }

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const monthIndex = months.findIndex(m => m.toLowerCase() === monthStr.toLowerCase())

        if (monthIndex !== -1) {
          date = new Date(yearVal, monthIndex, day)
        } else {
          date = new Date(dateValue)
        }
      } else {
        date = new Date(dateValue)
      }
    } else {
      return null
    }

    if (isNaN(date.getTime())) return null

    return date.getFullYear()
  }

  // Filter accounts for the specified year with no collection
  const yearNoCollectionAccounts = accountDetails.filter(account => {
    const achieve = parseFloat(account.collectionAchieve) || 0
    
    if (!account.invoiceDate) return false
    
    const accountYear = getYearFromDate(account.invoiceDate)
    
    return achieve === 0 && accountYear === year
  })

  if (yearNoCollectionAccounts.length === 0) {
    return
  }

  // Sort by plaza, then by account number
  const sortedAccounts = yearNoCollectionAccounts.sort((a, b) => {
    if (a.plaza !== b.plaza) {
      return a.plaza.localeCompare(b.plaza)
    }
    return (a.accountNo || '').localeCompare(b.accountNo || '')
  })

  const wsData = sortedAccounts.map((account, index) => ({
    'S/N': index + 1,
    'Plaza': account.plaza || '-',
    'Account Number': account.accountNo || '-',
    'Customer Name': account.customerName || '-',
    'Assign Person ID': account.assignPersonId || '-',
    'Invoice Number': account.invoiceNo || '-',
    'Collection Target': account.collectionTarget ? parseFloat(account.collectionTarget).toFixed(2) : '0.00',
  }))

  // Add totals row
  const totalTarget = sortedAccounts.reduce((sum, account) => {
    return sum + (parseFloat(account.collectionTarget) || 0)
  }, 0)

  wsData.push({
    'S/N': '',
    'Plaza': '',
    'Account Number': '',
    'Customer Name': '',
    'Assign Person ID': '',
    'Invoice Number': 'Total Accounts:',
    'Collection Target': yearNoCollectionAccounts.length,
  })

  wsData.push({
    'S/N': '',
    'Plaza': '',
    'Account Number': '',
    'Customer Name': '',
    'Assign Person ID': '',
    'Invoice Number': 'Total Target Amount:',
    'Collection Target': totalTarget.toFixed(2),
  })

  const ws = XLSX.utils.json_to_sheet(wsData)

  // Set column widths
  ws['!cols'] = [
    { wch: 8 },  // S/N
    { wch: 25 }, // Plaza
    { wch: 18 }, // Account Number
    { wch: 25 }, // Customer Name
    { wch: 18 }, // Assign Person ID
    { wch: 20 }, // Invoice Number
    { wch: 18 }, // Collection Target
  ]

  XLSX.utils.book_append_sheet(wb, ws, sheetName)
}

function addPersonIdTopSheet(wb, accountDetails, sheetName, overdueData) {
  if (!accountDetails || accountDetails.length === 0) {
    return
  }

  const hasOverdue = overdueData && overdueData.size > 0

  // Group by Plaza and Assign Person ID
  const personGroups = {}
  accountDetails.forEach(account => {
    const plaza = account.plaza || 'Unknown'
    const personId = account.assignPersonId || 'Unknown'
    const key = `${plaza}|||${personId}` // Use delimiter to separate plaza and personId
    
    if (!personGroups[key]) {
      personGroups[key] = {
        plaza,
        personId,
        totalQty: 0,
        collectedQty: 0,
        targetAmount: 0,
        achieveAmount: 0,
        overdueAmount: 0,
      }
    }
    
    personGroups[key].totalQty++
    
    // Clean and parse Collection Target (remove spaces and commas)
    let target = 0
    if (account.collectionTarget != null && account.collectionTarget !== '') {
      const cleanedTarget = String(account.collectionTarget).replace(/[,\s]/g, '').trim()
      target = parseFloat(cleanedTarget) || 0
    }
    
    // Clean and parse Collection Achieve (remove spaces and commas)
    let achieve = 0
    if (account.collectionAchieve != null && account.collectionAchieve !== '') {
      const cleanedAchieve = String(account.collectionAchieve).replace(/[,\s]/g, '').trim()
      achieve = parseFloat(cleanedAchieve) || 0
    }
    
    personGroups[key].targetAmount += target
    personGroups[key].achieveAmount += achieve
    
    if (achieve > 0) {
      personGroups[key].collectedQty++
    }

    // Match overdue by invoice number
    if (hasOverdue && account.invoiceNo) {
      const invoiceKey = String(account.invoiceNo).trim()
      const overdue = overdueData.get(invoiceKey) || 0
      personGroups[key].overdueAmount += overdue
    }
  })

  // Convert to array and sort by plaza, then by person ID
  const sortedPersons = Object.values(personGroups)
    .map(values => ({
      plaza: values.plaza,
      personId: values.personId,
      totalQty: values.totalQty,
      collectedQty: values.collectedQty,
      notCollectedQty: values.totalQty - values.collectedQty,
      percentage: ((values.collectedQty / values.totalQty) * 100).toFixed(2),
      targetAmount: values.targetAmount,
      achieveAmount: values.achieveAmount,
      overdueAmount: values.overdueAmount,
      amountPercentage: values.targetAmount > 0
        ? ((values.achieveAmount / values.targetAmount) * 100).toFixed(2)
        : '0.00',
    }))
    .sort((a, b) => {
      if (a.plaza !== b.plaza) {
        return a.plaza.localeCompare(b.plaza)
      }
      return a.personId.localeCompare(b.personId)
    })

  // Group by plaza for subtotals
  const plazaGroups = {}
  sortedPersons.forEach(person => {
    if (!plazaGroups[person.plaza]) {
      plazaGroups[person.plaza] = []
    }
    plazaGroups[person.plaza].push(person)
  })

  // Build Excel data with subtotals
  const wsData = []
  Object.entries(plazaGroups).forEach(([plaza, persons]) => {
    // Add person rows
    persons.forEach(person => {
      const row = {
        'Plaza Name': person.plaza,
        'Assign Person ID': person.personId,
        'AC Qty': person.totalQty,
        'Collection Achieve Qty (> 0)': person.collectedQty,
        'Not Collected Qty': person.notCollectedQty,
        'Coll %': person.percentage + '%',
        'Collection Target Amount': parseFloat(person.targetAmount.toFixed(2)),
        'Collection Achieve Amount': parseFloat(person.achieveAmount.toFixed(2)),
        'Coll Amount %': person.amountPercentage + '%',
      }
      if (hasOverdue) row['Overdue Amount'] = parseFloat(person.overdueAmount.toFixed(2))
      wsData.push(row)
    })

    // Calculate and add plaza subtotal
    const plazaSubtotal = persons.reduce(
      (acc, person) => ({
        totalQty: acc.totalQty + person.totalQty,
        collectedQty: acc.collectedQty + person.collectedQty,
        notCollectedQty: acc.notCollectedQty + person.notCollectedQty,
        targetAmount: acc.targetAmount + person.targetAmount,
        achieveAmount: acc.achieveAmount + person.achieveAmount,
        overdueAmount: acc.overdueAmount + person.overdueAmount,
      }),
      { totalQty: 0, collectedQty: 0, notCollectedQty: 0, targetAmount: 0, achieveAmount: 0, overdueAmount: 0 }
    )

    const plazaPercentage = plazaSubtotal.totalQty > 0
      ? ((plazaSubtotal.collectedQty / plazaSubtotal.totalQty) * 100).toFixed(2)
      : '0.00'

    const plazaAmountPercentage = plazaSubtotal.targetAmount > 0
      ? ((plazaSubtotal.achieveAmount / plazaSubtotal.targetAmount) * 100).toFixed(2)
      : '0.00'

    const subtotalRow = {
      'Plaza Name': `${plaza} Subtotal`,
      'Assign Person ID': '',
      'AC Qty': plazaSubtotal.totalQty,
      'Collection Achieve Qty (> 0)': plazaSubtotal.collectedQty,
      'Not Collected Qty': plazaSubtotal.notCollectedQty,
      'Coll %': plazaPercentage + '%',
      'Collection Target Amount': parseFloat(plazaSubtotal.targetAmount.toFixed(2)),
      'Collection Achieve Amount': parseFloat(plazaSubtotal.achieveAmount.toFixed(2)),
      'Coll Amount %': plazaAmountPercentage + '%',
    }
    if (hasOverdue) subtotalRow['Overdue Amount'] = parseFloat(plazaSubtotal.overdueAmount.toFixed(2))
    wsData.push(subtotalRow)
  })

  // Calculate grand totals
  const grandTotals = sortedPersons.reduce(
    (acc, person) => ({
      totalQty: acc.totalQty + person.totalQty,
      collectedQty: acc.collectedQty + person.collectedQty,
      notCollectedQty: acc.notCollectedQty + person.notCollectedQty,
      targetAmount: acc.targetAmount + person.targetAmount,
      achieveAmount: acc.achieveAmount + person.achieveAmount,
      overdueAmount: acc.overdueAmount + person.overdueAmount,
    }),
    { totalQty: 0, collectedQty: 0, notCollectedQty: 0, targetAmount: 0, achieveAmount: 0, overdueAmount: 0 }
  )

  const grandTotalPercentage = grandTotals.totalQty > 0
    ? ((grandTotals.collectedQty / grandTotals.totalQty) * 100).toFixed(2)
    : '0.00'

  const grandTotalAmountPercentage = grandTotals.targetAmount > 0
    ? ((grandTotals.achieveAmount / grandTotals.targetAmount) * 100).toFixed(2)
    : '0.00'

  // Add grand totals row
  const grandTotalRow = {
    'Plaza Name': 'Grand Total',
    'Assign Person ID': '',
    'AC Qty': grandTotals.totalQty,
    'Collection Achieve Qty (> 0)': grandTotals.collectedQty,
    'Not Collected Qty': grandTotals.notCollectedQty,
    'Coll %': grandTotalPercentage + '%',
    'Collection Target Amount': parseFloat(grandTotals.targetAmount.toFixed(2)),
    'Collection Achieve Amount': parseFloat(grandTotals.achieveAmount.toFixed(2)),
    'Coll Amount %': grandTotalAmountPercentage + '%',
  }
  if (hasOverdue) grandTotalRow['Overdue Amount'] = parseFloat(grandTotals.overdueAmount.toFixed(2))
  wsData.push(grandTotalRow)

  const ws = XLSX.utils.json_to_sheet(wsData)

  // Set column widths
  ws['!cols'] = [
    { wch: 25 }, // Plaza Name
    { wch: 20 }, // Assign Person ID
    { wch: 12 }, // AC Qty
    { wch: 25 }, // Collection Achieve Qty
    { wch: 18 }, // Not Collected Qty
    { wch: 12 }, // Coll %
    { wch: 22 }, // Collection Target Amount
    { wch: 22 }, // Collection Achieve Amount
    { wch: 15 }, // Coll Amount %
    ...(hasOverdue ? [{ wch: 18 }] : []), // Overdue Amount
  ]

  XLSX.utils.book_append_sheet(wb, ws, sheetName)
}

function addAllAccountSheet(wb, accountDetails, sheetName, overdueData) {
  if (!accountDetails || accountDetails.length === 0) return

  const hasOverdue = overdueData && overdueData.size > 0

  const parseAmt = (val) => {
    if (val == null || val === '') return 0
    return parseFloat(String(val).replace(/[,\s]/g, '')) || 0
  }

  const formatDate = (val) => {
    if (!val) return '-'
    if (typeof val === 'number') {
      const d = new Date((val - 25569) * 86400 * 1000)
      return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('en-GB')
    }
    return String(val)
  }

  const wsData = accountDetails.map((acc, idx) => {
    const row = {
      'S/N': idx + 1,
      'Division': acc.division || '-',
      'Area': acc.area || '-',
      'Plaza': acc.plaza || '-',
      'Account No.': acc.accountNo || '-',
      'Customer Name': acc.customerName || '-',
      'Product Category': acc.productCategory || '-',
      'Assign Person ID': acc.assignPersonId || '-',
      'Invoice No.': acc.invoiceNo || '-',
      'Invoice Date': formatDate(acc.invoiceDate),
      'Matured Date': formatDate(acc.maturedDate),
      'Per Month Schedule': parseFloat(parseAmt(acc.perMonthSchedule).toFixed(2)),
      'Collection Target': parseFloat(parseAmt(acc.collectionTarget).toFixed(2)),
      'Collection Achieve': parseFloat(parseAmt(acc.collectionAchieve).toFixed(2)),
    }
    if (hasOverdue) {
      const invoiceKey = acc.invoiceNo ? String(acc.invoiceNo).trim() : ''
      row['Overdue Amount'] = parseFloat((overdueData.get(invoiceKey) || 0).toFixed(2))
    }
    return row
  })

  // Totals row
  let totalTarget = 0, totalAchieve = 0, totalOverdue = 0
  accountDetails.forEach(acc => {
    totalTarget += parseAmt(acc.collectionTarget)
    totalAchieve += parseAmt(acc.collectionAchieve)
    if (hasOverdue && acc.invoiceNo) {
      totalOverdue += overdueData.get(String(acc.invoiceNo).trim()) || 0
    }
  })

  const totalRow = {
    'S/N': '',
    'Division': '',
    'Area': '',
    'Plaza': '',
    'Account No.': '',
    'Customer Name': '',
    'Product Category': '',
    'Assign Person ID': '',
    'Invoice No.': '',
    'Invoice Date': '',
    'Matured Date': `Total (${accountDetails.length} accounts)`,
    'Per Month Schedule': '',
    'Collection Target': parseFloat(totalTarget.toFixed(2)),
    'Collection Achieve': parseFloat(totalAchieve.toFixed(2)),
  }
  if (hasOverdue) totalRow['Overdue Amount'] = parseFloat(totalOverdue.toFixed(2))
  wsData.push(totalRow)

  const ws = XLSX.utils.json_to_sheet(wsData)

  ws['!cols'] = [
    { wch: 6 },  // S/N
    { wch: 14 }, // Division
    { wch: 14 }, // Area
    { wch: 24 }, // Plaza
    { wch: 16 }, // Account No.
    { wch: 22 }, // Customer Name
    { wch: 18 }, // Product Category
    { wch: 16 }, // Assign Person ID
    { wch: 18 }, // Invoice No.
    { wch: 12 }, // Invoice Date
    { wch: 12 }, // Matured Date
    { wch: 18 }, // Per Month Schedule
    { wch: 18 }, // Collection Target
    { wch: 18 }, // Collection Achieve
    ...(hasOverdue ? [{ wch: 16 }] : []), // Overdue Amount
  ]

  XLSX.utils.book_append_sheet(wb, ws, sheetName)
}
