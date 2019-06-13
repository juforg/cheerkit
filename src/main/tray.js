/* eslint-disable eqeqeq */
/**
 * @author juforg
 * @blog https://blog.appcity.vip
 */

'use strict'

import { Menu, Tray, shell, app, nativeImage, ipcMain } from 'electron'
import i18n from './i18n'
import path from 'path'

const settings = require('electron-settings')
var log = require('electron-log')

let tray = null
const DEFAULT_CHEER_PERIOD = '2' // 默认鼓励周期
const DEFAULT_CHEER_LEVEL = 'l1' // 默认鼓励级别

function changeCheerLevel (menuItem, browserWindow, event, val) {
  log.info('changeCheerLevel click', menuItem.label)
  // browserWindow.webContents.send('changeCheerLevel', val)
  settings.set('conf.cheerLevel', val)
}
function changeCheerPeriod (menuItem, browserWindow, event, val) {
  log.info('changeCheerPeriod click %s', menuItem.label)
  ipcMain.emit('change-cheer-period', 'conf.cheerPeriod', 'conf.cheerPeriod', val)
  settings.set('conf.cheerPeriod', val)
}

const initTray = () => {
  const contextMenu = Menu.buildFromTemplate(
    [
      {
        label: app.getName(),
        type: 'normal',
        role: 'about'
      },
      {
        label: app.getVersion(),
        type: 'normal',
        enabled: false
      },
      {
        label: i18n.t('tray.openAtLogin'),
        type: 'checkbox',
        checked: settings.get('conf.openAtLogin', 'y') === 'y',
        click: (menuItem, browserWindow, event) => {
          log.info('click', menuItem.label)
          ipcMain.emit('autoStart', 'conf.openAtLogin', menuItem.checked ? 'y' : 'n')
          settings.set('conf.openAtLogin', menuItem.checked ? 'y' : 'n')
        }
      },
      { type: 'separator' },
      {
        label: i18n.t('tray.targetsex'),
        type: 'submenu',
        submenu: [
          {
            id: 'targetsexSubs.all',
            label: i18n.t('tray.targetsexSubs.all'),
            type: 'checkbox',
            checked: settings.get('conf.targetsexSubs.all', 'y') === 'y',
            accelerator: 'A',
            registerAccelerator: false,
            click: (menuItem, browserWindow, event) => {
              log.info('click', menuItem.label)
              settings.set('conf.targetsexSubs.all', menuItem.checked ? 'y' : 'n')
            }
          },
          {
            label: i18n.t('tray.targetsexSubs.male'),
            type: 'checkbox',
            checked: settings.get('conf.targetsexSubs.male', 'n') === 'y',
            accelerator: 'M',
            registerAccelerator: false,
            click: (menuItem, browserWindow, event) => {
              log.info('click', menuItem.label)
              settings.set('conf.targetsexSubs.male', menuItem.checked ? 'y' : 'n')
            }
          },
          {
            label: i18n.t('tray.targetsexSubs.female'),
            type: 'checkbox',
            checked: settings.get('conf.targetsexSubs.female', 'n') === 'y',
            accelerator: 'F',
            registerAccelerator: false,
            click: (menuItem, browserWindow, event) => {
              log.info('click', menuItem.label)
              settings.set('conf.targetsexSubs.female', menuItem.checked ? 'y' : 'n')
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
            checked: settings.get('conf.cheerPeriod', DEFAULT_CHEER_PERIOD) == '1',
            click: (menuItem, browserWindow, event) => {
              changeCheerPeriod(menuItem, browserWindow, event, 1)
            }
          },
          {
            label: i18n.t('tray.cheerPeriodSubs.hour2'),
            type: 'radio',
            checked: settings.get('conf.cheerPeriod', DEFAULT_CHEER_PERIOD) == '2',
            click: (menuItem, browserWindow, event) => {
              changeCheerPeriod(menuItem, browserWindow, event, 2)
            }
          },
          {
            label: i18n.t('tray.cheerPeriodSubs.hour4'),
            type: 'radio',
            checked: settings.get('conf.cheerPeriod', DEFAULT_CHEER_PERIOD) == '4',
            click: (menuItem, browserWindow, event) => {
              changeCheerPeriod(menuItem, browserWindow, event, 4)
            }
          },
          {
            label: i18n.t('tray.cheerPeriodSubs.hour8'),
            type: 'radio',
            checked: settings.get('conf.cheerPeriod', DEFAULT_CHEER_PERIOD) == '8',
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
            checked: settings.get('conf.cheerLevel', DEFAULT_CHEER_LEVEL) === 'l1',
            click: (menuItem, browserWindow, event) => {
              changeCheerLevel(menuItem, browserWindow, event, 'l1')
            }
          },
          {
            label: i18n.t('tray.cheerLevelSubs.l2'),
            type: 'radio',
            checked: settings.get('conf.cheerLevel', DEFAULT_CHEER_LEVEL) === 'l2',
            click: (menuItem, browserWindow, event) => {
              changeCheerLevel(menuItem, browserWindow, event, 'l2')
            }
          },
          {
            label: i18n.t('tray.cheerLevelSubs.l3'),
            type: 'radio',
            checked: settings.get('conf.cheerLevel', DEFAULT_CHEER_LEVEL) === 'l3',
            click: (menuItem, browserWindow, event) => {
              changeCheerLevel(menuItem, browserWindow, event, 'l3')
            }
          },
          {
            label: i18n.t('tray.cheerLevelSubs.l4'),
            type: 'radio',
            checked: settings.get('conf.cheerLevel', DEFAULT_CHEER_LEVEL) === 'l4',
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
          console.log('click', 'checkUpdate.check()')
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
  )

  tray.setContextMenu(contextMenu)
}

function createTray () {
  let icon = 'icon.png'
  if (process.platform === 'darwin') {
    icon = 'iconTemplate.png'
  }
  if (settings.has('conf.lang')) {
    i18n.locale = settings.get('conf.lang')
  }
  tray = new Tray(nativeImage.createFromPath(path.join(__static, 'icons', icon)))
  tray.setToolTip(app.getName())
  initTray()
}

export default {
  init () {
    createTray()
  }
}
