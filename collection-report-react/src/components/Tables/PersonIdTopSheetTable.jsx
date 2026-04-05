import './Table.css'
import React from 'react'

function PersonIdTopSheetTable({ data, title }) {
  if (!data || !data.accountDetails) {
    return <div className="no-data">No data available</div>
  }

  const accountDetails = data.accountDetails

  // Group by Plaza and Assign Person ID
  const personGroups = {}
  accountDetails.forEach(account => {
    const plaza = account.plaza || 'Unknown'
    const personId = account.assignPersonId || 'Unknown'
    const key = `${plaza}|||${personId}` // Use delimiter to separate plaza and personId
    
    if (!personGroups[key]) {
      personGroups[key] = {
        plaza,
        personId,
        totalQty: 0,
        collectedQty: 0,
        targetAmount: 0,
        achieveAmount: 0,
      }
    }
    
    personGroups[key].totalQty++
    
    // Clean and parse Collection Target (remove spaces and commas)
    let target = 0
    if (account.collectionTarget != null && account.collectionTarget !== '') {
      const cleanedTarget = String(account.collectionTarget).replace(/[,\s]/g, '').trim()
      target = parseFloat(cleanedTarget) || 0
    }
    
    // Clean and parse Collection Achieve (remove spaces and commas)
    let achieve = 0
    if (account.collectionAchieve != null && account.collectionAchieve !== '') {
      const cleanedAchieve = String(account.collectionAchieve).replace(/[,\s]/g, '').trim()
      achieve = parseFloat(cleanedAchieve) || 0
    }
    
    // Debug logging for person ID 291
    if (personId === '291') {
      console.log('Person 291 - Target:', account.collectionTarget, 'Parsed:', target, 'Achieve:', account.collectionAchieve, 'Parsed:', achieve)
    }
    
    personGroups[key].targetAmount += target
    personGroups[key].achieveAmount += achieve
    
    if (achieve > 0) {
      personGroups[key].collectedQty++
    }
  })

  // Convert to array and sort by plaza, then by person ID
  const sortedPersons = Object.values(personGroups)
    .map(values => ({
      plaza: values.plaza,
      personId: values.personId,
      totalQty: values.totalQty,
      collectedQty: values.collectedQty,
      notCollectedQty: values.totalQty - values.collectedQty,
      percentage: ((values.collectedQty / values.totalQty) * 100).toFixed(2),
      targetAmount: values.targetAmount,
      achieveAmount: values.achieveAmount,
      amountPercentage: values.targetAmount > 0 
        ? ((values.achieveAmount / values.targetAmount) * 100).toFixed(2)
        : '0.00',
    }))
    .sort((a, b) => {
      if (a.plaza !== b.plaza) {
        return a.plaza.localeCompare(b.plaza)
      }
      return a.personId.localeCompare(b.personId)
    })

  // Group by plaza for subtotals
  const plazaGroups = {}
  sortedPersons.forEach(person => {
    if (!plazaGroups[person.plaza]) {
      plazaGroups[person.plaza] = []
    }
    plazaGroups[person.plaza].push(person)
  })

  // Calculate grand totals
  const grandTotals = sortedPersons.reduce(
    (acc, person) => ({
      totalQty: acc.totalQty + person.totalQty,
      collectedQty: acc.collectedQty + person.collectedQty,
      notCollectedQty: acc.notCollectedQty + person.notCollectedQty,
      targetAmount: acc.targetAmount + person.targetAmount,
      achieveAmount: acc.achieveAmount + person.achieveAmount,
    }),
    { totalQty: 0, collectedQty: 0, notCollectedQty: 0, targetAmount: 0, achieveAmount: 0 }
  )

  const grandTotalPercentage = grandTotals.totalQty > 0 
    ? ((grandTotals.collectedQty / grandTotals.totalQty) * 100).toFixed(2) 
    : '0.00'

  const grandTotalAmountPercentage = grandTotals.targetAmount > 0
    ? ((grandTotals.achieveAmount / grandTotals.targetAmount) * 100).toFixed(2)
    : '0.00'

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
          </tr>
        </thead>
        <tbody>
          {Object.entries(plazaGroups).map(([plaza, persons]) => {
            // Calculate plaza subtotal
            const plazaSubtotal = persons.reduce(
              (acc, person) => ({
                totalQty: acc.totalQty + person.totalQty,
                collectedQty: acc.collectedQty + person.collectedQty,
                notCollectedQty: acc.notCollectedQty + person.notCollectedQty,
                targetAmount: acc.targetAmount + person.targetAmount,
                achieveAmount: acc.achieveAmount + person.achieveAmount,
              }),
              { totalQty: 0, collectedQty: 0, notCollectedQty: 0, targetAmount: 0, achieveAmount: 0 }
            )
            
            const plazaPercentage = plazaSubtotal.totalQty > 0
              ? ((plazaSubtotal.collectedQty / plazaSubtotal.totalQty) * 100).toFixed(2)
              : '0.00'

            const plazaAmountPercentage = plazaSubtotal.targetAmount > 0
              ? ((plazaSubtotal.achieveAmount / plazaSubtotal.targetAmount) * 100).toFixed(2)
              : '0.00'

            return (
              <React.Fragment key={plaza}>
                {persons.map((person, index) => (
                  <tr key={`${person.plaza}-${person.personId}-${index}`}>
                    <td>{person.plaza}</td>
                    <td>{person.personId}</td>
                    <td style={{ textAlign: 'center' }}>{person.totalQty}</td>
                    <td style={{ textAlign: 'center' }}>{person.collectedQty}</td>
                    <td style={{ textAlign: 'center' }}>{person.notCollectedQty}</td>
                    <td style={{ textAlign: 'center' }}>{person.percentage}%</td>
                    <td style={{ textAlign: 'right' }}>{person.targetAmount.toFixed(2)}</td>
                    <td style={{ textAlign: 'right' }}>{person.achieveAmount.toFixed(2)}</td>
                    <td style={{ textAlign: 'center' }}>{person.amountPercentage}%</td>
                  </tr>
                ))}
                <tr className="subtotal-row" style={{ backgroundColor: '#f0f9ff', fontWeight: '700' }}>
                  <td>{plaza} Subtotal</td>
                  <td></td>
                  <td style={{ textAlign: 'center' }}>{plazaSubtotal.totalQty}</td>
                  <td style={{ textAlign: 'center' }}>{plazaSubtotal.collectedQty}</td>
                  <td style={{ textAlign: 'center' }}>{plazaSubtotal.notCollectedQty}</td>
                  <td style={{ textAlign: 'center' }}>{plazaPercentage}%</td>
                  <td style={{ textAlign: 'right' }}>{plazaSubtotal.targetAmount.toFixed(2)}</td>
                  <td style={{ textAlign: 'right' }}>{plazaSubtotal.achieveAmount.toFixed(2)}</td>
                  <td style={{ textAlign: 'center' }}>{plazaAmountPercentage}%</td>
                </tr>
              </React.Fragment>
            )
          })}
          <tr className="total-row">
            <td colSpan="2">Grand Total</td>
            <td style={{ textAlign: 'center' }}>{grandTotals.totalQty}</td>
            <td style={{ textAlign: 'center' }}>{grandTotals.collectedQty}</td>
            <td style={{ textAlign: 'center' }}>{grandTotals.notCollectedQty}</td>
            <td style={{ textAlign: 'center' }}>{grandTotalPercentage}%</td>
            <td style={{ textAlign: 'right' }}>{grandTotals.targetAmount.toFixed(2)}</td>
            <td style={{ textAlign: 'right' }}>{grandTotals.achieveAmount.toFixed(2)}</td>
            <td style={{ textAlign: 'center' }}>{grandTotalAmountPercentage}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default PersonIdTopSheetTable
