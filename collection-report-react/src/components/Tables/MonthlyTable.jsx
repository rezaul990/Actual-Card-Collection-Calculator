import './Table.css'

function MonthlyTable({ data, title }) {
  if (!data) return <div className="no-data">No data available</div>

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const allPlazas = new Set()
  months.forEach(month => {
    const plazas = data[month] || {}
    Object.keys(plazas).forEach(plaza => allPlazas.add(plaza))
  })

  const plazaList = Array.from(allPlazas).sort()

  return (
    <div className="table-wrapper" style={{ overflowX: 'auto' }}>
      <table className="report-table monthly-table">
        <thead>
          <tr>
            <th>Plaza Name</th>
            {months.map(month => {
              const plazas = data[month] || {}
              return Object.keys(plazas).length > 0 ? (
                <th key={month} colSpan="4" style={{ textAlign: 'center', background: 'rgba(96, 165, 250, 0.2)' }}>
                  {month}
                </th>
              ) : null
            })}
          </tr>
          <tr>
            <th>Plaza Name</th>
            {months.map(month => {
              const plazas = data[month] || {}
              return Object.keys(plazas).length > 0 ? (
                <th key={`${month}-sub`} colSpan="4" style={{ fontSize: '11px', padding: '8px 4px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                    <span>AC Qty</span>
                    <span>Coll Qty</span>
                    <span>Not Coll</span>
                    <span>%</span>
                  </div>
                </th>
              ) : null
            })}
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
                    const percent = values.plazaQty > 0 ? ((values.collectionQty / values.plazaQty) * 100).toFixed(1) : '0.0'
                    return (
                      <td key={month} style={{ fontSize: '12px', padding: '8px 4px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', textAlign: 'center' }}>
                          <span>{values.plazaQty}</span>
                          <span>{values.collectionQty}</span>
                          <span>{notCollected}</span>
                          <span style={{ fontWeight: 700, color: '#60a5fa' }}>{percent}%</span>
                        </div>
                      </td>
                    )
                  } else {
                    return (
                      <td key={month} style={{ fontSize: '12px', padding: '8px 4px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', textAlign: 'center' }}>
                          <span>-</span>
                          <span>-</span>
                          <span>-</span>
                          <span>-</span>
                        </div>
                      </td>
                    )
                  }
                }
                return null
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default MonthlyTable
