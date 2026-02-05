# Collection Report - Architecture Documentation

## Project Structure

```
src/
├── components/
│   ├── Buttons/
│   │   ├── ActionButtons.jsx       # Export, Save, Upload buttons
│   │   └── ActionButtons.css
│   ├── Layout/
│   │   ├── Header.jsx              # Report title and datetime
│   │   ├── Header.css
│   │   ├── Tabs.jsx                # Tab navigation
│   │   ├── Tabs.css
│   │   ├── Container.jsx           # Main container wrapper
│   │   └── Container.css
│   ├── Tables/
│   │   ├── StandardTable.jsx       # Standard report table
│   │   ├── MonthlyTable.jsx        # Monthly breakdown table
│   │   ├── NotCollectedTable.jsx   # Not collected qty table
│   │   └── Table.css               # Shared table styles
│   ├── Report/
│   │   └── ReportView.jsx          # Main report view component
│   └── Upload/
│       ├── UploadView.jsx          # File upload interface
│       └── UploadView.css
├── hooks/
│   ├── useReportData.js            # File upload and data state
│   └── useReportTabs.js            # Tab management
├── services/
│   ├── reportService.js            # Report data retrieval and formatting
│   ├── exportService.js            # Excel and image export logic
│   └── dataParser.js               # Excel parsing and date handling
├── App.jsx                         # Main app component
├── App.css                         # Global app styles
├── index.css                       # Global styles
└── main.jsx                        # React entry point
```

## Architecture Layers

### 1. **Presentation Layer** (`components/`)
Organized by feature/domain:
- **Buttons**: Action buttons (Save, Export, Upload)
- **Layout**: Page structure (Header, Tabs, Container)
- **Tables**: Different table types (Standard, Monthly, NotCollected)
- **Report**: Main report view orchestrator
- **Upload**: File upload interface

### 2. **Business Logic Layer** (`services/`)
- **reportService.js**: Report data retrieval, formatting, calculations
- **exportService.js**: Excel and image export functionality
- **dataParser.js**: Excel file parsing and date conversion

### 3. **State Management Layer** (`hooks/`)
- **useReportData.js**: File upload, data parsing, error handling
- **useReportTabs.js**: Tab state and configuration

### 4. **Entry Point** (`App.jsx`)
- Routes between Upload and Report views
- Manages top-level state

## Data Flow

```
User Upload File
    ↓
useReportData Hook
    ↓
dataParser.js (parseExcelData)
    ↓
reportData State
    ↓
ReportView Component
    ↓
reportService.js (getTableData)
    ↓
Table Components (StandardTable, MonthlyTable, NotCollectedTable)
    ↓
Rendered Report
```

## Key Features

### File Upload
- Drag & drop support
- Click to browse
- Error handling
- File validation

### Report Generation
- Current report (all plazas)
- Last 4 months breakdown
- 2024 and 2025 yearly reports
- 2025 month-wise report
- 2025 not collected quantities

### Export Options
- **PNG Export**: Save report as image (via html2canvas)
- **Excel Export**: All reports in separate sheets (via XLSX)

### Date Handling
- Supports "Day-Month-Year" format (29-Jul-24)
- Excel serial date conversion
- Year cutoff: ≤30 → 2000s, >30 → 1900s

## Component Responsibilities

### UploadView
- Displays drag & drop zone
- Handles file selection
- Shows error messages

### ReportView
- Orchestrates report display
- Manages tab switching
- Renders appropriate table type
- Handles export actions

### Table Components
- **StandardTable**: Basic plaza-wise data
- **MonthlyTable**: Multi-column month breakdown
- **NotCollectedTable**: Only not-collected quantities

### ActionButtons
- Save as PNG
- Download Excel
- Upload new file

## Services

### reportService.js
```javascript
getTableData(data, activeTab)      // Get data for active tab
formatDateTime()                    // Format current date/time
calculateTotals(data)              // Calculate totals and percentages
```

### exportService.js
```javascript
exportAsImage(containerRef)        // Export report as PNG
exportAsExcel(data)                // Export all reports as Excel
```

### dataParser.js
```javascript
parseExcelData(rows)               // Parse Excel file
getMonthName(dateValue)            // Extract month name
getMonthKey(dateValue)             // Get month key for grouping
getYear(dateValue)                 // Extract year
```

## Styling Architecture

### Modern Design System
- **Dark Theme**: Slate-900 to slate-800 gradients
- **Accent Colors**: Blue (#3b82f6), Green (#10b981), Orange (#f59e0b)
- **Effects**: Glassmorphism with backdrop blur
- **Animations**: Smooth transitions and hover effects

### CSS Organization
- Global styles: `index.css`, `App.css`
- Component-scoped: Each component has its own CSS file
- Shared styles: `Table.css` for all table types

## State Management

### useReportData Hook
```javascript
{
  reportData,      // Parsed Excel data
  showReport,      // Boolean to show/hide report
  error,           // Error message if any
  handleFileUpload,// Function to process file
  handleReset      // Function to reset state
}
```

### useReportTabs Hook
```javascript
{
  tabs,            // Array of tab configurations
  activeTab,       // Current active tab ID
  setActiveTab     // Function to change tab
}
```

## Excel File Requirements

- **Header Row**: Row 6 (index 5)
- **Plaza Column**: Auto-detected (contains "plaza")
- **Collection Column**: Column V (index 21)
- **Invoice Date Column**: Column O (index 14)
- **Date Format**: "Day-Month-Year" (e.g., 29-Jul-24)

## Performance Considerations

1. **Lazy Rendering**: Tables only render when tab is active
2. **Memoization**: Consider adding React.memo for table components
3. **Code Splitting**: Services are modular and can be lazy-loaded
4. **CSS-in-JS**: Minimal CSS, leveraging modern CSS features

## Future Enhancements

1. Add data filtering and search
2. Implement data caching
3. Add chart visualizations
4. Support multiple file formats
5. Add user preferences/settings
6. Implement undo/redo functionality
7. Add real-time data updates
8. Implement data validation UI

## Development

### Running the App
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

### Adding New Features
1. Create component in appropriate folder
2. Add service logic if needed
3. Create custom hook if managing state
4. Import and use in parent component
5. Add corresponding CSS file

### Code Style
- Use functional components with hooks
- Keep components focused and single-responsibility
- Extract business logic to services
- Use descriptive variable and function names
- Add comments for complex logic
