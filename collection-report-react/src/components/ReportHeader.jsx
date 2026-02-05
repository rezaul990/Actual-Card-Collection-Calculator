import { useState, useEffect } from 'react'
import './ReportHeader.css'

function ReportHeader() {
  const [dateTime, setDateTime] = useState('')

  useEffect(() => {
    const now = new Date()
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }
    setDateTime(now.toLocaleDateString('en-US', options))
  }, [])

  return (
    <div className="report-header">
      <h1>Account Wise Actual Card Collection Report</h1>
      <div className="datetime">{dateTime}</div>
    </div>
  )
}

export default ReportHeader
