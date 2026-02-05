# Project Structure - Visual Guide

## Complete Directory Tree

```
collection-report-react/
├── src/
│   ├── components/                    # UI Components (organized by feature)
│   │   ├── Buttons/
│   │   │   ├── ActionButtons.jsx      # Save, Export, Upload buttons
│   │   │   └── ActionButtons.css      # Button styles
│   │   │
│   │   ├── Layout/
│   │   │   ├── Header.jsx             # Report title & datetime
│   │   │   ├── Header.css
│   │   │   ├── Tabs.jsx               # Tab navigation
│   │   │   ├── Tabs.css
│   │   │   ├── Container.jsx          # Main container wrapper
│   │   │   └── Container.css
│   │   │
│   │   ├── Tables/
│   │   │   ├── StandardTable.jsx      # Basic plaza-wise table
│   │   │   ├── MonthlyTable.jsx       # Multi-column monthly table
│   │   │   ├── NotCollectedTable.jsx  # Not collected qty table
│   │   │   └── Table.css              # Shared table styles
│   │   │
│   │   ├── Report/
│   │   │   └── ReportView.jsx         # Main report orchestrator
│   │   │
│   │   └── Upload/
│   │       ├── UploadView.jsx         # File upload interface
│   │       └── UploadView.css         # Upload styles
│   │
│   ├── hooks/                         # Custom React Hooks
│   │   ├── useReportData.js           # File upload & data state
│   │   └── useReportTabs.js           # Tab management
│   │
│   ├── services/                      # Business Logic Layer
│   │   ├── reportService.js           # Report data & formatting
│   │   ├── exportService.js           # Excel & image export
│   │   └── dataParser.js              # Excel parsing & dates
│   │
│   ├── App.jsx                        # Main app component
│   ├── App.css                        # Global app styles
│   ├── index.css                      # Global styles
│   └── main.jsx                       # React entry point
│
├── public/
│   └── vite.svg
│
├── ARCHITECTURE.md                    # Detailed architecture docs
├── QUICK_START.md                     # Quick reference guide
├── README_ARCHITECTURE.md             # Architecture overview
├── PROJECT_STRUCTURE.md               # This file
├── package.json
├── vite.config.js
├── index.html
└── README.md
```

## Component Hierarchy

```
App
├── UploadView (when !showReport)
│   └── Drop Zone Interface
│
└── ReportView (when showReport)
    ├── Container
    │   ├── Header
    │   │   ├── Title (gradient text)
    │   │   └── DateTime
    │   │
    │   ├── Tabs
    │   │   ├── Current Report
    │   │   ├── Month 1-4
    │   │   ├── 2024 Account
    │   │   ├── 2025 Account
    │   │   ├── 2025 Month Wise
    │   │   └── 2025 Not Collected
    │   │
    │   ├── Table (one of):
    │   │   ├── StandardTable
    │   │   │   ├── Header Row
    │   │   │   ├── Data Rows
    │   │   │   └── Total Row
    │   │   │
    │   │   ├── MonthlyTable
    │   │   │   ├── Month Headers
    │   │   │   ├── Sub-headers
    │   │   │   ├── Data Rows
    │   │   │   └── Total Row
    │   │   │
    │   │   └── NotCollectedTable
    │   │       ├── Month Headers
    │   │       ├── Data Rows
    │   │       └── Total Row
    │   │
    │   └── ActionButtons
    │       ├── Save as Image
    │       ├── Download Excel
    │       └── Upload Another File
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE                           │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              UploadView Component                    │  │
│  │  • Drag & Drop Zone                                 │  │
│  │  • File Input                                       │  │
│  │  • Error Display                                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              ReportView Component                    │  │
│  │  • Header (Title, DateTime)                         │  │
│  │  • Tabs (Navigation)                                │  │
│  │  • Tables (StandardTable, MonthlyTable, etc.)       │  │
│  │  • ActionButtons (Save, Export, Upload)             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  STATE MANAGEMENT                           │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  useReportData Hook                                 │  │
│  │  • reportData (parsed Excel data)                   │  │
│  │  • showReport (boolean)                             │  │
│  │  • error (error message)                            │  │
│  │  • handleFileUpload (function)                      │  │
│  │  • handleReset (function)                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  useReportTabs Hook                                 │  │
│  │  • tabs (array of tab configs)                      │  │
│  │  • activeTab (current tab ID)                       │  │
│  │  • setActiveTab (function)                          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                  BUSINESS LOGIC                             │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  reportService.js                                   │  │
│  │  • getTableData(data, activeTab)                    │  │
│  │  • formatDateTime()                                 │  │
│  │  • calculateTotals(data)                            │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  exportService.js                                   │  │
│  │  • exportAsImage(containerRef)                      │  │
│  │  • exportAsExcel(data)                              │  │
│  │  • addCurrentReportSheet(wb, data)                  │  │
│  │  • addMonthlyReportSheets(wb, data)                 │  │
│  │  • addYearlyReportSheets(wb, data)                  │  │
│  │  • add2025MonthWiseSheet(wb, data)                  │  │
│  │  • add2025NotCollectedSheet(wb, data)               │  │
│  └──────────────────────────────────────────────────────┘  │
│                         ↓                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  dataParser.js                                      │  │
│  │  • parseExcelData(rows)                             │  │
│  │  • getMonthName(dateValue)                          │  │
│  │  • getMonthKey(dateValue)                           │  │
│  │  • getYear(dateValue)                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                               │
│                                                             │
│  • Excel File Parsing                                      │
│  • Date Conversion                                         │
│  • Data Aggregation                                        │
│  • Calculations                                            │
└─────────────────────────────────────────────────────────────┘
```

## File Responsibilities

### Components

| File | Responsibility |
|------|-----------------|
| `UploadView.jsx` | Display file upload interface |
| `ReportView.jsx` | Orchestrate report display |
| `Header.jsx` | Display title and datetime |
| `Tabs.jsx` | Display and manage tab navigation |
| `Container.jsx` | Wrap content in styled container |
| `StandardTable.jsx` | Render basic plaza-wise table |
| `MonthlyTable.jsx` | Render multi-column monthly table |
| `NotCollectedTable.jsx` | Render not-collected quantities table |
| `ActionButtons.jsx` | Display action buttons |

### Hooks

| File | Responsibility |
|------|-----------------|
| `useReportData.js` | Manage file upload and data state |
| `useReportTabs.js` | Manage tab state and configuration |

### Services

| File | Responsibility |
|------|-----------------|
| `reportService.js` | Report data retrieval and formatting |
| `exportService.js` | Excel and image export functionality |
| `dataParser.js` | Excel parsing and date handling |

## CSS Organization

```
Global Styles
├── index.css              # Base styles, fonts, colors
└── App.css                # App-level styles

Component Styles
├── components/
│   ├── Buttons/
│   │   └── ActionButtons.css
│   ├── Layout/
│   │   ├── Header.css
│   │   ├── Tabs.css
│   │   └── Container.css
│   ├── Tables/
│   │   └── Table.css      # Shared by all table types
│   ├── Report/
│   │   └── (no CSS)
│   └── Upload/
│       └── UploadView.css
```

## Import Patterns

### Component Imports
```javascript
// From components
import Header from '../Layout/Header'
import StandardTable from '../Tables/StandardTable'
import ActionButtons from '../Buttons/ActionButtons'

// From hooks
import { useReportData } from '../../hooks/useReportData'
import { useReportTabs } from '../../hooks/useReportTabs'

// From services
import { getTableData } from '../../services/reportService'
import { exportAsImage } from '../../services/exportService'
```

### Service Imports
```javascript
// Services import from other services
import { parseExcelData } from '../utils/dataParser'

// Services import external libraries
import * as XLSX from 'xlsx'
import html2canvas from 'html2canvas'
```

## Naming Conventions

### Components
- PascalCase: `StandardTable.jsx`, `ActionButtons.jsx`
- Descriptive names: `ReportView`, `UploadView`
- Suffix with component type: `Header`, `Tabs`, `Table`

### Hooks
- Prefix with `use`: `useReportData`, `useReportTabs`
- Describe what they manage: `useReportData`, `useReportTabs`

### Services
- Descriptive names: `reportService`, `exportService`, `dataParser`
- Suffix with `Service` or `Parser`: `reportService.js`, `dataParser.js`

### Functions
- camelCase: `getTableData()`, `calculateTotals()`, `exportAsImage()`
- Verb-first: `get`, `calculate`, `export`, `parse`

### CSS Classes
- kebab-case: `.report-table`, `.btn-container`, `.drop-zone`
- Descriptive: `.table-wrapper`, `.month-header`, `.percent-cell`

## Dependency Graph

```
App.jsx
├── UploadView.jsx
│   └── (no dependencies)
│
└── ReportView.jsx
    ├── Header.jsx
    ├── Tabs.jsx
    ├── Container.jsx
    ├── StandardTable.jsx
    ├── MonthlyTable.jsx
    ├── NotCollectedTable.jsx
    ├── ActionButtons.jsx
    │   └── exportService.js
    │       └── dataParser.js
    ├── useReportData.js
    │   └── dataParser.js
    ├── useReportTabs.js
    └── reportService.js
        └── (no dependencies)
```

## Quick Navigation

**Need to modify...**

| What | Where |
|------|-------|
| Button styles | `components/Buttons/ActionButtons.css` |
| Tab colors | `components/Layout/Tabs.css` |
| Table layout | `components/Tables/Table.css` |
| Export logic | `services/exportService.js` |
| Date parsing | `services/dataParser.js` |
| Report calculations | `services/reportService.js` |
| File upload | `hooks/useReportData.js` |
| Tab management | `hooks/useReportTabs.js` |
| Upload interface | `components/Upload/UploadView.jsx` |
| Report display | `components/Report/ReportView.jsx` |

This structure makes it easy to find and modify code!
