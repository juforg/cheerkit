import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'cheer-page',
      component: require('@/components/CheerPage').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
