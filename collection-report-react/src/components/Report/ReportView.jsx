import { useRef } from 'react'
import Header from '../Layout/Header'
import Tabs from '../Layout/Tabs'
import Container from '../Layout/Container'
import StandardTable from '../Tables/StandardTable'
import MonthlyTable from '../Tables/MonthlyTable'
import NotCollectedTable from '../Tables/NotCollectedTable'
import NotCollected2024Table from '../Tables/NotCollected2024Table'
import AccountListTable from '../Tables/AccountListTable'
import ActionButtons from '../Buttons/ActionButtons'
import { getTableData } from '../../services/reportService'

function ReportView({ data, tabs, activeTab, onTabChange, onReset }) {
  const containerRef = useRef(null)
  const tableData = getTableData(data, activeTab)

  const renderTable = () => {
    if (!tableData.data) {
      return <div className="no-data">No data available for this report</div>
    }

    if (tableData.isMonthly) {
      return <MonthlyTable data={tableData.data} title={tableData.title} />
    }

    if (tableData.isNotCollected) {
      return <NotCollectedTable data={tableData.data} title={tableData.title} />
    }

    if (tableData.isNotCollected2024) {
      return <NotCollected2024Table data={tableData.data} title={tableData.title} />
    }

    if (tableData.isAccountList) {
      return <AccountListTable data={tableData.data} title={tableData.title} />
    }

    return <StandardTable data={tableData.data} title={tableData.title} />
  }

  return (
    <Container>
      <div ref={containerRef}>
        <Header />
        <Tabs tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
        {tableData.title && (
          <div className="month-header">{tableData.title}</div>
        )}
        {renderTable()}
        <ActionButtons data={data} onReset={onReset} containerRef={containerRef} />
      </div>
    </Container>
  )
}

export default ReportView
