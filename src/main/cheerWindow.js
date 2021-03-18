import {BrowserWindow, ipcRenderer} from 'electron'
import path from "path"
import {createProtocol} from 'vue-cli-plugin-electron-builder/lib'
import logger from "electron-log"

export const createCheerWin = async (w=800, h=600) => {
  // Create the browser window.
  let win = new BrowserWindow({
    // title: '程序员鼓励师',
    width: w,
    height: h,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
    },
    // 固定宽高
    resizable: true,
    //透明窗口
    transparent: true,
    // 边框隐藏
    frame: false,
    icon: path.join(__static,'img', 'icons', process.platform === 'win32' ? 'icon.ico': 'icon.png')
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL+ '/#/cheer')
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    await win.loadURL('app://./index.html/#/cheer')
  }
  win.on('closed', () => {
    win = null
    logger.info('closed cheer win!')
  })
  // 为了防止闪烁，让画面准备好了再显示
  // 对于一个复杂的应用，ready-to-show 可能发出的太晚，会让应用感觉缓慢。 在这种情况下，建议立刻显示窗口，并使用接近应用程序背景的 backgroundColor
  // 请注意，即使是使用 ready-to-show 事件的应用程序，仍建议使用设置 backgroundColor 使应用程序感觉更原生。
  win.once('ready-to-show', () => {
    logger.info('cheer win ready-to-show!')
    // win.show()
    ipcRenderer.send("cheerWin-ready")
  })
  return win
}
