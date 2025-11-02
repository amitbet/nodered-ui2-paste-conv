# Node-RED Dashboard v1 to v2 Converter

A web-based tool for converting Node-RED Dashboard v1 UI components to Dashboard v2 format. This project uses the official [node-red-dashboard-2-migration](https://github.com/FlowFuse/node-red-dashboard-2-migration) library to handle the conversion.

Available as:
- 🌐 **Web application** (run locally)
- 💻 **Electron desktop app** (Mac & Windows installers)

## Features

- 🎨 Modern web interface
- 📋 Copy-paste conversion (automatic on paste)
- ✨ Real-time JSON validation
- 📤 One-click copy to clipboard
- 📱 Responsive design
- 💻 Standalone desktop application (Electron)

## Supported Nodes

The converter supports the following Node-RED Dashboard v1 to v2 migrations:

### UI Nodes
- `ui_text` → `ui-text`
- `ui_form` → `ui-form`
- `ui_button` → `ui-button`
- `ui_dropdown` → `ui-dropdown`
- `ui_switch` → `ui-switch` (some properties not supported)
- `ui_slider` → `ui-slider`
- `ui_text_input` → `ui-text-input` (some properties not supported)
- `ui_numeric` → `ui-numeric-input`

### Config Nodes
- `ui_tab` → `ui-page`
- `ui_group` → `ui-group`

### Auto-added Nodes
- `ui-base` - Created automatically (not in Dashboard v1 exports)
- `ui-theme` - Created automatically (not in Dashboard v1 exports)

## Installation

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

## Usage

### Option 1: Desktop App (Electron) - Recommended

**Download the installer:**
- macOS: Download `.dmg` file from releases
- Windows: Download `.exe` installer from releases

**Or build from source:**
```bash
npm install
npm run build        # Build for your platform
npm run build:all     # Build for both Mac and Windows
```

See `ELECTRON_BUILD.md` for detailed build instructions.

### Option 2: Web Application

**On macOS/Linux:**
```bash
./run.sh
```

**On Windows:**
```cmd
run.bat
```

Or double-click `run.bat` in Windows Explorer.

This will automatically:
- Check and install dependencies if needed
- Start the server on port 3000 (or the port specified in `PORT` environment variable)
- Display the URL to access the web interface

### Alternative: Manual Start

1. Install dependencies (if not already installed):

```bash
npm install
```

2. Start the server:

```bash
npm start
```

Or with a custom port:

**On macOS/Linux:**
```bash
PORT=8080 npm start
```

**On Windows:**
```cmd
set PORT=8080 && npm start
```

3. Open your browser and navigate to:

```
http://localhost:3000
```

3. Paste your Dashboard v1 flow JSON in the input field
4. Click "Convert to v2" button
5. Copy the converted JSON from the output field
6. Import the converted JSON into your Node-RED instance

## API Endpoint

You can also use the conversion API directly:

```bash
POST /api/convert
Content-Type: application/json

{
  "nodes": [...],
  "flows": [...]
}
```

Response:
```json
{
  "success": true,
  "data": {
    "nodes": [...],
    "flows": [...]
  }
}
```

## Limitations

Some nodes and properties are not yet supported:
- `ui_date_picker`
- `ui_colour_picker`
- `ui_gauge`
- `ui_chart`
- `ui_audio`
- `ui_toast`
- `ui_control`
- `ui_template`

Additionally, some properties may not be fully migrated:
- `ui_switch`: `.tooltip`, `.decouple`, `.animate` are not supported
- `ui_text_input`: `.tooltip` is not supported

## Port Configuration

By default, the server runs on port 3000. You can change this by setting the `PORT` environment variable:

```bash
PORT=8080 npm start
```

## Technologies Used

- **Node.js** - Runtime environment
- **Express** - Web server framework
- **node-red-dashboard-2-migration** - Conversion library

## License

MIT

## Credits

This project uses the [node-red-dashboard-2-migration](https://github.com/FlowFuse/node-red-dashboard-2-migration) library developed by FlowFuse.

