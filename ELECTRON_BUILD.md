# Electron App Build Instructions

This guide explains how to build installable Electron applications for Mac and Windows.

## Prerequisites

1. **Node.js** (v16 or higher recommended)
2. **npm** (comes with Node.js)
3. **For Mac builds**: macOS (can build for both Intel and Apple Silicon)
4. **For Windows builds**: Windows or use a Mac with Wine (not recommended) or CI/CD

## Installation

Install dependencies:

```bash
npm install
```

This will install:
- Electron (runtime)
- electron-builder (build tool)
- Express and migration library

## Development

Run the Electron app in development mode:

```bash
npm run electron:dev
```

This opens the app with DevTools enabled.

Run without DevTools:

```bash
npm run electron
```

## Building Installers

### Build for Current Platform

```bash
npm run build
```

This builds for your current platform:
- macOS → Creates `.dmg` and `.zip` files
- Windows → Creates `.exe` installer and portable version

### Build for Specific Platforms

**macOS only:**
```bash
npm run build:mac
```

**Windows only:**
```bash
npm run build:win
```

**Both platforms:**
```bash
npm run build:all
```

### Output Location

All built installers are placed in the `dist/` directory:
- macOS: `dist/Node-RED Dashboard Converter-1.0.0.dmg`
- Windows: `dist/Node-RED Dashboard Converter Setup 1.0.0.exe`

## Icons (Optional)

Icons are optional but recommended for a professional look.

### Quick Setup

1. Create a 512x512 PNG icon
2. Place it in `build/icon.png`
3. For production builds, create platform-specific icons:
   - `build/icon.icns` for macOS
   - `build/icon.ico` for Windows

See `build/README.md` for detailed icon creation instructions.

### Generate Placeholder Icon

```bash
./build-icon-placeholder.sh
```

## Build Targets

### macOS
- **DMG**: Disk image installer (recommended)
- **ZIP**: Archive with the app bundle

### Windows
- **NSIS**: Full installer with options
- **Portable**: Standalone executable (no installation)

## Cross-Platform Building

### Building Windows on macOS

While possible, it's not recommended. Better options:

1. **Use GitHub Actions** (recommended)
   - Set up CI/CD to build on Windows runners
   - See `.github/workflows/build.yml` (if created)

2. **Use a Windows VM**
   - Most reliable option
   - Build directly on Windows

3. **Use Wine** (not recommended)
   - Can be unreliable
   - May produce non-functional installers

### Building macOS on Windows

Not possible - macOS builds require macOS. Options:

1. **Use GitHub Actions** with macOS runners
2. **Use a Mac** (physical or VM)
3. **Use cloud Mac services** (MacStadium, etc.)

## Troubleshooting

### Build Fails

1. **Clear cache:**
   ```bash
   rm -rf node_modules dist
   npm install
   ```

2. **Check Electron version compatibility:**
   - Ensure Node.js version is compatible with Electron version
   - Check electron-builder version

3. **Check icon paths:**
   - If icons are missing, the build will still work but with default icons
   - Verify icon files exist if you've specified them

### App Won't Start

1. **Check server port:**
   - The app uses a random port to avoid conflicts
   - Check console output for the port number

2. **Check dependencies:**
   ```bash
   npm install
   ```

3. **Run in dev mode:**
   ```bash
   npm run electron:dev
   ```
   Check DevTools console for errors

### Code Signing (macOS)

For distribution outside the Mac App Store, you may want to code sign:

1. Get an Apple Developer certificate
2. Add to `package.json`:
   ```json
   "mac": {
     "identity": "Developer ID Application: Your Name"
   }
   ```

### Notarization (macOS)

Required for macOS 10.15+:

1. Set up App Store Connect API key
2. Add to `package.json`:
   ```json
   "mac": {
     "hardenedRuntime": true,
     "gatekeeperAssess": false,
     "entitlements": "build/entitlements.mac.plist"
   }
   ```

## Distribution

### macOS Distribution

1. **DMG file**: Share the `.dmg` file
   - Users double-click to mount
   - Drag app to Applications folder

2. **ZIP file**: Share the `.zip` file
   - Users extract and run the `.app` bundle
   - May need to right-click → Open (first time)

### Windows Distribution

1. **NSIS Installer**: Share the `.exe` file
   - Users run installer
   - Follows standard Windows installation process

2. **Portable**: Share the `.exe` portable file
   - Users can run directly
   - No installation required

## Updating Version

To release a new version:

1. Update version in `package.json`
2. Create a new git tag:
   ```bash
   git tag -a v1.0.1 -m "Release v1.0.1"
   ```
3. Build installers:
   ```bash
   npm run build:all
   ```
4. Upload to GitHub Releases

## File Structure

```
nodered-conv/
├── electron/
│   └── main.js          # Electron main process
├── public/
│   └── index.html       # Web interface
├── build/               # Build assets (icons, etc.)
├── dist/               # Output directory (builds)
├── server.js          # Express server (used by Electron)
└── package.json        # Build configuration
```

## Additional Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [electron-builder Documentation](https://www.electron.build/)
- [macOS Code Signing](https://developer.apple.com/support/code-signing/)
- [Windows Code Signing](https://docs.microsoft.com/en-us/windows/win32/application-signing)

