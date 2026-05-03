import { exportAsImage, exportAsExcel, exportPersonIdReportAsImage } from '../../services/exportService'
import './ActionButtons.css'

function ActionButtons({ data, overdueData, onReset, containerRef, isPersonIdReport }) {
  const handleSaveImage = async () => {
    if (isPersonIdReport) {
      await exportPersonIdReportAsImage(containerRef)
    } else {
      await exportAsImage(containerRef)
    }
  }

  const handleDownloadExcel = () => {
    exportAsExcel(data, overdueData)
  }

  return (
    <div className="btn-container">
      <button className="btn btn-save" onClick={handleSaveImage} title={isPersonIdReport ? "Save Person ID Report as shareable image" : "Save report as PNG image"}>
        📷 {isPersonIdReport ? 'Share as Image' : 'Save as Image'}
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
