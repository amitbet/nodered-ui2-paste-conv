# Release v1.0.0

## Node-RED Dashboard v1 to v2 Converter

A web-based tool for converting Node-RED Dashboard v1 UI components to Dashboard v2 format.

## Features

- 🎨 Modern web interface with automatic conversion
- 📋 Copy-paste conversion - just paste your JSON and it converts automatically
- ✨ Real-time JSON validation
- 📤 One-click copy to clipboard
- 📱 Responsive design
- 🚀 Easy to run - includes run scripts for all platforms

## Quick Start

### Option 1: Using the run script (Recommended)

**macOS/Linux:**
```bash
./run.sh
```

**Windows:**
```cmd
run.bat
```

### Option 2: Manual installation

```bash
npm install
npm start
```

Then open your browser to `http://localhost:3000`

## Supported Nodes

- `ui_text` → `ui-text`
- `ui_form` → `ui-form`
- `ui_button` → `ui-button`
- `ui_dropdown` → `ui-dropdown`
- `ui_switch` → `ui-switch`
- `ui_slider` → `ui-slider`
- `ui_text_input` → `ui-text-input`
- `ui_numeric` → `ui-numeric-input`
- `ui_tab` → `ui-page`
- `ui_group` → `ui-group`

## Requirements

- Node.js (v14 or higher recommended)
- npm (comes with Node.js)

## Installation

1. Download and extract this release
2. Open terminal/command prompt in the extracted folder
3. Run the appropriate script for your platform (see Quick Start above)

## Usage

1. Start the server using one of the methods above
2. Open `http://localhost:3000` in your browser
3. Paste your Dashboard v1 JSON in the input field
4. The conversion happens automatically!
5. Copy the converted JSON from the output field
6. Import into your Node-RED instance

## API

The converter also exposes a REST API endpoint:

```
POST /api/convert
Content-Type: application/json

{
  "nodes": [...]
}
```

## Technical Details

- Built with Node.js and Express
- Uses the official [node-red-dashboard-2-migration](https://github.com/FlowFuse/node-red-dashboard-2-migration) library
- Port can be configured via `PORT` environment variable (default: 3000)

## License

MIT

