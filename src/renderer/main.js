import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import { ipcRenderer } from 'electron'
import { ebtRenderer } from 'electron-baidu-tongji'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

// 替换为你自己的 百度统计 siteId
const BAIDU_SITE_ID = 'b64f76697b918186ff13614afa18ce95'
// 百度统计
ebtRenderer(ipcRenderer, BAIDU_SITE_ID, router)
/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
