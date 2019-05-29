'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'

import tray from './tray'
import path from 'path'
import { ebtMain } from 'electron-baidu-tongji'
import analytics from './analyticsProvider'
import * as util from 'electron-util'
import { autoUpdater } from 'electron-updater'
import Asset from './asset.js'
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
  // require('devtron').install()
  // const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer')
  // installExtension(VUEJS_DEVTOOLS)
}

ebtMain(ipcMain)

const log = require('electron-log')

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

const settings = require('electron-settings')
// const storage = require('electron-json-storage')
// const Store = require('electron-store')
// const store = new Store()

const gotTheLock = app.requestSingleInstanceLock()
if (!gotTheLock) {
  log.info('gotTheLock:{}', gotTheLock)
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    log.info('second-instance')
    // 当运行第二个实例时,将会聚焦到myWindow这个窗口
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })
}

function createWindow (w, h) {
  /**
   * Initial window options
   */

  mainWindow = new BrowserWindow({
    // alwaysOnTop: true, // 窗口是否永远在别的窗口的上面
    height: h,
    center: true,
    useContentSize: true,
    width: w,
    title: '程序员鼓励师',
    resizable: false,
    // backgroundColor: '#eee',
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
    log.debug('ready-to-show')
    mainWindow.show()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
app.setLoginItemSettings({
  openAtLogin: true,
  openAsHidden: true
})
app.on('ready', () => {
  analytics.setEvent('main', 'start', 'starttime', Date.now())
  // createWindow()
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
  if (intervalId) {
    clearInterval(intervalId)
  }
  createSchedule(settings.get('conf.cheerPeriod', 2))
  if (process.env.NODE_ENV === 'production') {
    autoUpdater.logger = log
    autoUpdater.logger.transports.file.level = 'info'
    autoUpdater.checkForUpdatesAndNotify()
    autoUpdater.checkForUpdates()
  }
})

ipcMain.on('asynchronous-message', (event, arg) => {
  log.info(' 2 ' + arg)
  event.sender.send('asynchronous-reply', 'rep pong')
})
ipcMain.on('synchronous-message', (event, arg1, arg2) => {
  log.info('1 ' + arg1 + arg2)
  event.returnValue = 'pong'
})
ipcMain.on('change-cheer-period', (event, ...args) => {
  log.info('change-cheer-period: %s , %s', args[0], args[1])
  var key = args[0]
  var newValue = args[1]
  var oldValue = settings.get(key)
  if (newValue !== oldValue) {
    if (intervalId) {
      log.debug('clearInterval: %s', intervalId)
      clearInterval(intervalId)
    }
    createSchedule(newValue)
    settings.set('conf.cheerPeriod', newValue)
    log.info('recreate schedule ,intervalId: %s', intervalId)
  }
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  analytics.setEvent('main', 'quit', 'quittime', Date.now())
})

app.on('activate', () => {
  log.info('activated')
  setTimeout(() => {
    log.info('hide %s', Date.now())
    if (process.platform !== 'darwin') {
      app.hide()
    }
    mainWindow.hide()
    // mainWindow.minimize()
  }, 3000)
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

var cheerUrl = path.join('static', 'all', 'l2', 'a_l2_gif_字符画-kis_714X400.gif')
var intervalId = 0

function startCheer () {
  var duration = randomRes()
  log.info('[%s]show   %s', mainWindow.id, Date.now())
  if (process.platform !== 'darwin') {
    app.show()
  }
  mainWindow.restore()
  mainWindow.flashFrame(true)
  if (process.platform === 'darwin') {

  } else if (process.platform === 'win32') {

  }

  setTimeout(hideapp, duration)
  log.info('[%s]start cheer ,duration : %s', mainWindow.id, duration)
}
function hideapp () {
  log.info('[%s]hide app %s', mainWindow.id, Date.now())
  if (process.platform !== 'darwin') {
    app.hide()
  }
  mainWindow.hide()
  // mainWindow.minimize()
}

function randomRes () {
  var cheerLevel = settings.get('conf.cheerLevel', 'l1')
  var targetsexSubs = settings.get('conf.targetsexSubs')
  var duration = 3000
  var sexs = []
  for (var key in targetsexSubs) {
    if (targetsexSubs[key] === 'y') {
      sexs.push(key)
    }
  }
  log.info('conf.targetsexSubs: %s ,%s', targetsexSubs, sexs)
  var relurl = Asset.getResourcesUri(sexs, cheerLevel)
  if (relurl) {
    cheerUrl = path.join('static', relurl)
    log.info('cheerurl: %s', cheerUrl)
    var si = Asset.getImgSize(relurl)
    if (si.duration) {
      duration = si.duration
    }

    if (mainWindow == null) {
      createWindow(si.width, si.height)
    }
    mainWindow.setSize(si.width + 15, si.height + 15)
    mainWindow.center()
    log.info('image size : %s | %s', si.width, si.height)
    // log.info('image size :' + imgwidth + '|' + imgheight)
    mainWindow.webContents.send('change-res', cheerUrl, si.width, si.height)
    // mainWindow.webContents.reload()
  }
  analytics.setEvent('main', 'cheerup', 'cheerpage', relurl)
  return duration
}
function createSchedule (cheerPeriod) {
  var time = cheerPeriod * 1000 * 360
  if (process.env.NODE_ENV === 'development') {
    time = cheerPeriod * 10000
  }
  log.info('cheerPeriod :%s', time)
  intervalId = setInterval(() => {
    startCheer()
  }, time)
  log.info('createSchedule ..%s intervalId id: %s', time, intervalId)
}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

autoUpdater.on('update-downloaded', () => {
  log.info('update-downloaded')
  autoUpdater.quitAndInstall()
})
