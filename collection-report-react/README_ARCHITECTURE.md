# Architecture Refactor - Complete Overview

## What Changed

The React application has been completely restructured from a monolithic component approach to a clean, layered architecture that's highly readable and maintainable.

## Before vs After

### Before
```
src/
├── components/
│   ├── DropZone.jsx
│   ├── ReportContainer.jsx
│   ├── ReportHeader.jsx
│   ├── ReportTabs.jsx
│   ├── ReportTable.jsx
│   └── ActionButtons.jsx
├── utils/
│   └── dataParser.js
└── App.jsx
```

**Issues:**
- All components at same level
- Mixed concerns (UI + logic)
- Hard to find related code
- Difficult to scale

### After
```
src/
├── components/
│   ├── Buttons/
│   │   ├── ActionButtons.jsx
│   │   └── ActionButtons.css
│   ├── Layout/
│   │   ├── Header.jsx
│   │   ├── Tabs.jsx
│   │   ├── Container.jsx
│   │   └── (CSS files)
│   ├── Tables/
│   │   ├── StandardTable.jsx
│   │   ├── MonthlyTable.jsx
│   │   ├── NotCollectedTable.jsx
│   │   └── Table.css
│   ├── Report/
│   │   └── ReportView.jsx
│   └── Upload/
│       ├── UploadView.jsx
│       └── UploadView.css
├── hooks/
│   ├── useReportData.js
│   └── useReportTabs.js
├── services/
│   ├── reportService.js
│   ├── exportService.js
│   └── dataParser.js
├── App.jsx
└── (CSS files)
```

**Benefits:**
- Clear separation of concerns
- Easy to locate related code
- Scalable structure
- Better code reusability
- Improved testability

## Architecture Principles

### 1. **Separation of Concerns**
- **Components**: Only handle UI rendering
- **Services**: Handle business logic
- **Hooks**: Manage state and side effects
- **Utils**: Pure functions for data transformation

### 2. **Feature-Based Organization**
Components grouped by feature/domain:
- `Buttons/` - All button-related components
- `Layout/` - Page structure components
- `Tables/` - All table variations
- `Report/` - Report orchestration
- `Upload/` - File upload interface

### 3. **Single Responsibility**
Each component/service has one clear purpose:
- `StandardTable.jsx` - Renders standard table only
- `reportService.js` - Handles report data logic only
- `exportService.js` - Handles export logic only

### 4. **Reusability**
- Services are framework-agnostic (can be used in Vue, Angular, etc.)
- Components are composable and can be reused
- Hooks encapsulate state logic

## Layer Breakdown

### Presentation Layer (`components/`)
**Responsibility**: Render UI and handle user interactions

**Components**:
- `UploadView`: File upload interface
- `ReportView`: Main report orchestrator
- `Header`: Report title and date
- `Tabs`: Tab navigation
- `StandardTable`: Basic table
- `MonthlyTable`: Multi-column table
- `NotCollectedTable`: Filtered table
- `ActionButtons`: Export and upload buttons
- `Container`: Layout wrapper

**Key Principle**: Components are "dumb" - they receive data via props and call callbacks for actions.

### Business Logic Layer (`services/`)
**Responsibility**: Handle all business logic, data transformation, and external operations

**Services**:
- `reportService.js`: Report data retrieval and formatting
- `exportService.js`: Excel and image export
- `dataParser.js`: Excel file parsing and date handling

**Key Principle**: Pure functions with no React dependencies. Can be tested independently.

### State Management Layer (`hooks/`)
**Responsibility**: Manage component state and side effects

**Hooks**:
- `useReportData`: File upload, parsing, error handling
- `useReportTabs`: Tab state and configuration

**Key Principle**: Encapsulate state logic in reusable hooks.

### Entry Point (`App.jsx`)
**Responsibility**: Route between views and manage top-level state

**Key Principle**: Minimal logic, mostly orchestration.

## Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interaction                         │
│              (Upload file, Click tab, Export)               │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Presentation Layer (Components)                │
│  UploadView → ReportView → Tables → ActionButtons          │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│           State Management Layer (Hooks)                    │
│  useReportData (file upload) → useReportTabs (tab state)   │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│          Business Logic Layer (Services)                    │
│  reportService → exportService → dataParser                │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              Data Layer (Utils)                             │
│  Excel parsing, date conversion, calculations              │
└─────────────────────────────────────────────────────────────┘
```

## Component Relationships

```
App.jsx
├── UploadView (when !showReport)
│   └── Calls: useReportData.handleFileUpload()
│
└── ReportView (when showReport)
    ├── Header
    ├── Tabs
    ├── Table Component (one of):
    │   ├── StandardTable
    │   ├── MonthlyTable
    │   └── NotCollectedTable
    └── ActionButtons
        ├── Calls: exportService.exportAsImage()
        ├── Calls: exportService.exportAsExcel()
        └── Calls: useReportData.handleReset()
```

## Service Interactions

```
dataParser.js
├── parseExcelData()
│   ├── getMonthKey()
│   ├── getYear()
│   └── getMonthName()
└── Used by: useReportData.js

reportService.js
├── getTableData()
├── formatDateTime()
├── calculateTotals()
└── Used by: ReportView.jsx

exportService.js
├── exportAsImage()
├── exportAsExcel()
├── addCurrentReportSheet()
├── addMonthlyReportSheets()
├── addYearlyReportSheets()
├── add2025MonthWiseSheet()
└── add2025NotCollectedSheet()
└── Used by: ActionButtons.jsx
```

## Readability Improvements

### 1. **Clear File Organization**
Finding code is now intuitive:
- Need to modify buttons? → `components/Buttons/`
- Need to change export logic? → `services/exportService.js`
- Need to manage tab state? → `hooks/useReportTabs.js`

### 2. **Focused Components**
Each component has a single, clear purpose:
```javascript
// Before: ReportTable.jsx (200+ lines, multiple concerns)
// After: StandardTable.jsx (50 lines, one concern)
```

### 3. **Extracted Business Logic**
Services contain all business logic, making components cleaner:
```javascript
// Before: Logic mixed in component
// After: Logic in service, component just calls it
const tableData = getTableData(data, activeTab)
```

### 4. **Reusable Hooks**
State logic is encapsulated and reusable:
```javascript
const { reportData, showReport, error, handleFileUpload, handleReset } = useReportData()
```

### 5. **Clear Dependencies**
Each file clearly shows what it depends on:
```javascript
import { getTableData } from '../../services/reportService'
import StandardTable from '../Tables/StandardTable'
```

## Scalability

### Adding New Features

**New Report Type**:
1. Create table component in `components/Tables/`
2. Add logic to `services/reportService.js`
3. Update `hooks/useReportTabs.js` with new tab
4. Update `services/exportService.js` for export

**New Export Format**:
1. Add function to `services/exportService.js`
2. Add button to `components/Buttons/ActionButtons.jsx`
3. Done!

**New Data Source**:
1. Create parser in `services/`
2. Update `hooks/useReportData.js` to use it
3. Rest of app remains unchanged

## Testing

With this architecture, testing becomes straightforward:

```javascript
// Test service (no React needed)
import { getTableData } from '../services/reportService'
test('getTableData returns correct data', () => {
  const result = getTableData(mockData, 'current')
  expect(result.title).toBe('Current Report')
})

// Test component (isolated)
import StandardTable from '../components/Tables/StandardTable'
test('StandardTable renders rows', () => {
  render(<StandardTable data={mockData} />)
  expect(screen.getByText('Plaza Name')).toBeInTheDocument()
})

// Test hook (isolated)
import { useReportData } from '../hooks/useReportData'
test('useReportData handles file upload', () => {
  // Test hook logic
})
```

## Performance Considerations

1. **Lazy Rendering**: Tables only render when active
2. **Service Memoization**: Consider caching parsed data
3. **Component Memoization**: Use `React.memo()` for expensive components
4. **Code Splitting**: Services can be lazy-loaded

## Migration Path

If you have existing code:

1. **Phase 1**: Create new structure alongside old code
2. **Phase 2**: Gradually move components to new structure
3. **Phase 3**: Update imports in App.jsx
4. **Phase 4**: Remove old code

## Best Practices

### ✅ Do
- Keep components focused and small
- Put business logic in services
- Use hooks for state management
- Organize by feature/domain
- Write pure functions in services
- Use descriptive names

### ❌ Don't
- Mix UI and business logic
- Create deeply nested component trees
- Put all code in one file
- Use unclear abbreviations
- Create circular dependencies
- Ignore separation of concerns

## Documentation Files

- **ARCHITECTURE.md**: Detailed architecture documentation
- **QUICK_START.md**: Quick reference guide
- **README_ARCHITECTURE.md**: This file

## Conclusion

This refactored architecture provides:
- ✅ **Readability**: Easy to understand and navigate
- ✅ **Maintainability**: Easy to modify and extend
- ✅ **Scalability**: Easy to add new features
- ✅ **Testability**: Easy to test components and services
- ✅ **Reusability**: Services and hooks can be reused
- ✅ **Performance**: Optimized rendering and data flow

The codebase is now production-ready and easy for teams to work with!
