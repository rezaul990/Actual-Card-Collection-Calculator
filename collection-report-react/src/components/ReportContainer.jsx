import { useState, useRef } from 'react'
import ReportTabs from './ReportTabs'
import ReportHeader from './ReportHeader'
import ReportTable from './ReportTable'
import ActionButtons from './ActionButtons'
import './ReportContainer.css'

function ReportContainer({ data, onReset }) {
  const [activeTab, setActiveTab] = useState('current')
  const containerRef = useRef(null)

  const tabs = [
    { id: 'current', label: 'Current Report' },
    { id: 'month1', label: 'Month 1' },
    { id: 'month2', label: 'Month 2' },
    { id: 'month3', label: 'Month 3' },
    { id: 'month4', label: 'Month 4' },
    { id: 'year2024', label: '2024 Account' },
    { id: 'year2025', label: '2025 Account' },
    { id: 'month2025', label: '2025 Month Wise' },
    { id: 'notcoll2025', label: '2025 Not Collected' },
  ]

  const getTableData = () => {
    switch (activeTab) {
      case 'current':
        return { data: data.result, title: 'Current Report' }
      case 'month1':
      case 'month2':
      case 'month3':
      case 'month4':
        const monthIndex = parseInt(activeTab.replace('month', '')) - 1
        const months = Object.keys(data.monthlyData).sort().reverse()
        return { data: data.monthlyData[months[monthIndex]], title: months[monthIndex] }
      case 'year2024':
        return { data: data.yearlyData[2024], title: '2024 Account Report' }
      case 'year2025':
        return { data: data.yearlyData[2025], title: '2025 Account Report' }
      case 'month2025':
        return { data: data.monthlyData2025, title: '2025 Month Wise Report', isMonthly: true }
      case 'notcoll2025':
        return { data: data.monthlyData2025, title: '2025 Not Collected Qty', isNotCollected: true }
      default:
        return { data: data.result, title: 'Current Report' }
    }
  }

  const tableData = getTableData()

  return (
    <div className="container" ref={containerRef}>
      <ReportHeader />
      <ReportTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
      <ReportTable {...tableData} />
      <ActionButtons data={data} onReset={onReset} activeTab={activeTab} containerRef={containerRef} />
    </div>
  )
}

export default ReportContainer
