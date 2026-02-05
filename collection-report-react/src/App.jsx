import { useReportData } from './hooks/useReportData'
import { useReportTabs } from './hooks/useReportTabs'
import UploadView from './components/Upload/UploadView'
import ReportView from './components/Report/ReportView'
import './App.css'

function App() {
  const { reportData, showReport, error, handleFileUpload, handleReset } = useReportData()
  const { tabs, activeTab, setActiveTab } = useReportTabs(reportData?.monthlyData || {})

  return (
    <div className="app">
      <div className="developer-credit-top">
        <span>Developed by: Md. Rezaul Karim RCM</span>
      </div>

      {!showReport ? (
        <UploadView onFileUpload={handleFileUpload} error={error} />
      ) : (
        <ReportView
          data={reportData}
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onReset={handleReset}
        />
      )}

      <div className="developer-credit-bottom">
        <span>© Developed by: Md. Rezaul Karim RCM</span>
      </div>
    </div>
  )
}

export default App
