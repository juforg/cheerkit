'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'

import tray from './tray'
import path from 'path'
import { ebtMain } from 'electron-baidu-tongji'
import analytics from './analyticsProvider'
import * as util from 'electron-util'
import { autoUpdater } from 'electron-updater'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

ebtMain(ipcMain)

var log = require('electron-log')

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const settings = require('electron-settings')
var shouldQuit = app.makeSingleInstance(function (commandLine, workingDirectory) {
  // Someone tried to run a second instance, we should focus our window.
  // 当运行第二个实例时,将会聚焦到myWindow这个窗口
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore()
    mainWindow.focus()
  }
  log.warn('not allowed second instance!')
})

if (shouldQuit) {
  app.quit()
}
function createWindow () {
  /**
   * Initial window options
   */

  mainWindow = new BrowserWindow({
    // alwaysOnTop: true, // 窗口是否永远在别的窗口的上面
    height: 563,
    center: true,
    useContentSize: true,
    width: 1000,
    title: '程序员鼓励师',
    resizable: false,
    // backgroundColor: '#eee',
    // autoHideMenuBar: true,
    show: false,
    maximizable: false,
    minimizable: false,
    autoHideMenuBar: true,
    // skipTaskbar: true,
    transparent: true,
    // opacity: 0,
    titleBarStyle: 'customButtonsOnHover', // hiddenInset customButtonsOnHover
    // fullscreenable: true,
    frame: false
    // icon: path.join(__static, 'icon.png')
  })

  mainWindow.loadURL(winURL)
  // app.setName('程序员鼓励师')
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  analytics.setEvent('main', 'start', 'starttime', Date.now())
}
app.setLoginItemSettings({
  openAtLogin: true,
  openAsHidden: true
})
app.on('ready', () => {
  createWindow()
  if (util.isFirstAppLaunch()) {
    initSetting()
  }
  if (process.platform === 'darwin') {
    // app.dock.setIcon(path.join(__static, 'icons', 'icon.png'))
    // app.dock.setBadge(app.getName())
    app.dock.hide()
    util.enforceMacOSAppLocation()
  } else
  if (process.platform === 'win32') {
    app.setAppUserModelId('vip.appcity.cheerkit')
  }
  tray.init()

  if (process.env.NODE_ENV === 'production') {
    autoUpdater.logger = log
    autoUpdater.logger.transports.file.level = 'info'
    // autoUpdater.checkForUpdatesAndNotify()
    autoUpdater.checkForUpdates()
  }
})

// ipcMain.on('reload_res', (event, arg) => {
//   log.info('reload_res: ' + arg) //
//   // event.sender.send('asynchronous-reply', 'pong')
// })
ipcMain.on('asynchronous-message', (event, arg) => {
  log.info(' 2 ' + arg) // prints "ping"
  event.sender.send('asynchronous-reply', 'rep pong')
})
ipcMain.on('synchronous-message', (event, arg1, arg2) => {
  log.info('1 ' + arg1 + arg2) // prints "ping"
  // mainWindow.center()
  // mainWindow.moveToTop()
  // util.centerWindow({ window: mainWindow, size: { width: 549, height: 510 }})
  // mainWindow.setSize(arg1, arg2)
  // mainWindow.webContents.reload()
  event.returnValue = 'pong'
})

function initSetting () {
  settings.set('conf', {
    targetsexSubs: { all: 'y',
      male: 'n',
      female: 'n',
      favorite: 'n'
    },
    cheerPeriod: '2',
    cheerLevel: 'l1',
    isFullScreen: 'n',
    lang: app.getLocale()
  })
}
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  analytics.setEvent('main', 'quit', 'quittime', Date.now())
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})
