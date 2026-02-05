import { useState, useEffect } from 'react'
import './Header.css'

function Header() {
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
    <header className="report-header">
      <h1>Account Wise Actual Card Collection Report</h1>
      <p className="datetime">{dateTime}</p>
    </header>
  )
}

export default Header
