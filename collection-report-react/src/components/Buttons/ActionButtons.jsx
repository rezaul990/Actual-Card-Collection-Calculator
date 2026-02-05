import { exportAsImage, exportAsExcel } from '../../services/exportService'
import './ActionButtons.css'

function ActionButtons({ data, onReset, containerRef }) {
  const handleSaveImage = async () => {
    await exportAsImage(containerRef)
  }

  const handleDownloadExcel = () => {
    exportAsExcel(data)
  }

  return (
    <div className="btn-container">
      <button className="btn btn-save" onClick={handleSaveImage} title="Save report as PNG image">
        📷 Save as Image
      </button>
      <button className="btn btn-excel" onClick={handleDownloadExcel} title="Download all reports as Excel file">
        📊 Download Excel
      </button>
      <button className="btn btn-reset" onClick={onReset} title="Upload a new file">
        Upload Another File
      </button>
    </div>
  )
}

export default ActionButtons
