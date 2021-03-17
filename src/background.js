'use strict'

import { app, protocol, ipcMain, BrowserWindow, globalShortcut } from 'electron'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import {initTray} from './main/tray'
import {createMainWin} from './main/mainWindow'
import {initSchedule, cheerNow, stopSchedule} from './main/scheduleCheer'
// import startOnBoot from './main/startOnBoot'
// 自动更新相关
import { autoUpdater } from "electron-updater"
import logger from "electron-log"
import electronDebug from "electron-debug"
import path from "path"

const isDevelopment = process.env.NODE_ENV !== 'production'
// electronDebug()

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

const settings = require('electron-settings')

let win
let cheerWin
let myTray

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
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })
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
  if (BrowserWindow.getAllWindows().length === 0) win = createMainWin()
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
      installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  win = createMainWin()
  //2. 初始化托盘
  myTray = initTray(win)
  //3. 初始化默认鼓励周期
  let r = initSchedule(1)

  //鼓励一下！
  // cheerNow()
  //4. 注册快捷键listener
  globalShortcut.register('CmdOrCtrl+Shift+C',()=>{
    ipcMain.emit('start-cheer')
  })
  logger.info("app ready")
  if (process.env.NODE_ENV === 'production') {
    autoUpdater.logger = logger
    autoUpdater.logger.transports.file.level = 'info'
    autoUpdater.checkForUpdatesAndNotify()
    // autoUpdater.checkForUpdates()
  }
})

app.setLoginItemSettings({
  // openAtLogin: true, //开机启动
  openAsHidden: true
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
 渲染现场和主线程通信
 */
ipcMain.on('open-main-window', () => {
  if (!win) {
    win = createMainWin()
  }

  win.show()
  win.focus()
})
ipcMain.on('start-schedule', (event, arg) => {
  logger.info(' start-schedule ' + arg)
  initSchedule(arg)
  event.reply('start-schedule-replay', 'success')
})

ipcMain.on('stop-schedule', (event, arg) => {
  logger.info(' stop-schedule ' + arg)
  stopSchedule()
  event.reply('stop-schedule-replay', 'success')
})

ipcMain.on('start-cheer', (event, arg) => {
  logger.info(' start-cheer ')
  cheerNow();
})
ipcMain.on('cheerWin-ready', (event, arg) => {
  logger.info(' cheerWin-ready ')
  event.sender.send('close-cheer-win', 'success')
})

/**
 * 自动启动
 */
