import './Tabs.css'

function Tabs({ tabs, activeTab, onTabChange, accountListTabs, personIdTabs }) {
  return (
    <>
      <nav className="report-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
            aria-selected={activeTab === tab.id}
          >
            {tab.label}
          </button>
        ))}
      </nav>
      
      {accountListTabs && accountListTabs.length > 0 && (
        <div className="account-list-section">
          <h3 className="section-title">Account List</h3>
          <nav className="report-tabs account-tabs">
            {accountListTabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
                aria-selected={activeTab === tab.id}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      )}

      {personIdTabs && personIdTabs.length > 0 && (
        <div className="account-list-section">
          <h3 className="section-title">Assign Person ID Report</h3>
          <nav className="report-tabs account-tabs">
            {personIdTabs.map(tab => (
              <button
                key={tab.id}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => onTabChange(tab.id)}
                aria-selected={activeTab === tab.id}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      )}
    </>
  )
}

export default Tabs
