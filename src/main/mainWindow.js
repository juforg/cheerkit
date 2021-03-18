import {BrowserWindow, ipcMain} from 'electron'
import path from "path"
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import logger from "electron-log"

export const createMainWin = () => {
  // Create the browser window.
  let win = new BrowserWindow({
    title: '程序员鼓励师',
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
    icon: path.join(__static,'img', 'icons', process.platform === 'win32' ? 'icon.ico': 'icon.png')
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
  win.on('closed', (event) => {
    logger.info('main win closed!')
    ipcMain.emit('close-main-window')
  })
  return win
}