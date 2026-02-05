import { calculateTotals } from '../../services/reportService'
import './Table.css'

function StandardTable({ data, title }) {
  if (!data) return <div className="no-data">No data available</div>

  const { totalQty, totalCollection, totalNotCollected, percentage } = calculateTotals(data)

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
                <td>{notCollected}</td>
                <td className="percent-cell">{percent}%</td>
              </tr>
            )
          })}
          <tr className="total-row">
            <td>Total</td>
            <td>{totalQty}</td>
            <td>{totalCollection}</td>
            <td>{totalNotCollected}</td>
            <td>{percentage}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default StandardTable
