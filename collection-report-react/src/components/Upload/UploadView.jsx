import { useRef } from 'react'
import './UploadView.css'

function UploadView({ onFileUpload, error }) {
  const fileInputRef = useRef(null)
  const dropZoneRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    dropZoneRef.current?.classList.add('dragover')
  }

  const handleDragLeave = () => {
    dropZoneRef.current?.classList.remove('dragover')
  }

  const handleDrop = (e) => {
    e.preventDefault()
    dropZoneRef.current?.classList.remove('dragover')
    const file = e.dataTransfer.files[0]
    if (file) onFileUpload(file)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) onFileUpload(file)
  }

  return (
    <div
      ref={dropZoneRef}
      className="drop-zone"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="drop-zone-content">
        <div className="drop-zone-box" onClick={() => fileInputRef.current?.click()}>
          <div className="drop-icon">📁</div>
          <h1>Account Wise Actual Card Collection Report</h1>
          <p>Drag & Drop Excel file here</p>
          <p className="sub-text">or click to browse</p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
    </div>
  )
}

export default UploadView
