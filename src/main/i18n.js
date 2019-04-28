/**
 * @author juforg
 * @blog https://blog.appcity.vip
 */
import Vue from 'vue'
import VueI18n from 'vue-i18n'

import * as enUS from '../i18n/en-US'
import * as zhCN from '../i18n/zh-CN'

const settings = require('electron-settings')
const lang = settings.get('conf.lang')

Vue.use(VueI18n)

export default new VueI18n({
  locale: lang,
  messages: {
    'en-US': enUS.appMenu,
    'zh-CN': zhCN.appMenu
    // 'zh-TW': zhTW.appMenu,
  }
  // silentTranslationWarn: process.env.NODE_ENV === 'production'
})
