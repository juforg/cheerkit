/* eslint-disable eqeqeq */
/**
 * @author juforg
 * @blog https://blog.appcity.vip
 */

'use strict'

import { Menu, Tray, shell, app, nativeImage, ipcMain, nativeTheme } from 'electron'
import i18n from '../plugins/i18n'
import path from 'path'
import { autoUpdater } from "electron-updater"
import settings from 'electron-settings'
import logger from "electron-log"
const isDev = process.env.NODE_ENV !== 'production'

let tray = null
const DEFAULT_CHEER_PERIOD = 2 // 默认鼓励周期
const DEFAULT_CHEER_LEVEL = 'l1' // 默认鼓励级别

function changeCheerLevel (menuItem, browserWindow, event, val) {
  logger.info('changeCheerLevel click', menuItem.label)
  // browserWindow.webContents.send('changeCheerLevel', val)
  settings.setSync('conf.cheerLevel', val)
}
function changeCheerPeriod (menuItem, browserWindow, event, val) {
  logger.info('changeCheerPeriod click %s %s', menuItem.label, val)
  ipcMain.emit('start-schedule', val)
  settings.setSync('conf.cheerPeriod', val)
}
let conf = settings.getSync('conf')
logger.info("saved conf: %s", JSON.stringify(conf))
let savedTargetSexAll = conf.targetSexSubs.all || 'y'
let savedTargetSexMale = conf.targetSexSubs.male || 'n'
let savedTargetSexFemale = conf.targetSexSubs.female || 'n'
let savedCheerPeriod = conf.cheerPeriod || DEFAULT_CHEER_PERIOD
let savedCheerLevel = conf.cheerLevel || DEFAULT_CHEER_LEVEL
let savedOpenAtLogin = conf.openAtLogin || true

const tpl = [
  {
    label: app.getName(),
    type: 'normal',
    click: (menuItem, browserWindow, event) => {
      logger.info('click', menuItem.label)
      ipcMain.emit('open-main-window')
    }
  },
  {
    label: app.getVersion(),
    type: 'normal',
    enabled: false
  },
  {
    label: i18n.t('tray.cheerNow'),
    type: 'normal',
    accelerator: 'CmdOrCtrl+Shift+C',
    click: (menuItem, browserWindow, event) => {
      logger.info('click', menuItem.label)
      ipcMain.emit('start-cheer')
    }
  },
  {
    label: i18n.t('tray.openAtLogin'),
    type: 'checkbox',
    checked: !!savedOpenAtLogin,
    click: (menuItem, browserWindow, event) => {
      logger.info('click', menuItem.label)
      ipcMain.emit('autoStart', event, !!menuItem.checked)
      settings.setSync('conf.openAtLogin', !!menuItem.checked)
    }
  },
  { type: 'separator' },
  {
    label: i18n.t('tray.targetSex'),
    type: 'submenu',
    submenu: [
      {
        id: 'targetSexSubs.all',
        label: i18n.t('tray.targetSexSubs.all'),
        type: 'checkbox',
        checked: savedTargetSexAll === 'y',
        accelerator: 'A',
        registerAccelerator: false,
        click: (menuItem, browserWindow, event) => {
          logger.info('click', menuItem.label)
          settings.setSync('conf.targetSexSubs.all', menuItem.checked ? 'y' : 'n')
        }
      },
      {
        label: i18n.t('tray.targetSexSubs.male'),
        type: 'checkbox',
        checked: savedTargetSexMale === 'y',
        accelerator: 'M',
        registerAccelerator: false,
        click: (menuItem, browserWindow, event) => {
          logger.info('click', menuItem.label)
          settings.setSync('conf.targetSexSubs.male', menuItem.checked ? 'y' : 'n')
        }
      },
      {
        label: i18n.t('tray.targetSexSubs.female'),
        type: 'checkbox',
        checked: savedTargetSexFemale === 'y',
        accelerator: 'F',
        registerAccelerator: false,
        click: (menuItem, browserWindow, event) => {
          logger.info('click', menuItem.label)
          settings.setSync('conf.targetSexSubs.female', menuItem.checked ? 'y' : 'n')
        }
      }
    ]
  },
  { type: 'separator' },
  {
    label: i18n.t('tray.cheerPeriod'),
    type: 'submenu',
    submenu: [
      {
        label: i18n.t('tray.cheerPeriodSubs.hour1'),
        type: 'radio',
        checked: savedCheerPeriod === 1,
        click: (menuItem, browserWindow, event) => {
          changeCheerPeriod(menuItem, browserWindow, event, 1)
        }
      },
      {
        label: i18n.t('tray.cheerPeriodSubs.hour2'),
        type: 'radio',
        checked: savedCheerPeriod === 2,
        click: (menuItem, browserWindow, event) => {
          changeCheerPeriod(menuItem, browserWindow, event, 2)
        }
      },
      {
        label: i18n.t('tray.cheerPeriodSubs.hour4'),
        type: 'radio',
        checked: savedCheerPeriod === 4,
        click: (menuItem, browserWindow, event) => {
          changeCheerPeriod(menuItem, browserWindow, event, 4)
        }
      },{
        label: i18n.t('tray.cheerPeriodSubs.hour6'),
        type: 'radio',
        checked: savedCheerPeriod === 6,
        click: (menuItem, browserWindow, event) => {
          changeCheerPeriod(menuItem, browserWindow, event, 6)
        }
      },
      {
        label: i18n.t('tray.cheerPeriodSubs.hour8'),
        type: 'radio',
        checked: savedCheerPeriod === 8,
        click: (menuItem, browserWindow, event) => {
          changeCheerPeriod(menuItem, browserWindow, event, 8)
        }
      }
    ]
  },
  { type: 'separator' },
  {
    label: i18n.t('tray.cheerLevel'),
    type: 'submenu',
    submenu: [
      {
        label: i18n.t('tray.cheerLevelSubs.l1'),
        type: 'radio',
        checked: savedCheerLevel === 'l1',
        click: (menuItem, browserWindow, event) => {
          changeCheerLevel(menuItem, browserWindow, event, 'l1')
        }
      },
      {
        label: i18n.t('tray.cheerLevelSubs.l2'),
        type: 'radio',
        checked: savedCheerLevel === 'l2',
        click: (menuItem, browserWindow, event) => {
          changeCheerLevel(menuItem, browserWindow, event, 'l2')
        }
      },
      {
        label: i18n.t('tray.cheerLevelSubs.l3'),
        type: 'radio',
        checked: savedCheerLevel === 'l3',
        click: (menuItem, browserWindow, event) => {
          changeCheerLevel(menuItem, browserWindow, event, 'l3')
        }
      },
      {
        label: i18n.t('tray.cheerLevelSubs.l4'),
        type: 'radio',
        checked: savedCheerLevel === 'l4',
        click: (menuItem, browserWindow, event) => {
          changeCheerLevel(menuItem, browserWindow, event, 'l4')
        }
      }
    ]
  },
  { type: 'separator' },
  {
    label: i18n.t('feedback'),
    type: 'normal',
    click: () => {
      shell.openExternal('https://github.com/juforg/cheerkit/issues')
    }
  },
  {
    label: i18n.t('checkUpdate'),
    type: 'normal',
    click: () => {
      // checkUpdate.check()
      autoUpdater.checkForUpdatesAndNotify()
      console.log('click', 'checkUpdate.check()')
      logger.info('click', 'checkUpdate.check()')
    }
  },
  { type: 'separator' },
  {
    label: i18n.t('quit'),
    type: 'normal',
    accelerator: 'CommandOrControl+Q',
    click: () => {
      app.quit()
    }
  }
]

export const initTray = (win) => {
  let contextMenu = Menu.buildFromTemplate(tpl)
  let icon
  let iconPath

  icon = 'icon.png'
  if (process.platform === 'darwin') {
    icon = 'icon.png'
    if (nativeTheme.shouldUseDarkColors) {
      icon = 'icon-dark.png'
    }
  }else if (process.platform === 'win32') {
    icon = 'icon.ico'
  }
  if(isDev){
    iconPath = path.join(__static, 'img', 'icons', icon)
  }else{
    iconPath = path.join(__static, 'img', 'icons', icon)
  }
  if (settings.has('conf.lang')) {
    i18n.locale = settings.getSync('conf.lang')
  }
  logger.info("icon path ", iconPath)
  tray = new Tray(nativeImage.createFromPath(iconPath))
  // 设置此托盘图标的悬停提示内容
  tray.setToolTip(app.getName())
  // 设置此图标的上下文菜单
  tray.setContextMenu(contextMenu)
  // 双击 托盘图标 打开窗口
  tray.on('double-click',event => {
    win.show()
  })
  logger.info("tray init finished ！ ")
  return tray
}
