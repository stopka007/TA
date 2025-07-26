# Hierarchy Table

A React application that displays hierarchical data in an interactive table format.

## Features

- **Hierarchical Data Display**: Renders nested JSON data in a structured table
- **Expandable/Collapsible Rows**: Click to expand or collapse rows with children
- **Remove Functionality**: Delete items and their nested children
- **Dark Theme**: Modern dark color scheme with teal accents
- **Responsive Design**: Works on different screen sizes

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Usage

- **Expand Rows**: Click the ▶ button next to rows that have children
- **Collapse Rows**: Click the ▼ button to collapse expanded sections
- **Remove Items**: Click the red ✕ button to delete items and their children

## Data Structure

The application expects JSON data in the following format:
```json
[
  {
    "data": {
      "ID": "44",
      "Name": "Trillian",
      "Gender": "female"
    },
    "children": {
      "has_nemesis": {
        "records": [
          {
            "data": { /* child data */ },
            "children": { /* nested children */ }
          }
        ]
      }
    }
  }
]
```
