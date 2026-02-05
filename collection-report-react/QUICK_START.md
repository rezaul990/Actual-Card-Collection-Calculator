# Quick Start Guide

## Installation

```bash
npm install
```

## Running the App

```bash
npm run dev
```

The app will be available at `http://localhost:3000/`

## Project Structure Overview

### Clean Architecture Layers

```
┌─────────────────────────────────────┐
│   Presentation Layer (Components)   │
│  UploadView → ReportView → Tables   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Business Logic Layer (Services)   │
│  reportService, exportService       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   State Management Layer (Hooks)    │
│  useReportData, useReportTabs       │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Data Layer (Utils)                │
│  dataParser.js                      │
└─────────────────────────────────────┘
```

## File Organization

```
src/
├── components/          # UI Components (organized by feature)
│   ├── Buttons/        # Action buttons
│   ├── Layout/         # Page structure
│   ├── Tables/         # Table components
│   ├── Report/         # Report orchestrator
│   └── Upload/         # Upload interface
├── hooks/              # Custom React hooks
├── services/           # Business logic
├── App.jsx             # Main app
└── index.css           # Global styles
```

## Key Directories

### `components/`
Organized by feature/domain for easy navigation:
- **Buttons**: All button components
- **Layout**: Header, Tabs, Container
- **Tables**: StandardTable, MonthlyTable, NotCollectedTable
- **Report**: Main report view
- **Upload**: File upload interface

### `services/`
Pure business logic, no React dependencies:
- **reportService.js**: Data retrieval and formatting
- **exportService.js**: Export functionality
- **dataParser.js**: Excel parsing

### `hooks/`
Custom React hooks for state management:
- **useReportData.js**: File upload and data state
- **useReportTabs.js**: Tab management

## How to Add a New Feature

### 1. Add a New Table Type
```javascript
// Create: src/components/Tables/CustomTable.jsx
import './Table.css'

function CustomTable({ data, title }) {
  // Your table logic
  return <div className="table-wrapper">...</div>
}

export default CustomTable
```

### 2. Update ReportView to Use It
```javascript
// In src/components/Report/ReportView.jsx
const renderTable = () => {
  if (tableData.isCustom) {
    return <CustomTable data={tableData.data} title={tableData.title} />
  }
  // ... other conditions
}
```

### 3. Add Service Logic if Needed
```javascript
// In src/services/reportService.js
export function getTableData(data, activeTab) {
  // ... existing cases
  case 'custom':
    return { data: data.custom, title: 'Custom Report', isCustom: true }
}
```

## Data Flow Example

```
User drops Excel file
    ↓
UploadView.handleDrop()
    ↓
useReportData.handleFileUpload()
    ↓
dataParser.parseExcelData()
    ↓
reportData state updated
    ↓
ReportView renders
    ↓
reportService.getTableData()
    ↓
StandardTable/MonthlyTable/NotCollectedTable renders
```

## Common Tasks

### Change Colors
Edit the gradient colors in component CSS files:
```css
background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
```

### Add New Tab
1. Update `useReportTabs.js` TABS array
2. Add case in `reportService.getTableData()`
3. Add corresponding data in `dataParser.js`

### Modify Table Columns
Edit the table component (e.g., `StandardTable.jsx`) and update the `<th>` headers and `<td>` cells.

### Change Export Format
Edit `exportService.js` functions to modify Excel sheet structure or image export settings.

## Debugging

### Check Console
Open browser DevTools (F12) to see any errors or warnings.

### Hot Module Reload
Changes to files automatically reload in the browser. If not, refresh manually.

### Check Network
Verify Excel file is being read correctly by checking the parsed data in browser console.

## Performance Tips

1. **Lazy Load Tables**: Tables only render when their tab is active
2. **Memoize Components**: Use `React.memo()` for table rows if needed
3. **Optimize Exports**: Large datasets may take time to export

## Troubleshooting

### App not loading
- Check if `npm run dev` is running
- Clear browser cache (Ctrl+Shift+Delete)
- Restart dev server

### Excel file not parsing
- Verify file format (.xlsx or .xls)
- Check if header row is at row 6
- Ensure Plaza column exists

### Export not working
- Check browser console for errors
- Verify data is loaded correctly
- Try with smaller dataset first

## Next Steps

1. Read `ARCHITECTURE.md` for detailed architecture
2. Explore component files to understand structure
3. Modify styles in CSS files
4. Add new features following the pattern
5. Build and deploy when ready

## Build for Production

```bash
npm run build
```

Output will be in `dist/` folder, ready to deploy.
