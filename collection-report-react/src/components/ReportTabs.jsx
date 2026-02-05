import './ReportTabs.css'

function ReportTabs({ tabs, activeTab, onTabChange }) {
  return (
    <div className="report-tabs">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export default ReportTabs
