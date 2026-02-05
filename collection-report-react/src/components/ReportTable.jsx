import React from 'react'
import './ReportTable.css'

function ReportTable({ data, title, isMonthly, isNotCollected }) {
  if (!data) return <div>No data available</div>

  if (isMonthly) {
    return <MonthlyTable data={data} title={title} />
  }

  if (isNotCollected) {
    return <NotCollectedTable data={data} title={title} />
  }

  return <StandardTable data={data} title={title} />
}

function StandardTable({ data, title }) {
  let totalQty = 0
  let totalCollection = 0

  const rows = Object.entries(data || {}).map(([plaza, values]) => {
    totalQty += values.plazaQty
    totalCollection += values.collectionQty
    return { plaza, ...values }
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
            <th>Collection Achieve Qty (&gt; 0)</th>
            <th>Not Collected Qty</th>
            <th>Coll %</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
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
            <td>{totalPercent}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

function MonthlyTable({ data, title }) {
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
                <th key={month} colSpan="4" style={{ textAlign: 'center', background: '#e3f2fd' }}>
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
                <React.Fragment key={month}>
                  <th style={{ fontSize: '11px' }}>AC Qty</th>
                  <th style={{ fontSize: '11px' }}>Coll Qty</th>
                  <th style={{ fontSize: '11px' }}>Not Coll</th>
                  <th style={{ fontSize: '11px' }}>%</th>
                </React.Fragment>
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
                      <React.Fragment key={month}>
                        <td style={{ fontSize: '12px' }}>{values.plazaQty}</td>
                        <td style={{ fontSize: '12px' }}>{values.collectionQty}</td>
                        <td style={{ fontSize: '12px' }}>{notCollected}</td>
                        <td style={{ fontSize: '12px', fontWeight: 700, color: '#0056b3' }}>{percent}%</td>
                      </React.Fragment>
                    )
                  } else {
                    return (
                      <React.Fragment key={month}>
                        <td style={{ fontSize: '12px' }}>-</td>
                        <td style={{ fontSize: '12px' }}>-</td>
                        <td style={{ fontSize: '12px' }}>-</td>
                        <td style={{ fontSize: '12px' }}>-</td>
                      </React.Fragment>
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

function NotCollectedTable({ data, title }) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  
  const allPlazas = new Set()
  months.forEach(month => {
    const plazas = data[month] || {}
    Object.keys(plazas).forEach(plaza => allPlazas.add(plaza))
  })

  const plazaList = Array.from(allPlazas).sort()

  return (
    <div className="table-wrapper" style={{ overflowX: 'auto' }}>
      <table className="report-table">
        <thead>
          <tr>
            <th>Plaza Name</th>
            {months.map(month => {
              const plazas = data[month] || {}
              return Object.keys(plazas).length > 0 ? (
                <th key={month} style={{ textAlign: 'center', background: '#e3f2fd' }}>
                  {month}
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ReportTable
