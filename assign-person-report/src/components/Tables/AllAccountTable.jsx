import './Table.css'

function AllAccountTable({ data, overdueData }) {
  if (!data || !data.accountDetails || data.accountDetails.length === 0) {
    return <div className="no-data">No data available</div>
  }

  const accounts = data.accountDetails
  const hasOverdue = overdueData && overdueData.size > 0

  const formatDate = (val) => {
    if (!val) return '-'
    if (typeof val === 'number') {
      const d = new Date((val - 25569) * 86400 * 1000)
      return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('en-GB')
    }
    return String(val)
  }

  const parseAmt = (val) => {
    if (val == null || val === '') return 0
    return parseFloat(String(val).replace(/[,\s]/g, '')) || 0
  }

  let totalTarget = 0, totalAchieve = 0, totalOverdue = 0
  accounts.forEach(acc => {
    totalTarget += parseAmt(acc.collectionTarget)
    totalAchieve += parseAmt(acc.collectionAchieve)
    if (hasOverdue && acc.invoiceNo) totalOverdue += overdueData.get(String(acc.invoiceNo).trim()) || 0
  })

  return (
    <div className="table-wrapper">
      <table className="report-table">
        <thead>
          <tr>
            <th style={{ textAlign: 'center' }}>S/N</th>
            <th>Division</th>
            <th>Area</th>
            <th>Plaza</th>
            <th>Account No.</th>
            <th>Customer Name</th>
            <th>Product Category</th>
            <th>Assign Person ID</th>
            <th>Invoice No.</th>
            <th>Invoice Date</th>
            <th>Matured Date</th>
            <th style={{ textAlign: 'right' }}>Per Month Schedule</th>
            <th style={{ textAlign: 'right' }}>Collection Target</th>
            <th style={{ textAlign: 'right' }}>Collection Achieve</th>
            {hasOverdue && <th style={{ textAlign: 'right' }}>Overdue Amount</th>}
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc, idx) => {
            const overdue = hasOverdue && acc.invoiceNo ? (overdueData.get(String(acc.invoiceNo).trim()) || 0) : null
            return (
              <tr key={idx}>
                <td style={{ textAlign: 'center' }}>{idx + 1}</td>
                <td>{acc.division || '-'}</td>
                <td>{acc.area || '-'}</td>
                <td>{acc.plaza || '-'}</td>
                <td>{acc.accountNo || '-'}</td>
                <td>{acc.customerName || '-'}</td>
                <td>{acc.productCategory || '-'}</td>
                <td>{acc.assignPersonId || '-'}</td>
                <td>{acc.invoiceNo || '-'}</td>
                <td>{formatDate(acc.invoiceDate)}</td>
                <td>{formatDate(acc.maturedDate)}</td>
                <td style={{ textAlign: 'right' }}>{parseAmt(acc.perMonthSchedule).toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>{parseAmt(acc.collectionTarget).toFixed(2)}</td>
                <td style={{ textAlign: 'right' }}>{parseAmt(acc.collectionAchieve).toFixed(2)}</td>
                {hasOverdue && <td style={{ textAlign: 'right' }}>{overdue > 0 ? overdue.toFixed(2) : '-'}</td>}
              </tr>
            )
          })}
          <tr className="total-row">
            <td colSpan={12} style={{ textAlign: 'right', fontWeight: 700 }}>
              Total ({accounts.length} accounts)
            </td>
            <td style={{ textAlign: 'right' }}>{totalTarget.toFixed(2)}</td>
            <td style={{ textAlign: 'right' }}>{totalAchieve.toFixed(2)}</td>
            {hasOverdue && <td style={{ textAlign: 'right' }}>{totalOverdue.toFixed(2)}</td>}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default AllAccountTable
