import Vue from 'vue'
import Router from 'vue-router'
import CheerPage from '../views/CheerPage'
import Settings from '../views/Settings'

Vue.use(Router)

export default new Router({
  base: process.env.BASE_URL,
  mode: process.env.IS_ELECTRON ? 'hash' : 'history',
  routes: [
    {
      path: '/cheer',
      name: 'cheer',
      component: CheerPage
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    },
    {
      path: '*',
      redirect: '/settings'
    },
  ]
})
