import './Table.css'

function YearNoCollectionAccountListTable({ data, title }) {
  if (!data || !data.accountDetails) {
    return <div className="no-data">No data available</div>
  }

  const accountDetails = data.accountDetails
  const year = data.year

  if (!year) {
    return <div className="no-data">Year data not available</div>
  }

  // Filter accounts for the specified year with no collection
  const yearNoCollectionAccounts = accountDetails.filter(account => {
    const achieve = parseFloat(account.collectionAchieve) || 0
    
    // Check if account belongs to the specified year
    if (!account.invoiceDate) return false
    
    const accountYear = getYearFromDate(account.invoiceDate)
    
    return achieve === 0 && accountYear === year
  })

  if (yearNoCollectionAccounts.length === 0) {
    return <div className="no-data">All accounts in {year} have been collected! 🎉</div>
  }

  // Sort by plaza, then by account number
  const sortedAccounts = yearNoCollectionAccounts.sort((a, b) => {
    if (a.plaza !== b.plaza) {
      return a.plaza.localeCompare(b.plaza)
    }
    return (a.accountNo || '').localeCompare(b.accountNo || '')
  })

  return (
    <div className="table-wrapper">
      <table className="report-table">
        <thead>
          <tr>
            <th>S/N</th>
            <th>Plaza</th>
            <th>Account Number</th>
            <th>Customer Name</th>
            <th>Assign Person ID</th>
            <th>Invoice Number</th>
            <th>Collection Target</th>
          </tr>
        </thead>
        <tbody>
          {sortedAccounts.map((account, index) => (
            <tr key={`${account.plaza}-${account.accountNo}-${index}`}>
              <td style={{ textAlign: 'center' }}>{index + 1}</td>
              <td>{account.plaza || '-'}</td>
              <td>{account.accountNo || '-'}</td>
              <td>{account.customerName || '-'}</td>
              <td style={{ textAlign: 'center' }}>{account.assignPersonId || '-'}</td>
              <td>{account.invoiceNo || '-'}</td>
              <td style={{ textAlign: 'right' }}>
                {account.collectionTarget ? parseFloat(account.collectionTarget).toFixed(2) : '0.00'}
              </td>
            </tr>
          ))}
          <tr className="total-row">
            <td colSpan="6" style={{ textAlign: 'right' }}>Total Accounts:</td>
            <td style={{ textAlign: 'center' }}>{yearNoCollectionAccounts.length}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// Helper function to get year from date
function getYearFromDate(dateValue) {
  let date

  if (typeof dateValue === 'number') {
    date = new Date((dateValue - 25569) * 86400 * 1000)
  } else if (typeof dateValue === 'string') {
    const dateStr = dateValue.trim()
    const parts = dateStr.split('-')

    if (parts.length === 3) {
      const day = parseInt(parts[0])
      const monthStr = parts[1]
      let year = parseInt(parts[2])

      if (year < 100) {
        year = year <= 30 ? 2000 + year : 1900 + year
      }

      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const monthIndex = months.findIndex(m => m.toLowerCase() === monthStr.toLowerCase())

      if (monthIndex !== -1) {
        date = new Date(year, monthIndex, day)
      } else {
        date = new Date(dateValue)
      }
    } else {
      date = new Date(dateValue)
    }
  } else {
    return null
  }

  if (isNaN(date.getTime())) return null

  return date.getFullYear()
}

export default YearNoCollectionAccountListTable
