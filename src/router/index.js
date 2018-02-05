import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Home from '@/components/HelloFromVux'
import EssayPanel from '@/components/EssayPanel'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/helloWord',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/essayList',
      component: EssayPanel
    }
  ]
})
