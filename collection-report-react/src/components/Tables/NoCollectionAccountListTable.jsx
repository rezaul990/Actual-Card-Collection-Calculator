import './Table.css'

function NoCollectionAccountListTable({ data, title }) {
  if (!data || !data.accountDetails) {
    return <div className="no-data">No data available</div>
  }

  const accountDetails = data.accountDetails

  // Filter only accounts with no collection (collectionAchieve = 0)
  const noCollectionAccounts = accountDetails.filter(account => {
    const achieve = parseFloat(account.collectionAchieve) || 0
    return achieve === 0
  })

  if (noCollectionAccounts.length === 0) {
    return <div className="no-data">All accounts have been collected! 🎉</div>
  }

  // Sort by plaza, then by account number
  const sortedAccounts = noCollectionAccounts.sort((a, b) => {
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
            <td style={{ textAlign: 'center' }}>{noCollectionAccounts.length}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default NoCollectionAccountListTable
