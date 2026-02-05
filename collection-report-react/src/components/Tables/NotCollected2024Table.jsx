import { calculateTotals } from '../../services/reportService'
import './Table.css'

function NotCollected2024Table({ data, title }) {
  if (!data) return <div className="no-data">No data available</div>

  const { totalQty, totalCollection, totalNotCollected } = calculateTotals(data)

  const rows = Object.entries(data || {}).map(([plaza, values]) => ({
    plaza,
    ...values,
  }))

  return (
    <div className="table-wrapper">
      <table className="report-table">
        <thead>
          <tr>
            <th>Plaza Name</th>
            <th>AC Qty</th>
            <th>Collection Achieve Qty (&gt; 0)</th>
            <th>Not Collected Qty</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(row => {
            const notCollected = row.plazaQty - row.collectionQty
            return (
              <tr key={row.plaza}>
                <td>{row.plaza}</td>
                <td>{row.plazaQty}</td>
                <td>{row.collectionQty}</td>
                <td>{notCollected}</td>
              </tr>
            )
          })}
          <tr className="total-row">
            <td>Total</td>
            <td>{totalQty}</td>
            <td>{totalCollection}</td>
            <td>{totalNotCollected}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default NotCollected2024Table
