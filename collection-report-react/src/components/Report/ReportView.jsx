import { useRef } from 'react'
import Header from '../Layout/Header'
import Tabs from '../Layout/Tabs'
import Container from '../Layout/Container'
import StandardTable from '../Tables/StandardTable'
import MonthlyTable from '../Tables/MonthlyTable'
import NotCollectedTable from '../Tables/NotCollectedTable'
import NotCollected2024Table from '../Tables/NotCollected2024Table'
import AccountListTable from '../Tables/AccountListTable'
import DailyCollectionComparisonTable from '../Tables/DailyCollectionComparisonTable'
import TargetAchieveTable from '../Tables/TargetAchieveTable'
import NoCollectionAccountListTable from '../Tables/NoCollectionAccountListTable'
import Month4NoCollectionAccountListTable from '../Tables/Month4NoCollectionAccountListTable'
import YearNoCollectionAccountListTable from '../Tables/YearNoCollectionAccountListTable'
import PersonIdTopSheetTable from '../Tables/PersonIdTopSheetTable'
import AllAccountTable from '../Tables/AllAccountTable'
import ActionButtons from '../Buttons/ActionButtons'
import { getTableData } from '../../services/reportService'

function ReportView({ data, overdueData, tabs, accountListTabs, personIdTabs, activeTab, onTabChange, onReset }) {
  const containerRef = useRef(null)
  const tableData = getTableData(data, activeTab)
  
  // Check if current tab is Person ID Top Sheet or All Account
  const isPersonIdReport = activeTab === 'personidtopsheet' || activeTab === 'allaccount'

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

    if (tableData.isDailyComparison) {
      return <DailyCollectionComparisonTable data={tableData.data} title={tableData.title} />
    }

    if (tableData.isTargetAchieve) {
      return <TargetAchieveTable data={tableData.data} title={tableData.title} />
    }

    if (tableData.isNoCollectionList) {
      return <NoCollectionAccountListTable data={tableData.data} title={tableData.title} />
    }

    if (tableData.isMonth4NoCollectionList) {
      return <Month4NoCollectionAccountListTable data={tableData.data} title={tableData.title} />
    }

    if (tableData.isYearNoCollectionList) {
      return <YearNoCollectionAccountListTable data={tableData.data} title={tableData.title} />
    }

    if (tableData.isPersonIdTopSheet) {
      return <PersonIdTopSheetTable data={tableData.data} title={tableData.title} overdueData={overdueData} />
    }

    if (tableData.isAllAccount) {
      return <AllAccountTable data={tableData.data} title={tableData.title} overdueData={overdueData} />
    }

    return <StandardTable data={tableData.data} title={tableData.title} />
  }

  return (
    <Container>
      <div ref={containerRef}>
        <Header />
        <ActionButtons 
          data={data} 
          overdueData={overdueData}
          onReset={onReset} 
          containerRef={containerRef}
          isPersonIdReport={isPersonIdReport}
        />
        <Tabs tabs={tabs} accountListTabs={accountListTabs} personIdTabs={personIdTabs} activeTab={activeTab} onTabChange={onTabChange} />
        {tableData.title && (
          <div className="month-header">{tableData.title}</div>
        )}
        {renderTable()}
      </div>
    </Container>
  )
}

export default ReportView
