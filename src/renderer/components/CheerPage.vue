<template>
    <div id="wrapper">
      <main>
        <img class="" style="" :src="cheerUrl" :width="imgwidth" :height="imgheight">
      </main>
  </div>
</template>
<script>
import Asset from '../../main/asset.js'
import path from 'path'
import { ipcRenderer, remote } from 'electron'
import { centerWindow } from 'electron-util'
const settings = require('electron-settings')
var log = require('electron-log')
export default {
  name: 'cheer-page',
  data () {
    return {
      cheerUrl: path.join('static', 'a', 'l1', 'a_l1_gif_字符画-kis.gif'),
      intervalId: 0,
      imgwidth: 549,
      imgheight: 510
    }
  },
  created: function () {
    console.log('cheerurl:')
    const that = this
    // ipcRenderer.on('changeCheerPeriod', (event, val) => {
    //   log.info('event: ' + event + val)
    //   log.info('this.intervalId: ', this.intervalId)
    //   that.createSchedule(val)
    // })
    settings.watch('conf.cheerPeriod', (newValue, oldValue) => {
      log.info(newValue)
      if (newValue !== oldValue) {
        if (this.intervalId) {
          clearInterval(this.intervalId)
        }
        this.createSchedule(newValue)
      }
    })
    this.randomRes()
    log.info('conf.cheerPeriod', settings.get('conf.cheerPeriod', 2))
    that.createSchedule(settings.get('conf.cheerPeriod', 2))
  },
  mounted () {
    log.info('mounted')
  },
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    },
    startCheer () {
      log.info('show' + Date.now())
      this.randomRes()
      remote.app.show()
      remote.getCurrentWindow().restore()
      if (process.platform === 'darwin') {

      } else if (process.platform === 'win32') {
      }
      setTimeout(() => {
        log.info('hide' + Date.now())
        remote.app.hide()
        remote.getCurrentWindow().minimize()
      }, 3000)
    },
    cheerFinish () {
      remote.app.hide()
      remote.getCurrentWindow().minimize()
    },
    randomRes () {
      var cheerLevel = settings.get('conf.cheerLevel', 'l1')
      var targetsexSubs = settings.get('conf.targetsexSubs')
      var sexs = []
      for (var key in targetsexSubs) {
        if (targetsexSubs[key] === 'y') {
          sexs.push(key)
        }
      }
      log.info(sexs)
      var relurl = Asset.getResourcesUri(sexs, cheerLevel)
      this.cheerUrl = path.join('static', relurl)
      log.info('cheerurl:' + this.cheerUrl)

      this.imgwidth = 549
      this.imgheight = 510
      // remote.getCurrentWindow().moveto
      // remote.getCurrentWindow().setBounds({ width: 549, height: 510 })
      // centerWindow({ window: remote.getCurrentWindow(), size: { width: this.imgwidth + 10, height: this.imgheight + 10 }})
      remote.getCurrentWindow().setSize(this.imgwidth + 15, this.imgheight + 15)
      // remote.getCurrentWebContents.webContents.reload()
      // ipcRenderer.sendSync('reload-res', this.imgwidth, this.imgwidth)
      ipcRenderer.sendSync('synchronous-message', this.imgwidth, this.imgheight) // prints "pong"
      ipcRenderer.on('asynchronous-reply', (event, arg) => {
        log.info(arg) // prints "pong"
      })
      // ipcRenderer.send('asynchronous-message', 'ping')
      log.info('image size :' + this.imgwidth + '|' + this.imgheight)
    },
    createSchedule (cheerPeriod) {
      var time = cheerPeriod * 10000 //* 3600
      log.info('cheerPeriod :' + cheerPeriod)
      this.intervalId = setInterval(() => {
        this.startCheer()
      }, time)
      log.info('createSchedule ..', cheerPeriod)
      // centerWindow()
    }
  },
  beforeDestroy () {
    clearInterval(this.intervalId)
  }
}
</script>
<style>
  /* #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  } */
</style>