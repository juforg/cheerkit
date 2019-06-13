<template>
    <div id="wrapper">
      <main>
        <img class="" style="" :src="cheerUrl" :width="imgwidth" :height="imgheight">
      </main>
  </div>
</template>
<script>
import path from 'path'
import { ipcRenderer } from 'electron'
var log = require('electron-log')
export default {
  name: 'cheer-page',
  data () {
    return {
      cheerUrl: '',
      imgwidth: 700,
      imgheight: 390
    }
  },
  created: function () {
    log.info('created')
    ipcRenderer.on('change-res', (event, url, w, h) => {
      log.info('change-res---------' + url, w, h)
      if (url) {
        this.cheerUrl = url
        this.imgwidth = w - 1
        this.imgheight = h - 1
      }
    })
  },
  mounted () {
    log.info('mounted')
  },
  methods: {
    open (link) {
      this.$electron.shell.openExternal(link)
    }
  },
  beforeDestroy () {

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