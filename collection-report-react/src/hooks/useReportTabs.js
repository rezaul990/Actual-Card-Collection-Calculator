import { useState, useMemo } from 'react'

const STATIC_TABS = [
  { id: 'current', label: 'Top Sheet' },
  { id: 'month2025', label: '2025 Month Wise' },
  { id: 'notcoll2025', label: '2025 Not Collected' },
  { id: 'notcoll2024', label: '2024 Not Collected' },
]

export function useReportTabs(monthlyData = {}) {
  const [activeTab, setActiveTab] = useState('current')

  const tabs = useMemo(() => {
    const monthlyTabs = []
    const monthKeys = Object.keys(monthlyData).sort().reverse()

    // Debug: Log all months with their index numbers
    console.log('=== MONTHS IN SYSTEM ===')
    monthKeys.forEach((monthKey, index) => {
      console.log(`Month ${index + 1}: ${monthKey}`)
      monthlyTabs.push({
        id: `month${index + 1}`,
        label: monthKey,
      })
    })
    console.log('========================')

    return [
      STATIC_TABS[0], // Current Report
      ...monthlyTabs,
      ...STATIC_TABS.slice(1), // Rest of static tabs
    ]
  }, [monthlyData])

  const accountListTabs = useMemo(() => {
    const monthKeys = Object.keys(monthlyData).sort().reverse()
    const month4Key = monthKeys[3] // Fourth month (index 3)
    
    return [
      { id: 'totalnocollection', label: 'Total No Collection Account List' },
      { 
        id: 'month4nocollection', 
        label: month4Key ? `${month4Key} No Collection Account List` : 'Month 4 No Collection Account List'
      },
      { id: 'year2024nocollection', label: '2024 No Collection Account List' },
      { id: 'year2025nocollection', label: '2025 No Collection Account List' },
      { id: 'year2026nocollection', label: '2026 No Collection Account List' },
      { id: 'year2024', label: '2024 Account' },
      { id: 'year2025', label: '2025 Account' },
    ]
  }, [monthlyData])

  const personIdTabs = useMemo(() => {
    return [
      { id: 'personidtopsheet', label: 'Top Sheet' },
    ]
  }, [])

  return {
    tabs,
    accountListTabs,
    personIdTabs,
    activeTab,
    setActiveTab,
  }
}
