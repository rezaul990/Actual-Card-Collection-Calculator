import './Table.css'

function Month4NoCollectionAccountListTable({ data, title }) {
  console.log('Month4NoCollectionAccountListTable - data:', data)
  
  if (!data || !data.accountDetails) {
    return <div className="no-data">No data available</div>
  }

  const accountDetails = data.accountDetails
  const monthKey = data.monthKey

  console.log('Month4NoCollectionAccountListTable - monthKey:', monthKey)
  console.log('Month4NoCollectionAccountListTable - accountDetails length:', accountDetails.length)

  if (!monthKey) {
    return <div className="no-data">Month 4 data not available</div>
  }

  // Filter accounts for Month 4 with no collection
  const month4NoCollectionAccounts = accountDetails.filter(account => {
    const achieve = parseFloat(account.collectionAchieve) || 0
    
    // Check if account belongs to Month 4
    if (!account.invoiceDate) return false
    
    const accountMonthKey = getMonthKeyFromDate(account.invoiceDate)
    
    return achieve === 0 && accountMonthKey === monthKey
  })

  console.log('Month4NoCollectionAccountListTable - filtered accounts:', month4NoCollectionAccounts.length)

  if (month4NoCollectionAccounts.length === 0) {
    return <div className="no-data">All accounts in Month 4 have been collected! 🎉</div>
  }

  // Sort by plaza, then by account number
  const sortedAccounts = month4NoCollectionAccounts.sort((a, b) => {
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
            <td style={{ textAlign: 'center' }}>{month4NoCollectionAccounts.length}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

// Helper function to get month key from date
function getMonthKeyFromDate(dateValue) {
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

  const monthName = date.toLocaleString('en-US', { month: 'long', year: 'numeric' })
  return monthName
}

export default Month4NoCollectionAccountListTable
