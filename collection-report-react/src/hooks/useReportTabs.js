import { useState, useMemo } from 'react'

const STATIC_TABS = [
  { id: 'current', label: 'Current Report' },
  { id: 'year2024', label: '2024 Account' },
  { id: 'year2025', label: '2025 Account' },
  { id: 'month2025', label: '2025 Month Wise' },
  { id: 'notcoll2025', label: '2025 Not Collected' },
  { id: 'notcoll2024', label: '2024 Not Collected' },
  { id: 'acctlist2025', label: '2025 Account List' },
  { id: 'acctlist2024', label: '2024 Account List' },
  { id: 'dailycoll2025', label: '2025 Daily Collection' },
  { id: 'dailycoll2024', label: '2024 Daily Collection' },
]

export function useReportTabs(monthlyData = {}) {
  const [activeTab, setActiveTab] = useState('current')

  const tabs = useMemo(() => {
    const monthlyTabs = []
    const monthKeys = Object.keys(monthlyData).sort().reverse()

    monthKeys.forEach((monthKey, index) => {
      monthlyTabs.push({
        id: `month${index + 1}`,
        label: monthKey,
      })
    })

    return [
      STATIC_TABS[0], // Current Report
      ...monthlyTabs,
      ...STATIC_TABS.slice(1), // Rest of static tabs
    ]
  }, [monthlyData])

  return {
    tabs,
    activeTab,
    setActiveTab,
  }
}
