import { useState } from 'react'
import './Table.css'

function TargetAchieveTable({ data, title }) {
  const [viewMode, setViewMode] = useState('plaza') // 'plaza', 'person'

  if (!data || !data.accountDetails) {
    return <div className="no-data">No data available</div>
  }

  const accountDetails = data.accountDetails

  const renderPlazaView = () => {
    // Group by plaza
    const plazaGroups = {}
    accountDetails.forEach(account => {
      const plaza = account.plaza || 'Unknown'
      if (!plazaGroups[plaza]) {
        plazaGroups[plaza] = {
          targetQty: 0,
          achieveQty: 0,
          targetAmount: 0,
          achieveAmount: 0,
        }
      }
      
      const target = parseFloat(account.collectionTarget) || 0
      const achieve = parseFloat(account.collectionAchieve) || 0
      
      plazaGroups[plaza].targetQty += 1
      plazaGroups[plaza].achieveQty += achieve > 0 ? 1 : 0
      plazaGroups[plaza].targetAmount += target
      plazaGroups[plaza].achieveAmount += achieve
    })

    let totalTargetQty = 0
    let totalAchieveQty = 0
    let totalTargetAmount = 0
    let totalAchieveAmount = 0

    const rows = Object.entries(plazaGroups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([plaza, values]) => {
        totalTargetQty += values.targetQty
        totalAchieveQty += values.achieveQty
        totalTargetAmount += values.targetAmount
        totalAchieveAmount += values.achieveAmount

        const qtyPercent = values.targetQty > 0 ? ((values.achieveQty / values.targetQty) * 100).toFixed(2) : '0.00'
        const amountPercent = values.targetAmount > 0 ? ((values.achieveAmount / values.targetAmount) * 100).toFixed(2) : '0.00'

        return {
          name: plaza,
          targetQty: values.targetQty,
          achieveQty: values.achieveQty,
          qtyPercent,
          targetAmount: values.targetAmount.toFixed(2),
          achieveAmount: values.achieveAmount.toFixed(2),
          amountPercent,
        }
      })

    const totalQtyPercent = totalTargetQty > 0 ? ((totalAchieveQty / totalTargetQty) * 100).toFixed(2) : '0.00'
    const totalAmountPercent = totalTargetAmount > 0 ? ((totalAchieveAmount / totalTargetAmount) * 100).toFixed(2) : '0.00'

    return (
      <div className="table-wrapper">
        <table className="report-table">
          <thead>
            <tr>
              <th rowSpan="2">Plaza Name</th>
              <th colSpan="3" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>Collection Quantity</th>
              <th colSpan="3" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>Collection Amount</th>
            </tr>
            <tr>
              <th style={{ fontSize: '14px' }}>Target Qty</th>
              <th style={{ fontSize: '14px' }}>Achieve Qty</th>
              <th style={{ fontSize: '14px' }}>%</th>
              <th style={{ fontSize: '14px' }}>Target Amount</th>
              <th style={{ fontSize: '14px' }}>Achieve Amount</th>
              <th style={{ fontSize: '14px' }}>%</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.name}>
                <td style={{ fontWeight: 800 }}>{row.name}</td>
                <td>{row.targetQty}</td>
                <td>{row.achieveQty}</td>
                <td className="percent-cell">{row.qtyPercent}%</td>
                <td>{row.targetAmount}</td>
                <td>{row.achieveAmount}</td>
                <td className="percent-cell">{row.amountPercent}%</td>
              </tr>
            ))}
            <tr className="total-row">
              <td>Total</td>
              <td>{totalTargetQty}</td>
              <td>{totalAchieveQty}</td>
              <td>{totalQtyPercent}%</td>
              <td>{totalTargetAmount.toFixed(2)}</td>
              <td>{totalAchieveAmount.toFixed(2)}</td>
              <td>{totalAmountPercent}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  const renderPersonView = () => {
    // Group by assign person ID
    const personGroups = {}
    accountDetails.forEach(account => {
      const person = account.assignPersonId || 'Unknown'
      if (!personGroups[person]) {
        personGroups[person] = {
          targetQty: 0,
          achieveQty: 0,
          targetAmount: 0,
          achieveAmount: 0,
        }
      }
      
      const target = parseFloat(account.collectionTarget) || 0
      const achieve = parseFloat(account.collectionAchieve) || 0
      
      personGroups[person].targetQty += 1
      personGroups[person].achieveQty += achieve > 0 ? 1 : 0
      personGroups[person].targetAmount += target
      personGroups[person].achieveAmount += achieve
    })

    let totalTargetQty = 0
    let totalAchieveQty = 0
    let totalTargetAmount = 0
    let totalAchieveAmount = 0

    const rows = Object.entries(personGroups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([person, values]) => {
        totalTargetQty += values.targetQty
        totalAchieveQty += values.achieveQty
        totalTargetAmount += values.targetAmount
        totalAchieveAmount += values.achieveAmount

        const qtyPercent = values.targetQty > 0 ? ((values.achieveQty / values.targetQty) * 100).toFixed(2) : '0.00'
        const amountPercent = values.targetAmount > 0 ? ((values.achieveAmount / values.targetAmount) * 100).toFixed(2) : '0.00'

        return {
          name: person,
          targetQty: values.targetQty,
          achieveQty: values.achieveQty,
          qtyPercent,
          targetAmount: values.targetAmount.toFixed(2),
          achieveAmount: values.achieveAmount.toFixed(2),
          amountPercent,
        }
      })

    const totalQtyPercent = totalTargetQty > 0 ? ((totalAchieveQty / totalTargetQty) * 100).toFixed(2) : '0.00'
    const totalAmountPercent = totalTargetAmount > 0 ? ((totalAchieveAmount / totalTargetAmount) * 100).toFixed(2) : '0.00'

    return (
      <div className="table-wrapper">
        <table className="report-table">
          <thead>
            <tr>
              <th rowSpan="2">Assign Person ID</th>
              <th colSpan="3" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' }}>Collection Quantity</th>
              <th colSpan="3" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>Collection Amount</th>
            </tr>
            <tr>
              <th style={{ fontSize: '14px' }}>Target Qty</th>
              <th style={{ fontSize: '14px' }}>Achieve Qty</th>
              <th style={{ fontSize: '14px' }}>%</th>
              <th style={{ fontSize: '14px' }}>Target Amount</th>
              <th style={{ fontSize: '14px' }}>Achieve Amount</th>
              <th style={{ fontSize: '14px' }}>%</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(row => (
              <tr key={row.name}>
                <td style={{ fontWeight: 800 }}>{row.name}</td>
                <td>{row.targetQty}</td>
                <td>{row.achieveQty}</td>
                <td className="percent-cell">{row.qtyPercent}%</td>
                <td>{row.targetAmount}</td>
                <td>{row.achieveAmount}</td>
                <td className="percent-cell">{row.amountPercent}%</td>
              </tr>
            ))}
            <tr className="total-row">
              <td>Total</td>
              <td>{totalTargetQty}</td>
              <td>{totalAchieveQty}</td>
              <td>{totalQtyPercent}%</td>
              <td>{totalTargetAmount.toFixed(2)}</td>
              <td>{totalAchieveAmount.toFixed(2)}</td>
              <td>{totalAmountPercent}%</td>
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
          className={`mode-btn ${viewMode === 'person' ? 'active' : ''}`}
          onClick={() => setViewMode('person')}
        >
          Person Wise
        </button>
      </div>

      {viewMode === 'plaza' && renderPlazaView()}
      {viewMode === 'person' && renderPersonView()}
    </div>
  )
}

export default TargetAchieveTable
