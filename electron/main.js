const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const express = require('express');
const MigrateDashboard = require('@flowfuse/node-red-dashboard-2-migration');

let mainWindow;
let server;
let serverPort = 0; // 0 means use a random available port

// Start Express server
function startServer() {
  const expressApp = express();
  
  // Middleware
  expressApp.use(express.json({ limit: '10mb' }));
  expressApp.use(express.static(path.join(__dirname, '../public')));

  // Conversion endpoint
  expressApp.post('/api/convert', (req, res) => {
    try {
      const dashboardV1Json = req.body;
      
      if (!dashboardV1Json) {
        return res.status(400).json({ 
          error: 'No JSON data provided' 
        });
      }

      // Handle different input formats:
      // 1. Array of nodes (direct flow array)
      // 2. Object with 'nodes' property (Node-RED export format)
      let flowArray;
      if (Array.isArray(dashboardV1Json)) {
        flowArray = dashboardV1Json;
      } else if (dashboardV1Json.nodes && Array.isArray(dashboardV1Json.nodes)) {
        flowArray = dashboardV1Json.nodes;
      } else {
        return res.status(400).json({ 
          error: 'Invalid format. Expected an array of nodes or an object with a "nodes" property.' 
        });
      }

      // Migrate Dashboard v1 to v2
      const dashboardV2Json = MigrateDashboard.migrate(flowArray);
      
      res.json({
        success: true,
        data: dashboardV2Json
      });
    } catch (error) {
      console.error('Conversion error:', error);
      res.status(500).json({ 
        error: 'Error converting the JSON',
        message: error.message 
      });
    }
  });

  // Health check endpoint
  expressApp.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // Start server on random port
  server = expressApp.listen(serverPort, '127.0.0.1', () => {
    serverPort = server.address().port;
    console.log(`Server running at http://127.0.0.1:${serverPort}`);
    
    // Load the window once server is ready
    if (mainWindow) {
      mainWindow.loadURL(`http://127.0.0.1:${serverPort}`);
    }
  });
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#667eea',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false
    },
    // icon: path.join(__dirname, '../build/icon.png') // Optional, will use default if not found
  });

  // Wait for server to be ready before loading
  if (serverPort > 0) {
    mainWindow.loadURL(`http://127.0.0.1:${serverPort}`);
  }

  // Open DevTools in development
  if (process.argv.includes('--dev')) {
    mainWindow.webContents.openDevTools();
  }

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Quit',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo', label: 'Undo' },
        { role: 'redo', label: 'Redo' },
        { type: 'separator' },
        { role: 'cut', label: 'Cut' },
        { role: 'copy', label: 'Copy' },
        { role: 'paste', label: 'Paste' },
        { role: 'selectall', label: 'Select All' }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload', label: 'Reload' },
        { role: 'forceReload', label: 'Force Reload' },
        { role: 'toggleDevTools', label: 'Toggle Developer Tools' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Actual Size' },
        { role: 'zoomIn', label: 'Zoom In' },
        { role: 'zoomOut', label: 'Zoom Out' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Toggle Full Screen' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'About',
          click: () => {
            const { dialog } = require('electron');
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About',
              message: 'Node-RED Dashboard Converter',
              detail: 'Version 1.0.0\n\nA tool for converting Node-RED Dashboard v1 UI components to Dashboard v2 format.'
            });
          }
        }
      ]
    }
  ];

  // macOS specific menu adjustments
  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about', label: 'About ' + app.getName() },
        { type: 'separator' },
        { role: 'services', label: 'Services' },
        { type: 'separator' },
        { role: 'hide', label: 'Hide ' + app.getName() },
        { role: 'hideothers', label: 'Hide Others' },
        { role: 'unhide', label: 'Show All' },
        { type: 'separator' },
        { role: 'quit', label: 'Quit ' + app.getName() }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event handlers
app.whenReady().then(() => {
  startServer();
  createWindow();
  createMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (server) {
    server.close();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (server) {
    server.close();
  }
});

