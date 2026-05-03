/**
 * Report Service - Handles report data retrieval and formatting
 */

export function getTableData(data, activeTab) {
  if (!data) return { data: null, title: '' }

  switch (activeTab) {
    case 'current':
      return { data: data.result, title: 'Top Sheet' }

    case 'month1':
    case 'month2':
    case 'month3':
    case 'month4':
    case 'month5':
    case 'month6':
      const monthIndex = parseInt(activeTab.replace('month', '')) - 1
      const months = Object.keys(data.monthlyData).sort().reverse()
      const monthKey = months[monthIndex]
      return {
        data: data.monthlyData[monthKey],
        title: monthKey || `Month ${monthIndex + 1}`, // Show actual month name
      }

    case 'year2024':
      return { data: data.yearlyData[2024], title: '2024 Account Report' }

    case 'year2025':
      return { data: data.yearlyData[2025], title: '2025 Account Report' }

    case 'year2026':
      return { data: data.yearlyData[2026], title: '2026 Account Report' }

    case 'month2025':
      return {
        data: data.monthlyData2025,
        title: '2025 Month Wise Report',
        isMonthly: true,
      }

    case 'notcoll2026':
      return {
        data: data.yearlyData[2026],
        title: '2026 Not Collected Qty',
        isNotCollected2024: true,
      }

    case 'notcoll2025':
      return {
        data: data.monthlyData2025,
        title: '2025 Not Collected Qty',
        isNotCollected: true,
      }

    case 'notcoll2024':
      return {
        data: data.yearlyData[2024],
        title: '2024 Not Collected Qty',
        isNotCollected2024: true,
      }

    case 'acctlist2025':
      return {
        data: data.yearlyData[2025],
        title: '2025 Account List - Not Collected',
        isAccountList: true,
      }

    case 'acctlist2024':
      return {
        data: data.yearlyData[2024],
        title: '2024 Account List - Not Collected',
        isAccountList: true,
      }

    case 'dailycoll2025':
      return {
        data: { accountDetails: data.dailyCollectionComparison2025 },
        title: '2025 Daily Collection Comparison',
        isDailyComparison: true,
      }

    case 'dailycoll2024':
      return {
        data: { accountDetails: data.dailyCollectionComparison2024 },
        title: '2024 Daily Collection Comparison',
        isDailyComparison: true,
      }

    case 'targetachieve':
      // Combine both 2024 and 2025 data
      const allAccounts = [
        ...(data.dailyCollectionComparison2025 || []),
        ...(data.dailyCollectionComparison2024 || [])
      ]
      return {
        data: { accountDetails: allAccounts },
        title: 'Target vs Achieve Analysis (All Accounts)',
        isTargetAchieve: true,
      }

    case 'totalnocollection':
      return {
        data: { accountDetails: data.allAccountDetails || [] },
        title: 'Total No Collection Account List',
        isNoCollectionList: true,
      }

    case 'month4nocollection':
      // Get the fourth month data (Month 4)
      const month4Months = Object.keys(data.monthlyData || {}).sort().reverse()
      const month4Key = month4Months[3] // Fourth month (index 3)
      return {
        data: { 
          accountDetails: data.allAccountDetails || [],
          monthKey: month4Key 
        },
        title: `Month 4 No Collection Account List${month4Key ? ' - ' + month4Key : ''}`,
        isMonth4NoCollectionList: true,
      }

    case 'year2024nocollection':
      return {
        data: { 
          accountDetails: data.allAccountDetails || [],
          year: 2024
        },
        title: '2024 No Collection Account List',
        isYearNoCollectionList: true,
      }

    case 'year2025nocollection':
      return {
        data: { 
          accountDetails: data.allAccountDetails || [],
          year: 2025
        },
        title: '2025 No Collection Account List',
        isYearNoCollectionList: true,
      }

    case 'year2026nocollection':
      return {
        data: { 
          accountDetails: data.allAccountDetails || [],
          year: 2026
        },
        title: '2026 No Collection Account List',
        isYearNoCollectionList: true,
      }

    case 'personidtopsheet':
      return {
        data: { accountDetails: data.allAccountDetails || [] },
        title: 'Assign Person ID - Top Sheet',
        isPersonIdTopSheet: true,
      }

    case 'allaccount':
      return {
        data: { accountDetails: data.allAccountDetails || [] },
        title: 'All Account List',
        isAllAccount: true,
      }

    default:
      return { data: data.result, title: 'Current Report' }
  }
}

export function formatDateTime() {
  const now = new Date()
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }
  return now.toLocaleDateString('en-US', options)
}

export function calculateTotals(data) {
  if (!data) return { totalQty: 0, totalCollection: 0, totalNotCollected: 0, percentage: '0.00' }

  let totalQty = 0
  let totalCollection = 0

  Object.values(data).forEach(values => {
    totalQty += values.plazaQty
    totalCollection += values.collectionQty
  })

  const totalNotCollected = totalQty - totalCollection
  const percentage = totalQty > 0 ? ((totalCollection / totalQty) * 100).toFixed(2) : '0.00'

  return { totalQty, totalCollection, totalNotCollected, percentage }
}
