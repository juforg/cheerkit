'use strict'

import { app, protocol, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import {mytray} from './main/tray'
// import startOnBoot from './main/startOnBoot'

const isDevelopment = process.env.NODE_ENV !== 'production'
// 自动更新相关
import { autoUpdater } from "electron-updater"
import logger from "electron-log"
import electronDebug from "electron-debug"
import path from "path"
electronDebug()

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

const settings = require('electron-settings')

let win
let winTray

/**
 * 单一实例
 */
const gotTheLock = app.requestSingleInstanceLock()
logger.info('gotTheLock: %s', gotTheLock)
if (!gotTheLock) {
  logger.info('gotTheLock: %s  quit', gotTheLock)
  app.quit()
} else {
  app.on('second-instance', (event, argv, workingDirectory) => {
    logger.info('second-instance')
    // 当运行第二个实例时,将会聚焦到myWindow这个窗口
    if (win) {
      if (!win.isVisible()) {
        win.show()
      }
      win.focus()
      if (win.isMinimized()) win.restore()
    }
  })
}

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    },
    // 固定宽高
    resizable: true,
    // 边框隐藏
    frame: true,
    icon: path.join(__static,'img', 'icons', 'icon.png')
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
  return win
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Disable security warnings
    process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = true
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  win = createWindow()
  //托盘
  winTray = mytray(win)
  logger.info("app ready")
  if (process.env.NODE_ENV === 'production') {
    autoUpdater.logger = logger
    autoUpdater.logger.transports.file.level = 'info'
    autoUpdater.checkForUpdatesAndNotify()
    // autoUpdater.checkForUpdates()
  }
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}

/**
 * 自动启动
 */
