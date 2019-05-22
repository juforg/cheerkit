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
    height: 400,
    center: true,
    useContentSize: true,
    width: 714,
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
  startCheer()
  // if (process.env.NODE_ENV === 'production') {
  autoUpdater.logger = log
  autoUpdater.logger.transports.file.level = 'info'
  autoUpdater.checkForUpdatesAndNotify()
  // autoUpdater.checkForUpdates()
  // }
})

ipcMain.on('asynchronous-message', (event, arg) => {
  log.info(' 2 ' + arg)
  event.sender.send('asynchronous-reply', 'rep pong')
})
ipcMain.on('synchronous-message', (event, arg1, arg2) => {
  log.info('1 ' + arg1 + arg2)
  event.returnValue = 'pong'
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
  analytics.setEvent('main', 'quit', 'quittime', Date.now())
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
    randomRes()
    log.info('conf.cheerPeriod', settings.get('conf.cheerPeriod', 2))
  }
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
var imgwidth = 714
var imgheight = 400

function startCheer () {
  log.info('show' + Date.now())
  var duration = randomRes()
  app.show()
  mainWindow.restore()
  if (process.platform === 'darwin') {

  } else if (process.platform === 'win32') {
  }

  setTimeout(() => {
    log.info('hide' + Date.now())
    app.hide()
    mainWindow.minimize()
  }, duration)
  log.info('start cheer ,duration :%s', duration)
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
  var relurl = Asset.getResourcesUri(sexs, cheerLevel)
  if (relurl) {
    cheerUrl = path.join('static', relurl)
    log.info('cheerurl:' + cheerUrl)
    var si = Asset.getImgSize(relurl)
    // log.info('si:' + si[0])
    imgwidth = si[0]
    imgheight = si[1]
    if (si.length > 2) {
      duration = Number(si[2]) * 10000
    }
    mainWindow.setSize(Number(imgwidth) + 15, Number(imgheight) + 15)
    mainWindow.center()
    // log.info('image size :' + imgwidth + '|' + imgheight)
    mainWindow.webContents.send('change-res', cheerUrl, imgwidth, imgheight)
    // mainWindow.webContents.reload()
  }
  analytics.setEvent('main', 'cheerup', 'cheerpage', relurl)
  return duration
}
function createSchedule (cheerPeriod) {
  var time = cheerPeriod * 10000 * 3600
  if (process.env.NODE_ENV === 'development') {
    time = cheerPeriod * 10000
  }
  log.info('cheerPeriod :' + cheerPeriod)
  intervalId = setInterval(() => {
    startCheer()
  }, time)
  log.info('createSchedule ..%s intervalId id: %s', cheerPeriod, intervalId)
  // centerWindow()
}

settings.watch('conf.cheerPeriod', (newValue, oldValue) => {
  if (newValue !== oldValue) {
    if (intervalId) {
      clearInterval(intervalId)
    }
    createSchedule(newValue)
  }
})

createSchedule(settings.get('conf.cheerPeriod', 2))

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
