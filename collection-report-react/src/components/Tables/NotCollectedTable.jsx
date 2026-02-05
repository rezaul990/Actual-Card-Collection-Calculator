import './Table.css'

function NotCollectedTable({ data, title }) {
  if (!data) return <div className="no-data">No data available</div>

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const allPlazas = new Set()
  months.forEach(month => {
    const plazas = data[month] || {}
    Object.keys(plazas).forEach(plaza => allPlazas.add(plaza))
  })

  const plazaList = Array.from(allPlazas).sort()

  // Calculate month totals
  const monthTotals = {}
  months.forEach(month => {
    const plazas = data[month] || {}
    if (Object.keys(plazas).length > 0) {
      let total = 0
      Object.values(plazas).forEach(values => {
        total += values.plazaQty - values.collectionQty
      })
      monthTotals[month] = total
    }
  })

  // Calculate grand total
  let grandTotal = 0
  Object.values(monthTotals).forEach(total => {
    grandTotal += total
  })

  // Calculate plaza totals
  const plazaTotals = {}
  plazaList.forEach(plaza => {
    let total = 0
    months.forEach(month => {
      const plazas = data[month] || {}
      const values = plazas[plaza]
      if (values) {
        total += values.plazaQty - values.collectionQty
      }
    })
    plazaTotals[plaza] = total
  })

  return (
    <div className="table-wrapper" style={{ overflowX: 'auto' }}>
      <table className="report-table">
        <thead>
          <tr>
            <th>Plaza Name</th>
            {months.map(month => {
              const plazas = data[month] || {}
              return Object.keys(plazas).length > 0 ? (
                <th key={month} style={{ textAlign: 'center', background: 'rgba(96, 165, 250, 0.2)' }}>
                  {month}
                </th>
              ) : null
            })}
            <th style={{ textAlign: 'center', background: 'rgba(34, 197, 94, 0.2)' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {plazaList.map(plaza => (
            <tr key={plaza}>
              <td style={{ fontWeight: 700 }}>{plaza}</td>
              {months.map(month => {
                const plazas = data[month] || {}
                if (Object.keys(plazas).length > 0) {
                  const values = plazas[plaza]
                  if (values) {
                    const notCollected = values.plazaQty - values.collectionQty
                    return (
                      <td key={month} style={{ fontSize: '13px', textAlign: 'center', fontWeight: 600 }}>
                        {notCollected}
                      </td>
                    )
                  } else {
                    return (
                      <td key={month} style={{ fontSize: '13px', textAlign: 'center' }}>
                        -
                      </td>
                    )
                  }
                }
                return null
              })}
              <td style={{ fontSize: '13px', textAlign: 'center', fontWeight: 700, color: '#86efac' }}>
                {plazaTotals[plaza]}
              </td>
            </tr>
          ))}
          <tr className="total-row">
            <td>Total</td>
            {months.map(month => {
              const plazas = data[month] || {}
              if (Object.keys(plazas).length > 0) {
                return (
                  <td key={month} style={{ fontSize: '13px', textAlign: 'center', fontWeight: 700 }}>
                    {monthTotals[month]}
                  </td>
                )
              }
              return null
            })}
            <td style={{ fontSize: '13px', textAlign: 'center', fontWeight: 700 }}>
              {grandTotal}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default NotCollectedTable
