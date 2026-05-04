import { useRef, useState, useEffect } from 'react'
import PersonIdTopSheetTable from '../Tables/PersonIdTopSheetTable'
import AllAccountTable from '../Tables/AllAccountTable'
import ActionButtons from '../Buttons/ActionButtons'
import './ReportView.css'

const TABS = [
  { id: 'personidtopsheet', label: 'Top Sheet' },
  { id: 'allaccount', label: 'All Account' },
]

function ReportView({ data, overdueData, activeTab, onTabChange, onReset }) {
  const containerRef = useRef(null)
  const [dateTime, setDateTime] = useState('')

  useEffect(() => {
    const now = new Date()
    setDateTime(now.toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long',
      day: 'numeric', hour: '2-digit', minute: '2-digit',
    }))
  }, [])

  const accountDetails = data?.allAccountDetails || []

  const renderTable = () => {
    if (activeTab === 'personidtopsheet') {
      return <PersonIdTopSheetTable data={{ accountDetails }} overdueData={overdueData} />
    }
    if (activeTab === 'allaccount') {
      return <AllAccountTable data={{ accountDetails }} overdueData={overdueData} />
    }
    return null
  }

  const activeLabel = TABS.find(t => t.id === activeTab)?.label || ''

  return (
    <div className="container">
      <div ref={containerRef}>
        {/* Header */}
        <div className="report-header">
          <h1>ASSIGN PERSON ID REPORT</h1>
          <p className="datetime">{dateTime}</p>
        </div>

        {/* Buttons at top */}
        <ActionButtons
          data={data}
          overdueData={overdueData}
          onReset={onReset}
          containerRef={containerRef}
        />

        {/* Tabs */}
        <div className="tab-section">
          <h3 className="section-title">Assign Person ID Report</h3>
          <nav className="tab-nav">
            {TABS.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Active tab title */}
        <div className="month-header">{activeLabel}</div>

        {/* Table */}
        {renderTable()}
      </div>
    </div>
  )
}

export default ReportView
