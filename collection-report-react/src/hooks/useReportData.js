import { useState } from 'react'
import * as XLSX from 'xlsx'
import { parseExcelData } from '../utils/dataParser'

export function useReportData() {
  const [reportData, setReportData] = useState(null)
  const [showReport, setShowReport] = useState(false)
  const [error, setError] = useState(null)

  const handleFileUpload = (file) => {
    try {
      setError(null)
      const reader = new FileReader()
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result)
        const workbook = XLSX.read(data, { type: 'array' })
        const sheet = workbook.Sheets[workbook.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 })

        const parsedData = parseExcelData(rows)
        setReportData(parsedData)
        setShowReport(true)
      }
      reader.readAsArrayBuffer(file)
    } catch (err) {
      setError(err.message)
      console.error('Error processing file:', err)
    }
  }

  const handleReset = () => {
    setReportData(null)
    setShowReport(false)
    setError(null)
  }

  return {
    reportData,
    showReport,
    error,
    handleFileUpload,
    handleReset,
  }
}
