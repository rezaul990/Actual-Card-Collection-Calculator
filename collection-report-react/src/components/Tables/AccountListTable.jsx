import { calculateTotals } from '../../services/reportService'
import './Table.css'

function AccountListTable({ data, title }) {
  if (!data) return <div className="no-data">No data available</div>

  // Filter to show only accounts with not collected qty > 0
  const filteredData = Object.entries(data)
    .filter(([plaza, values]) => values.plazaQty - values.collectionQty > 0)
    .reduce((acc, [plaza, values]) => {
      acc[plaza] = values
      return acc
    }, {})

  if (Object.keys(filteredData).length === 0) {
    return <div className="no-data">All accounts are collected! 🎉</div>
  }

  const { totalQty, totalCollection, totalNotCollected } = calculateTotals(filteredData)

  const rows = Object.entries(filteredData || {})
    .map(([plaza, values]) => ({
      plaza,
      ...values,
    }))
    .sort((a, b) => {
      const notCollectedA = a.plazaQty - a.collectionQty
      const notCollectedB = b.plazaQty - b.collectionQty
      return notCollectedB - notCollectedA // Sort by not collected qty descending
    })

  return (
    <div className="table-wrapper">
      <table className="report-table">
        <thead>
          <tr>
            <th>Plaza Name</th>
            <th>AC Qty</th>
            <th>Collection Achieve Qty</th>
            <th>Not Collected Qty</th>
            <th>Coll %</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            const notCollected = row.plazaQty - row.collectionQty
            const percent = row.plazaQty > 0 ? ((row.collectionQty / row.plazaQty) * 100).toFixed(2) : '0.00'
            return (
              <tr key={row.plaza}>
                <td>{row.plaza}</td>
                <td>{row.plazaQty}</td>
                <td>{row.collectionQty}</td>
                <td style={{ fontWeight: 700, color: '#ef4444' }}>{notCollected}</td>
                <td className="percent-cell">{percent}%</td>
              </tr>
            )
          })}
          <tr className="total-row">
            <td>Total</td>
            <td>{totalQty}</td>
            <td>{totalCollection}</td>
            <td>{totalNotCollected}</td>
            <td>{((totalCollection / totalQty) * 100).toFixed(2)}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default AccountListTable
