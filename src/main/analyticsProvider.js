/**
 * @author juforg
 * @blog https://blog.appcity.vip
 */

import { app } from 'electron'
import Analytics from 'electron-google-analytics'
import { machineIdSync } from 'node-machine-id'

const settings = require('electron-settings')
const electron = require('electron')
const appName = app.getName()
const appVersion = app.getVersion()
const appID = 'vip.appcity.cheerkit'
const appInstallerID = 'vip.appcity.cheerkit'
const clientId = machineIdSync()
var language = ''
var sr = ''
// const userAgent = typeof (window) === 'undefined' ? prepareUserAgent(window.navigator.userAgent, appName) : 'electron agent'

const analytics = new Analytics('UA-81118574-2')

// analytics.set('vp', getViewport())
function prepareUserAgent (userAgent, appName) {
  userAgent.replace(new RegExp(`${appName}\\/\\d+\\.\\d+\\.\\d+ `), '').replace(/Electron\/\d+\.\d+\.\d+ /, '')
}

function getScreenResolution () {
  const screen = electron.screen.getPrimaryDisplay()
  return `${screen.size.width}x${screen.size.height}`
}

function getViewport () {
  return `${window.innerWidth}x${window.innerHeight}`
}

function check () {
  if (!language) {
    language = settings.get('conf.lang')
    analytics.set('ul', language)
  }
  if (!sr) {
    sr = getScreenResolution()
    analytics.set('sr', sr)
  }
}
function setAnalyticsEvent (evtype, action, label, value) {
  check()
  analytics.event(evtype, action, { evLabel: label, evValue: value, clientID: clientId })
}

function setAnalyticsScreen (screenName) {
  check()
  analytics.screen(appName, appVersion, appID, appInstallerID, screenName, clientId)
}
export default {
  setEvent () {
    setAnalyticsEvent()
  },
  setScreen () {
    setAnalyticsScreen()
  }
}
