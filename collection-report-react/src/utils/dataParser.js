export function parseExcelData(rows) {
  const HEADER_ROW_INDEX = 5
  const collectionCol = 20 // Column U (0-based index)
  const invoiceDateCol = 14 // Column O (0-based index)

  if (!rows[HEADER_ROW_INDEX] || rows[HEADER_ROW_INDEX].length === 0) {
    throw new Error('Header row (row 6) not found.')
  }

  const headerRow = rows[HEADER_ROW_INDEX]
  const headers = []
  for (let i = 0; i < headerRow.length; i++) {
    const cell = headerRow[i]
    headers.push(cell != null ? String(cell).toLowerCase().trim() : '')
  }

  const plazaCol = headers.findIndex(h => h && h.includes('plaza'))

  if (plazaCol === -1) {
    throw new Error('Plaza column not found.')
  }

  const result = {}
  const monthlyData = {}
  const yearlyData = { 2024: {}, 2025: {}, 2026: {} }
  const monthlyData2025 = {}
  const monthlyData2024 = {}
  const accountDetails2025 = [] // Account-level details for 2025
  const accountDetails2024 = [] // Account-level details for 2024
  const accountDetails2026 = [] // Account-level details for 2026
  const allAccountDetails = [] // All account details for Total No Collection Account List
  const dailyCollectionComparison2025 = [] // All 2025 accounts for daily collection comparison
  const dailyCollectionComparison2024 = [] // All 2024 accounts for daily collection comparison

  for (let i = HEADER_ROW_INDEX + 1; i < rows.length; i++) {
    const row = rows[i]
    if (!row) continue

    const plaza = row[plazaCol]
    const rawCollection = row[collectionCol]
    const invoiceDate = invoiceDateCol !== -1 ? row[invoiceDateCol] : null

    let collection = 0
    if (rawCollection != null && rawCollection !== '') {
      const cleaned = String(rawCollection).replace(/[,\s]/g, '').trim()
      collection = parseFloat(cleaned) || 0
    }

    if (!plaza || String(plaza).toLowerCase().trim() === 'plaza') continue

    // Capture ALL account details for Total No Collection Account List
    const accountDetail = {
      division: row[2] || '',         // Column C - Division
      area: row[3] || '',              // Column D - Area
      plaza: plaza,                    // Column E - Plaza (auto-detected)
      accountNo: row[6] || '',         // Column G - Account No.
      customerName: row[7] || '',      // Column H - Customer Name
      productCategory: row[9] || '',   // Column J - Product Category
      assignPersonId: row[11] || '',   // Column L - Assign Person ID
      invoiceNo: row[13] || '',        // Column N - Invoice No.
      invoiceDate: invoiceDate,        // Column O - Invoice Date
      maturedDate: row[15] || '',      // Column P - Matured Date
      perMonthSchedule: row[16] || '', // Column Q - Per Month Ins. Schedule Amt.
      amount: row[16] || '',           // Column Q - Per Month Ins. Schedule Amt.
      previousMonthOverdue: '',        // Not in structure
      collectionTarget: row[18] || '', // Column S - Collection Target
      collectionAchieve: collection,   // Column U - Collection Achieve
    }
    allAccountDetails.push(accountDetail)

    // Current report
    if (!result[plaza]) {
      result[plaza] = { plazaQty: 0, collectionQty: 0 }
    }
    result[plaza].plazaQty++
    if (collection > 0) {
      result[plaza].collectionQty++
    }

    // Monthly report
    if (invoiceDate) {
      const monthKey = getMonthKey(invoiceDate)
      if (monthKey) {
        if (!monthlyData[monthKey]) monthlyData[monthKey] = {}
        if (!monthlyData[monthKey][plaza]) {
          monthlyData[monthKey][plaza] = { plazaQty: 0, collectionQty: 0 }
        }
        monthlyData[monthKey][plaza].plazaQty++
        if (collection > 0) {
          monthlyData[monthKey][plaza].collectionQty++
        }
      }

      // Yearly report
      const year = getYear(invoiceDate)
      if (year && (year === 2024 || year === 2025 || year === 2026)) {
        if (!yearlyData[year][plaza]) {
          yearlyData[year][plaza] = { plazaQty: 0, collectionQty: 0 }
        }
        yearlyData[year][plaza].plazaQty++
        if (collection > 0) {
          yearlyData[year][plaza].collectionQty++
        }

        // Capture account-level details for not collected accounts (year-specific)
        if (collection === 0) {
          if (year === 2025) {
            accountDetails2025.push(accountDetail)
          } else if (year === 2024) {
            accountDetails2024.push(accountDetail)
          } else if (year === 2026) {
            accountDetails2026.push(accountDetail)
          }
        }

        // Capture ALL accounts for daily collection comparison (both collected and not collected)
        if (year === 2025) {
          dailyCollectionComparison2025.push(accountDetail)
        } else if (year === 2024) {
          dailyCollectionComparison2024.push(accountDetail)
        }
      }

      // 2025 Monthly breakdown
      if (year === 2025) {
        const monthName = getMonthName(invoiceDate)
        if (monthName) {
          if (!monthlyData2025[monthName]) monthlyData2025[monthName] = {}
          if (!monthlyData2025[monthName][plaza]) {
            monthlyData2025[monthName][plaza] = { plazaQty: 0, collectionQty: 0 }
          }
          monthlyData2025[monthName][plaza].plazaQty++
          if (collection > 0) {
            monthlyData2025[monthName][plaza].collectionQty++
          }
        }
      }

      // 2024 Monthly breakdown
      if (year === 2024) {
        const monthName = getMonthName(invoiceDate)
        if (monthName) {
          if (!monthlyData2024[monthName]) monthlyData2024[monthName] = {}
          if (!monthlyData2024[monthName][plaza]) {
            monthlyData2024[monthName][plaza] = { plazaQty: 0, collectionQty: 0 }
          }
          monthlyData2024[monthName][plaza].plazaQty++
          if (collection > 0) {
            monthlyData2024[monthName][plaza].collectionQty++
          }
        }
      }
    }
  }

  return { result, monthlyData, yearlyData, monthlyData2025, monthlyData2024, accountDetails2025, accountDetails2024, accountDetails2026, allAccountDetails, dailyCollectionComparison2025, dailyCollectionComparison2024 }
}

function getMonthName(dateValue) {
  let date

  if (typeof dateValue === 'number') {
    date = new Date((dateValue - 25569) * 86400 * 1000)
  } else if (typeof dateValue === 'string') {
    // Handle "29-Jul-24" format
    const dateStr = dateValue.trim()
    const parts = dateStr.split('-')

    if (parts.length === 3) {
      const day = parseInt(parts[0])
      const monthStr = parts[1]
      let year = parseInt(parts[2])

      // Convert 2-digit year to 4-digit (24 -> 2024, 99 -> 1999)
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

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return monthNames[date.getMonth()]
}

function getMonthKey(dateValue) {
  let date

  if (typeof dateValue === 'number') {
    // Excel serial date
    date = new Date((dateValue - 25569) * 86400 * 1000)
  } else if (typeof dateValue === 'string') {
    // Handle "29-Jul-24" format
    const dateStr = dateValue.trim()
    const parts = dateStr.split('-')

    if (parts.length === 3) {
      const day = parseInt(parts[0])
      const monthStr = parts[1]
      let year = parseInt(parts[2])

      // Convert 2-digit year to 4-digit (24 -> 2024, 99 -> 1999)
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

  const now = new Date()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

  if (date < sixMonthsAgo) return null

  const monthName = date.toLocaleString('en-US', { month: 'long', year: 'numeric' })

  return monthName
}

function getYear(dateValue) {
  let date

  if (typeof dateValue === 'number') {
    // Excel serial date
    date = new Date((dateValue - 25569) * 86400 * 1000)
  } else if (typeof dateValue === 'string') {
    // Handle "29-Jul-24" format
    const dateStr = dateValue.trim()
    const parts = dateStr.split('-')

    if (parts.length === 3) {
      const day = parseInt(parts[0])
      const monthStr = parts[1]
      let year = parseInt(parts[2])

      // Convert 2-digit year to 4-digit (24 -> 2024, 99 -> 1999)
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

  return date.getFullYear()
}
