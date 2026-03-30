import { useState } from 'react'
import './Table.css'

function DailyCollectionComparisonTable({ data, title }) {
  const [viewMode, setViewMode] = useState('plaza') // 'plaza', 'division', 'area'

  if (!data || !data.accountDetails) {
    return <div className="no-data">No data available</div>
  }

  const accountDetails = data.accountDetails

  const renderPlazaView = () => {
    // Group by plaza
    const plazaGroups = {}
    accountDetails.forEach(account => {
      if (!plazaGroups[account.plaza]) {
        plazaGroups[account.plaza] = []
      }
      plazaGroups[account.plaza].push(account)
    })

    let totalQty = 0
    let totalCollection = 0

    const rows = Object.entries(plazaGroups).map(([plaza, accounts]) => {
      const qty = accounts.length
      const collected = accounts.filter(a => a.collectionAchieve > 0).length
      totalQty += qty
      totalCollection += collected
      const percent = qty > 0 ? ((collected / qty) * 100).toFixed(2) : '0.00'

      return {
        name: plaza,
        qty,
        collected,
        notCollected: qty - collected,
        percent,
      }
    })

    const totalNotCollected = totalQty - totalCollection
    const totalPercent = totalQty > 0 ? ((totalCollection / totalQty) * 100).toFixed(2) : '0.00'

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
            {rows.map(row => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{row.qty}</td>
                <td>{row.collected}</td>
                <td style={{ fontWeight: 700, color: '#ef4444' }}>{row.notCollected}</td>
                <td className="percent-cell">{row.percent}%</td>
              </tr>
            ))}
            <tr className="total-row">
              <td>Total</td>
              <td>{totalQty}</td>
              <td>{totalCollection}</td>
              <td>{totalNotCollected}</td>
              <td>{totalPercent}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  const renderDivisionView = () => {
    // Group by division
    const divisionGroups = {}
    accountDetails.forEach(account => {
      const division = account.division || 'Unknown'
      if (!divisionGroups[division]) {
        divisionGroups[division] = []
      }
      divisionGroups[division].push(account)
    })

    let totalQty = 0
    let totalCollection = 0

    const rows = Object.entries(divisionGroups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([division, accounts]) => {
        const qty = accounts.length
        const collected = accounts.filter(a => a.collectionAchieve > 0).length
        totalQty += qty
        totalCollection += collected
        const percent = qty > 0 ? ((collected / qty) * 100).toFixed(2) : '0.00'

        return {
          name: division,
          qty,
          collected,
          notCollected: qty - collected,
          percent,
        }
      })

    const totalNotCollected = totalQty - totalCollection
    const totalPercent = totalQty > 0 ? ((totalCollection / totalQty) * 100).toFixed(2) : '0.00'

    return (
      <div className="table-wrapper">
        <table className="report-table">
          <thead>
            <tr>
              <th>Division Name</th>
              <th>AC Qty</th>
              <th>Collection Achieve Qty</th>
              <th>Not Collected Qty</th>
              <th>Coll %</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.name}>
                <td style={{ fontWeight: 700 }}>{row.name}</td>
                <td>{row.qty}</td>
                <td>{row.collected}</td>
                <td style={{ fontWeight: 700, color: '#ef4444' }}>{row.notCollected}</td>
                <td className="percent-cell">{row.percent}%</td>
              </tr>
            ))}
            <tr className="total-row">
              <td>Total</td>
              <td>{totalQty}</td>
              <td>{totalCollection}</td>
              <td>{totalNotCollected}</td>
              <td>{totalPercent}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  const renderAreaView = () => {
    // Group by area
    const areaGroups = {}
    accountDetails.forEach(account => {
      const area = account.area || 'Unknown'
      if (!areaGroups[area]) {
        areaGroups[area] = []
      }
      areaGroups[area].push(account)
    })

    let totalQty = 0
    let totalCollection = 0

    const rows = Object.entries(areaGroups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([area, accounts]) => {
        const qty = accounts.length
        const collected = accounts.filter(a => a.collectionAchieve > 0).length
        totalQty += qty
        totalCollection += collected
        const percent = qty > 0 ? ((collected / qty) * 100).toFixed(2) : '0.00'

        return {
          name: area,
          qty,
          collected,
          notCollected: qty - collected,
          percent,
        }
      })

    const totalNotCollected = totalQty - totalCollection
    const totalPercent = totalQty > 0 ? ((totalCollection / totalQty) * 100).toFixed(2) : '0.00'

    return (
      <div className="table-wrapper">
        <table className="report-table">
          <thead>
            <tr>
              <th>Area Name</th>
              <th>AC Qty</th>
              <th>Collection Achieve Qty</th>
              <th>Not Collected Qty</th>
              <th>Coll %</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.name}>
                <td style={{ fontWeight: 700 }}>{row.name}</td>
                <td>{row.qty}</td>
                <td>{row.collected}</td>
                <td style={{ fontWeight: 700, color: '#ef4444' }}>{row.notCollected}</td>
                <td className="percent-cell">{row.percent}%</td>
              </tr>
            ))}
            <tr className="total-row">
              <td>Total</td>
              <td>{totalQty}</td>
              <td>{totalCollection}</td>
              <td>{totalNotCollected}</td>
              <td>{totalPercent}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div>
      <div className="view-mode-selector">
        <button
          className={`mode-btn ${viewMode === 'plaza' ? 'active' : ''}`}
          onClick={() => setViewMode('plaza')}
        >
          Plaza Wise
        </button>
        <button
          className={`mode-btn ${viewMode === 'division' ? 'active' : ''}`}
          onClick={() => setViewMode('division')}
        >
          Division Wise
        </button>
        <button
          className={`mode-btn ${viewMode === 'area' ? 'active' : ''}`}
          onClick={() => setViewMode('area')}
        >
          Area Wise
        </button>
      </div>

      {viewMode === 'plaza' && renderPlazaView()}
      {viewMode === 'division' && renderDivisionView()}
      {viewMode === 'area' && renderAreaView()}
    </div>
  )
}

export default DailyCollectionComparisonTable
