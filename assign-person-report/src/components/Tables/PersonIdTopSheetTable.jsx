import './Table.css'
import React from 'react'

function PersonIdTopSheetTable({ data, overdueData }) {
  if (!data || !data.accountDetails) {
    return <div className="no-data">No data available</div>
  }

  const accountDetails = data.accountDetails
  const hasOverdue = overdueData && overdueData.size > 0

  const personGroups = {}
  accountDetails.forEach(account => {
    const plaza = account.plaza || 'Unknown'
    const personId = account.assignPersonId || 'Unknown'
    const key = `${plaza}|||${personId}`

    if (!personGroups[key]) {
      personGroups[key] = { plaza, personId, totalQty: 0, collectedQty: 0, targetAmount: 0, achieveAmount: 0, overdueAmount: 0 }
    }

    personGroups[key].totalQty++

    let target = 0
    if (account.collectionTarget != null && account.collectionTarget !== '') {
      target = parseFloat(String(account.collectionTarget).replace(/[,\s]/g, '')) || 0
    }
    let achieve = 0
    if (account.collectionAchieve != null && account.collectionAchieve !== '') {
      achieve = parseFloat(String(account.collectionAchieve).replace(/[,\s]/g, '')) || 0
    }

    personGroups[key].targetAmount += target
    personGroups[key].achieveAmount += achieve
    if (achieve > 0) personGroups[key].collectedQty++

    if (hasOverdue && account.invoiceNo) {
      personGroups[key].overdueAmount += overdueData.get(String(account.invoiceNo).trim()) || 0
    }
  })

  const sortedPersons = Object.values(personGroups)
    .map(v => ({
      ...v,
      notCollectedQty: v.totalQty - v.collectedQty,
      percentage: ((v.collectedQty / v.totalQty) * 100).toFixed(2),
      amountPercentage: v.targetAmount > 0 ? ((v.achieveAmount / v.targetAmount) * 100).toFixed(2) : '0.00',
    }))
    .sort((a, b) => a.plaza !== b.plaza ? a.plaza.localeCompare(b.plaza) : a.personId.localeCompare(b.personId))

  const plazaGroups = {}
  sortedPersons.forEach(p => {
    if (!plazaGroups[p.plaza]) plazaGroups[p.plaza] = []
    plazaGroups[p.plaza].push(p)
  })

  const grandTotals = sortedPersons.reduce((acc, p) => ({
    totalQty: acc.totalQty + p.totalQty,
    collectedQty: acc.collectedQty + p.collectedQty,
    notCollectedQty: acc.notCollectedQty + p.notCollectedQty,
    targetAmount: acc.targetAmount + p.targetAmount,
    achieveAmount: acc.achieveAmount + p.achieveAmount,
    overdueAmount: acc.overdueAmount + p.overdueAmount,
  }), { totalQty: 0, collectedQty: 0, notCollectedQty: 0, targetAmount: 0, achieveAmount: 0, overdueAmount: 0 })

  const grandPct = grandTotals.totalQty > 0 ? ((grandTotals.collectedQty / grandTotals.totalQty) * 100).toFixed(2) : '0.00'
  const grandAmtPct = grandTotals.targetAmount > 0 ? ((grandTotals.achieveAmount / grandTotals.targetAmount) * 100).toFixed(2) : '0.00'

  return (
    <div className="table-wrapper">
      <table className="report-table">
        <thead>
          <tr>
            <th>Plaza Name</th>
            <th>Assign Person ID</th>
            <th>AC Qty</th>
            <th>Coll Achieve Qty</th>
            <th>Not Coll Qty</th>
            <th>Coll %</th>
            <th>Target Amount</th>
            <th>Achieve Amount</th>
            <th>Amount %</th>
            {hasOverdue && <th>Overdue Amount</th>}
          </tr>
        </thead>
        <tbody>
          {Object.entries(plazaGroups).map(([plaza, persons]) => {
            const sub = persons.reduce((acc, p) => ({
              totalQty: acc.totalQty + p.totalQty,
              collectedQty: acc.collectedQty + p.collectedQty,
              notCollectedQty: acc.notCollectedQty + p.notCollectedQty,
              targetAmount: acc.targetAmount + p.targetAmount,
              achieveAmount: acc.achieveAmount + p.achieveAmount,
              overdueAmount: acc.overdueAmount + p.overdueAmount,
            }), { totalQty: 0, collectedQty: 0, notCollectedQty: 0, targetAmount: 0, achieveAmount: 0, overdueAmount: 0 })

            const subPct = sub.totalQty > 0 ? ((sub.collectedQty / sub.totalQty) * 100).toFixed(2) : '0.00'
            const subAmtPct = sub.targetAmount > 0 ? ((sub.achieveAmount / sub.targetAmount) * 100).toFixed(2) : '0.00'

            return (
              <React.Fragment key={plaza}>
                {persons.map((person, idx) => (
                  <tr key={`${person.plaza}-${person.personId}-${idx}`}>
                    <td>{person.plaza}</td>
                    <td>{person.personId}</td>
                    <td style={{ textAlign: 'center' }}>{person.totalQty}</td>
                    <td style={{ textAlign: 'center' }}>{person.collectedQty}</td>
                    <td style={{ textAlign: 'center' }}>{person.notCollectedQty}</td>
                    <td style={{ textAlign: 'center' }}>{person.percentage}%</td>
                    <td style={{ textAlign: 'right' }}>{person.targetAmount.toFixed(2)}</td>
                    <td style={{ textAlign: 'right' }}>{person.achieveAmount.toFixed(2)}</td>
                    <td style={{ textAlign: 'center' }}>{person.amountPercentage}%</td>
                    {hasOverdue && <td style={{ textAlign: 'right' }}>{person.overdueAmount.toFixed(2)}</td>}
                  </tr>
                ))}
                <tr className="subtotal-row" style={{ backgroundColor: '#f0f9ff', fontWeight: '700' }}>
                  <td>{plaza} Subtotal</td>
                  <td></td>
                  <td style={{ textAlign: 'center' }}>{sub.totalQty}</td>
                  <td style={{ textAlign: 'center' }}>{sub.collectedQty}</td>
                  <td style={{ textAlign: 'center' }}>{sub.notCollectedQty}</td>
                  <td style={{ textAlign: 'center' }}>{subPct}%</td>
                  <td style={{ textAlign: 'right' }}>{sub.targetAmount.toFixed(2)}</td>
                  <td style={{ textAlign: 'right' }}>{sub.achieveAmount.toFixed(2)}</td>
                  <td style={{ textAlign: 'center' }}>{subAmtPct}%</td>
                  {hasOverdue && <td style={{ textAlign: 'right' }}>{sub.overdueAmount.toFixed(2)}</td>}
                </tr>
              </React.Fragment>
            )
          })}
          <tr className="total-row">
            <td colSpan="2">Grand Total</td>
            <td style={{ textAlign: 'center' }}>{grandTotals.totalQty}</td>
            <td style={{ textAlign: 'center' }}>{grandTotals.collectedQty}</td>
            <td style={{ textAlign: 'center' }}>{grandTotals.notCollectedQty}</td>
            <td style={{ textAlign: 'center' }}>{grandPct}%</td>
            <td style={{ textAlign: 'right' }}>{grandTotals.targetAmount.toFixed(2)}</td>
            <td style={{ textAlign: 'right' }}>{grandTotals.achieveAmount.toFixed(2)}</td>
            <td style={{ textAlign: 'center' }}>{grandAmtPct}%</td>
            {hasOverdue && <td style={{ textAlign: 'right' }}>{grandTotals.overdueAmount.toFixed(2)}</td>}
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default PersonIdTopSheetTable
